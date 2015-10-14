/**
 * Created by xuwusheng on 15/7/24.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var moment = require('moment')();
var token = require('./token');
var jsonpCB='angular.callbacks._0';
//登录
module.exports.singin = function (req, res) {
    jsonpCB = req.query['callback'];
    var _user = {
        registId:req.body['name'],
        password:req.body['pwd']
    };
    User.findByRegistId(_user.registId, function (err, user) {
        if (err) {
            console.log("系统错误：" + err);
            res.json({status: 500, msg: '系统错误，请联系管理员！'});
            res.end();
            return;
        }
        if (!user) {
            var resJson={"status": 400, "msg": "用户名或密码错误!"};
            if(!jsonpCB)
                res.json(resJson);
            else
                res.write(jsonpCB+'('+JSON.stringify(resJson)+')');
            res.end();
            return;
        }
        user.comparePassword(_user.password, function (err, isMatch) {
            if (err) {
                console.log("系统错误：" + err);
                var resJson={status: 500, msg: '系统错误，请联系管理员！'};
                if(!jsonpCB)
                    res.json(resJson);
                else
                    res.write(jsonpCB+'('+JSON.stringify(resJson)+')');
                res.end();
                return;
            }
            if (isMatch) {
                User.update({_id:user._id},{$set:{state:1}});

                //登录成功 分配token
                var expires = moment.add(7,'days').valueOf();
                var resJson={
                    status: 200,
                    msg: 'ok',
                    token: token.getToken(user._id,expires),//获取token
                    expires: expires,
                    user: user.toJSON()
                };
                res.json(resJson);
            } else {
                var resJson={status: 400, msg: '密码错误'};
                if(!jsonpCB)
                    res.json(resJson);
                else
                    res.write(jsonpCB+'('+JSON.stringify(resJson)+')');
            }
            res.end();
        })
    })
}
//注册
module.exports.regist= function (req,res) {
    var _user = {
        registId:req.body['name'],
        password:req.body['pwd'],
        state:1,
        code:req.body['code']
    };
    User.findByRegistId(_user.registId, function (err,user) {
        if(err){
            console.log("系统错误：" + err);
            res.json({status: 500, msg: '系统错误，请联系管理员！'});
            res.end();
            return;
        }
        if(user){
            //用户已存在
            res.json({status: 300, msg: '用户存在'});
            res.end();
            return;
        }
        user = new User(_user);
        user.save(function (err, user) {
            if(err){
                console.log("系统错误：" + err);
                res.json({status: 500, msg: '系统错误，请联系管理员！'});
                res.end();
                return;
            }
            var expires = moment.add(7,'days').valueOf();
            res.json({
                    status: 200,
                msg: 'ok',
                token: token.getToken(user._id,expires),//获取token
                expires: expires,
                user: user.toJSON()
            });
        })
    })
}
//获取所有
module.exports.getUsers = function (req,res) {
    //待开发 根据位置获取用户
    User.findByWhere({'_id':{'$ne':req.uid},'state':1}, function (err,users) {
        if(err){
            console.log("系统错误：" + err);
            res.json({status: 500, msg: '系统错误，请联系管理员！'});
            res.end();
            return;
        }
        res.json(users);
        res.end();
    })
}
//根据登陆token获取
module.exports.getUsersByQqId = function (req,res) {

    User.findByWhere({'_id':req.uid}, function (err,users) {
        if(err){
            console.log("系统错误：" + err);
            res.json({status: 500, msg: '系统错误，请联系管理员！'});
            res.end();
            return;
        }
        res.json(users[0]);
        res.end();
    })
}