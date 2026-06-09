import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filterField = searchParams.get('filterField');
    const filterValue = searchParams.get('filterValue');
    const DIRECTUS = process.env.DIRECTUS_URL || "https://directus-production-2cfe.up.railway.app";
    const TOKEN = process.env.ADMIN_TOKEN!;

    const invRes = await fetch(
      `${DIRECTUS}/items/inventory?filter[${filterField}][_eq]=${filterValue}&limit=1`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    const invData = await invRes.json();
    const inv = invData.data?.[0];
    if (!inv) return NextResponse.json({ available: null });
    const available = Math.max(0, (inv.quantity ?? 0) - (inv.reserved ?? 0));
    return NextResponse.json({ available });
  } catch (e) {
    return NextResponse.json({ available: null });
  }
}
