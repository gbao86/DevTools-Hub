const UnicodeTableTool = {
    name: 'ASCII / Unicode Table',
    icon: '📝',
    category: 'Reference',
    description: 'Tra bảng mã ASCII, Unicode, chuyển đổi Character ↔ Code Point',
    
    render(container) {
        function escapeHtml(str) {
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        // --- Data Generation ---
        const getAsciiData = () => {
            const data = [];
            const controls = [
                "NUL (Null)", "SOH (Start of Heading)", "STX (Start of Text)", "ETX (End of Text)",
                "EOT (End of Transmission)", "ENQ (Enquiry)", "ACK (Acknowledge)", "BEL (Bell)",
                "BS (Backspace)", "HT (Horizontal Tab)", "LF (Line Feed)", "VT (Vertical Tab)",
                "FF (Form Feed)", "CR (Carriage Return)", "SO (Shift Out)", "SI (Shift In)",
                "DLE (Data Link Escape)", "DC1 (Device Control 1)", "DC2 (Device Control 2)",
                "DC3 (Device Control 3)", "DC4 (Device Control 4)", "NAK (Negative Ack)",
                "SYN (Synchronous Idle)", "ETB (End of Trans. Block)", "CAN (Cancel)",
                "EM (End of Medium)", "SUB (Substitute)", "ESC (Escape)", "FS (File Separator)",
                "GS (Group Separator)", "RS (Record Separator)", "US (Unit Separator)"
            ];

            // 0-127 ASCII
            for (let i = 0; i < 128; i++) {
                let char = String.fromCharCode(i);
                let desc = "";
                let type = "printable";
                
                if (i < 32) {
                    char = controls[i].split(" ")[0];
                    desc = controls[i];
                    type = "control";
                } else if (i === 32) {
                    char = "Space";
                    desc = "Space";
                } else if (i === 127) {
                    char = "DEL";
                    desc = "Delete";
                    type = "control";
                } else {
                    desc = "Printable Character";
                }

                data.push({
                    dec: i,
                    hex: i.toString(16).toUpperCase().padStart(2, '0'),
                    oct: i.toString(8).padStart(3, '0'),
                    bin: i.toString(2).padStart(8, '0'),
                    char: char,
                    actualChar: String.fromCharCode(i),
                    desc: desc,
                    type: type
                });
            }

            // 128-255 Extended ASCII (ISO-8859-1)
            for (let i = 128; i <= 255; i++) {
                data.push({
                    dec: i,
                    hex: i.toString(16).toUpperCase().padStart(2, '0'),
                    oct: i.toString(8).padStart(3, '0'),
                    bin: i.toString(2).padStart(8, '0'),
                    char: String.fromCharCode(i),
                    actualChar: String.fromCharCode(i),
                    desc: "Extended ASCII",
                    type: "extended"
                });
            }
            return data;
        };

        const asciiList = getAsciiData();

        const commonSymbols = [
            { title: 'Arrows', chars: '←↑→↓↔↕↖↗↘↙' },
            { title: 'Math', chars: '∀∂∃∅∇∈∉∋∏∑−∗√∝∞∠∧∨∩∪∫∴∼≅≈≠≡≤≥⊂⊃⊆⊇⊕⊗⊥' },
            { title: 'Currency', chars: '¢£¤¥€₫₱₹₩₪' },
            { title: 'Punctuation', chars: `«»‹›''‚""„†‡•…‰′″‹›` }
        ];

        // --- UI HTML ---
        container.innerHTML = `
            <style>
                .unicode-converter { margin-bottom: var(--space-lg); padding: var(--space-md); background: var(--bg-secondary); border-radius: var(--radius-md); }
                .unicode-converter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }
                .unicode-converter-box { background: var(--bg-tertiary); padding: var(--space-md); border-radius: var(--radius-sm); border: 1px solid var(--border-color); }
                .unicode-converter-box h3 { margin-top: 0; margin-bottom: var(--space-sm); font-size: var(--fs-base); color: var(--text-primary); }
                
                .char-details-grid { display: grid; grid-template-columns: auto 1fr; gap: var(--space-sm) var(--space-md); font-family: var(--font-mono); font-size: var(--fs-sm); margin-top: var(--space-md); }
                .char-details-label { color: var(--text-secondary); text-align: right; }
                .char-details-value { color: var(--accent-primary); word-break: break-all; }
                
                .unicode-filters { display: flex; flex-wrap: wrap; gap: var(--space-md); margin-bottom: var(--space-md); align-items: center; }
                .unicode-filters .tool-group { margin-bottom: 0; }
                
                .unicode-table-wrapper { overflow-y: auto; max-height: 600px; border: 1px solid var(--border-color); border-radius: var(--radius-sm); }
                .unicode-table { width: 100%; border-collapse: collapse; font-family: var(--font-mono); font-size: var(--fs-sm); }
                .unicode-table th { position: sticky; top: 0; background: var(--bg-secondary); padding: var(--space-sm); text-align: left; border-bottom: 2px solid var(--border-color); z-index: 1; }
                .unicode-table td { padding: var(--space-sm); border-bottom: 1px solid var(--border-color); }
                .unicode-table tr { cursor: pointer; transition: background var(--transition-fast); }
                .unicode-table tr:hover { background: var(--bg-tertiary); }
                .unicode-table tr:active { background: var(--border-color); }
                
                .char-cell { font-size: var(--fs-base); text-align: center; font-weight: bold; width: 60px; background: var(--bg-tertiary); }
                .dec-cell { width: 60px; color: var(--accent-primary); }
                .hex-cell { width: 60px; color: var(--accent-warning); }
                .desc-cell { color: var(--text-secondary); }
                
                .type-control { color: var(--accent-danger); }
                .type-printable { color: var(--text-primary); }
                .type-extended { color: var(--accent-success); }
                
                /* Compact Grid View */
                .unicode-grid-view { display: grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 1px; background: var(--border-color); border: 1px solid var(--border-color); }
                .grid-item { background: var(--bg-primary); padding: var(--space-sm); text-align: center; cursor: pointer; transition: all var(--transition-fast); }
                .grid-item:hover { background: var(--bg-tertiary); transform: scale(1.1); z-index: 2; box-shadow: 0 0 10px rgba(0,0,0,0.5); }
                .grid-char { font-size: 1.2rem; margin-bottom: 4px; color: var(--text-primary); }
                .grid-hex { font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono); }
                
                .symbols-section { margin-top: var(--space-lg); }
                .symbols-grid { display: flex; flex-wrap: wrap; gap: var(--space-sm); }
                .symbol-btn { background: var(--bg-tertiary); border: 1px solid var(--border-color); padding: var(--space-sm) var(--space-md); border-radius: var(--radius-sm); cursor: pointer; font-size: var(--fs-base); color: var(--text-primary); transition: background var(--transition-fast); }
                .symbol-btn:hover { background: var(--border-hover); }
            </style>

            <div class="tool-panel">
                <div class="tool-header">
                    <h2>${this.icon} ${this.name}</h2>
                    <p class="tool-description">${this.description}</p>
                </div>

                <div class="tool-body">
                    <!-- Converter -->
                    <div class="unicode-converter">
                        <div class="unicode-converter-grid">
                            <div class="unicode-converter-box">
                                <h3>Character to Code</h3>
                                <div class="tool-group">
                                    <input type="text" id="char-input" class="tool-input" placeholder="Enter character(s)..." maxlength="10">
                                </div>
                                <div class="char-details-grid" id="char-details" style="display:none;">
                                    <div class="char-details-label">Decimal:</div><div class="char-details-value" id="res-dec">-</div>
                                    <div class="char-details-label">Hex:</div><div class="char-details-value" id="res-hex">-</div>
                                    <div class="char-details-label">Octal:</div><div class="char-details-value" id="res-oct">-</div>
                                    <div class="char-details-label">Binary:</div><div class="char-details-value" id="res-bin">-</div>
                                    <div class="char-details-label">UTF-8:</div><div class="char-details-value" id="res-utf8">-</div>
                                    <div class="char-details-label">HTML Entity:</div><div class="char-details-value" id="res-html">-</div>
                                </div>
                            </div>
                            <div class="unicode-converter-box">
                                <h3>Code to Character</h3>
                                <div class="tool-group">
                                    <input type="text" id="code-input" class="tool-input" placeholder="e.g. 65, U+0041, 0x41">
                                </div>
                                <div class="char-details-grid" id="code-details" style="display:none;">
                                    <div class="char-details-label">Character:</div>
                                    <div class="char-details-value" style="font-size: 2rem;" id="res-char">-</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="unicode-filters">
                        <div class="tool-group" style="flex: 1; min-width: 200px;">
                            <input type="text" id="search-input" class="tool-input" placeholder="Search char, dec, hex, desc...">
                        </div>
                        <div class="tool-group">
                            <select id="filter-type" class="tool-select">
                                <option value="all">All Characters</option>
                                <option value="control">Control (0-31)</option>
                                <option value="printable">Printable (32-126)</option>
                                <option value="extended">Extended (128-255)</option>
                            </select>
                        </div>
                        <div class="tool-group">
                            <select id="view-mode" class="tool-select">
                                <option value="list">Detailed List</option>
                                <option value="grid">Compact Grid</option>
                            </select>
                        </div>
                    </div>

                    <!-- Table -->
                    <div class="unicode-table-wrapper" id="table-wrapper">
                        <!-- Rendered by JS -->
                    </div>

                    <!-- Common Symbols -->
                    <div class="symbols-section">
                        <h3>Common Symbols (Click to copy)</h3>
                        <div id="symbols-container"></div>
                    </div>
                </div>
            </div>
        `;

        // --- Logic & Events ---
        const charInput = container.querySelector('#char-input');
        const codeInput = container.querySelector('#code-input');
        const charDetails = container.querySelector('#char-details');
        const codeDetails = container.querySelector('#code-details');
        
        const searchInput = container.querySelector('#search-input');
        const filterType = container.querySelector('#filter-type');
        const viewMode = container.querySelector('#view-mode');
        const tableWrapper = container.querySelector('#table-wrapper');
        const symbolsContainer = container.querySelector('#symbols-container');

        // Render Symbols
        commonSymbols.forEach(group => {
            const groupEl = document.createElement('div');
            groupEl.style.marginBottom = 'var(--space-md)';
            groupEl.innerHTML = `<h4 style="margin-bottom: var(--space-sm); color: var(--text-secondary);">${group.title}</h4>`;
            const gridEl = document.createElement('div');
            gridEl.className = 'symbols-grid';
            
            for (let char of group.chars) {
                const btn = document.createElement('button');
                btn.className = 'symbol-btn';
                btn.textContent = char;
                btn.title = `Copy ${char}`;
                btn.addEventListener('click', () => {
                    window.copyToClipboard(char, btn);
                    window.showToast(`Copied "${char}"`, 'success');
                });
                gridEl.appendChild(btn);
            }
            groupEl.appendChild(gridEl);
            symbolsContainer.appendChild(groupEl);
        });

        // Convert Char to Code
        charInput.addEventListener('input', (e) => {
            const val = e.target.value;
            if (!val) {
                charDetails.style.display = 'none';
                return;
            }
            charDetails.style.display = 'grid';
            
            const cp = val.codePointAt(0);
            container.querySelector('#res-dec').textContent = cp;
            container.querySelector('#res-hex').textContent = 'U+' + cp.toString(16).toUpperCase().padStart(4, '0');
            container.querySelector('#res-oct').textContent = cp.toString(8);
            container.querySelector('#res-bin').textContent = cp.toString(2);
            
            // UTF-8 bytes
            const utf8Bytes = new TextEncoder().encode(String.fromCodePoint(cp));
            const utf8Hex = Array.from(utf8Bytes).map(b => '\\x' + b.toString(16).toUpperCase().padStart(2, '0')).join('');
            container.querySelector('#res-utf8').textContent = utf8Hex;
            
            container.querySelector('#res-html').textContent = `&#${cp};`;
        });

        // Convert Code to Char
        codeInput.addEventListener('input', (e) => {
            let val = e.target.value.trim();
            if (!val) {
                codeDetails.style.display = 'none';
                return;
            }
            
            let num = NaN;
            if (val.toLowerCase().startsWith('u+')) {
                num = parseInt(val.substring(2), 16);
            } else if (val.toLowerCase().startsWith('0x')) {
                num = parseInt(val.substring(2), 16);
            } else {
                // Try hex first if letters present, else decimal
                if (/^[0-9a-fA-F]+$/.test(val) && /[a-fA-F]/.test(val)) {
                    num = parseInt(val, 16);
                } else {
                    num = parseInt(val, 10);
                }
            }

            codeDetails.style.display = 'grid';
            if (isNaN(num) || num < 0 || num > 0x10FFFF) {
                container.querySelector('#res-char').textContent = 'Invalid Code';
            } else {
                try {
                    container.querySelector('#res-char').textContent = String.fromCodePoint(num);
                } catch(err) {
                    container.querySelector('#res-char').textContent = 'Invalid Code';
                }
            }
        });

        // Render Table
        const renderTable = () => {
            const search = searchInput.value.toLowerCase();
            const type = filterType.value;
            const mode = viewMode.value;

            const filtered = asciiList.filter(item => {
                if (type !== 'all' && item.type !== type) return false;
                if (search) {
                    return item.char.toLowerCase().includes(search) ||
                           item.desc.toLowerCase().includes(search) ||
                           item.dec.toString() === search ||
                           item.hex.toLowerCase() === search;
                }
                return true;
            });

            if (mode === 'list') {
                let html = `
                    <table class="unicode-table">
                        <thead>
                            <tr>
                                <th>Dec</th>
                                <th>Hex</th>
                                <th>Char</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                filtered.forEach(item => {
                    html += `
                        <tr data-char="${escapeHtml(item.actualChar)}">
                            <td class="dec-cell">${item.dec}</td>
                            <td class="hex-cell">${item.hex}</td>
                            <td class="char-cell type-${item.type}">${escapeHtml(item.char)}</td>
                            <td class="desc-cell">${escapeHtml(item.desc)}</td>
                        </tr>
                    `;
                });
                html += '</tbody></table>';
                tableWrapper.innerHTML = html;
            } else {
                let html = '<div class="unicode-grid-view">';
                filtered.forEach(item => {
                    html += `
                        <div class="grid-item" data-char="${escapeHtml(item.actualChar)}" title="Dec: ${item.dec} | ${escapeHtml(item.desc)}">
                            <div class="grid-char type-${item.type}">${escapeHtml(item.char)}</div>
                            <div class="grid-hex">${item.hex}</div>
                        </div>
                    `;
                });
                html += '</div>';
                tableWrapper.innerHTML = html;
            }
        };

        // Table Event Delegation for Copying
        tableWrapper.addEventListener('click', (e) => {
            const row = e.target.closest('tr') || e.target.closest('.grid-item');
            if (!row) return;
            const char = row.getAttribute('data-char');
            if (char) {
                // If it's a control char less than 32, we don't really want to copy raw NUL. 
                // But actualChar contains it. Let's just copy it anyway.
                window.copyToClipboard(char, row);
                const displayChar = row.querySelector('.char-cell, .grid-char').textContent;
                window.showToast(`Copied "${displayChar}"`, 'success');
            }
        });

        searchInput.addEventListener('input', renderTable);
        filterType.addEventListener('change', renderTable);
        viewMode.addEventListener('change', renderTable);

        // Initial Render
        renderTable();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(UnicodeTableTool);
