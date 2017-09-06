$(function() {
    //搜索框事件
    searchEvent();
    //导航栏事件
    navEvent();
    //轮播图侧边栏事件
    slideLeftEvent();
    //轮播图
    slideEvent();
    //hardware区域
    hardwareEvent();
    //搭配部分数据
    matchEvent();
    //配件部分数据
    accessoriesEvent();
    //周边部分数据
    aroundEvent();
    //为你推荐部分数
    recommendEvent();
    //热评产品部分数据
    hotrecommendEvent();
    //内容部分数据
    contentEvent();
    //视频部分数据
    videoEvent();
});
//搜索框事件
function searchEvent() {
    //搜索框事件
    $(".search>.search-ipt").focus(function() {
        $(".search-tuijian").hide();
        $(".search-history").show();
        $(".search").css("border", ".01rem solid red");
        $(".search>.search-btn").css("border-left", ".01rem solid red");
    });
    $(".search>.search-ipt").blur(function() {
        $(".search-tuijian").show();
        $(".search-history").hide();
        $(".search").css("border", ".01rem solid #ccc");
        $(".search>.search-btn").css("border-left", ".01rem solid #ccc");
    });
}
//轮播图侧边栏事件
function slideLeftEvent() {
    //获取轮播图区域侧边栏
    $.ajax({
        url: 'http://127.0.0.1:9900/api/items',
        dataType: "json",
        success: function(data) {
            $(".side-left>ul").html(template("slid-left-template", data));
        }
    });

    //给侧边栏鼠标移入事件
    $(".side-left>ul").on("mouseover", "li", function() {
        var type = $(this).attr("typeName");
        if (type == "") {
            return;
        }
        $.ajax({
            url: "http://127.0.0.1:9900/api/items",
            dataType: "json",
            data: {
                "type": type
            },
            success: function(data) {
                var html = ["<ul>"];
                for (var i = 0; i < data.length; i++) {
                    if (i % 6 == 0 && i != 0) {
                        html.push('</ul><ul>');
                    }
                    if (data[i].buyStatus == "true") {
                        html.push('<li>\
                                    <a href="' + data[i].buyUrl + '">\
                                        <img src="' + data[i].imgUrl + '" alt="">\
                                        <span>' + data[i].name + '</span>\
                                        <span class="by">选购</span>\
                                    </a>\
                                </li>');
                    } else {
                        html.push('<li>\
                                    <a href="' + data[i].buyUrl + '">\
                                        <img src="' + data[i].imgUrl + '" alt="">\
                                        <span>' + data[i].name + '</span>\
                                    </a>\
                                </li>');
                    }
                }
                html.push('</ul>');
                $(".site-category-detail").html(html.join(""));
            }
        });
        $(".site-category-detail").show();
    });
    $(".side-left>ul").on("mouseout", "li", function() {
        $(".site-category-detail").hide();
    });
    $(".site-category-detail").on("mouseout", function() {
        $(this).hide();
    });
    $(".site-category-detail").on("mouseover", function() {
        $(this).show();
    });
}
//导航栏事件
function navEvent() {
    //获取导航栏
    $.getJSON("http://127.0.0.1:9900/api/nav", function(data) {
        $(".navs").append($(template("nav", data)));
    });
    //鼠标经过导航栏显示产品
    $("header").on("mouseover", ".navs>li", function() {
        var type = $(this).attr('navType');
        if (type == "") {
            return;
        }
        $(".nav-products").show();
        $.ajax({
            url: "http://127.0.0.1:9900/api/nav",
            data: {
                "type": type
            },
            success: function(data) {
                var data = JSON.parse(data);
                $(".nav-products>ul").html(template("nav-product", data));
            }
        });
    });
    $("header").on("mouseout", ".navs>li", function() {
        $(".nav-products").hide();
    });
    $("header").on("mouseout", ".nav-products", function() {
        $(".nav-products").hide();
    });
    $("header").on("mouseover", ".nav-products", function() {
        $(".nav-products").show();
    });
}
//轮播图
function slideEvent() {
    var timeId = null;
    //ajax动态获取数据
    $.ajax({
        url: 'http://127.0.0.1:9900/api/lunbo',
        dataType: 'json',
        success: function(data) {
            $(".slide-main").html(template("slide-model", data));
            var html = ['<ul class="slide-main-point">'];
            for (var i = 0; i < data.length; i++) {
                html.push('<li index="' + i + '"><a herf="javaScript:;"></a></li>');
            }
            html.push('</ul><div class="slide-btn slide-btn-left"><</div>\
            <div class="slide-btn slide-btn-right">></div>');
            html = $(html.join(""));
            html.find("li:eq(0)").addClass("index");
            $(".slide-main").append(html);
            $(".slide-main>li").eq(0).addClass("active");
        }
    });
    //左右按钮事件，自动轮播事件
    var index = 0;
    $(".slide-main").on('click', '.slide-btn-left', function() {
        index--;
        if (index < 0) {
            index = $(".slide-main>li").length - 1;
        }
        $(".slide-main>li").removeClass("active").eq(index).addClass("active");
        $(".slide-main-point>li").removeClass("index").eq(index).addClass("index");
    });
    $(".slide-main").on('click', '.slide-btn-right', function() {
        index++;
        if (index >= $(".slide-main>li").length) {
            index = 0;
        }
        $(".slide-main>li").removeClass("active").eq(index).addClass("active");
        $(".slide-main-point>li").removeClass("index").eq(index).addClass("index");
    });
    timeId = setInterval(function() {
        index++;
        if (index >= $(".slide-main>li").length) {
            index = 0;
        }
        $(".slide-main>li").removeClass("active").eq(index).addClass("active");
        $(".slide-main-point>li").removeClass("index").eq(index).addClass("index");
    }, 2000);
    //给轮播图鼠标移入鼠标移入按钮透明度提高事件
    $(".slide-main").on("mouseover", function() {
        $(".slide-btn").addClass("active");
        clearInterval(timeId);
    });
    $(".slide-main").on("mouseout", function() {
        $(".slide-btn").removeClass("active");
        timeId = setInterval(function() {
            index++;
            if (index >= $(".slide-main>li").length) {
                index = 0;
            }
            $(".slide-main>li").removeClass("active").eq(index).addClass("active");
            $(".slide-main-point>li").removeClass("index").eq(index).addClass("index");
        }, 2000);
    });

}
//hardware区域
function hardwareEvent() {
    $.ajax({
        url: "http://127.0.0.1:9900/api/hardware",
        dataType: "json",
        success: function(data) {
            $(".boxs-container-right.hardware").html(template("hardware", data));
        }
    });
}

