# Contributing to DevTools Hub 🛠️

First off, thank you for considering contributing to **DevTools Hub**! It's people like you who make DevTools Hub an exceptional, privacy-first toolkit for developers worldwide.

Whether you're fixing a bug, polishing UI/UX, or adding tool #51, this guide will help you get started quickly and smoothly.

---

## 🧭 Core Architectural Philosophy

Before writing any code, please keep our three golden pillars in mind:

1. **🔒 100% Client-Side & Zero-Server**  
   Every computation, conversion, or formatting operation must run exclusively inside the browser's local memory (RAM). Nothing entered by the user may ever leave their machine. No external API requests, no telemetry, no tracking analytics.

2. **⚡ Zero External Dependencies**  
   DevTools Hub is proudly crafted with **100% Vanilla HTML5, modern CSS3, and ES6+ JavaScript**. We do not use npm build steps, Webpack/Vite bundlers, React, Vue, jQuery, or third-party CDN libraries. This guarantees maximum security, zero supply-chain attack risks, instant page loads, and lifetime offline capability.

3. **🎨 Polish & Consistency**  
   Every tool must adhere to our linear/modern dark-and-light design system, utilizing CSS custom properties (variables) for flawless theming across all viewports (Mobile, Tablet, Desktop).

---

## 🚀 Quickstart: Local Development

No `npm install` needed! Getting started takes less than 30 seconds:

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/DevTools-Hub.git
   cd DevTools-Hub
   ```

2. **Run a local static server** (or open `index.html` directly in your browser):
   ```bash
   # Using Python 3:
   python -m http.server 3000

   # Or using Node.js npx serve:
   npx serve .

   # Or using VS Code:
   # Install the "Live Server" extension and click "Go Live"
   ```

3. Open `http://localhost:3000` in your web browser.

---

## 🛠️ Step-by-Step: Adding a New Tool

All tools live as modular, self-contained JavaScript files inside the `js/tools/` directory.

### Step 1: Create the Tool File
Create a new file in `js/tools/` using kebab-case naming:
```
js/tools/my-new-tool.js
```

### Step 2: Implement the Tool Interface
Every tool registers itself by pushing an object into `window.DevTools`:

```javascript
/* ============================================
   DevTools Hub - [Tool Name]
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'My New Tool',
    icon: '🚀',
    category: 'Formatter', // Formatter | Converter | Generator | Encoders | Tester | Reference | Web
    version: '0.6.0',      // Match the current release version
    description: 'Clear, concise description in Vietnamese explaining what the tool does',

    render(container) {
        // Optional: Inject component-specific scoped CSS if needed
        if (!document.getElementById('my-tool-style')) {
            const style = document.createElement('style');
            style.id = 'my-tool-style';
            style.textContent = `
                .my-tool-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                @media (max-width: 768px) { .my-tool-layout { grid-template-columns: 1fr; } }
            `;
            document.head.appendChild(style);
        }

        // Render UI template using standard utility classes
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🚀 My New Tool</h2>
                    <p class="tool-description">Mô tả chi tiết tính năng của công cụ tại đây.</p>
                </div>
                <div class="tool-body">
                    <div class="tool-actions" style="margin-bottom: 1rem; gap: 0.5rem; display: flex;">
                        <button type="button" class="tool-btn tool-btn-primary" id="btn-process">Xử lý dữ liệu</button>
                        <button type="button" class="tool-btn" id="btn-sample">Dữ liệu mẫu</button>
                        <button type="button" class="tool-btn tool-btn-danger" id="btn-clear">Xóa</button>
                    </div>

                    <div class="tool-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="tool-group">
                            <label class="tool-label">Dữ liệu đầu vào (Input)</label>
                            <textarea id="my-input" class="tool-textarea" rows="12" placeholder="Nhập nội dung..."></textarea>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Kết quả (Output)</label>
                            <div class="tool-result">
                                <textarea id="my-output" class="tool-textarea" rows="12" readonly placeholder="Kết quả sẽ hiển thị ở đây..."></textarea>
                                <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
                                    <button type="button" class="tool-btn tool-btn-sm" id="btn-copy">📋 Copy kết quả</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Bind DOM elements and events
        const inputEl = container.querySelector('#my-input');
        const outputEl = container.querySelector('#my-output');
        const processBtn = container.querySelector('#btn-process');
        const sampleBtn = container.querySelector('#btn-sample');
        const clearBtn = container.querySelector('#btn-clear');
        const copyBtn = container.querySelector('#btn-copy');

        processBtn.addEventListener('click', () => {
            const raw = inputEl.value;
            if (!raw.trim()) {
                window.showToast?.('Vui lòng nhập dữ liệu!', 'warning');
                return;
            }
            outputEl.value = raw.toUpperCase(); // Your logic here
            window.showToast?.('Đã xử lý thành công!', 'success');
        });

        sampleBtn.addEventListener('click', () => {
            inputEl.value = 'Sample data here';
            processBtn.click();
        });

        clearBtn.addEventListener('click', () => {
            inputEl.value = '';
            outputEl.value = '';
            inputEl.focus();
        });

        copyBtn.addEventListener('click', () => {
            if (!outputEl.value) return;
            window.copyToClipboard?.(outputEl.value, copyBtn);
        });
    }
});
```

