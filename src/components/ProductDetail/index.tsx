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

function extractNumeric(raw?: string | null): number | null {
  return parseRublesNumber(raw);
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

async function fetchProduct(slug: string) {
  const res = await fetch(`/api/products/${slug}`, { cache: "no-store" });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "Failed to load product");
  return json.product as any;
}

interface ProductDetailProps {
  productSlug: string;
}

export default function ProductDetail({ productSlug }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawProduct, setRawProduct] = useState<any | null>(null);

  const product: IProduct | null = useMemo(() => {
    if (!rawProduct) return null;

    const name: string = rawProduct.name ?? "";

    const mainImage: string | undefined = rawProduct.image?.sourceUrl ?? undefined;
    const gallery: string[] = (rawProduct.galleryImages?.nodes || []).map((n: any) => n?.sourceUrl).filter(Boolean);
    const images = [mainImage, ...gallery].filter(Boolean) as string[];

    const descriptionLines = sanitizeHtmlToLines(rawProduct.description);

    const variationNodes: any[] = rawProduct.variations?.nodes || [];
    const sizeValues = Array.from(
      new Set(
        variationNodes
          .flatMap(v => (v.attributes?.nodes || []).map((a: any) => a?.value))
          .filter(Boolean)
          .map((v: string) => v.toLowerCase())
      )
    );

    const available = new Set<string>(
      variationNodes
        .filter(v => (v.stockStatus || "").toUpperCase() === "IN_STOCK" || (v.stockQuantity ?? 0) > 0)
        .flatMap(v => (v.attributes?.nodes || []).map((a: any) => (a?.value || "").toLowerCase()))
    );

    const sizes = sizeValues.length > 0 ? sizeValues : ["s", "m", "l", "xl"];
    const availableSizes = sizes.filter(s => available.has(s));

    const parentPriceStr: string | null = rawProduct.price ?? null;
    const isRange = !!parentPriceStr && /-|&ndash;|–/.test(parentPriceStr);

    const variationNumericPrices: number[] = variationNodes
      .map(v => extractNumeric(v.price))
      .filter((n): n is number => typeof n === 'number');

    const minVariation = variationNumericPrices.length > 0 ? Math.min(...variationNumericPrices) : null;

    let finalPrice = "";
    if (isRange && minVariation !== null) {
      finalPrice = new Intl.NumberFormat("ru-RU").format(minVariation) + " ₽";
    } else {
      finalPrice = formatPrice(parentPriceStr);
    }

    const thumbnails = images;

    const result: IProduct = {
      id: rawProduct.id,
      name,
      price: finalPrice,
      images: images.length ? images : ["/items/item-01.jpg"],
      thumbnails: thumbnails.length ? thumbnails : ["/items/item-01.jpg"],
      description: descriptionLines,
      sizes,
      availableSizes: availableSizes.length ? availableSizes : sizes,
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
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 overflow-hidden">
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

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 py-12 lg:py-38">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Image area - fills height, hover changes image */}
          <div className="relative w-full h-[70vh] min-h-[520px] max-h-[780px] bg-white rounded-[24px] overflow-hidden">
            <Image
              src={product.images[hoverIndex]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 640px"
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
                             w-full lg:w-[311px]
                             h-[53px]
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