window.DevTools = window.DevTools || [];

window.DevTools.push({
    name: "Tạo mật khẩu",
    icon: "🔑",
    category: "Generator",
    description: "Tạo mật khẩu ngẫu nhiên an toàn với nhiều tùy chọn.",
    render(container) {
        container.innerHTML = `
            <style>
                .pg-container { display: flex; flex-direction: column; gap: 1rem; }
                .pg-result-box { 
                    background: var(--bg-secondary); 
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 1.5rem;
                    text-align: center;
                    position: relative;
                }
                .pg-password { 
                    font-size: 2rem; 
                    font-family: monospace; 
                    word-break: break-all;
                    color: var(--text-primary);
                }
                .pg-strength-container { margin-top: 1rem; }
                .pg-strength-bar { 
                    height: 8px; 
                    background: var(--bg-tertiary); 
                    border-radius: 4px; 
                    overflow: hidden; 
                    margin-bottom: 0.5rem;
                }
                .pg-strength-fill { 
                    height: 100%; 
                    width: 0%; 
                    transition: all 0.3s ease; 
                }
                .pg-strength-text { 
                    font-size: 0.85rem; 
                    color: var(--text-secondary); 
                    display: flex;
                    justify-content: space-between;
                }
                .pg-slider-group { 
                    display: flex; 
                    align-items: center; 
                    gap: 1rem; 
                }
                .pg-slider { flex: 1; }
                .pg-options { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                    gap: 1rem; 
                }
                .pg-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }
                .pg-list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 1.1rem;
                }
            </style>
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🔑 Tạo Mật Khẩu</h2>
                    <p class="tool-description">Tạo mật khẩu ngẫu nhiên an toàn, tính toán độ mạnh và entropy.</p>
                </div>
                <div class="tool-body pg-container">
                    <div class="pg-result-box">
                        <div class="pg-password" id="pg-main-password">Loading...</div>
                        <button class="tool-btn tool-copy-btn" id="pg-copy-main">Sao chép</button>
                        
                        <div class="pg-strength-container">
                            <div class="pg-strength-bar">
                                <div class="pg-strength-fill" id="pg-strength-fill"></div>
                            </div>
                            <div class="pg-strength-text">
                                <span id="pg-strength-label">Độ mạnh: -</span>
                                <span id="pg-entropy-label">Entropy: - bits</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tool-group">
                        <label class="tool-label">Độ dài mật khẩu: <span id="pg-length-val">16</span></label>
                        <div class="pg-slider-group">
                            <input type="range" class="pg-slider" id="pg-length-slider" min="8" max="128" value="16">
                            <input type="number" class="tool-number" id="pg-length-input" min="8" max="128" value="16">
                        </div>
                    </div>
                    
                    <div class="pg-options">
                        <div class="tool-group">
                            <label class="tool-checkbox">
                                <input type="checkbox" id="pg-opt-upper" checked>
                                Chữ hoa (A-Z)
                            </label>
                            <label class="tool-checkbox">
                                <input type="checkbox" id="pg-opt-lower" checked>
                                Chữ thường (a-z)
                            </label>
                            <label class="tool-checkbox">
                                <input type="checkbox" id="pg-opt-numbers" checked>
                                Số (0-9)
                            </label>
                            <label class="tool-checkbox">
                                <input type="checkbox" id="pg-opt-symbols" checked>
                                Ký tự đặc biệt (!@#$...)
                            </label>
                        </div>
                        <div class="tool-group">
                            <label class="tool-checkbox">
                                <input type="checkbox" id="pg-opt-ambiguous">
                                Loại trừ ký tự dễ nhầm lẫn (0O1lI)
                            </label>
                            <label class="tool-label" style="margin-top: 0.5rem;">Loại trừ ký tự tùy chỉnh:</label>
                            <input type="text" class="tool-input" id="pg-opt-exclude" placeholder="Vd: abc123">
                        </div>
                    </div>
                    
                    <div class="tool-actions">
                        <button class="tool-btn tool-btn-primary" id="pg-btn-generate">Tạo mật khẩu mới</button>
                        <button class="tool-btn" id="pg-btn-generate-list">Tạo danh sách (5)</button>
                    </div>
                    
                    <div class="pg-list" id="pg-list-container" style="display: none;">
                        <!-- List generated here -->
                    </div>
                </div>
            </div>
        `;

        const CHAR_SETS = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
            ambiguous: '0O1lI'
        };

        const els = {
            mainPwd: container.querySelector('#pg-main-password'),
            copyMain: container.querySelector('#pg-copy-main'),
            strengthFill: container.querySelector('#pg-strength-fill'),
            strengthLabel: container.querySelector('#pg-strength-label'),
            entropyLabel: container.querySelector('#pg-entropy-label'),
            lenSlider: container.querySelector('#pg-length-slider'),
            lenInput: container.querySelector('#pg-length-input'),
            lenVal: container.querySelector('#pg-length-val'),
            optUpper: container.querySelector('#pg-opt-upper'),
            optLower: container.querySelector('#pg-opt-lower'),
            optNum: container.querySelector('#pg-opt-numbers'),
            optSym: container.querySelector('#pg-opt-symbols'),
            optAmb: container.querySelector('#pg-opt-ambiguous'),
            optExc: container.querySelector('#pg-opt-exclude'),
            btnGen: container.querySelector('#pg-btn-generate'),
            btnGenList: container.querySelector('#pg-btn-generate-list'),
            listContainer: container.querySelector('#pg-list-container')
        };

        let currentMainPassword = '';

        function syncLength(val) {
            let v = parseInt(val);
            if (isNaN(v) || v < 8) v = 8;
            if (v > 128) v = 128;
            els.lenSlider.value = v;
            els.lenInput.value = v;
            els.lenVal.textContent = v;
            generateMain();
        }

        els.lenSlider.addEventListener('input', (e) => syncLength(e.target.value));
        els.lenInput.addEventListener('change', (e) => syncLength(e.target.value));
        
        [els.optUpper, els.optLower, els.optNum, els.optSym, els.optAmb].forEach(el => {
            el.addEventListener('change', () => {
                if (!els.optUpper.checked && !els.optLower.checked && !els.optNum.checked && !els.optSym.checked) {
                    els.optLower.checked = true; // prevent all off
                }
                generateMain();
            });
        });
        
        els.optExc.addEventListener('input', generateMain);
        els.btnGen.addEventListener('click', generateMain);
        
        els.btnGenList.addEventListener('click', () => {
            els.listContainer.style.display = 'flex';
            els.listContainer.innerHTML = '';
            for(let i=0; i<5; i++) {
                const pwd = generatePassword(parseInt(els.lenSlider.value));
                const item = document.createElement('div');
                item.className = 'pg-list-item';
                
                const pwdSpan = document.createElement('span');
                pwdSpan.textContent = pwd;
                
                const copyBtn = document.createElement('button');
                copyBtn.className = 'tool-btn tool-btn-sm';
                copyBtn.textContent = 'Sao chép';
                copyBtn.onclick = () => window.copyToClipboard(pwd, copyBtn);
                
                item.appendChild(pwdSpan);
                item.appendChild(copyBtn);
                els.listContainer.appendChild(item);
            }
        });

        els.copyMain.addEventListener('click', () => {
            window.copyToClipboard(currentMainPassword, els.copyMain);
        });

        function getCharset() {
            let charset = '';
            if (els.optUpper.checked) charset += CHAR_SETS.upper;
            if (els.optLower.checked) charset += CHAR_SETS.lower;
            if (els.optNum.checked) charset += CHAR_SETS.numbers;
            if (els.optSym.checked) charset += CHAR_SETS.symbols;
            
            if (els.optAmb.checked) {
                const amb = CHAR_SETS.ambiguous;
                charset = charset.split('').filter(c => !amb.includes(c)).join('');
            }
            
            const exc = els.optExc.value;
            if (exc) {
                charset = charset.split('').filter(c => !exc.includes(c)).join('');
            }
            
            return charset || CHAR_SETS.lower; // fallback
        }

        function generatePassword(length) {
            const charset = getCharset();
            const charsetLen = charset.length;
            let password = '';
            
            const randomValues = new Uint32Array(length);
            window.crypto.getRandomValues(randomValues);
            
            for (let i = 0; i < length; i++) {
                password += charset[randomValues[i] % charsetLen];
            }
            
            // Ensure at least one of each selected character type is present
            // (Skipped complex guarantee logic for simplicity, pure random is usually fine for > 8 chars)
            return password;
        }

        function updateStrength(password, poolSize) {
            const entropy = password.length * Math.log2(poolSize);
            els.entropyLabel.textContent = \`Entropy: \${entropy.toFixed(1)} bits\`;
            
            let strength = 'Yếu';
            let color = '#ef4444'; // red
            let width = 25;
            
            if (entropy >= 100) {
                strength = 'Rất mạnh';
                color = '#22c55e'; // green
                width = 100;
            } else if (entropy >= 70) {
                strength = 'Mạnh';
                color = '#84cc16'; // light green
                width = 75;
            } else if (entropy >= 50) {
                strength = 'Trung bình';
                color = '#eab308'; // yellow
                width = 50;
            } else if (entropy >= 35) {
                strength = 'Yếu';
                color = '#f97316'; // orange
                width = 35;
            }
            
            els.strengthLabel.textContent = \`Độ mạnh: \${strength}\`;
            els.strengthFill.style.width = \`\${width}%\`;
            els.strengthFill.style.backgroundColor = color;
        }

        function generateMain() {
            const len = parseInt(els.lenSlider.value);
            currentMainPassword = generatePassword(len);
            els.mainPwd.textContent = currentMainPassword;
            
            updateStrength(currentMainPassword, getCharset().length);
            els.listContainer.style.display = 'none';
        }

        // Init
        generateMain();
    }
});
