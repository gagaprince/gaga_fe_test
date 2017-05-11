"use strict";
var UaUtil = {
    isMobile:function(){
        return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
    },
    isAndroid:function(){
        var ua = window.navigator.userAgent.toLowerCase();
        return /android/i.test(ua);
    },
    isIos:function(){
        var ua = window.navigator.userAgent.toLowerCase();
        return /iphone/i.test(ua);
    },
    isWeiXin:function(){
        var ua = window.navigator.userAgent.toLowerCase();
        return /micromessenger/i.test(ua);
    },
    getUa: function () {
        return window.navigator.userAgent.toLowerCase();
    }
}
module.exports = UaUtil;