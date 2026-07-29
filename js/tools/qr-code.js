/**
 * DevTools Hub - QR Code Generator & Scanner Tool
 * Generate custom QR Codes (Text/URL, Wi-Fi, vCard) with colors/margins/sizes,
 * export PNG/SVG, and decode QR Codes from images/clipboard (100% Client-Side).
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. Complete Pure JS QR Code Generator Engine (qrcode-generator by Kazuhiko Arase)
    // =========================================================================
    const QRCodeLib = (function () {
        const PAD0 = 0xEC;
        const PAD1 = 0x11;

        function QRPolynomial(num, shift) {
            if (num.length === undefined) throw new Error(num.length + "/" + shift);
            let offset = 0;
            while (offset < num.length && num[offset] === 0) offset++;
            this.num = new Uint8Array(num.length - offset + shift);
            for (let i = 0; i < num.length - offset; i++) this.num[i] = num[offset + i];
        }

        QRPolynomial.prototype = {
            getAt: function (i) { return this.num[i]; },
            getLength: function () { return this.num.length; },
            multiply: function (e) {
                const num = new Uint8Array(this.getLength() + e.getLength() - 1);
                for (let i = 0; i < this.getLength(); i++) {
                    if (this.getAt(i) === 0) continue;
                    for (let j = 0; j < e.getLength(); j++) {
                        if (e.getAt(j) === 0) continue;
                        num[i + j] ^= QRMath.gexp(QRMath.glog(this.getAt(i)) + QRMath.glog(e.getAt(j)));
                    }
                }
                return new QRPolynomial(num, 0);
            },
            mod: function (e) {
                if (this.getLength() - e.getLength() < 0) return this;
                const ratio = QRMath.glog(this.getAt(0)) - QRMath.glog(e.getAt(0));
                const num = new Uint8Array(this.getLength());
                for (let i = 0; i < this.getLength(); i++) num[i] = this.getAt(i);
                for (let i = 0; i < e.getLength(); i++) {
                    if (e.getAt(i) === 0) continue;
                    num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
                }
                return new QRPolynomial(num, 0).mod(e);
            }
        };

        const QRMath = {
            glog: function (n) {
                if (n < 1) throw new Error("glog(" + n + ")");
                return QRMath.LOG_TABLE[n];
            },
            gexp: function (n) {
                while (n < 0) n += 255;
                while (n >= 256) n -= 255;
                return QRMath.EXP_TABLE[n];
            },
            EXP_TABLE: new Uint8Array(256),
            LOG_TABLE: new Uint8Array(256)
        };

        for (let i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;
        for (let i = 8; i < 256; i++) {
            QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
        }
        for (let i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;

        // Complete Reed-Solomon Block table for QR Versions 1 to 15
        const RS_BLOCK_TABLE = [
            // L, M, Q, H
            [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], // V1
            [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], // V2
            [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], // V3
            [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], // V4
            [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], // V5
            [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], // V6
            [2, 98, 78], [4, 61, 31], [2, 45, 14, 4, 46, 15], [4, 39, 13, 1, 40, 14], // V7
            [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], // V8
            [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], // V9
            [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], // V10
            [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], // V11
            [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], // V12
            [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], // V13
            [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], // V14
            [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12, 7, 37, 13] // V15
        ];

        function QRCodeModel(typeNumber, errorCorrectionLevel) {
            this.typeNumber = typeNumber;
            this.errorCorrectionLevel = errorCorrectionLevel;
            this.modules = null;
            this.moduleCount = 0;
            this.dataCache = null;
            this.dataList = [];
        }

        QRCodeModel.prototype = {
            addData: function (data) {
                this.dataList.push(new QR8BitByte(data));
                this.dataCache = null;
            },
            isDark: function (row, col) {
                if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
                    throw new Error(row + "," + col);
                }
                return this.modules[row][col];
            },
            getModuleCount: function () {
                return this.moduleCount;
            },
            make: function () {
                if (this.typeNumber < 1) {
                    var maxType = Math.floor(RS_BLOCK_TABLE.length / 4);
                    for (var type = 1; type <= maxType; type++) {
                        var rsBlocks = QRCodeModel.getRSBlocks(type, this.errorCorrectionLevel);
                        var buffer = new QRBitBuffer();
                        var totalDataCount = 0;
                        for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
                        for (var i = 0; i < this.dataList.length; i++) {
                            var data = this.dataList[i];
                            buffer.put(data.mode, 4);
                            buffer.put(data.getLength(), QRCodeModel.getLengthInBits(data.mode, type));
                            data.write(buffer);
                        }
                        if (buffer.getLengthInBits() <= totalDataCount * 8) {
                            this.typeNumber = type;
                            break;
                        }
                    }
                    if (this.typeNumber < 1) {
                        throw new Error("Dữ liệu quá dài so với giới hạn mã QR");
                    }
                }
                this.makeImpl(false, this.getBestMaskPattern());
            },
            makeImpl: function (test, maskPattern) {
                this.moduleCount = this.typeNumber * 4 + 17;
                this.modules = new Array(this.moduleCount);
                for (var row = 0; row < this.moduleCount; row++) {
                    this.modules[row] = new Array(this.moduleCount);
                    for (var col = 0; col < this.moduleCount; col++) {
                        this.modules[row][col] = null;
                    }
                }
                this.setupPositionProbePattern(0, 0);
                this.setupPositionProbePattern(this.moduleCount - 7, 0);
                this.setupPositionProbePattern(0, this.moduleCount - 7);
                this.setupPositionAdjustPattern();
                this.setupTimingPattern();
                this.setupTypeInfo(test, maskPattern);
                if (this.typeNumber >= 7) this.setupTypeNumber(test);
                if (this.dataCache === null) {
                    this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectionLevel, this.dataList);
                }
                this.mapData(this.dataCache, maskPattern);
            },
            setupPositionProbePattern: function (row, col) {
                for (var r = -1; r <= 7; r++) {
                    if (row + r <= -1 || this.moduleCount <= row + r) continue;
                    for (var c = -1; c <= 7; c++) {
                        if (col + c <= -1 || this.moduleCount <= col + c) continue;
                        if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
                            (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
                            (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
                            this.modules[row + r][col + c] = true;
                        } else {
                            this.modules[row + r][col + c] = false;
                        }
                    }
                }
            },
            getBestMaskPattern: function () {
                var minLostPoint = 0;
                var pattern = 0;
                for (var i = 0; i < 8; i++) {
                    this.makeImpl(true, i);
                    var lostPoint = QRCodeModel.getLostPoint(this);
                    if (i === 0 || minLostPoint > lostPoint) {
                        minLostPoint = lostPoint;
                        pattern = i;
                    }
                }
                return pattern;
            },
            setupTimingPattern: function () {
                for (var r = 8; r < this.moduleCount - 8; r++) {
                    if (this.modules[r][6] !== null) continue;
                    this.modules[r][6] = (r % 2 === 0);
                }
                for (var c = 8; c < this.moduleCount - 8; c++) {
                    if (this.modules[6][c] !== null) continue;
                    this.modules[6][c] = (c % 2 === 0);
                }
            },
            setupPositionAdjustPattern: function () {
                var pos = QRCodeModel.getPatternPosition(this.typeNumber);
                for (var i = 0; i < pos.length; i++) {
                    for (var j = 0; j < pos.length; j++) {
                        var row = pos[i];
                        var col = pos[j];
                        if (this.modules[row][col] !== null) continue;
                        for (var r = -2; r <= 2; r++) {
                            for (var c = -2; c <= 2; c++) {
                                if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
                                    this.modules[row + r][col + c] = true;
                                } else {
                                    this.modules[row + r][col + c] = false;
                                }
                            }
                        }
                    }
                }
            },
            setupTypeInfo: function (test, maskPattern) {
                var data = (this.errorCorrectionLevel << 3) | maskPattern;
                var bits = QRCodeModel.getBCHTypeInfo(data);
                for (var i = 0; i < 15; i++) {
                    var mod = (!test && ((bits >> i) & 1) === 1);
                    if (i < 6) this.modules[i][8] = mod;
                    else if (i < 8) this.modules[i + 1][8] = mod;
                    else this.modules[this.moduleCount - 15 + i][8] = mod;

                    if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
                    else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
                    else this.modules[8][15 - i - 1] = mod;
                }
                this.modules[this.moduleCount - 8][8] = (!test);
            },
            setupTypeNumber: function (test) {
                var bits = QRCodeModel.getBCHTypeNumber(this.typeNumber);
                for (var i = 0; i < 18; i++) {
                    var mod = (!test && ((bits >> i) & 1) === 1);
                    this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
                    this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
                }
            },
            mapData: function (data, maskPattern) {
                var inc = -1;
                var row = this.moduleCount - 1;
                var bitIndex = 7;
                var byteIndex = 0;
                for (var col = this.moduleCount - 1; col > 0; col -= 2) {
                    if (col === 6) col--;
                    while (true) {
                        for (var c = 0; c < 2; c++) {
                            if (this.modules[row][col - c] === null) {
                                var dark = false;
                                if (byteIndex < data.length) {
                                    dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
                                }
                                var mask = QRCodeModel.getMask(maskPattern, row, col - c);
                                if (mask) dark = !dark;
                                this.modules[row][col - c] = dark;
                                bitIndex--;
                                if (bitIndex === -1) {
                                    byteIndex++;
                                    bitIndex = 7;
                                }
                            }
                        }
                        row += inc;
                        if (row < 0 || this.moduleCount <= row) {
                            row -= inc;
                            inc = -inc;
                            break;
                        }
                    }
                }
            }
        };

        QRCodeModel.PAD0 = PAD0;
        QRCodeModel.PAD1 = PAD1;

        QRCodeModel.getRSBlocks = function (typeNumber, errorCorrectionLevel) {
            var rsBlock = RS_BLOCK_TABLE[(typeNumber - 1) * 4 + errorCorrectionLevel];
            if (rsBlock === undefined) throw new Error("bad rs block: " + typeNumber + "/" + errorCorrectionLevel);
            var length = rsBlock.length / 3;
            var list = [];
            for (var i = 0; i < length; i++) {
                var count = rsBlock[i * 3 + 0];
                var totalCount = rsBlock[i * 3 + 1];
                var dataCount = rsBlock[i * 3 + 2];
                for (var j = 0; j < count; j++) {
                    list.push({ totalCount: totalCount, dataCount: dataCount });
                }
            }
            return list;
        };

        QRCodeModel.createData = function (typeNumber, errorCorrectionLevel, dataList) {
            var rsBlocks = QRCodeModel.getRSBlocks(typeNumber, errorCorrectionLevel);
            var buffer = new QRBitBuffer();
            for (var i = 0; i < dataList.length; i++) {
                var data = dataList[i];
                buffer.put(data.mode, 4);
                buffer.put(data.getLength(), QRCodeModel.getLengthInBits(data.mode, typeNumber));
                data.write(buffer);
            }
            var totalDataCount = 0;
            for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
            if (buffer.getLengthInBits() > totalDataCount * 8) {
                throw new Error("Dữ liệu quá dài so với dung lượng mã QR (code length overflow)");
            }
            if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
            while (buffer.getLengthInBits() % 8 !== 0) buffer.putBit(false);
            while (true) {
                if (buffer.getLengthInBits() >= totalDataCount * 8) break;
                buffer.put(QRCodeModel.PAD0, 8);
                if (buffer.getLengthInBits() >= totalDataCount * 8) break;
                buffer.put(QRCodeModel.PAD1, 8);
            }

            return QRCodeModel.createBytes(buffer, rsBlocks);
        };

        QRCodeModel.createBytes = function (buffer, rsBlocks) {
            var offset = 0;
            var maxDcCount = 0;
            var maxEcCount = 0;
            var dcdata = new Array(rsBlocks.length);
            var ecdata = new Array(rsBlocks.length);

            for (var r = 0; r < rsBlocks.length; r++) {
                var dcCount = rsBlocks[r].dataCount;
                var ecCount = rsBlocks[r].totalCount - dcCount;
                maxDcCount = Math.max(maxDcCount, dcCount);
                maxEcCount = Math.max(maxEcCount, ecCount);

                dcdata[r] = new Uint8Array(dcCount);
                for (var i = 0; i < dcdata[r].length; i++) {
                    dcdata[r][i] = 0xff & buffer.buffer[i + offset];
                }
                offset += dcCount;

                var rsPoly = QRCodeModel.getErrorCorrectionPolynomial(ecCount);
                var rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
                var modPoly = rawPoly.mod(rsPoly);

                ecdata[r] = new Uint8Array(rsPoly.getLength() - 1);
                for (var i = 0; i < ecdata[r].length; i++) {
                    var modIndex = i + modPoly.getLength() - ecdata[r].length;
                    ecdata[r][i] = (modIndex >= 0) ? modPoly.getAt(modIndex) : 0;
                }
            }

            var totalCodeCount = 0;
            for (var i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
            var data = new Uint8Array(totalCodeCount);
            var index = 0;

            for (var i = 0; i < maxDcCount; i++) {
                for (var r = 0; r < rsBlocks.length; r++) {
                    if (i < dcdata[r].length) data[index++] = dcdata[r][i];
                }
            }
            for (var i = 0; i < maxEcCount; i++) {
                for (var r = 0; r < rsBlocks.length; r++) {
                    if (i < ecdata[r].length) data[index++] = ecdata[r][i];
                }
            }
            return data;
        };

        QRCodeModel.getErrorCorrectionPolynomial = function (errorCorrectionLength) {
            var a = new QRPolynomial([1], 0);
            for (var i = 0; i < errorCorrectionLength; i++) {
                a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
            }
            return a;
        };

        QRCodeModel.getLengthInBits = function (mode, type) {
            if (1 <= type && type < 10) return 8;
            if (type < 27) return 16;
            return 16;
        };

        QRCodeModel.getLostPoint = function (qrCode) {
            var moduleCount = qrCode.getModuleCount();
            var lostPoint = 0;
            for (var row = 0; row < moduleCount; row++) {
                for (var col = 0; col < moduleCount; col++) {
                    var sameCount = 0;
                    var dark = qrCode.isDark(row, col);
                    for (var r = -1; r <= 1; r++) {
                        if (row + r < 0 || moduleCount <= row + r) continue;
                        for (var c = -1; c <= 1; c++) {
                            if (col + c < 0 || moduleCount <= col + c) continue;
                            if (r === 0 && c === 0) continue;
                            if (dark === qrCode.isDark(row + r, col + c)) sameCount++;
                        }
                    }
                    if (sameCount > 5) lostPoint += (3 + sameCount - 5);
                }
            }
            return lostPoint;
        };

        QRCodeModel.PATTERN_POSITION_TABLE = [
            [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
            [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54],
            [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70]
        ];

        QRCodeModel.getPatternPosition = function (typeNumber) {
            return QRCodeModel.PATTERN_POSITION_TABLE[typeNumber - 1] || [];
        };

        QRCodeModel.getMask = function (maskPattern, row, col) {
            switch (maskPattern) {
                case 0: return (row + col) % 2 === 0;
                case 1: return row % 2 === 0;
                case 2: return col % 3 === 0;
                case 3: return (row + col) % 3 === 0;
                case 4: return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 === 0;
                case 5: return (row * col) % 2 + (row * col) % 3 === 0;
                case 6: return ((row * col) % 2 + (row * col) % 3) % 2 === 0;
                case 7: return ((row + col) % 2 + (row * col) % 3) % 2 === 0;
                default: throw new Error("bad maskPattern: " + maskPattern);
            }
        };

        QRCodeModel.getBCHTypeInfo = function (data) {
            var d = data << 10;
            while (QRCodeModel.getBCHDigit(d) - QRCodeModel.getBCHDigit(1335) >= 0) {
                d ^= (1335 << (QRCodeModel.getBCHDigit(d) - QRCodeModel.getBCHDigit(1335)));
            }
            return ((data << 10) | d) ^ 21522;
        };

        QRCodeModel.getBCHTypeNumber = function (data) {
            var d = data << 12;
            while (QRCodeModel.getBCHDigit(d) - QRCodeModel.getBCHDigit(7973) >= 0) {
                d ^= (7973 << (QRCodeModel.getBCHDigit(d) - QRCodeModel.getBCHDigit(7973)));
            }
            return (data << 12) | d;
        };

        QRCodeModel.getBCHDigit = function (data) {
            var digit = 0;
            while (data !== 0) {
                digit++;
                data >>>= 1;
            }
            return digit;
        };

        function QR8BitByte(data) {
            this.mode = 4;
            this.data = data;
            const bytes = [];
            for (let i = 0; i < data.length; i++) {
                let code = data.charCodeAt(i);
                if (code < 0x80) {
                    bytes.push(code);
                } else if (code < 0x800) {
                    bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
                } else if (code < 0xd800 || code >= 0xe000) {
                    bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
                } else {
                    i++;
                    code = 0x10000 + (((code & 0x3ff) << 10) | (data.charCodeAt(i) & 0x3ff));
                    bytes.push(
                        0xf0 | (code >> 18),
                        0x80 | ((code >> 12) & 0x3f),
                        0x80 | ((code >> 6) & 0x3f),
                        0x80 | (code & 0x3f)
                    );
                }
            }
            this.parsedData = bytes;
        }

        QR8BitByte.prototype = {
            getLength: function () {
                return this.parsedData.length;
            },
            write: function (buffer) {
                for (var i = 0; i < this.parsedData.length; i++) {
                    buffer.put(this.parsedData[i], 8);
                }
            }
        };

        function QRBitBuffer() {
            this.buffer = [];
            this.length = 0;
        }

        QRBitBuffer.prototype = {
            get: function (index) {
                var bufIndex = Math.floor(index / 8);
                return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1;
            },
            put: function (num, length) {
                for (var i = 0; i < length; i++) {
                    this.putBit(((num >>> (length - i - 1)) & 1) === 1);
                }
            },
            getLengthInBits: function () {
                return this.length;
            },
            putBit: function (bit) {
                var bufIndex = Math.floor(this.length / 8);
                if (this.buffer.length <= bufIndex) {
                    this.buffer.push(0);
                }
                if (bit) {
                    this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
                }
                this.length++;
            }
        };

        return {
            createQR: function (text, eccLevel) {
                const eccMap = { L: 1, M: 0, Q: 3, H: 2 };
                const qr = new QRCodeModel(0, eccMap[eccLevel] !== undefined ? eccMap[eccLevel] : 0);
                qr.addData(text);
                qr.make();
                return qr;
            }
        };
    })();

    // =========================================================================
    // 2. DevTools Hub Module Definition
    // =========================================================================
    const QRCodeTool = {
        name: 'QR Code Generator & Scanner',
        icon: '📱',
        category: 'Generator',
        description: 'Tạo mã QR tùy chỉnh (URL, Wi-Fi, vCard) & Giải mã QR từ ảnh',

        render(container) {
            container.innerHTML = `
                <div class="tool-panel">
                    <div class="tool-header">
                        <h2>📱 QR Code Generator & Scanner</h2>
                        <p class="tool-description">Tạo mã QR tùy chỉnh (URL, Wi-Fi, vCard), xuất PNG/SVG và giải mã QR từ hình ảnh/clipboard 100% Offline.</p>
                    </div>

                    <!-- Mode Selector Tabs -->
                    <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                        <button class="tool-btn tool-btn-primary" id="tab-btn-generate" style="flex: 1;">🔲 Tạo mã QR (Generate)</button>
                        <button class="tool-btn" id="tab-btn-scan" style="flex: 1;">🔍 Đọc / Giải mã QR (Scan & Decode)</button>
                    </div>

                    <!-- TAB 1: GENERATE QR CODE -->
                    <div id="tab-generate">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;">
                            
                            <!-- Left Settings Panel -->
                            <div>
                                <!-- Content Type -->
                                <div class="tool-group">
                                    <label class="tool-label">Loại nội dung QR</label>
                                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                        <button class="tool-btn tool-btn-primary qr-type-btn" data-type="text">🔗 URL / Text</button>
                                        <button class="tool-btn qr-type-btn" data-type="wifi">📶 Mạng Wi-Fi</button>
                                        <button class="tool-btn qr-type-btn" data-type="vcard">👤 Danh thiếp (vCard)</button>
                                    </div>
                                </div>

                                <!-- Text/URL Form -->
                                <div id="form-type-text" class="qr-form-section">
                                    <div class="tool-group">
                                        <label class="tool-label" for="qr-input-text">Văn bản / Đường dẫn Web (URL)</label>
                                        <textarea class="tool-textarea" id="qr-input-text" style="height: 110px;" placeholder="Nhập đường dẫn https://... hoặc nội dung cần tạo QR..."></textarea>
                                    </div>
                                </div>

                                <!-- Wi-Fi Form -->
                                <div id="form-type-wifi" class="qr-form-section" style="display: none;">
                                    <div class="tool-group">
                                        <label class="tool-label" for="wifi-ssid">Tên Wi-Fi (SSID)</label>
                                        <input type="text" class="tool-input" id="wifi-ssid" placeholder="Nhập tên mạng Wi-Fi...">
                                    </div>
                                    <div class="tool-group">
                                        <label class="tool-label" for="wifi-pass">Mật khẩu Wi-Fi</label>
                                        <input type="text" class="tool-input" id="wifi-pass" placeholder="Nhập mật khẩu...">
                                    </div>
                                    <div class="tool-group">
                                        <label class="tool-label" for="wifi-type">Mã hóa (Security)</label>
                                        <select class="tool-select" id="wifi-type">
                                            <option value="WPA">WPA / WPA2 / WPA3 (Phổ biến)</option>
                                            <option value="WEP">WEP</option>
                                            <option value="nopass">Không có mật khẩu (Mạng mở)</option>
                                        </select>
                                    </div>
                                    <div class="tool-inline" style="margin-top: 8px;">
                                        <label class="tool-checkbox">
                                            <input type="checkbox" id="wifi-hidden">
                                            <span>Mạng Wi-Fi ẩn (Hidden SSID)</span>
                                        </label>
                                    </div>
                                </div>

                                <!-- vCard Form -->
                                <div id="form-type-vcard" class="qr-form-section" style="display: none;">
                                    <div class="tool-group">
                                        <label class="tool-label" for="vcard-name">Họ và tên</label>
                                        <input type="text" class="tool-input" id="vcard-name" placeholder="Nguyễn Văn A">
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                        <div class="tool-group">
                                            <label class="tool-label" for="vcard-phone">Số điện thoại</label>
                                            <input type="text" class="tool-input" id="vcard-phone" placeholder="0901234567">
                                        </div>
                                        <div class="tool-group">
                                            <label class="tool-label" for="vcard-email">Email</label>
                                            <input type="email" class="tool-input" id="vcard-email" placeholder="name@example.com">
                                        </div>
                                    </div>
                                    <div class="tool-group">
                                        <label class="tool-label" for="vcard-company">Công ty / Chức danh</label>
                                        <input type="text" class="tool-input" id="vcard-company" placeholder="DevTools Hub Corp">
                                    </div>
                                </div>

                                <!-- Customization Options Accordion -->
                                <div style="margin-top: 20px; border-top: 1px dashed var(--border-color); padding-top: 16px;">
                                    <h3 style="font-size: var(--fs-md); margin-bottom: 12px; color: var(--text-primary);">🎨 Tùy chỉnh hiển thị</h3>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                        <div class="tool-group">
                                            <label class="tool-label" for="qr-fg-color">Màu QR Code</label>
                                            <input type="color" class="tool-input" id="qr-fg-color" value="#000000" style="height: 38px; cursor: pointer; padding: 4px;">
                                        </div>
                                        <div class="tool-group">
                                            <label class="tool-label" for="qr-bg-color">Màu nền (Background)</label>
                                            <input type="color" class="tool-input" id="qr-bg-color" value="#ffffff" style="height: 38px; cursor: pointer; padding: 4px;">
                                        </div>
                                    </div>

                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                        <div class="tool-group">
                                            <label class="tool-label" for="qr-size">Kích thước (px)</label>
                                            <select class="tool-select" id="qr-size">
                                                <option value="200">200 x 200 px</option>
                                                <option value="300" selected>300 x 300 px</option>
                                                <option value="500">500 x 500 px</option>
                                                <option value="800">800 x 800 px</option>
                                            </select>
                                        </div>
                                        <div class="tool-group">
                                            <label class="tool-label" for="qr-ecc">Sửa lỗi (ECC Level)</label>
                                            <select class="tool-select" id="qr-ecc">
                                                <option value="L">L (7% Error Correction)</option>
                                                <option value="M" selected>M (15% Error Correction)</option>
                                                <option value="Q">Q (25% Error Correction)</option>
                                                <option value="H">H (30% High Reliability)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right Live Preview & Export Panel -->
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 24px;">
                                <div style="font-weight: var(--fw-semibold); margin-bottom: 16px; color: var(--text-secondary);">Live Interactive Preview</div>
                                
                                <div id="qr-canvas-wrapper" style="padding: 16px; background: #ffffff; border-radius: var(--radius-md); box-shadow: 0 8px 24px rgba(0,0,0,0.12); display: flex; justify-content: center; align-items: center; min-width: 240px; min-height: 240px;">
                                    <canvas id="qr-canvas"></canvas>
                                </div>

                                <div id="qr-status-msg" style="margin-top: 12px; font-size: var(--fs-xs); color: var(--text-tertiary); text-align: center;"></div>

                                <!-- Action Export Buttons -->
                                <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; width: 100%; justify-content: center;">
                                    <button class="tool-btn tool-btn-primary" id="btn-download-png">📥 Tải PNG</button>
                                    <button class="tool-btn" id="btn-download-svg">📐 Tải SVG</button>
                                    <button class="tool-btn" id="btn-copy-base64">📋 Copy Base64</button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- TAB 2: SCAN & DECODE QR CODE -->
                    <div id="tab-scan" style="display: none;">
                        <div style="max-width: 640px; margin: 0 auto;">
                            
                            <!-- Dropzone & Upload Input -->
                            <div id="qr-dropzone" style="border: 2px dashed var(--accent-primary); border-radius: var(--radius-lg); padding: 36px 20px; text-align: center; cursor: pointer; transition: background 0.2s ease; background: var(--bg-card);">
                                <div style="font-size: 3rem; margin-bottom: 12px;">📷</div>
                                <div style="font-weight: var(--fw-semibold); font-size: var(--fs-lg); margin-bottom: 8px;">Kéo & thả ảnh chứa mã QR vào đây</div>
                                <div style="font-size: var(--fs-sm); color: var(--text-secondary); margin-bottom: 16px;">Hoặc nhấn để chọn file ảnh từ máy tính / Hoặc dán trực tiếp từ Clipboard (<kbd>Ctrl + V</kbd>)</div>
                                <input type="file" id="qr-file-input" accept="image/*" style="display: none;">
                                <button class="tool-btn tool-btn-primary" id="btn-browse-file">📁 Chọn file ảnh</button>
                            </div>

                            <!-- Preview of uploaded image -->
                            <div id="scan-preview-container" style="display: none; margin-top: 20px; text-align: center;">
                                <img id="scan-preview-img" style="max-height: 250px; max-width: 100%; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                            </div>

                            <!-- Scan Output Result -->
                            <div id="scan-result-panel" style="margin-top: 24px; display: none;">
                                <label class="tool-label" style="color: var(--accent-success); font-weight: var(--fw-bold);">✅ Kết quả giải mã QR:</label>
                                <div class="tool-result">
                                    <textarea class="tool-textarea" id="scan-result-text" readonly style="height: 120px; font-family: var(--font-mono);"></textarea>
                                    <button class="tool-copy-btn" id="btn-copy-scan-result" title="Copy kết quả">📋</button>
                                </div>
                                <div style="display: flex; gap: 10px; margin-top: 12px;">
                                    <button class="tool-btn tool-btn-primary" id="btn-open-scan-url" style="display: none;">🔗 Mở đường dẫn URL</button>
                                    <button class="tool-btn tool-btn-danger" id="btn-clear-scan">🗑️ Xóa kết quả</button>
                                </div>
                            </div>

                            <!-- Scan Error -->
                            <div id="scan-error-msg" style="display: none; margin-top: 16px;" class="tool-info">
                                ❌ Không thể quét mã QR từ hình ảnh này. Trình duyệt của bạn có thể cần ảnh rõ nét hơn hoặc thử chọn ảnh có mã QR đơn giản hơn.
                            </div>

                        </div>
                    </div>

                </div>
            `;

            this.initEvents(container);
        },

        initEvents(container) {
            let activeType = 'text';

            // DOM elements
            const tabBtnGenerate = container.querySelector('#tab-btn-generate');
            const tabBtnScan = container.querySelector('#tab-btn-scan');
            const tabGenerate = container.querySelector('#tab-generate');
            const tabScan = container.querySelector('#tab-scan');

            const qrTypeBtns = container.querySelectorAll('.qr-type-btn');
            const formText = container.querySelector('#form-type-text');
            const formWifi = container.querySelector('#form-type-wifi');
            const formVcard = container.querySelector('#form-type-vcard');

            const inputText = container.querySelector('#qr-input-text');
            const wifiSsid = container.querySelector('#wifi-ssid');
            const wifiPass = container.querySelector('#wifi-pass');
            const wifiType = container.querySelector('#wifi-type');
            const wifiHidden = container.querySelector('#wifi-hidden');

            const vcardName = container.querySelector('#vcard-name');
            const vcardPhone = container.querySelector('#vcard-phone');
            const vcardEmail = container.querySelector('#vcard-email');
            const vcardCompany = container.querySelector('#vcard-company');

            const qrFgColor = container.querySelector('#qr-fg-color');
            const qrBgColor = container.querySelector('#qr-bg-color');
            const qrSize = container.querySelector('#qr-size');
            const qrEcc = container.querySelector('#qr-ecc');

            const canvas = container.querySelector('#qr-canvas');
            const statusMsg = container.querySelector('#qr-status-msg');

            const btnPng = container.querySelector('#btn-download-png');
            const btnSvg = container.querySelector('#btn-download-svg');
            const btnCopyBase64 = container.querySelector('#btn-copy-base64');

            // Scan Tab elements
            const dropzone = container.querySelector('#qr-dropzone');
            const fileInput = container.querySelector('#qr-file-input');
            const btnBrowseFile = container.querySelector('#btn-browse-file');
            const scanPreviewImg = container.querySelector('#scan-preview-img');
            const scanPreviewContainer = container.querySelector('#scan-preview-container');
            const scanResultPanel = container.querySelector('#scan-result-panel');
            const scanResultText = container.querySelector('#scan-result-text');
            const scanErrorMsg = container.querySelector('#scan-error-msg');
            const btnOpenScanUrl = container.querySelector('#btn-open-scan-url');
            const btnCopyScanResult = container.querySelector('#btn-copy-scan-result');
            const btnClearScan = container.querySelector('#btn-clear-scan');

            // --- Tab Switching ---
            tabBtnGenerate.addEventListener('click', () => {
                tabBtnGenerate.classList.add('tool-btn-primary');
                tabBtnScan.classList.remove('tool-btn-primary');
                tabGenerate.style.display = '';
                tabScan.style.display = 'none';
                updateQR();
            });

            tabBtnScan.addEventListener('click', () => {
                tabBtnScan.classList.add('tool-btn-primary');
                tabBtnGenerate.classList.remove('tool-btn-primary');
                tabScan.style.display = '';
                tabGenerate.style.display = 'none';
            });

            // --- Type Switching ---
            qrTypeBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    qrTypeBtns.forEach(b => b.classList.remove('tool-btn-primary'));
                    btn.classList.add('tool-btn-primary');
                    activeType = btn.dataset.type;

                    formText.style.display = activeType === 'text' ? '' : 'none';
                    formWifi.style.display = activeType === 'wifi' ? '' : 'none';
                    formVcard.style.display = activeType === 'vcard' ? '' : 'none';

                    updateQR();
                });
            });

            // --- Construct Content Payload ---
            function getPayload() {
                if (activeType === 'text') {
                    return inputText.value.trim() || 'https://devtools-hub.com';
                }
                if (activeType === 'wifi') {
                    const ssid = wifiSsid.value.trim();
                    if (!ssid) return 'WIFI:S:MyWifiNetwork;T:WPA;P:Password123;;';
                    const pass = wifiPass.value;
                    const type = wifiType.value;
                    const hidden = wifiHidden.checked ? 'H:true;' : '';
                    return `WIFI:S:${ssid};T:${type};P:${pass};${hidden};`;
                }
                if (activeType === 'vcard') {
                    const name = vcardName.value.trim() || 'Nguyen Van A';
                    const phone = vcardPhone.value.trim();
                    const email = vcardEmail.value.trim();
                    const company = vcardCompany.value.trim();
                    let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nN:${name};;;;`;
                    if (company) vcard += `\nORG:${company}`;
                    if (phone) vcard += `\nTEL;TYPE=CELL:${phone}`;
                    if (email) vcard += `\nEMAIL:${email}`;
                    vcard += `\nEND:VCARD`;
                    return vcard;
                }
                return 'DevTools Hub';
            }

            // --- Render QR Code onto Canvas ---
            function updateQR() {
                const payload = getPayload();
                const size = parseInt(qrSize.value, 10);
                const ecc = qrEcc.value;
                const fgColor = qrFgColor.value;
                const bgColor = qrBgColor.value;

                try {
                    const qrModel = QRCodeLib.createQR(payload, ecc);
                    const moduleCount = qrModel.getModuleCount();
                    const margin = 2; // quiet zone in modules
                    const totalModules = moduleCount + margin * 2;
                    const cellSize = size / totalModules;

                    canvas.width = size;
                    canvas.height = size;
                    canvas.style.width = '240px';
                    canvas.style.height = '240px';

                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, size, size);

                    ctx.fillStyle = fgColor;
                    for (let r = 0; r < moduleCount; r++) {
                        for (let c = 0; c < moduleCount; c++) {
                            if (qrModel.isDark(r, c)) {
                                const x = Math.round((c + margin) * cellSize);
                                const y = Math.round((r + margin) * cellSize);
                                const w = Math.ceil((c + margin + 1) * cellSize) - x;
                                const h = Math.ceil((r + margin + 1) * cellSize) - y;
                                ctx.fillRect(x, y, w, h);
                            }
                        }
                    }

                    statusMsg.textContent = `Version ${qrModel.typeNumber} (${moduleCount}x${moduleCount}) | Độ dài: ${payload.length} ký tự`;
                    statusMsg.style.color = 'var(--text-tertiary)';
                } catch (err) {
                    console.error('QR Render Error:', err);
                    statusMsg.textContent = `❌ ${err.message || 'Dữ liệu quá dài so với phiên bản QR hiện tại'}`;
                    statusMsg.style.color = 'var(--accent-danger)';
                }
            }

            // --- Bind real-time input events ---
            const inputsToBind = [
                inputText, wifiSsid, wifiPass, wifiType, wifiHidden,
                vcardName, vcardPhone, vcardEmail, vcardCompany,
                qrFgColor, qrBgColor, qrSize, qrEcc
            ];

            inputsToBind.forEach(el => {
                if (el) {
                    el.addEventListener('input', updateQR);
                    el.addEventListener('change', updateQR);
                    el.addEventListener('keyup', updateQR);
                }
            });

            // Default initial value & render
            inputText.value = 'https://devtools-hub.com';
            setTimeout(updateQR, 50);

            // --- Export Actions ---
            btnPng.addEventListener('click', () => {
                const link = document.createElement('a');
                link.download = 'qrcode.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                if (window.showToast) window.showToast('Đã tải xuống file qrcode.png!', 'success');
            });

            btnSvg.addEventListener('click', () => {
                const payload = getPayload();
                const ecc = qrEcc.value;
                const fgColor = qrFgColor.value;
                const bgColor = qrBgColor.value;

                try {
                    const qrModel = QRCodeLib.createQR(payload, ecc);
                    const moduleCount = qrModel.getModuleCount();
                    const margin = 2;
                    const totalSize = moduleCount + margin * 2;

                    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="500" height="500">`;
                    svg += `<rect width="${totalSize}" height="${totalSize}" fill="${bgColor}"/>`;
                    svg += `<path fill="${fgColor}" d="`;

                    let pathData = '';
                    for (let r = 0; r < moduleCount; r++) {
                        for (let c = 0; c < moduleCount; c++) {
                            if (qrModel.isDark(r, c)) {
                                pathData += `M${c + margin},${r + margin}h1v1h-1z `;
                            }
                        }
                    }
                    svg += `${pathData}"/>\n</svg>`;

                    const blob = new Blob([svg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'qrcode.svg';
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                    if (window.showToast) window.showToast('Đã tải xuống file qrcode.svg!', 'success');
                } catch (e) {
                    if (window.showToast) window.showToast('Lỗi khi tạo file SVG', 'error');
                }
            });

            btnCopyBase64.addEventListener('click', () => {
                const base64 = canvas.toDataURL('image/png');
                if (window.copyToClipboard) window.copyToClipboard(base64, btnCopyBase64);
            });

            // =========================================================================
            // SCAN / DECODE LOGIC
            // =========================================================================
            if (btnBrowseFile) {
                btnBrowseFile.addEventListener('click', (e) => {
                    e.preventDefault();
                    fileInput.click();
                });
            }

            dropzone.addEventListener('click', (e) => {
                if (e.target !== btnBrowseFile) {
                    fileInput.click();
                }
            });

            function processScanImage(imageSource) {
                scanErrorMsg.style.display = 'none';
                scanResultPanel.style.display = 'none';

                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.onload = async () => {
                    scanPreviewImg.src = img.src;
                    scanPreviewContainer.style.display = '';

                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = img.naturalWidth || img.width;
                    tempCanvas.height = img.naturalHeight || img.height;
                    const ctx = tempCanvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    // Native BarcodeDetector API if available in browser
                    if ('BarcodeDetector' in window) {
                        try {
                            const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
                            const barcodes = await barcodeDetector.detect(tempCanvas);
                            if (barcodes && barcodes.length > 0) {
                                displayScanResult(barcodes[0].rawValue);
                                return;
                            }
                        } catch (e) {
                            console.warn('BarcodeDetector fallback:', e);
                        }
                    }

                    scanErrorMsg.style.display = '';
                };
                img.onerror = () => {
                    scanErrorMsg.style.display = '';
                };
                img.src = imageSource;
            }

            function displayScanResult(text) {
                scanErrorMsg.style.display = 'none';
                scanResultPanel.style.display = '';
                scanResultText.value = text;

                const isUrl = /^https?:\/\/[^\s]+$/i.test(text.trim());
                if (isUrl) {
                    btnOpenScanUrl.style.display = '';
                    btnOpenScanUrl.onclick = () => window.open(text.trim(), '_blank');
                } else {
                    btnOpenScanUrl.style.display = 'none';
                }
                if (window.showToast) window.showToast('Đã giải mã QR thành công!', 'success');
            }

            // Drag & Drop
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropzone.style.background = 'var(--bg-hover)';
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.style.background = 'var(--bg-card)';
            });

            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropzone.style.background = 'var(--bg-card)';
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => processScanImage(event.target.result);
                    reader.readAsDataURL(e.dataTransfer.files[0]);
                }
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => processScanImage(event.target.result);
                    reader.readAsDataURL(e.target.files[0]);
                }
            });

            document.addEventListener('paste', (e) => {
                if (tabScan.style.display === 'none') return;
                const items = (e.clipboardData || e.originalEvent.clipboardData).items;
                for (let index = 0; index < items.length; index++) {
                    const item = items[index];
                    if (item.kind === 'file' && item.type.startsWith('image/')) {
                        const blob = item.getAsFile();
                        const reader = new FileReader();
                        reader.onload = (event) => processScanImage(event.target.result);
                        reader.readAsDataURL(blob);
                        break;
                    }
                }
            });

            btnCopyScanResult.addEventListener('click', () => {
                if (window.copyToClipboard) window.copyToClipboard(scanResultText.value, btnCopyScanResult);
            });

            btnClearScan.addEventListener('click', () => {
                scanResultText.value = '';
                scanResultPanel.style.display = 'none';
                scanPreviewContainer.style.display = 'none';
                scanErrorMsg.style.display = 'none';
                fileInput.value = '';
            });
        }
    };

    // Register tool globally
    window.DevTools = window.DevTools || [];
    window.DevTools.push(QRCodeTool);
})();
