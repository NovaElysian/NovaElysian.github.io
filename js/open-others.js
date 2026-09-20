(function() {
    const presetFiles = [
        {"name": "撤离5cb教程版新", "path": "./presets/extraction/extraction-tutorial-v2/撤离5cb教程版新.txt", "category": "extraction"},
        {"name": "开箱", "path": "./presets/extraction/loot-airdrop/开箱.txt", "category": "extraction"},
        {"name": "开箱（压缩版未测试）", "path": "./presets/extraction/loot-airdrop/开箱（压缩版未测试）.txt", "category": "extraction"},
        {"name": "空投", "path": "./presets/extraction/loot-airdrop/空投.txt", "category": "extraction"},
        {"name": "匹配系统，固定随机刷新点", "path": "./presets/extraction/matchmaking/匹配系统，固定随机刷新点.txt", "category": "extraction"},
        {"name": "雪球菜单参赛作品", "path": "./presets/menus/snowball-contest/雪球菜单参赛作品.txt", "category": "menus"},
        {"name": "互传", "path": "./presets/menus/snowball-v2/互传.txt", "category": "menus"},
        {"name": "前置（必看）", "path": "./presets/menus/snowball-v2/前置（必看）.txt", "category": "menus"},
        {"name": "菜单第一页", "path": "./presets/menus/snowball-v2/菜单第一页.txt", "category": "menus"},
        {"name": "菜单第七页", "path": "./presets/menus/snowball-v2/菜单第七页.txt", "category": "menus"},
        {"name": "菜单第三页", "path": "./presets/menus/snowball-v2/菜单第三页.txt", "category": "menus"},
        {"name": "菜单第二页", "path": "./presets/menus/snowball-v2/菜单第二页.txt", "category": "menus"},
        {"name": "菜单第五页", "path": "./presets/menus/snowball-v2/菜单第五页.txt", "category": "menus"},
        {"name": "菜单第六页", "path": "./presets/menus/snowball-v2/菜单第六页.txt", "category": "menus"},
        {"name": "菜单第四页", "path": "./presets/menus/snowball-v2/菜单第四页.txt", "category": "menus"},
        {"name": "转账", "path": "./presets/menus/snowball-v2/转账.txt", "category": "menus"},
        {"name": "前置［必看第一个］", "path": "./presets/menus/snowball-yellow/前置［必看第一个］.txt", "category": "menus"},
        {"name": "第一页雪球菜单", "path": "./presets/menus/snowball-yellow/第一页雪球菜单.txt", "category": "menus"},
        {"name": "雪球菜单互传第四页", "path": "./presets/menus/snowball-yellow/雪球菜单互传第四页.txt", "category": "menus"},
        {"name": "雪球菜单其他第五页", "path": "./presets/menus/snowball-yellow/雪球菜单其他第五页.txt", "category": "menus"},
        {"name": "雪球菜单多维第二页", "path": "./presets/menus/snowball-yellow/雪球菜单多维第二页.txt", "category": "menus"},
        {"name": "雪球菜单转账第三页", "path": "./presets/menus/snowball-yellow/雪球菜单转账第三页.txt", "category": "menus"},
        {"name": "防熊指令", "path": "./presets/misc/anti-grief/防熊指令.txt", "category": "misc"},
        {"name": "日历前台", "path": "./presets/misc/calendar/日历前台.txt", "category": "misc"},
        {"name": "日历后台", "path": "./presets/misc/calendar/日历后台.txt", "category": "misc"},
        {"name": "自定义钓鱼", "path": "./presets/misc/custom-fishing/自定义钓鱼.txt", "category": "misc"},
        {"name": "抽奖指令", "path": "./presets/misc/lottery/抽奖指令.txt", "category": "misc"},
        {"name": "手动签到教程版", "path": "./presets/misc/manual-signin/手动签到教程版.txt", "category": "misc"},
        {"name": "创建地皮模板", "path": "./presets/shop-plots/advanced-plots/创建地皮模板.txt", "category": "shop-plots"},
        {"name": "创建空岛", "path": "./presets/shop-plots/advanced-plots/创建空岛.txt", "category": "shop-plots"},
        {"name": "前台", "path": "./presets/shop-plots/advanced-plots/前台.txt", "category": "shop-plots"},
        {"name": "地皮保护", "path": "./presets/shop-plots/advanced-plots/地皮保护.txt", "category": "shop-plots"},
        {"name": "前台", "path": "./presets/shop-plots/basic-plots/前台.txt", "category": "shop-plots"},
        {"name": "后台", "path": "./presets/shop-plots/basic-plots/后台.txt", "category": "shop-plots"},
        {"name": "[前置]创建栓绳", "path": "./presets/shop-plots/bulk-shop/[前置]创建栓绳.txt", "category": "shop-plots"},
        {"name": "免举商店 完整版", "path": "./presets/shop-plots/bulk-shop/免举商店 完整版.txt", "category": "shop-plots"},
        {"name":"常用生存指令","path":"./presets/misc/common-commands/常用生存指令.txt","category":"misc"},
        {"name":"快捷命令合集","path":"./presets/misc/common-commands/快捷命令合集.txt","category":"misc"},
        {"name":"粒子特效","path":"./presets/misc/particle-sound/粒子特效.txt","category":"misc"},
        {"name":"精简标题菜单","path":"./presets/menus/simple/精简标题菜单.txt","category":"menus"},
        {"name":"简易地皮保护","path":"./presets/shop-plots/simple/简易地皮保护.txt","category":"shop-plots"},
        {"name":"基础撤离指引","path":"./presets/extraction/simple/基础撤离指引.txt","category":"extraction"}
    ];
    window.__pcPresets = presetFiles;

    // 注入美化后的 UI 样式
    const style = document.createElement('style');
    style.innerHTML =     style.innerHTML = `
        #preset-center-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: var(--bg-color); color: var(--text-main); z-index: 999999;
            display: none; flex-direction: column; overflow-y: auto; padding: 24px; box-sizing: border-box;
            font-family: inherit; animation: pcFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes pcFadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        #preset-center-overlay .pc-container { max-width: 900px; margin: 0 auto; width: 100%; position: relative; padding-top: 10px; }
        #preset-center-overlay .pc-header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; border-bottom: 1px solid var(--border-color); padding-bottom: 14px; }
        #preset-center-overlay h1 { font-size: 1.3rem; color: var(--text-main); margin: 0; font-weight: 700; }
        #preset-center-back { background: var(--accent-color); color: #fff; border: none; padding: 8px 16px; border-radius: 18px; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: all 0.2s; }
        #preset-center-overlay .pc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
        #preset-center-overlay .pc-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,.04); transition: border-color 0.2s, transform 0.2s; }
        #preset-center-overlay .pc-card:active { border-color: var(--accent-color); }
        #preset-center-overlay .pc-card-header { font-weight: 600; font-size: 0.95rem; color: var(--text-main); margin-bottom: 6px; word-break: break-all; }
        #preset-center-overlay .pc-card-category { font-size: 0.75rem; color: var(--text-sub); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; }
        #preset-center-overlay .pc-btn-group { display: flex; gap: 8px; }
        #preset-center-overlay button { padding: 9px 12px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.82rem; color: #fff; transition: opacity 0.2s, transform 0.1s; }
        #preset-center-overlay button:active { transform: scale(0.96); opacity: 0.85; }
        #preset-center-overlay .pc-btn-preview { background: var(--accent-color); width: 100%; margin-bottom: 8px; }
        #preset-center-overlay .pc-btn-copy { background: var(--dark-btn); flex: 1; }
        #preset-center-overlay .pc-btn-download { background: #4caf50; flex: 1; }
        #preset-center-overlay #pc-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,.6); backdrop-filter: blur(2px); justify-content: center; align-items: center; z-index: 1000000; padding: 16px; box-sizing: border-box; }
        #preset-center-overlay .pc-modal-box { background: var(--card-bg); border: 1px solid var(--border-color); width: 100%; max-width: 600px; height: 75vh; border-radius: 16px; padding: 20px; display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0,0,0,.3); }
        #preset-center-overlay textarea { flex: 1; background: var(--bg-color); color: var(--text-main); border: 1px solid var(--border-color); padding: 12px; font-family: ui-monospace, monospace; font-size: 0.85rem; resize: none; border-radius: 8px; margin-bottom: 12px; outline: none; }
        #preset-center-overlay .pc-modal-footer { display: flex; justify-content: flex-end; }
        #preset-center-overlay .pc-close-btn { background: var(--dark-btn); color: var(--text-main); padding: 8px 20px; border-radius: 8px; }
        #pc-toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--dark-btn); color: #fff; padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 500; box-shadow: 0 10px 15px -3px rgba(0,0,0,.3); z-index: 1000001; opacity: 0; transition: all 0.25s cubic-bezier(0.16,1,0.3,1); pointer-events: none; }
        #pc-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }/* 预设中心 filter/search */
        #preset-center-overlay .pc-nav { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px; }
        #preset-center-overlay .pc-filter-chip { padding:6px 14px; border-radius:16px; background:var(--card-bg); border:1px solid var(--border-color); color:var(--text-sub); font-size:0.8rem; cursor:pointer; user-select:none; transition:all .15s; }
        #preset-center-overlay .pc-filter-chip.active { background:var(--accent-color); color:#fff; border-color:var(--accent-color); }
        #preset-center-overlay .pc-search { width:100%; padding:9px 12px; background:var(--card-bg); border:1px solid var(--border-color); border-radius:8px; color:var(--text-main); font-size:0.85rem; margin-bottom:16px; outline:none; }
        #preset-center-overlay .pc-search:focus { border-color:var(--accent-color); }

    `;
    document.head.appendChild(style);

    // 构建 DOM 结构
    const overlay = document.createElement('div');
    overlay.id = 'preset-center-overlay';
    overlay.innerHTML = `
        <div class="pc-container">
            <div class="pc-header-bar">
                <h1>预设指令中心</h1>
                <button id="preset-center-back">返回</button>
            </div>
            <div class="pc-nav" id="pc-nav"><span class="pc-filter-chip" data-cat="all">全部</span><span class="pc-filter-chip" data-cat="extraction">撤离</span><span class="pc-filter-chip" data-cat="menus">菜单</span><span class="pc-filter-chip" data-cat="misc">杂项</span><span class="pc-filter-chip" data-cat="shop-plots">地皮商店</span></div>
            <input class="pc-search" id="pc-search" placeholder="搜索预设名称或分类..." />
            <div class="pc-grid" id="pc-grid"></div>
        </div>
        <div id="pc-modal">
            <div class="pc-modal-box">
                <textarea id="pc-modal-text" readonly></textarea>
                <div class="pc-modal-footer">
                    <button class="pc-close-btn" id="pc-modal-close">关闭</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // 全局美观 Toast 提示组件
    const toast = document.createElement('div');
    toast.id = 'pc-toast';
    document.body.appendChild(toast);

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // 渲染卡片列表
    const grid = document.getElementById('pc-grid');
    window.__pcCat = 'all';
    window.__pcQ = '';
    function renderGrid(){
        const q = (window.__pcQ||'').toLowerCase();
        const cat = window.__pcCat||'all';
        grid.innerHTML = '';
        const list = presetFiles.filter(function(f){
            if(cat!=='all' && f.category!==cat) return false;
            if(q && (f.name+' '+f.category).toLowerCase().indexOf(q)<0) return false;
            return true;
        });
        if(list.length===0){ grid.innerHTML='<div style="padding:30px;text-align:center;color:var(--text-sub);">未找到匹配的预设</div>'; return; }
        list.forEach(function(file){
            const card = document.createElement('div');
            card.className = 'pc-card';
            card.innerHTML = '<div><div class="pc-card-header">'+(file.name||'')+'</div><div class="pc-card-category">'+(file.category||'')+'</div></div><div><button class="pc-btn-preview" data-action="preview" data-path="'+file.path+'">预览代码</button><div class="pc-btn-group"><button class="pc-btn-copy" data-action="copy" data-path="'+file.path+'">一键复制</button><button class="pc-btn-download" data-action="download" data-path="'+file.path+'" data-name="'+file.name+'.txt">下载文件</button></div></div>';
            grid.appendChild(card);
        });
    }
    renderGrid();
    /* 分类 chip 切换 */
    document.getElementById('pc-nav').querySelectorAll('.pc-filter-chip').forEach(function(chip){
        chip.addEventListener('click', function(){
            document.querySelectorAll('#pc-nav .pc-filter-chip').forEach(function(c){c.classList.remove('active');});
            chip.classList.add('active');
            window.__pcCat = chip.getAttribute('data-cat');
            renderGrid();
        });
    });
    document.querySelectorAll('#pc-nav .pc-filter-chip').forEach(function(c){ if(c.getAttribute('data-cat')==='all') c.classList.add('active'); });
    /* 搜索 */
    document.getElementById('pc-search').addEventListener('input', function(e){
        window.__pcQ = e.target.value;
        renderGrid();
    });


    // 交互逻辑绑定
    grid.addEventListener('click', async function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const path = btn.getAttribute('data-path');

        if (action === 'preview' || action === 'copy') {
            try {
                const res = await fetch(path);
                if (!res.ok) throw new Error("目标文件未找到");
                const text = await res.text();
                if (action === 'preview') {
                    document.getElementById('pc-modal-text').value = text;
                    document.getElementById('pc-modal').style.display = 'flex';
                } else {
                    await navigator.clipboard.writeText(text);
                    showToast('已成功复制到剪贴板 ');
                }
            } catch (err) {
                showToast('操作失败: ' + err.message);
            }
        } else if (action === 'download') {
            const filename = btn.getAttribute('data-name');
            const a = document.createElement('a');
            a.href = path;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            showToast('开始下载文件 ');
        }
    });

    document.getElementById('pc-modal-close').addEventListener('click', () => {
        document.getElementById('pc-modal').style.display = 'none';
    });

    document.getElementById('preset-center-back').addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // 核心拦截跳转触发
    document.addEventListener('click', function(e) {
        const targetItem = e.target.closest('[data-open-url="presets_viewer.html"]');
        if (!targetItem) return;

        e.preventDefault();
        e.stopPropagation();
        overlay.style.display = 'flex';
    }, true);
})();