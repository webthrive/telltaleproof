"use client";

import { useState } from "react";
import { useAnalyze, SectionScore, AnalysisResult } from "@/hooks/useAnalyze";

const TOTAL_SECTIONS = 8;

// Verdict color mapping
const VERDICT_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  green: {
    bg: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
    dot: "bg-green-500",
  },
  teal: {
    bg: "bg-teal-50",
    text: "text-teal-800",
    border: "border-teal-200",
    dot: "bg-teal-500",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    dot: "bg-red-500",
  },
};

function ScoreBar({ score, max = 10 }: { score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  const color =
    pct >= 75 ? "bg-green-500" : pct >= 50 ? "bg-teal-500" : pct >= 25 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SectionCard({
  section,
  isNew,
}: {
  section: SectionScore;
  isNew: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        isNew ? "animate-fadeIn" : ""
      }`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-medium text-gray-900 text-sm">{section.name}</span>
            <span className="text-xs text-gray-400">{section.factors.length} factors</span>
          </div>
          <ScoreBar score={section.score} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold text-gray-800">{section.score.toFixed(1)}</span>
          <span className="text-gray-400 text-xs">/10</span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t divide-y">
          {section.factors.map((factor) => (
            <div key={factor.name} className="p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                <span className="text-sm font-bold text-gray-800">{factor.score}/10</span>
              </div>
              <ScoreBar score={factor.score} />
              <ul className="mt-3 space-y-1">
                {factor.explanation.map((line, i) => (
                  <li key={i} className="text-xs text-gray-600 flex gap-2">
                    <span className="text-gray-400 shrink-0">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonSection() {
  return (
    <div className="border rounded-xl p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-1.5 bg-gray-200 rounded-full w-full" />
        </div>
        <div className="h-6 w-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function VerdictBadge({ result }: { result: AnalysisResult }) {
  const style = VERDICT_STYLES[result.verdictColor];
  return (
    <div className={`rounded-2xl border p-6 ${style.bg} ${style.border}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${style.dot}`} />
        <span className={`text-2xl font-bold ${style.text}`}>{result.verdict}</span>
      </div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className={`text-5xl font-black ${style.text}`}>{result.aggregateScore.toFixed(1)}</span>
        <span className="text-gray-400 text-lg">/ 10</span>
      </div>
      <p className="text-xs text-gray-500 mb-3">
        Aggregate score across {result.sections.length} sections and{" "}
        {result.sections.reduce((sum, s) => sum + s.factors.length, 0)} individual factors
      </p>
      <div className="flex gap-4 text-xs text-gray-500">
        <span>
          <span className="font-medium text-gray-700">Word count</span> {result.wordCount}
        </span>
        <span>
          <span className="font-medium text-gray-700">Confidence</span> {result.confidence}
        </span>
      </div>
    </div>
  );
}

export default function Analyzer() {
  const [text, setText] = useState("");
  const { isLoading, streamingSections, result, error, sectionsComplete, analyze, reset } =
    useAnalyze();

  const hasStarted = isLoading || streamingSections.length > 0 || !!result;
  const skeletonCount = Math.max(0, TOTAL_SECTIONS - streamingSections.length);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    analyze(text);
  };

  const handleReset = () => {
    reset();
    setText("");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-1">ContentTrace.ai</h1>
        <p className="text-gray-500 text-sm">32-signal AI content analysis</p>
      </div>

      {!hasStarted && (
        <div className="space-y-4">
          <textarea
            className="w-full h-48 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Paste your text here (50–10,000 characters)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{text.length.toLocaleString()} characters</span>
            <button
              onClick={handleAnalyze}
              disabled={text.trim().length < 50}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Analyze
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </p>
          )}
        </div>
      )}

      {hasStarted && (
        <div className="space-y-4">
          {/* Progress indicator while streaming */}
          {isLoading && (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span>
                Analyzing… {sectionsComplete}/{TOTAL_SECTIONS} sections complete
              </span>
            </div>
          )}

          {/* Verdict — only shown when complete */}
          {result && <VerdictBadge result={result} />}

          {/* Sections — stream in as they arrive */}
          <div className="space-y-3">
            {streamingSections.map((section, i) => (
              <SectionCard
                key={section.name}
                section={section}
                isNew={i === streamingSections.length - 1 && isLoading}
              />
            ))}
            {/* Skeleton placeholders for remaining sections */}
            {isLoading &&
              [...Array(skeletonCount)].map((_, i) => <SkeletonSection key={`skel-${i}`} />)}
          </div>

          {/* Footer note + reset */}
          {result && (
            <>
              <p className="text-xs text-gray-400 leading-relaxed pt-2">
                Note: These scores are probabilistic, not definitive. Short texts (&lt;100 words) produce lower
                confidence results. Heavily edited AI text or highly structured human writing may score
                unexpectedly.
              </p>
              <button
                onClick={handleReset}
                className="w-full py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                New Analysis
              </button>
            </>
          )}

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
