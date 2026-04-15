"use client";

const sections = [
  {
    num: "01",
    label: "Who Hudson Is",
    body: "Not a highlight reel. Hudson spent years figuring out the market on his own — blew accounts, bought courses, had months that looked good then gave it all back. He cracked it when he finally had someone in his corner who had already done what he was trying to do. That's what he does for the people he works with.",
  },
  {
    num: "02",
    label: "What The Program Is",
    body: "9+ hours of structured video modules built around the actual mechanics of how Hudson trades. Two direct calls with Hudson every week — live trade reviews, real-time feedback, Q&A. Built to keep you accountable and moving forward every single week until you're consistently profitable.",
  },
  {
    num: "03",
    label: "The Guarantee",
    body: "Put in the work and Hudson guarantees you'll be profitable within 90 days. That's not a marketing line — that's him putting his name behind the system he's built, because he knows what it produces when someone actually shows up.",
  },
  {
    num: "04",
    label: "What To Expect On The Call",
    body: "Hudson's team isn't running a pitch. They're going to ask about your situation, walk you through exactly how the program works, and if it's the right fit — you'll have the opportunity to get started. Come ready to have a real conversation about where you're at and where you want to be in 90 days.",
  },
];

const CALENDARS = [
  {
    name: "Apple",
    url: "https://calendar.apple.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
  {
    name: "Google",
    url: "https://calendar.google.com",
    icon: (
      <svg viewBox="0 0 48 48" className="w-7 h-7">
        <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-4z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.7-3.4-11.3-8l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.4 4.2-4.4 5.5l6.2 5.2C40.7 35.5 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/>
      </svg>
    ),
  },
  {
    name: "Office 365",
    url: "https://outlook.office.com/calendar",
    icon: (
      <svg viewBox="0 0 48 48" className="w-7 h-7">
        <path fill="#FF5722" d="M26 6h16v10H26z"/>
        <path fill="#FF9800" d="M6 6h16v10H6z"/>
        <path fill="#4CAF50" d="M6 20h16v10H6z"/>
        <path fill="#0288D1" d="M26 20h16v10H26z"/>
        <path fill="#FF9800" d="M6 34h16v10H6z"/>
        <path fill="#FF5722" d="M26 34h16v10H26z"/>
      </svg>
    ),
  },
  {
    name: "Outlook",
    url: "https://outlook.live.com/calendar",
    icon: (
      <svg viewBox="0 0 48 48" className="w-7 h-7">
        <rect width="48" height="48" rx="6" fill="#0078D4"/>
        <text x="24" y="32" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">Ol</text>
      </svg>
    ),
  },
  {
    name: "Yahoo",
    url: "https://calendar.yahoo.com",
    icon: (
      <svg viewBox="0 0 48 48" className="w-7 h-7">
        <rect width="48" height="48" rx="6" fill="#6001D2"/>
        <text x="24" y="32" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="sans-serif">Y!</text>
      </svg>
    ),
  },
];

export default function ConfirmedPage() {
  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>

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
              Call Confirmed
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="font-display leading-none text-center mb-14"
          style={{ fontSize: "clamp(36px, 6.5vw, 80px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          FOLLOW THE STEPS TO{" "}
          <span className="gold-text-gradient">CONFIRM YOUR CALL.</span>
        </h1>

        {/* Step 1 — Add to calendar */}
        <div className="relative mb-5">
          {/* Floating pill label */}
          <div className="flex justify-center mb-[-1px] relative z-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-body text-sm font-semibold"
              style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.12)", color: "#F2EDE6" }}
            >
              Step #1:{" "}
              <span style={{ color: "#C9A84C" }}>Add the call</span>
              {" "}to your calendar
            </div>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl px-8 py-10 flex flex-col items-center"
            style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {CALENDARS.map((cal) => (
                <a
                  key={cal.name}
                  href={cal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-2xl transition-all hover:scale-105"
                  style={{
                    width: 72,
                    height: 72,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  {cal.icon}
                </a>
              ))}
            </div>
            <p className="font-body text-sm mt-6" style={{ color: "#555" }}>
              Select the calendar and save the call
            </p>
          </div>
        </div>

        {/* Step 2 — Watch the video */}
        <div className="relative mb-14">
          {/* Floating pill label */}
          <div className="flex justify-center mb-[-1px] relative z-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-body text-sm font-semibold"
              style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.12)", color: "#F2EDE6" }}
            >
              Step #2:{" "}
              <span style={{ color: "#C9A84C" }}>Watch this</span>
              {" "}before your call so we don&apos;t cancel it
            </div>
          </div>

        <div
          className="rounded-2xl p-7"
          style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}
        >

          {/* Video placeholder — swap for Wistia/YouTube embed when ready */}
          <div
            className="w-full rounded-xl overflow-hidden"
            style={{
              aspectRatio: "16/9",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5.14v14l11-7-11-7z" fill="#C9A84C" />
                </svg>
              </div>
              <p className="font-body text-sm" style={{ color: "#555" }}>
                Pre-call video from Hudson — coming soon
              </p>
            </div>
          </div>
        </div>
        </div>

        {/* Divider */}
        <div className="mb-14" style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)" }} />

        {/* What to know */}
        <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: "#888" }}>
          Before Your Call
        </p>
        <h2
          className="font-display leading-none mb-12"
          style={{ fontSize: "clamp(32px, 5vw, 56px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          WHAT YOU NEED TO KNOW
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
        <div className="text-center pt-16">
          <p className="font-body text-xs" style={{ color: "#444" }}>
            © {new Date().getFullYear()} HuddyerTrades. All rights reserved.
          </p>
        </div>

      </div>
    </main>
  );
}
