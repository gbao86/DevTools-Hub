/* ============================================
   DevTools Hub - Color Picker & Converter Tool
   ============================================ */

const ColorPicker = {
    name: 'Color Picker',
    icon: '🎨',
    category: 'Converter',
    description: 'Chọn màu và chuyển đổi giữa HEX, RGB, HSL',

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🎨 Color Picker & Converter</h2>
                    <p class="tool-description">Chọn màu và chuyển đổi giữa HEX, RGB, RGBA, HSL, HSLA</p>
                </div>

                <div class="tool-body">
                    <!-- Color Selection Controls -->
                    <div class="tool-row" style="align-items: center; gap: var(--space-lg); flex-wrap: wrap;">
                        <div class="tool-inline" style="gap: var(--space-md);">
                            <div class="color-swatch" id="color-preview-swatch" style="background-color: #6366f1; width: 64px; height: 64px; border-radius: var(--radius-md); box-shadow: var(--shadow-md);"></div>
                            <div class="tool-group">
                                <label class="tool-label">Chọn màu (Picker)</label>
                                <input type="color" id="color-native-picker" class="tool-input" value="#6366f1" style="width: 60px; height: 44px; padding: 2px; cursor: pointer;">
                            </div>
                        </div>

                        <div class="tool-col" style="min-width: 260px;">
                            <div class="tool-group">
                                <label class="tool-label">Nhập màu thủ công (Auto-detect format)</label>
                                <input type="text" id="color-manual-input" class="tool-input" value="#6366f1" placeholder="Ví dụ: #6366f1, rgb(99,102,241), hsl(239,84%,67%), red..." style="font-family: var(--font-mono);">
                            </div>
                        </div>

                        <div class="tool-group" style="min-width: 180px;">
                            <label class="tool-label">Độ trong suốt (Alpha: <span id="alpha-val-text">100%</span>)</label>
                            <input type="range" id="color-alpha-range" min="0" max="100" value="100" style="width: 100%; accent-color: var(--accent-primary); cursor: pointer;">
                        </div>
                    </div>

                    <!-- Quick Preset Palette -->
                    <div class="tool-group">
                        <label class="tool-label">⚡ Bảng màu gợi ý nhanh</label>
                        <div class="tool-actions" id="color-presets">
                            <button class="tool-btn tool-btn-sm" data-color="#6366f1"><span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#6366f1;"></span> Indigo</button>
                            <button class="tool-btn tool-btn-sm" data-color="#06b6d4"><span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#06b6d4;"></span> Cyan</button>
                            <button class="tool-btn tool-btn-sm" data-color="#10b981"><span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#10b981;"></span> Emerald</button>
                            <button class="tool-btn tool-btn-sm" data-color="#f59e0b"><span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#f59e0b;"></span> Amber</button>
                            <button class="tool-btn tool-btn-sm" data-color="#ef4444"><span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#ef4444;"></span> Rose</button>
                            <button class="tool-btn tool-btn-sm" data-color="#8b5cf6"><span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#8b5cf6;"></span> Purple</button>
                            <button class="tool-btn tool-btn-sm" data-color="#1e293b"><span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#1e293b;"></span> Slate</button>
                            <button class="tool-btn tool-btn-sm" data-color="#ffffff"><span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:#ffffff; border:1px solid #ccc;"></span> White</button>
                        </div>
                    </div>

                    <!-- Color Conversion Output Grid -->
                    <div class="tool-group">
                        <label class="tool-label">Các định dạng màu chuyển đổi</label>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-md);">

                            <div class="tool-group">
                                <label class="tool-label">HEX</label>
                                <div class="tool-result">
                                    <input type="text" class="tool-input" id="fmt-hex" readonly style="font-family: var(--font-mono);">
                                    <button class="tool-copy-btn" id="btn-copy-hex" title="Copy HEX">📋</button>
                                </div>
                            </div>

                            <div class="tool-group">
                                <label class="tool-label">HEX (8-digit / Alpha)</label>
                                <div class="tool-result">
                                    <input type="text" class="tool-input" id="fmt-hex8" readonly style="font-family: var(--font-mono);">
                                    <button class="tool-copy-btn" id="btn-copy-hex8" title="Copy HEX8">📋</button>
                                </div>
                            </div>

                            <div class="tool-group">
                                <label class="tool-label">RGB</label>
                                <div class="tool-result">
                                    <input type="text" class="tool-input" id="fmt-rgb" readonly style="font-family: var(--font-mono);">
                                    <button class="tool-copy-btn" id="btn-copy-rgb" title="Copy RGB">📋</button>
                                </div>
                            </div>

                            <div class="tool-group">
                                <label class="tool-label">RGBA</label>
                                <div class="tool-result">
                                    <input type="text" class="tool-input" id="fmt-rgba" readonly style="font-family: var(--font-mono);">
                                    <button class="tool-copy-btn" id="btn-copy-rgba" title="Copy RGBA">📋</button>
                                </div>
                            </div>

                            <div class="tool-group">
                                <label class="tool-label">HSL</label>
                                <div class="tool-result">
                                    <input type="text" class="tool-input" id="fmt-hsl" readonly style="font-family: var(--font-mono);">
                                    <button class="tool-copy-btn" id="btn-copy-hsl" title="Copy HSL">📋</button>
                                </div>
                            </div>

                            <div class="tool-group">
                                <label class="tool-label">HSLA</label>
                                <div class="tool-result">
                                    <input type="text" class="tool-input" id="fmt-hsla" readonly style="font-family: var(--font-mono);">
                                    <button class="tool-copy-btn" id="btn-copy-hsla" title="Copy HSLA">📋</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- CSS Variable Output -->
                    <div class="tool-group">
                        <label class="tool-label">Mã Biến CSS (CSS Variables)</label>
                        <div class="tool-row" style="align-items: center; gap: var(--space-md); margin-bottom: var(--space-xs);">
                            <span style="font-size: var(--fs-sm); color: var(--text-tertiary);">Tên biến:</span>
                            <input type="text" id="css-var-name-input" class="tool-input" value="--color-primary" style="max-width: 220px; font-family: var(--font-mono);">
                        </div>
                        <div class="tool-result">
                            <textarea class="tool-textarea" id="css-var-output" readonly rows="3" style="font-family: var(--font-mono); font-size: var(--fs-sm);"></textarea>
                            <button class="tool-copy-btn" id="btn-copy-css-vars" title="Copy CSS Variables">📋</button>
                        </div>
                    </div>

                    <!-- WCAG Contrast Checker -->
                    <div class="tool-group">
                        <label class="tool-label">Kiểm tra độ tương phản (WCAG 2.1 Contrast Checker)</label>

                        <div class="tool-split">
                            <!-- White Text Card -->
                            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm);">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-weight: 600; font-size: var(--fs-sm);">Chữ Trắng (#FFFFFF)</span>
                                    <span id="contrast-val-white" style="font-family: var(--font-mono); font-weight: 700; font-size: var(--fs-md); color: var(--accent-primary-hover);">21.0:1</span>
                                </div>
                                <div id="preview-white-box" style="padding: var(--space-md); border-radius: var(--radius-sm); text-align: center; font-weight: 600; font-size: var(--fs-md); color: #ffffff; transition: background var(--transition-fast);">
                                    Sample Text Preview
                                </div>
                                <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap;">
                                    <span id="badge-white-aa-normal" class="tool-badge tool-badge-success">AA Normal</span>
                                    <span id="badge-white-aaa-normal" class="tool-badge tool-badge-success">AAA Normal</span>
                                    <span id="badge-white-aa-large" class="tool-badge tool-badge-success">AA Large</span>
                                </div>
                            </div>

                            <!-- Black Text Card -->
                            <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm);">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-weight: 600; font-size: var(--fs-sm);">Chữ Đen (#000000)</span>
                                    <span id="contrast-val-black" style="font-family: var(--font-mono); font-weight: 700; font-size: var(--fs-md); color: var(--accent-primary-hover);">1.0:1</span>
                                </div>
                                <div id="preview-black-box" style="padding: var(--space-md); border-radius: var(--radius-sm); text-align: center; font-weight: 600; font-size: var(--fs-md); color: #000000; transition: background var(--transition-fast);">
                                    Sample Text Preview
                                </div>
                                <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap;">
                                    <span id="badge-black-aa-normal" class="tool-badge tool-badge-danger">AA Normal</span>
                                    <span id="badge-black-aaa-normal" class="tool-badge tool-badge-danger">AAA Normal</span>
                                    <span id="badge-black-aa-large" class="tool-badge tool-badge-danger">AA Large</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;

        // DOM elements
        const previewSwatch = container.querySelector('#color-preview-swatch');
        const nativePicker = container.querySelector('#color-native-picker');
        const manualInput = container.querySelector('#color-manual-input');
        const alphaRange = container.querySelector('#color-alpha-range');
        const alphaText = container.querySelector('#alpha-val-text');
        const presetsContainer = container.querySelector('#color-presets');

        const fmtHex = container.querySelector('#fmt-hex');
        const fmtHex8 = container.querySelector('#fmt-hex8');
        const fmtRgb = container.querySelector('#fmt-rgb');
        const fmtRgba = container.querySelector('#fmt-rgba');
        const fmtHsl = container.querySelector('#fmt-hsl');
        const fmtHsla = container.querySelector('#fmt-hsla');

        const cssVarNameInput = container.querySelector('#css-var-name-input');
        const cssVarOutput = container.querySelector('#css-var-output');

        const contrastValWhite = container.querySelector('#contrast-val-white');
        const contrastValBlack = container.querySelector('#contrast-val-black');
        const previewWhiteBox = container.querySelector('#preview-white-box');
        const previewBlackBox = container.querySelector('#preview-black-box');

        const badgeWhiteAaNormal = container.querySelector('#badge-white-aa-normal');
        const badgeWhiteAaaNormal = container.querySelector('#badge-white-aaa-normal');
        const badgeWhiteAaLarge = container.querySelector('#badge-white-aa-large');

        const badgeBlackAaNormal = container.querySelector('#badge-black-aa-normal');
        const badgeBlackAaaNormal = container.querySelector('#badge-black-aaa-normal');
        const badgeBlackAaLarge = container.querySelector('#badge-black-aa-large');

        // Current color state: { r: 0-255, g: 0-255, b: 0-255, a: 0-1 }
        let currentColor = { r: 99, g: 102, b: 241, a: 1.0 };

        // --- Math & Color Utilities ---

        // Convert RGB to HSL
        function rgbToHsl(r, g, b) {
            const rNorm = r / 255;
            const gNorm = g / 255;
            const bNorm = b / 255;

            const max = Math.max(rNorm, gNorm, bNorm);
            const min = Math.min(rNorm, gNorm, bNorm);
            let h = 0, s = 0, l = (max + min) / 2;

            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
                    case gNorm: h = (bNorm - rNorm) / d + 2; break;
                    case bNorm: h = (rNorm - gNorm) / d + 4; break;
                }
                h /= 6;
            }

            return {
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                l: Math.round(l * 100)
            };
        }

        // Convert HSL to RGB
        function hslToRgb(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            let r, g, b;

            if (s === 0) {
                r = g = b = l; // achromatic
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };

                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }

        // Parse any string to RGBA object or null
        function parseColorString(str) {
            if (!str) return null;
            str = str.trim().toLowerCase();

            // 1. Hex 3, 4, 6, 8 digits
            if (str.startsWith('#')) {
                const hex = str.slice(1);
                if (hex.length === 3) {
                    const r = parseInt(hex[0] + hex[0], 16);
                    const g = parseInt(hex[1] + hex[1], 16);
                    const b = parseInt(hex[2] + hex[2], 16);
                    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b, a: 1.0 };
                } else if (hex.length === 4) {
                    const r = parseInt(hex[0] + hex[0], 16);
                    const g = parseInt(hex[1] + hex[1], 16);
                    const b = parseInt(hex[2] + hex[2], 16);
                    const a = parseInt(hex[3] + hex[3], 16) / 255;
                    if (!isNaN(r) && !isNaN(g) && !isNaN(b) && !isNaN(a)) return { r, g, b, a: parseFloat(a.toFixed(2)) };
                } else if (hex.length === 6) {
                    const r = parseInt(hex.slice(0, 2), 16);
                    const g = parseInt(hex.slice(2, 4), 16);
                    const b = parseInt(hex.slice(4, 6), 16);
                    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b, a: 1.0 };
                } else if (hex.length === 8) {
                    const r = parseInt(hex.slice(0, 2), 16);
                    const g = parseInt(hex.slice(2, 4), 16);
                    const b = parseInt(hex.slice(4, 6), 16);
                    const a = parseInt(hex.slice(6, 8), 16) / 255;
                    if (!isNaN(r) && !isNaN(g) && !isNaN(b) && !isNaN(a)) return { r, g, b, a: parseFloat(a.toFixed(2)) };
                }
            }

            // 2. RGB / RGBA: rgb(99, 102, 241) or rgba(99, 102, 241, 0.8)
            const rgbaMatch = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d.]+)\s*)?\)$/);
            if (rgbaMatch) {
                const r = Math.min(255, parseInt(rgbaMatch[1], 10));
                const g = Math.min(255, parseInt(rgbaMatch[2], 10));
                const b = Math.min(255, parseInt(rgbaMatch[3], 10));
                const a = rgbaMatch[4] !== undefined ? Math.min(1, parseFloat(rgbaMatch[4])) : 1.0;
                return { r, g, b, a: parseFloat(a.toFixed(2)) };
            }

            // 3. HSL / HSLA: hsl(239, 84%, 67%) or hsla(239, 84%, 67%, 0.8)
            const hslaMatch = str.match(/^hsla?\(\s*(\d{1,3})(?:deg)?\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*(?:,\s*([\d.]+)\s*)?\)$/);
            if (hslaMatch) {
                const h = parseInt(hslaMatch[1], 10) % 360;
                const s = Math.min(100, parseInt(hslaMatch[2], 10));
                const l = Math.min(100, parseInt(hslaMatch[3], 10));
                const a = hslaMatch[4] !== undefined ? Math.min(1, parseFloat(hslaMatch[4])) : 1.0;
                const rgb = hslToRgb(h, s, l);
                return { r: rgb.r, g: rgb.g, b: rgb.b, a: parseFloat(a.toFixed(2)) };
            }

            // 4. CSS Named Color Fallback via Canvas
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#000000'; // reset
                ctx.fillStyle = str;
                if (ctx.fillStyle !== '#000000' || str === 'black' || str === '#000' || str === '#000000') {
                    ctx.fillRect(0, 0, 1, 1);
                    const data = ctx.getImageData(0, 0, 1, 1).data;
                    return { r: data[0], g: data[1], b: data[2], a: 1.0 };
                }
            } catch (e) {
                // Ignore canvas errors
            }

            return null;
        }

        // Relative Luminance calculation for WCAG
        function getLuminance(r, g, b) {
            const a = [r, g, b].map(v => {
                v /= 255;
                return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        // Calculate Contrast Ratio
        function getContrastRatio(lum1, lum2) {
            const l1 = Math.max(lum1, lum2);
            const l2 = Math.min(lum1, lum2);
            return (l1 + 0.05) / (l2 + 0.05);
        }

        // --- Main Update Function ---
        function updateUI(source = 'all') {
            const { r, g, b, a } = currentColor;

            // Hex formats
            const hex6 = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
            const hex8 = `${hex6}${alphaHex}`;

            // HSL formats
            const { h, s, l } = rgbToHsl(r, g, b);

            // Update inputs if source allows
            if (source !== 'native') nativePicker.value = hex6;
            if (source !== 'manual') manualInput.value = a < 1 ? hex8 : hex6;
            if (source !== 'alpha') {
                alphaRange.value = Math.round(a * 100);
            }
            alphaText.textContent = `${Math.round(a * 100)}%`;

            // Swatch Preview
            const colorRgbaStr = `rgba(${r}, ${g}, ${b}, ${a})`;
            previewSwatch.style.backgroundColor = colorRgbaStr;

            // Formats Output
            fmtHex.value = hex6.toUpperCase();
            fmtHex8.value = hex8.toUpperCase();
            fmtRgb.value = `rgb(${r}, ${g}, ${b})`;
            fmtRgba.value = `rgba(${r}, ${g}, ${b}, ${a})`;
            fmtHsl.value = `hsl(${h}, ${s}%, ${l}%)`;
            fmtHsla.value = `hsla(${h}, ${s}%, ${l}%, ${a})`;

            // CSS Variables Output
            const varName = (cssVarNameInput.value.trim() || '--color-primary');
            cssVarOutput.value = `${varName}: ${colorRgbaStr};\n${varName}-rgb: ${r}, ${g}, ${b};\n${varName}-hsl: ${h}, ${s}%, ${l}%;`;

            // WCAG Contrast Checker
            // Blend RGBA over dark app bg #0a0e17 for luminance check if alpha < 1
            const rBlended = Math.round(r * a + 10 * (1 - a));
            const gBlended = Math.round(g * a + 14 * (1 - a));
            const bBlended = Math.round(b * a + 23 * (1 - a));

            const bgLuminance = getLuminance(rBlended, gBlended, bBlended);
            const whiteLuminance = 1.0;
            const blackLuminance = 0.0;

            const contrastWhite = getContrastRatio(whiteLuminance, bgLuminance);
            const contrastBlack = getContrastRatio(blackLuminance, bgLuminance);

            contrastValWhite.textContent = `${contrastWhite.toFixed(1)}:1`;
            contrastValBlack.textContent = `${contrastBlack.toFixed(1)}:1`;

            previewWhiteBox.style.backgroundColor = colorRgbaStr;
            previewBlackBox.style.backgroundColor = colorRgbaStr;

            // Update Badges
            updateBadge(badgeWhiteAaNormal, contrastWhite >= 4.5, 'AA Normal');
            updateBadge(badgeWhiteAaaNormal, contrastWhite >= 7.0, 'AAA Normal');
            updateBadge(badgeWhiteAaLarge, contrastWhite >= 3.0, 'AA Large');

            updateBadge(badgeBlackAaNormal, contrastBlack >= 4.5, 'AA Normal');
            updateBadge(badgeBlackAaaNormal, contrastBlack >= 7.0, 'AAA Normal');
            updateBadge(badgeBlackAaLarge, contrastBlack >= 3.0, 'AA Large');
        }

        function updateBadge(badgeEl, isPass, label) {
            badgeEl.textContent = `${label}: ${isPass ? 'PASS' : 'FAIL'}`;
            badgeEl.className = `tool-badge ${isPass ? 'tool-badge-success' : 'tool-badge-danger'}`;
        }

        // --- Event Listeners ---

        // Native Color Picker Input
        nativePicker.addEventListener('input', (e) => {
            const parsed = parseColorString(e.target.value);
            if (parsed) {
                currentColor.r = parsed.r;
                currentColor.g = parsed.g;
                currentColor.b = parsed.b;
                updateUI('native');
            }
        });

        // Manual String Input
        manualInput.addEventListener('input', (e) => {
            const parsed = parseColorString(e.target.value);
            if (parsed) {
                currentColor = parsed;
                manualInput.style.borderColor = 'var(--border-focus)';
                updateUI('manual');
            } else {
                manualInput.style.borderColor = 'var(--accent-danger)';
            }
        });

        // Alpha Slider Input
        alphaRange.addEventListener('input', (e) => {
            currentColor.a = parseFloat((parseInt(e.target.value, 10) / 100).toFixed(2));
            updateUI('alpha');
        });

        // CSS Variable Name Input
        cssVarNameInput.addEventListener('input', () => updateUI('cssvar'));

        // Preset Colors Click
        presetsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-color]');
            if (!btn) return;
            const parsed = parseColorString(btn.dataset.color);
            if (parsed) {
                currentColor = parsed;
                updateUI('all');
                if (window.showToast) {
                    window.showToast(`Đã chọn màu: ${btn.textContent.trim()}`, 'success');
                }
            }
        });

        // Copy Buttons Binding
        const copyBindings = [
            { btn: container.querySelector('#btn-copy-hex'), target: fmtHex },
            { btn: container.querySelector('#btn-copy-hex8'), target: fmtHex8 },
            { btn: container.querySelector('#btn-copy-rgb'), target: fmtRgb },
            { btn: container.querySelector('#btn-copy-rgba'), target: fmtRgba },
            { btn: container.querySelector('#btn-copy-hsl'), target: fmtHsl },
            { btn: container.querySelector('#btn-copy-hsla'), target: fmtHsla },
            { btn: container.querySelector('#btn-copy-css-vars'), target: cssVarOutput }
        ];

        copyBindings.forEach(item => {
            if (item.btn && item.target) {
                item.btn.addEventListener('click', () => {
                    if (window.copyToClipboard) {
                        window.copyToClipboard(item.target.value, item.btn);
                    }
                });
            }
        });

        // Initial render
        updateUI('all');
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(ColorPicker);
