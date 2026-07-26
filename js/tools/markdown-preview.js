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
            previewDiv.innerHTML = this.parseMarkdown(val);
            
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
     * Pure JavaScript Markdown Parser
     * Supports: Headings, Bold, Italic, Strikethrough, Links, Images, Lists, Code Blocks, Inline Code, Blockquotes, HR, Tables, Line Breaks
     * @param {string} md 
     * @returns {string} HTML output
     */
    parseMarkdown(md) {
        if (!md) return '';

        const placeholders = [];
        const addPlaceholder = (html) => {
            const id = `___PLACEHOLDER_${placeholders.length}___`;
            placeholders.push({ id, html });
            return id;
        };

        // Escape HTML tags to prevent XSS
        const escapeHtml = (str) => {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        };

        // Parse inline Markdown constructs
        const parseInline = (str) => {
            if (!str) return '';
            let res = escapeHtml(str);

            // Images: ![alt](url)
            res = res.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

            // Links: [text](url)
            res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

            // Bold: **text** or __text__
            res = res.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');

            // Italic: *text* or _text_
            res = res.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

            // Strikethrough: ~~text~~
            res = res.replace(/~~(.*?)~~/g, '<del>$1</del>');

            return res;
        };

        // 1. Extract Fenced Code Blocks (```lang ... ```)
        let text = md.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (match, lang, code) => {
            const escapedCode = escapeHtml(code.replace(/\r?\n$/, ''));
            const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : '';
            return addPlaceholder(`<pre><code${langClass}>${escapedCode}</code></pre>`);
        });

        // 2. Extract Inline Code (`code`)
        text = text.replace(/`([^`]+)`/g, (match, code) => {
            return addPlaceholder(`<code>${escapeHtml(code)}</code>`);
        });

        // Process blocks line by line
        const lines = text.split(/\r?\n/);
        const output = [];
        let i = 0;

        while (i < lines.length) {
            let line = lines[i];

            // Code block placeholders
            if (line.trim().startsWith('___PLACEHOLDER_') && line.trim().endsWith('___')) {
                output.push(line.trim());
                i++;
                continue;
            }

            // Horizontal rules (---, ***, ___)
            if (/^(?:---|\*\*\*|___)\s*$/.test(line.trim())) {
                output.push('<hr>');
                i++;
                continue;
            }

            // Headings (# h1 to ###### h6)
            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                const content = parseInline(headingMatch[2]);
                output.push(`<h${level}>${content}</h${level}>`);
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
                const quoteContent = quoteLines.map(l => parseInline(l)).join('<br>');
                output.push(`<blockquote><p>${quoteContent}</p></blockquote>`);
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
                let tableHtml = '<table><thead><tr>';
                headers.forEach(h => {
                    tableHtml += `<th>${parseInline(h)}</th>`;
                });
                tableHtml += '</tr></thead><tbody>';

                bodyRows.forEach(rowStr => {
                    const cells = parseRow(rowStr);
                    tableHtml += '<tr>';
                    cells.forEach(c => {
                        tableHtml += `<td>${parseInline(c)}</td>`;
                    });
                    tableHtml += '</tr>';
                });
                tableHtml += '</tbody></table>';
                output.push(tableHtml);
                continue;
            }

            // Unordered Lists (- item, * item, + item)
            if (/^\s*[-*+]\s+/.test(line)) {
                const listItems = [];
                while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
                    const itemText = lines[i].replace(/^\s*[-*+]\s+/, '');
                    listItems.push(`<li>${parseInline(itemText)}</li>`);
                    i++;
                }
                output.push(`<ul>${listItems.join('')}</ul>`);
                continue;
            }

            // Ordered Lists (1. item)
            if (/^\s*\d+\.\s+/.test(line)) {
                const listItems = [];
                while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
                    const itemText = lines[i].replace(/^\s*\d+\.\s+/, '');
                    listItems.push(`<li>${parseInline(itemText)}</li>`);
                    i++;
                }
                output.push(`<ol>${listItems.join('')}</ol>`);
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
                !lines[i].trim().startsWith('___PLACEHOLDER_')
            ) {
                paragraphLines.push(lines[i]);
                i++;
            }

            if (paragraphLines.length > 0) {
                const pContent = paragraphLines.map(l => parseInline(l)).join('<br>');
                output.push(`<p>${pContent}</p>`);
            }
        }

        let htmlResult = output.join('\n');

        // Restore placeholders
        placeholders.forEach(({ id, html }) => {
            htmlResult = htmlResult.replace(id, html);
        });

        return htmlResult;
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(MarkdownPreview);
