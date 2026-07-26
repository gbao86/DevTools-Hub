/**
 * DevTools Hub - Interactive Effects (Minimal & Clean)
 * Only subtle, interaction-driven effects. No background noise.
 */

(function () {
    'use strict';

    // --- Spotlight: subtle mouse glow on cards ---
    function initSpotlight() {
        const cards = document.querySelectorAll('.spotlight-card');
        cards.forEach(card => {
            if (card._spotlightBound) return;
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
            }, { passive: true });
            card._spotlightBound = true;
        });
    }

    // --- Stagger: fade children in one by one on first view ---
    function initStagger() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(entry.target.children).forEach((child, i) => {
                        child.style.setProperty('--stagger-delay', i);
                        // Small delay so the browser paints the initial state first
                        requestAnimationFrame(() => child.classList.add('visible'));
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });

        document.querySelectorAll('.stagger-in').forEach(el => observer.observe(el));
    }

    // --- Counter: animate numbers counting up ---
    window.animateCounter = function (element, target, duration = 1200) {
        let start = null;
        const from = parseInt(element.textContent) || 0;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            element.textContent = Math.floor(ease * (target - from) + from);
            if (progress < 1) requestAnimationFrame(step);
            else element.textContent = target;
        };
        requestAnimationFrame(step);
    };

    // --- Counter observer: trigger counters when stats scroll into view ---
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'));
                    if (!isNaN(target)) window.animateCounter(el, target);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(el => observer.observe(el));
    }

    // --- Init all effects ---
    function init() {
        initSpotlight();
        initStagger();
        initCounters();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-init spotlight when tools grid changes (dynamic rendering)
    const grid = document.getElementById('tools-grid');
    if (grid) {
        new MutationObserver(() => {
            clearTimeout(window._fxTimer);
            window._fxTimer = setTimeout(initSpotlight, 60);
        }).observe(grid, { childList: true });
    }
})();
