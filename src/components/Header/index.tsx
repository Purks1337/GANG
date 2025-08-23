"use client";

import { useEffect, useState } from "react";
import { applyTheme, setStoredTheme } from "@/utils/theme";

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
    <header className="fixed top-0 left-0 right-0 z-20 p-6">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto gap-4">
        {/* Theme Switcher (top-left) */}
        <button
          type="button"
          aria-pressed={isNight}
          onClick={handleToggle}
          className="flex items-center gap-[8px] px-[16px] py-[12px] rounded-full border border-white/10 bg-glass-tint/40 backdrop-blur-md pointer-events-auto transition-colors duration-300"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-green">
            <img src="/switch-icon.svg" alt="Switch theme" className="w-5 h-5" />
          </span>
          <span className="font-black text-2xl tracking-[-.08em] uppercase text-white">
            {label}
          </span>
        </button>

        {/* Cart (top-right) */}
        <div className="flex items-center gap-2 pl-4 pr-4 py-2 rounded-full border border-white/10 bg-glass-tint/40 backdrop-blur-md pointer-events-auto select-none transition-colors duration-300">
          <span className="font-black text-2xl tracking-[-.08em] uppercase text-white">Корзина</span>
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-green text-black text-[20px] font-black">0</span>
        </div>
      </div>
    </header>
  );
}
