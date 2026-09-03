import { useState } from "react";
import { Gauge } from "lucide-react";
import type { Assessment, CandidateProfile, JobPost, QueueEntry } from "./types";
import { SAMPLE_JOB, SAMPLE_CANDIDATE } from "./sampleData";
import { labelForScore } from "./uiHelpers";
import JobPostView from "./components/JobPostView";
import FitAssessmentView from "./components/FitAssessmentView";
import RecruiterQueueView from "./components/RecruiterQueueView";

type Screen = "job" | "assessment" | "queue";

function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function App() {
  const [screen, setScreen] = useState<Screen>("job");
  const [job, setJob] = useState<JobPost>(SAMPLE_JOB);
  const [candidate, setCandidate] = useState<CandidateProfile>(SAMPLE_CANDIDATE);
  const [queue, setQueue] = useState<QueueEntry[]>([]);

  const addToQueue = (assessment: Assessment, name: string) => {
    const entry: QueueEntry = {
      id: makeId(),
      candidateName: name || "Anonymous",
      jobTitle: job.title,
      company: job.company,
      score: assessment.overall_score,
      fitLabel: labelForScore(assessment.overall_score),
      rationaleSnippet: assessment.rationale,
      assessment,
      appliedAt: new Date().toISOString(),
    };
    setQueue((q) => [...q, entry]);
    setScreen("queue");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
            <Gauge size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">
            Fit<span className="text-blue-600">Score</span>
          </span>
          <span className="ml-2 px-2 py-0.5 text-xs font-medium text-slate-400 bg-slate-100 rounded">
            AI Job-Fit Matching
          </span>
        </div>
      </header>

      <main>
        {screen === "job" && (
          <JobPostView
            job={job}
            queueCount={queue.length}
            onSaveJob={setJob}
            onApply={() => setScreen("assessment")}
            onViewQueue={() => setScreen("queue")}
          />
        )}

        {screen === "assessment" && (
          <FitAssessmentView
            job={job}
            candidate={candidate}
            onUpdateCandidate={setCandidate}
            onApplyAnyway={(a) => addToQueue(a, candidate.name)}
            onHideAndApply={(a) => addToQueue(a, candidate.name)}
            onWithdraw={() => setScreen("job")}
            onBack={() => setScreen("job")}
          />
        )}

        {screen === "queue" && (
          <RecruiterQueueView
            entries={queue}
            jobTitle={job.title}
            company={job.company}
            onBack={() => setScreen("job")}
          />
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-slate-400">
          FitScore · Prototype — AI-mediated job application matching
        </p>
      </footer>
    </div>
  );
}

export default App;
