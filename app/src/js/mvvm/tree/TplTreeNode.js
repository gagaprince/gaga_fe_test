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
                var dirReg = /g-([^:]{1,}):*([^:]{0,})/gi;//g-on:click="clickMe"  on clickMe
                var matchArr = dirReg.exec(key);
                if(matchArr){
                    var dirKey = matchArr[1];
//                    console.log("g-");
//                    console.log(matchArr);
//                    console.log(dirKey);
//                    console.log(attrMap[key]);
                    var directiveClass = dirMap[dirKey];
                    if(directiveClass){
                        var directive = new directiveClass(attrMap[key],matchArr[2]);
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
    //对指令进行排序 这是因为指令有执行的先后顺序 比如 for指令要比bind 指令先执行
    sortDirs:function(dirs){
        if(dirs){
            dirs.sort(function (item1,item2) {
                //console.log(item1.getRank());
                //console.log(item2.getRank());
                return item1.getRank()-item2.getRank();
            });
            //console.log(dirs);
            return dirs;
        }
        return [];
    },
    //添加默认每个标签都有的指令 这里只添加了一个ele指令 用来对标签做初始化操作
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
    //设置scope 根节点上set的scope不能直接传值，否则会引入指令内改变scope的混乱
    //isCp指是否要使用浅cp来set
    setScope:function(scope,isCp){
        this.scope = isCp?this.cloneObj(scope,true):scope;
    },
    //如果当前节点的scope不是null的 说明已经有指令改变了scope值 则放弃此次设置
    setScopeIfNull:function(scope){
        if(!this.scope){
            this.scope = scope;
        }
    },
    //将scope清除
    clearScope:function(){
        this.scope = null;
    },
    //返回当前作用域
    getScope:function(){
        return this.scope;
    },
    //浅copyscope
    cloneScope:function(){
        return this.cloneObj(this.scope,true);
    },
    //深浅cp对象
    cloneObj:function(obj,isLow){
        if(!obj)return null;
        var objCp = {};
        for(var key in obj){
            var val = obj[key];
            if(typeof val == "object" && !isLow){
                objCp[key]=this.cloneObj(val);
            }else{
                objCp[key]=val;
            }
        }
        return objCp;
    },
    //clone当前节点
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