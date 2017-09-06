const express = require('express');
const orm = require('orm');
const bodyParser = require('body-parser');
const localip = '127.0.0.1';
const app = express();


app.use(orm.express("mysql://root:root@localhost/xiaomiserver", {
    define: function(db, models, next) {
        console.log('数据库连接成功！');
        next();
    }
}));
//允许跨域
app.all('*', function(req, res, next) {
    //消除中文乱码
    res.set('Content-Type', 'application/json;charset=utf-8');
    //设置跨域
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const routesAPI = require('./routes/apiRouter.js')
app.use('/api', routesAPI.router);

//监听端口
app.listen(9900, localip, (err) => {
    if (err) throw err;
    console.log('服务器已经开启！' + localip + ':9900');
})