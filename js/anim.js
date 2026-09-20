/* 通用T显编辑器 v1.5.0 动效与交互 (animejs v4) */
(function () {
  function onReady(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }
  onReady(function () {
    var util = window.anime || null;

    /* --- 网站公告条：可关闭并记忆 --- */
    var bar = document.getElementById('announce-bar');
    var cls = document.getElementById('announce-close');
    if (bar && cls) {
      try { if (localStorage.getItem('announce_v150_hidden')) { bar.classList.add('hidden'); } } catch (e) {}
      cls.addEventListener('click', function () {
        bar.classList.add('hidden');
        try { localStorage.setItem('announce_v150_hidden', '1'); } catch (e) {}
      });
    }

    /* --- 复制工具 + 轻提示 --- */
    function fallbackCopy(t, cb) {
      var ta = document.createElement('textarea');
      ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); cb(); } catch (e) {}
      document.body.removeChild(ta);
    }
    function copyText(t, cb) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(cb, function () { fallbackCopy(t, cb); });
      } else { fallbackCopy(t, cb); }
    }
    function toast(msg) {
      var el = document.getElementById('app-toast');
      if (!el) { el = document.createElement('div'); el.id = 'app-toast'; document.body.appendChild(el); }
      el.textContent = msg; el.classList.add('show');
      clearTimeout(el._t);
      el._t = setTimeout(function () { el.classList.remove('show'); }, 1800);
    }

    /* --- 开发者 QQ 与群聊：点按复制 --- */
    var devQQ = document.getElementById('dev-qq');
    if (devQQ) {
      devQQ.addEventListener('click', function () {
        copyText('1913816411', function () { toast('已复制开发者QQ：1913816411'); });
      });
    }
    var gl = document.getElementById('group-link');
    if (gl) {
      gl.addEventListener('click', function (e) {
        e.preventDefault();
        copyText('137759778', function () { toast('已复制群号：137759778，请在QQ搜索加入'); });
      });
    }

    /* --- 实时搜索（教程 / 模板）--- */
    function bindSearch(inputId, gridId, itemSel) {
      var input = document.getElementById(inputId);
      if (!input) return;
      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase();
        var nodes = (document.getElementById(gridId) || document).querySelectorAll(itemSel);
        var visible = 0, i;
        for (i = 0; i < nodes.length; i++) {
          var c = nodes[i];
          var ok = !q || (c.textContent || '').toLowerCase().indexOf(q) > -1;
          c.style.display = ok ? '' : 'none';
          if (ok) visible++;
        }
        var nr = document.getElementById(inputId + '-empty');
        if (!nr) {
          nr = document.createElement('div');
          nr.className = 'search-empty';
          nr.id = inputId + '-empty';
          if (input.parentNode) input.parentNode.insertBefore(nr, input.nextSibling);
        }
        nr.style.display = visible ? 'none' : 'block';
        nr.textContent = '未找到匹配结果';
      });
    }

    /* --- animejs 入场动效 --- */
    function forceShow() {
      var el = document.querySelectorAll('.anim-rise, #view-home .post-card');
      for (var i = 0; i < el.length; i++) el[i].style.opacity = '1';
    }
    if (util) {
      // 首页卡片错峰浮现
      var cards = document.querySelectorAll('#view-home .post-card');
      if (cards.length) {
        util.animate(cards, { opacity: [0, 1], translateY: [22, 0], delay: util.stagger(150), duration: 700, ease: 'outCubic' });
      }
      // 带 .anim-rise 的独立元素（关于卡等）上浮
      var rises = document.querySelectorAll('.anim-rise');
      if (rises.length) {
        util.animate(rises, { opacity: [0, 1], translateY: [16, 0], delay: 250, duration: 650, ease: 'outCubic' });
      }
      // 关于卡操作项微脉冲
      var pulse = document.querySelectorAll('.about-item');
      if (pulse.length) {
        util.animate(pulse, { scale: [1, 1.04], duration: 720, ease: 'inOutSine', loop: true, alternate: true });
      }
    } else {
      forceShow();
    }
    setTimeout(forceShow, 1500);
  });
})();
