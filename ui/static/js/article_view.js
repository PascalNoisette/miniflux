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
                    ArticleHandler.fold(view, element.dataset.labelSeeLess, element.dataset.labelSeeMore);
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

    static escapeKey() {
        document.querySelector("article[data-_appear-triggered=true] .see-less").click();
    }

    static fold(e, lessLabel, moreLabel) {
        var limit = 400;
        if (e.offsetHeight<=limit) {
            return;
        }
        var rbc, ctrl;
        e.style.maxHeight=limit+"px";
        ctrl = document.createElement("div");
        ctrl.classList.add("see-more");
        ctrl.appendChild( document.createTextNode(moreLabel));
        ctrl.addEventListener("click", function () {
            e.style.maxHeight="inherit";
            ctrl.style.display="none";
            rbc.style.display="";
        });
        rbc = document.createElement("div");
        rbc.classList.add("see-more");
        rbc.classList.add("see-less");
        rbc.appendChild( document.createTextNode(lessLabel));
        rbc.addEventListener("click", function () {
            console.log("//TODO accurate limit = top BoundBox of element up to the bottom of the visible area");
            e.style.maxHeight=limit + "px";
            ctrl.style.display="";
            rbc.style.display="none";
        });
        rbc.style.display="none";
        e.parentNode.insertBefore(ctrl, e.nextSibling);
        e.parentNode.insertBefore(rbc, e.nextSibling);
    }
}
