/* ============================================
   DevTools Hub - User-Agent Parser & Device Detector
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'User-Agent Parser',
    icon: '🕵️',
    category: 'Tester',
    description: 'Phân tích chi tiết chuỗi User-Agent: Trình duyệt, Hệ điều hành, Thiết bị, Engine và Bot',

    render(container) {
        if (!document.getElementById('ua-tool-style')) {
            const style = document.createElement('style');
            style.id = 'ua-tool-style';
            style.textContent = `
                .ua-presets-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.25rem; }
                .ua-card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
                .ua-info-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; position: relative; overflow: hidden; }
                .ua-card-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
                .ua-card-title { font-size: var(--fs-sm); font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.4rem; }
                .ua-card-badge { font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600; }
                .ua-card-badge.badge-bot { background: rgba(239, 68, 68, 0.15); color: var(--accent-danger); border: 1px solid rgba(239, 68, 68, 0.3); }
                .ua-card-badge.badge-user { background: rgba(16, 185, 129, 0.15); color: var(--accent-success); border: 1px solid rgba(16, 185, 129, 0.3); }
                .ua-card-val-big { font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin: 0.25rem 0; word-break: break-word; }
                .ua-card-val-sub { font-size: var(--fs-sm); color: var(--text-secondary); }
                .ua-item-row { display: flex; justify-content: space-between; font-size: var(--fs-sm); border-top: 1px dashed var(--border-color); padding-top: 0.4rem; }
                .ua-item-label { color: var(--text-secondary); }
                .ua-item-val { color: var(--accent-primary); font-weight: 600; font-family: monospace; }
                .ua-json-box { background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; margin-top: 1.5rem; }
            `;
            document.head.appendChild(style);
        }

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🕵️ User-Agent Parser & Device Detector</h2>
                    <p class="tool-description">Phân tích chuyên sâu chuỗi User-Agent: nhận diện Trình duyệt, Hệ điều hành, Thiết bị, Rendering Engine và Crawler/Bot.</p>
                </div>
                <div class="tool-body">
                    <!-- Presets & Current UA Actions -->
                    <div class="tool-actions" style="margin-bottom: 1rem; flex-wrap: wrap;">
                        <button type="button" class="tool-btn tool-btn-primary" id="ua-btn-current">📍 Dùng User-Agent của bạn</button>
                        <button type="button" class="tool-btn tool-btn-danger" id="ua-btn-clear">Xóa</button>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Các mẫu User-Agent phổ biến (Presets)</label>
                        <div class="ua-presets-grid" id="ua-presets-container"></div>
                    </div>

                    <!-- Input Box -->
                    <div class="tool-group">
                        <label class="tool-label">Chuỗi User-Agent cần phân tích</label>
                        <textarea id="ua-input" class="tool-textarea" style="min-height: 90px; font-family: monospace; font-size: 13px;" placeholder="Dán chuỗi User-Agent vào đây..."></textarea>
                    </div>

                    <!-- Results Overview Cards -->
                    <div class="ua-card-grid">
                        <!-- Browser Card -->
                        <div class="ua-info-card">
                            <div class="ua-card-header">
                                <span class="ua-card-title">🌐 Trình duyệt</span>
                                <span class="ua-card-badge badge-user" id="res-browser-type">Browser</span>
                            </div>
                            <div class="ua-card-val-big" id="res-browser-name">-</div>
                            <div class="ua-item-row">
                                <span class="ua-item-label">Phiên bản đầy đủ:</span>
                                <span class="ua-item-val" id="res-browser-ver">-</span>
                            </div>
                            <div class="ua-item-row">
                                <span class="ua-item-label">Major Version:</span>
                                <span class="ua-item-val" id="res-browser-major">-</span>
                            </div>
                        </div>

                        <!-- OS Card -->
                        <div class="ua-info-card">
                            <div class="ua-card-header">
                                <span class="ua-card-title">💻 Hệ điều hành</span>
                                <span class="ua-card-badge badge-user" id="res-os-badge">OS</span>
                            </div>
                            <div class="ua-card-val-big" id="res-os-name">-</div>
                            <div class="ua-item-row">
                                <span class="ua-item-label">Phiên bản OS:</span>
                                <span class="ua-item-val" id="res-os-ver">-</span>
                            </div>
                            <div class="ua-item-row">
                                <span class="ua-item-label">Kiến trúc (Arch):</span>
                                <span class="ua-item-val" id="res-os-arch">-</span>
                            </div>
                        </div>

                        <!-- Device Card -->
                        <div class="ua-info-card">
                            <div class="ua-card-header">
                                <span class="ua-card-title">📱 Thiết bị</span>
                                <span class="ua-card-badge badge-user" id="res-device-type">Desktop</span>
                            </div>
                            <div class="ua-card-val-big" id="res-device-brand">-</div>
                            <div class="ua-item-row">
                                <span class="ua-item-label">Loại thiết bị:</span>
                                <span class="ua-item-val" id="res-device-category">-</span>
                            </div>
                            <div class="ua-item-row">
                                <span class="ua-item-label">Model nhận diện:</span>
                                <span class="ua-item-val" id="res-device-model">-</span>
                            </div>
                        </div>

                        <!-- Engine Card -->
                        <div class="ua-info-card">
                            <div class="ua-card-header">
                                <span class="ua-card-title">⚙️ Rendering Engine</span>
                                <span class="ua-card-badge badge-user">Engine</span>
                            </div>
                            <div class="ua-card-val-big" id="res-engine-name">-</div>
                            <div class="ua-item-row">
                                <span class="ua-item-label">Phiên bản Engine:</span>
                                <span class="ua-item-val" id="res-engine-ver">-</span>
                            </div>
                            <div class="ua-item-row">
                                <span class="ua-item-label">Loại Engine:</span>
                                <span class="ua-item-val" id="res-engine-type">-</span>
                            </div>
                        </div>
                    </div>

                    <!-- Raw JSON Result -->
                    <div class="ua-json-box">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                            <label class="tool-label" style="margin:0;">Dữ liệu JSON phân tích chi tiết</label>
                            <button type="button" class="tool-btn tool-btn-sm" id="ua-btn-copy-json">📋 Copy JSON</button>
                        </div>
                        <textarea id="ua-json-output" class="tool-textarea" style="min-height: 180px; font-family: monospace; font-size: 13px;" readonly></textarea>
                    </div>
                </div>
            </div>
        `;

        const inputEl = container.querySelector('#ua-input');
        const presetsContainer = container.querySelector('#ua-presets-container');
        const currentBtn = container.querySelector('#ua-btn-current');
        const clearBtn = container.querySelector('#ua-btn-clear');
        const copyJsonBtn = container.querySelector('#ua-btn-copy-json');
        const jsonOutput = container.querySelector('#ua-json-output');

        const elBrowserName = container.querySelector('#res-browser-name');
        const elBrowserVer = container.querySelector('#res-browser-ver');
        const elBrowserMajor = container.querySelector('#res-browser-major');
        const elBrowserType = container.querySelector('#res-browser-type');

        const elOsName = container.querySelector('#res-os-name');
        const elOsVer = container.querySelector('#res-os-ver');
        const elOsArch = container.querySelector('#res-os-arch');
        const elOsBadge = container.querySelector('#res-os-badge');

        const elDeviceBrand = container.querySelector('#res-device-brand');
        const elDeviceCategory = container.querySelector('#res-device-category');
        const elDeviceModel = container.querySelector('#res-device-model');
        const elDeviceType = container.querySelector('#res-device-type');

        const elEngineName = container.querySelector('#res-engine-name');
        const elEngineVer = container.querySelector('#res-engine-ver');
        const elEngineType = container.querySelector('#res-engine-type');

        const presets = [
            { label: 'Chrome 128 (Windows 11)', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36' },
            { label: 'Safari 18 (iPhone 16 iOS 18)', ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' },
            { label: 'Safari (macOS Sonoma)', ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15' },
            { label: 'Chrome (Galaxy S24 Android 14)', ua: 'Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.88 Mobile Safari/537.36' },
            { label: 'Firefox 130 (Ubuntu Linux)', ua: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0' },
            { label: 'Edge 128 (Windows 10)', ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.2739.42' },
            { label: 'Googlebot Desktop', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
            { label: 'Googlebot Smartphone', ua: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.137 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
            { label: 'Facebook Crawler', ua: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' }
        ];

        presets.forEach(p => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'tool-btn tool-btn-sm';
            btn.textContent = p.label;
            btn.addEventListener('click', () => {
                inputEl.value = p.ua;
                parseAndRender(p.ua);
            });
            presetsContainer.appendChild(btn);
        });

        function parseUserAgent(ua) {
            ua = (ua || '').trim();
            if (!ua) return null;

            const res = {
                browser: { name: 'Unknown', version: 'Unknown', major: 'Unknown' },
                os: { name: 'Unknown', version: 'Unknown', architecture: 'Unknown' },
                device: { type: 'Desktop', brand: 'Unknown', model: 'Unknown' },
                engine: { name: 'Unknown', version: 'Unknown' },
                isBot: false,
                botName: null
            };

            // 1. Bot detection
            const botPatterns = [
                { re: /googlebot/i, name: 'Googlebot' },
                { re: /bingbot/i, name: 'Bingbot' },
                { re: /yandexbot/i, name: 'YandexBot' },
                { re: /duckduckbot/i, name: 'DuckDuckBot' },
                { re: /baiduspider/i, name: 'Baiduspider' },
                { re: /facebookexternalhit/i, name: 'Facebook External Hit' },
                { re: /twitterbot/i, name: 'Twitterbot' },
                { re: /linkedinbot/i, name: 'LinkedInBot' },
                { re: /slackbot/i, name: 'Slackbot' },
                { re: /discordbot/i, name: 'Discordbot' },
                { re: /whatsapp/i, name: 'WhatsApp Bot' },
                { re: /telegrambot/i, name: 'TelegramBot' },
                { re: /crawler|spider|robot|crawling/i, name: 'Generic Crawler' }
            ];

            for (const b of botPatterns) {
                if (b.re.test(ua)) {
                    res.isBot = true;
                    res.botName = b.name;
                    res.device.type = 'Bot / Crawler';
                    break;
                }
            }

            // 2. OS Detection
            if (/windows nt 10\.0/i.test(ua)) {
                res.os.name = 'Windows';
                res.os.version = '10 / 11';
            } else if (/windows nt 6\.3/i.test(ua)) {
                res.os.name = 'Windows';
                res.os.version = '8.1';
            } else if (/windows nt 6\.2/i.test(ua)) {
                res.os.name = 'Windows';
                res.os.version = '8';
            } else if (/windows nt 6\.1/i.test(ua)) {
                res.os.name = 'Windows';
                res.os.version = '7';
            } else if (/iphone|ipad|ipod/i.test(ua)) {
                res.os.name = 'iOS';
                const m = ua.match(/os (\d+[._\d]*)/i);
                if (m) res.os.version = m[1].replace(/_/g, '.');
            } else if (/android/i.test(ua)) {
                res.os.name = 'Android';
                const m = ua.match(/android\s+([0-9.]+)/i);
                if (m) res.os.version = m[1];
            } else if (/macintosh|mac os x/i.test(ua)) {
                res.os.name = 'macOS';
                const m = ua.match(/mac os x\s+([0-9._]+)/i);
                if (m) res.os.version = m[1].replace(/_/g, '.');
            } else if (/cros/i.test(ua)) {
                res.os.name = 'Chrome OS';
            } else if (/linux/i.test(ua)) {
                if (/ubuntu/i.test(ua)) res.os.name = 'Ubuntu Linux';
                else if (/fedora/i.test(ua)) res.os.name = 'Fedora Linux';
                else if (/debian/i.test(ua)) res.os.name = 'Debian Linux';
                else res.os.name = 'Linux';
            }

            // Architecture
            if (/x86_64|win64|wow64|x64|amd64/i.test(ua)) {
                res.os.architecture = '64-bit (x86_64)';
            } else if (/arm64|aarch64/i.test(ua)) {
                res.os.architecture = '64-bit (ARM64)';
            } else if (/arm/i.test(ua)) {
                res.os.architecture = 'ARM 32-bit';
            } else if (/i686|i386|x86/i.test(ua)) {
                res.os.architecture = '32-bit (x86)';
            } else if (res.os.name !== 'Unknown') {
                res.os.architecture = '64-bit (Default)';
            }

            // 3. Device Category & Brand
            if (res.isBot) {
                res.device.type = 'Search Bot / Crawler';
                res.device.brand = res.botName;
                res.device.model = 'Automated Agent';
            } else if (/ipad/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) {
                res.device.type = 'Tablet';
                res.device.brand = /ipad/i.test(ua) ? 'Apple' : 'Android Tablet';
                res.device.model = /ipad/i.test(ua) ? 'iPad' : 'Generic Tablet';
            } else if (/iphone/i.test(ua)) {
                res.device.type = 'Mobile (Smartphone)';
                res.device.brand = 'Apple';
                res.device.model = 'iPhone';
            } else if (/android.*mobile/i.test(ua)) {
                res.device.type = 'Mobile (Smartphone)';
                res.device.brand = 'Android';
                const modelMatch = ua.match(/android[^;]+;\s*([^;)]+)\s*build/i) || ua.match(/android[^;]+;\s*([^;)]+)\)/i);
                res.device.model = modelMatch ? modelMatch[1].trim() : 'Android Device';
            } else if (/smart-tv|smarttv|tizen|web0s|hbbtv/i.test(ua)) {
                res.device.type = 'Smart TV';
                res.device.brand = 'Connected TV';
            } else if (/playstation|xbox|nintendo/i.test(ua)) {
                res.device.type = 'Gaming Console';
            } else {
                res.device.type = 'Desktop / Laptop';
                res.device.brand = res.os.name;
                res.device.model = 'PC / Workstation';
            }

            // 4. Engine Detection
            if (/applewebkit/i.test(ua)) {
                if (/chrome|edg|opr|samsungbrowser/i.test(ua)) {
                    res.engine.name = 'Blink';
                } else {
                    res.engine.name = 'WebKit';
                }
                const m = ua.match(/applewebkit\/([0-9.]+)/i);
                if (m) res.engine.version = m[1];
            } else if (/gecko/i.test(ua) && /rv:/i.test(ua)) {
                res.engine.name = 'Gecko';
                const m = ua.match(/rv:([0-9.]+)/i);
                if (m) res.engine.version = m[1];
            } else if (/trident/i.test(ua)) {
                res.engine.name = 'Trident';
                const m = ua.match(/trident\/([0-9.]+)/i);
                if (m) res.engine.version = m[1];
            }

            // 5. Browser Detection
            if (/edg\//i.test(ua)) {
                res.browser.name = 'Microsoft Edge';
                const m = ua.match(/edg\/([0-9.]+)/i);
                if (m) res.browser.version = m[1];
            } else if (/samsungbrowser/i.test(ua)) {
                res.browser.name = 'Samsung Internet';
                const m = ua.match(/samsungbrowser\/([0-9.]+)/i);
                if (m) res.browser.version = m[1];
            } else if (/opr\//i.test(ua) || /opera/i.test(ua)) {
                res.browser.name = 'Opera';
                const m = ua.match(/(?:opr|opera)[\/\s]([0-9.]+)/i);
                if (m) res.browser.version = m[1];
            } else if (/brave/i.test(ua)) {
                res.browser.name = 'Brave';
                const m = ua.match(/brave\/([0-9.]+)/i);
                if (m) res.browser.version = m[1];
            } else if (/chrome|crios/i.test(ua)) {
                res.browser.name = 'Google Chrome';
                const m = ua.match(/(?:chrome|crios)\/([0-9.]+)/i);
                if (m) res.browser.version = m[1];
            } else if (/firefox|fxios/i.test(ua)) {
                res.browser.name = 'Mozilla Firefox';
                const m = ua.match(/(?:firefox|fxios)\/([0-9.]+)/i);
                if (m) res.browser.version = m[1];
            } else if (/safari/i.test(ua) && !/chrome|crios|android/i.test(ua)) {
                res.browser.name = 'Apple Safari';
                const m = ua.match(/version\/([0-9.]+)/i);
                if (m) res.browser.version = m[1];
            } else if (/msie|trident/i.test(ua)) {
                res.browser.name = 'Internet Explorer';
                const m = ua.match(/(?:msie\s|rv:)([0-9.]+)/i);
                if (m) res.browser.version = m[1];
            } else if (res.isBot) {
                res.browser.name = res.botName;
                res.browser.version = 'N/A';
            }

            if (res.browser.version !== 'Unknown' && res.browser.version !== 'N/A') {
                res.browser.major = res.browser.version.split('.')[0];
            }

            return res;
        }

        function parseAndRender(uaStr) {
            const data = parseUserAgent(uaStr);
            if (!data) {
                elBrowserName.textContent = '-';
                elBrowserVer.textContent = '-';
                elBrowserMajor.textContent = '-';
                elBrowserType.textContent = 'Trống';
                elBrowserType.className = 'ua-card-badge';

                elOsName.textContent = '-';
                elOsVer.textContent = '-';
                elOsArch.textContent = '-';

                elDeviceBrand.textContent = '-';
                elDeviceCategory.textContent = '-';
                elDeviceModel.textContent = '-';
                elDeviceType.textContent = '-';

                elEngineName.textContent = '-';
                elEngineVer.textContent = '-';
                elEngineType.textContent = '-';

                jsonOutput.value = '';
                return;
            }

            // Browser
            elBrowserName.textContent = data.browser.name;
            elBrowserVer.textContent = data.browser.version;
            elBrowserMajor.textContent = data.browser.major;
            if (data.isBot) {
                elBrowserType.textContent = '🤖 BOT';
                elBrowserType.className = 'ua-card-badge badge-bot';
            } else {
                elBrowserType.textContent = 'USER';
                elBrowserType.className = 'ua-card-badge badge-user';
            }

            // OS
            elOsName.textContent = data.os.name;
            elOsVer.textContent = data.os.version;
            elOsArch.textContent = data.os.architecture;
            elOsBadge.textContent = data.os.name !== 'Unknown' ? data.os.name : 'OS';

            // Device
            elDeviceBrand.textContent = data.device.brand;
            elDeviceCategory.textContent = data.device.type;
            elDeviceModel.textContent = data.device.model;
            elDeviceType.textContent = data.device.type.split(' ')[0];

            // Engine
            elEngineName.textContent = data.engine.name;
            elEngineVer.textContent = data.engine.version;
            elEngineType.textContent = data.engine.name !== 'Unknown' ? 'Layout Engine' : 'N/A';

            // Raw JSON
            jsonOutput.value = JSON.stringify(data, null, 2);
        }

        inputEl.addEventListener('input', (e) => {
            parseAndRender(e.target.value);
        });

        currentBtn.addEventListener('click', () => {
            const currentUa = navigator.userAgent;
            inputEl.value = currentUa;
            parseAndRender(currentUa);
            if (window.showToast) window.showToast('Đã tải User-Agent của trình duyệt!', 'info');
        });

        clearBtn.addEventListener('click', () => {
            inputEl.value = '';
            parseAndRender('');
        });

        copyJsonBtn.addEventListener('click', () => {
            if (!jsonOutput.value.trim()) return;
            if (window.copyToClipboard) {
                window.copyToClipboard(jsonOutput.value, copyJsonBtn);
            } else {
                navigator.clipboard.writeText(jsonOutput.value);
            }
        });

        // Initialize with current userAgent
        inputEl.value = navigator.userAgent;
        parseAndRender(navigator.userAgent);
    }
});
