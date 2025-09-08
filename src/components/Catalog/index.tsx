"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  slug: string;
}

interface ApiProductItem {
  id: string;
  name: string;
  slug: string;
  price?: string;
  image?: string;
}

function parseRublesNumber(raw?: string): number | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/&nbsp;/g, " ")
    .replace(/[^0-9,\.\-–—]/g, "") // keep digits, comma, dot, dashes
    .replace(/,/g, ".");
  const first = cleaned.split(/[-–—]/)[0];
  const value = parseFloat(first);
  if (isNaN(value)) return null;
  return Math.round(value);
}

function formatPriceDisplay(raw?: string): string {
  const num = parseRublesNumber(raw);
  if (num === null) return "";
  const formatted = new Intl.NumberFormat("ru-RU").format(num) + " ₽";
  const isRange = !!raw && (/[-–—]/.test(raw));
  return isRange ? `от ${formatted}` : formatted;
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products", { cache: "no-store" });
    const json = (await res.json()) as { ok: boolean; products?: ApiProductItem[] };
    if (!json.ok || !json.products) throw new Error("Failed to load products");
    const items = json.products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: formatPriceDisplay(p.price),
      image: p.image || "/items/item-01.jpg",
    }));
    return items;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default function Catalog() {
  const router = useRouter();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">

      {/* Top decorative tag */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1458px] h-[480px] z-0 pointer-events-none">
        <Image
          src="/tag-top.svg"
          alt=""
          fill
          className="object-contain"
          style={{ transform: 'translateY(-188px)' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-38 pb-32">
        {/* Products Grid - exact Figma dimensions */}
        <main className="px-4 sm:px-6">
          {/* Container with responsive max-width */}
          <div className="max-w-[1178px] mx-auto">
            {/* Grid with responsive gaps and columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 
                            gap-x-4 sm:gap-x-6 xl:gap-x-[20px] 
                            gap-y-8 sm:gap-y-12 xl:gap-y-[64px] 
                            justify-items-center">
              {(loading ? [] : items).map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  slug={product.slug}
                  onClick={() => {
                    router.push(`/products/${product.slug}`);
                  }}
                />
              ))}
              {(!loading && items.length === 0) && (
                <div className="col-span-full text-center opacity-70">Товары не найдены</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom decorative tag */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[1458px] h-[480px] z-0 pointer-events-none" style={{ bottom: '-200px' }}>
        <Image
          src="/tag-bot.svg"
          alt=""
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
