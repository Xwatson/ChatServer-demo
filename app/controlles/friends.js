/**
 * Created by xuwusheng on 15/8/5.
 */

var mongoose = require('mongoose');
var userSchema = require('../schemas/user');
var User = mongoose.model('user',userSchema);
var moment = require('moment')();
//登录
module.exports.myFriends = function (req, res) {
    var uid = req.uid;//用户id
    //获取好友...
}