import { NextRequest } from "next/server";

export function getClientIp(
  request: NextRequest,
): string {
  /*
   * Pada production, pastikan reverse proxy / hosting
   * yang digunakan memang trusted sebelum mempercayai
   * header forwarding.
   */

  const forwardedFor =
    request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor
      .split(",")[0]
      .trim();
  }

  const realIp =
    request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  /*
   * NextRequest biasanya tidak menyediakan IP secara
   * langsung di semua deployment.
   */
  return "unknown";
}