import type { Assessment } from "./types";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/score-fit`;
const HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

export interface ScoreError {
  error: string;
  detail?: string;
  raw?: string;
}

export async function scoreFit(
  candidateProfile: string,
  jobPost: string
): Promise<Assessment> {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      candidate_profile: candidateProfile,
      job_post: jobPost,
    }),
  });

  if (!response.ok) {
    const err: ScoreError = await response.json().catch(() => ({
      error: `Request failed (${response.status})`,
    }));
    throw new Error(err.detail ?? err.error ?? `Request failed (${response.status})`);
  }

  const data = await response.json();

  if (data?.error) {
    throw new Error(data.detail ?? data.error);
  }

  if (
    typeof data?.overall_score !== "number" ||
    !data?.must_have_gate ||
    !data?.skills_overlap ||
    !data?.domain_relevance ||
    !data?.seniority_match
  ) {
    throw new Error("Received an incomplete assessment from the scoring engine.");
  }

  return data as Assessment;
}

export function jobPostToText(job: {
  title: string;
  company: string;
  location: string;
  description: string;
  mustHaves: string[];
  preferredSkills: string[];
}): string {
  return [
    `Title: ${job.title}`,
    `Company: ${job.company}`,
    `Location: ${job.location}`,
    `Description: ${job.description}`,
    `Must-Haves:\n${job.mustHaves.map((m) => `- ${m}`).join("\n")}`,
    `Preferred Skills:\n${job.preferredSkills.map((p) => `- ${p}`).join("\n")}`,
  ].join("\n");
}
