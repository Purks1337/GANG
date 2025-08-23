"use client";

import Image from "next/image";


export default function MainPage() {
  return (
    <main className="relative flex items-center justify-center min-h-dvh">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/main-bg.jpg')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      {/* Foreground content: centered logo */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <Image
          src="/gang-logo.svg"
          alt="Gang Ground logo"
          width={320}
          height={120}
          priority
          className="pointer-events-none w-[220px] md:w-[280px] lg:w-[320px] h-auto"
        />
      </div>
    </main>
  );
}
