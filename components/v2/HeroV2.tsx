"use client";

import Script from "next/script";
import { useUTMUrl } from "@/hooks/useUTMUrl";

const TYPEFORM_BASE = "https://form.typeform.com/to/AH6Qxmyu";
const WISTIA_ID = "ht3wh0gzng";

export default function HeroV2() {
  const typeformUrl = useUTMUrl(TYPEFORM_BASE);

  return (
    <>
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
      <Script
        src={`https://fast.wistia.com/embed/${WISTIA_ID}.js`}
        strategy="afterInteractive"
        type="module"
      />

      <section
        className="min-h-screen flex items-center justify-center px-5"
        style={{ backgroundColor: "#0A0A0A", paddingTop: 40, paddingBottom: 32 }}
      >
        <div className="w-full flex flex-col items-center gap-5" style={{ maxWidth: 700 }}>

          {/* Headline */}
          <h1
            className="font-display leading-none text-center"
            style={{
              fontSize: "clamp(38px, 7.5vw, 76px)",
              color: "#F2EDE6",
              letterSpacing: "0.02em",
            }}
          >
            FROM INCONSISTENT TO{" "}
            <span className="gold-text-gradient">PROFITABLE IN 90 DAYS.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="font-body text-center leading-snug"
            style={{
              fontSize: "clamp(14px, 2vw, 16px)",
              color: "#777",
              maxWidth: 480,
            }}
          >
            A private mentorship built for <strong style={{ color: "#F2EDE6", fontWeight: 600 }}>serious traders</strong> who are done leaving money on the table.
          </p>

          {/* Video */}
          <div
            style={{
              border: "1.5px solid #C9A84C",
              borderRadius: 12,
              padding: 5,
            }}
          >
            <style>{`
              wistia-player[media-id='${WISTIA_ID}']:not(:defined) {
                background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${WISTIA_ID}/swatch');
                display: block;
                filter: blur(5px);
                padding-top: 56.25%;
              }
            `}</style>
            <div
              style={{ borderRadius: 8, overflow: "hidden" }}
              dangerouslySetInnerHTML={{
                __html: `<wistia-player media-id="${WISTIA_ID}" aspect="1.7777777777777777"></wistia-player>`,
              }}
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-2 w-full">
            <a
              href={typeformUrl}
              className="btn-gold w-full justify-center"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "16px",
                padding: "14px 32px",
                maxWidth: 260,
              }}
            >
              Apply Now
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <p className="font-body text-xs" style={{ color: "#555" }}>
              Limited spots per cohort. Every application is reviewed.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
