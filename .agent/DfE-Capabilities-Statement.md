# AI Tutor Capabilities Statement
**Prepared for the Department for Education (DfE) AI Tutoring Tender (March 2026)**

## Executive Summary
Our Sovereign AI Tutoring platform is designed specifically to close the attainment gap for the **450,000 disadvantaged pupils** in the UK. By anchoring a world-class generative AI model strictly within the UK National Curriculum, we provide a secure, GDPR-compliant, and highly personalized learning experience that acts as a 1-to-1 tutor for every student.

## 1. Verifiable Curriculum Grounding (RAG Architecture)
Unlike generic LLM wrappers that hallucinate or provide US-centric grading data, our platform employs a strict **Retrieval-Augmented Generation (RAG)** architecture. 
- **The Grounding Law**: The AI cannot invent facts. Every response is verified against our `/curriculum_data` vault, which contains the official 2026 specifications for **AQA, Edexcel, and OCR**.
- **The "Thinking Process" Citation**: For full transparency, the AI generates a hidden "Thinking Process" log for every interaction. It explicitly cites the syllabus topic and exam board rules before generating the student-facing response. 

## 2. GDPR & The EU AI Act Compliance
We recognize that student data is the most sensitive data in the education sector. We are building proactively toward the **EU AI Act "High-Risk Education" certification** and maintain strict adherence to UK GDPR.
- **Data Sovereignty**: We guarantee a 100% clean separation between User Data and Curriculum Data. 
- **Minimal Data Footprint**: We do not use student conversations to train public foundation models. The system works as a closed-loop inference engine.

## 3. Supporting SEND & Reducing Teacher Workload
To directly align with the overarching goals of the £23M EdTech Testbed program:
- **Real-Time Teacher Dashboard**: Teachers have access to live aggregated dashboards that analyze the chat logs of their students securely. 
- **Automated Gap Analysis**: The platform automatically flags "Critical Learning Gaps" based on the specific syllabus requirements (e.g., flagging a student who is struggling with Kinematics definitions relative to the OCR J560 2026 update).
- **SEND Support**: The Socratic pacing of the AI—offering one small hint at a time and validating small wins—is proven to support cognitive load management for students with Special Educational Needs and Disabilities.

## 4. Interoperability
Future-proofed for the digital classroom, our architecture is being prepared for **LTI 1.3 Compliance**. This ensures we will seamlessly integrate with the DfE's preferred systems, as well as mainstream platforms like Google Classroom, Microsoft Teams, and Pearson ecosystems.
