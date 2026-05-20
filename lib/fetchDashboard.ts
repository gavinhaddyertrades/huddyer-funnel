// ── Env ───────────────────────────────────────────────────────────────────────
const CALENDLY_TOKEN    = process.env.CALENDLY_TOKEN!;
const CALENDLY_ORG      = process.env.CALENDLY_ORG!;
const WHOP_API_KEY      = process.env.WHOP_API_KEY!;
const TYPEFORM_TOKEN    = process.env.TYPEFORM_TOKEN!;
const TYPEFORM_FORM_ID  = process.env.TYPEFORM_FORM_ID!;
const GOOGLE_SHEETS_ID  = process.env.GOOGLE_SHEETS_ID!;

// Sheet tab names (same spreadsheet)
const SHEET_DEALS         = "Deals";
const SHEET_SETTER_EOD    = "Setter EOD";
const SHEET_CLOSER_EOD    = "Closer EOD";
const SHEET_VOIDED        = "Voided Payments";
const SHEET_SUBSCRIPTIONS = "Subscriptions";
const SHEET_ADDONS        = "Add ons";
const SHEET_LOW_TICKET    = "Low Ticket";

// ── Helpers ───────────────────────────────────────────────────────────────────
const startOfMonth = () => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d; };
const startOfToday = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };

/**
 * Returns midnight UTC for the current US calendar date.
 *
 * Vercel runs in UTC, so naïve setHours(0,0,0,0) resets at midnight UTC —
 * hours before midnight for US users. We subtract 8 h (covers Pacific through
 * Eastern in both standard and daylight time) to find the correct US calendar
 * date, then return midnight UTC of that date.
 *
 * Example: 4 AM UTC May 20 → subtract 8 h → May 19 20:00 UTC → date = May 19
 *   → todayStart = midnight UTC May 19 (correct for all US zones at 4 AM UTC).
 */
function startOfTodayUS(): Date {
  const shifted = new Date(Date.now() - 8 * 3_600_000);
  return new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()));
}

function round2(n: number) { return Math.round(n * 100) / 100; }

// ── Google Sheets gviz helpers ────────────────────────────────────────────────
// Fetches by sheet name: ?sheet=NAME (no GID needed, no auth required).

