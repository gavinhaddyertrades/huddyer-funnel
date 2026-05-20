import { NextResponse } from "next/server";
import { fetchAllDashboardData } from "@/lib/fetchDashboard";

export const dynamic   = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  // Default: all time (Jan 1 2020 → today)
  const startParam = searchParams.get("start");
  const endParam   = searchParams.get("end");
  const start = startParam ? new Date(startParam) : new Date("2020-01-01");
  const end   = endParam   ? new Date(endParam)   : (() => { const d = new Date(); d.setHours(23,59,59,999); return d; })();

  const data = await fetchAllDashboardData(start, end);
  return NextResponse.json(data);
}
