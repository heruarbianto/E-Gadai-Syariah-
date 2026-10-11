import { sendVerificationEmail } from "@/app/lib/email";
import { prisma } from "@/app/lib/prisma";
import { resendEmailRateLimit, resendIpRateLimit } from "@/app/lib/rate-limit";
import { rateLimitResponse } from "@/app/lib/rate-limit-res";
import { getClientIp } from "@/app/lib/req-ip";
import {
  generateVerificationToken,
  hashVerificationToken,
} from "@/app/lib/security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    /*
     * =====================================================
     * 1. IP RATE LIMIT
     * =====================================================
     */

    const ip = getClientIp(request);

    const ipLimit = await resendIpRateLimit.limit(ip);

    if (!ipLimit.success) {
      return rateLimitResponse(
        ipLimit.reset
          ? Math.ceil((ipLimit.reset - Date.now()) / 1000)
          : undefined,
      );
    }

    /*
     * =====================================================
     * 2. PARSE BODY
     * =====================================================
     */

    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    /*
     * Jangan memberi informasi apakah email valid /
     * terdaftar melalui response.
     */
    if (!email || email.length > 254) {
      return NextResponse.json(
        {
          message: "Jika akun memenuhi syarat, email verifikasi akan dikirim.",
        },
        { status: 202 },
      );
    }

    /*
     * =====================================================
     * 3. EMAIL RATE LIMIT
     * =====================================================
     *
     * Email dijadikan key Redis.
     *
     * Prefix rate limiter sudah memisahkan namespace.
     */

    const emailLimit = await resendEmailRateLimit.limit(email);

    if (!emailLimit.success) {
      /*
       * Tetap response generik.
       *
       * Jangan mengatakan:
       * "Email ini terlalu sering meminta OTP."
       *
       * karena dapat membantu enumeration.
       */

      return NextResponse.json(
        {
          message: "Jika akun memenuhi syarat, email verifikasi akan dikirim.",
        },
        {
          status: 202,
          headers: emailLimit.reset
            ? {
                "Retry-After": String(
                  Math.ceil((emailLimit.reset - Date.now()) / 1000),
                ),
              }
            : undefined,
        },
      );
    }

    /*
     * =====================================================
     * 4. DATABASE
     * =====================================================
     */

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        emailVerifiedAt: true,
      },
    });

    /*
     * Jangan membocorkan keberadaan account.
     */

    if (!user) {
      return NextResponse.json(
        {
          message: "Jika akun memenuhi syarat, email verifikasi akan dikirim.",
        },
        { status: 202 },
      );
    }

    /*
     * Sudah verified.
     */

    if (user.emailVerifiedAt) {
      return NextResponse.json(
        {
          message: "Jika akun memenuhi syarat, email verifikasi akan dikirim.",
        },
        { status: 202 },
      );
    }

    /*
     * =====================================================
     * 5. 60 SECOND COOLDOWN
     * =====================================================
     */

    const latestToken = await prisma.emailVerificationToken.findFirst({
      where: {
        userId: user.id,
        type: "EMAIL_VERIFICATION",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        createdAt: true,
      },
    });

    if (latestToken) {
      const elapsed = Date.now() - latestToken.createdAt.getTime();

      const cooldown = 60_000;

      if (elapsed < cooldown) {
        /*
         * Tetap generic.
         */

        return NextResponse.json(
          {
            message:
              "Jika akun memenuhi syarat, email verifikasi akan dikirim.",
          },
          { status: 202 },
        );
      }
    }

    /*
     * =====================================================
     * 6. GENERATE TOKEN
     * =====================================================
     */

    const rawToken = generateVerificationToken();

    const tokenHash = hashVerificationToken(rawToken);

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    /*
     * =====================================================
     * 7. INVALIDATE TOKEN LAMA + CREATE TOKEN BARU
     * =====================================================
     */

    await prisma.$transaction(async (tx) => {
      await tx.emailVerificationToken.updateMany({
        where: {
          userId: user.id,
          type: "EMAIL_VERIFICATION",
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
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
    });

    /*
     * =====================================================
     * 8. CREATE VERIFICATION URL
     * =====================================================
     */

    const appUrl = process.env.APP_URL;

    if (!appUrl) {
      console.error("APP_URL belum dikonfigurasi.");

      return NextResponse.json(
        {
          message: "Jika akun memenuhi syarat, email verifikasi akan dikirim.",
        },
        { status: 202 },
      );
    }

    const verificationUrl =
      `${appUrl}/auth/email-verification` +
      `?token=${encodeURIComponent(rawToken)}`;

    /*
     * =====================================================
     * 9. SEND EMAIL
     * =====================================================
     */

    try {
      await sendVerificationEmail({
        email: user.email!,
        verificationUrl,
      });
    } catch (error) {
      /*
       * Jangan kirim error provider email ke client.
       */
      console.error("Failed to send verification email:", error);
    }

    /*
     * =====================================================
     * 10. GENERIC RESPONSE
     * =====================================================
     */

    return NextResponse.json(
      {
        message: "Jika akun memenuhi syarat, email verifikasi akan dikirim.",
      },
      { status: 202 },
    );
  } catch (error) {
    console.error("Resend verification error:", error);

    /*
     * Tetap generic.
     */
    return NextResponse.json(
      {
        message: "Jika akun memenuhi syarat, email verifikasi akan dikirim.",
      },
      { status: 202 },
    );
  }
}
