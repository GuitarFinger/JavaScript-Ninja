/**清除处理程序*/
function tidyUp(elem, type) {
    // 空对象判断
    function isEmpty(object) {
        for (var prop in object) {
            return false;
        }
        return true;
    }

    var data = getData(elem);
    // 检测某一事件类型的处理程序
    if (data.handlers[type].length === 0) {

        delete data.handlers[type];

        if (document.removeEventListener) {
            elem.removeEventListener(type, data.dispatcher, false);
        }
        else if (document.detachEvent) {
            elem.detachEvent("on" + type, data.dispatcher);
        }
    }
    // 判断是否还有其它事件类型的处理程序
    if (isEmpty(data.handlers)) {
        delete data.handlers;
        delete data.dispatcher;
    }
    // 判断是否需要data(即数据是否为空)
    if (isEmpty(data)) {
        removeData(elem);
    }
}