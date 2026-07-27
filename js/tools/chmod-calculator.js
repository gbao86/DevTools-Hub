window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'Chmod Calculator',
    icon: '🔐',
    category: 'Converter',
    description: 'Tính toán quyền truy cập file (chmod) bằng số hoặc chữ',
    render(container) {
        if (!document.getElementById('chmod-tool-style')) {
            const style = document.createElement('style');
            style.id = 'chmod-tool-style';
            style.textContent = `
                .chmod-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
                .chmod-col-box { background: var(--bg-secondary); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); }
                .chmod-col-box h3 { margin-top: 0; margin-bottom: 1rem; font-size: 1rem; text-align: center; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
                .chmod-checkbox-row { margin-bottom: 0.5rem; }
                .chmod-presets { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
                .chmod-output-box { background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); font-family: monospace; font-size: 14px; margin-bottom: 1rem; }
                .chmod-output-box p { margin: 0.5rem 0; color: var(--text-secondary); }
                .chmod-output-box strong { color: var(--text-primary); display: inline-block; width: 100px; }
                .chmod-output-val { color: var(--accent-primary); font-weight: bold; }
                .chmod-command { background: var(--bg-primary); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color); margin-top: 0.5rem; }
            `;
            document.head.appendChild(style);
        }

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🔐 Chmod Calculator</h2>
                    <p class="tool-description">Tính toán quyền truy cập file bằng số (octal) hoặc chuỗi (symbolic)</p>
                </div>
                <div class="tool-body">
                    <div class="tool-split" style="margin-bottom: 1.5rem;">
                        <div class="tool-group">
                            <label class="tool-label">Quyền bằng số (Numeric)</label>
                            <input type="text" id="chmod-num-in" class="tool-input" placeholder="755" maxlength="3" value="755" style="font-family: monospace;">
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Quyền bằng chữ (Symbolic)</label>
                            <input type="text" id="chmod-sym-in" class="tool-input" placeholder="rwxr-xr-x" maxlength="9" value="rwxr-xr-x" style="font-family: monospace;">
                        </div>
                    </div>

                    <div class="chmod-grid">
                        <div class="chmod-col-box">
                            <h3>Owner (Chủ)</h3>
                            <div class="chmod-checkbox-row tool-checkbox">
                                <input type="checkbox" id="cb-owner-r" data-val="4" data-group="owner" checked>
                                <label for="cb-owner-r">Read (r) - 4</label>
                            </div>
                            <div class="chmod-checkbox-row tool-checkbox">
                                <input type="checkbox" id="cb-owner-w" data-val="2" data-group="owner" checked>
                                <label for="cb-owner-w">Write (w) - 2</label>
                            </div>
                            <div class="chmod-checkbox-row tool-checkbox">
                                <input type="checkbox" id="cb-owner-x" data-val="1" data-group="owner" checked>
                                <label for="cb-owner-x">Execute (x) - 1</label>
                            </div>
                        </div>
                        <div class="chmod-col-box">
                            <h3>Group (Nhóm)</h3>
                            <div class="chmod-checkbox-row tool-checkbox">
                                <input type="checkbox" id="cb-group-r" data-val="4" data-group="group" checked>
                                <label for="cb-group-r">Read (r) - 4</label>
                            </div>
                            <div class="chmod-checkbox-row tool-checkbox">
                                <input type="checkbox" id="cb-group-w" data-val="2" data-group="group">
                                <label for="cb-group-w">Write (w) - 2</label>
                            </div>
                            <div class="chmod-checkbox-row tool-checkbox">
                                <input type="checkbox" id="cb-group-x" data-val="1" data-group="group" checked>
                                <label for="cb-group-x">Execute (x) - 1</label>
                            </div>
                        </div>
                        <div class="chmod-col-box">
                            <h3>Others (Khác)</h3>
                            <div class="chmod-checkbox-row tool-checkbox">
                                <input type="checkbox" id="cb-others-r" data-val="4" data-group="others" checked>
                                <label for="cb-others-r">Read (r) - 4</label>
                            </div>
                            <div class="chmod-checkbox-row tool-checkbox">
                                <input type="checkbox" id="cb-others-w" data-val="2" data-group="others">
                                <label for="cb-others-w">Write (w) - 2</label>
                            </div>
                            <div class="chmod-checkbox-row tool-checkbox">
                                <input type="checkbox" id="cb-others-x" data-val="1" data-group="others" checked>
                                <label for="cb-others-x">Execute (x) - 1</label>
                            </div>
                        </div>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Mẫu phổ biến (Presets)</label>
                        <div class="chmod-presets" id="chmod-presets-container"></div>
                    </div>

                    <div class="chmod-output-box">
                        <p><strong>Numeric:</strong> <span class="chmod-output-val" id="chmod-out-num">755</span></p>
                        <p><strong>Symbolic:</strong> <span class="chmod-output-val" id="chmod-out-sym">rwxr-xr-x</span></p>
                        <p><strong>Giải thích:</strong> <span id="chmod-out-desc">Owner có rwx, Group có r-x, Others có r-x</span></p>
                        <div class="chmod-command">
                            <span style="color: var(--text-muted);">$</span> <span style="color: var(--accent-primary);">chmod</span> <span id="chmod-out-cmd-num" style="color: var(--text-primary);">755</span> <span style="color: var(--text-secondary);">filename</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const numIn = container.querySelector('#chmod-num-in');
        const symIn = container.querySelector('#chmod-sym-in');
        const checkboxes = container.querySelectorAll('.chmod-grid input[type="checkbox"]');
        const presetsContainer = container.querySelector('#chmod-presets-container');
        
        const outNum = container.querySelector('#chmod-out-num');
        const outSym = container.querySelector('#chmod-out-sym');
        const outDesc = container.querySelector('#chmod-out-desc');
        const outCmdNum = container.querySelector('#chmod-out-cmd-num');

        const presets = [
            '644', '755', '777', '700', '600', '400', '444', '555', '775'
        ];

        presets.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'tool-btn tool-btn-sm';
            btn.textContent = p;
            btn.addEventListener('click', () => {
                numIn.value = p;
                updateFromNum(p);
            });
            presetsContainer.appendChild(btn);
        });

        function parseNumToOctalArray(numStr) {
            let str = String(numStr).replace(/[^0-7]/g, '').padStart(3, '0').slice(-3);
            return [parseInt(str[0]), parseInt(str[1]), parseInt(str[2])];
        }

        function numToSym(num) {
            const perms = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
            const arr = parseNumToOctalArray(num);
            return perms[arr[0]] + perms[arr[1]] + perms[arr[2]];
        }

        function symToNum(sym) {
            if (sym.length !== 9) return '000';
            let owner = (sym[0]==='r'?4:0) + (sym[1]==='w'?2:0) + (sym[2]==='x'?1:0);
            let group = (sym[3]==='r'?4:0) + (sym[4]==='w'?2:0) + (sym[5]==='x'?1:0);
            let others = (sym[6]==='r'?4:0) + (sym[7]==='w'?2:0) + (sym[8]==='x'?1:0);
            return '' + owner + group + others;
        }

        function getExplanation(num) {
            const arr = parseNumToOctalArray(num);
            const getDesc = (val) => {
                if (val === 7) return 'đọc, ghi và thực thi (rwx)';
                if (val === 6) return 'đọc và ghi (rw-)';
                if (val === 5) return 'đọc và thực thi (r-x)';
                if (val === 4) return 'chỉ đọc (r--)';
                if (val === 3) return 'ghi và thực thi (-wx)';
                if (val === 2) return 'chỉ ghi (-w-)';
                if (val === 1) return 'chỉ thực thi (--x)';
                return 'không có quyền (---)';
            };
            return \`Chủ sở hữu: \${getDesc(arr[0])}. Nhóm: \${getDesc(arr[1])}. Khác: \${getDesc(arr[2])}.\`;
        }

        function updateUI(numStr, symStr) {
            numIn.value = numStr;
            symIn.value = symStr;
            outNum.textContent = numStr;
            outSym.textContent = symStr;
            outCmdNum.textContent = numStr;
            outDesc.textContent = getExplanation(numStr);

            const arr = parseNumToOctalArray(numStr);
            const updateCheckboxes = (groupIndex, groupName) => {
                let val = arr[groupIndex];
                container.querySelector(\`#cb-\${groupName}-r\`).checked = (val & 4) !== 0;
                container.querySelector(\`#cb-\${groupName}-w\`).checked = (val & 2) !== 0;
                container.querySelector(\`#cb-\${groupName}-x\`).checked = (val & 1) !== 0;
            };
            updateCheckboxes(0, 'owner');
            updateCheckboxes(1, 'group');
            updateCheckboxes(2, 'others');
        }

        function updateFromNum(val) {
            let numStr = String(val).replace(/[^0-7]/g, '').padStart(3, '0').slice(-3);
            let symStr = numToSym(numStr);
            updateUI(numStr, symStr);
        }

        function updateFromSym(val) {
            let symStr = val.padEnd(9, '-').slice(0, 9);
            let numStr = symToNum(symStr);
            updateUI(numStr, symStr);
        }

        function updateFromCheckboxes() {
            const getVal = (groupName) => {
                let val = 0;
                if (container.querySelector(\`#cb-\${groupName}-r\`).checked) val += 4;
                if (container.querySelector(\`#cb-\${groupName}-w\`).checked) val += 2;
                if (container.querySelector(\`#cb-\${groupName}-x\`).checked) val += 1;
                return val;
            };
            let numStr = '' + getVal('owner') + getVal('group') + getVal('others');
            updateFromNum(numStr);
        }

        numIn.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^0-7]/g, '');
            if (val.length === 3) updateFromNum(val);
        });

        symIn.addEventListener('input', (e) => {
            let val = e.target.value.toLowerCase().replace(/[^rwx-]/g, '');
            if (val.length === 9) updateFromSym(val);
        });

        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateFromCheckboxes);
        });

        // Init
        updateFromNum('755');
    }
});
