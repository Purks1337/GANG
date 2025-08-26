import ProductDetail from "@/components/ProductDetail";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const awaitedParams = await params;
  return <ProductDetail productSlug={awaitedParams.slug} />;
}

// Generate static params for the products
export function generateStaticParams() {
  // These would typically come from your CMS/API
  const products = [
    { slug: "basic-t-shirt" },
    { slug: "basic-gg-t-shirt" },
    { slug: "part-2-t-shirt" },
    { slug: "bat-gang-t-shirt" },
    { slug: "scream-t-shirt" },
    { slug: "gg-t-shirt" },
    { slug: "basic-gang-t-shirt" },
    { slug: "gang-t-shirt" },
    { slug: "bat-t-shirt" },
  ];

  return products.map(product => ({
    slug: product.slug,
  }));
}
