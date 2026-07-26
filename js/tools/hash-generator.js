/* ============================================
   DevTools Hub - Hash Generator Tool
   ============================================ */

const HashGenerator = {
    name: 'Hash Generator',
    icon: '🔑',
    category: 'Generator',
    description: 'Tạo hash MD5, SHA-1, SHA-256, SHA-512 từ text',

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🔑 Hash Generator</h2>
                    <p class="tool-description">Tạo hash MD5, SHA-1, SHA-256, SHA-512 từ văn bản đầu vào tức thì (Web Crypto API)</p>
                </div>

                <div class="tool-body">
                    <!-- Input Area -->
                    <div class="tool-group">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-xs);">
                            <label class="tool-label">Văn bản đầu vào (Input Text)</label>
                            <label class="tool-checkbox">
                                <input type="checkbox" id="hash-uppercase-check">
                                <span>IN HOA (Uppercase)</span>
                            </label>
                        </div>
                        <textarea id="hash-input-text" class="tool-textarea" placeholder="Nhập chuỗi văn bản cần tính toán hash..."></textarea>
                    </div>

                    <!-- Actions -->
                    <div class="tool-actions">
                        <button id="hash-clear-btn" class="tool-btn tool-btn-danger">Xóa văn bản</button>
                    </div>

                    <!-- Hash Results List -->
                    <div class="tool-group">
                        <label class="tool-label">Kết quả Hash</label>
                        <div id="hash-list-container" style="display: flex; flex-direction: column; gap: var(--space-md);">
                            <!-- MD5 -->
                            <div class="hash-item-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: var(--space-md);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span class="tool-label" style="font-weight: 600; color: var(--text-primary);">
                                        MD5 <span class="tool-badge tool-badge-info" style="font-size: 0.75rem; margin-left: 6px;">128-bit / 32 chars</span>
                                    </span>
                                    <button class="tool-btn tool-btn-sm hash-copy-btn" data-target="hash-md5-val">📋 Copy</button>
                                </div>
                                <div class="tool-result">
                                    <input type="text" id="hash-md5-val" class="tool-input" readonly style="font-family: var(--font-mono); font-size: var(--fs-sm);" placeholder="Hash MD5..." />
                                </div>
                            </div>

                            <!-- SHA-1 -->
                            <div class="hash-item-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: var(--space-md);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span class="tool-label" style="font-weight: 600; color: var(--text-primary);">
                                        SHA-1 <span class="tool-badge tool-badge-info" style="font-size: 0.75rem; margin-left: 6px;">160-bit / 40 chars</span>
                                    </span>
                                    <button class="tool-btn tool-btn-sm hash-copy-btn" data-target="hash-sha1-val">📋 Copy</button>
                                </div>
                                <div class="tool-result">
                                    <input type="text" id="hash-sha1-val" class="tool-input" readonly style="font-family: var(--font-mono); font-size: var(--fs-sm);" placeholder="Hash SHA-1..." />
                                </div>
                            </div>

                            <!-- SHA-256 -->
                            <div class="hash-item-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: var(--space-md);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span class="tool-label" style="font-weight: 600; color: var(--text-primary);">
                                        SHA-256 <span class="tool-badge tool-badge-info" style="font-size: 0.75rem; margin-left: 6px;">256-bit / 64 chars</span>
                                    </span>
                                    <button class="tool-btn tool-btn-sm hash-copy-btn" data-target="hash-sha256-val">📋 Copy</button>
                                </div>
                                <div class="tool-result">
                                    <input type="text" id="hash-sha256-val" class="tool-input" readonly style="font-family: var(--font-mono); font-size: var(--fs-sm);" placeholder="Hash SHA-256..." />
                                </div>
                            </div>

                            <!-- SHA-512 -->
                            <div class="hash-item-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: var(--space-md);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <span class="tool-label" style="font-weight: 600; color: var(--text-primary);">
                                        SHA-512 <span class="tool-badge tool-badge-info" style="font-size: 0.75rem; margin-left: 6px;">512-bit / 128 chars</span>
                                    </span>
                                    <button class="tool-btn tool-btn-sm hash-copy-btn" data-target="hash-sha512-val">📋 Copy</button>
                                </div>
                                <div class="tool-result">
                                    <textarea id="hash-sha512-val" class="tool-textarea" readonly style="min-height: 70px; font-family: var(--font-mono); font-size: var(--fs-sm);" placeholder="Hash SHA-512..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // DOM elements
        const inputEl = container.querySelector('#hash-input-text');
        const uppercaseCheck = container.querySelector('#hash-uppercase-check');
        const clearBtn = container.querySelector('#hash-clear-btn');
        const md5Input = container.querySelector('#hash-md5-val');
        const sha1Input = container.querySelector('#hash-sha1-val');
        const sha256Input = container.querySelector('#hash-sha256-val');
        const sha512Input = container.querySelector('#hash-sha512-val');

        // Pure JS MD5 implementation
        function calculateMD5(string) {
            function cmn(q, a, b, x, s, t) {
                a = (a + q + x + t) | 0;
                return (((a << s) | (a >>> (32 - s))) + b) | 0;
            }
            function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
            function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
            function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
            function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }

            const encoder = new TextEncoder();
            const bytes = encoder.encode(string);
            const len = bytes.length;

            const wordsCount = (((len + 8) >> 6) + 1) * 16;
            const words = new Int32Array(wordsCount);
            for (let i = 0; i < len; i++) {
                words[i >> 2] |= bytes[i] << ((i % 4) * 8);
            }

            words[len >> 2] |= 0x80 << ((len % 4) * 8);
            const bitLen = len * 8;
            words[wordsCount - 2] = bitLen & 0xffffffff;
            words[wordsCount - 1] = Math.floor(bitLen / 0x100000000);

            let a = 1732584193;
            let b = -271733879;
            let c = -1732584194;
            let d = 271733878;

            for (let i = 0; i < wordsCount; i += 16) {
                const olda = a, oldb = b, oldc = c, oldd = d;

                a = ff(a, b, c, d, words[i + 0], 7, -680876936);
                d = ff(d, a, b, c, words[i + 1], 12, -389564586);
                c = ff(c, d, a, b, words[i + 2], 17, 606105819);
                b = ff(b, c, d, a, words[i + 3], 22, -1044525330);
                a = ff(a, b, c, d, words[i + 4], 7, -176418897);
                d = ff(d, a, b, c, words[i + 5], 12, 1200080426);
                c = ff(c, d, a, b, words[i + 6], 17, -1473231341);
                b = ff(b, c, d, a, words[i + 7], 22, -45705983);
                a = ff(a, b, c, d, words[i + 8], 7, 1770035416);
                d = ff(d, a, b, c, words[i + 9], 12, -1958414417);
                c = ff(c, d, a, b, words[i + 10], 17, -42063);
                b = ff(b, c, d, a, words[i + 11], 22, -1990404162);
                a = ff(a, b, c, d, words[i + 12], 7, 1804603682);
                d = ff(d, a, b, c, words[i + 13], 12, -40341101);
                c = ff(c, d, a, b, words[i + 14], 17, -1502002290);
                b = ff(b, c, d, a, words[i + 15], 22, 1236535329);

                a = gg(a, b, c, d, words[i + 1], 5, -165796510);
                d = gg(d, a, b, c, words[i + 6], 9, -1069501632);
                c = gg(c, d, a, b, words[i + 11], 14, 643717713);
                b = gg(b, c, d, a, words[i + 0], 20, -373897302);
                a = gg(a, b, c, d, words[i + 5], 5, -701558691);
                d = gg(d, a, b, c, words[i + 10], 9, 38016083);
                c = gg(c, d, a, b, words[i + 15], 14, -660478335);
                b = gg(b, c, d, a, words[i + 4], 20, -405537848);
                a = gg(a, b, c, d, words[i + 9], 5, 568446438);
                d = gg(d, a, b, c, words[i + 14], 9, -1019803690);
                c = gg(c, d, a, b, words[i + 3], 14, -187363961);
                b = gg(b, c, d, a, words[i + 8], 20, 1163531501);
                a = gg(a, b, c, d, words[i + 13], 5, -144468057);
                d = gg(d, a, b, c, words[i + 2], 9, -51403784);
                c = gg(c, d, a, b, words[i + 7], 14, 1735328473);
                b = gg(b, c, d, a, words[i + 12], 20, -1926607734);

                a = hh(a, b, c, d, words[i + 5], 4, -378558);
                d = hh(d, a, b, c, words[i + 8], 11, -2022574463);
                c = hh(c, d, a, b, words[i + 13], 16, 1839030562);
                b = hh(b, c, d, a, words[i + 2], 23, -35309556);
                a = hh(a, b, c, d, words[i + 7], 4, -1530992060);
                d = hh(d, a, b, c, words[i + 12], 11, 1272893353);
                c = hh(c, d, a, b, words[i + 14], 16, -155497632);
                b = hh(b, c, d, a, words[i + 1], 23, -1094730640);
                a = hh(a, b, c, d, words[i + 6], 4, 680876936);
                d = hh(d, a, b, c, words[i + 11], 11, -358537222);
                c = hh(c, d, a, b, words[i + 0], 16, -722521979);
                b = hh(b, c, d, a, words[i + 5], 23, 76029189);
                a = hh(a, b, c, d, words[i + 10], 4, -640364409);
                d = hh(d, a, b, c, words[i + 15], 11, -389564586);
                c = hh(c, d, a, b, words[i + 4], 16, 606105819);
                b = hh(b, c, d, a, words[i + 9], 23, -1044525330);

                a = ii(a, b, c, d, words[i + 0], 6, -198630844);
                d = ii(d, a, b, c, words[i + 7], 10, 1126891415);
                c = ii(c, d, a, b, words[i + 14], 15, -1416354905);
                b = ii(b, c, d, a, words[i + 5], 21, -57434055);
                a = ii(a, b, c, d, words[i + 12], 6, 1700485571);
                d = ii(d, a, b, c, words[i + 3], 10, -1894980168);
                c = ii(c, d, a, b, words[i + 10], 15, -1051523);
                b = ii(b, c, d, a, words[i + 1], 21, -2054922799);
                a = ii(a, b, c, d, words[i + 8], 6, 1873313359);
                d = ii(d, a, b, c, words[i + 15], 10, -30611744);
                c = ii(c, d, a, b, words[i + 6], 15, -1560198380);
                b = ii(b, c, d, a, words[i + 13], 21, 1309151649);
                a = ii(a, b, c, d, words[i + 4], 6, -145523070);
                d = ii(d, a, b, c, words[i + 11], 10, -1120210379);
                c = ii(c, d, a, b, words[i + 2], 15, 718787259);
                b = ii(b, c, d, a, words[i + 9], 21, -343485551);

                a = (a + olda) | 0;
                b = (b + oldb) | 0;
                c = (c + oldc) | 0;
                d = (d + oldd) | 0;
            }

            function wordToHex(n) {
                let hex = '';
                for (let j = 0; j < 4; j++) {
                    const b = (n >> (j * 8)) & 0xff;
                    hex += (b < 16 ? '0' : '') + b.toString(16);
                }
                return hex;
            }

            return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
        }

        // Web Crypto API helper for SHA algorithms
        async function calculateSubtleHash(algorithm, text) {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest(algorithm, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // Format helper (uppercase/lowercase)
        function formatHash(hashStr) {
            if (!hashStr) return '';
            return uppercaseCheck.checked ? hashStr.toUpperCase() : hashStr.toLowerCase();
        }

        // Main update function
        async function updateHashes() {
            const text = inputEl.value;

            // Compute MD5 synchronously
            const md5Val = calculateMD5(text);
            md5Input.value = formatHash(md5Val);

            // Compute SHA hashes concurrently via Web Crypto API
            try {
                const [sha1Val, sha256Val, sha512Val] = await Promise.all([
                    calculateSubtleHash('SHA-1', text),
                    calculateSubtleHash('SHA-256', text),
                    calculateSubtleHash('SHA-512', text)
                ]);

                sha1Input.value = formatHash(sha1Val);
                sha256Input.value = formatHash(sha256Val);
                sha512Input.value = formatHash(sha512Val);
            } catch (err) {
                console.error('SubtleCrypto error:', err);
                sha1Input.value = '❌ SubtleCrypto không khả dụng';
                sha256Input.value = '❌ SubtleCrypto không khả dụng';
                sha512Input.value = '❌ SubtleCrypto không khả dụng';
            }
        }

        // Debounce setup
        let debounceTimer = null;
        function debouncedUpdate() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                updateHashes();
            }, 150);
        }

        // Bind events
        inputEl.addEventListener('input', debouncedUpdate);

        uppercaseCheck.addEventListener('change', () => {
            updateHashes();
        });

        clearBtn.addEventListener('click', () => {
            inputEl.value = '';
            updateHashes();
            inputEl.focus();
        });

        // Copy button event delegation
        container.querySelectorAll('.hash-copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('button');
                const targetId = targetBtn.dataset.target;
                const targetEl = container.querySelector('#' + targetId);
                if (targetEl && targetEl.value) {
                    if (window.copyToClipboard) {
                        window.copyToClipboard(targetEl.value, targetBtn);
                    } else {
                        navigator.clipboard.writeText(targetEl.value).then(() => {
                            const orig = targetBtn.textContent;
                            targetBtn.textContent = '✅';
                            setTimeout(() => targetBtn.textContent = orig, 1500);
                        });
                    }
                } else {
                    if (window.showToast) window.showToast('Không có hash để copy!', 'warning');
                }
            });
        });

        // Initial hash calculation for empty text or pre-filled text
        updateHashes();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(HashGenerator);
