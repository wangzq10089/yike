var dbserver = require('../dao/dbserver');
var signin = require('../server/signin')
var signup = require('../server/signup')
var search = require('../server/search')
var user = require('../server/userdetail')
var friend = require('../server/friend')
var index = require('../server/index')


module.exports = function(app){
	// app.use(bodyParser());

	app.get('/test',(req,res) => res.send("test页面"))
	
	app.get('/login',(req,res) => {
		dbserver.findUser(res)
	})

	//注册
	app.post('/signup/add',(req,res) => {
		signup.signUp(req,res);
	})

	//登录
	app.post('/signin/match',(req,res) => {
		signin.signIn(req,res)
	})

	//查找
	app.post('/search/user',(req,res) => {
		search.searchUser(req,res)
	})

	//查找好友
	app.post('/search/isfriend',(req,res) => {
		search.isFriend(req,res)
	})

	//用户详情
	app.post('/user/detail',(req,res) => {
		user.userDetail(req,res)
	})

	//用户信息修改
	app.post('/user/update',(req,res) => {
		user.userUpdate(req,res)
	})

	//申请好友
	app.post('/friend/applyfriend',(req,res) => {
		friend.applyFriend(req,res)
	})

	//好友状态更改
	app.post('/friend/updatefriendstate',(req,res) => {
		friend.updateFriendState(req,res)
	})

	//删除好友
	app.post('/friend/deletefriend',(req,res) => {
		friend.deleteFriend(req,res)
	})

	//主页获取好友
	app.post('/index/getfriend',(req,res) => {
		index.getFriend(req,res)
	})

	//获取最后一条消息
	app.post('/index/getlastmsg',(req,res) => {
		index.getLastMsg(req,res)
	})

	//获取未读消息数
	app.post('/index/unreadmsg',(req,res) => {
		index.unreadMsg(req,res)
	})

	//未读消息清零
	app.post('/index/readedmsg',(req,res) => {
		index.readedMsg(req,res)
	})
}