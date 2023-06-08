//token
//引入token
var jwt = require('jsonwebtoken')

exports.generateToken = function(id,res){
    let payload = {id: id, time: new Date()}
    let secret = 'yikeshiguang';
    let token = jwt.sign(payload,secret,{ expiresIn: 60*60*24*120 })

    return token;
}

exports.verifyToken = function(e){
    let paylaod = jwt.verify(e,secret);

    
    return paylaod;
}