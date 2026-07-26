/**
 * DevTools Hub - JSON Formatter Tool Module
 * Handles JSON formatting (prettify), minifying, validation, tree view visualization, and statistics.
 */
const JSONFormatter = {
    name: 'JSON Formatter',
    icon: '📋',
    category: 'Formatter',
    description: 'Format, validate và minify JSON dễ dàng',

    render(container) {
        // Render Tool HTML layout
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>📋 JSON Formatter</h2>
                    <p class="tool-description">Format, validate và minify JSON dễ dàng</p>
                </div>
                <div class="tool-body">
                    <!-- Input Section -->
                    <div class="tool-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <label class="tool-label" for="json-input">Raw JSON Input</label>
                            <div class="tool-inline">
                                <span class="tool-label" style="font-size: var(--fs-xs);">Indent:</span>
                                <select class="tool-select" id="json-indent" style="padding: 4px 28px 4px 8px; font-size: var(--fs-xs);">
                                    <option value="2">2 spaces</option>
                                    <option value="4" selected>4 spaces</option>
                                    <option value="tab">Tab</option>
                                </select>
                            </div>
                        </div>
                        <textarea class="tool-textarea" id="json-input" placeholder="Dán hoặc nhập chuỗi JSON vào đây..."></textarea>
                    </div>

                    <!-- Action Buttons -->
                    <div class="tool-actions">
                        <button class="tool-btn tool-btn-primary" id="btn-format">✨ Format (Prettify)</button>
                        <button class="tool-btn" id="btn-minify">⚡ Minify</button>
                        <button class="tool-btn" id="btn-validate">🔍 Validate</button>
                        <button class="tool-btn" id="btn-sample">💡 Ví dụ mẫu</button>
                        <button class="tool-btn tool-btn-danger" id="btn-clear">🗑️ Xóa</button>
                    </div>

                    <!-- Status / Validation Message -->
                    <div id="json-status" style="display: none; margin-top: -4px;"></div>

                    <!-- Output Section -->
                    <div class="tool-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <label class="tool-label">Kết quả (Result)</label>
                            <div class="tool-inline" id="view-mode-toggle" style="display: none;">
                                <button class="tool-btn tool-btn-sm tool-btn-primary" id="btn-view-text">📄 Raw Text</button>
                                <button class="tool-btn tool-btn-sm" id="btn-view-tree">🌳 Tree View</button>
                            </div>
                        </div>

                        <!-- Raw Text Output Container -->
                        <div class="tool-result" id="text-view-container">
                            <textarea class="tool-textarea" id="json-output" readonly placeholder="Kết quả sẽ hiển thị ở đây..."></textarea>
                            <button class="tool-copy-btn" id="btn-copy" title="Copy vào Clipboard">📋</button>
                        </div>

                        <!-- Collapsible Tree View Container -->
                        <div id="tree-view-container" style="display: none; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: var(--space-md); max-height: 450px; overflow: auto; font-family: var(--font-mono); font-size: var(--fs-sm);">
                            <div style="display: flex; gap: 8px; margin-bottom: 12px;" id="tree-controls">
                                <button class="tool-btn tool-btn-sm" id="btn-tree-expand">▼ Mở rộng tất cả</button>
                                <button class="tool-btn tool-btn-sm" id="btn-tree-collapse">▶ Thu gọn tất cả</button>
                            </div>
                            <div id="json-tree-root"></div>
                        </div>
                    </div>

                    <!-- Statistics Section -->
                    <div class="tool-stats" id="json-stats" style="display: none;">
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-size">0 B</div>
                            <div class="tool-stat-label">Kích thước (Size)</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-keys">0</div>
                            <div class="tool-stat-label">Tổng số Keys</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-depth">0</div>
                            <div class="tool-stat-label">Độ sâu (Max Depth)</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inject custom CSS styles for tree view scoped to tree component
        this.injectStyles();

        // Get DOM element references
        const inputEl = container.querySelector('#json-input');
        const outputEl = container.querySelector('#json-output');
        const indentEl = container.querySelector('#json-indent');
        const statusEl = container.querySelector('#json-status');
        const statsEl = container.querySelector('#json-stats');
        const sizeStat = container.querySelector('#stat-size');
        const keysStat = container.querySelector('#stat-keys');
        const depthStat = container.querySelector('#stat-depth');

        const viewModeToggle = container.querySelector('#view-mode-toggle');
        const textViewContainer = container.querySelector('#text-view-container');
        const treeViewContainer = container.querySelector('#tree-view-container');
        const treeRoot = container.querySelector('#json-tree-root');

        const btnFormat = container.querySelector('#btn-format');
        const btnMinify = container.querySelector('#btn-minify');
        const btnValidate = container.querySelector('#btn-validate');
        const btnSample = container.querySelector('#btn-sample');
        const btnClear = container.querySelector('#btn-clear');
        const btnCopy = container.querySelector('#btn-copy');

        const btnViewText = container.querySelector('#btn-view-text');
        const btnViewTree = container.querySelector('#btn-view-tree');
        const btnTreeExpand = container.querySelector('#btn-tree-expand');
        const btnTreeCollapse = container.querySelector('#btn-tree-collapse');

        let lastParsedData = null;
        let currentViewMode = 'text';

        // --- Helper: Get Indent Space/Tab Value ---
        function getIndentValue() {
            const val = indentEl.value;
            if (val === 'tab') return '\t';
            return parseInt(val, 10) || 2;
        }

        // --- Helper: Format Byte Sizes ---
        function formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // --- Helper: Count Total Keys Recursively ---
        function countKeys(obj) {
            if (obj === null || typeof obj !== 'object') return 0;
            let count = 0;
            if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    count += countKeys(obj[i]);
                }
            } else {
                const keys = Object.keys(obj);
                count += keys.length;
                for (let i = 0; i < keys.length; i++) {
                    count += countKeys(obj[keys[i]]);
                }
            }
            return count;
        }

        // --- Helper: Calculate Max Depth Recursively ---
        function calculateDepth(obj) {
            if (obj === null || typeof obj !== 'object') return 0;
            let maxChildDepth = 0;
            if (Array.isArray(obj)) {
                for (let i = 0; i < obj.length; i++) {
                    maxChildDepth = Math.max(maxChildDepth, calculateDepth(obj[i]));
                }
            } else {
                const keys = Object.keys(obj);
                for (let i = 0; i < keys.length; i++) {
                    maxChildDepth = Math.max(maxChildDepth, calculateDepth(obj[keys[i]]));
                }
            }
            return 1 + maxChildDepth;
        }

        // --- Helper: Find Error Line and Column ---
        function getErrorLocation(rawInput, err) {
            let line = null;
            let col = null;
            let pos = null;

            // Extract position index if present in error message
            const posMatch = err.message.match(/at position (\d+)/i);
            if (posMatch) {
                pos = parseInt(posMatch[1], 10);
            } else {
                // Extract line and column if present
                const lineColMatch = err.message.match(/line (\d+) column (\d+)/i);
                if (lineColMatch) {
                    line = parseInt(lineColMatch[1], 10);
                    col = parseInt(lineColMatch[2], 10);
                }
            }

            if (pos !== null && line === null) {
                const lines = rawInput.slice(0, pos).split('\n');
                line = lines.length;
                col = lines[lines.length - 1].length + 1;
            }

            return { line, col, message: err.message };
        }

        // --- Helper: Show Validation / Error Status ---
        function showStatus(isValid, messageDetails = '') {
            statusEl.style.display = 'block';
            if (isValid) {
                statusEl.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-sm); color: var(--accent-success); font-size: var(--fs-sm);">
                        <span class="tool-badge tool-badge-success">✓ JSON Hợp lệ</span>
                        <span>Cú pháp JSON đúng chuẩn!</span>
                    </div>
                `;
            } else {
                statusEl.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 4px; padding: 10px 14px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-sm); color: var(--accent-danger); font-size: var(--fs-sm);">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span class="tool-badge tool-badge-danger">✕ JSON Không hợp lệ</span>
                            <strong>Phát hiện lỗi cú pháp!</strong>
                        </div>
                        <div style="margin-top: 4px; font-family: var(--font-mono); font-size: var(--fs-xs); color: #f87171;">
                            ${messageDetails}
                        </div>
                    </div>
                `;
            }
        }

        // --- Helper: Update Statistics Display ---
        function updateStats(parsedObj, rawString) {
            if (parsedObj === null) {
                statsEl.style.display = 'none';
                return;
            }
            statsEl.style.display = 'grid';
            const byteSize = new TextEncoder().encode(rawString).length;
            sizeStat.textContent = formatBytes(byteSize);
            keysStat.textContent = countKeys(parsedObj).toLocaleString();
            depthStat.textContent = calculateDepth(parsedObj).toString();
        }

        // --- Helper: Render Collapsible Tree View ---
        function renderTree(data) {
            treeRoot.innerHTML = '';
            const rootNode = createTreeNode(data, null, true);
            rootNode.classList.add('json-tree-root-node');
            treeRoot.appendChild(rootNode);
        }

        function createTreeNode(val, keyName = null, isLast = true) {
            const node = document.createElement('div');
            node.className = 'json-tree-node';

            const type = val === null ? 'null' : Array.isArray(val) ? 'array' : typeof val;

            if (type === 'object' || type === 'array') {
                const keys = type === 'array' ? val : Object.keys(val);
                const count = type === 'array' ? val.length : keys.length;
                const openBracket = type === 'array' ? '[' : '{';
                const closeBracket = type === 'array' ? ']' : '}';

                const header = document.createElement('div');
                header.className = 'json-tree-header';

                const toggler = document.createElement('span');
                toggler.className = 'json-tree-toggler';
                toggler.textContent = '▼';

                header.appendChild(toggler);

                if (keyName !== null) {
                    const keySpan = document.createElement('span');
                    keySpan.className = 'json-tree-key';
                    keySpan.textContent = `"${keyName}": `;
                    header.appendChild(keySpan);
                }

                const bracketSpan = document.createElement('span');
                bracketSpan.textContent = openBracket;
                header.appendChild(bracketSpan);

                const metaSpan = document.createElement('span');
                metaSpan.className = 'json-tree-meta';
                metaSpan.textContent = ` ${count} ${type === 'array' ? 'items' : 'keys'} `;
                header.appendChild(metaSpan);

                node.appendChild(header);

                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'json-tree-children';

                if (type === 'array') {
                    val.forEach((item, idx) => {
                        childrenContainer.appendChild(createTreeNode(item, null, idx === val.length - 1));
                    });
                } else {
                    keys.forEach((k, idx) => {
                        childrenContainer.appendChild(createTreeNode(val[k], k, idx === keys.length - 1));
                    });
                }

                node.appendChild(childrenContainer);

                const footer = document.createElement('div');
                footer.className = 'json-tree-footer';
                footer.textContent = closeBracket + (isLast ? '' : ',');
                node.appendChild(footer);

                // Toggle click listener
                header.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggler.classList.toggle('collapsed');
                    childrenContainer.classList.toggle('hidden');
                });

            } else {
                // Primitive node
                const line = document.createElement('div');
                line.className = 'json-tree-leaf';

                if (keyName !== null) {
                    const keySpan = document.createElement('span');
                    keySpan.className = 'json-tree-key';
                    keySpan.textContent = `"${keyName}": `;
                    line.appendChild(keySpan);
                }

                const valSpan = document.createElement('span');
                valSpan.className = `json-tree-${type}`;
                if (type === 'string') {
                    valSpan.textContent = `"${val}"`;
                } else {
                    valSpan.textContent = String(val);
                }
                line.appendChild(valSpan);

                if (!isLast) {
                    const comma = document.createElement('span');
                    comma.textContent = ',';
                    line.appendChild(comma);
                }

                node.appendChild(line);
            }

            return node;
        }

        // --- Core Operations ---
        function parseAndFormat(minify = false) {
            const raw = inputEl.value.trim();
            if (!raw) {
                statusEl.style.display = 'none';
                outputEl.value = '';
                statsEl.style.display = 'none';
                viewModeToggle.style.display = 'none';
                lastParsedData = null;
                return false;
            }

            try {
                const parsed = JSON.parse(raw);
                lastParsedData = parsed;
                const indent = minify ? null : getIndentValue();
                const formatted = JSON.stringify(parsed, null, indent);

                outputEl.value = formatted;
                showStatus(true);
                updateStats(parsed, formatted);
                renderTree(parsed);
                viewModeToggle.style.display = 'flex';

                return true;
            } catch (err) {
                lastParsedData = null;
                outputEl.value = '';
                statsEl.style.display = 'none';
                viewModeToggle.style.display = 'none';

                const errLoc = getErrorLocation(raw, err);
                let locMsg = '';
                if (errLoc.line !== null && errLoc.col !== null) {
                    locMsg = `Vị trí lỗi: <strong>Dòng ${errLoc.line}, Cột ${errLoc.col}</strong> - ${errLoc.message}`;
                } else {
                    locMsg = errLoc.message;
                }

                showStatus(false, locMsg);
                return false;
            }
        }

        // --- Event Handlers ---
        btnFormat.addEventListener('click', () => parseAndFormat(false));
        btnMinify.addEventListener('click', () => parseAndFormat(true));

        btnValidate.addEventListener('click', () => {
            const raw = inputEl.value.trim();
            if (!raw) {
                if (window.showToast) window.showToast('Vui lòng nhập JSON để kiểm tra', 'warning');
                return;
            }
            const success = parseAndFormat(false);
            if (success && window.showToast) {
                window.showToast('JSON hợp lệ!', 'success');
            }
        });

        btnSample.addEventListener('click', () => {
            const sampleData = {
                app: "DevTools Hub",
                version: "1.0.0",
                isOffline: true,
                features: ["Format JSON", "Base64 Encode/Decode", "Regex Tester", "Color Picker"],
                settings: {
                    theme: "dark",
                    fontSize: 14,
                    tabSize: 4,
                    notifications: {
                        enabled: true,
                        sound: false
                    }
                },
                author: {
                    name: "DevTools Team",
                    email: null
                }
            };
            inputEl.value = JSON.stringify(sampleData, null, 4);
            parseAndFormat(false);
        });

        btnClear.addEventListener('click', () => {
            inputEl.value = '';
            outputEl.value = '';
            statusEl.style.display = 'none';
            statsEl.style.display = 'none';
            viewModeToggle.style.display = 'none';
            lastParsedData = null;
            treeRoot.innerHTML = '';
            inputEl.focus();
        });

        btnCopy.addEventListener('click', () => {
            const textToCopy = outputEl.value;
            if (!textToCopy) {
                if (window.showToast) window.showToast('Không có nội dung để copy', 'warning');
                return;
            }
            if (window.copyToClipboard) {
                window.copyToClipboard(textToCopy, btnCopy);
            } else {
                navigator.clipboard.writeText(textToCopy);
            }
        });

        // View Mode Switcher
        btnViewText.addEventListener('click', () => {
            currentViewMode = 'text';
            btnViewText.classList.add('tool-btn-primary');
            btnViewTree.classList.remove('tool-btn-primary');
            textViewContainer.style.display = 'block';
            treeViewContainer.style.display = 'none';
        });

        btnViewTree.addEventListener('click', () => {
            if (!lastParsedData) {
                if (!parseAndFormat(false)) return;
            }
            currentViewMode = 'tree';
            btnViewTree.classList.add('tool-btn-primary');
            btnViewText.classList.remove('tool-btn-primary');
            textViewContainer.style.display = 'none';
            treeViewContainer.style.display = 'block';
        });

        // Tree Controls
        btnTreeExpand.addEventListener('click', () => {
            treeRoot.querySelectorAll('.json-tree-children').forEach(el => el.classList.remove('hidden'));
            treeRoot.querySelectorAll('.json-tree-toggler').forEach(el => el.classList.remove('collapsed'));
        });

        btnTreeCollapse.addEventListener('click', () => {
            treeRoot.querySelectorAll('.json-tree-children').forEach(el => el.classList.add('hidden'));
            treeRoot.querySelectorAll('.json-tree-toggler').forEach(el => el.classList.add('collapsed'));
        });

        // Realtime auto-format on indent change if output exists
        indentEl.addEventListener('change', () => {
            if (outputEl.value.trim() && currentViewMode === 'text') {
                parseAndFormat(false);
            }
        });
    },

    // Inject styles for the interactive Tree View
    injectStyles() {
        if (document.getElementById('json-formatter-styles')) return;
        const style = document.createElement('style');
        style.id = 'json-formatter-styles';
        style.textContent = `
            .json-tree-node {
                margin-left: 16px;
                line-height: 1.6;
                font-family: var(--font-mono);
            }
            .json-tree-root-node {
                margin-left: 0 !important;
            }
            .json-tree-header {
                cursor: pointer;
                user-select: none;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .json-tree-header:hover {
                background: rgba(255, 255, 255, 0.03);
                border-radius: 4px;
            }
            .json-tree-toggler {
                display: inline-block;
                width: 14px;
                font-size: 10px;
                color: var(--text-tertiary);
                transition: transform 0.15s ease;
            }
            .json-tree-toggler.collapsed {
                transform: rotate(-90deg);
            }
            .json-tree-key {
                color: #a78bfa;
                font-weight: 500;
            }
            .json-tree-string {
                color: #34d399;
                word-break: break-all;
            }
            .json-tree-number {
                color: #38bdf8;
            }
            .json-tree-boolean {
                color: #fbbf24;
                font-weight: 600;
            }
            .json-tree-null {
                color: #f87171;
                font-weight: 600;
            }
            .json-tree-meta {
                color: var(--text-tertiary);
                font-size: 0.8em;
                font-style: italic;
                opacity: 0.8;
            }
            .json-tree-children {
                display: block;
            }
            .json-tree-children.hidden {
                display: none !important;
            }
            .json-tree-footer {
                color: var(--text-secondary);
            }
            .json-tree-leaf {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 1px 0;
            }
        `;
        document.head.appendChild(style);
    }
};

// Register tool module globally
window.DevTools = window.DevTools || [];
window.DevTools.push(JSONFormatter);
