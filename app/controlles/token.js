/**
 * Created by xuwusheng on 15/7/24.
 */

var jwt = require('jwt-simple');
var jwtTokenSecret = 'XINLINGJITANG-XXX-TOKEN';

module.exports.getToken = function (_iss, expires) {
    var token = jwt.encode({
        iss: _iss,
        exp: expires
    }, jwtTokenSecret);
    return token;
}
module.exports.verifyToken = function (req,res,next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    if (token) {
        try {
            var decoded = jwt.decode(token, jwtTokenSecret);
            if (decoded.exp <= Date.now()) {
                res.statusCode=4001;
                res.json({status: 4001, msg: '令牌失效'});
                res.end();
                return;
            }
            req.uid=decoded.iss;
        } catch (err) {
            res.statusCode=4000;
            res.json({status: 4000, msg: '令牌验证失败'});
            res.end();
            return;
        }
        next();
    } else {
        res.statusCode=4000;
        res.json({status: 4000, msg: '令牌验证失败'});
        res.end();
        return;
    }
}