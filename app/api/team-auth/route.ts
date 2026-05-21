import { NextResponse } from "next/server";

export const dynamic  = "force-dynamic";
export const revalidate = 0;

/**
 * Verifies a team member password and returns their display name.
 *
 * Env var format (TEAM_PASSWORDS):
 *   "Full Name|password1,Full Name 2|password2"
 *
 * The name must match exactly (case-insensitive) what appears in the
 * Setter Commission / Closer Commission columns of the Deals sheet.
 *
 * Example:
 *   TEAM_PASSWORDS=John Smith|goldeneagle,Sarah Jones|silverline
 */
export async function GET(req: Request) {
  const password = new URL(req.url).searchParams.get("password");
  if (!password) return NextResponse.json({ error: "missing" }, { status: 400 });

  const raw = process.env.TEAM_PASSWORDS ?? "";
  if (!raw) return NextResponse.json({ error: "not configured" }, { status: 503 });

  for (const entry of raw.split(",")) {
    const pipeIdx = entry.lastIndexOf("|");
    if (pipeIdx === -1) continue;
    const name = entry.slice(0, pipeIdx).trim();
    const pass = entry.slice(pipeIdx + 1).trim();
    if (pass && password.trim() === pass) {
      return NextResponse.json({ name });
    }
  }

  return NextResponse.json({ error: "invalid" }, { status: 401 });
}
