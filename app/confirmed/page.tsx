"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChartBackground from "@/components/v2/ChartBackground";

const CARMINE_VIDEO_ID = "vxHRcR9xTFQ";

// ── Helpers ────────────────────────────────────────────────────────────────

/** ISO string → "20240115T100000Z" (Google / iCal format) */
function toCompactUtc(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function downloadIcs(start: string, end: string) {
  const fmt = (iso: string) => toCompactUtc(iso);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//HuddyerTrades//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    "SUMMARY:1:1 Mentorship Call with Hudson",
    "DESCRIPTION:Your call is confirmed.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mentorship-call.ics";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Calendar option row ─────────────────────────────────────────────────────

function CalOption({
  icon,
  label,
  onClick,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const style = {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: 14,
    borderRadius: 12,
    padding: "14px 18px",
    background: hovered ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${hovered ? "rgba(201,168,76,0.35)" : "rgba(255,255,255,0.07)"}`,
    cursor: "pointer",
    transition: "background 0.15s, border-color 0.15s",
    textDecoration: "none",
    width: "100%",
  };

  const inner = (
    <>
      {icon}
      <span className="font-body" style={{ color: "#F2EDE6", fontSize: 15 }}>
        {label}
      </span>
    </>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </a>
  ) : (
    <button
      onClick={onClick}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </button>
  );
}

// ── Add to Calendar (reads useSearchParams — must be wrapped in Suspense) ──

function AddToCalendar() {
  const [open, setOpen] = useState(false);
  const params = useSearchParams();

  const startTime = params.get("event_start_time") ?? "";
  const endTime   = params.get("event_end_time")   ?? "";

  if (!startTime || !endTime) return null;

  const gStart    = toCompactUtc(startTime);
  const gEnd      = toCompactUtc(endTime);
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=1:1+Mentorship+Call+with+Hudson&dates=${gStart}/${gEnd}&details=Your+call+is+confirmed`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=1:1+Mentorship+Call+with+Hudson&startdt=${encodeURIComponent(startTime)}&enddt=${encodeURIComponent(endTime)}`;

  return (
    <>
      {/* Button */}
      <div className="flex justify-center mb-14">
        <button
          onClick={() => setOpen(true)}
          className="btn-gold"
          style={{ fontSize: 14, padding: "12px 28px" }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="#0A0A0A" strokeWidth="1.5" />
            <line x1="5" y1="1" x2="5" y2="4" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="11" y1="1" x2="11" y2="4" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="1.5" y1="6.5" x2="14.5" y2="6.5" stroke="#0A0A0A" strokeWidth="1.5" />
          </svg>
          Add to Calendar
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center px-5"
          style={{ zIndex: 50, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full flex flex-col gap-3"
            style={{
              maxWidth: 400,
              background: "#111",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: 20,
              padding: "32px 24px 24px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal heading */}
            <h3
              className="font-display text-center mb-1"
              style={{ fontSize: 26, color: "#F2EDE6", letterSpacing: "0.06em" }}
            >
              ADD TO CALENDAR
            </h3>
            <p
              className="font-body text-xs text-center mb-3"
              style={{ color: "#555", letterSpacing: "0.04em" }}
            >
              1:1 Mentorship Call with Hudson
            </p>

            {/* Google */}
            <CalOption
              href={googleUrl}
              label="Google Calendar"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              }
            />

            {/* Apple iCal */}
            <CalOption
              label="Apple Calendar"
              onClick={() => { downloadIcs(startTime, endTime); setOpen(false); }}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#F2EDE6">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              }
            />

            {/* Outlook */}
            <CalOption
              href={outlookUrl}
              label="Outlook"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="6" width="13" height="12" rx="2" fill="#0078D4" />
                  <circle cx="8.5" cy="12" r="2.5" fill="white" />
                  <path d="M15 8.5h5a1.5 1.5 0 011.5 1.5v4a1.5 1.5 0 01-1.5 1.5h-5" stroke="#0078D4" strokeWidth="1.5" fill="none" />
                  <path d="M15 10l3.5 2L15 14" stroke="white" strokeWidth="1" fill="none" strokeLinejoin="round" />
                </svg>
              }
            />

            {/* Cancel */}
            <button
              onClick={() => setOpen(false)}
              className="font-body text-xs mt-1 mx-auto"
              style={{ color: "#444", letterSpacing: "0.05em" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── YouTube Facade ──────────────────────────────────────────────────────────

function YoutubeFacade({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`;

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{ aspectRatio: "16 / 9", border: "1px solid rgba(201,168,76,0.25)", background: "#111" }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          title="Carmine's results"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: "none" }}
        />
      ) : (
        <div
          className="absolute inset-0 cursor-pointer group"
          onClick={() => setPlaying(true)}
          role="button"
          aria-label="Play Carmine's testimonial video"
        >
          <img src={thumbUrl} alt="Carmine's trading results" className="w-full h-full object-cover" />
          <div className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-30" style={{ background: "rgba(0,0,0,0.4)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full transition-transform duration-200 group-hover:scale-110"
              style={{ background: "#C9A84C", boxShadow: "0 4px 30px rgba(201,168,76,0.6)" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 5l10 5-10 5V5z" fill="#0A0A0A" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FAQ data ────────────────────────────────────────────────────────────────

const sections = [
  {
    num: "01",
    label: "Do I need any prior trading experience?",
    body: "No. The program is built to take you from zero and walk you through everything step by step. The curriculum starts with the fundamentals and progresses into advanced execution. What matters is that you're serious and willing to put in the work — not where you're starting from.",
  },
  {
    num: "02",
    label: "How much time do I need to commit each week?",
    body: "Realistically, two to three hours per day is enough to make serious progress. The live sessions are three times a week, the curriculum is self-paced, and trading futures doesn't require you to be glued to a screen all day. The goal is building an efficient, repeatable process — not a second full-time job.",
  },
  {
    num: "03",
    label: "How much money do I need to start trading?",
    body: "This will be covered on your call based on your specific situation. What I can tell you is that the program focuses on skill development first. You don't need a large account to learn the system — and we don't put students in positions to take on unnecessary risk before they're ready.",
  },
  {
    num: "04",
    label: "What exactly is the 90-day profitability guarantee?",
    body: "If you complete the full curriculum, attend the live sessions, follow the system, and you're not profitable within 90 days — I keep working with you personally until you are. No fine print. I back this program because I've seen it work too many times not to.",
  },
  {
    num: "05",
    label: "What does the program actually include?",
    body: "You get 9+ hours of structured video curriculum, three live direct calls with Hudson every week, access to the private student community, and direct support throughout your entire journey. Everything is built around one outcome — getting you to consistent profitability.",
  },
  {
    num: "06",
    label: "Is this a group program or do I get direct access to Hudson?",
    body: "Both. The live calls are group sessions, but Hudson is present and engaged on every single one. You're not getting handed off to a coach or an assistant. Hudson personally reviews student progress and is directly involved in your development throughout the program.",
  },
  {
    num: "07",
    label: "What happens on the call I just booked?",
    body: "It's a direct conversation with Hudson's team. We're going to look at where you're currently at, what your goals are, and whether this program is the right fit for you. There's no pressure and no hard sell. If it's a fit, we'll talk about next steps. If it's not, we'll tell you that too.",
  },
  {
    num: "08",
    label: "How soon can I expect results?",
    body: "It depends entirely on how seriously you execute. Some students see their first profitable week within the first 30 days. Others take closer to 60-90 days to get fully dialed in. What's consistent across every student who gets results is that they follow the system instead of improvising.",
  },
  {
    num: "09",
    label: "What makes this different from free content on YouTube?",
    body: "YouTube will give you concepts with no structure, no accountability, and no feedback. This program gives you a proven system, live sessions three times a week where you can ask real questions about real setups, and direct access to someone who trades this every single day. The gap between free content and a structured mentorship is the difference between staying stuck and actually getting somewhere.",
  },
  {
    num: "10",
    label: "I'm not sure if I can afford it. Should I still get on the call?",
    body: "Yes. Show up to the call, be honest about your situation, and let's have a real conversation. There are options available and we work with people in different circumstances. The worst thing you can do is not show up because you assumed it wouldn't work for you before you even asked.",
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default function ConfirmedPage() {

  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh", position: "relative" }}>
      <ChartBackground />

      {/* Top bar */}
      <div
        className="flex items-center justify-center px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span className="font-display text-base" style={{ color: "#F2EDE6", letterSpacing: "0.12em" }}>
          HUDDYERTRADES
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-5 pt-14 pb-20">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{ border: "1px solid rgba(201,168,76,0.35)", background: "rgba(201,168,76,0.08)" }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: "#C9A84C", boxShadow: "0 0 6px #C9A84C" }} />
            <span className="font-body text-xs uppercase tracking-widest" style={{ color: "#C9A84C" }}>
              Call Reserved
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="font-display leading-none text-center mb-10"
          style={{ fontSize: "clamp(36px, 6.5vw, 80px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          WATCH THIS VIDEO TO{" "}
          <span className="gold-text-gradient">CONFIRM YOUR CALL.</span>
        </h1>

        {/* Video */}
        <div className="relative mb-14">
          <YoutubeFacade videoId={CARMINE_VIDEO_ID} />
        </div>

        {/* Add to Calendar — only renders when Calendly passes event params */}
        <Suspense fallback={null}>
          <AddToCalendar />
        </Suspense>

        {/* Divider */}
        <div className="mb-14" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)" }} />

        {/* FAQ */}
        <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: "#888" }}>
          Before Your Call
        </p>
        <h2
          className="font-display leading-none mb-12"
          style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="flex flex-col">
          {sections.map((s, i) => (
            <div
              key={s.num}
              className="flex flex-row gap-5 md:gap-10 py-8"
              style={{
                borderTop: i === 0 ? "1px solid rgba(255,255,255,0.07)" : "none",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="font-display shrink-0"
                style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "rgba(201,168,76,0.25)", lineHeight: 1, minWidth: 44 }}
              >
                {s.num}
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <h3
                  className="font-display"
                  style={{ fontSize: "clamp(16px, 2.2vw, 24px)", color: "#F2EDE6", letterSpacing: "0.03em" }}
                >
                  {s.label.toUpperCase()}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "#777", maxWidth: 520 }}>
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="font-body text-xs" style={{ color: "#444" }}>
            © {new Date().getFullYear()} HuddyerTrades. All rights reserved.
          </p>
        </div>

      </div>
    </main>
  );
}
