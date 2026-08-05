const CSSAnimationBuilder = {
    name: 'CSS Animation Builder',
    icon: '🎬',
    category: 'Web',
    description: 'Visual @keyframes editor — tạo CSS animations với timeline, easing curves và live preview',
    render(container) {
        // --- State ---
        const state = {
            animationName: 'my-animation',
            duration: 1, // seconds
            timingFunction: 'ease',
            customBezier: [0.25, 0.1, 0.25, 1], // [x1, y1, x2, y2]
            delay: 0, // seconds
            iterationCount: 'infinite', // number or 'infinite'
            direction: 'normal',
            fillMode: 'none',
            playState: 'running',
            
            keyframes: [
                { id: 'kf-0', percent: 0, props: { transform: { translateX: 0, translateY: 0, scale: 1, rotate: 0 } } },
                { id: 'kf-100', percent: 100, props: { transform: { translateX: 100, translateY: 0, scale: 1, rotate: 360 } } }
            ],
            selectedKeyframeId: 'kf-100',
            
            previewShape: 'square', // square, circle, text
            previewText: 'Text',
            previewBg: '#1e1e1e',
            playbackSpeed: 1,
            
            bezierDragging: null // 'p1' or 'p2'
        };

        const presets = {
            'Fade In': { kf: [{percent: 0, props: {opacity: 0}}, {percent: 100, props: {opacity: 1}}], props: {duration: 1} },
            'Slide In': { kf: [{percent: 0, props: {transform: {translateX: -100, translateY: 0, scale: 1, rotate: 0}}}, {percent: 100, props: {transform: {translateX: 0, translateY: 0, scale: 1, rotate: 0}}}], props: {duration: 0.5} },
            'Bounce': { kf: [
                {percent: 0, props: {transform: {translateY: -100, translateX: 0, scale: 1, rotate: 0}}}, 
                {percent: 40, props: {transform: {translateY: 0, translateX: 0, scale: 1, rotate: 0}}},
                {percent: 60, props: {transform: {translateY: -30, translateX: 0, scale: 1, rotate: 0}}},
                {percent: 80, props: {transform: {translateY: 0, translateX: 0, scale: 1, rotate: 0}}},
                {percent: 100, props: {transform: {translateY: 0, translateX: 0, scale: 1, rotate: 0}}}
            ], props: {duration: 1} },
            'Pulse': { kf: [{percent: 0, props: {transform: {scale: 1, translateX: 0, translateY: 0, rotate: 0}}}, {percent: 50, props: {transform: {scale: 1.1, translateX: 0, translateY: 0, rotate: 0}}}, {percent: 100, props: {transform: {scale: 1, translateX: 0, translateY: 0, rotate: 0}}}], props: {duration: 1, iterationCount: 'infinite'} },
            'Spin': { kf: [{percent: 0, props: {transform: {rotate: 0, translateX: 0, translateY: 0, scale: 1}}}, {percent: 100, props: {transform: {rotate: 360, translateX: 0, translateY: 0, scale: 1}}}], props: {duration: 2, iterationCount: 'infinite', timingFunction: 'linear'} }
        };

        // --- Helpers ---
        const generateId = () => 'kf-' + Math.random().toString(36).substr(2, 9);
        
        const getSelectedKeyframe = () => state.keyframes.find(k => k.id === state.selectedKeyframeId);
        
        const sortKeyframes = () => {
            state.keyframes.sort((a, b) => a.percent - b.percent);
        };
        
        const getTransformString = (transformObj) => {
            if (!transformObj) return '';
            const t = transformObj;
            let str = '';
            if (t.translateX || t.translateY) str += `translate(${t.translateX || 0}px, ${t.translateY || 0}px) `;
            if (t.scale !== undefined && t.scale !== 1) str += `scale(${t.scale}) `;
            if (t.rotate) str += `rotate(${t.rotate}deg) `;
            return str.trim();
        };

        const getPropsCSS = (props) => {
            let css = [];
            if (props.transform && (props.transform.translateX || props.transform.translateY || props.transform.scale !== 1 || props.transform.rotate)) {
                css.push(`    transform: ${getTransformString(props.transform)};`);
            } else if (props.transform) {
                 css.push(`    transform: none;`);
            }
            if (props.opacity !== undefined) css.push(`    opacity: ${props.opacity};`);
            if (props.backgroundColor) css.push(`    background-color: ${props.backgroundColor};`);
            if (props.borderRadius !== undefined) css.push(`    border-radius: ${props.borderRadius}%;`);
            return css.join('\n');
        };

        const generateKeyframesCSS = () => {
            sortKeyframes();
            let css = `@keyframes ${state.animationName} {\n`;
            state.keyframes.forEach(kf => {
                const propsCSS = getPropsCSS(kf.props);
                css += `  ${kf.percent}% {\n${propsCSS || '    /* no changes */'}\n  }\n`;
            });
            css += `}`;
            return css;
        };

        const generateAnimationCSS = () => {
            let tf = state.timingFunction;
            if (tf === 'cubic-bezier') {
                tf = `cubic-bezier(${state.customBezier.join(', ')})`;
            }
            
            return `.${state.animationName}-class {
  animation-name: ${state.animationName};
  animation-duration: ${state.duration}s;
  animation-timing-function: ${tf};
  animation-delay: ${state.delay}s;
  animation-iteration-count: ${state.iterationCount};
  animation-direction: ${state.direction};
  animation-fill-mode: ${state.fillMode};
}`;
        };

        const updateLivePreview = () => {
            // Update preview style tag
            const styleTag = DOM.previewStyle;
            const kfCSS = generateKeyframesCSS();
            
            let tf = state.timingFunction;
            if (tf === 'cubic-bezier') {
                tf = `cubic-bezier(${state.customBezier.join(', ')})`;
            }

            styleTag.innerHTML = `
                ${kfCSS}
                .cab-animated-element {
                    animation-name: ${state.animationName};
                    animation-duration: ${state.duration / state.playbackSpeed}s;
                    animation-timing-function: ${tf};
                    animation-delay: ${state.delay}s;
                    animation-iteration-count: ${state.iterationCount};
                    animation-direction: ${state.direction};
                    animation-fill-mode: ${state.fillMode};
                    animation-play-state: ${state.playState};
                }
            `;
            
            // Output code
            DOM.codeOutput.value = `${kfCSS}\n\n${generateAnimationCSS()}`;
        };

        // --- View ---
        container.innerHTML = `
            <style>
                .cab-container { display: flex; flex-direction: column; gap: var(--space-md); height: 100%; overflow: hidden; }
                .cab-preview-section {
                    flex: 1; min-height: 250px; background: var(--bg-tertiary); border-radius: var(--radius-md);
                    position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;
                    border: 1px solid var(--border-color);
                }
                .cab-preview-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
                .cab-animated-element {
                    z-index: 1; background: var(--accent-primary); width: 80px; height: 80px;
                    display: flex; align-items: center; justify-content: center; color: var(--bg-primary); font-weight: bold;
                }
                .cab-animated-element.shape-circle { border-radius: 50%; }
                .cab-animated-element.shape-text { background: transparent; width: auto; height: auto; font-size: 2rem; color: var(--text-primary); }
                
                .cab-preview-controls {
                    position: absolute; bottom: var(--space-sm); left: 50%; transform: translateX(-50%);
                    display: flex; gap: var(--space-sm); z-index: 2;
                    background: rgba(0,0,0,0.6); padding: var(--space-xs); border-radius: var(--radius-md); backdrop-filter: blur(4px);
                }
                .cab-preview-controls .tool-btn { padding: 4px 10px; font-size: var(--fs-xs); }

                .cab-timeline-section {
                    background: var(--bg-secondary); padding: var(--space-md); border-radius: var(--radius-md);
                    border: 1px solid var(--border-color);
                }
                .cab-timeline-track-wrapper { position: relative; height: 40px; margin: var(--space-md) 0; }
                .cab-timeline-track {
                    position: absolute; top: 50%; left: 0; right: 0; height: 4px; background: var(--border-color);
                    transform: translateY(-50%); border-radius: 2px;
                }
                .cab-kf-marker {
                    position: absolute; top: 50%; width: 14px; height: 14px; background: var(--text-secondary);
                    transform: translate(-50%, -50%) rotate(45deg); cursor: pointer; border: 2px solid var(--bg-secondary);
                    transition: background 0.2s, box-shadow 0.2s; z-index: 5;
                }
                .cab-kf-marker.selected { background: var(--accent-primary); box-shadow: 0 0 5px var(--accent-primary); z-index: 6; }
                
                .cab-editor-section { display: flex; gap: var(--space-md); flex: 2; min-height: 200px; overflow: hidden; }
                .cab-panel { flex: 1; background: var(--bg-secondary); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid var(--border-color); overflow-y: auto; }
                
                .cab-row { display: flex; gap: var(--space-sm); margin-bottom: var(--space-sm); align-items: center; }
                .cab-col { display: flex; flex-direction: column; gap: var(--space-xs); flex: 1; }
                
                .cab-code-output { font-family: var(--font-mono); font-size: var(--fs-xs); width: 100%; height: 150px; background: var(--bg-primary); resize: none; border: 1px solid var(--border-color); padding: var(--space-sm); color: var(--text-secondary); }
                
                .cab-bezier-editor { width: 100%; aspect-ratio: 1; background: var(--bg-primary); position: relative; border: 1px solid var(--border-color); margin-top: var(--space-sm); overflow: hidden;}
                .cab-bezier-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;}
                .cab-bezier-handle { position: absolute; width: 12px; height: 12px; border-radius: 50%; background: var(--accent-primary); transform: translate(-50%, -50%); cursor: grab; z-index: 10; border: 2px solid var(--bg-primary);}
                .cab-bezier-handle:active { cursor: grabbing; }
                .cab-bezier-line { position: absolute; background: var(--text-tertiary); transform-origin: 0 0; height: 1px; z-index: 9; pointer-events: none; }
                
                .cab-presets { display: flex; flex-wrap: wrap; gap: var(--space-xs); margin-bottom: var(--space-sm); }
            </style>
            
            <div class="tool-panel cab-container">
                <style id="cab-preview-style"></style>
                
                <div class="cab-preview-section" id="cab-preview-area">
                    <div class="cab-preview-bg"></div>
                    <div class="cab-animated-element" id="cab-animated-el"></div>
                    
                    <div class="cab-preview-controls">
                        <button class="tool-btn cab-btn-play" title="Play/Pause">⏸</button>
                        <button class="tool-btn cab-btn-restart" title="Restart">⏹</button>
                        <select class="tool-select cab-sel-speed" style="width: 70px; padding: 2px;">
                            <option value="0.25">0.25x</option>
                            <option value="0.5">0.5x</option>
                            <option value="1" selected>1x</option>
                            <option value="2">2x</option>
                        </select>
                        <select class="tool-select cab-sel-shape" style="width: 80px; padding: 2px;">
                            <option value="square">Square</option>
                            <option value="circle">Circle</option>
                            <option value="text">Text</option>
                        </select>
                    </div>
                </div>
                
                <div class="cab-timeline-section">
                    <div class="cab-row">
                        <strong style="font-size: var(--fs-sm);">Timeline</strong>
                        <span style="flex:1"></span>
                        <button class="tool-btn tool-btn-sm cab-btn-add-kf">+ Add Keyframe</button>
                    </div>
                    <div class="cab-timeline-track-wrapper" id="cab-timeline-wrap">
                        <div class="cab-timeline-track" id="cab-timeline-track"></div>
                        <div id="cab-kf-markers"></div>
                    </div>
                </div>
                
                <div class="cab-editor-section">
                    <div class="cab-panel" style="flex: 1.2;">
                        <div style="font-weight: bold; margin-bottom: var(--space-sm); font-size: var(--fs-sm);">Animation Settings</div>
                        
                        <div class="cab-row">
                            <div class="cab-col">
                                <label class="tool-label">Name</label>
                                <input type="text" class="tool-input cab-inp-name" value="my-animation">
                            </div>
                            <div class="cab-col">
                                <label class="tool-label">Duration (s)</label>
                                <input type="number" class="tool-input cab-inp-duration" value="1" min="0.1" step="0.1">
                            </div>
                        </div>
                        
                        <div class="cab-row">
                            <div class="cab-col">
                                <label class="tool-label">Timing Function</label>
                                <select class="tool-select cab-sel-timing">
                                    <option value="ease">ease</option>
                                    <option value="linear">linear</option>
                                    <option value="ease-in">ease-in</option>
                                    <option value="ease-out">ease-out</option>
                                    <option value="ease-in-out">ease-in-out</option>
                                    <option value="cubic-bezier">Custom Bezier</option>
                                </select>
                            </div>
                            <div class="cab-col">
                                <label class="tool-label">Delay (s)</label>
                                <input type="number" class="tool-input cab-inp-delay" value="0" min="0" step="0.1">
                            </div>
                        </div>
                        
                        <div class="cab-bezier-editor" id="cab-bezier-box" style="display: none;">
                            <canvas class="cab-bezier-canvas" id="cab-bezier-canvas"></canvas>
                            <div class="cab-bezier-line" id="cab-line-1"></div>
                            <div class="cab-bezier-line" id="cab-line-2"></div>
                            <div class="cab-bezier-handle" id="cab-handle-1"></div>
                            <div class="cab-bezier-handle" id="cab-handle-2"></div>
                        </div>
                        
                        <div class="cab-row" style="margin-top: var(--space-sm);">
                            <div class="cab-col">
                                <label class="tool-label">Iteration</label>
                                <input type="text" class="tool-input cab-inp-iter" value="infinite">
                            </div>
                            <div class="cab-col">
                                <label class="tool-label">Direction</label>
                                <select class="tool-select cab-sel-dir">
                                    <option value="normal">normal</option>
                                    <option value="reverse">reverse</option>
                                    <option value="alternate">alternate</option>
                                    <option value="alternate-reverse">alt-reverse</option>
                                </select>
                            </div>
                            <div class="cab-col">
                                <label class="tool-label">Fill Mode</label>
                                <select class="tool-select cab-sel-fill">
                                    <option value="none">none</option>
                                    <option value="forwards">forwards</option>
                                    <option value="backwards">backwards</option>
                                    <option value="both">both</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style="font-weight: bold; margin: var(--space-md) 0 var(--space-sm); font-size: var(--fs-sm);">Presets</div>
                        <div class="cab-presets" id="cab-preset-btns"></div>
                    </div>
                    
                    <div class="cab-panel" id="cab-kf-panel" style="flex: 1.2;">
                        <div class="cab-row">
                            <strong style="font-size: var(--fs-sm);">Keyframe: <span id="cab-kf-percent-lbl">0</span>%</strong>
                            <span style="flex:1"></span>
                            <button class="tool-btn tool-btn-sm tool-btn-danger cab-btn-del-kf">Delete</button>
                        </div>
                        
                        <div class="cab-col" style="margin-bottom: var(--space-sm);">
                            <label class="tool-label">Percent (%)</label>
                            <input type="range" class="tool-range cab-inp-kf-percent" min="0" max="100" step="1">
                        </div>
                        
                        <div class="tool-group">
                            <label class="tool-label">Transform: Translate X (px)</label>
                            <input type="range" class="tool-range cab-kf-prop" data-prop="transform.translateX" min="-200" max="200" value="0">
                            
                            <label class="tool-label">Transform: Translate Y (px)</label>
                            <input type="range" class="tool-range cab-kf-prop" data-prop="transform.translateY" min="-200" max="200" value="0">
                            
                            <label class="tool-label">Transform: Scale</label>
                            <input type="range" class="tool-range cab-kf-prop" data-prop="transform.scale" min="0" max="3" step="0.1" value="1">
                            
                            <label class="tool-label">Transform: Rotate (deg)</label>
                            <input type="range" class="tool-range cab-kf-prop" data-prop="transform.rotate" min="-360" max="360" value="0">
                        </div>
                        
                        <div class="tool-group">
                            <label class="tool-label">Opacity</label>
                            <input type="range" class="tool-range cab-kf-prop" data-prop="opacity" min="0" max="1" step="0.1" value="1">
                        </div>
                    </div>
                    
                    <div class="cab-panel" style="flex: 1;">
                         <div class="cab-row">
                            <strong style="font-size: var(--fs-sm);">Code Output</strong>
                            <span style="flex:1"></span>
                            <button class="tool-btn tool-btn-sm cab-btn-copy">Copy</button>
                        </div>
                        <textarea class="cab-code-output" id="cab-code-out" readonly></textarea>
                    </div>
                </div>
            </div>
        `;

        // --- DOM Elements ---
        const DOM = {
            previewStyle: container.querySelector('#cab-preview-style'),
            animatedEl: container.querySelector('#cab-animated-el'),
            btnPlay: container.querySelector('.cab-btn-play'),
            btnRestart: container.querySelector('.cab-btn-restart'),
            selSpeed: container.querySelector('.cab-sel-speed'),
            selShape: container.querySelector('.cab-sel-shape'),
            
            timelineWrap: container.querySelector('#cab-timeline-wrap'),
            kfMarkersContainer: container.querySelector('#cab-kf-markers'),
            btnAddKf: container.querySelector('.cab-btn-add-kf'),
            
            inpName: container.querySelector('.cab-inp-name'),
            inpDuration: container.querySelector('.cab-inp-duration'),
            selTiming: container.querySelector('.cab-sel-timing'),
            inpDelay: container.querySelector('.cab-inp-delay'),
            inpIter: container.querySelector('.cab-inp-iter'),
            selDir: container.querySelector('.cab-sel-dir'),
            selFill: container.querySelector('.cab-sel-fill'),
            
            bezierBox: container.querySelector('#cab-bezier-box'),
            bezierCanvas: container.querySelector('#cab-bezier-canvas'),
            h1: container.querySelector('#cab-handle-1'),
            h2: container.querySelector('#cab-handle-2'),
            l1: container.querySelector('#cab-line-1'),
            l2: container.querySelector('#cab-line-2'),
            
            presetBtns: container.querySelector('#cab-preset-btns'),
            
            kfPanel: container.querySelector('#cab-kf-panel'),
            lblKfPercent: container.querySelector('#cab-kf-percent-lbl'),
            inpKfPercent: container.querySelector('.cab-inp-kf-percent'),
            btnDelKf: container.querySelector('.cab-btn-del-kf'),
            kfProps: Array.from(container.querySelectorAll('.cab-kf-prop')),
            
            codeOutput: container.querySelector('#cab-code-out'),
            btnCopy: container.querySelector('.cab-btn-copy')
        };
        
        let bezierCtx = DOM.bezierCanvas.getContext('2d');

        // --- Render functions ---
        
        const renderKeyframes = () => {
            DOM.kfMarkersContainer.innerHTML = '';
            state.keyframes.forEach(kf => {
                const el = document.createElement('div');
                el.className = 'cab-kf-marker' + (kf.id === state.selectedKeyframeId ? ' selected' : '');
                el.style.left = `${kf.percent}%`;
                el.dataset.id = kf.id;
                
                // Dragging logic
                let isDragging = false;
                el.addEventListener('mousedown', (e) => {
                    e.stopPropagation();
                    isDragging = true;
                    state.selectedKeyframeId = kf.id;
                    updateKeyframePanel();
                    renderKeyframes();
                    
                    const moveHandler = (ev) => {
                        if(!isDragging) return;
                        const rect = DOM.timelineWrap.getBoundingClientRect();
                        let percent = ((ev.clientX - rect.left) / rect.width) * 100;
                        percent = Math.max(0, Math.min(100, Math.round(percent)));
                        
                        // Prevent overlap with existing
                        if(!state.keyframes.find(k => k.id !== kf.id && k.percent === percent)) {
                            kf.percent = percent;
                            el.style.left = `${percent}%`;
                            DOM.lblKfPercent.textContent = percent;
                            DOM.inpKfPercent.value = percent;
                            updateLivePreview();
                        }
                    };
                    const upHandler = () => {
                        isDragging = false;
                        sortKeyframes();
                        renderKeyframes();
                        document.removeEventListener('mousemove', moveHandler);
                        document.removeEventListener('mouseup', upHandler);
                    };
                    document.addEventListener('mousemove', moveHandler);
                    document.addEventListener('mouseup', upHandler);
                });
                
                DOM.kfMarkersContainer.appendChild(el);
            });
        };

        const updateKeyframePanel = () => {
            const kf = getSelectedKeyframe();
            if (!kf) {
                DOM.kfPanel.style.opacity = '0.5';
                DOM.kfPanel.style.pointerEvents = 'none';
                return;
            }
            DOM.kfPanel.style.opacity = '1';
            DOM.kfPanel.style.pointerEvents = 'all';
            
            DOM.lblKfPercent.textContent = kf.percent;
            DOM.inpKfPercent.value = kf.percent;
            
            DOM.kfProps.forEach(input => {
                const path = input.dataset.prop.split('.');
                let val = kf.props;
                for(let p of path) {
                    if (val === undefined) break;
                    val = val[p];
                }
                if (val !== undefined) {
                    input.value = val;
                } else {
                    // Defaults
                    if(path[0] === 'transform') {
                        input.value = path[1] === 'scale' ? 1 : 0;
                    } else if (path[0] === 'opacity') {
                        input.value = 1;
                    }
                }
            });
        };
        
        const loadPreset = (presetName) => {
            const p = presets[presetName];
            if(!p) return;
            
            state.keyframes = JSON.parse(JSON.stringify(p.kf)).map((k,i) => ({id: generateId(), ...k}));
            state.duration = p.props.duration || 1;
            state.timingFunction = p.props.timingFunction || 'ease';
            state.iterationCount = p.props.iterationCount || '1';
            
            DOM.inpDuration.value = state.duration;
            DOM.selTiming.value = state.timingFunction;
            DOM.inpIter.value = state.iterationCount;
            
            state.selectedKeyframeId = state.keyframes[0].id;
            
            DOM.selTiming.dispatchEvent(new Event('change'));
            
            renderKeyframes();
            updateKeyframePanel();
            updateLivePreview();
            
            restartAnimation();
        };
        
        const restartAnimation = () => {
            DOM.animatedEl.style.animationName = 'none';
            // Trigger reflow
            void DOM.animatedEl.offsetWidth;
            DOM.animatedEl.style.animationName = state.animationName;
        };

        // --- Bezier logic ---
        const updateBezierUI = () => {
            const [x1, y1, x2, y2] = state.customBezier;
            const w = DOM.bezierBox.offsetWidth;
            const h = DOM.bezierBox.offsetHeight;
            
            // Map 0-1 coords to canvas (with padding)
            const pad = 10;
            const innerW = w - pad*2;
            const innerH = h - pad*2;
            
            const toPxX = (v) => pad + v * innerW;
            const toPxY = (v) => pad + (1 - v) * innerH; // Flip Y
            
            const p0x = toPxX(0), p0y = toPxY(0);
            const p3x = toPxX(1), p3y = toPxY(1);
            const p1x = toPxX(x1), p1y = toPxY(y1);
            const p2x = toPxX(x2), p2y = toPxY(y2);
            
            DOM.h1.style.left = p1x + 'px'; DOM.h1.style.top = p1y + 'px';
            DOM.h2.style.left = p2x + 'px'; DOM.h2.style.top = p2y + 'px';
            
            updateLine(DOM.l1, p0x, p0y, p1x, p1y);
            updateLine(DOM.l2, p3x, p3y, p2x, p2y);
            
            DOM.bezierCanvas.width = w;
            DOM.bezierCanvas.height = h;
            bezierCtx.clearRect(0,0,w,h);
            
            // Draw grid
            bezierCtx.strokeStyle = 'rgba(255,255,255,0.1)';
            bezierCtx.lineWidth = 1;
            bezierCtx.beginPath();
            bezierCtx.moveTo(pad, pad); bezierCtx.lineTo(pad, h-pad); bezierCtx.lineTo(w-pad, h-pad);
            bezierCtx.stroke();
            
            // Draw curve
            bezierCtx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent-primary');
            bezierCtx.lineWidth = 3;
            bezierCtx.beginPath();
            bezierCtx.moveTo(p0x, p0y);
            bezierCtx.bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y);
            bezierCtx.stroke();
            
            updateLivePreview();
        };
        
        const updateLine = (el, x1, y1, x2, y2) => {
            const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
            const angle = Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;
            el.style.width = length + 'px';
            el.style.left = x1 + 'px';
            el.style.top = y1 + 'px';
            el.style.transform = `rotate(${angle}deg)`;
        };

        const setupBezierDragging = (handle, indexX, indexY) => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const moveHandler = (ev) => {
                    const rect = DOM.bezierBox.getBoundingClientRect();
                    const pad = 10;
                    const innerW = rect.width - pad*2;
                    const innerH = rect.height - pad*2;
                    
                    let x = (ev.clientX - rect.left - pad) / innerW;
                    let y = 1 - ((ev.clientY - rect.top - pad) / innerH);
                    
                    x = Math.max(0, Math.min(1, x)); // X must be 0-1
                    // Y can exceed 0-1
                    
                    state.customBezier[indexX] = parseFloat(x.toFixed(2));
                    state.customBezier[indexY] = parseFloat(y.toFixed(2));
                    
                    updateBezierUI();
                };
                const upHandler = () => {
                    document.removeEventListener('mousemove', moveHandler);
                    document.removeEventListener('mouseup', upHandler);
                };
                document.addEventListener('mousemove', moveHandler);
                document.addEventListener('mouseup', upHandler);
            });
        };

        // --- Event Listeners ---
        
        // Preview controls
        DOM.btnPlay.addEventListener('click', () => {
            state.playState = state.playState === 'running' ? 'paused' : 'running';
            DOM.btnPlay.textContent = state.playState === 'running' ? '⏸' : '▶';
            updateLivePreview();
        });
        
        DOM.btnRestart.addEventListener('click', restartAnimation);
        
        DOM.selSpeed.addEventListener('change', (e) => {
            state.playbackSpeed = parseFloat(e.target.value);
            updateLivePreview();
        });
        
        DOM.selShape.addEventListener('change', (e) => {
            DOM.animatedEl.className = 'cab-animated-element shape-' + e.target.value;
            if (e.target.value === 'text') DOM.animatedEl.textContent = 'Text';
            else DOM.animatedEl.textContent = '';
        });

        // Animation Settings
        const bindInput = (el, stateKey, parser = String) => {
            el.addEventListener('input', (e) => {
                state[stateKey] = parser(e.target.value);
                updateLivePreview();
                if(stateKey === 'animationName') restartAnimation();
            });
        };
        
        bindInput(DOM.inpName, 'animationName');
        bindInput(DOM.inpDuration, 'duration', parseFloat);
        bindInput(DOM.inpDelay, 'delay', parseFloat);
        bindInput(DOM.inpIter, 'iterationCount');
        bindInput(DOM.selDir, 'direction');
        bindInput(DOM.selFill, 'fillMode');
        
        DOM.selTiming.addEventListener('change', (e) => {
            state.timingFunction = e.target.value;
            DOM.bezierBox.style.display = state.timingFunction === 'cubic-bezier' ? 'block' : 'none';
            if (state.timingFunction === 'cubic-bezier') {
                setTimeout(updateBezierUI, 10); // Wait for display block
            }
            updateLivePreview();
        });
        
        // Timeline
        DOM.timelineWrap.addEventListener('click', (e) => {
            if (e.target.classList.contains('cab-kf-marker')) return;
            const rect = DOM.timelineWrap.getBoundingClientRect();
            let percent = ((e.clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, Math.round(percent)));
            
            if(!state.keyframes.find(k => k.percent === percent)) {
                const id = generateId();
                state.keyframes.push({id, percent, props: { transform: { translateX: 0, translateY: 0, scale: 1, rotate: 0 }, opacity: 1 }});
                state.selectedKeyframeId = id;
                sortKeyframes();
                renderKeyframes();
                updateKeyframePanel();
                updateLivePreview();
            }
        });
        
        DOM.btnAddKf.addEventListener('click', () => {
            // Find gap
            let maxGap = 0, targetPercent = 50;
            sortKeyframes();
            for(let i=0; i<state.keyframes.length-1; i++) {
                let gap = state.keyframes[i+1].percent - state.keyframes[i].percent;
                if(gap > maxGap) {
                    maxGap = gap;
                    targetPercent = Math.round(state.keyframes[i].percent + gap/2);
                }
            }
            if(!state.keyframes.find(k => k.percent === targetPercent)) {
                const id = generateId();
                state.keyframes.push({id, percent: targetPercent, props: { transform: { translateX: 0, translateY: 0, scale: 1, rotate: 0 }, opacity: 1 }});
                state.selectedKeyframeId = id;
                sortKeyframes();
                renderKeyframes();
                updateKeyframePanel();
                updateLivePreview();
            }
        });

        // Keyframe properties panel
        DOM.inpKfPercent.addEventListener('input', (e) => {
            const kf = getSelectedKeyframe();
            if(kf) {
                let val = parseInt(e.target.value);
                // Ensure no collision
                if(!state.keyframes.find(k => k.id !== kf.id && k.percent === val)) {
                    kf.percent = val;
                    DOM.lblKfPercent.textContent = val;
                    renderKeyframes();
                    updateLivePreview();
                }
            }
        });
        
        DOM.btnDelKf.addEventListener('click', () => {
            if(state.keyframes.length <= 1) return; // Must have at least 1
            state.keyframes = state.keyframes.filter(k => k.id !== state.selectedKeyframeId);
            state.selectedKeyframeId = state.keyframes[0].id;
            renderKeyframes();
            updateKeyframePanel();
            updateLivePreview();
        });
        
        DOM.kfProps.forEach(input => {
            input.addEventListener('input', (e) => {
                const kf = getSelectedKeyframe();
                if(!kf) return;
                
                const path = e.target.dataset.prop.split('.');
                let val = parseFloat(e.target.value);
                
                if (path.length === 1) {
                    kf.props[path[0]] = val;
                } else if (path.length === 2) {
                    if(!kf.props[path[0]]) kf.props[path[0]] = {};
                    kf.props[path[0]][path[1]] = val;
                }
                updateLivePreview();
            });
        });
        
        DOM.btnCopy.addEventListener('click', () => {
            window.copyToClipboard(DOM.codeOutput.value, DOM.btnCopy);
        });
        
        // Presets Init
        Object.keys(presets).forEach(name => {
            const btn = document.createElement('button');
            btn.className = 'tool-btn tool-btn-sm';
            btn.textContent = name;
            btn.addEventListener('click', () => loadPreset(name));
            DOM.presetBtns.appendChild(btn);
        });

        // Setup Bezier Handles
        setupBezierDragging(DOM.h1, 0, 1);
        setupBezierDragging(DOM.h2, 2, 3);
        
        // Handle window resize for bezier canvas
        window.addEventListener('resize', () => {
            if(state.timingFunction === 'cubic-bezier') {
                updateBezierUI();
            }
        });

        // --- Init ---
        renderKeyframes();
        updateKeyframePanel();
        updateLivePreview();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(CSSAnimationBuilder);
