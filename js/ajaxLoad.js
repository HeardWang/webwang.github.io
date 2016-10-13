/**
 * Created by xz on 2016/10/13.
 */
/*  ajax  */
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
        type: "post",
        success: function (data) {
            CallBack(data,cpage);

        },
        error: function (err) {
            error(err);
        }
    });
}
function CallBack(data,cpage) {
    var item = JSON.parse(data);
    var iLen = item.data.length;
    totalpage = Math.ceil(iLen/5);
    var htm = "";
    // 0 5 10 // 5 10 15
    for(var i = (cpage - 1)*5;i < cpage*5;i++){
        if(typeof item.data[i] == "undefined"){
            //console.log(typeof item.data[i] == "undefined");
            continue;
        }else{
            htm += '<div class="container-left-item clearfix fadeIn animated">';
            htm += '<div class="item-title">';
            htm += '<a class="label label-important" href='+item.data[i].link+'>'+item.data[i].tag+'<i class="label-arrow"></i></a>';
            htm += '<h2><a target="_blank" href='+item.data[i].link+' title='+item.data[i].title+'>'+item.data[i].title+'</a>';
            htm += '</h2>';
            htm += '</div>';
            htm += '<div class="focus">';
            htm += '<a target="_blank" href='+item.data[i].link+'>';
            htm += '<img class="thumb scale" src='+item.data[i].img+' alt='+item.data[i].title+'>';
            htm += '</a>';
            htm += '</div>';
            htm += '<span class="note">'+item.data[i].preface+'</span>';
            htm += '<div class="auth">';
            htm += '<span>发布日期：'+item.data[i].date+'</span>';
            htm += '<a href='+item.data[i].link+' target="_blank">阅读全文</a>';
            htm += '</div>';
            htm += '</div>';
        }
    }
    if (item.status == 200) {
        $('.container-content').empty().append(htm);
    }
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
/*function goto(target) {
    cpage = target;        //把页面计数定位到第几页
    ajaxLoad();
}*/
