import { NextResponse } from "next/server";

export const dynamic  = "force-dynamic";
export const revalidate = 0;

const GOOGLE_SHEETS_ID = process.env.GOOGLE_SHEETS_ID!;
const SHEET_SETTER_EOD = "Setter EOD";
const SHEET_CLOSER_EOD = "Closer EOD";

/**
 * Auto-generates a password from a full name.
 * "Nahom Fikru"  → "Fikru.Revana"
 * "Sarah Jones"  → "Jones.Revana"
 * "john smith"   → "Smith.Revana"
 */
function makePassword(fullName: string): string {
  const parts   = fullName.trim().split(/\s+/);
  const last    = parts[parts.length - 1];
  const lastCap = last.charAt(0).toUpperCase() + last.slice(1).toLowerCase();
  return `${lastCap}.Revana`;
}

async function fetchNamesFromSheet(sheet: string): Promise<string[]> {
  try {
    const bust = Date.now();
    const url  = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}&_=${bust}`;
    const res  = await fetch(url, {
      cache:   "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
    });
    if (!res.ok) return [];

    const text = await res.text();
    const json = text.replace(/^[^{]*/, "").replace(/\);\s*$/, "");
    const data = JSON.parse(json) as {
      table?: { rows?: Array<{ c?: Array<{ v?: unknown } | null> }> }
    };

    const names: string[] = [];
    for (const row of data.table?.rows ?? []) {
      // Column 1 = Name in both Setter and Closer EOD sheets
      const name = String(row.c?.[1]?.v ?? "").trim();
      if (name) names.push(name);
    }
    return names;
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const password = new URL(req.url).searchParams.get("password");
  if (!password) return NextResponse.json({ error: "missing" }, { status: 400 });

  // Fetch names from both EOD sheets in parallel
  const [setterNames, closerNames] = await Promise.all([
    fetchNamesFromSheet(SHEET_SETTER_EOD),
    fetchNamesFromSheet(SHEET_CLOSER_EOD),
  ]);

  // Deduplicate by normalised key (trim + lowercase)
  const seen    = new Set<string>();
  const allNames: string[] = [];
  for (const name of [...setterNames, ...closerNames]) {
    const key = name.trim().toLowerCase();
    if (key && !seen.has(key)) { seen.add(key); allNames.push(name); }
  }

  for (const name of allNames) {
    if (password === makePassword(name)) {
      return NextResponse.json({ name });
    }
  }

  return NextResponse.json({ error: "invalid" }, { status: 401 });
}
