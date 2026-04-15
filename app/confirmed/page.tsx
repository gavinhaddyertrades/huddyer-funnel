"use client";

const sections = [
  {
    num: "01",
    label: "What is this call exactly?",
    body: "This is a strategy call with Hudson's team. They'll ask about your trading background, where you're at right now, and what you're trying to achieve. If the program is the right fit, you'll have the opportunity to get started. No pressure, no pitch — just a real conversation.",
  },
  {
    num: "02",
    label: "Do I need trading experience?",
    body: "You don't need to be an expert, but you do need to be serious. Hudson works with traders at different levels — what matters is that you're committed to doing the work and ready to follow a proven system.",
  },
  {
    num: "03",
    label: "What's the 90-day guarantee?",
    body: "If you put in the work and don't hit profitability within 90 days, Hudson continues working with you at no extra cost. The guarantee exists because the system works — but only if you do.",
  },
  {
    num: "04",
    label: "How much time do I need to commit?",
    body: "Enough to trade and show up to the calls. The curriculum is self-paced so you can go through it on your schedule. The live calls are twice a week. Traders who get results are the ones who treat this like the business it is.",
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
              Call Reserved
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="font-display leading-none text-center mb-14"
          style={{ fontSize: "clamp(36px, 6.5vw, 80px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          WATCH THIS VIDEO TO{" "}
          <span className="gold-text-gradient">CONFIRM YOUR CALL.</span>
        </h1>

        {/* Video */}
        <div className="relative mb-14">
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
        <div className="text-center pt-16">
          <p className="font-body text-xs" style={{ color: "#444" }}>
            © {new Date().getFullYear()} HuddyerTrades. All rights reserved.
          </p>
        </div>

      </div>
    </main>
  );
}
