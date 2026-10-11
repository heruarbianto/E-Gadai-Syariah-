"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  MailCheck,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

type VerificationState = "loading" | "success" | "error";

interface ApiResponse {
  message?: string;
  code?: string;
}

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] =
    useState<VerificationState>("loading");

  const [message, setMessage] = useState(
    "Sedang memverifikasi alamat email Anda...",
  );

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage(
        "Tautan verifikasi tidak valid atau token tidak ditemukan.",
      );
      return;
    }

    let cancelled = false;

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          },
        );

        const data: ApiResponse = await response.json();

        if (cancelled) {
          return;
        }

        /*
         * ======================================================
         * SUCCESS
         * ======================================================
         *
         * Dua kondisi berikut sama-sama dianggap berhasil:
         *
         * EMAIL_VERIFIED
         * ----------------
         * Email baru saja berhasil diverifikasi.
         *
         * EMAIL_ALREADY_VERIFIED
         * -----------------------
         * Email sebelumnya sudah diverifikasi.
         *
         * Ini penting agar refresh / request ulang tidak
         * menampilkan "Verifikasi Email Gagal".
         */
        if (
          response.ok &&
          (
            data.code === "EMAIL_VERIFIED" ||
            data.code === "EMAIL_ALREADY_VERIFIED"
          )
        ) {
          setState("success");

          setMessage(
            data.message ??
              "Alamat email Anda berhasil diverifikasi.",
          );

          return;
        }

        /*
         * Fallback:
         *
         * Jika API mengembalikan HTTP 200 tetapi code tidak
         * sesuai, tetap perlakukan sebagai success karena
         * response.ok berarti server menyatakan request berhasil.
         */
        if (response.ok) {
          setState("success");

          setMessage(
            data.message ??
              "Alamat email Anda berhasil diverifikasi.",
          );

          return;
        }

        /*
         * ======================================================
         * ERROR
         * ======================================================
         */
        setState("error");

        setMessage(
          data.message ??
            "Tautan verifikasi tidak valid atau sudah kedaluwarsa.",
        );
      } catch (error) {
        console.error("EMAIL_VERIFICATION_ERROR:", error);

        if (cancelled) {
          return;
        }

        setState("error");

        setMessage(
          "Terjadi kesalahan saat menghubungi server. Silakan coba lagi.",
        );
      }
    };

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const isLoading = state === "loading";
  const isSuccess = state === "success";
  const isError = state === "error";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={[
            "absolute -left-32 -top-32 h-72 w-72 rounded-full blur-3xl transition-all duration-1000",
            isSuccess
              ? "bg-emerald-200/50"
              : isError
                ? "bg-red-200/50"
                : "bg-blue-200/50",
          ].join(" ")}
        />

        <div
          className={[
            "absolute -bottom-40 -right-32 h-96 w-96 rounded-full blur-3xl transition-all duration-1000",
            isSuccess
              ? "bg-teal-200/40"
              : isError
                ? "bg-orange-200/40"
                : "bg-indigo-200/40",
          ].join(" ")}
        />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 blur-3xl" />

        <div className="absolute left-[12%] top-[20%] h-2 w-2 animate-pulse rounded-full bg-slate-300" />

        <div className="absolute right-[18%] top-[28%] h-3 w-3 animate-pulse rounded-full bg-slate-200" />

        <div className="absolute bottom-[22%] left-[20%] h-2 w-2 animate-pulse rounded-full bg-slate-300" />
      </div>

      {/* Main */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_25px_80px_-25px_rgba(15,23,42,0.25)] backdrop-blur-2xl transition-all duration-700 sm:rounded-[32px] sm:p-8">

            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div
                  className={[
                    "absolute inset-0 rounded-full blur-md transition-all duration-700",
                    isLoading
                      ? "animate-pulse bg-blue-400/20"
                      : isSuccess
                        ? "bg-emerald-400/20"
                        : "bg-red-400/20",
                  ].join(" ")}
                />

                <div
                  className={[
                    "relative flex h-24 w-24 items-center justify-center rounded-full border transition-all duration-700",
                    isLoading
                      ? "border-blue-100 bg-blue-50"
                      : isSuccess
                        ? "border-emerald-100 bg-emerald-50"
                        : "border-red-100 bg-red-50",
                  ].join(" ")}
                >
                  {isLoading && (
                    <Loader2
                      className="h-10 w-10 animate-spin text-blue-600"
                      strokeWidth={1.8}
                    />
                  )}

                  {isSuccess && (
                    <CheckCircle2
                      className="h-11 w-11 text-emerald-600 animate-in zoom-in duration-500"
                      strokeWidth={1.8}
                    />
                  )}

                  {isError && (
                    <XCircle
                      className="h-11 w-11 text-red-600 animate-in zoom-in duration-500"
                      strokeWidth={1.8}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="mt-7 text-center">
              <div className="mb-3 flex items-center justify-center gap-2">
                {isLoading && (
                  <MailCheck className="h-4 w-4 text-blue-500" />
                )}

                {isSuccess && (
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                )}

                {isError && (
                  <RefreshCw className="h-4 w-4 text-red-500" />
                )}

                <span
                  className={[
                    "text-sm font-medium",
                    isLoading
                      ? "text-blue-600"
                      : isSuccess
                        ? "text-emerald-600"
                        : "text-red-600",
                  ].join(" ")}
                >
                  Verifikasi Email
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {isLoading && "Memverifikasi Email"}

                {isSuccess &&
                  "Email Berhasil Diverifikasi"}

                {isError && "Verifikasi Email Gagal"}
              </h1>

              <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
                {message}
              </p>
            </div>

            {/* Status */}
            <div
              className={[
                "mt-7 overflow-hidden rounded-2xl border transition-all duration-700",
                isLoading
                  ? "border-blue-100 bg-blue-50/60"
                  : isSuccess
                    ? "border-emerald-100 bg-emerald-50/70"
                    : "border-red-100 bg-red-50/70",
              ].join(" ")}
            >
              <div className="flex items-start gap-3 p-4">
                {isLoading && (
                  <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-blue-500" />
                )}

                {isSuccess && (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                )}

                {isError && (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                )}

                <p
                  className={[
                    "text-sm leading-5",
                    isLoading
                      ? "text-blue-700"
                      : isSuccess
                        ? "text-emerald-700"
                        : "text-red-700",
                  ].join(" ")}
                >
                  {isLoading &&
                    "Jangan tutup halaman ini sampai proses verifikasi selesai."}

                  {isSuccess &&
                    "Verifikasi berhasil. Anda sekarang dapat masuk menggunakan akun yang telah didaftarkan."}

                  {isError &&
                    "Gunakan tautan verifikasi terbaru yang dikirim ke email Anda."}
                </p>
              </div>
            </div>

            {/* Login button */}
            <div
              className={[
                "mt-7 transition-all duration-700",
                isLoading
                  ? "pointer-events-none translate-y-3 opacity-0"
                  : "translate-y-0 opacity-100",
              ].join(" ")}
            >
              <Link
                href="/auth/login"
                className={[
                  "group flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0",
                  isSuccess
                    ? "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
                    : "bg-slate-900 shadow-slate-900/20 hover:bg-slate-800",
                ].join(" ")}
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />

                Kembali ke Login
              </Link>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                Proses verifikasi dilakukan secara aman oleh
                sistem.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-medium tracking-[0.2em] text-slate-400">
              GADAI
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}