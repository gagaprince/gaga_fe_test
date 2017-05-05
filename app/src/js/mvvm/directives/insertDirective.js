"use strict";
var BaseDirective = require('./BaseDirective');
var InsertDirective = BaseDirective.extend({
    excute:function(tplNode,vDom){
        var inner = tplNode.getInner();
        var inserReg = /{{(.*?)}}/gi;
        var matchArr = inserReg.exec(inner);
        var inserText = '';
        var lastIndex = 0;
        var scope = tplNode.getScope();
        for(;matchArr;matchArr=inserReg.exec(inner)){
            var express = matchArr[1];//取出差值表达式
            var currentIndex = matchArr.index;
            var pre = inner.substring(lastIndex,currentIndex);
            var insertExpText = this.replaceWith(scope,express);
            inserText += pre+insertExpText;
        }
        var end = inner.substring(lastIndex);
        inserText += end;
        //构造出虚拟节点 挂载在vDom上
    },
    replaceWith:function(scope, exp) {
        exp = " " + exp.trim();
        let quickRegex = /([\s\\+\-\\*\/\%\&\|\^!\*~]\s*?)([a-zA-Z_$][a-zA-Z_$0-9]*?)/g;
        exp = exp.replace(quickRegex, (a, b, c) => {
            return b + 'scope.' + c;
        });
        var func = new Function("scope", "return " + exp);
        return func(scope);
    }
});
InsertDirective.getName = function(){
    return "insert";
}
module.exports = InsertDirective;