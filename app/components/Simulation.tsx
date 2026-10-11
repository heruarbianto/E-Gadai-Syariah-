"use client";

import React, { useMemo, useState } from "react";
import {
  Calculator,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
  Wallet,
  Info,
  CheckCircle2,
  FileText,
  Clock3,
} from "lucide-react";
import Link from "next/link";

const ADMIN_FEE = 15_000;
const DAILY_FEE = 2_000;
const WEEKLY_FEE = 13_000;
const MONTHLY_FEE = 50_000;

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Menghitung durasi berdasarkan total hari:
 * 1 bulan = 30 hari
 * 1 minggu = 7 hari
 * Sisa durasi dihitung dalam hari.
 */
function calculateTenor(startDate: Date, endDate: Date) {
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  const end = new Date(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  );

  if (end <= start) {
    return {
      months: 0,
      weeks: 0,
      days: 0,
      totalDays: 0,
      fee: 0,
    };
  }

  const totalDays = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const months = Math.floor(totalDays / 30);
  const remainingAfterMonths = totalDays % 30;

  const weeks = Math.floor(remainingAfterMonths / 7);
  const days = remainingAfterMonths % 7;

  const fee =
    months * MONTHLY_FEE +
    weeks * WEEKLY_FEE +
    days * DAILY_FEE;

  return {
    months,
    weeks,
    days,
    totalDays,
    fee,
  };
}

