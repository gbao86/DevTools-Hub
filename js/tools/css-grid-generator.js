const CSSGridGenerator = {
    name: 'CSS Grid Generator',
    icon: '🔲',
    category: 'Web',
    description: 'Visual CSS Grid layout builder — define rows, columns, areas và xuất CSS code',
    render(container) {
        let state = {
            columns: ['1fr', '1fr', '1fr'],
            rows: ['1fr', '1fr', '1fr'],
            gapRow: 10,
            gapCol: 10,
            syncGap: true,
            justifyItems: 'stretch',
            alignItems: 'stretch',
            justifyContent: 'start',
            alignContent: 'start',
            items: [
                { id: 1, rowStart: 1, rowEnd: 2, colStart: 1, colEnd: 2, color: 'var(--accent-primary)' }
            ],
            selectedCells: []
        };

        const presets = {
            'Basic 3-Column': {
                columns: ['1fr', '1fr', '1fr'], rows: ['1fr', '1fr', '1fr'], gapRow: 10, gapCol: 10,
                items: []
            },
            '12-Column Grid': {
                columns: Array(12).fill('1fr'), rows: ['100px', '200px', '100px'], gapRow: 16, gapCol: 16,
                items: [
                    { id: 1, rowStart: 1, rowEnd: 2, colStart: 1, colEnd: 13, color: '#f59e0b' },
                    { id: 2, rowStart: 2, rowEnd: 3, colStart: 1, colEnd: 9, color: '#3b82f6' },
                    { id: 3, rowStart: 2, rowEnd: 3, colStart: 9, colEnd: 13, color: '#10b981' },
                ]
            },
            'Holy Grail': {
                columns: ['200px', '1fr', '200px'], rows: ['auto', '1fr', '60px'], gapRow: 10, gapCol: 10,
                items: [
                    { id: 1, rowStart: 1, rowEnd: 2, colStart: 1, colEnd: 4, color: '#ef4444' },
                    { id: 2, rowStart: 2, rowEnd: 3, colStart: 1, colEnd: 2, color: '#8b5cf6' },
                    { id: 3, rowStart: 2, rowEnd: 3, colStart: 2, colEnd: 3, color: '#3b82f6' },
                    { id: 4, rowStart: 2, rowEnd: 3, colStart: 3, colEnd: 4, color: '#f59e0b' },
                    { id: 5, rowStart: 3, rowEnd: 4, colStart: 1, colEnd: 4, color: '#10b981' }
                ]
            },
            'Dashboard': {
                columns: ['250px', '1fr', '1fr'], rows: ['60px', '200px', '1fr'], gapRow: 16, gapCol: 16,
                items: [
                    { id: 1, rowStart: 1, rowEnd: 4, colStart: 1, colEnd: 2, color: '#6366f1' },
                    { id: 2, rowStart: 1, rowEnd: 2, colStart: 2, colEnd: 4, color: '#14b8a6' },
                    { id: 3, rowStart: 2, rowEnd: 3, colStart: 2, colEnd: 3, color: '#ec4899' },
                    { id: 4, rowStart: 2, rowEnd: 3, colStart: 3, colEnd: 4, color: '#8b5cf6' },
                    { id: 5, rowStart: 3, rowEnd: 4, colStart: 2, colEnd: 4, color: '#3b82f6' }
                ]
            },
            'Gallery': {
                columns: ['repeat(auto-fit, minmax(150px, 1fr))'], rows: ['150px', '150px'], gapRow: 10, gapCol: 10,
                items: []
            }
        };

        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'];
        
        const style = `
            <style>
                .cgg-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                    height: 100%;
                }
                .cgg-main {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: var(--space-md);
                    min-height: 500px;
                }
                .cgg-panel {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: var(--space-md);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                    overflow-y: auto;
                    max-height: 600px;
                }
                .cgg-section-title {
                    font-size: var(--fs-md);
                    font-weight: 600;
                    margin-bottom: var(--space-sm);
                    color: var(--text-primary);
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: var(--space-xs);
                }
                .cgg-tracks {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-xs);
                }
                .cgg-track-item {
                    display: flex;
                    gap: var(--space-xs);
                    align-items: center;
                }
                .cgg-track-input {
                    flex: 1;
                }
                .cgg-track-btn {
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-sm);
                    color: var(--text-secondary);
                    cursor: pointer;
                }
                .cgg-track-btn:hover {
                    color: var(--accent-danger);
                    border-color: var(--border-hover);
                }
                .cgg-gap-control {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    gap: var(--space-sm);
                    align-items: end;
                }
                .cgg-link-btn {
                    margin-bottom: 2px;
                    background: transparent;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    font-size: 1.2rem;
                }
                .cgg-link-btn.active {
                    color: var(--accent-primary);
                }
                .cgg-preview-container {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: var(--space-lg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    min-height: 400px;
                }
                .cgg-grid-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border: 1px dashed var(--border-focus);
                    background: repeating-linear-gradient(45deg, var(--bg-tertiary), var(--bg-tertiary) 10px, transparent 10px, transparent 20px);
                }
                .cgg-grid {
                    display: grid;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    transition: all 0.3s ease;
                }
                .cgg-grid-cell {
                    border: 1px dotted var(--border-hover);
                    background: rgba(255,255,255,0.02);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-tertiary);
                    font-size: var(--fs-xs);
                    font-family: var(--font-mono);
                }
                .cgg-grid-cell:hover {
                    background: rgba(255,255,255,0.05);
                }
                .cgg-grid-item {
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    font-weight: bold;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                    transition: all 0.3s ease;
                    position: relative;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    opacity: 0.9;
                }
                .cgg-grid-item:hover {
                    opacity: 1;
                    z-index: 10;
                    transform: scale(0.98);
                }
                .cgg-item-delete {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 20px;
                    height: 20px;
                    background: var(--accent-danger);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    cursor: pointer;
                    display: none;
                    z-index: 100;
                }
                .cgg-grid-item:hover .cgg-item-delete {
                    display: flex;
                }
                .cgg-code-panel {
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: var(--space-md);
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    white-space: pre-wrap;
                    position: relative;
                    color: var(--text-secondary);
                }
                .cgg-copy-btn {
                    position: absolute;
                    top: var(--space-sm);
                    right: var(--space-sm);
                }
                .cgg-presets {
                    display: flex;
                    gap: var(--space-sm);
                    flex-wrap: wrap;
                    margin-bottom: var(--space-sm);
                }
                .cgg-preset-btn {
                    padding: var(--space-xs) var(--space-sm);
                    border-radius: var(--radius-sm);
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    color: var(--text-secondary);
                    font-size: var(--fs-xs);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .cgg-preset-btn:hover {
                    background: var(--bg-secondary);
                    color: var(--text-primary);
                    border-color: var(--border-hover);
                }
                .cgg-items-list {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-xs);
                }
                .cgg-item-control {
                    display: grid;
                    grid-template-columns: auto 1fr 1fr auto;
                    gap: var(--space-xs);
                    background: var(--bg-tertiary);
                    padding: var(--space-xs);
                    border-radius: var(--radius-sm);
                    align-items: center;
                }
                .cgg-item-color {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                }
                
                @media (max-width: 900px) {
                    .cgg-main {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;

        const html = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>${this.icon} ${this.name}</h2>
                    <p class="tool-description">${this.description}</p>
                </div>
                <div class="tool-body">
                    <div class="cgg-container">
                        
                        <div class="cgg-presets" id="cgg-presets">
                            <!-- Presets rendered here -->
                        </div>

                        <div class="cgg-main">
                            <!-- Left Panel: Controls -->
                            <div class="cgg-panel">
                                <div class="cgg-section">
                                    <div class="cgg-section-title">Columns</div>
                                    <div class="cgg-tracks" id="cgg-cols-container"></div>
                                    <button class="tool-btn tool-btn-sm" style="margin-top: 8px; width: 100%" id="cgg-add-col">+ Add Column</button>
                                </div>

                                <div class="cgg-section">
                                    <div class="cgg-section-title">Rows</div>
                                    <div class="cgg-tracks" id="cgg-rows-container"></div>
                                    <button class="tool-btn tool-btn-sm" style="margin-top: 8px; width: 100%" id="cgg-add-row">+ Add Row</button>
                                </div>

                                <div class="cgg-section">
                                    <div class="cgg-section-title">Gaps</div>
                                    <div class="cgg-gap-control">
                                        <div class="tool-group">
                                            <label class="tool-label">Row Gap (px)</label>
                                            <input type="number" class="tool-input" id="cgg-gap-row" value="${state.gapRow}" min="0">
                                        </div>
                                        <button class="cgg-link-btn active" id="cgg-gap-link" title="Sync Gaps">🔗</button>
                                        <div class="tool-group">
                                            <label class="tool-label">Column Gap (px)</label>
                                            <input type="number" class="tool-input" id="cgg-gap-col" value="${state.gapCol}" min="0">
                                        </div>
                                    </div>
                                </div>

                                <div class="cgg-section">
                                    <div class="cgg-section-title">Alignment</div>
                                    <div class="tool-group">
                                        <label class="tool-label">justify-items</label>
                                        <select class="tool-select" id="cgg-justify-items">
                                            <option value="stretch">stretch</option>
                                            <option value="start">start</option>
                                            <option value="end">end</option>
                                            <option value="center">center</option>
                                        </select>
                                    </div>
                                    <div class="tool-group">
                                        <label class="tool-label">align-items</label>
                                        <select class="tool-select" id="cgg-align-items">
                                            <option value="stretch">stretch</option>
                                            <option value="start">start</option>
                                            <option value="end">end</option>
                                            <option value="center">center</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="cgg-section">
                                    <div class="cgg-section-title">Child Items</div>
                                    <div class="cgg-items-list" id="cgg-items-container"></div>
                                    <button class="tool-btn tool-btn-sm" style="margin-top: 8px; width: 100%" id="cgg-add-item">+ Add Item</button>
                                </div>
                            </div>

                            <!-- Right Panel: Preview -->
                            <div class="cgg-preview-container">
                                <div class="cgg-grid-wrapper">
                                    <!-- Base grid cells -->
                                    <div class="cgg-grid" id="cgg-base-grid"></div>
                                    <!-- Actual grid layout -->
                                    <div class="cgg-grid" id="cgg-live-grid"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Code Output -->
                        <div class="cgg-code-panel">
                            <button class="tool-btn tool-btn-sm cgg-copy-btn" id="cgg-copy-code">Copy CSS</button>
                            <code id="cgg-code-output"></code>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = style + html;

        // --- DOM Elements ---
        const els = {
            presets: container.querySelector('#cgg-presets'),
            colsContainer: container.querySelector('#cgg-cols-container'),
            rowsContainer: container.querySelector('#cgg-rows-container'),
            addCol: container.querySelector('#cgg-add-col'),
            addRow: container.querySelector('#cgg-add-row'),
            gapRow: container.querySelector('#cgg-gap-row'),
            gapCol: container.querySelector('#cgg-gap-col'),
            gapLink: container.querySelector('#cgg-gap-link'),
            justifyItems: container.querySelector('#cgg-justify-items'),
            alignItems: container.querySelector('#cgg-align-items'),
            itemsContainer: container.querySelector('#cgg-items-container'),
            addItem: container.querySelector('#cgg-add-item'),
            baseGrid: container.querySelector('#cgg-base-grid'),
            liveGrid: container.querySelector('#cgg-live-grid'),
            codeOutput: container.querySelector('#cgg-code-output'),
            copyCode: container.querySelector('#cgg-copy-code')
        };

        // --- Render Functions ---
        
        const renderPresets = () => {
            els.presets.innerHTML = Object.keys(presets).map(name => 
                `<button class="cgg-preset-btn" data-preset="${name}">${name}</button>`
            ).join('');
        };

        const renderTracks = (type) => {
            const arr = state[type];
            const cont = type === 'columns' ? els.colsContainer : els.rowsContainer;
            cont.innerHTML = arr.map((val, idx) => `
                <div class="cgg-track-item">
                    <span style="font-size: 10px; width: 12px; text-align: center; color: var(--text-tertiary)">${idx+1}</span>
                    <input type="text" class="tool-input cgg-track-input" value="${val}" data-idx="${idx}" data-type="${type}">
                    <button class="cgg-track-btn" data-idx="${idx}" data-type="${type}">×</button>
                </div>
            `).join('');
        };

        const renderItemsList = () => {
            els.itemsContainer.innerHTML = state.items.map((item, idx) => `
                <div class="cgg-item-control">
                    <div class="cgg-item-color" style="background: ${item.color}"></div>
                    <input type="text" class="tool-input tool-input-sm" value="${item.colStart} / ${item.colEnd}" placeholder="c-start / c-end" data-idx="${idx}" data-prop="col">
                    <input type="text" class="tool-input tool-input-sm" value="${item.rowStart} / ${item.rowEnd}" placeholder="r-start / r-end" data-idx="${idx}" data-prop="row">
                    <button class="cgg-track-btn" data-idx="${idx}" data-action="delete-item">×</button>
                </div>
            `).join('');
        };

        const updateGridStyles = () => {
            const gridStyle = `
                grid-template-columns: ${state.columns.join(' ')};
                grid-template-rows: ${state.rows.join(' ')};
                gap: ${state.gapRow}px ${state.gapCol}px;
                justify-items: ${state.justifyItems};
                align-items: ${state.alignItems};
            `;
            els.baseGrid.style.cssText = gridStyle;
            els.liveGrid.style.cssText = gridStyle;
        };

        const renderVisualGrid = () => {
            updateGridStyles();

            // Base cells for structure visualization
            const numCols = state.columns.length || 1;
            const numRows = state.rows.length || 1;
            const totalCells = numCols * numRows;
            
            els.baseGrid.innerHTML = Array.from({length: totalCells}).map((_, i) => 
                `<div class="cgg-grid-cell"></div>`
            ).join('');

            // Render items
            els.liveGrid.innerHTML = state.items.map((item, idx) => `
                <div class="cgg-grid-item" style="
                    grid-column: ${item.colStart} / ${item.colEnd};
                    grid-row: ${item.rowStart} / ${item.rowEnd};
                    background-color: ${item.color};
                ">
                    .item-${item.id}
                    <div class="cgg-item-delete" data-idx="${idx}">×</div>
                </div>
            `).join('');
        };

        const generateCode = () => {
            let css = `.container {\n`;
            css += `  display: grid;\n`;
            css += `  grid-template-columns: ${state.columns.join(' ')};\n`;
            css += `  grid-template-rows: ${state.rows.join(' ')};\n`;
            
            if (state.gapRow === state.gapCol && state.gapRow > 0) {
                css += `  gap: ${state.gapRow}px;\n`;
            } else if (state.gapRow > 0 || state.gapCol > 0) {
                css += `  gap: ${state.gapRow}px ${state.gapCol}px;\n`;
            }

            if (state.justifyItems !== 'stretch') css += `  justify-items: ${state.justifyItems};\n`;
            if (state.alignItems !== 'stretch') css += `  align-items: ${state.alignItems};\n`;
            
            css += `}\n`;

            if (state.items.length > 0) {
                css += `\n`;
                state.items.forEach(item => {
                    css += `.item-${item.id} {\n`;
                    css += `  grid-column: ${item.colStart} / ${item.colEnd};\n`;
                    css += `  grid-row: ${item.rowStart} / ${item.rowEnd};\n`;
                    css += `}\n`;
                });
            }

            // Syntax highlighting roughly
            let highlighted = css
                .replace(/([a-z-]+):/g, '<span style="color: #6366f1">$1</span>:')
                .replace(/(\.[a-zA-Z0-9-]+)/g, '<span style="color: #f59e0b">$1</span>')
                .replace(/({|})/g, '<span style="color: var(--text-secondary)">$1</span>');

            els.codeOutput.innerHTML = highlighted;
            els.codeOutput.dataset.raw = css;
        };

        const updateAll = () => {
            renderTracks('columns');
            renderTracks('rows');
            renderItemsList();
            renderVisualGrid();
            generateCode();
        };

        // --- Event Listeners ---

        els.presets.addEventListener('click', (e) => {
            if (e.target.classList.contains('cgg-preset-btn')) {
                const p = presets[e.target.dataset.preset];
                if (p) {
                    state = { ...state, ...JSON.parse(JSON.stringify(p)) };
                    els.gapRow.value = state.gapRow;
                    els.gapCol.value = state.gapCol;
                    updateAll();
                }
            }
        });

        const handleTrackInput = (e) => {
            if (e.target.classList.contains('cgg-track-input')) {
                const { idx, type } = e.target.dataset;
                state[type][idx] = e.target.value || '1fr';
                renderVisualGrid();
                generateCode();
            }
        };

        els.colsContainer.addEventListener('input', handleTrackInput);
        els.rowsContainer.addEventListener('input', handleTrackInput);

        const handleTrackDelete = (e) => {
            if (e.target.classList.contains('cgg-track-btn')) {
                const { idx, type } = e.target.dataset;
                if (state[type].length > 1) {
                    state[type].splice(idx, 1);
                    updateAll();
                }
            }
        };

        els.colsContainer.addEventListener('click', handleTrackDelete);
        els.rowsContainer.addEventListener('click', handleTrackDelete);

        els.addCol.addEventListener('click', () => { state.columns.push('1fr'); updateAll(); });
        els.addRow.addEventListener('click', () => { state.rows.push('1fr'); updateAll(); });

        els.gapRow.addEventListener('input', (e) => {
            state.gapRow = parseInt(e.target.value) || 0;
            if (state.syncGap) {
                state.gapCol = state.gapRow;
                els.gapCol.value = state.gapCol;
            }
            renderVisualGrid(); generateCode();
        });

        els.gapCol.addEventListener('input', (e) => {
            state.gapCol = parseInt(e.target.value) || 0;
            if (state.syncGap) {
                state.gapRow = state.gapCol;
                els.gapRow.value = state.gapRow;
            }
            renderVisualGrid(); generateCode();
        });

        els.gapLink.addEventListener('click', () => {
            state.syncGap = !state.syncGap;
            els.gapLink.classList.toggle('active', state.syncGap);
            if (state.syncGap) {
                state.gapCol = state.gapRow;
                els.gapCol.value = state.gapCol;
                renderVisualGrid(); generateCode();
            }
        });

        ['justifyItems', 'alignItems'].forEach(prop => {
            els[prop].addEventListener('change', (e) => {
                state[prop] = e.target.value;
                renderVisualGrid(); generateCode();
            });
        });

        els.addItem.addEventListener('click', () => {
            const nextId = state.items.length > 0 ? Math.max(...state.items.map(i => i.id)) + 1 : 1;
            const color = colors[nextId % colors.length];
            state.items.push({ id: nextId, rowStart: 1, rowEnd: 2, colStart: 1, colEnd: 2, color });
            updateAll();
        });

        els.itemsContainer.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT') {
                const { idx, prop } = e.target.dataset;
                const parts = e.target.value.split('/').map(s => s.trim());
                if (prop === 'col') {
                    state.items[idx].colStart = parts[0] || 1;
                    state.items[idx].colEnd = parts[1] || 2;
                } else {
                    state.items[idx].rowStart = parts[0] || 1;
                    state.items[idx].rowEnd = parts[1] || 2;
                }
                renderVisualGrid(); generateCode();
            }
        });

        els.itemsContainer.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'delete-item') {
                state.items.splice(e.target.dataset.idx, 1);
                updateAll();
            }
        });

        els.liveGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('cgg-item-delete')) {
                state.items.splice(e.target.dataset.idx, 1);
                updateAll();
            }
        });

        els.copyCode.addEventListener('click', () => {
            const css = els.codeOutput.dataset.raw;
            if (window.copyToClipboard) {
                window.copyToClipboard(css, els.copyCode);
            } else {
                navigator.clipboard.writeText(css);
                els.copyCode.textContent = 'Copied!';
                setTimeout(() => els.copyCode.textContent = 'Copy CSS', 2000);
            }
        });

        // Initialize
        renderPresets();
        els.justifyItems.value = state.justifyItems;
        els.alignItems.value = state.alignItems;
        updateAll();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(CSSGridGenerator);
