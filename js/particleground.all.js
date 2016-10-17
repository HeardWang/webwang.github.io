/**
 * 规定：
 * configDefault：默认配置项，需挂载到构造函数对象上
 *
 * 对象的属性
 *  set: 参数配置
 *  set.color: 颜色
 *  set.resize: 自适应
 *
 *  c: canvas对象
 *  cw: canvas宽度
 *  ch: canvas高度
 *  cxt: canvas 2d 绘图环境
 *  container: 包裹canvas的容器
 *  dots: {array} 通过arc绘制的粒子对象集
 *  [dot].x: 通过arc绘制的粒子的x值
 *  [dot].y: 通过arc绘制的粒子的y值
 *  paused: {boolean} 是否暂停
 *
 * 对象的方法
 *  color：返回随机或设定好的粒子颜色
 *
 * 原型对象的方法
 *  init: 初始化配置或方法调用
 *  draw: 绘图函数
 */
/**
 * 注释说明：
 *  {object}里的object只表示json格式的对象，其他相应格式对象用function，null，array...
 *  {Object}表示对象，如prototype等难以形容的对象
 */
(function ( factory ){
    if ( typeof module === 'object' && module.exports ) {
        // CMD, like Node.
        module.exports = factory();
    } else {
        // Browser
        factory();
    }
}(function (){
	'use strict';
	var win = window;
    var doc = document;
	var	random = Math.random;
    var floor = Math.floor;
    var isArray = Array.isArray;
    var canvasSupport = !!doc.createElement('canvas').getContext;
    var defaultCanvasWidth = 485;
    var defaultCanvasHeight = 300;
    var regTrimAll = /\s/g;

	function pInt( str ){
		return parseInt( str, 10 );
	}

    function trimAll( str ){
        return str.replace( regTrimAll, '' );
    }

	function randomColor(){
		// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
		return '#' + random().toString( 16 ).slice( -6 );
	}

    /**
     * 限制随机数的范围
     * @param max {number}
     * @param min {number}
     * @returns {number}
     */
	function limitRandom( max, min ){
		return random() * ( max - min ) + min;
	}

    /**
     * 对象的复制，跟jQuery extend方法一致
     * extend( target [, object1 ] [, objectN ] )
     * extend( [ deep ,] target, object1 [, objectN ] )
     * @returns {object}
     */
    function extend(){
        // 站在jQuery的肩膀之上
        var arg = arguments,
            target = arg[ 0 ] || {},
            deep = false,
            length = arg.length,
            i = 1,
            value, attr;

        if( typeof target === 'boolean' ){
            deep = target;
            target = arg[ 1 ] || {};
            i++;
        }

        for( ; i < length; i++ ){
            for( attr in arg[ i ] ){

                value = arg[ i ][ attr ];

                if( deep && ( isPlainObject( value ) || isArray( value ) ) ){

                    target[ attr ] =
                        extend( deep, isArray( value ) ? [] : {}, value );

                }else{
                    target[ attr ] = value;
                }

            }
        }

        return target;
    }

    /**
     * 对象的检测
     * @param obj {*} 需要检测的对象
     * @param type {string} 对象所属类型
     * @returns {boolean}
     */
    function typeChecking( obj, type ){
        // ie 下直接调用 toString 报错
        return Object.prototype.toString.call( obj ) === type;
    }

    function isFunction( obj ){
        return typeChecking( obj, '[object Function]' );
    }

    function isPlainObject( obj ){
        return typeChecking( obj, '[object Object]' );
    }

    /**
     * 检测对象是否是一个DOM元素
     * @param arg {*}
     * @returns {boolean}
     */
    function isElem( arg ){
        // document(nodeType===9)不能是element，因为它没有很多element该有的属性
        // 如用getComputedStyle获取不到它的宽高，就会报错
        // 当传入0的时候，不加!!会返回0，而不是Boolean值
        return !!(arg && arg.nodeType === 1);
    }

    /**
     * 获取对象的css属性值
     * @param elem {element}
     * @param attr {string}
     * @returns {*|string|number}
     */
    var regGetCss = /^\d+(\.\d+)?[a-z]+$/i;
    function getCss( elem, attr ){
        var val = win.getComputedStyle( elem )[ attr ];

        // 对于属性值是200px这样的形式，返回200这样的数字值
        return regGetCss.test( val ) ? pInt( val ) : val;
    }

    /**
     * 获取对象距离页面的top、left值
     * @param elem {element}
     * @returns {{left: (number), top: (number)}}
     */
    function offset( elem ){
        var left = elem.offsetLeft || 0;
        var top  = elem.offsetTop || 0;
        while ( elem = elem.offsetParent ){
            left += elem.offsetLeft;
            top += elem.offsetTop;
        }
        return {
            left: left,
            top: top
        };
    }

    function on( elem, evtName, handler ){
        elem.addEventListener( evtName, handler );
    }

    function off( elem, evtName, handler ){
        elem.removeEventListener( evtName, handler );
    }

    function setCanvasWH( context ){
        context.cw = context.c.width = getCss( context.container, 'width' ) || defaultCanvasWidth;
        context.ch = context.c.height = getCss( context.container, 'height' ) || defaultCanvasHeight;
    }
    /**
     * 插件公共属性继承
     * @param context {this} 实例对象的上下文环境
     * @param constructor {function} 插件构造函数
     * @param selector {string|element} 装裹canvas画布的容器选择器
     * @param options {object} 用户配置选项
     * @returns {boolean} 供插件判断是否创建成功，成功继续执行相应代码，不成功则静默失败
     */
	function createCanvas( context, constructor, selector, options ){
        if( canvasSupport &&
            (context.container = isElem( selector ) ? selector : doc.querySelector( selector )) ){

            context.set = extend( true, {}, Particleground.commonConfig, constructor.defaultConfig, options );
            context.c = doc.createElement( 'canvas' );
            context.cxt = context.c.getContext( '2d' );
            context.paused = false;

            setCanvasWH( context );

            context.container.innerHTML = '';
            context.container.appendChild( context.c );
            context.color = setColor( context.set.color );
            context.init();
        }
    }

    /**
     * 计算刻度值
     * @param val {number} 乘数，(0, 1)表示被乘数的倍数，0 & [1, +∞)表示具体数值
     * @param scale {number} 被乘数
     * @returns {number}
     */
    function scaleValue( val, scale ){
        return val > 0 && val < 1 ? scale * val : val;
    }

    /**
     * 设置color函数
     * @param color {string|array} 颜色数组
     * @returns {function}
     */
    function setColor( color ){
        var colorLength = isArray( color ) ? color.length : false;
        var recolor = function(){
            return color[ floor( random() * colorLength ) ];
        };
        return typeof color !== 'string' ? colorLength ? recolor : randomColor :
            function(){
                return color;
            };
    }

    // 暂停粒子运动
	function pause( context, callback ){
        // 没有set表示实例创建失败，防止错误调用报错
		if( context.set && !context.paused ){
            // 传递关键字供特殊使用
            isFunction( callback ) && callback.call( context, 'pause' );
            context.paused = true;
        }
	}

    // 开启粒子运动
	function open( context, callback ){
		if( context.set && context.paused ){
            isFunction( callback ) && callback.call( context, 'open' );
			context.paused = false;
			context.draw();
		}
	}

    // 自适应窗口，重新计算粒子坐标
    function resize( context, callback ){
        if( context.set.resize ){
            // 不采用函数节流，会出现延迟——很不爽的效果
            on( win, 'resize', function(){
                var oldCW = context.cw;
                var oldCH = context.ch;

                // 重新设置canvas宽高
                setCanvasWH( context );

                // 计算比例
                var scaleX = context.cw / oldCW;
                var scaleY = context.ch / oldCH;

                // 重新赋值
                if( isArray( context.dots ) ){
                    context.dots.forEach(function( v ){
                        if( isPlainObject( v ) ){
                            v.x *= scaleX;
                            v.y *= scaleY;
                        }
                    });
                }

                isFunction( callback ) && callback.call( context, scaleX, scaleY );

                context.paused && context.draw();
            });
        }
    }

    /**
     * 修改原型在 Particleground.inherit 上的方法
     * 使用：util.modifyPrototype( fn, 'pause', function(){})
     * @param prototype {Object} 原型对象
     * @param names {string} 方法名，多个方法名用逗号隔开
     * @param callback {function} 回调函数
     */
    function modifyPrototype( prototype, names, callback ){
        // 将方法名转成数组格式，如：'pause, open'
        if( canvasSupport ){
            trimAll( names ).split(',').forEach(function( name ){
                prototype[ name ] = function(){
                    util[ name ]( this, callback );
                };
            });
        }
    }

    // requestAnimationFrame兼容处理
	win.requestAnimationFrame = (function( win ) {
		return	win.requestAnimationFrame ||
				win.webkitRequestAnimationFrame ||
				win.mozRequestAnimationFrame ||
				function( fn ) {
		        	win.setTimeout( fn, 1000 / 60 );
		        };
	})( win );

    // 工具箱
    var util = {
        pInt: pInt,
        trimAll: trimAll,
        randomColor: randomColor,
        limitRandom: limitRandom,
        extend: extend,
        typeChecking: typeChecking,
        isFunction: isFunction,
        isPlainObject: isPlainObject,
        isElem: isElem,
        getCss: getCss,
        offset: offset,
        createCanvas: createCanvas,
        scaleValue: scaleValue,
        setColor: setColor,
        pause: pause,
        open: open,
        resize: resize,
        modifyPrototype: modifyPrototype
    };

    var Particleground = {
        version: '1.0.1',
        canvasSupport: canvasSupport,
        commonConfig: {
            // 画布全局透明度
            opacity: 1,
            // 粒子颜色，空数组表示随机取色，或赋值特定颜色的数组，如：['red', 'blue', 'green']
            color: [],
            // 默认true: 自适应窗口尺寸变化
            resize: true
        },
        util: util,
        inherit: {
            requestAnimationFrame: function(){
                !this.paused && win.requestAnimationFrame( this.draw.bind( this ) );
            },
            pause: function(){
                pause( this );
            },
            open: function(){
                open( this );
            },
            resize: function(){
                resize( this );
            }
        },
        event: {
            on: on,
            off: off
        },
        extend: function( prototype ){
            return extend( prototype, this.inherit ), this;
        }
    };

    win.Particleground = Particleground;

    // AMD 加载方式放在头部，factory函数会比后面的插件延迟执行
    // 导致后面的插件找不到Particleground对象，报错
    if ( typeof define === 'function' && define.amd ) {
        define(function() {
            return Particleground;
        });
    }

	return Particleground;
}));
// particle.js
+function ( Particleground ) {
    'use strict';

    var util = Particleground.util,
        event = Particleground.event,
        random = Math.random,
        abs = Math.abs,
        pi2 = Math.PI * 2;

    /**
     * 检查元素或其祖先节点的属性是否等于预给值
     * @param elem {element} 起始元素
     * @param property {string} css属性
     * @param value {string} css属性值
     * @returns {boolean}
     */
    function checkParentsProperty( elem, property, value ){
        var getCss = util.getCss;
        while ( elem = elem.offsetParent ){
            if( getCss( elem, property ) === value ){
                return true;
            }
        }
        return false;
    }

    function Particle( selector, options ){
        util.createCanvas( this, Particle, selector, options );
    }

    Particle.defaultConfig = {
        // 粒子运动速度
        speed: 1,
        // 粒子个数，默认为容器宽度的0.12倍
        // 传入(0, 1)显示容器宽度相应倍数的个数，传入[1, +∞)显示具体个数
        num: .12,
        // 粒子最大半径
        max: 2.4,
        // 粒子最小半径
        min: .6,
        // 两点连线的最大值
        // 在range范围内的两点距离小于dis，则两点之间连线
        dis: 130,
        // 线段的宽度
        lineWidth: .2,
        // 定位点的范围，范围越大连线越多，当range等于0时，不连线，相关值无效
        range: 160,
        // 改变定位点坐标的事件元素，null表示canvas画布，或传入原生元素对象，如document等
        eventElem: null
    };

    var fn = Particle.prototype = {
        version: '1.0.0',
        init: function(){
            if( this.set.num > 0 ){
                if( this.set.range > 0 ){

                    // 设置移动事件元素
                    if( !util.isElem( this.set.eventElem ) && this.set.eventElem !== document ){
                        this.set.eventElem = this.c;
                    }

                    // 定位点坐标
                    this.posX = random() * this.cw;
                    this.posY = random() * this.ch;
                    this.event();
                }
                this.createDots();
                this.draw();
                this.resize();
            }
        },
        createDots: function(){
            var cw = this.cw,
                ch = this.ch,
                set = this.set,
                color = this.color,
                limitRandom = util.limitRandom,
                speed = set.speed,
                max = set.max,
                min = set.min,
                num = util.pInt( util.scaleValue( set.num, cw ) ),
                dots = [], r;

            while ( num-- ){
                r = limitRandom( max, min );
                dots.push({
                    x: limitRandom( cw - r, r ),
                    y: limitRandom( ch - r, r ),
                    r: r,
                    vx: limitRandom( speed, -speed * .5 ) || speed,
                    vy: limitRandom( speed, -speed * .5 ) || speed,
                    color: color()
                });
            }

            this.dots = dots;
        },
        draw: function(){
            var set = this.set;
            if( set.num <= 0 ){
                return;
            }

            var cw = this.cw;
            var ch = this.ch;
            var cxt = this.cxt;
            var paused = this.paused;

            cxt.clearRect( 0, 0, cw, ch );

            // 当canvas宽高改变的时候，全局属性需要重新设置
            cxt.lineWidth = set.lineWidth;
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function( v ){
                var r = v.r;
                cxt.save();
                cxt.beginPath();
                cxt.arc( v.x, v.y, r, 0, pi2 );
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();

                // 暂停的时候，vx和vy保持不变，这样自适应窗口变化的时候不会出现粒子移动的状态
                if( !paused ){
                    v.x += v.vx;
                    v.y += v.vy;

                    var	x = v.x;
                    var y = v.y;

                    if( x + r >= cw || x - r <= 0 ){
                        v.vx *= -1;
                    }
                    if( y + r >= ch || y - r <= 0 ){
                        v.vy *= -1;
                    }
                }
            });

            // 当连接范围小于0时，不连接线，可以做出球或气泡运动效果
            if( set.range > 0 ){
                this.connectDots();
            }

            this.requestAnimationFrame();
        },
        connectDots:function(){
            var cxt = this.cxt,
                set = this.set,
                dis = set.dis,
                posX = this.posX,
                posY = this.posY,
                posR = set.range,
                dots = this.dots,
                length = dots.length;

            dots.forEach(function ( v, i ) {
                var vx = v.x;
                var vy = v.y;
                var color = v.color;

                while ( ++i < length ){
                    var sibDot = dots[i];
                    var sx = sibDot.x;
                    var sy = sibDot.y;

                    if( abs( vx - sx ) <= dis &&
                        abs( vy - sy ) <= dis && (
                        abs( vx - posX ) <= posR &&
                        abs( vy - posY ) <= posR ||
                        abs( sx - posX ) <= posR &&
                        abs( sy - posY ) <= posR ) ){
                        cxt.save();
                        cxt.beginPath();
                        cxt.moveTo( vx, vy );
                        cxt.lineTo( sx, sy );
                        cxt.strokeStyle = color;
                        cxt.stroke();
                        cxt.restore();
                    }
                }
            });
        },
        getElemOffset: function(){
            return (this.elemOffset = this.elemOffset ? util.offset( this.set.eventElem ) : null);
        },
        event: function() {
            if( this.set.eventElem !== document ){
                this.elemOffset = true;
            }

            // move事件处理函数
            this.moveHandler = function ( e ) {
                this.posX = e.pageX;
                this.posY = e.pageY;

                // 动态计算 elemOffset 值
                if( this.getElemOffset() ){

                    // 动态判断祖先节点是否具有固定定位，有则使用client计算
                    if( checkParentsProperty( this.set.eventElem, 'position', 'fixed' ) ){
                        this.posX = e.clientX;
                        this.posY = e.clientY;
                    }
                    this.posX -= this.elemOffset.left;
                    this.posY -= this.elemOffset.top;
                }
            }.bind( this );

            // 添加move事件
            eventHandler.call( this );
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend( fn );

    function eventHandler( eventType ){
        var context = this;
        var set = context.set;
        if( set.num > 0 &&　set.range > 0 ){

            // 使用传递过来的关键字判断绑定事件还是移除事件
            eventType = eventType === 'pause' ? 'off' : 'on';
            event[ eventType ]( set.eventElem, 'mousemove', context.moveHandler );
            event[ eventType ]( set.eventElem, 'touchmove', context.moveHandler );
        }
    }

    // 修改原型pause，open方法
    util.modifyPrototype( fn, 'pause, open', eventHandler );

    // 修改原型resize方法
    util.modifyPrototype( fn, 'resize', function( scaleX, scaleY ){
        if( this.set.num > 0 &&　this.set.range > 0 ){
            this.posX *= scaleX;
            this.posY *= scaleY;
            this.getElemOffset();
        }
    });

    // 添加实例
    Particleground.particle = fn.constructor = Particle;

}( Particleground );


// snow.js
+function ( Particleground ) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
        pi2 = Math.PI * 2;

    function Snow( selector, options ){
        util.createCanvas( this, Snow, selector, options );
    }

    Snow.defaultConfig = {
        // 雪花颜色
        color: '#fff',
        // 雪花最大半径
        max: 6.5,
        // 雪花最小半径
        min: .4,
        // 运动速度
        speed: .4
    };

    var fn = Snow.prototype = {
        version: '1.0.0',
        init: function(){
            this.dots = [];
            this.createDots();
            this.draw();
            this.resize();
        },
        snowShape: function(){
            var color = this.color,
                cw = this.cw,
                set = this.set,
                speed = set.speed,
                r = util.limitRandom( set.max, set.min );
            return {
                x: random() * cw,
                y: -r,
                r: r,
                vx: random() || .4,
                vy: r * speed,
                color: color()
            };
        },
        createDots: function(){
            // 随机创建0-6个雪花
            var count = util.pInt( random() * 6 );
            var dots = this.dots;
            while ( count-- ){
                dots.push( this.snowShape() );
            }
        },
        draw: function(){
            var self = this,
                set = self.set,
                cxt = self.cxt,
                cw = self.cw,
                ch = self.ch,
                paused = self.paused;

            cxt.clearRect( 0, 0, cw, ch );
            cxt.globalAlpha = set.opacity;

            self.dots.forEach(function( v, i, array ){
                var x = v.x;
                var y = v.y;
                var r = v.r;

                cxt.save();
                cxt.beginPath();
                cxt.arc( x, y, r, 0, pi2 );
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();

                if( !paused ){
                    v.x += v.vx;
                    v.y += v.vy;

                    // 雪花反方向飘落
                    if( random() > .99 && random() > .5 ){
                        v.vx *= -1;
                    }

                    // 雪花从侧边出去，删除
                    if( x < 0 || x - r > cw ){
                        array.splice( i, 1, self.snowShape() );

                        // 雪花从底部出去，删除
                    }else if( y - r >= ch ){
                        array.splice( i, 1 );
                    }
                }
            });

            // 添加雪花
            if( !paused && random() > .9 ){
                self.createDots();
            }

            self.requestAnimationFrame();
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend( fn );

    // 添加实例
    Particleground.snow = fn.constructor = Snow;

}( Particleground );
// wave.js
+function ( Particleground ) {
    'use strict';

    var util = Particleground.util,
        limitRandom = util.limitRandom,
        randomColor = util.randomColor,
        scaleValue = util.scaleValue,
        random = Math.random,
        sin = Math.sin,
        pi2 = Math.PI * 2,
        UNDEFINED = 'undefined',
        isArray = Array.isArray;

    function Wave( selector, options ){
        util.createCanvas( this, Wave, selector, options );
    }

    Wave.defaultConfig = {
        // 波纹个数
        num: 3,
        // 波纹背景颜色，当fill设置为true时生效
        fillColor: [],
        // 波纹线条(边框)颜色，当stroke设置为true时生效
        lineColor: [],
        // 线条宽度
        lineWidth: [],
        // 线条的横向偏移值，(0, 1)表示容器宽度的倍数，[1, +∞)表示具体数值
        offsetLeft: [],
        // 线条的纵向偏移值，线条中点到元素顶部的距离，(0, 1)表示容器高度的倍数，[1, +∞)表示具体数值
        offsetTop: [],
        // 波峰高度，(0, 1)表示容器高度的倍数，[1, +∞)表示具体数值
        crestHeight: [],
        // 波纹个数，即正弦周期个数
        rippleNum: [],
        // 运动速度
        speed: [],
        // 是否填充背景色，设置为false相关值无效
        fill: false,
        // 是否绘制边框，设置为false相关值无效
        stroke: true
    };


    var fn = Wave.prototype = {
        version: '1.0.0',
        init: function(){
            if( this.set.num > 0 ){

                // 线条波长，每个周期(2π)在canvas上的实际长度
                this.rippleLength = [];

                this.attrNormalize();
                this.createDots();
                this.draw();
                this.resize();
            }
        },
        attrNormalize: function(){
            [
                'fillColor', 'lineColor', 'lineWidth',
                'offsetLeft', 'offsetTop', 'crestHeight',
                'rippleNum', 'speed', 'fill', 'stroke'

            ].forEach(function( attr ){

                this.attrProcessor( attr );

            }.bind( this ));
        },
        attrProcessor: function( attr ){
            var num = this.set.num;
            var attrVal = this.set[ attr ];
            var std = attrVal;
            var scale = attr === 'offsetLeft' ? this.cw : this.ch;

            if( !isArray( attrVal ) ){
                std = this.set[ attr ] = [];
            }

            // 将数组、字符串、数字、布尔类型属性标准化，假设num=3，如：
            // crestHeight: []或[2]或[2, 2], 标准化成: [2, 2, 2]
            // crestHeight: 2, 标准化成: [2, 2, 2]
            // 注意：(0, 1)表示容器高度的倍数，[1, +∞)表示具体数值，其他属性同理
            while ( num-- ){
                var val = isArray( attrVal ) ? attrVal[ num ] : attrVal;

                std[ num ] = typeof val === UNDEFINED ?
                    this.generateAttrVal( attr ) :
                    this.scaleValue( attr, val, scale );

                if( attr === 'rippleNum' ){
                    this.rippleLength[ num ] = this.cw / std[ num ];
                }
            }
        },
        scaleValue: function( attr, val, scale ){
            if( attr === 'offsetTop' ||  attr === 'offsetLeft' || attr === 'crestHeight' ){
                return scaleValue( val, scale );
            }
            return val;
        },
        generateAttrVal: function( attr ){
            var cw = this.cw;
            var ch = this.ch;

            switch ( attr ){
                case 'lineColor':
                case 'fillColor':
                    attr = randomColor();
                    break;
                case 'lineWidth':
                    attr = limitRandom( 2, .2 );
                    break;
                case 'offsetLeft':
                    attr = random() * cw;
                    break;
                case 'offsetTop':
                case 'crestHeight':
                    attr = random() * ch;
                    break;
                case 'rippleNum':
                    attr = limitRandom( cw / 2, 1 );
                    break;
                case 'speed':
                    attr = limitRandom( .4, .1 );
                    break;
                case 'fill':
                    attr = false;
                    break;
                case 'stroke':
                    attr = true;
                    break;
            }
            return attr;
        },
        setOffsetTop: function( topVal ){
            if( this.set.num > 0 ){

                if( !isArray( topVal ) && topVal > 0 && topVal < 1 ){
                    topVal *= this.ch;
                }

                this.set.offsetTop.forEach(function( v, i, array ){

                    // topVal[ i ] || v: 当传入的topVal数组少于自身数组的长度，
                    // 超出部分保持它的原有值，以保证不出现undefined
                    array[ i ] = isArray( topVal ) ? ( topVal[ i ] || v ) : topVal;
                });
            }
        },
        createDots: function(){
            var dots = this.dots = [];
            var rippleLength = this.rippleLength;
            var cw = this.cw;
            var num = this.set.num;

            while ( num-- ){
                var	line = [];

                // 点的y轴步进
                var step = pi2 / rippleLength[ num ];

                // 创建一条线段所需的点
                for( var j = 0; j < cw; j++ ){
                    line.push({
                        x: j,
                        y: j * step
                    });
                }

                dots[ num ] = line;
            }
        },
        draw: function(){
            var set = this.set;
            if( set.num <= 0 ){
                return;
            }

            var cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                paused = this.paused;

            cxt.clearRect( 0, 0, cw, ch );
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function( lineDots, i ){
                var crestHeight = set.crestHeight[i];
                var offsetLeft = set.offsetLeft[i];
                var offsetTop = set.offsetTop[i];
                var speed = set.speed[i];

                cxt.save();
                cxt.beginPath();
                lineDots.forEach(function( v, j ){
                    cxt[ j ? 'lineTo' : 'moveTo'](
                        v.x,

                        // y = A sin（ ωx + φ ）+ h
                        crestHeight * sin( v.y + offsetLeft ) + offsetTop
                    );
                    !paused && ( v.y -= speed );
                });
                if( set.fill[i] ){
                    cxt.lineTo( cw, ch );
                    cxt.lineTo( 0, ch );
                    cxt.closePath();
                    cxt.fillStyle = set.fillColor[i];
                    cxt.fill();
                }
                if( set.stroke[i] ){
                    cxt.lineWidth = set.lineWidth[i];
                    cxt.strokeStyle = set.lineColor[i];
                    cxt.stroke();
                }
                cxt.restore();
            });
            this.requestAnimationFrame();
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend( fn );

    util.modifyPrototype( fn, 'resize', function( scaleX, scaleY ){
        if( this.set.num > 0 ){
            this.dots.forEach(function( lineDots ){
                lineDots.forEach(function( v ){
                    v.x *= scaleX;
                    v.y *= scaleY;
                });
            });
        }
    });

    // 添加实例
    Particleground.wave = fn.constructor = Wave;

}( Particleground );