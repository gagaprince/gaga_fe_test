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
    }
}
module.exports = BaseUtil;