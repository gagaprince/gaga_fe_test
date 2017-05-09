var HClass = require('./base/HClass');
var BaseUtil = require('./util/BaseUtil');
var UrlUtil = require('./util/UrlUtil');

var gutil = window.gu = {
    GClass:HClass
}
BaseUtil.extend(gutil,BaseUtil,UrlUtil);

module.exports = gutil;