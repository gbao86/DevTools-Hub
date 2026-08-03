const EnvViewer = {
    name: '.env Viewer',
    icon: '✨',
    category: 'Formatter',
    description: 'Đọc và hiển thị file .env dạng bảng trực quan',
    render(container) {
        function escapeHtml(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        const defaultSample = `# Application Configuration
APP_NAME="My Awesome App"
APP_ENV=production
DEBUG=false
export PORT=8080

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD="super_secret_password"

# API Keys
STRIPE_API_KEY=sk_test_123456789
TWILIO_TOKEN=token123
API_URL=https://api.example.com/v1
SUPPORT_EMAIL=support@example.com

# Other
EMPTY_VAR=
DUPLICATE_KEY=first
DUPLICATE_KEY=second
MULTILINE="This is a
multiline string"
`;

        container.innerHTML = `
            <style>
                .env-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: var(--space-md);
                    height: calc(100vh - 200px);
                    min-height: 500px;
                }
                .env-input-panel {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                }
                .env-output-panel {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                    overflow: hidden;
                }
                .env-textarea {
                    flex: 1;
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    resize: none;
                }
                .env-table-container {
                    flex: 1;
                    overflow: auto;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background: var(--bg-secondary);
                }
                .env-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                    font-size: var(--fs-sm);
                }
                .env-table th, .env-table td {
                    padding: var(--space-sm) var(--space-md);
                    border-bottom: 1px solid var(--border-color);
                }
                .env-table th {
                    background: var(--bg-tertiary);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .env-table tr:hover {
                    background: var(--bg-tertiary);
                }
                .env-type-badge {
                    display: inline-block;
                    padding: 2px 6px;
                    border-radius: var(--radius-sm);
                    font-size: var(--fs-xs);
                    font-family: var(--font-mono);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                }
                .env-val-hidden {
                    filter: blur(4px);
                    transition: filter 0.2s;
                }
                .env-val-hidden:hover {
                    filter: blur(0);
                }
                .env-controls {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-sm);
                    align-items: center;
                    justify-content: space-between;
                }
                .env-search {
                    flex: 1;
                    min-width: 200px;
                }
                .env-issues {
                    max-height: 100px;
                    overflow: auto;
                    font-size: var(--fs-sm);
                    margin-bottom: var(--space-sm);
                }
                .issue-item {
                    color: var(--accent-warning);
                    margin-bottom: 4px;
                }
                .issue-error {
                    color: var(--accent-danger);
                }
                .env-key-cell {
                    font-family: var(--font-mono);
                    color: var(--accent-primary);
                }
                .env-val-cell {
                    font-family: var(--font-mono);
                    word-break: break-all;
                    white-space: pre-wrap;
                }
                @media (max-width: 768px) {
                    .env-grid {
                        grid-template-columns: 1fr;
                        height: auto;
                    }
                    .env-textarea, .env-table-container {
                        min-height: 400px;
                    }
                }
            </style>
            
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>✨ .env Viewer</h2>
                    <p class="tool-description">Đọc và hiển thị file .env dạng bảng trực quan</p>
                </div>
                
                <div class="tool-body">
                    <div class="tool-stats">
                        <div class="tool-stat"><div class="tool-stat-label">Tổng số biến</div><div class="tool-stat-value" id="stat-total">0</div></div>
                        <div class="tool-stat"><div class="tool-stat-label">Ghi chú (Comments)</div><div class="tool-stat-value" id="stat-comments">0</div></div>
                        <div class="tool-stat"><div class="tool-stat-label">Giá trị rỗng</div><div class="tool-stat-value" id="stat-empty">0</div></div>
                    </div>

                    <div class="env-grid mt-3">
                        <div class="env-input-panel">
                            <div class="tool-group" style="flex: 1; display: flex; flex-direction: column;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-sm);">
                                    <label class="tool-label" style="margin: 0;">Nội dung file .env</label>
                                    <button class="tool-btn tool-btn-sm" id="btn-sample">Dữ liệu mẫu</button>
                                </div>
                                <textarea class="tool-textarea env-textarea" id="env-input" placeholder="Dán nội dung .env vào đây..."></textarea>
                            </div>
                        </div>
                        
                        <div class="env-output-panel">
                            <div class="env-controls">
                                <input type="text" class="tool-input env-search" id="env-search" placeholder="🔍 Tìm kiếm biến (Key)...">
                                <select class="tool-select" id="env-sort" style="width: auto;">
                                    <option value="original">Sắp xếp: Gốc</option>
                                    <option value="asc">A-Z</option>
                                    <option value="desc">Z-A</option>
                                </select>
                                <label class="tool-checkbox">
                                    <input type="checkbox" id="show-secrets">
                                    <span>Hiển thị Secrets</span>
                                </label>
                            </div>
                            
                            <div class="env-issues" id="env-issues"></div>
                            
                            <div class="env-table-container">
                                <table class="env-table">
                                    <thead>
                                        <tr>
                                            <th style="width: 30%">Key</th>
                                            <th style="width: 50%">Value</th>
                                            <th style="width: 20%">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody id="env-tbody">
                                        <!-- Rows render here -->
                                    </tbody>
                                </table>
                            </div>
                            
                            <div class="tool-actions" style="margin-top: 0;">
                                <button class="tool-btn" id="copy-env">Copy .env</button>
                                <button class="tool-btn" id="copy-json">Copy JSON</button>
                                <button class="tool-btn" id="copy-table">Copy Bảng (TSV)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const inputEl = container.querySelector('#env-input');
        const tbodyEl = container.querySelector('#env-tbody');
        const searchEl = container.querySelector('#env-search');
        const sortEl = container.querySelector('#env-sort');
        const showSecretsEl = container.querySelector('#show-secrets');
        const issuesEl = container.querySelector('#env-issues');
        
        let parsedVars = [];
        let parseIssues = [];
        let stats = { total: 0, comments: 0, empty: 0 };

        const isSecretKey = (key) => {
            const upKey = key.toUpperCase();
            return ['PASSWORD', 'SECRET', 'KEY', 'TOKEN', 'API_KEY', 'CREDENTIAL', 'SALT', 'PASS'].some(kw => upKey.includes(kw));
        };

        const detectType = (val, key) => {
            if (val === '') return 'empty';
            if (isSecretKey(key)) return 'secret';
            if (/^(true|false|yes|no)$/i.test(val)) return 'boolean';
            if (!isNaN(val) && val.trim() !== '') return 'number';
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'email';
            if (/^https?:\/\//i.test(val)) return 'url';
            return 'string';
        };

        const parseEnv = (content) => {
            parsedVars = [];
            parseIssues = [];
            stats = { total: 0, comments: 0, empty: 0 };
            
            const lines = content.split('\n');
            let currentKey = null;
            let currentVal = '';
            let isMultiline = false;
            let quoteChar = null;
            let keysSeen = new Set();

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                if (isMultiline) {
                    currentVal += '\n' + line;
                    if (line.endsWith(quoteChar) && !line.endsWith('\\' + quoteChar)) {
                        isMultiline = false;
                        currentVal = currentVal.slice(0, -1); // remove closing quote
                        parsedVars.push({ key: currentKey, value: currentVal, raw: line, type: detectType(currentVal, currentKey) });
                        if (currentVal === '') stats.empty++;
                    }
                    continue;
                }
                
                const trimmed = line.trim();
                if (!trimmed) continue;
                if (trimmed.startsWith('#')) {
                    stats.comments++;
                    continue;
                }

                // Handle export prefix
                let processLine = trimmed;
                if (processLine.startsWith('export ')) {
                    processLine = processLine.substring(7).trim();
                }

                const match = processLine.match(/^([^=]+)=(.*)$/);
                if (match) {
                    let key = match[1].trim();
                    let val = match[2].trim();
                    
                    if (keysSeen.has(key)) {
                        parseIssues.push({ type: 'warning', msg: `Trùng lặp key: <strong>${escapeHtml(key)}</strong> ở dòng ${i+1}` });
                    }
                    keysSeen.add(key);
                    
                    // Handle quotes
                    if ((val.startsWith('"') || val.startsWith("'")) && val.length > 0) {
                        quoteChar = val[0];
                        if (val.length > 1 && val.endsWith(quoteChar) && !val.endsWith('\\' + quoteChar)) {
                            val = val.substring(1, val.length - 1);
                        } else {
                            isMultiline = true;
                            currentKey = key;
                            currentVal = val.substring(1);
                            continue; // skip pushing to vars yet
                        }
                    }
                    
                    parsedVars.push({ key, value: val, raw: processLine, type: detectType(val, key) });
                    if (val === '') stats.empty++;
                } else {
                    parseIssues.push({ type: 'error', msg: `Cú pháp không hợp lệ ở dòng ${i+1}: <strong>${escapeHtml(trimmed)}</strong>` });
                }
            }
            
            stats.total = parsedVars.length;
            updateUI();
        };

        const updateUI = () => {
            // Stats
            container.querySelector('#stat-total').textContent = stats.total;
            container.querySelector('#stat-comments').textContent = stats.comments;
            container.querySelector('#stat-empty').textContent = stats.empty;

            // Issues
            if (parseIssues.length > 0) {
                issuesEl.innerHTML = parseIssues.map(iss => 
                    `<div class="issue-item ${iss.type === 'error' ? 'issue-error' : ''}">${iss.type === 'error' ? '❌' : '⚠️'} ${iss.msg}</div>`
                ).join('');
                issuesEl.style.display = 'block';
            } else {
                issuesEl.style.display = 'none';
                issuesEl.innerHTML = '';
            }

            renderTable();
        };

        const renderTable = () => {
            let filtered = parsedVars.filter(v => 
                v.key.toLowerCase().includes(searchEl.value.toLowerCase())
            );

            const sortMode = sortEl.value;
            if (sortMode === 'asc') {
                filtered.sort((a, b) => a.key.localeCompare(b.key));
            } else if (sortMode === 'desc') {
                filtered.sort((a, b) => b.key.localeCompare(a.key));
            }

            const showSec = showSecretsEl.checked;

            if (filtered.length === 0) {
                tbodyEl.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: var(--space-lg);">Không có dữ liệu</td></tr>`;
                return;
            }

            tbodyEl.innerHTML = filtered.map(v => {
                let valDisplay = v.value;
                let isHidden = false;
                
                if (v.type === 'secret' && !showSec) {
                    valDisplay = '•'.repeat(Math.min(v.value.length || 8, 20));
                    isHidden = true;
                }
                
                return `
                <tr>
                    <td class="env-key-cell">${escapeHtml(v.key)}</td>
                    <td class="env-val-cell"><span class="${isHidden ? 'env-val-hidden' : ''}" title="${isHidden ? 'Hover để xem' : ''}">${escapeHtml(valDisplay)}</span></td>
                    <td><span class="env-type-badge">${v.type}</span></td>
                </tr>
                `;
            }).join('');
        };

        inputEl.addEventListener('input', () => {
            parseEnv(inputEl.value);
        });

        searchEl.addEventListener('input', renderTable);
        sortEl.addEventListener('change', renderTable);
        showSecretsEl.addEventListener('change', renderTable);

        container.querySelector('#btn-sample').addEventListener('click', () => {
            inputEl.value = defaultSample;
            parseEnv(defaultSample);
        });

        container.querySelector('#copy-env').addEventListener('click', (e) => {
            if (!parsedVars.length) return window.showToast('Không có dữ liệu', 'warning');
            const txt = parsedVars.map(v => {
                let val = v.value;
                if (val.includes('\\n') || val.includes(' ')) val = `"${val}"`;
                return `${v.key}=${val}`;
            }).join('\n');
            window.copyToClipboard(txt, e.target);
        });

        container.querySelector('#copy-json').addEventListener('click', (e) => {
            if (!parsedVars.length) return window.showToast('Không có dữ liệu', 'warning');
            const obj = {};
            parsedVars.forEach(v => obj[v.key] = v.value);
            window.copyToClipboard(JSON.stringify(obj, null, 2), e.target);
        });

        container.querySelector('#copy-table').addEventListener('click', (e) => {
            if (!parsedVars.length) return window.showToast('Không có dữ liệu', 'warning');
            const txt = ['Key\tValue\tType'].concat(
                parsedVars.map(v => `${v.key}\t${v.value.replace(/\n/g, '\\n')}\t${v.type}`)
            ).join('\n');
            window.copyToClipboard(txt, e.target);
        });

        // Initialize empty
        parseEnv('');
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(EnvViewer);
