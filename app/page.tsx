"use client";

import { useState, useEffect } from "react";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2"  y="22" width="6" height="14" rx="1.5" fill="#C9A84C" />
        <rect x="12" y="14" width="6" height="22" rx="1.5" fill="#D4AF37" />
        <rect x="22" y="8"  width="6" height="28" rx="1.5" fill="#C9A84C" />
        <rect x="32" y="2"  width="6" height="34" rx="1.5" fill="#D4AF37" />
      </svg>
      <span className="font-display text-base" style={{ color: "#F2EDE6", letterSpacing: "0.12em" }}>
        HUDDYERTRADES ELITE
      </span>
    </div>
  );
}

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    (window as Window & { fbq?: (...a: unknown[]) => void }).fbq?.("track", "ViewContent", {
      content_name: "Home Capture Page",
    });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (firstName) params.set("first_name", firstName);
    if (email) params.set("email", email);
    if (phone) params.set("phone", phone);
    window.location.href = `/apply?${params.toString()}`;
  }

  return (
    <main style={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-center px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Logo />
      </div>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-5 pt-20 pb-24 flex flex-col items-center text-center gap-8">
        <h1
          className="font-display leading-none"
          style={{ fontSize: "clamp(36px, 6.5vw, 72px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
        >
          The Exact Process I Use To Trade{" "}
          <span className="gold-text-gradient">Every Single Day.</span>
        </h1>

        <button
          className="btn-gold"
          style={{ fontSize: "16px", padding: "16px 40px" }}
          onClick={() => setOpen(true)}
        >
          Learn My Trading Strategy
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center px-5"
          style={{ backgroundColor: "rgba(0,0,0,0.75)", zIndex: 50, backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full flex flex-col gap-6 p-8"
            style={{
              maxWidth: 440,
              backgroundColor: "#111111",
              border: "1px solid rgba(201,168,76,0.35)",
              borderRadius: 16,
            }}
          >
            <div className="flex flex-col gap-1 text-center">
              <h2
                className="font-display"
                style={{ fontSize: "clamp(22px, 3vw, 28px)", color: "#F2EDE6", letterSpacing: "0.02em" }}
              >
                GET THE FULL{" "}
                <span className="gold-text-gradient">STRATEGY</span>
              </h2>
              <p className="font-body text-sm" style={{ color: "#666" }}>
                Enter your info below and I&apos;ll send it to you instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <style>{`
                .strategy-input {
                  width: 100%;
                  background: #1a1a1a;
                  border: 1px solid rgba(255,255,255,0.1);
                  border-radius: 8px;
                  padding: 12px 16px;
                  color: #F2EDE6;
                  font-family: var(--font-body);
                  font-size: 15px;
                  outline: none;
                  transition: border-color 0.15s;
                }
                .strategy-input::placeholder { color: #555; }
                .strategy-input:focus { border-color: rgba(201,168,76,0.6); }
              `}</style>

              <input
                className="strategy-input"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                className="strategy-input"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="strategy-input"
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <button
                type="submit"
                className="btn-gold w-full justify-center"
                style={{ fontSize: "16px", padding: "14px 32px", marginTop: 4 }}
              >
                Learn My Strategy
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3.75 9h10.5M9.75 4.5L14.25 9l-4.5 4.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
