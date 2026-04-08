"use client";

import { useEffect, useState } from "react";

const TARGET_DATE = new Date("2026-04-30T23:59:59Z");

function getTimeLeft() {
  const diff = TARGET_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "DAYS", value: time.days },
    { label: "HRS", value: time.hours },
    { label: "MIN", value: time.minutes },
    { label: "SEC", value: time.seconds },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs uppercase tracking-widest" style={{ color: "#888" }}>
        Next cohort closes in
      </p>
      <div className="flex items-center gap-2">
        {units.map((u, i) => (
          <div key={u.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className="rounded-lg px-3 py-2 text-center min-w-[52px]"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.3)",
                }}
              >
                <span
                  className="text-xl font-bold tabular-nums"
                  style={{ color: "#D4AF37" }}
                >
                  {Pad(u.value)}
                </span>
              </div>
              <span className="text-[10px] mt-1 tracking-widest" style={{ color: "#666" }}>
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="text-lg font-bold mb-4" style={{ color: "#C9A84C" }}>
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
