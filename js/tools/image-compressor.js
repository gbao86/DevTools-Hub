/* ============================================
   DevTools Hub - Image Compressor & Resizer
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'Image Compressor',
    icon: '🎨',
    category: 'Converter',
    description: 'Nén, resize và đổi định dạng ảnh (JPEG, PNG, WebP) 100% offline',

    render(container) {
        container.innerHTML = `
            <style>
                .ic-drop-zone {
                    border: 2px dashed var(--border-color);
                    border-radius: var(--radius-md);
                    padding: var(--space-xl);
                    text-align: center;
                    cursor: pointer;
                    background: var(--bg-secondary);
                    transition: all var(--transition-fast);
                }
                .ic-drop-zone:hover, .ic-drop-zone.dragover {
                    border-color: var(--accent-primary);
                    background: var(--bg-tertiary);
                }
                .ic-preview-img {
                    max-width: 100%;
                    max-height: 280px;
                    object-fit: contain;
                    border-radius: var(--radius-sm);
                    border: 1px solid var(--border-color);
                    background: repeating-conic-gradient(var(--bg-tertiary) 0% 25%, transparent 0% 50%) 50% / 20px 20px;
                }
                .ic-result-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: var(--space-lg);
                    margin-top: var(--space-lg);
                }
                .ic-savings-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 12px;
                    border-radius: 9999px;
                    font-size: var(--fs-sm);
                    font-weight: 700;
                    background: rgba(16, 185, 129, 0.15);
                    color: var(--accent-success);
                }
                .ic-savings-badge.negative {
                    background: rgba(239, 68, 68, 0.15);
                    color: var(--accent-danger);
                }
            </style>

            <div class="tool-panel">
                <div class="tool-header">
                    <h2>Image Compressor & Resizer</h2>
                    <p class="tool-description">Giảm dung lượng và thay đổi kích thước ảnh trực tiếp trên trình duyệt. An toàn, bảo mật tuyệt đối, không tải ảnh lên máy chủ.</p>
                </div>

                <div class="tool-body">
                    <!-- Drop Zone -->
                    <div class="ic-drop-zone" id="ic-drop-zone">
                        <div style="font-size: 2.5rem; margin-bottom: var(--space-sm);">🖼️</div>
                        <div style="font-size: var(--fs-base); font-weight: 600; margin-bottom: 4px;">Kéo thả ảnh vào đây, hoặc click để chọn file</div>
                        <div style="font-size: var(--fs-xs); color: var(--text-muted);">Hỗ trợ: JPEG, PNG, WebP, GIF, BMP (Tối đa 25MB)</div>
                        <input type="file" id="ic-file-input" style="display: none;" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp">
                    </div>

                    <!-- Work Area (hidden initially) -->
                    <div id="ic-work-area" style="display: none;">
                        <div class="tool-split" style="margin-top: var(--space-md);">
                            <!-- Left: Settings -->
                            <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                                <div class="tool-group">
                                    <label class="tool-label">Định dạng đầu ra</label>
                                    <select id="ic-format" class="tool-select">
                                        <option value="image/jpeg">JPEG (Nhẹ nhất, tốt cho ảnh chụp)</option>
                                        <option value="image/webp" selected>WebP (Hiện đại, nén cao, hỗ trợ trong suốt)</option>
                                        <option value="image/png">PNG (Chất lượng gốc, giữ trong suốt)</option>
                                    </select>
                                </div>

                                <div class="tool-group" id="ic-quality-group">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <label class="tool-label">Chất lượng nén (Quality): <span id="ic-quality-val" style="color: var(--accent-primary); font-family: var(--font-mono); font-weight: 600;">80%</span></label>
                                    </div>
                                    <input type="range" id="ic-quality" class="tool-range" min="5" max="100" value="80">
                                    <div style="font-size: var(--fs-xs); color: var(--text-muted);">80% cho tỉ lệ cân bằng tối ưu giữa dung lượng và độ nét.</div>
                                </div>

                                <div class="tool-group">
                                    <label class="tool-label">Kích thước (Resize)</label>
                                    <div class="tool-row" style="gap: var(--space-sm); align-items: center;">
                                        <input type="number" id="ic-width" class="tool-input tool-number" style="flex: 1;" placeholder="Width">
                                        <span style="color: var(--text-muted);">×</span>
                                        <input type="number" id="ic-height" class="tool-input tool-number" style="flex: 1;" placeholder="Height">
                                        <span style="color: var(--text-muted); font-size: var(--fs-xs);">px</span>
                                    </div>
                                    <label class="tool-checkbox" style="margin-top: 4px;">
                                        <input type="checkbox" id="ic-keep-ratio" checked>
                                        <span>Khóa tỉ lệ khung hình (Lock Aspect Ratio)</span>
                                    </label>
                                    <div class="tool-actions" style="margin-top: 6px;">
                                        <button class="tool-btn tool-btn-sm ic-scale-preset" data-scale="1">100% Gốc</button>
                                        <button class="tool-btn tool-btn-sm ic-scale-preset" data-scale="0.75">75%</button>
                                        <button class="tool-btn tool-btn-sm ic-scale-preset" data-scale="0.5">50%</button>
                                        <button class="tool-btn tool-btn-sm ic-scale-preset" data-scale="0.25">25%</button>
                                    </div>
                                </div>

                                <div class="tool-actions" style="margin-top: var(--space-sm);">
                                    <button class="tool-btn tool-btn-primary" id="ic-compress-btn">⚡ Nén và Xử lý ảnh</button>
                                    <button class="tool-btn tool-btn-danger" id="ic-reset-btn">Chọn ảnh khác</button>
                                </div>
                            </div>

                            <!-- Right: Original Preview & Info -->
                            <div style="display: flex; flex-direction: column; gap: var(--space-md); align-items: center;">
                                <label class="tool-label" style="align-self: flex-start;">Ảnh gốc xem trước</label>
                                <img id="ic-orig-img" class="ic-preview-img" alt="Original">
                                <div class="tool-stats" style="width: 100%; grid-template-columns: repeat(2, 1fr);">
                                    <div class="tool-stat">
                                        <div class="tool-stat-value" id="ic-orig-size" style="font-size: var(--fs-md);">-</div>
                                        <div class="tool-stat-label">Dung lượng gốc</div>
                                    </div>
                                    <div class="tool-stat">
                                        <div class="tool-stat-value" id="ic-orig-dim" style="font-size: var(--fs-md);">-</div>
                                        <div class="tool-stat-label">Độ phân giải gốc</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Result Section -->
                        <div class="ic-result-card" id="ic-result-section" style="display: none;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); flex-wrap: wrap; gap: var(--space-sm);">
                                <h3 style="font-size: var(--fs-md); font-weight: 700;">✅ Kết quả sau khi nén</h3>
                                <span class="ic-savings-badge" id="ic-savings-badge">Giảm 0%</span>
                            </div>

                            <div class="tool-split" style="align-items: center;">
                                <div style="display: flex; justify-content: center;">
                                    <img id="ic-res-img" class="ic-preview-img" alt="Compressed">
                                </div>
                                <div style="display: flex; flex-direction: column; gap: var(--space-md);">
                                    <div class="tool-stats" style="grid-template-columns: repeat(2, 1fr);">
                                        <div class="tool-stat">
                                            <div class="tool-stat-value" id="ic-res-size" style="font-size: var(--fs-md); color: var(--accent-success);">-</div>
                                            <div class="tool-stat-label">Dung lượng mới</div>
                                        </div>
                                        <div class="tool-stat">
                                            <div class="tool-stat-value" id="ic-res-dim" style="font-size: var(--fs-md);">-</div>
                                            <div class="tool-stat-label">Độ phân giải mới</div>
                                        </div>
                                    </div>
                                    <div class="tool-actions">
                                        <a id="ic-download-btn" class="tool-btn tool-btn-primary" download="compressed.webp" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: var(--space-xs);">
                                            ⬇️ Tải ảnh về máy
                                        </a>
                                        <button class="tool-btn" id="ic-copy-dataurl-btn">🔗 Copy Data URL</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const dropZone = container.querySelector('#ic-drop-zone');
        const fileInput = container.querySelector('#ic-file-input');
        const workArea = container.querySelector('#ic-work-area');
        const formatSelect = container.querySelector('#ic-format');
        const qualityGroup = container.querySelector('#ic-quality-group');
        const qualitySlider = container.querySelector('#ic-quality');
        const qualityVal = container.querySelector('#ic-quality-val');
        const widthInput = container.querySelector('#ic-width');
        const heightInput = container.querySelector('#ic-height');
        const keepRatioCheckbox = container.querySelector('#ic-keep-ratio');
        const compressBtn = container.querySelector('#ic-compress-btn');
        const resetBtn = container.querySelector('#ic-reset-btn');
        const origImg = container.querySelector('#ic-orig-img');
        const origSizeEl = container.querySelector('#ic-orig-size');
        const origDimEl = container.querySelector('#ic-orig-dim');
        const resultSection = container.querySelector('#ic-result-section');
        const resImg = container.querySelector('#ic-res-img');
        const resSizeEl = container.querySelector('#ic-res-size');
        const resDimEl = container.querySelector('#ic-res-dim');
        const savingsBadge = container.querySelector('#ic-savings-badge');
        const downloadBtn = container.querySelector('#ic-download-btn');
        const copyDataUrlBtn = container.querySelector('#ic-copy-dataurl-btn');

        let rawFile = null;
        let originalImageObj = null;
        let originalAspect = 1;
        let originalBytes = 0;
        let lastResultBlob = null;
        let lastResultDataUrl = '';

        function formatBytes(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function loadFile(file) {
            if (!file || !file.type.startsWith('image/')) {
                if (window.showToast) window.showToast('Vui lòng chọn một file ảnh hợp lệ.', 'error');
                return;
            }

            rawFile = file;
            originalBytes = file.size;
            origSizeEl.textContent = formatBytes(originalBytes);

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    originalImageObj = img;
                    originalAspect = img.width / img.height;
                    origDimEl.textContent = `${img.width} × ${img.height}`;
                    origImg.src = e.target.result;

                    widthInput.value = img.width;
                    heightInput.value = img.height;

                    dropZone.style.display = 'none';
                    workArea.style.display = 'block';
                    resultSection.style.display = 'none';

                    // Auto-suggest format: If png with transparency, keep webp/png
                    processCompression();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        // File drop events
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) loadFile(e.target.files[0]);
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
                loadFile(e.dataTransfer.files[0]);
            }
        });

        // Quality slider update
        qualitySlider.addEventListener('input', () => {
            qualityVal.textContent = `${qualitySlider.value}%`;
        });

        // Format change update
        formatSelect.addEventListener('change', () => {
            const isPng = formatSelect.value === 'image/png';
            qualityGroup.style.display = isPng ? 'none' : 'flex';
        });

        // Aspect ratio handling on resize
        widthInput.addEventListener('input', () => {
            if (keepRatioCheckbox.checked && originalAspect) {
                const w = parseInt(widthInput.value);
                if (w > 0) {
                    heightInput.value = Math.round(w / originalAspect);
                }
            }
        });

        heightInput.addEventListener('input', () => {
            if (keepRatioCheckbox.checked && originalAspect) {
                const h = parseInt(heightInput.value);
                if (h > 0) {
                    widthInput.value = Math.round(h * originalAspect);
                }
            }
        });

        // Scale presets
        container.querySelectorAll('.ic-scale-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!originalImageObj) return;
                const scale = parseFloat(btn.dataset.scale);
                widthInput.value = Math.round(originalImageObj.width * scale);
                heightInput.value = Math.round(originalImageObj.height * scale);
            });
        });

        // Compression execution
        function processCompression() {
            if (!originalImageObj) return;

            const targetW = parseInt(widthInput.value) || originalImageObj.width;
            const targetH = parseInt(heightInput.value) || originalImageObj.height;
            const mimeType = formatSelect.value;
            const quality = parseInt(qualitySlider.value) / 100;

            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');

            // Draw image
            ctx.drawImage(originalImageObj, 0, 0, targetW, targetH);

            canvas.toBlob((blob) => {
                if (!blob) {
                    if (window.showToast) window.showToast('Không thể tạo file ảnh nén.', 'error');
                    return;
                }

                lastResultBlob = blob;
                const resultBytes = blob.size;
                const savings = ((originalBytes - resultBytes) / originalBytes) * 100;

                resSizeEl.textContent = formatBytes(resultBytes);
                resDimEl.textContent = `${targetW} × ${targetH}`;

                if (savings >= 0) {
                    savingsBadge.textContent = `Giảm ${savings.toFixed(1)}% (${formatBytes(originalBytes - resultBytes)})`;
                    savingsBadge.className = 'ic-savings-badge';
                } else {
                    savingsBadge.textContent = `Tăng ${Math.abs(savings).toFixed(1)}% (Lớn hơn gốc)`;
                    savingsBadge.className = 'ic-savings-badge negative';
                }

                const url = URL.createObjectURL(blob);
                resImg.src = url;

                // Download button setup
                const ext = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/png' ? 'png' : 'webp';
                const baseName = (rawFile ? rawFile.name.replace(/\.[^/.]+$/, '') : 'image');
                downloadBtn.href = url;
                downloadBtn.download = `${baseName}-compressed.${ext}`;

                // Data URL
                const reader = new FileReader();
                reader.onload = (e) => {
                    lastResultDataUrl = e.target.result;
                };
                reader.readAsDataURL(blob);

                resultSection.style.display = 'block';
                if (window.showToast) window.showToast('Đã nén ảnh thành công!', 'success');
            }, mimeType, quality);
        }

        compressBtn.addEventListener('click', processCompression);

        resetBtn.addEventListener('click', () => {
            rawFile = null;
            originalImageObj = null;
            fileInput.value = '';
            dropZone.style.display = 'block';
            workArea.style.display = 'none';
            resultSection.style.display = 'none';
        });

        copyDataUrlBtn.addEventListener('click', () => {
            if (lastResultDataUrl && window.copyToClipboard) {
                window.copyToClipboard(lastResultDataUrl, copyDataUrlBtn);
            }
        });
    }
});
