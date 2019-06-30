document.addEventListener("DOMContentLoaded", function () {
    handleSubmitButtons();

    if (!document.querySelector("body[data-disable-keyboard-shortcuts=true]")) {
        let keyboardHandler = new KeyboardHandler();
        keyboardHandler.on("g u", () => goToPage("unread"));
        keyboardHandler.on("g b", () => goToPage("starred"));
        keyboardHandler.on("g h", () => goToPage("history"));
        keyboardHandler.on("g f", () => goToFeedOrFeeds());
        keyboardHandler.on("g c", () => goToPage("categories"));
        keyboardHandler.on("g s", () => goToPage("settings"));
        keyboardHandler.on("ArrowLeft", () => goToPrevious());
        keyboardHandler.on("ArrowRight", () => goToNext());
        keyboardHandler.on("k", () => goToPrevious());
        keyboardHandler.on("p", () => goToPrevious());
        keyboardHandler.on("j", () => goToNext());
        keyboardHandler.on("n", () => goToNext());
        keyboardHandler.on("h", () => goToPage("previous"));
        keyboardHandler.on("l", () => goToPage("next"));
        keyboardHandler.on("o", () => openSelectedItem());
        keyboardHandler.on("v", () => openOriginalLink());
        keyboardHandler.on("V", () => openOriginalLink(true));
        keyboardHandler.on("c", () => openCommentLink());
        keyboardHandler.on("C", () => openCommentLink(true));
        keyboardHandler.on("m", () => handleEntryStatus());
        keyboardHandler.on("A", () => markPageAsRead());
        keyboardHandler.on("s", () => handleSaveEntry());
        keyboardHandler.on("d", () => handleFetchOriginalContent());
        keyboardHandler.on("f", () => handleBookmark());
        keyboardHandler.on("R", () => handleRefreshAllFeeds());
        keyboardHandler.on("?", () => showKeyboardShortcuts());
        keyboardHandler.on("#", () => unsubscribeFromFeed());
        keyboardHandler.on("/", (e) => setFocusToSearchInput(e));
        keyboardHandler.on("Escape", () => ModalHandler.close());
        keyboardHandler.listen();
    }

    let touchHandler = new TouchHandler();
    touchHandler.listen();

    onClick("a[data-save-entry]", (event) => handleSaveEntry(event.target));
    onClick("a[data-toggle-bookmark]", (event) => handleBookmark(event.target));
    onClick("a[data-fetch-content-entry]", () => handleFetchOriginalContent());
    onClick("a[data-action=search]", (event) => setFocusToSearchInput(event));
    onClick("a[data-action=markPageAsRead]", () => handleConfirmationMessage(event.target, () => markPageAsRead()));
    onClick("a[data-toggle-status]", (event) => handleEntryStatus(event.target));


    new AppearHandler(
        ".item-status-unread",
        {
            "onappear" : function(element){
                if (document.querySelector("body[data-entry-embedded=true]")) {
                    ArticleHandler.load(element);
                }
            },
            "ondisappear" : function(element) {
                if (! document.querySelector("body[data-auto-mark-as-read=true]")) {
                    return;
                }
                let currentStatus = element.querySelector("a[data-toggle-status]").dataset.value;
                if (element.dataset.belowTopEdge == "false" && currentStatus == "unread") {
                    toggleEntryStatus(element);
                }
            }
        }
    );
    let mouseHandler = new MouseHandler();
    mouseHandler.onClick("a[data-save-entry]", (event) => {
        saveEntry(event.target);
    });

    mouseHandler.onClick("a[data-toggle-bookmark]", (event) => {
        toggleBookmark(event.target);
    });

    mouseHandler.onClick("a[data-toggle-status]", (event) => {
        let currentItem = DomHelper.findParent(event.target, "entry");
        if (! currentItem) {
            currentItem = DomHelper.findParent(event.target, "item");
        }

        if (currentItem) {
            toggleEntryStatus(currentItem);
        }
    });

    mouseHandler.onClick("a[data-fetch-content-entry]", (event) => {
        handleFetchOriginalContent();
    });

    mouseHandler.onClick("a[data-on-click=markPageAsRead]", (event) => {
        navHandler.markPageAsRead(event.target.dataset.showOnlyUnread || false);
    });

    onClick("a[data-confirm]", (event) => handleConfirmationMessage(event.target, (url, redirectURL) => {
        let request = new RequestBuilder(url);

        request.withCallback(() => {
            if (redirectURL) {
                window.location.href = redirectURL;
            } else {
                window.location.reload();
            }
        });

        request.execute();
    }));

    if (document.documentElement.clientWidth < 600) {
        onClick(".logo", () => toggleMainMenu());
        onClick(".header nav li", (event) => onClickMainMenuListItem(event));
    }

    mouseHandler.onClick(".toggle-entry-embedded", (event) => {
        if (document.querySelector("body").dataset.entryEmbedded == "true") {
            document.querySelector("body").dataset.entryEmbedded = "false";
            event.target.innerText = "off";
        } else if (document.querySelector("body").dataset.entryEmbedded == "false") {
            document.querySelector("body").dataset.entryEmbedded = "true";
            event.target.innerText = "on";
        }
        return false;
    });

    LeftMenu.load()
    mouseHandler.onClick(".show_menu", () => LeftMenu.toggle());
    ArticleHandler.load();

    if (document.querySelector("body[data-entry-embedded=true]")) {
        ArticleHandler.load();
    }

    if ("serviceWorker" in navigator) {
        let scriptElement = document.getElementById("service-worker-script");
        if (scriptElement) {
            navigator.serviceWorker.register(scriptElement.src);
        }
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt.
        e.preventDefault();

        let deferredPrompt = e;
        const promptHomeScreen = document.getElementById('prompt-home-screen');
        if (promptHomeScreen) {
            promptHomeScreen.style.display = "block";

            const btnAddToHomeScreen = document.getElementById('btn-add-to-home-screen');
            if (btnAddToHomeScreen) {
                btnAddToHomeScreen.addEventListener('click', (e) => {
                    e.preventDefault();
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then(() => {
                        deferredPrompt = null;
                        promptHomeScreen.style.display = "none";
                    });
                });
            }
        }
    });
});
