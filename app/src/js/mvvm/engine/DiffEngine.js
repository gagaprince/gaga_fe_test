"use strict";

var DiffEngine = {
    //diff算法 是 虚拟dom的核心 也是可以不断优化的地方
    //这里只是简单实现了diff 再diff过程中就更新dom
    //也有一种方式 可以 在diff过程中只是生成要修改的点标记到新的vdom中 之后遍历新树进行dom更新
    diffTree:function(oldTreeNode,newTreeNode){
        //比较子孩子 比较 attr差别
        var oldChildren = oldTreeNode.getChildren()||[];
        var newChildren = newTreeNode.getChildren()||[];
        var oldChildKeyMap = this._parseKeyMapFromNodeList(oldChildren);
        var newChild = newChildren[0];
        for(var i=0;newChild;newChild=newChildren[++i]){
            var key = newChild.key;
            var oldChild = oldChildKeyMap[key]?oldChildKeyMap[key].pop():null;
            if(oldChild){
                newChild.setDom(oldChild.getDom());
                this.renderModifyNode(newChild,oldChild);
                oldChild.addFlag("modifyOld");
                this.diffTree(oldChild,newChild);
            }else{
                //同名老节点不存在 直接添加新节点 其所有子节点都需要添加
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
            }
        }
    },
    //渲染更改dom
    renderModifyNode:function(newNode,oldNode){
        var dom = newNode.getDom();
        this._renderModifyAttr(newNode,oldNode,dom);
        this._renderModifyText(newNode,oldNode,dom);
        this._bindModifyEvent(newNode,oldNode,dom);
    },
    //渲染更改类型dom的attr
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
    //渲染更改行dom的Text
    _renderModifyText:function(newNode,oldNode,dom){
        if(newNode.text!=oldNode.text){
            dom.data = newNode.text;
        }
        if(newNode.value!=oldNode.value){
            dom.value = newNode.value;
        }
    },
    //更新事件绑定
    _bindModifyEvent:function(newNode,oldNode,dom){
        var newEvents = newNode.getEventList();
        var oldEvents = oldNode.getEventList();
        var hitOlds = [].concat(oldEvents);
        for(var i=0;i<newEvents.length;i++){
            var newEvent = newEvents[i];
            var isNew = true;
            for(var j=0;j<hitOlds.length;j++){
                var oldEvent = hitOlds[j];
                if(newEvent.eventName==oldEvent.eventName && newEvent.callback==oldEvent.callback){
                    isNew = false;
                    hitOlds.splice(j,1);
                    break;
                }
            }
            if(isNew){
                newNode.bindEvent(newEvent,dom);
            }
        }
        for(var j=0;j<hitOlds.length;j++){
            oldNode.unbindEvent(oldEvent,dom);
        }
    },
    //将孩子节点变成key value形式 加速查找速度
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
    //对于新增的节点 直接使用下面的方法进行dom渲染
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
                    var value = vDomNode.value;
                    if(value){
                        ele.value = value;
                    }
                }
            }else{
                var text = vDomNode.text;
                var ele = document.createTextNode(text);
            }
            domP.appendChild(ele);
            domP = ele;
            vDomNode.setDom(domP);
            vDomNode.bindEvents();
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