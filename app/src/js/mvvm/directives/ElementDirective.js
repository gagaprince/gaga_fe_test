"use strict";
var BaseDirective = require('./BaseDirective');
var ElementDirective = BaseDirective.extend({
    rank:0,
    excute:function(tplNode,vDom){
        //设置vDom的基础信息
        var attrMap = tplNode.getAttrMap();
        var vDomAttrMap = {};
        var id="",className="";
        for(var key in attrMap){
            if(key.indexOf("g-")!=0){
                var val = attrMap[key];
                if(key=="id"){
                    id="#"+val;
                }else if(key=="class"){
                    className="."+val;
                }
                vDomAttrMap[key] = attrMap[key];
            }
        }
        var key = id+className;
        vDom.setTagName(tplNode.getTagName());
        vDom.setKey(key);
        vDom.setAttrMap(vDomAttrMap);
    }
});
ElementDirective.getName = function(){
    return "ele";
}
module.exports = ElementDirective;