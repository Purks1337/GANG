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
  description: string; // Assuming you have a description field
  image: {
    data: StrapiDataItem<StrapiImageAttributes>;
  };
}

/**
 * API route to fetch all products from Strapi.
 */
export async function GET() {
  try {
    // Fetch products from Strapi, populating the 'image' relation
    const response = await strapiFetch<StrapiCollectionResponse<ProductAttributes>>(
      "/api/products?populate=image"
    );

    // Map the Strapi data structure to a simpler format for the frontend
    const mappedProducts = (response.data || []).map((p: any) => ({
      id: String(p.id),
      name: p.name,
      slug: p.slug,
      price: `₽${p.price}`, // Format price as needed
      image: getStrapiURL(p.image?.url),
    }));

    return NextResponse.json({ ok: true, products: mappedProducts });
  } catch (error) {
    console.error("Error fetching products from Strapi:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    );
  }
}
