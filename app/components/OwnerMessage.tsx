"use client";

import React from "react";
import {
  Quote,
  ArrowUpRight,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

export default function OwnerMessage() {
  return (
    <section
      id="tentang-kami"
      className="relative isolate overflow-hidden bg-[#F8FAFC] py-16 sm:py-20 lg:py-28"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 -z-10 h-80 w-80 rounded-full bg-[#0EA5A4]/[0.07] blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-10 text-center sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0EA5A4]/20 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#075985]">
            <HeartHandshake size={16} className="text-[#0EA5A4]" />
            KOMITMEN KAMI
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#075985] sm:text-4xl lg:text-5xl">
            Lebih dari Sekadar{" "}
            <span className="text-[#0EA5A4]">Layanan Gadai</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            Menghadirkan solusi keuangan yang bertanggung jawab dengan
            mengutamakan transparansi, kepercayaan, dan prinsip syariah.
          </p>
        </div>

        {/* Main card */}
        <div className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-xl shadow-[#075985]/[0.06] sm:rounded-[36px]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Founder image */}
            <div className="relative min-h-[360px] overflow-hidden bg-[#075985] sm:min-h-[460px] lg:col-span-5 lg:min-h-[600px]">
              <img
                src="/owner.png"
                alt="Founder Gadai Syariah"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#075985]/95 via-[#075985]/15 to-[#075985]/5" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9 lg:p-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  <Sparkles size={14} className="text-[#F59E0B]" />
                  Visi & Komitmen
                </div>

                <p className="max-w-sm text-2xl font-bold leading-snug text-white sm:text-3xl">
                  Membangun kepercayaan melalui layanan yang bertanggung jawab.
                </p>

                <div className="mt-5 h-1 w-16 rounded-full bg-[#F59E0B]" />
              </div>

              {/* Image corner decoration */}
              <div
                aria-hidden="true"
                className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md sm:right-7 sm:top-7"
              >
                <ShieldCheck size={23} />
              </div>
            </div>

            {/* Founder message */}
            <div className="flex flex-col justify-center p-6 sm:p-9 lg:col-span-7 lg:p-12 xl:p-16">
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0EA5A4]/10 text-[#0EA5A4]">
                  <Quote size={25} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0EA5A4]">
                    Pesan dari Founder
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Sebuah komitmen untuk setiap nasabah
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-[#075985] sm:text-3xl lg:text-4xl">
                Membantu di Saat Membutuhkan,{" "}
                <span className="text-[#0EA5A4]">
                  dengan Bijaksana.
                </span>
              </h3>

              {/* Quote */}
              <blockquote className="relative mt-7 border-l-[3px] border-[#0EA5A4] pl-5 sm:pl-6">
                <p className="text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
                  "Gadai ini{" "}
                  <strong className="font-bold text-[#075985]">
                    bukan
                  </strong>{" "}
                  dibuat untuk Anda yang memang berniat untuk berutang
                  jangka panjang. Layanan ini kami hadirkan semata-mata
                  untuk membantu Anda yang sedang memiliki{" "}
                  <strong className="font-bold text-[#075985]">
                    kebutuhan mendesak
                  </strong>
                  , sementara hari gajian masih menghitung hari."
                </p>
              </blockquote>

              <p className="mt-6 text-sm leading-7 text-slate-500">
                Kami percaya bahwa layanan keuangan yang baik tidak hanya
                memberikan solusi, tetapi juga mengedepankan tanggung jawab
                dan pemahaman terhadap kebutuhan setiap nasabah.
              </p>

              {/* Founder identity */}
              <div className="mt-8 flex flex-col gap-5 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#075985] text-white shadow-lg shadow-[#075985]/15">
                    <span className="text-lg font-bold">HA</span>
                  </div>

                  <div>
                    <p className="font-bold text-[#075985]">
                      Heru Arbianto, S.Kom.
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Founder Gadai Syariah
                    </p>
                  </div>
                </div>

                <a
                  href="/tentang-kami"
                  className="group/link inline-flex items-center justify-center gap-2 self-start rounded-full border border-[#0EA5A4]/25 px-5 py-3 text-sm font-semibold text-[#075985] transition-all duration-300 hover:border-[#0EA5A4] hover:bg-[#0EA5A4]/5 sm:self-auto"
                >
                  Tentang Kami

                  <ArrowUpRight
                    size={17}
                    className="text-[#0EA5A4] transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                  />
                </a>
              </div>

              {/* Trust statement */}
              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[#0EA5A4]/15 bg-[#F8FAFC] p-4">
                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-[#0EA5A4]"
                />

                <p className="text-xs leading-6 text-slate-600 sm:text-sm">
                  <strong className="text-[#075985]">
                    Mengutamakan transparansi.
                  </strong>{" "}
                  Setiap proses dijelaskan agar nasabah memahami
                  ketentuan layanan sebelum mengambil keputusan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @media (prefers-reduced-motion: no-preference) {
          .group {
            animation: ownerFadeIn 0.7s ease-out both;
          }
        }

        @keyframes ownerFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(*) {
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </section>
  );
}