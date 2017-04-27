"use strict";
var TreeNode = require('./TreeNode');
var vDomNode = require('./vDomNode');
var valREG = /{{(.+?)}}/gi;
var htmlParentREG = /<\s*(div|span|p)(.*?)>(.*)<\s*\/\s*(div|span|p)\s*>/gi;

var TplTreeNode = TreeNode.extend({
    directive:null,//指令函数
    express:null,
    scorp:null,//数据空间
    setDirective:function(dir){
        this.directive = dir;

    },
    setScorp:function(scorp){
        this.scorp = scorp;
    },
    setExpress:function(express){
        this.express = express;
    },
    getExpress:function(){
        return this.express;
    },
    parseVdomByDirective:function(scorp,vDom){
        if(this.directive){
            //有指令操作的
            return this.directive.excute(this,scorp,vDom);
        }else{
            //没有指令操作
            return this.parseVdom(scorp,vDom);
        }
    },
    parseVdom:function(scorp,vDom){
        var children = this.getChildren();
        var vDomChildren = [];
        var selfNode = this._createVdom(scorp);
        if(!children || children.length==0){
            //没有子孩子，直接生成当前节点的 虚拟节点
            return selfNode;
        }else{
            for(var i=0;i<children.length;i++){
                var child = children[i];
                var vDomChild = child.parseVdomByDirective(scorp,selfNode);
                vDomChildren.push(vDomChild);
            }
        }
        vDom.addChildren(vDomChildren);
        return vDom;
    },
    _createVdom:function(scorp){
        var vDom = new vDomNode();
        var allHtml = this._compileToHtml(this.domText,scorp);
        vDom.setDomText(allHtml);
        return vDom;
    },
    _compileToHtml:function(tplText,data){
        if(!tplText)return "";
        var arr = valREG.exec(tplText);
        var tpl = 'return ',lastIndex=0;
        for(;arr;arr = valREG.exec(tplText)){
            var preStr = tplText.substring(lastIndex,arr.index);
            lastIndex = valREG.lastIndex;
            tpl+='\''+preStr.replace(/\'/g,'\\\'')+'\''+'+data.'+arr[1]+'+';
        }
        var afterStr = tplText.substring(lastIndex);
        tpl+='\''+afterStr.replace(/\'/g,'\\\'')+'\'';
        valREG.lastIndex=0;
        return new Function('data',tpl)(data);
    }
});
module.exports = TplTreeNode;