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
                newChild.setDom(oldChild.getDom());
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
                newTreeNode.addChild(oldChild);
            }
        }
    },
    renderDiffTree:function(newTreeNode){
        var diffFlag = newTreeNode.diffFlag;
//        console.log(diffFlag);
        if(diffFlag=="modify"){
            //需要diff old 和 new 来确认修改
            var oldNode = newTreeNode.getDiffNode();
            this.renderModifyNode(newTreeNode,oldNode);
        }else if(diffFlag == "add"){
            //需要添加整个分支 递归添加就可以
            var domP = newTreeNode.getParent().getDom();
            this.renderNormalTree(newTreeNode,domP);

        }else if(diffFlag=="del"){
            //删除当前节点 并且从虚拟dom上删除
            var domP = newTreeNode.getParent().getDom();
            var domC = newTreeNode.getDom();
            console.log(domP);
            console.log(domC);
            domP.removeChild(domC);
            newTreeNode.removeFromParent();
            return true;//代表remove了
        }

        newTreeNode.resetFlag();
        var children = newTreeNode.getChildren()||[];
        var child = children[0];
        for(var i=0;child;child=children[++i]){
            var isRemove = this.renderDiffTree(child);
            if(isRemove){
                i--;
            }
        }
    },
    renderModifyNode:function(newNode,oldNode){
        var dom = newNode.getDom();
        console.log("renderModifyNode begin");
        console.log(newNode,oldNode);
        console.log("renderModifyNode end");

        this._renderModifyAttr(newNode,oldNode,dom);
        this._renderModifyText(newNode,oldNode,dom);
    },
    _renderModifyAttr:function(newNode,oldNode,dom){
        var attrNew = newNode.getAttrMap();
        var attrOld = oldNode.getAttrMap();
        for(var key in attrNew){
            if(key in attrOld){
                if(attrNew[key]!=attrOld[key]){
                    dom.setAttribute(key,attrNew[key]);
                    delete attrOld[key];
                }
            }else{
                dom.setAttribute(key,attrNew[key]);
            }
        }
        for(var key in attrOld){
            dom.removeAttribute(key);
        }
    },
    _renderModifyText:function(newNode,oldNode,dom){
        console.log("_renderModifyText");
        console.log(newNode.text);
        console.log(oldNode.text);
        console.log(dom);
        console.log("_renderModifyText end");
        if(newNode.text!=oldNode.text){
            dom.data = newNode.text;
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
            vDomNode.setDom(domP);
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