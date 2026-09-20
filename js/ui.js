(function() {
    window.App = window.App || {};
    const e = window.App.state;
    let t = -1;
    let n = false;
    let i = null;

    function o(e, t, n, o) {
        const a = document.getElementById("editor-dialog-overlay");
        const s = document.getElementById("editor-custom-dialog");
        const r = s.querySelector(".dialog-title");
        const d = s.querySelector(".dialog-content");
        const l = document.getElementById("btn-editor-dialog-confirm");
        r.textContent = e;
        d.textContent = t;
        l.textContent = n;
        i = o;
        a.classList.add("active");
        s.classList.add("active");
    }

    function a(n) {
        if (t < 0 || !e.menuLines[t]) {
            return;
        }
        if (n === undefined) {
            const t = document.querySelector(".track-area");
            if (t) {
                const i = (e.timelineScale || 1) * 100;
                n = Math.max(0, Math.round(t.scrollLeft / i * 20));
            } else {
                n = 0;
            }
        }
        const i = e.menuLines[t];
        const o = i.startTick || 0;
        const a = o + (i.durationTicks || 20);
        const s = document.getElementById("quick-group-inside");
        const r = document.getElementById("quick-group-outside");
        const d = document.getElementById("btn-move-to-playhead");
        const l = document.getElementById("btn-extend-to-playhead");
        if (s && r) {
            if (n > o && n < a) {
                s.style.display = "flex";
                r.style.display = "none";
            } else {
                s.style.display = "none";
                r.style.display = "flex";
                if (n <= o) {
                    d.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 18l-6-6 6-6\"/><path d=\"M23 12H9\"/><path d=\"M1 2v20\"/></svg>";
                    l.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M20 12H8\"/><path d=\"M20 6v12\"/><path d=\"M4 6v12\"/><path d=\"M8 8l-4 4 4 4\"/></svg>";
                } else {
                    d.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 18l6-6-6-6\"/><path d=\"M1 12h14\"/><path d=\"M23 2v20\"/></svg>";
                    l.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12h12\"/><path d=\"M4 6v12\"/><path d=\"M20 6v12\"/><path d=\"M16 8l4 4-4 4\"/></svg>";
                }
            }
        }
    }

    function s() {
        const e = document.querySelector(".editor-controls");
        const t = document.getElementById("header-actions-normal");
        const n = document.getElementById("header-actions-edit");
        t.style.display = "flex";
        n.style.display = "none";
        n.style.removeProperty("display");
        n.classList.add("u-hidden");
        e.classList.remove("show-props");
        e.classList.remove("show-dynamic-props");
        e.classList.remove("collapse-tracks");
        document.querySelectorAll(".prop-sub-view").forEach(e => e.classList.remove("active"));
        const i = document.getElementById("prop-main-menu");
        i.classList.remove("hidden");
        i.classList.remove("two-cols");
    }

    function r(e) {
        let t = e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        t = t.replace(/\{\{selector:(.*?)\}\}/g, "<span class=\"var-block x-tag x-tag-selector u-cursor-pointer\" contenteditable=\"false\" data-type=\"selector\" data-val=\"$1\" data-ui-action=\"open-sidebar-editor\" data-ui-arg=\"selector|$1\">实体选择器</span>");
        t = t.replace(/\{\{score:(.*?),(.*?)\}\}/g, "<span class=\"var-block x-tag x-tag-score u-cursor-pointer\" contenteditable=\"false\" data-type=\"score\" data-name=\"$1\" data-obj=\"$2\" data-ui-action=\"open-sidebar-editor\" data-ui-arg=\"score|$1,$2\">计分板分数</span>");
        t = t.replace(/\{\{marquee:(.*?)\}\}/g, "<span class=\"var-block x-tag x-tag-marquee u-cursor-pointer\" contenteditable=\"false\" data-type=\"marquee\" data-id=\"$1\" data-ui-action=\"open-sidebar-editor\" data-ui-arg=\"marquee|$1\">循环积木</span>");
        t = t.replace(/\{\{state:(.*?)\}\}/g, "<span class=\"var-block x-tag x-tag-state u-cursor-pointer\" contenteditable=\"false\" data-type=\"state\" data-id=\"$1\" data-ui-action=\"open-sidebar-editor\" data-ui-arg=\"state|$1\">状态机积木</span>");
        return t;
    }

    function d(e) {
        let t = "";
        for (let n of e.childNodes) {
            if (n.nodeType === Node.TEXT_NODE) {
                t += n.textContent.replace(/\u00A0/g, " ");
            } else if (n.nodeType === Node.ELEMENT_NODE) {
                if (n.tagName === "BR") {
                    t += "\n";
                } else if (n.tagName === "DIV" || n.tagName === "P") {
                    if (t.length > 0 && !t.endsWith("\n")) {
                        t += "\n";
                    }
                    t += d(n);
                } else if (n.classList.contains("var-block")) {
                    if (n.dataset.type === "selector") {
                        t += `{{selector:${n.dataset.val}}}`;
                    } else if (n.dataset.type === "score") {
                        t += `{{score:${n.dataset.name},${n.dataset.obj}}}`;
                    } else if (n.dataset.type === "marquee") {
                        t += `{{marquee:${n.dataset.id}}}`;
                    } else if (n.dataset.type === "state") {
                        t += `{{state:${n.dataset.id}}}`;
                    }
                } else {
                    t += d(n);
                }
            }
        }
        return t;
    }

    function l() {
        return "blk_" + Math.random().toString(36).substr(2, 9);
    }

    function c() {
        const n = document.getElementById("applied-blocks-list");
        if (!n) {
            return;
        }
        n.innerHTML = "";
        if (t < 0) {
            return;
        }
        const i = e.menuLines[t];
        if (!i || i.type !== "text") {
            return;
        }
        const o = /\{\{(selector|score|marquee|state):(.*?)\}\}/g;
        let a;
        let s = false;
        while ((a = o.exec(i.text)) !== null) {
            s = true;
            const e = a[0];
            const t = a[1];
            const i = a[2];
            let o = "";
            let r = "";
            if (t === "selector") {
                o = "实体选择器";
                r = "#4CAF50";
            } else if (t === "score") {
                o = "计分板分数";
                r = "#FF9800";
            } else if (t === "marquee") {
                o = "循环积木";
                r = "#E91E63";
            } else if (t === "state") {
                o = "状态机积木";
                r = "#9C27B0";
            }
            const d = document.createElement("div");
            d.className = "block-item";
            d.dataset.fullMatch = e;
            d.style.cssText = "background: #333750; border: none; border-radius: 6px; padding: 10px 12px; display: flex; align-items: center; gap: 10px;";
            d.innerHTML = `\n                <div class="edit-area x-applied-item-area" data-ui-action="open-sidebar-editor" data-ui-arg="${t}|${i}">\n                    <div class="edit-btn x-applied-item-btn">\n                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="u-text-sub"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>\n                    </div>\n                    <div class="x-block-dot" style="background: ${r};"></div>\n                    <span class="x-applied-item-title">${o}</span>\n                </div>\n                <div class="drag-handle x-applied-item-drag">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-sub)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line></svg>\n                </div>\n            `;
            n.appendChild(d);
        }
        if (!s) {
            n.innerHTML = "<div class=\"x-applied-empty\">当前图层还没有添加任何效果</div>";
        }
    }

    function m() {
        const t = document.getElementById("preview-var-list");
        if (!t) {
            return;
        }
        t.innerHTML = "";
        const n = new Set();
        if (Array.isArray(e.menuLines)) {
            e.menuLines.forEach(e => {
                if (!e || typeof e.text != "string") {
                    return;
                }
                const t = /\{\{state:(.*?)\}\}/g;
                let i;
                while ((i = t.exec(e.text)) !== null) {
                    n.add(i[1]);
                }
            });
        }
        let i = new Set();
        n.forEach(t => {
            const n = e.dynamicBlocks[t];
            if (n && n.type === "state" && Array.isArray(n.branches)) {
                n.branches.forEach(e => {
                    if (e && e.name) {
                        i.add(e.name);
                    }
                });
            }
        });
        if (e.activePreviewVars && e.activePreviewVars.size > 0) {
            Array.from(e.activePreviewVars).forEach(t => {
                if (!i.has(t)) {
                    e.activePreviewVars.delete(t);
                }
            });
        }
        if (i.size === 0) {
            const e = document.createElement("div");
            e.style.cssText = "padding: 10px 4px; color: var(--text-sub); font-size: 12px; text-align: center;";
            e.textContent = "暂无可预览的状态";
            t.appendChild(e);
            return;
        }
        Array.from(i).forEach(n => {
            const i = document.createElement("button");
            const o = e.activePreviewVars.has(n);
            i.className = "x-preview-state-btn" + (o ? " active" : "");
            i.textContent = n;
            i.onclick = () => {
                p(n, !o);
            };
            t.appendChild(i);
        });
    }

    function p(t, n) {
        if (n) {
            e.activePreviewVars.clear();
            e.activePreviewVars.add(t);
        } else {
            e.activePreviewVars.delete(t);
        }
        m();
        if (window.App.render) {
            window.App.render.render();
        }
    }
    let u = null;
    let y = null;
    let v = null;
    let w = null;

    function g(e = "") {
        const t = document.getElementById("edit-mq-frames-list");
        const n = document.createElement("div");
        n.className = "x-branch-row";
        n.innerHTML = `\n            <textarea class="frame-text x-branch-textarea" placeholder="帧文本" data-ui-input="save-block-editor">${e.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>\n            <button data-ui-action="remove-parent-and-save" class="x-branch-del-btn" title="删除此帧">\n                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>\n            </button>\n        `;
        t.appendChild(n);
        h();
    }

    function x() {
        document.getElementById("prop-view-dynamic-edit").classList.remove("active");
        if (w) {
            document.getElementById(w).classList.add("active");
            if (w === "prop-view-applied-blocks") {
                c();
            }
        } else {
            const e = document.getElementById("prop-main-menu");
            e.classList.remove("hidden");
            e.classList.remove("two-cols");
        }
        document.querySelector(".editor-controls").classList.remove("show-dynamic-props");
        u = null;
        y = null;
    }

    function h(t = true) {
        if (y === "marquee") {
            const t = document.getElementById("edit-mq-score").value;
            const n = parseInt(document.getElementById("edit-mq-ticks").value) || 5;
            const i = [];
            document.getElementById("edit-mq-frames-list").querySelectorAll(".frame-text").forEach(e => {
                if (e.value.trim() !== "") {
                    i.push(e.value);
                }
            });
            e.dynamicBlocks[u] = {
                type: "marquee",
                scoreName: t,
                ticksPerFrame: n,
                frames: i
            };
        } else if (y === "state") {
            const t = document.getElementById("edit-st-score").value || "";
            const n = document.getElementById("edit-st-branches");
            const i = [];
            n.querySelectorAll("div.branch-item").forEach(e => {
                const t = e.querySelector(".branch-name").value;
                const n = e.querySelector(".branch-selector").value || "";
                const o = e.querySelector(".branch-condition").value;
                const a = e.querySelector(".branch-text").value.replace(/\\n/g, "\n");
                i.push({
                    name: t,
                    selector: n,
                    condition: o,
                    text: a
                });
            });
            e.dynamicBlocks[u] = {
                type: "state",
                scoreName: t,
                branches: i
            };
        } else if (y === "selector") {
            const e = document.getElementById("edit-selector-val").value || "@s";
            if (e !== u) {
                const t = document.getElementById("prop-text-input");
                t.querySelectorAll(`.var-block[data-type="selector"][data-val="${u}"]`).forEach(t => {
                    t.dataset.val = e;
                    t.setAttribute("ondblclick", `App.ui.openSidebarEditor('selector', '${e}')`);
                });
                u = e;
                t.dataset.lastValidHtml = t.innerHTML;
                t.dispatchEvent(new Event("input"));
            }
        } else if (y === "score") {
            const e = document.getElementById("edit-score-name").value || "@s";
            const t = document.getElementById("edit-score-obj").value || "";
            const n = `${e},${t}`;
            if (n !== u) {
                const i = document.getElementById("prop-text-input");
                const [o, a] = u.split(",");
                i.querySelectorAll(`.var-block[data-type="score"][data-name="${o}"][data-obj="${a}"]`).forEach(i => {
                    i.dataset.name = e;
                    i.dataset.obj = t;
                    i.setAttribute("ondblclick", `App.ui.openSidebarEditor('score', '${n}')`);
                });
                u = n;
                i.dataset.lastValidHtml = i.innerHTML;
                i.dispatchEvent(new Event("input"));
            }
        }
        m();
        if (!t) {
            x();
        }
        if (window.App.render) {
            window.App.render.render();
        }
        if (window.App.timeline && window.App.timeline.saveSnapshot) {
            window.App.timeline.saveSnapshot();
        }
    }

    function E(e = "", t = "", n = "", i = "") {
        const o = document.getElementById("edit-st-branches");
        const a = document.createElement("div");
        a.className = "branch-item x-branch-item";
        a.innerHTML = `\n            <div class="x-branch-row">\n                <input type="text" class="branch-name x-branch-input" value="${e}" data-ui-input="save-block-editor" placeholder="预览名字">\n                <button data-ui-action="copy-state-branch" class="x-branch-icon-btn" title="复制此分支">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>\n                </button>\n                <button data-ui-action="remove-branch-and-save" class="x-branch-icon-btn" title="删除此分支">\n                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>\n                </button>\n            </div>\n            <div class="u-flex">\n                <input type="text" class="branch-selector x-branch-input-mono" value="${t}" data-ui-input="save-block-editor" placeholder="目标选择器(如@s)">\n            </div>\n            <div class="u-flex">\n                <input type="text" class="branch-condition x-branch-input-mono" value="${n}" data-ui-input="save-block-editor" placeholder="参数条件(如tag=a 或 scores={a=1})">\n            </div>\n            <div class="u-flex">\n                <textarea class="branch-text x-branch-textarea" data-ui-input="save-block-editor" placeholder="状态文本">${i.replace(/\n/g, "\\n").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</textarea>\n            </div>\n        `;
        o.appendChild(a);
        h();
    }
    window.App.ui = {
        init: function() {
            if (n) {
                return;
            }
            n = true;
            const p = document.getElementById("layer-prop-panel");
            if (p) {
                p.addEventListener("scroll", () => {
                    if (p.scrollLeft !== 0) {
                        p.scrollLeft = 0;
                    }
                    if (p.scrollTop !== 0) {
                        p.scrollTop = 0;
                    }
                });
            }
            const u = document.getElementById("prop-text-input");
            const y = document.getElementById("prop-x-display");
            const v = document.getElementById("prop-y-display");
            const w = document.getElementById("precise-x-input");
            const g = document.getElementById("precise-y-input");
            document.getElementById("header-actions-normal");
            document.getElementById("header-actions-edit");
            const x = document.getElementById("btn-delete-layer");
            const h = document.getElementById("move-workspace");
            const E = document.getElementById("btn-move-mode");
            const f = document.getElementById("move-touchpad");
            u.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    e.preventDefault();
                }
            });
            u.addEventListener("focus", () => {
                if (window.App.saveHistory) {
                    window.App.saveHistory();
                }
            });
            u.addEventListener("input", n => {
                if (t >= 0 && e.menuLines[t] && e.menuLines[t].type === "text") {
                    const n = u.querySelectorAll(".var-block").length;
                    const i = document.createElement("div");
                    i.innerHTML = u.dataset.lastValidHtml || "";
                    if (n < i.querySelectorAll(".var-block").length) {
                        u.innerHTML = u.dataset.lastValidHtml;
                        const e = document.createRange();
                        e.selectNodeContents(u);
                        e.collapse(false);
                        const t = window.getSelection();
                        t.removeAllRanges();
                        t.addRange(e);
                        return;
                    }
                    u.dataset.lastValidHtml = u.innerHTML;
                    let o = d(u).replace(/[\r\n]/g, "");
                    e.menuLines[t].text = o;
                    if (window.App.timeline) {
                        window.App.timeline.renderTimeline();
                    }
                    if (window.App.render) {
                        window.App.render.render();
                    }
                    if (window.App.saveCurrentProject) {
                        window.App.saveCurrentProject();
                    }
                }
            });
            let k = 0;
            let L = 0;
            let b = 0;
            let I = 0;
            let B = null;
            f.addEventListener("touchstart", e => {
                if (window.App.saveHistory) {
                    window.App.saveHistory();
                }
                k = e.touches[0].clientX;
                L = e.touches[0].clientY;
                b = parseInt(y.textContent) || 0;
                I = parseInt(v.textContent) || 1;
                const t = f.getBoundingClientRect();
                const n = k - t.left;
                const i = L - t.top;
                const o = n / t.width * 2 - 1;
                const a = i / t.height * 2 - 1;
                B = Math.abs(o) < 0.4 && Math.abs(a) < 0.4 ? null : Math.abs(o) > Math.abs(a) ? "x" : "y";
            }, {
                passive: false
            });
            f.addEventListener("touchmove", n => {
                n.preventDefault();
                if (t < 0 || !e.menuLines[t]) {
                    return;
                }
                const i = n.touches[0].clientX - k;
                const o = n.touches[0].clientY - L;
                if (!B) {
                    if (Math.abs(i) > 5 || Math.abs(o) > 5) {
                        B = Math.abs(i) > Math.abs(o) ? "x" : "y";
                    }
                }
                let a = b;
                let s = I;
                if (B === "x" || !B) {
                    const e = Math.round(i / 8);
                    a = Math.max(-200, Math.min(200, b + e));
                }
                if (B === "y" || !B) {
                    const n = Math.round(o / 20);
                    let i = -1;
                    e.menuLines.forEach((e, n) => {
                        if (n !== t && e.trackIndex > i) {
                            i = e.trackIndex;
                        }
                    });
                    s = Math.max(1, Math.min(i + 2, I + n));
                }
                if (e.menuLines.length <= 1) {
                    a = 0;
                    s = 1;
                }
                y.textContent = a;
                e.menuLines[t].x = a;
                v.textContent = s;
                if (s - 1 !== e.menuLines[t].trackIndex) {
                    const n = s - 1;
                    const i = e.menuLines[t].trackIndex;
                    const o = e.menuLines[t];
                    const a = o.startTick || 0;
                    const r = a + (o.durationTicks || 20);
                    const d = e.menuLines.filter((e, i) => {
                        if (i === t) {
                            return false;
                        }
                        if (e.trackIndex !== n) {
                            return false;
                        }
                        const o = e.startTick || 0;
                        const s = o + (e.durationTicks || 20);
                        return Math.max(a, o) < Math.min(r, s);
                    });
                    o.trackIndex = n;
                    d.forEach(e => {
                        e.trackIndex = i;
                    });
                    if (window.App.timeline) {
                        window.App.timeline.renderTimeline();
                    }
                }
                if (window.App.render) {
                    window.App.render.render();
                }
            }, {
                passive: false
            });
            f.addEventListener("touchend", () => {
                if (window.App.timeline) {
                    window.App.timeline.renderTimeline();
                }
                if (window.App.saveCurrentProject) {
                    window.App.saveCurrentProject();
                }
            });
            const A = document.getElementById("btn-precise-edit");
            const T = document.getElementById("btn-auto-align");
            A.addEventListener("click", () => {
                if (h.classList.contains("mode-precise")) {
                    h.classList.remove("mode-precise");
                    h.classList.remove("mode-align");
                    E.classList.add("active");
                    A.classList.remove("active");
                    T.classList.remove("active");
                } else {
                    h.classList.add("mode-precise");
                    h.classList.remove("mode-align");
                    A.classList.add("active");
                    E.classList.remove("active");
                    T.classList.remove("active");
                    w.value = y.textContent;
                    g.value = v.textContent;
                }
            });
            E.addEventListener("click", () => {
                h.classList.remove("mode-precise");
                h.classList.remove("mode-align");
                E.classList.add("active");
                A.classList.remove("active");
                T.classList.remove("active");
            });
            const M = () => {
                if (t < 0 || !e.menuLines[t]) {
                    return;
                }
                let n = parseInt(w.value);
                if (isNaN(n)) {
                    n = 0;
                }
                n = Math.max(-200, Math.min(200, n));
                let i = parseInt(g.value);
                if (isNaN(i)) {
                    i = 1;
                }
                let o = -1;
                e.menuLines.forEach((e, n) => {
                    if (n !== t && e.trackIndex > o) {
                        o = e.trackIndex;
                    }
                });
                i = Math.max(1, Math.min(o + 2, i));
                if (e.menuLines.length <= 1) {
                    n = 0;
                    i = 1;
                    w.value = 0;
                    g.value = 1;
                }
                y.textContent = n;
                e.menuLines[t].x = n;
                if (i - 1 !== e.menuLines[t].trackIndex) {
                    const n = i - 1;
                    const o = e.menuLines[t].trackIndex;
                    const a = e.menuLines[t];
                    const s = a.startTick || 0;
                    const r = s + (a.durationTicks || 20);
                    const d = e.menuLines.filter((e, i) => {
                        if (i === t) {
                            return false;
                        }
                        if (e.trackIndex !== n) {
                            return false;
                        }
                        const o = e.startTick || 0;
                        const a = o + (e.durationTicks || 20);
                        return Math.max(s, o) < Math.min(r, a);
                    });
                    a.trackIndex = n;
                    d.forEach(e => {
                        e.trackIndex = o;
                    });
                    if (window.App.timeline) {
                        window.App.timeline.renderTimeline();
                    }
                }
                v.textContent = i;
                if (window.App.render) {
                    window.App.render.render();
                }
                if (window.App.saveCurrentProject) {
                    window.App.saveCurrentProject();
                }
            };
            w.addEventListener("focus", () => {
                if (window.App.saveHistory) {
                    window.App.saveHistory();
                }
            });
            g.addEventListener("focus", () => {
                if (window.App.saveHistory) {
                    window.App.saveHistory();
                }
            });
            w.addEventListener("input", M);
            g.addEventListener("input", M);
            const H = () => {
                let n = parseInt(w.value);
                if (isNaN(n)) {
                    n = 0;
                }
                w.value = Math.max(-200, Math.min(200, n));
                let i = parseInt(g.value);
                if (isNaN(i)) {
                    i = 1;
                }
                let o = -1;
                e.menuLines.forEach((e, n) => {
                    if (n !== t && e.trackIndex > o) {
                        o = e.trackIndex;
                    }
                });
                g.value = Math.max(1, Math.min(o + 2, i));
            };
            w.addEventListener("change", H);
            g.addEventListener("change", H);
            w.addEventListener("blur", H);
            g.addEventListener("blur", H);
            const q = document.getElementById("btn-trim-left");
            const S = document.getElementById("btn-split");
            const C = document.getElementById("btn-trim-right");

            function $() {
                if (t < 0 || !e.menuLines[t]) {
                    return null;
                }
                const n = document.querySelector(".track-area");
                if (!n) {
                    return null;
                }
                const i = (e.timelineScale || 1) * 100;
                const o = Math.max(0, Math.round(n.scrollLeft / i * 20));
                return {
                    clip: e.menuLines[t],
                    currentTick: o
                };
            }
            if (q) {
                q.addEventListener("click", () => {
                    const e = $();
                    if (!e) {
                        return;
                    }
                    const {
                        clip: t,
                        currentTick: n
                    } = e;
                    const i = t.startTick || 0;
                    const o = i + (t.durationTicks || 20);
                    if (n > i && n < o) {
                        if (window.App.saveHistory) {
                            window.App.saveHistory();
                        }
                        t.startTick = n;
                        t.durationTicks = o - n;
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                        if (window.App.render) {
                            window.App.render.render();
                        }
                    }
                });
            }
            if (S) {
                S.addEventListener("click", () => {
                    const t = $();
                    if (!t) {
                        return;
                    }
                    const {
                        clip: n,
                        currentTick: i
                    } = t;
                    const o = n.startTick || 0;
                    const a = o + (n.durationTicks || 20);
                    if (i > o && i < a) {
                        if (window.App.saveHistory) {
                            window.App.saveHistory();
                        }
                        const t = JSON.parse(JSON.stringify(n));
                        n.durationTicks = i - o;
                        t.startTick = i;
                        t.durationTicks = a - i;
                        e.menuLines.push(t);
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                        if (window.App.render) {
                            window.App.render.render();
                        }
                    }
                });
            }
            if (C) {
                C.addEventListener("click", () => {
                    const e = $();
                    if (!e) {
                        return;
                    }
                    const {
                        clip: t,
                        currentTick: n
                    } = e;
                    const i = t.startTick || 0;
                    const o = i + (t.durationTicks || 20);
                    if (n > i && n < o) {
                        if (window.App.saveHistory) {
                            window.App.saveHistory();
                        }
                        t.durationTicks = n - i;
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                        if (window.App.render) {
                            window.App.render.render();
                        }
                    }
                });
            }
            const N = document.getElementById("btn-move-to-playhead");
            const P = document.getElementById("btn-extend-to-playhead");
            if (N) {
                N.addEventListener("click", () => {
                    const e = $();
                    if (!e) {
                        return;
                    }
                    const {
                        clip: t,
                        currentTick: n
                    } = e;
                    const i = t.startTick || 0;
                    const o = i + (t.durationTicks || 20);
                    if (n <= i) {
                        t.startTick = n;
                    } else if (n >= o) {
                        t.startTick = n - (t.durationTicks || 20);
                    }
                    if (window.App.saveHistory) {
                        window.App.saveHistory();
                    }
                    if (window.App.timeline) {
                        window.App.timeline.renderTimeline();
                    }
                    if (window.App.render) {
                        window.App.render.render();
                    }
                    a(n);
                });
            }
            if (P) {
                P.addEventListener("click", () => {
                    const e = $();
                    if (!e) {
                        return;
                    }
                    const {
                        clip: t,
                        currentTick: n
                    } = e;
                    const i = t.startTick || 0;
                    const o = i + (t.durationTicks || 20);
                    if (n <= i) {
                        t.durationTicks = o - n;
                        t.startTick = n;
                    } else if (n >= o) {
                        t.durationTicks = n - i;
                    }
                    if (window.App.saveHistory) {
                        window.App.saveHistory();
                    }
                    if (window.App.timeline) {
                        window.App.timeline.renderTimeline();
                    }
                    if (window.App.render) {
                        window.App.render.render();
                    }
                    a(n);
                });
            }
            const V = document.getElementById("btn-editor-dialog-cancel");
            const j = document.getElementById("btn-editor-dialog-confirm");
            V.addEventListener("click", () => {
                document.getElementById("editor-dialog-overlay").classList.remove("active");
                document.getElementById("editor-custom-dialog").classList.remove("active");
                i = null;
            });
            j.addEventListener("click", () => {
                if (i) {
                    i();
                }
                document.getElementById("editor-dialog-overlay").classList.remove("active");
                document.getElementById("editor-custom-dialog").classList.remove("active");
                i = null;
            });
            x.addEventListener("click", () => {
                if (t >= 0) {
                    o("删除图层", "确定要删除当前选中的图层吗？", "删除", () => {
                        if (window.App.saveHistory) {
                            window.App.saveHistory();
                        }
                        const n = e.menuLines[t].trackIndex;
                        e.menuLines.splice(t, 1);
                        e.selectedLines.clear();
                        if (!e.menuLines.some(e => e.trackIndex === n)) {
                            e.menuLines.forEach(e => {
                                if (e.trackIndex > n) {
                                    e.trackIndex -= 1;
                                }
                            });
                        }
                        s();
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                        if (window.App.render) {
                            window.App.render.render();
                        }
                        m();
                    });
                }
            });
            const Y = document.querySelectorAll(".prop-menu-item");
            const _ = document.querySelectorAll(".prop-sub-view");
            const D = document.querySelectorAll(".btn-prop-back");
            const O = document.getElementById("prop-main-menu");
            Y.forEach(e => {
                e.addEventListener("click", () => {
                    const t = e.getAttribute("data-target");
                    if (t === "prop-view-applied-blocks") {
                        c();
                    }
                    O.classList.add("hidden");
                    document.getElementById(t).classList.add("active");
                });
            });
            document.getElementById("btn-back-from-applied").addEventListener("click", () => {
                document.getElementById("prop-view-applied-blocks").classList.remove("active");
                const e = document.getElementById("prop-main-menu");
                e.classList.remove("hidden");
                e.classList.remove("two-cols");
            });
            document.getElementById("btn-add-effect").addEventListener("click", () => {
                document.getElementById("prop-view-applied-blocks").classList.remove("active");
                document.getElementById("prop-view-block").classList.add("active");
            });
            document.getElementById("btn-back-from-add-effect").addEventListener("click", () => {
                document.getElementById("prop-view-block").classList.remove("active");
                document.getElementById("prop-view-applied-blocks").classList.add("active");
                c();
            });
            const F = document.getElementById("btn-applied-more");
            const R = document.getElementById("applied-more-dropdown");
            const z = document.getElementById("btn-applied-copy-all");
            const J = document.getElementById("btn-applied-paste-all");
            if (F) {
                F.addEventListener("click", e => {
                    if (e.target.closest(".dropdown-item")) {
                        return;
                    }
                    const t = F.getBoundingClientRect();
                    R.style.left = t.right + 10 + "px";
                    R.style.bottom = window.innerHeight - t.top + 5 + "px";
                    R.style.top = "auto";
                    if (X && X.length !== 0) {
                        J.style.opacity = "1";
                        J.style.pointerEvents = "auto";
                    } else {
                        J.style.opacity = "0.3";
                        J.style.pointerEvents = "none";
                    }
                    R.classList.toggle("active");
                });
            }
            document.addEventListener("click", e => {
                if (!!F && !F.contains(e.target) && !R.contains(e.target)) {
                    R.classList.remove("active");
                }
            });
            let X = null;
            if (z) {
                z.addEventListener("click", () => {
                    if (t < 0) {
                        return;
                    }
                    const n = e.menuLines[t];
                    if (!n || n.type !== "text") {
                        return;
                    }
                    const i = /\{\{(selector|score|marquee|state):(.*?)\}\}/g;
                    let o;
                    let a = [];
                    while ((o = i.exec(n.text)) !== null) {
                        const t = o[1];
                        const n = o[2];
                        let i = null;
                        if (t === "marquee" || t === "state") {
                            i = e.dynamicBlocks[n] ? JSON.parse(JSON.stringify(e.dynamicBlocks[n])) : null;
                        }
                        a.push({
                            type: t,
                            val: n,
                            data: i
                        });
                    }
                    X = a;
                    R.classList.remove("active");
                    const s = document.getElementById("toast");
                    if (s) {
                        s.textContent = `已复制 ${a.length} 个效果`;
                        s.style.display = "block";
                        setTimeout(() => s.style.opacity = "1", 10);
                        setTimeout(() => {
                            s.style.opacity = "0";
                            setTimeout(() => s.style.display = "none", 300);
                        }, 2000);
                    }
                });
            }
            if (J) {
                J.addEventListener("click", () => {
                    R.classList.remove("active");
                    if (!X || X.length === 0) {
                        const e = document.getElementById("toast");
                        if (e) {
                            e.textContent = "剪贴板为空";
                            e.style.display = "block";
                            setTimeout(() => e.style.opacity = "1", 10);
                            setTimeout(() => {
                                e.style.opacity = "0";
                                setTimeout(() => e.style.display = "none", 300);
                            }, 2000);
                        }
                        return;
                    }
                    if (t < 0) {
                        return;
                    }
                    const n = e.menuLines[t];
                    if (!n || n.type !== "text") {
                        return;
                    }
                    if (window.App.saveHistory) {
                        window.App.saveHistory();
                    }
                    let i = "";
                    X.forEach(t => {
                        if (t.type === "selector" || t.type === "score") {
                            i += `{{${t.type}:${t.val}}}`;
                        } else if (t.type === "marquee" || t.type === "state") {
                            const n = l();
                            if (t.data) {
                                e.dynamicBlocks[n] = JSON.parse(JSON.stringify(t.data));
                            } else {
                                e.dynamicBlocks[n] = {
                                    type: t.type,
                                    scoreName: "",
                                    branches: [],
                                    frames: [],
                                    ticksPerFrame: 5
                                };
                            }
                            i += `{{${t.type}:${n}}}`;
                        }
                    });
                    n.text += i;
                    const o = document.getElementById("prop-text-input");
                    if (o) {
                        o.innerHTML = r(n.text);
                        o.dataset.lastValidHtml = o.innerHTML;
                    }
                    c();
                    if (window.App.render) {
                        window.App.render.render();
                    }
                    const a = document.getElementById("toast");
                    if (a) {
                        a.textContent = `已追加粘贴 ${X.length} 个效果`;
                        a.style.display = "block";
                        setTimeout(() => a.style.opacity = "1", 10);
                        setTimeout(() => {
                            a.style.opacity = "0";
                            setTimeout(() => a.style.display = "none", 300);
                        }, 2000);
                    }
                });
            }
            D.forEach(e => {
                e.addEventListener("click", () => {
                    _.forEach(e => e.classList.remove("active"));
                    O.classList.remove("hidden");
                    O.classList.remove("two-cols");
                    const e = document.getElementById("layer-prop-panel");
                    if (e) {
                        e.scrollLeft = 0;
                        e.scrollTop = 0;
                    }
                });
            });
            const G = document.querySelectorAll(".add-tab");
            const W = document.querySelectorAll(".add-view");
            const U = document.getElementById("add-tabs-container");
            document.getElementById("preview-back-bar");
            document.getElementById("btn-back-from-preview");
            const Q = document.getElementById("editor-add-overlay");
            G.forEach(e => {
                e.addEventListener("click", () => {
                    G.forEach(e => e.classList.remove("active"));
                    W.forEach(e => e.style.display = "none");
                    e.classList.add("active");
                    const t = e.getAttribute("data-target");
                    if (t) {
                        document.getElementById(t).style.display = t === "add-view-text" ? "block" : "flex";
                        if (t === "add-view-preview") {
                            m();
                            U.style.display = "flex";
                            Q.style.background = "transparent";
                        } else {
                            Q.style.background = "";
                        }
                    }
                });
            });
            if (Q) {
                Q.addEventListener("click", () => {
                    setTimeout(() => {
                        (function() {
                            U.style.display = "flex";
                            G.forEach(e => e.classList.remove("active"));
                            W.forEach(e => e.style.display = "none");
                            const e = G[0];
                            if (e) {
                                e.classList.add("active");
                                const t = e.getAttribute("data-target");
                                if (t) {
                                    document.getElementById(t).style.display = "block";
                                }
                            }
                        })();
                        Q.style.background = "";
                    }, 300);
                });
            }
            const K = document.getElementById("editor-settings-menu");
            const Z = document.getElementById("edit-bg-color");
            const ee = document.getElementById("edit-grid-color");
            const te = document.getElementById("edit-grid-size");
            const ne = document.getElementById("btn-reset-view");
            const ie = () => {
                e.bgColor = Z.value;
                e.gridColor = ee.value;
                e.gridSize = parseInt(te.value) || 8;
                if (window.App.render) {
                    window.App.render.render();
                }
            };
            Z.addEventListener("input", ie);
            ee.addEventListener("input", ie);
            te.addEventListener("input", ie);
            ne.addEventListener("click", () => {
                e.panX = 0;
                e.panY = 0;
                e.scaleFactor = 2;
                if (window.App.render) {
                    window.App.render.render();
                }
                K.classList.remove("active");
            });
            T.addEventListener("click", () => {
                if (h.classList.contains("mode-align")) {
                    h.classList.remove("mode-align");
                    h.classList.remove("mode-precise");
                    E.classList.add("active");
                    T.classList.remove("active");
                    A.classList.remove("active");
                } else {
                    h.classList.add("mode-align");
                    h.classList.remove("mode-precise");
                    T.classList.add("active");
                    E.classList.remove("active");
                    A.classList.remove("active");
                }
            });
            const oe = document.getElementById("applied-blocks-list");
            if (oe) {
                let ve = null;
                let we = 0;
                let ge = -1;
                let xe = 0;
                let he = [];

                function ae(e, t) {
                    e.preventDefault();
                    ve = t.closest(".block-item");
                    we = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
                    he = Array.from(oe.querySelectorAll(".block-item"));
                    ge = he.indexOf(ve);
                    xe = he.length > 1 ? Math.abs(he[1].getBoundingClientRect().top - he[0].getBoundingClientRect().top) : ve.offsetHeight + 8;
                    ve.style.transition = "none";
                    ve.style.zIndex = 1000;
                    ve.style.position = "relative";
                    ve.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
                    he.forEach(e => {
                        if (e !== ve) {
                            e.style.transition = "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)";
                        }
                    });
                }

                function se(e) {
                    if (!ve) {
                        return;
                    }
                    e.preventDefault();
                    const t = (e.type.includes("mouse") ? e.clientY : e.touches[0].clientY) - we;
                    ve.style.transform = `translateY(${t}px)`;
                    let n = ge;
                    he.forEach((e, i) => {
                        if (i !== ge) {
                            if (i > ge && t > (i - ge) * xe - xe * 0.2) {
                                n = Math.max(n, i);
                            } else if (i < ge && t < (i - ge) * xe + xe * 0.2) {
                                n = Math.min(n, i);
                            }
                        }
                    });
                    he.forEach((e, t) => {
                        if (t !== ge) {
                            e.style.transform = t > ge && t <= n ? `translateY(-${xe}px)` : t < ge && t >= n ? `translateY(${xe}px)` : "translateY(0px)";
                        }
                    });
                    ve.dataset.newIndex = n;
                }

                function re(n) {
                    if (!ve) {
                        return;
                    }
                    const i = parseInt(ve.dataset.newIndex || ge);
                    he.forEach(e => {
                        e.style.transition = "";
                        e.style.transform = "";
                        e.style.position = "";
                        e.style.zIndex = "";
                        e.style.boxShadow = "";
                    });
                    if (i !== ge) {
                        if (i > ge) {
                            oe.insertBefore(ve, he[i].nextSibling);
                        } else {
                            oe.insertBefore(ve, he[i]);
                        }
                        (function() {
                            if (t < 0) {
                                return;
                            }
                            const n = e.menuLines[t];
                            if (!n || n.type !== "text") {
                                return;
                            }
                            const i = document.getElementById("applied-blocks-list");
                            const o = Array.from(i.querySelectorAll(".block-item")).map(e => e.dataset.fullMatch);
                            const a = /\{\{(selector|score|marquee|state):(.*?)\}\}/g;
                            let s;
                            let d = [];
                            let l = 0;
                            let c = [];
                            while ((s = a.exec(n.text)) !== null) {
                                d.push(n.text.substring(l, s.index));
                                c.push(s[0]);
                                l = a.lastIndex;
                            }
                            d.push(n.text.substring(l));
                            if (c.length !== o.length) {
                                return;
                            }
                            let m = d[0];
                            for (let e = 0; e < o.length; e++) {
                                m += o[e] + d[e + 1];
                            }
                            n.text = m;
                            const p = document.getElementById("prop-text-input");
                            if (p) {
                                p.innerHTML = r(m);
                                p.dataset.lastValidHtml = p.innerHTML;
                            }
                            if (window.App.render) {
                                window.App.render.render();
                            }
                            if (window.App.saveHistory) {
                                window.App.saveHistory();
                            }
                        })();
                    }
                    ve.dataset.newIndex = "";
                    ve = null;
                }
                oe.addEventListener("touchstart", e => {
                    const t = e.target.closest(".drag-handle");
                    if (t) {
                        ae(e, t);
                    }
                }, {
                    passive: false
                });
                document.addEventListener("touchmove", se, {
                    passive: false
                });
                document.addEventListener("touchend", re);
                oe.addEventListener("mousedown", e => {
                    const t = e.target.closest(".drag-handle");
                    if (t) {
                        ae(e, t);
                    }
                });
                document.addEventListener("mousemove", se);
                document.addEventListener("mouseup", re);
            }

            function de(n) {
                if (e.menuLines.length === 0) {
                    return;
                }
                if (window.App.saveHistory) {
                    window.App.saveHistory();
                }
                let i = 0;
                for (let t of e.menuLines) {
                    if (t.type === "text") {
                        let e = window.App.font.measureTextWidth(t.text);
                        if (e > i) {
                            i = e;
                        }
                    }
                }
                for (let t of e.menuLines) {
                    if (t.type === "text") {
                        let e = window.App.font.measureTextWidth(t.text);
                        if (n === "left") {
                            t.x = 0;
                        } else if (n === "center") {
                            t.x = Math.max(0, Math.floor((i - e) / 2 / 4));
                        } else if (n === "right") {
                            t.x = Math.max(0, Math.floor((i - e) / 4));
                        }
                    }
                }
                if (window.App.timeline) {
                    window.App.timeline.renderTimeline();
                }
                if (window.App.render) {
                    window.App.render.render();
                }
                if (t >= 0) {
                    y.textContent = e.menuLines[t].x;
                }
            }
            document.getElementById("btn-align-trim").addEventListener("click", () => {
                if (window.App.saveHistory) {
                    window.App.saveHistory();
                }
                let n = Infinity;
                for (let t of e.menuLines) {
                    if (t.type === "text" && t.text.trim() !== "" && t.x < n) {
                        n = t.x;
                    }
                }
                if (n > 0 && n !== Infinity) {
                    for (let t of e.menuLines) {
                        if (t.type === "text") {
                            t.x -= n;
                        }
                    }
                    if (window.App.timeline) {
                        window.App.timeline.renderTimeline();
                    }
                    if (window.App.render) {
                        window.App.render.render();
                    }
                    if (t >= 0) {
                        y.textContent = e.menuLines[t].x;
                    }
                }
            });
            document.getElementById("btn-align-left").addEventListener("click", () => de("left"));
            document.getElementById("btn-align-center").addEventListener("click", () => de("center"));
            document.getElementById("btn-align-right").addEventListener("click", () => de("right"));
            const le = document.getElementById("export-sheet");
            const ce = document.getElementById("export-overlay");
            const me = document.getElementById("btn-close-export");
            const pe = document.getElementById("export-textarea");
            const ue = document.getElementById("btn-copy-cmd");
            const ye = document.getElementById("btn-copy-md");
            me.addEventListener("click", () => {
                le.classList.remove("active");
                ce.classList.remove("active");
                const e = document.getElementById("btn-editor-add");
                if (e) {
                    e.classList.remove("u-hidden");
                }
            });
            ue.addEventListener("click", () => {
                pe.select();
                document.execCommand("copy");
                const e = document.getElementById("toast");
                e.textContent = "指令已复制到剪贴板！";
                e.style.display = "block";
                setTimeout(() => e.style.opacity = "1", 10);
                setTimeout(() => {
                    e.style.opacity = "0";
                    setTimeout(() => e.style.display = "none", 300);
                }, 2000);
            });
            if (ye) {
                ye.addEventListener("click", () => {
                    const e = `\`\`\`mcfunction\n${pe.value}\n\`\`\``;
                    const t = `editor_export_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.md`;
                    const n = document.getElementById("toast");
                    if (window.EditorNative && typeof window.EditorNative.saveMarkdownToDownloads == "function") {
                        window.EditorNative.saveMarkdownToDownloads(t, e);
                        if (n) {
                            n.textContent = "正在保存到 Download 文件夹...";
                            n.style.display = "block";
                            setTimeout(() => n.style.opacity = "1", 10);
                            setTimeout(() => {
                                n.style.opacity = "0";
                                setTimeout(() => n.style.display = "none", 300);
                            }, 2000);
                        }
                        return;
                    }
                    const i = document.createElement("textarea");
                    i.value = e;
                    document.body.appendChild(i);
                    i.select();
                    document.execCommand("copy");
                    document.body.removeChild(i);
                    if (n) {
                        n.textContent = "已复制为 Markdown 格式！";
                        n.style.display = "block";
                        setTimeout(() => n.style.opacity = "1", 10);
                        setTimeout(() => {
                            n.style.opacity = "0";
                            setTimeout(() => n.style.display = "none", 300);
                        }, 2000);
                    }
                });
            }
        },
        openPropSheet: function(n) {
            t = n;
            const i = e.menuLines[n];
            if (!i) {
                return;
            }
            const o = document.getElementById("prop-text-input");
            const s = document.getElementById("prop-x-display");
            const d = document.getElementById("prop-y-display");
            const l = document.getElementById("prop-gap-input-container");
            const c = document.getElementById("prop-gap-lines");
            const m = document.getElementById("prop-main-menu");
            const p = document.querySelectorAll(".prop-sub-view");
            if (i.type === "text") {
                o.innerHTML = r(i.text);
                o.dataset.lastValidHtml = o.innerHTML;
                s.textContent = i.x || 0;
                d.textContent = (i.trackIndex || 0) + 1;
                o.contentEditable = "true";
                o.style.display = "block";
                if (l) {
                    l.classList.add("u-hidden");
                }
            } else {
                o.style.display = "none";
                o.innerHTML = "";
                o.dataset.lastValidHtml = "";
                s.textContent = 0;
                d.textContent = (i.trackIndex || 0) + 1;
                if (l) {
                    l.classList.remove("u-hidden");
                    c.value = i.lines || 1;
                }
            }
            const u = document.querySelector(".editor-controls");
            const y = document.getElementById("header-actions-normal");
            const v = document.getElementById("header-actions-edit");
            y.style.display = "none";
            v.style.display = "flex";
            v.style.setProperty("display", "flex", "important");
            v.classList.remove("u-hidden");
            u.classList.add("show-props");
            const w = i.type === "text" ? (i.text || "").replace(/§[0-9a-fk-or]/gi, "").trim() : "";
            if (i.type === "text" && w !== "") {
                u.classList.add("collapse-tracks");
            } else {
                u.classList.remove("collapse-tracks");
            }
            if (i.type !== "text") {
                m.classList.add("hidden");
                m.classList.add("two-cols");
                p.forEach(e => e.classList.remove("active"));
                document.getElementById("prop-view-text").classList.add("active");
                const e = document.getElementById("menu-item-blocks");
                if (e) {
                    e.style.display = "none";
                }
                const t = document.getElementById("menu-item-text-label");
                if (t) {
                    t.textContent = "空行设置";
                }
                const n = document.getElementById("prop-view-text-title");
                if (n) {
                    n.textContent = "空行设置";
                }
            } else {
                m.classList.remove("hidden");
                m.classList.remove("two-cols");
                p.forEach(e => e.classList.remove("active"));
                const e = document.getElementById("menu-item-blocks");
                if (e) {
                    e.style.display = "flex";
                }
                const t = document.getElementById("menu-item-text-label");
                if (t) {
                    t.textContent = "编辑文字";
                }
                const n = document.getElementById("prop-view-text-title");
                if (n) {
                    n.textContent = "编辑文字";
                }
            }
            a();
        },
        closePropSheet: s,
        updateQuickBarState: a,
        insertVariable: function(e) {
            const t = document.getElementById("prop-text-input");
            if (t.contentEditable === "false") {
                return;
            }
            let n = "";
            if (e === "selector") {
                const e = "";
                n = `<span class="var-block x-tag x-tag-selector u-cursor-pointer" contenteditable="false" data-type="selector" data-val="${e}" data-ui-action="open-sidebar-editor" data-ui-arg="selector|${e}">实体选择器</span>`;
            } else if (e === "score") {
                const e = "";
                const t = "";
                n = `<span class="var-block x-tag x-tag-score u-cursor-pointer" contenteditable="false" data-type="score" data-name="${e}" data-obj="${t}" data-ui-action="open-sidebar-editor" data-ui-arg="score|${e},${t}">计分板分数</span>`;
            }
            if (t.innerHTML === "<br>" || t.innerHTML.trim() === "") {
                t.innerHTML = n;
            } else {
                t.innerHTML += n;
            }
            t.dispatchEvent(new Event("input"));
            const i = document.getElementById("layer-prop-panel");
            if (i) {
                i.scrollLeft = 0;
                i.scrollTop = 0;
            }
            document.getElementById("prop-main-menu").classList.add("hidden");
            document.querySelectorAll(".prop-sub-view").forEach(e => e.classList.remove("active"));
            document.getElementById("prop-view-applied-blocks").classList.add("active");
            c();
        },
        insertDynamicBlock: function(t) {
            const n = document.getElementById("prop-text-input");
            if (n.contentEditable === "false") {
                return;
            }
            let i = "";
            const o = l();
            if (t === "marquee") {
                e.dynamicBlocks[o] = {
                    type: "marquee",
                    scoreName: "",
                    ticksPerFrame: 5,
                    frames: []
                };
                i = `<span class="var-block x-tag x-tag-marquee u-cursor-pointer" contenteditable="false" data-type="marquee" data-id="${o}" data-ui-action="open-sidebar-editor" data-ui-arg="marquee|${o}">循环积木</span>`;
            } else if (t === "state") {
                e.dynamicBlocks[o] = {
                    type: "state",
                    scoreName: "",
                    branches: []
                };
                i = `<span class="var-block x-tag x-tag-state u-cursor-pointer" contenteditable="false" data-type="state" data-id="${o}" data-ui-action="open-sidebar-editor" data-ui-arg="state|${o}">状态机积木</span>&nbsp;`;
            }
            if (n.innerHTML === "<br>" || n.innerHTML.trim() === "") {
                n.innerHTML = i;
            } else {
                n.innerHTML += i;
            }
            n.dispatchEvent(new Event("input"));
            const a = document.getElementById("layer-prop-panel");
            if (a) {
                a.scrollLeft = 0;
                a.scrollTop = 0;
            }
            document.getElementById("prop-main-menu").classList.add("hidden");
            document.querySelectorAll(".prop-sub-view").forEach(e => e.classList.remove("active"));
            document.getElementById("prop-view-applied-blocks").classList.add("active");
            c();
        },
        insertNewLayer: function(t) {
            let n = null;
            const i = l();
            if (t === "text") {
                n = {
                    type: "text",
                    text: "新文本",
                    x: 0
                };
            } else if (t === "var") {
                n = {
                    type: "text",
                    text: "{{score:玩家,金币}}",
                    x: 0
                };
            } else if (t === "dynamic") {
                e.dynamicBlocks[i] = {
                    type: "marquee",
                    scoreName: "",
                    ticksPerFrame: 5,
                    frames: []
                };
                n = {
                    type: "text",
                    text: `{{marquee:${i}}}`,
                    x: 0
                };
            } else if (t === "gap") {
                n = {
                    type: "gap",
                    lines: 1
                };
            } else if (t === "marquee") {
                e.dynamicBlocks[i] = {
                    type: "marquee",
                    scoreName: "",
                    ticksPerFrame: 5,
                    frames: []
                };
                n = {
                    type: "text",
                    text: `{{marquee:${i}}}`,
                    x: 0
                };
            } else if (t === "state") {
                e.dynamicBlocks[i] = {
                    type: "state",
                    scoreName: "",
                    branches: []
                };
                n = {
                    type: "text",
                    text: `{{state:${i}}}`,
                    x: 0
                };
            }
            if (!n) {
                return;
            }
            if (window.App.saveHistory) {
                window.App.saveHistory();
            }
            let o = 0;
            let a = 0;
            const s = document.querySelector(".track-area");
            if (s) {
                const t = (e.timelineScale || 1) * 100;
                a = Math.max(0, Math.round(s.scrollLeft / t * 20));
            }
            if (e.selectedLines.size > 0) {
                const t = Array.from(e.selectedLines)[0];
                const n = e.menuLines[t];
                if (n) {
                    const e = (n.startTick || 0) + (n.durationTicks || 20);
                    o = n.type === "gap" || n.type === "text" && !n.text.trim() ? n.trackIndex : n.trackIndex + 1;
                    a = e;
                } else {
                    e.selectedLines.clear();
                }
            }
            if (e.selectedLines.size === 0) {
                if (e.menuLines.filter(e => e.trackIndex === o).some(e => {
                        const t = e.startTick || 0;
                        const n = t + (e.durationTicks || 20);
                        return Math.max(a, t) < Math.min(a + 20, n);
                    })) {
                    let t = -1;
                    e.menuLines.forEach(e => {
                        if (e.trackIndex > t) {
                            t = e.trackIndex;
                        }
                    });
                    o = t + 1;
                }
            } else {
                let t = 0;
                let n = 0;
                e.menuLines.forEach(e => {
                    const i = (e.startTick || 0) + (e.durationTicks || 20);
                    if (i > n) {
                        n = i;
                        t = e.trackIndex;
                    }
                });
                o = t;
                a = n;
            }
            n.trackIndex = o;
            n.startTick = a;
            n.durationTicks = 20;
            e.menuLines.push(n);
            if (window.App.timeline) {
                window.App.timeline.renderTimeline();
            }
            if (window.App.render) {
                window.App.render.render();
            }
            if (window.App.saveCurrentProject) {
                window.App.saveCurrentProject();
            }
            document.getElementById("editor-add-sheet").classList.remove("active");
            document.getElementById("editor-add-overlay").classList.remove("active");
            document.getElementById("btn-editor-add").classList.remove("u-hidden");
        },
        updatePreviewTestValues: function() {
            const t = document.getElementById("preview-test-selector").value.trim();
            const n = document.getElementById("preview-test-score-obj").value.trim();
            const i = document.getElementById("preview-test-score-val").value.trim();
            e.previewSelectorValues.global = t;
            if (n) {
                e.previewScoreValues[n] = i;
            }
            if (window.App.render) {
                window.App.render.render();
            }
        },
        renderAppliedBlocks: c,
        renderPreviewVarSelect: m,
        togglePreviewVar: p,
        openSidebarEditor: function(t, n) {
            y = t;
            u = n;
            const i = document.querySelector(".prop-sub-view.active");
            if (i && i.id !== "prop-view-dynamic-edit") {
                w = i.id;
            } else if (!i) {
                w = null;
            }
            document.getElementById("prop-main-menu").classList.add("hidden");
            document.querySelectorAll(".prop-sub-view").forEach(e => e.classList.remove("active"));
            document.getElementById("prop-view-dynamic-edit").classList.add("active");
            document.querySelector(".editor-controls").classList.add("show-dynamic-props");
            document.querySelector(".editor-controls").classList.add("show-props");
            document.getElementById("edit-form-marquee").style.display = "none";
            document.getElementById("edit-form-state").style.display = "none";
            document.getElementById("edit-form-selector").style.display = "none";
            document.getElementById("edit-form-score").style.display = "none";
            document.getElementById("btn-dynamic-delete").style.display = "flex";
            document.getElementById("btn-dynamic-copy").style.display = "flex";
            if (!v || v.type !== t && v.type !== "branch") {
                document.getElementById("btn-dynamic-paste").style.display = "none";
            } else {
                document.getElementById("btn-dynamic-paste").style.display = "flex";
            }
            if (t === "marquee") {
                document.getElementById("dynamic-edit-title").innerText = "编辑循环积木";
                document.getElementById("edit-form-marquee").style.display = "flex";
                let t = e.dynamicBlocks[u];
                t ||= {
                    type: "marquee",
                    scoreName: "",
                    ticksPerFrame: 5,
                    frames: []
                };
                document.getElementById("edit-mq-score").value = t.scoreName || "";
                document.getElementById("edit-mq-ticks").value = t.ticksPerFrame || 5;
                document.getElementById("edit-mq-frames-list").innerHTML = "";
                (t.frames || []).forEach(e => {
                    g(e);
                });
            } else if (t === "selector" || t === "score") {
                document.getElementById("dynamic-edit-title").innerText = t === "selector" ? "实体选择器" : "计分板分数";
                if (t === "selector") {
                    document.getElementById("edit-form-selector").style.display = "flex";
                    document.getElementById("edit-selector-val").value = n;
                } else {
                    document.getElementById("edit-form-score").style.display = "flex";
                    const e = n.split(",");
                    document.getElementById("edit-score-name").value = e[0] || "";
                    document.getElementById("edit-score-obj").value = e[1] || "";
                }
            } else if (t === "state") {
                document.getElementById("dynamic-edit-title").innerText = "编辑状态机";
                document.getElementById("edit-form-state").style.display = "flex";
                let t = e.dynamicBlocks[u];
                t ||= {
                    type: "state",
                    scoreName: "",
                    branches: []
                };
                document.getElementById("edit-st-score").value = t.scoreName || "";
                document.getElementById("edit-st-branches").innerHTML = "";
                (t.branches || []).forEach(e => {
                    E(e.name || "", e.selector || "", e.condition || "", e.text || "");
                });
            }
        },
        closeBlockEditor: x,
        saveBlockEditor: h,
        copyDynamicBlock: function() {
            if (!u || !y) {
                return;
            }
            const t = e.dynamicBlocks[u];
            if (!t) {
                return;
            }
            v = JSON.parse(JSON.stringify(t));
            document.getElementById("btn-dynamic-paste").style.display = "flex";
            const n = document.getElementById("toast");
            if (n) {
                n.textContent = "积木已复制！";
                n.style.display = "block";
                setTimeout(() => n.style.opacity = "1", 10);
                setTimeout(() => {
                    n.style.opacity = "0";
                    setTimeout(() => n.style.display = "none", 300);
                }, 2000);
            }
        },
        copyStateBranch: function(e) {
            const t = e.closest(".branch-item");
            if (!t) {
                return;
            }
            const n = t.querySelector(".branch-name").value;
            const i = t.querySelector(".branch-selector").value;
            const o = t.querySelector(".branch-condition").value;
            const a = t.querySelector(".branch-text").value;
            v = {
                type: "branch",
                data: {
                    name: n,
                    selector: i,
                    condition: o,
                    text: a
                }
            };
            document.getElementById("btn-dynamic-paste").style.display = "flex";
            const s = document.getElementById("toast");
            if (s) {
                s.textContent = "分支已复制！";
                s.style.display = "block";
                setTimeout(() => s.style.opacity = "1", 10);
                setTimeout(() => {
                    s.style.opacity = "0";
                    setTimeout(() => s.style.display = "none", 300);
                }, 2000);
            }
        },
        deleteCurrentBlock: function() {
            if (!u || !y) {
                return;
            }
            const e = document.getElementById("prop-text-input");
            if (e.contentEditable === "false") {
                return;
            }
            e.querySelectorAll(".var-block").forEach(e => {
                if (y !== "marquee" && y !== "state" || e.dataset.id !== u) {
                    if (y === "selector" && e.dataset.val === u || y === "score" && `${e.dataset.name},${e.dataset.obj}` === u) {
                        e.remove();
                    }
                } else {
                    e.remove();
                }
            });
            e.dataset.lastValidHtml = e.innerHTML;
            e.dispatchEvent(new Event("input"));
            x();
            const t = document.getElementById("toast");
            if (t) {
                t.textContent = "积木已删除";
                t.style.display = "block";
                setTimeout(() => t.style.opacity = "1", 10);
                setTimeout(() => {
                    t.style.opacity = "0";
                    setTimeout(() => t.style.display = "none", 300);
                }, 2000);
            }
        },
        addStateBranch: E,
        addMarqueeFrame: g,
        pasteDynamicBlockData: function() {
            if (v && u && y) {
                if (v.type === "branch" && y === "state") {
                    const e = v.data;
                    E(e.name, e.selector, e.condition, e.text);
                    h();
                    const t = document.getElementById("toast");
                    if (t) {
                        t.textContent = "分支粘贴成功！";
                        t.style.display = "block";
                        setTimeout(() => t.style.opacity = "1", 10);
                        setTimeout(() => {
                            t.style.opacity = "0";
                            setTimeout(() => t.style.display = "none", 300);
                        }, 2000);
                    }
                    return;
                }
                if (v.type !== y) {
                    const e = document.getElementById("toast");
                    if (e) {
                        e.textContent = "积木类型不匹配，无法粘贴！";
                        e.style.display = "block";
                        setTimeout(() => e.style.opacity = "1", 10);
                        setTimeout(() => {
                            e.style.opacity = "0";
                            setTimeout(() => e.style.display = "none", 300);
                        }, 2000);
                    }
                    return;
                }
                o("替换积木", "是否替换当前积木的数据？", "替换", () => {
                    if (y === "marquee") {
                        document.getElementById("edit-mq-score").value = v.scoreName || "";
                        document.getElementById("edit-mq-ticks").value = v.ticksPerFrame || 5;
                        document.getElementById("edit-mq-frames-list").innerHTML = "";
                        (v.frames || []).forEach(e => {
                            g(e);
                        });
                    } else if (y === "state") {
                        document.getElementById("edit-st-score").value = v.scoreName || "";
                        document.getElementById("edit-st-branches").innerHTML = "";
                        (v.branches || []).forEach(e => {
                            E(e.name || "", e.selector || "", e.condition || "", e.text || "");
                        });
                    }
                    h();
                    const e = document.getElementById("toast");
                    if (e) {
                        e.textContent = "粘贴成功！";
                        e.style.display = "block";
                        setTimeout(() => e.style.opacity = "1", 10);
                        setTimeout(() => {
                            e.style.opacity = "0";
                            setTimeout(() => e.style.display = "none", 300);
                        }, 2000);
                    }
                });
            }
        },
        updateGapLines: function(n) {
            if (t < 0 || !e.menuLines[t]) {
                return;
            }
            let i = parseInt(n) || 0;
            if (i < 0) {
                i = 0;
            }
            e.menuLines[t].lines = i;
            if (window.App.render) {
                window.App.render.render();
            }
            if (window.App.timeline && window.App.timeline.saveSnapshot) {
                window.App.timeline.saveSnapshot();
            }
        },
        toggleEditorSettings: function() {
            const e = document.getElementById("editor-settings-menu");
            if (e) {
                e.classList.toggle("active");
            }
        },
        openExportSheet: function() {
            const t = document.getElementById("btn-editor-add");
            if (t) {
                t.classList.add("u-hidden");
            }
            const n = document.getElementById("export-textarea");
            const i = document.getElementById("export-sheet");
            const o = document.getElementById("export-overlay");
            if (typeof window.__EDITOR_CORE_GENERATE__ == "function") {
                let t = new Set([0]);
                let i = 0;
                e.menuLines.forEach(e => {
                    t.add(e.startTick || 0);
                    t.add((e.startTick || 0) + (e.durationTicks || 20));
                    if (e.trackIndex > i) {
                        i = e.trackIndex;
                    }
                });
                let o = Array.from(t).sort((e, t) => e - t);
                let a = [];
                for (let t = 0; t < o.length - 1; t++) {
                    let n = o[t];
                    let s = o[t + 1] - n;
                    let r = [];
                    for (let t = 0; t <= i; t++) {
                        let i = e.menuLines.find(e => e.trackIndex === t && (e.startTick || 0) <= n && (e.startTick || 0) + (e.durationTicks || 20) > n);
                        if (i) {
                            r.push(i);
                        }
                    }
                    a.push({
                        duration: s,
                        lines: r
                    });
                }
                const s = {
                    frames: a
                };
                const r = window.__EDITOR_CORE_GENERATE__(e, s, "ui_tick", true);
                if (n) {
                    n.value = r;
                }
            } else if (n) {
                n.value = "核心生成模块未加载！";
            }
            if (i) {
                i.classList.add("active");
            }
            if (o) {
                o.classList.add("active");
            }
        }
    };
})();