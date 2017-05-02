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
    ctor:function(key){
        this._super(key);
    },
    setId:function(id){
        this.id = id||"";
    },
    setClassName:function(className){
        this.className = className||"";
    },
    setAttrMap:function(attrMap){
        this.attrMap = attrMap||{};
    },
    setTagName:function(tagName){
        this.tagName = tagName;
    },
    addFlag:function(flag,oldNode){
        this.diffFlag = flag;
        this.diffNode = oldNode;
    },
    setDom:function(dom){
        //和自己当前节点相匹配的真实dom节点
        this.realDom = dom;
    },
    getDom:function(){
        return this.realDom;
    }
});
module.exports = vDomNode;