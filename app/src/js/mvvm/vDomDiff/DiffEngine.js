"use strict";
var HClass = require('../../base/HClass');
var vDomNode = require('../tree/vDomNode');

var htmlParentREG = /<\s*(div|span|p)(.*?)>(.*)<\s*\/\s*(div|span|p)\s*>/gi;
var htmlChildREG = /<\s*(div|span|p)(.*?)>(.*?)<\s*\/\s*(div|span|p)\s*>/gi;


var DiffEngine = HClass.extend({
    parseHtmlToVDom:function(html){
        var root = new vDomNode('vDomRoot');
        this.resetChildREG();
        this.resetParentREG();
        this.treeCompile(html,root);
        return root;
    },
    treeCompile:function(tpl,node){
        var arr = this.childCompile(tpl);
        if(arr){
            if(arr[3].indexOf('<')!=-1){
                this.resetChildREG();
                //说明应该使用Parent方式
                this.resetParentREG();
                arr = this.parentCompile(tpl);
                if(arr){
                    var nodeChild =this.createTreeNodeByArr(arr);
                    node.addChild(nodeChild);
                    this.treeCompile(arr[3],nodeChild);
                }
            }else{
                var lastCompileIndex = 0;//上次匹配结束的下标

                for(;arr;arr=this.childCompile(tpl)){
                    var newBeginIndex = tpl.indexOf(arr[0]);
                    var textHtml = tpl.substring(lastCompileIndex,newBeginIndex).trim();
                    if(textHtml!=""){
                        var nodeChild = this.createTreeNodeByText(textHtml);
                        node.addChild(nodeChild);
                    }
                    var nodeChild =this.createTreeNodeByArr(arr);
                    node.addChild(nodeChild);
                    lastCompileIndex = htmlChildREG.lastIndex;
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
    treeCompileParent:function(){},
    treeCompileChild:function(){},
    createTreeNodeByArr:function(arr){
        if(arr){
            var nodeChild = new vDomNode();
            var tagName = arr[1];//标签名
            var attrMap = this.anysisAttrMap(arr[2]);
            nodeChild.setKey(tagName);
            nodeChild.setTagName(tagName);
            nodeChild.setId(attrMap["id"]);
            nodeChild.setClassName(attrMap["class"]);
            nodeChild.setAttrMap(attrMap);
            nodeChild.setDomText(arr[3]);
            return nodeChild;
        }
        return null;
    },
    createTreeNodeByText:function(text){
        if(text){
            var nodeChild = new vDomNode();
            nodeChild.setDomText(text);
            return nodeChild;
        }
        return null;
    },
    //把attr字符串变成map
    anysisAttrMap:function(attrStr){
        var map = {};
        var attrArray = attrStr.replace(/\"/g,"").trim().split(/\s+/);
        var item = attrArray[0];
        for(var i=0;item;item=attrArray[++i]){
            var itemArray = item.split("=");
            map[itemArray[0]] = itemArray[1]||"";
        }
        return map;
    },
    childCompile:function(tpl){
        var arr = htmlChildREG.exec(tpl);
        return arr;
    },
    parentCompile:function(tpl){
        var arr = htmlParentREG.exec(tpl);
        return arr;
    },
    resetParentREG:function(){
        htmlParentREG.lastIndex=0;
    },
    resetChildREG:function(){
        htmlChildREG.lastIndex=0;
    },

    diffTree:function(oldTreeNode,newTreeNode){


        //比较子孩子 比较 attr差别
        var oldChildren = oldTreeNode.getChildren()||[];
        var newChildren = newTreeNode.getChildren()||[];
        var oldChildKeyMap = this._parseKeyMapFromNodeList(oldChildren);
        var newChild = newChildren[0];
        for(var i=0;newChild;newChild=newChildren[++i]){
            var key = newChild.key;
            var oldChild = oldChildKeyMap[key].pop();
            if(oldChild){
                this.diffTree(oldChild,newChild);
                newChild.addFlag("modify",oldChild);
                oldChild.addFlag("modifyOld");
            }else{
                //同名老节点不存在 直接添加新节点 其所有子节点都需要添加
                newChild.addFlag("add");
            }
        }
        var oldChild = oldChildren[0];
        for(var i=0;oldChild;oldChild=oldChildren[++i]){
            var flag = oldChild.diffFlag;
            if(flag!="modifyOld"){
                oldChild.addFlag("del");
            }
        }



    },
    _parseKeyMapFromNodeList:function(children){
        if(children){
            var keyMap = {};
            var len = children.length;
            var child = children[len-1];
            for(var i=len-1;child;child=children[--i]){
                var key = child.key;
                if(!keyMap[key]){
                    keyMap[key]=[];
                }
                var keyChildArray = keyMap[key];
                keyChildArray.push(child);
            }
            return keyMap;
        }
        return {};
    },
    renderNormalTree:function(vDomNode,domP){
        if(!domP){
            domP = vDomNode.getDom();
        }else{
            var tagName = vDomNode.tagName;
            if(tagName){
                var ele = document.createElement(tagName);
                var attrMap = vDomNode.attrMap;
                for(var key in attrMap){
                    var value = attrMap[key];
                    ele.setAttribute(key,value);
                    var text = vDomNode.text;
                    if(text){
                        ele.innerHTML = text;
                    }
                }
            }else{
                var text = vDomNode.text;
                var ele = document.createTextNode(text);
            }
            domP.appendChild(ele);
            domP = ele;
        }
        if(domP){
            var children = vDomNode.getChildren()||[];
            var child = children[0];
            for(var i=0;child;child=children[++i]){
                this.renderNormalTree(child,domP);
            }
        }
    }

});
module.exports = DiffEngine;