import { NextResponse } from "next/server";
import { wooGet, type WooProduct, type WooVariation } from "@/lib/woo";

export async function GET(_req: Request, context: unknown) {
  try {
    const { params } = context as { params: { slug: string } };
    const { slug } = params;

    // Woo REST: find product by slug
    const list = await wooGet<WooProduct[]>("/products", { slug, status: "publish", per_page: 1 });
    const prod = list[0];
    if (!prod) {
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 404 });
    }

    let variations: WooVariation[] = [];
    if (prod.type === "variable") {
      variations = await wooGet<WooVariation[]>(`/products/${prod.id}/variations`, { per_page: 100 });
    }

    // Map to the structure expected by frontend (close to previous GraphQL shape)
    const product = {
      id: String(prod.id),
      slug: prod.slug,
      name: prod.name,
      price: prod.price_html || prod.price || "",
      variations: variations.length
        ? {
            nodes: variations.map((v) => ({
              id: String(v.id),
              name: v.attributes?.map(a => a.option).filter(Boolean).join(" / ") || undefined,
              price: v.price || "",
              stockStatus: (v.stock_status || "").toUpperCase() === "INSTOCK" ? "IN_STOCK" : "OUT_OF_STOCK",
              stockQuantity: v.stock_quantity ?? null,
              attributes: {
                nodes: (v.attributes || []).map((a) => ({ name: a.name, value: a.option }))
              },
            })),
          }
        : null,
      galleryImages: { nodes: (prod.images || []).map((img) => ({ sourceUrl: img.src })) },
      image: prod.images && prod.images[0] ? { sourceUrl: prod.images[0].src } : null,
      description: prod.price_html ? undefined : undefined, // Woo REST returns description separately if needed
    };

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
