***An AI-mediated matching layer that replaces one-click Easy Apply noise with a shared, transparent fit signal for both candidates and recruiters.***

### **LOOM WALKTHROUGH**

https://www.loom.com/share/00ee6ca533934d00b59d122448df3889

### **THE PROBLEM**

- LinkedIn's Easy Apply removed friction from applying but added no signal in its place
- Recruiters at scale report receiving 1,200+ applications in 48 hours for a single role, unreviewable volume
- Qualified candidates get buried under low-effort, high-volume applicants
- Everyone loses: candidates feel invisible, recruiters can't evaluate properly, hiring slows down

### **USER PERSONA**

**Primary**: a recruiter drowning in Easy Apply volume, unable to distinguish signal from noise. **Secondary**: a genuinely qualified candidate whose application gets lost despite being a strong fit.

### **AI SOLUTION & WORKFLOW**

<aside>
📌

**Solution**

At the point of application, AI generates a shared fit assessment, visible to both candidate (before submitting) and recruiter (in their queue), replacing silent, one-sided filtering with a transparent, mutual signal.

Control + Shift + m- **AI Workflow Diagram**
    
    <img width="2080" height="4954" alt="image" src="https://github.com/user-attachments/assets/bb112f6f-68a8-46ef-ad75-991f4d7f49e8" />

    
</aside>

<aside>
⚙

#### **Why AI**

Fit isn't keyword-matching, it requires reasoning over unstructured experience, context, and depth of skill against a specific job's real requirements, something rules-based filters can't do without heavy false positives/negatives.

</aside>

### **CORE DECISIONS**

- One shared fit signal for both sides, not two separate features, attacks the root cause (zero signal), not just symptoms on either end
- Must-have requirements act as a gate, not just a weighted factor, hard disqualifiers shouldn't be averaged away by strong scores elsewhere
- Candidates see their assessment before submitting, preserving agency to edit, apply anyway, or withdraw

### **Before/after visual**

<img width="1544" height="1387" alt="image" src="https://github.com/user-attachments/assets/6bfd8fe6-6406-4a0a-a94d-e1e1deb1531c" />

#### **What changes**

- Applications arrive pre-scored and ranked, not just as a resume pile
- Candidates get actionable feedback (what's a real gap vs. what's already strong) before applying
- "Hiding" a score is a neutral, visible choice, not a silent gap
- Recruiters see rationale, not just a number, designed to stay assistive, not decisive
  
### **BUSINESS IMPACT**

**For recruiters:**

Pre-sorted applications with visible rationale could meaningfully cut the hours spent manually screening high-volume roles turning a 1,200-application pile into a ranked shortlist. 

**For candidates:**

Actionable pre-submission feedback could reduce wasted low-fit applications, improving response rates industry-wide. 

**The core trade-off validated here:** signal can be restored without reintroducing the friction Easy Apply was built to remove, though production-scale impact would depend on the deterministic verification fix (Section 5.4 of the Eval doc) being built before real-world deployment.

### PROPOSED SOLUTION: Deterministic Code-level Verfication

The reliable fix is to stop trusting the model's self-report and instead verify its claims with independent, non-AI code, following a pattern sometimes called a grounding check

---

### **IMPORTANT DOCUMENTS**

Feature Redesign PRD: https://lovely-asterisk-eb3.notion.site/Feature-Redesign-PRD-3bc818c33dd380a7b3b7f8d3a067984b?source=copy_link

Eval Rubric & Testing Results: https://lovely-asterisk-eb3.notion.site/Eval-Rubric-Testing-Results-3bc818c33dd3803f9970fee5d2962145?source=copy_link

Failure Modes & Guardrails: https://lovely-asterisk-eb3.notion.site/Failure-Modes-Guardrails-3bc818c33dd380d18706fc5e572287be?source=copy_link 

</aside>
