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
    }
}
module.exports = UrlUtil;