export default function Simulation() {
  const [loanAmount, setLoanAmount] = useState("1000000");

  // Tanggal hari ini, dinormalisasi tanpa komponen waktu.
  const today = useMemo(() => {
    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
  }, []);

  // Default tanggal pengembalian: 30 hari dari hari ini.
  const [returnDate, setReturnDate] = useState(() => {
    const initialDate = new Date();
    initialDate.setDate(initialDate.getDate() + 30);

    return formatDateInput(initialDate);
  });

  const principal = Math.max(0, Number(loanAmount) || 0);

  // Parse tanggal secara lokal agar tidak bergeser akibat UTC.
  const selectedReturnDate = useMemo(() => {
    const [year, month, day] = returnDate.split("-").map(Number);

    if (!year || !month || !day) {
      return null;
    }

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }, [returnDate]);

  const tenor = useMemo(() => {
    if (!selectedReturnDate) {
      return {
        months: 0,
        weeks: 0,
        days: 0,
        totalDays: 0,
        fee: 0,
      };
    }

    return calculateTenor(today, selectedReturnDate);
  }, [today, selectedReturnDate]);

  const isValidDate = tenor.totalDays > 0;

  const totalRepayment = isValidDate
    ? principal + ADMIN_FEE + tenor.fee
    : 0;

  const handleAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numericValue = event.target.value.replace(/\D/g, "");

    setLoanAmount(numericValue);
  };

  const handleReturnDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReturnDate(event.target.value);
  };

  const handleQuickAmount = (amount: number) => {
    setLoanAmount(String(amount));
  };

  const handleQuickDate = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);

    setReturnDate(formatDateInput(date));
  };

  const tenorBreakdown = [
    {
      key: "bulan",
      label: `${tenor.months} bulan × Rp50.000`,
      quantity: tenor.months,
      rate: MONTHLY_FEE,
      amount: tenor.months * MONTHLY_FEE,
    },
    {
      key: "minggu",
      label: `${tenor.weeks} minggu × Rp13.000`,
      quantity: tenor.weeks,
      rate: WEEKLY_FEE,
      amount: tenor.weeks * WEEKLY_FEE,
    },
    {
      key: "hari",
      label: `${tenor.days} hari × Rp2.000`,
      quantity: tenor.days,
      rate: DAILY_FEE,
      amount: tenor.days * DAILY_FEE,
    },
  ].filter((item) => item.quantity > 0);

  return (
    <section
      id="simulasi"
      className="relative overflow-hidden bg-[#075985] py-16 text-[#F8FAFC] md:py-24"
    >
      {/* Dekorasi latar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#0EA5A4]/15 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#F59E0B]/10 blur-3xl"
      />

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Bagian informasi */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
              <Calculator className="h-4 w-4 text-[#F59E0B]" />
              Simulasi Gadai
            </div>

            <div className="space-y-4">
              <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Hitung Biaya Gadai dengan{" "}
                <span className="text-[#F59E0B]">
                  Transparan.
                </span>
              </h2>

              <div className="h-1.5 w-16 rounded-full bg-[#F59E0B]" />

              <p className="max-w-xl text-base leading-7 text-white/85 sm:text-lg">
                Tentukan nominal pinjaman dan tanggal pengembalian.
                Sistem akan menghitung perkiraan biaya berdasarkan
                kombinasi bulan, minggu, dan hari secara otomatis.
              </p>
            </div>

            {/* Keunggulan */}
            <div className="space-y-5 pt-2">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#22C55E]/15 text-[#22C55E]">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Rincian biaya yang jelas
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/70">
                    Biaya administrasi, materai, dan biaya tenor
                    ditampilkan secara terpisah.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0EA5A4]/20 text-[#0EA5A4]">
                  <CalendarDays className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Berdasarkan tanggal pengembalian
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/70">
                    Pilih tanggal yang direncanakan. Sisa durasi
                    langsung diuraikan menjadi bulan, minggu, dan hari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/15 text-[#F59E0B]">
                  <Wallet className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Total pengembalian otomatis
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-white/70">
                    Perubahan nominal atau tanggal langsung
                    memperbarui perhitungan.
                  </p>
                </div>
              </div>
            </div>

            {/* Catatan */}
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#F59E0B]" />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Perhatian
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white/75">
                    Simulasi ini menggunakan asumsi satu bulan sama
                    dengan 30 hari dan satu minggu sama dengan 7 hari.
                    Nilai pinjaman yang disetujui dapat berbeda dari
                    nilai taksiran barang.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kalkulator */}
          <div className="w-full">
            <div className="overflow-hidden rounded-3xl bg-white text-[#075985] shadow-2xl shadow-black/20">
              {/* Header */}
              <div className="relative overflow-hidden bg-[#F8FAFC] px-6 py-7 sm:px-8">
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-[#0EA5A4]/10"
                />

                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#075985] text-white shadow-lg shadow-[#075985]/20">
                    <Calculator className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold sm:text-2xl">
                      Kalkulator Gadai
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Hitung estimasi pengembalian
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-6 py-7 sm:px-8 sm:py-8">
                {/* Input nominal */}
                <div>
                  <label
                    htmlFor="loan-amount"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nominal Pinjaman (Rp)
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                      Rp
                    </span>

                    <input
                      id="loan-amount"
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      value={
                        loanAmount
                          ? Number(loanAmount).toLocaleString("id-ID")
                          : ""
                      }
                      onChange={handleAmountChange}
                      placeholder="1.000.000"
                      className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-lg font-bold text-[#075985] outline-none transition placeholder:text-slate-300 focus:border-[#0EA5A4] focus:ring-4 focus:ring-[#0EA5A4]/10"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[500_000, 1_000_000, 2_000_000, 5_000_000].map(
                      (amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleQuickAmount(amount)}
                          aria-pressed={principal === amount}
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                            principal === amount
                              ? "border-[#075985] bg-[#075985] text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-[#0EA5A4] hover:text-[#075985]"
                          }`}
                        >
                          {amount >= 1_000_000
                            ? `${amount / 1_000_000} juta`
                            : `${amount / 1_000} ribu`}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Tanggal pengembalian */}
                <div>
                  <label
                    htmlFor="return-date"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Tanggal Pengembalian
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0EA5A4]" />

                    <input
                      id="return-date"
                      type="date"
                      value={returnDate}
                      min={formatDateInput(today)}
                      onChange={handleReturnDateChange}
                      className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-[#075985] outline-none transition focus:border-[#0EA5A4] focus:ring-4 focus:ring-[#0EA5A4]/10"
                    />
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    Pilih tanggal saat pinjaman direncanakan untuk
                    dikembalikan.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { label: "7 hari", days: 7 },
                      { label: "14 hari", days: 14 },
                      { label: "30 hari", days: 30 },
                      { label: "60 hari", days: 60 },
                    ].map((item) => (
                      <button
                        key={item.days}
                        type="button"
                        onClick={() => handleQuickDate(item.days)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-[#0EA5A4] hover:bg-[#0EA5A4]/5 hover:text-[#075985]"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ringkasan durasi */}
                <div className="rounded-2xl border border-[#0EA5A4]/20 bg-[#0EA5A4]/5 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Clock3 className="h-5 w-5 text-[#0EA5A4]" />

                    <h4 className="font-bold text-[#075985]">
                      Durasi Pengembalian
                    </h4>
                  </div>

                  {isValidDate ? (
                    <>
                      <p className="text-sm text-slate-500">
                        Total durasi: {tenor.totalDays} hari
                      </p>

                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded-xl bg-white p-3 text-center">
                          <p className="text-2xl font-extrabold text-[#075985]">
                            {tenor.months}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Bulan
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3 text-center">
                          <p className="text-2xl font-extrabold text-[#075985]">
                            {tenor.weeks}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Minggu
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3 text-center">
                          <p className="text-2xl font-extrabold text-[#075985]">
                            {tenor.days}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Hari
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-rose-600">
                      Pilih tanggal pengembalian setelah hari ini.
                    </p>
                  )}
                </div>

                {/* Rincian biaya */}
                <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 sm:p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#0EA5A4]" />

                    <h4 className="font-bold text-[#075985]">
                      Rincian Pengembalian
                    </h4>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">
                        Pokok pinjaman
                      </span>

                      <span className="text-right font-semibold text-slate-700">
                        {formatRupiah(principal)}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">
                        Administrasi & materai
                      </span>

                      <span className="text-right font-semibold text-slate-700">
                        {formatRupiah(ADMIN_FEE)}
                      </span>
                    </div>

                    <div className="border-t border-dashed border-slate-300 pt-4">
                      <p className="mb-3 font-semibold text-[#075985]">
                        Perincian Biaya Tenor
                      </p>

                      <div className="space-y-3">
                        {isValidDate && tenorBreakdown.length > 0 ? (
                          tenorBreakdown.map((item) => (
                            <div
                              key={item.key}
                              className="flex items-start justify-between gap-4"
                            >
                              <span className="text-slate-500">
                                {item.label}
                              </span>

                              <span className="text-right font-semibold text-slate-700">
                                {formatRupiah(item.amount)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400">
                            Belum ada biaya tenor untuk ditampilkan.
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-start justify-between gap-4">
                        <span className="font-semibold text-slate-600">
                          Total biaya tenor
                        </span>

                        <span className="text-right font-bold text-[#075985]">
                          {formatRupiah(tenor.fee)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="my-5 border-t border-dashed border-slate-300" />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">
                      Estimasi Total Pengembalian
                    </p>

                    <p
                      aria-live="polite"
                      className="break-words text-2xl font-extrabold leading-tight tracking-tight text-[#0EA5A4] sm:text-3xl"
                    >
                      {formatRupiah(totalRepayment)}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#22C55E]" />

                      Perhitungan diperbarui otomatis
                    </div>
                  </div>
                </div>

                {/* Tombol pengajuan */}
                <Link
                  href="/auth/login"
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#F59E0B] px-5 py-4 font-bold text-white shadow-lg shadow-[#F59E0B]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#F59E0B]/30"
                >
                  Ajukan Gadai

                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <p className="text-center text-xs leading-5 text-slate-400">
                  Simulasi ini merupakan perkiraan berdasarkan tarif
                  sementara. Pengajuan mengikuti penilaian dan
                  ketentuan yang berlaku.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}