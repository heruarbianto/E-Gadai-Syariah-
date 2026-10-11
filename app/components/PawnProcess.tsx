"use client";

import React from "react";
import {
  FileText,
  ClipboardCheck,
  PackageCheck,
  ShieldCheck,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Pengajuan Online",
    desc: "Lengkapi formulir pengajuan, unggah foto KTP, dan sertakan foto serta detail barang jaminan.",
    icon: FileText,
    label: "Mulai pengajuan",
  },
  {
    number: "02",
    title: "Penilaian Barang",
    desc: "Tim kami menilai barang jaminan secara online dan memberikan hasil penaksiran beserta persetujuan.",
    icon: ClipboardCheck,
    label: "Proses penaksiran",
  },
  {
    number: "03",
    title: "Serahkan Barang",
    desc: "Setelah pengajuan disetujui, bawa barang jaminan ke cabang kami maksimal dalam 3 hari.",
    icon: PackageCheck,
    label: "Maksimal 3 hari",
  },
  {
    number: "04",
    title: "Inspeksi & Akad",
    desc: "Petugas memeriksa kesesuaian fisik barang. Jika sesuai, proses dilanjutkan dengan akad syariah.",
    icon: ShieldCheck,
    label: "Akad syariah",
  },
  {
    number: "05",
    title: "Pencairan Dana",
    desc: "Dana pembiayaan dicairkan secara tunai atau ditransfer langsung ke rekening Anda.",
    icon: Wallet,
    label: "Dana dicairkan",
  },
];

export default function PawnProcess() {
  return (
    <section
      id="alur"
      className="relative isolate overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-20 -z-10 h-72 w-72 rounded-full bg-[#0EA5A4]/[0.06] blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#0EA5A4]/20 bg-[#F8FAFC] px-4 py-2 text-xs font-semibold tracking-wide text-[#075985] sm:text-sm">
            <CheckCircle2
              size={16}
              className="text-[#0EA5A4]"
            />
            MUDAH, AMAN & TRANSPARAN
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-[#075985] sm:text-4xl lg:text-5xl">
            Cara Mudah Gadai{" "}
            <span className="text-[#0EA5A4]">Syariah</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Dari pengajuan hingga pencairan dana, ikuti lima langkah mudah
            dengan proses yang jelas dan transparan.
          </p>
        </div>

        {/* Process timeline */}
        <div className="relative">
          {/* Desktop connector */}
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-[43px] hidden h-[2px] bg-[#0EA5A4]/20 lg:block"
          >
            <div className="h-full w-full origin-left animate-[grow_1.2s_ease-out_both] bg-[#0EA5A4]/60" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-5 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  style={{
                    animationDelay: `${index * 120}ms`,
                  }}
                  className="process-card group relative animate-[fadeUp_0.65s_ease-out_both] rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0EA5A4]/40 hover:shadow-xl hover:shadow-[#075985]/[0.07] sm:p-6 lg:border-transparent lg:bg-transparent lg:p-3 lg:shadow-none lg:hover:border-[#0EA5A4]/20 lg:hover:bg-[#F8FAFC]/70 lg:hover:shadow-lg"
                >
                  {/* Mobile connector */}
                  {index !== steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute -bottom-5 left-[39px] top-[88px] z-0 w-px bg-[#0EA5A4]/25 sm:hidden"
                    />
                  )}

                  <div className="relative z-10 flex items-start gap-4 sm:flex-col sm:items-center sm:text-center">
                    {/* Icon and number */}
                    <div className="relative shrink-0">
                      <div className="flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-[#0EA5A4]/20 bg-[#F8FAFC] text-[#0EA5A4] shadow-sm transition-all duration-300 group-hover:border-[#0EA5A4] group-hover:bg-[#0EA5A4] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#0EA5A4]/20 sm:h-[86px] sm:w-[86px] sm:rounded-[26px]">
                        <Icon
                          size={30}
                          strokeWidth={1.7}
                          className="transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9"
                        />
                      </div>

                      <span className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full border-2 border-white bg-[#075985] px-1.5 text-[10px] font-bold text-white shadow-sm">
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pt-1 sm:w-full sm:flex-none sm:pt-5">
                      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[10px] font-semibold text-[#0EA5A4] sm:mb-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5A4]" />
                        {step.label}
                      </div>

                      <h3 className="text-base font-bold leading-snug text-[#075985] transition-colors duration-300 group-hover:text-[#0EA5A4] sm:min-h-[48px] sm:text-lg">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Next-step indicator on mobile */}
                  {index !== steps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="ml-[84px] mt-4 flex items-center gap-2 text-[11px] font-medium text-slate-400 sm:hidden"
                    >
                      <ArrowRight
                        size={13}
                        className="text-[#0EA5A4]"
                      />
                      Lanjut ke tahap berikutnya
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom information */}
        <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[#0EA5A4]/15 bg-[#F8FAFC] p-5 sm:mt-14 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0EA5A4] shadow-sm">
              <Clock3 size={22} />
            </div>

            <div>
              <h3 className="font-bold text-[#075985]">
                Proses yang jelas di setiap tahap
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Siapkan dokumen dan barang jaminan agar pengajuan berjalan
                lebih lancar.
              </p>
            </div>
          </div>

          <Link
            href="/auth/login"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#075985] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#075985]/90 hover:shadow-lg hover:shadow-[#075985]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4] focus-visible:ring-offset-2"
          >
            Ajukan Sekarang
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes grow {
          from {
            transform: scaleX(0);
          }

          to {
            transform: scaleX(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .process-card {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}