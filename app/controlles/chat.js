/**
 * Created by xuwusheng on 15/8/11.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var moment = require('moment')();
module.exports= function (io) {
    var connectCount=0;
    var onlineUser={};
    //链接
    io.on('connection', function (socket) {
        socket.on('login', function (uid) {
            socket.uid=uid;
            if(!onlineUser.hasOwnProperty(uid)){
                onlineUser[uid]=uid;
                connectCount++;
                console.log('用户'+socket.uid+' 登录 当前在线人数：'+connectCount);
                User.update({_id:socket.uid,state:0},{$set:{state:1}}, function (err,user) {

                });
            }
        });
        //发送消息
        socket.on('message', function (from,to,msg) {
            console.log(msg);
            msg.time=moment.format('YYYY-MM-dd HH:mm');
            //在线
            if(onlineUser.hasOwnProperty(to)){
                io.emit('message_'+to,from,msg);
            }else{
                //存入消息库
            }

        });
        //监听退出
        socket.on('disconnect', function () {
            //设置离线状态
            if(onlineUser.hasOwnProperty(socket.uid)){
                connectCount--;
                console.log('用户'+socket.uid+' 退出 当前在线人数：'+connectCount);
                delete onlineUser[socket.uid];
                User.update({_id:socket.uid},{$set:{state:0}}, function (err,user) {
                    io.emit('loginout',socket.uid);
                });
            }
        })
    })
}