import { NextResponse } from "next/server";

export const dynamic  = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const WHOP_API_KEY = process.env.WHOP_API_KEY!;
  const headers = { Authorization: "Bearer " + WHOP_API_KEY };

  // 1. Plans
  const planRes  = await fetch("https://api.whop.com/api/v2/plans?limit=20", { headers, cache: "no-store" });
  const planJson = await planRes.json();

  // 2. First page of payments (newest-first?)
  const payRes  = await fetch("https://api.whop.com/api/v2/payments?limit=10&page=1", { headers, cache: "no-store" });
  const payJson = await payRes.json();

  // 3. First page of memberships
  const memRes  = await fetch("https://api.whop.com/api/v2/memberships?limit=10&page=1", { headers, cache: "no-store" });
  const memJson = await memRes.json();

  return NextResponse.json({
    plans:      planJson,
    payments:   payJson,
    memberships: memJson,
  });
}
