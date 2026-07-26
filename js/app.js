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
                    <div class="nav-category-title">${catInfo.icon} ${cat}</div>
                </div>
            `;
            grouped[cat].forEach(tool => {
                const slug = toSlug(tool.name);
                html += `
                    <div class="nav-item" data-tool="${slug}" title="${tool.name}">
                        <span class="nav-item-icon">${tool.icon}</span>
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
                <div class="tool-card" data-tool="${slug}">
                    <span class="tool-card-icon">${tool.icon}</span>
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
            <a onclick="window.location.hash=''">🏠 Trang chủ</a>
            <span class="separator">›</span>
            <span class="current">${tool.icon} ${tool.name}</span>
        `;

        // Render tool
        toolContent.innerHTML = '';
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
        toast.innerHTML = `<span>${icons[type] || icons.info}</span> ${message}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // --- Global utility: Copy to clipboard ---
    window.copyToClipboard = function (text, btn) {
        navigator.clipboard.writeText(text).then(() => {
            if (btn) {
                const original = btn.textContent;
                btn.textContent = '✅';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = original;
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
