/* ============================================
   DevTools Hub - Timestamp Converter
   ============================================ */

const TimestampConverter = {
    name: 'Timestamp Converter',
    icon: '⏰',
    category: 'Converter',
    description: 'Chuyển đổi Unix timestamp sang ngày tháng và ngược lại',

    // Helper: Parse raw user input (seconds or milliseconds or date string) into a Date object
    parseTimestampInput(str) {
        if (!str || typeof str !== 'string' || !str.trim()) return null;
        const trimmed = str.trim();

        // If pure numeric string
        if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
            const num = parseFloat(trimmed);
            if (isNaN(num)) return null;
            // If absolute value > 1e11 (or length >= 13 digits), treat as milliseconds
            if (Math.abs(num) > 1e11) {
                return new Date(num);
            } else {
                return new Date(num * 1000);
            }
        }

        // Try standard Date parsing for strings like ISO or RFC dates
        const date = new Date(trimmed);
        if (!isNaN(date.getTime())) return date;

        return null;
    },

    // Helper: Format Date to ISO string YYYY-MM-DDTHH:mm:ss for datetime-local input
    toDatetimeLocalString(date) {
        if (!date || isNaN(date.getTime())) return '';
        const pad = (n) => String(n).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    },

    // Helper: Format Local date display string
    formatLocalTime(date) {
        if (!date || isNaN(date.getTime())) return '-';
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
        const formatted = date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        return `${formatted} (${tz})`;
    },

    // Helper: Format Relative Time
    formatRelativeTime(date) {
        if (!date || isNaN(date.getTime())) return '-';
        const now = Date.now();
        const targetMs = date.getTime();
        const diffMs = targetMs - now;
        const diffSec = Math.round(diffMs / 1000);
        const absSec = Math.abs(diffSec);

        if (absSec < 3) return 'Vừa xong (ngay bây giờ)';

        const isFuture = diffSec > 0;
        const prefix = isFuture ? 'Sau ' : '';
        const suffix = isFuture ? '' : ' trước';

        const minute = 60;
        const hour = minute * 60;
        const day = hour * 24;
        const month = day * 30.4375;
        const year = day * 365.25;

        let text = '';
        if (absSec < minute) {
            text = `${absSec} giây`;
        } else if (absSec < hour) {
            const m = Math.floor(absSec / minute);
            text = `${m} phút`;
        } else if (absSec < day) {
            const h = Math.floor(absSec / hour);
            text = `${h} giờ`;
        } else if (absSec < month) {
            const d = Math.floor(absSec / day);
            text = `${d} ngày`;
        } else if (absSec < year) {
            const mo = Math.floor(absSec / month);
            text = `${mo} tháng`;
        } else {
            const y = Math.floor(absSec / year);
            text = `${y} năm`;
        }

        return isFuture ? `${prefix}${text}` : `${text}${suffix}`;
    },

    render(container) {
        // Clear any prior running interval timer for live update
        if (container._tsTimer) {
            clearInterval(container._tsTimer);
            container._tsTimer = null;
        }

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>⏰ Timestamp Converter</h2>
                    <p class="tool-description">Chuyển đổi Unix timestamp sang ngày tháng và ngược lại</p>
                </div>
                <div class="tool-body">
                    <!-- Live current timestamp -->
                    <div class="tool-group" style="background: var(--bg-card); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--radius-sm);">
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                            <div>
                                <span class="tool-label" style="font-size: var(--fs-sm); font-weight: 600;">⚡ Unix Timestamp Hiện Tại:</span>
                                <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 4px;">
                                    <span style="font-family: var(--font-mono); font-weight: 700; font-size: 1.4rem; color: var(--accent-primary-hover);" id="ts-live-sec">0</span>
                                    <span style="font-size: var(--fs-xs); color: var(--text-tertiary);">(giây) /</span>
                                    <span style="font-family: var(--font-mono); font-weight: 600; font-size: 1rem; color: var(--accent-secondary);" id="ts-live-ms">0</span>
                                    <span style="font-size: var(--fs-xs); color: var(--text-tertiary);">(ms)</span>
                                </div>
                            </div>
                            <div class="tool-actions">
                                <button class="tool-btn tool-btn-sm" id="ts-btn-copy-live-sec" title="Copy Timestamp Giây">📋 Copy (Giây)</button>
                                <button class="tool-btn tool-btn-sm" id="ts-btn-copy-live-ms" title="Copy Timestamp MS">📋 Copy (MS)</button>
                            </div>
                        </div>
                    </div>

                    <!-- Section 1: Timestamp Input -> Date Formats -->
                    <div class="tool-group" style="margin-top: 8px;">
                        <label class="tool-label" for="ts-input">Unix Timestamp ➔ Ngày tháng</label>
                        <div class="tool-row" style="align-items: center; flex-wrap: wrap; gap: 12px;">
                            <div style="flex: 1; min-width: 250px;">
                                <input type="text" class="tool-input" id="ts-input" placeholder="Nhập Unix timestamp (VD: 1785050839)..." style="font-family: var(--font-mono);">
                            </div>
                            <div class="tool-actions" style="margin: 0;">
                                <button class="tool-btn tool-btn-sm" id="ts-quick-now">Bây giờ</button>
                                <button class="tool-btn tool-btn-sm" id="ts-quick-start-today">Đầu hôm nay</button>
                                <button class="tool-btn tool-btn-sm" id="ts-quick-end-today">Cuối hôm nay</button>
                                <button class="tool-btn tool-btn-sm" id="ts-quick-start-year">Đầu năm</button>
                            </div>
                        </div>

                        <!-- Results list -->
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
                            <!-- Local -->
                            <div class="tool-inline" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-input); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
                                <span style="min-width: 150px; font-weight: 500; font-size: var(--fs-sm); color: var(--text-secondary);">Giờ địa phương:</span>
                                <span style="flex: 1; font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-primary); word-break: break-all;" id="ts-out-local">-</span>
                                <button class="tool-btn tool-btn-sm ts-copy-btn" data-target="ts-out-local">📋 Copy</button>
                            </div>

                            <!-- UTC -->
                            <div class="tool-inline" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-input); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
                                <span style="min-width: 150px; font-weight: 500; font-size: var(--fs-sm); color: var(--text-secondary);">Giờ UTC:</span>
                                <span style="flex: 1; font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-primary); word-break: break-all;" id="ts-out-utc">-</span>
                                <button class="tool-btn tool-btn-sm ts-copy-btn" data-target="ts-out-utc">📋 Copy</button>
                            </div>

                            <!-- ISO 8601 -->
                            <div class="tool-inline" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-input); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
                                <span style="min-width: 150px; font-weight: 500; font-size: var(--fs-sm); color: var(--text-secondary);">ISO 8601:</span>
                                <span style="flex: 1; font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--text-primary); word-break: break-all;" id="ts-out-iso">-</span>
                                <button class="tool-btn tool-btn-sm ts-copy-btn" data-target="ts-out-iso">📋 Copy</button>
                            </div>

                            <!-- Relative -->
                            <div class="tool-inline" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-input); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
                                <span style="min-width: 150px; font-weight: 500; font-size: var(--fs-sm); color: var(--text-secondary);">Thời gian tương đối:</span>
                                <span style="flex: 1; font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--accent-primary-hover); word-break: break-all;" id="ts-out-relative">-</span>
                                <button class="tool-btn tool-btn-sm ts-copy-btn" data-target="ts-out-relative">📋 Copy</button>
                            </div>
                        </div>
                    </div>

                    <div style="border-top: 1px solid var(--border-color); margin: 8px 0;"></div>

                    <!-- Section 2: Date Picker -> Unix Timestamp -->
                    <div class="tool-group">
                        <label class="tool-label" for="ts-picker">Chọn Ngày & Giờ ➔ Unix Timestamp</label>
                        <div class="tool-row" style="align-items: center; flex-wrap: wrap; gap: 12px;">
                            <div style="flex: 1; min-width: 250px;">
                                <input type="datetime-local" class="tool-input" id="ts-picker" step="1">
                            </div>
                        </div>

                        <!-- Timestamp outputs -->
                        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
                            <!-- Timestamp Seconds -->
                            <div class="tool-inline" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-input); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
                                <span style="min-width: 150px; font-weight: 500; font-size: var(--fs-sm); color: var(--text-secondary);">Timestamp (Giây):</span>
                                <span style="flex: 1; font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--accent-primary-hover); word-break: break-all;" id="ts-out-sec">-</span>
                                <button class="tool-btn tool-btn-sm ts-copy-btn" data-target="ts-out-sec">📋 Copy</button>
                            </div>

                            <!-- Timestamp Milliseconds -->
                            <div class="tool-inline" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-input); padding: 10px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-color); flex-wrap: wrap; gap: 8px;">
                                <span style="min-width: 150px; font-weight: 500; font-size: var(--fs-sm); color: var(--text-secondary);">Timestamp (Millisecond):</span>
                                <span style="flex: 1; font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--accent-secondary); word-break: break-all;" id="ts-out-ms">-</span>
                                <button class="tool-btn tool-btn-sm ts-copy-btn" data-target="ts-out-ms">📋 Copy</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // DOM elements
        const liveSecEl = container.querySelector('#ts-live-sec');
        const liveMsEl = container.querySelector('#ts-live-ms');
        const copyLiveSecBtn = container.querySelector('#ts-btn-copy-live-sec');
        const copyLiveMsBtn = container.querySelector('#ts-btn-copy-live-ms');

        const inputTs = container.querySelector('#ts-input');
        const pickerInput = container.querySelector('#ts-picker');

        const outLocal = container.querySelector('#ts-out-local');
        const outUtc = container.querySelector('#ts-out-utc');
        const outIso = container.querySelector('#ts-out-iso');
        const outRelative = container.querySelector('#ts-out-relative');

        const outSec = container.querySelector('#ts-out-sec');
        const outMs = container.querySelector('#ts-out-ms');

        const quickNow = container.querySelector('#ts-quick-now');
        const quickStartToday = container.querySelector('#ts-quick-start-today');
        const quickEndToday = container.querySelector('#ts-quick-end-today');
        const quickStartYear = container.querySelector('#ts-quick-start-year');

        // 1. Live Ticker Functionality
        const updateLiveTimer = () => {
            const now = Date.now();
            liveSecEl.textContent = Math.floor(now / 1000);
            liveMsEl.textContent = now;
        };

        updateLiveTimer();
        container._tsTimer = setInterval(updateLiveTimer, 1000);

        copyLiveSecBtn.addEventListener('click', () => {
            const val = liveSecEl.textContent;
            if (window.copyToClipboard) window.copyToClipboard(val, copyLiveSecBtn);
            else navigator.clipboard.writeText(val);
        });

        copyLiveMsBtn.addEventListener('click', () => {
            const val = liveMsEl.textContent;
            if (window.copyToClipboard) window.copyToClipboard(val, copyLiveMsBtn);
            else navigator.clipboard.writeText(val);
        });

        // 2. Conversion Logic: Update Timestamp Output Card & Sync Picker
        const updateFromTimestamp = (strVal, syncPicker = true) => {
            const dateObj = this.parseTimestampInput(strVal);

            if (!dateObj || isNaN(dateObj.getTime())) {
                outLocal.textContent = 'Invalid Timestamp';
                outUtc.textContent = '-';
                outIso.textContent = '-';
                outRelative.textContent = '-';
                return;
            }

            outLocal.textContent = this.formatLocalTime(dateObj);
            outUtc.textContent = dateObj.toUTCString();
            outIso.textContent = dateObj.toISOString();
            outRelative.textContent = this.formatRelativeTime(dateObj);

            if (syncPicker) {
                pickerInput.value = this.toDatetimeLocalString(dateObj);
                updateFromPicker(dateObj);
            }
        };

        // 3. Conversion Logic: Update Picker Output Card
        const updateFromPicker = (dateObj) => {
            if (!dateObj || isNaN(dateObj.getTime())) {
                outSec.textContent = '-';
                outMs.textContent = '-';
                return;
            }
            const ms = dateObj.getTime();
            outSec.textContent = Math.floor(ms / 1000);
            outMs.textContent = ms;
        };

        // Event listener on Timestamp input
        inputTs.addEventListener('input', (e) => {
            updateFromTimestamp(e.target.value, true);
        });

        // Event listener on Date Picker
        pickerInput.addEventListener('change', (e) => {
            if (!e.target.value) return;
            const dateObj = new Date(e.target.value);
            if (!isNaN(dateObj.getTime())) {
                const sec = Math.floor(dateObj.getTime() / 1000);
                inputTs.value = sec;
                updateFromTimestamp(String(sec), false);
                updateFromPicker(dateObj);
            }
        });

        // Quick Buttons
        quickNow.addEventListener('click', () => {
            const sec = Math.floor(Date.now() / 1000);
            inputTs.value = sec;
            updateFromTimestamp(String(sec), true);
        });

        quickStartToday.addEventListener('click', () => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            const sec = Math.floor(d.getTime() / 1000);
            inputTs.value = sec;
            updateFromTimestamp(String(sec), true);
        });

        quickEndToday.addEventListener('click', () => {
            const d = new Date();
            d.setHours(23, 59, 59, 999);
            const sec = Math.floor(d.getTime() / 1000);
            inputTs.value = sec;
            updateFromTimestamp(String(sec), true);
        });

        quickStartYear.addEventListener('click', () => {
            const d = new Date();
            d.setMonth(0, 1);
            d.setHours(0, 0, 0, 0);
            const sec = Math.floor(d.getTime() / 1000);
            inputTs.value = sec;
            updateFromTimestamp(String(sec), true);
        });

        // Copy buttons for all output text spans
        const copyBtns = container.querySelectorAll('.ts-copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const targetEl = container.querySelector('#' + targetId);
                if (targetEl && targetEl.textContent && targetEl.textContent !== '-') {
                    if (window.copyToClipboard) {
                        window.copyToClipboard(targetEl.textContent, btn);
                    } else {
                        navigator.clipboard.writeText(targetEl.textContent);
                    }
                }
            });
        });

        // Initialize with current time
        const initialSec = Math.floor(Date.now() / 1000);
        inputTs.value = initialSec;
        updateFromTimestamp(String(initialSec), true);
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(TimestampConverter);
