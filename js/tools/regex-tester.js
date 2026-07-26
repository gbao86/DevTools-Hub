/* ============================================
   DevTools Hub - Regex Tester Tool
   ============================================ */

const RegexTester = {
    name: 'Regex Tester',
    icon: '🧪',
    category: 'Tester',
    description: 'Test regular expressions với highlighting real-time',

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🧪 Regex Tester</h2>
                    <p class="tool-description">Test regular expressions với highlighting real-time</p>
                </div>

                <div class="tool-body">
                    <!-- Preset Patterns -->
                    <div class="tool-group">
                        <label class="tool-label">⚡ Pattern mẫu thông dụng</label>
                        <div class="tool-actions" id="regex-presets">
                            <button class="tool-btn tool-btn-sm" data-pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" data-flags="g" data-sample="support@devtools.hub user.name+tag@domain.co.uk invalid-email@ text">Email</button>
                            <button class="tool-btn tool-btn-sm" data-pattern="https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)" data-flags="gi" data-sample="Ghé thăm https://google.com hoặc http://sub.domain.org/path?query=123 để xem chi tiết.">URL</button>
                            <button class="tool-btn tool-btn-sm" data-pattern="^(?:\\+84|0)(?:\\d{9})$" data-flags="gm" data-sample="0912345678\n+84987654321\n123456">SĐT Việt Nam</button>
                            <button class="tool-btn tool-btn-sm" data-pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$" data-flags="gm" data-sample="192.168.1.1\n10.0.0.255\n999.999.999.999">IPv4 Address</button>
                            <button class="tool-btn tool-btn-sm" data-pattern="^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$" data-flags="gm" data-sample="2026-07-26\n2023-12-31\n2024-02-30">Ngày (YYYY-MM-DD)</button>
                            <button class="tool-btn tool-btn-sm" data-pattern="^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" data-flags="gm" data-sample="#6366f1\n#fff\n#1234567">Mã màu Hex</button>
                            <button class="tool-btn tool-btn-sm" data-pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$" data-flags="gm" data-sample="P@ssw0rd2026\nweakpass\nStrong#Pattern1">Mật khẩu mạnh</button>
                            <button class="tool-btn tool-btn-sm" data-pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$" data-flags="g" data-sample="regex-tester-tool devtools-hub invalid_slug!">Slug URL</button>
                        </div>
                    </div>

                    <!-- Regex Pattern & Flags -->
                    <div class="tool-group">
                        <label class="tool-label">Regular Expression Pattern & Flags</label>
                        <div class="tool-row" style="align-items: center; gap: var(--space-sm);">
                            <span style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--text-tertiary); select-none;">/</span>
                            <div style="flex: 1;">
                                <input type="text" class="tool-input" id="regex-pattern-input" value="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" placeholder="Nhập regex pattern..." style="font-family: var(--font-mono);">
                            </div>
                            <span style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--text-tertiary); select-none;">/</span>
                            <div class="tool-inline" style="gap: var(--space-sm); flex-wrap: wrap;">
                                <label class="tool-checkbox" title="Global (tìm tất cả các khớp)"><input type="checkbox" id="flag-g" checked> <span>g</span></label>
                                <label class="tool-checkbox" title="Case-insensitive (không phân biệt hoa/thường)"><input type="checkbox" id="flag-i" checked> <span>i</span></label>
                                <label class="tool-checkbox" title="Multiline (nhiều dòng ^ và $)"><input type="checkbox" id="flag-m"> <span>m</span></label>
                                <label class="tool-checkbox" title="Single line / dotAll (. khớp cả dòng mới)"><input type="checkbox" id="flag-s"> <span>s</span></label>
                                <label class="tool-checkbox" title="Unicode"><input type="checkbox" id="flag-u"> <span>u</span></label>
                            </div>
                        </div>
                        <div id="regex-error-msg" style="display: none; padding: 8px 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-sm); color: var(--accent-danger); font-size: var(--fs-sm); font-family: var(--font-mono); margin-top: 6px;"></div>
                    </div>

                    <!-- Test Text Area -->
                    <div class="tool-group">
                        <label class="tool-label">Test String (Chuỗi văn bản kiểm tra)</label>
                        <textarea class="tool-textarea" id="regex-test-input" placeholder="Nhập chuỗi văn bản test ở đây..." rows="5">Send email to support@devtools.hub or admin@domain.com, but contact@invalid-domain is incomplete.</textarea>
                    </div>

                    <!-- Highlighted Real-time Results -->
                    <div class="tool-group">
                        <label class="tool-label">Kết quả Highlight Real-time</label>
                        <div class="tool-result">
                            <div id="regex-highlight-container" class="tool-textarea" style="white-space: pre-wrap; word-break: break-word; overflow-y: auto; max-height: 240px; background: var(--bg-input); line-height: 1.8;" readonly></div>
                        </div>
                    </div>

                    <!-- Stats Panel -->
                    <div class="tool-stats">
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-matches-count">0</div>
                            <div class="tool-stat-label">Số lượng Matches</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-groups-count">0</div>
                            <div class="tool-stat-label">Số Captured Groups</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-regex-status">Valid</div>
                            <div class="tool-stat-label">Trạng thái Regex</div>
                        </div>
                    </div>

                    <!-- Match Info Panel -->
                    <div class="tool-group">
                        <label class="tool-label">Danh sách chi tiết Matches & Captured Groups</label>
                        <div id="regex-matches-list" style="display: flex; flex-direction: column; gap: var(--space-sm);"></div>
                    </div>
                </div>
            </div>
        `;

        // DOM elements
        const patternInput = container.querySelector('#regex-pattern-input');
        const testInput = container.querySelector('#regex-test-input');
        const flagG = container.querySelector('#flag-g');
        const flagI = container.querySelector('#flag-i');
        const flagM = container.querySelector('#flag-m');
        const flagS = container.querySelector('#flag-s');
        const flagU = container.querySelector('#flag-u');
        const errorMsg = container.querySelector('#regex-error-msg');
        const highlightContainer = container.querySelector('#regex-highlight-container');
        const matchesCountEl = container.querySelector('#stat-matches-count');
        const groupsCountEl = container.querySelector('#stat-groups-count');
        const statusEl = container.querySelector('#stat-regex-status');
        const matchesListEl = container.querySelector('#regex-matches-list');
        const presetsContainer = container.querySelector('#regex-presets');

        // Helper: Escape HTML special characters
        function escapeHtml(str) {
            return str
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

        // Main match function
        function runRegexTester() {
            const patternStr = patternInput.value;
            const text = testInput.value;
            const flags = getFlags();

            // Clear state
            errorMsg.style.display = 'none';
            errorMsg.textContent = '';

            if (!patternStr) {
                highlightContainer.innerHTML = escapeHtml(text);
                matchesCountEl.textContent = '0';
                groupsCountEl.textContent = '0';
                statusEl.textContent = 'Trống';
                statusEl.style.color = 'var(--text-tertiary)';
                matchesListEl.innerHTML = '<div style="color: var(--text-tertiary); font-size: var(--fs-sm);">Nhập regex pattern để bắt đầu test...</div>';
                return;
            }

            let regex;
            try {
                regex = new RegExp(patternStr, flags);
                statusEl.textContent = 'Valid';
                statusEl.style.color = 'var(--accent-success)';
            } catch (err) {
                errorMsg.style.display = 'block';
                errorMsg.textContent = `❌ Lỗi Regex: ${err.message}`;
                highlightContainer.innerHTML = escapeHtml(text);
                matchesCountEl.textContent = '0';
                groupsCountEl.textContent = '0';
                statusEl.textContent = 'Lỗi';
                statusEl.style.color = 'var(--accent-danger)';
                matchesListEl.innerHTML = `<div style="color: var(--accent-danger); font-size: var(--fs-sm);">⚠️ Pattern không hợp lệ: ${escapeHtml(err.message)}</div>`;
                return;
            }

            // Perform matching
            const matches = [];
            const isGlobal = flags.includes('g');
            let match;
            let maxMatchesLimit = 1000;

            if (isGlobal) {
                while ((match = regex.exec(text)) !== null && matches.length < maxMatchesLimit) {
                    matches.push(match);
                    // Prevent infinite loop on 0-length matches
                    if (match.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }
                }
            } else {
                match = regex.exec(text);
                if (match) {
                    matches.push(match);
                }
            }

            // Update stats
            matchesCountEl.textContent = matches.length.toString();
            let totalGroups = 0;
            if (matches.length > 0) {
                totalGroups = matches[0].length - 1; // Number of captured groups
            }
            groupsCountEl.textContent = totalGroups.toString();

            // Build Highlighted HTML
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
                    // Zero-width match (e.g. ^, $, \b)
                    highlightHtml += `<span class="highlight-match" style="border-left: 2px solid var(--accent-warning); padding: 0 1px;" title="Zero-width match at index ${start}"></span>`;
                } else {
                    highlightHtml += `<span class="highlight-match">${escapeHtml(matchedText)}</span>`;
                }

                lastIndex = end;
            });

            // Remaining text after last match
            highlightHtml += escapeHtml(text.slice(lastIndex));
            highlightContainer.innerHTML = highlightHtml;

            // Render Match Info Panel
            if (matches.length === 0) {
                matchesListEl.innerHTML = '<div style="color: var(--text-tertiary); font-size: var(--fs-sm);">Không tìm thấy kết quả khớp nào.</div>';
                return;
            }

            let listHtml = '';
            matches.slice(0, 100).forEach((m, idx) => {
                const matchStart = m.index;
                const matchEnd = matchStart + m[0].length;
                const groups = m.slice(1);
                const namedGroups = m.groups;

                listHtml += `
                    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: var(--space-md);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs);">
                            <span style="font-weight: 600; font-size: var(--fs-sm); color: var(--accent-primary-hover);">
                                Match #${idx + 1} <span style="color: var(--text-tertiary); font-weight: normal; font-size: var(--fs-xs);">[Index: ${matchStart} - ${matchEnd}]</span>
                            </span>
                            <button class="tool-btn tool-btn-sm" style="padding: 2px 8px;" onclick="window.copyToClipboard('${m[0].replace(/'/g, "\\'")}', this)">📋 Copy</button>
                        </div>
                        <div style="font-family: var(--font-mono); font-size: var(--fs-sm); background: var(--bg-input); padding: 6px 10px; border-radius: 4px; color: var(--accent-warning); word-break: break-all; margin-bottom: var(--space-xs);">
                            ${escapeHtml(m[0] || '(chuỗi rỗng)')}
                        </div>
                `;

                // Captured Groups
                if (groups.length > 0 || (namedGroups && Object.keys(namedGroups).length > 0)) {
                    listHtml += `<div style="font-size: var(--fs-xs); color: var(--text-secondary); margin-top: 6px; font-weight: 600;">Captured Groups:</div>`;
                    listHtml += `<div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">`;

                    groups.forEach((gVal, gIdx) => {
                        const valStr = gVal !== undefined ? escapeHtml(gVal) : '<em style="color:var(--text-tertiary)">undefined</em>';
                        listHtml += `
                            <div style="font-size: var(--fs-xs); font-family: var(--font-mono); display: flex; gap: var(--space-sm); align-items: center; background: var(--bg-tertiary); padding: 4px 8px; border-radius: 4px;">
                                <span style="color: var(--accent-secondary); font-weight: 600; min-width: 60px;">Group $${gIdx + 1}:</span>
                                <span style="color: var(--text-primary); word-break: break-all;">${valStr}</span>
                            </div>
                        `;
                    });

                    if (namedGroups) {
                        Object.keys(namedGroups).forEach(gName => {
                            const valStr = namedGroups[gName] !== undefined ? escapeHtml(namedGroups[gName]) : '<em style="color:var(--text-tertiary)">undefined</em>';
                            listHtml += `
                                <div style="font-size: var(--fs-xs); font-family: var(--font-mono); display: flex; gap: var(--space-sm); align-items: center; background: var(--bg-tertiary); padding: 4px 8px; border-radius: 4px;">
                                    <span style="color: var(--accent-tertiary); font-weight: 600; min-width: 60px;">Group ?&lt;${escapeHtml(gName)}&gt;:</span>
                                    <span style="color: var(--text-primary); word-break: break-all;">${valStr}</span>
                                </div>
                            `;
                        });
                    }

                    listHtml += `</div>`;
                }

                listHtml += `</div>`;
            });

            if (matches.length > 100) {
                listHtml += `<div style="color: var(--text-tertiary); font-size: var(--fs-xs); text-align: center; padding: 4px;">... và ${matches.length - 100} kết quả khác.</div>`;
            }

            matchesListEl.innerHTML = listHtml;
        }

        // Event listeners for inputs
        patternInput.addEventListener('input', runRegexTester);
        testInput.addEventListener('input', runRegexTester);

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

            patternInput.value = pattern;
            testInput.value = sample;

            // Set flags
            flagG.checked = flags.includes('g');
            flagI.checked = flags.includes('i');
            flagM.checked = flags.includes('m');
            flagS.checked = flags.includes('s');
            flagU.checked = flags.includes('u');

            runRegexTester();
            if (window.showToast) {
                window.showToast(`Đã áp dụng mẫu regex: ${btn.textContent.trim()}`, 'success');
            }
        });

        // Initial run
        runRegexTester();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(RegexTester);
