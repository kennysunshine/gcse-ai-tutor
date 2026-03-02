# Arbor and SIMS API Developer Guides

## Arbor API Integration
Arbor provides a comprehensive **REST and GraphQL API** for third-party developers to integrate with their school management information system.

### Key Features
- **Developer Portal:** Access is managed through the [Arbor Developer Portal](https://developers-portal.arbor.sc/).
- **Data Entities:** Supports access to student records, enrollments, attendance, behavior incidents, assessments, and classes.
- **Authentication:** Requires application and approval to start integrating data from Arbor MIS.
- **Integration Management:** Schools approve third-party apps via *System > Partner Apps (API Users)*.

## SIMS (ESS) API Integration
SIMS offers various integration methods, including the **Data Verification API (DEX)** and **SIMS ID Based APIs**.

### Key Features
- **REST API:** The Data Verification API is a RESTful service secured by **OAuth 2.0**.
- **Conceptual Operation:** Uses a "yes/no" based response with a confidence score to verify data without exposing underlying records.
- **Authentication:** Requires valid access tokens in the Authorization header, issued by the SIMS ID STS Server.
- **Documentation:** Technical documentation is provided via **Swagger** endpoints.
- **Integrator Program:** Developers must [register as a SIMS Integrator](https://www.ess-sims.co.uk/partner-with-us/becoming-a-sims-integrator) to gain full access to SDKs and APIs.

## References
- [Arbor Developer Portal](https://developers-portal.arbor.sc/)
- [SIMS Data Verification API Documentation](https://www.sims-partners.com/PRODUCT/DEX/data-verification)
- [Arbor Support: Setting up API integrations](https://support.arbor-education.com/hc/en-us/articles/360009421273-Setting-up-and-managing-third-party-API-integrations-in-Arbor)
