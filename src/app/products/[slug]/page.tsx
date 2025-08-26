import ProductDetail from "@/components/ProductDetail";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductDetail productSlug={slug} />;
}

export function generateStaticParams() {
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