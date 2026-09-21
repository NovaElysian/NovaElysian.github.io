/* T显编辑器 v2.6 深度升级 · 界面布局重构（工程台·三栏化）
 * 将原「画布在顶、属性在底」的堆叠布局重排为：
 *   顶   = 中：预览画布 + 右：属性面板（左可放时间轴图层面板）
 *   底   = 完整时间轴（工具栏+轨道，保留原图层头列不走样）
 * 做法：仅重排 #preview-container 与 #layer-prop-panel 两个节点的位置，
 * 不动时间轴内部结构，杜绝轨道滚动错位；提供「经典/工程台」切换按钮，可完整回退。
 */
(function () {
  function onReady(fn) { if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }
  onReady(function () {
    var ed = document.getElementById('view-editor');
    if (!ed) return;
    var applied = false;
    var refs = null;

    function snapshot() {
      function cap(el) { return el ? { parent: el.parentNode, next: el.nextSibling } : null; }
      refs = { preview: cap(document.getElementById('preview-container')), prop: cap(document.getElementById('layer-prop-panel')) };
    }

    function apply3col() {
      var hdr = ed.querySelector('.editor-header');
      var preview = document.getElementById('preview-container');
      var prop = document.getElementById('layer-prop-panel');
      if (!hdr || !preview || !prop || document.getElementById('edx-stage') || applied) return;
      if (!refs) snapshot();

      var stage = document.createElement('div');
      stage.className = 'edx-stage';
      stage.id = 'edx-stage';
      var main = document.createElement('div');
      main.className = 'edx-main';
      var pcell = document.createElement('div');
      pcell.className = 'edx-preview-cell';
      pcell.id = 'edx-preview-cell';
      var ccell = document.createElement('div');
      ccell.className = 'edx-prop-cell';
      ccell.id = 'edx-prop-cell';
      main.appendChild(pcell);
      main.appendChild(ccell);
      stage.appendChild(main);

      ed.insertBefore(stage, preview);
      pcell.appendChild(preview);
      ccell.appendChild(prop);

      ed.classList.add('edx-3col');
      applied = true;
      btn && btn.classList.add('edx-on');
      save('1');
    }

    function revert3col() {
      var stage = document.getElementById('edx-stage');
      if (!ed || !stage) return;
      var preview = document.getElementById('preview-container');
      var prop = document.getElementById('layer-prop-panel');
      if (refs && refs.preview && refs.preview.parent && preview) {
        refs.preview.parent.insertBefore(preview, refs.preview.next);
      }
      if (refs && refs.prop && refs.prop.parent && prop) {
        refs.prop.parent.insertBefore(prop, refs.prop.next);
      }
      stage.parentNode && stage.parentNode.removeChild(stage);
      ed.classList.remove('edx-3col');
      applied = false;
      btn && btn.classList.remove('edx-on');
      save('0');
    }

    function load() { try { return localStorage.getItem('edx_3col'); } catch (e) { return '1'; } }
    function save(v) { try { localStorage.setItem('edx_3col', v); } catch (e) {} }

    /* 布局切换按钮（放在预览按钮旁） */
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tool-btn edx-btn-layout';
    btn.id = 'edx-btn-layout';
    btn.title = '切换 三栏工程台 / 经典布局';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>';
    var toolbar = document.getElementById('main-toolbar');
    var pb = document.getElementById('edx-btn-preview');
    if (toolbar) { if (pb && pb.nextSibling) toolbar.insertBefore(btn, pb.nextSibling); else toolbar.appendChild(btn); }

    btn.addEventListener('click', function () { if (applied) revert3col(); else apply3col(); });

    /* 首次进入按偏好应用（默认工程台） */
    var activated = false;
    function ensure() {
      if (!ed.classList.contains('active')) return;
      if (activated) return; activated = true;
      if (load() !== '0') apply3col();
    }
    if (ed.classList.contains('active')) { ensure(); }
    if (window.MutationObserver) {
      new MutationObserver(function () { ensure(); })
        .observe(ed, { attributes: true, attributeFilter: ['class'] });
    }

    /* 窗口缩放：小屏回退经典，避免挤压 */
    function relayout(){ if(window.innerWidth < 760 && applied) revert3col(); }
    var rto; window.addEventListener('resize', function(){ clearTimeout(rto); rto = setTimeout(relayout, 150); });
  });
})();