function parseGvizDate(v: unknown): Date | null {
  if (!v || typeof v !== "string") return null;
  const m = v.match(/Date\((\d+),(\d+),(\d+)\)/);
  if (!m) return null;
  return new Date(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
}

function parseGvizDatetime(v: unknown): string {
  if (!v) return String(v ?? "");
  // gviz may return a pre-formatted string (e.g. "May 19, 2026 at 10:11 PM") for datetime cells
  if (typeof v !== "string") return String(v);
  const m = v.match(/Date\((\d+),(\d+),(\d+),(\d+),(\d+)/);
  if (m) {
    const d = new Date(
      parseInt(m[1]), parseInt(m[2]), parseInt(m[3]),
      parseInt(m[4]), parseInt(m[5])
    );
    return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  }
  const plain = parseGvizDate(v);
  return plain
    ? plain.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : v; // already a readable string — return as-is
}

async function fetchGviz(sheet: string): Promise<unknown[][] | null> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Sheets sheet="${sheet}": HTTP ${res.status}`);
      return null;
    }
    const text = await res.text();
    const json = text
      .replace(/^[^{]*/, "")   // strip /*O_o*/ google.visualization.Query.setResponse(
      .replace(/\);\s*$/, ""); // strip trailing );
    const data = JSON.parse(json) as {
      table?: { rows?: Array<{ c?: Array<{ v?: unknown } | null> }> }
    };
    return (data.table?.rows ?? []).map(row =>
      (row.c ?? []).map(cell => cell?.v ?? null)
    );
  } catch (e) {
    console.error(`Sheets sheet="${sheet}" error:`, (e as Error).message);
    return null;
  }
}

// ── Sheet column layout (Deals + Voided tabs) ─────────────────────────────────
// 0  Date Closed
// 1  Payment Dates
// 2  Lead Name
// 3  Setter Name
// 4  Setter Commission
// 5  Closer Name
// 6  Closer Commission
// 7  Program Purchased
// 8  Payment Type
// 9  Sale Type   ("PIF" | "Financed")
// 10 Cash Collected
// 11 Earnings
// 12 Finance Type
// 13 Deal Value

type DealRow = {
  dateClosed:       Date;
  paymentDate:      Date;
  leadName:         string;
  setterName:       string;
  setterCommission: number;
  closerName:       string;
  closerCommission: number;
  program:          string;
  saleType:         string;   // "PIF" | "Financed"
  cashCollected:    number;
  earnings:         number;
};

async function fetchDealRows(sheet = SHEET_DEALS): Promise<DealRow[] | null> {
  const raw = await fetchGviz(sheet);
  if (!raw) return null;
  const rows: DealRow[] = [];
  for (const c of raw) {  // gviz puts header in cols; every row here is data
    const dateClosed  = parseGvizDate(c[0]);
    const paymentDate = parseGvizDate(c[1]);
    if (!dateClosed || !paymentDate) continue;
    const cashCollected = Number(c[10] ?? 0);
    if (cashCollected <= 0) continue;
    rows.push({
      dateClosed,
      paymentDate,
      leadName:         String(c[2]  ?? "").trim(),
      setterName:       String(c[3]  ?? "").trim(),
      setterCommission: Number(c[4]  ?? 0),
      closerName:       String(c[5]  ?? "").trim(),
      closerCommission: Number(c[6]  ?? 0),
      program:          String(c[7]  ?? "").trim(),
      saleType:         String(c[9]  ?? "").trim(),
      cashCollected,
      earnings:         Number(c[11] ?? 0),
    });
  }
  return rows;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type CommissionLine = { name: string; amount: number };

export type AddOnRow = {
  date:        Date;
  description: string;
  totalOwed:   number;
};

// Low Ticket sheet columns: Payment Date | Amount Paid | Earnings | Customer Email | Payment ID | Processor
export type LowTicketRow = {
  paymentDate:   Date;
  amountPaid:    number;
  earnings:      number;
  customerEmail: string;
  paymentId:     string;
  processor:     string;
};

export type EodRow = {
  timestamp:   string;
  name:        string;
  contacted:   number;
  callsBooked: number;
  liveCalls:   number;
  noShows:     number;
};

export type CloserEodRow = {
  timestamp:      string;
  name:           string;
  callsScheduled: number;
  noShows:        number;
  reschedules:    number;
  cancellations:  number;
  dealsClosed:    number;
};

export type SheetsData =
  | {
      connected: true;

      // ── All-time (not date-range filtered) ──
      /** Sum of ALL cashCollected rows → total planned contract value */
      totalContracted:    number;
      /** paymentDate ≤ today → actual cash received */
      cashCollected:      number;
      /** paymentDate > today → scheduled future payments */
      uncollectedRevenue: number;
      /** Payments due in the current calendar month */
      revenueThisMonth:   number;

      // ── Date-range filtered ──
      dealsClosed:        number;    // distinct lead names where dateClosed in range
      avgDealValue:       number;    // avg total contract value per deal in range
      // Revenue breakdown
      pifContracted:      number;
      financedContracted: number;
      revenueByProgram:   { program: string; contracted: number }[];
      // Commissions
      setterCommOwed:     CommissionLine[];   // total owed for ALL deals in range
      closerCommOwed:     CommissionLine[];
      setterCommPaid:     CommissionLine[];   // paid (paymentDate ≤ today)
      closerCommPaid:     CommissionLine[];
      totalNetEarnings:   number;             // earnings from paid rows
      // Churn
      churnedRevenue:     number;
      netCashCollected:   number;             // cashCollected − churnedRevenue
      voidedLeads:        { leadName: string; amount: number }[];

      // ── EOD reports ──
      setterEod:          { submitted: boolean; rows: EodRow[] };
      closerEod:          { submitted: boolean; rows: CloserEodRow[] };

      // ── Add ons ──
      addOns:             AddOnRow[];   // all rows (not range-filtered)
      addOnTotal:         number;       // sum of totalOwed for all add-ons

      // ── Low Ticket sheet ──
      lowTicketRevenue:      number;    // all-time sum of amountPaid (paid rows only)
      lowTicketEarnings:     number;    // all-time Revana earnings cut
      lowTicketThisMonth:    number;    // amountPaid in current calendar month
      lowTicketToday:        number;    // amountPaid today (US calendar date)
      lowTicketPaymentCount: number;    // total count of paid transactions
      lowTicketRows:         LowTicketRow[];

      // ── Combined totals (High Ticket Deals + Low Ticket sheet) ──
      // Total Contracted: all Deals rows + all LT rows (no date filter)
      combinedTotalContracted: number;
      // Cash Collected: Deals paymentDate ≤ today + LT paymentDate ≤ today
      combinedCashCollected:   number;
      combinedUncollected:     number;  // Deals future installments only (LT has none)
      combinedNetCollected:    number;  // combinedCashCollected − churnedRevenue

      // ── Overhead ──
      subscriptions:      { tool: string; monthlyCost: number }[];
      totalMonthlyOverhead: number;
    }
  | { connected: false; error: string };

// ── Main fetch ────────────────────────────────────────────────────────────────

export async function fetchSheetsData(start: Date, end: Date): Promise<SheetsData> {
  const [allDealRows, voidedRows, setterEodRaw, closerEodRaw, subRaw, addOnsRaw, lowTicketRaw] = await Promise.all([
    fetchDealRows(SHEET_DEALS),
    fetchDealRows(SHEET_VOIDED),
    fetchGviz(SHEET_SETTER_EOD),
    fetchGviz(SHEET_CLOSER_EOD),
    fetchGviz(SHEET_SUBSCRIPTIONS),
    fetchGviz(SHEET_ADDONS),
    fetchGviz(SHEET_LOW_TICKET),
  ]);

  if (!allDealRows) return { connected: false, error: "Failed to fetch Deals sheet" };

  const today      = new Date(); today.setHours(23, 59, 59, 999);
  const monthStart = startOfMonth();
  const monthEnd   = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 23, 59, 59);

  // ── All-time metrics ────────────────────────────────────────────────────────
  const totalContracted    = round2(allDealRows.reduce((s, r) => s + r.cashCollected, 0));
  const cashCollected      = round2(allDealRows.filter(r => r.paymentDate <= today).reduce((s, r) => s + r.cashCollected, 0));
  const uncollectedRevenue = round2(allDealRows.filter(r => r.paymentDate > today).reduce((s, r) => s + r.cashCollected, 0));
  const revenueThisMonth   = round2(allDealRows.filter(r => r.paymentDate >= monthStart && r.paymentDate <= monthEnd).reduce((s, r) => s + r.cashCollected, 0));

  // ── Date-range filtered ─────────────────────────────────────────────────────
  const dealsInRange  = allDealRows.filter(r => r.dateClosed >= start && r.dateClosed <= end);
  const distinctLeads = new Set(dealsInRange.map(r => r.leadName).filter(Boolean));
  const dealsClosed   = distinctLeads.size;

  // Total contract value and sale type per lead in range
  const leadTotalValue = new Map<string, number>();
  const leadSaleType   = new Map<string, string>();
  const leadProgram    = new Map<string, string>();
  for (const r of allDealRows.filter(r => distinctLeads.has(r.leadName))) {
    leadTotalValue.set(r.leadName, (leadTotalValue.get(r.leadName) ?? 0) + r.cashCollected);
    if (!leadSaleType.has(r.leadName))  leadSaleType.set(r.leadName,  r.saleType);
    if (!leadProgram.has(r.leadName))   leadProgram.set(r.leadName,   r.program);
  }

  let pif = 0, financed = 0;
  const programMap = new Map<string, number>();
  let totalValueLeads = 0;
  for (const [lead, val] of leadTotalValue) {
    totalValueLeads += val;
    const st = leadSaleType.get(lead) ?? "";
    if (st === "PIF") pif += val; else financed += val;
    const prog = leadProgram.get(lead) ?? "Other";
    programMap.set(prog, (programMap.get(prog) ?? 0) + val);
  }
  const avgDealValue = dealsClosed > 0 ? round2(totalValueLeads / dealsClosed) : 0;

  // Commissions: owed = all deals in range; paid = only paid installments
  const setterOwedMap = new Map<string, number>();
  const closerOwedMap = new Map<string, number>();
  for (const r of dealsInRange) {
    setterOwedMap.set(r.setterName, (setterOwedMap.get(r.setterName) ?? 0) + r.setterCommission);
    closerOwedMap.set(r.closerName, (closerOwedMap.get(r.closerName) ?? 0) + r.closerCommission);
  }
  const paidRows = dealsInRange.filter(r => r.paymentDate <= today);
  let netEarnings = 0;
  const setterPaidMap = new Map<string, number>();
  const closerPaidMap = new Map<string, number>();
  for (const r of paidRows) {
    netEarnings += r.earnings;
    setterPaidMap.set(r.setterName, (setterPaidMap.get(r.setterName) ?? 0) + r.setterCommission);
    closerPaidMap.set(r.closerName, (closerPaidMap.get(r.closerName) ?? 0) + r.closerCommission);
  }
  const toLines = (m: Map<string, number>) =>
    Array.from(m.entries())
      .filter(([n]) => n)
      .map(([name, amount]) => ({ name, amount: round2(amount) }))
      .sort((a, b) => b.amount - a.amount);

  // Voided / churned
  const voidedInRange  = (voidedRows ?? []).filter(r => r.dateClosed >= start && r.dateClosed <= end);
  const churnedRevenue = round2(voidedInRange.reduce((s, r) => s + r.cashCollected, 0));
  const voidedByLead   = new Map<string, number>();
  for (const r of voidedInRange)
    voidedByLead.set(r.leadName, (voidedByLead.get(r.leadName) ?? 0) + r.cashCollected);
  const voidedLeads = Array.from(voidedByLead.entries())
    .map(([leadName, amount]) => ({ leadName, amount: round2(amount) }))
    .sort((a, b) => b.amount - a.amount);

  // EOD — setter: gviz returns generic A/B/C cols → header text is ROW 0 → skip it
  const setterEodRows: EodRow[] = [];
  for (const c of (setterEodRaw ?? []).slice(1)) {
    if (!c[0]) continue;
    setterEodRows.push({
      timestamp:   parseGvizDatetime(c[0]),
      name:        String(c[1] ?? ""),
      contacted:   Number(c[2] ?? 0),
      callsBooked: Number(c[3] ?? 0),
      liveCalls:   Number(c[4] ?? 0),
      noShows:     Number(c[5] ?? 0),
    });
  }

  // EOD — closer: gviz recognizes header row → ROW 0 is already data → no slice
  const closerEodRows: CloserEodRow[] = [];
  for (const c of (closerEodRaw ?? [])) {
    if (!c[0]) continue;
    closerEodRows.push({
      timestamp:      parseGvizDatetime(c[0]),
      name:           String(c[1] ?? ""),
      callsScheduled: Number(c[2] ?? 0),
      noShows:        Number(c[3] ?? 0),
      reschedules:    Number(c[4] ?? 0),
      cancellations:  Number(c[5] ?? 0),
      dealsClosed:    Number(c[6] ?? 0),
    });
  }

  // Subscriptions: gviz recognizes header → ROW 0 is data → no slice
  const subMap = new Map<string, number>();
  for (const c of (subRaw ?? [])) {
    const tool = String(c[1] ?? "").trim();
    const cost = Number(c[2] ?? 0);
    if (tool && cost > 0) subMap.set(tool, cost);
  }
  const subscriptions = Array.from(subMap.entries())
    .map(([tool, monthlyCost]) => ({ tool, monthlyCost: round2(monthlyCost) }))
    .sort((a, b) => b.monthlyCost - a.monthlyCost);

  // Add ons: gviz returns generic A/B/C cols → header text is ROW 0 → skip it
  // Columns: 0=Date, 1=Description, 2=Total Owed
  const addOns: AddOnRow[] = [];
  for (const c of (addOnsRaw ?? []).slice(1)) {
    const date = parseGvizDate(c[0]);
    if (!date) continue;
    const totalOwed = Number(c[2] ?? 0);
    if (totalOwed <= 0) continue;
    addOns.push({
      date,
      description: String(c[1] ?? "").trim(),
      totalOwed,
    });
  }
  const addOnTotal = round2(addOns.reduce((s, r) => s + r.totalOwed, 0));

  // Low Ticket sheet: gviz recognizes header → ROW 0 is data → no slice needed
  // Columns: 0=Payment Date, 1=Amount Paid, 2=Earnings, 3=Customer Email, 4=Payment ID, 5=Processor
  const ltTodayStart = startOfTodayUS();
  const lowTicketRows: LowTicketRow[] = [];
  for (const c of (lowTicketRaw ?? [])) {
    const paymentDate = parseGvizDate(c[0]);
    if (!paymentDate) continue;
    lowTicketRows.push({
      paymentDate,
      amountPaid:    Number(c[1] ?? 0),
      earnings:      Number(c[2] ?? 0),
      customerEmail: String(c[3] ?? "").trim(),
      paymentId:     String(c[4] ?? "").trim(),
      processor:     String(c[5] ?? "").trim(),
    });
  }
  const ltPaidRows            = lowTicketRows.filter(r => r.amountPaid > 0);
  const lowTicketRevenue      = round2(ltPaidRows.reduce((s, r) => s + r.amountPaid, 0));
  const lowTicketEarnings     = round2(ltPaidRows.reduce((s, r) => s + r.earnings, 0));
  const lowTicketThisMonth    = round2(ltPaidRows.filter(r => r.paymentDate >= monthStart).reduce((s, r) => s + r.amountPaid, 0));
  const lowTicketToday        = round2(ltPaidRows.filter(r => r.paymentDate >= ltTodayStart).reduce((s, r) => s + r.amountPaid, 0));
  const lowTicketPaymentCount = ltPaidRows.length;

  // ── Combined totals ────────────────────────────────────────────────────────
  // LT payments are always historical (no future-dated rows) so ltCollected ≈ lowTicketRevenue,
  // but we filter properly for correctness.
  const ltCollected            = round2(ltPaidRows.filter(r => r.paymentDate <= today).reduce((s, r) => s + r.amountPaid, 0));
  const combinedTotalContracted = round2(totalContracted + lowTicketRevenue);
  const combinedCashCollected   = round2(cashCollected   + ltCollected);
  const combinedUncollected     = uncollectedRevenue; // LT has no future installments
  const combinedNetCollected    = round2(combinedCashCollected - churnedRevenue);

  return {
    connected:            true,
    totalContracted,
    cashCollected,
    uncollectedRevenue,
    revenueThisMonth,
    dealsClosed,
    avgDealValue,
    pifContracted:        round2(pif),
    financedContracted:   round2(financed),
    revenueByProgram:     Array.from(programMap.entries())
      .map(([program, contracted]) => ({ program, contracted: round2(contracted) }))
      .sort((a, b) => b.contracted - a.contracted),
    setterCommOwed:       toLines(setterOwedMap),
    closerCommOwed:       toLines(closerOwedMap),
    setterCommPaid:       toLines(setterPaidMap),
    closerCommPaid:       toLines(closerPaidMap),
    totalNetEarnings:     round2(netEarnings),
    churnedRevenue,
    netCashCollected:     round2(cashCollected - churnedRevenue),
    voidedLeads,
    setterEod:  { submitted: setterEodRows.length  > 0, rows: setterEodRows  },
    closerEod:  { submitted: closerEodRows.length  > 0, rows: closerEodRows  },
    addOns,
    addOnTotal,
    lowTicketRevenue,
    lowTicketEarnings,
    lowTicketThisMonth,
    lowTicketToday,
    lowTicketPaymentCount,
    lowTicketRows,
    combinedTotalContracted,
    combinedCashCollected,
    combinedUncollected,
    combinedNetCollected,
    subscriptions,
    totalMonthlyOverhead: round2(subscriptions.reduce((s, x) => s + x.monthlyCost, 0)),
  };
}

// ── Calendly ──────────────────────────────────────────────────────────────────

export type CalendlyData = {
  /** Active (non-cancelled) calls booked in range */
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
      fetch(`https://api.calendly.com/scheduled_events?organization=${org}&min_start_time=${min}&max_start_time=${max}&status=active&count=100`,   { headers, cache: "no-store" }),
      fetch(`https://api.calendly.com/scheduled_events?organization=${org}&min_start_time=${min}&max_start_time=${max}&status=canceled&count=100`, { headers, cache: "no-store" }),
    ]);
    const active    = ((await activeRes.json()).collection ?? []) as unknown[];
    const cancelled = ((await cancelRes.json()).collection ?? []) as Array<{ cancellation?: { reason?: string } }>;
    const total     = active.length + cancelled.length;
    return {
      bookedInRange:    active.length,
      cancelledInRange: cancelled.length,
      showRate: total > 0 ? Math.round((active.length / total) * 100) : 0,
      cancelReasons: cancelled.filter(e => e.cancellation?.reason).map(e => e.cancellation!.reason!).slice(0, 5),
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
    type TfItem = { token?: string; metadata?: { referer?: string } };
    const allResponses: TfItem[] = [];
    let before: string | undefined = undefined;

    // Paginate until we have all responses in range
    while (true) {
      const params = new URLSearchParams({
        page_size: "1000",
        since: start.toISOString(),
        until: end.toISOString(),
      });
      if (before) params.set("before", before);

      const res = await fetch(
        `https://api.typeform.com/forms/${TYPEFORM_FORM_ID}/responses?${params}`,
        { headers: { Authorization: "Bearer " + TYPEFORM_TOKEN }, cache: "no-store" }
      );
      const json = await res.json() as { items?: TfItem[] };
      const items = json.items ?? [];
      allResponses.push(...items);

      // Fewer than page_size means we have all of them
      if (items.length < 1000) break;
      const lastToken = items[items.length - 1]?.token;
      if (!lastToken) break;
      before = lastToken;
    }

    const sourceMap = new Map<string, number>();
    for (const r of allResponses) {
      const ref = r.metadata?.referer ?? "";
      const m   = ref.match(/utm_source=([^&]+)/);
      const src = m ? decodeURIComponent(m[1]) : "organic";
      sourceMap.set(src, (sourceMap.get(src) ?? 0) + 1);
    }
    return {
      totalInRange: allResponses.length,
      trafficSources: Array.from(sourceMap.entries()).sort((a, b) => b[1] - a[1]).map(([source, count]) => ({ source, count })),
    };
  } catch (e) {
    console.error("Typeform error:", (e as Error).message);
    return null;
  }
}

