(function() {
    window.App = window.App || {};
    const e = window.App.state;
    const t = window.App.font;
    let r;
    let l;
    let o = false;

    function n() {
        if (r) {
            if (!o) {
                o = true;
                requestAnimationFrame(async () => {
                    try {
                        await async function() {
                            const o = e.bgColor;
                            const n = e.gridColor;
                            const s = e.gridSize;
                            const c = e.scaleFactor;
                            let p = 0;
                            const f = document.querySelector(".track-area");
                            if (f) {
                                const t = (e.timelineScale || 1) * 100;
                                p = Math.max(0, Math.round(f.scrollLeft / t * 20));
                            }
                            let d = -1;
                            e.menuLines.forEach(e => {
                                if (e.trackIndex > d) {
                                    d = e.trackIndex;
                                }
                            });
                            let h = [];
                            for (let t = 0; t <= d; t++) {
                                let r = null;
                                let l = -1;
                                let o = false;
                                for (let n = 0; n < e.menuLines.length; n++) {
                                    let a = e.menuLines[n];
                                    if (a.trackIndex === t) {
                                        o = true;
                                        const e = a.startTick || 0;
                                        const t = a.durationTicks || 20;
                                        if (p >= e && p < e + t) {
                                            r = a;
                                            l = n;
                                        }
                                    }
                                }
                                if (!r) {
                                    if (o) {
                                        h.push({
                                            type: "empty",
                                            text: "",
                                            x: 0,
                                            isAutoEmpty: true,
                                            originalIndex: -1
                                        });
                                    }
                                    continue;
                                }
                                let n = r;
                                if (n.type === "text") {
                                    let e = a(n.text).split("\n");
                                    if (e.length > 1) {
                                        for (let t = 0; t < e.length; t++) {
                                            h.push({
                                                ...n,
                                                text: e[t],
                                                originalIndex: l,
                                                isSubLine: true,
                                                subLineIndex: t
                                            });
                                        }
                                    } else {
                                        h.push({
                                            ...n,
                                            originalIndex: l
                                        });
                                    }
                                } else if (n.type === "gap") {
                                    for (let e = 0; e < n.lines; e++) {
                                        h.push({
                                            type: "empty",
                                            text: "",
                                            x: 0,
                                            isAutoEmpty: false,
                                            originalIndex: l
                                        });
                                    }
                                }
                            }
                            while (h.length > 0 && h[h.length - 1].isAutoEmpty) {
                                h.pop();
                            }
                            while (h.length > 0 && h[0].isAutoEmpty) {
                                h.shift();
                            }
                            e.currentRenderLines = h;
                            let u = false;
                            for (let e of h) {
                                if (e.type === "text") {
                                    for (let t = 0; t < e.text.length; t++) {
                                        if (e.text[t] !== "§") {
                                            if (e.text.charCodeAt(t) > 127) {
                                                u = true;
                                                break;
                                            }
                                        } else {
                                            t++;
                                        }
                                    }
                                }
                                if (u) {
                                    break;
                                }
                            }
                            const g = u ? 20 : 16;
                            let x = 0;
                            let m = Infinity;
                            for (let e of h) {
                                if (e.type === "text" && e.text.replace(/§[0-9a-fk-or]/gi, "").trim() !== "" && e.x < m) {
                                    m = e.x;
                                }
                            }
                            if (m === Infinity) {
                                m = 0;
                            }
                            let y = false;
                            let w = [];
                            for (let e of h) {
                                if (e.type === "text") {
                                    w.push(y);
                                    let r = Math.max(0, e.x - m);
                                    let l = a(" ".repeat(r) + e.text);
                                    l = i(l);
                                    if (l.trim() === "") {
                                        continue;
                                    }
                                    let o = l.split("\n");
                                    for (let e of o) {
                                        let r = t.measureTextWidth(e, y);
                                        if (r > x) {
                                            x = r;
                                        }
                                        y = t.getFinalBoldState(e, y);
                                    }
                                } else {
                                    w.push(y);
                                }
                            }
                            const b = x;
                            let S = [];
                            for (let e = 0; e < h.length; e++) {
                                if (h[e].type === "text") {
                                    let t = Math.max(0, h[e].x - m);
                                    let r = " ".repeat(t) + h[e].text;
                                    S.push(i(a(r)));
                                } else {
                                    h[e].type;
                                    S.push("");
                                }
                            }
                            await t.preloadImagesForText(S.join("\n"));
                            const I = 13 + b + 13;
                            const k = 20 + S.length * g + 20;
                            let v = -1;
                            let C = -1;
                            for (let e = 0; e < h.length; e++) {
                                if (!h[e].isAutoEmpty) {
                                    if (v === -1) {
                                        v = e;
                                    }
                                    C = e;
                                }
                            }
                            const A = C >= 0 ? 20 + (C + 1) * g + 20 : 0;
                            const M = I;
                            const L = k;
                            const $ = window.devicePixelRatio || 1;
                            r.width = M * c * $;
                            r.height = L * c * $;
                            r.style.width = M * c + "px";
                            r.style.height = L * c + "px";
                            l.scale($, $);
                            l.imageSmoothingEnabled = false;
                            const V = document.querySelector(".editor-preview");
                            const R = s * c;
                            V.style.backgroundColor = o;
                            V.style.backgroundImage = `\n            linear-gradient(to right, ${n} 1px, transparent 1px),\n            linear-gradient(to bottom, ${n} 1px, transparent 1px)\n        `;
                            V.style.backgroundSize = `${R}px ${R}px`;
                            V.style.backgroundPosition = `calc(50% + ${e.panX}px) calc(50% + ${e.panY}px)`;
                            const E = (M - I) / 2;
                            const F = (L - k) / 2;
                            l.fillStyle = "rgba(0, 0, 0, 0.6)";
                            l.fillRect(E * c, (F + 0) * c, I * c, A * c);
                            let P = [];
                            let T = t.colorMap.f;
                            let q = false;
                            for (let e of S) {
                                let r = [];
                                let l = 0;
                                for (let o = 0; o < e.length; o++) {
                                    if (e[o] === "§" && o + 1 < e.length) {
                                        const r = e[o + 1].toLowerCase();
                                        if (t.colorMap[r]) {
                                            T = t.colorMap[r];
                                            q = false;
                                        } else if (r === "l") {
                                            q = true;
                                        } else if (r === "r") {
                                            T = t.colorMap.f;
                                            q = false;
                                        }
                                        o++;
                                        continue;
                                    }
                                    const n = e[o];
                                    const a = t.getCharWidth(n);
                                    const i = t.getCharOffset(n);
                                    const s = n === " " ? 0 : 2;
                                    r.push({
                                        char: n,
                                        color: T,
                                        bold: q,
                                        width: a,
                                        spacing: s,
                                        offset: i,
                                        x: l
                                    });
                                    l += a + s;
                                    if (q) {
                                        l += 1;
                                    }
                                }
                                P.push({
                                    width: l,
                                    chars: r
                                });
                            }
                            let B = 20 + F;
                            for (let e of P) {
                                let r = 13 + E;
                                for (let o of e.chars) {
                                    if (o.char !== " ") {
                                        let e = o.char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0");
                                        let n = e.substring(0, 2);
                                        let a = parseInt(e.substring(2, 4), 16);
                                        let i = t.loadedImages[n];
                                        let s = r - o.offset;
                                        if (i) {
                                            let e = a % 16 * 16;
                                            let r = Math.floor(a / 16) * 16;
                                            let p = t.getShadowColor(o.color);
                                            let f = t.getCachedTintedGlyph(i, p, e, r, n, a);
                                            l.drawImage(f, 0, 0, 16, 16, (s + 1) * c, (B + 1) * c, c * 16, c * 16);
                                            if (o.bold) {
                                                l.drawImage(f, 0, 0, 16, 16, (s + 2) * c, (B + 1) * c, c * 16, c * 16);
                                            }
                                        } else {
                                            l.fillStyle = "red";
                                            l.fillRect((s + 1) * c, (B + 1) * c, c * 16, c * 16);
                                            console.error(`字符图片未加载: prefix=${n}`);
                                        }
                                    }
                                    r += o.width + o.spacing;
                                    if (o.bold) {
                                        r += 1;
                                    }
                                }
                                B += g;
                            }
                            B = 20 + F;
                            for (let e of P) {
                                let r = 13 + E;
                                for (let o of e.chars) {
                                    if (o.char !== " ") {
                                        let e = o.char.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0");
                                        let n = e.substring(0, 2);
                                        let a = parseInt(e.substring(2, 4), 16);
                                        let i = t.loadedImages[n];
                                        let s = r - o.offset;
                                        if (i) {
                                            let e = a % 16 * 16;
                                            let r = Math.floor(a / 16) * 16;
                                            let p = t.getCachedTintedGlyph(i, o.color, e, r, n, a);
                                            l.drawImage(p, 0, 0, 16, 16, s * c, B * c, c * 16, c * 16);
                                            if (o.bold) {
                                                l.drawImage(p, 0, 0, 16, 16, (s + 1) * c, B * c, c * 16, c * 16);
                                            }
                                        } else {
                                            l.fillStyle = "red";
                                            l.fillRect(s * c, B * c, c * 16, c * 16);
                                        }
                                    }
                                    r += o.width + o.spacing;
                                    if (o.bold) {
                                        r += 1;
                                    }
                                }
                                B += g;
                            }
                            l.lineWidth = c * 2;
                            for (let t = 0; t < h.length; t++) {
                                let r = h[t].originalIndex;
                                if (r !== undefined && r !== -1 && e.selectedLines.has(r)) {
                                    const e = 20 + F + t * g;
                                    l.strokeStyle = "#4CAF50";
                                    l.fillStyle = "rgba(76, 175, 80, 0.2)";
                                    l.setLineDash([c * 4, c * 4]);
                                    l.strokeRect((13 + E - 4) * c, (e - 2) * c, (b + 8) * c, g * c);
                                    l.setLineDash([]);
                                    l.fillRect((13 + E - 4) * c, (e - 2) * c, (b + 8) * c, g * c);
                                }
                            }
                            r.style.transform = `translate(${e.panX}px, ${e.panY}px)`;
                        }();
                    } catch (e) {
                        console.error("Render error:", e);
                    } finally {
                        o = false;
                    }
                });
            }
        }
    }

    function a(t, r = null, l = null, o = null) {
        const n = r || e.dynamicBlocks;
        if (!l) {
            e.varDefs;
        }
        const a = o ? new Set([o]) : e.activePreviewVars;
        let i = t;
        i = i.replace(/\{\{state:(.*?)\}\}/g, (e, t) => {
            const r = n[t];
            if (!r || !r.branches) {
                return "[状态机]";
            }
            const l = r.branches.find(e => a.has(e.name));
            if (l) {
                return l.text;
            } else if (r.branches[0]) {
                return r.branches[0].text;
            } else {
                return "[状态机]";
            }
        });
        i = i.replace(/\{\{marquee:(.*?)\}\}/g, (e, t) => {
            const l = n[t];
            if (!l || !l.frames || l.frames.length === 0) {
                return "[循环积木]";
            }
            if (r) {
                return l.frames[0] || "";
            }
            const o = Math.floor(Date.now() / 50) % (l.frames.length * l.ticksPerFrame);
            const a = Math.floor(o / l.ticksPerFrame);
            return l.frames[a] || "";
        });
        i = i.replace(/\{\{selector:(.*?)\}\}/g, (t, r) => e.previewSelectorValues && e.previewSelectorValues.global ? e.previewSelectorValues.global : e.previewSelectorValues && e.previewSelectorValues[r] ? e.previewSelectorValues[r] : r);
        i = i.replace(/\{\{score:(.*?),(.*?)\}\}/g, (t, r, l) => e.previewScoreValues && e.previewScoreValues[l] ? e.previewScoreValues[l] : `${r}:${l}`);
        return i;
    }

    function i(e) {
        return e || "";
    }
    setInterval(() => {
        if (Object.values(e.dynamicBlocks).some(e => e.type === "marquee")) {
            n();
        }
    }, 50);
    window.App.render = {
        init: function() {
            r = document.getElementById("render-canvas");
            if (r) {
                l = r.getContext("2d");
                n();
            }
        },
        render: n,
        replacePlaceholdersForRender: a
    };
})();