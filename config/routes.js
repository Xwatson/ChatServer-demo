/**
 * Created by xuwusheng on 15/7/24.
 */

var User = require('../app/controlles/user');
var Token = require('../app/controlles/token');
var MyFriends = require('../app/controlles/friends');
module.exports = function (app) {
    app.get('/', function (req,res) {
        res.render('index',{layout:false,title:'EJS Index',say:'Hello Word'})
    })

    app.post('/singin', User.singin);
    app.post('/regist', User.regist);

    app.get('/service/*',Token.verifyToken);
    app.get('/service/verifyToken', User.getUsersByQqId);
    app.get('/service/openSocket',Token.verifyToken);
    app.get('/service/getFriends',MyFriends.myFriends);
    app.get('/service/getUsers',User.getUsers);
}