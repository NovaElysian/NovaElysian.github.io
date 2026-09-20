/**
 * 通用编辑器 - 核心指令生成模块 (editor_core.js)
 *
 * 职责：将编辑器的 projectState（图层数据）与 frames（时间轴分帧）转换为
 *       网易中国版 / 标准基岩版合法的 titleraw actionbar mcfunction 指令文本。
 *
 * 生成指令结构：
 *   # ================= 初始化区域 =================
 *   scoreboard objectives add <计分板> dummy
 *   # ================= 逻辑区域 =================
 *   execute as @a run scoreboard players add @s <计分板> 1
 *   （跑马灯的计分板归零指令也在此区域）
 *   # ================= 动画区域 =================
 *   execute as @a at @s if score @s <计分板> matches <区间> run titleraw @s actionbar {"rawtext":[...]}
 *
 * 对外接口：window.__EDITOR_CORE_GENERATE__(projectState, frames, scoreName, mergeMode)
 *   - projectState: { menuLines: [...], dynamicBlocks: {...}, ... }
 *   - frames:       { frames: [{ duration, lines: [...] }, ...] }（多帧时生效）
 *   - scoreName:    驱动整条动画的计分板名
 *   - mergeMode:    true 时把多帧合并为嵌套 translate（%%N 分段）单条指令
 *
 * 本模块完全离线、无任何外部依赖，可独立加载或内联进单文件 HTML。
 */
