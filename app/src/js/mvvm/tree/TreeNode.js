"use strict";
var HClass = require('../../base/HClass');

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
    getParent:function(){
        return this.parent;
    },
    addParent:function(parent){
        this.parent = parent;
    },

    addChild:function(child){
        this.children.push(child);
        child.addParent(this);
    },
    addChildren:function(children){
        if(children&&children.length>0){
            var len = children.length;
            for(var i=0;i<len;i++){
                var child = children[i];
                this.addChild(child);
            }
        }
    },
    clearChildren:function(){
        this.children = [];
    },
    getChildren:function(){
        return this.children;
    },
    setDomText:function(text){
        if(text.indexOf('<')==-1){
            this.text = text;
        }
        this.domText = text;
    },
    getDomText:function(){
        return this.domText;
    },
    removeFromParent:function(){
        var p = this.getParent();
        if(p){
            var cdr = p.getChildren();
            var child = cdr[0];
            for(var i=0;child;child=cdr[++i]){
                if(child==this){
                    cdr.splice(i,1);
                    break;
                }
            }
        }
    }
});
module.exports = TreeNode;