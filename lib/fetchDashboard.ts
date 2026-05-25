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
const SHEET_APPLICATIONS  = "Applications";

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

function startOfWeekUS(): Date {
  const shifted = new Date(Date.now() - 8 * 3_600_000);
  const dow = shifted.getUTCDay(); // 0 = Sunday
  const ms = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate()) - dow * 86_400_000;
  return new Date(ms);
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

function parseGvizDatetimeToDate(v: unknown): Date | null {
  if (!v || typeof v !== "string") return null;
  // gviz Date(year,month0,day[,hour,min]) → strip to date part
  const m = v.match(/Date\((\d+),(\d+),(\d+)/);
  if (m) return new Date(+m[1], +m[2], +m[3]);
  // Pre-formatted string e.g. "May 19, 2026 at 10:11 PM"
  const dt = new Date(v.replace(" at ", " "));
  if (!isNaN(dt.getTime())) return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  return null;
}

async function fetchGviz(sheet: string): Promise<unknown[][] | null> {
  try {
    // Unique URL + no-cache headers → defeat both CDN and server-side gviz cache
    const bust = Date.now();
    const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}&_=${bust}`;
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
    });
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

export type HuddleSetterStat = { name: string; callsBooked: number; liveCallsPushed: number };
export type HuddleCloserStat = { name: string; noShows: number; callsCanceled: number };
export type HuddlePeriodData = {
  applications:    number;
  callsBooked:     number;
  noShows:         number;
  callsCanceled:   number;
  liveCallsPushed: number;
  dnqs:            number;
  setterBreakdown: HuddleSetterStat[];
  closerBreakdown: HuddleCloserStat[];
};
export type MorningHuddleData = {
  weekLabel:      string;
  yesterdayLabel: string;
  thisWeek:       HuddlePeriodData;
  yesterday:      HuddlePeriodData;
};

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
      revenueThisMonth:      number;
      /** Payments still due from tomorrow → end of month (not yet collected) */
      revenueStillDueThisMonth: number;
      /** Cash collected today (US calendar date) */
      htCashCollectedToday: number;
      dealsClosedToday:     number;

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

      // ── Morning Huddle (pre-computed EOD portion; apps added in aggregate) ──
      morningHuddleEod: {
        weekLabel:      string;
        yesterdayLabel: string;
        thisWeek: {
          callsBooked:     number;
          liveCallsPushed: number;
          noShows:         number;
          callsCanceled:   number;
          setterBreakdown: HuddleSetterStat[];
          closerBreakdown: HuddleCloserStat[];
        };
        yesterday: {
          callsBooked:     number;
          liveCallsPushed: number;
          noShows:         number;
          callsCanceled:   number;
          setterBreakdown: HuddleSetterStat[];
          closerBreakdown: HuddleCloserStat[];
        };
      };

      // ── Add ons ──
      addOns:             AddOnRow[];   // all rows (not range-filtered)
      addOnTotal:         number;       // sum of totalOwed for all add-ons

      // ── Low Ticket sheet ──
      lowTicketRevenue:      number;    // all-time sum of amountPaid (paid rows only)
      lowTicketEarnings:     number;    // all-time Revana earnings cut
      htEarningsCollected:   number;    // sum of Deals earnings where paymentDate ≤ today
      revanaCommission:      number;    // 20% × (htEarningsCollected + lowTicketEarnings)
      lowTicketThisMonth:    number;    // amountPaid in current calendar month
      lowTicketToday:        number;    // amountPaid today (US calendar date)
      lowTicketPaymentCount: number;    // total count of paid transactions
      lowTicketRows:         LowTicketRow[];

      // ── Monthly charts (current year, cash collected up to today) ──
      htCashCollectedByMonth: { month: string; amount: number }[];
      ltRevenueByMonth:       { month: string; amount: number }[];

      // ── Combined totals (High Ticket Deals + Low Ticket sheet) ──
      // Total Contracted: all Deals rows + all LT rows (no date filter)
      combinedTotalContracted: number;
      // Cash Collected: Deals paymentDate ≤ today + LT paymentDate ≤ today
      combinedCashCollected:   number;
      combinedUncollected:     number;  // Deals future installments only (LT has none)
      combinedNetCollected:    number;  // combinedCashCollected − churnedRevenue

      // ── Pay period commissions (paid on 5th and 20th) ──
      payPeriodCommission: {
        current: {
          label:      string;   // e.g. "Apr 20 – May 4"
          payDate:    string;   // e.g. "May 5 (next pay)"
          htEarnings: number;
          ltEarnings: number;
          revana:     number;
          setterComm: CommissionLine[];
          closerComm: CommissionLine[];
        };
        previous: {
          label:      string;
          payDate:    string;   // e.g. "May 20 (paid)"
          htEarnings: number;
          ltEarnings: number;
          revana:     number;
          setterComm: CommissionLine[];
          closerComm: CommissionLine[];
        };
      };

      // ── Overhead ──
      subscriptions:      { tool: string; monthlyCost: number }[];
      totalMonthlyOverhead: number;

      // ── Per-person deal rows (for team member view) ──
      // Only includes rows where paymentDate ≤ today (no future payments)
      teamDealRows: Array<{
        leadName:         string;
        program:          string;
        dateClosed:       string;   // "May 21, 2026"
        paymentDate:      string;   // "May 21, 2026"
        paymentDateMs:    number;   // epoch ms — used for sorting
        cashCollected:    number;
        setterName:       string;
        setterCommission: number;
        closerName:       string;
        closerCommission: number;
      }>;
    }
  | { connected: false; error: string };

// ── Pay period helpers ────────────────────────────────────────────────────────
// Paid on 5th  → covers 20th (prev month) → 4th (current month)
// Paid on 20th → covers 5th → 19th (current month)

function getPayPeriods(now: Date) {
  const d = now.getDate();
  const m = now.getMonth();
  const y = now.getFullYear();
  const fmt = (dt: Date) => dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  let currStart: Date, currEnd: Date, currPay: Date;
  let prevStart: Date, prevEnd: Date, prevPay: Date;

  if (d >= 20) {
    // Current: 20th of this month → 4th of next month, pays on next 5th
    currStart = new Date(y, m, 20);
    currEnd   = new Date(y, m + 1, 4, 23, 59, 59, 999);
    currPay   = new Date(y, m + 1, 5);
    // Previous: 5th → 19th of this month, paid on 20th
    prevStart = new Date(y, m, 5);
    prevEnd   = new Date(y, m, 19, 23, 59, 59, 999);
    prevPay   = new Date(y, m, 20);
  } else if (d >= 5) {
    // Current: 5th → 19th, pays on 20th
    currStart = new Date(y, m, 5);
    currEnd   = new Date(y, m, 19, 23, 59, 59, 999);
    currPay   = new Date(y, m, 20);
    // Previous: 20th prev → 4th, paid on 5th
    prevStart = new Date(y, m - 1, 20);
    prevEnd   = new Date(y, m, 4, 23, 59, 59, 999);
    prevPay   = new Date(y, m, 5);
  } else {
    // 1st–4th: current = 20th prev → 4th, pays on 5th
    currStart = new Date(y, m - 1, 20);
    currEnd   = new Date(y, m, 4, 23, 59, 59, 999);
    currPay   = new Date(y, m, 5);
    // Previous: 5th prev → 19th prev, paid on 20th prev
    prevStart = new Date(y, m - 1, 5);
    prevEnd   = new Date(y, m - 1, 19, 23, 59, 59, 999);
    prevPay   = new Date(y, m - 1, 20);
  }

  return {
    current:  { start: currStart, end: currEnd, payLabel: `${fmt(currPay)} (next pay)`,  label: `${fmt(currStart)} – ${fmt(currEnd)}` },
    previous: { start: prevStart, end: prevEnd, payLabel: `${fmt(prevPay)} (paid)`,       label: `${fmt(prevStart)} – ${fmt(prevEnd)}` },
  };
}

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
  const tomorrowStart = new Date(); tomorrowStart.setHours(0, 0, 0, 0); tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  // ── All-time metrics ────────────────────────────────────────────────────────
  const totalContracted          = round2(allDealRows.reduce((s, r) => s + r.cashCollected, 0));
  const cashCollected            = round2(allDealRows.filter(r => r.paymentDate <= today).reduce((s, r) => s + r.cashCollected, 0));
  const uncollectedRevenue       = round2(allDealRows.filter(r => r.paymentDate > today).reduce((s, r) => s + r.cashCollected, 0));
  // All-time HT earnings for collected payments (paymentDate ≤ today)
  const htEarningsCollected      = round2(allDealRows.filter(r => r.paymentDate <= today).reduce((s, r) => s + r.earnings, 0));
  const revenueThisMonth         = round2(allDealRows.filter(r => r.paymentDate >= monthStart && r.paymentDate <= monthEnd).reduce((s, r) => s + r.cashCollected, 0));
  const revenueStillDueThisMonth = round2(allDealRows.filter(r => r.paymentDate >= tomorrowStart && r.paymentDate <= monthEnd).reduce((s, r) => s + r.cashCollected, 0));
  const htTodayStart = startOfTodayUS();
  const htCashCollectedToday = round2(allDealRows.filter(r => r.paymentDate >= htTodayStart && r.paymentDate <= today).reduce((s, r) => s + r.cashCollected, 0));
  const dealsClosedToday = new Set(
    allDealRows
      .filter(r => r.dateClosed >= htTodayStart && r.dateClosed <= today)
      .map(r => r.leadName)
      .filter(Boolean)
  ).size;

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
  // Names to exclude from setter/closer commission tables (owners, not sales reps)
  const COMM_EXCLUDE = new Set(["hudson", "hudson shaffer"]);
  const toLines = (m: Map<string, number>) =>
    Array.from(m.entries())
      .filter(([n]) => n && !COMM_EXCLUDE.has(n.toLowerCase().trim()))
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

  // EOD — setter: gviz puts headers in cols[], not as a data row — no slice needed
  const setterEodRows: EodRow[] = [];
  for (const c of (setterEodRaw ?? [])) {
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

  // ── Morning Huddle EOD computation ─────────────────────────────────────────
  // Parse raw rows with actual Date objects (not the formatted timestamp string)
  const hudTodayStart = startOfTodayUS();
  const hudWeekStart  = startOfWeekUS();
  const hudYestStart  = new Date(hudTodayStart.getTime() - 86_400_000);
  const hudTodayEnd   = new Date(hudTodayStart.getTime() + 86_400_000); // exclusive bound

  type SetterRawD = { name: string; callsBooked: number; liveCalls: number; date: Date | null };
  type CloserRawD = { name: string; noShows: number; cancellations: number; date: Date | null };

  const setterRawD: SetterRawD[] = (setterEodRaw ?? []).flatMap(c =>
    c[0] ? [{ name: String(c[1] ?? ""), callsBooked: Number(c[3] ?? 0), liveCalls: Number(c[4] ?? 0), date: parseGvizDatetimeToDate(c[0]) }] : []
  );
  const closerRawD: CloserRawD[] = (closerEodRaw ?? []).flatMap(c =>
    c[0] ? [{ name: String(c[1] ?? ""), noShows: Number(c[3] ?? 0), cancellations: Number(c[5] ?? 0), date: parseGvizDatetimeToDate(c[0]) }] : []
  );

  function aggSetterD(rows: SetterRawD[]) {
    const m = new Map<string, { callsBooked: number; liveCallsPushed: number }>();
    for (const r of rows) {
      const k = r.name.trim();
      if (!k) continue;
      const p = m.get(k) ?? { callsBooked: 0, liveCallsPushed: 0 };
      m.set(k, { callsBooked: p.callsBooked + r.callsBooked, liveCallsPushed: p.liveCallsPushed + r.liveCalls });
    }
    const bd = Array.from(m.entries()).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.callsBooked - a.callsBooked);
    return { callsBooked: bd.reduce((s, r) => s + r.callsBooked, 0), liveCallsPushed: bd.reduce((s, r) => s + r.liveCallsPushed, 0), setterBreakdown: bd };
  }

  function aggCloserD(rows: CloserRawD[]) {
    const m = new Map<string, { noShows: number; callsCanceled: number }>();
    for (const r of rows) {
      const k = r.name.trim();
      if (!k) continue;
      const p = m.get(k) ?? { noShows: 0, callsCanceled: 0 };
      m.set(k, { noShows: p.noShows + r.noShows, callsCanceled: p.callsCanceled + r.cancellations });
    }
    const bd = Array.from(m.entries()).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.noShows - a.noShows);
    return { noShows: bd.reduce((s, r) => s + r.noShows, 0), callsCanceled: bd.reduce((s, r) => s + r.callsCanceled, 0), closerBreakdown: bd };
  }

  const hudFmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  // "This week" = Sunday → yesterday (today excluded)
  const hudWeekLabel = `${hudFmt(hudWeekStart)} – ${hudFmt(hudYestStart)}`;
  const hudYestLabel = hudFmt(hudYestStart);

  const ws = aggSetterD(setterRawD.filter(r => r.date && r.date >= hudWeekStart && r.date < hudTodayStart));
  const wc = aggCloserD(closerRawD.filter(r => r.date && r.date >= hudWeekStart && r.date < hudTodayStart));
  const ys = aggSetterD(setterRawD.filter(r => r.date && r.date >= hudYestStart && r.date < hudTodayStart));
  const yc = aggCloserD(closerRawD.filter(r => r.date && r.date >= hudYestStart && r.date < hudTodayStart));

  const morningHuddleEod = {
    weekLabel:      hudWeekLabel,
    yesterdayLabel: hudYestLabel,
    thisWeek: {
      callsBooked:     ws.callsBooked,
      liveCallsPushed: ws.liveCallsPushed,
      noShows:         wc.noShows,
      callsCanceled:   wc.callsCanceled,
      setterBreakdown: ws.setterBreakdown,
      closerBreakdown: wc.closerBreakdown,
    },
    yesterday: {
      callsBooked:     ys.callsBooked,
      liveCallsPushed: ys.liveCallsPushed,
      noShows:         yc.noShows,
      callsCanceled:   yc.callsCanceled,
      setterBreakdown: ys.setterBreakdown,
      closerBreakdown: yc.closerBreakdown,
    },
  };

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
  const ltPaidRows = lowTicketRows.filter(r => r.amountPaid > 0);

  // ── Monthly chart data (current calendar year, up to end of today) ────────
  const CHART_MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const chartYear     = new Date().getFullYear();
  const todayForChart = new Date(); todayForChart.setHours(23, 59, 59, 999);

  const htCashCollectedByMonth = CHART_MONTHS.map((month, i) => {
    const ms = new Date(chartYear, i, 1);
    const me = new Date(chartYear, i + 1, 0, 23, 59, 59);
    const amount = round2(allDealRows
      .filter(r => r.paymentDate >= ms && r.paymentDate <= me && r.paymentDate <= todayForChart)
      .reduce((s, r) => s + r.cashCollected, 0));
    return { month, amount };
  });

  const ltRevenueByMonth = CHART_MONTHS.map((month, i) => {
    const ms = new Date(chartYear, i, 1);
    const me = new Date(chartYear, i + 1, 0, 23, 59, 59);
    const amount = round2(ltPaidRows
      .filter(r => r.paymentDate >= ms && r.paymentDate <= me && r.paymentDate <= todayForChart)
      .reduce((s, r) => s + r.amountPaid, 0));
    return { month, amount };
  });

  const lowTicketRevenue      = round2(ltPaidRows.reduce((s, r) => s + r.amountPaid, 0));
  const lowTicketEarnings     = round2(ltPaidRows.reduce((s, r) => s + r.earnings, 0));
  // Revana commission: 20% of (HT collected earnings + LT earnings)
  const revanaCommission      = round2((htEarningsCollected + lowTicketEarnings) * 0.20);
  const lowTicketThisMonth    = round2(ltPaidRows.filter(r => r.paymentDate >= monthStart).reduce((s, r) => s + r.amountPaid, 0));
  const lowTicketToday        = round2(ltPaidRows.filter(r => r.paymentDate >= ltTodayStart).reduce((s, r) => s + r.amountPaid, 0));
  const lowTicketPaymentCount = ltPaidRows.length;

  // ── Pay period commissions ─────────────────────────────────────────────────
  const periods             = getPayPeriods(new Date());
  const currentHtEarnings   = round2(allDealRows.filter(r => r.paymentDate >= periods.current.start  && r.paymentDate <= periods.current.end ).reduce((s, r) => s + r.earnings, 0));
  const previousHtEarnings  = round2(allDealRows.filter(r => r.paymentDate >= periods.previous.start && r.paymentDate <= periods.previous.end).reduce((s, r) => s + r.earnings, 0));
  const currentLtEarnings   = round2(ltPaidRows.filter(r  => r.paymentDate >= periods.current.start  && r.paymentDate <= periods.current.end ).reduce((s, r) => s + r.earnings, 0));
  const previousLtEarnings  = round2(ltPaidRows.filter(r  => r.paymentDate >= periods.previous.start && r.paymentDate <= periods.previous.end).reduce((s, r) => s + r.earnings, 0));

  // Per-period setter/closer commissions (reuse toLines exclusion filter)
  const buildPeriodComm = (start: Date, end: Date) => {
    const sm = new Map<string, number>();
    const cm = new Map<string, number>();
    for (const r of allDealRows.filter(r => r.paymentDate >= start && r.paymentDate <= end)) {
      sm.set(r.setterName, (sm.get(r.setterName) ?? 0) + r.setterCommission);
      cm.set(r.closerName, (cm.get(r.closerName) ?? 0) + r.closerCommission);
    }
    return { setter: toLines(sm), closer: toLines(cm) };
  };
  const currComm = buildPeriodComm(periods.current.start,  periods.current.end);
  const prevComm = buildPeriodComm(periods.previous.start, periods.previous.end);

  const payPeriodCommission = {
    current: {
      label:      periods.current.label,
      payDate:    periods.current.payLabel,
      htEarnings: currentHtEarnings,
      ltEarnings: currentLtEarnings,
      revana:     round2((currentHtEarnings + currentLtEarnings) * 0.20),
      setterComm: currComm.setter,
      closerComm: currComm.closer,
    },
    previous: {
      label:      periods.previous.label,
      payDate:    periods.previous.payLabel,
      htEarnings: previousHtEarnings,
      ltEarnings: previousLtEarnings,
      revana:     round2((previousHtEarnings + previousLtEarnings) * 0.20),
      setterComm: prevComm.setter,
      closerComm: prevComm.closer,
    },
  };

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
    revenueStillDueThisMonth,
    htCashCollectedToday,
    dealsClosedToday,
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
    morningHuddleEod,
    addOns,
    addOnTotal,
    htCashCollectedByMonth,
    ltRevenueByMonth,
    lowTicketRevenue,
    lowTicketEarnings,
    htEarningsCollected,
    revanaCommission,
    lowTicketThisMonth,
    lowTicketToday,
    lowTicketPaymentCount,
    lowTicketRows,
    combinedTotalContracted,
    combinedCashCollected,
    combinedUncollected,
    combinedNetCollected,
    payPeriodCommission,
    subscriptions,
    totalMonthlyOverhead: round2(subscriptions.reduce((s, x) => s + x.monthlyCost, 0)),
    // Only rows where payment has actually landed (paymentDate ≤ today)
    // Sorted newest payment first so the client can render without re-sorting
    teamDealRows: allDealRows
      .filter(r => r.paymentDate <= today)
      .sort((a, b) => b.paymentDate.getTime() - a.paymentDate.getTime())
      .map(r => ({
        leadName:         r.leadName,
        program:          r.program,
        dateClosed:       r.dateClosed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        paymentDate:      r.paymentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        paymentDateMs:    r.paymentDate.getTime(),
        cashCollected:    r.cashCollected,
        setterName:       r.setterName,
        setterCommission: r.setterCommission,
        closerName:       r.closerName,
        closerCommission: r.closerCommission,
      })),
  };
}

// ── Calendly ──────────────────────────────────────────────────────────────────

export type UpcomingCall = {
  inviteeName:  string;
  inviteeEmail: string;
  startTime:    string;   // ISO 8601
  endTime:      string;   // ISO 8601
  eventType:    string;   // Calendly event type name
  hostName:     string;   // Calendly host (the closer taking the call)
  cancelled:    boolean;
  noShow:       boolean;  // true when invitee was marked no-show OR cancel reason is "no show"
  rescheduled:  boolean;  // true when cancel reason contains "reschedule"
};

export type CalendlyData = {
  /** Active (non-cancelled) calls booked in range */
  bookedInRange:       number;
  cancelledInRange:    number;
  showRate:            number;
  cancelReasons:       string[];
  bookedToday:         number;
  noShowsCancelsToday: number;
  /** Future scheduled calls (next 30 days), sorted ascending */
  upcomingCalls:       UpcomingCall[];
};

async function fetchCalendlyData(start: Date, end: Date): Promise<CalendlyData | null> {
  try {
    const org     = encodeURIComponent(CALENDLY_ORG);
    const min     = start.toISOString();
    const max     = end.toISOString();
    // Look back 30 days so Previous sub-sections (Today / Last 7 / Last 30) are populated
    const past30ISO = new Date(Date.now() - 30 * 24 * 3600_000).toISOString();
    const future30  = new Date(Date.now() + 30 * 24 * 3600_000).toISOString();
    const headers = { Authorization: "Bearer " + CALENDLY_TOKEN };

    const [activeRes, cancelRes, upcomingRes, upcomingCancelRes] = await Promise.all([
      fetch(`https://api.calendly.com/scheduled_events?organization=${org}&min_start_time=${min}&max_start_time=${max}&status=active&count=100`,    { headers, cache: "no-store" }),
      fetch(`https://api.calendly.com/scheduled_events?organization=${org}&min_start_time=${min}&max_start_time=${max}&status=canceled&count=100`,  { headers, cache: "no-store" }),
      fetch(`https://api.calendly.com/scheduled_events?organization=${org}&min_start_time=${past30ISO}&max_start_time=${future30}&status=active&count=100`,   { headers, cache: "no-store" }),
      fetch(`https://api.calendly.com/scheduled_events?organization=${org}&min_start_time=${past30ISO}&max_start_time=${future30}&status=canceled&count=100`, { headers, cache: "no-store" }),
    ]);

    // Only count "1:1 Mentorship Call" events — ignore discovery calls, etc.
    const isMentorshipEvent = (e: unknown) =>
      ((e as { name?: string }).name ?? "").toLowerCase().includes("1:1 mentorship");

    const active    = ((await activeRes.json()).collection ?? []).filter(isMentorshipEvent) as unknown[];
    const cancelled = ((await cancelRes.json()).collection ?? []).filter(isMentorshipEvent) as Array<{ cancellation?: { reason?: string } }>;
    const total     = active.length + cancelled.length;

    type CalEvent = {
      uri: string; name: string; start_time: string; end_time: string;
      created_at?: string;
      event_memberships?: Array<{ user_name?: string }>;
      cancellation?: { reason?: string; canceled_by?: string };
    };
    const upcomingActive    = (((await upcomingRes.json()).collection        ?? []) as CalEvent[]).filter(e => e.name.toLowerCase().includes("1:1 mentorship"));
    const upcomingCancelled = (((await upcomingCancelRes.json()).collection  ?? []) as CalEvent[]).filter(e => e.name.toLowerCase().includes("1:1 mentorship"));
    // Combine: active first, cancelled second (both sorted by start_time below)
    const upcomingEvents = [
      ...upcomingActive.map(e  => ({ ...e, _cancelled: false })),
      ...upcomingCancelled.map(e => ({ ...e, _cancelled: true  })),
    ];

    // Fetch invitees for every upcoming event in parallel (up to 100)
    const inviteeResults = await Promise.allSettled(
      upcomingEvents.slice(0, 100).map(async (event) => {
        const uuid = event.uri.split("/").pop();
        const r = await fetch(
          `https://api.calendly.com/scheduled_events/${uuid}/invitees?count=10`,
          { headers, cache: "no-store" }
        );
        const j = await r.json() as { collection?: Array<{ name: string; email: string; no_show?: object | null }> };
        return { event, invitees: j.collection ?? [] };
      })
    );

    const INVITEE_EXCLUDE = new Set(["gavin van jaarsveldt", "gavin"]);

    const upcomingCalls: UpcomingCall[] = [];
    for (const result of inviteeResults) {
      if (result.status !== "fulfilled") continue;
      const { event, invitees } = result.value;
      for (const inv of invitees) {
        if (INVITEE_EXCLUDE.has((inv.name || "").toLowerCase().trim())) continue;
        // No-show: invitee marked no-show OR cancellation reason mentions "no show"
        const cancelReason = (event.cancellation?.reason ?? "").toLowerCase();
        const noShow      = !!inv.no_show || cancelReason.includes("no show") || cancelReason.includes("no-show");
        const rescheduled = cancelReason.includes("reschedule") || cancelReason.includes("rescheduled");
        upcomingCalls.push({
          inviteeName:  inv.name  || "Unknown",
          inviteeEmail: inv.email || "",
          startTime:    event.start_time,
          endTime:      event.end_time,
          eventType:    event.name,
          hostName:     event.event_memberships?.[0]?.user_name || "",
          cancelled:    event._cancelled,
          noShow,
          rescheduled,
        });
      }
    }
    upcomingCalls.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    // Count active events booked today (created_at = today US date)
    const calTodayStart = startOfTodayUS();
    const bookedToday = upcomingActive.filter(e =>
      e.created_at && new Date(e.created_at) >= calTodayStart
    ).length;

    // No-shows + cancellations with a start time TODAY only.
    // upcomingCancelled spans 30 days into the future — without an upper bound
    // a call cancelled for tomorrow would be counted as "today". Clamp to
    // [calTodayStart, calTodayEnd) so only today's scheduled slots count.
    const calTodayEnd = new Date(calTodayStart.getTime() + 86_400_000); // exclusive
    const cancelledToday = upcomingCancelled.filter(e => {
      const t = new Date(e.start_time);
      return t >= calTodayStart && t < calTodayEnd;
    }).length;
    // Active events where the invitee was flagged as a no-show (today only).
    const noShowActiveToday = upcomingCalls.filter(c => {
      const s = new Date(c.startTime);
      return s >= calTodayStart && s < calTodayEnd && c.noShow && !c.cancelled;
    }).length;
    const noShowsCancelsToday = cancelledToday + noShowActiveToday;

    return {
      bookedInRange:    active.length,
      cancelledInRange: cancelled.length,
      showRate: total > 0 ? Math.round((active.length / total) * 100) : 0,
      cancelReasons: cancelled.filter(e => e.cancellation?.reason).map(e => e.cancellation!.reason!).slice(0, 5),
      bookedToday,
      noShowsCancelsToday,
      upcomingCalls,
    };
  } catch (e) {
    console.error("Calendly error:", (e as Error).message);
    return null;
  }
}

