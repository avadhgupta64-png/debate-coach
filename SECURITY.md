# Security Policy

## Supported Versions

Debate Coach is a single-version project. The current code on the `main` branch is the only supported version. There are no legacy release branches.

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public GitHub issue**.

Report it privately by emailing the repository owner via GitHub:  
[github.com/avadhgupta64-png](https://github.com/avadhgupta64-png)

Please include:
- A clear description of the vulnerability
- Steps to reproduce it
- The potential impact (what an attacker could achieve)
- Any suggested remediation if you have one

You can expect an acknowledgement within 72 hours and a resolution or status update within 7 days.

## Security Design Notes

The following is documented to help reviewers understand the security model:

**Authentication**
- All protected API endpoints require a Firebase ID token in the `Authorization: Bearer` header
- Tokens are verified server-side using the Firebase Admin SDK (`verifyIdToken`)
- User identity is always derived from the verified token — never from `req.body`, query parameters, or any client-supplied value
- Token expiry returns HTTP 401 with code `TOKEN_EXPIRED`

**Secrets**
- `FIREBASE_PRIVATE_KEY` (Firebase Admin service account) is server-side only and never sent to the browser
- `AI_API_KEY` (LLM provider key) is server-side only and never sent to the browser
- Frontend Firebase config (`VITE_FIREBASE_*`) is intentionally public — it identifies the app to Firebase but does not grant privileged access; access control is enforced by Firebase Authentication rules

**Input handling**
- All API request bodies are limited to 10 KB
- All protected endpoints run input validation middleware before reaching the controller
- AI-generated evidence is labelled "Example — verify before using" in every prompt to prevent fabricated citations being surfaced as fact

**CORS**
- In production: only `*.vercel.app` subdomains are allowed
- In development: only `localhost` origins are allowed
- Credentials (cookies) are not used — authentication is header-based

**No persistent server-side state**
- The backend is stateless; all session state lives in the React frontend
- No database credentials or connection strings are present in the backend
