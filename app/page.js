"use client";
import { useState, useEffect, useRef } from "react";

// ── CONSTANTS ────────────────────────────────────────────────────────────────

const BUILD_TYPES = [
  { id: "website", label: "Website", icon: "⬡", desc: "Full multi-section site" },
  { id: "landing", label: "Landing Page", icon: "◈", desc: "High-converting funnel" },
  { id: "chatbot", label: "AI Chatbot", icon: "◎", desc: "Intelligent chat widget" },
];

const STYLE_PRESETS = {
  Luxury: "dark rich background, gold or platinum accents, elegant serif fonts, sophisticated spacing, premium feel",
  Minimal: "ultra-clean white space, monochrome palette, thin typography, no clutter, zen aesthetic",
  Modern: "glassmorphism, vibrant gradients, bold typography, dynamic animations, cutting-edge UI",
  Bold: "high contrast, strong colors, oversized headlines, energetic layout, powerful visual impact",
};

const SMART_QUESTIONS = [
  {
    id: "style", question: "Choose your style", subtext: "Pick a visual direction",
    options: [
      { id: "Luxury", label: "Luxury", icon: "◆", desc: "Elegant & premium" },
      { id: "Minimal", label: "Minimal", icon: "○", desc: "Clean & focused" },
      { id: "Modern", label: "Modern", icon: "◈", desc: "Bold & dynamic" },
      { id: "Bold", label: "Bold", icon: "⬡", desc: "Strong & impactful" },
    ],
  },
  {
    id: "audience", question: "Who is your target audience?", subtext: "Target audience",
    options: [
      { id: "Business professionals", label: "Business", icon: "◇", desc: "B2B & corporate" },
      { id: "Luxury clients", label: "Luxury clients", icon: "◆", desc: "High-end market" },
      { id: "General public", label: "General", icon: "◎", desc: "Mass market" },
      { id: "Young creatives", label: "Creatives", icon: "⊹", desc: "Teens & designers" },
    ],
  },
  {
    id: "goal", question: "What is your primary goal?", subtext: "Primary goal",
    options: [
      { id: "Generate leads", label: "Lead gen", icon: "◈", desc: "Collect contacts" },
      { id: "Drive sales", label: "Sales", icon: "◇", desc: "Convert buyers" },
      { id: "Showcase portfolio", label: "Showcase", icon: "⬡", desc: "Display work" },
      { id: "Build brand awareness", label: "Brand", icon: "○", desc: "Grow presence" },
    ],
  },
];

const EXAMPLES = {
  website: [
    "A luxury real estate agency with hero, listings, and contact form",
    "A modern restaurant site with menu, gallery, and reservations",
    "A fitness studio with classes, trainers, and membership plans",
    "A law firm homepage with practice areas and team profiles",
  ],
  landing: [
    "A SaaS dashboard tool with pricing and testimonials",
    "A beauty salon booking page with services and pricing",
    "A fitness app landing page with before/after and pricing tiers",
    "A startup product launch page with waitlist signup",
  ],
  chatbot: [
    "A customer support chatbot for an e-commerce clothing store",
    "A booking assistant chatbot for a luxury hotel",
    "A lead generation chatbot for a real estate agency",
    "A tech support bot for a SaaS productivity app",
  ],
};

const SHOWCASE = [
  { label: "Real Estate", color: "#22c55e" },
  { label: "SaaS", color: "#16a34a" },
  { label: "Restaurant", color: "#4ade80" },
  { label: "E-commerce", color: "#22c55e" },
  { label: "Portfolio", color: "#16a34a" },
  { label: "Healthcare", color: "#4ade80" },
  { label: "Fitness", color: "#22c55e" },
  { label: "Education", color: "#16a34a" },
];

const PRICING = [
  {
    name: "Starter", emoji: "🆓", price: "$0", period: "Forever",
    desc: "Get started for free",
    features: ["1 Website Build", "1 Landing Page", "Mobile Responsive", "Preview Mode", "EVIX Branding"],
    cta: "Start Free", highlight: false, yearlyNote: null,
  },
  {
    name: "Pro", emoji: "🚀", price: "$39", period: "/month",
    desc: "For creators & freelancers",
    features: ["10 Website Builds / Month", "25 Landing Pages / Month", "Publish to Live URL", "Custom Domains", "Premium Components", "AI Content Generation", "Priority Support"],
    cta: "Get Pro", highlight: true, yearlyNote: "$348/year · Save $120",
  },
  {
    name: "Agency", emoji: "👑", price: "$149", period: "/month",
    desc: "For teams & agencies",
    features: ["Unlimited Website Builds", "Unlimited Landing Pages", "Unlimited Publishing", "Team Workspace (5 Seats)", "White Label Solution", "API Access", "Dedicated Support"],
    cta: "Get Agency", highlight: false, yearlyNote: "$1,428/year · Save $360",
  },
];

const NAV_SERVICES = [
  { label: "Website", desc: "Full multi-section sites", icon: "⬡", color: "#22c55e", badge: "Most Popular", price: "From $199" },
  { label: "Landing Pages", desc: "High-converting funnels", icon: "◈", color: "#16a34a", badge: null, price: "From $99" },
  { label: "AI Chatbots", desc: "Intelligent chat widgets", icon: "◎", color: "#4ade80", badge: null, price: "From $59/mo" },
];

const QUICK_START_TYPES = [
  { id: "clinic", label: "Clinic", desc: "Professional healthcare website with booking" },
  { id: "barber", label: "Barber", desc: "Modern barbershop website" },
  { id: "gym", label: "Gym", desc: "Fitness website with scheduling" },
  { id: "restaurant", label: "Restaurant", desc: "Restaurant website with ordering" },
  { id: "ecommerce", label: "Store", desc: "E-commerce store with payments" },
];

const CAREER_POSITIONS = [
  { id: "frontend", label: "Frontend Engineer", dept: "Engineering", type: "Full-time · Remote" },
  { id: "ai", label: "AI/ML Engineer", dept: "Engineering", type: "Full-time · Remote" },
  { id: "design", label: "Product Designer", dept: "Design", type: "Full-time · Remote" },
  { id: "growth", label: "Growth Marketer", dept: "Marketing", type: "Full-time · Remote" },
  { id: "support", label: "Customer Success", dept: "Operations", type: "Full-time · Remote" },
];

const FEATURES = [
  { number: "01", title: "Complete HTML/CSS/JS", desc: "Full single-file output with clean, semantic structure. Animations, components, and responsive layout included.", stat: "100%", statLabel: "single file" },
  { number: "02", title: "World-class Design", desc: "Modern UI patterns with glassmorphism, gradients, smooth transitions, and Google Fonts — pixel-perfect.", stat: "50+", statLabel: "components" },
  { number: "03", title: "AI Chatbot Engine", desc: "Real chatbot widgets powered by live AI. Contextual responses and beautiful chat UI out of the box.", stat: "Live", statLabel: "responses" },
  { number: "04", title: "One-click Download", desc: "Your entire site in a single HTML file. Host anywhere. No dependencies, no build step needed.", stat: "0", statLabel: "dependencies" },
  { number: "05", title: "Live Preview", desc: "See your site render instantly in the split editor. Edit code live and watch changes update in real time.", stat: "<1s", statLabel: "render time" },
  { number: "06", title: "Multiple Build Types", desc: "Websites, landing pages, AI chatbots — each with specialized prompts tuned for the best output.", stat: "3", statLabel: "build modes" },
];

const IMPROVE_SUGGESTIONS = [
  "Make it more modern and sleek",
  "Add a pricing section",
  "Make the design more luxury",
  "Add animations and micro-interactions",
  "Make it more minimalist",
  "Add a testimonials section",
  "Improve the hero section",
  "Make the color palette bolder",
];

