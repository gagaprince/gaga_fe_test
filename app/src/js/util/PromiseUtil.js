"use strict";
var HClass=require('../base/HClass');
var Promise = HClass.extend({
    isExe:false,
    callback:null,
    nextPromise:null,
    ctor:function(call,isLate){//isLate 是否要延后执行
        this.callback = call;
        if(!isLate){
            this.callback(this);
            this.isExe = true;
        }
    },
    resolve:function(){
        if(this.nextPromise){
            this.nextPromise.excute();
        }
    },
    excute:function(){
        if(!this.isExe){
            this.callback(this);
            this.isExe = false;
        }
    },
    then:function(newCall){
        this.nextPromise = new Promise(newCall,true);
        return this.nextPromise;
    }
});

var PromiseUtil = {
    Promise:Promise
}
module.exports = PromiseUtil;