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

        // --- Simple YAML Serializer ---
        const toYaml = (data, indent = 0) => {
            if (data === null) return 'null';
            if (typeof data === 'boolean') return data ? 'true' : 'false';
            if (typeof data === 'number') return data.toString();
            if (typeof data === 'string') {
                if (data.includes('\n')) {
                    return '|\n' + data.split('\n').map(line => ' '.repeat(indent + 2) + line).join('\n');
                }
                if (data === '' || data.includes(':') || data.includes(' ') || data.startsWith('-') || data.includes('#')) {
                    return JSON.stringify(data);
                }
                return data;
            }
            if (Array.isArray(data)) {
                if (data.length === 0) return '[]';
                let yaml = '';
                const spaces = ' '.repeat(indent);
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    if (typeof item === 'object' && item !== null) {
                        const itemStr = toYaml(item, indent + 2);
                        yaml += `${i > 0 ? '\n' : ''}${spaces}- ${itemStr.trimStart()}`;
                    } else {
                        yaml += `${i > 0 ? '\n' : ''}${spaces}- ${toYaml(item, indent)}`;
                    }
                }
                return yaml;
            }
            if (typeof data === 'object') {
                const keys = Object.keys(data);
                if (keys.length === 0) return '{}';
                let yaml = '';
                const spaces = ' '.repeat(indent);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    const val = data[key];
                    const safeKey = /^[a-zA-Z0-9_]+$/.test(key) ? key : JSON.stringify(key);
                    
                    if (typeof val === 'object' && val !== null && (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0)) {
                        yaml += `${i > 0 ? '\n' : ''}${spaces}${safeKey}:\n${toYaml(val, indent + 2)}`;
                    } else {
                        yaml += `${i > 0 ? '\n' : ''}${spaces}${safeKey}: ${toYaml(val, indent)}`;
                    }
                }
                return yaml;
            }
            return '';
        };

        // --- Simple YAML Parser ---
        const parseYaml = (yamlStr) => {
            const lines = yamlStr.split('\n');
            let i = 0;

            const getIndent = (str) => {
                const match = str.match(/^ */);
                return match ? match[0].length : 0;
            };

            const parseValue = (str) => {
                str = str.trim();
                if (str === 'null') return null;
                if (str === 'true') return true;
                if (str === 'false') return false;
                if (!isNaN(str) && str !== '') return Number(str);
                if (str.startsWith('"') && str.endsWith('"')) {
                    try { return JSON.parse(str); } catch(e) {}
                }
                if (str.startsWith("'") && str.endsWith("'")) return str.slice(1, -1);
                return str;
            };

            const parseBlock = (minIndent) => {
                let obj = null;
                let isArray = false;
                
                while (i < lines.length) {
                    const line = lines[i];
                    if (line.trim() === '' || line.trim().startsWith('#')) {
                        i++;
                        continue;
                    }
                    const currentIndent = getIndent(line);
                    if (currentIndent < minIndent) {
                        break;
                    }
                    
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('- ')) {
                        if (obj === null) {
                            obj = [];
                            isArray = true;
                        } else if (!isArray) {
                            throw new Error('Mixed object and array');
                        }
                        
                        const valuePart = trimmedLine.slice(2).trim();
                        if (valuePart === '') {
                            i++;
                            const child = parseBlock(currentIndent + 2);
                            obj.push(child);
                        } else {
                            if (valuePart.includes(':') && !valuePart.startsWith('"') && !valuePart.startsWith("'")) {
                                // inline object item
                                const parts = valuePart.split(/:(.*)/s);
                                const itemObj = {};
                                itemObj[parts[0].trim()] = parseValue(parts[1] || '');
                                obj.push(itemObj);
                                i++;
                            } else {
                                obj.push(parseValue(valuePart));
                                i++;
                            }
                        }
                    } else {
                        if (obj === null) {
                            obj = {};
                        } else if (isArray) {
                            throw new Error('Mixed array and object');
                        }
                        
                        const colonIdx = line.indexOf(':');
                        if (colonIdx === -1) {
                            // Maybe string multi-line? Simplify by just using as key with null if bad syntax
                            throw new Error('Invalid key:value format on line ' + (i+1));
                        }
                        
                        const keyPart = line.substring(0, colonIdx).trim();
                        const key = keyPart.startsWith('"') && keyPart.endsWith('"') ? JSON.parse(keyPart) : keyPart;
                        let valuePart = line.substring(colonIdx + 1).trim();
                        
                        if (valuePart === '') {
                            i++;
                            obj[key] = parseBlock(currentIndent + 1);
                        } else if (valuePart === '|') {
                            i++;
                            let multiLineStr = [];
                            while (i < lines.length && (getIndent(lines[i]) > currentIndent || lines[i].trim() === '')) {
                                multiLineStr.push(lines[i].substring(currentIndent + 2) || '');
                                i++;
                            }
                            obj[key] = multiLineStr.join('\n');
                        } else {
                            obj[key] = parseValue(valuePart);
                            i++;
                        }
                    }
                }
                return obj !== null ? obj : '';
            };

            return parseBlock(0);
        };

        // Handlers
        btnJsonToYaml.addEventListener('click', () => {
            try {
                if (!jsonInput.value.trim()) return;
                const obj = JSON.parse(jsonInput.value);
                yamlInput.value = toYaml(obj);
                if(window.showToast) window.showToast('Đã chuyển đổi JSON sang YAML', 'success');
            } catch (e) {
                if(window.showToast) window.showToast('Lỗi JSON: ' + e.message, 'error');
                else alert('Lỗi JSON: ' + e.message);
            }
        });

        btnYamlToJson.addEventListener('click', () => {
            try {
                if (!yamlInput.value.trim()) return;
                const obj = parseYaml(yamlInput.value);
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
                    try { parseYaml(yamlInput.value); btnYamlToJson.click(); } catch(err){}
                }
            }, 100);
        });
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(JsonYamlConverterTool);
