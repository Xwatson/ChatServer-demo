/**
 * Created by xuwusheng on 15/8/5.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var moment = require('moment')();
//登录
module.exports.myFriends = function (req, res) {
    var uid = req.uid;//用户id
    //获取好友...
}