window.DevTools = window.DevTools || [];

window.DevTools.push({
    name: "Phân tích Cron",
    icon: "⏰",
    category: "Converter",
    description: "Phân tích biểu thức Cron, hiển thị lịch chạy tiếp theo và xây dựng Cron trực quan.",
    render(container) {
        container.innerHTML = `
            <style>
                .cron-container { display: flex; flex-direction: column; gap: 1rem; }
                .cron-input-wrapper { display: flex; gap: 0.5rem; }
                .cron-preset-list { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
                
                .cron-builder {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                    background: var(--bg-secondary);
                    padding: 1rem;
                    border-radius: 8px;
                    border: 1px solid var(--border-color);
                }
                
                .cron-result {
                    margin-top: 1rem;
                }
                
                .cron-desc {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: var(--accent-primary);
                    margin-bottom: 1rem;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-radius: 8px;
                }
                
                .cron-next-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .cron-next-item {
                    display: flex;
                    gap: 1rem;
                    padding: 0.5rem 1rem;
                    background: var(--bg-tertiary);
                    border-radius: 4px;
                    font-family: monospace;
                }
                
                .cron-next-item .idx {
                    color: var(--text-secondary);
                    width: 24px;
                }
                
                .cron-error {
                    color: var(--accent-danger);
                    padding: 1rem;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 8px;
                    display: none;
                }
            </style>
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>⏰ Phân Tích Biểu Thức Cron</h2>
                    <p class="tool-description">Kiểm tra biểu thức cron (5 tham số) và xem thời gian thực thi tiếp theo.</p>
                </div>
                
                <div class="tool-body cron-container">
                    <div class="cron-preset-list">
                        <button class="tool-btn tool-btn-sm cron-preset" data-val="* * * * *">Mỗi phút</button>
                        <button class="tool-btn tool-btn-sm cron-preset" data-val="0 * * * *">Mỗi giờ</button>
                        <button class="tool-btn tool-btn-sm cron-preset" data-val="0 0 * * *">Mỗi ngày 0h</button>
                        <button class="tool-btn tool-btn-sm cron-preset" data-val="0 0 * * 1">Mỗi thứ 2</button>
                        <button class="tool-btn tool-btn-sm cron-preset" data-val="0 0 1 * *">Mỗi tháng ngày 1</button>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Biểu thức Cron:</label>
                        <div class="cron-input-wrapper">
                            <input type="text" class="tool-input" id="cron-input" value="*/5 * * * *" style="font-family: monospace; font-size: 1.2rem;">
                        </div>
                    </div>
                    
                    <div class="cron-builder">
                        <div class="tool-group">
                            <label class="tool-label">Phút</label>
                            <input type="text" class="tool-input cron-part" data-idx="0" value="*/5">
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Giờ</label>
                            <input type="text" class="tool-input cron-part" data-idx="1" value="*">
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Ngày (Tháng)</label>
                            <input type="text" class="tool-input cron-part" data-idx="2" value="*">
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Tháng</label>
                            <input type="text" class="tool-input cron-part" data-idx="3" value="*">
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Thứ</label>
                            <input type="text" class="tool-input cron-part" data-idx="4" value="*">
                        </div>
                    </div>
                    
                    <div class="cron-error" id="cron-error"></div>
                    
                    <div class="cron-result" id="cron-result">
                        <div class="cron-desc" id="cron-desc">Đang xử lý...</div>
                        
                        <div class="tool-group">
                            <label class="tool-label">10 lần chạy tiếp theo:</label>
                            <div class="cron-next-list" id="cron-next"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const input = container.querySelector('#cron-input');
        const parts = container.querySelectorAll('.cron-part');
        const errorEl = container.querySelector('#cron-error');
        const resultEl = container.querySelector('#cron-result');
        const descEl = container.querySelector('#cron-desc');
        const nextEl = container.querySelector('#cron-next');
        const presets = container.querySelectorAll('.cron-preset');

        // Simple cron string generation to Vietnamese description
        function describeCron(fields) {
            const [min, hour, dom, mon, dow] = fields;
            
            let desc = "Chạy vào ";
            if (min === '*' && hour === '*' && dom === '*' && mon === '*' && dow === '*') return "Chạy mỗi phút";
            
            // Minutes
            if (min === '*') desc += "mỗi phút";
            else if (min.startsWith('*/')) desc += \`mỗi \${min.slice(2)} phút\`;
            else desc += \`phút \${min}\`;
            
            // Hours
            if (hour !== '*') {
                if (hour.startsWith('*/')) desc += \`, mỗi \${hour.slice(2)} giờ\`;
                else desc += \`, giờ \${hour}\`;
            }
            
            // DOM
            if (dom !== '*') {
                if (dom.startsWith('*/')) desc += \`, mỗi \${dom.slice(2)} ngày\`;
                else desc += \`, ngày \${dom} của tháng\`;
            }
            
            // Month
            if (mon !== '*') {
                if (mon.startsWith('*/')) desc += \`, mỗi \${mon.slice(2)} tháng\`;
                else desc += \`, tháng \${mon}\`;
            }
            
            // DOW
            if (dow !== '*') {
                if (dow === '1') desc += ', vào Thứ 2';
                else if (dow === '2') desc += ', vào Thứ 3';
                else if (dow === '3') desc += ', vào Thứ 4';
                else if (dow === '4') desc += ', vào Thứ 5';
                else if (dow === '5') desc += ', vào Thứ 6';
                else if (dow === '6') desc += ', vào Thứ 7';
                else if (dow === '0' || dow === '7') desc += ', vào Chủ Nhật';
                else desc += \`, vào thứ \${dow}\`;
            }
            
            return desc;
        }

        // Basic cron sequence generator
        function matchField(val, fieldExpr) {
            if (fieldExpr === '*') return true;
            const parts = fieldExpr.split(',');
            for (let part of parts) {
                if (part.includes('/')) {
                    const [base, step] = part.split('/');
                    const numStep = parseInt(step);
                    if (base === '*') {
                        if (val % numStep === 0) return true;
                    } else if (val >= parseInt(base) && (val - parseInt(base)) % numStep === 0) {
                        return true;
                    }
                } else if (part.includes('-')) {
                    const [start, end] = part.split('-');
                    if (val >= parseInt(start) && val <= parseInt(end)) return true;
                } else {
                    if (val === parseInt(part)) return true;
                }
            }
            return false;
        }

        function isValidField(str, min, max) {
            if (str === '*') return true;
            const regex = /^(\*|\d+)(-\d+)?(\/\d+)?(,\d+(-\d+)?(\/\d+)?)*$/;
            return regex.test(str);
        }

        function calculateNextRuns(expr, count = 10) {
            const fields = expr.trim().split(/\s+/);
            if (fields.length !== 5) throw new Error("Biểu thức phải có đúng 5 phần");
            
            // Basic validation
            if (!isValidField(fields[0], 0, 59)) throw new Error("Cú pháp phút không hợp lệ");
            if (!isValidField(fields[1], 0, 23)) throw new Error("Cú pháp giờ không hợp lệ");
            if (!isValidField(fields[2], 1, 31)) throw new Error("Cú pháp ngày không hợp lệ");
            if (!isValidField(fields[3], 1, 12)) throw new Error("Cú pháp tháng không hợp lệ");
            if (!isValidField(fields[4], 0, 7)) throw new Error("Cú pháp thứ không hợp lệ");

            const dates = [];
            let currDate = new Date();
            currDate.setSeconds(0, 0); // start at next minute
            currDate.setMinutes(currDate.getMinutes() + 1);

            // Safety limit to avoid infinite loops for impossible crons
            let loops = 0;
            const MAX_LOOPS = 100000;

            while (dates.length < count && loops < MAX_LOOPS) {
                loops++;
                
                const min = currDate.getMinutes();
                const hr = currDate.getHours();
                const dom = currDate.getDate();
                const mon = currDate.getMonth() + 1; // 1-12
                const dow = currDate.getDay(); // 0-6
                
                if (matchField(mon, fields[3])) {
                    if (matchField(dom, fields[2]) && matchField(dow, fields[4])) {
                        if (matchField(hr, fields[1])) {
                            if (matchField(min, fields[0])) {
                                dates.push(new Date(currDate));
                            }
                        }
                    }
                }
                currDate.setMinutes(currDate.getMinutes() + 1);
            }
            
            if (dates.length === 0) throw new Error("Biểu thức không khớp với thời gian nào.");
            return { dates, desc: describeCron(fields) };
        }

        function formatDateTime(d) {
            return d.getFullYear() + "-" + 
                   String(d.getMonth()+1).padStart(2, '0') + "-" + 
                   String(d.getDate()).padStart(2, '0') + " " + 
                   String(d.getHours()).padStart(2, '0') + ":" + 
                   String(d.getMinutes()).padStart(2, '0') + ":" + 
                   String(d.getSeconds()).padStart(2, '0');
        }

        function updateFromInput() {
            const val = input.value;
            const f = val.trim().split(/\s+/);
            if (f.length === 5) {
                parts.forEach((p, i) => { p.value = f[i]; });
            }
            
            try {
                const { dates, desc } = calculateNextRuns(val);
                errorEl.style.display = 'none';
                resultEl.style.display = 'block';
                descEl.textContent = desc;
                
                nextEl.innerHTML = dates.map((d, i) => 
                    \`<div class="cron-next-item">
                        <span class="idx">#\${i+1}</span>
                        <span class="time">\${formatDateTime(d)}</span>
                    </div>\`
                ).join('');
                
            } catch (err) {
                errorEl.style.display = 'block';
                errorEl.textContent = "Lỗi: " + err.message;
                resultEl.style.display = 'none';
            }
        }

        function updateFromParts() {
            const vals = Array.from(parts).map(p => p.value.trim() || '*');
            input.value = vals.join(' ');
            updateFromInput();
        }

        input.addEventListener('input', updateFromInput);
        parts.forEach(p => p.addEventListener('input', updateFromParts));
        
        presets.forEach(btn => {
            btn.addEventListener('click', () => {
                input.value = btn.dataset.val;
                updateFromInput();
            });
        });

        // Init
        updateFromInput();
    }
});
