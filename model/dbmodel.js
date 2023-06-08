var mongoose = require('mongoose');
var db = require('../config/db');
var Schema = mongoose.Schema;

//用户表
var UserSchema = new Schema({
    name: { type: String },
    psw: { type: String },
    email: { type: String, default: '未绑定邮箱' },
    nackname: { type: String, default: ''+new Date() },
    sex: { type: String, default: '未知' },
    birth: { type: Date, default: '2002-1-25' },
    phone: { type: Number, default: '123123' },
    explain: { type: String, default: '这个人很懒，什么都没有留下' },
    imgurl: { type: String, default: '/user/o.png' },
    time: { type: Date },
});

//好友表
var FriendSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    friendId: { type: Schema.Types.ObjectId, ref: 'User' },
    state: { type: String },
    time: { type: Date },
    lastTime: { type: Date },
});

//一对一好友表
var MessageSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    friendId: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    types: { type: String },
    time: { type: Date },
    state: { type: Number },
});

module.exports = db.model('User', UserSchema);
module.exports = db.model('Friend', FriendSchema);
module.exports = db.model('Message', MessageSchema);
