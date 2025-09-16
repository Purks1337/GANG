"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

interface IProduct {
  id: string;
  name: string;
  price: string;
  images: string[];
  thumbnails: string[];
  description: string[];
  sizes: string[];
  availableSizes: string[];
  additionalInfo: string[];
}

interface ProductApiNode {
  id: string;
  name: string;
  price?: string | null;
  image?: string | null;
  description?: string | null;
}

function parseRublesNumber(raw?: string | null): number | null {
  if (!raw) return null;
  const cleaned = String(raw).replace(/&nbsp;/g, ' ').replace(/[^0-9,\.]/g, '').replace(/,/g, '.');
  const val = parseFloat(cleaned);
  if (isNaN(val)) return null;
  return Math.round(val);
}

function formatPrice(raw?: string | null): string {
  const num = parseRublesNumber(raw);
  if (num === null) return (raw ?? "");
  return new Intl.NumberFormat("ru-RU").format(num) + " ₽";
}


function sanitizeHtmlToLines(html?: string | null): string[] {
  if (!html) return [];
  const text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  const lines = text.split(/\n|\.\s+/).map(s => s.trim()).filter(Boolean);
  return lines;
}

async function fetchProduct(slug: string): Promise<ProductApiNode> {
  const res = await fetch(`/api/products/${slug}`, { cache: "no-store" });
  const json = (await res.json()) as { ok: boolean; product?: ProductApiNode | null; error?: string };
  if (!json.ok || !json.product) throw new Error(json.error || "Failed to load product");
  return json.product;
}

interface ProductDetailProps {
  productSlug: string;
}

export default function ProductDetail({ productSlug }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawProduct, setRawProduct] = useState<ProductApiNode | null>(null);

  const product: IProduct | null = useMemo(() => {
    if (!rawProduct) return null;

    const name: string = rawProduct.name ?? "";

    // Get main image from Strapi API response
    const mainImage: string | undefined = rawProduct.image ?? undefined;
    const images = mainImage ? [mainImage] : ["/items/item-01.jpg"];

    const descriptionLines = sanitizeHtmlToLines(rawProduct.description);

    // Default sizes since we don't have variations from Strapi
    const sizes = ["s", "m", "l", "xl"];
    const availableSizes = sizes; // Assume all sizes are available

    const parentPriceStr: string | null = rawProduct.price ?? null;
    const finalPrice = formatPrice(parentPriceStr);

    const thumbnails = images;

    const result: IProduct = {
      id: rawProduct.id,
      name,
      price: finalPrice,
      images: images,
      thumbnails: thumbnails,
      description: descriptionLines,
      sizes,
      availableSizes: availableSizes,
      additionalInfo: [],
    };

    return result;
  }, [rawProduct]);

  const [hoverIndex, setHoverIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProduct(productSlug)
      .then(setRawProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [productSlug]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Пожалуйста, выберите размер");
      return;
    }
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize
    });

    const confirmGoToCart = confirm("Товар добавлен в корзину! Перейти к оформлению?");
    if (confirmGoToCart) {
      router.push('/cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
        Загрузка товара…
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex items-center justify-center">
        Не удалось загрузить товар
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden flex items-center justify-center">
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

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 pt-20 sm:pt-12 lg:pt-16 pb-20 sm:pb-12 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Image area - square on mobile, fills height on desktop */}
          <div className="relative w-full aspect-square sm:h-[70vh] sm:min-h-[520px] sm:max-h-[780px] bg-white rounded-[24px] overflow-hidden">
            <Image
              src={product.images[hoverIndex]}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 640px"
              quality={100}
            />
            {product.images.map((_, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoverIndex(idx)}
                className="absolute inset-y-0"
                style={{ left: `${(idx * 100) / product.images.length}%`, width: `${100 / product.images.length}%` }}
              />
            ))}
          </div>

          {/* Right: Content */}
          <div className="flex flex-col justify-center h-full">
            <div className="space-y-6">
              <div>
                <h1 className="font-extrabold tracking-[-0.33px] mb-2 text-[28px] sm:text-[32px] lg:text-[36px] leading-tight">
                  {product.name}
                </h1>
                <p className="font-bold text-[24px] sm:text-[26px] lg:text-[28px] leading-tight text-brand-green">
                  {product.price}
                </p>
              </div>

              <ul className="space-y-3 sm:space-y-4">
                {product.description.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-3">
                    <span className="text-brand-green text-lg sm:text-xl">•</span>
                    <span className="text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div>
                <h3 className="font-semibold mb-4 text-[22px] sm:text-[24px] lg:text-[26px] leading-tight">
                  Размер
                </h3>
                <div className="flex gap-3 sm:gap-4 flex-wrap">
                  {product.sizes.map((size: string) => {
                    const isAvailable = product.availableSizes.includes(size);
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        disabled={!isAvailable}
                        className={`rounded-full font-semibold transition-all duration-200
                                    w-11 h-11 sm:w-12 sm:h-12 lg:w-[49px] lg:h-[49px]
                                    text-[17px] sm:text-[18px] lg:text-[19px]
                                    ${
                          !isAvailable
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : isSelected
                            ? 'bg-brand-green text-black scale-110'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                {product.additionalInfo.map((info: string, index: number) => (
                  <p key={index} className="opacity-80 text-[14px] sm:text-[15px] lg:text-[16px] leading-relaxed">
                    {info}
                  </p>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleAddToCart}
                  className="rounded-full bg-brand-green text-black font-black uppercase 
                             hover:bg-brand-green/90 transition-colors duration-200 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             py-3 px-6 whitespace-nowrap
                             text-[20px] sm:text-[22px] lg:text-[24px]"
                  disabled={!selectedSize}
                >
                  добавить в корзину
                </button>
              </div>
            </div>
          </div>
        </div>
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