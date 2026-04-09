"use client";

import { useEffect, useRef, useState } from "react";

const CARMINE_VIDEO_ID = "vxHRcR9xTFQ";

function YoutubeFacade({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1`;

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        aspectRatio: "16 / 9",
        border: "1px solid rgba(201,168,76,0.25)",
        background: "#111",
      }}
    >
      {playing ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          title="Carmine's First Month"
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
          {/* Thumbnail */}
          <img
            src={thumbUrl}
            alt="Carmine's trading results"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-30"
            style={{ background: "rgba(0,0,0,0.4)" }}
          />
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-full transition-transform duration-200 group-hover:scale-110"
              style={{
                background: "#C9A84C",
                boxShadow: "0 4px 30px rgba(201,168,76,0.6)",
              }}
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

const quotes = [
  {
    quote:
      "I had been trading for two years and spinning my wheels. One month inside this program and I had my first funded payout. The structure changed everything.",
    name: "Carmine",
    result: "First month: $30,000",
    featured: true,
  },
  {
    quote:
      "The live direct calls are where it clicked for me. Getting real-time feedback on my actual setups — not theory. That's the difference.",
    name: "Jordan M.",
    result: "Passed 100K evaluation",
    featured: false,
  },
  {
    quote:
      "I applied skeptical. I stayed because the risk framework alone was worth it. My consistency went from maybe 40% to over 70% win rate on quality setups.",
    name: "Marcus T.",
    result: "Funded — first attempt",
    featured: false,
  },
];

function QuoteMark() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <path
        d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l2.4 3.2C11.2 4.8 8 8 7.2 12H14.4V24H0zm17.6 0V14.4C17.6 6.4 22.4 1.6 32 0l2.4 3.2C28.8 4.8 25.6 8 24.8 12H32V24H17.6z"
        fill="rgba(201,168,76,0.2)"
      />
    </svg>
  );
}

export default function SocialProofV2() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-fade py-24 px-6 md:px-12"
      style={{ backgroundColor: "#111111", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Label */}
        <div className="section-label">Student Results</div>

        {/* Featured — Carmine */}
        <div
          className="rounded-xl p-8 md:p-12 flex flex-col md:flex-row gap-10"
          style={{
            background: "#0F0F0F",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          {/* Quote side */}
          <div className="flex-1 flex flex-col gap-6">
            <QuoteMark />
            <blockquote
              className="font-body text-xl md:text-2xl leading-relaxed"
              style={{ color: "#F2EDE6" }}
            >
              {quotes[0].quote}
            </blockquote>
            <div className="flex flex-col gap-1">
              <span className="font-body font-semibold text-sm" style={{ color: "#F2EDE6" }}>
                {quotes[0].name}
              </span>
              <span
                className="font-body text-xs uppercase tracking-widest"
                style={{
                  color: "#C9A84C",
                  background: "rgba(201,168,76,0.08)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  borderRadius: "4px",
                  padding: "3px 10px",
                  alignSelf: "flex-start",
                }}
              >
                {quotes[0].result}
              </span>
            </div>
          </div>

          {/* Carmine's video */}
          <div className="flex-1">
            <YoutubeFacade videoId={CARMINE_VIDEO_ID} />
          </div>
        </div>

        {/* Two smaller quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quotes.slice(1).map((q) => (
            <div
              key={q.name}
              className="rounded-xl p-8 flex flex-col gap-6"
              style={{
                background: "#0F0F0F",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <QuoteMark />
              <blockquote
                className="font-body text-base leading-relaxed"
                style={{ color: "#BCBCBC" }}
              >
                {q.quote}
              </blockquote>
              <div className="flex flex-col gap-1">
                <span className="font-body font-semibold text-sm" style={{ color: "#F2EDE6" }}>
                  {q.name}
                </span>
                <span
                  className="font-body text-xs"
                  style={{ color: "#888" }}
                >
                  {q.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
