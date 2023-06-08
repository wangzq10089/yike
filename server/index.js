
var dbserver = require('../dao/dbserver')

exports.getFriend = function(req,res){
    let data = req.body

    dbserver.getUser(data,res)
}

//获取最后一条消息
exports.getLastMsg = function(req,res){
    let data = req.body

    dbserver.getOneMsg(data,res)
}

//获取未读消息数
exports.unreadMsg = function(req,res){
    let data = req.body

    dbserver.unreadMsg(data,res)
}

//未读消息清零
exports.readedMsg = function(req,res){
    let data = req.body

    dbserver.readedMsg(data,res)
}