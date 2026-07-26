/* ============================================
   DevTools Hub - URL Encoder / Decoder Tool
   ============================================ */

const URLEncoder = {
    name: 'URL Encode/Decode',
    icon: '🔗',
    category: 'Encode / Decode',
    description: 'Encode và decode URL components',

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🔗 URL Encode / Decode</h2>
                    <p class="tool-description">Encode và decode URL, URL components và phân tích cấu trúc URL</p>
                </div>

                <div class="tool-body">
                    <!-- Input Section -->
                    <div class="tool-group">
                        <label class="tool-label">Văn bản / URL đầu vào</label>
                        <textarea id="url-input" class="tool-textarea" placeholder="Nhập URL hoặc chuỗi văn bản vào đây... (Ví dụ: https://example.com/search?q=dev tools&category=web#results)"></textarea>
                    </div>

                    <!-- Action Buttons -->
                    <div class="tool-actions">
                        <button id="btn-encode-uri" class="tool-btn tool-btn-primary" title="Encode toàn bộ URI (giữ lại các ký tự đặc biệt của URL như :, /, ?, #)">Encode URI</button>
                        <button id="btn-decode-uri" class="tool-btn" title="Decode URI">Decode URI</button>
                        <button id="btn-encode-comp" class="tool-btn tool-btn-primary" title="Encode URL component (mã hóa tất cả các ký tự đặc biệt)">Encode Component</button>
                        <button id="btn-decode-comp" class="tool-btn" title="Decode URL Component">Decode Component</button>
                        <button id="btn-clear-url" class="tool-btn tool-btn-danger">Xóa</button>
                    </div>

                    <!-- Output Section -->
                    <div class="tool-group">
                        <label class="tool-label">Kết quả (Output)</label>
                        <div class="tool-result">
                            <textarea id="url-output" class="tool-textarea" readonly placeholder="Kết quả encode/decode sẽ hiển thị ở đây..."></textarea>
                            <button id="btn-copy-output" class="tool-copy-btn" title="Copy kết quả">📋 Copy</button>
                        </div>
                    </div>

                    <hr style="border: none; border-top: 1px solid var(--border-color); margin: var(--space-lg) 0;" />

                    <!-- URL Parser Section -->
                    <div class="tool-header" style="margin-bottom: var(--space-md);">
                        <h3>🔍 URL Parser & Query Parameters</h3>
                        <p class="tool-description">Phân tích chi tiết thành phần của URL và danh sách các query parameters</p>
                    </div>

                    <div id="url-parsed-container">
                        <!-- Parsed components will be rendered here dynamically -->
                    </div>
                </div>
            </div>
        `;

        // DOM elements
        const inputEl = container.querySelector('#url-input');
        const outputEl = container.querySelector('#url-output');
        const btnEncodeUri = container.querySelector('#btn-encode-uri');
        const btnDecodeUri = container.querySelector('#btn-decode-uri');
        const btnEncodeComp = container.querySelector('#btn-encode-comp');
        const btnDecodeComp = container.querySelector('#btn-decode-comp');
        const btnClear = container.querySelector('#btn-clear-url');
        const btnCopy = container.querySelector('#btn-copy-output');
        const parsedContainer = container.querySelector('#url-parsed-container');

        // Helper: HTML escape
        function escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // Helper: Copy text
        function copyText(text, btn) {
            if (!text) {
                if (window.showToast) window.showToast('Không có nội dung để copy!', 'warning');
                return;
            }
            if (window.copyToClipboard) {
                window.copyToClipboard(text, btn);
            } else {
                navigator.clipboard.writeText(text).then(() => {
                    if (btn) {
                        const orig = btn.textContent;
                        btn.textContent = '✅';
                        setTimeout(() => btn.textContent = orig, 1500);
                    }
                });
            }
        }

        // Action Handlers
        btnEncodeUri.addEventListener('click', () => {
            const val = inputEl.value;
            if (!val) {
                outputEl.value = '';
                return;
            }
            outputEl.value = encodeURI(val);
        });

        btnDecodeUri.addEventListener('click', () => {
            const val = inputEl.value;
            if (!val) {
                outputEl.value = '';
                return;
            }
            try {
                outputEl.value = decodeURI(val);
            } catch (err) {
                outputEl.value = '❌ Lỗi Decode URI: ' + err.message;
                if (window.showToast) window.showToast('Chuỗi URI không hợp lệ!', 'error');
            }
        });

        btnEncodeComp.addEventListener('click', () => {
            const val = inputEl.value;
            if (!val) {
                outputEl.value = '';
                return;
            }
            outputEl.value = encodeURIComponent(val);
        });

        btnDecodeComp.addEventListener('click', () => {
            const val = inputEl.value;
            if (!val) {
                outputEl.value = '';
                return;
            }
            try {
                outputEl.value = decodeURIComponent(val);
            } catch (err) {
                outputEl.value = '❌ Lỗi Decode Component: ' + err.message;
                if (window.showToast) window.showToast('Chuỗi URL Component không hợp lệ!', 'error');
            }
        });

        btnClear.addEventListener('click', () => {
            inputEl.value = '';
            outputEl.value = '';
            updateUrlParser();
            inputEl.focus();
        });

        btnCopy.addEventListener('click', (e) => {
            copyText(outputEl.value, e.target);
        });

        // URL Parser Logic
        function parseURLString(str) {
            const trimmed = str.trim();
            if (!trimmed) return null;

            let urlObj = null;
            try {
                urlObj = new URL(trimmed);
            } catch (e1) {
                // If missing protocol, try prepending http://
                try {
                    urlObj = new URL('http://' + trimmed);
                } catch (e2) {
                    return null;
                }
            }

            const queryParams = [];
            urlObj.searchParams.forEach((value, key) => {
                queryParams.push({ key, value });
            });

            return {
                protocol: urlObj.protocol,
                host: urlObj.host,
                hostname: urlObj.hostname,
                port: urlObj.port || '(Default)',
                pathname: urlObj.pathname,
                search: urlObj.search,
                hash: urlObj.hash,
                queryParams
            };
        }

        function updateUrlParser() {
            const text = inputEl.value;
            const parsed = parseURLString(text);

            if (!parsed) {
                parsedContainer.innerHTML = `
                    <div class="tool-info">
                        💡 Nhập URL hợp lệ vào ô đầu vào ở trên để xem phân tích các thành phần (Protocol, Host, Path, Query parameters...)
                    </div>
                `;
                return;
            }

            let queryTableHtml = '';
            if (parsed.queryParams.length === 0) {
                queryTableHtml = `<div class="tool-info" style="margin-top: var(--space-sm);">Không có query parameters nào trong URL này.</div>`;
            } else {
                let rowsHtml = '';
                parsed.queryParams.forEach((param, idx) => {
                    rowsHtml += `
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 10px 14px; color: var(--text-tertiary); text-align: center;">${idx + 1}</td>
                            <td style="padding: 10px 14px; font-family: var(--font-mono); font-weight: 500; color: var(--accent-secondary); word-break: break-all;">${escapeHtml(param.key)}</td>
                            <td style="padding: 10px 14px; font-family: var(--font-mono); color: var(--text-primary); word-break: break-all;">${escapeHtml(param.value)}</td>
                            <td style="padding: 10px 14px; text-align: right;">
                                <button class="tool-btn tool-btn-sm param-copy-btn" data-val="${escapeHtml(param.key + '=' + param.value)}" title="Copy key=value">📋</button>
                            </td>
                        </tr>
                    `;
                });

                queryTableHtml = `
                    <div style="overflow-x: auto; margin-top: var(--space-sm); border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                        <table style="width: 100%; border-collapse: collapse; font-size: var(--fs-sm);">
                            <thead>
                                <tr style="background: var(--bg-tertiary); border-bottom: 1px solid var(--border-color);">
                                    <th style="padding: 10px 14px; text-align: center; color: var(--text-secondary); width: 50px;">#</th>
                                    <th style="padding: 10px 14px; text-align: left; color: var(--text-secondary); width: 30%;">Key (Tham số)</th>
                                    <th style="padding: 10px 14px; text-align: left; color: var(--text-secondary);">Value (Giá trị)</th>
                                    <th style="padding: 10px 14px; text-align: right; color: var(--text-secondary); width: 70px;">Copy</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                `;
            }

            parsedContainer.innerHTML = `
                <div class="tool-group">
                    <label class="tool-label">URL Parts</label>
                    <div class="tool-stats" style="margin-bottom: var(--space-md);">
                        <div class="tool-stat">
                            <div class="tool-stat-label">PROTOCOL</div>
                            <div class="tool-stat-value" style="font-size: var(--fs-base); font-family: var(--font-mono);">${escapeHtml(parsed.protocol)}</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-label">HOST / HOSTNAME</div>
                            <div class="tool-stat-value" style="font-size: var(--fs-base); font-family: var(--font-mono);">${escapeHtml(parsed.host)}</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-label">PORT</div>
                            <div class="tool-stat-value" style="font-size: var(--fs-base); font-family: var(--font-mono);">${escapeHtml(parsed.port)}</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-label">PATH</div>
                            <div class="tool-stat-value" style="font-size: var(--fs-base); font-family: var(--font-mono); word-break: break-all;">${escapeHtml(parsed.pathname)}</div>
                        </div>
                    </div>
                </div>

                <div class="tool-split" style="margin-bottom: var(--space-md);">
                    <div class="tool-group">
                        <label class="tool-label">Search Query String</label>
                        <input class="tool-input" readonly value="${escapeHtml(parsed.search || '(Empty)')}" style="font-family: var(--font-mono);" />
                    </div>
                    <div class="tool-group">
                        <label class="tool-label">Hash / Fragment</label>
                        <input class="tool-input" readonly value="${escapeHtml(parsed.hash || '(Empty)')}" style="font-family: var(--font-mono);" />
                    </div>
                </div>

                <div class="tool-group">
                    <label class="tool-label">Query Parameters (${parsed.queryParams.length})</label>
                    ${queryTableHtml}
                </div>
            `;

            // Bind param copy buttons
            parsedContainer.querySelectorAll('.param-copy-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const targetBtn = e.target.closest('button');
                    const val = targetBtn.dataset.val;
                    copyText(val, targetBtn);
                });
            });
        }

        // Live input update for parser
        inputEl.addEventListener('input', () => {
            updateUrlParser();
        });

        // Initialize parser
        updateUrlParser();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(URLEncoder);
