/**
 * DevTools Hub - QR Code Generator & Scanner Tool
 * Generate custom QR Codes (Text/URL, Wi-Fi, vCard) with colors/margins/sizes,
 * export PNG/SVG, and decode QR Codes from images/clipboard (100% Client-Side).
 */

(function () {
    'use strict';

    // =========================================================================
    // DevTools Hub Module Definition
    // =========================================================================
    const QRCodeTool = {
        name: 'QR Code Generator & Scanner',
        icon: '📱',
        category: 'Generator',
        description: 'Tạo mã QR tùy chỉnh (URL, Wi-Fi, vCard) & Giải mã QR từ ảnh',

        render(container) {
            container.innerHTML = `
                <div class="tool-panel">
                    <div class="tool-header">
                        <h2>📱 QR Code Generator & Scanner</h2>
                        <p class="tool-description">Tạo mã QR tùy chỉnh (URL, Wi-Fi, vCard), xuất PNG/SVG và giải mã QR từ hình ảnh/clipboard 100% Offline.</p>
                    </div>

                    <!-- Mode Selector Tabs -->
                    <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                        <button class="tool-btn tool-btn-primary" id="tab-btn-generate" style="flex: 1;">🔲 Tạo mã QR (Generate)</button>
                        <button class="tool-btn" id="tab-btn-scan" style="flex: 1;">🔍 Đọc / Giải mã QR (Scan & Decode)</button>
                    </div>

                    <!-- TAB 1: GENERATE QR CODE -->
                    <div id="tab-generate">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
                            
                            <!-- Left Settings Panel -->
                            <div>
                                <!-- Content Type -->
                                <div class="tool-group">
                                    <label class="tool-label">Loại nội dung QR</label>
                                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                        <button class="tool-btn tool-btn-primary qr-type-btn" data-type="text">🔗 URL / Text</button>
                                        <button class="tool-btn qr-type-btn" data-type="wifi">📶 Mạng Wi-Fi</button>
                                        <button class="tool-btn qr-type-btn" data-type="vcard">👤 Danh thiếp (vCard)</button>
                                    </div>
                                </div>

                                <!-- Text/URL Form -->
                                <div id="form-type-text" class="qr-form-section">
                                    <div class="tool-group">
                                        <label class="tool-label" for="qr-input-text">Văn bản / Đường dẫn Web (URL)</label>
                                        <textarea class="tool-textarea" id="qr-input-text" style="height: 110px;" placeholder="Nhập đường dẫn https://... hoặc nội dung cần tạo QR..."></textarea>
                                    </div>
                                </div>

                                <!-- Wi-Fi Form -->
                                <div id="form-type-wifi" class="qr-form-section" style="display: none;">
                                    <div class="tool-group">
                                        <label class="tool-label" for="wifi-ssid">Tên Wi-Fi (SSID)</label>
                                        <input type="text" class="tool-input" id="wifi-ssid" placeholder="Nhập tên mạng Wi-Fi...">
                                    </div>
                                    <div class="tool-group">
                                        <label class="tool-label" for="wifi-pass">Mật khẩu Wi-Fi</label>
                                        <input type="text" class="tool-input" id="wifi-pass" placeholder="Nhập mật khẩu...">
                                    </div>
                                    <div class="tool-group">
                                        <label class="tool-label" for="wifi-type">Mã hóa (Security)</label>
                                        <select class="tool-select" id="wifi-type">
                                            <option value="WPA">WPA / WPA2 / WPA3 (Phổ biến)</option>
                                            <option value="WEP">WEP</option>
                                            <option value="nopass">Không có mật khẩu (Mạng mở)</option>
                                        </select>
                                    </div>
                                    <div class="tool-inline" style="margin-top: 8px;">
                                        <label class="tool-checkbox">
                                            <input type="checkbox" id="wifi-hidden">
                                            <span>Mạng Wi-Fi ẩn (Hidden SSID)</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- vCard Form -->
                                <div id="form-type-vcard" class="qr-form-section" style="display: none;">
                                    <div class="tool-group">
                                        <label class="tool-label" for="vcard-name">Họ và tên</label>
                                        <input type="text" class="tool-input" id="vcard-name" placeholder="Nguyễn Văn A">
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                        <div class="tool-group">
                                            <label class="tool-label" for="vcard-phone">Số điện thoại</label>
                                            <input type="text" class="tool-input" id="vcard-phone" placeholder="0901234567">
                                        </div>
                                        <div class="tool-group">
                                            <label class="tool-label" for="vcard-email">Email</label>
                                            <input type="email" class="tool-input" id="vcard-email" placeholder="name@example.com">
                                        </div>
                                    </div>
                                    <div class="tool-group">
                                        <label class="tool-label" for="vcard-company">Công ty / Chức danh</label>
                                        <input type="text" class="tool-input" id="vcard-company" placeholder="DevTools Hub Corp">
                                    </div>
                                </div>

                                <!-- Customization Options Accordion -->
                                <div style="margin-top: 20px; border-top: 1px dashed var(--border-color); padding-top: 16px;">
                                    <h3 style="font-size: var(--fs-md); margin-bottom: 12px; color: var(--text-primary);">🎨 Tùy chỉnh hiển thị</h3>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                        <div class="tool-group">
                                            <label class="tool-label" for="qr-fg-color">Màu QR Code</label>
                                            <input type="color" class="tool-input" id="qr-fg-color" value="#000000" style="height: 38px; cursor: pointer; padding: 4px;">
                                        </div>
                                        <div class="tool-group">
                                            <label class="tool-label" for="qr-bg-color">Màu nền (Background)</label>
                                            <input type="color" class="tool-input" id="qr-bg-color" value="#ffffff" style="height: 38px; cursor: pointer; padding: 4px;">
                                        </div>
                                    </div>

                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                        <div class="tool-group">
                                            <label class="tool-label" for="qr-size">Kích thước (px)</label>
                                            <select class="tool-select" id="qr-size">
                                                <option value="200">200 x 200 px</option>
                                                <option value="300" selected>300 x 300 px</option>
                                                <option value="500">500 x 500 px</option>
                                                <option value="800">800 x 800 px</option>
                                            </select>
                                        </div>
                                        <div class="tool-group">
                                            <label class="tool-label" for="qr-ecc">Sửa lỗi (ECC Level)</label>
                                            <select class="tool-select" id="qr-ecc">
                                                <option value="L">L (7% Error Correction)</option>
                                                <option value="M" selected>M (15% Error Correction)</option>
                                                <option value="Q">Q (25% Error Correction)</option>
                                                <option value="H">H (30% High Reliability)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Live Preview & Export Panel -->
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
                                <div style="font-weight: var(--fw-semibold); margin-bottom: 16px; color: var(--text-secondary);">Live Interactive Preview</div>
                                
                                <div id="qr-canvas-wrapper" style="padding: 16px; background: #ffffff; border-radius: var(--radius-md); box-shadow: 0 8px 24px rgba(0,0,0,0.12); display: flex; justify-content: center; align-items: center; min-width: 240px; min-height: 240px;">
                                    <canvas id="qr-canvas"></canvas>
                                </div>

                                <div id="qr-status-msg" style="margin-top: 12px; font-size: var(--fs-xs); color: var(--text-tertiary); text-align: center;"></div>

                                <!-- Action Export Buttons -->
                                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; width: 100%; justify-content: center;">
                                    <button class="tool-btn tool-btn-primary" id="btn-download-png">📥 Tải PNG</button>
                                    <button class="tool-btn" id="btn-download-svg">📐 Tải SVG</button>
                                    <button class="tool-btn" id="btn-copy-base64">📋 Copy Base64</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- TAB 2: SCAN & DECODE QR CODE -->
                    <div id="tab-scan" style="display: none;">
                        <div style="max-width: 640px; margin: 0 auto;">
                            
                            <!-- Dropzone & Upload Input -->
                            <div id="qr-dropzone" style="border: 2px dashed var(--accent-primary); border-radius: var(--radius-lg); padding: 36px 20px; text-align: center; cursor: pointer; transition: background 0.2s ease; background: var(--bg-card);">
                                <div style="font-size: 3rem; margin-bottom: 12px;">📷</div>
                                <div style="font-weight: var(--fw-semibold); font-size: var(--fs-lg); margin-bottom: 8px;">Kéo & thả ảnh chứa mã QR vào đây</div>
                                <div style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: 16px;">Hoặc nhấn để chọn file ảnh từ máy tính / Hoặc dán trực tiếp từ Clipboard (<kbd>Ctrl + V</kbd>)</div>
                                <input type="file" id="qr-file-input" accept="image/*" style="display: none;">
                                <button class="tool-btn tool-btn-primary" id="btn-browse-file">📁 Chọn file ảnh</button>
                            </div>

                            <!-- Preview of uploaded image -->
                            <div id="scan-preview-container" style="display: none; margin-top: 20px; text-align: center;">
                                <img id="scan-preview-img" style="max-height: 250px; max-width: 100%; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                            </div>

                            <!-- Scan Output Result -->
                            <div id="scan-result-panel" style="margin-top: 24px; display: none;">
                                <label class="tool-label" style="color: var(--accent-success); font-weight: var(--fw-bold);">✅ Kết quả giải mã QR:</label>
                                <div class="tool-result">
                                    <textarea class="tool-textarea" id="scan-result-text" readonly style="height: 120px; font-family: var(--font-mono);"></textarea>
                                    <button class="tool-copy-btn" id="btn-copy-scan-result" title="Copy kết quả">📋</button>
                                </div>
                                <div style="display: flex; gap: 10px; margin-top: 12px;">
                                    <button class="tool-btn tool-btn-primary" id="btn-open-scan-url" style="display: none;">🔗 Mở đường dẫn URL</button>
                                    <button class="tool-btn tool-btn-danger" id="btn-clear-scan">🗑️ Xóa kết quả</button>
                                </div>
                            </div>

                            <!-- Scan Error -->
                            <div id="scan-error-msg" style="display: none; margin-top: 16px;" class="tool-info">
                                ❌ Không thể quét mã QR từ hình ảnh này. Trình duyệt của bạn có thể cần ảnh rõ nét hơn hoặc thử chọn ảnh có mã QR đơn giản hơn.
                            </div>

                        </div>
                    </div>

                </div>
            `;

            this.initEvents(container);
        },

        initEvents(container) {
            let activeType = 'text';

            // DOM elements
            const tabBtnGenerate = container.querySelector('#tab-btn-generate');
            const tabBtnScan = container.querySelector('#tab-btn-scan');
            const tabGenerate = container.querySelector('#tab-generate');
            const tabScan = container.querySelector('#tab-scan');

            const qrTypeBtns = container.querySelectorAll('.qr-type-btn');
            const formText = container.querySelector('#form-type-text');
            const formWifi = container.querySelector('#form-type-wifi');
            const formVcard = container.querySelector('#form-type-vcard');

            const inputText = container.querySelector('#qr-input-text');
            const wifiSsid = container.querySelector('#wifi-ssid');
            const wifiPass = container.querySelector('#wifi-pass');
            const wifiType = container.querySelector('#wifi-type');
            const wifiHidden = container.querySelector('#wifi-hidden');

            const vcardName = container.querySelector('#vcard-name');
            const vcardPhone = container.querySelector('#vcard-phone');
            const vcardEmail = container.querySelector('#vcard-email');
            const vcardCompany = container.querySelector('#vcard-company');

            const qrFgColor = container.querySelector('#qr-fg-color');
            const qrBgColor = container.querySelector('#qr-bg-color');
            const qrSize = container.querySelector('#qr-size');
            const qrEcc = container.querySelector('#qr-ecc');

            const canvas = container.querySelector('#qr-canvas');
            const statusMsg = container.querySelector('#qr-status-msg');

            const btnPng = container.querySelector('#btn-download-png');
            const btnSvg = container.querySelector('#btn-download-svg');
            const btnCopyBase64 = container.querySelector('#btn-copy-base64');

            // Scan Tab elements
            const dropzone = container.querySelector('#qr-dropzone');
            const fileInput = container.querySelector('#qr-file-input');
            const btnBrowseFile = container.querySelector('#btn-browse-file');
            const scanPreviewImg = container.querySelector('#scan-preview-img');
            const scanPreviewContainer = container.querySelector('#scan-preview-container');
            const scanResultPanel = container.querySelector('#scan-result-panel');
            const scanResultText = container.querySelector('#scan-result-text');
            const scanErrorMsg = container.querySelector('#scan-error-msg');
            const btnOpenScanUrl = container.querySelector('#btn-open-scan-url');
            const btnCopyScanResult = container.querySelector('#btn-copy-scan-result');
            const btnClearScan = container.querySelector('#btn-clear-scan');

            // --- Tab Switching ---
            tabBtnGenerate.addEventListener('click', () => {
                tabBtnGenerate.classList.add('tool-btn-primary');
                tabBtnScan.classList.remove('tool-btn-primary');
                tabGenerate.style.display = '';
                tabScan.style.display = 'none';
                updateQR();
            });

            tabBtnScan.addEventListener('click', () => {
                tabBtnScan.classList.add('tool-btn-primary');
                tabBtnGenerate.classList.remove('tool-btn-primary');
                tabScan.style.display = '';
                tabGenerate.style.display = 'none';
            });

            // --- Type Switching ---
            qrTypeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    qrTypeBtns.forEach(b => b.classList.remove('tool-btn-primary'));
                    btn.classList.add('tool-btn-primary');
                    activeType = btn.dataset.type;

                    formText.style.display = activeType === 'text' ? '' : 'none';
                    formWifi.style.display = activeType === 'wifi' ? '' : 'none';
                    formVcard.style.display = activeType === 'vcard' ? '' : 'none';

                    updateQR();
                });
            });

            // --- Construct Content Payload ---
            function getPayload() {
                if (activeType === 'text') {
                    return inputText.value.trim() || 'https://devtools-hub.com';
                }
                if (activeType === 'wifi') {
                    const ssid = wifiSsid.value.trim();
                    if (!ssid) return 'WIFI:S:MyWifiNetwork;T:WPA;P:Password123;';
                    const pass = wifiPass.value;
                    const type = wifiType.value;
                    const hidden = wifiHidden.checked ? 'H:true;' : '';
                    return `WIFI:S:${ssid};T:${type};P:${pass};${hidden}`;
                }
                if (activeType === 'vcard') {
                    const name = vcardName.value.trim() || 'Nguyen Van A';
                    const phone = vcardPhone.value.trim();
                    const email = vcardEmail.value.trim();
                    const company = vcardCompany.value.trim();
                    let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nN:${name};;;;`;
                    if (company) vcard += `\nORG:${company}`;
                    if (phone) vcard += `\nTEL;TYPE=CELL:${phone}`;
                    if (email) vcard += `\nEMAIL:${email}`;
                    vcard += `\nEND:VCARD`;
                    return vcard;
                }
                return 'DevTools Hub';
            }

            // --- Render QR Code onto Canvas ---
            function updateQR() {
                const payload = getPayload();
                const size = parseInt(qrSize.value, 10);
                const ecc = qrEcc.value;
                const fgColor = qrFgColor.value;
                const bgColor = qrBgColor.value;

                if (window.qrcode && window.qrcode.stringToBytesFuncs) {
                    window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs['UTF-8'];
                }

                try {
                    const qrModel = window.qrcode(0, ecc);
                    qrModel.addData(payload);
                    qrModel.make();
                    const moduleCount = qrModel.getModuleCount();
                    const margin = 2; // quiet zone in modules
                    const totalModules = moduleCount + margin * 2;
                    const cellSize = size / totalModules;

                    canvas.width = size;
                    canvas.height = size;
                    canvas.style.width = '240px';
                    canvas.style.height = '240px';

                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, size, size);

                    ctx.fillStyle = fgColor;
                    for (let r = 0; r < moduleCount; r++) {
                        for (let c = 0; c < moduleCount; c++) {
                            if (qrModel.isDark(r, c)) {
                                const x = Math.round((c + margin) * cellSize);
                                const y = Math.round((r + margin) * cellSize);
                                const w = Math.ceil((c + margin + 1) * cellSize) - x;
                                const h = Math.ceil((r + margin + 1) * cellSize) - y;
                                ctx.fillRect(x, y, w, h);
                            }
                        }
                    }

                    const version = (moduleCount - 17) / 4;
                    statusMsg.textContent = `Version ${version} (${moduleCount}x${moduleCount}) | Độ dài: ${payload.length} ký tự`;
                    statusMsg.style.color = 'var(--text-tertiary)';
                } catch (err) {
                    console.error('QR Render Error:', err);
                    statusMsg.textContent = `❌ ${err.message || 'Dữ liệu quá dài so với phiên bản QR hiện tại'}`;
                    statusMsg.style.color = 'var(--accent-danger)';
                }
            }

            // --- Bind real-time input events ---
            const inputsToBind = [
                inputText, wifiSsid, wifiPass, wifiType, wifiHidden,
                vcardName, vcardPhone, vcardEmail, vcardCompany,
                qrFgColor, qrBgColor, qrSize, qrEcc
            ];

            inputsToBind.forEach(el => {
                if (el) {
                    el.addEventListener('input', updateQR);
                    el.addEventListener('change', updateQR);
                    el.addEventListener('keyup', updateQR);
                }
            });

            // Default initial value & render
            inputText.value = 'https://devtools-hub.com';
            setTimeout(updateQR, 50);

            // --- Export Actions ---
            btnPng.addEventListener('click', () => {
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                if (window.showToast) window.showToast('Đã tải xuống file qrcode.png!', 'success');
            });

            btnSvg.addEventListener('click', () => {
                try {
                    const dataUrl = canvas.toDataURL('image/png');
                    const width = canvas.width;
                    const height = canvas.height;

                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><image href="${dataUrl}" width="${width}" height="${height}"/></svg>`;

                    const blob = new Blob([svg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'qrcode.svg';
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                    if (window.showToast) window.showToast('Đã tải xuống file qrcode.svg!', 'success');
                } catch (e) {
                    if (window.showToast) window.showToast('Lỗi khi tạo file SVG', 'error');
                }
            });

            btnCopyBase64.addEventListener('click', () => {
                const base64 = canvas.toDataURL('image/png');
                if (window.copyToClipboard) window.copyToClipboard(base64, btnCopyBase64);
            });

            // =========================================================================
            // SCAN / DECODE LOGIC
            // =========================================================================
            if (btnBrowseFile) {
                btnBrowseFile.addEventListener('click', (e) => {
                    e.preventDefault();
                    fileInput.click();
                });
            }

            dropzone.addEventListener('click', (e) => {
                if (e.target !== btnBrowseFile) {
                    fileInput.click();
                }
            });

            function processScanImage(imageSource) {
                scanErrorMsg.style.display = 'none';
                scanResultPanel.style.display = 'none';

                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = async () => {
                    scanPreviewImg.src = img.src;
                    scanPreviewContainer.style.display = '';

                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = img.naturalWidth || img.width;
                    tempCanvas.height = img.naturalHeight || img.height;
                    const ctx = tempCanvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    // Native BarcodeDetector API if available in browser
                    if ('BarcodeDetector' in window) {
                        try {
                            const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
                            const barcodes = await barcodeDetector.detect(tempCanvas);
                            if (barcodes && barcodes.length > 0) {
                                displayScanResult(barcodes[0].rawValue);
                                return;
                            }
                        } catch (e) {
                            console.warn('BarcodeDetector fallback:', e);
                        }
                    }

                    scanErrorMsg.style.display = '';
                };
                img.onerror = () => {
                    scanErrorMsg.style.display = '';
                };
                img.src = imageSource;
            }

            function displayScanResult(text) {
                scanErrorMsg.style.display = 'none';
                scanResultPanel.style.display = '';
                scanResultText.value = text;

                const isUrl = /^https?:\/\/[^\s]+$/i.test(text.trim());
                if (isUrl) {
                    btnOpenScanUrl.style.display = '';
                    btnOpenScanUrl.onclick = () => window.open(text.trim(), '_blank', 'noopener,noreferrer');
                } else {
                    btnOpenScanUrl.style.display = 'none';
                }
                if (window.showToast) window.showToast('Đã giải mã QR thành công!', 'success');
            }

            // Drag & Drop
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.style.background = 'var(--bg-hover)';
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.style.background = 'var(--bg-card)';
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.style.background = 'var(--bg-card)';
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => processScanImage(event.target.result);
                    reader.readAsDataURL(e.dataTransfer.files[0]);
                }
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => processScanImage(event.target.result);
                    reader.readAsDataURL(e.target.files[0]);
                }
            });

            if (window._qrPasteHandler) {
                document.removeEventListener('paste', window._qrPasteHandler);
            }
            window._qrPasteHandler = (e) => {
                if (tabScan.style.display === 'none') return;
                if (!e.clipboardData) return;
                const items = e.clipboardData.items;
                for (let index = 0; index < items.length; index++) {
                    const item = items[index];
                    if (item.kind === 'file' && item.type.startsWith('image/')) {
                        const blob = item.getAsFile();
                        const reader = new FileReader();
                        reader.onload = (event) => processScanImage(event.target.result);
                        reader.readAsDataURL(blob);
                        break;
                    }
                }
            };
            document.addEventListener('paste', window._qrPasteHandler);

            btnCopyScanResult.addEventListener('click', () => {
                if (window.copyToClipboard) window.copyToClipboard(scanResultText.value, btnCopyScanResult);
            });

            btnClearScan.addEventListener('click', () => {
                scanResultText.value = '';
                scanResultPanel.style.display = 'none';
                scanPreviewContainer.style.display = 'none';
                scanErrorMsg.style.display = 'none';
                fileInput.value = '';
            });
        }
    };

    // Register tool globally
    window.DevTools = window.DevTools || [];
    window.DevTools.push(QRCodeTool);
})();
