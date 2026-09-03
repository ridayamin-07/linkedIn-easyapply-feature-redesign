import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import type { QueueEntry } from "../types";
import { scoreBg, scoreTextColor, scoreBand } from "../uiHelpers";

interface Props {
  entries: QueueEntry[];
  jobTitle: string;
  company: string;
  onBack: () => void;
}

type SortKey = "score" | "name";
type BandFilter = "all" | "weak" | "moderate" | "good" | "strong";

export default function RecruiterQueueView({ entries, jobTitle, company, onBack }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [bandFilter, setBandFilter] = useState<BandFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const bandMatches = (score: number, band: BandFilter): boolean => {
    if (band === "all") return true;
    if (band === "weak") return score <= 2;
    if (band === "moderate") return score === 3;
    if (band === "good") return score === 4;
    return score === 5;
  };

  const filtered = entries.filter((e) => bandMatches(e.score, bandFilter));

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "score") cmp = a.score - b.score;
    else cmp = a.candidateName.localeCompare(b.candidateName);
    return sortDir === "desc" ? -cmp : cmp;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir(key === "score" ? "desc" : "asc");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 mb-5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Back to job post
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Recruiter Queue</h1>
        <p className="mt-1 text-sm text-slate-500">
          {jobTitle} · {company} · {entries.length} application{entries.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Filter:
        </span>
        {(["all", "strong", "good", "moderate", "weak"] as BandFilter[]).map((band) => (
          <button
            key={band}
            onClick={() => setBandFilter(band)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              bandFilter === band
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {band === "all" ? "All" : scoreBand(band === "weak" ? 1 : band === "moderate" ? 3 : band === "good" ? 4 : 5)}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <p className="text-sm text-slate-400">
            {entries.length === 0
              ? "No applications yet. Apply from the job post to populate the queue."
              : "No applications match this filter."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <button
              onClick={() => toggleSort("name")}
              className="col-span-5 text-left flex items-center gap-1 hover:text-slate-700"
            >
              Candidate {sortKey === "name" && (sortDir === "desc" ? "↓" : "↑")}
            </button>
            <button
              onClick={() => toggleSort("score")}
              className="col-span-2 text-left flex items-center gap-1 hover:text-slate-700"
            >
              Score {sortKey === "score" && (sortDir === "desc" ? "↓" : "↑")}
            </button>
            <span className="col-span-4 text-left">Rationale</span>
            <span className="col-span-1" />
          </div>

          {sorted.map((entry) => {
            const expanded = expandedId === entry.id;
            return (
              <div key={entry.id} className="border-b border-slate-100 last:border-b-0">
                <div
                  className="grid grid-cols-12 gap-3 px-5 py-4 items-center cursor-pointer hover:bg-slate-50/60 transition-colors"
                  onClick={() => setExpandedId(expanded ? null : entry.id)}
                >
                  <div className="col-span-5">
                    <p className="text-sm font-semibold text-slate-700">
                      {entry.candidateName || "Anonymous"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(entry.appliedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm font-bold ${scoreBg(
                        entry.score
                      )}`}
                    >
                      {entry.score}
                    </span>
                    <span className={`text-xs font-semibold ${scoreTextColor(entry.score)}`}>
                      {entry.fitLabel}
                    </span>
                  </div>
                  <div className="col-span-4">
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {entry.rationaleSnippet}
                    </p>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {expanded ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </div>
                </div>

                {expanded && <ExpandedAssessment entry={entry} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ExpandedAssessment({ entry }: { entry: QueueEntry }) {
  const a = entry.assessment;
  const gatePassed = a.must_have_gate.status === "PASS";

  return (
    <div className="px-5 pb-5 bg-slate-50/50">
      <div className="pt-2 grid gap-4 sm:grid-cols-2">
        {/* Must-have gate */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
              Must-Have Gate
            </h4>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                gatePassed
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {gatePassed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {a.must_have_gate.status}
            </span>
          </div>
          {a.must_have_gate.missed.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold text-red-600 mb-1">Missed</p>
              <ul className="space-y-1">
                {a.must_have_gate.missed.map((m, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <XCircle size={12} className="text-red-500 shrink-0 mt-0.5" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {a.must_have_gate.met.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-600 mb-1">Met</p>
              <ul className="space-y-1">
                {a.must_have_gate.met.map((m, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0 mt-0.5" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Skills + Domain */}
        <div className="space-y-3">
          <MiniDimension title="Skills / Experience" score={a.skills_overlap.score} text={a.skills_overlap.explanation} />
          <MiniDimension title="Domain Relevance" score={a.domain_relevance.score} text={a.domain_relevance.explanation} />
        </div>

        {/* Seniority */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
            Seniority Match
          </h4>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${
              a.seniority_match.label === "Well-Matched"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {a.seniority_match.label}
          </span>
          <p className="text-xs text-slate-600 leading-relaxed">{a.seniority_match.explanation}</p>
        </div>

        {/* Rationale + concerns */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
            Rationale
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">{a.rationale}</p>
          {a.job_post_concerns && (
            <div className="mt-2 flex items-start gap-1.5 p-2 bg-amber-50 border border-amber-200 rounded">
              <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">{a.job_post_concerns}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniDimension({ title, score, text }: { title: string; score: number; text: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-xs font-bold text-slate-600">{title}</h4>
        <span className="text-sm font-bold text-slate-700 tabular-nums">{score}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed">{text}</p>
    </div>
  );
}
