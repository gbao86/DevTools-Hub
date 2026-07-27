# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.1] - 2026-07-27

### Added
- **Regex Tester Pro Upgrade**: Massively upgraded the existing Regex Tester tool to include 4 new professional features:
  - **Substitution (Regex Replace)**: Real-time string replacement using captured groups (e.g. `$1`, `$2`).
  - **Match Information & Capture Groups**: Detailed breakdown of full matches and all capture groups (including named groups) using `String.prototype.matchAll()`.
  - **Regex Explainer**: Built-in parser that translates the meaning of each regex token into natural language (Vietnamese).
  - **Cheatsheet Sidebar**: Interactive quick-reference sidebar to easily insert common regex tokens (`\d`, `\w`, etc.) at the cursor position.

### Fixed
- **JSON ↔ YAML Converter**: Fixed parsing errors (`Invalid key:value format`) when dealing with complex YAML structures (like multiline strings and nested arrays/objects) by replacing the custom parser with the robust `js-yaml` library (included offline).

---

## [0.2] - 2026-07-27

### 🚀 Major UI Overhaul & 10 New Tools

Complete navigation redesign and significant tool expansion — from 15 to 25 developer utilities.

### Added

- **Navigation — Command Palette**
  - Replaced fixed sidebar with a compact top navigation bar (56px, glassmorphism blur)
  - Introduced a centered Command Palette overlay (inspired by VS Code / Linear / Raycast)
  - Keyboard-driven workflow: `Ctrl+K` to open, `↑↓` to navigate, `Enter` to select, `Escape` to dismiss
  - Fuzzy search across all tools with real-time filtering
  - Breadcrumb trail in the top bar when a tool is active
  - Full-width content area — no permanent sidebar consuming horizontal space

- **New Tools (10)**
  - 🔀 **JSON ↔ YAML Converter** — bidirectional conversion with built-in mini YAML parser/serializer (no external dependencies)
  - ✨ **SQL Formatter** — format, beautify & minify SQL queries with keyword casing and configurable indentation
  - ⏰ **Cron Expression Parser** — human-readable cron descriptions, next-10-runs calculator, visual field builder & common presets
  - 🔑 **Password Generator** — cryptographically secure (`crypto.getRandomValues`), configurable charset, entropy meter, bulk generation
  - 🔗 **HTML Entity Encoder/Decoder** — named & numeric entity support, encoding mode toggle, common entity reference table
  - 📝 **String Case Converter** — real-time conversion across 13 formats (camelCase, snake_case, kebab-case, PascalCase, SCREAMING_SNAKE, dot.case, path/case, Title Case, etc.)
  - 🎨 **CSS Gradient Generator** — visual builder for linear/radial/conic gradients, adjustable color stops, preset gallery, random gradient, live CSS output
  - 🆔 **Placeholder Image Generator** — customizable SVG placeholders with dimension presets, color pickers, text overlay, PNG/SVG export
  - 🔐 **Chmod Calculator** — numeric ↔ symbolic permission conversion, interactive 3×3 checkbox grid (Owner/Group/Others × rwx), common presets, command output
  - ✨ **Code Snippet Beautifier** — Carbon-style code screenshot tool with 6 themes, 14 languages, macOS window chrome, customizable padding/radius, PNG export via Canvas

### Changed

- **Layout architecture**: migrated from a fixed 260px left sidebar to a top-bar + on-demand command palette model, reclaiming 100% viewport width for tool content
- **CSS design system**: rewrote `style.css` to support the new layout — added command palette styles, topbar component, range input theming, responsive breakpoints for the overlay
- **App controller** (`app.js`): refactored tool navigation from sidebar click handlers to a full command palette system with keyboard navigation, focus management, and filtered item tracking
- **Tool count stat** on welcome screen updated from 15 → 25
- **Version identifier** updated from `v0.0.1` → `v0.2`

### Fixed

- Hardcoded hex color values in Cron Parser error styles replaced with CSS variable references (`var(--accent-danger)`, `rgba()` fallbacks) for correct rendering in both dark and light themes

### Security

- All 10 new tools run entirely client-side — zero network requests, zero data exfiltration
- Password Generator uses the Web Crypto API (`crypto.getRandomValues()`) for cryptographically secure randomness

---

## [0.1] - 2026-07-26

### 🎉 Initial Release

First public release of DevTools Hub — a collection of 15 developer tools running 100% client-side.

### Added

- **Core & UI**
  - Linear/Vercel-inspired professional Design System
  - Global Light / Dark mode switcher with `localStorage` persistence
  - Crisp, thin-line SVG icons replacing all emojis across the UI
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

### Changed
- Removed GSAP and heavy 3D background scripts to achieve absolute zero-dependencies and improve rendering performance.
- Flattened tool cards and removed heavy box-shadows / glowing gradients for a cleaner, engineering-focused look.
- Fixed layout parsing bugs and right-shift overflow issues on `main-content`.

### Security
- Zero external API calls — all processing happens in-browser
- No cookies, tracking, or data collection
- No user accounts or authentication required

---

[0.2]: https://github.com/gbao86/DevTools-Hub/compare/v0.1...v0.2
[0.1]: https://github.com/gbao86/DevTools-Hub/releases/tag/v0.1
