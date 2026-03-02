# JUNIOR FOUNDRY READINESS VALIDATION

**Objective:** Outline the data ingestion and processing pipeline for Key Stage 2 (Ages 7-11) curriculum frameworks, specifically preparing the system to ingest *White Rose Maths* schemes of learning and *STA (Standards and Testing Agency)* Assessment data.

## 1. Data Ingestion Protocol
Upon upload of the White Rose Maths and STA Assessment PDFs/files, the system will utilize the established RAG (Retrieval-Augmented Generation) pipeline:
- **Chunking Strategy:** Documents will be parsed into JSON/Markdown chunks, strictly delineated by Year Group (e.g., "Year 4 Block 1: Place Value").
- **Embedding Generation:** The text will be vectorized using the `gemini-embedding-001` model.
- **Vector Storage:** Inserted into the Supabase `curriculum_documents` table under a new subject tag: `Maths (Primary)`.

## 2. Processing White Rose Maths (WRM)
The WRM scheme is built on a "Small Steps" progression. 
- **Mapping:** When a student query is matched against the database, the AI will retrieve the exact "Small Step" terminology.
- **Socratic Anchor:** The AI will use the retrieved WRM 'teaching point' as the foundation for its "Hint-First" strategy, explicitly avoiding jumping ahead to future curriculum steps.
- **Representations:** If the WRM text mentions a Bar Model or Part-Whole Model, the AI is instructed to verbally construct or prompt the student to draw that specific representation.

## 3. Processing STA Assessment Data
The STA provides standard exemplification materials and mark schemes for Years 2 and 6 SATs.
- **Diagnostic Anchoring:** This data will be ingested to calibrate the `junior-marker.md` skill.
- **Expected Standard (EXS) vs Greater Depth (GDS):** The AI will analyze student inputs against the retrieved STA criteria to determine if their reasoning meets EXS or GDS thresholds.
- **Gap Analysis Heatmap:** The Teacher Dashboard relies on this strict STA correlation. If a student consistently fails a "Multi-Step Math Reasoning" problem, it flags the exact STA code on the Teacher's Dashboard.

## 4. Verification Check
- [x] RAG Pipeline Schema ready in Supabase.
- [x] Primary Class View toggle active on `/teacher` dashboard.
- [x] `junior-safety.md` active to monitor distress during independent learning.
- [x] Concept-to-Calculation Socratic paths mapped in API.

The system is now fully prepared to receive the curriculum payloads and automatically map them to the Key Stage 2 Foundry environment.
