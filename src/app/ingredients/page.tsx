"use client";
import { useState } from "react";

// --- Types ---
type Rating = "avoid" | "approved" | "caution";
const DOT: Record<Rating, string> = { avoid: "#C41E3A", approved: "#0D9488", caution: "#E5A100" };
interface GuideCategory { cat: string; desc: string; rating: Rating; }
interface GuideIngredient { name: string; ratings: Rating[]; categories: GuideCategory[]; }

// --- Intelligence Engine Data ---
const DIETS: Record<string, { label: string; emoji: string; color: string; desc: string; avoidList: string[]; cautionList: string[] }> = {
  general: { label: "General", emoji: "🍽️", color: "#0D9488", desc: "Overall health-conscious", avoidList: ["high fructose corn syrup","hydrogenated","partially hydrogenated","artificial color","red 40","yellow 5","yellow 6","blue 1","aspartame","sucralose","acesulfame","sodium nitrite","sodium nitrate","bha","bht","tbhq","msg","monosodium glutamate","carrageenan","sodium benzoate","titanium dioxide"], cautionList: ["natural flavors","sugar","corn syrup","maltodextrin","dextrose","soy lecithin","modified food starch","xanthan gum","caramel color","palm oil","canola oil","soybean oil","vegetable oil"] },
  vegan: { label: "Vegan", emoji: "🌱", color: "#16A34A", desc: "No animal-derived ingredients", avoidList: ["whey","casein","lactose","gelatin","collagen","honey","milk","cream","butter","cheese","egg","eggs","yogurt","ghee","fish","chicken","beef","pork","turkey","bone broth"], cautionList: ["natural flavors","vitamin d3","glycerin","sugar","l-cysteine"] },
  keto: { label: "Keto", emoji: "🥑", color: "#7C3AED", desc: "Low-carb, high-fat", avoidList: ["sugar","cane sugar","brown sugar","high fructose corn syrup","corn syrup","agave","maple syrup","honey","dextrose","maltose","sucrose","rice","wheat flour","all-purpose flour","corn starch","potato starch","maltodextrin"], cautionList: ["natural flavors","milk","cream","oats","barley","erythritol","stevia","monk fruit"] },
  glutenfree: { label: "Gluten-Free", emoji: "🌾", color: "#EA580C", desc: "No gluten-containing grains", avoidList: ["wheat","wheat flour","enriched wheat flour","whole wheat flour","all-purpose flour","durum","semolina","spelt","kamut","farro","barley","rye","triticale","malt","malt extract","seitan","couscous","bulgur"], cautionList: ["natural flavors","modified food starch","dextrin","maltodextrin","caramel color","soy sauce","oats"] },
  dairyfree: { label: "Dairy-Free", emoji: "🥛", color: "#2563EB", desc: "No milk-derived ingredients", avoidList: ["milk","whole milk","skim milk","nonfat milk","cream","heavy cream","butter","ghee","cheese","cheddar","parmesan","mozzarella","cream cheese","sour cream","yogurt","whey","whey protein","casein","caseinate","lactose","buttermilk","condensed milk","evaporated milk","ice cream"], cautionList: ["natural flavors","caramel color","lactic acid","chocolate","cocoa butter"] },
};
const RULES: Record<string, Record<string, { cls: string; exp: string }>> = {};
Object.entries(DIETS).forEach(([k, d]) => {
  RULES[k] = {};
  d.avoidList.forEach(i => { RULES[k][i.toLowerCase()] = { cls: "avoid", exp: `Flagged as avoid for ${d.label} diet.` }; });
  d.cautionList.forEach(i => { RULES[k][i.toLowerCase()] = { cls: "caution", exp: `Use with caution for ${d.label} diet.` }; });
});
function analyzeIngredients(raw: string, diet: string) {
  const ings = raw.split(/,|;|\n/).map(s => s.trim().replace(/\.$/, "")).filter(Boolean);
  const rules = RULES[diet] || RULES.general;
  const res = ings.map(ing => {
    const low = ing.toLowerCase();
    for (const [key, rule] of Object.entries(rules)) { if (low.includes(key)) return { name: ing, cls: rule.cls, exp: rule.exp }; }
    return { name: ing, cls: "ok", exp: "No concerns identified." };
  });
  const av = res.filter(r => r.cls === "avoid").length, ca = res.filter(r => r.cls === "caution").length, ok = res.filter(r => r.cls === "ok").length;
  const score = res.length > 0 ? Math.round(Math.max(0, Math.min(100, 100 - (av * 25) - (ca * 8)))) : 0;
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 50 ? "D" : "F";
  return { results: res, av, ca, ok, total: res.length, score, grade };
}
function genSummary(r: any, diet: string, name: string) {
  const d = DIETS[diet]; const avoids = r.results.filter((x: any) => x.cls === "avoid");
  let opening = `${name} scores ${r.score}/100 for ${d.label.toLowerCase()}.`;
  opening += r.score >= 85 ? " Strong choice!" : r.score >= 70 ? " Decent with minor concerns." : r.score >= 50 ? " Several ingredients need attention." : " Multiple conflicts with your goals.";
  const concerns = avoids.length > 0 ? `Avoid: ${avoids.map((i: any) => i.name).join(", ")}.` : "";
  const rec = r.score < 70 ? `Consider alternatives for ${d.label.toLowerCase()} diet.` : r.score < 85 ? "Check flagged ingredients before purchasing." : "";
  const swaps: string[] = [];
  avoids.slice(0, 3).forEach((i: any) => {
    const n = i.name.toLowerCase();
    if (n.includes("sugar") || n.includes("corn syrup") || n.includes("fructose")) swaps.push(`${i.name} → monk fruit/stevia`);
    else if (n.includes("wheat") || n.includes("flour")) swaps.push(`${i.name} → almond/coconut flour`);
    else if (n.includes("milk") || n.includes("cream") || n.includes("whey")) swaps.push(`${i.name} → oat milk/coconut cream`);
    else if (n.includes("red 40") || n.includes("yellow") || n.includes("color")) swaps.push(`${i.name} → beet juice/turmeric`);
    else swaps.push(`${i.name} → cleaner alternative`);
  });
  return { opening, concerns, rec, swapText: swaps.length ? "Smart swaps: " + swaps.join("; ") : "", sev: r.score >= 70 ? "low" : r.score >= 50 ? "medium" : "high", compound: avoids.length >= 3 ? `${avoids.length} flagged ingredients — cumulative impact is significant.` : "" };
}

