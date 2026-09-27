/* ============================================
   DevTools Hub - Git Command Builder & Interactive Cheat Sheet
   ============================================ */

window.DevTools = window.DevTools || [];
window.DevTools.push({
    name: 'Git Command Builder',
    icon: '🐙',
    category: 'Reference',
    description: 'Tạo lệnh Git tương tác theo kịch bản: hoàn tác, branch, commit, stash, remote',

    render(container) {
        if (!document.getElementById('git-tool-style')) {
            const style = document.createElement('style');
            style.id = 'git-tool-style';
            style.textContent = `
                .git-nav-tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border-color); margin-bottom: 1.25rem; overflow-x: auto; padding-bottom: 2px; }
                .git-tab-btn { background: none; border: none; padding: 0.6rem 1rem; color: var(--text-secondary); cursor: pointer; border-bottom: 2px solid transparent; font-weight: 500; font-size: var(--fs-sm); white-space: nowrap; display: flex; align-items: center; gap: 0.4rem; border-radius: 4px 4px 0 0; }
                .git-tab-btn:hover { color: var(--text-primary); background: var(--bg-card-hover); }
                .git-tab-btn.active { color: var(--accent-primary); border-bottom-color: var(--accent-primary); font-weight: 600; background: var(--bg-secondary); }
                .git-grid-layout { display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; }
                @media (max-width: 900px) { .git-grid-layout { grid-template-columns: 1fr; } }
                .git-scenario-list { display: flex; flex-direction: column; gap: 0.5rem; max-height: 580px; overflow-y: auto; padding-right: 0.25rem; }
                .git-scenario-item { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.75rem 1rem; cursor: pointer; text-align: left; transition: all 0.15s ease; }
                .git-scenario-item:hover { border-color: var(--border-hover); background: var(--bg-card-hover); }
                .git-scenario-item.active { border-color: var(--accent-primary); background: rgba(99, 102, 241, 0.08); }
                .git-item-title { font-weight: 600; font-size: var(--fs-sm); color: var(--text-primary); margin-bottom: 0.25rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
                .git-item-desc { font-size: var(--fs-xs); color: var(--text-secondary); line-height: 1.4; }
                .git-builder-card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; }
                .git-cmd-display { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 6px; padding: 1rem; font-family: monospace; font-size: 14px; margin: 1rem 0; position: relative; color: var(--text-primary); line-height: 1.6; word-break: break-all; }
                .git-danger-badge { background: rgba(239, 68, 68, 0.15); color: var(--accent-danger); border: 1px solid rgba(239, 68, 68, 0.3); font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 600; white-space: nowrap; }
                .git-safe-badge { background: rgba(16, 185, 129, 0.15); color: var(--accent-success); border: 1px solid rgba(16, 185, 129, 0.3); font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 600; white-space: nowrap; }
                .git-param-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
            `;
            document.head.appendChild(style);
        }

        const scenarios = [
            // Undo & Recovery
            {
                id: 'undo-soft',
                category: 'undo',
                title: 'Hoàn tác commit gần nhất (Giữ file)',
                desc: 'Hủy commit gần nhất nhưng giữ lại toàn bộ code đã sửa ở trạng thái staged',
                danger: false,
                params: [
                    { key: 'count', label: 'Số commit hoàn tác', type: 'number', default: '1' }
                ],
                generate: (p) => `git reset --soft HEAD~${p.count || 1}`,
                explain: 'Lệnh này đưa branch lùi lại N commit, nhưng các thay đổi của các commit đó vẫn được giữ nguyên trong Staging Area (sẵn sàng để commit lại).'
            },
            {
                id: 'undo-hard',
                category: 'undo',
                title: 'Hủy hoàn toàn commit gần nhất',
                desc: 'Xóa vĩnh viễn commit và hủy toàn bộ các thay đổi chưa commit',
                danger: true,
                params: [
                    { key: 'count', label: 'Số commit hủy', type: 'number', default: '1' }
                ],
                generate: (p) => `git reset --hard HEAD~${p.count || 1}`,
                explain: '⚠️ CẢNH BÁO NGUY HIỂM: Thao tác này sẽ xóa sạch code và đưa working tree về đúng trạng thái của commit trước đó. Không thể hoàn tác bằng các lệnh thông thường.'
            },
            {
                id: 'unstage-file',
                category: 'undo',
                title: 'Bỏ stage file (Unstage)',
                desc: 'Đưa file từ trạng thái Staged (chuẩn bị commit) về lại Unstaged',
                danger: false,
                params: [
                    { key: 'file', label: 'Đường dẫn file (hoặc . cho tất cả)', type: 'text', default: '.' }
                ],
                generate: (p) => `git restore --staged ${p.file || '.'}`,
                explain: 'Loại bỏ file khỏi danh sách chuẩn bị commit mà không làm mất nội dung thay đổi trong file.'
            },
            {
                id: 'discard-file-changes',
                category: 'undo',
                title: 'Hủy thay đổi chưa commit của file',
                desc: 'Khôi phục file về trạng thái của commit gần nhất (xóa thay đổi local)',
                danger: true,
                params: [
                    { key: 'file', label: 'Tên file cần hủy thay đổi', type: 'text', default: 'src/index.js' }
                ],
                generate: (p) => `git restore ${p.file || 'src/index.js'}`,
                explain: '⚠️ Hủy bỏ toàn bộ chỉnh sửa cục bộ chưa commit của file chỉ định.'
            },
            {
                id: 'amend-commit',
                category: 'undo',
                title: 'Sửa commit message gần nhất',
                desc: 'Thay đổi nội dung thông điệp hoặc đính kèm thêm file vào commit trước',
                danger: false,
                params: [
                    { key: 'msg', label: 'Nội dung commit mới', type: 'text', default: 'feat: update implementation' }
                ],
                generate: (p) => `git commit --amend -m "${p.msg || 'update'}"`,
                explain: 'Ghi đè commit mới lên commit trước đó. Lưu ý: nếu commit đã được push lên remote, bạn cần force push có kiểm soát.'
            },
            {
                id: 'recover-lost-commit',
                category: 'undo',
                title: 'Khôi phục commit bị mất (Reflog)',
                desc: 'Xem lịch sử hành động và tạo nhánh mới tại commit đã bị lỡ reset',
                danger: false,
                params: [
                    { key: 'hash', label: 'Mã Commit Hash tìm từ reflog', type: 'text', default: 'abc1234' },
                    { key: 'newBranch', label: 'Tên nhánh khôi phục', type: 'text', default: 'recovery-branch' }
                ],
                generate: (p) => `# Bước 1: Xem nhật ký hành động để tìm commit hash:\ngit reflog\n\n# Bước 2: Tạo nhánh mới tại commit đó:\ngit checkout -b ${p.newBranch || 'recovery'} ${p.hash || 'abc1234'}`,
                explain: 'Git lưu lại mọi di chuyển của HEAD trong 30-90 ngày. `git reflog` là cứu tinh giúp bạn tìm lại commit đã bị xóa nhầm.'
            },

            // Branch & Merge
            {
                id: 'create-switch-branch',
                category: 'branch',
                title: 'Tạo & Chuyển sang nhánh mới',
                desc: 'Tạo một nhánh mới từ nhánh hiện tại và lập tức chuyển sang nhánh đó',
                danger: false,
                params: [
                    { key: 'branch', label: 'Tên nhánh mới', type: 'text', default: 'feature/login' }
                ],
                generate: (p) => `git switch -c ${p.branch || 'new-feature'}`,
                explain: 'Lệnh hiện đại thay thế cho `git checkout -b <branch>`, an toàn và tường minh hơn.'
            },
            {
                id: 'rename-branch',
                category: 'branch',
                title: 'Đổi tên nhánh local & remote',
                desc: 'Đổi tên nhánh ở máy cục bộ và cập nhật lên máy chủ GitHub/GitLab',
                danger: false,
                params: [
                    { key: 'oldName', label: 'Tên nhánh cũ', type: 'text', default: 'old-name' },
                    { key: 'newName', label: 'Tên nhánh mới', type: 'text', default: 'new-name' }
                ],
                generate: (p) => `git branch -m ${p.oldName || 'old'} ${p.newName || 'new'}\ngit push origin -u ${p.newName || 'new'}\ngit push origin --delete ${p.oldName || 'old'}`,
                explain: 'Đổi tên nhánh ở local, đẩy nhánh mới lên remote và xóa nhánh có tên cũ trên remote.'
            },
            {
                id: 'delete-branch',
                category: 'branch',
                title: 'Xóa nhánh cục bộ (Local Branch)',
                desc: 'Xóa nhánh đã merge hoặc ép buộc xóa nhánh chưa merge',
                danger: false,
                params: [
                    { key: 'branch', label: 'Tên nhánh cần xóa', type: 'text', default: 'feature/done' },
                    { key: 'force', label: 'Ép buộc xóa (-D)?', type: 'checkbox', default: false }
                ],
                generate: (p) => `git branch ${p.force ? '-D' : '-d'} ${p.branch || 'feature'}`,
                explain: 'Dùng `-d` để xóa an toàn nếu nhánh đã được merge vào main; dùng `-D` nếu bạn muốn hủy bỏ hoàn toàn nhánh chưa merge.'
            },
            {
                id: 'delete-remote-branch',
                category: 'branch',
                title: 'Xóa nhánh trên Remote (GitHub)',
                desc: 'Xóa nhánh tồn tại trên remote server sau khi Pull Request đã đóng',
                danger: true,
                params: [
                    { key: 'remote', label: 'Remote name', type: 'text', default: 'origin' },
                    { key: 'branch', label: 'Tên nhánh remote cần xóa', type: 'text', default: 'feature/login' }
                ],
                generate: (p) => `git push ${p.remote || 'origin'} --delete ${p.branch || 'branch'}`,
                explain: 'Lệnh này thông báo cho remote server xóa branch đó đi.'
            },
            {
                id: 'cherry-pick',
                category: 'branch',
                title: 'Cherry-pick commit từ nhánh khác',
                desc: 'Bốc một commit cụ thể từ nhánh khác và áp dụng vào nhánh hiện tại',
                danger: false,
                params: [
                    { key: 'hash', label: 'Commit Hash cần bốc', type: 'text', default: 'a1b2c3d' }
                ],
                generate: (p) => `git cherry-pick ${p.hash || 'hash'}`,
                explain: 'Áp dụng các thay đổi từ một commit riêng lẻ vào nhánh hiện tại mà không cần phải gộp (merge) toàn bộ nhánh.'
            },
            {
                id: 'squash-rebase',
                category: 'branch',
                title: 'Squash (gộp) N commit gần nhất',
                desc: 'Gộp nhiều commit vụn vặt thành 1 commit duy nhất trước khi tạo PR',
                danger: false,
                params: [
                    { key: 'count', label: 'Số commit muốn gộp', type: 'number', default: '3' }
                ],
                generate: (p) => `git rebase -i HEAD~${p.count || 3}`,
                explain: 'Mở trình chỉnh sửa interactive rebase. Hãy đổi chữ `pick` thành `squash` (hoặc `s`) ở các dòng commit muốn gộp vào commit trước.'
            },

            // Stash
            {
                id: 'stash-push',
                category: 'stash',
                title: 'Lưu tạm code kèm ghi chú',
                desc: 'Cất các thay đổi đang làm dở để chuyển sang làm việc khác',
                danger: false,
                params: [
                    { key: 'msg', label: 'Mô tả công việc dở dang', type: 'text', default: 'WIP: logic tinh toan' }
                ],
                generate: (p) => `git stash push -m "${p.msg || 'WIP'}"`,
                explain: 'Lưu các file đã sửa đổi vào ngăn xếp stash và dọn dẹp working directory về sạch sẽ.'
            },
            {
                id: 'stash-pop',
                category: 'stash',
                title: 'Lấy lại bản stash gần nhất',
                desc: 'Áp dụng lại code đã lưu và xóa bản ghi đó khỏi danh sách stash',
                danger: false,
                params: [],
                generate: () => `git stash pop`,
                explain: 'Khôi phục lại thay đổi từ bản stash mới nhất và loại bỏ nó khỏi ngăn xếp stash.'
            },
            {
                id: 'stash-list',
                category: 'stash',
                title: 'Xem danh sách các bản Stash',
                desc: 'Liệt kê các bản lưu tạm đang có kèm vị trí index (stash@{0},...)',
                danger: false,
                params: [],
                generate: () => `git stash list`,
                explain: 'Xem danh sách tất cả các stash đang được lưu giữ trên máy tính.'
            },

            // Remote & Sync
            {
                id: 'force-push-safe',
                category: 'remote',
                title: 'Force Push an toàn (--force-with-lease)',
                desc: 'Đẩy đè lịch sử sau khi rebase nhưng không ghi đè nếu đồng nghiệp đã push',
                danger: false,
                params: [
                    { key: 'remote', label: 'Remote', type: 'text', default: 'origin' },
                    { key: 'branch', label: 'Branch', type: 'text', default: 'main' }
                ],
                generate: (p) => `git push --force-with-lease ${p.remote || 'origin'} ${p.branch || 'main'}`,
                explain: '🌟 KHUYÊN DÙNG: An toàn hơn nhiều so với `--force` thông thường, vì nó sẽ từ chối push nếu trên remote có ai đó đã đẩy commit mới mà bạn chưa fetch về.'
            },
            {
                id: 'reset-remote-state',
                category: 'remote',
                title: 'Đồng bộ ép buộc y hệt Remote',
                desc: 'Bỏ toàn bộ commit/thay đổi local và đồng bộ đúng chuẩn nhánh trên GitHub',
                danger: true,
                params: [
                    { key: 'remote', label: 'Remote', type: 'text', default: 'origin' },
                    { key: 'branch', label: 'Branch', type: 'text', default: 'main' }
                ],
                generate: (p) => `git fetch ${p.remote || 'origin'}\ngit reset --hard ${p.remote || 'origin'}/${p.branch || 'main'}`,
                explain: '⚠️ Toàn bộ thay đổi và commit ở máy bạn chưa được push sẽ bị xóa vĩnh viễn.'
            },

            // Tags & Clean
            {
                id: 'create-tag',
                category: 'clean',
                title: 'Tạo Release Tag có chú thích',
                desc: 'Đánh dấu phiên bản phát hành mới (v1.0.0, v0.6.0...)',
                danger: false,
                params: [
                    { key: 'version', label: 'Tên Tag (version)', type: 'text', default: 'v0.6.0' },
                    { key: 'msg', label: 'Mô tả bản phát hành', type: 'text', default: 'Release version 0.6.0' }
                ],
                generate: (p) => `git tag -a ${p.version || 'v1.0.0'} -m "${p.msg || 'Release'}"\ngit push origin ${p.version || 'v1.0.0'}`,
                explain: 'Tạo một annotated tag có lưu thông tin tác giả, ngày giờ và đẩy lên remote.'
            },
            {
                id: 'untrack-cached',
                category: 'clean',
                title: 'Bỏ theo dõi file (Xóa khỏi Git, giữ file thật)',
                desc: 'Áp dụng khi lỡ commit file .env hay config và muốn thêm vào .gitignore',
                danger: false,
                params: [
                    { key: 'file', label: 'Tên file hoặc thư mục', type: 'text', default: '.env' }
                ],
                generate: (p) => `git rm --cached ${p.file || '.env'}\n# Sau đó thêm ${p.file || '.env'} vào .gitignore và commit!`,
                explain: 'File sẽ không còn bị Git theo dõi, nhưng file vật lý trên ổ cứng của bạn vẫn được giữ nguyên.'
            },
            {
                id: 'clean-untracked',
                category: 'clean',
                title: 'Xóa toàn bộ file untracked rác',
                desc: 'Dọn sạch các file/thư mục mới sinh ra mà chưa bao giờ được add vào git',
                danger: true,
                params: [],
                generate: () => `git clean -fd`,
                explain: '⚠️ Xóa sạch mọi file và thư mục con chưa được Git theo dõi.'
            },
            {
                id: 'pretty-graph',
                category: 'clean',
                title: 'Xem cây lịch sử Git trực quan đẹp mắt',
                desc: 'Hiển thị sơ đồ phân nhánh và các commit dưới dạng cây rút gọn',
                danger: false,
                params: [],
                generate: () => `git log --graph --oneline --all --decorate`,
                explain: 'Vẽ cây sơ đồ commit trực tiếp trên terminal với màu sắc và tên branch trực quan.'
            }
        ];

        let currentCategory = 'all';
        let activeScenario = scenarios[0];
        let paramValues = {};

        container.innerHTML = `
            <div class="tool-panel">
                <div class="tool-header">
                    <h2>🐙 Git Command Builder & Interactive Cheat Sheet</h2>
                    <p class="tool-description">Trình tạo câu lệnh Git thông minh theo các kịch bản thực tế: khôi phục code, quản lý branch, stash và giải quyết sự cố.</p>
                </div>
                <div class="tool-body">
                    <!-- Search & Filter -->
                    <div style="margin-bottom: 1rem;">
                        <input type="text" id="git-search" class="tool-input" placeholder="🔍 Tìm kiếm kịch bản (VD: undo commit, xoa branch, rebase, stash, force push...)" style="width: 100%;">
                    </div>

                    <!-- Category Tabs -->
                    <div class="git-nav-tabs">
                        <button type="button" class="git-tab-btn active" data-cat="all">Tất cả (${scenarios.length})</button>
                        <button type="button" class="git-tab-btn" data-cat="undo">🔄 Hoàn tác & Sửa lỗi</button>
                        <button type="button" class="git-tab-btn" data-cat="branch">🌿 Branch & Merge</button>
                        <button type="button" class="git-tab-btn" data-cat="stash">📦 Stash</button>
                        <button type="button" class="git-tab-btn" data-cat="remote">🌐 Remote & Sync</button>
                        <button type="button" class="git-tab-btn" data-cat="clean">🧹 Clean & Tag</button>
                    </div>

                    <!-- Main Grid -->
                    <div class="git-grid-layout">
                        <!-- Scenario List -->
                        <div class="git-scenario-list" id="git-scenario-list"></div>

                        <!-- Command Builder Display -->
                        <div class="git-builder-card" id="git-builder-card">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
                                <div>
                                    <h3 id="card-title" style="margin: 0 0 0.25rem 0; font-size: 1.15rem; color: var(--text-primary);">Tiêu đề kịch bản</h3>
                                    <p id="card-desc" style="margin: 0; font-size: var(--fs-sm); color: var(--text-secondary);">Mô tả chi tiết kịch bản</p>
                                </div>
                                <span id="card-badge" class="git-safe-badge">An toàn</span>
                            </div>

                            <!-- Interactive Parameters -->
                            <div style="margin-top: 1.25rem;">
                                <label class="tool-label" style="margin-bottom: 0.5rem;">Tham số tùy chỉnh:</label>
                                <div class="git-param-row" id="card-params"></div>
                            </div>

                            <!-- Output Command -->
                            <div style="margin-top: 1rem;">
                                <label class="tool-label">Lệnh Git tương ứng:</label>
                                <div class="git-cmd-display" id="card-cmd">git status</div>
                                <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
                                    <button type="button" class="tool-btn tool-btn-primary" id="btn-copy-cmd">📋 Sao chép lệnh</button>
                                </div>
                            </div>

                            <!-- Explanation Box -->
                            <div style="margin-top: 1.25rem; background: var(--bg-tertiary); padding: 1rem; border-radius: 6px; border: 1px solid var(--border-color);">
                                <strong style="font-size: var(--fs-sm); color: var(--text-primary); display: block; margin-bottom: 0.25rem;">💡 Giải thích chi tiết:</strong>
                                <span id="card-explain" style="font-size: var(--fs-sm); color: var(--text-secondary); line-height: 1.5;">Giải thích</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const listContainer = container.querySelector('#git-scenario-list');
        const searchInput = container.querySelector('#git-search');
        const cardTitle = container.querySelector('#card-title');
        const cardDesc = container.querySelector('#card-desc');
        const cardBadge = container.querySelector('#card-badge');
        const cardParams = container.querySelector('#card-params');
        const cardCmd = container.querySelector('#card-cmd');
        const cardExplain = container.querySelector('#card-explain');
        const copyCmdBtn = container.querySelector('#btn-copy-cmd');

        function renderList() {
            const query = (searchInput.value || '').toLowerCase().trim();
            listContainer.innerHTML = '';

            const filtered = scenarios.filter(s => {
                const matchCat = (currentCategory === 'all' || s.category === currentCategory);
                const matchQ = !query || s.title.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query) || s.id.toLowerCase().includes(query);
                return matchCat && matchQ;
            });

            if (filtered.length === 0) {
                listContainer.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: var(--fs-sm);">Không tìm thấy kịch bản phù hợp.</div>';
                return;
            }

            filtered.forEach(s => {
                const item = document.createElement('div');
                item.className = 'git-scenario-item' + (s.id === activeScenario.id ? ' active' : '');
                item.innerHTML = `
                    <div class="git-item-title">
                        <span>${s.title}</span>
                        ${s.danger ? '<span class="git-danger-badge">Nguy hiểm</span>' : ''}
                    </div>
                    <div class="git-item-desc">${s.desc}</div>
                `;
                item.addEventListener('click', () => {
                    selectScenario(s);
                });
                listContainer.appendChild(item);
            });
        }

        function selectScenario(s) {
            activeScenario = s;
            paramValues = {};
            (s.params || []).forEach(p => {
                paramValues[p.key] = p.default;
            });

            cardTitle.textContent = s.title;
            cardDesc.textContent = s.desc;

            if (s.danger) {
                cardBadge.textContent = '⚠️ Cẩn trọng / Nguy hiểm';
                cardBadge.className = 'git-danger-badge';
            } else {
                cardBadge.textContent = '✅ An toàn';
                cardBadge.className = 'git-safe-badge';
            }

            cardExplain.textContent = s.explain;

            // Render params
            cardParams.innerHTML = '';
            if (!s.params || s.params.length === 0) {
                cardParams.innerHTML = '<span style="font-size:var(--fs-xs); color:var(--text-muted); font-style:italic;">Kịch bản này không cần tham số bổ sung.</span>';
            } else {
                s.params.forEach(p => {
                    const wrap = document.createElement('div');
                    wrap.className = 'tool-group';
                    wrap.style.margin = '0';

                    const lbl = document.createElement('label');
                    lbl.className = 'tool-label';
                    lbl.textContent = p.label;
                    wrap.appendChild(lbl);

                    if (p.type === 'checkbox') {
                        const cbWrap = document.createElement('div');
                        cbWrap.className = 'tool-checkbox';
                        const cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.id = `param-${p.key}`;
                        cb.checked = Boolean(p.default);
                        cb.addEventListener('change', () => {
                            paramValues[p.key] = cb.checked;
                            updateCommand();
                        });
                        const cbLbl = document.createElement('label');
                        cbLbl.htmlFor = `param-${p.key}`;
                        cbLbl.textContent = 'Bật tùy chọn này';
                        cbWrap.appendChild(cb);
                        cbWrap.appendChild(cbLbl);
                        wrap.appendChild(cbWrap);
                    } else {
                        const input = document.createElement('input');
                        input.type = p.type || 'text';
                        input.className = 'tool-input';
                        input.value = p.default || '';
                        input.addEventListener('input', (e) => {
                            paramValues[p.key] = e.target.value;
                            updateCommand();
                        });
                        wrap.appendChild(input);
                    }

                    cardParams.appendChild(wrap);
                });
            }

            updateCommand();
            renderList();
        }

        function updateCommand() {
            const cmd = activeScenario.generate(paramValues);
            cardCmd.textContent = cmd;
        }

        copyCmdBtn.addEventListener('click', () => {
            const cmd = cardCmd.textContent;
            if (window.copyToClipboard) {
                window.copyToClipboard(cmd, copyCmdBtn);
            } else {
                navigator.clipboard.writeText(cmd);
            }
        });

        searchInput.addEventListener('input', renderList);

        container.querySelectorAll('.git-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.git-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = btn.dataset.cat;
                renderList();
            });
        });

        // Initialize with first scenario
        selectScenario(scenarios[0]);
    }
});
