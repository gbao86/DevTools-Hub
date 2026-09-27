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
                @media (max-width: 640px) { .chmod-grid { grid-template-columns: 1fr; } }
                .chmod-col-box { background: var(--bg-secondary); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); }
                .chmod-col-box h3 { margin-top: 0; margin-bottom: 1rem; font-size: 1rem; text-align: center; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
                .chmod-checkbox-row { margin-bottom: 0.5rem; }
                .chmod-presets { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
                .chmod-output-box { background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); font-family: monospace; font-size: 14px; margin-bottom: 1rem; }
                .chmod-output-box p { margin: 0.5rem 0; color: var(--text-secondary); }
                .chmod-output-box strong { color: var(--text-primary); display: inline-block; width: 100px; }
                .chmod-output-val { color: var(--accent-primary); font-weight: bold; }
                .chmod-command { background: var(--bg-primary); padding: 0.75rem 1rem; border-radius: 6px; border: 1px solid var(--border-color); margin-top: 0.75rem; }
                .chmod-cmd-inner { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
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
                            <h3>Owner (Chủ sở hữu)</h3>
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
                        <p><strong>Giải thích:</strong> <span id="chmod-out-desc">Đang tính toán...</span></p>
                        <div class="chmod-command">
                            <div class="chmod-cmd-inner">
                                <div>
                                    <span style="color: var(--text-muted);">$</span> <span style="color: var(--accent-primary);">chmod</span> <span id="chmod-out-cmd-num" style="color: var(--text-primary);">755</span> <span style="color: var(--text-secondary);">filename</span>
                                </div>
                                <button type="button" class="tool-btn tool-btn-sm" id="chmod-copy-cmd" title="Sao chép lệnh chmod">📋 Copy Command</button>
                            </div>
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
        const copyCmdBtn = container.querySelector('#chmod-copy-cmd');

        const presets = [
            { code: '644', desc: '644 (rw-r--r--) - Tệp công khai tiêu chuẩn (HTML, ảnh, văn bản)' },
            { code: '755', desc: '755 (rwxr-xr-x) - Thư mục / tệp thực thi tiêu chuẩn' },
            { code: '777', desc: '777 (rwxrwxrwx) - Đầy đủ quyền cho tất cả người dùng' },
            { code: '700', desc: '700 (rwx------) - Toàn quyền riêng tư cho chủ sở hữu' },
            { code: '600', desc: '600 (rw-------) - Chỉ chủ đọc/ghi (Private key, config)' },
            { code: '400', desc: '400 (r--------) - Chỉ chủ sở hữu đọc (Read-only SSH key)' },
            { code: '444', desc: '444 (r--r--r--) - Mọi người chỉ đọc' },
            { code: '555', desc: '555 (r-xr-xr-x) - Mọi người chỉ đọc & thực thi' },
            { code: '775', desc: '775 (rwxrwxr-x) - Cho phép nhóm ghi, người khác đọc' }
        ];

        presets.forEach(p => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'tool-btn tool-btn-sm';
            btn.textContent = p.code;
            btn.title = p.desc;
            btn.addEventListener('click', () => {
                updateFromNum(p.code);
            });
            presetsContainer.appendChild(btn);
        });

        if (copyCmdBtn) {
            copyCmdBtn.addEventListener('click', () => {
                const cmd = `chmod ${outNum.textContent} filename`;
                if (window.copyToClipboard) {
                    window.copyToClipboard(cmd, copyCmdBtn);
                } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(cmd);
                }
            });
        }

        function parseNumToOctalArray(numStr) {
            let str = String(numStr).replace(/[^0-7]/g, '').padStart(3, '0').slice(-3);
            return [parseInt(str[0], 10), parseInt(str[1], 10), parseInt(str[2], 10)];
        }

        function numToSym(num) {
            const perms = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
            const arr = parseNumToOctalArray(num);
            return perms[arr[0]] + perms[arr[1]] + perms[arr[2]];
        }

        function symToNum(sym) {
            if (sym.length !== 9) return '000';
            let owner = (sym[0] === 'r' ? 4 : 0) + (sym[1] === 'w' ? 2 : 0) + (sym[2] === 'x' ? 1 : 0);
            let group = (sym[3] === 'r' ? 4 : 0) + (sym[4] === 'w' ? 2 : 0) + (sym[5] === 'x' ? 1 : 0);
            let others = (sym[6] === 'r' ? 4 : 0) + (sym[7] === 'w' ? 2 : 0) + (sym[8] === 'x' ? 1 : 0);
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
            return `Chủ sở hữu: ${getDesc(arr[0])}. Nhóm: ${getDesc(arr[1])}. Khác: ${getDesc(arr[2])}.`;
        }

        function updateUI(numStr, symStr) {
            if (document.activeElement !== numIn) numIn.value = numStr;
            if (document.activeElement !== symIn) symIn.value = symStr;
            outNum.textContent = numStr;
            outSym.textContent = symStr;
            outCmdNum.textContent = numStr;
            outDesc.textContent = getExplanation(numStr);

            const arr = parseNumToOctalArray(numStr);
            const updateCheckboxes = (groupIndex, groupName) => {
                let val = arr[groupIndex];
                const cbR = container.querySelector(`#cb-${groupName}-r`);
                const cbW = container.querySelector(`#cb-${groupName}-w`);
                const cbX = container.querySelector(`#cb-${groupName}-x`);
                if (cbR) cbR.checked = (val & 4) !== 0;
                if (cbW) cbW.checked = (val & 2) !== 0;
                if (cbX) cbX.checked = (val & 1) !== 0;
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
                const cbR = container.querySelector(`#cb-${groupName}-r`);
                const cbW = container.querySelector(`#cb-${groupName}-w`);
                const cbX = container.querySelector(`#cb-${groupName}-x`);
                if (cbR && cbR.checked) val += 4;
                if (cbW && cbW.checked) val += 2;
                if (cbX && cbX.checked) val += 1;
                return val;
            };
            let numStr = '' + getVal('owner') + getVal('group') + getVal('others');
            updateFromNum(numStr);
        }

        numIn.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^0-7]/g, '');
            if (e.target.value !== val) e.target.value = val;
            if (val.length === 3) updateFromNum(val);
        });

        numIn.addEventListener('blur', () => {
            let val = numIn.value.replace(/[^0-7]/g, '');
            if (val.length > 0) {
                val = val.padStart(3, '0').slice(-3);
                updateFromNum(val);
            } else {
                updateFromNum('755');
            }
        });

        symIn.addEventListener('input', (e) => {
            let val = e.target.value.toLowerCase().replace(/[^rwx-]/g, '');
            if (e.target.value !== val) e.target.value = val;
            if (val.length === 9) updateFromSym(val);
        });

        symIn.addEventListener('blur', () => {
            let val = symIn.value.toLowerCase().replace(/[^rwx-]/g, '');
            if (val.length > 0) {
                updateFromSym(val.padEnd(9, '-').slice(0, 9));
            } else {
                updateFromNum(outNum.textContent || '755');
            }
        });

        checkboxes.forEach(cb => {
            cb.addEventListener('change', updateFromCheckboxes);
        });

        // Init
        updateFromNum('755');
    }
});
