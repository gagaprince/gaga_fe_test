var HClass = require('./base/HClass');
var BaseUtil = require('./util/BaseUtil');
var UrlUtil = require('./util/UrlUtil');
var PromiseUtil = require('./util/PromiseUtil');
var DateUtil = require('./util/DateUtil');
var EventManager = require('./util/EventManager');
var ArrayUtil = require('./util/ArrayUtil');
var UaUtil = require('./util/UaUtil');
var MD5Util = require('./util/MD5Util');
var Base64Util = require('./util/Base64Util');

var gutil = window.gu = {
    GClass:HClass
}
BaseUtil.extend(gutil,BaseUtil);
BaseUtil.extend(gutil,UrlUtil);
BaseUtil.extend(gutil,PromiseUtil);
BaseUtil.extend(gutil,DateUtil);
BaseUtil.extend(gutil,EventManager);
BaseUtil.extend(gutil,ArrayUtil);
BaseUtil.extend(gutil,UaUtil);
BaseUtil.extend(gutil,MD5Util);
BaseUtil.extend(gutil,Base64Util);

module.exports = gutil;