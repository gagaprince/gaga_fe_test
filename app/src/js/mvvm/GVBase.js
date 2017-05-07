"use strict";
var HClass = require('../base/HClass');
var insertDirective = require('./directives/insertDirective');
var ElementDirective = require('./directives/ElementDirective');
var ForDirective = require('./directives/ForDirective');
var DirectiveMapUtil = require('./directives/DirectiveMap');


var GVBase = HClass.extend({

});
GVBase.initDirective = function(){
    DirectiveMapUtil.register(insertDirective);
    DirectiveMapUtil.register(ElementDirective);
    DirectiveMapUtil.register(ForDirective);
}
GVBase.addDirective = function(){

}
module.exports = GVBase;