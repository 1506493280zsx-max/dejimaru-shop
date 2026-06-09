import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(
    `${process.env.DIRECTUS_URL}/items/products?filter[is_corporate_featured][_eq]=true&filter[status][_eq]=active&fields=id,name,slug,brand_id.name,grade,price,compare_at_price,min_price,max_price,images&limit=8`,
    { headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` } }
  );
  const data = await res.json();
  return NextResponse.json(data);
}
