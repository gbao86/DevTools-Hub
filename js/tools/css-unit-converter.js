/**
 * CSS Unit Converter Tool Module
 * DevTools Hub
 */
const CSSUnitConverter = {
    name: 'CSS Unit Converter',
    icon: '📐',
    category: 'Converter',
    description: 'Chuyển đổi giữa các đơn vị CSS: px, rem, em, %, vw, vh',

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>📐 CSS Unit Converter</h2>
                    <p class="tool-description">Chuyển đổi tức thì giữa các đơn vị CSS phổ biến: px, rem, em, %, vw, vh, pt</p>
                </div>
                <div class="tool-body">
                    <div class="tool-row" style="flex-wrap: wrap;">
                        <div class="tool-col" style="flex: 2; min-width: 240px;">
                            <div class="tool-group">
                                <label class="tool-label">Giá trị & Đơn vị nguồn</label>
                                <div style="display: flex; gap: 8px;">
                                    <input type="number" class="tool-input" id="cuc-value" value="16" step="any" placeholder="Nhập giá trị...">
                                    <select class="tool-select" id="cuc-from-unit" style="min-width: 120px;">
                                        <option value="px" selected>px (Pixels)</option>
                                        <option value="rem">rem (Root EM)</option>
                                        <option value="em">em (Element EM)</option>
                                        <option value="%">% (Percent)</option>
                                        <option value="vw">vw (Viewport Width)</option>
                                        <option value="vh">vh (Viewport Height)</option>
                                        <option value="pt">pt (Points)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="tool-col" style="flex: 1; min-width: 140px;">
                            <div class="tool-group">
                                <label class="tool-label">Base Font Size (px)</label>
                                <input type="number" class="tool-input" id="cuc-base-size" value="16" min="1" step="any">
                            </div>
                        </div>

                        <div class="tool-col" style="flex: 1; min-width: 140px;">
                            <div class="tool-group">
                                <label class="tool-label">Viewport Width (px)</label>
                                <input type="number" class="tool-input" id="cuc-vp-width" value="1920" min="1" step="any">
                            </div>
                        </div>

                        <div class="tool-col" style="flex: 1; min-width: 140px;">
                            <div class="tool-group">
                                <label class="tool-label">Viewport Height (px)</label>
                                <input type="number" class="tool-input" id="cuc-vp-height" value="1080" min="1" step="any">
                            </div>
                        </div>
                    </div>

                    <div class="tool-group" style="margin-top: var(--space-md);">
                        <label class="tool-label">Kết quả chuyển đổi</label>
                        <div class="tool-stats" id="cuc-results-grid" style="grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));">
                            <!-- Cards will be populated dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inputs
        const valInput = container.querySelector('#cuc-value');
        const unitSelect = container.querySelector('#cuc-from-unit');
        const baseSizeInput = container.querySelector('#cuc-base-size');
        const vpWidthInput = container.querySelector('#cuc-vp-width');
        const vpHeightInput = container.querySelector('#cuc-vp-height');
        const resultsGrid = container.querySelector('#cuc-results-grid');

        const UNITS_DEF = [
            { id: 'px', name: 'Pixels', symbol: 'px', desc: 'Đơn vị pixel cơ bản' },
            { id: 'rem', name: 'Root EM', symbol: 'rem', desc: 'Tương quan với root font-size' },
            { id: 'em', name: 'Parent EM', symbol: 'em', desc: 'Tương quan với font-size phần tử cha' },
            { id: '%', name: 'Percentage', symbol: '%', desc: 'Phần trăm tương quan base font' },
            { id: 'vw', name: 'Viewport Width', symbol: 'vw', desc: '1% chiều rộng màn hình' },
            { id: 'vh', name: 'Viewport Height', symbol: 'vh', desc: '1% chiều cao màn hình' },
            { id: 'pt', name: 'Points', symbol: 'pt', desc: '1pt = 1/72 inch = 1.333px' }
        ];

        function formatNum(num) {
            if (isNaN(num) || !isFinite(num)) return '0';
            if (Math.abs(num - Math.round(num)) < 1e-9) {
                return Math.round(num).toString();
            }
            // Max 4 decimal places without trailing zeros
            return parseFloat(num.toFixed(4)).toString();
        }

        function calculate() {
            const val = parseFloat(valInput.value);
            const fromUnit = unitSelect.value;
            const baseSize = parseFloat(baseSizeInput.value) || 16;
            const vpWidth = parseFloat(vpWidthInput.value) || 1920;
            const vpHeight = parseFloat(vpHeightInput.value) || 1080;

            if (isNaN(val)) {
                resultsGrid.innerHTML = UNITS_DEF.map(unit => `
                    <div class="tool-stat" style="text-align: left; padding: var(--space-md);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${unit.symbol} (${unit.name})</span>
                        </div>
                        <div class="tool-stat-value" style="font-size: 1.3rem;">-</div>
                        <div class="tool-stat-label" style="margin-top: 4px;">${unit.desc}</div>
                    </div>
                `).join('');
                return;
            }

            // Step 1: Convert from source unit to PX
            let pxVal = 0;
            switch (fromUnit) {
                case 'px':
                    pxVal = val;
                    break;
                case 'rem':
                    pxVal = val * baseSize;
                    break;
                case 'em':
                    pxVal = val * baseSize;
                    break;
                case '%':
                    pxVal = val * (baseSize / 100);
                    break;
                case 'vw':
                    pxVal = val * (vpWidth / 100);
                    break;
                case 'vh':
                    pxVal = val * (vpHeight / 100);
                    break;
                case 'pt':
                    pxVal = val * (4 / 3);
                    break;
            }

            // Step 2: Convert PX to target units
            const results = {};
            results['px'] = pxVal;
            results['rem'] = pxVal / baseSize;
            results['em'] = pxVal / baseSize;
            results['%'] = (pxVal / baseSize) * 100;
            results['vw'] = (pxVal / vpWidth) * 100;
            results['vh'] = (pxVal / vpHeight) * 100;
            results['pt'] = pxVal * 0.75;

            // Render output cards
            resultsGrid.innerHTML = UNITS_DEF.map(unit => {
                const targetVal = results[unit.id];
                const formattedVal = formatNum(targetVal);
                const fullOutput = `${formattedVal}${unit.symbol}`;
                const isSelected = unit.id === fromUnit;

                return `
                    <div class="tool-stat" style="position: relative; text-align: left; padding: var(--space-md); ${isSelected ? 'border-color: var(--accent-primary); background: rgba(99, 102, 241, 0.08);' : ''}">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-weight: 600; color: ${isSelected ? 'var(--accent-primary-hover)' : 'var(--text-primary)'}; font-size: 0.9rem;">
                                ${unit.symbol} <span style="font-size: 0.75rem; color: var(--text-tertiary); font-weight: normal;">(${unit.name})</span>
                            </span>
                            <button class="tool-copy-btn tool-btn-sm" style="position: static;" data-copy="${fullOutput}" title="Copy ${fullOutput}">📋</button>
                        </div>
                        <div class="tool-stat-value" style="font-size: 1.4rem; word-break: break-all;">
                            ${formattedVal}<span style="font-size: 0.9rem; color: var(--text-secondary); margin-left: 2px;">${unit.symbol}</span>
                        </div>
                        <div class="tool-stat-label" style="margin-top: 6px; font-size: 0.75rem;">${unit.desc}</div>
                    </div>
                `;
            }).join('');

            // Attach copy events
            resultsGrid.querySelectorAll('[data-copy]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const text = btn.getAttribute('data-copy');
                    if (window.copyToClipboard) {
                        window.copyToClipboard(text, btn);
                    }
                });
            });
        }

        // Attach listeners for auto-recalculate
        [valInput, unitSelect, baseSizeInput, vpWidthInput, vpHeightInput].forEach(elem => {
            elem.addEventListener('input', calculate);
            elem.addEventListener('change', calculate);
        });

        // Initial calculation
        calculate();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(CSSUnitConverter);
