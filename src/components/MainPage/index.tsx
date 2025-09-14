"use client";

import Image from "next/image";


export default function MainPage() {
  return (
    <main className="relative flex items-center justify-center min-h-dvh">
      {/* Background image (responsive) */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <iframe
          src="https://kinescope.io/embed/9j7m6nXNxdNVB8sjsv5qhf?autoplay=true&muted=true&loop=true&playsinline=true&pip=false&controls=false&poster=false"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media;"
          frameBorder="0"
          allowFullScreen
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2"
        ></iframe>
      </div>
      {/* Overlay: opacity driven by theme variable (0 on light, >0 on dark) */}
      <div className="absolute inset-0 bg-glass-tint/90 pointer-events-none transition-opacity duration-300" style={{ opacity: "var(--overlay-opacity)" }} />
      {/* Foreground content: centered logo + light-theme blur glow */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* Blurred circle under logo (visible on light theme only) */}
        <div
          aria-hidden
          className="absolute rounded-full z-0 reduce-blur-when-motion"
          style={{
            width: "286px",
            height: "286px",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: "#303B2B",
            filter: "blur(100px)",
            opacity: "var(--logo-glow-opacity)",
            transition: "opacity 300ms ease",
          }}
        />
        {/* Mobile: width 60% of viewport, keep aspect ratio */}
        <Image
          src="/gang-logo.svg"
          alt="Gang Ground logo"
          width={320}
          height={120}
          priority
          sizes="(max-width: 640px) 60vw"
          className="relative z-10 app-logo pointer-events-none block sm:hidden w-[60vw] h-auto"
        />
        {/* ≥ sm: original proportions and responsive widths */}
        <Image
          src="/gang-logo.svg"
          alt="Gang Ground logo"
          width={320}
          height={120}
          priority
          sizes="(max-width: 1024px) 280px, 320px"
          className="relative z-10 app-logo pointer-events-none hidden sm:block w-[220px] md:w-[280px] lg:w-[320px] h-auto"
        />
      </div>
    </main>
  );
}