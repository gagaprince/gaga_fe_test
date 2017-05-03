"use strict";
var HClass = require('../../base/HClass');
var vDomNode = require('../tree/vDomNode');


var DiffEngine = HClass.extend({
    parseHtmlToVDom:function(html){
        var root = new vDomNode('vDomRoot');
        this.treeCompile(html,root);
        return root;
    },
    treeCompile:function(tpl,node){
        var beginTagReg = /<\/?\s*(div|span|p)(.*?)>/gi;
        var beginTagInfos = [];
        var lastTagArr = null;
        var arr = beginTagReg.exec(tpl);
        var currentNode = node;
        for(;arr;arr = beginTagReg.exec(tpl)){
            if(lastTagArr){
                var lastIndex=lastTagArr.lastIndex;
                var currentHeaderIndex = arr.index;
                var inHtml = tpl.substring(lastIndex,currentHeaderIndex).trim();
                if(inHtml!=""){
                    var child = this.createTreeNodeByText(inHtml);
                    currentNode.addChild(child);
                }
            }


            var tagHtml = arr[0];
            var endTagReg = /<\s*\/(.*?)>/gi;
            var endArr = endTagReg.exec(tagHtml);
            if(endArr){
//                console.log("这是一个endTag");
//                console.log(endArr);
                  currentNode = currentNode.getParent();
            }else{
                var node = this.createTreeNodeByArr(arr);
                currentNode.addChild(node);
                currentNode = node;
                beginTagInfos.push(arr);

            }
            lastTagArr = arr;
            lastTagArr.lastIndex = beginTagReg.lastIndex;
        }
    },
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