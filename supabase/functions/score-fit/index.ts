import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are a job-fit scoring engine. You will receive a CANDIDATE_PROFILE and a JOB_POST. Score the candidate's fit using this exact method:

STEP 1 — MUST-HAVE GATE:
Identify the must-have requirements explicitly stated in JOB_POST (ignore anything phrased as "preferred," "nice to have," or "bonus"). Check if CANDIDATE_PROFILE clearly satisfies each one.
- If ANY true must-have is not met: gate = FAIL. Overall score is capped at 1 (if multiple must-haves are missed) or 2 (if only one is missed).
- If ALL must-haves are met: gate = PASS. Proceed to Step 2. Floor score is 3.

STEP 2 — WEIGHTED COMPOSITE (only if gate = PASS):
Score three dimensions from 0-100 each:
- Skills/Experience Overlap (weight 50%): For EACH skill claimed in the candidate profile, you must first output a structured evidence entry before scoring:
  { "skill": "<name>", "evidence": "<specific project/company/context and duration, OR the literal string 'NO EVIDENCE PROVIDED' if none is given>" }
  After listing evidence for all claimed skills, count how many have "NO EVIDENCE PROVIDED". If more than half of the claimed skills have no evidence, you MUST set Skills/Experience Overlap score to 60 or below, no exceptions, and explicitly state "Low evidence density: X of Y skills unverified" in the explanation. Only skills with real evidence can justify a score above 60.
- Domain Relevance (weight 25%): How related is the candidate's industry/domain background to this role? Explicitly credit transferable skills from adjacent fields — do not penalize non-traditional career paths if the underlying skill is genuinely transferable.
- Seniority Match (weight 25%): Compare candidate's experience level to the role's level. Label as "Underqualified," "Well-Matched," or "Overqualified" — do not just give a number, since under- and over-qualified mean different things.

Calculate composite = (Skills * 0.5) + (Domain * 0.25) + (Seniority * 0.25), where Seniority score = 100 if Well-Matched, 60 if Overqualified, 40 if Underqualified.

STEP 3 — MAP TO FINAL SCORE:
- Composite 85%+ → Final score 5
- Composite 60-84% → Final score 4
- Composite below 60% → Final score 3

FAIRNESS CHECK (always run, regardless of outcome):
- If JOB_POST contains coded language that could indirectly filter by age, gender, or other protected traits (e.g., "recent graduate," "digital native," "culture fit"), flag this explicitly in your response under "job_post_concerns."
- If CANDIDATE_PROFILE shows a non-traditional or career-change background, explicitly check that transferable skills were credited fairly, and note this reasoning in the domain relevance explanation.

OUTPUT FORMAT — return ONLY valid JSON, no other text:
{
  "overall_score": <1-5>,
  "fit_label": "<Weak Fit | Moderate Fit | Good Fit | Strong Fit>",
  "must_have_gate": {
    "status": "<PASS | FAIL>",
    "met": ["list of must-haves satisfied"],
    "missed": ["list of must-haves not satisfied"]
  },
  "skills_overlap": { "score": <0-100>, "explanation": "<1-2 sentences>" },
  "domain_relevance": { "score": <0-100>, "explanation": "<1-2 sentences>" },
  "seniority_match": { "label": "<Underqualified | Well-Matched | Overqualified>", "explanation": "<1-2 sentences>" },
  "rationale": "<2-3 sentence plain-language summary of the overall assessment>",
  "job_post_concerns": "<null, or a note if coded/biased language was detected>"
}

CANDIDATE_PROFILE:
{{candidate_profile}}

JOB_POST:
{{job_post}}`;

function buildUserPrompt(candidateProfile: string, jobPost: string): string {
  return SYSTEM_PROMPT
    .replace("{{candidate_profile}}", candidateProfile)
    .replace("{{job_post}}", jobPost);
}

function extractJson(text: string): unknown {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
  }
  return JSON.parse(cleaned);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const candidateProfile: string | undefined = body?.candidate_profile;
    const jobPost: string | undefined = body?.job_post;

    if (!candidateProfile || !jobPost) {
      return new Response(
        JSON.stringify({ error: "candidate_profile and job_post are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            "OPENAI_API_KEY is not configured. Add it as an edge function secret.",
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          temperature: 0,
          messages: [
            {
              role: "system",
              content:
                "You are a job-fit scoring engine. Return ONLY valid JSON.",
            },
            {
              role: "user",
              content: buildUserPrompt(candidateProfile, jobPost),
            },
          ],
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      return new Response(
        JSON.stringify({
          error: `OpenAI request failed (${openaiResponse.status})`,
          detail: errText,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openaiData = await openaiResponse.json();
    const content: string | undefined =
      openaiData?.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Empty response from OpenAI" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsed: unknown;
    try {
      parsed = extractJson(content);
    } catch {
      return new Response(
        JSON.stringify({
          error: "Failed to parse JSON from OpenAI response",
          raw: content,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
