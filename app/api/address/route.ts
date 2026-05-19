import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL;
const TOKEN = process.env.ADMIN_TOKEN;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const cusRes = await fetch(
      `${DIRECTUS}/items/customers?filter[email][_eq]=${encodeURIComponent(email)}&fields=id&limit=1`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!cusRes.ok) {
      console.error("Customer fetch failed:", await cusRes.text());
      return NextResponse.json({ data: [], customerId: null });
    }

    const cusData = await cusRes.json();
    const customer = cusData?.data?.[0];

    if (!customer) {
      return NextResponse.json({ data: [], customerId: null });
    }

    const addrRes = await fetch(
      `${DIRECTUS}/items/addresses?filter[customer_id][_eq]=${customer.id}&sort=-is_default,created_at`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!addrRes.ok) {
      console.error("Address fetch failed:", await addrRes.text());
      return NextResponse.json({ data: [], customerId: customer.id });
    }

    const addrData = await addrRes.json();

    return NextResponse.json({
      data: addrData?.data || [],
      customerId: customer.id,
    });
  } catch (e: any) {
    console.error("GET /api/address error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {

    console.log("DIRECTUS:", DIRECTUS);
    console.log("TOKEN exists:", !!TOKEN);

    const body = await req.json();

    console.log("BODY:", body);

    const res = await fetch(
      `${DIRECTUS}/items/addresses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(body),
      }
    );

    const text = await res.text();

    console.log("DIRECTUS STATUS:", res.status);
    console.log("DIRECTUS RESPONSE:", text);

    return NextResponse.json(
      {
        status: res.status,
        response: text
      },
      {
        status: res.status
      }
    );

  } catch (e:any) {

    console.error("SERVER ERROR:", e);

    return NextResponse.json(
      {
        error: e.message
      },
      {
        status:500
      }
    );

  }
}