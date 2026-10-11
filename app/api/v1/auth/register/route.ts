import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import {
  hashVerificationToken,
  generateVerificationToken,
  hashPassword,
} from "@/app/lib/security";
import { prisma } from "@/app/lib/prisma";
import { sendVerificationEmail } from "@/app/lib/email";
import { rateLimitResponse } from "@/app/lib/rate-limit-res";
import { registerIpRateLimit } from "@/app/lib/rate-limit";
import { getClientIp } from "@/app/lib/req-ip";
const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Format email tidak valid")
    .max(254),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{9,14}$/, "Format nomor telepon tidak valid"),

  password: z
    .string()
    .min(12, "Password minimal 12 karakter")
    .max(128, "Password maksimal 128 karakter"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    const rateLimit = await registerIpRateLimit.limit(ip);

    if (!rateLimit.success) {
      return rateLimitResponse(
        rateLimit.reset
          ? Math.ceil((rateLimit.reset - Date.now()) / 1000)
          : undefined,
      );
    }
    const body = await request.json();

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Data registrasi tidak valid.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, phone, password } = validation.data;

    /*
     * Cek email / phone dalam satu query.
     */
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
      select: {
        id: true,
        email: true,
        phone: true,
        emailVerifiedAt: true,
        deletedAt: true,
      },
    });

    /*
     * Jangan membocorkan apakah email atau nomor
     * tertentu sudah terdaftar jika endpoint ini
     * digunakan dalam sistem yang membutuhkan
     * proteksi user enumeration.
     */
    if (existingUser && !existingUser.deletedAt) {
      return NextResponse.json(
        {
          message: "Email atau nomor telepon sudah terdaftar.",
        },
        { status: 409 },
      );
    }

    /*
     * Hash password SEBELUM masuk database.
     */
    const passwordHash = await hashPassword(password);

    /*
     * Token mentah hanya berada di memory.
     */
    const rawToken = generateVerificationToken();

    /*
     * Database hanya menyimpan hash token.
     */
    const tokenHash = hashVerificationToken(rawToken);

    /*
     * Masa berlaku token 30 menit.
     */
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    /*
     * Semua operasi database dibuat dalam transaction.
     */
    const user = await prisma.$transaction(async (tx) => {
      /*
       * Jika akun soft-deleted dengan email/phone yang sama,
       * kita bisa memulihkannya atau menangani sesuai business rule.
       *
       * Untuk keamanan dan kesederhanaan di tahap ini,
       * gunakan record baru hanya jika constraint DB
       * mengizinkan email/phone tersebut.
       */

      const createdUser = await tx.user.create({
        data: {
          email,
          phone,
          passwordHash,

          status: "PENDING",

          emailVerifiedAt: null,
          phoneVerifiedAt: null,
        },
        select: {
          id: true,
          email: true,
          phone: true,
          status: true,
          createdAt: true,
        },
      });

      await tx.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash,
          type: "EMAIL_VERIFICATION",
          expiresAt,
        },
      });

      return createdUser;
    });

    /*
     * URL verifikasi jangan dibangun dari Host header
     * karena Host header dapat dimanipulasi.
     */
    const appUrl = process.env.APP_URL;

    if (!appUrl) {
      console.error("APP_URL belum dikonfigurasi.");
      return NextResponse.json(
        {
          message: "Registrasi gagal diproses.",
        },
        { status: 500 },
      );
    }

    const verificationUrl =
      `${appUrl}/auth/email-verification` +
      `?token=${encodeURIComponent(rawToken)}`;

    /*
     * Kirim email setelah transaksi berhasil.
     */
    try {
      await sendVerificationEmail({
        email: user.email!,
        verificationUrl,
      });
    } catch (error) {
      console.error("Gagal mengirim email verifikasi:", error);

      /*
       * User sudah dibuat tetapi email gagal dikirim.
       *
       * Jangan kirim token ke client.
       */
      return NextResponse.json(
        {
          message:
            "Akun berhasil dibuat, tetapi email verifikasi gagal dikirim. Silakan gunakan fitur kirim ulang verifikasi.",
        },
        { status: 202 },
      );
    }

    return NextResponse.json(
      {
        message: "Registrasi berhasil. Silakan verifikasi email Anda.",
        data: {
          userId: user.id,
          status: user.status,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);

    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat melakukan registrasi.",
      },
      { status: 500 },
    );
  }
}
