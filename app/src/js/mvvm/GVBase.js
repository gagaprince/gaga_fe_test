"use strict";
var HClass = require('../base/HClass');
var insertDirective = require('./directives/insertDirective');
var ElementDirective = require('./directives/ElementDirective');
var ForDirective = require('./directives/ForDirective');
var IfDirective = require('./directives/IfDirective');
var BindDirective = require('./directives/BindDirective');
var ModelDirective = require('./directives/ModelDirective');
var OnDirective = require('./directives/OnDirective');
var DirectiveMapUtil = require('./directives/DirectiveMap');


var GVBase = HClass.extend({
    nativeMethods:{
        G_vFormEleChange:function(express){
            console.log(express);
        },
        G_vFormInputTextChange:function(express,e){
//            console.log(express);
//            console.log(e);
            var ele = e.dom;
            var text = ele.value;
//            console.log(text);
            this.replaceWith(this,express.trim()+'=\"'+text+'\"');
        },
        replaceWith:function(scope, exp) {
            exp = " " + exp.trim();
            var quickRegex = /([\s\\+\-\\*\/\%\&\|\^!\*~]\s*?)([a-zA-Z_$][a-zA-Z_$0-9]*?)/g;
            exp = exp.replace(quickRegex, function(a, b, c) {
                return b + 'scope.' + c;
            });
            var func = new Function("scope", "return " + exp);
            return func(scope);
        }
    }
});
GVBase.initDirective = function(){
    DirectiveMapUtil.register(insertDirective);
    DirectiveMapUtil.register(ElementDirective);
    DirectiveMapUtil.register(ForDirective);
    DirectiveMapUtil.register(IfDirective);
    DirectiveMapUtil.register(BindDirective);
    DirectiveMapUtil.register(ModelDirective);
    DirectiveMapUtil.register(OnDirective);
}
GVBase.addDirective = function(dir){
    DirectiveMapUtil.register(dir);
}
module.exports = GVBase;