"use strict";
var HClass = require('../../base/HClass');
var BaseDirective = HClass.extend({
    express:"",
    rank:10000,
    ctor:function(exp){
        this.express = exp;
    },
    excute:function(tplNode,vDom){
        //tplNode是模板树节点 vD
        //vdom 是 上层虚拟节点
    },
    excuteAfter:function(tplNode,vDom){

    },
    initWithExpress:function(ex){
        this.express = ex;
    },
    getRank: function () {
        return this.rank;
    },
    replaceWith:function(scope, exp) {
        exp = " " + exp.trim();
        var quickRegex = /([\s\\+\-\\*\/\%\&\|\^!\*~]\s*?)([a-zA-Z_$][a-zA-Z_$0-9]*?)/g;
        exp = exp.replace(quickRegex, function(a, b, c) {
            return b + 'scope.' + c;
        });
        var func = new Function("scope", "return " + exp);
        return func(scope);
    }
});
BaseDirective.getName = function(ex){
    return "base";
}
module.exports = BaseDirective;