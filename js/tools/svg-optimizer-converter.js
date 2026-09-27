/* ============================================
   DevTools Hub - SVG Optimizer & Converter
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'SVG Optimizer & Converter',
    icon: '🎨',
    category: 'Converter',
    description: 'Tối ưu, làm sạch mã SVG và chuyển đổi sang React JSX, CSS Background, Data URI',

    render(container) {
        if (!document.getElementById('svg-tool-style')) {
            const style = document.createElement('style');
            style.id = 'svg-tool-style';
            style.textContent = `
                .svg-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem; }
                @media (max-width: 900px) { .svg-layout { grid-template-columns: 1fr; } }
                .svg-preview-box { border: 1px solid var(--border-color); border-radius: 8px; min-height: 240px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; margin-bottom: 1rem; transition: background 0.2s ease; }
                .svg-preview-box svg { max-width: 80%; max-height: 200px; display: block; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); }
                .svg-preview-box.bg-grid {
                    background-color: var(--bg-tertiary);
                    background-image: linear-gradient(45deg, rgba(128,128,128,0.15) 25%, transparent 25%),
                                      linear-gradient(-45deg, rgba(128,128,128,0.15) 25%, transparent 25%),
                                      linear-gradient(45deg, transparent 75%, rgba(128,128,128,0.15) 75%),
                                      linear-gradient(-45deg, transparent 75%, rgba(128,128,128,0.15) 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                }
                .svg-preview-box.bg-dark { background: #0f172a; }
                .svg-preview-box.bg-light { background: #ffffff; }
                .svg-preview-box.bg-gradient { background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); }
                .svg-stats-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; background: var(--bg-secondary); padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1rem; font-size: var(--fs-sm); }
                .svg-badge-saved { background: rgba(16, 185, 129, 0.15); color: var(--accent-success); border: 1px solid rgba(16, 185, 129, 0.3); padding: 2px 8px; border-radius: 12px; font-weight: 600; font-size: 12px; }
                .svg-tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1rem; overflow-x: auto; }
                .svg-tab-btn { background: none; border: none; padding: 0.5rem 1rem; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; font-weight: 500; font-size: var(--fs-sm); white-space: nowrap; }
                .svg-tab-btn:hover { color: var(--text-primary); }
                .svg-tab-btn.active { color: var(--accent-primary); border-bottom-color: var(--accent-primary); }
                .svg-opt-row { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; }
                .svg-opt-item { display: flex; align-items: center; gap: 0.4rem; font-size: var(--fs-sm); color: var(--text-secondary); cursor: pointer; }
                .svg-opt-item input { accent-color: var(--accent-primary); }
            `;
            document.head.appendChild(style);
        }

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🎨 SVG Optimizer & Converter</h2>
                    <p class="tool-description">Tối ưu dung lượng, làm sạch thẻ rác và chuyển đổi mã SVG sang React JSX, CSS Background hoặc Data URI.</p>
                </div>
                <div class="tool-body">
                    <div class="tool-actions" style="margin-bottom: 1rem; justify-content: space-between; flex-wrap: wrap;">
                        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                            <label class="tool-btn tool-btn-primary" style="cursor:pointer; margin:0;">
                                📁 Chọn file SVG
                                <input type="file" id="svg-file-in" accept=".svg,image/svg+xml" style="display:none;">
                            </label>
                            <button type="button" class="tool-btn" id="svg-btn-sample">✨ Mẫu SVG</button>
                            <button type="button" class="tool-btn tool-btn-danger" id="svg-btn-clear">Xóa</button>
                        </div>
                        <div style="display:flex; gap:0.5rem; align-items:center;">
                            <span style="font-size:var(--fs-sm); color:var(--text-secondary);">Nền xem trước:</span>
                            <button type="button" class="tool-btn tool-btn-sm active" data-bg="bg-grid" id="svg-bg-grid" title="Nền bàn cờ">Grid</button>
                            <button type="button" class="tool-btn tool-btn-sm" data-bg="bg-dark" id="svg-bg-dark" title="Nền tối">Dark</button>
                            <button type="button" class="tool-btn tool-btn-sm" data-bg="bg-light" id="svg-bg-light" title="Nền sáng">Light</button>
                            <button type="button" class="tool-btn tool-btn-sm" data-bg="bg-gradient" id="svg-bg-grad" title="Nền gradient">Gradient</button>
                        </div>
                    </div>

                    <div class="svg-opt-row">
                        <label class="svg-opt-item"><input type="checkbox" id="opt-doctype" checked> Xóa DOCTYPE & XML</label>
                        <label class="svg-opt-item"><input type="checkbox" id="opt-comments" checked> Xóa Comment</label>
                        <label class="svg-opt-item"><input type="checkbox" id="opt-meta" checked> Xóa Metadata (Sketch, Inkscape...)</label>
                        <label class="svg-opt-item"><input type="checkbox" id="opt-empty" checked> Xóa thẻ rác trống</label>
                        <label class="svg-opt-item"><input type="checkbox" id="opt-minify" checked> Minify khoảng trắng</label>
                    </div>

                    <div class="svg-stats-bar" id="svg-stats-bar">
                        <div>
                            <span>Gốc: <strong id="svg-size-orig">0 B</strong></span>
                            <span style="margin: 0 0.5rem; color: var(--text-muted);">→</span>
                            <span>Sau tối ưu: <strong id="svg-size-opt" style="color:var(--accent-primary);">0 B</strong></span>
                        </div>
                        <span class="svg-badge-saved" id="svg-badge-saved">Tiết kiệm: 0%</span>
                    </div>

                    <div class="svg-layout">
                        <!-- Input Column -->
                        <div class="tool-group">
                            <label class="tool-label">Mã SVG đầu vào (Raw SVG)</label>
                            <textarea id="svg-input" class="tool-textarea" style="min-height: 380px; font-family: monospace; font-size: 13px;" placeholder="Dán mã <svg>...</svg> vào đây hoặc tải file lên..."></textarea>
                        </div>

                        <!-- Output & Preview Column -->
                        <div class="tool-group">
                            <label class="tool-label">Xem trước (Live Preview)</label>
                            <div class="svg-preview-box bg-grid" id="svg-preview-container">
                                <div id="svg-preview-placeholder" style="color:var(--text-muted); font-size:var(--fs-sm);">Chưa có SVG để hiển thị</div>
                            </div>

                            <!-- Tabs for Output Format -->
                            <div class="svg-tabs">
                                <button type="button" class="svg-tab-btn active" data-tab="tab-clean">SVG Đã Tối Ưu</button>
                                <button type="button" class="svg-tab-btn" data-tab="tab-jsx">React JSX</button>
                                <button type="button" class="svg-tab-btn" data-tab="tab-css">CSS Background</button>
                                <button type="button" class="svg-tab-btn" data-tab="tab-uri">Data URI</button>
                            </div>

                            <div class="tool-result">
                                <textarea id="svg-output" class="tool-textarea" style="min-height: 200px; font-family: monospace; font-size: 13px;" readonly placeholder="Kết quả sẽ hiển thị ở đây..."></textarea>
                                <div style="display:flex; gap:0.5rem; margin-top:0.75rem; justify-content: flex-end;">
                                    <button type="button" class="tool-btn tool-btn-sm" id="svg-btn-download">💾 Tải .svg</button>
                                    <button type="button" class="tool-btn tool-btn-primary tool-btn-sm" id="svg-btn-copy">📋 Copy Kết quả</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const inputEl = container.querySelector('#svg-input');
        const outputEl = container.querySelector('#svg-output');
        const previewContainer = container.querySelector('#svg-preview-container');
        const previewPlaceholder = container.querySelector('#svg-preview-placeholder');
        const fileInput = container.querySelector('#svg-file-in');
        const sampleBtn = container.querySelector('#svg-btn-sample');
        const clearBtn = container.querySelector('#svg-btn-clear');
        const copyBtn = container.querySelector('#svg-btn-copy');
        const downloadBtn = container.querySelector('#svg-btn-download');

        const sizeOrigEl = container.querySelector('#svg-size-orig');
        const sizeOptEl = container.querySelector('#svg-size-opt');
        const badgeSavedEl = container.querySelector('#svg-badge-saved');

        const optDoctype = container.querySelector('#opt-doctype');
        const optComments = container.querySelector('#opt-comments');
        const optMeta = container.querySelector('#opt-meta');
        const optEmpty = container.querySelector('#opt-empty');
        const optMinify = container.querySelector('#opt-minify');

        let currentTab = 'tab-clean';
        let optimizedSvg = '';

        const samples = [
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Rocket launch icon -->
  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
</svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Shield check security icon -->
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  <path d="m9 12 2 2 4-4"/>
</svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Shopping cart icon -->
  <circle cx="8" cy="21" r="1"/>
  <circle cx="19" cy="21" r="1"/>
  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
</svg>`
        ];
        let sampleIndex = 0;

        function formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1) + ' ' + sizes[i];
        }

        function cleanSvg(raw) {
            let svg = raw.trim();
            if (!svg) return '';

            // Strip XML declaration
            if (optDoctype.checked) {
                svg = svg.replace(/<\?xml[\s\S]*?\?>/gi, '');
                svg = svg.replace(/<!DOCTYPE[\s\S]*?>/gi, '');
            }

            // Strip comments
            if (optComments.checked) {
                svg = svg.replace(/<!--[\s\S]*?-->/g, '');
            }

            // Strip editor metadata
            if (optMeta.checked) {
                svg = svg.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
                svg = svg.replace(/<title[\s\S]*?<\/title>/gi, '');
                svg = svg.replace(/<desc[\s\S]*?<\/desc>/gi, '');
                svg = svg.replace(/\s*(?:xmlns:sketch|sketch:type|xmlns:inkscape|inkscape:[a-z0-9_-]+|xmlns:sodipodi|sodipodi:[a-z0-9_-]+|xmlns:adobe|adobe:[a-z0-9_-]+)="[^"]*"/gi, '');
            }

            // Strip empty tags
            if (optEmpty.checked) {
                svg = svg.replace(/<g[^>]*>\s*<\/g>/gi, '');
                svg = svg.replace(/<defs[^>]*>\s*<\/defs>/gi, '');
            }

            // Minify whitespace
            if (optMinify.checked) {
                svg = svg.replace(/>\s+</g, '><');
                svg = svg.replace(/\s{2,}/g, ' ');
            }

            return svg.trim();
        }

        function toJsx(svgStr) {
            let jsx = svgStr;
            const attrMap = {
                'class=': 'className=',
                'stroke-width=': 'strokeWidth=',
                'stroke-linecap=': 'strokeLinecap=',
                'stroke-linejoin=': 'strokeLinejoin=',
                'stroke-miterlimit=': 'strokeMiterlimit=',
                'stroke-opacity=': 'strokeOpacity=',
                'stroke-dasharray=': 'strokeDasharray=',
                'stroke-dashoffset=': 'strokeDashoffset=',
                'fill-rule=': 'fillRule=',
                'fill-opacity=': 'fillOpacity=',
                'clip-rule=': 'clipRule=',
                'clip-path=': 'clipPath=',
                'stop-color=': 'stopColor=',
                'stop-opacity=': 'stopOpacity=',
                'flood-color=': 'floodColor=',
                'flood-opacity=': 'floodOpacity=',
                'color-interpolation-filters=': 'colorInterpolationFilters=',
                'font-family=': 'fontFamily=',
                'font-size=': 'fontSize=',
                'font-weight=': 'fontWeight=',
                'text-anchor=': 'textAnchor=',
                'dominant-baseline=': 'dominantBaseline=',
                'xlink:href=': 'xlinkHref=',
                'xmlns:xlink=': 'xmlnsXlink='
            };

            for (const [k, v] of Object.entries(attrMap)) {
                const re = new RegExp(k, 'gi');
                jsx = jsx.replace(re, v);
            }

            // Add props spread to root <svg>
            jsx = jsx.replace(/<svg\b([^>]*)>/i, '<svg$1 {...props}>');

            return `import React from 'react';\n\nexport const SvgIcon = (props) => (\n  ${jsx}\n);\n\nexport default SvgIcon;\n`;
        }

        function toCssBackground(svgStr) {
            const encoded = encodeURIComponent(svgStr)
                .replace(/'/g, '%27')
                .replace(/"/g, '%22');
            return `background-image: url("data:image/svg+xml,${encoded}");\nbackground-repeat: no-repeat;\nbackground-position: center;\nbackground-size: contain;`;
        }

        function toDataUri(svgStr) {
            const encodedUtf8 = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgStr);
            let b64 = '';
            try {
                b64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
            } catch (e) {
                b64 = '(Base64 encoding error)';
            }
            return `/* UTF-8 Data URI */\n${encodedUtf8}\n\n/* Base64 Data URI */\n${b64}`;
        }

        function updateOutputs() {
            const raw = inputEl.value;
            if (!raw.trim()) {
                optimizedSvg = '';
                previewContainer.innerHTML = '<div style="color:var(--text-muted); font-size:var(--fs-sm);">Chưa có SVG để hiển thị</div>';
                outputEl.value = '';
                sizeOrigEl.textContent = '0 B';
                sizeOptEl.textContent = '0 B';
                badgeSavedEl.textContent = 'Tiết kiệm: 0%';
                return;
            }

            optimizedSvg = cleanSvg(raw);

            // Preview
            previewContainer.innerHTML = optimizedSvg;

            // Stats
            const origBytes = new Blob([raw]).size;
            const optBytes = new Blob([optimizedSvg]).size;
            sizeOrigEl.textContent = formatBytes(origBytes);
            sizeOptEl.textContent = formatBytes(optBytes);

            const saved = origBytes > 0 ? Math.max(0, Math.round(((origBytes - optBytes) / origBytes) * 100)) : 0;
            badgeSavedEl.textContent = `Tiết kiệm: ${saved}% (${formatBytes(Math.max(0, origBytes - optBytes))})`;

            // Active Tab Output
            switch (currentTab) {
                case 'tab-clean':
                    outputEl.value = optimizedSvg;
                    break;
                case 'tab-jsx':
                    outputEl.value = toJsx(optimizedSvg);
                    break;
                case 'tab-css':
                    outputEl.value = toCssBackground(optimizedSvg);
                    break;
                case 'tab-uri':
                    outputEl.value = toDataUri(optimizedSvg);
                    break;
            }
        }

        // Background switcher
        container.querySelectorAll('[data-bg]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                container.querySelectorAll('[data-bg]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                previewContainer.className = 'svg-preview-box ' + btn.dataset.bg;
            });
        });

        // Tab switcher
        container.querySelectorAll('.svg-tab-btn').forEach(tabBtn => {
            tabBtn.addEventListener('click', () => {
                container.querySelectorAll('.svg-tab-btn').forEach(b => b.classList.remove('active'));
                tabBtn.classList.add('active');
                currentTab = tabBtn.dataset.tab;
                updateOutputs();
            });
        });

        // Checkbox options
        [optDoctype, optComments, optMeta, optEmpty, optMinify].forEach(cb => {
            cb.addEventListener('change', updateOutputs);
        });

        // Input typing
        inputEl.addEventListener('input', updateOutputs);

        // File upload
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                inputEl.value = ev.target.result;
                updateOutputs();
                if (window.showToast) window.showToast(`Đã tải: ${file.name}`, 'success');
            };
            reader.readAsText(file);
        });

        // Sample button
        sampleBtn.addEventListener('click', () => {
            inputEl.value = samples[sampleIndex % samples.length];
            sampleIndex++;
            updateOutputs();
        });

        // Clear button
        clearBtn.addEventListener('click', () => {
            inputEl.value = '';
            fileInput.value = '';
            updateOutputs();
        });

        // Copy button
        copyBtn.addEventListener('click', () => {
            if (!outputEl.value.trim()) return;
            if (window.copyToClipboard) {
                window.copyToClipboard(outputEl.value, copyBtn);
            } else {
                navigator.clipboard.writeText(outputEl.value);
            }
        });

        // Download button
        downloadBtn.addEventListener('click', () => {
            if (!optimizedSvg.trim()) return;
            const blob = new Blob([optimizedSvg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'optimized.svg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (window.showToast) window.showToast('Đã tải xuống optimized.svg', 'success');
        });

        // Init with sample
        inputEl.value = samples[0];
        updateOutputs();
    }
});
