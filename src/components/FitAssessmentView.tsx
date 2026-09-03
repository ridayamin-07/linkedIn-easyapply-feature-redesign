import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pencil,
  Send,
  Ban,
  EyeOff,
  User,
  ShieldCheck,
} from "lucide-react";
import type { Assessment, CandidateProfile, JobPost } from "../types";
import { scoreBg, scoreTextColor } from "../uiHelpers";
import { scoreFit, jobPostToText } from "../api";

interface Props {
  job: JobPost;
  candidate: CandidateProfile;
  onUpdateCandidate: (c: CandidateProfile) => void;
  onApplyAnyway: (assessment: Assessment) => void;
  onHideAndApply: (assessment: Assessment) => void;
  onWithdraw: () => void;
  onBack: () => void;
}

export default function FitAssessmentView({
  job,
  candidate,
  onUpdateCandidate,
  onApplyAnyway,
  onHideAndApply,
  onWithdraw,
  onBack,
}: Props) {
  const [profileDraft, setProfileDraft] = useState<CandidateProfile>(candidate);
  const [editingProfile, setEditingProfile] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAssessment = async (profile: CandidateProfile) => {
    setLoading(true);
    setError(null);
    setAssessment(null);
    try {
      const result = await scoreFit(profile.profileText, jobPostToText(job));
      setAssessment(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to run assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleRecheck = () => {
    onUpdateCandidate(profileDraft);
    setEditingProfile(false);
    void runAssessment(profileDraft);
  };

  // Auto-run on first mount if we have a profile
  const hasInitialRun = useRef(false);
  useEffect(() => {
    if (!hasInitialRun.current && candidate.profileText) {
      hasInitialRun.current = true;
      void runAssessment(candidate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 mb-5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Back to job post
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Fit Assessment</h1>
        <p className="mt-1 text-sm text-slate-500">
          {job.title} · {job.company}
        </p>
      </div>

      {/* Candidate profile editor */}
      <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User size={16} className="text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700">Candidate Profile</h3>
          </div>
          {!editingProfile && (
            <button
              onClick={() => {
                setProfileDraft(candidate);
                setEditingProfile(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <Pencil size={13} /> Edit Profile
            </button>
          )}
        </div>

        {editingProfile ? (
          <div className="space-y-3">
            <label className="block">
              <span className="block text-xs font-semibold text-slate-500 mb-1">Name</span>
              <input
                value={profileDraft.name}
                onChange={(e) =>
                  setProfileDraft((d) => ({ ...d, name: e.target.value }))
                }
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-semibold text-slate-500 mb-1">
                Profile (experience, skills, years, background)
              </span>
              <textarea
                value={profileDraft.profileText}
                onChange={(e) =>
                  setProfileDraft((d) => ({ ...d, profileText: e.target.value }))
                }
                rows={6}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 resize-y"
              />
            </label>
            <button
              onClick={handleRecheck}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <ShieldCheck size={15} /> Re-check Fit
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-slate-700">{candidate.name}</p>
            <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {candidate.profileText}
            </p>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
          <p className="mt-3 text-sm text-slate-500">Running AI fit assessment…</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">Assessment failed</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <button
              onClick={() => void runAssessment(candidate)}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Assessment results */}
      {assessment && !loading && !error && (
        <AssessmentResult
          assessment={assessment}
          onApplyAnyway={() => onApplyAnyway(assessment)}
          onHideAndApply={() => onHideAndApply(assessment)}
          onWithdraw={onWithdraw}
          onEditProfile={() => {
            setProfileDraft(candidate);
            setEditingProfile(true);
          }}
        />
      )}
    </div>
  );
}

function AssessmentResult({
  assessment,
  onApplyAnyway,
  onHideAndApply,
  onWithdraw,
  onEditProfile,
}: {
  assessment: Assessment;
  onApplyAnyway: () => void;
  onHideAndApply: () => void;
  onWithdraw: () => void;
  onEditProfile: () => void;
}) {
  const gatePassed = assessment.must_have_gate.status === "PASS";

  return (
    <div className="space-y-5">
      {/* Overall score */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div
            className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl text-white ${scoreBg(
              assessment.overall_score
            )} shadow-md`}
          >
            <span className="text-4xl font-bold leading-none">
              {assessment.overall_score}
            </span>
            <span className="text-xs font-medium opacity-90 mt-1">/ 5</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Overall Fit
            </p>
            <p className={`text-2xl font-bold ${scoreTextColor(assessment.overall_score)}`}>
              {assessment.fit_label}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {gatePassed
                ? "Must-have gate passed — composite score applied."
                : "Must-have gate failed — score capped."}
            </p>
          </div>
        </div>
        <p className="mt-4 pt-4 border-t border-slate-100 text-sm leading-relaxed text-slate-600">
          {assessment.rationale}
        </p>
        {assessment.job_post_concerns && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Job post concern: </span>
              {assessment.job_post_concerns}
            </p>
          </div>
        )}
      </div>

      {/* Must-have gate */}
      <DimensionCard title="Must-Have Gate">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            gatePassed
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {gatePassed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {assessment.must_have_gate.status}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-emerald-600 mb-2">Met</p>
            {assessment.must_have_gate.met.length === 0 ? (
              <p className="text-xs text-slate-400 italic">None</p>
            ) : (
              <ul className="space-y-1.5">
                {assessment.must_have_gate.met.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-red-600 mb-2">Missed</p>
            {assessment.must_have_gate.missed.length === 0 ? (
              <p className="text-xs text-slate-400 italic">None</p>
            ) : (
              <ul className="space-y-1.5">
                {assessment.must_have_gate.missed.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <XCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DimensionCard>

      {/* Skills overlap */}
      <DimensionCard
        title="Skills / Experience Overlap"
        score={assessment.skills_overlap.score}
      >
        <p className="text-sm text-slate-600 leading-relaxed">
          {assessment.skills_overlap.explanation}
        </p>
      </DimensionCard>

      {/* Domain relevance */}
      <DimensionCard
        title="Domain Relevance"
        score={assessment.domain_relevance.score}
      >
        <p className="text-sm text-slate-600 leading-relaxed">
          {assessment.domain_relevance.explanation}
        </p>
      </DimensionCard>

      {/* Seniority match */}
      <DimensionCard title="Seniority Match">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
            assessment.seniority_match.label === "Well-Matched"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}
        >
          {assessment.seniority_match.label}
        </span>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          {assessment.seniority_match.explanation}
        </p>
      </DimensionCard>

      {/* Action buttons */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">
          Next steps
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={onEditProfile}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            <Pencil size={14} /> Edit Profile &amp; Re-check
          </button>
          <button
            onClick={onApplyAnyway}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Send size={14} /> Apply Anyway
          </button>
          <button
            onClick={onHideAndApply}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50"
          >
            <EyeOff size={14} /> Hide Assessment &amp; Apply
          </button>
          <button
            onClick={onWithdraw}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
          >
            <Ban size={14} /> Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

function DimensionCard({
  title,
  score,
  children,
}: {
  title: string;
  score?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-slate-700">{title}</h3>
        {typeof score === "number" && (
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${scoreBg(Math.round(score / 20))} rounded-full`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-700 tabular-nums">
              {score}
            </span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
