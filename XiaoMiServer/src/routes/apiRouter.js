const express = require('express');
const router = express.Router();


//顶部导航部分数据，以及每个导航部分数据
router.get('/nav', (req, res) => {
    if (req.query.type) {
        console.log(req.query.type);
        const type = req.query.type;
        const sqlStr = `select * from navsparts where type='${type}';`;
        req.db.driver.execQuery(sqlStr, (err, arry) => {
            if (err) throw err;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end(JSON.stringify(arry));
        })

    } else {
        const sqlStr = `select * from navs`;
        req.db.driver.execQuery(sqlStr, (err, arry) => {
            if (err) throw err;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end(JSON.stringify(arry));
        })
    }


})
//轮播图部分数据
router.get('/lunbo', (req, res) => {
    const sqlStr = `select * from banners`;
    req.db.driver.execQuery(sqlStr, (err, arry) => {
        if (err) throw err;
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(JSON.stringify(arry));
    })
})
//种类列表部分数据
router.get('/items', (req, res) => {
    if (req.query.type) {
        const type = req.query.type;
        const sqlStr = `select * from sideitemsparts where type='${type}';`;
        req.db.driver.execQuery(sqlStr, (err, arry) => {
            if (err) throw err;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end(JSON.stringify(arry));
        })
    } else {
        const sqlStr = `select * from sideitems`;
        req.db.driver.execQuery(sqlStr, (err, arry) => {
            if (err) throw err;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end(JSON.stringify(arry));
        })
    }

})
//获取部分数据智能硬件部分数据
router.get('/hardware', (req, res) => {
    const sqlStr = `select * from hardware`;
    req.db.driver.execQuery(sqlStr, (err, arry) => {
        if (err) throw err;
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(JSON.stringify(arry));
    })
})
//获取产品的数据  http://127.0.0.1:9900/api/product?toptitle=match
//http://127.0.0.1:9900/api/product?key=hot;
router.get('/product', (req, res) => {
    const topTitle = req.query.toptitle || false;
    const keyword = req.query.key || false;
    if (topTitle) {
        getProductData(topTitle, res, req);
    };
    if (keyword) {
        getProductRightData(keyword);
    }

    function getProductData(toptitle, res, req) {
        let obj = {};
        obj.topTitle = toptitle;
        //得到left_goods对象
        const getLeftGoods = `select * from product_leftgoods where topTitle='${topTitle}'`;
        req.db.driver.execQuery(getLeftGoods, (err, arry) => {
            console.log(getLeftGoods);
            if (err) throw err;
            obj.leftGoods = arry;

        });
        //得到subs对象
        const sqlStr = `select * from product_subs where topTitle='${topTitle}'`;
        req.db.driver.execQuery(sqlStr, (err, arry) => {
            if (err) throw err;
            // console.log(arry);
            obj.subs = arry;
        });
        const sqlStr3 = `select * from product where topTitle='${topTitle}'`;
        req.db.driver.execQuery(sqlStr3, (err, arry) => {
            if (err) throw err;
            // console.log(arry);
            if (arry.length) {
                obj.topTitleName = arry[0].topTileName;
                obj.topSubStatus = arry[0].topSubStatus;
                const keys = obj.topSubStatus;
                const getGoods = `select * from product_goods where keyword='${keys}'`;
                req.db.driver.execQuery(getGoods, (err, arry) => {
                    if (err) throw err;
                    if (arry.length) {
                        obj[keys] = arry;
                        console.log(obj);
                        res.end(JSON.stringify(obj));
                    } else {
                        res.end('nothing');
                        return;
                    }
                })
            } else {
                res.end('nothing');
                return;
            }
        });



    }

    function getProductRightData(keyword) {
        const obj = {};
        const getGoods = `select * from product_goods where keyword='${keyword}'`;
        req.db.driver.execQuery(getGoods, (err, arry) => {
            if (err) throw err;
            if (arry.length) {
                obj.datas = arry;
                res.end(JSON.stringify(obj));
            } else {
                res.end('nothing');
                return;
            }

        })
    }

})
//获取热评产品的数据 http://127.0.0.1:9900/api/hotcomment
router.get('/hotcomment', (req, res) => {
    const sqlStr = `select * from hotcommentproduct`;
    req.db.driver.execQuery(sqlStr, (err, arry) => {
        if (err) throw err;
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(JSON.stringify(arry));
    })
});

//获取为你推荐部分数据可以分页显示，可以不分页 http://127.0.0.1:9900/api/recommend?page=xx;
router.get('/recommend', (req, res) => {
    const page = parseInt(req.query.page)||1;
    if (page) {
        const count = (page-1)*5;
        const sqlStr0 = `select * from recommend limit ${count},5`;
        req.db.driver.execQuery(sqlStr0, (err, arry) => {
            if (err) throw err;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end(JSON.stringify(arry));
        });
    } else {
        const sqlStr = `select * from recommend`;
        req.db.driver.execQuery(sqlStr, (err, arry) => {
            if (err) throw err;
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            res.end(JSON.stringify(arry));
        });
    }

});

//内容部分的数据 http://127.0.0.1:9900/api/content
router.get('/content',(req,res)=>{
    const obj = {};
    obj.title = "内容";
    obj.contents = [];
    const sqlStr = `select * from content`;
    req.db.driver.execQuery(sqlStr, (err, arry) => {
        if (err) throw err;
        
        if(arry.length){
            for(let i=0;i<arry.length;i++){
                  let objs ={};
                  objs.title=arry[i].title;
                  objs.type=arry[i].type;
                  let sqlStr2 = `select * from content_list where type='${objs.type}'`;
                  req.db.driver.execQuery(sqlStr2, (err, arry1) => {
                        if (err) throw err;
                        objs.list = arry1;
                        obj.contents.push(objs);
                        // console.log(obj.contents);
                        if(i==arry.length-1){
                            res.setHeader('Content-Type', 'text/html;charset=utf-8');
                            res.end(JSON.stringify(obj));
                        }
                  });
            }       
        }

    })
})
//获取视频列表部分的数据 http://127.0.0.1:9900/api/video
router.get('/video', (req, res) => {
    const sqlStr = `select * from video`;
    req.db.driver.execQuery(sqlStr, (err, arry) => {
        if (err) throw err;
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.end(JSON.stringify(arry));
    })
})
exports.router = router;