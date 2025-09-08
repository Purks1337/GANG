import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";

interface ImageNode { sourceUrl?: string | null }
interface VariationNode { price?: string | null }
interface ProductNode {
  id: string;
  slug: string;
  name: string;
  type?: string;
  price?: string | null;
  variations?: { nodes: VariationNode[] } | null;
  image?: ImageNode | null;
}

interface ProductsResponse {
  products: { nodes: ProductNode[] };
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int = 30) {
    products(first: $first, where: { status: "publish" }) {
      nodes {
        id
        slug
        name
        type
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
          variations(first: 1) {
            nodes {
              price
            }
          }
        }
        image {
          sourceUrl
        }
      }
    }
  }
`;

export async function GET() {
  try {
    const data = await executeGraphQL<ProductsResponse>({
      query: PRODUCTS_QUERY,
      variables: { first: 50 },
    });

    const products = (data.products?.nodes || []).map((p: ProductNode) => {
      const price: string = p.price || p.variations?.nodes?.[0]?.price || "";
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price,
        image: p.image?.sourceUrl ?? "",
      };
    });

    return NextResponse.json({ ok: true, products });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
