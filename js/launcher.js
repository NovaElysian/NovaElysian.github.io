/* 通用T显编辑器 v1.6.0 工具启动器 + 站内全局搜索 */
(function () {
  function onReady(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }
  onReady(function () {

    /* ---------------- 工具数据（单一数据源）----------------
       抽屉里的功能卡（index.html 中 #sidebar .fn-card，静态 HTML）就是权威列表。
       原先这里另有一份硬编码 TOOLS + ICONS，与主页工具格、抽屉卡片三处重复，
       主页工具格已删除，故改为直接从抽屉卡片派生，避免再次走样。 */
    var NAV2ACT = {
      home: 'view-home', workshop: 'view-workshop', template: 'view-template',
      tutorial: 'view-tutorial', project: 'view-project',
      editor: 'editor', preset: 'preset', fuhao: 'fuhao', changelog: 'changelog'
    };
    var TOOLS = [];
    document.querySelectorAll('#sidebar .fn-card').forEach(function (card) {
      var t = card.querySelector('.fn-title');
      var nav = card.getAttribute('data-nav') || '';
      TOOLS.push({
        key: nav,
        title: t ? t.textContent.trim() : '',
        sub: card.getAttribute('title') || '',
        act: NAV2ACT[nav] || nav
      });
    });
    var TEMPLATES = [
      { name:'竖列菜单', kw:'washoku 状态机' },
      { name:'通用菜单', kw:'marquee 跑马灯 菜单' },
      { name:'开机动画', kw:'17帧 状态机 loading' },
      { name:'关机动画', kw:'18帧 shutdown' },
      { name:'载入动画', kw:'9帧 滑入 load' }
    ];
    /* svgIcon 已移除：功能卡改为 index.html 里的静态 HTML，图标直接写在卡片内 */

    /* ---------------- 视图切换 / 打开 ---------------- */
    function switchView(v) {
      var it = document.querySelector('.app-tabbar .tab-item[data-target="' + v + '"]');
      if (it) { it.click(); return; }
      var sec = document.getElementById(v);
      if (sec) {
        document.querySelectorAll('.app-tabbar .tab-item').forEach(function (i) {
          i.classList.toggle('active', i.getAttribute('data-target') === v);
        });
        document.querySelectorAll('.view-section').forEach(function (n) { n.classList.remove('active'); });
        sec.classList.add('active');
      }
    }
    function openEditor() {
      /* 直接进编辑器工作区（与抽屉「T显编辑器」一致），不再先弹「创建项目」面板 */
      if (window.App && window.App.enterEditor) { window.App.enterEditor(); return; }
      var b = document.getElementById('btn-create');
      if (b) b.click();
    }
    function openPreset(query) {
      var t = document.querySelector('[data-open-url="presets_viewer.html"]');
      if (t) t.click();
      window.__pcQ = query || '';
      var inp = document.getElementById('pc-search');
      if (inp) {
        inp.value = window.__pcQ;
        var ev;
        try { ev = new Event('input'); } catch (e) { ev = document.createEvent('Event'); ev.initEvent('input', true, false); }
        inp.dispatchEvent(ev);
      }
    }
    function actTool(act) {
      if (act === 'editor') openEditor();
      else if (act === 'preset') openPreset('');
      else if (act === 'fuhao') location.href = 'fuhao.html';
      else if (act === 'changelog') location.href = 'changelog.html';
      else switchView(act);
    }

    /* ---------------- 工具卡片渲染：已迁至抽屉 ----------------
       原先在此渲染 #tool-grid，现已按需求把「功能分格」搬进左上角抽屉
       （index.html 中静态 HTML，保证不依赖 JS 也能显示）。
       这里不再渲染任何工具卡，仅保留下面的搜索与 hero 绑定。 */

    var heroCreate = document.getElementById('hero-create');
    if (heroCreate) heroCreate.addEventListener('click', openEditor);

    /* 点击搜索结果后收起抽屉，否则结果在抽屉后面看不见 */
    function closeDrawerIfOpen() {
      var sb = document.getElementById('sidebar');
      if (!sb || !sb.classList.contains('active')) return;
      sb.classList.remove('active');
      var ov = document.getElementById('sidebar-overlay');
      if (ov) ov.classList.remove('active');
      sb.querySelectorAll('.fn-card, .nav-item').forEach(function (el) {
        el.style.opacity = '';
        el.style.transform = '';
      });
    }

    /* ---------------- 站内搜索 ---------------- */
    function getPresets() { try { return window.__pcPresets || []; } catch (e) { return []; } }
    function getTutorials() {
      var arr = [];
      document.querySelectorAll('#tutorial-grid .interactive-tutorial-card').forEach(function (n) {
        var name = (n.textContent || '').trim();
        if (name) arr.push(name);
      });
      return arr;
    }
    function norm(s) { return (s || '').toLowerCase().replace(/\s+/g, ' '); }

    var drop = document.getElementById('gs-drop');
    var input = document.getElementById('global-q');
    var clear = document.getElementById('gs-clear');
    if (!drop || !input) return;

    function makeRow(type, label, sub, fn) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'gs-row';
      d.innerHTML = '<span class="gs-tag">' + type + '</span><span class="gs-label">' + label + '</span>' + (sub ? '<span class="gs-sub">' + sub + '</span>' : '');
      /* 搜索框现在位于抽屉内：先收起抽屉，再执行动作 */
      d.addEventListener('click', function () { closeDrawerIfOpen(); fn(); });
      return d;
    }
    function doSearch() {
      var q = (input.value || '').trim();
      drop.innerHTML = '';
      if (!q) { drop.classList.remove('open'); return; }
      var nq = norm(q), rows = 0;
      function push(type, label, sub, fn) { if (rows < 7) { drop.appendChild(makeRow(type, label, sub, fn)); rows++; } }
      var i, t, te, p, ps, k, tg;

      // 工具
      for (i = 0; i < TOOLS.length; i++) {
        t = TOOLS[i];
        if (norm(t.title).indexOf(nq) >= 0 || norm(t.sub).indexOf(nq) >= 0) {
          (function (t) { push('工具', t.title, t.sub, function () { actTool(t.act); }); })(t);
        }
      }
      // 模板
      for (i = 0; i < TEMPLATES.length; i++) {
        te = TEMPLATES[i];
        if (norm(te.name).indexOf(nq) >= 0 || norm(te.kw).indexOf(nq) >= 0) {
          (function (te) { push('模板', te.name, te.kw, function () { switchView('view-template'); }); })(te);
        }
      }
      // 预设
      ps = getPresets();
      for (k = 0; k < ps.length && rows < 7; k++) {
        p = ps[k];
        if (norm(p.name).indexOf(nq) >= 0 || norm(p.category).indexOf(nq) >= 0) {
          (function (p) { push('预设', p.name, p.category, function () { openPreset(p.name); }); })(p);
        }
      }
      // 教程
      var tgs = getTutorials();
      for (i = 0; i < tgs.length && rows < 7; i++) {
        tg = tgs[i];
        if (norm(tg).indexOf(nq) >= 0) {
          (function (tg) { push('教程', tg, '交互教程', function () { switchView('view-tutorial'); }); })(tg);
        }
      }
      // 无结果兜底：引导进入预设中心搜索
      if (rows === 0) {
        push('预设', '在预设中心搜索「' + q + '」', '打开预设指令中心', function () { openPreset(q); });
      }
      drop.classList.add('open');
    }

    input.addEventListener('input', function () {
      doSearch();
      clear.style.opacity = (input.value.trim()) ? '1' : '0';
    });
    input.addEventListener('focus', function () { if (drop.childNodes.length) drop.classList.add('open'); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var r = drop.querySelector('.gs-row'); if (r) r.click(); }
      else if (e.key === 'Escape') { drop.classList.remove('open'); input.value = ''; clear.style.opacity = '0'; }
    });
    if (clear) clear.addEventListener('click', function () { input.value = ''; clear.style.opacity = '0'; drop.classList.remove('open'); input.focus(); });
    document.addEventListener('click', function (e) { if (!e.target.closest('#global-search')) drop.classList.remove('open'); });

    /* ---------------- 入场动效 ----------------
       原先在这里给 #tool-grid 的工具卡做错峰入场；工具卡已迁入抽屉，
       其入场动效改由 nav.js 负责（且降级为纯增强，CSS 默认可见）。
       这里不再新增动效：主页内容一律保持 CSS 默认可见，避免再出现
       「动画没跑 → 内容被留在 opacity:0」这类静默空白。 */
  });
})();
