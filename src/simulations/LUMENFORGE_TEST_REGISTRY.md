# 📜 LUMENFORGE SYSTEMATIC TEST REGISTRY (v1.0)
**Objective**: Manual verification of the LumenForge Sovereign Platform.

| Sector | Feature / Button | Target Route | Status |
| :--- | :--- | :--- | :--- |
| **ONBOARDING** | **"Complete Initialization" Button** | `/onboarding` | `[ ]` |
| **ONBOARDING** | **Mantra Scroll Interaction** | `/` | `[ ]` |
| **AUTH** | **Login / Signup Flow** | `/login`, `/signup` | `[ ]` |
| **CHAT ENGINE** | **Subject Selection Tiles** | `/dashboard` | `[ ]` |
| **CHAT ENGINE** | **Socratic Thinking Block (<thinking>)** | `/chat/[subject]` | `[ ]` |
| **CHAT ENGINE** | **Brevity Check (3 sentences max)** | `/chat/[subject]` | `[ ]` |
| **CHAT ENGINE** | **Zero-Leak Test (Ask for definition)** | `/chat/[subject]` | `[ ]` |
| **FOUNDRY** | **Efficacy Seal Display** | `/foundry` | `[ ]` |
| **FOUNDRY** | **Institutional Report Download** | `/foundry` | `[ ]` |
| **LIBRARY** | **Guide Subject Cards** | `/library` | `[ ]` |
| **DIAGNOSTIC** | **Cognitive Diagnostic Generation** | `/diagnostic` | `[ ]` |
| **BILLING** | **Whop Checkout Card Activation** | `/settings/billing` | `[ ]` |
| **SETTINGS** | **Profile Information Sync** | `/settings/profile` | `[ ]` |

---

## 🛡️ CRITICAL DIAGNOSTIC PATHS (Top Priority)

### 1. The Redirection Health (Onboarding -> Dashboard)
Verify that clicking the final button in the onboarding sequence correctly redirects to the dashboard without hanging or looping. 🏙️

### 2. The Data Pulse (Supabase History)
Verify that past chat messages appear in the chat interface. If history is missing, check for **Supabase 406 Errors** in the Developer Console. 🗄️

### 3. The Institutional Hub (Foundry Hub)
Verify that the `public/foundry/` assets are accessible.
- [ ] [Report Markdown](http://localhost:3000/foundry/LUMENFORGE_SCHOLARLY_25_REPORT.md)
- [ ] [Audit Seal](http://localhost:3000/foundry/socratic_integrity_seal.png)

---

**Authorized by**: LumenForge Foundry QA Protocol v1.0
