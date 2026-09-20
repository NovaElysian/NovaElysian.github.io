document.addEventListener("DOMContentLoaded", () => {
            const e = localStorage.getItem("editor_theme") || "light";
            const t = localStorage.getItem("editor_color") || "#5c6672";
            document.addEventListener("click", e => {
                const t = e.target.closest("[data-open-url]");
                if (t) {
                    e.preventDefault();
                    const i = t.dataset.openUrl;
                    if (window.EditorNative && typeof window.EditorNative.openExternalUrl == "function") {
                        window.EditorNative.openExternalUrl(i);
                    } else {
                        window.open(i, t.dataset.openTarget || "_blank");
                    }
                    return;
                }
                const i = e.target.closest("[data-ui-action]");
                if (!i || !window.App || !window.App.ui) {
                    return;
                }
                e.preventDefault();
                const a = i.dataset.uiAction;
                const n = i.dataset.uiArg;
                const s = window.App.ui;
                switch (a) {
                    case "insert-variable":
                        s.insertVariable(n);
                        break;
                    case "insert-dynamic-block":
                        s.insertDynamicBlock(n);
                        break;
                    case "close-block-editor":
                        s.closeBlockEditor();
                        break;
                    case "paste-dynamic-block-data":
                        s.pasteDynamicBlockData();
                        break;
                    case "copy-dynamic-block":
                        s.copyDynamicBlock();
                        break;
                    case "delete-current-block":
                        s.deleteCurrentBlock();
                        break;
                    case "add-marquee-frame":
                        s.addMarqueeFrame();
                        break;
                    case "add-state-branch":
                        s.addStateBranch();
                        break;
                    case "insert-new-layer":
                        s.insertNewLayer(n);
                        break;
                    case "open-sidebar-editor":
                        if (n) {
                            const e = n.split("|");
                            s.openSidebarEditor(e[0], e[1] || "");
                        }
                        break;
                    case "remove-parent-and-save":
                        i.parentElement.remove();
                        s.saveBlockEditor();
                        break;
                    case "remove-branch-and-save":
                        const e = i.closest(".branch-item");
                        if (e) {
                            e.remove();
                        }
                        s.saveBlockEditor();
                        break;
                    case "copy-state-branch":
                        s.copyStateBranch(i);
                        break;
                    case "close-prop-sheet":
                        s.closePropSheet();
                        break;
                    case "back-to-prop-menu":
                        document.querySelectorAll(".prop-sub-view").forEach(e => e.classList.remove("active"));
                        const t = document.getElementById("prop-main-menu");
                        if (t) {
                            t.classList.remove("hidden");
                            t.classList.remove("two-cols");
                        }
                        break;
                    case "toggle-editor-settings":
                        if (window.App.ui && window.App.ui.toggleEditorSettings) {
                            window.App.ui.toggleEditorSettings();
                        }
                        break;
                    case "open-export-sheet":
                        if (window.App.ui && window.App.ui.openExportSheet) {
                            window.App.ui.openExportSheet();
                        }
                }
            });
            document.addEventListener("input", e => {
                const t = e.target.closest("[data-ui-input]");
                if (t && window.App && window.App.ui) {
                    switch (t.dataset.uiInput) {
                        case "save-block-editor":
                            window.App.ui.saveBlockEditor();
                            break;
                        case "update-preview-test-values":
                            window.App.ui.updatePreviewTestValues();
                            break;
                        case "update-gap-lines":
                            if (window.App.ui.updateGapLines) {
                                window.App.ui.updateGapLines(t.value);
                            }
                    }
                }
            });
            document.addEventListener("change", e => {
                const t = e.target.closest("[data-ui-input]");
                if (t && window.App && window.App.ui && t.dataset.uiInput === "toggle-preview-var") {
                    window.App.ui.togglePreviewVar(t.value, t.checked);
                }
            });
            window.AppHandleNativeBack = function() {
                const e = document.querySelector(".dropdown-menu.active");
                if (e) {
                    e.classList.remove("active");
                    return true;
                }
                const t = document.getElementById("editor-custom-dialog");
                const i = document.getElementById("editor-dialog-overlay");
                if (t && t.classList.contains("active")) {
                    t.classList.remove("active");
                    if (i) {
                        i.classList.remove("active");
                    }
                    return true;
                }
                const a = document.getElementById("custom-dialog");
                const n = document.getElementById("dialog-overlay");
                if (a && a.classList.contains("active")) {
                    a.classList.remove("active");
                    if (n) {
                        n.classList.remove("active");
                    }
                    return true;
                }
                const s = document.getElementById("export-sheet");
                const o = document.getElementById("export-overlay");
                if (s && s.classList.contains("active")) {
                    s.classList.remove("active");
                    if (o) {
                        o.classList.remove("active");
                    }
                    const e = document.getElementById("btn-editor-add");
                    if (e) {
                        e.classList.remove("u-hidden");
                    }
                    return true;
                }
                const c = document.getElementById("editor-add-sheet");
                const r = document.getElementById("editor-add-overlay");
                if (c && c.classList.contains("active")) {
                    c.classList.remove("active");
                    if (r) {
                        r.classList.remove("active");
                    }
                    const e = document.getElementById("btn-editor-add");
                    if (e) {
                        e.classList.remove("u-hidden");
                    }
                    return true;
                }
                const d = document.getElementById("create-sheet");
                const l = document.getElementById("create-overlay");
                if (d && d.classList.contains("active")) {
                    d.classList.remove("active");
                    if (l) {
                        l.classList.remove("active");
                    }
                    return true;
                }
                const p = document.getElementById("sidebar");
                const w = document.getElementById("sidebar-overlay");
                if (p && p.classList.contains("active")) {
                    p.classList.remove("active");
                    if (w) {
                        w.classList.remove("active");
                    }
                    return true;
                }
                if (window.App && window.App.ui) {
                    const e = document.getElementById("prop-view-dynamic-edit");
                    if (e && e.classList.contains("active") && window.App.ui.closeBlockEditor) {
                        window.App.ui.closeBlockEditor();
                        return true;
                    }
                    const t = document.querySelector(".editor-controls");
                    if (t && t.classList.contains("show-props") && window.App.ui.closePropSheet) {
                        window.App.ui.closePropSheet();
                        if (window.App.state && window.App.state.selectedLines) {
                            window.App.state.selectedLines.clear();
                        }
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                        if (window.App.render) {
                            window.App.render.render();
                        }
                        return true;
                    }
                }
                const m = document.getElementById("view-editor");
                if (m && m.classList.contains("active")) {
                    const e = document.getElementById("btn-editor-back");
                    if (e) {
                        e.click();
                    } else {
                        m.classList.remove("active");
                    }
                    return true;
                }
                return false;
            };
            if (e === "dark") {
                document.documentElement.classList.add("dark-theme");
                document.body.classList.add("dark-theme");
                document.querySelector("#theme-toggle .seg-item[data-theme=\"dark\"]").classList.add("active");
                document.querySelector("#theme-toggle .seg-item[data-theme=\"light\"]").classList.remove("active");
            }
            document.documentElement.style.setProperty("--accent-color", t);
            const i = document.querySelectorAll(".color-dot");
            i.forEach(e => {
                e.classList.remove("active");
                if (e.getAttribute("data-color") === t) {
                    e.classList.add("active");
                }
                e.addEventListener("click", () => {
                    i.forEach(e => e.classList.remove("active"));
                    e.classList.add("active");
                    const t = e.getAttribute("data-color");
                    document.documentElement.style.setProperty("--accent-color", t);
                    localStorage.setItem("editor_color", t);
                    const a = document.querySelector(".avatar-item.active");
                    if (a) {
                        a.style.background = t;
                    }
                });
            });
            const a = document.querySelectorAll(".app-tabbar .tab-item:not(.center-add)");
            const n = document.querySelectorAll(".view-section");
            a.forEach(e => {
                e.addEventListener("click", () => {
                    a.forEach(e => e.classList.remove("active"));
                    e.classList.add("active");
                    n.forEach(e => e.classList.remove("active"));
                    const t = e.getAttribute("data-target");
                    const i = document.getElementById(t);
                    if (i) {
                        i.classList.add("active");
                    }
                    if (t === "view-project") {
                        D();
                    }
                });
            });
            const s = document.getElementById("btn-menu");
            const o = document.getElementById("sidebar");
            const c = document.getElementById("sidebar-overlay");
            s.addEventListener("click", function() {
                o.classList.add("active");
                c.classList.add("active");
            });
            c.addEventListener("click", function() {
                o.classList.remove("active");
                c.classList.remove("active");
            });
            const r = document.getElementById("btn-create");
            const d = document.getElementById("create-sheet");
            const l = document.getElementById("create-overlay");
            const p = document.getElementById("btn-close-create");
            const w = document.getElementById("btn-submit-import");
            const m = document.getElementById("import-textarea");

            function u() {
                d.classList.remove("active");
                l.classList.remove("active");
            }
            r.addEventListener("click", function() {
                d.classList.add("active");
                l.classList.add("active");
            });
            p.addEventListener("click", u);
            l.addEventListener("click", u);
            const v = document.querySelectorAll("#create-tabs .seg-item");
            const k = document.querySelectorAll(".create-view");

            function f(e) {
                const t = function(e) {
                    let t = "";
                    let i = false;
                    let a = false;
                    for (let n = 0; n < e.length; n++) {
                        const s = e[n];
                        if (a) {
                            t += s;
                            a = false;
                        } else if (s !== "\\") {
                            if (s !== "\"") {
                                if (i && s === "\n") {
                                    t += "\\n";
                                } else if (!i || s !== "\r") {
                                    t += s;
                                }
                            } else {
                                i = !i;
                                t += s;
                            }
                        } else {
                            t += s;
                            a = true;
                        }
                    }
                    return t;
                }(e.trim());
                return JSON.parse(t);
            }

            function y(e, t) {
                let i = 0;
                let a = false;
                let n = false;
                for (let s = t; s < e.length; s++) {
                    const o = e[s];
                    if (n) {
                        n = false;
                    } else if (o !== "\\") {
                        if (o !== "\"") {
                            if (!a) {
                                if (o === "{") {
                                    i++;
                                } else if (o === "}" && (i--, i === 0)) {
                                    return e.substring(t, s + 1);
                                }
                            }
                        } else {
                            a = !a;
                        }
                    } else {
                        n = true;
                    }
                }
                return null;
            }
            v.forEach(e => {
                e.addEventListener("click", () => {
                    v.forEach(e => e.classList.remove("active"));
                    k.forEach(e => e.style.display = "none");
                    e.classList.add("active");
                    const t = e.getAttribute("data-target");
                    if (t) {
                        document.getElementById(t).style.display = "block";
                    }
                });
            });
            if (w && m) {
                w.addEventListener("click", () => {
                    const e = m.value.trim();
                    if (e) {
                        try {
                            let t = null;
                            try {
                                const i = JSON.parse(e);
                                t = i;
                                if (Array.isArray(i) && i.length > 0) {
                                    t = i[0];
                                }
                            } catch (e) {
                                t = null;
                            }
                            if (t && t.frames && t.name) {
                                t.id = "proj_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
                                t.updatedAt = Date.now();
                                window.App.storage.saveProject(t);
                                alert("项目导入成功！");
                            } else {
                                const t = function(e) {
                                    const t = [];
                                    for (let i = 0; i < e.length; i++) {
                                        if (e[i] === "{") {
                                            const a = y(e, i);
                                            if (a && a.includes("\"rawtext\"")) {
                                                try {
                                                    const e = f(a);
                                                    if (e && Array.isArray(e.rawtext)) {
                                                        t.push(e);
                                                        i += a.length - 1;
                                                    }
                                                } catch (e) {
                                                    console.error("rawtext JSON 解析失败", e);
                                                }
                                            }
                                        }
                                    }
                                    return t;
                                }(e);
                                if (t.length === 0) {
                                    alert("导入失败：未检测到有效的 rawtext JSON 结构。请粘贴完整的 titleraw 指令或 {\"rawtext\":[...]}。");
                                    return;
                                }
                                if (t.length > 1) {
                                    alert("导入失败：检测到多段 rawtext 指令。目前仅支持导入单段指令。");
                                    return;
                                }
                                try {
                                    let {
                                        lines: e,
                                        dynamicBlocks: i
                                    } = function(e) {
                                        let t = [];
                                        let i = "";
                                        let a = 0;
                                        let n = {};

                                        function s() {
                                            if (i !== "") {
                                                t.push({
                                                    type: "text",
                                                    text: i,
                                                    x: 0,
                                                    trackIndex: a++,
                                                    startTick: 0,
                                                    durationTicks: 20
                                                });
                                                i = "";
                                            } else {
                                                t.push({
                                                    type: "gap",
                                                    lines: 1,
                                                    trackIndex: a++,
                                                    startTick: 0,
                                                    durationTicks: 20
                                                });
                                            }
                                        }

                                        function o(e) {
                                            if (e.text !== undefined) {
                                                let t = e.text.split("\n");
                                                for (let e = 0; e < t.length; e++) {
                                                    i += t[e];
                                                    if (e < t.length - 1) {
                                                        s();
                                                    }
                                                }
                                            } else if (e.selector !== undefined) {
                                                i += `{{selector:${e.selector}}}`;
                                            } else if (e.score !== undefined) {
                                                i += `{{score:${e.score.name},${e.score.objective}}}`;
                                            } else if (e.translate !== undefined) {
                                                let {
                                                    selectors: t,
                                                    texts: a
                                                } = function(e) {
                                                    let t = [];
                                                    let i = [];
                                                    (function e(a) {
                                                        if (a.with && a.with.rawtext) {
                                                            for (let n of a.with.rawtext) {
                                                                if (n.selector) {
                                                                    t.push(n.selector);
                                                                } else if (n.text) {
                                                                    i.push(n.text);
                                                                } else if (n.translate) {
                                                                    e(n);
                                                                }
                                                            }
                                                        }
                                                    })(e);
                                                    return {
                                                        selectors: t,
                                                        texts: i
                                                    };
                                                }(e);
                                                if (t.length > 0 && a.length > 0 && t.length === a.length) {
                                                    let e = "blk_" + Math.random().toString(36).substr(2, 9);
                                                    let s = "";
                                                    let o = t[0].match(/scores=\{([^=]+)=/);
                                                    if (o) {
                                                        s = o[1];
                                                    }
                                                    let c = [];
                                                    for (let e = 0; e < t.length; e++) {
                                                        let i = t[e];
                                                        let n = i.match(/\[(.*?)\]/);
                                                        let s = n ? n[1] : "";
                                                        let o = i.replace(/\[.*?\]/, "");
                                                        c.push({
                                                            name: `状态${e + 1}`,
                                                            selector: o,
                                                            condition: s,
                                                            text: a[e]
                                                        });
                                                    }
                                                    n[e] = {
                                                        type: "state",
                                                        scoreName: s,
                                                        branches: c
                                                    };
                                                    i += `{{state:${e}}}`;
                                                } else {
                                                    i += "[复杂积木]";
                                                }
                                            }
                                        }
                                        for (let t of e) {
                                            o(t);
                                        }
                                        for (i !== "" && s(); t.length > 0 && t[t.length - 1].type === "gap";) {
                                            t.pop();
                                        }
                                        return {
                                            lines: t,
                                            dynamicBlocks: n
                                        };
                                    }(t[0].rawtext);
                                    if (!(e.length > 0)) {
                                        alert("导入失败：解析出的图层为空。");
                                        return;
                                    } {
                                        const t = window.App.storage.createNewProject();
                                        t.name = "导入指令 " + new Date().toLocaleTimeString();
                                        t.frames[0].lines = e;
                                        t.dynamicBlocks = i;
                                        window.App.storage.saveProject(t);
                                        alert("指令导入成功，已解析为图层与积木！");
                                    }
                                } catch (e) {
                                    console.error("解析 rawtext 失败", e);
                                    alert("导入失败：解析 rawtext 数据时发生错误。");
                                    return;
                                }
                            }
                            m.value = "";
                            u();
                            D();
                            v[0].click();
                        } catch (e) {
                            console.error("导入失败:", e);
                            alert("导入失败：处理数据时发生错误");
                        }
                    } else {
                        alert("请输入或粘贴内容");
                    }
                });
            }
            document.querySelectorAll(".segmented-control").forEach(e => {
                const t = e.querySelectorAll(".seg-item");
                t.forEach(i => {
                    i.addEventListener("click", () => {
                        t.forEach(e => e.classList.remove("active"));
                        i.classList.add("active");
                        if (e.id === "theme-toggle") {
                            const e = i.getAttribute("data-theme");
                            if (e === "dark") {
                                document.documentElement.classList.add("dark-theme");
                                document.body.classList.add("dark-theme");
                            } else {
                                document.documentElement.classList.remove("dark-theme");
                                document.body.classList.remove("dark-theme");
                            }
                            localStorage.setItem("editor_theme", e);
                        }
                    });
                });
            });
            const g = document.querySelectorAll(".ratio-item");
            g.forEach(e => {
                e.addEventListener("click", () => {
                    g.forEach(e => e.classList.remove("active"));
                    e.classList.add("active");
                });
            });
            const x = document.querySelector(".clear-btn");
            const A = document.getElementById("new-project-name");
            x.addEventListener("click", () => {
                A.value = "";
                A.focus();
            });
            if (window.App && window.App.font) {
                window.App.font.loadWidths();
            }
            const h = document.querySelector(".btn-submit");
            const b = document.getElementById("view-editor");
            const T = document.getElementById("btn-editor-back");
            const L = document.querySelector(".editor-title-input");
            h.addEventListener("click", () => {
                if (window.App && window.App.render) {
                    window.App.render.init();
                }
                if (window.App && window.App.events) {
                    window.App.events.init();
                }
                if (window.App && window.App.timeline) {
                    window.App.timeline.init();
                }
                if (window.App && window.App.ui) {
                    window.App.ui.init();
                }
                u();
                const e = A.value.trim() || "未命名项目";
                const t = window.App.storage.createNewProject();
                t.name = e;
                window.App.storage.saveProject(t);
                window.App.state.currentProjectId = t.id;
                window.App.state.menuLines = t.frames[0].lines.map((e, t) => {
                    if (e.trackIndex === undefined) {
                        e.trackIndex = t;
                    }
                    if (e.startTick === undefined) {
                        e.startTick = 0;
                    }
                    if (e.durationTicks === undefined) {
                        e.durationTicks = 20;
                    }
                    return e;
                });
                window.App.state.bgColor = t.settings.bgColor;
                window.App.state.gridColor = t.settings.gridColor;
                window.App.state.gridSize = t.settings.gridSize;
                window.App.state.panX = t.viewState ? t.viewState.panX : 0;
                window.App.state.panY = t.viewState ? t.viewState.panY : 0;
                window.App.state.scaleFactor = t.viewState ? t.viewState.scaleFactor : 2;
                window.App.state.timelineScale = t.viewState && t.viewState.timelineScale ? t.viewState.timelineScale : 1;
                window.App.state.dynamicBlocks = t.dynamicBlocks ? JSON.parse(JSON.stringify(t.dynamicBlocks)) : {};
                window.App.state.selectedLines.clear();
                window.App.state.history = [];
                window.App.state.redoStack = [];
                window.App.state.markers = new Set();
                if (window.App.ui && window.App.ui.closePropSheet) {
                    window.App.ui.closePropSheet();
                }
                if (window.App.ui && window.App.ui.closeBlockEditor) {
                    window.App.ui.closeBlockEditor();
                }
                L.value = e;
                document.querySelectorAll(".view-section").forEach(e => e.classList.remove("active"));
                D();
                b.classList.add("active");
                if (window.App.timeline) {
                    window.App.timeline.renderTimeline();
                }
                if (window.App.render) {
                    window.App.render.render();
                }
            });
            T.addEventListener("click", () => {
                b.classList.remove("active");
                const e = document.querySelector(".app-tabbar .tab-item.active");
                if (e) {
                    const t = e.getAttribute("data-target");
                    const i = document.getElementById(t);
                    if (i) {
                        i.classList.add("active");
                    }
                }
                X();
                D();
            });
            const E = document.getElementById("btn-editor-add");
            const S = document.getElementById("editor-add-sheet");
            const I = document.getElementById("editor-add-overlay");
            E.addEventListener("click", () => {
                S.classList.add("active");
                I.classList.add("active");
                E.classList.add("u-hidden");
            });
            I.addEventListener("click", () => {
                S.classList.remove("active");
                I.classList.remove("active");
                E.classList.remove("u-hidden");
            });
            let B = false;
            let _ = new Set();
            const P = document.getElementById("batch-action-bar");
            const j = document.getElementById("batch-count-text");
            const q = document.getElementById("dialog-overlay");
            const N = document.getElementById("custom-dialog");
            const $ = document.getElementById("dialog-title");
            const C = document.getElementById("dialog-content");
            let F = false;
            let M = "add";

            function D() {
                if (!window.App.storage) {
                    return;
                }

                const allProjects = window.App.storage.getAllProjects();
                const e = allProjects.filter(p => !p.isSnapshot && (!p.id || !p.id.includes("_snapshot")));

                const t = document.querySelector(".project-list");
                if (t) {
                    t.innerHTML = "";
                    if (e.length !== 0) {
                        e.sort((e, t) => t.updatedAt - e.updatedAt);
                        e.forEach(e => {
                            const i = new Date(e.updatedAt);
                            const a = `${i.getFullYear()}-${String(i.getMonth() + 1).padStart(2, "0")}-${String(i.getDate()).padStart(2, "0")} ${String(i.getHours()).padStart(2, "0")}:${String(i.getMinutes()).padStart(2, "0")}`;

                            const snapshots = allProjects.filter(p => p.parentId === e.id || (p.id && p.id.startsWith(`${e.id}_snapshot_`)));

                            const cardWrapper = document.createElement("div");
                            cardWrapper.className = "project-card-wrapper";
                            cardWrapper.style.cssText = "margin-bottom: 12px; position: relative;";

                            const n = document.createElement("div");
                            let s, o, c;
                            n.className = "project-item";
                            n.dataset.id = e.id;
                            if (_.has(e.id)) {
                                n.classList.add("selected");
                            }

                            n.innerHTML = `
                <div class="thumb checkerboard" style="background-color: ${e.settings.bgColor};">
                    <div class="x-proj-thumb-text">${e.frames && e.frames[0] ? e.frames[0].lines.length : 0} 行</div>
                    <div class="check-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                </div>
                <div class="info u-flex-1" style="display:flex; align-items:center; justify-content:space-between;">
                    <div>
                        <h3 class="x-proj-title">${e.name}</h3>
                        <p>${a}</p>
                    </div>
                </div>
                <div class="action-btns" style="display:flex; align-items:center; gap:4px;">
                    <!-- 展开/收起快照的小箭头 -->
                    <button class="toggle-snapshot-btn" title="查看历史快照 (${snapshots.length})" style="background:none; border:none; color:#64748b; cursor:pointer; padding:8px; display:flex; align-items:center; justify-content:center; transition:transform 0.2s, color 0.2s;">
                        <svg class="arrow-icon" style="transition: transform 0.2s ease;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                    <!-- 删除主项目按钮 -->
                    <button class="delete-proj-btn" title="删除项目" style="background:none; border:none; color:#94a3b8; cursor:pointer; padding:8px; display:flex; align-items:center; justify-content:center; transition:color 0.2s;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
          `;

                            const snapshotContainer = document.createElement("div");
                            snapshotContainer.className = "snapshot-list-container";
                            snapshotContainer.style.cssText = "display: none; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-top: 8px; padding: 12px; position: relative; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);";

                            const renderSnapshots = () => {
                                const currentSnapshots = window.App.storage.getAllProjects()
                                    .filter(p => p.parentId === e.id || (p.id && p.id.startsWith(`${e.id}_snapshot_`)))
                                    .sort((a, b) => b.updatedAt - a.updatedAt);

                                if (currentSnapshots.length === 0) {
                                    snapshotContainer.innerHTML = `
                <div style="position:absolute; top:-6px; right:42px; width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-bottom:6px solid #ffffff;"></div>
                <div style="font-size:0.8rem; color:#64748b; text-align:center; padding:6px 0;">暂无历史快照</div>
              `;
                                    return;
                                }

                                let html = `<div style="position:absolute; top:-6px; right:42px; width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-bottom:6px solid #1e293b;"></div>`;
                                html += `<div style="font-size:0.75rem; color:#94a3b8; margin-bottom:8px; font-weight:600;">历史快照列表 (${currentSnapshots.length})：</div>`;

                                currentSnapshots.forEach(snap => {
                                    const snapDate = new Date(snap.updatedAt);
                                    const snapTimeStr = `${snapDate.getFullYear()}-${String(snapDate.getMonth() + 1).padStart(2, "0")}-${String(snapDate.getDate()).padStart(2, "0")} ${String(snapDate.getHours()).padStart(2, "0")}:${String(snapDate.getMinutes()).padStart(2, "0")}`;

                                    html += `
                   <div class="snapshot-item" data-snap-id="${snap.id}" style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; border: 1px solid #e2e8f0; padding:8px 12px; border-radius:6px; margin-bottom:6px; cursor:pointer; transition:background 0.2s, border-color 0.2s;">
                    <div style="overflow:hidden;">
                      <div style="font-size:0.85rem; color:#0f172a; font-weight:500; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${snap.name}</div>
                      <div style="font-size:0.75rem; color:#64748b;">${snapTimeStr}</div>
                    </div>
                    <button class="delete-snap-btn" data-snap-id="${snap.id}" title="删除快照" style="background:none; border:none; color:#94a3b8; cursor:pointer; padding:4px; display:flex; align-items:center;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
              `;
                                });

                                snapshotContainer.innerHTML = html;

                                snapshotContainer.querySelectorAll('.snapshot-item').forEach(item => {
                                    item.addEventListener('click', (ev) => {
                                        if (ev.target.closest('.delete-snap-btn')) return;
                                        const snapId = item.dataset.snapId;
                                        const targetSnap = window.App.storage.getProject(snapId);
                                        if (targetSnap) {
                                            loadProjectToEditor(targetSnap);
                                        }
                                    });
                                });

                                // 绑定快照删除按钮（自定义 HTML 模态框）
                                snapshotContainer.querySelectorAll('.delete-snap-btn').forEach(btn => {
                                    btn.addEventListener('click', (ev) => {
                                        ev.stopPropagation();
                                        const snapId = btn.dataset.snapId;
                                        const targetSnap = window.App.storage.getProject(snapId);
                                        const snapName = targetSnap ? targetSnap.name : '该快照';

                                        // 创建自定义 HTML 删除确认遮罩层
                                        const modalOverlay = document.createElement('div');
                                        modalOverlay.style.cssText = `
                  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                  background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
                  display: flex; align-items: center; justify-content: center; z-index: 999999;
                  animation: fadeIn 0.2s ease;
                `;

                                        modalOverlay.innerHTML = `
                  <div style="
                    background: #ffffff; border: 1px solid #e2e8f0;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); border-radius: 12px;
                    padding: 20px; width: 300px; color: #0f172a; font-family: inherit;
                    box-sizing: border-box; text-align: center;
                  ">
                    <h3 style="margin: 0 0 8px 0; font-size: 1rem; color: #ef4444; font-weight: 600;">确认删除快照</h3>
                    <p style="margin: 0 0 16px 0; font-size: 0.85rem; color: #64748b; line-height: 1.4;">
                      确定要删除快照 <strong style="color: #0f172a;">“${snapName}”</strong> 吗？此操作无法撤销。
                    </p>
                    <div style="display: flex; gap: 8px;">
                      <button id="snap-cancel-btn" style="
                        flex: 1; background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; padding: 8px 12px;
                        border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.85rem;
                      ">取消</button>
                      <button id="snap-confirm-btn" style="
                        flex: 1; background: #ef4444; border: none;
                        color: #fff; padding: 8px 12px; border-radius: 6px; cursor: pointer;
                        font-weight: 500; font-size: 0.85rem; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
                      ">确认删除</button>
                    </div>
                  </div>
                `;

                                        document.body.appendChild(modalOverlay);

                                        // 绑定取消与背景点击关闭
                                        modalOverlay.querySelector('#snap-cancel-btn').addEventListener('click', () => {
                                            modalOverlay.remove();
                                        });
                                        modalOverlay.addEventListener('click', (e) => {
                                            if (e.target === modalOverlay) modalOverlay.remove();
                                        });

                                        // 绑定确认删除
                                        modalOverlay.querySelector('#snap-confirm-btn').addEventListener('click', () => {
                                            modalOverlay.remove();
                                            window.App.storage.deleteProject(snapId);
                                            renderSnapshots();
                                        });
                                    });
                                });
                            };

                            const toggleBtn = n.querySelector('.toggle-snapshot-btn');
                            const arrowIcon = n.querySelector('.arrow-icon');
                            toggleBtn.addEventListener('click', (event) => {
                                event.stopPropagation();
                                const isExpanded = snapshotContainer.style.display === 'block';
                                if (isExpanded) {
                                    snapshotContainer.style.display = 'none';
                                    arrowIcon.style.transform = 'rotate(0deg)';
                                    toggleBtn.style.color = '#64748b';
                                } else {
                                    renderSnapshots();
                                    snapshotContainer.style.display = 'block';
                                    arrowIcon.style.transform = 'rotate(90deg)';
                                    toggleBtn.style.color = '#38bdf8';
                                }
                            });

                            const deleteBtn = n.querySelector('.delete-proj-btn');
                            deleteBtn.addEventListener('click', (event) => {
                                event.stopPropagation();
                                const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                                let randomCode = '';
                                for (let i = 0; i < 4; i++) {
                                    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
                                }

                                const modalOverlay = document.createElement('div');
                                modalOverlay.style.cssText = `
              position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
              background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px);
              display: flex; align-items: center; justify-content: center; z-index: 999999;
              animation: fadeIn 0.2s ease;
            `;

                                modalOverlay.innerHTML = `
              <div style="
                background: #1e293b; border: 1px solid rgba(59, 130, 246, 0.4);
                box-shadow: 0 0 30px rgba(59, 130, 246, 0.25); border-radius: 12px;
                padding: 24px; width: 320px; color: #f8fafc; font-family: inherit;
                box-sizing: border-box; text-align: center;
              ">
                <h3 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #60a5fa;">安全删除确认</h3>
                <p style="margin: 0 0 16px 0; font-size: 0.85rem; color: #94a3b8; line-height: 1.4;">
                  您正在尝试删除项目 <strong style="color: #f1f5f9;">“${e.name}”</strong>。<br>请输入下方 4 位验证码以确认：
                </p>
                <div style="
                  background: #0f172a; border: 1px dashed #3b82f6; border-radius: 6px;
                  font-size: 1.4rem; font-weight: bold; letter-spacing: 6px; color: #38bdf8;
                  padding: 8px; margin-bottom: 16px; user-select: none;
                ">${randomCode}</div>
                <input type="text" id="verify-code-input" placeholder="输入上方4位字符" autocomplete="off" style="
                  width: 100%; box-sizing: border-box; background: #0f172a; border: 1px solid #334155;
                  border-radius: 6px; padding: 10px; color: #fff; text-align: center; font-size: 1rem;
                  letter-spacing: 2px; outline: none; margin-bottom: 16px;
                ">
                <div style="display: flex; gap: 10px;">
                  <button id="modal-cancel-btn" style="
                    flex: 1; background: #334155; border: none; color: #cbd5e1; padding: 10px;
                    border-radius: 6px; cursor: pointer; font-weight: 600;
                  ">取消</button>
                  <button id="modal-confirm-btn" disabled style="
                    flex: 1; background: linear-gradient(135deg, #3b82f6, #2563eb); border: none;
                    color: #fff; padding: 10px; border-radius: 6px; cursor: not-allowed; opacity: 0.5;
                    font-weight: 600; box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
                  ">确认删除</button>
                </div>
              </div>
            `;

                                document.body.appendChild(modalOverlay);

                                const inputEl = modalOverlay.querySelector('#verify-code-input');
                                const confirmBtn = modalOverlay.querySelector('#modal-confirm-btn');
                                const cancelBtn = modalOverlay.querySelector('#modal-cancel-btn');

                                inputEl.focus();

                                inputEl.addEventListener('input', (ev) => {
                                    if (ev.target.value.trim().toUpperCase() === randomCode) {
                                        confirmBtn.disabled = false;
                                        confirmBtn.style.cursor = 'pointer';
                                        confirmBtn.style.opacity = '1';
                                    } else {
                                        confirmBtn.disabled = true;
                                        confirmBtn.style.cursor = 'not-allowed';
                                        confirmBtn.style.opacity = '0.5';
                                    }
                                });

                                cancelBtn.addEventListener('click', () => {
                                    modalOverlay.remove();
                                });

                                confirmBtn.addEventListener('click', () => {
                                    if (inputEl.value.trim().toUpperCase() === randomCode) {
                                        modalOverlay.remove();

                                        if (window.App.storage) {
                                            window.App.storage.deleteProject(e.id);
                                            snapshots.forEach(s => window.App.storage.deleteProject(s.id));
                                        }
                                        D();
                                    }
                                });
                            });

                            let r = false;
                            n.addEventListener("touchstart", t => {
                                o = t.touches[0].clientX;
                                c = t.touches[0].clientY;
                                r = false;
                                if (!B) {
                                    s = setTimeout(() => {
                                        B = true;
                                        r = true;
                                        _.add(e.id);
                                        P.classList.add("active");
                                        D();
                                    }, 500);
                                }
                            });
                            n.addEventListener("touchend", () => clearTimeout(s));
                            n.addEventListener("touchmove", e => {
                                if (!s) return;
                                const t = e.touches[0].clientX - o;
                                const i = e.touches[0].clientY - c;
                                if (Math.hypot(t, i) > 10) clearTimeout(s);
                            });

                            n.addEventListener("click", () => {
                                if (r) {
                                    r = false;
                                } else if (B) {
                                    if (_.has(e.id)) {
                                        _.delete(e.id);
                                        if (_.size === 0) Y();
                                        else J();
                                    } else {
                                        _.add(e.id);
                                        J();
                                    }
                                } else {
                                    const t = window.App.storage.getProject(e.id);
                                    if (!t) return;

                                    try {
                                        const allRaw = window.App.storage.getAllProjects();
                                        const existingSnapshots = allRaw.filter(p => p.parentId === t.id || (p.id && p.id.startsWith(`${t.id}_snapshot_`)));
                                        const nextIndex = existingSnapshots.length + 1;

                                        const snapshotProj = JSON.parse(JSON.stringify(t));
                                        snapshotProj.parentId = t.id;
                                        snapshotProj.id = `${t.id}_snapshot_${nextIndex}_${Date.now()}`;
                                        snapshotProj.isSnapshot = true;
                                        snapshotProj.snapshotIndex = nextIndex;
                                        snapshotProj.name = `${t.name}_快照#${nextIndex}`;
                                        snapshotProj.updatedAt = Date.now();

                                        window.App.storage.saveProject(snapshotProj);
                                    } catch (err) {
                                        console.error("[快照系统] 生成快照失败:", err);
                                    }

                                    loadProjectToEditor(t);
                                }
                            });

                            cardWrapper.appendChild(n);
                            cardWrapper.appendChild(snapshotContainer);
                            t.appendChild(cardWrapper);
                        });
                    } else {
                        t.innerHTML = "<div class=\"x-applied-empty\" style=\"padding: 40px;\">还没有项目，点击下方 + 号创建一个吧</div>";
                    }
                }
            }

            function loadProjectToEditor(t) {
                window.App.state.currentProjectId = t.id;
                window.App.state.menuLines = t.frames[0].lines.map((e, t) => {
                    if (e.trackIndex === undefined) e.trackIndex = t;
                    if (e.startTick === undefined) e.startTick = 0;
                    if (e.durationTicks === undefined) e.durationTicks = 20;
                    return e;
                });
                window.App.state.bgColor = t.settings.bgColor;
                window.App.state.gridColor = t.settings.gridColor;
                window.App.state.gridSize = t.settings.gridSize;
                window.App.state.panX = t.viewState ? t.viewState.panX : 0;
                window.App.state.panY = t.viewState ? t.viewState.panY : 0;
                window.App.state.scaleFactor = t.viewState ? t.viewState.scaleFactor : 2;
                window.App.state.timelineScale = t.viewState && t.viewState.timelineScale ? t.viewState.timelineScale : 1;
                window.App.state.dynamicBlocks = t.dynamicBlocks ? JSON.parse(JSON.stringify(t.dynamicBlocks)) : {};
                window.App.state.selectedLines.clear();
                window.App.state.history = [];
                window.App.state.redoStack = [];
                window.App.state.markers = new Set();

                if (window.App.ui && window.App.ui.closePropSheet) window.App.ui.closePropSheet();
                if (window.App.ui && window.App.ui.closeBlockEditor) window.App.ui.closeBlockEditor();

                if (typeof L !== 'undefined' && L.value !== undefined) L.value = t.name;

                document.querySelectorAll(".view-section").forEach(e => e.classList.remove("active"));
                if (typeof b !== 'undefined') b.classList.add("active");

                if (window.App.render) window.App.render.init();
                if (window.App.timeline) window.App.timeline.init();
                if (window.App.ui) window.App.ui.init();
                if (window.App.events) window.App.events.init();
                if (window.App.timeline) window.App.timeline.renderTimeline();
                if (window.App.render) window.App.render.render();
            }

            const O = document.querySelector(".project-list");

            function J() {
                j.textContent = `已选择 ${_.size} 个项目`;
                const e = document.querySelector(".project-list");
                if (e) {
                    e.querySelectorAll(".project-item").forEach(e => {
                        const t = e.dataset.id;
                        if (_.has(t)) {
                            e.classList.add("selected");
                        } else {
                            e.classList.remove("selected");
                        }
                    });
                }
            }

            function Y() {
                B = false;
                _.clear();
                P.classList.remove("active");
                D();
            }

            function z(e, t) {
                const i = document.getElementById(e);
                if (i) {
                    i.addEventListener("click", t);
                }
            }

            function X() {
                if (!window.App.state.currentProjectId) {
                    return;
                }
                const e = window.App.storage.getProject(window.App.state.currentProjectId);
                if (e) {
                    e.name = L.value;
                    e.frames[0].lines = window.App.state.menuLines;
                    e.settings.bgColor = window.App.state.bgColor;
                    e.settings.gridColor = window.App.state.gridColor;
                    e.settings.gridSize = window.App.state.gridSize;
                    e.viewState = {
                        panX: window.App.state.panX,
                        panY: window.App.state.panY,
                        scaleFactor: window.App.state.scaleFactor,
                        timelineScale: window.App.state.timelineScale || 1
                    };
                    e.dynamicBlocks = window.App.state.dynamicBlocks ? JSON.parse(JSON.stringify(window.App.state.dynamicBlocks)) : {};
                    window.App.storage.saveProject(e);
                }
            }

            function H(e) {
                const t = window.App.storage.getProject(e);
                if (!t) {
                    return;
                }
                window.App.state.currentProjectId = t.id;
                window.App.state.menuLines = t.frames[0].lines.map((e, t) => {
                    if (e.trackIndex === undefined) {
                        e.trackIndex = t;
                    }
                    if (e.startTick === undefined) {
                        e.startTick = 0;
                    }
                    if (e.durationTicks === undefined) {
                        e.durationTicks = 20;
                    }
                    return e;
                });
                window.App.state.bgColor = t.settings.bgColor;
                window.App.state.gridColor = t.settings.gridColor;
                window.App.state.gridSize = t.settings.gridSize;
                window.App.state.panX = t.viewState ? t.viewState.panX : 0;
                window.App.state.panY = t.viewState ? t.viewState.panY : 0;
                window.App.state.scaleFactor = t.viewState ? t.viewState.scaleFactor : 2;
                window.App.state.timelineScale = t.viewState && t.viewState.timelineScale ? t.viewState.timelineScale : 1;
                window.App.state.dynamicBlocks = t.dynamicBlocks ? JSON.parse(JSON.stringify(t.dynamicBlocks)) : {};
                window.App.state.selectedLines.clear();
                window.App.state.history = [];
                window.App.state.redoStack = [];
                window.App.state.markers = new Set();
                if (window.App.ui && window.App.ui.closePropSheet) {
                    window.App.ui.closePropSheet();
                }
                if (window.App.ui && window.App.ui.closeBlockEditor) {
                    window.App.ui.closeBlockEditor();
                }
                const i = document.querySelector(".editor-title-input");
                if (i) {
                    i.value = t.name;
                }
                document.querySelectorAll(".view-section").forEach(e => e.classList.remove("active"));
                const a = document.getElementById("view-editor");
                if (a) {
                    a.classList.add("active");
                }
                D();
                if (window.App.render) {
                    window.App.render.init();
                }
                if (window.App.timeline) {
                    window.App.timeline.init();
                }
                if (window.App.ui) {
                    window.App.ui.init();
                }
                if (window.App.events) {
                    window.App.events.init();
                }
                if (window.App.timeline) {
                    window.App.timeline.renderTimeline();
                }
                if (window.App.render) {
                    window.App.render.render();
                }
                const n = document.getElementById("toast");
                if (n) {
                    n.textContent = "模板加载成功！";
                    n.style.display = "block";
                    setTimeout(() => n.style.opacity = "1", 10);
                    setTimeout(() => {
                        n.style.opacity = "0";
                        setTimeout(() => n.style.display = "none", 300);
                    }, 2000);
                }
            }
            if (O) {
                O.addEventListener("touchstart", e => {
                    if (!B) {
                        return;
                    }
                    const t = e.target.closest(".thumb");
                    if (t) {
                        F = true;
                        const e = t.closest(".project-item");
                        if (e) {
                            const t = e.dataset.id;
                            if (_.has(t)) {
                                M = "remove";
                                _.delete(t);
                            } else {
                                M = "add";
                                _.add(t);
                            }
                            J();
                        }
                    }
                }, {
                    passive: false
                });
                O.addEventListener("touchmove", e => {
                    if (F) {
                        e.preventDefault();
                        const t = e.touches[0];
                        const i = document.elementFromPoint(t.clientX, t.clientY);
                        if (i) {
                            const e = i.closest(".project-item");
                            if (e) {
                                const t = e.dataset.id;
                                if (M !== "add" || _.has(t)) {
                                    if (M === "remove" && _.has(t)) {
                                        _.delete(t);
                                        J();
                                    }
                                } else {
                                    _.add(t);
                                    J();
                                }
                            }
                        }
                    }
                }, {
                    passive: false
                });
                O.addEventListener("touchend", () => {
                    F = false;
                });
                O.addEventListener("touchcancel", () => {
                    F = false;
                });
            }
            z("btn-close-batch", Y);
            z("btn-batch-select-all", () => {
                const e = window.App.storage.getAllProjects();
                if (_.size === e.length) {
                    _.clear();
                    Y();
                } else {
                    e.forEach(e => _.add(e.id));
                    J();
                }
            });
            z("btn-batch-delete", () => {
                if (_.size === 0) {
                    return;
                }
                $.textContent = `删除 ${_.size} 个项目`;
                let e = "";
                window.App.storage.getAllProjects().forEach(t => {
                    if (_.has(t.id)) {
                        e += `<div>${t.name}</div>`;
                    }
                });
                C.innerHTML = e;
                q.classList.add("active");
                N.classList.add("active");
            });
            z("btn-dialog-cancel", () => {
                q.classList.remove("active");
                N.classList.remove("active");
            });
            z("btn-dialog-confirm", () => {
                _.forEach(e => {
                    window.App.storage.deleteProject(e);
                });
                q.classList.remove("active");
                N.classList.remove("active");
                Y();
            });
            z("btn-batch-copy", () => {
                _.forEach(e => {
                    const t = window.App.storage.getProject(e);
                    if (t) {
                        const e = window.App.storage.createNewProject();
                        e.name = t.name + " - 副本";
                        e.frames = JSON.parse(JSON.stringify(t.frames));
                        e.settings = JSON.parse(JSON.stringify(t.settings));
                        window.App.storage.saveProject(e);
                    }
                });
                Y();
            });
            z("btn-batch-share", () => {
                alert("分享功能开发中...");
            });
            window.App.saveCurrentProject = X;
            setTimeout(D, 100);
            setTimeout(function() {
                    const e = document.getElementById("templates-grid");
                    if (e) {
                        e.innerHTML = "";
                        [{
                            id: "washoku",
                            name: "竖列菜单",
                            desc: "包含状态机交互",
                            bg: "#2c3e30",
                            preview: "§iＷａｓｈｏｋｕ\u3000Ｍｅｎｕ\n§f装§i  宝§7  天  护  药  个\n§f备§i  石§7  赋  符  物  人"
                        }, {
                            id: "marquee_menu",
                            name: "通用菜单",
                            desc: "包含跑马灯与状态机交互",
                            bg: "#1c1f23",
                            preview: "§b✿§f通用 菜单§b✿\n§b◁｛§f§l Ｓｎｏｗｂａｌｌ Ｍｅｎｕ§r§b ｝▷\n§b◇---§s----§3----§9--§b--§9--§3----§s----§b---◇"
                        }, {
                            id: "loading",
                            name: "开机动画",
                            desc: "包含 17 帧状态机动画",
                            bg: "#2b1c2c",
                            preview: "§7『§d通用菜单§7』 Ｌｏａｄｉｎｇ 。。。"
                        }, {
                            id: "shutdown",
                            name: "关机动画",
                            desc: "包含 18 帧状态机动画",
                            bg: "#3a1c1c",
                            preview: "§7『§c通用菜单§7』 Ｓｈｕｔｄｏｗｎ 。。。"
                        }, {
                            id: "load_anim",
                            name: "载入动画",
                            desc: "包含 9 帧滑入载入动画",
                            bg: "#1c2b3a",
                            preview: "§7『§d通用菜单§7』 Ｌｏａｄｉｎｇ 。。。"
                        }].forEach(t => {
                                const i = document.createElement("div");
                                i.className = "element-card";
                                i.innerHTML = `<div class="thumb" style="background: ${t.bg}; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;"><div style="color:#fff;font-family:monospace;font-size:10px;white-space:pre;text-align:center;line-height:1.2;transform:scale(0.8);">${(function (e) { var out = "", col = "#FFFFFF", bold = false, k = 0; while (k < e.length) { if (e[k] === "\u00a7" && k + 1 < e.length) { var c = e[k + 1].toLowerCase(); if (window.App && window.App.font && window.App.font.colorMap && window.App.font.colorMap[c]) { col = window.App.font.colorMap[c]; bold = false; } else if (c === "l") bold = true; else if (c === "r") { col = "#FFFFFF"; bold = false; } k += 2; } else { var ch = e[k]; if (ch === "\n") out += "<br>"; else if (ch === " ") out += "&nbsp;"; else out += '<span style="color:' + col + ';' + (bold ? "font-weight:bold;" : "") + '">' + ch + "</span>"; k++; } } return out; })(t.preview)}</div></div><div class="info"><h3>${t.name}</h3><p>${t.desc}</p></div>`;
        i.addEventListener("click", () => {
          (function (e) {
            if (e === "washoku") {
              const e = window.App.storage.createNewProject();
              e.name = "竖列菜单";
              e.varDefs = [{
                id: "var_1",
                name: "装备界面",
                selector: "@s[scores={菜单=..1}]"
              }, {
                id: "var_2",
                name: "宝石界面",
                selector: "@s[scores={菜单=..2}]"
              }, {
                id: "var_3",
                name: "天赋界面",
                selector: "@s[scores={菜单=..3}]"
              }, {
                id: "var_4",
                name: "护符界面",
                selector: "@s[scores={菜单=..4}]"
              }, {
                id: "var_5",
                name: "药物界面",
                selector: "@s[scores={菜单=..5}]"
              }, {
                id: "var_6",
                name: "个人界面",
                selector: "@s[scores={菜单=..6}]"
              }];
              const t = [["    §f装§i      宝§7      天      护      药      个", "    §i装§f      宝§i      §7天      护      药      个", "    §7装§i      宝§f      天§i      护§7      药      个", "    §7装      宝§i      天§f      护§i      药§7      个", "    §7装      宝      天§i      护§f      药§i      个", "    §7装      宝      天§       护§i      药§q      个"], ["    §f备§i      石§7      赋      符      物      人", "    §i备§f      石§i      赋§7      符      物      人", "    §7备§i      石§f      赋§i      符§7      物      人", "    §7备      石§i      赋§f      符§i      物§7      人", "    §7备      石      赋§i      符§f      物§i      人", "    §7备      石      赋      符§i      物§q      人"], ["    §f界§i      界§7      界      界      界      界", "    §i界§f      界§i      界§7      界      界      界", "    §7界§i      界§f      界§i      界§7      界      界", "    §7界      界§i      界§f      界§i      界§7      界", "    §7界      界      界§i      界§f      界§i      界", "    §7界      界      界      界§i      界§q      界"], ["    §f面§i      面§7      面      面      面      面", "    §i面§f      面§i      面§7      面      面      面", "    §7面§i      面§f      面§i      面§7      面      面", "    §7面      面§i      面§f      面§i      面§7      面", "    §7面      面      面§i      面§f      面§i      面", "    §7面      面      面      面      §i面§q      面"], ["    §q▃§i      ▃      §7▃     ▃      ▃      ▃", "    §i▃    §q  ▃      §i▃§l     §r§7▃      ▃      ▃", "    §7▃§i      ▃§2      ▃§i     ▃§7      ▃      ▃", "    §7▃      ▃§i      ▃§q     ▃§i      ▃§7      ▃", "    §7▃      ▃      ▃§i     ▃§q      ▃§i      ▃", "    §7▃      ▃      ▃§i     ▃      §i▃§q      ▃"]];
              e.dynamicBlocks = {};
              t.forEach((t, i) => {
                e.dynamicBlocks[`
        state_washoku_row_${
            i + 1
        }
        `] = {
                  type: "state",
                  scoreName: "菜单",
                  selectorMode: "scoreThreshold",
                  translateKey: "%%9",
                  branches: t.map((t, i) => {
                    const a = e.varDefs[i];
                    return {
                      name: a ? a.name : `
        状态${
            i + 1
        }
        `,
                      condition: a ? a.selector.replace(/^@s\[(.*)\]$/, "$1") : `
        scores = {
            菜单 = ..${
                i + 1
            }
        }
        `,
                      text: t
                    };
                  })
                };
              });
              e.frames = [{
                id: "frame_1",
                lines: [{
                  type: "gap",
                  lines: 1,
                  trackIndex: 0,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "                 §iＷａｓｈｏｋｕ\u3000Ｍｅｎｕ   ",
                  x: 0,
                  trackIndex: 1,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "§i",
                  x: 0,
                  trackIndex: 2,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "gap",
                  lines: 1,
                  trackIndex: 3,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_washoku_row_1}}",
                  x: 0,
                  trackIndex: 4,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_washoku_row_2}}",
                  x: 0,
                  trackIndex: 5,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_washoku_row_3}}",
                  x: 0,
                  trackIndex: 6,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_washoku_row_4}}",
                  x: 0,
                  trackIndex: 7,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_washoku_row_5}}",
                  x: 0,
                  trackIndex: 8,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "gap",
                  lines: 2,
                  trackIndex: 9,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "          §c┃§7低头关机             §a┃§7抬头确定",
                  x: 0,
                  trackIndex: 10,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "gap",
                  lines: 3,
                  trackIndex: 11,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "                                                   ",
                  x: 0,
                  trackIndex: 12,
                  startTick: 0,
                  durationTicks: 20
                }]
              }];
              window.App.storage.saveProject(e);
              H(e.id);
            } else if (e === "marquee_menu") {
              const e = window.App.storage.createNewProject();
              e.name = "通用菜单";
              e.varDefs = [{
                id: "var_0",
                name: "全灰状态",
                selector: "@s[scores={菜单=..26}]"
              }, {
                id: "var_1",
                name: "多维传送",
                selector: "@s[scores={菜单=..27}]"
              }, {
                id: "var_2",
                name: "玩家互传",
                selector: "@s[scores={菜单=..28}]"
              }, {
                id: "var_3",
                name: "数控转账",
                selector: "@s[scores={菜单=..29}]"
              }, {
                id: "var_4",
                name: "音乐选项",
                selector: "@s[scores={菜单=..30}]"
              }, {
                id: "var_5",
                name: "原地飞升",
                selector: "@s[scores={菜单=..31}]"
              }, {
                id: "var_6",
                name: "个人信息",
                selector: "@s[scores={菜单=..32}]"
              }];
              e.dynamicBlocks = {
                rainbow_border_1: {
                  type: "marquee",
                  scoreName: "彩色字",
                  ticksPerFrame: 5,
                  frames: [" §b◇---§s----§3----§9--§b--§9--§3----§s----§b---◇ ", " §s◇---§3----§9----§b--§s--§b--§9----§3----§s---◇ ", " §3◇---§9----§b----§s--§3--§s--§b----§9----§3---◇ ", " §9◇---§b----§s----§3--§9--§3--§s----§b----§9---◇ "]
                },
                rainbow_border_2: {
                  type: "marquee",
                  scoreName: "彩色字",
                  ticksPerFrame: 5,
                  frames: [" §b◇---§s----§3----§9--§b--§9--§3----§s----§b---◇ ", " §s◇---§3----§9----§b--§s--§b--§9----§3----§s---◇ ", " §3◇---§9----§b----§s--§3--§s--§b----§9----§3---◇ ", " §9◇---§b----§s----§3--§9--§3--§s----§b----§9---◇ "]
                }
              };
              [["  §7┃ 多维传送 §r", "  §9┃ §f多维传送 〉>  §f一〈§bｗｏｒｌｄ§f〉一§r ", "  §7┃ 多维传送 §r", "  §7┃ 多维传送 §r", "  §7┃ 多维传送 §r", "  §7┃ 多维传送 §r", "  §7┃ 多维传送 §r"], [" §7 ┃ §7玩家互传 ", " §7 ┃ §7玩家互传 ", "§7  §9┃ §f玩家互传 〉>  §f一〈§bｅｏｔｐ§f〉一§r ", " §7 ┃ §7玩家互传 ", " §7 ┃ §7玩家互传 ", " §7 ┃ §7玩家互传 ", " §7 ┃ §7玩家互传 "], [" §7 ┃ §7数控转账 ", " §7 ┃ §7数控转账 ", " §7 ┃ §7数控转账 ", "  §9┃ §f数控转账 〉>  §f一〈§bｐａｙ§f〉一§r ", " §7 ┃ §7数控转账 ", " §7 ┃ §7数控转账 ", " §7 ┃ §7数控转账 "], [" §7 ┃ §7音乐选项", " §7 ┃ §7音乐选项", " §7 ┃ §7音乐选项", " §7 ┃ §7音乐选项", "  §9┃ §f音乐选项 §f 〉>  §f一〈§bｍｕｓｉｃ§f〉一§r ", " §7 ┃ §7音乐选项", " §7 ┃ §7音乐选项"], [" §7 ┃ §7原地飞升", " §7 ┃ §7原地飞升", " §7 ┃ §7原地飞升", " §7 ┃ §7原地飞升", " §7 ┃ §7原地飞升", "  §9┃ §f原地飞升 〉>  §f一〈§bｓｕｉｃｉｄｅ§f〉一§r ", " §7 ┃ §7原地飞升"], ["  §7┃ §7个人信息", "  §7┃ §7个人信息", "  §7┃ §7个人信息", "  §7┃ §7个人信息", " §7 ┃ §7个人信息", " §7 ┃ §7个人信息", "  §9┃ §f个人信息 〉>  §f一〈§bｄａｔａ§f〉一§r"]].forEach((t, i) => {
                e.dynamicBlocks[`
        state_marquee_row_${
            i + 1
        }
        `] = {
                  type: "state",
                  scoreName: "菜单",
                  selectorMode: "scoreThreshold",
                  translateKey: "%%8",
                  branches: t.map((t, i) => {
                    const a = e.varDefs[i];
                    return {
                      name: a ? a.name : `
        状态${
            i
        }
        `,
                      condition: a ? a.selector.replace(/^@s\[(.*)\]$/, "$1") : `
        scores = {
            菜单 = ..${
                i + 26
            }
        }
        `,
                      text: t
                    };
                  })
                };
              });
              e.frames = [{
                id: "frame_1",
                lines: [{
                  type: "text",
                  text: "         §b✿§f通用 菜单§b✿",
                  x: 0,
                  trackIndex: 0,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "    §b◁｛§f§l Ｓｎｏｗｂａｌｌ Ｍｅｎｕ§r§b ｝▷",
                  x: 0,
                  trackIndex: 1,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "",
                  x: 0,
                  trackIndex: 2,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{marquee:rainbow_border_1}}",
                  x: 0,
                  trackIndex: 3,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "",
                  x: 0,
                  trackIndex: 4,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_marquee_row_1}}",
                  x: 0,
                  trackIndex: 5,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_marquee_row_2}}",
                  x: 0,
                  trackIndex: 6,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_marquee_row_3}}",
                  x: 0,
                  trackIndex: 7,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_marquee_row_4}}",
                  x: 0,
                  trackIndex: 8,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_marquee_row_5}}",
                  x: 0,
                  trackIndex: 9,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{state:state_marquee_row_6}}",
                  x: 0,
                  trackIndex: 10,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "",
                  x: 0,
                  trackIndex: 11,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "{{marquee:rainbow_border_2}}",
                  x: 0,
                  trackIndex: 12,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "§7  抬头确认    §f━●━§7    低头关机",
                  x: 0,
                  trackIndex: 13,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "gap",
                  lines: 5,
                  trackIndex: 14,
                  startTick: 0,
                  durationTicks: 20
                }, {
                  type: "text",
                  text: "                    ",
                  x: 0,
                  trackIndex: 15,
                  startTick: 0,
                  durationTicks: 20
                }]
              }];
              window.App.storage.saveProject(e);
              H(e.id);
            } else if (e === "loading") {
              const e = window.App.storage.createNewProject();
              e.name = "开机动画";
              const t = ["§7『§f▏", "§7『§d通§f▏", "§7『§d通用§f▏", "§7『§d通用菜§f▏", "§7『§d通用菜单§f▏", "§7『§d通用菜单§7』§f▏", "§7『§d通用菜单§7』 §f▏", "§7『§d通用菜单§7』 Ｌ§f▏", "§7『§d通用菜单§7』 Ｌｏ§f▏", "§7『§d通用菜单§7』 Ｌｏａ§f▏", "§7『§d通用菜单§7』 Ｌｏａｄ§f▏", "§7『§d通用菜单§7』 Ｌｏａｄｉ§f▏", "§7『§d通用菜单§7』 Ｌｏａｄｉｎ§f▏", "§7『§d通用菜单§7』 Ｌｏａｄｉｎｇ", "§7『§d通用菜单§7』 Ｌｏａｄｉｎｇ 。§f▏", "§7『§d通用菜单§7』 Ｌｏａｄｉｎｇ 。。§f▏", "§7『§d通用菜单§7』 Ｌｏａｄｉｎｇ 。。。"].map((e, t) => ({
                type: "text",
                text: e,
                x: 0,
                trackIndex: 0,
                startTick: t * 2,
                durationTicks: 2
              }));
              e.frames = [{
                id: "frame_1",
                lines: t
              }];
              window.App.storage.saveProject(e);
              H(e.id);
            } else if (e === "shutdown") {
              const e = window.App.storage.createNewProject();
              e.name = "关机动画";
              const t = ["§7『§f▏", "§7『§c通§f▏", "§7『§c通用§f▏", "§7『§c通用菜§f▏", "§7『§c通用菜单§f▏", "§7『§c通用菜单§7』§f▏", "§7『§c通用菜单§7』 §f▏", "§7『§c通用菜单§7』 Ｓ§f▏", "§7『§c通用菜单§7』 Ｓｈ§f▏", "§7『§c通用菜单§7』 Ｓｈｕ§f▏", "§7『§c通用菜单§7』 Ｓｈｕｔ§f▏", "§7『§c通用菜单§7』 Ｓｈｕｔｄ§f▏", "§7『§c通用菜单§7』 Ｓｈｕｔｄｏ§f▏", "§7『§c通用菜单§7』 Ｓｈｕｔｄｏｗ", "§7『§c通用菜单§7』 Ｓｈｕｔｄｏｗｎ 。§f▏", "§7『§c通用菜单§7』 Ｓｈｕｔｄｏｗｎ 。。§f▏", "§7『§c通用菜单§7』 Ｓｈｕｔｄｏｗｎ 。。。", "§c已关闭"].map((e, t) => ({
                type: "text",
                text: e,
                x: 0,
                trackIndex: 0,
                startTick: t * 2,
                durationTicks: 2
              }));
              e.frames = [{
                id: "frame_1",
                lines: t
              }];
              window.App.storage.saveProject(e);
              H(e.id);
            } else if (e === "load_anim") {
              const e = window.App.storage.createNewProject();
              e.name = "载入动画";
              e.dynamicBlocks = {
                rainbow_border: {
                  type: "marquee",
                  scoreName: "color_tick",
                  ticksPerFrame: 5,
                  frames: [" §b◇---§s----§3----§9--§b--§9--§3----§s----§b---◇ ", " §s◇---§3----§9----§b--§s--§b--§9----§3----§s---◇ ", " §3◇---§9----§b----§s--§3--§s--§b----§9----§3---◇ ", " §9◇---§b----§s----§3--§9--§3--§s----§b----§9---◇ "]
                }
              };
              const t = [19, 18, 16, 13, 10, 7, 6, 4, 2];
              const i = 20;
              const a = t.map((e, a) => ({
                type: "gap",
                lines: e,
                trackIndex: 0,
                startTick: a * 2,
                durationTicks: a === t.length - 1 ? i - a * 2 : 2
              }));
              e.frames = [{
                id: "frame_1",
                lines: [...a, {
                  type: "text",
                  text: "         §b✿§f通用 出品§b✿",
                  x: 0,
                  trackIndex: 1,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: "    §b◁｛§f§l Ｓｎｏｗｂａｌｌ Ｍｅｎｕ§r§b ｝▷",
                  x: 0,
                  trackIndex: 2,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: "",
                  x: 0,
                  trackIndex: 3,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: "{{marquee:rainbow_border}}",
                  x: 0,
                  trackIndex: 4,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: "",
                  x: 0,
                  trackIndex: 5,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: "  §7┃ 多维传送 §r",
                  x: 0,
                  trackIndex: 6,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: " §7 ┃ §7玩家互传 ",
                  x: 0,
                  trackIndex: 7,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: " §7 ┃ §7数控转账 ",
                  x: 0,
                  trackIndex: 8,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: " §7 ┃ §7音乐选项",
                  x: 0,
                  trackIndex: 9,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: " §7 ┃ §7原地飞升",
                  x: 0,
                  trackIndex: 10,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: " §7 ┃ §7个人信息",
                  x: 0,
                  trackIndex: 11,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: "",
                  x: 0,
                  trackIndex: 12,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: "{{marquee:rainbow_border}}",
                  x: 0,
                  trackIndex: 13,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: "§7  抬头确认    §f━●━§7    低头关机",
                  x: 0,
                  trackIndex: 14,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "gap",
                  lines: 5,
                  trackIndex: 15,
                  startTick: 0,
                  durationTicks: i
                }, {
                  type: "text",
                  text: "                                                   ",
                  x: 0,
                  trackIndex: 16,
                  startTick: 0,
                  durationTicks: i
                }]
              }];
              window.App.storage.saveProject(e);
              H(e.id);
            }
          })(t.id);
        });
        e.appendChild(i);
      });
    }
  }, 100);
});