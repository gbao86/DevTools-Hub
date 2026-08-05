# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.0] - 2026-08-05

### 🌐 Web Category Expansion — 3 New Visual CSS Tools

Expanded the Web category from 2 to 5 tools with three powerful visual builders that developers use daily. All tools are 100% client-side with real-time preview, presets, and CSS code export.

### Added

- **📐 Flexbox Playground**: Visual Flexbox builder with live preview — configure container properties (direction, wrap, justify-content, align-items, gap), manage up to 12 items with individual flex-grow/shrink/basis/order/align-self controls, 6 layout presets (Navigation Bar, Centered Content, Sidebar Layout, Card Grid, Holy Grail, Equal Heights), and instant CSS code generation.

- **🔲 CSS Grid Generator**: Visual CSS Grid layout builder — define rows/columns with flexible sizing (fr, px, %, auto), row/column gap controls, alignment options (justify-items, align-items, justify-content, align-content), interactive grid preview with cell highlighting, 5 presets (Basic 3-Column, 12-Column Grid, Holy Grail, Dashboard, Gallery), and full CSS export.

- **🎬 CSS Animation Builder**: Visual @keyframes editor with timeline — interactive keyframe timeline (click to add, drag to reposition), per-keyframe property controls (transform, opacity, background-color, border-radius), visual cubic-bezier curve editor with draggable control points, live animation preview with play/pause/restart and speed control (0.25x–2x), 5 presets (Fade In, Slide In, Bounce, Pulse, Spin), and complete @keyframes + animation class CSS output.

### Changed

- Updated tool count from 36 to 39 on welcome screen
- Added SVG icon mappings for 🔲 (grid) and 🎬 (play) in icon system

---

### 🔧 Comprehensive Bug Fix — 11 Tool Files, 33 Fixes

Full code review and bug fix sweep across all tools added in v0.3 and v0.3.1. Addressed 13 critical crashes, 14 high-severity bugs, and 6 medium issues.

### Fixed

