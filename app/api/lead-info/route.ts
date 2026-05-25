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

    // 2. Fetch opportunities + Typeform activity in parallel
    const [oppRes, actRes] = await Promise.all([
      fetch(
        `https://api.close.com/api/v1/opportunity/?lead_id=${lead.id}&_fields=value,value_period,status_type&_limit=10`,
        { headers, cache: "no-store" }
      ),
      fetch(
        `https://api.close.com/api/v1/activity/custom/?lead_id=${lead.id}&custom_activity_type_id=${TYPEFORM_ACT_TYPE}`,
        { headers, cache: "no-store" }
      ),
    ]);

    const oppJson  = await oppRes.json()  as { data?: Array<{ value?: number; value_period?: string; status_type?: string }> };
    const actJson  = await actRes.json()  as { data?: Record<string, unknown>[] };
    const activity = actJson.data?.[0];

    // Pick the won opportunity with the highest value; fall back to any opportunity
    const opps = oppJson.data ?? [];
    const wonOpps = opps.filter(o => o.status_type === "won");
    const bestOpp = wonOpps.length ? wonOpps : opps;
    const topOpp  = bestOpp.sort((a, b) => (b.value ?? 0) - (a.value ?? 0))[0];
    // Close stores value in cents
    const opportunityValue = topOpp?.value != null ? Math.round(topOpp.value / 100) : null;
    // isWon = true if any opportunity is marked "won" in Close — more reliable
    // than checking statusLabel text which can be any custom string.
    const isWon = wonOpps.length > 0;

    console.log(`[lead-info] email=${email} status="${lead.status_label}" isWon=${isWon} oppValue=${opportunityValue}`);

    return NextResponse.json({
      found:            true,
      leadName:         lead.display_name,
      statusLabel:      lead.status_label ?? null,
      isWon,
      opportunityValue,
      age:              (activity?.[FIELD_AGE]    as string) ?? null,
      budget:           (activity?.[FIELD_BUDGET] as string) ?? null,
      credit:           (activity?.[FIELD_CREDIT] as string) ?? null,
    });
  } catch (e) {
    console.error("lead-info error:", (e as Error).message);
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }
}
