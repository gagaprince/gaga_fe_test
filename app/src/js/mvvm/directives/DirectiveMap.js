"use strict";
//指令注册系统
var DirectiveMapUtil = {
    directiveMap:{},
    register:function(directive){
        var name = directive.getName();
        var map = this.directiveMap;
        if(name in map){
            throw "已经存在了同名指令 请改名";
            return;
        }
        map[name]=directive;
    },
    getMap:function(){
        return this.map;
    }
}
module.exports = DirectiveMapUtil;