// ── Env ───────────────────────────────────────────────────────────────────────
const CALENDLY_TOKEN    = process.env.CALENDLY_TOKEN!;
const CALENDLY_ORG      = process.env.CALENDLY_ORG!;
const WHOP_API_KEY      = process.env.WHOP_API_KEY!;
const TYPEFORM_TOKEN    = process.env.TYPEFORM_TOKEN!;
const TYPEFORM_FORM_ID  = process.env.TYPEFORM_FORM_ID!;
const GOOGLE_SHEETS_ID  = process.env.GOOGLE_SHEETS_ID!;
const AIRTABLE_TOKEN    = process.env.AIRTABLE_TOKEN!;
const AIRTABLE_BASE     = "appGdPah6zld6kEvo";
const AIRTABLE_TABLE    = "tbl06n4myW5mzZkDR";

// ── Helpers ───────────────────────────────────────────────────────────────────
const startOfMonth = () => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d; };
const startOfToday = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
function round2(n: number) { return Math.round(n * 100) / 100; }

// ── Airtable (primary deal source) ───────────────────────────────────────────

type AirtableRow = {
  id:               string;
  dateClosed:       Date;
  leadName:         string;
  setterName:       string;
  closerName:       string;
  program:          string;
  saleType:         string;  // "PIF" | "Financed" | ""
  cashCollected:    number;  // initial/recorded payment
  monthlyInstall:   number;
  duration:         number;  // months
  setterCommission: number;
  closerCommission: number;
  earnings:         number;  // Cash Collected Earnings
};

