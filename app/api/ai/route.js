// app/api/ai/route.js
// ── Groq API Integration (FREE TIER) ──────────────────────────────────────────
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { prompt, type = "website" } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return Response.json({ error: "Prompt is required" }, { status: 400 });
    }

    // ── تغيير 1: متغير البيئة للـ Groq ───────────────────────────────────────
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "API key not configured. Please check your environment variables." }, { status: 500 });
    }

    const QUALITY_ENFORCEMENT = `
══════════════════════════════════════════════════════════
 ABSOLUTE QUALITY MANDATE — READ BEFORE WRITING ONE LINE
══════════════════════════════════════════════════════════

You are generating a website that must look indistinguishable from a
$15,000 professionally designed project. The bar is Stripe, Apple,
Linear, Loom, Notion. Every pixel must earn its place.

STYLE DNA INSTRUCTION: If the prompt starts with [STYLE DNA: ...], extract the style description
and apply it as the dominant visual language throughout the entire site. Every color, font,
spacing, and visual element must reflect that style DNA precisely.

LOGO INSTRUCTION: If the prompt contains [LOGO: true] or [LOGO_URL: ...], include an <img> tag
in the header/nav area with the provided logo URL, or a styled placeholder div if no URL is given.
The logo must be prominent and correctly sized (max-height: 60px in nav, larger in hero if needed).

──────────────────────────────────────────────────────────
OUTPUT RULES (NON-NEGOTIABLE)
──────────────────────────────────────────────────────────
• Output ONLY raw HTML starting with <!DOCTYPE html>
• Zero markdown, zero explanations, zero code fences
• All CSS inside <style>, all JS inside <script>
• File must be 100% self-contained and immediately renderable
• MINIMUM OUTPUT: 500+ LINES OF CODE — this is a hard floor, not a suggestion
• Target 600–900 lines for websites, 500–700 for landing pages
• Every section must be fully fleshed out — no placeholders, no "TODO" comments
• Every component must have real content, real copy, real details

──────────────────────────────────────────────────────────
DESIGN SYSTEM
──────────────────────────────────────────────────────────
• Define all design tokens as CSS variables at :root level:
  --color-bg, --color-surface, --color-surface-2,
  --color-border, --color-text, --color-text-muted,
  --color-accent, --color-accent-2, --color-accent-3,
  --radius-sm, --radius-md, --radius-lg, --radius-xl,
  --shadow-sm, --shadow-md, --shadow-lg, --shadow-glow,
  --transition-fast, --transition-base, --transition-slow
• Use a distinctive, modern color palette — NOT generic blue/white
• Glassmorphism: backdrop-filter: blur() + semi-transparent surfaces
• Layered shadows for depth (box-shadow with multiple layers)
• Consistent 8px spacing grid throughout

──────────────────────────────────────────────────────────
TYPOGRAPHY — PREMIUM REQUIRED
──────────────────────────────────────────────────────────
Import 2 fonts from Google Fonts (use @import in <style>):
• Display font (for headings): choose from:
  Syne, Outfit, Plus Jakarta Sans, Bricolage Grotesque,
  Cabinet Grotesk, Fraunces, Playfair Display, Clash Display
• Body font (for paragraphs/UI): choose from:
  DM Sans, Satoshi, Manrope, General Sans, Work Sans

FORBIDDEN fonts: Arial, Roboto, Inter, system-ui, sans-serif (generic)

Type scale (px, strictly followed):
  --fs-xs: 11px  --fs-sm: 13px  --fs-base: 15px
  --fs-lg: 18px  --fs-xl: 22px  --fs-2xl: 28px
  --fs-3xl: 36px --fs-4xl: 48px --fs-5xl: 64px --fs-hero: 80px

Line heights: headings 1.05–1.15 · body 1.65–1.8 · labels 1.3

──────────────────────────────────────────────────────────
ANIMATIONS — 3 MANDATORY LAYERS
──────────────────────────────────────────────────────────
1. PAGE LOAD (on DOMContentLoaded):
   • Staggered reveal of hero elements with animation-delay
   • Smooth opacity + translateY transitions
   • Logo / brand mark entrance animation

2. SCROLL ANIMATIONS (IntersectionObserver, threshold 0.15):
   • Every section fades + slides in when entering viewport
   • Cards reveal sequentially with 80ms stagger per card
   • Numbers/stats: count-up animation from 0 to final value
   • Progress bars: animate width on scroll entry

3. MICRO-INTERACTIONS (hover/focus):
   • Buttons: translateY(-2px) + box-shadow glow on hover
   • Cards: subtle scale(1.01) + border-color change + shadow lift
   • Nav links: custom underline draw animation (scaleX)
   • Images: subtle zoom on hover (transform: scale(1.04))
   • Form inputs: smooth border-color + shadow transition on focus

PARALLAX: Apply to hero background (subtle, max 20px movement)

──────────────────────────────────────────────────────────
INTERACTIVE JAVASCRIPT (ALL REQUIRED)
──────────────────────────────────────────────────────────
• Mobile hamburger menu: smooth slide-down drawer with backdrop
• Sticky nav: background + blur changes on scroll (threshold 60px)
• Smooth scroll: all anchor links use scrollIntoView behavior smooth
• FAQ accordion: height animation (max-height transition), chevron rotate
• Counter animation: requestAnimationFrame count-up for stats
• Tab/filter system: if showing projects/services, add working tabs
• Modal: at least one modal (e.g., contact form, image lightbox)
• Toast notification: show success toast after form submit
• Scroll progress bar: thin accent-colored bar at top of page

──────────────────────────────────────────────────────────
IMAGES (working URLs only)
──────────────────────────────────────────────────────────
• Unsplash: https://images.unsplash.com/photo-[ID]?w=800&q=80
  Use real photo IDs matching the content (search mentally for best fit)
• Avatars: https://i.pravatar.cc/150?img=N  (N = 1–70, vary all)
• Logos/icons: hand-crafted inline SVG (no external icon libs)
• ALL img tags need loading="lazy" and alt attributes

──────────────────────────────────────────────────────────
CONTENT — REAL, COMPELLING COPY ONLY
──────────────────────────────────────────────────────────
• ZERO Lorem Ipsum — anywhere, ever
• Headlines: benefit-driven, specific, emotional
• Body copy: clear, confident, human — like a great copywriter wrote it
• Testimonials: realistic names, companies, photos, specific quotes
• Stats/numbers: believable and relevant (e.g., "2,847 clients" not "1000+")
• CTAs: action-oriented with value ("Start Your Free Trial", "See It Live")
• Microcopy: "No credit card · Cancel anytime · Setup in 2 minutes"

──────────────────────────────────────────────────────────
RESPONSIVE — MOBILE FIRST
──────────────────────────────────────────────────────────
Breakpoints:
  @media (max-width: 480px)  — mobile
  @media (max-width: 768px)  — tablet
  @media (max-width: 1024px) — small desktop

Requirements:
• Navigation collapses to hamburger at ≤768px
• Grid layouts go single-column at ≤480px
• Hero font sizes scale down proportionally
• Touch-friendly tap targets (min 44px)
• No horizontal scroll on any screen size

──────────────────────────────────────────────────────────
ACCESSIBILITY
──────────────────────────────────────────────────────────
• Semantic HTML: <header>, <nav>, <main>, <section>, <article>, <footer>
• ARIA attributes on interactive elements
• Focus styles visible and styled (not default outline)
• Color contrast ≥ 4.5:1 for body text

──────────────────────────────────────────────────────────
SIZE REQUIREMENT — CRITICAL
──────────────────────────────────────────────────────────
The final HTML file MUST be at minimum 500 lines long.
Count your lines as you write. If you reach 400 lines and haven't
finished all sections, add MORE detail — don't skip sections.
A 300-line output is a FAILURE. A 600-line output is a SUCCESS.

══════════════════════════════════════════════════════════
FINAL INSTRUCTION: Raise quality to the absolute maximum.
Write every section fully. Never truncate. Never skip.
The result must astonish anyone who sees it.
══════════════════════════════════════════════════════════
`;

    const WEBSITE_SYSTEM = `${QUALITY_ENFORCEMENT}

═══════════════════════════════════════
 WEBSITE — MANDATORY SECTIONS (in order)
═══════════════════════════════════════
You MUST include ALL of these sections. Skipping any section is a failure.
Each section must be fully written with real content. No placeholders.

1. NAVIGATION (sticky, with scroll-aware background blur)
   • Logo: SVG or CSS-crafted wordmark (not just text)
   • Nav links with animated underline hover effect
   • CTA button with gradient + glow
   • Mobile: hamburger → full-screen drawer with backdrop
   • Progress indicator bar at very top of page

2. HERO (full viewport height, 100vh)
   • Pre-headline badge: small pill with icon + label
   • Main headline: massive (clamp 48px–80px), split into lines
   • Sub-headline: 1–2 lines of supporting copy
   • Two CTAs: primary (gradient) + secondary (outline/ghost)
   • Hero visual: layered composition — gradient background, floating
     card elements or mockup, decorative blobs/shapes
   • Trust line: avatars row + "Trusted by X,XXX companies"
   • Animated scroll indicator (bouncing chevron)

3. SOCIAL PROOF / LOGOS BAR
   • "Trusted by teams at" label
   • 5–6 company logos (SVG text-based wordmarks, grayscale)
   • Subtle horizontal scroll marquee animation

4. PROBLEM → SOLUTION SECTION
   • Split 50/50 layout
   • Left: Pain points list with ✗ icons
   • Right: Solution benefits with ✓ icons
   • Central visual divider or connecting element

5. FEATURES / CAPABILITIES (6–8 features)
   • Section label + bold headline + supporting paragraph
   • Grid of feature cards: each with custom SVG icon, title, description
   • Cards have hover: lift + border glow + icon color shift
   • One "featured" large card spanning 2 columns

6. HOW IT WORKS (3-step process)
   • Numbered steps with large numerals as decoration
   • Each step: icon + title + description + visual
   • Connecting line/arrow between steps (desktop)
   • Timeline style on mobile

7. STATS / ACHIEVEMENTS ROW
   • 4 metrics with animated count-up numbers
   • Each stat: large number + unit + label
   • Subtle dividers between stats
   • Background: slight gradient or surface color

8. TESTIMONIALS (3–4 cards in grid or slider)
   • Each: 5-star rating (SVG stars), quote text, avatar, name, role, company
   • Hover: lift + subtle glow
   • Rotating quotes or static grid — both acceptable

9. TEAM / ABOUT SECTION
   • 3–4 team member cards
   • Avatar, name, role, short bio, social icons (SVG)
   • Fun hover: slight card tilt or accent color reveal

10. PRICING (3 tiers)
    • Pill toggle: Monthly / Yearly (with JS switching)
    • Free, Pro, Enterprise cards
    • Middle "Pro" card: gradient border + glow + "Most Popular" badge
    • Feature checklist with ✓ and — (not available) items
    • CTA button per card

11. FAQ (6–8 questions, accordion)
    • Smooth max-height JS animation, not abrupt jump
    • Chevron rotates 180deg on open
    • Only one open at a time

12. CTA / CONTACT SECTION
    • Full-width gradient or image background
    • Bold headline + supporting line
    • Inline email subscribe form OR large CTA button
    • Trust signals underneath

13. FOOTER (multi-column)
    • Logo + tagline + newsletter input
    • 3–4 link columns (Product, Company, Resources, Legal)
    • Social icons: SVG (Twitter/X, LinkedIn, GitHub, Instagram)
    • Bottom bar: copyright + dark mode toggle hint
`;

    const LANDING_SYSTEM = `${QUALITY_ENFORCEMENT}

═══════════════════════════════════════
 LANDING PAGE — MANDATORY SECTIONS (in order)
═══════════════════════════════════════
Focus: CONVERSION. Every section drives toward a single goal action.
You MUST include ALL of these sections fully written. No placeholders.

1. STICKY NAV (minimal)
   • Logo + 2–3 links + CTA button
   • Scroll-aware: transparent → blurred surface on scroll
   • Progress bar at top of page

2. HERO (100vh, conversion-optimized)
   • Urgency badge: "🔥 Limited Early Access" or similar
   • Primary headline: bold outcome statement (clamp 44px–72px)
   • Sub-headline: who it's for + what they get
   • Primary CTA (gradient, large) — above the fold
   • Social proof line: "⭐ 4.9 · Join 12,480 users · Free forever to start"
   • Hero visual: product screenshot, mockup, or illustration (prominent)
   • Secondary micro-CTA: "Watch 2-min demo →" (text link style)

3. SOCIAL PROOF BAR
   • "As featured in" or "Used by teams at"
   • Logo marquee (horizontal scroll, infinite, grayscale)

4. PROBLEM STATEMENT
   • Relatable pain: "You're tired of..." section
   • 3 pain points with vivid descriptions and ✗ icons
   • Emotional, first-person resonant copy

5. SOLUTION / FEATURES (4–6 features)
   • "Introducing [Product]" headline
   • Tab or grid of features
   • Each: icon, headline, 2-line description
   • One large featured card with screenshot/visual

6. HOW IT WORKS (3 steps)
   • Numbered, visual, concise
   • Estimated time: "Get started in under 5 minutes"
   • Visual demo or animated mockup concept

7. SOCIAL PROOF — TESTIMONIALS (3–5 cards)
   • Real-sounding names, photos, company names
   • Specific results: "Saved 14 hours/week" not just "Great tool!"
   • 5 SVG stars on each card

8. PRICING (3 tiers with clear value hierarchy)
   • Free / Pro / Team (or equivalent)
   • Monthly/Yearly toggle with savings callout ("Save 40%")
   • Pro tier: gradient border, glow, badge, slightly larger
   • Under each CTA: "No credit card · Cancel anytime"
   • Money-back guarantee badge (30-day)

9. FAQ (5–7 questions)
   • Address objections: pricing, security, integration, cancellation
   • Smooth accordion with JS

10. FINAL CTA SECTION
    • Full-width section, bold gradient background
    • Headline: "Ready to [primary benefit]?"
    • Large CTA button + social proof line underneath
    • Urgency: "Join X,XXX people already using [Product]"

11. FOOTER (minimal)
    • Logo + copyright + 4–5 links + social icons

CONVERSION PSYCHOLOGY APPLIED THROUGHOUT:
• Loss aversion: "Don't miss out on..."
• Social proof: numbers, logos, testimonials everywhere
• Authority: media mentions, certifications, stats
• Clarity: one goal per section, no decision paralysis
• Urgency: "Limited spots" or "Prices go up soon" where appropriate
`;

    const systemPrompts = {
      website: WEBSITE_SYSTEM,
      landing: LANDING_SYSTEM,
    };

    const systemPrompt = systemPrompts[type] || systemPrompts.website;

    // ── تغيير 2: Groq API CALL ────────────────────────────────────────────────
    async function callGroqApi(systemP, userP, attempt = 1) {
      // ── تغيير 3: endpoint Groq ─────────────────────────────────────────────
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          // ── تغيير 4: موديل Groq المجاني ───────────────────────────────────
          // خيارات مجانية قوية:
          // "llama-3.3-70b-versatile"  → جودة عالية (1000 طلب/يوم)
          // "llama-3.1-8b-instant"     → سريع جداً (14400 طلب/يوم)
          // "meta-llama/llama-4-scout-17b-16e-instruct" → الأحدث
          model: "llama-3.3-70b-versatile",
          max_tokens: 8192,
          temperature: attempt === 1 ? 0.6 : 0.7,
          top_p: 0.92,
          messages: [
            { role: "system", content: systemP },
            { role: "user", content: userP },
          ],
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Groq API error: ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response received from Groq. Please try again.");

      return {
        content,
        usage: {
          prompt_tokens: data.usage?.prompt_tokens ?? 0,
          completion_tokens: data.usage?.completion_tokens ?? 0,
        }
      };
    }

    function cleanHtml(raw) {
      let html = raw
        .replace(/^```(?:html)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      const match = html.match(/<!DOCTYPE html>[\s\S]*/i);
      if (match) html = match[0];
      return html;
    }

    function validateOutput(html) {
      const errors = [];
      if (!html.includes("<style")) errors.push("missing <style>");
      if (!html.includes("<script")) errors.push("missing <script>");
      if (!html.includes("</html>")) errors.push("HTML not closed");
      const lineCount = html.split("\n").length;
      if (lineCount < 500) errors.push(`output too short: ${lineCount} lines (minimum 500)`);
      return errors;
    }

    let html = "";
    let lastError = null;
    let usage = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const lineCount = html ? html.split("\n").length : 0;
        const userPrompt = attempt === 1
          ? `Build this at maximum quality — write at least 500 lines of HTML code, fully fleshed out with real content. Make it astonish anyone who sees it: ${prompt.trim()}`
          : `Build this again (attempt ${attempt}). IMPORTANT: Your previous output was too short (${lineCount} lines). You MUST write at least 500 lines of complete, detailed HTML. Be SIGNIFICANTLY more detailed, add more sections, more content, more animations. Push quality and size to the absolute limit: ${prompt.trim()}`;

        // ── تغيير 5: استدعاء Groq ────────────────────────────────────────────
        const result = await callGroqApi(systemPrompt, userPrompt, attempt);
        const candidate = cleanHtml(result.content);
        usage = result.usage;

        const errors = validateOutput(candidate);

        if (errors.length === 0) {
          html = candidate;
          break;
        }

        if (attempt === 3) {
          html = candidate;
        }

      } catch (err) {
        lastError = err;
        if (attempt === 3) throw err;
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }

    if (!html && lastError) throw lastError;

    const lineCount = html.split("\n").length;

    return Response.json({
      html,
      usage: {
        input_tokens: usage?.prompt_tokens ?? 0,
        output_tokens: usage?.completion_tokens ?? 0,
      },
      meta: {
        lines: lineCount,
        // ── تغيير 6: تحديث الـ provider ─────────────────────────────────────
        provider: "groq",
        model: "llama-3.3-70b-versatile",
      }
    });

  } catch (error) {
    const message = error.message || "Generation failed. Please try again.";

    const safeMessage = (
      message.toLowerCase().includes("groq") ||
      message.toLowerCase().includes("api key") ||
      message.toLowerCase().includes("bearer") ||
      message.toLowerCase().includes("unauthorized") ||
      message.toLowerCase().includes("401") ||
      message.toLowerCase().includes("403") ||
      message.toLowerCase().includes("429")
    )
      ? "Generation failed. Please try again."
      : message;

    return Response.json({ error: safeMessage }, { status: 500 });
  }
}