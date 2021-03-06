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
        keyboardHandler.on("Escape", () => ModalHandler.close() & ArticleHandler.escapeKey());
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


    let appearHandler = new AppearHandler();
    appearHandler.addSelector(
        ".item-status-unread",
        {
            "onappear" : function(element){
                if (document.querySelector("body[data-entry-embedded=true]")) {
                    ArticleHandler.load(element);
                }
            }
        }
    );
    appearHandler.addSelector(
        ".item-header",
        {
            "ondisappear" : function(element) {
                if (! document.querySelector("body[data-auto-mark-as-read=true]")) {
                    return;
                }
                let elementWithStatus = element.parentNode.querySelector("a[data-toggle-status]")
                if (elementWithStatus) {
                    let currentStatus = elementWithStatus.dataset.value;
                    if (element.dataset.belowTopEdge === "false" && currentStatus == "unread") {
                        toggleEntryStatus(element.parentNode);
                    }
                }
            }
        }
    );


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


    LeftMenu.load()
    onClick(".show_menu", (event) => LeftMenu.toggle());

    if (document.querySelector("body[data-entry-embedded=true]")) {
        ArticleHandler.load();
    }

    onClick(".toggle-entry-embedded", (event) => {
        ArticleHandler.swapTitleLinks();
        if (document.querySelector("body").dataset.entryEmbedded === "true") {
            document.querySelector("body").dataset.entryEmbedded = "false";
            event.target.innerText = event.target.dataset.entryEmbeddedTextOff;
            event.target.setAttribute("title", event.target.dataset.entryEmbeddedTitleOff);
        } else if (document.querySelector("body").dataset.entryEmbedded === "false") {
            document.querySelector("body").dataset.entryEmbedded = "true";
            event.target.innerText = event.target.dataset.entryEmbeddedTextOn;
            event.target.setAttribute("title", event.target.dataset.entryEmbeddedTitleOn);
        }
        return false;
    });


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
