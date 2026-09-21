/* T显编辑器 v2.2 动效+引导（修复：MutationObserver 死循环导致页面卡死） */
(function () {
  function onReady(fn) { if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }
  onReady(function () {
    var A = window.anime || null;
    var ed = document.getElementById('view-editor');
    if (!ed) return;

    function entering() {
      if (!ed.classList.contains('active')) return;
      ed.classList.remove('is-entering');
      void ed.offsetWidth;
      ed.classList.add('is-entering');
      clearTimeout(ed._ti);
      ed._ti = setTimeout(function () { ed.classList.remove('is-entering'); }, 700);
    }

    function maybeTip() {
      if (!ed.classList.contains('active')) return;
      if (document.getElementById('ed-tip')) return;
      var seen = false; try { seen = localStorage.getItem('edx_seen_v2') === '1'; } catch (e) {}
      if (seen) return;
      try { localStorage.setItem('edx_seen_v2', '1'); } catch (e) {}
      var tip = document.createElement('div');
      tip.className = 'ed-tip'; tip.id = 'ed-tip';
      tip.innerHTML = '<span>' +
        '<b>欢迎使用 T显编辑器</b><br>' +
        '<span class="ed-tip-bullet">1.</span> 点左下 <b>＋</b> 添加「文本 / 积木 / 图块」图层<br>' +
        '<span class="ed-tip-bullet">2.</span> 画布上拖动、缩放定位，右侧调属性<br>' +
        '<span class="ed-tip-bullet">3.</span> 右下角<b>导出</b>生成 mcfunction 指令</span>' +
        '<button type="button" aria-label="关闭">×</button>';
      ed.appendChild(tip);
      var c = tip.querySelector('button');
      if (c) c.addEventListener('click', function () {
        if (A) A.animate(tip, { opacity: 0, y: -10, duration: 220, onComplete: function () { tip.parentNode && tip.parentNode.removeChild(tip); } });
        else tip.remove();
      });
      if (A) A.animate(tip, { opacity: [0, 1], y: [14, 0], duration: 320, ease: 'outCubic' });
    }

    /* 关键修复：只在 inactive→active 的转折时触发一次，
       避免 entering() 内部改 class 再次触发 observer 造成死循环 */
    var prev = ed.classList.contains('active');
    if (window.MutationObserver) {
      new MutationObserver(function () {
        var now = ed.classList.contains('active');
        if (now && !prev) { entering(); maybeTip(); }
        prev = now;
      }).observe(ed, { attributes: true, attributeFilter: ['class'] });
    }

    ed.addEventListener('touchstart', function (e) {
      var b = e.target.closest('.tool-btn, .header-icon');
      if (b && A) A.animate(b, { scale: [1, 0.9], duration: 90, ease: 'outQuad' });
    }, { passive: true });

    var play = document.getElementById('btn-play');
    if (play) play.addEventListener('click', function () { play.classList.toggle('ed-playing'); });
  });
})();
