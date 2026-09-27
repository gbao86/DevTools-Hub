# Security Policy

## 🔒 Security Philosophy: Zero-Server & 100% Client-Side

At **DevTools-Hub**, privacy and security are not features—they are the foundational architecture. 

Our core security guarantees:
- **Zero Backend**: There are no servers, no databases, and no cloud processing. All data processing occurs entirely within your browser's local memory (RAM).
- **Zero Network Transmission**: Text, tokens, passwords, keys, or files you input into any tool are **never transmitted** over the network.
- **Zero Third-Party Dependencies**: DevTools-Hub is built with 100% Vanilla HTML5, CSS3, and modern JavaScript. There are zero npm dependencies and zero external runtime CDNs, completely eliminating supply-chain attack vectors.
- **Zero Telemetry**: No tracking cookies, no Google Analytics, no third-party telemetry scripts.

---

## 📋 Supported Versions

We actively support and maintain the latest release branch on `main`.

| Version | Supported | Status |
|:---|:---:|:---|
| `0.6.x` (current) | ✅ | Fully supported (Active security patches) |
| `< 0.6.0` | ❌ | End of Life (Please upgrade to latest) |

---

## 🎯 Scope of Security Concerns

We welcome reports regarding client-side vulnerabilities, including but not limited to:

- **DOM-based Cross-Site Scripting (DOM XSS)**: Incomplete sanitization in client-side previewers (Markdown, SVG, JSON, HTML entities, etc.).
- **Cryptographic Weaknesses**: Insecure pseudo-random number generation (e.g., using `Math.random()` in security-sensitive contexts instead of Web Crypto API `crypto.getRandomValues`).
- **Data Leakage**: Accidental exposure of input data via URL parameters, browser storage, or unprompted clipboard modifications.
- **Regular Expression Denial of Service (ReDoS)**: Inefficient regex causing client-side browser freezes.

### Out of Scope
- Self-XSS (attacks requiring the user to manually execute code in the browser developer console).
- Vulnerabilities present only on obsolete or unsupported browsers.
- Local attacks requiring physical access or compromised client devices (malware/keyloggers).

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability within DevTools-Hub, please report it responsibly:

### Option 1: GitHub Private Vulnerability Reporting (Recommended)
1. Go to the [Security Advisories](https://github.com/gbao86/DevTools-Hub/security/advisories) tab of this repository.
2. Click **"Report a vulnerability"** to submit a private report.

### Option 2: Direct Email Contact
If you prefer email or cannot use GitHub Advisories, please contact the maintainer directly:
- **Email**: [tiktokthu10@gmail.com](mailto:tiktokthu10@gmail.com)
- **Maintainer**: Trịnh Gia Bảo ([@gbao86](https://github.com/gbao86))
- **Repository**: [https://github.com/gbao86/DevTools-Hub](https://github.com/gbao86/DevTools-Hub)

Please include:
1. Detailed description of the vulnerability.
2. Step-by-step reproduction steps or Proof of Concept (PoC).
3. The affected tool(s) and potential impact.

---

## ⏱️ Response & Disclosure Process

- **Initial Response**: Within **24–48 hours**, acknowledging receipt of your report.
- **Triage & Remediation**: We will evaluate the report, verify the fix, and prepare a patch within **3–5 business days**.
- **Public Disclosure**: A patched version will be committed to `main` with appropriate credit to the reporter in our release notes (unless anonymity is requested).
