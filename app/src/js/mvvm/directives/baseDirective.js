"use strict";
var HClass = require('../../base/HClass');
var BaseDirective = HClass.extend({
    express:"",
    excute:function(tplNode,vDom){
        //tplNode是模板树节点 vD
        //vdom 是 上层虚拟节点
    },
    initWithExpress:function(ex){
        this.express = ex;
    }
});
BaseDirective.createDirByExpress = function(ex){
    var dir = new this();
    dir.initWithExpress(ex);
    return dir;
}
BaseDirective.getName = function(ex){
    return "base";
}
module.exports = BaseDirective;