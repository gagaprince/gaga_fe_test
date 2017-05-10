var HClass = require('./base/HClass');
var BaseUtil = require('./util/BaseUtil');
var UrlUtil = require('./util/UrlUtil');
var PromiseUtil = require('./util/PromiseUtil');
var DateUtil = require('./util/DateUtil');
var EventManager = require('./util/EventManager');

var gutil = window.gu = {
    GClass:HClass
}
BaseUtil.extend(gutil,BaseUtil,UrlUtil,PromiseUtil,DateUtil);
BaseUtil.extend(gutil,EventManager);

module.exports = gutil;