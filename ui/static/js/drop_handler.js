class DropHandler {

    constructor() {
        this.counter = 0;
    }

    uniqueId() {
        return 'drop-' + this.counter++
    };

    drag(ev) {
        if (ev.target.id == "") {
            ev.target.setAttribute('id', this.uniqueId());
        }
        let feed_id = ev.target.href.match(/feed\/([0-9]+)/)[1];
        let dom_id = ev.target.id;
        ev.dataTransfer.setData("dom_id", dom_id);
        ev.dataTransfer.setData("feed_id", feed_id);
    }

    dragover(ev) {
        ev.preventDefault();
    }

    drop(ev) {
        ev.preventDefault();
        let menu = document.querySelector("left_menu");
        let source_id = ev.dataTransfer.getData("dom_id");
        let feed_id = ev.dataTransfer.getData("feed_id");
        let category_id = ev.target.closest(".menu_category").querySelector("a").href.match(/category\/([0-9]+)/)[1];
        new RequestBuilder(menu.dataset.setfeedcategory + "/feed/" + feed_id + "/category/" + category_id).execute();
        ev.target.closest(".menu_category").appendChild(document.getElementById(source_id).closest(".menu_item"));
    }

    listen() {
        let self = this;

        let menuItem = document.querySelectorAll(".menu_item");
        menuItem.forEach((element) => {
            if (element.getAttribute('draggable'))
                return;
            element.setAttribute('draggable', true);
            element.addEventListener("dragstart", self.drag.bind(self));
        });

        let menuCategory = document.querySelectorAll(".menu_category");
        menuCategory.forEach((element) => {
            if (element.getAttribute('droppable'))
                return;
            element.setAttribute('droppable', true);
            element.addEventListener("dragover", self.dragover.bind(self));
            element.addEventListener("drop", self.drop.bind(self));
        });

    }
    removeListener () {

    }
}
