/* T显编辑器 v2.5 深度升级 · 编辑功能增强
 * ① § 色板：在编辑文字区上方，点色块在光标处插入 § 色码（含重置§r）
 * ② 查找 / 替换：在编辑文字区内的当前文本行查找与全文文本节点替换
 * ③ 快捷键：Ctrl+Enter 预览 · Ctrl+S 导出 · Ctrl+F 查找
 * 全部为增量 DOM/CSS，不改动既有 id/data-ui-action 绑定。
 */
(function () {
  function onReady(fn) { if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }
  onReady(function () {
    var ed = document.getElementById('view-editor');
    var textInput = document.getElementById('prop-text-input');
    if (!ed) return;

    /* ================= ① § 色板 ================= */
    var COLORS = [
      ['黑','0','#000000'],['深蓝','1','#0000AA'],['深绿','2','#00AA00'],['深青','3','#00AAAA'],
      ['深红','4','#AA0000'],['紫','5','#AA00AA'],['金','6','#FFAA00'],['浅灰','7','#AAAAAA'],
      ['深灰','8','#555555'],['蓝','9','#5555FF'],['绿','a','#55FF55'],['青','b','#55FFFF'],
      ['红','c','#FF5555'],['粉','d','#FF55FF'],['黄','e','#FFFF55'],['白','f','#FFFFFF']
    ];
    var textWrap = textInput ? textInput.closest('.x-prop-sub-col') || textInput.parentNode : null;
    if (textInput && textWrap) {
      var bar = document.createElement('div');
      bar.className = 'edx-colorbar';
      bar.innerHTML = '<span class="edx-colorbar-title">文字颜色</span><div class="edx-colorbar-swatches">' +
        COLORS.map(function (c) {
          return '<button type="button" class="edx-swatch" data-code="' + c[1] + '" title="' + c[0] + '" style="background:' + c[2] + '"></button>';
        }).join('') +
        '<button type="button" class="edx-swatch edx-swatch-reset" data-code="r" title="重置颜色(§r)">重置</button></div>';
      textWrap.insertBefore(bar, textInput);
      bar.addEventListener('mousedown', function (e) { e.preventDefault(); }); /* 保持编辑器选中与光标 */
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('.edx-swatch');
        if (b && textInput) insertCode(b.getAttribute('data-code'));
      });
    }

    function insertCode(code) {
      var sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      var range = sel.getRangeAt(0);
      if (!textInput.contains(range.commonAncestorContainer)) return;
      if (range.collapsed) {
        var tn = document.createTextNode('§' + code);
        range.insertNode(tn);
        range.setStartAfter(tn); range.collapse(true);
        sel.removeAllRanges(); sel.addRange(range);
      } else {
        var selTxt = range.toString();
        range.deleteContents();
        var frag = document.createDocumentFragment();
        frag.appendChild(document.createTextNode('§' + code));
        frag.appendChild(document.createTextNode(selTxt));
        range.insertNode(frag);
        range.setStartAfter(frag); range.collapse(true);
        sel.removeAllRanges(); sel.addRange(range);
      }
      textInput.dispatchEvent(new Event('input', { bubbles: true }));
      textInput.focus();
    }

    /* ================= ② 查找 / 替换 ================= */
    var find = document.createElement('div');
    find.className = 'edx-find';
    find.id = 'edx-find';
    find.hidden = true;
    find.innerHTML =
      '<div class="edx-find-row">' +
        '<input id="edx-find-term" class="edx-find-input" placeholder="查找…" autocomplete="off">' +
        '<span id="edx-find-count" class="edx-find-count">0</span>' +
      '</div>' +
      '<div class="edx-find-row">' +
        '<input id="edx-find-repl" class="edx-find-input" placeholder="替换为…" autocomplete="off">' +
        '<button type="button" id="edx-find-replaceall" class="edx-find-btn">替换全部</button>' +
      '</div>';
    ed.appendChild(find);

    function walkTextNodes(node, fn) {
      if (node.nodeType === 3) { fn(node); return; }
      var cs = node.childNodes; for (var i = 0; i < cs.length; i++) walkTextNodes(cs[i], fn);
    }
    function countMatches() {
      if (!textInput) return 0;
      var term = document.getElementById('edx-find-term').value;
      if (!term) return 0;
      var n = 0;
      walkTextNodes(textInput, function (tn) {
        var idx = tn.nodeValue.indexOf(term);
        while (idx !== -1) { n++; idx = tn.nodeValue.indexOf(term, idx + Math.max(1, term.length)); }
      });
      return n;
    }
    function refreshCount() {
      var c = document.getElementById('edx-find-count');
      if (c) c.textContent = String(countMatches());
    }
    function openFind() {
      find.hidden = false; find.classList.add('edx-open');
      var term = document.getElementById('edx-find-term');
      if (term) { term.focus(); term.select(); }
      refreshCount();
    }
    function closeFind() { find.classList.remove('edx-open'); find.hidden = true; }
    function replaceAll() {
      if (!textInput) return;
      var term = document.getElementById('edx-find-term').value;
      var repl = document.getElementById('edx-find-repl').value;
      if (!term) { refreshCount(); return; }
      walkTextNodes(textInput, function (tn) {
        if (tn.nodeValue && tn.nodeValue.indexOf(term) !== -1) {
          tn.nodeValue = tn.nodeValue.split(term).join(repl);
        }
      });
      textInput.dispatchEvent(new Event('input', { bubbles: true }));
      refreshCount();
    }
    var termEl = document.getElementById('edx-find-term');
    var replEl = document.getElementById('edx-find-repl');
    if (termEl) termEl.addEventListener('input', refreshCount);
    if (replEl) replEl.addEventListener('input', function () {});
    var raBtn = document.getElementById('edx-find-replaceall');
    if (raBtn) raBtn.addEventListener('click', replaceAll);
    find.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeFind(); if (e.key === 'Enter') { e.preventDefault(); replaceAll(); } });
    /* 点击空白关闭 */
    document.addEventListener('mousedown', function (e) {
      if (!find.hidden && !find.contains(e.target) && e.target !== textInput) closeFind();
    });

    /* ================= ③ 快捷键 ================= */
    document.addEventListener('keydown', function (e) {
      if (!ed.classList.contains('active')) return;
      if (e.key === 'Escape') { if (!find.hidden) closeFind(); return; }
      if (!(e.ctrlKey || e.metaKey)) return;
      var k = (e.key || '').toLowerCase();
      if (k === 'enter') { e.preventDefault(); var pb = document.getElementById('edx-btn-preview'); if (pb) pb.click(); }
      else if (k === 's') { e.preventDefault(); var be = document.getElementById('btn-export'); if (be) be.click(); }
      else if (k === 'f') { e.preventDefault(); openFind(); }
    });
  });
})();