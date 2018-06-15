/**事件处理程序*/
(function () {
    var nextGuid = 1;
    this.addEvent = function (elem, type, fn) {
        // 获取相关的数据块
        var data = getData(elem);
        // 创建处理程序存储
        if (!data.handlers) data.handlers = {};
        // 使用type创建该type对应的数组
        if (!data.handlers[type])
            data.handlers[type] = [];
        // 标记函数
        if (!fn.guid) fn.guid = nextGuid++;
        // 将处理程序添加到列表中
        data.handlers[type].push(fn);
        // 创建事件调度器
        if (!data.dispatcher) {
            data.disabled = false;
            data.dispatcher = function (event) {
                if (data.disabled) return;
                event = fixEvent(event);

                // 调用注册的处理程序
                var handlers = data.handlers[event.type];
                if (handlers) {
                    for (var n = 0; n < handlers.length; n++) {
                        handlers[n].call(elem, event);
                    }
                }
            }
        }

        // 注册调度器
        if (data.handlers[type].length == 1) {
            if (document.addEventListener) {
                elem.addEventListener(type, data.dispatcher, false);
            }
            else if (document.attachEvent) {
                elem.attachEvent("on" + type, data.dispatcher);
            }
        }
    }

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

    this.proxy = function (context, fn) {
        if (!fn.guid) {
            fn.guid = nextGuid++;
        }

        var ret = function () {
            return fn.apply(context, arguments);
        };
        ret.guid = fn.guid;
        return ret;
    }
})();