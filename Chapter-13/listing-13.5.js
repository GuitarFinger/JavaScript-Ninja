/**一个绑定事件处理程序并进行跟踪的函数*/
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
})();
/**反思
 * 传入的函数从来没有成为实际的事件处理程序，相反，它们通过委托函数进行保存，并在事件发生时
 * 进行调用，真正的处理程序是委托函数。使得我们有机会，确保无论哪个平台都能做到如下事情：
 *    1. Event实例被修复
 *    2. 将函数上下文设置成目标元素
 *    3. Event实例作为唯一的参数传递给处理程序
 *    4. 事件处理程序永远按照其绑定顺序进行执行
 * */
