$(function () {
    var OR = $(".container-right li a");
    var OL = $(".container-left li h3");
    var wth =  window.screen.width;

    /*  滚动事件  */
    if(wth > 414){
        $(window).scroll(function () {
            var t = document.documentElement.scrollTop || document.body.scrollTop;
            if(t >= 396){
                $(".container-right").css({"position":"absolute","left":"8%","top":t + 105,"width":"15%"});
                $(".main05").css({"padding-left":"28%"})
            }else if(t < 396){
                $(".container-right").css({"position":"static","width":"28%"});
                $(".main05").css({"padding-left":0})
            };
            OL.each(function () {
                var name = $(this).attr("data-name");
                var top = $(this).offset().top - t;
                if(top <= 180){
                    OR.each(function () {
                        $(this).attr("class","");
                    });
                    $('#' + name + '').attr("class", "active");
                };
            });
        });
        /*  点击事件  */
        OR.each(function () {
            var oId = this.id;
            $(this).click(function () {
                OR.each(function () {
                    $(this).attr("class","");
                });
                $(this).attr("class","active");
                OL.each(function (index,ele) {
                    if(oId == $(this).attr("data-name")){
                        var sNum = $(this).offset().top - 180;  //得到的项偏移量
                        $(window).scrollTop(sNum);
                    }
                });
            });
        });
    }
});
