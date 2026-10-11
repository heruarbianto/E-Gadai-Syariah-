"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  KeyRound,
} from "lucide-react";

type ModalState =
  | "success"
  | "error"
  | "invalid-token"
  | null;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] =
    useState<ModalState>(null);

  const [modalMessage, setModalMessage] =
    useState("");

  const [passwordTouched, setPasswordTouched] =
    useState(false);

  const [confirmTouched, setConfirmTouched] =
    useState(false);

  const passwordValid = password.length >= 12;

  const passwordMatch =
    password.length > 0 &&
    password === confirmPassword;

  const getPasswordErrors = () => {
    const errors: string[] = [];

    if (password.length < 12) {
      errors.push(
        "Kata sandi minimal 12 karakter.",
      );
    }

    if (password.length > 128) {
      errors.push(
        "Kata sandi maksimal 128 karakter.",
      );
    }

    return errors;
  };

  const passwordErrors = getPasswordErrors();

  const canSubmit =
    token.length > 0 &&
    passwordValid &&
    password.length <= 128 &&
    passwordMatch &&
    !isLoading;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!token) {
      setModalMessage(
        "Tautan reset kata sandi tidak valid atau tidak tersedia.",
      );
      setModalState("invalid-token");
      return;
    }

    if (password.length < 12) {
      setModalMessage(
        "Kata sandi harus memiliki minimal 12 karakter.",
      );
      setModalState("error");
      return;
    }

    if (password.length > 128) {
      setModalMessage(
        "Kata sandi tidak boleh lebih dari 128 karakter.",
      );
      setModalState("error");
      return;
    }

    if (password !== confirmPassword) {
      setModalMessage(
        "Konfirmasi kata sandi tidak cocok.",
      );
      setModalState("error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_RESET_PASSWORD_URL!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
            confirmPassword,
          }),
        },
      );

      const result = await response
        .json()
        .catch(() => null);

      if (response.ok) {
        setPassword("");
        setConfirmPassword("");

        setModalMessage(
          result?.message ??
            "Kata sandi berhasil diperbarui. Silakan masuk menggunakan kata sandi baru.",
        );

        setModalState("success");
        return;
      }

      if (
        response.status === 400 ||
        response.status === 401 ||
        response.status === 410
      ) {
        setModalMessage(
          result?.message ??
            "Tautan reset kata sandi tidak valid, sudah digunakan, atau telah kedaluwarsa. Silakan minta tautan baru.",
        );

        setModalState("invalid-token");
        return;
      }

      setModalMessage(
        result?.message ??
          "Kata sandi belum berhasil diperbarui. Silakan coba kembali.",
      );

      setModalState("error");
    } catch {
      setModalMessage(
        "Tidak dapat terhubung ke server. Periksa koneksi internet dan coba kembali.",
      );

      setModalState("error");
    } finally {
      setIsLoading(false);
    }
  }

  function closeModal() {
    const previousState = modalState;

    setModalState(null);

    if (previousState === "success") {
      router.replace("/auth/login");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8FAFC] px-4 py-10 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#075985]/5 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#F59E0B]/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.replace("/auth/login")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:text-[#075985]"
        >
          <ArrowLeft size={18} />
          Kembali ke halaman utama
        </button>

        {/* Main card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          {/* Header */}
          <div className="relative overflow-hidden bg-[#075985] px-6 pb-8 pt-9 text-center sm:px-8">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/10" />

            <div className="absolute -bottom-14 -left-8 h-36 w-36 rounded-full border border-white/10" />

            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
              <LockKeyhole size={30} strokeWidth={1.8} />
            </div>

            <h1 className="relative text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Reset Kata Sandi
            </h1>

            <p className="relative mx-auto mt-3 max-w-xs text-sm leading-6 text-sky-100">
              Buat kata sandi baru untuk menjaga
              keamanan akun Gadaikan kamu.
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-8 sm:px-8">
            {!token ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center">
                <AlertCircle
                  size={32}
                  className="mx-auto text-amber-600"
                />

                <h2 className="mt-3 font-semibold text-slate-900">
                  Tautan Tidak Tersedia
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Token reset kata sandi tidak ditemukan
                  pada tautan ini. Silakan kembali ke
                  halaman login dan minta tautan reset
                  yang baru.
                </p>

                <button
                  type="button"
                  onClick={() => router.replace("/auth/login")}
                  className="mt-5 w-full rounded-xl bg-[#075985] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#064766]"
                >
                  Kembali ke Login
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 rounded-xl border border-sky-100 bg-sky-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={21}
                      className="mt-0.5 shrink-0 text-[#075985]"
                    />

                    <div>
                      <p className="text-sm font-semibold text-[#075985]">
                        Lindungi akun kamu
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        Gunakan kata sandi yang kuat dan
                        jangan membagikannya kepada siapa
                        pun.
                      </p>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  noValidate
                >
                  {/* New password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Kata Sandi Baru
                    </label>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <LockKeyhole size={18} />
                      </div>

                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) =>
                          setPassword(
                            event.target.value,
                          )
                        }
                        onBlur={() =>
                          setPasswordTouched(true)
                        }
                        maxLength={128}
                        required
                        disabled={isLoading}
                        placeholder="Masukkan kata sandi baru"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075985] focus:ring-4 focus:ring-[#075985]/10 disabled:bg-slate-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword,
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Sembunyikan kata sandi"
                            : "Tampilkan kata sandi"
                        }
                        className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 transition hover:text-[#075985]"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    {passwordTouched && (
                      <div className="mt-2 space-y-1">
                        {passwordErrors.map(
                          (error) => (
                            <p
                              key={error}
                              className="text-xs text-red-600"
                            >
                              {error}
                            </p>
                          ),
                        )}
                      </div>
                    )}

                    <p className="mt-2 text-xs text-slate-500">
                      Minimal 12 karakter dan maksimal
                      128 karakter.
                    </p>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Konfirmasi Kata Sandi
                    </label>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <KeyRound size={18} />
                      </div>

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(
                            event.target.value,
                          )
                        }
                        onBlur={() =>
                          setConfirmTouched(true)
                        }
                        maxLength={128}
                        required
                        disabled={isLoading}
                        placeholder="Ulangi kata sandi baru"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#075985] focus:ring-4 focus:ring-[#075985]/10 disabled:bg-slate-50"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword,
                          )
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Sembunyikan konfirmasi kata sandi"
                            : "Tampilkan konfirmasi kata sandi"
                        }
                        className="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 transition hover:text-[#075985]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    {confirmTouched &&
                      confirmPassword.length > 0 &&
                      !passwordMatch && (
                        <p className="mt-2 text-xs text-red-600">
                          Kata sandi tidak cocok.
                        </p>
                      )}

                    {confirmTouched &&
                      passwordMatch && (
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                          <CheckCircle2 size={14} />
                          Kata sandi cocok.
                        </p>
                      )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#075985] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#075985]/15 transition hover:bg-[#064766] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={18} />
                        Ganti Kata Sandi
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            {/* Footer */}
            <div className="mt-7 border-t border-slate-100 pt-5">
              <p className="text-center text-xs leading-5 text-slate-500">
                <ShieldCheck
                  size={14}
                  className="mr-1 inline-block align-text-bottom"
                />
                Informasi akun kamu diproses secara
                aman.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Gadaikan
        </p>
      </motion.div>

      {/* Notification modal */}
      <AnimatePresence>
        {modalState && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="reset-modal-title"
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div
                className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                  modalState === "success"
                    ? "bg-emerald-50 text-emerald-600"
                    : modalState === "invalid-token"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-red-50 text-red-600"
                }`}
              >
                {modalState === "success" ? (
                  <CheckCircle2 size={30} />
                ) : (
                  <AlertCircle size={30} />
                )}
              </div>

              <h2
                id="reset-modal-title"
                className="mt-4 text-center text-lg font-bold text-slate-900"
              >
                {modalState === "success"
                  ? "Kata Sandi Berhasil Diubah"
                  : modalState === "invalid-token"
                    ? "Tautan Tidak Valid"
                    : "Penggantian Gagal"}
              </h2>

              <p className="mt-2 text-center text-sm leading-6 text-slate-600">
                {modalMessage}
              </p>

              <button
                type="button"
                onClick={closeModal}
                className="mt-6 w-full rounded-xl bg-[#075985] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#064766]"
              >
                {modalState === "success"
                  ? "Kembali ke Login"
                  : modalState === "invalid-token"
                    ? "Mengerti"
                    : "Coba Lagi"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
          <LoaderCircle
            size={32}
            className="animate-spin text-[#075985]"
          />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}