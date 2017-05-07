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
            lastIndex = inserReg.lastIndex;
        }
        var end = inner.substring(lastIndex);
        inserText += end;
        console.log(inserText);
        //构造出虚拟节点 挂载在vDom上
        vDom.setDomText(inserText);
    }
});
InsertDirective.getName = function(){
    return "insert";
}
module.exports = InsertDirective;