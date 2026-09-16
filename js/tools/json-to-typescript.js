/* ============================================
   DevTools Hub - JSON to TypeScript Converter
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'JSON to TypeScript',
    icon: '🔀',
    category: 'Converter',
    description: 'Chuyển đổi JSON sang TypeScript interface/type tự động',

    render(container) {
        container.innerHTML = `
            <style>
                .j2t-options { display: flex; gap: var(--space-sm); flex-wrap: wrap; align-items: center; }
                .j2t-option-group { display: flex; align-items: center; gap: var(--space-xs); }
                .j2t-option-group label { font-size: var(--fs-sm); color: var(--text-secondary); cursor: pointer; user-select: none; }
                .j2t-option-group input[type="checkbox"] { accent-color: var(--accent-primary); }
                .j2t-root-name { width: 160px; }
            </style>
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>JSON to TypeScript</h2>
                    <p class="tool-description">Chuyển đổi JSON sang TypeScript interface hoặc type tự động. Hỗ trợ nested objects, arrays, union types.</p>
                </div>
                <div class="tool-body">
                    <div class="j2t-options">
                        <div class="tool-group" style="flex:0 0 auto;">
                            <label class="tool-label">Root Name</label>
                            <input type="text" id="j2t-root" class="tool-input j2t-root-name" value="RootObject" placeholder="RootObject">
                        </div>
                        <div class="j2t-option-group">
                            <input type="checkbox" id="j2t-use-interface" checked>
                            <label for="j2t-use-interface">interface (bỏ chọn = type)</label>
                        </div>
                        <div class="j2t-option-group">
                            <input type="checkbox" id="j2t-export">
                            <label for="j2t-export">export</label>
                        </div>
                        <div class="j2t-option-group">
                            <input type="checkbox" id="j2t-auto" checked>
                            <label for="j2t-auto">Tự động chuyển đổi</label>
                        </div>
                    </div>

                    <div class="tool-actions">
                        <button class="tool-btn tool-btn-primary" id="j2t-convert">Chuyển đổi</button>
                        <button class="tool-btn" id="j2t-sample">📝 Dữ liệu mẫu</button>
                        <button class="tool-btn tool-btn-danger" id="j2t-clear">Xóa</button>
                    </div>

                    <div class="tool-split">
                        <div class="tool-group">
                            <label class="tool-label">JSON Input</label>
                            <textarea id="j2t-input" class="tool-textarea" style="min-height:400px;font-size:13px;" placeholder='{\n  "id": 1,\n  "name": "DevTools Hub",\n  "tags": ["tool", "dev"]\n}'></textarea>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">TypeScript Output</label>
                            <div class="tool-result">
                                <textarea id="j2t-output" class="tool-textarea" style="min-height:400px;font-size:13px;" readonly placeholder="TypeScript interfaces sẽ hiển thị ở đây..."></textarea>
                                <button class="tool-copy-btn" id="j2t-copy">📋 Copy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const inputEl = container.querySelector('#j2t-input');
        const outputEl = container.querySelector('#j2t-output');
        const rootEl = container.querySelector('#j2t-root');
        const useInterfaceEl = container.querySelector('#j2t-use-interface');
        const exportEl = container.querySelector('#j2t-export');
        const autoEl = container.querySelector('#j2t-auto');
        const convertBtn = container.querySelector('#j2t-convert');
        const sampleBtn = container.querySelector('#j2t-sample');
        const clearBtn = container.querySelector('#j2t-clear');
        const copyBtn = container.querySelector('#j2t-copy');

        const sampleJSON = JSON.stringify({
            id: 1,
            name: "DevTools Hub",
            email: "dev@example.com",
            isActive: true,
            score: 98.5,
            tags: ["developer", "tools", "web"],
            address: {
                street: "123 Main St",
                city: "Ho Chi Minh",
                country: "Vietnam",
                zipCode: "70000"
            },
            projects: [
                { id: 101, title: "Project Alpha", stars: 42, isPublic: true },
                { id: 102, title: "Project Beta", stars: 18, isPublic: false }
            ],
            metadata: null
        }, null, 2);

        function toPascalCase(str) {
            return str
                .replace(/[^a-zA-Z0-9]+/g, ' ')
                .trim()
                .split(/\s+/)
                .map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); })
                .join('') || 'Unknown';
        }

        function convert() {
            var jsonStr = inputEl.value.trim();
            if (!jsonStr) { outputEl.value = ''; return; }

            var rootName = rootEl.value.trim() || 'RootObject';
            var useInterface = useInterfaceEl.checked;
            var addExport = exportEl.checked;

            try {
                var parsed = JSON.parse(jsonStr);
            } catch (e) {
                outputEl.value = '// ❌ JSON không hợp lệ: ' + e.message;
                window.showToast('JSON không hợp lệ: ' + e.message, 'error');
                return;
            }

            var output = [];
            var usedNames = {};

            function getUniqueName(name) {
                if (!usedNames[name]) { usedNames[name] = 1; return name; }
                var n = ++usedNames[name];
                while (usedNames[name + n]) n++;
                usedNames[name + n] = 1;
                return name + n;
            }

            function inferType(value, propName) {
                if (value === null || value === undefined) return 'null';
                if (typeof value === 'string') return 'string';
                if (typeof value === 'number') return 'number';
                if (typeof value === 'boolean') return 'boolean';

                if (Array.isArray(value)) {
                    if (value.length === 0) return 'unknown[]';
                    var elementTypes = [];
                    var objectMerged = null;
                    var objectTypeName = null;

                    for (var i = 0; i < value.length; i++) {
                        var item = value[i];
                        if (item !== null && typeof item === 'object' && !Array.isArray(item)) {
                            if (!objectMerged) {
                                objectMerged = {};
                                objectTypeName = getUniqueName(toPascalCase(propName));
                            }
                            var keys = Object.keys(item);
                            for (var k = 0; k < keys.length; k++) {
                                if (!(keys[k] in objectMerged)) {
                                    objectMerged[keys[k]] = item[keys[k]];
                                }
                            }
                        } else {
                            var t = inferType(item, propName);
                            if (elementTypes.indexOf(t) === -1) elementTypes.push(t);
                        }
                    }

                    if (objectMerged) {
                        generateBlock(objectMerged, objectTypeName);
                        elementTypes.unshift(objectTypeName);
                    }

                    if (elementTypes.length === 1) return elementTypes[0] + '[]';
                    return '(' + elementTypes.join(' | ') + ')[]';
                }

                if (typeof value === 'object') {
                    var name = getUniqueName(toPascalCase(propName));
                    generateBlock(value, name);
                    return name;
                }

                return 'unknown';
            }

            function generateBlock(obj, name) {
                var prefix = addExport ? 'export ' : '';
                var entries = Object.keys(obj);
                var props = [];
                for (var i = 0; i < entries.length; i++) {
                    var key = entries[i];
                    var type = inferType(obj[key], key);
                    var safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : "'" + key + "'";
                    props.push('  ' + safeKey + ': ' + type + ';');
                }
                if (useInterface) {
                    output.push(prefix + 'interface ' + name + ' {\n' + props.join('\n') + '\n}');
                } else {
                    output.push(prefix + 'type ' + name + ' = {\n' + props.join('\n') + '\n};');
                }
            }

            // Process root
            if (Array.isArray(parsed)) {
                if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0] !== null && !Array.isArray(parsed[0])) {
                    var merged = {};
                    for (var i = 0; i < parsed.length; i++) {
                        if (parsed[i] && typeof parsed[i] === 'object') {
                            var ks = Object.keys(parsed[i]);
                            for (var k = 0; k < ks.length; k++) {
                                if (!(ks[k] in merged)) merged[ks[k]] = parsed[i][ks[k]];
                            }
                        }
                    }
                    var itemName = rootName + 'Item';
                    generateBlock(merged, itemName);
                    output.push((addExport ? 'export ' : '') + 'type ' + rootName + ' = ' + itemName + '[];');
                } else {
                    var aType = inferType(parsed, rootName);
                    output.push((addExport ? 'export ' : '') + 'type ' + rootName + ' = ' + aType + ';');
                }
            } else if (typeof parsed === 'object' && parsed !== null) {
                generateBlock(parsed, rootName);
            } else {
                var pType = typeof parsed === 'string' ? 'string' : typeof parsed === 'number' ? 'number' : typeof parsed === 'boolean' ? 'boolean' : 'unknown';
                output.push((addExport ? 'export ' : '') + 'type ' + rootName + ' = ' + pType + ';');
            }

            outputEl.value = output.join('\n\n');
        }

        convertBtn.addEventListener('click', convert);

        sampleBtn.addEventListener('click', function() {
            inputEl.value = sampleJSON;
            convert();
        });

        clearBtn.addEventListener('click', function() {
            inputEl.value = '';
            outputEl.value = '';
        });

        copyBtn.addEventListener('click', function() {
            if (outputEl.value) window.copyToClipboard(outputEl.value, copyBtn);
        });

        inputEl.addEventListener('input', function() {
            if (autoEl.checked) convert();
        });

        [rootEl, useInterfaceEl, exportEl].forEach(function(el) {
            el.addEventListener('change', function() { if (autoEl.checked || inputEl.value.trim()) convert(); });
        });
    }
});
