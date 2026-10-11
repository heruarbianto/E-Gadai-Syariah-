import { ArrowUpRight, BadgeCheck, ShieldCheck } from 'lucide-react';

const footerLinks = [
  { href: '#alur', label: 'Cara Gadai' },
  { href: '#simulasi', label: 'Simulasi Pembiayaan' },
  { href: '#lelang', label: 'Alur Lelang' },
];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t-4 border-[#0EA5A4] bg-[#075985] text-[#F8FAFC]">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-[#075985] via-[#075985] to-[#06466B]"
      />

      <div className="mx-auto max-w-7xl px-4 pb-7 pt-12 sm:px-6 sm:pb-8 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-5">
            <a
              href="#promo"
              aria-label="Gadai Syariah, kembali ke bagian promosi"
              className="group inline-flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0EA5A4]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0EA5A4] text-xl font-extrabold text-white shadow-lg shadow-black/10 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                G
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                Gadai Syariah
              </span>
            </a>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:text-base">
              Platform gadai terpercaya berbasis syariah. Amanah dalam menjaga
              barang Anda, transparan dalam setiap proses.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-xs font-semibold text-white/85">
              <BadgeCheck size={16} className="text-[#0EA5A4]" />
              Amanah dan transparan
            </div>
          </div>

          <nav aria-label="Navigasi footer" className="lg:col-span-3 lg:pt-1">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[#F59E0B]">
              Jelajahi
            </h2>
            <ul className="mt-4 space-y-1">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="group inline-flex min-h-10 items-center gap-2 text-sm font-medium text-white/75 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5A4] motion-reduce:transition-none"
                  >
                    <span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
                      {label}
                    </span>
                    <ArrowUpRight size={14} className="text-[#0EA5A4] opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sm:col-span-2 lg:col-span-4">
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0EA5A4]/15 text-[#0EA5A4]">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Keamanan Terjamin
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Barang jaminan diasuransikan dan disimpan di brankas khusus
                    dengan pengawasan ketat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} Gadai Syariah Non-Riba. All rights
            reserved.
          </p>
          <a
            href="#promo"
            className="inline-flex min-h-8 items-center gap-1.5 font-semibold text-white/75 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5A4]"
          >
            Kembali ke atas
            <ArrowUpRight size={14} className="-rotate-45 text-[#0EA5A4]" />
          </a>
        </div>
      </div>
    </footer>
  );
}