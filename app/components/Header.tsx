'use client';

import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { href: '#alur', label: 'Cara Gadai' },
  { href: '#simulasi', label: 'Simulasi' },
  { href: '#lelang', label: 'Alur Lelang' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#075985]/[0.08] bg-[#F8FAFC]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link
          href="/"
          aria-label="Gadai Syariah, halaman utama"
          className="group inline-flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0EA5A4]"
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0EA5A4] text-white shadow-md shadow-[#0EA5A4]/20 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 sm:h-11 sm:w-11">
            <span className="text-xl font-extrabold">G</span>
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[#F8FAFC] bg-[#075985]" />
          </span>
          <span className="truncate text-base font-extrabold tracking-tight text-[#075985] sm:text-lg">
            Gadai Syariah
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-4 py-2.5 text-sm font-semibold text-[#075985]/75 transition-colors duration-200 hover:bg-[#0EA5A4]/10 hover:text-[#075985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5A4]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/auth/login"
            className="group inline-flex items-center gap-2 rounded-full bg-[#075985] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#075985]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0EA5A4] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0EA5A4]"
          >
            Ajukan Sekarang
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#075985]/10 text-[#075985] transition-colors duration-200 hover:bg-[#0EA5A4]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5A4] lg:hidden"
        >
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      <div
        id="mobile-navigation"
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${isMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'pointer-events-none grid-rows-[0fr] opacity-0'}`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="overflow-hidden border-t border-[#075985]/[0.08] bg-[#F8FAFC] px-4 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 py-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                tabIndex={isMenuOpen ? 0 : -1}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#075985]/80 transition-colors duration-200 hover:bg-[#0EA5A4]/10 hover:text-[#075985] focus-visible:outline-2 focus-visible:outline-[#0EA5A4]"
              >
                {label}
              </Link>
            ))}
            <Link 
              href="/pengajuan"
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
              className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#075985] px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#0EA5A4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5A4]"
            >
              Ajukan Sekarang
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}