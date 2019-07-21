class ArticleHandler {
    static load(element) {
        let elements = element.querySelectorAll(".article_view_url");
        elements.forEach((element) => {
            let loadingElementWrapper = document.createElement("div");
            loadingElementWrapper.className = "lds-dual-ring-wrapper";
            let loadingElement = document.createElement("div");
            loadingElement.className = "lds-dual-ring";
            loadingElementWrapper.appendChild(loadingElement);
            element.parentNode.appendChild(loadingElementWrapper);

            let request = new RequestBuilder(element.href);

            request.withCallback((data) => {
                data.json().then(function (json) {
                    let view = document.createElement("div");
                    view.className = "entry-content";
                    view.innerHTML = json.content;
                    loadingElementWrapper.remove();
                    element.parentNode.appendChild(view);
                    element.remove();
                });
            });

            request.execute();
        });
    }

    static swapTitleLinks() {
        document.querySelectorAll(".item-title a").forEach((element) => {
            if (typeof(element.dataset.altUrl) == "undefined") {
                return;
            }
            var tmpUrl = element.dataset.altUrl;
            element.dataset.altUrl = element.href;
            element.href = tmpUrl;
        });
    }
}
