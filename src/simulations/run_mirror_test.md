# 🏛️ The Socratic Mirror Simulation Template

To be executed by the **Agent Manager (Antigravity).** 

### 🛡️ Simulation Parameters:
-   **Subject**: [e.g., Physics]
-   **Topic**: [e.g., Kinetic Energy]
-   **Scholar**: [ID from student_personas.json]
-   **Tutor**: [LumenForge v2.6 Logics]
-   **Audit Mode**: [Active]

### 🏺 Turn Workflow:
1.  **Scholar Turn**: Prompt Agent A with the topic and their persona-bias.
2.  **Tutor Turn**: Forward the student's response to the Tutor logic (src/app/api/chat/route.ts).
3.  **Audit Observation**: The IPO (Invisible Pedagogical Observer) logs the turn.
4.  **Loop**: Continue for 10-15 turns or until "Aha!" moment/completion.
5.  **Audit Summary**: Generate the final JSON efficacy report.

---

### 🏺 Simulation #001 Execution Log: [IN PROGRESS]

**Status**: [INITIALISING VERSION 1.0]
**Target**: "The Guesser" (Year 11 Physics: Kinetic Energy).