### Step 3: Register in `index.html`
Add your tool's script tag into `index.html` in alphabetical order, **above** `js/app.js`:
```html
    <script src="js/tools/my-new-tool.js"></script>
    <script src="js/app.js"></script>
```

That's it! DevTools Hub's core engine will automatically:
- Index your tool in the **Command Palette** (`Ctrl + K`).
- Populate your tool in the **Category sidebar / dropdown**.
- Render your tool card on the **Home dashboard grid**.
- Handle instant routing via URL hash (`#my-new-tool`).

---

## 🎨 UI Guidelines & Global Helpers

### 1. Always Use Theme Variables
Never hardcode hex colors (e.g., `#ffffff`, `#1e1e1e`). Use CSS variables so your tool seamlessly supports both **Dark** and **Light** themes:

| Variable | Description |
|:---|:---|
| `var(--bg-primary)` | Base page background |
| `var(--bg-secondary)` | Card / Panel background |
| `var(--bg-tertiary)` | Elevated controls / Dropdown background |
| `var(--border-color)` | Subtle component borders |
| `var(--text-primary)` | High-contrast main headings & body |
| `var(--text-secondary)` | Labels, subheadings, helper text |
| `var(--text-muted)` | Placeholders, disabled states |
| `var(--accent-primary)` | Brand accent color (Indigo/Purple) |
| `var(--accent-success)` | Positive status, badges, checks |
| `var(--accent-danger)` | Error alerts, delete buttons |
| `var(--font-mono)` | Monospace font for code/data (`JetBrains Mono`) |

### 2. Available Global Utilities
DevTools Hub provides built-in helper functions:

- **`window.copyToClipboard(text, btnElement)`**: Copies string to system clipboard and temporarily changes the button text to `✅ Copied!` with feedback animation.
- **`window.showToast(message, type)`**: Displays a non-intrusive floating toast alert. Types: `'info'`, `'success'`, `'warning'`, `'error'`.

---

## 🛡️ Security & Quality Standards

To maintain our flawless code scanning and security posture (CodeQL / OpenSSF):

1. **Avoid Insecure Randomness**:
   - In security contexts (UUIDs, tokens, keys, passwords), **never** use `Math.random()`.
   - Always use the Web Crypto API: `crypto.randomUUID()` or `crypto.getRandomValues(new Uint8Array(16))`.

2. **Prevent DOM XSS**:
   - Never insert unescaped user strings directly into `innerHTML` or `document.write`.
   - For previewers (e.g., Markdown, SVG, HTML), build nodes safely with `document.createElement`, `document.createTextNode`, or sanitize protocols with `encodeURI()`.
   - Never allow dangerous URL protocols like `javascript:` or `vbscript:` in `href` / `src`.

3. **Verify Syntax**:
   - Always check JavaScript syntax before committing:
     ```bash
     node -c js/tools/my-new-tool.js
     ```

---

## 🔀 Git Workflow & Pull Request Process

1. **Create a descriptive feature branch**:
   ```bash
   git checkout -b feat/add-uuid-v7-generator
   ```

2. **Format commit messages** using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(category): add XYZ tool`
   - `fix(tool-name): resolve edge case in ABC calculation`
   - `docs: update README and CHANGELOG`
   - `style: refine mobile responsive padding`

3. **Checklist before submitting PR**:
   - [ ] Tool adheres to the Zero-Dependency rule (no external libraries/CDNs).
   - [ ] Code syntax verified with `node -c`.
   - [ ] Tested and looks great in both **Dark Mode** and **Light Mode**.
   - [ ] Mobile and tablet responsiveness verified in Developer Tools.
   - [ ] No JavaScript console errors or unhandled exceptions.
   - [ ] Added script tag in `index.html`.

4. **Submit your Pull Request**:
   - Push your branch to GitHub and open a PR against `main`.
   - Provide a brief summary of what your tool or fix does.
   - We will review your PR promptly!

---

## 💖 Community & Recognition

Every contribution is deeply appreciated. Authors of accepted PRs will be:
- Credited in our official [`CHANGELOG.md`](CHANGELOG.md) release notes.
- Featured in repository contributor lists.

Got a question or want to discuss an idea before building? Feel free to open a [GitHub Discussion](https://github.com/gbao86/DevTools-Hub/discussions) or create an issue.

**Happy Coding! 🚀**
