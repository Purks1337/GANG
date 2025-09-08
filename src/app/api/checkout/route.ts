import { NextRequest, NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";

interface AttributeNode { name?: string | null; value?: string | null }
interface VariationNode {
  id: string;
  name?: string | null;
  price?: string | null;
  stockStatus?: string | null;
  stockQuantity?: number | null;
  attributes?: { nodes: AttributeNode[] } | null;
}
interface ProductNode {
  id: string;
  slug: string;
  name: string;
  price?: string | null;
  variations?: { nodes: VariationNode[] } | null;
}
interface ProductBySlugResponse { product: ProductNode | null }

interface CheckoutItem {
  id: string;
  name: string;
  price: string;
  image: string;
  size?: string;
  quantity: number;
  slug?: string;
}

const PRODUCT_BY_SLUG = /* GraphQL */ `
  query ProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      slug
      name
      ... on SimpleProduct { price stockStatus stockQuantity }
      ... on VariableProduct {
        price
        variations(first: 100) {
          nodes {
            id
            name
            price
            stockStatus
            stockQuantity
            attributes { nodes { name value } }
          }
        }
      }
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { items?: CheckoutItem[]; contact?: Record<string, unknown> };
    const items: CheckoutItem[] = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "Корзина пуста" }, { status: 400 });
    }

    for (const item of items) {
      const inferredSlug = (item.slug && item.slug.trim())
        || item.name?.toString().toLowerCase().replace(/\s+/g, "-")
        || "";
      if (!inferredSlug) continue;
      const data = await executeGraphQL<ProductBySlugResponse>({
        query: PRODUCT_BY_SLUG,
        variables: { slug: inferredSlug },
      });
      const product = data.product;
      if (!product) {
        return NextResponse.json({ ok: false, error: `Товар не найден: ${item.name}` }, { status: 404 });
      }
      if (product.variations?.nodes?.length) {
        const match = product.variations.nodes.find((v: VariationNode) =>
          (v.attributes?.nodes || []).some((a: AttributeNode) => (a.value || '').toLowerCase() === (item.size || '').toLowerCase())
        );
        if (!match) {
          return NextResponse.json({ ok: false, error: `Вариация не найдена: ${item.name} ${item.size || ''}` }, { status: 400 });
        }
        const inStock = (match.stockStatus || '').toUpperCase() === 'IN_STOCK' || (match.stockQuantity ?? 0) > 0;
        if (!inStock) {
          return NextResponse.json({ ok: false, error: `Нет в наличии: ${item.name} ${item.size || ''}` }, { status: 400 });
        }
      }
    }

    const orderId = `REQ-${Date.now()}`;
    return NextResponse.json({ ok: true, orderId });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
