/* T显编辑器 v2.0 爆改：动效 + 首次进入引导（不破坏核心逻辑） */
(function () {
  function onReady(fn) { if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }
  onReady(function () {
    var A = window.anime || null;
    var ed = document.getElementById('view-editor');
    if (!ed) return;

    /* 进入编辑器：触发整体浮现动效 */
    function entering() {
      if (!ed.classList.contains('active')) return;
      ed.classList.remove('is-entering');
      void ed.offsetWidth;               /* 重启动画 */
      ed.classList.add('is-entering');
      clearTimeout(ed._ti); ed._ti = setTimeout(function () { ed.classList.remove('is-entering'); }, 700);
    }
    if (window.MutationObserver) {
      new MutationObserver(function () {
        if (ed.classList.contains('active')) entering();
      }).observe(ed, { attributes: true, attributeFilter: ['class'] });
    }

    /* 工具栏按钮点击轻弹 */
    ed.addEventListener('touchstart', function (e) {
      var b = e.target.closest('.tool-btn, .header-icon');
      if (b && A) { A.animate(b, { scale: [1, 0.9], duration: 90, ease: 'outQuad' }); }
    }, { passive: true });
    ed.addEventListener('transitionend', function () {}, true);

    /* 播放按钮播放态 */
    var play = document.getElementById('btn-play');
    if (play) {
      play.addEventListener('click', function () { play.classList.toggle('ed-playing'); });
    }

    /* 首次进入引导（localStorage 记忆，只提示一次） */
    var seen = false; try { seen = localStorage.getItem('edx_seen_v2') === '1'; } catch (e) {}
    if (!seen) {
      var entrance = 0;
      var ob2 = new MutationObserver(function () { maybeTip(); });
      ob2.observe(ed, { attributes: true, attributeFilter: ['class'] });
      function maybeTip() {
        if (!ed.classList.contains('active')) return;
        if (++entrance > 1 || document.getElementById('ed-tip')) return;
        try { localStorage.setItem('edx_seen_v2', '1'); } catch (e) {}
        var tip = document.createElement('div');
        tip.className = 'ed-tip';
        tip.id = 'ed-tip';
        tip.innerHTML = '<span>' +
          '<b>欢迎使用 T显编辑器</b><br>' +
          '<span class="ed-tip-bullet">1.</span> 点左下 <b>＋</b> 添加「文本 / 积木 / 图块」图层<br>' +
          '<span class="ed-tip-bullet">2.</span> 画布上拖动、缩放定位，右侧调属性<br>' +
          '<span class="ed-tip-bullet">3.</span> 右下角<b>导出</b>生成 mcfunction 指令</span>' +
          '<button type="button" aria-label="关闭">×</button>';
        ed.appendChild(tip);
        var close = tip.querySelector('button');
        if (close) close.addEventListener('click', function () { if (A) A.animate(tip, { opacity: 0, y: -10, duration: 220, onComplete: function () { tip.parentNode && tip.parentNode.removeChild(tip); } }); else tip.remove(); });
        if (A) A.animate(tip, { opacity: [0, 1], y: [14, 0], duration: 320, ease: 'outCubic' });
      }
      maybeTip();
    }
  });
})();
