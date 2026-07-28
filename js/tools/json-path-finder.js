const JsonPathFinderTool = {
    name: 'JSON Path Finder',
    icon: '📋',
    category: 'Formatter',
    description: 'Tìm và copy JSONPath từ dữ liệu JSON',

    render(container) {
        const defaultJson = {
            "store": {
                "book": [
                    {
                        "category": "reference",
                        "author": "Nigel Rees",
                        "title": "Sayings of the Century",
                        "price": 8.95
                    },
                    {
                        "category": "fiction",
                        "author": "Evelyn Waugh",
                        "title": "Sword of Honour",
                        "price": 12.99
                    }
                ],
                "bicycle": {
                    "color": "red",
                    "price": 19.95
                }
            },
            "active": true,
            "status": null
        };

        const template = `
            <style>
                .json-path-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-md);
                    height: calc(100vh - 250px);
                    min-height: 500px;
                }
                
                .panel {
                    display: flex;
                    flex-direction: column;
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                }

                .panel-header {
                    padding: var(--space-sm) var(--space-md);
                    background: var(--bg-tertiary);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .panel-title {
                    font-weight: 600;
                    font-size: var(--fs-sm);
                }

                .panel-actions {
                    display: flex;
                    gap: var(--space-sm);
                }

                .json-input {
                    flex: 1;
                    padding: var(--space-md);
                    border: none;
                    background: transparent;
                    color: var(--text-primary);
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    resize: none;
                    outline: none;
                }
                
                .path-bar {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    padding: var(--space-sm) var(--space-md);
                    background: var(--bg-tertiary);
                    border-bottom: 1px solid var(--border-color);
                }
                
                .path-input {
                    flex: 1;
                    background: var(--bg-input);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    font-family: var(--font-mono);
                    padding: 4px 8px;
                    border-radius: var(--radius-sm);
                    font-size: var(--fs-sm);
                }

                .search-bar {
                    padding: var(--space-sm) var(--space-md);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    gap: var(--space-sm);
                }
                
                .search-input {
                    flex: 1;
                    background: var(--bg-input);
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    padding: 4px 8px;
                    border-radius: var(--radius-sm);
                    font-size: var(--fs-sm);
                }
                
                .breadcrumb {
                    padding: var(--space-sm) var(--space-md);
                    border-bottom: 1px solid var(--border-color);
                    font-size: var(--fs-xs);
                    font-family: var(--font-mono);
                    color: var(--text-secondary);
                    white-space: nowrap;
                    overflow-x: auto;
                }

                .tree-container {
                    flex: 1;
                    padding: var(--space-md);
                    overflow: auto;
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                }

                .tree-node {
                    margin-left: var(--space-md);
                    position: relative;
                }
                
                .tree-node.root {
                    margin-left: 0;
                }

                .tree-item {
                    display: flex;
                    align-items: flex-start;
                    padding: 2px 0;
                    cursor: pointer;
                    border-radius: 2px;
                }

                .tree-item:hover {
                    background: var(--bg-tertiary);
                }
                
                .tree-item.selected {
                    background: rgba(var(--accent-primary-rgb), 0.2);
                    outline: 1px solid var(--accent-primary);
                }

                .toggle-icon {
                    width: 16px;
                    height: 16px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    user-select: none;
                    color: var(--text-secondary);
                    transition: transform var(--transition-fast);
                }
                
                .toggle-icon.collapsed {
                    transform: rotate(-90deg);
                }
                
                .toggle-icon.empty {
                    visibility: hidden;
                }

                .node-key {
                    color: var(--accent-primary);
                    margin-right: 4px;
                }

                .node-value.string { color: var(--accent-success); }
                .node-value.number { color: #4dabf7; }
                .node-value.boolean { color: var(--accent-warning); }
                .node-value.null { color: var(--accent-danger); }
                
                .node-bracket {
                    color: var(--text-secondary);
                }
                
                .children-container {
                    display: block;
                }
                
                .children-container.collapsed {
                    display: none;
                }
                
                .error-message {
                    color: var(--accent-danger);
                    padding: var(--space-md);
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    display: none;
                }
                
                .tree-item.hidden {
                    display: none;
                }

                @media (max-width: 768px) {
                    .json-path-container {
                        grid-template-columns: 1fr;
                        height: auto;
                    }
                    .panel {
                        height: 400px;
                    }
                }
            </style>

            <div class="tool-panel">
                <div class="tool-header">
                    <h2>${this.icon} ${this.name}</h2>
                    <p class="tool-description">${this.description}</p>
                </div>

                <div class="tool-body">
                    <div class="json-path-container">
                        <!-- Left Panel: Input -->
                        <div class="panel">
                            <div class="panel-header">
                                <span class="panel-title">JSON Input</span>
                                <div class="panel-actions">
                                    <button class="tool-btn tool-btn-sm" id="btn-format">Format</button>
                                    <button class="tool-btn tool-btn-sm" id="btn-minify">Minify</button>
                                </div>
                            </div>
                            <textarea id="json-input" class="json-input" spellcheck="false"></textarea>
                            <div id="json-error" class="error-message"></div>
                        </div>

                        <!-- Right Panel: Tree View -->
                        <div class="panel">
                            <div class="path-bar">
                                <span class="panel-title">Path</span>
                                <input type="text" id="path-output" class="path-input" readonly value="$">
                                <button class="tool-btn tool-btn-sm tool-btn-primary" id="btn-copy-path">Copy</button>
                            </div>
                            <div class="search-bar">
                                <input type="text" id="search-input" class="search-input" placeholder="Search keys...">
                                <button class="tool-btn tool-btn-sm" id="btn-expand-all">Expand All</button>
                                <button class="tool-btn tool-btn-sm" id="btn-collapse-all">Collapse All</button>
                            </div>
                            <div id="breadcrumb" class="breadcrumb">$</div>
                            <div id="tree-container" class="tree-container"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = template;

        // Elements
        const inputEl = container.querySelector('#json-input');
        const errorEl = container.querySelector('#json-error');
        const treeEl = container.querySelector('#tree-container');
        const pathOutputEl = container.querySelector('#path-output');
        const breadcrumbEl = container.querySelector('#breadcrumb');
        const searchInputEl = container.querySelector('#search-input');
        
        const btnFormat = container.querySelector('#btn-format');
        const btnMinify = container.querySelector('#btn-minify');
        const btnCopyPath = container.querySelector('#btn-copy-path');
        const btnExpandAll = container.querySelector('#btn-expand-all');
        const btnCollapseAll = container.querySelector('#btn-collapse-all');

        let parsedData = null;
        let selectedItem = null;

        // Initialize
        inputEl.value = JSON.stringify(defaultJson, null, 2);
        parseAndRender();

        // Event Listeners
        inputEl.addEventListener('input', () => {
            parseAndRender();
        });

        btnFormat.addEventListener('click', () => {
            try {
                const obj = JSON.parse(inputEl.value);
                inputEl.value = JSON.stringify(obj, null, 2);
                errorEl.style.display = 'none';
            } catch (e) {
                // Ignore if invalid
            }
        });

        btnMinify.addEventListener('click', () => {
            try {
                const obj = JSON.parse(inputEl.value);
                inputEl.value = JSON.stringify(obj);
                errorEl.style.display = 'none';
            } catch (e) {
                // Ignore if invalid
            }
        });

        btnCopyPath.addEventListener('click', () => {
            window.copyToClipboard(pathOutputEl.value, btnCopyPath);
        });

        btnExpandAll.addEventListener('click', () => {
            const toggles = treeEl.querySelectorAll('.toggle-icon:not(.empty)');
            const containers = treeEl.querySelectorAll('.children-container');
            toggles.forEach(t => t.classList.remove('collapsed'));
            containers.forEach(c => c.classList.remove('collapsed'));
        });

        btnCollapseAll.addEventListener('click', () => {
            const toggles = treeEl.querySelectorAll('.toggle-icon:not(.empty)');
            const containers = treeEl.querySelectorAll('.children-container');
            toggles.forEach(t => t.classList.add('collapsed'));
            containers.forEach(c => c.classList.add('collapsed'));
        });

        searchInputEl.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            if (!term) {
                // Reset search
                const items = treeEl.querySelectorAll('.tree-item');
                items.forEach(item => item.classList.remove('hidden'));
                return;
            }

            const items = treeEl.querySelectorAll('.tree-item');
            items.forEach(item => {
                const keyEl = item.querySelector('.node-key');
                if (keyEl) {
                    const keyText = keyEl.textContent.toLowerCase();
                    // Just removing quote for search
                    const cleanKey = keyText.replace(/^"|"$/g, '').replace(/:$/, '');
                    if (cleanKey.includes(term)) {
                        item.classList.remove('hidden');
                        // Show all parents
                        let parent = item.parentElement;
                        while (parent && parent !== treeEl) {
                            if (parent.classList.contains('tree-node')) {
                                const parentItem = parent.querySelector('.tree-item');
                                if (parentItem) parentItem.classList.remove('hidden');
                            }
                            parent = parent.parentElement;
                        }
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });

        // Tree Event Delegation
        treeEl.addEventListener('click', (e) => {
            const toggleIcon = e.target.closest('.toggle-icon');
            const treeItem = e.target.closest('.tree-item');

            if (toggleIcon && !toggleIcon.classList.contains('empty')) {
                // Toggle expand/collapse
                toggleIcon.classList.toggle('collapsed');
                const node = toggleIcon.closest('.tree-node');
                const children = node.querySelector('.children-container');
                if (children) {
                    children.classList.toggle('collapsed');
                }
                e.stopPropagation();
                return;
            }

            if (treeItem) {
                // Select node
                if (selectedItem) {
                    selectedItem.classList.remove('selected');
                }
                selectedItem = treeItem;
                selectedItem.classList.add('selected');

                const path = treeItem.dataset.path || '$';
                pathOutputEl.value = path;
                updateBreadcrumb(path);
            }
        });

        // Functions
        function parseAndRender() {
            const val = inputEl.value.trim();
            if (!val) {
                treeEl.innerHTML = '';
                errorEl.style.display = 'none';
                return;
            }

            try {
                parsedData = JSON.parse(val);
                errorEl.style.display = 'none';
                inputEl.style.borderBottom = 'none';
                renderTree();
            } catch (e) {
                errorEl.textContent = `Invalid JSON: ${e.message}`;
                errorEl.style.display = 'block';
                inputEl.style.borderBottom = '1px solid var(--accent-danger)';
            }
        }

        function renderTree() {
            treeEl.innerHTML = '';
            
            const rootNode = document.createElement('div');
            rootNode.className = 'tree-node root';
            
            const path = '$';
            
            if (Array.isArray(parsedData)) {
                buildNode(rootNode, 'root', parsedData, path, true, true);
            } else if (typeof parsedData === 'object' && parsedData !== null) {
                buildNode(rootNode, 'root', parsedData, path, false, true);
            } else {
                buildNode(rootNode, 'root', parsedData, path, false, true, true);
            }
            
            treeEl.appendChild(rootNode);
            
            // Select root by default
            const firstItem = treeEl.querySelector('.tree-item');
            if (firstItem) {
                firstItem.click();
            }
        }

        function buildNode(container, key, value, path, isArrayElem, isRoot = false, isPrimitiveRoot = false) {
            const isObj = typeof value === 'object' && value !== null;
            const isArr = Array.isArray(value);
            
            const nodeEl = document.createElement('div');
            nodeEl.className = 'tree-node';
            
            const itemEl = document.createElement('div');
            itemEl.className = 'tree-item';
            itemEl.dataset.path = path;
            
            // Toggle icon
            const toggleEl = document.createElement('span');
            toggleEl.className = 'toggle-icon';
            if (isObj && Object.keys(value).length > 0) {
                toggleEl.innerHTML = '▼';
            } else {
                toggleEl.className += ' empty';
            }
            itemEl.appendChild(toggleEl);
            
            // Key
            if (!isRoot || isArrayElem) {
                const keyEl = document.createElement('span');
                keyEl.className = 'node-key';
                if (isArrayElem) {
                    keyEl.textContent = isRoot ? '' : `${key}:`;
                } else {
                    keyEl.textContent = `"${key}":`;
                }
                
                // If it's root array element, no key needed
                if (!(isRoot && isArrayElem) && !(isRoot && isPrimitiveRoot)) {
                    itemEl.appendChild(keyEl);
                }
            }
            
            // Value
            if (isObj) {
                const bracketStartEl = document.createElement('span');
                bracketStartEl.className = 'node-bracket';
                bracketStartEl.textContent = isArr ? '[' : '{';
                itemEl.appendChild(bracketStartEl);
                
                if (Object.keys(value).length === 0) {
                    const bracketEndEl = document.createElement('span');
                    bracketEndEl.className = 'node-bracket';
                    bracketEndEl.textContent = isArr ? ']' : '}';
                    itemEl.appendChild(bracketEndEl);
                }
            } else {
                const valEl = document.createElement('span');
                valEl.className = `node-value ${value === null ? 'null' : typeof value}`;
                if (typeof value === 'string') {
                    valEl.textContent = `"${value}"`;
                } else {
                    valEl.textContent = String(value);
                }
                itemEl.appendChild(valEl);
            }
            
            nodeEl.appendChild(itemEl);
            
            // Children
            if (isObj && Object.keys(value).length > 0) {
                const childrenContainer = document.createElement('div');
                childrenContainer.className = 'children-container';
                
                let i = 0;
                const keys = Object.keys(value);
                
                for (const k of keys) {
                    const childVal = value[k];
                    let childPath = path;
                    
                    if (isArr) {
                        childPath += `[${k}]`;
                    } else {
                        // Check if key needs bracket notation
                        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)) {
                            childPath += `.${k}`;
                        } else {
                            childPath += `["${k.replace(/"/g, '\\"')}"]`;
                        }
                    }
                    
                    buildNode(childrenContainer, k, childVal, childPath, isArr);
                    i++;
                }
                
                const bracketEndNode = document.createElement('div');
                bracketEndNode.className = 'tree-item';
                bracketEndNode.dataset.path = path;
                bracketEndNode.innerHTML = `<span class="toggle-icon empty"></span><span class="node-bracket">${isArr ? ']' : '}'}</span>`;
                
                childrenContainer.appendChild(bracketEndNode);
                nodeEl.appendChild(childrenContainer);
            }
            
            container.appendChild(nodeEl);
        }

        function updateBreadcrumb(path) {
            breadcrumbEl.textContent = path;
        }
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(JsonPathFinderTool);
