const ApiTesterTool = {
    name: 'API Tester',
    icon: '🌐',
    category: 'Tester',
    description: 'Gửi HTTP request và kiểm tra response, headers, timing',
    render: function(container) {
        container.innerHTML = `
        <style>
        .api-tester-kv-row {
            display: flex;
            gap: var(--space-sm);
            margin-bottom: var(--space-sm);
        }
        .api-tester-kv-input {
            flex: 1;
        }
        .api-tester-kv-del {
            color: var(--accent-danger);
            cursor: pointer;
            background: none;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            padding: 0 var(--space-sm);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .api-tester-kv-del:hover {
            background: rgba(255,0,0,0.1);
        }
        .tab-btn, .res-tab-btn {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            border-bottom: 2px solid transparent;
            background: transparent;
        }
        .tab-btn.active, .res-tab-btn.active {
            border-bottom: 2px solid var(--accent-primary);
            color: var(--accent-primary);
        }
        .history-item {
            display: flex;
            justify-content: space-between;
            padding: var(--space-sm);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            margin-bottom: var(--space-sm);
            cursor: pointer;
            background: var(--bg-secondary);
        }
        .history-item:hover {
            border-color: var(--border-hover);
        }
        .history-method {
            font-weight: bold;
            margin-right: var(--space-sm);
        }
        .history-url {
            color: var(--text-secondary);
            font-size: var(--fs-sm);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
        }
        .history-time {
            font-size: var(--fs-xs);
            color: var(--text-muted);
            margin-left: var(--space-sm);
        }
        .status-2xx { color: var(--accent-success); font-weight: bold; }
        .status-3xx { color: var(--accent-warning); font-weight: bold; }
        .status-4xx { color: #f97316; font-weight: bold; } /* orange */
        .status-5xx { color: var(--accent-danger); font-weight: bold; }
        </style>
        <div class="tool-panel">
            <div class="tool-header">
                <h2>🌐 API Tester</h2>
                <p class="tool-description">Gửi HTTP request và kiểm tra response, headers, timing</p>
            </div>
            <div class="tool-body">
                <div class="tool-row" style="margin-bottom: var(--space-md); gap: var(--space-sm);">
                    <select id="api-method" class="tool-select" style="width: 120px; font-weight: bold;">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="PATCH">PATCH</option>
                        <option value="DELETE">DELETE</option>
                        <option value="HEAD">HEAD</option>
                        <option value="OPTIONS">OPTIONS</option>
                    </select>
                    <input type="text" id="api-url" class="tool-input" placeholder="https://api.example.com/data" style="flex: 1; font-family: var(--font-mono);" />
                    <button id="api-send-btn" class="tool-btn tool-btn-primary" style="width: 100px;">Send</button>
                </div>

                <div style="margin-bottom: var(--space-md);">
                    <label class="tool-label">Presets:</label>
                    <div class="tool-actions">
                        <button class="tool-btn tool-btn-sm" id="preset-jp-get">JSONPlaceholder (GET posts)</button>
                        <button class="tool-btn tool-btn-sm" id="preset-jp-users">JSONPlaceholder (GET users)</button>
                        <button class="tool-btn tool-btn-sm" id="preset-hb-get">HTTPBin (GET)</button>
                        <button class="tool-btn tool-btn-sm" id="preset-hb-post">HTTPBin (POST)</button>
                    </div>
                </div>

                <div class="tool-tabs" style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); border-bottom: 1px solid var(--border-color);">
                    <button class="tool-btn tab-btn active" data-tab="tab-params">Params</button>
                    <button class="tool-btn tab-btn" data-tab="tab-headers">Headers</button>
                    <button class="tool-btn tab-btn" data-tab="tab-body">Body</button>
                    <button class="tool-btn tab-btn" data-tab="tab-history">History</button>
                </div>
                
                <div id="tab-params" class="api-tab-content">
                    <div id="params-container"></div>
                    <button id="add-param-btn" class="tool-btn tool-btn-sm" style="margin-top: var(--space-sm);">+ Add Param</button>
                </div>
                
                <div id="tab-headers" class="api-tab-content" style="display:none;">
                    <div id="headers-container"></div>
                    <button id="add-header-btn" class="tool-btn tool-btn-sm" style="margin-top: var(--space-sm);">+ Add Header</button>
                </div>

                <div id="tab-body" class="api-tab-content" style="display:none;">
                    <div class="tool-group">
                        <label class="tool-label">Content Type</label>
                        <select id="body-content-type" class="tool-select">
                            <option value="application/json">JSON (application/json)</option>
                            <option value="application/x-www-form-urlencoded">Form (x-www-form-urlencoded)</option>
                            <option value="text/plain">Text (text/plain)</option>
                        </select>
                    </div>
                    <textarea id="api-body" class="tool-textarea" style="height: 150px; font-family: var(--font-mono);" placeholder="Enter request body here..."></textarea>
                </div>

                <div id="tab-history" class="api-tab-content" style="display:none;">
                    <div id="history-container">
                        <p class="tool-description">No request history yet.</p>
                    </div>
                </div>

                <!-- Response Area -->
                <div id="response-area" style="display: none; margin-top: var(--space-lg); border-top: 1px solid var(--border-color); padding-top: var(--space-lg);">
                    <h3 style="margin-top:0;">Response</h3>
                    <div class="tool-stats" style="margin-bottom: var(--space-md);">
                        <div class="tool-stat">
                            <div class="tool-stat-label">Status</div>
                            <div class="tool-stat-value" id="res-status">-</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-label">Time</div>
                            <div class="tool-stat-value" id="res-time">-</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-label">Size</div>
                            <div class="tool-stat-value" id="res-size">-</div>
                        </div>
                    </div>
                    
                    <div class="tool-tabs" style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); border-bottom: 1px solid var(--border-color);">
                        <button class="tool-btn res-tab-btn active" data-tab="res-tab-body">Body</button>
                        <button class="tool-btn res-tab-btn" data-tab="res-tab-headers">Headers</button>
                    </div>
                    
                    <div id="res-tab-body" class="api-res-tab-content">
                        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-sm); align-items: center;">
                            <span class="tool-description" id="res-type-info"></span>
                            <button id="copy-res-btn" class="tool-btn tool-btn-sm">Copy Body</button>
                        </div>
                        <div class="tool-result">
                            <pre id="res-body-content" style="margin:0; white-space: pre-wrap; font-family: var(--font-mono); font-size: var(--fs-sm); overflow-x: auto; max-height: 400px;"></pre>
                        </div>
                    </div>
                    
                    <div id="res-tab-headers" class="api-res-tab-content" style="display:none;">
                        <div class="tool-result">
                            <pre id="res-headers-content" style="margin:0; font-family: var(--font-mono); font-size: var(--fs-sm); white-space: pre-wrap; overflow-x: auto; max-height: 400px;"></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const methodEl = container.querySelector('#api-method');
        const urlEl = container.querySelector('#api-url');
        const sendBtn = container.querySelector('#api-send-btn');
        
        const paramsContainer = container.querySelector('#params-container');
        const addParamBtn = container.querySelector('#add-param-btn');
        const headersContainer = container.querySelector('#headers-container');
        const addHeaderBtn = container.querySelector('#add-header-btn');
        const bodyTypeEl = container.querySelector('#body-content-type');
        const bodyEl = container.querySelector('#api-body');
        
        const historyContainer = container.querySelector('#history-container');
        const resArea = container.querySelector('#response-area');
        
        const resStatus = container.querySelector('#res-status');
        const resTime = container.querySelector('#res-time');
        const resSize = container.querySelector('#res-size');
        const resBodyContent = container.querySelector('#res-body-content');
        const resHeadersContent = container.querySelector('#res-headers-content');
        const resTypeInfo = container.querySelector('#res-type-info');
        const copyResBtn = container.querySelector('#copy-res-btn');

        let responseBodyRaw = '';

        // Tab Switching
        const switchTab = (buttons, contents, activeDataTab) => {
            buttons.forEach(btn => {
                if(btn.dataset.tab === activeDataTab) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            contents.forEach(content => {
                if(content.id === activeDataTab) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        };

        const tabBtns = container.querySelectorAll('.tab-btn');
        const tabContents = container.querySelectorAll('.api-tab-content');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(tabBtns, tabContents, btn.dataset.tab));
        });

        const resTabBtns = container.querySelectorAll('.res-tab-btn');
        const resTabContents = container.querySelectorAll('.api-res-tab-content');
        resTabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(resTabBtns, resTabContents, btn.dataset.tab));
        });

        // Key Value Rows
        const createKVRow = (containerEl, key = '', value = '') => {
            const row = document.createElement('div');
            row.className = 'api-tester-kv-row';
            
            const keyInput = document.createElement('input');
            keyInput.type = 'text';
            keyInput.className = 'tool-input api-tester-kv-input';
            keyInput.placeholder = 'Key';
            keyInput.value = key;
            
            const valInput = document.createElement('input');
            valInput.type = 'text';
            valInput.className = 'tool-input api-tester-kv-input';
            valInput.placeholder = 'Value';
            valInput.value = value;
            
            const delBtn = document.createElement('button');
            delBtn.className = 'api-tester-kv-del';
            delBtn.innerHTML = '×';
            delBtn.title = 'Remove';
            delBtn.onclick = () => row.remove();
            
            row.appendChild(keyInput);
            row.appendChild(valInput);
            row.appendChild(delBtn);
            
            containerEl.appendChild(row);
        };

        addParamBtn.addEventListener('click', () => createKVRow(paramsContainer));
        addHeaderBtn.addEventListener('click', () => createKVRow(headersContainer));

        // Initial empty rows
        createKVRow(paramsContainer);
        createKVRow(headersContainer);

        // Presets
        const loadPreset = (url, method, body = '') => {
            urlEl.value = url;
            methodEl.value = method;
            bodyEl.value = body;
            
            // Clear current params and headers (keep one empty)
            paramsContainer.innerHTML = '';
            headersContainer.innerHTML = '';
            createKVRow(paramsContainer);
            createKVRow(headersContainer);
            
            if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
                bodyTypeEl.value = 'application/json';
                if(body) {
                    headersContainer.innerHTML = '';
                    createKVRow(headersContainer, 'Content-Type', 'application/json');
                }
            }
        };

        container.querySelector('#preset-jp-get').addEventListener('click', () => loadPreset('https://jsonplaceholder.typicode.com/posts', 'GET'));
        container.querySelector('#preset-jp-users').addEventListener('click', () => loadPreset('https://jsonplaceholder.typicode.com/users', 'GET'));
        container.querySelector('#preset-hb-get').addEventListener('click', () => loadPreset('https://httpbin.org/get', 'GET'));
        container.querySelector('#preset-hb-post').addEventListener('click', () => loadPreset('https://httpbin.org/post', 'POST', '{\\n  "test": "value"\\n}'));

        // History
        const loadHistory = () => {
            let history = [];
            try {
                history = JSON.parse(localStorage.getItem('apiTesterHistory')) || [];
            } catch (e) {}
            
            if(history.length === 0) {
                historyContainer.innerHTML = '<p class="tool-description">No request history yet.</p>';
                return;
            }
            
            historyContainer.innerHTML = '';
            history.forEach((item, index) => {
                const el = document.createElement('div');
                el.className = 'history-item';
                el.innerHTML = `
                    <div style="display:flex; align-items:center; overflow:hidden;">
                        <span class="history-method" style="color: ${getMethodColor(item.method)}">${item.method}</span>
                        <span class="history-url" title="${item.url}">${item.url}</span>
                    </div>
                    <span class="history-time">${new Date(item.timestamp).toLocaleTimeString()}</span>
                `;
                el.addEventListener('click', () => restoreHistory(item));
                historyContainer.appendChild(el);
            });
        };

        const saveHistory = (req) => {
            let history = [];
            try {
                history = JSON.parse(localStorage.getItem('apiTesterHistory')) || [];
            } catch (e) {}
            
            history.unshift({ ...req, timestamp: Date.now() });
            if(history.length > 10) history = history.slice(0, 10);
            
            localStorage.setItem('apiTesterHistory', JSON.stringify(history));
            loadHistory();
        };

        const restoreHistory = (item) => {
            methodEl.value = item.method;
            urlEl.value = item.url;
            bodyEl.value = item.body || '';
            bodyTypeEl.value = item.bodyType || 'application/json';
            
            paramsContainer.innerHTML = '';
            if(item.params && item.params.length > 0) {
                item.params.forEach(p => createKVRow(paramsContainer, p.key, p.value));
            } else {
                createKVRow(paramsContainer);
            }
            
            headersContainer.innerHTML = '';
            if(item.headers && item.headers.length > 0) {
                item.headers.forEach(h => createKVRow(headersContainer, h.key, h.value));
            } else {
                createKVRow(headersContainer);
            }
        };

        const getMethodColor = (method) => {
            switch(method) {
                case 'GET': return 'var(--accent-success)';
                case 'POST': return 'var(--accent-warning)';
                case 'PUT': return 'var(--accent-primary)';
                case 'DELETE': return 'var(--accent-danger)';
                default: return 'var(--text-primary)';
            }
        };

        const getStatusClass = (status) => {
            if(status >= 200 && status < 300) return 'status-2xx';
            if(status >= 300 && status < 400) return 'status-3xx';
            if(status >= 400 && status < 500) return 'status-4xx';
            if(status >= 500) return 'status-5xx';
            return '';
        };

        const formatBytes = (bytes) => {
            if (bytes === 0) return '0 B';
            if (!bytes || isNaN(bytes)) return '-';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        const escapeHtml = (unsafe) => {
            return (unsafe||'').toString()
                 .replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
        };

        const syntaxHighlightJSON = (jsonStr) => {
            let obj;
            try {
                obj = JSON.parse(jsonStr);
            } catch(e) {
                return escapeHtml(jsonStr);
            }
            const formatted = JSON.stringify(obj, null, 2);
            // Simple regex based highlighting
            return escapeHtml(formatted)
                .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                    let cls = 'var(--accent-primary)'; // default string
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'var(--text-primary)'; // key
                        } else {
                            cls = 'var(--accent-success)'; // string value
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'var(--accent-warning)'; // boolean
                    } else if (/null/.test(match)) {
                        cls = 'var(--text-muted)'; // null
                    } else {
                        cls = '#f97316'; // number
                    }
                    return '<span style="color:' + cls + '">' + match + '</span>';
                });
        };

        loadHistory();

        // Send Request
        sendBtn.addEventListener('click', async () => {
            const method = methodEl.value;
            let baseUrl = urlEl.value.trim();
            
            if(!baseUrl) {
                window.showToast('Please enter a URL', 'error');
                return;
            }

            if (!/^https?:\/\//i.test(baseUrl)) {
                baseUrl = 'http://' + baseUrl;
                urlEl.value = baseUrl;
            }

            // Extract Params
            const params = [];
            const urlObj = new URL(baseUrl);
            paramsContainer.querySelectorAll('.api-tester-kv-row').forEach(row => {
                const k = row.children[0].value.trim();
                const v = row.children[1].value;
                if(k) {
                    params.push({key: k, value: v});
                    urlObj.searchParams.append(k, v);
                }
            });
            const finalUrl = urlObj.toString();

            // Extract Headers
            const headers = {};
            const headersList = [];
            headersContainer.querySelectorAll('.api-tester-kv-row').forEach(row => {
                const k = row.children[0].value.trim();
                const v = row.children[1].value.trim();
                if(k) {
                    headers[k] = v;
                    headersList.push({key: k, value: v});
                }
            });

            // Prepare Request
            const reqOpts = {
                method: method,
                headers: headers
            };

            const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
            let bodyText = bodyEl.value;
            if(hasBody) {
                reqOpts.body = bodyText;
                if(!headers['Content-Type']) {
                    headers['Content-Type'] = bodyTypeEl.value;
                }
            }

            // Save History
            saveHistory({
                method: method,
                url: baseUrl,
                params: params,
                headers: headersList,
                body: hasBody ? bodyText : '',
                bodyType: bodyTypeEl.value
            });

            sendBtn.innerHTML = 'Sending...';
            sendBtn.disabled = true;
            resArea.style.display = 'none';
            responseBodyRaw = '';

            const startTime = performance.now();

            try {
                const response = await fetch(finalUrl, reqOpts);
                const endTime = performance.now();
                const timeTaken = Math.round(endTime - startTime);

                const status = response.status;
                const statusText = response.statusText;
                
                // Get Headers
                let resHeadersStr = '';
                response.headers.forEach((val, key) => {
                    resHeadersStr += `${key}: ${val}\n`;
                });

                // Get Body
                const blob = await response.blob();
                const size = blob.size;
                const text = await blob.text();
                responseBodyRaw = text;

                // Update UI
                resStatus.innerHTML = `<span class="${getStatusClass(status)}">${status} ${statusText}</span>`;
                resTime.innerText = `${timeTaken} ms`;
                resSize.innerText = formatBytes(size);
                
                const contentType = response.headers.get('content-type') || '';
                resTypeInfo.innerText = contentType;

                if (contentType.includes('application/json')) {
                    resBodyContent.innerHTML = syntaxHighlightJSON(text);
                } else {
                    resBodyContent.textContent = text;
                }

                resHeadersContent.textContent = resHeadersStr || 'No headers';
                
                resArea.style.display = 'block';
                // Switch to Response Body tab
                switchTab(resTabBtns, resTabContents, 'res-tab-body');

            } catch (err) {
                const endTime = performance.now();
                const timeTaken = Math.round(endTime - startTime);
                
                resStatus.innerHTML = `<span class="status-5xx">Error</span>`;
                resTime.innerText = `${timeTaken} ms`;
                resSize.innerText = '-';
                resTypeInfo.innerText = '';
                
                let errorMsg = err.message;
                if(errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
                    errorMsg += "\\n\\nPossible causes:\\n- The URL is unreachable\\n- CORS (Cross-Origin Resource Sharing) is not enabled on the server for this origin\\n- Network connection issue";
                }
                
                responseBodyRaw = errorMsg;
                resBodyContent.textContent = errorMsg;
                resHeadersContent.textContent = 'No headers (Request failed)';
                
                resArea.style.display = 'block';
                switchTab(resTabBtns, resTabContents, 'res-tab-body');
                
                window.showToast('Request failed', 'error');
            } finally {
                sendBtn.innerHTML = 'Send';
                sendBtn.disabled = false;
            }
        });

        copyResBtn.addEventListener('click', () => {
            if(responseBodyRaw) {
                window.copyToClipboard(responseBodyRaw, copyResBtn);
            }
        });
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(ApiTesterTool);
