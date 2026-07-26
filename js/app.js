/* ============================================
   DevTools Hub - Main Application Controller
   ============================================ */

(function () {
    'use strict';

    // Category definitions for organizing tools
    const CATEGORIES = {
        'Encode / Decode': { icon: '🔄', order: 1 },
        'Formatter': { icon: '✨', order: 2 },
        'Generator': { icon: '⚙️', order: 3 },
        'Converter': { icon: '🔀', order: 4 },
        'Text': { icon: '📝', order: 5 },
        'Web': { icon: '🌐', order: 6 },
        'Tester': { icon: '🧪', order: 7 },
    };
    
    const ICONS = {
        '📋': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
        '🔐': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
        '🔗': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>',
        '🔑': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></svg>',
        '🧪': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H15"></path><path d="M10 9l-4.79 9.58c-.5.99-.07 2.42 1.09 2.42h11.4c1.16 0 1.59-1.43 1.09-2.42L14 9V3"></path><path d="M6 14h12"></path></svg>',
        '🎨': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.53-.21-1.04-.56-1.41-.32-.35-.77-.59-1.24-.59h-2.1c-1.1 0-2-.9-2-2 0-.28.05-.54.14-.78.22-.55.8-1.22 1.76-1.22h6c2.76 0 5-2.24 5-5 0-3.31-4.48-6-10-6z"></path><circle cx="6.5" cy="11.5" r="1.5"></circle><circle cx="10.5" cy="7.5" r="1.5"></circle><circle cx="14.5" cy="8.5" r="1.5"></circle></svg>',
        '📝': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line></svg>',
        '⏰': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
        '🎫': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><path d="M2 12h20"></path></svg>',
        '🔍': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
        '📖': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
        '🆔': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path></svg>',
        '🔢': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line></svg>',
        '📐': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3l-2.6-2.6a2 2 0 0 0-2.8 0l-5.6 5.6a2 2 0 0 0 0 2.8l2.6 2.6a2 2 0 0 0 2.8 0l5.6-5.6a2 2 0 0 0 0-2.8z"></path><path d="M14.5 18.5l-2.8-2.8"></path><path d="M10.7 2.7l2.6 2.6a2 2 0 0 1 0 2.8l-5.6 5.6a2 2 0 0 1-2.8 0l-2.6-2.6a2 2 0 0 1 0-2.8l5.6-5.6a2 2 0 0 1 2.8 0z"></path></svg>',
        '🔄': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>',
        '✨': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
        '⚙️': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
        '🔀': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"></path><path d="M4 20L21 3"></path><path d="M21 16v5h-5"></path><path d="M15 15l6 6"></path><path d="M4 4l5 5"></path></svg>',
        '🌐': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
        '📁': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
        '🏠': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
        '✅': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        '❌': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        'ℹ️': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
        '⚠️': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        'default': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    function getIcon(emoji) {
        return ICONS[emoji] || ICONS['default'];
    }

    // All registered tools
    const tools = window.DevTools || [];

    // DOM elements
    const sidebarNav = document.getElementById('sidebar-nav');
    const toolsGrid = document.getElementById('tools-grid');
    const searchInput = document.getElementById('search-input');
    const welcomeScreen = document.getElementById('welcome-screen');
    const toolContainer = document.getElementById('tool-container');
    const toolContent = document.getElementById('tool-content');
    const toolBreadcrumb = document.getElementById('tool-breadcrumb');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const themeToggleBtn = document.getElementById('theme-toggle');

    let activeTool = null;

    // --- Initialization ---
    function init() {
        renderSidebar();
        renderToolsGrid();
        bindEvents();
        handleRoute();
    }

    // --- Render Sidebar Navigation ---
    function renderSidebar() {
        // Group tools by category
        const grouped = {};
        tools.forEach(tool => {
            const cat = tool.category || 'Other';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(tool);
        });

        // Sort categories by order
        const sortedCategories = Object.keys(grouped).sort((a, b) => {
            const orderA = (CATEGORIES[a] && CATEGORIES[a].order) || 99;
            const orderB = (CATEGORIES[b] && CATEGORIES[b].order) || 99;
            return orderA - orderB;
        });

        let html = '';
        sortedCategories.forEach(cat => {
            const catInfo = CATEGORIES[cat] || { icon: '📁' };
            html += `
                <div class="nav-category">
                    <div class="nav-category-title"><span class="cat-icon">${getIcon(catInfo.icon)}</span> ${cat}</div>
                </div>
            `;
            grouped[cat].forEach(tool => {
                const slug = toSlug(tool.name);
                html += `
                    <div class="nav-item" data-tool="${slug}" title="${tool.name}">
                        <span class="nav-item-icon">${getIcon(tool.icon)}</span>
                        <span class="nav-item-name">${tool.name}</span>
                    </div>
                `;
            });
        });

        sidebarNav.innerHTML = html;
    }

    // --- Render Tools Grid on Welcome Page ---
    function renderToolsGrid() {
        let html = '';
        tools.forEach(tool => {
            const slug = toSlug(tool.name);
            html += `
                <div class="tool-card spotlight-card card-shine" data-tool="${slug}">
                    <div class="tool-card-icon">${getIcon(tool.icon)}</div>
                    <div class="tool-card-title">${tool.name}</div>
                    <div class="tool-card-desc">${tool.description || ''}</div>
                    <span class="tool-card-category">${tool.category || 'Other'}</span>
                </div>
            `;
        });
        toolsGrid.innerHTML = html;
    }

    // --- Bind Events ---
    function bindEvents() {
        // Tool navigation (sidebar)
        sidebarNav.addEventListener('click', (e) => {
            const item = e.target.closest('.nav-item');
            if (item) {
                const slug = item.dataset.tool;
                navigateToTool(slug);
            }
        });

        // Tool navigation (grid cards)
        toolsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.tool-card');
            if (card) {
                const slug = card.dataset.tool;
                navigateToTool(slug);
            }
        });

        // Search
        searchInput.addEventListener('input', (e) => {
            filterTools(e.target.value.trim().toLowerCase());
        });

        // Theme Toggle
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                if (newTheme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'dark');
                }
            });
        }

        // Keyboard shortcut Ctrl+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
            // Escape to go back to home
            if (e.key === 'Escape') {
                if (document.activeElement === searchInput) {
                    searchInput.blur();
                    searchInput.value = '';
                    filterTools('');
                } else if (activeTool) {
                    navigateHome();
                }
            }
        });

        // Mobile sidebar toggle
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                sidebarOverlay.classList.toggle('active');
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                sidebarOverlay.classList.remove('active');
            });
        }

        // Hash change
        window.addEventListener('hashchange', handleRoute);
    }

    // --- Filter Tools (Search) ---
    function filterTools(query) {
        const navItems = sidebarNav.querySelectorAll('.nav-item');
        const gridCards = toolsGrid.querySelectorAll('.tool-card');

        navItems.forEach(item => {
            const name = item.querySelector('.nav-item-name').textContent.toLowerCase();
            item.classList.toggle('hidden', query && !name.includes(query));
        });

        gridCards.forEach(card => {
            const name = card.querySelector('.tool-card-title').textContent.toLowerCase();
            const desc = card.querySelector('.tool-card-desc').textContent.toLowerCase();
            const match = !query || name.includes(query) || desc.includes(query);
            card.style.display = match ? '' : 'none';
        });

        // Show/hide category headers if all their tools are hidden
        const categories = sidebarNav.querySelectorAll('.nav-category');
        categories.forEach(cat => {
            let nextEl = cat.nextElementSibling;
            let hasVisible = false;
            while (nextEl && nextEl.classList.contains('nav-item')) {
                if (!nextEl.classList.contains('hidden')) hasVisible = true;
                nextEl = nextEl.nextElementSibling;
            }
            cat.style.display = hasVisible ? '' : 'none';
        });
    }

    // --- Navigate to a Tool ---
    function navigateToTool(slug) {
        window.location.hash = slug;
    }

    function navigateHome() {
        window.location.hash = '';
    }

    // --- Handle URL Route ---
    function handleRoute() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const tool = tools.find(t => toSlug(t.name) === hash);
            if (tool) {
                showTool(tool);
                return;
            }
        }
        showWelcome();
    }

    // --- Show Welcome Screen ---
    function showWelcome() {
        activeTool = null;
        welcomeScreen.style.display = '';
        toolContainer.style.display = 'none';

        // Remove active state from sidebar
        sidebarNav.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        document.title = 'DevTools Hub - Công cụ Dev miễn phí';
    }

    // --- Show a Tool ---
    function showTool(tool) {
        activeTool = tool;
        const slug = toSlug(tool.name);

        // Update UI
        welcomeScreen.style.display = 'none';
        toolContainer.style.display = '';

        // Breadcrumb
        toolBreadcrumb.innerHTML = `
            <a onclick="window.location.hash=''" class="breadcrumb-home">${getIcon('🏠')} Trang chủ</a>
            <span class="separator">/</span>
            <span class="current"><span class="breadcrumb-icon">${getIcon(tool.icon)}</span> ${tool.name}</span>
        `;

        // Render tool
        toolContent.innerHTML = '';
        toolContent.classList.add('scale-in');
        try {
            tool.render(toolContent);
        } catch (err) {
            toolContent.innerHTML = `
                <div class="tool-info" style="color: var(--accent-danger);">
                    ❌ Lỗi khi tải công cụ: ${err.message}
                </div>
            `;
            console.error('Tool render error:', err);
        }

        // Update active state in sidebar
        sidebarNav.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tool === slug);
        });

        // Close mobile sidebar
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');

        // Update title
        document.title = `${tool.name} - DevTools Hub`;

        // Scroll to top
        window.scrollTo(0, 0);
    }

    // --- Utility: Create slug from name ---
    function toSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    // --- Global utility: Show toast notification ---
    window.showToast = function (message, type = 'info') {
        const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span class="toast-icon">${getIcon(icons[type] || icons.info)}</span> ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // --- Global utility: Copy to clipboard ---
    window.copyToClipboard = function (text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            if (btn) {
                const original = btn.innerHTML;
                btn.innerHTML = getIcon('✅');
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.classList.remove('copied');
                }, 1500);
            }
            showToast('Đã copy vào clipboard!', 'success');
        }).catch(() => {
            showToast('Không thể copy. Hãy copy thủ công.', 'error');
        });
    };

    // --- Initialize when DOM is ready ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
