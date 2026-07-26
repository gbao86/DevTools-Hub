/**
 * DevTools Hub - UUID Generator Tool
 * Generate random UUID v4 with customization & interactive features (100% Client-Side)
 */

const UUIDGenerator = {
    name: 'UUID Generator',
    icon: '🆔',
    category: 'Generator',
    description: 'Tạo UUID v4 ngẫu nhiên',

    /**
     * Generate single UUID v4
     * Uses crypto.randomUUID() when available with high performance fallback
     * @returns {string} canonical UUID v4 string (lowercase with dashes)
     */
    generateUUIDv4() {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            try {
                return crypto.randomUUID();
            } catch (e) {
                // Fallback below if restricted environment
            }
        }

        // Crypto getRandomValues fallback (RFC 4122 v4)
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const bytes = new Uint8Array(16);
            crypto.getRandomValues(bytes);
            bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
            bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10xx
            const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
            return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
        }

        // Pure Math.random fallback
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    },

    /**
     * Format a UUID string according to user preferences
     * @param {string} uuid - Raw canonical UUID
     * @param {boolean} uppercase - Convert to UPPERCASE
     * @param {boolean} noDashes - Remove dashes
     * @returns {string} Formatted UUID
     */
    formatUUID(uuid, uppercase, noDashes) {
        let result = uuid;
        if (noDashes) {
            result = result.replace(/-/g, '');
        }
        if (uppercase) {
            result = result.toUpperCase();
        } else {
            result = result.toLowerCase();
        }
        return result;
    },

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🆔 UUID Generator</h2>
                    <p class="tool-description">Tạo UUID v4 ngẫu nhiên</p>
                </div>
                <div class="tool-body">
                    <div class="tool-row" style="flex-wrap: wrap; align-items: flex-end; gap: var(--space-md);">
                        <div class="tool-group">
                            <label class="tool-label">Số lượng (Amount)</label>
                            <div class="tool-inline" style="gap: 8px;">
                                <select class="tool-select" id="uuid-amount-select">
                                    <option value="1">1 UUID</option>
                                    <option value="5">5 UUIDs</option>
                                    <option value="10" selected>10 UUIDs</option>
                                    <option value="50">50 UUIDs</option>
                                    <option value="100">100 UUIDs</option>
                                    <option value="custom">Tùy chỉnh...</option>
                                </select>
                                <input type="number" class="tool-number" id="uuid-amount-custom" min="1" max="500" value="10" style="display: none;" title="Nhập số lượng (1-500)">
                            </div>
                        </div>

                        <div class="tool-group">
                            <label class="tool-label">Định dạng (Format)</label>
                            <div class="tool-inline" style="gap: var(--space-md); padding-top: 6px;">
                                <label class="tool-checkbox">
                                    <input type="checkbox" id="uuid-uppercase"> IN HOA (Uppercase)
                                </label>
                                <label class="tool-checkbox">
                                    <input type="checkbox" id="uuid-nodashes"> Bỏ dấu gạch ngang (No dashes)
                                </label>
                            </div>
                        </div>

                        <div class="tool-actions">
                            <button class="tool-btn tool-btn-primary" id="btn-generate-uuid">⚡ Tạo mới (Generate)</button>
                        </div>
                    </div>

                    <div class="tool-stats">
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="uuid-stat-count">0</div>
                            <div class="tool-stat-label">Số UUID</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="uuid-stat-version">v4</div>
                            <div class="tool-stat-label">Phiên bản</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="uuid-stat-format">lowercase</div>
                            <div class="tool-stat-label">Định dạng</div>
                        </div>
                    </div>

                    <div class="tool-group">
                        <div class="tool-inline" style="justify-content: space-between;">
                            <label class="tool-label">Kết quả (Textarea - Một UUID mỗi dòng)</label>
                            <button class="tool-btn tool-btn-sm" id="btn-copy-all-uuid">📋 Copy Tất Cả</button>
                        </div>
                        <div class="tool-result">
                            <textarea class="tool-textarea" id="uuid-output-textarea" readonly style="min-height: 140px; font-size: 14px;" placeholder="UUIDs sẽ xuất hiện ở đây..."></textarea>
                        </div>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Danh sách UUID (Click vào từng dòng để copy nhanh)</label>
                        <div id="uuid-items-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; padding-right: 4px;"></div>
                    </div>
                </div>
            </div>
        `;

        // DOM elements
        const amountSelect = container.querySelector('#uuid-amount-select');
        const amountCustom = container.querySelector('#uuid-amount-custom');
        const uppercaseCb = container.querySelector('#uuid-uppercase');
        const noDashesCb = container.querySelector('#uuid-nodashes');
        const btnGenerate = container.querySelector('#btn-generate-uuid');
        const btnCopyAll = container.querySelector('#btn-copy-all-uuid');
        const outputTextarea = container.querySelector('#uuid-output-textarea');
        const itemsList = container.querySelector('#uuid-items-list');

        const statCount = container.querySelector('#uuid-stat-count');
        const statFormat = container.querySelector('#uuid-stat-format');

        // Toggle custom amount input display
        amountSelect.addEventListener('change', () => {
            if (amountSelect.value === 'custom') {
                amountCustom.style.display = 'inline-block';
                amountCustom.focus();
            } else {
                amountCustom.style.display = 'none';
            }
            generate();
        });

        amountCustom.addEventListener('input', () => {
            generate();
        });

        uppercaseCb.addEventListener('change', () => generate());
        noDashesCb.addEventListener('change', () => generate());

        btnGenerate.addEventListener('click', () => {
            generate(true); // pass true for generate animation
        });

        btnCopyAll.addEventListener('click', () => {
            const text = outputTextarea.value;
            if (!text) return;
            if (typeof window.copyToClipboard === 'function') {
                window.copyToClipboard(text, btnCopyAll);
            } else {
                navigator.clipboard.writeText(text);
            }
        });

        // Main generate function
        const generate = (animate = false) => {
            let amount = 10;
            if (amountSelect.value === 'custom') {
                amount = parseInt(amountCustom.value, 10) || 1;
            } else {
                amount = parseInt(amountSelect.value, 10) || 10;
            }
            amount = Math.max(1, Math.min(500, amount));

            const isUppercase = uppercaseCb.checked;
            const isNoDashes = noDashesCb.checked;

            const uuids = [];
            for (let i = 0; i < amount; i++) {
                const raw = this.generateUUIDv4();
                const formatted = this.formatUUID(raw, isUppercase, isNoDashes);
                uuids.push(formatted);
            }

            // Update output textarea
            outputTextarea.value = uuids.join('\n');

            // Update stats
            statCount.textContent = amount;
            let formatText = isUppercase ? 'UPPERCASE' : 'lowercase';
            if (isNoDashes) formatText += ' (no dashes)';
            statFormat.textContent = formatText;

            // Render interactive list of clickable UUIDs with animation
            itemsList.innerHTML = '';
            uuids.forEach((uuid, idx) => {
                const item = document.createElement('div');
                item.className = 'uuid-item';
                item.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    padding: 8px 14px;
                    border-radius: var(--radius-sm);
                    font-family: var(--font-mono);
                    font-size: 14px;
                    color: var(--text-primary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    ${animate ? `animation: uuidSlideIn 0.2s ease forwards ${Math.min(idx * 0.02, 0.4)}s; opacity: 0; transform: translateY(6px);` : ''}
                `;

                item.innerHTML = `
                    <span class="uuid-text">${uuid}</span>
                    <span class="uuid-copy-badge tool-badge" style="background: var(--bg-tertiary); color: var(--text-secondary); pointer-events: none;">📋 Copy</span>
                `;

                // Item hover effects
                item.addEventListener('mouseenter', () => {
                    item.style.borderColor = 'var(--accent-primary)';
                    item.style.background = 'var(--bg-card-hover)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.borderColor = 'var(--border-color)';
                    item.style.background = 'var(--bg-card)';
                });

                // Click to copy individual UUID
                item.addEventListener('click', () => {
                    const badge = item.querySelector('.uuid-copy-badge');
                    navigator.clipboard.writeText(uuid).then(() => {
                        badge.textContent = '✅ Copied!';
                        badge.style.background = 'var(--accent-success)';
                        badge.style.color = '#ffffff';
                        if (typeof window.showToast === 'function') {
                            window.showToast(`Đã copy: ${uuid.slice(0, 8)}...`, 'success');
                        }
                        setTimeout(() => {
                            badge.textContent = '📋 Copy';
                            badge.style.background = 'var(--bg-tertiary)';
                            badge.style.color = 'var(--text-secondary)';
                        }, 1500);
                    }).catch(() => {
                        if (typeof window.showToast === 'function') {
                            window.showToast('Lỗi khi copy!', 'error');
                        }
                    });
                });

                itemsList.appendChild(item);
            });

            // Inject animation keyframes if not present
            if (!document.getElementById('uuid-animation-styles')) {
                const style = document.createElement('style');
                style.id = 'uuid-animation-styles';
                style.textContent = `
                    @keyframes uuidSlideIn {
                        to { opacity: 1; transform: translateY(0); }
                    }
                `;
                document.head.appendChild(style);
            }
        };

        // Initial generation
        generate(true);
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(UUIDGenerator);
