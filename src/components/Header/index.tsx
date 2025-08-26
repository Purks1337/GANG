"use client";

import { useEffect, useState } from "react";
import { applyTheme, setStoredTheme } from "@/utils/theme";

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeDasharray="2" strokeDashoffset="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M12 19v1M19 12h1M12 5v-1M5 12h-1">
          <animate fill="freeze" attributeName="d" begin="1.2s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1" />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.2s" dur="0.2s" values="2;0" />
        </path>
        <path d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5">
          <animate fill="freeze" attributeName="d" begin="1.4s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5" />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.4s" dur="0.2s" values="2;0" />
        </path>
      </g>
      <g fill="currentColor">
        <path d="M15.22 6.03L17.75 4.09L14.56 4L13.5 1L12.44 4L9.25 4.09L11.78 6.03L10.87 9.09L13.5 7.28L16.13 9.09L15.22 6.03Z">
          <animate fill="freeze" attributeName="fill-opacity" dur="0.4s" values="1;0" />
        </path>
        <path d="M19.61 12.25L21.25 11L19.19 10.95L18.5 9L17.81 10.95L15.75 11L17.39 12.25L16.8 14.23L18.5 13.06L20.2 14.23L19.61 12.25Z">
          <animate fill="freeze" attributeName="fill-opacity" begin="0.2s" dur="0.4s" values="1;0" />
        </path>
      </g>
      <path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z">
        <set fill="freeze" attributeName="opacity" begin="0.6s" to="0" />
      </path>
      <mask id="SVGBZ2FMbRt"><circle cx="12" cy="12" r="12" fill="#fff" /><circle cx="18" cy="6" r="12" fill="#fff"><animate fill="freeze" attributeName="cx" begin="0.6s" dur="0.4s" values="18;22" /><animate fill="freeze" attributeName="cy" begin="0.6s" dur="0.4s" values="6;2" /><animate fill="freeze" attributeName="r" begin="0.6s" dur="0.4s" values="12;3" /></circle><circle cx="18" cy="6" r="10"><animate fill="freeze" attributeName="cx" begin="0.6s" dur="0.4s" values="18;22" /><animate fill="freeze" attributeName="cy" begin="0.6s" dur="0.4s" values="6;2" /><animate fill="freeze" attributeName="r" begin="0.6s" dur="0.4s" values="10;1" /></circle></mask>
      <circle cx="12" cy="12" r="10" mask="url(#SVGBZ2FMbRt)" opacity="0" fill="currentColor">
        <animate fill="freeze" attributeName="r" begin="0.6s" dur="0.4s" values="10;6" />
        <set fill="freeze" attributeName="opacity" begin="0.6s" to="1" />
      </circle>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeDasharray="4" strokeDashoffset="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1">
        <path d="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5">
          <animate id="SVGfDZ7Me6J" fill="freeze" attributeName="stroke-dashoffset" begin="0.6s;SVGfDZ7Me6J.begin+6s" dur="0.4s" values="4;0" />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="SVGfDZ7Me6J.begin+2s;SVGfDZ7Me6J.begin+4s" dur="0.4s" values="4;0" />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="SVGfDZ7Me6J.begin+1.2s;SVGfDZ7Me6J.begin+3.2s;SVGfDZ7Me6J.begin+5.2s" dur="0.4s" values="0;4" />
          <set fill="freeze" attributeName="d" begin="SVGfDZ7Me6J.begin+1.8s" to="M12 5h1.5M12 5h-1.5M12 5v1.5M12 5v-1.5" />
          <set fill="freeze" attributeName="d" begin="SVGfDZ7Me6J.begin+3.8s" to="M12 4h1.5M12 4h-1.5M12 4v1.5M12 4v-1.5" />
          <set fill="freeze" attributeName="d" begin="SVGfDZ7Me6J.begin+5.8s" to="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5" />
        </path>
        <path d="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5">
          <animate id="SVGPKl0xTXr" fill="freeze" attributeName="stroke-dashoffset" begin="1s;SVGPKl0xTXr.begin+6s" dur="0.4s" values="4;0" />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="SVGPKl0xTXr.begin+2s;SVGPKl0xTXr.begin+4s" dur="0.4s" values="4;0" />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="SVGPKl0xTXr.begin+1.2s;SVGPKl0xTXr.begin+3.2s;SVGPKl0xTXr.begin+5.2s" dur="0.4s" values="0;4" />
          <set fill="freeze" attributeName="d" begin="SVGPKl0xTXr.begin+1.8s" to="M17 11h1.5M17 11h-1.5M17 11v1.5M17 11v-1.5" />
          <set fill="freeze" attributeName="d" begin="SVGPKl0xTXr.begin+3.8s" to="M18 12h1.5M18 12h-1.5M18 12v1.5M18 12v-1.5" />
          <set fill="freeze" attributeName="d" begin="SVGPKl0xTXr.begin+5.8s" to="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5" />
        </path>
        <path d="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5">
          <animate id="SVGCevt2bLQ" fill="freeze" attributeName="stroke-dashoffset" begin="2.8s;SVGCevt2bLQ.begin+6s" dur="0.4s" values="4;0" />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="SVGCevt2bLQ.begin+2s" dur="0.4s" values="4;0" />
          <animate fill="freeze" attributeName="stroke-dashoffset" begin="SVGCevt2bLQ.begin+1.2s;SVGCevt2bLQ.begin+3.2s" dur="0.4s" values="0;4" />
          <set fill="freeze" attributeName="d" begin="SVGCevt2bLQ.begin+1.8s" to="M20 5h1.5M20 5h-1.5M20 5v1.5M20 5v-1.5" />
          <set fill="freeze" attributeName="d" begin="SVGCevt2bLQ.begin+5.8s" to="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5" />
        </path>
      </g>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <g>
          <path strokeDasharray="2" strokeDashoffset="4" d="M12 21v1M21 12h1M12 3v-1M3 12h-1">
            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="4;2" />
          </path>
          <path strokeDasharray="2" strokeDashoffset="4" d="M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5">
            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="4;2" />
          </path>
          <set fill="freeze" attributeName="opacity" begin="0.5s" to="0" />
        </g>
        <path fill="currentColor" d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z" opacity="0">
          <set fill="freeze" attributeName="opacity" begin="0.5s" to="1" />
        </path>
      </g>
      <mask id="SVGlre7ZcDF"><circle cx="12" cy="12" r="12" fill="#fff" /><circle cx="22" cy="2" r="3" fill="#fff"><animate fill="freeze" attributeName="cx" begin="0.1s" dur="0.4s" values="22;18" /><animate fill="freeze" attributeName="cy" begin="0.1s" dur="0.4s" values="2;6" /><animate fill="freeze" attributeName="r" begin="0.1s" dur="0.4s" values="3;12" /></circle><circle cx="22" cy="2" r="1"><animate fill="freeze" attributeName="cx" begin="0.1s" dur="0.4s" values="22;18" /><animate fill="freeze" attributeName="cy" begin="0.1s" dur="0.4s" values="2;6" /><animate fill="freeze" attributeName="r" begin="0.1s" dur="0.4s" values="1;10" /></circle></mask>
      <circle cx="12" cy="12" r="6" mask="url(#SVGlre7ZcDF)" fill="currentColor">
        <animate fill="freeze" attributeName="r" begin="0.1s" dur="0.4s" values="6;10" />
        <set fill="freeze" attributeName="opacity" begin="0.5s" to="0" />
      </circle>
    </svg>
  );
}

