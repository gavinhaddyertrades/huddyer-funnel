import { NextResponse } from "next/server";
import { fetchAllDashboardData } from "@/lib/fetchDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const data = await fetchAllDashboardData();
  return NextResponse.json(data);
}
