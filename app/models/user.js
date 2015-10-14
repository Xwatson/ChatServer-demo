/**
 * Created by xuwusheng on 15/7/24.
 */
var mongoose = require('mongoose');
var userSchema = require('../schemas/user');
//关联数据库
var User = mongoose.model('User', userSchema);
module.exports = User;