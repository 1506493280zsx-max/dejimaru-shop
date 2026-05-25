import { NextRequest, NextResponse } from "next/server";
import { getZone, getShipping } from "@/lib/shipping";

export async function POST(req: NextRequest) {
  let body: { subtotal?: unknown; prefecture?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: true, message: "Invalid JSON" }, { status: 400 });
  }

  const { subtotal, prefecture } = body;

  if (typeof prefecture !== "string" || prefecture.trim() === "") {
    return NextResponse.json({ error: true, message: "prefecture is required" }, { status: 400 });
  }
  if (typeof subtotal !== "number" || subtotal < 0) {
    return NextResponse.json({ error: true, message: "subtotal must be a non-negative number" }, { status: 400 });
  }

  try {
    const zone = getZone(prefecture);
    const result = await getShipping(subtotal, zone);
    return NextResponse.json({ zone, ...result });
  } catch (e: any) {
    return NextResponse.json({ error: true, message: e.message ?? "Shipping calculation failed" }, { status: 500 });
  }
}