export default function Header() {
  const [isNight, setIsNight] = useState(true);

  // Initialize local switch state from current DOM/theme
  useEffect(() => {
    const root = document.documentElement;
    const hasDark = root.classList.contains("theme-dark");
    setIsNight(hasDark);
  }, []);

  const label = isNight ? "Night Worker" : "Day Worker";

  const handleToggle = () => {
    const next = isNight ? "light" : "dark";
    applyTheme(next);
    setStoredTheme(next);
    setIsNight(!isNight);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 p-0">
      <div className="relative sm:flex sm:justify-between sm:items-center sm:max-w-screen-xl sm:mx-auto sm:gap-4 sm:p-6 lg:max-w-none lg:mx-0 lg:w-full lg:px-6">
        {/* Theme Switcher (top-left on mobile) */}
        <button
          type="button"
          aria-pressed={isNight}
          aria-label="Toggle theme"
          onClick={handleToggle}
          className="group absolute left-2 top-4 sm:static flex items-center gap-2 sm:gap-[8px] px-3 sm:px-[16px] sm:py-[12px] h-10 sm:h-auto rounded-full border border-white/10 bg-glass-tint/60 sm:bg-glass-tint/40 backdrop-blur-[6px] sm:backdrop-blur-md pointer-events-auto transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/70"
          style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <span className="inline-flex items-center justify-center w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-brand-green text-black">
            {isNight ? <MoonIcon /> : <SunIcon />}
          </span>
          <span className="font-black text-base leading-[120%] tracking-[-.08em] uppercase text-foreground transition-colors duration-200 group-hover:text-brand-green group-hover:underline sm:text-2xl">
            {label}
          </span>
        </button>

        {/* Cart (top-right on mobile) */}
        <button
          type="button"
          aria-label="Открыть корзину"
          className="group absolute right-2 top-4 sm:static flex items-center gap-2 sm:gap-2 px-4 sm:px-[16px] sm:py-[12px] h-10 sm:h-auto rounded-full border border-white/10 bg-glass-tint/60 sm:bg-glass-tint/40 backdrop-blur-[6px] sm:backdrop-blur-md pointer-events-auto transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/70"
          style={{ top: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <span className="font-black text-base leading-[120%] tracking-[-.08em] uppercase text-foreground transition-colors duration-200 group-hover:text-brand-green group-hover:underline sm:text-2xl">КОРЗИНА</span>
          <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-green text-black text-base sm:text-[20px] font-black">0</span>
        </button>
      </div>
    </header>
  );
}