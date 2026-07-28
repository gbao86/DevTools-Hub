const KeyboardShortcuts = {
    name: 'Keyboard Shortcuts',
    icon: '📝',
    category: 'Reference',
    description: 'Tra cứu phím tắt VS Code, IntelliJ, Vim, Terminal',
    
    data: {
        vscode: {
            title: 'VS Code',
            categories: [
                {
                    name: 'General',
                    shortcuts: [
                        { action: 'Command Palette', win: 'Ctrl+Shift+P', mac: 'Cmd+Shift+P' },
                        { action: 'Quick Open, Go to File', win: 'Ctrl+P', mac: 'Cmd+P' },
                        { action: 'New window/instance', win: 'Ctrl+Shift+N', mac: 'Cmd+Shift+N' },
                        { action: 'Close window/instance', win: 'Ctrl+Shift+W', mac: 'Cmd+Shift+W' },
                        { action: 'User Settings', win: 'Ctrl+,', mac: 'Cmd+,' },
                        { action: 'Keyboard Shortcuts', win: 'Ctrl+K Ctrl+S', mac: 'Cmd+K Cmd+S' }
                    ]
                },
                {
                    name: 'Editing',
                    shortcuts: [
                        { action: 'Cut line (empty selection)', win: 'Ctrl+X', mac: 'Cmd+X' },
                        { action: 'Copy line (empty selection)', win: 'Ctrl+C', mac: 'Cmd+C' },
                        { action: 'Move line up/down', win: 'Alt+Up / Alt+Down', mac: 'Option+Up / Option+Down' },
                        { action: 'Copy line up/down', win: 'Shift+Alt+Up/Down', mac: 'Shift+Option+Up/Down' },
                        { action: 'Delete line', win: 'Ctrl+Shift+K', mac: 'Cmd+Shift+K' },
                        { action: 'Insert line below/above', win: 'Ctrl+Enter / Ctrl+Shift+Enter', mac: 'Cmd+Enter / Cmd+Shift+Enter' },
                        { action: 'Jump to matching bracket', win: 'Ctrl+Shift+\\', mac: 'Cmd+Shift+\\' },
                        { action: 'Indent/outdent line', win: 'Ctrl+] / Ctrl+[', mac: 'Cmd+] / Cmd+[' },
                        { action: 'Go to beginning/end of line', win: 'Home / End', mac: 'Cmd+Left / Cmd+Right' },
                        { action: 'Go to beginning/end of file', win: 'Ctrl+Home / Ctrl+End', mac: 'Cmd+Up / Cmd+Down' }
                    ]
                },
                {
                    name: 'Multi-cursor',
                    shortcuts: [
                        { action: 'Insert cursor', win: 'Alt+Click', mac: 'Option+Click' },
                        { action: 'Insert cursor above/below', win: 'Ctrl+Alt+Up/Down', mac: 'Cmd+Option+Up/Down' },
                        { action: 'Undo last cursor operation', win: 'Ctrl+U', mac: 'Cmd+U' },
                        { action: 'Insert cursor at end of each line selected', win: 'Shift+Alt+I', mac: 'Shift+Option+I' },
                        { action: 'Select all occurrences of current selection', win: 'Ctrl+Shift+L', mac: 'Cmd+Shift+L' },
                        { action: 'Select all occurrences of current word', win: 'Ctrl+F2', mac: 'Cmd+F2' }
                    ]
                },
                {
                    name: 'Search & Replace',
                    shortcuts: [
                        { action: 'Find', win: 'Ctrl+F', mac: 'Cmd+F' },
                        { action: 'Replace', win: 'Ctrl+H', mac: 'Cmd+Option+F' },
                        { action: 'Find next/previous', win: 'F3 / Shift+F3', mac: 'Cmd+G / Cmd+Shift+G' },
                        { action: 'Select all occurrences of Find match', win: 'Alt+Enter', mac: 'Option+Enter' },
                        { action: 'Add selection to next Find match', win: 'Ctrl+D', mac: 'Cmd+D' }
                    ]
                }
            ]
        },
        intellij: {
            title: 'IntelliJ / WebStorm',
            categories: [
                {
                    name: 'General',
                    shortcuts: [
                        { action: 'Search Everywhere', win: 'Shift+Shift', mac: 'Shift+Shift' },
                        { action: 'Find Action', win: 'Ctrl+Shift+A', mac: 'Cmd+Shift+A' },
                        { action: 'Settings/Preferences', win: 'Ctrl+Alt+S', mac: 'Cmd+,' },
                        { action: 'Project Structure', win: 'Ctrl+Alt+Shift+S', mac: 'Cmd+;' }
                    ]
                },
                {
                    name: 'Editing',
                    shortcuts: [
                        { action: 'Basic code completion', win: 'Ctrl+Space', mac: 'Ctrl+Space' },
                        { action: 'Smart code completion', win: 'Ctrl+Shift+Space', mac: 'Ctrl+Shift+Space' },
                        { action: 'Complete statement', win: 'Ctrl+Shift+Enter', mac: 'Cmd+Shift+Enter' },
                        { action: 'Parameter info', win: 'Ctrl+P', mac: 'Cmd+P' },
                        { action: 'Quick documentation lookup', win: 'Ctrl+Q', mac: 'F1' },
                        { action: 'Generate code', win: 'Alt+Insert', mac: 'Cmd+N' },
                        { action: 'Override methods', win: 'Ctrl+O', mac: 'Ctrl+O' },
                        { action: 'Implement methods', win: 'Ctrl+I', mac: 'Ctrl+I' },
                        { action: 'Surround with', win: 'Ctrl+Alt+T', mac: 'Cmd+Option+T' },
                        { action: 'Duplicate current line or selection', win: 'Ctrl+D', mac: 'Cmd+D' }
                    ]
                },
                {
                    name: 'Navigation',
                    shortcuts: [
                        { action: 'Go to class', win: 'Ctrl+N', mac: 'Cmd+O' },
                        { action: 'Go to file', win: 'Ctrl+Shift+N', mac: 'Cmd+Shift+O' },
                        { action: 'Go to symbol', win: 'Ctrl+Alt+Shift+N', mac: 'Cmd+Option+O' },
                        { action: 'Go to declaration', win: 'Ctrl+B / Ctrl+Click', mac: 'Cmd+B / Cmd+Click' },
                        { action: 'Go to implementation', win: 'Ctrl+Alt+B', mac: 'Cmd+Option+B' },
                        { action: 'Recent files popup', win: 'Ctrl+E', mac: 'Cmd+E' },
                        { action: 'Navigate back/forward', win: 'Ctrl+Alt+Left/Right', mac: 'Cmd+[ / Cmd+]' }
                    ]
                },
                {
                    name: 'Refactoring',
                    shortcuts: [
                        { action: 'Rename', win: 'Shift+F6', mac: 'Shift+F6' },
                        { action: 'Extract Variable', win: 'Ctrl+Alt+V', mac: 'Cmd+Option+V' },
                        { action: 'Extract Method', win: 'Ctrl+Alt+M', mac: 'Cmd+Option+M' },
                        { action: 'Inline', win: 'Ctrl+Alt+N', mac: 'Cmd+Option+N' }
                    ]
                }
            ]
        },
        vim: {
            title: 'Vim / Neovim',
            categories: [
                {
                    name: 'Modes & General',
                    shortcuts: [
                        { action: 'Normal Mode', win: 'Esc', mac: 'Esc' },
                        { action: 'Insert Mode (before cursor)', win: 'i', mac: 'i' },
                        { action: 'Insert Mode (after cursor)', win: 'a', mac: 'a' },
                        { action: 'Insert Mode (beginning of line)', win: 'I', mac: 'I' },
                        { action: 'Insert Mode (end of line)', win: 'A', mac: 'A' },
                        { action: 'Insert Mode (new line below)', win: 'o', mac: 'o' },
                        { action: 'Insert Mode (new line above)', win: 'O', mac: 'O' },
                        { action: 'Save', win: ':w', mac: ':w' },
                        { action: 'Quit', win: ':q', mac: ':q' },
                        { action: 'Save and Quit', win: ':wq / ZZ', mac: ':wq / ZZ' }
                    ]
                },
                {
                    name: 'Navigation',
                    shortcuts: [
                        { action: 'Left / Down / Up / Right', win: 'h / j / k / l', mac: 'h / j / k / l' },
                        { action: 'Next word / Previous word', win: 'w / b', mac: 'w / b' },
                        { action: 'End of word', win: 'e', mac: 'e' },
                        { action: 'Beginning of line', win: '0', mac: '0' },
                        { action: 'First non-blank char of line', win: '^', mac: '^' },
                        { action: 'End of line', win: '$', mac: '$' },
                        { action: 'Top of file', win: 'gg', mac: 'gg' },
                        { action: 'Bottom of file', win: 'G', mac: 'G' },
                        { action: 'Go to line N', win: 'Ng / :N', mac: 'Ng / :N' }
                    ]
                },
                {
                    name: 'Editing',
                    shortcuts: [
                        { action: 'Undo', win: 'u', mac: 'u' },
                        { action: 'Redo', win: 'Ctrl+R', mac: 'Ctrl+R' },
                        { action: 'Delete character', win: 'x', mac: 'x' },
                        { action: 'Delete word', win: 'dw', mac: 'dw' },
                        { action: 'Delete line', win: 'dd', mac: 'dd' },
                        { action: 'Copy (Yank) line', win: 'yy', mac: 'yy' },
                        { action: 'Paste after cursor', win: 'p', mac: 'p' },
                        { action: 'Paste before cursor', win: 'P', mac: 'P' },
                        { action: 'Replace character', win: 'r', mac: 'r' },
                        { action: 'Substitute character', win: 's', mac: 's' }
                    ]
                },
                {
                    name: 'Search',
                    shortcuts: [
                        { action: 'Search forward', win: '/pattern', mac: '/pattern' },
                        { action: 'Search backward', win: '?pattern', mac: '?pattern' },
                        { action: 'Next match', win: 'n', mac: 'n' },
                        { action: 'Previous match', win: 'N', mac: 'N' },
                        { action: 'Search word under cursor', win: '*', mac: '*' }
                    ]
                }
            ]
        },
        terminal: {
            title: 'Terminal (Bash/Zsh)',
            categories: [
                {
                    name: 'History',
                    shortcuts: [
                        { action: 'Previous command', win: 'Up Arrow', mac: 'Up Arrow' },
                        { action: 'Next command', win: 'Down Arrow', mac: 'Down Arrow' },
                        { action: 'Reverse search history', win: 'Ctrl+R', mac: 'Ctrl+R' },
                        { action: 'Execute last command', win: '!!', mac: '!!' },
                        { action: 'Execute last command starting with string', win: '!string', mac: '!string' }
                    ]
                },
                {
                    name: 'Navigation & Editing',
                    shortcuts: [
                        { action: 'Go to beginning of line', win: 'Ctrl+A', mac: 'Ctrl+A' },
                        { action: 'Go to end of line', win: 'Ctrl+E', mac: 'Ctrl+E' },
                        { action: 'Go forward one word', win: 'Alt+F', mac: 'Option+F / Esc+F' },
                        { action: 'Go backward one word', win: 'Alt+B', mac: 'Option+B / Esc+B' },
                        { action: 'Clear screen', win: 'Ctrl+L', mac: 'Ctrl+L' },
                        { action: 'Delete to beginning of line', win: 'Ctrl+U', mac: 'Ctrl+U' },
                        { action: 'Delete to end of line', win: 'Ctrl+K', mac: 'Ctrl+K' },
                        { action: 'Delete word before cursor', win: 'Ctrl+W', mac: 'Ctrl+W' },
                        { action: 'Cancel command', win: 'Ctrl+C', mac: 'Ctrl+C' },
                        { action: 'Exit terminal / EOF', win: 'Ctrl+D', mac: 'Ctrl+D' }
                    ]
                }
            ]
        },
        devtools: {
            title: 'Chrome DevTools',
            categories: [
                {
                    name: 'General',
                    shortcuts: [
                        { action: 'Open DevTools', win: 'F12 / Ctrl+Shift+I', mac: 'Cmd+Option+I' },
                        { action: 'Toggle Device Mode', win: 'Ctrl+Shift+M', mac: 'Cmd+Shift+M' },
                        { action: 'Command Menu', win: 'Ctrl+Shift+P', mac: 'Cmd+Shift+P' },
                        { action: 'Search in all files', win: 'Ctrl+Shift+F', mac: 'Cmd+Option+F' },
                        { action: 'Reload page', win: 'Ctrl+R', mac: 'Cmd+R' },
                        { action: 'Hard reload', win: 'Ctrl+Shift+R', mac: 'Cmd+Shift+R' }
                    ]
                },
                {
                    name: 'Elements Panel',
                    shortcuts: [
                        { action: 'Select element to inspect', win: 'Ctrl+Shift+C', mac: 'Cmd+Shift+C' },
                        { action: 'Edit as HTML', win: 'F2', mac: 'F2' },
                        { action: 'Hide element', win: 'H', mac: 'H' },
                        { action: 'Expand/collapse node', win: 'Right / Left', mac: 'Right / Left' }
                    ]
                },
                {
                    name: 'Console & Sources',
                    shortcuts: [
                        { action: 'Toggle Console drawer', win: 'Esc', mac: 'Esc' },
                        { action: 'Clear Console', win: 'Ctrl+L', mac: 'Cmd+K' },
                        { action: 'Multi-line entry', win: 'Shift+Enter', mac: 'Shift+Enter' },
                        { action: 'Pause/Resume script execution', win: 'F8 / Ctrl+\\', mac: 'F8 / Cmd+\\' },
                        { action: 'Step over next function call', win: 'F10 / Ctrl+\'', mac: 'F10 / Cmd+\'' },
                        { action: 'Step into next function call', win: 'F11 / Ctrl+;', mac: 'F11 / Cmd+;' }
                    ]
                }
            ]
        },
        git: {
            title: 'Git Commands',
            categories: [
                {
                    name: 'Basic',
                    shortcuts: [
                        { action: 'Initialize repository', win: 'git init', mac: 'git init' },
                        { action: 'Clone repository', win: 'git clone <url>', mac: 'git clone <url>' },
                        { action: 'Check status', win: 'git status', mac: 'git status' },
                        { action: 'Add all files', win: 'git add .', mac: 'git add .' },
                        { action: 'Commit with message', win: 'git commit -m "msg"', mac: 'git commit -m "msg"' }
                    ]
                },
                {
                    name: 'Branching & Merging',
                    shortcuts: [
                        { action: 'List branches', win: 'git branch', mac: 'git branch' },
                        { action: 'Create and switch to branch', win: 'git checkout -b <name>', mac: 'git checkout -b <name>' },
                        { action: 'Switch branch', win: 'git checkout <name>', mac: 'git checkout <name>' },
                        { action: 'Merge branch into current', win: 'git merge <branch>', mac: 'git merge <branch>' },
                        { action: 'Delete branch', win: 'git branch -d <name>', mac: 'git branch -d <name>' }
                    ]
                },
                {
                    name: 'Remote',
                    shortcuts: [
                        { action: 'Add remote', win: 'git remote add origin <url>', mac: 'git remote add origin <url>' },
                        { action: 'Fetch changes', win: 'git fetch', mac: 'git fetch' },
                        { action: 'Pull changes', win: 'git pull', mac: 'git pull' },
                        { action: 'Push changes', win: 'git push origin <branch>', mac: 'git push origin <branch>' }
                    ]
                }
            ]
        }
    },

    state: {
        activeTab: 'vscode',
        os: navigator.platform.toLowerCase().includes('mac') ? 'mac' : 'win',
        searchQuery: '',
        favorites: JSON.parse(localStorage.getItem('devToolsHub_kbFavorites') || '[]')
    },

    render(container) {
        this.injectStyles();
        
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>${this.icon} ${this.name}</h2>
                    <p class="tool-description">${this.description}</p>
                </div>
                
                <div class="kb-controls tool-row" style="margin-bottom: var(--space-md); gap: var(--space-md); align-items: center; justify-content: space-between;">
                    <div class="tool-group" style="flex: 1; margin: 0;">
                        <input type="text" class="tool-input kb-search-input" placeholder="Tìm kiếm phím tắt, chức năng..." value="${this.state.searchQuery}">
                    </div>
                    
                    <div class="kb-os-toggle" style="display: flex; gap: var(--space-sm); background: var(--bg-tertiary); padding: 4px; border-radius: var(--radius-md);">
                        <button class="tool-btn-sm kb-os-btn ${this.state.os === 'win' ? 'active' : ''}" data-os="win" style="margin:0; border:none; ${this.state.os === 'win' ? 'background: var(--bg-primary); color: var(--accent-primary);' : 'background: transparent;'}">Windows/Linux</button>
                        <button class="tool-btn-sm kb-os-btn ${this.state.os === 'mac' ? 'active' : ''}" data-os="mac" style="margin:0; border:none; ${this.state.os === 'mac' ? 'background: var(--bg-primary); color: var(--accent-primary);' : 'background: transparent;'}">macOS</button>
                    </div>
                </div>

                <div class="kb-tabs" style="display: flex; gap: var(--space-sm); margin-bottom: var(--space-md); overflow-x: auto; padding-bottom: 4px;">
                    <button class="tool-btn kb-tab-btn ${this.state.activeTab === 'favorites' ? 'tool-btn-primary' : ''}" data-tab="favorites">
                        ⭐ Favorites
                    </button>
                    ${Object.entries(this.data).map(([key, tab]) => `
                        <button class="tool-btn kb-tab-btn ${this.state.activeTab === key ? 'tool-btn-primary' : ''}" data-tab="${key}">
                            ${tab.title}
                        </button>
                    `).join('')}
                </div>

                <div class="tool-body kb-content-container">
                    ${this.renderContent()}
                </div>
            </div>
        `;

        this.bindEvents(container);
    },

    renderContent() {
        if (this.state.searchQuery.trim() !== '') {
            return this.renderSearchResults();
        }

        if (this.state.activeTab === 'favorites') {
            return this.renderFavorites();
        }

        const tabData = this.data[this.state.activeTab];
        if (!tabData) return '';

        return tabData.categories.map(category => `
            <div class="kb-category" style="margin-bottom: var(--space-lg);">
                <h3 style="margin-bottom: var(--space-sm); padding-bottom: var(--space-sm); border-bottom: 1px solid var(--border-color); color: var(--text-primary); font-size: var(--fs-base);">
                    ${category.name}
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-md);">
                    ${category.shortcuts.map(sc => this.renderShortcutCard(sc, this.state.activeTab)).join('')}
                </div>
            </div>
        `).join('');
    },
    
    renderSearchResults() {
        const query = this.state.searchQuery.toLowerCase();
        let results = [];
        
        Object.entries(this.data).forEach(([tabKey, tab]) => {
            tab.categories.forEach(category => {
                category.shortcuts.forEach(sc => {
                    const keys = this.state.os === 'mac' ? sc.mac : sc.win;
                    if (sc.action.toLowerCase().includes(query) || keys.toLowerCase().includes(query)) {
                        results.push({
                            ...sc,
                            tabTitle: tab.title,
                            tabKey: tabKey,
                            category: category.name
                        });
                    }
                });
            });
        });

        if (results.length === 0) {
            return `<div class="tool-info" style="text-align: center; padding: var(--space-lg);">Không tìm thấy phím tắt nào phù hợp với "${this.state.searchQuery}"</div>`;
        }

        return `
            <div style="margin-bottom: var(--space-sm); color: var(--text-secondary); font-size: var(--fs-sm);">
                Tìm thấy ${results.length} kết quả
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-md);">
                ${results.map(sc => this.renderShortcutCard(sc, sc.tabKey, true)).join('')}
            </div>
        `;
    },
    
    renderFavorites() {
        if (this.state.favorites.length === 0) {
            return `
                <div class="tool-info" style="text-align: center; padding: var(--space-lg);">
                    <p style="margin-bottom: var(--space-sm);">Bạn chưa có phím tắt yêu thích nào.</p>
                    <p style="color: var(--text-secondary); font-size: var(--fs-sm);">Nhấn vào biểu tượng ⭐ trên các phím tắt để lưu chúng vào đây.</p>
                </div>
            `;
        }

        const favShortcuts = this.state.favorites.map(favId => {
            let found = null;
            let foundTabTitle = '';
            
            for (const [tabKey, tab] of Object.entries(this.data)) {
                for (const cat of tab.categories) {
                    const sc = cat.shortcuts.find(s => this.getShortcutId(s, tabKey) === favId);
                    if (sc) {
                        found = sc;
                        foundTabTitle = tab.title;
                        break;
                    }
                }
                if (found) {
                    found.tabKey = tabKey;
                    found.tabTitle = foundTabTitle;
                    break;
                }
            }
            return found;
        }).filter(Boolean);

        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--space-md);">
                ${favShortcuts.map(sc => this.renderShortcutCard(sc, sc.tabKey, true)).join('')}
            </div>
        `;
    },

    getShortcutId(sc, tabKey) {
        return `${tabKey}_${sc.action.replace(/\s+/g, '_')}`;
    },

    formatKeyCombo(comboString) {
        const keys = comboString.split(/\s*\+\s*|\s+/);
        return keys.map(key => {
            if (key === '/') return '<span style="color: var(--text-muted); margin: 0 4px;">/</span>';
            return `<kbd class="kb-key">${key}</kbd>`;
        }).join('<span class="kb-plus">+</span>');
    },

    renderShortcutCard(sc, tabKey, showContext = false) {
        const id = this.getShortcutId(sc, tabKey);
        const isFav = this.state.favorites.includes(id);
        const keys = this.state.os === 'mac' ? sc.mac : sc.win;
        const formattedKeys = this.formatKeyCombo(keys);

        return `
            <div class="kb-card" style="background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm); transition: var(--transition-fast);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-sm);">
                    <div style="flex: 1;">
                        <div style="font-weight: 500; color: var(--text-primary); line-height: 1.4;">${sc.action}</div>
                        ${showContext ? `<div style="font-size: var(--fs-xs); color: var(--text-muted); margin-top: 4px;">${sc.tabTitle} ${sc.category ? '• ' + sc.category : ''}</div>` : ''}
                    </div>
                    <button class="kb-fav-btn" data-id="${id}" style="background: none; border: none; cursor: pointer; color: ${isFav ? 'var(--accent-warning)' : 'var(--text-muted)'}; font-size: 1.2em; padding: 4px; transition: var(--transition-fast); display: flex; align-items: center; justify-content: center;">
                        ${isFav ? '⭐' : '☆'}
                    </button>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: var(--space-sm);">
                    <div class="kb-keys-display" style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px;">
                        ${formattedKeys}
                    </div>
                    <button class="tool-btn-sm kb-copy-btn" data-keys="${keys}" title="Copy" style="padding: 4px 8px; font-size: var(--fs-xs);">
                        📋
                    </button>
                </div>
            </div>
        `;
    },

    bindEvents(container) {
        // Tab switching
        const tabBtns = container.querySelectorAll('.kb-tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.state.activeTab = e.target.dataset.tab;
                this.state.searchQuery = '';
                container.querySelector('.kb-search-input').value = '';
                this.updateContent(container);
            });
        });

        // OS switching
        const osBtns = container.querySelectorAll('.kb-os-btn');
        osBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.state.os = e.target.dataset.os;
                
                // Update UI visually without full re-render for os toggle buttons
                osBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'transparent';
                    b.style.color = '';
                });
                const target = e.target;
                target.classList.add('active');
                target.style.background = 'var(--bg-primary)';
                target.style.color = 'var(--accent-primary)';
                
                this.updateContent(container);
            });
        });

        // Search
        const searchInput = container.querySelector('.kb-search-input');
        searchInput.addEventListener('input', (e) => {
            this.state.searchQuery = e.target.value;
            this.updateContent(container);
        });

        // Delegate events for dynamically rendered content (Favorite & Copy)
        const contentContainer = container.querySelector('.kb-content-container');
        contentContainer.addEventListener('click', (e) => {
            const favBtn = e.target.closest('.kb-fav-btn');
            if (favBtn) {
                const id = favBtn.dataset.id;
                this.toggleFavorite(id);
                this.updateContent(container);
                return;
            }

            const copyBtn = e.target.closest('.kb-copy-btn');
            if (copyBtn) {
                const keys = copyBtn.dataset.keys;
                if (window.copyToClipboard) {
                    window.copyToClipboard(keys, copyBtn);
                } else {
                    navigator.clipboard.writeText(keys);
                    if (window.showToast) window.showToast('Copied to clipboard', 'success');
                }
            }
        });
    },

    updateContent(container) {
        // Update active tab button
        if (this.state.searchQuery.trim() === '') {
            container.querySelectorAll('.kb-tab-btn').forEach(btn => {
                if (btn.dataset.tab === this.state.activeTab) {
                    btn.classList.add('tool-btn-primary');
                } else {
                    btn.classList.remove('tool-btn-primary');
                }
            });
        }

        const contentContainer = container.querySelector('.kb-content-container');
        contentContainer.innerHTML = this.renderContent();
    },

    toggleFavorite(id) {
        const index = this.state.favorites.indexOf(id);
        if (index > -1) {
            this.state.favorites.splice(index, 1);
        } else {
            this.state.favorites.push(id);
        }
        localStorage.setItem('devToolsHub_kbFavorites', JSON.stringify(this.state.favorites));
    },

    injectStyles() {
        if (document.getElementById('kb-shortcuts-styles')) return;
        const style = document.createElement('style');
        style.id = 'kb-shortcuts-styles';
        style.textContent = `
            .kb-tabs::-webkit-scrollbar {
                height: 4px;
            }
            .kb-tabs::-webkit-scrollbar-thumb {
                background: var(--border-color);
                border-radius: 4px;
            }
            .kb-card:hover {
                border-color: var(--accent-primary);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .kb-key {
                display: inline-block;
                padding: 3px 6px;
                font-family: var(--font-mono);
                font-size: 11px;
                color: var(--text-primary);
                background-color: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                box-shadow: 0 1px 0 var(--border-color), 0 2px 0 rgba(0,0,0,0.1) inset;
                white-space: nowrap;
                margin: 0 2px;
            }
            .kb-plus {
                color: var(--text-muted);
                font-size: 12px;
                margin: 0 1px;
            }
            .kb-fav-btn:hover {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(KeyboardShortcuts);
