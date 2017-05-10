"use strict";
var DateUtil = {
    now:function(){
        return new Date();
    },
    parseDate:function(dateStr){//必须是标准字符串 yyyy-MM-dd hh:mm:ss
        if(dateStr){
            try{
                var date = new Date(dateStr.replace(/-/g,"/"));
                return date;
            }catch(e){
                throw "传入的日期字符串必须为标准的 yyyy-MM-dd hh:mm:ss 形式~";
            }
        }
        return null;
    },
    dateAdd:function(date,nms){
        date = this._parseArgDate(date);
        var time = date.getTime();
        date.setTime(time+nms);
        return date;
    },
    _dateWeekDay:function(date){
        var weekDay = ["日","一","二","三","四","五","六"];
        return weekDay[date.getDay()];
    },
    dateFormat:function(date,fmt){
        if(!fmt){
            fmt = "yyyy-MM-dd hh:mm:ss"
        }
        date = this._parseArgDate(date);
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "D+": this._dateWeekDay(date),
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    compareDate:function(date1,date2){
        date1 = this._parseArgDate(date1);
        date2 = this._parseArgDate(date2);
        var time1 = date1.getTime();
        var time2 = date2.getTime();
        return time1>time2;
    },
    _parseArgDate:function(date){
        if(date instanceof Date){}else{
            date = this.parseDate(date);
            if(!date){
                date = new Date();
            }
        }
        return date;
    }
}
module.exports = DateUtil;