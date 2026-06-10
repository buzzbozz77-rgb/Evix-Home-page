"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SERVICES = [
  {
    id: "website",
    icon: "⬡",
    title: "Website",
    desc: "Full multi-section websites with hero, features, testimonials, and more. Production-ready HTML delivered fast.",
    priceUSD: 199,
    priceJOD: 141,
    priceNoteUSD: "one-time",
    priceNoteJOD: "one-time",
    color: "#22c55e",
    href: "/builder",
    badge: "Most Popular",
    features: ["Hero + sections", "Responsive design", "Contact forms", "Google Fonts", "Single-file HTML"],
  },
  {
    id: "landing",
    icon: "◈",
    title: "Landing Pages",
    desc: "High-converting landing pages with pricing tables, testimonials, and strong CTAs — built for results.",
    priceUSD: 99,
    priceJOD: 70,
    priceNoteUSD: "one-time",
    priceNoteJOD: "one-time",
    color: "#16a34a",
    href: "/builder?type=landing",
    badge: null,
    features: ["Conversion-focused", "Pricing section", "Testimonials", "CTA blocks", "Single-file HTML"],
  },
  {
    id: "chatbot",
    icon: "◎",
    title: "AI Chatbots",
    desc: "Intelligent chat widgets powered by live AI. Context-aware responses and a beautiful UI, ready to embed anywhere.",
    priceUSD: 59,
    priceJOD: 42,
    priceNoteUSD: "per month",
    priceNoteJOD: "per month",
    color: "#4ade80",
    href: "/chatbot",
    badge: null,
    features: ["Live AI responses", "Custom personality", "Embeddable widget", "Beautiful chat UI", "Context-aware"],
  },
];

function EvixLogoSymbol({ size = 60 }) {
  return (
    <img src="/LOGOSS.png" alt="Evix" style={{ height: size, width: "auto", display: "block", maxWidth: size * 1.1, objectFit: "cover", objectPosition: "left center" }} />
  );
}

