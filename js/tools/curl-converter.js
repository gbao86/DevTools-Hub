const CurlConverter = {
    name: 'cURL Converter',
    icon: '🔀',
    category: 'Converter',
    description: 'Chuyển đổi lệnh cURL sang code JavaScript, Python, Go, PHP',

    render(container) {
        container.innerHTML = `
            <style>
                .curl-tabs {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 10px;
                    flex-wrap: wrap;
                }
                .curl-tab-btn {
                    padding: var(--space-sm) var(--space-md);
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    color: var(--text-secondary);
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: all var(--transition-fast);
                }
                .curl-tab-btn:hover {
                    background: var(--bg-tertiary);
                    color: var(--text-primary);
                }
                .curl-tab-btn.active {
                    background: var(--accent-primary);
                    border-color: var(--accent-primary);
                    color: white;
                }
                .parsed-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    font-size: var(--fs-sm);
                }
                .parsed-table th, .parsed-table td {
                    border: 1px solid var(--border-color);
                    padding: 8px;
                    text-align: left;
                }
                .parsed-table th {
                    background: var(--bg-tertiary);
                    color: var(--text-secondary);
                    font-weight: 600;
                }
                .parsed-table td.break-word {
                    word-break: break-all;
                }
                .empty-state {
                    color: var(--text-muted);
                    font-style: italic;
                    text-align: center;
                    padding: 20px;
                }
                .syntax-keyword { color: #c678dd; }
                .syntax-string { color: #98c379; }
                .syntax-function { color: #61afef; }
                .syntax-comment { color: #5c6370; font-style: italic; }
            </style>
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🔀 cURL Converter</h2>
                    <p class="tool-description">Chuyển đổi lệnh cURL sang code JavaScript, Python, Go, PHP</p>
                </div>
                <div class="tool-body">
                    <div class="tool-group">
                        <div class="tool-label">cURL Command</div>
                        <textarea class="tool-textarea" id="curl-input" rows="5" placeholder="curl -X POST https://api.example.com -H 'Content-Type: application/json' -d '{\\"key\\":\\"value\\"}'" spellcheck="false" style="font-family: var(--font-mono);"></textarea>
                        <div class="tool-actions" style="margin-top: var(--space-md);">
                            <button class="tool-btn tool-btn-primary" id="curl-convert-btn">Convert</button>
                            <select class="tool-select" id="curl-presets" style="width: auto; margin-left: auto;">
                                <option value="">-- Load Sample --</option>
                                <option value="get">Simple GET</option>
                                <option value="post">POST with JSON</option>
                                <option value="auth">Basic Auth</option>
                                <option value="form">Form Data</option>
                                <option value="complex">Complex Request</option>
                            </select>
                        </div>
                    </div>

                    <div class="tool-split" style="gap: var(--space-lg); margin-top: var(--space-lg);">
                        <div class="curl-parsed-details" style="flex: 1;">
                            <div class="tool-label">Parsed Details</div>
                            <div class="tool-info" id="curl-parsed-info" style="min-height: 250px; overflow-x: auto;">
                                <div class="empty-state">Enter a valid cURL command to see parsed details.</div>
                            </div>
                        </div>
                        
                        <div class="curl-output-section" style="flex: 1.5;">
                            <div class="tool-label">Generated Code</div>
                            <div class="curl-tabs tool-actions">
                                <button class="curl-tab-btn active" data-target="js-fetch">JS (Fetch)</button>
                                <button class="curl-tab-btn" data-target="js-axios">JS (Axios)</button>
                                <button class="curl-tab-btn" data-target="py-requests">Python (Requests)</button>
                                <button class="curl-tab-btn" data-target="go-http">Go (net/http)</button>
                                <button class="curl-tab-btn" data-target="php-curl">PHP (cURL)</button>
                            </div>
                            <div style="position: relative;">
                                <pre class="tool-result" id="curl-output" style="min-height: 250px; white-space: pre-wrap; font-family: var(--font-mono); font-size: var(--fs-sm);"></pre>
                                <button class="tool-copy-btn" id="curl-copy-btn" title="Copy to clipboard">📋</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const inputEl = container.querySelector('#curl-input');
        const convertBtn = container.querySelector('#curl-convert-btn');
        const presetsEl = container.querySelector('#curl-presets');
        const parsedInfoEl = container.querySelector('#curl-parsed-info');
        const outputEl = container.querySelector('#curl-output');
        const copyBtn = container.querySelector('#curl-copy-btn');
        const tabBtns = container.querySelectorAll('.curl-tab-btn');

        let currentTarget = 'js-fetch';
        let lastParsed = null;

        const presets = {
            get: "curl -L https://jsonplaceholder.typicode.com/todos/1",
            post: "curl -X POST https://api.example.com/data \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"name\": \"John Doe\", \"age\": 30}'",
            auth: "curl -u admin:password123 https://api.example.com/protected",
            form: "curl -X POST https://api.example.com/upload \\\n  -F 'user=test' \\\n  -F 'profile_pic=@/path/to/file.jpg'",
            complex: "curl -X PUT https://api.example.com/update?id=123 \\\n  -H 'Authorization: Bearer my-token' \\\n  -H 'User-Agent: MyApp/1.0' \\\n  -b 'session_id=abcdef123456' \\\n  -d '{\"status\":\"active\"}' \\\n  --compressed"
        };

        // Parse cURL function
        function parseCurl(curlStr) {
            if (!curlStr || typeof curlStr !== 'string') return null;
            
            // Normalize backslash line continuations
            curlStr = curlStr.replace(/\\\r?\n/g, ' ').replace(/\\n/g, ' ');
            
            const tokens = [];
            let currentToken = '';
            let inQuote = null;
            let escapeNext = false;
            
            for (let i = 0; i < curlStr.length; i++) {
                const char = curlStr[i];
                
                if (escapeNext) {
                    currentToken += char;
                    escapeNext = false;
                    continue;
                }
                
                if (char === '\\') {
                    if (inQuote !== "'") {
                        escapeNext = true;
                        continue;
                    } else {
                        currentToken += char;
                    }
                } else if (inQuote) {
                    if (char === inQuote) {
                        inQuote = null;
                    } else {
                        currentToken += char;
                    }
                } else if (char === "'" || char === '"') {
                    inQuote = char;
                } else if (char === ' ') {
                    if (currentToken.length > 0) {
                        tokens.push(currentToken);
                        currentToken = '';
                    }
                } else {
                    currentToken += char;
                }
            }
            
            if (currentToken.length > 0) {
                tokens.push(currentToken);
            }
            
            if (tokens.length === 0 || !tokens[0].toLowerCase().startsWith('curl')) {
                return null;
            }
            
            const parsed = {
                method: 'GET',
                url: '',
                headers: {},
                data: null,
                formData: [],
                auth: null,
                cookies: '',
                flags: {
                    compressed: false,
                    insecure: false,
                    location: false
                }
            };
            
            let hasData = false;
            let urlFound = false;
            
            for (let i = 1; i < tokens.length; i++) {
                const token = tokens[i];
                const nextToken = (i + 1 < tokens.length) ? tokens[i + 1] : null;
                
                if (token === '-X' || token === '--request') {
                    if (nextToken) { parsed.method = nextToken.toUpperCase(); i++; }
                } else if (token === '-H' || token === '--header') {
                    if (nextToken) {
                        const colonIdx = nextToken.indexOf(':');
                        if (colonIdx > 0) {
                            parsed.headers[nextToken.substring(0, colonIdx).trim()] = nextToken.substring(colonIdx + 1).trim();
                        }
                        i++;
                    }
                } else if (['-d', '--data', '--data-raw', '--data-binary', '--data-ascii'].includes(token)) {
                    if (nextToken) {
                        parsed.data = (parsed.data ? parsed.data + '&' : '') + nextToken;
                        hasData = true;
                        i++;
                    }
                } else if (token === '-F' || token === '--form') {
                    if (nextToken) {
                        const eqIdx = nextToken.indexOf('=');
                        if (eqIdx > 0) {
                            parsed.formData.push({
                                key: nextToken.substring(0, eqIdx).trim(),
                                value: nextToken.substring(eqIdx + 1).trim()
                            });
                            hasData = true;
                        }
                        i++;
                    }
                } else if (token === '-u' || token === '--user') {
                    if (nextToken) { parsed.auth = nextToken; i++; }
                } else if (token === '-b' || token === '--cookie') {
                    if (nextToken) { parsed.cookies = nextToken; i++; }
                } else if (token === '-A' || token === '--user-agent') {
                    if (nextToken) { parsed.headers['User-Agent'] = nextToken; i++; }
                } else if (token === '-e' || token === '--referer') {
                    if (nextToken) { parsed.headers['Referer'] = nextToken; i++; }
                } else if (token === '--compressed') { parsed.flags.compressed = true;
                } else if (token === '-k' || token === '--insecure') { parsed.flags.insecure = true;
                } else if (token === '-L' || token === '--location') { parsed.flags.location = true;
                } else if (!token.startsWith('-') && !urlFound) {
                    parsed.url = token;
                    urlFound = true;
                }
            }
            
            if (hasData && parsed.method === 'GET' && !tokens.includes('-X') && !tokens.includes('--request')) {
                parsed.method = 'POST';
            }
            
            return parsed;
        }

        // Code Generators
        const generators = {
            'js-fetch': (p) => {
                let c = `fetch('${p.url}', {\n  method: '${p.method}',\n`;
                
                const h = {...p.headers};
                if (p.auth) h['Authorization'] = `Basic ${btoa(unescape(encodeURIComponent(p.auth)))}`;
                if (p.cookies) h['Cookie'] = p.cookies;
                
                if (Object.keys(h).length > 0) {
                    c += `  headers: {\n`;
                    for (const [k, v] of Object.entries(h)) {
                        if (k === 'Authorization' && p.auth) c += `    '${k}': 'Basic ' + btoa(unescape(encodeURIComponent('${p.auth}'))),\n`;
                        else c += `    '${k}': '${v}',\n`;
                    }
                    c += `  },\n`;
                }
                
                if (p.formData.length > 0) {
                    c += `  body: (() => {\n    const fd = new FormData();\n`;
                    p.formData.forEach(f => c += `    fd.append('${f.key}', '${f.value}');\n`);
                    c += `    return fd;\n  })(),\n`;
                } else if (p.data) {
                    c += `  body: '${p.data.replace(/'/g, "\\'")}',\n`;
                }
                
                if (p.flags.location) c += `  redirect: 'follow',\n`;
                c += `})\n.then(response => response.text())\n.then(result => console.log(result))\n.catch(error => console.error('error', error));`;
                return c;
            },
            'js-axios': (p) => {
                let c = `const axios = require('axios');\n\nlet config = {\n  method: '${p.method.toLowerCase()}',\n  maxBodyLength: Infinity,\n  url: '${p.url}',\n`;
                
                const h = {...p.headers};
                if (p.auth) h['Authorization'] = `Basic ${btoa(unescape(encodeURIComponent(p.auth)))}`;
                if (p.cookies) h['Cookie'] = p.cookies;
                
                if (Object.keys(h).length > 0) {
                    c += `  headers: { \n`;
                    for (const [k, v] of Object.entries(h)) {
                        if (k === 'Authorization' && p.auth) c += `    '${k}': 'Basic ' + Buffer.from('${p.auth}').toString('base64'),\n`;
                        else c += `    '${k}': '${v}',\n`;
                    }
                    c += `  },\n`;
                }
                
                if (p.formData.length > 0) {
                    c = `const axios = require('axios');\nconst FormData = require('form-data');\nlet data = new FormData();\n`;
                    p.formData.forEach(f => c += `data.append('${f.key}', '${f.value}');\n`);
                    c += `\nlet config = {\n  method: '${p.method.toLowerCase()}',\n  maxBodyLength: Infinity,\n  url: '${p.url}',\n  headers: { \n    ...data.getHeaders()\n  },\n  data : data\n`;
                } else if (p.data) {
                    c = `const axios = require('axios');\nlet data = '${p.data.replace(/'/g, "\\'")}'\n\n` + c;
                    c += `  data : data,\n`;
                }
                c += `};\n\naxios.request(config)\n.then((response) => {\n  console.log(JSON.stringify(response.data));\n})\n.catch((error) => {\n  console.log(error);\n});`;
                return c;
            },
            'py-requests': (p) => {
                let c = `import requests\n\nurl = "${p.url}"\n`;
                let kwargs = [];
                
                const h = {...p.headers};
                if (p.cookies) h['Cookie'] = p.cookies;
                
                if (p.formData.length > 0) {
                    c += `payload = {\n`;
                    p.formData.forEach(f => c += `  '${f.key}': '${f.value}',\n`);
                    c += `}\n`;
                    kwargs.push('data=payload');
                } else if (p.data) {
                    c += `payload = '${p.data.replace(/'/g, "\\'")}'\n`;
                    kwargs.push('data=payload');
                }
                
                if (Object.keys(h).length > 0) {
                    c += `headers = {\n`;
                    for (const [k, v] of Object.entries(h)) c += `  '${k}': '${v}',\n`;
                    c += `}\n`;
                    kwargs.push('headers=headers');
                }
                
                if (p.auth) {
                    const parts = p.auth.split(':');
                    c += `auth = ('${parts[0] || ''}', '${parts.slice(1).join(':') || ''}')\n`;
                    kwargs.push('auth=auth');
                }
                
                if (p.flags.insecure) kwargs.push('verify=False');
                if (p.flags.location === false) kwargs.push('allow_redirects=False');
                
                c += `\nresponse = requests.request("${p.method}", url`;
                if (kwargs.length > 0) c += `, ` + kwargs.join(', ');
                c += `)\n\nprint(response.text)`;
                return c;
            },
            'go-http': (p) => {
                let c = `package main\n\nimport (\n  "fmt"\n  "strings"\n  "net/http"\n  "io/ioutil"\n)\n\nfunc main() {\n\n  url := "${p.url}"\n  method := "${p.method}"\n\n`;
                
                if (p.formData.length > 0) {
                    c += `  // Form data in Go requires mime/multipart\n  // Simplified body here\n  payload := strings.NewReader("")\n`;
                } else if (p.data) {
                    c += `  payload := strings.NewReader(` + '`' + p.data + '`' + `)\n`;
                } else {
                    c += `  payload := strings.NewReader("")\n`;
                }
                
                c += `\n  client := &http.Client {\n  }\n  req, err := http.NewRequest(method, url, payload)\n\n  if err != nil {\n    fmt.Println(err)\n    return\n  }\n`;
                
                const h = {...p.headers};
                if (p.cookies) h['Cookie'] = p.cookies;
                
                for (const [k, v] of Object.entries(h)) {
                    c += `  req.Header.Add("${k}", "${v}")\n`;
                }
                
                if (p.auth) {
                    const parts = p.auth.split(':');
                    c += `  req.SetBasicAuth("${parts[0] || ''}", "${parts.slice(1).join(':') || ''}")\n`;
                }
                
                c += `\n  res, err := client.Do(req)\n  if err != nil {\n    fmt.Println(err)\n    return\n  }\n  defer res.Body.Close()\n\n  body, err := ioutil.ReadAll(res.Body)\n  if err != nil {\n    fmt.Println(err)\n    return\n  }\n  fmt.Println(string(body))\n}`;
                return c;
            },
            'php-curl': (p) => {
                let c = `<?php\n\n$curl = curl_init();\n\ncurl_setopt_array($curl, array(\n  CURLOPT_URL => '${p.url}',\n  CURLOPT_RETURNTRANSFER => true,\n  CURLOPT_ENCODING => '',\n  CURLOPT_MAXREDIRS => 10,\n  CURLOPT_TIMEOUT => 0,\n  CURLOPT_FOLLOWLOCATION => ${p.flags.location ? 'true' : 'false'},\n  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,\n  CURLOPT_CUSTOMREQUEST => '${p.method}',\n`;
                
                if (p.formData.length > 0) {
                    c += `  CURLOPT_POSTFIELDS => array(\n`;
                    p.formData.forEach(f => c += `    '${f.key}' => '${f.value}',\n`);
                    c += `  ),\n`;
                } else if (p.data) {
                    c += `  CURLOPT_POSTFIELDS => '${p.data.replace(/'/g, "\\'")}',\n`;
                }
                
                const h = {...p.headers};
                if (p.cookies) h['Cookie'] = p.cookies;
                
                if (Object.keys(h).length > 0) {
                    c += `  CURLOPT_HTTPHEADER => array(\n`;
                    for (const [k, v] of Object.entries(h)) c += `    '${k}: ${v}',\n`;
                    c += `  ),\n`;
                }
                
                if (p.auth) {
                    c += `  CURLOPT_USERPWD => '${p.auth}',\n`;
                }
                
                if (p.flags.insecure) {
                    c += `  CURLOPT_SSL_VERIFYPEER => false,\n  CURLOPT_SSL_VERIFYHOST => false,\n`;
                }
                
                c += `));\n\n$response = curl_exec($curl);\n\ncurl_close($curl);\necho $response;\n`;
                return c;
            }
        };

        function escapeHtml(str) {
            if (str == null) return '';
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        // Simple syntax highlighting
        function highlightSyntax(code, lang) {
            code = escapeHtml(code);
            if (lang === 'js-fetch' || lang === 'js-axios') {
                return code
                    .replace(/(const|let|var|function|return|new|async|await|if|else|for|while)\b/g, '<span class="syntax-keyword">$1</span>')
                    .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="syntax-string">$1</span>')
                    .replace(/\b(fetch|console\.log|console\.error|require|then|catch)\b/g, '<span class="syntax-function">$1</span>');
            } else if (lang === 'py-requests') {
                return code
                    .replace(/(import|def|return|if|else|for|while|True|False|None)\b/g, '<span class="syntax-keyword">$1</span>')
                    .replace(/('[^']*'|"[^"]*")/g, '<span class="syntax-string">$1</span>')
                    .replace(/\b(requests|print)\b/g, '<span class="syntax-function">$1</span>');
            }
            return code;
        }

        function updateUI() {
            const curlStr = inputEl.value.trim();
            if (!curlStr) {
                parsedInfoEl.innerHTML = '<div class="empty-state">Enter a valid cURL command to see parsed details.</div>';
                outputEl.innerHTML = '';
                return;
            }

            const parsed = parseCurl(curlStr);
            if (!parsed) {
                parsedInfoEl.innerHTML = '<div class="empty-state" style="color: var(--accent-danger);">Invalid cURL command. Make sure it starts with "curl ".</div>';
                outputEl.innerHTML = '';
                return;
            }

            lastParsed = parsed;

            // Render parsed details
            let html = `<table class="parsed-table"><tbody>`;
            html += `<tr><th style="width: 100px;">Method</th><td>${escapeHtml(parsed.method)}</td></tr>`;
            html += `<tr><th>URL</th><td class="break-word">${escapeHtml(parsed.url)}</td></tr>`;
            
            if (Object.keys(parsed.headers).length > 0) {
                html += `<tr><th>Headers</th><td><pre style="margin:0;font-family:inherit;font-size:inherit;">`;
                for (const [k, v] of Object.entries(parsed.headers)) html += `${escapeHtml(k)}: ${escapeHtml(v)}\n`;
                html += `</pre></td></tr>`;
            }
            
            if (parsed.data) {
                html += `<tr><th>Data</th><td class="break-word"><pre style="margin:0;font-family:inherit;font-size:inherit;white-space:pre-wrap;">${escapeHtml(parsed.data)}</pre></td></tr>`;
            } else if (parsed.formData.length > 0) {
                html += `<tr><th>Form Data</th><td><ul>`;
                parsed.formData.forEach(f => html += `<li><strong>${escapeHtml(f.key)}</strong>: ${escapeHtml(f.value)}</li>`);
                html += `</ul></td></tr>`;
            }
            
            if (parsed.auth) html += `<tr><th>Auth</th><td>${escapeHtml(parsed.auth)}</td></tr>`;
            if (parsed.cookies) html += `<tr><th>Cookies</th><td class="break-word">${escapeHtml(parsed.cookies)}</td></tr>`;
            
            let flagsStr = Object.entries(parsed.flags).filter(([_, v]) => v).map(([k]) => k).join(', ');
            if (flagsStr) html += `<tr><th>Flags</th><td>${escapeHtml(flagsStr)}</td></tr>`;
            
            html += `</tbody></table>`;
            parsedInfoEl.innerHTML = html;

            generateCode();
        }

        function generateCode() {
            if (!lastParsed) return;
            const code = generators[currentTarget](lastParsed);
            outputEl.innerHTML = highlightSyntax(code, currentTarget);
        }

        // Event Listeners
        convertBtn.addEventListener('click', updateUI);
        
        inputEl.addEventListener('input', () => {
            // Optional: Auto-convert on paste/input
            // updateUI();
        });

        presetsEl.addEventListener('change', (e) => {
            if (e.target.value && presets[e.target.value]) {
                inputEl.value = presets[e.target.value];
                updateUI();
            }
        });

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTarget = btn.getAttribute('data-target');
                generateCode();
            });
        });

        copyBtn.addEventListener('click', () => {
            if (outputEl.innerText) {
                window.copyToClipboard(outputEl.innerText, copyBtn);
            }
        });
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(CurlConverter);
