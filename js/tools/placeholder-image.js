const PlaceholderImageTool = {
    name: 'Placeholder Image Generator',
    icon: '🆔',
    category: 'Generator',
    description: 'Tạo hình ảnh placeholder (SVG/PNG) với kích thước và màu sắc tùy chỉnh',
    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🆔 Placeholder Image Generator</h2>
                    <p class="tool-description">Tạo hình ảnh placeholder (SVG/PNG) với kích thước và màu sắc tùy chỉnh</p>
                </div>
                <div class="tool-body">
                    <div class="tool-row" style="flex-wrap: wrap; gap: 1rem;">
                        <div class="tool-col" style="flex: 1; min-width: 300px;">
                            <div class="tool-group">
                                <label class="tool-label">Size (Width × Height)</label>
                                <div class="tool-row" style="gap: 0.5rem;">
                                    <input type="number" id="img-width" class="tool-input tool-number" value="800" min="1" max="4000" style="flex: 1;">
                                    <span style="display: flex; align-items: center; color: var(--text-secondary);">×</span>
                                    <input type="number" id="img-height" class="tool-input tool-number" value="600" min="1" max="4000" style="flex: 1;">
                                </div>
                            </div>
                            
                            <div class="tool-group">
                                <label class="tool-label">Presets</label>
                                <div class="tool-row" style="flex-wrap: wrap; gap: 0.5rem;" id="size-presets">
                                    <button class="tool-btn tool-btn-sm" data-w="1920" data-h="1080">1920×1080</button>
                                    <button class="tool-btn tool-btn-sm" data-w="1280" data-h="720">1280×720</button>
                                    <button class="tool-btn tool-btn-sm" data-w="800" data-h="600">800×600</button>
                                    <button class="tool-btn tool-btn-sm" data-w="400" data-h="400">400×400</button>
                                    <button class="tool-btn tool-btn-sm" data-w="150" data-h="150">150×150</button>
                                    <button class="tool-btn tool-btn-sm" data-w="64" data-h="64">64×64</button>
                                </div>
                            </div>

                            <div class="tool-row" style="gap: 1rem;">
                                <div class="tool-group" style="flex: 1;">
                                    <label class="tool-label">Background</label>
                                    <div class="tool-row" style="gap: 0.5rem;">
                                        <input type="color" id="bg-color" value="#cccccc" style="width: 40px; height: 36px; padding: 0; border: none; border-radius: 4px; cursor: pointer; background: transparent;">
                                        <input type="text" id="bg-color-text" class="tool-input" value="#cccccc" style="flex: 1; text-transform: uppercase;">
                                    </div>
                                </div>
                                <div class="tool-group" style="flex: 1;">
                                    <label class="tool-label">Text Color</label>
                                    <div class="tool-row" style="gap: 0.5rem;">
                                        <input type="color" id="text-color" value="#666666" style="width: 40px; height: 36px; padding: 0; border: none; border-radius: 4px; cursor: pointer; background: transparent;">
                                        <input type="text" id="text-color-text" class="tool-input" value="#666666" style="flex: 1; text-transform: uppercase;">
                                    </div>
                                </div>
                            </div>

                            <div class="tool-group">
                                <label class="tool-label">Custom Text (Để trống sẽ hiện kích thước)</label>
                                <input type="text" id="custom-text" class="tool-input" placeholder="e.g. 800 x 600">
                            </div>
                            
                            <div class="tool-actions" style="margin-top: 1.5rem; flex-wrap: wrap;">
                                <button id="btn-copy-svg" class="tool-btn">📋 Copy SVG</button>
                                <button id="btn-copy-uri" class="tool-btn">🔗 Copy Data URI</button>
                                <button id="btn-dl-png" class="tool-btn tool-btn-primary">⬇️ Down PNG</button>
                                <button id="btn-dl-svg" class="tool-btn">⬇️ Down SVG</button>
                            </div>
                        </div>

                        <div class="tool-col" style="flex: 1; min-width: 300px;">
                            <label class="tool-label">Preview</label>
                            <div id="preview-container" style="width: 100%; aspect-ratio: 4/3; background: var(--bg-secondary); border: 1px dashed var(--border-color); border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
                                <img id="preview-img" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const wInput = container.querySelector('#img-width');
        const hInput = container.querySelector('#img-height');
        const presetBtns = container.querySelectorAll('#size-presets button');
        const bgColor = container.querySelector('#bg-color');
        const bgColorText = container.querySelector('#bg-color-text');
        const textColor = container.querySelector('#text-color');
        const textColorText = container.querySelector('#text-color-text');
        const customText = container.querySelector('#custom-text');
        const previewImg = container.querySelector('#preview-img');
        const previewContainer = container.querySelector('#preview-container');
        
        const btnCopySvg = container.querySelector('#btn-copy-svg');
        const btnCopyUri = container.querySelector('#btn-copy-uri');
        const btnDlPng = container.querySelector('#btn-dl-png');
        const btnDlSvg = container.querySelector('#btn-dl-svg');

        let currentSvgString = '';

        function generateSvg() {
            const w = parseInt(wInput.value) || 800;
            const h = parseInt(hInput.value) || 600;
            const bg = bgColor.value;
            const fg = textColor.value;
            const text = customText.value || \`\${w} × \${h}\`;
            
            // Calculate font size relative to image size
            const fontSize = Math.min(w * 0.15, h * 0.3, 100);

            const svg = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${w}" height="\${h}" viewBox="0 0 \${w} \${h}">
    <rect width="\${w}" height="\${h}" fill="\${bg}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="\${fg}" font-family="sans-serif" font-weight="bold" font-size="\${fontSize}px">\${text}</text>
</svg>\`;
            
            currentSvgString = svg;
            
            // Update preview aspect ratio to match
            previewContainer.style.aspectRatio = \`\${w}/\${h}\`;
            
            // Generate data URI for preview
            const encodedSvg = encodeURIComponent(svg)
                .replace(/'/g, '%27')
                .replace(/"/g, '%22');
            const dataUri = \`data:image/svg+xml;charset=utf-8,\${encodedSvg}\`;
            previewImg.src = dataUri;
        }

        // Sync color inputs
        bgColor.addEventListener('input', (e) => {
            bgColorText.value = e.target.value.toUpperCase();
            generateSvg();
        });
        bgColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                bgColor.value = e.target.value;
                generateSvg();
            }
        });

        textColor.addEventListener('input', (e) => {
            textColorText.value = e.target.value.toUpperCase();
            generateSvg();
        });
        textColorText.addEventListener('input', (e) => {
            if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                textColor.value = e.target.value;
                generateSvg();
            }
        });

        // Other inputs
        [wInput, hInput, customText].forEach(input => {
            input.addEventListener('input', generateSvg);
        });

        presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                wInput.value = e.target.dataset.w;
                hInput.value = e.target.dataset.h;
                generateSvg();
            });
        });

        // Actions
        btnCopySvg.addEventListener('click', () => {
            if (window.copyToClipboard) {
                window.copyToClipboard(currentSvgString, btnCopySvg);
            }
        });

        btnCopyUri.addEventListener('click', () => {
            if (window.copyToClipboard) {
                const encodedSvg = encodeURIComponent(currentSvgString)
                    .replace(/'/g, '%27')
                    .replace(/"/g, '%22');
                window.copyToClipboard(\`data:image/svg+xml;charset=utf-8,\${encodedSvg}\`, btnCopyUri);
            }
        });

        function downloadFile(content, filename, type) {
            const blob = new Blob([content], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        btnDlSvg.addEventListener('click', () => {
            const w = wInput.value;
            const h = hInput.value;
            downloadFile(currentSvgString, \`placeholder-\${w}x\${h}.svg\`, 'image/svg+xml');
            if (window.showToast) window.showToast('Downloaded SVG', 'success');
        });

        btnDlPng.addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const w = parseInt(wInput.value);
            const h = parseInt(hInput.value);
            
            canvas.width = w;
            canvas.height = h;
            
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = \`placeholder-\${w}x\${h}.png\`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    if (window.showToast) window.showToast('Downloaded PNG', 'success');
                }, 'image/png');
            };
            
            const encodedSvg = encodeURIComponent(currentSvgString)
                .replace(/'/g, '%27')
                .replace(/"/g, '%22');
            img.src = \`data:image/svg+xml;charset=utf-8,\${encodedSvg}\`;
        });

        // Initial generation
        generateSvg();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(PlaceholderImageTool);
