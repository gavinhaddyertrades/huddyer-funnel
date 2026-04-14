"use client";

import { useState } from "react";

const PAGES = [
  { label: "Main Funnel", path: "/", desc: "VSL + application page" },
  { label: "Book a Call", path: "/book", desc: "Calendly embed — post Typeform" },
  { label: "Call Confirmed", path: "/confirmed", desc: "Pre-call video + briefing" },
  { label: "Downsell", path: "/start", desc: "Video curriculum — Fanbasis" },
  { label: "Community", path: "/community", desc: "Live trading Discord" },
];

const LINKS = [
  { label: "Vercel Analytics", url: "https://vercel.com/gavinhaddyertrades/huddyer-funnel/analytics", icon: "▲" },
  { label: "Typeform Results", url: "https://admin.typeform.com/form/AH6Qxmyu/results", icon: "📋" },
  { label: "Calendly Events", url: "https://calendly.com/event_types/user/me", icon: "📅" },
  { label: "Fanbasis Dashboard", url: "https://fanbasis.com/portal/agency/dashboard", icon: "💰" },
];

const BASE_URL = "https://huddyertrades.biz";

const UTM_SOURCES = ["instagram", "tiktok", "twitter", "youtube", "linktree", "sms", "email"];

export default function AdminPage() {
  const [source, setSource] = useState("instagram");
  const [medium, setMedium] = useState("social");
  const [campaign, setCampaign] = useState("main-funnel");
  const [copied, setCopied] = useState<string | null>(null);

  function buildUTM(path: string) {
    return `${BASE_URL}${path}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen px-5 py-12 md:px-12" style={{ backgroundColor: "#0A0A0A" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <p className="font-body text-xs uppercase tracking-widest mb-2" style={{ color: "#888" }}>
            Internal
          </p>
          <h1
            className="font-display leading-none"
            style={{ fontSize: "clamp(36px, 6vw, 72px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
          >
            FUNNEL <span className="gold-text-gradient">DASHBOARD</span>
          </h1>
        </div>

        {/* Funnel Pages */}
        <section className="mb-12">
          <p className="font-body text-xs uppercase tracking-widest mb-4" style={{ color: "#666" }}>
            Live Pages
          </p>
          <div className="flex flex-col" style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 }}>
            {PAGES.map((page, i) => (
              <div
                key={page.path}
                className="flex items-center justify-between px-5 py-4 gap-4"
                style={{
                  borderBottom: i < PAGES.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#C9A84C", boxShadow: "0 0 6px rgba(201,168,76,0.5)" }} />
                  <div className="min-w-0">
                    <p className="font-body text-sm font-medium" style={{ color: "#F2EDE6" }}>{page.label}</p>
                    <p className="font-body text-xs" style={{ color: "#555" }}>{page.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`${BASE_URL}${page.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{ color: "#888", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
                  >
                    Visit ↗
                  </a>
                  <button
                    onClick={() => copy(`${BASE_URL}${page.path}`, page.path)}
                    className="font-body text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{ color: copied === page.path ? "#C9A84C" : "#888", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
                  >
                    {copied === page.path ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-12">
          <p className="font-body text-xs uppercase tracking-widest mb-4" style={{ color: "#666" }}>
            Analytics & Tools
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-4 rounded-xl transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
              >
                <span className="text-lg">{link.icon}</span>
                <div>
                  <p className="font-body text-sm" style={{ color: "#F2EDE6" }}>{link.label}</p>
                  <p className="font-body text-xs" style={{ color: "#555" }}>Open dashboard ↗</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* UTM Builder */}
        <section>
          <p className="font-body text-xs uppercase tracking-widest mb-4" style={{ color: "#666" }}>
            UTM Link Builder
          </p>
          <div
            className="rounded-xl p-6"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <label className="font-body text-xs" style={{ color: "#666" }}>Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="font-body text-sm px-3 py-2 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#F2EDE6" }}
                >
                  {UTM_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-xs" style={{ color: "#666" }}>Medium</label>
                <input
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="font-body text-sm px-3 py-2 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#F2EDE6" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-body text-xs" style={{ color: "#666" }}>Campaign</label>
                <input
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  className="font-body text-sm px-3 py-2 rounded-lg outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#F2EDE6" }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {PAGES.map((page) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="min-w-0">
                    <p className="font-body text-xs mb-0.5" style={{ color: "#888" }}>{page.label}</p>
                    <p className="font-body text-xs truncate" style={{ color: "#555" }}>{buildUTM(page.path)}</p>
                  </div>
                  <button
                    onClick={() => copy(buildUTM(page.path), `utm-${page.path}`)}
                    className="font-body text-xs px-3 py-1.5 rounded-lg shrink-0 transition-colors"
                    style={{
                      background: copied === `utm-${page.path}` ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: copied === `utm-${page.path}` ? "#C9A84C" : "#888",
                    }}
                  >
                    {copied === `utm-${page.path}` ? "Copied ✓" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
