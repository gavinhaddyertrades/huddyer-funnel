"use client";

import CountdownTimer from "./CountdownTimer";

function TradingLogo() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="28" width="8" height="16" rx="2" fill="#C9A84C" />
      <rect x="16" y="18" width="8" height="26" rx="2" fill="#D4AF37" />
      <rect x="28" y="10" width="8" height="34" rx="2" fill="#C9A84C" />
      <rect x="40" y="4" width="8" height="40" rx="2" fill="#D4AF37" />
      <path d="M4 36 L12 24 L22 16 L34 10 L46 4" stroke="#fff3b0" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.6"/>
    </svg>
  );
}

function AvatarStack() {
  const colors = ["#C9A84C", "#D4AF37", "#A07830", "#C9A84C"];
  const initials = ["J", "M", "S", "A"];
  return (
    <div className="flex items-center gap-3">
      <div className="flex">
        {colors.map((c, i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2"
            style={{
              background: `linear-gradient(135deg, ${c}33, ${c}66)`,
              borderColor: c,
              marginLeft: i === 0 ? 0 : "-10px",
              zIndex: colors.length - i,
              color: "#fff",
            }}
          >
            {initials[i]}
          </div>
        ))}
      </div>
      <span className="text-sm" style={{ color: "#aaa" }}>
        Join <span className="font-bold" style={{ color: "#f5f5f5" }}>200+</span> like-minded students
      </span>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden noise-overlay"
      style={{ backgroundColor: "#080808" }}
    >
      {/* Radial background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <TradingLogo />
          <span
            className="text-2xl font-black tracking-tight"
            style={{ color: "#C9A84C", letterSpacing: "-0.02em" }}
          >
            HUDDYER
          </span>
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            border: "1px solid rgba(201,168,76,0.5)",
            background: "rgba(201,168,76,0.08)",
            color: "#C9A84C",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#C9A84C", boxShadow: "0 0 6px #C9A84C" }}
          />
          Trading Mentorship
          <span style={{ color: "rgba(201,168,76,0.5)" }}>|</span>
          For Serious Traders Only
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none gold-text-gradient"
            style={{ letterSpacing: "-0.03em" }}
          >
            TRADE WITH
            <br />
            PRECISION
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg font-semibold tracking-[0.15em] uppercase mt-4"
            style={{ color: "#cccccc" }}
          >
            Learn the system generating{" "}
            <span style={{ color: "#D4AF37" }}>$30K/month</span> in payouts
          </p>
        </div>

        {/* VSL Video */}
        <div
          className="w-full max-w-2xl rounded-2xl overflow-hidden gold-glow"
          style={{
            border: "1px solid rgba(201,168,76,0.4)",
            background: "#0a0a0a",
          }}
        >
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1&controls=1&rel=0&modestbranding=1"
              title="Huddyer Trading Mentorship"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        </div>

        {/* Countdown Timer */}
        <CountdownTimer />

        {/* CTA Button */}
        <a
          href="#apply"
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-base font-bold tracking-wide cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #C9A84C 0%, #D4AF37 50%, #C9A84C 100%)",
            backgroundSize: "200% 200%",
            color: "#080808",
            boxShadow: "0 4px 30px rgba(201,168,76,0.4)",
          }}
        >
          Apply Now
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#080808" strokeWidth="1.5" opacity="0.4"/>
            <path d="M7 10h6M10 7l3 3-3 3" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>

        {/* Social Proof */}
        <AvatarStack />
      </div>

      {/* Mobile sticky CTA */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:hidden"
        style={{
          background: "linear-gradient(to top, rgba(8,8,8,0.98) 60%, transparent)",
        }}
      >
        <a
          href="#apply"
          className="block w-full text-center py-4 rounded-full font-bold text-base cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #C9A84C, #D4AF37)",
            color: "#080808",
            boxShadow: "0 4px 20px rgba(201,168,76,0.4)",
          }}
        >
          Apply Now →
        </a>
      </div>
    </section>
  );
}
