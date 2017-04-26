"use strict";
var HClass = require('../base/HClass');

var valREG = /{{(.+?)}}/gi;

var GV = HClass.extend({
    $id:null,
    $dom:null,
    $data:null,
    $tpl:null,
    _renderlock:null,

    ctor:function(options){
        this.$id = options&&options.el;
        this.$data = options&&options.data&&options.data()||{};
        this.compileDom();
        this.compileData(this.$data);
        this.render();
    },
    compileDom:function(){
        var id = this.$id;
        var dom = this.$dom = document.getElementById(id);
        var innerHtml = dom.innerHTML;
        var arr = valREG.exec(innerHtml);
        var tpl = 'return ',lastIndex=0;
        for(;arr;arr = valREG.exec(innerHtml)){
            console.log(arr);
            var preStr = innerHtml.substring(lastIndex,arr.index);
            lastIndex = valREG.lastIndex;
            tpl+='\''+preStr.replace(/\'/g,'\\\'')+'\''+'+data.'+arr[1]+'+';
        }
        var afterStr = innerHtml.substring(lastIndex);
        tpl+='\''+afterStr.replace(/\'/g,'\\\'')+'\'';
        this.$tpl = new Function('data',tpl.replace(/\n/g,''));
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
        console.log(this.$data);
        var html = this.$tpl(this.$data);
        this.$dom.innerHTML = html;
    }

});
module.exports = GV;
