"use client";

const TYPEFORM_URL = "https://form.typeform.com/to/AH6Qxmyu";

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

export default function ConfirmedPage() {
  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>

      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-center px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span
          className="font-display text-base"
          style={{ color: "#F2EDE6", letterSpacing: "0.12em" }}
        >
          HUDDYERTRADES
        </span>
      </div>

      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-5 pt-16 pb-10 text-center">

        {/* Confirmation badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
          style={{
            border: "1px solid rgba(201,168,76,0.35)",
            background: "rgba(201,168,76,0.08)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "#C9A84C", boxShadow: "0 0 6px #C9A84C" }}
          />
          <span
            className="font-body text-xs uppercase tracking-widest"
            style={{ color: "#C9A84C" }}
          >
            Call Confirmed
          </span>
        </div>

        <h1
          className="font-display leading-none mb-5"
          style={{
            fontSize: "clamp(38px, 7vw, 88px)",
            color: "#F2EDE6",
            letterSpacing: "0.02em",
          }}
        >
          WATCH THIS{" "}
          <span className="gold-text-gradient">BEFORE YOUR CALL.</span>
        </h1>

        <p
          className="font-body max-w-lg mx-auto leading-relaxed"
          style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "#999" }}
        >
          Hudson put this together personally. Watch it before you get on with the team — it&apos;ll make the call a lot more productive.
        </p>
      </div>

      {/* ── Pre-call video placeholder ── */}
      <div className="max-w-3xl mx-auto px-5 pb-16">
        <div
          className="w-full rounded-2xl overflow-hidden"
          style={{
            aspectRatio: "16/9",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Swap this div for the Wistia/YouTube embed when Hudson records the video */}
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5.14v14l11-7-11-7z" fill="#C9A84C" />
              </svg>
            </div>
            <p className="font-body text-sm" style={{ color: "#555" }}>
              Pre-call video from Hudson — coming soon
            </p>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="max-w-3xl mx-auto px-5">
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)" }} />
      </div>

      {/* ── What to know section ── */}
      <div className="max-w-3xl mx-auto px-5 pt-16 pb-4">
        <p
          className="font-body text-xs uppercase tracking-widest mb-3"
          style={{ color: "#888" }}
        >
          Before Your Call
        </p>
        <h2
          className="font-display leading-none mb-12"
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            color: "#F2EDE6",
            letterSpacing: "0.02em",
          }}
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
                style={{
                  fontSize: "clamp(28px, 4vw, 40px)",
                  color: "rgba(201,168,76,0.25)",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                  minWidth: "44px",
                }}
              >
                {s.num}
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <h3
                  className="font-display"
                  style={{
                    fontSize: "clamp(16px, 2.2vw, 24px)",
                    color: "#F2EDE6",
                    letterSpacing: "0.03em",
                  }}
                >
                  {s.label.toUpperCase()}
                </h3>
                <p
                  className="font-body text-sm leading-relaxed"
                  style={{ color: "#777", maxWidth: "520px" }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="max-w-3xl mx-auto px-5 py-20 text-center">
        <p
          className="font-body text-sm leading-relaxed mb-8 max-w-md mx-auto"
          style={{ color: "#777" }}
        >
          Didn&apos;t get a chance to apply yet? There are still a limited number of spots available.
        </p>
        <a
          href={TYPEFORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
        >
          Apply Now →
        </a>
      </div>

      {/* ── Footer ── */}
      <div
        className="text-center py-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="font-body text-xs" style={{ color: "#444" }}>
          © {new Date().getFullYear()} HuddyerTrades. All rights reserved.
        </p>
      </div>

    </main>
  );
}