// ── CAREERS MODAL ─────────────────────────────────────────────────────────────
function CareersModal({ onClose, isDark, t }) {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", linkedin: "", portfolio: "", why: "", cv: null });
  const [submitted, setSubmitted] = useState(false);
  const [cvName, setCvName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setFormData(p => ({ ...p, cv: file })); setCvName(file.name); }
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.why.trim() || !formData.cv) return;
    setSubmitted(true);
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.why.trim() && formData.cv;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 700, background: "rgba(0,0,0,.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", animation: "fadeIn .2s ease" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "#000000", border: "1px solid rgba(34,197,94,.25)", borderRadius: 20, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 100px rgba(0,0,0,.9)", animation: "modalIn .25s ease" }}>
        <div style={{ padding: "28px 28px 20px", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f4ff", letterSpacing: "-.025em", marginBottom: 6 }}>Join the Evix Team</h2>
            <p style={{ fontSize: 13.5, color: "rgba(226,232,248,.4)", lineHeight: 1.6 }}>We're building the future of AI web creation. Come build it with us.</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(226,232,248,.5)", fontSize: 18, flexShrink: 0 }}>×</button>
        </div>
        {submitted ? (
          <div style={{ padding: "48px 28px", textAlign: "center" }}>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f1f4ff", marginBottom: 8, letterSpacing: "-.025em" }}>Application Sent!</h3>
            <p style={{ fontSize: 14, color: "rgba(226,232,248,.4)", lineHeight: 1.7, maxWidth: 360, margin: "0 auto 24px" }}>Thanks for applying to Evix! We'll review your application and get back to you within 5 business days.</p>
            <button onClick={onClose} style={{ padding: "11px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Close</button>
          </div>
        ) : !selectedPosition ? (
          <div style={{ padding: "20px 28px 28px" }}>
            <p style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(226,232,248,.25)", marginBottom: 16 }}>Open Positions</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CAREER_POSITIONS.map(pos => (
                <div key={pos.id} onClick={() => setSelectedPosition(pos)}
                  style={{ padding: "16px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,.07)", background: "rgba(255,255,255,.025)", cursor: "pointer", transition: "all .18s", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.4)"; e.currentTarget.style.background = "rgba(34,197,94,.07)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; e.currentTarget.style.background = "rgba(255,255,255,.025)"; }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f4ff", marginBottom: 4 }}>{pos.label}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#4ade80", background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 100, padding: "2px 8px" }}>{pos.dept}</span>
                      <span style={{ fontSize: 11, color: "rgba(226,232,248,.35)" }}>{pos.type}</span>
                    </div>
                  </div>
                  <span style={{ color: "rgba(34,197,94,.6)", fontSize: 18 }}>→</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 10, background: "rgba(74,222,128,.06)", border: "1px solid rgba(74,222,128,.15)" }}>
              <p style={{ fontSize: 12.5, color: "rgba(74,222,128,.6)", lineHeight: 1.6 }}>Don't see your role? Send a general application and tell us how you can contribute to Evix.</p>
              <button onClick={() => setSelectedPosition({ id: "general", label: "General Application", dept: "Any", type: "Full-time · Remote" })}
                style={{ marginTop: 10, padding: "7px 14px", borderRadius: 7, border: "1px solid rgba(74,222,128,.3)", background: "rgba(74,222,128,.1)", color: "#4ade80", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Apply Anyway →</button>
            </div>
          </div>
        ) : (
          <div style={{ padding: "20px 28px 28px" }}>
            <button onClick={() => setSelectedPosition(null)} style={{ background: "transparent", border: "none", color: "rgba(226,232,248,.4)", fontSize: 13, cursor: "pointer", fontFamily: "Inter,sans-serif", marginBottom: 20, display: "flex", alignItems: "center", gap: 5 }}>← Back to positions</button>
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", marginBottom: 22 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#4ade80" }}>{selectedPosition.label}</p>
              <p style={{ fontSize: 11.5, color: "rgba(74,222,128,.5)", marginTop: 2 }}>{selectedPosition.dept} · {selectedPosition.type}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "name", label: "Full Name", placeholder: "Your full name", required: true, type: "text" },
                { key: "email", label: "Email Address", placeholder: "your@email.com", required: true, type: "email" },
                { key: "phone", label: "Phone Number", placeholder: "+1 (555) 000-0000", required: false, type: "tel" },
                { key: "linkedin", label: "LinkedIn Profile", placeholder: "https://linkedin.com/in/...", required: false, type: "url" },
                { key: "portfolio", label: "Portfolio / GitHub", placeholder: "https://...", required: false, type: "url" },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(226,232,248,.45)", marginBottom: 6, letterSpacing: ".03em" }}>
                    {field.label} {field.required && <span style={{ color: "#f87171" }}>*</span>}
                  </label>
                  <input type={field.type} placeholder={field.placeholder} value={formData[field.key]}
                    onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", color: "#e2e8f8", fontSize: 14, fontFamily: "Inter,sans-serif", outline: "none", transition: "border-color .2s" }}
                    onFocus={e => e.target.style.borderColor = "rgba(34,197,94,.5)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"} />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(226,232,248,.45)", marginBottom: 6 }}>
                  Why do you want to join Evix? <span style={{ color: "#f87171" }}>*</span>
                </label>
                <textarea placeholder="Tell us about yourself, your experience, and why you're excited about Evix..." rows={4}
                  value={formData.why} onChange={e => setFormData(p => ({ ...p, why: e.target.value }))}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", color: "#e2e8f8", fontSize: 14, fontFamily: "Inter,sans-serif", outline: "none", resize: "none", lineHeight: 1.6, transition: "border-color .2s" }}
                  onFocus={e => e.target.style.borderColor = "rgba(34,197,94,.5)"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "rgba(226,232,248,.45)", marginBottom: 6 }}>Upload Your CV <span style={{ color: "#f87171" }}>*</span></label>
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: "none" }} />
                <div onClick={() => fileInputRef.current?.click()}
                  style={{ padding: "20px", borderRadius: 10, border: `2px dashed ${cvName ? "rgba(34,197,94,.55)" : "rgba(255,255,255,.1)"}`, background: cvName ? "rgba(34,197,94,.06)" : "rgba(255,255,255,.02)", cursor: "pointer", textAlign: "center", transition: "all .2s" }}
                  onMouseEnter={e => { if (!cvName) { e.currentTarget.style.borderColor = "rgba(34,197,94,.35)"; e.currentTarget.style.background = "rgba(34,197,94,.04)"; } }}
                  onMouseLeave={e => { if (!cvName) { e.currentTarget.style.borderColor = "rgba(255,255,255,.1)"; e.currentTarget.style.background = "rgba(255,255,255,.02)"; } }}>
                  {cvName ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>{cvName}</p>
                        <p style={{ fontSize: 11, color: "rgba(74,222,128,.5)" }}>Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: 13.5, color: "rgba(226,232,248,.4)", marginBottom: 4 }}>Click to upload your CV</p>
                      <p style={{ fontSize: 11, color: "rgba(226,232,248,.2)" }}>PDF, DOC, DOCX — max 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={() => setSelectedPosition(null)} style={{ flex: 1, padding: 12, borderRadius: 9, border: "1px solid rgba(255,255,255,.07)", background: "transparent", color: "rgba(226,232,248,.4)", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Cancel</button>
              <button onClick={handleSubmit} disabled={!isFormValid}
                style={{ flex: 2, padding: 12, borderRadius: 9, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: isFormValid ? "pointer" : "not-allowed", fontFamily: "Inter,sans-serif", opacity: isFormValid ? 1 : 0.35, transition: "opacity .2s" }}>
                Submit Application →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── QUICK START DROPDOWN ──────────────────────────────────────────────────────
function QuickStartDropdown({ isDark, t, onSelect, onClose }) {
  return (
    <div style={{ position: "absolute", top: "calc(100% + 10px)", left: 0, minWidth: 260, borderRadius: 14, padding: 8, backdropFilter: "blur(28px)", animation: "dropIn .16s ease", zIndex: 200, boxShadow: "0 20px 60px rgba(0,0,0,.35)", background: isDark ? "rgba(0,0,0,.97)" : "rgba(250,255,250,.97)", border: `1px solid ${t.navBorder}` }}>
      <p style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: isDark ? "rgba(226,232,248,.25)" : "rgba(10,26,14,.35)", padding: "4px 10px 8px" }}>Choose a category</p>
      {QUICK_START_TYPES.map(qs => (
        <div key={qs.id} onClick={() => { onSelect(qs.id); onClose(); }}
          style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 10px", borderRadius: 9, cursor: "pointer", transition: "background .13s" }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(34,197,94,.1)" : "rgba(34,197,94,.06)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#4ade80" }}>{qs.label.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 1 }}>{qs.label}</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>{qs.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── LOGO ──────────────────────────────────────────────────────────────────────
function EvixLogoFull({ height = 140, spinning = false }) {
  return <img src="/LOGOSS.png" alt="Evix" style={{ height, width: "auto", display: "block", maxWidth: "100%", animation: spinning ? "logoSpin 8s linear infinite" : undefined }} />;
}
function EvixLogoSymbol({ size = 70 }) {
  return <img src="/LOGOSS.png" alt="Evix" style={{ height: size, width: size, display: "block", maxWidth: size * 1.1, objectFit: "contain", objectPosition: "left center" }} />;
}

// ── IMPROVE MODAL ─────────────────────────────────────────────────────────────
function ImproveModal({ onImprove, onClose, isDark }) {
  const [customImprove, setCustomImprove] = useState("");
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,.75)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn .2s ease" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: isDark ? "#0d1022" : "#fff", border: "1px solid rgba(34,197,94,.25)", borderRadius: 18, padding: 28, maxWidth: 460, width: "90%", boxShadow: "0 24px 80px rgba(0,0,0,.7)", animation: "modalIn .25s ease" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: isDark ? "#f1f4ff" : "#071a0b", marginBottom: 6, letterSpacing: "-.025em" }}>Improve your site</h3>
          <p style={{ fontSize: 13, color: isDark ? "rgba(226,232,248,.35)" : "rgba(10,26,14,.5)" }}>Tell AI what to change, or pick a quick suggestion.</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {IMPROVE_SUGGESTIONS.map(s => (
            <button key={s} onClick={() => onImprove(s)}
              style={{ padding: "6px 12px", borderRadius: 100, border: "1px solid rgba(34,197,94,.25)", background: "rgba(34,197,94,.07)", color: isDark ? "rgba(134,239,172,.7)" : "#16a34a", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.55)"; e.currentTarget.style.background = "rgba(34,197,94,.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.25)"; e.currentTarget.style.background = "rgba(34,197,94,.07)"; }}>{s}</button>
          ))}
        </div>
        <textarea value={customImprove} onChange={e => setCustomImprove(e.target.value)}
          placeholder="Or describe exactly what to change…" rows={3}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: `1px solid ${isDark ? "rgba(255,255,255,.08)" : "rgba(34,197,94,.18)"}`, background: isDark ? "rgba(255,255,255,.03)" : "#f8fdf8", color: isDark ? "#e2e8f8" : "#071a0b", fontSize: 13.5, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.6, marginBottom: 16 }} />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 9, border: `1px solid ${isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.2)"}`, background: "transparent", color: isDark ? "rgba(226,232,248,.45)" : "rgba(10,26,14,.5)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button onClick={() => customImprove.trim() && onImprove(customImprove)} disabled={!customImprove.trim()}
            style={{ flex: 2, padding: 11, borderRadius: 9, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: customImprove.trim() ? 1 : 0.35 }}>✨ Apply</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [activeType, setActiveType] = useState("website");
  const [scrolled, setScrolled] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [openMenu, setOpenMenu] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showCareersModal, setShowCareersModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", message: "" });
  const [inquirySent, setInquirySent] = useState(false);
  const [billingYearly, setBillingYearly] = useState(false);
  const [mode, setMode] = useState("quick");
  const [proStep, setProStep] = useState(0);
  const [proAnswers, setProAnswers] = useState({});
  const [proComplete, setProComplete] = useState(false);

  // ── BUILDER STATE ──────────────────────────────────────────────────────────
  const [builderActive, setBuilderActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [generationStatus, setGenerationStatus] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [builderTab, setBuilderTab] = useState("preview");
  const [copySuccess, setCopySuccess] = useState(false);
  const [improveHistory, setImproveHistory] = useState([]);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [builderError, setBuilderError] = useState("");
  const [outputLines, setOutputLines] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const textareaRef = useRef(null);
  const menuRef = useRef(null);
  const builderRef = useRef(null);

  // ── SCROLL ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setShowInquiryModal(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── PROGRESS BAR ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isGenerating) {
      setGenerationProgress(100);
      const t = setTimeout(() => setGenerationProgress(0), 600);
      return () => clearTimeout(t);
    }
    setGenerationProgress(0);
    const steps = [
      { target: 10, delay: 400 },
      { target: 28, delay: 1500 },
      { target: 48, delay: 4000 },
      { target: 65, delay: 9000 },
      { target: 80, delay: 18000 },
      { target: 92, delay: 30000 },
    ];
    const timers = steps.map(s => setTimeout(() => setGenerationProgress(s.target), s.delay));
    return () => timers.forEach(clearTimeout);
  }, [isGenerating]);

  // ── HELPERS ───────────────────────────────────────────────────────────────
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setCharCount(e.target.value.length);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; }
  };

  const buildEnrichedPrompt = (basePrompt) => {
    if (mode === "quick" || !proComplete) return basePrompt;
    const style = proAnswers.style || "";
    const audience = proAnswers.audience || "";
    const goal = proAnswers.goal || "";
    const styleDesc = STYLE_PRESETS[style] || "";
    return `[STYLE: ${styleDesc}] [AUDIENCE: ${audience}] [GOAL: ${goal}] ${basePrompt}`;
  };

  const handleExample = (ex) => {
    setPrompt(ex); setCharCount(ex.length);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 160) + "px"; }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleBuild();
  };

  const handleProAnswer = (questionId, answerId) => {
    const newAnswers = { ...proAnswers, [questionId]: answerId };
    setProAnswers(newAnswers);
    if (proStep < SMART_QUESTIONS.length - 1) {
      setTimeout(() => setProStep(proStep + 1), 200);
    } else {
      setTimeout(() => setProComplete(true), 200);
    }
  };

  const resetPro = () => { setProStep(0); setProAnswers({}); setProComplete(false); };

  const handleInquirySubmit = () => {
    if (!inquiryForm.name.trim() || !inquiryForm.email.trim() || !inquiryForm.message.trim()) return;
    setInquirySent(true);
    setTimeout(() => { setShowInquiryModal(false); setInquirySent(false); setInquiryForm({ name: "", email: "", message: "" }); }, 2500);
  };

  const handleQuickStart = (typeId) => {
    const quickPrompts = {
      clinic: "A professional healthcare clinic website with services, doctors profiles, appointment booking, and contact info",
      barber: "A modern barbershop website with services menu, gallery, booking system, and team profiles",
      gym: "A fitness gym website with membership plans, class schedule, trainers, and a motivational hero",
      restaurant: "A restaurant website with full menu, photo gallery, online reservations, and location info",
      ecommerce: "An e-commerce store with product listings, featured items, shopping cart, and checkout",
    };
    const p = quickPrompts[typeId] || `A professional ${typeId} website`;
    setPrompt(p);
    setCharCount(p.length);
    setOpenMenu(null);
    setTimeout(() => handleGenerate(p, "website"), 100);
  };

  // ── CORE BUILD ────────────────────────────────────────────────────────────
  const handleBuild = () => {
    if (!prompt.trim() || isGenerating) return;
    const finalPrompt = buildEnrichedPrompt(prompt.trim());
    handleGenerate(finalPrompt, activeType);
  };

  // ── MAIN GENERATE (no recursion — uses a loop internally) ─────────────────
  const handleGenerate = async (customPrompt, customType) => {
    const p = (customPrompt !== undefined ? customPrompt : buildEnrichedPrompt(prompt.trim())).trim();
    const tp = customType !== undefined ? customType : activeType;
    if (!p || isGenerating) return;

    // Activate builder & scroll BEFORE generating
    setBuilderActive(true);
    setIsGenerating(true);
    setBuilderError("");
    setGeneratedHtml("");
    setOutputLines(null);
    setRetryCount(0);
    setGenerationStatus("Evix is crafting your design…");

    // Wait a tick so builderRef mounts, then scroll
    await new Promise(r => setTimeout(r, 50));
    builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    let html = "";
    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        if (attempt > 1) {
          setRetryCount(attempt - 1);
          setGenerationStatus(`Expanding output (pass ${attempt}/3)…`);
        }

        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: p, type: tp }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generation failed");

        const candidate = data.html || "";
        const lines = candidate.split("\n").length;
        const hasStyle = candidate.includes("<style");
        const hasClosed = candidate.includes("</html>");

        // Accept if valid, or on final attempt take what we have
        if ((hasStyle && hasClosed && lines >= 100) || attempt === 3) {
          html = candidate;
          break;
        }
        // Otherwise retry
      } catch (err) {
        lastError = err;
        if (attempt < 3) {
          await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }
    }

    setIsGenerating(false);
    setGenerationStatus("");

    if (html) {
      setGeneratedHtml(html);
      setOutputLines(html.split("\n").length);
      setBuilderTab("preview");
    } else {
      setBuilderError(
        lastError?.message || "Something went wrong. Please try again."
      );
    }
  };

  // ── IMPROVE ───────────────────────────────────────────────────────────────
  const handleImprove = async (instruction) => {
    setShowImproveModal(false);
    if (!generatedHtml || !instruction.trim() || isGenerating) return;

    setIsGenerating(true);
    setBuilderError("");
    setGenerationStatus(`Applying: "${instruction}"…`);
    setImproveHistory(prev => [...prev, instruction]);

    const improvePrompt = `You are improving an existing website. Here is the current HTML:\n\n${generatedHtml.slice(0, 6000)}...\n\nIMPROVEMENT: ${instruction}\n\nApply this improvement keeping all existing content. Output only the full improved HTML.`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: improvePrompt, type: activeType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setGeneratedHtml(data.html);
      setOutputLines(data.html.split("\n").length);
      setBuilderTab("preview");
    } catch (err) {
      setBuilderError("Improvement failed. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationStatus("");
    }
  };

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `evix-${activeType}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!generatedHtml) return;
    await navigator.clipboard.writeText(generatedHtml);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const currentExamples = EXAMPLES[activeType] || EXAMPLES.website;
  const currentQuestion = SMART_QUESTIONS[proStep];
  const sizeKb = generatedHtml ? (generatedHtml.length / 1024).toFixed(1) : null;

  // ── THEME ─────────────────────────────────────────────────────────────────
  const t = isDark ? {
    bg: "#000000", nav: "rgba(0,0,0,.94)", navBorder: "rgba(255,255,255,.05)",
    text: "#e2e8f8", textMuted: "rgba(226,232,248,.4)", textDim: "rgba(226,232,248,.18)",
    surface: "rgba(255,255,255,.022)", surfaceBorder: "rgba(255,255,255,.055)",
    inputBg: "rgba(255,255,255,.035)", inputBorder: "rgba(255,255,255,.09)",
    footerBorder: "rgba(255,255,255,.05)", heroTitle: "#f1f4ff",
    featureTitle: "#f1f4ff", pricingTitle: "#f1f4ff", ctaTitle: "#f1f4ff",
    builderBg: "#080b14", builderBorder: "rgba(255,255,255,.06)",
    builderSidebar: "rgba(255,255,255,.01)",
    sectionLabel: "rgba(226,232,248,.22)",
    chip: "rgba(226,232,248,.38)", chipBorder: "rgba(255,255,255,.07)",
    textareaBg: "rgba(255,255,255,.032)", textareaColor: "#e2e8f8",
    codeBg: "rgba(0,0,0,.35)",
  } : {
    bg: "#f5f6f5", nav: "rgba(245,246,245,.94)", navBorder: "rgba(34,197,94,.12)",
    text: "#0a1a0e", textMuted: "rgba(10,26,14,.55)", textDim: "rgba(10,26,14,.32)",
    surface: "rgba(34,197,94,.04)", surfaceBorder: "rgba(34,197,94,.12)",
    inputBg: "rgba(255,255,255,.9)", inputBorder: "rgba(34,197,94,.18)",
    footerBorder: "rgba(34,197,94,.12)", heroTitle: "#071a0b",
    featureTitle: "#071a0b", pricingTitle: "#071a0b", ctaTitle: "#071a0b",
    builderBg: "#f0f4f0", builderBorder: "rgba(34,197,94,.15)",
    builderSidebar: "rgba(34,197,94,.02)",
    sectionLabel: "rgba(10,26,14,.35)",
    chip: "rgba(10,26,14,.45)", chipBorder: "rgba(34,197,94,.2)",
    textareaBg: "rgba(255,255,255,.9)", textareaColor: "#071a0b",
    codeBg: "rgba(240,244,240,.8)",
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div suppressHydrationWarning style={{ background: t.bg, color: t.text, fontFamily: "'Inter', sans-serif", minHeight: "100vh", overflowX: "hidden", transition: "background .3s, color .3s" }}>
      <style suppressHydrationWarning>{`
        @font-face { font-family: 'Casa'; src: url('/fonts/Casa-Regular.otf') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,.4); border-radius: 3px; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes dropIn { from { opacity:0; transform:translateY(-8px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes logoGlow { 0%,100% { filter: drop-shadow(0 0 10px rgba(34,197,94,.8)) drop-shadow(0 0 26px rgba(22,163,74,.5)); } 50% { filter: drop-shadow(0 0 22px rgba(74,222,128,1)) drop-shadow(0 0 44px rgba(34,197,94,.75)); } }
        @keyframes logoSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes stepIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
        @keyframes checkPop { 0% { transform:scale(0); } 60% { transform:scale(1.2); } 100% { transform:scale(1); } }
        @keyframes modalIn { from { opacity:0; transform:scale(.96) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
        @keyframes builderSlideIn { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }

        .evix-logo-text { font-family: 'Casa', 'Bebas Neue', sans-serif !important; font-size: 22px; letter-spacing: .06em; background: linear-gradient(135deg, #4ade80, #22c55e, #16a34a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .nav-trigger { display: flex; align-items: center; gap: 5px; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: color .18s, background .18s; padding: 6px 10px; border-radius: 6px; border: none; background: transparent; font-family: 'Inter', sans-serif; }
        .nav-trigger svg { transition: transform .2s; }
        .nav-trigger.open svg { transform: rotate(180deg); }
        .dropdown { position: absolute; top: calc(100% + 10px); left: 0; min-width: 280px; border-radius: 14px; padding: 8px; backdrop-filter: blur(28px); animation: dropIn .16s ease; z-index: 200; box-shadow: 0 20px 60px rgba(0,0,0,.35); }
        .dropdown-item { display: flex; gap: 11px; align-items: center; padding: 10px 10px; border-radius: 9px; cursor: pointer; transition: background .13s; }
        .dropdown-item-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
        .dropdown-badge { display: inline-block; padding: 1px 7px; border-radius: 100px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; margin-left: 6px; }

        .type-btn { display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 8px; border: 1px solid; background: transparent; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .2s; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .example-chip { padding: 6px 14px; border-radius: 100px; border: 1px solid; background: transparent; font-size: 12px; cursor: pointer; transition: all .16s; font-family: 'Inter', sans-serif; white-space: nowrap; }
        .build-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 14px 24px; border-radius: 10px; border: none; background: linear-gradient(135deg, #16a34a, #22c55e); color: #fff; font-size: 15px; font-weight: 600; cursor: pointer; transition: all .22s; font-family: 'Inter', sans-serif; letter-spacing: -.01em; }
        .build-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(34,197,94,.5); }
        .build-btn:disabled { opacity: .35; cursor: not-allowed; }
        .agent-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px 24px; border-radius: 10px; border: 1px solid rgba(74,222,128,.4); background: rgba(74,222,128,.08); color: #4ade80; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .22s; font-family: 'Inter', sans-serif; letter-spacing: -.01em; }
        .agent-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(34,197,94,.3); background: rgba(74,222,128,.14); border-color: rgba(74,222,128,.6); }

        .pricing-card { border: 1px solid; border-radius: 16px; padding: 28px 24px; transition: all .25s; display: flex; flex-direction: column; }
        .pricing-card:hover { transform: translateY(-3px); }
        .pricing-cta { display: flex; align-items: center; justify-content: center; padding: 11px 20px; border-radius: 9px; border: 1px solid; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: all .2s; font-family: 'Inter',sans-serif; }
        .pricing-cta.primary { background: linear-gradient(135deg,#16a34a,#22c55e); border-color: transparent; color: #fff; }
        .pricing-cta.primary:hover { box-shadow: 0 6px 24px rgba(34,197,94,.4); }

        .marquee-track { display: flex; gap: 12px; animation: marquee 28s linear infinite; width: max-content; }
        .theme-toggle { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 9px; border: 1px solid; background: transparent; cursor: pointer; font-size: 17px; transition: all .2s; }
        .theme-toggle:hover { transform: scale(1.1) rotate(15deg); }
        .mode-toggle-btn { padding: 7px 16px; border-radius: 8px; border: 1px solid; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .18s; font-family: 'Inter',sans-serif; }
        .pro-option-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px 10px; border-radius: 10px; border: 1px solid; background: transparent; cursor: pointer; transition: all .18s; font-family: 'Inter',sans-serif; min-width: 90px; flex: 1; }
        .pro-option-btn:hover { border-color: rgba(34,197,94,.5); background: rgba(34,197,94,.08); }
        .pro-option-btn.selected { border-color: rgba(34,197,94,.65); background: rgba(34,197,94,.12); }

        .textarea-wrap textarea { width: 100%; min-height: 56px; max-height: 160px; padding: 16px; border-radius: 10px 10px 0 0; border: 1px solid; border-bottom: none; font-size: 15px; font-family: 'Inter', sans-serif; font-weight: 400; outline: none; resize: none; line-height: 1.6; transition: border-color .2s, background .3s, color .3s; }
        .textarea-bottom { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 0 0 10px 10px; border: 1px solid; border-top: 1px solid; gap: 10px; }
        .hero-logo-wrap { animation: logoGlow 3s ease-in-out infinite; }
        .biz-nav-btn { display: flex; align-items: center; gap: 5px; font-size: 13.5px; font-weight: 600; cursor: pointer; padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(34,197,94,.3); background: rgba(34,197,94,.07); color: #4ade80; transition: all .18s; font-family: 'Inter',sans-serif; }
        .biz-nav-btn:hover { border-color: rgba(34,197,94,.55); background: rgba(34,197,94,.14); }

        .modal-overlay { position: fixed; inset: 0; z-index: 600; background: rgba(0,0,0,.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; animation: fadeIn .2s ease; }
        .modal-box { background: #000000; border: 1px solid rgba(34,197,94,.25); border-radius: 18px; padding: 32px; max-width: 460px; width: 90%; box-shadow: 0 24px 80px rgba(0,0,0,.8); animation: modalIn .25s ease; }
        .inquiry-input { width: 100%; padding: 11px 14px; border-radius: 9px; border: 1px solid rgba(255,255,255,.09); background: rgba(255,255,255,.035); color: #e2e8f8; font-size: 14px; font-family: 'Inter',sans-serif; outline: none; transition: border-color .2s; }
        .inquiry-input:focus { border-color: rgba(34,197,94,.5); }
        .inquiry-input::placeholder { color: rgba(226,232,248,.2); }

        .builder-section { animation: builderSlideIn .4s ease; }
        .builder-tab-btn { padding: 6px 14px; border-radius: 6px; border: none; background: transparent; font-size: 12.5px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .16s; }
        .builder-action-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 7px; border: 1px solid; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .16s; white-space: nowrap; }
        .builder-chip { padding: 5px 12px; border-radius: 7px; font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .16s; border: 1px solid; white-space: nowrap; }
        .spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .65s linear infinite; flex-shrink: 0; }
        .progress-bar-wrap { height: 3px; border-radius: 3px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: linear-gradient(90deg,#16a34a,#4ade80,#16a34a); background-size: 200% 100%; transition: width .5s ease; animation: shimmer 2s linear infinite; }

        .feat-card-3d { position: relative; border-radius: 16px; cursor: default; transition: transform .35s cubic-bezier(.22,.68,0,1.2), box-shadow .35s ease; transform-style: preserve-3d; perspective: 800px; }
        .feat-card-3d:hover { transform: translateY(-8px) rotateX(3deg) rotateY(-1deg) scale(1.02); }
        .feat-card-3d-inner { position: relative; border-radius: 16px; padding: 28px 26px 24px; height: 100%; overflow: hidden; border: 1px solid rgba(255,255,255,.07); background: linear-gradient(145deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.015) 100%); transition: border-color .3s, box-shadow .3s; }
        .feat-card-3d:hover .feat-card-3d-inner { border-color: rgba(34,197,94,.35); box-shadow: 0 0 0 1px rgba(34,197,94,.1), 0 20px 60px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.08); }
        .feat-card-3d-glow { position: absolute; inset: -1px; border-radius: 17px; background: radial-gradient(ellipse at 30% 20%, rgba(34,197,94,.12) 0%, transparent 60%); pointer-events: none; opacity: 0; transition: opacity .3s; }
        .feat-card-3d:hover .feat-card-3d-glow { opacity: 1; }
        .feat-card-3d-noise { position: absolute; inset: 0; border-radius: 16px; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E"); opacity: .4; pointer-events: none; }
        .feat-number { font-size: 10px; letter-spacing: .2em; text-transform: uppercase; font-weight: 700; color: rgba(34,197,94,.5); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .feat-number::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(34,197,94,.3), transparent); max-width: 40px; }
        .feat-stat-num { font-size: 38px; font-weight: 800; letter-spacing: -.04em; line-height: 1; background: linear-gradient(135deg, #f1f4ff 30%, rgba(74,222,128,.85) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .feat-stat-label { font-size: 11px; color: rgba(226,232,248,.3); font-weight: 500; letter-spacing: .04em; }
        .feat-bottom-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, rgba(34,197,94,.5), transparent); border-radius: 0 0 16px 16px; opacity: 0; transition: opacity .3s; }
        .feat-card-3d:hover .feat-bottom-bar { opacity: 1; }

        .login-btn { background: transparent; border: none; font-size: 13.5px; font-weight: 500; cursor: pointer; font-family: 'Inter',sans-serif; padding: 6px 12px; border-radius: 7px; transition: color .18s; white-space: nowrap; }

        @media (max-width: 768px) {
          .hero-title { font-size: 32px !important; white-space: normal !important; }
          .type-btns { flex-wrap: wrap; }
          .nav-mid { display: none !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
          .nav-right-actions { gap: 4px !important; }
          .login-btn { font-size: 12px !important; padding: 6px 8px !important; }
          .start-building-btn { font-size: 12px !important; padding: 7px 12px !important; }
          .theme-toggle { width: 30px !important; height: 30px !important; font-size: 14px !important; }
          .builder-desktop-actions { display: none !important; }
          .builder-mobile-actions { display: flex !important; }
          .builder-cols { flex-direction: column !important; }
          .builder-sidebar { display: none !important; }
          .builder-preview-wrap { height: 60vh !important; }
        }
        @media (max-width: 400px) {
          .login-btn { display: none !important; }
        }
      `}</style>

      {/* ── MODALS ────────────────────────────────────────────────────────── */}
      {showInquiryModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowInquiryModal(false); }}>
          <div className="modal-box">
            {!inquirySent ? (
              <>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f4ff", marginBottom: 6, letterSpacing: "-.025em" }}>Send an Inquiry</h3>
                  <p style={{ fontSize: 13.5, color: "rgba(226,232,248,.4)", lineHeight: 1.6 }}>Interested in partnering with Evix? We'll get back to you within 24 hours.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  <input className="inquiry-input" placeholder="Your Name *" value={inquiryForm.name} onChange={e => setInquiryForm(p => ({ ...p, name: e.target.value }))} />
                  <input className="inquiry-input" placeholder="Email Address *" type="email" value={inquiryForm.email} onChange={e => setInquiryForm(p => ({ ...p, email: e.target.value }))} />
                  <textarea className="inquiry-input" placeholder="Tell us about your project *" rows={4} style={{ resize: "none" }} value={inquiryForm.message} onChange={e => setInquiryForm(p => ({ ...p, message: e.target.value }))} />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowInquiryModal(false)} style={{ flex: 1, padding: 11, borderRadius: 9, border: "1px solid rgba(255,255,255,.07)", background: "transparent", color: "rgba(226,232,248,.45)", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Cancel</button>
                  <button onClick={handleInquirySubmit} disabled={!inquiryForm.name.trim() || !inquiryForm.email.trim() || !inquiryForm.message.trim()}
                    style={{ flex: 2, padding: 11, borderRadius: 9, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif", opacity: (!inquiryForm.name.trim() || !inquiryForm.email.trim() || !inquiryForm.message.trim()) ? 0.4 : 1 }}>Send Inquiry</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f4ff", marginBottom: 8 }}>Inquiry Sent!</h3>
                <p style={{ fontSize: 14, color: "rgba(226,232,248,.4)", lineHeight: 1.6 }}>Thanks for reaching out. We'll get back within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {showCareersModal && <CareersModal onClose={() => setShowCareersModal(false)} isDark={isDark} t={t} />}
      {showImproveModal && <ImproveModal onImprove={handleImprove} onClose={() => setShowImproveModal(false)} isDark={isDark} />}

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? t.nav : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${t.navBorder}` : "1px solid transparent", transition: "all .3s" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "11px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }} ref={menuRef}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => { setBuilderActive(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <EvixLogoSymbol size={90} />
            <span className="evix-logo-text">Evix</span>
          </div>

          <div className="nav-mid" style={{ display: "flex", alignItems: "center", gap: 2, position: "relative" }}>
            <div style={{ position: "relative" }}>
              <button className={`nav-trigger ${openMenu === "services" ? "open" : ""}`}
                style={{ color: openMenu === "services" ? t.text : t.textMuted, background: openMenu === "services" ? (isDark ? "rgba(255,255,255,.05)" : "rgba(34,197,94,.07)") : "transparent" }}
                onClick={() => setOpenMenu(openMenu === "services" ? null : "services")}>
                Services
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2.5 4L5.5 7L8.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {openMenu === "services" && (
                <div className="dropdown" style={{ background: isDark ? "rgba(0,0,0,.97)" : "rgba(250,255,250,.97)", border: `1px solid ${t.navBorder}` }}>
                  {NAV_SERVICES.map(s => (
                    <div key={s.label} className="dropdown-item"
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? "rgba(34,197,94,.1)" : "rgba(34,197,94,.06)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      onClick={() => setOpenMenu(null)}>
                      <div className="dropdown-item-icon" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 1 }}>
                          {s.label}
                          {s.badge && <span className="dropdown-badge" style={{ background: `${s.color}20`, color: s.color }}>{s.badge}</span>}
                        </div>
                        <div style={{ fontSize: 11, color: t.textMuted }}>{s.desc}</div>
                        <div style={{ fontSize: 10.5, fontWeight: 600, color: s.color, marginTop: 3 }}>{s.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="nav-trigger" style={{ color: t.textMuted }}
              onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.background = isDark ? "rgba(255,255,255,.05)" : "rgba(34,197,94,.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = "transparent"; }}
              onClick={() => document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" })}>Pricing</button>

            <div style={{ position: "relative" }}>
              <button className={`biz-nav-btn ${openMenu === "quickstart" ? "open" : ""}`} onClick={() => setOpenMenu(openMenu === "quickstart" ? null : "quickstart")}>
                Quick Start
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2.5 4L5.5 7L8.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {openMenu === "quickstart" && <QuickStartDropdown isDark={isDark} t={t} onSelect={handleQuickStart} onClose={() => setOpenMenu(null)} />}
            </div>

            <button className="nav-trigger" style={{ color: t.textMuted }}
              onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.background = isDark ? "rgba(255,255,255,.05)" : "rgba(34,197,94,.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = "transparent"; }}
              onClick={() => setShowInquiryModal(true)}>Partnership</button>

            <button className="nav-trigger" style={{ color: t.textMuted }}
              onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.background = isDark ? "rgba(255,255,255,.05)" : "rgba(34,197,94,.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = "transparent"; }}
              onClick={() => setShowCareersModal(true)}>Careers</button>
          </div>

          <div className="nav-right-actions" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button className="theme-toggle" style={{ borderColor: isDark ? "rgba(255,255,255,.1)" : "rgba(34,197,94,.2)", color: isDark ? "#4ade80" : "#16a34a" }} onClick={() => setIsDark(!isDark)}>
              {isDark ? "☀" : "◑"}
            </button>
            <button className="login-btn" style={{ color: t.textMuted }}
              onMouseEnter={e => e.currentTarget.style.color = t.text}
              onMouseLeave={e => e.currentTarget.style.color = t.textMuted}>Log in</button>
            <button className="start-building-btn"
              onClick={() => { document.getElementById("hero-prompt")?.scrollIntoView({ behavior: "smooth" }); document.getElementById("hero-prompt")?.focus(); }}
              style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all .2s", boxShadow: "0 0 12px rgba(34,197,94,.3)", whiteSpace: "nowrap" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 22px rgba(34,197,94,.55)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 12px rgba(34,197,94,.3)"; e.currentTarget.style.transform = "translateY(0)"; }}>Start Building →</button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: isDark ? "radial-gradient(circle,rgba(22,163,74,.1) 0%,transparent 65%)" : "radial-gradient(circle,rgba(22,163,74,.06) 0%,transparent 65%)", top: "0%", left: "-5%", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", width: 550, height: 550, borderRadius: "50%", background: isDark ? "radial-gradient(circle,rgba(34,197,94,.09) 0%,transparent 65%)" : "radial-gradient(circle,rgba(34,197,94,.05) 0%,transparent 65%)", top: "15%", right: "0%", filter: "blur(70px)" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${isDark ? "rgba(34,197,94,.05)" : "rgba(34,197,94,.06)"} 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 820, width: "100%", textAlign: "center" }}>
          <div className="hero-logo-wrap" style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
            <EvixLogoFull height={180} spinning={true} />
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 100, border: "1px solid rgba(34,197,94,.28)", background: "rgba(34,197,94,.07)", marginBottom: 28, animation: "fadeUp .8s ease forwards" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
            <span style={{ fontSize: 11.5, color: "rgba(74,222,128,.8)", letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 500 }}>AI Web Builder · Build anything, instantly</span>
          </div>

          <h1 className="hero-title" style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.06, letterSpacing: "-.045em", color: t.heroTitle, marginBottom: 20, animation: "fadeUp .9s .05s ease both", whiteSpace: "nowrap" }}>
            Don't imagine it.{" "}
            <span style={{ background: "linear-gradient(135deg, #4ade80, #22c55e, #16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Build It.</span>
          </h1>

          <p style={{ fontSize: 17, color: t.textMuted, lineHeight: 1.8, maxWidth: 480, margin: "0 auto 32px", fontWeight: 300, animation: "fadeUp .9s .12s ease both" }}>
            Describe your idea. Get a complete, production-ready website, landing page, or AI chatbot — right here.
          </p>

          <div className="type-btns" style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20, animation: "fadeUp .9s .18s ease both" }}>
            {BUILD_TYPES.map(tp => (
              <button key={tp.id} className="type-btn"
                style={{ borderColor: activeType === tp.id ? "rgba(34,197,94,.6)" : (isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.15)"), color: activeType === tp.id ? "#4ade80" : t.textMuted, background: activeType === tp.id ? "rgba(34,197,94,.12)" : "transparent" }}
                onClick={() => { setActiveType(tp.id); setPrompt(""); setCharCount(0); resetPro(); }}>
                <span style={{ fontSize: 14 }}>{tp.icon}</span>{tp.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20, animation: "fadeUp .9s .2s ease both" }}>
            <button className="mode-toggle-btn"
              style={{ borderColor: mode === "quick" ? "rgba(34,197,94,.55)" : (isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.15)"), color: mode === "quick" ? "#4ade80" : t.textMuted, background: mode === "quick" ? "rgba(34,197,94,.1)" : "transparent" }}
              onClick={() => { setMode("quick"); resetPro(); }}>Build Instantly</button>
            <button className="mode-toggle-btn"
              style={{ borderColor: mode === "pro" ? "rgba(74,222,128,.55)" : (isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.15)"), color: mode === "pro" ? "#4ade80" : t.textMuted, background: mode === "pro" ? "rgba(74,222,128,.1)" : "transparent" }}
              onClick={() => { setMode("pro"); resetPro(); }}>Use AI Setup</button>
          </div>

          {mode === "pro" && !proComplete && (
            <div style={{ animation: "stepIn .3s ease", marginBottom: 20, background: isDark ? "rgba(255,255,255,.025)" : "rgba(34,197,94,.04)", border: `1px solid ${isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.12)"}`, borderRadius: 14, padding: "22px 20px" }}>
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 18 }}>
                {SMART_QUESTIONS.map((_, i) => (
                  <div key={i} style={{ width: i <= proStep ? 24 : 6, height: 6, borderRadius: 3, background: i < proStep ? "#22c55e" : i === proStep ? "linear-gradient(90deg,#22c55e,#4ade80)" : (isDark ? "rgba(255,255,255,.1)" : "rgba(34,197,94,.15)"), transition: "all .3s" }} />
                ))}
              </div>
              <p style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: t.textDim, marginBottom: 8 }}>{currentQuestion.subtext}</p>
              <p style={{ fontSize: 17, fontWeight: 600, color: t.text, marginBottom: 18, letterSpacing: "-.02em" }}>{currentQuestion.question}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {currentQuestion.options.map(opt => (
                  <button key={opt.id} className={`pro-option-btn ${proAnswers[currentQuestion.id] === opt.id ? "selected" : ""}`}
                    style={{ borderColor: proAnswers[currentQuestion.id] === opt.id ? "rgba(34,197,94,.65)" : (isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.15)"), color: proAnswers[currentQuestion.id] === opt.id ? "#4ade80" : t.textMuted, background: proAnswers[currentQuestion.id] === opt.id ? "rgba(34,197,94,.12)" : "transparent" }}
                    onClick={() => handleProAnswer(currentQuestion.id, opt.id)}>
                    <span style={{ fontSize: 18, color: "#22c55e" }}>{opt.icon}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{opt.label}</span>
                    <span style={{ fontSize: 10.5, color: t.textDim }}>{opt.desc}</span>
                  </button>
                ))}
              </div>
              {proStep > 0 && (
                <button onClick={() => setProStep(proStep - 1)} style={{ marginTop: 14, background: "transparent", border: "none", color: t.textDim, fontSize: 12, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>← Back</button>
              )}
            </div>
          )}

          {mode === "pro" && proComplete && (
            <div style={{ animation: "stepIn .3s ease", marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {Object.entries(proAnswers).map(([key, val]) => (
                <span key={key} style={{ padding: "5px 12px", borderRadius: 100, border: "1px solid rgba(34,197,94,.4)", background: "rgba(34,197,94,.1)", fontSize: 12, color: "#4ade80", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ animation: "checkPop .3s ease" }}>✓</span> {val}
                </span>
              ))}
              <button onClick={resetPro} style={{ padding: "5px 12px", borderRadius: 100, border: "1px solid rgba(255,255,255,.07)", background: "transparent", fontSize: 12, color: t.textDim, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Reset</button>
            </div>
          )}

          {(mode === "quick" || proComplete) && (
            <div style={{ animation: "fadeUp .9s .22s ease both", marginBottom: 16 }}>
              <div className="textarea-wrap">
                <textarea
                  id="hero-prompt"
                  ref={textareaRef}
                  value={prompt}
                  onChange={handlePromptChange}
                  onKeyDown={handleKeyDown}
                  placeholder={mode === "pro" && proComplete
                    ? `Great choices! Now describe your ${BUILD_TYPES.find(tt => tt.id === activeType)?.label.toLowerCase()} in detail…`
                    : `What do you want to build? Describe your website idea…`}
                  rows={2}
                  style={{ background: t.inputBg, borderColor: t.inputBorder, color: t.text }}
                />
                <div className="textarea-bottom" style={{ background: isDark ? "rgba(255,255,255,.025)" : "rgba(255,255,255,.6)", borderColor: t.inputBorder }}>
                  <span style={{ fontSize: 11, color: t.textDim }}>
                    {charCount > 0 ? `${charCount} chars · ` : ""}<span style={{ opacity: .6 }}>⌘+Enter to build</span>
                    {mode === "pro" && proComplete && <span style={{ color: "#22c55e", marginLeft: 6 }}>· AI-enhanced ✦</span>}
                  </span>
                  <button className="build-btn" disabled={!prompt.trim() || isGenerating} onClick={handleBuild}
                    style={{ width: "auto", padding: "9px 22px", fontSize: 13.5, borderRadius: 8 }}>
                    {isGenerating ? (
                      <><div className="spinner-sm" />Building…</>
                    ) : (
                      activeType === "chatbot" ? "Build Chatbot →" : "Build →"
                    )}
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="agent-btn" onClick={() => handleQuickStart("restaurant")}>
                  Use Quick Start
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 100, background: "rgba(34,197,94,.2)", border: "1px solid rgba(34,197,94,.35)", color: "#4ade80", marginLeft: 4 }}>New</span>
                </button>
              </div>
            </div>
          )}

          {(mode === "quick" || proComplete) && (
            <p style={{ fontSize: 11.5, color: t.textDim, marginBottom: 18, animation: "fadeUp .9s .24s ease both" }}>No credit card required</p>
          )}

          {(mode === "quick" || proComplete) && (
            <div style={{ animation: "fadeUp .9s .28s ease both" }}>
              <p style={{ fontSize: 11, color: t.textDim, marginBottom: 10, letterSpacing: ".08em", textTransform: "uppercase" }}>Try an example</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center" }}>
                {currentExamples.slice(0, 4).map(ex => (
                  <button key={ex} className="example-chip"
                    style={{ borderColor: isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.15)", color: t.textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.5)"; e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.background = "rgba(34,197,94,.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.15)"; e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = "transparent"; }}
                    onClick={() => handleExample(ex)}>
                    {ex.length > 52 ? ex.slice(0, 52) + "…" : ex}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── INLINE BUILDER ────────────────────────────────────────────────── */}
      {builderActive && (
        <section ref={builderRef} className="builder-section" style={{ background: t.builderBg, borderTop: `1px solid ${t.builderBorder}`, borderBottom: `1px solid ${t.builderBorder}`, minHeight: "90vh" }}>

          {/* Topbar */}
          <div style={{ borderBottom: `1px solid ${t.builderBorder}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", background: isDark ? "rgba(8,11,20,.9)" : "rgba(240,244,240,.9)", backdropFilter: "blur(20px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setBuilderActive(false)}
                style={{ background: "transparent", border: `1px solid ${isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.2)"}`, borderRadius: 7, color: t.textMuted, cursor: "pointer", fontSize: 13, padding: "5px 10px", fontFamily: "inherit", transition: "all .18s" }}
                onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,.18)" : "rgba(34,197,94,.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.2)"; }}>← Back</button>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: t.text }}>Evix Builder</span>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.25)", color: "#4ade80" }}>AI</span>
              {improveHistory.length > 0 && (
                <span style={{ fontSize: 11, color: isDark ? "rgba(134,239,172,.4)" : "#16a34a", background: isDark ? "rgba(34,197,94,.08)" : "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.18)", borderRadius: 100, padding: "2px 8px" }}>
                  {improveHistory.length} improvement{improveHistory.length > 1 ? "s" : ""} applied
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {sizeKb && <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 100, background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)", color: "#4ade80" }}>{sizeKb} KB</span>}
              {outputLines && <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 100, background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)", color: "#4ade80" }}>{outputLines} lines</span>}
              {generatedHtml && (
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="builder-tab-btn" onClick={() => setBuilderTab("preview")}
                    style={{ background: builderTab === "preview" ? "rgba(34,197,94,.14)" : "transparent", color: builderTab === "preview" ? "#86efac" : t.textMuted, border: builderTab === "preview" ? "1px solid rgba(34,197,94,.28)" : "none" }}>Preview</button>
                  <button className="builder-tab-btn" onClick={() => setBuilderTab("code")}
                    style={{ background: builderTab === "code" ? "rgba(34,197,94,.14)" : "transparent", color: builderTab === "code" ? "#86efac" : t.textMuted, border: builderTab === "code" ? "1px solid rgba(34,197,94,.28)" : "none" }}>Code</button>
                </div>
              )}
            </div>

            <div className="builder-desktop-actions" style={{ display: "flex", gap: 8 }}>
              {generatedHtml && (
                <>
                  <button className="builder-action-btn" onClick={handleCopy}
                    style={{ borderColor: isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.2)", background: isDark ? "rgba(255,255,255,.03)" : "rgba(34,197,94,.04)", color: t.textMuted }}>
                    {copySuccess ? "✓ Copied!" : "⎘ Copy HTML"}
                  </button>
                  <button className="builder-action-btn" onClick={() => setShowImproveModal(true)}
                    style={{ borderColor: "transparent", background: "linear-gradient(135deg,#15803d,#16a34a)", color: "#fff" }}>✨ Improve</button>
                  <button className="builder-action-btn" onClick={handleDownload}
                    style={{ borderColor: "transparent", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff" }}>↓ Download</button>
                </>
              )}
            </div>
          </div>

          {/* Mobile actions */}
          {generatedHtml && (
            <div className="builder-mobile-actions" style={{ display: "none", gap: 8, padding: "10px 16px", borderBottom: `1px solid ${t.builderBorder}`, overflowX: "auto" }}>
              <button className="builder-action-btn" onClick={handleCopy}
                style={{ borderColor: isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.2)", background: isDark ? "rgba(255,255,255,.03)" : "rgba(34,197,94,.04)", color: t.textMuted, flexShrink: 0 }}>
                {copySuccess ? "✓" : "⎘"} Copy
              </button>
              <button className="builder-action-btn" onClick={() => setShowImproveModal(true)}
                style={{ borderColor: "transparent", background: "rgba(34,197,94,.12)", color: "#4ade80", flexShrink: 0 }}>✨ Improve</button>
              <button className="builder-action-btn" onClick={handleDownload}
                style={{ borderColor: "transparent", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", flexShrink: 0 }}>↓ Download</button>
            </div>
          )}

          {/* Progress bar */}
          {isGenerating && (
            <div className="progress-bar-wrap" style={{ background: isDark ? "rgba(255,255,255,.05)" : "rgba(34,197,94,.08)" }}>
              <div className="progress-bar-fill" style={{ width: `${generationProgress}%` }} />
            </div>
          )}

          {/* Body */}
          <div className="builder-cols" style={{ display: "flex", minHeight: "80vh" }}>

            {/* Sidebar */}
            <div className="builder-sidebar" style={{ width: 280, flexShrink: 0, borderRight: `1px solid ${t.builderBorder}`, background: t.builderSidebar, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16 }}>

              <div>
                <p style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: t.sectionLabel, marginBottom: 8, fontWeight: 600 }}>Build Type</p>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {BUILD_TYPES.slice(0, 2).map(tp => (
                    <button key={tp.id} className="builder-chip"
                      style={{ borderColor: activeType === tp.id ? "rgba(34,197,94,.55)" : t.chipBorder, color: activeType === tp.id ? "#4ade80" : t.chip, background: activeType === tp.id ? "rgba(34,197,94,.1)" : "transparent" }}
                      onClick={() => setActiveType(tp.id)}>{tp.icon} {tp.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: t.sectionLabel, marginBottom: 8, fontWeight: 600 }}>Description</p>
                <textarea
                  value={prompt}
                  onChange={e => { setPrompt(e.target.value); setCharCount(e.target.value.length); }}
                  onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleBuild(); }}
                  placeholder="Describe your website…"
                  rows={4}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${isDark ? "rgba(255,255,255,.08)" : "rgba(34,197,94,.18)"}`, background: t.textareaBg, color: t.textareaColor, fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.6 }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: t.textDim }}>⌘+Enter to generate</span>
                  <span style={{ fontSize: 10, color: charCount > 100 ? "#4ade80" : t.textDim }}>{charCount} chars</span>
                </div>
              </div>

              <button onClick={handleBuild} disabled={!prompt.trim() || isGenerating}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "11px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: (!prompt.trim() || isGenerating) ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: (!prompt.trim() || isGenerating) ? 0.5 : 1 }}>
                {isGenerating ? (
                  <><div className="spinner-sm" />{generationStatus || "Generating…"}</>
                ) : (
                  generatedHtml ? "↺ Regenerate" : "✦ Generate"
                )}
              </button>

              {generatedHtml && !isGenerating && (
                <button onClick={() => setShowImproveModal(true)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "10px", borderRadius: 9, border: "1px solid rgba(34,197,94,.35)", background: "rgba(34,197,94,.08)", color: "#4ade80", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  ✨ Improve this site
                </button>
              )}

              {improveHistory.length > 0 && (
                <div>
                  <p style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: t.sectionLabel, marginBottom: 8, fontWeight: 600 }}>Applied</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {improveHistory.map((h, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 6, background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.14)" }}>
                        <span style={{ fontSize: 10, color: "#22c55e" }}>✓</span>
                        <span style={{ fontSize: 11, color: isDark ? "rgba(134,239,172,.5)" : "#16a34a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: t.sectionLabel, marginBottom: 8, fontWeight: 600 }}>Examples</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {currentExamples.slice(0, 4).map(ex => (
                    <button key={ex}
                      onClick={() => { setPrompt(ex); setCharCount(ex.length); }}
                      style={{ padding: "6px 10px", borderRadius: 7, border: `1px solid ${isDark ? "rgba(255,255,255,.055)" : "rgba(34,197,94,.15)"}`, background: "transparent", color: t.textMuted, fontSize: 11, cursor: "pointer", fontFamily: "inherit", textAlign: "left", lineHeight: 1.4 }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.4)"; e.currentTarget.style.color = isDark ? "#86efac" : "#16a34a"; e.currentTarget.style.background = "rgba(34,197,94,.07)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,.055)" : "rgba(34,197,94,.15)"; e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = "transparent"; }}>
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview pane */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

              {!generatedHtml && !isGenerating && !builderError && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 40, textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "rgba(34,197,94,.3)" }}>⬡</div>
                  <div>
                    <p style={{ fontSize: 15, color: t.textMuted, marginBottom: 6, fontWeight: 500 }}>Your site will appear here</p>
                    <p style={{ fontSize: 13, color: t.textDim, maxWidth: 280 }}>Add a description on the left and click Generate</p>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 20 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 64, height: 64, borderRadius: 18, background: "linear-gradient(135deg,#16a34a,#22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, animation: "pulse 2s ease-in-out infinite" }}>⬡</div>
                    <div style={{ position: "absolute", inset: -4, borderRadius: 22, border: "2px solid transparent", borderTopColor: "#4ade80", animation: "spin 1.5s linear infinite" }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 15, color: t.textMuted, marginBottom: 6, fontWeight: 500 }}>{generationStatus || "Building your site with Evix…"}</p>
                    <p style={{ fontSize: 12, color: t.textDim }}>{retryCount > 0 ? `Expanding output — pass ${retryCount + 1}/3` : "Building production-ready HTML…"}</p>
                  </div>
                  <div style={{ width: 200, height: 3, background: isDark ? "rgba(255,255,255,.06)" : "rgba(34,197,94,.1)", borderRadius: 10, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${generationProgress}%`, background: "linear-gradient(90deg,#16a34a,#4ade80)", borderRadius: 10, transition: "width .5s ease" }} />
                  </div>
                </div>
              )}

              {builderError && !isGenerating && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", gap: 12 }}>
                  <div style={{ background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 10, padding: "12px 16px", maxWidth: 440, textAlign: "center" }}>
                    <p style={{ fontSize: 13, color: "#f87171" }}>{builderError}</p>
                  </div>
                  <button onClick={handleBuild}
                    style={{ padding: "10px 28px", borderRadius: 9, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Try Again</button>
                </div>
              )}

              {generatedHtml && !isGenerating && (
                <div className="builder-preview-wrap" style={{ flex: 1, animation: "fadeIn .3s ease", height: "100%" }}>
                  {builderTab === "preview" ? (
                    <iframe srcDoc={generatedHtml} style={{ width: "100%", height: "100%", border: "none", background: "#fff", minHeight: "600px" }} sandbox="allow-scripts allow-same-origin allow-forms" title="Preview" />
                  ) : (
                    <div style={{ height: "100%", overflow: "auto", background: t.codeBg, position: "relative", minHeight: 400 }}>
                      <div style={{ position: "sticky", top: 0, padding: "8px 16px", background: isDark ? "rgba(8,11,20,.9)" : "rgba(240,244,240,.9)", borderBottom: `1px solid ${t.builderBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
                        <span style={{ fontSize: 11, color: t.textDim, fontFamily: "monospace" }}>HTML · {sizeKb} KB · {outputLines} lines</span>
                        <button onClick={handleCopy}
                          style={{ padding: "4px 10px", borderRadius: 7, border: `1px solid ${isDark ? "rgba(255,255,255,.07)" : "rgba(34,197,94,.2)"}`, background: isDark ? "rgba(255,255,255,.03)" : "rgba(34,197,94,.04)", color: t.textMuted, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                          {copySuccess ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                      <textarea readOnly value={generatedHtml}
                        style={{ fontFamily: "'Fira Code', monospace", fontSize: 11.5, lineHeight: 1.65, color: isDark ? "#4ade80" : "#16a34a", background: "transparent", border: "none", outline: "none", resize: "none", width: "100%", minHeight: "calc(100% - 36px)", padding: "16px 20px", whiteSpace: "pre" }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <div style={{ overflow: "hidden", padding: "18px 0", borderTop: `1px solid ${t.navBorder}`, borderBottom: `1px solid ${t.navBorder}`, background: isDark ? "rgba(255,255,255,.01)" : "rgba(34,197,94,.02)" }}>
        <div className="marquee-track">
          {[...SHOWCASE, ...SHOWCASE, ...SHOWCASE, ...SHOWCASE].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 16px", borderRadius: 100, border: `1px solid ${s.color}26`, background: `${s.color}07`, whiteSpace: "nowrap" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, opacity: .65 }} />
              <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px", perspective: "1200px" }}>
        <div style={{ marginBottom: 72, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(34,197,94,.55)", marginBottom: 14, fontWeight: 600 }}>What you get</p>
            <h2 style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-.045em", color: t.featureTitle, lineHeight: 1.05 }}>
              Built for<br />
              <span style={{ background: "linear-gradient(135deg, #f1f4ff 40%, rgba(74,222,128,.7) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>production.</span>
            </h2>
          </div>
          <p style={{ fontSize: 15, color: t.textMuted, lineHeight: 1.8, maxWidth: 320, fontWeight: 300 }}>Every output ships with everything your site needs. Clean code, stunning design, zero compromise.</p>
        </div>
        <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="feat-card-3d" style={{ animation: `fadeUp .7s ${i * 0.08}s ease both` }}>
              <div className="feat-card-3d-inner">
                <div className="feat-card-3d-noise" />
                <div className="feat-card-3d-glow" />
                <div className="feat-number">{f.number}</div>
                <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span className="feat-stat-num">{f.stat}</span>
                  <span className="feat-stat-label">{f.statLabel}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: t.featureTitle, marginBottom: 10, letterSpacing: "-.025em", lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.75, fontWeight: 300 }}>{f.desc}</p>
                <div className="feat-bottom-bar" />
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 24, justifyContent: "center" }}>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, rgba(34,197,94,.2))" }} />
          <span style={{ fontSize: 12, color: "rgba(34,197,94,.4)", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase" }}>Everything in one file</span>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, rgba(34,197,94,.2), transparent)" }} />
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing-section" style={{ maxWidth: 1040, margin: "0 auto", padding: "80px 24px 100px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: t.textDim, marginBottom: 12 }}>Simple pricing</p>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-.03em", color: t.pricingTitle, marginBottom: 12 }}>Start free. Scale when ready.</h2>
          <p style={{ fontSize: 15, color: t.textMuted, fontWeight: 300, marginBottom: 28 }}>No credit card required to get started.</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: !billingYearly ? "#4ade80" : t.textMuted, fontWeight: !billingYearly ? 600 : 400 }}>Monthly</span>
            <div onClick={() => setBillingYearly(!billingYearly)}
              style={{ width: 46, height: 26, borderRadius: 13, background: billingYearly ? "rgba(34,197,94,.4)" : isDark ? "rgba(255,255,255,.1)" : "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.3)", cursor: "pointer", position: "relative", transition: "background .25s" }}>
              <div style={{ position: "absolute", top: 3, left: billingYearly ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: billingYearly ? "#22c55e" : isDark ? "rgba(255,255,255,.4)" : "rgba(34,197,94,.4)", transition: "left .25s, background .25s" }} />
            </div>
            <span style={{ fontSize: 13, color: billingYearly ? "#4ade80" : t.textMuted, fontWeight: billingYearly ? 600 : 400 }}>
              Yearly
              <span style={{ marginLeft: 6, padding: "2px 7px", borderRadius: 100, background: "rgba(34,197,94,.15)", border: "1px solid rgba(34,197,94,.3)", fontSize: 10, color: "#4ade80", fontWeight: 700 }}>Save up to $360</span>
            </span>
          </div>
        </div>
        <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, maxWidth: 900, margin: "0 auto" }}>
          {PRICING.map(plan => (
            <div key={plan.name} className="pricing-card"
              style={{ background: plan.highlight ? "rgba(34,197,94,.06)" : t.surface, borderColor: plan.highlight ? "rgba(34,197,94,.5)" : t.surfaceBorder, boxShadow: plan.highlight ? "0 0 40px rgba(34,197,94,.12)" : "none", position: "relative" }}>
              {plan.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", display: "inline-flex", alignItems: "center", padding: "3px 12px", borderRadius: 100, background: "linear-gradient(135deg,#16a34a,#22c55e)", whiteSpace: "nowrap" }}>
                  <span style={{ fontSize: 10, color: "#fff", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Most Popular</span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{plan.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: plan.highlight ? "#4ade80" : t.text }}>{plan.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 4 }}>
                <span style={{ fontSize: 38, fontWeight: 800, color: t.pricingTitle, letterSpacing: "-.04em" }}>{plan.price}</span>
                <span style={{ fontSize: 13, color: t.textMuted }}>{plan.period}</span>
              </div>
              {billingYearly && plan.yearlyNote && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 11.5, color: "#4ade80", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>{plan.yearlyNote}</span>
                </div>
              )}
              <p style={{ fontSize: 12.5, color: t.textMuted, marginBottom: 20, lineHeight: 1.5 }}>{plan.desc}</p>
              <div style={{ height: 1, background: plan.highlight ? "rgba(34,197,94,.2)" : isDark ? "rgba(255,255,255,.06)" : "rgba(34,197,94,.1)", marginBottom: 16 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                    <span style={{ color: "#22c55e", fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: t.textMuted, lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button className={`pricing-cta ${plan.highlight ? "primary" : ""}`}
                style={!plan.highlight ? { borderColor: t.surfaceBorder, background: t.surface, color: t.textMuted } : {}}
                onMouseEnter={!plan.highlight ? e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.4)"; e.currentTarget.style.color = "#4ade80"; e.currentTarget.style.background = "rgba(34,197,94,.08)"; } : undefined}
                onMouseLeave={!plan.highlight ? e => { e.currentTarget.style.borderColor = t.surfaceBorder; e.currentTarget.style.color = t.textMuted; e.currentTarget.style.background = t.surface; } : undefined}
                onClick={handleBuild}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${t.footerBorder}`, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1160, margin: "0 auto", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EvixLogoSymbol size={30} />
          <span className="evix-logo-text" style={{ fontSize: 17 }}>Evix</span>
        </div>
        <span style={{ fontSize: 11.5, color: t.textDim }}>© 2025 Evix. All rights reserved.</span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Status"].map(l => (
            <span key={l} style={{ fontSize: 12, color: t.textDim, cursor: "pointer", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#4ade80"}
              onMouseLeave={e => e.currentTarget.style.color = t.textDim}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}