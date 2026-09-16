/* ============================================
   DevTools Hub - HTML to JSX Converter
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'HTML to JSX',
    icon: '🔀',
    category: 'Converter',
    description: 'Chuyển đổi HTML sang JSX cho React',

    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>HTML to JSX</h2>
                    <p class="tool-description">Chuyển đổi HTML sang JSX (React) — tự động đổi class→className, style string→object, self-close tags, và hơn thế.</p>
                </div>
                <div class="tool-body">
                    <div class="tool-actions">
                        <button class="tool-btn" id="h2j-sample">📝 HTML mẫu</button>
                        <button class="tool-btn tool-btn-danger" id="h2j-clear">Xóa</button>
                    </div>
                    <div class="tool-split">
                        <div class="tool-group">
                            <label class="tool-label">HTML Input</label>
                            <textarea id="h2j-input" class="tool-textarea" style="min-height:420px;font-size:13px;" placeholder="Dán HTML vào đây..."></textarea>
                        </div>
                        <div class="tool-group">
                            <label class="tool-label">JSX Output</label>
                            <div class="tool-result">
                                <textarea id="h2j-output" class="tool-textarea" style="min-height:420px;font-size:13px;" readonly placeholder="JSX sẽ hiển thị ở đây..."></textarea>
                                <button class="tool-copy-btn" id="h2j-copy">📋 Copy</button>
                            </div>
                        </div>
                    </div>
                    <div class="tool-stats" id="h2j-stats" style="display:none;">
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="h2j-stat-attrs">0</div>
                            <div class="tool-stat-label">Thuộc tính đã đổi</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="h2j-stat-tags">0</div>
                            <div class="tool-stat-label">Tags self-closed</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="h2j-stat-styles">0</div>
                            <div class="tool-stat-label">Styles chuyển đổi</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        var inputEl = container.querySelector('#h2j-input');
        var outputEl = container.querySelector('#h2j-output');
        var copyBtn = container.querySelector('#h2j-copy');
        var sampleBtn = container.querySelector('#h2j-sample');
        var clearBtn = container.querySelector('#h2j-clear');
        var statsEl = container.querySelector('#h2j-stats');
        var statAttrs = container.querySelector('#h2j-stat-attrs');
        var statTags = container.querySelector('#h2j-stat-tags');
        var statStyles = container.querySelector('#h2j-stat-styles');

        var sampleHTML = '<div class="container">\n  <h1 class="title" style="color: red; font-size: 24px; margin-bottom: 10px;">Hello World</h1>\n  <label for="email">Email:</label>\n  <input type="email" class="form-input" tabindex="1" readonly maxlength="50" autofocus autocomplete="off">\n  <br>\n  <hr>\n  <img src="logo.png" alt="Logo" class="logo">\n  <textarea class="text-area" rows="5" cols="40"></textarea>\n  <!-- This is a comment -->\n  <button onclick="handleClick()" class="btn" style="background-color: #333; border-radius: 8px;">Click me</button>\n  <a href="/page" target="_blank" class="link">Go to page</a>\n  <table cellpadding="5" cellspacing="0">\n    <tr>\n      <td colspan="2" rowspan="1">Cell</td>\n    </tr>\n  </table>\n</div>';

        // Attribute mapping: HTML attr -> JSX attr
        var attrMap = {
            'class': 'className',
            'for': 'htmlFor',
            'tabindex': 'tabIndex',
            'maxlength': 'maxLength',
            'readonly': 'readOnly',
            'autocomplete': 'autoComplete',
            'autofocus': 'autoFocus',
            'colspan': 'colSpan',
            'rowspan': 'rowSpan',
            'cellpadding': 'cellPadding',
            'cellspacing': 'cellSpacing',
            'crossorigin': 'crossOrigin',
            'enctype': 'encType',
            'formaction': 'formAction',
            'novalidate': 'noValidate',
            'accesskey': 'accessKey',
            'contenteditable': 'contentEditable',
            'frameborder': 'frameBorder',
            'allowfullscreen': 'allowFullScreen',
            'srcdoc': 'srcDoc',
            'srcset': 'srcSet',
            'charset': 'charSet',
            'httpequiv': 'httpEquiv',
            'http-equiv': 'httpEquiv',
            'acceptcharset': 'acceptCharset',
            'accept-charset': 'acceptCharset',
            'classid': 'classID',
            'datetime': 'dateTime',
            'formmethod': 'formMethod',
            'formtarget': 'formTarget',
            'hreflang': 'hrefLang',
            'inputmode': 'inputMode',
            'minlength': 'minLength',
            'usemap': 'useMap'
        };

        var voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

        function cssPropertyToCamelCase(prop) {
            return prop.trim().replace(/-([a-z])/g, function(m, c) { return c.toUpperCase(); });
        }

        function convertStyleString(styleStr) {
            var parts = styleStr.split(';').filter(function(s) { return s.trim(); });
            var props = [];
            for (var i = 0; i < parts.length; i++) {
                var colonIdx = parts[i].indexOf(':');
                if (colonIdx === -1) continue;
                var key = parts[i].substring(0, colonIdx).trim();
                var val = parts[i].substring(colonIdx + 1).trim();
                var camelKey = cssPropertyToCamelCase(key);
                // Keep numeric values as numbers if pure px
                if (/^-?\d+(\.\d+)?px$/.test(val)) {
                    val = val.replace('px', '');
                    props.push(camelKey + ': ' + val);
                } else if (/^-?\d+(\.\d+)?$/.test(val)) {
                    props.push(camelKey + ': ' + val);
                } else {
                    props.push(camelKey + ": '" + val.replace(/'/g, "\\'") + "'");
                }
            }
            return '{{' + props.join(', ') + '}}';
        }

        function convertEventHandler(attrName) {
            // onclick -> onClick, onmouseover -> onMouseOver
            if (attrName.toLowerCase().startsWith('on')) {
                var eventPart = attrName.substring(2);
                return 'on' + eventPart.charAt(0).toUpperCase() + eventPart.slice(1).toLowerCase()
                    .replace(/(?:down|up|move|over|out|enter|leave|press|start|end|cancel|play|pause|change|input|submit|reset|focus|blur|load|error|scroll|wheel|click|dblclick|contextmenu)$/i, function(m) {
                        return m.charAt(0).toUpperCase() + m.slice(1);
                    });
            }
            return attrName;
        }

        function convert() {
            var html = inputEl.value;
            if (!html.trim()) { outputEl.value = ''; statsEl.style.display = 'none'; return; }

            var attrsChanged = 0;
            var tagsClosed = 0;
            var stylesConverted = 0;
            var result = html;

            // 1. Convert HTML comments to JSX comments
            result = result.replace(/<!--([\s\S]*?)-->/g, function(m, content) {
                attrsChanged++;
                return '{/*' + content + '*/}';
            });

            // 2. Convert style attributes
            result = result.replace(/\bstyle\s*=\s*"([^"]*)"/gi, function(m, styleVal) {
                stylesConverted++;
                return 'style=' + convertStyleString(styleVal);
            });
            result = result.replace(/\bstyle\s*=\s*'([^']*)'/gi, function(m, styleVal) {
                stylesConverted++;
                return 'style=' + convertStyleString(styleVal);
            });

            // 3. Convert event handlers (onclick="..." -> onClick={...})
            result = result.replace(/\bon([a-z]+)\s*=\s*"([^"]*)"/gi, function(m, event, val) {
                attrsChanged++;
                var jsxEvent = 'on' + event.charAt(0).toUpperCase() + event.slice(1);
                return jsxEvent + '={() => { ' + val + ' }}';
            });

            // 4. Convert mapped attributes
            var attrKeys = Object.keys(attrMap);
            for (var i = 0; i < attrKeys.length; i++) {
                var htmlAttr = attrKeys[i];
                var jsxAttr = attrMap[htmlAttr];
                var re = new RegExp('\\b' + htmlAttr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s*=)', 'gi');
                result = result.replace(re, function() {
                    attrsChanged++;
                    return jsxAttr + arguments[1];
                });
                // Handle boolean attributes without value (e.g., readonly, autofocus)
                var reBool = new RegExp('(<[^>]*\\s)' + htmlAttr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|>|/>)', 'gi');
                result = result.replace(reBool, function(m, before, after) {
                    // Only if not already handled (no =)
                    if (m.indexOf('=') === -1) {
                        attrsChanged++;
                        return before + jsxAttr + after;
                    }
                    return m;
                });
            }

            // 5. Self-close void elements
            for (var v = 0; v < voidElements.length; v++) {
                var tag = voidElements[v];
                var reVoid = new RegExp('<(' + tag + ')(\\s[^>]*)?' + '(?<!/)>', 'gi');
                result = result.replace(reVoid, function(m, tagName, attrs) {
                    tagsClosed++;
                    return '<' + tagName + (attrs || '') + ' />';
                });
            }

            outputEl.value = result;

            // Show stats
            statsEl.style.display = '';
            statAttrs.textContent = attrsChanged;
            statTags.textContent = tagsClosed;
            statStyles.textContent = stylesConverted;
        }

        inputEl.addEventListener('input', convert);

        sampleBtn.addEventListener('click', function() {
            inputEl.value = sampleHTML;
            convert();
        });

        clearBtn.addEventListener('click', function() {
            inputEl.value = '';
            outputEl.value = '';
            statsEl.style.display = 'none';
        });

        copyBtn.addEventListener('click', function() {
            if (outputEl.value) window.copyToClipboard(outputEl.value, copyBtn);
        });
    }
});
