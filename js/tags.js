/**
 * Created by xz on 2016/10/17.
 */
function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length, i = 0, s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}
//用法
var ourl = window.location.href;
var myURL = parseURL(ourl);
var queryUrl = myURL.query.slice(5);
/* myURL.file;     // = 'index.html'
 myURL.hash;     // = 'top'
 myURL.host;     // = 'abc.com'
 myURL.query;    // = '?id=255&m=hello'
 myURL.params;   // = Object = { id: 255, m: hello }
 myURL.path;     // = '/dir/index.html'
 myURL.segments; // = Array = ['dir', 'index.html']
 myURL.port;     // = '8080'
 myURL.protocol; // = 'http'*/
console.log(queryUrl);
switch (queryUrl){
    case "JS":
        document.title = "Javascript-WebWang";
        break;
    case "CSS":
        document.title = "CSS-WebWang";
        break;
    case "FE":
        document.title = "前端开发-WebWang";
        break;
    case "other":
        document.title = "其他-WebWang";
        break;
    case "design":
        document.title = "设计-WebWang";
        break;
    default:
        document.title = "标签云-WebWang";
}

var totalpage, pagesize, cpage, count, curcount, out;
//初始化
cpage = 1;
pagesize = 5; //每页的数量
/*totalpage = 5; //页数*/
out = "";

function ajaxLoad(url) {
    $.ajax({
        url: url,
        dataType: "text",
        type: "get",
        success: function (data) {
            CallBack(data,cpage);

        },
        error: function (err) {
            error(err);
        }
    });
}
var temp;
function CallBack(data,cpage) {
    temp = [];
    var item = JSON.parse(data);
    for(var j = 0;j < item.data.length;j++){
        if(temp.indexOf(item.data[j].tag) == -1 && item.data[j].tag == queryUrl){
            temp.push(item.data[j]);
        }
    }
    console.log(temp);

    var iLen = temp.length;
    totalpage = Math.ceil(iLen/5);
    var htm = "";
    // 0 5 10 // 5 10 15
    for(var i = (cpage - 1)*5;i < cpage*5;i++){
        if(typeof temp[i] == "undefined"){
            //console.log(typeof item.data[i] == "undefined");
            continue;
        }else{
            htm += '<div class="container-left-item clearfix fadeIn animated">';
            htm += '<div class="item-title">';
            htm += '<a class="label label-important" href='+temp[i].link+'>'+temp[i].tag+'<i class="label-arrow"></i></a>';
            htm += '<h2><a target="_blank" href='+temp[i].link+' title='+temp[i].title+'>'+temp[i].title+'</a>';
            htm += '</h2>';
            htm += '</div>';
            htm += '<div class="focus">';
            htm += '<a target="_blank" href='+temp[i].link+'>';
            htm += '<img class="thumb scale" src='+temp[i].img+' alt='+temp[i].title+'>';
            htm += '</a>';
            htm += '</div>';
            htm += '<span class="note">'+temp[i].preface+'</span>';
            htm += '<div class="auth">';
            htm += '<span>发布日期：'+temp[i].date+'</span>';
            htm += '<a href='+temp[i].link+' target="_blank" class="btn-4">阅读全文</a>';
            htm += '</div>';
            htm += '</div>';
        }
    }
    $('.container-content').empty().append(htm);
    /*-------------分页----------------*/
    if (totalpage <= 5) {        //总页数小于五页 ,循环页数
        for (count = 1; count <= totalpage; count++) {
            if (count != cpage) {
                out = out + "<a href='javascript:void(0)' onclick='goto(" + count + ")'>" + count + "</a>";
            } else {
                out = out + "<span class='current' >" + count + "</span>";
            }
        }
    }
    if (totalpage > 5) {        //总页数大于五页
        if (parseInt((cpage - 1) / 5) == 0) {
            for (count = 1; count <= 5; count++) {
                if (count != cpage) {
                    out = out + "<a href='javascript:void(0)' onclick='goto(" + count + ")'>" + count + "</a>";
                } else {
                    out = out + "<span class='current'>" + count + "</span>";
                }
            }
            out = out + "<a href='javascript:void(0)' onclick='goto(" + count + ")'> 下一页 </a>";
        }
        else if (parseInt((cpage - 1) / 5) == parseInt(totalpage / 5)) {
            out = out + "<a href='javascript:void(0)' onclick='goto(" + (parseInt((cpage - 1) / 5) * 5) + ")'>上一页</a>";
            for (count = parseInt(totalpage / 5) * 5 + 1; count <= totalpage; count++) {
                if (count != cpage) {
                    out = out + "<a href='javascript:void(0)' onclick='goto(" + count + ")'>" + count + "</a>";
                } else {
                    out = out + "<span class='current'>" + count + "</span>";
                }
            }
        }
        else {
            out = out + "<a href='javascript:void(0)' onclick='goto(" + (parseInt((cpage - 1) / 5) * 5) + ")'>上一页</a>";
            for (count = parseInt((cpage - 1) / 5) * 5 + 1; count <= parseInt((cpage - 1) / 5) * 5 + 5; count++) {
                if (count != cpage) {
                    out = out + "<a href='javascript:void(0)' onclick='goto(" + count + ")'>" + count + "</a>";
                } else {
                    out = out + "<span class='current'>" + count + "</span>";
                }
            }
            out = out + "<a href='javascript:void(0)' onclick='goto(" + count + ")'>下一页</a>";
        }
    }
    document.getElementById("waChe").innerHTML = "<div id='waChe'><span id='info'>第" + cpage + "页|共" + totalpage + "页<\/span>" + out + "<\/div>";
    out = "";
}
function error(err) {
    console.log(err.status);
}
