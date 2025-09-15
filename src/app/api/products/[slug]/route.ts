import { NextResponse } from "next/server";
import {
  getStrapiURL,
  strapiFetch,
  type StrapiCollectionResponse,
  type StrapiDataItem,
  type StrapiImageAttributes,
} from "@/lib/strapi";

// Define the expected structure of a Product's attributes from Strapi
interface ProductAttributes {
  name: string;
  slug: string;
  price: number;
  description: string;
  image: {
    data: StrapiDataItem<StrapiImageAttributes>;
  };
}

/**
 * API route to fetch a single product by its slug from Strapi.
 */
export async function GET(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any // Use 'any' to bypass Next.js 15 type bug on Vercel
) {
  const { slug } = context.params;

  if (!slug) {
    return NextResponse.json(
      { ok: false, error: "Product slug is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the product from Strapi by filtering on the slug
    const response = await strapiFetch<
      StrapiCollectionResponse<ProductAttributes>
    >(`/api/products?filters[slug][$eq]=${slug}&populate=image`);

    // Strapi's filter always returns an array. If it's empty, product not found.
    if (!response.data || response.data.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const product = response.data[0];

    // Map the Strapi data structure to a simpler format
    const mappedProduct = {
      id: String(product.id),
      name: product.attributes.name,
      slug: product.attributes.slug,
      price: `₽${product.attributes.price}`,
      description: product.attributes.description, // Pass description through
      image: getStrapiURL(product.attributes.image?.data?.attributes?.url),
    };

    return NextResponse.json({ ok: true, product: mappedProduct });
  } catch (error) {
    console.error(`Error fetching product '${slug}' from Strapi:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}