- **🔴 QR Code — SVG Export Crash**: Fixed `ReferenceError: QRCodeLib is not defined` that caused SVG download to fail 100% of the time. Replaced with canvas-to-SVG conversion.
- **🔴 QR Code — Paste Scanner Crash**: Fixed `e.originalEvent` (jQuery-only pattern) causing `TypeError` on native browser `ClipboardEvent`.
- **🔴 QR Code — Paste Listener Leak**: Replaced global `document` paste listener with named handler + unbind-before-bind pattern to prevent listener stacking on re-render.
- **🟡 QR Code — Wi-Fi QR Malformed Payload**: Fixed double semicolons (`;;`) in generated Wi-Fi QR strings.
- **🟡 QR Code — Security**: Added `noopener,noreferrer` to `window.open()` for scanned URLs.
- **🔴 cURL Converter — Tokenizer Broken**: Fixed backslash comparison `char === '\\\\'` (2-char string) → `char === '\\'` (1-char) so escape logic actually executes.
- **🔴 cURL Converter — Line Continuation Regex**: Fixed regex that matched 3 backslashes instead of 1, breaking multi-line cURL commands.
- **🟠 cURL Converter — XSS & Invisible PHP**: Added `escapeHtml()` to all user-controlled output in parsed info and generated code display. Fixes `<?php` being parsed as HTML.
- **🟠 cURL Converter — Unicode Auth Crash**: Replaced `btoa(p.auth)` with UTF-8 safe `btoa(unescape(encodeURIComponent(p.auth)))`.
- **🔴 API Tester — URL Crash**: Wrapped `new URL(baseUrl)` in try-catch with user-friendly toast error on invalid URLs.
- **🔴 API Tester — JSON Highlighter Broken**: Fixed `escapeHtml()` running before regex, converting `"` to `&quot;` and breaking all string/key pattern matching.
- **🟠 API Tester — XSS in History**: Escaped `item.url` and `item.method` in history list `innerHTML`.
- **🟡 API Tester — Double-Escaped Newlines**: Fixed `\\n` → `\n` in HTTPBin preset body and error messages.
- **🔴 HTTP Status Codes — Copy Button SyntaxError**: Fixed inline `onclick` breaking for status 418 (`I'm a teapot`) by escaping single quotes.
- **🟠 HTTP Status Codes — Duplicate Style Injection**: Added ID check to prevent duplicate `<style>` tags on re-render.
- **🟢 HTTP Status Codes — Typo**: Fixed duplicate word `proxy proxy` → `proxy`.
- **🔴 Box Shadow Generator — hexToRgb Returns Black for #fff**: Added 3-digit shorthand hex expansion before parsing.
- **🔴 Box Shadow Generator — Layer Deletion Index Bug**: Fixed `activeLayer` not decrementing when deleting a layer before the active one.
- **🔴 Box Shadow Generator — CSS Import Ignores rgb()**: Extended parser to handle both `rgb()` and `rgba()` color formats.
- **🔴 Keyboard Shortcuts — JSON.parse Crash**: Added try-catch around `JSON.parse(localStorage)` for corrupted favorites data.
- **🟠 Keyboard Shortcuts — Malformed HTML Attributes**: Escaped double quotes in `data-keys` attribute for commands like `git commit -m "msg"`.
- **🟡 Keyboard Shortcuts — Deprecated API Safety**: Added fallback for `navigator.platform` with optional chaining.
- **🔴 Image to Base64 — Paste Crash**: Fixed `e.originalEvent` crash (same as QR Code).
- **🟠 Image to Base64 — Paste Listener Leak**: Scoped window paste listener with named handler + unbind pattern.
- **🟠 Image to Base64 — DataTransferItemList Iteration**: Replaced `for...in` with standard `for` loop.
- **🟡 Image to Base64 — Race Condition**: Moved `img.src` assignment after `onerror`/`onload` handlers.
- **🔴 .env Viewer — XSS Vulnerability**: Added `escapeHtml()` to all user input interpolated into `innerHTML`.
- **🟡 .env Viewer — No-Op Regex in Copy TSV**: Fixed `replace(/\\n/g, '\\n')` → `replace(/\n/g, '\\n')`.
- **🟠 Unicode Table — HTML Corruption**: Added `escapeHtml()` for characters `<`, `>`, `&` (ASCII 38, 60, 62) in table cells.
- **🟠 Meta Tag Generator — HTML Attribute Escaping**: Added `escapeAttr()` helper to prevent broken meta tags when values contain quotes.
- **🟡 Meta Tag Generator — White Theme Color Suppressed**: Removed `!== '#ffffff'` check that prevented white theme color generation.
- **🟠 JSON Path Finder — Stale Tree on Parse Error**: Clear tree HTML when JSON parsing fails.

### Security

- Fixed XSS vulnerabilities in 5 tools: cURL Converter, API Tester, .env Viewer, Unicode Table, Meta Tag Generator
- Added `noopener,noreferrer` to QR Code scanner URL opener
- Replaced unsafe `btoa()` with UTF-8 safe encoding in cURL Converter

---

## [0.3.1] - 2026-07-29

### Added

- 📱 **QR Code Generator & Scanner** — generate custom QR codes for URLs/Text, Wi-Fi networks (SSID, Password, Security type), and vCard contacts with custom foreground/background colors, dimensions (200px–800px), and Error Correction Level (L/M/Q/H). Export to PNG, SVG, or copy Base64 image. Includes 100% client-side QR code decoder from uploaded images or clipboard (`Ctrl+V`).
- **Tool count**: Updated tool counter and documentation from 35 → 36.

### Fixed

- **🔴 QR Code Generator — Infinite Recursion**: Fixed a fatal infinite recursion bug (Maximum Call Stack Size Exceeded) caused by an incorrect Galois Field (GF256) polynomial table initialization. Switched to the proven `qrcode.js` library for 100% generating reliability.
- **🟡 QR Code Generator — UTF-8 Data Truncation**: Configured the internal byte encoder to use UTF-8 instead of 8-bit ASCII. This fixes an issue where Vietnamese characters (or any non-ASCII Unicode strings like emoji) were severely corrupted, resulting in QR codes that standard apps (Zalo, Google Lens) could not decode correctly.

---

## [0.3] - 2026-07-28

### 🚀 10 New Tools & Regex Tester Rewrite

Major expansion from 25 to 35 developer tools, plus a complete rewrite of the Regex Tester with critical bug fixes.

