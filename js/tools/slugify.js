/* ============================================
   DevTools Hub - Slugify / Text Sanitizer
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'Slugify / Text Sanitizer',
    icon: '📝',
    category: 'Text',
    description: 'Chuyển đổi văn bản sang URL slug, hỗ trợ tiếng Việt',

    render(container) {
        container.innerHTML = `
            <style>
                .slug-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-md); margin-top: var(--space-md); }
                .slug-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-sm); }
                .slug-card-header { display: flex; justify-content: space-between; align-items: center; }
                .slug-card-name { font-weight: 600; color: var(--text-primary); font-size: var(--fs-sm); }
                .slug-card-desc { font-size: var(--fs-xs); color: var(--text-muted); }
                .slug-card-result { background: var(--bg-input); border: 1px solid var(--border-color); border-radius: 4px; padding: var(--space-sm) var(--space-md); font-family: var(--font-mono); font-size: var(--fs-sm); color: var(--accent-primary); word-break: break-all; min-height: 36px; display: flex; align-items: center; }
                .slug-options { display: flex; gap: var(--space-md); flex-wrap: wrap; align-items: flex-end; }
            </style>
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>Slugify / Text Sanitizer</h2>
                    <p class="tool-description">Chuyển đổi văn bản sang URL slug, file name, CSS class, camelCase... Hỗ trợ đầy đủ tiếng Việt (loại bỏ dấu tự động).</p>
                </div>
                <div class="tool-body">
                    <div class="tool-group">
                        <label class="tool-label">Văn bản đầu vào</label>
                        <textarea id="slug-input" class="tool-textarea" rows="3" placeholder="Nhập văn bản cần chuyển đổi (ví dụ: Xin Chào Thế Giới - DevTools Hub 2024!)"></textarea>
                    </div>

                    <div class="slug-options">
                        <div class="tool-group" style="flex:0 0 auto;">
                            <label class="tool-label">Dấu phân cách</label>
                            <select id="slug-sep" class="tool-select">
                                <option value="-">Gạch ngang (-)</option>
                                <option value="_">Gạch dưới (_)</option>
                                <option value=".">Dấu chấm (.)</option>
                            </select>
                        </div>
                        <div class="tool-group" style="flex:0 0 auto;">
                            <label class="tool-label">Độ dài tối đa</label>
                            <input type="number" id="slug-maxlen" class="tool-number" value="0" min="0" max="500" placeholder="0 = không giới hạn" style="width:120px;">
                        </div>
                        <button class="tool-btn" id="slug-sample" style="align-self:flex-end;">📝 Văn bản mẫu</button>
                    </div>

                    <div class="tool-stats" id="slug-stats">
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="slug-stat-chars">0</div>
                            <div class="tool-stat-label">Ký tự gốc</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="slug-stat-result">0</div>
                            <div class="tool-stat-label">Ký tự slug</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="slug-stat-removed">0</div>
                            <div class="tool-stat-label">Dấu đã loại</div>
                        </div>
                    </div>

                    <div class="slug-grid" id="slug-grid"></div>
                </div>
            </div>
        `;

        var inputEl = container.querySelector('#slug-input');
        var sepEl = container.querySelector('#slug-sep');
        var maxlenEl = container.querySelector('#slug-maxlen');
        var sampleBtn = container.querySelector('#slug-sample');
        var grid = container.querySelector('#slug-grid');
        var statChars = container.querySelector('#slug-stat-chars');
        var statResult = container.querySelector('#slug-stat-result');
        var statRemoved = container.querySelector('#slug-stat-removed');

        // Vietnamese diacritics map
        var vnMap = {
            'à':'a','á':'a','ạ':'a','ả':'a','ã':'a','â':'a','ầ':'a','ấ':'a','ậ':'a','ẩ':'a','ẫ':'a',
            'ă':'a','ằ':'a','ắ':'a','ặ':'a','ẳ':'a','ẵ':'a',
            'è':'e','é':'e','ẹ':'e','ẻ':'e','ẽ':'e','ê':'e','ề':'e','ế':'e','ệ':'e','ể':'e','ễ':'e',
            'ì':'i','í':'i','ị':'i','ỉ':'i','ĩ':'i',
            'ò':'o','ó':'o','ọ':'o','ỏ':'o','õ':'o','ô':'o','ồ':'o','ố':'o','ộ':'o','ổ':'o','ỗ':'o',
            'ơ':'o','ờ':'o','ớ':'o','ợ':'o','ở':'o','ỡ':'o',
            'ù':'u','ú':'u','ụ':'u','ủ':'u','ũ':'u','ư':'u','ừ':'u','ứ':'u','ự':'u','ử':'u','ữ':'u',
            'ỳ':'y','ý':'y','ỵ':'y','ỷ':'y','ỹ':'y',
            'đ':'d',
            'À':'A','Á':'A','Ạ':'A','Ả':'A','Ã':'A','Â':'A','Ầ':'A','Ấ':'A','Ậ':'A','Ẩ':'A','Ẫ':'A',
            'Ă':'A','Ằ':'A','Ắ':'A','Ặ':'A','Ẳ':'A','Ẵ':'A',
            'È':'E','É':'E','Ẹ':'E','Ẻ':'E','Ẽ':'E','Ê':'E','Ề':'E','Ế':'E','Ệ':'E','Ể':'E','Ễ':'E',
            'Ì':'I','Í':'I','Ị':'I','Ỉ':'I','Ĩ':'I',
            'Ò':'O','Ó':'O','Ọ':'O','Ỏ':'O','Õ':'O','Ô':'O','Ồ':'O','Ố':'O','Ộ':'O','Ổ':'O','Ỗ':'O',
            'Ơ':'O','Ờ':'O','Ớ':'O','Ợ':'O','Ở':'O','Ỡ':'O',
            'Ù':'U','Ú':'U','Ụ':'U','Ủ':'U','Ũ':'U','Ư':'U','Ừ':'U','Ứ':'U','Ự':'U','Ử':'U','Ữ':'U',
            'Ỳ':'Y','Ý':'Y','Ỵ':'Y','Ỷ':'Y','Ỹ':'Y',
            'Đ':'D'
        };

        function removeVietnamese(str) {
            var result = '';
            for (var i = 0; i < str.length; i++) {
                result += vnMap[str[i]] || str[i];
            }
            return result;
        }

        function getWords(str) {
            var clean = removeVietnamese(str);
            return clean
                .replace(/[^a-zA-Z0-9\s]/g, ' ')
                .trim()
                .split(/\s+/)
                .filter(function(w) { return w; });
        }

        var formats = [
            { id: 'url-slug', name: 'URL Slug', desc: 'hello-world', fn: function(words, sep, max) {
                var r = words.map(function(w) { return w.toLowerCase(); }).join(sep);
                return max > 0 ? r.substring(0, max) : r;
            }},
            { id: 'filename', name: 'File Name', desc: 'hello_world', fn: function(words, sep, max) {
                var r = words.map(function(w) { return w.toLowerCase(); }).join('_');
                return max > 0 ? r.substring(0, max) : r;
            }},
            { id: 'css-class', name: 'CSS Class', desc: '.hello-world', fn: function(words) {
                return '.' + words.map(function(w) { return w.toLowerCase(); }).join('-');
            }},
            { id: 'camel', name: 'camelCase', desc: 'helloWorld', fn: function(words) {
                return words.map(function(w, i) {
                    return i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
                }).join('');
            }},
            { id: 'pascal', name: 'PascalCase', desc: 'HelloWorld', fn: function(words) {
                return words.map(function(w) {
                    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
                }).join('');
            }},
            { id: 'constant', name: 'CONSTANT_CASE', desc: 'HELLO_WORLD', fn: function(words) {
                return words.map(function(w) { return w.toUpperCase(); }).join('_');
            }},
            { id: 'clean', name: 'Clean Text', desc: 'hello world (no diacritics)', fn: function(words) {
                return words.map(function(w) { return w.toLowerCase(); }).join(' ');
            }}
        ];

        // Build grid
        grid.innerHTML = formats.map(function(f) {
            return '<div class="slug-card">' +
                '<div class="slug-card-header">' +
                    '<div><span class="slug-card-name">' + f.name + '</span> <span class="slug-card-desc">' + f.desc + '</span></div>' +
                    '<button class="tool-btn tool-btn-sm slug-copy-btn" data-id="' + f.id + '">Copy</button>' +
                '</div>' +
                '<div class="slug-card-result" id="slug-res-' + f.id + '"></div>' +
            '</div>';
        }).join('');

        var resultEls = {};
        formats.forEach(function(f) {
            resultEls[f.id] = container.querySelector('#slug-res-' + f.id);
        });

        function process() {
            var raw = inputEl.value;
            var sep = sepEl.value;
            var maxlen = parseInt(maxlenEl.value) || 0;
            var words = getWords(raw);

            // Count diacritics removed
            var cleaned = removeVietnamese(raw);
            var diacriticsRemoved = 0;
            for (var i = 0; i < raw.length; i++) {
                if (raw[i] !== cleaned[i]) diacriticsRemoved++;
            }

            formats.forEach(function(f) {
                var result = words.length > 0 ? f.fn(words, sep, maxlen) : '';
                resultEls[f.id].textContent = result;
            });

            statChars.textContent = raw.length;
            var slugResult = resultEls['url-slug'].textContent;
            statResult.textContent = slugResult.length;
            statRemoved.textContent = diacriticsRemoved;
        }

        inputEl.addEventListener('input', process);
        sepEl.addEventListener('change', process);
        maxlenEl.addEventListener('input', process);

        sampleBtn.addEventListener('click', function() {
            inputEl.value = 'Xin Chào Thế Giới - DevTools Hub 2024!';
            process();
        });

        grid.addEventListener('click', function(e) {
            var btn = e.target.closest('.slug-copy-btn');
            if (btn) {
                var id = btn.getAttribute('data-id');
                var text = resultEls[id].textContent;
                if (text) window.copyToClipboard(text, btn);
            }
        });

        process();
    }
});
