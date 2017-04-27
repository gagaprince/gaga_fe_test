"use strict";
var baseDirective = require('./baseDirective');
var forDirective = baseDirective.extend({
    excute:function(tplNode,scorp,vDom){
        var vDomChildren = this.createVdomByTpl(tplNode,scorp);
        vDom.addChildren(vDomChildren);
        return vDom;
    },
    createVdomByTpl:function(tplNode,scorp){
        var express = tplNode.getExpress();
        var args = express.split("in");
        var vDomChildren = [];
        if(args.length==2){
            var obj = this.compileObj(args[1].trim(),scorp);
            for(var key in obj){
                var value = obj[key];
                var childScorp = scorp;
                childScorp[args[0].trim()] = value;
                var vDomChild = tplNode.parseVdom(childScorp);
                vDomChildren.push(vDomChild);
                delete childScorp[args[0].trim()];
            }
            return vDomChildren;
        }else{
            throw "for express has a error";
        }
        return null;
    }
});
module.exports = forDirective;