/**事件处理程序的解绑函数*/
this.removeEvent = function (elem, type, fn) {
    // 获取元素的关联数据
    var data = getData(elem);
    if (!data.handlers) return;

    // 创建一个实用的函数
    var removeType = function (t) {
        data.handlers[t] = [];
        tidyUp(elem, t);
    };

    if (!type) {
        // 删除所有的处理程序
        for (var t in data.handlers) removeType(t);
        return;
    }

    // 查找一个特定的type的所有处理程序
    var handlers = data.handlers[type];
    if (!handlers) return;

    // 删除一个特定的type的所有处理程序
    if (!fn) {
        removeType(type);
        return;
    }

    // 删除一个特定的处理程序
    if (fn.guid) {
        for (var n = 0; n < handlers.length; n++) {
            if (handlers[n].guid === fn.guid) {
                handlers.splice(n--, 1);
            }
        }
    }
    tidyUp(elem, type);
};