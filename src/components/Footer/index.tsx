"use client";

import { useEffect, useRef, useState } from "react";

export default function Footer() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  // Accessibility: focus trap, ESC to close, lock background scroll
  useEffect(() => {
    if (!isMenuOpen) {
      // Restore focus and unlock scroll
      if (previouslyFocusedRef.current) previouslyFocusedRef.current.focus?.();
      document.body.style.overflow = "";
      return;
    }

    previouslyFocusedRef.current = (document.activeElement as HTMLElement) || null;
    document.body.style.overflow = "hidden";

    const overlayEl = overlayRef.current;
    if (!overlayEl) return;

    const focusable = overlayEl.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
      } else if (e.key === "Tab" && focusable.length > 0) {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);
  return (
    <footer className="pointer-events-none">
      {/* Desktop/Tablet wide nav */}
      <nav className="hidden sm:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-3rem)] max-w-4xl h-[53px] rounded-full bg-glass-tint/40 backdrop-blur-md border border-white/10 items-center justify-center px-6 gap-x-4 md:gap-x-8 lg:gap-x-12 pointer-events-auto transition-colors duration-300">
        <a href="#" className="font-black text-xl lg:text-2xl leading-[120%] tracking-[-.015em] uppercase text-foreground text-center transition-colors duration-300 hover:text-brand-green hover:underline">Каталог</a>
        <a href="#" className="font-black text-xl lg:text-2xl leading-[120%] tracking-[-.015em] uppercase text-foreground text-center transition-colors duration-200 hover:text-brand-green hover:underline">История</a>
        <a href="#" className="font-black text-xl lg:text-2xl leading-[120%] tracking-[-.015em] uppercase text-foreground text-center transition-colors duration-200 hover:text-brand-green hover:underline">Коллаборации</a>
        <a href="#" className="font-black text-xl lg:text-2xl leading-[120%] tracking-[-.015em] uppercase text-foreground text-center transition-colors duration-200 hover:text-brand-green hover:underline">Контакты</a>
      </nav>

      {/* Mobile compact "Каталог" pill */}
      <div className="sm:hidden fixed bottom-4 right-2 z-10 pointer-events-auto" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button type="button" className="flex items-center gap-1 px-4 h-10 rounded-full border border-white/10 bg-glass-tint/60 backdrop-blur-[6px] font-black text-base leading-[120%] tracking-[-.08em] uppercase text-foreground text-center transition-colors duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/70">
          Каталог
        </button>
      </div>

      {/* Mobile left "меню" pill */}
      <div className="sm:hidden fixed bottom-4 left-2 z-10 pointer-events-auto" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <button
          type="button"
          onClick={openMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu-overlay"
          className="flex items-center gap-2 px-3 h-10 rounded-full border border-white/10 bg-glass-tint/60 backdrop-blur-[6px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/70"
        >
          {/* Simple hamburger icon */}
          <span className="relative inline-flex w-5 h-5">
            <span className="absolute left-[18.75%] right-[18.75%] top-[27.08%] h-[1.5px] bg-brand-green" />
            <span className="absolute left-[18.75%] right-[18.75%] top-1/2 -translate-y-1/2 h-[1.5px] bg-brand-green" />
            <span className="absolute left-[18.75%] right-[18.75%] bottom-[27.08%] h-[1.5px] bg-brand-green" />
          </span>
          <span className="font-black text-base leading-[120%] tracking-[-.08em] uppercase">меню</span>
        </button>
      </div>

      {/* Mobile overlay menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu-overlay"
          role="dialog"
          aria-modal="true"
          ref={overlayRef}
          className="sm:hidden fixed inset-0 z-20 bg-[rgba(27,27,27,0.8)] backdrop-blur-[6px] pointer-events-auto"
          onClick={(e) => { if (e.currentTarget === e.target) closeMenu(); }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Закрыть меню"
            className="absolute right-[10px] top-[10px] w-8 h-8 text-[#525252] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/70 rounded"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>

          {/* Menu without glass panel */}
          <nav
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-0 w-[320px] h-[694px] p-8 flex flex-col justify-end items-start gap-[120px]"
          >
            <a href="#" className="font-black text-[24px] leading-[120%] tracking-[-.015em] uppercase text-[#F5F5E6] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/70 rounded">Каталог</a>
            <a href="#" className="font-black text-[24px] leading-[120%] tracking-[-.015em] uppercase text-[#F5F5E6] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/70 rounded">История</a>
            <a href="#" className="font-black text-[24px] leading-[120%] tracking-[-.015em] uppercase text-[#F5F5E6] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/70 rounded">Коллаборации</a>
            <a href="#" className="font-black text-[24px] leading-[120%] tracking-[-.015em] uppercase text-[#F5F5E6] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/70 rounded">Контакты</a>
          </nav>
        </div>
      )}
    </footer>
  );
}