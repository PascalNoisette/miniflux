class LeftMenu {
    static load() {
        let link = document.querySelector(".left_menu a");
        let request = new RequestBuilder(link.href);
        request.options.method = "GET"
        request.withCallback(function (data){
            data.text().then(function (text) {
                document.getElementsByClassName("left_menu")[0].innerHTML = text
            });
        });
        request.execute();
    }
    static toggle() {
        let menu = document.querySelector(".left_menu");
        if ( menu.style.width == 0 || menu.style.width == "0px") {
            menu.style.width = "inherit";
        } else {
            menu.style.width = "0px";
        }
    }
}