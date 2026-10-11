import crypto from "crypto";
import argon2 from "argon2";

/**
 * Password hashing menggunakan Argon2id.
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

/**
 * Verifikasi password.
 */
export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
}

/**
 * Membuat token kriptografis yang aman.
 *
 * Token mentah hanya dikirim ke user.
 * Yang disimpan di database adalah hash-nya.
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * SHA-256 untuk token random.
 *
 * Tidak perlu Argon2 untuk token karena token sudah
 * memiliki entropi kriptografis tinggi.
 */
export function hashVerificationToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}