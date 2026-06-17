import { NextRequest, NextResponse } from "next/server";

const ZAPIER_URL = "https://hooks.zapier.com/hooks/catch/25843071/43qor4j/";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(ZAPIER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("[Zapier] Webhook returned", res.status);
      return NextResponse.json({ error: "Zapier error" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Zapier] Webhook failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
