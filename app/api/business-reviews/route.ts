import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch(
    `${process.env.DIRECTUS_URL}/items/product_reviews?fields=id,company_name,title,content,product,image&limit=20`,
    { headers: { Authorization: `Bearer ${process.env.ADMIN_TOKEN}` } }
  );
  const data = await res.json();
  return NextResponse.json(data);
}
