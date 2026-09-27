/* ============================================
   DevTools Hub - Glassmorphism Generator
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'Glassmorphism Generator',
    icon: '✨',
    category: 'Web',
    version: '0.6.0',
    description: 'Tạo hiệu ứng kính mờ (frosted glass / backdrop-filter) và CSS hiện đại',

    render(container) {
        if (!document.getElementById('glass-tool-style')) {
            const style = document.createElement('style');
            style.id = 'glass-tool-style';
            style.textContent = `
                .glass-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem; }
                @media (max-width: 900px) { .glass-layout { grid-template-columns: 1fr; } }
                .glass-preview-stage {
                    min-height: 380px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    padding: 2rem;
                    transition: background 0.3s ease;
                }
                .glass-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(10px);
                    opacity: 0.85;
                    pointer-events: none;
                    animation: glassFloat 8s ease-in-out infinite alternate;
                }
                .glass-blob-1 { width: 140px; height: 140px; background: #ec4899; top: 15%; left: 15%; }
                .glass-blob-2 { width: 160px; height: 160px; background: #6366f1; bottom: 15%; right: 15%; animation-delay: -3s; }
                .glass-blob-3 { width: 100px; height: 100px; background: #38bdf8; top: 25%; right: 25%; animation-delay: -5s; }
                @keyframes glassFloat {
                    0% { transform: translateY(0) scale(1); }
                    100% { transform: translateY(-20px) scale(1.1); }
                }
                .glass-card-target {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    max-width: 320px;
                    padding: 1.75rem;
                    color: #ffffff;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                    box-sizing: border-box;
                    transition: all 0.15s ease;
                }
                .glass-control-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.85rem; }
                .glass-control-label { font-size: var(--fs-sm); color: var(--text-secondary); min-width: 140px; }
                .glass-control-val { font-size: var(--fs-xs); font-family: monospace; color: var(--accent-primary); font-weight: 600; min-width: 48px; text-align: right; }
                .glass-range { flex: 1; accent-color: var(--accent-primary); }
                .glass-presets { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
            `;
            document.head.appendChild(style);
        }

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>✨ Glassmorphism Generator</h2>
                    <p class="tool-description">Thiết kế hiệu ứng kính mờ (Frosted Glass) hiện đại với thuộc tính CSS backdrop-filter tương thích mọi trình duyệt.</p>
                </div>
                <div class="tool-body">
                    <!-- Presets -->
                    <div class="tool-group">
                        <label class="tool-label">Mẫu thiết kế sẵn (Presets)</label>
                        <div class="glass-presets" id="glass-presets-container"></div>
                    </div>

                    <div class="glass-layout">
                        <!-- Controls Column -->
                        <div class="tool-group">
                            <label class="tool-label">Tùy chỉnh thông số kính (Controls)</label>
                            <div style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem;">
                                <!-- Blur -->
                                <div class="glass-control-row">
                                    <span class="glass-control-label">Độ mờ (Blur):</span>
                                    <input type="range" id="g-blur" class="glass-range" min="0" max="40" value="16">
                                    <span class="glass-control-val" id="val-blur">16px</span>
                                </div>

                                <!-- Opacity -->
                                <div class="glass-control-row">
                                    <span class="glass-control-label">Độ trong suốt nền:</span>
                                    <input type="range" id="g-opacity" class="glass-range" min="0" max="100" value="25">
                                    <span class="glass-control-val" id="val-opacity">25%</span>
                                </div>

                                <!-- Tint Color -->
                                <div class="glass-control-row">
                                    <span class="glass-control-label">Màu sắc kính (Tint):</span>
                                    <input type="color" id="g-color" value="#ffffff" style="border:none; width:36px; height:28px; cursor:pointer; background:none;">
                                    <span class="glass-control-val" id="val-color">#ffffff</span>
                                </div>

                                <!-- Border Width -->
                                <div class="glass-control-row">
                                    <span class="glass-control-label">Độ dày viền (Border):</span>
                                    <input type="range" id="g-border-width" class="glass-range" min="0" max="5" value="1">
                                    <span class="glass-control-val" id="val-border-width">1px</span>
                                </div>

                                <!-- Border Opacity -->
                                <div class="glass-control-row">
                                    <span class="glass-control-label">Độ sáng viền kính:</span>
                                    <input type="range" id="g-border-opacity" class="glass-range" min="0" max="100" value="35">
                                    <span class="glass-control-val" id="val-border-opacity">35%</span>
                                </div>

                                <!-- Border Radius -->
                                <div class="glass-control-row">
                                    <span class="glass-control-label">Bo góc (Radius):</span>
                                    <input type="range" id="g-radius" class="glass-range" min="0" max="36" value="16">
                                    <span class="glass-control-val" id="val-radius">16px</span>
                                </div>

                                <!-- Shadow Depth -->
                                <div class="glass-control-row">
                                    <span class="glass-control-label">Độ sâu bóng (Shadow):</span>
                                    <input type="range" id="g-shadow" class="glass-range" min="0" max="50" value="25">
                                    <span class="glass-control-val" id="val-shadow">25px</span>
                                </div>

                                <!-- Background Stage Switcher -->
                                <div style="border-top: 1px solid var(--border-color); padding-top: 0.75rem; margin-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                                    <span style="font-size: var(--fs-sm); color: var(--text-secondary);">Hình nền sân khấu:</span>
                                    <div style="display:flex; gap:0.4rem;">
                                        <button type="button" class="tool-btn tool-btn-sm" data-bg="bg-sunset">Sunset</button>
                                        <button type="button" class="tool-btn tool-btn-sm active" data-bg="bg-cyber">Cyber</button>
                                        <button type="button" class="tool-btn tool-btn-sm" data-bg="bg-ocean">Ocean</button>
                                        <button type="button" class="tool-btn tool-btn-sm" data-bg="bg-dark">Dark</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Preview & Code Column -->
                        <div class="tool-group">
                            <label class="tool-label">Xem trước trực quan (Live Preview)</label>
                            <div class="glass-preview-stage" id="glass-stage" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);">
                                <div class="glass-blob glass-blob-1"></div>
                                <div class="glass-blob glass-blob-2"></div>
                                <div class="glass-blob glass-blob-3"></div>

                                <!-- Target Glass Card -->
                                <div class="glass-card-target" id="glass-card">
                                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                                        <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">✨</div>
                                        <div>
                                            <h4 style="margin: 0; font-size: 1rem; font-weight: 700;">Glassmorphism</h4>
                                            <span style="font-size: 11px; opacity: 0.85;">Frosted Glass UI</span>
                                        </div>
                                    </div>
                                    <p style="font-size: 12px; margin: 0 0 1rem 0; opacity: 0.9; line-height: 1.5;">Hiệu ứng kính làm mờ hậu cảnh tuyệt đẹp tạo chiều sâu hiện đại cho giao diện.</p>
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 11px; font-weight: 600; opacity: 0.9;">DevTools Hub</span>
                                        <span style="background: rgba(255,255,255,0.25); font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 600;">ACTIVE</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Generated CSS Output -->
                            <div style="margin-top: 1rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                                    <label class="tool-label" style="margin: 0;">Mã CSS hoàn chỉnh:</label>
                                    <button type="button" class="tool-btn tool-btn-primary tool-btn-sm" id="btn-copy-css">📋 Copy CSS</button>
                                </div>
                                <textarea id="glass-css-output" class="tool-textarea" style="min-height: 140px; font-family: monospace; font-size: 13px;" readonly></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const stage = container.querySelector('#glass-stage');
        const card = container.querySelector('#glass-card');
        const cssOutput = container.querySelector('#glass-css-output');
        const copyBtn = container.querySelector('#btn-copy-css');
        const presetsContainer = container.querySelector('#glass-presets-container');

        const inBlur = container.querySelector('#g-blur');
        const inOpacity = container.querySelector('#g-opacity');
        const inColor = container.querySelector('#g-color');
        const inBorderWidth = container.querySelector('#g-border-width');
        const inBorderOpacity = container.querySelector('#g-border-opacity');
        const inRadius = container.querySelector('#g-radius');
        const inShadow = container.querySelector('#g-shadow');

        const valBlur = container.querySelector('#val-blur');
        const valOpacity = container.querySelector('#val-opacity');
        const valColor = container.querySelector('#val-color');
        const valBorderWidth = container.querySelector('#val-border-width');
        const valBorderOpacity = container.querySelector('#val-border-opacity');
        const valRadius = container.querySelector('#val-radius');
        const valShadow = container.querySelector('#val-shadow');

        const presets = [
            { name: 'Soft Frosted (Mềm mại)', blur: 16, opacity: 25, color: '#ffffff', bWidth: 1, bOpacity: 35, radius: 16, shadow: 25 },
            { name: 'Dark Obsidian (Kính đen)', blur: 20, opacity: 40, color: '#0f172a', bWidth: 1, bOpacity: 20, radius: 16, shadow: 30 },
            { name: 'Cyber Neon (Tím Neon)', blur: 14, opacity: 30, color: '#8b5cf6', bWidth: 2, bOpacity: 50, radius: 20, shadow: 30 },
            { name: 'Crystal Clear (Sắc nét)', blur: 8, opacity: 15, color: '#ffffff', bWidth: 1, bOpacity: 45, radius: 12, shadow: 15 },
            { name: 'Heavy Frost (Mờ sâu)', blur: 32, opacity: 45, color: '#ffffff', bWidth: 1, bOpacity: 30, radius: 24, shadow: 35 }
        ];

        presets.forEach(p => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'tool-btn tool-btn-sm';
            btn.textContent = p.name;
            btn.addEventListener('click', () => {
                inBlur.value = p.blur;
                inOpacity.value = p.opacity;
                inColor.value = p.color;
                inBorderWidth.value = p.bWidth;
                inBorderOpacity.value = p.bOpacity;
                inRadius.value = p.radius;
                inShadow.value = p.shadow;
                updateGlass();
            });
            presetsContainer.appendChild(btn);
        });

        function hexToRgb(hex) {
            let c = hex.replace(/^#/, '');
            if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
            const num = parseInt(c, 16);
            return {
                r: (num >> 16) & 255,
                g: (num >> 8) & 255,
                b: num & 255
            };
        }

        function updateGlass() {
            const blur = parseInt(inBlur.value, 10);
            const opacity = (parseInt(inOpacity.value, 10) / 100).toFixed(2);
            const colorHex = inColor.value;
            const rgb = hexToRgb(colorHex);
            const bWidth = parseInt(inBorderWidth.value, 10);
            const bOpacity = (parseInt(inBorderOpacity.value, 10) / 100).toFixed(2);
            const radius = parseInt(inRadius.value, 10);
            const shadow = parseInt(inShadow.value, 10);
            const shadowOpacity = (shadow / 100 * 0.4).toFixed(2);

            // Update label indicators
            valBlur.textContent = `${blur}px`;
            valOpacity.textContent = `${inOpacity.value}%`;
            valColor.textContent = colorHex;
            valBorderWidth.textContent = `${bWidth}px`;
            valBorderOpacity.textContent = `${inBorderOpacity.value}%`;
            valRadius.textContent = `${radius}px`;
            valShadow.textContent = `${shadow}px`;

            // Styles
            const bgRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            const borderRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bOpacity})`;
            const borderStyle = bWidth > 0 ? `${bWidth}px solid ${borderRgba}` : 'none';
            const shadowStyle = shadow > 0 ? `0 ${Math.round(shadow / 2)}px ${shadow}px 0 rgba(0, 0, 0, ${shadowOpacity})` : 'none';

            // Apply to live card
            card.style.background = bgRgba;
            card.style.backdropFilter = `blur(${blur}px)`;
            card.style.webkitBackdropFilter = `blur(${blur}px)`;
            card.style.border = borderStyle;
            card.style.borderRadius = `${radius}px`;
            card.style.boxShadow = shadowStyle;

            // Generate CSS code
            const css = `.glass-card {
    background: ${bgRgba};
    backdrop-filter: blur(${blur}px);
    -webkit-backdrop-filter: blur(${blur}px);
    border-radius: ${radius}px;
    border: ${borderStyle};
    box-shadow: ${shadowStyle};
}`;
            cssOutput.value = css;
        }

        // Event listeners for sliders
        [inBlur, inOpacity, inColor, inBorderWidth, inBorderOpacity, inRadius, inShadow].forEach(input => {
            input.addEventListener('input', updateGlass);
        });

        // Stage backgrounds
        const stageBgs = {
            'bg-sunset': 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
            'bg-cyber': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%)',
            'bg-ocean': 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)',
            'bg-dark': 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
        };

        container.querySelectorAll('[data-bg]').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('[data-bg]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                stage.style.background = stageBgs[btn.dataset.bg];
            });
        });

        // Copy button
        copyBtn.addEventListener('click', () => {
            if (!cssOutput.value.trim()) return;
            if (window.copyToClipboard) {
                window.copyToClipboard(cssOutput.value, copyBtn);
            } else {
                navigator.clipboard.writeText(cssOutput.value);
            }
        });

        // Initialize
        updateGlass();
    }
});
