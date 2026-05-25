import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "https://directus-production-2cfe.up.railway.app";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? "";

export async function GET() {
  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/product_reviews?filter[status][_eq]=published&sort[]=sort&limit=10&fields[]=id,company_name,title,content,product,date_published`,
      {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ADMIN_TOKEN}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return NextResponse.json({ data: [] });
    const json = await res.json();
    return NextResponse.json({ data: json.data || [] });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
