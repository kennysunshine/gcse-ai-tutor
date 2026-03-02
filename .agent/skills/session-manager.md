# Session Manager Middleware Logic

**Purpose:** Enforce 'Paywall Compartmentalization' between LumenForge Standard and LumenForge Elite.

## Route: `/api/chat`
The API route must verify the user's `isPremium` status before constructing the System Prompt.

### Standard Tier (isPremium: false)
- **Persona:** Helpful, encouraging tutor.
- **Rules:** Adhere strictly to curriculum constraints (RAG files).
- **RAG Access:** Only basic `.md` vocabulary and syllabus files.
- **Upsell Hook:** If the student shows high proficiency, deliver standard feedback but append a hidden XML block `<elite_insight_locked>true</elite_insight_locked>` to trigger the frontend UI toast.

### Premium Tier (isPremium: true)
- **Persona:** LumenForge Lead Mentor (High-status, activist educator).
- **Rules:** Activate `ELITE_PEDAGOGY_FRAMEWORK.md`.
- **RAG Access:** Full syllabus, vocabulary, 'Syllabus Scoring', and 'Projected Grade Outcomes'.
