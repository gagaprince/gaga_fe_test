"use strict";
var HClass = require('../base/HClass');
var insertDirective = require('./directives/insertDirective');
var DirectiveMapUtil = require('./directives/DirectiveMap');


var GVBase = HClass.extend({

});
GVBase.initDirective = function(){
    DirectiveMapUtil.register(insertDirective);
}
GVBase.addDirective = function(){

}
module.exports = GVBase;