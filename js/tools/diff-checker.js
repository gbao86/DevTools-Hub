/* ============================================
   DevTools Hub - Diff Checker Tool
   ============================================ */

const DiffChecker = {
    name: 'Diff Checker',
    icon: '🔍',
    category: 'Text',
    description: 'So sánh 2 đoạn text và hiển thị sự khác biệt',

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🔍 Diff Checker</h2>
                    <p class="tool-description">So sánh 2 đoạn văn bản dòng theo dòng và hiển thị sự khác biệt</p>
                </div>
                <div class="tool-body">
                    <div class="tool-split">
                        <div class="tool-group">
                            <label class="tool-label">Văn bản gốc (Original)</label>
                            <textarea class="tool-textarea" id="diff-original" placeholder="Nhập hoặc dán văn bản gốc vào đây..." rows="10"></textarea>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Văn bản đã sửa (Modified)</label>
                            <textarea class="tool-textarea" id="diff-modified" placeholder="Nhập hoặc dán văn bản đã chỉnh sửa vào đây..." rows="10"></textarea>
                        </div>
                    </div>

                    <div class="tool-actions">
                        <button class="tool-btn tool-btn-primary" id="diff-compare-btn">🔍 So sánh</button>
                        <button class="tool-btn" id="diff-swap-btn">🔄 Hoán đổi</button>
                        <button class="tool-btn tool-btn-danger" id="diff-clear-btn">🗑️ Xóa tất cả</button>
                        <button class="tool-btn tool-btn-sm" id="diff-sample-btn" style="margin-left: auto;">📝 Dán mẫu thử</button>
                    </div>

                    <!-- Statistics Bar -->
                    <div class="tool-stats" id="diff-stats" style="display: none;">
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-added" style="color: var(--accent-success);">0</div>
                            <div class="tool-stat-label">Dòng thêm vào (+)</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-removed" style="color: var(--accent-danger);">0</div>
                            <div class="tool-stat-label">Dòng đã xóa (-)</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-unchanged" style="color: var(--text-secondary);">0</div>
                            <div class="tool-stat-label">Dòng không đổi</div>
                        </div>
                    </div>

                    <!-- Comparison Result Area -->
                    <div class="tool-group" id="diff-result-group" style="display: none;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <label class="tool-label">Kết quả so sánh chi tiết</label>
                            <button class="tool-copy-btn" id="diff-copy-btn" title="Copy patch result" style="position: static;">📋 Copy Diff</button>
                        </div>
                        <div class="tool-result">
                            <div id="diff-output" style="font-family: var(--font-mono); font-size: var(--fs-sm); background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: var(--space-md); max-height: 500px; overflow: auto; line-height: 1.6;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // DOM elements
        const originalEl = container.querySelector('#diff-original');
        const modifiedEl = container.querySelector('#diff-modified');
        const compareBtn = container.querySelector('#diff-compare-btn');
        const swapBtn = container.querySelector('#diff-swap-btn');
        const clearBtn = container.querySelector('#diff-clear-btn');
        const sampleBtn = container.querySelector('#diff-sample-btn');
        const copyBtn = container.querySelector('#diff-copy-btn');

        const statsEl = container.querySelector('#diff-stats');
        const statAdded = container.querySelector('#stat-added');
        const statRemoved = container.querySelector('#stat-removed');
        const statUnchanged = container.querySelector('#stat-unchanged');

        const resultGroup = container.querySelector('#diff-result-group');
        const outputEl = container.querySelector('#diff-output');

        let rawDiffText = '';

        // HTML escaping helper
        function escapeHtml(str) {
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // LCS-based Diff Algorithm implementation
        function computeLCSDiff(lines1, lines2) {
            const n = lines1.length;
            const m = lines2.length;

            // DP table initialization
            const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));

            for (let i = 1; i <= n; i++) {
                for (let j = 1; j <= m; j++) {
                    if (lines1[i - 1] === lines2[j - 1]) {
                        dp[i][j] = dp[i - 1][j - 1] + 1;
                    } else {
                        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    }
                }
            }

            // Backtrack to generate diff items
            let i = n;
            let j = m;
            const diff = [];

            while (i > 0 || j > 0) {
                if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
                    diff.push({ type: 'unchanged', text: lines1[i - 1] });
                    i--;
                    j--;
                } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
                    diff.push({ type: 'added', text: lines2[j - 1] });
                    j--;
                } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
                    diff.push({ type: 'removed', text: lines1[i - 1] });
                    i--;
                }
            }

            diff.reverse();
            return diff;
        }

        // Compare function
        function runDiff() {
            const text1 = originalEl.value;
            const text2 = modifiedEl.value;

            if (!text1 && !text2) {
                statsEl.style.display = 'none';
                resultGroup.style.display = 'none';
                return;
            }

            const lines1 = text1.split(/\r?\n/);
            const lines2 = text2.split(/\r?\n/);

            const diffResult = computeLCSDiff(lines1, lines2);

            let addedCount = 0;
            let removedCount = 0;
            let unchangedCount = 0;

            const htmlLines = [];
            const textLines = [];

            diffResult.forEach(item => {
                let cssClass = '';
                let prefix = ' ';

                if (item.type === 'added') {
                    addedCount++;
                    cssClass = 'diff-added';
                    prefix = '+';
                } else if (item.type === 'removed') {
                    removedCount++;
                    cssClass = 'diff-removed';
                    prefix = '-';
                } else {
                    unchangedCount++;
                    prefix = ' ';
                }

                textLines.push(`${prefix} ${item.text}`);

                htmlLines.push(`
                    <div class="diff-line ${cssClass}" style="padding: 3px 8px; margin: 1px 0; border-radius: 3px; display: flex; align-items: flex-start; font-family: var(--font-mono); font-size: var(--fs-sm);">
                        <span style="width: 24px; user-select: none; opacity: 0.7; font-weight: bold; flex-shrink: 0;">${prefix}</span>
                        <span style="flex: 1; white-space: pre-wrap; word-break: break-all;">${escapeHtml(item.text)}</span>
                    </div>
                `);
            });

            // Update stats
            statAdded.textContent = addedCount;
            statRemoved.textContent = removedCount;
            statUnchanged.textContent = unchangedCount;
            statsEl.style.display = 'grid';

            // Update output
            outputEl.innerHTML = htmlLines.join('');
            resultGroup.style.display = 'block';

            rawDiffText = textLines.join('\n');
        }

        // Event listeners
        compareBtn.addEventListener('click', runDiff);

        swapBtn.addEventListener('click', () => {
            const temp = originalEl.value;
            originalEl.value = modifiedEl.value;
            modifiedEl.value = temp;
            runDiff();
        });

        clearBtn.addEventListener('click', () => {
            originalEl.value = '';
            modifiedEl.value = '';
            statsEl.style.display = 'none';
            resultGroup.style.display = 'none';
            rawDiffText = '';
        });

        sampleBtn.addEventListener('click', () => {
            originalEl.value = `{\n  "name": "DevTools Hub",\n  "version": "1.0.0",\n  "description": "Bo cong cu dev",\n  "private": true\n}`;
            modifiedEl.value = `{\n  "name": "DevTools Hub",\n  "version": "1.1.0",\n  "description": "Bộ công cụ cho Developer",\n  "author": "DevTools Hub Team",\n  "private": true\n}`;
            runDiff();
        });

        copyBtn.addEventListener('click', () => {
            if (window.copyToClipboard && rawDiffText) {
                window.copyToClipboard(rawDiffText, copyBtn);
            }
        });
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(DiffChecker);
