const HttpStatusCodesTool = {
    name: 'HTTP Status Codes',
    icon: '🌐',
    category: 'Reference',
    description: 'Tra cứu nhanh HTTP Status Codes và ý nghĩa',

    statusCodes: [
        { code: 100, name: 'Continue', category: '1xx', isCommon: false, short: 'Tiếp tục', desc: 'Máy chủ đã nhận được phần đầu của yêu cầu và máy khách nên tiếp tục gửi phần còn lại.', useCase: 'Thường dùng trong các yêu cầu lớn như upload file.' },
        { code: 101, name: 'Switching Protocols', category: '1xx', isCommon: false, short: 'Đổi giao thức', desc: 'Máy chủ đồng ý thay đổi giao thức theo yêu cầu của máy khách.', useCase: 'Nâng cấp từ HTTP lên WebSockets.' },
        { code: 102, name: 'Processing', category: '1xx', isCommon: false, short: 'Đang xử lý', desc: 'Máy chủ đã nhận và đang xử lý yêu cầu, nhưng chưa có phản hồi.', useCase: 'Tránh timeout cho các yêu cầu WebDAV mất nhiều thời gian.' },
        { code: 103, name: 'Early Hints', category: '1xx', isCommon: false, short: 'Gợi ý sớm', desc: 'Trả về một số header phản hồi trước khi thông điệp HTTP cuối cùng sẵn sàng.', useCase: 'Preload các tài nguyên tĩnh như CSS/JS.' },
        
        { code: 200, name: 'OK', category: '2xx', isCommon: true, short: 'Thành công', desc: 'Yêu cầu đã được xử lý thành công.', useCase: 'Phản hồi tiêu chuẩn cho các yêu cầu GET thành công.' },
        { code: 201, name: 'Created', category: '2xx', isCommon: true, short: 'Đã tạo', desc: 'Yêu cầu thành công và một tài nguyên mới đã được tạo.', useCase: 'Phản hồi cho yêu cầu POST/PUT khi tạo mới dữ liệu.' },
        { code: 202, name: 'Accepted', category: '2xx', isCommon: false, short: 'Đã chấp nhận', desc: 'Yêu cầu đã được chấp nhận để xử lý, nhưng quá trình xử lý chưa hoàn tất.', useCase: 'Xử lý bất đồng bộ (ví dụ: hàng đợi background jobs).' },
        { code: 203, name: 'Non-Authoritative Information', category: '2xx', isCommon: false, short: 'Thông tin không chính thức', desc: 'Phản hồi thành công nhưng dữ liệu đã bị sửa đổi bởi proxy.', useCase: 'Sử dụng qua các proxy hoặc cache.' },
        { code: 204, name: 'No Content', category: '2xx', isCommon: true, short: 'Không có nội dung', desc: 'Xử lý thành công nhưng không có nội dung nào được trả về.', useCase: 'Thành công khi gọi DELETE hoặc PUT nhưng không cần trả data.' },
        { code: 205, name: 'Reset Content', category: '2xx', isCommon: false, short: 'Đặt lại nội dung', desc: 'Yêu cầu client reset lại view đang hiển thị.', useCase: 'Xóa form sau khi submit thành công.' },
        { code: 206, name: 'Partial Content', category: '2xx', isCommon: false, short: 'Nội dung một phần', desc: 'Phản hồi một phần tài nguyên do client gửi Range header.', useCase: 'Streaming video/audio hoặc resume download.' },
        { code: 207, name: 'Multi-Status', category: '2xx', isCommon: false, short: 'Đa trạng thái', desc: 'Cung cấp trạng thái cho nhiều hoạt động độc lập.', useCase: 'WebDAV khi thực hiện nhiều thao tác cùng lúc.' },
        { code: 208, name: 'Already Reported', category: '2xx', isCommon: false, short: 'Đã báo cáo', desc: 'Các thành viên trong ràng buộc WebDAV đã được liệt kê trước đó.', useCase: 'Tránh liệt kê lặp lại trong WebDAV.' },
        { code: 226, name: 'IM Used', category: '2xx', isCommon: false, short: 'Đã sử dụng IM', desc: 'Máy chủ đã hoàn thành yêu cầu GET và phản hồi là kết quả của các thao tác instance.', useCase: 'Delta encoding.' },

        { code: 300, name: 'Multiple Choices', category: '3xx', isCommon: false, short: 'Nhiều lựa chọn', desc: 'Có nhiều tùy chọn cho tài nguyên yêu cầu và client có thể chọn.', useCase: 'Cung cấp nhiều định dạng video khác nhau.' },
        { code: 301, name: 'Moved Permanently', category: '3xx', isCommon: true, short: 'Đã chuyển vĩnh viễn', desc: 'Tài nguyên đã được chuyển hẳn sang URL mới.', useCase: 'Chuyển hướng SEO khi thay đổi domain hoặc URL.' },
        { code: 302, name: 'Found', category: '3xx', isCommon: true, short: 'Đã tìm thấy', desc: 'Tài nguyên tạm thời nằm ở URL khác.', useCase: 'Chuyển hướng tạm thời (ví dụ: sang trang đăng nhập).' },
        { code: 303, name: 'See Other', category: '3xx', isCommon: false, short: 'Xem ở nơi khác', desc: 'Phản hồi có thể được tìm thấy bằng cách thực hiện một GET đến URL khác.', useCase: 'Chuyển hướng sau khi POST (Post/Redirect/Get).' },
        { code: 304, name: 'Not Modified', category: '3xx', isCommon: true, short: 'Không sửa đổi', desc: 'Tài nguyên không thay đổi kể từ lần cuối truy cập.', useCase: 'Tối ưu caching, báo cho trình duyệt dùng bản cache cục bộ.' },
        { code: 305, name: 'Use Proxy', category: '3xx', isCommon: false, short: 'Sử dụng Proxy', desc: 'Phải truy cập tài nguyên thông qua proxy.', useCase: 'Không còn sử dụng rộng rãi vì lý do bảo mật.' },
        { code: 307, name: 'Temporary Redirect', category: '3xx', isCommon: false, short: 'Chuyển hướng tạm thời', desc: 'Giống 302, nhưng phương thức HTTP (GET/POST) không được thay đổi.', useCase: 'Chuyển hướng nhưng cần giữ nguyên payload và method.' },
        { code: 308, name: 'Permanent Redirect', category: '3xx', isCommon: false, short: 'Chuyển hướng vĩnh viễn', desc: 'Giống 301, nhưng không cho phép đổi phương thức.', useCase: 'Thay thế 301 khi muốn bảo toàn method.' },

        { code: 400, name: 'Bad Request', category: '4xx', isCommon: true, short: 'Yêu cầu không hợp lệ', desc: 'Máy chủ không thể xử lý yêu cầu do lỗi từ phía máy khách (cú pháp sai, dữ liệu hỏng...).', useCase: 'Validation form bị lỗi, payload JSON không đúng format.' },
        { code: 401, name: 'Unauthorized', category: '4xx', isCommon: true, short: 'Không được phép', desc: 'Yêu cầu cần xác thực người dùng.', useCase: 'Chưa đăng nhập hoặc token hết hạn.' },
        { code: 402, name: 'Payment Required', category: '4xx', isCommon: false, short: 'Yêu cầu thanh toán', desc: 'Dự trữ cho tương lai. Thường dùng trong hệ thống có trả phí.', useCase: 'Tài khoản hết tiền, API limit theo quota gói trả phí.' },
        { code: 403, name: 'Forbidden', category: '4xx', isCommon: true, short: 'Bị cấm', desc: 'Máy chủ hiểu yêu cầu nhưng từ chối cấp quyền truy cập.', useCase: 'Đã đăng nhập nhưng không đủ quyền (ví dụ user vào trang admin).' },
        { code: 404, name: 'Not Found', category: '4xx', isCommon: true, short: 'Không tìm thấy', desc: 'Tài nguyên không tồn tại.', useCase: 'Trang web hoặc endpoint API không tồn tại.' },
        { code: 405, name: 'Method Not Allowed', category: '4xx', isCommon: true, short: 'Phương thức không cho phép', desc: 'Phương thức HTTP không được hỗ trợ trên route này.', useCase: 'Gọi POST vào một route chỉ hỗ trợ GET.' },
        { code: 406, name: 'Not Acceptable', category: '4xx', isCommon: false, short: 'Không thể chấp nhận', desc: 'Máy chủ không thể tạo ra phản hồi phù hợp với Accept header của client.', useCase: 'Client yêu cầu XML nhưng server chỉ có JSON.' },
        { code: 407, name: 'Proxy Authentication Required', category: '4xx', isCommon: false, short: 'Yêu cầu xác thực Proxy', desc: 'Giống 401 nhưng client phải xác thực với proxy.', useCase: 'Truy cập mạng nội bộ cần qua proxy proxy.' },
        { code: 408, name: 'Request Timeout', category: '4xx', isCommon: false, short: 'Hết thời gian yêu cầu', desc: 'Máy chủ hết thời gian chờ yêu cầu từ client.', useCase: 'Mạng client quá chậm không gửi đủ payload trong thời gian cho phép.' },
        { code: 409, name: 'Conflict', category: '4xx', isCommon: true, short: 'Xung đột', desc: 'Yêu cầu xung đột với trạng thái hiện tại của máy chủ.', useCase: 'Tạo tài khoản với email/username đã tồn tại.' },
        { code: 410, name: 'Gone', category: '4xx', isCommon: false, short: 'Đã mất', desc: 'Tài nguyên không còn tồn tại và sẽ không quay lại.', useCase: 'API endpoint đã bị xóa vĩnh viễn (tốt hơn 404 cho SEO).' },
        { code: 411, name: 'Length Required', category: '4xx', isCommon: false, short: 'Cần chiều dài', desc: 'Máy chủ từ chối yêu cầu không có header Content-Length.', useCase: 'Upload stream không xác định dung lượng (hiếm gặp).' },
        { code: 412, name: 'Precondition Failed', category: '4xx', isCommon: false, short: 'Điều kiện tiên quyết thất bại', desc: 'Máy chủ không đáp ứng một trong các điều kiện tiền đề do client đưa ra trong header.', useCase: 'Tránh cập nhật đè dữ liệu nếu có người khác sửa.' },
        { code: 413, name: 'Payload Too Large', category: '4xx', isCommon: false, short: 'Payload quá lớn', desc: 'Thân yêu cầu lớn hơn giới hạn máy chủ cho phép.', useCase: 'Upload file quá dung lượng quy định.' },
        { code: 414, name: 'URI Too Long', category: '4xx', isCommon: false, short: 'URI quá dài', desc: 'URI do client cung cấp quá dài để máy chủ xử lý.', useCase: 'Gửi chuỗi truy vấn GET khổng lồ (nên chuyển sang POST).' },
        { code: 415, name: 'Unsupported Media Type', category: '4xx', isCommon: false, short: 'Loại phương tiện không hỗ trợ', desc: 'Định dạng dữ liệu không được hỗ trợ.', useCase: 'Gửi XML vào API chỉ nhận JSON.' },
        { code: 416, name: 'Range Not Satisfiable', category: '4xx', isCommon: false, short: 'Phạm vi không thể đáp ứng', desc: 'Phần file yêu cầu bởi client không thể trả về (ví dụ vượt quá kích thước file).', useCase: 'Tải resume một file nhưng byte yêu cầu ngoài dung lượng.' },
        { code: 417, name: 'Expectation Failed', category: '4xx', isCommon: false, short: 'Kỳ vọng thất bại', desc: 'Máy chủ không thể đáp ứng yêu cầu Expect trong header.', useCase: 'Server proxy trung gian không hỗ trợ Expect: 100-continue.' },
        { code: 418, name: 'I\'m a teapot', category: '4xx', isCommon: false, short: 'Tôi là ấm trà', desc: 'Mã lỗi đùa của RFC 2324, máy chủ từ chối pha cà phê vì nó là ấm trà.', useCase: 'Easter eggs.' },
        { code: 421, name: 'Misdirected Request', category: '4xx', isCommon: false, short: 'Yêu cầu sai hướng', desc: 'Yêu cầu nhắm đến một máy chủ không thể tạo ra phản hồi.', useCase: 'Lỗi cấu hình HTTP/2 TLS.' },
        { code: 422, name: 'Unprocessable Entity', category: '4xx', isCommon: true, short: 'Thực thể không thể xử lý', desc: 'Yêu cầu hợp lệ, nhưng dữ liệu không phù hợp (logic lỗi).', useCase: 'Validation lỗi (ví dụ mật khẩu quá ngắn).' },
        { code: 423, name: 'Locked', category: '4xx', isCommon: false, short: 'Đã khóa', desc: 'Tài nguyên đang bị khóa.', useCase: 'WebDAV khi tài nguyên đang được người khác chỉnh sửa.' },
        { code: 424, name: 'Failed Dependency', category: '4xx', isCommon: false, short: 'Phụ thuộc thất bại', desc: 'Yêu cầu thất bại do yêu cầu trước đó nó phụ thuộc vào đã thất bại.', useCase: 'WebDAV PROPPATCH lỗi.' },
        { code: 425, name: 'Too Early', category: '4xx', isCommon: false, short: 'Quá sớm', desc: 'Máy chủ không muốn mạo hiểm xử lý yêu cầu có thể bị replay lại.', useCase: 'Chống tấn công Replay trên TLS 1.3.' },
        { code: 426, name: 'Upgrade Required', category: '4xx', isCommon: false, short: 'Yêu cầu nâng cấp', desc: 'Máy chủ từ chối thực hiện bằng giao thức hiện tại, yêu cầu nâng cấp.', useCase: 'Bắt buộc client dùng TLS 1.2+ thay vì cũ hơn.' },
        { code: 428, name: 'Precondition Required', category: '4xx', isCommon: false, short: 'Cần điều kiện tiên quyết', desc: 'Máy chủ yêu cầu yêu cầu phải có các điều kiện tiên quyết.', useCase: 'Tránh lỗi Lost Update.' },
        { code: 429, name: 'Too Many Requests', category: '4xx', isCommon: true, short: 'Quá nhiều yêu cầu', desc: 'Người dùng đã gửi quá nhiều yêu cầu trong một khoảng thời gian (Rate limiting).', useCase: 'Chặn spam, DDoS, giới hạn gọi API (Rate Limit).' },
        { code: 431, name: 'Request Header Fields Too Large', category: '4xx', isCommon: false, short: 'Header quá lớn', desc: 'Máy chủ không muốn xử lý vì kích thước header quá lớn.', useCase: 'Cookie hoặc token gửi kèm quá dài.' },
        { code: 451, name: 'Unavailable For Legal Reasons', category: '4xx', isCommon: false, short: 'Không khả dụng vì lý do pháp lý', desc: 'Người dùng yêu cầu tài nguyên không thể được phục vụ do lý do pháp lý.', useCase: 'Kiểm duyệt của chính phủ, vi phạm bản quyền DMCA.' },

        { code: 500, name: 'Internal Server Error', category: '5xx', isCommon: true, short: 'Lỗi máy chủ nội bộ', desc: 'Máy chủ gặp lỗi bất ngờ không thể xử lý yêu cầu.', useCase: 'Code backend có bug gây crash (NullPointerException...).' },
        { code: 501, name: 'Not Implemented', category: '5xx', isCommon: false, short: 'Chưa triển khai', desc: 'Máy chủ không hỗ trợ tính năng cần thiết để hoàn thành yêu cầu.', useCase: 'Server chưa hỗ trợ phương thức PATCH.' },
        { code: 502, name: 'Bad Gateway', category: '5xx', isCommon: true, short: 'Gateway lỗi', desc: 'Máy chủ đóng vai trò gateway/proxy nhận được phản hồi không hợp lệ từ máy chủ upstream.', useCase: 'Nginx nhận lỗi từ backend NodeJS.' },
        { code: 503, name: 'Service Unavailable', category: '5xx', isCommon: true, short: 'Dịch vụ không khả dụng', desc: 'Máy chủ hiện không sẵn sàng xử lý yêu cầu, thường do quá tải hoặc đang bảo trì.', useCase: 'Đang deploy hệ thống hoặc hệ thống quá tải.' },
        { code: 504, name: 'Gateway Timeout', category: '5xx', isCommon: true, short: 'Hết thời gian Gateway', desc: 'Máy chủ đóng vai trò gateway không nhận được phản hồi kịp thời từ máy chủ upstream.', useCase: 'Backend chạy tác vụ quá chậm, vượt qua timeout của Load Balancer.' },
        { code: 505, name: 'HTTP Version Not Supported', category: '5xx', isCommon: false, short: 'Phiên bản HTTP không hỗ trợ', desc: 'Phiên bản HTTP sử dụng không được hỗ trợ.', useCase: 'Client cũ dùng HTTP/1.0 vào server HTTP/2 only.' },
        { code: 506, name: 'Variant Also Negotiates', category: '5xx', isCommon: false, short: 'Lỗi đàm phán biến thể', desc: 'Lỗi cấu hình nội bộ máy chủ đàm phán nội dung trong suốt.', useCase: 'Lỗi cấu hình Apache.' },
        { code: 507, name: 'Insufficient Storage', category: '5xx', isCommon: false, short: 'Không đủ dung lượng', desc: 'Máy chủ không thể lưu trữ đại diện cần thiết để hoàn thành yêu cầu.', useCase: 'WebDAV bị đầy ổ cứng.' },
        { code: 508, name: 'Loop Detected', category: '5xx', isCommon: false, short: 'Phát hiện vòng lặp', desc: 'Máy chủ phát hiện ra vòng lặp vô hạn khi xử lý yêu cầu.', useCase: 'WebDAV chuyển hướng vô hạn.' },
        { code: 510, name: 'Not Extended', category: '5xx', isCommon: false, short: 'Không mở rộng', desc: 'Yêu cầu mở rộng thêm cho yêu cầu để máy chủ có thể hoàn thành nó.', useCase: 'Yêu cầu sử dụng extension HTTP chưa hỗ trợ.' },
        { code: 511, name: 'Network Authentication Required', category: '5xx', isCommon: false, short: 'Yêu cầu xác thực mạng', desc: 'Client cần xác thực để sử dụng mạng.', useCase: 'Wifi công cộng yêu cầu đăng nhập (Captive portal).' }
    ],

    render(container) {
        const style = document.createElement('style');
        style.textContent = `
            .hsc-container {
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
            }
            .hsc-controls {
                display: flex;
                flex-direction: column;
                gap: var(--space-md);
                background: var(--bg-secondary);
                padding: var(--space-md);
                border-radius: var(--radius-md);
                border: 1px solid var(--border-color);
                position: sticky;
                top: 0;
                z-index: 10;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .hsc-search {
                width: 100%;
            }
            .hsc-filters {
                display: flex;
                flex-wrap: wrap;
                gap: var(--space-sm);
            }
            .hsc-filter-btn {
                background: var(--bg-tertiary);
                border: 1px solid var(--border-color);
                color: var(--text-secondary);
                padding: 4px 12px;
                border-radius: 20px;
                font-size: var(--fs-sm);
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            .hsc-filter-btn:hover {
                background: var(--bg-input);
                color: var(--text-primary);
            }
            .hsc-filter-btn.active {
                background: var(--accent-primary);
                border-color: var(--accent-primary);
                color: white;
            }
            .hsc-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: var(--space-md);
                align-items: start;
            }
            .hsc-card {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                overflow: hidden;
                transition: all var(--transition-fast);
                cursor: pointer;
                position: relative;
            }
            .hsc-card:hover {
                border-color: var(--border-hover);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .hsc-card-header {
                padding: var(--space-md);
                display: flex;
                align-items: center;
                gap: var(--space-sm);
                border-bottom: 1px solid transparent;
                transition: all var(--transition-fast);
            }
            .hsc-card.expanded .hsc-card-header {
                border-bottom-color: var(--border-color);
            }
            .hsc-code {
                font-size: 1.5rem;
                font-weight: bold;
                font-family: var(--font-mono);
            }
            .hsc-name {
                font-weight: 500;
                font-size: var(--fs-base);
                flex: 1;
            }
            .hsc-common-badge {
                font-size: 0.65rem;
                background: var(--bg-tertiary);
                color: var(--text-secondary);
                padding: 2px 6px;
                border-radius: var(--radius-sm);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .hsc-card-body {
                padding: 0 var(--space-md);
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease, padding 0.3s ease;
                opacity: 0;
            }
            .hsc-card.expanded .hsc-card-body {
                padding: var(--space-md);
                max-height: 500px;
                opacity: 1;
            }
            .hsc-short {
                color: var(--text-primary);
                font-weight: 500;
                margin-bottom: var(--space-sm);
            }
            .hsc-desc {
                color: var(--text-secondary);
                font-size: var(--fs-sm);
                margin-bottom: var(--space-md);
                line-height: 1.5;
            }
            .hsc-use-case {
                background: var(--bg-tertiary);
                padding: var(--space-sm);
                border-radius: var(--radius-sm);
                font-size: var(--fs-sm);
                color: var(--text-secondary);
                border-left: 2px solid var(--border-color);
            }
            .hsc-use-case strong {
                color: var(--text-primary);
                display: block;
                margin-bottom: 4px;
            }
            .hsc-copy-btn {
                position: absolute;
                top: var(--space-sm);
                right: var(--space-sm);
                background: transparent;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                opacity: 0;
                padding: 4px;
                border-radius: var(--radius-sm);
                transition: all var(--transition-fast);
            }
            .hsc-card:hover .hsc-copy-btn {
                opacity: 1;
            }
            .hsc-copy-btn:hover {
                color: var(--text-primary);
                background: var(--bg-tertiary);
            }
            
            /* Category Colors */
            .cat-1xx .hsc-code { color: #60a5fa; } /* Blue */
            .cat-1xx.expanded .hsc-card-header { background: rgba(96, 165, 250, 0.05); }
            
            .cat-2xx .hsc-code { color: #4ade80; } /* Green */
            .cat-2xx.expanded .hsc-card-header { background: rgba(74, 222, 128, 0.05); }
            
            .cat-3xx .hsc-code { color: #facc15; } /* Yellow */
            .cat-3xx.expanded .hsc-card-header { background: rgba(250, 204, 21, 0.05); }
            
            .cat-4xx .hsc-code { color: #fb923c; } /* Orange */
            .cat-4xx.expanded .hsc-card-header { background: rgba(251, 146, 60, 0.05); }
            
            .cat-5xx .hsc-code { color: #f87171; } /* Red */
            .cat-5xx.expanded .hsc-card-header { background: rgba(248, 113, 113, 0.05); }
            
            .hsc-empty {
                text-align: center;
                color: var(--text-muted);
                padding: var(--space-lg);
                grid-column: 1 / -1;
            }
        `;
        document.head.appendChild(style);

        let activeFilter = 'All';
        let searchQuery = '';

        const renderCards = () => {
            const grid = container.querySelector('.hsc-grid');
            if (!grid) return;

            const filteredCodes = this.statusCodes.filter(item => {
                const matchesSearch = item.code.toString().includes(searchQuery) || 
                                      item.name.toLowerCase().includes(searchQuery) ||
                                      item.short.toLowerCase().includes(searchQuery);
                
                let matchesFilter = true;
                if (activeFilter === 'Common') {
                    matchesFilter = item.isCommon;
                } else if (activeFilter !== 'All') {
                    matchesFilter = item.category === activeFilter;
                }

                return matchesSearch && matchesFilter;
            });

            if (filteredCodes.length === 0) {
                grid.innerHTML = '<div class="hsc-empty">Không tìm thấy mã trạng thái nào phù hợp.</div>';
                return;
            }

            grid.innerHTML = filteredCodes.map(item => `
                <div class="hsc-card cat-${item.category}" data-code="${item.code}">
                    <button class="hsc-copy-btn" title="Copy code" onclick="event.stopPropagation(); window.copyToClipboard('${item.code} ${item.name}', this)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    <div class="hsc-card-header">
                        <div class="hsc-code">${item.code}</div>
                        <div class="hsc-name">${item.name}</div>
                        ${item.isCommon ? '<div class="hsc-common-badge">Phổ biến</div>' : ''}
                    </div>
                    <div class="hsc-card-body">
                        <div class="hsc-short">${item.short}</div>
                        <div class="hsc-desc">${item.desc}</div>
                        <div class="hsc-use-case">
                            <strong>Thường dùng khi:</strong>
                            ${item.useCase}
                        </div>
                    </div>
                </div>
            `).join('');

            // Add click events to expand cards
            const cards = grid.querySelectorAll('.hsc-card');
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    const isExpanded = card.classList.contains('expanded');
                    // Collapse all others (optional, but good for focus)
                    // cards.forEach(c => c.classList.remove('expanded'));
                    if (!isExpanded) {
                        card.classList.add('expanded');
                    } else {
                        card.classList.remove('expanded');
                    }
                });
            });
        };

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>${this.icon} ${this.name}</h2>
                    <p class="tool-description">${this.description}</p>
                </div>
                <div class="tool-body hsc-container">
                    <div class="hsc-controls">
                        <input type="text" class="tool-input hsc-search" placeholder="Tìm kiếm theo mã số, tên (VD: 404, Not Found)...">
                        <div class="hsc-filters">
                            <button class="hsc-filter-btn active" data-filter="All">Tất cả</button>
                            <button class="hsc-filter-btn" data-filter="Common">Phổ biến</button>
                            <button class="hsc-filter-btn" data-filter="1xx">1xx Info</button>
                            <button class="hsc-filter-btn" data-filter="2xx">2xx Success</button>
                            <button class="hsc-filter-btn" data-filter="3xx">3xx Redirect</button>
                            <button class="hsc-filter-btn" data-filter="4xx">4xx Client Error</button>
                            <button class="hsc-filter-btn" data-filter="5xx">5xx Server Error</button>
                        </div>
                    </div>
                    <div class="hsc-grid">
                        <!-- Cards will be injected here -->
                    </div>
                </div>
            </div>
        `;

        const searchInput = container.querySelector('.hsc-search');
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderCards();
        });

        const filterBtns = container.querySelectorAll('.hsc-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeFilter = btn.dataset.filter;
                renderCards();
            });
        });

        // Initial render
        renderCards();
    }
};

window.DevTools = window.DevTools || [];
window.DevTools.push(HttpStatusCodesTool);
