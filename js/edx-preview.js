/* T显编辑器 v2.4 深度升级 · 实时预览面板
 * 功能：工具栏「预览」按钮 → 右侧抽屉面板，含三个 Tab：
 *   1) 命令预览  实时生成的 mcfunction 文本（复用 __EDITOR_CORE_GENERATE__），一键复制
 *   2) 玩家视角  当前帧文字按 § 色码上色的近似渲染（玩家实际看到的画面）
 *   3) rawtext   当前导出中 rawtext JSON 结构（美化缩进）
 * 刷新策略：开面板时立即刷 + 编辑器内 input/点击防抖刷 + 常开时低频轮询兜底。
 * 不挂全局 MutationObserver，避免既往卡死问题；所有 id/data-ui-action 绑定原样保留。
 */
(function () {
  function onReady(fn) {
    if (document.readyState !== 'loading') { fn(); } else { document.addEventListener('DOMContentLoaded', fn); }
  }
  onReady(function () {
    var ed = document.getElementById('view-editor');
    if (!ed) return;

    var TAIL = 'ui_tick';
    var versionMode = 'netease'; /* netease=网易中国版(默认) / bedrock=标准基岩版 */
    var pending = null;          /* debounce 计时器 */

    /* ---------- 数据准备：与 ui.js openExportSheet 一致的帧切分 ---------- */
    function buildFrames() {
      var App = window.App; if (!App || !App.state) return null;
      var e = App.state;
      var set = new Set([0]);
      var maxTrack = 0;
      e.menuLines.forEach(function (line) {
        set.add(line.startTick || 0);
        set.add((line.startTick || 0) + (line.durationTicks || 20));
        if ((line.trackIndex || 0) > maxTrack) maxTrack = line.trackIndex;
      });
      var pts = Array.from(set).sort(function (a, b) { return a - b; });
      var frames = [];
      for (var t = 0; t < pts.length - 1; t++) {
        var start = pts[t], dur = pts[t + 1] - start, lines = [];
        for (var tr = 0; tr <= maxTrack; tr++) {
          var l = e.menuLines.find(function (m) {
            return (m.trackIndex === tr) && (m.startTick || 0) <= start && (m.startTick || 0) + (m.durationTicks || 20) > start;
          });
          if (l) lines.push(l);
        }
        frames.push({ duration: dur, lines: lines });
      }
      return { frames: frames };
    }

    function currentTick() {
      var ph = document.getElementById('playhead-time');
      if (ph) { var n = parseInt(ph.textContent, 10); if (!isNaN(n)) return n; }
      var App = window.App;
      if (App && App.state && typeof App.state.currentTick === 'number') return App.state.currentTick;
      return 0;
    }

    function pickFrame(frames) {
      if (!frames || !frames.frames || !frames.frames.length) return null;
      var tick = currentTick();
      for (var i = 0; i < frames.frames.length; i++) {
        var f = frames.frames[i], a = 1, b = a + f.duration - 1;
        if (tick >= a && tick <= b) return f;
      }
      /* 播放头未落在任何帧（如初始 tick 0）时，回退到首个有文字的帧 */
      for (var j = 0; j < frames.frames.length; j++) {
        var has = (frames.frames[j].lines || []).some(function (l) {
          return l && l.type === 'text' && l.text.replace(/§[0-9a-fk-or]/gi, '').trim() !== '';
        });
        if (has) return frames.frames[j];
      }
      return frames.frames[0];
    }

    /* ---------- 指令生成（复用核心模块） ---------- */
    function generate() {
      var frames = buildFrames();
      if (!frames) return '（暂无项目数据）';
      if (typeof window.__EDITOR_CORE_GENERATE__ === 'function') {
        var txt = window.__EDITOR_CORE_GENERATE__(window.App.state, frames, TAIL, true);
        return (versionMode === 'netease' ? '# 输出目标：网易中国版\n' : '# 输出目标：标准基岩版\n') + txt;
      }
      return '（核心生成模块未加载）';
    }

    /* ---------- rawtext JSON 结构（从生成的动画指令尾部提取 payload） ---------- */
    function rawtextJSON() {
      var txt = generate();
      var key = 'actionbar ';
      var i = txt.lastIndexOf(key);
      if (i < 0) return '（无 rawtext 输出）';
      var payload = txt.slice(i + key.length).trim();
      try {
        return JSON.stringify(JSON.parse(payload), null, 2);
      } catch (e) {
        return '（rawtext 解析失败）';
      }
    }

    /* ---------- 玩家视角：§ 色码上色 ---------- */
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    function colorize(text) {
      if (!text) return '';
      var cm = (window.App && window.App.font) ? window.App.font.colorMap : null;
      var out = '', cur = null, buf = '';
      function flush() {
        if (buf) out += cur ? '<span style="color:' + cur + '">' + esc(buf) + '</span>' : esc(buf);
        buf = '';
      }
      for (var i = 0; i < text.length; i++) {
        var c = text[i];
        if ((c === '§' || c === '&') && i + 1 < text.length) {
          var code = text[i + 1].toLowerCase();
          if (c === '§' && cm && Object.prototype.hasOwnProperty.call(cm, code)) { flush(); cur = cm[code]; }
          else if (c === '§' && code === 'r') { flush(); cur = null; }
          else { buf += c + text[i + 1]; }
          i++;
          continue;
        }
        buf += c;
      }
      flush();
      return out;
    }

    function renderMockup() {
      var frames = buildFrames();
      var frame = pickFrame(frames);
      var lines = frame ? frame.lines.slice() : [];
      var textLines = lines.filter(function (l) { return l && l.type === 'text'; });
      if (!textLines.length) return '<div class="edx-pp-empty">（当前帧没有文本）</div>';
      var minX = Infinity;
      textLines.forEach(function (l) { if (l.text.replace(/§[0-9a-fk-or]/gi, '').trim() && l.x < minX) minX = l.x; });
      if (minX === Infinity) minX = 0;
      var rows = [];
      textLines.forEach(function (l) {
        var pad = Math.max(0, (l.x || 0) - minX);
        rows.push('<div class="edx-pp-line" style="padding-left:' + Math.min(pad, 120) + 'px">' + colorize(l.text || '') + '</div>');
      });
      return rows.join('');
    }

    /* ---------- 刷新（三种 Tab 一起更新） ---------- */
    function refresh() {
      if (!panel.classList.contains('edx-open')) return;
      var cmd = document.getElementById('edx-pp-cmd');
      var mock = document.getElementById('edx-pp-mock');
      var raw = document.getElementById('edx-pp-raw');
      if (cmd) cmd.textContent = generate();
      if (mock) mock.innerHTML = renderMockup();
      if (raw) raw.textContent = rawtextJSON();
    }

    function schedule() {
      clearTimeout(pending);
      pending = setTimeout(refresh, 350);
    }

    /* ---------- 构建面板 DOM ---------- */
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tool-btn edx-btn-preview';
    btn.id = 'edx-btn-preview';
    btn.title = '实时预览（命令 / 玩家视角 / rawtext）';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/></svg>';
    var toolbar = document.getElementById('main-toolbar');
    if (toolbar) toolbar.insertBefore(btn, toolbar.firstChild);

    var panel = document.createElement('div');
    panel.className = 'edx-preview-panel';
    panel.id = 'edx-preview-panel';
    panel.innerHTML =
      '<div class="edx-pp-head">' +
        '<span class="edx-pp-title">实时预览</span>' +
        '<div class="edx-pp-vers">' +
          '<button type="button" class="edx-pp-ver edx-on" data-ver="netease">网易中国版</button>' +
          '<button type="button" class="edx-pp-ver" data-ver="bedrock">标准基岩版</button>' +
        '</div>' +
        '<div class="edx-pp-actions">' +
          '<button type="button" id="edx-pp-copy" title="复制命令">复制</button>' +
          '<button type="button" id="edx-pp-close" title="关闭">&times;</button>' +
        '</div>' +
      '</div>' +
      '<div class="edx-pp-tabs">' +
        '<button type="button" class="edx-pp-tab edx-on" data-pp="cmd">命令</button>' +
        '<button type="button" class="edx-pp-tab" data-pp="mock">玩家视角</button>' +
        '<button type="button" class="edx-pp-tab" data-pp="raw">rawtext</button>' +
      '</div>' +
      '<div class="edx-pp-body">' +
        '<pre id="edx-pp-cmd" class="edx-pp-cmd"></pre>' +
        '<div id="edx-pp-mock" class="edx-pp-mock"></div>' +
        '<pre id="edx-pp-raw" class="edx-pp-raw"></pre>' +
      '</div>';
    ed.appendChild(panel);
    var bodyWrap = panel.querySelector('.edx-pp-body');
    if (bodyWrap) bodyWrap.classList.add('edx-pp-cmd-active');

    var panelOpen = false;
    function togglePanel(force) {
      var toOpen = (force === undefined) ? !panelOpen : force;
      panelOpen = toOpen;
      if (toOpen) {
        panel.classList.add('edx-open');
        btn.classList.add('edx-on');
        panel.hidden = false;
        requestAnimationFrame(refresh);
      } else {
        panel.classList.remove('edx-open');
        btn.classList.remove('edx-on');
        setTimeout(function () { if (!panelOpen) panel.hidden = true; }, 260);
      }
    }

    btn.addEventListener('click', function () { togglePanel(); });

    var closeBtn = document.getElementById('edx-pp-close');
    if (closeBtn) closeBtn.addEventListener('click', function () { togglePanel(false); });

    var copyBtn = document.getElementById('edx-pp-copy');
    if (copyBtn) copyBtn.addEventListener('click', function () {
      var txt = document.getElementById('edx-pp-cmd');
      if (!txt || !txt.textContent) return;
      var old = copyBtn.textContent;
      function done() { copyBtn.textContent = '已复制'; setTimeout(function () { copyBtn.textContent = old; }, 1200); }
      var fallbackCopy = function () {
        var ta = document.createElement('textarea');
        ta.value = txt.textContent; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(txt.textContent).then(done, function () { fallbackCopy(); done(); });
      } else { fallbackCopy(); done(); }
    });

    /* Tab / 版本切换 */
    panel.addEventListener('click', function (e) {
      var ver = e.target.closest('.edx-pp-ver');
      if (ver) {
        versionMode = ver.getAttribute('data-ver') || 'netease';
        panel.querySelectorAll('.edx-pp-ver').forEach(function (b) { b.classList.toggle('edx-on', b === ver); });
        refresh();
        return;
      }
      var tab = e.target.closest('.edx-pp-tab');
      if (!tab) return;
      var key = tab.getAttribute('data-pp');
      panel.querySelectorAll('.edx-pp-tab').forEach(function (b) { b.classList.toggle('edx-on', b === tab); });
      var body = panel.querySelector('.edx-pp-body');
      ['cmd', 'mock', 'raw'].forEach(function (k) { body.classList.remove('edx-pp-' + k + '-active'); });
      body.classList.add('edx-pp-' + key + '-active');
    });

    /* ---------- 触发刷新的事件钩子（防抖，不开全局 observer） ---------- */
    document.addEventListener('input', function () { if (panelOpen) schedule(); }, true);
    document.addEventListener('change', function () { if (panelOpen) schedule(); }, true);
    ed.addEventListener('click', function (e) {
      if (panelOpen && e.target.closest('.tool-btn, .header-icon, .prop-menu-item, .x-tag')) schedule();
    }, true);

    /* 常开时的低频兜底轮询（业务量小，安全） */
    setInterval(function () { if (panelOpen) schedule(); }, 900);
  });
})();