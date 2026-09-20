/* 通用T显编辑器 v1.7.0 功能抽屉导航 */
(function () {
  function onReady(fn) { if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }
  onReady(function () {
    var sidebar = document.getElementById('sidebar');
    var content = document.getElementById('sidebar-content');
    var overlay = document.getElementById('sidebar-overlay');
    var closeBtn = document.getElementById('nav-close');
    if (!sidebar || !content) return;

    function closeDrawer() { sidebar.classList.remove('active'); if (overlay) overlay.classList.remove('active'); }

    /* 点按导航条目 */
    content.addEventListener('click', function (e) {
      var it = e.target.closest('.nav-item');
      if (!it) return;
      closeDrawer();
      if (it.hasAttribute('data-open-url')) { return; } // 预设中心由 app.js 委托打开
      var nav = it.getAttribute('data-nav');
      if (nav === 'editor') { var b = document.getElementById('btn-create'); if (b) b.click(); return; }
      if (nav === 'about') {
        var tab = document.querySelector('.app-tabbar .tab-item[data-target="view-home"]');
        if (tab) tab.click();
        setTimeout(function () { var a = document.getElementById('about-card'); if (a) a.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 90);
        return;
      }
      if (nav) {
        var item = document.querySelector('.app-tabbar .tab-item[data-target="view-' + nav.split('-')[0] + '"]');
        if (nav === 'home') item = document.querySelector('[data-target="view-home"]');
        else if (nav === 'workshop') item = document.querySelector('[data-target="view-workshop"]');
        else if (nav === 'template') item = document.querySelector('[data-target="view-template"]');
        else if (nav === 'tutorial') item = document.querySelector('[data-target="view-tutorial"]');
        else if (nav === 'project') item = document.querySelector('[data-target="view-project"]');
        if (item) item.click();
      }
    });
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    /* 打开抽屉时：菜单项错峰入场 */
    function animateItems() {
      var items = sidebar.querySelectorAll('.nav-item');
      if (!sidebar.classList.contains('active')) return;
      if (window.anime) {
        window.anime.animate(items, { opacity: [0, 1], x: [-12, 0], delay: window.anime.stagger(40), duration: 380, ease: 'outCubic' });
      } else {
        items.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
      }
    }
    if (window.MutationObserver) {
      var ob = new MutationObserver(animateItems);
      ob.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }
  });
})();