window.__EDITOR_CORE_GENERATE__ = function(projectState, frames, scoreName, mergeMode) {
    "use strict";

    const menuLines = projectState.menuLines || [];
    const dynamicBlocks = projectState.dynamicBlocks || {};

    /** 初始化区域命令集合（scoreboard objectives add ...） */
    const initCommands = new Set();
    /** 逻辑区域命令集合（计分板自增 / 归零 / 警告注释） */
    const logicCommands = new Set();

    /**
     * 将选择器数组和文本数组封装为嵌套 translate 结构。
     * 基岩版 translate 的 with 参数最多 8 段（%%1..%%8），
     * 因此每 8 个选择器 + 8 个文本为一组，递归嵌套。
     *
     * @param {Array} selectors 选择器节点数组，如 {selector:"@s[scores={...}]"}
     * @param {Array} texts     与选择器一一对应的文本节点数组，如 {text:"..."}
     * @returns {Object} translate 节点
     */
    function buildChunkedTranslate(selectors, texts) {
        /**
         * @param {number} selStart  当前递归取选择器的起始下标
         * @param {number} textStart 当前递归取文本的起始下标
         */
        function chunk(selStart, textStart) {
            const remainingSelectors = selectors.length - selStart;
            const takeSelectors = Math.min(8, remainingSelectors);
            const takeTexts = Math.min(8, texts.length - textStart);
            const selSlice = selectors.slice(selStart, selStart + takeSelectors);
            const textSlice = texts.slice(textStart, textStart + takeTexts);

            const rawtext = [];
            rawtext.push(...selSlice);
            rawtext.push(...textSlice);
            if (remainingSelectors > 8) {
                rawtext.push(chunk(selStart + takeSelectors, textStart + takeTexts));
            }
            return {
                translate: "%%" + (selSlice.length + 1),
                with: {
                    rawtext: rawtext
                }
            };
        }
        return chunk(0, 0);
    }

    /**
     * 把时间轴行（text/gap 混合）展开为纯行数组：
     * text 行原样保留，gap 行展开为 N 个空行占位。
     *
     * @param {Array} lines 图层行数组
     * @returns {Array} 展开后的行数组
     */
    function expandLines(lines) {
        const expanded = [];
        for (const line of lines) {
            if (line.type === "text") {
                expanded.push(line);
            } else if (line.type === "gap") {
                for (let i = 0; i < line.lines; i++) {
                    expanded.push({
                        type: "empty",
                        text: "",
                        x: 0
                    });
                }
            }
        }
        return expanded;
    }

    /**
     * 把展开后的行数组转换为 rawtext 节点数组：
     * 1. 以最左侧非空文本行的 x 为基准做水平对齐（前置空格）；
     * 2. 按行拼接后解析 {{selector:...}} / {{score:...}} / {{marquee:...}} / {{state:...}}
     *    占位符，替换为对应的 rawtext 节点（含动态积木的展开）。
     *
     * @param {Array} lines expandLines 之后的行数组
     * @returns {Array} rawtext 节点数组
     */
    function buildRawtextArr(lines) {
        // 以最左侧非空文本行为基准，保证相对偏移对齐
        let minX = Infinity;
        for (const line of lines) {
            if (line.type === "text" && line.text.trim() !== "" && line.x < minX) {
                minX = line.x;
            }
        }
        if (minX === Infinity) {
            minX = 0;
        }

        // 合并为单个字符串，行之间用 \n 连接（基岩版 actionbar 支持 \n 换行）
        const merged = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].type === "text") {
                const padding = Math.max(0, lines[i].x - minX);
                merged.push(" ".repeat(padding) + lines[i].text);
            } else {
                merged.push("");
            }
        }
        let full = merged.join("\n");
        if (full.endsWith("\n")) {
            full += "§r"; // 末尾以换行结束时补 §r 防止空行丢失
        }

        const nodes = [];
        const placeholderRe = /\{\{selector:(.*?)\}\}|\{\{score:(.*?),(.*?)\}\}|\{\{marquee:(.*?)\}\}|\{\{state:(.*?)\}\}/g;
        let lastIndex = 0;
        let match;
        while ((match = placeholderRe.exec(full)) !== null) {
            if (match.index > lastIndex) {
                nodes.push({
                    text: full.substring(lastIndex, match.index)
                });
            }

            if (match[1] !== undefined) {
                // {{selector:...}} → 实体选择器变量
                nodes.push({
                    selector: match[1]
                });
            } else if (match[2] !== undefined && match[3] !== undefined) {
                // {{score:name,obj}} → 计分板分数变量
                nodes.push({
                    score: {
                        name: match[2],
                        objective: match[3]
                    }
                });
            } else if (match[4] !== undefined) {
                // {{marquee:id}} → 跑马灯循环积木：每个选择器负责一段分数区间的帧显示
                const blockId = match[4];
                const block = dynamicBlocks[blockId];
                if (block && block.frames && block.frames.length > 0) {
                    const frameCount = block.frames.length;
                    const selectors = [];
                    const texts = [];
                    for (let f = 1; f <= frameCount; f++) {
                        selectors.push({
                            selector: "@s[scores={" + block.scoreName + "=.." + f * block.ticksPerFrame + "}]"
                        });
                    }
                    block.frames.forEach(frameText => texts.push({
                        text: frameText
                    }));
                    nodes.push(buildChunkedTranslate(selectors, texts));

                    initCommands.add("scoreboard objectives add " + block.scoreName + " dummy");
                    logicCommands.add("execute as @a run scoreboard players add @s " + block.scoreName + " 1");
                    const totalTicks = frameCount * block.ticksPerFrame;
                    logicCommands.add("execute as @a[scores={" + block.scoreName + "=" + (totalTicks + 1) + "..}] run scoreboard players set @s " + block.scoreName + " 1");
                }
            } else if (match[5] !== undefined) {
                // {{state:id}} → 状态机积木：每个分支一个条件选择器（首分支为默认显示）
                const blockId = match[5];
                const block = dynamicBlocks[blockId];
                if (block && block.branches && block.branches.length > 0) {
                    const branchCount = block.branches.length;
                    const selectors = [];
                    const texts = [];
                    for (let b = 1; b < branchCount; b++) {
                        const branch = block.branches[b];
                        const selector = branch.selector || "@s";
                        selectors.push({
                            selector: selector + "[" + branch.condition + "]"
                        });
                    }
                    block.branches.forEach(branch => texts.push({
                        text: branch.text
                    }));
                    nodes.push(buildChunkedTranslate(selectors, texts));
                }
            }

            lastIndex = placeholderRe.lastIndex;
        }
        if (lastIndex < full.length) {
            nodes.push({
                text: full.substring(lastIndex)
            });
        }
        return nodes;
    }

    let animationSection = "";

    if (frames && frames.frames && frames.frames.length > 1 && !mergeMode) {
        // ===== 多帧 · 不合并：每帧一条 execute 指令，按分数区间触发 =====
        initCommands.add("scoreboard objectives add " + scoreName + " dummy");
        let output = "";
        let tick = 1;
        for (let i = 0; i < frames.frames.length; i++) {
            const frame = frames.frames[i];
            const duration = frame.duration || 20;
            const endTick = tick + duration - 1;

            const rawtextArr = buildRawtextArr(expandLines(frame.lines));
            const payload = JSON.stringify({
                rawtext: rawtextArr
            });
            const scoreRange = tick === endTick ? "" + tick : tick + ".." + endTick;
            output += "execute as @a at @s if score @s " + scoreName + " matches " + scoreRange + " run titleraw @s actionbar " + payload + "\n";
            tick += duration;
        }
        animationSection = output;
    } else if (frames && frames.frames && frames.frames.length > 1 && mergeMode) {
        // ===== 多帧 · 合并：公共前后缀提取 + 逐帧选择器嵌套为单条 translate =====
        const frameList = frames.frames;
        initCommands.add("scoreboard objectives add " + scoreName + " dummy");

        let tick = 1;
        const entries = [];
        let hasDynamic = false;
        for (let i = 0; i < frameList.length; i++) {
            const frame = frameList[i];
            const duration = frame.duration || 20;
            const endTick = tick + duration - 1;

            const rawtextArr = buildRawtextArr(expandLines(frame.lines));
            entries.push({
                endTick: endTick,
                rawtextArr: rawtextArr
            });
            tick += duration;
        }

        // 提取所有帧公共的前缀 / 后缀节点（这些节点不需要逐帧选择器）
        let prefixLen = 0;
        let suffixLen = 0;
        const minLen = Math.min(...entries.map(entry => entry.rawtextArr.length));
        for (let i = 0; i < minLen; i++) {
            const ref = JSON.stringify(entries[0].rawtextArr[i]);
            if (!entries.every(entry => JSON.stringify(entry.rawtextArr[i]) === ref)) {
                break;
            }
            prefixLen++;
        }
        for (let i = 1; i <= minLen - prefixLen; i++) {
            const ref = JSON.stringify(entries[0].rawtextArr[entries[0].rawtextArr.length - i]);
            if (!entries.every(entry => JSON.stringify(entry.rawtextArr[entry.rawtextArr.length - i]) === ref)) {
                break;
            }
            suffixLen++;
        }

        const prefixNodes = entries[0].rawtextArr.slice(0, prefixLen);
        const suffixNodes = suffixLen > 0 ? entries[0].rawtextArr.slice(-suffixLen) : [];

        // 中间变化部分：每个帧变成 "满足分数条件的选择器 + 对应内容"
        const middleEntries = entries.map(entry => {
            const middle = entry.rawtextArr.slice(prefixLen, entry.rawtextArr.length - suffixLen);
            let textObj;
            textObj = middle.length === 1 ? middle[0] : middle.length > 1 ? {
                rawtext: middle
            } : {
                text: ""
            };
            if (middle.some(node => node.translate || node.score || node.selector)) {
                hasDynamic = true;
            }
            const selectorObj = {
                selector: "@s[scores={" + scoreName + "=.." + entry.endTick + "}]"
            };
            return {
                selectorObj: selectorObj,
                textObj: textObj
            };
        });

        if (hasDynamic) {
            logicCommands.add("# ⚠️ 警告：合并模式下，帧内包含动态积木（循环积木、状态机等）。");
            logicCommands.add("# 这可能导致 translate 嵌套过于复杂，在游戏内解析时可能会出现索引错乱或报错。");
            logicCommands.add("# 如果游戏内显示异常，请关闭合并模式，使用多条 execute 指令导出。");
        }

        const bodyNodes = [];
        if (prefixNodes.length > 0) {
            bodyNodes.push(...prefixNodes);
        }
        if (middleEntries.some(entry => JSON.stringify(entry.textObj) !== '{"text":""}')) {
            bodyNodes.push(
                buildChunkedTranslate(
                    middleEntries.map(entry => entry.selectorObj),
                    middleEntries.map(entry => entry.textObj)
                )
            );
        }
        if (suffixNodes.length > 0) {
            bodyNodes.push(...suffixNodes);
        }

        const payload = JSON.stringify({
            rawtext: bodyNodes
        });
        const lastTick = tick - 1;
        animationSection = "execute as @a at @s if score @s " + scoreName + " matches 1.." + lastTick + " run titleraw @s actionbar " + payload;
    } else {
        // ===== 单帧 / 静态：只输出一条指令，持续 1..duration =====
        initCommands.add("scoreboard objectives add " + scoreName + " dummy");
        const rawtextArr = buildRawtextArr(expandLines(menuLines));
        const payload = JSON.stringify({
            rawtext: rawtextArr
        });
        const duration = frames && frames.frames && frames.frames.length > 0 && frames.frames[0].duration || 20;
        animationSection = "execute as @a at @s if score @s " + scoreName + " matches 1.." + duration + " run titleraw @s actionbar " + payload;
    }

    // ===== 组装最终 mcfunction 文本 =====
    let output = "";
    if (initCommands.size > 0) {
        output += "# ================= 初始化区域 =================\n";
        output += Array.from(initCommands).join("\n") + "\n\n";
    }
    if (logicCommands.size > 0) {
        output += "# ================= 逻辑区域 =================\n";
        output += Array.from(logicCommands).join("\n") + "\n\n";
    }
    output += "# ================= 动画区域 =================\n";
    output += animationSection;
    return output;
};