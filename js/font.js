(function() {
    let t = {};
    let e = {};
    const o = {};

    function n(e) {
        if (e === " ") {
            return 8;
        }
        const o = t[e];
        if (o && Array.isArray(o)) {
            return o[1];
        } else {
            return 16;
        }
    }

    function r(t) {
        return new Promise(o => {
            if (e[t] === undefined) {
                // 直接从外部独立图片目录按需异步加载（例如 data/fonts/00.png）
                const n = new Image();
                n.onload = () => {
                    e[t] = n;
                    o(n);
                };
                n.onerror = () => {
                    console.error(`未能加载字体纹理文件: data/fonts/${t}.png`);
                    e[t] = null;
                    o(null);
                };
                // 指向外部独立的图片资源路径
                n.src = `data/fonts/${t}.png`;
            } else {
                o(e[t]);
            }
        });
    }
    window.App.font = {
        colorMap: {
            0: "#000000",
            1: "#0000AA",
            2: "#00AA00",
            3: "#00AAAA",
            4: "#AA0000",
            5: "#AA00AA",
            6: "#FFAA00",
            7: "#AAAAAA",
            8: "#555555",
            9: "#5555FF",
            a: "#55FF55",
            b: "#55FFFF",
            c: "#FF5555",
            d: "#FF55FF",
            e: "#FFFF55",
            f: "#FFFFFF",
            g: "#DDD605",
            h: "#E3D4D1",
            i: "#CECACA",
            j: "#443A3B",
            m: "#971607",
            n: "#B4684D",
            p: "#DEB12D",
            q: "#47A036",
            s: "#2CBAA8",
            t: "#21497B",
            u: "#9A5CC6"
        },
        getShadowColor: function(t) {
            let e = Math.floor(parseInt(t.substr(1, 2), 16) / 4);
            let o = Math.floor(parseInt(t.substr(3, 2), 16) / 4);
            let n = Math.floor(parseInt(t.substr(5, 2), 16) / 4);
            return `#${e.toString(16).padStart(2, "0")}${o.toString(16).padStart(2, "0")}${n.toString(16).padStart(2, "0")}`;
        },
        loadWidths: async function() {
            // 宽度表由 data/bedrock_widths.js 异步加载，全局实为 window.bedrockWidths（驼峰）。
            // 本函数可能在宽度表就绪前被提前调用，此时静默等待，由 __fontsLoaded 后的正式调用补齐 t，
            // 不再打印“未能加载”的误导性报错。
            const W = (typeof window != "undefined" && window.bedrockWidths) ||
                      (typeof bedrockWidths != "undefined" ? bedrockWidths : null);
            if (W) { t = W; }
        },
        getCharWidth: n,
        getCharOffset: function(e) {
            if (e === " ") {
                return 0;
            }
            const o = t[e];
            if (o && Array.isArray(o)) {
                return o[0];
            } else {
                return 0;
            }
        },
        getGlyphImage: r,
        preloadImagesForText: async function(t) {
            const e = [];
            for (let o = 0; o < t.length; o++) {
                const n = t.charCodeAt(o);
                if (n === 10 || t[o] === "§") {
                    continue;
                }
                let a = n.toString(16).toUpperCase().padStart(4, "0");
                e.push(r(a.substring(0, 2)));
            }
            await Promise.all(e);
        },
        getCachedTintedGlyph: function(t, e, n, r, a, i) {
            const s = `${a}_${i}_${e}`;
            if (o[s]) {
                return o[s];
            }
            const l = document.createElement("canvas");
            l.width = 16;
            l.height = 16;
            const c = l.getContext("2d");
            c.imageSmoothingEnabled = false;
            c.drawImage(t, n, r, 16, 16, 0, 0, 16, 16);
            if (e.toLowerCase() !== "#ffffff") {
                c.globalCompositeOperation = "source-in";
                c.fillStyle = e;
                c.fillRect(0, 0, 16, 16);
            }
            o[s] = l;
            return l;
        },
        measureTextWidth: function(t, e) {
            let o = 0;
            let r = e;
            for (let e = 0; e < t.length; e++) {
                if (t[e] === "§" && e + 1 < t.length) {
                    const o = t[e + 1].toLowerCase();
                    if (o === "l") {
                        r = true;
                    } else if (o === "r") {
                        r = false;
                    }
                    e++;
                    continue;
                }
                const a = t[e];
                o += n(a) + (a === " " ? 0 : 2);
                if (r) {
                    o += 1;
                }
            }
            return o;
        },
        getFinalBoldState: function(t, e) {
            let o = e;
            for (let e = 0; e < t.length; e++) {
                if (t[e] === "§" && e + 1 < t.length) {
                    const n = t[e + 1].toLowerCase();
                    if (n === "l") {
                        o = true;
                    } else if (n === "r") {
                        o = false;
                    }
                    e++;
                }
            }
            return o;
        },
        get loadedImages() {
            return e;
        }
    };
})();