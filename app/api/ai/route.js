// app/api/ai/route.js
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Something went wrong. Please try again." }, { status: 400 });
    }

    const { prompt, type = "website" } = body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return Response.json({ error: "Something went wrong. Please try again." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }

    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const isArabic = arabicPattern.test(prompt);
    const lang = isArabic ? "ar" : "en";

    const QUALITY_ENFORCEMENT = `
══════════════════════════════════════════════════════════
 ABSOLUTE QUALITY MANDATE — READ BEFORE WRITING ONE LINE
══════════════════════════════════════════════════════════

You are generating a website that must look indistinguishable from a
$15,000 professionally designed project. The bar is Stripe, Apple,
Linear, Loom, Notion. Every pixel must earn its place.

LANGUAGE INSTRUCTION:
${lang === "ar"
  ? `The user's prompt is in Arabic. You MUST generate ALL website content (headings, body copy, navigation, buttons, labels, testimonials, FAQs, footer, etc.) entirely in Arabic. Set <html lang="ar" dir="rtl"> and use RTL layout throughout. Choose Arabic-compatible Google Fonts: "Tajawal" for body and "Cairo" or "Noto Kufi Arabic" for headings. Ensure all text flows right-to-left. All spacing, alignment, flex/grid directions must be mirrored for RTL. Never mix languages unless the brand name itself is in English.`
  : `The user's prompt is in English. Generate ALL website content in English. Set <html lang="en" dir="ltr">.`
}

STYLE DNA INSTRUCTION: If the prompt starts with [STYLE DNA: ...], extract the style description
and apply it as the dominant visual language throughout the entire site.

LOGO INSTRUCTION: If the prompt contains [LOGO: true] or [LOGO_URL: ...], include an <img> tag
in the header/nav area with the provided logo URL, or a styled placeholder div if no URL is given.

──────────────────────────────────────────────────────────
OUTPUT RULES (NON-NEGOTIABLE)
──────────────────────────────────────────────────────────
- Output ONLY raw HTML starting with <!DOCTYPE html>
- Zero markdown, zero explanations, zero code fences
- All CSS inside <style>, all JS inside <script>
- File must be 100% self-contained and immediately renderable
- MINIMUM OUTPUT: 500+ LINES OF CODE — hard floor, not a suggestion
- Target 600–900 lines for websites/landing pages, 500–700 for chatbots
- Every section must be fully fleshed out — no placeholders, no TODO comments
- Every component must have real content, real copy, real details

──────────────────────────────────────────────────────────
DESIGN SYSTEM
──────────────────────────────────────────────────────────
- Define all design tokens as CSS variables at :root level:
  --color-bg, --color-surface, --color-surface-2,
  --color-border, --color-text, --color-text-muted,
  --color-accent, --color-accent-2, --color-accent-3,
  --radius-sm, --radius-md, --radius-lg, --radius-xl,
  --shadow-sm, --shadow-md, --shadow-lg, --shadow-glow,
  --transition-fast, --transition-base, --transition-slow
- Use a distinctive, modern color palette — NOT generic blue/white
- Glassmorphism: backdrop-filter: blur() + semi-transparent surfaces
- Layered shadows for depth
- Consistent 8px spacing grid throughout

──────────────────────────────────────────────────────────
TYPOGRAPHY — PREMIUM REQUIRED
──────────────────────────────────────────────────────────
${lang === "ar"
  ? `Import Arabic Google Fonts via @import in <style>:
- Display/Heading font: "Cairo" or "Noto Kufi Arabic"
- Body font: "Tajawal" or "Almarai"
These fonts must be loaded correctly and applied throughout.`
  : `Import 2 fonts from Google Fonts (use @import in <style>):
- Display font (for headings): choose from:
  Syne, Outfit, Plus Jakarta Sans, Bricolage Grotesque,
  Cabinet Grotesk, Fraunces, Playfair Display, Clash Display
- Body font (for paragraphs/UI): choose from:
  DM Sans, Satoshi, Manrope, General Sans, Work Sans

FORBIDDEN fonts: Arial, Roboto, Inter, system-ui, sans-serif (generic)`
}

