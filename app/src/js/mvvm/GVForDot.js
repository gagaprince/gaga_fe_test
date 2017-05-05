"use strict";
var HClass = require('../base/HClass');
var doT = require('../../../../bower_components/doT/doT.js');
var DiffEngine = require('./vDomDiff/DiffEngine');

var GV = window.GV = HClass.extend({
    $id:null,
    $dom:null,
    $data:null,
    $tpl:null,
    _renderlock:null,
    diffEngine:null,
    currentRenderTree:null,

    ctor:function(options){
        this.$id = options&&options.el;
        this.$data = options&&options.data&&options.data()||{};
        this.diffEngine = new DiffEngine();
        this.compileDom();
        this.compileData(this.$data);
        this.render();
    },
    compileDom:function(){
        var id = this.$id;
        var dom = this.$dom = document.getElementById(id);
        var innerHtml = dom.innerHTML;
        this.$tpl = doT.template(innerHtml);
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
        console.log(html);
        var vDomRoot = this.diffEngine.parseHtmlToVDom(html);
        if(this.currentRenderTree){
            console.log(this.currentRenderTree);
            console.log(vDomRoot);
            this.diffEngine.diffTree(this.currentRenderTree,vDomRoot);
            console.log(this.currentRenderTree);
            console.log(vDomRoot);
//            this.diffEngine.renderDiffTree(vDomRoot);
//            this.currentRenderTree
        }else{

            vDomRoot.setDom(this.$dom);
            this.$dom.innerHTML = '';
            this.diffEngine.renderNormalTree(vDomRoot);
        }
        this.currentRenderTree = vDomRoot;
//        this.$dom.innerHTML = html;
    }

});
module.exports = GV;
