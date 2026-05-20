"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { DashboardData, CommissionLine } from "@/lib/fetchDashboard";

// ── Format helpers ────────────────────────────────────────────────────────────

const fmt$ = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtPct = (n: number) => n + "%";

// ── Date range ────────────────────────────────────────────────────────────────

type PresetKey = "7d" | "30d" | "90d" | "mtd" | "ytd" | "all" | "custom";

const PRESETS: { label: string; key: PresetKey }[] = [
  { label: "7D",  key: "7d"  },
  { label: "30D", key: "30d" },
  { label: "90D", key: "90d" },
  { label: "MTD", key: "mtd" },
  { label: "YTD", key: "ytd" },
  { label: "All", key: "all" },
];

function presetToDates(key: PresetKey): { start: Date; end: Date } {
  const now   = new Date();
  const today = new Date(now); today.setHours(23, 59, 59, 999);
  const ago   = (d: number) => { const x = new Date(now); x.setDate(x.getDate() - d); x.setHours(0,0,0,0); return x; };
  switch (key) {
    case "7d":  return { start: ago(7),  end: today };
    case "30d": return { start: ago(30), end: today };
    case "90d": return { start: ago(90), end: today };
    case "mtd": return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: today };
    case "ytd": return { start: new Date(now.getFullYear(), 0, 1), end: today };
    default:    return { start: new Date("2020-01-01"), end: today };
  }
}

function toInputDate(d: Date) { return d.toISOString().split("T")[0]; }

// ── Atoms ─────────────────────────────────────────────────────────────────────

function GoldDivider() {
  return <div style={{ height: 1, background: "linear-gradient(90deg, rgba(201,168,76,0.3), transparent)", margin: "0 0 28px" }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#444", marginBottom: 14 }}>
      {children}
    </p>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px", ...style }}>
      {children}
    </div>
  );
}

function KpiCard({ label, value, sub, accent, warn, green }: {
  label: string; value: string | number; sub?: string;
  accent?: boolean; warn?: boolean; green?: boolean;
}) {
  const col = warn ? "#E05252" : green ? "#4CAF6E" : accent ? "#C9A84C" : "#F2EDE6";
  return (
    <Card>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase", color: "#555", marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 34px)", color: col, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#555", marginTop: 6 }}>{sub}</p>}
    </Card>
  );
}