Type scale:
  --fs-xs: 11px  --fs-sm: 13px  --fs-base: 15px
  --fs-lg: 18px  --fs-xl: 22px  --fs-2xl: 28px
  --fs-3xl: 36px --fs-4xl: 48px --fs-5xl: 64px --fs-hero: 80px

Line heights: headings 1.05–1.15 · body 1.65–1.8 · labels 1.3

──────────────────────────────────────────────────────────
ANIMATIONS — 3 MANDATORY LAYERS
──────────────────────────────────────────────────────────
1. PAGE LOAD: staggered reveal of hero elements, opacity + translateY
2. SCROLL (IntersectionObserver, threshold 0.15): every section fades+slides in,
   cards reveal sequentially with 80ms stagger, stats count-up animation
3. MICRO-INTERACTIONS: buttons translateY(-2px) + glow on hover,
   cards scale(1.01) + border-color + shadow lift,
   nav links underline draw animation, images zoom on hover

──────────────────────────────────────────────────────────
INTERACTIVE JAVASCRIPT (ALL REQUIRED)
──────────────────────────────────────────────────────────
- Mobile hamburger menu: smooth slide-down drawer with backdrop
- Sticky nav: background + blur on scroll (threshold 60px)
- Smooth scroll: all anchor links use scrollIntoView
- FAQ accordion: height animation, chevron rotate
- Counter animation: requestAnimationFrame count-up for stats
- Modal: at least one modal (contact form or image lightbox)
- Toast notification: success toast after form submit
- Scroll progress bar: thin accent-colored bar at top of page

──────────────────────────────────────────────────────────
IMAGES
──────────────────────────────────────────────────────────
- Unsplash: https://images.unsplash.com/photo-[ID]?w=800&q=80
- Avatars: https://i.pravatar.cc/150?img=N (N = 1–70, vary all)
- Logos/icons: hand-crafted inline SVG
- ALL img tags: loading="lazy" + alt attributes

──────────────────────────────────────────────────────────
CONTENT — REAL COPY ONLY
──────────────────────────────────────────────────────────
- ZERO Lorem Ipsum — anywhere, ever
- Headlines: benefit-driven, specific, emotional
- Testimonials: realistic names, companies, photos, specific quotes
- Stats: believable and relevant
- CTAs: action-oriented with value
- Microcopy: "No credit card · Cancel anytime · Setup in 2 minutes"

──────────────────────────────────────────────────────────
RTL / ARABIC (Arabic prompts only)
──────────────────────────────────────────────────────────
${lang === "ar"
  ? `• <html lang="ar" dir="rtl">
- text-align: right for all body content
- Padding/margin mirrors for RTL logic
- nav, header, footer: RTL-aware alignment`
  : `• Standard LTR layout applies`
}

──────────────────────────────────────────────────────────
RESPONSIVE — MOBILE FIRST
──────────────────────────────────────────────────────────
Breakpoints: 480px (mobile), 768px (tablet), 1024px (small desktop)
- Navigation collapses to hamburger at ≤768px
- Grid layouts go single-column at ≤480px
- Touch-friendly tap targets (min 44px)
- No horizontal scroll on any screen size

──────────────────────────────────────────────────────────
ACCESSIBILITY
──────────────────────────────────────────────────────────
- Semantic HTML: header, nav, main, section, article, footer
- ARIA attributes on interactive elements
- Focus styles visible and styled
- Color contrast ≥ 4.5:1 for body text

──────────────────────────────────────────────────────────
SIZE REQUIREMENT — CRITICAL
──────────────────────────────────────────────────────────
The final HTML MUST be minimum 500 lines. A 300-line output is a FAILURE.
Count lines as you write. Never truncate. Never skip sections.
══════════════════════════════════════════════════════════
FINAL: Raise quality to the absolute maximum. Astonish anyone who sees it.
══════════════════════════════════════════════════════════
`;

    const WEBSITE_SYSTEM = `${QUALITY_ENFORCEMENT}