// --- Ingredient Guide Data (truncated for brevity, use full array in production) ---
const GUIDE: GuideIngredient[] = [
  { name: "Avobenzone", ratings: ["avoid"], categories: [{ cat: "Personal Care", desc: "Chemical sunscreen ingredient, may disrupt hormones", rating: "avoid" }] },
  { name: "BHA", ratings: ["avoid"], categories: [{ cat: "Food & Drink", desc: "Butylated hydroxyanisole — synthetic antioxidant, potential carcinogen", rating: "avoid" }] },
  { name: "BHT", ratings: ["avoid"], categories: [{ cat: "Food & Drink", desc: "Butylated hydroxytoluene — synthetic preservative, potential endocrine disruptor", rating: "avoid" }] },
  { name: "Barley", ratings: ["approved", "caution"], categories: [{ cat: "Food & Drink", desc: "Gluten-containing grain, not suitable for gluten-free diets", rating: "caution" }] },
  { name: "Beef", ratings: ["avoid", "approved"], categories: [{ cat: "Food & Drink", desc: "Red meat, source of protein, avoid for vegetarians/vegans", rating: "avoid" }] },
  { name: "Beer", ratings: ["approved", "avoid"], categories: [{ cat: "Food & Drink", desc: "Alcoholic beverage, contains gluten unless labeled gluten-free", rating: "avoid" }] },
  { name: "Beet Sugar", ratings: ["avoid"], categories: [{ cat: "Food & Drink", desc: "Often GMO unless organic, used as a sweetener", rating: "avoid" }] },
  { name: "Behentrimonium Chloride", ratings: ["approved"], categories: [{ cat: "Personal Care", desc: "Conditioning agent in hair products", rating: "approved" }] },
  { name: "Behentrimonium methosulfate", ratings: ["approved"], categories: [{ cat: "Personal Care", desc: "Mild conditioning agent, not a sulfate", rating: "approved" }] },
  { name: "Benzaldehyde", ratings: ["approved"], categories: [{ cat: "Food & Drink", desc: "Natural flavoring, generally recognized as safe", rating: "approved" }] },
  { name: "Benzalkonium chloride", ratings: ["avoid"], categories: [{ cat: "Personal Care", desc: "Preservative and disinfectant, may cause skin irritation", rating: "avoid" }] },
  { name: "Benzisothiazolinone", ratings: ["avoid"], categories: [{ cat: "Personal Care", desc: "Preservative, potential allergen", rating: "avoid" }] },
  { name: "Benzoate", ratings: ["avoid"], categories: [
    { cat: "Oral Hygiene", desc: "Used as a preservative in toothpaste and mouthwash", rating: "approved" },
    { cat: "Personal Care", desc: "Preservative in cosmetics", rating: "approved" },
    { cat: "Household", desc: "Preservative in cleaning products", rating: "approved" },
    { cat: "Food & Drink", desc: "Synthetic preservative, may be linked to inflammation", rating: "avoid" }
  ] },
  { name: "Benzyl benzoate", ratings: ["avoid"], categories: [{ cat: "Personal Care", desc: "Fragrance ingredient, potential allergen", rating: "avoid" }] },
  { name: "Benzyl salicylate", ratings: ["avoid"], categories: [{ cat: "Personal Care", desc: "Fragrance ingredient, potential allergen", rating: "avoid" }] },
  { name: "Beta carotene", ratings: ["approved"], categories: [{ cat: "Food & Drink", desc: "Vitamin A", rating: "approved" }] },
  { name: "Bioengineered Source", ratings: ["avoid"], categories: [{ cat: "Food & Drink", desc: "Another name for GMO", rating: "avoid" }] },
  { name: "Boric Acid", ratings: ["avoid"], categories: [{ cat: "Food & Drink", desc: "Preservative, may be linked to endocrine disruption and other negative health effects", rating: "avoid" }] },
  { name: "Bromate", ratings: ["avoid"], categories: [{ cat: "Food & Drink", desc: "Dough conditioner, banned in many countries", rating: "avoid" }] },
  { name: "Brown rice syrup", ratings: ["approved"], categories: [{ cat: "Food & Drink", desc: "Sweetener", rating: "approved" }] },
  { name: "Brown sugar", ratings: ["avoid"], categories: [{ cat: "Food & Drink", desc: "Refined sugar, may be GMO unless organic", rating: "avoid" }] },
  { name: "Butane", ratings: ["avoid"], categories: [{ cat: "Food & Drink", desc: "Propellant, not intended for consumption", rating: "avoid" }] },
  { name: "Butter", ratings: ["avoid", "approved"], categories: [
    { cat: "Food & Drink", desc: "Should be non-GMO, organic, or ideally 100% grass-fed", rating: "avoid" },
    { cat: "Personal Care", desc: "Used in some skin care products", rating: "approved" }
  ] },
  { name: "Buttermilk", ratings: ["approved"], categories: [{ cat: "Personal Care", desc: "Used in some skin care products", rating: "approved" }] },
];
const CC: Record<string, string> = { avoid: "#DC2626", caution: "#F59E0B", ok: "#16A34A" };
const CL: Record<string, string> = { avoid: "Avoid", caution: "Caution", ok: "OK" };

