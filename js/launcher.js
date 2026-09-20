/* 通用T显编辑器 v1.6.0 工具启动器 + 站内全局搜索 */
(function () {
  function onReady(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }
  onReady(function () {
    var util = window.anime || null;

    /* ---------------- 工具卡片数据 ---------------- */
    var TOOLS = [
      { key:'editor',   title:'指令编辑器', sub:'多帧 actionbar 排版', icon:'pencil', grad:'g1', act:'editor' },
      { key:'workshop', title:'指令工坊',   sub:'give / execute 生成', icon:'craft',   grad:'g2', act:'view-workshop' },
      { key:'template', title:'标题模板',   sub:'竖列 / 跑马灯模板',   icon:'layers',  grad:'g3', act:'view-template' },
      { key:'preset',   title:'预设指令中心', sub:'撤离 / 菜单 / 商店', icon:'box',    grad:'g4', act:'preset' },
      { key:'tutorial', title:'交互教程',   sub:'手把手图文引导',      icon:'book',    grad:'g5', act:'view-tutorial' },
      { key:'project',  title:'我的项目',   sub:'已保存的作品',        icon:'folder',  grad:'g6', act:'view-project' }
    ];
    var ICONS = {
      pencil: 'M12 2l1 4 4 1-3 3 1 4-3-2-3 2 1-4-3-3 4-1 1-4z',
      craft:  'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM8.5 13l2 2 5-5',
      layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
      box:    'M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M12 12v10',
      book:   'M5 3h13a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 3v9l3-2 3 2V3',
      folder: 'M3 6a2 2 0 0 1 2-2h4l3 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z'
    };
    var TEMPLATES = [
      { name:'竖列菜单', kw:'washoku 状态机' },
      { name:'通用菜单', kw:'marquee 跑马灯 菜单' },
      { name:'开机动画', kw:'17帧 状态机 loading' },
      { name:'关机动画', kw:'18帧 shutdown' },
      { name:'载入动画', kw:'9帧 滑入 load' }
    ];
    function svgIcon(path) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>';
    }

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
    function openEditor() { var b = document.getElementById('btn-create'); if (b) b.click(); }
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
      else switchView(act);
    }

    /* ---------------- 渲染工具卡片 ---------------- */
    var grid = document.getElementById('tool-grid');
    if (grid) {
      var html = '';
      for (var i = 0; i < TOOLS.length; i++) {
        var t = TOOLS[i];
        html += '<button type="button" class="tool-card grad-' + t.grad + '" data-tool="' + t.key + '" data-act="' + t.act + '">' +
                  '<span class="tool-icon">' + svgIcon(ICONS[t.icon]) + '</span>' +
                  '<span class="tool-txt"><span class="tool-title">' + t.title + '</span><span class="tool-sub">' + t.sub + '</span></span>' +
                '</button>';
      }
      grid.innerHTML = html;
      grid.querySelectorAll('.tool-card').forEach(function (c) {
        c.addEventListener('click', function () { actTool(c.getAttribute('data-act')); });
      });
    }

    var heroCreate = document.getElementById('hero-create');
    if (heroCreate) heroCreate.addEventListener('click', openEditor);

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
      d.addEventListener('click', fn);
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

    /* ---------------- 入场动效 ---------------- */
    if (util) {
      var cards = document.querySelectorAll('#tool-grid .tool-card');
      if (cards.length) {
        util.animate(cards, { opacity: [0, 1], translateY: [16, 0], scale: [0.96, 1], delay: util.stagger(55), duration: 520, ease: 'outCubic' });
      }
    } else {
      document.querySelectorAll('#tool-grid .tool-card').forEach(function (c) { c.style.opacity = '1'; });
    }
  });
})();
