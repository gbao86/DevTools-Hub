/* ============================================
   DevTools Hub - Regex Tester Tool (V3 - Clean UI)
   ============================================ */

const RegexTester = {
    name: 'Regex Tester',
    icon: '🧪',
    category: 'Tester',
    description: 'Test, Replace, Explainer & Cheatsheet cho Regular Expressions',

    render(container) {
        if (!document.getElementById('regex-tester-style-v3')) {
            const style = document.createElement('style');
            style.id = 'regex-tester-style-v3';
            style.textContent = `
                /* ── Pattern Input Bar ── */
                .rx-pattern-bar {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    background: var(--bg-input);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: 0;
                    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
                    overflow: hidden;
                }
                .rx-pattern-bar:focus-within {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 3px var(--accent-primary-glow);
                }
                .rx-pattern-slash {
                    font-family: var(--font-mono);
                    font-size: 1.1rem;
                    color: var(--text-muted);
                    padding: 0 10px;
                    user-select: none;
                    flex-shrink: 0;
                }
                .rx-pattern-input {
                    flex: 1;
                    min-width: 0;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: var(--text-primary);
                    font-family: var(--font-mono);
                    font-size: var(--fs-base);
                    padding: 12px 0;
                }
                .rx-pattern-input::placeholder { color: var(--text-muted); }
                .rx-flags-group {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    padding: 0 8px;
                    border-left: 1px solid var(--border-color);
                    flex-shrink: 0;
                }
                .rx-flag-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    border-radius: var(--radius-sm);
                    border: none;
                    background: transparent;
                    color: var(--text-muted);
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    user-select: none;
                }
                .rx-flag-btn:hover { background: var(--bg-tertiary); color: var(--text-secondary); }
                .rx-flag-btn.active {
                    background: var(--accent-primary);
                    color: var(--btn-primary-text);
                }
                .rx-error {
                    padding: 8px 12px;
                    background: rgba(239, 68, 68, 0.08);
                    border: 1px solid rgba(239, 68, 68, 0.25);
                    border-radius: var(--radius-sm);
                    color: var(--accent-danger);
                    font-size: var(--fs-sm);
                    font-family: var(--font-mono);
                    display: none;
                }
                .rx-error.visible { display: block; }

                /* ── Quick Presets ── */
                .rx-presets {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                }
                .rx-preset-btn {
                    padding: 5px 12px;
                    border-radius: 100px;
                    border: 1px solid var(--border-color);
                    background: var(--bg-secondary);
                    color: var(--text-secondary);
                    font-size: var(--fs-xs);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    white-space: nowrap;
                }
                .rx-preset-btn:hover {
                    border-color: var(--accent-primary);
                    color: var(--text-primary);
                    background: var(--bg-tertiary);
                }

                /* ── Test Area ── */
                .rx-test-area {
                    position: relative;
                }
                .rx-test-textarea {
                    width: 100%;
                    min-height: 140px;
                    padding: var(--space-md);
                    background: var(--bg-input);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    color: var(--text-primary);
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    line-height: 1.7;
                    resize: vertical;
                    outline: none;
                    transition: border-color var(--transition-fast);
                    box-sizing: border-box;
                }
                .rx-test-textarea:focus {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 3px var(--accent-primary-glow);
                }
                .rx-match-count {
                    position: absolute;
                    top: 10px;
                    right: 12px;
                    padding: 3px 10px;
                    border-radius: 100px;
                    font-size: var(--fs-xs);
                    font-weight: 600;
                    font-family: var(--font-mono);
                    pointer-events: none;
                    z-index: 1;
                }
                .rx-match-count.has-match {
                    background: rgba(16, 185, 129, 0.15);
                    color: var(--accent-success);
                }
                .rx-match-count.no-match {
                    background: rgba(239, 68, 68, 0.1);
                    color: var(--accent-danger);
                }

                /* ── Highlight Box ── */
                .rx-highlight-box {
                    min-height: 100px;
                    max-height: 200px;
                    padding: var(--space-md);
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    line-height: 1.7;
                    white-space: pre-wrap;
                    word-break: break-word;
                    overflow-y: auto;
                    color: var(--text-primary);
                }
                .rx-hl {
                    background: rgba(245, 158, 11, 0.25);
                    color: var(--accent-warning);
                    border-radius: 2px;
                    padding: 1px 3px;
                    font-weight: 500;
                }
                .rx-hl-zero {
                    border-left: 2px solid var(--accent-warning);
                    padding: 0 1px;
                }

                /* ── Tabs ── */
                .rx-tabs {
                    display: flex;
                    gap: 0;
                    border-bottom: 1px solid var(--border-color);
                    margin-bottom: var(--space-md);
                }
                .rx-tab {
                    padding: 10px 20px;
                    border: none;
                    background: transparent;
                    color: var(--text-tertiary);
                    font-size: var(--fs-sm);
                    font-weight: 500;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                    border-bottom: 2px solid transparent;
                    margin-bottom: -1px;
                }
                .rx-tab:hover { color: var(--text-secondary); }
                .rx-tab.active {
                    color: var(--accent-primary-hover);
                    border-bottom-color: var(--accent-primary);
                }
                .rx-tab-panel { display: none; }
                .rx-tab-panel.active { display: block; }

                /* ── Replace Section ── */
                .rx-replace-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-md);
                }
                .rx-replace-input {
                    width: 100%;
                    padding: 10px var(--space-md);
                    background: var(--bg-input);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    color: var(--text-primary);
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    outline: none;
                    transition: border-color var(--transition-fast);
                    box-sizing: border-box;
                }
                .rx-replace-input:focus {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 3px var(--accent-primary-glow);
                }
                .rx-replace-result {
                    position: relative;
                }
                .rx-replace-output {
                    width: 100%;
                    min-height: 80px;
                    padding: var(--space-md);
                    padding-right: 48px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    color: var(--text-primary);
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    line-height: 1.6;
                    resize: none;
                    box-sizing: border-box;
                }

                /* ── Match Cards ── */
                .rx-match-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                .rx-match-card {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    padding: 12px;
                    transition: border-color var(--transition-fast);
                }
                .rx-match-card:hover { border-color: var(--border-hover); }
                .rx-match-head {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                .rx-match-idx {
                    font-weight: 600;
                    font-size: var(--fs-sm);
                    color: var(--accent-primary-hover);
                }
                .rx-match-pos {
                    font-size: var(--fs-xs);
                    color: var(--text-muted);
                    font-family: var(--font-mono);
                }
                .rx-group-row {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: var(--fs-sm);
                    font-family: var(--font-mono);
                }
                .rx-group-row:nth-child(even) { background: var(--bg-tertiary); }
                .rx-group-lbl {
                    color: var(--text-tertiary);
                    font-weight: 600;
                    min-width: 80px;
                    flex-shrink: 0;
                }
                .rx-group-val {
                    color: var(--accent-warning);
                    word-break: break-all;
                }
                .rx-group-val.full { color: var(--text-primary); font-weight: 500; }

                /* ── Explainer ── */
                .rx-explainer {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    max-height: 350px;
                    overflow-y: auto;
                }
                .rx-exp-row {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    padding: 6px 10px;
                    border-radius: var(--radius-sm);
                    transition: background var(--transition-fast);
                }
                .rx-exp-row:hover { background: var(--bg-tertiary); }
                .rx-exp-token {
                    font-family: var(--font-mono);
                    font-weight: 600;
                    font-size: var(--fs-sm);
                    color: var(--accent-primary-hover);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    padding: 2px 10px;
                    border-radius: 4px;
                    min-width: 50px;
                    text-align: center;
                    flex-shrink: 0;
                }
                .rx-exp-desc {
                    font-size: var(--fs-sm);
                    color: var(--text-secondary);
                    line-height: 1.4;
                }

                /* ── Cheatsheet (Collapsible) ── */
                .rx-cheatsheet-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 10px 14px;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    color: var(--text-primary);
                    font-size: var(--fs-sm);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }
                .rx-cheatsheet-toggle:hover { border-color: var(--border-hover); }
                .rx-cheatsheet-toggle .rx-chevron {
                    transition: transform var(--transition-fast);
                    color: var(--text-muted);
                }
                .rx-cheatsheet-toggle.open .rx-chevron { transform: rotate(180deg); }
                .rx-cheatsheet-body {
                    display: none;
                    padding: var(--space-md);
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-top: none;
                    border-radius: 0 0 var(--radius-md) var(--radius-md);
                }
                .rx-cheatsheet-body.open { display: block; }
                .rx-cheatsheet-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 6px;
                }
                .rx-cs-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 6px 10px;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: background var(--transition-fast);
                }
                .rx-cs-item:hover { background: var(--bg-tertiary); }
                .rx-cs-item code {
                    font-family: var(--font-mono);
                    background: var(--bg-primary);
                    color: var(--accent-primary-hover);
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: var(--fs-xs);
                    min-width: 45px;
                    text-align: center;
                    border: 1px solid var(--border-color);
                    flex-shrink: 0;
                }
                .rx-cs-item span {
                    font-size: var(--fs-xs);
                    color: var(--text-tertiary);
                }

                /* ── Misc ── */
                .rx-empty {
                    color: var(--text-muted);
                    font-size: var(--fs-sm);
                    padding: var(--space-md);
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .rx-replace-row { grid-template-columns: 1fr; }
                    .rx-cheatsheet-grid { grid-template-columns: 1fr; }
                }
            `;
            document.head.appendChild(style);
        }

        // Remove old style if present
        const oldStyle = document.getElementById('regex-tester-style');
        if (oldStyle) oldStyle.remove();

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🧪 Regex Tester</h2>
                    <p class="tool-description">Kiểm tra regex real-time, bóc tách nhóm, thay thế chuỗi và giải thích từng token.</p>
                </div>

                <div class="tool-body">
                    <!-- Quick Presets -->
                    <div class="tool-group">
                        <label class="tool-label">⚡ Mẫu có sẵn</label>
                        <div class="rx-presets" id="rx-presets">
                            <button class="rx-preset-btn" data-pattern="^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$" data-flags="gm" data-sample="support@devtools.hub&#10;admin@test.com&#10;invalid-email">Email</button>
                            <button class="rx-preset-btn" data-pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&\\/=]*)" data-flags="gi" data-sample="Trang chủ: https://google.com&#10;API: http://api.example.org/v2/users?id=123">URL</button>
                            <button class="rx-preset-btn" data-pattern="(\\d{4})-(\\d{2})-(\\d{2})" data-flags="g" data-sample="Bắt đầu: 2026-07-27&#10;Kết thúc: 2026-12-31" data-replace="$3/$2/$1">Ngày YYYY-MM-DD</button>
                            <button class="rx-preset-btn" data-pattern="^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" data-flags="gm" data-sample="#6366f1&#10;#fff&#10;abc123">Hex Color</button>
                            <button class="rx-preset-btn" data-pattern="\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b" data-flags="g" data-sample="Server 1: 192.168.1.1&#10;Server 2: 10.0.0.255">IPv4</button>
                            <button class="rx-preset-btn" data-pattern="(\\+84|0)(3|5|7|8|9)(\\d{8})" data-flags="g" data-sample="SĐT: 0901234567, +84912345678">SĐT VN</button>
                        </div>
                    </div>

                    <!-- Pattern Input -->
                    <div class="tool-group">
                        <label class="tool-label">Pattern</label>
                        <div class="rx-pattern-bar">
                            <span class="rx-pattern-slash">/</span>
                            <input type="text" class="rx-pattern-input" id="rx-pattern" placeholder="Nhập regex pattern..." value="(\\d{4})-(\\d{2})-(\\d{2})">
                            <span class="rx-pattern-slash">/</span>
                            <div class="rx-flags-group" id="rx-flags">
                                <button class="rx-flag-btn active" data-flag="g" title="Global – tìm tất cả">g</button>
                                <button class="rx-flag-btn" data-flag="i" title="Case-insensitive">i</button>
                                <button class="rx-flag-btn" data-flag="m" title="Multiline – ^ và $ khớp đầu/cuối dòng">m</button>
                                <button class="rx-flag-btn" data-flag="s" title="DotAll – dấu . khớp cả newline">s</button>
                                <button class="rx-flag-btn" data-flag="u" title="Unicode">u</button>
                            </div>
                        </div>
                        <div class="rx-error" id="rx-error"></div>
                    </div>

                    <!-- Test String + Highlight -->
                    <div class="tool-group">
                        <label class="tool-label">Test String</label>
                        <div class="rx-test-area">
                            <span class="rx-match-count" id="rx-match-count"></span>
                            <textarea class="rx-test-textarea" id="rx-test" placeholder="Nhập chuỗi test ở đây...">Bắt đầu: 2026-07-27