export default function ServicesPage() {
  const router = useRouter();
  const [currency, setCurrency] = useState("USD");

  const getPrice = (s) => {
    if (currency === "USD") return { amount: `$${s.priceUSD}`, note: s.priceNoteUSD };
    return { amount: `${s.priceJOD} JOD`, note: s.priceNoteJOD };
  };

  return (
    <div style={{ background: "#000000", color: "#e2e8f8", fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,.4); border-radius: 2px; }
        .service-card { background: rgba(255,255,255,.022); border-radius: 20px; padding: 36px 32px; transition: all .28s; display: flex; flex-direction: column; cursor: pointer; position: relative; overflow: hidden; }
        .service-card:hover { transform: translateY(-5px); }
        .cta-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px 20px; border-radius: 10px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s; font-family: 'Inter',sans-serif; color: #fff; }
        .cta-btn:hover { transform: translateY(-1px); }
        .currency-toggle { display: flex; align-items: center; gap: 2px; padding: 3px; border-radius: 9px; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); }
        .currency-btn { padding: 5px 14px; border-radius: 7px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .18s; font-family: 'Inter',sans-serif; }
        @media (max-width: 768px) { .services-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* NAV */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,.05)", padding: "14px 28px", display: "flex", alignItems: "center", gap: 16, background: "rgba(0,0,0,.95)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
        <button onClick={() => router.push("/")}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,.07)", borderRadius: 7, color: "rgba(226,232,248,.4)", cursor: "pointer", fontSize: 13, padding: "5px 12px", fontFamily: "Inter,sans-serif", transition: "all .18s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#e2e8f8"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(226,232,248,.4)"}
        >← Home</button>

        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <EvixLogoSymbol size={60} />
          <span style={{ fontSize: 15, fontWeight: 700, background: "linear-gradient(135deg,#4ade80,#22c55e,#16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Evix</span>
          <span style={{ color: "rgba(255,255,255,.2)", fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, color: "rgba(226,232,248,.4)", fontWeight: 500 }}>Services</span>
        </div>

        {/* Currency Toggle */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: "rgba(226,232,248,.28)", fontWeight: 500 }}>Currency</span>
          <div className="currency-toggle">
            <button className="currency-btn"
              style={{ background: currency === "USD" ? "linear-gradient(135deg,#16a34a,#22c55e)" : "transparent", color: currency === "USD" ? "#fff" : "rgba(226,232,248,.4)" }}
              onClick={() => setCurrency("USD")}
            >🇺🇸 USD</button>
            <button className="currency-btn"
              style={{ background: currency === "JOD" ? "linear-gradient(135deg,#15803d,#16a34a)" : "transparent", color: currency === "JOD" ? "#fff" : "rgba(226,232,248,.4)" }}
              onClick={() => setCurrency("JOD")}
            >🇯🇴 JOD</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "80px 24px 60px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,197,94,.08) 0%,transparent 65%)", top: "-100px", left: "50%", transform: "translateX(-50%)", filter: "blur(60px)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(34,197,94,.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, animation: "fadeUp .7s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 100, border: "1px solid rgba(34,197,94,.28)", background: "rgba(34,197,94,.07)", marginBottom: 24 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <span style={{ fontSize: 11.5, color: "rgba(74,222,128,.8)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 500 }}>What we build</span>
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-.04em", color: "#f1f4ff", marginBottom: 16, lineHeight: 1.08 }}>
            Our <span style={{ background: "linear-gradient(135deg,#4ade80,#22c55e,#16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Services</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(226,232,248,.35)", fontWeight: 300, maxWidth: 480, margin: "0 auto 12px" }}>
            From websites to AI chatbots — everything your business needs, delivered fast.
          </p>
          <p style={{ fontSize: 13, color: "rgba(74,222,128,.3)", fontWeight: 300 }}>
            Prices shown in {currency === "USD" ? "US Dollar (USD)" : "Jordanian Dinar (JOD)"}
            {currency === "JOD" && " · approx. 1 USD = 0.71 JOD"}
          </p>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, maxWidth: 1100, margin: "0 auto", padding: "0 24px 100px" }}>
        {SERVICES.map((s, i) => {
          const { amount, note } = getPrice(s);
          return (
            <div key={s.id} className="service-card" onClick={() => router.push(s.href)}
              style={{ border: `1px solid ${s.color}22`, background: `linear-gradient(160deg, rgba(255,255,255,.025) 0%, ${s.color}08 100%)`, animationDelay: `${i * 0.08}s`, animation: "fadeUp .7s ease both" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}55`; e.currentTarget.style.boxShadow = `0 12px 48px ${s.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${s.color}22`; e.currentTarget.style.boxShadow = "none"; }}
            >
              {s.badge ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, background: `${s.color}22`, border: `1px solid ${s.color}44`, marginBottom: 20, alignSelf: "flex-start" }}>
                  <span style={{ fontSize: 10, color: s.color, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>{s.badge}</span>
                </div>
              ) : <div style={{ marginBottom: 20 }} />}

              <div style={{ fontSize: 32, marginBottom: 14, color: s.color }}>{s.icon}</div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f4ff", marginBottom: 10, letterSpacing: "-.025em" }}>{s.title}</h2>
              <p style={{ fontSize: 14, color: "rgba(226,232,248,.35)", lineHeight: 1.75, fontWeight: 300, marginBottom: 24 }}>{s.desc}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 28 }}>
                {s.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: s.color, fontSize: 12 }}>✓</span>
                    <span style={{ fontSize: 13, color: "rgba(226,232,248,.4)" }}>{f}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 20 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: "#f1f4ff", letterSpacing: "-.03em" }}>{amount}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 12, color: s.color, fontWeight: 500 }}>{note}</span>
                </div>
                <button className="cta-btn" style={{ background: `linear-gradient(135deg, ${s.color}cc, ${s.color})` }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 24px ${s.color}55`; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  Get Started →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      {currency === "JOD" && (
        <div style={{ textAlign: "center", padding: "0 24px 60px" }}>
          <p style={{ fontSize: 12, color: "rgba(226,232,248,.18)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            * Prices in JOD are approximate. Exchange rate: 1 USD ≈ 0.71 JOD.
          </p>
        </div>
      )}
    </div>
  );
}