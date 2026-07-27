const SqlFormatterTool = {
    name: 'SQL Formatter',
    icon: '✨',
    category: 'Formatter',
    description: 'Định dạng và làm đẹp mã nguồn SQL (Format/Minify)',
    
    render(container) {
        container.innerHTML = `
            <style>
                #sf-sql-output {
                    background-color: var(--bg-secondary);
                }
            </style>
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>SQL Formatter</h2>
                    <p class="tool-description">Định dạng mã SQL để dễ đọc hơn hoặc thu gọn mã SQL trên một dòng.</p>
                </div>
                
                <div class="tool-row" style="margin-bottom: 1rem; align-items: flex-end; gap: 1rem;">
                    <div class="tool-group" style="flex: 1; margin: 0;">
                        <label class="tool-label">Tùy chọn Format</label>
                        <div class="tool-inline" style="gap: 1rem;">
                            <label class="tool-checkbox">
                                <input type="checkbox" id="sf-uppercase" checked>
                                <span>Uppercase keywords</span>
                            </label>
                            <label class="tool-inline" style="gap: 0.5rem; align-items: center;">
                                Indent:
                                <select id="sf-indent-size" class="tool-select" style="width: auto;">
                                    <option value="2">2 spaces</option>
                                    <option value="4" selected>4 spaces</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div class="tool-actions">
                        <button id="sf-format-btn" class="tool-btn tool-btn-primary">Format SQL</button>
                        <button id="sf-minify-btn" class="tool-btn">Minify SQL</button>
                        <button id="sf-clear-btn" class="tool-btn tool-btn-danger">Clear</button>
                    </div>
                </div>

                <div class="tool-split">
                    <div class="tool-group">
                        <label class="tool-label">Input SQL</label>
                        <textarea id="sf-sql-input" class="tool-textarea" style="height: 450px;" placeholder="Nhập câu lệnh SQL vào đây..."></textarea>
                    </div>
                    <div class="tool-group">
                        <label class="tool-label">
                            Output SQL
                            <button id="sf-copy-btn" class="tool-btn tool-btn-sm" style="float: right;">Copy</button>
                        </label>
                        <textarea id="sf-sql-output" class="tool-textarea" style="height: 450px;" readonly placeholder="Kết quả sẽ hiển thị ở đây..."></textarea>
                    </div>
                </div>
            </div>
        `;

        const inputSql = container.querySelector('#sf-sql-input');
        const outputSql = container.querySelector('#sf-sql-output');
        const btnFormat = container.querySelector('#sf-format-btn');
        const btnMinify = container.querySelector('#sf-minify-btn');
        const btnClear = container.querySelector('#sf-clear-btn');
        const btnCopy = container.querySelector('#sf-copy-btn');
        const chkUppercase = container.querySelector('#sf-uppercase');
        const selIndent = container.querySelector('#sf-indent-size');

        const keywords = [
            'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
            'ON', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'ORDER BY', 'GROUP BY', 'HAVING',
            'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE TABLE',
            'ALTER TABLE', 'DROP TABLE', 'AS', 'DISTINCT', 'UNION', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
            'EXISTS', 'IS NULL', 'IS NOT NULL', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'ASC', 'DESC'
        ];

        const majorClauses = [
            'SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET',
            'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'LEFT JOIN', 'RIGHT JOIN',
            'INNER JOIN', 'OUTER JOIN', 'JOIN', 'UNION'
        ];

        const formatSql = (sql, isMinify = false) => {
            if (!sql) return '';
            
            const indentChar = ' '.repeat(parseInt(selIndent.value));
            const isUpper = chkUppercase.checked;
            
            // Extract string literals to preserve them
            const strings = [];
            let processedSql = sql.replace(/'([^']*)'/g, (match) => {
                strings.push(match);
                return `__STR_${strings.length - 1}__`;
            });

            // Standardize spaces and newlines
            processedSql = processedSql.replace(/\s+/g, ' ').trim();

            if (isMinify) {
                // Restore strings for minify
                processedSql = processedSql.replace(/__STR_(\d+)__/g, (match, p1) => strings[p1]);
                return processedSql;
            }

            // Keyword formatting and clause breaking
            const keywordRegex = new RegExp('\\b(' + keywords.sort((a,b) => b.length - a.length).join('|') + ')\\b', 'gi');
            processedSql = processedSql.replace(keywordRegex, (match) => {
                const upperMatch = match.toUpperCase();
                let replacement = isUpper ? upperMatch : match.toLowerCase();
                
                if (majorClauses.includes(upperMatch)) {
                    replacement = '\n' + replacement;
                }
                
                return replacement;
            });

            // Handle parentheses and indentation
            let indentLevel = 0;
            let formattedLines = [];
            
            const lines = processedSql.split('\n');
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                if (!line) continue;
                
                let outLine = '';
                let parenCount = 0;
                
                for (let j = 0; j < line.length; j++) {
                    const char = line[j];
                    if (char === '(') {
                        outLine += char + '\n';
                        indentLevel++;
                        outLine += indentChar.repeat(indentLevel);
                        parenCount++;
                    } else if (char === ')') {
                        indentLevel = Math.max(0, indentLevel - 1);
                        outLine += '\n' + indentChar.repeat(indentLevel) + char;
                        parenCount--;
                    } else if (char === ',') {
                        outLine += char + '\n' + indentChar.repeat(indentLevel);
                    } else {
                        outLine += char;
                    }
                }
                
                formattedLines.push(indentChar.repeat(indentLevel) + outLine.trim());
            }

            let result = formattedLines.join('\n').replace(/\n\s*\n/g, '\n').trim();

            // Restore strings
            result = result.replace(/__STR_(\d+)__/g, (match, p1) => strings[p1]);

            return result;
        };

        btnFormat.addEventListener('click', () => {
            const sql = inputSql.value;
            outputSql.value = formatSql(sql, false);
            if(window.showToast) window.showToast('Format SQL thành công', 'success');
        });

        btnMinify.addEventListener('click', () => {
            const sql = inputSql.value;
            outputSql.value = formatSql(sql, true);
            if(window.showToast) window.showToast('Minify SQL thành công', 'success');
        });

        btnClear.addEventListener('click', () => {
            inputSql.value = '';
            outputSql.value = '';
        });

        btnCopy.addEventListener('click', () => {
            if (window.copyToClipboard) window.copyToClipboard(outputSql.value, btnCopy);
            else { 
                navigator.clipboard.writeText(outputSql.value); 
                btnCopy.innerText = 'Copied!'; 
                setTimeout(() => btnCopy.innerText = 'Copy', 2000); 
            }
        });
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(SqlFormatterTool);
