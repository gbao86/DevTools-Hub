const JsonYamlConverterTool = {
    name: 'JSON ↔ YAML',
    icon: '🔀',
    category: 'Converter',
    description: 'Chuyển đổi qua lại giữa định dạng JSON và YAML',
    
    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>JSON ↔ YAML Converter</h2>
                    <p class="tool-description">Chuyển đổi dữ liệu giữa định dạng JSON và YAML. Hỗ trợ tự động nhận dạng định dạng đầu vào.</p>
                </div>
                
                <div class="tool-actions" style="margin-bottom: 1rem;">
                    <button id="jyc-json-to-yaml" class="tool-btn tool-btn-primary">JSON → YAML</button>
                    <button id="jyc-yaml-to-json" class="tool-btn tool-btn-primary">YAML → JSON</button>
                    <button id="jyc-clear" class="tool-btn tool-btn-danger">Xóa (Clear)</button>
                </div>
                
                <div class="tool-split">
                    <div class="tool-group">
                        <label class="tool-label">
                            JSON Input / Output
                            <button id="jyc-copy-json" class="tool-btn tool-btn-sm" style="float: right;">Copy</button>
                        </label>
                        <textarea id="jyc-json-input" class="tool-textarea" style="height: 500px;" placeholder="Nhập JSON vào đây..."></textarea>
                    </div>
                    <div class="tool-group">
                        <label class="tool-label">
                            YAML Input / Output
                            <button id="jyc-copy-yaml" class="tool-btn tool-btn-sm" style="float: right;">Copy</button>
                        </label>
                        <textarea id="jyc-yaml-input" class="tool-textarea" style="height: 500px;" placeholder="Nhập YAML vào đây..."></textarea>
                    </div>
                </div>
            </div>
        `;

        const jsonInput = container.querySelector('#jyc-json-input');
        const yamlInput = container.querySelector('#jyc-yaml-input');
        const btnJsonToYaml = container.querySelector('#jyc-json-to-yaml');
        const btnYamlToJson = container.querySelector('#jyc-yaml-to-json');
        const btnClear = container.querySelector('#jyc-clear');
        const btnCopyJson = container.querySelector('#jyc-copy-json');
        const btnCopyYaml = container.querySelector('#jyc-copy-yaml');

        // Handlers using js-yaml library
        btnJsonToYaml.addEventListener('click', () => {
            try {
                if (!jsonInput.value.trim()) return;
                const obj = JSON.parse(jsonInput.value);
                if (typeof jsyaml !== 'undefined') {
                    yamlInput.value = jsyaml.dump(obj, { indent: 2 });
                } else {
                    throw new Error('Thư viện js-yaml chưa được tải.');
                }
                if(window.showToast) window.showToast('Đã chuyển đổi JSON sang YAML', 'success');
            } catch (e) {
                if(window.showToast) window.showToast('Lỗi JSON: ' + e.message, 'error');
                else alert('Lỗi JSON: ' + e.message);
            }
        });

        btnYamlToJson.addEventListener('click', () => {
            try {
                if (!yamlInput.value.trim()) return;
                let obj;
                if (typeof jsyaml !== 'undefined') {
                    obj = jsyaml.load(yamlInput.value);
                } else {
                    throw new Error('Thư viện js-yaml chưa được tải.');
                }
                jsonInput.value = JSON.stringify(obj, null, 4);
                if(window.showToast) window.showToast('Đã chuyển đổi YAML sang JSON', 'success');
            } catch (e) {
                if(window.showToast) window.showToast('Lỗi YAML: ' + e.message, 'error');
                else alert('Lỗi YAML: ' + e.message);
            }
        });

        btnClear.addEventListener('click', () => {
            jsonInput.value = '';
            yamlInput.value = '';
        });

        btnCopyJson.addEventListener('click', () => {
            if (window.copyToClipboard) window.copyToClipboard(jsonInput.value, btnCopyJson);
            else { navigator.clipboard.writeText(jsonInput.value); btnCopyJson.innerText = 'Copied!'; setTimeout(() => btnCopyJson.innerText = 'Copy', 2000); }
        });

        btnCopyYaml.addEventListener('click', () => {
            if (window.copyToClipboard) window.copyToClipboard(yamlInput.value, btnCopyYaml);
            else { navigator.clipboard.writeText(yamlInput.value); btnCopyYaml.innerText = 'Copied!'; setTimeout(() => btnCopyYaml.innerText = 'Copy', 2000); }
        });
        
        // Auto-detect based on input
        jsonInput.addEventListener('paste', (e) => {
            setTimeout(() => {
                if (!yamlInput.value) {
                    try { JSON.parse(jsonInput.value); btnJsonToYaml.click(); } catch(err){}
                }
            }, 100);
        });
        yamlInput.addEventListener('paste', (e) => {
            setTimeout(() => {
                if (!jsonInput.value) {
                    try { if (typeof jsyaml !== 'undefined') jsyaml.load(yamlInput.value); btnYamlToJson.click(); } catch(err){}
                }
            }, 100);
        });
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(JsonYamlConverterTool);