// ── Applications (Google Sheets) ─────────────────────────────────────────────
// Replaces Typeform — reads from the "Applications" sheet tab.
// Columns: 0=Date, 1=Name, 2=Age, 3=Budget, 4=utm_source, 5=utm_medium

export type TypeformData = {
  totalInRange:          number;
  applicationsToday:     number;
  applicationsThisWeek:  number;
  applicationsYesterday: number;
  trafficSources:        { source: string; count: number }[];
  metaCampaigns:         { campaign: string; count: number }[];
  /** All-time lead names that applied via Meta ads (for ROAS cross-reference) */
  metaLeadNames:         string[];
};

async function fetchTypeformData(start: Date, end: Date): Promise<TypeformData | null> {
  try {
    const raw = await fetchGviz(SHEET_APPLICATIONS);
    if (!raw) return null;

    const sourceMap   = new Map<string, number>();
    const campaignMap = new Map<string, number>();
    const metaLeadNames: string[] = [];
    let totalInRange       = 0;
    let applicationsToday  = 0;
    let applicationsThisWeek  = 0;
    let applicationsYesterday = 0;
    const appTodayStart = startOfTodayUS();
    const appWeekStart  = startOfWeekUS();
    const appYestStart  = new Date(appTodayStart.getTime() - 86_400_000);

    for (const c of raw) {
      const date = parseGvizDate(c[0]);
      if (!date) continue;
      if (date >= appTodayStart) applicationsToday++;
      // "This week" excludes today — Sunday through yesterday
      if (date >= appWeekStart && date < appTodayStart) applicationsThisWeek++;
      if (date >= appYestStart && date < appTodayStart) applicationsYesterday++;

      // Collect ALL meta lead names regardless of date range (for all-time ROAS)
      const src = String(c[4] ?? "").trim().toLowerCase() || "organic";
      if (src === "meta") {
        const name = String(c[1] ?? "").trim();
        if (name) metaLeadNames.push(name);
      }

      if (date < start || date > end) continue;
      totalInRange++;
      sourceMap.set(src, (sourceMap.get(src) ?? 0) + 1);
      if (src === "meta") {
        const campaign = String(c[6] ?? "").trim() || "(no campaign)";
        campaignMap.set(campaign, (campaignMap.get(campaign) ?? 0) + 1);
      }
    }

    return {
      totalInRange,
      applicationsToday,
      applicationsThisWeek,
      applicationsYesterday,
      trafficSources: Array.from(sourceMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([source, count]) => ({ source, count })),
      metaCampaigns: Array.from(campaignMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([campaign, count]) => ({ campaign, count })),
      metaLeadNames,
    };
  } catch (e) {
    console.error("Applications sheet error:", (e as Error).message);
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

    // ── 2. All payments — paginate all pages (for revenueToday + failedPayments) ──
    const allPayments: WhopPayment[] = [];
    for (let page = 1; ; page++) {
      const r = await fetch(`https://api.whop.com/api/v2/payments?limit=50&page=${page}`, { headers, cache: "no-store" });
      const d = await r.json() as { data?: WhopPayment[]; pagination?: { total_page: number } };
      const batch = d.data ?? [];
      if (!batch.length) break;
      allPayments.push(...batch);
      if (page >= (d.pagination?.total_page ?? 1)) break;
    }

    // ── 3. All memberships — paginate all pages ────────────────────────────────
    //    MRR = sum of plan renewal_price for active, non-cancelling members.
    //    This matches how Whop's own dashboard calculates MRR.
    let activeMembers       = 0;
    let newMembersThisMonth = 0;
    let mrr                 = 0;
    for (let page = 1; ; page++) {
      const r = await fetch(`https://api.whop.com/api/v2/memberships?limit=50&page=${page}`, { headers, cache: "no-store" });
      const d = await r.json() as { data?: WhopMembership[]; pagination?: { total_page: number; total_count: number } };
      const batch = d.data ?? [];
      if (!batch.length) break;
      for (const m of batch) {
        if (m.status === "active" && !m.cancel_at_period_end) {
          activeMembers++;
          // MRR: use the plan's renewal_price — matches Whop dashboard exactly
          mrr += planPrice.get(m.plan) ?? 0;
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

// ── DNQs (Close CRM) ─────────────────────────────────────────────────────────

async function fetchDnqCounts(): Promise<{ today: number; thisWeek: number; yesterday: number }> {
  try {
    const CLOSE_API_KEY = process.env.CLOSE_API_KEY!;
    const auth       = "Basic " + Buffer.from(CLOSE_API_KEY + ":").toString("base64");
    const todayStart = startOfTodayUS();
    const weekStart  = startOfWeekUS();
    const yesterdayStart = new Date(todayStart.getTime() - 86_400_000);

    const q = encodeURIComponent('status_label:"DNQ"');
    const todayISO = encodeURIComponent(todayStart.toISOString());
    const weekISO  = encodeURIComponent(weekStart.toISOString());
    const yesterdayISO = encodeURIComponent(yesterdayStart.toISOString());
    const headers  = { Authorization: auth };
    const base     = `https://api.close.com/api/v1/lead/?query=${q}&_limit=100&_fields=id`;

    const [todayRes, weekRes, yesterdayRes] = await Promise.all([
      fetch(`${base}&date_created__gte=${todayISO}`,                                          { headers, cache: "no-store" }),
      // "This week" = Sunday → yesterday (today excluded)
      fetch(`${base}&date_created__gte=${weekISO}&date_created__lte=${yesterdayISO}`,         { headers, cache: "no-store" }),
      fetch(`${base}&date_created__gte=${yesterdayISO}&date_created__lte=${todayISO}`,        { headers, cache: "no-store" }),
    ]);

    const parse = async (r: Response) => {
      if (!r.ok) return 0;
      const j = await r.json() as { data?: unknown[] };
      return j.data?.length ?? 0;
    };

    const [today, thisWeek, yesterday] = await Promise.all([parse(todayRes), parse(weekRes), parse(yesterdayRes)]);
    return { today, thisWeek, yesterday };
  } catch {
    return { today: 0, thisWeek: 0, yesterday: 0 };
  }
}

// ── Meta Ads (Marketing API) ──────────────────────────────────────────────────

export type MetaAdsetRow = {
  adsetId:      string;
  adsetName:    string;
  campaignName: string;
  spend:        number;
  clicks:       number;
  impressions:  number;
  cpc:          number;
  ctr:          number;
};

export type MetaAdsData = {
  adsets:           MetaAdsetRow[];
  totalSpend:       number;
  totalClicks:      number;
  totalImpressions: number;
  avgCpc:           number;
  avgCtr:           number;
  dateRange:        string;
  /** Cash collected to date from leads who applied via Meta ads */
  cashFromAdLeads:  number;
  /** ROAS = cashFromAdLeads / totalSpend */
  roas:             number | null;
};

async function fetchMetaAdsData(): Promise<MetaAdsData | null> {
  try {
    const token   = process.env.META_ADS_TOKEN!;
    const account = process.env.META_ADS_ACCOUNT!;
    const fields  = "adset_id,adset_name,campaign_name,spend,clicks,impressions,cpc,ctr";
    const url     = `https://graph.facebook.com/v19.0/${account}/insights?level=adset&fields=${fields}&date_preset=maximum&access_token=${token}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Meta Ads API HTTP ${res.status}`);
      return null;
    }
    const json = await res.json() as {
      data?: Array<{
        adset_id?: string; adset_name?: string; campaign_name?: string;
        spend?: string; clicks?: string; impressions?: string; cpc?: string; ctr?: string;
        date_start?: string; date_stop?: string;
      }>;
      error?: { message: string };
    };
    if (json.error) {
      console.error("Meta Ads API error:", json.error.message);
      return null;
    }

    const rows: MetaAdsetRow[] = (json.data ?? []).map(r => ({
      adsetId:      r.adset_id      ?? "",
      adsetName:    r.adset_name    ?? "",
      campaignName: r.campaign_name ?? "",
      spend:        parseFloat(r.spend       ?? "0") || 0,
      clicks:       parseInt  (r.clicks      ?? "0", 10) || 0,
      impressions:  parseInt  (r.impressions ?? "0", 10) || 0,
      cpc:          parseFloat(r.cpc         ?? "0") || 0,
      ctr:          parseFloat(r.ctr         ?? "0") || 0,
    })).sort((a, b) => b.spend - a.spend);

    const totalSpend       = round2(rows.reduce((s, r) => s + r.spend,       0));
    const totalClicks      = rows.reduce((s, r) => s + r.clicks,      0);
    const totalImpressions = rows.reduce((s, r) => s + r.impressions, 0);
    const avgCpc  = totalClicks      > 0 ? round2(totalSpend / totalClicks)                              : 0;
    const avgCtr  = totalImpressions > 0 ? round2((totalClicks / totalImpressions) * 100) : 0;

    // Build date range label from first row
    const first = json.data?.[0];
    const fmtMeta = (s: string) => {
      const d = new Date(s + "T00:00:00");
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    const dateRange = first?.date_start && first?.date_stop
      ? `${fmtMeta(first.date_start)} – ${fmtMeta(first.date_stop)}` : "All time";

    // cashFromAdLeads and roas are computed in fetchAllDashboardData after cross-referencing
    // the Applications sheet — return zeroes/null here as placeholders.
    return { adsets: rows, totalSpend, totalClicks, totalImpressions, avgCpc, avgCtr, dateRange, cashFromAdLeads: 0, roas: null };
  } catch (e) {
    console.error("Meta Ads fetch error:", (e as Error).message);
    return null;
  }
}

// ── Aggregate ─────────────────────────────────────────────────────────────────

export type DashboardData = {
  sheets:         SheetsData;
  calendly:       CalendlyData | null;
  typeform:       TypeformData | null;
  whop:           WhopData | null;
  metaAds:        MetaAdsData | null;
  conversionRate: number | null;
  closeRate:      number | null;
  dnqsToday:      number;
  morningHuddle:  MorningHuddleData | null;
  lastUpdated:    string;
};

export async function fetchAllDashboardData(start: Date, end: Date): Promise<DashboardData> {
  const [sh, cal, tf, whop, dnqResult, metaResult] = await Promise.allSettled([
    fetchSheetsData(start, end),
    fetchCalendlyData(start, end),
    fetchTypeformData(start, end),
    fetchWhopData(),
    fetchDnqCounts(),
    fetchMetaAdsData(),
  ]);

  const sheets   = sh.status   === "fulfilled" ? sh.value   : ({ connected: false, error: "rejected" } as SheetsData);
  const calendly = cal.status  === "fulfilled" ? cal.value  : null;
  const typeform = tf.status   === "fulfilled" ? tf.value   : null;
  const whopVal  = whop.status === "fulfilled" ? whop.value : null;
  const dnqs     = dnqResult.status === "fulfilled" ? dnqResult.value : { today: 0, thisWeek: 0, yesterday: 0 };
  const metaAdsRaw = metaResult.status === "fulfilled" ? metaResult.value : null;

  // ── ROAS: cross-reference meta lead names → Deals sheet cash collected ────
  // Build a lowercase name set from the Applications sheet meta leads, then
  // sum cashCollected from teamDealRows for matching lead names.
  const metaLeadSet = new Set(
    (typeform?.metaLeadNames ?? []).map(n => n.toLowerCase().trim())
  );
  const cashFromAdLeads = sheets.connected
    ? round2(
        sheets.teamDealRows
          .filter(r => metaLeadSet.has(r.leadName.toLowerCase().trim()))
          .reduce((s, r) => s + r.cashCollected, 0)
      )
    : 0;
  const metaAds = metaAdsRaw
    ? {
        ...metaAdsRaw,
        cashFromAdLeads,
        roas: metaAdsRaw.totalSpend > 0 ? round2(cashFromAdLeads / metaAdsRaw.totalSpend) : null,
      }
    : null;

  const apps   = typeform?.totalInRange ?? 0;
  const booked = calendly?.bookedInRange ?? 0;
  const closed = sheets.connected ? sheets.dealsClosed : 0;

  const morningHuddle: MorningHuddleData | null = sheets.connected
    ? {
        weekLabel:      sheets.morningHuddleEod.weekLabel,
        yesterdayLabel: sheets.morningHuddleEod.yesterdayLabel,
        thisWeek: {
          applications:    typeform?.applicationsThisWeek  ?? 0,
          callsBooked:     sheets.morningHuddleEod.thisWeek.callsBooked,
          noShows:         sheets.morningHuddleEod.thisWeek.noShows,
          callsCanceled:   sheets.morningHuddleEod.thisWeek.callsCanceled,
          liveCallsPushed: sheets.morningHuddleEod.thisWeek.liveCallsPushed,
          dnqs:            dnqs.thisWeek,
          setterBreakdown: sheets.morningHuddleEod.thisWeek.setterBreakdown,
          closerBreakdown: sheets.morningHuddleEod.thisWeek.closerBreakdown,
        },
        yesterday: {
          applications:    typeform?.applicationsYesterday ?? 0,
          callsBooked:     sheets.morningHuddleEod.yesterday.callsBooked,
          noShows:         sheets.morningHuddleEod.yesterday.noShows,
          callsCanceled:   sheets.morningHuddleEod.yesterday.callsCanceled,
          liveCallsPushed: sheets.morningHuddleEod.yesterday.liveCallsPushed,
          dnqs:            dnqs.yesterday,
          setterBreakdown: sheets.morningHuddleEod.yesterday.setterBreakdown,
          closerBreakdown: sheets.morningHuddleEod.yesterday.closerBreakdown,
        },
      }
    : null;

  return {
    sheets,
    calendly,
    typeform,
    whop:           whopVal,
    metaAds,
    conversionRate: apps   > 0 ? Math.round((booked / apps)   * 100) : null,
    closeRate:      booked > 0 ? Math.round((closed / booked) * 100) : null,
    dnqsToday:      dnqs.today,
    morningHuddle,
    lastUpdated:    new Date().toISOString(),
  };
}
