/* ============================================
   DevTools Hub - Regex Tester Tool (V2)
   ============================================ */

const RegexTester = {
    name: 'Regex Tester',
    icon: '🧪',
    category: 'Tester',
    description: 'Test, Replace, Explainer & Cheatsheet cho Regular Expressions',

    render(container) {
        if (!document.getElementById('regex-tester-style')) {
            const style = document.createElement('style');
            style.id = 'regex-tester-style';
            style.textContent = `
                .regex-layout {
                    display: flex;
                    gap: var(--space-lg);
                    align-items: flex-start;
                }
                .regex-main {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-lg);
                }
                .regex-sidebar {
                    width: 300px;
                    flex-shrink: 0;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: var(--space-md);
                    position: sticky;
                    top: var(--space-md);
                }
                .cheatsheet-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .cheatsheet-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 6px 8px;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .cheatsheet-item:hover {
                    background: var(--bg-tertiary);
                }
                .cheatsheet-item code {
                    background: var(--bg-primary);
                    color: var(--accent-primary-hover);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: var(--fs-xs);
                    min-width: 32px;
                    text-align: center;
                    border: 1px solid var(--border-color);
                }
                .cheatsheet-item span {
                    font-size: var(--fs-sm);
                    color: var(--text-secondary);
                }
                .explainer-box {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    padding: var(--space-md);
                    max-height: 200px;
                    overflow-y: auto;
                    font-family: var(--font-mono);
                }
                .explainer-row {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 8px;
                    align-items: flex-start;
                }
                .explainer-token {
                    color: var(--accent-primary-hover);
                    background: var(--bg-tertiary);
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-weight: 600;
                    min-width: 48px;
                    text-align: center;
                    flex-shrink: 0;
                }
                .explainer-desc {
                    font-size: var(--fs-sm);
                    color: var(--text-primary);
                    line-height: 1.5;
                    align-self: center;
                }
                .match-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    padding: var(--space-md);
                    margin-bottom: var(--space-sm);
                }
                .match-header {
                    font-weight: 600;
                    font-size: var(--fs-sm);
                    color: var(--accent-primary-hover);
                    margin-bottom: 8px;
                    display: flex;
                    justify-content: space-between;
                }
                .match-meta {
                    color: var(--text-tertiary);
                    font-weight: normal;
                    font-size: var(--fs-xs);
                }
                .match-group-row {
                    font-size: var(--fs-sm);
                    font-family: var(--font-mono);
                    display: flex;
                    gap: 12px;
                    background: var(--bg-tertiary);
                    padding: 6px 10px;
                    border-radius: 4px;
                    margin-top: 4px;
                    align-items: center;
                }
                .match-group-label {
                    color: var(--accent-secondary);
                    font-weight: 600;
                    min-width: 70px;
                }
                .match-group-val {
                    color: var(--text-primary);
                    word-break: break-all;
                }
                @media (max-width: 900px) {
                    .regex-layout { flex-direction: column; }
                    .regex-sidebar { width: 100%; position: static; }
                }
            `;
            document.head.appendChild(style);
        }

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🧪 Regex Tester Pro</h2>
                    <p class="tool-description">Kiểm tra, Bóc tách nhóm (Capture Groups), Thay thế chuỗi (Replace) và Giải thích Regex.</p>
                </div>

                <div class="tool-body">
                    <div class="regex-layout">
                        <!-- Main Content Column -->
                        <div class="regex-main">
                            <!-- Preset Patterns -->
                            <div class="tool-group">
                                <label class="tool-label">⚡ Mẫu phổ biến</label>
                                <div class="tool-actions" id="regex-presets">
                                    <button class="tool-btn tool-btn-sm" data-pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" data-flags="g" data-sample="Email hợp lệ: support@devtools.hub và admin@test.com">Email</button>
                                    <button class="tool-btn tool-btn-sm" data-pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)" data-flags="gi" data-sample="Web URL: https://google.com hoặc http://sub.domain.org/path?query=123">URL</button>
                                    <button class="tool-btn tool-btn-sm" data-pattern="(\\d{4})-(\\d{2})-(\\d{2})" data-flags="g" data-sample="Ngày khởi tạo: 2026-07-27 và Ngày kết thúc: 2026-12-31" data-replace="$3/$2/$1">Ngày (Bóc tách)</button>
                                    <button class="tool-btn tool-btn-sm" data-pattern="^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" data-flags="gm" data-sample="#6366f1\n#fff">Mã màu Hex</button>
                                </div>
                            </div>

                            <!-- Regex Pattern & Flags -->
                            <div class="tool-group">
                                <label class="tool-label">Regular Expression Pattern & Flags</label>
                                <div class="tool-row" style="align-items: center; gap: var(--space-sm);">
                                    <span style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--text-tertiary);">/</span>
                                    <div style="flex: 1;">
                                        <input type="text" class="tool-input" id="regex-pattern-input" value="(\\d{4})-(\\d{2})-(\\d{2})" placeholder="Nhập regex pattern..." style="font-family: var(--font-mono);">
                                    </div>
                                    <span style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--text-tertiary);">/</span>
                                    <div class="tool-inline" style="gap: var(--space-sm); flex-wrap: wrap;">
                                        <label class="tool-checkbox" title="Global (tìm tất cả)"><input type="checkbox" id="flag-g" checked> <span>g</span></label>
                                        <label class="tool-checkbox" title="Case-insensitive"><input type="checkbox" id="flag-i" checked> <span>i</span></label>
                                        <label class="tool-checkbox" title="Multiline"><input type="checkbox" id="flag-m"> <span>m</span></label>
                                        <label class="tool-checkbox" title="DotAll"><input type="checkbox" id="flag-s"> <span>s</span></label>
                                        <label class="tool-checkbox" title="Unicode"><input type="checkbox" id="flag-u"> <span>u</span></label>
                                    </div>
                                </div>
                                <div id="regex-error-msg" style="display: none; padding: 8px 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-sm); color: var(--accent-danger); font-size: var(--fs-sm); font-family: var(--font-mono); margin-top: 6px;"></div>
                            </div>

                            <!-- Regex Explainer -->
                            <div class="tool-group">
                                <label class="tool-label">Giải thích biểu thức (Regex Explainer)</label>
                                <div id="regex-explainer" class="explainer-box"></div>
                            </div>

                            <!-- Test Text Area & Highlight -->
                            <div class="tool-split">
                                <div class="tool-group" style="flex: 1;">
                                    <label class="tool-label">Test String</label>
                                    <textarea class="tool-textarea" id="regex-test-input" placeholder="Nhập chuỗi văn bản test ở đây..." rows="5">Ngày khởi tạo: 2026-07-27, Ngày hết hạn: 2026-12-31.</textarea>
                                </div>
                                <div class="tool-group" style="flex: 1;">
                                    <label class="tool-label">Real-time Match Highlight</label>
                                    <div id="regex-highlight-container" class="tool-textarea" style="height: 100%; white-space: pre-wrap; word-break: break-word; overflow-y: auto; max-height: 126px; background: var(--bg-input); line-height: 1.8;" readonly></div>
                                </div>
                            </div>

                            <!-- Substitution -->
                            <div class="tool-split">
                                <div class="tool-group" style="flex: 1;">
                                    <label class="tool-label">Substitution Text (Văn bản thay thế)</label>
                                    <input type="text" class="tool-input" id="regex-replace-input" placeholder="Ví dụ: $3/$2/$1" value="$3/$2/$1" style="font-family: var(--font-mono);">
                                </div>
                                <div class="tool-group" style="flex: 1;">
                                    <label class="tool-label">Result String (Kết quả)</label>
                                    <div class="tool-result">
                                        <textarea class="tool-textarea" id="regex-replace-result" readonly rows="3" style="font-family: var(--font-mono);"></textarea>
                                        <button class="tool-copy-btn" id="regex-copy-replace">📋</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Match Info Panel -->
                            <div class="tool-group">
                                <label class="tool-label">Danh sách Match & Bóc tách nhóm (Capture Groups)</label>
                                <div id="regex-matches-list"></div>
                            </div>
                        </div>

                        <!-- Sidebar Cheatsheet -->
                        <div class="regex-sidebar">
                            <h3 style="margin-top: 0; font-size: var(--fs-md); border-bottom: 1px solid var(--border-color); padding-bottom: 8px; color: var(--text-primary);">Cheatsheet</h3>
                            <div style="font-size: var(--fs-xs); color: var(--text-tertiary); margin-bottom: 12px;">Nhấp để chèn vào pattern</div>
                            
                            <ul class="cheatsheet-list" id="regex-cheatsheet">
                                <li class="cheatsheet-item" data-insert="\\d"><code>\\d</code> <span>Khớp một chữ số (0-9)</span></li>
                                <li class="cheatsheet-item" data-insert="\\w"><code>\\w</code> <span>Chữ cái, số, gạch dưới</span></li>
                                <li class="cheatsheet-item" data-insert="\\s"><code>\\s</code> <span>Khoảng trắng</span></li>
                                <li class="cheatsheet-item" data-insert="^"><code>^</code> <span>Bắt đầu chuỗi</span></li>
                                <li class="cheatsheet-item" data-insert="$"><code>$</code> <span>Kết thúc chuỗi</span></li>
                                <li class="cheatsheet-item" data-insert="\\b"><code>\\b</code> <span>Ranh giới từ</span></li>
                                <li class="cheatsheet-item" data-insert="*"><code>*</code> <span>0 hoặc nhiều lần</span></li>
                                <li class="cheatsheet-item" data-insert="+"><code>+</code> <span>1 hoặc nhiều lần</span></li>
                                <li class="cheatsheet-item" data-insert="?"><code>?</code> <span>0 hoặc 1 lần</span></li>
                                <li class="cheatsheet-item" data-insert="{2,4}"><code>{2,4}</code> <span>Lặp 2 đến 4 lần</span></li>
                                <li class="cheatsheet-item" data-insert="[a-z]"><code>[a-z]</code> <span>Tập hợp ký tự</span></li>
                                <li class="cheatsheet-item" data-insert="[^a-z]"><code>[^a-z]</code> <span>Phủ định tập hợp</span></li>
                                <li class="cheatsheet-item" data-insert="(...)"><code>(...)</code> <span>Nhóm bắt giữ (Capture)</span></li>
                                <li class="cheatsheet-item" data-insert="(?:...)"><code>(?:...)</code> <span>Nhóm không bắt giữ</span></li>
                                <li class="cheatsheet-item" data-insert="(?=...)"><code>(?=...)</code> <span>Lookahead dương</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // DOM elements
        const patternInput = container.querySelector('#regex-pattern-input');
        const testInput = container.querySelector('#regex-test-input');
        const replaceInput = container.querySelector('#regex-replace-input');
        const replaceResult = container.querySelector('#regex-replace-result');
        const flagG = container.querySelector('#flag-g');
        const flagI = container.querySelector('#flag-i');
        const flagM = container.querySelector('#flag-m');
        const flagS = container.querySelector('#flag-s');
        const flagU = container.querySelector('#flag-u');
        const errorMsg = container.querySelector('#regex-error-msg');
        const highlightContainer = container.querySelector('#regex-highlight-container');
        const explainerContainer = container.querySelector('#regex-explainer');
        const matchesListEl = container.querySelector('#regex-matches-list');
        const presetsContainer = container.querySelector('#regex-presets');
        const cheatsheet = container.querySelector('#regex-cheatsheet');
        const copyReplaceBtn = container.querySelector('#regex-copy-replace');

        // Helper: Escape HTML special characters
        function escapeHtml(str) {
            return (str || '')
                .toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // Helper: Get active flag string
        function getFlags() {
            let flags = '';
            if (flagG.checked) flags += 'g';
            if (flagI.checked) flags += 'i';
            if (flagM.checked) flags += 'm';
            if (flagS.checked) flags += 's';
            if (flagU.checked) flags += 'u';
            return flags;
        }

        // --- Regex Explainer Parser ---
        function explainRegex(pattern) {
            if (!pattern) return '<div style="color: var(--text-tertiary);">Nhập biểu thức để xem giải thích...</div>';
            
            const tokens = [
                { re: /^\\d/, desc: "Khớp một chữ số (0-9)" },
                { re: /^\\D/, desc: "Khớp ký tự KHÔNG phải chữ số" },
                { re: /^\\w/, desc: "Khớp ký tự chữ cái, số, hoặc dấu gạch dưới" },
                { re: /^\\W/, desc: "Khớp ký tự KHÔNG phải chữ cái, số, hoặc dấu gạch dưới" },
                { re: /^\\s/, desc: "Khớp khoảng trắng (space, tab, xuống dòng)" },
                { re: /^\\S/, desc: "Khớp ký tự KHÔNG phải khoảng trắng" },
                { re: /^\\b/, desc: "Khớp ranh giới từ (word boundary)" },
                { re: /^\^/, desc: "Khớp điểm bắt đầu của chuỗi văn bản (hoặc dòng)" },
                { re: /^\$/, desc: "Khớp điểm kết thúc của chuỗi văn bản (hoặc dòng)" },
                { re: /^\./, desc: "Khớp bất kỳ ký tự nào (ngoại trừ ký tự xuống dòng)" },
                { re: /^\*/, desc: "Lặp lại 0 hoặc nhiều lần (Cơ chế tìm kiếm tham lam - Greedy)" },
                { re: /^\+/, desc: "Lặp lại 1 hoặc nhiều lần (Cơ chế tìm kiếm tham lam - Greedy)" },
                { re: /^\?/, desc: "Lặp lại 0 hoặc 1 lần (Hoặc chuyển thành Non-greedy)" },
                { re: /^\{\d+\,\d*\}/, desc: "Lặp lại số lần trong khoảng giới hạn" },
                { re: /^\{\d+\}/, desc: "Lặp lại chính xác số lần" },
                { re: /^\[\^[^\]]+\]/, desc: "Khớp bất kỳ ký tự nào KHÔNG có trong tập hợp" },
                { re: /^\[[^\]]+\]/, desc: "Khớp một trong các ký tự trong tập hợp" },
                { re: /^\(\?\:/, desc: "Bắt đầu nhóm KHÔNG bắt giữ (Non-capturing group)" },
                { re: /^\(\?\=/, desc: "Lookahead dương (Chỉ khớp nếu theo sau bởi mẫu này)" },
                { re: /^\(\?\!/, desc: "Lookahead âm (Chỉ khớp nếu KHÔNG theo sau bởi mẫu này)" },
                { re: /^\(\?\<\=/, desc: "Lookbehind dương (Chỉ khớp nếu đứng trước là mẫu này)" },
                { re: /^\(\?\<\!/, desc: "Lookbehind âm (Chỉ khớp nếu KHÔNG đứng trước là mẫu này)" },
                { re: /^\(/, desc: "Bắt đầu Nhóm bắt giữ (Capture Group)" },
                { re: /^\)/, desc: "Kết thúc Nhóm" },
                { re: /^\|/, desc: "Toán tử HOẶC (OR)" },
                { re: /^\\[^\\]/, desc: "Ký tự được escape" }
            ];

            let html = '';
            let i = 0;
            while(i < pattern.length) {
                let matched = false;
                let str = pattern.slice(i);
                for(let token of tokens) {
                    let m = str.match(token.re);
                    if(m) {
                        let text = m[0];
                        html += `
                            <div class="explainer-row">
                                <code class="explainer-token">${escapeHtml(text)}</code>
                                <div class="explainer-desc">${token.desc}</div>
                            </div>
                        `;
                        i += text.length;
                        matched = true;
                        break;
                    }
                }
                if(!matched) {
                    html += `
                        <div class="explainer-row">
                            <code class="explainer-token">${escapeHtml(pattern[i])}</code>
                            <div class="explainer-desc">Khớp ký tự '${escapeHtml(pattern[i])}' theo nghĩa đen (Literal)</div>
                        </div>
                    `;
                    i++;
                }
            }
            return html;
        }

        // Main regex processor
        function runRegexTester() {
            const patternStr = patternInput.value;
            const text = testInput.value;
            const replaceStr = replaceInput.value;
            const flags = getFlags();

            // Clear state
            errorMsg.style.display = 'none';
            errorMsg.textContent = '';
            explainerContainer.innerHTML = explainRegex(patternStr);

            if (!patternStr) {
                highlightContainer.innerHTML = escapeHtml(text);
                matchesListEl.innerHTML = '<div style="color: var(--text-tertiary); font-size: var(--fs-sm);">Nhập regex pattern để test...</div>';
                replaceResult.value = text;
                return;
            }

            let regex;
            try {
                regex = new RegExp(patternStr, flags);
            } catch (err) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = \`❌ Lỗi Regex: \${err.message}\`;
                highlightContainer.innerHTML = escapeHtml(text);
                matchesListEl.innerHTML = \`<div style="color: var(--accent-danger); font-size: var(--fs-sm);">⚠️ Pattern không hợp lệ: \${escapeHtml(err.message)}</div>\`;
                replaceResult.value = text;
                return;
            }

            // Perform matching
            const matches = [];
            const isGlobal = flags.includes('g');
            
            try {
                if (isGlobal) {
                    // Using matchAll for full group extraction
                    const iterator = text.matchAll(regex);
                    for (const m of iterator) {
                        matches.push(m);
                        if (matches.length >= 1000) break; // limit
                    }
                } else {
                    const m = regex.exec(text);
                    if (m) matches.push(m);
                }
            } catch(e) {
                console.error(e);
            }

            // Build Highlighted HTML (Real-time Match)
            let highlightHtml = '';
            let lastIndex = 0;

            matches.forEach(m => {
                const start = m.index;
                const end = start + m[0].length;

                // Non-matching text before this match
                highlightHtml += escapeHtml(text.slice(lastIndex, start));

                // Matched text
                const matchedText = m[0];
                if (matchedText.length === 0) {
                    highlightHtml += \`<span class="highlight-match" style="border-left: 2px solid var(--accent-warning); padding: 0 1px;" title="Zero-width match at index \${start}"></span>\`;
                } else {
                    highlightHtml += \`<span class="highlight-match">\${escapeHtml(matchedText)}</span>\`;
                }

                lastIndex = end;
            });

            highlightHtml += escapeHtml(text.slice(lastIndex));
            highlightContainer.innerHTML = highlightHtml;

            // Perform Replacement
            if (patternStr) {
                try {
                    replaceResult.value = text.replace(regex, replaceStr);
                } catch(e) {
                    replaceResult.value = 'Lỗi replace: ' + e.message;
                }
            }

            // Render Match Info Panel
            if (matches.length === 0) {
                matchesListEl.innerHTML = '<div style="color: var(--text-tertiary); font-size: var(--fs-sm);">Không tìm thấy kết quả khớp nào.</div>';
                return;
            }

            let listHtml = '';
            matches.slice(0, 50).forEach((m, idx) => {
                const matchStart = m.index;
                const matchEnd = matchStart + m[0].length;
                const groups = m.slice(1);

                listHtml += \`
                    <div class="match-card">
                        <div class="match-header">
                            <span>Match \${idx + 1} <span class="match-meta">(Vị trí: index \${matchStart} - \${matchEnd})</span></span>
                        </div>
                        <div class="match-group-row" style="background: var(--bg-input); border: 1px solid var(--border-color);">
                            <span class="match-group-label" style="color: var(--text-primary);">Full Match:</span>
                            <span class="match-group-val" style="color: var(--accent-warning);">\${escapeHtml(m[0] || '(chuỗi rỗng)')}</span>
                        </div>
                \`;

                // Captured Groups
                if (groups.length > 0) {
                    groups.forEach((gVal, gIdx) => {
                        const valStr = gVal !== undefined ? escapeHtml(gVal) : '<em style="color:var(--text-tertiary)">undefined</em>';
                        listHtml += \`
                            <div class="match-group-row">
                                <span class="match-group-label">Group \${gIdx + 1}:</span>
                                <span class="match-group-val">\${valStr}</span>
                            </div>
                        \`;
                    });
                }
                
                // Named groups
                if (m.groups && Object.keys(m.groups).length > 0) {
                    Object.keys(m.groups).forEach(gName => {
                        const valStr = m.groups[gName] !== undefined ? escapeHtml(m.groups[gName]) : '<em style="color:var(--text-tertiary)">undefined</em>';
                        listHtml += \`
                            <div class="match-group-row">
                                <span class="match-group-label" style="color: var(--accent-tertiary);">Group ?&lt;\${escapeHtml(gName)}&gt;:</span>
                                <span class="match-group-val">\${valStr}</span>
                            </div>
                        \`;
                    });
                }

                listHtml += \`</div>\`;
            });

            if (matches.length > 50) {
                listHtml += \`<div style="color: var(--text-tertiary); font-size: var(--fs-xs); text-align: center; padding: 4px;">... và \${matches.length - 50} kết quả khác.</div>\`;
            }

            matchesListEl.innerHTML = listHtml;
        }

        // Event listeners for inputs
        patternInput.addEventListener('input', runRegexTester);
        testInput.addEventListener('input', runRegexTester);
        replaceInput.addEventListener('input', runRegexTester);

        [flagG, flagI, flagM, flagS, flagU].forEach(cb => {
            cb.addEventListener('change', runRegexTester);
        });

        // Preset patterns click handler
        presetsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-pattern]');
            if (!btn) return;

            const pattern = btn.dataset.pattern;
            const flags = btn.dataset.flags || 'g';
            const sample = btn.dataset.sample || '';
            const replace = btn.dataset.replace || '';

            patternInput.value = pattern;
            testInput.value = sample;
            replaceInput.value = replace;

            // Set flags
            flagG.checked = flags.includes('g');
            flagI.checked = flags.includes('i');
            flagM.checked = flags.includes('m');
            flagS.checked = flags.includes('s');
            flagU.checked = flags.includes('u');

            runRegexTester();
            if (window.showToast) {
                window.showToast(\`Đã áp dụng mẫu regex: \${btn.textContent.trim()}\`, 'success');
            }
        });

        // Cheatsheet insert handler
        cheatsheet.addEventListener('click', (e) => {
            const item = e.target.closest('.cheatsheet-item');
            if (!item) return;
            
            const insertText = item.dataset.insert;
            const startPos = patternInput.selectionStart;
            const endPos = patternInput.selectionEnd;
            
            patternInput.value = patternInput.value.substring(0, startPos) + 
                                 insertText + 
                                 patternInput.value.substring(endPos, patternInput.value.length);
            
            patternInput.focus();
            patternInput.selectionStart = startPos + insertText.length;
            patternInput.selectionEnd = startPos + insertText.length;
            
            runRegexTester();
        });

        copyReplaceBtn.addEventListener('click', () => {
            if (window.copyToClipboard) window.copyToClipboard(replaceResult.value, copyReplaceBtn);
            else { navigator.clipboard.writeText(replaceResult.value); }
        });

        // Initial run
        runRegexTester();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(RegexTester);
