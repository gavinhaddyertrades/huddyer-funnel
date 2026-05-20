const CLOSE_API_KEY   = process.env.CLOSE_API_KEY!;
const CALENDLY_TOKEN  = process.env.CALENDLY_TOKEN!;
const CALENDLY_ORG    = process.env.CALENDLY_ORG!;
const WHOP_API_KEY    = process.env.WHOP_API_KEY!;
const TYPEFORM_TOKEN  = process.env.TYPEFORM_TOKEN!;
const TYPEFORM_FORM_ID = process.env.TYPEFORM_FORM_ID!;
const SLACK_TOKEN     = process.env.SLACK_TOKEN!;

const closeHeaders = () => ({
  Authorization: "Basic " + Buffer.from(CLOSE_API_KEY + ":").toString("base64"),
  "Content-Type": "application/json",
});

const daysAgo   = (n: number) => new Date(Date.now() - n * 86400000);
const startOfMonth = () => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d; };
const startOfToday = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };

// ── Close CRM ────────────────────────────────────────────────────────────────

export type CloseData = {
  totalLeads: number;
  stageCounts: Record<string, number>;
  newLast7: number;
  newLast30: number;
  staleLeads: number;
  staleLeadsList: { name: string; status: string; lastActivity: string | null }[];
};

async function fetchCloseData(): Promise<CloseData | null> {
  try {
    const fields = "_fields=id,display_name,status_label,date_created,last_activity_at";
    const [leadsRes, leadsRes2] = await Promise.all([
      fetch(`https://api.close.com/api/v1/lead/?_limit=100&${fields}`, { headers: closeHeaders() }),
      fetch(`https://api.close.com/api/v1/lead/?_limit=100&_skip=100&${fields}`, { headers: closeHeaders() }),
    ]);
    const [d1, d2] = await Promise.all([leadsRes.json(), leadsRes2.json()]);
    const allLeads = [...(d1.data ?? []), ...(d2.data ?? [])];

    const stageCounts: Record<string, number> = {};
    allLeads.forEach((l: { status_label: string }) => {
      stageCounts[l.status_label] = (stageCounts[l.status_label] || 0) + 1;
    });

    // Only flag leads in actionable pipeline stages (not terminal/already-handled statuses)
    const TERMINAL = new Set(["Lost", "Won", "DNQ", "Closed", "Live Trading"]);
    const stale = allLeads.filter((l: { status_label: string; last_activity_at: string | null }) => {
      const actionable = !TERMINAL.has(l.status_label);
      const old = !l.last_activity_at || l.last_activity_at < daysAgo(3).toISOString();
      return actionable && old;
    });

    return {
      totalLeads: d1.total_results ?? allLeads.length,
      stageCounts,
      newLast7:  allLeads.filter((l: { date_created: string }) => l.date_created >= daysAgo(7).toISOString()).length,
      newLast30: allLeads.filter((l: { date_created: string }) => l.date_created >= daysAgo(30).toISOString()).length,
      staleLeads: stale.length,
      staleLeadsList: stale.slice(0, 10).map((l: { display_name: string; status_label: string; last_activity_at: string | null }) => ({
        name: l.display_name,
        status: l.status_label,
        lastActivity: l.last_activity_at,
      })),
    };
  } catch (e) {
    console.error("Close error:", (e as Error).message);
    return null;
  }
}

// ── Calendly ──────────────────────────────────────────────────────────────────

export type CalendlyData = {
  totalBookedLast30: number;
  totalActiveLast30: number;
  totalCancelledLast30: number;
  showRate: number;
  noShowRate: number;
  bookedLast7: number;
  cancelReasons: string[];
};

