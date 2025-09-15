import { NextResponse } from "next/server";
import {
  getStrapiURL,
  strapiFetch,
  type StrapiTransformedResponse,
  type StrapiImageAttributes,
} from "@/lib/strapi";

// Define the expected structure of a Product from Strapi with transform plugin
interface FlatProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  image: StrapiImageAttributes;
}

/**
 * API route to fetch all products from Strapi.
 */
export async function GET() {
  try {
    // Fetch products from Strapi, using the transform plugin for a flat response
    const response = await strapiFetch<StrapiTransformedResponse<FlatProduct>>(
      "/api/products?populate=image&transform=true"
    );

    // Map the Strapi data structure to a simpler format for the frontend
    const mappedProducts = (response.data || []).map((p) => ({
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