function Pill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 999,
      fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
      background: ok ? "rgba(76,175,110,0.12)" : "rgba(224,82,82,0.12)",
      color: ok ? "#4CAF6E" : "#E05252",
      border: `1px solid ${ok ? "rgba(76,175,110,0.25)" : "rgba(224,82,82,0.25)"}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: ok ? "#4CAF6E" : "#E05252", display: "inline-block" }} />
      {label}
    </span>
  );
}

function BarRow({ label, value, total, color = "#C9A84C", sub }: {
  label: string; value: number; total: number; color?: string; sub?: string;
}) {
  const pct = total > 0 ? Math.min(Math.round((value / total) * 100), 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#888", minWidth: 100, flexShrink: 0 }}>{label}</p>
      <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "#F2EDE6", minWidth: 32, textAlign: "right" }}>
        {sub ?? value}
      </span>
    </div>
  );
}

function Skeleton({ h = 110 }: { h?: number }) {
  return <div style={{ height: h, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)", animation: "pulse 2s ease-in-out infinite" }} />;
}

// ── Donut Pie Chart ───────────────────────────────────────────────────────────

function DonutChart({ segments, size = 130 }: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return <p style={{ color: "#555", fontSize: 12 }}>No data</p>;

  const cx = size / 2, cy = size / 2;
  const r  = size * 0.38, inner = size * 0.22;
  let angle = -Math.PI / 2;

  const paths = segments.map(seg => {
    const slice    = (seg.value / total) * 2 * Math.PI;
    const x1       = cx + r * Math.cos(angle);
    const y1       = cy + r * Math.sin(angle);
    const x2       = cx + r * Math.cos(angle + slice);
    const y2       = cy + r * Math.sin(angle + slice);
    const largeArc = slice > Math.PI ? 1 : 0;
    const path     = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    angle += slice;
    return { ...seg, path, pct: Math.round((seg.value / total) * 100) };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {paths.map(p => <path key={p.label} d={p.path} fill={p.color} stroke="#0F0F0F" strokeWidth={2} />)}
        <circle cx={cx} cy={cy} r={inner} fill="#0F0F0F" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {paths.map(p => (
          <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color, flexShrink: 0 }} />
            <div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#F2EDE6", margin: 0 }}>{p.label}</p>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#666", margin: 0 }}>{p.pct}% · {fmt$(p.value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Funnel ────────────────────────────────────────────────────────────────────

function FunnelViz({ steps }: { steps: { label: string; value: number; pct?: number }[] }) {
  const max = Math.max(...steps.map(s => s.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((step, i) => (
        <div key={step.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#888" }}>{step.label}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {step.pct !== undefined && step.pct > 0 && (
                <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#666" }}>{step.pct}%</span>
              )}
              <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: "#F2EDE6" }}>{step.value}</span>
            </div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{
              width: `${Math.max((step.value / max) * 100, step.value > 0 ? 4 : 0)}%`,
              height: "100%", borderRadius: 4,
              background: i === 0 ? "#555" : i === 1 ? "#C9A84C" : "#4CAF6E",
              transition: "width 0.6s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Commission Table ──────────────────────────────────────────────────────────

function CommissionTable({ title, rows, subRows, accent }: {
  title: string;
  rows: CommissionLine[];          // total owed
  subRows?: CommissionLine[];      // paid to date (optional)
  accent?: string;
}) {
  if (!rows.length) return null;
  const paidMap = new Map((subRows ?? []).map(r => [r.name, r.amount]));
  return (
    <div>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555", marginBottom: 10 }}>{title}</p>
      <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden" }}>
        {rows.map((r, i) => (
          <div key={r.name} style={{
            display: "grid", gridTemplateColumns: "1fr auto auto",
            gap: 10, padding: "9px 14px", alignItems: "center",
            borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#CCC" }}>{r.name}</span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#555" }}>
              {paidMap.has(r.name) ? `${fmt$(paidMap.get(r.name)!)} paid` : ""}
            </span>
            <span style={{ fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 700, color: accent ?? "#C9A84C", minWidth: 72, textAlign: "right" }}>{fmt$(r.amount)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Revana Commission Panel ───────────────────────────────────────────────────

function RevanaPanel({ netEarnings, setterTotal, closerTotal }: {
  netEarnings: number; setterTotal: number; closerTotal: number;
}) {
  const [rate, setRate] = useState(10);
  const remaining = Math.max(netEarnings - setterTotal - closerTotal, 0);
  const revana    = Math.round(remaining * (rate / 100) * 100) / 100;
  const hudson    = Math.round(Math.max(remaining - revana, 0) * 100) / 100;

  return (
    <Card>
      <p style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase", color: "#555", marginBottom: 14 }}>
        Revana Commission
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#777" }}>Agency rate:</span>
        <input type="number" min={0} max={100} value={rate}
          onChange={e => setRate(Math.max(0, Math.min(100, Number(e.target.value))))}
          style={{ width: 52, padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(201,168,76,0.3)", background: "rgba(201,168,76,0.07)", color: "#F2EDE6", fontFamily: "var(--font-body)", fontSize: 13, outline: "none" }}
        />
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#777" }}>%</span>
      </div>
      {[
        { label: "Net Earnings (collected)",    value: fmt$(netEarnings),  col: "#F2EDE6" },
        { label: "Setter commissions paid",     value: `-${fmt$(setterTotal)}`, col: "#E05252" },
        { label: "Closer commissions paid",     value: `-${fmt$(closerTotal)}`, col: "#E05252" },
      ].map(row => (
        <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#777" }}>{row.label}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: row.col, fontWeight: 600 }}>{row.value}</span>
        </div>
      ))}
      <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "8px 0 10px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "#C9A84C", fontWeight: 700 }}>Revana ({rate}%)</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#C9A84C", lineHeight: 1 }}>{fmt$(revana)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#777" }}>Hudson net</span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "#4CAF6E", lineHeight: 1 }}>{fmt$(hudson)}</span>
      </div>
    </Card>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
      <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C" />
      <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37" />
      <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C" />
      <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37" />
    </svg>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return <div style={{ width: 14, height: 14, border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const DATE_INPUT: React.CSSProperties = {
  padding: "4px 10px", borderRadius: 7,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)", color: "#F2EDE6",
  fontFamily: "var(--font-body)", fontSize: 12, outline: "none",
};

export default function DashboardPage() {
  const [data,        setData]        = useState<DashboardData | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [refreshing,  setRefreshing]  = useState(false);
  const [preset,      setPreset]      = useState<PresetKey>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd,   setCustomEnd]   = useState(() => toInputDate(new Date()));
  const [showCustom,  setShowCustom]  = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const buildParams = useCallback((p: PresetKey, cs: string, ce: string) => {
    if (p === "custom" && cs && ce) return `?start=${cs}&end=${ce}`;
    const { start, end } = presetToDates(p);
    return `?start=${toInputDate(start)}&end=${toInputDate(end)}`;
  }, []);

  const load = useCallback(async (silent = false, p = preset, cs = customStart, ce = customEnd) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    setError(false);
    try {
      const res = await fetch(`/api/dashboard${buildParams(p, cs, ce)}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { setError(true); }
    finally { setLoading(false); setRefreshing(false); }
  }, [preset, customStart, customEnd, buildParams]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => load(true), 120_000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [load]);

  const handlePreset = (key: PresetKey) => {
    if (key === "custom") { setShowCustom(true); setPreset("custom"); return; }
    setShowCustom(false); setPreset(key);
    load(false, key, customStart, customEnd);
  };

  const atRaw  = data?.airtable;
  const at     = atRaw?.connected === true ? atRaw : null;       // Airtable (deals)
  const shRaw  = data?.sheets;
  const sh     = shRaw?.connected === true ? shRaw : null;       // Sheets (payments)
  const cal    = data?.calendly;
  const tf     = data?.typeform;
  const whop   = data?.whop;
  const updated = data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : "—";

  const setterTotal = sh?.setterCommPaid.reduce((s, r) => s + r.amount, 0) ?? 0;
  const closerTotal = sh?.closerCommPaid.reduce((s, r) => s + r.amount, 0) ?? 0;
  const progMax     = Math.max(...(at?.revenueByProgram.map(p => p.contracted) ?? [1]));
  const srcMax      = Math.max(...(tf?.trafficSources.map(s => s.count) ?? [1]));

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#0A0A0A", padding: "32px 20px 80px" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.75} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none }
        input[type=number] { -moz-appearance:textfield }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <Logo />
              <span style={{ fontFamily: "var(--font-display)", fontSize: 10, color: "#F2EDE6", letterSpacing: "0.16em" }}>HUDDYERTRADES</span>
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 48px)", color: "#F2EDE6", lineHeight: 1, margin: 0 }}>
              OPS <span className="gold-text-gradient">DASHBOARD</span>
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {refreshing && <Spinner />}
            <span style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "#3A3A3A" }}>Updated {updated}</span>
            <button onClick={() => load(true)} disabled={refreshing}
              style={{ fontFamily: "var(--font-body)", fontSize: 11, padding: "5px 12px", borderRadius: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#666", cursor: "pointer", opacity: refreshing ? 0.4 : 1 }}>
              Refresh
            </button>
          </div>
        </div>

        {/* Connection status */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 20 }}>
          <Pill ok={at   !== null} label={at    ? "Airtable ✓"       : atRaw?.connected === false ? `Airtable: ${atRaw.error}` : "Airtable —"} />
          <Pill ok={sh   !== null} label={sh    ? "Google Sheets ✓"  : shRaw?.connected === false ? `Sheets: ${shRaw.error}` : "Sheets —"} />
          <Pill ok={cal  !== null} label={cal   ? "Calendly ✓"       : "Calendly —"} />
          <Pill ok={tf   !== null} label={tf    ? "Typeform ✓"       : "Typeform —"} />
          <Pill ok={whop !== null} label={whop  ? "Whop ✓"           : "Whop —"} />
        </div>

        {/* Date filter */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {PRESETS.map(p => (
              <button key={p.key} onClick={() => handlePreset(p.key)} style={{
                fontFamily: "var(--font-body)", fontSize: 12, padding: "5px 14px", borderRadius: 7, cursor: "pointer",
                background: preset === p.key ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${preset === p.key ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: preset === p.key ? "#C9A84C" : "#666", transition: "all 0.15s",
              }}>{p.label}</button>
            ))}
            <button onClick={() => handlePreset("custom")} style={{
              fontFamily: "var(--font-body)", fontSize: 12, padding: "5px 14px", borderRadius: 7, cursor: "pointer",
              background: preset === "custom" ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${preset === "custom" ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: preset === "custom" ? "#C9A84C" : "#666",
            }}>Custom</button>
          </div>
          {showCustom && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10, flexWrap: "wrap" }}>
              <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} style={DATE_INPUT} />
              <span style={{ color: "#444", fontSize: 12 }}>→</span>
              <input type="date" value={customEnd} onChange={e => setCustomEnd(e.target.value)} style={DATE_INPUT} />
              <button onClick={() => load(false, "custom", customStart, customEnd)}
                style={{ fontFamily: "var(--font-body)", fontSize: 12, padding: "5px 14px", borderRadius: 7, background: "rgba(201,168,76,0.14)", border: "1px solid rgba(201,168,76,0.35)", color: "#C9A84C", cursor: "pointer" }}>
                Apply
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 20 }}>
            {[...Array(8)].map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "#E05252", fontFamily: "var(--font-body)", fontSize: 14 }}>
              Failed to load.{" "}
              <button onClick={() => load()} style={{ color: "#C9A84C", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
                Retry
              </button>
            </p>
          </div>
        )}

        {data && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* ── Revenue Overview ── */}
            <section>
              <SectionLabel>Revenue Overview</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10 }}>
                <KpiCard label="Total Contracted" value={at  ? fmt$(at.totalContracted)                         : "—"} accent
                  sub="From Airtable deals" />
                <KpiCard label="Cash Collected"   value={sh  ? fmt$(sh.cashCollected)                           : "—"} green
                  sub="Payments received (Sheets)" />
                <KpiCard label="Uncollected Rev"  value={data?.uncollected !== null ? fmt$(data.uncollected!)   : "—"}
                  sub="Contracted minus collected" />
                <KpiCard label="This Month"       value={sh  ? fmt$(sh.revenueThisMonth)                        : "—"}
                  sub="Payments due current month" />
                <KpiCard label="High Ticket"      value={at  ? fmt$(at.highTicketRevenue)                       : "—"}
                  sub="1:1 Mentorship" accent />
                <KpiCard label="Low Ticket"       value={at  ? fmt$(at.lowTicketRevenue + (whop?.mrr ?? 0))     : "—"}
                  sub="Group Coaching + Community" />
                <KpiCard label="Community MRR"    value={whop ? fmt$(whop.mrr)                                  : "—"}
                  sub={whop ? `${whop.activeMemberCount} active members` : undefined} />
                <KpiCard label="Churned Rev"      value="N/A" sub="Not tracked in sheet" />
              </div>
            </section>

            <GoldDivider />

            {/* ── Sales Performance ── */}
            <section>
              <SectionLabel>Sales Performance</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10 }}>
                <KpiCard label="Deals Closed"    value={at?.dealsClosed   ?? "—"} accent />
                <KpiCard label="Avg Deal Value"  value={at  ? fmt$(at.avgDealValue) : "—"} />
                <KpiCard label="Applications"    value={tf?.totalInRange ?? "—"} />
                <KpiCard label="Calls Booked"    value={cal?.bookedInRange ?? "—"} />
                <KpiCard label="Conversion Rate" value={data.conversionRate !== null ? fmtPct(data.conversionRate) : "—"}
                  sub="Applications → Calls"
                  accent={!!data.conversionRate && data.conversionRate >= 15}
                  warn={data.conversionRate !== null && data.conversionRate < 8} />
                <KpiCard label="Close Rate"      value={data.closeRate !== null ? fmtPct(data.closeRate) : "—"}
                  sub="Calls → Deals"
                  accent={!!data.closeRate && data.closeRate >= 30}
                  warn={data.closeRate !== null && data.closeRate < 15} />
                <KpiCard label="Show Rate"       value={cal ? fmtPct(cal.showRate) : "—"}
                  sub={cal ? `${cal.cancelledInRange} cancelled` : undefined}
                  accent={!!cal && cal.showRate >= 70}
                  warn={!!cal && cal.showRate < 50} />
                <KpiCard label="Whop Today"      value={whop ? fmt$(whop.revenueToday) : "—"}
                  sub={whop?.failedPayments ? `${whop.failedPayments} failed payments` : undefined}
                  warn={!!whop?.failedPayments} />
              </div>
            </section>

            <GoldDivider />

            {/* ── Revenue Breakdown ── */}
            <section>
              <SectionLabel>Revenue Breakdown</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>

                <Card>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "#F2EDE6", marginBottom: 16 }}>PIF vs Financed</p>
                  {at ? (
                    <DonutChart segments={[
                      { label: "PIF",      value: at.pifContracted,      color: "#C9A84C" },
                      { label: "Financed", value: at.financedContracted, color: "rgba(201,168,76,0.22)" },
                    ]} />
                  ) : <p style={{ color: "#555", fontSize: 12 }}>No data</p>}
                </Card>

                <Card>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "#F2EDE6", marginBottom: 16 }}>Revenue by Program</p>
                  {at?.revenueByProgram.length ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {at.revenueByProgram.map(p => (
                        <div key={p.program}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#888" }}>{p.program}</span>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 700, color: "#F2EDE6" }}>{fmt$(p.contracted)}</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 3 }}>
                            <div style={{ width: `${Math.round((p.contracted / progMax) * 100)}%`, height: "100%", background: "#C9A84C", borderRadius: 3, transition: "width 0.5s" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p style={{ color: "#555", fontSize: 12 }}>No data</p>}
                </Card>

                <Card>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "#F2EDE6", marginBottom: 16 }}>Lead Sources (UTM)</p>
                  {tf?.trafficSources.length ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {tf.trafficSources.slice(0, 8).map(s => (
                        <BarRow key={s.source} label={s.source} value={s.count} total={srcMax} />
                      ))}
                    </div>
                  ) : <p style={{ color: "#555", fontSize: 12 }}>No data</p>}
                </Card>

              </div>
            </section>

            <GoldDivider />

            {/* ── Funnel ── */}
            <section>
              <SectionLabel>Funnel</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>

                <Card>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "#F2EDE6", marginBottom: 16 }}>
                    Applications → Calls → Deals
                  </p>
                  <FunnelViz steps={[
                    { label: "Applications", value: tf?.totalInRange ?? 0 },
                    { label: "Calls Booked", value: cal?.bookedInRange ?? 0, pct: data.conversionRate ?? 0 },
                    { label: "Deals Closed", value: at?.dealsClosed ?? 0, pct: data.closeRate ?? 0 },
                  ]} />
                </Card>

                {cal && cal.cancelReasons.length > 0 && (
                  <Card>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 12, fontWeight: 600, color: "#F2EDE6", marginBottom: 12 }}>
                      Cancel Reasons
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {cal.cancelReasons.map((r, i) => (
                        <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "#777", padding: "8px 12px", borderRadius: 7, lineHeight: 1.5, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          &ldquo;{r}&rdquo;
                        </p>
                      ))}
                    </div>
                  </Card>
                )}

              </div>
            </section>

            <GoldDivider />

            {/* ── Commissions ── */}
            <section>
              <SectionLabel>Commissions</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>

                {at && (
                  <Card>
                    <CommissionTable
                      title="Setter Commissions (total owed)"
                      rows={at.setterCommissions}
                      subRows={sh?.setterCommPaid}
                    />
                    <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 0" }} />
                    <CommissionTable
                      title="Closer Commissions (total owed)"
                      rows={at.closerCommissions}
                      subRows={sh?.closerCommPaid}
                      accent="#4CAF6E"
                    />
                    <p style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "#3A3A3A", marginTop: 12 }}>
                      Right = total owed (Airtable) · left = paid to date (Sheets)
                    </p>
                  </Card>
                )}

                {sh && (
                  <RevanaPanel
                    netEarnings={sh.totalNetEarnings}
                    setterTotal={setterTotal}
                    closerTotal={closerTotal}
                  />
                )}

              </div>
            </section>

          </div>
        )}

      </div>
    </main>
  );
}
