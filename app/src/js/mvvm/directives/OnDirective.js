"use strict";
var Globle = require('../../base/Globle');
var BaseDirective = require('./BaseDirective');
var OnDirective = BaseDirective.extend({
    rank:Globle.DirectiveRank.OnDirRank,
    tempChildren:null,
    attrKey:null,
    ctor:function(express,key){
        this.express = express;
        this.attrKey = key;
    },
    excute:function(tplNode,vDom){
        var gv = vDom.getTarget();
        var gvSelf = vDom.getTarget().getSelf();
        var express = this.express.trim();
        var expReg = /(.*?)\((.*?)\)/gi;
        var matchArr = expReg.exec(express);
        if(matchArr){
            var expFun = matchArr[1];
            var argstr = matchArr[2];
            var argsData = [];
            if(argstr){
                var scope = tplNode.getScope();
                var args = argstr.split(',');
                for(var i=0;i<args.length;i++){
                    var argexp = args[i];
                    var data = this.replaceWith(scope,argexp);
                    argsData.push(data);
                }
            }
            var fun = this.replaceWith(gvSelf,expFun);
            vDom.addEventLister(this.attrKey,fun,argsData);
        }else{
            var fun = this.replaceWith(gvSelf,this.express);
//        console.log(this.express);
//        console.log(fun);
            vDom.addEventLister(this.attrKey,fun);
        }



    },
    excuteAfter:function(tplNode,vDom){

    }
});
OnDirective.getName = function(){
    return "on";
}
module.exports = OnDirective;