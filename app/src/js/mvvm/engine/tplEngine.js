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
        //将html生成模板树
        return this.parseHtmlToTplTreeNode(template);
    },
    parseHtmlToTplTreeNode:function(template){
        var root = new TplTreeNode('tplRoot');
        this.treeCompile(template,root);
        return root;
    },
    treeCompile:function(template,node){
        //分析html结构 使用正则表达式匹配 标签，判断是空标签 头标签 和 尾标签 从而做不同的操作
        //匹配所有html结构
        var htmlTagReg = /<(\s*\/*([a-z]{1,})(\s+(.*?)=\s*\"(.*?)\"){0,}|\s*)>/gi; //匹配标签的html
        //var beginTagInfos = [];       //其实标签栈 用来记录当前未闭合的标签
        var lastTagMatchIndex = null;     //上次匹配的尾节点下标
        var tagMatchArr = htmlTagReg.exec(template);//匹配字符模板
//        console.log(tagMatchArr);
        var currentNode = node; //当前模板节点指向传入节点 （根节点）
        for(;tagMatchArr;tagMatchArr=htmlTagReg.exec(template)){//循环匹配标签
            if(lastTagMatchIndex){//如果存在上一次标签的匹配结果 则检查当前匹配开始下标与上次结尾之间的文字，建立一个文字节点
                var laseIndex = lastTagMatchIndex;
                var currentIndex = tagMatchArr.index;
                var inHtml = template.substring(laseIndex,currentIndex).trim();
                if(inHtml!=""){
                    var child = this.createTplTreeNodeByText(inHtml);
                    currentNode.addChild(child);
                }
            }
            var tagHtml = tagMatchArr[0];
            //头标签的匹配串
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
                    //空标签没有尾标签 所以不需要将当前node移项
                }else{
                    currentNode = node;
                }
            }else{
                //如果是尾标签 则将当前节点上移
                var endTagReg = /<\s*\/(.*?)>/gi;
                var endArr = endTagReg.exec(tagHtml);
                if(endArr){
                    currentNode = currentNode.getParent();
                }
            }
            lastTagMatchIndex = htmlTagReg.lastIndex; //移动lastTagMatchIndex
        }
    },
    /**
     * 创造一个文字节点
     * @param inHtml 文字内容
     * @returns {*}
     */
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
    /**
     * 创造一个一般的虚拟节点标签
     * @param matchArr
     * @returns {*}
     */
    createTplTreeNodeByArr:function(matchArr){
        if(matchArr){
            var tplNode = new TplTreeNode();
            var tagName = matchArr[1];//标签名
            var attrMap = this.anysisAttrMap(matchArr[2]);
            tplNode.setTagName(tagName);
            tplNode.setAttrMap(attrMap);
            tplNode.parseDirective();//解析指令
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
        //初始化vdom根节点 传入scope
        var data = gv.$data;
        root.setScope(data,true);
        var vDomRoot = new vDomNode('vDomRoot');
        vDomRoot.setTarget(gv);
        this.createVdomTreeByTpl(vDomRoot,root);
        return vDomRoot
    },
    //通过模板tree 生成 虚拟dom tree
    createVdomTreeByTpl:function(vDomParent,tplNodeParent){
        this.tplNodeExcuteDirBefore(vDomParent,tplNodeParent);//广度遍历前执行指令
        var children = tplNodeParent.getChildren();
        var child = children[0];
        for(var i=0;child;child=children[++i]){
            var vDom=this.createProVdom(vDomParent);
            //console.log("createVdomTreeByTpl");
            //console.log(tplNodeParent.getScope());
            //console.log(child.getScope());
            child.setScopeIfNull(tplNodeParent.getScope());//设置子节点 scope 如果子节点 通过指令形式设置了scope 则放弃
            this.createVdomTreeByTpl(vDom,child);   //建立子节点
            vDomParent.addChild(vDom);              //将子节点加入父级节点
            child.clearScope(); //清除子节点 scope
        }
        this.tplNodeExcuteDirAfter(vDomParent,tplNodeParent);//广度遍历后 执行指令
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
    tplNodeExcuteDirAfter:function(vDom,tplNode){//执行后续指令
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