// ── Whop (low-ticket community) ───────────────────────────────────────────────

export type WhopData = {
  activeMemberCount:   number;
  mrr:                 number;
  newMembersThisMonth: number;
  revenueToday:        number;
  failedPayments:      number;
};

type WhopPayment = {
  membership:      string;
  status:          string;
  paid_at:         number | null;
  final_amount:    number;
  billing_reason:  string;
  payments_failed: number;
};
type WhopMembership = {
  id:         string;
  status:                string;
  plan:                  string;
  created_at:            number;
  valid:                 boolean;
  cancel_at_period_end:  boolean;
};
type WhopPlan = { id: string; renewal_price: string | number | null; initial_price: string | number | null };

async function fetchWhopData(): Promise<WhopData | null> {
  try {
    const headers    = { Authorization: "Bearer " + WHOP_API_KEY };
    const monthStart = Math.floor(startOfMonth().getTime()  / 1000);
    const todayStart = Math.floor(startOfTodayUS().getTime() / 1000);

    // ── 1. Plan prices (single page, few records) ──────────────────────────────
    const planRes = await fetch("https://api.whop.com/api/v2/plans?limit=20", { headers, cache: "no-store" });
    const planJson = await planRes.json() as { data?: WhopPlan[] };
    const planPrice = new Map<string, number>();
    for (const p of planJson.data ?? []) {
      const price = parseFloat(String(p.renewal_price ?? p.initial_price ?? "0")) || 0;
      planPrice.set(p.id, price);
    }

    // ── 2. All payments — paginate all pages ──────────────────────────────────
    const allPayments: WhopPayment[] = [];
    for (let page = 1; ; page++) {
      const r = await fetch(`https://api.whop.com/api/v2/payments?limit=50&page=${page}`, { headers, cache: "no-store" });
      const d = await r.json() as { data?: WhopPayment[]; pagination?: { total_page: number } };
      const batch = d.data ?? [];
      if (!batch.length) break;
      allPayments.push(...batch);
      if (page >= (d.pagination?.total_page ?? 1)) break;
    }

    // Most recent paid amount per membership (API returns newest-first)
    const lastPaid = new Map<string, number>();
    for (const p of allPayments) {
      if (p.status === "paid" && p.paid_at !== null && !lastPaid.has(p.membership)) {
        lastPaid.set(p.membership, p.final_amount);
      }
    }

    // ── 3. All memberships — paginate all pages ────────────────────────────────
    //    Use status=active for the member count (18 real active subscribers).
    //    Walk all memberships (no filter) once to compute MRR + new-this-month.
    let activeMembers    = 0;
    let newMembersThisMonth = 0;
    let mrr              = 0;
    for (let page = 1; ; page++) {
      const r = await fetch(`https://api.whop.com/api/v2/memberships?limit=50&page=${page}`, { headers, cache: "no-store" });
      const d = await r.json() as { data?: WhopMembership[]; pagination?: { total_page: number; total_count: number } };
      const batch = d.data ?? [];
      if (!batch.length) break;
      for (const m of batch) {
        if (m.status === "active" && !m.cancel_at_period_end) activeMembers++;
        // MRR: active + trialing, but exclude cancel_at_period_end (they won't renew)
        if ((m.status === "active" || m.status === "trialing") && !m.cancel_at_period_end) {
          // Use actual last-paid amount to capture promo-code discounts;
          // fall back to plan's renewal price for trial members not yet charged
          const amt = lastPaid.get(m.id) ?? planPrice.get(m.plan) ?? 0;
          mrr += amt;
        }
        if (m.created_at >= monthStart) newMembersThisMonth++;
      }
      if (page >= (d.pagination?.total_page ?? 1)) break;
    }

    // ── 4. Derived payment metrics ─────────────────────────────────────────────
    const revenueToday  = round2(allPayments
      .filter(p => p.status === "paid" && p.paid_at !== null && p.paid_at >= todayStart)
      .reduce((s, p) => s + p.final_amount, 0));
    const failedPayments = allPayments
      .filter(p => p.status === "open" && p.payments_failed > 0).length;

    return {
      activeMemberCount:   activeMembers,
      mrr:                 round2(mrr),
      newMembersThisMonth,
      revenueToday,
      failedPayments,
    };
  } catch (e) {
    console.error("Whop error:", (e as Error).message);
    return null;
  }
}

