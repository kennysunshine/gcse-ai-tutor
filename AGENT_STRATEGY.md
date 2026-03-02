# AI Tutor: UK & EU Master Configuration Strategy (2026)

## 0. Project Vision & Identity
- **Mission**: To provide curriculum-grounded, private-school quality AI tutoring to GCSE and Baccalaureate students.
- **Model**: Sovereign AI (UK-built, for the UK/EU curriculum).
- **Compliance**: GDPR-first, building toward EU AI Act "High-Risk Education" certification (2026 standards).

## 1. Antigravity Global Agent Rules
**AGENT DIRECTIVE**: All agent actions must adhere to these constraints to ensure "Exit-Ready" data quality.
- **Jurisdiction Pinning**: Default all responses to UK-GCSE standards unless the user profile explicitly states "European Baccalaureate."
- **Lexicon Policy**: Strictly use British English (e.g., Maths, revision, mark scheme, colour). Never use "Math" or "Grade 10."
- **Unit System**: Metric only (Metres, Kilograms, Litres).
- **The "Grounding" Law**: Never provide a factual answer on a curriculum topic (Physics, Maths, Bio) without checking the `/curriculum_data` folder. If a conflict exists between internal training and these files, the local files win.

## 2. Technical Infrastructure (RAG Setup)
**AGENT DIRECTIVE**: Maintain this folder structure for auditability and interoperability.
- **Folder Structure**:
    - `/curriculum_data/uk/maths/` (Store AQA/Edexcel PDFs here)
    - `/curriculum_data/eu/bac/` (Store EB Handbook PDFs here)
    - `.agent/rules/` (Project-wide behavior files)
- **Metadata Tagging**: Every knowledge chunk must be tagged with jurisdiction, exam_board, and academic_year.
- **Verification Feature**: The agent must generate a "Thinking Process" artifact for every answer, citing the specific section of the syllabus used.

## 3. Immediate Funding & Traction Roadmap (2026)
**AGENT DIRECTIVE**: Prioritize features that align with these specific government and grant opportunities.

### A. DfE AI Tutoring Tender (March 2026)
- **Target**: 450,000 disadvantaged pupils in the UK.
- **Goal**: Provide 1-to-1 AI tutoring that closes the attainment gap.
- **AG Task**: Draft "Capabilities Statements" highlighting our grounded accuracy and GDPR privacy architecture.

### B. EdTech Testbeds (£23M Program)
- **Focus**: September 2026 launch into 1,000 UK schools.
- **Requirement**: Reducing teacher workload and supporting SEND pupils.
- **AG Task**: Create a "Teacher Dashboard" prototype that summarizes student gaps based on curriculum standards.

### C. Innovate UK Smart Grants (Spring 2026)
- **Value**: Up to £500k for high-growth startups.
- **Narrative**: Focus on "Sovereign AI"—a UK-specific alternative to generic US models.

## 4. Exit Strategy & Business Moat
- **Data Integrity**: Maintain 100% clean separation between User Data and Curriculum Data.
- **Interoperability**: Build for LTI 1.3 Compliance to ensure we can "plug and play" into Pearson or Google Classroom ecosystems.
- **IP Ownership**: Use the "Knowledge Extraction" method: use official specs to generate original practice questions, ensuring the business owns its entire content library.
