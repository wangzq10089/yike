var bcrypt = require('bcryptjs');

//生成密码
exports.encryption = function(e){
    //生成随机salt
    var salt = bcrypt.genSaltSync(10);

    //生成bash密码
    let hash = bcrypt.hashSync(e,salt);

    return hash;
}


//解密
exports.verification = function(e,hash){
    let verif = bcrypt.compareSync(e,hash)

    return verif;
}