//用户登录
var dbserver = require('../dao/dbserver')

exports.signIn = function(req,res){
    let data = req.body.user;
    let pwd = req.body.psw;
    // console.log(req.body);
    dbserver.userMatch(data,pwd,res);

}