async function fetchAirtableRows(): Promise<AirtableRow[] | null> {
  try {
    const headers = { Authorization: `Bearer ${AIRTABLE_TOKEN}` };
    const rows: AirtableRow[] = [];
    let offset: string | undefined;

    do {
      const url = new URL(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`);
      url.searchParams.set("maxRecords", "100");
      if (offset) url.searchParams.set("offset", offset);
      const res = await fetch(url.toString(), { headers });
      if (!res.ok) return null;
      const data = await res.json() as { records: Array<{ id: string; fields: Record<string, unknown> }>; offset?: string };
      for (const rec of data.records) {
        const f = rec.fields;
        const dateStr = f["Date Closed"] as string | undefined;
        if (!dateStr) continue;
        const dateClosed = new Date(dateStr);
        if (isNaN(dateClosed.getTime())) continue;
        rows.push({
          id:               rec.id,
          dateClosed,
          leadName:         ((f["Lead Name"] as string) ?? "").trim(),
          setterName:       ((f["Setter Name"] as string) ?? "").trim(),
          closerName:       ((f["Closer Name"] as string) ?? "").trim(),
          program:          ((f["Program Purchased"] as string) ?? "").trim(),
          saleType:         ((f["Sale Type"] as string) ?? "").trim(),
          cashCollected:    (f["Cash Collected"] as number) ?? 0,
          monthlyInstall:   (f["Monthly Installment Amount"] as number) ?? 0,
          duration:         parseInt(String(f["In-house Duration"] ?? "0"), 10) || 0,
          setterCommission: (f["Setter Commission"] as number) ?? 0,
          closerCommission: (f["Closer Commission"] as number) ?? 0,
          earnings:         (f["Cash Collected Earnings"] as number) ?? 0,
        });
      }
      offset = data.offset;
    } while (offset);

    return rows;
  } catch (e) {
    console.error("Airtable error:", (e as Error).message);
    return null;
  }
}

export type CommissionLine = { name: string; amount: number };

export type AirtableData =
  | {
      connected: true;
      // Revenue
      totalContracted:    number;
      dealsClosed:        number;
      avgDealValue:       number;
      highTicketRevenue:  number;
      lowTicketRevenue:   number;
      // Breakdown
      pifContracted:      number;
      financedContracted: number;
      revenueByProgram:   { program: string; contracted: number }[];
      // Commissions (total owed per person)
      setterCommissions:  CommissionLine[];
      closerCommissions:  CommissionLine[];
      totalEarnings:      number;
    }
  | { connected: false; error: string };

export async function fetchAirtableData(start: Date, end: Date): Promise<AirtableData> {
  const allRows = await fetchAirtableRows();
  if (!allRows) return { connected: false, error: "Failed to fetch Airtable" };

  const rows = allRows.filter(r => r.dateClosed >= start && r.dateClosed <= end);

  let contracted     = 0;
  let highTicket     = 0;
  let lowTicket      = 0;
  let pif            = 0;
  let financed       = 0;
  let totalEarnings  = 0;

  const programMap  = new Map<string, number>();
  const setterMap   = new Map<string, number>();
  const closerMap   = new Map<string, number>();

  for (const r of rows) {
    // Total contract value
    const contractVal = r.saleType === "PIF" || r.duration === 0
      ? r.cashCollected
      : r.monthlyInstall * r.duration;

    contracted += contractVal;

    if (r.program === "1:1 Mentorship") highTicket += contractVal;
    else lowTicket += contractVal;

    if (r.saleType === "PIF" || r.duration === 0) pif += contractVal;
    else financed += contractVal;

    programMap.set(r.program, (programMap.get(r.program) ?? 0) + contractVal);
    setterMap.set(r.setterName,  (setterMap.get(r.setterName)  ?? 0) + r.setterCommission);
    closerMap.set(r.closerName,  (closerMap.get(r.closerName)  ?? 0) + r.closerCommission);
    totalEarnings += r.earnings;
  }

  return {
    connected:         true,
    totalContracted:   round2(contracted),
    dealsClosed:       rows.length,
    avgDealValue:      rows.length > 0 ? round2(contracted / rows.length) : 0,
    highTicketRevenue: round2(highTicket),
    lowTicketRevenue:  round2(lowTicket),
    pifContracted:     round2(pif),
    financedContracted: round2(financed),
    revenueByProgram:  Array.from(programMap.entries())
      .map(([program, amount]) => ({ program, contracted: round2(amount) }))
      .sort((a, b) => b.contracted - a.contracted),
    setterCommissions: Array.from(setterMap.entries())
      .map(([name, amount]) => ({ name, amount: round2(amount) }))
      .sort((a, b) => b.amount - a.amount),
    closerCommissions: Array.from(closerMap.entries())
      .map(([name, amount]) => ({ name, amount: round2(amount) }))
      .sort((a, b) => b.amount - a.amount),
    totalEarnings: round2(totalEarnings),
  };
}

// ── Google Sheets (payment log — cash collected tracking) ─────────────────────

type SheetRow = {
  dateClosed:       Date;
  paymentDate:      Date;
  leadName:         string;
  setterName:       string;
  setterCommission: number;
  closerName:       string;
  closerCommission: number;
  program:          string;
  cashCollected:    number;
  earnings:         number;
};

function parseGvizDate(v: unknown): Date | null {
  if (!v || typeof v !== "string") return null;
  const m = v.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (!m) return null;
  return new Date(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
}

async function fetchSheetRows(): Promise<SheetRow[] | null> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/gviz/tq?tqx=out:json`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;
    const text = await res.text();
    const json = text
      .replace(/^\/\*O_o\*\/\s*google\.visualization\.Query\.setResponse\(/, "")
      .replace(/\);\s*$/, "");
    const data = JSON.parse(json);
    const rows: SheetRow[] = [];
    for (const row of data.table?.rows ?? []) {
      const c = (row.c ?? []) as Array<{ v?: unknown } | null>;
      const get = (i: number) => c[i]?.v ?? null;
      const dateClosed  = parseGvizDate(get(0));
      const paymentDate = parseGvizDate(get(1));
      if (!dateClosed || !paymentDate) continue;
      const cashCollected = (get(10) as number) ?? 0;
      if (cashCollected <= 0) continue;
      rows.push({
        dateClosed,
        paymentDate,
        leadName:         ((get(2) as string) ?? "").trim(),
        setterName:       ((get(3) as string) ?? "").trim(),
        setterCommission: (get(4) as number) ?? 0,
        closerName:       ((get(5) as string) ?? "").trim(),
        closerCommission: (get(6) as number) ?? 0,
        program:          ((get(7) as string) ?? "").trim(),
        cashCollected,
        earnings:         (get(11) as number) ?? 0,
      });
    }
    return rows;
  } catch (e) {
    console.error("Sheets error:", (e as Error).message);
    return null;
  }
}

export type SheetsData =
  | {
      connected: true;
      cashCollected:       number;   // payments already received (paymentDate ≤ today)
      revenueThisMonth:    number;   // payments due/made in current calendar month
      setterCommPaid:      CommissionLine[];
      closerCommPaid:      CommissionLine[];
      totalNetEarnings:    number;
    }
  | { connected: false; error: string };

export async function fetchSheetsData(start: Date, end: Date): Promise<SheetsData> {
  const allRows = await fetchSheetRows();
  if (!allRows) return { connected: false, error: "Failed to fetch sheet" };

  const today       = new Date(); today.setHours(23, 59, 59, 999);
  const monthStart  = startOfMonth();
  const monthEnd    = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 23, 59, 59);

  // Rows for deals closed in range where payment has already been made
  const rangeRows = allRows.filter(r => r.dateClosed >= start && r.dateClosed <= end);
  const paidRows  = rangeRows.filter(r => r.paymentDate <= today);

  let cashCollected  = 0;
  let netEarnings    = 0;
  const setterMap    = new Map<string, number>();
  const closerMap    = new Map<string, number>();

  for (const r of paidRows) {
    cashCollected  += r.cashCollected;
    netEarnings    += r.earnings;
    setterMap.set(r.setterName, (setterMap.get(r.setterName) ?? 0) + r.setterCommission);
    closerMap.set(r.closerName, (closerMap.get(r.closerName) ?? 0) + r.closerCommission);
  }

  // Revenue this month = all deals (any date), payments in current calendar month
  const revenueThisMonth = allRows
    .filter(r => r.paymentDate >= monthStart && r.paymentDate <= monthEnd)
    .reduce((s, r) => s + r.cashCollected, 0);

  return {
    connected:         true,
    cashCollected:     round2(cashCollected),
    revenueThisMonth:  round2(revenueThisMonth),
    setterCommPaid:    Array.from(setterMap.entries()).map(([name, amount]) => ({ name, amount: round2(amount) })).sort((a,b) => b.amount - a.amount),
    closerCommPaid:    Array.from(closerMap.entries()).map(([name, amount]) => ({ name, amount: round2(amount) })).sort((a,b) => b.amount - a.amount),
    totalNetEarnings:  round2(netEarnings),
  };
}

// ── Calendly ──────────────────────────────────────────────────────────────────

export type CalendlyData = {
  bookedInRange:    number;
  cancelledInRange: number;
  showRate:         number;
  cancelReasons:    string[];
};

async function fetchCalendlyData(start: Date, end: Date): Promise<CalendlyData | null> {
  try {
    const org     = encodeURIComponent(CALENDLY_ORG);
    const min     = start.toISOString();
    const max     = end.toISOString();
    const headers = { Authorization: "Bearer " + CALENDLY_TOKEN };
    const [activeRes, cancelRes] = await Promise.all([
      fetch(`https://api.calendly.com/scheduled_events?organization=${org}&min_start_time=${min}&max_start_time=${max}&status=active&count=100`, { headers }),
      fetch(`https://api.calendly.com/scheduled_events?organization=${org}&min_start_time=${min}&max_start_time=${max}&status=canceled&count=100`, { headers }),
    ]);
    const active    = ((await activeRes.json()).collection    ?? []) as unknown[];
    const cancelled = ((await cancelRes.json()).collection    ?? []) as Array<{ cancellation?: { reason?: string } }>;
    const total = active.length + cancelled.length;
    return {
      bookedInRange:    total,
      cancelledInRange: cancelled.length,
      showRate: total > 0 ? Math.round((active.length / total) * 100) : 0,
      cancelReasons: cancelled
        .filter(e => e.cancellation?.reason)
        .map(e => e.cancellation!.reason!)
        .slice(0, 5),
    };
  } catch (e) {
    console.error("Calendly error:", (e as Error).message);
    return null;
  }
}

// ── Typeform ──────────────────────────────────────────────────────────────────

export type TypeformData = {
  totalInRange:   number;
  trafficSources: { source: string; count: number }[];
};

async function fetchTypeformData(start: Date, end: Date): Promise<TypeformData | null> {
  try {
    const since = start.toISOString();
    const until = end.toISOString();
    const res = await fetch(
      `https://api.typeform.com/forms/${TYPEFORM_FORM_ID}/responses?page_size=200&since=${since}&until=${until}`,
      { headers: { Authorization: "Bearer " + TYPEFORM_TOKEN } }
    );
    const responses = ((await res.json()).items ?? []) as Array<{ metadata?: { referer?: string } }>;
    const sourceMap = new Map<string, number>();
    for (const r of responses) {
      const ref = r.metadata?.referer ?? "";
      const m   = ref.match(/utm_source=([^&]+)/);
      const src = m ? decodeURIComponent(m[1]) : "organic";
      sourceMap.set(src, (sourceMap.get(src) ?? 0) + 1);
    }
    return {
      totalInRange: responses.length,
      trafficSources: Array.from(sourceMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([source, count]) => ({ source, count })),
    };
  } catch (e) {
    console.error("Typeform error:", (e as Error).message);
    return null;
  }
}

// ── Whop ──────────────────────────────────────────────────────────────────────

export type WhopData = {
  activeMemberCount:   number;
  mrr:                 number;
  newMembersThisMonth: number;
  revenueToday:        number;
  failedPayments:      number;
};

async function fetchWhopData(): Promise<WhopData | null> {
  try {
    const headers    = { Authorization: "Bearer " + WHOP_API_KEY };
    const monthStart = Math.floor(startOfMonth().getTime() / 1000);
    const todayStart = Math.floor(startOfToday().getTime() / 1000);
    const [membRes, payRes] = await Promise.all([
      fetch("https://api.whop.com/api/v2/memberships?status=active&limit=1", { headers }),
      fetch("https://api.whop.com/api/v2/payments?limit=100", { headers }),
    ]);
    const membData = await membRes.json() as { pagination?: { total_count?: number } };
    const payments = ((await payRes.json()).data ?? []) as Array<{
      status: string; paid_at: number; final_amount: number;
      billing_reason: string; payments_failed: number;
    }>;
    const paidMonth = payments.filter(p => p.status === "paid" && p.paid_at >= monthStart);
    return {
      activeMemberCount:   membData.pagination?.total_count ?? 0,
      mrr:                 round2(paidMonth.reduce((s, p) => s + (p.final_amount ?? 0), 0)),
      newMembersThisMonth: paidMonth.filter(p => p.billing_reason === "subscription_create").length,
      revenueToday:        round2(payments.filter(p => p.status === "paid" && p.paid_at >= todayStart).reduce((s, p) => s + (p.final_amount ?? 0), 0)),
      failedPayments:      payments.filter(p => p.status === "open" && p.payments_failed > 0).length,
    };
  } catch (e) {
    console.error("Whop error:", (e as Error).message);
    return null;
  }
}

// ── Aggregate ─────────────────────────────────────────────────────────────────

export type DashboardData = {
  airtable:       AirtableData;
  sheets:         SheetsData;
  calendly:       CalendlyData | null;
  typeform:       TypeformData | null;
  whop:           WhopData | null;
  // Computed
  uncollected:    number | null;   // airtable.contracted - sheets.cashCollected
  conversionRate: number | null;
  closeRate:      number | null;
  lastUpdated:    string;
};

export async function fetchAllDashboardData(start: Date, end: Date): Promise<DashboardData> {
  const [at, sh, cal, tf, whop] = await Promise.allSettled([
    fetchAirtableData(start, end),
    fetchSheetsData(start, end),
    fetchCalendlyData(start, end),
    fetchTypeformData(start, end),
    fetchWhopData(),
  ]);

  const airtable = at.status    === "fulfilled" ? at.value    : ({ connected: false, error: "rejected" } as AirtableData);
  const sheets   = sh.status    === "fulfilled" ? sh.value    : ({ connected: false, error: "rejected" } as SheetsData);
  const calendly = cal.status   === "fulfilled" ? cal.value   : null;
  const typeform = tf.status    === "fulfilled" ? tf.value    : null;
  const whopVal  = whop.status  === "fulfilled" ? whop.value  : null;

  const contracted = airtable.connected ? airtable.totalContracted : null;
  const collected  = sheets.connected   ? sheets.cashCollected     : null;
  const uncollected = contracted !== null && collected !== null
    ? round2(contracted - collected)
    : null;

  const apps   = typeform?.totalInRange ?? 0;
  const booked = calendly?.bookedInRange ?? 0;
  const closed = airtable.connected ? airtable.dealsClosed : 0;

  return {
    airtable,
    sheets,
    calendly,
    typeform,
    whop:           whopVal,
    uncollected,
    conversionRate: apps   > 0 ? Math.round((booked / apps)   * 100) : null,
    closeRate:      booked > 0 ? Math.round((closed / booked) * 100) : null,
    lastUpdated:    new Date().toISOString(),
  };
}
