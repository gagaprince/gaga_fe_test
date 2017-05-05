"use strict";
var GVBase = require('./GVBase');
var tplEngine = require('./engine/tplEngine');


var GV = GVBase.extend({
    $id:null,
    $dom:null,
    $data:null,
    $tplTree:null,



    $tpl:null,
    _renderlock:null,

    ctor:function(options){
        this.$id = options&&options.el;
        this.$data = options&&options.data&&options.data()||{};
        //根据id获取模板内容 再根据模板内容分析出模板树
        this.compileTplById();

        /*this.compileDom();
        this.compileData(this.$data);
        this.render();
        tplEngine.compileTpl(this.$id,this.$data);*/
    },
    compileTplById:function(){
        var id = this.$id;
        var dom = this.$dom = document.getElementById(id);
        var innerHtml = dom.innerHTML;
        this.compileDomByTemplate(innerHtml);
    },
    compileDomByTemplate:function(template){
        this.$tplTree = tplEngine.compileTpl(template);//通过模板引擎 分析出模板树
    },




    compileDom:function(){
        var id = this.$id;
        var dom = this.$dom = document.getElementById(id);
        var innerHtml = dom.innerHTML;
        this.$tpl = tplEngine.compileDom(id,innerHtml);
    },

    _compileObj:function(obj,key,defaultVal){
        var _this = this;
        var val = defaultVal;
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            set: function(name) {
                val = name;
                if(typeof name=="object"){
                    _this.compileData(name);
                }
                _this.postRender();
            },
            get: function() {
                return val;
            }
        });
    },
    compileData:function(data){
        for(var key in data){
            var val = data[key];
            if(typeof val == "object"){
                this.compileData(val);
            }
            this._compileObj(data,key,data[key]);
        }
    },
    postRender:function(){
        if(this._renderlock){
            clearTimeout(this._renderlock);
            this._renderlock = null;
        }
        var _this = this;
        this._renderlock = setTimeout(function(){
            _this.render();
        });
    },
    render:function(){
//        console.log(this.$data);
        var html = this.$tpl(this.$data);
        this.$dom.innerHTML = html;
    }

});


module.exports = GV;
