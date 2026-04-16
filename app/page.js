"use client";
import { useState, useEffect, useRef } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Orbitron:wght@400;700;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #050816;
  --blue: #3b82f6;
  --purple: #a855f7;
  --pink: #ec4899;
  --blue-dim: rgba(59,130,246,0.15);
  --purple-dim: rgba(168,85,247,0.15);
  --pink-dim: rgba(236,72,153,0.12);
  --glass: rgba(255,255,255,0.04);
  --glass-border: rgba(255,255,255,0.08);
  --text: #e2e8f0;
  --muted: rgba(226,232,240,0.45);
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Space Grotesk', sans-serif;
  overflow-x: hidden;
  line-height: 1.6;
}

.orbitron { font-family: 'Orbitron', monospace; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--purple); border-radius: 4px; }

/* ─── Glow Utilities ─── */
.glow-blue  { text-shadow: 0 0 20px rgba(59,130,246,0.8), 0 0 40px rgba(59,130,246,0.4); }
.glow-purple{ text-shadow: 0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(168,85,247,0.4); }
.glow-pink  { text-shadow: 0 0 20px rgba(236,72,153,0.8), 0 0 40px rgba(236,72,153,0.4); }

.box-glow-blue   { box-shadow: 0 0 30px rgba(59,130,246,0.3), 0 0 60px rgba(59,130,246,0.1); }
.box-glow-purple { box-shadow: 0 0 30px rgba(168,85,247,0.3), 0 0 60px rgba(168,85,247,0.1); }
.box-glow-pink   { box-shadow: 0 0 30px rgba(236,72,153,0.3), 0 0 60px rgba(236,72,153,0.1); }

/* ─── Gradient Text ─── */
.grad-text {
  background: linear-gradient(135deg, var(--blue) 0%, var(--purple) 50%, var(--pink) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.grad-text-bp {
  background: linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Buttons ─── */
.btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 14px 36px; border-radius: 10px; font-size: 15px; font-weight: 600;
  background: linear-gradient(135deg, var(--blue), var(--purple));
  color: #fff; border: none; cursor: pointer; position: relative;
  overflow: hidden; transition: all 0.3s ease; letter-spacing: 0.04em;
  box-shadow: 0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(168,85,247,0.2);
}
.btn-primary::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0; transition: opacity 0.3s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(59,130,246,0.6), 0 0 60px rgba(168,85,247,0.3); }
.btn-primary:hover::before { opacity: 1; }

.btn-ghost {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 13px 36px; border-radius: 10px; font-size: 15px; font-weight: 600;
  background: transparent; color: var(--blue); cursor: pointer;
  border: 1px solid rgba(59,130,246,0.5); transition: all 0.3s ease;
  letter-spacing: 0.04em; position: relative; overflow: hidden;
}
.btn-ghost::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(168,85,247,0.1));
  opacity: 0; transition: opacity 0.3s;
}
.btn-ghost:hover { border-color: var(--purple); color: var(--purple); transform: translateY(-2px); }
.btn-ghost:hover::before { opacity: 1; }

/* ─── Glass Card ─── */
.glass-card {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 20px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}
.glass-card::before {
  content: ''; position: absolute; inset: 0; border-radius: 20px;
  background: linear-gradient(135deg, rgba(59,130,246,0.05), rgba(168,85,247,0.05));
  opacity: 0; transition: opacity 0.4s;
}
.glass-card:hover { border-color: rgba(168,85,247,0.4); transform: translateY(-6px); }
.glass-card:hover::before { opacity: 1; }
.glass-card:hover .card-glow-inner { opacity: 1; }

.card-glow-inner {
  position: absolute; width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%);
  top: -60px; right: -60px; opacity: 0; transition: opacity 0.4s;
  pointer-events: none;
}

