"use strict";
var Globle = require('../../base/Globle');
var BaseDirective = require('./BaseDirective');
var ForDirective = BaseDirective.extend({
    rank:Globle.DirectiveRank.ForDirRank,
    tempChildren:null,
    ctor:function(express){
        this.express = express;
    },
    excute:function(tplNode,vDom){
        if(tplNode.ignoreFor)return;
        //console.log("for-excute");
        var children =this.tempChildren = tplNode.getChildren();
        tplNode.clearChildren();


        var express = this.express;
        var items = express.split("in");
        var itemKeyEx = items[0].trim();
        var itemArrayEx = items[1].trim();

        var scope = tplNode.cloneScope();
        var itemArray = this.replaceWith(scope,itemArrayEx);
        for(var key in itemArray){
            var val = itemArray[key];
            //console.log(itemKeyEx);
            //console.log(val);
            var scope = tplNode.cloneScope();
            scope[itemKeyEx]=val;
            //console.log(scope);
            var cloneTplNode = tplNode.clone();
            cloneTplNode.setScope(scope);
            cloneTplNode.addChildren(children);
            cloneTplNode.ignoreFor = true;
            tplNode.addChild(cloneTplNode);
        }
    },
    excuteAfter:function(tplNode,vDom){
        if(tplNode.ignoreFor)return;
        //console.log("for-excute-after");
        tplNode.clearChildren();
        tplNode.addChildren(this.tempChildren);
        this.tempChildren = null;
    }
});
ForDirective.getName = function(){
    return "for";
}
module.exports = ForDirective;