═══════════════════════════════════════
 WEBSITE — MANDATORY SECTIONS (in order)
═══════════════════════════════════════

1. NAVIGATION (sticky, scroll-aware blur)
   • Logo SVG/CSS wordmark + nav links with animated underline
   • CTA button with gradient + glow
   • Mobile hamburger → full-screen drawer
   • Scroll progress bar at top

2. HERO (100vh)
   • Pre-headline badge pill
   • Main headline: clamp(48px–80px), split into lines
   • Sub-headline + two CTAs (primary gradient + secondary outline)
   • Hero visual: layered gradient bg + floating card elements
   • Trust line: avatars row + "Trusted by X,XXX companies"
   • Animated scroll indicator

3. SOCIAL PROOF / LOGOS BAR
   • "Trusted by teams at" + 5–6 SVG company wordmarks
   • Horizontal marquee animation

4. PROBLEM → SOLUTION (50/50 split)
   • Pain points list (✗ icons) + Solution benefits (✓ icons)

5. FEATURES (6–8 features)
   • Grid of feature cards: SVG icon, title, description
   • Hover: lift + border glow + icon color shift
   • One large "featured" card spanning 2 columns

6. HOW IT WORKS (3 steps)
   • Large decorative numerals + icon + title + description
   • Connecting line/arrow between steps on desktop

7. STATS ROW (4 metrics, animated count-up)

8. TESTIMONIALS (3–4 cards)
   • 5-star SVG rating + quote + avatar + name + role + company

9. TEAM (3–4 members)
   • Avatar + name + role + short bio + social SVG icons

10. PRICING (3 tiers, Monthly/Yearly JS toggle)
    • Middle "Pro" card: gradient border + glow + "Most Popular" badge
    • Feature checklist with ✓ and — items

11. FAQ (6–8 questions, smooth accordion)

12. CTA / CONTACT (full-width gradient bg)
    • Bold headline + email subscribe or CTA button

13. FOOTER (multi-column)
    • Logo + tagline + newsletter + 3–4 link columns + social SVG icons
`;

    const LANDING_SYSTEM = `${QUALITY_ENFORCEMENT}

═══════════════════════════════════════
 LANDING PAGE — MANDATORY SECTIONS (in order)
═══════════════════════════════════════
Focus: CONVERSION. Every section drives toward a single goal action.

1. STICKY NAV (minimal): Logo + 2–3 links + CTA + scroll progress bar

2. HERO (100vh, conversion-optimized)
   • Urgency badge: "🔥 Limited Early Access" or similar
   • Primary headline: bold outcome (clamp 44px–72px)
   • Sub-headline: who it's for + what they get
   • Primary CTA (gradient, large) above the fold
   • Social proof: "⭐ 4.9 · Join 12,480 users · Free forever to start"
   • Hero visual: product screenshot or mockup
   • Secondary micro-CTA: "Watch 2-min demo →"

3. SOCIAL PROOF BAR: Logo marquee, grayscale, infinite scroll

4. PROBLEM STATEMENT
   • 3 pain points with ✗ icons, emotional first-person copy

5. SOLUTION / FEATURES (4–6): Tab or grid, icon + headline + description

6. HOW IT WORKS (3 steps): Numbered, visual, "under 5 minutes"

7. TESTIMONIALS (3–5): Specific results, 5 SVG stars, real names

8. PRICING (3 tiers, Monthly/Yearly toggle)
   • Pro tier: gradient border, glow, badge
   • "No credit card · Cancel anytime" under each CTA
   • 30-day money-back badge

9. FAQ (5–7 questions, smooth accordion)

10. FINAL CTA: Full-width gradient, bold headline, urgency line

11. FOOTER (minimal): Logo + copyright + links + social icons

CONVERSION PSYCHOLOGY:
- Loss aversion, social proof numbers, authority signals
- One goal per section, no decision paralysis
- Urgency where appropriate
`;

    const CHATBOT_SYSTEM = `${QUALITY_ENFORCEMENT}

