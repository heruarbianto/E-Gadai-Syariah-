"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Check,
  ChevronRight,
  Clock3,
  Coins,
  Gavel,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";

const slides = [
  {
    eyebrow: "SOLUSI PEMBIAYAAN SYARIAH",
    badge: "Mudah & Transparan",
    title: "Solusi Dana Darurat,",
    highlight: "Tanpa Riba.",
    description:
      "Manfaatkan barang berharga sebagai jaminan untuk mendapatkan pembiayaan dengan proses yang transparan dan sesuai prinsip syariah.",
    primaryLabel: "Mulai Simulasi",
    primaryHref: "/simulasi",
    secondaryLabel: "Pelajari Proses",
    secondaryHref: "#alur",
    visual: "financing",
    visualLabel: "Simulasi Pembiayaan",
    visualDescription: "Gambaran estimasi nilai pembiayaan",
  },
  {
    eyebrow: "LELANG TERBUKA",
    badge: "Kesempatan Menarik",
    title: "Temukan Barang,",
    highlight: "Ajukan Penawaran.",
    description:
      "Jelajahi daftar barang lelang, pelajari informasinya, dan ajukan penawaran sesuai ketentuan yang berlaku.",
    primaryLabel: "Jelajahi Lelang",
    primaryHref: "/lelang",
    secondaryLabel: "Lihat Alur Lelang",
    secondaryHref: "#lelang",
    visual: "auction",
    visualLabel: "Lelang Syariah",
    visualDescription: "Informasi lelang dalam satu tempat",
  },
  {
    eyebrow: "AMAN & TERPERCAYA",
    badge: "Proses Transparan",
    title: "Setiap Langkah,",
    highlight: "Lebih Terarah.",
    description:
      "Ketahui tahapan pengajuan, penilaian barang, akad, hingga pencairan dana melalui proses yang tersusun dengan jelas.",
    primaryLabel: "Lihat Cara Kerja",
    primaryHref: "#alur",
    secondaryLabel: "Mulai Pengajuan",
    secondaryHref: "/pengajuan",
    visual: "security",
    visualLabel: "Proses Terstruktur",
    visualDescription: "Kenali setiap tahap pengajuan",
  },
];

type Slide = (typeof slides)[number];

function FinancingVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      {/* Decorative circles */}
      <div
        aria-hidden="true"
        className="absolute -right-4 -top-8 h-36 w-36 rounded-full border border-white/10 sm:h-48 sm:w-48"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-5 -left-5 h-28 w-28 rounded-full bg-[#0EA5A4]/20 blur-2xl sm:h-40 sm:w-40"
      />

      {/* Main card */}
      <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-white p-5 text-[#075985] shadow-2xl shadow-black/15 sm:rounded-[32px] sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#0EA5A4]">
                <Wallet size={17} />
              </span>
              Simulasi Pembiayaan
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Estimasi nilai pembiayaan
            </p>

            <h3 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Rp 5.000.000
            </h3>
          </div>

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0EA5A4]/10 text-[#0EA5A4]">
            <Coins size={21} />
          </span>
        </div>

        {/* Example collateral */}
        <div className="mt-6 flex items-center gap-4 rounded-2xl bg-[#F8FAFC] p-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-[#075985] shadow-sm">
            <Sparkles size={27} strokeWidth={1.6} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">Barang Jaminan</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Contoh ilustrasi nilai taksiran
            </p>
          </div>

          <BadgeCheck
            size={21}
            className="shrink-0 text-[#0EA5A4]"
          />
        </div>

        {/* Process indicator */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">
              Tahapan Pengajuan
            </span>
            <span className="text-[#0EA5A4]">5 langkah</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-1.5 flex-1 rounded-full bg-[#0EA5A4]/20"
              >
                <div className="h-full w-full rounded-full bg-[#0EA5A4]" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
          <ShieldCheck size={17} className="shrink-0 text-[#0EA5A4]" />
          Nilai aktual mengikuti hasil penaksiran dan ketentuan yang berlaku.
        </div>
      </div>

      {/* Floating notification */}
      <div className="absolute -bottom-5 -left-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xl sm:-left-8 sm:p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0EA5A4]/10 text-[#0EA5A4]">
          <Check size={21} strokeWidth={2.5} />
        </div>

        <div>
          <p className="text-xs font-bold text-[#075985]">
            Proses Transparan
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Informasi di setiap tahap
          </p>
        </div>
      </div>
    </div>
  );
}

function AuctionVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <div className="absolute inset-5 rounded-full bg-[#0EA5A4]/15 blur-3xl" />

      <div className="relative rounded-[28px] border border-white/15 bg-white p-5 shadow-2xl shadow-black/15 sm:rounded-[32px] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Etalase Lelang
            </p>
            <h3 className="mt-1 text-xl font-extrabold text-[#075985]">
              Pilihan Barang
            </h3>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0EA5A4]/10 px-3 py-1.5 text-[10px] font-bold text-[#0EA5A4]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#0EA5A4]" />
            Terbuka
          </span>
        </div>

        {/* Example auction item */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
          <div className="relative flex h-40 items-center justify-center overflow-hidden bg-[#F8FAFC] sm:h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5A4]/10 via-transparent to-[#075985]/10" />

            <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white bg-white/80 text-[#075985] shadow-lg backdrop-blur-sm transition-transform duration-500 hover:rotate-6 hover:scale-105">
              <Gavel size={43} strokeWidth={1.4} />
            </div>

            <div className="absolute bottom-3 left-3 rounded-lg bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-[#075985] shadow-sm">
              Ilustrasi Barang Lelang
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-[#075985]">
                  Informasi Barang
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Detail dan ketentuan lelang
                </p>
              </div>

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#0EA5A4]">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </div>
        </div>

        {/* Auction process */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { icon: ShieldCheck, label: "Transparan" },
            { icon: Gavel, label: "Penawaran" },
            { icon: BadgeCheck, label: "Ketentuan" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl bg-[#F8FAFC] px-2 py-3 text-center"
            >
              <Icon size={19} className="text-[#0EA5A4]" />
              <span className="text-[10px] font-semibold text-slate-600">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-5 -right-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xl sm:-right-6 sm:p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#075985]/10 text-[#075985]">
          <Gavel size={20} />
        </div>

        <div>
          <p className="text-xs font-bold text-[#075985]">
            Lelang Terbuka
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Pelajari sebelum menawar
          </p>
        </div>
      </div>
    </div>
  );
}

function SecurityVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      <div className="absolute inset-8 rounded-full bg-[#0EA5A4]/15 blur-3xl" />

      <div className="relative rounded-[28px] border border-white/15 bg-white p-5 shadow-2xl shadow-black/15 sm:rounded-[32px] sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0EA5A4]/10 text-[#0EA5A4]">
            <ShieldCheck size={27} />
          </div>

          <div>
            <h3 className="font-bold text-[#075985]">
              Alur Pengajuan
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Kenali tahapan prosesnya
            </p>
          </div>
        </div>

        <div className="relative mt-7 space-y-0">
          <div className="absolute bottom-7 left-[17px] top-7 w-px bg-[#0EA5A4]/25" />

          {[
            {
              title: "Pengajuan Online",
              desc: "Lengkapi data dan dokumen",
              icon: Banknote,
            },
            {
              title: "Penilaian Barang",
              desc: "Proses penaksiran dan persetujuan",
              icon: ShieldCheck,
            },
            {
              title: "Inspeksi & Akad",
              desc: "Pemeriksaan fisik dan akad",
              icon: BadgeCheck,
            },
            {
              title: "Pencairan Dana",
              desc: "Sesuai hasil proses dan ketentuan",
              icon: Wallet,
            },
          ].map(({ title, desc, icon: Icon }, index) => (
            <div
              key={title}
              className="relative flex items-start gap-4 py-3"
            >
              <div
                className={`relative z-10 flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-xl ${
                  index === 3
                    ? "bg-[#075985] text-white"
                    : "border border-[#0EA5A4]/20 bg-[#F8FAFC] text-[#0EA5A4]"
                }`}
              >
                <Icon size={17} />
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <h4 className="text-sm font-bold text-[#075985]">
                  {title}
                </h4>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {desc}
                </p>
              </div>

              {index === 3 && (
                <Check
                  size={17}
                  className="mt-1 shrink-0 text-[#0EA5A4]"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#F8FAFC] p-4">
          <Clock3 size={21} className="shrink-0 text-[#0EA5A4]" />

          <p className="text-xs leading-5 text-slate-600">
            Pelajari setiap persyaratan agar proses pengajuan lebih terarah.
          </p>
        </div>
      </div>

      <div className="absolute -bottom-5 -left-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xl sm:-left-6 sm:p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0EA5A4]/10 text-[#0EA5A4]">
          <Check size={21} />
        </div>

        <div>
          <p className="text-xs font-bold text-[#075985]">
            Informasi Jelas
          </p>
          <p className="mt-1 text-[10px] text-slate-500">
            Dari awal hingga selesai
          </p>
        </div>
      </div>
    </div>
  );
}

function SlideVisual({ slide }: { slide: Slide }) {
  switch (slide.visual) {
    case "auction":
      return <AuctionVisual />;

    case "security":
      return <SecurityVisual />;

    default:
      return <FinancingVisual />;
  }
}

export default function PromoBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const activeSlide = slides[activeIndex];

  const goToSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const nextSlide = () => {
    goToSlide(activeIndex + 1);
  };

  const previousSlide = () => {
    goToSlide(activeIndex - 1);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const difference = touchStartX.current - endX;

    if (Math.abs(difference) > 50) {
      if (difference > 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }

    touchStartX.current = null;
  };

  return (
    <section
      id="promo"
      aria-label="Promosi dan informasi layanan"
      aria-roledescription="carousel"
      className="relative isolate overflow-hidden bg-[#075985] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full border border-white/[0.07] sm:h-[600px] sm:w-[600px]" />

        <div className="absolute -right-20 -top-20 h-[350px] w-[350px] rounded-full border border-white/[0.07] sm:h-[450px] sm:w-[450px]" />

        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#0EA5A4]/10 blur-3xl" />

        <div className="absolute right-[35%] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#0EA5A4]/10 blur-3xl" />

        <div className="absolute inset-0 bg-gradient-to-br from-[#075985] via-[#075985] to-[#06466B]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative grid min-h-[650px] grid-cols-1 items-center gap-16 py-16 sm:py-20 lg:min-h-[690px] lg:grid-cols-2 lg:gap-12 lg:py-20">
          {/* Left: content */}
          <div
            key={`content-${activeIndex}`}
            className="relative z-10 mx-auto w-full max-w-2xl animate-[promoFadeIn_0.55s_ease-out_both] text-center lg:mx-0 lg:text-left"
          >
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 backdrop-blur-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F59E0B] text-white">
                <Sparkles size={14} />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 sm:text-xs">
                {activeSlide.eyebrow}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[2.55rem] font-extrabold leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.1] lg:text-6xl xl:text-[4.25rem]">
              {activeSlide.title}
              <span className="mt-1 block text-[#0EA5A4]">
                {activeSlide.highlight}
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#F8FAFC]/75 sm:text-base sm:leading-8 lg:mx-0 lg:text-lg">
              {activeSlide.description}
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <a
                href={activeSlide.primaryHref}
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#0EA5A4] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0EA5A4]/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#075985]"
              >
                {activeSlide.primaryLabel}

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>

              <a
                href={activeSlide.secondaryHref}
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#075985]"
              >
                {activeSlide.secondaryLabel}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-white/70 sm:gap-x-7 lg:justify-start">
              <div className="inline-flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#0EA5A4]" />
                <span>Proses Transparan</span>
              </div>

              <div className="inline-flex items-center gap-2">
                <BadgeCheck size={16} className="text-[#0EA5A4]" />
                <span>Prinsip Syariah</span>
              </div>
            </div>

            {/* Mobile navigation */}
            <div className="mt-10 flex items-center justify-center gap-4 lg:hidden">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Slide sebelumnya"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ArrowLeft size={17} />
              </button>

              <div
                className="flex items-center gap-2"
                aria-label={`Slide ${activeIndex + 1} dari ${slides.length}`}
              >
                {slides.map((slide, index) => (
                  <button
                    key={slide.visual}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Tampilkan slide ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-8 bg-[#0EA5A4]"
                        : "w-2 bg-white/35 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Slide berikutnya"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* Right: changing visual */}
          <div
            key={`visual-${activeIndex}`}
            className="relative z-10 mx-auto w-full max-w-lg animate-[promoVisualIn_0.7s_ease-out_both] px-2 pb-7 pt-2 sm:px-6 lg:my-8 lg:px-2"
          >
            <div className="mb-8 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0EA5A4] sm:text-xs">
                  {activeSlide.badge}
                </p>

                <p className="mt-1.5 text-sm font-semibold text-white/90 sm:text-base">
                  {activeSlide.visualLabel}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#22C55E]" />

                <span className="text-[10px] font-medium text-white/80 sm:text-xs">
                  Informasi Layanan
                </span>
              </div>
            </div>

            <SlideVisual slide={activeSlide} />

            <p className="mt-9 text-center text-xs leading-6 text-white/45 lg:text-right">
              {activeSlide.visualDescription}
            </p>
          </div>

          {/* Desktop navigation */}
          <div className="absolute bottom-8 left-0 right-0 hidden items-center justify-between border-t border-white/10 pt-5 lg:flex">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold tracking-widest text-white/80">
                {String(activeIndex + 1).padStart(2, "0")}
                <span className="mx-2 text-white/30">/</span>
                {String(slides.length).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.visual}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Tampilkan slide ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "w-10 bg-[#0EA5A4]"
                        : "w-4 bg-white/25 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>

              <span className="text-xs text-white/45">
                {activeSlide.badge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Slide sebelumnya"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ArrowLeft size={17} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Slide berikutnya"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0EA5A4] text-white transition-all duration-300 hover:bg-[#0EA5A4]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom transition */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0EA5A4]/60 to-transparent"
      />

      <style jsx>{`
        @keyframes promoFadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes promoVisualIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
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