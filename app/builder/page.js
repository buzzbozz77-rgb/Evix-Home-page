"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const BUILD_TYPES = [
  { id: "website", label: "Website", icon: "⬡" },
  { id: "landing", label: "Landing Page", icon: "◈" },
];

const SUBTYPES = {
  website: [
    { id: "business", label: "Business" },
    { id: "restaurant", label: "Restaurant" },
    { id: "realestate", label: "Real Estate" },
    { id: "healthcare", label: "Healthcare" },
    { id: "fitness", label: "Fitness" },
    { id: "lawfirm", label: "Law Firm" },
    { id: "portfolio", label: "Portfolio" },
    { id: "agency", label: "Agency" },
  ],
  landing: [
    { id: "saas", label: "SaaS / App" },
    { id: "ecommerce", label: "E-commerce" },
    { id: "course", label: "Online Course" },
    { id: "startup", label: "Startup" },
    { id: "agency", label: "Agency" },
    { id: "product", label: "Product Launch" },
  ],
};

const STYLE_PRESETS = [
  { id: "luxury", label: "Luxury", icon: "◆", desc: "dark rich, gold accents, elegant serif fonts, premium feel" },
  { id: "minimal", label: "Minimal", icon: "○", desc: "ultra-clean white space, monochrome, thin typography, zen" },
  { id: "modern", label: "Modern", icon: "◈", desc: "glassmorphism, vibrant gradients, bold type, dynamic" },
  { id: "bold", label: "Bold", icon: "⬡", desc: "high contrast, strong colors, oversized headlines, energetic" },
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

const EXAMPLES = {
  website: [
    "A luxury real estate agency with hero, listings, and contact form",
    "A modern restaurant site with menu, gallery, and reservations",
    "A fitness studio with classes, trainers, and membership plans",
    "A law firm homepage with practice areas and team profiles",
    "A creative agency portfolio with case studies and team",
    "A healthcare clinic with services, doctors, and appointment booking",
  ],
  landing: [
    "A SaaS dashboard tool with pricing and testimonials",
    "A beauty salon booking page with services and pricing",
    "A fitness app landing page with before/after and pricing tiers",
    "A startup product launch page with waitlist signup",
    "An online course landing page with curriculum and instructor bio",
    "A mobile app landing page with features and download links",
  ],
};

const BUILDER_MODES = [
  { id: "simple", label: "Simple", icon: "⬡", desc: "Describe and generate" },
  { id: "agent",  label: "Agent",  icon: "◎", desc: "Guided step-by-step" },
];

function validateHtml(html) {
  const errors = [];
  if (!html.includes("<style")) errors.push("Missing <style> block");
  if (!html.includes("<script")) errors.push("Missing <script> block");
  if (!html.includes("</html>")) errors.push("HTML not closed");
  const lineCount = html.split("\n").length;
  if (lineCount < 500) errors.push(`Output too short: ${lineCount} lines (minimum 500)`);
  return errors;
}

function EvixLogoSymbol({ size = 24 }) {
  return (
    <img src="/LOGOSS.png" alt="Evix" style={{ height: size, width: "auto", display: "block", maxWidth: size * 1.1, objectFit: "cover", objectPosition: "left center" }} />
  );
}

// ── Publish Modal ─────────────────────────────────────────────
function PublishModal({ html, onClose }) {
  const [step, setStep] = useState("idle");
  const [publishUrl, setPublishUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePublish = async () => {
    setStep("publishing");
    await new Promise(r => setTimeout(r, 1800));
    const id = Math.random().toString(36).slice(2, 10);
    setPublishUrl(`https://evix.app/sites/${id}`);
    setStep("done");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publishUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,.65)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn .2s ease" }}>
      <div style={{ background: "#0d1022", border: "1px solid rgba(34,197,94,.25)", borderRadius: 18, padding: 32, maxWidth: 420, width: "90%", boxShadow: "0 24px 80px rgba(0,0,0,.7)", animation: "slideUp .25s ease" }}>
        {step === "idle" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>◈</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f4ff", marginBottom: 8, letterSpacing: "-.025em" }}>Publish your site</h3>
              <p style={{ fontSize: 13.5, color: "rgba(226,232,248,.4)", lineHeight: 1.6 }}>Your site will be hosted live and accessible via a shareable link instantly.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 9, border: "1px solid rgba(255,255,255,.07)", background: "transparent", color: "rgba(226,232,248,.45)", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
              <button onClick={handlePublish} style={{ flex: 2, padding: 11, borderRadius: 9, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Publish Now →</button>
            </div>
          </>
        )}
        {step === "publishing" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 20px" }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid rgba(34,197,94,.2)", borderTopColor: "#4ade80", animation: "spin .9s linear infinite" }} />
              <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid rgba(34,197,94,.15)", borderTopColor: "#86efac", animation: "spin 1.4s linear infinite reverse" }} />
            </div>
            <p style={{ fontSize: 15, color: "rgba(226,232,248,.6)", fontWeight: 500 }}>Publishing your site…</p>
          </div>
        )}
        {step === "done" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 42, marginBottom: 10 }}>✅</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f4ff", marginBottom: 6, letterSpacing: "-.025em" }}>Site is live!</h3>
            </div>
            <div style={{ background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 10, padding: "11px 14px", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "#4ade80", fontFamily: "monospace", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{publishUrl}</span>
              <button onClick={handleCopy} style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid rgba(34,197,94,.25)", background: "rgba(34,197,94,.1)", color: "#4ade80", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{copied ? "Copied!" : "Copy"}</button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 9, border: "1px solid rgba(255,255,255,.07)", background: "transparent", color: "rgba(226,232,248,.45)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Close</button>
              <a href={publishUrl} target="_blank" rel="noopener noreferrer" style={{ flex: 2, padding: 11, borderRadius: 9, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>⬡ Open Site</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Improve Modal ─────────────────────────────────────────────
function ImproveModal({ onImprove, onClose }) {
  const [customImprove, setCustomImprove] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,.65)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn .2s ease" }}>
      <div style={{ background: "#0d1022", border: "1px solid rgba(34,197,94,.25)", borderRadius: 18, padding: 28, maxWidth: 460, width: "90%", boxShadow: "0 24px 80px rgba(0,0,0,.7)", animation: "slideUp .25s ease" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f4ff", marginBottom: 6, letterSpacing: "-.025em" }}>Improve your site</h3>
          <p style={{ fontSize: 13, color: "rgba(226,232,248,.35)" }}>Tell AI what to change, or pick a quick suggestion.</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {IMPROVE_SUGGESTIONS.map(s => (
            <button key={s} onClick={() => onImprove(s)}
              style={{ padding: "6px 12px", borderRadius: 100, border: "1px solid rgba(34,197,94,.25)", background: "rgba(34,197,94,.07)", color: "rgba(134,239,172,.7)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.55)"; e.currentTarget.style.color = "#86efac"; e.currentTarget.style.background = "rgba(34,197,94,.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.25)"; e.currentTarget.style.color = "rgba(134,239,172,.7)"; e.currentTarget.style.background = "rgba(34,197,94,.07)"; }}
            >{s}</button>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <textarea
            value={customImprove}
            onChange={e => setCustomImprove(e.target.value)}
            placeholder="Or describe exactly what to change…"
            rows={3}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", color: "#e2e8f8", fontSize: 13.5, fontFamily: "inherit", outline: "none", resize: "none", lineHeight: 1.6 }}
          />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, borderRadius: 9, border: "1px solid rgba(255,255,255,.07)", background: "transparent", color: "rgba(226,232,248,.45)", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          <button
            onClick={() => customImprove.trim() && onImprove(customImprove)}
            disabled={!customImprove.trim()}
            style={{ flex: 2, padding: 11, borderRadius: 9, border: "none", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: customImprove.trim() ? 1 : 0.35 }}
          >✨ Apply Improvement</button>
        </div>
      </div>
    </div>
  );
}

function BuilderInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [prompt, setPrompt] = useState("");
  const [activeType, setActiveType] = useState("website");
  const [activeSubtype, setActiveSubtype] = useState(null);
  const [activeStyle, setActiveStyle] = useState(null);
  const [builderMode, setBuilderMode] = useState("simple");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [charCount, setCharCount] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hasAutoGenerated, setHasAutoGenerated] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showChatbotTooltip, setShowChatbotTooltip] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showImproveModal, setShowImproveModal] = useState(false);
  const [improveHistory, setImproveHistory] = useState([]);
  const [fromAgent, setFromAgent] = useState(false);
  const [fromBusiness, setFromBusiness] = useState(false);
  const [outputLines, setOutputLines] = useState(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    const p = searchParams.get("prompt");
    const t = searchParams.get("type");
    const agentHtml = searchParams.get("agentHtml");
    const mode = searchParams.get("mode");

    if (t && (t === "website" || t === "landing")) setActiveType(t);
    if (p) {
      const decoded = decodeURIComponent(p);
      setPrompt(decoded);
      setCharCount(decoded.length);
    }

    if (agentHtml) {
      try {
        const html = decodeURIComponent(agentHtml);
        setGeneratedHtml(html);
        setOutputLines(html.split("\n").length);
        setActiveTab("preview");
        setHasAutoGenerated(true);
        if (mode === "agent") setFromAgent(true);
        if (mode === "business") setFromBusiness(true);
      } catch {}
    }
  }, [searchParams]);

  useEffect(() => {
    const p = searchParams.get("prompt");
    const t = searchParams.get("type");
    const agentHtml = searchParams.get("agentHtml");

    if (p && !hasAutoGenerated && !agentHtml) {
      setHasAutoGenerated(true);
      const decoded = decodeURIComponent(p);
      const type = (t === "website" || t === "landing") ? t : "website";
      handleGenerate(decoded, type);
    }
  }, [searchParams, hasAutoGenerated]);

  useEffect(() => {
    if (isGenerating) {
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
    } else {
      setGenerationProgress(100);
      const t = setTimeout(() => setGenerationProgress(0), 600);
      return () => clearTimeout(t);
    }
  }, [isGenerating]);

  const buildEnrichedPrompt = (basePrompt) => {
    if (!activeStyle) return basePrompt;
    const style = STYLE_PRESETS.find(s => s.id === activeStyle);
    if (!style) return basePrompt;
    return `[STYLE DNA: ${style.desc}] ${basePrompt}`;
  };

  const handleGenerate = async (customPrompt, customType, attempt = 1) => {
    const p = customPrompt !== undefined ? customPrompt : prompt;
    const t = customType !== undefined ? customType : activeType;
    if (!p.trim()) return;

    setIsGenerating(true);
    setError("");
    setRetryCount(attempt - 1);

    if (attempt === 1) {
      setGeneratedHtml("");
      setOutputLines(null);
      setGenerationStatus("Evix is crafting your design…");
    } else {
      setGenerationStatus(`Expanding output (pass ${attempt}/3)…`);
    }

    const enriched = buildEnrichedPrompt(p);
    const subtypePrefix = activeSubtype ? `[${activeSubtype.toUpperCase()} STYLE] ` : "";
    const finalPrompt = subtypePrefix + enriched;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, type: t }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      const html = data.html;
      const lines = html.split("\n").length;
      const validationErrors = validateHtml(html);

      if (validationErrors.length > 0 && attempt < 3) {
        await handleGenerate(customPrompt, customType, attempt + 1);
        return;
      }

      setGeneratedHtml(html);
      setOutputLines(lines);
      setActiveTab("preview");
      setGenerationStatus("");
      setFromAgent(false);
      setFromBusiness(false);
    } catch (err) {
      if (attempt < 3) {
        await handleGenerate(customPrompt, customType, attempt + 1);
        return;
      }
      setError("Something went wrong. Please try again.");
      setGenerationStatus("");
    } finally {
      if (attempt === 1 || attempt >= 3) setIsGenerating(false);
    }
  };

  const handleImprove = async (instruction) => {
    setShowImproveModal(false);
    if (!generatedHtml || !instruction.trim()) return;

    setIsGenerating(true);
    setError("");
    setGenerationStatus(`Applying: "${instruction}"…`);
    setImproveHistory(prev => [...prev, instruction]);

    const improvePrompt = `
You are improving an existing website. Here is the current HTML:

${generatedHtml.slice(0, 6000)}...

IMPROVEMENT INSTRUCTION: ${instruction}

Apply this improvement while keeping all existing content and sections.
The improved output MUST be at least 500 lines of HTML.
Make it significantly better. Output only the full improved HTML.
    `.trim();

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: improvePrompt, type: activeType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Improvement failed");
      setGeneratedHtml(data.html);
      setOutputLines(data.html.split("\n").length);
      setActiveTab("preview");
      setGenerationStatus("");
    } catch (err) {
      setError("Improvement failed. Please try again.");
      setGenerationStatus("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evix-${activeType}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedHtml);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    setCharCount(e.target.value.length);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 180) + "px"; }
  };

  const currentSubtypes = SUBTYPES[activeType] || [];
  const currentExamples = EXAMPLES[activeType] || EXAMPLES.website;
  const sizeKb = generatedHtml ? (generatedHtml.length / 1024).toFixed(1) : null;

  return (
    <div style={{ background: "#080b14", color: "#e2e8f8", fontFamily: "'Inter', sans-serif", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @font-face {
          font-family: 'Casa';
          src: url('/fonts/Casa-Regular.otf') format('opentype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,.28); border-radius: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:.9; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes tooltipIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:200% center; } 100% { background-position:-200% center; } }

        .evix-builder-logo {
          font-family: 'Casa', sans-serif;
          font-size: 16px;
          letter-spacing: .06em;
          background: linear-gradient(135deg,#4ade80,#22c55e,#86efac);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tab-btn { padding: 6px 14px; border-radius: 6px; border: none; background: transparent; color: rgba(226,232,248,.35); font-size: 12.5px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .16s; }
        .tab-btn.active { background: rgba(34,197,94,.14); color: #86efac; border: 1px solid rgba(34,197,94,.28); }
        .tab-btn:hover:not(.active) { color: rgba(226,232,248,.7); }

        .action-btn { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 7px; border: 1px solid rgba(255,255,255,.07); background: rgba(255,255,255,.03); color: rgba(226,232,248,.52); font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .16s; white-space: nowrap; }
        .action-btn:hover { border-color: rgba(34,197,94,.38); color: #86efac; background: rgba(34,197,94,.07); }
        .action-btn.primary { background: linear-gradient(135deg,#16a34a,#22c55e); border-color: transparent; color: #fff; }
        .action-btn.primary:hover { box-shadow: 0 4px 16px rgba(34,197,94,.4); transform: translateY(-1px); }
        .action-btn.publish { background: linear-gradient(135deg,#059669,#10b981); border-color: transparent; color: #fff; }
        .action-btn.publish:hover { box-shadow: 0 4px 16px rgba(16,185,129,.4); transform: translateY(-1px); }
        .action-btn.improve { background: linear-gradient(135deg,#15803d,#16a34a); border-color: transparent; color: #fff; }
        .action-btn.improve:hover { box-shadow: 0 4px 16px rgba(22,163,74,.4); transform: translateY(-1px); }

        .mode-tab { flex: 1; padding: 8px 10px; border-radius: 8px; border: none; background: transparent; color: rgba(226,232,248,.35); font-size: 12px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all .18s; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .mode-tab.active { background: rgba(34,197,94,.14); color: #86efac; border: 1px solid rgba(34,197,94,.28); }
        .mode-tab:hover:not(.active) { color: rgba(226,232,248,.7); background: rgba(255,255,255,.03); }

        .type-pill { padding: 6px 14px; border-radius: 7px; border: 1px solid rgba(255,255,255,.07); background: transparent; color: rgba(226,232,248,.38); font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .16s; font-family: inherit; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
        .type-pill:hover { border-color: rgba(34,197,94,.35); color: rgba(226,232,248,.75); }
        .type-pill.active { border-color: rgba(34,197,94,.55); color: #86efac; background: rgba(34,197,94,.1); }
        .type-pill-soon { padding: 6px 14px; border-radius: 7px; border: 1px solid rgba(255,255,255,.04); background: transparent; color: rgba(226,232,248,.22); font-size: 12.5px; font-weight: 500; cursor: default; font-family: inherit; white-space: nowrap; display: flex; align-items: center; gap: 6px; position: relative; }

        .subtype-chip { padding: 4px 11px; border-radius: 6px; border: 1px solid rgba(255,255,255,.065); background: transparent; color: rgba(226,232,248,.35); font-size: 11.5px; font-weight: 500; cursor: pointer; transition: all .14s; font-family: inherit; white-space: nowrap; }
        .subtype-chip:hover { border-color: rgba(34,197,94,.35); color: rgba(226,232,248,.7); }
        .subtype-chip.active { border-color: rgba(34,197,94,.55); color: #86efac; background: rgba(34,197,94,.1); }

        .style-chip { padding: 6px 12px; border-radius: 7px; border: 1px solid rgba(255,255,255,.065); background: transparent; color: rgba(226,232,248,.35); font-size: 11.5px; font-weight: 500; cursor: pointer; transition: all .14s; font-family: inherit; white-space: nowrap; display: flex; align-items: center; gap: 5px; }
        .style-chip:hover { border-color: rgba(34,197,94,.35); color: rgba(226,232,248,.7); }
        .style-chip.active { border-color: rgba(34,197,94,.55); color: #4ade80; background: rgba(34,197,94,.1); }

        .example-chip { padding: 5px 11px; border-radius: 100px; border: 1px solid rgba(255,255,255,.055); background: transparent; color: rgba(226,232,248,.32); font-size: 11px; cursor: pointer; transition: all .14s; font-family: inherit; text-align: left; line-height: 1.4; }
        .example-chip:hover { border-color: rgba(34,197,94,.4); color: #86efac; background: rgba(34,197,94,.07); }

        .gen-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 11px; border-radius: 9px; border: none; background: linear-gradient(135deg,#16a34a,#22c55e); color: #fff; font-size: 13.5px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .2s; }
        .gen-btn:hover:not(:disabled) { box-shadow: 0 6px 22px rgba(34,197,94,.42); transform: translateY(-1px); }
        .gen-btn:disabled { opacity: .38; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

        .improve-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 10px; border-radius: 9px; border: 1px solid rgba(34,197,94,.35); background: rgba(34,197,94,.08); color: #4ade80; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all .2s; }
        .improve-btn:hover { background: rgba(34,197,94,.14); border-color: rgba(34,197,94,.55); box-shadow: 0 4px 16px rgba(34,197,94,.2); }

        .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.28); border-top-color: #fff; border-radius: 50%; animation: spin .65s linear infinite; flex-shrink: 0; }

        textarea.prompt-ta { width: 100%; padding: 11px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,.08); background: rgba(255,255,255,.032); color: #e2e8f8; font-size: 13.5px; font-family: inherit; outline: none; resize: none; line-height: 1.6; min-height: 88px; max-height: 180px; transition: border-color .2s; }
        textarea.prompt-ta::placeholder { color: rgba(226,232,248,.18); }
        textarea.prompt-ta:focus { border-color: rgba(34,197,94,.44); box-shadow: 0 0 0 3px rgba(34,197,94,.08); }

        .section-label { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: rgba(226,232,248,.22); font-weight: 600; margin-bottom: 8px; }
        .size-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 100px; font-size: 10px; font-weight: 600; }
        .size-badge.good { background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2); color: #4ade80; }
        .size-badge.warn { background: rgba(251,191,36,.1); border: 1px solid rgba(251,191,36,.2); color: #fbbf24; }
        .lines-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 100px; font-size: 10px; font-weight: 600; background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2); color: #4ade80; }

        .progress-bar { height: 2px; background: rgba(255,255,255,.05); position: relative; overflow: hidden; }
        .progress-bar-fill { position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg,#16a34a,#4ade80,#16a34a); background-size: 200% 100%; transition: width .5s ease; animation: shimmer 2s linear infinite; }

        .loading-dots { display: flex; gap: 5px; align-items: center; }
        .loading-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(34,197,94,.6); animation: pulse 1.4s ease-in-out infinite; }
        .loading-dots span:nth-child(2) { animation-delay: .2s; }
        .loading-dots span:nth-child(3) { animation-delay: .4s; }

        .sidebar-inner { padding: 14px 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; height: 100%; }
        .sidebar-inner::-webkit-scrollbar { width: 3px; }
        .sidebar-inner::-webkit-scrollbar-thumb { background: rgba(34,197,94,.2); border-radius: 3px; }

        .coming-soon-tooltip { position: absolute; bottom: calc(100% + 7px); left: 50%; transform: translateX(-50%); background: rgba(10,13,26,.97); border: 1px solid rgba(34,197,94,.3); border-radius: 8px; padding: 7px 12px; font-size: 11.5px; color: #86efac; white-space: nowrap; pointer-events: none; animation: tooltipIn .16s ease; z-index: 50; box-shadow: 0 8px 24px rgba(0,0,0,.5); }
        .coming-soon-tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: rgba(34,197,94,.3); }

        .biz-shortcut { padding: 10px 12px; border-radius: 10px; background: rgba(34,197,94,.05); border: 1px solid rgba(34,197,94,.15); cursor: pointer; transition: all .18s; }
        .biz-shortcut:hover { border-color: rgba(34,197,94,.35); background: rgba(34,197,94,.09); }

        .evix-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 100px; font-size: 9px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; background: rgba(34,197,94,.12); border: 1px solid rgba(34,197,94,.25); color: #4ade80; }
      `}</style>

      {showPublishModal && <PublishModal html={generatedHtml} onClose={() => setShowPublishModal(false)} />}
      {showImproveModal && <ImproveModal onImprove={handleImprove} onClose={() => setShowImproveModal(false)} />}

      {isGenerating && (
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${generationProgress}%` }} />
        </div>
      )}

      {/* TOPBAR */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,.05)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexShrink: 0, background: "rgba(8,11,20,.95)", backdropFilter: "blur(20px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push("/")}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,.07)", borderRadius: 7, color: "rgba(226,232,248,.35)", cursor: "pointer", fontSize: 13, padding: "5px 10px", lineHeight: 1, transition: "all .18s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.color = "rgba(226,232,248,.8)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.14)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(226,232,248,.35)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; }}
          >← Back</button>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <EvixLogoSymbol size={22} />
            <span className="evix-builder-logo">Evix</span>
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,.18)" }}>/</span>
          <span style={{ fontSize: 13, color: "rgba(226,232,248,.4)", fontWeight: 500 }}>Builder</span>
          <span className="evix-badge">Evix AI</span>
          {fromAgent && (
            <span style={{ fontSize: 11, color: "#86efac", background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.25)", borderRadius: 100, padding: "2px 9px" }}>◎ from AI Agent</span>
          )}
          {fromBusiness && (
            <span style={{ fontSize: 11, color: "#4ade80", background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 100, padding: "2px 9px" }}>⬡ AI Business</span>
          )}
          {improveHistory.length > 0 && (
            <span style={{ fontSize: 11, color: "rgba(134,239,172,.4)", background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.18)", borderRadius: 100, padding: "2px 8px" }}>
              {improveHistory.length} improvement{improveHistory.length > 1 ? "s" : ""} applied
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {sizeKb && <span className={`size-badge ${parseFloat(sizeKb) > 20 ? "good" : "warn"}`}>{sizeKb} KB</span>}
          {outputLines && <span className="lines-badge">{outputLines} lines</span>}
          {generatedHtml && (
            <div style={{ display: "flex", gap: 4 }}>
              <button className={`tab-btn ${activeTab === "preview" ? "active" : ""}`} onClick={() => setActiveTab("preview")}>Preview</button>
              <button className={`tab-btn ${activeTab === "code" ? "active" : ""}`} onClick={() => setActiveTab("code")}>Code</button>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {generatedHtml && (
            <>
              <button className="action-btn" onClick={handleCopy}>{copySuccess ? "✓ Copied!" : "⎘ Copy HTML"}</button>
              <button className="action-btn improve" onClick={() => setShowImproveModal(true)}>✨ Improve</button>
              <button className="action-btn primary" onClick={handleDownload}>↓ Download</button>
              <button className="action-btn publish" onClick={() => setShowPublishModal(true)}>⬡ Publish</button>
            </>
          )}
        </div>
      </div>

      {/* BODY */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* SIDEBAR */}
        <div style={{ width: sidebarOpen ? 276 : 0, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,.05)", overflow: "hidden", transition: "width .24s ease", background: "rgba(255,255,255,.008)", display: "flex", flexDirection: "column" }}>
          <div className="sidebar-inner" style={{ minWidth: 276 }}>

            {/* MODE SWITCHER */}
            <div>
              <p className="section-label">Mode</p>
              <div style={{ display: "flex", gap: 4, padding: 3, borderRadius: 10, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                {BUILDER_MODES.map(m => (
                  <button
                    key={m.id}
                    className={`mode-tab ${builderMode === m.id ? "active" : ""}`}
                    onClick={() => {
                      if (m.id === "agent") {
                        router.push("/agent");
                      } else {
                        setBuilderMode(m.id);
                      }
                    }}
                    title={m.desc}
                  >
                    <span style={{ fontSize: 13 }}>{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Business shortcut */}
            <div className="biz-shortcut" onClick={() => router.push("/business")}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>⬡</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#4ade80", marginBottom: 1 }}>AI Business Setup</p>
                  <p style={{ fontSize: 10.5, color: "rgba(74,222,128,.4)" }}>Clinic · Barber · Gym · Store + more</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(34,197,94,.35)" }}>→</span>
              </div>
            </div>

            {/* Build type */}
            <div>
              <p className="section-label">Build Type</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {BUILD_TYPES.map(t => (
                  <button key={t.id} className={`type-pill ${activeType === t.id ? "active" : ""}`} onClick={() => { setActiveType(t.id); setActiveSubtype(null); }}>
                    <span style={{ fontSize: 12 }}>{t.icon}</span>{t.label}
                  </button>
                ))}
                <div className="type-pill-soon" onMouseEnter={() => setShowChatbotTooltip(true)} onMouseLeave={() => setShowChatbotTooltip(false)}>
                  <span style={{ fontSize: 12, opacity: .5 }}>◎</span>
                  <span>Chatbot</span>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", padding: "1px 6px", borderRadius: 100, background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.2)", color: "#22c55e", marginLeft: 2 }}>Soon</span>
                  {showChatbotTooltip && <div className="coming-soon-tooltip">AI Chatbot builder — coming soon!</div>}
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="section-label">Category <span style={{ opacity: .5, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>(optional)</span></p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {currentSubtypes.map(s => (
                  <button key={s.id} className={`subtype-chip ${activeSubtype === s.id ? "active" : ""}`} onClick={() => setActiveSubtype(activeSubtype === s.id ? null : s.id)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Style DNA */}
            <div>
              <p className="section-label">Style DNA <span style={{ opacity: .5, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>(AI-powered)</span></p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {STYLE_PRESETS.map(s => (
                  <button key={s.id} className={`style-chip ${activeStyle === s.id ? "active" : ""}`} onClick={() => setActiveStyle(activeStyle === s.id ? null : s.id)}>
                    <span style={{ fontSize: 10 }}>{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>
              {activeStyle && (
                <p style={{ fontSize: 10.5, color: "rgba(134,239,172,.4)", marginTop: 6, lineHeight: 1.5 }}>
                  ✦ {STYLE_PRESETS.find(s => s.id === activeStyle)?.desc}
                </p>
              )}
            </div>

            {/* Prompt */}
            <div>
              <p className="section-label">Description</p>
              <textarea ref={textareaRef} className="prompt-ta" value={prompt} onChange={handlePromptChange}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate(); }}
                placeholder={`Describe your ${activeType === "landing" ? "landing page" : "website"} in detail…`}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <span style={{ fontSize: 10, color: "rgba(226,232,248,.14)" }}>⌘+Enter to generate</span>
                <span style={{ fontSize: 10, color: charCount > 200 ? "#4ade80" : "rgba(226,232,248,.16)" }}>{charCount} chars</span>
              </div>
            </div>

            {/* Generate */}
            <button className="gen-btn" disabled={!prompt.trim() || isGenerating} onClick={() => handleGenerate()}>
              {isGenerating ? (
                <><div className="spinner" />{generationStatus || "Generating…"}</>
              ) : (
                <>{generatedHtml ? "↺ Regenerate" : "✦ Generate"}</>
              )}
            </button>

            {/* Improve button */}
            {generatedHtml && !isGenerating && (
              <button className="improve-btn" onClick={() => setShowImproveModal(true)}>
                ✨ Improve this site
              </button>
            )}

            {retryCount > 0 && isGenerating && (
              <div style={{ fontSize: 11, color: "rgba(251,191,36,.6)", textAlign: "center", marginTop: -10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <div className="loading-dots"><span/><span/><span/></div>
                Expanding output…
              </div>
            )}

            {/* Improve history */}
            {improveHistory.length > 0 && (
              <div>
                <p className="section-label">Improvements applied</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {improveHistory.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 6, background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.14)" }}>
                      <span style={{ fontSize: 10, color: "#22c55e" }}>✓</span>
                      <span style={{ fontSize: 11, color: "rgba(134,239,172,.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            <div>
              <p className="section-label">Try an example</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {currentExamples.map(ex => (
                  <button key={ex} className="example-chip" onClick={() => { setPrompt(ex); setCharCount(ex.length); }}>
                    {ex}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* PREVIEW PANE */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ position: "absolute", top: 12, left: sidebarOpen ? -12 : 12, zIndex: 10, background: "rgba(12,14,24,.95)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 7, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(226,232,248,.4)", fontSize: 13, transition: "left .24s ease, all .16s", boxShadow: "0 2px 8px rgba(0,0,0,.4)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#86efac"; e.currentTarget.style.borderColor = "rgba(34,197,94,.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(226,232,248,.4)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.09)"; }}
          >
            {sidebarOpen ? "‹" : "›"}
          </button>

          {!generatedHtml && !isGenerating && !error && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: "40px 24px", textAlign: "center", animation: "slideUp .4s ease" }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "rgba(34,197,94,.3)" }}>⬡</div>
              <div>
                <p style={{ fontSize: 15, color: "rgba(226,232,248,.3)", marginBottom: 6, fontWeight: 500 }}>Your site will appear here</p>
                <p style={{ fontSize: 13, color: "rgba(226,232,248,.16)", maxWidth: 300 }}>Fill in a description on the left and click Generate to get started</p>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <div onClick={() => router.push("/agent")} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid rgba(34,197,94,.25)", background: "rgba(34,197,94,.06)", fontSize: 13, color: "rgba(134,239,172,.6)", cursor: "pointer", transition: "all .18s", display: "flex", alignItems: "center", gap: 7 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.5)"; e.currentTarget.style.color = "#86efac"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.25)"; e.currentTarget.style.color = "rgba(134,239,172,.6)"; }}
                >◎ AI Agent</div>
                <div onClick={() => router.push("/business")} style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid rgba(34,197,94,.2)", background: "rgba(34,197,94,.05)", fontSize: 13, color: "rgba(74,222,128,.5)", cursor: "pointer", transition: "all .18s", display: "flex", alignItems: "center", gap: 7 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.45)"; e.currentTarget.style.color = "#4ade80"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,.2)"; e.currentTarget.style.color = "rgba(74,222,128,.5)"; }}
                >⬡ AI Business</div>
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
                <p style={{ fontSize: 15, color: "rgba(226,232,248,.6)", marginBottom: 6, fontWeight: 500 }}>{generationStatus || `Generating your ${activeType} with Evix…`}</p>
                <p style={{ fontSize: 12, color: "rgba(226,232,248,.2)" }}>{retryCount > 0 ? `Expanding output — pass ${retryCount + 1}/3` : "Building 500+ lines of production HTML…"}</p>
              </div>
              <div style={{ width: 200, height: 3, background: "rgba(255,255,255,.06)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${generationProgress}%`, background: "linear-gradient(90deg,#16a34a,#4ade80)", borderRadius: 10, transition: "width .5s ease" }} />
              </div>
            </div>
          )}

          {error && !isGenerating && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: generatedHtml ? "auto" : "100%", gap: 12, padding: "16px 24px" }}>
              <div style={{ background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 10, padding: "12px 16px", maxWidth: 440, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#f87171" }}>{error}</p>
              </div>
              {!generatedHtml && <button className="gen-btn" style={{ width: "auto", padding: "10px 28px" }} onClick={() => handleGenerate()}>Try Again</button>}
            </div>
          )}

          {generatedHtml && !isGenerating && (
            <div style={{ height: "100%", animation: "fadeIn .3s ease" }}>
              {activeTab === "preview" ? (
                <iframe srcDoc={generatedHtml} style={{ width: "100%", height: "100%", border: "none", background: "#fff" }} sandbox="allow-scripts allow-same-origin allow-forms" title="Preview" />
              ) : (
                <div style={{ height: "100%", overflow: "auto", background: "rgba(0,0,0,.35)", position: "relative" }}>
                  <div style={{ position: "sticky", top: 0, padding: "8px 16px", background: "rgba(8,11,20,.9)", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 2 }}>
                    <span style={{ fontSize: 11, color: "rgba(226,232,248,.25)", fontFamily: "monospace" }}>HTML · {sizeKb} KB · {outputLines} lines</span>
                    <button className="action-btn" style={{ fontSize: 11, padding: "4px 10px" }} onClick={handleCopy}>{copySuccess ? "✓ Copied" : "Copy"}</button>
                  </div>
                  <textarea readOnly value={generatedHtml} style={{ fontFamily: "'Fira Code', monospace", fontSize: 11.5, lineHeight: 1.65, color: "#4ade80", background: "transparent", border: "none", outline: "none", resize: "none", width: "100%", minHeight: "calc(100% - 36px)", padding: "16px 20px", whiteSpace: "pre" }} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div style={{ background: "#080b14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, border: "2px solid rgba(34,197,94,.3)", borderTopColor: "#4ade80", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
          <div style={{ color: "rgba(226,232,248,.28)", fontSize: 13 }}>Loading builder…</div>
        </div>
      </div>
    }>
      <BuilderInner />
    </Suspense>
  );
}