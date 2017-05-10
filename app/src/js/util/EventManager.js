"use strict";
var HClass=require('../base/HClass');
/**
 * 小型的事件注册 侦听的manage
 * */
//事件类
var GEvent = HClass.extend({
    name:null,
    model:null,
    ctor:function(name){
        this.name=name;
    },
    getData:function(){
        return this.model
    },
    setData:function(model){
        this.model = model;
    },
    getName:function(){
        return this.name;
    }
})
GEvent.EventName={

}


var EventManager = {
    GEvent:GEvent,
    eventMap:{},
    addEventListener:function(eventName,callback){
        if(callback){
            var eventMap = this.eventMap;
            if(!eventMap[eventName]){
                eventMap[eventName] = [];
            }
            eventMap[eventName].push(callback);
        }
    },
    postMsg:function(event){//event 是一个事件对象
        var eventName = event.getName();
        var eventMap = this.eventMap;
        if(eventMap[eventName]){
            var list = eventMap[eventName];
            var itemCall = list[0];
            for(var i=0;itemCall;itemCall=list[++i]){//事件的调用 不产生阻塞
                setTimeout((function(itemCall,event){
                    itemCall(event);
                })(itemCall,event));
            }
        }
    }
}

module.exports = {
    EventManager:EventManager,
    em:EventManager
};