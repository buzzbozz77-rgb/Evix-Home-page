"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Step Definitions ─────────────────────────────────────────
const STEPS = [
  { id: "type",     title: "Project Type",    icon: "⬡", desc: "What do you want to build?" },
  { id: "info",     title: "Business Info",   icon: "◇", desc: "Tell us about your business" },
  { id: "features", title: "Features",        icon: "◈", desc: "What should your site include?" },
  { id: "style",    title: "Visual Style",    icon: "◆", desc: "How should it look?" },
  { id: "review",   title: "Review & Build",  icon: "✦", desc: "Confirm and generate" },
];

const PROJECT_TYPES = [
  { id: "website",  label: "Website",          icon: "⬡", desc: "Full multi-section business site", buildType: "website" },
  { id: "landing",  label: "Landing Page",     icon: "◈", desc: "Single-page, high-converting funnel", buildType: "landing" },
  { id: "booking",  label: "Booking System",   icon: "📅", desc: "Site with appointment scheduling", buildType: "website" },
  { id: "business", label: "Business Site",    icon: "◇", desc: "Corporate presence with all sections", buildType: "website" },
];

const FEATURE_OPTIONS = [
  { id: "booking",     label: "Booking / Appointments",  icon: "📅", desc: "Calendar + form for scheduling" },
  { id: "chatbot",     label: "AI Chatbot",               icon: "🤖", desc: "Smart assistant for visitors" },
  { id: "pricing",     label: "Pricing Section",          icon: "💰", desc: "Plans and pricing table" },
  { id: "gallery",     label: "Gallery / Portfolio",      icon: "🖼️", desc: "Showcase work or products" },
  { id: "testimonials",label: "Testimonials",             icon: "⭐", desc: "Social proof from clients" },
  { id: "contact",     label: "Contact Form",             icon: "✉️", desc: "Email form with validation" },
  { id: "team",        label: "Team Section",             icon: "👥", desc: "Show your team members" },
  { id: "faq",         label: "FAQ Section",              icon: "❓", desc: "Answers to common questions" },
];

const STYLE_OPTIONS = [
  { id: "Luxury",  label: "Luxury",  icon: "◆", desc: "Dark, gold accents, elegant serif fonts, premium feel", preview: "linear-gradient(135deg,#1a1505,#2d2007)" },
  { id: "Modern",  label: "Modern",  icon: "◈", desc: "Glassmorphism, vibrant gradients, bold typography",       preview: "linear-gradient(135deg,#0f0520,#1a0a3d)" },
  { id: "Minimal", label: "Minimal", icon: "○", desc: "Ultra-clean white space, monochrome, zen aesthetic",      preview: "linear-gradient(135deg,#f8f8f8,#e8e8e8)" },
  { id: "Bold",    label: "Bold",    icon: "⬡", desc: "High contrast, strong colors, oversized headlines",       preview: "linear-gradient(135deg,#0a0014,#140028)" },
];

const STYLE_DESCS = {
  Luxury:  "dark rich background, gold or platinum accents, elegant serif fonts, sophisticated spacing, ultra-premium feel, deep contrast",
  Modern:  "glassmorphism surfaces, vibrant purple/blue gradients, bold geometric typography, dynamic animations, cutting-edge UI",
  Minimal: "ultra-clean white space, monochrome palette, thin elegant typography, lots of breathing room, zen minimalist aesthetic",
  Bold:    "high contrast dark background, neon accent colors, oversized display headlines, energetic layout, powerful visual impact",
};

const INFO_QUESTIONS = [
  { id: "name",     label: "Business Name",    placeholder: "e.g. Luna Beauty Studio", type: "text" },
  { id: "offer",    label: "What do you offer?", placeholder: "e.g. Hair styling, nail care, facials", type: "text" },
  { id: "audience", label: "Target Audience",  placeholder: "e.g. Women aged 20–45 looking for luxury care", type: "text" },
  { id: "goal",     label: "Primary Goal",     placeholder: "e.g. Get more bookings and grow my client base", type: "text" },
  { id: "location", label: "Location (optional)", placeholder: "e.g. Dubai, UAE", type: "text" },
];

function EvixLogoSymbol({ size = 32 }) {
  return (
    <img src="/LOGOSS.png" alt="Evix" style={{ height: size, width: "auto", display: "block", objectFit: "contain", objectPosition: "left center" }} />
  );
}

