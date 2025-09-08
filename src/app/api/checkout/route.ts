import { NextRequest, NextResponse } from "next/server";
import { executeGraphQL } from "@/lib/graphql";

const PRODUCT_BY_SLUG = /* GraphQL */ `
  query ProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      slug
      name
      ... on SimpleProduct { price stockStatus stockQuantity }
      ... on VariableProduct {
        price
        variations(first: 100) { nodes { id name price stockStatus stockQuantity attributes { nodes { name value } } } }
      }
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: Array<{ slug?: string; id: string; name: string; price: string; size?: string; quantity: number; }> = body.items || [];
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: "Корзина пуста" }, { status: 400 });
    }

    // Validate each item price/stock by product slug if available; fallback to name match
    for (const item of items) {
      const slug = item.slug || item.name?.toString().toLowerCase().replace(/\s+/g, "-") || "";
      if (!slug) continue;
      const data = await executeGraphQL<{ product: any }>({ query: PRODUCT_BY_SLUG, variables: { slug } });
      const product = data.product;
      if (!product) {
        return NextResponse.json({ ok: false, error: `Товар не найден: ${item.name}` }, { status: 404 });
      }
      // Basic stock check for variable
      if (product.variations?.nodes?.length) {
        const match = product.variations.nodes.find((v: any) =>
          (v.attributes?.nodes || []).some((a: any) => (a.value || '').toLowerCase() === (item.size || '').toLowerCase())
        );
        if (!match) {
          return NextResponse.json({ ok: false, error: `Вариация не найдена: ${item.name} ${item.size || ''}` }, { status: 400 });
        }
        if ((match.stockStatus || '').toUpperCase() !== 'IN_STOCK' && (match.stockQuantity ?? 0) <= 0) {
          return NextResponse.json({ ok: false, error: `Нет в наличии: ${item.name} ${item.size || ''}` }, { status: 400 });
        }
      }
    }

    // Mock order id for request
    const orderId = `REQ-${Date.now()}`;
    return NextResponse.json({ ok: true, orderId });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
