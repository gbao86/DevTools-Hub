window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: "HTML Entity",
    icon: "🔗",
    category: "Encode / Decode",
    description: "Mã hóa và giải mã HTML Entities",
    render: function(container) {
        container.innerHTML = `
            <style>
                .entity-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 15px; }
                .entity-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; padding: 10px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
                .entity-card:hover { border-color: var(--accent-primary); }
                .entity-char { font-size: 1.5em; color: var(--text-primary); font-weight: bold; }
                .entity-code { font-size: 0.9em; color: var(--text-secondary); font-family: monospace; }
                .entity-table-header { margin-top: 20px; font-weight: bold; color: var(--text-primary); }
            </style>
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>HTML Entity Encoder / Decoder</h2>
                    <div class="tool-description">Mã hóa (Encode) hoặc giải mã (Decode) các ký tự thành HTML entities.</div>
                </div>
                
                <div class="tool-tabs">
                    <div class="tool-tab active" data-mode="encode">Encode</div>
                    <div class="tool-tab" data-mode="decode">Decode</div>
                </div>

                <div class="tool-body">
                    <div class="tool-options" id="encode-options" style="display: flex; gap: 20px; margin-bottom: 10px;">
                        <div class="tool-group">
                            <label class="tool-label">Phạm vi mã hóa</label>
                            <select class="tool-select" id="encode-scope">
                                <option value="special">Chỉ ký tự đặc biệt (<, >, &, ", ')</option>
                                <option value="all">Tất cả ký tự không thuộc ASCII</option>
                            </select>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Định dạng</label>
                            <select class="tool-select" id="encode-format">
                                <option value="named">Named Entities (&amp;amp;)</option>
                                <option value="numeric">Numeric Entities (&amp;#38;)</option>
                            </select>
                        </div>
                    </div>

                    <div class="tool-split">
                        <div class="tool-col">
                            <label class="tool-label">Input</label>
                            <textarea class="tool-textarea" id="html-input" rows="8" placeholder="Nhập văn bản vào đây..."></textarea>
                        </div>
                        <div class="tool-col">
                            <label class="tool-label">Output</label>
                            <div class="tool-result">
                                <textarea class="tool-textarea" id="html-output" rows="8" readonly></textarea>
                                <button class="tool-copy-btn" id="html-copy-btn">Copy</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tool-table-container">
                        <div class="entity-table-header">Reference: Các HTML Entity Phổ Biến</div>
                        <div class="entity-grid" id="entity-grid">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        const input = container.querySelector('#html-input');
        const output = container.querySelector('#html-output');
        const copyBtn = container.querySelector('#html-copy-btn');
        const tabs = container.querySelectorAll('.tool-tab');
        const encodeOptions = container.querySelector('#encode-options');
        const scopeSelect = container.querySelector('#encode-scope');
        const formatSelect = container.querySelector('#encode-format');
        const entityGrid = container.querySelector('#entity-grid');

        let currentMode = 'encode';

        // Entity references
        const namedEntities = {
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
            '¢': '&cent;', '£': '&pound;', '¥': '&yen;', '€': '&euro;', '©': '&copy;', '®': '&reg;'
        };
        
        const commonEntities = [
            { char: '&', name: '&amp;', num: '&#38;' },
            { char: '<', name: '&lt;', num: '&#60;' },
            { char: '>', name: '&gt;', num: '&#62;' },
            { char: '"', name: '&quot;', num: '&#34;' },
            { char: "'", name: '&#39;', num: '&#39;' },
            { char: '©', name: '&copy;', num: '&#169;' },
            { char: '®', name: '&reg;', num: '&#174;' },
            { char: '™', name: '&trade;', num: '&#8482;' },
            { char: '€', name: '&euro;', num: '&#8364;' },
            { char: '£', name: '&pound;', num: '&#163;' },
            { char: '¥', name: '&yen;', num: '&#165;' },
            { char: '¢', name: '&cent;', num: '&#162;' }
        ];

        // Populate reference grid
        entityGrid.innerHTML = commonEntities.map(e => `
            <div class="entity-card" data-val="${e.name}">
                <span class="entity-char">${e.char}</span>
                <span class="entity-code">${e.name}</span>
            </div>
        `).join('');

        entityGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.entity-card');
            if (card) {
                const val = card.getAttribute('data-val');
                window.copyToClipboard(val, card);
            }
        });

        function encodeHtml(str, scope, format) {
            let result = '';
            for (let i = 0; i < str.length; i++) {
                const char = str[i];
                const code = char.charCodeAt(0);
                
                let isSpecial = (char === '&' || char === '<' || char === '>' || char === '"' || char === "'");
                
                if (scope === 'special' && !isSpecial) {
                    result += char;
                } else if (scope === 'all' && (code > 127 || isSpecial)) {
                    if (format === 'named' && namedEntities[char]) {
                        result += namedEntities[char];
                    } else {
                        result += '&#' + code + ';';
                    }
                } else if (scope === 'special' && isSpecial) {
                    if (format === 'named' && namedEntities[char]) {
                        result += namedEntities[char];
                    } else {
                        result += '&#' + code + ';';
                    }
                } else {
                    result += char;
                }
            }
            return result;
        }

        function decodeHtml(str) {
            let textarea = document.createElement("textarea");
            textarea.innerHTML = str;
            return textarea.value;
        }

        function process() {
            const val = input.value;
            if (!val) {
                output.value = '';
                return;
            }
            
            if (currentMode === 'encode') {
                output.value = encodeHtml(val, scopeSelect.value, formatSelect.value);
            } else {
                output.value = decodeHtml(val);
            }
        }

        input.addEventListener('input', process);
        scopeSelect.addEventListener('change', process);
        formatSelect.addEventListener('change', process);

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentMode = tab.getAttribute('data-mode');
                
                if (currentMode === 'encode') {
                    encodeOptions.style.display = 'flex';
                } else {
                    encodeOptions.style.display = 'none';
                }
                
                const temp = input.value;
                input.value = output.value;
                output.value = temp;
                process();
            });
        });

        copyBtn.addEventListener('click', () => {
            window.copyToClipboard(output.value, copyBtn);
        });
    }
});