async function fetchCalendlyData(): Promise<CalendlyData | null> {
  try {
    const org = encodeURIComponent(CALENDLY_ORG);
    const min = daysAgo(30).toISOString();
    const headers = { Authorization: "Bearer " + CALENDLY_TOKEN };
    const [activeRes, cancelledRes] = await Promise.all([
      fetch(`https://api.calendly.com/scheduled_events?organization=${org}&min_start_time=${min}&status=active&count=100`, { headers }),
      fetch(`https://api.calendly.com/scheduled_events?organization=${org}&min_start_time=${min}&status=canceled&count=100`, { headers }),
    ]);
    const active    = ((await activeRes.json()).collection    ?? []) as Array<{ created_at: string }>;
    const cancelled = ((await cancelledRes.json()).collection ?? []) as Array<{ created_at: string; cancellation?: { reason?: string } }>;
    const total = active.length + cancelled.length;
    return {
      totalBookedLast30:    total,
      totalActiveLast30:    active.length,
      totalCancelledLast30: cancelled.length,
      showRate:   total > 0 ? Math.round((active.length    / total) * 100) : 0,
      noShowRate: total > 0 ? Math.round((cancelled.length / total) * 100) : 0,
      bookedLast7: active.filter(e => e.created_at >= daysAgo(7).toISOString()).length,
      cancelReasons: cancelled.filter(e => e.cancellation?.reason).map(e => e.cancellation!.reason!).slice(0, 5),
    };
  } catch (e) {
    console.error("Calendly error:", (e as Error).message);
    return null;
  }
}

// ── Whop ──────────────────────────────────────────────────────────────────────

export type WhopData = {
  activeMemberCount: number;
  mrr: number;
  newMembersThisMonth: number;
  failedPayments: number;
  revenueToday: number;
};

async function fetchWhopData(): Promise<WhopData | null> {
  try {
    const headers = { Authorization: "Bearer " + WHOP_API_KEY };
    const [membershipsRes, paymentsRes] = await Promise.all([
      fetch("https://api.whop.com/api/v2/memberships?status=active&limit=1", { headers }),
      fetch("https://api.whop.com/api/v2/payments?limit=100", { headers }),
    ]);
    const membershipsData = await membershipsRes.json();
    const payments = ((await paymentsRes.json()).data ?? []) as Array<{
      status: string; paid_at: number; final_amount: number;
      billing_reason: string; payments_failed: number;
    }>;
    const monthStart = Math.floor(startOfMonth().getTime() / 1000);
    const todayStart = Math.floor(startOfToday().getTime() / 1000);
    const paidThisMonth = payments.filter(p => p.status === "paid" && p.paid_at >= monthStart);
    const mrr = paidThisMonth.reduce((s, p) => s + (p.final_amount || 0), 0);
    return {
      activeMemberCount:   membershipsData.pagination?.total_count ?? 0,
      mrr:                 Math.round(mrr * 100) / 100,
      newMembersThisMonth: payments.filter(p => p.billing_reason === "subscription_create" && p.status === "paid" && p.paid_at >= monthStart).length,
      failedPayments:      payments.filter(p => p.status === "open" && p.payments_failed > 0).length,
      revenueToday:        Math.round(payments.filter(p => p.status === "paid" && p.paid_at >= todayStart).reduce((s, p) => s + (p.final_amount || 0), 0) * 100) / 100,
    };
  } catch (e) {
    console.error("Whop error:", (e as Error).message);
    return null;
  }
}

// ── Typeform ──────────────────────────────────────────────────────────────────

export type TypeformData = {
  totalLast30: number;
  totalLast7: number;
  qualified: number;
  disqualified: number;
  disqualRate: number;
  trafficSources: Record<string, number>;
};

const CAPITAL_FIELD = "cqsqtdpXsB5C";

