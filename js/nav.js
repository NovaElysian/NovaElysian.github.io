/* 通用T显编辑器 功能抽屉导航  v1.8.2
 *
 * 本次修复的三个问题（同一根因）：
 *   1) `getElementById('sidebar-content')` 取不到 —— HTML 里只有 class="sidebar-content"，
 *      于是下面在第 9 行直接 `return`，后续全部初始化被跳过：
 *        · 「X 关不掉」  ← closeBtn 的监听绑定在 return 之后，永远执行不到
 *        · 「导航项点不动」← content 的委托点击同样没绑上
 *        · 「抽屉全空白」  ← .nav-item 在 CSS 里默认 opacity:0（等动画淡入），
 *                            动画没跑就没人把它恢复，条目永久隐藏
 *   2) 因此现在：关闭逻辑「先行绑定」，不依赖任何后续节点是否齐全；
 *   3) 入场动画降级为「纯增强」：CSS 默认可见，动画只负责从 0 淡入，
 *      且结束/中断都会清掉行内样式，任何情况下都不会把内容留在隐藏态。
 */
(function () {
  function onReady(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  onReady(function () {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;                                   /* 没有抽屉，直接结束 */

    /* 用 id 或 class 双保险取内容容器（旧版只认 id，是本次故障的根因） */
    var content = document.getElementById('sidebar-content') ||
                  sidebar.querySelector('.sidebar-content');
    var overlay = document.getElementById('sidebar-overlay');
    var closeBtn = document.getElementById('nav-close');

    var ITEM_SEL = '.fn-card, .nav-item';

    /* 把条目交还给 CSS 控制（清掉动画残留的行内 opacity/transform） */
    function resetItems() {
      var items = sidebar.querySelectorAll(ITEM_SEL);
      for (var i = 0; i < items.length; i++) {
        items[i].style.opacity = '';
        items[i].style.transform = '';
      }
    }

    /* ---------- 关闭：无条件绑定，先于任何依赖 ---------- */
    function closeDrawer() {
      sidebar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      resetItems();
    }
    if (closeBtn) closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      closeDrawer();
    });
    if (overlay) overlay.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) closeDrawer();
    });

    /* ---------- 应用内外观：进入 T显编辑器 及其内页时显示底栏 ---------- */
    var APP_VIEWS = ['view-teditor', 'view-editor', 'view-template', 'view-tutorial', 'view-project'];
    function syncAppChrome() {
      var inApp = APP_VIEWS.some(function (id) {
        var v = document.getElementById(id);
        return !!(v && v.classList.contains('active'));
      });
      document.body.classList.toggle('in-app', inApp);
    }
    syncAppChrome();
    if (window.MutationObserver) {
      var chromeOb = new MutationObserver(syncAppChrome);
      APP_VIEWS.concat(['view-home']).forEach(function (id) {
        var v = document.getElementById(id);
        if (v) chromeOb.observe(v, { attributes: true, attributeFilter: ['class'] });
      });
    }
    /* 编辑器是 z-index:200 的全屏浮层，用 transform/visibility 隐藏，
       不属于 .view-section —— 标准的视图切换（只清 .view-section）清不掉它。
       因此切到任何其它视图时都要显式收起，否则会残留并盖住页面。 */
    function dismissEditorOverlay() {
      var ed = document.getElementById('view-editor');
      if (ed) ed.classList.remove('active');
    }

    /* 兜底：MutationObserver 只覆盖上面这几个节点，且回调触发时机不总是可靠。
       任何点击后同步更新一次（此时视图切换已在同一事件派发内完成），
       再异步兜底一次以覆盖延迟切换的场景。 */
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-target^="view-"], [data-switch-view]');
      if (t) {
        var v = t.getAttribute('data-target') || t.getAttribute('data-switch-view');
        if (v !== 'view-editor') dismissEditorOverlay();
      }
      syncAppChrome();
      setTimeout(syncAppChrome, 0);
    });

    /* ---------- 进入编辑器：最近的项目；没有则新建 ----------
       不再经过「创建项目」面板 —— 与参考实现一致（打开即是编辑器）。 */
    function enterEditor(withDemo) {
      if (!(window.App && window.App.storage && window.App.openProjectById)) {
        var fb = document.getElementById('btn-create');
        if (fb) fb.click();          /* 兜底：走创建面板 */
        return;
      }
      var list = window.App.storage.getAllProjects() || [];
      list.sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
      var p = list[0];
      if (!p) {
        p = window.App.storage.createNewProject();
        if (withDemo) {
          p.name = '新项目';
          p.frames[0].lines = [{type:"text", text:"§e网易基岩版 titleraw \u3000从这里开始编辑", x:0, trackIndex:0, startTick:0, durationTicks:20}];
        }
        window.App.storage.saveProject(p);
      }
      window.App.openProjectById(p.id);
    }
    /* 暴露给 launcher.js 等入口：进入编辑器直接打开工作区 */
    window.App = window.App || {};
    window.App.enterEditor = enterEditor;

    /* ---------- 动作分派 ---------- */
    var VIEW_MAP = {
      home: 'view-home',
      workshop: 'view-workshop',
      template: 'view-template',
      tutorial: 'view-tutorial',
      project: 'view-project'
    };

    function directSwitch(target) {
      var el = document.querySelector('.app-tabbar .tab-item[data-target="' + target + '"]');
      if (el) { el.click(); return; }
      var sec = document.getElementById(target);
      if (sec) {
        document.querySelectorAll('.app-tabbar .tab-item').forEach(function (i) {
          i.classList.toggle('active', i.getAttribute('data-target') === target);
        });
        document.querySelectorAll('.view-section').forEach(function (n) { n.classList.remove('active'); });
        sec.classList.add('active');
      }
    }

    function runAction(nav) {
      if (nav === 'editor') {
        /* 点「T显编辑器」→ 进入通用编辑器页面（不自动新建项目，交由用户操作） */
        directSwitch('view-teditor');
        return;
      }
      if (nav === 'sites') { location.href = 'sites.html'; return; }
      if (nav === 'more') { location.href = 'more.html'; return; }
      if (nav === 'fuhao') { location.href = 'fuhao.html'; return; }
      if (nav === 'changelog') { location.href = 'changelog.html'; return; }
      if (nav === 'about') {
        directSwitch('view-home');
        setTimeout(function () {
          var a = document.getElementById('about-card');
          if (a && a.scrollIntoView) a.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 90);
        return;
      }
      var target = VIEW_MAP[nav];
      if (target) directSwitch(target);
    }

    /* ---------- 点击委托：整条抽屉（含 .fn-card 与 .nav-item）---------- */
    sidebar.addEventListener('click', function (e) {
      var it = e.target.closest('[data-nav], [data-open-url]');
      if (!it || !sidebar.contains(it)) return;
      closeDrawer();
      /* 带 data-open-url 的（预设中心）交给 app.js 的全局委托打开 */
      if (it.hasAttribute('data-open-url')) return;
      runAction(it.getAttribute('data-nav'));
    });

    /* 键盘可达性：卡片是 role=button / tabindex=0 */
    sidebar.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var it = e.target.closest(ITEM_SEL);
      if (!it) return;
      e.preventDefault();
      closeDrawer();
      if (it.hasAttribute('data-open-url')) { it.click(); return; }
      runAction(it.getAttribute('data-nav'));
    });

    /* ---------- 入场动效：纯增强，失败即降级 ---------- */
    function animateItems() {
      var items = sidebar.querySelectorAll(ITEM_SEL);
      if (!items.length) return;
      if (!window.anime || !window.anime.animate) { resetItems(); return; }
      try {
        window.anime.animate(items, {
          opacity: [0, 1],
          x: [-12, 0],
          delay: window.anime.stagger(38),
          duration: 340,
          ease: 'outCubic',
          onComplete: resetItems
        });
      } catch (err) {
        resetItems();     /* 任何异常都退回「CSS 默认可见」 */
      }
    }

    if (window.MutationObserver) {
      new MutationObserver(function () {
        if (sidebar.classList.contains('active')) animateItems();
        else resetItems();
      }).observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }


    /* ---------- 通用编辑器页面(#teditor-grid)入口绑定 ---------- */
    var tGrid = document.getElementById('teditor-grid');
    if (tGrid) {
      tGrid.addEventListener('click', function (e) {
        var c = e.target.closest('.tool-card');
        if (!c) return;
        if (c.hasAttribute('data-open-url')) { return; }   /* 预设中心走 app.js 委托 */
        var act = c.getAttribute('data-act');
        if (act === 'new') { enterEditor(); return; }      /* 用户主动新建 -> 直接进入编辑器 */
        if (act === 'preset') { return; }
        if (act === 'about') {
          directSwitch('view-home');
          setTimeout(function () {
            var a = document.getElementById('about-card');
            if (a && a.scrollIntoView) a.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 90);
          return;
        }
        var t = { project: 'view-project', template: 'view-template', tutorial: 'view-tutorial' }[act];
        if (t) directSwitch(t);
      });
    }

    /* 兜底：即便上面全部失效，条目也必须是可见的 */
    resetItems();
  });
})();
