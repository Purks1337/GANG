import { NextRequest, NextResponse } from "next/server";
import { wooGet, wooPost, type WooProduct, type WooVariation } from "@/lib/woo";

interface CheckoutItem {
  id: string;
  name: string;
  price: string;
  image: string;
  size?: string;
  quantity: number;
  slug?: string;
}

interface CreateOrderRequest {
  payment_method?: string;
  payment_method_title?: string;
  set_paid?: boolean;
  billing?: Record<string, unknown>;
  shipping?: Record<string, unknown>;
  line_items: Array<{ product_id: number; variation_id?: number; quantity: number }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { items?: CheckoutItem[]; contact?: Record<string, unknown> };
    const items: CheckoutItem[] = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json({ ok: false, error: "Корзина пуста" }, { status: 400 });
    }

    const lineItems: Array<{ product_id: number; variation_id?: number; quantity: number }> = [];

    for (const item of items) {
      const inferredSlug = (item.slug && item.slug.trim())
        || item.name?.toString().toLowerCase().replace(/\s+/g, "-")
        || "";
      if (!inferredSlug) {
        return NextResponse.json({ ok: false, error: `Не удалось определить товар: ${item.name}` }, { status: 400 });
      }

      const list = await wooGet<WooProduct[]>("/products", { slug: inferredSlug, status: "publish", per_page: 1 });
      const prod = list[0];
      if (!prod) {
        return NextResponse.json({ ok: false, error: `Товар не найден: ${item.name}` }, { status: 404 });
      }

      if (prod.type === "variable") {
        const variations = await wooGet<WooVariation[]>(`/products/${prod.id}/variations`, { per_page: 100 });
        const match = variations.find((v) =>
          (v.attributes || []).some((a) => (a.option || "").toLowerCase() === (item.size || "").toLowerCase())
        );
        if (!match) {
          return NextResponse.json({ ok: false, error: `Вариация не найдена: ${item.name} ${item.size || ""}` }, { status: 400 });
        }
        const inStock = (match.stock_status || "") === "instock" || (match.stock_quantity ?? 0) > 0;
        if (!inStock) {
          return NextResponse.json({ ok: false, error: `Нет в наличии: ${item.name} ${item.size || ""}` }, { status: 400 });
        }
        lineItems.push({ product_id: prod.id, variation_id: match.id, quantity: Math.max(1, item.quantity | 0) });
      } else {
        const inStock = (prod.stock_status || "") === "instock" || (prod.stock_quantity ?? 0) > 0;
        if (!inStock) {
          return NextResponse.json({ ok: false, error: `Нет в наличии: ${item.name}` }, { status: 400 });
        }
        lineItems.push({ product_id: prod.id, quantity: Math.max(1, item.quantity | 0) });
      }
    }

    const contact = body.contact || {};

    const orderPayload: CreateOrderRequest = {
      set_paid: false,
      payment_method: "",
      payment_method_title: "",
      billing: contact as Record<string, unknown>,
      shipping: contact as Record<string, unknown>,
      line_items: lineItems,
    };

    const order = await wooPost<any>("/orders", orderPayload);

    const orderId = order?.id ? String(order.id) : `REQ-${Date.now()}`;
    const paymentUrl = order?.checkout_payment_url || order?.payment_url || null;

    return NextResponse.json({ ok: true, orderId, paymentUrl });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
