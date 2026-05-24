"use client";

import { useEffect, useState, useCallback } from "react";
import type { DashboardData } from "@/lib/fetchDashboard";

const TEAM_AUTH_KEY = "huddyer_team_auth";
const AUTH_TTL_MS   = 24 * 3_600_000;

const fmt$ = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmt$Exact = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (n: number) => n + "%";

// ── Atoms ─────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
      <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C"/>
      <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37"/>
      <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C"/>
      <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37"/>
    </svg>
  );
}

function GoldDiv() {
  return <div style={{ height: 1, background: "linear-gradient(90deg,rgba(201,168,76,0.3),transparent)", margin: "4px 0" }} />;
}

function SLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#AAA", marginBottom: 12, marginTop: 0 }}>
      {children}
    </p>
  );
}

function StatCard({ label, value, sub, color = "#F2EDE6" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "16px 18px" }}>
      <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#AAA", margin: "0 0 8px" }}>{label}</p>
      <p style={{ fontFamily: "var(--font-bebas,sans-serif)", fontSize: "clamp(22px,5vw,30px)", color, lineHeight: 1, margin: 0 }}>{value}</p>
      {sub && <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 11, color: "#666", margin: "5px 0 0" }}>{sub}</p>}
    </div>
  );
}

function CommRow({ label, value, highlight, dim }: { label: string; value: string; highlight?: boolean; dim?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 13, color: dim ? "#555" : "#AAA" }}>{label}</span>
      <span style={{
        fontFamily: highlight ? "var(--font-bebas,sans-serif)" : "var(--font-dm-sans,sans-serif)",
        fontSize:   highlight ? 26 : 14,
        fontWeight: highlight ? undefined : 700,
        color:      dim ? "#666" : highlight ? "#C9A84C" : "#F2EDE6",
        lineHeight: 1,
      }}>{value}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [authedName, setAuthedName] = useState<string | null>(null);
  const [hydrated,   setHydrated]   = useState(false);
  const [password,   setPassword]   = useState("");
  const [checking,   setChecking]   = useState(false);
  const [shake,      setShake]      = useState(false);
  const [data,       setData]       = useState<DashboardData | null>(null);
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TEAM_AUTH_KEY);
      if (raw) {
        const { name, exp } = JSON.parse(raw) as { name: string; exp: number };
        if (Date.now() < exp) setAuthedName(name);
        else localStorage.removeItem(TEAM_AUTH_KEY);
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  const attempt = useCallback(async () => {
    if (!password.trim() || checking) return;
    setChecking(true);
    try {
      const res  = await fetch(`/api/team-auth?password=${encodeURIComponent(password.trim())}`);
      const json = await res.json() as { name?: string; error?: string };
      if (res.ok && json.name) {
        localStorage.setItem(TEAM_AUTH_KEY, JSON.stringify({ name: json.name, exp: Date.now() + AUTH_TTL_MS }));
        setAuthedName(json.name);
      } else {
        setShake(true); setPassword(""); setTimeout(() => setShake(false), 600);
      }
    } catch {
      setShake(true); setPassword(""); setTimeout(() => setShake(false), 600);
    } finally { setChecking(false); }
  }, [password, checking]);

  useEffect(() => {
    if (!authedName) return;
    setLoading(true);
    fetch("/api/dashboard", { cache: "no-store" })
      .then(r => r.json())
      .then((d: DashboardData) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authedName]);

  if (!hydrated) return null;

  const base: React.CSSProperties = {
    minHeight: "100vh", background: "#0A0A0A", color: "#F2EDE6",
    fontFamily: "var(--font-dm-sans,sans-serif)",
    display: "flex", flexDirection: "column", alignItems: "center", padding: "24px",
  };

  // ── Password gate ─────────────────────────────────────────────────────────
  if (!authedName) {
    return (
      <div style={{ ...base, justifyContent: "center" }}>
        <style>{`
          @keyframes gate-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
          .gate-shake{animation:gate-shake 0.5s ease}
          @keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
          @keyframes spin{to{transform:rotate(360deg)}}
        `}</style>
        <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          <Logo />
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-bebas,sans-serif)", fontSize: "clamp(36px,8vw,56px)",
              letterSpacing: "0.06em", margin: 0, lineHeight: 1,
              background: "linear-gradient(90deg,#A07830 0%,#D4AF37 30%,#FFF3B0 50%,#D4AF37 70%,#A07830 100%)",
              backgroundSize: "200% auto", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: "shimmer 4s linear infinite",
            }}>MY STATS</p>
            <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 12, color: "#555", marginTop: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Enter your password
            </p>
          </div>
          <div className={shake ? "gate-shake" : ""} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && attempt()}
              autoFocus placeholder="Your password"
              style={{ width: "100%", padding: "14px 18px", background: "rgba(255,255,255,0.04)", border: `1px solid ${shake?"#E05252":"rgba(201,168,76,0.25)"}`, borderRadius: 10, color: "#F2EDE6", fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 16, outline: "none", letterSpacing: "0.1em", textAlign: "center", boxSizing: "border-box" }}
            />
            <button onClick={attempt} disabled={checking}
              style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg,#C9A84C 0%,#D4AF37 50%,#C9A84C 100%)", border: "none", borderRadius: 10, color: "#0A0A0A", fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", cursor: checking?"wait":"pointer", opacity: checking?0.6:1 }}>
              {checking ? "Checking…" : "View My Stats"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Stats view ────────────────────────────────────────────────────────────
  const sh      = data?.sheets.connected ? data.sheets : null;
  const periods = sh?.payPeriodCommission;
  const nameLow = authedName.toLowerCase().trim();

  // EOD rows for this person
  const mySetterRows = (sh?.setterEod.rows ?? []).filter(r => r.name.trim().toLowerCase() === nameLow);
  const myCloserRows = (sh?.closerEod.rows ?? []).filter(r => r.name.trim().toLowerCase() === nameLow);
  const isSetter = mySetterRows.length > 0;
  const isCloser = myCloserRows.length > 0;

  // All paid payment rows for this person (paymentDate ≤ today, pre-filtered server-side)
  const allMyPaymentRows = (sh?.teamDealRows ?? []).filter(d =>
    d.closerName.trim().toLowerCase() === nameLow ||
    d.setterName.trim().toLowerCase() === nameLow
  );

  // Setter stats (EOD)
  const totalContacted = mySetterRows.reduce((s, r) => s + r.contacted,   0);
  const totalBooked    = mySetterRows.reduce((s, r) => s + r.callsBooked, 0);
  const setterNoShows  = mySetterRows.reduce((s, r) => s + r.noShows,     0);
  const bookingRate    = totalContacted > 0 ? Math.round((totalBooked / totalContacted) * 100) : null;

  // Closer stats — performance from EOD
  const totalScheduled = myCloserRows.reduce((s, r) => s + r.callsScheduled, 0);
  const eodDealsClosed = myCloserRows.reduce((s, r) => s + r.dealsClosed,    0);
  const closerNoShows  = myCloserRows.reduce((s, r) => s + r.noShows,        0);
  const closeRate      = totalScheduled > 0 ? Math.round((eodDealsClosed / totalScheduled) * 100) : null;

  // Financials from actual payment rows
  const closerCashCollected = allMyPaymentRows
    .filter(d => d.closerName.trim().toLowerCase() === nameLow)
    .reduce((s, d) => s + d.cashCollected, 0);

  const totalAllComm = allMyPaymentRows.reduce((s, d) => {
    return s + (d.closerName.trim().toLowerCase() === nameLow ? d.closerCommission : 0)
             + (d.setterName.trim().toLowerCase() === nameLow ? d.setterCommission : 0);
  }, 0);

  // Distinct leads closed (for stat card)
  const dealsClosed = new Set(
    allMyPaymentRows
      .filter(d => d.closerName.trim().toLowerCase() === nameLow)
      .map(d => d.leadName.toLowerCase())
  ).size;

  // Commissions
  const findAmt = (arr: { name: string; amount: number }[]) =>
    arr.find(r => r.name.toLowerCase().trim() === nameLow)?.amount ?? 0;
  const currSetterAmt = periods ? findAmt(periods.current.setterComm)  : 0;
  const currCloserAmt = periods ? findAmt(periods.current.closerComm)  : 0;
  const prevSetterAmt = periods ? findAmt(periods.previous.setterComm) : 0;
  const prevCloserAmt = periods ? findAmt(periods.previous.closerComm) : 0;
  const currTotal = currSetterAmt + currCloserAmt;
  const prevTotal = prevSetterAmt + prevCloserAmt;

  const hasAnyData = isSetter || isCloser || currTotal > 0 || prevTotal > 0;

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "20px 22px", width: "100%" };

  // suppress unused-variable warnings
  void eodDealsClosed; void closerNoShows;

  return (
    <div style={{ ...base, justifyContent: "flex-start", paddingTop: 40, paddingBottom: 60 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 22 }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logo />
            <div>
              <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 10, color: "#AAA", margin: 0, letterSpacing: "0.12em", textTransform: "uppercase" }}>My Stats</p>
              <p style={{ fontFamily: "var(--font-bebas,sans-serif)", fontSize: 22, color: "#F2EDE6", margin: 0, letterSpacing: "0.08em", lineHeight: 1 }}>{authedName}</p>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem(TEAM_AUTH_KEY); setAuthedName(null); setData(null); }}
            style={{ background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-dm-sans,sans-serif)", padding: "4px 8px", borderRadius: 6 }}>
            Sign out
          </button>
        </div>

        <GoldDiv />

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ width: 20, height: 20, border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto" }}/>
          </div>
        )}

        {/* ── No data ── */}
        {!loading && !hasAnyData && (
          <div style={card}>
            <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 14, color: "#AAA", textAlign: "center", margin: "0 0 10px" }}>
              No data found for <strong style={{ color: "#F2EDE6" }}>{authedName}</strong>.
            </p>
            <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 12, color: "#666", textAlign: "center", margin: 0, lineHeight: 1.6 }}>
              If you believe this is a mistake, please reach out to your sales manager.
            </p>
          </div>
        )}

        {!loading && hasAnyData && (
          <>
            {/* ── Setter Performance ── */}
            {isSetter && (
              <section>
                <SLabel>Performance</SLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
                  <StatCard label="Book Rate"     value={bookingRate !== null ? fmtPct(bookingRate) : "—"} color="#C9A84C" sub="Contacts → booked"/>
                  <StatCard label="Calls Booked"  value={totalBooked}  color="#F2EDE6" sub="Total booked"/>
                  <StatCard label="Contacts Made" value={totalContacted} sub="Total reached out"/>
                  <StatCard label="No Shows"      value={setterNoShows} color={setterNoShows > 0 ? "#E05252" : "#F2EDE6"} sub="From booked calls"/>
                </div>
              </section>
            )}

            {/* ── Closer Performance ── */}
            {isCloser && (
              <section>
                <SLabel>Performance</SLabel>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
                  <StatCard label="Close Rate"        value={closeRate !== null ? fmtPct(closeRate) : "—"} color="#C9A84C" sub="Calls → deals"/>
                  <StatCard label="Deals Closed"      value={dealsClosed}             color="#4CAF50" sub="All time"/>
                  <StatCard label="Cash Collected"    value={fmt$(closerCashCollected)} color="#F2EDE6" sub="From your deals"/>
                  <StatCard label="Total Commissions" value={fmt$Exact(totalAllComm)}   color="#C9A84C" sub="All time earned"/>
                </div>
              </section>
            )}

            <GoldDiv />

            {/* ── Commissions ── */}
            {periods && (
              <section>
                <SLabel>Commissions</SLabel>

                {/* Current period */}
                <div style={{ ...card, marginBottom: 12 }}>
                  <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase", color: "#AAA", margin: "0 0 2px" }}>Current Pay Period</p>
                  <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 12, color: "#888", margin: "0 0 18px" }}>
                    {periods.current.label} · <span style={{ color: "#C9A84C" }}>{periods.current.payDate}</span>
                  </p>
                  {currSetterAmt > 0 && <CommRow label="Setter Commission" value={fmt$Exact(currSetterAmt)} />}
                  {currCloserAmt > 0 && <CommRow label="Closer Commission" value={fmt$Exact(currCloserAmt)} />}
                  {currSetterAmt > 0 && currCloserAmt > 0 && (
                    <><div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "10px 0 14px" }}/><CommRow label="Total" value={fmt$Exact(currTotal)} highlight /></>
                  )}
                  {currTotal > 0 && !(currSetterAmt > 0 && currCloserAmt > 0) && (
                    <CommRow label="Total" value={fmt$Exact(currTotal)} highlight />
                  )}
                  {currTotal === 0 && (
                    <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 12, color: "#666", fontStyle: "italic", margin: 0 }}>No earnings this period yet</p>
                  )}
                </div>

                {/* Previous period */}
                <div style={{ ...card, opacity: 0.65 }}>
                  <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase", color: "#777", margin: "0 0 2px" }}>Previous Pay Period</p>
                  <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 12, color: "#555", margin: "0 0 18px" }}>
                    {periods.previous.label} · <span style={{ color: "#888" }}>{periods.previous.payDate}</span>
                  </p>
                  {prevSetterAmt > 0 && <CommRow label="Setter Commission" value={fmt$Exact(prevSetterAmt)} dim />}
                  {prevCloserAmt > 0 && <CommRow label="Closer Commission" value={fmt$Exact(prevCloserAmt)} dim />}
                  {prevSetterAmt > 0 && prevCloserAmt > 0 && (
                    <><div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "10px 0 14px" }}/><CommRow label="Total" value={fmt$Exact(prevTotal)} dim /></>
                  )}
                  {prevTotal > 0 && !(prevSetterAmt > 0 && prevCloserAmt > 0) && (
                    <CommRow label="Total" value={fmt$Exact(prevTotal)} dim />
                  )}
                  {prevTotal === 0 && (
                    <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 12, color: "#555", fontStyle: "italic", margin: 0 }}>No earnings this period</p>
                  )}
                </div>
              </section>
            )}

            {/* ── Payment Breakdown (one row per payment, sorted by payment date) ── */}
            {allMyPaymentRows.length > 0 && (
              <>
                <GoldDiv />
                <section>
                  <SLabel>Payment Breakdown</SLabel>
                  <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                    {allMyPaymentRows.map((d, i) => {
                      const myComm = (d.closerName.trim().toLowerCase() === nameLow ? d.closerCommission : 0)
                                   + (d.setterName.trim().toLowerCase() === nameLow ? d.setterCommission : 0);
                      return (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderBottom: i < allMyPaymentRows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 14, color: "#F2EDE6", margin: "0 0 3px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.leadName}</p>
                            <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 11, color: "#666", margin: 0 }}>{d.program} · {d.paymentDate}</p>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 16 }}>
                            <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 13, color: "#F2EDE6", margin: "0 0 3px", fontWeight: 700 }}>{fmt$(d.cashCollected)}</p>
                            <p style={{ fontFamily: "var(--font-dm-sans,sans-serif)", fontSize: 11, color: "#C9A84C", margin: 0 }}>You earned {fmt$Exact(myComm)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
