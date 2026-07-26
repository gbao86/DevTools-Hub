/**
 * DevTools Hub - Base64 Encoder / Decoder Tool Module
 * Encodes and decodes text to/from Base64 format with full UTF-8 Unicode support,
 * URL-safe option, input/output swap, and character/byte count statistics.
 */
const Base64Tool = {
    name: 'Base64 Encode/Decode',
    icon: '🔐',
    category: 'Encode / Decode',
    description: 'Mã hóa và giải mã Base64 nhanh chóng',

    render(container) {
        // Render Tool HTML structure
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🔐 Base64 Encode/Decode</h2>
                    <p class="tool-description">Mã hóa và giải mã Base64 nhanh chóng</p>
                </div>
                <div class="tool-body">
                    <!-- Input Text Area -->
                    <div class="tool-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <label class="tool-label" for="base64-input">Input Text / Base64</label>
                            <span id="input-quick-stat" style="font-size: var(--fs-xs); color: var(--text-tertiary);">0 ký tự | 0 B</span>
                        </div>
                        <textarea class="tool-textarea" id="base64-input" placeholder="Nhập văn bản (để mã hóa) hoặc chuỗi Base64 (để giải mã)..."></textarea>
                    </div>

                    <!-- Actions Bar -->
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                        <div class="tool-actions">
                            <button class="tool-btn tool-btn-primary" id="btn-encode">🔒 Encode</button>
                            <button class="tool-btn tool-btn-primary" id="btn-decode">🔓 Decode</button>
                            <button class="tool-btn" id="btn-swap" title="Đổi vị trí nội dung Input và Output">🔀 Swap Input/Output</button>
                            <button class="tool-btn tool-btn-danger" id="btn-clear">🗑️ Xóa</button>
                        </div>
                        <div class="tool-inline">
                            <label class="tool-checkbox">
                                <input type="checkbox" id="chk-url-safe">
                                <span>URL-safe Base64 (- _ no =)</span>
                            </label>
                        </div>
                    </div>

                    <!-- Error Alert Status -->
                    <div id="base64-status" style="display: none;"></div>

                    <!-- Output Text Area -->
                    <div class="tool-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <label class="tool-label" for="base64-output">Result Output</label>
                            <span id="output-quick-stat" style="font-size: var(--fs-xs); color: var(--text-tertiary);">0 ký tự | 0 B</span>
                        </div>
                        <div class="tool-result">
                            <textarea class="tool-textarea" id="base64-output" readonly placeholder="Kết quả sẽ hiển thị ở đây..."></textarea>
                            <button class="tool-copy-btn" id="btn-copy" title="Copy vào Clipboard">📋</button>
                        </div>
                    </div>

                    <!-- Character and Byte Statistics Grid -->
                    <div class="tool-stats" id="base64-stats">
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-input-chars">0</div>
                            <div class="tool-stat-label">Ký tự Đầu vào</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-input-bytes">0 B</div>
                            <div class="tool-stat-label">Bytes Đầu vào (UTF-8)</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-output-chars">0</div>
                            <div class="tool-stat-label">Ký tự Đầu ra</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="stat-output-bytes">0 B</div>
                            <div class="tool-stat-label">Bytes Đầu ra (UTF-8)</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Element references
        const inputEl = container.querySelector('#base64-input');
        const outputEl = container.querySelector('#base64-output');
        const chkUrlSafe = container.querySelector('#chk-url-safe');
        const statusEl = container.querySelector('#base64-status');

        const inputQuickStat = container.querySelector('#input-quick-stat');
        const outputQuickStat = container.querySelector('#output-quick-stat');

        const statInputChars = container.querySelector('#stat-input-chars');
        const statInputBytes = container.querySelector('#stat-input-bytes');
        const statOutputChars = container.querySelector('#stat-output-chars');
        const statOutputBytes = container.querySelector('#stat-output-bytes');

        const btnEncode = container.querySelector('#btn-encode');
        const btnDecode = container.querySelector('#btn-decode');
        const btnSwap = container.querySelector('#btn-swap');
        const btnClear = container.querySelector('#btn-clear');
        const btnCopy = container.querySelector('#btn-copy');

        // Helper: Format byte counts nicely
        function formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // Helper: Calculate string stats
        function getStats(str) {
            if (!str) return { chars: 0, bytes: 0 };
            const bytes = new TextEncoder().encode(str).length;
            return { chars: str.length, bytes };
        }

        // Helper: Update Statistics UI
        function updateStatsUI() {
            const inStats = getStats(inputEl.value);
            const outStats = getStats(outputEl.value);

            inputQuickStat.textContent = `${inStats.chars.toLocaleString()} ký tự | ${formatBytes(inStats.bytes)}`;
            outputQuickStat.textContent = `${outStats.chars.toLocaleString()} ký tự | ${formatBytes(outStats.bytes)}`;

            statInputChars.textContent = inStats.chars.toLocaleString();
            statInputBytes.textContent = formatBytes(inStats.bytes);
            statOutputChars.textContent = outStats.chars.toLocaleString();
            statOutputBytes.textContent = formatBytes(outStats.bytes);
        }

        // Helper: Show Error / Success Status message
        function showStatus(type, message) {
            statusEl.style.display = 'block';
            if (type === 'error') {
                statusEl.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-sm); color: var(--accent-danger); font-size: var(--fs-sm);">
                        <span class="tool-badge tool-badge-danger">✕ Lỗi giải mã</span>
                        <span>${message}</span>
                    </div>
                `;
            } else if (type === 'success') {
                statusEl.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-sm); color: var(--accent-success); font-size: var(--fs-sm);">
                        <span class="tool-badge tool-badge-success">✓ Thành công</span>
                        <span>${message}</span>
                    </div>
                `;
            }
        }

        function clearStatus() {
            statusEl.style.display = 'none';
            statusEl.innerHTML = '';
        }

        // --- Core UTF-8 Base64 Encoding ---
        function encode() {
            clearStatus();
            const text = inputEl.value;
            if (!text) {
                outputEl.value = '';
                updateStatsUI();
                return;
            }

            try {
                // UTF-8 string to binary string conversion
                const bytes = new TextEncoder().encode(text);
                let binString = '';
                const CHUNK_SIZE = 0x8000;
                for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
                    binString += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK_SIZE));
                }

                let b64 = btoa(binString);

                // URL Safe transformation if requested
                if (chkUrlSafe.checked) {
                    b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                }

                outputEl.value = b64;
                showStatus('success', 'Đã mã hóa Base64 thành công!');
                updateStatsUI();
            } catch (err) {
                outputEl.value = '';
                showStatus('error', 'Lỗi khi mã hóa: ' + err.message);
                updateStatsUI();
            }
        }

        // --- Core UTF-8 Base64 Decoding ---
        function decode() {
            clearStatus();
            let text = inputEl.value.trim();
            if (!text) {
                outputEl.value = '';
                updateStatsUI();
                return;
            }

            try {
                // Handle Data URLs if present (e.g. data:text/plain;base64,SGVsbG8=)
                if (text.startsWith('data:')) {
                    const commaIndex = text.indexOf(',');
                    if (commaIndex !== -1) {
                        text = text.slice(commaIndex + 1);
                    }
                }

                // Clean whitespace and line breaks
                let cleaned = text.replace(/\s+/g, '');

                // Handle URL-safe characters
                cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');

                // Pad missing equal signs
                while (cleaned.length % 4 !== 0) {
                    cleaned += '=';
                }

                // Decode binary string
                const binString = atob(cleaned);

                // Convert binary string to UTF-8 array
                const bytes = new Uint8Array(binString.length);
                for (let i = 0; i < binString.length; i++) {
                    bytes[i] = binString.charCodeAt(i);
                }

                // Decode UTF-8 bytes to JS string
                const decodedStr = new TextDecoder().decode(bytes);
                outputEl.value = decodedStr;
                showStatus('success', 'Đã giải mã Base64 thành công!');
                updateStatsUI();
            } catch (err) {
                outputEl.value = '';
                showStatus('error', 'Chuỗi Base64 không hợp lệ hoặc chứa ký tự không đúng định dạng!');
                updateStatsUI();
            }
        }

        // --- Event Handlers ---
        btnEncode.addEventListener('click', encode);
        btnDecode.addEventListener('click', decode);

        btnSwap.addEventListener('click', () => {
            const inputVal = inputEl.value;
            const outputVal = outputEl.value;

            inputEl.value = outputVal;
            outputEl.value = inputVal;

            clearStatus();
            updateStatsUI();
            if (window.showToast) window.showToast('Đã tráo đổi vị trí Input và Output!', 'info');
        });

        btnClear.addEventListener('click', () => {
            inputEl.value = '';
            outputEl.value = '';
            clearStatus();
            updateStatsUI();
            inputEl.focus();
        });

        btnCopy.addEventListener('click', () => {
            const outputText = outputEl.value;
            if (!outputText) {
                if (window.showToast) window.showToast('Không có nội dung để copy', 'warning');
                return;
            }
            if (window.copyToClipboard) {
                window.copyToClipboard(outputText, btnCopy);
            } else {
                navigator.clipboard.writeText(outputText);
            }
        });

        // Realtime stats on input changes
        inputEl.addEventListener('input', () => {
            clearStatus();
            updateStatsUI();
        });

        chkUrlSafe.addEventListener('change', () => {
            if (inputEl.value.trim()) {
                encode();
            }
        });
    }
};

// Register tool module globally
window.DevTools = window.DevTools || [];
window.DevTools.push(Base64Tool);
