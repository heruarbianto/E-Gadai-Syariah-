import React from 'react';
import Header from './components/Header';
import PromoBanner from './components/PromoBanner';
import PawnProcess from './components/PawnProcess';
import Simulation from './components/Simulation';
import AuctionProcess from './components/AuctionProcess';
import Footer from './components/Footer';
import OwnerMessage from './components/OwnerMessage';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 scroll-smooth">
      {/* 1. Detail Web / Navigasi */}
      <Header />
      
      {/* 2. Banner Slide Promosi */}
      <PromoBanner />
      
      {/* 3. Pesan Owner */}
      <OwnerMessage />
      
      {/* 4. Alur Proses Gadai */}
      <PawnProcess />
      
      {/* 5. Simulasi & Penjelasan Aturan Denda */}
      <Simulation />
      
      {/* 6. Alur Lelang */}
      <AuctionProcess />
      
      {/* 7. Footer & Penunjang Kepercayaan */}
      <Footer />
    </main>
  );
}