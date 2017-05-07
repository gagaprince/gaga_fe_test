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
                },
                children:[
                    {
                        name:"gaga"
                    },
                    {
                        name:"prince"
                    }
                ]
            }
        }
    });
    setTimeout(function(){
        _gv.$data.name = "大拽哥";
        _gv.$data.mum.name = "大拽姐";
        _gv.$data.children.push({
            name:"张艺馨"
        });
        _gv.$data.children[0].name="gagaprince";
    },2000);
})