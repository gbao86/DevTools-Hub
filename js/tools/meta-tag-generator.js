const MetaTagGenerator = {
    name: 'Meta Tag Generator',
    icon: '🌐',
    category: 'Web',
    description: 'Tạo meta tags cho SEO, Open Graph, Twitter Card',

    render(container) {
        container.innerHTML = `
            <style>
                .meta-tag-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-lg);
                }
                @media (max-width: 992px) {
                    .meta-tag-container {
                        grid-template-columns: 1fr;
                    }
                }
                .form-section {
                    background: var(--bg-secondary);
                    padding: var(--space-md);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--space-md);
                    border: 1px solid var(--border-color);
                }
                .form-section h3 {
                    margin-top: 0;
                    margin-bottom: var(--space-md);
                    font-size: var(--fs-base);
                    color: var(--accent-primary);
                    border-bottom: 1px solid var(--border-color);
                    padding-bottom: var(--space-sm);
                }
                .char-count {
                    font-size: var(--fs-xs);
                    float: right;
                }
                .count-good { color: var(--accent-success); }
                .count-warn { color: var(--accent-warning); }
                .count-bad { color: var(--accent-danger); }
                
                .preview-section {
                    background: var(--bg-secondary);
                    padding: var(--space-md);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--space-md);
                    border: 1px solid var(--border-color);
                }
                .preview-section h3 {
                    margin-top: 0;
                    font-size: var(--fs-sm);
                    color: var(--text-secondary);
                    margin-bottom: var(--space-md);
                }
                /* Google Preview */
                .google-preview {
                    background: #fff;
                    padding: var(--space-md);
                    border-radius: var(--radius-md);
                    font-family: Arial, sans-serif;
                }
                .google-url { color: #202124; font-size: 14px; margin-bottom: 4px; display: block;}
                .google-title { color: #1a0dab; font-size: 20px; text-decoration: none; margin-bottom: 4px; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .google-desc { color: #4d5156; font-size: 14px; line-height: 1.58; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                
                /* Social Preview */
                .social-preview {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    overflow: hidden;
                    max-width: 400px;
                }
                .social-img {
                    width: 100%;
                    height: 200px;
                    background: var(--bg-tertiary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    background-size: cover;
                    background-position: center;
                }
                .social-content {
                    padding: var(--space-sm) var(--space-md);
                    background: var(--bg-secondary);
                }
                .social-site { color: var(--text-muted); text-transform: uppercase; font-size: var(--fs-xs); margin-bottom: 4px; }
                .social-title { color: var(--text-primary); font-weight: bold; font-size: var(--fs-base); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .social-desc { color: var(--text-secondary); font-size: var(--fs-sm); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }

                /* Score */
                .score-circle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--fs-base);
                    font-weight: bold;
                    margin-bottom: var(--space-sm);
                }
                .score-wrapper {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    margin-bottom: var(--space-md);
                }
                .score-good { background: rgba(16, 185, 129, 0.2); color: var(--accent-success); border: 2px solid var(--accent-success); }
                .score-warn { background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); border: 2px solid var(--accent-warning); }
                .score-bad { background: rgba(239, 68, 68, 0.2); color: var(--accent-danger); border: 2px solid var(--accent-danger); }
                
                .code-output {
                    position: relative;
                }
                .code-output pre {
                    margin: 0;
                    padding: var(--space-md);
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    color: var(--text-primary);
                    font-family: var(--font-mono);
                    font-size: var(--fs-sm);
                    overflow-x: auto;
                    white-space: pre-wrap;
                }
                .copy-btn {
                    position: absolute;
                    top: var(--space-sm);
                    right: var(--space-sm);
                }
            </style>

            <div class="tool-panel">
                <div class="tool-header">
                    <h2>${this.icon} ${this.name}</h2>
                    <p class="tool-description">${this.description}</p>
                </div>
                
                <div class="tool-body">
                    <div class="tool-actions" style="margin-bottom: var(--space-lg);">
                        <button class="tool-btn tool-btn-sm" id="preset-blog">Blog Post</button>
                        <button class="tool-btn tool-btn-sm" id="preset-landing">Landing Page</button>
                        <button class="tool-btn tool-btn-sm" id="preset-product">E-commerce</button>
                        <button class="tool-btn tool-btn-sm" id="preset-clear">Clear All</button>
                    </div>

                    <div class="meta-tag-container">
                        <!-- Left Column: Forms -->
                        <div class="form-columns">
                            <!-- Basic SEO -->
                            <div class="form-section">
                                <h3>Basic SEO</h3>
                                <div class="tool-group">
                                    <label class="tool-label">
                                        Page Title
                                        <span class="char-count" id="count-title">0/60</span>
                                    </label>
                                    <input type="text" class="tool-input tag-input" id="meta-title" data-max="60" data-opt="50" placeholder="e.g. Best Running Shoes for 2024">
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">
                                        Meta Description
                                        <span class="char-count" id="count-desc">0/160</span>
                                    </label>
                                    <textarea class="tool-textarea tag-input" id="meta-desc" rows="3" data-max="160" data-opt="150" placeholder="e.g. Discover the top running shoes of 2024. Read our comprehensive reviews..."></textarea>
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">Keywords</label>
                                    <input type="text" class="tool-input tag-input" id="meta-keywords" placeholder="running shoes, marathon, best shoes">
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">Author</label>
                                    <input type="text" class="tool-input tag-input" id="meta-author" placeholder="John Doe">
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">Canonical URL</label>
                                    <input type="text" class="tool-input tag-input" id="meta-canonical" placeholder="https://example.com/running-shoes">
                                </div>
                                <div class="tool-row" style="gap: var(--space-md); margin-bottom: var(--space-md);">
                                    <label class="tool-checkbox">
                                        <input type="checkbox" class="tag-input" id="meta-index" checked> Index
                                    </label>
                                    <label class="tool-checkbox">
                                        <input type="checkbox" class="tag-input" id="meta-follow" checked> Follow
                                    </label>
                                </div>
                            </div>

                            <!-- Open Graph -->
                            <div class="form-section">
                                <h3>Open Graph (Facebook, LinkedIn)</h3>
                                <div class="tool-group">
                                    <label class="tool-label">og:type</label>
                                    <select class="tool-select tag-input" id="og-type">
                                        <option value="website">website</option>
                                        <option value="article">article</option>
                                        <option value="product">product</option>
                                    </select>
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">og:title <span class="tool-badge-info" style="font-size: 10px;">Auto</span></label>
                                    <input type="text" class="tool-input tag-input" id="og-title" placeholder="Leave empty to use basic title">
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">og:description <span class="tool-badge-info" style="font-size: 10px;">Auto</span></label>
                                    <textarea class="tool-textarea tag-input" id="og-desc" rows="2" placeholder="Leave empty to use basic description"></textarea>
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">og:image (URL)</label>
                                    <input type="text" class="tool-input tag-input" id="og-image" placeholder="https://example.com/image.jpg">
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">og:url <span class="tool-badge-info" style="font-size: 10px;">Auto</span></label>
                                    <input type="text" class="tool-input tag-input" id="og-url" placeholder="Leave empty to use Canonical URL">
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">og:site_name</label>
                                    <input type="text" class="tool-input tag-input" id="og-site-name" placeholder="My Website">
                                </div>
                            </div>

                            <!-- Twitter Card -->
                            <div class="form-section">
                                <h3>Twitter Card</h3>
                                <div class="tool-group">
                                    <label class="tool-label">twitter:card</label>
                                    <select class="tool-select tag-input" id="tw-card">
                                        <option value="summary_large_image">summary_large_image</option>
                                        <option value="summary">summary</option>
                                    </select>
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">twitter:site (@username)</label>
                                    <input type="text" class="tool-input tag-input" id="tw-site" placeholder="@mywebsite">
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">twitter:creator (@username)</label>
                                    <input type="text" class="tool-input tag-input" id="tw-creator" placeholder="@author">
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">twitter:title <span class="tool-badge-info" style="font-size: 10px;">Auto</span></label>
                                    <input type="text" class="tool-input tag-input" id="tw-title" placeholder="Leave empty to use basic title">
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">twitter:description <span class="tool-badge-info" style="font-size: 10px;">Auto</span></label>
                                    <textarea class="tool-textarea tag-input" id="tw-desc" rows="2" placeholder="Leave empty to use basic description"></textarea>
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">twitter:image <span class="tool-badge-info" style="font-size: 10px;">Auto</span></label>
                                    <input type="text" class="tool-input tag-input" id="tw-image" placeholder="Leave empty to use og:image">
                                </div>
                            </div>

                            <!-- Additional -->
                            <div class="form-section">
                                <h3>Additional</h3>
                                <div class="tool-group">
                                    <label class="tool-label">Theme Color</label>
                                    <div class="tool-row" style="gap: var(--space-sm);">
                                        <input type="color" class="tag-input" id="meta-theme-color-picker" value="#ffffff" style="height: 38px; width: 50px;">
                                        <input type="text" class="tool-input tag-input" id="meta-theme-color" value="#ffffff" style="flex:1;">
                                    </div>
                                </div>
                                <div class="tool-group">
                                    <label class="tool-label">Favicon URL</label>
                                    <input type="text" class="tool-input tag-input" id="meta-favicon" placeholder="/favicon.ico">
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Previews & Code -->
                        <div class="preview-columns">
                            
                            <div class="score-wrapper">
                                <div class="score-circle" id="seo-score">0%</div>
                                <div>
                                    <div style="font-weight: bold; margin-bottom: 4px;">SEO Completeness Score</div>
                                    <div style="font-size: var(--fs-sm); color: var(--text-secondary);" id="score-text">Fill in fields to increase score</div>
                                </div>
                            </div>

                            <div class="preview-section">
                                <h3>Google Search Preview</h3>
                                <div class="google-preview">
                                    <span class="google-url" id="preview-g-url">https://example.com</span>
                                    <a href="#" class="google-title" id="preview-g-title">Page Title</a>
                                    <div class="google-desc" id="preview-g-desc">Meta description will appear here...</div>
                                </div>
                            </div>

                            <div class="preview-section">
                                <h3>Social Media Preview</h3>
                                <div class="social-preview">
                                    <div class="social-img" id="preview-s-img">No Image Provided</div>
                                    <div class="social-content">
                                        <div class="social-site" id="preview-s-site">Website.com</div>
                                        <div class="social-title" id="preview-s-title">Page Title</div>
                                        <div class="social-desc" id="preview-s-desc">Description will appear here...</div>
                                    </div>
                                </div>
                            </div>

                            <div class="preview-section code-output">
                                <h3>Generated HTML</h3>
                                <button class="tool-btn tool-btn-sm copy-btn" id="copy-html">Copy HTML</button>
                                <pre id="html-output">&lt;!-- Meta tags will be generated here --&gt;</pre>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents(container);
        this.updateAll();
    },

    bindEvents(container) {
        const inputs = container.querySelectorAll('.tag-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if(input.id === 'meta-theme-color-picker') {
                    container.querySelector('#meta-theme-color').value = input.value;
                }
                if(input.id === 'meta-theme-color') {
                    container.querySelector('#meta-theme-color-picker').value = input.value;
                }
                this.updateAll();
            });
            input.addEventListener('change', () => this.updateAll());
        });

        // Presets
        container.querySelector('#preset-blog').addEventListener('click', () => this.applyPreset({
            title: 'How to Optimize Your SEO in 2024',
            desc: 'Learn the best practices for SEO optimization in 2024. A complete guide to improving your search rankings and driving more organic traffic.',
            canonical: 'https://example.com/blog/seo-2024',
            ogType: 'article',
            author: 'Jane Doe',
            image: 'https://example.com/images/seo-guide.jpg'
        }));

        container.querySelector('#preset-landing').addEventListener('click', () => this.applyPreset({
            title: 'SaaS Product - The Best Tool for Teams',
            desc: 'Boost your team productivity with our intuitive SaaS tool. Try it for free today and see the difference in your workflow.',
            canonical: 'https://example.com/',
            ogType: 'website',
            author: 'SaaS Company',
            image: 'https://example.com/images/hero-banner.png'
        }));

        container.querySelector('#preset-product').addEventListener('click', () => this.applyPreset({
            title: "Nike Air Max 2024 - Men's Running Shoes",
            desc: "Buy Nike Air Max 2024 men's running shoes. Features lightweight cushioning, breathable mesh, and durable traction. Free shipping available.",
            canonical: 'https://example.com/products/nike-air-max-2024',
            ogType: 'product',
            author: '',
            image: 'https://example.com/images/nike-air-max.jpg'
        }));

        container.querySelector('#preset-clear').addEventListener('click', () => {
            const inputs = document.querySelectorAll('.tag-input');
            inputs.forEach(input => {
                if (input.type === 'checkbox') {
                    input.checked = true;
                } else if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                } else if (input.type === 'color') {
                    input.value = '#ffffff';
                } else {
                    input.value = '';
                }
            });
            document.querySelector('#meta-theme-color').value = '#ffffff';
            this.updateAll();
        });

        // Copy button
        container.querySelector('#copy-html').addEventListener('click', (e) => {
            const output = container.querySelector('#html-output').textContent;
            window.copyToClipboard(output, e.target);
        });
    },

    applyPreset(data) {
        document.querySelector('#meta-title').value = data.title;
        document.querySelector('#meta-desc').value = data.desc;
        document.querySelector('#meta-canonical').value = data.canonical;
        document.querySelector('#og-type').value = data.ogType;
        document.querySelector('#meta-author').value = data.author;
        document.querySelector('#og-image').value = data.image;
        this.updateAll();
    },

    updateAll() {
        this.updateCharCounts();
        this.updatePreviews();
        this.updateCode();
        this.updateScore();
    },

    updateCharCounts() {
        const titleInput = document.querySelector('#meta-title');
        const descInput = document.querySelector('#meta-desc');
        
        const updateCount = (input, counterId) => {
            const count = input.value.length;
            const max = parseInt(input.dataset.max);
            const opt = parseInt(input.dataset.opt);
            const counter = document.querySelector(`#${counterId}`);
            
            counter.textContent = `${count}/${max}`;
            counter.className = 'char-count ' + 
                (count === 0 ? '' : 
                 count > max ? 'count-bad' : 
                 count >= opt ? 'count-good' : 'count-warn');
        };

        updateCount(titleInput, 'count-title');
        updateCount(descInput, 'count-desc');
    },

    updatePreviews() {
        // Values
        const title = document.querySelector('#meta-title').value || 'Page Title';
        const desc = document.querySelector('#meta-desc').value || 'Meta description will appear here...';
        const url = document.querySelector('#meta-canonical').value || 'https://example.com';
        
        const ogTitle = document.querySelector('#og-title').value || title;
        const ogDesc = document.querySelector('#og-desc').value || desc;
        const ogSiteName = document.querySelector('#og-site-name').value || 'Website.com';
        const ogImage = document.querySelector('#og-image').value;

        // Google
        let domain = url;
        try { domain = new URL(url).hostname; } catch(e) {}
        document.querySelector('#preview-g-url').textContent = url ? `${domain} › ...` : 'https://example.com';
        document.querySelector('#preview-g-title').textContent = title;
        document.querySelector('#preview-g-desc').textContent = desc;

        // Social
        document.querySelector('#preview-s-site').textContent = ogSiteName;
        document.querySelector('#preview-s-title').textContent = ogTitle;
        document.querySelector('#preview-s-desc').textContent = ogDesc;
        const imgEl = document.querySelector('#preview-s-img');
        if (ogImage) {
            imgEl.style.backgroundImage = `url('${ogImage}')`;
            imgEl.textContent = '';
        } else {
            imgEl.style.backgroundImage = 'none';
            imgEl.textContent = 'No Image Provided';
        }
    },

    updateCode() {
        function escapeAttr(str) {
            return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        
        // Get values
        const title = document.querySelector('#meta-title').value.trim();
        const desc = document.querySelector('#meta-desc').value.trim();
        const keywords = document.querySelector('#meta-keywords').value.trim();
        const author = document.querySelector('#meta-author').value.trim();
        const canonical = document.querySelector('#meta-canonical').value.trim();
        
        const isIndex = document.querySelector('#meta-index').checked;
        const isFollow = document.querySelector('#meta-follow').checked;
        const robots = `${isIndex ? 'index' : 'noindex'}, ${isFollow ? 'follow' : 'nofollow'}`;

        const ogType = document.querySelector('#og-type').value;
        const ogTitle = document.querySelector('#og-title').value.trim() || title;
        const ogDesc = document.querySelector('#og-desc').value.trim() || desc;
        const ogImage = document.querySelector('#og-image').value.trim();
        const ogUrl = document.querySelector('#og-url').value.trim() || canonical;
        const ogSiteName = document.querySelector('#og-site-name').value.trim();

        const twCard = document.querySelector('#tw-card').value;
        const twSite = document.querySelector('#tw-site').value.trim();
        const twCreator = document.querySelector('#tw-creator').value.trim();
        const twTitle = document.querySelector('#tw-title').value.trim() || ogTitle;
        const twDesc = document.querySelector('#tw-desc').value.trim() || ogDesc;
        const twImage = document.querySelector('#tw-image').value.trim() || ogImage;

        const themeColor = document.querySelector('#meta-theme-color').value.trim();
        const favicon = document.querySelector('#meta-favicon').value.trim();

        let html = `<!-- Essential Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;

        if (title) html += `<title>${escapeAttr(title)}</title>\n`;
        if (desc) html += `<meta name="description" content="${escapeAttr(desc)}">\n`;
        if (keywords) html += `<meta name="keywords" content="${escapeAttr(keywords)}">\n`;
        if (author) html += `<meta name="author" content="${escapeAttr(author)}">\n`;
        html += `<meta name="robots" content="${escapeAttr(robots)}">\n`;
        if (canonical) html += `<link rel="canonical" href="${escapeAttr(canonical)}">\n`;
        if (themeColor) html += `<meta name="theme-color" content="${escapeAttr(themeColor)}">\n`;
        if (favicon) html += `<link rel="icon" href="${escapeAttr(favicon)}">\n`;

        html += `\n<!-- Open Graph / Facebook -->
<meta property="og:type" content="${escapeAttr(ogType)}">\n`;
        if (ogUrl) html += `<meta property="og:url" content="${escapeAttr(ogUrl)}">\n`;
        if (ogTitle) html += `<meta property="og:title" content="${escapeAttr(ogTitle)}">\n`;
        if (ogDesc) html += `<meta property="og:description" content="${escapeAttr(ogDesc)}">\n`;
        if (ogImage) html += `<meta property="og:image" content="${escapeAttr(ogImage)}">\n`;
        if (ogSiteName) html += `<meta property="og:site_name" content="${escapeAttr(ogSiteName)}">\n`;

        html += `\n<!-- Twitter -->
<meta name="twitter:card" content="${escapeAttr(twCard)}">\n`;
        if (twSite) html += `<meta name="twitter:site" content="${escapeAttr(twSite)}">\n`;
        if (twCreator) html += `<meta name="twitter:creator" content="${escapeAttr(twCreator)}">\n`;
        if (ogUrl) html += `<meta name="twitter:url" content="${escapeAttr(ogUrl)}">\n`;
        if (twTitle) html += `<meta name="twitter:title" content="${escapeAttr(twTitle)}">\n`;
        if (twDesc) html += `<meta name="twitter:description" content="${escapeAttr(twDesc)}">\n`;
        if (twImage) html += `<meta name="twitter:image" content="${escapeAttr(twImage)}">\n`;

        document.querySelector('#html-output').textContent = html;
    },

    updateScore() {
        const title = document.querySelector('#meta-title').value.trim();
        const desc = document.querySelector('#meta-desc').value.trim();
        const canonical = document.querySelector('#meta-canonical').value.trim();
        const ogImage = document.querySelector('#og-image').value.trim();
        
        let score = 0;
        let checks = 0;
        let totalChecks = 4;

        if (title.length > 0) { checks++; if (title.length >= 30 && title.length <= 60) score += 25; else score += 15; }
        if (desc.length > 0) { checks++; if (desc.length >= 120 && desc.length <= 160) score += 25; else score += 15; }
        if (canonical) { checks++; score += 25; }
        if (ogImage) { checks++; score += 25; }

        const circle = document.querySelector('#seo-score');
        const text = document.querySelector('#score-text');
        
        circle.textContent = `${score}%`;
        circle.className = 'score-circle ' + (score >= 80 ? 'score-good' : score >= 50 ? 'score-warn' : 'score-bad');
        
        if (score >= 80) text.textContent = 'Excellent! Your meta tags are well optimized.';
        else if (score >= 50) text.textContent = 'Good, but there is room for improvement.';
        else text.textContent = 'Basic tags missing. Fill in Title, Description, Canonical and Image.';
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(MetaTagGenerator);
