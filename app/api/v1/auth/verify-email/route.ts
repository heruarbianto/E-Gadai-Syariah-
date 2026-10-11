import { prisma } from "@/app/lib/prisma";
import { hashVerificationToken } from "@/app/lib/security";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const INVALID_TOKEN_MESSAGE =
  "Token verifikasi tidak valid atau telah kedaluwarsa.";

function jsonResponse(
  message: string,
  code: string,
  status: number,
) {
  return NextResponse.json(
    {
      message,
      code,
    },
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

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    /*
     * Validasi token.
     */
    if (
      !token ||
      token.length < 32 ||
      token.length > 256 ||
      !/^[A-Za-z0-9_-]+$/.test(token)
    ) {
      return jsonResponse(
        "Token verifikasi tidak valid.",
        "INVALID_TOKEN",
        400,
      );
    }

    const tokenHash = hashVerificationToken(token);

    /*
     * Cari token khusus verifikasi email.
     *
     * Token PASSWORD_RESET tidak akan diterima
     * oleh endpoint ini.
     */
    const verificationToken =
      await prisma.emailVerificationToken.findFirst({
        where: {
          tokenHash,
          type: "EMAIL_VERIFICATION",
        },
        select: {
          id: true,
          userId: true,
          tokenHash: true,
          type: true,
          expiresAt: true,
          usedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              emailVerifiedAt: true,
              status: true,
              deletedAt: true,
            },
          },
        },
      });

    /*
     * Token tidak ditemukan atau bukan token verifikasi email.
     */
    if (!verificationToken) {
      return jsonResponse(
        INVALID_TOKEN_MESSAGE,
        "INVALID_TOKEN",
        400,
      );
    }

    /*
     * Tolak akun yang sudah dihapus.
     */
    if (verificationToken.user.deletedAt) {
      return jsonResponse(
        INVALID_TOKEN_MESSAGE,
        "INVALID_TOKEN",
        400,
      );
    }

    /*
     * Jika email sudah diverifikasi, respons tetap sukses.
     *
     * Pemeriksaan dilakukan sebelum usedAt agar link yang
     * dibuka kembali tidak dianggap gagal.
     */
    if (verificationToken.user.emailVerifiedAt) {
      return jsonResponse(
        "Email sudah berhasil diverifikasi.",
        "EMAIL_ALREADY_VERIFIED",
        200,
      );
    }

    /*
     * Token sudah digunakan tetapi email belum diverifikasi.
     */
    if (verificationToken.usedAt) {
      return jsonResponse(
        INVALID_TOKEN_MESSAGE,
        "INVALID_TOKEN",
        400,
      );
    }

    /*
     * Periksa kedaluwarsa token.
     */
    if (verificationToken.expiresAt.getTime() <= Date.now()) {
      return jsonResponse(
        INVALID_TOKEN_MESSAGE,
        "TOKEN_EXPIRED",
        400,
      );
    }

    /*
     * Proses verifikasi dalam transaksi.
     */
    await prisma.$transaction(async (tx) => {
      /*
       * Tandai token yang valid sebagai sudah digunakan.
       *
       * Pemeriksaan type, usedAt, dan expiresAt mencegah
       * token yang salah tipe atau kedaluwarsa digunakan.
       */
      const updatedToken =
        await tx.emailVerificationToken.updateMany({
          where: {
            id: verificationToken.id,
            userId: verificationToken.userId,
            tokenHash,
            type: "EMAIL_VERIFICATION",
            usedAt: null,
            expiresAt: {
              gt: new Date(),
            },
          },
          data: {
            usedAt: new Date(),
          },
        });

      /*
       * Jika tidak ada baris yang diperbarui, token sudah
       * digunakan oleh request lain atau tidak lagi valid.
       */
      if (updatedToken.count !== 1) {
        throw new Error("TOKEN_ALREADY_USED");
      }

      /*
       * Tandai email sebagai terverifikasi.
       *
       * Status User tidak diubah menjadi ACTIVE.
       * Aktivasi akun tetap mengikuti proses KYC aplikasi.
       */
      await tx.user.update({
        where: {
          id: verificationToken.userId,
        },
        data: {
          emailVerifiedAt: new Date(),
        },
      });

      /*
       * Invalidasi hanya token verifikasi email lain.
       *
       * Token PASSWORD_RESET milik user tidak ikut
       * terpengaruh.
       */
      await tx.emailVerificationToken.updateMany({
        where: {
          userId: verificationToken.userId,
          type: "EMAIL_VERIFICATION",
          id: {
            not: verificationToken.id,
          },
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });
    });

    /*
     * Tidak membuat session di endpoint verifikasi.
     * User harus login secara terpisah.
     */
    return jsonResponse(
      "Email berhasil diverifikasi. Silakan login.",
      "EMAIL_VERIFIED",
      200,
    );
  } catch (error) {
    /*
     * Tangani dua request yang menggunakan token
     * yang sama secara bersamaan.
     */
    if (
      error instanceof Error &&
      error.message === "TOKEN_ALREADY_USED"
    ) {
      const token = request.nextUrl.searchParams.get("token");

      if (token) {
        const tokenHash = hashVerificationToken(token);

        /*
         * Periksa ulang token dengan tipe yang benar.
         */
        const tokenData =
          await prisma.emailVerificationToken.findFirst({
            where: {
              tokenHash,
              type: "EMAIL_VERIFICATION",
            },
            select: {
              user: {
                select: {
                  emailVerifiedAt: true,
                  deletedAt: true,
                },
              },
            },
          });

        /*
         * Request lain berhasil menyelesaikan verifikasi.
         */
        if (
          tokenData?.user.emailVerifiedAt &&
          !tokenData.user.deletedAt
        ) {
          return jsonResponse(
            "Email sudah berhasil diverifikasi.",
            "EMAIL_ALREADY_VERIFIED",
            200,
          );
        }
      }

      return jsonResponse(
        INVALID_TOKEN_MESSAGE,
        "INVALID_TOKEN",
        400,
      );
    }

    /*
     * Error internal.
     */
    console.error("Verify email error:", error);

    return jsonResponse(
      "Terjadi kesalahan saat memverifikasi email.",
      "INTERNAL_ERROR",
      500,
    );
  }
}