### Added

- **New Category: Reference** — added a new tool category for quick-lookup reference tools

- **New Tools (10)**
  - 📋 **JSON Path Finder** — interactive JSON tree view, click any key/value to copy its JSONPath (`$.data[0].name`), search by key, type-colored values
  - 🌐 **HTTP Status Codes** — comprehensive reference for all HTTP status codes (100–511), grouped by category, color-coded, searchable, with detailed explanations
  - 🔀 **cURL Converter** — paste cURL commands → generate code in JavaScript (fetch/axios), Python (requests), Go (net/http), PHP (cURL), with parsed request breakdown
  - 🔄 **Image to Base64** — drag & drop images/SVG → Base64 Data URL, CSS background, HTML img, Markdown output, with reverse decode mode
  - 🎨 **Box Shadow Generator** — visual CSS box-shadow editor with multi-layer support, preset shadows (Subtle, Neumorphism, Material, etc.), live preview
  - 📝 **ASCII / Unicode Table** — full ASCII table (0–127), character ↔ code point converter, common symbols, grid/list view toggle
  - ✨ **.env Viewer** — parse & display .env files as sortable/searchable table, auto-detect value types, mask sensitive keys (PASSWORD, SECRET, TOKEN, etc.)
  - 🌐 **API Tester** — HTTP request builder with method/headers/body/params, response viewer with timing, status codes, auto-formatted JSON, request history
  - 🌐 **Meta Tag Generator** — generate SEO, Open Graph & Twitter Card meta tags, Google search preview, social card preview, completeness score
  - 📝 **Keyboard Shortcuts** — searchable reference for VS Code, IntelliJ, Vim, Terminal, Chrome DevTools & Git shortcuts, OS toggle (Win/Mac), favorites

### Changed

- **Regex Tester — Complete V3 Rewrite**
  - Replaced cluttered 2-column layout (main + sidebar) with clean single-column flow
  - Reorganized output into 3 tabs: Matches & Groups / Replace / Giải thích
  - Replaced checkboxes with toggle buttons for regex flags (g, i, m, s, u)
  - Added real-time match count badge (green for matches, red for no match)
  - Converted cheatsheet from always-visible sidebar to collapsible panel
  - Added more preset patterns: IPv4 addresses, Vietnamese phone numbers
  - Redesigned pattern input bar with integrated `/pattern/flags` visual (similar to regex101)

- **Navigation**: Added `Reference` category (order: 8) for lookup-style tools
- **Script organization**: Reorganized `index.html` script tags by category with comments
- **Tool count**: Updated welcome screen counter from 25 → 35

### Fixed

- **🔴 Regex Tester — Backslash escaping bug (CRITICAL)**: All `\d`, `\w`, `\s`, `\b` sequences were being consumed by JavaScript template literals, rendering as literal characters `d`, `w`, `s`, `b` instead of regex character classes. Affected: preset patterns, cheatsheet inserts, default pattern value, and the Regex Explainer token parser. Fixed by properly escaping all backslashes.
- **🔴 Regex Explainer — Token matching (CRITICAL)**: Explainer regex tokens like `/^d/` incorrectly matched literal `d` instead of `\d`. All token patterns rewritten to correctly match backslash-prefixed sequences.
- **🟡 Regex Tester — Invalid HTML**: Removed invalid `readonly` attribute from `<div>` element.
- **🟡 Regex Tester — Height mismatch**: Fixed highlight box having fixed `max-height: 126px` while textarea was resizable, causing scroll desync.

### Security

- All 10 new tools run entirely client-side — zero data exfiltration
- API Tester uses the browser's native Fetch API for HTTP requests (no proxy server)

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

[0.3.2]: https://github.com/gbao86/DevTools-Hub/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/gbao86/DevTools-Hub/compare/v0.3...v0.3.1
[0.3]: https://github.com/gbao86/DevTools-Hub/compare/v0.2.1...v0.3
[0.2.1]: https://github.com/gbao86/DevTools-Hub/compare/v0.2...v0.2.1
[0.2]: https://github.com/gbao86/DevTools-Hub/compare/v0.1...v0.2
[0.1]: https://github.com/gbao86/DevTools-Hub/releases/tag/v0.1
