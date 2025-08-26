"use client";

import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image: string;
  onClick?: () => void;
}

export default function ProductCard({ id, name, price, image, onClick }: ProductCardProps) {
  // Special styling for "basic GG t-shirt" to match Figma design
  const isGGShirt = name === "basic GG t-shirt";
  
  return (
    <div
      className="w-full max-w-[379.33px] h-[540px] mx-auto cursor-pointer"
      onClick={onClick}
    >
      {/* Product Image */}
      <div className="relative w-full h-[439px] bg-white rounded-[24px] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      
      {/* Product Info */}
      <div className="w-full flex flex-col items-center mt-6">
        <h3 className={`font-extrabold text-[33px] leading-[42.9px] tracking-[-0.33px] text-center ${
          isGGShirt ? 'text-[#3ACB00]' : 'text-white'
        }`}>
          {name}
        </h3>
        <p className="text-white font-bold text-[23px] leading-[29.9px] text-center mt-1">
          {price}
        </p>
      </div>
    </div>
  );
}
