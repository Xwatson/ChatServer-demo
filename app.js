/**
 * Created by xuwusheng on 15/7/23.
 */
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var app = express();
var http = require('http').Server(app);
var socketIo = require('socket.io')(http).listen(3001);
var fs = require('fs');
var dbUrl = 'mongodb://localhost/xinlingjitang';
mongoose.connect(dbUrl);
// 加载models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs
        .readdirSync(path)
        .forEach(function(file) {
            var newPath = path + '/' + file;
            var stat = fs.statSync(newPath);

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath)
                }
            }
            else if (stat.isDirectory()) {
                walk(newPath)
            }
        })
}
walk(models_path);
app.set('views', './app/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({entended:false}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');//允许所有域名请求 防止跨域
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');
    next();
});
require('./config/routes')(app);
require('./app/controlles/chat')(socketIo);

app.listen(port);


app.use(express.static(path.join(__dirname, 'public')));


console.log('xljt服务器启动 端口：'+port);
//状态码
/*
200:成功
300:冲突
400:没找到
401:没找到(经过查询找不到)
500:服务器错误
4001:令牌失效
4000:令牌不存在
*/
