/* ============================================
   DevTools Hub - JSON Schema Generator & Validator
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'JSON Schema Generator',
    icon: '📐',
    category: 'Formatter',
    description: 'Tự động suy luận và sinh chuẩn JSON Schema (Draft-07 / 2020-12) từ dữ liệu JSON',

    render(container) {
        if (!document.getElementById('jsonschema-tool-style')) {
            const style = document.createElement('style');
            style.id = 'jsonschema-tool-style';
            style.textContent = `
                .jsch-options-bar { display: flex; flex-wrap: wrap; gap: 1rem; align-items: center; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 1rem; }
                .jsch-opt-group { display: flex; align-items: center; gap: 0.4rem; font-size: var(--fs-sm); color: var(--text-secondary); }
                .jsch-opt-group select { background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; padding: 4px 8px; font-size: 13px; }
                .jsch-opt-group input[type="checkbox"] { accent-color: var(--accent-primary); }
                .jsch-validate-box { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; margin-top: 1.5rem; }
                .jsch-status-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
                .jsch-status-valid { background: rgba(16, 185, 129, 0.15); color: var(--accent-success); border: 1px solid rgba(16, 185, 129, 0.3); }
                .jsch-status-invalid { background: rgba(239, 68, 68, 0.15); color: var(--accent-danger); border: 1px solid rgba(239, 68, 68, 0.3); }
            `;
            document.head.appendChild(style);
        }

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>📐 JSON Schema Generator & Validator</h2>
                    <p class="tool-description">Tự động phân tích kiểu dữ liệu và sinh tài liệu chuẩn JSON Schema (Draft-07 / 2020-12) cho API contract và kiểm thử dữ liệu.</p>
                </div>
                <div class="tool-body">
                    <!-- Actions Toolbar -->
                    <div class="tool-actions" style="margin-bottom: 1rem; justify-content: space-between; flex-wrap: wrap;">
                        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                            <button type="button" class="tool-btn tool-btn-primary" id="jsch-btn-generate">⚡ Sinh Schema</button>
                            <button type="button" class="tool-btn" id="jsch-btn-sample">📝 Dữ liệu mẫu</button>
                            <button type="button" class="tool-btn tool-btn-danger" id="jsch-btn-clear">Xóa</button>
                        </div>
                        <div style="display:flex; gap:0.5rem;">
                            <button type="button" class="tool-btn tool-btn-sm" id="jsch-btn-download">💾 Tải schema.json</button>
                            <button type="button" class="tool-btn tool-btn-primary tool-btn-sm" id="jsch-btn-copy">📋 Copy Schema</button>
                        </div>
                    </div>

                    <!-- Options Bar -->
                    <div class="jsch-options-bar">
                        <div class="jsch-opt-group">
                            <label>Draft:</label>
                            <select id="jsch-opt-draft">
                                <option value="draft-07" selected>Draft-07</option>
                                <option value="2020-12">2020-12</option>
                            </select>
                        </div>
                        <div class="jsch-opt-group">
                            <label>Trường bắt buộc (Required):</label>
                            <select id="jsch-opt-required">
                                <option value="all" selected>Tất cả thuộc tính</option>
                                <option value="none">Không bắt buộc</option>
                            </select>
                        </div>
                        <div class="jsch-opt-group">
                            <input type="checkbox" id="jsch-opt-formats" checked>
                            <label for="jsch-opt-formats">Nhận diện định dạng (email, url, uuid, date-time)</label>
                        </div>
                        <div class="jsch-opt-group">
                            <input type="checkbox" id="jsch-opt-examples" checked>
                            <label for="jsch-opt-examples">Kèm giá trị ví dụ (examples)</label>
                        </div>
                    </div>

                    <!-- Split Input / Output -->
                    <div class="tool-split">
                        <div class="tool-group">
                            <label class="tool-label">Dữ liệu JSON đầu vào</label>
                            <textarea id="jsch-input" class="tool-textarea" style="min-height: 380px; font-family: monospace; font-size: 13px;" placeholder='{\n  "id": 101,\n  "username": "johndoe",\n  "email": "john@example.com"\n}'></textarea>
                        </div>

                        <div class="tool-group">
                            <label class="tool-label">JSON Schema được sinh ra</label>
                            <div class="tool-result">
                                <textarea id="jsch-output" class="tool-textarea" style="min-height: 380px; font-family: monospace; font-size: 13px;" readonly placeholder="JSON Schema sẽ hiển thị ở đây..."></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Test Validation Section -->
                    <div class="jsch-validate-box">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.75rem; flex-wrap:wrap; gap:0.5rem;">
                            <div>
                                <h3 style="margin:0; font-size:1rem; color:var(--text-primary);">🧪 Kiểm thử dữ liệu mẫu với Schema vừa tạo</h3>
                                <span style="font-size:var(--fs-xs); color:var(--text-secondary);">Dán một JSON khác để kiểm tra xem có khớp với Schema không</span>
                            </div>
                            <span id="jsch-val-badge" class="jsch-status-badge jsch-status-valid">Chờ kiểm tra</span>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; align-items: start;">
                            <textarea id="jsch-test-input" class="tool-textarea" style="min-height: 100px; font-family: monospace; font-size: 13px;" placeholder="Dán JSON cần kiểm tra..."></textarea>
                            <button type="button" class="tool-btn tool-btn-primary" id="jsch-btn-test" style="height: fit-content;">Kiểm tra ngay</button>
                        </div>
                        <div id="jsch-test-error" style="color:var(--accent-danger); font-size:var(--fs-sm); margin-top:0.5rem; display:none;"></div>
                    </div>
                </div>
            </div>
        `;

        const inputEl = container.querySelector('#jsch-input');
        const outputEl = container.querySelector('#jsch-output');
        const generateBtn = container.querySelector('#jsch-btn-generate');
        const sampleBtn = container.querySelector('#jsch-btn-sample');
        const clearBtn = container.querySelector('#jsch-btn-clear');
        const copyBtn = container.querySelector('#jsch-btn-copy');
        const downloadBtn = container.querySelector('#jsch-btn-download');

        const optDraft = container.querySelector('#jsch-opt-draft');
        const optRequired = container.querySelector('#jsch-opt-required');
        const optFormats = container.querySelector('#jsch-opt-formats');
        const optExamples = container.querySelector('#jsch-opt-examples');

        const testInput = container.querySelector('#jsch-test-input');
        const testBtn = container.querySelector('#jsch-btn-test');
        const valBadge = container.querySelector('#jsch-val-badge');
        const testError = container.querySelector('#jsch-test-error');

        const sampleData = {
            id: 1001,
            name: "DevTools Hub Professional",
            price: 49.99,
            isActive: true,
            contactEmail: "support@devtoolshub.com",
            homepage: "https://devtoolshub.com",
            createdAt: "2026-09-27T12:00:00Z",
            uuid: "c3d2e1a0-5b4a-4e3a-9c1a-8f7e6d5c4b3a",
            tags: ["developer", "tools", "utilities"],
            author: {
                name: "Trịnh Gia Bảo",
                github: "https://github.com/gbao86",
                verified: true
            }
        };

        function detectFormat(str) {
            if (typeof str !== 'string') return null;
            // UUID
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)) {
                return 'uuid';
            }
            // Email
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
                return 'email';
            }
            // Date-time ISO
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i.test(str)) {
                return 'date-time';
            }
            // URI / URL
            if (/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(str)) {
                return 'uri';
            }
            // IPv4
            if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str)) {
                return 'ipv4';
            }
            return null;
        }

        function generateSchemaForValue(val, options) {
            if (val === null) {
                return { type: "null" };
            }

            const type = typeof val;

            if (type === 'boolean') {
                const s = { type: "boolean" };
                if (options.includeExamples) s.examples = [val];
                return s;
            }

            if (type === 'number') {
                const s = { type: Number.isInteger(val) ? "integer" : "number" };
                if (options.includeExamples) s.examples = [val];
                return s;
            }

            if (type === 'string') {
                const s = { type: "string" };
                if (options.detectFormats) {
                    const fmt = detectFormat(val);
                    if (fmt) s.format = fmt;
                }
                if (options.includeExamples) s.examples = [val];
                return s;
            }

            if (Array.isArray(val)) {
                const s = { type: "array" };
                if (val.length === 0) {
                    s.items = {};
                } else {
                    // Merge array items
                    if (typeof val[0] === 'object' && val[0] !== null) {
                        const mergedObj = {};
                        val.forEach(item => {
                            if (typeof item === 'object' && item !== null) {
                                Object.assign(mergedObj, item);
                            }
                        });
                        s.items = generateSchemaForValue(mergedObj, options);
                    } else {
                        s.items = generateSchemaForValue(val[0], options);
                    }
                }
                return s;
            }

            if (type === 'object') {
                const s = {
                    type: "object",
                    properties: {}
                };
                const keys = Object.keys(val);
                keys.forEach(k => {
                    s.properties[k] = generateSchemaForValue(val[k], options);
                });

                if (options.requiredMode === 'all' && keys.length > 0) {
                    s.required = keys;
                }
                return s;
            }

            return {};
        }

        function buildFullSchema(jsonObj) {
            const draft = optDraft.value;
            const schemaUrl = draft === '2020-12'
                ? "https://json-schema.org/draft/2020-12/schema"
                : "http://json-schema.org/draft-07/schema#";

            const options = {
                requiredMode: optRequired.value,
                detectFormats: optFormats.checked,
                includeExamples: optExamples.checked
            };

            const rootSchema = generateSchemaForValue(jsonObj, options);
            return {
                $schema: schemaUrl,
                title: "RootObject",
                ...rootSchema
            };
        }

        function generate() {
            const raw = inputEl.value.trim();
            if (!raw) {
                outputEl.value = '';
                return;
            }

            try {
                const parsed = JSON.parse(raw);
                const schema = buildFullSchema(parsed);
                outputEl.value = JSON.stringify(schema, null, 2);
                if (window.showToast) window.showToast('Đã sinh JSON Schema thành công!', 'success');
            } catch (err) {
                outputEl.value = `❌ Lỗi cú pháp JSON đầu vào:\n${err.message}`;
            }
        }

        // Basic in-browser schema validator for testing
        function validateSimple(data, schema) {
            const errors = [];

            function check(val, sch, path) {
                if (!sch || typeof sch !== 'object') return;

                if (sch.type) {
                    const valType = typeof val;
                    if (sch.type === 'integer' && (!Number.isInteger(val))) {
                        errors.push(`Trường "${path}": Cần kiểu integer, nhận được ${valType}`);
                    } else if (sch.type === 'number' && valType !== 'number') {
                        errors.push(`Trường "${path}": Cần kiểu number, nhận được ${valType}`);
                    } else if (sch.type === 'string' && valType !== 'string') {
                        errors.push(`Trường "${path}": Cần kiểu string, nhận được ${valType}`);
                    } else if (sch.type === 'boolean' && valType !== 'boolean') {
                        errors.push(`Trường "${path}": Cần kiểu boolean, nhận được ${valType}`);
                    } else if (sch.type === 'array' && !Array.isArray(val)) {
                        errors.push(`Trường "${path}": Cần kiểu array, nhận được ${valType}`);
                    } else if (sch.type === 'object' && (valType !== 'object' || val === null || Array.isArray(val))) {
                        errors.push(`Trường "${path}": Cần kiểu object, nhận được ${valType}`);
                    }
                }

                if (sch.required && Array.isArray(sch.required) && typeof val === 'object' && val !== null) {
                    sch.required.forEach(reqKey => {
                        if (!(reqKey in val)) {
                            errors.push(`Thiếu trường bắt buộc "${path ? path + '.' : ''}${reqKey}"`);
                        }
                    });
                }

                if (sch.properties && typeof val === 'object' && val !== null && !Array.isArray(val)) {
                    Object.keys(sch.properties).forEach(k => {
                        if (k in val) {
                            check(val[k], sch.properties[k], path ? `${path}.${k}` : k);
                        }
                    });
                }

                if (sch.items && Array.isArray(val)) {
                    val.forEach((item, idx) => {
                        check(item, sch.items, `${path}[${idx}]`);
                    });
                }
            }

            check(data, schema, '');
            return errors;
        }

        function runTestValidation() {
            testError.style.display = 'none';
            testError.innerHTML = '';

            const schemaRaw = outputEl.value.trim();
            const dataRaw = testInput.value.trim();

            if (!schemaRaw || schemaRaw.startsWith('❌')) {
                valBadge.textContent = 'Chưa có Schema hợp lệ';
                valBadge.className = 'jsch-status-badge jsch-status-invalid';
                return;
            }

            if (!dataRaw) {
                valBadge.textContent = 'Dữ liệu kiểm tra trống';
                valBadge.className = 'jsch-status-badge jsch-status-invalid';
                return;
            }

            try {
                const schema = JSON.parse(schemaRaw);
                const data = JSON.parse(dataRaw);
                const errors = validateSimple(data, schema);

                if (errors.length === 0) {
                    valBadge.textContent = '✅ Hợp lệ (Valid)';
                    valBadge.className = 'jsch-status-badge jsch-status-valid';
                } else {
                    valBadge.textContent = `❌ ${errors.length} lỗi không khớp`;
                    valBadge.className = 'jsch-status-badge jsch-status-invalid';
                    testError.style.display = 'block';
                    testError.innerHTML = errors.map(e => `• ${e}`).join('<br>');
                }
            } catch (err) {
                valBadge.textContent = '❌ Lỗi cú pháp JSON';
                valBadge.className = 'jsch-status-badge jsch-status-invalid';
                testError.style.display = 'block';
                testError.textContent = `Cú pháp JSON không hợp lệ: ${err.message}`;
            }
        }

        generateBtn.addEventListener('click', generate);

        sampleBtn.addEventListener('click', () => {
            inputEl.value = JSON.stringify(sampleData, null, 2);
            testInput.value = JSON.stringify({
                id: 1002,
                name: "Product Test",
                price: 19.5,
                isActive: false,
                contactEmail: "test@example.com",
                homepage: "https://example.com",
                createdAt: "2026-09-27T10:00:00Z",
                uuid: "123e4567-e89b-12d3-a456-426614174000",
                tags: ["test"],
                author: { name: "Tester", github: "https://github.com", verified: false }
            }, null, 2);
            generate();
        });

        clearBtn.addEventListener('click', () => {
            inputEl.value = '';
            outputEl.value = '';
            testInput.value = '';
            testError.style.display = 'none';
            valBadge.textContent = 'Chờ kiểm tra';
            valBadge.className = 'jsch-status-badge jsch-status-valid';
        });

        copyBtn.addEventListener('click', () => {
            if (!outputEl.value.trim() || outputEl.value.startsWith('❌')) return;
            if (window.copyToClipboard) {
                window.copyToClipboard(outputEl.value, copyBtn);
            } else {
                navigator.clipboard.writeText(outputEl.value);
            }
        });

        downloadBtn.addEventListener('click', () => {
            const raw = outputEl.value.trim();
            if (!raw || raw.startsWith('❌')) return;
            const blob = new Blob([raw], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'schema.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (window.showToast) window.showToast('Đã tải schema.json', 'success');
        });

        testBtn.addEventListener('click', runTestValidation);

        [optDraft, optRequired, optFormats, optExamples].forEach(ctrl => {
            ctrl.addEventListener('change', generate);
        });

        // Initialize with sample
        inputEl.value = JSON.stringify(sampleData, null, 2);
        generate();
    }
});
