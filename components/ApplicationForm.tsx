"use client";

import { useEffect, useRef, useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  experience: string;
  accountSize: string;
  challenge: string;
  commitment: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(201,168,76,0.2)",
  borderRadius: "10px",
  color: "#f5f5f5",
  padding: "14px 16px",
  fontSize: "15px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  fontFamily: "inherit",
};

function InputField({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold" style={{ color: "#ccc" }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          borderColor: focused ? "#C9A84C" : "rgba(201,168,76,0.2)",
          boxShadow: focused ? "0 0 0 2px rgba(201,168,76,0.15)" : "none",
        }}
        autoComplete="off"
      />
    </div>
  );
}

function SelectField({
  label,
  id,
  options,
  value,
  onChange,
}: {
  label: string;
  id: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold" style={{ color: "#ccc" }}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          borderColor: focused ? "#C9A84C" : "rgba(201,168,76,0.2)",
          boxShadow: focused ? "0 0 0 2px rgba(201,168,76,0.15)" : "none",
          appearance: "none",
          cursor: "pointer",
        }}
      >
        <option value="" disabled style={{ background: "#111" }}>
          Select an option...
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#111", color: "#f5f5f5" }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ApplicationForm() {
  const ref = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    experience: "",
    accountSize: "",
    challenge: "",
    commitment: "",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const set = (k: keyof FormState) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const commitmentOptions = [
    { label: "Very Committed — I'm ready to put in the work", value: "very" },
    { label: "Somewhat Committed — I want to learn more first", value: "somewhat" },
    { label: "Not sure yet — still exploring", value: "not_sure" },
  ];

  return (
    <section
      id="apply"
      ref={ref}
      className="section-fade py-24 px-4"
      style={{ backgroundColor: "#080808" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold mb-3" style={{ color: "#C9A84C" }}>
            Limited Spots Available
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black uppercase tracking-tight"
            style={{ color: "#f5f5f5" }}
          >
            APPLY FOR
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #C9A84C, #D4AF37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              MENTORSHIP
            </span>
          </h2>
          <p className="mt-4 text-sm" style={{ color: "#888" }}>
            Fill out the form below and we&apos;ll review your application within 24 hours.
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-2xl p-8 sm:p-10"
          style={{
            background: "#0e0e0e",
            border: "1px solid rgba(201,168,76,0.25)",
            boxShadow: "0 0 60px rgba(201,168,76,0.06)",
          }}
        >
          {submitted ? (
            <div className="flex flex-col items-center gap-6 py-10 text-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(201,168,76,0.3), rgba(212,175,55,0.1))",
                  border: "2px solid rgba(201,168,76,0.5)",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: "#D4AF37" }}>
                  Application Submitted!
                </h3>
                <p className="text-sm" style={{ color: "#888" }}>
                  We&apos;ve received your application and will review it within 24 hours.
                  <br />
                  Check your email for next steps.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <InputField
                  label="Full Name *"
                  id="name"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={set("name")}
                />
                <InputField
                  label="Email Address *"
                  id="email"
                  type="email"
                  placeholder="john@email.com"
                  value={form.email}
                  onChange={set("email")}
                />
              </div>

              <InputField
                label="Phone Number *"
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={set("phone")}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SelectField
                  label="Trading Experience *"
                  id="experience"
                  value={form.experience}
                  onChange={set("experience")}
                  options={[
                    { label: "Beginner (< 1 year)", value: "beginner" },
                    { label: "Intermediate (1–3 years)", value: "intermediate" },
                    { label: "Advanced (3+ years)", value: "advanced" },
                  ]}
                />
                <SelectField
                  label="Funded Account Size"
                  id="accountSize"
                  value={form.accountSize}
                  onChange={set("accountSize")}
                  options={[
                    { label: "< $10,000", value: "under10k" },
                    { label: "$10,000 – $50,000", value: "10k_50k" },
                    { label: "$50,000 – $100,000", value: "50k_100k" },
                    { label: "$100,000+", value: "100k_plus" },
                    { label: "Not funded yet", value: "none" },
                  ]}
                />
              </div>

              {/* Textarea */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="challenge"
                  className="text-sm font-semibold"
                  style={{ color: "#ccc" }}
                >
                  What is your biggest trading challenge? *
                </label>
                <textarea
                  id="challenge"
                  rows={4}
                  placeholder="Describe your main challenge or what's been holding you back..."
                  value={form.challenge}
                  onChange={(e) => set("challenge")(e.target.value)}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: "100px",
                  }}
                />
              </div>

              {/* Commitment radio */}
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold" style={{ color: "#ccc" }}>
                  How committed are you? *
                </p>
                <div className="space-y-3">
                  {commitmentOptions.map((o) => (
                    <label
                      key={o.value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150"
                        style={{
                          borderColor: form.commitment === o.value ? "#C9A84C" : "rgba(255,255,255,0.2)",
                          background: form.commitment === o.value ? "rgba(201,168,76,0.15)" : "transparent",
                        }}
                        onClick={() => set("commitment")(o.value)}
                      >
                        {form.commitment === o.value && (
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#C9A84C" }} />
                        )}
                      </div>
                      <span
                        className="text-sm transition-colors duration-150"
                        style={{ color: form.commitment === o.value ? "#f5f5f5" : "#888" }}
                        onClick={() => set("commitment")(o.value)}
                      >
                        {o.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 rounded-full text-base font-bold tracking-wide cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #C9A84C 0%, #D4AF37 50%, #C9A84C 100%)",
                  backgroundSize: "200% 200%",
                  color: "#080808",
                  boxShadow: "0 4px 30px rgba(201,168,76,0.35)",
                  border: "none",
                }}
              >
                Submit Application →
              </button>

              {/* Trust signals */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                {[
                  { icon: "🔒", text: "100% Secure & Private" },
                  { icon: "⚡", text: "24hr Response Time" },
                  { icon: "✓", text: "Every Application Reviewed" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs" style={{ color: "#666" }}>
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs" style={{ color: "#555" }}>
                Limited spots available. We review every application personally.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