//搭配部分数据
function matchEvent() {
    $.ajax({
        url: "http://127.0.0.1:9900/api/product",
        data: {
            toptitle: "match",
        },
        dataType: "json",
        success: function(data) {
            var html = ['<span class="pull-left">' + data.topTitleName + '</span>'];
            for (var i = 0; i < data.subs.length; i++) {
                html.push('<span class = "pull-right" key="' + data.subs[i].key + '">\
                            <a href = "">' + data.subs[i].name + '</a>\
                            </span > ');
            }
            $(".match>.goods-top").html(html.join(""));
            data.hotgoods[data.hotgoods.length - 1].last = "true";
            $(".match>.boxs-container-right").html(template("match", data.hotgoods));
            $(".match>.boxs-container-left").html(template("leftGoodsShow", data.leftGoods));
        }
    });
    $(".match>.goods-top").on("mouseenter", ".pull-right", function() {
        var key = $(this).attr("key");
        if (key == "") {
            return;
        }
        $(".match>.goods-top>.pull-right").removeClass("active");
        $(this).addClass("active");
        $.ajax({
            url: "http://127.0.0.1:9900/api/product",
            data: {
                toptitle: "match",
                key: key
            },
            dataType: "json",
            success: function(data) {
                data.datas[data.datas.length - 1].last = "true";
                $(".match>.boxs-container-right").html(template("match", data.datas));
            }
        });
    });
}

//配件部分数据
function accessoriesEvent() {
    $.ajax({
        url: "http://127.0.0.1:9900/api/product",
        data: {
            toptitle: "accessories",
        },
        dataType: "json",
        success: function(data) {
            var html = ['<span class="pull-left">' + data.topTitleName + '</span>'];
            for (var i = 0; i < data.subs.length; i++) {
                html.push('<span class = "pull-right" key="' + data.subs[i].key + '">\
                            <a href = "">' + data.subs[i].name + '</a>\
                            </span > ');
            }
            $(".accessories>.goods-top").html(html.join(""));
            data.hot[data.hot.length - 1].last = "true";
            $(".accessories>.boxs-container-right").html(template("match", data.hot));
            $(".accessories>.boxs-container-left").html(template("leftGoodsShow", data.leftGoods));
        }
    });
    $(".accessories>.goods-top").on("mouseenter", ".pull-right", function() {
        var key = $(this).attr("key");
        if (key == "") {
            return;
        }
        $(".accessories>.goods-top>.pull-right").removeClass("active");
        $(this).addClass("active");
        $.ajax({
            url: "http://127.0.0.1:9900/api/product",
            data: {
                toptitle: "accessories",
                key: key
            },
            dataType: "json",
            success: function(data) {
                data.datas[data.datas.length - 1].last = "true";
                $(".accessories>.boxs-container-right").html(template("match", data.datas));
            }
        });
    });
}

