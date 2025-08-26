"use client";

import { useState } from "react";
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

const getProductData = (slug: string): IProduct => {
  const products: Record<string, IProduct> = {
    "basic-t-shirt": {
      id: "1",
      name: "basic t-shirt",
      price: "4 900 ₽",
      images: ["/items/item-01.jpg", "/items/item-01-2.jpg", "/items/item-01-3.jpg"],
      thumbnails: ["/items/item-01.jpg", "/items/item-01-2.jpg", "/items/item-01-3.jpg"],
      description: [
        "ПЛОТНЫЙ ОРГАНИЧЕСКИЙ ХЛОПОК, 250 Г/М²",
        "ОБЪЁМНЫЙ ПРИНТ ЛОГОТИПА", 
        "СВОБОДНЫЙ КРОЙ (ОВЕРСАЙЗ)",
        "СООТВЕТСТВУЕТ РАЗМЕРУ. РЕКОМЕНДУЕМ ВЫБИРАТЬ ВАШ ОБЫЧНЫЙ РАЗМЕР."
      ],
      sizes: ["xs", "s", "m", "l", "xl", "xxl"],
      availableSizes: ["s", "l", "xl", "xxl"],
      additionalInfo: [
        "Каждое изделие прошло специальную обработку и окрашивание для достижения особой мягкости и эффекта выстиранной ткани. Ввиду особенностей продукта, небольшие потёртости и выцветание являются нормой.",
        "РОСТ МО — 185 СМ, НА НЕМ ФУТБОЛКА РАЗМЕРА L.",
        "РОСТ CHYNA — 168 СМ, НА НЕЙ ФУТБОЛКА РАЗМЕРА M.",
        "ПОЖАЛУЙСТА, ОБРАТИТЕ ВНИМАНИЕ: ОТПРАВКА ДАННОГО ТОВАРА ЗАЙМЁТ ОТ 2 ДО 4 РАБОЧИХ ДНЕЙ.",
        "МЕЖДУНАРОДНЫЕ ЗАКАЗЫ: НАЛОГИ И ТАМОЖЕННЫЕ ПОШЛИНЫ ОПЛАЧИВАЮТСЯ ПОКУПАТЕЛЕМ ПРИ ПОЛУЧЕНИИ ЗАКАЗА."
      ]
    }
  };
  
  return products[slug] || products["basic-t-shirt"];
};

interface ProductDetailProps {
  productSlug: string;
}

export default function ProductDetail({ productSlug }: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const product = getProductData(productSlug);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Пожалуйста, выберите размер");
      return;
    }
    
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pt-16 sm:pt-20 lg:pt-24 pb-16 lg:pb-32">
      <div className="max-w-[1555px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          <div className="flex-1 max-w-[793px]">
            <div className="relative w-full bg-white overflow-hidden mb-4
                            h-[400px] sm:h-[500px] md:h-[600px] lg:h-[751px]
                            rounded-[16px] sm:rounded-[20px] lg:rounded-[24px]">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 793px"
              />
            </div>
            
            <div className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto pb-2">
              {product.thumbnails.map((thumb: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative bg-white overflow-hidden transition-all duration-200 flex-shrink-0
                              w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] lg:w-[232px] lg:h-[224px]
                              rounded-[12px] sm:rounded-[16px] lg:rounded-[24px] ${
                    selectedImage === index 
                      ? 'ring-2 ring-brand-green scale-105' 
                      : 'hover:scale-102'
                  }`}
                >
                  <Image
                    src={thumb}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100px, (max-width: 1024px) 150px, 232px"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 max-w-[714px]">
            
            <div className="mb-6 sm:mb-8">
              <h1 className="font-extrabold tracking-[-0.33px] mb-3 sm:mb-4
                             text-[28px] sm:text-[30px] lg:text-[33px]
                             leading-[36px] sm:leading-[38px] lg:leading-[42.9px]">
                {product.name}
              </h1>
              <p className="font-semibold
                           text-[24px] sm:text-[26px] lg:text-[28px]
                           leading-[30px] sm:leading-[32px] lg:leading-[36.4px]">
                {product.price}
              </p>
            </div>

            <div className="mb-6 sm:mb-8">
              <ul className="space-y-3 sm:space-y-4">
                {product.description.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-brand-green text-lg sm:text-xl mt-0.5">•</span>
                    <span className="text-[14px] sm:text-[15px] lg:text-[16px] 
                                   leading-[17px] sm:leading-[18px] lg:leading-[19.2px]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold mb-4 sm:mb-6
                             text-[24px] sm:text-[26px] lg:text-[28px]
                             leading-[30px] sm:leading-[32px] lg:leading-[36.4px]">
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
                                  leading-[22px] sm:leading-[23px] lg:leading-[24.7px] ${
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

            <div className="mb-6 sm:mb-8">
              <div className="space-y-3 sm:space-y-4">
                {product.additionalInfo.map((info: string, index: number) => (
                  <p key={index} className="opacity-80
                                           text-[14px] sm:text-[15px] lg:text-[16px]
                                           leading-[17px] sm:leading-[18px] lg:leading-[19.2px]">
                    {info}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="rounded-full bg-brand-green text-black font-black uppercase 
                         hover:bg-brand-green/90 transition-colors duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         w-full sm:w-full lg:w-[311px]
                         h-[48px] sm:h-[50px] lg:h-[53px]
                         text-[20px] sm:text-[22px] lg:text-[24px]
                         leading-[24px] sm:leading-[26px] lg:leading-[28.8px]
                         tracking-[-1.6px] sm:tracking-[-1.76px] lg:tracking-[-1.92px]"
              disabled={!selectedSize}
            >
              добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}