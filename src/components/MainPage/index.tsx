"use client";

import Image from "next/image";


export default function MainPage() {
  return (
    <main className="relative flex items-center justify-center min-h-dvh">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: "url('/main-bg.jpg')" }}
      />
      {/* Overlay (hidden on light theme via CSS var, visible in dark) */}
      <div className="absolute inset-0 bg-glass-tint/90 pointer-events-none transition-opacity duration-300" style={{ opacity: "var(--overlay-opacity)" }} />
      {/* Foreground content: centered logo */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <Image
          src="/gang-logo.svg"
          alt="Gang Ground logo"
          width={320}
          height={120}
          priority
          className="app-logo pointer-events-none w-[220px] md:w-[280px] lg:w-[320px] h-auto"
        />
      </div>
    </main>
  );
}