Kết thúc: 2026-12-31</textarea>
                        </div>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Kết quả highlight</label>
                        <div class="rx-highlight-box" id="rx-highlight"></div>
                    </div>

                    <!-- Output Tabs -->
                    <div class="tool-group">
                        <div class="rx-tabs" id="rx-tabs">
                            <button class="rx-tab active" data-tab="matches">Matches & Groups</button>
                            <button class="rx-tab" data-tab="replace">Replace</button>
                            <button class="rx-tab" data-tab="explain">Giải thích</button>
                        </div>

                        <!-- Tab: Matches -->
                        <div class="rx-tab-panel active" id="rx-panel-matches">
                            <div class="rx-match-list" id="rx-matches"></div>
                        </div>

                        <!-- Tab: Replace -->
                        <div class="rx-tab-panel" id="rx-panel-replace">
                            <div class="rx-replace-row">
                                <div class="tool-group" style="margin:0">
                                    <label class="tool-label" style="margin-bottom:6px">Chuỗi thay thế</label>
                                    <input type="text" class="rx-replace-input" id="rx-replace-input" placeholder="Ví dụ: $3/$2/$1" value="$3/$2/$1">
                                </div>
                                <div class="tool-group" style="margin:0">
                                    <label class="tool-label" style="margin-bottom:6px">Kết quả</label>
                                    <div class="rx-replace-result">
                                        <textarea class="rx-replace-output" id="rx-replace-output" readonly></textarea>
                                        <button class="tool-copy-btn" id="rx-copy-replace" style="position:absolute;top:8px;right:8px;">📋</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tab: Explain -->
                        <div class="rx-tab-panel" id="rx-panel-explain">
                            <div class="rx-explainer" id="rx-explainer"></div>
                        </div>
                    </div>

                    <!-- Cheatsheet (Collapsible) -->
                    <div class="tool-group">
                        <button class="rx-cheatsheet-toggle" id="rx-cs-toggle">
                            <span>📖 Cheatsheet – Nhấp token để chèn vào pattern</span>
                            <span class="rx-chevron">▼</span>
                        </button>
                        <div class="rx-cheatsheet-body" id="rx-cs-body">
                            <div class="rx-cheatsheet-grid" id="rx-cheatsheet"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // ── DOM refs ──
        const patternInput = container.querySelector('#rx-pattern');
        const testInput    = container.querySelector('#rx-test');
        const replaceInput = container.querySelector('#rx-replace-input');
        const replaceOutput= container.querySelector('#rx-replace-output');
        const errorEl      = container.querySelector('#rx-error');
        const highlightEl  = container.querySelector('#rx-highlight');
        const matchCountEl = container.querySelector('#rx-match-count');
        const matchesEl    = container.querySelector('#rx-matches');
        const explainerEl  = container.querySelector('#rx-explainer');
        const flagsEl      = container.querySelector('#rx-flags');
        const presetsEl    = container.querySelector('#rx-presets');
        const cheatsheetEl = container.querySelector('#rx-cheatsheet');
        const csToogleBtn  = container.querySelector('#rx-cs-toggle');
        const csBody       = container.querySelector('#rx-cs-body');
        const tabBar       = container.querySelector('#rx-tabs');
        const copyBtn      = container.querySelector('#rx-copy-replace');

        // ── Cheatsheet Data ──
        const cheatsheetData = [
            { token: '\\d',      desc: 'Chữ số (0-9)' },
            { token: '\\D',      desc: 'Không phải chữ số' },
            { token: '\\w',      desc: 'Chữ cái, số, _' },
            { token: '\\W',      desc: 'Không phải \\w' },
            { token: '\\s',      desc: 'Khoảng trắng' },
            { token: '\\S',      desc: 'Không phải khoảng trắng' },
            { token: '\\b',      desc: 'Ranh giới từ' },
            { token: '.',        desc: 'Bất kỳ ký tự nào' },
            { token: '^',        desc: 'Bắt đầu chuỗi/dòng' },
            { token: '$',        desc: 'Kết thúc chuỗi/dòng' },
            { token: '*',        desc: '0 hoặc nhiều lần' },
            { token: '+',        desc: '1 hoặc nhiều lần' },
            { token: '?',        desc: '0 hoặc 1 lần' },
            { token: '{n,m}',    desc: 'Lặp từ n đến m lần' },
            { token: '[abc]',    desc: 'Tập hợp ký tự' },
            { token: '[^abc]',   desc: 'Phủ định tập hợp' },
            { token: '(...)',    desc: 'Nhóm bắt giữ' },
            { token: '(?:...)',  desc: 'Nhóm không bắt giữ' },
            { token: '(?=...)',  desc: 'Lookahead dương' },
            { token: '(?!...)',  desc: 'Lookahead âm' },
            { token: '|',        desc: 'Toán tử HOẶC' },
            { token: '\\n',      desc: 'Ký tự xuống dòng' },
        ];

        // Render cheatsheet grid
        cheatsheetEl.innerHTML = cheatsheetData.map(item =>
            `<div class="rx-cs-item" data-insert="${escapeAttr(item.token)}"><code>${escapeHtml(item.token)}</code><span>${item.desc}</span></div>`
        ).join('');

        // ── Helpers ──
        function escapeHtml(str) {
            return (str || '').toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function escapeAttr(str) {
            return (str || '').toString()
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function getFlags() {
            let flags = '';
            flagsEl.querySelectorAll('.rx-flag-btn.active').forEach(btn => {
                flags += btn.dataset.flag;
            });
            return flags;
        }

        // ── Regex Explainer ──
        function explainRegex(pattern) {
            if (!pattern) {
                return '<div class="rx-empty">Nhập biểu thức regex để xem giải thích chi tiết...</div>';
            }

            const tokenDefs = [
                { re: /^\\d/, desc: 'Khớp một chữ số (0-9)' },
                { re: /^\\D/, desc: 'Khớp ký tự KHÔNG phải chữ số' },
                { re: /^\\w/, desc: 'Khớp chữ cái, số, hoặc dấu gạch dưới' },
                { re: /^\\W/, desc: 'Khớp ký tự KHÔNG phải chữ/số/gạch dưới' },
                { re: /^\\s/, desc: 'Khớp khoảng trắng (space, tab, newline)' },
                { re: /^\\S/, desc: 'Khớp ký tự KHÔNG phải khoảng trắng' },
                { re: /^\\b/, desc: 'Khớp ranh giới từ (word boundary)' },
                { re: /^\\B/, desc: 'Khớp vị trí KHÔNG phải ranh giới từ' },
                { re: /^\\n/, desc: 'Khớp ký tự xuống dòng (newline)' },
                { re: /^\\t/, desc: 'Khớp ký tự tab' },
                { re: /^\\r/, desc: 'Khớp ký tự carriage return' },
                { re: /^\\\./, desc: 'Khớp dấu chấm (literal dot)' },
                { re: /^\\\\/, desc: 'Khớp dấu backslash' },
                { re: /^\\\(/, desc: 'Khớp dấu ngoặc mở' },
                { re: /^\\\)/, desc: 'Khớp dấu ngoặc đóng' },
                { re: /^\\\[/, desc: 'Khớp dấu ngoặc vuông mở' },
                { re: /^\\\]/, desc: 'Khớp dấu ngoặc vuông đóng' },
                { re: /^\\[^\\]/, desc: 'Ký tự đặc biệt được escape' },
                { re: /^\^/, desc: 'Bắt đầu chuỗi (hoặc dòng với flag m)' },
                { re: /^\$/, desc: 'Kết thúc chuỗi (hoặc dòng với flag m)' },
                { re: /^\./, desc: 'Bất kỳ ký tự nào (trừ newline, nếu không bật flag s)' },
                { re: /^\*\?/, desc: 'Lặp 0+ lần (lazy/non-greedy)' },
                { re: /^\+\?/, desc: 'Lặp 1+ lần (lazy/non-greedy)' },
                { re: /^\?\?/, desc: 'Lặp 0-1 lần (lazy/non-greedy)' },
                { re: /^\*/, desc: 'Lặp 0 hoặc nhiều lần (greedy)' },
                { re: /^\+/, desc: 'Lặp 1 hoặc nhiều lần (greedy)' },
                { re: /^\?/, desc: 'Lặp 0 hoặc 1 lần (hoặc chuyển sang lazy)' },
                { re: /^\{\d+,\d*\}/, desc: 'Lặp trong khoảng giới hạn' },
                { re: /^\{\d+\}/, desc: 'Lặp chính xác số lần' },
                { re: /^\[\^[^\]]+\]/, desc: 'Khớp ký tự KHÔNG có trong tập hợp' },
                { re: /^\[[^\]]+\]/, desc: 'Khớp một trong các ký tự trong tập hợp' },
                { re: /^\(\?<\w+>/, desc: 'Bắt đầu nhóm bắt giữ có tên (Named Capture Group)' },
                { re: /^\(\?:/, desc: 'Bắt đầu nhóm KHÔNG bắt giữ (Non-capturing Group)' },
                { re: /^\(\?=/, desc: 'Lookahead dương – chỉ khớp nếu theo sau bởi mẫu' },
                { re: /^\(\?!/, desc: 'Lookahead âm – chỉ khớp nếu KHÔNG theo sau bởi mẫu' },
                { re: /^\(\?<=/, desc: 'Lookbehind dương – chỉ khớp nếu đứng trước là mẫu' },
                { re: /^\(\?<!/, desc: 'Lookbehind âm – chỉ khớp nếu KHÔNG đứng trước là mẫu' },
                { re: /^\(/, desc: 'Bắt đầu nhóm bắt giữ (Capture Group)' },
                { re: /^\)/, desc: 'Kết thúc nhóm' },
                { re: /^\|/, desc: 'Toán tử HOẶC (OR)' },
            ];

            let html = '';
            let i = 0;
            while (i < pattern.length) {
                let matched = false;
                const str = pattern.slice(i);
                for (const tDef of tokenDefs) {
                    const m = str.match(tDef.re);
                    if (m) {
                        const text = m[0];
                        html += `<div class="rx-exp-row"><code class="rx-exp-token">${escapeHtml(text)}</code><div class="rx-exp-desc">${tDef.desc}</div></div>`;
                        i += text.length;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    html += `<div class="rx-exp-row"><code class="rx-exp-token">${escapeHtml(pattern[i])}</code><div class="rx-exp-desc">Ký tự '${escapeHtml(pattern[i])}' (literal)</div></div>`;
                    i++;
                }
            }
            return html;
        }

        // ── Main Regex Runner ──
        function runRegex() {
            const patternStr = patternInput.value;
            const text = testInput.value;
            const replaceStr = replaceInput.value;
            const flags = getFlags();

            // Reset error
            errorEl.classList.remove('visible');
            errorEl.textContent = '';

            // Update explainer
            explainerEl.innerHTML = explainRegex(patternStr);

            if (!patternStr) {
                highlightEl.innerHTML = escapeHtml(text) || '<span class="rx-empty">Kết quả highlight sẽ hiển thị ở đây</span>';
                matchCountEl.textContent = '';
                matchCountEl.className = 'rx-match-count';
                matchesEl.innerHTML = '<div class="rx-empty">Nhập regex pattern để bắt đầu test...</div>';
                replaceOutput.value = text;
                return;
            }

            let regex;
            try {
                regex = new RegExp(patternStr, flags);
            } catch (err) {
                errorEl.textContent = '❌ ' + err.message;
                errorEl.classList.add('visible');
                highlightEl.innerHTML = escapeHtml(text);
                matchCountEl.textContent = '⚠️ Error';
                matchCountEl.className = 'rx-match-count no-match';
                matchesEl.innerHTML = '<div class="rx-empty" style="color:var(--accent-danger)">Pattern không hợp lệ</div>';
                replaceOutput.value = text;
                return;
            }

            // Collect matches
            const matches = [];
            const isGlobal = flags.includes('g');
            try {
                if (isGlobal) {
                    for (const m of text.matchAll(regex)) {
                        matches.push(m);
                        if (matches.length >= 500) break;
                    }
                } else {
                    const m = regex.exec(text);
                    if (m) matches.push(m);
                }
            } catch (e) { console.error(e); }

            // Match count badge
            if (matches.length > 0) {
                matchCountEl.textContent = `${matches.length} match${matches.length > 1 ? 'es' : ''}`;
                matchCountEl.className = 'rx-match-count has-match';
            } else {
                matchCountEl.textContent = 'No match';
                matchCountEl.className = 'rx-match-count no-match';
            }

            // Build highlight HTML
            let hlHtml = '';
            let lastIdx = 0;
            matches.forEach(m => {
                const start = m.index;
                const end = start + m[0].length;
                hlHtml += escapeHtml(text.slice(lastIdx, start));
                if (m[0].length === 0) {
                    hlHtml += '<span class="rx-hl rx-hl-zero" title="Zero-width match"></span>';
                } else {
                    hlHtml += `<span class="rx-hl">${escapeHtml(m[0])}</span>`;
                }
                lastIdx = end;
            });
            hlHtml += escapeHtml(text.slice(lastIdx));
            highlightEl.innerHTML = hlHtml || '<span class="rx-empty">Không có nội dung</span>';

            // Replace result
            try {
                replaceOutput.value = text.replace(regex, replaceStr);
            } catch (e) {
                replaceOutput.value = 'Lỗi: ' + e.message;
            }

            // Render match cards
            if (matches.length === 0) {
                matchesEl.innerHTML = '<div class="rx-empty">Không tìm thấy kết quả khớp nào.</div>';
                return;
            }

            let cardsHtml = '';
            const maxShow = Math.min(matches.length, 50);
            for (let idx = 0; idx < maxShow; idx++) {
                const m = matches[idx];
                const groups = m.slice(1);

                cardsHtml += `<div class="rx-match-card">`;
                cardsHtml += `<div class="rx-match-head"><span class="rx-match-idx">Match ${idx + 1}</span><span class="rx-match-pos">index ${m.index}–${m.index + m[0].length}</span></div>`;
                cardsHtml += `<div class="rx-group-row"><span class="rx-group-lbl">Full</span><span class="rx-group-val full">${escapeHtml(m[0] || '(empty)')}</span></div>`;

                if (groups.length > 0) {
                    groups.forEach((gVal, gIdx) => {
                        const val = gVal !== undefined ? escapeHtml(gVal) : '<em style="color:var(--text-muted)">undefined</em>';
                        cardsHtml += `<div class="rx-group-row"><span class="rx-group-lbl">Group ${gIdx + 1}</span><span class="rx-group-val">${val}</span></div>`;
                    });
                }

                if (m.groups && Object.keys(m.groups).length > 0) {
                    Object.entries(m.groups).forEach(([name, val]) => {
                        const v = val !== undefined ? escapeHtml(val) : '<em style="color:var(--text-muted)">undefined</em>';
                        cardsHtml += `<div class="rx-group-row"><span class="rx-group-lbl" style="color:var(--accent-success)">‹${escapeHtml(name)}›</span><span class="rx-group-val">${v}</span></div>`;
                    });
                }

                cardsHtml += `</div>`;
            }

            if (matches.length > 50) {
                cardsHtml += `<div class="rx-empty">...và ${matches.length - 50} kết quả khác</div>`;
            }

            matchesEl.innerHTML = cardsHtml;
        }

        // ── Event: Flag toggles ──
        flagsEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.rx-flag-btn');
            if (!btn) return;
            btn.classList.toggle('active');
            runRegex();
        });

        // ── Event: Inputs ──
        patternInput.addEventListener('input', runRegex);
        testInput.addEventListener('input', runRegex);
        replaceInput.addEventListener('input', runRegex);

        // ── Event: Tabs ──
        tabBar.addEventListener('click', (e) => {
            const tab = e.target.closest('.rx-tab');
            if (!tab) return;
            const target = tab.dataset.tab;

            tabBar.querySelectorAll('.rx-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            container.querySelectorAll('.rx-tab-panel').forEach(p => p.classList.remove('active'));
            container.querySelector(`#rx-panel-${target}`).classList.add('active');
        });

        // ── Event: Presets ──
        presetsEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.rx-preset-btn');
            if (!btn) return;

            patternInput.value = btn.dataset.pattern || '';
            testInput.value = (btn.dataset.sample || '').replace(/&#10;/g, '\n');
            replaceInput.value = btn.dataset.replace || '';

            // Update flags
            const flagStr = btn.dataset.flags || 'g';
            flagsEl.querySelectorAll('.rx-flag-btn').forEach(fb => {
                fb.classList.toggle('active', flagStr.includes(fb.dataset.flag));
            });

            runRegex();
            if (window.showToast) {
                window.showToast(`Đã áp dụng mẫu: ${btn.textContent.trim()}`, 'success');
            }
        });

        // ── Event: Cheatsheet toggle ──
        csToogleBtn.addEventListener('click', () => {
            csToogleBtn.classList.toggle('open');
            csBody.classList.toggle('open');
        });

        // ── Event: Cheatsheet insert ──
        cheatsheetEl.addEventListener('click', (e) => {
            const item = e.target.closest('.rx-cs-item');
            if (!item) return;

            const insertText = item.dataset.insert;
            const start = patternInput.selectionStart;
            const end = patternInput.selectionEnd;
            const val = patternInput.value;

            patternInput.value = val.substring(0, start) + insertText + val.substring(end);
            patternInput.focus();
            const newPos = start + insertText.length;
            patternInput.selectionStart = newPos;
            patternInput.selectionEnd = newPos;

            runRegex();
        });

        // ── Event: Copy button ──
        copyBtn.addEventListener('click', () => {
            if (window.copyToClipboard) {
                window.copyToClipboard(replaceOutput.value, copyBtn);
            } else {
                navigator.clipboard.writeText(replaceOutput.value);
            }
        });

        // ── Initial run ──
        runRegex();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(RegexTester);
