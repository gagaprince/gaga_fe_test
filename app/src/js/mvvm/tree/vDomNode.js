"use strict";
var TreeNode = require('./TreeNode');
var vDomNode = TreeNode.extend({
    key:"nomal",
    tagName:"",
    id:'',
    className:'',
    attrMap:null,
    value:'',
    text:'',
    diffFlag:"",
    diffNode:null,
    realDom:null,

    gvTarget:null,//gv对象的指针
    eventList:null,

    ctor:function(key){
        this._super(key);
    },
    getTagName:function(){
        return this.tagName;
    },
    setId:function(id){
        this.id = id||"";
    },
    setKey:function(key){
        this.key = key;
    },
    setClassName:function(className){
        this.className = className||"";
    },
    setAttrMap:function(attrMap){
        this.attrMap = attrMap||{};
    },
    getAttrMap:function(){
        return this.attrMap;
    },
    addAttrMap:function(key,value){
        var attrMap = this.attrMap||{};
        attrMap[key]=value;
        this.attrMap = attrMap;
    },
    getAttrValue:function(key){
        var attrMap = this.attrMap||{};
        return attrMap[key];
    },
    setTagName:function(tagName){
        this.tagName = tagName;
    },
    getDiffNode:function(){
        return this.diffNode;
    },
    addFlag:function(flag,oldNode){
        this.diffFlag = flag;
        this.diffNode = oldNode;
    },
    resetFlag:function(){
        this.diffFlag = "";
        this.diffNode = null;
    },
    setDom:function(dom){
        //和自己当前节点相匹配的真实dom节点
        this.realDom = dom;
    },
    getDom:function(){
        return this.realDom;
    },
    getEventList:function(){
        return this.eventList||[];
    },
    addEventLister:function(eventName,call,args){
        if(!this.eventList){
            this.eventList = [];
        }
        this.eventList.push({
            eventName:eventName,
            callback:call,
            args:args||[]
        });
    },
    unBindEvent:function(event,dom){
        if(event){
            var eventName = event.eventName;
            var eventCall = event["eventCall"];
            if(eventCall){
                dom.removeEventListener(eventName,eventCall,false);
            }
        }

    },
    unBindEvents:function(){
        var eventList = this.eventList||[];
        var dom = this.getDom();
        if(dom){
            for(var i=0;i<eventList.length;i++){
                var event = eventList[i];
                var eventName = event.eventName;
                var callback = event.callback;
                dom.removeEventListener(eventName,callback,false);
            }
        }
    },
    bindEvent:function(event,dom){
        if(event){
            var eventName = event.eventName;
            var callback = event.callback;
            var args = event.args;
            var gv = this.getTarget();
            var self = gv.getSelf();
            var eventCall = function(e){
                var _this = this;
                var e = {
                    dom:_this,
                    event:e
                }
                callback.apply(self,args.concat(e));
            };
            dom.addEventListener(eventName,eventCall,false);
            event["eventCall"]=eventCall;
        }
    },
    bindEvents:function(){
        var eventList = this.eventList||[];
        var dom = this.getDom();
        if(dom){
            for(var i=0;i<eventList.length;i++){
                var event = eventList[i];
                this.bindEvent(event,dom);
            }
        }
    },
    setTarget:function(gv){
        this.gvTarget = gv;
    },
    getTarget:function(){
        return this.gvTarget;
    }
});
module.exports = vDomNode;