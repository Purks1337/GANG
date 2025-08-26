"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  slug: string;
}

const products: Product[] = [
  { id: "1", name: "basic t-shirt", price: "4 999 ₽", image: "/items/item-01.jpg", slug: "basic-t-shirt" },
  { id: "2", name: "basic GG t-shirt", price: "4 999 ₽", image: "/items/item-02.jpg", slug: "basic-gg-t-shirt" },
  { id: "3", name: "part 2 t-shirt", price: "4 999 ₽", image: "/items/item-03.jpg", slug: "part-2-t-shirt" },
  { id: "4", name: "bat gang t-shirt", price: "4 999 ₽", image: "/items/item-04.jpg", slug: "bat-gang-t-shirt" },
  { id: "5", name: "scream t-shirt", price: "4 999 ₽", image: "/items/item-05.jpg", slug: "scream-t-shirt" },
  { id: "6", name: "gg t-shirt", price: "4 999 ₽", image: "/items/item-06.jpg", slug: "gg-t-shirt" },
  { id: "7", name: "scream t-shirt", price: "4 999 ₽", image: "/items/item-07.jpg", slug: "scream-t-shirt-2" },
  { id: "8", name: "basic gang t-shirt", price: "4 999 ₽", image: "/items/item-08.jpg", slug: "basic-gang-t-shirt" },
  { id: "9", name: "gang t-shirt", price: "4 999 ₽", image: "/items/item-09.jpg", slug: "gang-t-shirt" },
  { id: "10", name: "bat t-shirt", price: "4 999 ₽", image: "/items/item-10.jpg", slug: "bat-t-shirt" },
  { id: "11", name: "gang t-shirt", price: "4 999 ₽", image: "/items/item-11.jpg", slug: "gang-t-shirt-2" },
  { id: "12", name: "gang t-shirt", price: "4 999 ₽", image: "/items/item-12.jpg", slug: "gang-t-shirt-3" },
  { id: "13", name: "bat t-shirt", price: "4 999 ₽", image: "/items/item-13.jpg", slug: "bat-t-shirt-2" },
  { id: "14", name: "gang t-shirt", price: "4 999 ₽", image: "/items/item-14.jpg", slug: "gang-t-shirt-4" },
  { id: "15", name: "gang t-shirt", price: "4 999 ₽", image: "/items/item-15.jpg", slug: "gang-t-shirt-5" },
];

export default function Catalog() {
  const router = useRouter();
  
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
      <div className="relative z-10 pt-24 pb-32">
        {/* Products Grid - exact Figma dimensions */}
        <main className="px-4 sm:px-6">
          {/* Container with responsive max-width */}
          <div className="max-w-[1178px] mx-auto">
            {/* Grid with responsive gaps and columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 
                            gap-x-4 sm:gap-x-6 xl:gap-x-[20px] 
                            gap-y-8 sm:gap-y-12 xl:gap-y-[64px] 
                            justify-items-center">
              
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  slug={product.slug}
                  onClick={() => {
                    router.push(`/products/${product.slug}`);
                  }}
                />
              ))}
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
