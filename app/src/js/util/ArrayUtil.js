"use strict";
var ArrayUtil = {
    arrayIndexOf:function(array,ele){
        if(array){
            var eleIn = array[0];
            for(var i=0;eleIn;eleIn=array[++i]){
                if(eleIn==ele){
                    return i;
                }
            }
        }
        return -1;
    },
    arrayContains:function(array,ele){
        return this.arrayIndexOf(array,ele)!=-1;
    },
    arrayRemove:function(array,ele){
        var index = this.arrayIndexOf(array,ele);
        delete array[index];
    }
}
module.exports = ArrayUtil;