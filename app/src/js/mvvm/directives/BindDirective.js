"use strict";
var Globle = require('../../base/Globle');
var BaseDirective = require('./BaseDirective');
var BindDirective = BaseDirective.extend({
    rank:Globle.DirectiveRank.BindDirRank,
    tempChildren:null,
    attrKey:null,
    ctor:function(express,key){
        this.express = express;
        this.attrKey = key;
    },
    excute:function(tplNode,vDom){
        var scope = tplNode.getScope();
        var val = this.replaceWith(scope,this.express);
//        console.log(val);
//        console.log(this.attrKey);
        vDom.addAttrMap(this.attrKey,val);
    },
    excuteAfter:function(tplNode,vDom){

    }
});
BindDirective.getName = function(){
    return "bind";
}
module.exports = BindDirective;