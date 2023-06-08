var dbmodel = require('../model/dbmodel')
var User = dbmodel.model('User');
var Friend = dbmodel.model('Friend')
var Message = dbmodel.model('Message')

var jwt = require('../dao/jwt')

var bcrypt = require('../dao/bcrypt')

// test
exports.findUser = function (res) {
	User.find().then(data => {
		res.send(data)
		console.log(data);
	}).catch(err => {
		console.log(err);
	})
}


//新建用户
exports.buildUser = function (name, pwd, res) {
	let password = bcrypt.encryption(pwd);

	let data = {
		name: name,
		psw: password,
		nackname: name,
		imgurl: 'd_head.png',
		email: '用户未绑定邮箱',
		time: new Date()
	}

	let user = new User(data);

	user.save().then(result => {
		res.send(result)
		// console.log(result);
	}).catch(err => {
		console.log(err);
		res.send(err)
	})
}

//匹配用户表
exports.countUserValue = function (data, type, res) {
	let wherestr = {}

	wherestr[type] = data;

	User.countDocuments(wherestr).then((result, err) => {
		if (err) {
			res.send(err)
		} else {
			res.send(result)
		}
	})
}

//用户登录
exports.userMatch = function (data, pwd, res) {
	let wherestr = { 'name': data }
	let out = { 'name': 1, 'imgurl': 1, 'psw': 1, 'sex': 1, 'nackname': 1, 'explain': 1}
	console.log(data, pwd);

	User.find(wherestr, out).then(result => {

		if (result == '') {
			res.send({ status: 400 })
		}
		result.map(function (e) {
			const pwdMatch = bcrypt.verification(pwd, e.psw);
			if (pwdMatch) {
				let token = jwt.generateToken(e._id)
				let back = {
					id: e._id,
					name: e.name,
					imgurl: e.imgurl,
					sex: e.sex,
					nackname: e.nackname,
					explain: e.explain,
				}

				res.send({ status: 200, back })
			} else {
				res.send({ status: 400 })
			}
		})

	}).catch(err => {
		res.send({ status: 400 })
	})
}



//搜索用户
exports.searchUser = function (data, res) {
	let wherestr;
	if (data == 'yike') {
		wherestr = {};
	} else {
		wherestr = { $or: [{ 'name': { $regex: data } }, { 'email': { $regex: data } }] };
	}

	let out = {'_id': 1, 'name': 1, 'email': 1, 'imgurl': 1 }

	User.find(wherestr, out).then(result => {
		res.send({ status: 200, result })
	}).catch(err => {
		res.send({ status: 500 })
	})
}

//判断是否为好友
exports.isFriend = function (uid, fid, res) {
	let wherestr = { 'userId': uid, 'friendId': fid, 'state': 0 }

	Friend.findOne(wherestr).then(result => {
		if (result) {
			res.send({ status: 200 })
		} else {
			res.send({ status: 400 })
		}

	}).catch(err => {
		res.send({ status: 500 })
	})
}

//用户详情
exports.userDetail = function (id, res) {
	let wherestr = { '_id': id };
	let out = { 'psw': 0 }

	User.find(wherestr, out).then(result => {
		res.send({ status: 200, result })
	}).catch(
		err => {
			res.send({ status: 500 })
		}
	)
}

//用户信息修改
exports.userUpdate = function (data, res) {
	let updatestr = {}

	if (typeof (data.pwd) != 'undefined') {
		User.find({ '_id': data._id }, { 'psw': 0 }).then(result => {
			if (result == '') {
				res.send({ status: 400 })
			}
			result.map(function (e) {
				const pwdMatch = bcrypt.verification(data.pwd, e.psw)
				if (pwdMatch) {
					updatestr[data.type] = data.data
					User.findByIdAndUpdate(data.id, updatestr).then(result => {
						res.send({ status: 200, result })
					}).catch(err => {
						res.send({ status: 500 })
					})
				} else {
					res.send({ status: 400 })
				}
			})

		}).catch(err => {
			res.send({ status: 500 })
		})
	} else {
		updatestr[data.type] = data.data
		User.findByIdAndUpdate(data.id, updatestr).then(result => {
			res.send({ status: 200, result })
		}).catch(err => {
			res.send({ status: 500 })
		})
	}

}

//修改好友昵称

