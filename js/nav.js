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

    /* ---------- 进入编辑器：最近的项目；没有则新建 ----------
       不再经过「创建项目」面板 —— 与参考实现一致（打开即是编辑器）。 */
    function enterEditor() {
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
        window.App.storage.saveProject(p);
      }
      window.App.openProjectById(p.id);
    }

    /* ---------- 动作分派 ---------- */
    var VIEW_MAP = {
      home: 'view-home',
      workshop: 'view-workshop',
      template: 'view-template',
      tutorial: 'view-tutorial',
      project: 'view-project'
    };

    function runAction(nav) {
      var el;
      if (nav === 'editor') { enterEditor(); return; }
      if (nav === 'sites') { location.href = 'sites.html'; return; }
      if (nav === 'more') { location.href = 'more.html'; return; }
      if (nav === 'fuhao') { location.href = 'fuhao.html'; return; }
      if (nav === 'changelog') { location.href = 'changelog.html'; return; }
      if (nav === 'about') {
        el = document.querySelector('.app-tabbar .tab-item[data-target="view-home"]');
        if (el) el.click();
        setTimeout(function () {
          var a = document.getElementById('about-card');
          if (a && a.scrollIntoView) a.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 90);
        return;
      }
      var target = VIEW_MAP[nav];
      if (target) {
        el = document.querySelector('.app-tabbar .tab-item[data-target="' + target + '"]');
        if (el) el.click();
      }
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

    /* 兜底：即便上面全部失效，条目也必须是可见的 */
    resetItems();
  });
})();
