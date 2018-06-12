/**
 *规范化Event对象实例
 * @param event
 * @returns {*}
 */
function fixEvent(event) {
    // 返回true或false的这个两个函数会经常在修复代码中用到
    function returnTrue() { return true };
    function returnFalse() { return false };

    /**测试是否需要对event进行修复
     * */
    // 不存在event || 不存在event的阻止冒泡
    if (!event || !event.stopPropagation) {
        // 获取现有event对象的一个副本，保存在old变量中
        var old = event || window.event;
        event = {};
        // Clone the old object so that we can modify the values
        for (var prop in old) {
            event[prop] = old[prop];
        }

        /**The event occurred on this element
         * 修复事件原始源的属性。
         * 在IE Model中，原始源是保存在srcElement中。
         * */
        if (!event.target) {
            event.target = event.srcElement || document;
        }

        /**Handle which other element the event is related to
         * 修复事件触发时的关联元素(如mouseover或者mouseout)
         * 在IE Model中则是toElement和fromElement
         * */
        event.relatedTarget = event.fromElement === event.target ?
            event.toElement :
            event.fromElement;
        /**Stop the default browser action
         * 该属性在IE Model中是不存在的，其阻止默认浏览器行为的发生。
         * 在IE中阻止默认行为的发生时，需要将returnValue属性置为false
         * */
        event.preventDefault = function () {
            event.returnValue = false;
            event.isDefaultPrevented = returnTrue;
        };
        event.isDefaultPrevented = returnFalse;

        /**Stop the event from bubbling
         * 该属性在IE Model中是不存在的，它的目的是进一步阻止事件冒泡。
         * 在IE中，需要将cancelBubble属性设置为true才能阻止事件冒泡。
         * */
        event.stopPropagation = function () {
            event.cancelBubble = true;
            event.isPropagationStopped = returnTrue;
        };
        event.isPropagationStopped = returnFalse;

        // Stop the event from bubbling and executing other handlers
        event.stopImmediatePropagation = function () {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        };
        event.isImmediatePropagationStopped = returnFalse;

        /**Handle mouse position
         * 这两属性在IE Model中不存在。它们提供鼠标相对于整个文档的位置，但可以很容易的从其他信息中获取
         * 在IE中，clientX/Y提供鼠标相对于窗口的位置，而scrollTop/Left则给出了文档滚动的位置，并且
         * clientTop/Left给出了文档的偏移量
         * */
        if (event.clientX != null) {
            var doc = document.documentElement,
                body = document.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.scrollTop || 0);
        }

        /**handle key presses
         * 相当于键盘事件时所按键的键盘码。
         * 在IE Model中，可以通过charCode和keyCode属性获取到。
         * */
        event.which = event.charCode || event.keyCode;

        /**Fix button for mouse clicks: 0 == left; 1 == middle; 2 == right
         * 表示鼠标事件发生时，用户单击的鼠标按钮。
         * 在IE Model中，使用了拉掩码(左单机是1，右单击是2，中间单击是4)，所以
         * 需要将其转换成DOM Model的等价值(左单机是0，右单击是1，中间单击是2)
         * */
        if (event.button !== null) {
            event.button = (event.button & 1 ? 0 :
                (event.button & 4 ? 1 :
                    (event.button & 2 ? 2 : 0)));
        }
    }
    // 不需要修复 直接返回现有的event对象
    return event;
}
/**反思
 * 1. 为什么不直接修改现有对象？ 因为原生事件对象中有很多属性不能被覆盖
 * 2. 克隆事件对象的另外一个优点是，它解决了IE Model在全局上下文中保存对象的问题。
 * 新事件开始时，前一个事件的Event对象就消失了。将事件属性转移到一个新对象上，我们可以控制新
 * 新对象的生命周期，从而可以解决任何潜在的问题。
 * */