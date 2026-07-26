/**
 * Number Base Converter Tool Module
 * DevTools Hub
 */
const NumberBaseConverter = {
    name: 'Number Base Converter',
    icon: '🔢',
    category: 'Converter',
    description: 'Chuyển đổi số giữa các hệ: thập phân, nhị phân, bát phân, thập lục phân',

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🔢 Number Base Converter</h2>
                    <p class="tool-description">Chuyển đổi tức thì giữa các hệ số: Thập phân (Dec), Nhị phân (Bin), Bát phân (Oct), Thập lục phân (Hex)</p>
                </div>
                <div class="tool-body">
                    <div class="tool-actions" style="margin-bottom: var(--space-xs);">
                        <span style="font-size: var(--fs-sm); color: var(--text-secondary); align-self: center;">Mẫu nhanh:</span>
                        <button class="tool-btn tool-btn-sm" data-preset="255">255 (0xFF)</button>
                        <button class="tool-btn tool-btn-sm" data-preset="1024">1024 (0x400)</button>
                        <button class="tool-btn tool-btn-sm" data-preset="65535">65535 (0xFFFF)</button>
                        <button class="tool-btn tool-btn-sm" data-preset="2147483647">2147483647 (32-bit Max)</button>
                        <button class="tool-btn tool-btn-sm tool-btn-danger" id="nbc-clear-btn" style="margin-left: auto;">🗑️ Xóa tất cả</button>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Dec (Decimal - Thập phân / Hệ 10)</label>
                        <div class="tool-result">
                            <input type="text" class="tool-input" id="nbc-dec" placeholder="Nhập số thập phân (e.g. 255)..." autocomplete="off" style="font-family: var(--font-mono);">
                            <button class="tool-copy-btn" id="nbc-copy-dec" title="Copy Decimal">📋</button>
                        </div>
                        <div class="tool-stat-label" id="nbc-err-dec" style="color: var(--accent-danger); margin-top: 4px; display: none;"></div>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Bin (Binary - Nhị phân / Hệ 2)</label>
                        <div class="tool-result">
                            <input type="text" class="tool-input" id="nbc-bin" placeholder="Nhập số nhị phân (e.g. 11111111)..." autocomplete="off" style="font-family: var(--font-mono);">
                            <button class="tool-copy-btn" id="nbc-copy-bin" title="Copy Binary">📋</button>
                        </div>
                        <div class="tool-stat-label" id="nbc-err-bin" style="color: var(--accent-danger); margin-top: 4px; display: none;"></div>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Oct (Octal - Bát phân / Hệ 8)</label>
                        <div class="tool-result">
                            <input type="text" class="tool-input" id="nbc-oct" placeholder="Nhập số bát phân (e.g. 377)..." autocomplete="off" style="font-family: var(--font-mono);">
                            <button class="tool-copy-btn" id="nbc-copy-oct" title="Copy Octal">📋</button>
                        </div>
                        <div class="tool-stat-label" id="nbc-err-oct" style="color: var(--accent-danger); margin-top: 4px; display: none;"></div>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Hex (Hexadecimal - Thập lục phân / Hệ 16)</label>
                        <div class="tool-result">
                            <input type="text" class="tool-input" id="nbc-hex" placeholder="Nhập số thập lục phân (e.g. FF)..." autocomplete="off" style="font-family: var(--font-mono);">
                            <button class="tool-copy-btn" id="nbc-copy-hex" title="Copy Hexadecimal">📋</button>
                        </div>
                        <div class="tool-stat-label" id="nbc-err-hex" style="color: var(--accent-danger); margin-top: 4px; display: none;"></div>
                    </div>

                    <div class="tool-group" style="margin-top: var(--space-md);">
                        <label class="tool-label">Biểu diễn Bit (Bit Visualizer - 8/16/32-bit grouping)</label>
                        <div id="nbc-bit-container" class="tool-info" style="min-height: 80px;">
                            <span style="color: var(--text-tertiary);">Nhập số nguyên dương để xem trực quan chuỗi Bit</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inputs
        const decInput = container.querySelector('#nbc-dec');
        const binInput = container.querySelector('#nbc-bin');
        const octInput = container.querySelector('#nbc-oct');
        const hexInput = container.querySelector('#nbc-hex');
        const clearBtn = container.querySelector('#nbc-clear-btn');
        const bitContainer = container.querySelector('#nbc-bit-container');

        const inputsMap = {
            10: { input: decInput, err: container.querySelector('#nbc-err-dec') },
            2: { input: binInput, err: container.querySelector('#nbc-err-bin') },
            8: { input: octInput, err: container.querySelector('#nbc-err-oct') },
            16: { input: hexInput, err: container.querySelector('#nbc-err-hex') }
        };

        const copyBtns = [
            { btn: container.querySelector('#nbc-copy-dec'), input: decInput },
            { btn: container.querySelector('#nbc-copy-bin'), input: binInput },
            { btn: container.querySelector('#nbc-copy-oct'), input: octInput },
            { btn: container.querySelector('#nbc-copy-hex'), input: hexInput }
        ];

        function getErrorMessage(base) {
            switch (base) {
                case 2: return 'Chỉ chấp nhận các chữ số 0 và 1';
                case 8: return 'Chỉ chấp nhận các chữ số từ 0 đến 7';
                case 10: return 'Chỉ chấp nhận các chữ số từ 0 đến 9 (có thể bắt đầu bằng dấu -)';
                case 16: return 'Chỉ chấp nhận các ký tự từ 0-9 và A-F';
                default: return 'Giá trị không hợp lệ';
            }
        }

        function parseInput(str, base) {
            let clean = str.trim().replace(/\s+/g, '');
            if (!clean) return { valid: true, value: null };

            let isNegative = false;
            if (clean.startsWith('-')) {
                isNegative = true;
                clean = clean.slice(1);
            }

            // Strip prefix if present
            if (base === 2 && clean.toLowerCase().startsWith('0b')) clean = clean.slice(2);
            if (base === 8 && clean.toLowerCase().startsWith('0o')) clean = clean.slice(2);
            if (base === 16 && clean.toLowerCase().startsWith('0x')) clean = clean.slice(2);

            if (!clean) return { valid: true, value: null };

            let regex;
            switch (base) {
                case 2: regex = /^[01]+$/; break;
                case 8: regex = /^[0-7]+$/; break;
                case 10: regex = /^[0-9]+$/; break;
                case 16: regex = /^[0-9a-fA-F]+$/; break;
            }

            if (!regex.test(clean)) {
                return { valid: false, error: getErrorMessage(base) };
            }

            try {
                const prefix = isNegative ? '-' : '';
                let bigVal;
                if (base === 10) bigVal = BigInt(prefix + clean);
                else if (base === 2) bigVal = BigInt(prefix + '0b' + clean);
                else if (base === 8) bigVal = BigInt(prefix + '0o' + clean);
                else if (base === 16) bigVal = BigInt(prefix + '0x' + clean);

                return { valid: true, value: bigVal };
            } catch (e) {
                return { valid: false, error: 'Giá trị quá lớn hoặc không hợp lệ' };
            }
        }

        function handleInputChange(sourceBase) {
            const source = inputsMap[sourceBase];
            const rawText = source.input.value;

            // Reset errors for all fields
            Object.keys(inputsMap).forEach(b => {
                const item = inputsMap[b];
                item.input.style.borderColor = '';
                item.err.style.display = 'none';
                item.err.textContent = '';
            });

            const parsed = parseInput(rawText, sourceBase);

            if (!parsed.valid) {
                source.input.style.borderColor = 'var(--accent-danger)';
                source.err.style.display = 'block';
                source.err.textContent = parsed.error;
                renderBitVisualizer(null);
                return;
            }

            const bigVal = parsed.value;

            if (bigVal === null) {
                // Clear all other inputs
                Object.keys(inputsMap).forEach(b => {
                    if (parseInt(b) !== sourceBase) {
                        inputsMap[b].input.value = '';
                    }
                });
                renderBitVisualizer(null);
                return;
            }

            // Update all target fields except active input
            if (sourceBase !== 10) decInput.value = bigVal.toString(10);
            if (sourceBase !== 2) binInput.value = bigVal.toString(2);
            if (sourceBase !== 8) octInput.value = bigVal.toString(8);
            if (sourceBase !== 16) hexInput.value = bigVal.toString(16).toUpperCase();

            renderBitVisualizer(bigVal);
        }

        function renderBitVisualizer(bigVal) {
            if (bigVal === null) {
                bitContainer.innerHTML = `<span style="color: var(--text-tertiary);">Nhập số nguyên dương để xem trực quan chuỗi Bit</span>`;
                return;
            }

            if (bigVal < 0n) {
                bitContainer.innerHTML = `<span style="color: var(--accent-warning);">⚠️ Biểu diễn Bit visualizer hiện hỗ trợ các số nguyên dương</span>`;
                return;
            }

            let binStr = bigVal.toString(2);
            let targetLength = Math.max(8, Math.ceil(binStr.length / 8) * 8);
            if (targetLength > 128) {
                targetLength = binStr.length; // limit zero padding for extremely large numbers
            } else {
                binStr = binStr.padStart(targetLength, '0');
            }

            const totalBytes = Math.ceil(binStr.length / 8);
            const formattedBits = binStr.match(/.{1,4}/g) ? binStr.match(/.{1,4}/g).join(' ') : binStr;

            let html = `
                <div style="margin-bottom: var(--space-sm); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <span class="tool-badge tool-badge-info" style="font-size: 0.85rem;">${targetLength}-bit (${totalBytes} Byte${totalBytes > 1 ? 's' : ''})</span>
                    <button class="tool-copy-btn tool-btn-sm" style="position: static;" id="nbc-copy-bits-btn" data-bits="${formattedBits}">
                        📋 Copy chuỗi Bit
                    </button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; overflow-x: auto; padding-bottom: 4px;">
            `;

            for (let b = 0; b < totalBytes; b++) {
                const byteSlice = binStr.slice(b * 8, (b + 1) * 8);
                const startBitIndex = binStr.length - 1 - (b * 8);
                const byteNum = totalBytes - 1 - b;

                html += `
                    <div style="background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 8px 12px;">
                        <div style="font-size: var(--fs-xs); color: var(--text-tertiary); margin-bottom: 6px; font-family: var(--font-mono);">
                            Byte ${byteNum} (Bits b${startBitIndex} - b${Math.max(0, startBitIndex - 7)})
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; min-width: 280px;">
                            ${byteSlice.split('').map((bit, idx) => {
                                const bitNum = startBitIndex - idx;
                                const isOne = bit === '1';
                                return `
                                    <div style="text-align: center; background: ${isOne ? 'rgba(99, 102, 241, 0.25)' : 'var(--bg-tertiary)'}; border: 1px solid ${isOne ? 'var(--accent-primary)' : 'var(--border-color)'}; border-radius: 4px; padding: 4px 2px;">
                                        <div style="font-family: var(--font-mono); font-weight: 700; font-size: 0.95rem; color: ${isOne ? 'var(--accent-primary-hover)' : 'var(--text-muted)'};">${bit}</div>
                                        <div style="font-size: 0.6rem; color: var(--text-tertiary); margin-top: 2px;">b${bitNum}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }

            html += `</div>`;
            bitContainer.innerHTML = html;

            const copyBitsBtn = bitContainer.querySelector('#nbc-copy-bits-btn');
            if (copyBitsBtn) {
                copyBitsBtn.addEventListener('click', () => {
                    const text = copyBitsBtn.getAttribute('data-bits');
                    if (window.copyToClipboard) {
                        window.copyToClipboard(text, copyBitsBtn);
                    }
                });
            }
        }

        // Bind events
        Object.keys(inputsMap).forEach(b => {
            const base = parseInt(b);
            inputsMap[base].input.addEventListener('input', () => handleInputChange(base));
        });

        // Presets
        container.querySelectorAll('[data-preset]').forEach(btn => {
            btn.addEventListener('click', () => {
                decInput.value = btn.getAttribute('data-preset');
                handleInputChange(10);
            });
        });

        // Copy buttons
        copyBtns.forEach(({ btn, input }) => {
            btn.addEventListener('click', () => {
                if (!input.value) {
                    if (window.showToast) window.showToast('Không có giá trị để copy!', 'warning');
                    return;
                }
                if (window.copyToClipboard) {
                    window.copyToClipboard(input.value, btn);
                }
            });
        });

        // Clear all
        clearBtn.addEventListener('click', () => {
            Object.keys(inputsMap).forEach(b => {
                const item = inputsMap[b];
                item.input.value = '';
                item.input.style.borderColor = '';
                item.err.style.display = 'none';
            });
            renderBitVisualizer(null);
            decInput.focus();
        });
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(NumberBaseConverter);
