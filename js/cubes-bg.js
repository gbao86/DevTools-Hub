/**
 * Cubes Background - Vanilla JS port
 * Original: Can Tastemel (lambda.ai) → Vue Bits
 * Ported to vanilla JS for DevTools Hub
 */

(function () {
    'use strict';

    const DEFAULTS = {
        cubeSize: 70, // fixed pixel size per cube
        gap: 4, // gap between cubes in px
        maxAngle: 50,
        radius: 3,
        easing: 'power3.out',
        enterDur: 0.3,
        leaveDur: 0.6,
        borderStyle: '1px solid rgba(99, 102, 241, 0.12)',
        faceColor: 'rgba(10, 14, 23, 0.8)',
        rippleColor: 'rgba(99, 102, 241, 0.35)',
        rippleSpeed: 1.5,
        autoAnimate: true,
        rippleOnClick: true,
    };

    let scene = null;
    let rafId = null;
    let idleTimer = null;
    let userActive = false;
    let simPos = { x: 0, y: 0 };
    let simTarget = { x: 0, y: 0 };
    let simRAF = null;
    let gridCols = 0;
    let gridRows = 0;

    // --- Build the cube grid ---
    function buildGrid(container) {
        const { cubeSize, gap, borderStyle, faceColor } = DEFAULTS;
        
        gridCols = Math.ceil(window.innerWidth / (cubeSize + gap)) + 1;
        gridRows = Math.ceil(window.innerHeight / (cubeSize + gap)) + 1;

        // Wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'cubes-wrapper';
        wrapper.style.cssText = `
            position: absolute; inset: 0; z-index: 0;
            pointer-events: auto; overflow: hidden;
            display: flex; align-items: center; justify-content: center;
        `;

        // Scene (the grid)
        scene = document.createElement('div');
        scene.className = 'cubes-scene';
        scene.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${gridCols}, ${cubeSize}px);
            grid-template-rows: repeat(${gridRows}, ${cubeSize}px);
            width: 100vw; height: 100vh;
            column-gap: ${gap}px; row-gap: ${gap}px;
            justify-content: center; align-content: center;
            perspective: 1000px;
        `;

        // CSS variables on wrapper
        wrapper.style.setProperty('--cube-face-border', borderStyle);
        wrapper.style.setProperty('--cube-face-bg', faceColor);

        // Build cubes
        const faceTransforms = [
            'translateY(-50%) rotateX(90deg)',
            'translateY(50%) rotateX(-90deg)',
            'translateX(-50%) rotateY(-90deg)',
            'translateX(50%) rotateY(90deg)',
            'rotateY(-90deg) translateX(50%) rotateY(90deg)',
            'rotateY(90deg) translateX(-50%) rotateY(-90deg)',
        ];

        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                const cube = document.createElement('div');
                cube.className = 'cube';
                cube.dataset.row = r;
                cube.dataset.col = c;
                cube.style.cssText = `
                    position: relative; width: 100%; height: 100%;
                    aspect-ratio: 1; transform-style: preserve-3d;
                `;

                faceTransforms.forEach(tf => {
                    const face = document.createElement('div');
                    face.className = 'cube-face';
                    face.style.cssText = `
                        position: absolute; inset: 0;
                        background: var(--cube-face-bg);
                        border: var(--cube-face-border);
                        transform: ${tf};
                    `;
                    cube.appendChild(face);
                });

                scene.appendChild(cube);
            }
        }

        wrapper.appendChild(scene);
        container.appendChild(wrapper);
    }

    // --- Tilt cubes around a point ---
    function tiltAt(rowCenter, colCenter) {
        if (!scene || typeof gsap === 'undefined') return;
        const { radius, maxAngle, easing, enterDur, leaveDur } = DEFAULTS;

        scene.querySelectorAll('.cube').forEach(cube => {
            const r = +cube.dataset.row;
            const c = +cube.dataset.col;
            const dist = Math.hypot(r - rowCenter, c - colCenter);

            if (dist <= radius) {
                const pct = 1 - dist / radius;
                const angle = pct * maxAngle;
                gsap.to(cube, {
                    duration: enterDur,
                    ease: easing,
                    overwrite: true,
                    rotateX: -angle,
                    rotateY: angle,
                });
            } else {
                gsap.to(cube, {
                    duration: leaveDur,
                    ease: 'power3.out',
                    overwrite: true,
                    rotateX: 0,
                    rotateY: 0,
                });
            }
        });
    }

    // --- Mouse move handler ---
    function onPointerMove(e) {
        userActive = true;
        if (idleTimer) clearTimeout(idleTimer);

        const rect = scene.getBoundingClientRect();
        const { cubeSize, gap } = DEFAULTS;
        const colCenter = (e.clientX - rect.left) / (cubeSize + gap);
        const rowCenter = (e.clientY - rect.top) / (cubeSize + gap);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => tiltAt(rowCenter, colCenter));

        idleTimer = setTimeout(() => { userActive = false; }, 3000);
    }

    // --- Reset all cubes ---
    function resetAll() {
        if (!scene || typeof gsap === 'undefined') return;
        scene.querySelectorAll('.cube').forEach(cube => {
            gsap.to(cube, {
                duration: DEFAULTS.leaveDur,
                rotateX: 0, rotateY: 0,
                ease: 'power3.out',
            });
        });
    }

    // --- Ripple on click ---
    function onClick(e) {
        if (!DEFAULTS.rippleOnClick || !scene || typeof gsap === 'undefined') return;

        const rect = scene.getBoundingClientRect();
        const { rippleColor, faceColor, rippleSpeed, cubeSize, gap } = DEFAULTS;
        const colHit = Math.floor((e.clientX - rect.left) / (cubeSize + gap));
        const rowHit = Math.floor((e.clientY - rect.top) / (cubeSize + gap));

        const spreadDelay = 0.15 / rippleSpeed;
        const animDuration = 0.3 / rippleSpeed;
        const holdTime = 0.6 / rippleSpeed;

        const rings = {};
        scene.querySelectorAll('.cube').forEach(cube => {
            const r = +cube.dataset.row;
            const c = +cube.dataset.col;
            const ring = Math.round(Math.hypot(r - rowHit, c - colHit));
            if (!rings[ring]) rings[ring] = [];
            rings[ring].push(cube);
        });

        Object.keys(rings).map(Number).sort((a, b) => a - b).forEach(ring => {
            const delay = ring * spreadDelay;
            const faces = rings[ring].flatMap(cube =>
                Array.from(cube.querySelectorAll('.cube-face'))
            );

            gsap.to(faces, {
                backgroundColor: rippleColor,
                duration: animDuration,
                delay,
                ease: 'power3.out',
            });
            gsap.to(faces, {
                backgroundColor: faceColor,
                duration: animDuration,
                delay: delay + animDuration + holdTime,
                ease: 'power3.out',
            });
        });
    }

    // --- Auto-animate (idle simulation) ---
    function startAutoAnimate() {
        if (!DEFAULTS.autoAnimate) return;

        simPos = { x: Math.random() * gridCols, y: Math.random() * gridRows };
        simTarget = { x: Math.random() * gridCols, y: Math.random() * gridRows };

        const speed = 0.02;
        function loop() {
            if (!userActive) {
                simPos.x += (simTarget.x - simPos.x) * speed;
                simPos.y += (simTarget.y - simPos.y) * speed;
                tiltAt(simPos.y, simPos.x);

                if (Math.hypot(simPos.x - simTarget.x, simPos.y - simTarget.y) < 0.1) {
                    simTarget = {
                        x: Math.random() * gridCols,
                        y: Math.random() * gridRows,
                    };
                }
            }
            simRAF = requestAnimationFrame(loop);
        }
        simRAF = requestAnimationFrame(loop);
    }

    // --- Initialize ---
    function init() {
        const container = document.getElementById('cubes-container');
        if (!container) return;

        // Wait for GSAP to load
        if (typeof gsap === 'undefined') {
            console.warn('Cubes: GSAP not loaded, retrying...');
            setTimeout(init, 100);
            return;
        }

        buildGrid(container);

        scene.addEventListener('pointermove', onPointerMove, { passive: true });
        scene.addEventListener('pointerleave', resetAll);
        scene.addEventListener('click', onClick);

        startAutoAnimate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
