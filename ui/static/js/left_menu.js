class LeftMenu {
    static load() {
        let link = document.querySelector(".left_menu a");
        let request = new RequestBuilder(link.href);
        request.options.method = "GET"
        request.withCallback(function (data){
            data.text().then(function (text) {
                document.getElementsByClassName("left_menu")[0].innerHTML = text;
            });
        });
        request.execute();
    }
    static toggle() {
        let menu = document.querySelector("left_menu");
        let main = document.querySelector('main');
        main.classList.toggle("left_menu_main");
        if (!DomHelper.isVisible(menu)) {
            menu.style.display = "block";
            main.addEventListener('click', LeftMenu.toggle, false);
        } else {
            menu.style.display = "none";
            main.removeEventListener('click', LeftMenu.toggle, false);
        }
    }
}