"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    type: "chat",
    name: "Jordan M.",
    handle: "@jordanm",
    text: "bro opened my eyes 👀 just got my first funded account pass after 3 weeks of following the system",
    time: "2 days ago",
    color: "#C9A84C",
  },
  {
    type: "chat",
    name: "main-chat",
    handle: "huddyer discord",
    text: "Hey, just started following @huddyer great content thanks for all the insight. Already up 8% this week.",
    time: "1 week ago",
    color: "#D4AF37",
  },
  {
    type: "chat",
    name: "Crazy how...",
    handle: "Direct Message",
    text: "Crazy how a quick 30 min call with some reassurance can do this. Trades credit goes to you brotha 🔥 Let's go dude 💪💪💪 Happy for u. Keep working it back up",
    time: "3 days ago",
    color: "#C9A84C",
  },
  {
    type: "chat",
    name: "bro",
    handle: "Anonymous",
    text: "bro just gotta say thank you, one of your videos i commented asking if equilibrium is that important and i got a couple people saying yes it so i went and learned it on sunday then on monday and tuesday ive been profitable from 1000/2000 bucks",
    time: "5 days ago",
    color: "#A07830",
  },
  {
    type: "certificate",
    name: "Brandon Bartolo",
    handle: "Funded Trader",
    text: "Certificate of Achievement — Funded Trading Program",
    time: "This month",
    color: "#D4AF37",
  },
  {
    type: "chat",
    name: "I should be...",
    handle: "Discord DM",
    text: "about saying I should be consistent. Can be like you one day. This system changed how I see the market completely.",
    time: "1 week ago",
    color: "#C9A84C",
  },
  {
    type: "chat",
    name: "Sarah K.",
    handle: "@sarahk_trades",
    text: "First green week in 2 months. The risk management framework alone was worth the investment. Thank you Hudson!",
    time: "4 days ago",
    color: "#D4AF37",
  },
  {
    type: "chat",
    name: "Mike D.",
    handle: "Community",
    text: "Passed my 100k evaluation on the second attempt. The structured approach makes everything click. This is the real deal.",
    time: "2 weeks ago",
    color: "#C9A84C",
  },
];

function ChatCard({ t }: { t: typeof testimonials[0] }) {
  if (t.type === "certificate") {
    return (
      <div
        className="shrink-0 w-72 rounded-2xl p-6 flex flex-col items-center gap-4 text-center"
        style={{
          background: "linear-gradient(135deg, #141408, #1a1a0a)",
          border: "1px solid rgba(201,168,76,0.4)",
          boxShadow: "0 4px 30px rgba(201,168,76,0.1)",
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(212,175,55,0.1))",
            border: "2px solid rgba(201,168,76,0.5)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6"/>
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
          </svg>
        </div>
        <div>
          <div className="font-bold text-base" style={{ color: "#D4AF37" }}>{t.name}</div>
          <div className="text-xs mt-1" style={{ color: "#888" }}>{t.handle}</div>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }}
        >
          {t.text}
        </div>
        <div className="text-xs" style={{ color: "#666" }}>{t.time}</div>
      </div>
    );
  }

  return (
    <div
      className="shrink-0 w-72 rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
          style={{
            background: `linear-gradient(135deg, ${t.color}33, ${t.color}66)`,
            border: `1px solid ${t.color}55`,
            color: t.color,
          }}
        >
          {t.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: "#f5f5f5" }}>{t.name}</div>
          <div className="text-xs" style={{ color: "#666" }}>{t.handle}</div>
        </div>
      </div>

      {/* Message bubble */}
      <div
        className="rounded-xl rounded-tl-none px-4 py-3 text-sm leading-relaxed"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.05)",
          color: "#ccc",
        }}
      >
        {t.text}
      </div>

      {/* Time */}
      <div className="text-xs" style={{ color: "#555" }}>{t.time}</div>
    </div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Split testimonials into two rows
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4);

  return (
    <section
      ref={ref}
      className="section-fade py-24 overflow-hidden"
      style={{ backgroundColor: "#080808" }}
    >
      {/* Title */}
      <div className="text-center mb-14 px-4">
        <p
          className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight ghost-text leading-none"
          style={{ WebkitTextStroke: "1px rgba(201,168,76,0.2)" }}
        >
          OUR STUDENTS IMPROVE
        </p>
        <p
          className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none -mt-2"
          style={{
            background: "linear-gradient(90deg, #C9A84C, #D4AF37, #C9A84C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          STUDENT WINS
        </p>
      </div>

      {/* Row 1 — left scroll */}
      <div className="relative mb-5 overflow-hidden">
        <div
          ref={track1Ref}
          className="flex gap-5"
          style={{
            width: "max-content",
            animation: "marquee 35s linear infinite",
          }}
        >
          {[...row1, ...row1, ...row1, ...row1].map((t, i) => (
            <ChatCard key={i} t={t} />
          ))}
        </div>
      </div>

      {/* Row 2 — right scroll */}
      <div className="relative overflow-hidden">
        <div
          ref={track2Ref}
          className="flex gap-5"
          style={{
            width: "max-content",
            animation: "marquee2 35s linear infinite",
          }}
        >
          {[...row2, ...row2, ...row2, ...row2].map((t, i) => (
            <ChatCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
