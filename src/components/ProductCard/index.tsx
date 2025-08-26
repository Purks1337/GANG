"use client";

import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  slug?: string;
  onClick?: () => void;
}

export default function ProductCard({ id, name, price, image, onClick }: ProductCardProps) {
  // Special styling for "basic GG t-shirt" to match Figma design
  const isGGShirt = name === "basic GG t-shirt";
  
  return (
    <div
      className="w-full max-w-[379.33px] mx-auto cursor-pointer group transition-transform duration-200 hover:scale-[1.02] 
                 h-[400px] sm:h-[460px] lg:h-[540px]"
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="relative w-full bg-white rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] overflow-hidden shadow-sm
                      h-[300px] sm:h-[360px] lg:h-[439px]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 379px"
        />
      </div>
      
      {/* Product Info Block - responsive heights */}
      <div className="w-full flex flex-col items-center justify-center
                      h-[100px] sm:h-[100px] lg:h-[77px] mt-2 lg:mt-0">
        <h3 className={`font-extrabold tracking-[-0.33px] text-center transition-colors duration-200
                        text-[24px] sm:text-[28px] lg:text-[33px]
                        leading-[30px] sm:leading-[36px] lg:leading-[42.9px] ${
          isGGShirt 
            ? 'text-[#3ACB00]' 
            : 'text-foreground'
        }`}>
          {name}
        </h3>
        <p className="text-foreground font-bold text-center mt-1 transition-colors duration-200
                      text-[18px] sm:text-[20px] lg:text-[23px]
                      leading-[22px] sm:leading-[26px] lg:leading-[29.9px]">
          {price}
        </p>
      </div>
    </div>
  );
}
