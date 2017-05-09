"use strict";
var Globle = require('../../base/Globle');
var BaseDirective = require('./BaseDirective');
var ModelDirective = BaseDirective.extend({
    rank:Globle.DirectiveRank.ModelDirRank,
    tempChildren:null,
    ctor:function(express){
        this.express = express;
    },
    excute:function(tplNode,vDom){
        var tagName = vDom.getTagName();
//        console.log(tagName);
        if(tagName=="input"){
            var type = vDom.getAttrValue("type");
//            console.log(type);
            switch (type){
                case 'text':
                    this.excuteWhenInputText(tplNode,vDom);
                    break;
            }
        }
    },
    excuteWhenInputText:function(tplNode,vDom){
        var gv = vDom.getTarget();
        var gvSelf = vDom.getTarget().getSelf();
        var fun = this.replaceWith(gvSelf,"G_vFormInputTextChange");
//        console.log(this.express);
        vDom.addEventLister("input",fun,[this.express]);

        var text = this.replaceWith(gvSelf,this.express);
//        console.log("excuteWhenInputText");
//        console.log(text);
//        console.log("excuteWhenInputText end");
        vDom.setValue(text);
//        vDom.addAttrMap("value",text);
    },
    excuteAfter:function(tplNode,vDom){

    }
});
ModelDirective.getName = function(){
    return "model";
}
module.exports = ModelDirective;