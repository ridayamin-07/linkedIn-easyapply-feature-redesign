import type { JobPost, CandidateProfile } from "./types";

export const SAMPLE_JOB: JobPost = {
  title: "Senior Frontend Engineer",
  company: "Northwind Analytics",
  location: "Remote (US)",
  description:
    "We're looking for a senior frontend engineer to lead the buildout of our analytics dashboard. You'll own the UI architecture, collaborate closely with design and backend, and ship features used by thousands of data analysts every day.",
  mustHaves: [
    "5+ years of production frontend experience",
    "Expert proficiency in React and TypeScript",
    "Experience building complex data-visualization interfaces",
  ],
  preferredSkills: [
    "Familiarity with D3.js or similar charting libraries",
    "Experience with design systems",
    "Background in data or developer-tools products",
  ],
};

export const SAMPLE_CANDIDATE: CandidateProfile = {
  name: "Alex Morgan",
  profileText:
    "7 years of frontend engineering experience, primarily in React and TypeScript. Built and maintained a real-time analytics dashboard at a SaaS company, including custom charting with D3.js. Led the migration to a component design system. Previously worked on a developer-tools product for 2 years. Strong background in data-heavy interfaces.",
};

export const SAMPLE_QUEUE_PROFILES: CandidateProfile[] = [
  {
    name: "Priya Sharma",
    profileText:
      "6 years frontend experience, React and TypeScript expert. Built data-visualization dashboards using D3.js at a fintech startup. Led a design-system initiative across 3 product teams. CS degree.",
  },
  {
    name: "Jordan Lee",
    profileText:
      "4 years frontend experience with React. Some TypeScript exposure. Built marketing sites and a small internal dashboard. No heavy data-visualization work yet. Eager to grow into senior IC.",
  },
  {
    name: "Sam Chen",
    profileText:
      "10 years full-stack experience, strong React and TypeScript. Spent last 4 years on analytics tooling and D3-based visualizations. Previously a backend engineer. Based in Berlin, open to remote.",
  },
];
