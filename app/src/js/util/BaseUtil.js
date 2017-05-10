"use strict";
var BaseUtil = {
    extend:function() {
        var args = arguments;
        var baseObj = {};
        if(args.length>0){
            baseObj = args[0];
        }
        for(var i=1;i<args.length;i++){
            var obj = args[i];
            if(obj){
                for(var key in obj){
                    baseObj[key]=obj[key];
                }
            }
        }
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
module.exports = BaseUtil;