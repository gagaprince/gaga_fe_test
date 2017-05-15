"use strict";
$(document).ready(function(){
    $('title').html("这是一个关于jq的测试页");
});

{
    let val1 = 1;
    var val2 = 2;
}
//console.log(val1);
console.log(val2);

const PI = 3.1415;
console.log(PI);

var [a,b,c]=[1,2,3];
console.log(a,b,c);

var map = new Map();
console.log(Map);
map.set('first', 'hello');
map.set('second', 'world');
for(let [,value] of map){
    console.log(value);
}

var fun = {
    say(){
        console.log("这是一个函数");
    }
}
fun.say();

var user = {
    "name":"gaga",
    "sex":1
};

Object.observe(user, function(changes){
    changes.forEach(function(change) {
        var fullName = user.name+" "+user.sex;
        console.log(fullName);
    });
});
