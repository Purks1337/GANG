export interface WooClientConfig {
  baseUrl: string; // e.g. https://api.example.com (your WordPress site URL)
  consumerKey: string;
  consumerSecret: string;
}

function getConfigFromEnv(): WooClientConfig {
  const baseUrl = process.env.WOO_BASE_URL;
  const consumerKey = process.env.WOO_CONSUMER_KEY;
  const consumerSecret = process.env.WOO_CONSUMER_SECRET;

  if (!baseUrl || !consumerKey || !consumerSecret) {
    throw new Error(
      "WOO_BASE_URL, WOO_CONSUMER_KEY, WOO_CONSUMER_SECRET must be set in env"
    );
  }
  return { baseUrl: baseUrl.replace(/\/$/, ""), consumerKey, consumerSecret };
}

function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined | null>): string {
  const { baseUrl, consumerKey, consumerSecret } = getConfigFromEnv();
  const url = new URL(`${baseUrl}/wp-json/wc/v3${path.startsWith("/") ? path : "/" + path}`);

  // Auth via query (works server-to-server over HTTPS)
  url.searchParams.set("consumer_key", consumerKey);
  url.searchParams.set("consumer_secret", consumerSecret);

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export async function wooGet<T>(path: string, query?: Record<string, string | number | boolean | undefined | null>): Promise<T> {
  const url = buildUrl(path, query);
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Woo GET ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export async function wooPost<T>(path: string, body: unknown): Promise<T> {
  const url = buildUrl(path);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Woo POST ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

// Types for Woo responses we care about
export interface WooImage { id: number; src: string; alt?: string }
export interface WooProduct {
  id: number;
  slug: string;
  name: string;
  type: string; // simple | variable
  price: string; // numeric string
  price_html?: string;
  images?: WooImage[];
  stock_status?: string; // instock | outofstock
  stock_quantity?: number | null;
}

export interface WooAttribute {
  id: number;
  name: string;
  option?: string;
}

export interface WooVariation {
  id: number;
  price: string; // numeric string
  stock_status?: string; // instock | outofstock
  stock_quantity?: number | null;
  attributes?: WooAttribute[];
}
