"use strict";
var TreeNode = require('./TreeNode');
var DirectiveMapUtil = require('../directives/DirectiveMap');
var vDomNode = require('./vDomNode');

var TplTreeNode = TreeNode.extend({
    directives:null,//指令数组

    scorp:null,//数据空间

    tagName:"",//记录标签类型 div等
    attrMap:"",//记录attr对象
    innerText:"",//标签内文本


    setTagName:function(tagName){
        this.tagName = tagName;
    },
    setInner:function(inner){
        this.innerText = inner;
    },
    getInner:function(){
        return this.innerText;
    },
    setAttrMap:function(attrMap){
        this.attrMap = attrMap;
    },

    parseDirective:function(){
        //分析attrMap将指令实例化
        var attrMap = this.attrMap;
        var dirMap = DirectiveMapUtil.getMap();
        var directives = this.directives;
        if(attrMap){
            for(var key in attrMap){
                var dirReg = /g-(.*?)/gi;
                var matchArr = dirReg.exec(key);
                if(matchArr){
                    var dirKey = matchArr[1];
                    var directiveClass = dirMap[dirKey];
                    if(directiveClass){
                        var directive = directiveClass.createDirByExpress(attrMap[key]);
                        directives.push(directive);
                    }
                }
            }
        }
        //分析inner 将指令实例化
        if(this.innerText){
            var directiveClass = dirMap['insert'];
            if(directiveClass){
                var directive = directiveClass.createDirByExpress("");
                directives.push(directive);
            }
        }

    },


    setScorp:function(scorp){
        this.scorp = scorp;
    },

    parseVdom:function(scorp,vDom){

    }
});
module.exports = TplTreeNode;