import type { FitLabel } from "./types";

export function scoreColor(score: number): string {
  if (score <= 2) return "text-red-600 bg-red-50 border-red-200";
  if (score === 3) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-emerald-600 bg-emerald-50 border-emerald-200";
}

export function scoreBg(score: number): string {
  if (score <= 2) return "bg-red-500";
  if (score === 3) return "bg-amber-500";
  return "bg-emerald-500";
}

export function scoreTextColor(score: number): string {
  if (score <= 2) return "text-red-600";
  if (score === 3) return "text-amber-600";
  return "text-emerald-600";
}

export function labelForScore(score: number): FitLabel {
  if (score <= 2) return "Weak Fit";
  if (score === 3) return "Moderate Fit";
  if (score === 4) return "Good Fit";
  return "Strong Fit";
}

export function scoreBand(score: number): string {
  if (score <= 2) return "Weak (1-2)";
  if (score === 3) return "Moderate (3)";
  if (score === 4) return "Good (4)";
  return "Strong (5)";
}
