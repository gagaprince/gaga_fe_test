"use strict";
var Globle = require('../../base/Globle');
var BaseDirective = require('./BaseDirective');
var IfDirective = BaseDirective.extend({
    rank:Globle.DirectiveRank.IfDirRank,
    tempChildren:null,
    ctor:function(express){
        this.express = express;
    },
    excute:function(tplNode,vDom){
//        console.log(this.express);
        var scope = tplNode.getScope();
        var flag = this.replaceWith(scope,this.express);
        if(!flag){
            this.tempChildren = tplNode.getChildren();
            tplNode.clearChildren();
        }
    },
    excuteAfter:function(tplNode,vDom){
        if(this.tempChildren){
            tplNode.addChildren(this.tempChildren);
            this.tempChildren = null;
        }
    }
});
IfDirective.getName = function(){
    return "if";
}
module.exports = IfDirective;