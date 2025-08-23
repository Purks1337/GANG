export default function Footer() {
  return (
    <footer className="pointer-events-none">
      {/* Figma: absolute, 870x53, centered, bottom 24px, padding 12px 48px, gap 48px, radius 100px */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 w-[870px] h-[53px] rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center px-12 gap-12 pointer-events-auto">
        <a
          href="#"
          className="font-black text-[24px] leading-[120%] tracking-[-.015em] uppercase text-white text-center transition-colors duration-200 hover:text-brand-green hover:underline"
        >
          Каталог
        </a>
        <a
          href="#"
          className="font-black text-[24px] leading-[120%] tracking-[-.015em] uppercase text-white text-center transition-colors duration-200 hover:text-brand-green hover:underline"
        >
          История
        </a>
        <a
          href="#"
          className="font-black text-[24px] leading-[120%] tracking-[-.015em] uppercase text-white text-center transition-colors duration-200 hover:text-brand-green hover:underline"
        >
          Коллаборации
        </a>
        <a
          href="#"
          className="font-black text-[24px] leading-[120%] tracking-[-.015em] uppercase text-white text-center transition-colors duration-200 hover:text-brand-green hover:underline"
        >
          Контакты
        </a>
      </nav>
    </footer>
  );
}