async function fetchTypeformData(): Promise<TypeformData | null> {
  try {
    const since = daysAgo(30).toISOString();
    const res = await fetch(
      `https://api.typeform.com/forms/${TYPEFORM_FORM_ID}/responses?page_size=200&since=${since}`,
      { headers: { Authorization: "Bearer " + TYPEFORM_TOKEN } }
    );
    const responses = ((await res.json()).items ?? []) as Array<{
      submitted_at: string;
      answers?: Array<{ field?: { id: string }; choice?: { label: string } }>;
      metadata?: { referer?: string };
    }>;
    let qualified = 0, disqualified = 0;
    responses.forEach(r => {
      const ans = (r.answers ?? []).find(a => a.field?.id === CAPITAL_FIELD);
      if (ans) {
        const label = (ans.choice?.label ?? "").toLowerCase();
        if (label.includes("less than") || label.includes("$0") || label.includes("under")) disqualified++;
        else qualified++;
      }
    });
    const sources: Record<string, number> = {};
    responses.forEach(r => {
      const ref = r.metadata?.referer ?? "";
      const m = ref.match(/utm_source=([^&]+)/);
      const src = m ? m[1] : "organic";
      sources[src] = (sources[src] || 0) + 1;
    });
    return {
      totalLast30: responses.length,
      totalLast7:  responses.filter(r => r.submitted_at >= daysAgo(7).toISOString()).length,
      qualified,
      disqualified,
      disqualRate: responses.length > 0 ? Math.round((disqualified / responses.length) * 100) : 0,
      trafficSources: sources,
    };
  } catch (e) {
    console.error("Typeform error:", (e as Error).message);
    return null;
  }
}

// ── Slack ─────────────────────────────────────────────────────────────────────

export type SlackData = {
  nahomEodPosted: boolean;
  messagesToday: number;
  recentMessages: { text: string; ts: string }[];
  error?: string;
};

async function fetchSlackData(): Promise<SlackData | null> {
  try {
    const headers = { Authorization: "Bearer " + SLACK_TOKEN };
    const channelsRes = await fetch(
      "https://slack.com/api/conversations.list?types=public_channel,private_channel&limit=200",
      { headers }
    );
    const channels = ((await channelsRes.json()).channels ?? []) as Array<{ id: string; name: string }>;
    const channel = channels.find(c => c.name.toLowerCase().includes("follow"));
    if (!channel) return { nahomEodPosted: false, messagesToday: 0, recentMessages: [], error: "Channel not found" };

    const todayTs = Math.floor(startOfToday().getTime() / 1000);
    const msgsRes = await fetch(
      `https://slack.com/api/conversations.history?channel=${channel.id}&oldest=${todayTs}&limit=50`,
      { headers }
    );
    const messages = ((await msgsRes.json()).messages ?? []) as Array<{ text?: string; ts: string }>;
    const eodKeywords = ["eod", "end of day", "follow up", "follow-up", "report"];
    const nahomPosted = messages.some(m => eodKeywords.some(kw => (m.text ?? "").toLowerCase().includes(kw)));
    return {
      nahomEodPosted: nahomPosted,
      messagesToday:  messages.length,
      recentMessages: messages.slice(0, 3).map(m => ({
        text: (m.text ?? "").substring(0, 120),
        ts:   new Date(parseFloat(m.ts) * 1000).toLocaleTimeString(),
      })),
    };
  } catch (e) {
    console.error("Slack error:", (e as Error).message);
    return null;
  }
}

// ── Aggregate ─────────────────────────────────────────────────────────────────

export type DashboardData = {
  close: CloseData | null;
  calendly: CalendlyData | null;
  whop: WhopData | null;
  typeform: TypeformData | null;
  slack: SlackData | null;
  lastUpdated: string;
};

export async function fetchAllDashboardData(): Promise<DashboardData> {
  const [close, calendly, whop, typeform, slack] = await Promise.allSettled([
    fetchCloseData(),
    fetchCalendlyData(),
    fetchWhopData(),
    fetchTypeformData(),
    fetchSlackData(),
  ]);
  return {
    close:     close.status     === "fulfilled" ? close.value     : null,
    calendly:  calendly.status  === "fulfilled" ? calendly.value  : null,
    whop:      whop.status      === "fulfilled" ? whop.value      : null,
    typeform:  typeform.status  === "fulfilled" ? typeform.value  : null,
    slack:     slack.status     === "fulfilled" ? slack.value     : null,
    lastUpdated: new Date().toISOString(),
  };
}
