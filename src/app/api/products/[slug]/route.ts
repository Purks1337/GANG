import { NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";

type Params = { params: { slug: string } };

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

export async function GET(_: Request, { params }: Params) {
  try {
    const { slug } = params;
    const data = await executeGraphQL<{ product: any }>({
      query: PRODUCT_BY_SLUG,
      variables: { slug },
    });

    return NextResponse.json({ ok: true, product: data.product });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
