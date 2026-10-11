"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Phone,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Clock3,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Konfigurasi Palet Warna E-Gadai
const colors = {
  primary: "#075985", // Biru
  secondary: "#0EA5A4", // Teal
  success: "#22C55E", // Hijau
  warning: "#F59E0B", // Gold/Amber
  bg: "#F8FAFC", // Background
};

// Kurva animasi (Apple-like spring)
const smoothTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

type ModalState = "none" | "success-login" | "unverified" | "success-register";

export default function EGadaiAuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  type ResendStatus = "idle" | "success" | "error" | "limit";

  const [resendStatus, setResendStatus] = useState<ResendStatus>("idle");

  const [resendMessage, setResendMessage] = useState("");

  const [retryAfter, setRetryAfter] = useState(0);
  const [initialRetryAfter, setInitialRetryAfter] = useState(0);
  const [modalState, setModalState] = useState<
    | "none"
    | "loading"
    | "success-login"
    | "success-register"
    | "unverified"
    | "error"
  >("none");
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  type ForgotPasswordStatus = "idle" | "success" | "error" | "limit";

  const [forgotPasswordStatus, setForgotPasswordStatus] =
    useState<ForgotPasswordStatus>("idle");

  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [forgotPasswordRetryAfter, setForgotPasswordRetryAfter] = useState(0);
  // Form States
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hapus error ketika user mulai mengetik lagi
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // Handler nomor telepon
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");

    // Hapus 0 di awal
    val = val.replace(/^0+/, "");

    setFormData((prev) => ({
      ...prev,
      phone: val,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage("");
    setModalState("loading");

    try {
      const payload = isLogin
        ? {
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
          }
        : {
            email: formData.email.trim().toLowerCase(),
            phone: `${formData.phone}`,
            password: formData.password,
          };

      const endpoint = isLogin
        ? `${process.env.NEXT_PUBLIC_LOGIN_URL}`
        : `${process.env.NEXT_PUBLIC_REGISTER_URL}`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      // =========================
      // REGISTER
      // =========================
      if (!isLogin) {
        if (!response.ok) {
          setErrorMessage(
            result?.message ||
              "Registrasi gagal. Silakan periksa kembali data Anda.",
          );
          const errors = Object.fromEntries(
            Object.entries(result?.errors ?? {}).map(([field, messages]) => [
              field,
              Array.isArray(messages) ? messages[0] : String(messages),
            ]),
          );

          setFieldErrors(errors);
          setModalState("error");
          return;
        }

        // 201 = berhasil dibuat
        // 202 = user dibuat tetapi email gagal dikirim
        if (response.status === 201 || response.status === 202) {
          setModalState("success-register");
          return;
        }
      }

      // =========================
      // LOGIN
      // =========================

      if (isLogin) {
        // =========================
        // EMAIL BELUM DIVERIFIKASI
        // =========================
        if (response.status === 403 && result?.code === "EMAIL_NOT_VERIFIED") {
          setModalState("unverified");
          return;
        }

        // =========================
        // LOGIN BERHASIL
        // =========================
        if (response.ok && result?.code === "LOGIN_SUCCESS") {
          setModalState("success-login");

          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);

          return;
        }

        // =========================
        // LOGIN GAGAL
        // =========================
        setErrorMessage(
          result?.message || "Email atau password yang dimasukkan salah.",
        );

        setModalState("error");
        return;
      }
    } catch (error) {
      console.error("API Error:", error);

      setErrorMessage("Tidak dapat terhubung ke server. Silakan coba lagi.");

      setModalState("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler untuk forgot password
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (forgotPasswordLoading || forgotPasswordRetryAfter > 0) return;

    const email = forgotPasswordEmail.trim().toLowerCase();

    if (!email) {
      setForgotPasswordStatus("error");
      setForgotPasswordMessage("Silakan masukkan alamat email Anda.");
      return;
    }

    setForgotPasswordLoading(true);
    setForgotPasswordStatus("idle");
    setForgotPasswordMessage("");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_FORGOT_PASSWORD_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json().catch(() => null);

      if (response.status === 429 || result?.code === "RATE_LIMITED") {
        const retryAfterHeader = response.headers.get("Retry-After");
        const retryAfterSeconds = retryAfterHeader
          ? Math.max(0, Number(retryAfterHeader) || 0)
          : 0;

        setForgotPasswordStatus("limit");
        setForgotPasswordMessage(
          "Terlalu banyak permintaan. Silakan coba lagi nanti.",
        );
        setForgotPasswordRetryAfter(retryAfterSeconds);
        return;
      }

      if (!response.ok) {
        setForgotPasswordStatus("error");
        setForgotPasswordMessage(
          result?.message ||
            "Permintaan belum dapat diproses. Silakan coba lagi.",
        );
        return;
      }

      setForgotPasswordStatus("success");
      setForgotPasswordMessage(
        "Jika email Anda terdaftar, Anda akan menerima email berisi tautan untuk mengatur ulang kata sandi. Silakan periksa kotak masuk atau folder spam.",
      );
    } catch (error) {
      console.error("Forgot password error:", error);

      setForgotPasswordStatus("error");
      setForgotPasswordMessage(
        "Tidak dapat terhubung ke server. Silakan coba lagi.",
      );
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Handler untuk mengirim ulang email verifikasi

  const handleResendVerification = async () => {
    if (resendLoading) return;

    setResendLoading(true);
    setResendStatus("idle");
    setResendMessage("");
    setRetryAfter(0);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_RESEND_VERIFICATION_URL!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        },
      );

      const result = await response.json().catch(() => null);

      // RATE LIMIT DARI API
      // RATE LIMIT DARI API
      if (response.status === 429 || result?.code === "RATE_LIMITED") {
        const retryAfterHeader = response.headers.get("Retry-After");

        const retryAfterSeconds = retryAfterHeader
          ? Math.max(0, Number(retryAfterHeader) || 0)
          : 0;

        setResendStatus("limit");

        setResendMessage(
          result?.message ??
            "Terlalu banyak permintaan. Silakan coba lagi nanti.",
        );

        // Simpan durasi awal dari API
        setInitialRetryAfter(retryAfterSeconds);

        // Mulai hitung mundur
        setRetryAfter(retryAfterSeconds);

        return;
      }

      // RESPONS API LAINNYA YANG GAGAL
      if (!response.ok) {
        setResendStatus("error");
        setResendMessage(
          result?.message ??
            "Gagal mengirim ulang email verifikasi. Silakan coba lagi.",
        );

        return;
      }

      // BERHASIL
      setResendStatus("success");
      setResendMessage(
        result?.message ??
          "Permintaan pengiriman ulang email verifikasi berhasil diproses.",
      );
    } catch {
      setResendStatus("error");
      setResendMessage(
        "Tidak dapat terhubung ke server. Periksa koneksi internet dan coba lagi.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  function formatCountdown(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours} jam ${minutes} menit ${remainingSeconds} detik`;
    }

    if (minutes > 0) {
      return `${minutes} menit ${remainingSeconds} detik`;
    }

    return `${remainingSeconds} detik`;
  }

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };
  useEffect(() => {
    if (retryAfter <= 0) return;

    const timer = window.setInterval(() => {
      setRetryAfter((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [retryAfter > 0]);

  useEffect(() => {
  if (forgotPasswordRetryAfter <= 0) return;

  const timer = window.setInterval(() => {
    setForgotPasswordRetryAfter((current) =>
      Math.max(0, current - 1),
    );
  }, 1000);

  return () => window.clearInterval(timer);
}, [forgotPasswordRetryAfter > 0]);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 selection:bg-[#0EA5A4]/30"
      style={{ backgroundColor: colors.bg }}
    >
      {/* Background Ornamen (Memberi kesan elegan tanpa berlebihan) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-[#0EA5A4] rounded-full blur-[120px] opacity-10 -translate-y-1/3 translate-x-1/4" />
        <div className="w-[500px] h-[500px] bg-[#075985] rounded-full blur-[100px] opacity-5 translate-y-1/3 -translate-x-1/3" />
      </div>

      <motion.div
        layout
        transition={smoothTransition}
        className="relative z-10 w-full max-w-[420px] bg-white rounded-[24px] shadow-[0_8px_40px_rgb(7,89,133,0.06)] border border-slate-100 overflow-hidden"
      >
        <div className="p-8">
          {/* Logo Brand E-Gadai */}
          <motion.div layout className="mb-8 flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-[#075985] flex items-center justify-center shadow-lg shadow-[#075985]/20">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#075985] tracking-tight">
              E-Gadai
            </span>
          </motion.div>

          <motion.div layout className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {isLogin ? "Selamat Datang Kembali" : "Mulai Investasi & Gadai"}
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              {isLogin
                ? "Masuk untuk mengelola aset dan portofolio Anda."
                : "Buat akun dengan aman untuk menikmati layanan E-Gadai."}
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.form
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Field Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0EA5A4] transition-colors" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        handleChange(e);
                        clearFieldError("email");
                      }}
                      placeholder="nama@email.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#0EA5A4]/10 focus:border-[#0EA5A4] transition-all placeholder:text-slate-400 text-slate-900"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-[11px] text-red-500 ml-1 mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Field Nomor Telepon (Khusus Register) */}
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 ml-1">
                      Nomor Telepon
                    </label>
                    <div className="relative flex group">
                      <div className="flex items-center justify-center px-4 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-600 font-semibold text-sm group-focus-within:border-[#0EA5A4] group-focus-within:ring-4 group-focus-within:ring-[#0EA5A4]/10 transition-all">
                        +62
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        required={!isLogin}
                        value={formData.phone}
                        onChange={(e) => {
                          handlePhoneChange(e);
                          clearFieldError("phone");
                        }}
                        placeholder="81234567890" // Placeholder tanpa angka 0
                        className="w-full pl-3 pr-4 py-3.5 bg-slate-50 border border-l-0 border-slate-200 rounded-r-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#0EA5A4]/10 focus:border-[#0EA5A4] transition-all placeholder:text-slate-400 text-slate-900"
                      />
                    </div>
                    {fieldErrors.phone ? (
                      <p className="text-[11px] text-red-500 ml-1 mt-1">
                        {fieldErrors.phone}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-500 ml-1 mt-1">
                        Jangan gunakan angka 0 di awal nomor.
                      </p>
                    )}
                  </div>
                )}

                {/* Field Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0EA5A4] transition-colors" />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={(e) => {
                        handleChange(e);
                        clearFieldError("password");
                      }}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#0EA5A4]/10 focus:border-[#0EA5A4] transition-all placeholder:text-slate-400 text-slate-900"
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-red-500 ml-1 mt-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {isLogin && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setForgotPasswordEmail(
                          formData.email.trim().toLowerCase(),
                        );
                        setForgotPasswordStatus("idle");
                        setForgotPasswordMessage("");
                        setForgotPasswordRetryAfter(0);
                        setForgotPasswordOpen(true);
                      }}
                      className="text-xs font-medium text-[#075985] hover:text-[#0EA5A4] transition-colors"
                    >
                      Lupa password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full flex items-center justify-center py-3.5 px-4 bg-[#075985] hover:bg-[#0EA5A4] text-white rounded-xl text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-[#0EA5A4]/30 disabled:opacity-70 disabled:cursor-not-allowed mt-6 group shadow-md shadow-[#075985]/10"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Masuk ke Akun" : "Daftar Sekarang"}
                      <ArrowRight className="absolute right-4 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </>
                  )}
                </button>
              </motion.form>
            </AnimatePresence>
          </div>

          <motion.div layout className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? "Belum punya akun E-Gadai?" : "Sudah memiliki akun?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ email: "", phone: "", password: "" }); // Reset form saat switch
                }}
                className="ml-1.5 font-semibold text-[#075985] hover:text-[#F59E0B] transition-colors"
              >
                {isLogin ? "Daftar disini" : "Masuk sekarang"}
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* --- MODALS (Notifikasi) --- */}
      {/* --- MODALS (Notifikasi & Loading) --- */}
      <AnimatePresence>
        {modalState !== "none" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => {
                // Cegah klik background menutup modal jika sedang loading atau sukses login
                if (
                  modalState !== "loading" &&
                  modalState !== "success-login"
                ) {
                  setModalState("none");
                }
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-100 p-6 text-center overflow-hidden"
            >
              {/* 1. Modal Loading */}
              {modalState === "loading" && (
                <div className="flex flex-col items-center py-4">
                  <div className="relative flex items-center justify-center mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-[#0EA5A4]/20"></div>
                    <Loader2 className="h-10 w-10 animate-spin text-[#0EA5A4]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Memproses...
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Harap tunggu sebentar, kami sedang memverifikasi data Anda.
                  </p>
                </div>
              )}

              {/* 2. Modal Error */}
              {modalState === "error" && (
                <div className="flex flex-col items-center pt-2">
                  <div className="h-14 w-14 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                    <AlertTriangle className="h-7 w-7 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Terjadi Kesalahan
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {errorMessage ||
                      "Permintaan gagal diproses. Silakan coba lagi."}
                  </p>
                  <button
                    onClick={() => setModalState("none")}
                    className="w-full mt-6 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Tutup & Coba Lagi
                  </button>
                </div>
              )}

              {/* 3. Modal Berhasil Login (Hijau) */}
              {modalState === "success-login" && (
                <div className="flex flex-col items-center py-2">
                  <div className="h-14 w-14 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-7 w-7 text-[#22C55E]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Otentikasi Berhasil
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">
                    Mengamankan koneksi dan mengalihkan ke dashboard...
                  </p>
                </div>
              )}

              {/* 4. Modal Belum Verifikasi (Warna Gold/Amber) */}
              {modalState === "unverified" && (
                <div key={resendStatus} className="w-full animate-modal-enter">
                  {/* Status awal: akun belum diverifikasi */}
                  {resendStatus === "idle" && (
                    <div className="flex flex-col items-center pt-2 text-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F59E0B]/10 ring-8 ring-[#F59E0B]/5">
                        <Mail className="h-8 w-8 text-[#F59E0B]" />
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-slate-900">
                        Akun Belum Aktif
                      </h3>

                      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                        Demi keamanan, verifikasi alamat email diperlukan
                        sebelum kamu dapat menggunakan layanan E-Gadai.
                      </p>

                      <div className="mt-5 w-full rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-4 text-left">
                        <div className="flex items-start gap-3">
                          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#F59E0B]" />

                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500">
                              Email tujuan verifikasi
                            </p>

                            <p className="mt-1 break-all text-sm font-semibold text-[#075985]">
                              {formData.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendLoading}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#F59E0B]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                      >
                        {resendLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Mengirim email...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            Kirim Ulang Verifikasi
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setModalState("none")}
                        disabled={resendLoading}
                        className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                      >
                        Tutup
                      </button>
                    </div>
                  )}

                  {/* Status: berhasil */}
                  {resendStatus === "success" && (
                    <div className="flex flex-col items-center pt-2 text-center">
                      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#22C55E]/10">
                        <CheckCircle2 className="h-9 w-9 text-[#22C55E] animate-success-pop" />

                        <span className="absolute inset-0 rounded-full border border-[#22C55E]/30 animate-success-ring" />
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-slate-900">
                        Email Berhasil Dikirim
                      </h3>

                      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                        {resendMessage}
                      </p>

                      <div className="mt-5 w-full rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/5 p-4 text-left">
                        <div className="flex items-start gap-3">
                          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#22C55E]" />

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800">
                              Periksa kotak masuk email
                            </p>

                            <p className="mt-1 break-all text-sm text-slate-500">
                              {formData.email}
                            </p>

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              Jika tidak ditemukan, periksa folder spam atau
                              junk.
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setResendStatus("idle");
                          setResendMessage("");
                          setModalState("none");
                        }}
                        className="mt-6 w-full rounded-xl bg-[#075985] px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#064768] focus:outline-none focus:ring-4 focus:ring-[#075985]/20"
                      >
                        Mengerti
                      </button>
                    </div>
                  )}

                  {/* Status: gagal */}
                  {resendStatus === "error" && (
                    <div className="flex flex-col items-center pt-2 text-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
                        <XCircle className="h-9 w-9 text-rose-500 animate-success-pop" />
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-slate-900">
                        Pengiriman Gagal
                      </h3>

                      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                        {resendMessage}
                      </p>

                      <div className="mt-5 w-full rounded-xl border border-rose-100 bg-rose-50/70 p-4 text-left">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />

                          <p className="text-sm leading-6 text-rose-700">
                            Periksa alamat email dan koneksi internet. Jika
                            masalah tetap terjadi, coba beberapa saat lagi.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setResendStatus("idle");
                          setResendMessage("");
                        }}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-[#F59E0B]/20"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Coba Lagi
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setResendStatus("idle");
                          setResendMessage("");
                          setModalState("none");
                        }}
                        className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                      >
                        Tutup
                      </button>
                    </div>
                  )}

                  {/* Status: terkena rate limit */}
                  {resendStatus === "limit" && (
                    <div className="flex flex-col items-center pt-2 text-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F59E0B]/10">
                        <Clock3 className="h-9 w-9 text-[#F59E0B] animate-success-pop" />
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-slate-900">
                        Tunggu Sebentar
                      </h3>

                      <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                        {resendMessage}
                      </p>

                      {retryAfter > 0 && (
                        <div className="mt-5 w-full rounded-2xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-5">
                          <p className="text-xs font-medium text-slate-500">
                            Kamu bisa mencoba kembali dalam
                          </p>

                          <p
                            aria-live="polite"
                            className="mt-2 text-3xl font-extrabold tracking-tight text-[#075985] tabular-nums"
                          >
                            {formatCountdown(retryAfter)}
                          </p>

                          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F59E0B]/15">
                            <div
                              className="h-full rounded-full bg-[#F59E0B] transition-[width] duration-1000"
                              style={{
                                width: `${
                                  initialRetryAfter > 0
                                    ? Math.min(
                                        100,
                                        (retryAfter / initialRetryAfter) * 100,
                                      )
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {retryAfter <= 0 && (
                        <div className="mt-5 w-full rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/5 p-4">
                          <p className="text-sm leading-6 text-slate-600">
                            Waktu tunggu selesai. Kamu dapat mencoba mengirim
                            ulang email verifikasi.
                          </p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendLoading || retryAfter > 0}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#075985] px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#064768] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {resendLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Mengirim email...
                          </>
                        ) : retryAfter > 0 ? (
                          <>
                            <Clock3 className="h-4 w-4" />
                            Tunggu {formatCountdown(retryAfter)}
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            Coba Kirim Ulang
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setResendStatus("idle");
                          setResendMessage("");
                          setModalState("none");
                        }}
                        disabled={resendLoading}
                        className="mt-2 w-full rounded-xl px-4 py-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                      >
                        Tutup
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Modal Berhasil Daftar (Warna Teal) */}
              {modalState === "success-register" && (
                <div className="flex flex-col items-center pt-2 pb-2">
                  <div className="h-16 w-16 bg-[#0EA5A4]/10 rounded-full flex items-center justify-center mb-5 border border-[#0EA5A4]/20">
                    <Mail className="h-8 w-8 text-[#0EA5A4]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Langkah Terakhir!
                  </h3>
                  <p className="text-sm text-slate-500 mt-3 leading-relaxed px-2">
                    Kami telah mengirimkan instruksi ke email Anda. Silahkan
                    verifikasi untuk mengaktifkan dompet E-Gadai Anda.
                  </p>
                  <button
                    onClick={() => {
                      setModalState("none");
                      setIsLogin(true);
                    }}
                    className="w-full mt-8 py-3 px-4 bg-[#075985] hover:bg-[#0EA5A4] text-white rounded-xl text-sm font-semibold transition-colors"
                  >
                    Kembali ke Login
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
                    {/* 5. Modal Lupa Password */}
              <AnimatePresence>
                {forgotPasswordOpen && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Background */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                      onClick={() => {
                        if (!forgotPasswordLoading) {
                          setForgotPasswordOpen(false);
                        }
                      }}
                    />

                    {/* Modal */}
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 28,
                      }}
                      className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                            forgotPasswordStatus === "success"
                              ? "bg-emerald-50"
                              : forgotPasswordStatus === "error"
                                ? "bg-red-50"
                                : forgotPasswordStatus === "limit"
                                  ? "bg-amber-50"
                                  : "bg-[#075985]/10"
                          }`}
                        >
                          {forgotPasswordStatus === "success" ? (
                            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                          ) : forgotPasswordStatus === "error" ? (
                            <AlertTriangle className="h-7 w-7 text-red-500" />
                          ) : forgotPasswordStatus === "limit" ? (
                            <Clock3 className="h-7 w-7 text-amber-600" />
                          ) : (
                            <Mail className="h-7 w-7 text-[#075985]" />
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900">
                          {forgotPasswordStatus === "success"
                            ? "Periksa Email Anda"
                            : forgotPasswordStatus === "limit"
                              ? "Terlalu Banyak Permintaan"
                              : forgotPasswordStatus === "error"
                                ? "Permintaan Gagal"
                                : "Lupa Password?"}
                        </h3>

                        <p className="mt-2 text-sm leading-relaxed text-slate-500">
                          {forgotPasswordStatus === "success"
                            ? forgotPasswordMessage
                            : forgotPasswordStatus === "limit"
                              ? forgotPasswordMessage
                              : forgotPasswordStatus === "error"
                                ? forgotPasswordMessage
                                : "Masukkan email yang Anda gunakan saat mendaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi."}
                        </p>
                      </div>

                      {/* Form email */}
                      {forgotPasswordStatus === "idle" && (
                        <form onSubmit={handleForgotPassword} className="mt-6">
                          <label
                            htmlFor="forgot-password-email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                          >
                            Alamat Email
                          </label>

                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                            <input
                              id="forgot-password-email"
                              type="email"
                              autoComplete="email"
                              required
                              maxLength={254}
                              value={forgotPasswordEmail}
                              onChange={(e) =>
                                setForgotPasswordEmail(e.target.value)
                              }
                              placeholder="nama@email.com"
                              disabled={forgotPasswordLoading}
                              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#075985] focus:ring-4 focus:ring-[#075985]/10 disabled:opacity-60"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={forgotPasswordLoading}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#075985] px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#075985]/10 transition-colors hover:bg-[#0EA5A4] disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {forgotPasswordLoading ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Mengirim Permintaan...
                              </>
                            ) : (
                              <>
                                <Mail className="h-5 w-5" />
                                Kirim Tautan Reset
                              </>
                            )}
                          </button>
                        </form>
                      )}

                      {/* Tombol setelah permintaan diproses */}
                      {forgotPasswordStatus !== "idle" && (
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              forgotPasswordStatus === "limit" &&
                              forgotPasswordRetryAfter > 0
                            ) {
                              return;
                            }

                            setForgotPasswordStatus("idle");
                            setForgotPasswordMessage("");
                          }}
                          disabled={
                            forgotPasswordStatus === "limit" &&
                            forgotPasswordRetryAfter > 0
                          }
                          className="mt-6 w-full rounded-xl bg-[#075985] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0EA5A4] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {forgotPasswordStatus === "limit" &&
                          forgotPasswordRetryAfter > 0
                            ? `Coba lagi dalam ${forgotPasswordRetryAfter} detik`
                            : forgotPasswordStatus === "success"
                              ? "Mengerti"
                              : "Coba Lagi"}
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={forgotPasswordLoading}
                        onClick={() => setForgotPasswordOpen(false)}
                        className="mt-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50"
                      >
                        Kembali ke Login
                      </button>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
      <style jsx global>{`
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes success-pop {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }

          70% {
            opacity: 1;
            transform: scale(1.08);
          }

          100% {
            transform: scale(1);
          }
        }

        @keyframes success-ring {
          0% {
            opacity: 0.8;
            transform: scale(0.85);
          }

          100% {
            opacity: 0;
            transform: scale(1.35);
          }
        }

        .animate-modal-enter {
          animation: modal-enter 240ms ease-out both;
        }

        .animate-success-pop {
          animation: success-pop 350ms ease-out both;
        }

        .animate-success-ring {
          animation: success-ring 700ms ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-modal-enter,
          .animate-success-pop,
          .animate-success-ring {
            animation: none !important;
          }

          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}
