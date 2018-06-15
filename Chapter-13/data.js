/**实现一个中央对象用于保存DOM元素信息*/
(function () {
    // 保存和元素相关联的数据
    var cache = {};
    // 一个用于生成元素GUID的计数器
    var guidCounter = 1;
    // 一个属性名称，将其作为元素的GUID进行保存。使用当前时间戳做名称可以防止与用户自定义名称有潜在的冲突
    var expando = "data" + (new Date).getTime();

    this.getData = function (elem) {
        var guid = elem[expando];
        if (!guid) {
            guid = elem[expando] = guidCounter++;
            cache[guid] = {};
        }
        return cache[guid];
    };

    this.removeData = function (elem) {
        var guid = elem[expando];
        if (!guid) return;
        delete cache[guid];
        try {
            delete elem[expando];
        } catch (e) {
            if (elem.removeAttribute) {
                elem.removeAttribute(expando);
            }
        }
    }
})();