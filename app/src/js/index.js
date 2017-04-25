"use strict";
var GV = require('./mvvm/GV');
$(function(){
    var _gv = new GV({
        el:"test",
        data:function(){
            return {
                name:"王子冬",
                sex:"男",
                mum:{
                    name:"美女",
                    sex:"girl"
                }
            }
        }
    });
    setTimeout(function(){
        _gv.$data.name = "大拽哥";
        _gv.$data.mum.name = "大拽姐";
    },2000);
})