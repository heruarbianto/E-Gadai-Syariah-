import { NextResponse } from "next/server";

export function rateLimitResponse(
  retryAfter?: number,
) {
  const headers = new Headers();

  if (retryAfter) {
    headers.set(
      "Retry-After",
      String(Math.ceil(retryAfter)),
    );
  }

  return NextResponse.json(
    {
      message:
        "Terlalu banyak permintaan. Silakan coba lagi nanti.",
      code: "RATE_LIMITED",
    },
    {
      status: 429,
      headers,
    },
  );
}