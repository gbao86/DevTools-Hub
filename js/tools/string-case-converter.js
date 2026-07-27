window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: "String Case Converter",
    icon: "📝",
    category: "Text",
    description: "Chuyển đổi văn bản sang các định dạng chữ hoa/thường khác nhau",
    render: function(container) {
        container.innerHTML = `
            <style>
                .case-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; margin-top: 20px; }
                .case-card { background: var(--bg-card, var(--bg-secondary)); border: 1px solid var(--border-color); border-radius: 6px; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
                .case-header { display: flex; justify-content: space-between; align-items: center; }
                .case-name { font-weight: bold; color: var(--text-primary); }
                .case-result { background: var(--bg-input, var(--bg-primary)); border: 1px solid var(--border-color); border-radius: 4px; padding: 10px; font-family: monospace; color: var(--text-secondary); word-break: break-all; min-height: 42px; display: flex; align-items: center; }
            </style>
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>String Case Converter</h2>
                    <div class="tool-description">Chuyển đổi chuỗi văn bản giữa các định dạng Camel Case, Snake Case, Kebab Case, vv...</div>
                </div>
                
                <div class="tool-body">
                    <div class="tool-group">
                        <label class="tool-label">Input Text</label>
                        <textarea class="tool-textarea" id="case-input" rows="4" placeholder="Nhập văn bản cần chuyển đổi (ví dụ: Hello world)..."></textarea>
                    </div>
                    
                    <div class="case-grid" id="case-grid">
                        <!-- Populated by JS -->
                    </div>
                </div>
            </div>
        `;

        const input = container.querySelector('#case-input');
        const grid = container.querySelector('#case-grid');

        const cases = [
            { id: 'camel', name: 'camelCase', desc: 'Lạc đà' },
            { id: 'pascal', name: 'PascalCase', desc: 'Lạc đà hoa' },
            { id: 'snake', name: 'snake_case', desc: 'Rắn' },
            { id: 'screaming_snake', name: 'SCREAMING_SNAKE_CASE', desc: 'Rắn hoa' },
            { id: 'kebab', name: 'kebab-case', desc: 'Xiên nướng' },
            { id: 'screaming_kebab', name: 'SCREAMING-KEBAB-CASE', desc: 'Xiên nướng hoa' },
            { id: 'dot', name: 'dot.case', desc: 'Dấu chấm' },
            { id: 'path', name: 'path/case', desc: 'Đường dẫn' },
            { id: 'title', name: 'Title Case', desc: 'Tiêu đề' },
            { id: 'sentence', name: 'Sentence case', desc: 'Câu' },
            { id: 'upper', name: 'UPPERCASE', desc: 'Chữ hoa' },
            { id: 'lower', name: 'lowercase', desc: 'Chữ thường' },
            { id: 'swap', name: 'sWAP cASE', desc: 'Đảo ngược' }
        ];

        function getWords(str) {
            // Split by space, hyphen, underscore, dot, slash or camelCase boundary
            if (!str) return [];
            return str
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/[_\-\.\/\s]+/g, ' ')
                .trim()
                .split(/\s+/)
                .filter(Boolean);
        }

        const converters = {
            'camel': (words) => words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
            'pascal': (words) => words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(''),
            'snake': (words) => words.map(w => w.toLowerCase()).join('_'),
            'screaming_snake': (words) => words.map(w => w.toUpperCase()).join('_'),
            'kebab': (words) => words.map(w => w.toLowerCase()).join('-'),
            'screaming_kebab': (words) => words.map(w => w.toUpperCase()).join('-'),
            'dot': (words) => words.map(w => w.toLowerCase()).join('.'),
            'path': (words) => words.map(w => w.toLowerCase()).join('/'),
            'title': (words) => words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '),
            'sentence': (words) => {
                if (!words.length) return '';
                const joined = words.join(' ').toLowerCase();
                return joined.charAt(0).toUpperCase() + joined.slice(1);
            },
            'upper': (words, raw) => raw.toUpperCase(),
            'lower': (words, raw) => raw.toLowerCase(),
            'swap': (words, raw) => raw.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
        };

        // Init grid
        grid.innerHTML = cases.map(c => `
            <div class="case-card">
                <div class="case-header">
                    <span class="case-name">${c.name} <small style="color:var(--text-muted);font-weight:normal">(${c.desc})</small></span>
                    <button class="tool-btn tool-btn-sm case-copy-btn" data-id="${c.id}">Copy</button>
                </div>
                <div class="case-result" id="res-${c.id}"></div>
            </div>
        `).join('');

        const resultEls = {};
        cases.forEach(c => {
            resultEls[c.id] = container.querySelector(`#res-${c.id}`);
        });

        function process() {
            const raw = input.value;
            const words = getWords(raw);
            
            cases.forEach(c => {
                let res = '';
                if (raw) {
                    res = converters[c.id](words, raw);
                }
                resultEls[c.id].textContent = res;
            });
        }

        input.addEventListener('input', process);

        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('case-copy-btn')) {
                const id = e.target.getAttribute('data-id');
                const text = resultEls[id].textContent;
                if (text) {
                    window.copyToClipboard(text, e.target);
                }
            }
        });
        
        // Initial process
        process();
    }
});
