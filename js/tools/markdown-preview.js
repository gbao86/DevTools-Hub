/**
 * DevTools Hub - Markdown Preview Tool
 * Real-time Markdown parser and live renderer (100% Client-Side)
 */

const MarkdownPreview = {
    name: 'Markdown Preview',
    icon: '📖',
    category: 'Formatter',
    description: 'Xem trước Markdown render real-time',

    /**
     * Default sample Markdown content showcasing all supported syntax
     */
    defaultMarkdown: `# DevTools Hub - Markdown Preview

## Giới thiệu & Tính năng
### Các định dạng văn bản (Typography)
Văn bản bình thường với **chữ đậm (bold)**, *chữ nghiêng (italic)*, và ~~chữ gạch ngang (strikethrough)~~.
Có thể chèn \`inline code\` ngay trong dòng văn bản.

---

### Danh sách (Lists)
#### Danh sách không thứ tự (Unordered List)
- Feature 1: Real-time live preview
- Feature 2: Pure Vanilla JavaScript parser
- Feature 3: Copy HTML output instantly

#### Danh sách có thứ tự (Ordered List)
1. Soạn thảo Markdown ở khung bên trái
2. Kết quả HTML render lập tức ở khung bên phải
3. Nhấn nút Copy HTML để sử dụng

---

### Trích dẫn (Blockquote)
> DevTools Hub cung cấp các công cụ tiện ích cho Developer, chạy 100% client-side và bảo mật tuyệt đối.

---

### Khối mã (Fenced Code Block)
\`\`\`javascript
// Sample JavaScript Code Block
function calculateSum(a, b) {
    return a + b;
}
console.log('Result:', calculateSum(10, 20));
\`\`\`

---

### Bảng (Tables)
| Feature | Supported | Status |
| --- | --- | --- |
| Headings | Yes | Ready |
| Tables | Yes | Ready |
| Code Blocks | Yes | Ready |

---

### Liên kết & Hình ảnh (Links & Images)
- Website: [DevTools Hub](https://github.com)
- Example Image:
![DevTools Banner](https://via.placeholder.com/400x120?text=DevTools+Hub+Markdown)`,

    /**
     * Render the tool interface into container element
     * @param {HTMLElement} container 
     */
    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>📖 Markdown Preview</h2>
                    <p class="tool-description">Xem trước Markdown render real-time</p>
                </div>
                <div class="tool-body">
                    <div class="tool-row" style="justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md);">
                        <div class="tool-stats" style="grid-template-columns: repeat(3, auto); gap: 12px;">
                            <div class="tool-stat" style="padding: 6px 16px;">
                                <div class="tool-stat-value" id="md-words-count" style="font-size: 1.1rem;">0</div>
                                <div class="tool-stat-label">Từ</div>
                            </div>
                            <div class="tool-stat" style="padding: 6px 16px;">
                                <div class="tool-stat-value" id="md-chars-count" style="font-size: 1.1rem;">0</div>
                                <div class="tool-stat-label">Ký tự</div>
                            </div>
                            <div class="tool-stat" style="padding: 6px 16px;">
                                <div class="tool-stat-value" id="md-lines-count" style="font-size: 1.1rem;">0</div>
                                <div class="tool-stat-label">Dòng</div>
                            </div>
                        </div>
                        <div class="tool-actions">
                            <button class="tool-btn" id="btn-md-sample">📝 Sample Text</button>
                            <button class="tool-btn" id="btn-md-clear">🗑️ Xóa</button>
                            <button class="tool-btn tool-btn-primary" id="btn-md-copy-html">📋 Copy HTML</button>
                        </div>
                    </div>

                    <div class="tool-split">
                        <div class="tool-group">
                            <label class="tool-label">Markdown Input</label>
                            <textarea class="tool-textarea" id="md-input-textarea" style="min-height: 480px; font-size: 14px;" placeholder="Nhập Markdown vào đây..."></textarea>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">HTML Preview</label>
                            <div class="markdown-body" id="md-preview-div" style="min-height: 480px; max-height: 650px; overflow-y: auto;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Get DOM references
        const inputTextarea = container.querySelector('#md-input-textarea');
        const previewDiv = container.querySelector('#md-preview-div');
        const wordsCountEl = container.querySelector('#md-words-count');
        const charsCountEl = container.querySelector('#md-chars-count');
        const linesCountEl = container.querySelector('#md-lines-count');

        const btnCopyHtml = container.querySelector('#btn-md-copy-html');
        const btnClear = container.querySelector('#btn-md-clear');
        const btnSample = container.querySelector('#btn-md-sample');

        // Render preview and statistics
        const update = () => {
            const val = inputTextarea.value;
            this.renderMarkdownNodes(val, previewDiv);
            
            // Statistics calculation
            const lines = val ? val.split(/\r?\n/).length : 0;
            const chars = val.length;
            const trimmed = val.trim();
            const words = trimmed ? trimmed.split(/\s+/).length : 0;

            wordsCountEl.textContent = words.toLocaleString();
            charsCountEl.textContent = chars.toLocaleString();
            linesCountEl.textContent = lines.toLocaleString();
        };

        // Real-time listener
        inputTextarea.addEventListener('input', update);

        // Copy HTML button
        btnCopyHtml.addEventListener('click', () => {
            const html = previewDiv.innerHTML;
            if (typeof window.copyToClipboard === 'function') {
                window.copyToClipboard(html, btnCopyHtml);
            } else {
                navigator.clipboard.writeText(html);
            }
        });

        // Clear button
        btnClear.addEventListener('click', () => {
            inputTextarea.value = '';
            update();
            inputTextarea.focus();
        });

        // Sample button
        btnSample.addEventListener('click', () => {
            inputTextarea.value = this.defaultMarkdown;
            update();
        });

        // Set default content on initial load
        inputTextarea.value = this.defaultMarkdown;
        update();
    },

    /**
     * Parse inline markdown tokens and append corresponding DOM nodes
     * @param {HTMLElement} parent
     * @param {string} str
     */
    appendInlineNodes(parent, str) {
        if (!str) return;
        const safeUrl = (url) => {
            const u = (url || '').trim();
            if (/^(?:https?:\/\/|\/|data:image\/|blob:|#|mailto:)/i.test(u)) return u;
            return '#';
        };

        const tokenRegex = /(!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~)/g;
        const parts = str.split(tokenRegex);

        for (let j = 0; j < parts.length; j++) {
            const part = parts[j];
            if (!part) continue;

            if (part.startsWith('![') && part.endsWith(')')) {
                const m = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
                if (m) {
                    const img = document.createElement('img');
                    img.setAttribute('src', safeUrl(m[2]));
                    img.setAttribute('alt', m[1]);
                    parent.appendChild(img);
                    continue;
                }
            }

            if (part.startsWith('[') && part.endsWith(')')) {
                const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                if (m) {
                    const a = document.createElement('a');
                    a.setAttribute('href', safeUrl(m[2]));
                    a.setAttribute('target', '_blank');
                    a.setAttribute('rel', 'noopener noreferrer');
                    a.textContent = m[1];
                    parent.appendChild(a);
                    continue;
                }
            }

            if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
                const code = document.createElement('code');
                code.textContent = part.slice(1, -1);
                parent.appendChild(code);
                continue;
            }

            if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
                const strong = document.createElement('strong');
                strong.textContent = part.slice(2, -2);
                parent.appendChild(strong);
                continue;
            }

            if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
                const em = document.createElement('em');
                em.textContent = part.slice(1, -1);
                parent.appendChild(em);
                continue;
            }

            if (part.startsWith('~~') && part.endsWith('~~')) {
                const del = document.createElement('del');
                del.textContent = part.slice(2, -2);
                parent.appendChild(del);
                continue;
            }

            parent.appendChild(document.createTextNode(part));
        }
    },

    /**
     * Render parsed markdown directly into DOM container using safe DOM APIs (0 HTML sinks)
     * @param {string} md
     * @param {HTMLElement} container
     */
    renderMarkdownNodes(md, container) {
        if (typeof container.replaceChildren === 'function') {
            container.replaceChildren();
        } else {
            container.textContent = '';
        }
        if (!md) return;

        // Extract fenced code blocks first
        const codeBlocks = [];
        const textWithPlaceholders = md.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (match, lang, code) => {
            const id = `___FENCED_CODE_${codeBlocks.length}___`;
            codeBlocks.push({ id, lang, code: code.replace(/\r?\n$/, '') });
            return id;
        });

        const lines = textWithPlaceholders.split(/\r?\n/);
        const fragment = document.createDocumentFragment();
        let i = 0;

        while (i < lines.length) {
            let line = lines[i];

            // Fenced Code block
            if (line.trim().startsWith('___FENCED_CODE_') && line.trim().endsWith('___')) {
                const block = codeBlocks.find(b => b.id === line.trim());
                if (block) {
                    const pre = document.createElement('pre');
                    const code = document.createElement('code');
                    if (block.lang) code.className = `language-${block.lang}`;
                    code.textContent = block.code;
                    pre.appendChild(code);
                    fragment.appendChild(pre);
                }
                i++;
                continue;
            }

            // Horizontal rules (---, ***, ___)
            if (/^(?:---|\*\*\*|___)\s*$/.test(line.trim())) {
                fragment.appendChild(document.createElement('hr'));
                i++;
                continue;
            }

            // Headings (# h1 to ###### h6)
            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                const h = document.createElement(`h${level}`);
                this.appendInlineNodes(h, headingMatch[2]);
                fragment.appendChild(h);
                i++;
                continue;
            }

            // Blockquotes (> quote)
            if (line.trim().startsWith('>')) {
                const quoteLines = [];
                while (i < lines.length && lines[i].trim().startsWith('>')) {
                    quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
                    i++;
                }
                const bq = document.createElement('blockquote');
                const p = document.createElement('p');
                quoteLines.forEach((ql, qIdx) => {
                    if (qIdx > 0) p.appendChild(document.createElement('br'));
                    this.appendInlineNodes(p, ql);
                });
                bq.appendChild(p);
                fragment.appendChild(bq);
                continue;
            }

            // Tables: starting with '|' and followed by separator row '|---|'
            if (line.trim().startsWith('|') && i + 1 < lines.length && /^\s*\|?\s*:?-+:?\s*\|/.test(lines[i + 1])) {
                const headerLine = line;
                i += 2; // skip header & divider line
                const bodyRows = [];
                while (i < lines.length && lines[i].trim().startsWith('|')) {
                    bodyRows.push(lines[i]);
                    i++;
                }

                const parseRow = (rowStr) => {
                    return rowStr
                        .trim()
                        .replace(/^\|/, '')
                        .replace(/\|$/, '')
                        .split('|')
                        .map(cell => cell.trim());
                };

                const headers = parseRow(headerLine);
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const trHead = document.createElement('tr');
                headers.forEach(hText => {
                    const th = document.createElement('th');
                    this.appendInlineNodes(th, hText);
                    trHead.appendChild(th);
                });
                thead.appendChild(trHead);
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                bodyRows.forEach(rowStr => {
                    const cells = parseRow(rowStr);
                    const trBody = document.createElement('tr');
                    cells.forEach(cText => {
                        const td = document.createElement('td');
                        this.appendInlineNodes(td, cText);
                        trBody.appendChild(td);
                    });
                    tbody.appendChild(trBody);
                });
                table.appendChild(tbody);
                fragment.appendChild(table);
                continue;
            }

            // Unordered Lists (- item, * item, + item)
            if (/^\s*[-*+]\s+/.test(line)) {
                const ul = document.createElement('ul');
                while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
                    const itemText = lines[i].replace(/^\s*[-*+]\s+/, '');
                    const li = document.createElement('li');
                    this.appendInlineNodes(li, itemText);
                    ul.appendChild(li);
                    i++;
                }
                fragment.appendChild(ul);
                continue;
            }

            // Ordered Lists (1. item)
            if (/^\s*\d+\.\s+/.test(line)) {
                const ol = document.createElement('ol');
                while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
                    const itemText = lines[i].replace(/^\s*\d+\.\s+/, '');
                    const li = document.createElement('li');
                    this.appendInlineNodes(li, itemText);
                    ol.appendChild(li);
                    i++;
                }
                fragment.appendChild(ol);
                continue;
            }

            // Blank line
            if (line.trim() === '') {
                i++;
                continue;
            }

            // Regular Paragraph
            const paragraphLines = [];
            while (
                i < lines.length &&
                lines[i].trim() !== '' &&
                !lines[i].trim().startsWith('#') &&
                !lines[i].trim().startsWith('>') &&
                !/^(?:---|\*\*\*|___)\s*$/.test(lines[i].trim()) &&
                !/^\s*[-*+]\s+/.test(lines[i]) &&
                !/^\s*\d+\.\s+/.test(lines[i]) &&
                !lines[i].trim().startsWith('___FENCED_CODE_')
            ) {
                paragraphLines.push(lines[i]);
                i++;
            }

            if (paragraphLines.length > 0) {
                const p = document.createElement('p');
                paragraphLines.forEach((pl, pIdx) => {
                    if (pIdx > 0) p.appendChild(document.createElement('br'));
                    this.appendInlineNodes(p, pl);
                });
                fragment.appendChild(p);
            }
        }

        container.appendChild(fragment);
    },

    /**
     * Pure JavaScript Markdown Parser returning HTML string
     * @param {string} md 
     * @returns {string} HTML output
     */
    parseMarkdown(md) {
        if (!md) return '';
        const temp = document.createElement('div');
        this.renderMarkdownNodes(md, temp);
        return temp.innerHTML;
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(MarkdownPreview);
