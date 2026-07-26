/* ============================================
   DevTools Hub - JWT Decoder Tool
   ============================================ */

const JwtDecoder = {
    name: 'JWT Decoder',
    icon: '🎫',
    category: 'Encode / Decode',
    description: 'Giải mã và phân tích JWT token',

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🎫 JWT Decoder</h2>
                    <p class="tool-description">Giải mã và phân tích JWT (JSON Web Token)</p>
                </div>
                <div class="tool-body">
                    <div class="tool-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                            <label class="tool-label">JWT Token</label>
                            <div class="tool-actions">
                                <button class="tool-btn tool-btn-sm" id="jwt-sample-btn">📝 Token mẫu</button>
                                <button class="tool-btn tool-btn-sm tool-btn-danger" id="jwt-clear-btn">🗑️ Xóa</button>
                            </div>
                        </div>
                        <textarea class="tool-textarea" id="jwt-input" placeholder="Dán JWT token vào đây (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)" rows="4"></textarea>
                    </div>

                    <!-- Error notification box -->
                    <div id="jwt-error-box" class="tool-info tool-badge-danger" style="display: none; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: var(--accent-danger);">
                    </div>

                    <!-- Claims status summary -->
                    <div id="jwt-status-container" style="display: none;" class="tool-group">
                        <label class="tool-label">Trạng thái & Thời gian Claims</label>
                        <div id="jwt-status-badges" style="display: flex; gap: var(--space-sm); flex-wrap: wrap;">
                        </div>
                    </div>

                    <!-- 3 Decoded Sections -->
                    <div id="jwt-sections" style="display: none; flex-direction: column; gap: var(--space-lg);">
                        <!-- Header Section -->
                        <div class="tool-group" style="border-left: 4px solid var(--accent-danger); background: var(--bg-card); border-radius: var(--radius-sm); padding: var(--space-md); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs); flex-wrap: wrap; gap: 8px;">
                                <label class="tool-label" style="color: var(--accent-danger); font-weight: 600;">HEADER: ALGORITHM & TOKEN TYPE</label>
                                <button class="tool-copy-btn" id="jwt-copy-header" title="Copy Header" style="position: static;">📋 Copy Header</button>
                            </div>
                            <div class="tool-result">
                                <textarea class="tool-textarea" id="jwt-header-output" readonly rows="5" style="border-color: rgba(239, 68, 68, 0.3); color: var(--text-primary);"></textarea>
                            </div>
                        </div>

                        <!-- Payload Section -->
                        <div class="tool-group" style="border-left: 4px solid var(--accent-tertiary); background: var(--bg-card); border-radius: var(--radius-sm); padding: var(--space-md); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs); flex-wrap: wrap; gap: 8px;">
                                <label class="tool-label" style="color: var(--accent-tertiary); font-weight: 600;">PAYLOAD: DATA & CLAIMS</label>
                                <button class="tool-copy-btn" id="jwt-copy-payload" title="Copy Payload" style="position: static;">📋 Copy Payload</button>
                            </div>
                            <div class="tool-result">
                                <textarea class="tool-textarea" id="jwt-payload-output" readonly rows="9" style="border-color: rgba(139, 92, 246, 0.3); color: var(--text-primary);"></textarea>
                            </div>
                        </div>

                        <!-- Signature Section -->
                        <div class="tool-group" style="border-left: 4px solid var(--accent-secondary); background: var(--bg-card); border-radius: var(--radius-sm); padding: var(--space-md); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs); flex-wrap: wrap; gap: 8px;">
                                <label class="tool-label" style="color: var(--accent-secondary); font-weight: 600;">SIGNATURE (HEX STRING)</label>
                                <button class="tool-copy-btn" id="jwt-copy-sig" title="Copy Signature" style="position: static;">📋 Copy Signature</button>
                            </div>
                            <div class="tool-result">
                                <textarea class="tool-textarea" id="jwt-signature-output" readonly rows="3" style="border-color: rgba(6, 182, 212, 0.3); color: var(--text-primary);"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // DOM elements
        const inputEl = container.querySelector('#jwt-input');
        const errorBox = container.querySelector('#jwt-error-box');
        const statusContainer = container.querySelector('#jwt-status-container');
        const statusBadges = container.querySelector('#jwt-status-badges');
        const sectionsEl = container.querySelector('#jwt-sections');
        const headerOutput = container.querySelector('#jwt-header-output');
        const payloadOutput = container.querySelector('#jwt-payload-output');
        const signatureOutput = container.querySelector('#jwt-signature-output');

        const sampleBtn = container.querySelector('#jwt-sample-btn');
        const clearBtn = container.querySelector('#jwt-clear-btn');
        const copyHeaderBtn = container.querySelector('#jwt-copy-header');
        const copyPayloadBtn = container.querySelector('#jwt-copy-payload');
        const copySigBtn = container.querySelector('#jwt-copy-sig');

        // Sample JWT Token
        const SAMPLE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5ndXllbiBWYW4gQSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjAsImV4cCI6MjUxNjIzOTAyMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        // Helper: Base64Url decode UTF-8 string
        function base64UrlDecode(str) {
            let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4 !== 0) {
                base64 += '=';
            }
            const binary = atob(base64);
            const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
            return new TextDecoder().decode(bytes);
        }

        // Helper: Convert Base64Url signature to hex string
        function base64UrlToHex(str) {
            if (!str) return '(Không có signature)';
            let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4 !== 0) {
                base64 += '=';
            }
            try {
                const binary = atob(base64);
                let hex = '';
                for (let i = 0; i < binary.length; i++) {
                    const h = binary.charCodeAt(i).toString(16).padStart(2, '0');
                    hex += h;
                }
                return hex;
            } catch (e) {
                return str;
            }
        }

        // Helper: Format duration in human readable Vietnamese
        function formatDuration(seconds) {
            seconds = Math.max(0, Math.floor(seconds));
            const days = Math.floor(seconds / 86400);
            const hours = Math.floor((seconds % 86400) / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;

            const parts = [];
            if (days > 0) parts.push(`${days} ngày`);
            if (hours > 0) parts.push(`${hours} giờ`);
            if (minutes > 0) parts.push(`${minutes} phút`);
            if (parts.length === 0 || (days === 0 && hours === 0 && secs > 0)) parts.push(`${secs} giây`);
            return parts.join(' ');
        }

        // Helper: Format timestamp to local date time string
        function formatTimestamp(ts) {
            const date = new Date(ts * 1000);
            return date.toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        }

        // Decode function
        function decodeToken() {
            const token = inputEl.value.trim();

            if (!token) {
                errorBox.style.display = 'none';
                statusContainer.style.display = 'none';
                sectionsEl.style.display = 'none';
                return;
            }

            const parts = token.split('.');

            if (parts.length !== 3) {
                showError('⚠️ JWT không hợp lệ: Token phải gồm đúng 3 phần ngăn cách bởi dấu chấm (.)');
                return;
            }

            let headerObj, payloadObj, hexSignature;

            // Header decode
            try {
                const decodedHeader = base64UrlDecode(parts[0]);
                headerObj = JSON.parse(decodedHeader);
            } catch (err) {
                showError('⚠️ Header không hợp lệ: Không thể giải mã JSON từ phần Header của JWT');
                return;
            }

            // Payload decode
            try {
                const decodedPayload = base64UrlDecode(parts[1]);
                payloadObj = JSON.parse(decodedPayload);
            } catch (err) {
                showError('⚠️ Payload không hợp lệ: Không thể giải mã JSON từ phần Payload của JWT');
                return;
            }

            // Signature decode
            try {
                hexSignature = base64UrlToHex(parts[2]);
            } catch (err) {
                hexSignature = parts[2];
            }

            // If everything is valid, display results
            errorBox.style.display = 'none';
            sectionsEl.style.display = 'flex';

            headerOutput.value = JSON.stringify(headerObj, null, 2);
            payloadOutput.value = JSON.stringify(payloadObj, null, 2);
            signatureOutput.value = hexSignature;

            // Analyze Claims (exp, iat, nbf)
            renderClaimsStatus(payloadObj);
        }

        function showError(msg) {
            errorBox.textContent = msg;
            errorBox.style.display = 'block';
            statusContainer.style.display = 'none';
            sectionsEl.style.display = 'none';
        }

        function renderClaimsStatus(payload) {
            const badges = [];
            const now = Math.floor(Date.now() / 1000);

            // Check Expiration (exp)
            if (typeof payload.exp === 'number') {
                const expDateStr = formatTimestamp(payload.exp);
                if (now > payload.exp) {
                    const ago = formatDuration(now - payload.exp);
                    badges.push(`
                        <span class="tool-badge tool-badge-danger" style="padding: 6px 12px; font-size: var(--fs-sm);">
                            🔴 <strong>Đã hết hạn (Expired):</strong> ${expDateStr} (${ago} trước)
                        </span>
                    `);
                } else {
                    const remaining = formatDuration(payload.exp - now);
                    badges.push(`
                        <span class="tool-badge tool-badge-success" style="padding: 6px 12px; font-size: var(--fs-sm);">
                            🟢 <strong>Còn hiệu lực (Active):</strong> Hết hạn lúc ${expDateStr} (Còn ${remaining})
                        </span>
                    `);
                }
            }

            // Check Issued At (iat)
            if (typeof payload.iat === 'number') {
                const iatDateStr = formatTimestamp(payload.iat);
                badges.push(`
                    <span class="tool-badge tool-badge-info" style="padding: 6px 12px; font-size: var(--fs-sm);">
                        🕒 <strong>Thời gian phát hành (iat):</strong> ${iatDateStr}
                    </span>
                `);
            }

            // Check Not Before (nbf)
            if (typeof payload.nbf === 'number') {
                const nbfDateStr = formatTimestamp(payload.nbf);
                if (now < payload.nbf) {
                    const startsIn = formatDuration(payload.nbf - now);
                    badges.push(`
                        <span class="tool-badge tool-badge-danger" style="padding: 6px 12px; font-size: var(--fs-sm);">
                            ⏳ <strong>Chưa có hiệu lực (nbf):</strong> Có hiệu lực lúc ${nbfDateStr} (Bắt đầu sau ${startsIn})
                        </span>
                    `);
                } else {
                    badges.push(`
                        <span class="tool-badge tool-badge-info" style="padding: 6px 12px; font-size: var(--fs-sm);">
                            ⏳ <strong>Có hiệu lực từ (nbf):</strong> ${nbfDateStr}
                        </span>
                    `);
                }
            }

            if (badges.length > 0) {
                statusBadges.innerHTML = badges.join('');
                statusContainer.style.display = 'block';
            } else {
                statusContainer.style.display = 'none';
            }
        }

        // Debounce input listener
        let debounceTimer = null;
        inputEl.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(decodeToken, 250);
        });

        // Event listeners
        sampleBtn.addEventListener('click', () => {
            inputEl.value = SAMPLE_TOKEN;
            decodeToken();
        });

        clearBtn.addEventListener('click', () => {
            inputEl.value = '';
            decodeToken();
        });

        copyHeaderBtn.addEventListener('click', () => {
            if (window.copyToClipboard) {
                window.copyToClipboard(headerOutput.value, copyHeaderBtn);
            }
        });

        copyPayloadBtn.addEventListener('click', () => {
            if (window.copyToClipboard) {
                window.copyToClipboard(payloadOutput.value, copyPayloadBtn);
            }
        });

        copySigBtn.addEventListener('click', () => {
            if (window.copyToClipboard) {
                window.copyToClipboard(signatureOutput.value, copySigBtn);
            }
        });
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(JwtDecoder);
