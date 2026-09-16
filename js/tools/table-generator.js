/* ============================================
   DevTools Hub - Table Generator
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'Table Generator',
    icon: '📋',
    category: 'Formatter',
    description: 'Tạo bảng Markdown, HTML, CSV, JSON từ giao diện trực quan',

    render(container) {
        container.innerHTML = `
            <style>
                .tg-table-wrap { overflow-x: auto; margin: var(--space-md) 0; border: 1px solid var(--border-color); border-radius: var(--radius-sm); }
                .tg-table { width: 100%; border-collapse: collapse; min-width: 400px; }
                .tg-table th, .tg-table td { border: 1px solid var(--border-color); padding: 0; position: relative; }
                .tg-table th { background: var(--bg-tertiary); }
                .tg-table tr:hover td { background: var(--bg-secondary); }
                .tg-cell { width: 100%; padding: 8px 12px; border: none; background: transparent; color: var(--text-primary); font-family: var(--font-primary); font-size: var(--fs-sm); outline: none; min-width: 80px; }
                .tg-cell:focus { box-shadow: inset 0 0 0 2px var(--accent-primary); }
                .tg-th-cell { font-weight: 600; }
                .tg-controls { display: flex; gap: var(--space-sm); flex-wrap: wrap; align-items: center; }
                .tg-export-tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border-color); margin-bottom: var(--space-md); }
                .tg-export-tab { padding: 8px 16px; cursor: pointer; border: none; background: none; color: var(--text-secondary); font-family: var(--font-primary); font-size: var(--fs-sm); font-weight: 500; border-bottom: 2px solid transparent; transition: var(--transition-fast); }
                .tg-export-tab:hover { color: var(--text-primary); }
                .tg-export-tab.active { color: var(--accent-primary); border-bottom-color: var(--accent-primary); }
                .tg-import-section { margin-top: var(--space-md); }
            </style>
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>Table Generator</h2>
                    <p class="tool-description">Tạo bảng trực quan và export ra Markdown, HTML, CSV hoặc JSON. Hỗ trợ import từ CSV.</p>
                </div>
                <div class="tool-body">
                    <div class="tg-controls">
                        <button class="tool-btn tool-btn-primary" id="tg-add-row">+ Thêm hàng</button>
                        <button class="tool-btn tool-btn-primary" id="tg-add-col">+ Thêm cột</button>
                        <button class="tool-btn tool-btn-danger" id="tg-rm-row">− Xóa hàng</button>
                        <button class="tool-btn tool-btn-danger" id="tg-rm-col">− Xóa cột</button>
                        <button class="tool-btn" id="tg-clear">🗑️ Xóa hết</button>
                        <button class="tool-btn" id="tg-sample">📝 Dữ liệu mẫu</button>
                    </div>

                    <div class="tg-table-wrap">
                        <table class="tg-table" id="tg-table"></table>
                    </div>

                    <details class="tg-import-section">
                        <summary style="cursor:pointer;color:var(--text-secondary);font-size:var(--fs-sm);font-weight:500;padding:var(--space-sm) 0;">📥 Import từ CSV / TSV</summary>
                        <div class="tool-group" style="margin-top:var(--space-sm);">
                            <textarea id="tg-import-text" class="tool-textarea" rows="4" placeholder="Dán dữ liệu CSV hoặc TSV vào đây...&#10;Name,Email,Role&#10;John,john@mail.com,Admin"></textarea>
                        </div>
                        <div class="tool-actions">
                            <button class="tool-btn tool-btn-primary" id="tg-import-btn">Import</button>
                        </div>
                    </details>

                    <div style="margin-top:var(--space-lg);">
                        <label class="tool-label" style="margin-bottom:var(--space-sm);">Export</label>
                        <div class="tg-export-tabs" id="tg-tabs">
                            <button class="tg-export-tab active" data-tab="markdown">Markdown</button>
                            <button class="tg-export-tab" data-tab="html">HTML</button>
                            <button class="tg-export-tab" data-tab="csv">CSV</button>
                            <button class="tg-export-tab" data-tab="json">JSON</button>
                        </div>
                        <div class="tool-result">
                            <textarea id="tg-output" class="tool-textarea" style="min-height:160px;font-size:13px;" readonly placeholder="Export sẽ hiển thị ở đây..."></textarea>
                            <button class="tool-copy-btn" id="tg-copy">📋 Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        var tableEl = container.querySelector('#tg-table');
        var outputEl = container.querySelector('#tg-output');
        var copyBtn = container.querySelector('#tg-copy');
        var addRowBtn = container.querySelector('#tg-add-row');
        var addColBtn = container.querySelector('#tg-add-col');
        var rmRowBtn = container.querySelector('#tg-rm-row');
        var rmColBtn = container.querySelector('#tg-rm-col');
        var clearBtn = container.querySelector('#tg-clear');
        var sampleBtn = container.querySelector('#tg-sample');
        var importBtn = container.querySelector('#tg-import-btn');
        var importText = container.querySelector('#tg-import-text');
        var tabs = container.querySelectorAll('.tg-export-tab');

        var currentTab = 'markdown';
        var data = {
            headers: ['Column 1', 'Column 2', 'Column 3'],
            rows: [['', '', ''], ['', '', '']]
        };

        function renderTable() {
            var html = '<thead><tr>';
            for (var c = 0; c < data.headers.length; c++) {
                html += '<th><input class="tg-cell tg-th-cell" data-type="header" data-col="' + c + '" value="' + escapeAttr(data.headers[c]) + '" placeholder="Header ' + (c + 1) + '"></th>';
            }
            html += '</tr></thead><tbody>';
            for (var r = 0; r < data.rows.length; r++) {
                html += '<tr>';
                for (var c2 = 0; c2 < data.headers.length; c2++) {
                    var val = (data.rows[r] && data.rows[r][c2]) || '';
                    html += '<td><input class="tg-cell" data-type="cell" data-row="' + r + '" data-col="' + c2 + '" value="' + escapeAttr(val) + '" placeholder="..."></td>';
                }
                html += '</tr>';
            }
            html += '</tbody>';
            tableEl.innerHTML = html;

            // Bind input events
            tableEl.querySelectorAll('.tg-cell').forEach(function(cell) {
                cell.addEventListener('input', function() {
                    var type = this.getAttribute('data-type');
                    var col = parseInt(this.getAttribute('data-col'));
                    if (type === 'header') {
                        data.headers[col] = this.value;
                    } else {
                        var row = parseInt(this.getAttribute('data-row'));
                        if (!data.rows[row]) data.rows[row] = [];
                        data.rows[row][col] = this.value;
                    }
                    updateExport();
                });

                // Tab navigation
                cell.addEventListener('keydown', function(e) {
                    if (e.key === 'Tab') {
                        e.preventDefault();
                        var allCells = Array.from(tableEl.querySelectorAll('.tg-cell'));
                        var idx = allCells.indexOf(this);
                        var next = e.shiftKey ? idx - 1 : idx + 1;
                        if (next >= 0 && next < allCells.length) {
                            allCells[next].focus();
                            allCells[next].select();
                        }
                    }
                });
            });

            updateExport();
        }

        function escapeAttr(str) {
            return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function updateExport() {
            switch (currentTab) {
                case 'markdown': outputEl.value = exportMarkdown(); break;
                case 'html': outputEl.value = exportHTML(); break;
                case 'csv': outputEl.value = exportCSV(); break;
                case 'json': outputEl.value = exportJSON(); break;
            }
        }

        function exportMarkdown() {
            var colWidths = data.headers.map(function(h, i) {
                var max = h.length;
                data.rows.forEach(function(row) { max = Math.max(max, (row[i] || '').length); });
                return Math.max(max, 3);
            });

            var header = '| ' + data.headers.map(function(h, i) { return pad(h, colWidths[i]); }).join(' | ') + ' |';
            var sep = '| ' + colWidths.map(function(w) { return repeat('-', w); }).join(' | ') + ' |';
            var rows = data.rows.map(function(row) {
                return '| ' + data.headers.map(function(h, i) { return pad(row[i] || '', colWidths[i]); }).join(' | ') + ' |';
            });

            return header + '\n' + sep + '\n' + rows.join('\n');
        }

        function pad(str, len) {
            while (str.length < len) str += ' ';
            return str;
        }

        function repeat(ch, n) {
            var s = '';
            for (var i = 0; i < n; i++) s += ch;
            return s;
        }

        function exportHTML() {
            var indent = '  ';
            var html = '<table>\n' + indent + '<thead>\n' + indent + indent + '<tr>\n';
            data.headers.forEach(function(h) {
                html += indent + indent + indent + '<th>' + escapeAttr(h) + '</th>\n';
            });
            html += indent + indent + '</tr>\n' + indent + '</thead>\n' + indent + '<tbody>\n';
            data.rows.forEach(function(row) {
                html += indent + indent + '<tr>\n';
                data.headers.forEach(function(h, i) {
                    html += indent + indent + indent + '<td>' + escapeAttr(row[i] || '') + '</td>\n';
                });
                html += indent + indent + '</tr>\n';
            });
            html += indent + '</tbody>\n</table>';
            return html;
        }

        function exportCSV() {
            function csvEscape(val) {
                var s = String(val || '');
                if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) {
                    return '"' + s.replace(/"/g, '""') + '"';
                }
                return s;
            }
            var lines = [data.headers.map(csvEscape).join(',')];
            data.rows.forEach(function(row) {
                lines.push(data.headers.map(function(h, i) { return csvEscape(row[i]); }).join(','));
            });
            return lines.join('\n');
        }

        function exportJSON() {
            var arr = data.rows.map(function(row) {
                var obj = {};
                data.headers.forEach(function(h, i) {
                    obj[h || 'column' + (i + 1)] = row[i] || '';
                });
                return obj;
            });
            return JSON.stringify(arr, null, 2);
        }

        // Events
        addRowBtn.addEventListener('click', function() {
            data.rows.push(new Array(data.headers.length).fill(''));
            renderTable();
        });

        addColBtn.addEventListener('click', function() {
            data.headers.push('Column ' + (data.headers.length + 1));
            data.rows.forEach(function(row) { row.push(''); });
            renderTable();
        });

        rmRowBtn.addEventListener('click', function() {
            if (data.rows.length > 1) {
                data.rows.pop();
                renderTable();
            } else {
                window.showToast('Cần ít nhất 1 hàng dữ liệu', 'warning');
            }
        });

        rmColBtn.addEventListener('click', function() {
            if (data.headers.length > 2) {
                data.headers.pop();
                data.rows.forEach(function(row) { row.pop(); });
                renderTable();
            } else {
                window.showToast('Cần ít nhất 2 cột', 'warning');
            }
        });

        clearBtn.addEventListener('click', function() {
            data.headers = ['Column 1', 'Column 2', 'Column 3'];
            data.rows = [['', '', ''], ['', '', '']];
            renderTable();
        });

        sampleBtn.addEventListener('click', function() {
            data.headers = ['Name', 'Email', 'Role', 'Status'];
            data.rows = [
                ['Nguyễn Văn A', 'a@example.com', 'Admin', 'Active'],
                ['Trần Thị B', 'b@example.com', 'Editor', 'Active'],
                ['Lê Văn C', 'c@example.com', 'Viewer', 'Inactive']
            ];
            renderTable();
        });

        importBtn.addEventListener('click', function() {
            var text = importText.value.trim();
            if (!text) { window.showToast('Vui lòng nhập dữ liệu CSV', 'warning'); return; }

            // Detect delimiter
            var firstLine = text.split('\n')[0];
            var delimiter = ',';
            if (firstLine.split('\t').length > firstLine.split(',').length) delimiter = '\t';
            else if (firstLine.split(';').length > firstLine.split(',').length) delimiter = ';';

            var lines = text.split('\n').filter(function(l) { return l.trim(); });
            if (lines.length < 1) return;

            function parseLine(line, delim) {
                var result = [];
                var current = '';
                var inQuotes = false;
                for (var i = 0; i < line.length; i++) {
                    var ch = line[i];
                    if (inQuotes) {
                        if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
                        else if (ch === '"') { inQuotes = false; }
                        else { current += ch; }
                    } else {
                        if (ch === '"') { inQuotes = true; }
                        else if (ch === delim) { result.push(current); current = ''; }
                        else { current += ch; }
                    }
                }
                result.push(current);
                return result;
            }

            data.headers = parseLine(lines[0], delimiter);
            data.rows = [];
            for (var i = 1; i < lines.length; i++) {
                var cells = parseLine(lines[i], delimiter);
                while (cells.length < data.headers.length) cells.push('');
                data.rows.push(cells);
            }
            if (data.rows.length === 0) data.rows.push(new Array(data.headers.length).fill(''));

            renderTable();
            window.showToast('Import thành công! ' + data.rows.length + ' hàng, ' + data.headers.length + ' cột', 'success');
        });

        // Tab switching
        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                tabs.forEach(function(t) { t.classList.remove('active'); });
                tab.classList.add('active');
                currentTab = tab.getAttribute('data-tab');
                updateExport();
            });
        });

        copyBtn.addEventListener('click', function() {
            if (outputEl.value) window.copyToClipboard(outputEl.value, copyBtn);
        });

        // Initial render
        renderTable();
    }
});
