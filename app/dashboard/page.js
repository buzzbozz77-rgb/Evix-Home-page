"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const INIT_SITE = {
  name: "My Business", tagline: "Quality Products & Services",
  heroTitle: "Welcome", heroSubtitle: "Discover our collection tailored just for you.",
  heroCTA: "Get Started", primaryColor: "#8b5cf6", accentColor: "#6366f1",
  logoText: "BRAND", phone: "+1 (555) 000-0000", email: "hello@mybusiness.com",
  address: "123 Business St, City", instagram: "@mybusiness",
};

const INIT_PRODUCTS = [
  { id: 1, name: "Premium Package", price: "99", desc: "Everything you need to get started with our premium service.", category: "Service", icon: "◆", active: true },
  { id: 2, name: "Basic Plan", price: "29", desc: "Perfect for individuals and small teams.", category: "Service", icon: "◇", active: true },
  { id: 3, name: "Enterprise", price: "299", desc: "Full-scale enterprise solution with dedicated support.", category: "Service", icon: "□", active: false },
];

const INIT_IMAGES = [
  { id: 1, label: "Hero Background", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" },
  { id: 2, label: "About Section", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" },
  { id: 3, label: "Team Photo", url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80" },
];

const STATS = [
  { label: "Visitors", value: "12,482", change: "+18%", color: "#818cf8" },
  { label: "Conversions", value: "843", change: "+32%", color: "#a78bfa" },
  { label: "Revenue", value: "$24,930", change: "+12%", color: "#34d399" },
  { label: "Avg. Session", value: "3m 42s", change: "+5%", color: "#c084fc" },
];

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "content", label: "Content" },
  { id: "products", label: "Products" },
  { id: "images", label: "Images" },
  { id: "settings", label: "Settings" },
];

export default function Dashboard() {
  const router = useRouter();
  const [section, setSection] = useState("overview");
  const [site, setSite] = useState(INIT_SITE);
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [images, setImages] = useState(INIT_IMAGES);
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);
  const [sidebar, setSidebar] = useState(true);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2400); };
  const upd = (id, k, v) => setProducts(p => p.map(x => x.id === id ? { ...x, [k]: v } : x));
  const del = (id) => setProducts(p => p.filter(x => x.id !== id));
  const addProd = () => { const np = { id: Date.now(), name: "New Item", price: "0", desc: "", category: "Service", icon: "○", active: true }; setProducts(p => [...p, np]); setEditing(np.id); };
  const sf = (k, v) => setSite(s => ({ ...s, [k]: v }));

  return (
    <div style={{ background: "#04060f", color: "#dde3f0", fontFamily: "'Inter',sans-serif", minHeight: "100vh", display: "flex", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:rgba(139,92,246,.22);border-radius:3px}
        .g{background:linear-gradient(135deg,#818cf8,#a78bfa,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .mi{display:flex;align-items:center;gap:9px;padding:7px 12px;border-radius:7px;cursor:pointer;transition:all .2s;font-size:13px;font-weight:400;color:rgba(221,227,240,.32);border:1px solid transparent}
        .mi.on{background:rgba(139,92,246,.1);color:#c4b5fd;border-color:rgba(139,92,246,.22)}
        .mi:hover:not(.on){background:rgba(255,255,255,.03);color:rgba(221,227,240,.65)}
        .sc{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:12px;padding:20px;transition:all .28s;position:relative;overflow:hidden}
        .sc:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.45)}
        .fg{margin-bottom:14px}
        .fl{display:block;font-size:9px;color:rgba(221,227,240,.18);letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px;font-family:'JetBrains Mono',monospace}
        .fi{width:100%;padding:9px 12px;border-radius:7px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06);color:#dde3f0;font-family:'Inter',sans-serif;font-size:13px;outline:none;transition:all .2s}
        .fi:focus{border-color:rgba(139,92,246,.48);box-shadow:0 0 0 3px rgba(139,92,246,.07)}
        textarea.fi{resize:vertical;min-height:80px}
        .bp{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border-radius:7px;font-size:12px;font-weight:600;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;cursor:pointer;transition:all .2s;box-shadow:0 0 14px rgba(139,92,246,.22)}
        .bp:hover{transform:translateY(-1px);box-shadow:0 0 22px rgba(139,92,246,.38)}
        .bg{display:inline-flex;align-items:center;gap:6px;padding:7px 16px;border-radius:7px;font-size:12px;font-weight:500;background:rgba(255,255,255,.04);color:rgba(221,227,240,.5);border:1px solid rgba(255,255,255,.07);cursor:pointer;transition:all .2s}
        .bg:hover{border-color:rgba(139,92,246,.4);color:#c4b5fd;background:rgba(139,92,246,.06)}
        .bd{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:500;background:rgba(239,68,68,.07);color:#fca5a5;border:1px solid rgba(239,68,68,.15);cursor:pointer;transition:all .2s}
        .bd:hover{background:rgba(239,68,68,.13);border-color:rgba(239,68,68,.3)}
        .pc{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:10px;padding:16px 18px;transition:all .25s;cursor:pointer}
        .pc:hover{border-color:rgba(139,92,246,.25);background:rgba(139,92,246,.025)}
        .pc.on{border-color:rgba(139,92,246,.38);background:rgba(139,92,246,.04)}
        .tgl{width:36px;height:19px;border-radius:9px;border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}
        .imgc{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.05);border-radius:10px;overflow:hidden;transition:all .25s}
        .imgc:hover{border-color:rgba(99,102,241,.25);transform:translateY(-2px)}
        .sh{margin-bottom:22px;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.05)}
        .cb{border-radius:3px;transition:filter .22s}
        .cb:hover{filter:brightness(1.3)}
        @media(max-width:768px){.sb{width:0!important;overflow:hidden}}
      `}</style>

      {/* SIDEBAR */}
      <div className="sb" style={{ width: sidebar ? 210 : 0, flexShrink: 0, background: "rgba(6,9,22,.9)", borderRight: "1px solid rgba(255,255,255,.04)", display: "flex", flexDirection: "column", transition: "width .3s ease", overflow: "hidden" }}>
        <div style={{ padding: "14px 13px", borderBottom: "1px solid rgba(255,255,255,.04)", cursor: "pointer", flexShrink: 0 }} onClick={() => router.push("/")}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2.5, border: "1.8px solid rgba(255,255,255,.92)" }} />
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: ".04em", whiteSpace: "nowrap" }}>Ev<span className="g">ix</span></span>
          </div>
        </div>

        <div style={{ flex: 1, padding: "12px 9px", overflowY: "auto" }}>
          <div style={{ fontSize: 8, color: "rgba(221,227,240,.15)", letterSpacing: ".16em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", marginBottom: 7, paddingLeft: 4 }}>Dashboard</div>
          {NAV.map(n => (
            <div key={n.id} className={`mi ${section === n.id ? "on" : ""}`} onClick={() => setSection(n.id)}>
              <span style={{ whiteSpace: "nowrap" }}>{n.label}</span>
            </div>
          ))}
          <div style={{ margin: "16px 0 7px", fontSize: 8, color: "rgba(221,227,240,.15)", letterSpacing: ".16em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", paddingLeft: 4 }}>Tools</div>
          <div className="mi" onClick={() => router.push("/builder")}>AI Builder</div>
        </div>

        <div style={{ padding: "11px 13px", borderTop: "1px solid rgba(255,255,255,.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.05)" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#8b5cf6,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, fontFamily: "'Syne',sans-serif", flexShrink: 0 }}>A</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>Admin</div>
              <div style={{ fontSize: 9, color: "rgba(221,227,240,.25)", fontFamily: "'JetBrains Mono',monospace", whiteSpace: "nowrap" }}>Pro Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* TOPBAR */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 22px", borderBottom: "1px solid rgba(255,255,255,.04)", background: "rgba(4,6,15,.94)", backdropFilter: "blur(16px)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <button onClick={() => setSidebar(s => !s)} style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(221,227,240,.4)", fontSize: 13 }}>☰</button>
            <div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700 }}>{NAV.find(n => n.id === section)?.label}</h1>
              <p style={{ fontSize: 9, color: "rgba(221,227,240,.22)", fontFamily: "'JetBrains Mono',monospace" }}>Evix Dashboard</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 6, background: "rgba(52,211,153,.06)", border: "1px solid rgba(52,211,153,.17)" }}>
              <span style={{ width: 4.5, height: 4.5, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
              <span style={{ fontSize: 10, color: "#6ee7b7", fontFamily: "'JetBrains Mono',monospace" }}>Live</span>
            </div>
            <button className="bg" style={{ padding: "5px 14px", fontSize: 11 }} onClick={() => router.push("/builder")}>AI Builder</button>
            <button className="bp" style={{ padding: "6px 16px", fontSize: 12 }} onClick={save}>{saved ? "✓ Saved" : "Save"}</button>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>

          {/* OVERVIEW */}
          {section === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12, marginBottom: 20 }}>
                {STATS.map(s => (
                  <div key={s.label} className="sc">
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${s.color}50,transparent)` }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, marginTop: 2, opacity: .7 }} />
                      <span style={{ fontSize: 9, color: "#34d399", fontFamily: "'JetBrains Mono',monospace", background: "rgba(52,211,153,.07)", border: "1px solid rgba(52,211,153,.16)", padding: "1px 6px", borderRadius: 100 }}>{s.change}</span>
                    </div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 3, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 9, color: "rgba(221,227,240,.22)", fontFamily: "'JetBrains Mono',monospace", letterSpacing: ".1em", textTransform: "uppercase" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 12, padding: "18px 20px", marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 13.5, fontWeight: 700, marginBottom: 2 }}>Weekly Traffic</h3>
                    <p style={{ fontSize: 9.5, color: "rgba(221,227,240,.22)", fontFamily: "'JetBrains Mono',monospace" }}>Last 7 days</p>
                  </div>
                  <span style={{ fontSize: 9, color: "#a5b4fc", fontFamily: "'JetBrains Mono',monospace", background: "rgba(99,102,241,.07)", border: "1px solid rgba(99,102,241,.17)", padding: "3px 9px", borderRadius: 5 }}>Live</span>
                </div>
                <div style={{ display: "flex", gap: 6, height: 90, alignItems: "flex-end" }}>
                  {[65,80,55,90,72,88,95].map((h, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                      <div className="cb" style={{ width: "100%", height: `${h}%`, background: `linear-gradient(to top,rgba(99,102,241,.5),rgba(139,92,246,.3))`, borderRadius: "3px 3px 0 0", minHeight: 3 }} />
                      <span style={{ fontSize: 8, color: "rgba(221,227,240,.16)", fontFamily: "'JetBrains Mono',monospace" }}>{["M","T","W","T","F","S","S"][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 12, padding: "18px 20px" }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 13.5, fontWeight: 700, marginBottom: 12 }}>Quick Actions</h3>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[["Content","content"],["Products","products"],["Images","images"],["Settings","settings"],["AI Builder","/builder"]].map(([l, t]) => (
                    <button key={l} className="bg" onClick={() => t.startsWith("/") ? router.push(t) : setSection(t)}>{l}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTENT */}
          {section === "content" && (
            <div style={{ maxWidth: 720 }}>
              <div className="sh">
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 3 }}>Website Content</h2>
                <p style={{ color: "rgba(221,227,240,.32)", fontSize: 13, fontWeight: 300 }}>Changes reflect on your live site after saving.</p>
              </div>
              {[
                { title: "Hero Section", color: "#818cf8", fields: [["heroTitle","Hero Title"],["heroCTA","CTA Text"]], textarea: ["heroSubtitle","Subtitle"] },
                { title: "Brand", color: "#a78bfa", fields: [["name","Business Name"],["logoText","Logo Text"],["tagline","Tagline"]], colorField: "primaryColor" },
                { title: "Contact", color: "#c084fc", fields: [["phone","Phone"],["email","Email"],["address","Address"],["instagram","Instagram"]] },
              ].map(block => (
                <div key={block.title} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 10, padding: "20px 22px", marginBottom: 14 }}>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 12.5, fontWeight: 600, marginBottom: 14, color: block.color }}>{block.title}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 }}>
                    {block.fields.map(([k,l]) => (
                      <div key={k} className="fg" style={{ marginBottom: 0 }}>
                        <label className="fl">{l}</label>
                        <input className="fi" value={site[k] || ""} onChange={e => sf(k, e.target.value)} />
                      </div>
                    ))}
                    {block.colorField && (
                      <div className="fg" style={{ marginBottom: 0 }}>
                        <label className="fl">Color</label>
                        <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                          <input type="color" value={site[block.colorField]} onChange={e => sf(block.colorField, e.target.value)} style={{ width: 36, height: 34, borderRadius: 6, border: "1px solid rgba(255,255,255,.09)", background: "transparent", cursor: "pointer" }} />
                          <input className="fi" value={site[block.colorField]} onChange={e => sf(block.colorField, e.target.value)} style={{ flex: 1 }} />
                        </div>
                      </div>
                    )}
                  </div>
                  {block.textarea && (
                    <div className="fg" style={{ marginTop: 11 }}>
                      <label className="fl">{block.textarea[1]}</label>
                      <textarea className="fi" value={site[block.textarea[0]] || ""} onChange={e => sf(block.textarea[0], e.target.value)} />
                    </div>
                  )}
                </div>
              ))}
              <button className="bp" onClick={save}>{saved ? "✓ Saved" : "Save Changes"}</button>
            </div>
          )}

          {/* PRODUCTS */}
          {section === "products" && (
            <div>
              <div className="sh" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 3 }}>Products & Services</h2>
                  <p style={{ color: "rgba(221,227,240,.32)", fontSize: 13, fontWeight: 300 }}>{products.length} items · {products.filter(p=>p.active).length} active</p>
                </div>
                <button className="bp" onClick={addProd}>+ Add</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {products.map(p => (
                  <div key={p.id} className={`pc ${editing === p.id ? "on" : ""}`} onClick={() => setEditing(editing === p.id ? null : p.id)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editing === p.id ? 16 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11, flex: 1, minWidth: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(139,92,246,.09)", border: "1px solid rgba(139,92,246,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, color: "#c4b5fd" }}>{p.icon}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 500, fontSize: 13.5, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                          <div style={{ fontSize: 10, color: "rgba(221,227,240,.3)", fontFamily: "'JetBrains Mono',monospace" }}>{p.category} · ${p.price}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <button className="tgl" style={{ background: p.active ? "rgba(52,211,153,.38)" : "rgba(255,255,255,.07)" }} onClick={e => { e.stopPropagation(); upd(p.id, "active", !p.active); }}>
                          <span style={{ position: "absolute", top: 2, left: p.active ? 18 : 2, width: 15, height: 15, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
                        </button>
                        <button className="bd" onClick={e => { e.stopPropagation(); del(p.id); }}>×</button>
                      </div>
                    </div>
                    {editing === p.id && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} onClick={e => e.stopPropagation()}>
                        {[["name","Name"],["price","Price ($)"],["category","Category"],["icon","Icon"]].map(([k,l]) => (
                          <div key={k} className="fg" style={{ marginBottom: 0 }}>
                            <label className="fl">{l}</label>
                            <input className="fi" value={p[k]} onChange={e => upd(p.id, k, e.target.value)} />
                          </div>
                        ))}
                        <div className="fg" style={{ marginBottom: 0, gridColumn: "1/-1" }}>
                          <label className="fl">Description</label>
                          <textarea className="fi" value={p.desc} onChange={e => upd(p.id, "desc", e.target.value)} style={{ minHeight: 60 }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IMAGES */}
          {section === "images" && (
            <div>
              <div className="sh">
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 3 }}>Image Manager</h2>
                <p style={{ color: "rgba(221,227,240,.32)", fontSize: 13, fontWeight: 300 }}>Paste any image URL to update your website images.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
                {images.map(img => (
                  <div key={img.id} className="imgc">
                    <div style={{ height: 148, overflow: "hidden", background: "rgba(255,255,255,.025)", position: "relative" }}>
                      <img src={img.url} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display="none"} />
                      <div style={{ position: "absolute", top: 7, left: 7, padding: "2px 8px", borderRadius: 4, background: "rgba(4,6,15,.8)", backdropFilter: "blur(8px)", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: "rgba(221,227,240,.45)" }}>{img.label}</div>
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <label className="fl">{img.label}</label>
                      <input className="fi" value={img.url} onChange={e => setImages(imgs => imgs.map(i => i.id === img.id ? { ...i, url: e.target.value } : i))} placeholder="https://..." style={{ fontSize: 11 }} />
                    </div>
                  </div>
                ))}
                <div style={{ background: "rgba(255,255,255,.018)", border: "1.5px dashed rgba(255,255,255,.06)", borderRadius: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, cursor: "pointer", transition: "all .2s", gap: 9 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(139,92,246,.32)"; e.currentTarget.style.background="rgba(139,92,246,.025)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,.06)"; e.currentTarget.style.background="rgba(255,255,255,.018)"; }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(139,92,246,.09)", border: "1px solid rgba(139,92,246,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#c4b5fd" }}>+</div>
                  <div style={{ fontSize: 12, color: "rgba(221,227,240,.3)", fontWeight: 400 }}>Add Image</div>
                </div>
              </div>
              <div style={{ marginTop: 18 }}>
                <button className="bp" onClick={save}>{saved ? "✓ Saved" : "Save"}</button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {section === "settings" && (
            <div style={{ maxWidth: 600 }}>
              <div className="sh">
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 3 }}>Settings</h2>
                <p style={{ color: "rgba(221,227,240,.32)", fontSize: 13, fontWeight: 300 }}>Manage your account, SEO, and integrations.</p>
              </div>
              {[
                { t: "Account", c: "#818cf8", f: [["Full Name","Admin User"],["Email","admin@evix.com"]] },
                { t: "Notifications", c: "#a78bfa", f: [["Report Email","admin@evix.com"],["Frequency","Weekly"]] },
                { t: "SEO & Meta", c: "#c084fc", f: [["Meta Title","My Business — Services"],["Meta Description","Quality services for modern businesses."]] },
              ].map(b => (
                <div key={b.t} style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 10, padding: "18px 20px", marginBottom: 12 }}>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 12.5, fontWeight: 600, marginBottom: 13, color: b.c }}>{b.t}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {b.f.map(([l,v]) => (
                      <div key={l} className="fg" style={{ marginBottom: 0 }}>
                        <label className="fl">{l}</label>
                        <input className="fi" defaultValue={v} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ background: "rgba(239,68,68,.03)", border: "1px solid rgba(239,68,68,.1)", borderRadius: 10, padding: "18px 20px", marginBottom: 18 }}>
                <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 12.5, fontWeight: 600, marginBottom: 7, color: "#fca5a5" }}>Danger Zone</h3>
                <p style={{ color: "rgba(221,227,240,.26)", fontSize: 12, marginBottom: 12, fontWeight: 300 }}>Irreversible actions. Proceed with caution.</p>
                <button className="bd">Delete All Data</button>
              </div>
              <button className="bp" onClick={save}>{saved ? "✓ Saved" : "Save Settings"}</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}