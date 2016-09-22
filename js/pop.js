function Dialog()
{
    Dialog.Mask = function (o)
    {
        if (frameElement)
        {
            var Sf = FramEle(),
                o = C.G(o),
                Htm = top.document.documentElement,
                Wp = top.C.G(o.id.slice(-3)) || top.C.G(Dialog.arguments[0]);
            Ms = top.C.Gs(Wp, "i");
            Ms[0].style.width = Ms[2].style.width = "100%";
            Ms[0].style.height = o.offsetTop + Sf.top + "px";
            Ms[2].height = Htm.scrollHeight - o.offsetHeight - o.offsetTop - Sf.top + "px";
            Ms[2].style.top = o.offsetHeight + o.offsetTop + Sf.top + "px";
            Ms[1].style.width = Htm.scrollWidth - o.offsetWidth - o.offsetLeft - Sf.left + "px";
            Ms[1].style.height = Ms[3].style.height = o.offsetHeight + "px";
            Ms[1].style.top = Ms[3].style.top = Ms[0].style.height;
            Ms[3].style.width = o.offsetLeft + Sf.left + "px";
            Ms[1].style.left = o.offsetLeft + o.offsetWidth + Sf.left + "px";
            Ms[2].style.height = Htm.scrollHeight - o.offsetHeight - o.offsetTop - Sf.top + "px";
            Wp.style.display = "block";
        }
    };
    var Sh = document.documentElement.scrollHeight,
        Sw = document.documentElement.scrollWidth,
        B = !arguments[1] ? C.G(arguments[0]) : C.G(arguments[1]),
        Pst = B.id.substring(0, 2).toUpperCase(),
        Ist = Pst == "TM",
        that = this;
    B.style.display = "block";
    B.T = (document.documentElement.clientHeight - B.offsetHeight) / 2 + (document.documentElement.scrollTop || document.body.scrollTop);
    B.L = (Sw / 2 - B.offsetWidth / 2);
    if (Pst == "AC")
    {
        var Ac = !arguments[1] ? C.G(arguments[0]) : C.G(arguments[1]);
        Ac.style.display = "block";
        Ac.style.top = B.T + "px";
        Ac.style.left = B.L + "px";
        (arguments.length == 2 && top.C.G(arguments[0])) && Dialog.Mask(Ac);
        setTimeout(function () { Dialog.Close(Ac, arguments[1]); }, parseInt(B.id.charAt(2)) * 1000);
    }
    else
    {
        if (Ist)
        {
            var Fe = FramEle();
            if (Fe)
            {
                B.Bg = top.C.G(B.id.slice(-3));
                B.T = top.document.documentElement.clientHeight / 2 - (Fe.top - top.document.documentElement.scrollTop - top.document.body.scrollTop) - B.offsetHeight / 2;
                B.T = B.T < 0 ? 0 : B.T;
                B.L += (top.document.documentElement.offsetWidth - Fe.FRE.offsetWidth) / 2 - Fe.FRE.offsetLeft;
            }
        }
        this.Bx = B;
    }
    B.style.top = B.T + "px";
    B.style.left = B.L + "px";

    if (Ist)
    {
        Dialog.Mask(B);
    }
    if (arguments.length > 1)
    {
        B.Bg = C.G(arguments[0]) || top.C.G(arguments[0]);
        B.Bg.style.width = Sw + "px";
        B.Bg.style.height = Sh + "px";
        B.Bg.style.display = "block";

    }
    function FramEle()
    {
        if (frameElement)
        {
            var FRE = frameElement,
                fTop = 0,
                fLeft = 0;
            while (FRE.offsetParent.tagName.toLowerCase() != "body")
            {
                FRE = FRE.offsetParent;
                fTop += FRE.offsetTop;
                fLeft += FRE.offsetLeft;
            }
            fTop = fTop ? fTop + frameElement.offsetTop : frameElement.offsetTop;
            fLeft = fLeft ? fLeft + frameElement.offsetLeft : frameElement.offsetLeft;
            return {
                FRE: FRE,
                top: fTop,
                left: fLeft
            };
        }
    }
    Dialog.Close = function ()
    {
        if (arguments.length > 0)
        {
            for (var i = 0; i < arguments.length; i++)
            {
                var od = C.G(arguments[i]);
                if (od)
                {
                    od.style.display = "none";
                    if (od.Bg)
                    {
                        od.Bg.style.display = "none";
                    }
                }
            }
        }
        else
        {
            if (that.Bx)
            {
                that.Bx.style.display = "none";
                if (that.Bx.Bg)
                {
                    that.Bx.Bg.style.display = "none";
                }
            } else if (that.Ab)
            {
                that.Ab.style.display = "none";
                if (that.Ab.Bg)
                {
                    that.Ab.Bg.style.display = "none";
                }
            }
        }
    }
}
//*
// Dialog是一个用来实现弹出窗体的功能类组件，其内容和外观由调用者在html和Css文件中指定，调用时直接传入欲弹出元素的ID即可，如果需要指定弹出层背景，同时传入背景元素和内容元素的ID，如本模型的背景元素div的id为“WBg”，内容元素div的id为“Pop”，则调用时代码为：Dialog("WBg","Pop")。
//需要关闭弹出窗时，可以像这样调用：Dialog.Close()； 多重弹出时，可为该方法指定参数，为欲关闭弹出窗的ID，如：Dialog.Close("Pop"),则只会关闭ID为"Pop"的弹出窗。
//需要定时关闭的弹出窗，在设置弹出元素ID时，请以"AC"前缀，并将时间间隔跟在"AC"后，如"AC2"则表示在2秒钟后会自动关闭。

//该模块调用代码:
//    <script type="text/javascript">
//    Dialog("WBg","Pop");
//</script>
//