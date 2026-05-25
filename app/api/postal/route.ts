import { NextRequest, NextResponse } from "next/server";

const ZIPCLOUD = "https://zipcloud.ibsnet.co.jp/api/search";

export async function POST(req: NextRequest) {
  let body: { postalCode?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: true, message: "Invalid JSON" }, { status: 400 });
  }

  const raw = String(body.postalCode ?? "").replace(/-/g, "").trim();

  if (!/^\d{7}$/.test(raw)) {
    return NextResponse.json({ error: true, message: "Invalid postal code" }, { status: 400 });
  }

  try {
    const res = await fetch(`${ZIPCLOUD}?zipcode=${raw}`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: true, message: "Postal lookup failed" }, { status: 502 });
    }

    const data = await res.json();
    const result = data.results?.[0];

    if (!result) {
      return NextResponse.json({ error: true, message: "Postal code not found" }, { status: 404 });
    }

    return NextResponse.json({
      postalCode: raw,
      prefecture: result.address1,
      city:       result.address2,
      address1:   result.address3,
    });
  } catch {
    return NextResponse.json({ error: true, message: "Postal lookup failed" }, { status: 500 });
  }
}
