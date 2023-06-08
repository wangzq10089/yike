const bodyParser = require('body-parser')
const express = require('express')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const port = 3000



//跨域
app.all('*',function(req,res,next){
	// res.header('Access-Control-Allow-Origin','http://localhost:8081');
	res.header("Access-Control-Allow-Origin","*");
	res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials",true);
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type","application/json;charset=utf-8");

	if(req.method == 'OPTIONS'){
		res.sendStatus(200);
	}else{
		next();
	}
	
});

//路由
require('./router/index')(app)
require('./router/files')(app)

app.use(express.static(__dirname+'/data'));

//404
app.use(function(req,res,next){
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
})

//出现错误处理
app.use(function(err,req,res,next){
	res.status(err.status || 500)
	res.send(err.message);
})

app.listen(port,() => console.log(`启动-- ${port} --端口`))