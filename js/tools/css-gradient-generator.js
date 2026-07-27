const CSSGradientGeneratorTool = {
    name: 'CSS Gradient Generator',
    icon: '🎨',
    category: 'Generator',
    description: 'Tạo CSS gradient (Linear, Radial, Conic) với giao diện trực quan',
    render(container) {
        let type = 'linear';
        let angle = 90;
        let shape = 'circle';
        let position = 'center';
        
        let stops = [
            { id: 1, color: '#4facfe', position: 0 },
            { id: 2, color: '#00f2fe', position: 100 }
        ];
        let nextStopId = 3;

        const presets = [
            [{color: '#4facfe', position: 0}, {color: '#00f2fe', position: 100}],
            [{color: '#43e97b', position: 0}, {color: '#38f9d7', position: 100}],
            [{color: '#fa709a', position: 0}, {color: '#fee140', position: 100}],
            [{color: '#30cfd0', position: 0}, {color: '#330867', position: 100}],
            [{color: '#fccb90', position: 0}, {color: '#d57eeb', position: 100}],
            [{color: '#e0c3fc', position: 0}, {color: '#8ec5fc', position: 100}],
            [{color: '#f093fb', position: 0}, {color: '#f5576c', position: 100}],
            [{color: '#5ee7df', position: 0}, {color: '#b490ca', position: 100}]
        ];

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🎨 CSS Gradient Generator</h2>
                    <p class="tool-description">Tạo CSS gradient (Linear, Radial, Conic) với giao diện trực quan</p>
                </div>
                <div class="tool-body">
                    <div id="gradient-preview" style="min-height: 200px; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1rem; transition: background 0.1s ease;"></div>
                    
                    <div class="tool-row" style="flex-wrap: wrap; gap: 1rem;">
                        <div class="tool-group" style="flex: 1; min-width: 200px;">
                            <label class="tool-label">Type</label>
                            <select id="grad-type" class="tool-select">
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                                <option value="conic">Conic</option>
                            </select>
                        </div>
                        <div class="tool-group" style="flex: 1; min-width: 200px;" id="linear-opts">
                            <label class="tool-label">Angle (<span id="angle-val">90</span>°)</label>
                            <div class="tool-row" style="align-items: center; gap: 0.5rem;">
                                <input type="range" id="grad-angle" min="0" max="360" value="90" style="flex: 1;">
                            </div>
                        </div>
                        <div class="tool-group" style="flex: 1; min-width: 200px; display: none;" id="radial-opts">
                            <label class="tool-label">Shape & Position</label>
                            <div class="tool-row" style="gap: 0.5rem;">
                                <select id="grad-shape" class="tool-select" style="flex: 1;">
                                    <option value="circle">Circle</option>
                                    <option value="ellipse">Ellipse</option>
                                </select>
                                <select id="grad-pos" class="tool-select" style="flex: 1;">
                                    <option value="center">Center</option>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="tool-group">
                        <div class="tool-row" style="justify-content: space-between; align-items: center;">
                            <label class="tool-label">Color Stops</label>
                            <button id="add-stop-btn" class="tool-btn tool-btn-sm">+ Add Stop</button>
                        </div>
                        <div id="stops-container" style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                            <!-- Stops injected here -->
                        </div>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Presets & Options</label>
                        <div class="tool-row" style="flex-wrap: wrap; gap: 0.5rem;">
                            <button id="random-btn" class="tool-btn tool-btn-sm tool-btn-success">🎲 Random</button>
                            <div id="presets-container" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-left: 1rem; border-left: 1px solid var(--border-color); padding-left: 1rem;">
                                <!-- Presets injected here -->
                            </div>
                        </div>
                    </div>

                    <div class="tool-result">
                        <label class="tool-label">CSS Output</label>
                        <div style="position: relative;">
                            <textarea id="css-output" class="tool-textarea" rows="4" readonly style="width: 100%;"></textarea>
                            <button class="tool-copy-btn" id="copy-btn">📋 Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const preview = container.querySelector('#gradient-preview');
        const typeSelect = container.querySelector('#grad-type');
        const angleInput = container.querySelector('#grad-angle');
        const angleVal = container.querySelector('#angle-val');
        const shapeSelect = container.querySelector('#grad-shape');
        const posSelect = container.querySelector('#grad-pos');
        const linearOpts = container.querySelector('#linear-opts');
        const radialOpts = container.querySelector('#radial-opts');
        const stopsContainer = container.querySelector('#stops-container');
        const addStopBtn = container.querySelector('#add-stop-btn');
        const presetsContainer = container.querySelector('#presets-container');
        const randomBtn = container.querySelector('#random-btn');
        const cssOutput = container.querySelector('#css-output');
        const copyBtn = container.querySelector('#copy-btn');

        function getRandomColor() {
            return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        }

        function renderStops() {
            stopsContainer.innerHTML = '';
            stops.forEach((stop, index) => {
                const stopRow = document.createElement('div');
                stopRow.className = 'tool-row';
                stopRow.style.alignItems = 'center';
                stopRow.style.gap = '1rem';
                stopRow.innerHTML = `
                    <input type="color" value="${stop.color}" data-id="${stop.id}" class="stop-color" style="width: 40px; height: 32px; padding: 0; border: none; border-radius: 4px; cursor: pointer; background: transparent;">
                    <input type="range" value="${stop.position}" min="0" max="100" data-id="${stop.id}" class="stop-pos" style="flex: 1;">
                    <span style="width: 40px; font-family: monospace; color: var(--text-secondary); text-align: right;">${stop.position}%</span>
                    <button class="tool-btn tool-btn-danger tool-btn-sm remove-stop" data-id="${stop.id}" ${stops.length <= 2 ? 'disabled' : ''}>×</button>
                `;
                stopsContainer.appendChild(stopRow);
            });

            // Re-bind events
            stopsContainer.querySelectorAll('.stop-color').forEach(input => {
                input.addEventListener('input', (e) => {
                    const stop = stops.find(s => s.id === parseInt(e.target.dataset.id));
                    if (stop) stop.color = e.target.value;
                    updateGradient();
                });
            });

            stopsContainer.querySelectorAll('.stop-pos').forEach(input => {
                input.addEventListener('input', (e) => {
                    const stop = stops.find(s => s.id === parseInt(e.target.dataset.id));
                    if (stop) {
                        stop.position = parseInt(e.target.value);
                        e.target.nextElementSibling.textContent = stop.position + '%';
                    }
                    updateGradient();
                });
            });

            stopsContainer.querySelectorAll('.remove-stop').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (stops.length > 2) {
                        stops = stops.filter(s => s.id !== parseInt(e.target.dataset.id));
                        renderStops();
                        updateGradient();
                    }
                });
            });
        }

        function renderPresets() {
            presetsContainer.innerHTML = '';
            presets.forEach((preset, idx) => {
                const btn = document.createElement('div');
                const cssGrad = \`linear-gradient(135deg, \${preset.map(p => \`\${p.color} \${p.position}%\`).join(', ')})\`;
                btn.style.width = '32px';
                btn.style.height = '32px';
                btn.style.borderRadius = '4px';
                btn.style.background = cssGrad;
                btn.style.cursor = 'pointer';
                btn.style.border = '1px solid var(--border-color)';
                btn.title = \`Preset \${idx + 1}\`;
                btn.addEventListener('click', () => {
                    stops = preset.map((p, i) => ({ id: nextStopId++, color: p.color, position: p.position }));
                    type = 'linear';
                    angle = 135;
                    typeSelect.value = type;
                    angleInput.value = angle;
                    angleVal.textContent = angle;
                    typeSelect.dispatchEvent(new Event('change'));
                    renderStops();
                    updateGradient();
                });
                presetsContainer.appendChild(btn);
            });
        }

        function getGradientCSS() {
            // Sort stops by position for valid CSS
            const sortedStops = [...stops].sort((a, b) => a.position - b.position);
            const stopsString = sortedStops.map(s => \`\${s.color} \${s.position}%\`).join(', ');
            
            if (type === 'linear') {
                return \`linear-gradient(\${angle}deg, \${stopsString})\`;
            } else if (type === 'radial') {
                return \`radial-gradient(\${shape} at \${position}, \${stopsString})\`;
            } else if (type === 'conic') {
                return \`conic-gradient(from 0deg, \${stopsString})\`;
            }
            return '';
        }

        function updateGradient() {
            const css = getGradientCSS();
            preview.style.background = css;
            const fullOutput = \`background: \${css};\`;
            cssOutput.value = fullOutput;
        }

        typeSelect.addEventListener('change', (e) => {
            type = e.target.value;
            if (type === 'linear') {
                linearOpts.style.display = 'flex';
                radialOpts.style.display = 'none';
            } else if (type === 'radial') {
                linearOpts.style.display = 'none';
                radialOpts.style.display = 'flex';
            } else {
                // conic
                linearOpts.style.display = 'none';
                radialOpts.style.display = 'none';
            }
            updateGradient();
        });

        angleInput.addEventListener('input', (e) => {
            angle = e.target.value;
            angleVal.textContent = angle;
            updateGradient();
        });

        shapeSelect.addEventListener('change', (e) => {
            shape = e.target.value;
            updateGradient();
        });

        posSelect.addEventListener('change', (e) => {
            position = e.target.value;
            updateGradient();
        });

        addStopBtn.addEventListener('click', () => {
            if (stops.length < 6) {
                const maxPos = Math.max(...stops.map(s => s.position));
                let newPos = maxPos + 20;
                if (newPos > 100) newPos = 100;
                stops.push({ id: nextStopId++, color: '#ffffff', position: newPos });
                renderStops();
                updateGradient();
            } else {
                if (window.showToast) window.showToast('Max 6 color stops allowed.', 'warning');
            }
        });

        randomBtn.addEventListener('click', () => {
            const numStops = 2 + Math.floor(Math.random() * 2); // 2 or 3 stops
            stops = [];
            for (let i=0; i<numStops; i++) {
                stops.push({
                    id: nextStopId++,
                    color: getRandomColor(),
                    position: i === 0 ? 0 : (i === numStops - 1 ? 100 : 50)
                });
            }
            
            const types = ['linear', 'radial', 'conic'];
            type = types[Math.floor(Math.random() * types.length)];
            typeSelect.value = type;
            
            angle = Math.floor(Math.random() * 360);
            angleInput.value = angle;
            angleVal.textContent = angle;
            
            typeSelect.dispatchEvent(new Event('change'));
            renderStops();
            updateGradient();
        });

        copyBtn.addEventListener('click', () => {
            if (window.copyToClipboard) {
                window.copyToClipboard(cssOutput.value, copyBtn);
            }
        });

        // Init
        renderStops();
        renderPresets();
        updateGradient();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(CSSGradientGeneratorTool);
