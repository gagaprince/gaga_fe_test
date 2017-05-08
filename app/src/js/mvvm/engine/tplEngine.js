"use strict";
/**
 * 模板引擎 将html模板分析成引擎tree
 * @type {TplTreeNode|exports}
 */
var TplTreeNode = require('./../tree/TplTreeNode');
var vDomNode = require('./../tree/vDomNode');
var allNullTag = '\s*(img|input|area|base|br)\s*'

var tplEngine = {
    compileTpl:function(template){
        return this.parseHtmlToTplTreeNode(template);
    },
    parseHtmlToTplTreeNode:function(template){
        var root = new TplTreeNode('tplRoot');
        this.treeCompile(template,root);
        return root;
    },
    treeCompile:function(template,node){
        var htmlTagReg = /<(\s*\/*([a-z]{1,})(\s+(.*?)=\s*\"(.*?)\"){0,}|\s*)>/gi; //匹配标签的html
        var beginTagInfos = [];       //其实标签栈 用来记录当前未闭合的标签
        var lastTagMatchArr = null;
        var tagMatchArr = htmlTagReg.exec(template);
//        console.log(tagMatchArr);
        var currentNode = node;
        for(;tagMatchArr;tagMatchArr=htmlTagReg.exec(template)){
            if(lastTagMatchArr){//如果存在上一次标签的匹配结果 则检查当前匹配开始下标与上次结尾之间的文字，建立一个文字节点
                var laseIndex = lastTagMatchArr.lastIndex;
                var currentIndex = tagMatchArr.index;
                var inHtml = template.substring(laseIndex,currentIndex).trim();
                if(inHtml!=""){
                    var child = this.createTplTreeNodeByText(inHtml);
                    currentNode.addChild(child);
                }
            }
            var tagHtml = tagMatchArr[0];
            var beginTagReg = /<\s*([a-z]{1,})\s+(((.*?)=\s*\"(.*?)\"){0,}\s*)>|<\s*([a-z]{1,})(\s*)>/gi; //有attr 和 没有attr两种
//            console.log(tagHtml);
            var beginMatchArr = beginTagReg.exec(tagHtml);
            if(beginMatchArr){//匹配上头标签
//                console.log(beginMatchArr);
                var beginRealArr = [];
                beginRealArr.push(beginMatchArr[0]);
                if(beginMatchArr[1]){//有attr的
                    beginRealArr.push(beginMatchArr[1]);
                    beginRealArr.push(beginMatchArr[2]);
                }else{
                    beginRealArr.push(beginMatchArr[6]);
                    beginRealArr.push(beginMatchArr[7]);
                }
                var node = this.createTplTreeNodeByArr(beginRealArr);
                currentNode.addChild(node);
                if(beginRealArr[1].match(new RegExp(allNullTag,"gi"))){//枚举所有空标签
                    //是一个空标签 比如 img
                }else{
                    currentNode = node;
                    beginTagInfos.push(tagMatchArr);
                }
            }else{
                var endTagReg = /<\s*\/(.*?)>/gi;
                var endArr = endTagReg.exec(tagHtml);
                if(endArr){
                    currentNode = currentNode.getParent();
                }
            }
            lastTagMatchArr = tagMatchArr;
            lastTagMatchArr.lastIndex = htmlTagReg.lastIndex;
        }
    },
    createTplTreeNodeByText:function(inHtml){
        if(inHtml){
            var textNode = new TplTreeNode();
            textNode.setTagName('G_text');
            textNode.setInner(inHtml);
            textNode.parseDirective();
            return textNode;
        }
        return null;
    },
    createTplTreeNodeByArr:function(matchArr){
        if(matchArr){
            var tplNode = new TplTreeNode();
            var tagName = matchArr[1];//标签名
            var attrMap = this.anysisAttrMap(matchArr[2]);
            tplNode.setTagName(tagName);
            tplNode.setAttrMap(attrMap);
            tplNode.parseDirective();
            return tplNode;
        }
        return null;
    },
    //把attr字符串变成map
    anysisAttrMap:function(attrStr){
        var map = {};
        attrStr = attrStr.trim();
        var attrReg = /(.*?)=\"(.*?)\"/gi;
        var attrMatch = attrReg.exec(attrStr);
        for(;attrMatch;attrMatch=attrReg.exec(attrStr)){
            map[attrMatch[1].trim()] = attrMatch[2].trim()||"";
        }
        return map;
    },
    /**
     * 将模板树 通过指令变为虚拟dom树
     * @param root
     * @param data
     */
    parseVDom:function(root,gv){
        var data = gv.$data;
        root.setScope(data,true);
        var vDomRoot = new vDomNode('vDomRoot');
        vDomRoot.setTarget(gv);
        this.createVdomTreeByTpl(vDomRoot,root);
        return vDomRoot
    },
    createVdomTreeByTpl:function(vDomParent,tplNodeParent){
        this.tplNodeExcuteDirBefore(vDomParent,tplNodeParent);
        var children = tplNodeParent.getChildren();
        var child = children[0];
        for(var i=0;child;child=children[++i]){
            var vDom=this.createProVdom(vDomParent);
            //console.log("createVdomTreeByTpl");
            //console.log(tplNodeParent.getScope());
            //console.log(child.getScope());
            child.setScopeIfNull(tplNodeParent.getScope());
            this.createVdomTreeByTpl(vDom,child);
            vDomParent.addChild(vDom);
            child.clearScope();
        }
        this.tplNodeExcuteDirAfter(vDomParent,tplNodeParent);
    },
    tplNodeExcuteDirBefore:function(vDom,tplNode){//执行 先序指令
        var dirs = tplNode.directives||[];
//        console.log(dirs);
        for(var i=0;i<dirs.length;i++){
            var dir = dirs[i];
            if(dir)
            {
                dir.excute(tplNode,vDom);
            }
        }
    },
    tplNodeExcuteDirAfter:function(vDom,tplNode){
        var dirs = tplNode.directives||[];
        for(var i=0;i<dirs.length;i++){
            var dir = dirs[i];
            if(dir)
            {
                dir.excuteAfter(tplNode,vDom);
            }
        }
    },
    createProVdom:function(vDomParent){
        var vDom = new vDomNode();
        vDom.setTarget(vDomParent.getTarget());
        return vDom;
    }
};
module.exports = tplEngine;