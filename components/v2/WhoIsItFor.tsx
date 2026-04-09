"use client";

import { useEffect, useRef } from "react";

const forYou = [
  "You're a serious trader ready to commit to a structured approach",
  "You have the capital and mindset to invest in yourself",
  "You want direct access to someone doing this at the highest level",
];

const notForYou = [
  "You're looking for signals, shortcuts, or someone to do the work for you",
  "You're not ready to be held accountable for your results",
  "You're still undecided about whether trading is something you want to pursue",
];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
      <path d="M3 8.5l3.5 3.5 6.5-7" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
      <path d="M4 4l8 8M12 4l-8 8" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function WhoIsItFor() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-fade py-20 md:py-24 px-5 md:px-12"
      style={{ backgroundColor: "#0A0A0A", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
        <div className="section-label">Who This Is For</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {/* For You */}
          <div
            className="rounded-xl p-6 md:p-8 flex flex-col gap-5"
            style={{
              background: "#0F0F0F",
              border: "1px solid rgba(74,222,128,0.12)",
            }}
          >
            <h3
              className="font-display text-xl md:text-2xl"
              style={{ color: "#F2EDE6", letterSpacing: "0.05em" }}
            >
              THIS IS FOR YOU
            </h3>
            <ul className="space-y-4">
              {forYou.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="font-body text-sm leading-relaxed" style={{ color: "#BCBCBC" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not For You */}
          <div
            className="rounded-xl p-6 md:p-8 flex flex-col gap-5"
            style={{
              background: "#0A0A0A",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h3
              className="font-display text-xl md:text-2xl"
              style={{ color: "#777", letterSpacing: "0.05em" }}
            >
              NOT FOR YOU
            </h3>
            <ul className="space-y-4">
              {notForYou.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XIcon />
                  <span className="font-body text-sm leading-relaxed" style={{ color: "#888" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center pt-2">
          <p
            className="font-body italic text-sm md:text-base"
            style={{ color: "#777", maxWidth: "520px", margin: "0 auto" }}
          >
            &ldquo;If you saw yourself on the left — the next step is yours to take.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
