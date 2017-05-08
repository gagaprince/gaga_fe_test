"use strict";
var GV = require('./mvvm/GV');
$(function(){
    var _gv = new GV({
        el:"test",
        data:function(){
            return {
                name:"王子冬",
                sex:"男",
                imgLink:"http://t2.27270.com/uploads/tu/201612/98/st93.png",
                mum:{
                    name:"美女",
                    sex:"girl",
                    age:25
                },
                children:[
                    {
                        name:"gaga",
                        age:20
                    },
                    {
                        name:"prince",
                        age:40
                    }
                ]
            }
        },
        methods:{
            clickMe:function(e){
                console.log(this);
                console.log(e);
            }
        }
    });
    setTimeout(function(){
        _gv.$data.name = "大拽哥";
        _gv.$data.mum.name = "大拽姐";
        _gv.$data.mum.age = 34;
        _gv.$data.children.push({
            name:"狗娃",
            age:45
        });
        _gv.$data.children[0].name="gagaprince";
    },2000);
})