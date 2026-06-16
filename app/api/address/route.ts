import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL;
const TOKEN = process.env.ADMIN_TOKEN;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userToken = authHeader?.replace("Bearer ", "");
    if (!userToken) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const meRes = await fetch(`${DIRECTUS}/users/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!meRes.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const me = (await meRes.json()).data;
    const email = me.email;

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
    const authHeader = req.headers.get("Authorization");
    const userToken = authHeader?.replace("Bearer ", "");
    if (!userToken) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const meRes = await fetch(`${DIRECTUS}/users/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (!meRes.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await req.json();

    // ホワイトリスト：許可されたフィールドのみ受け付ける
    const allowed = {
      name_last: body.name_last || "",
      name_first: body.name_first || "",
      postal_code: body.postal_code || "",
      prefecture: body.prefecture || "",
      city: body.city || "",
      address1: body.address1 || "",
      address2: body.address2 || "",
      phone: body.phone || "",
      is_default: body.is_default || false,
      customer_id: body.customer_id || null,
    };

    if (!allowed.name_last || !allowed.name_first || !allowed.postal_code || !allowed.prefecture || !allowed.city || !allowed.address1) {
      return NextResponse.json({ error: "必須項目が未入力です" }, { status: 400 });
    }

    const res = await fetch(
      `${DIRECTUS}/items/addresses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(allowed),
      }
    );

    const text = await res.text();

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