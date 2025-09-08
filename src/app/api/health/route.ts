import { NextResponse } from "next/server";
import { executeGraphQL, HEALTH_QUERY } from "@/lib/graphql";

export async function GET() {
  try {
    const data = await executeGraphQL<{ generalSettings: { title: string; description: string } }>(
      { query: HEALTH_QUERY }
    );
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
