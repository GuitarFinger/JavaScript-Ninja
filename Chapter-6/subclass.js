/**
 * Created by HZC on 2018/3/5 0005.
 */
(function () {
    var initializing = false,
        /*如果函数能够正常序列化(test()方法将接收一个字符串,然后触发函数的toString()方法)
        * 最终结果返回true, 用superPattern来判断一个函数是否包含字符串“_super”.只有函数支持
        * 序列化才能判断,所以在不支持序列化的浏览器上,使用一个匹配任意字符串的模式进行替换
        * */
        superPattern = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;

    Object.subClass = function (properties) {
        // 子类实例化: properties,该参数是期望添加到子类的属性集
        var _super = this.prototype;

        initializing = true;
        var proto = new this();
        initializing = false;

        for (var name in properties) {
            proto[name] = typeof properties[name] == "function" &&
                          typeof _super[name] == "function" &&
                          superPattern.test(properties[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;
                        this._super = _super[name];
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    }
                })(name, properties[name]) : properties[name];
        }

        function Class() {
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        Class.prototype = proto;

        Class.constructor = Class;

        Class.subClass = arguments.callee;

        return Class;
    };
})();