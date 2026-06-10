"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function EvixLogoSymbol({ size = 28 }) {
  return (
    <img src="/LOGOSS.png" alt="Evix" style={{ height: size, width: "auto", display: "block", objectFit: "contain", objectPosition: "left center" }} />
  );
}

const BUSINESS_TYPES = [
  { id: "clinic",      label: "Clinic",       icon: "◇", desc: "Medical & health services" },
  { id: "barber",      label: "Barber",        icon: "◈", desc: "Barbershop & hair salon" },
  { id: "gym",         label: "Gym",           icon: "⬡", desc: "Fitness & sports center" },
  { id: "restaurant",  label: "Restaurant",    icon: "◆", desc: "Food & dining" },
  { id: "ecommerce",   label: "E-commerce",    icon: "○", desc: "Online store & products" },
  { id: "other",       label: "Other",         icon: "◎", desc: "Something else" },
];

const AI_GOALS = [
  { id: "answer",   label: "Answer customers",   icon: "◈", desc: "Smart FAQ & support" },
  { id: "book",     label: "Book appointments",  icon: "◇", desc: "Scheduling system" },
  { id: "sell",     label: "Sell products",      icon: "⬡", desc: "E-commerce flow" },
  { id: "leads",    label: "Generate leads",     icon: "○", desc: "Collect contacts" },
];

const STEPS = [
  { id: "type",      title: "Business Type",     sub: "What type of business are you?" },
  { id: "goal",      title: "AI Goal",           sub: "What do you want the AI to do?" },
  { id: "info",      title: "Business Info",     sub: "Tell us about your business" },
  { id: "whatsapp",  title: "WhatsApp",          sub: "Do you want to connect WhatsApp?" },
  { id: "website",   title: "Your Website",      sub: "Do you have an existing website?" },
];

const PRICING_PLANS = [
  {
    name: "Basic", price: "$19", period: "/month",
    desc: "Chatbot only",
    features: ["AI Chatbot widget", "Custom system prompt", "Website embed script", "Basic analytics"],
    cta: "Get Basic", highlight: false,
    color: "#22c55e",
  },
  {
    name: "Pro", price: "$49", period: "/month",
    desc: "Chatbot + Booking + WhatsApp",
    features: ["Everything in Basic", "Booking system", "WhatsApp integration", "Priority support", "Advanced AI"],
    cta: "Get Pro", highlight: true,
    color: "#16a34a",
  },
  {
    name: "Premium", price: "$99", period: "/month",
    desc: "Full system + Website",
    features: ["Everything in Pro", "Full business website", "Custom domain", "White-label", "Dedicated manager"],
    cta: "Get Premium", highlight: false,
    color: "#4ade80",
  },
];

function BusinessPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    type: null,
    goal: [],
    info: { name: "", location: "", hours: "", services: "" },
    whatsapp: { want: null, number: "" },
    website: { has: null, url: "" },
  });
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildStatus, setBuildStatus] = useState("");
  const [result, setResult] = useState(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState("chatbot");

  useEffect(() => {
    const t = searchParams.get("type");
    if (t) {
      setAnswers(a => ({ ...a, type: t }));
      setStep(1);
    }
  }, [searchParams]);

  const canNext = () => {
    if (step === 0) return !!answers.type;
    if (step === 1) return answers.goal.length > 0;
    if (step === 2) return !!answers.info.name.trim();
    if (step === 3) return answers.whatsapp.want !== null;
    if (step === 4) return answers.website.has !== null;
    return true;
  };

  const toggleGoal = (id) => {
    setAnswers(a => ({
      ...a,
      goal: a.goal.includes(id) ? a.goal.filter(g => g !== id) : [...a.goal, id],
    }));
  };

  const buildSystemPrompt = () => {
    const biz = BUSINESS_TYPES.find(b => b.id === answers.type);
    const goals = answers.goal.map(g => AI_GOALS.find(ag => ag.id === g)?.label).filter(Boolean).join(", ");
    return `You are an AI assistant for ${answers.info.name || biz?.label || "a business"}.
Business type: ${biz?.label}
Location: ${answers.info.location || "Not specified"}
Working hours: ${answers.info.hours || "Not specified"}
Services: ${answers.info.services || "Not specified"}
Your job is to: ${goals || "assist customers"}
Be short, friendly, and professional. Help customers with questions, bookings, and information about the business.`;
  };

  const buildSitePrompt = () => {
    const biz = BUSINESS_TYPES.find(b => b.id === answers.type);
    const goalLabels = answers.goal.map(g => AI_GOALS.find(ag => ag.id === g)?.label).filter(Boolean);
    const hasBooking = answers.goal.includes("book");
    const hasChatbot = true;
    const whatsappNum = answers.whatsapp.want && answers.whatsapp.number ? answers.whatsapp.number.replace(/\D/g, "") : null;

    return `Create a modern, professional ${biz?.label || "business"} website.

Business Name: ${answers.info.name || biz?.label}
${answers.info.location ? `Location: ${answers.info.location}` : ""}
${answers.info.hours ? `Working Hours: ${answers.info.hours}` : ""}
${answers.info.services ? `Services: ${answers.info.services}` : ""}
Type: ${biz?.label}
Goals: ${goalLabels.join(", ")}

Features to include:
${whatsappNum ? `- Floating WhatsApp button (bottom-right) linking to wa.me/${whatsappNum}` : ""}
${hasBooking ? `- Booking/appointment section with form (Name, Phone, Date, Time, Service)` : ""}
${hasChatbot ? `- Floating AI chatbot widget with pre-programmed responses. Welcome: "Hi! How can I help you today?"` : ""}
- Beautiful hero section with clear call-to-action
- Services/offerings section with icons
- About section with trust signals
- Contact information
- Professional footer

Design: Clean, modern, mobile-responsive. Color palette that fits a ${biz?.label} brand.
Make it professional and ready to use immediately.`;
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    setBuildProgress(0);
    setBuildStatus("Analyzing your business…");

    const progressSteps = [
      { target: 20, delay: 500, msg: "Designing your layout…" },
      { target: 45, delay: 2000, msg: "Writing your content…" },
      { target: 68, delay: 5000, msg: "Adding features…" },
      { target: 85, delay: 10000, msg: "Final polish…" },
      { target: 95, delay: 20000, msg: "Almost ready…" },
    ];
    const timers = progressSteps.map(s => setTimeout(() => { setBuildProgress(s.target); setBuildStatus(s.msg); }, s.delay));

    try {
      const prompt = buildSitePrompt();
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: "website" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Build failed");

      timers.forEach(clearTimeout);
      setBuildProgress(100);
      setBuildStatus("Done!");

      setTimeout(() => {
        router.push(`/builder?prompt=${encodeURIComponent(prompt)}&type=website&agentHtml=${encodeURIComponent(data.html)}&mode=business`);
      }, 500);
    } catch (err) {
      timers.forEach(clearTimeout);
      setIsBuilding(false);
      setBuildProgress(0);
      setBuildStatus("");
      alert("Something went wrong. Please try again.");
    }
  };

  const handleShowResult = () => {
    setResult(true);
  };

  const biz = BUSINESS_TYPES.find(b => b.id === answers.type);
  const systemPrompt = answers.type ? buildSystemPrompt() : "";
  const embedScript = `<script src="https://evix.ai/widget.js" data-business="${answers.info.name || ""}" data-type="${answers.type || ""}"></script>`;

  // ─── RESULT SCREEN ────────────────────────────────────────────────
  if (result) {
    return (
      <div style={{ background: "#04060f", minHeight: "100vh", color: "#e8eaf6", fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
          @keyframes pulse { 0%,100%{opacity:.4}50%{opacity:1} }
          .result-tab { padding: 8px 18px; border-radius: 8px; border: 1px solid; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .18s; font-family: 'Inter',sans-serif; }
          .evix-biz-logo { font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: .06em; background: linear-gradient(135deg,#22c55e,#4ade80,#86efac); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .copy-btn { padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(34,197,94,.3); background: rgba(34,197,94,.07); color: #4ade80; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter',sans-serif; transition: all .18s; }
          .copy-btn:hover { border-color: rgba(34,197,94,.55); background: rgba(34,197,94,.14); }
          .pricing-card-biz { border: 1px solid; border-radius: 16px; padding: 24px 20px; transition: all .25s; display: flex; flex-direction: column; }
          .pricing-card-biz:hover { transform: translateY(-3px); }
        `}</style>

        <nav style={{ padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", gap: 12, background: "rgba(4,6,15,.96)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
          <button onClick={() => setResult(null)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,.07)", borderRadius: 8, color: "rgba(232,234,246,.4)", cursor: "pointer", fontSize: 13, padding: "6px 12px", fontFamily: "Inter,sans-serif" }}>← Back</button>
          <EvixLogoSymbol size={26} />
          <span className="evix-biz-logo">Evix</span>
          <span style={{ color: "rgba(255,255,255,.15)", fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, color: "rgba(232,234,246,.4)" }}>AI Business</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, border: "1px solid rgba(34,197,94,.2)", background: "rgba(34,197,94,.06)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600, letterSpacing: ".06em" }}>READY</span>
          </div>
        </nav>

        <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 100px" }}>
          <div style={{ textAlign: "center", marginBottom: 48, animation: "fadeUp .4s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#f1f4ff", letterSpacing: "-.04em", marginBottom: 8 }}>Your AI Business is Ready</h1>
            <p style={{ fontSize: 15, color: "rgba(232,234,246,.4)" }}>Here's everything we built for <strong style={{ color: "#4ade80" }}>{answers.info.name || biz?.label}</strong></p>
          </div>

          {/* Preview tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" }}>
            {[
              { id: "chatbot", label: "AI Chatbot" },
              { id: "booking", label: "Booking System" },
              { id: "integration", label: "Integration" },
            ].map(tab => (
              <button key={tab.id} className="result-tab"
                style={{ borderColor: activePreviewTab === tab.id ? "rgba(34,197,94,.55)" : "rgba(255,255,255,.07)", color: activePreviewTab === tab.id ? "#4ade80" : "rgba(232,234,246,.4)", background: activePreviewTab === tab.id ? "rgba(34,197,94,.1)" : "transparent" }}
                onClick={() => setActivePreviewTab(tab.id)}
              >{tab.label}</button>
            ))}
          </div>

          {/* CHATBOT PREVIEW */}
          {activePreviewTab === "chatbot" && (
            <div style={{ border: "1px solid rgba(34,197,94,.2)", borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,.015)", animation: "fadeUp .3s ease" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#16a34a,#22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>◈</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f4ff" }}>{answers.info.name || biz?.label} AI</p>
                  <p style={{ fontSize: 11, color: "#4ade80" }}>● Online</p>
                </div>
              </div>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 12, minHeight: 220 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#16a34a,#22c55e)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>◈</div>
                  <div style={{ background: "rgba(255,255,255,.06)", borderRadius: "0 10px 10px 10px", padding: "10px 14px", maxWidth: "80%" }}>
                    <p style={{ fontSize: 13.5, color: "#e8eaf6", lineHeight: 1.6 }}>Hi! I'm the {answers.info.name || biz?.label} AI assistant. How can I help you today?</p>
                  </div>
                </div>
                {answers.info.services && (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexDirection: "row-reverse" }}>
                    <div style={{ background: "rgba(34,197,94,.2)", borderRadius: "10px 0 10px 10px", padding: "10px 14px", maxWidth: "80%" }}>
                      <p style={{ fontSize: 13.5, color: "#e8eaf6" }}>What services do you offer?</p>
                    </div>
                  </div>
                )}
                {answers.info.services && (
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#16a34a,#22c55e)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>◈</div>
                    <div style={{ background: "rgba(255,255,255,.06)", borderRadius: "0 10px 10px 10px", padding: "10px 14px", maxWidth: "80%" }}>
                      <p style={{ fontSize: 13.5, color: "#e8eaf6", lineHeight: 1.6 }}>We offer: {answers.info.services}. Would you like to book an appointment?</p>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,.05)" }}>
                <div style={{ background: "rgba(255,255,255,.04)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "rgba(232,234,246,.3)" }}>Type a message…</span>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#16a34a,#22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>→</div>
                </div>
              </div>
            </div>
          )}

          {/* BOOKING PREVIEW */}
          {activePreviewTab === "booking" && (
            <div style={{ border: "1px solid rgba(34,197,94,.2)", borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,.015)", animation: "fadeUp .3s ease" }}>
              <div style={{ padding: "24px 24px 0" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f4ff", marginBottom: 6 }}>Book an Appointment</h3>
                <p style={{ fontSize: 13, color: "rgba(232,234,246,.4)", marginBottom: 24 }}>{answers.info.name || biz?.label}{answers.info.location ? ` · ${answers.info.location}` : ""}</p>
              </div>
              <div style={{ padding: "0 24px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {["Full Name", "Phone Number", "Service", "Preferred Date"].map(field => (
                  <div key={field}>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "rgba(232,234,246,.4)", marginBottom: 6, letterSpacing: ".05em", textTransform: "uppercase" }}>{field}</label>
                    <div style={{ padding: "10px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,.09)", background: "rgba(255,255,255,.03)", fontSize: 13.5, color: "rgba(232,234,246,.25)" }}>
                      {field === "Service" && answers.info.services ? answers.info.services.split(",")[0].trim() : "—"}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "0 24px 24px" }}>
                <div style={{ padding: "14px", borderRadius: 10, background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.18)", marginBottom: 14 }}>
                  <p style={{ fontSize: 12, color: "#4ade80" }}>Select available time</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                    {["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"].map(t => (
                      <span key={t} style={{ padding: "4px 12px", borderRadius: 100, border: "1px solid rgba(34,197,94,.3)", background: "rgba(34,197,94,.08)", fontSize: 12, color: "#86efac", cursor: "pointer" }}>{t}</span>
                    ))}
                  </div>
                </div>
                <button style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>Confirm Booking</button>
              </div>
            </div>
          )}

          {/* INTEGRATION */}
          {activePreviewTab === "integration" && (
            <div style={{ animation: "fadeUp .3s ease" }}>
              {answers.website.has === "yes" ? (
                <div style={{ border: "1px solid rgba(34,197,94,.2)", borderRadius: 16, padding: "24px", background: "rgba(34,197,94,.04)" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f4ff", marginBottom: 8 }}>Add to your website</h3>
                  <p style={{ fontSize: 13, color: "rgba(232,234,246,.45)", marginBottom: 16, lineHeight: 1.6 }}>Paste this script before the closing {"</body>"} tag of your website to add the AI chatbot and booking widget.</p>
                  <div style={{ background: "rgba(0,0,0,.4)", borderRadius: 10, padding: "16px", fontFamily: "monospace", fontSize: 12, color: "#4ade80", lineHeight: 1.8, marginBottom: 14, wordBreak: "break-all" }}>
                    {embedScript}
                  </div>
                  <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(embedScript); setCopiedScript(true); setTimeout(() => setCopiedScript(false), 2000); }}>
                    {copiedScript ? "✓ Copied!" : "Copy Script"}
                  </button>
                  {answers.website.url && (
                    <p style={{ fontSize: 12, color: "rgba(232,234,246,.3)", marginTop: 12 }}>Will be added to: {answers.website.url}</p>
                  )}
                </div>
              ) : (
                <div style={{ border: "1px solid rgba(34,197,94,.2)", borderRadius: 16, padding: "28px", background: "rgba(34,197,94,.04)", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>⬡</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f4ff", marginBottom: 8 }}>We'll build you a website</h3>
                  <p style={{ fontSize: 14, color: "rgba(232,234,246,.4)", marginBottom: 24, lineHeight: 1.7 }}>No website? No problem. Evix generates a complete, professional website for {answers.info.name || biz?.label} with your chatbot and booking system already embedded.</p>
                  <button
                    onClick={handleBuild}
                    disabled={isBuilding}
                    style={{ padding: "13px 32px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif", opacity: isBuilding ? 0.5 : 1 }}
                  >
                    {isBuilding ? "Building…" : "Generate My Website →"}
                  </button>
                </div>
              )}

              {answers.whatsapp.want === "yes" && answers.whatsapp.number && (
                <div style={{ marginTop: 16, border: "1px solid rgba(37,211,102,.2)", borderRadius: 14, padding: "20px", background: "rgba(37,211,102,.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 22 }}>💬</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#f1f4ff" }}>WhatsApp Connected</p>
                      <p style={{ fontSize: 12, color: "rgba(232,234,246,.4)" }}>{answers.whatsapp.number}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(232,234,246,.35)", lineHeight: 1.6 }}>A floating WhatsApp button will appear on your site linking customers directly to your WhatsApp.</p>
                </div>
              )}
            </div>
          )}

          {/* System Prompt */}
          <div style={{ marginTop: 24, border: "1px solid rgba(34,197,94,.2)", borderRadius: 14, padding: "20px", background: "rgba(34,197,94,.04)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#4ade80" }}>AI System Prompt</p>
              <button className="copy-btn"
                onClick={() => { navigator.clipboard.writeText(systemPrompt); }}>
                Copy Prompt
              </button>
            </div>
            <pre style={{ fontFamily: "monospace", fontSize: 11.5, color: "rgba(232,234,246,.55)", lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{systemPrompt}</pre>
          </div>

          {/* Build website CTA */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "rgba(232,234,246,.3)", marginBottom: 16 }}>Want a complete website with everything integrated?</p>
            <button
              onClick={handleBuild}
              disabled={isBuilding}
              style={{ padding: "14px 40px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e,#4ade80)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: isBuilding ? "not-allowed" : "pointer", fontFamily: "Inter,sans-serif", opacity: isBuilding ? 0.5 : 1 }}
            >
              {isBuilding ? `${buildStatus || "Building…"} ${buildProgress}%` : "Generate Full Website →"}
            </button>
          </div>

          {/* Pricing */}
          <div style={{ marginTop: 64 }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <p style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(232,234,246,.2)", marginBottom: 10 }}>Unlock more</p>
              <h2 style={{ fontSize: 28, fontWeight: 700, color: "#f1f4ff", letterSpacing: "-.03em" }}>Simple plans for every business</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {PRICING_PLANS.map(plan => (
                <div key={plan.name} className="pricing-card-biz"
                  style={{ background: plan.highlight ? "rgba(34,197,94,.07)" : "rgba(255,255,255,.02)", borderColor: plan.highlight ? "rgba(34,197,94,.45)" : "rgba(255,255,255,.055)", boxShadow: plan.highlight ? "0 0 32px rgba(34,197,94,.1)" : "none" }}
                >
                  {plan.highlight && (
                    <div style={{ display: "inline-flex", padding: "2px 9px", borderRadius: 100, background: "rgba(34,197,94,.2)", border: "1px solid rgba(34,197,94,.35)", marginBottom: 14, alignSelf: "flex-start" }}>
                      <span style={{ fontSize: 10, color: "#4ade80", fontWeight: 700, letterSpacing: ".08em" }}>MOST POPULAR</span>
                    </div>
                  )}
                  <span style={{ fontSize: 13, fontWeight: 600, color: plan.highlight ? "#4ade80" : "rgba(232,234,246,.5)" }}>{plan.name}</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3, margin: "6px 0 4px" }}>
                    <span style={{ fontSize: 32, fontWeight: 700, color: "#f1f4ff", letterSpacing: "-.04em" }}>{plan.price}</span>
                    <span style={{ fontSize: 12, color: "rgba(232,234,246,.4)" }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(232,234,246,.35)", marginBottom: 18 }}>{plan.desc}</p>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ color: plan.color, fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                        <span style={{ fontSize: 12.5, color: "rgba(232,234,246,.6)", lineHeight: 1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button style={{ padding: "10px", borderRadius: 8, border: plan.highlight ? "none" : "1px solid rgba(255,255,255,.08)", background: plan.highlight ? `linear-gradient(135deg,#16a34a,#22c55e)` : "transparent", color: plan.highlight ? "#fff" : "rgba(232,234,246,.4)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter,sans-serif" }}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── WIZARD ───────────────────────────────────────────────────────
  const currentStep = STEPS[step];

  return (
    <div style={{ background: "#04060f", minHeight: "100vh", color: "#e8eaf6", fontFamily: "'Inter', -apple-system, sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:.5; } 50% { opacity:1; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }

        .evix-biz-logo { font-family: 'Bebas Neue', sans-serif; font-size: 17px; letter-spacing: .06em; background: linear-gradient(135deg,#22c55e,#4ade80,#86efac); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .biz-card { background: rgba(255,255,255,.035); border: 1.5px solid rgba(255,255,255,.07); border-radius: 16px; padding: 20px 16px; cursor: pointer; transition: all .2s; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
        .biz-card:hover { border-color: rgba(34,197,94,.5); background: rgba(34,197,94,.07); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(34,197,94,.12); }
        .biz-card.selected { border-color: rgba(34,197,94,.8); background: rgba(34,197,94,.1); box-shadow: 0 0 28px rgba(34,197,94,.18); }

        .goal-card { border: 1.5px solid rgba(255,255,255,.07); border-radius: 12px; padding: 16px; cursor: pointer; transition: all .18s; background: rgba(255,255,255,.025); display: flex; align-items: center; gap: 12px; }
        .goal-card:hover { border-color: rgba(34,197,94,.4); background: rgba(34,197,94,.06); }
        .goal-card.selected { border-color: rgba(34,197,94,.65); background: rgba(34,197,94,.1); }

        .info-field { width: 100%; padding: 13px 15px; border-radius: 11px; border: 1.5px solid rgba(255,255,255,.08); background: rgba(255,255,255,.03); color: #e8eaf6; font-size: 14.5px; font-family: 'Inter', sans-serif; outline: none; transition: border-color .2s, box-shadow .2s; }
        .info-field:focus { border-color: rgba(34,197,94,.5); box-shadow: 0 0 0 3px rgba(34,197,94,.08); }
        .info-field::placeholder { color: rgba(232,234,246,.2); }

        .yn-btn { flex: 1; padding: 18px; border-radius: 14px; border: 1.5px solid rgba(255,255,255,.07); background: rgba(255,255,255,.025); color: rgba(232,234,246,.55); font-size: 15px; font-weight: 600; cursor: pointer; transition: all .18s; font-family: 'Inter',sans-serif; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .yn-btn:hover { border-color: rgba(34,197,94,.45); background: rgba(34,197,94,.07); }
        .yn-btn.selected { border-color: rgba(34,197,94,.7); background: rgba(34,197,94,.11); color: #f1f4ff; box-shadow: 0 0 20px rgba(34,197,94,.15); }

        .nav-btn-biz { padding: 12px 28px; border-radius: 11px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: all .18s; }
        .nav-btn-biz.primary { background: linear-gradient(135deg,#16a34a,#22c55e); color: #fff; }
        .nav-btn-biz.primary:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(34,197,94,.35); transform: translateY(-1px); }
        .nav-btn-biz.primary:disabled { opacity: .35; cursor: not-allowed; }
        .nav-btn-biz.ghost { background: transparent; border: 1.5px solid rgba(255,255,255,.08); color: rgba(232,234,246,.4); }
        .nav-btn-biz.ghost:hover { color: rgba(232,234,246,.8); border-color: rgba(255,255,255,.16); }

        .step-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; transition: all .25s; }
        .build-btn-main { width: 100%; max-width: 400px; padding: 18px; border-radius: 16px; border: none; background: linear-gradient(135deg, #16a34a, #22c55e, #4ade80); background-size: 200% 200%; color: #fff; font-size: 17px; font-weight: 700; cursor: pointer; transition: all .25s; font-family: 'Inter', sans-serif; letter-spacing: -.01em; animation: shimmer 3s linear infinite; }
        .build-btn-main:hover:not(:disabled) { box-shadow: 0 12px 40px rgba(34,197,94,.4); transform: translateY(-2px); }
        .build-btn-main:disabled { opacity: .4; cursor: not-allowed; }
        @media (max-width: 600px) { .biz-grid { grid-template-columns: repeat(3,1fr) !important; } }
      `}</style>

      {/* NAV */}
      <nav style={{ padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", gap: 12, background: "rgba(4,6,15,.96)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <button onClick={() => router.push("/")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,.07)", borderRadius: 8, color: "rgba(232,234,246,.4)", cursor: "pointer", fontSize: 13, padding: "6px 12px", fontFamily: "Inter,sans-serif", transition: "color .18s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#e8eaf6"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(232,234,246,.4)"}
        >← Home</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <EvixLogoSymbol size={26} />
          <span className="evix-biz-logo">Evix</span>
          <span style={{ color: "rgba(255,255,255,.15)", fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, color: "rgba(232,234,246,.4)", fontWeight: 500 }}>AI Business Setup</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, border: "1px solid rgba(34,197,94,.2)", background: "rgba(34,197,94,.06)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600, letterSpacing: ".06em" }}>INSTANT BUILD</span>
        </div>
      </nav>

      {/* HERO (only step 0) */}
      {step === 0 && (
        <div style={{ padding: "52px 24px 36px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,.04)", animation: "fadeUp .4s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, border: "1px solid rgba(34,197,94,.22)", background: "rgba(34,197,94,.06)", marginBottom: 20 }}>
            <span style={{ fontSize: 12 }}>⬡</span>
            <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 600, letterSpacing: ".05em" }}>BUILD IN MINUTES</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px,5vw,50px)", fontWeight: 800, color: "#f1f4ff", letterSpacing: "-.04em", lineHeight: 1.1, marginBottom: 12 }}>
            Build your AI Business System<br />
            <span style={{ background: "linear-gradient(135deg,#22c55e,#4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>in minutes</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(232,234,246,.35)", maxWidth: 420, margin: "0 auto", lineHeight: 1.7, fontWeight: 300 }}>
            Chatbot · Booking System · WhatsApp · Website — all in one click.
          </p>
        </div>
      )}

      {/* STEP PROGRESS BAR */}
      <div style={{ maxWidth: 600, margin: "0 auto", width: "100%", padding: "22px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {STEPS.map((s, i) => {
            const done = step > i;
            const active = step === i;
            return (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div className="step-dot" style={{ background: done ? "linear-gradient(135deg,#16a34a,#22c55e)" : active ? "rgba(34,197,94,.12)" : "rgba(255,255,255,.04)", border: active ? "1.5px solid rgba(34,197,94,.7)" : done ? "none" : "1.5px solid rgba(255,255,255,.08)", color: done ? "#fff" : active ? "#4ade80" : "rgba(232,234,246,.2)", boxShadow: active ? "0 0 14px rgba(34,197,94,.25)" : "none" }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: active ? "#4ade80" : done ? "#22c55e" : "rgba(232,234,246,.2)", letterSpacing: ".04em", whiteSpace: "nowrap" }}>{s.title.toUpperCase()}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: done ? "rgba(34,197,94,.4)" : "rgba(255,255,255,.06)", margin: "0 4px", marginBottom: 18, transition: "background .3s" }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "32px 24px 120px", overflowY: "auto" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(232,234,246,.2)", marginBottom: 6 }}>Step {step + 1} of {STEPS.length}</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f4ff", marginBottom: 4, letterSpacing: "-.03em" }}>{currentStep.title}</h2>
            <p style={{ fontSize: 14, color: "rgba(232,234,246,.3)" }}>{currentStep.sub}</p>
          </div>

          {/* STEP 0: Business Type */}
          {step === 0 && (
            <div className="biz-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, animation: "fadeUp .35s ease" }}>
              {BUSINESS_TYPES.map(biz => (
                <div key={biz.id} className={`biz-card ${answers.type === biz.id ? "selected" : ""}`} onClick={() => setAnswers(a => ({ ...a, type: biz.id }))}>
                  <span style={{ fontSize: 24, color: "#22c55e" }}>{biz.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: answers.type === biz.id ? "#f1f4ff" : "rgba(232,234,246,.7)" }}>{biz.label}</span>
                  <span style={{ fontSize: 11, color: "rgba(232,234,246,.28)", lineHeight: 1.4 }}>{biz.desc}</span>
                  {answers.type === biz.id && (
                    <div style={{ padding: "2px 10px", borderRadius: 100, background: "rgba(34,197,94,.2)", border: "1px solid rgba(34,197,94,.4)" }}>
                      <span style={{ fontSize: 10, color: "#4ade80", fontWeight: 700 }}>✓ Selected</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 1: AI Goal */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp .35s ease" }}>
              <p style={{ fontSize: 13, color: "rgba(232,234,246,.3)", marginBottom: 8 }}>Select all that apply.</p>
              {AI_GOALS.map(goal => {
                const selected = answers.goal.includes(goal.id);
                return (
                  <div key={goal.id} className={`goal-card ${selected ? "selected" : ""}`} onClick={() => toggleGoal(goal.id)}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: selected ? "rgba(34,197,94,.15)" : "rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, color: "#22c55e", transition: "all .18s" }}>{goal.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: selected ? "#f1f4ff" : "rgba(232,234,246,.7)", marginBottom: 2 }}>{goal.label}</div>
                      <div style={{ fontSize: 12, color: "rgba(232,234,246,.28)" }}>{goal.desc}</div>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: 6, border: selected ? "none" : "1.5px solid rgba(255,255,255,.12)", background: selected ? "linear-gradient(135deg,#16a34a,#22c55e)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", flexShrink: 0, transition: "all .18s" }}>
                      {selected ? "✓" : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 2: Business Info */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeUp .35s ease" }}>
              {[
                { key: "name", label: "Business Name", placeholder: `e.g. ${biz?.label || "My Business"} Pro`, required: true },
                { key: "location", label: "Location", placeholder: "e.g. Riyadh, Saudi Arabia", required: false },
                { key: "hours", label: "Working Hours", placeholder: "e.g. Mon–Fri 9am–6pm", required: false },
                { key: "services", label: "Services (optional)", placeholder: "e.g. Haircut, Beard trim, Coloring", required: false },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "rgba(232,234,246,.5)", marginBottom: 8 }}>
                    {field.label} {field.required && <span style={{ color: "#f87171" }}>*</span>}
                  </label>
                  <input
                    className="info-field"
                    placeholder={field.placeholder}
                    value={answers.info[field.key]}
                    onChange={e => setAnswers(a => ({ ...a, info: { ...a.info, [field.key]: e.target.value } }))}
                  />
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: WhatsApp */}
          {step === 3 && (
            <div style={{ animation: "fadeUp .35s ease" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <button className={`yn-btn ${answers.whatsapp.want === "yes" ? "selected" : ""}`} onClick={() => setAnswers(a => ({ ...a, whatsapp: { ...a.whatsapp, want: "yes" } }))}>
                  <span style={{ fontSize: 28 }}>💬</span>
                  <span>Yes, connect WhatsApp</span>
                </button>
                <button className={`yn-btn ${answers.whatsapp.want === "no" ? "selected" : ""}`} onClick={() => setAnswers(a => ({ ...a, whatsapp: { ...a.whatsapp, want: "no" } }))}>
                  <span style={{ fontSize: 28, opacity: .5 }}>✗</span>
                  <span>No thanks</span>
                </button>
              </div>
              {answers.whatsapp.want === "yes" && (
                <div style={{ animation: "fadeUp .2s ease" }}>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "rgba(232,234,246,.5)", marginBottom: 8 }}>Phone Number (with country code)</label>
                  <input className="info-field" placeholder="+966501234567" value={answers.whatsapp.number} onChange={e => setAnswers(a => ({ ...a, whatsapp: { ...a.whatsapp, number: e.target.value } }))} />
                  <p style={{ fontSize: 11.5, color: "rgba(232,234,246,.25)", marginTop: 8 }}>A floating WhatsApp button will appear on your site for instant customer contact.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Website */}
          {step === 4 && (
            <div style={{ animation: "fadeUp .35s ease" }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <button className={`yn-btn ${answers.website.has === "yes" ? "selected" : ""}`} onClick={() => setAnswers(a => ({ ...a, website: { ...a.website, has: "yes" } }))}>
                  <span style={{ fontSize: 28 }}>⬡</span>
                  <span>Yes, I have a website</span>
                </button>
                <button className={`yn-btn ${answers.website.has === "no" ? "selected" : ""}`} onClick={() => setAnswers(a => ({ ...a, website: { ...a.website, has: "no" } }))}>
                  <span style={{ fontSize: 28, color: "#22c55e" }}>⊹</span>
                  <span>No — generate one</span>
                </button>
              </div>
              {answers.website.has === "yes" && (
                <div style={{ animation: "fadeUp .2s ease" }}>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "rgba(232,234,246,.5)", marginBottom: 8 }}>Website URL</label>
                  <input className="info-field" placeholder="https://mybusiness.com" value={answers.website.url} onChange={e => setAnswers(a => ({ ...a, website: { ...a.website, url: e.target.value } }))} />
                </div>
              )}
              {answers.website.has === "no" && (
                <div style={{ padding: "16px", borderRadius: 12, background: "rgba(34,197,94,.05)", border: "1px solid rgba(34,197,94,.15)", animation: "fadeUp .2s ease" }}>
                  <p style={{ fontSize: 13, color: "#4ade80", lineHeight: 1.6 }}>
                    ✦ Evix will generate a complete, professional website for {answers.info.name || "your business"} with your chatbot and booking system fully embedded.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,.05)", background: "rgba(4,6,15,.97)", backdropFilter: "blur(20px)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 40 }}>
        <div>
          {step > 0 && (
            <button className="nav-btn-biz ghost" onClick={() => setStep(s => s - 1)}>← Back</button>
          )}
        </div>
        <div>
          {step < STEPS.length - 1 ? (
            <button className="nav-btn-biz primary" disabled={!canNext()} onClick={() => setStep(s => s + 1)}>
              Continue →
            </button>
          ) : (
            <button className="nav-btn-biz primary" disabled={!canNext()} onClick={handleShowResult}>
              See My AI System →
            </button>
          )}
        </div>
      </div>

      {/* BUILDING OVERLAY */}
      {isBuilding && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(4,6,15,.97)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: "linear-gradient(135deg,#16a34a,#22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>⬡</div>
            <div style={{ position: "absolute", inset: -5, borderRadius: 25, border: "2px solid transparent", borderTopColor: "#4ade80", animation: "spin 1.5s linear infinite" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#f1f4ff", marginBottom: 6 }}>Building your website…</p>
            <p style={{ fontSize: 13, color: "rgba(232,234,246,.4)" }}>{buildStatus}</p>
          </div>
          <div style={{ width: 240, height: 4, background: "rgba(255,255,255,.05)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${buildProgress}%`, background: "linear-gradient(90deg,#16a34a,#4ade80)", borderRadius: 10, transition: "width .6s ease" }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function BusinessPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "#04060f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(232,234,246,.3)", fontSize: 14 }}>Loading…</div>
      </div>
    }>
      <BusinessPageInner />
    </Suspense>
  );
}