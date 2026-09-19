/* ===== 指令工坊 workshop.js v1.3.1 =====
   指令工坊：/give 生成器 / execute 语法双向转换 / 历史记录 / 推荐网站
   视觉沿用现有主题变量；网站图标用各站自带 favicon，失败回退首字母。
*/
(function () {
  // ---------- 面板切换 ----------
  var segs = document.getElementById("ws-tabs");
  var panels = ["give", "execute", "history", "sites"];
  function showPanel(name) {
    panels.forEach(function (p) {
      var el = document.getElementById("w-" + p);
      if (el) el.classList.toggle("active", p === name);
    });
    document.querySelectorAll("#ws-tabs .seg-item").forEach(function (it) {
      it.classList.toggle("active", it.getAttribute("data-wpanel") === name);
    });
  }
  if (segs) {
    segs.querySelectorAll(".seg-item").forEach(function (it) {
      it.addEventListener("click", function () {
        showPanel(it.getAttribute("data-wpanel"));
      });
    });
  }

  // ---------- 轻提示 ----------
  var toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "ws-toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("show"); }, 1600);
  }

  // ---------- 历史记录 ----------
  var RECENT_KEY = "mcbe_recent_cmds";
  function getRecent() {
    try { var v = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function saveRecent(list) { try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch (e) {} }
  function addRecent(cmd) {
    if (!cmd || !cmd.trim()) return;
    var list = getRecent();
    list = [cmd].concat(list.filter(function (c) { return c !== cmd; })).slice(0, 30);
    saveRecent(list);
    renderRecent();
  }
  function esc(s) { return String(s).replace(/[&<>]/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]; }); }
  function renderRecent() {
    var box = document.getElementById("recent-list");
    if (!box) return;
    var list = getRecent();
    if (!list.length) { box.innerHTML = '<div class="recent-item">暂无记录，生成指令后自动保存。</div>'; return; }
    box.innerHTML = list.map(function (c) {
      return '<div class="recent-item" data-cmd="' + esc(c) + '">' + esc(c) + '</div>';
    }).join("");
  }
  document.getElementById("recent-list").addEventListener("click", function (e) {
    var it = e.target.closest(".recent-item");
    if (!it) return;
    copyText(it.getAttribute("data-cmd"));
  });

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("已复制"); }, function () { toast("复制失败"); });
    } else {
      var ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast("已复制"); } catch (e) { toast("复制失败"); }
      document.body.removeChild(ta);
    }
  }

  // 通用复制按钮
  document.querySelectorAll(".ws-copy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.getAttribute("data-target"));
      if (el) copyText(el.innerText);
    });
  });

  document.getElementById("clear-recent").addEventListener("click", function () { saveRecent([]); renderRecent(); toast("已清空"); });
  document.getElementById("exportTxt").addEventListener("click", function () { download("mcbe-history.txt", getRecent().join("\n")); });
  document.getElementById("exportJson").addEventListener("click", function () {
    download("mcbe-data.json", JSON.stringify({ history: getRecent(), favorites: getFavorites() }, null, 2));
  });
  function download(name, text) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    a.download = name; a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
  }

  // ---------- /give 生成器 ----------
  document.getElementById("btn-give").addEventListener("click", function () {
    var target = document.getElementById("give-target").value.trim() || "@p";
    var item = document.getElementById("give-item").value.trim();
    if (!item) { toast("请输入物品ID"); return; }
    var amount = parseInt(document.getElementById("give-amount").value) || 1;
    var data = parseInt(document.getElementById("give-data").value) || 0;
    var comp = {};
    if (document.getElementById("give-keep-death").checked) comp["minecraft:keep_on_death"] = {};
    if (document.getElementById("give-item-lock").checked) comp["minecraft:item_lock"] = { mode: "lock_in_slot" };
    var place = splitBlocks(document.getElementById("give-placeon").value);
    if (place.length) comp["minecraft:can_place_on"] = { blocks: place };
    var destroy = splitBlocks(document.getElementById("give-destroy").value);
    if (destroy.length) comp["minecraft:can_destroy"] = { blocks: destroy };
    var comps = Object.keys(comp).length ? JSON.stringify(comp) : "";
    var cmd = "/give " + target + " " + item + " " + amount + " " + data + (comps ? " " + comps : "");
    document.getElementById("give-out").innerText = cmd;
    addRecent(cmd);
  });
  function splitBlocks(v) { return String(v || "").split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s; }); }

  // ---------- favorites (jich 保留) ----------
  function getFavorites() { try { return JSON.parse(localStorage.getItem("mcbe_favorite_cmds") || "[]"); } catch (e) { return []; } }

  // ---------- execute 双向转换 ----------
  var Tokenizer = {
    tokenize: function (str) {
      var i = 0, len = str.length, tokens = [];
      while (i < len) {
        var ch = str[i];
        if (ch === " " || ch === "\t") { i++; continue; }
        var start = i;
        if (ch === '"' || ch === "'") { var q = ch; i++; while (i < len && str[i] !== q) { if (str[i] === "\\") i++; i++; } if (i < len) i++; tokens.push({ token: str.slice(start, i), type: "String" }); continue; }
        if (ch === "~" || ch === "^") { i++; if (i < len && (str[i] === "+" || str[i] === "-")) i++; while (i < len && ((str[i] >= "0" && str[i] <= "9") || str[i] === ".")) i++; tokens.push({ token: str.slice(start, i), type: "Coordinate" }); continue; }
        if ((ch >= "0" && ch <= "9") || ((ch === "-" || ch === "+") && i + 1 < len && str[i + 1] >= "0" && str[i + 1] <= "9")) {
          if (ch === "+" || ch === "-") i++;
          while (i < len && ((str[i] >= "0" && str[i] <= "9") || str[i] === ".")) i++;
          if (i < len && str[i] === "." && i + 1 < len && str[i + 1] === ".") { i += 2; if (i < len && (str[i] === "+" || str[i] === "-")) i++; while (i < len && ((str[i] >= "0" && str[i] <= "9") || str[i] === ".")) i++; }
          tokens.push({ token: str.slice(start, i), type: "Number" }); continue;
        }
        if (ch === "." && i + 1 < len && str[i + 1] === ".") { i += 2; if (i < len && (str[i] === "+" || str[i] === "-")) i++; while (i < len && ((str[i] >= "0" && str[i] <= "9") || str[i] === ".")) i++; tokens.push({ token: str.slice(start, i), type: "Range" }); continue; }
        if (ch === "!") { i++; tokens.push({ token: str.slice(start, i), type: "Not" }); continue; }
        if (ch === "@") { i++; while (i < len && str[i] !== " " && str[i] !== "[" && str[i] !== "\t") i++; if (i < len && str[i] === "[") { var b = 1; i++; while (i < len && b > 0) { if (str[i] === "[") b++; else if (str[i] === "]") b--; i++; } } tokens.push({ token: str.slice(start, i), type: "Selector" }); continue; }
        if (ch === "{") { var bb = 1, j = i + 1; while (j < len && bb > 0) { if (str[j] === "{") bb++; else if (str[j] === "}") bb--; else if (str[j] === '"' || str[j] === "'") { var qq = str[j++]; while (j < len && str[j] !== qq) { if (str[j] === "\\") j++; j++; } } j++; } i = j; tokens.push({ token: str.slice(start, i), type: "NBT" }); continue; }
        if (ch === "=" || ch === "<" || ch === ">") { if (i + 1 < len && str[i + 1] === "=") i += 2; else i++; tokens.push({ token: str.slice(start, i), type: "Operator" }); continue; }
        while (i < len && str[i] !== " " && str[i] !== "\t" && str[i] !== '"' && str[i] !== "'" && str[i] !== "{" && str[i] !== "[" && str[i] !== "!" && str[i] !== "=" && str[i] !== "<" && str[i] !== ">") i++;
        if (i > start) { var w = str.slice(start, i); tokens.push({ token: w, type: "Word" }); } else i++;
      }
      return tokens;
    }
  };
  function allTilde(coord) { return /^~0?(\.0+)? ~0?(\.0+)? ~0?(\.0+)?$/.test(coord) || /^~~~$/.test(coord.replace(/\s/g, "")); }
  var ExecuteConverter = {
    oldToNew: function (line) {
      var original = line, raw = line.replace(/^\//, "").trim();
      if (!raw) return original;
      if (raw.toLowerCase().indexOf("execute") !== 0) throw new Error("命令必须以 execute 开头");
      var rest = raw.slice("execute".length).trim();
      var tokens = Tokenizer.tokenize(rest);
      if (tokens.length === 0) throw new Error("execute 后缺少参数");
      var t = 0;
      if (tokens[t].type !== "Selector" && ["@p", "@a", "@e", "@s", "@r"].indexOf(tokens[t].token) < 0) throw new Error("缺少选择器");
      var selector = tokens[t].token; t++;
      if (t + 2 >= tokens.length) throw new Error("缺少坐标 x y z");
      var coord = tokens[t].token + " " + tokens[t + 1].token + " " + tokens[t + 2].token; t += 3;
      var parts = ["as " + selector];
      if (allTilde(coord)) parts.push("at @s"); else parts.push("positioned " + coord);
      var detectPart = "";
      if (t < tokens.length && tokens[t].token.toLowerCase() === "detect") {
        t++;
        if (t + 2 >= tokens.length) throw new Error("detect 缺少坐标");
        var detectCoord = tokens[t].token + " " + tokens[t + 1].token + " " + tokens[t + 2].token; t += 3;
        if (t >= tokens.length) throw new Error("detect 缺少方块id");
        var blockId = tokens[t].token; t++;
        var blockData = "-1";
        if (t < tokens.length && /^-?\d+$/.test(tokens[t].token)) { blockData = tokens[t].token; t++; }
        detectPart = (blockData === "-1" || blockData === "*") ? ("if block " + detectCoord + " " + blockId) : ("if block " + detectCoord + " " + blockId + " " + blockData);
      }
      var command = tokens.length > t ? tokens.slice(t).map(function (k) { return k.token; }).join(" ") : "";
      if (detectPart) parts.push(detectPart);
      parts.push("run " + command);
      var result = "execute " + parts.join(" ");
      result = result.replace(/\s+/g, " ").trim();
      return (original.indexOf("/") === 0 ? "/" : "") + result;
    },
    newToOld: function (line) {
      var original = line, raw = line.replace(/^\//, "").trim();
      if (!raw) return original;
      if (raw.toLowerCase().indexOf("execute") !== 0) throw new Error("命令必须以 execute 开头");
      var rest = raw.slice("execute".length).trim();
      var tokens = Tokenizer.tokenize(rest);
      if (tokens.length === 0) throw new Error("execute 后缺少参数");
      var t = 0, selector = "@s", position = "~ ~ ~", detectPart = "", command = "", hasAt = false, isUnless = false;
      while (t < tokens.length) {
        var tok = tokens[t].token.toLowerCase();
        if (tok === "as" && t + 1 < tokens.length) { selector = tokens[t + 1].token; t += 2; }
        else if (tok === "at" && t + 1 < tokens.length) { hasAt = true; t += 2; }
        else if (tok === "positioned" && t + 1 < tokens.length) {
          if (tokens[t + 1].token.toLowerCase() === "as") { t += 2; if (t < tokens.length) selector = tokens[t].token; t++; }
          else { t++; if (t + 2 < tokens.length) { position = tokens[t].token + " " + tokens[t + 1].token + " " + tokens[t + 2].token; t += 3; } }
        }
        else if ((tok === "if" || tok === "unless") && t + 1 < tokens.length && tokens[t + 1].token.toLowerCase() === "block") {
          isUnless = (tok === "unless"); t += 2;
          if (t + 3 < tokens.length) {
            var dc = tokens[t].token + " " + tokens[t + 1].token + " " + tokens[t + 2].token;
            var bid = tokens[t + 3].token; t += 4;
            var bd = "0";
            if (t < tokens.length && /^-?\d+$/.test(tokens[t].token)) { bd = tokens[t].token; t++; }
            detectPart = "detect " + dc + " " + bid + " " + bd;
          }
        }
        else if (tok === "run" && t + 1 < tokens.length) { command = tokens.slice(t + 1).map(function (k) { return k.token; }).join(" "); break; }
        else t++;
      }
      if (!hasAt) position = "~ ~ ~";
      var result = "execute " + selector + " " + position;
      if (detectPart) result += " " + detectPart;
      if (command) result += " " + command;
      result = result.replace(/\s+/g, " ").trim();
      if (isUnless && command.indexOf("@") === 0) { result = result.replace(" !", " "); }
      return (original.indexOf("/") === 0 ? "/" : "") + result;
    },
    convertAll: function (input, direction) {
      var lines = input.split(/\r?\n/), out = [], errors = [], ok = 0;
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (!line.trim()) { out.push(""); continue; }
        try { out.push(direction === "oldToNew" ? this.oldToNew(line) : this.newToOld(line)); ok++; }
        catch (e) { errors.push("第" + (i + 1) + "行: " + e.message); out.push(line); }
      }
      return { result: out.join("\n"), errors: errors, success: ok, total: lines.filter(function (l) { return l.trim(); }).length };
    }
  };
  function showMsg(el, text, isError) {
    el.textContent = text;
    el.classList.add("show");
    setTimeout(function () { el.classList.remove("show"); }, 3000);
  }
  function convertExec(direction) {
    var input = document.getElementById(direction === "oldToNew" ? "oldToNewInput" : "newToOldInput");
    var outDiv = document.getElementById(direction === "oldToNew" ? "newOutput" : "oldOutput");
    var outText = document.getElementById(direction === "oldToNew" ? "newOutputText" : "oldOutputText");
    var errEl = document.getElementById(direction === "oldToNew" ? "newError" : "oldError");
    var okEl = document.getElementById(direction === "oldToNew" ? "newSuccess" : "oldSuccess");
    if (!input.value.trim()) { showMsg(errEl, "请输入要转换的命令", true); return; }
    var r = ExecuteConverter.convertAll(input.value, direction);
    outText.textContent = r.result;
    outDiv.style.display = "block";
    if (r.errors.length) showMsg(errEl, "转换完成，但存在 " + r.errors.length + " 个错误: " + r.errors[0], true);
    else { showMsg(okEl, "转换成功", false); addRecent(r.result); }
  }
  document.getElementById("convertToNewBtn").addEventListener("click", function () { convertExec("oldToNew"); });
  document.getElementById("convertToOldBtn").addEventListener("click", function () { convertExec("newToOld"); });
  document.getElementById("swapExecute").addEventListener("click", function () {
    var a = document.getElementById("oldToNewInput"), b = document.getElementById("newToOldInput");
    var t = a.value; a.value = b.value; b.value = t;
  });

  // ---------- 推荐网站 (favicon 自带) ----------
  var SITES = [
    { sec: "字体与符号", secIco: "", items: [
      { name: "InstaFonts", desc: "花体字体生成", url: "https://instafonts.io/" },
      { name: "特殊字符", desc: "特殊符号与字符工具", url: "https://teshuzifu.cn/" }
    ] },
    { sec: "像素画与地图画", secIco: "", items: [
      { name: "MCPixelArt", desc: "像素画、地图画、投影", url: "https://mcpixelart.com/2d" },
      { name: "Spritecraft", desc: "图片转像素画", url: "https://autosaved.org/spritecraft" },
      { name: "MinecraftArt", desc: "像素画、投影、地图画生成", url: "https://www.minecraftart.net/zh/" },
      { name: "MapartCraft", desc: "地图画 schematic 制作", url: "https://rebane2001.com/mapartcraft/zh-Hans" },
      { name: "mcimg", desc: "投影文件下载", url: "https://www.mcimg.com" }
    ] },
    { sec: "音乐与转换", secIco: "", items: [
      { name: "MidiShow", desc: "MIDI 音乐资源", url: "https://www.midishow.com/" },
      { name: "指令音乐压缩工具", desc: "压缩音乐命令体积", url: "https://backend.appmiaoda.com/projects/supabase298428991113572352/functions/v1/serve_website?name=compress" },
      { name: "Dislink 工具合集", desc: "MIDI转mcpack/mcstructure、mcfunction转换、图片转mcfunction等", url: "https://dislink.github.io" }] },
    { sec: "存档与NBT", secIco: "", items: [
      { name: "Amulet", desc: "存档编辑与转换", url: "https://www.amuletmc.com/" },
      { name: "NBT Studio", desc: "NBT 数据编辑器", url: "https://github.com/tryashtar/nbt-studio/releases" }
    ] },
    { sec: "综合工具", secIco: "", items: [
      { name: "小舟工具箱", desc: "常用指令工具箱", url: "https://tool.lonzov.top" }
    ] },
    { sec: "结构与格式", secIco: "", items: [
      { name: "4D皮肤模型", desc: "4D 皮肤模型生成", url: "https://fangkuaichaoge.github.io/" },
      { name: "Schem To Schematic", desc: "结构格式转换", url: "https://schemtoschematic.app" },
      { name: "MC Schematic", desc: "格式转换与结构工具", url: "https://www.mcschematic.top/" }
    ] }
  ];
  function faviconFor(url) {
    try { var u = new URL(url); return u.protocol + "//" + u.host + "/favicon.ico"; } catch (e) { return ""; }
  }
  function renderSites() {
    var box = document.getElementById("siteList");
    if (!box) return;
    box.innerHTML = SITES.map(function (sec) {
      return '<div class="site-section"><h3>' + (sec.secIco ? '<span class="sec-ico">' + sec.secIco + '</span>' : '') + sec.sec + '</h3><div class="site-grid">' +
        sec.items.map(function (it) {
          var initial = (it.name || "?").charAt(0);
          return '<div class="site-item" data-kw="' + esc(sec.sec + " " + it.name + " " + it.desc) + '" data-url="' + esc(it.url) + '" role="button" tabindex="0">' +
            '<div class="site-head"><span class="site-fav"><img class="site-favimg" src="' + esc(faviconFor(it.url)) + '" alt="" data-initial="' + esc(initial) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\';"><span class="fav-fallback" style="display:none">' + esc(initial) + '</span></span>' +
            '<span class="site-title">' + esc(it.name) + "</span></div>" +
            '<div class="site-desc">' + esc(it.desc) + "</div>" +
            '<div class="site-url">' + esc(it.url.replace(/^https?:\/\//, "")) + "</div>" +
            '<div class="site-actions"><button type="button" class="site-btn open">打开网站</button><button type="button" class="site-btn copy">复制网址</button></div>' +
            "</div>";
        }).join("") + "</div></div>";
    }).join("");
    box.addEventListener("click", function (e) {
      var o = e.target.closest(".site-btn");
      if (!o) return;
      var item = o.closest(".site-item");
      var url = item && item.getAttribute("data-url");
      if (!url) { var link = item.querySelector(".site-url"); }
      if (o.classList.contains("copy")) { copyText(url || ""); }
      else { openExternalBrowser(url || ""); }
    });
    box.querySelectorAll(".site-item").forEach(function (item) {
      item.addEventListener("click", function(){ openExternalBrowser(item.getAttribute("data-url")||""); });
      var u = item.getAttribute("data-url");
      // 将 url 挂到 data-url（渲染时补充）
    });
  }
  // 渲染时给每个 site-item 记录 url（因上面模板未含 data-url，改为模板内补）
  // （嵌套模板已通过 site-url 文本展示，这里改模板直接带 data-url）

  window.openExternalBrowser = function (url) {
    if (!url) return;
    var ok = false;
    try { ok = !!(window.open(url, "_blank", "noopener,noreferrer")); } catch (e) { ok = false; }
    if (!ok) {
      window.location.href = url;
    }
  };
  window.copySiteUrl = function (url) { copyText(url); };

  var searchInput = document.getElementById("siteSearch");
  searchInput.addEventListener("input", function () {
    var q = this.value.trim().toLowerCase();
    document.querySelectorAll("#siteList .site-item").forEach(function (it) {
      var kw = (it.getAttribute("data-kw") || "").toLowerCase();
      it.style.display = (kw.indexOf(q) >= 0 || !q) ? "" : "none";
    });
  });

  renderSites();
  renderRecent();
})();
