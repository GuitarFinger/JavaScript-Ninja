/**测试事件绑定API*/
addEvent(window, "load", function () {
    var elems = document.getElementsByTagName("div");
    for (var i = 0; i < elems.length; i++) {
        (function (elem) {
            var handler = addEvent(elem, "click", function () {
                this.style.backgroundColor == '' ? 'green' : '';
                removeEvent(elem, "click", handler);
            })
        })(elems[i]);
    }
})