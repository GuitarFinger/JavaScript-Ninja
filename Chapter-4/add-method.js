/**
 * 重载函数的方法
 * @param object {Object} 对象
 * @param name {String} 函数名字
 * @param fn {Function} 处理函数
 */
function addMethod(object, name, fn) {
    var old = object[name];
    object[name] = function () {
        if (fn.length == arguments.length)
            return fn.apply(this, arguments);
        else if (typeof old == 'function')
            return old.apply(this, arguments);
    }
}