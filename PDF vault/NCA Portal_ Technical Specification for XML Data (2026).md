# NCA Portal: Technical Specification for XML Data (2026)

## Overview
The National Curriculum Assessments Portal (NCA Portal) requires data returns in **XML format**. This specification is aligned with the **Common Transfer File (CTF) 25 specification** and the **Common Basic Data Set (CBDS)**.

## Key Technical Details
- **File Format:** XML (Extensible Markup Language).
- **Submission Window:** Monday 18 May to Friday 26 June 2026.
- **Data Structure:**
  - **Header:** Metadata about the return.
  - **School Module:** Contains pupil records.
  - **Pupil Module:** Includes identifiers (UPN, Name, etc.) and assessment records.
- **Assessment Components:**
  - English Writing (TA)
  - Science (TA)
  - English Reading (for pupils working below the standard)
  - Mathematics (for pupils working below the standard)

## XML Tags & Codes (Examples)
- **GDS:** Working at greater depth
- **EXS:** Working at the expected standard
- **WTS:** Working towards the expected standard
- **HNM:** Has not met the expected standard
- **PK1-PK6:** Pre-key stage standards
- **EM:** Engagement model

## References
- [2026 KS2 Teacher Assessment Technical Specification](https://www.gov.uk/government/publications/key-stage-2-teacher-assessment-data-collection-technical-specification/2026-key-stage-2-teacher-assessment-technical-specification)
- [Common Transfer File (CTF) 25 Specification](https://www.gov.uk/government/publications/common-transfer-file-25-specification)
