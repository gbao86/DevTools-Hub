# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.0.1] - 2026-07-26

### 🎉 Initial Release

First public release of DevTools Hub — a collection of 15 developer tools running 100% client-side.

### Added

- **Core**
  - Dark theme design system with glassmorphism & micro-animations
  - Sidebar navigation with search (Ctrl+K)
  - Hash-based routing (SPA-like experience)
  - Mobile responsive layout
  - Toast notifications & clipboard utilities

- **Tools (15)**
  - 📋 JSON Formatter — format, validate, minify & tree-view
  - 🔐 Base64 Encode/Decode — UTF-8 support, URL-safe mode
  - 🔗 URL Encode/Decode — encode/decode + URL parser
  - 🔑 Hash Generator — MD5, SHA-1, SHA-256, SHA-512
  - 🧪 Regex Tester — real-time matching & highlighting
  - 🎨 Color Picker — HEX/RGB/HSL converter + WCAG contrast
  - 📝 Lorem Ipsum — paragraph/sentence/word generator
  - ⏰ Timestamp Converter — Unix ↔ human-readable dates
  - 🎫 JWT Decoder — decode header, payload & expiration check
  - 🔍 Diff Checker — LCS-based side-by-side text comparison
  - 📖 Markdown Preview — live editor with instant preview
  - 🆔 UUID Generator — bulk UUID v4 generation
  - 🔢 Text Counter — word/char/sentence stats + case converters
  - 📐 CSS Unit Converter — px, rem, em, %, vw, vh, pt
  - 🔢 Number Base Converter — decimal, binary, octal, hex

- **Docs**
  - README with badges, tool catalog & contribution guide
  - MIT License
  - CHANGELOG (this file)

### Security
- Zero external API calls — all processing happens in-browser
- No cookies, tracking, or data collection
- No user accounts or authentication required

---

[0.0.1]: https://github.com/gbao86/DevTools-Hub/releases/tag/v0.0.1
