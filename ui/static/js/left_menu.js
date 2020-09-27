class LeftMenu {
    static load() {
        let link = document.querySelector(".left_menu a");
        let request = new RequestBuilder(link.href);
        request.options.method = "GET"
        request.withCallback(function (data){
            data.text().then(function (text) {
                document.getElementsByClassName("left_menu")[0].innerHTML = text;
                let dropHandler = new DropHandler();
                dropHandler.listen();
                document.querySelectorAll(".category_foldable").forEach((element) => {
                    element.addEventListener('click', (event) => {
                        let menuCategory = event.target.closest(".menu_category");
                        menuCategory.classList.toggle("category_folded");
                        if (menuCategory.classList.contains("category_folded")) {
                            Cookie.push("folded_categories", menuCategory.querySelector("a").getAttribute('href'));
                        } else {
                            Cookie.filter("folded_categories", menuCategory.querySelector("a").getAttribute('href'));
                        }
                    });
                });
                Cookie.getArray("folded_categories").forEach((href) => {
                    console.log(document.querySelector(".menu_category a[href='" + href + "']"));
                    document.querySelector(".menu_category a[href='" + href + "']").closest(".menu_category").classList.toggle("category_folded");
                });
            });
            if (document.querySelector("body").dataset.leftMenuState === "true") {
                LeftMenu.toggle();
            }
        });
        request.execute();
    }
    static toggle() {
        let menu = document.querySelector("left_menu");
        let main = document.querySelector('main');
        main.classList.toggle("left_menu_main");
        if (!DomHelper.isVisible(menu)) {
            menu.style.display = "block";
            new RequestBuilder(menu.dataset.url + "?status=1").execute();
            if (window.matchMedia("(max-width: 1024px)").matches) {
                main.addEventListener('click', LeftMenu.toggle, false);
            }
        } else {
            menu.style.display = "none";
            new RequestBuilder(menu.dataset.url+ "?status=0").execute();
            main.removeEventListener('click', LeftMenu.toggle, false);
        }
    }
}