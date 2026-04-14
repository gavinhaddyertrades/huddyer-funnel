"use client";

const WHOP_URL = "https://whop.com/huddyertrades-coaching-ea05/huddyer-trades-community/";

const bullets = [
  "Live trade alerts in real time — see exactly what Hudson is doing and why",
  "Daily market breakdowns before the open",
  "Active community of serious traders — no noise, no beginners asking basic questions",
  "Weekly recaps and post-market analysis",
  "Direct access to Hudson and his team inside the server",
];

export default function CommunityPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-5 py-20"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      <div className="w-full max-w-2xl mx-auto">

        {/* Label */}
        <p
          className="font-body text-xs uppercase tracking-widest mb-5"
          style={{ color: "#888" }}
        >
          Live Trading Community
        </p>

        {/* Headline */}
        <h1
          className="font-display leading-none mb-8"
          style={{
            fontSize: "clamp(40px, 7vw, 84px)",
            color: "#F2EDE6",
            letterSpacing: "0.02em",
          }}
        >
          TRADE ALONGSIDE{" "}
          <span className="gold-text-gradient">HUDSON.</span>
        </h1>

        {/* Body copy */}
        <div
          className="font-body leading-relaxed mb-10 space-y-4"
          style={{ fontSize: "clamp(15px, 2vw, 17px)", color: "#999", maxWidth: "560px" }}
        >
          <p>
            This is where Hudson trades live. Real alerts, real positions, real reasoning — as it happens. Not a recap. Not a highlight reel.
          </p>
          <p>
            If you want to see what consistent, disciplined trading actually looks like in practice — this is where you watch it.
          </p>
        </div>

        {/* Divider */}
        <div
          className="mb-10"
          style={{
            height: 1,
            background: "linear-gradient(90deg, rgba(201,168,76,0.35), transparent)",
          }}
        />

        {/* Bullets */}
        <ul className="space-y-4 mb-12">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span
                className="shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: "#C9A84C", boxShadow: "0 0 6px rgba(201,168,76,0.5)", marginTop: 7 }}
              />
              <span
                className="font-body"
                style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "#BBBBBB" }}
              >
                {b}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={WHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold inline-flex"
          style={{ fontSize: "clamp(13px, 1.5vw, 15px)" }}
        >
          Join the Community →
        </a>

      </div>
    </main>
  );
}
