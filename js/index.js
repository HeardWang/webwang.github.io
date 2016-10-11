var timer=null;
$(document).ready(function(){
    $(window).scroll(function () {
        var t = document.documentElement.scrollTop || document.body.scrollTop;
        var cTop = $(".top").offset().top;
        if(t >= cTop){
            $('.top ul').css({'position':'fixed','top':0});
        }
        if(t < cTop){
            $('.top ul').css({'position':'absolute','top':0});
        }
    });
    /* IP天气 */
    $(".welcome span").html(returnCitySN["cname"]);
    $(".welcome i").html(returnCitySN["cip"]);
    var city = returnCitySN["cname"];
    var ocity;
    if(city.indexOf("市") != 0){
        ocity = city.replace("市","");
    }else if(city.indexOf("省") != 0){
        ocity = city.replace("省","");
    }else{
        ocity = city.replace("自治区","");
    }
    console.log(ocity);
    var url = 'wthrcdn.etouch.cn/weather_mini?city=';//每次初始值
    url += ocity;

    $.ajax({
        url: url,
        success: function (data) {
            showData(data);
        },
        error: function (err) {
            error(err);
        },
        dataType: "json"
    });
    function showData(data) {
        $(".weather").empty();
        var forecast = data.data.forecast;
        var today=data.data;
        var tWeather = forecast[0];
        var pic;
        var oclass;
        switch (tWeather.type) {
            case  "晴":
                pic = "<img src='images/qing.png'>";oclass = "lv1";
                break;
            case  "阴":
                pic = "<img src='images/yin.png'>";oclass = "lv3";
                break;
            case  "多云":
                pic = "<img src='images/duoyun.png'>";oclass = "lv3";
                break;
            case  "小雨":
                pic = "<img src='images/day_xiaoyu.png'>";oclass = "lv2";
                break;
            case  "中雨":
                pic = "<img src='images/day_zhongyu.png'>";oclass = "lv2";
                break;
            case  "大雨":
                pic = "<img src='images/day_dayu.png'>";oclass = "lv2";
                break;
            case  "雷阵雨":
                pic = "<img src='images/day_dayu.png'>";oclass = "lv2";
                break;
            case  "阵雨":
                pic = "<img src='images/day_dayu.png'>";oclass = "lv2";
                break;
            case  "暴雨":
                pic = "<img src='images/day_dayu.png'>";oclass = "lv2";
                break;
            case  "大到暴雨":
                pic = "<img src='images/day_dayu.png'>";oclass = "lv2";
                break;
            case  "小雪":
                pic = "<img src='images/day_xiaoxue.png'>";oclass = "lv2";
                break;
            case  "中雪":
                pic = "<img src='images/day_zhongxue.png'>";oclass = "lv2";
                break;
            case  "大雪":
                pic = "<img src='images/day_daxue.png'>";oclass = "lv2";
                break;
            default:
                pic = '';oclass = "";
                break;
        }
        var content = '';
        content += "<li id='date'><li>";
        content += "<li >" + pic + "&nbsp;&nbsp;" + tWeather.type +"<li>";
        content += "<li >气温：" + tWeather.high + "," + tWeather.low +"<li>";
        content += "<li >风向："  + tWeather.fengxiang +"<li>";
        content += "<li >风力："  + tWeather.fengli +"<li>";
        content += "<li >感冒指数："  + today.ganmao +"<li>";
        $(".weather").append(content).addClass(oclass);
    }
    function error(err) {
        console.log(err.status + ":" + err.statusText);
    }
    timer=setInterval("time(new Date())",500);//调用方法传参数要使用字符串的形式
});
/* 获取时间 */
function time(myDate){
    //var myDate = new Date();
    var y = myDate.getFullYear();//年份
    var m = myDate.getMonth() + 1;//月份
    var d = myDate.getDate();//返回一个月中的某一天
    var h = myDate.getHours();//小时
    var mi = myDate.getMinutes();//分钟
    var s = myDate.getSeconds();//秒
    var week = myDate.getDay();//返回一周的某一天
    var weekday = new Array();
    weekday[0] = "星期日";
    weekday[1] = "星期一";
    weekday[2] = "星期二";
    weekday[3] = "星期三";
    weekday[4] = "星期四";
    weekday[5] = "星期五";
    weekday[6] = "星期六";
    s = s > 9 ? s : "0" + s;
    mi = mi > 9 ? mi : "0" + mi;
    $("#date").html(y+"年"+m+"月"+d+"日"+"，"+weekday[week]+"<br>"+h+"时"+mi+"分"+s+"秒");
}
