var dbserver = require('../dao/dbserver')

exports.searchUser = function(req,res){
    let data = req.body.data;
    dbserver.searchUser(data,res);
}

exports.isFriend = function(req,res){
    console.log(req.body);
    let uid = req.body.uid
    let fid = req.body.fid

    dbserver.isFriend(uid,fid,res)
}