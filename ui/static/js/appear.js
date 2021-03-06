/**
 * Trigger event when element appear after scroll
 * Vanilla version of (MIT) https://github.com/morr/jquery.appear/blob/master/index.js
 */
class AppearHandler {
  constructor(selector = "", opts = {}) {
      this.selectors = [
          /* None at the moment */
      ];
      this.checkBinded = false;
      this.checkLock = false;
      this.defaults = {
          interval: 250,
          force_process: false
      };
      this.priorAppeared = [];
      if (selector !== "") {
        this.addSelector(selector, opts);
      }
      this.startMonitorLoop();
  }

  process () {
    this.checkLock = false;


    function isVisible ( element ) {
        return !!( element.offsetWidth || element.offsetHeight || element.getClientRects().length );
    }

    function isAppeared(element) {

        if (!isVisible(element)) {
            return false;
        }

        let windowLeft = window.scrollX;
        let windowTop = window.scrollY;
        let left = element.offsetLeft;
        let top = element.offsetTop;

        let belowTopEdge = top + element.clientHeight >= windowTop;
        let aboveBottomEdge = top  <= windowTop + window.innerHeight;

        let rightAfterLeftEdge = left + element.clientWidth >= windowLeft;
        let leftBeforeRightEdge = left <= windowLeft + window.innerWidth;

        element.dataset.belowTopEdge = belowTopEdge;

        return belowTopEdge && aboveBottomEdge && rightAfterLeftEdge && leftBeforeRightEdge;
    }

    function dispatchAppear(element) {
        element.dispatchEvent(new Event("appear"));
    }

    function dispatchDisapear(element) {
        element.dispatchEvent(new Event("disappear"));
    }
    function arrayIntersect(x, y) {
        return x.filter(e => !y.includes(e));
    }

    for (let index = 0, selectorsLength = this.selectors.length; index < selectorsLength; index++) {
      let appeared = this.selectors[index].filter(isAppeared);

      appeared
        .filter(element => element.dataset._appearTriggered !== "true")
        .map(dispatchAppear);

      if (this.priorAppeared[index]) {
        let disappeared = arrayIntersect(this.priorAppeared[index], appeared);
        disappeared.filter(element => element.dataset._appearTriggered === "true")
            .map(dispatchDisapear);
      }
      this.priorAppeared[index] = appeared;
    }
  }

  addSelector (selector, opts = {}) {
      if (typeof(opts.onappear) === "undefined") {
          opts.onappear = function(e){};
      }
      if (typeof(opts.ondisappear) === "undefined") {
          opts.ondisappear = function(e){};
      }


      let elements = Array.prototype.slice.call(document.querySelectorAll(selector));

      this.priorAppeared.push(elements);
      this.selectors.push(elements);

      elements.map(element => element.addEventListener('appear', function (e) {
          element=e.target;
          element.dataset._appearTriggered = "true";
          opts.onappear(element);
      }));
      elements.map(element => element.addEventListener('disappear', function (e) {
          element=e.target;
          element.dataset._appearTriggered = "false";
          opts.ondisappear(element);
      }));

      this.checkAfterFewSeconds();
  }

  checkAfterFewSeconds() {
      if (this.checkLock) {
          return;
      }
      this.checkLock = true;

      setTimeout(this.process.bind(this), this.defaults.interval);
  }

  startMonitorLoop () {
      if (!this.checkBinded) {
        window.addEventListener('scroll', this.checkAfterFewSeconds.bind(this));
        window.addEventListener('resize', this.checkAfterFewSeconds.bind(this));
        this.checkBinded = true;
      }
    }
}
