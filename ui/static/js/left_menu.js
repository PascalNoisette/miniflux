class LeftMenu {
    static load() {
        let link = document.querySelector(".left_menu a");
        let request = new RequestBuilder(link.href);
        request.options.method = "GET"
        request.withCallback(function (data){
            data.text().then(function (text) {
                document.getElementsByClassName("left_menu")[0].innerHTML = text;
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