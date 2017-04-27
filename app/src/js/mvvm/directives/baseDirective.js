"use strict";
var HClass = require('../../base/HClass');
var baseDirective = HClass.extend({
    excute:function(tplNode,scorp,vDom){
        //tplNode是模板引擎树
        //vdom 是 根据模板引擎 生成的 虚拟dom
        //挂载在虚拟dom上的数据

    },
    compileObj:function(express,obj){
        var fun = new Function("data","return data."+express);
        return fun(obj);
    }
});
module.exports = baseDirective;