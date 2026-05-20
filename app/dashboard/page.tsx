"use client";

import { useEffect, useState, useCallback } from "react";
import type { DashboardData } from "@/lib/fetchDashboard";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt$  (n: number) { return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
function fmtPct(n: number) { return n + "%"; }
function relTime(iso: string | null) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return "< 1h ago";
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

// ── Tiny components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body text-xs uppercase tracking-widest mb-4" style={{ color: "#555" }}>
      {children}
    </p>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "20px 24px" }}
    >
      {children}
    </div>
  );
}

function KpiCard({ label, value, sub, accent = false, warn = false }: {
  label: string; value: string | number; sub?: string; accent?: boolean; warn?: boolean;
}) {
  const valueColor = warn ? "#E05252" : accent ? "#C9A84C" : "#F2EDE6";
  return (
    <Card>
      <p className="font-body text-xs uppercase tracking-widest mb-2" style={{ color: "#555" }}>{label}</p>
      <p className="font-display" style={{ fontSize: "clamp(28px, 4vw, 42px)", color: valueColor, lineHeight: 1 }}>{value}</p>
      {sub && <p className="font-body text-xs mt-1.5" style={{ color: "#555" }}>{sub}</p>}
    </Card>
  );
}

function Dot({ color }: { color: string }) {
  return <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />;
}

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className="font-body text-xs font-semibold"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 10px", borderRadius: 9999,
        background: ok ? "rgba(76,175,110,0.12)" : "rgba(224,82,82,0.12)",
        color: ok ? "#4CAF6E" : "#E05252",
        border: `1px solid ${ok ? "rgba(76,175,110,0.25)" : "rgba(224,82,82,0.25)"}`,
      }}
    >
      <Dot color={ok ? "#4CAF6E" : "#E05252"} />
      {label}
    </span>
  );
}

