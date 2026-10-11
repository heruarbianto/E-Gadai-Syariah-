import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";

import { prisma } from "@/app/lib/prisma";
import { hashVerificationToken } from "@/app/lib/security";
import { rateLimitResponse } from "@/app/lib/rate-limit-res";
import { getClientIp } from "@/app/lib/req-ip";
import { resetPasswordIpRateLimit } from "@/app/lib/rate-limit";

export const runtime = "nodejs";

const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_LENGTH = 128;
const MAX_BODY_SIZE = 10 * 1024;

const INVALID_TOKEN_MESSAGE =
  "Tautan reset kata sandi tidak valid, sudah digunakan, atau telah kedaluwarsa. Silakan minta tautan baru.";

const GENERIC_ERROR_MESSAGE =
  "Kata sandi belum berhasil diperbarui. Silakan coba kembali.";

class InvalidResetTokenError extends Error {
  constructor() {
    super("Invalid or already-used reset token");
    this.name = "InvalidResetTokenError";
  }
}

function jsonResponse(
  message: string,
  status: number,
) {
  return NextResponse.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

function isValidPassword(password: string): boolean {
  return (
    password.length >= MIN_PASSWORD_LENGTH &&
    password.length <= MAX_PASSWORD_LENGTH
  );
}

export async function POST(request: NextRequest) {
  try {
    /*
     * =====================================================
     * 1. RATE LIMIT BERDASARKAN IP
     * =====================================================
     */

    const ip = getClientIp(request);

    const ipLimit =
      await resetPasswordIpRateLimit.limit(ip);

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
     * =====================================================
     * 2. VALIDASI CONTENT TYPE
     * =====================================================
     */

    const contentType = (
      request.headers.get("content-type") ?? ""
    )
      .split(";")[0]
      .trim()
      .toLowerCase();

    if (contentType !== "application/json") {
      return jsonResponse(
        "Format permintaan tidak valid.",
        415,
      );
    }

    /*
     * =====================================================
     * 3. BATASI UKURAN REQUEST
     * =====================================================
     */

    const contentLength = Number(
      request.headers.get("content-length") ?? "0",
    );

    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_BODY_SIZE
    ) {
      return jsonResponse(
        "Ukuran permintaan terlalu besar.",
        413,
      );
    }

    /*
     * =====================================================
     * 4. PARSE BODY
     * =====================================================
     */

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        "Format permintaan tidak valid.",
        400,
      );
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return jsonResponse(
        "Format permintaan tidak valid.",
        400,
      );
    }

    const data = body as Record<string, unknown>;

    const rawToken = data.token;
    const password = data.password;
    const confirmPassword = data.confirmPassword;

    /*
     * =====================================================
     * 5. VALIDASI FIELD
     * =====================================================
     */

    if (
      typeof rawToken !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return jsonResponse(
        "Token dan kata sandi wajib diisi.",
        400,
      );
    }

    /*
     * Token randomBytes(32).toString("base64url")
     * umumnya memiliki panjang 43 karakter.
     *
     * Batas lebih longgar menjaga kompatibilitas jika
     * format token internal berubah.
     */

    if (
      rawToken.length < 32 ||
      rawToken.length > 256 ||
      !/^[A-Za-z0-9_-]+$/.test(rawToken)
    ) {
      return jsonResponse(
        INVALID_TOKEN_MESSAGE,
        400,
      );
    }

    /*
     * Jangan trim password.
     * Spasi dapat menjadi bagian dari kata sandi.
     */

    if (!isValidPassword(password)) {
      return jsonResponse(
        `Kata sandi harus terdiri dari ${MIN_PASSWORD_LENGTH} sampai ${MAX_PASSWORD_LENGTH} karakter.`,
        400,
      );
    }

    if (password !== confirmPassword) {
      return jsonResponse(
        "Konfirmasi kata sandi tidak cocok.",
        400,
      );
    }

    /*
     * =====================================================
     * 6. HASH TOKEN UNTUK PENCARIAN
     * =====================================================
     *
     * Token mentah tidak pernah dicari atau disimpan
     * langsung di database.
     */

    const tokenHash =
      hashVerificationToken(rawToken);

    const now = new Date();

    /*
     * =====================================================
     * 7. VALIDASI TOKEN
     * =====================================================
     *
     * Hanya menerima token PASSWORD_RESET yang:
     * - Hash cocok.
     * - Belum digunakan.
     * - Belum kedaluwarsa.
     */

    const tokenRecord =
      await prisma.emailVerificationToken.findFirst({
        where: {
          tokenHash,
          type: "PASSWORD_RESET",
          usedAt: null,
          expiresAt: {
            gt: now,
          },
        },
        select: {
          id: true,
          userId: true,
          expiresAt: true,
          user: {
            select: {
              id: true,
              deletedAt: true,
            },
          },
        },
      });

    if (
      !tokenRecord ||
      tokenRecord.user.deletedAt
    ) {
      return jsonResponse(
        INVALID_TOKEN_MESSAGE,
        400,
      );
    }

    /*
     * =====================================================
     * 8. HASH PASSWORD BARU
     * =====================================================
     *
     * Hashing dilakukan sebelum transaksi database
     * agar operasi transaksi tidak menunggu proses
     * hashing yang relatif mahal.
     */

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });

    /*
     * =====================================================
     * 9. CLAIM TOKEN + UPDATE PASSWORD + CABUT SESI
     * =====================================================
     *
     * Semua operasi berikut berada dalam satu transaksi.
     *
     * updateMany digunakan untuk mengklaim token secara
     * atomik. Hanya permintaan yang berhasil mengubah
     * satu token aktif yang boleh mengganti password.
     *
     * Jika token sudah digunakan oleh permintaan lain,
     * count akan menjadi 0 dan transaksi dibatalkan.
     */

    await prisma.$transaction(async (tx) => {
      const claimedToken =
        await tx.emailVerificationToken.updateMany({
          where: {
            id: tokenRecord.id,
            userId: tokenRecord.userId,
            tokenHash,
            type: "PASSWORD_RESET",
            usedAt: null,
            expiresAt: {
              gt: new Date(),
            },
          },
          data: {
            usedAt: new Date(),
          },
        });

      if (claimedToken.count !== 1) {
        throw new InvalidResetTokenError();
      }

      /*
       * Update kata sandi pengguna.
       */

      await tx.user.update({
        where: {
          id: tokenRecord.userId,
        },
        data: {
          passwordHash,
        },
      });

      /*
       * Invalidasi token reset lain yang masih aktif.
       *
       * Token verifikasi email tidak disentuh.
       */

      await tx.emailVerificationToken.updateMany({
        where: {
          userId: tokenRecord.userId,
          type: "PASSWORD_RESET",
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      /*
       * Cabut seluruh sesi login pengguna.
       *
       * Bagian ini mengasumsikan model Prisma bernama
       * UserSession memiliki kolom userId.
       *
       * Jika nama model atau kolom pada skemamu berbeda,
       * sesuaikan query ini dengan schema.prisma.
       */

      await tx.userSession.deleteMany({
        where: {
          userId: tokenRecord.userId,
        },
      });
    });

    /*
     * =====================================================
     * 10. SUCCESS RESPONSE
     * =====================================================
     */

    return jsonResponse(
      "Kata sandi berhasil diperbarui. Silakan masuk menggunakan kata sandi baru.",
      200,
    );
  } catch (error) {
    /*
     * Token gagal diklaim karena sudah dipakai atau
     * kedaluwarsa ketika transaksi berjalan.
     */

    if (error instanceof InvalidResetTokenError) {
      return jsonResponse(
        INVALID_TOKEN_MESSAGE,
        400,
      );
    }

    /*
     * Jangan pernah mencatat password, token mentah,
     * passwordHash, atau reset URL ke log.
     */

    console.error(
      "Reset password API error:",
      error instanceof Error
        ? error.message
        : "Unknown internal error",
    );

    return jsonResponse(
      GENERIC_ERROR_MESSAGE,
      500,
    );
  }
}