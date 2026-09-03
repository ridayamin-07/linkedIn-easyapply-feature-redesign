export type FitLabel = "Weak Fit" | "Moderate Fit" | "Good Fit" | "Strong Fit";
export type GateStatus = "PASS" | "FAIL";
export type SeniorityLabel = "Underqualified" | "Well-Matched" | "Overqualified";

export interface MustHaveGate {
  status: GateStatus;
  met: string[];
  missed: string[];
}

export interface DimensionScore {
  score: number;
  explanation: string;
}

export interface SeniorityMatch {
  label: SeniorityLabel;
  explanation: string;
}

export interface Assessment {
  overall_score: number;
  fit_label: FitLabel;
  must_have_gate: MustHaveGate;
  skills_overlap: DimensionScore;
  domain_relevance: DimensionScore;
  seniority_match: SeniorityMatch;
  rationale: string;
  job_post_concerns: string | null;
}

export interface JobPost {
  title: string;
  company: string;
  location: string;
  description: string;
  mustHaves: string[];
  preferredSkills: string[];
}

export interface CandidateProfile {
  name: string;
  profileText: string;
}

export interface QueueEntry {
  id: string;
  candidateName: string;
  jobTitle: string;
  company: string;
  score: number;
  fitLabel: FitLabel;
  rationaleSnippet: string;
  assessment: Assessment;
  appliedAt: string;
}
