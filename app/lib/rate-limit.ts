import { prisma } from "./prisma";

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

type RateLimitConfig = {
  limit: number;
  windowMs: number;
  prefix: string;
};

/**
 * Internal database rate limiter.
 *
 * Mempertahankan interface .limit(identifier)
 * agar pemanggilan pada API route tetap kompatibel.
 */
class DatabaseRateLimit {
  private readonly config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const key = `${this.config.prefix}:${identifier}`;

    // Retry jika transaksi bersamaan mengalami konflik.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await prisma.$transaction(
          async (tx) => {
            const now = new Date();

            const existing = await tx.rateLimit.findUnique({
              where: { key },
            });

            if (!existing || existing.expiresAt <= now) {
              const expiresAt = new Date(
                now.getTime() + this.config.windowMs,
              );

              if (existing) {
                await tx.rateLimit.update({
                  where: { key },
                  data: {
                    count: 1,
                    expiresAt,
                  },
                });
              } else {
                await tx.rateLimit.create({
                  data: {
                    key,
                    count: 1,
                    expiresAt,
                  },
                });
              }

              return {
                success: true,
                limit: this.config.limit,
                remaining: this.config.limit - 1,
                reset: Math.ceil(expiresAt.getTime()),
              };
            }

            if (existing.count >= this.config.limit) {
              return {
                success: false,
                limit: this.config.limit,
                remaining: 0,
                reset: Math.ceil(existing.expiresAt.getTime()),
              };
            }

            const updated = await tx.rateLimit.update({
              where: { key },
              data: {
                count: { increment: 1 },
              },
            });

            return {
              success: true,
              limit: this.config.limit,
              remaining: Math.max(
                0,
                this.config.limit - updated.count,
              ),
              reset: Math.ceil(existing.expiresAt.getTime()),
            };
          },
          {
            isolationLevel: "Serializable",
          },
        );
      } catch (error) {
        const code =
          typeof error === "object" &&
          error !== null &&
          "code" in error
            ? error.code
            : undefined;

        if (
          attempt < 2 &&
          (code === "P2002" || code === "P2034")
        ) {
          continue;
        }

        throw error;
      }
    }

    throw new Error("Rate limit transaction failed");
  }
}

/**
 * REGISTER
 * Maksimal 5 request dari satu IP dalam 15 menit.
 */
export const registerIpRateLimit = new DatabaseRateLimit({
  limit: 5,
  windowMs: 15 * 60 * 1000,
  prefix: "ratelimit:auth:register:ip",
});

/**
 * RESEND VERIFICATION - IP
 * Maksimal 10 request dari satu IP dalam 1 jam.
 */
export const resendIpRateLimit = new DatabaseRateLimit({
  limit: 10,
  windowMs: 60 * 60 * 1000,
  prefix: "ratelimit:auth:resend:ip",
});

/**
 * RESEND VERIFICATION - EMAIL
 * Maksimal 5 request untuk email tertentu dalam 1 jam.
 */
export const resendEmailRateLimit = new DatabaseRateLimit({
  limit: 5,
  windowMs: 60 * 60 * 1000,
  prefix: "ratelimit:auth:resend:email",
});


/**
 * SEND FORGOT PASSWORD - EMAIL
 * Maksimal 1 request untuk email tertentu dalam 3 menit.
 */

export const forgotPasswordEmailRateLimit = new DatabaseRateLimit({
  limit: 1,
  windowMs: 3 * 60 * 1000,
  prefix: "ratelimit:auth:forgot-password:email",
});

/**
 * RESET PASSWORD - IP
 * Maksimal 10 request untuk IP tertentu dalam 3 menit.
 */

export const resetPasswordIpRateLimit = new DatabaseRateLimit({
  limit: 10,
  windowMs: 3 * 60 * 1000,
  prefix: "ratelimit:auth:reset-password:ip",
});