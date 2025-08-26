"use client";

import Image from "next/image";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

const products: Product[] = [
  { id: "1", name: "basic t-shirt", price: "4 999 ₽", image: "/items/item-01.jpg" },
  { id: "2", name: "basic GG t-shirt", price: "4 999 ₽", image: "/items/item-02.jpg" },
  { id: "3", name: "part 2 t-shirt", price: "4 999 ₽", image: "/items/item-03.jpg" },
  { id: "4", name: "bat gang t-shirt", price: "4 999 ₽", image: "/items/item-04.jpg" },
  { id: "5", name: "scream t-shirt", price: "4 999 ₽", image: "/items/item-05.jpg" },
  { id: "6", name: "gg t-shirt", price: "4 999 ₽", image: "/items/item-06.jpg" },
  { id: "7", name: "scream t-shirt", price: "4 999 ₽", image: "/items/item-07.jpg" },
  { id: "8", name: "basic gang t-shirt", price: "4 999 ₽", image: "/items/item-08.jpg" },
  { id: "9", name: "gang t-shirt", price: "4 999 ₽", image: "/items/item-09.jpg" },
  { id: "10", name: "bat t-shirt", price: "4 999 ₽", image: "/items/item-10.jpg" },
  { id: "11", name: "gang t-shirt", price: "4 999 ₽", image: "/items/item-11.jpg" },
  { id: "12", name: "gang t-shirt", price: "4 999 ₽", image: "/items/item-12.jpg" },
  { id: "13", name: "bat t-shirt", price: "4 999 ₽", image: "/items/item-13.jpg" },
  { id: "14", name: "gang t-shirt", price: "4 999 ₽", image: "/items/item-14.jpg" },
  { id: "15", name: "gang t-shirt", price: "4 999 ₽", image: "/items/item-15.jpg" },
];

export default function Catalog() {
  return (
    <div className="relative min-h-screen bg-[#141414] text-white overflow-hidden">
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
      <div className="relative z-10 pt-24 pb-32">
        {/* Products Grid */}
        <main className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16 max-w-[1178px] mx-auto">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                onClick={() => {
                  console.log(`Clicked on product: ${product.name}`);
                }}
              />
            ))}
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
