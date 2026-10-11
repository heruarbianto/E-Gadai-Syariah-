import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyPassword } from "@/app/lib/security";

const SESSION_DURATION_DAYS = 30;

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

function hashSessionToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  if (email.length > 254) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password: string): boolean {
  /*
   * Password tidak boleh dipotong/truncate.
   *
   * Batas 128 karakter cukup untuk login dan mencegah
   * input yang tidak masuk akal.
   */
  return (
    password.length >= 12 &&
    password.length <= 128
  );
}

export async function POST(request: NextRequest) {
  try {
    /*
     * ==========================================================
     * 1. PARSE BODY
     * ==========================================================
     */

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          message: "Format data tidak valid.",
          code: "INVALID_JSON",
        },
        { status: 400 },
      );
    }

    /*
     * Pastikan body berupa object.
     */
    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          message: "Format data tidak valid.",
          code: "INVALID_BODY",
        },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    /*
     * ==========================================================
     * 2. AMBIL INPUT
     * ==========================================================
     */

    const rawEmail = data.email;
    const rawPassword = data.password;

    /*
     * Jangan menerima field dengan tipe yang salah.
     */
    if (
      typeof rawEmail !== "string" ||
      typeof rawPassword !== "string"
    ) {
      return NextResponse.json(
        {
          message: "Email dan password wajib diisi.",
          code: "INVALID_INPUT",
        },
        { status: 400 },
      );
    }

    /*
     * ==========================================================
     * 3. NORMALISASI EMAIL
     * ==========================================================
     */

    const email = normalizeEmail(rawEmail);
    const password = rawPassword;

    /*
     * ==========================================================
     * 4. VALIDASI EMAIL
     * ==========================================================
     */

    if (!email) {
      return NextResponse.json(
        {
          message: "Email wajib diisi.",
          code: "EMAIL_REQUIRED",
        },
        { status: 422 },
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        {
          message: "Format email tidak valid.",
          code: "INVALID_EMAIL",
        },
        { status: 422 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          message: "Format email tidak valid.",
          code: "INVALID_EMAIL",
        },
        { status: 422 },
      );
    }

    /*
     * ==========================================================
     * 5. VALIDASI PASSWORD
     * ==========================================================
     */

    if (!password) {
      return NextResponse.json(
        {
          message: "Password wajib diisi.",
          code: "PASSWORD_REQUIRED",
        },
        { status: 422 },
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          message: "Email atau password salah.",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 },
      );
    }

    /*
     * ==========================================================
     * 6. CARI USER
     * ==========================================================
     *
     * Jangan mengembalikan "email tidak ditemukan".
     *
     * Hal tersebut dapat digunakan untuk email enumeration.
     */

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        emailVerifiedAt: true,
        status: true,
      },
    });

    /*
     * ==========================================================
     * 7. VALIDASI CREDENTIAL
     * ==========================================================
     */

    if (!user) {
      return NextResponse.json(
        {
          message: "Email atau password salah.",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 },
      );
    }

    /*
     * Verifikasi password menggunakan Argon2id.
     *
     * Password plaintext TIDAK disimpan.
     */
    const passwordValid = await verifyPassword(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          message: "Email atau password salah.",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 },
      );
    }

    /*
     * ==========================================================
     * 8. CEK EMAIL SUDAH VERIFIED
     * ==========================================================
     *
     * Credential sudah benar.
     *
     * Kalau email belum diverifikasi, jangan buat session.
     */

    if (!user.emailVerifiedAt) {
      return NextResponse.json(
        {
          message:
            "Email belum diverifikasi. Silakan verifikasi email terlebih dahulu.",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 },
      );
    }

    /*
     * ==========================================================
     * 9. GENERATE SESSION TOKEN
     * ==========================================================
     *
     * Token asli hanya dikirim ke browser melalui cookie.
     *
     * Database hanya menyimpan SHA-256 token.
     */

    const sessionToken = generateSessionToken();
    const sessionTokenHash =
      hashSessionToken(sessionToken);

    const sessionExpiresAt = new Date(
      Date.now() +
        SESSION_DURATION_DAYS *
          24 *
          60 *
          60 *
          1000,
    );

    /*
     * ==========================================================
     * 10. AMBIL INFORMASI REQUEST
     * ==========================================================
     */

    const userAgent =
      request.headers.get("user-agent")?.slice(0, 500) ??
      null;

    /*
     * x-forwarded-for dapat berisi:
     *
     * client, proxy, proxy
     *
     * Ambil alamat pertama.
     *
     * Catatan:
     * nilai ini berasal dari proxy, sehingga jangan digunakan
     * sebagai dasar autentikasi.
     */

    const forwardedFor =
      request.headers.get("x-forwarded-for");

    const ipAddress =
      forwardedFor
        ?.split(",")[0]
        ?.trim()
        ?.slice(0, 100) ??
      request.headers.get("x-real-ip")?.slice(0, 100) ??
      null;

    /*
     * ==========================================================
     * 11. BUAT USER SESSION
     * ==========================================================
     */

    await prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash: sessionTokenHash,
        expiresAt: sessionExpiresAt,
        ipAddress,
        userAgent,
      },
    });

    /*
     * ==========================================================
     * 12. RESPONSE
     * ==========================================================
     */

    const response = NextResponse.json(
      {
        message: "Login berhasil.",
        code: "LOGIN_SUCCESS",
        user: {
          id: user.id,
          email: user.email,
          status: user.status,
        },
      },
      { status: 200 },
    );

    /*
     * ==========================================================
     * 13. SET SESSION COOKIE
     * ==========================================================
     *
     * HttpOnly:
     * JavaScript browser tidak dapat membaca token.
     *
     * Secure:
     * hanya dikirim melalui HTTPS pada production.
     *
     * SameSite:
     * mengurangi risiko CSRF.
     *
     * Path:
     * cookie berlaku untuk seluruh aplikasi.
     */

    response.cookies.set({
      name: "session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: sessionExpiresAt,
    });

    return response;
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      {
        message:
          "Terjadi kesalahan saat proses login.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}