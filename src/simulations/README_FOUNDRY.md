# 🏛️ The LumenForge Batch Foundry (v1.0)

This framework allows the founding team to generate **Proprietary Efficacy Data** by stress-testing the Socratic Engine across thousands of synthetic student interactions.

### 🛡️ Why we use the Foundry:
- **Efficacy Proof**: Quantifiable evidence of the "Productive Struggle."
- **Answer-Leak Prevention**: Automated detection of "Too-Easy" hints.
- **Institutional Scale**: By the time we enroll our first 100 scholars, we have already run 1,000+ synthetic simulations across every GCSE subject.

### 🏺 How to Run a Cohort:
1. **Initialize the Environment**:
   ```bash
   pip install google-generativeai
   ```
2. **Execute a Simulation Run**:
   - Run a single "Pedigree" check:
     ```bash
     python scripts/simulate_foundry.py --count 1
     ```
   - Run a full "Investor Benchmark" (50 Scholars):
     ```bash
     python scripts/simulate_foundry.py --count 50
     ```

### 📊 Reading the Results:
The foundry generates a consolidated `src/simulations/foundry_audit_v1.json` file. 

| Metric | Target | Significance |
| :--- | :--- | :--- |
| **Thinking Ratio** | > 40% | High student engagement & cognitive load. |
| **Answer Leak** | False | Proof that the engine is purely Socratic. |
| **Aha! Moment** | Turn 3-6 | The turn where the student's logic shifted. |

### 🏺 For Personal Branding:
When sharing "Build in Public" updates, use the **Thinking Ratio** charts. This proves that LumenForge is built on **science**, not just a generic chatbot wrapper.

**The Institutional Standard begins here.** 🏛️✨🏁