export default function IngredientsPage() {
  const [activeTab, setActiveTab] = useState<"guide" | "intel">("guide");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  // Intel state
  const [diet, setDiet] = useState("general");
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<any>(null);
  const [productName, setProductName] = useState("");
  const [expandedIng, setExpandedIng] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(true);
  const [showPaste, setShowPaste] = useState(false);

  const runAnalysis = (text: string, name: string) => {
    if (!text.trim()) return;
    const res = analyzeIngredients(text, diet);
    setResults({ ...res, summary: genSummary(res, diet, name) });
    setProductName(name); setInputText(text);
  };
  const changeDiet = (d: string) => {
    setDiet(d);
    if (inputText && productName) { const res = analyzeIngredients(inputText, d); setResults({ ...res, summary: genSummary(res, d, productName) }); }
  };
  const sc = (s: number) => s >= 85 ? "#16A34A" : s >= 70 ? "#65A30D" : s >= 50 ? "#CA8A04" : s >= 30 ? "#EA580C" : "#DC2626";
  const filtered = search.trim() ? GUIDE.filter(i => i.name.toLowerCase().includes(search.toLowerCase())) : GUIDE;
  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#FFF", fontFamily: "'Poppins','Segoe UI',sans-serif", paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(180deg,#5EEAD4,#99F6E4)", padding: "14px 14px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <button style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.85)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          {activeTab === "guide" ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 14, background: "rgba(255,255,255,.85)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for Ingredients..." style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, outline: "none", fontFamily: "inherit", color: "#374151" }} />
            </div>
          ) : (
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#064E3B" }}>🧪 Ingredient Intelligence</h2>
          )}
        </div>
        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 0 }}>
          <button onClick={() => setActiveTab("guide")} style={{
            flex: 1, padding: "10px 0", background: activeTab === "guide" ? "#FFF" : "rgba(255,255,255,.3)",
            border: "none", borderRadius: "12px 12px 0 0", cursor: "pointer", fontFamily: "inherit",
            fontWeight: activeTab === "guide" ? 800 : 500, fontSize: 13,
            color: activeTab === "guide" ? "#0D9488" : "#064E3B",
            borderBottom: activeTab === "guide" ? "3px solid #0D9488" : "3px solid transparent",
          }}>📋 Ingredient Guide</button>
          <button onClick={() => setActiveTab("intel")} style={{
            flex: 1, padding: "10px 0", background: activeTab === "intel" ? "#FFF" : "rgba(255,255,255,.3)",
            border: "none", borderRadius: "12px 12px 0 0", cursor: "pointer", fontFamily: "inherit",
            fontWeight: activeTab === "intel" ? 800 : 500, fontSize: 13,
            color: activeTab === "intel" ? "#0D9488" : "#064E3B",
            borderBottom: activeTab === "intel" ? "3px solid #0D9488" : "3px solid transparent",
          }}>🧪 Ingredient Intel</button>
        </div>
      </div>
      {/* Guide Tab */}
      {activeTab === "guide" && (
        <div>
          <div style={{ padding: "14px 16px 8px", borderBottom: "1.5px solid #E5E7EB" }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Ingredient Guide</h2>
          </div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}><div style={{ fontSize: 48, marginBottom: 10 }}>🔍</div><p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>No ingredients found</p></div>
          ) : filtered.map((ing, i) => {
            const isE = expanded === ing.name;
            return (
              <div key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <button onClick={() => setExpanded(isE ? null : ing.name)} style={{ width: "100%", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#1A1A2E", textAlign: "left" }}>{ing.name}</p>
                    <div style={{ display: "flex", gap: 4, marginTop: 4 }}>{ing.ratings.map((r, j) => <div key={j} style={{ width: 10, height: 10, borderRadius: "50%", background: DOT[r] }} />)}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" style={{ transform: isE ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {isE && <div style={{ padding: "0 16px 14px" }}>{ing.categories.map((c, j) => (
                  <div key={j} style={{ padding: "10px 14px", marginBottom: 6, borderRadius: 10, background: c.rating === "avoid" ? "#FEE2E240" : "#F9FAFB", borderLeft: `4px solid ${c.rating === "avoid" ? "#C41E3A" : c.rating === "approved" ? "#0D9488" : "#E5A100"}` }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: c.rating === "avoid" ? "#C41E3A" : "#374151" }}>{c.cat}</p>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#4B5563", lineHeight: 1.5 }}>{c.desc}</p>
                  </div>
                ))}</div>}
              </div>
            );
          })}
        </div>
      )}
      {/* Intelligence Tab */}
      {activeTab === "intel" && (
        <div style={{ background: "linear-gradient(180deg,#F0FDFA,#F8FDFC)", minHeight: "70vh" }}>
          <div style={{ padding: "14px 16px 8px" }}>
            <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>Select your diet, then analyze any product</p>
          </div>
          {/* Diet pills */}
          <div style={{ padding: "0 16px 12px" }}>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
              {Object.entries(DIETS).map(([k, d]) => { const a = diet === k; return (
                <button key={k} onClick={() => changeDiet(k)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 12, background: a ? d.color : "#FFF", color: a ? "#FFF" : "#374151", border: a ? `2px solid ${d.color}` : "2px solid #E5E7EB", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: a ? 700 : 500, fontSize: 12, boxShadow: a ? `0 3px 10px ${d.color}35` : "none", fontFamily: "inherit" }}>
                  <span style={{ fontSize: 15 }}>{d.emoji}</span>{d.label}
                </button>
              ); })}
            </div>
            <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 12, background: `${DIETS[diet].color}10`, border: `1.5px solid ${DIETS[diet].color}25`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{DIETS[diet].emoji}</span><div><span style={{ fontWeight: 700, fontSize: 12, color: DIETS[diet].color }}>{DIETS[diet].label} Mode</span><p style={{ margin: 0, fontSize: 10, color: "#6B7280" }}>{DIETS[diet].desc}</p></div>
            </div>
          </div>
          {/* Samples */}
          <div style={{ padding: "0 16px 12px" }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700 }}>Try a Sample Product</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {SAMPLES.map((s, i) => (
                <button key={i} onClick={() => runAnalysis(s.ingredients, s.name)} style={{ padding: "12px 8px", borderRadius: 14, background: productName === s.name ? `${DIETS[diet].color}12` : "#FFF", border: productName === s.name ? `2px solid ${DIETS[diet].color}` : "1.5px solid #E5E7EB", cursor: "pointer", textAlign: "center", fontFamily: "inherit" }}>
                  <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#6B7280" }}>{s.brand}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, fontWeight: 700, color: "#1A1A2E", lineHeight: 1.2 }}>{s.name}</p>
                </button>
              ))}
            </div>
          </div>
          {/* Paste */}
          <div style={{ padding: "0 16px 12px" }}>
            <button onClick={() => setShowPaste(!showPaste)} style={{ width: "100%", padding: "12px 16px", borderRadius: 14, background: "#FFF", border: "1.5px solid #E5E7EB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit" }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>📋 Paste Ingredients</span>
              <span style={{ fontSize: 11, color: "#9CA3AF", transform: showPaste ? "rotate(90deg)" : "none", transition: "transform .2s" }}>▶</span>
            </button>
            {showPaste && (<div style={{ marginTop: 8 }}>
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Paste ingredient list..." style={{ width: "100%", minHeight: 80, padding: "12px", borderRadius: 14, border: "2px solid #E5E7EB", fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
              <button onClick={() => runAnalysis(inputText, "Custom Product")} style={{ marginTop: 6, width: "100%", padding: "12px", borderRadius: 14, background: "linear-gradient(135deg,#0D9488,#14B8A6)", color: "#FFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>🔍 Analyze</button>
            </div>)}
          </div>
          {/* Results */}
          {results && (<div style={{ padding: "0 12px" }}>
            <div style={{ borderRadius: 18, padding: 18, background: `${sc(results.score)}08`, border: `1.5px solid ${sc(results.score)}25`, textAlign: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: `conic-gradient(${sc(results.score)} ${results.score * 3.6}deg, #E5E7EB ${results.score * 3.6}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#FFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: sc(results.score) }}>{results.score}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: sc(results.score), opacity: .7 }}>/ 100</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "inline-block", padding: "4px 16px", borderRadius: 10, background: sc(results.score), color: "#FFF", fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Grade {results.grade}</div>
              <p style={{ margin: "4px 0 0", fontSize: 11, color: "#6B7280" }}>{productName} • {DIETS[diet].label}</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10 }}>
                {[{ l: "Avoid", c: results.av, cl: CC.avoid, bg: "#FEE2E2" }, { l: "Caution", c: results.ca, cl: CC.caution, bg: "#FEF3C7" }, { l: "OK", c: results.ok, cl: CC.ok, bg: "#DCFCE7" }].map((s, i) => (
                  <div key={i} style={{ padding: "5px 12px", borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontWeight: 900, fontSize: 15, color: s.cl }}>{s.c}</span><span style={{ fontSize: 10, fontWeight: 600, color: s.cl }}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* AI */}
            {results.summary && (<div style={{ marginBottom: 12 }}>
              <button onClick={() => setShowAI(!showAI)} style={{ width: "100%", padding: "12px 16px", borderRadius: showAI ? "16px 16px 0 0" : 16, background: "linear-gradient(135deg,#1E1B4B,#312E81)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "inherit" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 16 }}>🤖</span><span style={{ fontSize: 13, fontWeight: 700, color: "#FFF" }}>AI Insight</span>
                  <span style={{ padding: "2px 8px", borderRadius: 6, background: results.score >= 70 ? "#16A34A30" : results.score >= 50 ? "#CA8A0430" : "#DC262630", color: results.score >= 70 ? "#86EFAC" : results.score >= 50 ? "#FDE68A" : "#FCA5A5", fontSize: 9, fontWeight: 700 }}>{results.summary.sev.toUpperCase()}</span></div>
                <span style={{ color: "#A5B4FC", fontSize: 10, transform: showAI ? "rotate(90deg)" : "none", transition: "transform .2s" }}>▶</span>
              </button>
              {showAI && (<div style={{ padding: 16, background: "linear-gradient(180deg,#1E1B4B,#1E1B4BF0)", borderRadius: "0 0 16px 16px" }}>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#E0E7FF", lineHeight: 1.6 }}>{results.summary.opening}</p>
                {results.summary.concerns && <p style={{ margin: "0 0 8px", fontSize: 11, color: "#C7D2FE", lineHeight: 1.5, padding: "8px 10px", background: "rgba(255,255,255,.06)", borderRadius: 8, borderLeft: `3px solid ${sc(results.score)}` }}>{results.summary.concerns}</p>}
                {results.summary.rec && <div style={{ display: "flex", gap: 8, padding: "8px 10px", background: "rgba(255,255,255,.04)", borderRadius: 8, marginBottom: 8 }}><span style={{ fontSize: 14 }}>💡</span><p style={{ margin: 0, fontSize: 11, color: "#A5B4FC", lineHeight: 1.5 }}>{results.summary.rec}</p></div>}
                {results.summary.swapText && <div style={{ display: "flex", gap: 8, padding: "8px 10px", background: "rgba(16,185,129,.08)", borderRadius: 8, marginBottom: 8, border: "1px solid rgba(16,185,129,.15)" }}><span style={{ fontSize: 14 }}>🔄</span><p style={{ margin: 0, fontSize: 11, color: "#6EE7B7", lineHeight: 1.5, fontWeight: 500 }}>{results.summary.swapText}</p></div>}
                {results.summary.compound && <div style={{ padding: "8px 10px", background: "rgba(239,68,68,.1)", borderRadius: 8, border: "1px solid rgba(239,68,68,.15)" }}><p style={{ margin: 0, fontSize: 10, color: "#FCA5A5" }}>{results.summary.compound}</p></div>}
                <p style={{ margin: "8px 0 0", fontSize: 9, color: "#6366F180", textAlign: "right" }}>Powered by Juan's Dietary Intelligence Engine</p>
              </div>)}
            </div>)}
            {/* Breakdown */}
            {(["avoid", "caution", "ok"] as const).map(c => {
              const items = results.results.filter((r: any) => r.cls === c);
              if (!items.length) return null;
              return (<div key={c} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: CC[c] + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: CC[c] }}>{c === "avoid" ? "✕" : c === "caution" ? "⚠" : "✓"}</div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: CC[c], textTransform: "uppercase" }}>{CL[c]} ({items.length})</span>
                </div>
                {items.map((it: any, i: number) => { const isE = expandedIng === `${c}-${i}`; return (
                  <div key={i} onClick={() => setExpandedIng(isE ? null : `${c}-${i}`)} style={{ padding: "9px 12px", marginBottom: 3, borderRadius: 10, background: CC[c] + "06", border: `1.5px solid ${CC[c]}15`, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ padding: "2px 7px", borderRadius: 5, background: CC[c] + "15", color: CC[c], fontWeight: 700, fontSize: 9, textTransform: "uppercase" }}>{CL[c]}</span>
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#1A1A2E" }}>{it.name}</span>
                      </div>
                      <span style={{ fontSize: 10, color: "#9CA3AF", transform: isE ? "rotate(90deg)" : "none", transition: "transform .2s" }}>▶</span>
                    </div>
                    {isE && <p style={{ margin: "6px 0 0", padding: "6px 10px", borderRadius: 8, background: "#FFF", fontSize: 11, color: "#4B5563", lineHeight: 1.5, borderLeft: `3px solid ${CC[c]}` }}>💡 {it.exp}</p>}
                  </div>
                ); })}
              </div>);
            })}
          </div>)}
          <div style={{ padding: "12px 20px" }}><p style={{ margin: 0, fontSize: 10, color: "#9CA3AF", textAlign: "center" }}>⚠️ Educational only. Not medical advice.</p></div>
        </div>
      )}
      <style>{`*::-webkit-scrollbar{display:none}*{-ms-overflow-style:none;scrollbar-width:none;box-sizing:border-box}`}</style>
    </div>
  );
}

const SAMPLES = [
  { name: "Classic Protein Bar", brand: "FitBite", ingredients: "Protein Blend (Whey Protein Isolate, Milk Protein Isolate), Soluble Corn Fiber, Almonds, Water, Unsweetened Chocolate, Cocoa Butter, Erythritol, Natural Flavors, Sea Salt, Soy Lecithin, Stevia" },
  { name: "Organic Tomato Soup", brand: "Garden Fresh", ingredients: "Organic Tomatoes, Water, Organic Cream, Sea Salt, Organic Onion Powder, Organic Garlic, Organic Black Pepper, Organic Basil" },
  { name: "Whole Wheat Crackers", brand: "CrunchTime", ingredients: "Whole Wheat Flour, Sunflower Oil, Sea Salt, Sugar, Malt Syrup, Baking Soda" },
  { name: "Fruit Punch Drink", brand: "SipBright", ingredients: "Water, High Fructose Corn Syrup, Citric Acid, Red 40, Blue 1, Natural Flavors, Sodium Benzoate, Potassium Sorbate" },
  { name: "Almond Butter", brand: "NutPure", ingredients: "Dry Roasted Almonds, Sea Salt" },
  { name: "Greek Yogurt", brand: "DairyDelight", ingredients: "Cultured Pasteurized Nonfat Milk, Cream, Sugar, Corn Starch, Natural Flavors, Pectin, Vitamin D3" },
];
