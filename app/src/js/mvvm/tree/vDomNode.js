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
    }
});
module.exports = vDomNode;