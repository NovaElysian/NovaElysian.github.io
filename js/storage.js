window.App.storage = {
    STORAGE_KEY: "titleraw_projects",
    getAllProjects: function() {
        try {
            const t = localStorage.getItem(this.STORAGE_KEY);
            if (t) {
                return JSON.parse(t);
            } else {
                return [];
            }
        } catch (t) {
            console.error("读取项目列表失败", t);
            return [];
        }
    },
    saveProject: function(t) {
        try {
            let e = this.getAllProjects();
            const r = e.findIndex(e => e.id === t.id);
            t.updatedAt = Date.now();
            if (r >= 0) {
                e[r] = t;
            } else {
                e.unshift(t);
            }
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(e));
        } catch (t) {
            console.error("保存项目失败", t);
            alert("保存失败，可能是存储空间已满");
        }
    },
    getProject: function(t) {
        return this.getAllProjects().find(e => e.id === t);
    },
    deleteProject: function(t) {
        let e = this.getAllProjects();
        e = e.filter(e => e.id !== t);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(e));
    },
    createNewProject: function() {
        return {
            id: "proj_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
            name: "未命名项目 " + new Date().toLocaleTimeString(),
            updatedAt: Date.now(),
            frames: [{
                id: "frame_" + Date.now(),
                lines: []
            }],
            settings: {
                bgColor: "#2c3e30",
                gridColor: "#3a5442",
                gridSize: 8,
                scaleFactor: 2
            },
            viewState: {
                panX: 0,
                panY: 0,
                scaleFactor: 2,
                timelineScale: 1
            }
        };
    }
};