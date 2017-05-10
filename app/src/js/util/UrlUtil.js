"use strict";
var UrlUtil = {
    getQueryString:function(name,urldefault) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var url = urldefault || window.location.search.substr(1);
        var r = url.match(reg);
        if (r != null)
            return decodeURIComponent(r[2]);
        return "";
    },
    getQueryStringObj:function(urldefault){
        var url = urldefault || window.location.search.substr(1);
        var reg = /([^&]*)=([^&]*)(&|\s*)/gi;
        var obj = {};
        url.replace(reg,function($1,$2,$3){
            obj[$2]=$3;
            return "";
        });
        return obj;
    },
    getcookie:function(O) {
        var o = "",
            l = O + "=";
        if (document.cookie.length > 0) {
            var i = document.cookie.indexOf(l);
            if (i != -1) {
                i += l.length;
                var I = document.cookie.indexOf(";", i);
                if (I == -1) I = document.cookie.length;
                o = decodeURIComponent(document.cookie.substring(i, I));
            }
        }
        return o;
    },
    setcookie:function(n, v, t, p, c) {
        var T = "";
        if (t) {
            T = new Date((new Date()).getTime() + t);
            T = "; expires=" + T.toGMTString();
        }
        document.cookie = n + "=" + encodeURIComponent(v) + T + (p ? ';path=' + p : '/') + (c ? ';domain=' + c : '');
    },
    getStorage:function(key){
        if(!window.localStorage)return;
        var str = window.localStorage.getItem(key);
        if(typeof str !== 'undefined' && str !== 'undefined' && str !== null){
            return JSON.parse(str);
        }else{
            return null;
        }
    },
    setStorage:function(key,value){
        if(!window.localStorage)return;
        window.localStorage.setItem(key,JSON.stringify(val));
    },
    removeStorage:function(key){
        if(!window.localStorage)return;
        window.localStorage.removeItem(key);
    }
}
module.exports = UrlUtil;