//周边部分数据
function aroundEvent() {
    $.ajax({
        url: "http://127.0.0.1:9900/api/product",
        data: {
            toptitle: "around",
        },
        dataType: "json",
        success: function(data) {
            var html = ['<span class="pull-left">' + data.topTitleName + '</span>'];
            for (var i = 0; i < data.subs.length; i++) {
                html.push('<span class = "pull-right" key="' + data.subs[i].key + '">\
                            <a href = "">' + data.subs[i].name + '</a>\
                            </span > ');
            }
            $(".around>.goods-top").html(html.join(""));
            data.hotcloths[data.hotcloths.length - 1].last = "true";
            $(".around>.boxs-container-right").html(template("match", data.hotcloths));
            $(".around>.boxs-container-left").html(template("leftGoodsShow", data.leftGoods));
        }
    });
    $(".around>.goods-top").on("mouseenter", ".pull-right", function() {
        var key = $(this).attr("key");
        if (key == "") {
            return;
        }
        $(".around>.goods-top>.pull-right").removeClass("active");
        $(this).addClass("active");
        $.ajax({
            url: "http://127.0.0.1:9900/api/product",
            data: {
                toptitle: "accessories",
                key: key
            },
            dataType: "json",
            success: function(data) {
                data.datas[data.datas.length - 1].last = "true";
                $(".around>.boxs-container-right").html(template("match", data.datas));
            }
        });
    });
}

//为你推荐部分数据
function recommendEvent() {
    $.ajax({
        url: "http://127.0.0.1:9900/api/recommend",
        data: {
            page: "1",
        },
        dataType: "json",
        success: function(data) {
            $(".recommend>.recommend-main").html(template("recommendModel", data));
        }
    });
    //点击左右按钮滑动效果
    var page = 1;
    var maxpage = 1;
    $(".slide-right").on("click", function() {
        page++;
        if (page < maxpage) {
            $(".recommend-main").css({
                transform: "translateX(-" + 12 * (page - 1) + "rem)"
            });
            return;
        }
        $.ajax({
            url: "http://127.0.0.1:9900/api/recommend",
            data: {
                page: page,
            },
            dataType: "json",
            success: function(data) {
                if (data.length == 0) {
                    page--;
                    maxpage = page + 1;
                    return;
                } else {
                    maxpage = page + 1;
                    $(".recommend-main").append(template("recommendModel", data)).css({
                        // width: 12 * page + "rem",
                        transform: "translateX(-" + 12 * (page - 1) + "rem)"
                    });
                }

            }
        });
    });
    $(".slide-left").on("click", function() {
        page--;
        if (page <= 1) {
            page = 1;
        }
        $(".recommend-main").css({
            transform: "translateX(-" + 12 * (page - 1) + "rem)"
        });
    });
}

//热评产品部分数据
function hotrecommendEvent() {
    $.ajax({
        url: "http://127.0.0.1:9900/api/hotcomment",
        dataType: "json",
        success: function(data) {
            $(".hotcomment>.hotcomment-main").html(template("hotcomment-model", data));
        }
    });
}

//内容部分数据
function contentEvent() {
    $.ajax({
        url: "http://127.0.0.1:9900/api/content",
        dataType: "json",
        success: function(data) {
            $(".content>.content-main").html(template("content-model", data.contents));
        }
    });

    $(".content-main").on("click", ".btn-slide-right", function() {
        var index = $(this).parents(".content-slide").attr("index");
        if (index == 3) {
            return;
        }
        index++;
        $(this).parent().find("ul:eq(1)>li").removeClass("active").eq(index).addClass("active");
        $(this).parents(".content-slide").attr("index", index);
        $(this).parent().find("ul:eq(0)").css({
            transform: "translateX(-" + index * 2.92 + "rem)"
        });
    });
    $(".content-main").on("click", ".btn-slide-left", function() {
        var index = $(this).parents(".content-slide").attr("index");
        if (index == 0) {
            return;
        }
        index--;
        $(this).parent().find("ul:eq(1)>li").removeClass("active").eq(index).addClass("active");
        $(this).parents(".content-slide").attr("index", index);
        $(this).parent().find("ul:eq(0)").css({
            transform: "translateX(-" + index * 2.92 + "rem)"
        });
    });
}

//视频部分数据
function videoEvent() {
    $.ajax({
        url: "http://127.0.0.1:9900/api/video",
        dataType: "json",
        success: function(data) {
            $(".video>.video-main").html(template("video-model", data));
        }
    });
}