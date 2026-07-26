/**
 * D:\App\DevTools-Hub\js\effects.js
 * Interactive UI effects for DevTools Hub
 */

(function() {
    'use strict';

    // 1. Cursor Spotlight
    function initSpotlightCards() {
        const handleMouseMove = (e, card) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Use requestAnimationFrame for smooth CSS variable updates
            requestAnimationFrame(() => {
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        };

        const cards = document.querySelectorAll('.spotlight-card');
        cards.forEach(card => {
            // Remove old listener if re-initing
            card.removeEventListener('mousemove', card._spotlightListener);
            
            const listener = (e) => handleMouseMove(e, card);
            card.addEventListener('mousemove', listener, { passive: true });
            card._spotlightListener = listener; // Store reference for cleanup
        });
    }

    // 2. Card Tilt Effect
    function initTiltEffect() {
        const cards = document.querySelectorAll('.tool-card');
        const maxTilt = 8; // degrees

        const handleMouseMove = (e, card) => {
            const rect = card.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const centerX = rect.left + width / 2;
            const centerY = rect.top + height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const rotateX = (mouseY / (height / 2)) * -maxTilt;
            const rotateY = (mouseX / (width / 2)) * maxTilt;

            requestAnimationFrame(() => {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'transform 0.1s ease-out';
            });
        };

        const handleMouseLeave = (card) => {
            requestAnimationFrame(() => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            });
        };

        cards.forEach(card => {
            card.removeEventListener('mousemove', card._tiltMoveListener);
            card.removeEventListener('mouseleave', card._tiltLeaveListener);

            const moveListener = (e) => handleMouseMove(e, card);
            const leaveListener = () => handleMouseLeave(card);

            card.addEventListener('mousemove', moveListener, { passive: true });
            card.addEventListener('mouseleave', leaveListener, { passive: true });
            
            card._tiltMoveListener = moveListener;
            card._tiltLeaveListener = leaveListener;
        });
    }

    // 3. Stagger Animation Observer
    function initStaggerObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const parent = entry.target;
                    const children = Array.from(parent.children);
                    
                    children.forEach((child, index) => {
                        child.style.setProperty('--stagger-delay', index);
                        child.classList.add('visible');
                    });
                    
                    observer.unobserve(parent); // Only animate once
                }
            });
        }, observerOptions);

        const staggerParents = document.querySelectorAll('.stagger-in');
        staggerParents.forEach(parent => {
            observer.observe(parent);
        });
    }

    // 4. Button Ripple Effect
    function initRippleEffect() {
        const handleRipple = (e) => {
            const button = e.currentTarget;
            
            const circle = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            
            const rect = button.getBoundingClientRect();
            
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');
            
            // Remove existing ripples
            const existingRipple = button.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }
            
            button.appendChild(circle);
            
            // Clean up after animation
            setTimeout(() => {
                circle.remove();
            }, 600);
        };

        const buttons = document.querySelectorAll('.tool-btn, .tool-card, .ripple-effect');
        buttons.forEach(btn => {
            // Ensure button has proper styling for ripple
            if (getComputedStyle(btn).position === 'static') {
                btn.style.position = 'relative';
            }
            btn.style.overflow = 'hidden';
            
            btn.removeEventListener('click', btn._rippleListener);
            const listener = handleRipple;
            btn.addEventListener('click', listener);
            btn._rippleListener = listener;
        });
    }

    // 5. Smooth Counter Animation
    window.animateCounter = function(element, target, duration = 2000) {
        let startTimestamp = null;
        const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Ease out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeOutProgress * (target - startValue) + startValue);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(step);
    };

    // 6. Parallax Floating Particles
    function initParticles() {
        const heroSection = document.querySelector('.hero') || document.body;
        
        let container = document.getElementById('particle-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'particle-container';
            
            // Insert at beginning of hero section or body
            if (heroSection === document.body) {
                document.body.insertBefore(container, document.body.firstChild);
            } else {
                heroSection.style.position = heroSection.style.position || 'relative';
                heroSection.insertBefore(container, heroSection.firstChild);
            }
        } else {
            container.innerHTML = ''; // Clear existing
        }

        const particleCount = 20;
        const colors = [
            'rgba(99, 102, 241, 0.3)', // indigo
            'rgba(6, 182, 212, 0.3)',  // cyan
            'rgba(139, 92, 246, 0.3)'  // purple
        ];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 4 + 2; // 2px to 6px
            const left = Math.random() * 100; // 0% to 100%
            const top = Math.random() * 100;
            const animationDuration = Math.random() * 15 + 15; // 15s to 30s
            const delay = Math.random() * 15;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const opacity = Math.random() * 0.4 + 0.1;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            particle.style.backgroundColor = color;
            particle.style.animationDuration = `${animationDuration}s`;
            particle.style.animationDelay = `-${delay}s`; // start at different points in animation
            particle.style.setProperty('--particle-opacity', opacity);
            
            container.appendChild(particle);
        }
    }

    // 7. Auto-init and Mutation Observer
    function initAllEffects() {
        initSpotlightCards();
        initTiltEffect();
        initStaggerObserver();
        initRippleEffect();
    }

    document.addEventListener('DOMContentLoaded', () => {
        initAllEffects();
        initParticles();
        
        // Setup MutationObserver to watch for dynamically added tools
        const toolsGrid = document.getElementById('tools-grid');
        if (toolsGrid) {
            const observer = new MutationObserver((mutations) => {
                let shouldReinit = false;
                for (let mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        shouldReinit = true;
                        break;
                    }
                }
                
                if (shouldReinit) {
                    // Debounce re-init slightly
                    clearTimeout(window._reinitTimeout);
                    window._reinitTimeout = setTimeout(() => {
                        initAllEffects();
                    }, 50);
                }
            });
            
            observer.observe(toolsGrid, { childList: true, subtree: true });
        }
    });

    // Make available globally if needed to trigger manually
    window.DevToolsEffects = {
        init: initAllEffects,
        initParticles: initParticles
    };

})();
