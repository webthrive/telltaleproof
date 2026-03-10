"use client";

import { useState } from "react";
import { AnalysisResult } from "@/types/analysis";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Scan, X, ArrowRight } from "lucide-react";

const CHAR_LIMIT = 10000;

const SAMPLE_TEXT = `Artificial intelligence has fundamentally transformed how organizations approach data-driven decision making. By leveraging advanced machine learning algorithms and neural network architectures, businesses can now extract meaningful insights from vast datasets that would have been previously unanalyzable. This paradigm shift represents a significant opportunity for enterprises willing to embrace digital transformation.

It is important to note that implementing AI solutions requires careful consideration of both technical and organizational factors. Companies must ensure they have the right infrastructure, talent, and governance frameworks in place to successfully deploy these technologies at scale. Furthermore, ethical considerations around bias, transparency, and accountability must be thoroughly addressed.

In conclusion, organizations that strategically invest in AI capabilities will be well-positioned to achieve competitive advantages in an increasingly data-driven marketplace.`;

export default function AnalyzerPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleAnalyze = async () => {
    if (!text.trim() || text.length < 50) { setError("Please enter at least 50 characters."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const handleReset = () => { setResult(null); setError(null); };
  const loadSample = () => { setText(SAMPLE_TEXT); setResult(null); setError(null); };

  return (
    <main style={{ minHeight: "100vh", position: "relative", zIndex: 1, padding: "0 16px" }}>
      <header style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 0 32px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--bg-elevated)", border: "1px solid var(--border-light)", borderRadius: "20px", padding: "6px 14px", marginBottom: "20px" }}>
          <Scan size={13} style={{ color: "var(--accent)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "DM Mono, monospace", letterSpacing: "0.04em" }}>TelltaleProof — v1.0</span>
        </div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 52px)", fontFamily: "DM Serif Display, serif", fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.15, marginBottom: "14px", letterSpacing: "-0.02em" }}>
          Is your content TelltaleProof?
        </h1>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", maxWidth: "480px", margin: "0 auto", lineHeight: "1.6" }}>
          Deep analysis across 30+ signals — structure, voice, cognitive fingerprinting, emotional texture, and more. Prove it's human.
        </p>
      </header>

      <div style={{ maxWidth: "720px", margin: "0 auto", paddingBottom: "80px" }}>
        {!result && (
          <div style={{ border: "1px solid var(--border-light)", borderRadius: "16px", background: "var(--bg-card)", overflow: "hidden", marginBottom: "16px" }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, CHAR_LIMIT))}
              placeholder="Paste any text here — blog post, email, essay, social content, product description..."
              style={{ width: "100%", minHeight: "220px", padding: "20px", background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: "15px", fontFamily: "Inter, sans-serif", lineHeight: "1.7", resize: "vertical" }}
            />
            <div style={{ borderTop: "1px solid var(--border)", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>{wordCount} words · {charCount.toLocaleString()}/{CHAR_LIMIT.toLocaleString()} chars</span>
                <button onClick={loadSample} style={{ fontSize: "12px", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Load sample</button>
              </div>
              <button onClick={handleAnalyze} disabled={loading || charCount < 50}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: loading || charCount < 50 ? "var(--bg-elevated)" : "var(--accent)", color: loading || charCount < 50 ? "var(--text-muted)" : "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: loading || charCount < 50 ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}>
                {loading ? (<><span style={{ width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", display: "inline-block" }} className="spin" />Analyzing...</>) : (<><Scan size={14} />Analyze<ArrowRight size={14} /></>)}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ border: "1px solid rgba(248,113,113,0.3)", borderRadius: "10px", background: "rgba(248,113,113,0.08)", padding: "12px 16px", fontSize: "14px", color: "#f87171", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {error}
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171" }}><X size={14} /></button>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
            <div style={{ width: "40px", height: "40px", border: "2px solid var(--border-light)", borderTopColor: "var(--accent)", borderRadius: "50%", margin: "0 auto 16px" }} className="spin" />
            <div style={{ fontSize: "14px" }}>Running deep analysis across 30+ signals...</div>
            <div style={{ fontSize: "12px", marginTop: "4px" }}>This takes 10–20 seconds</div>
          </div>
        )}

        {result && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "DM Mono, monospace" }}>Analysis complete</span>
              <button onClick={handleReset} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-secondary)", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "6px", padding: "6px 12px", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                <X size={12} />New Analysis
              </button>
            </div>
            <ResultsDisplay result={result} />
          </>
        )}

        {!result && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", marginTop: "24px" }}>
            {[
              { label: "8 scored sections", desc: "Structure, voice, logic, emotion & more" },
              { label: "30+ factors", desc: "Every signal explained in plain language" },
              { label: "Explainer bullets", desc: "Know exactly why each score was given" },
              { label: "Perplexity layer", desc: "Statistical scoring coming in Phase 2" },
            ].map((f) => (
              <div key={f.label} style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "14px", background: "var(--bg-card)" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{f.label}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{f.desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
