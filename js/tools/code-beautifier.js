window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'Code Beautifier',
    icon: '✨',
    category: 'Formatter',
    description: 'Làm đẹp và tạo ảnh chụp màn hình mã nguồn (như Carbon)',
    render(container) {
        if (!document.getElementById('beautifier-tool-style')) {
            const style = document.createElement('style');
            style.id = 'beautifier-tool-style';
            style.textContent = `
                .cb-preview-area {
                    margin-top: 1.5rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    border: 1px dashed var(--border-color);
                    border-radius: 8px;
                    transition: padding 0.3s, background-color 0.3s;
                }
                .cb-window {
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    overflow: hidden;
                    width: 100%;
                    max-width: 800px;
                    transition: border-radius 0.3s, background-color 0.3s;
                }
                .cb-window-header {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    position: relative;
                }
                .cb-dots {
                    display: flex;
                    gap: 6px;
                }
                .cb-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                }
                .cb-dot.red { background-color: #ff5f56; }
                .cb-dot.yellow { background-color: #ffbd2e; }
                .cb-dot.green { background-color: #27c93f; }
                .cb-title {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    font-family: sans-serif;
                    font-size: 12px;
                    font-weight: bold;
                    opacity: 0.6;
                }
                .cb-code-content {
                    padding: 1rem;
                    margin: 0;
                    font-family: 'Fira Code', 'Courier New', Courier, monospace;
                    font-size: 14px;
                    line-height: 1.5;
                    white-space: pre-wrap;
                    word-break: break-all;
                }
                /* Syntax Highlighting Base */
                .cb-token-kw { font-weight: bold; }
                .cb-token-str { }
                .cb-token-num { }
                .cb-token-comment { font-style: italic; opacity: 0.7; }
                .cb-token-func { }
                .cb-token-op { opacity: 0.8; }
            `;
            document.head.appendChild(style);
        }

        const themes = {
            'dark': { bg: '#1e1e1e', headerBg: '#2d2d2d', text: '#d4d4d4', kw: '#569cd6', str: '#ce9178', num: '#b5cea8', func: '#dcdcaa', op: '#d4d4d4' },
            'light': { bg: '#ffffff', headerBg: '#f3f3f3', text: '#333333', kw: '#0000ff', str: '#a31515', num: '#098658', func: '#795e26', op: '#333333' },
            'monokai': { bg: '#272822', headerBg: '#3e3d32', text: '#f8f8f2', kw: '#f92672', str: '#e6db74', num: '#ae81ff', func: '#a6e22e', op: '#f8f8f2' },
            'dracula': { bg: '#282a36', headerBg: '#44475a', text: '#f8f8f2', kw: '#ff79c6', str: '#f1fa8c', num: '#bd93f9', func: '#50fa7b', op: '#ff79c6' },
            'nord': { bg: '#2e3440', headerBg: '#3b4252', text: '#d8dee9', kw: '#81a1c1', str: '#a3be8c', num: '#b48ead', func: '#88c0d0', op: '#81a1c1' },
            'github': { bg: '#24292e', headerBg: '#1f2428', text: '#e1e4e8', kw: '#f97583', str: '#9ecbff', num: '#79b8ff', func: '#b392f0', op: '#f97583' }
        };

        const languages = ['JavaScript', 'Python', 'HTML', 'CSS', 'JSON', 'SQL', 'TypeScript', 'Java', 'C++', 'Bash', 'PHP', 'Ruby', 'Go', 'Rust'];
        const backgrounds = [
            { name: 'Gradient Blue', val: 'linear-gradient(135deg, #71b7e6, #9b59b6)' },
            { name: 'Gradient Orange', val: 'linear-gradient(135deg, #f6d365, #fda085)' },
            { name: 'Gradient Green', val: 'linear-gradient(135deg, #84fab0, #8fd3f4)' },
            { name: 'Solid Gray', val: '#e5e7eb' },
            { name: 'Solid Dark', val: '#374151' },
            { name: 'Transparent', val: 'transparent' }
        ];

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>✨ Code Beautifier</h2>
                    <p class="tool-description">Tạo ảnh chụp màn hình mã nguồn đẹp mắt (như Carbon)</p>
                </div>
                <div class="tool-body">
                    <div class="tool-split">
                        <div class="tool-group">
                            <label class="tool-label">Ngôn ngữ</label>
                            <select id="cb-lang" class="tool-select">
                                ${languages.map(l => \`<option value="\${l}">\${l}</option>\`).join('')}
                            </select>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Giao diện (Theme)</label>
                            <select id="cb-theme" class="tool-select">
                                <option value="dark">Tối (Dark)</option>
                                <option value="light">Sáng (Light)</option>
                                <option value="monokai">Monokai</option>
                                <option value="dracula">Dracula</option>
                                <option value="nord">Nord</option>
                                <option value="github">GitHub</option>
                            </select>
                        </div>
                    </div>

                    <div class="tool-split">
                        <div class="tool-group">
                            <label class="tool-label">Padding (<span id="cb-pad-val">32</span>px)</label>
                            <input type="range" id="cb-padding" min="16" max="64" value="32" class="tool-input">
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">Border Radius (<span id="cb-br-val">8</span>px)</label>
                            <input type="range" id="cb-radius" min="0" max="24" value="8" class="tool-input">
                        </div>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Nền ngoài (Background)</label>
                        <select id="cb-bg" class="tool-select">
                            ${backgrounds.map((b, i) => \`<option value="\${i}">\${b.name}</option>\`).join('')}
                        </select>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Mã nguồn (Code)</label>
                        <textarea id="cb-code-input" class="tool-textarea" style="height: 150px;">function helloWorld() {
    console.log("Hello, world!");
}</textarea>
                    </div>

                    <div class="tool-actions">
                        <button id="cb-btn-png" class="tool-btn tool-btn-primary">📷 Export PNG</button>
                        <button id="cb-btn-html" class="tool-btn">📋 Copy HTML</button>
                    </div>

                    <div class="cb-preview-area" id="cb-preview-area" style="background: ${backgrounds[0].val}; padding: 32px;">
                        <div class="cb-window" id="cb-window" style="border-radius: 8px;">
                            <div class="cb-window-header" id="cb-window-header">
                                <div class="cb-dots">
                                    <div class="cb-dot red"></div>
                                    <div class="cb-dot yellow"></div>
                                    <div class="cb-dot green"></div>
                                </div>
                                <div class="cb-title" id="cb-window-title">JavaScript</div>
                            </div>
                            <pre class="cb-code-content" id="cb-code-content"></pre>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const langSel = container.querySelector('#cb-lang');
        const themeSel = container.querySelector('#cb-theme');
        const padInput = container.querySelector('#cb-padding');
        const radInput = container.querySelector('#cb-radius');
        const bgSel = container.querySelector('#cb-bg');
        const codeInput = container.querySelector('#cb-code-input');
        
        const previewArea = container.querySelector('#cb-preview-area');
        const windowEl = container.querySelector('#cb-window');
        const headerEl = container.querySelector('#cb-window-header');
        const titleEl = container.querySelector('#cb-window-title');
        const codeContentEl = container.querySelector('#cb-code-content');

        const btnPng = container.querySelector('#cb-btn-png');
        const btnHtml = container.querySelector('#cb-btn-html');

        function highlightCode(code, lang, themeColors) {
            // Very basic heuristic syntax highlighter
            const escapeHTML = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            let html = escapeHTML(code);
            
            // Strings
            html = html.replace(/("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|\`(?:[^\`\\\\]|\\\\.)*\`)/g, \`<span style="color: \${themeColors.str}">$1</span>\`);
            
            // Numbers
            html = html.replace(/\\b(\\d+\\.?\\d*)\\b/g, \`<span style="color: \${themeColors.num}">$1</span>\`);
            
            // Keywords
            const kws = ['function','const','let','var','if','else','return','for','while','class','import','export','from','def','class','public','private','protected','interface'];
            const kwRegex = new RegExp(\`\\\\b(\${kws.join('|')})\\\\b\`, 'g');
            html = html.replace(kwRegex, \`<span style="color: \${themeColors.kw}; font-weight: bold;">$1</span>\`);
            
            // Functions
            html = html.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*(?=\\()/g, \`<span style="color: \${themeColors.func}">$1</span>\`);

            return html;
        }

        function renderPreview() {
            const theme = themes[themeSel.value];
            const code = codeInput.value;
            const lang = langSel.value;
            const pad = padInput.value + 'px';
            const rad = radInput.value + 'px';
            const bg = backgrounds[bgSel.value].val;

            container.querySelector('#cb-pad-val').textContent = padInput.value;
            container.querySelector('#cb-br-val').textContent = radInput.value;

            titleEl.textContent = lang;
            previewArea.style.background = bg;
            previewArea.style.padding = pad;
            
            windowEl.style.borderRadius = rad;
            windowEl.style.backgroundColor = theme.bg;
            
            headerEl.style.backgroundColor = theme.headerBg;
            titleEl.style.color = theme.text;
            
            codeContentEl.style.color = theme.text;
            codeContentEl.innerHTML = highlightCode(code, lang, theme);
        }

        [langSel, themeSel, padInput, radInput, bgSel, codeInput].forEach(el => {
            el.addEventListener('input', renderPreview);
        });

        btnHtml.addEventListener('click', () => {
            const html = previewArea.outerHTML;
            navigator.clipboard.writeText(html).then(() => {
                if (window.showToast) window.showToast('Đã copy HTML!', 'success');
            });
        });

        btnPng.addEventListener('click', () => {
            // Using a simple SVG foreignObject trick to convert DOM to image
            // Note: External stylesheets won't work in foreignObject, but we use inline styles + basic classes
            const width = previewArea.offsetWidth;
            const height = previewArea.offsetHeight;
            const clone = previewArea.cloneNode(true);
            
            // Inline critical styles for SVG
            const style = document.createElement('style');
            style.textContent = \`
                .cb-preview-area { display: flex; justify-content: center; align-items: center; overflow: hidden; box-sizing: border-box; font-family: sans-serif; }
                .cb-window { box-shadow: 0 10px 30px rgba(0,0,0,0.3); overflow: hidden; width: 100%; max-width: 800px; }
                .cb-window-header { display: flex; align-items: center; padding: 0.75rem 1rem; position: relative; }
                .cb-dots { display: flex; gap: 6px; }
                .cb-dot { width: 12px; height: 12px; border-radius: 50%; }
                .cb-dot.red { background-color: #ff5f56; }
                .cb-dot.yellow { background-color: #ffbd2e; }
                .cb-dot.green { background-color: #27c93f; }
                .cb-title { position: absolute; left: 50%; transform: translateX(-50%); font-size: 12px; font-weight: bold; opacity: 0.6; }
                .cb-code-content { padding: 1rem; margin: 0; font-family: 'Fira Code', 'Courier New', Courier, monospace; font-size: 14px; line-height: 1.5; white-space: pre-wrap; word-break: break-all; }
            \`;
            clone.insertBefore(style, clone.firstChild);
            clone.style.width = width + 'px';
            clone.style.height = height + 'px';
            clone.style.border = 'none';

            const svgData = \`
                <svg xmlns="http://www.w3.org/2000/svg" width="\${width}" height="\${height}">
                    <foreignObject width="100%" height="100%">
                        <div xmlns="http://www.w3.org/1999/xhtml">
                            \${clone.outerHTML}
                        </div>
                    </foreignObject>
                </svg>
            \`;

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.download = \`code-snippet.png\`;
                    a.href = url;
                    a.click();
                    URL.revokeObjectURL(url);
                    if (window.showToast) window.showToast('Đã tải xuống ảnh PNG!', 'success');
                }, 'image/png');
            };
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
        });

        renderPreview();
    }
});
