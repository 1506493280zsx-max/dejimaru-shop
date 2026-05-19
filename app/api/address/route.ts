import { NextRequest, NextResponse } from "next/server";

const DIRECTUS = process.env.DIRECTUS_URL;
const TOKEN = process.env.ADMIN_TOKEN;

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