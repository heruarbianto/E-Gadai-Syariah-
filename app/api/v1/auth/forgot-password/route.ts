import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";

import {
  generateVerificationToken,
  hashVerificationToken,
} from "@/app/lib/security";

import {
  forgotPasswordEmailRateLimit,
} from "@/app/lib/rate-limit";

import { rateLimitResponse } from "@/app/lib/rate-limit-res";
import { getClientIp } from "@/app/lib/req-ip";
import { sendForgotPasswordEmail } from "@/app/lib/email";

/*
 * =========================================================
 * CONFIGURATION
 * =========================================================
 */

export const runtime = "nodejs";

const GENERIC_MESSAGE =
  "Jika akun memenuhi syarat, email berisi tautan penggantian kata sandi akan dikirim.";

const TOKEN_EXPIRY_MS = 15 * 60 * 1000;
const REQUEST_COOLDOWN_MS = 60 * 1000;

/*
 * =========================================================
 * GENERIC RESPONSE
 * =========================================================
 *
 * Respons tidak mengungkapkan apakah email terdaftar.
 */

function genericResponse() {
  return NextResponse.json(
    {
      message: GENERIC_MESSAGE,
    },
    {
      status: 202,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

/*
 * =========================================================
 * EMAIL VALIDATION
 * =========================================================
 */

function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) {
    return false;
  }

  if (/\s/.test(email)) {
    return false;
  }

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  return emailRegex.test(email);
}

/*
 * =========================================================
 * APPLICATION URL VALIDATION
 * =========================================================
 *
 * APP_URL harus berasal dari konfigurasi server.
 * Jangan mengambil domain reset dari input pengguna.
 */

function getApplicationUrl(): string | null {
  const configuredUrl = process.env.APP_URL;

  if (!configuredUrl) {
    return null;
  }

  try {
    const url = new URL(configuredUrl);

    if (
      url.protocol !== "https:" &&
      process.env.NODE_ENV === "production"
    ) {
      return null;
    }

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return null;
    }

    if (url.username || url.password) {
      return null;
    }

    if (url.search || url.hash) {
      return null;
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    return null;
  }
}

/*
 * =========================================================
 * POST /api/auth/forgot-password
 * =========================================================
 */

export async function POST(request: NextRequest) {
  try {
    /*
     * -----------------------------------------------------
     * 1. RATE LIMIT BERDASARKAN IP
     * -----------------------------------------------------
     */

    const ip = getClientIp(request);

    const ipLimit =
      await forgotPasswordEmailRateLimit.limit(ip);

    if (!ipLimit.success) {
      const retryAfter = ipLimit.reset
        ? Math.max(
            1,
            Math.ceil(
              (ipLimit.reset - Date.now()) / 1000,
            ),
          )
        : undefined;

      return rateLimitResponse(retryAfter);
    }

    /*
     * -----------------------------------------------------
     * 2. VALIDASI CONTENT TYPE
     * -----------------------------------------------------
     */

    const contentType = (
      request.headers.get("content-type") ?? ""
    )
      .split(";")[0]
      .trim()
      .toLowerCase();

    if (contentType !== "application/json") {
      return genericResponse();
    }

    /*
     * -----------------------------------------------------
     * 3. PARSE REQUEST BODY
     * -----------------------------------------------------
     */

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return genericResponse();
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return genericResponse();
    }

    const emailValue = (
      body as Record<string, unknown>
    ).email;

    if (typeof emailValue !== "string") {
      return genericResponse();
    }

    const email = emailValue.trim().toLowerCase();

    if (!isValidEmail(email)) {
      return genericResponse();
    }

    /*
     * -----------------------------------------------------
     * 4. RATE LIMIT BERDASARKAN EMAIL
     * -----------------------------------------------------
     *
     * Tetap gunakan respons generik agar tidak membocorkan
     * informasi akun.
     */

    const emailLimit =
      await forgotPasswordEmailRateLimit.limit(email);

    if (!emailLimit.success) {
      return genericResponse();
    }

    /*
     * -----------------------------------------------------
     * 5. VALIDASI APP_URL
     * -----------------------------------------------------
     */

    const appUrl = getApplicationUrl();

    if (!appUrl) {
      console.error(
        "Forgot password: APP_URL belum dikonfigurasi atau tidak valid.",
      );

      return genericResponse();
    }

    /*
     * -----------------------------------------------------
     * 6. CARI AKUN
     * -----------------------------------------------------
     *
     * Hanya akun dengan email terverifikasi dan belum
     * dihapus yang dapat meminta reset kata sandi.
     */

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
        deletedAt: true,
      },
    });

    if (
      !user ||
      !user.email ||
      !user.emailVerifiedAt ||
      user.deletedAt
    ) {
      return genericResponse();
    }

    /*
     * -----------------------------------------------------
     * 7. COOLDOWN 60 DETIK
     * -----------------------------------------------------
     *
     * Hanya token PASSWORD_RESET yang diperiksa.
     * Token EMAIL_VERIFICATION tidak memengaruhi cooldown.
     */

    const latestToken =
      await prisma.emailVerificationToken.findFirst({
        where: {
          userId: user.id,
          type: "PASSWORD_RESET",
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
        },
      });

    if (latestToken) {
      const elapsed =
        Date.now() - latestToken.createdAt.getTime();

      if (elapsed < REQUEST_COOLDOWN_MS) {
        return genericResponse();
      }
    }

    /*
     * -----------------------------------------------------
     * 8. GENERATE TOKEN
     * -----------------------------------------------------
     *
     * Token mentah dikirim melalui email.
     * Database hanya menyimpan hash token.
     */

    const rawToken = generateVerificationToken();

    const tokenHash =
      hashVerificationToken(rawToken);

    const now = new Date();

    const expiresAt = new Date(
      now.getTime() + TOKEN_EXPIRY_MS,
    );

    /*
     * -----------------------------------------------------
     * 9. BENTUK RESET URL
     * -----------------------------------------------------
     */

    const resetUrl =
      `${appUrl}/auth/reset-password` +
      `?token=${encodeURIComponent(rawToken)}`;

    /*
     * -----------------------------------------------------
     * 10. INVALIDASI TOKEN RESET LAMA
     *     DAN BUAT TOKEN BARU
     * -----------------------------------------------------
     *
     * Tidak membatalkan token EMAIL_VERIFICATION.
     */

    const createdToken =
      await prisma.$transaction(async (tx) => {
        await tx.emailVerificationToken.updateMany({
          where: {
            userId: user.id,
            type: "PASSWORD_RESET",
            usedAt: null,
          },
          data: {
            usedAt: now,
          },
        });

        return tx.emailVerificationToken.create({
          data: {
            userId: user.id,
            tokenHash,
            type: "PASSWORD_RESET",
            expiresAt,
          },
          select: {
            id: true,
          },
        });
      });

    /*
     * -----------------------------------------------------
     * 11. KIRIM EMAIL RESET PASSWORD
     * -----------------------------------------------------
     */

    try {
      await sendForgotPasswordEmail({
        email: user.email,
        resetUrl,
      });
    } catch (error) {
      /*
       * Jika email gagal dikirim, nonaktifkan token baru.
       *
       * Jangan mencatat rawToken atau resetUrl ke log.
       */

      console.error(
        "Forgot password: pengiriman email gagal.",
        error instanceof Error
          ? error.message
          : "Unknown email provider error",
      );

      try {
        await prisma.emailVerificationToken.updateMany({
          where: {
            id: createdToken.id,
            userId: user.id,
            type: "PASSWORD_RESET",
            usedAt: null,
          },
          data: {
            usedAt: new Date(),
          },
        });
      } catch (invalidateError) {
        console.error(
          "Forgot password: gagal menonaktifkan token.",
          invalidateError instanceof Error
            ? invalidateError.message
            : "Unknown database error",
        );
      }
    }

    /*
     * -----------------------------------------------------
     * 12. GENERIC RESPONSE
     * -----------------------------------------------------
     */

    return genericResponse();
  } catch (error) {
    /*
     * Error internal tidak dikirim kepada client.
     */

    console.error(
      "Forgot password API error:",
      error instanceof Error
        ? error.message
        : "Unknown internal error",
    );

    return genericResponse();
  }
}