/* ─── Nav ─── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  transition: all 0.3s ease;
}
.nav.scrolled {
  background: rgba(5,8,22,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(59,130,246,0.15);
}

/* ─── Hero BG ─── */
.hero-bg {
  position: absolute; inset: 0; overflow: hidden; z-index: 0;
}
.orb {
  position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
}
.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
  top: -200px; left: -100px;
  animation: float1 8s ease-in-out infinite;
}
.orb-2 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%);
  top: 100px; right: -150px;
  animation: float2 10s ease-in-out infinite;
}
.orb-3 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%);
  bottom: 0; left: 30%;
  animation: float3 12s ease-in-out infinite;
}

@keyframes float1 {
  0%,100% { transform: translate(0,0); }
  50% { transform: translate(30px, 40px); }
}
@keyframes float2 {
  0%,100% { transform: translate(0,0); }
  50% { transform: translate(-40px, 20px); }
}
@keyframes float3 {
  0%,100% { transform: translate(0,0); }
  50% { transform: translate(20px, -30px); }
}

/* ─── Grid BG ─── */
.grid-bg {
  position: absolute; inset: 0; z-index: 0;
  background-image:
    linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
}

/* ─── Animations ─── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.5); opacity: 0; }
}
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes blink {
  0%,100% { opacity: 1; }
  50% { opacity: 0; }
}

.fade-up { animation: fadeUp 0.9s ease forwards; opacity: 0; }
.d1 { animation-delay: 0.1s; }
.d2 { animation-delay: 0.25s; }
.d3 { animation-delay: 0.4s; }
.d4 { animation-delay: 0.55s; }
.d5 { animation-delay: 0.7s; }

/* ─── Badge ─── */
.badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 18px; border-radius: 40px;
  background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3);
  font-size: 12px; letter-spacing: 0.12em; color: var(--blue); text-transform: uppercase;
}
.pulse-dot {
  width: 7px; height: 7px; border-radius: 50%; background: var(--blue);
  position: relative; flex-shrink: 0;
}
.pulse-dot::after {
  content: ''; position: absolute; inset: 0; border-radius: 50%;
  background: var(--blue); animation: pulse-ring 2s ease-out infinite;
}

/* ─── Section divider ─── */
.divider {
  width: 80px; height: 2px; margin: 0 auto;
  background: linear-gradient(to right, transparent, var(--purple), transparent);
}

/* ─── Step connector ─── */
.step-num {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-dim), var(--purple-dim));
  border: 1px solid rgba(168,85,247,0.4);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Orbitron', monospace; font-size: 20px; font-weight: 700;
  color: var(--purple); margin: 0 auto 24px;
  box-shadow: 0 0 20px rgba(168,85,247,0.2);
}

/* ─── Form ─── */
.form-input {
  width: 100%; padding: 14px 18px; border-radius: 10px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  color: var(--text); font-family: 'Space Grotesk', sans-serif; font-size: 15px;
  outline: none; transition: all 0.3s ease;
}
.form-input:focus {
  border-color: var(--blue); background: rgba(59,130,246,0.06);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}
.form-input::placeholder { color: rgba(226,232,240,0.3); }
textarea.form-input { resize: vertical; min-height: 130px; }

/* ─── Portfolio card ─── */
.portfolio-card {
  border-radius: 20px; overflow: hidden; position: relative;
  background: var(--glass); border: 1px solid var(--glass-border);
  transition: all 0.4s ease;
}
.portfolio-card:hover { transform: translateY(-6px); border-color: rgba(236,72,153,0.4); }
.portfolio-card:hover .portfolio-overlay { opacity: 1; }
.portfolio-thumb {
  width: 100%; height: 200px; display: flex; align-items: center; justify-content: center;
  font-size: 60px; position: relative; overflow: hidden;
}
.portfolio-overlay {
  position: absolute; inset: 0; background: rgba(5,8,22,0.7);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.4s; backdrop-filter: blur(4px);
}

/* ─── Testimonial ─── */
.testimonial-card {
  background: var(--glass); border: 1px solid var(--glass-border);
  border-radius: 20px; padding: 36px 32px; transition: all 0.4s ease;
  position: relative;
}
.testimonial-card:hover { border-color: rgba(59,130,246,0.3); transform: translateY(-4px); }
.quote-mark {
  font-size: 80px; line-height: 1; color: rgba(168,85,247,0.2);
  font-family: 'Orbitron', monospace; position: absolute; top: 16px; left: 24px;
}

