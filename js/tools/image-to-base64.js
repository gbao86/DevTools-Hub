const ImageToBase64Tool = {
    name: 'Image to Base64',
    icon: '🔄',
    category: 'Encode / Decode',
    description: 'Chuyển đổi ảnh và SVG sang Base64 Data URL',
    render(container) {
        container.innerHTML = `
        <style>
        .i2b-drop-zone {
            border: 2px dashed var(--border-color);
            border-radius: var(--radius-md);
            padding: var(--space-lg);
            text-align: center;
            transition: all var(--transition-fast);
            cursor: pointer;
            background: var(--bg-secondary);
        }
        .i2b-drop-zone:hover, .i2b-drop-zone.dragover {
            border-color: var(--accent-primary);
            background: var(--bg-tertiary);
        }
        .i2b-preview-container {
            margin-top: var(--space-md);
            display: none;
            flex-direction: column;
            gap: var(--space-md);
        }
        .i2b-preview-image {
            max-width: 100%;
            max-height: 300px;
            object-fit: contain;
            border-radius: var(--radius-sm);
            border: 1px solid var(--border-color);
            background-image: repeating-linear-gradient(45deg, var(--border-color) 25%, transparent 25%, transparent 75%, var(--border-color) 75%, var(--border-color)), repeating-linear-gradient(45deg, var(--border-color) 25%, var(--bg-primary) 25%, var(--bg-primary) 75%, var(--border-color) 75%, var(--border-color));
            background-position: 0 0, 10px 10px;
            background-size: 20px 20px;
        }
        .i2b-tabs {
            display: flex;
            gap: var(--space-sm);
            margin-bottom: var(--space-md);
            border-bottom: 1px solid var(--border-color);
            padding-bottom: var(--space-sm);
        }
        .i2b-tab {
            padding: var(--space-sm) var(--space-md);
            cursor: pointer;
            border-radius: var(--radius-sm);
            color: var(--text-secondary);
        }
        .i2b-tab.active {
            background: var(--accent-primary);
            color: white;
        }
        </style>
        <div class="tool-panel">
            <div class="tool-header">
                <h2>Image to Base64</h2>
                <p class="tool-description">Chuyển đổi ảnh và SVG sang Base64 Data URL</p>
            </div>
            <div class="tool-body">
                <div class="i2b-tabs">
                    <div class="i2b-tab active" data-tab="encode">Ảnh sang Base64</div>
                    <div class="i2b-tab" data-tab="decode">Base64 sang Ảnh</div>
                </div>

                <div id="i2b-encode-section">
                    <div class="i2b-drop-zone" id="i2b-drop-zone" tabindex="0">
                        <div style="font-size: 2rem; margin-bottom: var(--space-sm);">📸</div>
                        <div style="margin-bottom: var(--space-sm);">Kéo thả ảnh vào đây, hoặc click để chọn file</div>
                        <div style="font-size: var(--fs-sm); color: var(--text-muted);">Hoặc dán (Ctrl+V) từ clipboard</div>
                        <div style="font-size: var(--fs-xs); color: var(--text-muted); margin-top: var(--space-sm);">Hỗ trợ: PNG, JPG, GIF, WEBP, SVG, ICO, BMP</div>
                        <input type="file" id="i2b-file-input" style="display: none" accept="image/png, image/jpeg, image/gif, image/webp, image/svg+xml, image/x-icon, image/bmp">
                    </div>

                    <div class="i2b-preview-container" id="i2b-preview">
                        <div class="tool-split">
                            <div style="display: flex; justify-content: center; align-items: center; background: var(--bg-secondary); border-radius: var(--radius-md); padding: var(--space-sm);">
                                <img id="i2b-img-preview" class="i2b-preview-image">
                            </div>
                            <div>
                                <div class="tool-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-sm);">
                                    <div class="tool-stat" style="grid-column: span 2;">
                                        <div class="tool-stat-label">Tên file</div>
                                        <div class="tool-stat-value" id="i2b-stat-name" style="word-break: break-all; font-size: var(--fs-sm);">-</div>
                                    </div>
                                    <div class="tool-stat">
                                        <div class="tool-stat-label">Loại (MIME)</div>
                                        <div class="tool-stat-value" id="i2b-stat-mime" style="font-size: var(--fs-sm);">-</div>
                                    </div>
                                    <div class="tool-stat">
                                        <div class="tool-stat-label">Kích thước</div>
                                        <div class="tool-stat-value" id="i2b-stat-size" style="font-size: var(--fs-sm);">-</div>
                                    </div>
                                    <div class="tool-stat">
                                        <div class="tool-stat-label">Kích thước Base64</div>
                                        <div class="tool-stat-value" id="i2b-stat-b64size" style="font-size: var(--fs-sm);">-</div>
                                    </div>
                                    <div class="tool-stat">
                                        <div class="tool-stat-label">Độ phân giải</div>
                                        <div class="tool-stat-value" id="i2b-stat-dim" style="font-size: var(--fs-sm);">-</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tool-group">
                            <label class="tool-label">Data URL (Dùng cho src, background)</label>
                            <div class="tool-result">
                                <textarea class="tool-textarea" id="i2b-out-dataurl" rows="3" readonly style="word-break: break-all;"></textarea>
                                <button class="tool-copy-btn" id="i2b-copy-dataurl">📋 Copy</button>
                            </div>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Base64 String (Chỉ chứa chuỗi Base64)</label>
                            <div class="tool-result">
                                <textarea class="tool-textarea" id="i2b-out-base64" rows="3" readonly style="word-break: break-all;"></textarea>
                                <button class="tool-copy-btn" id="i2b-copy-base64">📋 Copy</button>
                            </div>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">CSS background-image</label>
                            <div class="tool-result">
                                <input type="text" class="tool-input" id="i2b-out-css" readonly>
                                <button class="tool-copy-btn" id="i2b-copy-css">📋 Copy</button>
                            </div>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">HTML &lt;img&gt; tag</label>
                            <div class="tool-result">
                                <input type="text" class="tool-input" id="i2b-out-html" readonly>
                                <button class="tool-copy-btn" id="i2b-copy-html">📋 Copy</button>
                            </div>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Markdown</label>
                            <div class="tool-result">
                                <input type="text" class="tool-input" id="i2b-out-md" readonly>
                                <button class="tool-copy-btn" id="i2b-copy-md">📋 Copy</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="i2b-decode-section" style="display: none;">
                    <div class="tool-group">
                        <label class="tool-label">Nhập chuỗi Base64 hoặc Data URL</label>
                        <textarea class="tool-textarea" id="i2b-decode-input" rows="5" placeholder="data:image/png;base64,iVBORw0... hoặc iVBORw0..."></textarea>
                    </div>
                    <div class="tool-actions">
                        <button class="tool-btn tool-btn-primary" id="i2b-decode-btn">Hiển thị ảnh</button>
                        <button class="tool-btn" id="i2b-decode-clear-btn">Xóa</button>
                    </div>
                    <div class="i2b-preview-container" id="i2b-decode-preview">
                        <img id="i2b-decode-img" class="i2b-preview-image" style="margin: 0 auto; display: block;">
                    </div>
                </div>
            </div>
        </div>
        `;

        const tabs = container.querySelectorAll('.i2b-tab');
        const encodeSection = container.querySelector('#i2b-encode-section');
        const decodeSection = container.querySelector('#i2b-decode-section');

        const dropZone = container.querySelector('#i2b-drop-zone');
        const fileInput = container.querySelector('#i2b-file-input');
        const previewContainer = container.querySelector('#i2b-preview');
        const imgPreview = container.querySelector('#i2b-img-preview');
        
        // Stats
        const statName = container.querySelector('#i2b-stat-name');
        const statMime = container.querySelector('#i2b-stat-mime');
        const statSize = container.querySelector('#i2b-stat-size');
        const statB64Size = container.querySelector('#i2b-stat-b64size');
        const statDim = container.querySelector('#i2b-stat-dim');

        // Outputs
        const outDataUrl = container.querySelector('#i2b-out-dataurl');
        const outBase64 = container.querySelector('#i2b-out-base64');
        const outCss = container.querySelector('#i2b-out-css');
        const outHtml = container.querySelector('#i2b-out-html');
        const outMd = container.querySelector('#i2b-out-md');

        // Decode
        const decodeInput = container.querySelector('#i2b-decode-input');
        const decodeBtn = container.querySelector('#i2b-decode-btn');
        const decodeClearBtn = container.querySelector('#i2b-decode-clear-btn');
        const decodePreviewContainer = container.querySelector('#i2b-decode-preview');
        const decodeImg = container.querySelector('#i2b-decode-img');

        // Tab Switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                if (tab.dataset.tab === 'encode') {
                    encodeSection.style.display = 'block';
                    decodeSection.style.display = 'none';
                } else {
                    encodeSection.style.display = 'none';
                    decodeSection.style.display = 'block';
                }
            });
        });

        const formatBytes = (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        const processFile = (file) => {
            if (!file || !file.type.startsWith('image/')) {
                window.showToast('Vui lòng chọn một file ảnh hợp lệ.', 'error');
                return;
            }

            if (file.size > 1024 * 1024) { // > 1MB
                window.showToast('Cảnh báo: File lớn hơn 1MB có thể gây giật lag trình duyệt khi chuyển sang Base64.', 'warning');
            }

            statName.textContent = file.name;
            statMime.textContent = file.type;
            statSize.textContent = formatBytes(file.size);

            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                const base64String = dataUrl.split(',')[1];
                
                imgPreview.src = dataUrl;
                
                // Get dimensions
                const img = new Image();
                img.onload = () => {
                    statDim.textContent = `${img.width} x ${img.height}`;
                };
                img.src = dataUrl;

                statB64Size.textContent = formatBytes(base64String.length);

                // Populate outputs
                outDataUrl.value = dataUrl;
                outBase64.value = base64String;
                outCss.value = `background-image: url("${dataUrl}");`;
                outHtml.value = `<img src="${dataUrl}" alt="${file.name}">`;
                outMd.value = `![${file.name}](${dataUrl})`;

                previewContainer.style.display = 'flex';
                window.showToast('Chuyển đổi thành công!', 'success');
            };
            reader.readAsDataURL(file);
        };

        // File Selection Events
        dropZone.addEventListener('click', () => fileInput.click());
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                processFile(e.target.files[0]);
            }
        });

        // Paste event on window (when encode tab is active)
        if (window._i2bPasteHandler) {
            window.removeEventListener('paste', window._i2bPasteHandler);
        }
        window._i2bPasteHandler = (e) => {
            if (encodeSection.style.display !== 'none') {
                if (!e.clipboardData) return;
                const items = e.clipboardData.items;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.kind === 'file') {
                        const blob = item.getAsFile();
                        processFile(blob);
                        return;
                    }
                }
            }
        };
        window.addEventListener('paste', window._i2bPasteHandler);

        // Copy Buttons
        const setupCopy = (btnId, inputId) => {
            const btn = container.querySelector(`#${btnId}`);
            const input = container.querySelector(`#${inputId}`);
            if (btn && input) {
                btn.addEventListener('click', () => {
                    window.copyToClipboard(input.value, btn);
                });
            }
        };

        setupCopy('i2b-copy-dataurl', 'i2b-out-dataurl');
        setupCopy('i2b-copy-base64', 'i2b-out-base64');
        setupCopy('i2b-copy-css', 'i2b-out-css');
        setupCopy('i2b-copy-html', 'i2b-out-html');
        setupCopy('i2b-copy-md', 'i2b-out-md');

        // Decode Logic
        decodeBtn.addEventListener('click', () => {
            let input = decodeInput.value.trim();
            if (!input) {
                window.showToast('Vui lòng nhập chuỗi Base64', 'error');
                return;
            }

            // If it doesn't have data:..., try to prepend common prefix (assuming PNG)
            if (!input.startsWith('data:')) {
                input = 'data:image/png;base64,' + input;
            }

            decodeImg.onerror = () => {
                window.showToast('Chuỗi Base64 không hợp lệ hoặc không phải là ảnh', 'error');
                decodePreviewContainer.style.display = 'none';
            };
            decodeImg.onload = () => {
                decodePreviewContainer.style.display = 'flex';
            };
            decodeImg.src = input;
        });

        decodeClearBtn.addEventListener('click', () => {
            decodeInput.value = '';
            decodePreviewContainer.style.display = 'none';
            decodeImg.src = '';
        });
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(ImageToBase64Tool);
