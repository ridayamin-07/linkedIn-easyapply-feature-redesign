import { useState } from "react";
import { Briefcase, MapPin, Pencil, X, Check, ListChecks, Sparkles } from "lucide-react";
import type { JobPost } from "../types";

interface Props {
  job: JobPost;
  onApply: () => void;
  onViewQueue: () => void;
  queueCount: number;
  onSaveJob: (job: JobPost) => void;
}

export default function JobPostView({ job, onApply, onViewQueue, queueCount, onSaveJob }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<JobPost>(job);

  const startEdit = () => {
    setDraft(job);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(job);
    setEditing(false);
  };

  const saveEdit = () => {
    onSaveJob(draft);
    setEditing(false);
  };

  const updateField = <K extends keyof JobPost>(key: K, value: JobPost[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const updateList = (key: "mustHaves" | "preferredSkills", value: string) => {
    const arr = value.split("\n").map((s) => s.trim()).filter(Boolean);
    setDraft((d) => ({ ...d, [key]: arr }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Job Post</h1>
        <button
          onClick={onViewQueue}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <ListChecks size={16} />
          Recruiter Queue
          {queueCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">
              {queueCount}
            </span>
          )}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {!editing ? (
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{job.title}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Briefcase size={15} className="text-slate-400" />
                    {job.company}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} className="text-slate-400" />
                    {job.location}
                  </span>
                </div>
              </div>
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-600">{job.description}</p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <RequirementGroup
                title="Must-Haves"
                subtitle="Non-negotiable"
                items={job.mustHaves}
                accent="border-red-200 bg-red-50/40"
                dot="bg-red-400"
              />
              <RequirementGroup
                title="Preferred Skills"
                subtitle="Nice to have"
                items={job.preferredSkills}
                accent="border-blue-200 bg-blue-50/40"
                dot="bg-blue-400"
              />
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100">
              <button
                onClick={onApply}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Sparkles size={16} />
                Apply
              </button>
              <p className="mt-2 text-xs text-slate-400">
                Applying triggers an AI-mediated fit assessment before submission.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800">Edit Job Post</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Check size={14} /> Save
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <LabeledInput
                  label="Job Title"
                  value={draft.title}
                  onChange={(v) => updateField("title", v)}
                />
                <LabeledInput
                  label="Company"
                  value={draft.company}
                  onChange={(v) => updateField("company", v)}
                />
                <LabeledInput
                  label="Location"
                  value={draft.location}
                  onChange={(v) => updateField("location", v)}
                />
              </div>
              <LabeledTextarea
                label="Description"
                value={draft.description}
                onChange={(v) => updateField("description", v)}
                rows={3}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <LabeledTextarea
                  label="Must-Haves (one per line)"
                  value={draft.mustHaves.join("\n")}
                  onChange={(v) => updateList("mustHaves", v)}
                  rows={5}
                />
                <LabeledTextarea
                  label="Preferred Skills (one per line)"
                  value={draft.preferredSkills.join("\n")}
                  onChange={(v) => updateList("preferredSkills", v)}
                  rows={5}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RequirementGroup({
  title,
  subtitle,
  items,
  accent,
  dot,
}: {
  title: string;
  subtitle: string;
  items: string[];
  accent: string;
  dot: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${accent}`}>
      <div className="flex items-baseline justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
        <span className="text-xs text-slate-400">{subtitle}</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400 italic">None listed</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-500 mb-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
      />
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-500 mb-1">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 resize-y"
      />
    </label>
  );
}
