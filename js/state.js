window.App = window.App || {};
window.App.state = {
    menuLines: [{
        type: "text",
        text: "§l§d通用编辑器 §fMobile",
        x: 0
    }, {
        type: "gap",
        lines: 1
    }, {
        type: "text",
        text: "§e原生级触控排版体验",
        x: 10
    }],
    dynamicBlocks: {},
    varDefs: [],
    activePreviewVars: new Set(),
    previewSelectorValues: {},
    previewScoreValues: {},
    panX: 0,
    panY: 0,
    scaleFactor: 2,
    timelineScale: 1,
    gridSize: 8,
    bgColor: "#2c3e30",
    gridColor: "#3a5442",
    selectedLines: new Set(),
    currentRenderLines: [],
    history: [],
    redoStack: [],
    clipboard: [],
    markers: new Set()
};
window.App.saveHistory = function() {
    const e = window.App.state;
    e.history ||= [];
    e.redoStack ||= [];
    e.history.push(JSON.stringify(e.menuLines));
    if (e.history.length > 50) {
        e.history.shift();
    }
    e.redoStack = [];
    if (window.App.saveCurrentProject) {
        window.App.saveCurrentProject();
    }
};
window.App.undo = function() {
    const e = window.App.state;
    if (e.history && e.history.length > 0) {
        e.redoStack ||= [];
        e.redoStack.push(JSON.stringify(e.menuLines));
        e.menuLines = JSON.parse(e.history.pop());
        e.selectedLines.clear();
        if (window.App.ui && window.App.ui.closePropSheet) {
            window.App.ui.closePropSheet();
        }
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
};
window.App.redo = function() {
    const e = window.App.state;
    if (e.redoStack && e.redoStack.length > 0) {
        e.history ||= [];
        e.history.push(JSON.stringify(e.menuLines));
        e.menuLines = JSON.parse(e.redoStack.pop());
        e.selectedLines.clear();
        if (window.App.ui && window.App.ui.closePropSheet) {
            window.App.ui.closePropSheet();
        }
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
};