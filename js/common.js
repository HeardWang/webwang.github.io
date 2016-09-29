$(document).ready(function(){
    /*  屏幕滚动事件 */
    var p = 0,t = 0;
    $(window).scroll(function(e){
        p = $(this).scrollTop();

        if(t <= p && p >=75){//下滚
            $('.header').fadeOut(300);
        }else{//上滚
            $('.header').fadeIn(300);
        }
        setTimeout(function(){t = p;},0);
    });
    /*  ABOUT TAB标签*/
    $('.about-nav ul li a').each(function (index,ele) {
        $(this).click(function () {
            $('.about-nav ul li a').each(function () {$(this).attr("class","");});
            $('.about-item').each(function () {$(this).attr("class","about-item hide");}).eq(index).attr("class","about-item show");
            $(this).attr("class","active");
        });
    });
    /* 屏幕滚动事件 */
    $(window).scroll(function () {
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        if (t >= 350) {
            $('#return_top').fadeIn(200);
        } else if (t < 350) {
            $('#return_top').fadeOut(200);
        }
        /*  推荐文章滚动固定 */
        if(t >= 75){
            $('.main04').css({'position':'fixed','top':0});
        }else{
            $('.main04').css('position','absolute');
        }
    });
    $("#return_top").click(function () {
        //$(window).scrollTop(0);
        $('html,body').animate({scrollTop: '0px'}, 450);
    });
    /*  文章点击喜欢  */
    $("dt .like-btn").click(function () {
        $(this).css("color","red");
        $(".icon16-like").css("background-position","-16px -100px")
    });
    /*  移动端适配  */
    var wth =  window.screen.width;
    var p_meta = '<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui" id="p_meta">';
    var hy = '<a href="javascript:;" id="nav_btn"></a>';
    var stark = false;
    if(wth <= 500){
        $('head').append(p_meta);
        $('.inner').css('width',wth);
        $('.h-account').empty().append(hy);

        $('#nav_btn').click(function () {
            if (stark){
                $('.h-nav').css("top","-175px");
                stark = !stark;
            }else{
                $('.h-nav').css("top","35px");
                stark = !stark;
            }
        })
    }else{
        $('#p_meta').remove();
    }
});

/*  ajax&juicer函数  */
// tmpId 模板ID
// container 容器类名
// json 地址
function getAjax(tmpId,container,json){
    $.ajax({
        url: json,
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
        var tpl = $('#'+tmpId+'').html();
        var htm = juicer(tpl, item);
        if (item.status == 200) {
            $('.'+container+'').empty().append(htm);
        }
    }
    function error(err) {
        console.log(err.status)
    }
}

