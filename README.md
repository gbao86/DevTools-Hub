<div align="center">

# ⚡ DevTools Hub

### _All the developer tools you need. One page. Zero BS._

**[🌐 Live Demo](https://dev-tools-hub-tan.vercel.app)** · **[📦 GitHub](https://github.com/gbao86/DevTools-Hub)**

[![MIT License](https://img.shields.io/badge/License-MIT-6366f1?style=for-the-badge)](LICENSE)
[![Made with JS](https://img.shields.io/badge/Made_with-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![100% Offline](https://img.shields.io/badge/100%25-Offline-10b981?style=for-the-badge)](#-privacy--security)
[![Vercel](https://img.shields.io/badge/Live-Vercel-000?style=for-the-badge&logo=vercel)](https://dev-tools-hub-tan.vercel.app)

<br/>

<img src="https://img.shields.io/badge/📋_JSON_Formatter-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/🔐_Base64-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/🔗_URL_Encoder-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/🔑_Hash_Generator-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/🧪_Regex_Tester-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/🎨_Color_Picker-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/📝_Lorem_Ipsum-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/⏰_Timestamp-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/🎫_JWT_Decoder-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/🔍_Diff_Checker-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/📖_Markdown-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/🆔_UUID-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/🔢_Text_Counter-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/📐_CSS_Units-1a2235?style=flat-square" /> <img src="https://img.shields.io/badge/🔢_Number_Base-1a2235?style=flat-square" />

</div>

---

## 🤔 Why DevTools Hub?

Every developer's browser has 20+ bookmarks to random tool websites — most of them ugly, slow, and plastered with ads. Some even **send your data to their servers**.

**DevTools Hub fixes all of that.**

- 🔒 **Your data never leaves your browser.** Everything runs client-side.
- ⚡ **Instant.** No loading spinners. No server round-trips. No sign-ups.
- 🎨 **Beautiful.** Dark theme. Glassmorphism. Smooth animations.
- 📦 **Zero dependencies.** Pure HTML + CSS + JavaScript. That's it.

---

## 🛠️ 15 Tools & Counting

| Tool | What it does |
|:-----|:-------------|
| 📋 **JSON Formatter** | Format, validate, minify & tree-view JSON |
| 🔐 **Base64 Encode/Decode** | Encode & decode Base64 with full UTF-8 support |
| 🔗 **URL Encode/Decode** | Encode/decode URLs + parse query parameters |
| 🔑 **Hash Generator** | Generate MD5, SHA-1, SHA-256, SHA-512 hashes |
| 🧪 **Regex Tester** | Test regex patterns with real-time highlighting |
| 🎨 **Color Picker** | Pick colors, convert HEX/RGB/HSL + WCAG contrast |
| 📝 **Lorem Ipsum** | Generate placeholder text for designs |
| ⏰ **Timestamp Converter** | Convert Unix timestamps ↔ human dates |
| 🎫 **JWT Decoder** | Decode & inspect JWT tokens |
| 🔍 **Diff Checker** | Compare two texts side-by-side |
| 📖 **Markdown Preview** | Live markdown editor with instant preview |
| 🆔 **UUID Generator** | Generate UUID v4 in bulk |
| 🔢 **Text Counter** | Count words, chars, sentences + case converter |
| 📐 **CSS Unit Converter** | Convert between px, rem, em, %, vw, vh |
| 🔢 **Number Base Converter** | Convert between decimal, binary, octal, hex |

---

## 🔒 Privacy & Security

```
┌─────────────────────────────────────────────┐
│                                             │
│   Your Data ──→ Your Browser ──→ Results    │
│                                             │
│   ✗ No server calls                         │
│   ✗ No cookies or tracking                  │
│   ✗ No accounts or sign-ups                 │
│   ✗ No ads                                  │
│   ✓ 100% client-side JavaScript             │
│   ✓ Open source — audit the code yourself   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🏗️ Project Structure

```
DevTools-Hub/
├── index.html              # Entry point
├── css/
│   └── style.css           # Design system (dark theme, components)
├── js/
│   ├── app.js              # Core app controller & routing
│   └── tools/              # Each tool is a self-contained module
│       ├── json-formatter.js
│       ├── base64.js
│       ├── url-encoder.js
│       ├── hash-generator.js
│       ├── regex-tester.js
│       ├── color-picker.js
│       ├── lorem-ipsum.js
│       ├── timestamp-converter.js
│       ├── jwt-decoder.js
│       ├── diff-checker.js
│       ├── markdown-preview.js
│       ├── uuid-generator.js
│       ├── text-counter.js
│       ├── css-unit-converter.js
│       └── number-base-converter.js
├── LICENSE
├── README.md
└── .gitignore
```

---

## 🧩 Adding a New Tool

Creating a new tool is dead simple. Create a file in `js/tools/`:

```javascript
const MyTool = {
    name: 'My Tool',
    icon: '🔧',
    category: 'Converter',       // Encode / Decode | Formatter | Generator | Converter | Text | Web | Tester
    description: 'What it does',
    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>My Tool</h2>
                    <p class="tool-description">What it does</p>
                </div>
                <div class="tool-body">
                    <!-- Your UI here -->
                </div>
            </div>
        `;
        // Set up event listeners here
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(MyTool);
```

Then add a `<script>` tag in `index.html`. Done.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Free to use, modify, and distribute. Go wild. 🚀

---

<div align="center">

**Built with ❤️ and vanilla JavaScript**

_No React. No Angular. No Vue. No dependencies. Just vibes._

</div>