//添加好友表
exports.buildFriend = function (uid, fid, status, res) {
	let data = {
		userId: uid,
		friendId: fid,
		state: status,
		time: new Date(),
		lastTime: new Date(),
	}

	let friend = new Friend(data);

	friend.save().then(result => {
		// res.send({status: 200})
		console.log("添加成功了");
	}).catch(err => {
		// res.send({status: 500})
		console.log("添加失败了");
	})
}

//添加一对一消息
exports.insertMsg = function (uid, fid, msg, type, res) {
	let data = {
		userId: uid,
		friendId: fid,
		message: msg,
		types: type,
		time: new Date(),
		state: 1,
	}

	let wherestr = { $or: [{ 'userId': uid, 'friendId': fid }, { 'userId': fid, 'friendId': uid }] }

	let message = new Message(data);

	message.save().then(result => {
		res.send({ status: 200 })
	}).catch(err => {
		res.send({ status: 500 })
	})

	Friend.updateMany(wherestr, { 'lastDate': new Date() }).then(result => {
		console.log("最后时间更新成功");
	}).catch(err => {
		console.log("最后时间更新失败");
	})
}

//好友申请
exports.applyFriend = function (data, res) {
	let wherestr = { 'userId': data.uid, 'friendId': data.fid }

	Friend.countDocuments(wherestr).then(result => {
		console.log(result);
		if (result == 0) {
			this.buildFriend(data.uid, data.fid, 2)
			this.buildFriend(data.fid, data.uid, 1)
		} else {
			console.log("已经申请过了");
		}

		// res.send({status : 200})
	}).catch(err => {
		res.send({ status: 500 })
	})

	if (!data.msg) {
		data.msg = '求求您啦！'
	}

	this.insertMsg(data.uid, data.fid, data.msg, 0, res)
}

//更新好友状态
exports.updateFriendState = function (data, res) {
	let wherestr = { $or: [{ 'userId': data.uid, 'friendId': data.fid }, { 'userId': data.fid, 'friendId': data.uid }] }

	Friend.updateMany(wherestr, { 'state': 0 }).then(result => {
		console.log("好友状态更新成功");
	}).catch(err => {
		console.log("好友状态更新失败");
	})

}

//更新好友最后沟通时间
exports.updateLastTime = function (data, res) {

}

//删除好友
exports.deleteFriend = function (data, res) {
	let wherestr = { $or: [{ 'userId': data.uid, 'friendId': data.fid }, { 'userId': data.fid, 'friendId': data.uid }] }

	Friend.deleteMany(wherestr).then(result => {
		console.log("好友删除成功");
		res.send({status: 200})
	}).catch(err => {
		console.log("好友删除失败");
		res.send({status: 500})
	})

}

//获取用户列表
exports.getUser = function (data, res) {
	let query = Friend.find({});

	query.where({ 'userId': data.uid, 'state': data.state });

	query.populate('friendId');

	query.sort({ 'lastTime': -1 })

	query.exec().then(function (e) {
		let result = e.map(function (ver) {
			return {
				id: ver.friendId._id,
				name: ver.friendId.name,
				imgurl: ver.friendId.imgurl,
				lastTime: ver.friendId.time,
			}
		})
		res.send({ status: 200, result })
	}).catch(function (err) {
		res.send({ status: 500 })
	})
}

//获取一条消息
exports.getOneMsg = function (data, res) {
	let query = Message.findOne({});

	query.where({ $or: [{ 'userId': data.uid, 'friendId': data.fid }, { 'userId': data.fid, 'friendId': data.uid }] });



	query.sort({ 'time': -1 })

	query.exec().then(function (ver) {

		let result = {
			message: ver.message,
			time: ver.time,
			types: ver.types,
		}


		res.send({ status: 200, result })
	}).catch(function (err) {
		res.send({ status: 500 })
	})
}

//一对一未读消息数
exports.unreadMsg = function (data, res) {
	let wherestr = { 'userId': data.uid, 'friendId': data.fid, 'state': 1 };

	Message.countDocuments(wherestr).then(result => {
		res.send({ status: 200, result })
	}).catch(err => {
		res.send({ status: 500 })
	})
}

//一对一未读消息清零
exports.readedMsg = function (data, res) {
	let wherestr = { 'userId': data.uid, 'friendId': data.fid, 'state': 1 };

	let updatestr = { 'state': 0 }

	Message.updateMany(wherestr, updatestr).then(result => {

		res.send({ status: 200 })

	}).catch(err => {
		res.send({ status: 500 })
	})
}