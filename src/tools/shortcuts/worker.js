// eslint-disable-next-line
async function shortcutsWorker() {
    const refresh = (content) => {
        App.setSectionViewProp("shortcuts", "html", content);

        const list = document.getElementById("dddot-shortcuts-list");
        if (list === null) {
            return;
        }

        const sortable = Sortable.create(list, {
            ghostClass: "dddot-sortable-ghost",
            dataIdAttr: "dddot-note-id",
            onEnd: () => {
                const noteIds = sortable.toArray();
                DDDot.postMessage({
                    type: "shortcuts.onOrderChanged",
                    noteIds,
                });
            },
        });
    };

    DDDot.onNoteDropped("#dddot-shortcuts-tool-container", async (noteId) => {
        const response = await DDDot.postMessage({
            type: "shortcuts.onNoteDropped",
            noteId,
            index: 0,
        });
        refresh(response);
    });

    DDDot.onFolderDropped("#dddot-shortcuts-tool-container", async (folderId) => {
        const response = await DDDot.postMessage({
            type: "shortcuts.tool.pushFolder",
            folderId,
            index: 0,
        });
        refresh(response);
    });

    DDDot.onMessage("shortcuts.refresh", (message) => {
        refresh(message.html);
    });

    const response = await DDDot.postMessage({ type: "shortcuts.onReady" });
    refresh(response);
}