═══════════════════════════════════════
 AI CHATBOT WIDGET — MANDATORY REQUIREMENTS
═══════════════════════════════════════
Build a fully functional, beautifully designed AI chatbot widget page.

WHAT TO BUILD:
A complete single-page HTML file containing:
1. A landing section introducing the chatbot (hero with name, purpose, CTA)
2. A full-screen or prominent chat interface that is immediately usable
3. The chatbot must have working simulated AI responses (JavaScript-powered)

──────────────────────────────────────────────────────────
CHAT INTERFACE REQUIREMENTS
──────────────────────────────────────────────────────────
LAYOUT:
- Chat window: min 500px tall, max-width 760px, centered or full-width
- Messages: user messages right-aligned (accent color bubble),
  bot messages left-aligned (surface color bubble)
- Input bar: sticky at bottom, textarea + send button
- Avatar: bot has a unique SVG avatar/icon, user has initials bubble
- Timestamps on each message
- Typing indicator: animated 3-dot bounce when bot is "thinking"
- Message animations: fade+slide in on arrival

FEATURES (all must work via JavaScript):
- Send message on Enter key or button click
- Auto-scroll to latest message
- Character counter on input
- Clear/reset chat button
- Copy message button on hover
- Sound toggle button (visual only, no actual sound needed)
- Message reactions: thumbs up/down on bot messages
- Suggested quick-reply chips (3–5 contextual suggestions)
- "Bot is typing..." indicator with 800–1500ms realistic delay
- Smooth auto-resize textarea

SIMULATED AI RESPONSES:
Write 15–25 intelligent, context-aware response templates in JavaScript.
The bot must:
- Detect keywords in user input and respond appropriately
- Have a distinct personality matching the use case
- Give specific, helpful, realistic responses (NOT generic "I can help with that")
- Handle greetings, questions, complaints, pricing, hours, booking, etc.
- Fall back to a helpful default if no keyword matches
- Responses must feel human and natural, not robotic

──────────────────────────────────────────────────────────
LANDING SECTION (above chat)
──────────────────────────────────────────────────────────
- Hero with chatbot name, tagline, and "Start Chat" CTA
- 3 feature pills: "Available 24/7", "Instant replies", "Smart answers"
- Trust indicators: response time stat, satisfaction rate, messages handled
- Clean transition into the chat window below

──────────────────────────────────────────────────────────
DESIGN REQUIREMENTS
──────────────────────────────────────────────────────────
- Premium dark or light theme (match the use case industry)
- Gradient accent colors unique to the chatbot's personality
- Glassmorphism on chat bubbles or window
- Smooth all animations: message arrival, typing dots, send button
- Mobile-first: chat must work perfectly on 375px screens
- The chat window must look like a real product, not a demo

──────────────────────────────────────────────────────────
INITIAL MESSAGES
──────────────────────────────────────────────────────────
On page load, the bot automatically sends 1–2 welcome messages:
- Greeting with the bot's name
- What it can help with (specific to the use case)
- Quick-reply chips for common starting points

──────────────────────────────────────────────────────────
FOOTER SECTION (below chat)
──────────────────────────────────────────────────────────
- Brief "Powered by AI" section
- 3 use case cards showing what the bot excels at
- Simple footer with branding

