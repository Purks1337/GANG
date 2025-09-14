import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.WOO_BASE_URL;
    const consumerKey = process.env.WOO_CONSUMER_KEY;
    const consumerSecret = process.env.WOO_CONSUMER_SECRET;

    return NextResponse.json({
      ok: true,
      env: {
        WOO_BASE_URL: baseUrl ? `Set, starts with: ${baseUrl.substring(0, 15)}` : "NOT SET",
        WOO_CONSUMER_KEY: consumerKey ? `Set, starts with: ${consumerKey.substring(0, 5)}` : "NOT SET",
        WOO_CONSUMER_SECRET: consumerSecret ? "Set, but hidden" : "NOT SET",
      },
    });

  } catch (error) {
    // @ts-expect-error // TODO: type error better
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
