/**
 * Text Counter Tool Module
 * DevTools Hub
 */
const TextCounter = {
    name: 'Text Counter',
    icon: '🔢',
    category: 'Text',
    description: 'Đếm ký tự, từ, câu, dòng và phân tích text',

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🔢 Text Counter</h2>
                    <p class="tool-description">Đếm ký tự, từ, câu, dòng và phân tích text theo thời gian thực</p>
                </div>
                <div class="tool-body">
                    <div class="tool-group">
                        <div class="tool-label" style="justify-content: space-between;">
                            <span>Văn bản đầu vào</span>
                            <span id="tc-char-count-badge" class="tool-badge tool-badge-info">0 ký tự</span>
                        </div>
                        <textarea class="tool-textarea" id="tc-input" placeholder="Nhập hoặc dán văn bản của bạn vào đây để phân tích..." style="min-height: 180px;"></textarea>
                    </div>

                    <div class="tool-actions">
                        <button class="tool-btn" id="tc-copy-btn">📋 Copy text</button>
                        <button class="tool-btn" id="tc-remove-spaces-btn">✂️ Xóa khoảng trắng thừa</button>
                        <button class="tool-btn" id="tc-trim-lines-btn">🧹 Trim từng dòng</button>
                        <button class="tool-btn tool-btn-danger" id="tc-clear-btn">🗑️ Xóa tất cả</button>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Chuyển đổi kiểu chữ (Text Case)</label>
                        <div class="tool-actions">
                            <button class="tool-btn tool-btn-sm" data-case="uppercase">UPPERCASE</button>
                            <button class="tool-btn tool-btn-sm" data-case="lowercase">lowercase</button>
                            <button class="tool-btn tool-btn-sm" data-case="titlecase">Title Case</button>
                            <button class="tool-btn tool-btn-sm" data-case="sentencecase">Sentence case</button>
                            <button class="tool-btn tool-btn-sm" data-case="camelcase">camelCase</button>
                            <button class="tool-btn tool-btn-sm" data-case="snakecase">snake_case</button>
                            <button class="tool-btn tool-btn-sm" data-case="kebabcase">kebab-case</button>
                        </div>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Thống kê chi tiết</label>
                        <div class="tool-stats">
                            <div class="tool-stat">
                                <div class="tool-stat-value" id="stat-chars">0</div>
                                <div class="tool-stat-label">Ký tự (gồm space)</div>
                            </div>
                            <div class="tool-stat">
                                <div class="tool-stat-value" id="stat-chars-no-space">0</div>
                                <div class="tool-stat-label">Ký tự (không space)</div>
                            </div>
                            <div class="tool-stat">
                                <div class="tool-stat-value" id="stat-words">0</div>
                                <div class="tool-stat-label">Từ</div>
                            </div>
                            <div class="tool-stat">
                                <div class="tool-stat-value" id="stat-sentences">0</div>
                                <div class="tool-stat-label">Câu</div>
                            </div>
                            <div class="tool-stat">
                                <div class="tool-stat-value" id="stat-paragraphs">0</div>
                                <div class="tool-stat-label">Đoạn văn</div>
                            </div>
                            <div class="tool-stat">
                                <div class="tool-stat-value" id="stat-lines">0</div>
                                <div class="tool-stat-label">Dòng</div>
                            </div>
                            <div class="tool-stat">
                                <div class="tool-stat-value" id="stat-reading-time">0s</div>
                                <div class="tool-stat-label">Thời gian đọc (~200 từ/phút)</div>
                            </div>
                            <div class="tool-stat">
                                <div class="tool-stat-value" id="stat-speaking-time">0s</div>
                                <div class="tool-stat-label">Thời gian nói (~130 từ/phút)</div>
                            </div>
                        </div>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Top 5 từ xuất hiện nhiều nhất</label>
                        <div id="tc-top-words" class="tool-info" style="min-height: 48px;">
                            <span style="color: var(--text-tertiary);">Chưa có dữ liệu từ</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // DOM elements
        const input = container.querySelector('#tc-input');
        const badge = container.querySelector('#tc-char-count-badge');
        const copyBtn = container.querySelector('#tc-copy-btn');
        const clearBtn = container.querySelector('#tc-clear-btn');
        const removeSpacesBtn = container.querySelector('#tc-remove-spaces-btn');
        const trimLinesBtn = container.querySelector('#tc-trim-lines-btn');
        const caseBtns = container.querySelectorAll('[data-case]');
        const topWordsDiv = container.querySelector('#tc-top-words');

        // Stats elements
        const statChars = container.querySelector('#stat-chars');
        const statCharsNoSpace = container.querySelector('#stat-chars-no-space');
        const statWords = container.querySelector('#stat-words');
        const statSentences = container.querySelector('#stat-sentences');
        const statParagraphs = container.querySelector('#stat-paragraphs');
        const statLines = container.querySelector('#stat-lines');
        const statReadingTime = container.querySelector('#stat-reading-time');
        const statSpeakingTime = container.querySelector('#stat-speaking-time');

        // Format reading/speaking time
        function formatTime(seconds) {
            if (seconds <= 0) return '0s';
            if (seconds < 60) return `${seconds}s`;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
        }

        // Calculate and update stats
        function updateStats() {
            const text = input.value;
            const charCount = text.length;
            const charNoSpaceCount = text.replace(/\s/g, '').length;
            
            // Word count
            const trimmed = text.trim();
            const wordsArray = trimmed ? trimmed.split(/\s+/) : [];
            const wordCount = wordsArray.length;

            // Sentence count
            let sentenceCount = 0;
            if (trimmed) {
                const sentenceMatches = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
                sentenceCount = sentenceMatches.length;
            }

            // Paragraph count
            let paragraphCount = 0;
            if (trimmed) {
                paragraphCount = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
            }

            // Line count
            const lineCount = text ? text.split(/\r\n|\r|\n/).length : 0;

            // Reading & Speaking times
            const readingSecs = Math.ceil((wordCount / 200) * 60);
            const speakingSecs = Math.ceil((wordCount / 130) * 60);

            // Update DOM
            badge.textContent = `${charCount.toLocaleString()} ký tự`;
            statChars.textContent = charCount.toLocaleString();
            statCharsNoSpace.textContent = charNoSpaceCount.toLocaleString();
            statWords.textContent = wordCount.toLocaleString();
            statSentences.textContent = sentenceCount.toLocaleString();
            statParagraphs.textContent = paragraphCount.toLocaleString();
            statLines.textContent = lineCount.toLocaleString();
            statReadingTime.textContent = formatTime(readingSecs);
            statSpeakingTime.textContent = formatTime(speakingSecs);

            // Top 5 words calculation
            updateTopWords(text);
        }

        function updateTopWords(text) {
            if (!text.trim()) {
                topWordsDiv.innerHTML = `<span style="color: var(--text-tertiary);">Chưa có dữ liệu từ</span>`;
                return;
            }

            // Use Unicode regex matching letters and numbers
            const matches = text.toLowerCase().match(/[\p{L}\p{N}]+/gu);
            if (!matches || matches.length === 0) {
                topWordsDiv.innerHTML = `<span style="color: var(--text-tertiary);">Chưa có dữ liệu từ</span>`;
                return;
            }

            const freq = {};
            matches.forEach(w => {
                if (w.length > 0) {
                    freq[w] = (freq[w] || 0) + 1;
                }
            });

            const top5 = Object.entries(freq)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            if (top5.length === 0) {
                topWordsDiv.innerHTML = `<span style="color: var(--text-tertiary);">Chưa có dữ liệu từ</span>`;
                return;
            }

            topWordsDiv.innerHTML = `
                <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                    ${top5.map(([word, count], idx) => `
                        <span class="tool-badge ${idx === 0 ? 'tool-badge-success' : 'tool-badge-info'}" style="font-size: 0.85rem; padding: 6px 12px;">
                            <strong>${escapeHtml(word)}</strong>: ${count} lần
                        </span>
                    `).join('')}
                </div>
            `;
        }

        function escapeHtml(str) {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // Case conversions
        function convertCase(type) {
            const text = input.value;
            if (!text) return;

            let result = text;
            switch (type) {
                case 'uppercase':
                    result = text.toUpperCase();
                    break;
                case 'lowercase':
                    result = text.toLowerCase();
                    break;
                case 'titlecase':
                    result = text.toLowerCase().replace(/(?:^|\s|-|_)\S/g, c => c.toUpperCase());
                    break;
                case 'sentencecase':
                    result = text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z\u00C0-\u024F\u1EA0-\u1EF9])/g, (m, p1, p2) => p1 + p2.toUpperCase());
                    break;
                case 'camelcase':
                    result = text.trim().split(/[\s\-_\W]+/g).filter(Boolean).map((w, i) => {
                        const lower = w.toLowerCase();
                        return i === 0 ? lower : lower.charAt(0).toUpperCase() + lower.slice(1);
                    }).join('');
                    break;
                case 'snakecase':
                    result = text.trim().split(/[\s\-_\W]+/g).filter(Boolean).map(w => w.toLowerCase()).join('_');
                    break;
                case 'kebabcase':
                    result = text.trim().split(/[\s\-_\W]+/g).filter(Boolean).map(w => w.toLowerCase()).join('-');
                    break;
            }

            input.value = result;
            updateStats();
            if (window.showToast) window.showToast(`Đã chuyển đổi sang ${type}!`, 'success');
        }

        // Event Listeners
        input.addEventListener('input', updateStats);

        copyBtn.addEventListener('click', () => {
            if (!input.value) {
                if (window.showToast) window.showToast('Không có nội dung để copy!', 'warning');
                return;
            }
            if (window.copyToClipboard) {
                window.copyToClipboard(input.value, copyBtn);
            }
        });

        clearBtn.addEventListener('click', () => {
            input.value = '';
            updateStats();
            input.focus();
        });

        removeSpacesBtn.addEventListener('click', () => {
            if (!input.value) return;
            // Replace multiple spaces/tabs with single space, remove empty lines
            const lines = input.value.split(/\r\n|\r|\n/);
            const cleaned = lines
                .map(line => line.replace(/[ \t]+/g, ' ').trim())
                .filter(line => line.length > 0)
                .join('\n');
            input.value = cleaned;
            updateStats();
            if (window.showToast) window.showToast('Đã xóa khoảng trắng thừa!', 'success');
        });

        trimLinesBtn.addEventListener('click', () => {
            if (!input.value) return;
            const lines = input.value.split(/\r\n|\r|\n/);
            input.value = lines.map(line => line.trim()).join('\n');
            updateStats();
            if (window.showToast) window.showToast('Đã trim các dòng!', 'success');
        });

        caseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                convertCase(btn.dataset.case);
            });
        });

        // Initial stats update
        updateStats();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(TextCounter);
