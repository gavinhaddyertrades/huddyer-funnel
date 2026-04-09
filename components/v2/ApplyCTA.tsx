"use client";

import { useEffect, useRef } from "react";

const TYPEFORM_URL = "https://form.typeform.com/to/AH6Qxmyu";

export default function ApplyCTA() {
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
      id="apply"
      className="section-fade py-20 md:py-28 px-5 md:px-12"
      style={{
        backgroundColor: "#111111",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">

        {/* Headline — no hard breaks, let it wrap naturally */}
        <h2
          className="font-display gold-text-gradient"
          style={{
            fontSize: "clamp(48px, 10vw, 120px)",
            lineHeight: 1,
            letterSpacing: "0.02em",
          }}
        >
          READY TO TRADE AT THE HIGHEST LEVEL?
        </h2>

        {/* Subline */}
        <p
          className="font-body leading-relaxed"
          style={{
            fontSize: "clamp(14px, 2vw, 16px)",
            color: "#999",
            maxWidth: "440px",
          }}
        >
          Hudson works with a small number of traders at a time. If you&apos;re
          serious about becoming consistently profitable, apply below.
        </p>

        {/* Button — full width on mobile */}
        <a
          href={TYPEFORM_URL}
          className="btn-gold w-full sm:w-auto justify-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply Now
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <p className="font-body text-xs" style={{ color: "#777" }}>
          Limited spots per cohort. Every application is reviewed.
        </p>
      </div>
    </section>
  );
}
