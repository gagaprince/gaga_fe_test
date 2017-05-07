"use strict";

var DiffEngine = {
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
//                newChild.addFlag("modify",oldChild);
                newChild.setDom(oldChild.getDom());
                this.renderModifyNode(newChild,oldChild);
                oldChild.addFlag("modifyOld");
                this.diffTree(oldChild,newChild);
            }else{
                //同名老节点不存在 直接添加新节点 其所有子节点都需要添加
//                newChild.addFlag("add");
                var domP = newChild.getParent().getDom();
                this.renderNormalTree(newChild,domP);
            }
        }
        var oldChild = oldChildren[0];
        for(var i=0;oldChild;oldChild=oldChildren[++i]){
            var flag = oldChild.diffFlag;
            if(flag!="modifyOld"){
                var domP = oldChild.getParent().getDom();
                var domC = oldChild.getDom();
                domP.removeChild(domC);
//                newTreeNode.removeFromParent();
//                oldChild.addFlag("del");
//                newTreeNode.addChild(oldChild);
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
                }
                delete attrOld[key];
            }else{
                dom.setAttribute(key,attrNew[key]);
            }
        }
        for(var key in attrOld){
            dom.removeAttribute(key);
        }
    },
    _renderModifyText:function(newNode,oldNode,dom){
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
            if(tagName!="G_text"){
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

};
module.exports = DiffEngine;