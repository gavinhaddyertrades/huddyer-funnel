import { NextResponse } from "next/server";

export const dynamic  = "force-dynamic";
export const revalidate = 0;

const CLOSE_API_KEY       = process.env.CLOSE_API_KEY!;
const TYPEFORM_ACT_TYPE   = "actitype_3Yew8N6VU13BU7njPVsF4s";
const FIELD_AGE           = "custom.cf_pkRgun7gM5tMzYMNrZbTN93SzcmQ4cOgsZa5BbloL9P";
const FIELD_BUDGET        = "custom.cf_ZsdqscyL383u5md4q6rBcCfE5k4Q6hgiauPuUYOOu9l";
const FIELD_CREDIT        = "custom.cf_jiZdCxA1dijybPFeYDYSBc8ldSTZIpYK25GuHOCGCV0";

export async function GET(req: Request) {
  const email = new URL(req.url).searchParams.get("email");
  if (!email) return NextResponse.json({ error: "missing email" }, { status: 400 });

  const auth    = "Basic " + Buffer.from(CLOSE_API_KEY + ":").toString("base64");
  const headers = { Authorization: auth };

  try {
    // 1. Find lead by email
    const searchRes = await fetch(
      `https://api.close.com/api/v1/lead/?query=${encodeURIComponent("email:" + email)}`,
      { headers, cache: "no-store" }
    );
    const searchJson = await searchRes.json() as { data?: Array<{ id: string; display_name: string; status_label?: string }> };
    const lead = searchJson.data?.[0];
    if (!lead) return NextResponse.json({ found: false });

    // 2. Fetch Typeform Responses custom activity for this lead
    const actRes = await fetch(
      `https://api.close.com/api/v1/activity/custom/?lead_id=${lead.id}&custom_activity_type_id=${TYPEFORM_ACT_TYPE}`,
      { headers, cache: "no-store" }
    );
    const actJson = await actRes.json() as { data?: Record<string, unknown>[] };
    const activity = actJson.data?.[0];

    return NextResponse.json({
      found:       true,
      leadName:    lead.display_name,
      statusLabel: lead.status_label ?? null,
      age:         (activity?.[FIELD_AGE]    as string) ?? null,
      budget:      (activity?.[FIELD_BUDGET] as string) ?? null,
      credit:      (activity?.[FIELD_CREDIT] as string) ?? null,
    });
  } catch (e) {
    console.error("lead-info error:", (e as Error).message);
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }
}
