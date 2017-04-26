"use strict";
var TreeNode = require('./TreeNode');


var valREG = /{{(.+?)}}/gi;

var htmlParentREG = /<\s*(div|span|p)(.*?)>(.*)<\s*\/\s*(div|span|p)\s*>/gi;
var htmlChildREG = /<\s*(div|span|p)(.*?)>(.*?)<\s*\/\s*(div|span|p)\s*>/gi;

var tplCache = {};

var tplEngine = {
    compileDom:function(id,innerHtml){
        innerHtml = innerHtml.replace(/\n/g,'');
        tplCache[id]=innerHtml; //将模板加入tpl缓存 之后要根据tpl 生成虚拟dom
        this.compileTpl(id);
        var arr = valREG.exec(innerHtml);
        var tpl = 'return ',lastIndex=0;
        for(;arr;arr = valREG.exec(innerHtml)){
//            console.log(arr);
            var preStr = innerHtml.substring(lastIndex,arr.index);
            lastIndex = valREG.lastIndex;
            tpl+='\''+preStr.replace(/\'/g,'\\\'')+'\''+'+data.'+arr[1]+'+';
        }
        var afterStr = innerHtml.substring(lastIndex);
        tpl+='\''+afterStr.replace(/\'/g,'\\\'')+'\'';
        return new Function('data',tpl);
    },
    compileTpl:function(id){
        var tpl = tplCache[id];
        console.log(tpl);
        var root = new TreeNode("root");
        this.treeCompile(tpl,root);
        console.log(root);
    },
    treeCompile:function(tpl,node){
        console.log("treeCompile");
        console.log(tpl);
        var arr = this.childCompile(tpl);
        if(arr){
            if(arr[3].indexOf('<')!=-1){
                this.resetChildREG();
                //说明应该使用Parent方式
                arr = this.parentCompile(tpl);
                console.log("parent");
                console.log(arr);
                if(arr){
                    var nodeChild =this.createTreeNodeByArr(arr);
                    node.addChild(nodeChild);
                    this.treeCompile(arr[3],nodeChild);
                }
            }else{
                for(;arr;arr=this.childCompile(tpl)){
                    console.log("child");
                    console.log(arr);
                    var nodeChild =this.createTreeNodeByArr(arr);
                    node.addChild(nodeChild);
                }
                this.resetChildREG();
                var children = node.getChildren();
                for(var i=0;i<children.length;i++){
                    var child = children[i];
                    this.treeCompile(child.getDomText(),child);
                }
            }
        }

    },
    createTreeNodeByArr:function(arr){
        if(arr){
            var nodeChild = new TreeNode();
            var tagName = arr[1];//标签名
            var attrKey = this.anysisKey(arr[2]);
            nodeChild.setKey(tagName+attrKey);
            nodeChild.setDomText(arr[3]);
            return nodeChild;
        }
        return null;
    },
    anysisKey:function(text){
        var keyArray = text.split(/\s+/);
        var keyMap = {};
        for(var i=0;i<keyArray.length;i++){
            var keyItem = keyArray[i].replace(/\"|\'/gi,'').trim();
            var keyValue = keyItem.split("=");
            if(keyValue.length>1){
                keyMap[keyValue[0]]=keyValue[1];
            }
        }
        console.log(keyMap);
        var returnKey = "";
        if("id" in keyMap){
            returnKey+='#'+keyMap["id"];
        }
        if("class" in keyMap){
            returnKey+='.'+keyMap["class"];
        }
        return returnKey;
    },
    childCompile:function(tpl){
        var arr = htmlChildREG.exec(tpl);
        return arr;
    },
    parentCompile:function(tpl){
        var arr = htmlParentREG.exec(tpl);
        return arr;
    },
    resetChildREG:function(){
        htmlChildREG.lastIndex=0;
    }
};
module.exports = tplEngine;