/* ─── CTA section ─── */
.cta-section {
  position: relative; overflow: hidden; text-align: center;
}
.cta-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(168,85,247,0.08) 50%, rgba(236,72,153,0.06) 100%);
}
.cta-border {
  border-top: 1px solid rgba(168,85,247,0.2);
  border-bottom: 1px solid rgba(59,130,246,0.2);
}

/* ─── Footer ─── */
.footer-line { border-top: 1px solid rgba(255,255,255,0.06); }

/* ─── Icon circles ─── */
.icon-wrap {
  width: 64px; height: 64px; border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; margin-bottom: 24px;
}

/* ─── Nav links ─── */
.nav-link {
  color: rgba(226,232,240,0.55); font-size: 14px; cursor: pointer;
  transition: color 0.3s; letter-spacing: 0.04em;
}
.nav-link:hover { color: var(--blue); }

/* ─── Stars ─── */
.stars { color: var(--pink); font-size: 14px; letter-spacing: 3px; margin-bottom: 16px; }
`;

/* ─────────────────────────── DATA ─────────────────────────── */
const services = [
  {
    icon: "🌐",
    color: "#3b82f6",
    dimColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.3)",
    tag: "Most Popular",
    title: "Business Websites",
    points: ["Full business & brand websites", "Fast, modern & fully responsive", "Built for conversions & SEO"],
    desc: "We design and build complete digital presences that leave lasting impressions and turn visitors into customers.",
  },
  {
    icon: "🚀",
    color: "#a855f7",
    dimColor: "rgba(168,85,247,0.12)",
    borderColor: "rgba(168,85,247,0.3)",
    tag: "High Impact",
    title: "Landing Pages",
    points: ["High-converting sales pages", "Product funnels & campaigns", "A/B tested layouts"],
    desc: "Precision-engineered pages with one job: convert your traffic into leads, sales, and loyal customers.",
  },
  {
    icon: "🤖",
    color: "#ec4899",
    dimColor: "rgba(236,72,153,0.12)",
    borderColor: "rgba(236,72,153,0.3)",
    tag: "24/7 Active",
    title: "AI Chatbots",
    points: ["Automate customer replies", "Capture & qualify leads", "24/7 support, zero cost"],
    desc: "Deploy intelligent AI agents that engage visitors, answer questions, and close deals while you sleep.",
  },
];

const portfolio = [
  {
    emoji: "💎",
    bg: "linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)",
    accent: "#3b82f6",
    title: "LuxeStore — E-Commerce",
    desc: "Full brand website + product catalog for a luxury fashion retailer. 40% increase in online sales.",
    tag: "Website",
  },
  {
    emoji: "⚡",
    bg: "linear-gradient(135deg, #2d1b4e 0%, #0d0a1e 100%)",
    accent: "#a855f7",
    title: "SprintFunnel — SaaS Launch",
    desc: "High-converting landing page for a productivity SaaS. Achieved 28% trial signup rate.",
    tag: "Landing Page",
  },
  {
    emoji: "🏥",
    bg: "linear-gradient(135deg, #1a2f1a 0%, #0a140a 100%)",
    accent: "#ec4899",
    title: "MediCare — Clinic AI Bot",
    desc: "AI chatbot for a private clinic that books appointments, answers FAQs, and follows up with patients.",
    tag: "AI Chatbot",
  },
];

const steps = [
  { num: "01", title: "Tell Us Your Idea", desc: "Share your business goals, brand, and what you need. We listen carefully and plan the perfect solution for you." },
  { num: "02", title: "We Build Your System", desc: "Our team designs and develops your website, funnel, or AI bot — fast, clean, and built to convert." },
  { num: "03", title: "You Get Results", desc: "Launch with confidence. Watch traffic turn into leads, customers, and revenue on autopilot." },
];

const testimonials = [
  {
    name: "Khaled Al-Mansouri",
    role: "CEO, Al-Mansouri Real Estate",
    avatar: "K",
    color: "#3b82f6",
    quote: "NOVIX built us a website that completely transformed how clients perceive us. Professional, fast, and beautiful. Our inquiry rate went up by 60% in the first month.",
    service: "Business Website",
  },
  {
    name: "Lina Haddad",
    role: "Founder, Bloom Beauty Store",
    avatar: "L",
    color: "#a855f7",
    quote: "The landing page they created for our product launch was insane. 300 orders in the first week. I never knew a page could make that much difference.",
    service: "Landing Page",
  },
  {
    name: "Dr. Rami Nassar",
    role: "Director, NovaCare Clinic",
    avatar: "R",
    color: "#ec4899",
    quote: "The AI chatbot handles 90% of our appointment bookings now. Patients get instant answers at 3am, and my staff focuses on real work. Game changer.",
    service: "AI Chatbot",
  },
];

/* ─────────────────────────── COMPONENT ─────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <style>{styles}</style>

      {/* ── NAV ── */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="orbitron grad-text" style={{ fontSize: 22, fontWeight: 900, letterSpacing: "0.08em" }}>
            NOVIX
          </div>
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {[["Services", "services"], ["Work", "portfolio"], ["How It Works", "how"], ["Contact", "contact"]].map(([label, id]) => (
              <span key={id} className="nav-link" onClick={() => scrollTo(id)}>{label}</span>
            ))}
            <button className="btn-primary" style={{ padding: "10px 24px", fontSize: 13 }} onClick={() => scrollTo("contact")}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "140px 32px 100px", position: "relative", overflow: "hidden" }}>
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="grid-bg" />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto" }}>
          {/* Badge */}
          <div className="fade-up d1" style={{ marginBottom: 36 }}>
            <span className="badge">
              <span className="pulse-dot" />
              Now Live — NOVIX Conversions
            </span>
          </div>

          {/* Headline */}
          <h1 className="orbitron fade-up d2" style={{ fontSize: "clamp(36px, 6.5vw, 80px)", fontWeight: 900, lineHeight: 1.08, marginBottom: 28, letterSpacing: "-0.02em" }}>
            Build Websites<br />
            That <span className="grad-text">Convert.</span><br />
            <span style={{ color: "rgba(226,232,240,0.8)", fontWeight: 400, fontSize: "0.85em" }}>Automate Everything.</span>
          </h1>

          {/* Sub */}
          <p className="fade-up d3" style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "var(--muted)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 52px", fontWeight: 400 }}>
            We design high-converting websites, landing pages, and AI chatbots that grow your business automatically.
          </p>

          {/* CTAs */}
          <div className="fade-up d4" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => scrollTo("contact")}>
              Get Started →
            </button>
            <button className="btn-ghost" onClick={() => scrollTo("portfolio")}>
              View Our Work
            </button>
          </div>

          {/* Stats */}
          <div className="fade-up d5" style={{ display: "flex", gap: 48, justifyContent: "center", marginTop: 80, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" }}>
            {[["50+", "Projects Delivered"], ["3x", "Avg. Conversion Lift"], ["24/7", "AI Automation"]].map(([val, label]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div className="orbitron grad-text-bp" style={{ fontSize: 32, fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(226,232,240,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" style={{ padding: "120px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="badge" style={{ marginBottom: 20, background: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.3)", color: "var(--purple)" }}>
              What We Do
            </div>
            <h2 className="orbitron" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, marginBottom: 20 }}>
              Our <span className="grad-text">Services</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 480, margin: "0 auto" }}>
              Everything your business needs to dominate online, all under one roof.
            </p>
            <div className="divider" style={{ marginTop: 28 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {services.map((s) => (
              <div key={s.title} className="glass-card" style={{ padding: "40px 32px" }}>
                <div className="card-glow-inner" style={{ background: `radial-gradient(circle, ${s.dimColor.replace("0.12", "0.25")} 0%, transparent 70%)` }} />
                <div className="icon-wrap" style={{ background: s.dimColor, border: `1px solid ${s.borderColor}` }}>
                  <span>{s.icon}</span>
                </div>
                <div style={{ display: "inline-block", padding: "3px 12px", borderRadius: 20, background: s.dimColor, border: `1px solid ${s.borderColor}`, fontSize: 11, letterSpacing: "0.1em", color: s.color, textTransform: "uppercase", marginBottom: 14 }}>
                  {s.tag}
                </div>
                <h3 className="orbitron" style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: "#fff" }}>{s.title}</h3>
                <ul style={{ listStyle: "none", marginBottom: 20 }}>
                  {s.points.map((p) => (
                    <li key={p} style={{ color: "var(--muted)", fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: s.color, flexShrink: 0 }}>▸</span> {p}
                    </li>
                  ))}
                </ul>
                <p style={{ color: "rgba(226,232,240,0.5)", fontSize: 14, lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="portfolio" style={{ padding: "120px 32px", background: "rgba(59,130,246,0.02)", borderTop: "1px solid rgba(59,130,246,0.08)", borderBottom: "1px solid rgba(59,130,246,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="badge" style={{ marginBottom: 20, background: "rgba(236,72,153,0.1)", borderColor: "rgba(236,72,153,0.3)", color: "var(--pink)" }}>
              Our Work
            </div>
            <h2 className="orbitron" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, marginBottom: 20 }}>
              Recent <span className="grad-text">Projects</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 440, margin: "0 auto" }}>Real results from real businesses we've transformed.</p>
            <div className="divider" style={{ marginTop: 28 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {portfolio.map((p) => (
              <div key={p.title} className="portfolio-card">
                <div className="portfolio-thumb" style={{ background: p.bg }}>
                  <span style={{ fontSize: 64 }}>{p.emoji}</span>
                  <div className="portfolio-overlay">
                    <button className="btn-primary" style={{ padding: "12px 28px", fontSize: 14 }}
                      onClick={() => scrollTo("contact")}>
                      View Project →
                    </button>
                  </div>
                </div>
                <div style={{ padding: "28px 28px 32px" }}>
                  <div style={{ display: "inline-block", padding: "3px 12px", borderRadius: 20, background: `${p.accent}22`, border: `1px solid ${p.accent}44`, fontSize: 11, letterSpacing: "0.1em", color: p.accent, textTransform: "uppercase", marginBottom: 14 }}>
                    {p.tag}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: "#fff" }}>{p.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{p.desc}</p>
                  <button className="btn-ghost" style={{ padding: "10px 24px", fontSize: 13, borderColor: `${p.accent}66`, color: p.accent }}
                    onClick={() => scrollTo("contact")}>
                    View Project →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: "120px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="badge" style={{ marginBottom: 20 }}>The Process</div>
            <h2 className="orbitron" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, marginBottom: 20 }}>
              How It <span className="grad-text">Works</span>
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 440, margin: "0 auto" }}>From idea to a live, converting system in record time.</p>
            <div className="divider" style={{ marginTop: 28 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 48, position: "relative" }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ textAlign: "center", position: "relative" }}>
                {i < steps.length - 1 && (
                  <div style={{ position: "absolute", top: 32, left: "60%", width: "80%", height: 1, background: "linear-gradient(to right, rgba(168,85,247,0.4), rgba(59,130,246,0.2))", display: "none" }} />
                )}
                <div className="step-num">{s.num}</div>
                <h3 className="orbitron" style={{ fontSize: 20, fontWeight: 700, marginBottom: 14 }}>{s.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "120px 32px", background: "rgba(168,85,247,0.02)", borderTop: "1px solid rgba(168,85,247,0.08)", borderBottom: "1px solid rgba(168,85,247,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="badge" style={{ marginBottom: 20, background: "rgba(168,85,247,0.1)", borderColor: "rgba(168,85,247,0.3)", color: "var(--purple)" }}>
              Social Proof
            </div>
            <h2 className="orbitron" style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, marginBottom: 20 }}>
              Trusted by <span className="grad-text">Businesses</span>
            </h2>
            <div className="divider" style={{ marginTop: 28 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
            {testimonials.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="quote-mark">"</div>
                <div className="stars">★★★★★</div>
                <div style={{ display: "inline-block", padding: "3px 12px", borderRadius: 20, background: `${t.color}22`, border: `1px solid ${t.color}44`, fontSize: 11, letterSpacing: "0.1em", color: t.color, textTransform: "uppercase", marginBottom: 20 }}>
                  {t.service}
                </div>
                <p style={{ color: "rgba(226,232,240,0.8)", lineHeight: 1.8, fontSize: 15, marginBottom: 32, fontStyle: "italic", position: "relative", zIndex: 1 }}>
                  {t.quote}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0, fontFamily: "'Orbitron', monospace" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{t.name}</div>
                    <div style={{ color: t.color, fontSize: 12, marginTop: 3, opacity: 0.8 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cta-section cta-border" style={{ padding: "140px 32px" }}>
        <div className="cta-bg" />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "7px 22px", borderRadius: 40, border: "1px solid rgba(168,85,247,0.4)", background: "rgba(168,85,247,0.08)", marginBottom: 36 }}>
            <span style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--purple)", textTransform: "uppercase" }}>Limited Spots Available</span>
          </div>
          <h2 className="orbitron" style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
            Ready to Grow<br />Your <span className="grad-text">Business?</span>
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.75, marginBottom: 52, fontWeight: 400 }}>
            Join 50+ businesses that chose NOVIX to build their digital presence, automate their growth, and convert more customers.
          </p>
          <button className="btn-primary" style={{ padding: "18px 56px", fontSize: 16 }} onClick={() => scrollTo("contact")}>
            Start Now — It's Free →
          </button>
          <p style={{ marginTop: 20, fontSize: 13, color: "rgba(226,232,240,0.25)" }}>No commitment required &middot; Response within 24 hours</p>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "120px 32px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <div className="badge" style={{ marginBottom: 20, background: "rgba(236,72,153,0.1)", borderColor: "rgba(236,72,153,0.3)", color: "var(--pink)" }}>
              Get In Touch
            </div>
            <h2 className="orbitron" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, marginBottom: 16 }}>
              Let's <span className="grad-text">Build Together</span>
            </h2>
            <p style={{ color: "var(--muted)", fontSize: 16 }}>
              Tell us about your project. We'll get back to you within 24 hours.
            </p>
            <div className="divider" style={{ marginTop: 24 }} />
          </div>

          <div className="glass-card" style={{ padding: "48px 44px" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Your Name</label>
                <input
                  className="form-input" type="text" placeholder="Mohammed Al-Rashid" required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Email Address</label>
                <input
                  className="form-input" type="email" placeholder="hello@yourbusiness.com" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div style={{ marginBottom: 32 }}>
                <label style={{ fontSize: 13, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Your Message</label>
                <textarea
                  className="form-input" placeholder="Tell us about your project, what you need, and your budget..." required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: 16, letterSpacing: "0.06em" }}>
                {sent ? "✓ Request Sent! We'll be in touch soon." : "Send Request →"}
              </button>
            </form>
          </div>

          {/* Contact details */}
          <div style={{ display: "flex", justifyContent: "center", gap: 40, marginTop: 48, flexWrap: "wrap" }}>
            {[["📧", "hello@novixconversions.com"], ["💬", "WhatsApp Available"], ["⚡", "24hr Response Time"]].map(([icon, txt]) => (
              <div key={txt} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: 13 }}>
                <span>{icon}</span> {txt}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer-line" style={{ padding: "32px", maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div className="orbitron grad-text" style={{ fontSize: 20, fontWeight: 900, letterSpacing: "0.08em" }}>NOVIX</div>
        <div style={{ fontSize: 13, color: "rgba(226,232,240,0.25)" }}>&copy; 2025 NOVIX Conversions. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms"].map((l) => (
            <span key={l} style={{ fontSize: 13, color: "rgba(226,232,240,0.3)", cursor: "pointer", transition: "color 0.3s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--blue)"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(226,232,240,0.3)"}>
              {l}
            </span>
          ))}
        </div>
      </footer>
    </>
  );
}