function StepDot({ step, index, currentStep }) {
  const done = index < currentStep;
  const active = index === currentStep;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: done ? 14 : 13, fontWeight: 700, transition: "all .3s",
        background: done ? "linear-gradient(135deg,#4f52e8,#7c3aed)" : active ? "rgba(99,102,241,.15)" : "rgba(255,255,255,.04)",
        border: active ? "1.5px solid rgba(99,102,241,.7)" : done ? "none" : "1.5px solid rgba(255,255,255,.08)",
        color: done ? "#fff" : active ? "#c4b5fd" : "rgba(226,232,248,.25)",
        boxShadow: active ? "0 0 16px rgba(99,102,241,.35)" : "none",
      }}>
        {done ? "✓" : step.icon}
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: active ? "#c4b5fd" : done ? "#818cf8" : "rgba(226,232,248,.22)", letterSpacing: ".04em", whiteSpace: "nowrap" }}>
        {step.title}
      </span>
    </div>
  );
}

export default function AgentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    type: null,
    info: { name: "", offer: "", audience: "", goal: "", location: "" },
    features: [],
    style: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStatus, setGenStatus] = useState("");
  const [genProgress, setGenProgress] = useState(0);
  const [error, setError] = useState("");

  const canNext = () => {
    if (currentStep === 0) return !!answers.type;
    if (currentStep === 1) return !!(answers.info.name && answers.info.offer && answers.info.goal);
    if (currentStep === 2) return true;
    if (currentStep === 3) return !!answers.style;
    return true;
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1 && canNext()) setCurrentStep(s => s + 1);
  };
  const goBack = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };

  const buildFinalPrompt = () => {
    const { type, info, features, style } = answers;
    const projectType = PROJECT_TYPES.find(t => t.id === type);
    const styleDesc = STYLE_DESCS[style] || "";
    const featureLabels = features.map(f => FEATURE_OPTIONS.find(o => o.id === f)?.label).filter(Boolean);

    const bookingInstructions = features.includes("booking") ? `
BOOKING SYSTEM REQUIREMENTS:
- Add a full appointment booking section with a beautiful calendar UI
- Include a booking form with fields: Name, Email, Phone, Service selection, Date/Time picker, Notes
- Show available time slots (use placeholder slots like 9am, 10am, 11am, 2pm, 3pm, 4pm)
- After form submit: show a success confirmation message with booking details
- Use EmailJS-style mailto fallback: booking data displayed in a confirmation modal
- Make the booking section visually prominent with a gradient background
` : "";

    const chatbotInstructions = features.includes("chatbot") ? `
CHATBOT WIDGET REQUIREMENTS:
- Add a floating chatbot widget in the bottom-right corner
- Chat bubble button with the business logo/initials and a pulse animation
- When opened: show a beautiful chat interface
- The chatbot should know about: ${info.name}, services: ${info.offer}, target: ${info.audience}
- Pre-programmed responses for: pricing, booking, services, location, hours
- Typing indicator animation between messages
- Welcome message: "Hi! I'm the ${info.name} AI assistant. How can I help you today?"
` : "";

    return `[STYLE DNA: ${styleDesc}]

Build a complete, production-ready ${projectType?.label} for the following business:

BUSINESS DETAILS:
- Business Name: ${info.name || "N/A"}
- Services/Products: ${info.offer || "N/A"}
- Target Audience: ${info.audience || "N/A"}
- Primary Goal: ${info.goal || "N/A"}
- Location: ${info.location || "N/A"}

PROJECT TYPE: ${projectType?.label}
REQUIRED FEATURES: ${featureLabels.length > 0 ? featureLabels.join(", ") : "Standard sections"}
VISUAL STYLE: ${style}

${bookingInstructions}
${chatbotInstructions}

IMPORTANT: 
- Use "${info.name}" as the business name throughout
- Write all copy specifically for this business (no Lorem Ipsum)
- Make it feel like it was custom-designed for this exact business
- Include all requested features prominently
- The result must look like a $15,000 professionally designed website`;
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    setGenStatus("Crafting your custom project…");
    setGenProgress(0);

    const steps = [
      { target: 12, delay: 500 }, { target: 30, delay: 1800 },
      { target: 52, delay: 4000 }, { target: 72, delay: 8000 },
      { target: 88, delay: 14000 }, { target: 94, delay: 22000 },
    ];
    const timers = steps.map(s => setTimeout(() => setGenProgress(s.target), s.delay));

    const statusMessages = [
      { msg: "Analyzing your business…", delay: 800 },
      { msg: "Designing layout structure…", delay: 3000 },
      { msg: "Writing your copy…", delay: 7000 },
      { msg: "Adding animations & interactions…", delay: 13000 },
      { msg: "Integrating requested features…", delay: 20000 },
      { msg: "Final polish…", delay: 26000 },
    ];
    const statusTimers = statusMessages.map(s => setTimeout(() => setGenStatus(s.msg), s.delay));

    try {
      const projectType = PROJECT_TYPES.find(t => t.id === answers.type);
      const buildType = projectType?.buildType || "website";
      const finalPrompt = buildFinalPrompt();

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, type: buildType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      [...timers, ...statusTimers].forEach(clearTimeout);
      setGenProgress(100);

      setTimeout(() => {
        const encoded = encodeURIComponent(finalPrompt);
        router.push(`/builder?prompt=${encoded}&type=${buildType}&agentHtml=${encodeURIComponent(data.html)}&mode=agent`);
      }, 400);

    } catch (err) {
      [...timers, ...statusTimers].forEach(clearTimeout);
      setError(err.message || "Something went wrong. Please try again.");
      setIsGenerating(false);
      setGenProgress(0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepType answers={answers} setAnswers={setAnswers} />;
      case 1: return <StepInfo answers={answers} setAnswers={setAnswers} />;
      case 2: return <StepFeatures answers={answers} setAnswers={setAnswers} />;
      case 3: return <StepStyle answers={answers} setAnswers={setAnswers} />;
      case 4: return <StepReview answers={answers} />;
      default: return null;
    }
  };

  return (
    <div style={{ background: "#080b14", color: "#e2e8f8", fontFamily: "'Inter', sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes stepIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } }
        @keyframes shimmer { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }

        .option-card { border: 1.5px solid rgba(255,255,255,.07); border-radius: 12px; padding: 18px 16px; cursor: pointer; transition: all .2s; background: rgba(255,255,255,.022); display: flex; flex-direction: column; gap: 6px; }
        .option-card:hover { border-color: rgba(99,102,241,.45); background: rgba(99,102,241,.08); transform: translateY(-2px); }
        .option-card.selected { border-color: rgba(99,102,241,.7); background: rgba(99,102,241,.12); box-shadow: 0 0 20px rgba(99,102,241,.15); }
        .feature-card { border: 1.5px solid rgba(255,255,255,.07); border-radius: 10px; padding: 14px 14px; cursor: pointer; transition: all .18s; background: rgba(255,255,255,.018); display: flex; align-items: center; gap: 12px; }
        .feature-card:hover { border-color: rgba(99,102,241,.4); background: rgba(99,102,241,.07); }
        .feature-card.selected { border-color: rgba(99,102,241,.65); background: rgba(99,102,241,.11); }
        .style-card { border: 1.5px solid rgba(255,255,255,.07); border-radius: 12px; padding: 20px 16px; cursor: pointer; transition: all .2s; background: rgba(255,255,255,.022); overflow: hidden; position: relative; }
        .style-card:hover { border-color: rgba(99,102,241,.45); transform: translateY(-2px); }
        .style-card.selected { border-color: rgba(99,102,241,.7); box-shadow: 0 0 24px rgba(99,102,241,.18); }
        .info-input { width: 100%; padding: 11px 14px; border-radius: 9px; border: 1px solid rgba(255,255,255,.09); background: rgba(255,255,255,.035); color: #e2e8f8; font-size: 14px; font-family: 'Inter',sans-serif; outline: none; transition: border-color .2s; }
        .info-input:focus { border-color: rgba(99,102,241,.5); box-shadow: 0 0 0 3px rgba(99,102,241,.08); }
        .info-input::placeholder { color: rgba(226,232,248,.2); }
        .next-btn { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 32px; border-radius: 10px; border: none; background: linear-gradient(135deg,#4f52e8,#7c3aed); color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .2s; font-family: 'Inter',sans-serif; }
        .next-btn:hover:not(:disabled) { box-shadow: 0 6px 24px rgba(99,102,241,.45); transform: translateY(-1px); }
        .next-btn:disabled { opacity: .35; cursor: not-allowed; }
        .back-btn { display: flex; align-items: center; gap: 6px; padding: 13px 24px; border-radius: 10px; border: 1px solid rgba(255,255,255,.07); background: transparent; color: rgba(226,232,248,.4); font-size: 14px; font-weight: 500; cursor: pointer; transition: all .18s; font-family: 'Inter',sans-serif; }
        .back-btn:hover { color: rgba(226,232,248,.8); border-color: rgba(255,255,255,.14); }
        .generate-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px 40px; border-radius: 12px; border: none; background: linear-gradient(135deg,#4f52e8,#7c3aed,#a855f7); color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; transition: all .25s; font-family: 'Inter',sans-serif; width: 100%; max-width: 380px; }
        .generate-btn:hover:not(:disabled) { box-shadow: 0 8px 32px rgba(99,102,241,.5); transform: translateY(-2px); }
        .generate-btn:disabled { opacity: .4; cursor: not-allowed; }
        .progress-bar { height: 2px; background: rgba(255,255,255,.05); overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg,#4f52e8,#a78bfa,#4f52e8); background-size: 200% 100%; transition: width .6s ease; animation: shimmer 2s linear infinite; }

        @media (max-width: 640px) { .options-grid-4 { grid-template-columns: 1fr 1fr !important; } .options-grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>

      {isGenerating && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${genProgress}%` }} />
        </div>
      )}

      {/* NAV */}
      <nav style={{ borderBottom: "1px solid rgba(255,255,255,.05)", padding: "12px 24px", display: "flex", alignItems: "center", gap: 14, background: "rgba(8,11,20,.95)", backdropFilter: "blur(20px)", flexShrink: 0 }}>
        <button onClick={() => router.push("/builder")}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,.07)", borderRadius: 7, color: "rgba(226,232,248,.4)", cursor: "pointer", fontSize: 13, padding: "5px 10px", fontFamily: "Inter,sans-serif", transition: "color .18s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#e2e8f8"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(226,232,248,.4)"}
        >← Builder</button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <EvixLogoSymbol size={28} />
          <span style={{ fontSize: 15, fontWeight: 700, background: "linear-gradient(135deg,#818cf8,#a78bfa,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Evix</span>
          <span style={{ color: "rgba(255,255,255,.18)", fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, color: "rgba(226,232,248,.4)", fontWeight: 500 }}>AI Agent</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, border: "1px solid rgba(168,85,247,.25)", background: "rgba(168,85,247,.08)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a855f7", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, color: "#c084fc", fontWeight: 600, letterSpacing: ".06em" }}>AI AGENT MODE</span>
        </div>
      </nav>

      {/* STEP PROGRESS */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,.04)", padding: "20px 24px", background: "rgba(255,255,255,.008)", flexShrink: 0 }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "flex-start", gap: 0 }}>
          {STEPS.map((step, i) => (
            <div key={step.id} style={{ display: "flex", alignItems: "flex-start", flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <StepDot step={step} index={i} currentStep={currentStep} />
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 1, background: i < currentStep ? "rgba(99,102,241,.4)" : "rgba(255,255,255,.06)", marginTop: 17, transition: "background .3s" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 24px 100px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ marginBottom: 32, animation: "stepIn .35s ease" }}>
            <p style={{ fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(226,232,248,.22)", marginBottom: 8 }}>
              Step {currentStep + 1} of {STEPS.length}
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: "#f1f4ff", letterSpacing: "-.03em", marginBottom: 6 }}>
              {STEPS[currentStep].title}
            </h2>
            <p style={{ fontSize: 15, color: "rgba(226,232,248,.35)", fontWeight: 300 }}>
              {STEPS[currentStep].desc}
            </p>
          </div>
          <div style={{ animation: "stepIn .35s ease" }}>
            {renderStep()}
          </div>
          {error && (
            <div style={{ marginTop: 20, padding: "12px 16px", borderRadius: 10, background: "rgba(248,113,113,.07)", border: "1px solid rgba(248,113,113,.2)" }}>
              <p style={{ fontSize: 13, color: "#f87171" }}>{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ACTIONS */}
      {!isGenerating && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", padding: "16px 24px", background: "rgba(8,11,20,.97)", backdropFilter: "blur(20px)", flexShrink: 0 }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              {currentStep > 0 && (
                <button className="back-btn" onClick={goBack}>← Back</button>
              )}
            </div>
            <div>
              {currentStep < STEPS.length - 1 ? (
                <button className="next-btn" disabled={!canNext()} onClick={goNext}>
                  Continue →
                </button>
              ) : (
                <button className="generate-btn" onClick={handleGenerate} disabled={isGenerating}>
                  <span style={{ fontSize: 18 }}>🤖</span>
                  Generate My Full Project
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GENERATING OVERLAY */}
      {isGenerating && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(8,11,20,.95)", backdropFilter: "blur(16px)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 80, height: 80, borderRadius: 22, background: "linear-gradient(135deg,#4f52e8,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, animation: "pulse 2s ease-in-out infinite" }}>🤖</div>
            <div style={{ position: "absolute", inset: -6, borderRadius: 28, border: "2px solid transparent", borderTopColor: "#818cf8", animation: "spin 1.8s linear infinite" }} />
            <div style={{ position: "absolute", inset: -12, borderRadius: 34, border: "1px solid transparent", borderTopColor: "rgba(168,85,247,.4)", animation: "spin 2.8s linear infinite reverse" }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#f1f4ff", marginBottom: 8, letterSpacing: "-.02em" }}>Building your project…</p>
            <p style={{ fontSize: 14, color: "rgba(226,232,248,.4)", marginBottom: 4 }}>{genStatus}</p>
            <p style={{ fontSize: 12, color: "rgba(226,232,248,.2)" }}>Usually takes 20–40 seconds</p>
          </div>
          <div style={{ width: 280, height: 4, background: "rgba(255,255,255,.06)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${genProgress}%`, background: "linear-gradient(90deg,#4f52e8,#a78bfa)", borderRadius: 10, transition: "width .6s ease" }} />
          </div>
          {answers.info.name && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 400 }}>
              {[answers.type, answers.style, ...answers.features.slice(0, 3)].filter(Boolean).map(tag => (
                <span key={tag} style={{ padding: "4px 12px", borderRadius: 100, background: "rgba(99,102,241,.1)", border: "1px solid rgba(99,102,241,.2)", fontSize: 12, color: "#c4b5fd" }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step Components ──────────────────────────────────────────

function StepType({ answers, setAnswers }) {
  return (
    <div className="options-grid-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {PROJECT_TYPES.map(type => (
        <div key={type.id} className={`option-card ${answers.type === type.id ? "selected" : ""}`}
          onClick={() => setAnswers(a => ({ ...a, type: type.id }))}
        >
          <div style={{ fontSize: 28, marginBottom: 4 }}>{type.icon}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: answers.type === type.id ? "#f1f4ff" : "rgba(226,232,248,.8)", letterSpacing: "-.02em" }}>{type.label}</div>
          <div style={{ fontSize: 12.5, color: "rgba(226,232,248,.35)", lineHeight: 1.5 }}>{type.desc}</div>
          {answers.type === type.id && (
            <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, background: "rgba(99,102,241,.2)", border: "1px solid rgba(99,102,241,.4)", alignSelf: "flex-start" }}>
              <span style={{ fontSize: 10, color: "#c4b5fd", fontWeight: 700 }}>SELECTED</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function StepInfo({ answers, setAnswers }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {INFO_QUESTIONS.map(q => (
        <div key={q.id}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(226,232,248,.6)", marginBottom: 7, letterSpacing: "-.01em" }}>
            {q.label}
            {q.id !== "location" && <span style={{ color: "#f87171", marginLeft: 4 }}>*</span>}
          </label>
          <input
            className="info-input"
            type={q.type}
            placeholder={q.placeholder}
            value={answers.info[q.id] || ""}
            onChange={e => setAnswers(a => ({ ...a, info: { ...a.info, [q.id]: e.target.value } }))}
          />
        </div>
      ))}
    </div>
  );
}

function StepFeatures({ answers, setAnswers }) {
  const toggle = (id) => {
    setAnswers(a => ({
      ...a,
      features: a.features.includes(id) ? a.features.filter(f => f !== id) : [...a.features, id],
    }));
  };
  return (
    <div>
      <p style={{ fontSize: 13, color: "rgba(226,232,248,.3)", marginBottom: 20 }}>
        Select all features you want included. You can always add more later.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {FEATURE_OPTIONS.map(f => {
          const selected = answers.features.includes(f.id);
          return (
            <div key={f.id} className={`feature-card ${selected ? "selected" : ""}`} onClick={() => toggle(f.id)}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: selected ? "rgba(99,102,241,.18)" : "rgba(255,255,255,.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, transition: "all .18s" }}>{f.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: selected ? "#f1f4ff" : "rgba(226,232,248,.65)", marginBottom: 2 }}>{f.label}</div>
                <div style={{ fontSize: 11.5, color: "rgba(226,232,248,.28)" }}>{f.desc}</div>
              </div>
              <div style={{ width: 18, height: 18, borderRadius: 5, border: selected ? "none" : "1.5px solid rgba(255,255,255,.12)", background: selected ? "linear-gradient(135deg,#4f52e8,#7c3aed)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0, transition: "all .18s" }}>
                {selected ? "✓" : ""}
              </div>
            </div>
          );
        })}
      </div>
      {answers.features.length > 0 && (
        <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 9, background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.14)" }}>
          <p style={{ fontSize: 12, color: "#818cf8" }}>✦ {answers.features.length} feature{answers.features.length > 1 ? "s" : ""} selected · Agent will integrate them all</p>
        </div>
      )}
    </div>
  );
}

function StepStyle({ answers, setAnswers }) {
  return (
    <div className="options-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {STYLE_OPTIONS.map(s => (
        <div key={s.id} className={`style-card ${answers.style === s.id ? "selected" : ""}`}
          onClick={() => setAnswers(a => ({ ...a, style: s.id }))}
        >
          <div style={{ height: 56, borderRadius: 8, background: s.preview, marginBottom: 14, border: "1px solid rgba(255,255,255,.06)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              {[40, 28, 36].map((w, i) => (
                <div key={i} style={{ width: w, height: 6, borderRadius: 3, background: "rgba(255,255,255,.15)" }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 16 }}>{s.icon}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: answers.style === s.id ? "#f1f4ff" : "rgba(226,232,248,.8)" }}>{s.label}</span>
            {answers.style === s.id && <span style={{ marginLeft: "auto", fontSize: 13, color: "#818cf8" }}>✓</span>}
          </div>
          <p style={{ fontSize: 12, color: "rgba(226,232,248,.3)", lineHeight: 1.55 }}>{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

function StepReview({ answers }) {
  const projectType = PROJECT_TYPES.find(t => t.id === answers.type);
  const selectedFeatures = FEATURE_OPTIONS.filter(f => answers.features.includes(f.id));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ padding: "20px 22px", borderRadius: 14, background: "rgba(99,102,241,.06)", border: "1px solid rgba(99,102,241,.15)" }}>
        <p style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(226,232,248,.28)", marginBottom: 14 }}>Project Summary</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ReviewRow label="Project Type" value={projectType?.label || "—"} icon={projectType?.icon} />
          <ReviewRow label="Business" value={answers.info.name || "—"} icon="◇" />
          <ReviewRow label="Offers" value={answers.info.offer || "—"} icon="◈" />
          <ReviewRow label="Goal" value={answers.info.goal || "—"} icon="⊹" />
          {answers.info.location && <ReviewRow label="Location" value={answers.info.location} icon="📍" />}
          <ReviewRow label="Visual Style" value={answers.style || "—"} icon="◆" />
        </div>
      </div>
      {selectedFeatures.length > 0 && (
        <div style={{ padding: "18px 22px", borderRadius: 14, background: "rgba(168,85,247,.05)", border: "1px solid rgba(168,85,247,.15)" }}>
          <p style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(226,232,248,.28)", marginBottom: 12 }}>Features Included</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {selectedFeatures.map(f => (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: "rgba(168,85,247,.1)", border: "1px solid rgba(168,85,247,.22)" }}>
                <span style={{ fontSize: 13 }}>{f.icon}</span>
                <span style={{ fontSize: 12, color: "#c084fc", fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(34,197,94,.05)", border: "1px solid rgba(34,197,94,.15)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>🤖</span>
        <p style={{ fontSize: 13, color: "rgba(226,232,248,.5)", lineHeight: 1.6 }}>
          The AI Agent will build a complete, production-ready project tailored exactly to your business. Everything will be included in a single downloadable HTML file.
        </p>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
      <span style={{ fontSize: 14, color: "rgba(99,102,241,.6)", flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: "rgba(226,232,248,.3)", fontWeight: 500, minWidth: 80 }}>{label}</span>
        <span style={{ fontSize: 13.5, color: "rgba(226,232,248,.75)", fontWeight: 500 }}>{value}</span>
      </div>
    </div>
  );
}