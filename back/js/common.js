/*  弹窗和遮罩层  */
var stack = false;
$("#option_btn").find("a").click(function () {
    Dialog("Pop");
    var scrollTop = getScrollTop();
    $("#shade").css({top: scrollTop}).show();
    if (stack) {
        $("html,body").css({overflow: "visible"});
    } else {

        $("html,body").css({overflow: "hidden"});
    }
});
$("#Cls").click(function () {
    $('#shade').hide();
    $("html,body").css({overflow: "visible"});
});
$("#pop_btn").click(function () {
    $('#shade').hide();
    $("html,body").css({overflow: "visible"});
});
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}

//选项卡切换
function setTab(name, cursel, n) {
    for (i = 1; i <= n; i++) {
        var menu = document.getElementById(name + i);
        var con = document.getElementById("con_" + name + "_" + i);
        menu.className = i == cursel ? "active" : "";
        con.style.display = i == cursel ? "block" : "none";
    }
}
function resizeLeft() {
    if ($(".layout_rightmain") && $(".layout_leftnav")) {
        var leftHeight = $(".layout_rightmain").height();
        $(".layout_leftnav").css('height', leftHeight);
    }
}
/* 屏幕滚动事件 */
window.onscroll = function () {
    var t = document.documentElement.scrollTop || document.body.scrollTop;
    if (t >= 500) {
        document.getElementById('return_top').style.display = "block";
        document.getElementById('return_top').style.opacity = 1;
    } else if (t < 500) {
        document.getElementById('return_top').style.display = "none";
        document.getElementById('return_top').style.opacity = 0;
    }
};
//模拟下拉菜单
$(document).ready(function () {
    var oAS = $('#sidebar li a');
    for (var i = 0; i < oAS.length; i++) {
        oAS[i].index = i;
        oAS[i].onclick = function () {
            for (var i = 0; i < oAS.length; i++) {
                oAS[i].className = "";
            }
            /*alert(this.index);*/
            oAS[this.index].className = "active";
        };
    }
    //下拉菜单点击事件
    $(".btn-select, .i-num, .h-outer, .table-select").click(function (event) {
        //停止派发时间
        event.stopPropagation();
        //切换子元素的可见状态
        $(this).find(".option").toggle();
    });
    $(document).click(function (event) {
        var eo = $(event.target);
        if ($(".btn-select, .i-num, .h-outer, .table-select").is(":visible") && eo.attr("class") != "option" && !eo.parent(".option").length)
            $('.option').hide();
    });
    /*赋值给文本框*/
    $(".option a").click(function () {
        var value = $(this).text();
        //parent() 获得当前匹配元素集合中每个元素的父元素,所有类名为 "select-txt" 的所有同胞元素
        $(this).parent().siblings(".select-txt").text(value);
        $(this).parent().parent().next("#select_value").val(value)
    });
//.first() 方法会用第一个匹配元素构造一个新的 jQuery 对象,并绑定点击事件
    $(".accordion").find("a").first().bind("click", function () {
        if ($(".nav-vertical").css("width") == "46px") {
            $(".nav-vertical").css("width", "195px");
            $(this).css("width", "149px");
            if ($(".layout_leftnav")) {
                $(".layout_leftnav").css("width", "195px");
            }
            if ($(".layout_rightmain")) {
                $(".layout_rightmain").css("margin-left", "200px");
            }
        }
        else {
            $(".nav-vertical").css("width", "46px");
            $(this).css("width", "0px");
            if ($(".layout_leftnav")) {
                $(".layout_leftnav").css("width", "46px");
            }
            if ($(".layout_rightmain")) {
                $(".layout_rightmain").css("margin-left", "61px");
            }
        }
        $(this).next().hide();
        resizeLeft();
    });
    $(".accordion").find("a").mouseenter(function () {
        if ($(this).css("width") == '0px') {
            $(this).next().show();
        }
    });
    $(".accordion").find("a").mouseleave(function () {
        if ($(this).css("width") == '0px') {
            $(this).next().hide();
        }
    });
    resizeLeft();
    /*  选项卡 */
    var liS = $(".tabs>li>a");
    var oAs = $(".tabs").find("a");
    for (var i = 0; i < liS.length; i++) {
        liS[i].index = i;
        liS[i].onclick = function () {
            var items = $('.right_items');
            for (var i = 0; i < liS.length; i++) {
                liS[i].className = "";
                items[i].className = "right_items hide";
            }
            liS[this.index].className = "active";
            items[this.index].className = "right_items show";
            /*点击调取json*/
            //getAjax(oAs[this.index].title);
        };
    }
    /* ajax获取json */
    //getAjax("js");
    function getAjax(title) {
        var url = "json/" + title + ".json";
        $.ajax({
            url: url,
            dataType: "text",
            type: "GET",
            success: function (data) {
                CallBack(data);
            },
            error: function (err) {
                error(err);
            }
        });
        function CallBack(data) {
            var item = JSON.parse(data);
            var tpl = $('#tmp').html();
            var htm = juicer(tpl, item);
            if (item.status == 200) {
                $('#' + title + '_content').empty().append(htm);
            }
        }

        function error(err) {
            console.log(err.status)
        }
    }

    /*  动态加载Script */
    function creatScript(src) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        document.head.appendChild(script);
    }

    /* 跳转github */
    $('#github').click(function () {
        window.location = "https://heardwang.github.io/";
    });
    $("#return_top").click(function () {
        //$(window).scrollTop(0);
        $('html,body').animate({scrollTop: '0px'}, 500);
    });
});