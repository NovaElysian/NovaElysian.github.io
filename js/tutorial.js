(function() {
    window.App = window.App || {};
    const t = [{
        id: "quick-create",
        title: "创建第一个项目和文本",
        desc: "跟着提示创建项目，再添加第一个普通文本图层。",
        badge: "入门",
        accent: "#18d6c8",
        steps: [{
            title: "点击新建按钮",
            text: "点击底部中间的绿色 + 号，打开新建项目面板。",
            target: "#btn-create .add-btn",
            spotlight: true,
            waitFor: {
                type: "click",
                selector: "#btn-create"
            }
        }, {
            title: "输入项目名称",
            text: "在项目名称输入框里输入“初见”。",
            target: "#new-project-name",
            onEnter: () => {
                const t = document.getElementById("new-project-name");
                if (t) {
                    t.value = "";
                    t.focus();
                }
            },
            waitFor: {
                type: "input-match",
                selector: "#new-project-name",
                match: "初见"
            }
        }, {
            title: "创建项目",
            text: "点击“创建项目”。创建成功后会自动进入编辑器。",
            target: ".btn-submit",
            waitFor: {
                type: "click",
                selector: ".btn-submit"
            }
        }, {
            title: "打开添加面板",
            text: "进入编辑器后，点击右下角的 + 号，打开“添加元素”面板。",
            target: "#btn-editor-add",
            spotlight: true,
            waitFor: {
                type: "click",
                selector: "#btn-editor-add"
            }
        }, {
            title: "选择普通文本",
            text: "在“文本”分类里点击“普通文本”，就会在时间轴里创建一个新的文本图层。",
            target: ".add-item[data-ui-action=\"insert-new-layer\"][data-ui-arg=\"text\"]",
            waitFor: {
                type: "click",
                selector: ".add-item[data-ui-action=\"insert-new-layer\"][data-ui-arg=\"text\"]"
            }
        }, {
            title: "文本创建完成",
            text: "你已经创建了第一个文本图层。接下来可以学习双击文字、修改内容、移动图层和导出指令。",
            target: "#render-canvas",
            waitFor: {
                type: "manual"
            },
            onEnter: () => {
                document.getElementById("editor-add-sheet").classList.remove("active");
                document.getElementById("editor-add-overlay").classList.remove("active");
                document.getElementById("btn-editor-add").style.display = "";
            }
        }]
    }, {
        id: "edit-text-move",
        title: "编辑文字与移动",
        desc: "学习选中图层、编辑文字、使用移动面板微调位置。",
        badge: "基础",
        accent: "#8a6cf0",
        steps: [{
            title: "进入项目列表",
            text: "点击底部导航栏的“项目”按钮，进入项目列表。",
            target: ".app-tabbar .tab-item[data-target=\"view-project\"]",
            waitFor: {
                type: "click",
                selector: ".app-tabbar .tab-item[data-target=\"view-project\"]"
            }
        }, {
            title: "选择初见项目",
            text: "在项目列表中，点击高亮的“初见”项目进入编辑器。",
            target: "#tutorial-target-chujian",
            onEnter: () => {
                setTimeout(() => {
                    const t = document.querySelectorAll(".project-item");
                    let e = null;
                    t.forEach(t => {
                        if (t.dataset.id === c) {
                            t.id = "tutorial-target-chujian";
                            e = t;
                        } else if (t.id === "tutorial-target-chujian") {
                            t.id = "";
                        }
                    });
                    if (e) {
                        e.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }
                    y("#tutorial-target-chujian");
                }, 100);
            },
            waitFor: {
                type: "state",
                check: () => document.getElementById("view-editor").classList.contains("active") && window.App.state.currentProjectId === c
            }
        }, {
            title: "选中图层",
            text: "进入编辑器后，双击画布上的“新文本”图层，选中它并打开属性面板。",
            target: "#render-canvas",
            waitFor: {
                type: "state",
                check: () => window.App && window.App.state && window.App.state.selectedLines && window.App.state.selectedLines.size > 0
            }
        }, {
            title: "编辑文字",
            text: "点击下方“编辑文字”，进入文字编辑界面。",
            target: "#menu-item-text",
            waitFor: {
                type: "click",
                selector: "#menu-item-text"
            }
        }, {
            title: "修改文字",
            text: "在文本框里输入“hello”。",
            target: "#prop-text-input",
            waitFor: {
                type: "input-match",
                selector: "#prop-text-input",
                match: "hello"
            }
        }, {
            title: "回到属性菜单",
            text: "点左上角返回箭头，回到属性菜单。",
            target: "#prop-view-text .btn-prop-back",
            waitFor: {
                type: "state",
                check: () => !document.getElementById("prop-main-menu").classList.contains("hidden")
            }
        }, {
            title: "进入移动和排版",
            text: "点击“移动和排版”，用触摸板微调 X/Y 位置。",
            target: "#menu-item-move",
            waitFor: {
                type: "click",
                selector: "#menu-item-move"
            }
        }, {
            title: "完成",
            text: "你已经学会文字编辑和移动面板的位置微调。",
            target: "#move-touchpad",
            waitFor: {
                type: "manual"
            }
        }]
    }, {
        id: "export-command",
        title: "导出指令",
        desc: "打开导出面板并一键复制生成好的 titleraw 指令。",
        badge: "必学",
        accent: "#21c88a",
        steps: [{
            title: "进入项目列表",
            text: "点击底部导航栏的“项目”按钮，进入项目列表。",
            target: ".app-tabbar .tab-item[data-target=\"view-project\"]",
            waitFor: {
                type: "click",
                selector: ".app-tabbar .tab-item[data-target=\"view-project\"]"
            }
        }, {
            title: "选择项目",
            text: "在项目列表中，点击高亮的项目进入编辑器。",
            target: "#tutorial-target-export",
            onEnter: () => {
                setTimeout(() => {
                    const t = document.querySelectorAll(".project-item");
                    let e = null;
                    t.forEach(t => {
                        if (t.dataset.id === c) {
                            t.id = "tutorial-target-export";
                            e = t;
                        } else if (t.id === "tutorial-target-export") {
                            t.id = "";
                        }
                    });
                    if (e) {
                        e.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });
                    }
                    y("#tutorial-target-export");
                }, 100);
            },
            waitFor: {
                type: "state",
                check: () => document.getElementById("view-editor").classList.contains("active") && window.App.state.currentProjectId === c
            }
        }, {
            title: "打开导出面板",
            text: "点击右上角导出按钮。",
            target: "#btn-export",
            waitFor: {
                type: "click",
                selector: "#btn-export"
            }
        }, {
            title: "复制指令",
            text: "导出面板已打开，点击“一键复制”把指令复制到剪贴板。",
            target: "#btn-copy-cmd",
            waitFor: {
                type: "click",
                selector: "#btn-copy-cmd"
            }
        }, {
            title: "导出完成",
            text: "现在可以把复制的指令粘贴到命令方块或函数文件里使用。",
            target: "#export-textarea",
            waitFor: {
                type: "manual"
            },
            onEnter: () => {
                document.getElementById("export-sheet").classList.remove("active");
                document.getElementById("export-overlay").classList.remove("active");
            }
        }]
    }, {
        id: "template-load",
        title: "载入模板",
        desc: "从模板页选择一个现成模板，并进入编辑器拆解学习。",
        badge: "模板",
        accent: "#fb7299",
        steps: [{
            title: "进入模板页",
            text: "点击底部“模板”标签。",
            target: ".app-tabbar .tab-item[data-target=\"view-template\"]",
            waitFor: {
                type: "click",
                selector: ".app-tabbar .tab-item[data-target=\"view-template\"]"
            }
        }, {
            title: "选择模板",
            text: "点击任意模板卡片，系统会创建项目并进入编辑器。",
            target: "#templates-grid",
            waitFor: {
                type: "click",
                selector: "#templates-grid .element-card"
            }
        }, {
            title: "模板已载入",
            text: "你可以双击画布或点击时间轴图层，查看它由哪些文字、空行和积木组成。",
            target: "#view-editor",
            waitFor: {
                type: "manual"
            }
        }]
    }];
    let e = null;
    let a = 0;
    let i = null;
    let o = null;
    let r = null;
    let n = null;
    let s = null;
    let l = null;
    let c = null;

    function d() {
        if (!i) {
            i = document.createElement("div");
            i.className = "tutorial-guide-overlay";
            i.innerHTML = "<div class=\"tutorial-guide-dim\"></div><div class=\"tutorial-guide-highlight\"></div><div class=\"tutorial-guide-card\"></div>";
            document.body.appendChild(i);
            o = i.querySelector(".tutorial-guide-highlight");
            r = i.querySelector(".tutorial-guide-card");
        }
    }

    function u() {
        if (n) {
            n();
        }
        n = null;
        if (s) {
            clearInterval(s);
        }
        s = null;
    }

    function p(n) {
        if (n === "edit-text-move") {
            const t = window.App.storage.getAllProjects().sort((t, e) => e.updatedAt - t.updatedAt).find(t => {
                if (t.name !== "初见") {
                    return false;
                }
                if (!t.frames || !t.frames[0] || !t.frames[0].lines) {
                    return false;
                }
                const e = t.frames[0].lines.filter(t => t.type === "text" && t.text.replace(/§[0-9a-fk-or]/gi, "").trim() !== "");
                return e.length === 1 && e[0].text.replace(/§[0-9a-fk-or]/gi, "").trim() === "新文本" && (e[0].startTick === 0 || e[0].startTick === undefined);
            });
            if (!t) {
                d();
                i.classList.add("active");
                o.classList.remove("visible");
                i.classList.remove("spotlight");
                w(null);
                r.innerHTML = "\n                    <div class=\"tutorial-guide-progress\">提示</div>\n                    <h3>缺少前置项目</h3>\n                    <p>请先完成“入门”教程，并保留名为“初见”的初始项目（不要修改或删除里面的文本图层）。</p>\n                    <div class=\"tutorial-guide-actions\">\n                        <button class=\"tutorial-btn primary\" data-tutorial-stop>知道了</button>\n                    </div>\n                ";
                return;
            }
            c = t.id;
        } else if (n === "export-command") {
            const t = window.App.storage.getAllProjects().sort((t, e) => e.updatedAt - t.updatedAt).find(t => !!t.frames && !!t.frames[0] && !!t.frames[0].lines && t.frames[0].lines.filter(t => t.type === "text" && t.text.replace(/§[0-9a-fk-or]/gi, "").trim() !== "").length > 0);
            if (!t) {
                d();
                i.classList.add("active");
                o.classList.remove("visible");
                i.classList.remove("spotlight");
                w(null);
                r.innerHTML = "\n                    <div class=\"tutorial-guide-progress\">提示</div>\n                    <h3>缺少前置项目</h3>\n                    <p>请先完成“入门”教程，并保留名为“初见”的初始项目（不要修改或删除里面的文本图层）。</p>\n                    <div class=\"tutorial-guide-actions\">\n                        <button class=\"tutorial-btn primary\" data-tutorial-stop>知道了</button>\n                    </div>\n                ";
                return;
            }
            c = t.id;
        }
        const s = function(e) {
            return t.find(t => t.id === e);
        }(n);
        if (s) {
            u();
            e = s;
            a = 0;
            d();
            i.classList.add("active");
            v();
        }
    }

    function m() {
        u();
        if (l) {
            clearTimeout(l);
        }
        e = null;
        a = 0;
        if (i) {
            i.classList.remove("active");
        }
    }

    function g() {
        if (e) {
            u();
            a++;
            if (a >= e.steps.length) {
                if (e) {
                    o.classList.remove("visible");
                    i.classList.remove("spotlight");
                    (function() {
                        if (window.App && window.App.saveCurrentProject) {
                            window.App.saveCurrentProject();
                        }
                        const t = document.getElementById("view-editor");
                        if (t) {
                            t.classList.remove("active");
                        }
                        const e = document.querySelector(".app-tabbar .tab-item[data-target=\"view-tutorial\"]");
                        if (e) {
                            e.click();
                            return;
                        }
                        document.querySelectorAll(".app-tabbar .tab-item").forEach(t => t.classList.remove("active"));
                        document.querySelectorAll(".view-section").forEach(t => t.classList.remove("active"));
                        const a = document.querySelector("[data-target=\"view-tutorial\"]");
                        if (a) {
                            a.classList.add("active");
                        }
                        const i = document.getElementById("view-tutorial");
                        if (i) {
                            i.classList.add("active");
                        }
                    })();
                    r.innerHTML = `\n            <div class="tutorial-guide-progress">完成</div>\n            <h3>${e.title}</h3>\n            <p>这个交互教程已经完成，你可以随时回到教程页重新打开。</p>\n            <div class="tutorial-guide-actions">\n                <button class="tutorial-btn ghost" data-tutorial-stop>返回</button>\n                <button class="tutorial-btn primary" data-tutorial-stop>知道了</button>\n            </div>\n        `;
                }
            } else {
                v();
            }
        }
    }

    function v() {
        const t = e.steps[a];
        if (t.onEnter) {
            t.onEnter();
        }
        if (t.spotlight) {
            i.classList.add("spotlight");
        } else {
            i.classList.remove("spotlight");
        }
        r.innerHTML = `\n            <div class="tutorial-guide-progress">${a + 1} / ${e.steps.length}</div>\n            <h3>${t.title}</h3>\n            <p>${t.text}</p>\n            <div class="tutorial-guide-actions">\n                <button class="tutorial-btn ghost" data-tutorial-stop>退出</button>\n                ${t.waitFor && t.waitFor.type === "manual" ? "<button class=\"tutorial-btn primary\" data-tutorial-next>完成这步</button>" : "<span class=\"tutorial-waiting-tip\">完成操作后自动继续</span>"}\n            </div>\n        `;
        y(t.target);
        (function(t) {
            const e = t.waitFor || {
                type: "manual"
            };
            if (e.type !== "manual") {
                if (e.type === "click") {
                    const t = t => {
                        if (t.target.closest(e.selector)) {
                            setTimeout(g, 250);
                        }
                    };
                    document.addEventListener("click", t, true);
                    n = () => document.removeEventListener("click", t, true);
                    return;
                }
                if (e.type === "input" || e.type === "input-not-empty" || e.type === "input-match") {
                    const t = t => {
                        const a = t.target.closest(e.selector);
                        if (!a) {
                            return;
                        }
                        const i = String(a.value || a.textContent || "").trim();
                        if (e.type !== "input-not-empty" || i) {
                            if (e.type !== "input-match" || i === e.match) {
                                setTimeout(g, 150);
                            }
                        }
                    };
                    document.addEventListener("input", t, true);
                    n = () => document.removeEventListener("input", t, true);
                    return;
                }
                if (e.type === "state" && typeof e.check == "function") {
                    s = setInterval(() => {
                        try {
                            if (e.check()) {
                                g();
                            }
                        } catch (t) {}
                    }, 300);
                }
            }
        })(t);
    }

    function y(t) {
        if (l) {
            clearTimeout(l);
        }
        if (!t || !document.querySelector(t)) {
            o.classList.remove("visible");
            w(null);
            return;
        }

        function e() {
            const e = document.querySelector(t);
            if (!e) {
                return;
            }
            const a = e.getBoundingClientRect();
            if (t === "#btn-create .add-btn" || t === "#btn-editor-add") {
                o.style.left = a.left - 4 + "px";
                o.style.top = a.top - 4 + "px";
                o.style.width = `${a.width + 8}px`;
                o.style.height = `${a.height + 8}px`;
                o.style.borderRadius = "50%";
            } else {
                o.style.left = `${Math.max(8, a.left - 6)}px`;
                o.style.top = `${Math.max(8, a.top - 6)}px`;
                o.style.width = `${Math.max(24, a.width + 12)}px`;
                o.style.height = `${Math.max(24, a.height + 12)}px`;
                o.style.borderRadius = "16px";
            }
            w(a);
        }
        o.classList.add("visible");
        e();
        l = setTimeout(e, 350);
    }

    function w(t) {
        if (!r) {
            return;
        }
        const e = window.innerWidth;
        const a = window.innerHeight;
        const i = Math.min(420, e - 32);
        r.style.width = `${i}px`;
        r.style.left = `${Math.max(16, (e - i) / 2)}px`;
        r.style.right = "auto";
        r.style.top = "auto";
        r.style.bottom = "auto";
        const o = r.offsetHeight || 160;
        if (!t) {
            r.style.bottom = "calc(24px + env(safe-area-inset-bottom))";
            return;
        }
        const n = a - t.bottom;
        let s;
        s = t.top >= o + 48 ? t.top - o - 24 : n >= o + 48 ? t.bottom + 24 : 24;
        s = Math.max(24, Math.min(s, a - o - 24));
        r.style.top = `${s}px`;
    }

    function b(t) {
        if (!e) {
            return;
        }
        const i = e.steps[a];
        if (i) {
            if (i.target) {
                const e = document.querySelector(i.target);
                if (e && (e.contains(t.target) || e === t.target)) {
                    return;
                }
            }
            if (i.waitFor && i.waitFor.selector) {
                const e = document.querySelector(i.waitFor.selector);
                if (e && (e.contains(t.target) || e === t.target)) {
                    return;
                }
            }
            if (!r || !r.contains(t.target) && r !== t.target) {
                t.stopPropagation();
                t.preventDefault();
            }
        }
    }

    function h() {
        const e = document.getElementById("tutorial-grid");
        if (e) {
            e.innerHTML = t.map(t => `\n            <button class="interactive-tutorial-card" data-tutorial-id="${t.id}" style="--tutorial-accent:${t.accent}">\n                <span class="tutorial-card-badge">${t.badge}</span>\n                <strong>${t.title}</strong>\n                <small>${t.desc}</small>\n                <span class="tutorial-card-start">开始交互教程 →</span>\n            </button>\n        `).join("");
        }
    }
    document.addEventListener("click", b, true);
    document.addEventListener("mousedown", b, true);
    document.addEventListener("touchstart", b, true, {
        passive: false
    });
    document.addEventListener("pointerdown", b, true);
    document.addEventListener("click", t => {
        const e = t.target.closest("[data-tutorial-id]");
        if (e) {
            t.preventDefault();
            p(e.dataset.tutorialId);
            return;
        } else if (t.target.closest("[data-tutorial-stop]")) {
            t.preventDefault();
            m();
            return;
        } else {
            if (t.target.closest("[data-tutorial-next]")) {
                t.preventDefault();
                g();
            }
            return;
        }
    });
    window.addEventListener("resize", () => {
        if (!e) {
            return;
        }
        const t = e.steps[a];
        if (t) {
            y(t.target);
        }
    });
    document.addEventListener("DOMContentLoaded", h);
    window.App.tutorial = {
        tutorials: t,
        start: p,
        stop: m,
        renderCards: h
    };
})();