import { NextResponse } from "next/server";
import { wooGet, type WooProduct } from "@/lib/woo";

export async function GET() {
  try {
    // Fetch published products. Adjust per_page as needed.
    const products = await wooGet<WooProduct[]>("/products", {
      status: "publish",
      per_page: 50,
      orderby: "date",
      order: "desc",
    });

    const mapped = (products || []).map((p) => ({
      id: String(p.id),
      name: p.name,
      slug: p.slug,
      price: p.price_html || p.price || "",
      image: p.images && p.images.length > 0 ? p.images[0]!.src : "",
    }));

    return NextResponse.json({ ok: true, products: mapped });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: errorMessage }, { status: 500 });
  }
}