// ── Aggregate ─────────────────────────────────────────────────────────────────

export type DashboardData = {
  sheets:         SheetsData;
  calendly:       CalendlyData | null;
  typeform:       TypeformData | null;
  whop:           WhopData | null;
  conversionRate: number | null;
  closeRate:      number | null;
  lastUpdated:    string;
};

export async function fetchAllDashboardData(start: Date, end: Date): Promise<DashboardData> {
  const [sh, cal, tf, whop] = await Promise.allSettled([
    fetchSheetsData(start, end),
    fetchCalendlyData(start, end),
    fetchTypeformData(start, end),
    fetchWhopData(),
  ]);

  const sheets   = sh.status   === "fulfilled" ? sh.value   : ({ connected: false, error: "rejected" } as SheetsData);
  const calendly = cal.status  === "fulfilled" ? cal.value  : null;
  const typeform = tf.status   === "fulfilled" ? tf.value   : null;
  const whopVal  = whop.status === "fulfilled" ? whop.value : null;

  const apps   = typeform?.totalInRange ?? 0;
  const booked = calendly?.bookedInRange ?? 0;
  const closed = sheets.connected ? sheets.dealsClosed : 0;

  return {
    sheets,
    calendly,
    typeform,
    whop:           whopVal,
    conversionRate: apps   > 0 ? Math.round((booked / apps)   * 100) : null,
    closeRate:      booked > 0 ? Math.round((closed / booked) * 100) : null,
    lastUpdated:    new Date().toISOString(),
  };
}
