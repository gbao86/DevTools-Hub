/* ============================================
   DevTools Hub - Lorem Ipsum Generator
   ============================================ */

const LoremIpsum = {
    name: 'Lorem Ipsum',
    icon: '📝',
    category: 'Generator',
    description: 'Tạo text Lorem Ipsum cho thiết kế',

    // Dictionary of classic & extended Latin words
    wordsPool: [
        "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
        "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
        "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut",
        "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "in", "reprehenderit",
        "voluptate", "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint",
        "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit",
        "anim", "id", "est", "laborum", "curabitur", "pretium", "tincidunt", "lacus", "nunc", "gravida",
        "imperdiet", "sapien", "euismod", "vulputate", "mauris", "elementum", "lobortis", "metus", "dictum", "auctor",
        "mollis", "phasellus", "aliquam", "feugiat", "nisl", "sollicitudin", "morbi", "tristique", "senectus", "netus",
        "malesuada", "fames", "ac", "turpis", "egestas", "dignissim", "suspendisse", "ante", "nibh", "cursus",
        "mattis", "molestie", "iaculis", "at", "erat", "pellentesque", "accumsan", "facilisi", "tempus", "urna",
        "volutpat", "laoreet", "arcus", "tortor", "convallis", "aenean", "risus", "viverra", "tellus", "integer",
        "scelerisque", "varius", "porta", "habitant", "platea", "dictumst", "vestibulum", "rhoncus", "dapibus"
    ],

    // Generate random word from pool
    getRandomWord() {
        return this.wordsPool[Math.floor(Math.random() * this.wordsPool.length)];
    },

    // Generate a single sentence with N words
    generateSentence(wordCount = null, startsWithClassic = false) {
        if (startsWithClassic) {
            const classic = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
            if (!wordCount || wordCount <= 8) return classic;
            const extraCount = wordCount - 8;
            const extraWords = [];
            for (let i = 0; i < extraCount; i++) {
                extraWords.push(this.getRandomWord());
            }
            return "Lorem ipsum dolor sit amet, consectetur adipiscing elit " + extraWords.join(' ') + ".";
        }

        const count = wordCount || (Math.floor(Math.random() * 8) + 8); // 8-15 words
        const words = [];
        for (let i = 0; i < count; i++) {
            words.push(this.getRandomWord());
        }
        // Capitalize first letter
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        return words.join(' ') + '.';
    },

    // Generate a single paragraph with N sentences
    generateParagraph(sentenceCount = null, startsWithClassic = false) {
        const count = sentenceCount || (Math.floor(Math.random() * 3) + 4); // 4-6 sentences
        const sentences = [];
        for (let i = 0; i < count; i++) {
            const isFirst = (i === 0 && startsWithClassic);
            sentences.push(this.generateSentence(null, isFirst));
        }
        return sentences.join(' ');
    },

    // Main generate function according to options
    generate(type, amount, startWithLorem) {
        let result = '';

        if (type === 'words') {
            const count = Math.max(1, parseInt(amount, 10) || 1);
            if (startWithLorem) {
                const classicWords = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"];
                const words = [];
                for (let i = 0; i < count; i++) {
                    if (i < classicWords.length) {
                        words.push(classicWords[i]);
                    } else {
                        words.push(this.getRandomWord());
                    }
                }
                words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
                result = words.join(' ') + '.';
            } else {
                const words = [];
                for (let i = 0; i < count; i++) {
                    words.push(this.getRandomWord());
                }
                words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
                result = words.join(' ') + '.';
            }
        } else if (type === 'sentences') {
            const count = Math.max(1, parseInt(amount, 10) || 1);
            const sentences = [];
            for (let i = 0; i < count; i++) {
                const isFirst = (i === 0 && startWithLorem);
                sentences.push(this.generateSentence(null, isFirst));
            }
            result = sentences.join(' ');
        } else {
            // Paragraphs
            const count = Math.max(1, parseInt(amount, 10) || 1);
            const paragraphs = [];
            for (let i = 0; i < count; i++) {
                const isFirst = (i === 0 && startWithLorem);
                paragraphs.push(this.generateParagraph(null, isFirst));
            }
            result = paragraphs.join('\n\n');
        }

        return result;
    },

    // Render interface into container
    render(container) {
        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>📝 Lorem Ipsum Generator</h2>
                    <p class="tool-description">Tạo text Lorem Ipsum cho thiết kế</p>
                </div>
                <div class="tool-body">
                    <div class="tool-row" style="align-items: flex-end; flex-wrap: wrap;">
                        <div class="tool-group" style="flex: 1; min-width: 150px;">
                            <label class="tool-label" for="lorem-type">Loại (Type)</label>
                            <select class="tool-select" id="lorem-type">
                                <option value="paragraphs" selected>Đoạn văn (Paragraphs)</option>
                                <option value="sentences">Câu (Sentences)</option>
                                <option value="words">Từ (Words)</option>
                            </select>
                        </div>
                        <div class="tool-group" style="flex: 1; min-width: 120px;">
                            <label class="tool-label" for="lorem-amount">Số lượng (Amount)</label>
                            <input type="number" class="tool-number tool-input" id="lorem-amount" min="1" max="100" value="3" style="width: 100%;">
                        </div>
                        <div class="tool-group" style="padding-bottom: 8px;">
                            <label class="tool-checkbox">
                                <input type="checkbox" id="lorem-start-with" checked>
                                <span>Bắt đầu với "Lorem ipsum dolor sit amet..."</span>
                            </label>
                        </div>
                    </div>

                    <div class="tool-actions">
                        <button class="tool-btn tool-btn-primary" id="lorem-generate-btn">⚙️ Tạo Text</button>
                    </div>

                    <div class="tool-group">
                        <label class="tool-label">Kết quả</label>
                        <div class="tool-result">
                            <textarea class="tool-textarea" id="lorem-output" readonly placeholder="Text sẽ xuất hiện ở đây..." style="min-height: 200px;"></textarea>
                            <button class="tool-copy-btn" id="lorem-copy-btn" title="Copy text">📋 Copy</button>
                        </div>
                    </div>

                    <div class="tool-stats">
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="lorem-stat-words">0</div>
                            <div class="tool-stat-label">Số từ (Words)</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="lorem-stat-chars">0</div>
                            <div class="tool-stat-label">Số ký tự (Chars)</div>
                        </div>
                        <div class="tool-stat">
                            <div class="tool-stat-value" id="lorem-stat-paragraphs">0</div>
                            <div class="tool-stat-label">Số đoạn văn (Paragraphs)</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Element references
        const typeSelect = container.querySelector('#lorem-type');
        const amountInput = container.querySelector('#lorem-amount');
        const startWithCheck = container.querySelector('#lorem-start-with');
        const generateBtn = container.querySelector('#lorem-generate-btn');
        const outputTextarea = container.querySelector('#lorem-output');
        const copyBtn = container.querySelector('#lorem-copy-btn');

        const statWords = container.querySelector('#lorem-stat-words');
        const statChars = container.querySelector('#lorem-stat-chars');
        const statParagraphs = container.querySelector('#lorem-stat-paragraphs');

        // Update stats
        const updateStats = (text) => {
            const trimmed = text.trim();
            const words = trimmed ? trimmed.split(/\s+/).length : 0;
            const chars = text.length;
            const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).length : 0;

            statWords.textContent = words.toLocaleString('vi-VN');
            statChars.textContent = chars.toLocaleString('vi-VN');
            statParagraphs.textContent = paragraphs.toLocaleString('vi-VN');
        };

        // Do generation
        const doGenerate = () => {
            const type = typeSelect.value;
            const amount = parseInt(amountInput.value, 10) || 1;
            const startWith = startWithCheck.checked;

            const text = this.generate(type, amount, startWith);
            outputTextarea.value = text;
            updateStats(text);
        };

        // Event listeners
        generateBtn.addEventListener('click', doGenerate);
        typeSelect.addEventListener('change', doGenerate);
        amountInput.addEventListener('input', doGenerate);
        startWithCheck.addEventListener('change', doGenerate);

        copyBtn.addEventListener('click', () => {
            if (!outputTextarea.value) return;
            if (window.copyToClipboard) {
                window.copyToClipboard(outputTextarea.value, copyBtn);
            } else {
                navigator.clipboard.writeText(outputTextarea.value);
            }
        });

        // Initial generation on load
        doGenerate();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(LoremIpsum);