SIZE: Minimum 500 lines. The chat logic alone should be 150+ lines.
Make the chatbot feel genuinely useful and delightful to interact with.
`;

    const systemPrompts = {
      website: WEBSITE_SYSTEM,
      landing: LANDING_SYSTEM,
      chatbot: CHATBOT_SYSTEM,
    };

    const systemPrompt = systemPrompts[type] || systemPrompts.website;

    // ── GROQ API CALL ──────────────────────────────────────────────────────
    async function callGroqApi(systemP, userP, temperature = 0.6) {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 8192,
          temperature,
          top_p: 0.92,
          messages: [
            { role: "system", content: systemP },
            { role: "user", content: userP },
          ],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`GROQ_HTTP_${res.status}: ${errBody.slice(0, 200)}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("GROQ_EMPTY_RESPONSE");

      return {
        content,
        usage: {
          prompt_tokens: data.usage?.prompt_tokens ?? 0,
          completion_tokens: data.usage?.completion_tokens ?? 0,
        },
      };
    }

    // ── HTML EXTRACTION ────────────────────────────────────────────────────
    // Strips markdown fences and extracts the HTML document.
    // Returns empty string if no valid DOCTYPE found.
    function cleanHtml(raw) {
      if (!raw || typeof raw !== "string") return "";

      let html = raw
        .replace(/^```(?:html)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();

      // Find the actual HTML document start
      const doctypeIndex = html.search(/<!DOCTYPE\s+html>/i);
      if (doctypeIndex === -1) return "";

      html = html.slice(doctypeIndex);

      // Trim anything after </html>
      const closingIndex = html.search(/<\/html\s*>/i);
      if (closingIndex !== -1) {
        html = html.slice(0, closingIndex + "</html>".length);
      }

      return html.trim();
    }

    // ── VALIDATION ─────────────────────────────────────────────────────────
    function validateHtml(html) {
      if (!html) return ["empty_output"];

      const errors = [];
      if (!html.includes("<style"))   errors.push("missing_style");
      if (!html.includes("<script"))  errors.push("missing_script");
      if (!/<\/html\s*>/i.test(html)) errors.push("html_not_closed");

      const lineCount = html.split("\n").length;
      if (lineCount < 500) errors.push(`too_short:${lineCount}`);

      return errors;
    }

    // ── RETRY LOOP ─────────────────────────────────────────────────────────
    let bestHtml = "";
    let bestLineCount = 0;
    let lastError = null;
    let usage = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // Build the user prompt — on retries, be explicit about what failed
        let userPrompt;
        if (attempt === 1) {
          userPrompt = `Build this at maximum quality — write at least 500 lines of HTML, fully fleshed out with real content. Make it astonish anyone who sees it: ${prompt.trim()}`;
        } else {
          const prevLines = bestLineCount > 0 ? bestLineCount : "unknown";
          userPrompt = `Build this again (attempt ${attempt}/3). CRITICAL: Previous attempt produced only ${prevLines} lines. You MUST produce at least 500 lines. Add significantly more sections, more content, more detail, more animations. Be exhaustive: ${prompt.trim()}`;
        }

        const temperature = attempt === 1 ? 0.6 : 0.65 + attempt * 0.05;
        const result = await callGroqApi(systemPrompt, userPrompt, temperature);
        usage = result.usage;

        const candidate = cleanHtml(result.content);
        if (!candidate) {
          lastError = new Error("No valid HTML document found in response");
          continue;
        }

        const candidateLines = candidate.split("\n").length;
        const errors = validateHtml(candidate);

        // Always keep the best candidate so far (most lines, fewest errors)
        if (candidateLines > bestLineCount) {
          bestHtml = candidate;
          bestLineCount = candidateLines;
        }

        // Accept immediately if valid
        if (errors.length === 0) break;

        // On final attempt, accept whatever we have
        if (attempt === 3) break;

        // Otherwise wait and retry
        await new Promise((r) => setTimeout(r, 1000 * attempt));

      } catch (err) {
        lastError = err;
        if (attempt < 3) {
          await new Promise((r) => setTimeout(r, 1200 * attempt));
        }
      }
    }

    // ── FINAL RESPONSE ─────────────────────────────────────────────────────
    if (!bestHtml) {
      throw lastError ?? new Error("All generation attempts failed");
    }

    return Response.json({
      html: bestHtml,
      usage: {
        input_tokens: usage?.prompt_tokens ?? 0,
        output_tokens: usage?.completion_tokens ?? 0,
      },
      meta: {
        lines: bestLineCount,
        provider: "groq",
        model: "llama-3.3-70b-versatile",
        lang,
      },
    });

  } catch (err) {
    console.error("[/api/ai] fatal:", err?.message ?? err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}