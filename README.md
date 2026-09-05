***An AI-mediated matching layer that replaces one-click Easy Apply noise with a shared, transparent fit signal for both candidates and recruiters.***

LOOM WALKTHROUGH

https://www.loom.com/share/00ee6ca533934d00b59d122448df3889

THE PROBLEM

- LinkedIn's Easy Apply removed friction from applying but added no signal in its place
- Recruiters at scale report receiving 1,200+ applications in 48 hours for a single role, unreviewable volume
- Qualified candidates get buried under low-effort, high-volume applicants
- Everyone loses: candidates feel invisible, recruiters can't evaluate properly, hiring slows down

**USER PERSONA**

**Primary**: a recruiter drowning in Easy Apply volume, unable to distinguish signal from noise. **Secondary**: a genuinely qualified candidate whose application gets lost despite being a strong fit.

### **AI SOLUTION & WORKFLOW**

<aside>
📌

**Solution**

At the point of application, AI generates a shared fit assessment, visible to both candidate (before submitting) and recruiter (in their queue), replacing silent, one-sided filtering with a transparent, mutual signal.

- **AI Workflow Diagram**
    
    !Linkedin ai workflow.png
    
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

!Linkedin fir score before after.png

#### **What changes**

- Applications arrive pre-scored and ranked, not just as a resume pile
- Candidates get actionable feedback (what's a real gap vs. what's already strong) before applying
- "Hiding" a score is a neutral, visible choice, not a silent gap
- Recruiters see rationale, not just a number, designed to stay assistive, not decisive
