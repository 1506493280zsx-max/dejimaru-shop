import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
const TOKEN = process.env.ADMIN_TOKEN!;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const res = await fetch(
      `${DIRECTUS}/items/product_variants?filter[product_id][_eq]=${id}&filter[status][_eq]=active&sort[]=sort_order&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "fetch failed" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ variants: data.data || [] });
  } catch (e) {
    console.error("[products/id/variants GET]", e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
