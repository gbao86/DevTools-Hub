const BoxShadowGenerator = {
    name: 'Box Shadow Generator',
    icon: '🎨',
    category: 'Web',
    description: 'Tạo CSS Box Shadow trực quan với preview real-time',
    render: function(container) {
        const defaultShadows = [
            { h: 0, v: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false },
            { h: 0, v: 2, blur: 4, spread: -1, color: '#000000', opacity: 0.06, inset: false }
        ];

        const presets = {
            'Subtle': [{h: 0, v: 1, blur: 2, spread: 0, color: '#000000', opacity: 0.05, inset: false}],
            'Medium': [
                {h: 0, v: 4, blur: 6, spread: -1, color: '#000000', opacity: 0.1, inset: false},
                {h: 0, v: 2, blur: 4, spread: -1, color: '#000000', opacity: 0.06, inset: false}
            ],
            'Large': [
                {h: 0, v: 10, blur: 15, spread: -3, color: '#000000', opacity: 0.1, inset: false},
                {h: 0, v: 4, blur: 6, spread: -2, color: '#000000', opacity: 0.05, inset: false}
            ],
            'Sharp': [{h: 4, v: 4, blur: 0, spread: 0, color: '#000000', opacity: 1, inset: false}],
            'Dreamy': [
                {h: 0, v: 20, blur: 30, spread: -10, color: '#0000ff', opacity: 0.2, inset: false},
                {h: 0, v: -20, blur: 30, spread: -10, color: '#ff0000', opacity: 0.2, inset: false}
            ],
            'Neumorphism': [
                {h: -10, v: -10, blur: 20, spread: 0, color: '#ffffff', opacity: 1, inset: false},
                {h: 10, v: 10, blur: 20, spread: 0, color: '#a3b1c6', opacity: 0.6, inset: false}
            ],
            'Material': [
                {h: 0, v: 3, blur: 3, spread: -2, color: '#000000', opacity: 0.2, inset: false},
                {h: 0, v: 3, blur: 4, spread: 0, color: '#000000', opacity: 0.14, inset: false},
                {h: 0, v: 1, blur: 8, spread: 0, color: '#000000', opacity: 0.12, inset: false}
            ]
        };

        let shadows = JSON.parse(JSON.stringify(defaultShadows));
        let activeLayer = 0;
        let previewBg = '#ffffff';
        let boxBg = '#ffffff';
        let boxShape = 'rounded';

        function hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 0, g: 0, b: 0 };
        }

        function generateShadowString(s) {
            const rgb = hexToRgb(s.color);
            const insetStr = s.inset ? 'inset ' : '';
            return `${insetStr}${s.h}px ${s.v}px ${s.blur}px ${s.spread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${s.opacity})`;
        }

        function getFullShadowString() {
            return shadows.map(generateShadowString).join(', ');
        }
        
        container.innerHTML = `
            <style>
                .bs-container { display: flex; flex-direction: column; gap: var(--space-lg); }
                .bs-top-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); min-height: 400px; }
                @media (max-width: 768px) { .bs-top-row { grid-template-columns: 1fr; } }
                
                .bs-preview-panel {
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background: var(--bg-secondary);
                    display: flex;
                    flex-direction: column;
                }
                .bs-preview-toolbar {
                    padding: var(--space-sm) var(--space-md);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    gap: var(--space-md);
                    align-items: center;
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-md) var(--radius-md) 0 0;
                }
                .bs-preview-area {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: ${previewBg};
                    background-image: 
                        linear-gradient(45deg, #ccc 25%, transparent 25%), 
                        linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #ccc 75%), 
                        linear-gradient(-45deg, transparent 75%, #ccc 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                    border-radius: 0 0 var(--radius-md) var(--radius-md);
                    overflow: hidden;
                    position: relative;
                    min-height: 300px;
                }
                .bs-preview-area::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: inherit;
                    background-image: none;
                    background-color: var(--preview-bg, #ffffff);
                    z-index: 1;
                }
                .bs-preview-box {
                    width: 200px;
                    height: 200px;
                    background-color: var(--box-bg, #ffffff);
                    z-index: 2;
                    transition: box-shadow 0.1s ease, border-radius 0.2s ease, background-color 0.2s ease;
                }
                .shape-rounded { border-radius: 16px; }
                .shape-circle { border-radius: 50%; }
                .shape-rectangle { border-radius: 0; }
                
                .bs-controls-panel {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                    background: var(--bg-secondary);
                    padding: var(--space-md);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                }
                
                .bs-layers {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-sm);
                    max-height: 150px;
                    overflow-y: auto;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    padding: var(--space-sm);
                }
                .bs-layer-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--space-sm);
                    background: var(--bg-tertiary);
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    border: 1px solid transparent;
                }
                .bs-layer-item.active {
                    border-color: var(--accent-primary);
                    background: var(--bg-primary);
                }
                .bs-layer-info { flex: 1; font-size: var(--fs-sm); font-family: var(--font-mono); }
                .bs-layer-actions { display: flex; gap: var(--space-sm); }
                
                .bs-sliders {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                }
                .bs-slider-group {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-sm);
                }
                .bs-slider-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: var(--fs-sm);
                    color: var(--text-secondary);
                }
                .bs-slider-val { font-family: var(--font-mono); }
                
                .bs-presets {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-sm);
                }
                
                input[type=range] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    cursor: pointer;
                    margin-top: -6px;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: var(--border-color);
                    border-radius: 2px;
                }
                
                .bs-import { display: flex; gap: var(--space-sm); margin-top: var(--space-md); }
                
                .bs-color-row {
                    display: flex;
                    gap: var(--space-md);
                    align-items: center;
                }
            </style>
            
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>${this.icon} ${this.name}</h2>
                    <p class="tool-description">${this.description}</p>
                </div>
                
                <div class="tool-body bs-container">
                    <div class="bs-presets" id="bsPresets">
                        <!-- Presets generated here -->
                    </div>
                    
                    <div class="bs-top-row">
                        <!-- Preview Panel -->
                        <div class="bs-preview-panel">
                            <div class="bs-preview-toolbar">
                                <label class="tool-label" style="margin:0;">Background:</label>
                                <input type="color" id="bsPreviewBg" class="tool-input" value="#ffffff" style="width:40px;height:30px;padding:0;">
                                
                                <label class="tool-label" style="margin:0; margin-left:var(--space-md);">Box:</label>
                                <input type="color" id="bsBoxBg" class="tool-input" value="#ffffff" style="width:40px;height:30px;padding:0;">
                                
                                <select id="bsBoxShape" class="tool-select" style="margin-left:auto; width: auto;">
                                    <option value="rectangle">Rectangle</option>
                                    <option value="rounded" selected>Rounded</option>
                                    <option value="circle">Circle</option>
                                </select>
                            </div>
                            <div class="bs-preview-area" id="bsPreviewArea">
                                <div class="bs-preview-box shape-rounded" id="bsPreviewBox"></div>
                            </div>
                        </div>
                        
                        <!-- Controls Panel -->
                        <div class="bs-controls-panel">
                            <div class="tool-actions">
                                <span class="tool-label" style="margin:0; line-height:30px;">Layers</span>
                                <button class="tool-btn tool-btn-sm" id="bsAddLayer">+ Add Layer</button>
                            </div>
                            <div class="bs-layers" id="bsLayersList">
                                <!-- Layers listed here -->
                            </div>
                            
                            <hr style="border:0; border-top:1px solid var(--border-color); margin: var(--space-sm) 0;">
                            
                            <div class="bs-sliders" id="bsSlidersContainer">
                                <!-- Horizontal -->
                                <div class="bs-slider-group">
                                    <div class="bs-slider-header">
                                        <span>Horizontal Offset</span>
                                        <span class="bs-slider-val" id="valH">0px</span>
                                    </div>
                                    <input type="range" id="bsH" min="-100" max="100" value="0">
                                </div>
                                <!-- Vertical -->
                                <div class="bs-slider-group">
                                    <div class="bs-slider-header">
                                        <span>Vertical Offset</span>
                                        <span class="bs-slider-val" id="valV">4px</span>
                                    </div>
                                    <input type="range" id="bsV" min="-100" max="100" value="4">
                                </div>
                                <!-- Blur -->
                                <div class="bs-slider-group">
                                    <div class="bs-slider-header">
                                        <span>Blur Radius</span>
                                        <span class="bs-slider-val" id="valBlur">6px</span>
                                    </div>
                                    <input type="range" id="bsBlur" min="0" max="200" value="6">
                                </div>
                                <!-- Spread -->
                                <div class="bs-slider-group">
                                    <div class="bs-slider-header">
                                        <span>Spread Radius</span>
                                        <span class="bs-slider-val" id="valSpread">-1px</span>
                                    </div>
                                    <input type="range" id="bsSpread" min="-100" max="100" value="-1">
                                </div>
                                
                                <!-- Color & Inset -->
                                <div class="bs-color-row">
                                    <div class="bs-slider-group" style="flex:1;">
                                        <div class="bs-slider-header">
                                            <span>Opacity</span>
                                            <span class="bs-slider-val" id="valOpacity">0.1</span>
                                        </div>
                                        <input type="range" id="bsOpacity" min="0" max="1" step="0.01" value="0.1">
                                    </div>
                                    <input type="color" id="bsColor" class="tool-input" value="#000000" style="width:40px;height:40px;padding:0;">
                                    <label style="display:flex; align-items:center; gap:var(--space-sm); cursor:pointer;">
                                        <input type="checkbox" id="bsInset" class="tool-checkbox"> Inset
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tool-group">
                        <div class="tool-actions">
                            <label class="tool-label" style="margin:0; line-height:30px;">CSS Code</label>
                            <button class="tool-btn tool-btn-primary tool-btn-sm" id="bsCopyCode">Copy CSS</button>
                        </div>
                        <div class="tool-result" id="bsOutputCode" style="font-family: var(--font-mono); white-space: pre-wrap; word-break: break-all;"></div>
                    </div>
                    
                    <div class="tool-group">
                        <label class="tool-label">Import CSS Box Shadow</label>
                        <div class="bs-import">
                            <input type="text" class="tool-input" id="bsImportInput" placeholder="e.g. 10px 10px 5px 0px rgba(0,0,0,0.75)">
                            <button class="tool-btn" id="bsImportBtn">Import</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Cache DOM elements
        const previewArea = container.querySelector('#bsPreviewArea');
        const previewBox = container.querySelector('#bsPreviewBox');
        const outputCode = container.querySelector('#bsOutputCode');
        const layersList = container.querySelector('#bsLayersList');
        
        const inputs = {
            h: container.querySelector('#bsH'),
            v: container.querySelector('#bsV'),
            blur: container.querySelector('#bsBlur'),
            spread: container.querySelector('#bsSpread'),
            opacity: container.querySelector('#bsOpacity'),
            color: container.querySelector('#bsColor'),
            inset: container.querySelector('#bsInset')
        };
        
        const vals = {
            h: container.querySelector('#valH'),
            v: container.querySelector('#valV'),
            blur: container.querySelector('#valBlur'),
            spread: container.querySelector('#valSpread'),
            opacity: container.querySelector('#valOpacity')
        };

        const previewBgInput = container.querySelector('#bsPreviewBg');
        const boxBgInput = container.querySelector('#bsBoxBg');
        const boxShapeSelect = container.querySelector('#bsBoxShape');

        // Render Layers List
        function renderLayers() {
            layersList.innerHTML = '';
            shadows.forEach((s, idx) => {
                const layerEl = document.createElement('div');
                layerEl.className = 'bs-layer-item' + (idx === activeLayer ? ' active' : '');
                
                const str = generateShadowString(s);
                const info = str.length > 30 ? str.substring(0, 30) + '...' : str;
                
                layerEl.innerHTML = `
                    <div class="bs-layer-info">${info}</div>
                    <div class="bs-layer-actions">
                        <button class="tool-btn tool-btn-sm" data-idx="${idx}" ${shadows.length === 1 ? 'disabled' : ''}>🗑️</button>
                    </div>
                `;
                
                layerEl.addEventListener('click', (e) => {
                    if(e.target.tagName !== 'BUTTON') {
                        activeLayer = idx;
                        updateControlsFromActive();
                        renderLayers();
                    }
                });
                
                const delBtn = layerEl.querySelector('button');
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if(shadows.length > 1) {
                        shadows.splice(idx, 1);
                        if(activeLayer >= shadows.length) activeLayer = shadows.length - 1;
                        updateControlsFromActive();
                        updateAll();
                    }
                });
                
                layersList.appendChild(layerEl);
            });
        }

        function updateControlsFromActive() {
            const s = shadows[activeLayer];
            inputs.h.value = s.h;
            inputs.v.value = s.v;
            inputs.blur.value = s.blur;
            inputs.spread.value = s.spread;
            inputs.opacity.value = s.opacity;
            inputs.color.value = s.color;
            inputs.inset.checked = s.inset;
            
            vals.h.textContent = s.h + 'px';
            vals.v.textContent = s.v + 'px';
            vals.blur.textContent = s.blur + 'px';
            vals.spread.textContent = s.spread + 'px';
            vals.opacity.textContent = s.opacity;
        }

        function updateShadowFromControls() {
            const s = shadows[activeLayer];
            s.h = parseInt(inputs.h.value);
            s.v = parseInt(inputs.v.value);
            s.blur = parseInt(inputs.blur.value);
            s.spread = parseInt(inputs.spread.value);
            s.opacity = parseFloat(inputs.opacity.value);
            s.color = inputs.color.value;
            s.inset = inputs.inset.checked;
            
            vals.h.textContent = s.h + 'px';
            vals.v.textContent = s.v + 'px';
            vals.blur.textContent = s.blur + 'px';
            vals.spread.textContent = s.spread + 'px';
            vals.opacity.textContent = s.opacity;
            
            updateAll();
        }

        function updateAll() {
            const cssString = getFullShadowString();
            previewBox.style.boxShadow = cssString;
            
            outputCode.textContent = `box-shadow: ${cssString};\n-webkit-box-shadow: ${cssString};\n-moz-box-shadow: ${cssString};`;
            
            renderLayers();
        }

        // Event Listeners for Controls
        Object.values(inputs).forEach(input => {
            input.addEventListener('input', updateShadowFromControls);
        });

        // Add Layer
        container.querySelector('#bsAddLayer').addEventListener('click', () => {
            shadows.push({ h: 0, v: 0, blur: 10, spread: 0, color: '#000000', opacity: 0.2, inset: false });
            activeLayer = shadows.length - 1;
            updateControlsFromActive();
            updateAll();
        });

        // Setup Presets
        const presetsContainer = container.querySelector('#bsPresets');
        Object.keys(presets).forEach(key => {
            const btn = document.createElement('button');
            btn.className = 'tool-btn tool-btn-sm';
            btn.textContent = key;
            btn.addEventListener('click', () => {
                shadows = JSON.parse(JSON.stringify(presets[key]));
                activeLayer = 0;
                
                if (key === 'Neumorphism') {
                    previewBgInput.value = '#e0e5ec';
                    boxBgInput.value = '#e0e5ec';
                    previewArea.style.setProperty('--preview-bg', '#e0e5ec');
                    previewBox.style.setProperty('--box-bg', '#e0e5ec');
                } else {
                    previewBgInput.value = '#ffffff';
                    boxBgInput.value = '#ffffff';
                    previewArea.style.setProperty('--preview-bg', '#ffffff');
                    previewBox.style.setProperty('--box-bg', '#ffffff');
                }
                
                updateControlsFromActive();
                updateAll();
            });
            presetsContainer.appendChild(btn);
        });

        // Preview Toggles
        previewBgInput.addEventListener('input', (e) => {
            previewArea.style.setProperty('--preview-bg', e.target.value);
        });
        boxBgInput.addEventListener('input', (e) => {
            previewBox.style.setProperty('--box-bg', e.target.value);
        });
        boxShapeSelect.addEventListener('change', (e) => {
            previewBox.className = 'bs-preview-box shape-' + e.target.value;
        });

        // Copy Code
        container.querySelector('#bsCopyCode').addEventListener('click', (e) => {
            if(window.copyToClipboard) {
                window.copyToClipboard(outputCode.textContent, e.target);
            } else {
                navigator.clipboard.writeText(outputCode.textContent);
                const originalText = e.target.textContent;
                e.target.textContent = 'Copied!';
                setTimeout(() => e.target.textContent = originalText, 2000);
            }
        });

        // Import CSS (Basic Parser)
        container.querySelector('#bsImportBtn').addEventListener('click', () => {
            const input = container.querySelector('#bsImportInput').value.trim();
            if(!input) return;
            
            try {
                let str = input.replace(/^box-shadow:\s*/i, '').replace(/;/g, '');
                let tempStr = str.replace(/rgba?\([^)]+\)/g, match => match.replace(/,/g, '|||'));
                const layersStr = tempStr.split(',').map(l => l.replace(/\|\|\|/g, ',').trim());
                
                const newShadows = [];
                
                layersStr.forEach(layer => {
                    const parts = layer.split(/\s+(?![^(]*\))/);
                    let h = 0, v = 0, blur = 0, spread = 0, color = '#000000', opacity = 1, inset = false;
                    let lengthCount = 0;
                    
                    parts.forEach(p => {
                        if(p === 'inset') {
                            inset = true;
                        } else if(p.startsWith('#') || p.startsWith('rgb') || p.match(/^[a-z]+$/)) {
                            if(p.startsWith('rgba')) {
                                const rgba = p.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                                if(rgba) {
                                    const r = parseInt(rgba[1]).toString(16).padStart(2, '0');
                                    const g = parseInt(rgba[2]).toString(16).padStart(2, '0');
                                    const b = parseInt(rgba[3]).toString(16).padStart(2, '0');
                                    color = `#${r}${g}${b}`;
                                    opacity = rgba[4] !== undefined ? parseFloat(rgba[4]) : 1;
                                }
                            } else if (p.startsWith('#')) {
                                color = p.length === 4 ? '#' + p[1]+p[1]+p[2]+p[2]+p[3]+p[3] : p;
                            }
                        } else if(p.match(/^-?\d+/)) {
                            const val = parseInt(p);
                            if(lengthCount === 0) h = val;
                            else if(lengthCount === 1) v = val;
                            else if(lengthCount === 2) blur = val;
                            else if(lengthCount === 3) spread = val;
                            lengthCount++;
                        }
                    });
                    
                    newShadows.push({h, v, blur, spread, color, opacity, inset});
                });
                
                if(newShadows.length > 0) {
                    shadows = newShadows;
                    activeLayer = 0;
                    updateControlsFromActive();
                    updateAll();
                    if(window.showToast) window.showToast('Imported successfully', 'success');
                }
            } catch(err) {
                if(window.showToast) window.showToast('Failed to parse CSS', 'error');
            }
        });

        // Initial setup
        updateControlsFromActive();
        updateAll();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(BoxShadowGenerator);
