const FlexboxPlaygroundTool = {
    name: 'Flexbox Playground',
    icon: '📐',
    category: 'Web',
    description: 'Visual Flexbox builder với live preview — kéo thả, điều chỉnh properties và xuất CSS',
    render(container) {
        const CSS_PREFIX = 'fbp-';
        
        let state = {
            container: {
                'flex-direction': 'row',
                'flex-wrap': 'nowrap',
                'justify-content': 'flex-start',
                'align-items': 'stretch',
                'align-content': 'flex-start',
                'gap': '10'
            },
            items: [
                { id: 1, text: 'Item 1', width: '80px', height: '80px', flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
                { id: 2, text: 'Item 2', width: '100px', height: '120px', flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
                { id: 3, text: 'Item 3', width: '120px', height: '80px', flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
                { id: 4, text: 'Item 4', width: '80px', height: '100px', flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 }
            ],
            nextId: 5,
            activeItemId: null
        };

        const presets = {
            'Navigation Bar': {
                container: { 'flex-direction': 'row', 'flex-wrap': 'nowrap', 'justify-content': 'space-between', 'align-items': 'center', 'align-content': 'flex-start', 'gap': '20' },
                items: [
                    { id: 1, text: 'Logo', width: '100px', height: '40px', flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
                    { id: 2, text: 'Links', width: 'auto', height: '40px', flexGrow: 1, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
                    { id: 3, text: 'Profile', width: '40px', height: '40px', flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 }
                ]
            },
            'Centered Content': {
                container: { 'flex-direction': 'row', 'flex-wrap': 'nowrap', 'justify-content': 'center', 'align-items': 'center', 'align-content': 'flex-start', 'gap': '0' },
                items: [
                    { id: 1, text: 'Centered Box', width: '200px', height: '200px', flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 }
                ]
            },
            'Sidebar Layout': {
                container: { 'flex-direction': 'row', 'flex-wrap': 'nowrap', 'justify-content': 'flex-start', 'align-items': 'stretch', 'align-content': 'flex-start', 'gap': '10' },
                items: [
                    { id: 1, text: 'Sidebar', width: 'auto', height: '300px', flexGrow: 0, flexShrink: 0, flexBasis: '250px', alignSelf: 'auto', order: 0 },
                    { id: 2, text: 'Main Content', width: 'auto', height: '300px', flexGrow: 1, flexShrink: 1, flexBasis: '0', alignSelf: 'auto', order: 0 }
                ]
            },
            'Card Grid': {
                container: { 'flex-direction': 'row', 'flex-wrap': 'wrap', 'justify-content': 'flex-start', 'align-items': 'stretch', 'align-content': 'flex-start', 'gap': '20' },
                items: [
                    { id: 1, text: 'Card 1', width: 'auto', height: '150px', flexGrow: 1, flexShrink: 1, flexBasis: '200px', alignSelf: 'auto', order: 0 },
                    { id: 2, text: 'Card 2', width: 'auto', height: '150px', flexGrow: 1, flexShrink: 1, flexBasis: '200px', alignSelf: 'auto', order: 0 },
                    { id: 3, text: 'Card 3', width: 'auto', height: '150px', flexGrow: 1, flexShrink: 1, flexBasis: '200px', alignSelf: 'auto', order: 0 },
                    { id: 4, text: 'Card 4', width: 'auto', height: '150px', flexGrow: 1, flexShrink: 1, flexBasis: '200px', alignSelf: 'auto', order: 0 },
                    { id: 5, text: 'Card 5', width: 'auto', height: '150px', flexGrow: 1, flexShrink: 1, flexBasis: '200px', alignSelf: 'auto', order: 0 }
                ]
            },
            'Holy Grail': {
                container: { 'flex-direction': 'column', 'flex-wrap': 'nowrap', 'justify-content': 'flex-start', 'align-items': 'stretch', 'align-content': 'flex-start', 'gap': '10' },
                items: [
                    { id: 1, text: 'Header', width: 'auto', height: '60px', flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
                    { id: 2, text: 'Content', width: 'auto', height: '200px', flexGrow: 1, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 },
                    { id: 3, text: 'Footer', width: 'auto', height: '60px', flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0 }
                ]
            },
            'Equal Heights': {
                container: { 'flex-direction': 'row', 'flex-wrap': 'nowrap', 'justify-content': 'flex-start', 'align-items': 'stretch', 'align-content': 'flex-start', 'gap': '15' },
                items: [
                    { id: 1, text: 'Short', width: '100px', height: 'auto', flexGrow: 1, flexShrink: 1, flexBasis: '0', alignSelf: 'auto', order: 0 },
                    { id: 2, text: 'Taller content here', width: '100px', height: 'auto', flexGrow: 1, flexShrink: 1, flexBasis: '0', alignSelf: 'auto', order: 0 },
                    { id: 3, text: 'Very tall content here spanning multiple lines', width: '100px', height: 'auto', flexGrow: 1, flexShrink: 1, flexBasis: '0', alignSelf: 'auto', order: 0 }
                ]
            }
        };

        const getItemColor = (id) => {
            const hue = (id * 137.5) % 360; // Golden ratio dispersion
            return `hsl(${hue}, 70%, 75%)`;
        };

        const getEnumOptions = (prop) => {
            switch(prop) {
                case 'flex-direction': return ['row', 'row-reverse', 'column', 'column-reverse'];
                case 'flex-wrap': return ['nowrap', 'wrap', 'wrap-reverse'];
                case 'justify-content': return ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
                case 'align-items': return ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'];
                case 'align-content': return ['flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around'];
                case 'align-self': return ['auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'];
                default: return [];
            }
        };

        const styleContent = `
            .${CSS_PREFIX}layout {
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
                height: 100%;
                color: var(--text-primary);
                font-family: var(--font-primary);
            }
            .${CSS_PREFIX}header-bar {
                display: flex;
                gap: var(--space-sm);
                overflow-x: auto;
                padding-bottom: var(--space-xs);
            }
            .${CSS_PREFIX}main {
                display: flex;
                gap: var(--space-md);
                flex: 1;
                min-height: 500px;
            }
            @media (max-width: 768px) {
                .${CSS_PREFIX}main {
                    flex-direction: column;
                }
                .${CSS_PREFIX}controls {
                    width: 100% !important;
                }
            }
            .${CSS_PREFIX}controls {
                width: 350px;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .${CSS_PREFIX}controls-header {
                padding: var(--space-sm) var(--space-md);
                background: var(--bg-tertiary);
                border-bottom: 1px solid var(--border-color);
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .${CSS_PREFIX}controls-body {
                padding: var(--space-md);
                overflow-y: auto;
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
            }
            .${CSS_PREFIX}group {
                display: flex;
                flex-direction: column;
                gap: var(--space-xs);
            }
            .${CSS_PREFIX}label {
                font-size: var(--fs-sm);
                color: var(--text-secondary);
                display: flex;
                justify-content: space-between;
            }
            .${CSS_PREFIX}segmented {
                display: flex;
                flex-wrap: wrap;
                gap: 2px;
                background: var(--bg-tertiary);
                padding: 2px;
                border-radius: var(--radius-sm);
                border: 1px solid var(--border-color);
            }
            .${CSS_PREFIX}segment {
                flex: 1;
                text-align: center;
                padding: var(--space-xs);
                font-size: var(--fs-xs);
                cursor: pointer;
                border-radius: calc(var(--radius-sm) - 2px);
                transition: all 0.2s;
                user-select: none;
                min-width: 60px;
            }
            .${CSS_PREFIX}segment:hover {
                background: var(--bg-secondary);
            }
            .${CSS_PREFIX}segment.active {
                background: var(--border-color);
                color: var(--accent-primary);
                font-weight: 500;
            }
            .${CSS_PREFIX}range-container {
                display: flex;
                align-items: center;
                gap: var(--space-sm);
            }
            .${CSS_PREFIX}range-container input[type="range"] {
                flex: 1;
                accent-color: var(--accent-primary);
            }
            .${CSS_PREFIX}range-container input[type="number"] {
                width: 60px;
                background: var(--bg-input);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                padding: var(--space-xs);
                border-radius: var(--radius-sm);
                font-size: var(--fs-sm);
            }
            .${CSS_PREFIX}item-list {
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
            }
            .${CSS_PREFIX}item-card {
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                overflow: hidden;
                background: var(--bg-card);
            }
            .${CSS_PREFIX}item-header {
                padding: var(--space-xs) var(--space-sm);
                background: var(--bg-tertiary);
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                cursor: pointer;
                font-size: var(--fs-sm);
            }
            .${CSS_PREFIX}item-header:hover {
                background: var(--border-hover);
            }
            .${CSS_PREFIX}item-color-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                display: inline-block;
            }
            .${CSS_PREFIX}item-title {
                flex: 1;
            }
            .${CSS_PREFIX}item-delete {
                background: none;
                border: none;
                color: var(--text-tertiary);
                cursor: pointer;
                padding: 2px 5px;
                border-radius: 4px;
            }
            .${CSS_PREFIX}item-delete:hover {
                color: var(--accent-danger);
                background: rgba(239, 68, 68, 0.1);
            }
            .${CSS_PREFIX}item-body {
                padding: var(--space-sm);
                display: flex;
                flex-direction: column;
                gap: var(--space-sm);
                border-top: 1px solid var(--border-color);
                display: none;
            }
            .${CSS_PREFIX}item-card.active .${CSS_PREFIX}item-body {
                display: flex;
            }
            .${CSS_PREFIX}input-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--space-sm);
            }
            .${CSS_PREFIX}input {
                width: 100%;
                background: var(--bg-input);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                padding: var(--space-xs);
                border-radius: var(--radius-sm);
                font-size: var(--fs-sm);
            }
            .${CSS_PREFIX}input:focus {
                border-color: var(--border-focus);
                outline: none;
            }
            .${CSS_PREFIX}preview-panel {
                flex: 1;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .${CSS_PREFIX}preview-header {
                padding: var(--space-sm) var(--space-md);
                background: var(--bg-tertiary);
                border-bottom: 1px solid var(--border-color);
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .${CSS_PREFIX}preview-container-wrapper {
                flex: 1;
                overflow: auto;
                display: flex;
                flex-direction: column;
                background-image: radial-gradient(var(--border-color) 1px, transparent 0);
                background-size: 20px 20px;
                padding: var(--space-md);
            }
            .${CSS_PREFIX}preview-container {
                display: flex;
                border: 2px dashed var(--text-tertiary);
                transition: all 0.3s ease;
                min-height: 100%;
                position: relative;
            }
            .${CSS_PREFIX}preview-item {
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-primary);
                font-weight: bold;
                color: #000;
                transition: all 0.3s ease;
                border-radius: var(--radius-sm);
                border: 1px solid rgba(0,0,0,0.15);
                padding: var(--space-sm);
                position: relative;
                text-align: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .${CSS_PREFIX}preview-item-info {
                position: absolute;
                bottom: 2px;
                right: 4px;
                font-size: 10px;
                opacity: 0;
                transition: opacity 0.2s;
                font-weight: normal;
            }
            .${CSS_PREFIX}preview-item:hover .${CSS_PREFIX}preview-item-info {
                opacity: 1;
            }
            .${CSS_PREFIX}code-panel {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .${CSS_PREFIX}code-header {
                padding: var(--space-sm) var(--space-md);
                background: var(--bg-tertiary);
                border-bottom: 1px solid var(--border-color);
                font-weight: bold;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .${CSS_PREFIX}code-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1px;
                background: var(--border-color);
            }
            @media (max-width: 768px) {
                .${CSS_PREFIX}code-content {
                    grid-template-columns: 1fr;
                }
            }
            .${CSS_PREFIX}code-block-wrapper {
                background: var(--bg-secondary);
                padding: var(--space-sm);
                display: flex;
                flex-direction: column;
            }
            .${CSS_PREFIX}code-block {
                margin: 0;
                padding: var(--space-sm);
                background: var(--bg-primary);
                border-radius: var(--radius-sm);
                font-family: var(--font-mono);
                font-size: var(--fs-sm);
                color: var(--text-primary);
                overflow-x: auto;
                white-space: pre-wrap;
                flex: 1;
                border: 1px solid transparent;
            }
            .${CSS_PREFIX}textarea {
                width: 100%;
                background: var(--bg-primary);
                border: 1px dashed var(--border-color);
                color: var(--text-primary);
                padding: var(--space-sm);
                border-radius: var(--radius-sm);
                font-family: var(--font-mono);
                font-size: var(--fs-sm);
                resize: vertical;
                min-height: 150px;
            }
            .${CSS_PREFIX}textarea:focus {
                border-color: var(--border-focus);
                outline: none;
            }
            .${CSS_PREFIX}tabs {
                display: flex;
                gap: var(--space-sm);
            }
            .${CSS_PREFIX}tab {
                padding: 4px 12px;
                background: transparent;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                font-size: var(--fs-sm);
                border-radius: var(--radius-sm);
            }
            .${CSS_PREFIX}tab.active {
                background: var(--border-color);
                color: var(--text-primary);
            }
            .tool-btn {
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                padding: 6px 12px;
                border-radius: var(--radius-sm);
                cursor: pointer;
                font-size: var(--fs-sm);
                transition: all 0.2s;
            }
            .tool-btn:hover {
                background: var(--border-hover);
            }
            .tool-btn-primary {
                background: var(--text-primary);
                color: var(--bg-primary);
                border: none;
            }
            .tool-btn-primary:hover {
                background: var(--text-secondary);
            }
            .tool-btn-sm {
                padding: 4px 8px;
                font-size: var(--fs-xs);
            }
        `;

        const renderSegmentedControl = (prop, label, options, currentValue) => {
            return `
                <div class="${CSS_PREFIX}group" data-prop="${prop}">
                    <div class="${CSS_PREFIX}label">${label}</div>
                    <div class="${CSS_PREFIX}segmented">
                        ${options.map(opt => `
                            <div class="${CSS_PREFIX}segment ${currentValue === opt ? 'active' : ''}" data-value="${opt}">
                                ${opt.replace('flex-', '')}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        };

        const renderControls = () => {
            const c = state.container;
            
            let html = `
                <div class="${CSS_PREFIX}controls-header">
                    Container Properties
                </div>
                <div class="${CSS_PREFIX}controls-body">
                    <div class="${CSS_PREFIX}group">
                        <div class="${CSS_PREFIX}label">display</div>
                        <input type="text" class="${CSS_PREFIX}input" value="flex" disabled style="opacity: 0.7">
                    </div>
                    
                    ${renderSegmentedControl('flex-direction', 'flex-direction', getEnumOptions('flex-direction'), c['flex-direction'])}
                    ${renderSegmentedControl('flex-wrap', 'flex-wrap', getEnumOptions('flex-wrap'), c['flex-wrap'])}
                    ${renderSegmentedControl('justify-content', 'justify-content', getEnumOptions('justify-content'), c['justify-content'])}
                    ${renderSegmentedControl('align-items', 'align-items', getEnumOptions('align-items'), c['align-items'])}
            `;

            if (c['flex-wrap'] !== 'nowrap') {
                html += renderSegmentedControl('align-content', 'align-content', getEnumOptions('align-content'), c['align-content']);
            }

            html += `
                    <div class="${CSS_PREFIX}group">
                        <div class="${CSS_PREFIX}label">
                            <span>gap</span>
                            <span id="gap-val">${c.gap}px</span>
                        </div>
                        <div class="${CSS_PREFIX}range-container">
                            <input type="range" id="gap-range" min="0" max="100" value="${c.gap}">
                            <input type="number" id="gap-number" min="0" max="100" value="${c.gap}">
                        </div>
                    </div>
                </div>
                
                <div class="${CSS_PREFIX}controls-header" style="border-top: 1px solid var(--border-color);">
                    <span>Flex Items (${state.items.length}/12)</span>
                    <button class="tool-btn tool-btn-sm" id="btn-add-item" ${state.items.length >= 12 ? 'disabled' : ''}>+ Add</button>
                </div>
                <div class="${CSS_PREFIX}controls-body">
                    <div class="${CSS_PREFIX}item-list" id="item-list">
            `;

            state.items.forEach(item => {
                const isActive = state.activeItemId === item.id;
                html += `
                    <div class="${CSS_PREFIX}item-card ${isActive ? 'active' : ''}" data-id="${item.id}">
                        <div class="${CSS_PREFIX}item-header">
                            <span class="${CSS_PREFIX}item-color-dot" style="background: ${getItemColor(item.id)}"></span>
                            <span class="${CSS_PREFIX}item-title">${item.text}</span>
                            <button class="${CSS_PREFIX}item-delete" title="Delete item">✕</button>
                        </div>
                        <div class="${CSS_PREFIX}item-body">
                            <div class="${CSS_PREFIX}input-grid">
                                <div class="${CSS_PREFIX}group">
                                    <div class="${CSS_PREFIX}label">flex-grow</div>
                                    <input type="number" class="${CSS_PREFIX}input item-prop" data-prop="flexGrow" value="${item.flexGrow}" min="0" max="10">
                                </div>
                                <div class="${CSS_PREFIX}group">
                                    <div class="${CSS_PREFIX}label">flex-shrink</div>
                                    <input type="number" class="${CSS_PREFIX}input item-prop" data-prop="flexShrink" value="${item.flexShrink}" min="0" max="10">
                                </div>
                            </div>
                            <div class="${CSS_PREFIX}input-grid">
                                <div class="${CSS_PREFIX}group">
                                    <div class="${CSS_PREFIX}label">flex-basis</div>
                                    <input type="text" class="${CSS_PREFIX}input item-prop" data-prop="flexBasis" value="${item.flexBasis}">
                                </div>
                                <div class="${CSS_PREFIX}group">
                                    <div class="${CSS_PREFIX}label">order</div>
                                    <input type="number" class="${CSS_PREFIX}input item-prop" data-prop="order" value="${item.order}">
                                </div>
                            </div>
                            <div class="${CSS_PREFIX}group">
                                <div class="${CSS_PREFIX}label">align-self</div>
                                <select class="${CSS_PREFIX}input item-prop" data-prop="alignSelf">
                                    ${getEnumOptions('align-self').map(opt => `<option value="${opt}" ${item.alignSelf === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                                </select>
                            </div>
                            <div class="${CSS_PREFIX}input-grid">
                                <div class="${CSS_PREFIX}group">
                                    <div class="${CSS_PREFIX}label">width</div>
                                    <input type="text" class="${CSS_PREFIX}input item-prop" data-prop="width" value="${item.width}">
                                </div>
                                <div class="${CSS_PREFIX}group">
                                    <div class="${CSS_PREFIX}label">height</div>
                                    <input type="text" class="${CSS_PREFIX}input item-prop" data-prop="height" value="${item.height}">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
            return html;
        };

        const generateCSS = () => {
            const c = state.container;
            let css = '.flex-container {\n  display: flex;\n';
            if (c['flex-direction'] !== 'row') css += '  flex-direction: ' + c['flex-direction'] + ';\n';
            if (c['flex-wrap'] !== 'nowrap') css += '  flex-wrap: ' + c['flex-wrap'] + ';\n';
            if (c['justify-content'] !== 'flex-start') css += '  justify-content: ' + c['justify-content'] + ';\n';
            if (c['align-items'] !== 'stretch') css += '  align-items: ' + c['align-items'] + ';\n';
            if (c['flex-wrap'] !== 'nowrap' && c['align-content'] !== 'flex-start') css += '  align-content: ' + c['align-content'] + ';\n';
            if (c.gap !== '0') css += '  gap: ' + c.gap + 'px;\n';
            css += '}\n\n';

            state.items.forEach((item, index) => {
                let itemCss = '.item-' + (index + 1) + ' {\n';
                let hasProps = false;
                
                if (item.flexGrow !== 0) { itemCss += '  flex-grow: ' + item.flexGrow + ';\n'; hasProps = true; }
                if (item.flexShrink !== 1) { itemCss += '  flex-shrink: ' + item.flexShrink + ';\n'; hasProps = true; }
                if (item.flexBasis !== 'auto') { itemCss += '  flex-basis: ' + item.flexBasis + ';\n'; hasProps = true; }
                if (item.alignSelf !== 'auto') { itemCss += '  align-self: ' + item.alignSelf + ';\n'; hasProps = true; }
                if (item.order !== 0) { itemCss += '  order: ' + item.order + ';\n'; hasProps = true; }
                
                if (item.width && item.width !== 'auto') { itemCss += '  width: ' + item.width + ';\n'; hasProps = true; }
                if (item.height && item.height !== 'auto') { itemCss += '  height: ' + item.height + ';\n'; hasProps = true; }
                
                itemCss += '}\n\n';
                
                if (hasProps) {
                    css += itemCss;
                }
            });

            return css.trim();
        };

        const updateView = () => {
            // Update Controls panel
            const controlsPanel = container.querySelector('.fbp-controls-container');
            if (controlsPanel) controlsPanel.innerHTML = renderControls();

            // Update Preview
            const previewContainer = container.querySelector('#fbp-preview');
            if (previewContainer) {
                const c = state.container;
                previewContainer.style.flexDirection = c['flex-direction'];
                previewContainer.style.flexWrap = c['flex-wrap'];
                previewContainer.style.justifyContent = c['justify-content'];
                previewContainer.style.alignItems = c['align-items'];
                previewContainer.style.alignContent = c['align-content'];
                previewContainer.style.gap = c.gap + 'px';
                
                previewContainer.innerHTML = state.items.map(item => `
                    <div class="${CSS_PREFIX}preview-item" style="
                        background-color: ${getItemColor(item.id)};
                        flex-grow: ${item.flexGrow};
                        flex-shrink: ${item.flexShrink};
                        flex-basis: ${item.flexBasis};
                        align-self: ${item.alignSelf};
                        order: ${item.order};
                        width: ${item.width};
                        height: ${item.height};
                    ">
                        ${item.text}
                    </div>
                `).join('');
            }

            // Update Code Output
            const codeBlock = container.querySelector('#fbp-code-output');
            if (codeBlock) {
                codeBlock.textContent = generateCSS();
            }

            attachEventListeners();
        };

        const attachEventListeners = () => {
            // Container Segmented Controls
            const segments = container.querySelectorAll(`.${CSS_PREFIX}segment`);
            segments.forEach(seg => {
                seg.addEventListener('click', (e) => {
                    const prop = e.target.closest(`.${CSS_PREFIX}group`).dataset.prop;
                    const value = e.target.dataset.value;
                    state.container[prop] = value;
                    updateView();
                });
            });

            // Gap Slider
            const gapRange = container.querySelector('#gap-range');
            const gapNum = container.querySelector('#gap-number');
            if (gapRange && gapNum) {
                const updateGap = (val) => {
                    state.container.gap = val;
                    updateView();
                };
                gapRange.addEventListener('input', (e) => updateGap(e.target.value));
                gapNum.addEventListener('input', (e) => updateGap(e.target.value));
            }

            // Presets
            const presetBtns = container.querySelectorAll('.preset-btn');
            presetBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const presetName = e.target.dataset.preset;
                    if (presets[presetName]) {
                        state.container = JSON.parse(JSON.stringify(presets[presetName].container));
                        state.items = JSON.parse(JSON.stringify(presets[presetName].items));
                        state.nextId = Math.max(...state.items.map(i => i.id)) + 1;
                        state.activeItemId = null;
                        updateView();
                    }
                });
            });

            // Add Item
            const btnAdd = container.querySelector('#btn-add-item');
            if (btnAdd) {
                btnAdd.addEventListener('click', () => {
                    if (state.items.length < 12) {
                        const newId = state.nextId++;
                        state.items.push({
                            id: newId,
                            text: `Item ${newId}`,
                            width: '80px',
                            height: '80px',
                            flexGrow: 0,
                            flexShrink: 1,
                            flexBasis: 'auto',
                            alignSelf: 'auto',
                            order: 0
                        });
                        state.activeItemId = newId;
                        updateView();
                    }
                });
            }

            // Item Headers (Accordion)
            const itemHeaders = container.querySelectorAll(`.${CSS_PREFIX}item-header`);
            itemHeaders.forEach(header => {
                header.addEventListener('click', (e) => {
                    if (e.target.classList.contains(`${CSS_PREFIX}item-delete`)) return;
                    const card = e.target.closest(`.${CSS_PREFIX}item-card`);
                    const id = parseInt(card.dataset.id);
                    state.activeItemId = state.activeItemId === id ? null : id;
                    updateView();
                });
            });

            // Delete Item
            const deleteBtns = container.querySelectorAll(`.${CSS_PREFIX}item-delete`);
            deleteBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = e.target.closest(`.${CSS_PREFIX}item-card`);
                    const id = parseInt(card.dataset.id);
                    state.items = state.items.filter(item => item.id !== id);
                    if (state.activeItemId === id) state.activeItemId = null;
                    updateView();
                });
            });

            // Item Properties Inputs
            const itemInputs = container.querySelectorAll('.item-prop');
            itemInputs.forEach(input => {
                input.addEventListener('change', (e) => {
                    const card = e.target.closest(`.${CSS_PREFIX}item-card`);
                    const id = parseInt(card.dataset.id);
                    const prop = e.target.dataset.prop;
                    const item = state.items.find(i => i.id === id);
                    if (item) {
                        let val = e.target.value;
                        if (['flexGrow', 'flexShrink', 'order'].includes(prop)) val = parseInt(val) || 0;
                        item[prop] = val;
                        updateView();
                    }
                });
            });
        };

        container.innerHTML = `
            <style>${styleContent}</style>
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>${this.icon} ${this.name}</h2>
                    <p class="tool-description">${this.description}</p>
                </div>
                
                <div class="${CSS_PREFIX}layout">
                    <div class="${CSS_PREFIX}header-bar">
                        ${Object.keys(presets).map(name => `
                            <button class="tool-btn preset-btn" data-preset="${name}">${name}</button>
                        `).join('')}
                    </div>

                    <div class="${CSS_PREFIX}main">
                        <div class="${CSS_PREFIX}controls fbp-controls-container">
                            <!-- Populated by JS -->
                        </div>
                        
                        <div class="${CSS_PREFIX}preview-panel">
                            <div class="${CSS_PREFIX}preview-header">Live Preview</div>
                            <div class="${CSS_PREFIX}preview-container-wrapper">
                                <div class="${CSS_PREFIX}preview-container" id="fbp-preview">
                                    <!-- Populated by JS -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="${CSS_PREFIX}code-panel">
                        <div class="${CSS_PREFIX}code-header">
                            <span>Generated CSS</span>
                            <button class="tool-btn tool-btn-sm" id="btn-copy-css">Copy CSS</button>
                        </div>
                        <div class="${CSS_PREFIX}code-content">
                            <div class="${CSS_PREFIX}code-block-wrapper">
                                <pre class="${CSS_PREFIX}code-block" id="fbp-code-output"></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.querySelector('#btn-copy-css').addEventListener('click', (e) => {
            const css = generateCSS();
            if (window.copyToClipboard) {
                window.copyToClipboard(css, e.target);
            } else {
                navigator.clipboard.writeText(css);
                const originalText = e.target.textContent;
                e.target.textContent = 'Copied!';
                setTimeout(() => { e.target.textContent = originalText; }, 2000);
            }
        });

        // Initial render
        updateView();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(FlexboxPlaygroundTool);
