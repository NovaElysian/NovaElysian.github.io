(function() {
    window.App = window.App || {};
    const e = window.App.state;
    let t = false;
    let n = 0;
    let i = 0;
    let o = 0;
    let r = 0;
    let c = false;
    let d = 0;
    let l = 1;
    let s = false;
    window.App.events = {
        init: function() {
            if (s) {
                return;
            }
            s = true;
            const a = document.getElementById("preview-container");
            if (!a) {
                return;
            }
            a.addEventListener("touchstart", s => {
                c = false;
                if (s.touches.length === 1) {
                    t = true;
                    n = s.touches[0].clientX;
                    i = s.touches[0].clientY;
                    o = n;
                    r = i;
                } else if (s.touches.length === 2) {
                    t = false;
                    const n = s.touches[0].clientX - s.touches[1].clientX;
                    const i = s.touches[0].clientY - s.touches[1].clientY;
                    d = Math.hypot(n, i);
                    l = e.scaleFactor;
                }
            }, {
                passive: false
            });
            a.addEventListener("touchmove", s => {
                if (t && s.touches.length === 1) {
                    s.preventDefault();
                    const t = s.touches[0].clientX;
                    const d = s.touches[0].clientY;
                    if (Math.abs(t - n) > 5 || Math.abs(d - i) > 5) {
                        c = true;
                    }
                    const l = t - o;
                    const a = d - r;
                    e.panX += l;
                    e.panY += a;
                    o = t;
                    r = d;
                    if (window.App.render) {
                        window.App.render.render();
                    }
                } else if (s.touches.length === 2) {
                    s.preventDefault();
                    const t = s.touches[0].clientX - s.touches[1].clientX;
                    const n = s.touches[0].clientY - s.touches[1].clientY;
                    const i = Math.hypot(t, n);
                    if (d > 0) {
                        let t = l * (i / d);
                        e.scaleFactor = Math.max(0.5, Math.min(t, 5));
                        if (window.App.render) {
                            window.App.render.render();
                        }
                    }
                }
            }, {
                passive: false
            });
            let p = 0;
            a.addEventListener("touchend", n => {
                t = false;
                d = 0;
                if (!c && n.changedTouches.length === 1) {
                    const t = new Date().getTime();
                    const i = t - p;
                    if (i < 300 && i > 0) {
                        A(n.changedTouches[0].clientX, n.changedTouches[0].clientY);
                        p = 0;
                    } else {
                        e.selectedLines.clear();
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                        if (window.App.render) {
                            window.App.render.render();
                        }
                        if (window.App.ui) {
                            window.App.ui.closePropSheet();
                        }
                        p = t;
                    }
                }
            });
            a.addEventListener("touchcancel", () => {
                t = false;
                d = 0;
            });
            let w = false;
            let u = 0;
            let m = 0;
            a.addEventListener("mousedown", e => {
                w = true;
                c = false;
                u = e.clientX;
                m = e.clientY;
                o = e.clientX;
                r = e.clientY;
            });
            a.addEventListener("mousemove", t => {
                if (w) {
                    t.preventDefault();
                    if (Math.abs(t.clientX - u) > 5 || Math.abs(t.clientY - m) > 5) {
                        c = true;
                    }
                    const n = t.clientX - o;
                    const i = t.clientY - r;
                    e.panX += n;
                    e.panY += i;
                    o = t.clientX;
                    r = t.clientY;
                    if (window.App.render) {
                        window.App.render.render();
                    }
                }
            });
            let h = 0;

            function A(t, n) {
                const i = document.getElementById("render-canvas");
                if (!i || !e.currentRenderLines) {
                    return;
                }
                const o = i.getBoundingClientRect();
                o.left;
                e.scaleFactor;
                const r = (n - o.top) / e.scaleFactor;
                let c = false;
                for (let t of e.currentRenderLines) {
                    if (t.type === "text") {
                        for (let e = 0; e < t.text.length; e++) {
                            if (t.text[e] !== "§") {
                                if (t.text.charCodeAt(e) > 127) {
                                    c = true;
                                    break;
                                }
                            } else {
                                e++;
                            }
                        }
                    }
                    if (c) {
                        break;
                    }
                }
                const d = c ? 20 : 16;
                for (let t = 0; t < e.currentRenderLines.length; t++) {
                    const n = e.currentRenderLines[t];
                    const i = 20 + t * d;
                    if (r >= i - 4 && r <= i + d + 4) {
                        const t = n.originalIndex;
                        if (t !== undefined && t >= 0) {
                            const n = e.menuLines[t];
                            if (n && n.type === "text" && (e.selectedLines.clear(), e.selectedLines.add(t), window.App.timeline && window.App.timeline.renderTimeline(), window.App.render && window.App.render.render(), window.App.ui)) {
                                window.App.ui.openPropSheet(t);
                                const e = n.text.match(/\{\{marquee:(.*?)\}\}/);
                                const i = n.text.match(/\{\{state:(.*?)\}\}/);
                                const o = n.text.match(/\{\{selector:(.*?)\}\}/);
                                const r = n.text.match(/\{\{score:(.*?),(.*?)\}\}/);
                                if (e) {
                                    window.App.ui.openSidebarEditor("marquee", e[1]);
                                } else if (i) {
                                    window.App.ui.openSidebarEditor("state", i[1]);
                                } else if (o) {
                                    window.App.ui.openSidebarEditor("selector", o[1]);
                                } else if (r) {
                                    window.App.ui.openSidebarEditor("score", `${r[1]}:${r[2]}`);
                                }
                            }
                        }
                        break;
                    }
                }
            }
            a.addEventListener("mouseup", t => {
                w = false;
                if (!c) {
                    const n = new Date().getTime();
                    const i = n - h;
                    if (i < 300 && i > 0) {
                        A(t.clientX, t.clientY);
                        h = 0;
                    } else {
                        e.selectedLines.clear();
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                        if (window.App.render) {
                            window.App.render.render();
                        }
                        if (window.App.ui) {
                            window.App.ui.closePropSheet();
                        }
                        h = n;
                    }
                }
            });
            a.addEventListener("mouseleave", () => {
                w = false;
            });
            a.addEventListener("wheel", t => {
                if (t.shiftKey) {
                    t.preventDefault();
                    if (t.deltaY < 0) {
                        e.scaleFactor = Math.min(e.scaleFactor + 0.1, 5);
                    } else {
                        e.scaleFactor = Math.max(e.scaleFactor - 0.1, 0.5);
                    }
                    if (window.App.render) {
                        window.App.render.render();
                    }
                }
            });
            const v = document.querySelector(".track-area");
            if (v) {
                let g = 0;
                let L = 1;
                v.addEventListener("touchstart", t => {
                    if (t.touches.length === 2) {
                        const n = t.touches[0].clientX - t.touches[1].clientX;
                        const i = t.touches[0].clientY - t.touches[1].clientY;
                        g = Math.hypot(n, i);
                        L = e.timelineScale || 1;
                    }
                }, {
                    passive: false
                });
                v.addEventListener("touchmove", t => {
                    if (t.touches.length === 2) {
                        t.preventDefault();
                        const n = t.touches[0].clientX - t.touches[1].clientX;
                        const i = t.touches[0].clientY - t.touches[1].clientY;
                        const o = Math.hypot(n, i);
                        if (g > 0) {
                            let t = L * (o / g);
                            e.timelineScale = Math.max(0.2, Math.min(t, 3));
                            if (window.App.timeline) {
                                window.App.timeline.renderTimeline();
                            }
                        }
                    }
                }, {
                    passive: false
                });
                v.addEventListener("touchend", () => {
                    g = 0;
                });
                v.addEventListener("wheel", t => {
                    if (t.shiftKey) {
                        t.preventDefault();
                        if (t.deltaY < 0) {
                            e.timelineScale = Math.min((e.timelineScale || 1) + 0.1, 3);
                        } else {
                            e.timelineScale = Math.max((e.timelineScale || 1) - 0.1, 0.2);
                        }
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                    }
                });
                const E = document.getElementById("playhead-time");
                v.addEventListener("scroll", () => {
                    if (!E) {
                        return;
                    }
                    const t = v.scrollLeft;
                    const n = (e.timelineScale || 1) * 100;
                    const i = Math.max(0, Math.round(t / n * 20));
                    const o = Math.floor(i / 1200);
                    const r = Math.floor(i / 20 % 60);
                    const c = i % 20;
                    E.textContent = `${String(o).padStart(2, "0")}:${String(r).padStart(2, "0")}:${String(c).padStart(2, "0")}`;
                    if (window.App.render) {
                        window.App.render.render();
                    }
                    if (window.App.timeline && !window.App.timeline.isDraggingHandle) {
                        window.App.timeline.updateReorderHandles(i);
                    }
                    if (window.App.ui && window.App.ui.updateQuickBarState) {
                        window.App.ui.updateQuickBarState(i);
                    }
                });
                const y = document.getElementById("btn-play");
                let k = false;
                let S = null;
                let b = 0;
                const x = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polygon points=\"5 3 19 12 5 21 5 3\"></polygon></svg>";
                const M = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"6\" y=\"4\" width=\"4\" height=\"16\"></rect><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\"></rect></svg>";

                function f(t) {
                    if (!k) {
                        return;
                    }
                    const n = t - b;
                    b = t;
                    const i = n / 1000 * ((e.timelineScale || 1) * 100);
                    if (v && (v.scrollLeft += i, v.scrollLeft >= v.scrollWidth - v.clientWidth - 1)) {
                        k = false;
                        y.innerHTML = x;
                        return;
                    }
                    S = requestAnimationFrame(f);
                }
                if (y) {
                    y.addEventListener("click", () => {
                        if (k) {
                            k = false;
                            cancelAnimationFrame(S);
                            y.innerHTML = x;
                        } else {
                            if (v && v.scrollLeft >= v.scrollWidth - v.clientWidth - 1) {
                                v.scrollLeft = 0;
                            }
                            k = true;
                            y.innerHTML = M;
                            S = requestAnimationFrame(e => {
                                b = e;
                                f(e);
                            });
                        }
                    });
                }
                const T = document.getElementById("btn-undo");
                const Y = document.getElementById("btn-redo");
                const B = document.getElementById("btn-go-start");
                const I = document.getElementById("btn-go-end");
                const X = document.getElementById("btn-copy-menu");
                const F = document.getElementById("copy-dropdown");
                const D = document.getElementById("btn-select-all");
                const C = document.getElementById("btn-copy");
                const H = document.getElementById("btn-paste");
                const R = document.getElementById("btn-marker");
                if (T) {
                    T.addEventListener("click", () => {
                        if (window.App.undo) {
                            window.App.undo();
                        }
                    });
                }
                if (Y) {
                    Y.addEventListener("click", () => {
                        if (window.App.redo) {
                            window.App.redo();
                        }
                    });
                }
                if (B) {
                    B.addEventListener("click", () => {
                        if (v) {
                            v.scrollLeft = 0;
                        }
                    });
                }
                if (I) {
                    I.addEventListener("click", () => {
                        if (v) {
                            let t = 0;
                            e.menuLines.forEach(e => {
                                const n = (e.startTick || 0) + (e.durationTicks || 20);
                                if (n > t) {
                                    t = n;
                                }
                            });
                            const n = (e.timelineScale || 1) * 100;
                            v.scrollLeft = t / 20 * n;
                        }
                    });
                }
                if (X) {
                    X.addEventListener("click", e => {
                        if (!e.target.closest(".dropdown-item")) {
                            F.classList.toggle("active");
                        }
                    });
                }
                document.addEventListener("click", e => {
                    if (X && !X.contains(e.target)) {
                        F.classList.remove("active");
                    }
                });
                if (D) {
                    D.addEventListener("click", () => {
                        e.selectedLines.clear();
                        e.menuLines.forEach((t, n) => e.selectedLines.add(n));
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                        if (window.App.render) {
                            window.App.render.render();
                        }
                        F.classList.remove("active");
                    });
                }
                if (C) {
                    C.addEventListener("click", () => {
                        e.clipboard = [];
                        e.selectedLines.forEach(t => {
                            e.clipboard.push(JSON.parse(JSON.stringify(e.menuLines[t])));
                        });
                        F.classList.remove("active");
                        const t = document.getElementById("toast");
                        if (t) {
                            t.textContent = `已复制 ${e.clipboard.length} 个图层`;
                            t.style.display = "block";
                            setTimeout(() => t.style.opacity = "1", 10);
                            setTimeout(() => {
                                t.style.opacity = "0";
                                setTimeout(() => t.style.display = "none", 300);
                            }, 2000);
                        }
                    });
                }
                if (H) {
                    H.addEventListener("click", () => {
                        if (!e.clipboard || e.clipboard.length === 0) {
                            F.classList.remove("active");
                            return;
                        }
                        if (window.App.saveHistory) {
                            window.App.saveHistory();
                        }
                        const t = (e.timelineScale || 1) * 100;
                        const n = Math.max(0, Math.round(v.scrollLeft / t * 20));
                        let i = Infinity;
                        e.clipboard.forEach(e => {
                            if ((e.startTick || 0) < i) {
                                i = e.startTick || 0;
                            }
                        });
                        let o = -1;
                        e.menuLines.forEach(e => {
                            if (e.trackIndex > o) {
                                o = e.trackIndex;
                            }
                        });
                        e.selectedLines.clear();
                        e.clipboard.forEach(t => {
                            let r = JSON.parse(JSON.stringify(t));
                            r.startTick = n + ((r.startTick || 0) - i);
                            r.trackIndex = o + 1 + (r.trackIndex || 0);
                            e.menuLines.push(r);
                            e.selectedLines.add(e.menuLines.length - 1);
                        });
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                        if (window.App.render) {
                            window.App.render.render();
                        }
                        if (e.clipboard.length === 1 && window.App.ui) {
                            window.App.ui.openPropSheet(e.menuLines.length - 1);
                        }
                        F.classList.remove("active");
                    });
                }
                if (R) {
                    R.addEventListener("click", () => {
                        e.markers ||= new Set();
                        const t = (e.timelineScale || 1) * 100;
                        const n = Math.max(0, Math.round(v.scrollLeft / t * 20));
                        if (e.markers.has(n)) {
                            e.markers.delete(n);
                        } else {
                            e.markers.add(n);
                        }
                        if (window.App.timeline) {
                            window.App.timeline.renderTimeline();
                        }
                    });
                }
            }
        }
    };
})();