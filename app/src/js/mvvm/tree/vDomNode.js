"use strict";
var TreeNode = require('./TreeNode');
var vDomNode = TreeNode.extend({
    tagName:"",
    id:'',
    className:'',
    value:'',
    text:'',
    tpl:null,
    ctor:function(key){
        this._super(key);
    }
});
module.exports = vDomNode;