"use strict";
var HClass = require('../base/HClass');

var TreeNode = HClass.extend({
    key:"",
    children:null,
    parent:null,
    domText:null,
    ctor:function(key){
        this.key = key||"";
        this.children = [];
    },
    setKey:function(key){
        this.key = key;
    },
    addParent:function(parent){
        this.parent = parent;
    },
    addChild:function(child){
        this.children.push(child);
        child.addParent(this);
    },
    getChildren:function(){
        return this.children;
    },
    setDomText:function(text){
        this.domText = text;
    },
    getDomText:function(){
        return this.domText;
    }
});
module.exports = TreeNode;