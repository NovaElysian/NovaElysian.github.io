(function() {
    window.addEventListener('DOMContentLoaded', () => {
        const backBtn = document.getElementById("btn-editor-back");
        if (!backBtn) return;

        let allowExit = false;

        backBtn.addEventListener("click", (e) => {
            if (allowExit) {
                allowExit = false;
                return;
            }

            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();

            const oldOverlay = document.getElementById("editor-back-overlay");
            if (oldOverlay) {
                dismissOverlay(oldOverlay);
                return;
            }

            const headerBar = backBtn.closest(".editor-header") || backBtn.parentElement;
            const rect = headerBar.getBoundingClientRect();

            const overlay = document.createElement("div");
            overlay.id = "editor-back-overlay";
            overlay.style.cssText = `
                position: fixed;
                top: ${rect.top}px;
                left: ${rect.left}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                display: flex;
                align-items: stretch;
                justify-content: stretch;
                background: #1e293b;
                z-index: 999999;
                box-sizing: border-box;
                transform-origin: left center;
                transform: scaleX(0);
                opacity: 0;
                transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
                overflow: hidden;
            `;

            overlay.innerHTML = `
                <button id="ov-save-return" style="
                    flex: 1; background: #10b981; color: #fff; border: none; border-radius: 0;
                    font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s;
                    border-right: 1px solid rgba(255,255,255,0.15); white-space: nowrap;
                ">保存并返回</button>
                <button id="ov-cancel" style="
                    flex: 1; background: #3b82f6; color: #fff; border: none; border-radius: 0;
                    font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s;
                    white-space: nowrap;
                ">取消</button>
            `;

            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.style.transform = "scaleX(1)";
                overlay.style.opacity = "1";
            });

            function dismissOverlay(targetOverlay, callback) {
                if (!targetOverlay || targetOverlay.dataset.dismissing === "true") return;
                targetOverlay.dataset.dismissing = "true";

                targetOverlay.style.transformOrigin = "right center";
                targetOverlay.style.transform = "scaleX(0)";
                targetOverlay.style.opacity = "0";

                document.removeEventListener("click", onOutsideClick, true);

                setTimeout(() => {
                    if (targetOverlay.parentElement) {
                        targetOverlay.remove();
                    }
                    if (callback) callback();
                }, 250);
            }

            document.getElementById("ov-save-return").addEventListener("click", (ev) => {
                ev.stopPropagation();
                
                if (window.App && window.App.storage && window.App.state && window.App.state.currentProjectId) {
                    const proj = window.App.storage.getProject(window.App.state.currentProjectId);
                    if (proj) {
                        const titleInput = document.querySelector(".editor-title-input");
                        if (titleInput) proj.name = titleInput.value.trim() || proj.name;
                        proj.updatedAt = Date.now();
                        window.App.storage.saveProject(proj);
                    }
                }

                dismissOverlay(overlay, () => {
                    allowExit = true;
                    backBtn.click();
                });
            });

            document.getElementById("ov-cancel").addEventListener("click", (ev) => {
                ev.stopPropagation();
                dismissOverlay(overlay);
            });

            function onOutsideClick(ev) {
                if (!overlay.contains(ev.target) && ev.target !== backBtn) {
                    dismissOverlay(overlay);
                }
            }

            setTimeout(() => {
                document.addEventListener("click", onOutsideClick, true);
            }, 50);

        }, true);
    });
})();