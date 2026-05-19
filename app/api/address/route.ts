import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL;
const TOKEN = process.env.ADMIN_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status
    });

  } catch (e:any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}