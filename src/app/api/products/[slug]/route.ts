import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";

interface AttributeNode { name?: string | null; value?: string | null }
interface VariationNode {
  id: string;
  name?: string | null;
  stockStatus?: string | null;
  stockQuantity?: number | null;
  attributes?: { nodes: AttributeNode[] } | null;
  price?: string | null;
}
interface MediaNode { sourceUrl?: string | null }
interface ProductBySlugNode {
  id: string;
  slug: string;
  name: string;
  price?: string | null;
  variations?: { nodes: VariationNode[] } | null;
  galleryImages?: { nodes: MediaNode[] } | null;
  image?: MediaNode | null;
  description?: string | null;
}
interface ProductBySlugResponse { product: ProductBySlugNode | null }

const PRODUCT_BY_SLUG = /* GraphQL */ `
  query ProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      slug
      name
      ... on SimpleProduct {
        price
      }
      ... on VariableProduct {
        price
        variations(first: 50) {
          nodes {
            id
            name
            stockStatus
            stockQuantity
            attributes {
              nodes {
                name
                value
              }
            }
            price
          }
        }
      }
      galleryImages(first: 10) { nodes { sourceUrl } }
      image { sourceUrl }
      description
    }
  }
`;

export async function GET(_req: Request, context: unknown) {
  try {
    const { params } = context as { params: { slug: string } };
    const { slug } = params;
    const data = await executeGraphQL<ProductBySlugResponse>({
      query: PRODUCT_BY_SLUG,
      variables: { slug },
    });

    return NextResponse.json({ ok: true, product: data.product });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
