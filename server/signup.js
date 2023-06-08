var dbserver = require('../dao/dbserver')

//用户注册
exports.signUp = function(req,res){
    // console.log(req.body);

    let name = req.body.name;
    let psw = req.body.psw; 

    dbserver.buildUser(name,psw,res)
}