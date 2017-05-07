"use strict";
var TreeNode = require('./TreeNode');
var DirectiveMapUtil = require('../directives/DirectiveMap');


var TplTreeNode = TreeNode.extend({
    directives:null,//指令数组

    scope:null,//数据空间

    tagName:"",//记录标签类型 div等
    attrMap:"",//记录attr对象
    innerText:"",//标签内文本

    proVdom:null,



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
        var directives = [];
        if(attrMap){
            for(var key in attrMap){
                var dirReg = /g-(.*?)/gi;
                var matchArr = dirReg.exec(key);
                if(matchArr){
                    var dirKey = matchArr[1];
                    var directiveClass = dirMap[dirKey];
                    if(directiveClass){
                        var directive = new directiveClass();
                        directive.initWithExpress(attrMap[key]);
                        directives.push(directive);
                    }
                }
            }
        }
        //分析inner 将指令实例化
        if(this.innerText){
            var directiveClass = dirMap['insert'];
            console.log("parseDirective");
            if(directiveClass){
                var directive = new directiveClass();
                directive.initWithExpress("");
                directives.push(directive);
            }
        }
        this.directives = directives;
    },


    removeProVdom:function(){
        this.proVdom = null;
    },


    setScope:function(scope){
        this.scope = scope;
    },
    getScope:function(){
        return this.scope;
    }
});
module.exports = TplTreeNode;