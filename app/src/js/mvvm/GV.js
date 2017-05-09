"use strict";
var GVBase = require('./GVBase');
var tplEngine = require('./engine/tplEngine');
var diffEngine = require('./engine/DiffEngine');

GVBase.initDirective();
var GV = GVBase.extend({
    //dom id
    $id:null,
    //dom根节点
    $dom:null,
    //传入的双向绑定的模型
    $data:null,
    //传入的模型方法
    $methods:null,
    //生成的模板树
    $tplTree:null,
    //生成的虚拟dom树
    $vDomTree:null,
    //上一次已经渲染过的 虚拟dom树
    $currentRenderTree:null,
    //渲染方法执行的lock
    _renderlock:null,
    //绑定数据执行的函数空间 会把data和methods都merge到这个对象中
    self:null,
    /**
     * 构造方法 传入 文档id  绑定数据结构  数据方法
     * @param options
     */
    ctor:function(options){
        //对内部赋值
        this.$id = options&&options.el;
        this.$data = options&&options.data&&options.data()||{};
        this.$methods = options&&options.methods||{}
        this.addNativeMethods();//添加内置方法
        this.mergeSelf();//生成执行函数空间
        //设置正向数据流 mv
        this.compileData(this.$data);
        //根据id获取模板内容 再根据模板内容分析出模板树
        this.compileTplById();
    },
    /**
     * 添加内置的模板方法
     * 方法写在GVbase中
     */
    addNativeMethods:function(){
        var nativeMethod = this.nativeMethods||{};
        for(var key in nativeMethod){
            this.$methods[key]=nativeMethod[key];
        }
    },
    mergeSelf:function(){
        if(!this.self){
            this.self = {};
        }
        for(var key in this.$data){
            this.self[key] = this.$data[key];
        }
        for(var key in this.$methods){
            this.self[key] = this.$methods[key];
        }
    },
    compileTplById:function(){
        var id = this.$id;
        var dom = this.$dom = document.getElementById(id);
        var innerHtml = dom.innerHTML;
        this.compileDomByTemplate(innerHtml);
        this.compileVDomByTplTree();
        this.render();
    },
    compileDomByTemplate:function(template){
        this.$tplTree = tplEngine.compileTpl(template);//通过模板引擎 分析出模板树
        console.log(this.$tplTree);
    },
    compileVDomByTplTree:function(){
        //使用模板引擎通过模板树 构造虚拟dom树
        this.$vDomTree = tplEngine.parseVDom(this.$tplTree,this);
//        console.log(this.$vDomTree);
    },
    _compileObj:function(obj,key,defaultVal){
        var _this = this;
        var val = defaultVal;
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            set: function(name) {
                val = name;
                //如果set的是对象 要将此对象重新compile
                if(typeof name=="object"){
                    _this.compileData(name);
                }
                //当数据改变时 调用postRender重新渲染页面
                _this.postRender();
            },
            get: function() {
                return val;
            }
        });
    },
    compileData:function(data){
        //使用深度遍历 将data中每一个对象都设置set方法
        for(var key in data){
            var val = data[key];
            if(typeof val == "object"){
                this.compileData(val);
            }
            //设置set方法
            this._compileObj(data,key,data[key]);
        }
    },
    postRender:function(){
        //每次数据改变时都会调用，但是会使用setTimeout 保证一次程序执行的所有set 只执行一次render
        if(this._renderlock){
            clearTimeout(this._renderlock);
            this._renderlock = null;
        }
        var _this = this;
        this._renderlock = setTimeout(function(){
            _this.reRender();
        });
    },
    reRender:function(){
        //重新生成虚拟dom
        this.compileVDomByTplTree();
        //根据新生成的虚拟dom和原来的虚拟dom做diff 然后操作dom
        this.render();
    },
    render:function(){
//        console.log(this.$data);
        var vDomRoot = this.$vDomTree;
        //如果之前已经渲染过了 则使用diff算法渲染
        if(this.$currentRenderTree){
            //console.log(this.$currentRenderTree);
            //console.log(vDomRoot);
            diffEngine.diffTree(this.$currentRenderTree,vDomRoot);
            //console.log(this.$currentRenderTree);
            //console.log(vDomRoot);
        }else{//如果之前没有渲染过 则直接按照正常模式渲染
            vDomRoot.setDom(this.$dom);
            this.$dom.innerHTML = '';
            diffEngine.renderNormalTree(vDomRoot);
        }
        this.$currentRenderTree = vDomRoot;
    },
    getSelf:function(){
        return this.self;
    }
});
GV.addDirective = GVBase.addDirective

module.exports = GV;
