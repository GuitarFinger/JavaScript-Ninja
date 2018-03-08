/**
 * Created by HZC on 2018/3/5 0005.
 */
/*创建一个有Object属性和自己属性的子类*/
(function () {
    var initializing = false,
        /*如果函数能够正常序列化(test()方法将接收一个字符串,然后触发函数的toString()方法)
        * 最终结果返回true, 用superPattern来判断一个函数是否包含字符串“_super”.只有函数支持
        * 序列化才能判断,所以在不支持序列化的浏览器上,使用一个匹配任意字符串的模式进行替换
        * */
        superPattern = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;

    Object.subClass = function (properties) {
        // 子类实例化: properties,该参数是期望添加到子类的属性集
        var _super = this.prototype; // 将_super指向Object的原型对象

        initializing = true; // 标识初始化
        var proto = new this(); // 将proto指向一个调用者的实例
        initializing = false;

        // 遍历传过来的参数
        for (var name in properties) {
            // typeof properties[name] == "function": 子类属性是否是一个函数
            // typeof _super[name] == "function": 超类属性是否是一个函数
            // superPattern.test(properties[name]): 子类函数是否包含一个_super()引用
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