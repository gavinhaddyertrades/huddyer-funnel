"use client";

import { useEffect, useState, useCallback } from "react";
import type { DashboardData } from "@/lib/fetchDashboard";

const TEAM_AUTH_KEY = "huddyer_team_auth";
const AUTH_TTL_MS   = 24 * 3_600_000; // 24 hours

const fmt$Exact = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
      <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C"/>
      <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37"/>
      <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C"/>
      <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37"/>
    </svg>
  );
}

function Row({ label, value, highlight, dim }: { label: string; value: string; highlight?: boolean; dim?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
      <span style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 13, color: dim ? "#666" : "#AAA" }}>
        {label}
      </span>
      <span style={{
        fontFamily:  highlight ? "var(--font-bebas, sans-serif)" : "var(--font-dm-sans, sans-serif)",
        fontSize:    highlight ? 26 : 14,
        fontWeight:  highlight ? undefined : 700,
        color:       dim ? "#777" : highlight ? "#C9A84C" : "#F2EDE6",
        lineHeight:  1,
      }}>
        {value}
      </span>
    </div>
  );
}

export default function TeamPage() {
  const [authedName, setAuthedName] = useState<string | null>(null);
  const [hydrated,   setHydrated]   = useState(false);
  const [password,   setPassword]   = useState("");
  const [checking,   setChecking]   = useState(false);
  const [shake,      setShake]      = useState(false);
  const [data,       setData]       = useState<DashboardData | null>(null);
  const [loading,    setLoading]    = useState(false);

  // ── Restore session ──────────────────────────────────────────────────────────
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

  // ── Password submit ──────────────────────────────────────────────────────────
  const attempt = useCallback(async () => {
    if (!password.trim() || checking) return;
    setChecking(true);
    try {
      const res  = await fetch(`/api/team-auth?password=${encodeURIComponent(password.trim())}`);
      const json = await res.json() as { name?: string; error?: string };
      if (res.ok && json.name) {
        localStorage.setItem(
          TEAM_AUTH_KEY,
          JSON.stringify({ name: json.name, exp: Date.now() + AUTH_TTL_MS })
        );
        setAuthedName(json.name);
      } else {
        setShake(true);
        setPassword("");
        setTimeout(() => setShake(false), 600);
      }
    } catch {
      setShake(true);
      setPassword("");
      setTimeout(() => setShake(false), 600);
    } finally {
      setChecking(false);
    }
  }, [password, checking]);

  // ── Load dashboard data once authenticated ───────────────────────────────────
  useEffect(() => {
    if (!authedName) return;
    setLoading(true);
    fetch("/api/dashboard", { cache: "no-store" })
      .then(r => r.json())
      .then((d: DashboardData) => setData(d))
      .catch(() => { /* leave data null */ })
      .finally(() => setLoading(false));
  }, [authedName]);

  // ── SSR / hydration guard ────────────────────────────────────────────────────
  if (!hydrated) return null;

  const baseStyle: React.CSSProperties = {
    minHeight:      "100vh",
    background:     "#0A0A0A",
    color:          "#F2EDE6",
    fontFamily:     "var(--font-dm-sans, sans-serif)",
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    padding:        "24px",
  };

  const card: React.CSSProperties = {
    background:   "rgba(255,255,255,0.025)",
    border:       "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12,
    padding:      "20px 22px",
    width:        "100%",
  };

  // ── Password gate ────────────────────────────────────────────────────────────
  if (!authedName) {
    return (
      <div style={{ ...baseStyle, justifyContent: "center" }}>
        <style>{`
          @keyframes gate-shake {
            0%,100% { transform: translateX(0); }
            20%     { transform: translateX(-8px); }
            40%     { transform: translateX(8px); }
            60%     { transform: translateX(-5px); }
            80%     { transform: translateX(5px); }
          }
          .gate-shake { animation: gate-shake 0.5s ease; }
          @keyframes gate-shimmer {
            0%   { background-position: 200% center; }
            100% { background-position: -200% center; }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>

        <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          <Logo />

          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily:           "var(--font-bebas, sans-serif)",
              fontSize:             "clamp(36px, 8vw, 56px)",
              letterSpacing:        "0.06em",
              background:           "linear-gradient(90deg, #A07830 0%, #D4AF37 30%, #FFF3B0 50%, #D4AF37 70%, #A07830 100%)",
              backgroundSize:       "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip:       "text",
              WebkitTextFillColor:  "transparent",
              animation:            "gate-shimmer 4s linear infinite",
              margin:               0,
              lineHeight:           1,
            }}>
              MY STATS
            </p>
            <p style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 12, color: "#555", marginTop: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Enter your password
            </p>
          </div>

          <div className={shake ? "gate-shake" : ""} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && attempt()}
              autoFocus
              placeholder="Your password"
              style={{
                width:        "100%",
                padding:      "14px 18px",
                background:   "rgba(255,255,255,0.04)",
                border:       `1px solid ${shake ? "#E05252" : "rgba(201,168,76,0.25)"}`,
                borderRadius: 10,
                color:        "#F2EDE6",
                fontFamily:   "var(--font-dm-sans, sans-serif)",
                fontSize:     16,
                outline:      "none",
                letterSpacing:"0.1em",
                textAlign:    "center",
                boxSizing:    "border-box",
              }}
            />
            <button
              onClick={attempt}
              disabled={checking}
              style={{
                width:         "100%",
                padding:       "14px 0",
                background:    "linear-gradient(135deg, #C9A84C 0%, #D4AF37 50%, #C9A84C 100%)",
                border:        "none",
                borderRadius:  10,
                color:         "#0A0A0A",
                fontFamily:    "var(--font-dm-sans, sans-serif)",
                fontSize:      14,
                fontWeight:    700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor:        checking ? "wait" : "pointer",
                opacity:       checking ? 0.6 : 1,
              }}
            >
              {checking ? "Checking…" : "View My Commissions"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Commission view ──────────────────────────────────────────────────────────
  const sh      = data?.sheets.connected ? data.sheets : null;
  const periods = sh?.payPeriodCommission;
  const nameLow = authedName.toLowerCase().trim();

  const findAmt = (arr: { name: string; amount: number }[]) =>
    arr.find(r => r.name.toLowerCase().trim() === nameLow)?.amount ?? null;

  const currSetterAmt = periods ? findAmt(periods.current.setterComm)  : null;
  const currCloserAmt = periods ? findAmt(periods.current.closerComm)  : null;
  const prevSetterAmt = periods ? findAmt(periods.previous.setterComm) : null;
  const prevCloserAmt = periods ? findAmt(periods.previous.closerComm) : null;

  const currTotal = (currSetterAmt ?? 0) + (currCloserAmt ?? 0);
  const prevTotal = (prevSetterAmt ?? 0) + (prevCloserAmt ?? 0);
  const hasData   = currTotal > 0 || prevTotal > 0;

  return (
    <div style={{ ...baseStyle, justifyContent: "flex-start", paddingTop: 48 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Logo />
            <div>
              <p style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 10, color: "#AAA", margin: 0, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                My Stats
              </p>
              <p style={{ fontFamily: "var(--font-bebas, sans-serif)", fontSize: 22, color: "#F2EDE6", margin: 0, letterSpacing: "0.08em" }}>
                {authedName}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem(TEAM_AUTH_KEY);
              setAuthedName(null);
              setData(null);
            }}
            style={{ background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer", fontFamily: "var(--font-dm-sans, sans-serif)", padding: "4px 8px", borderRadius: 6 }}
          >
            Sign out
          </button>
        </div>

        <div style={{ height: 1, background: "linear-gradient(90deg, rgba(201,168,76,0.3), transparent)" }} />

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ width: 20, height: 20, border: "2px solid rgba(201,168,76,0.2)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto" }} />
          </div>
        )}

        {/* ── Error / no connection ── */}
        {!loading && !sh && (
          <p style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 13, color: "#888", textAlign: "center" }}>
            Could not load data — try refreshing.
          </p>
        )}

        {/* ── No match ── */}
        {!loading && sh && !hasData && (
          <div style={card}>
            <p style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 13, color: "#888", textAlign: "center", fontStyle: "italic", margin: 0 }}>
              No commission data found for <strong style={{ color: "#F2EDE6" }}>{authedName}</strong>.
              <span style={{ fontSize: 11, color: "#555", display: "block", marginTop: 8 }}>
                Your name must match exactly what&apos;s in the Deals sheet.
              </span>
            </p>
          </div>
        )}

        {/* ── Commissions ── */}
        {!loading && hasData && periods && (
          <>
            {/* Current period */}
            <div style={card}>
              <p style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase", color: "#AAA", margin: "0 0 2px" }}>
                Current Pay Period
              </p>
              <p style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 12, color: "#888", margin: "0 0 18px" }}>
                {periods.current.label}
                {" · "}
                <span style={{ color: "#C9A84C" }}>{periods.current.payDate}</span>
              </p>

              {currSetterAmt !== null && <Row label="Setter Commission" value={fmt$Exact(currSetterAmt)} />}
              {currCloserAmt !== null && <Row label="Closer Commission" value={fmt$Exact(currCloserAmt)} />}

              {currSetterAmt !== null && currCloserAmt !== null && (
                <>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "10px 0 14px" }} />
                  <Row label="Total" value={fmt$Exact(currTotal)} highlight />
                </>
              )}

              {currSetterAmt === null && currCloserAmt === null && (
                <p style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 12, color: "#666", fontStyle: "italic", margin: 0 }}>
                  No earnings this period yet
                </p>
              )}
            </div>

            {/* Previous period */}
            <div style={{ ...card, opacity: 0.7 }}>
              <p style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 10, letterSpacing: "0.13em", textTransform: "uppercase", color: "#777", margin: "0 0 2px" }}>
                Previous Pay Period
              </p>
              <p style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 12, color: "#555", margin: "0 0 18px" }}>
                {periods.previous.label}
                {" · "}
                <span style={{ color: "#888" }}>{periods.previous.payDate}</span>
              </p>

              {prevSetterAmt !== null && <Row label="Setter Commission" value={fmt$Exact(prevSetterAmt)} dim />}
              {prevCloserAmt !== null && <Row label="Closer Commission" value={fmt$Exact(prevCloserAmt)} dim />}

              {prevSetterAmt !== null && prevCloserAmt !== null && (
                <>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "10px 0 14px" }} />
                  <Row label="Total" value={fmt$Exact(prevTotal)} dim />
                </>
              )}

              {prevSetterAmt === null && prevCloserAmt === null && (
                <p style={{ fontFamily: "var(--font-dm-sans, sans-serif)", fontSize: 12, color: "#555", fontStyle: "italic", margin: 0 }}>
                  No earnings this period
                </p>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
