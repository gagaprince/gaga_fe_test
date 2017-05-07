"use strict";
var TreeNode = require('./TreeNode');
var DirectiveMapUtil = require('../directives/DirectiveMap');


var TplTreeNode = TreeNode.extend({
    directives:null,//指令数组

    scope:null,//数据空间

    tagName:"",//记录标签类型 div等
    attrMap:"",//记录attr对象
    innerText:"",//标签内文本


    getAttrMap:function(){
        return this.attrMap;
    },
    setTagName:function(tagName){
        this.tagName = tagName;
    },
    getTagName:function(){
        return this.tagName;
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
        this.addNormalDirectives(directives);
        if(attrMap){
            for(var key in attrMap){
                var dirReg = /g-(.*)/gi;
                var matchArr = dirReg.exec(key);
                if(matchArr){
                    var dirKey = matchArr[1];
                    //console.log("g-");
                    //console.log(matchArr);
                    //console.log(dirKey);
                    //console.log(attrMap[key]);
                    var directiveClass = dirMap[dirKey];
                    if(directiveClass){
                        var directive = new directiveClass(attrMap[key]);
                        directives.push(directive);
                    }
                }
            }
        }
        //分析inner 将指令实例化
        if(this.innerText){
            var directiveClass = dirMap['insert'];
            if(directiveClass){
                var directive = new directiveClass("");
                directives.push(directive);
            }
        }
        directives = this.sortDirs(directives);
        this.directives = directives;
    },
    sortDirs:function(dirs){
        if(dirs){
            dirs.sort(function (item1,item2) {
                //console.log(item1.getRank());
                //console.log(item2.getRank());
                return item2.getRank()-item1.getRank();
            });
            //console.log(dirs);
            return dirs;
        }
        return [];
    },
    addNormalDirectives:function(dirs){
        var dirMap = DirectiveMapUtil.getMap();
        var namlKeys = ["ele"];
        for(var i=0;i<namlKeys.length;i++){
            var key = namlKeys[i];
            var dirClass=dirMap[key];
            if(dirClass){
                var directive = new dirClass("");
                dirs.push(directive);
            }
        }
    },


    setScope:function(scope,isCp){
        this.scope = isCp?this.cloneObj(scope):scope;
    },
    setScopeIfNull:function(scope){
        if(!this.scope){
            this.scope = scope;
        }
    },
    clearScope:function(){
        this.scope = null;
    },
    getScope:function(){
        return this.scope;
    },
    cloneScope:function(){
        return this.cloneObj(this.scope);
    },
    cloneObj:function(obj){
        var objCp = {};
        for(var key in obj){
            var val = obj[key];
            if(typeof val == "object"){
                objCp[key]=this.cloneObj(val);
            }else{
                objCp[key]=val;
            }
        }
        return objCp;
    },
    clone:function(){
        var cloneNode = new TplTreeNode();
        cloneNode.setTagName(this.tagName);
        cloneNode.setAttrMap(this.attrMap);
        cloneNode.setKey(this.key);
        cloneNode.directives = this.directives;
        return cloneNode;
    }
});
module.exports = TplTreeNode;