function BarRow({ label, value, total, color = "#C9A84C" }: {
  label: string; value: number; total: number; color?: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <p className="font-body text-xs" style={{ color: "#888", minWidth: 100, flexShrink: 0 }}>{label}</p>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
      </div>
      <span className="font-body text-xs font-semibold" style={{ color: "#F2EDE6", minWidth: 28, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function ErrorBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(224,82,82,0.08)", border: "1px solid rgba(224,82,82,0.2)" }}>
      <Dot color="#E05252" />
      <span className="font-body text-xs" style={{ color: "#E05252" }}>{name} failed to load</span>
    </div>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function TradingBarsLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
      <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C" />
      <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37" />
      <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C" />
      <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37" />
    </svg>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ h = 120 }: { h?: number }) {
  return (
    <div
      style={{ height: h, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", animation: "pulse 2s ease-in-out infinite" }}
    />
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData]       = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(false);
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      setData(await res.json());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 60 s
  useEffect(() => {
    const id = setInterval(() => load(true), 60_000);
    return () => clearInterval(id);
  }, [load]);

  const { close, calendly, whop, typeform, slack } = data ?? {};
  const lastUpdated = data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : "—";

  const stageOrder = ["Potential", "Contacted", "Qualified", "Proposal", "Won", "Lost"];
  const stageTotal = close ? Object.values(close.stageCounts).reduce((a, b) => a + b, 0) : 0;
  const sortedStages = close
    ? Object.entries(close.stageCounts).sort((a, b) => {
        const ai = stageOrder.indexOf(a[0]);
        const bi = stageOrder.indexOf(b[0]);
        return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
      })
    : [];

  const topSources = typeform
    ? Object.entries(typeform.trafficSources)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    : [];
  const sourceTotal = topSources.reduce((s, [, v]) => s + v, 0);

  return (
    <main className="min-h-screen px-5 py-10 md:px-10 lg:px-14" style={{ backgroundColor: "#0A0A0A" }}>
      <style>{`
        @keyframes pulse {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.7; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <TradingBarsLogo />
              <span className="font-display text-base" style={{ color: "#F2EDE6", letterSpacing: "0.12em" }}>HUDDYERTRADES</span>
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(30px, 5vw, 54px)", color: "#F2EDE6", lineHeight: 1 }}>
              OPS <span className="gold-text-gradient">DASHBOARD</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 mt-1">
            {refreshing && (
              <div style={{ width: 16, height: 16, border: "2px solid rgba(201,168,76,0.3)", borderTopColor: "#C9A84C", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            )}
            <p className="font-body text-xs" style={{ color: "#444" }}>
              Updated {lastUpdated}
            </p>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="font-body text-xs px-3 py-1.5 rounded-lg transition-opacity"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#888", opacity: refreshing ? 0.5 : 1 }}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => <Skeleton key={i} h={110} />)}
          </div>
        )}

        {/* ── Error state ── */}
        {error && !loading && (
          <div className="flex items-center justify-center py-20">
            <p className="font-body text-sm" style={{ color: "#E05252" }}>Failed to load dashboard data. <button onClick={() => load()} style={{ color: "#C9A84C", textDecoration: "underline" }}>Retry</button></p>
          </div>
        )}

        {/* ── Data ── */}
        {data && !loading && (
          <div className="flex flex-col gap-8">

            {/* Source errors */}
            {(!close || !calendly || !whop || !typeform || !slack) && (
              <div className="flex flex-wrap gap-2">
                {!close     && <ErrorBadge name="Close CRM" />}
                {!calendly  && <ErrorBadge name="Calendly" />}
                {!whop      && <ErrorBadge name="Whop" />}
                {!typeform  && <ErrorBadge name="Typeform" />}
                {!slack     && <ErrorBadge name="Slack" />}
              </div>
            )}

            {/* ── Row 1: Top KPIs ── */}
            <section>
              <SectionLabel>Key Metrics</SectionLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard
                  label="MRR"
                  value={whop ? fmt$(whop.mrr) : "—"}
                  sub={whop ? `$${whop.revenueToday.toLocaleString()} today` : undefined}
                  accent
                />
                <KpiCard
                  label="Active Members"
                  value={whop?.activeMemberCount ?? "—"}
                  sub={whop ? `+${whop.newMembersThisMonth} this month` : undefined}
                />
                <KpiCard
                  label="Total Leads"
                  value={close?.totalLeads ?? "—"}
                  sub={close ? `+${close.newLast30} last 30d` : undefined}
                />
                <KpiCard
                  label="Show Rate"
                  value={calendly ? fmtPct(calendly.showRate) : "—"}
                  sub={calendly ? `${calendly.totalActiveLast30} active calls (30d)` : undefined}
                  accent={!!calendly && calendly.showRate >= 70}
                  warn={!!calendly && calendly.showRate < 50}
                />
              </div>
            </section>

            {/* ── Row 2: Funnel + Calls ── */}
            <section>
              <SectionLabel>Funnel & Calls</SectionLabel>
              <div className="grid md:grid-cols-2 gap-4">

                {/* Typeform */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-body text-sm font-semibold" style={{ color: "#F2EDE6" }}>Applications</p>
                    {typeform && (
                      <div className="flex items-center gap-2">
                        <span className="font-body text-xs" style={{ color: "#555" }}>Disqual rate:</span>
                        <span className="font-body text-xs font-bold" style={{ color: typeform.disqualRate > 40 ? "#E05252" : "#C9A84C" }}>{fmtPct(typeform.disqualRate)}</span>
                      </div>
                    )}
                  </div>
                  {typeform ? (
                    <>
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div>
                          <p className="font-display" style={{ fontSize: 32, color: "#F2EDE6", lineHeight: 1 }}>{typeform.totalLast30}</p>
                          <p className="font-body text-xs mt-1" style={{ color: "#555" }}>Last 30 days</p>
                        </div>
                        <div>
                          <p className="font-display" style={{ fontSize: 32, color: "#F2EDE6", lineHeight: 1 }}>{typeform.totalLast7}</p>
                          <p className="font-body text-xs mt-1" style={{ color: "#555" }}>Last 7 days</p>
                        </div>
                        <div>
                          <p className="font-display" style={{ fontSize: 32, color: "#4CAF6E", lineHeight: 1 }}>{typeform.qualified}</p>
                          <p className="font-body text-xs mt-1" style={{ color: "#555" }}>Qualified</p>
                        </div>
                      </div>
                      {topSources.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: "#444" }}>Traffic Sources</p>
                          {topSources.map(([src, count]) => (
                            <BarRow key={src} label={src} value={count} total={sourceTotal} />
                          ))}
                        </div>
                      )}
                    </>
                  ) : <p className="font-body text-xs" style={{ color: "#555" }}>No data</p>}
                </Card>

                {/* Calendly */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-body text-sm font-semibold" style={{ color: "#F2EDE6" }}>Calls Booked</p>
                    {calendly && (
                      <StatusPill ok={calendly.showRate >= 65} label={`${calendly.showRate}% show rate`} />
                    )}
                  </div>
                  {calendly ? (
                    <>
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div>
                          <p className="font-display" style={{ fontSize: 32, color: "#F2EDE6", lineHeight: 1 }}>{calendly.totalBookedLast30}</p>
                          <p className="font-body text-xs mt-1" style={{ color: "#555" }}>Booked (30d)</p>
                        </div>
                        <div>
                          <p className="font-display" style={{ fontSize: 32, color: "#F2EDE6", lineHeight: 1 }}>{calendly.bookedLast7}</p>
                          <p className="font-body text-xs mt-1" style={{ color: "#555" }}>Booked (7d)</p>
                        </div>
                        <div>
                          <p className="font-display" style={{ fontSize: 32, color: "#E05252", lineHeight: 1 }}>{calendly.totalCancelledLast30}</p>
                          <p className="font-body text-xs mt-1" style={{ color: "#555" }}>Cancelled</p>
                        </div>
                      </div>
                      {calendly.cancelReasons.length > 0 && (
                        <div>
                          <p className="font-body text-xs uppercase tracking-widest mb-2" style={{ color: "#444" }}>Cancel Reasons</p>
                          <div className="flex flex-col gap-1.5">
                            {calendly.cancelReasons.map((r, i) => (
                              <p key={i} className="font-body text-xs px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#666" }}>"{r}"</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : <p className="font-body text-xs" style={{ color: "#555" }}>No data</p>}
                </Card>
              </div>
            </section>

            {/* ── Row 3: Pipeline + Revenue ── */}
            <section>
              <SectionLabel>Pipeline & Revenue</SectionLabel>
              <div className="grid md:grid-cols-2 gap-4">

                {/* Close pipeline */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-body text-sm font-semibold" style={{ color: "#F2EDE6" }}>Pipeline Stages</p>
                    {close && (
                      <div className="flex items-center gap-3">
                        <span className="font-body text-xs" style={{ color: "#555" }}>+{close.newLast7} this week</span>
                        {close.staleLeads > 0 && (
                          <StatusPill ok={false} label={`${close.staleLeads} stale`} />
                        )}
                      </div>
                    )}
                  </div>
                  {close ? (
                    <div className="flex flex-col gap-3">
                      {sortedStages.map(([stage, count]) => (
                        <BarRow
                          key={stage}
                          label={stage}
                          value={count}
                          total={stageTotal}
                          color={stage === "Won" ? "#4CAF6E" : stage === "Lost" ? "#E05252" : "#C9A84C"}
                        />
                      ))}
                    </div>
                  ) : <p className="font-body text-xs" style={{ color: "#555" }}>No data</p>}
                </Card>

                {/* Whop revenue */}
                <Card>
                  <p className="font-body text-sm font-semibold mb-4" style={{ color: "#F2EDE6" }}>Revenue</p>
                  {whop ? (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="font-display" style={{ fontSize: 32, color: "#C9A84C", lineHeight: 1 }}>{fmt$(whop.mrr)}</p>
                          <p className="font-body text-xs mt-1" style={{ color: "#555" }}>MRR this month</p>
                        </div>
                        <div>
                          <p className="font-display" style={{ fontSize: 32, color: "#4CAF6E", lineHeight: 1 }}>{fmt$(whop.revenueToday)}</p>
                          <p className="font-body text-xs mt-1" style={{ color: "#555" }}>Revenue today</p>
                        </div>
                      </div>
                      <div
                        className="flex items-center justify-between px-4 py-3 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <div>
                          <p className="font-body text-xs" style={{ color: "#555" }}>New members this month</p>
                          <p className="font-body text-sm font-semibold" style={{ color: "#F2EDE6" }}>{whop.newMembersThisMonth}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-body text-xs" style={{ color: "#555" }}>Failed payments</p>
                          <p className="font-body text-sm font-semibold" style={{ color: whop.failedPayments > 0 ? "#E05252" : "#4CAF6E" }}>
                            {whop.failedPayments}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : <p className="font-body text-xs" style={{ color: "#555" }}>No data</p>}
                </Card>
              </div>
            </section>

            {/* ── Row 4: Stale Leads + Slack ── */}
            <section>
              <SectionLabel>Team Activity</SectionLabel>
              <div className="grid md:grid-cols-2 gap-4">

                {/* Stale leads */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-body text-sm font-semibold" style={{ color: "#F2EDE6" }}>Stale Leads</p>
                    {close && <StatusPill ok={close.staleLeads === 0} label={close.staleLeads === 0 ? "All clear" : `${close.staleLeads} need follow-up`} />}
                  </div>
                  {close ? (
                    close.staleLeadsList.length === 0 ? (
                      <p className="font-body text-sm" style={{ color: "#4CAF6E" }}>No stale leads — pipeline is healthy.</p>
                    ) : (
                      <div
                        style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden" }}
                      >
                        {close.staleLeadsList.map((lead, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between px-4 py-3 gap-3"
                            style={{ borderBottom: i < close.staleLeadsList.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E05252", flexShrink: 0, display: "inline-block" }} />
                              <p className="font-body text-sm truncate" style={{ color: "#F2EDE6" }}>{lead.name}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 text-right">
                              <p className="font-body text-xs" style={{ color: "#555" }}>{lead.status}</p>
                              <p className="font-body text-xs" style={{ color: "#444" }}>{relTime(lead.lastActivity)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : <p className="font-body text-xs" style={{ color: "#555" }}>No data</p>}
                </Card>

                {/* Slack / Nahom EOD */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-body text-sm font-semibold" style={{ color: "#F2EDE6" }}>EOD Report</p>
                    {slack && <StatusPill ok={slack.nahomEodPosted} label={slack.nahomEodPosted ? "Posted ✓" : "Not yet"} />}
                  </div>
                  {slack ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <p className="font-body text-xs" style={{ color: "#555" }}>#followups activity today:</p>
                        <p className="font-body text-sm font-semibold" style={{ color: "#F2EDE6" }}>{slack.messagesToday} messages</p>
                      </div>
                      {slack.recentMessages.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {slack.recentMessages.map((m, i) => (
                            <div
                              key={i}
                              className="px-3 py-2.5 rounded-lg"
                              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                              <p className="font-body text-xs" style={{ color: "#666", lineHeight: 1.5 }}>{m.text || <em>empty</em>}</p>
                              <p className="font-body text-xs mt-1" style={{ color: "#444" }}>{m.ts}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {slack.error && <p className="font-body text-xs mt-2" style={{ color: "#555" }}>{slack.error}</p>}
                    </>
                  ) : <p className="font-body text-xs" style={{ color: "#555" }}>No data</p>}
                </Card>
              </div>
            </section>

          </div>
        )}

      </div>
    </main>
  );
}
