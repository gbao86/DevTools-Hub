/* ============================================
   DevTools Hub - Favicon Generator
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'Favicon Generator',
    icon: '⚙️',
    category: 'Generator',
    description: 'Tạo trọn bộ favicon đa kích thước và thẻ HTML từ ảnh bất kỳ',

    render(container) {
        container.innerHTML = `
            <style>
                .fg-drop-zone {
                    border: 2px dashed var(--border-color);
                    border-radius: var(--radius-md);
                    padding: var(--space-xl);
                    text-align: center;
                    cursor: pointer;
                    background: var(--bg-secondary);
                    transition: all var(--transition-fast);
                }
                .fg-drop-zone:hover, .fg-drop-zone.dragover {
                    border-color: var(--accent-primary);
                    background: var(--bg-tertiary);
                }
                .fg-sizes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: var(--space-md);
                    margin-top: var(--space-md);
                }
                .fg-size-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    padding: var(--space-md);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-sm);
                    text-align: center;
                }
                .fg-canvas-box {
                    width: 72px;
                    height: 72px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    background: repeating-conic-gradient(var(--bg-tertiary) 0% 25%, transparent 0% 50%) 50% / 12px 12px;
                    overflow: hidden;
                }
                .fg-canvas-box img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
                .fg-size-title {
                    font-size: var(--fs-xs);
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .fg-size-sub {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    word-break: break-all;
                }
            </style>

            <div class="tool-panel">
                <div class="tool-header">
                    <h2>Favicon Generator</h2>
                    <p class="tool-description">Tạo bộ favicon đầy đủ cho website: trình duyệt thông thường, iOS Apple Touch Icon, Android PWA và mã HTML sẵn sàng gắn vào &lt;head&gt;.</p>
                </div>

                <div class="tool-body">
                    <!-- Drop Zone -->
                    <div class="fg-drop-zone" id="fg-drop-zone">
                        <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">⭐</div>
                        <div style="font-size: var(--fs-base); font-weight: 600; margin-bottom: 4px;">Kéo thả ảnh logo vào đây hoặc click để chọn file</div>
                        <div style="font-size: var(--fs-xs); color: var(--text-muted);">Khuyên dùng ảnh vuông độ phân giải cao (≥ 512×512 PNG, SVG hoặc JPEG)</div>
                        <input type="file" id="fg-file-input" style="display: none;" accept="image/png,image/jpeg,image/svg+xml,image/webp">
                    </div>

                    <!-- Work Area -->
                    <div id="fg-work-area" style="display: none;">
                        <!-- Configuration Options -->
                        <div class="tool-card" style="margin-top: var(--space-md);">
                            <div class="tool-row" style="flex-wrap: wrap; gap: var(--space-md); align-items: center;">
                                <div class="tool-group" style="flex: 1; min-width: 200px;">
                                    <label class="tool-label">Bo góc (Border Radius): <span id="fg-radius-val" style="color: var(--accent-primary); font-family: var(--font-mono);">0%</span></label>
                                    <input type="range" id="fg-radius" class="tool-range" min="0" max="50" value="0">
                                </div>
                                <div class="tool-group" style="flex: 1; min-width: 200px;">
                                    <label class="tool-label">Khoảng đệm (Padding): <span id="fg-padding-val" style="color: var(--accent-primary); font-family: var(--font-mono);">0%</span></label>
                                    <input type="range" id="fg-padding" class="tool-range" min="0" max="30" value="0">
                                </div>
                                <div class="tool-group" style="flex: 0 0 auto;">
                                    <label class="tool-label">Màu nền phụ (Background)</label>
                                    <div class="tool-row" style="gap: var(--space-xs); align-items: center;">
                                        <input type="color" id="fg-bg-color" value="#ffffff" style="width: 36px; height: 36px; border: none; background: transparent; cursor: pointer;">
                                        <label class="tool-checkbox">
                                            <input type="checkbox" id="fg-bg-transparent" checked>
                                            <span>Trong suốt</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="tool-actions" style="margin-top: var(--space-md);">
                                <button class="tool-btn tool-btn-primary" id="fg-regen-btn">🔄 Cập nhật Favicon</button>
                                <button class="tool-btn" id="fg-dl-all-btn">📦 Tải tất cả ảnh</button>
                                <button class="tool-btn tool-btn-danger" id="fg-reset-btn">Chọn ảnh khác</button>
                            </div>
                        </div>

                        <!-- Generated Sizes Grid -->
                        <div style="margin-top: var(--space-lg);">
                            <label class="tool-label">Các kích thước được tạo</label>
                            <div class="fg-sizes-grid" id="fg-sizes-grid">
                                <!-- Cards populated by JS -->
                            </div>
                        </div>

                        <!-- HTML Code Snippet -->
                        <div class="tool-group" style="margin-top: var(--space-lg);">
                            <label class="tool-label">Mã HTML gắn vào &lt;head&gt; của website</label>
                            <div class="tool-result">
                                <textarea id="fg-html-code" class="tool-textarea" rows="5" readonly style="font-size: var(--fs-xs);"></textarea>
                                <button class="tool-copy-btn" id="fg-copy-html">📋 Copy</button>
                            </div>
                        </div>

                        <!-- Web Manifest Snippet -->
                        <div class="tool-group" style="margin-top: var(--space-md);">
                            <label class="tool-label">Mẫu tệp site.webmanifest (cho PWA & Android)</label>
                            <div class="tool-result">
                                <textarea id="fg-manifest-code" class="tool-textarea" rows="6" readonly style="font-size: var(--fs-xs);"></textarea>
                                <button class="tool-copy-btn" id="fg-copy-manifest">📋 Copy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const dropZone = container.querySelector('#fg-drop-zone');
        const fileInput = container.querySelector('#fg-file-input');
        const workArea = container.querySelector('#fg-work-area');
        const radiusSlider = container.querySelector('#fg-radius');
        const radiusVal = container.querySelector('#fg-radius-val');
        const paddingSlider = container.querySelector('#fg-padding');
        const paddingVal = container.querySelector('#fg-padding-val');
        const bgColorInput = container.querySelector('#fg-bg-color');
        const bgTransCheckbox = container.querySelector('#fg-bg-transparent');
        const regenBtn = container.querySelector('#fg-regen-btn');
        const dlAllBtn = container.querySelector('#fg-dl-all-btn');
        const resetBtn = container.querySelector('#fg-reset-btn');
        const sizesGrid = container.querySelector('#fg-sizes-grid');
        const htmlCode = container.querySelector('#fg-html-code');
        const manifestCode = container.querySelector('#fg-manifest-code');
        const copyHtmlBtn = container.querySelector('#fg-copy-html');
        const copyManifestBtn = container.querySelector('#fg-copy-manifest');

        let loadedImage = null;
        let generatedBlobs = {};

        const TARGET_SIZES = [
            { width: 16, height: 16, name: 'favicon-16x16.png', label: '16 × 16 px', desc: 'Browser tab cơ bản' },
            { width: 32, height: 32, name: 'favicon-32x32.png', label: '32 × 32 px', desc: 'Browser tab chuẩn Retina' },
            { width: 48, height: 48, name: 'favicon-48x48.png', label: '48 × 48 px', desc: 'Windows site shortcut' },
            { width: 180, height: 180, name: 'apple-touch-icon.png', label: '180 × 180 px', desc: 'Apple iOS Home Screen' },
            { width: 192, height: 192, name: 'android-chrome-192x192.png', label: '192 × 192 px', desc: 'Android PWA Icon' },
            { width: 512, height: 512, name: 'android-chrome-512x512.png', label: '512 × 512 px', desc: 'PWA Splash Screen' }
        ];

        function handleFile(file) {
            if (!file || !file.type.startsWith('image/')) {
                if (window.showToast) window.showToast('Vui lòng chọn một file ảnh hợp lệ.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    loadedImage = img;
                    dropZone.style.display = 'none';
                    workArea.style.display = 'block';
                    generateAllFavicons();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) handleFile(e.target.files[0]);
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFile(e.dataTransfer.files[0]);
            }
        });

        radiusSlider.addEventListener('input', () => {
            radiusVal.textContent = `${radiusSlider.value}%`;
        });

        paddingSlider.addEventListener('input', () => {
            paddingVal.textContent = `${paddingSlider.value}%`;
        });

        function generateFavicon(sizeInfo) {
            return new Promise((resolve) => {
                const w = sizeInfo.width;
                const h = sizeInfo.height;
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');

                const borderRadiusPct = parseInt(radiusSlider.value) / 100;
                const paddingPct = parseInt(paddingSlider.value) / 100;
                const isTransparent = bgTransCheckbox.checked;
                const bgColor = bgColorInput.value;

                // Rounded clipping if radius > 0
                if (borderRadiusPct > 0) {
                    const r = Math.min(w, h) * borderRadiusPct;
                    ctx.beginPath();
                    if (ctx.roundRect) {
                        ctx.roundRect(0, 0, w, h, r);
                    } else {
                        // Fallback
                        ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
                    }
                    ctx.clip();
                }

                // Background
                if (!isTransparent) {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, w, h);
                }

                // Calculate image sizing with padding
                const pad = Math.min(w, h) * paddingPct;
                const drawW = w - (pad * 2);
                const drawH = h - (pad * 2);
                const drawX = pad;
                const drawY = pad;

                // Center crop / aspect fit
                const imgAspect = loadedImage.width / loadedImage.height;
                let srcX = 0, srcY = 0, srcW = loadedImage.width, srcH = loadedImage.height;

                if (imgAspect > 1) {
                    srcW = loadedImage.height;
                    srcX = (loadedImage.width - srcW) / 2;
                } else if (imgAspect < 1) {
                    srcH = loadedImage.width;
                    srcY = (loadedImage.height - srcH) / 2;
                }

                ctx.drawImage(loadedImage, srcX, srcY, srcW, srcH, drawX, drawY, drawW, drawH);

                canvas.toBlob((blob) => {
                    resolve({
                        name: sizeInfo.name,
                        blob: blob,
                        dataUrl: canvas.toDataURL('image/png')
                    });
                }, 'image/png');
            });
        }

        async function generateAllFavicons() {
            if (!loadedImage) return;

            sizesGrid.innerHTML = '';
            generatedBlobs = {};

            for (const size of TARGET_SIZES) {
                const res = await generateFavicon(size);
                generatedBlobs[size.name] = res.blob;

                const card = document.createElement('div');
                card.className = 'fg-size-card';
                card.innerHTML = `
                    <div class="fg-canvas-box">
                        <img src="${res.dataUrl}" alt="${size.name}">
                    </div>
                    <div class="fg-size-title">${size.label}</div>
                    <div class="fg-size-sub">${size.desc}</div>
                    <a class="tool-btn tool-btn-sm" download="${size.name}" href="${res.dataUrl}" style="text-decoration: none;">⬇️ Tải</a>
                `;
                sizesGrid.appendChild(card);
            }

            // Update HTML Snippet
            htmlCode.value = `<!-- Favicons generated with DevTools Hub -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

            // Update Manifest Snippet
            manifestCode.value = JSON.stringify({
                "name": "My App",
                "short_name": "App",
                "icons": [
                    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
                    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
                ],
                "theme_color": "#ffffff",
                "background_color": "#ffffff",
                "display": "standalone"
            }, null, 2);

            if (window.showToast) window.showToast('Đã tạo tất cả kích thước favicon!', 'success');
        }

        regenBtn.addEventListener('click', generateAllFavicons);

        dlAllBtn.addEventListener('click', () => {
            const keys = Object.keys(generatedBlobs);
            if (!keys.length) return;

            keys.forEach((name, idx) => {
                setTimeout(() => {
                    const blob = generatedBlobs[name];
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                }, idx * 250);
            });

            if (window.showToast) window.showToast('Bắt đầu tải các tệp favicon...', 'info');
        });

        resetBtn.addEventListener('click', () => {
            loadedImage = null;
            generatedBlobs = {};
            fileInput.value = '';
            dropZone.style.display = 'block';
            workArea.style.display = 'none';
        });

        copyHtmlBtn.addEventListener('click', () => {
            if (htmlCode.value && window.copyToClipboard) {
                window.copyToClipboard(htmlCode.value, copyHtmlBtn);
            }
        });

        copyManifestBtn.addEventListener('click', () => {
            if (manifestCode.value && window.copyToClipboard) {
                window.copyToClipboard(manifestCode.value, copyManifestBtn);
            }
        });
    }
});
