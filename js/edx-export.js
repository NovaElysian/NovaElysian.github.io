/* T显编辑器 v2.7 深度升级 · 导出能力增强
 * 在导出面板追加：输出模式切换(完整函数/单条逐帧)、下载 .mcfunction、分享。
 * 复用 __EDITOR_CORE_GENERATE__ 与既有一键复制(#btn-copy-cmd)，不动原绑定。
 */
(function () {
  function onReady(fn) { if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }
  onReady(function () {
    var box = document.querySelector('.x-export-actions');
    var ta = document.getElementById('export-textarea');
    if (!box || !ta) return;

    function buildFrames() {
      var App = window.App; if (!App || !App.state) return null;
      var e = App.state;
      var set = new Set([0]); var maxTrack = 0;
      (e.menuLines || []).forEach(function (l) {
        set.add(l.startTick || 0); set.add((l.startTick || 0) + (l.durationTicks || 20));
        if ((l.trackIndex || 0) > maxTrack) maxTrack = l.trackIndex;
      });
      var pts = Array.from(set).sort(function (a, b) { return a - b; });
      var frames = [];
      for (var t = 0; t < pts.length - 1; t++) {
        var s = pts[t], dur = pts[t + 1] - s, lines = [];
        for (var tr = 0; tr <= maxTrack; tr++) {
          var l = (e.menuLines || []).find(function (m) {
            return (m.trackIndex === tr) && (m.startTick || 0) <= s && (m.startTick || 0) + (m.durationTicks || 20) > s;
          });
          if (l) lines.push(l);
        }
        frames.push({ duration: dur, lines: lines });
      }
      return { frames: frames };
    }

    function regen(merge) {
      var frames = buildFrames();
      if (!frames || !window.App || !window.App.state) { ta.value = '（无项目数据）'; return; }
      if (typeof window.__EDITOR_CORE_GENERATE__ === 'function') {
        ta.value = window.__EDITOR_CORE_GENERATE__(window.App.state, frames, 'ui_tick', merge);
      }
    }

    /* 模式切换 + 下载 + 分享 */
    var modes = document.createElement('div');
    modes.className = 'edx-exp-modes';
    modes.innerHTML =
      '<button type="button" class="edx-mode edx-on" data-merge="1">完整函数</button>' +
      '<button type="button" class="edx-mode" data-merge="0">单条逐帧</button>';
    var dl = document.createElement('button');
    dl.type = 'button'; dl.className = 'outline-btn'; dl.id = 'btn-download-mc'; dl.textContent = '下载 .mcfunction';
    var sh = document.createElement('button');
    sh.type = 'button'; sh.className = 'outline-btn'; sh.id = 'btn-share-export'; sh.textContent = '分享';

    box.insertBefore(modes, box.firstChild);
    box.insertBefore(dl, modes.nextSibling);
    box.insertBefore(sh, dl.nextSibling);

    modes.addEventListener('click', function (e) {
      var m = e.target.closest('.edx-mode'); if (!m) return;
      modes.querySelectorAll('.edx-mode').forEach(function (b) { b.classList.toggle('edx-on', b === m); });
      regen(m.getAttribute('data-merge') === '1');
    });

    dl.addEventListener('click', function () {
      var val = ta.value; if (!val) return;
      var title = '';
      var ti = document.querySelector('.editor-title-input'); if (ti && ti.value) title = ti.value.trim();
      if (!title) title = 'T显指令';
      var name = title.replace(/[\\/:*?"<>|]/g, '').slice(0, 40) || 'T显指令';
      var blob = new Blob([val], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = name + '.mcfunction';
      document.body.appendChild(a); a.click();
      setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 300);
    });

    sh.addEventListener('click', function () {
      var val = ta.value; if (!val) return;
      var text = '通用T显编辑器导出的指令：\n\n' + val;
      if (navigator.share) {
        navigator.share({ title: 'T显指令', text: text }).catch(function () { copyText(text); });
      } else { copyText(text); }
    });
    function copyText(text) {
      function fb() { var ta2 = document.createElement('textarea'); ta2.value = text; document.body.appendChild(ta2); ta2.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(ta2); }
      if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).catch(fb); } else { fb(); }
    }

    /* 打开导出面板时按当前模式刷新一次 */
    var sheet = document.getElementById('export-sheet');
    if (sheet && window.MutationObserver) {
      var prev = sheet.classList.contains('active');
      new MutationObserver(function () {
        var now = sheet.classList.contains('active');
        if (now && !prev) {
          var cur = modes.querySelector('.edx-mode.edx-on');
          regen(cur ? cur.getAttribute('data-merge') === '1' : true);
        }
        prev = now;
      }).observe(sheet, { attributes: true, attributeFilter: ['class'] });
    }
  });
})();