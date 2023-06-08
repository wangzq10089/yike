var multer = require('multer');
var mkdir = require('../dao/mkdir');

//控制文件存储
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        let url = req.body.url;

        mkdir.mkdirs('../data/'+url,err => {
            console.log(err);
        })

        cb(null, './data/'+url)
    },
    filename: function(req,file,cb){
        let name = req.body.name;
        let type = file.originalname.replace(/.+\./,".")
        cb(null,name+type);
    }
})

var upload = multer({ storage: storage })

module.exports = function(app){
    app.post('/files/upload',upload.array('file',10),function(req,res,next){
        console.log("文件上传");
        let url = req.body.url;

        let name = req.files[0].filename;
        let imgurl = '/'+url+'/'+name;

        res.send(imgurl)
    })
}