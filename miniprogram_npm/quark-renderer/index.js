module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1582161598597, function(require, module, exports) {
var _quarkRenderer = require("./lib/quark-renderer");

(function () {
  for (var key in _quarkRenderer) {
    if (_quarkRenderer == null || !_quarkRenderer.hasOwnProperty(key) || key === 'default' || key === '__esModule') return;
    exports[key] = _quarkRenderer[key];
  }
})();

var _export = require("./lib/export");

(function () {
  for (var key in _export) {
    if (_export == null || !_export.hasOwnProperty(key) || key === 'default' || key === '__esModule') return;
    exports[key] = _export[key];
  }
})();

require("./lib/svg/svg");
}, function(modId) {var map = {"./lib/quark-renderer":1582161598598,"./lib/export":1582161598642,"./lib/svg/svg":1582161598684}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598598, function(require, module, exports) {
var guid = require("./core/utils/guid");

var env = require("./core/env");

var QRendererEventHandler = require("./event/QRendererEventHandler");

var Storage = require("./Storage");

var CanvasPainter = require("./CanvasPainter");

var GlobalAnimationMgr = require("./animation/GlobalAnimationMgr");

var DomEventProxy = require("./event/DomEventProxy");

var textContain = require("./core/contain/text");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.core.QuarkRenderer
 * QuarkRenderer, a high performance 2d drawing library.
 * Class QuarkRenderer is the global entry, every time you call qrenderer.init() will 
 * create an instance of QuarkRenderer class, each instance has an unique id.
 * 
 * QuarkRenderer 是一款高性能的 2d 渲染引擎。
 * QuarkRenderer 类是全局入口，每次调用 qrenderer.init() 会创建一个实例，
 * 每个 QuarkRenderer 实例有自己唯一的 ID。
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */
if (!env.canvasSupported) {
  throw new Error("Need Canvas Environment.");
}

var painterMap = {
  canvas: CanvasPainter
}; // QuarkRenderer 实例map索引，浏览器中同一个 window 下的 QuarkRenderer 实例都存在这里。

var instances = {};
/**
 * @property {String}
 */

var version = '1.0.11';
/**
 * @method qrenderer.init()
 * Global entry for creating a qrenderer instance.
 * 
 * 全局总入口，创建 QuarkRenderer 的实例。
 * 
 * @param {HTMLDomElement|Canvas|Context} host 
 * This can be a HTMLDomElement like a DIV, or a Canvas instance, 
 * or Context for Wechat mini-program.
 * 
 * 此属性可以是 HTMLDomElement ，比如 DIV 标签；也可以是 Canvas 实例；或者是 Context 实例，因为在某些
 * 运行环境中，不能获得 Canvas 实例的引用，只能获得 Context。
 * @param {Object} [options]
 * @param {String} [options.renderer='canvas'] 'canvas' or 'svg'
 * @param {Number} [options.devicePixelRatio]
 * @param {Number|String} [options.width] Can be 'auto' (the same as null/undefined)
 * @param {Number|String} [options.height] Can be 'auto' (the same as null/undefined)
 * @return {QuarkRenderer}
 */

function init(host, options) {
  var qr = new QuarkRenderer(host, options);
  instances[qr.id] = qr;
  return qr;
}
/**
 * TODO: 不要export这个全局函数看起来也没有问题。
 * Dispose qrenderer instance
 * @param {QuarkRenderer} qr
 */


function dispose(qr) {
  if (qr) {
    qr.dispose();
  } else {
    for (var key in instances) {
      if (instances.hasOwnProperty(key)) {
        instances[key].dispose();
      }
    }

    instances = {};
  }

  return this;
}
/**
 * @static
 * @method getInstance
 * Get qrenderer instance by id.
 * @param {String} id
 * @return {QuarkRenderer}
 */


function getInstance(id) {
  return instances[id];
}

function registerPainter(name, PainterClass) {
  painterMap[name] = PainterClass;
}
/**
 * @method constructor QuarkRenderer
 * @param {String} id
 * @param {HTMLElement} host
 * @param {Object} [options]
 * @param {String} [options.renderer='canvas'] 'canvas' or 'svg'
 * @param {Number} [options.devicePixelRatio]
 * @param {Number} [options.width] Can be 'auto' (the same as null/undefined)
 * @param {Number} [options.height] Can be 'auto' (the same as null/undefined)
 * @return {QuarkRenderer}
 */


var QuarkRenderer =
/*#__PURE__*/
function () {
  function QuarkRenderer(host) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, QuarkRenderer);

    /**
     * @property {String}
     */
    this.id = guid();
    /**
     * @property {HTMLDomElement|Canvas|Context} host 
     * This can be a HTMLDomElement like a DIV, or a Canvas instance, 
     * or Context for Wechat mini-program.
     * 
     * 此属性可以是 HTMLDomElement ，比如 DIV 标签；也可以是 Canvas 实例；或者是 Context 实例，因为在某些
     * 运行环境中，不能获得 Canvas 实例的引用，只能获得 Context。
     */

    this.host = host;
    var self = this;
    /**
     * @property {Storage}
     */

    this.storage = new Storage();
    var rendererType = options.renderer;

    if (!rendererType || !painterMap[rendererType]) {
      rendererType = 'canvas';
    } //根据参数创建不同类型的 Painter 实例。


    this.painter = new painterMap[rendererType](this.host, this.storage, options, this.id);
    var handerProxy = null;

    if (typeof this.host.moveTo !== 'function') {
      //代理DOM事件。
      if (!env.node && !env.worker && !env.wxa) {
        handerProxy = new DomEventProxy(this.painter.getHost());
      }
    } else {
      // host is Context instance, override function.
      textContain.$override('measureText', function (text, font) {
        self.font = font || textContain.DEFAULT_FONT;
        return self.host.measureText(text);
      });
    } //QuarkRenderer 自己封装的事件机制。


    this.eventHandler = new QRendererEventHandler(this.storage, this.painter, handerProxy, this.painter.root);
    /**
     * @property {GlobalAnimationMgr}
     * 利用 GlobalAnimationMgr 动画的 frame 事件渲染下一张画面， QuarkRenderer 依赖此机制来刷新 canvas 画布。
     * FROM MDN：
     * The window.requestAnimationFrame() method tells the browser that you wish 
     * to perform an animation and requests that the browser calls a specified 
     * function to update an animation before the next repaint. The method takes 
     * a callback as an argument to be invoked before the repaint.
     * 
     * https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
     * 
     * NOTE: 这里有潜在的性能限制，由于 requestAnimationFrame 方法每秒回调60次，每次执行时间约 16ms
     * 如果在 16ms 的时间内无法渲染完一帧画面，会出现卡顿。也就是说， QuarkRenderer 引擎在同一张 canvas 上
     * 能够渲染的图形元素数量有上限。本机在 Chrome 浏览器中 Benchmark 的结果大约为 100 万个矩形会出现
     * 明显的卡顿。
     */

    this.globalAnimationMgr = new GlobalAnimationMgr();
    this.globalAnimationMgr.on("frame", function () {
      self.flush();
    });
    this.globalAnimationMgr.start();
    /**
     * @property {boolean}
     * @private
     */

    this._needsRefresh; // 修改 storage.delFromStorage, 每次删除元素之前删除动画
    // FIXME 有点ugly
    // What's going on here?

    var oldDelFromStorage = this.storage.delFromStorage;
    var oldAddToStorage = this.storage.addToStorage;

    this.storage.delFromStorage = function (el) {
      oldDelFromStorage.call(self.storage, el);
      el && el.removeSelfFromQr(self);
    };

    this.storage.addToStorage = function (el) {
      oldAddToStorage.call(self.storage, el);
      el.addSelfToQr(self);
    };
  }
  /**
   * @method
   * 获取实例唯一标识
   * @return {String}
   */


  _createClass(QuarkRenderer, [{
    key: "getId",
    value: function getId() {
      return this.id;
    }
    /**
     * @method
     * 添加元素
     * @param  {qrenderer/Element} el
     */

  }, {
    key: "add",
    value: function add(el) {
      this.storage.addRoot(el);
      this._needsRefresh = true;
    }
    /**
     * @method
     * 删除元素
     * @param  {qrenderer/Element} el
     */

  }, {
    key: "remove",
    value: function remove(el) {
      this.storage.delRoot(el);
      this._needsRefresh = true;
    }
    /**
     * @private
     * @method
     * Change configuration of layer
     * @param {String} qLevel
     * @param {Object} [config]
     * @param {String} [config.clearColor=0] Clear color
     * @param {String} [config.motionBlur=false] If enable motion blur
     * @param {Number} [config.lastFrameAlpha=0.7] Motion blur factor. Larger value cause longer trailer
    */

  }, {
    key: "configLayer",
    value: function configLayer(qLevel, config) {
      if (this.painter.configLayer) {
        this.painter.configLayer(qLevel, config);
      }

      this._needsRefresh = true;
    }
    /**
     * @method
     * Set background color
     * @param {String} backgroundColor
     */

  }, {
    key: "setBackgroundColor",
    value: function setBackgroundColor(backgroundColor) {
      if (this.painter.setBackgroundColor) {
        this.painter.setBackgroundColor(backgroundColor);
      }

      this._needsRefresh = true;
    }
    /**
     * @private
     * @method
     * Repaint the canvas immediately
     */

  }, {
    key: "refreshImmediately",
    value: function refreshImmediately() {
      // let start = new Date();
      // Clear needsRefresh ahead to avoid something wrong happens in refresh
      // Or it will cause qrenderer refreshes again and again.
      this._needsRefresh = this._needsRefreshHover = false;
      this.painter.refresh(); // Avoid trigger qr.refresh in Element#beforeUpdate hook

      this._needsRefresh = this._needsRefreshHover = false; // let end = new Date();
      // let log = document.getElementById('log');
      // if (log) {
      //     log.innerHTML = log.innerHTML + '<br>' + (end - start);
      // }
    }
    /**
     * @method
     * Mark and repaint the canvas in the next frame of browser
     */

  }, {
    key: "refresh",
    value: function refresh() {
      this._needsRefresh = true;
    }
    /**
     * @private
     * @method
     * Perform all refresh
     * 刷新 canvas 画面，此方法会在 window.requestAnimationFrame 方法中被不断调用。
     */

  }, {
    key: "flush",
    value: function flush() {
      var triggerRendered;

      if (this._needsRefresh) {
        //是否需要全部重绘
        triggerRendered = true;
        this.refreshImmediately();
      }

      if (this._needsRefreshHover) {
        //只重绘特定的元素，提升性能
        triggerRendered = true;
        this.refreshHoverImmediately();
      }

      triggerRendered && this.trigger('rendered');
    }
    /**
     * @private
     * @method
     * 与 Hover 相关的6个方法用来处理浮动层，当鼠标悬停在 canvas 中的元素上方时，可能会需要
     * 显示一些浮动的层来展现一些特殊的数据。
     * TODO:这里可能有点问题，Hover 一词可能指的是遮罩层，而不是浮动层，如果确认是遮罩，考虑
     * 把这里的 API 单词重构成 Mask。
     * 
     * Add element to hover layer
     * @param  {Element} el
     * @param {Object} style
     */

  }, {
    key: "addHover",
    value: function addHover(el, style) {
      if (this.painter.addHover) {
        var elMirror = this.painter.addHover(el, style);
        this.refreshHover();
        return elMirror;
      }
    }
    /**
     * @private
     * @method
     * Remove element from hover layer
     * @param  {Element} el
     */

  }, {
    key: "removeHover",
    value: function removeHover(el) {
      if (this.painter.removeHover) {
        this.painter.removeHover(el);
        this.refreshHover();
      }
    }
    /**
     * @private
     * @method
     * Find hovered element
     * @param {Number} x
     * @param {Number} y
     * @return {Object} {target, topTarget}
     */

  }, {
    key: "findHover",
    value: function findHover(x, y) {
      return this.eventHandler.findHover(x, y);
    }
    /**
     * @private
     * @method
     * Clear all hover elements in hover layer
     * @param  {Element} el
     */

  }, {
    key: "clearHover",
    value: function clearHover() {
      if (this.painter.clearHover) {
        this.painter.clearHover();
        this.refreshHover();
      }
    }
    /**
     * @private
     * @method
     * Refresh hover in next frame
     */

  }, {
    key: "refreshHover",
    value: function refreshHover() {
      this._needsRefreshHover = true;
    }
    /**
     * @private
     * @method
     * Refresh hover immediately
     */

  }, {
    key: "refreshHoverImmediately",
    value: function refreshHoverImmediately() {
      this._needsRefreshHover = false;
      this.painter.refreshHover && this.painter.refreshHover();
    }
    /**
     * @method
     * Resize the canvas.
     * Should be invoked when container size is changed
     * @param {Object} [options]
     * @param {Number|String} [options.width] Can be 'auto' (the same as null/undefined)
     * @param {Number|String} [options.height] Can be 'auto' (the same as null/undefined)
     */

  }, {
    key: "resize",
    value: function resize(options) {
      options = options || {};
      this.painter.resize(options.width, options.height);
      this.eventHandler.resize();
    }
    /**
     * @method
     * Stop and clear all animation immediately
     */

  }, {
    key: "clearAnimation",
    value: function clearAnimation() {
      this.globalAnimationMgr.clear();
    }
    /**
     * @method
     * Get container width
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      return this.painter.getWidth();
    }
    /**
     * @method
     * Get container height
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this.painter.getHeight();
    }
    /**
     * @method
     * Converting a path to image.
     * It has much better performance of drawing image rather than drawing a vector path.
     * @param {graphic/Path} e
     * @param {Number} width
     * @param {Number} height
     */

  }, {
    key: "pathToImage",
    value: function pathToImage(e, dpr) {
      return this.painter.pathToImage(e, dpr);
    }
    /**
     * @method
     * Set default cursor
     * @param {String} [cursorStyle='default'] 例如 crosshair
     */

  }, {
    key: "setCursorStyle",
    value: function setCursorStyle(cursorStyle) {
      this.eventHandler.setCursorStyle(cursorStyle);
    }
    /**
     * @method
     * Bind event
     *
     * @param {String} eventName Event name
     * @param {Function} eventHandler Handler function
     * @param {Object} [context] Context object
     */

  }, {
    key: "on",
    value: function on(eventName, eventHandler, context) {
      this.eventHandler.on(eventName, eventHandler, context);
    }
    /**
     * @method
     * Unbind event
     * @param {String} eventName Event name
     * @param {Function} [eventHandler] Handler function
     */

  }, {
    key: "off",
    value: function off(eventName, eventHandler) {
      this.eventHandler.off(eventName, eventHandler);
    }
    /**
     * @method
     * Trigger event manually
     *
     * @param {String} eventName Event name
     * @param {event=} event Event object
     */

  }, {
    key: "trigger",
    value: function trigger(eventName, event) {
      this.eventHandler.trigger(eventName, event);
    }
    /**
     * @method
     * Clear all objects and the canvas.
     */

  }, {
    key: "clear",
    value: function clear() {
      this.storage.delRoot();
      this.painter.clear();
    }
    /**
     * @method
     * Dispose self.
     */

  }, {
    key: "dispose",
    value: function dispose() {
      this.globalAnimationMgr.stop();
      this.clear();
      this.storage.dispose();
      this.painter.dispose();
      this.eventHandler.dispose();
      this.globalAnimationMgr = this.storage = this.painter = this.eventHandler = null;
      delete instances[this.id];
    }
  }]);

  return QuarkRenderer;
}(); // ---------------------------
// Events of qrenderer instance.
// ---------------------------

/**
 * @event onclick
 * @param {Function} null
 */

/**
 * @event onmouseover
 * @param {Function} null
 */

/**
 * @event onmouseout
 * @param {Function} null
 */

/**
 * @event onmousemove
 * @param {Function} null
 */

/**
 * @event onmousewheel
 * @param {Function} null
 */

/**
 * @event onmousedown
 * @param {Function} null
 */

/**
 * @event onmouseup
 * @param {Function} null
 */

/**
 * @event ondrag
 * @param {Function} null
 */

/**
 * @event ondragstart
 * @param {Function} null
 */

/**
 * @event ondragend
 * @param {Function} null
 */

/**
 * @event ondragenter
 * @param {Function} null
 */

/**
 * @event ondragleave
 * @param {Function} null
 */

/**
 * @event ondragover
 * @param {Function} null
 */

/**
 * @event ondrop
 * @param {Function} null
 */

/**
 * @event onpagemousemove
 * @param {Function} null
 */

/**
 * @event onpagemouseup
 * @param {Function} null
 */


exports.version = version;
exports.init = init;
exports.dispose = dispose;
exports.getInstance = getInstance;
exports.registerPainter = registerPainter;
}, function(modId) { var map = {"./core/utils/guid":1582161598599,"./core/env":1582161598600,"./event/QRendererEventHandler":1582161598601,"./Storage":1582161598611,"./CanvasPainter":1582161598625,"./animation/GlobalAnimationMgr":1582161598640,"./event/DomEventProxy":1582161598641,"./core/contain/text":1582161598637}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598599, function(require, module, exports) {
/**
 * 生成唯一id
 * @author errorrik (errorrik@gmail.com)
 */
var idStart = 0x0907;

function _default() {
  return idStart++;
}

module.exports = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598600, function(require, module, exports) {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * echarts设备环境识别
 *
 * @desc echarts基于Canvas，纯Javascript图表库，提供直观，生动，可交互，可个性化定制的数据统计图表。
 * @author firede[firede@firede.us]
 * @desc thanks zepto.
 */
// Zepto.js
// (c) 2010-2013 Thomas Fuchs
// Zepto.js may be freely distributed under the MIT license.
function detect(ua) {
  var os = {};
  var browser = {}; // var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
  // var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  // var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  // var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  // var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
  // var webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
  // var touchpad = webos && ua.match(/TouchPad/);
  // var kindle = ua.match(/Kindle\/([\d.]+)/);
  // var silk = ua.match(/Silk\/([\d._]+)/);
  // var blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
  // var bb10 = ua.match(/(BB10).*Version\/([\d.]+)/);
  // var rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
  // var playbook = ua.match(/PlayBook/);
  // var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);

  var firefox = ua.match(/Firefox\/([\d.]+)/); // var safari = webkit && ua.match(/Mobile\//) && !chrome;
  // var webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome;

  var ie = ua.match(/MSIE\s([\d.]+)/) // IE 11 Trident/7.0; rv:11.0
  || ua.match(/Trident\/.+?rv:(([\d.]+))/);
  var edge = ua.match(/Edge\/([\d.]+)/); // IE 12 and 12+

  var weChat = /micromessenger/i.test(ua); // Todo: clean this up with a better OS/browser seperation:
  // - discern (more) between multiple browsers on android
  // - decide if kindle fire in silk mode is android or not
  // - Firefox on Android doesn't specify the Android version
  // - possibly devide in os, device and browser hashes
  // if (browser.webkit = !!webkit) browser.version = webkit[1];
  // if (android) os.android = true, os.version = android[2];
  // if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
  // if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
  // if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
  // if (webos) os.webos = true, os.version = webos[2];
  // if (touchpad) os.touchpad = true;
  // if (blackberry) os.blackberry = true, os.version = blackberry[2];
  // if (bb10) os.bb10 = true, os.version = bb10[2];
  // if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
  // if (playbook) browser.playbook = true;
  // if (kindle) os.kindle = true, os.version = kindle[1];
  // if (silk) browser.silk = true, browser.version = silk[1];
  // if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
  // if (chrome) browser.chrome = true, browser.version = chrome[1];

  if (firefox) {
    browser.firefox = true;
    browser.version = firefox[1];
  } // if (safari && (ua.match(/Safari/) || !!os.ios)) browser.safari = true;
  // if (webview) browser.webview = true;


  if (ie) {
    browser.ie = true;
    browser.version = ie[1];
  }

  if (edge) {
    browser.edge = true;
    browser.version = edge[1];
  } // It is difficult to detect WeChat in Win Phone precisely, because ua can
  // not be set on win phone. So we do not consider Win Phone.


  if (weChat) {
    browser.weChat = true;
  } // os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
  //     (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
  // os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos ||
  //     (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
  //     (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));


  return {
    browser: browser,
    os: os,
    node: false,
    // 原生canvas支持，改极端点了
    // canvasSupported : !(browser.ie && parseFloat(browser.version) < 9)
    canvasSupported: !!document.createElement('canvas').getContext,
    svgSupported: typeof SVGRect !== 'undefined',
    // works on most browsers
    // IE10/11 does not support touch event, and MS Edge supports them but not by
    // default, so we dont check navigator.maxTouchPoints for them here.
    touchEventsSupported: 'ontouchstart' in window && !browser.ie && !browser.edge,
    // <http://caniuse.com/#search=pointer%20event>.
    pointerEventsSupported: 'onpointerdown' in window // Firefox supports pointer but not by default, only MS browsers are reliable on pointer
    // events currently. So we dont use that on other browsers unless tested sufficiently.
    // Although IE 10 supports pointer event, it use old style and is different from the
    // standard. So we exclude that. (IE 10 is hardly used on touch device)
    && (browser.edge || browser.ie && browser.version >= 11),
    // passiveSupported: detectPassiveSupport()
    domSupported: typeof document !== 'undefined'
  };
}

var env = {};

if ((typeof wx === "undefined" ? "undefined" : _typeof(wx)) === 'object' && typeof wx.getSystemInfoSync === 'function') {
  // In Weixin Application
  env = {
    browser: {},
    os: {},
    node: false,
    wxa: true,
    // Weixin Application
    canvasSupported: true,
    svgSupported: false,
    touchEventsSupported: true,
    domSupported: false
  };
} else if (typeof document === 'undefined' && typeof self !== 'undefined') {
  // In worker
  env = {
    browser: {},
    os: {},
    node: false,
    worker: true,
    canvasSupported: true,
    domSupported: false
  };
} else if (typeof navigator === 'undefined') {
  // In node
  env = {
    browser: {},
    os: {},
    node: true,
    worker: false,
    // Assume canvas is supported
    canvasSupported: true,
    svgSupported: true,
    domSupported: false
  };
} else {
  env = detect(navigator.userAgent);
}

var _default = env;
module.exports = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598601, function(require, module, exports) {
var dataUtil = require("../core/utils/data_structure_util");

var classUtil = require("../core/utils/class_util");

var vec2 = require("../core/utils/vector");

var eventTool = require("../core/utils/event_util");

var MultiDragDrop = require("./MultiDragDrop");

var Eventful = require("./Eventful");

var GestureMgr = require("./GestureMgr");

/**
 * @class qrenderer.event.QRendererEventHandler
 * Canvas 内置的API只在 canvas 实例本身上面触发事件，对画布内部的画出来的元素没有提供事件支持。
 * QRendererEventHandler.js 用来封装画布内部元素的事件处理逻辑，核心思路是，在 canvas 收到事件之后，派发给指定的元素，
 * 然后再进行冒泡，从而模拟出原生 DOM 事件的行为。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var SILENT = 'silent';
/**
 * @private
 * @method
 * @param {String} eveType 
 * @param {Object} targetInfo 
 * @param {Event} event 
 */

function makeEventPacket(eveType, targetInfo, event) {
  return {
    type: eveType,
    event: event,
    // target can only be an element that is not silent.
    target: targetInfo.target,
    // topTarget can be a silent element.
    topTarget: targetInfo.topTarget,
    cancelBubble: false,
    offsetX: event.qrX,
    offsetY: event.qrY,
    gestureEvent: event.gestureEvent,
    pinchX: event.pinchX,
    pinchY: event.pinchY,
    pinchScale: event.pinchScale,
    wheelDelta: event.qrDelta,
    qrByTouch: event.qrByTouch,
    qrIsFromLocal: event.qrIsFromLocal,
    which: event.which,
    stop: stopEvent
  };
}
/**
 * @private
 * @method
 * @param {Event} event  
 */


function stopEvent(event) {
  eventTool.stop(this.event);
}

function EmptyProxy() {}

EmptyProxy.prototype.dispose = function () {};

var handlerNames = ['click', 'dblclick', 'mousewheel', 'mouseout', 'mouseup', 'mousedown', 'mousemove', 'contextmenu', 'pagemousemove', 'pagemouseup', 'pagekeydown', 'pagekeyup'];
/**
 * @method
 * 监听页面上触发的事件，转换成当前实例自己触发的事件
 * @param {String} pageEventName 
 * @param {Event} event 
 */

function pageEventHandler(pageEventName, event) {
  this.trigger(pageEventName, makeEventPacket(pageEventName, {}, event));
}
/**
 * @method
 * 鼠标是否在指定的元素上方。
 * @param {Displayable} displayable 
 * @param {Number} x 
 * @param {Number} y 
 */


function isHover(displayable, x, y) {
  if (displayable[displayable.rectHover ? 'rectContain' : 'contain'](x, y)) {
    var el = displayable;
    var isSilent;

    while (el) {
      // If clipped by ancestor.
      // FIXME: If clipPath has neither stroke nor fill,
      // el.clipPath.contain(x, y) will always return false.
      if (el.clipPath && !el.clipPath.contain(x, y)) {
        return false;
      }

      if (el.silent) {
        isSilent = true;
      }

      el = el.parent;
    }

    return isSilent ? SILENT : true;
  }

  return false;
}
/**
 * @private
 * @method
 * @param {Function} handlerInstance 
 */


function afterListenerChanged(handlerInstance) {
  //监听整个页面上的事件
  var allSilent = handlerInstance.isSilent('pagemousemove') && handlerInstance.isSilent('pagemouseup') && handlerInstance.isSilent('pagekeydown') && handlerInstance.isSilent('pagekeyup');
  var proxy = handlerInstance.proxy;
  proxy && proxy.togglePageEvent && proxy.togglePageEvent(!allSilent);
}
/**
 * @method constructor QRendererEventHandler
 * @param {Storage} storage Storage instance.
 * @param {Painter} painter Painter instance.
 * @param {HandlerProxy} proxy HandlerProxy instance.
 * @param {HTMLElement} painterRoot painter.root (not painter.getViewportRoot()).
 */


var QRendererEventHandler = function QRendererEventHandler(storage, painter, proxy, painterRoot) {
  Eventful.call(this, {
    afterListenerChanged: dataUtil.bind(afterListenerChanged, null, this)
  });
  /**
   * @property storage
   */

  this.storage = storage;
  /**
   * @property painter
   */

  this.painter = painter;
  /**
   * @property painterRoot
   */

  this.painterRoot = painterRoot;
  proxy = proxy || new EmptyProxy();
  /**
   * @property proxy
   * Proxy of event. can be Dom, WebGLSurface, etc.
   */

  this.proxy = null;
  /**
   * @private 
   * @property {Object} _hovered
   */

  this._hovered = {};
  /**
   * @private
   * @property {Date} _lastTouchMoment
   */

  this._lastTouchMoment;
  /**
   * @private
   * @property {Number} _lastX
   */

  this._lastX;
  /**
   * @private
   * @property {Number} _lastY
   */

  this._lastY;
  /**
   * @private
   * @property _gestureMgr
   */

  this._gestureMgr;
  new MultiDragDrop(this);
  this.setHandlerProxy(proxy);
};

QRendererEventHandler.prototype = {
  constructor: QRendererEventHandler,

  /**
   * @method setHandlerProxy
   * @param {*} proxy 
   */
  setHandlerProxy: function setHandlerProxy(proxy) {
    if (this.proxy) {
      this.proxy.dispose();
    }

    if (proxy) {
      dataUtil.each(handlerNames, function (name) {
        // 监听 Proxy 上面派发的原生DOM事件，转发给本类的处理方法。
        proxy.on && proxy.on(name, this[name], this);
      }, this); // Attach handler

      proxy.handler = this;
    }

    this.proxy = proxy;
  },

  /**
   * @method mousemove
   * @param {*} proxy 
   */
  mousemove: function mousemove(event) {
    var x = event.qrX;
    var y = event.qrY;
    var lastHovered = this._hovered;
    var lastHoveredTarget = lastHovered.target; // If lastHoveredTarget is removed from qr (detected by '__qr') by some API call
    // (like 'setOption' or 'dispatchAction') in event handlers, we should find
    // lastHovered again here. Otherwise 'mouseout' can not be triggered normally.
    // See #6198.

    if (lastHoveredTarget && !lastHoveredTarget.__qr) {
      lastHovered = this.findHover(lastHovered.x, lastHovered.y);
      lastHoveredTarget = lastHovered.target;
    }

    var hovered = this._hovered = this.findHover(x, y);
    var hoveredTarget = hovered.target;
    var proxy = this.proxy;
    proxy.setCursor && proxy.setCursor(hoveredTarget ? hoveredTarget.cursor : 'default'); // Mouse out on previous hovered element

    if (lastHoveredTarget && hoveredTarget !== lastHoveredTarget) {
      this.dispatchToElement(lastHovered, 'mouseout', event);
    } // Mouse moving on one element


    this.dispatchToElement(hovered, 'mousemove', event); // Mouse over on a new element

    if (hoveredTarget && hoveredTarget !== lastHoveredTarget) {
      this.dispatchToElement(hovered, 'mouseover', event);
    }
  },

  /**
   * @method mouseout
   * @param {*} proxy 
   */
  mouseout: function mouseout(event) {
    this.dispatchToElement(this._hovered, 'mouseout', event); // There might be some doms created by upper layer application
    // at the same level of painter.getViewportRoot() (e.g., tooltip
    // dom created by echarts), where 'globalout' event should not
    // be triggered when mouse enters these doms. (But 'mouseout'
    // should be triggered at the original hovered element as usual).

    var element = event.toElement || event.relatedTarget;
    var innerDom;

    do {
      element = element && element.parentNode;
    } while (element && element.nodeType !== 9 && !(innerDom = element === this.painterRoot));

    !innerDom && this.trigger('globalout', {
      event: event
    });
  },
  pagemousemove: dataUtil.curry(pageEventHandler, 'pagemousemove'),
  pagemouseup: dataUtil.curry(pageEventHandler, 'pagemouseup'),
  pagekeydown: dataUtil.curry(pageEventHandler, 'pagekeydown'),
  pagekeyup: dataUtil.curry(pageEventHandler, 'pagekeyup'),

  /**
   * @method resize
   * @param {Event} event 
   */
  resize: function resize(event) {
    this._hovered = {};
  },

  /**
   * @method dispatch
   * Dispatch event
   * @param {String} eventName
   * @param {Event} eventArgs
   */
  dispatch: function dispatch(eventName, eventArgs) {
    var handler = this[eventName];
    handler && handler.call(this, eventArgs);
  },

  /**
   * @method dispose
   */
  dispose: function dispose() {
    this.proxy.dispose();
    this.storage = null;
    this.proxy = null;
    this.painter = null;
  },

  /**
   * @method setCursorStyle
   * 设置默认的cursor style
   * @param {String} [cursorStyle='default'] 例如 crosshair
   */
  setCursorStyle: function setCursorStyle(cursorStyle) {
    var proxy = this.proxy;
    proxy.setCursor && proxy.setCursor(cursorStyle);
  },

  /**
   * @private
   * @method dispatchToElement
   * 事件分发代理，把事件分发给 canvas 中绘制的元素。
   *
   * @param {Object} targetInfo {target, topTarget} 目标图形元素
   * @param {String} eventName 事件名称
   * @param {Object} event 事件对象
   */
  dispatchToElement: function dispatchToElement(targetInfo, eventName, event) {
    targetInfo = targetInfo || {};
    var el = targetInfo.target;

    if (el && el.silent) {
      return;
    }

    var eventHandler = 'on' + eventName;
    var eventPacket = makeEventPacket(eventName, targetInfo, event); //模拟DOM中的事件冒泡行为，事件一直向上层传播，直到没有父层节点为止。

    while (el) {
      el[eventHandler] && (eventPacket.cancelBubble = el[eventHandler].call(el, eventPacket));
      el.trigger(eventName, eventPacket);
      el = el.parent;

      if (eventPacket.cancelBubble) {
        break;
      }
    }

    if (!eventPacket.cancelBubble) {
      // 冒泡到顶级 qrenderer 对象
      this.trigger(eventName, eventPacket); // 分发事件到用户自定义层
      // 用户有可能在全局 click 事件中 dispose，所以需要判断下 painter 是否存在

      this.painter && this.painter.eachOtherLayer(function (layer) {
        if (typeof layer[eventHandler] === 'function') {
          layer[eventHandler].call(layer, eventPacket);
        }

        if (layer.trigger) {
          layer.trigger(eventName, eventPacket);
        }
      });
    }
  },

  /**
   * @method findHover
   * @param {Number} x
   * @param {Number} y
   * @param {Displayable} exclude
   * @return {Element}
   */
  findHover: function findHover(x, y, exclude) {
    var list = this.storage.getDisplayList();
    var out = {
      x: x,
      y: y
    }; //NOTE: 在元素数量非常庞大的时候，如 100 万个元素，这里的 for 循环会很慢，基本不能响应鼠标事件。

    for (var i = list.length - 1; i >= 0; i--) {
      var hoverCheckResult;

      if (list[i] !== exclude && !list[i].ignore && (hoverCheckResult = isHover(list[i], x, y))) {
        !out.topTarget && (out.topTarget = list[i]);

        if (hoverCheckResult !== SILENT) {
          out.target = list[i];
          break;
        }
      }
    }

    return out;
  },

  /**
   * @method processGesture
   * @param {Event} event 
   * @param {String} phase 
   */
  processGesture: function processGesture(event, phase) {
    if (!this._gestureMgr) {
      this._gestureMgr = new GestureMgr();
    }

    var gestureMgr = this._gestureMgr;
    phase === 'start' && gestureMgr.clear();
    var gestureInfo = gestureMgr.recognize(event, this.findHover(event.qrX, event.qrY, null).target, this.proxy.dom);
    phase === 'end' && gestureMgr.clear(); // Do not do any preventDefault here. Upper application do that if necessary.

    if (gestureInfo) {
      var type = gestureInfo.type;
      event.gestureEvent = type;
      this.dispatchToElement({
        target: gestureInfo.target
      }, type, gestureInfo.event);
    }
  }
}; // Common handlers

dataUtil.each(['click', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
  QRendererEventHandler.prototype[name] = function (event) {
    // Find hover again to avoid click event is dispatched manually. Or click is triggered without mouseover
    var hovered = this.findHover(event.qrX, event.qrY);
    var hoveredTarget = hovered.target;

    if (name === 'mousedown') {
      this._downEl = hoveredTarget;
      this._downPoint = [event.qrX, event.qrY]; // In case click triggered before mouseup

      this._upEl = hoveredTarget;
    } else if (name === 'mouseup') {
      this._upEl = hoveredTarget;
    } else if (name === 'click') {
      if (this._downEl !== this._upEl // Original click event is triggered on the whole canvas element,
      // including the case that `mousedown` - `mousemove` - `mouseup`,
      // which should be filtered, otherwise it will bring trouble to
      // pan and zoom.
      || !this._downPoint // Arbitrary value
      || vec2.dist(this._downPoint, [event.qrX, event.qrY]) > 4) {
        return;
      }

      this._downPoint = null;
    } //把事件派发给目标元素


    this.dispatchToElement(hovered, name, event);
  };
});
classUtil.mixin(QRendererEventHandler, Eventful);
var _default = QRendererEventHandler;
module.exports = _default;
}, function(modId) { var map = {"../core/utils/data_structure_util":1582161598602,"../core/utils/class_util":1582161598604,"../core/utils/vector":1582161598605,"../core/utils/event_util":1582161598606,"./MultiDragDrop":1582161598609,"./Eventful":1582161598607,"./GestureMgr":1582161598610}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598602, function(require, module, exports) {
var _constants = require("../../graphic/constants");

var mathFloor = _constants.mathFloor;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * 用来操作数据的一些工具函数。
 */
// 用于处理merge时无法遍历Date等对象的问题
var BUILTIN_OBJECT = {
  '[object Function]': 1,
  '[object RegExp]': 1,
  '[object Date]': 1,
  '[object Error]': 1,
  '[object CanvasGradient]': 1,
  '[object CanvasPattern]': 1,
  // For node-canvas
  '[object Image]': 1,
  '[object Canvas]': 1
};
var TYPED_ARRAY = {
  '[object Int8Array]': 1,
  '[object Uint8Array]': 1,
  '[object Uint8ClampedArray]': 1,
  '[object Int16Array]': 1,
  '[object Uint16Array]': 1,
  '[object Int32Array]': 1,
  '[object Uint32Array]': 1,
  '[object Float32Array]': 1,
  '[object Float64Array]': 1
};
var objToString = Object.prototype.toString;
var arrayProto = Array.prototype;
var nativeForEach = arrayProto.forEach;
var nativeFilter = arrayProto.filter;
var nativeSlice = arrayProto.slice;
var nativeMap = arrayProto.map;
var nativeReduce = arrayProto.reduce; // Avoid assign to an exported variable, for transforming to cjs.

var methods = {};

function $override(name, fn) {
  // Clear ctx instance for different environment
  if (name === 'createCanvas') {
    _ctx = null;
  }

  methods[name] = fn;
}
/**
 * Those data types can be cloned:
 *     Plain object, Array, TypedArray, number, string, null, undefined.
 * Those data types will be assgined using the orginal data:
 *     BUILTIN_OBJECT
 * Instance of user defined class will be cloned to a plain object, without
 * properties in prototype.
 * Other data types is not supported (not sure what will happen).
 *
 * Caution: do not support clone Date, for performance consideration.
 * (There might be a large number of date in `series.data`).
 * So date should not be modified in and out of echarts.
 *
 * @param {*} source
 * @return {*} new
 */


function clone(source) {
  if (source == null || _typeof(source) !== 'object') {
    return source;
  }

  var result = source;
  var typeStr = objToString.call(source);

  if (typeStr === '[object Array]') {
    if (!isPrimitive(source)) {
      result = [];

      for (var i = 0, len = source.length; i < len; i++) {
        result[i] = clone(source[i]);
      }
    }
  } else if (TYPED_ARRAY[typeStr]) {
    if (!isPrimitive(source)) {
      var Ctor = source.constructor;

      if (source.constructor.from) {
        result = Ctor.from(source);
      } else {
        result = new Ctor(source.length);

        for (var i = 0, len = source.length; i < len; i++) {
          result[i] = clone(source[i]);
        }
      }
    }
  } else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
    result = {};

    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        result[key] = clone(source[key]);
      }
    }
  }

  return result;
}
/**
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overwrite=false]
 */


function merge(target, source, overwrite) {
  // We should escapse that source is string
  // and enter for ... in ...
  if (!isObject(source) || !isObject(target)) {
    return overwrite ? clone(source) : target;
  }

  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      var targetProp = target[key];
      var sourceProp = source[key];

      if (isObject(sourceProp) && isObject(targetProp) && !isArray(sourceProp) && !isArray(targetProp) && !isDom(sourceProp) && !isDom(targetProp) && !isBuiltInObject(sourceProp) && !isBuiltInObject(targetProp) && !isPrimitive(sourceProp) && !isPrimitive(targetProp)) {
        // 如果需要递归覆盖，就递归调用merge
        merge(targetProp, sourceProp, overwrite);
      } else if (overwrite || !(key in target)) {
        // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
        // NOTE，在 target[key] 不存在的时候也是直接覆盖
        target[key] = clone(source[key], true);
      }
    }
  }

  return target;
}
/**
 * @param {Array} targetAndSources The first item is target, and the rests are source.
 * @param {boolean} [overwrite=false]
 * @return {*} target
 */


function mergeAll(targetAndSources, overwrite) {
  var result = targetAndSources[0];

  for (var i = 1, len = targetAndSources.length; i < len; i++) {
    result = merge(result, targetAndSources[i], overwrite);
  }

  return result;
}
/**
 * @param {*} target
 * @param {*} source
 */


function extend(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }

  return target;
}
/**
 * 查询数组中元素的index
 */


function indexOf(array, value) {
  if (array) {
    if (array.indexOf) {
      return array.indexOf(value);
    }

    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === value) {
        return i;
      }
    }
  }

  return -1;
}
/**
 * Consider typed array.
 * @param {Array|TypedArray} data
 */


function isArrayLike(data) {
  if (!data) {
    return;
  }

  if (typeof data === 'string') {
    return false;
  }

  return typeof data.length === 'number';
}
/**
 * 数组或对象遍历
 * @param {Object|Array} obj
 * @param {Function} cb
 * @param {*} [context]
 */


function each(obj, cb, context) {
  if (!(obj && cb)) {
    return;
  }

  if (obj.forEach && obj.forEach === nativeForEach) {
    obj.forEach(cb, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, len = obj.length; i < len; i++) {
      cb.call(context, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        cb.call(context, obj[key], key, obj);
      }
    }
  }
}
/**
 * 数组映射
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */


function map(obj, cb, context) {
  if (!(obj && cb)) {
    return;
  }

  if (obj.map && obj.map === nativeMap) {
    return obj.map(cb, context);
  } else {
    var result = [];

    for (var i = 0, len = obj.length; i < len; i++) {
      result.push(cb.call(context, obj[i], i, obj));
    }

    return result;
  }
}
/**
 * @param {Array} obj
 * @param {Function} cb
 * @param {Object} [memo]
 * @param {*} [context]
 * @return {Array}
 */


function reduce(obj, cb, memo, context) {
  if (!(obj && cb)) {
    return;
  }

  if (obj.reduce && obj.reduce === nativeReduce) {
    return obj.reduce(cb, memo, context);
  } else {
    for (var i = 0, len = obj.length; i < len; i++) {
      memo = cb.call(context, memo, obj[i], i, obj);
    }

    return memo;
  }
}
/**
 * 数组过滤
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {Array}
 */


function filter(obj, cb, context) {
  if (!(obj && cb)) {
    return;
  }

  if (obj.filter && obj.filter === nativeFilter) {
    return obj.filter(cb, context);
  } else {
    var result = [];

    for (var i = 0, len = obj.length; i < len; i++) {
      if (cb.call(context, obj[i], i, obj)) {
        result.push(obj[i]);
      }
    }

    return result;
  }
}
/**
 * 数组项查找
 * @param {Array} obj
 * @param {Function} cb
 * @param {*} [context]
 * @return {*}
 */


function find(obj, cb, context) {
  if (!(obj && cb)) {
    return;
  }

  for (var i = 0, len = obj.length; i < len; i++) {
    if (cb.call(context, obj[i], i, obj)) {
      return obj[i];
    }
  }
}
/**
 * @param {Function} func
 * @param {*} context
 * @return {Function}
 */


function bind(func, context) {
  var args = nativeSlice.call(arguments, 2);
  return function () {
    return func.apply(context, args.concat(nativeSlice.call(arguments)));
  };
}
/**
 * @param {Function} func
 * @return {Function}
 */


function curry(func) {
  var args = nativeSlice.call(arguments, 1);
  return function () {
    return func.apply(this, args.concat(nativeSlice.call(arguments)));
  };
}
/**
 * @param {*} value
 * @return {boolean}
 */


function isArray(value) {
  return objToString.call(value) === '[object Array]';
}
/**
 * @param {*} value
 * @return {boolean}
 */


function isFunction(value) {
  return typeof value === 'function';
}
/**
 * @param {*} value
 * @return {boolean}
 */


function isString(value) {
  return objToString.call(value) === '[object String]';
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
/**
 * @param {*} value
 * @return {boolean}
 */


function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = _typeof(value);

  return type === 'function' || !!value && type === 'object';
}
/**
 * @param {*} value
 * @return {boolean}
 */


function isBuiltInObject(value) {
  return !!BUILTIN_OBJECT[objToString.call(value)];
}
/**
 * @param {*} value
 * @return {boolean}
 */


function isTypedArray(value) {
  return !!TYPED_ARRAY[objToString.call(value)];
}
/**
 * @param {*} value
 * @return {boolean}
 */


function isDom(value) {
  return _typeof(value) === 'object' && typeof value.nodeType === 'number' && _typeof(value.ownerDocument) === 'object';
}
/**
 * Whether is exactly NaN. Notice isNaN('a') returns true.
 * @param {*} value
 * @return {boolean}
 */


function eqNaN(value) {
  /* eslint-disable-next-line no-self-compare */
  return value !== value;
}
/**
 * If value1 is not null, then return value1, otherwise judget rest of values.
 * Low performance.
 * @return {*} Final value
 */


function retrieve(values) {
  for (var i = 0, len = arguments.length; i < len; i++) {
    if (arguments[i] != null) {
      return arguments[i];
    }
  }
}

function retrieve2(value0, value1) {
  return value0 != null ? value0 : value1;
}

function retrieve3(value0, value1, value2) {
  return value0 != null ? value0 : value1 != null ? value1 : value2;
}
/**
 * @param {Array} arr
 * @param {Number} startIndex
 * @param {Number} endIndex
 * @return {Array}
 */


function slice() {
  return Function.call.apply(nativeSlice, arguments);
}
/**
 * Normalize css liked array configuration
 * e.g.
 *  3 => [3, 3, 3, 3]
 *  [4, 2] => [4, 2, 4, 2]
 *  [4, 3, 2] => [4, 3, 2, 3]
 * @param {number|Array.<Number>} val
 * @return {Array<Number>}
 */


function normalizeCssArray(val) {
  if (typeof val === 'number') {
    return [val, val, val, val];
  }

  var len = val.length;

  if (len === 2) {
    // vertical | horizontal
    return [val[0], val[1], val[0], val[1]];
  } else if (len === 3) {
    // top | horizontal | bottom
    return [val[0], val[1], val[2], val[1]];
  }

  return val;
}
/**
 * @param {boolean} condition
 * @param {String} message
 */


function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
/**
 * @param {String} str string to be trimed
 * @return {String} trimed string
 */


function trim(str) {
  if (str == null) {
    return null;
  } else if (typeof str.trim === 'function') {
    return str.trim();
  } else {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  }
}

var primitiveKey = '__ec_primitive__';
/**
 * Set an object as primitive to be ignored traversing children in clone or merge
 */

function setAsPrimitive(obj) {
  obj[primitiveKey] = true;
}

function isPrimitive(obj) {
  return obj[primitiveKey];
}
/**
 * @constructor
 * @param {Object} obj Only apply `ownProperty`.
 */


function HashMap(obj) {
  var isArr = isArray(obj); // Key should not be set on this, otherwise
  // methods get/set/... may be overrided.

  this.data = {};
  var thisMap = this;
  obj instanceof HashMap ? obj.each(visit) : obj && each(obj, visit);

  function visit(value, key) {
    isArr ? thisMap.set(value, key) : thisMap.set(key, value);
  }
}

HashMap.prototype = {
  constructor: HashMap,
  // Do not provide `has` method to avoid defining what is `has`.
  // (We usually treat `null` and `undefined` as the same, different
  // from ES6 Map).
  get: function get(key) {
    return this.data.hasOwnProperty(key) ? this.data[key] : null;
  },
  set: function set(key, value) {
    // Comparing with invocation chaining, `return value` is more commonly
    // used in this case: `var someVal = map.set('a', genVal());`
    return this.data[key] = value;
  },
  // Although util.each can be performed on this hashMap directly, user
  // should not use the exposed keys, who are prefixed.
  each: function each(cb, context) {
    context !== void 0 && (cb = bind(cb, context));
    /* eslint-disable guard-for-in */

    for (var key in this.data) {
      this.data.hasOwnProperty(key) && cb(this.data[key], key);
    }
    /* eslint-enable guard-for-in */

  },
  // Do not use this method if performance sensitive.
  removeKey: function removeKey(key) {
    delete this.data[key];
  }
};

function createHashMap(obj) {
  return new HashMap(obj);
}

function concatArray(a, b) {
  var newArray = new a.constructor(a.length + b.length);

  for (var i = 0; i < a.length; i++) {
    newArray[i] = a[i];
  }

  var offset = a.length;

  for (i = 0; i < b.length; i++) {
    newArray[i + offset] = b[i];
  }

  return newArray;
}

function noop() {}
/**
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} percent
 * @return {Number}
 */


function interpolateNumber(p0, p1, percent) {
  return (p1 - p0) * percent + p0;
}
/**
 * @param  {String} p0
 * @param  {String} p1
 * @param  {Number} percent
 * @return {String}
 */


function interpolateString(p0, p1, percent) {
  return percent > 0.5 ? p1 : p0;
}
/**
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {Number} percent
 * @param  {Array} out
 * @param  {Number} arrDim
 */


function interpolateArray(p0, p1, percent, out, arrDim) {
  var len = p0.length;
  if (!len) return;

  if (arrDim === 1) {
    for (var i = 0; i < len; i++) {
      out[i] = interpolateNumber(p0[i], p1[i], percent);
    }
  } else {
    var len2 = p0[0].length;
    if (!len2) return;

    for (var i = 0; i < len; i++) {
      if (out[i] === undefined) {
        return;
      }

      for (var j = 0; j < len2; j++) {
        out[i][j] = interpolateNumber(p0[i][j], p1[i][j], percent);
      }
    }
  }
} // arr0 is source array, arr1 is target array.
// Do some preprocess to avoid error happened when interpolating from arr0 to arr1


function fillArr(arr0, arr1, arrDim) {
  var arr0Len = arr0.length;
  var arr1Len = arr1.length;

  if (arr0Len !== arr1Len) {
    // FIXME Not work for TypedArray
    var isPreviousLarger = arr0Len > arr1Len;

    if (isPreviousLarger) {
      // Cut the previous
      arr0.length = arr1Len;
    } else {
      // Fill the previous
      for (var i = arr0Len; i < arr1Len; i++) {
        arr0.push(arrDim === 1 ? arr1[i] : Array.prototype.slice.call(arr1[i]));
      }
    }
  } // Handling NaN value


  var len2 = arr0[0] && arr0[0].length;

  for (var i = 0; i < arr0.length; i++) {
    if (arrDim === 1) {
      if (isNaN(arr0[i])) {
        arr0[i] = arr1[i];
      }
    } else {
      for (var j = 0; j < len2; j++) {
        if (isNaN(arr0[i][j])) {
          arr0[i][j] = arr1[i][j];
        }
      }
    }
  }
}
/**
 * @param  {Array} arr0
 * @param  {Array} arr1
 * @param  {Number} arrDim
 * @return {boolean}
 */


function isArraySame(arr0, arr1, arrDim) {
  if (arr0 === arr1) {
    return true;
  }

  var len = arr0.length;

  if (len !== arr1.length) {
    return false;
  }

  if (arrDim === 1) {
    for (var i = 0; i < len; i++) {
      if (arr0[i] !== arr1[i]) {
        return false;
      }
    }
  } else {
    var len2 = arr0[0].length;

    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len2; j++) {
        if (arr0[i][j] !== arr1[i][j]) {
          return false;
        }
      }
    }
  }

  return true;
}
/**
 * Catmull Rom interpolate array
 * @param  {Array} p0
 * @param  {Array} p1
 * @param  {Array} p2
 * @param  {Array} p3
 * @param  {Number} t
 * @param  {Number} t2
 * @param  {Number} t3
 * @param  {Array} out
 * @param  {Number} arrDim
 */


function catmullRomInterpolateArray(p0, p1, p2, p3, t, t2, t3, out, arrDim) {
  var len = p0.length;

  if (arrDim === 1) {
    for (var i = 0; i < len; i++) {
      out[i] = catmullRomInterpolate(p0[i], p1[i], p2[i], p3[i], t, t2, t3);
    }
  } else {
    var len2 = p0[0].length;

    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len2; j++) {
        out[i][j] = catmullRomInterpolate(p0[i][j], p1[i][j], p2[i][j], p3[i][j], t, t2, t3);
      }
    }
  }
}
/**
 * Catmull Rom interpolate number
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Number} t
 * @param  {Number} t2
 * @param  {Number} t3
 * @return {Number}
 */


function catmullRomInterpolate(p0, p1, p2, p3, t, t2, t3) {
  var v0 = (p2 - p0) * 0.5;
  var v1 = (p3 - p1) * 0.5;
  return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
}

function cloneValue(value) {
  if (isArrayLike(value)) {
    var len = value.length;

    if (isArrayLike(value[0])) {
      var ret = [];

      for (var i = 0; i < len; i++) {
        ret.push(Array.prototype.slice.call(value[i]));
      }

      return ret;
    }

    return Array.prototype.slice.call(value);
  }

  return value;
}

function rgba2String(rgba) {
  rgba[0] = mathFloor(rgba[0]);
  rgba[1] = mathFloor(rgba[1]);
  rgba[2] = mathFloor(rgba[2]);
  return 'rgba(' + rgba.join(',') + ')';
}

function getArrayDim(keyframes) {
  var lastValue = keyframes[keyframes.length - 1].value;
  return isArrayLike(lastValue && lastValue[0]) ? 2 : 1;
}

function parseInt10(val) {
  return parseInt(val, 10);
}

exports.$override = $override;
exports.clone = clone;
exports.merge = merge;
exports.mergeAll = mergeAll;
exports.extend = extend;
exports.indexOf = indexOf;
exports.isArrayLike = isArrayLike;
exports.each = each;
exports.map = map;
exports.reduce = reduce;
exports.filter = filter;
exports.find = find;
exports.bind = bind;
exports.curry = curry;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isNumeric = isNumeric;
exports.isObject = isObject;
exports.isBuiltInObject = isBuiltInObject;
exports.isTypedArray = isTypedArray;
exports.isDom = isDom;
exports.eqNaN = eqNaN;
exports.retrieve = retrieve;
exports.retrieve2 = retrieve2;
exports.retrieve3 = retrieve3;
exports.slice = slice;
exports.normalizeCssArray = normalizeCssArray;
exports.assert = assert;
exports.trim = trim;
exports.setAsPrimitive = setAsPrimitive;
exports.isPrimitive = isPrimitive;
exports.createHashMap = createHashMap;
exports.concatArray = concatArray;
exports.noop = noop;
exports.interpolateNumber = interpolateNumber;
exports.interpolateString = interpolateString;
exports.interpolateArray = interpolateArray;
exports.fillArr = fillArr;
exports.isArraySame = isArraySame;
exports.catmullRomInterpolateArray = catmullRomInterpolateArray;
exports.catmullRomInterpolate = catmullRomInterpolate;
exports.cloneValue = cloneValue;
exports.rgba2String = rgba2String;
exports.getArrayDim = getArrayDim;
exports.parseInt10 = parseInt10;
}, function(modId) { var map = {"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598603, function(require, module, exports) {
var ContextCachedBy = {
  NONE: 0,
  STYLE_BIND: 1,
  PLAIN_TEXT: 2
};
var WILL_BE_RESTORED = 9;
var E = Math.E;
var LN2 = Math.LN2;
var LN10 = Math.LN10;
var LOG2E = Math.LOG2E;
var LOG10E = Math.LOG10E;
var PI = Math.PI;
var PI2 = Math.PI * 2;
var SQRT1_2 = Math.SQRT1_2;
var SQRT2 = Math.SQRT2;
var mathAbs = Math.abs;
var mathAcos = Math.acos;
var mathAcosh = Math.acosh;
var mathAsin = Math.asin;
var mathAsinh = Math.asinh;
var mathAtan = Math.atan;
var mathAtanh = Math.atanh;
var mathAtan2 = Math.atan2;
var mathCbrt = Math.cbrt;
var mathCeil = Math.ceil;
var mathClz32 = Math.clz32;
var mathCos = Math.cos;
var mathCosh = Math.cosh;
var mathExp = Math.exp;
var mathExpm1 = Math.expm1;
var mathFloor = Math.floor;
var matFround = Math.fround;
var mathHypot = Math.hypot;
var mathImul = Math.imul;
var mathLog = Math.log;
var mathLog1p = Math.log1p;
var mathLog10 = Math.log10;
var mathLog2 = Math.log2;
var mathMax = Math.max;
var mathMin = Math.min;
var mathPow = Math.pow;
var mathRandom = Math.random;
var mathRound = Math.round;
var mathSign = Math.sign;
var mathSin = Math.sin;
var mathSinh = Math.sinh;
var mathSqrt = Math.sqrt;
var mathTan = Math.tan;
var mathTanh = Math.tanh;
var mathTrunc = Math.trunc;
exports.ContextCachedBy = ContextCachedBy;
exports.WILL_BE_RESTORED = WILL_BE_RESTORED;
exports.E = E;
exports.LN2 = LN2;
exports.LN10 = LN10;
exports.LOG2E = LOG2E;
exports.LOG10E = LOG10E;
exports.PI = PI;
exports.PI2 = PI2;
exports.SQRT1_2 = SQRT1_2;
exports.SQRT2 = SQRT2;
exports.mathAbs = mathAbs;
exports.mathAcos = mathAcos;
exports.mathAcosh = mathAcosh;
exports.mathAsin = mathAsin;
exports.mathAsinh = mathAsinh;
exports.mathAtan = mathAtan;
exports.mathAtanh = mathAtanh;
exports.mathAtan2 = mathAtan2;
exports.mathCbrt = mathCbrt;
exports.mathCeil = mathCeil;
exports.mathClz32 = mathClz32;
exports.mathCos = mathCos;
exports.mathCosh = mathCosh;
exports.mathExp = mathExp;
exports.mathExpm1 = mathExpm1;
exports.mathFloor = mathFloor;
exports.matFround = matFround;
exports.mathHypot = mathHypot;
exports.mathImul = mathImul;
exports.mathLog = mathLog;
exports.mathLog1p = mathLog1p;
exports.mathLog10 = mathLog10;
exports.mathLog2 = mathLog2;
exports.mathMax = mathMax;
exports.mathMin = mathMin;
exports.mathPow = mathPow;
exports.mathRandom = mathRandom;
exports.mathRound = mathRound;
exports.mathSign = mathSign;
exports.mathSin = mathSin;
exports.mathSinh = mathSinh;
exports.mathSqrt = mathSqrt;
exports.mathTan = mathTan;
exports.mathTanh = mathTanh;
exports.mathTrunc = mathTrunc;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598604, function(require, module, exports) {
/**
 * 构造类继承关系
 *
 * @param {Function} clazz 源类
 * @param {Function} baseClazz 基类
 */
function inherits(clazz, baseClazz) {
  var clazzPrototype = clazz.prototype;

  function F() {}

  F.prototype = baseClazz.prototype;
  clazz.prototype = new F();

  for (var prop in clazzPrototype) {
    if (clazzPrototype.hasOwnProperty(prop)) {
      clazz.prototype[prop] = clazzPrototype[prop];
    }
  }

  clazz.prototype.constructor = clazz;
  clazz.superClass = baseClazz;
}
/**
 * 这里的 mixin 只拷贝 prototype 上的属性。
 * @param {Object|Function} target
 * @param {Object|Function} sorce
 * @param {boolean} overlay
 */


function mixin(target, source, overlay) {
  target = 'prototype' in target ? target.prototype : target;
  source = 'prototype' in source ? source.prototype : source;
  defaults(target, source, overlay);
}
/**
 * @method inheritProperties
 * 
 * Copy properties from super class, this method is designed for the classes which were not written in ES6 syntax.
 * 
 * 拷贝父类上的属性，此方法用来支持那么没有按照 ES6 语法编写的类。
 * 
 * @param {*} subInstance 子类的实例
 * @param {*} SuperClass 父类的类型
 * @param {*} opts 构造参数
 */


function inheritProperties(subInstance, SuperClass, opts) {
  var sp = new SuperClass(opts);

  for (var name in sp) {
    if (sp.hasOwnProperty(name)) {
      subInstance[name] = sp[name];
    }
  }
}
/**
 * @param {*} target
 * @param {*} source
 * @param {boolean} [overlay=false]
 */


function defaults(target, source, overlay) {
  for (var key in source) {
    if (source.hasOwnProperty(key) && (overlay ? source[key] != null : target[key] == null)) {
      target[key] = source[key];
    }
  }

  return target;
}
/**
 * @method copyOwnProperties
 * 
 * Copy own properties from source object to target object, exclude inherited ones.
 * 
 * 从目标对象上拷贝属性，拷贝过程中排除那些通过继承而来的属性。
 * 
 * @param {Object} target 
 * @param {Object} source 
 * @param {Array} excludes 
 */


function copyOwnProperties(target, source) {
  var excludes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (excludes && excludes.length) {
        if (excludes.indexOf(key) != -1) {
          continue;
        }
      }

      target[key] = source[key];
    }
  }

  return target;
}

exports.inherits = inherits;
exports.mixin = mixin;
exports.inheritProperties = inheritProperties;
exports.defaults = defaults;
exports.copyOwnProperties = copyOwnProperties;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598605, function(require, module, exports) {
var _constants = require("../../graphic/constants");

var mathSqrt = _constants.mathSqrt;
var mathMin = _constants.mathMin;
var mathMax = _constants.mathMax;

/* global Float32Array */
var ArrayCtor = typeof Float32Array === 'undefined' ? Array : Float32Array;
/**
 * 创建一个向量
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @return {Vector2}
 */

function create(x, y) {
  var out = new ArrayCtor(2);

  if (x == null) {
    x = 0;
  }

  if (y == null) {
    y = 0;
  }

  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * 复制向量数据
 * @param {Vector2} out
 * @param {Vector2} v
 * @return {Vector2}
 */


function copy(out, v) {
  out[0] = v[0];
  out[1] = v[1];
  return out;
}
/**
 * 克隆一个向量
 * @param {Vector2} v
 * @return {Vector2}
 */


function clone(v) {
  var out = new ArrayCtor(2);
  out[0] = v[0];
  out[1] = v[1];
  return out;
}
/**
 * 设置向量的两个项
 * @param {Vector2} out
 * @param {Number} a
 * @param {Number} b
 * @return {Vector2} 结果
 */


function set(out, a, b) {
  out[0] = a;
  out[1] = b;
  return out;
}
/**
 * 向量相加
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */


function add(out, v1, v2) {
  out[0] = v1[0] + v2[0];
  out[1] = v1[1] + v2[1];
  return out;
}
/**
 * 向量缩放后相加
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {Number} a
 */


function scaleAndAdd(out, v1, v2, a) {
  out[0] = v1[0] + v2[0] * a;
  out[1] = v1[1] + v2[1] * a;
  return out;
}
/**
 * 向量相减
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */


function sub(out, v1, v2) {
  out[0] = v1[0] - v2[0];
  out[1] = v1[1] - v2[1];
  return out;
}
/**
 * 向量长度
 * @param {Vector2} v
 * @return {Number}
 */


function len(v) {
  return mathSqrt(lenSquare(v));
}

var length = len; // jshint ignore:line

/**
 * 向量长度平方
 * @param {Vector2} v
 * @return {Number}
 */

function lenSquare(v) {
  return v[0] * v[0] + v[1] * v[1];
}

var lengthSquare = lenSquare;
/**
 * 向量乘法
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */

function mul(out, v1, v2) {
  out[0] = v1[0] * v2[0];
  out[1] = v1[1] * v2[1];
  return out;
}
/**
 * 向量除法
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 */


function div(out, v1, v2) {
  out[0] = v1[0] / v2[0];
  out[1] = v1[1] / v2[1];
  return out;
}
/**
 * 向量点乘
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {Number}
 */


function dot(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1];
}
/**
 * 向量缩放
 * @param {Vector2} out
 * @param {Vector2} v
 * @param {Number} s
 */


function scale(out, v, s) {
  out[0] = v[0] * s;
  out[1] = v[1] * s;
  return out;
}
/**
 * 向量归一化
 * @param {Vector2} out
 * @param {Vector2} v
 */


function normalize(out, v) {
  var d = len(v);

  if (d === 0) {
    out[0] = 0;
    out[1] = 0;
  } else {
    out[0] = v[0] / d;
    out[1] = v[1] / d;
  }

  return out;
}
/**
 * 计算向量间距离
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {Number}
 */


function distance(v1, v2) {
  return mathSqrt((v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]));
}

var dist = distance;
/**
 * 向量距离平方
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @return {Number}
 */

function distanceSquare(v1, v2) {
  return (v1[0] - v2[0]) * (v1[0] - v2[0]) + (v1[1] - v2[1]) * (v1[1] - v2[1]);
}

var distSquare = distanceSquare;
/**
 * 求负向量
 * @param {Vector2} out
 * @param {Vector2} v
 */

function negate(out, v) {
  out[0] = -v[0];
  out[1] = -v[1];
  return out;
}
/**
 * 插值两个点
 * @param {Vector2} out
 * @param {Vector2} v1
 * @param {Vector2} v2
 * @param {Number} t
 */


function lerp(out, v1, v2, t) {
  out[0] = v1[0] + t * (v2[0] - v1[0]);
  out[1] = v1[1] + t * (v2[1] - v1[1]);
  return out;
}
/**
 * 矩阵左乘向量
 * @param {Vector2} out
 * @param {Vector2} v
 * @param {Vector2} m
 */


function applyTransform(out, v, m) {
  var x = v[0];
  var y = v[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * 求两个向量最小值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */


function min(out, v1, v2) {
  out[0] = mathMin(v1[0], v2[0]);
  out[1] = mathMin(v1[1], v2[1]);
  return out;
}
/**
 * 求两个向量最大值
 * @param  {Vector2} out
 * @param  {Vector2} v1
 * @param  {Vector2} v2
 */


function max(out, v1, v2) {
  out[0] = mathMax(v1[0], v2[0]);
  out[1] = mathMax(v1[1], v2[1]);
  return out;
}

exports.create = create;
exports.copy = copy;
exports.clone = clone;
exports.set = set;
exports.add = add;
exports.scaleAndAdd = scaleAndAdd;
exports.sub = sub;
exports.len = len;
exports.length = length;
exports.lenSquare = lenSquare;
exports.lengthSquare = lengthSquare;
exports.mul = mul;
exports.div = div;
exports.dot = dot;
exports.scale = scale;
exports.normalize = normalize;
exports.distance = distance;
exports.dist = dist;
exports.distanceSquare = distanceSquare;
exports.distSquare = distSquare;
exports.negate = negate;
exports.lerp = lerp;
exports.applyTransform = applyTransform;
exports.min = min;
exports.max = max;
}, function(modId) { var map = {"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598606, function(require, module, exports) {
var Eventful = require("../../event/Eventful");

exports.Dispatcher = Eventful;

var env = require("../env");

var _four_points_transform = require("./four_points_transform");

var buildTransformer = _four_points_transform.buildTransformer;

/**
 * Utilities for mouse or touch events.
 */
var isDomLevel2 = typeof window !== 'undefined' && !!window.addEventListener;
var MOUSE_EVENT_REG = /^(?:mouse|pointer|contextmenu|drag|drop)|click/;
var EVENT_SAVED_PROP = '___qrEVENTSAVED';
var _calcOut = [];
/**
 * Get the `qrX` and `qrY`, which are relative to the top-left of
 * the input `el`.
 * CSS transform (2D & 3D) is supported.
 *
 * The strategy to fetch the coords:
 * + If `calculate` is not set as `true`, users of this method should
 * ensure that `el` is the same or the same size & location as `e.target`.
 * Otherwise the result coords are probably not expected. Because we
 * firstly try to get coords from e.offsetX/e.offsetY.
 * + If `calculate` is set as `true`, the input `el` can be any element
 * and we force to calculate the coords based on `el`.
 * + The input `el` should be positionable (not position:static).
 *
 * The force `calculate` can be used in case like:
 * When mousemove event triggered on ec tooltip, `e.target` is not `el`(qr painter.dom).
 *
 * @param {HTMLElement} el DOM element.
 * @param {Event} e Mouse event or touch event.
 * @param {Object} out Get `out.qrX` and `out.qrY` as the result.
 * @param {boolean} [calculate=false] Whether to force calculate
 *        the coordinates but not use ones provided by browser.
 */

function clientToLocal(el, e, out, calculate) {
  out = out || {}; // According to the W3C Working Draft, offsetX and offsetY should be relative
  // to the padding edge of the target element. The only browser using this convention
  // is IE. Webkit uses the border edge, Opera uses the content edge, and FireFox does
  // not support the properties.
  // (see http://www.jacklmoore.com/notes/mouse-position/)
  // In qr painter.dom, padding edge equals to border edge.

  if (calculate || !env.canvasSupported) {
    calculateQrXY(el, e, out);
  } // Caution: In FireFox, layerX/layerY Mouse position relative to the closest positioned
  // ancestor element, so we should make sure el is positioned (e.g., not position:static).
  // BTW1, Webkit don't return the same results as FF in non-simple cases (like add
  // zoom-factor, overflow / opacity layers, transforms ...)
  // BTW2, (ev.offsetY || ev.pageY - $(ev.target).offset().top) is not correct in preserve-3d.
  // <https://bugs.jquery.com/ticket/8523#comment:14>
  // BTW3, In ff, offsetX/offsetY is always 0.
  else if (env.browser.firefox && e.layerX != null && e.layerX !== e.offsetX) {
      out.qrX = e.layerX;
      out.qrY = e.layerY;
    } // For IE6+, chrome, safari, opera. (When will ff support offsetX?)
    else if (e.offsetX != null) {
        out.qrX = e.offsetX;
        out.qrY = e.offsetY;
      } // For some other device, e.g., IOS safari.
      else {
          calculateQrXY(el, e, out);
        }

  return out;
}

function calculateQrXY(el, e, out) {
  // BlackBerry 5, iOS 3 (original iPhone) don't have getBoundingRect.
  if (el.getBoundingClientRect && env.domSupported) {
    var ex = e.clientX;
    var ey = e.clientY;

    if (el.nodeName.toUpperCase() === 'CANVAS') {
      // Original approach, which do not support CSS transform.
      // marker can not be locationed in a canvas container
      // (getBoundingClientRect is always 0). We do not support
      // that input a pre-created canvas to qr while using css
      // transform in iOS.
      var box = el.getBoundingClientRect();
      out.qrX = ex - box.left;
      out.qrY = ey - box.top;
      return;
    } else {
      var saved = el[EVENT_SAVED_PROP] || (el[EVENT_SAVED_PROP] = {});
      var transformer = preparePointerTransformer(prepareCoordMarkers(el, saved), saved);

      if (transformer) {
        transformer(_calcOut, ex, ey);
        out.qrX = _calcOut[0];
        out.qrY = _calcOut[1];
        return;
      }
    }
  }

  out.qrX = out.qrY = 0;
}

function prepareCoordMarkers(el, saved) {
  var markers = saved.markers;

  if (markers) {
    return markers;
  }

  markers = saved.markers = [];
  var propLR = ['left', 'right'];
  var propTB = ['top', 'bottom'];

  for (var i = 0; i < 4; i++) {
    var marker = document.createElement('div');
    var stl = marker.style;
    var idxLR = i % 2;
    var idxTB = (i >> 1) % 2;
    stl.cssText = ['position:absolute', 'visibility: hidden', 'padding: 0', 'margin: 0', 'border-width: 0', 'width:0', 'height:0', // 'width: 5px',
    // 'height: 5px',
    propLR[idxLR] + ':0', propTB[idxTB] + ':0', propLR[1 - idxLR] + ':auto', propTB[1 - idxTB] + ':auto', ''].join('!important;');
    el.appendChild(marker);
    markers.push(marker);
  }

  return markers;
}

function preparePointerTransformer(markers, saved) {
  var transformer = saved.transformer;
  var oldSrcCoords = saved.srcCoords;
  var useOld = true;
  var srcCoords = [];
  var destCoords = [];

  for (var i = 0; i < 4; i++) {
    var rect = markers[i].getBoundingClientRect();
    var ii = 2 * i;
    var x = rect.left;
    var y = rect.top;
    srcCoords.push(x, y);
    useOld &= oldSrcCoords && x === oldSrcCoords[ii] && y === oldSrcCoords[ii + 1];
    destCoords.push(markers[i].offsetLeft, markers[i].offsetTop);
  } // Cache to avoid time consuming of `buildTransformer`.


  return useOld ? transformer : (saved.srcCoords = srcCoords, saved.transformer = buildTransformer(srcCoords, destCoords));
}
/**
 * Find native event compat for legency IE.
 * Should be called at the begining of a native event listener.
 *
 * @param {Event} [e] Mouse event or touch event or pointer event.
 *        For lagency IE, we use `window.event` is used.
 * @return {Event} The native event.
 */


function getNativeEvent(e) {
  return e || window.event;
}
/**
 * Normalize the coordinates of the input event.
 *
 * Get the `e.qrX` and `e.qrY`, which are relative to the top-left of
 * the input `el`.
 * Get `e.qrDelta` if using mouse wheel.
 * Get `e.which`, see the comment inside this function.
 *
 * Do not calculate repeatly if `qrX` and `qrY` already exist.
 *
 * Notice: see comments in `clientToLocal`. check the relationship
 * between the result coords and the parameters `el` and `calculate`.
 *
 * @param {HTMLElement} el DOM element.
 * @param {Event} [e] See `getNativeEvent`.
 * @param {boolean} [calculate=false] Whether to force calculate
 *        the coordinates but not use ones provided by browser.
 * @return {UIEvent} The normalized native UIEvent.
 */


function normalizeEvent(el, e, calculate) {
  e = getNativeEvent(e);

  if (e.qrX != null) {
    return e;
  }

  var eventType = e.type;
  var isTouch = eventType && eventType.indexOf('touch') >= 0;

  if (!isTouch) {
    clientToLocal(el, e, e, calculate);
    e.qrDelta = e.wheelDelta ? e.wheelDelta / 120 : -(e.detail || 0) / 3;
  } else {
    var touch = eventType !== 'touchend' ? e.targetTouches[0] : e.changedTouches[0];
    touch && clientToLocal(el, touch, e, calculate);
  } // Add which for click: 1 === left; 2 === middle; 3 === right; otherwise: 0;
  // See jQuery: https://github.com/jquery/jquery/blob/master/src/event.js
  // If e.which has been defined, it may be readonly,
  // see: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/which


  var button = e.button;

  if (e.which == null && button !== undefined && MOUSE_EVENT_REG.test(e.type)) {
    e.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
  } // [Caution]: `e.which` from browser is not always reliable. For example,
  // when press left button and `mousemove (pointermove)` in Edge, the `e.which`
  // is 65536 and the `e.button` is -1. But the `mouseup (pointerup)` and
  // `mousedown (pointerdown)` is the same as Chrome does.


  return e;
}
/**
 * @param {HTMLElement} el
 * @param {String} name
 * @param {Function} handler
 */


function addEventListener(el, name, handler) {
  if (isDomLevel2) {
    // Reproduct the console warning:
    // [Violation] Added non-passive event listener to a scroll-blocking <some> event.
    // Consider marking event handler as 'passive' to make the page more responsive.
    // Just set console log level: verbose in chrome dev tool.
    // then the warning log will be printed when addEventListener called.
    // See https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
    // We have not yet found a neat way to using passive. Because in qrenderer the dom event
    // listener delegate all of the upper events of element. Some of those events need
    // to prevent default. For example, the feature `preventDefaultMouseMove` of echarts.
    // Before passive can be adopted, these issues should be considered:
    // (1) Whether and how a qrenderer user specifies an event listener passive. And by default,
    // passive or not.
    // (2) How to tread that some qrenderer event listener is passive, and some is not. If
    // we use other way but not preventDefault of mousewheel and touchmove, browser
    // compatibility should be handled.
    // var opts = (env.passiveSupported && name === 'mousewheel')
    //     ? {passive: true}
    //     // By default, the third param of el.addEventListener is `capture: false`.
    //     : void 0;
    // el.addEventListener(name, handler /* , opts */);
    el.addEventListener(name, handler);
  } else {
    el.attachEvent('on' + name, handler);
  }
}

function removeEventListener(el, name, handler) {
  if (isDomLevel2) {
    el.removeEventListener(name, handler);
  } else {
    el.detachEvent('on' + name, handler);
  }
}
/**
 * preventDefault and stopPropagation.
 * Notice: do not use this method in qrenderer. It can only be
 * used by upper applications if necessary.
 *
 * @param {Event} e A mouse or touch event.
 */


var stop = isDomLevel2 ? function (e) {
  e.preventDefault();
  e.stopPropagation();
  e.cancelBubble = true;
} : function (e) {
  e.returnValue = false;
  e.cancelBubble = true;
};
/**
 * This method only works for mouseup and mousedown. The functionality is restricted
 * for fault tolerance, See the `e.which` compatibility above.
 *
 * @param {MouseEvent} e
 * @return {boolean}
 */

function isMiddleOrRightButtonOnMouseUpDown(e) {
  return e.which === 2 || e.which === 3;
}
/**
 * To be removed.
 * @deprecated
 */


function notLeftMouse(e) {
  // If e.which is undefined, considered as left mouse event.
  return e.which > 1;
} // For backward compatibility


exports.clientToLocal = clientToLocal;
exports.getNativeEvent = getNativeEvent;
exports.normalizeEvent = normalizeEvent;
exports.addEventListener = addEventListener;
exports.removeEventListener = removeEventListener;
exports.stop = stop;
exports.isMiddleOrRightButtonOnMouseUpDown = isMiddleOrRightButtonOnMouseUpDown;
exports.notLeftMouse = notLeftMouse;
}, function(modId) { var map = {"../../event/Eventful":1582161598607,"../env":1582161598600,"./four_points_transform":1582161598608}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598607, function(require, module, exports) {
/**
 * @abstract
 * @class qrenderer.event.Eventful
 * 
 * Provide event system for the classes that do not support events, the implementation here
 * is similar to DOM events, the classes which need event support should mixin the functions
 * here.
 * 
 * 为不支持事件机制的类提供事件支持，基本机制类似 DOM 事件，需要事件机制的类可以 mixin 此类中的工具函数。
 * 
 * @author @Kener-林峰 <kener.linfeng@gmail.com>
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var arrySlice = Array.prototype.slice;
/**
 * @method constructor Eventful
 * @param {Object} [eventProcessor] The object eventProcessor is the scope when
 *        `eventProcessor.xxx` called. 事件处理者，也就是当前事件处理函数执行时的作用域。
 * @param {Function} [eventProcessor.normalizeQuery]
 *        param: {String|Object} Raw query.
 *        return: {String|Object} Normalized query.
 * @param {Function} [eventProcessor.filter] Event will be dispatched only
 *        if it returns `true`.
 *        param: {String} eventType
 *        param: {String|Object} query
 *        return: {Boolean}
 * @param {Function} [eventProcessor.afterTrigger] Called after all handlers called.
 *        param: {String} eventType
 * @param {Function} [eventProcessor.afterListenerChanged] Called when any listener added or removed.
 *        param: {String} eventType
 */

var Eventful = function Eventful(eventProcessor) {
  this._$handlers = {};
  this._$eventProcessor = eventProcessor;
};

Eventful.prototype = {
  constructor: Eventful,

  /**
   * @method
   * The handler can only be triggered once, then removed.
   *
   * @param {String} event The event name.
   * @param {String|Object} [query] Condition used on event filter.
   * @param {Function} handler The event handler.
   * @param {Object} context
   */
  one: function one(event, query, handler, context) {
    return _on(this, event, query, handler, context, true);
  },

  /**
   * @method
   * Bind a handler.
   *
   * @param {String} event The event name.
   * @param {String|Object} [query] Condition used on event filter.
   * @param {Function} handler The event handler.
   * @param {Object} [context]
   */
  on: function on(event, query, handler, context) {
    return _on(this, event, query, handler, context, false);
  },

  /**
   * @method
   * Whether any handler has bound.
   *
   * @param  {String}  event
   * @return {Boolean}
   */
  isSilent: function isSilent(event) {
    var _h = this._$handlers;
    return !_h[event] || !_h[event].length;
  },

  /**
   * @method
   * Unbind a event.
   *
   * @param {String} [event] The event name.
   *        If no `event` input, "off" all listeners.
   * @param {Function} [handler] The event handler.
   *        If no `handler` input, "off" all listeners of the `event`.
   */
  off: function off(event, handler) {
    var _h = this._$handlers;

    if (!event) {
      this._$handlers = {};
      return this;
    }

    if (handler) {
      if (_h[event]) {
        var newList = [];

        for (var i = 0, l = _h[event].length; i < l; i++) {
          if (_h[event][i].h !== handler) {
            newList.push(_h[event][i]);
          }
        }

        _h[event] = newList;
      }

      if (_h[event] && _h[event].length === 0) {
        delete _h[event];
      }
    } else {
      delete _h[event];
    }

    callListenerChanged(this, event);
    return this;
  },

  /**
   * @method
   * Dispatch a event.
   *
   * @param {String} type The event name.
   */
  trigger: function trigger(type) {
    var _h = this._$handlers[type];
    var eventProcessor = this._$eventProcessor;

    if (_h) {
      var args = arguments;
      var argLen = args.length;

      if (argLen > 3) {
        args = arrySlice.call(args, 1);
      }

      var len = _h.length;

      for (var i = 0; i < len;) {
        var hItem = _h[i];

        if (eventProcessor && eventProcessor.filter && hItem.query != null && !eventProcessor.filter(type, hItem.query)) {
          i++;
          continue;
        } // Optimize advise from backbone


        switch (argLen) {
          case 1:
            hItem.h.call(hItem.ctx);
            break;

          case 2:
            hItem.h.call(hItem.ctx, args[1]);
            break;

          case 3:
            hItem.h.call(hItem.ctx, args[1], args[2]);
            break;

          default:
            // have more than 2 given arguments
            hItem.h.apply(hItem.ctx, args);
            break;
        }

        if (hItem.one) {
          _h.splice(i, 1);

          len--;
        } else {
          i++;
        }
      }
    }

    eventProcessor && eventProcessor.afterTrigger && eventProcessor.afterTrigger(type);
    return this;
  },

  /**
   * @method
   * Dispatch a event with context, which is specified at the last parameter.
   *
   * @param {String} type The event name.
   */
  triggerWithContext: function triggerWithContext(type) {
    var _h = this._$handlers[type];
    var eventProcessor = this._$eventProcessor;

    if (_h) {
      var args = arguments;
      var argLen = args.length;

      if (argLen > 4) {
        args = arrySlice.call(args, 1, args.length - 1);
      }

      var ctx = args[args.length - 1];
      var len = _h.length;

      for (var i = 0; i < len;) {
        var hItem = _h[i];

        if (eventProcessor && eventProcessor.filter && hItem.query != null && !eventProcessor.filter(type, hItem.query)) {
          i++;
          continue;
        } // Optimize advise from backbone


        switch (argLen) {
          case 1:
            hItem.h.call(ctx);
            break;

          case 2:
            hItem.h.call(ctx, args[1]);
            break;

          case 3:
            hItem.h.call(ctx, args[1], args[2]);
            break;

          default:
            // have more than 2 given arguments
            hItem.h.apply(ctx, args);
            break;
        }

        if (hItem.one) {
          _h.splice(i, 1);

          len--;
        } else {
          i++;
        }
      }
    }

    eventProcessor && eventProcessor.afterTrigger && eventProcessor.afterTrigger(type);
    return this;
  }
};
/**
 * @private
 * @method
 * @param {Element} eventful 
 * @param {String} eventType 
 */

function callListenerChanged(eventful, eventType) {
  var eventProcessor = eventful._$eventProcessor;

  if (eventProcessor && eventProcessor.afterListenerChanged) {
    eventProcessor.afterListenerChanged(eventType);
  }
}
/**
 * @private
 * @method
 * @param {*} host 
 * @param {*} query 
 */


function normalizeQuery(host, query) {
  var eventProcessor = host._$eventProcessor;

  if (query != null && eventProcessor && eventProcessor.normalizeQuery) {
    query = eventProcessor.normalizeQuery(query);
  }

  return query;
}
/**
 * @private
 * @method
 * @param {Element} eventful 
 * @param {Event} event 
 * @param {*} query 
 * @param {Function} handler 
 * @param {Object} context 
 * @param {Boolean} isOnce 
 */


function _on(eventful, event, query, handler, context, isOnce) {
  var _h = eventful._$handlers;

  if (typeof query === 'function') {
    context = handler;
    handler = query;
    query = null;
  }

  if (!handler || !event) {
    return eventful;
  }

  query = normalizeQuery(eventful, query);

  if (!_h[event]) {
    _h[event] = [];
  }

  for (var i = 0; i < _h[event].length; i++) {
    if (_h[event][i].h === handler) {
      return eventful;
    }
  }

  var wrap = {
    h: handler,
    one: isOnce,
    query: query,
    ctx: context || eventful,
    // FIXME
    // Do not publish this feature util it is proved that it makes sense.
    callAtLast: handler.qrEventfulCallAtLast
  };
  var lastIndex = _h[event].length - 1;
  var lastWrap = _h[event][lastIndex];
  lastWrap && lastWrap.callAtLast ? _h[event].splice(lastIndex, 0, wrap) : _h[event].push(wrap);
  callListenerChanged(eventful, event);
  return eventful;
}

var _default = Eventful;
module.exports = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598608, function(require, module, exports) {
var _constants = require("../../graphic/constants");

var mathLog = _constants.mathLog;
var mathRound = _constants.mathRound;

/**
 * The algoritm is learnt from
 * https://franklinta.com/2014/09/08/computing-css-matrix3d-transforms/
 * And we made some optimization for matrix inversion.
 * Other similar approaches:
 * "cv::getPerspectiveTransform", "Direct Linear Transformation".
 */
var LN2 = mathLog(2);

function determinant(rows, rank, rowStart, rowMask, colMask, detCache) {
  var cacheKey = rowMask + '-' + colMask;
  var fullRank = rows.length;

  if (detCache.hasOwnProperty(cacheKey)) {
    return detCache[cacheKey];
  }

  if (rank === 1) {
    // In this case the colMask must be like: `11101111`. We can find the place of `0`.
    var colStart = mathRound(mathLog((1 << fullRank) - 1 & ~colMask) / LN2);
    return rows[rowStart][colStart];
  }

  var subRowMask = rowMask | 1 << rowStart;
  var subRowStart = rowStart + 1;

  while (rowMask & 1 << subRowStart) {
    subRowStart++;
  }

  var sum = 0;

  for (var j = 0, colLocalIdx = 0; j < fullRank; j++) {
    var colTag = 1 << j;

    if (!(colTag & colMask)) {
      sum += (colLocalIdx % 2 ? -1 : 1) * rows[rowStart][j] // det(subMatrix(0, j))
      * determinant(rows, rank - 1, subRowStart, subRowMask, colMask | colTag, detCache);
      colLocalIdx++;
    }
  }

  detCache[cacheKey] = sum;
  return sum;
}
/**
 * Usage:
 * ```js
 * var transformer = buildTransformer(
 *     [10, 44, 100, 44, 100, 300, 10, 300],
 *     [50, 54, 130, 14, 140, 330, 14, 220]
 * );
 * var out = [];
 * transformer && transformer([11, 33], out);
 * ```
 *
 * Notice: `buildTransformer` may take more than 10ms in some Android device.
 *
 * @param {Array<Number>} src source four points, [x0, y0, x1, y1, x2, y2, x3, y3]
 * @param {Array<Number>} dest destination four points, [x0, y0, x1, y1, x2, y2, x3, y3]
 * @return {Function} transformer If fail, return null/undefined.
 */


function buildTransformer(src, dest) {
  var mA = [[src[0], src[1], 1, 0, 0, 0, -dest[0] * src[0], -dest[0] * src[1]], [0, 0, 0, src[0], src[1], 1, -dest[1] * src[0], -dest[1] * src[1]], [src[2], src[3], 1, 0, 0, 0, -dest[2] * src[2], -dest[2] * src[3]], [0, 0, 0, src[2], src[3], 1, -dest[3] * src[2], -dest[3] * src[3]], [src[4], src[5], 1, 0, 0, 0, -dest[4] * src[4], -dest[4] * src[5]], [0, 0, 0, src[4], src[5], 1, -dest[5] * src[4], -dest[5] * src[5]], [src[6], src[7], 1, 0, 0, 0, -dest[6] * src[6], -dest[6] * src[7]], [0, 0, 0, src[6], src[7], 1, -dest[7] * src[6], -dest[7] * src[7]]];
  var detCache = {};
  var det = determinant(mA, 8, 0, 0, 0, detCache);

  if (det === 0) {
    return;
  } // `invert(mA) * dest`, that is, `adj(mA) / det * dest`.


  var vh = [];

  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      vh[j] == null && (vh[j] = 0);
      vh[j] += ((i + j) % 2 ? -1 : 1) * // det(subMatrix(i, j))
      determinant(mA, 7, i === 0 ? 1 : 0, 1 << i, 1 << j, detCache) / det * dest[i];
    }
  }

  return function (out, srcPointX, srcPointY) {
    var pk = srcPointX * vh[6] + srcPointY * vh[7] + 1;
    out[0] = (srcPointX * vh[0] + srcPointY * vh[1] + vh[2]) / pk;
    out[1] = (srcPointX * vh[3] + srcPointY * vh[4] + vh[5]) / pk;
  };
}

exports.buildTransformer = buildTransformer;
}, function(modId) { var map = {"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598609, function(require, module, exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.event.MultiDragDrop
 * 支持同时拖拽多个元素，按住 Ctrl 键可以多选。
 * 
 * @author 大漠穷秋 <damoqiongqiu@126.com>
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var MultiDragDrop =
/*#__PURE__*/
function () {
  /**
   * @method constructor MultiDragDrop
   * @param {QRendererEventHandler} handler 
   */
  function MultiDragDrop(handler) {
    _classCallCheck(this, MultiDragDrop);

    this.selectionMap = new Map();
    this.handler = handler;
    this.handler.on('mousedown', this._dragStart, this);
  }
  /**
   * @private
   * @method param
   * @param {Element} target 
   * @param {Event} e 
   */


  _createClass(MultiDragDrop, [{
    key: "param",
    value: function param(target, e) {
      return {
        target: target,
        topTarget: e && e.topTarget
      };
    }
    /**
     * @method getSelectedItems
     * 获取当前选中的元素
     * @return {Map} selectionMap
     */

  }, {
    key: "getSelectedItems",
    value: function getSelectedItems() {
      return this.selectionMap;
    }
    /**
     * @method clearSelectionMap
     * 清除选中
     */

  }, {
    key: "clearSelectionMap",
    value: function clearSelectionMap() {
      this.selectionMap.forEach(function (el, key) {
        el.dragging = false;
      });
      this.selectionMap.clear();
    }
    /**
     * @private
     * @method _dragStart
     * 开始拖动
     * @param {Event} e 
     */

  }, {
    key: "_dragStart",
    value: function _dragStart(e) {
      var _this = this;

      var el = e.target;
      var event = e.event;
      this._draggingItem = el;

      if (!el) {
        this.clearSelectionMap();
        return;
      }

      if (!el.draggable) {
        return;
      }

      if (!event.ctrlKey && !this.selectionMap.get(el.id)) {
        this.clearSelectionMap();
      }

      el.dragging = true;
      this.selectionMap.set(el.id, el);
      this._x = e.offsetX;
      this._y = e.offsetY;
      this.handler.on('pagemousemove', this._drag, this);
      this.handler.on('pagemouseup', this._dragEnd, this);
      this.selectionMap.forEach(function (el, key) {
        console.log(el);

        _this.handler.dispatchToElement(_this.param(el, e), 'dragstart', e.event);
      });
    }
    /**
     * @private
     * @method _drag
     * 拖动过程中
     * @param {Event} e 
     */

  }, {
    key: "_drag",
    value: function _drag(e) {
      var _this2 = this;

      var x = e.offsetX;
      var y = e.offsetY;
      var dx = x - this._x;
      var dy = y - this._y;
      this._x = x;
      this._y = y;
      this.selectionMap.forEach(function (el, key) {
        el.drift(dx, dy, e);

        _this2.handler.dispatchToElement(_this2.param(el, e), 'drag', e.event);
      });
      var dropTarget = this.handler.findHover(x, y, this._draggingItem).target;
      var lastDropTarget = this._dropTarget;
      this._dropTarget = dropTarget;

      if (this._draggingItem !== dropTarget) {
        if (lastDropTarget && dropTarget !== lastDropTarget) {
          this.handler.dispatchToElement(this.param(lastDropTarget, e), 'dragleave', e.event);
        }

        if (dropTarget && dropTarget !== lastDropTarget) {
          this.handler.dispatchToElement(this.param(dropTarget, e), 'dragenter', e.event);
        }
      }
    }
    /**
     * @private
     * @method _dragEnd
     * 拖动结束
     * @param {Event} e 
     */

  }, {
    key: "_dragEnd",
    value: function _dragEnd(e) {
      var _this3 = this;

      this.selectionMap.forEach(function (el, key) {
        el.dragging = false;

        _this3.handler.dispatchToElement(_this3.param(el, e), 'dragend', e.event);
      });
      this.handler.off('pagemousemove', this._drag);
      this.handler.off('pagemouseup', this._dragEnd);

      if (this._dropTarget) {
        this.handler.dispatchToElement(this.param(this._dropTarget, e), 'drop', e.event);
      }

      this._dropTarget = null;
    }
  }]);

  return MultiDragDrop;
}();

module.exports = MultiDragDrop;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598610, function(require, module, exports) {
var eventUtil = require("../core/utils/event_util");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.event.GestureMgr
 * 
 * Implement necessary gestures for mobile platform.
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
function dist(pointPair) {
  var dx = pointPair[1][0] - pointPair[0][0];
  var dy = pointPair[1][1] - pointPair[0][1];
  return Math.sqrt(dx * dx + dy * dy);
}

function center(pointPair) {
  return [(pointPair[0][0] + pointPair[1][0]) / 2, (pointPair[0][1] + pointPair[1][1]) / 2];
}

var recognizers = {
  pinch: function pinch(track, event) {
    var trackLen = track.length;

    if (!trackLen) {
      return;
    }

    var pinchEnd = (track[trackLen - 1] || {}).points;
    var pinchPre = (track[trackLen - 2] || {}).points || pinchEnd;

    if (pinchPre && pinchPre.length > 1 && pinchEnd && pinchEnd.length > 1) {
      var pinchScale = dist(pinchEnd) / dist(pinchPre);
      !isFinite(pinchScale) && (pinchScale = 1);
      event.pinchScale = pinchScale;
      var pinchCenter = center(pinchEnd);
      event.pinchX = pinchCenter[0];
      event.pinchY = pinchCenter[1];
      return {
        type: 'pinch',
        target: track[0].target,
        event: event
      };
    }
  } // Only pinch currently.

};

var GestureMgr =
/*#__PURE__*/
function () {
  function GestureMgr() {
    _classCallCheck(this, GestureMgr);

    /**
     * @private
     * @property {Array<Object>}
     */
    this._track = [];
  }

  _createClass(GestureMgr, [{
    key: "recognize",
    value: function recognize(event, target, root) {
      this._doTrack(event, target, root);

      return this._recognize(event);
    }
  }, {
    key: "clear",
    value: function clear() {
      this._track.length = 0;
      return this;
    }
  }, {
    key: "_doTrack",
    value: function _doTrack(event, target, root) {
      var touches = event.touches;

      if (!touches) {
        return;
      }

      var trackItem = {
        points: [],
        touches: [],
        target: target,
        event: event
      };

      for (var i = 0, len = touches.length; i < len; i++) {
        var touch = touches[i];
        var pos = eventUtil.clientToLocal(root, touch, {});
        trackItem.points.push([pos.qrX, pos.qrY]);
        trackItem.touches.push(touch);
      }

      this._track.push(trackItem);
    }
  }, {
    key: "_recognize",
    value: function _recognize(event) {
      for (var eventName in recognizers) {
        if (recognizers.hasOwnProperty(eventName)) {
          var gestureInfo = recognizers[eventName](this._track, event);

          if (gestureInfo) {
            return gestureInfo;
          }
        }
      }
    }
  }]);

  return GestureMgr;
}();

var _default = GestureMgr;
module.exports = _default;
}, function(modId) { var map = {"../core/utils/event_util":1582161598606}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598611, function(require, module, exports) {
var util = require("./core/utils/data_structure_util");

var env = require("./core/env");

var Group = require("./graphic/Group");

var timsort = require("./core/utils/timsort");

// Use timsort because in most case elements are partially sorted
// https://jsfiddle.net/pissang/jr4x7mdm/8/

/**
 * @class qrenderer.core.Storage
 * 内容仓库 (M)，用来存储和管理画布上的所有对象，同时提供绘制和更新队列的功能。
 * 需要绘制的对象首先存储在 Storage 中，然后 Painter 类会从 Storage 中依次取出进行绘图。
 * 利用 Storage 作为内存中转站，对于不需要刷新的对象可以不进行绘制，从而可以提升整体性能。
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

/**
 * @method constructor Storage
 */
var Storage = function Storage() {
  // jshint ignore:line

  /**
   * @private
   * @property _roots
   */
  this._roots = []; //直接放在画布上的对象为根对象

  /**
   * @private
   * @property _displayList
   */

  this._displayList = [];
  /**
   * @private
   * @property _displayListLen
   */

  this._displayListLen = 0;
};

Storage.prototype = {
  constructor: Storage,

  /**
   * @method traverse
   * @param  {Function} cb
   * @param  {Object} context
   */
  traverse: function traverse(cb, context) {
    for (var i = 0; i < this._roots.length; i++) {
      this._roots[i].traverse(cb, context);
    }
  },

  /**
   * @method getDisplayList
   * 返回所有图形的绘制队列
   * @param {boolean} [update=false] 是否在返回前更新该数组
   * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组, 在 update 为 true 的时候有效
   *
   * 详见{@link Displayable.prototype.updateDisplayList}
   * @return {Array<Displayable>}
   */
  getDisplayList: function getDisplayList(update, includeIgnore) {
    includeIgnore = includeIgnore || false;

    if (update) {
      this.updateDisplayList(includeIgnore);
    }

    return this._displayList;
  },

  /**
   * @method updateDisplayList
   * 更新图形的绘制队列。
   * 每次绘制前都会调用，该方法会先深度优先遍历整个树，更新所有Group和Shape的变换并且把所有可见的Shape保存到数组中，
   * 最后根据绘制的优先级（zlevel > z > 插入顺序）排序得到绘制队列
   * @param {boolean} [includeIgnore=false] 是否包含 ignore 的数组
   */
  updateDisplayList: function updateDisplayList(includeIgnore) {
    this._displayListLen = 0;
    var roots = this._roots;
    var displayList = this._displayList;

    for (var i = 0, len = roots.length; i < len; i++) {
      this._updateAndAddDisplayable(roots[i], null, includeIgnore);
    }

    displayList.length = this._displayListLen;
    env.canvasSupported && timsort(displayList, this.displayableSortFunc);
  },

  /**
   * @method _updateAndAddDisplayable
   * @param {*} el 
   * @param {*} clipPaths 
   * @param {*} includeIgnore 
   */
  _updateAndAddDisplayable: function _updateAndAddDisplayable(el, clipPaths, includeIgnore) {
    if (el.ignore && !includeIgnore) {
      return;
    }

    el.beforeUpdate();

    if (el.__dirty) {
      el.update();
    }

    el.afterUpdate();
    var userSetClipPath = el.clipPath;

    if (userSetClipPath) {
      // FIXME 效率影响
      if (clipPaths) {
        clipPaths = clipPaths.slice();
      } else {
        clipPaths = [];
      }

      var currentClipPath = userSetClipPath;
      var parentClipPath = el; // Recursively add clip path

      while (currentClipPath) {
        // clipPath 的变换是基于使用这个 clipPath 的元素
        currentClipPath.parent = parentClipPath;
        currentClipPath.updateTransform();
        clipPaths.push(currentClipPath);
        parentClipPath = currentClipPath;
        currentClipPath = currentClipPath.clipPath;
      }
    }

    if (el.isGroup) {
      var children = el._children;

      for (var i = 0; i < children.length; i++) {
        var child = children[i]; // Force to mark as dirty if group is dirty
        // FIXME __dirtyPath ?

        if (el.__dirty) {
          child.__dirty = true;
        }

        this._updateAndAddDisplayable(child, clipPaths, includeIgnore);
      } // Mark group clean here


      el.__dirty = false;
    } else {
      el.__clipPaths = clipPaths;
      this._displayList[this._displayListLen++] = el;
    }
  },

  /**
   * @method addRoot
   * 添加图形(Shape)或者组(Group)到根节点
   * @param {Element} el
   */
  addRoot: function addRoot(el) {
    if (el.__storage === this) {
      return;
    }

    if (el instanceof Group) {
      el.addChildrenToStorage(this);
    }

    this.addToStorage(el);

    this._roots.push(el);
  },

  /**
   * @method
   * 删除指定的图形(Shape)或者组(Group)
   * @param {string|Array.<String>} [el] 如果为空清空整个Storage
   */
  delRoot: function delRoot(el) {
    if (el == null) {
      // 不指定el清空
      for (var i = 0; i < this._roots.length; i++) {
        var root = this._roots[i];

        if (root instanceof Group) {
          root.delChildrenFromStorage(this);
        }
      }

      this._roots = [];
      this._displayList = [];
      this._displayListLen = 0;
      return;
    }

    if (el instanceof Array) {
      for (var _i = 0, l = el.length; _i < l; _i++) {
        this.delRoot(el[_i]);
      }

      return;
    }

    var idx = util.indexOf(this._roots, el);

    if (idx >= 0) {
      this.delFromStorage(el);

      this._roots.splice(idx, 1);

      if (el instanceof Group) {
        el.delChildrenFromStorage(this);
      }
    }
  },

  /**
   * @method addToStorage
   * @param {Element} el 
   */
  addToStorage: function addToStorage(el) {
    if (el) {
      el.__storage = this;
      el.dirty(false);
    }

    return this;
  },

  /**
   * @method delFromStorage
   * @param {Element} el 
   */
  delFromStorage: function delFromStorage(el) {
    if (el) {
      el.__storage = null;
    }

    return this;
  },

  /**
   * @method dispose
   * 清空并且释放Storage
   */
  dispose: function dispose() {
    this._renderList = this._roots = null;
  },
  displayableSortFunc: function displayableSortFunc(a, b) {
    if (a.qlevel === b.qlevel) {
      if (a.z === b.z) {
        // if (a.z2 === b.z2) {
        //     // FIXME Slow has renderidx compare
        //     // http://stackoverflow.com/questions/20883421/sorting-in-javascript-should-every-compare-function-have-a-return-0-statement
        //     // https://github.com/v8/v8/blob/47cce544a31ed5577ffe2963f67acb4144ee0232/src/js/array.js#L1012
        //     return a.__renderidx - b.__renderidx;
        // }
        return a.z2 - b.z2;
      }

      return a.z - b.z;
    }

    return a.qlevel - b.qlevel;
  }
};
var _default = Storage;
module.exports = _default;
}, function(modId) { var map = {"./core/utils/data_structure_util":1582161598602,"./core/env":1582161598600,"./graphic/Group":1582161598612,"./core/utils/timsort":1582161598624}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598612, function(require, module, exports) {
var classUtil = require("../core/utils/class_util");

var Element = require("./Element");

var BoundingRect = require("./transform/BoundingRect");

var _data_structure_util = require("../core/utils/data_structure_util");

var extend = _data_structure_util.extend;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.Group
 * 
 * - Group is a container, it's not visible.
 * - Group can have child nodes, not the other Element types.
 * - The transformations applied to Group will apply to its children too.
 * 
 * - Group 是一个容器，本身不可见。
 * - Group 可以插入子节点，其它类型不能。
 * - Group 上的变换也会被应用到子节点上。
 * 
 *      @example small frame
 *      let Group = require('qrenderer/Group');
 *      let Circle = require('qrenderer/graphic/shape/Circle');
 *      let g = new Group();
 *      g.position[0] = 100;
 *      g.position[1] = 100;
 *      g.add(new Circle({
 *          style: {
 *              x: 100,
 *              y: 100,
 *              r: 20,
 *          }
 *      }));
 *      qr.add(g);
 */
var Group =
/*#__PURE__*/
function (_Element) {
  _inherits(Group, _Element);

  /**
   * @method constructor Group
   */
  function Group() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Group);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Group).call(this, options));
    /**
     * @private
     * @property _children
     */

    _this._children = [];
    /**
     * @private
     * @property __storage
     */

    _this.__storage = null;
    /**
     * @private
     * @property __dirty
     */

    _this.__dirty = true;
    /**
     * @property isGroup
     */

    _this.isGroup = true;
    /**
     * @property {String}
     */

    _this.type = 'group';
    /**
     * @property {Boolean} 所有子孙元素是否响应鼠标事件
     */

    _this.silent = false;
    classUtil.copyOwnProperties(_assertThisInitialized(_this), options);
    return _this;
  }
  /**
   * @method children
   * @return {Array<Element>}
   */


  _createClass(Group, [{
    key: "children",
    value: function children() {
      return this._children.slice();
    }
    /**
     * @method childAt
     * 获取指定 index 的儿子节点
     * @param  {Number} idx
     * @return {Element}
     */

  }, {
    key: "childAt",
    value: function childAt(idx) {
      return this._children[idx];
    }
    /**
     * @method childOfName
     * 获取指定名字的儿子节点
     * @param  {String} name
     * @return {Element}
     */

  }, {
    key: "childOfName",
    value: function childOfName(name) {
      var children = this._children;

      for (var i = 0; i < children.length; i++) {
        if (children[i].name === name) {
          return children[i];
        }
      }
    }
    /**
     * @method childCount
     * @return {Number}
     */

  }, {
    key: "childCount",
    value: function childCount() {
      return this._children.length;
    }
    /**
     * @method add
     * 添加子节点到最后
     * @param {Element} child
     */

  }, {
    key: "add",
    value: function add(child) {
      if (child && child !== this && child.parent !== this) {
        this._children.push(child);

        this._doAdd(child);
      }

      return this;
    }
    /**
     * @method addBefore
     * 添加子节点在 nextSibling 之前
     * @param {Element} child
     * @param {Element} nextSibling
     */

  }, {
    key: "addBefore",
    value: function addBefore(child, nextSibling) {
      if (child && child !== this && child.parent !== this && nextSibling && nextSibling.parent === this) {
        var children = this._children;
        var idx = children.indexOf(nextSibling);

        if (idx >= 0) {
          children.splice(idx, 0, child);

          this._doAdd(child);
        }
      }

      return this;
    }
    /**
     * @private
     * @method _doAdd
     * @param {*} child 
     */

  }, {
    key: "_doAdd",
    value: function _doAdd(child) {
      if (child.parent) {
        child.parent.remove(child);
      }

      child.parent = this; //把子节点的 parent 属性指向自己，在事件冒泡的时候会使用 parent 属性。

      var storage = this.__storage;
      var qr = this.__qr;

      if (storage && storage !== child.__storage) {
        storage.addToStorage(child);

        if (child instanceof Group) {
          child.addChildrenToStorage(storage);
        }
      }

      qr && qr.refresh();
    }
    /**
     * @method remove
     * 移除子节点
     * @param {Element} child
     */

  }, {
    key: "remove",
    value: function remove(child) {
      var qr = this.__qr;
      var storage = this.__storage;
      var children = this._children;
      var idx = dataUtil.indexOf(children, child);

      if (idx < 0) {
        return this;
      }

      children.splice(idx, 1);
      child.parent = null;

      if (storage) {
        storage.delFromStorage(child);

        if (child instanceof Group) {
          child.delChildrenFromStorage(storage);
        }
      }

      qr && qr.refresh();
      return this;
    }
    /**
     * @method removeAll
     * 移除所有子节点
     */

  }, {
    key: "removeAll",
    value: function removeAll() {
      var children = this._children;
      var storage = this.__storage;
      var child;
      var i;

      for (i = 0; i < children.length; i++) {
        child = children[i];

        if (storage) {
          storage.delFromStorage(child);

          if (child instanceof Group) {
            child.delChildrenFromStorage(storage);
          }
        }

        child.parent = null;
      }

      children.length = 0;
      return this;
    }
    /**
     * @method eachChild
     * 遍历所有子节点
     * @param  {Function} cb
     * @param  {Object}   context
     */

  }, {
    key: "eachChild",
    value: function eachChild(cb, context) {
      var children = this._children;

      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        cb.call(context, child, i);
      }

      return this;
    }
    /**
     * @method traverse
     * 深度优先遍历所有子孙节点
     * @param  {Function} cb
     * @param  {Object}   context
     */

  }, {
    key: "traverse",
    value: function traverse(cb, context) {
      for (var i = 0; i < this._children.length; i++) {
        var child = this._children[i];
        cb.call(context, child);

        if (child.type === 'group') {
          child.traverse(cb, context);
        }
      }

      return this;
    }
    /**
     * @method addChildrenToStorage
     * @param {Storage} storage 
     */

  }, {
    key: "addChildrenToStorage",
    value: function addChildrenToStorage(storage) {
      for (var i = 0; i < this._children.length; i++) {
        var child = this._children[i];
        storage.addToStorage(child);

        if (child instanceof Group) {
          child.addChildrenToStorage(storage);
        }
      }
    }
    /**
     * @method delChildrenFromStorage
     * @param {Storage} storage 
     */

  }, {
    key: "delChildrenFromStorage",
    value: function delChildrenFromStorage(storage) {
      for (var i = 0; i < this._children.length; i++) {
        var child = this._children[i];
        storage.delFromStorage(child);

        if (child instanceof Group) {
          child.delChildrenFromStorage(storage);
        }
      }
    }
    /**
     * @method dirty
     * @return {Group}
     */

  }, {
    key: "dirty",
    value: function dirty() {
      this.__dirty = true;
      this.__qr && this.__qr.refresh();
      return this;
    }
    /**
     * @method getBoundingRect
     * @return {BoundingRect}
     */

  }, {
    key: "getBoundingRect",
    value: function getBoundingRect(includeChildren) {
      // TODO Caching
      var rect = null;
      var tmpRect = new BoundingRect(0, 0, 0, 0);
      var children = includeChildren || this._children;
      var tmpMat = [];

      for (var i = 0; i < children.length; i++) {
        var child = children[i];

        if (child.ignore || child.invisible) {
          continue;
        }

        var childRect = child.getBoundingRect();
        var transform = child.getLocalTransform(tmpMat); // TODO
        // The boundingRect cacluated by transforming original
        // rect may be bigger than the actual bundingRect when rotation
        // is used. (Consider a circle rotated aginst its center, where
        // the actual boundingRect should be the same as that not be
        // rotated.) But we can not find better approach to calculate
        // actual boundingRect yet, considering performance.

        if (transform) {
          tmpRect.copy(childRect);
          tmpRect.applyTransform(transform);
          rect = rect || tmpRect.clone();
          rect.union(tmpRect);
        } else {
          rect = rect || childRect.clone();
          rect.union(childRect);
        }
      }

      return rect || tmpRect;
    }
  }]);

  return Group;
}(Element);

var _default = Group;
module.exports = _default;
}, function(modId) { var map = {"../core/utils/class_util":1582161598604,"./Element":1582161598613,"./transform/BoundingRect":1582161598623,"../core/utils/data_structure_util":1582161598602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598613, function(require, module, exports) {
var guid = require("../core/utils/guid");

var Eventful = require("../event/Eventful");

var Transformable = require("./transform/Transformable");

var Animatable = require("../animation/Animatable");

var dataUtil = require("../core/utils/data_structure_util");

var classUtil = require("../core/utils/class_util");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.graphic.Element
 * 
 * Root class, everything in QuarkRenderer is an Element. 
 * This is an abstract class, please don't creat an instance directly.
 * 
 * 根类，QRenderer 中所有对象都是 Element 的子类。这是一个抽象类，请不要直接创建这个类的实例。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var Element =
/*#__PURE__*/
function () {
  /**
   * @method constructor Element
   */
  function Element(options) {
    _classCallCheck(this, Element);

    /**
     * @protected
     * @property options 配置项
     */
    this.options = options;
    /**
     * @property {String} id
     */

    this.id = this.options.id || guid();
    /**
     * @property {String} type 元素类型
     */

    this.type = 'element';
    /**
     * @property {String} name 元素名字
     */

    this.name = '';
    /**
     * @private
     * @property {QuarkRenderer} __qr
     * 
     * QuarkRenderer instance will be assigned when element is associated with qrenderer
     * 
     * QuarkRenderer 实例对象，会在 element 添加到 qrenderer 实例中后自动赋值
     */

    this.__qr = null;
    /**
     * @private
     * @property {Boolean} __dirty
     * 
     * Dirty flag. From which painter will determine if this displayable object needs to be repainted.
     * 
     * 这是一个非常重要的标志位，在绘制大量对象的时候，把 __dirty 标记为 false 可以节省大量操作。
     */

    this.__dirty = true;
    /**
     * @private
     * @property  _rect
     */

    this._rect = null;
    /**
     * @property {Boolean} ignore
     * 
     * Whether ignore drawing and events of this object.
     * 
     * 为 true 时忽略图形的绘制以及事件触发
     */

    this.ignore = false;
    /**
     * @property {Path} clipPath
     * 
     * This is used for clipping path, all the paths inside Group will be clipped by this path, 
     * which will inherit the transformation of the clipped object.
     * 
     * 用于裁剪的路径，所有 Group 内的路径在绘制时都会被这个路径裁剪，该路径会继承被裁减对象的变换。
     * 
     * @readOnly
     * @see http://www.w3.org/TR/2dcontext/#clipping-region
     */

    this.clipPath = null;
    /**
     * @property {Boolean} isGroup
     * 
     * Whether this object is a Group.
     * 
     * 是否是 Group
     */

    this.isGroup = false;
    classUtil.inheritProperties(this, Transformable, this.options);
    classUtil.inheritProperties(this, Eventful, this.options);
    classUtil.inheritProperties(this, Animatable, this.options);
    classUtil.copyOwnProperties(this, this.options);
  }
  /**
   * @method
   * 
   * Drift element
   * 
   * 移动元素
   * 
   * @param  {Number} dx dx on the global space
   * @param  {Number} dy dy on the global space
   */


  _createClass(Element, [{
    key: "drift",
    value: function drift(dx, dy) {
      switch (this.draggable) {
        case 'horizontal':
          dy = 0;
          break;

        case 'vertical':
          dx = 0;
          break;
      }

      var m = this.transform;

      if (!m) {
        m = this.transform = [1, 0, 0, 1, 0, 0];
      }

      m[4] += dx;
      m[5] += dy;
      this.decomposeTransform();
      this.dirty(false);
    }
    /**
     * @property {Function} beforeUpdate
     * 
     * Hook before update.
     * 
     * 刷新之前回调。
     */

  }, {
    key: "beforeUpdate",
    value: function beforeUpdate() {}
    /**
     * @property {Function} update
     * 
     * Update each frame.
     * 
     * 刷新，每一帧回调。
     */

  }, {
    key: "update",
    value: function update() {
      this.updateTransform();
    }
    /**
     * @property {Function} afterUpdate
     * 
     * Hook after update.
     * 
     * 刷新之后回调。
     */

  }, {
    key: "afterUpdate",
    value: function afterUpdate() {}
    /**
     * @property {Function} traverse
     * @param  {Function} cb
     * @param  {Object}   context
     */

  }, {
    key: "traverse",
    value: function traverse(cb, context) {}
    /**
     * @protected
     * @method attrKV
     * @param {String} key
     * @param {Object} value
     */

  }, {
    key: "attrKV",
    value: function attrKV(key, value) {
      if (key === 'position' || key === 'scale' || key === 'origin') {
        // Copy the array
        if (value) {
          var target = this[key];

          if (!target) {
            target = this[key] = [];
          }

          target[0] = value[0];
          target[1] = value[1];
        }
      } else {
        this[key] = value;
      }
    }
    /**
     * @method hide
     * 
     * Hide the element.
     * 
     * 隐藏元素。
     */

  }, {
    key: "hide",
    value: function hide() {
      this.ignore = true;
      this.__qr && this.__qr.refresh();
    }
    /**
     * @method show
     * 
     * Show the element.
     * 
     * 显示元素。
     */

  }, {
    key: "show",
    value: function show() {
      this.ignore = false;
      this.__qr && this.__qr.refresh();
    }
    /**
     * @method attr
     * 
     * Modify attribute.
     * 
     * 修改对象上的属性。
     * 
     * @param {String|Object} key
     * @param {*} value
     */

  }, {
    key: "attr",
    value: function attr(key, value) {
      if (typeof key === 'String') {
        this.attrKV(key, value);
      } else if (dataUtil.isObject(key)) {
        for (var name in key) {
          if (key.hasOwnProperty(name)) {
            this.attrKV(name, key[name]);
          }
        }
      }

      this.dirty(false);
      return this;
    }
    /**
     * @method setClipPath
     * 
     * Set the clip path.
     * 
     * 设置剪裁路径。
     * 
     * @param {Path} clipPath
     */

  }, {
    key: "setClipPath",
    value: function setClipPath(clipPath) {
      var qr = this.__qr;

      if (qr) {
        clipPath.addSelfToQr(qr);
      } // Remove previous clip path


      if (this.clipPath && this.clipPath !== clipPath) {
        this.removeClipPath();
      }

      this.clipPath = clipPath;
      clipPath.__qr = qr;
      clipPath.__clipTarget = this; //TODO: FIX this，需要重写一下，考虑把 Element 类和 Displayable 类合并起来。
      //dirty() 方法定义在子类 Displayable 中，这里似乎不应该直接调用，作为父类的 Element 不应该了解子类的实现，否则不易理解和维护。
      //另，Displayable 中的 dirty() 方法没有参数，而孙类 Path 中的 dirty() 方法有参数。

      this.dirty(false);
    }
    /**
     * @method removeClipPath
     * 
     * Remove the clip path.
     * 
     * 删除剪裁路径。
     * 
     */

  }, {
    key: "removeClipPath",
    value: function removeClipPath() {
      var clipPath = this.clipPath;

      if (clipPath) {
        if (clipPath.__qr) {
          clipPath.removeSelfFromQr(clipPath.__qr);
        }

        clipPath.__qr = null;
        clipPath.__clipTarget = null;
        this.clipPath = null;
        this.dirty(false);
      }
    }
    /**
     * @protected
     * @method dirty
     * 
     * Mark displayable element dirty and refresh next frame.
     * 
     * 把元素标记成脏的，在下一帧中刷新。
     */

  }, {
    key: "dirty",
    value: function dirty() {
      this.__dirty = this.__dirtyText = true;
      this._rect = null;
      this.__qr && this.__qr.refresh();
    }
    /**
     * @method addSelfToQr
     * Add self to qrenderer instance.
     * Not recursively because it will be invoked when element added to storage.
     * 
     * 把当前对象添加到 qrenderer 实例中去。
     * 不会递归添加，因为当元素被添加到 storage 中的时候会执行递归操作。
     * 
     * @param {QuarkRenderer} qr
     */

  }, {
    key: "addSelfToQr",
    value: function addSelfToQr(qr) {
      this.__qr = qr; // 添加动画

      var animationProcessList = this.animationProcessList;

      if (animationProcessList) {
        for (var i = 0; i < animationProcessList.length; i++) {
          qr.globalAnimationMgr.addAnimationProcess(animationProcessList[i]);
        }
      }

      if (this.clipPath) {
        this.clipPath.addSelfToQr(qr);
      }
    }
    /**
     * @method removeSelfFromQr
     * Remove self from qrenderer instance.
     * 
     * 把当前对象从 qrenderer 实例中删除。
     * 
     * @param {QuarkRenderer} qr
     */

  }, {
    key: "removeSelfFromQr",
    value: function removeSelfFromQr(qr) {
      this.__qr = null; // 移除动画

      var animationProcessList = this.animationProcessList;

      if (animationProcessList) {
        for (var i = 0; i < animationProcessList.length; i++) {
          qr.globalAnimationMgr.removeAnimationProcess(animationProcessList[i]);
        }
      }

      if (this.clipPath) {
        this.clipPath.removeSelfFromQr(qr);
      }
    }
  }]);

  return Element;
}();

classUtil.mixin(Element, Animatable);
classUtil.mixin(Element, Transformable);
classUtil.mixin(Element, Eventful);
var _default = Element;
module.exports = _default;
}, function(modId) { var map = {"../core/utils/guid":1582161598599,"../event/Eventful":1582161598607,"./transform/Transformable":1582161598614,"../animation/Animatable":1582161598616,"../core/utils/data_structure_util":1582161598602,"../core/utils/class_util":1582161598604}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598614, function(require, module, exports) {
var matrix = require("../../core/utils/matrix");

var vector = require("../../core/utils/vector");

var _constants = require("../constants");

var mathSqrt = _constants.mathSqrt;
var mathAtan2 = _constants.mathAtan2;

var classUtil = require("../../core/utils/class_util");

/**
 * @abstract
 * @class qrenderer.graphic.Transformable
 * 提供变换扩展
 * @author pissang (https://www.github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var mIdentity = matrix.identity;
var EPSILON = 5e-5;
var scaleTmp = [];
var tmpTransform = [];
var originTransform = matrix.create();

function isNotAroundZero(val) {
  return val > EPSILON || val < -EPSILON;
}
/**
 * @method constructor Transformable
 */


var Transformable = function Transformable() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  /**
   * @property {Array<Number>}
   * 旋转角度
   */
  this.rotation = 0;
  /**
   * @property {Array<Number>}
   * 平移
   */

  this.position = [0, 0];
  /**
   * @property {Array<Number>}
   * 缩放
   */

  this.scale = [1, 1];
  /**
   * @property {Array<Number>}
   * 扭曲
   */

  this.skew = [1, 1];
  /**
   * @property {Array<Number>}
   * 翻转
   */

  this.flip = [1, 1];
  /**
   * @property {Array<Number>}
   * 变换的原点，默认为最左上角的(0,0)点
   */

  this.origin = [0, 0];
  classUtil.copyOwnProperties(this, opts);
};

Transformable.prototype.transform = null;
/**
 * @method needLocalTransform
 * 判断是否需要有坐标变换
 * 如果有坐标变换, 则从position, rotation, scale以及父节点的transform计算出自身的transform矩阵
 */

Transformable.prototype.needLocalTransform = function () {
  return isNotAroundZero(this.rotation) || isNotAroundZero(this.position[0]) || isNotAroundZero(this.position[1]) || isNotAroundZero(this.scale[0] - 1) || isNotAroundZero(this.scale[1] - 1);
};

Transformable.prototype.updateTransform = function () {
  var parent = this.parent;
  var parentHasTransform = parent && parent.transform;
  var needLocalTransform = this.needLocalTransform();
  var m = this.transform;

  if (!(needLocalTransform || parentHasTransform)) {
    m && mIdentity(m);
    return;
  }

  m = m || matrix.create();

  if (needLocalTransform) {
    this.getLocalTransform(m);
  } else {
    mIdentity(m);
  } // 应用父节点变换


  if (parentHasTransform) {
    if (needLocalTransform) {
      matrix.mul(m, parent.transform, m);
    } else {
      matrix.copy(m, parent.transform);
    }
  } // 保存这个变换矩阵


  this.transform = m;
  var globalScaleRatio = this.globalScaleRatio;

  if (globalScaleRatio != null && globalScaleRatio !== 1) {
    this.getGlobalScale(scaleTmp);
    var relX = scaleTmp[0] < 0 ? -1 : 1;
    var relY = scaleTmp[1] < 0 ? -1 : 1;
    var sx = ((scaleTmp[0] - relX) * globalScaleRatio + relX) / scaleTmp[0] || 0;
    var sy = ((scaleTmp[1] - relY) * globalScaleRatio + relY) / scaleTmp[1] || 0;
    m[0] *= sx;
    m[1] *= sx;
    m[2] *= sy;
    m[3] *= sy;
  }

  this.invTransform = this.invTransform || matrix.create();
  matrix.invert(this.invTransform, m);
};

Transformable.prototype.getLocalTransform = function (m) {
  return Transformable.getLocalTransform(this, m);
};
/**
 * @method setTransform
 * 将自己的transform应用到context上
 * @param {CanvasRenderingContext2D} ctx
 */


Transformable.prototype.setTransform = function (ctx) {
  var m = this.transform;
  var dpr = ctx.dpr || 1;

  if (m) {
    ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
  } else {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
};

Transformable.prototype.restoreTransform = function (ctx) {
  var dpr = ctx.dpr || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

Transformable.prototype.setLocalTransform = function (m) {
  if (!m) {
    // TODO return or set identity?
    return;
  }

  var sx = m[0] * m[0] + m[1] * m[1];
  var sy = m[2] * m[2] + m[3] * m[3];
  var position = this.position;
  var scale = this.scale;

  if (isNotAroundZero(sx - 1)) {
    sx = mathSqrt(sx);
  }

  if (isNotAroundZero(sy - 1)) {
    sy = mathSqrt(sy);
  }

  if (m[0] < 0) {
    sx = -sx;
  }

  if (m[3] < 0) {
    sy = -sy;
  }

  position[0] = m[4];
  position[1] = m[5];
  scale[0] = sx;
  scale[1] = sy;
  this.rotation = mathAtan2(-m[1] / sy, m[0] / sx);
};
/**
 * 分解`transform`矩阵到`position`, `rotation`, `scale`
 */


Transformable.prototype.decomposeTransform = function () {
  if (!this.transform) {
    return;
  }

  var parent = this.parent;
  var m = this.transform;

  if (parent && parent.transform) {
    // Get local transform and decompose them to position, scale, rotation
    matrix.mul(tmpTransform, parent.invTransform, m);
    m = tmpTransform;
  }

  var origin = this.origin;

  if (origin && (origin[0] || origin[1])) {
    originTransform[4] = origin[0];
    originTransform[5] = origin[1];
    matrix.mul(tmpTransform, m, originTransform);
    tmpTransform[4] -= origin[0];
    tmpTransform[5] -= origin[1];
    m = tmpTransform;
  }

  this.setLocalTransform(m);
};
/**
 * @method getGlobalScale
 * Get global scale
 * @return {Array<Number>}
 */


Transformable.prototype.getGlobalScale = function (out) {
  var m = this.transform;
  out = out || [];

  if (!m) {
    out[0] = 1;
    out[1] = 1;
    return out;
  }

  out[0] = mathSqrt(m[0] * m[0] + m[1] * m[1]);
  out[1] = mathSqrt(m[2] * m[2] + m[3] * m[3]);

  if (m[0] < 0) {
    out[0] = -out[0];
  }

  if (m[3] < 0) {
    out[1] = -out[1];
  }

  return out;
};
/**
 * @method transformCoordToLocal
 * 变换坐标位置到 shape 的局部坐标空间
 * @param {Number} x
 * @param {Number} y
 * @return {Array<Number>}
 */


Transformable.prototype.transformCoordToLocal = function (x, y) {
  var v2 = [x, y];
  var invTransform = this.invTransform;

  if (invTransform) {
    vector.applyTransform(v2, v2, invTransform);
  }

  return v2;
};
/**
 * @method transformCoordToGlobal
 * 变换局部坐标位置到全局坐标空间
 * @param {Number} x
 * @param {Number} y
 * @return {Array<Number>}
 */


Transformable.prototype.transformCoordToGlobal = function (x, y) {
  var v2 = [x, y];
  var transform = this.transform;

  if (transform) {
    vector.applyTransform(v2, v2, transform);
  }

  return v2;
};
/**
 * @static
 * @method getLocalTransform
 * @param {Object} target
 * @param {Array<Number>} target.origin
 * @param {Number} target.rotation
 * @param {Array<Number>} target.position
 * @param {Array<Number>} [m]
 */


Transformable.getLocalTransform = function (target, m) {
  m = m || [];
  mIdentity(m);
  var origin = target.origin;
  var scale = target.scale || [1, 1];
  var rotation = target.rotation || 0;
  var position = target.position || [0, 0];

  if (origin) {
    // Translate to origin
    m[4] -= origin[0];
    m[5] -= origin[1];
  }

  matrix.scale(m, m, scale);

  if (rotation) {
    matrix.rotate(m, m, rotation);
  }

  if (origin) {
    // Translate back from origin
    m[4] += origin[0];
    m[5] += origin[1];
  }

  m[4] += position[0];
  m[5] += position[1];
  return m;
};

var _default = Transformable;
module.exports = _default;
}, function(modId) { var map = {"../../core/utils/matrix":1582161598615,"../../core/utils/vector":1582161598605,"../constants":1582161598603,"../../core/utils/class_util":1582161598604}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598615, function(require, module, exports) {
var _constants = require("../../graphic/constants");

var mathSin = _constants.mathSin;
var mathCos = _constants.mathCos;

/**
 * 3x2矩阵操作类
 * @exports qrenderer/core/matrix
 */

/* global Float32Array */
var ArrayCtor = typeof Float32Array === 'undefined' ? Array : Float32Array;
/**
 * Create a identity matrix.
 * @return {Float32Array|Array.<Number>}
 */

function create() {
  var out = new ArrayCtor(6);
  identity(out);
  return out;
}
/**
 * 设置矩阵为单位矩阵
 * @param {Float32Array|Array.<Number>} out
 */


function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * 复制矩阵
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} m
 */


function copy(out, m) {
  out[0] = m[0];
  out[1] = m[1];
  out[2] = m[2];
  out[3] = m[3];
  out[4] = m[4];
  out[5] = m[5];
  return out;
}
/**
 * 矩阵相乘
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} m1
 * @param {Float32Array|Array.<Number>} m2
 */


function mul(out, m1, m2) {
  // Consider matrix.mul(m, m2, m);
  // where out is the same as m2.
  // So use temp variable to escape error.
  var out0 = m1[0] * m2[0] + m1[2] * m2[1];
  var out1 = m1[1] * m2[0] + m1[3] * m2[1];
  var out2 = m1[0] * m2[2] + m1[2] * m2[3];
  var out3 = m1[1] * m2[2] + m1[3] * m2[3];
  var out4 = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
  var out5 = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = out3;
  out[4] = out4;
  out[5] = out5;
  return out;
}
/**
 * 平移变换
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} a
 * @param {Float32Array|Array.<Number>} v
 */


function translate(out, a, v) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4] + v[0];
  out[5] = a[5] + v[1];
  return out;
}
/**
 * 旋转变换
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} a
 * @param {Number} rad
 */


function rotate(out, a, rad) {
  var aa = a[0];
  var ac = a[2];
  var atx = a[4];
  var ab = a[1];
  var ad = a[3];
  var aty = a[5];
  var st = mathSin(rad);
  var ct = mathCos(rad);
  out[0] = aa * ct + ab * st;
  out[1] = -aa * st + ab * ct;
  out[2] = ac * ct + ad * st;
  out[3] = -ac * st + ct * ad;
  out[4] = ct * atx + st * aty;
  out[5] = ct * aty - st * atx;
  return out;
}
/**
 * 缩放变换
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} a
 * @param {Float32Array|Array.<Number>} v
 */


function scale(out, a, v) {
  var vx = v[0];
  var vy = v[1];
  out[0] = a[0] * vx;
  out[1] = a[1] * vy;
  out[2] = a[2] * vx;
  out[3] = a[3] * vy;
  out[4] = a[4] * vx;
  out[5] = a[5] * vy;
  return out;
}
/**
 * 求逆矩阵
 * @param {Float32Array|Array.<Number>} out
 * @param {Float32Array|Array.<Number>} a
 */


function invert(out, a) {
  var aa = a[0];
  var ac = a[2];
  var atx = a[4];
  var ab = a[1];
  var ad = a[3];
  var aty = a[5];
  var det = aa * ad - ab * ac;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
}
/**
 * Clone a new matrix.
 * @param {Float32Array|Array.<Number>} a
 */


function clone(a) {
  var b = create();
  copy(b, a);
  return b;
}

exports.create = create;
exports.identity = identity;
exports.copy = copy;
exports.mul = mul;
exports.translate = translate;
exports.rotate = rotate;
exports.scale = scale;
exports.invert = invert;
exports.clone = clone;
}, function(modId) { var map = {"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598616, function(require, module, exports) {
var AnimationProcess = require("./AnimationProcess");

var dataUtil = require("../core/utils/data_structure_util");

/**
 * @class qrenderer.animation.Animatable
 * 
 * 动画接口类，在 Element 类中 mixin 此类提供的功能，为元素提供动画功能。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @abstract
 * @method constructor Animatable
 */
var Animatable = function Animatable() {
  /**
   * @property {qrenderer.animation.AnimationProcess}
   * @readOnly
   */
  this.animationProcessList = [];
};

Animatable.prototype = {
  constructor: Animatable,

  /**
   * @method 
   * 创建动画实例
   * @param {String} path The path to fetch value from object, like 'a.b.c'.
   * @param {Boolean} [loop=false] Whether to loop animation.
   * @return {qrenderer.animation.AnimationProcess}
   * @example
   * el.animate('style', false)
   *   .when(1000, {x: 10} )
   *   .done(function(){ // Animation done })
   *   .start()
   */
  animate: function animate(path, loop) {
    var target;
    var animatingShape = false;
    var animatable = this;

    if (path) {
      var pathSplitted = path.split('.');
      var prop = animatable; // If animating shape

      animatingShape = pathSplitted[0] === 'shape';

      for (var i = 0, l = pathSplitted.length; i < l; i++) {
        if (!prop) {
          continue;
        }

        prop = prop[pathSplitted[i]];
      }

      if (prop) {
        target = prop;
      }
    } else {
      target = animatable;
    }

    if (!target) {
      console.log('Property "' + path + '" is not existed in element ' + animatable.id);
      return;
    }

    var animationProcess = new AnimationProcess(target, loop);
    animationProcess.during(function (target) {
      animatable.dirty(animatingShape);
    }).done(function () {
      // FIXME AnimationProcess will not be removed if use `AnimationProcess#stop` to stop animation
      animatable.animationProcessList.splice(dataUtil.indexOf(animatable.animationProcessList, animationProcess), 1);
    });
    animatable.animationProcessList.push(animationProcess); // If animate after added to the qrenderer

    if (this.__qr) {
      this.__qr.globalAnimationMgr.addAnimationProcess(animationProcess);
    }

    return animationProcess;
  },

  /**
   * @method
   * 停止动画
   * @param {Boolean} forwardToLast If move to last frame before stop
   */
  stopAnimation: function stopAnimation(forwardToLast) {
    this.animationProcessList.forEach(function (ap, index) {
      ap.stop(forwardToLast);
    });
    this.animationProcessList.length = 0;
    return this;
  },

  /**
   * @method
   * Caution: this method will stop previous animation.
   * So do not use this method to one element twice before
   * animation starts, unless you know what you are doing.
   * @param {Object} [target]
   * @param {Number} [time=500] Time in ms
   * @param {String} [easing='linear']
   * @param {Number} [delay=0]
   * @param {Function} [callback]
   * @param {Function} [forceAnimate] Prevent stop animation and callbackm immediently when target values are the same as current values.
   *
   * @example
   *  // Animate position
   *  el.animateTo({
   *      position: [10, 10]
   *  }, function () { // done })
   *
   *  // Animate shape, style and position in 100ms, delayed 100ms, with cubicOut easing
   *  el.animateTo({
   *      shape: {
   *          width: 500
   *      },
   *      style: {
   *          fill: 'red'
   *      }
   *      position: [10, 10]
   *  }, 100, 100, 'cubicOut', function () { // done })
   */
  animateTo: function animateTo(target, time, delay, easing, callback, forceAnimate) {
    _doAnimation(this, target, time, delay, easing, callback, forceAnimate);
  },

  /**
   * @method
   * Animate from the target state to current state.
   * The params and the return value are the same as `this.animateTo`.
   * @param {Object} [target]
   * @param {Number} [time=500] Time in ms
   * @param {String} [easing='linear']
   * @param {Number} [delay=0]
   * @param {Function} [callback]
   * @param {Function} [forceAnimate] Prevent stop animation and callbackm immediently when target values are the same as current values.
   *
   */
  animateFrom: function animateFrom(target, time, delay, easing, callback, forceAnimate) {
    _doAnimation(this, target, time, delay, easing, callback, forceAnimate, true);
  }
};
/**
 * @private
 * @method
 * @param {Element} animatable 
 * @param {Element} target 
 * @param {Number} time 
 * @param {Number} delay 
 * @param {String} easing 
 * @param {Function} callback 
 * @param {Boolean} forceAnimate 
 * @param {Boolean} reverse 
 */

function _doAnimation(animatable, target, time, delay, easing, callback, forceAnimate, reverse) {
  // animateTo(target, time, easing, callback);
  if (dataUtil.isString(delay)) {
    callback = easing;
    easing = delay;
    delay = 0;
  } // animateTo(target, time, delay, callback);
  else if (dataUtil.isFunction(easing)) {
      callback = easing;
      easing = 'linear';
      delay = 0;
    } // animateTo(target, time, callback);
    else if (dataUtil.isFunction(delay)) {
        callback = delay;
        delay = 0;
      } // animateTo(target, callback)
      else if (dataUtil.isFunction(time)) {
          callback = time;
          time = 500;
        } // animateTo(target)
        else if (!time) {
            time = 500;
          } // Stop all previous animations


  animatable.stopAnimation();
  animateToShallow(animatable, '', animatable, target, time, delay, reverse); // AnimationProcess may be removed immediately after start
  // if there is nothing to animate

  var animationProcessList = animatable.animationProcessList.slice();
  var count = animationProcessList.length;

  function done() {
    count--;

    if (!count) {
      callback && callback();
    }
  } // No animationProcessList. This should be checked before animationProcessList[i].start(),
  // because 'done' may be executed immediately if no need to animate.


  if (!count) {
    callback && callback();
  } // Start after all animationProcessList created
  // Incase any animationProcess is done immediately when all animation properties are not changed


  for (var i = 0; i < animationProcessList.length; i++) {
    animationProcessList[i].done(done).start(easing, forceAnimate);
  }
}
/**
 * @private
 * @method
 * 
 * @param {Element} animatable
 * @param {String} path=''
 * @param {Object} source=animatable
 * @param {Object} target
 * @param {Number} [time=500]
 * @param {Number} [delay=0]
 * @param {Boolean} [reverse] If `true`, animate
 *        from the `target` to current state.
 *
 * @example
 *  // Animate position
 *  el._animateToShallow({
 *      position: [10, 10]
 *  })
 *
 *  // Animate shape, style and position in 100ms, delayed 100ms
 *  el._animateToShallow({
 *      shape: {
 *          width: 500
 *      },
 *      style: {
 *          fill: 'red'
 *      }
 *      position: [10, 10]
 *  }, 100, 100)
 */


function animateToShallow(animatable, path, source, target, time, delay, reverse) {
  var objShallow = {};
  var propertyCount = 0;

  for (var prop in target) {
    if (!target.hasOwnProperty(prop)) {
      continue;
    }

    if (source[prop] != null) {
      if (dataUtil.isObject(target[prop]) && !dataUtil.isArrayLike(target[prop])) {
        animateToShallow(animatable, path ? path + '.' + prop : prop, source[prop], target[prop], time, delay, reverse);
      } else {
        if (reverse) {
          objShallow[prop] = source[prop];
          setAttrByPath(animatable, path, prop, target[prop]);
        } else {
          objShallow[prop] = target[prop];
        }

        propertyCount++;
      }
    } else if (target[prop] != null && !reverse) {
      setAttrByPath(animatable, path, prop, target[prop]);
    }
  }

  if (propertyCount > 0) {
    animatable.animate(path, false).when(time == null ? 500 : time, objShallow).delay(delay || 0);
  }
}

function setAttrByPath(el, path, prop, value) {
  // Attr directly if not has property
  // FIXME, if some property not needed for element ?
  if (!path) {
    el.attr(prop, value);
  } else {
    // Only support set shape or style
    var props = {};
    props[path] = {};
    props[path][prop] = value;
    el.attr(props);
  }
}

var _default = Animatable;
module.exports = _default;
}, function(modId) { var map = {"./AnimationProcess":1582161598617,"../core/utils/data_structure_util":1582161598602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598617, function(require, module, exports) {
var dataUtil = require("../core/utils/data_structure_util");

var Track = require("./Track");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.animation.AnimationProcess
 * 
 * AnimationProcess 表示一次完整的动画过程，每一个元素（Element）中都有一个列表，用来存储本实例上的动画过程。
 * GlobalAnimationMgr 负责维护和调度所有 AnimationProcess 实例。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor AnimationProcess
 * @param {Object} target 需要进行动画的元素
 * @param {Boolean} loop 动画是否循环播放
 * @param {Function} getter
 * @param {Function} setter
 */
// let AnimationProcess = function (target, loop, getter, setter) {
// };
// AnimationProcess.prototype = {};
var AnimationProcess =
/*#__PURE__*/
function () {
  function AnimationProcess(target, loop, getter, setter) {
    _classCallCheck(this, AnimationProcess);

    this._trackCacheMap = new Map();
    this._target = target;
    this._loop = loop || false;

    this._getter = getter || function (target, key) {
      return target[key];
    };

    this._setter = setter || function (target, key, value) {
      target[key] = value;
    };

    this._delay = 0;
    this._paused = false;
    this._doneList = []; //callback list when the entire animation process is finished

    this._onframeList = []; //callback list for each frame
  }
  /**
   * @method when
   * 为每一种需要进行动画的属性创建一条轨道
   * @param  {Number} time 关键帧时间，单位ms
   * @param  {Object} props 关键帧的属性值，key-value表示
   * @return {qrenderer.animation.AnimationProcess}
   */


  _createClass(AnimationProcess, [{
    key: "when",
    value: function when(time, props) {
      for (var propName in props) {
        if (!props.hasOwnProperty(propName)) {
          continue;
        } // Invalid value


        var value = this._getter(this._target, propName);

        if (value == null) {
          // qrLog('Invalid property ' + propName);
          continue;
        }

        var track = this._trackCacheMap.get(propName);

        if (!track) {
          track = new Track({
            _target: this._target,
            _getter: this._getter,
            _setter: this._setter,
            _loop: this._loop,
            _delay: this._delay
          });
        }

        if (time !== 0) {
          track.addKeyFrame({
            time: 0,
            value: dataUtil.cloneValue(value)
          });
        }

        track.addKeyFrame({
          time: time,
          value: props[propName]
        });

        this._trackCacheMap.set(propName, track);
      }

      return this;
    }
    /**
     * @method during
     * 添加动画每一帧的回调函数
     * @param  {Function} callback
     * @return {qrenderer.animation.AnimationProcess}
     */

  }, {
    key: "during",
    value: function during(callback) {
      this._onframeList.push(callback);

      return this;
    }
    /**
     * @private
     * @method _doneCallback
     * 动画过程整体结束的时候回调此函数
     */

  }, {
    key: "_doneCallback",
    value: function _doneCallback() {
      var _this = this;

      this._doneList.forEach(function (fn, index) {
        fn.call(_this);
      });

      this._trackCacheMap = new Map();
    }
    /**
     * @method isFinished
     * 判断整个动画过程是否已经完成，所有 Track 上的动画都完成则整个动画过程完成
     */

  }, {
    key: "isFinished",
    value: function isFinished() {
      var isFinished = true;

      _toConsumableArray(this._trackCacheMap.values()).forEach(function (track, index) {
        if (!track.isFinished) {
          isFinished = false;
        }
      });

      return isFinished;
    }
    /**
     * @method start
     * 开始执行动画
     * @param  {String|Function} [easing] 缓动函数名称，详见{@link qrenderer.animation.easing 缓动引擎}
     * @param  {Boolean} forceAnimate
     * @return {qrenderer.animation.AnimationProcess}
     */

  }, {
    key: "start",
    value: function start(easing, forceAnimate) {
      var _this2 = this;

      var self = this;

      var keys = _toConsumableArray(this._trackCacheMap.keys());

      keys.forEach(function (propName, index) {
        if (!_this2._trackCacheMap.get(propName)) {
          return;
        }

        var track = _this2._trackCacheMap.get(propName);

        track.start(easing, propName, forceAnimate);
      }); // This optimization will help the case that in the upper application
      // the view may be refreshed frequently, where animation will be
      // called repeatly but nothing changed.

      if (!keys.length) {
        this._doneCallback();
      }

      return this;
    }
    /**
     * @method stop
     * 停止动画
     * @param {Boolean} forwardToLast If move to last frame before stop
     */

  }, {
    key: "stop",
    value: function stop(forwardToLast) {
      var _this3 = this;

      _toConsumableArray(this._trackCacheMap.values()).forEach(function (track, index) {
        track.stop(_this3._target, 1);
      });

      this._trackCacheMap = new Map();
    }
    /**
     * @method nextFrame
     * 进入下一帧
     * @param {Number} time  当前时间
     * @param {Number} delta 时间偏移量
     */

  }, {
    key: "nextFrame",
    value: function nextFrame(time, delta) {
      var deferredEvents = [];
      var deferredTracks = [];
      var percent = "";

      _toConsumableArray(this._trackCacheMap.values()).forEach(function (track, index) {
        var result = track.nextFrame(time, delta);

        if (dataUtil.isString(result)) {
          deferredEvents.push(result);
          deferredTracks.push(track);
        } else if (dataUtil.isNumeric(result)) {
          percent = result;
        }
      });

      var len = deferredEvents.length;

      for (var i = 0; i < len; i++) {
        deferredTracks[i].fire(deferredEvents[i]);
      }

      if (dataUtil.isNumeric(percent)) {
        for (var _i = 0; _i < this._onframeList.length; _i++) {
          this._onframeList[_i](this._target, percent);
        }
      }

      if (this.isFinished()) {
        this._doneCallback();
      }
    }
    /**
     * @method pause
     * 暂停动画
     */

  }, {
    key: "pause",
    value: function pause() {
      _toConsumableArray(this._trackCacheMap.values()).forEach(function (track, index) {
        track.pause();
      });

      this._paused = true;
    }
    /**
     * @method resume
     * 恢复动画
     */

  }, {
    key: "resume",
    value: function resume() {
      _toConsumableArray(this._trackCacheMap.values()).forEach(function (track, index) {
        track.resume();
      });

      this._paused = false;
    }
    /**
     * @method isPaused
     * 是否暂停
     */

  }, {
    key: "isPaused",
    value: function isPaused() {
      return !!this._paused;
    }
    /**
     * @method delay
     * 设置动画延迟开始的时间
     * @param  {Number} time 单位ms
     * @return {qrenderer.animation.AnimationProcess}
     */

  }, {
    key: "delay",
    value: function delay(time) {
      this._delay = time;
      return this;
    }
    /**
     * @method done
     * 添加动画结束的回调
     * @param  {Function} cb
     * @return {qrenderer.animation.AnimationProcess}
     */

  }, {
    key: "done",
    value: function done(cb) {
      if (cb) {
        this._doneList.push(cb);
      }

      return this;
    }
  }]);

  return AnimationProcess;
}();

var _default = AnimationProcess;
module.exports = _default;
}, function(modId) { var map = {"../core/utils/data_structure_util":1582161598602,"./Track":1582161598618}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598618, function(require, module, exports) {
var Timeline = require("./Timeline");

var colorUtil = require("../core/utils/color_util");

var dataUtil = require("../core/utils/data_structure_util");

var _constants = require("../graphic/constants");

var mathMin = _constants.mathMin;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.animation.Track
 * 
 * Track, 轨道，与元素（Element）上可以用来进行动画的属性一一对应。
 * 元素上存在很多种属性，在动画过程中，可能会有多种属性同时发生变化，
 * 每一种属性天然成为一条动画轨道，把这些轨道上的变化过程封装在 Timeline 中。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var Track =
/*#__PURE__*/
function () {
  /**
   * @method constructor Track
   * @param {Object} options 
   */
  function Track(options) {
    _classCallCheck(this, Track);

    this._target = options._target;
    this._getter = options._getter;
    this._setter = options._setter;
    this._loop = options._loop;
    this._delay = options._delay;
    this.isFinished = false;
    this.keyframes = [];
    this.timeline;
  }
  /**
   * @method addKeyFrame
   * 添加关键帧
   * @param {Object} kf 数据结构为 {time:0,value:0}
   */


  _createClass(Track, [{
    key: "addKeyFrame",
    value: function addKeyFrame(kf) {
      this.keyframes.push(kf);
    }
    /**
     * @method nextFrame
     * 进入下一帧
     * @param {Number} time  当前时间
     * @param {Number} delta 时间偏移量
     */

  }, {
    key: "nextFrame",
    value: function nextFrame(time, delta) {
      if (!this.timeline) {
        //TODO:fix this, there is something wrong here.
        return;
      }

      var result = this.timeline.nextFrame(time, delta);

      if (dataUtil.isNumeric(result) && result === 1) {
        this.isFinished = true;
      }

      return result;
    }
    /**
     * @method fire
     * 触发事件
     * @param {String} eventType 
     * @param {Object} arg 
     */

  }, {
    key: "fire",
    value: function fire(eventType, arg) {
      this.timeline.fire(eventType, arg);
    }
    /**
     * @method start
     * 开始动画
     * @param {String} easing 缓动函数名称
     * @param {String} propName 属性名称
     * @param {Boolean} forceAnimate 是否强制开启动画 
     */

  }, {
    key: "start",
    value: function start(easing, propName, forceAnimate) {
      var options = this._parseKeyFrames(easing, propName, forceAnimate); //如果传入的参数不正确，则无法构造实例


      if (!options) {
        return null;
      }

      var timeline = new Timeline(options);
      this.timeline = timeline;
    }
    /**
     * @method stop
     * 停止动画
     * @param {Boolean} forwardToLast 是否快进到最后一帧 
     */

  }, {
    key: "stop",
    value: function stop(forwardToLast) {
      if (forwardToLast) {
        // Move to last frame before stop
        this.timeline.onframe(this._target, 1);
      }
    }
    /**
     * @method pause
     * 暂停
     */

  }, {
    key: "pause",
    value: function pause() {
      this.timeline.pause();
    }
    /**
     * @method resume
     * 重启
     */

  }, {
    key: "resume",
    value: function resume() {
      this.timeline.resume();
    }
    /**
     * @private
     * @method _parseKeyFrames
     * 解析关键帧，创建时间线
     * @param {String} easing 缓动函数名称
     * @param {String} propName 属性名称
     * @param {Boolean} forceAnimate 是否强制开启动画 
     * //TODO:try move this into webworker
     */

  }, {
    key: "_parseKeyFrames",
    value: function _parseKeyFrames(easing, propName, forceAnimate) {
      var loop = this._loop;
      var delay = this._delay;
      var target = this._target;
      var getter = this._getter;
      var setter = this._setter;
      var useSpline = easing === 'spline';
      var kfLength = this.keyframes.length;

      if (!kfLength) {
        return;
      } // Guess data type


      var firstVal = this.keyframes[0].value;
      var isValueArray = dataUtil.isArrayLike(firstVal);
      var isValueColor = false;
      var isValueString = false; // For vertices morphing

      var arrDim = isValueArray ? dataUtil.getArrayDim(this.keyframes) : 0;
      this.keyframes.sort(function (a, b) {
        return a.time - b.time;
      });
      var trackMaxTime = this.keyframes[kfLength - 1].time;
      var kfPercents = [];
      var kfValues = [];
      var prevValue = this.keyframes[0].value;
      var isAllValueEqual = true;

      for (var i = 0; i < kfLength; i++) {
        kfPercents.push(this.keyframes[i].time / trackMaxTime); // Assume value is a color when it is a string

        var value = this.keyframes[i].value; // Check if value is equal, deep check if value is array

        if (!(isValueArray && dataUtil.isArraySame(value, prevValue, arrDim) || !isValueArray && value === prevValue)) {
          isAllValueEqual = false;
        }

        prevValue = value; // Try converting a string to a color array

        if (typeof value === 'string') {
          var colorArray = colorUtil.parse(value);

          if (colorArray) {
            value = colorArray;
            isValueColor = true;
          } else {
            isValueString = true;
          }
        }

        kfValues.push(value);
      }

      if (!forceAnimate && isAllValueEqual) {
        return;
      }

      var lastValue = kfValues[kfLength - 1]; // Polyfill array and NaN value

      for (var _i = 0; _i < kfLength - 1; _i++) {
        if (isValueArray) {
          dataUtil.fillArr(kfValues[_i], lastValue, arrDim);
        } else {
          if (isNaN(kfValues[_i]) && !isNaN(lastValue) && !isValueString && !isValueColor) {
            kfValues[_i] = lastValue;
          }
        }
      }

      isValueArray && dataUtil.fillArr(getter(target, propName), lastValue, arrDim); // Cache the key of last frame to speed up when
      // animation playback is sequency

      var lastFrame = 0;
      var lastFramePercent = 0;
      var start;
      var w;
      var p0;
      var p1;
      var p2;
      var p3;
      var rgba = [0, 0, 0, 0]; //Timeline 每一帧都会回调此方法。

      var onframe = function onframe(target, percent) {
        // Find the range keyframes
        // kf1-----kf2---------current--------kf3
        // find kf2 and kf3 and do interpolation
        var frame; // In the easing function like elasticOut, percent may less than 0

        if (percent < 0) {
          frame = 0;
        } else if (percent < lastFramePercent) {
          // Start from next key
          // PENDING start from lastFrame ?
          start = mathMin(lastFrame + 1, kfLength - 1);

          for (frame = start; frame >= 0; frame--) {
            if (kfPercents[frame] <= percent) {
              break;
            }
          } // PENDING really need to do this ?


          frame = mathMin(frame, kfLength - 2);
        } else {
          for (frame = lastFrame; frame < kfLength; frame++) {
            if (kfPercents[frame] > percent) {
              break;
            }
          }

          frame = mathMin(frame - 1, kfLength - 2);
        }

        lastFrame = frame;
        lastFramePercent = percent;
        var range = kfPercents[frame + 1] - kfPercents[frame];

        if (range === 0) {
          return;
        } else {
          w = (percent - kfPercents[frame]) / range;
        }

        if (useSpline) {
          p1 = kfValues[frame];
          p0 = kfValues[frame === 0 ? frame : frame - 1];
          p2 = kfValues[frame > kfLength - 2 ? kfLength - 1 : frame + 1];
          p3 = kfValues[frame > kfLength - 3 ? kfLength - 1 : frame + 2];

          if (isValueArray) {
            dataUtil.catmullRomInterpolateArray(p0, p1, p2, p3, w, w * w, w * w * w, getter(target, propName), arrDim);
          } else {
            var _value;

            if (isValueColor) {
              _value = dataUtil.catmullRomInterpolateArray(p0, p1, p2, p3, w, w * w, w * w * w, rgba, 1);
              _value = dataUtil.rgba2String(rgba);
            } else if (isValueString) {
              // String is step(0.5)
              return dataUtil.interpolateString(p1, p2, w);
            } else {
              _value = dataUtil.catmullRomInterpolate(p0, p1, p2, p3, w, w * w, w * w * w);
            }

            setter(target, propName, _value);
          }
        } else {
          if (isValueArray) {
            dataUtil.interpolateArray(kfValues[frame], kfValues[frame + 1], w, getter(target, propName), arrDim);
          } else {
            var _value2;

            if (isValueColor) {
              dataUtil.interpolateArray(kfValues[frame], kfValues[frame + 1], w, rgba, 1);
              _value2 = dataUtil.rgba2String(rgba);
            } else if (isValueString) {
              // String is step(0.5)
              return dataUtil.interpolateString(kfValues[frame], kfValues[frame + 1], w);
            } else {
              _value2 = dataUtil.interpolateNumber(kfValues[frame], kfValues[frame + 1], w);
            }

            setter(target, propName, _value2);
          }
        }
      };

      var options = {
        target: target,
        lifeTime: trackMaxTime,
        loop: loop,
        delay: delay,
        onframe: onframe,
        easing: easing && easing !== 'spline' ? easing : 'Linear'
      };
      return options;
    }
  }]);

  return Track;
}();

module.exports = Track;
}, function(modId) { var map = {"./Timeline":1582161598619,"../core/utils/color_util":1582161598621,"../core/utils/data_structure_util":1582161598602,"../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598619, function(require, module, exports) {
var easingFuncs = require("./utils/easing");

var _constants = require("../graphic/constants");

var mathMin = _constants.mathMin;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.animation.Timeline
 * Timeline，时间线，用来计算元素上的某个属性在指定时间点的数值。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var Timeline =
/*#__PURE__*/
function () {
  /**
   * @method constructor Timeline
   * @param {Object} options 
   * @param {Element} options.target 动画对象，可以是数组，如果是数组的话会批量分发onframe等事件
   * @param {Number} options.life(1000) 动画时长
   * @param {Number} options.delay(0) 动画延迟时间
   * @param {Boolean} options.loop(true)
   * @param {Number} options.gap(0) 循环的间隔时间
   * @param {Function} options.onframe
   * @param {String} options.easing(optional)
   * @param {Function} options.ondestroy(optional)
   * @param {Function} options.onrestart(optional)
   */
  function Timeline(options) {
    _classCallCheck(this, Timeline);

    this._target = options.target;
    this._lifeTime = options.lifeTime || 1000;
    this._delay = options.delay || 0;
    this._initialized = false;
    this.loop = options.loop == null ? false : options.loop;
    this.gap = options.gap || 0;
    this.easing = options.easing || 'Linear';
    this.onframe = options.onframe;
    this.ondestroy = options.ondestroy;
    this.onrestart = options.onrestart;
    this._pausedTime = 0;
    this._paused = false;
  }
  /**
   * @method nextFrame
   * 进入下一帧
   * @param {Number} globalTime 当前时间
   * @param {Number} deltaTime  时间偏移量
   * //TODO:try move this into webworker
   */


  _createClass(Timeline, [{
    key: "nextFrame",
    value: function nextFrame(globalTime, deltaTime) {
      // Set startTime on first frame, or _startTime may has milleseconds different between clips
      // PENDING
      if (!this._initialized) {
        this._startTime = globalTime + this._delay;
        this._initialized = true;
      }

      if (this._paused) {
        this._pausedTime += deltaTime;
        return;
      }

      var percent = (globalTime - this._startTime - this._pausedTime) / this._lifeTime; // 还没开始

      if (percent < 0) {
        return;
      }

      percent = mathMin(percent, 1);
      var easing = this.easing;
      var easingFunc = typeof easing === 'string' ? easingFuncs[easing] : easing;
      var schedule = typeof easingFunc === 'function' ? easingFunc(percent) : percent;
      this.fire('frame', schedule); // 结束或者重新开始周期
      // 抛出而不是直接调用事件直到 stage.update 后再统一调用这些事件

      if (percent === 1) {
        if (this.loop) {
          this.restart(globalTime);
          return 'restart';
        }

        return 'destroy';
      }

      return percent;
    }
    /**
     * @method restart
     * 重新开始
     * @param {Number} globalTime 
     */

  }, {
    key: "restart",
    value: function restart(globalTime) {
      var remainder = (globalTime - this._startTime - this._pausedTime) % this._lifeTime;
      this._startTime = globalTime - remainder + this.gap;
      this._pausedTime = 0;
    }
    /**
     * @method fire
     * 触发事件
     * @param {String} eventType 
     * @param {Object} arg 
     */

  }, {
    key: "fire",
    value: function fire(eventType, arg) {
      eventType = 'on' + eventType;

      if (this[eventType]) {
        this[eventType](this._target, arg);
      }
    }
    /**
     * @method pause
     * 暂停
     */

  }, {
    key: "pause",
    value: function pause() {
      this._paused = true;
    }
    /**
     * @method resume
     * 恢复运行
     */

  }, {
    key: "resume",
    value: function resume() {
      this._paused = false;
    }
  }]);

  return Timeline;
}();

module.exports = Timeline;
}, function(modId) { var map = {"./utils/easing":1582161598620,"../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598620, function(require, module, exports) {
var _constants = require("../../graphic/constants");

var mathAsin = _constants.mathAsin;
var mathCos = _constants.mathCos;
var mathSin = _constants.mathSin;
var mathPow = _constants.mathPow;
var mathSqrt = _constants.mathSqrt;
var PI = _constants.PI;
var mathMin = _constants.mathMin;

/**
 * 缓动代码来自 https://github.com/sole/tween.js/blob/master/src/Tween.js
 * 这里的缓动主要是一些数学计算公式，这些公式可以用来计算对象的坐标。
 * @see http://sole.github.io/tween.js/examples/03_graphs.html
 * @exports qrenderer/animation/easing
 */
var easing = {
  /**
  * @param {Number} k
  * @return {Number}
  */
  linear: function linear(k) {
    return k;
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  quadraticIn: function quadraticIn(k) {
    return k * k;
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  quadraticOut: function quadraticOut(k) {
    return k * (2 - k);
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  quadraticInOut: function quadraticInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k;
    }

    return -0.5 * (--k * (k - 2) - 1);
  },
  // 三次方的缓动（t^3）

  /**
  * @param {Number} k
  * @return {Number}
  */
  cubicIn: function cubicIn(k) {
    return k * k * k;
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  cubicOut: function cubicOut(k) {
    return --k * k * k + 1;
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  cubicInOut: function cubicInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k + 2);
  },
  // 四次方的缓动（t^4）

  /**
  * @param {Number} k
  * @return {Number}
  */
  quarticIn: function quarticIn(k) {
    return k * k * k * k;
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  quarticOut: function quarticOut(k) {
    return 1 - --k * k * k * k;
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  quarticInOut: function quarticInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k * k;
    }

    return -0.5 * ((k -= 2) * k * k * k - 2);
  },
  // 五次方的缓动（t^5）

  /**
  * @param {Number} k
  * @return {Number}
  */
  quinticIn: function quinticIn(k) {
    return k * k * k * k * k;
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  quinticOut: function quinticOut(k) {
    return --k * k * k * k * k + 1;
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  quinticInOut: function quinticInOut(k) {
    if ((k *= 2) < 1) {
      return 0.5 * k * k * k * k * k;
    }

    return 0.5 * ((k -= 2) * k * k * k * k + 2);
  },
  // 正弦曲线的缓动（sin(t)）

  /**
  * @param {Number} k
  * @return {Number}
  */
  sinusoidalIn: function sinusoidalIn(k) {
    return 1 - mathCos(k * PI / 2);
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  sinusoidalOut: function sinusoidalOut(k) {
    return mathSin(k * PI / 2);
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  sinusoidalInOut: function sinusoidalInOut(k) {
    return 0.5 * (1 - mathCos(PI * k));
  },
  // 指数曲线的缓动（2^t）

  /**
  * @param {Number} k
  * @return {Number}
  */
  exponentialIn: function exponentialIn(k) {
    return k === 0 ? 0 : mathPow(1024, k - 1);
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  exponentialOut: function exponentialOut(k) {
    return k === 1 ? 1 : 1 - mathPow(2, -10 * k);
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  exponentialInOut: function exponentialInOut(k) {
    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if ((k *= 2) < 1) {
      return 0.5 * mathPow(1024, k - 1);
    }

    return 0.5 * (-mathPow(2, -10 * (k - 1)) + 2);
  },
  // 圆形曲线的缓动（sqrt(1-t^2)）

  /**
  * @param {Number} k
  * @return {Number}
  */
  circularIn: function circularIn(k) {
    return 1 - mathSqrt(1 - k * k);
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  circularOut: function circularOut(k) {
    return mathSqrt(1 - --k * k);
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  circularInOut: function circularInOut(k) {
    if ((k *= 2) < 1) {
      return -0.5 * (mathSqrt(1 - k * k) - 1);
    }

    return 0.5 * (mathSqrt(1 - (k -= 2) * k) + 1);
  },
  // 创建类似于弹簧在停止前来回振荡的动画

  /**
  * @param {Number} k
  * @return {Number}
  */
  elasticIn: function elasticIn(k) {
    var s;
    var a = 0.1;
    var p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * mathAsin(1 / a) / (2 * PI);
    }

    return -(a * mathPow(2, 10 * (k -= 1)) * mathSin((k - s) * (2 * PI) / p));
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  elasticOut: function elasticOut(k) {
    var s;
    var a = 0.1;
    var p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * mathAsin(1 / a) / (2 * PI);
    }

    return a * mathPow(2, -10 * k) * mathSin((k - s) * (2 * PI) / p) + 1;
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  elasticInOut: function elasticInOut(k) {
    var s;
    var a = 0.1;
    var p = 0.4;

    if (k === 0) {
      return 0;
    }

    if (k === 1) {
      return 1;
    }

    if (!a || a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p * mathAsin(1 / a) / (2 * PI);
    }

    if ((k *= 2) < 1) {
      return -0.5 * (a * mathPow(2, 10 * (k -= 1)) * mathSin((k - s) * (2 * PI) / p));
    }

    return a * mathPow(2, -10 * (k -= 1)) * mathSin((k - s) * (2 * PI) / p) * 0.5 + 1;
  },
  // 在某一动画开始沿指示的路径进行动画处理前稍稍收回该动画的移动

  /**
  * @param {Number} k
  * @return {Number}
  */
  backIn: function backIn(k) {
    var s = 1.70158;
    return k * k * ((s + 1) * k - s);
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  backOut: function backOut(k) {
    var s = 1.70158;
    return --k * k * ((s + 1) * k + s) + 1;
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  backInOut: function backInOut(k) {
    var s = 1.70158 * 1.525;

    if ((k *= 2) < 1) {
      return 0.5 * (k * k * ((s + 1) * k - s));
    }

    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
  },
  // 创建弹跳效果

  /**
  * @param {Number} k
  * @return {Number}
  */
  bounceIn: function bounceIn(k) {
    return 1 - easing.bounceOut(1 - k);
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  bounceOut: function bounceOut(k) {
    if (k < 1 / 2.75) {
      return 7.5625 * k * k;
    } else if (k < 2 / 2.75) {
      return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
    } else if (k < 2.5 / 2.75) {
      return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
    } else {
      return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
    }
  },

  /**
  * @param {Number} k
  * @return {Number}
  */
  bounceInOut: function bounceInOut(k) {
    if (k < 0.5) {
      return easing.bounceIn(k * 2) * 0.5;
    }

    return easing.bounceOut(k * 2 - 1) * 0.5 + 0.5;
  }
};
var _default = easing;
module.exports = _default;
}, function(modId) { var map = {"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598621, function(require, module, exports) {
var LRU = require("../LRU");

var _constants = require("../../graphic/constants");

var mathMin = _constants.mathMin;
var mathMax = _constants.mathMax;
var mathRound = _constants.mathRound;
var mathFloor = _constants.mathFloor;
var mathCeil = _constants.mathCeil;
var kCSSColorTable = {
  'transparent': [0, 0, 0, 0],
  'aliceblue': [240, 248, 255, 1],
  'antiquewhite': [250, 235, 215, 1],
  'aqua': [0, 255, 255, 1],
  'aquamarine': [127, 255, 212, 1],
  'azure': [240, 255, 255, 1],
  'beige': [245, 245, 220, 1],
  'bisque': [255, 228, 196, 1],
  'black': [0, 0, 0, 1],
  'blanchedalmond': [255, 235, 205, 1],
  'blue': [0, 0, 255, 1],
  'blueviolet': [138, 43, 226, 1],
  'brown': [165, 42, 42, 1],
  'burlywood': [222, 184, 135, 1],
  'cadetblue': [95, 158, 160, 1],
  'chartreuse': [127, 255, 0, 1],
  'chocolate': [210, 105, 30, 1],
  'coral': [255, 127, 80, 1],
  'cornflowerblue': [100, 149, 237, 1],
  'cornsilk': [255, 248, 220, 1],
  'crimson': [220, 20, 60, 1],
  'cyan': [0, 255, 255, 1],
  'darkblue': [0, 0, 139, 1],
  'darkcyan': [0, 139, 139, 1],
  'darkgoldenrod': [184, 134, 11, 1],
  'darkgray': [169, 169, 169, 1],
  'darkgreen': [0, 100, 0, 1],
  'darkgrey': [169, 169, 169, 1],
  'darkkhaki': [189, 183, 107, 1],
  'darkmagenta': [139, 0, 139, 1],
  'darkolivegreen': [85, 107, 47, 1],
  'darkorange': [255, 140, 0, 1],
  'darkorchid': [153, 50, 204, 1],
  'darkred': [139, 0, 0, 1],
  'darksalmon': [233, 150, 122, 1],
  'darkseagreen': [143, 188, 143, 1],
  'darkslateblue': [72, 61, 139, 1],
  'darkslategray': [47, 79, 79, 1],
  'darkslategrey': [47, 79, 79, 1],
  'darkturquoise': [0, 206, 209, 1],
  'darkviolet': [148, 0, 211, 1],
  'deeppink': [255, 20, 147, 1],
  'deepskyblue': [0, 191, 255, 1],
  'dimgray': [105, 105, 105, 1],
  'dimgrey': [105, 105, 105, 1],
  'dodgerblue': [30, 144, 255, 1],
  'firebrick': [178, 34, 34, 1],
  'floralwhite': [255, 250, 240, 1],
  'forestgreen': [34, 139, 34, 1],
  'fuchsia': [255, 0, 255, 1],
  'gainsboro': [220, 220, 220, 1],
  'ghostwhite': [248, 248, 255, 1],
  'gold': [255, 215, 0, 1],
  'goldenrod': [218, 165, 32, 1],
  'gray': [128, 128, 128, 1],
  'green': [0, 128, 0, 1],
  'greenyellow': [173, 255, 47, 1],
  'grey': [128, 128, 128, 1],
  'honeydew': [240, 255, 240, 1],
  'hotpink': [255, 105, 180, 1],
  'indianred': [205, 92, 92, 1],
  'indigo': [75, 0, 130, 1],
  'ivory': [255, 255, 240, 1],
  'khaki': [240, 230, 140, 1],
  'lavender': [230, 230, 250, 1],
  'lavenderblush': [255, 240, 245, 1],
  'lawngreen': [124, 252, 0, 1],
  'lemonchiffon': [255, 250, 205, 1],
  'lightblue': [173, 216, 230, 1],
  'lightcoral': [240, 128, 128, 1],
  'lightcyan': [224, 255, 255, 1],
  'lightgoldenrodyellow': [250, 250, 210, 1],
  'lightgray': [211, 211, 211, 1],
  'lightgreen': [144, 238, 144, 1],
  'lightgrey': [211, 211, 211, 1],
  'lightpink': [255, 182, 193, 1],
  'lightsalmon': [255, 160, 122, 1],
  'lightseagreen': [32, 178, 170, 1],
  'lightskyblue': [135, 206, 250, 1],
  'lightslategray': [119, 136, 153, 1],
  'lightslategrey': [119, 136, 153, 1],
  'lightsteelblue': [176, 196, 222, 1],
  'lightyellow': [255, 255, 224, 1],
  'lime': [0, 255, 0, 1],
  'limegreen': [50, 205, 50, 1],
  'linen': [250, 240, 230, 1],
  'magenta': [255, 0, 255, 1],
  'maroon': [128, 0, 0, 1],
  'mediumaquamarine': [102, 205, 170, 1],
  'mediumblue': [0, 0, 205, 1],
  'mediumorchid': [186, 85, 211, 1],
  'mediumpurple': [147, 112, 219, 1],
  'mediumseagreen': [60, 179, 113, 1],
  'mediumslateblue': [123, 104, 238, 1],
  'mediumspringgreen': [0, 250, 154, 1],
  'mediumturquoise': [72, 209, 204, 1],
  'mediumvioletred': [199, 21, 133, 1],
  'midnightblue': [25, 25, 112, 1],
  'mintcream': [245, 255, 250, 1],
  'mistyrose': [255, 228, 225, 1],
  'moccasin': [255, 228, 181, 1],
  'navajowhite': [255, 222, 173, 1],
  'navy': [0, 0, 128, 1],
  'oldlace': [253, 245, 230, 1],
  'olive': [128, 128, 0, 1],
  'olivedrab': [107, 142, 35, 1],
  'orange': [255, 165, 0, 1],
  'orangered': [255, 69, 0, 1],
  'orchid': [218, 112, 214, 1],
  'palegoldenrod': [238, 232, 170, 1],
  'palegreen': [152, 251, 152, 1],
  'paleturquoise': [175, 238, 238, 1],
  'palevioletred': [219, 112, 147, 1],
  'papayawhip': [255, 239, 213, 1],
  'peachpuff': [255, 218, 185, 1],
  'peru': [205, 133, 63, 1],
  'pink': [255, 192, 203, 1],
  'plum': [221, 160, 221, 1],
  'powderblue': [176, 224, 230, 1],
  'purple': [128, 0, 128, 1],
  'red': [255, 0, 0, 1],
  'rosybrown': [188, 143, 143, 1],
  'royalblue': [65, 105, 225, 1],
  'saddlebrown': [139, 69, 19, 1],
  'salmon': [250, 128, 114, 1],
  'sandybrown': [244, 164, 96, 1],
  'seagreen': [46, 139, 87, 1],
  'seashell': [255, 245, 238, 1],
  'sienna': [160, 82, 45, 1],
  'silver': [192, 192, 192, 1],
  'skyblue': [135, 206, 235, 1],
  'slateblue': [106, 90, 205, 1],
  'slategray': [112, 128, 144, 1],
  'slategrey': [112, 128, 144, 1],
  'snow': [255, 250, 250, 1],
  'springgreen': [0, 255, 127, 1],
  'steelblue': [70, 130, 180, 1],
  'tan': [210, 180, 140, 1],
  'teal': [0, 128, 128, 1],
  'thistle': [216, 191, 216, 1],
  'tomato': [255, 99, 71, 1],
  'turquoise': [64, 224, 208, 1],
  'violet': [238, 130, 238, 1],
  'wheat': [245, 222, 179, 1],
  'white': [255, 255, 255, 1],
  'whitesmoke': [245, 245, 245, 1],
  'yellow': [255, 255, 0, 1],
  'yellowgreen': [154, 205, 50, 1]
};

function clampCssByte(i) {
  // Clamp to integer 0 .. 255.
  i = mathRound(i); // Seems to be what Chrome does (vs truncation).

  return i < 0 ? 0 : i > 255 ? 255 : i;
}

function clampCssAngle(i) {
  // Clamp to integer 0 .. 360.
  i = mathRound(i); // Seems to be what Chrome does (vs truncation).

  return i < 0 ? 0 : i > 360 ? 360 : i;
}

function clampCssFloat(f) {
  // Clamp to float 0.0 .. 1.0.
  return f < 0 ? 0 : f > 1 ? 1 : f;
}

function parseCssInt(str) {
  // int or percentage.
  if (str.length && str.charAt(str.length - 1) === '%') {
    return clampCssByte(parseFloat(str) / 100 * 255);
  }

  return clampCssByte(parseInt(str, 10));
}

function parseCssFloat(str) {
  // float or percentage.
  if (str.length && str.charAt(str.length - 1) === '%') {
    return clampCssFloat(parseFloat(str) / 100);
  }

  return clampCssFloat(parseFloat(str));
}

function cssHueToRgb(m1, m2, h) {
  if (h < 0) {
    h += 1;
  } else if (h > 1) {
    h -= 1;
  }

  if (h * 6 < 1) {
    return m1 + (m2 - m1) * h * 6;
  }

  if (h * 2 < 1) {
    return m2;
  }

  if (h * 3 < 2) {
    return m1 + (m2 - m1) * (2 / 3 - h) * 6;
  }

  return m1;
}

function lerpNumber(a, b, p) {
  return a + (b - a) * p;
}

function setRgba(out, r, g, b, a) {
  out[0] = r;
  out[1] = g;
  out[2] = b;
  out[3] = a;
  return out;
}

function copyRgba(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

var colorCache = new LRU(20);
var lastRemovedArr = null;

function putToCache(colorStr, rgbaArr) {
  // Reuse removed array
  if (lastRemovedArr) {
    copyRgba(lastRemovedArr, rgbaArr);
  }

  lastRemovedArr = colorCache.put(colorStr, lastRemovedArr || rgbaArr.slice());
}
/**
 * @param {String} colorStr
 * @param {Array<Number>} out
 * @return {Array<Number>}
 */


function parse(colorStr, rgbaArr) {
  if (!colorStr) {
    return;
  }

  rgbaArr = rgbaArr || [];
  var cached = colorCache.get(colorStr);

  if (cached) {
    return copyRgba(rgbaArr, cached);
  } // colorStr may be not string


  colorStr = colorStr + ''; // Remove all whitespace, not compliant, but should just be more accepting.

  var str = colorStr.replace(/ /g, '').toLowerCase(); // Color keywords (and transparent) lookup.

  if (str in kCSSColorTable) {
    copyRgba(rgbaArr, kCSSColorTable[str]);
    putToCache(colorStr, rgbaArr);
    return rgbaArr;
  } // #abc and #abc123 syntax.


  if (str.charAt(0) === '#') {
    if (str.length === 4) {
      var iv = parseInt(str.substr(1), 16); // TODO(deanm): Stricter parsing.

      if (!(iv >= 0 && iv <= 0xfff)) {
        setRgba(rgbaArr, 0, 0, 0, 1);
        return; // Covers NaN.
      }

      setRgba(rgbaArr, (iv & 0xf00) >> 4 | (iv & 0xf00) >> 8, iv & 0xf0 | (iv & 0xf0) >> 4, iv & 0xf | (iv & 0xf) << 4, 1);
      putToCache(colorStr, rgbaArr);
      return rgbaArr;
    } else if (str.length === 7) {
      var iv = parseInt(str.substr(1), 16); // TODO(deanm): Stricter parsing.

      if (!(iv >= 0 && iv <= 0xffffff)) {
        setRgba(rgbaArr, 0, 0, 0, 1);
        return; // Covers NaN.
      }

      setRgba(rgbaArr, (iv & 0xff0000) >> 16, (iv & 0xff00) >> 8, iv & 0xff, 1);
      putToCache(colorStr, rgbaArr);
      return rgbaArr;
    }

    return;
  }

  var op = str.indexOf('(');
  var ep = str.indexOf(')');

  if (op !== -1 && ep + 1 === str.length) {
    var fname = str.substr(0, op);
    var params = str.substr(op + 1, ep - (op + 1)).split(',');
    var alpha = 1; // To allow case fallthrough.

    switch (fname) {
      case 'rgba':
        if (params.length !== 4) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }

        alpha = parseCssFloat(params.pop());
      // jshint ignore:line
      // Fall through.

      case 'rgb':
        if (params.length !== 3) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }

        setRgba(rgbaArr, parseCssInt(params[0]), parseCssInt(params[1]), parseCssInt(params[2]), alpha);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;

      case 'hsla':
        if (params.length !== 4) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }

        params[3] = parseCssFloat(params[3]);
        hsla2rgba(params, rgbaArr);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;

      case 'hsl':
        if (params.length !== 3) {
          setRgba(rgbaArr, 0, 0, 0, 1);
          return;
        }

        hsla2rgba(params, rgbaArr);
        putToCache(colorStr, rgbaArr);
        return rgbaArr;

      default:
        return;
    }
  }

  setRgba(rgbaArr, 0, 0, 0, 1);
  return;
}
/**
 * @param {Array<Number>} hsla
 * @param {Array<Number>} rgba
 * @return {Array<Number>} rgba
 */


function hsla2rgba(hsla, rgba) {
  var h = (parseFloat(hsla[0]) % 360 + 360) % 360 / 360; // 0 .. 1
  // NOTE(deanm): According to the CSS spec s/l should only be
  // percentages, but we don't bother and let float or percentage.

  var s = parseCssFloat(hsla[1]);
  var l = parseCssFloat(hsla[2]);
  var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
  var m1 = l * 2 - m2;
  rgba = rgba || [];
  setRgba(rgba, clampCssByte(cssHueToRgb(m1, m2, h + 1 / 3) * 255), clampCssByte(cssHueToRgb(m1, m2, h) * 255), clampCssByte(cssHueToRgb(m1, m2, h - 1 / 3) * 255), 1);

  if (hsla.length === 4) {
    rgba[3] = hsla[3];
  }

  return rgba;
}
/**
 * @param {Array<Number>} rgba
 * @return {Array<Number>} hsla
 */


function rgba2hsla(rgba) {
  if (!rgba) {
    return;
  } // RGB from 0 to 255


  var R = rgba[0] / 255;
  var G = rgba[1] / 255;
  var B = rgba[2] / 255;
  var vMin = mathMin(R, G, B); // Min. value of RGB

  var vMax = mathMax(R, G, B); // Max. value of RGB

  var delta = vMax - vMin; // Delta RGB value

  var L = (vMax + vMin) / 2;
  var H;
  var S; // HSL results from 0 to 1

  if (delta === 0) {
    H = 0;
    S = 0;
  } else {
    if (L < 0.5) {
      S = delta / (vMax + vMin);
    } else {
      S = delta / (2 - vMax - vMin);
    }

    var deltaR = ((vMax - R) / 6 + delta / 2) / delta;
    var deltaG = ((vMax - G) / 6 + delta / 2) / delta;
    var deltaB = ((vMax - B) / 6 + delta / 2) / delta;

    if (R === vMax) {
      H = deltaB - deltaG;
    } else if (G === vMax) {
      H = 1 / 3 + deltaR - deltaB;
    } else if (B === vMax) {
      H = 2 / 3 + deltaG - deltaR;
    }

    if (H < 0) {
      H += 1;
    }

    if (H > 1) {
      H -= 1;
    }
  }

  var hsla = [H * 360, S, L];

  if (rgba[3] != null) {
    hsla.push(rgba[3]);
  }

  return hsla;
}
/**
 * @param {String} color
 * @param {Number} level
 * @return {String}
 */


function lift(color, level) {
  var colorArr = parse(color);

  if (colorArr) {
    for (var i = 0; i < 3; i++) {
      if (level < 0) {
        colorArr[i] = colorArr[i] * (1 - level) | 0;
      } else {
        colorArr[i] = (255 - colorArr[i]) * level + colorArr[i] | 0;
      }

      if (colorArr[i] > 255) {
        colorArr[i] = 255;
      } else if (color[i] < 0) {
        colorArr[i] = 0;
      }
    }

    return stringify(colorArr, colorArr.length === 4 ? 'rgba' : 'rgb');
  }
}
/**
 * @param {String} color
 * @return {String}
 */


function toHex(color) {
  var colorArr = parse(color);

  if (colorArr) {
    return ((1 << 24) + (colorArr[0] << 16) + (colorArr[1] << 8) + +colorArr[2]).toString(16).slice(1);
  }
}
/**
 * Map value to color. Faster than lerp methods because color is represented by rgba array.
 * @param {Number} normalizedValue A float between 0 and 1.
 * @param {Array<Array.<Number>>} colors List of rgba color array
 * @param {Array<Number>} [out] Mapped gba color array
 * @return {Array<Number>} will be null/undefined if input illegal.
 */


function fastLerp(normalizedValue, colors, out) {
  if (!(colors && colors.length) || !(normalizedValue >= 0 && normalizedValue <= 1)) {
    return;
  }

  out = out || [];
  var value = normalizedValue * (colors.length - 1);
  var leftIndex = mathFloor(value);
  var rightIndex = mathCeil(value);
  var leftColor = colors[leftIndex];
  var rightColor = colors[rightIndex];
  var dv = value - leftIndex;
  out[0] = clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv));
  out[1] = clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv));
  out[2] = clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv));
  out[3] = clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv));
  return out;
}
/**
 * @deprecated
 */


var fastMapToColor = fastLerp;
/**
 * @param {Number} normalizedValue A float between 0 and 1.
 * @param {Array<String>} colors Color list.
 * @param {boolean=} fullOutput Default false.
 * @return {(string|Object)} Result color. If fullOutput,
 *                           return {color: ..., leftIndex: ..., rightIndex: ..., value: ...},
 */

function lerp(normalizedValue, colors, fullOutput) {
  if (!(colors && colors.length) || !(normalizedValue >= 0 && normalizedValue <= 1)) {
    return;
  }

  var value = normalizedValue * (colors.length - 1);
  var leftIndex = mathFloor(value);
  var rightIndex = mathCeil(value);
  var leftColor = parse(colors[leftIndex]);
  var rightColor = parse(colors[rightIndex]);
  var dv = value - leftIndex;
  var color = stringify([clampCssByte(lerpNumber(leftColor[0], rightColor[0], dv)), clampCssByte(lerpNumber(leftColor[1], rightColor[1], dv)), clampCssByte(lerpNumber(leftColor[2], rightColor[2], dv)), clampCssFloat(lerpNumber(leftColor[3], rightColor[3], dv))], 'rgba');
  return fullOutput ? {
    color: color,
    leftIndex: leftIndex,
    rightIndex: rightIndex,
    value: value
  } : color;
}
/**
 * @deprecated
 */


var mapToColor = lerp;
/**
 * @param {String} color
 * @param {number=} h 0 ~ 360, ignore when null.
 * @param {number=} s 0 ~ 1, ignore when null.
 * @param {number=} l 0 ~ 1, ignore when null.
 * @return {String} Color string in rgba format.
 */

function modifyHSL(color, h, s, l) {
  color = parse(color);

  if (color) {
    color = rgba2hsla(color);
    h != null && (color[0] = clampCssAngle(h));
    s != null && (color[1] = parseCssFloat(s));
    l != null && (color[2] = parseCssFloat(l));
    return stringify(hsla2rgba(color), 'rgba');
  }
}
/**
 * @param {String} color
 * @param {number=} alpha 0 ~ 1
 * @return {String} Color string in rgba format.
 */


function modifyAlpha(color, alpha) {
  color = parse(color);

  if (color && alpha != null) {
    color[3] = clampCssFloat(alpha);
    return stringify(color, 'rgba');
  }
}
/**
 * @param {Array<Number>} arrColor like [12,33,44,0.4]
 * @param {String} type 'rgba', 'hsva', ...
 * @return {String} Result color. (If input illegal, return undefined).
 */


function stringify(arrColor, type) {
  if (!arrColor || !arrColor.length) {
    return;
  }

  var colorStr = arrColor[0] + ',' + arrColor[1] + ',' + arrColor[2];

  if (type === 'rgba' || type === 'hsva' || type === 'hsla') {
    colorStr += ',' + arrColor[3];
  }

  return type + '(' + colorStr + ')';
}

exports.parse = parse;
exports.lift = lift;
exports.toHex = toHex;
exports.fastLerp = fastLerp;
exports.fastMapToColor = fastMapToColor;
exports.lerp = lerp;
exports.mapToColor = mapToColor;
exports.modifyHSL = modifyHSL;
exports.modifyAlpha = modifyAlpha;
exports.stringify = stringify;
}, function(modId) { var map = {"../LRU":1582161598622,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598622, function(require, module, exports) {
// Simple LRU cache use doubly linked list

/**
 * Simple double linked list. Compared with array, it has O(1) remove operation.
 * @constructor
 */
var LinkedList = function LinkedList() {
  /**
   * @property {LRU~Entry}
   */
  this.head = null;
  /**
   * @property {LRU~Entry}
   */

  this.tail = null;
  this._len = 0;
};

var linkedListProto = LinkedList.prototype;
/**
 * Insert a new value at the tail
 * @param  {} val
 * @return {LRU~Entry}
 */

linkedListProto.insert = function (val) {
  var entry = new Entry(val);
  this.insertEntry(entry);
  return entry;
};
/**
 * Insert an entry at the tail
 * @param  {LRU~Entry} entry
 */


linkedListProto.insertEntry = function (entry) {
  if (!this.head) {
    this.head = this.tail = entry;
  } else {
    this.tail.next = entry;
    entry.prev = this.tail;
    entry.next = null;
    this.tail = entry;
  }

  this._len++;
};
/**
 * Remove entry.
 * @param  {LRU~Entry} entry
 */


linkedListProto.remove = function (entry) {
  var prev = entry.prev;
  var next = entry.next;

  if (prev) {
    prev.next = next;
  } else {
    // Is head
    this.head = next;
  }

  if (next) {
    next.prev = prev;
  } else {
    // Is tail
    this.tail = prev;
  }

  entry.next = entry.prev = null;
  this._len--;
};
/**
 * @return {Number}
 */


linkedListProto.len = function () {
  return this._len;
};
/**
 * Clear list
 */


linkedListProto.clear = function () {
  this.head = this.tail = null;
  this._len = 0;
};
/**
 * @constructor
 * @param {} val
 */


var Entry = function Entry(val) {
  /**
   * @property {}
   */
  this.value = val;
  /**
   * @property {LRU~Entry}
   */

  this.next;
  /**
   * @property {LRU~Entry}
   */

  this.prev;
};
/**
 * LRU Cache
 * @constructor
 * @alias LRU
 */


var LRU = function LRU(maxSize) {
  this._list = new LinkedList();
  this._map = {};
  this._maxSize = maxSize || 10;
  this._lastRemovedEntry = null;
};

var LRUProto = LRU.prototype;
/**
 * @param  {String} key
 * @param  {} value
 * @return {} Removed value
 */

LRUProto.put = function (key, value) {
  var list = this._list;
  var map = this._map;
  var removed = null;

  if (map[key] == null) {
    var len = list.len(); // Reuse last removed entry

    var entry = this._lastRemovedEntry;

    if (len >= this._maxSize && len > 0) {
      // Remove the least recently used
      var leastUsedEntry = list.head;
      list.remove(leastUsedEntry);
      delete map[leastUsedEntry.key];
      removed = leastUsedEntry.value;
      this._lastRemovedEntry = leastUsedEntry;
    }

    if (entry) {
      entry.value = value;
    } else {
      entry = new Entry(value);
    }

    entry.key = key;
    list.insertEntry(entry);
    map[key] = entry;
  }

  return removed;
};
/**
 * @param  {String} key
 * @return {}
 */


LRUProto.get = function (key) {
  var entry = this._map[key];
  var list = this._list;

  if (entry != null) {
    // Put the latest used entry in the tail
    if (entry !== list.tail) {
      list.remove(entry);
      list.insertEntry(entry);
    }

    return entry.value;
  }
};
/**
 * Clear the cache
 */


LRUProto.clear = function () {
  this._list.clear();

  this._map = {};
};

var _default = LRU;
module.exports = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598623, function(require, module, exports) {
var vec2 = require("../../core/utils/vector");

var matrix = require("../../core/utils/matrix");

var _constants = require("../constants");

var mathMin = _constants.mathMin;
var mathMax = _constants.mathMax;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.core.BoundingRect
 * 
 * Bounding Rect.
 * 
 * 边界矩形。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var v2ApplyTransform = vec2.applyTransform;
var lt = [];
var rb = [];
var lb = [];
var rt = [];

var BoundingRect =
/*#__PURE__*/
function () {
  /**
   * @method constructor BoundingRect
   */
  function BoundingRect(x, y, width, height) {
    _classCallCheck(this, BoundingRect);

    if (width < 0) {
      x = x + width;
      width = -width;
    }

    if (height < 0) {
      y = y + height;
      height = -height;
    }
    /**
     * @property {Number}
     */


    this.x = x;
    /**
     * @property {Number}
     */

    this.y = y;
    /**
     * @property {Number}
     */

    this.width = width;
    /**
     * @property {Number}
     */

    this.height = height;
  }
  /**
   * @param {Object|BoundingRect} rect
   * @param {Number} rect.x
   * @param {Number} rect.y
   * @param {Number} rect.width
   * @param {Number} rect.height
   * @return {BoundingRect}
   */


  _createClass(BoundingRect, [{
    key: "union",

    /**
     * @method union
     * @param {BoundingRect} other
     */
    value: function union(other) {
      var x = mathMin(other.x, this.x);
      var y = mathMin(other.y, this.y);
      this.width = mathMax(other.x + other.width, this.x + this.width) - x;
      this.height = mathMax(other.y + other.height, this.y + this.height) - y;
      this.x = x;
      this.y = y;
    }
    /**
     * @method applyTransform
     * @param {Array<Number>}
     */

  }, {
    key: "applyTransform",
    value: function applyTransform(m) {
      // In case usage like this
      // el.getBoundingRect().applyTransform(el.transform)
      // And element has no transform
      if (!m) {
        return;
      }

      lt[0] = lb[0] = this.x;
      lt[1] = rt[1] = this.y;
      rb[0] = rt[0] = this.x + this.width;
      rb[1] = lb[1] = this.y + this.height;
      v2ApplyTransform(lt, lt, m);
      v2ApplyTransform(rb, rb, m);
      v2ApplyTransform(lb, lb, m);
      v2ApplyTransform(rt, rt, m);
      this.x = mathMin(lt[0], rb[0], lb[0], rt[0]);
      this.y = mathMin(lt[1], rb[1], lb[1], rt[1]);
      var maxX = mathMax(lt[0], rb[0], lb[0], rt[0]);
      var maxY = mathMax(lt[1], rb[1], lb[1], rt[1]);
      this.width = maxX - this.x;
      this.height = maxY - this.y;
    }
    /**
     * @method calculateTransform
     * Calculate matrix of transforming from self to target rect
     * @param  {BoundingRect} b
     * @return {Array<Number>}
     */

  }, {
    key: "calculateTransform",
    value: function calculateTransform(b) {
      var a = this;
      var sx = b.width / a.width;
      var sy = b.height / a.height;
      var m = matrix.create(); // 矩阵右乘

      matrix.translate(m, m, [-a.x, -a.y]);
      matrix.scale(m, m, [sx, sy]);
      matrix.translate(m, m, [b.x, b.y]);
      return m;
    }
    /**
     * @method intersect
     * @param {(BoundingRect|Object)} b
     * @return {boolean}
     */

  }, {
    key: "intersect",
    value: function intersect(b) {
      if (!b) {
        return false;
      }

      if (!(b instanceof BoundingRect)) {
        // Normalize negative width/height.
        b = BoundingRect.create(b);
      }

      var a = this;
      var ax0 = a.x;
      var ax1 = a.x + a.width;
      var ay0 = a.y;
      var ay1 = a.y + a.height;
      var bx0 = b.x;
      var bx1 = b.x + b.width;
      var by0 = b.y;
      var by1 = b.y + b.height;
      return !(ax1 < bx0 || bx1 < ax0 || ay1 < by0 || by1 < ay0);
    }
    /**
     * @method contain
     * @param {*} x 
     * @param {*} y 
     */

  }, {
    key: "contain",
    value: function contain(x, y) {
      var rect = this;
      return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
    }
    /**
     * @method clone
     * @return {BoundingRect}
     */

  }, {
    key: "clone",
    value: function clone() {
      return new BoundingRect(this.x, this.y, this.width, this.height);
    }
    /**
     * @method copy
     * Copy from another rect
     * @param other
     */

  }, {
    key: "copy",
    value: function copy(other) {
      this.x = other.x;
      this.y = other.y;
      this.width = other.width;
      this.height = other.height;
    }
    /**
     * @method plain
     */

  }, {
    key: "plain",
    value: function plain() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    }
  }], [{
    key: "create",
    value: function create(rect) {
      return new BoundingRect(rect.x, rect.y, rect.width, rect.height);
    }
  }]);

  return BoundingRect;
}();

var _default = BoundingRect;
module.exports = _default;
}, function(modId) { var map = {"../../core/utils/vector":1582161598605,"../../core/utils/matrix":1582161598615,"../constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598624, function(require, module, exports) {
// https://github.com/mziccard/node-timsort
var DEFAULT_MIN_MERGE = 32;
var DEFAULT_MIN_GALLOPING = 7;
var DEFAULT_TMP_STORAGE_LENGTH = 256;

function minRunLength(n) {
  var r = 0;

  while (n >= DEFAULT_MIN_MERGE) {
    r |= n & 1;
    n >>= 1;
  }

  return n + r;
}

function makeAscendingRun(array, lo, hi, compare) {
  var runHi = lo + 1;

  if (runHi === hi) {
    return 1;
  }

  if (compare(array[runHi++], array[lo]) < 0) {
    while (runHi < hi && compare(array[runHi], array[runHi - 1]) < 0) {
      runHi++;
    }

    reverseRun(array, lo, runHi);
  } else {
    while (runHi < hi && compare(array[runHi], array[runHi - 1]) >= 0) {
      runHi++;
    }
  }

  return runHi - lo;
}

function reverseRun(array, lo, hi) {
  hi--;

  while (lo < hi) {
    var t = array[lo];
    array[lo++] = array[hi];
    array[hi--] = t;
  }
}

function binaryInsertionSort(array, lo, hi, start, compare) {
  if (start === lo) {
    start++;
  }

  for (; start < hi; start++) {
    var pivot = array[start];
    var left = lo;
    var right = start;
    var mid;

    while (left < right) {
      mid = left + right >>> 1;

      if (compare(pivot, array[mid]) < 0) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    var n = start - left;

    switch (n) {
      case 3:
        array[left + 3] = array[left + 2];

      case 2:
        array[left + 2] = array[left + 1];

      case 1:
        array[left + 1] = array[left];
        break;

      default:
        while (n > 0) {
          array[left + n] = array[left + n - 1];
          n--;
        }

    }

    array[left] = pivot;
  }
}

function gallopLeft(value, array, start, length, hint, compare) {
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;

  if (compare(value, array[start + hint]) > 0) {
    maxOffset = length - hint;

    while (offset < maxOffset && compare(value, array[start + hint + offset]) > 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    lastOffset += hint;
    offset += hint;
  } else {
    maxOffset = hint + 1;

    while (offset < maxOffset && compare(value, array[start + hint - offset]) <= 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    var tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;
  }

  lastOffset++;

  while (lastOffset < offset) {
    var m = lastOffset + (offset - lastOffset >>> 1);

    if (compare(value, array[start + m]) > 0) {
      lastOffset = m + 1;
    } else {
      offset = m;
    }
  }

  return offset;
}

function gallopRight(value, array, start, length, hint, compare) {
  var lastOffset = 0;
  var maxOffset = 0;
  var offset = 1;

  if (compare(value, array[start + hint]) < 0) {
    maxOffset = hint + 1;

    while (offset < maxOffset && compare(value, array[start + hint - offset]) < 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    var tmp = lastOffset;
    lastOffset = hint - offset;
    offset = hint - tmp;
  } else {
    maxOffset = length - hint;

    while (offset < maxOffset && compare(value, array[start + hint + offset]) >= 0) {
      lastOffset = offset;
      offset = (offset << 1) + 1;

      if (offset <= 0) {
        offset = maxOffset;
      }
    }

    if (offset > maxOffset) {
      offset = maxOffset;
    }

    lastOffset += hint;
    offset += hint;
  }

  lastOffset++;

  while (lastOffset < offset) {
    var m = lastOffset + (offset - lastOffset >>> 1);

    if (compare(value, array[start + m]) < 0) {
      offset = m;
    } else {
      lastOffset = m + 1;
    }
  }

  return offset;
}

function TimSort(array, compare) {
  var minGallop = DEFAULT_MIN_GALLOPING;
  var length = 0;
  var tmpStorageLength = DEFAULT_TMP_STORAGE_LENGTH;
  var stackLength = 0;
  var runStart;
  var runLength;
  var stackSize = 0;
  length = array.length;

  if (length < 2 * DEFAULT_TMP_STORAGE_LENGTH) {
    tmpStorageLength = length >>> 1;
  }

  var tmp = [];
  stackLength = length < 120 ? 5 : length < 1542 ? 10 : length < 119151 ? 19 : 40;
  runStart = [];
  runLength = [];

  function pushRun(_runStart, _runLength) {
    runStart[stackSize] = _runStart;
    runLength[stackSize] = _runLength;
    stackSize += 1;
  }

  function mergeRuns() {
    while (stackSize > 1) {
      var n = stackSize - 2;

      if (n >= 1 && runLength[n - 1] <= runLength[n] + runLength[n + 1] || n >= 2 && runLength[n - 2] <= runLength[n] + runLength[n - 1]) {
        if (runLength[n - 1] < runLength[n + 1]) {
          n--;
        }
      } else if (runLength[n] > runLength[n + 1]) {
        break;
      }

      mergeAt(n);
    }
  }

  function forceMergeRuns() {
    while (stackSize > 1) {
      var n = stackSize - 2;

      if (n > 0 && runLength[n - 1] < runLength[n + 1]) {
        n--;
      }

      mergeAt(n);
    }
  }

  function mergeAt(i) {
    var start1 = runStart[i];
    var length1 = runLength[i];
    var start2 = runStart[i + 1];
    var length2 = runLength[i + 1];
    runLength[i] = length1 + length2;

    if (i === stackSize - 3) {
      runStart[i + 1] = runStart[i + 2];
      runLength[i + 1] = runLength[i + 2];
    }

    stackSize--;
    var k = gallopRight(array[start2], array, start1, length1, 0, compare);
    start1 += k;
    length1 -= k;

    if (length1 === 0) {
      return;
    }

    length2 = gallopLeft(array[start1 + length1 - 1], array, start2, length2, length2 - 1, compare);

    if (length2 === 0) {
      return;
    }

    if (length1 <= length2) {
      mergeLow(start1, length1, start2, length2);
    } else {
      mergeHigh(start1, length1, start2, length2);
    }
  }

  function mergeLow(start1, length1, start2, length2) {
    var i = 0;

    for (i = 0; i < length1; i++) {
      tmp[i] = array[start1 + i];
    }

    var cursor1 = 0;
    var cursor2 = start2;
    var dest = start1;
    array[dest++] = array[cursor2++];

    if (--length2 === 0) {
      for (i = 0; i < length1; i++) {
        array[dest + i] = tmp[cursor1 + i];
      }

      return;
    }

    if (length1 === 1) {
      for (i = 0; i < length2; i++) {
        array[dest + i] = array[cursor2 + i];
      }

      array[dest + length2] = tmp[cursor1];
      return;
    }

    var _minGallop = minGallop;
    var count1;
    var count2;
    var exit;

    while (1) {
      count1 = 0;
      count2 = 0;
      exit = false;

      do {
        if (compare(array[cursor2], tmp[cursor1]) < 0) {
          array[dest++] = array[cursor2++];
          count2++;
          count1 = 0;

          if (--length2 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest++] = tmp[cursor1++];
          count1++;
          count2 = 0;

          if (--length1 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < _minGallop);

      if (exit) {
        break;
      }

      do {
        count1 = gallopRight(array[cursor2], tmp, cursor1, length1, 0, compare);

        if (count1 !== 0) {
          for (i = 0; i < count1; i++) {
            array[dest + i] = tmp[cursor1 + i];
          }

          dest += count1;
          cursor1 += count1;
          length1 -= count1;

          if (length1 <= 1) {
            exit = true;
            break;
          }
        }

        array[dest++] = array[cursor2++];

        if (--length2 === 0) {
          exit = true;
          break;
        }

        count2 = gallopLeft(tmp[cursor1], array, cursor2, length2, 0, compare);

        if (count2 !== 0) {
          for (i = 0; i < count2; i++) {
            array[dest + i] = array[cursor2 + i];
          }

          dest += count2;
          cursor2 += count2;
          length2 -= count2;

          if (length2 === 0) {
            exit = true;
            break;
          }
        }

        array[dest++] = tmp[cursor1++];

        if (--length1 === 1) {
          exit = true;
          break;
        }

        _minGallop--;
      } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

      if (exit) {
        break;
      }

      if (_minGallop < 0) {
        _minGallop = 0;
      }

      _minGallop += 2;
    }

    minGallop = _minGallop;
    minGallop < 1 && (minGallop = 1);

    if (length1 === 1) {
      for (i = 0; i < length2; i++) {
        array[dest + i] = array[cursor2 + i];
      }

      array[dest + length2] = tmp[cursor1];
    } else if (length1 === 0) {
      throw new Error(); // throw new Error('mergeLow preconditions were not respected');
    } else {
      for (i = 0; i < length1; i++) {
        array[dest + i] = tmp[cursor1 + i];
      }
    }
  }

  function mergeHigh(start1, length1, start2, length2) {
    var i = 0;

    for (i = 0; i < length2; i++) {
      tmp[i] = array[start2 + i];
    }

    var cursor1 = start1 + length1 - 1;
    var cursor2 = length2 - 1;
    var dest = start2 + length2 - 1;
    var customCursor = 0;
    var customDest = 0;
    array[dest--] = array[cursor1--];

    if (--length1 === 0) {
      customCursor = dest - (length2 - 1);

      for (i = 0; i < length2; i++) {
        array[customCursor + i] = tmp[i];
      }

      return;
    }

    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;

      for (i = length1 - 1; i >= 0; i--) {
        array[customDest + i] = array[customCursor + i];
      }

      array[dest] = tmp[cursor2];
      return;
    }

    var _minGallop = minGallop;

    while (true) {
      var count1 = 0;
      var count2 = 0;
      var exit = false;

      do {
        if (compare(tmp[cursor2], array[cursor1]) < 0) {
          array[dest--] = array[cursor1--];
          count1++;
          count2 = 0;

          if (--length1 === 0) {
            exit = true;
            break;
          }
        } else {
          array[dest--] = tmp[cursor2--];
          count2++;
          count1 = 0;

          if (--length2 === 1) {
            exit = true;
            break;
          }
        }
      } while ((count1 | count2) < _minGallop);

      if (exit) {
        break;
      }

      do {
        count1 = length1 - gallopRight(tmp[cursor2], array, start1, length1, length1 - 1, compare);

        if (count1 !== 0) {
          dest -= count1;
          cursor1 -= count1;
          length1 -= count1;
          customDest = dest + 1;
          customCursor = cursor1 + 1;

          for (i = count1 - 1; i >= 0; i--) {
            array[customDest + i] = array[customCursor + i];
          }

          if (length1 === 0) {
            exit = true;
            break;
          }
        }

        array[dest--] = tmp[cursor2--];

        if (--length2 === 1) {
          exit = true;
          break;
        }

        count2 = length2 - gallopLeft(array[cursor1], tmp, 0, length2, length2 - 1, compare);

        if (count2 !== 0) {
          dest -= count2;
          cursor2 -= count2;
          length2 -= count2;
          customDest = dest + 1;
          customCursor = cursor2 + 1;

          for (i = 0; i < count2; i++) {
            array[customDest + i] = tmp[customCursor + i];
          }

          if (length2 <= 1) {
            exit = true;
            break;
          }
        }

        array[dest--] = array[cursor1--];

        if (--length1 === 0) {
          exit = true;
          break;
        }

        _minGallop--;
      } while (count1 >= DEFAULT_MIN_GALLOPING || count2 >= DEFAULT_MIN_GALLOPING);

      if (exit) {
        break;
      }

      if (_minGallop < 0) {
        _minGallop = 0;
      }

      _minGallop += 2;
    }

    minGallop = _minGallop;

    if (minGallop < 1) {
      minGallop = 1;
    }

    if (length2 === 1) {
      dest -= length1;
      cursor1 -= length1;
      customDest = dest + 1;
      customCursor = cursor1 + 1;

      for (i = length1 - 1; i >= 0; i--) {
        array[customDest + i] = array[customCursor + i];
      }

      array[dest] = tmp[cursor2];
    } else if (length2 === 0) {
      throw new Error(); // throw new Error('mergeHigh preconditions were not respected');
    } else {
      customCursor = dest - (length2 - 1);

      for (i = 0; i < length2; i++) {
        array[customCursor + i] = tmp[i];
      }
    }
  }

  this.mergeRuns = mergeRuns;
  this.forceMergeRuns = forceMergeRuns;
  this.pushRun = pushRun;
}

function sort(array, compare, lo, hi) {
  if (!lo) {
    lo = 0;
  }

  if (!hi) {
    hi = array.length;
  }

  var remaining = hi - lo;

  if (remaining < 2) {
    return;
  }

  var runLength = 0;

  if (remaining < DEFAULT_MIN_MERGE) {
    runLength = makeAscendingRun(array, lo, hi, compare);
    binaryInsertionSort(array, lo, hi, lo + runLength, compare);
    return;
  }

  var ts = new TimSort(array, compare);
  var minRun = minRunLength(remaining);

  do {
    runLength = makeAscendingRun(array, lo, hi, compare);

    if (runLength < minRun) {
      var force = remaining;

      if (force > minRun) {
        force = minRun;
      }

      binaryInsertionSort(array, lo, lo + force, lo + runLength, compare);
      runLength = force;
    }

    ts.pushRun(lo, runLength);
    ts.mergeRuns();
    remaining -= runLength;
    lo += runLength;
  } while (remaining !== 0);

  ts.forceMergeRuns();
}

module.exports = sort;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598625, function(require, module, exports) {
var requestAnimationFrame = require("./animation/utils/request_animation_frame");

var _config = require("./config");

var devicePixelRatio = _config.devicePixelRatio;

var dataUtil = require("./core/utils/data_structure_util");

var BoundingRect = require("./graphic/transform/BoundingRect");

var timsort = require("./core/utils/timsort");

var CanvasLayer = require("./CanvasLayer");

var Image = require("./graphic/Image");

var env = require("./core/env");

var _constants = require("./graphic/constants");

var mathRandom = _constants.mathRandom;
var mathMax = _constants.mathMax;

var canvasUtil = require("./core/utils/canvas_util");

var guid = require("./core/utils/guid");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.canvas.CanvasPainter
 * 这是基于 canvas 接口的 CanvasPainter 类
 * @see 基于 SVG 接口的 CanvasPainter 类在 svg 目录下
 */
var HOVER_LAYER_QLEVEL = 1e5;
var CANVAS_QLEVEL = 314159;
var EL_AFTER_INCREMENTAL_INC = 0.01;
var INCREMENTAL_INC = 0.001;

var CanvasPainter =
/*#__PURE__*/
function () {
  /**
   * @method constructor
   * @param {HTMLDomElement|Canvas|Context} host 
   * This can be a HTMLDomElement like a DIV, or a Canvas instance, 
   * or Context for Wechat mini-program.
   * 
   * 此属性可以是 HTMLDomElement ，比如 DIV 标签；也可以是 Canvas 实例；或者是 Context 实例，因为在某些
   * 运行环境中，不能获得 Canvas 实例的引用，只能获得 Context。
   * @param {Storage} storage
   * @param {Object} options
   */
  function CanvasPainter(host, storage) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, CanvasPainter);

    this.options = dataUtil.extend({}, options);
    /**
     * @property {String} type
     */

    this.type = 'canvas';
    /**
     * @property {Number} dpr
     */

    this.dpr = this.options.devicePixelRatio || devicePixelRatio;
    /**
     * @property {HTMLDomElement|Canvas|Context} host 
     * This can be a HTMLDomElement like a DIV, or a Canvas instance, 
     * or Context for Wechat mini-program.
     * 
     * 此属性可以是 HTMLDomElement ，比如 DIV 标签；也可以是 Canvas 实例；或者是 Context 实例，因为在某些
     * 运行环境中，不能获得 Canvas 实例的引用，只能获得 Context。
     */

    this.host = host; // There is no style attribute on element in nodejs.

    if (this.host.style) {
      this.host.style['-webkit-tap-highlight-color'] = 'transparent';
      this.host.style['-webkit-user-select'] = this.host.style['user-select'] = this.host.style['-webkit-touch-callout'] = 'none';
      host.innerHTML = '';
    }
    /**
     * @private
     * @property {HTMLDomElement|Canvas|Context} _host 
     * This can be a HTMLDomElement like a DIV, or a Canvas instance, 
     * or Context for Wechat mini-program. In browser environment, this._host is 
     * a div which is created by QuarkRenderer automaticly, 
     * in other environments, this._host equals this.host.
     * 
     * 此属性可以是 HTMLDomElement ，比如 DIV 标签；也可以是 Canvas 实例；或者是 Context 实例，因为在某些
     * 运行环境中，不能获得 Canvas 实例的引用，只能获得 Context。在浏览器环境中，this._host 是 QuarkRenderer
     * 自己自动创建的 div 层，在其它环境中，this._host 等于 this.root。
     */


    this._host = null;
    /**
     * @property {Storage} storage
     */

    this.storage = storage;
    /**
     * @property {Array<Number>}
     * @private
     */

    var qlevelList = this._qlevelList = [];
    /**
     * @private
     * @property {Object<String, CanvasLayer>} layers
     */

    var layers = this._layers = {};
    /**
     * @private
     * @property {Object<String, Object>} _layerConfig
     */

    this._layerConfig = {};
    /**
     * @private
     * @property _needsManuallyCompositing
     * qrenderer will do compositing when host is a canvas and have multiple zlevels.
     */

    this._needsManuallyCompositing = false;
    /**
     * @private
     * @property {CanvasLayer} _hoverlayer
     */

    this._hoverlayer = null;
    /**
     * @private
     * @property {Array} _hoverElements
     */

    this._hoverElements = [];
    this._tmpRect = new BoundingRect(0, 0, 0, 0);
    this._viewRect = new BoundingRect(0, 0, 0, 0);
    /**
     * @property {Boolean} _singleCanvas
     * In node environment using node-canvas
     * @private
     */

    this._singleCanvas = !this.host.nodeName || this.host.nodeName.toUpperCase() === 'CANVAS'; //The code below is used to compatible with various runtime environments like browser, node-canvas, and Wechat mini-program.

    if (this._singleCanvas) {
      var width = this.host.width;
      var height = this.host.height;

      if (this.options.width != null) {
        width = this.options.width;
      }

      if (this.options.height != null) {
        height = this.options.height;
      }

      this.dpr = this.options.devicePixelRatio || 1; // Use canvas width and height directly

      this.host.width = width * this.dpr;
      this.host.height = height * this.dpr;
      this._width = width;
      this._height = height; // Create layer if only one given canvas
      // Device can be specified to create a high dpi image.

      var mainLayer = new CanvasLayer(this.host, this._width, this._height, this.dpr);
      mainLayer.__builtin__ = true;
      mainLayer.initContext(); // FIXME Use canvas width and height
      // mainLayer.resize(width, height);

      layers[CANVAS_QLEVEL] = mainLayer;
      mainLayer.qlevel = CANVAS_QLEVEL; // Not use common qlevel.

      qlevelList.push(CANVAS_QLEVEL);
      this._host = this.host; // Here, this._host equals this.host.
    } else {
      this._width = this._getSize(0);
      this._height = this._getSize(1);
      var canvasContainer = this.createDomRoot( // Craete a new div inside the host element.
      this._width, this._height);
      this._host = canvasContainer; // In this case, this._host is different from this.host.

      this.host.appendChild(canvasContainer);
    }
  }
  /**
   * @method getHost
   * Do NOT use this method in Wechat mini-program, because we can not get HTMLElement 
   * nor canvas instance.
   * @return {HTMLDivElement}
   */


  _createClass(CanvasPainter, [{
    key: "getHost",
    value: function getHost() {
      return this._host;
    }
    /**
     * @method getViewportRootOffset
     * Do NOT use this method in Wechat mini-program, because we can not get HTMLElement 
     * nor canvas instance.
     * @return {Object}
     */

  }, {
    key: "getViewportRootOffset",
    value: function getViewportRootOffset() {
      var host = this.getHost();

      if (host) {
        return {
          offsetLeft: host.offsetLeft || 0,
          offsetTop: host.offsetTop || 0
        };
      }
    }
    /**
     * @method
     * 刷新
     * @param {Boolean} [paintAll=false] 是否强制绘制所有displayable
     */

  }, {
    key: "refresh",
    value: function refresh(paintAll) {
      var list = this.storage.getDisplayList(true);
      var qlevelList = this._qlevelList;
      this._redrawId = mathRandom();

      this._paintList(list, paintAll, this._redrawId); // Paint custum layers


      for (var i = 0; i < qlevelList.length; i++) {
        var z = qlevelList[i];
        var layer = this._layers[z];

        if (!layer.__builtin__ && layer.refresh) {
          var clearColor = i === 0 ? this._backgroundColor : null;
          layer.refresh(clearColor);
        }
      }

      this.refreshHover();
      return this;
    }
    /**
     * @method addHover
     * 
     * @param {*} el 
     * @param {*} hoverStyle 
     */

  }, {
    key: "addHover",
    value: function addHover(el, hoverStyle) {
      if (el.__hoverMir) {
        return;
      }

      var elMirror = new el.constructor({
        style: el.style,
        shape: el.shape,
        z: el.z,
        z2: el.z2,
        silent: el.silent
      });
      elMirror.__from = el;
      el.__hoverMir = elMirror;
      hoverStyle && elMirror.setStyle(hoverStyle);

      this._hoverElements.push(elMirror);

      return elMirror;
    }
    /**
     * @method removeHover
     * @param {*} el 
     */

  }, {
    key: "removeHover",
    value: function removeHover(el) {
      var elMirror = el.__hoverMir;
      var hoverElements = this._hoverElements;
      var idx = dataUtil.indexOf(hoverElements, elMirror);

      if (idx >= 0) {
        hoverElements.splice(idx, 1);
      }

      el.__hoverMir = null;
    }
    /**
     * @method clearHover
     * @param {*} el 
     */

  }, {
    key: "clearHover",
    value: function clearHover(el) {
      var hoverElements = this._hoverElements;

      for (var i = 0; i < hoverElements.length; i++) {
        var from = hoverElements[i].__from;

        if (from) {
          from.__hoverMir = null;
        }
      }

      hoverElements.length = 0;
    }
    /**
     * @method refreshHover
     */

  }, {
    key: "refreshHover",
    value: function refreshHover() {
      var hoverElements = this._hoverElements;
      var len = hoverElements.length;
      var hoverLayer = this._hoverlayer;
      hoverLayer && hoverLayer.clear();

      if (!len) {
        return;
      }

      timsort(hoverElements, this.storage.displayableSortFunc); // Use a extream large qlevel
      // FIXME?

      if (!hoverLayer) {
        hoverLayer = this._hoverlayer = this.getLayer(HOVER_LAYER_QLEVEL);
      }

      var scope = {};
      hoverLayer.ctx.save();

      for (var i = 0; i < len;) {
        var el = hoverElements[i];
        var originalEl = el.__from; // Original el is removed
        // PENDING

        if (!(originalEl && originalEl.__qr)) {
          hoverElements.splice(i, 1);
          originalEl.__hoverMir = null;
          len--;
          continue;
        }

        i++; // Use transform
        // FIXME style and shape ?

        if (!originalEl.invisible) {
          el.transform = originalEl.transform;
          el.invTransform = originalEl.invTransform;
          el.__clipPaths = originalEl.__clipPaths; // el.

          this._doPaintEl(el, hoverLayer, true, scope);
        }
      }

      hoverLayer.ctx.restore();
    }
    /**
     * @method getHoverLayer
     */

  }, {
    key: "getHoverLayer",
    value: function getHoverLayer() {
      return this.getLayer(HOVER_LAYER_QLEVEL);
    }
    /**
     * @method _paintList
     * @param {*} list 
     * @param {*} paintAll 
     * @param {*} redrawId 
     */

  }, {
    key: "_paintList",
    value: function _paintList(list, paintAll, redrawId) {
      //如果 redrawId 不一致，说明下一个动画帧已经到来，这里就会直接跳过去，相当于跳过了一帧
      if (this._redrawId !== redrawId) {
        return;
      }

      paintAll = paintAll || false;

      this._updateLayerStatus(list);

      var finished = this._doPaintList(list, paintAll);

      if (this._needsManuallyCompositing) {
        this._compositeManually();
      } //如果在一帧的时间内没有绘制完，在下一帧继续绘制。
      //当前本机的测试值，1000 个元素同时进行动画，可以在 16ms 的时间中绘制完成。


      if (!finished) {
        var self = this;
        requestAnimationFrame(function () {
          self._paintList(list, paintAll, redrawId);
        });
      }
    }
    /**
     * @method _compositeManually
     */

  }, {
    key: "_compositeManually",
    value: function _compositeManually() {
      var ctx = this.getLayer(CANVAS_QLEVEL).ctx;
      var width = this._host.width;
      var height = this._host.height;
      ctx.clearRect(0, 0, width, height); // PENDING, If only builtin layer?

      this.eachBuiltinLayer(function (layer) {
        if (layer.virtual) {
          ctx.drawImage(layer.canvasInstance, 0, 0, width, height);
        }
      });
    }
    /**
     * @method _doPaintList
     */

  }, {
    key: "_doPaintList",
    value: function _doPaintList(list, paintAll) {
      var layerList = [];

      for (var zi = 0; zi < this._qlevelList.length; zi++) {
        var qlevel = this._qlevelList[zi];
        var layer = this._layers[qlevel];

        if (layer.__builtin__ && layer !== this._hoverlayer && (layer.__dirty || paintAll)) {
          layerList.push(layer);
        }
      }

      var finished = true;

      for (var k = 0; k < layerList.length; k++) {
        var _layer = layerList[k];
        var ctx = _layer.ctx;
        var scope = {};
        ctx.save();
        var start = paintAll ? _layer.__startIndex : _layer.__drawIndex;
        var useTimer = !paintAll && _layer.incremental && Date.now;
        var startTime = useTimer && Date.now();
        var clearColor = _layer.qlevel === this._qlevelList[0] ? this._backgroundColor : null; // All elements in this layer are cleared.

        if (_layer.__startIndex === _layer.__endIndex) {
          _layer.clear(false, clearColor);
        } else if (start === _layer.__startIndex) {
          var firstEl = list[start];

          if (!firstEl.incremental || !firstEl.notClear || paintAll) {
            _layer.clear(false, clearColor);
          }
        }

        if (start === -1) {
          console.error('For some unknown reason. drawIndex is -1');
          start = _layer.__startIndex;
        }

        var i = start;

        for (; i < _layer.__endIndex; i++) {
          var el = list[i];

          this._doPaintEl(el, _layer, paintAll, scope);

          el.__dirty = el.__dirtyText = false;

          if (useTimer) {
            // Date.now can be executed in 13,025,305 ops/second.
            var dTime = Date.now() - startTime; // Give 15 millisecond to draw.
            // The rest elements will be drawn in the next frame.
            // 这里的时间计算非常重要，如果 15ms 的时间内没有能绘制完所有元素，则跳出，等待下一帧继续绘制
            // 但是 15ms 的时间依然是有限的，如果元素的数量非常巨大，例如有 1000 万个，还是会卡顿。

            if (dTime > 15) {
              break;
            }
          }
        }

        _layer.__drawIndex = i;

        if (_layer.__drawIndex < _layer.__endIndex) {
          finished = false;
        }

        if (scope.prevElClipPaths) {
          // Needs restore the state. If last drawn element is in the clipping area.
          ctx.restore();
        }

        ctx.restore();
      }

      if (env.wxa) {
        // Flush for weixin application
        dataUtil.each(this._layers, function (layer) {
          if (layer && layer.ctx && layer.ctx.draw) {
            layer.ctx.draw();
          }
        });
      }

      return finished;
    }
    /**
     * @method _doPaintEl
     * 绘制一个元素
     * @param {*} el 
     * @param {*} currentLayer 
     * @param {*} forcePaint 
     * @param {*} scope 
     */

  }, {
    key: "_doPaintEl",
    value: function _doPaintEl(el, currentLayer, forcePaint, scope) {
      var ctx = currentLayer.ctx;
      var m = el.transform;

      if ((currentLayer.__dirty || forcePaint) && // Ignore invisible element
      !el.invisible // Ignore transparent element
      && el.style.opacity !== 0 // Ignore scale 0 element, in some environment like node-canvas
      // Draw a scale 0 element can cause all following draw wrong
      // And setTransform with scale 0 will cause set back transform failed.
      && !(m && !m[0] && !m[3]) // Ignore culled element
      && !(el.culling && this.isDisplayableCulled(el, this._width, this._height))) {
        var clipPaths = el.__clipPaths;
        var prevElClipPaths = scope.prevElClipPaths; // Optimize when clipping on group with several elements

        if (!prevElClipPaths || this.isClipPathChanged(clipPaths, prevElClipPaths)) {
          // If has previous clipping state, restore from it
          if (prevElClipPaths) {
            ctx.restore();
            scope.prevElClipPaths = null; // Reset prevEl since context has been restored

            scope.prevEl = null;
          } // New clipping state


          if (clipPaths) {
            ctx.save();
            this.doClip(clipPaths, ctx);
            scope.prevElClipPaths = clipPaths;
          }
        }

        el.beforeBrush && el.beforeBrush(ctx);
        el.brush(ctx, scope.prevEl || null);
        scope.prevEl = el;
        el.afterBrush && el.afterBrush(ctx);
      }
    }
    /**
     * @method getLayer
     * 获取 qlevel 所在层，如果不存在则会创建一个新的层
     * @param {Number} qlevel
     * @param {Boolean} virtual Virtual layer will not be inserted into dom.
     * @return {CanvasLayer}
     */

  }, {
    key: "getLayer",
    value: function getLayer(qlevel, virtual) {
      if (this._singleCanvas && !this._needsManuallyCompositing) {
        qlevel = CANVAS_QLEVEL;
      }

      var layer = this._layers[qlevel];

      if (!layer) {
        // Create a new layer
        layer = new CanvasLayer('qr_' + qlevel, this._width, this._height, this.dpr);
        layer.qlevel = qlevel;
        layer.__builtin__ = true;

        if (this._layerConfig[qlevel]) {
          dataUtil.merge(layer, this._layerConfig[qlevel], true);
        }

        if (virtual) {
          layer.virtual = virtual;
        }

        this.insertLayer(qlevel, layer); // Context is created after dom inserted to document
        // Or excanvas will get 0px clientWidth and clientHeight

        layer.initContext();
      }

      return layer;
    }
    /**
     * @method insertLayer
     * Insert layer dynamicly during runtime.
     * Do NOT use this method in Wechat mini-program, because we can neither get HTMLElement 
     * nor canvas instance.
     * @param {*} qlevel 
     * @param {*} layer 
     */

  }, {
    key: "insertLayer",
    value: function insertLayer(qlevel, layer) {
      var layersMap = this._layers;
      var qlevelList = this._qlevelList;
      var len = qlevelList.length;
      var prevLayer = null;
      var i = -1;

      if (layersMap[qlevel]) {
        console.log('ZLevel ' + qlevel + ' has been used already');
        return;
      } // Check if is a valid layer


      if (!this.isLayerValid(layer)) {
        console.log('CanvasLayer of qlevel ' + qlevel + ' is not valid');
        return;
      }

      if (len > 0 && qlevel > qlevelList[0]) {
        for (i = 0; i < len - 1; i++) {
          if (qlevelList[i] < qlevel && qlevelList[i + 1] > qlevel) {
            break;
          }
        }

        prevLayer = layersMap[qlevelList[i]];
      }

      qlevelList.splice(i + 1, 0, qlevel);
      layersMap[qlevel] = layer; // Vitual layer will not directly show on the screen.
      // (It can be a WebGL layer and assigned to a ZImage element)
      // But it still under management of qrenderer.

      if (!layer.virtual) {
        if (prevLayer) {
          var prevDom = prevLayer.canvasInstance;

          if (prevDom.nextSibling) {
            this._host.insertBefore(layer.canvasInstance, prevDom.nextSibling);
          } else {
            this._host.appendChild(layer.canvasInstance);
          }
        } else {
          if (this._host.firstChild) {
            this._host.insertBefore(layer.canvasInstance, this._host.firstChild);
          } else {
            this._host.appendChild(layer.canvasInstance);
          }
        }
      }
    }
    /**
     * @method delLayer
     * 删除指定层
     * @param {Number} qlevel 层所在的zlevel
     */

  }, {
    key: "delLayer",
    value: function delLayer(qlevel) {
      var layers = this._layers;
      var qlevelList = this._qlevelList;
      var layer = layers[qlevel];

      if (!layer) {
        return;
      }

      if (layer.canvasInstance) {
        layer.canvasInstance.parentNode.removeChild(layer.canvasInstance);
      }

      delete layers[qlevel];
      qlevelList.splice(dataUtil.indexOf(qlevelList, qlevel), 1);
    }
    /**
     * @private
     * @method eachLayer
     * Iterate each layer
     * @param {Function} cb 
     * @param {Object} context 
     */

  }, {
    key: "eachLayer",
    value: function eachLayer(cb, context) {
      var qlevelList = this._qlevelList;
      var z;
      var i;

      for (i = 0; i < qlevelList.length; i++) {
        z = qlevelList[i];
        cb.call(context, this._layers[z], z);
      }
    }
    /**
     * @private
     * @method eachBuiltinLayer
     * Iterate each buildin layer
     * @param {Function} cb 
     * @param {Object} context 
     */

  }, {
    key: "eachBuiltinLayer",
    value: function eachBuiltinLayer(cb, context) {
      var qlevelList = this._qlevelList;
      var layer;
      var z;
      var i;

      for (i = 0; i < qlevelList.length; i++) {
        z = qlevelList[i];
        layer = this._layers[z];

        if (layer.__builtin__) {
          cb.call(context, layer, z);
        }
      }
    }
    /**
     * @private
     * @method eachOtherLayer
     * Iterate each other layer except buildin layer
     * @param {Function} cb 
     * @param {Object} context 
     */

  }, {
    key: "eachOtherLayer",
    value: function eachOtherLayer(cb, context) {
      var qlevelList = this._qlevelList;
      var layer;
      var z;
      var i;

      for (i = 0; i < qlevelList.length; i++) {
        z = qlevelList[i];
        layer = this._layers[z];

        if (!layer.__builtin__) {
          cb.call(context, layer, z);
        }
      }
    }
    /**
     * @method getLayers
     * 获取所有已创建的层
     * @param {Array<CanvasLayer>} [prevLayer]
     */

  }, {
    key: "getLayers",
    value: function getLayers() {
      return this._layers;
    }
    /**
     * @private
     * @method _updateLayerStatus
     * @param {*} list 
     */

  }, {
    key: "_updateLayerStatus",
    value: function _updateLayerStatus(list) {
      this.eachBuiltinLayer(function (layer, z) {
        layer.__dirty = layer.__used = false;
      });

      function updatePrevLayer(idx) {
        if (prevLayer) {
          if (prevLayer.__endIndex !== idx) {
            prevLayer.__dirty = true;
          }

          prevLayer.__endIndex = idx;
        }
      }

      if (this._singleCanvas) {
        for (var _i = 1; _i < list.length; _i++) {
          var el = list[_i];

          if (el.qlevel !== list[_i - 1].qlevel || el.incremental) {
            this._needsManuallyCompositing = true;
            break;
          }
        }
      }

      var prevLayer = null;
      var incrementalLayerCount = 0;
      var i = 0;

      for (; i < list.length; i++) {
        var _el = list[i];
        var qlevel = _el.qlevel;
        var layer = void 0; // PENDING If change one incremental element style ?
        // TODO Where there are non-incremental elements between incremental elements.

        if (_el.incremental) {
          layer = this.getLayer(qlevel + INCREMENTAL_INC, this._needsManuallyCompositing);
          layer.incremental = true;
          incrementalLayerCount = 1;
        } else {
          layer = this.getLayer(qlevel + (incrementalLayerCount > 0 ? EL_AFTER_INCREMENTAL_INC : 0), this._needsManuallyCompositing);
        }

        if (!layer.__builtin__) {
          console.log('ZLevel ' + qlevel + ' has been used by unkown layer ' + layer.id);
        }

        if (layer !== prevLayer) {
          layer.__used = true;

          if (layer.__startIndex !== i) {
            layer.__dirty = true;
          }

          layer.__startIndex = i;

          if (!layer.incremental) {
            layer.__drawIndex = i;
          } else {
            // Mark layer draw index needs to update.
            layer.__drawIndex = -1;
          }

          updatePrevLayer(i);
          prevLayer = layer;
        }

        if (_el.__dirty) {
          layer.__dirty = true;

          if (layer.incremental && layer.__drawIndex < 0) {
            // Start draw from the first dirty element.
            layer.__drawIndex = i;
          }
        }
      }

      updatePrevLayer(i);
      this.eachBuiltinLayer(function (layer, z) {
        // Used in last frame but not in this frame. Needs clear
        if (!layer.__used && layer.getElementCount() > 0) {
          layer.__dirty = true;
          layer.__startIndex = layer.__endIndex = layer.__drawIndex = 0;
        } // For incremental layer. In case start index changed and no elements are dirty.


        if (layer.__dirty && layer.__drawIndex < 0) {
          layer.__drawIndex = layer.__startIndex;
        }
      });
    }
    /**
     * @method clear
     * 清除hover层外所有内容
     */

  }, {
    key: "clear",
    value: function clear() {
      this.eachBuiltinLayer(this._clearLayer);
      return this;
    }
    /**
     * @private
     * @method _clearLayer
     */

  }, {
    key: "_clearLayer",
    value: function _clearLayer(layer) {
      layer.clear();
    }
    /**
     * @method setBackgroundColor
     */

  }, {
    key: "setBackgroundColor",
    value: function setBackgroundColor(backgroundColor) {
      this._backgroundColor = backgroundColor;
    }
    /**
     * @method configLayer
     * 修改指定zlevel的绘制参数
     *
     * @param {String} qlevel
     * @param {Object} [config] 配置对象
     * @param {String} [config.clearColor=0] 每次清空画布的颜色
     * @param {String} [config.motionBlur=false] 是否开启动态模糊
     * @param {Number} [config.lastFrameAlpha=0.7] 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
     */

  }, {
    key: "configLayer",
    value: function configLayer(qlevel, config) {
      if (config) {
        var layerConfig = this._layerConfig;

        if (!layerConfig[qlevel]) {
          layerConfig[qlevel] = config;
        } else {
          dataUtil.merge(layerConfig[qlevel], config, true);
        }

        for (var i = 0; i < this._qlevelList.length; i++) {
          var _zlevel = this._qlevelList[i];

          if (_zlevel === qlevel || _zlevel === qlevel + EL_AFTER_INCREMENTAL_INC) {
            var layer = this._layers[_zlevel];
            dataUtil.merge(layer, layerConfig[qlevel], true);
          }
        }
      }
    }
    /**
     * @method resize
     * 区域大小变化后重绘
     * @param {Number} width
     * @param {Number} height
     */

  }, {
    key: "resize",
    value: function resize(width, height) {
      if (!this._host.style) {
        // Maybe in node or worker or Wechat
        if (width == null || height == null) {
          return;
        }

        this._width = width;
        this._height = height;
        this.getLayer(CANVAS_QLEVEL).resize(width, height);
      } else {
        var domRoot = this._host;
        domRoot.style.display = 'none'; // Save input w/h

        var options = this.options;
        width != null && (options.width = width);
        height != null && (options.height = height);
        width = this._getSize(0);
        height = this._getSize(1);
        domRoot.style.display = ''; // 优化没有实际改变的resize

        if (this._width !== width || height !== this._height) {
          domRoot.style.width = width + 'px';
          domRoot.style.height = height + 'px';

          for (var id in this._layers) {
            if (this._layers.hasOwnProperty(id)) {
              this._layers[id].resize(width, height);
            }
          }

          dataUtil.each(this._progressiveLayers, function (layer) {
            layer.resize(width, height);
          });
          this.refresh(true);
        }

        this._width = width;
        this._height = height;
      }

      return this;
    }
    /**
     * @method clearLayer
     * 清除单独的一个层
     * @param {Number} qlevel
     */

  }, {
    key: "clearLayer",
    value: function clearLayer(qlevel) {
      var layer = this._layers[qlevel];

      if (layer) {
        layer.clear();
      }
    }
    /**
     * @method dispose
     * 释放
     */

  }, {
    key: "dispose",
    value: function dispose() {
      this.host.innerHTML = '';
      this.host = null;
      this.storage = null;
      this._host = null;
      this._layers = null;
    }
    /**
     * @method getRenderedCanvas
     * Get canvas which has all thing rendered.
     * Do NOT use this method in Wechat mini-program, because we can not get HTMLElement 
     * nor canvas instance.
     * @param {Object} [options]
     * @param {String} [options.backgroundColor]
     * @param {Number} [options.pixelRatio]
     */

  }, {
    key: "getRenderedCanvas",
    value: function getRenderedCanvas() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this._singleCanvas && !this._compositeManually) {
        return this._layers[CANVAS_QLEVEL].canvasInstance;
      }

      var imageLayer = new CanvasLayer('image', this._width, this._height, options.pixelRatio || this.dpr);
      imageLayer.initContext();
      imageLayer.clear(false, options.backgroundColor || this._backgroundColor);

      if (options.pixelRatio <= this.dpr) {
        this.refresh();
        var width = imageLayer.canvasInstance.width;
        var height = imageLayer.canvasInstance.height;
        var ctx = imageLayer.ctx;
        this.eachLayer(function (layer) {
          if (layer.__builtin__) {
            ctx.drawImage(layer.canvasInstance, 0, 0, width, height);
          } else if (layer.renderToCanvas) {
            imageLayer.ctx.save();
            layer.renderToCanvas(imageLayer.ctx);
            imageLayer.ctx.restore();
          }
        });
      } else {
        // PENDING, echarts-gl and incremental rendering.
        var scope = {};
        var displayList = this.storage.getDisplayList(true);

        for (var i = 0; i < displayList.length; i++) {
          var el = displayList[i];

          this._doPaintEl(el, imageLayer, true, scope);
        }
      }

      return imageLayer.canvasInstance;
    }
    /**
     * @method getWidth
     * 获取绘图区域宽度
     * @return {Number}
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      return this._width;
    }
    /**
     * @method getHeight
     * 获取绘图区域高度
     * @return {Number}
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      return this._height;
    }
    /**
     * @method _getSize
     * Do NOT use this method in Wechat mini-program, because we can not get HTMLElement 
     * nor canvas instance.
     * @param {*} whIdx 
     */

  }, {
    key: "_getSize",
    value: function _getSize(whIdx) {
      var options = this.options;
      var wh = ['width', 'height'][whIdx];
      var cwh = ['clientWidth', 'clientHeight'][whIdx];
      var plt = ['paddingLeft', 'paddingTop'][whIdx];
      var prb = ['paddingRight', 'paddingBottom'][whIdx];

      if (options[wh] != null && options[wh] !== 'auto') {
        return parseFloat(options[wh]);
      } // IE8 does not support getComputedStyle, but it use VML.


      var stl = document.defaultView.getComputedStyle(this.host);
      return (this.host[cwh] || dataUtil.parseInt10(stl[wh]) || dataUtil.parseInt10(this.host.style[wh])) - (dataUtil.parseInt10(stl[plt]) || 0) - (dataUtil.parseInt10(stl[prb]) || 0) | 0;
    }
    /**
     * @method pathToImage
     * @param {*} path 
     * @param {*} dpr 
     */

  }, {
    key: "pathToImage",
    value: function pathToImage(path, dpr) {
      dpr = dpr || this.dpr;
      var canvas = canvasUtil.createCanvas(); //创建隐藏的 canvas，在内存中。

      var ctx = canvasUtil.getContext(canvas);
      var rect = path.getBoundingRect();
      var style = path.style;
      var shadowBlurSize = style.shadowBlur * dpr;
      var shadowOffsetX = style.shadowOffsetX * dpr;
      var shadowOffsetY = style.shadowOffsetY * dpr;
      var lineWidth = style.hasStroke() ? style.lineWidth : 0;
      var leftMargin = mathMax(lineWidth / 2, -shadowOffsetX + shadowBlurSize);
      var rightMargin = mathMax(lineWidth / 2, shadowOffsetX + shadowBlurSize);
      var topMargin = mathMax(lineWidth / 2, -shadowOffsetY + shadowBlurSize);
      var bottomMargin = mathMax(lineWidth / 2, shadowOffsetY + shadowBlurSize);
      var width = rect.width + leftMargin + rightMargin;
      var height = rect.height + topMargin + bottomMargin;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      ctx.dpr = dpr;
      var pathTransform = {
        position: path.position,
        rotation: path.rotation,
        scale: path.scale
      };
      path.position = [leftMargin - rect.x, topMargin - rect.y];
      path.rotation = 0;
      path.scale = [1, 1];
      path.updateTransform();

      if (path) {
        path.brush(ctx);
      }

      var ImageShape = Image;
      var imgShape = new ImageShape({
        style: {
          x: 0,
          y: 0,
          image: canvas
        }
      });

      if (pathTransform.position != null) {
        imgShape.position = path.position = pathTransform.position;
      }

      if (pathTransform.rotation != null) {
        imgShape.rotation = path.rotation = pathTransform.rotation;
      }

      if (pathTransform.scale != null) {
        imgShape.scale = path.scale = pathTransform.scale;
      }

      return imgShape;
    }
    /**
     * @private
     * @method isLayerValid
     * @param {*} layer 
     */

  }, {
    key: "isLayerValid",
    value: function isLayerValid(layer) {
      if (!layer) {
        return false;
      }

      if (layer.__builtin__) {
        return true;
      }

      if (typeof layer.resize !== 'function' || typeof layer.refresh !== 'function') {
        return false;
      }

      return true;
    }
    /**
     * @private
     * @method isDisplayableCulled
     * @param {*} el 
     * @param {*} width 
     * @param {*} height 
     */

  }, {
    key: "isDisplayableCulled",
    value: function isDisplayableCulled(el, width, height) {
      this._tmpRect.copy(el.getBoundingRect());

      if (el.transform) {
        this._tmpRect.applyTransform(el.transform);
      }

      this._viewRect.width = width;
      this._viewRect.height = height;
      return !this._tmpRect.intersect(this._viewRect);
    }
    /**
     * @private
     * @method isClipPathChanged
     * @param {*} clipPaths 
     * @param {*} prevClipPaths 
     */

  }, {
    key: "isClipPathChanged",
    value: function isClipPathChanged(clipPaths, prevClipPaths) {
      // displayable.__clipPaths can only be `null`/`undefined` or an non-empty array.
      if (clipPaths === prevClipPaths) {
        return false;
      }

      if (!clipPaths || !prevClipPaths || clipPaths.length !== prevClipPaths.length) {
        return true;
      }

      for (var i = 0; i < clipPaths.length; i++) {
        if (clipPaths[i] !== prevClipPaths[i]) {
          return true;
        }
      }

      return false;
    }
    /**
     * @private
     * @method doClip
     * @param {*} clipPaths 
     * @param {*} ctx 
     */

  }, {
    key: "doClip",
    value: function doClip(clipPaths, ctx) {
      clipPaths.forEach(function (clipPath, index) {
        clipPath.setTransform(ctx);
        ctx.beginPath();
        clipPath.buildPath(ctx, clipPath.shape);
        ctx.clip();
        clipPath.restoreTransform(ctx);
      });
    }
    /**
     * @private
     * @method createDomRoot
     * 在浏览器环境中，不会直接在传入的 dom 节点内部创建 canvas 标签，而是再内嵌一层div。
     * 目的是加上一些必须的 CSS 样式，方便实现特定的功能。
     * @param {Number} width 
     * @param {Number} height 
     */

  }, {
    key: "createDomRoot",
    value: function createDomRoot(width, height) {
      var domRoot = document.createElement('div'); // IOS13 safari probably has a compositing bug (z order of the canvas and the consequent
      // dom does not act as expected) when some of the parent dom has
      // `-webkit-overflow-scrolling: touch;` and the webpage is longer than one screen and
      // the canvas is not at the top part of the page.
      // Check `https://bugs.webkit.org/show_bug.cgi?id=203681` for more details. We remove
      // this `overflow:hidden` to avoid the bug.
      // 'overflow:hidden',

      domRoot.style.cssText = ['position:relative', 'width:' + width + 'px', 'height:' + height + 'px', 'padding:0', 'margin:0', 'border-width:0'].join(';') + ';';
      return domRoot;
    }
  }]);

  return CanvasPainter;
}();

module.exports = CanvasPainter;
}, function(modId) { var map = {"./animation/utils/request_animation_frame":1582161598626,"./config":1582161598627,"./core/utils/data_structure_util":1582161598602,"./graphic/transform/BoundingRect":1582161598623,"./core/utils/timsort":1582161598624,"./CanvasLayer":1582161598628,"./graphic/Image":1582161598633,"./core/env":1582161598600,"./graphic/constants":1582161598603,"./core/utils/canvas_util":1582161598629,"./core/utils/guid":1582161598599}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598626, function(require, module, exports) {
/**
 * 兼容多种运行环境的 requestAnimationFrame 方法。
 * 有两个重要的地方会依赖此方法：
 * - 元素的渲染机制，在 Painter 类中会调用
 * - 元素的动画效果，在 Animation 类中会调用
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 */
var _default = typeof window !== 'undefined' && (window.requestAnimationFrame && window.requestAnimationFrame.bind(window) || window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window) || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame) || function (func) {
  setTimeout(func, 16); // 1000ms/60，每秒60帧，每帧约16ms
};

module.exports = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598627, function(require, module, exports) {
var dpr = 1; // If in browser environment

if (typeof window !== 'undefined') {
  dpr = Math.max(window.devicePixelRatio || 1, 1);
}
/**
 * config默认配置项
 * @exports qrenderer/config
 * @author Kener (@Kener-林峰, kener.linfeng@gmail.com)
 */

/**
 * Debug log mode:
 * 0: Do nothing, for release.
 * 1: console.error, for debug.
 */


var debugMode = 0; // retina 屏幕优化

var devicePixelRatio = dpr;
exports.debugMode = debugMode;
exports.devicePixelRatio = devicePixelRatio;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598628, function(require, module, exports) {
var dataUtil = require("./core/utils/data_structure_util");

var canvasUtil = require("./core/utils/canvas_util");

var Style = require("./graphic/Style");

var Pattern = require("./graphic/Pattern");

var guid = require("./core/utils/guid");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.canvas.CanvasLayer
 * 
 * CanvasLayer is designed to create canvas layers, it will be used in CanvasPainter.
 * CanvasPainter will create several canvas instances during the paint process, some 
 * of them are invisiable, such as the one used for export a image.
 * Attention: we can NOT create canvas dynamicly in Wechat mini-program, because Wechat
 * does not allow us to manipulate DOM.
 * 
 * 该类被设计用来创建 canvas 层，在 CanvasPainter 类中会引用此类。
 * 在绘图过程中， CanvasPainter 会创建多个 canvas 实例来辅助操作，
 * 某些 canvas 实例是隐藏的，比如用来导出图片的 canvas。
 * 注意：在微信小程序中不能动态创建 canvas 标签，因为微信小程序不允许 DOM 操作。
 * 
 * @author pissang(https://www.github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var CanvasLayer =
/*#__PURE__*/
function () {
  /**
   * @method constructor CanvasLayer
   * @param {HTMLDomElement|Canvas|Context} host 
   * This can be a HTMLDomElement like a DIV, or a Canvas instance, 
   * or Context for Wechat mini-program.
   * 
   * 此属性可以是 HTMLDomElement ，比如 DIV 标签；也可以是 Canvas 实例；或者是 Context 实例，因为在某些
   * 运行环境中，不能获得 Canvas 实例的引用，只能获得 Context。
   * @param {Number} width
   * @param {Number} height
   * @param {Number} [dpr]
   */
  function CanvasLayer(host, width, height, dpr) {
    _classCallCheck(this, CanvasLayer);

    /**
     * @property {String|Object} CanvasLayer id
     */
    this.id = guid();
    /**
     * @property {Number} CanvasLayer width
     */

    this.width = width;
    /**
     * @property {Number} CanvasLayer height
     */

    this.height = height;
    /**
     * @property {Number} CanvasLayer dpr
     */

    this.dpr = dpr;
    /**
     * @property {Context} ctx Canvas context, this property will be initialized after calling initContext() method.
     */

    this.ctx; // Create or set canvas instance.

    var canvasInstance = null;

    if (host && host.nodeName && host.nodeName.toUpperCase() === 'CANVAS') {
      // host is a canvas instance
      canvasInstance = host;
      this.id = canvasInstance.id;
    } else if (typeof host === 'string') {
      // host is an id string
      canvasInstance = canvasUtil.createCanvas(host, this.width, this.height, this.dpr);
      this.id = host;
    } else {
      // host is a Context instance
      this.ctx = host;
    } // There is no style attribute of canvasInstance in nodejs.


    if (canvasInstance && canvasInstance.style) {
      canvasInstance.onselectstart = function () {
        return false;
      }; // 避免页面选中的尴尬


      canvasInstance.style['-webkit-user-select'] = 'none';
      canvasInstance.style['user-select'] = 'none';
      canvasInstance.style['-webkit-touch-callout'] = 'none';
      canvasInstance.style['-webkit-tap-highlight-color'] = 'rgba(0,0,0,0)';
      canvasInstance.style['padding'] = 0; // eslint-disable-line dot-notation

      canvasInstance.style['margin'] = 0; // eslint-disable-line dot-notation

      canvasInstance.style['border-width'] = 0;
    }
    /**
     * @property {Canvas} canvasInstance
     * 注意：this.canvasInstance 可能为null，因为在微信小程序中，没有办法获取 canvas 实例，只能获取到 Context 对象。
     */


    this.canvasInstance = canvasInstance;
    /**
     * @property {Canvas} hiddenCanvas 隐藏的画布实例
     */

    this.hiddenCanvas = null;
    /**
     * @property {Context} hiddenContext 隐藏的画布上下文
     */

    this.hiddenContext = null;
    this.config = null;
    /**
     * @property {String} 每次清空画布的颜色
     */

    this.clearColor = 0;
    /**
     * @property {boolean} 是否开启动态模糊
     */

    this.motionBlur = false;
    /**
     * @property {Number} 在开启动态模糊的时候使用，与上一帧混合的alpha值，值越大尾迹越明显
     */

    this.lastFrameAlpha = 0.7;
    this.__dirty = true;
    this.__used = false;
    this.__drawIndex = 0;
    this.__startIndex = 0;
    this.__endIndex = 0;
    this.incremental = false;
  }
  /**
   * @method getElementCount
   */


  _createClass(CanvasLayer, [{
    key: "getElementCount",
    value: function getElementCount() {
      return this.__endIndex - this.__startIndex;
    }
    /**
     * @method initContext
     */

  }, {
    key: "initContext",
    value: function initContext() {
      if (this.canvasInstance) {
        this.ctx = canvasUtil.getContext(this.canvasInstance);
      }

      this.ctx.dpr = this.dpr;
    }
    /**
     * @method creatHiddenCanvas
     */

  }, {
    key: "creatHiddenCanvas",
    value: function creatHiddenCanvas() {
      this.hiddenCanvas = canvasUtil.createCanvas('back-' + this.id, this.width, this.height, this.dpr);
      this.hiddenContext = canvasUtil.getContext(this.hiddenCanvas);

      if (this.dpr !== 1) {
        this.hiddenContext.scale(this.dpr, this.dpr);
      }
    }
    /**
     * @method resize
     * @param  {Number} width
     * @param  {Number} height
     */

  }, {
    key: "resize",
    value: function resize(width, height) {
      //Can NOT get canvas instance in Wechat mini-program.
      if (!this.canvasInstance) {
        return;
      }

      if (this.canvasInstance.style) {
        this.canvasInstance.style.width = width + 'px';
        this.canvasInstance.style.height = height + 'px';
      }

      this.canvasInstance.width = width * this.dpr;
      this.canvasInstance.height = height * this.dpr;

      if (!this.hiddenCanvas) {
        return;
      }

      this.hiddenCanvas.width = width * this.dpr;
      this.hiddenCanvas.height = height * this.dpr;

      if (this.dpr !== 1) {
        this.hiddenContext.scale(this.dpr, this.dpr);
      }
    }
    /**
     * @method clear
     * 清空该层画布
     * @param {boolean} [clearAll=false] Clear all with out motion blur
     * @param {Color} [clearColor]
     */

  }, {
    key: "clear",
    value: function clear(clearAll, clearColor) {
      clearColor = clearColor || this.clearColor;
      var haveMotionBLur = this.motionBlur && !clearAll;
      var lastFrameAlpha = this.lastFrameAlpha;
      var dpr = this.dpr;

      if (haveMotionBLur && this.canvasInstance) {
        var _width = this.canvasInstance.width;
        var _height = this.canvasInstance.height;

        if (!this.hiddenCanvas) {
          this.creatHiddenCanvas();
        }

        this.hiddenContext.globalCompositeOperation = 'copy';
        this.hiddenContext.drawImage(this.canvasInstance, 0, 0, _width / dpr, _height / dpr);
      }

      this.ctx.clearRect(0, 0, this.width, this.height);

      if (clearColor && clearColor !== 'transparent') {
        var clearColorGradientOrPattern; // Gradient

        if (clearColor.colorStops) {
          // Cache canvasInstance gradient
          clearColorGradientOrPattern = clearColor.__canvasGradient || Style.getGradient(this.ctx, clearColor, {
            x: 0,
            y: 0,
            width: width,
            height: height
          });
          clearColor.__canvasGradient = clearColorGradientOrPattern;
        } else if (clearColor.image) {
          // Pattern
          clearColorGradientOrPattern = Pattern.prototype.getCanvasPattern.call(clearColor, this.ctx);
        }

        this.ctx.save();
        this.ctx.fillStyle = clearColorGradientOrPattern || clearColor;
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.restore();
      }

      if (haveMotionBLur && this.hiddenCanvas) {
        this.ctx.save();
        this.ctx.globalAlpha = lastFrameAlpha;
        this.ctx.drawImage(this.hiddenCanvas, 0, 0, width, height);
        this.ctx.restore();
      }
    }
  }]);

  return CanvasLayer;
}();

module.exports = CanvasLayer;
}, function(modId) { var map = {"./core/utils/data_structure_util":1582161598602,"./core/utils/canvas_util":1582161598629,"./graphic/Style":1582161598630,"./graphic/Pattern":1582161598632,"./core/utils/guid":1582161598599}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598629, function(require, module, exports) {
var guid = require("./guid");

/**
 * 创建 canvas 实例
 * @param {String} id
 * @param {Number} width
 * @param {Number} height
 * @param {Number} dpr
 * @return {Canvas}
 */
function createCanvas(id, width, height, dpr) {
  var canvas = document.createElement('canvas');

  if (id == null || id == undefined) {
    id = guid();
  }

  canvas.setAttribute('data-qr-dom-id', id);

  if (width == null || width == undefined || height == null || height == undefined) {
    return canvas;
  } // Canvas instance has no style attribute in nodejs.


  if (canvas.style) {
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }

  if (dpr == null || dpr == undefined) {
    return canvas;
  }

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  return canvas;
}

function getContext(canvasInstance) {
  if (!canvasInstance) {
    canvasInstance = createCanvas();
  }

  return canvasInstance.getContext('2d');
}

exports.createCanvas = createCanvas;
exports.getContext = getContext;
}, function(modId) { var map = {"./guid":1582161598599}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598630, function(require, module, exports) {
var fixShadow = require("./utils/fix_shadow");

var _constants = require("./constants");

var ContextCachedBy = _constants.ContextCachedBy;

var _constants2 = require("../graphic/constants");

var mathMin = _constants2.mathMin;

/**
 * @class qrenderer.graphic.Style
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var STYLE_COMMON_PROPS = [['shadowBlur', 0], ['shadowOffsetX', 0], ['shadowOffsetY', 0], ['shadowColor', '#000'], ['lineCap', 'butt'], ['lineJoin', 'miter'], ['miterLimit', 10]];

function createLinearGradient(ctx, obj, rect) {
  var x = obj.x == null ? 0 : obj.x;
  var x2 = obj.x2 == null ? 1 : obj.x2;
  var y = obj.y == null ? 0 : obj.y;
  var y2 = obj.y2 == null ? 0 : obj.y2;

  if (!obj.global) {
    x = x * rect.width + rect.x;
    x2 = x2 * rect.width + rect.x;
    y = y * rect.height + rect.y;
    y2 = y2 * rect.height + rect.y;
  } // Fix NaN when rect is Infinity


  x = isNaN(x) ? 0 : x;
  x2 = isNaN(x2) ? 1 : x2;
  y = isNaN(y) ? 0 : y;
  y2 = isNaN(y2) ? 0 : y2;
  var canvasGradient = ctx.createLinearGradient(x, y, x2, y2);
  return canvasGradient;
}

function createRadialGradient(ctx, obj, rect) {
  var width = rect.width;
  var height = rect.height;
  var min = mathMin(width, height);
  var x = obj.x == null ? 0.5 : obj.x;
  var y = obj.y == null ? 0.5 : obj.y;
  var r = obj.r == null ? 0.5 : obj.r;

  if (!obj.global) {
    x = x * width + rect.x;
    y = y * height + rect.y;
    r = r * min;
  }

  var canvasGradient = ctx.createRadialGradient(x, y, 0, x, y, r);
  return canvasGradient;
}

var Style = function Style(opts) {
  this.extendStyle(opts, false);
};

Style.prototype = {
  constructor: Style,

  /**
   * @property {String} fill
   */
  fill: '#000',

  /**
   * @property {String} stroke
   */
  stroke: null,

  /**
   * @property {Number} opacity
   */
  opacity: 1,

  /**
   * @property {Number} fillOpacity
   */
  fillOpacity: null,

  /**
   * @property {Number} strokeOpacity
   */
  strokeOpacity: null,

  /**
   * @property {Array<Number>|Boolean} lineDash
   * `true` is not supported.
   * `false`/`null`/`undefined` are the same.
   * `false` is used to remove lineDash in some
   * case that `null`/`undefined` can not be set.
   * (e.g., emphasis.lineStyle in echarts)
   */
  lineDash: null,

  /**
   * @property {Number} lineDashOffset
   */
  lineDashOffset: 0,

  /**
   * @property {Number} shadowBlur
   */
  shadowBlur: 0,

  /**
   * @property {Number} shadowOffsetX
   */
  shadowOffsetX: 0,

  /**
   * @property {Number} shadowOffsetY
   */
  shadowOffsetY: 0,

  /**
   * @property {Number} lineWidth
   */
  lineWidth: 1,

  /**
   * @property {Boolean} strokeNoScale
   * If stroke ignore scale
   */
  strokeNoScale: false,
  // Bounding rect text configuration
  // Not affected by element transform

  /**
   * @property {String} text
   */
  text: null,

  /**
   * @property {String} font
   * If `fontSize` or `fontFamily` exists, `font` will be reset by
   * `fontSize`, `fontStyle`, `fontWeight`, `fontFamily`.
   * So do not visit it directly in upper application (like echarts),
   * but use `contain/text#makeFont` instead.
   */
  font: null,

  /**
   * @deprecated
   * @property {String} textFont
   * The same as font. Use font please.
   */
  textFont: null,

  /**
   * @property {String} fontStyle
   * It helps merging respectively, rather than parsing an entire font string.
   */
  fontStyle: null,

  /**
   * @property {String} fontWeight
   * It helps merging respectively, rather than parsing an entire font string.
   */
  fontWeight: null,

  /**
   * @property {Number} fontSize
   * It helps merging respectively, rather than parsing an entire font string.
   * Should be 12 but not '12px'.
   */
  fontSize: null,

  /**
   * @property {String} fontFamily
   * It helps merging respectively, rather than parsing an entire font string.
   */
  fontFamily: null,

  /**
   * @property {String} textTag
   * Reserved for special functinality, like 'hr'.
   */
  textTag: null,

  /**
   * @property {String} textFill
   */
  textFill: '#000',

  /**
   * @property {String} textStroke
   */
  textStroke: null,

  /**
   * @property {Number} textWidth
   */
  textWidth: null,

  /**
   * @property {Number} textHeight
   * Only for textBackground.
   */
  textHeight: null,

  /**
   * @property {Number} textStrokeWidth
   * textStroke may be set as some color as a default
   * value in upper applicaion, where the default value
   * of textStrokeWidth should be 0 to make sure that
   * user can choose to do not use text stroke.
   */
  textStrokeWidth: 0,

  /**
   * @property {Number} textLineHeight
   */
  textLineHeight: null,

  /**
   * @property {string|Array<Number>} textPosition
   * 'inside', 'left', 'right', 'top', 'bottom'
   * [x, y]
   * Based on x, y of rect.
   */
  textPosition: 'inside',

  /**
   * @property {Object} textRect
   * If not specified, use the boundingRect of a `displayable`.
   */
  textRect: null,

  /**
   * @property {Array<Number>} textOffset
   * [x, y]
   */
  textOffset: null,

  /**
   * @property {String} textAlign
   */
  textAlign: null,

  /**
   * @property {String} textVerticalAlign
   */
  textVerticalAlign: null,

  /**
   * @property {Number} textDistance
   */
  textDistance: 5,

  /**
   * @property {String} textShadowColor
   */
  textShadowColor: 'transparent',

  /**
   * @property {Number} textShadowBlur
   */
  textShadowBlur: 0,

  /**
   * @property {Number} textShadowOffsetX
   */
  textShadowOffsetX: 0,

  /**
   * @property {Number} textShadowOffsetY
   */
  textShadowOffsetY: 0,

  /**
   * @property {String} textBoxShadowColor
   */
  textBoxShadowColor: 'transparent',

  /**
   * @property {Number} textBoxShadowBlur
   */
  textBoxShadowBlur: 0,

  /**
   * @property {Number} textBoxShadowOffsetX
   */
  textBoxShadowOffsetX: 0,

  /**
   * @property {Number} textBoxShadowOffsetY
   */
  textBoxShadowOffsetY: 0,

  /**
   * @property {Boolean} transformText
   * Whether transform text.
   * Only available in Path and Image element,
   * where the text is called as `RectText`.
   */
  transformText: false,

  /**
   * @property {Number} textRotation
   * Text rotate around position of Path or Image.
   * The origin of the rotation can be specified by `textOrigin`.
   * Only available in Path and Image element,
   * where the text is called as `RectText`.
   */
  textRotation: 0,

  /**
   * @property {String|Array<Number>} textOrigin
   * Text origin of text rotation.
   * Useful in the case like label rotation of circular symbol.
   * Only available in Path and Image element, where the text is called
   * as `RectText` and the element is called as "host element".
   * The value can be:
   * + If specified as a coordinate like `[10, 40]`, it is the `[x, y]`
   * base on the left-top corner of the rect of its host element.
   * + If specified as a string `center`, it is the center of the rect of
   * its host element.
   * + By default, this origin is the `textPosition`.
   */
  textOrigin: null,

  /**
   * @property {String} textBackgroundColor
   */
  textBackgroundColor: null,

  /**
   * @property {String} textBorderColor
   */
  textBorderColor: null,

  /**
   * @property {Number} textBorderWidth
   */
  textBorderWidth: 0,

  /**
   * @property {Number} textBorderRadius
   */
  textBorderRadius: 0,

  /**
   * @property {number|Array<Number>} textPadding
   * Can be `2` or `[2, 4]` or `[2, 3, 4, 5]`
   */
  textPadding: null,

  /**
   * @property {Object} rich
   * Text styles for rich text.
   */
  rich: null,

  /**
   * @property {Object} truncate
   * {outerWidth, outerHeight, ellipsis, placeholder}
   */
  truncate: null,

  /**
   * @property {String} blend
   * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
   */
  blend: null,

  /**
   * @method bind
   * @param {CanvasRenderingContext2D} ctx
   * @param {Element} el
   * @param {Element} prevEl
   */
  bind: function bind(ctx, el, prevEl) {
    var style = this;
    var prevStyle = prevEl && prevEl.style; // If no prevStyle, it means first draw.
    // Only apply cache if the last time cachced by this function.

    var notCheckCache = !prevStyle || ctx.__attrCachedBy !== ContextCachedBy.STYLE_BIND;
    ctx.__attrCachedBy = ContextCachedBy.STYLE_BIND;

    for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
      var prop = STYLE_COMMON_PROPS[i];
      var styleName = prop[0];

      if (notCheckCache || style[styleName] !== prevStyle[styleName]) {
        // FIXME Invalid property value will cause style leak from previous element.
        ctx[styleName] = fixShadow(ctx, styleName, style[styleName] || prop[1]);
      }
    }

    if (notCheckCache || style.fill !== prevStyle.fill) {
      ctx.fillStyle = style.fill;
    }

    if (notCheckCache || style.stroke !== prevStyle.stroke) {
      ctx.strokeStyle = style.stroke;
    }

    if (notCheckCache || style.opacity !== prevStyle.opacity) {
      ctx.globalAlpha = style.opacity == null ? 1 : style.opacity;
    }

    if (notCheckCache || style.blend !== prevStyle.blend) {
      ctx.globalCompositeOperation = style.blend || 'source-over';
    }

    if (this.hasStroke()) {
      var lineWidth = style.lineWidth;
      ctx.lineWidth = lineWidth / (this.strokeNoScale && el && el.getLineScale ? el.getLineScale() : 1);
    }
  },

  /**
   * @method hasFill
   */
  hasFill: function hasFill() {
    var fill = this.fill;
    return fill != null && fill !== 'none';
  },

  /**
   * @method hasStroke
   */
  hasStroke: function hasStroke() {
    var stroke = this.stroke;
    return stroke != null && stroke !== 'none' && this.lineWidth > 0;
  },

  /**
   * @method extendStyle
   * Extend from other style
   * @param {Style} otherStyle
   * @param {Boolean} overwrite true: overwrirte any way.
   *                            false: overwrite only when !target.hasOwnProperty
   *                            others: overwrite when property is not null/undefined.
   */
  extendStyle: function extendStyle(otherStyle, overwrite) {
    if (otherStyle) {
      for (var name in otherStyle) {
        if (otherStyle.hasOwnProperty(name) && (overwrite === true || (overwrite === false ? !this.hasOwnProperty(name) : otherStyle[name] != null))) {
          this[name] = otherStyle[name];
        }
      }
    }
  },

  /**
   * @method set
   * Batch setting style with a given object
   * @param {Object|String} obj
   * @param {*} [obj]
   */
  set: function set(obj, value) {
    if (typeof obj === 'string') {
      this[obj] = value;
    } else {
      this.extendStyle(obj, true);
    }
  },

  /**
   * @method clone
   * @return {Style}
   */
  clone: function clone() {
    var newStyle = new this.constructor();
    newStyle.extendStyle(this, true);
    return newStyle;
  },

  /**
   * @method getGradient
   * @param {*} ctx 
   * @param {*} obj 
   * @param {*} rect 
   */
  getGradient: function getGradient(ctx, obj, rect) {
    var method = obj.type === 'radial' ? createRadialGradient : createLinearGradient;
    var canvasGradient = method(ctx, obj, rect);
    var colorStops = obj.colorStops;

    for (var i = 0; i < colorStops.length; i++) {
      canvasGradient.addColorStop(colorStops[i].offset, colorStops[i].color);
    }

    return canvasGradient;
  }
};
var styleProto = Style.prototype;

for (var i = 0; i < STYLE_COMMON_PROPS.length; i++) {
  var prop = STYLE_COMMON_PROPS[i];

  if (!(prop[0] in styleProto)) {
    styleProto[prop[0]] = prop[1];
  }
} // Provide for others


Style.getGradient = styleProto.getGradient;
var _default = Style;
module.exports = _default;
}, function(modId) { var map = {"./utils/fix_shadow":1582161598631,"./constants":1582161598603,"../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598631, function(require, module, exports) {
var SHADOW_PROPS = {
  'shadowBlur': 1,
  'shadowOffsetX': 1,
  'shadowOffsetY': 1,
  'textShadowBlur': 1,
  'textShadowOffsetX': 1,
  'textShadowOffsetY': 1,
  'textBoxShadowBlur': 1,
  'textBoxShadowOffsetX': 1,
  'textBoxShadowOffsetY': 1
};

function _default(ctx, propName, value) {
  if (SHADOW_PROPS.hasOwnProperty(propName)) {
    return value *= ctx.dpr;
  }

  return value;
}

module.exports = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598632, function(require, module, exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.graphic.Pattern
 * 
 * Pattern
 * 
 * 图案
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var Pattern =
/*#__PURE__*/
function () {
  /**
   * @method  constructor Pattern
   * @param {*} image 
   * @param {*} repeat 
   */
  function Pattern(image, repeat) {
    _classCallCheck(this, Pattern);

    // Should do nothing more in this constructor. Because gradient can be
    // declard by `color: {image: ...}`, where this constructor will not be called.
    this.image = image;
    this.repeat = repeat; // Can be cloned

    this.type = 'pattern';
  }

  _createClass(Pattern, [{
    key: "getCanvasPattern",
    value: function getCanvasPattern(ctx) {
      return ctx.createPattern(this.image, this.repeat || 'repeat');
    }
  }]);

  return Pattern;
}();

var _default = Pattern;
module.exports = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598633, function(require, module, exports) {
var Displayable = require("./Displayable");

var BoundingRect = require("./transform/BoundingRect");

var dataUtil = require("../core/utils/data_structure_util");

var imageHelper = require("./utils/image");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.ZImage 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var ZImage =
/*#__PURE__*/
function (_Displayable) {
  _inherits(ZImage, _Displayable);

  /**
   * @method constructor ZImage
   * @param {Object} options
   */
  function ZImage(options) {
    var _this;

    _classCallCheck(this, ZImage);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ZImage).call(this, options));
    /**
     * @property {String}
     */

    _this.type = 'image';
    return _this;
  }
  /**
   * @method brush
   * @param {Object} ctx 
   * @param {Element} prevEl 
   */


  _createClass(ZImage, [{
    key: "brush",
    value: function brush(ctx, prevEl) {
      var style = this.style;
      var src = style.image; // Must bind each time

      style.bind(ctx, this, prevEl);
      var image = this._image = imageHelper.createOrUpdateImage(src, this._image, this, this.onload);

      if (!image || !imageHelper.isImageReady(image)) {
        return;
      }

      var x = style.x || 0;
      var y = style.y || 0;
      var width = style.width;
      var height = style.height;
      var aspect = image.width / image.height;

      if (width == null && height != null) {
        // Keep image/height ratio
        width = height * aspect;
      } else if (height == null && width != null) {
        height = width / aspect;
      } else if (width == null && height == null) {
        width = image.width;
        height = image.height;
      } // 设置transform


      this.setTransform(ctx);

      if (style.sWidth && style.sHeight) {
        var sx = style.sx || 0;
        var sy = style.sy || 0;
        ctx.drawImage(image, sx, sy, style.sWidth, style.sHeight, x, y, width, height);
      } else if (style.sx && style.sy) {
        var _sx = style.sx;
        var _sy = style.sy;
        var sWidth = width - _sx;
        var sHeight = height - _sy;
        ctx.drawImage(image, _sx, _sy, sWidth, sHeight, x, y, width, height);
      } else {
        ctx.drawImage(image, x, y, width, height);
      } // Draw rect text


      if (style.text != null) {
        // Only restore transform when needs draw text.
        this.restoreTransform(ctx);
        this.drawRectText(ctx, this.getBoundingRect());
      }
    }
    /**
     * @method getBoundingRect
     */

  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      var style = this.style;

      if (!this._rect) {
        this._rect = new BoundingRect(style.x || 0, style.y || 0, style.width || 0, style.height || 0);
      }

      return this._rect;
    }
  }]);

  return ZImage;
}(Displayable);

module.exports = ZImage;
}, function(modId) { var map = {"./Displayable":1582161598634,"./transform/BoundingRect":1582161598623,"../core/utils/data_structure_util":1582161598602,"./utils/image":1582161598638}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598634, function(require, module, exports) {
var classUtil = require("../core/utils/class_util");

var Style = require("./Style");

var Element = require("./Element");

var RectText = require("./RectText");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @abstract
 * @class qrenderer.graphic.Displayable 
 * 
 * Base class of all displayable graphic objects.
 * 
 * 所有图形对象的基类，抽象类。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var Displayable =
/*#__PURE__*/
function (_Element) {
  _inherits(Displayable, _Element);

  /**
   * @method constructor
   * @param {*} options 
   */
  function Displayable() {
    var _this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Displayable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Displayable).call(this, options));
    /**
     * @private
     * @property  __clipPaths
     * Shapes for cascade clipping.
     * Can only be `null`/`undefined` or an non-empty array, MUST NOT be an empty array.
     * because it is easy to only using null to check whether clipPaths changed.
     */

    _this.__clipPaths = null; // FIXME Stateful must be mixined after style is setted
    // Stateful.call(this, options);

    /**
     * The String value of `textPosition` needs to be calculated to a real postion.
     * For example, `'inside'` is calculated to `[rect.width/2, rect.height/2]`
     * by default. See `contain/text.js#calculateTextPosition` for more details.
     * But some coutom shapes like "pin", "flag" have center that is not exactly
     * `[width/2, height/2]`. So we provide this hook to customize the calculation
     * for those shapes. It will be called if the `style.textPosition` is a String.
     * @param {Obejct} [out] Prepared out object. If not provided, this method should
     *        be responsible for creating one.
     * @param {Style} style
     * @param {Object} rect {x, y, width, height}
     * @return {Obejct} out The same as the input out.
     *         {
     *             x: Number. mandatory.
     *             y: Number. mandatory.
     *             textAlign: String. optional. use style.textAlign by default.
     *             textVerticalAlign: String. optional. use style.textVerticalAlign by default.
     *         }
     */

    _this.calculateTextPosition = null;
    /**
     * @property {String} type
     */

    _this.type = 'displayable';
    /**
     * @property {Boolean} invisible
     * Whether the displayable object is visible. when it is true, the displayable object
     * is not drawn, but the mouse event can still trigger the object.
     */

    _this.invisible = false;
    /**
     * @property {Number} z
     */

    _this.z = 0;
    /**
     * @property {Number} z2
     */

    _this.z2 = 0;
    /**
     * @property {Number} qlevel
     * The q level determines the displayable object can be drawn in which layer canvas.
     */

    _this.qlevel = 0;
    /**
     * @property {Boolean} draggable
     * Whether it can be dragged.
     */

    _this.draggable = false;
    /**
     * @property {Boolean} dragging
     * Whether is it dragging.
     */

    _this.dragging = false;
    /**
     * @property {Boolean} silent
     * Whether to respond to mouse events.
     */

    _this.silent = false;
    /**
     * @property {Boolean} culling
     * If enable culling
     */

    _this.culling = false;
    /**
     * @property {String} cursor
     * Mouse cursor when hovered
     */

    _this.cursor = 'pointer';
    /**
     * @property {String} rectHover
     * If hover area is bounding rect
     */

    _this.rectHover = false;
    /**
     * @property {Boolean} progressive
     * Render the element progressively when the value >= 0,
     * usefull for large data.
     */

    _this.progressive = false;
    /**
     * @property {Boolean} incremental
     */

    _this.incremental = false;
    /**
     * @property {Boolean} globalScaleRatio
     * Scale ratio for global scale.
     */

    _this.globalScaleRatio = 1;
    /**
     * @property {Style} style
     */

    _this.style = new Style(options.style, _assertThisInitialized(_this));
    /**
     * @property {Object} shape 形状
     */

    _this.shape = {}; // Extend default shape

    var defaultShape = _this.options.shape;

    if (defaultShape) {
      for (var name in defaultShape) {
        if (!_this.shape.hasOwnProperty(name) && defaultShape.hasOwnProperty(name)) {
          _this.shape[name] = defaultShape[name];
        }
      }
    } // FIXME 不能 extend position, rotation 等引用对象 TODO:why?


    classUtil.copyOwnProperties(_assertThisInitialized(_this), _this.options, ['style', 'shape']);
    return _this;
  }
  /**
   * @protected
   * @method beforeBrush
   */


  _createClass(Displayable, [{
    key: "beforeBrush",
    value: function beforeBrush(ctx) {}
    /**
     * @protected
     * @method brush
     * Callback during brush.
     */

  }, {
    key: "brush",
    value: function brush(ctx, prevEl) {}
    /**
     * @protected
     * @method afterBrush
     */

  }, {
    key: "afterBrush",
    value: function afterBrush(ctx) {}
    /**
     * @protected
     * @method getBoundingRect
     */

  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {}
    /**
     * @protected
     * @method contain
     * 
     * If displayable element contain coord x, y, this is an util function for
     * determine where two elements overlap.
     * 
     * 图元是否包含坐标(x,y)，此工具方法用来判断两个图元是否重叠。
     * 
     * @param  {Number} x
     * @param  {Number} y
     * @return {Boolean}
     */

  }, {
    key: "contain",
    value: function contain(x, y) {
      return this.rectContain(x, y);
    }
    /**
     * @protected
     * @method rectContain
     * 
     * If bounding rect of element contain coord x, y.
     * 
     * 用来判断当前图元的外框矩形是否包含坐标点(x,y)。
     * 
     * @param  {Number} x
     * @param  {Number} y
     * @return {Boolean}
     */

  }, {
    key: "rectContain",
    value: function rectContain(x, y) {
      var coord = this.transformCoordToLocal(x, y);
      var rect = this.getBoundingRect();
      return rect.contain(coord[0], coord[1]);
    }
    /**
     * @method traverse
     * @param  {Function} cb
     * @param  {Object}  context
     */

  }, {
    key: "traverse",
    value: function traverse(cb, context) {
      cb.call(context, this);
    }
    /**
     * @method animateStyle
     * Alias for animate('style')
     * @param {Boolean} loop
     */

  }, {
    key: "animateStyle",
    value: function animateStyle(loop) {
      return this.animate('style', loop);
    }
    /**
     * @method attrKV
     * @param {*} key 
     * @param {*} value 
     */

  }, {
    key: "attrKV",
    value: function attrKV(key, value) {
      if (key !== 'style') {
        Element.prototype.attrKV.call(this, key, value);
      } else {
        this.style.set(value);
      }
    }
    /**
     * @method setStyle
     * @param {Object|String} key
     * @param {*} value
     */

  }, {
    key: "setStyle",
    value: function setStyle(key, value) {
      this.style.set(key, value);
      this.dirty(false);
      return this;
    }
    /**
     * @method useStyle
     * Use given style object
     * @param  {Object} obj
     */

  }, {
    key: "useStyle",
    value: function useStyle(obj) {
      this.style = new Style(obj, this);
      this.dirty(false);
      return this;
    }
  }]);

  return Displayable;
}(Element);

classUtil.mixin(Displayable, RectText);
var _default = Displayable;
module.exports = _default;
}, function(modId) { var map = {"../core/utils/class_util":1582161598604,"./Style":1582161598630,"./Element":1582161598613,"./RectText":1582161598635}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598635, function(require, module, exports) {
var textUtil = require("./utils/text_util");

var BoundingRect = require("./transform/BoundingRect");

var _constants = require("./constants");

var WILL_BE_RESTORED = _constants.WILL_BE_RESTORED;

/**
 * @class qrenderer.graphic.RectText 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var tmpRect = new BoundingRect();

var RectText = function RectText() {};
/**
 * @method constructor RectText
 */


RectText.prototype = {
  constructor: RectText,

  /**
   * Draw text in a rect with specified position.
   * @param  {CanvasRenderingContext2D} ctx
   * @param  {Object} rect Displayable rect
   */
  drawRectText: function drawRectText(ctx, rect) {
    var style = this.style;
    rect = style.textRect || rect; // Optimize, avoid normalize every time.

    this.__dirty && textUtil.normalizeTextStyle(style, true);
    var text = style.text; // Convert to string

    text != null && (text += '');

    if (!textUtil.needDrawText(text, style)) {
      return;
    } // FIXME
    // Do not provide prevEl to `textUtil.renderText` for ctx prop cache,
    // but use `ctx.save()` and `ctx.restore()`. Because the cache for rect
    // text propably break the cache for its host elements.


    ctx.save(); // Transform rect to view space

    var transform = this.transform;

    if (!style.transformText) {
      if (transform) {
        tmpRect.copy(rect);
        tmpRect.applyTransform(transform);
        rect = tmpRect;
      }
    } else {
      this.setTransform(ctx);
    } // transformText and textRotation can not be used at the same time.


    textUtil.renderText(this, ctx, text, style, rect, WILL_BE_RESTORED);
    ctx.restore();
  }
};
var _default = RectText;
module.exports = _default;
}, function(modId) { var map = {"./utils/text_util":1582161598636,"./transform/BoundingRect":1582161598623,"./constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598636, function(require, module, exports) {
var dataUtil = require("../../core/utils/data_structure_util");

var textContain = require("../../core/contain/text");

var roundRectHelper = require("./round_rect");

var imageHelper = require("./image");

var fixShadow = require("./fix_shadow");

var _constants = require("../constants");

var ContextCachedBy = _constants.ContextCachedBy;
var WILL_BE_RESTORED = _constants.WILL_BE_RESTORED;
var DEFAULT_FONT = textContain.DEFAULT_FONT; // TODO: Have not support 'start', 'end' yet.

var VALID_TEXT_ALIGN = {
  left: 1,
  right: 1,
  center: 1
};
var VALID_TEXT_VERTICAL_ALIGN = {
  top: 1,
  bottom: 1,
  middle: 1
}; // Different from `STYLE_COMMON_PROPS` of `graphic/Style`,
// the default value of shadowColor is `'transparent'`.

var SHADOW_STYLE_COMMON_PROPS = [['textShadowBlur', 'shadowBlur', 0], ['textShadowOffsetX', 'shadowOffsetX', 0], ['textShadowOffsetY', 'shadowOffsetY', 0], ['textShadowColor', 'shadowColor', 'transparent']];
var _tmpTextPositionResult = {};
var _tmpBoxPositionResult = {};
/**
 * @param {Style} style
 * @return {Style} The input style.
 */

function normalizeTextStyle(style) {
  normalizeStyle(style);
  dataUtil.each(style.rich, normalizeStyle);
  return style;
}

function normalizeStyle(style) {
  if (style) {
    style.font = textContain.makeFont(style);
    var textAlign = style.textAlign;
    textAlign === 'middle' && (textAlign = 'center');
    style.textAlign = textAlign == null || VALID_TEXT_ALIGN[textAlign] ? textAlign : 'left'; // Compatible with textBaseline.

    var textVerticalAlign = style.textVerticalAlign || style.textBaseline;
    textVerticalAlign === 'center' && (textVerticalAlign = 'middle');
    style.textVerticalAlign = textVerticalAlign == null || VALID_TEXT_VERTICAL_ALIGN[textVerticalAlign] ? textVerticalAlign : 'top';
    var textPadding = style.textPadding;

    if (textPadding) {
      style.textPadding = dataUtil.normalizeCssArray(style.textPadding);
    }
  }
}
/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {String} text
 * @param {Style} style
 * @param {Object|boolean} [rect] {x, y, width, height}
 *                  If set false, rect text is not used.
 * @param {Element|helper/constant.WILL_BE_RESTORED} [prevEl] For ctx prop cache.
 */


function renderText(hostEl, ctx, text, style, rect, prevEl) {
  style.rich ? renderRichText(hostEl, ctx, text, style, rect, prevEl) : renderPlainText(hostEl, ctx, text, style, rect, prevEl);
} // Avoid setting to ctx according to prevEl if possible for
// performance in scenarios of large amount text.


function renderPlainText(hostEl, ctx, text, style, rect, prevEl) {
  

  var needDrawBg = needDrawBackground(style);
  var prevStyle;
  var checkCache = false;
  var cachedByMe = ctx.__attrCachedBy === ContextCachedBy.PLAIN_TEXT; // Only take and check cache for `Text` el, but not RectText.

  if (prevEl !== WILL_BE_RESTORED) {
    if (prevEl) {
      prevStyle = prevEl.style;
      checkCache = !needDrawBg && cachedByMe && prevStyle;
    } // Prevent from using cache in `Style::bind`, because of the case:
    // ctx property is modified by other properties than `Style::bind`
    // used, and Style::bind is called next.


    ctx.__attrCachedBy = needDrawBg ? ContextCachedBy.NONE : ContextCachedBy.PLAIN_TEXT;
  } // Since this will be restored, prevent from using these props to check cache in the next
  // entering of this method. But do not need to clear other cache like `Style::bind`.
  else if (cachedByMe) {
      ctx.__attrCachedBy = ContextCachedBy.NONE;
    }

  var styleFont = style.font || DEFAULT_FONT; // PENDING
  // Only `Text` el set `font` and keep it (`RectText` will restore). So theoretically
  // we can make font cache on ctx, which can cache for text el that are discontinuous.
  // But layer save/restore needed to be considered.
  // if (styleFont !== ctx.__fontCache) {
  //     ctx.font = styleFont;
  //     if (prevEl !== WILL_BE_RESTORED) {
  //         ctx.__fontCache = styleFont;
  //     }
  // }

  if (!checkCache || styleFont !== (prevStyle.font || DEFAULT_FONT)) {
    ctx.font = styleFont;
  } // Use the final font from context-2d, because the final
  // font might not be the style.font when it is illegal.
  // But get `ctx.font` might be time consuming.


  var computedFont = hostEl.__computedFont;

  if (hostEl.__styleFont !== styleFont) {
    hostEl.__styleFont = styleFont;
    computedFont = hostEl.__computedFont = ctx.font;
  }

  var textPadding = style.textPadding;
  var textLineHeight = style.textLineHeight;
  var contentBlock = hostEl.__textCotentBlock;

  if (!contentBlock || hostEl.__dirtyText) {
    contentBlock = hostEl.__textCotentBlock = textContain.parsePlainText(text, computedFont, textPadding, textLineHeight, style.truncate);
  }

  var outerHeight = contentBlock.outerHeight;
  var textLines = contentBlock.lines;
  var lineHeight = contentBlock.lineHeight;
  var boxPos = getBoxPosition(_tmpBoxPositionResult, hostEl, style, rect);
  var baseX = boxPos.baseX;
  var baseY = boxPos.baseY;
  var textAlign = boxPos.textAlign || 'left';
  var textVerticalAlign = boxPos.textVerticalAlign; // Origin of textRotation should be the base point of text drawing.

  applyTextRotation(ctx, style, rect, baseX, baseY);
  var boxY = textContain.adjustTextY(baseY, outerHeight, textVerticalAlign);
  var textX = baseX;
  var textY = boxY;

  if (needDrawBg || textPadding) {
    // Consider performance, do not call getTextWidth util necessary.
    var textWidth = textContain.getWidth(text, computedFont);
    var outerWidth = textWidth;
    textPadding && (outerWidth += textPadding[1] + textPadding[3]);
    var boxX = textContain.adjustTextX(baseX, outerWidth, textAlign);
    needDrawBg && drawBackground(hostEl, ctx, style, boxX, boxY, outerWidth, outerHeight);

    if (textPadding) {
      textX = getTextXForPadding(baseX, textAlign, textPadding);
      textY += textPadding[0];
    }
  } // Always set textAlign and textBase line, because it is difficute to calculate
  // textAlign from prevEl, and we dont sure whether textAlign will be reset if
  // font set happened.


  ctx.textAlign = textAlign; // Force baseline to be "middle". Otherwise, if using "top", the
  // text will offset downward a little bit in font "Microsoft YaHei".

  ctx.textBaseline = 'middle'; // Set text opacity

  ctx.globalAlpha = style.opacity || 1; // Always set shadowBlur and shadowOffset to avoid leak from displayable.

  for (var i = 0; i < SHADOW_STYLE_COMMON_PROPS.length; i++) {
    var propItem = SHADOW_STYLE_COMMON_PROPS[i];
    var styleProp = propItem[0];
    var ctxProp = propItem[1];
    var val = style[styleProp];

    if (!checkCache || val !== prevStyle[styleProp]) {
      ctx[ctxProp] = fixShadow(ctx, ctxProp, val || propItem[2]);
    }
  } // `textBaseline` is set as 'middle'.


  textY += lineHeight / 2;
  var textStrokeWidth = style.textStrokeWidth;
  var textStrokeWidthPrev = checkCache ? prevStyle.textStrokeWidth : null;
  var strokeWidthChanged = !checkCache || textStrokeWidth !== textStrokeWidthPrev;
  var strokeChanged = !checkCache || strokeWidthChanged || style.textStroke !== prevStyle.textStroke;
  var textStroke = getStroke(style.textStroke, textStrokeWidth);
  var textFill = getFill(style.textFill);

  if (textStroke) {
    if (strokeWidthChanged) {
      ctx.lineWidth = textStrokeWidth;
    }

    if (strokeChanged) {
      ctx.strokeStyle = textStroke;
    }
  }

  if (textFill) {
    if (!checkCache || style.textFill !== prevStyle.textFill) {
      ctx.fillStyle = textFill;
    }
  } // Optimize simply, in most cases only one line exists.


  if (textLines.length === 1) {
    // Fill after stroke so the outline will not cover the main part.
    textStroke && ctx.strokeText(textLines[0], textX, textY);
    textFill && ctx.fillText(textLines[0], textX, textY);
  } else {
    for (var i = 0; i < textLines.length; i++) {
      // Fill after stroke so the outline will not cover the main part.
      textStroke && ctx.strokeText(textLines[i], textX, textY);
      textFill && ctx.fillText(textLines[i], textX, textY);
      textY += lineHeight;
    }
  }
}

function renderRichText(hostEl, ctx, text, style, rect, prevEl) {
  // Do not do cache for rich text because of the complexity.
  // But `RectText` this will be restored, do not need to clear other cache like `Style::bind`.
  if (prevEl !== WILL_BE_RESTORED) {
    ctx.__attrCachedBy = ContextCachedBy.NONE;
  }

  var contentBlock = hostEl.__textCotentBlock;

  if (!contentBlock || hostEl.__dirtyText) {
    contentBlock = hostEl.__textCotentBlock = textContain.parseRichText(text, style);
  }

  drawRichText(hostEl, ctx, contentBlock, style, rect);
}

function drawRichText(hostEl, ctx, contentBlock, style, rect) {
  var contentWidth = contentBlock.width;
  var outerWidth = contentBlock.outerWidth;
  var outerHeight = contentBlock.outerHeight;
  var textPadding = style.textPadding;
  var boxPos = getBoxPosition(_tmpBoxPositionResult, hostEl, style, rect);
  var baseX = boxPos.baseX;
  var baseY = boxPos.baseY;
  var textAlign = boxPos.textAlign;
  var textVerticalAlign = boxPos.textVerticalAlign; // Origin of textRotation should be the base point of text drawing.

  applyTextRotation(ctx, style, rect, baseX, baseY);
  var boxX = textContain.adjustTextX(baseX, outerWidth, textAlign);
  var boxY = textContain.adjustTextY(baseY, outerHeight, textVerticalAlign);
  var xLeft = boxX;
  var lineTop = boxY;

  if (textPadding) {
    xLeft += textPadding[3];
    lineTop += textPadding[0];
  }

  var xRight = xLeft + contentWidth;
  needDrawBackground(style) && drawBackground(hostEl, ctx, style, boxX, boxY, outerWidth, outerHeight);

  for (var i = 0; i < contentBlock.lines.length; i++) {
    var line = contentBlock.lines[i];
    var tokens = line.tokens;
    var tokenCount = tokens.length;
    var lineHeight = line.lineHeight;
    var usedWidth = line.width;
    var leftIndex = 0;
    var lineXLeft = xLeft;
    var lineXRight = xRight;
    var rightIndex = tokenCount - 1;
    var token;

    while (leftIndex < tokenCount && (token = tokens[leftIndex], !token.textAlign || token.textAlign === 'left')) {
      placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXLeft, 'left');
      usedWidth -= token.width;
      lineXLeft += token.width;
      leftIndex++;
    }

    while (rightIndex >= 0 && (token = tokens[rightIndex], token.textAlign === 'right')) {
      placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXRight, 'right');
      usedWidth -= token.width;
      lineXRight -= token.width;
      rightIndex--;
    } // The other tokens are placed as textAlign 'center' if there is enough space.


    lineXLeft += (contentWidth - (lineXLeft - xLeft) - (xRight - lineXRight) - usedWidth) / 2;

    while (leftIndex <= rightIndex) {
      token = tokens[leftIndex]; // Consider width specified by user, use 'center' rather than 'left'.

      placeToken(hostEl, ctx, token, style, lineHeight, lineTop, lineXLeft + token.width / 2, 'center');
      lineXLeft += token.width;
      leftIndex++;
    }

    lineTop += lineHeight;
  }
}

function applyTextRotation(ctx, style, rect, x, y) {
  // textRotation only apply in RectText.
  if (rect && style.textRotation) {
    var origin = style.textOrigin;

    if (origin === 'center') {
      x = rect.width / 2 + rect.x;
      y = rect.height / 2 + rect.y;
    } else if (origin) {
      x = origin[0] + rect.x;
      y = origin[1] + rect.y;
    }

    ctx.translate(x, y); // Positive: anticlockwise

    ctx.rotate(-style.textRotation);
    ctx.translate(-x, -y);
  }
}

function placeToken(hostEl, ctx, token, style, lineHeight, lineTop, x, textAlign) {
  var tokenStyle = style.rich[token.styleName] || {};
  tokenStyle.text = token.text; // 'ctx.textBaseline' is always set as 'middle', for sake of
  // the bias of "Microsoft YaHei".

  var textVerticalAlign = token.textVerticalAlign;
  var y = lineTop + lineHeight / 2;

  if (textVerticalAlign === 'top') {
    y = lineTop + token.height / 2;
  } else if (textVerticalAlign === 'bottom') {
    y = lineTop + lineHeight - token.height / 2;
  }

  !token.isLineHolder && needDrawBackground(tokenStyle) && drawBackground(hostEl, ctx, tokenStyle, textAlign === 'right' ? x - token.width : textAlign === 'center' ? x - token.width / 2 : x, y - token.height / 2, token.width, token.height);
  var textPadding = token.textPadding;

  if (textPadding) {
    x = getTextXForPadding(x, textAlign, textPadding);
    y -= token.height / 2 - textPadding[2] - token.textHeight / 2;
  }

  setCtx(ctx, 'shadowBlur', dataUtil.retrieve3(tokenStyle.textShadowBlur, style.textShadowBlur, 0));
  setCtx(ctx, 'shadowColor', tokenStyle.textShadowColor || style.textShadowColor || 'transparent');
  setCtx(ctx, 'shadowOffsetX', dataUtil.retrieve3(tokenStyle.textShadowOffsetX, style.textShadowOffsetX, 0));
  setCtx(ctx, 'shadowOffsetY', dataUtil.retrieve3(tokenStyle.textShadowOffsetY, style.textShadowOffsetY, 0));
  setCtx(ctx, 'textAlign', textAlign); // Force baseline to be "middle". Otherwise, if using "top", the
  // text will offset downward a little bit in font "Microsoft YaHei".

  setCtx(ctx, 'textBaseline', 'middle');
  setCtx(ctx, 'font', token.font || DEFAULT_FONT);
  var textStroke = getStroke(tokenStyle.textStroke || style.textStroke, textStrokeWidth);
  var textFill = getFill(tokenStyle.textFill || style.textFill);
  var textStrokeWidth = dataUtil.retrieve2(tokenStyle.textStrokeWidth, style.textStrokeWidth); // Fill after stroke so the outline will not cover the main part.

  if (textStroke) {
    setCtx(ctx, 'lineWidth', textStrokeWidth);
    setCtx(ctx, 'strokeStyle', textStroke);
    ctx.strokeText(token.text, x, y);
  }

  if (textFill) {
    setCtx(ctx, 'fillStyle', textFill);
    ctx.fillText(token.text, x, y);
  }
}

function needDrawBackground(style) {
  return !!(style.textBackgroundColor || style.textBorderWidth && style.textBorderColor);
} // style: {textBackgroundColor, textBorderWidth, textBorderColor, textBorderRadius, text}
// shape: {x, y, width, height}


function drawBackground(hostEl, ctx, style, x, y, width, height) {
  var textBackgroundColor = style.textBackgroundColor;
  var textBorderWidth = style.textBorderWidth;
  var textBorderColor = style.textBorderColor;
  var isPlainBg = dataUtil.isString(textBackgroundColor);
  setCtx(ctx, 'shadowBlur', style.textBoxShadowBlur || 0);
  setCtx(ctx, 'shadowColor', style.textBoxShadowColor || 'transparent');
  setCtx(ctx, 'shadowOffsetX', style.textBoxShadowOffsetX || 0);
  setCtx(ctx, 'shadowOffsetY', style.textBoxShadowOffsetY || 0);

  if (isPlainBg || textBorderWidth && textBorderColor) {
    ctx.beginPath();
    var textBorderRadius = style.textBorderRadius;

    if (!textBorderRadius) {
      ctx.rect(x, y, width, height);
    } else {
      roundRectHelper.buildPath(ctx, {
        x: x,
        y: y,
        width: width,
        height: height,
        r: textBorderRadius
      });
    }

    ctx.closePath();
  }

  if (isPlainBg) {
    setCtx(ctx, 'fillStyle', textBackgroundColor);

    if (style.fillOpacity != null) {
      var originalGlobalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = style.fillOpacity * style.opacity;
      ctx.fill();
      ctx.globalAlpha = originalGlobalAlpha;
    } else {
      ctx.fill();
    }
  } else if (dataUtil.isObject(textBackgroundColor)) {
    var image = textBackgroundColor.image;
    image = imageHelper.createOrUpdateImage(image, null, hostEl, onBgImageLoaded, textBackgroundColor);

    if (image && imageHelper.isImageReady(image)) {
      ctx.drawImage(image, x, y, width, height);
    }
  }

  if (textBorderWidth && textBorderColor) {
    setCtx(ctx, 'lineWidth', textBorderWidth);
    setCtx(ctx, 'strokeStyle', textBorderColor);

    if (style.strokeOpacity != null) {
      var originalGlobalAlpha = ctx.globalAlpha;
      ctx.globalAlpha = style.strokeOpacity * style.opacity;
      ctx.stroke();
      ctx.globalAlpha = originalGlobalAlpha;
    } else {
      ctx.stroke();
    }
  }
}

function onBgImageLoaded(image, textBackgroundColor) {
  // Replace image, so that `contain/text.js#parseRichText`
  // will get correct result in next tick.
  textBackgroundColor.image = image;
}

function getBoxPosition(out, hostEl, style, rect) {
  var baseX = style.x || 0;
  var baseY = style.y || 0;
  var textAlign = style.textAlign;
  var textVerticalAlign = style.textVerticalAlign; // Text position represented by coord

  if (rect) {
    var textPosition = style.textPosition;

    if (textPosition instanceof Array) {
      // Percent
      baseX = rect.x + parsePercent(textPosition[0], rect.width);
      baseY = rect.y + parsePercent(textPosition[1], rect.height);
    } else {
      var res = hostEl && hostEl.calculateTextPosition ? hostEl.calculateTextPosition(_tmpTextPositionResult, style, rect) : textContain.calculateTextPosition(_tmpTextPositionResult, style, rect);
      baseX = res.x;
      baseY = res.y; // Default align and baseline when has textPosition

      textAlign = textAlign || res.textAlign;
      textVerticalAlign = textVerticalAlign || res.textVerticalAlign;
    } // textOffset is only support in RectText, otherwise
    // we have to adjust boundingRect for textOffset.


    var textOffset = style.textOffset;

    if (textOffset) {
      baseX += textOffset[0];
      baseY += textOffset[1];
    }
  }

  out = out || {};
  out.baseX = baseX;
  out.baseY = baseY;
  out.textAlign = textAlign;
  out.textVerticalAlign = textVerticalAlign;
  return out;
}

function setCtx(ctx, prop, value) {
  ctx[prop] = fixShadow(ctx, prop, value);
  return ctx[prop];
}
/**
 * @param {String} [stroke] If specified, do not check style.textStroke.
 * @param {String} [lineWidth] If specified, do not check style.textStroke.
 * @param {Number} style
 */


function getStroke(stroke, lineWidth) {
  return stroke == null || lineWidth <= 0 || stroke === 'transparent' || stroke === 'none' ? null // TODO pattern and gradient?
  : stroke.image || stroke.colorStops ? '#000' : stroke;
}

function getFill(fill) {
  return fill == null || fill === 'none' ? null // TODO pattern and gradient?
  : fill.image || fill.colorStops ? '#000' : fill;
}

function parsePercent(value, maxValue) {
  if (typeof value === 'string') {
    if (value.lastIndexOf('%') >= 0) {
      return parseFloat(value) / 100 * maxValue;
    }

    return parseFloat(value);
  }

  return value;
}

function getTextXForPadding(x, textAlign, textPadding) {
  return textAlign === 'right' ? x - textPadding[1] : textAlign === 'center' ? x + textPadding[3] / 2 - textPadding[1] / 2 : x + textPadding[3];
}
/**
 * @param {String} text
 * @param {Style} style
 * @return {boolean}
 */


function needDrawText(text, style) {
  return text != null && (text || style.textBackgroundColor || style.textBorderWidth && style.textBorderColor || style.textPadding);
}

exports.normalizeTextStyle = normalizeTextStyle;
exports.renderText = renderText;
exports.getBoxPosition = getBoxPosition;
exports.getStroke = getStroke;
exports.getFill = getFill;
exports.parsePercent = parsePercent;
exports.needDrawText = needDrawText;
}, function(modId) { var map = {"../../core/utils/data_structure_util":1582161598602,"../../core/contain/text":1582161598637,"./round_rect":1582161598639,"./image":1582161598638,"./fix_shadow":1582161598631,"../constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598637, function(require, module, exports) {
var BoundingRect = require("../../graphic/transform/BoundingRect");

var imageHelper = require("../../graphic/utils/image");

var _data_structure_util = require("../utils/data_structure_util");

var extend = _data_structure_util.extend;
var retrieve2 = _data_structure_util.retrieve2;
var retrieve3 = _data_structure_util.retrieve3;
var trim = _data_structure_util.trim;

var _canvas_util = require("../utils/canvas_util");

var getContext = _canvas_util.getContext;

var _constants = require("../../graphic/constants");

var mathMax = _constants.mathMax;
var mathFloor = _constants.mathFloor;
var textWidthCache = {};
var textWidthCacheCounter = 0;
var TEXT_CACHE_MAX = 5000;
var STYLE_REG = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;
var DEFAULT_FONT = '12px sans-serif'; // Avoid assign to an exported variable, for transforming to cjs.

var methods = {};

function $override(name, fn) {
  methods[name] = fn;
}
/**
 * @public
 * @param {String} text
 * @param {String} font
 * @return {Number} width
 */


function getWidth(text, font) {
  font = font || DEFAULT_FONT;
  var key = text + ':' + font;

  if (textWidthCache[key]) {
    return textWidthCache[key];
  }

  var textLines = (text + '').split('\n');
  var width = 0;

  for (var i = 0, l = textLines.length; i < l; i++) {
    // textContain.measureText may be overrided in SVG.
    width = mathMax(measureText(textLines[i], font).width, width);
  }

  if (textWidthCacheCounter > TEXT_CACHE_MAX) {
    textWidthCacheCounter = 0;
    textWidthCache = {};
  }

  textWidthCacheCounter++;
  textWidthCache[key] = width;
  return width;
}
/**
 * @public
 * @param {String} text
 * @param {String} font
 * @param {String} [textAlign='left']
 * @param {String} [textVerticalAlign='top']
 * @param {Array<Number>} [textPadding]
 * @param {Object} [rich]
 * @param {Object} [truncate]
 * @return {Object} {x, y, width, height, lineHeight}
 */


function getBoundingRect(text, font, textAlign, textVerticalAlign, textPadding, textLineHeight, rich, truncate) {
  return rich ? getRichTextRect(text, font, textAlign, textVerticalAlign, textPadding, textLineHeight, rich, truncate) : getPlainTextRect(text, font, textAlign, textVerticalAlign, textPadding, textLineHeight, truncate);
}

function getPlainTextRect(text, font, textAlign, textVerticalAlign, textPadding, textLineHeight, truncate) {
  var contentBlock = parsePlainText(text, font, textPadding, textLineHeight, truncate);
  var outerWidth = getWidth(text, font);

  if (textPadding) {
    outerWidth += textPadding[1] + textPadding[3];
  }

  var outerHeight = contentBlock.outerHeight;
  var x = adjustTextX(0, outerWidth, textAlign);
  var y = adjustTextY(0, outerHeight, textVerticalAlign);
  var rect = new BoundingRect(x, y, outerWidth, outerHeight);
  rect.lineHeight = contentBlock.lineHeight;
  return rect;
}

function getRichTextRect(text, font, textAlign, textVerticalAlign, textPadding, textLineHeight, rich, truncate) {
  var contentBlock = parseRichText(text, {
    rich: rich,
    truncate: truncate,
    font: font,
    textAlign: textAlign,
    textPadding: textPadding,
    textLineHeight: textLineHeight
  });
  var outerWidth = contentBlock.outerWidth;
  var outerHeight = contentBlock.outerHeight;
  var x = adjustTextX(0, outerWidth, textAlign);
  var y = adjustTextY(0, outerHeight, textVerticalAlign);
  return new BoundingRect(x, y, outerWidth, outerHeight);
}
/**
 * @public
 * @param {Number} x
 * @param {Number} width
 * @param {String} [textAlign='left']
 * @return {Number} Adjusted x.
 */


function adjustTextX(x, width, textAlign) {
  // FIXME Right to left language
  if (textAlign === 'right') {
    x -= width;
  } else if (textAlign === 'center') {
    x -= width / 2;
  }

  return x;
}
/**
 * @public
 * @param {Number} y
 * @param {Number} height
 * @param {String} [textVerticalAlign='top']
 * @return {Number} Adjusted y.
 */


function adjustTextY(y, height, textVerticalAlign) {
  if (textVerticalAlign === 'middle') {
    y -= height / 2;
  } else if (textVerticalAlign === 'bottom') {
    y -= height;
  }

  return y;
}
/**
 * Follow same interface to `Displayable.prototype.calculateTextPosition`.
 * @public
 * @param {Obejct} [out] Prepared out object. If not input, auto created in the method.
 * @param {Style} style where `textPosition` and `textDistance` are visited.
 * @param {Object} rect {x, y, width, height} Rect of the host elment, according to which the text positioned.
 * @return {Object} The input `out`. Set: {x, y, textAlign, textVerticalAlign}
 */


function calculateTextPosition(out, style, rect) {
  var textPosition = style.textPosition;
  var distance = style.textDistance;
  var x = rect.x;
  var y = rect.y;
  distance = distance || 0;
  var height = rect.height;
  var width = rect.width;
  var halfHeight = height / 2;
  var textAlign = 'left';
  var textVerticalAlign = 'top';

  switch (textPosition) {
    case 'left':
      x -= distance;
      y += halfHeight;
      textAlign = 'right';
      textVerticalAlign = 'middle';
      break;

    case 'right':
      x += distance + width;
      y += halfHeight;
      textVerticalAlign = 'middle';
      break;

    case 'top':
      x += width / 2;
      y -= distance;
      textAlign = 'center';
      textVerticalAlign = 'bottom';
      break;

    case 'bottom':
      x += width / 2;
      y += height + distance;
      textAlign = 'center';
      break;

    case 'inside':
      x += width / 2;
      y += halfHeight;
      textAlign = 'center';
      textVerticalAlign = 'middle';
      break;

    case 'insideLeft':
      x += distance;
      y += halfHeight;
      textVerticalAlign = 'middle';
      break;

    case 'insideRight':
      x += width - distance;
      y += halfHeight;
      textAlign = 'right';
      textVerticalAlign = 'middle';
      break;

    case 'insideTop':
      x += width / 2;
      y += distance;
      textAlign = 'center';
      break;

    case 'insideBottom':
      x += width / 2;
      y += height - distance;
      textAlign = 'center';
      textVerticalAlign = 'bottom';
      break;

    case 'insideTopLeft':
      x += distance;
      y += distance;
      break;

    case 'insideTopRight':
      x += width - distance;
      y += distance;
      textAlign = 'right';
      break;

    case 'insideBottomLeft':
      x += distance;
      y += height - distance;
      textVerticalAlign = 'bottom';
      break;

    case 'insideBottomRight':
      x += width - distance;
      y += height - distance;
      textAlign = 'right';
      textVerticalAlign = 'bottom';
      break;
  }

  out = out || {};
  out.x = x;
  out.y = y;
  out.textAlign = textAlign;
  out.textVerticalAlign = textVerticalAlign;
  return out;
}
/**
 * To be removed. But still do not remove in case that some one has imported it.
 * @deprecated
 * @public
 * @param {stirng} textPosition
 * @param {Object} rect {x, y, width, height}
 * @param {Number} distance
 * @return {Object} {x, y, textAlign, textVerticalAlign}
 */


function adjustTextPositionOnRect(textPosition, rect, distance) {
  var dummyStyle = {
    textPosition: textPosition,
    textDistance: distance
  };
  return calculateTextPosition({}, dummyStyle, rect);
}
/**
 * Show ellipsis if overflow.
 *
 * @public
 * @param  {String} text
 * @param  {String} containerWidth
 * @param  {String} font
 * @param  {Number} [ellipsis='...']
 * @param  {Object} [options]
 * @param  {Number} [options.maxIterations=3]
 * @param  {Number} [options.minChar=0] If truncate result are less
 *                  then minChar, ellipsis will not show, which is
 *                  better for user hint in some cases.
 * @param  {Number} [options.placeholder=''] When all truncated, use the placeholder.
 * @return {String}
 */


function truncateText(text, containerWidth, font, ellipsis, options) {
  if (!containerWidth) {
    return '';
  }

  var textLines = (text + '').split('\n');
  options = prepareTruncateOptions(containerWidth, font, ellipsis, options); // FIXME
  // It is not appropriate that every line has '...' when truncate multiple lines.

  for (var i = 0, len = textLines.length; i < len; i++) {
    textLines[i] = truncateSingleLine(textLines[i], options);
  }

  return textLines.join('\n');
}

function prepareTruncateOptions(containerWidth, font, ellipsis, options) {
  options = extend({}, options);
  options.font = font;
  ellipsis = retrieve2(ellipsis, '...');
  options.maxIterations = retrieve2(options.maxIterations, 2);
  var minChar = options.minChar = retrieve2(options.minChar, 0); // FIXME
  // Other languages?

  options.cnCharWidth = getWidth('国', font); // FIXME
  // Consider proportional font?

  var ascCharWidth = options.ascCharWidth = getWidth('a', font);
  options.placeholder = retrieve2(options.placeholder, ''); // Example 1: minChar: 3, text: 'asdfzxcv', truncate result: 'asdf', but not: 'a...'.
  // Example 2: minChar: 3, text: '维度', truncate result: '维', but not: '...'.

  var contentWidth = containerWidth = mathMax(0, containerWidth - 1); // Reserve some gap.

  for (var i = 0; i < minChar && contentWidth >= ascCharWidth; i++) {
    contentWidth -= ascCharWidth;
  }

  var ellipsisWidth = getWidth(ellipsis, font);

  if (ellipsisWidth > contentWidth) {
    ellipsis = '';
    ellipsisWidth = 0;
  }

  contentWidth = containerWidth - ellipsisWidth;
  options.ellipsis = ellipsis;
  options.ellipsisWidth = ellipsisWidth;
  options.contentWidth = contentWidth;
  options.containerWidth = containerWidth;
  return options;
}

function truncateSingleLine(textLine, options) {
  var containerWidth = options.containerWidth;
  var font = options.font;
  var contentWidth = options.contentWidth;

  if (!containerWidth) {
    return '';
  }

  var lineWidth = getWidth(textLine, font);

  if (lineWidth <= containerWidth) {
    return textLine;
  }

  for (var j = 0;; j++) {
    if (lineWidth <= contentWidth || j >= options.maxIterations) {
      textLine += options.ellipsis;
      break;
    }

    var subLength = j === 0 ? estimateLength(textLine, contentWidth, options.ascCharWidth, options.cnCharWidth) : lineWidth > 0 ? mathFloor(textLine.length * contentWidth / lineWidth) : 0;
    textLine = textLine.substr(0, subLength);
    lineWidth = getWidth(textLine, font);
  }

  if (textLine === '') {
    textLine = options.placeholder;
  }

  return textLine;
}

function estimateLength(text, contentWidth, ascCharWidth, cnCharWidth) {
  var width = 0;
  var i = 0;

  for (var len = text.length; i < len && width < contentWidth; i++) {
    var charCode = text.charCodeAt(i);
    width += 0 <= charCode && charCode <= 127 ? ascCharWidth : cnCharWidth;
  }

  return i;
}
/**
 * @public
 * @param {String} font
 * @return {Number} line height
 */


function getLineHeight(font) {
  // FIXME A rough approach.
  return getWidth('国', font);
}
/**
 * @public
 * @param {String} text
 * @param {String} font
 * @return {Object} width
 */


function measureText(text, font) {
  return methods.measureText(text, font);
} // Avoid assign to an exported variable, for transforming to cjs.


methods.measureText = function (text, font) {
  var ctx = getContext();
  ctx.font = font || DEFAULT_FONT;
  return ctx.measureText(text);
};
/**
 * @public
 * @param {String} text
 * @param {String} font
 * @param {Object} [truncate]
 * @return {Object} block: {lineHeight, lines, height, outerHeight, canCacheByTextString}
 *  Notice: for performance, do not calculate outerWidth util needed.
 *  `canCacheByTextString` means the result `lines` is only determined by the input `text`.
 *  Thus we can simply comparing the `input` text to determin whether the result changed,
 *  without travel the result `lines`.
 */


function parsePlainText(text, font, padding, textLineHeight, truncate) {
  text != null && (text += '');
  var lineHeight = retrieve2(textLineHeight, getLineHeight(font));
  var lines = text ? text.split('\n') : [];
  var height = lines.length * lineHeight;
  var outerHeight = height;
  var canCacheByTextString = true;

  if (padding) {
    outerHeight += padding[0] + padding[2];
  }

  if (text && truncate) {
    canCacheByTextString = false;
    var truncOuterHeight = truncate.outerHeight;
    var truncOuterWidth = truncate.outerWidth;

    if (truncOuterHeight != null && outerHeight > truncOuterHeight) {
      text = '';
      lines = [];
    } else if (truncOuterWidth != null) {
      var options = prepareTruncateOptions(truncOuterWidth - (padding ? padding[1] + padding[3] : 0), font, truncate.ellipsis, {
        minChar: truncate.minChar,
        placeholder: truncate.placeholder
      }); // FIXME
      // It is not appropriate that every line has '...' when truncate multiple lines.

      for (var i = 0, len = lines.length; i < len; i++) {
        lines[i] = truncateSingleLine(lines[i], options);
      }
    }
  }

  return {
    lines: lines,
    height: height,
    outerHeight: outerHeight,
    lineHeight: lineHeight,
    canCacheByTextString: canCacheByTextString
  };
}
/**
 * For example: 'some text {a|some text}other text{b|some text}xxx{c|}xxx'
 * Also consider 'bbbb{a|xxx\nzzz}xxxx\naaaa'.
 *
 * @public
 * @param {String} text
 * @param {Object} style
 * @return {Object} block
 * {
 *      width,
 *      height,
 *      lines: [{
 *          lineHeight,
 *          width,
 *          tokens: [[{
 *              styleName,
 *              text,
 *              width,      // include textPadding
 *              height,     // include textPadding
 *              textWidth, // pure text width
 *              textHeight, // pure text height
 *              lineHeihgt,
 *              font,
 *              textAlign,
 *              textVerticalAlign
 *          }], [...], ...]
 *      }, ...]
 * }
 * If styleName is undefined, it is plain text.
 */


function parseRichText(text, style) {
  var contentBlock = {
    lines: [],
    width: 0,
    height: 0
  };
  text != null && (text += '');

  if (!text) {
    return contentBlock;
  }

  var lastIndex = STYLE_REG.lastIndex = 0;
  var result;

  while ((result = STYLE_REG.exec(text)) != null) {
    var matchedIndex = result.index;

    if (matchedIndex > lastIndex) {
      pushTokens(contentBlock, text.substring(lastIndex, matchedIndex));
    }

    pushTokens(contentBlock, result[2], result[1]);
    lastIndex = STYLE_REG.lastIndex;
  }

  if (lastIndex < text.length) {
    pushTokens(contentBlock, text.substring(lastIndex, text.length));
  }

  var lines = contentBlock.lines;
  var contentHeight = 0;
  var contentWidth = 0; // For `textWidth: 100%`

  var pendingList = [];
  var stlPadding = style.textPadding;
  var truncate = style.truncate;
  var truncateWidth = truncate && truncate.outerWidth;
  var truncateHeight = truncate && truncate.outerHeight;

  if (stlPadding) {
    truncateWidth != null && (truncateWidth -= stlPadding[1] + stlPadding[3]);
    truncateHeight != null && (truncateHeight -= stlPadding[0] + stlPadding[2]);
  } // Calculate layout info of tokens.


  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var lineHeight = 0;
    var lineWidth = 0;

    for (var j = 0; j < line.tokens.length; j++) {
      var token = line.tokens[j];
      var tokenStyle = token.styleName && style.rich[token.styleName] || {}; // textPadding should not inherit from style.

      var textPadding = token.textPadding = tokenStyle.textPadding; // textFont has been asigned to font by `normalizeStyle`.

      var font = token.font = tokenStyle.font || style.font; // textHeight can be used when textVerticalAlign is specified in token.

      var tokenHeight = token.textHeight = retrieve2( // textHeight should not be inherited, consider it can be specified
      // as box height of the block.
      tokenStyle.textHeight, getLineHeight(font));
      textPadding && (tokenHeight += textPadding[0] + textPadding[2]);
      token.height = tokenHeight;
      token.lineHeight = retrieve3(tokenStyle.textLineHeight, style.textLineHeight, tokenHeight);
      token.textAlign = tokenStyle && tokenStyle.textAlign || style.textAlign;
      token.textVerticalAlign = tokenStyle && tokenStyle.textVerticalAlign || 'middle';

      if (truncateHeight != null && contentHeight + token.lineHeight > truncateHeight) {
        return {
          lines: [],
          width: 0,
          height: 0
        };
      }

      token.textWidth = getWidth(token.text, font);
      var tokenWidth = tokenStyle.textWidth;
      var tokenWidthNotSpecified = tokenWidth == null || tokenWidth === 'auto'; // Percent width, can be `100%`, can be used in drawing separate
      // line when box width is needed to be auto.

      if (typeof tokenWidth === 'string' && tokenWidth.charAt(tokenWidth.length - 1) === '%') {
        token.percentWidth = tokenWidth;
        pendingList.push(token);
        tokenWidth = 0; // Do not truncate in this case, because there is no user case
        // and it is too complicated.
      } else {
        if (tokenWidthNotSpecified) {
          tokenWidth = token.textWidth; // FIXME: If image is not loaded and textWidth is not specified, calling
          // `getBoundingRect()` will not get correct result.

          var textBackgroundColor = tokenStyle.textBackgroundColor;
          var bgImg = textBackgroundColor && textBackgroundColor.image; // Use cases:
          // (1) If image is not loaded, it will be loaded at render phase and call
          // `dirty()` and `textBackgroundColor.image` will be replaced with the loaded
          // image, and then the right size will be calculated here at the next tick.
          // See `graphic/helper/text.js`.
          // (2) If image loaded, and `textBackgroundColor.image` is image src string,
          // use `imageHelper.findExistImage` to find cached image.
          // `imageHelper.findExistImage` will always be called here before
          // `imageHelper.createOrUpdateImage` in `graphic/helper/text.js#renderRichText`
          // which ensures that image will not be rendered before correct size calcualted.

          if (bgImg) {
            bgImg = imageHelper.findExistImage(bgImg);

            if (imageHelper.isImageReady(bgImg)) {
              tokenWidth = mathMax(tokenWidth, bgImg.width * tokenHeight / bgImg.height);
            }
          }
        }

        var paddingW = textPadding ? textPadding[1] + textPadding[3] : 0;
        tokenWidth += paddingW;
        var remianTruncWidth = truncateWidth != null ? truncateWidth - lineWidth : null;

        if (remianTruncWidth != null && remianTruncWidth < tokenWidth) {
          if (!tokenWidthNotSpecified || remianTruncWidth < paddingW) {
            token.text = '';
            token.textWidth = tokenWidth = 0;
          } else {
            token.text = truncateText(token.text, remianTruncWidth - paddingW, font, truncate.ellipsis, {
              minChar: truncate.minChar
            });
            token.textWidth = getWidth(token.text, font);
            tokenWidth = token.textWidth + paddingW;
          }
        }
      }

      lineWidth += token.width = tokenWidth;
      tokenStyle && (lineHeight = mathMax(lineHeight, token.lineHeight));
    }

    line.width = lineWidth;
    line.lineHeight = lineHeight;
    contentHeight += lineHeight;
    contentWidth = mathMax(contentWidth, lineWidth);
  }

  contentBlock.outerWidth = contentBlock.width = retrieve2(style.textWidth, contentWidth);
  contentBlock.outerHeight = contentBlock.height = retrieve2(style.textHeight, contentHeight);

  if (stlPadding) {
    contentBlock.outerWidth += stlPadding[1] + stlPadding[3];
    contentBlock.outerHeight += stlPadding[0] + stlPadding[2];
  }

  for (var _i = 0; _i < pendingList.length; _i++) {
    var _token = pendingList[_i];
    var percentWidth = _token.percentWidth; // Should not base on outerWidth, because token can not be placed out of padding.

    _token.width = parseInt(percentWidth, 10) / 100 * contentWidth;
  }

  return contentBlock;
}

function pushTokens(block, str, styleName) {
  var isEmptyStr = str === '';
  var strs = str.split('\n');
  var lines = block.lines;

  for (var i = 0; i < strs.length; i++) {
    var text = strs[i];
    var token = {
      styleName: styleName,
      text: text,
      isLineHolder: !text && !isEmptyStr
    }; // The first token should be appended to the last line.

    if (!i) {
      var tokens = (lines[lines.length - 1] || (lines[0] = {
        tokens: []
      })).tokens; // Consider cases:
      // (1) ''.split('\n') => ['', '\n', ''], the '' at the first item
      // (which is a placeholder) should be replaced by new token.
      // (2) A image backage, where token likes {a|}.
      // (3) A redundant '' will affect textAlign in line.
      // (4) tokens with the same tplName should not be merged, because
      // they should be displayed in different box (with border and padding).

      var tokensLen = tokens.length;
      tokensLen === 1 && tokens[0].isLineHolder ? tokens[0] = token : // Consider text is '', only insert when it is the "lineHolder" or
      // "emptyStr". Otherwise a redundant '' will affect textAlign in line.
      (text || !tokensLen || isEmptyStr) && tokens.push(token);
    } // Other tokens always start a new line.
    else {
        // If there is '', insert it as a placeholder.
        lines.push({
          tokens: [token]
        });
      }
  }
}

function makeFont(style) {
  // FIXME in node-canvas fontWeight is before fontStyle
  // Use `fontSize` `fontFamily` to check whether font properties are defined.
  var font = (style.fontSize || style.fontFamily) && [style.fontStyle, style.fontWeight, (style.fontSize || 12) + 'px', // If font properties are defined, `fontFamily` should not be ignored.
  style.fontFamily || 'sans-serif'].join(' ');
  return font && trim(font) || style.textFont || style.font;
}

exports.DEFAULT_FONT = DEFAULT_FONT;
exports.$override = $override;
exports.getWidth = getWidth;
exports.getBoundingRect = getBoundingRect;
exports.adjustTextX = adjustTextX;
exports.adjustTextY = adjustTextY;
exports.calculateTextPosition = calculateTextPosition;
exports.adjustTextPositionOnRect = adjustTextPositionOnRect;
exports.truncateText = truncateText;
exports.getLineHeight = getLineHeight;
exports.measureText = measureText;
exports.parsePlainText = parsePlainText;
exports.parseRichText = parseRichText;
exports.makeFont = makeFont;
}, function(modId) { var map = {"../../graphic/transform/BoundingRect":1582161598623,"../../graphic/utils/image":1582161598638,"../utils/data_structure_util":1582161598602,"../utils/canvas_util":1582161598629,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598638, function(require, module, exports) {
var LRU = require("../../core/LRU");

var globalImageCache = new LRU(50);
/**
 * @param {string|HTMLImageElement|HTMLCanvasElement|Canvas} newImageOrSrc
 * @return {HTMLImageElement|HTMLCanvasElement|Canvas} image
 */

function findExistImage(newImageOrSrc) {
  if (typeof newImageOrSrc === 'string') {
    var cachedImgObj = globalImageCache.get(newImageOrSrc);
    return cachedImgObj && cachedImgObj.image;
  } else {
    return newImageOrSrc;
  }
}
/**
 * Caution: User should cache loaded images, but not just count on LRU.
 * Consider if required images more than LRU size, will dead loop occur?
 *
 * @param {string|HTMLImageElement|HTMLCanvasElement|Canvas} newImageOrSrc
 * @param {HTMLImageElement|HTMLCanvasElement|Canvas} image Existent image.
 * @param {Element} [hostEl] For calling `dirty`.
 * @param {Function} [cb] params: (image, cbPayload)
 * @param {Object} [cbPayload] Payload on cb calling.
 * @return {HTMLImageElement|HTMLCanvasElement|Canvas} image
 */


function createOrUpdateImage(newImageOrSrc, image, hostEl, cb, cbPayload) {
  if (!newImageOrSrc) {
    return image;
  } else if (typeof newImageOrSrc === 'string') {
    // Image should not be loaded repeatly.
    if (image && image.__qrImageSrc === newImageOrSrc || !hostEl) {
      return image;
    } // Only when there is no existent image or existent image src
    // is different, this method is responsible for load.


    var cachedImgObj = globalImageCache.get(newImageOrSrc);
    var pendingWrap = {
      hostEl: hostEl,
      cb: cb,
      cbPayload: cbPayload
    };

    if (cachedImgObj) {
      image = cachedImgObj.image;
      !isImageReady(image) && cachedImgObj.pending.push(pendingWrap);
    } else {
      image = new Image();
      image.onload = image.onerror = imageOnLoad;
      globalImageCache.put(newImageOrSrc, image.__cachedImgObj = {
        image: image,
        pending: [pendingWrap]
      });
      image.src = image.__qrImageSrc = newImageOrSrc;
    }

    return image;
  } // newImageOrSrc is an HTMLImageElement or HTMLCanvasElement or Canvas
  else {
      return newImageOrSrc;
    }
}

function imageOnLoad() {
  var cachedImgObj = this.__cachedImgObj;
  this.onload = this.onerror = this.__cachedImgObj = null;

  for (var i = 0; i < cachedImgObj.pending.length; i++) {
    var pendingWrap = cachedImgObj.pending[i];
    var cb = pendingWrap.cb;
    cb && cb(this, pendingWrap.cbPayload);
    pendingWrap.hostEl.dirty();
  }

  cachedImgObj.pending.length = 0;
}

function isImageReady(image) {
  return image && image.width && image.height;
}

exports.findExistImage = findExistImage;
exports.createOrUpdateImage = createOrUpdateImage;
exports.isImageReady = isImageReady;
}, function(modId) { var map = {"../../core/LRU":1582161598622}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598639, function(require, module, exports) {
/**
 * @param {Object} ctx
 * @param {Object} shape
 * @param {Number} shape.x
 * @param {Number} shape.y
 * @param {Number} shape.width
 * @param {Number} shape.height
 * @param {Number} shape.r
 */
function buildPath(ctx, shape) {
  var x = shape.x;
  var y = shape.y;
  var width = shape.width;
  var height = shape.height;
  var r = shape.r;
  var r1;
  var r2;
  var r3;
  var r4; // Convert width and height to positive for better borderRadius

  if (width < 0) {
    x = x + width;
    width = -width;
  }

  if (height < 0) {
    y = y + height;
    height = -height;
  }

  if (typeof r === 'number') {
    r1 = r2 = r3 = r4 = r;
  } else if (r instanceof Array) {
    if (r.length === 1) {
      r1 = r2 = r3 = r4 = r[0];
    } else if (r.length === 2) {
      r1 = r3 = r[0];
      r2 = r4 = r[1];
    } else if (r.length === 3) {
      r1 = r[0];
      r2 = r4 = r[1];
      r3 = r[2];
    } else {
      r1 = r[0];
      r2 = r[1];
      r3 = r[2];
      r4 = r[3];
    }
  } else {
    r1 = r2 = r3 = r4 = 0;
  }

  var total;

  if (r1 + r2 > width) {
    total = r1 + r2;
    r1 *= width / total;
    r2 *= width / total;
  }

  if (r3 + r4 > width) {
    total = r3 + r4;
    r3 *= width / total;
    r4 *= width / total;
  }

  if (r2 + r3 > height) {
    total = r2 + r3;
    r2 *= height / total;
    r3 *= height / total;
  }

  if (r1 + r4 > height) {
    total = r1 + r4;
    r1 *= height / total;
    r4 *= height / total;
  }

  ctx.moveTo(x + r1, y);
  ctx.lineTo(x + width - r2, y);
  r2 !== 0 && ctx.arc(x + width - r2, y + r2, r2, -Math.PI / 2, 0);
  ctx.lineTo(x + width, y + height - r3);
  r3 !== 0 && ctx.arc(x + width - r3, y + height - r3, r3, 0, Math.PI / 2);
  ctx.lineTo(x + r4, y + height);
  r4 !== 0 && ctx.arc(x + r4, y + height - r4, r4, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + r1);
  r1 !== 0 && ctx.arc(x + r1, y + r1, r1, Math.PI, Math.PI * 1.5);
}

exports.buildPath = buildPath;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598640, function(require, module, exports) {
var dataUtil = require("../core/utils/data_structure_util");

var classUtil = require("../core/utils/class_util");

var _event_util = require("../core/utils/event_util");

var Dispatcher = _event_util.Dispatcher;

var requestAnimationFrame = require("./utils/request_animation_frame");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @singleton
 * @class qrenderer.animation.GlobalAnimationMgr
 * 
 * Animation manager, global singleton, controls all the animation process.
 * Each QRenderer instance has a GlobalAnimationMgr instance. GlobalAnimationMgr 
 * is designed to manage all the AnimationProcesses inside a qrenderer instance.
 * 
 * 动画管理器，全局单例，控制和调度所有动画过程。每个 qrenderer 实例中会持有一个 
 * GlobalAnimationMgr 实例。GlobalAnimationMgr 会管理 qrenderer 实例中的所有
 * AnimationProcess。
 * 
 * @author pissang(https://github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
// TODO Additive animation
// http://iosoteric.com/additive-animations-animatewithduration-in-ios-8/
// https://developer.apple.com/videos/wwdc2014/#236
var GlobalAnimationMgr =
/*#__PURE__*/
function () {
  /**
   * @method constructor GlobalAnimationMgr
   * @param {Object} [options]
   */
  function GlobalAnimationMgr(options) {
    _classCallCheck(this, GlobalAnimationMgr);

    options = options || {};
    this._animationProcessList = [];
    this._running = false;
    this._timestamp;
    this._pausedTime; //ms

    this._pauseStart;
    this._paused = false;
    Dispatcher.call(this);
  }
  /**
   * @method addAnimationProcess
   * 添加 animationProcess
   * @param {qrenderer.animation.GlobalAnimationMgr} animationProcess
   */


  _createClass(GlobalAnimationMgr, [{
    key: "addAnimationProcess",
    value: function addAnimationProcess(animationProcess) {
      this._animationProcessList.push(animationProcess);
    }
    /**
     * @method removeAnimationProcess
     * 删除动画片段
     * @param {qrenderer.animation.GlobalAnimationMgr} animationProcess
     */

  }, {
    key: "removeAnimationProcess",
    value: function removeAnimationProcess(animationProcess) {
      var index = this._animationProcessList.findIndex(animationProcess);

      if (index >= 0) {
        this._animationProcessList.splice(index, 1);
      }
    }
    /**
     * @private
     * @method _update
     */

  }, {
    key: "_update",
    value: function _update() {
      var time = new Date().getTime() - this._pausedTime;

      var delta = time - this._timestamp;

      this._animationProcessList.forEach(function (ap, index) {
        ap.nextFrame(time, delta);
      });

      this._timestamp = time; // TODO:What's going on here?
      // 'frame' should be triggered before stage, because upper application
      // depends on the sequence (e.g., echarts-stream and finish
      // event judge)

      this.trigger('frame', delta);
    }
    /**
     * @private
     * @method _startLoop
     * 这里开始利用requestAnimationFrame递归执行，如果这里的 _update() 不能在16ms的
     * 时间内完成一轮动画，就会出现明显的卡顿。
     * 按照 W3C 的推荐标准 60fps，这里的 step 函数大约每隔 16ms 被调用一次
     * @see https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
     */

  }, {
    key: "_startLoop",
    value: function _startLoop() {
      var self = this;
      this._running = true;

      function nextFrame() {
        if (self._running) {
          requestAnimationFrame(nextFrame);
          !self._paused && self._update();
        }
      }

      requestAnimationFrame(nextFrame);
    }
    /**
     * @method start
     * Start all the animations.
     */

  }, {
    key: "start",
    value: function start() {
      this._timestamp = new Date().getTime();
      this._pausedTime = 0;

      this._startLoop();
    }
    /**
     * @method stop
     * Stop all the animations.
     */

  }, {
    key: "stop",
    value: function stop() {
      this._running = false;
    }
    /**
     * @method pause
     * Pause all the animations.
     */

  }, {
    key: "pause",
    value: function pause() {
      if (!this._paused) {
        this._pauseStart = new Date().getTime();
        this._paused = true;
      }
    }
    /**
     * @method resume
     * Resume all the animations.
     */

  }, {
    key: "resume",
    value: function resume() {
      if (this._paused) {
        this._pausedTime += new Date().getTime() - this._pauseStart;
        this._paused = false;
      }
    }
    /**
     * @method clear
     * Clear all the animations.
     */

  }, {
    key: "clear",
    value: function clear() {
      this._animationProcessList.length = 0;
    }
    /**
     * @method isFinished
     * Whether all the animations have finished.
     */

  }, {
    key: "isFinished",
    value: function isFinished() {
      var finished = true;

      this._animationProcessList.forEach(function (animationProcess, index) {
        if (!animationProcess.isFinished()) {
          finished = false;
        }
      });

      return finished;
    }
  }]);

  return GlobalAnimationMgr;
}();

classUtil.mixin(GlobalAnimationMgr, Dispatcher);
var _default = GlobalAnimationMgr;
module.exports = _default;
}, function(modId) { var map = {"../core/utils/data_structure_util":1582161598602,"../core/utils/class_util":1582161598604,"../core/utils/event_util":1582161598606,"./utils/request_animation_frame":1582161598626}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598641, function(require, module, exports) {
var Eventful = require("./Eventful");

var eventUtil = require("../core/utils/event_util");

var dataUtil = require("../core/utils/data_structure_util");

var classUtil = require("../core/utils/class_util");

var env = require("../core/env");

/**
 * @class qrenderer.event.DomEventProxy
 * DomEventProxy 的主要功能是：把原生的 DOM 事件代理（转发）到 QuarkRender 实例上，
 * 在 QuarkRendererEventHandler 类中会把事件进一步分发给 canvas 中绘制的元素。
 * 需要转发的大部分 DOM 事件挂载在 canvas 的外层容器 div 上面，例如：click, dbclick ；
 * 少部分 DOM 事件挂载在 document 对象上，例如：mousemove, mouseout。因为在实现拖拽和
 * 键盘交互的过程中，鼠标指针可能已经脱离了 canvas 所在的区域。
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var TOUCH_CLICK_DELAY = 300; // "page event" is defined in the comment of `[Page Event]`.

var pageEventSupported = env.domSupported;
/**
 * [Page Event]
 * "page events" are `pagemousemove` and `pagemouseup`.
 * They are triggered when a user pointer interacts on the whole webpage
 * rather than only inside the qrenderer area.
 *
 * The use case of page events can be, for example, if we are implementing a dragging feature:
 * ```js
 * qr.on('mousedown', function (event) {
 *     let dragging = true;
 *
 *     // Listen to `pagemousemove` and `pagemouseup` rather than `mousemove` and `mouseup`,
 *     // because `mousemove` and `mouseup` will not be triggered when the pointer is out
 *     // of the qrenderer area.
 *     qr.on('pagemousemove', handleMouseMove);
 *     qr.on('pagemouseup', handleMouseUp);
 *
 *     function handleMouseMove(event) {
 *         if (dragging) { ... }
 *     }
 *     function handleMouseUp(event) {
 *         dragging = false; ...
 *         qr.off('pagemousemove', handleMouseMove);
 *         qr.off('pagemouseup', handleMouseUp);
 *     }
 * });
 * ```
 *
 * [NOTICE]:
 * (1) There are cases that `pagemousexxx` will not be triggered when the pointer is out of
 * qrenderer area:
 * "document.eventUtil.addEventListener" is not available in the current runtime environment,
 * or there is any `stopPropagation` called at some user defined listeners on the ancestors
 * of the qrenderer dom.
 * (2) Although those bad cases exist, users do not need to worry about that. That is, if you
 * listen to `pagemousexxx`, you do not need to listen to the correspoinding event `mousexxx`
 * any more.
 * Becuase inside qrenderer area, `pagemousexxx` will always be triggered, where they are
 * triggered just after `mousexxx` triggered and sharing the same event object. Those bad
 * cases only happen when the pointer is out of qrenderer area.
 */

var localNativeListenerNames = function () {
  var mouseHandlerNames = ['click', 'dblclick', 'mousewheel', 'mouseout', 'mouseup', 'mousedown', 'mousemove', 'contextmenu'];
  var touchHandlerNames = ['touchstart', 'touchend', 'touchmove'];
  var pointerEventNameMap = {
    pointerdown: 1,
    pointerup: 1,
    pointermove: 1,
    pointerout: 1
  };
  var pointerHandlerNames = dataUtil.map(mouseHandlerNames, function (name) {
    var nm = name.replace('mouse', 'pointer');
    return pointerEventNameMap.hasOwnProperty(nm) ? nm : name;
  });
  return {
    mouse: mouseHandlerNames,
    touch: touchHandlerNames,
    pointer: pointerHandlerNames
  };
}();

var globalNativeListenerNames = {
  keyboard: ['keydown', 'keyup'],
  mouse: ['mousemove', 'mouseup'],
  touch: ['touchmove', 'touchend'],
  pointer: ['pointermove', 'pointerup']
};

function eventNameFix(name) {
  return name === 'mousewheel' && env.browser.firefox ? 'DOMMouseScroll' : name;
}

function isPointerFromTouch(event) {
  var pointerType = event.pointerType;
  return pointerType === 'pen' || pointerType === 'touch';
}
/**
 * Prevent mouse event from being dispatched after Touch Events action
 * @see <https://github.com/deltakosh/handjs/blob/master/src/hand.base.js>
 * 1. Mobile browsers dispatch mouse events 300ms after touchend.
 * 2. Chrome for Android dispatch mousedown for long-touch about 650ms
 * Result: Blocking Mouse Events for 700ms.
 *
 * @param {DOMHandlerScope} scope
 */


function setTouchTimer(scope) {
  scope.touching = true;

  if (scope.touchTimer != null) {
    clearTimeout(scope.touchTimer);
    scope.touchTimer = null;
  }

  scope.touchTimer = setTimeout(function () {
    scope.touching = false;
    scope.touchTimer = null;
  }, 700);
}

function markTriggeredFromLocal(event) {
  event && (event.qrIsFromLocal = true);
}

function isTriggeredFromLocal(event) {
  return !!(event && event.qrIsFromLocal);
} // Mark touch, which is useful in distinguish touch and
// mouse event in upper applicatoin.


function markTouch(event) {
  event && (event.qrByTouch = true);
} // ----------------------------
// Native event handlers BEGIN
// ----------------------------

/**
 * Local 指的是 Canvas 内部的区域。
 * Local DOM Handlers
 * @this {DomEventProxy}
 */


var localDOMHandlers = {
  mouseout: function mouseout(event) {
    event = eventUtil.normalizeEvent(this.dom, event);
    var element = event.toElement || event.relatedTarget;

    if (element !== this.dom) {
      while (element && element.nodeType !== 9) {
        // 忽略包含在root中的dom引起的mouseOut
        if (element === this.dom) {
          return;
        }

        element = element.parentNode;
      }
    } // 这里的 trigger() 方法是从 Eventful 里面的 mixin 进来的，调用这个 trigger() 方法的时候，是在 QuarkRender 内部，也就是 canvas 里面触发事件。
    // 这里实现的目的是：把接受到的 HTML 事件转发到了 canvas 内部。


    this.trigger('mouseout', event);
  },
  touchstart: function touchstart(event) {
    // Default mouse behaviour should not be disabled here.
    // For example, page may needs to be slided.
    event = eventUtil.normalizeEvent(this.dom, event);
    markTouch(event);
    this._lastTouchMoment = new Date();
    this.handler.processGesture(event, 'start'); // For consistent event listener for both touch device and mouse device,
    // we simulate "mouseover-->mousedown" in touch device. So we trigger
    // `mousemove` here (to trigger `mouseover` inside), and then trigger
    // `mousedown`.

    localDOMHandlers.mousemove.call(this, event);
    localDOMHandlers.mousedown.call(this, event);
  },
  touchmove: function touchmove(event) {
    event = eventUtil.normalizeEvent(this.dom, event);
    markTouch(event);
    this.handler.processGesture(event, 'change'); // Mouse move should always be triggered no matter whether
    // there is gestrue event, because mouse move and pinch may
    // be used at the same time.

    localDOMHandlers.mousemove.call(this, event);
  },
  touchend: function touchend(event) {
    event = eventUtil.normalizeEvent(this.dom, event);
    markTouch(event);
    this.handler.processGesture(event, 'end');
    localDOMHandlers.mouseup.call(this, event); // Do not trigger `mouseout` here, in spite of `mousemove`(`mouseover`) is
    // triggered in `touchstart`. This seems to be illogical, but by this mechanism,
    // we can conveniently implement "hover style" in both PC and touch device just
    // by listening to `mouseover` to add "hover style" and listening to `mouseout`
    // to remove "hover style" on an element, without any additional code for
    // compatibility. (`mouseout` will not be triggered in `touchend`, so "hover
    // style" will remain for user view)
    // click event should always be triggered no matter whether
    // there is gestrue event. System click can not be prevented.

    if (+new Date() - this._lastTouchMoment < TOUCH_CLICK_DELAY) {
      localDOMHandlers.click.call(this, event);
    }
  },
  pointerdown: function pointerdown(event) {
    localDOMHandlers.mousedown.call(this, event); // if (useMSGuesture(this, event)) {
    //     this._msGesture.addPointer(event.pointerId);
    // }
  },
  pointermove: function pointermove(event) {
    // FIXME
    // pointermove is so sensitive that it always triggered when
    // tap(click) on touch screen, which affect some judgement in
    // upper application. So, we dont support mousemove on MS touch
    // device yet.
    if (!isPointerFromTouch(event)) {
      localDOMHandlers.mousemove.call(this, event);
    }
  },
  pointerup: function pointerup(event) {
    localDOMHandlers.mouseup.call(this, event);
  },
  pointerout: function pointerout(event) {
    // pointerout will be triggered when tap on touch screen
    // (IE11+/Edge on MS Surface) after click event triggered,
    // which is inconsistent with the mousout behavior we defined
    // in touchend. So we unify them.
    // (check localDOMHandlers.touchend for detailed explanation)
    if (!isPointerFromTouch(event)) {
      localDOMHandlers.mouseout.call(this, event);
    }
  }
};
/**
 * Othere DOM UI Event handlers for qr dom.
 * QuarkRender 内部的 DOM 结构默认支持以下7个事件。
 * @this {DomEventProxy}
 */

dataUtil.each(['click', 'mousemove', 'mousedown', 'mouseup', 'mousewheel', 'dblclick', 'contextmenu'], function (name) {
  localDOMHandlers[name] = function (event) {
    event = eventUtil.normalizeEvent(this.dom, event);
    this.trigger(name, event);

    if (name === 'mousemove' || name === 'mouseup') {
      // Trigger `pagemousexxx` immediately with the same event object.
      // See the reason described in the comment of `[Page Event]`.
      this.trigger('page' + name, event);
    }
  };
});
/**
 * 这里用来监听外层 HTML 里面的 DOM 事件。监听这些事件的目的是为了方便实现拖拽功能，因为
 * 一旦鼠标离开 Canvas 的区域，就无法触发 Canvas 内部的 mousemove 和 mouseup 事件，这里直接
 * 监听外层 HTML 上的 mousemove 和 mouseup，绕开这种问题。
 * 
 * Page DOM UI Event handlers for global page.
 * @this {DomEventProxy}
 */

var globalDOMHandlers = {
  touchmove: function touchmove(event) {
    markTouch(event);
    globalDOMHandlers.mousemove.call(this, event);
  },
  touchend: function touchend(event) {
    markTouch(event);
    globalDOMHandlers.mouseup.call(this, event);
  },
  pointermove: function pointermove(event) {
    // FIXME
    // pointermove is so sensitive that it always triggered when
    // tap(click) on touch screen, which affect some judgement in
    // upper application. So, we dont support mousemove on MS touch
    // device yet.
    if (!isPointerFromTouch(event)) {
      globalDOMHandlers.mousemove.call(this, event);
    }
  },
  pointerup: function pointerup(event) {
    globalDOMHandlers.mouseup.call(this, event);
  },
  mousemove: function mousemove(event) {
    event = eventUtil.normalizeEvent(this.dom, event, true);
    this.trigger('pagemousemove', event);
  },
  mouseup: function mouseup(event) {
    event = eventUtil.normalizeEvent(this.dom, event, true);
    this.trigger('pagemouseup', event);
  },
  keyup: function keyup(event) {
    event = eventUtil.normalizeEvent(this.dom, event, true);
    this.trigger('pagekeyup', event);
  },
  keydown: function keydown(event) {
    event = eventUtil.normalizeEvent(this.dom, event, true);
    this.trigger('pagekeydown', event);
  }
}; // ----------------------------
// Native event handlers END
// ----------------------------

/**
 * @private
 * @method mountDOMEventListeners
 * @param {DomEventProxy} domEventProxy
 * @param {DOMHandlerScope} domHandlerScope
 * @param {Object} nativeListenerNames {mouse: Array<String>, touch: Array<String>, poiner: Array<String>}
 * @param {Boolean} localOrGlobal `true`: target local, `false`: target global.
 */

function mountDOMEventListeners(instance, scope, nativeListenerNames, localOrGlobal) {
  var domHandlers = scope.domHandlers;
  var domTarget = scope.domTarget;

  if (env.pointerEventsSupported) {
    // Only IE11+/Edge
    // 1. On devices that both enable touch and mouse (e.g., MS Surface and lenovo X240),
    // IE11+/Edge do not trigger touch event, but trigger pointer event and mouse event
    // at the same time.
    // 2. On MS Surface, it probablely only trigger mousedown but no mouseup when tap on
    // screen, which do not occurs in pointer event.
    // So we use pointer event to both detect touch gesture and mouse behavior.
    dataUtil.each(nativeListenerNames.pointer, function (nativeEventName) {
      mountSingle(nativeEventName, function (event) {
        if (localOrGlobal || !isTriggeredFromLocal(event)) {
          localOrGlobal && markTriggeredFromLocal(event);
          domHandlers[nativeEventName].call(instance, event);
        }
      });
    }); // FIXME
    // Note: MS Gesture require CSS touch-action set. But touch-action is not reliable,
    // which does not prevent defuault behavior occasionally (which may cause view port
    // zoomed in but use can not zoom it back). And event.preventDefault() does not work.
    // So we have to not to use MSGesture and not to support touchmove and pinch on MS
    // touch screen. And we only support click behavior on MS touch screen now.
    // MS Gesture Event is only supported on IE11+/Edge and on Windows 8+.
    // We dont support touch on IE on win7.
    // See <https://msdn.microsoft.com/en-us/library/dn433243(v=vs.85).aspx>
    // if (typeof MSGesture === 'function') {
    //     (this._msGesture = new MSGesture()).target = dom; // jshint ignore:line
    //     dom.eventUtil.addEventListener('MSGestureChange', onMSGestureChange);
    // }
  } else {
    if (env.touchEventsSupported) {
      dataUtil.each(nativeListenerNames.touch, function (nativeEventName) {
        mountSingle(nativeEventName, function (event) {
          if (localOrGlobal || !isTriggeredFromLocal(event)) {
            localOrGlobal && markTriggeredFromLocal(event);
            domHandlers[nativeEventName].call(instance, event);
            setTouchTimer(scope);
          }
        });
      }); // Handler of 'mouseout' event is needed in touch mode, which will be mounted below.
      // eventUtil.addEventListener(root, 'mouseout', this._mouseoutHandler);
    } // 1. Considering some devices that both enable touch and mouse event (like on MS Surface
    // and lenovo X240, @see #2350), we make mouse event be always listened, otherwise
    // mouse event can not be handle in those devices.
    // 2. On MS Surface, Chrome will trigger both touch event and mouse event. How to prevent
    // mouseevent after touch event triggered, see `setTouchTimer`.


    dataUtil.each(nativeListenerNames.mouse, function (nativeEventName) {
      mountSingle(nativeEventName, function (event) {
        event = eventUtil.getNativeEvent(event);

        if (!scope.touching && (localOrGlobal || !isTriggeredFromLocal(event))) {
          localOrGlobal && markTriggeredFromLocal(event);
          domHandlers[nativeEventName].call(instance, event);
        }
      });
    }); //挂载键盘事件

    dataUtil.each(nativeListenerNames.keyboard, function (nativeEventName) {
      mountSingle(nativeEventName, function (event) {
        if (localOrGlobal || !isTriggeredFromLocal(event)) {
          localOrGlobal && markTriggeredFromLocal(event);
          domHandlers[nativeEventName].call(instance, event);
        }
      });
    });
  } //用来监听原生 DOM 事件


  function mountSingle(nativeEventName, listener) {
    scope.mounted[nativeEventName] = listener;
    eventUtil.addEventListener(domTarget, eventNameFix(nativeEventName), listener);
  }
}
/**
 * @private
 * @method unmountDOMEventListeners
 * @param {Object} scope 
 */


function unmountDOMEventListeners(scope) {
  var mounted = scope.mounted;

  for (var nativeEventName in mounted) {
    if (mounted.hasOwnProperty(nativeEventName)) {
      eventUtil.removeEventListener(scope.domTarget, eventNameFix(nativeEventName), mounted[nativeEventName]);
    }
  }

  scope.mounted = {};
}

function DOMHandlerScope(domTarget, domHandlers) {
  this.domTarget = domTarget;
  this.domHandlers = domHandlers; // Key: eventName
  // value: mounted handler funcitons.
  // Used for unmount.

  this.mounted = {};
  this.touchTimer = null;
  this.touching = false;
}
/**
 * @method constructor
 * @param dom 被代理的 DOM 节点
 */


function DomEventProxy(dom) {
  Eventful.call(this);
  /**
   * @property dom
   */

  this.dom = dom;
  /**
   * @private
   * @property _localHandlerScope
   */

  this._localHandlerScope = new DOMHandlerScope(dom, localDOMHandlers);

  if (pageEventSupported) {
    /**
     * @private
     * @property _globalHandlerScope
     */
    this._globalHandlerScope = new DOMHandlerScope(document, globalDOMHandlers); //注意，这里直接监听 document 上的事件
  }
  /**
   * @private
   * @property _pageEventEnabled
   */


  this._pageEventEnabled = false; //在构造 DomEventProxy 实例的时候，挂载 DOM 事件监听器。

  mountDOMEventListeners(this, this._localHandlerScope, localNativeListenerNames, true);
}
/**
 * @private
 * @method dispose
 */


DomEventProxy.prototype.dispose = function () {
  unmountDOMEventListeners(this._localHandlerScope);

  if (pageEventSupported) {
    unmountDOMEventListeners(this._globalHandlerScope);
  }
};
/**
 * @private
 * @method setCursor
 */


DomEventProxy.prototype.setCursor = function (cursorStyle) {
  this.dom.style && (this.dom.style.cursor = cursorStyle || 'default');
};
/**
 * @private
 * @method togglePageEvent
 * The implementation of page event depends on listening to document.
 * So we should better only listen to that on needed, and remove the
 * listeners when do not need them to escape unexpected side-effect.
 * @param {Boolean} enableOrDisable `true`: enable page event. `false`: disable page event.
 */


DomEventProxy.prototype.togglePageEvent = function (enableOrDisable) {
  dataUtil.assert(enableOrDisable != null);

  if (pageEventSupported && this._pageEventEnabled ^ enableOrDisable) {
    this._pageEventEnabled = enableOrDisable;
    var globalHandlerScope = this._globalHandlerScope;
    enableOrDisable ? mountDOMEventListeners(this, globalHandlerScope, globalNativeListenerNames) : unmountDOMEventListeners(globalHandlerScope);
  }
}; //注意，DomEventProxy 也混入了 Eventful 里面提供的事件处理工具。


classUtil.mixin(DomEventProxy, Eventful);
var _default = DomEventProxy;
module.exports = _default;
}, function(modId) { var map = {"./Eventful":1582161598607,"../core/utils/event_util":1582161598606,"../core/utils/data_structure_util":1582161598602,"../core/utils/class_util":1582161598604,"../core/env":1582161598600}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598642, function(require, module, exports) {
var dataUtil = require("./core/utils/data_structure_util");

exports.dataUtil = dataUtil;

var colorUtil = require("./core/utils/color_util");

exports.color = colorUtil;

var pathUtil = require("./core/utils/path_util");

exports.path = pathUtil;

var canvasUtil = require("./core/utils/canvas_util");

exports.canvasUtil = canvasUtil;

var matrix = require("./core/utils/matrix");

exports.matrix = matrix;

var vector = require("./core/utils/vector");

exports.vector = vector;

var _SVGParser = require("./svg/SVGParser");

var parseSVG = _SVGParser.parseSVG;
exports.parseSVG = _SVGParser.parseSVG;

var _Group = require("./graphic/Group");

exports.Group = _Group;

var _Path = require("./graphic/Path");

exports.Path = _Path;

var _Image = require("./graphic/Image");

exports.Image = _Image;

var _CompoundPath = require("./graphic/CompoundPath");

exports.CompoundPath = _CompoundPath;

var _Text = require("./graphic/Text");

exports.Text = _Text;

var _IncrementalDisplayable = require("./graphic/IncrementalDisplayable");

exports.IncrementalDisplayable = _IncrementalDisplayable;

var _Arc = require("./graphic/shape/Arc");

exports.Arc = _Arc;

var _BezierCurve = require("./graphic/shape/BezierCurve");

exports.BezierCurve = _BezierCurve;

var _Circle = require("./graphic/shape/Circle");

exports.Circle = _Circle;

var _Droplet = require("./graphic/shape/Droplet");

exports.Droplet = _Droplet;

var _Ellipse = require("./graphic/shape/Ellipse");

exports.Ellipse = _Ellipse;

var _Heart = require("./graphic/shape/Heart");

exports.Heart = _Heart;

var _Isogon = require("./graphic/shape/Isogon");

exports.Isogon = _Isogon;

var _Line = require("./graphic/shape/Line");

exports.Line = _Line;

var _Polygon = require("./graphic/shape/Polygon");

exports.Polygon = _Polygon;

var _Polyline = require("./graphic/shape/Polyline");

exports.Polyline = _Polyline;

var _Rect = require("./graphic/shape/Rect");

exports.Rect = _Rect;

var _Ring = require("./graphic/shape/Ring");

exports.Ring = _Ring;

var _Rose = require("./graphic/shape/Rose");

exports.Rose = _Rose;

var _Sector = require("./graphic/shape/Sector");

exports.Sector = _Sector;

var _Star = require("./graphic/shape/Star");

exports.Star = _Star;

var _Trochoid = require("./graphic/shape/Trochoid");

exports.Trochoid = _Trochoid;

var _LinearGradient = require("./graphic/gradient/LinearGradient");

exports.LinearGradient = _LinearGradient;

var _RadialGradient = require("./graphic/gradient/RadialGradient");

exports.RadialGradient = _RadialGradient;

var _Pattern = require("./graphic/Pattern");

exports.Pattern = _Pattern;

var _BoundingRect = require("./graphic/transform/BoundingRect");

exports.BoundingRect = _BoundingRect;
}, function(modId) { var map = {"./core/utils/data_structure_util":1582161598602,"./core/utils/color_util":1582161598621,"./core/utils/path_util":1582161598643,"./core/utils/canvas_util":1582161598629,"./core/utils/matrix":1582161598615,"./core/utils/vector":1582161598605,"./svg/SVGParser":1582161598656,"./graphic/Group":1582161598612,"./graphic/Path":1582161598644,"./graphic/Image":1582161598633,"./graphic/CompoundPath":1582161598670,"./graphic/Text":1582161598657,"./graphic/IncrementalDisplayable":1582161598671,"./graphic/shape/Arc":1582161598672,"./graphic/shape/BezierCurve":1582161598673,"./graphic/shape/Circle":1582161598658,"./graphic/shape/Droplet":1582161598674,"./graphic/shape/Ellipse":1582161598661,"./graphic/shape/Heart":1582161598675,"./graphic/shape/Isogon":1582161598676,"./graphic/shape/Line":1582161598662,"./graphic/shape/Polygon":1582161598663,"./graphic/shape/Polyline":1582161598667,"./graphic/shape/Rect":1582161598659,"./graphic/shape/Ring":1582161598677,"./graphic/shape/Rose":1582161598678,"./graphic/shape/Sector":1582161598679,"./graphic/shape/Star":1582161598681,"./graphic/shape/Trochoid":1582161598682,"./graphic/gradient/LinearGradient":1582161598668,"./graphic/gradient/RadialGradient":1582161598683,"./graphic/Pattern":1582161598632,"./graphic/transform/BoundingRect":1582161598623}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598643, function(require, module, exports) {
var Path = require("../../graphic/Path");

var PathProxy = require("../../graphic/PathProxy");

var transformPath = require("./transform_path");

var _constants = require("../../graphic/constants");

var mathSqrt = _constants.mathSqrt;
var mathSin = _constants.mathSin;
var mathCos = _constants.mathCos;
var PI = _constants.PI;
var mathAcos = _constants.mathAcos;

// command chars
// var cc = [
//     'm', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z',
//     'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'
// ];
var vMag = function vMag(v) {
  return mathSqrt(v[0] * v[0] + v[1] * v[1]);
};

var vRatio = function vRatio(u, v) {
  return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
};

var vAngle = function vAngle(u, v) {
  return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * mathAcos(vRatio(u, v));
};

function processArc(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg, cmd, path) {
  var psi = psiDeg * (PI / 180.0);
  var xp = mathCos(psi) * (x1 - x2) / 2.0 + mathSin(psi) * (y1 - y2) / 2.0;
  var yp = -1 * mathSin(psi) * (x1 - x2) / 2.0 + mathCos(psi) * (y1 - y2) / 2.0;
  var lambda = xp * xp / (rx * rx) + yp * yp / (ry * ry);

  if (lambda > 1) {
    rx *= mathSqrt(lambda);
    ry *= mathSqrt(lambda);
  }

  var f = (fa === fs ? -1 : 1) * mathSqrt((rx * rx * (ry * ry) - rx * rx * (yp * yp) - ry * ry * (xp * xp)) / (rx * rx * (yp * yp) + ry * ry * (xp * xp))) || 0;
  var cxp = f * rx * yp / ry;
  var cyp = f * -ry * xp / rx;
  var cx = (x1 + x2) / 2.0 + mathCos(psi) * cxp - mathSin(psi) * cyp;
  var cy = (y1 + y2) / 2.0 + mathSin(psi) * cxp + mathCos(psi) * cyp;
  var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
  var u = [(xp - cxp) / rx, (yp - cyp) / ry];
  var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
  var dTheta = vAngle(u, v);

  if (vRatio(u, v) <= -1) {
    dTheta = PI;
  }

  if (vRatio(u, v) >= 1) {
    dTheta = 0;
  }

  if (fs === 0 && dTheta > 0) {
    dTheta = dTheta - 2 * PI;
  }

  if (fs === 1 && dTheta < 0) {
    dTheta = dTheta + 2 * PI;
  }

  path.addData(cmd, cx, cy, rx, ry, theta, dTheta, psi, fs);
}

var commandReg = /([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig; // Consider case:
// (1) delimiter can be comma or space, where continuous commas
// or spaces should be seen as one comma.
// (2) value can be like:
// '2e-4', 'l.5.9' (ignore 0), 'M-10-10', 'l-2.43e-1,34.9983',
// 'l-.5E1,54', '121-23-44-11' (no delimiter)

var numberReg = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g; // var valueSplitReg = /[\s,]+/;

function createPathProxyFromString(data) {
  if (!data) {
    return new PathProxy();
  } // var data = data.replace(/-/g, ' -')
  //     .replace(/  /g, ' ')
  //     .replace(/ /g, ',')
  //     .replace(/,,/g, ',');
  // var n;
  // create pipes so that we can split the data
  // for (n = 0; n < cc.length; n++) {
  //     cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
  // }
  // data = data.replace(/-/g, ',-');
  // create array
  // var arr = cs.split('|');
  // init context point


  var cpx = 0;
  var cpy = 0;
  var subpathX = cpx;
  var subpathY = cpy;
  var prevCmd;
  var path = new PathProxy();
  var CMD = PathProxy.CMD; // commandReg.lastIndex = 0;
  // var cmdResult;
  // while ((cmdResult = commandReg.exec(data)) != null) {
  //     var cmdStr = cmdResult[1];
  //     var cmdContent = cmdResult[2];

  var cmdList = data.match(commandReg);

  for (var l = 0; l < cmdList.length; l++) {
    var cmdText = cmdList[l];
    var cmdStr = cmdText.charAt(0);
    var cmd; // String#split is faster a little bit than String#replace or RegExp#exec.
    // var p = cmdContent.split(valueSplitReg);
    // var pLen = 0;
    // for (var i = 0; i < p.length; i++) {
    //     // '' and other invalid str => NaN
    //     var val = parseFloat(p[i]);
    //     !isNaN(val) && (p[pLen++] = val);
    // }

    var p = cmdText.match(numberReg) || [];
    var pLen = p.length;

    for (var i = 0; i < pLen; i++) {
      p[i] = parseFloat(p[i]);
    }

    var off = 0;

    while (off < pLen) {
      var ctlPtx;
      var ctlPty;
      var rx;
      var ry;
      var psi;
      var fa;
      var fs;
      var x1 = cpx;
      var y1 = cpy; // convert l, H, h, V, and v to L

      switch (cmdStr) {
        case 'l':
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'L':
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'm':
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD.M;
          path.addData(cmd, cpx, cpy);
          subpathX = cpx;
          subpathY = cpy;
          cmdStr = 'l';
          break;

        case 'M':
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD.M;
          path.addData(cmd, cpx, cpy);
          subpathX = cpx;
          subpathY = cpy;
          cmdStr = 'L';
          break;

        case 'h':
          cpx += p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'H':
          cpx = p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'v':
          cpy += p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'V':
          cpy = p[off++];
          cmd = CMD.L;
          path.addData(cmd, cpx, cpy);
          break;

        case 'C':
          cmd = CMD.C;
          path.addData(cmd, p[off++], p[off++], p[off++], p[off++], p[off++], p[off++]);
          cpx = p[off - 2];
          cpy = p[off - 1];
          break;

        case 'c':
          cmd = CMD.C;
          path.addData(cmd, p[off++] + cpx, p[off++] + cpy, p[off++] + cpx, p[off++] + cpy, p[off++] + cpx, p[off++] + cpy);
          cpx += p[off - 2];
          cpy += p[off - 1];
          break;

        case 'S':
          ctlPtx = cpx;
          ctlPty = cpy;
          var len = path.len();
          var pathData = path.data;

          if (prevCmd === CMD.C) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }

          cmd = CMD.C;
          x1 = p[off++];
          y1 = p[off++];
          cpx = p[off++];
          cpy = p[off++];
          path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
          break;

        case 's':
          ctlPtx = cpx;
          ctlPty = cpy;
          var len = path.len();
          var pathData = path.data;

          if (prevCmd === CMD.C) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }

          cmd = CMD.C;
          x1 = cpx + p[off++];
          y1 = cpy + p[off++];
          cpx += p[off++];
          cpy += p[off++];
          path.addData(cmd, ctlPtx, ctlPty, x1, y1, cpx, cpy);
          break;

        case 'Q':
          x1 = p[off++];
          y1 = p[off++];
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD.Q;
          path.addData(cmd, x1, y1, cpx, cpy);
          break;

        case 'q':
          x1 = p[off++] + cpx;
          y1 = p[off++] + cpy;
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD.Q;
          path.addData(cmd, x1, y1, cpx, cpy);
          break;

        case 'T':
          ctlPtx = cpx;
          ctlPty = cpy;
          var len = path.len();
          var pathData = path.data;

          if (prevCmd === CMD.Q) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }

          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD.Q;
          path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
          break;

        case 't':
          ctlPtx = cpx;
          ctlPty = cpy;
          var len = path.len();
          var pathData = path.data;

          if (prevCmd === CMD.Q) {
            ctlPtx += cpx - pathData[len - 4];
            ctlPty += cpy - pathData[len - 3];
          }

          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD.Q;
          path.addData(cmd, ctlPtx, ctlPty, cpx, cpy);
          break;

        case 'A':
          rx = p[off++];
          ry = p[off++];
          psi = p[off++];
          fa = p[off++];
          fs = p[off++];
          x1 = cpx, y1 = cpy;
          cpx = p[off++];
          cpy = p[off++];
          cmd = CMD.A;
          processArc(x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path);
          break;

        case 'a':
          rx = p[off++];
          ry = p[off++];
          psi = p[off++];
          fa = p[off++];
          fs = p[off++];
          x1 = cpx, y1 = cpy;
          cpx += p[off++];
          cpy += p[off++];
          cmd = CMD.A;
          processArc(x1, y1, cpx, cpy, fa, fs, rx, ry, psi, cmd, path);
          break;
      }
    }

    if (cmdStr === 'z' || cmdStr === 'Z') {
      cmd = CMD.Z;
      path.addData(cmd); // z may be in the middle of the path.

      cpx = subpathX;
      cpy = subpathY;
    }

    prevCmd = cmd;
  }

  path.toStatic();
  return path;
} // TODO Optimize double memory cost problem


function createPathOptions(str, opts) {
  var pathProxy = createPathProxyFromString(str);
  opts = opts || {};

  opts.buildPath = function (path) {
    if (path.setData) {
      path.setData(pathProxy.data); // Svg renderer don't have context

      var ctx = path.getContext();

      if (ctx) {
        path.rebuildPath(ctx);
      }
    } else {
      var ctx = path;
      pathProxy.rebuildPath(ctx);
    }
  };

  opts.applyTransform = function (m) {
    transformPath(pathProxy, m);
    this.dirty(true);
  };

  return opts;
}
/**
 * Create a Path object from path string data
 * http://www.w3.org/TR/SVG/paths.html#PathData
 * @param  {Object} opts Other options
 */


function createFromString(str, opts) {
  return new Path(createPathOptions(str, opts));
}
/**
 * Merge multiple paths
 */
// TODO Apply transform
// TODO stroke dash
// TODO Optimize double memory cost problem


function mergePath(pathEls, opts) {
  var pathList = [];
  var len = pathEls.length;

  for (var i = 0; i < len; i++) {
    var pathEl = pathEls[i];

    if (!pathEl.path) {
      pathEl.createPathProxy();
    }

    if (pathEl.__dirtyPath) {
      pathEl.buildPath(pathEl.path, pathEl.shape, true);
    }

    pathList.push(pathEl.path);
  }

  var pathBundle = new Path(opts); // Need path proxy.

  pathBundle.createPathProxy();

  pathBundle.buildPath = function (path) {
    path.appendPath(pathList); // Svg renderer don't have context

    var ctx = path.getContext();

    if (ctx) {
      path.rebuildPath(ctx);
    }
  };

  return pathBundle;
}

exports.createFromString = createFromString;
exports.mergePath = mergePath;
}, function(modId) { var map = {"../../graphic/Path":1582161598644,"../../graphic/PathProxy":1582161598645,"./transform_path":1582161598655,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598644, function(require, module, exports) {
var Displayable = require("./Displayable");

var dataUtil = require("../core/utils/data_structure_util");

var classUtil = require("../core/utils/class_util");

var PathProxy = require("./PathProxy");

var pathContain = require("../core/contain/path");

var Pattern = require("./Pattern");

var _constants = require("../graphic/constants");

var mathMax = _constants.mathMax;
var mathAbs = _constants.mathAbs;
var mathSqrt = _constants.mathSqrt;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.Path 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var Path =
/*#__PURE__*/
function (_Displayable) {
  _inherits(Path, _Displayable);

  /**
   * @method constructor Path
   * @param {Object} options
   */
  function Path(options) {
    var _this;

    _classCallCheck(this, Path);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Path).call(this, options));
    /**
     * @property {PathProxy}
     * @readOnly
     */

    _this.path = null;
    /**
     * @property {String} type
     */

    _this.type = 'path';
    /**
     * @private
     * @property __dirtyPath
     */

    _this.__dirtyPath = true;
    /**
     * @property {Number} strokeContainThreshold
     */

    _this.strokeContainThreshold = 5;
    /**
     * @property {Number} segmentIgnoreThreshold
     * This item default to be false. But in map series in echarts,
     * in order to improve performance, it should be set to true,
     * so the shorty segment won't draw.
     */

    _this.segmentIgnoreThreshold = 0;
    /**
     * @property {Boolean} subPixelOptimize
     * See `subPixelOptimize`.
     */

    _this.subPixelOptimize = false;
    classUtil.copyOwnProperties(_assertThisInitialized(_this), _this.options, ['style', 'shape']);
    return _this;
  }
  /**
   * @method brush
   * @param {Object} ctx 
   * @param {Element} prevEl 
   */


  _createClass(Path, [{
    key: "brush",
    value: function brush(ctx, prevEl) {
      var style = this.style;
      var path = this.path || new PathProxy(true);
      var hasStroke = style.hasStroke();
      var hasFill = style.hasFill();
      var fill = style.fill;
      var stroke = style.stroke;
      var hasFillGradient = hasFill && !!fill.colorStops;
      var hasStrokeGradient = hasStroke && !!stroke.colorStops;
      var hasFillPattern = hasFill && !!fill.image;
      var hasStrokePattern = hasStroke && !!stroke.image;
      style.bind(ctx, this, prevEl);
      this.setTransform(ctx);

      if (this.__dirty) {
        var rect; // Update gradient because bounding rect may changed

        if (hasFillGradient) {
          rect = rect || this.getBoundingRect();
          this._fillGradient = style.getGradient(ctx, fill, rect);
        }

        if (hasStrokeGradient) {
          rect = rect || this.getBoundingRect();
          this._strokeGradient = style.getGradient(ctx, stroke, rect);
        }
      } // Use the gradient or pattern


      if (hasFillGradient) {
        // PENDING If may have affect the state
        ctx.fillStyle = this._fillGradient;
      } else if (hasFillPattern) {
        ctx.fillStyle = Pattern.prototype.getCanvasPattern.call(fill, ctx);
      }

      if (hasStrokeGradient) {
        ctx.strokeStyle = this._strokeGradient;
      } else if (hasStrokePattern) {
        ctx.strokeStyle = Pattern.prototype.getCanvasPattern.call(stroke, ctx);
      }

      var lineDash = style.lineDash;
      var lineDashOffset = style.lineDashOffset;
      var ctxLineDash = !!ctx.setLineDash; // Update path sx, sy

      var scale = this.getGlobalScale();
      path.setScale(scale[0], scale[1], this.segmentIgnoreThreshold); // Proxy context
      // Rebuild path in following 2 cases
      // 1. Path is dirty
      // 2. Path needs javascript implemented lineDash stroking.
      //    In this case, lineDash information will not be saved in PathProxy

      if (this.__dirtyPath || lineDash && !ctxLineDash && hasStroke) {
        path.beginPath(ctx); // Setting line dash before build path

        if (lineDash && !ctxLineDash) {
          path.setLineDash(lineDash);
          path.setLineDashOffset(lineDashOffset);
        }

        this.buildPath(path, this.shape, false); // Clear path dirty flag

        if (this.path) {
          this.__dirtyPath = false;
        }
      } else {
        // Replay path building
        ctx.beginPath();
        this.path.rebuildPath(ctx);
      }

      if (hasFill) {
        if (style.fillOpacity != null) {
          var originalGlobalAlpha = ctx.globalAlpha;
          ctx.globalAlpha = style.fillOpacity * style.opacity;
          path.fill(ctx);
          ctx.globalAlpha = originalGlobalAlpha;
        } else {
          path.fill(ctx);
        }
      }

      if (lineDash && ctxLineDash) {
        ctx.setLineDash(lineDash);
        ctx.lineDashOffset = lineDashOffset;
      }

      if (hasStroke) {
        if (style.strokeOpacity != null) {
          var _originalGlobalAlpha = ctx.globalAlpha;
          ctx.globalAlpha = style.strokeOpacity * style.opacity;
          path.stroke(ctx);
          ctx.globalAlpha = _originalGlobalAlpha;
        } else {
          path.stroke(ctx);
        }
      }

      if (lineDash && ctxLineDash) {
        // PENDING
        // Remove lineDash
        ctx.setLineDash([]);
      } // Draw rect text


      if (style.text != null) {
        // Only restore transform when needs draw text.
        this.restoreTransform(ctx);
        this.drawRectText(ctx, this.getBoundingRect());
      }
    }
    /**
     * @method buildPath
     * 
     * Each subclass should provide its own implement for this method.
     * When build path, some shape may decide if use moveTo to begin a new subpath or closePath, like in circle.
     * 
     * 每个子类都需要为此方法提供自己的实现。
     * 在构建路径时，某些形状需要根据情况决定使用 moveTo 来开始一段子路径，或者直接用 closePath 来封闭路径，比如圆形。
     * 
     * @param {*} ctx 
     * @param {*} shapeCfg 
     * @param {*} inBundle 
     */

  }, {
    key: "buildPath",
    value: function buildPath(ctx, shapeCfg, inBundle) {}
    /**
     * @method createPathProxy
     */

  }, {
    key: "createPathProxy",
    value: function createPathProxy() {
      this.path = new PathProxy();
    }
    /**
     * @protected
     * @method getBoundingRect
     */

  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      var rect = this._rect;
      var style = this.style;
      var needsUpdateRect = !rect;

      if (needsUpdateRect) {
        var path = this.path;

        if (!path) {
          // Create path on demand.
          path = this.path = new PathProxy();
        }

        if (this.__dirtyPath) {
          path.beginPath();
          this.buildPath(path, this.shape, false);
        }

        rect = path.getBoundingRect();
      }

      this._rect = rect;

      if (style.hasStroke()) {
        // Needs update rect with stroke lineWidth when
        // 1. Element changes scale or lineWidth
        // 2. Shape is changed
        var rectWithStroke = this._rectWithStroke || (this._rectWithStroke = rect.clone());

        if (this.__dirty || needsUpdateRect) {
          rectWithStroke.copy(rect); // FIXME Must after updateTransform

          var w = style.lineWidth; // PENDING, Min line width is needed when line is horizontal or vertical

          var lineScale = style.strokeNoScale ? this.getLineScale() : 1; // Only add extra hover lineWidth when there are no fill

          if (!style.hasFill()) {
            w = mathMax(w, this.strokeContainThreshold || 4);
          } // Consider line width
          // Line scale can't be 0;


          if (lineScale > 1e-10) {
            rectWithStroke.width += w / lineScale;
            rectWithStroke.height += w / lineScale;
            rectWithStroke.x -= w / lineScale / 2;
            rectWithStroke.y -= w / lineScale / 2;
          }
        } // Return rect with stroke


        return rectWithStroke;
      }

      return rect;
    }
    /**
     * @method contain
     * @param {*} x 
     * @param {*} y 
     */

  }, {
    key: "contain",
    value: function contain(x, y) {
      var localPos = this.transformCoordToLocal(x, y);
      var rect = this.getBoundingRect();
      var style = this.style;
      x = localPos[0];
      y = localPos[1];

      if (rect.contain(x, y)) {
        var pathData = this.path.data;

        if (style.hasStroke()) {
          var lineWidth = style.lineWidth;
          var lineScale = style.strokeNoScale ? this.getLineScale() : 1; // Line scale can't be 0;

          if (lineScale > 1e-10) {
            // Only add extra hover lineWidth when there are no fill
            if (!style.hasFill()) {
              lineWidth = mathMax(lineWidth, this.strokeContainThreshold);
            }

            if (pathContain.containStroke(pathData, lineWidth / lineScale, x, y)) {
              return true;
            }
          }
        }

        if (style.hasFill()) {
          return pathContain.contain(pathData, x, y);
        }
      }

      return false;
    }
    /**
     * @protected
     * @method dirty
     * @param  {Boolean} dirtyPath
     */

  }, {
    key: "dirty",
    value: function dirty(dirtyPath) {
      if (dirtyPath == null) {
        dirtyPath = true;
      } // Only mark dirty, not mark clean


      if (dirtyPath) {
        this.__dirtyPath = dirtyPath;
        this._rect = null;
      }

      this.__dirty = this.__dirtyText = true;
      this.__qr && this.__qr.refresh(); // Used as a clipping path

      if (this.__clipTarget) {
        this.__clipTarget.dirty();
      }
    }
    /**
     * @method animateShape
     * Alias for animate('shape')
     * @param {Boolean} loop
     */

  }, {
    key: "animateShape",
    value: function animateShape(loop) {
      return this.animate('shape', loop);
    }
    /**
     * @method attrKV
     * Overwrite attrKV
     * @param {*} key 
     * @param {Object} value 
     */

  }, {
    key: "attrKV",
    value: function attrKV(key, value) {
      // FIXME
      if (key === 'shape') {
        this.setShape(value);
        this.__dirtyPath = true;
        this._rect = null;
      } else {
        Displayable.prototype.attrKV.call(this, key, value);
      }
    }
    /**
     * @method setShape
     * @param {Object|String} key
     * @param {Object} value
     */

  }, {
    key: "setShape",
    value: function setShape(key, value) {
      // Path from string may not have shape
      if (!this.shape) {
        return this;
      }

      if (dataUtil.isObject(key)) {
        classUtil.copyOwnProperties(this.shape, key);
      } else {
        this.shape[key] = value;
      }

      this.dirty(true);
      return this;
    }
    /**
     * @method getLineScale
     */

  }, {
    key: "getLineScale",
    value: function getLineScale() {
      var m = this.transform; // Get the line scale.
      // Determinant of `m` means how much the area is enlarged by the
      // transformation. So its square root can be used as a scale factor
      // for width.

      return m && mathAbs(m[0] - 1) > 1e-10 && mathAbs(m[3] - 1) > 1e-10 ? mathSqrt(mathAbs(m[0] * m[3] - m[2] * m[1])) : 1;
    }
  }]);

  return Path;
}(Displayable);

var _default = Path;
module.exports = _default;
}, function(modId) { var map = {"./Displayable":1582161598634,"../core/utils/data_structure_util":1582161598602,"../core/utils/class_util":1582161598604,"./PathProxy":1582161598645,"../core/contain/path":1582161598648,"./Pattern":1582161598632,"../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598645, function(require, module, exports) {
var curve = require("../core/utils/curve_util");

var vec2 = require("../core/utils/vector");

var bbox = require("../core/utils/bbox_util");

var BoundingRect = require("./transform/BoundingRect");

var _config = require("../config");

var dpr = _config.devicePixelRatio;

var _constants = require("../graphic/constants");

var mathMin = _constants.mathMin;
var mathMax = _constants.mathMax;
var mathCos = _constants.mathCos;
var mathSin = _constants.mathSin;
var mathSqrt = _constants.mathSqrt;
var mathAbs = _constants.mathAbs;
// TODO: getTotalLength, getPointAtLength

/**
 * @class qrenderer.core.PathProxy
 * 
 * Path 代理，可以在`buildPath`中用于替代`ctx`, 会保存每个path操作的命令到pathCommands属性中
 * 可以用于 isInsidePath 判断以及获取boundingRect
 * 
 * @author Yi Shen (http://www.github.com/pissang)
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var CMD = {
  M: 1,
  L: 2,
  C: 3,
  Q: 4,
  A: 5,
  Z: 6,
  R: 7
};
var min = [];
var max = [];
var min2 = [];
var max2 = [];
var hasTypedArray = typeof Float32Array !== 'undefined';
/**
 * @method constructor PathProxy
 */

var PathProxy = function PathProxy(notSaveData) {
  this._saveData = !(notSaveData || false);

  if (this._saveData) {
    /**
     * Path data. Stored as flat array
     * @property {Array<Object>}
     */
    this.data = [];
  }

  this._ctx = null;
};
/**
 * 快速计算Path包围盒（并不是最小包围盒）
 * @return {Object}
 */


PathProxy.prototype = {
  constructor: PathProxy,
  _xi: 0,
  _yi: 0,
  _x0: 0,
  _y0: 0,
  // Unit x, Unit y. Provide for avoiding drawing that too short line segment
  _ux: 0,
  _uy: 0,
  _len: 0,
  _lineDash: null,
  _dashOffset: 0,
  _dashIdx: 0,
  _dashSum: 0,

  /**
   * @readOnly
   */
  setScale: function setScale(sx, sy, segmentIgnoreThreshold) {
    // Compat. Previously there is no segmentIgnoreThreshold.
    segmentIgnoreThreshold = segmentIgnoreThreshold || 0;
    this._ux = mathAbs(segmentIgnoreThreshold / dpr / sx) || 0;
    this._uy = mathAbs(segmentIgnoreThreshold / dpr / sy) || 0;
  },
  getContext: function getContext() {
    return this._ctx;
  },

  /**
   * @method beginPath
   * @param  {CanvasRenderingContext2D} ctx
   * @return {PathProxy}
   */
  beginPath: function beginPath(ctx) {
    this._ctx = ctx;
    ctx && ctx.beginPath();
    ctx && (this.dpr = ctx.dpr); // Reset

    if (this._saveData) {
      this._len = 0;
    }

    if (this._lineDash) {
      this._lineDash = null;
      this._dashOffset = 0;
    }

    return this;
  },

  /**
   * @method moveTo
   * @param  {Number} x
   * @param  {Number} y
   * @return {PathProxy}
   */
  moveTo: function moveTo(x, y) {
    this.addData(CMD.M, x, y);
    this._ctx && this._ctx.moveTo(x, y); // x0, y0, xi, yi 是记录在 _dashedXXXXTo 方法中使用
    // xi, yi 记录当前点, x0, y0 在 closePath 的时候回到起始点。
    // 有可能在 beginPath 之后直接调用 lineTo，这时候 x0, y0 需要
    // 在 lineTo 方法中记录，这里先不考虑这种情况，dashed line 也只在 IE10- 中不支持

    this._x0 = x;
    this._y0 = y;
    this._xi = x;
    this._yi = y;
    return this;
  },

  /**
   * @method lineTo
   * @param  {Number} x
   * @param  {Number} y
   * @return {PathProxy}
   */
  lineTo: function lineTo(x, y) {
    var exceedUnit = mathAbs(x - this._xi) > this._ux || mathAbs(y - this._yi) > this._uy // Force draw the first segment
    || this._len < 5;
    this.addData(CMD.L, x, y);

    if (this._ctx && exceedUnit) {
      this._needsDash() ? this._dashedLineTo(x, y) : this._ctx.lineTo(x, y);
    }

    if (exceedUnit) {
      this._xi = x;
      this._yi = y;
    }

    return this;
  },

  /**
   * @method bezierCurveTo
   * @param  {Number} x1
   * @param  {Number} y1
   * @param  {Number} x2
   * @param  {Number} y2
   * @param  {Number} x3
   * @param  {Number} y3
   * @return {PathProxy}
   */
  bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x3, y3) {
    this.addData(CMD.C, x1, y1, x2, y2, x3, y3);

    if (this._ctx) {
      this._needsDash() ? this._dashedBezierTo(x1, y1, x2, y2, x3, y3) : this._ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    }

    this._xi = x3;
    this._yi = y3;
    return this;
  },

  /**
   * @method quadraticCurveTo
   * @param  {Number} x1
   * @param  {Number} y1
   * @param  {Number} x2
   * @param  {Number} y2
   * @return {PathProxy}
   */
  quadraticCurveTo: function quadraticCurveTo(x1, y1, x2, y2) {
    this.addData(CMD.Q, x1, y1, x2, y2);

    if (this._ctx) {
      this._needsDash() ? this._dashedQuadraticTo(x1, y1, x2, y2) : this._ctx.quadraticCurveTo(x1, y1, x2, y2);
    }

    this._xi = x2;
    this._yi = y2;
    return this;
  },

  /**
   * @method arc
   * @param  {Number} cx
   * @param  {Number} cy
   * @param  {Number} r
   * @param  {Number} startAngle
   * @param  {Number} endAngle
   * @param  {boolean} anticlockwise
   * @return {PathProxy}
   */
  arc: function arc(cx, cy, r, startAngle, endAngle, anticlockwise) {
    this.addData(CMD.A, cx, cy, r, r, startAngle, endAngle - startAngle, 0, anticlockwise ? 0 : 1);
    this._ctx && this._ctx.arc(cx, cy, r, startAngle, endAngle, anticlockwise);
    this._xi = mathCos(endAngle) * r + cx;
    this._yi = mathSin(endAngle) * r + cy;
    return this;
  },
  // TODO
  arcTo: function arcTo(x1, y1, x2, y2, radius) {
    if (this._ctx) {
      this._ctx.arcTo(x1, y1, x2, y2, radius);
    }

    return this;
  },
  // TODO
  rect: function rect(x, y, w, h) {
    this._ctx && this._ctx.rect(x, y, w, h);
    this.addData(CMD.R, x, y, w, h);
    return this;
  },

  /**
   * @method closePath
   * @return {PathProxy}
   */
  closePath: function closePath() {
    this.addData(CMD.Z);
    var ctx = this._ctx;
    var x0 = this._x0;
    var y0 = this._y0;

    if (ctx) {
      this._needsDash() && this._dashedLineTo(x0, y0);
      ctx.closePath();
    }

    this._xi = x0;
    this._yi = y0;
    return this;
  },

  /**
   * @method fill
   * Context 从外部传入，因为有可能是 rebuildPath 完之后再 fill。
   * stroke 同样
   * @param {CanvasRenderingContext2D} ctx
   * @return {PathProxy}
   */
  fill: function fill(ctx) {
    ctx && ctx.fill();
    this.toStatic();
  },

  /**
   * @method stroke
   * @param {CanvasRenderingContext2D} ctx
   * @return {PathProxy}
   */
  stroke: function stroke(ctx) {
    ctx && ctx.stroke();
    this.toStatic();
  },

  /**
   * @method setLineDash
   * 必须在其它绘制命令前调用
   * Must be invoked before all other path drawing methods
   * @return {PathProxy}
   */
  setLineDash: function setLineDash(lineDash) {
    if (lineDash instanceof Array) {
      this._lineDash = lineDash;
      this._dashIdx = 0;
      var lineDashSum = 0;

      for (var i = 0; i < lineDash.length; i++) {
        lineDashSum += lineDash[i];
      }

      this._dashSum = lineDashSum;
    }

    return this;
  },

  /**
   * @method setLineDashOffset
   * 必须在其它绘制命令前调用
   * Must be invoked before all other path drawing methods
   * @return {PathProxy}
   */
  setLineDashOffset: function setLineDashOffset(offset) {
    this._dashOffset = offset;
    return this;
  },

  /**
   * @method len
   * @return {boolean}
   */
  len: function len() {
    return this._len;
  },

  /**
   * @method setData
   * 直接设置 Path 数据
   */
  setData: function setData(data) {
    var len = data.length;

    if (!(this.data && this.data.length === len) && hasTypedArray) {
      this.data = new Float32Array(len);
    }

    for (var i = 0; i < len; i++) {
      this.data[i] = data[i];
    }

    this._len = len;
  },

  /**
   * @method appendPath
   * 添加子路径
   * @param {PathProxy|Array.<PathProxy>} path
   */
  appendPath: function appendPath(path) {
    if (!(path instanceof Array)) {
      path = [path];
    }

    var len = path.length;
    var appendSize = 0;
    var offset = this._len;

    for (var i = 0; i < len; i++) {
      appendSize += path[i].len();
    }

    if (hasTypedArray && this.data instanceof Float32Array) {
      this.data = new Float32Array(offset + appendSize);
    }

    for (var i = 0; i < len; i++) {
      var appendPathData = path[i].data;

      for (var k = 0; k < appendPathData.length; k++) {
        this.data[offset++] = appendPathData[k];
      }
    }

    this._len = offset;
  },

  /**
   * @method addData
   * 填充 Path 数据。
   * 尽量复用而不申明新的数组。大部分图形重绘的指令数据长度都是不变的。
   */
  addData: function addData(cmd) {
    if (!this._saveData) {
      return;
    }

    var data = this.data;

    if (this._len + arguments.length > data.length) {
      // 因为之前的数组已经转换成静态的 Float32Array
      // 所以不够用时需要扩展一个新的动态数组
      this._expandData();

      data = this.data;
    }

    for (var i = 0; i < arguments.length; i++) {
      data[this._len++] = arguments[i];
    }

    this._prevCmd = cmd;
  },
  _expandData: function _expandData() {
    // Only if data is Float32Array
    if (!(this.data instanceof Array)) {
      var newData = [];

      for (var i = 0; i < this._len; i++) {
        newData[i] = this.data[i];
      }

      this.data = newData;
    }
  },

  /**
   * If needs js implemented dashed line
   * @return {boolean}
   * @private
   */
  _needsDash: function _needsDash() {
    return this._lineDash;
  },
  _dashedLineTo: function _dashedLineTo(x1, y1) {
    var dashSum = this._dashSum;
    var offset = this._dashOffset;
    var lineDash = this._lineDash;
    var ctx = this._ctx;
    var x0 = this._xi;
    var y0 = this._yi;
    var dx = x1 - x0;
    var dy = y1 - y0;
    var dist = mathSqrt(dx * dx + dy * dy);
    var x = x0;
    var y = y0;
    var dash;
    var nDash = lineDash.length;
    var idx;
    dx /= dist;
    dy /= dist;

    if (offset < 0) {
      // Convert to positive offset
      offset = dashSum + offset;
    }

    offset %= dashSum;
    x -= offset * dx;
    y -= offset * dy;

    while (dx > 0 && x <= x1 || dx < 0 && x >= x1 || dx === 0 && (dy > 0 && y <= y1 || dy < 0 && y >= y1)) {
      idx = this._dashIdx;
      dash = lineDash[idx];
      x += dx * dash;
      y += dy * dash;
      this._dashIdx = (idx + 1) % nDash; // Skip positive offset

      if (dx > 0 && x < x0 || dx < 0 && x > x0 || dy > 0 && y < y0 || dy < 0 && y > y0) {
        continue;
      }

      ctx[idx % 2 ? 'moveTo' : 'lineTo'](dx >= 0 ? mathMin(x, x1) : mathMax(x, x1), dy >= 0 ? mathMin(y, y1) : mathMax(y, y1));
    } // Offset for next lineTo


    dx = x - x1;
    dy = y - y1;
    this._dashOffset = -mathSqrt(dx * dx + dy * dy);
  },
  // Not accurate dashed line to
  _dashedBezierTo: function _dashedBezierTo(x1, y1, x2, y2, x3, y3) {
    var dashSum = this._dashSum;
    var offset = this._dashOffset;
    var lineDash = this._lineDash;
    var ctx = this._ctx;
    var x0 = this._xi;
    var y0 = this._yi;
    var t;
    var dx;
    var dy;
    var cubicAt = curve.cubicAt;
    var bezierLen = 0;
    var idx = this._dashIdx;
    var nDash = lineDash.length;
    var x;
    var y;
    var tmpLen = 0;

    if (offset < 0) {
      // Convert to positive offset
      offset = dashSum + offset;
    }

    offset %= dashSum; // Bezier approx length

    for (t = 0; t < 1; t += 0.1) {
      dx = cubicAt(x0, x1, x2, x3, t + 0.1) - cubicAt(x0, x1, x2, x3, t);
      dy = cubicAt(y0, y1, y2, y3, t + 0.1) - cubicAt(y0, y1, y2, y3, t);
      bezierLen += mathSqrt(dx * dx + dy * dy);
    } // Find idx after add offset


    for (; idx < nDash; idx++) {
      tmpLen += lineDash[idx];

      if (tmpLen > offset) {
        break;
      }
    }

    t = (tmpLen - offset) / bezierLen;

    while (t <= 1) {
      x = cubicAt(x0, x1, x2, x3, t);
      y = cubicAt(y0, y1, y2, y3, t); // Use line to approximate dashed bezier
      // Bad result if dash is long

      idx % 2 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      t += lineDash[idx] / bezierLen;
      idx = (idx + 1) % nDash;
    } // Finish the last segment and calculate the new offset


    idx % 2 !== 0 && ctx.lineTo(x3, y3);
    dx = x3 - x;
    dy = y3 - y;
    this._dashOffset = -mathSqrt(dx * dx + dy * dy);
  },
  _dashedQuadraticTo: function _dashedQuadraticTo(x1, y1, x2, y2) {
    // Convert quadratic to cubic using degree elevation
    var x3 = x2;
    var y3 = y2;
    x2 = (x2 + 2 * x1) / 3;
    y2 = (y2 + 2 * y1) / 3;
    x1 = (this._xi + 2 * x1) / 3;
    y1 = (this._yi + 2 * y1) / 3;

    this._dashedBezierTo(x1, y1, x2, y2, x3, y3);
  },

  /**
   * 转成静态的 Float32Array 减少堆内存占用
   * Convert dynamic array to static Float32Array
   */
  toStatic: function toStatic() {
    var data = this.data;

    if (data instanceof Array) {
      data.length = this._len;

      if (hasTypedArray) {
        this.data = new Float32Array(data);
      }
    }
  },

  /**
   * @method getBoundingRect
   * @return {BoundingRect}
   */
  getBoundingRect: function getBoundingRect() {
    min[0] = min[1] = min2[0] = min2[1] = Number.MAX_VALUE;
    max[0] = max[1] = max2[0] = max2[1] = -Number.MAX_VALUE;
    var data = this.data;
    var xi = 0;
    var yi = 0;
    var x0 = 0;
    var y0 = 0;

    for (var i = 0; i < data.length;) {
      var cmd = data[i++];

      if (i === 1) {
        // 如果第一个命令是 L, C, Q
        // 则 previous point 同绘制命令的第一个 point
        //
        // 第一个命令为 Arc 的情况下会在后面特殊处理
        xi = data[i];
        yi = data[i + 1];
        x0 = xi;
        y0 = yi;
      }

      switch (cmd) {
        case CMD.M:
          // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
          // 在 closePath 的时候使用
          x0 = data[i++];
          y0 = data[i++];
          xi = x0;
          yi = y0;
          min2[0] = x0;
          min2[1] = y0;
          max2[0] = x0;
          max2[1] = y0;
          break;

        case CMD.L:
          bbox.fromLine(xi, yi, data[i], data[i + 1], min2, max2);
          xi = data[i++];
          yi = data[i++];
          break;

        case CMD.C:
          bbox.fromCubic(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], min2, max2);
          xi = data[i++];
          yi = data[i++];
          break;

        case CMD.Q:
          bbox.fromQuadratic(xi, yi, data[i++], data[i++], data[i], data[i + 1], min2, max2);
          xi = data[i++];
          yi = data[i++];
          break;

        case CMD.A:
          // TODO Arc 判断的开销比较大
          var cx = data[i++];
          var cy = data[i++];
          var rx = data[i++];
          var ry = data[i++];
          var startAngle = data[i++];
          var endAngle = data[i++] + startAngle; // TODO Arc 旋转

          i += 1;
          var anticlockwise = 1 - data[i++];

          if (i === 1) {
            // 直接使用 arc 命令
            // 第一个命令起点还未定义
            x0 = mathCos(startAngle) * rx + cx;
            y0 = mathSin(startAngle) * ry + cy;
          }

          bbox.fromArc(cx, cy, rx, ry, startAngle, endAngle, anticlockwise, min2, max2);
          xi = mathCos(endAngle) * rx + cx;
          yi = mathSin(endAngle) * ry + cy;
          break;

        case CMD.R:
          x0 = xi = data[i++];
          y0 = yi = data[i++];
          var width = data[i++];
          var height = data[i++]; // Use fromLine

          bbox.fromLine(x0, y0, x0 + width, y0 + height, min2, max2);
          break;

        case CMD.Z:
          xi = x0;
          yi = y0;
          break;
      } // Union


      vec2.min(min, min, min2);
      vec2.max(max, max, max2);
    } // No data


    if (i === 0) {
      min[0] = min[1] = max[0] = max[1] = 0;
    }

    return new BoundingRect(min[0], min[1], max[0] - min[0], max[1] - min[1]);
  },

  /**
   * @method rebuildPath
   * Rebuild path from current data
   * Rebuild path will not consider javascript implemented line dash.
   * @param {CanvasRenderingContext2D} ctx
   */
  rebuildPath: function rebuildPath(ctx) {
    var d = this.data;
    var x0;
    var y0;
    var xi;
    var yi;
    var x;
    var y;
    var ux = this._ux;
    var uy = this._uy;
    var len = this._len;

    for (var i = 0; i < len;) {
      var cmd = d[i++];

      if (i === 1) {
        // 如果第一个命令是 L, C, Q
        // 则 previous point 同绘制命令的第一个 point
        //
        // 第一个命令为 Arc 的情况下会在后面特殊处理
        xi = d[i];
        yi = d[i + 1];
        x0 = xi;
        y0 = yi;
      }

      switch (cmd) {
        case CMD.M:
          x0 = xi = d[i++];
          y0 = yi = d[i++];
          ctx.moveTo(xi, yi);
          break;

        case CMD.L:
          x = d[i++];
          y = d[i++]; // Not draw too small seg between

          if (mathAbs(x - xi) > ux || mathAbs(y - yi) > uy || i === len - 1) {
            ctx.lineTo(x, y);
            xi = x;
            yi = y;
          }

          break;

        case CMD.C:
          ctx.bezierCurveTo(d[i++], d[i++], d[i++], d[i++], d[i++], d[i++]);
          xi = d[i - 2];
          yi = d[i - 1];
          break;

        case CMD.Q:
          ctx.quadraticCurveTo(d[i++], d[i++], d[i++], d[i++]);
          xi = d[i - 2];
          yi = d[i - 1];
          break;

        case CMD.A:
          var cx = d[i++];
          var cy = d[i++];
          var rx = d[i++];
          var ry = d[i++];
          var theta = d[i++];
          var dTheta = d[i++];
          var psi = d[i++];
          var fs = d[i++];
          var r = rx > ry ? rx : ry;
          var scaleX = rx > ry ? 1 : rx / ry;
          var scaleY = rx > ry ? ry / rx : 1;
          var isEllipse = mathAbs(rx - ry) > 1e-3;
          var endAngle = theta + dTheta;

          if (isEllipse) {
            ctx.translate(cx, cy);
            ctx.rotate(psi);
            ctx.scale(scaleX, scaleY);
            ctx.arc(0, 0, r, theta, endAngle, 1 - fs);
            ctx.scale(1 / scaleX, 1 / scaleY);
            ctx.rotate(-psi);
            ctx.translate(-cx, -cy);
          } else {
            ctx.arc(cx, cy, r, theta, endAngle, 1 - fs);
          }

          if (i === 1) {
            // 直接使用 arc 命令
            // 第一个命令起点还未定义
            x0 = mathCos(theta) * rx + cx;
            y0 = mathSin(theta) * ry + cy;
          }

          xi = mathCos(endAngle) * rx + cx;
          yi = mathSin(endAngle) * ry + cy;
          break;

        case CMD.R:
          x0 = xi = d[i];
          y0 = yi = d[i + 1];
          ctx.rect(d[i++], d[i++], d[i++], d[i++]);
          break;

        case CMD.Z:
          ctx.closePath();
          xi = x0;
          yi = y0;
      }
    }
  }
};
PathProxy.CMD = CMD;
var _default = PathProxy;
module.exports = _default;
}, function(modId) { var map = {"../core/utils/curve_util":1582161598646,"../core/utils/vector":1582161598605,"../core/utils/bbox_util":1582161598647,"./transform/BoundingRect":1582161598623,"../config":1582161598627,"../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598646, function(require, module, exports) {
var _vector = require("./vector");

var v2Create = _vector.create;
var v2DistSquare = _vector.distSquare;

var _constants = require("../../graphic/constants");

var mathPow = _constants.mathPow;
var mathSqrt = _constants.mathSqrt;
var mathAcos = _constants.mathAcos;
var mathCos = _constants.mathCos;
var mathSin = _constants.mathSin;

/**
 * 曲线辅助模块
 * @author pissang(https://www.github.com/pissang)
 */
var EPSILON = 1e-8;
var EPSILON_NUMERIC = 1e-4;
var THREE_SQRT = mathSqrt(3);
var ONE_THIRD = 1 / 3; // 临时变量

var _v0 = v2Create();

var _v1 = v2Create();

var _v2 = v2Create();

function isAroundZero(val) {
  return val > -EPSILON && val < EPSILON;
}

function isNotAroundZero(val) {
  return val > EPSILON || val < -EPSILON;
}
/**
 * 计算三次贝塞尔值
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Number} t
 * @return {Number}
 */


function cubicAt(p0, p1, p2, p3, t) {
  var onet = 1 - t;
  return onet * onet * (onet * p0 + 3 * t * p1) + t * t * (t * p3 + 3 * onet * p2);
}
/**
 * 计算三次贝塞尔导数值
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Number} t
 * @return {Number}
 */


function cubicDerivativeAt(p0, p1, p2, p3, t) {
  var onet = 1 - t;
  return 3 * (((p1 - p0) * onet + 2 * (p2 - p1) * t) * onet + (p3 - p2) * t * t);
}
/**
 * 计算三次贝塞尔方程根，使用盛金公式
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Number} val
 * @param  {Array<Number>} roots
 * @return {Number} 有效根数目
 */


function cubicRootAt(p0, p1, p2, p3, val, roots) {
  // Evaluate roots of cubic functions
  var a = p3 + 3 * (p1 - p2) - p0;
  var b = 3 * (p2 - p1 * 2 + p0);
  var c = 3 * (p1 - p0);
  var d = p0 - val;
  var A = b * b - 3 * a * c;
  var B = b * c - 9 * a * d;
  var C = c * c - 3 * b * d;
  var n = 0;

  if (isAroundZero(A) && isAroundZero(B)) {
    if (isAroundZero(b)) {
      roots[0] = 0;
    } else {
      var t1 = -c / b; //t1, t2, t3, b is not zero

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }
    }
  } else {
    var disc = B * B - 4 * A * C;

    if (isAroundZero(disc)) {
      var K = B / A;
      var t1 = -b / a + K; // t1, a is not zero

      var t2 = -K / 2; // t2, t3

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }

      if (t2 >= 0 && t2 <= 1) {
        roots[n++] = t2;
      }
    } else if (disc > 0) {
      var discSqrt = mathSqrt(disc);
      var Y1 = A * b + 1.5 * a * (-B + discSqrt);
      var Y2 = A * b + 1.5 * a * (-B - discSqrt);

      if (Y1 < 0) {
        Y1 = -mathPow(-Y1, ONE_THIRD);
      } else {
        Y1 = mathPow(Y1, ONE_THIRD);
      }

      if (Y2 < 0) {
        Y2 = -mathPow(-Y2, ONE_THIRD);
      } else {
        Y2 = mathPow(Y2, ONE_THIRD);
      }

      var t1 = (-b - (Y1 + Y2)) / (3 * a);

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }
    } else {
      var T = (2 * A * b - 3 * a * B) / (2 * mathSqrt(A * A * A));
      var theta = mathAcos(T) / 3;
      var ASqrt = mathSqrt(A);
      var tmp = mathCos(theta);
      var t1 = (-b - 2 * ASqrt * tmp) / (3 * a);
      var t2 = (-b + ASqrt * (tmp + THREE_SQRT * mathSin(theta))) / (3 * a);
      var t3 = (-b + ASqrt * (tmp - THREE_SQRT * mathSin(theta))) / (3 * a);

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }

      if (t2 >= 0 && t2 <= 1) {
        roots[n++] = t2;
      }

      if (t3 >= 0 && t3 <= 1) {
        roots[n++] = t3;
      }
    }
  }

  return n;
}
/**
 * 计算三次贝塞尔方程极限值的位置
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Array<Number>} extrema
 * @return {Number} 有效数目
 */


function cubicExtrema(p0, p1, p2, p3, extrema) {
  var b = 6 * p2 - 12 * p1 + 6 * p0;
  var a = 9 * p1 + 3 * p3 - 3 * p0 - 9 * p2;
  var c = 3 * p1 - 3 * p0;
  var n = 0;

  if (isAroundZero(a)) {
    if (isNotAroundZero(b)) {
      var t1 = -c / b;

      if (t1 >= 0 && t1 <= 1) {
        extrema[n++] = t1;
      }
    }
  } else {
    var disc = b * b - 4 * a * c;

    if (isAroundZero(disc)) {
      extrema[0] = -b / (2 * a);
    } else if (disc > 0) {
      var discSqrt = mathSqrt(disc);
      var t1 = (-b + discSqrt) / (2 * a);
      var t2 = (-b - discSqrt) / (2 * a);

      if (t1 >= 0 && t1 <= 1) {
        extrema[n++] = t1;
      }

      if (t2 >= 0 && t2 <= 1) {
        extrema[n++] = t2;
      }
    }
  }

  return n;
}
/**
 * 细分三次贝塞尔曲线
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} p3
 * @param  {Number} t
 * @param  {Array<Number>} out
 */


function cubicSubdivide(p0, p1, p2, p3, t, out) {
  var p01 = (p1 - p0) * t + p0;
  var p12 = (p2 - p1) * t + p1;
  var p23 = (p3 - p2) * t + p2;
  var p012 = (p12 - p01) * t + p01;
  var p123 = (p23 - p12) * t + p12;
  var p0123 = (p123 - p012) * t + p012; // Seg0

  out[0] = p0;
  out[1] = p01;
  out[2] = p012;
  out[3] = p0123; // Seg1

  out[4] = p0123;
  out[5] = p123;
  out[6] = p23;
  out[7] = p3;
}
/**
 * 投射点到三次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {Number} x0
 * @param {Number} y0
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @param {Number} x
 * @param {Number} y
 * @param {Array<Number>} [out] 投射点
 * @return {Number}
 */


function cubicProjectPoint(x0, y0, x1, y1, x2, y2, x3, y3, x, y, out) {
  // http://pomax.github.io/bezierinfo/#projections
  var t;
  var interval = 0.005;
  var d = Infinity;
  var prev;
  var next;
  var d1;
  var d2;
  _v0[0] = x;
  _v0[1] = y; // 先粗略估计一下可能的最小距离的 t 值
  // PENDING

  for (var _t = 0; _t < 1; _t += 0.05) {
    _v1[0] = cubicAt(x0, x1, x2, x3, _t);
    _v1[1] = cubicAt(y0, y1, y2, y3, _t);
    d1 = v2DistSquare(_v0, _v1);

    if (d1 < d) {
      t = _t;
      d = d1;
    }
  }

  d = Infinity; // At most 32 iteration

  for (var i = 0; i < 32; i++) {
    if (interval < EPSILON_NUMERIC) {
      break;
    }

    prev = t - interval;
    next = t + interval; // t - interval

    _v1[0] = cubicAt(x0, x1, x2, x3, prev);
    _v1[1] = cubicAt(y0, y1, y2, y3, prev);
    d1 = v2DistSquare(_v1, _v0);

    if (prev >= 0 && d1 < d) {
      t = prev;
      d = d1;
    } else {
      // t + interval
      _v2[0] = cubicAt(x0, x1, x2, x3, next);
      _v2[1] = cubicAt(y0, y1, y2, y3, next);
      d2 = v2DistSquare(_v2, _v0);

      if (next <= 1 && d2 < d) {
        t = next;
        d = d2;
      } else {
        interval *= 0.5;
      }
    }
  } // t


  if (out) {
    out[0] = cubicAt(x0, x1, x2, x3, t);
    out[1] = cubicAt(y0, y1, y2, y3, t);
  } // console.log(interval, i);


  return mathSqrt(d);
}
/**
 * 计算二次方贝塞尔值
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} t
 * @return {Number}
 */


function quadraticAt(p0, p1, p2, t) {
  var onet = 1 - t;
  return onet * (onet * p0 + 2 * t * p1) + t * t * p2;
}
/**
 * 计算二次方贝塞尔导数值
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} t
 * @return {Number}
 */


function quadraticDerivativeAt(p0, p1, p2, t) {
  return 2 * ((1 - t) * (p1 - p0) + t * (p2 - p1));
}
/**
 * 计算二次方贝塞尔方程根
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} t
 * @param  {Array<Number>} roots
 * @return {Number} 有效根数目
 */


function quadraticRootAt(p0, p1, p2, val, roots) {
  var a = p0 - 2 * p1 + p2;
  var b = 2 * (p1 - p0);
  var c = p0 - val;
  var n = 0;

  if (isAroundZero(a)) {
    if (isNotAroundZero(b)) {
      var t1 = -c / b;

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }
    }
  } else {
    var disc = b * b - 4 * a * c;

    if (isAroundZero(disc)) {
      var t1 = -b / (2 * a);

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }
    } else if (disc > 0) {
      var discSqrt = mathSqrt(disc);
      var t1 = (-b + discSqrt) / (2 * a);
      var t2 = (-b - discSqrt) / (2 * a);

      if (t1 >= 0 && t1 <= 1) {
        roots[n++] = t1;
      }

      if (t2 >= 0 && t2 <= 1) {
        roots[n++] = t2;
      }
    }
  }

  return n;
}
/**
 * 计算二次贝塞尔方程极限值
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @return {Number}
 */


function quadraticExtremum(p0, p1, p2) {
  var divider = p0 + p2 - 2 * p1;

  if (divider === 0) {
    // p1 is center of p0 and p2
    return 0.5;
  } else {
    return (p0 - p1) / divider;
  }
}
/**
 * 细分二次贝塞尔曲线
 * @param  {Number} p0
 * @param  {Number} p1
 * @param  {Number} p2
 * @param  {Number} t
 * @param  {Array<Number>} out
 */


function quadraticSubdivide(p0, p1, p2, t, out) {
  var p01 = (p1 - p0) * t + p0;
  var p12 = (p2 - p1) * t + p1;
  var p012 = (p12 - p01) * t + p01; // Seg0

  out[0] = p0;
  out[1] = p01;
  out[2] = p012; // Seg1

  out[3] = p012;
  out[4] = p12;
  out[5] = p2;
}
/**
 * 投射点到二次贝塞尔曲线上，返回投射距离。
 * 投射点有可能会有一个或者多个，这里只返回其中距离最短的一个。
 * @param {Number} x0
 * @param {Number} y0
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x
 * @param {Number} y
 * @param {Array<Number>} out 投射点
 * @return {Number}
 */


function quadraticProjectPoint(x0, y0, x1, y1, x2, y2, x, y, out) {
  // http://pomax.github.io/bezierinfo/#projections
  var t;
  var interval = 0.005;
  var d = Infinity;
  _v0[0] = x;
  _v0[1] = y; // 先粗略估计一下可能的最小距离的 t 值
  // PENDING

  for (var _t = 0; _t < 1; _t += 0.05) {
    _v1[0] = quadraticAt(x0, x1, x2, _t);
    _v1[1] = quadraticAt(y0, y1, y2, _t);
    var d1 = v2DistSquare(_v0, _v1);

    if (d1 < d) {
      t = _t;
      d = d1;
    }
  }

  d = Infinity; // At most 32 iteration

  for (var i = 0; i < 32; i++) {
    if (interval < EPSILON_NUMERIC) {
      break;
    }

    var prev = t - interval;
    var next = t + interval; // t - interval

    _v1[0] = quadraticAt(x0, x1, x2, prev);
    _v1[1] = quadraticAt(y0, y1, y2, prev);
    var d1 = v2DistSquare(_v1, _v0);

    if (prev >= 0 && d1 < d) {
      t = prev;
      d = d1;
    } else {
      // t + interval
      _v2[0] = quadraticAt(x0, x1, x2, next);
      _v2[1] = quadraticAt(y0, y1, y2, next);
      var d2 = v2DistSquare(_v2, _v0);

      if (next <= 1 && d2 < d) {
        t = next;
        d = d2;
      } else {
        interval *= 0.5;
      }
    }
  } // t


  if (out) {
    out[0] = quadraticAt(x0, x1, x2, t);
    out[1] = quadraticAt(y0, y1, y2, t);
  } // console.log(interval, i);


  return mathSqrt(d);
}

exports.cubicAt = cubicAt;
exports.cubicDerivativeAt = cubicDerivativeAt;
exports.cubicRootAt = cubicRootAt;
exports.cubicExtrema = cubicExtrema;
exports.cubicSubdivide = cubicSubdivide;
exports.cubicProjectPoint = cubicProjectPoint;
exports.quadraticAt = quadraticAt;
exports.quadraticDerivativeAt = quadraticDerivativeAt;
exports.quadraticRootAt = quadraticRootAt;
exports.quadraticExtremum = quadraticExtremum;
exports.quadraticSubdivide = quadraticSubdivide;
exports.quadraticProjectPoint = quadraticProjectPoint;
}, function(modId) { var map = {"./vector":1582161598605,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598647, function(require, module, exports) {
var vec2 = require("./vector");

var curve = require("./curve_util");

var _constants = require("../../graphic/constants");

var PI2 = _constants.PI2;
var mathAsin = _constants.mathAsin;
var mathCos = _constants.mathCos;
var mathSin = _constants.mathSin;
var mathPow = _constants.mathPow;
var mathSqrt = _constants.mathSqrt;
var PI = _constants.PI;
var mathMin = _constants.mathMin;
var mathMax = _constants.mathMax;
var mathAbs = _constants.mathAbs;

/**
 * @author Yi Shen(https://github.com/pissang)
 */
var start = vec2.create();
var end = vec2.create();
var extremity = vec2.create();
/**
 * 从顶点数组中计算出最小包围盒，写入`min`和`max`中
 * @param {Array<Object>} points 顶点数组
 * @param {Number} min
 * @param {Number} max
 */

function fromPoints(points, min, max) {
  if (points.length === 0) {
    return;
  }

  var p = points[0];
  var left = p[0];
  var right = p[0];
  var top = p[1];
  var bottom = p[1];
  var i;

  for (i = 1; i < points.length; i++) {
    p = points[i];
    left = mathMin(left, p[0]);
    right = mathMax(right, p[0]);
    top = mathMin(top, p[1]);
    bottom = mathMax(bottom, p[1]);
  }

  min[0] = left;
  min[1] = top;
  max[0] = right;
  max[1] = bottom;
}
/**
 * @param {Number} x0
 * @param {Number} y0
 * @param {Number} x1
 * @param {Number} y1
 * @param {Array<Number>} min
 * @param {Array<Number>} max
 */


function fromLine(x0, y0, x1, y1, min, max) {
  min[0] = mathMin(x0, x1);
  min[1] = mathMin(y0, y1);
  max[0] = mathMax(x0, x1);
  max[1] = mathMax(y0, y1);
}

var xDim = [];
var yDim = [];
/**
 * 从三阶贝塞尔曲线(p0, p1, p2, p3)中计算出最小包围盒，写入`min`和`max`中
 * @param {Number} x0
 * @param {Number} y0
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} x3
 * @param {Number} y3
 * @param {Array<Number>} min
 * @param {Array<Number>} max
 */

function fromCubic(x0, y0, x1, y1, x2, y2, x3, y3, min, max) {
  var cubicExtrema = curve.cubicExtrema;
  var cubicAt = curve.cubicAt;
  var i;
  var n = cubicExtrema(x0, x1, x2, x3, xDim);
  min[0] = Infinity;
  min[1] = Infinity;
  max[0] = -Infinity;
  max[1] = -Infinity;

  for (i = 0; i < n; i++) {
    var x = cubicAt(x0, x1, x2, x3, xDim[i]);
    min[0] = mathMin(x, min[0]);
    max[0] = mathMax(x, max[0]);
  }

  n = cubicExtrema(y0, y1, y2, y3, yDim);

  for (i = 0; i < n; i++) {
    var y = cubicAt(y0, y1, y2, y3, yDim[i]);
    min[1] = mathMin(y, min[1]);
    max[1] = mathMax(y, max[1]);
  }

  min[0] = mathMin(x0, min[0]);
  max[0] = mathMax(x0, max[0]);
  min[0] = mathMin(x3, min[0]);
  max[0] = mathMax(x3, max[0]);
  min[1] = mathMin(y0, min[1]);
  max[1] = mathMax(y0, max[1]);
  min[1] = mathMin(y3, min[1]);
  max[1] = mathMax(y3, max[1]);
}
/**
 * 从二阶贝塞尔曲线(p0, p1, p2)中计算出最小包围盒，写入`min`和`max`中
 * @param {Number} x0
 * @param {Number} y0
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Array<Number>} min
 * @param {Array<Number>} max
 */


function fromQuadratic(x0, y0, x1, y1, x2, y2, min, max) {
  var quadraticExtremum = curve.quadraticExtremum;
  var quadraticAt = curve.quadraticAt; // Find extremities, where derivative in x dim or y dim is zero

  var tx = mathMax(mathMin(quadraticExtremum(x0, x1, x2), 1), 0);
  var ty = mathMax(mathMin(quadraticExtremum(y0, y1, y2), 1), 0);
  var x = quadraticAt(x0, x1, x2, tx);
  var y = quadraticAt(y0, y1, y2, ty);
  min[0] = mathMin(x0, x2, x);
  min[1] = mathMin(y0, y2, y);
  max[0] = mathMax(x0, x2, x);
  max[1] = mathMax(y0, y2, y);
}
/**
 * 从圆弧中计算出最小包围盒，写入`min`和`max`中
 * @method
 * @param {Number} x
 * @param {Number} y
 * @param {Number} rx
 * @param {Number} ry
 * @param {Number} startAngle
 * @param {Number} endAngle
 * @param {Number} anticlockwise
 * @param {Array<Number>} min
 * @param {Array<Number>} max
 */


function fromArc(x, y, rx, ry, startAngle, endAngle, anticlockwise, min, max) {
  var vec2Min = vec2.min;
  var vec2Max = vec2.max;
  var diff = mathAbs(startAngle - endAngle);

  if (diff % PI2 < 1e-4 && diff > 1e-4) {
    // Is a circle
    min[0] = x - rx;
    min[1] = y - ry;
    max[0] = x + rx;
    max[1] = y + ry;
    return;
  }

  start[0] = mathCos(startAngle) * rx + x;
  start[1] = mathSin(startAngle) * ry + y;
  end[0] = mathCos(endAngle) * rx + x;
  end[1] = mathSin(endAngle) * ry + y;
  vec2Min(min, start, end);
  vec2Max(max, start, end); // Thresh to [0, PI * 2]

  startAngle = startAngle % PI2;

  if (startAngle < 0) {
    startAngle = startAngle + PI2;
  }

  endAngle = endAngle % PI2;

  if (endAngle < 0) {
    endAngle = endAngle + PI2;
  }

  if (startAngle > endAngle && !anticlockwise) {
    endAngle += PI2;
  } else if (startAngle < endAngle && anticlockwise) {
    startAngle += PI2;
  }

  if (anticlockwise) {
    var tmp = endAngle;
    endAngle = startAngle;
    startAngle = tmp;
  } // var number = 0;
  // var step = (anticlockwise ? -PI : PI) / 2;


  for (var angle = 0; angle < endAngle; angle += PI / 2) {
    if (angle > startAngle) {
      extremity[0] = mathCos(angle) * rx + x;
      extremity[1] = mathSin(angle) * ry + y;
      vec2Min(min, extremity, min);
      vec2Max(max, extremity, max);
    }
  }
}

exports.fromPoints = fromPoints;
exports.fromLine = fromLine;
exports.fromCubic = fromCubic;
exports.fromQuadratic = fromQuadratic;
exports.fromArc = fromArc;
}, function(modId) { var map = {"./vector":1582161598605,"./curve_util":1582161598646,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598648, function(require, module, exports) {
var PathProxy = require("../../graphic/PathProxy");

var line = require("./line");

var cubic = require("./cubic");

var quadratic = require("./quadratic");

var arc = require("./arc");

var _radian_util = require("./radian_util");

var normalizeRadian = _radian_util.normalizeRadian;

var curve = require("../utils/curve_util");

var windingLine = require("./winding_line");

var _constants = require("../../graphic/constants");

var PI2 = _constants.PI2;
var mathAsin = _constants.mathAsin;
var mathCos = _constants.mathCos;
var mathSin = _constants.mathSin;
var mathPow = _constants.mathPow;
var mathSqrt = _constants.mathSqrt;
var PI = _constants.PI;
var mathMin = _constants.mathMin;
var mathMax = _constants.mathMax;
var mathAtan2 = _constants.mathAtan2;
var mathAbs = _constants.mathAbs;
var CMD = PathProxy.CMD;
var EPSILON = 1e-4;

function isAroundEqual(a, b) {
  return mathAbs(a - b) < EPSILON;
} // 临时数组


var roots = [-1, -1, -1];
var extrema = [-1, -1];

function swapExtrema() {
  var tmp = extrema[0];
  extrema[0] = extrema[1];
  extrema[1] = tmp;
}

function windingCubic(x0, y0, x1, y1, x2, y2, x3, y3, x, y) {
  // Quick reject
  if (y > y0 && y > y1 && y > y2 && y > y3 || y < y0 && y < y1 && y < y2 && y < y3) {
    return 0;
  }

  var nRoots = curve.cubicRootAt(y0, y1, y2, y3, y, roots);

  if (nRoots === 0) {
    return 0;
  } else {
    var w = 0;
    var nExtrema = -1;
    var y0_;
    var y1_;

    for (var i = 0; i < nRoots; i++) {
      var t = roots[i]; // Avoid winding error when intersection point is the connect point of two line of polygon

      var unit = t === 0 || t === 1 ? 0.5 : 1;
      var x_ = curve.cubicAt(x0, x1, x2, x3, t);

      if (x_ < x) {
        // Quick reject
        continue;
      }

      if (nExtrema < 0) {
        nExtrema = curve.cubicExtrema(y0, y1, y2, y3, extrema);

        if (extrema[1] < extrema[0] && nExtrema > 1) {
          swapExtrema();
        }

        y0_ = curve.cubicAt(y0, y1, y2, y3, extrema[0]);

        if (nExtrema > 1) {
          y1_ = curve.cubicAt(y0, y1, y2, y3, extrema[1]);
        }
      }

      if (nExtrema === 2) {
        // 分成三段单调函数
        if (t < extrema[0]) {
          w += y0_ < y0 ? unit : -unit;
        } else if (t < extrema[1]) {
          w += y1_ < y0_ ? unit : -unit;
        } else {
          w += y3 < y1_ ? unit : -unit;
        }
      } else {
        // 分成两段单调函数
        if (t < extrema[0]) {
          w += y0_ < y0 ? unit : -unit;
        } else {
          w += y3 < y0_ ? unit : -unit;
        }
      }
    }

    return w;
  }
}

function windingQuadratic(x0, y0, x1, y1, x2, y2, x, y) {
  // Quick reject
  if (y > y0 && y > y1 && y > y2 || y < y0 && y < y1 && y < y2) {
    return 0;
  }

  var nRoots = curve.quadraticRootAt(y0, y1, y2, y, roots);

  if (nRoots === 0) {
    return 0;
  } else {
    var t = curve.quadraticExtremum(y0, y1, y2);

    if (t >= 0 && t <= 1) {
      var w = 0;
      var y_ = curve.quadraticAt(y0, y1, y2, t);

      for (var i = 0; i < nRoots; i++) {
        // Remove one endpoint.
        var unit = roots[i] === 0 || roots[i] === 1 ? 0.5 : 1;
        var x_ = curve.quadraticAt(x0, x1, x2, roots[i]);

        if (x_ < x) {
          // Quick reject
          continue;
        }

        if (roots[i] < t) {
          w += y_ < y0 ? unit : -unit;
        } else {
          w += y2 < y_ ? unit : -unit;
        }
      }

      return w;
    } else {
      // Remove one endpoint.
      var _unit = roots[0] === 0 || roots[0] === 1 ? 0.5 : 1;

      var _x_ = curve.quadraticAt(x0, x1, x2, roots[0]);

      if (_x_ < x) {
        // Quick reject
        return 0;
      }

      return y2 < y0 ? _unit : -_unit;
    }
  }
} // TODO
// Arc 旋转


function windingArc(cx, cy, r, startAngle, endAngle, anticlockwise, x, y) {
  y -= cy;

  if (y > r || y < -r) {
    return 0;
  }

  var tmp = mathSqrt(r * r - y * y);
  roots[0] = -tmp;
  roots[1] = tmp;
  var diff = mathAbs(startAngle - endAngle);

  if (diff < 1e-4) {
    return 0;
  }

  if (diff % PI2 < 1e-4) {
    // Is a circle
    startAngle = 0;
    endAngle = PI2;
    var dir = anticlockwise ? 1 : -1;

    if (x >= roots[0] + cx && x <= roots[1] + cx) {
      return dir;
    } else {
      return 0;
    }
  }

  if (anticlockwise) {
    var _tmp = startAngle;
    startAngle = normalizeRadian(endAngle);
    endAngle = normalizeRadian(_tmp);
  } else {
    startAngle = normalizeRadian(startAngle);
    endAngle = normalizeRadian(endAngle);
  }

  if (startAngle > endAngle) {
    endAngle += PI2;
  }

  var w = 0;

  for (var i = 0; i < 2; i++) {
    var x_ = roots[i];

    if (x_ + cx > x) {
      var angle = mathAtan2(y, x_);

      var _dir = anticlockwise ? 1 : -1;

      if (angle < 0) {
        angle = PI2 + angle;
      }

      if (angle >= startAngle && angle <= endAngle || angle + PI2 >= startAngle && angle + PI2 <= endAngle) {
        if (angle > PI / 2 && angle < PI * 1.5) {
          _dir = -_dir;
        }

        w += _dir;
      }
    }
  }

  return w;
}

function containPath(data, lineWidth, isStroke, x, y) {
  var w = 0;
  var xi = 0;
  var yi = 0;
  var x0 = 0;
  var y0 = 0;

  for (var i = 0; i < data.length;) {
    var cmd = data[i++]; // Begin a new subpath

    if (cmd === CMD.M && i > 1) {
      // Close previous subpath
      if (!isStroke) {
        w += windingLine(xi, yi, x0, y0, x, y);
      } // 如果被任何一个 subpath 包含
      // if (w !== 0) {
      //     return true;
      // }

    }

    if (i === 1) {
      // 如果第一个命令是 L, C, Q
      // 则 previous point 同绘制命令的第一个 point
      //
      // 第一个命令为 Arc 的情况下会在后面特殊处理
      xi = data[i];
      yi = data[i + 1];
      x0 = xi;
      y0 = yi;
    }

    var x1 = void 0;
    var y1 = void 0;
    var width = void 0;
    var height = void 0;

    switch (cmd) {
      case CMD.M:
        // moveTo 命令重新创建一个新的 subpath, 并且更新新的起点
        // 在 closePath 的时候使用
        x0 = data[i++];
        y0 = data[i++];
        xi = x0;
        yi = y0;
        break;

      case CMD.L:
        if (isStroke) {
          if (line.containStroke(xi, yi, data[i], data[i + 1], lineWidth, x, y)) {
            return true;
          }
        } else {
          // NOTE 在第一个命令为 L, C, Q 的时候会计算出 NaN
          w += windingLine(xi, yi, data[i], data[i + 1], x, y) || 0;
        }

        xi = data[i++];
        yi = data[i++];
        break;

      case CMD.C:
        if (isStroke) {
          if (cubic.containStroke(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], lineWidth, x, y)) {
            return true;
          }
        } else {
          w += windingCubic(xi, yi, data[i++], data[i++], data[i++], data[i++], data[i], data[i + 1], x, y) || 0;
        }

        xi = data[i++];
        yi = data[i++];
        break;

      case CMD.Q:
        if (isStroke) {
          if (quadratic.containStroke(xi, yi, data[i++], data[i++], data[i], data[i + 1], lineWidth, x, y)) {
            return true;
          }
        } else {
          w += windingQuadratic(xi, yi, data[i++], data[i++], data[i], data[i + 1], x, y) || 0;
        }

        xi = data[i++];
        yi = data[i++];
        break;

      case CMD.A:
        // TODO Arc 判断的开销比较大
        var cx = data[i++];
        var cy = data[i++];
        var rx = data[i++];
        var ry = data[i++];
        var theta = data[i++];
        var dTheta = data[i++]; // TODO Arc 旋转

        i += 1;
        var anticlockwise = 1 - data[i++];
        x1 = mathCos(theta) * rx + cx;
        y1 = mathSin(theta) * ry + cy; // 不是直接使用 arc 命令

        if (i > 1) {
          w += windingLine(xi, yi, x1, y1, x, y);
        } else {
          // 第一个命令起点还未定义
          x0 = x1;
          y0 = y1;
        } // qr 使用scale来模拟椭圆, 这里也对x做一定的缩放


        var _x = (x - cx) * ry / rx + cx;

        if (isStroke) {
          if (arc.containStroke(cx, cy, ry, theta, theta + dTheta, anticlockwise, lineWidth, _x, y)) {
            return true;
          }
        } else {
          w += windingArc(cx, cy, ry, theta, theta + dTheta, anticlockwise, _x, y);
        }

        xi = mathCos(theta + dTheta) * rx + cx;
        yi = mathSin(theta + dTheta) * ry + cy;
        break;

      case CMD.R:
        x0 = xi = data[i++];
        y0 = yi = data[i++];
        width = data[i++];
        height = data[i++];
        x1 = x0 + width;
        y1 = y0 + height;

        if (isStroke) {
          if (line.containStroke(x0, y0, x1, y0, lineWidth, x, y) || line.containStroke(x1, y0, x1, y1, lineWidth, x, y) || line.containStroke(x1, y1, x0, y1, lineWidth, x, y) || line.containStroke(x0, y1, x0, y0, lineWidth, x, y)) {
            return true;
          }
        } else {
          // FIXME Clockwise ?
          w += windingLine(x1, y0, x1, y1, x, y);
          w += windingLine(x0, y1, x0, y0, x, y);
        }

        break;

      case CMD.Z:
        if (isStroke) {
          if (line.containStroke(xi, yi, x0, y0, lineWidth, x, y)) {
            return true;
          }
        } else {
          // Close a subpath
          w += windingLine(xi, yi, x0, y0, x, y); // 如果被任何一个 subpath 包含
          // FIXME subpaths may overlap
          // if (w !== 0) {
          //     return true;
          // }
        }

        xi = x0;
        yi = y0;
        break;
    }
  }

  if (!isStroke && !isAroundEqual(yi, y0)) {
    w += windingLine(xi, yi, x0, y0, x, y) || 0;
  }

  return w !== 0;
}

function contain(pathData, x, y) {
  return containPath(pathData, 0, false, x, y);
}

function containStroke(pathData, lineWidth, x, y) {
  return containPath(pathData, lineWidth, true, x, y);
}

exports.contain = contain;
exports.containStroke = containStroke;
}, function(modId) { var map = {"../../graphic/PathProxy":1582161598645,"./line":1582161598649,"./cubic":1582161598650,"./quadratic":1582161598651,"./arc":1582161598652,"./radian_util":1582161598653,"../utils/curve_util":1582161598646,"./winding_line":1582161598654,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598649, function(require, module, exports) {
/**
 * 线段包含判断
 * @param  {Number}  x0
 * @param  {Number}  y0
 * @param  {Number}  x1
 * @param  {Number}  y1
 * @param  {Number}  lineWidth
 * @param  {Number}  x
 * @param  {Number}  y
 * @return {boolean}
 */
function containStroke(x0, y0, x1, y1, lineWidth, x, y) {
  if (lineWidth === 0) {
    return false;
  }

  var _l = lineWidth;
  var _a = 0;
  var _b = x0; // Quick reject

  if (y > y0 + _l && y > y1 + _l || y < y0 - _l && y < y1 - _l || x > x0 + _l && x > x1 + _l || x < x0 - _l && x < x1 - _l) {
    return false;
  }

  if (x0 !== x1) {
    _a = (y0 - y1) / (x0 - x1);
    _b = (x0 * y1 - x1 * y0) / (x0 - x1);
  } else {
    return Math.abs(x - x0) <= _l / 2;
  }

  var tmp = _a * x - y + _b;

  var _s = tmp * tmp / (_a * _a + 1);

  return _s <= _l / 2 * _l / 2;
}

exports.containStroke = containStroke;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598650, function(require, module, exports) {
var curve = require("../utils/curve_util");

/**
 * 三次贝塞尔曲线描边包含判断
 * @param  {Number}  x0
 * @param  {Number}  y0
 * @param  {Number}  x1
 * @param  {Number}  y1
 * @param  {Number}  x2
 * @param  {Number}  y2
 * @param  {Number}  x3
 * @param  {Number}  y3
 * @param  {Number}  lineWidth
 * @param  {Number}  x
 * @param  {Number}  y
 * @return {boolean}
 */
function containStroke(x0, y0, x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
  if (lineWidth === 0) {
    return false;
  }

  var _l = lineWidth; // Quick reject

  if (y > y0 + _l && y > y1 + _l && y > y2 + _l && y > y3 + _l || y < y0 - _l && y < y1 - _l && y < y2 - _l && y < y3 - _l || x > x0 + _l && x > x1 + _l && x > x2 + _l && x > x3 + _l || x < x0 - _l && x < x1 - _l && x < x2 - _l && x < x3 - _l) {
    return false;
  }

  var d = curve.cubicProjectPoint(x0, y0, x1, y1, x2, y2, x3, y3, x, y, null);
  return d <= _l / 2;
}

exports.containStroke = containStroke;
}, function(modId) { var map = {"../utils/curve_util":1582161598646}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598651, function(require, module, exports) {
var _curve_util = require("../utils/curve_util");

var quadraticProjectPoint = _curve_util.quadraticProjectPoint;

/**
 * 二次贝塞尔曲线描边包含判断
 * @param  {Number}  x0
 * @param  {Number}  y0
 * @param  {Number}  x1
 * @param  {Number}  y1
 * @param  {Number}  x2
 * @param  {Number}  y2
 * @param  {Number}  lineWidth
 * @param  {Number}  x
 * @param  {Number}  y
 * @return {boolean}
 */
function containStroke(x0, y0, x1, y1, x2, y2, lineWidth, x, y) {
  if (lineWidth === 0) {
    return false;
  }

  var _l = lineWidth; // Quick reject

  if (y > y0 + _l && y > y1 + _l && y > y2 + _l || y < y0 - _l && y < y1 - _l && y < y2 - _l || x > x0 + _l && x > x1 + _l && x > x2 + _l || x < x0 - _l && x < x1 - _l && x < x2 - _l) {
    return false;
  }

  var d = quadraticProjectPoint(x0, y0, x1, y1, x2, y2, x, y, null);
  return d <= _l / 2;
}

exports.containStroke = containStroke;
}, function(modId) { var map = {"../utils/curve_util":1582161598646}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598652, function(require, module, exports) {
var _radian_util = require("./radian_util");

var normalizeRadian = _radian_util.normalizeRadian;

var _constants = require("../../graphic/constants");

var PI2 = _constants.PI2;
var mathSqrt = _constants.mathSqrt;
var mathAbs = _constants.mathAbs;
var mathAtan2 = _constants.mathAtan2;

/**
 * 圆弧描边包含判断
 * @param  {Number}  cx
 * @param  {Number}  cy
 * @param  {Number}  r
 * @param  {Number}  startAngle
 * @param  {Number}  endAngle
 * @param  {boolean}  anticlockwise
 * @param  {Number} lineWidth
 * @param  {Number}  x
 * @param  {Number}  y
 * @return {Boolean}
 */
function containStroke(cx, cy, r, startAngle, endAngle, anticlockwise, lineWidth, x, y) {
  if (lineWidth === 0) {
    return false;
  }

  var _l = lineWidth;
  x -= cx;
  y -= cy;
  var d = mathSqrt(x * x + y * y);

  if (d - _l > r || d + _l < r) {
    return false;
  }

  if (mathAbs(startAngle - endAngle) % PI2 < 1e-4) {
    // Is a circle
    return true;
  }

  if (anticlockwise) {
    var tmp = startAngle;
    startAngle = normalizeRadian(endAngle);
    endAngle = normalizeRadian(tmp);
  } else {
    startAngle = normalizeRadian(startAngle);
    endAngle = normalizeRadian(endAngle);
  }

  if (startAngle > endAngle) {
    endAngle += PI2;
  }

  var angle = mathAtan2(y, x);

  if (angle < 0) {
    angle += PI2;
  }

  return angle >= startAngle && angle <= endAngle || angle + PI2 >= startAngle && angle + PI2 <= endAngle;
}

exports.containStroke = containStroke;
}, function(modId) { var map = {"./radian_util":1582161598653,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598653, function(require, module, exports) {
var _constants = require("../../graphic/constants");

var PI2 = _constants.PI2;

function normalizeRadian(angle) {
  angle %= PI2;

  if (angle < 0) {
    angle += PI2;
  }

  return angle;
}

exports.normalizeRadian = normalizeRadian;
}, function(modId) { var map = {"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598654, function(require, module, exports) {
function windingLine(x0, y0, x1, y1, x, y) {
  if (y > y0 && y > y1 || y < y0 && y < y1) {
    return 0;
  } // Ignore horizontal line


  if (y1 === y0) {
    return 0;
  }

  var dir = y1 < y0 ? 1 : -1;
  var t = (y - y0) / (y1 - y0); // Avoid winding error when intersection point is the connect point of two line of polygon

  if (t === 1 || t === 0) {
    dir = y1 < y0 ? 0.5 : -0.5;
  }

  var x_ = t * (x1 - x0) + x0; // If (x, y) on the line, considered as "contain".

  return x_ === x ? Infinity : x_ > x ? dir : 0;
}

module.exports = windingLine;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598655, function(require, module, exports) {
var PathProxy = require("../../graphic/PathProxy");

var _vector = require("./vector");

var v2ApplyTransform = _vector.applyTransform;

var _constants = require("../../graphic/constants");

var mathSqrt = _constants.mathSqrt;
var mathAtan2 = _constants.mathAtan2;
var CMD = PathProxy.CMD;
var points = [[], [], []];

function _default(path, m) {
  var data = path.data;
  var cmd;
  var nPoint;
  var i;
  var j;
  var k;
  var p;
  var M = CMD.M;
  var C = CMD.C;
  var L = CMD.L;
  var R = CMD.R;
  var A = CMD.A;
  var Q = CMD.Q;

  for (i = 0, j = 0; i < data.length;) {
    cmd = data[i++];
    j = i;
    nPoint = 0;

    switch (cmd) {
      case M:
        nPoint = 1;
        break;

      case L:
        nPoint = 1;
        break;

      case C:
        nPoint = 3;
        break;

      case Q:
        nPoint = 2;
        break;

      case A:
        var x = m[4];
        var y = m[5];
        var sx = mathSqrt(m[0] * m[0] + m[1] * m[1]);
        var sy = mathSqrt(m[2] * m[2] + m[3] * m[3]);
        var angle = mathAtan2(-m[1] / sy, m[0] / sx); // cx

        data[i] *= sx;
        data[i++] += x; // cy

        data[i] *= sy;
        data[i++] += y; // Scale rx and ry
        // FIXME Assume psi is 0 here

        data[i++] *= sx;
        data[i++] *= sy; // Start angle

        data[i++] += angle; // end angle

        data[i++] += angle; // FIXME psi

        i += 2;
        j = i;
        break;

      case R:
        // x0, y0
        p[0] = data[i++];
        p[1] = data[i++];
        v2ApplyTransform(p, p, m);
        data[j++] = p[0];
        data[j++] = p[1]; // x1, y1

        p[0] += data[i++];
        p[1] += data[i++];
        v2ApplyTransform(p, p, m);
        data[j++] = p[0];
        data[j++] = p[1];
    }

    for (k = 0; k < nPoint; k++) {
      var p = points[k];
      p[0] = data[i++];
      p[1] = data[i++];
      v2ApplyTransform(p, p, m); // Write back

      data[j++] = p[0];
      data[j++] = p[1];
    }
  }
}

module.exports = _default;
}, function(modId) { var map = {"../../graphic/PathProxy":1582161598645,"./vector":1582161598605,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598656, function(require, module, exports) {
var Group = require("../graphic/Group");

var QImage = require("../graphic/Image");

var Text = require("../graphic/Text");

var Circle = require("../graphic/shape/Circle");

var Rect = require("../graphic/shape/Rect");

var Ellipse = require("../graphic/shape/Ellipse");

var Line = require("../graphic/shape/Line");

var Path = require("../graphic/Path");

var Polygon = require("../graphic/shape/Polygon");

var Polyline = require("../graphic/shape/Polyline");

var LinearGradient = require("../graphic/gradient/LinearGradient");

var Style = require("../graphic/Style");

var matrix = require("../core/utils/matrix");

var _path_util = require("../core/utils/path_util");

var createFromString = _path_util.createFromString;

var _data_structure_util = require("../core/utils/data_structure_util");

var isString = _data_structure_util.isString;
var extend = _data_structure_util.extend;
var trim = _data_structure_util.trim;
var each = _data_structure_util.each;

var _class_util = require("../core/utils/class_util");

var defaults = _class_util.defaults;

var _constants = require("../graphic/constants");

var mathMin = _constants.mathMin;
// Most of the values can be separated by comma and/or white space.
var DILIMITER_REG = /[\s,]+/;
/**
 * For big svg string, this method might be time consuming.
 * //TODO:try to move this into webworker.
 * @param {String} svg xml string
 * @return {Object} xml root.
 */

function parseXML(svg) {
  if (isString(svg)) {
    var parser = new DOMParser();
    svg = parser.parseFromString(svg, 'text/xml');
  } // Document node. If using $.get, doc node may be input.


  if (svg.nodeType === 9) {
    svg = svg.firstChild;
  } // nodeName of <!DOCTYPE svg> is also 'svg'.


  while (svg.nodeName.toLowerCase() !== 'svg' || svg.nodeType !== 1) {
    svg = svg.nextSibling;
  }

  return svg;
}
/**
 * @class qrenderer.svg.SVGParser
 * 
 * This is a tool class for parsing SVG xml string to standard shape classes.
 * 
 * 这是一个工具类，用来把 SVG 格式的 xml 解析成 graphic 包中定义的标准类。
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */


function SVGParser() {
  this._defs = {};
  this._root = null;
  this._isDefine = false;
  this._isText = false;
}

SVGParser.prototype = {
  constructor: SVGParser,
  parse: function parse(xml, opt) {
    opt = opt || {};
    var svg = parseXML(xml);

    if (!svg) {
      throw new Error('Illegal svg');
    }

    var root = new Group();
    this._root = root; // parse view port

    var viewBox = svg.getAttribute('viewBox') || ''; // If width/height not specified, means "100%" of `opt.width/height`.
    // TODO: Other percent value not supported yet.

    var width = parseFloat(svg.getAttribute('width') || opt.width);
    var height = parseFloat(svg.getAttribute('height') || opt.height); // If width/height not specified, set as null for output.

    isNaN(width) && (width = null);
    isNaN(height) && (height = null); // Apply inline style on svg element.

    parseAttributes(svg, root, null, true);
    var child = svg.firstChild;

    while (child) {
      this._parseNode(child, root);

      child = child.nextSibling;
    }

    var viewBoxRect;
    var viewBoxTransform;

    if (viewBox) {
      var viewBoxArr = trim(viewBox).split(DILIMITER_REG); // Some invalid case like viewBox: 'none'.

      if (viewBoxArr.length >= 4) {
        viewBoxRect = {
          x: parseFloat(viewBoxArr[0] || 0),
          y: parseFloat(viewBoxArr[1] || 0),
          width: parseFloat(viewBoxArr[2]),
          height: parseFloat(viewBoxArr[3])
        };
      }
    }

    if (viewBoxRect && width != null && height != null) {
      viewBoxTransform = makeViewBoxTransform(viewBoxRect, width, height);

      if (!opt.ignoreViewBox) {
        // If set transform on the output group, it probably bring trouble when
        // some users only intend to show the clipped content inside the viewBox,
        // but not intend to transform the output group. So we keep the output
        // group no transform. If the user intend to use the viewBox as a
        // camera, just set `opt.ignoreViewBox` as `true` and set transfrom
        // manually according to the viewBox info in the output of this method.
        var elRoot = root;
        root = new Group();
        root.add(elRoot);
        elRoot.scale = viewBoxTransform.scale.slice();
        elRoot.position = viewBoxTransform.position.slice();
      }
    } // Some shapes might be overflow the viewport, which should be
    // clipped despite whether the viewBox is used, as the SVG does.


    if (!opt.ignoreRootClip && width != null && height != null) {
      root.setClipPath(new Rect({
        shape: {
          x: 0,
          y: 0,
          width: width,
          height: height
        }
      }));
    } // Set width/height on group just for output the viewport size.


    return {
      root: root,
      width: width,
      height: height,
      viewBoxRect: viewBoxRect,
      viewBoxTransform: viewBoxTransform
    };
  },
  _parseNode: function _parseNode(xmlNode, parentGroup) {
    var nodeName = xmlNode.nodeName.toLowerCase(); // TODO
    // support <style>...</style> in svg, where nodeName is 'style',
    // CSS classes is defined globally wherever the style tags are declared.

    if (nodeName === 'defs') {
      // define flag
      this._isDefine = true;
    } else if (nodeName === 'text') {
      this._isText = true;
    }

    var el;

    if (this._isDefine) {
      var parser = defineParsers[nodeName];

      if (parser) {
        var def = parser.call(this, xmlNode);
        var id = xmlNode.getAttribute('id');

        if (id) {
          this._defs[id] = def;
        }
      }
    } else {
      var _parser = nodeParsers[nodeName];

      if (_parser) {
        el = _parser.call(this, xmlNode, parentGroup);
        parentGroup.add(el);
      }
    }

    var child = xmlNode.firstChild;

    while (child) {
      if (child.nodeType === 1) {
        this._parseNode(child, el);
      } // Is text


      if (child.nodeType === 3 && this._isText) {
        this._parseText(child, el);
      }

      child = child.nextSibling;
    } // Quit define


    if (nodeName === 'defs') {
      this._isDefine = false;
    } else if (nodeName === 'text') {
      this._isText = false;
    }
  },
  _parseText: function _parseText(xmlNode, parentGroup) {
    if (xmlNode.nodeType === 1) {
      var dx = xmlNode.getAttribute('dx') || 0;
      var dy = xmlNode.getAttribute('dy') || 0;
      this._textX += parseFloat(dx);
      this._textY += parseFloat(dy);
    }

    var text = new Text({
      style: {
        text: xmlNode.textContent,
        transformText: true
      },
      position: [this._textX || 0, this._textY || 0]
    });
    inheritStyle(parentGroup, text);
    parseAttributes(xmlNode, text, this._defs);
    var fontSize = text.style.fontSize;

    if (fontSize && fontSize < 9) {
      // PENDING
      text.style.fontSize = 9;
      text.scale = text.scale || [1, 1];
      text.scale[0] *= fontSize / 9;
      text.scale[1] *= fontSize / 9;
    }

    var rect = text.getBoundingRect();
    this._textX += rect.width;
    parentGroup.add(text);
    return text;
  }
};
var nodeParsers = {
  'g': function g(xmlNode, parentGroup) {
    var g = new Group();
    inheritStyle(parentGroup, g);
    parseAttributes(xmlNode, g, this._defs);
    return g;
  },
  'rect': function rect(xmlNode, parentGroup) {
    var rect = new Rect();
    inheritStyle(parentGroup, rect);
    parseAttributes(xmlNode, rect, this._defs);
    rect.setShape({
      x: parseFloat(xmlNode.getAttribute('x') || 0),
      y: parseFloat(xmlNode.getAttribute('y') || 0),
      width: parseFloat(xmlNode.getAttribute('width') || 0),
      height: parseFloat(xmlNode.getAttribute('height') || 0)
    }); // console.log(xmlNode.getAttribute('transform'));
    // console.log(rect.transform);

    return rect;
  },
  'circle': function circle(xmlNode, parentGroup) {
    var circle = new Circle();
    inheritStyle(parentGroup, circle);
    parseAttributes(xmlNode, circle, this._defs);
    circle.setShape({
      cx: parseFloat(xmlNode.getAttribute('cx') || 0),
      cy: parseFloat(xmlNode.getAttribute('cy') || 0),
      r: parseFloat(xmlNode.getAttribute('r') || 0)
    });
    return circle;
  },
  'line': function line(xmlNode, parentGroup) {
    var line = new Line();
    inheritStyle(parentGroup, line);
    parseAttributes(xmlNode, line, this._defs);
    line.setShape({
      x1: parseFloat(xmlNode.getAttribute('x1') || 0),
      y1: parseFloat(xmlNode.getAttribute('y1') || 0),
      x2: parseFloat(xmlNode.getAttribute('x2') || 0),
      y2: parseFloat(xmlNode.getAttribute('y2') || 0)
    });
    return line;
  },
  'ellipse': function ellipse(xmlNode, parentGroup) {
    var ellipse = new Ellipse();
    inheritStyle(parentGroup, ellipse);
    parseAttributes(xmlNode, ellipse, this._defs);
    ellipse.setShape({
      cx: parseFloat(xmlNode.getAttribute('cx') || 0),
      cy: parseFloat(xmlNode.getAttribute('cy') || 0),
      rx: parseFloat(xmlNode.getAttribute('rx') || 0),
      ry: parseFloat(xmlNode.getAttribute('ry') || 0)
    });
    return ellipse;
  },
  'polygon': function polygon(xmlNode, parentGroup) {
    var points = xmlNode.getAttribute('points');

    if (points) {
      points = parsePoints(points);
    }

    var polygon = new Polygon({
      shape: {
        points: points || []
      }
    });
    inheritStyle(parentGroup, polygon);
    parseAttributes(xmlNode, polygon, this._defs);
    return polygon;
  },
  'polyline': function polyline(xmlNode, parentGroup) {
    var path = new Path();
    inheritStyle(parentGroup, path);
    parseAttributes(xmlNode, path, this._defs);
    var points = xmlNode.getAttribute('points');

    if (points) {
      points = parsePoints(points);
    }

    var polyline = new Polyline({
      shape: {
        points: points || []
      }
    });
    return polyline;
  },
  'image': function image(xmlNode, parentGroup) {
    var img = new QImage();
    inheritStyle(parentGroup, img);
    parseAttributes(xmlNode, img, this._defs);
    img.setStyle({
      image: xmlNode.getAttribute('xlink:href'),
      x: xmlNode.getAttribute('x'),
      y: xmlNode.getAttribute('y'),
      width: xmlNode.getAttribute('width'),
      height: xmlNode.getAttribute('height')
    });
    return img;
  },
  'text': function text(xmlNode, parentGroup) {
    var x = xmlNode.getAttribute('x') || 0;
    var y = xmlNode.getAttribute('y') || 0;
    var dx = xmlNode.getAttribute('dx') || 0;
    var dy = xmlNode.getAttribute('dy') || 0;
    this._textX = parseFloat(x) + parseFloat(dx);
    this._textY = parseFloat(y) + parseFloat(dy);
    var g = new Group();
    inheritStyle(parentGroup, g);
    parseAttributes(xmlNode, g, this._defs);
    return g;
  },
  'tspan': function tspan(xmlNode, parentGroup) {
    var x = xmlNode.getAttribute('x');
    var y = xmlNode.getAttribute('y');

    if (x != null) {
      // new offset x
      this._textX = parseFloat(x);
    }

    if (y != null) {
      // new offset y
      this._textY = parseFloat(y);
    }

    var dx = xmlNode.getAttribute('dx') || 0;
    var dy = xmlNode.getAttribute('dy') || 0;
    var g = new Group();
    inheritStyle(parentGroup, g);
    parseAttributes(xmlNode, g, this._defs);
    this._textX += dx;
    this._textY += dy;
    return g;
  },
  'path': function path(xmlNode, parentGroup) {
    // TODO svg fill rule
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/fill-rule
    // path.style.globalCompositeOperation = 'xor';
    var d = xmlNode.getAttribute('d') || ''; // Performance sensitive.

    var path = createFromString(d);
    inheritStyle(parentGroup, path);
    parseAttributes(xmlNode, path, this._defs);
    return path;
  }
};
var defineParsers = {
  'lineargradient': function lineargradient(xmlNode) {
    var x1 = parseInt(xmlNode.getAttribute('x1') || 0, 10);
    var y1 = parseInt(xmlNode.getAttribute('y1') || 0, 10);
    var x2 = parseInt(xmlNode.getAttribute('x2') || 10, 10);
    var y2 = parseInt(xmlNode.getAttribute('y2') || 0, 10);
    var gradient = new LinearGradient(x1, y1, x2, y2);

    _parseGradientColorStops(xmlNode, gradient);

    return gradient;
  },
  'radialgradient': function radialgradient(xmlNode) {}
};

function _parseGradientColorStops(xmlNode, gradient) {
  var stop = xmlNode.firstChild;

  while (stop) {
    if (stop.nodeType === 1) {
      var offset = stop.getAttribute('offset');

      if (offset.indexOf('%') > 0) {
        // percentage
        offset = parseInt(offset, 10) / 100;
      } else if (offset) {
        // number from 0 to 1
        offset = parseFloat(offset);
      } else {
        offset = 0;
      }

      var stopColor = stop.getAttribute('stop-color') || '#000000';
      gradient.addColorStop(offset, stopColor);
    }

    stop = stop.nextSibling;
  }
}

function inheritStyle(parent, child) {
  if (parent && parent.__inheritedStyle) {
    if (!child.__inheritedStyle) {
      child.__inheritedStyle = {};
    }

    defaults(child.__inheritedStyle, parent.__inheritedStyle);
  }
}

function parsePoints(pointsString) {
  var list = trim(pointsString).split(DILIMITER_REG);
  var points = [];

  for (var i = 0; i < list.length; i += 2) {
    var x = parseFloat(list[i]);
    var y = parseFloat(list[i + 1]);
    points.push([x, y]);
  }

  return points;
}

var attributesMap = {
  'fill': 'fill',
  'stroke': 'stroke',
  'stroke-width': 'lineWidth',
  'opacity': 'opacity',
  'fill-opacity': 'fillOpacity',
  'stroke-opacity': 'strokeOpacity',
  'stroke-dasharray': 'lineDash',
  'stroke-dashoffset': 'lineDashOffset',
  'stroke-linecap': 'lineCap',
  'stroke-linejoin': 'lineJoin',
  'stroke-miterlimit': 'miterLimit',
  'font-family': 'fontFamily',
  'font-size': 'fontSize',
  'font-style': 'fontStyle',
  'font-weight': 'fontWeight',
  'text-align': 'textAlign',
  'alignment-baseline': 'textBaseline'
};

function parseAttributes(xmlNode, el, defs, onlyInlineStyle) {
  var qrStyle = el.__inheritedStyle || {};
  var isTextEl = el.type === 'text'; // TODO Shadow

  if (xmlNode.nodeType === 1) {
    parseTransformAttribute(xmlNode, el);
    extend(qrStyle, parseStyleAttribute(xmlNode));

    if (!onlyInlineStyle) {
      for (var svgAttrName in attributesMap) {
        if (attributesMap.hasOwnProperty(svgAttrName)) {
          var attrValue = xmlNode.getAttribute(svgAttrName);

          if (attrValue != null) {
            qrStyle[attributesMap[svgAttrName]] = attrValue;
          }
        }
      }
    }
  }

  var elFillProp = isTextEl ? 'textFill' : 'fill';
  var elStrokeProp = isTextEl ? 'textStroke' : 'stroke';
  el.style = el.style || new Style();
  var elStyle = el.style;
  qrStyle.fill != null && elStyle.set(elFillProp, getPaint(qrStyle.fill, defs));
  qrStyle.stroke != null && elStyle.set(elStrokeProp, getPaint(qrStyle.stroke, defs));
  each(['lineWidth', 'opacity', 'fillOpacity', 'strokeOpacity', 'miterLimit', 'fontSize'], function (propName) {
    var elPropName = propName === 'lineWidth' && isTextEl ? 'textStrokeWidth' : propName;
    qrStyle[propName] != null && elStyle.set(elPropName, parseFloat(qrStyle[propName]));
  });

  if (!qrStyle.textBaseline || qrStyle.textBaseline === 'auto') {
    qrStyle.textBaseline = 'alphabetic';
  }

  if (qrStyle.textBaseline === 'alphabetic') {
    qrStyle.textBaseline = 'bottom';
  }

  if (qrStyle.textAlign === 'start') {
    qrStyle.textAlign = 'left';
  }

  if (qrStyle.textAlign === 'end') {
    qrStyle.textAlign = 'right';
  }

  each(['lineDashOffset', 'lineCap', 'lineJoin', 'fontWeight', 'fontFamily', 'fontStyle', 'textAlign', 'textBaseline'], function (propName) {
    qrStyle[propName] != null && elStyle.set(propName, qrStyle[propName]);
  });

  if (qrStyle.lineDash) {
    el.style.lineDash = trim(qrStyle.lineDash).split(DILIMITER_REG);
  }

  if (elStyle[elStrokeProp] && elStyle[elStrokeProp] !== 'none') {
    // enable stroke
    el[elStrokeProp] = true;
  }

  el.__inheritedStyle = qrStyle;
}

var urlRegex = /url\(\s*#(.*?)\)/;

function getPaint(str, defs) {
  // if (str === 'none') {
  //     return;
  // }
  var urlMatch = defs && str && str.match(urlRegex);

  if (urlMatch) {
    var url = trim(urlMatch[1]);
    var def = defs[url];
    return def;
  }

  return str;
}

var transformRegex = /(translate|scale|rotate|skewX|skewY|matrix)\(([\-\s0-9\.e,]*)\)/g;

function parseTransformAttribute(xmlNode, node) {
  var transform = xmlNode.getAttribute('transform');

  if (transform) {
    transform = transform.replace(/,/g, ' ');
    var m = null;
    var transformOps = [];
    transform.replace(transformRegex, function (str, type, value) {
      transformOps.push(type, value);
    });

    for (var i = transformOps.length - 1; i > 0; i -= 2) {
      var value = transformOps[i];
      var type = transformOps[i - 1];
      m = m || matrix.create();

      switch (type) {
        case 'translate':
          value = trim(value).split(DILIMITER_REG);
          matrix.translate(m, m, [parseFloat(value[0]), parseFloat(value[1] || 0)]);
          break;

        case 'scale':
          value = trim(value).split(DILIMITER_REG);
          matrix.scale(m, m, [parseFloat(value[0]), parseFloat(value[1] || value[0])]);
          break;

        case 'rotate':
          value = trim(value).split(DILIMITER_REG);
          matrix.rotate(m, m, parseFloat(value[0]));
          break;

        case 'skew':
          value = trim(value).split(DILIMITER_REG);
          console.warn('Skew transform is not supported yet');
          break;

        case 'matrix':
          value = trim(value).split(DILIMITER_REG);
          m[0] = parseFloat(value[0]);
          m[1] = parseFloat(value[1]);
          m[2] = parseFloat(value[2]);
          m[3] = parseFloat(value[3]);
          m[4] = parseFloat(value[4]);
          m[5] = parseFloat(value[5]);
          break;
      }
    }

    node.setLocalTransform(m);
  }
} // Value may contain space.


var styleRegex = /([^\s:;]+)\s*:\s*([^:;]+)/g;

function parseStyleAttribute(xmlNode) {
  var style = xmlNode.getAttribute('style');
  var result = {};

  if (!style) {
    return result;
  }

  var styleList = {};
  styleRegex.lastIndex = 0;
  var styleRegResult;

  while ((styleRegResult = styleRegex.exec(style)) != null) {
    styleList[styleRegResult[1]] = styleRegResult[2];
  }

  for (var svgAttrName in attributesMap) {
    if (attributesMap.hasOwnProperty(svgAttrName) && styleList[svgAttrName] != null) {
      result[attributesMap[svgAttrName]] = styleList[svgAttrName];
    }
  }

  return result;
}
/**
 * @param {Array<Number>} viewBoxRect
 * @param {Number} width
 * @param {Number} height
 * @return {Object} {scale, position}
 */


function makeViewBoxTransform(viewBoxRect, width, height) {
  var scaleX = width / viewBoxRect.width;
  var scaleY = height / viewBoxRect.height;
  var scale = mathMin(scaleX, scaleY); // preserveAspectRatio 'xMidYMid'

  var viewBoxScale = [scale, scale];
  var viewBoxPosition = [-(viewBoxRect.x + viewBoxRect.width / 2) * scale + width / 2, -(viewBoxRect.y + viewBoxRect.height / 2) * scale + height / 2];
  return {
    scale: viewBoxScale,
    position: viewBoxPosition
  };
}
/**
 * @static
 * @method parseSVG
 * 
 * Parse SVG DOM to QuarkRenderer specific interfaces.
 * 
 * 把 SVG DOM 标签解析成 QuarkRenderer 所定义的接口。
 * 
 * @param {String|XMLElement} xml
 * @param {Object} [opt]
 * @param {Number} [opt.width] Default width if svg width not specified or is a percent value.
 * @param {Number} [opt.height] Default height if svg height not specified or is a percent value.
 * @param {Boolean} [opt.ignoreViewBox]
 * @param {Boolean} [opt.ignoreRootClip]
 * @return {Object} result:
 * {
 *     root: Group, The root of the the result tree of qrenderer shapes,
 *     width: number, the viewport width of the SVG,
 *     height: number, the viewport height of the SVG,
 *     viewBoxRect: {x, y, width, height}, the declared viewBox rect of the SVG, if exists,
 *     viewBoxTransform: the {scale, position} calculated by viewBox and viewport, is exists.
 * }
 */


function parseSVG(xml, opt) {
  var parser = new SVGParser();
  return parser.parse(xml, opt);
}

exports.parseXML = parseXML;
exports.makeViewBoxTransform = makeViewBoxTransform;
exports.parseSVG = parseSVG;
}, function(modId) { var map = {"../graphic/Group":1582161598612,"../graphic/Image":1582161598633,"../graphic/Text":1582161598657,"../graphic/shape/Circle":1582161598658,"../graphic/shape/Rect":1582161598659,"../graphic/shape/Ellipse":1582161598661,"../graphic/shape/Line":1582161598662,"../graphic/Path":1582161598644,"../graphic/shape/Polygon":1582161598663,"../graphic/shape/Polyline":1582161598667,"../graphic/gradient/LinearGradient":1582161598668,"../graphic/Style":1582161598630,"../core/utils/matrix":1582161598615,"../core/utils/path_util":1582161598643,"../core/utils/data_structure_util":1582161598602,"../core/utils/class_util":1582161598604,"../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598657, function(require, module, exports) {
var Displayable = require("./Displayable");

var dataUtil = require("../core/utils/data_structure_util");

var textContain = require("../core/contain/text");

var textUtil = require("./utils/text_util");

var _constants = require("./constants");

var ContextCachedBy = _constants.ContextCachedBy;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.Text
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var Text =
/*#__PURE__*/
function (_Displayable) {
  _inherits(Text, _Displayable);

  /**
   * @method constructor Text
   * @param {Object} opts 
   */
  function Text(opts) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, opts));
    /**
     * @property {String} type
     */

    _this.type = 'text';
    return _this;
  }

  _createClass(Text, [{
    key: "brush",
    value: function brush(ctx, prevEl) {
      var style = this.style; // Optimize, avoid normalize every time.

      this.__dirty && textUtil.normalizeTextStyle(style, true); // Use props with prefix 'text'.

      style.fill = style.stroke = style.shadowBlur = style.shadowColor = style.shadowOffsetX = style.shadowOffsetY = null;
      var text = style.text; // Convert to string

      text != null && (text += ''); // Do not apply style.bind in Text node. Because the real bind job
      // is in textUtil.renderText, and performance of text render should
      // be considered.
      // style.bind(ctx, this, prevEl);

      if (!textUtil.needDrawText(text, style)) {
        // The current el.style is not applied
        // and should not be used as cache.
        ctx.__attrCachedBy = ContextCachedBy.NONE;
        return;
      }

      this.setTransform(ctx);
      textUtil.renderText(this, ctx, text, style, null, prevEl);
      this.restoreTransform(ctx);
    }
  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      var style = this.style; // Optimize, avoid normalize every time.

      this.__dirty && textUtil.normalizeTextStyle(style, true);

      if (!this._rect) {
        var text = style.text;
        text != null ? text += '' : text = '';
        var rect = textContain.getBoundingRect(style.text + '', style.font, style.textAlign, style.textVerticalAlign, style.textPadding, style.textLineHeight, style.rich);
        rect.x += style.x || 0;
        rect.y += style.y || 0;

        if (textUtil.getStroke(style.textStroke, style.textStrokeWidth)) {
          var w = style.textStrokeWidth;
          rect.x -= w / 2;
          rect.y -= w / 2;
          rect.width += w;
          rect.height += w;
        }

        this._rect = rect;
      }

      return this._rect;
    }
  }]);

  return Text;
}(Displayable);

module.exports = Text;
}, function(modId) { var map = {"./Displayable":1582161598634,"../core/utils/data_structure_util":1582161598602,"../core/contain/text":1582161598637,"./utils/text_util":1582161598636,"./constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598658, function(require, module, exports) {
var Path = require("../Path");

var dataUtil = require("../../core/utils/data_structure_util");

var _constants = require("../../graphic/constants");

var PI2 = _constants.PI2;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Circle 
 * 圆形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'circle',
  shape: {
    cx: 0,
    cy: 0,
    r: 0
  }
};

var Circle =
/*#__PURE__*/
function (_Path) {
  _inherits(Circle, _Path);

  /**
   * @method constructor Rect
   * @param {Object} options 
   */
  function Circle(options) {
    _classCallCheck(this, Circle);

    return _possibleConstructorReturn(this, _getPrototypeOf(Circle).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Circle, [{
    key: "buildPath",
    value: function buildPath(ctx, shape, inBundle) {
      // Better stroking in ShapeBundle
      // Always do it may have performence issue ( fill may be 2x more cost)
      if (inBundle) {
        ctx.moveTo(shape.cx + shape.r, shape.cy);
      } // else {
      //     if (ctx.allocate && !ctx.data.length) {
      //         ctx.allocate(ctx.CMD_MEM_SIZE.A);
      //     }
      // }
      // Better stroking in ShapeBundle
      // ctx.moveTo(shape.cx + shape.r, shape.cy);


      ctx.arc(shape.cx, shape.cy, shape.r, 0, PI2, true);
    }
  }]);

  return Circle;
}(Path);

module.exports = Circle;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/data_structure_util":1582161598602,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598659, function(require, module, exports) {
var Path = require("../Path");

var roundRectHelper = require("../utils/round_rect");

var _sub_pixel_optimize = require("../utils/sub_pixel_optimize");

var subPixelOptimizeRect = _sub_pixel_optimize.subPixelOptimizeRect;

var dataUtil = require("../../core/utils/data_structure_util");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Rect 
 * 矩形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
// Avoid create repeatly.
var subPixelOptimizeOutputShape = {};
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'rect',
  shape: {
    // 左上、右上、右下、左下角的半径依次为r1、r2、r3、r4
    // r缩写为1         相当于 [1, 1, 1, 1]
    // r缩写为[1]       相当于 [1, 1, 1, 1]
    // r缩写为[1, 2]    相当于 [1, 2, 1, 2]
    // r缩写为[1, 2, 3] 相当于 [1, 2, 3, 2]
    r: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
};

var Rect =
/*#__PURE__*/
function (_Path) {
  _inherits(Rect, _Path);

  /**
   * @method constructor Rect
   * @param {Object} options 
   */
  function Rect(options) {
    _classCallCheck(this, Rect);

    return _possibleConstructorReturn(this, _getPrototypeOf(Rect).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Rect, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var x;
      var y;
      var width;
      var height;

      if (this.subPixelOptimize) {
        subPixelOptimizeRect(subPixelOptimizeOutputShape, shape, this.style);
        x = subPixelOptimizeOutputShape.x;
        y = subPixelOptimizeOutputShape.y;
        width = subPixelOptimizeOutputShape.width;
        height = subPixelOptimizeOutputShape.height;
        subPixelOptimizeOutputShape.r = shape.r;
        shape = subPixelOptimizeOutputShape;
      } else {
        x = shape.x;
        y = shape.y;
        width = shape.width;
        height = shape.height;
      }

      if (!shape.r) {
        ctx.rect(x, y, width, height);
      } else {
        roundRectHelper.buildPath(ctx, shape);
      }

      ctx.closePath();
      return;
    }
  }]);

  return Rect;
}(Path);

module.exports = Rect;
}, function(modId) { var map = {"../Path":1582161598644,"../utils/round_rect":1582161598639,"../utils/sub_pixel_optimize":1582161598660,"../../core/utils/data_structure_util":1582161598602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598660, function(require, module, exports) {
var _constants = require("../../graphic/constants");

var mathRound = _constants.mathRound;
var mathMax = _constants.mathMax;

/**
 * Sub-pixel optimize for canvas rendering, prevent from blur
 * when rendering a thin vertical/horizontal line.
 */

/**
 * Sub pixel optimize line for canvas
 *
 * @param {Object} outputShape The modification will be performed on `outputShape`.
 *                 `outputShape` and `inputShape` can be the same object.
 *                 `outputShape` object can be used repeatly, because all of
 *                 the `x1`, `x2`, `y1`, `y2` will be assigned in this method.
 * @param {Object} [inputShape]
 * @param {Number} [inputShape.x1]
 * @param {Number} [inputShape.y1]
 * @param {Number} [inputShape.x2]
 * @param {Number} [inputShape.y2]
 * @param {Object} [style]
 * @param {Number} [style.lineWidth]
 */
function subPixelOptimizeLine(outputShape, inputShape, style) {
  var lineWidth = style && style.lineWidth;

  if (!inputShape || !lineWidth) {
    return;
  }

  var x1 = inputShape.x1;
  var x2 = inputShape.x2;
  var y1 = inputShape.y1;
  var y2 = inputShape.y2;

  if (mathRound(x1 * 2) === mathRound(x2 * 2)) {
    outputShape.x1 = outputShape.x2 = subPixelOptimize(x1, lineWidth, true);
  } else {
    outputShape.x1 = x1;
    outputShape.x2 = x2;
  }

  if (mathRound(y1 * 2) === mathRound(y2 * 2)) {
    outputShape.y1 = outputShape.y2 = subPixelOptimize(y1, lineWidth, true);
  } else {
    outputShape.y1 = y1;
    outputShape.y2 = y2;
  }
}
/**
 * Sub pixel optimize rect for canvas
 *
 * @param {Object} outputShape The modification will be performed on `outputShape`.
 *                 `outputShape` and `inputShape` can be the same object.
 *                 `outputShape` object can be used repeatly, because all of
 *                 the `x`, `y`, `width`, `height` will be assigned in this method.
 * @param {Object} [inputShape]
 * @param {Number} [inputShape.x]
 * @param {Number} [inputShape.y]
 * @param {Number} [inputShape.width]
 * @param {Number} [inputShape.height]
 * @param {Object} [style]
 * @param {Number} [style.lineWidth]
 */


function subPixelOptimizeRect(outputShape, inputShape, style) {
  var lineWidth = style && style.lineWidth;

  if (!inputShape || !lineWidth) {
    return;
  }

  var originX = inputShape.x;
  var originY = inputShape.y;
  var originWidth = inputShape.width;
  var originHeight = inputShape.height;
  outputShape.x = subPixelOptimize(originX, lineWidth, true);
  outputShape.y = subPixelOptimize(originY, lineWidth, true);
  outputShape.width = mathMax(subPixelOptimize(originX + originWidth, lineWidth, false) - outputShape.x, originWidth === 0 ? 0 : 1);
  outputShape.height = mathMax(subPixelOptimize(originY + originHeight, lineWidth, false) - outputShape.y, originHeight === 0 ? 0 : 1);
}
/**
 * Sub pixel optimize for canvas
 *
 * @param {Number} position Coordinate, such as x, y
 * @param {Number} lineWidth Should be nonnegative integer.
 * @param {boolean=} positiveOrNegative Default false (negative).
 * @return {Number} Optimized position.
 */


function subPixelOptimize(position, lineWidth, positiveOrNegative) {
  // Assure that (position + lineWidth / 2) is near integer edge,
  // otherwise line will be fuzzy in canvas.
  var doubledPosition = mathRound(position * 2);
  return (doubledPosition + mathRound(lineWidth)) % 2 === 0 ? doubledPosition / 2 : (doubledPosition + (positiveOrNegative ? 1 : -1)) / 2;
}

exports.subPixelOptimizeLine = subPixelOptimizeLine;
exports.subPixelOptimizeRect = subPixelOptimizeRect;
exports.subPixelOptimize = subPixelOptimize;
}, function(modId) { var map = {"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598661, function(require, module, exports) {
var Path = require("../Path");

var dataUtil = require("../../core/utils/data_structure_util");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Ellipse 
 * 椭圆形状
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'ellipse',
  shape: {
    cx: 0,
    cy: 0,
    rx: 0,
    ry: 0
  }
};

var Droplet =
/*#__PURE__*/
function (_Path) {
  _inherits(Droplet, _Path);

  /**
   * @method constructor Droplet
   * @param {Object} options 
   */
  function Droplet(options) {
    _classCallCheck(this, Droplet);

    return _possibleConstructorReturn(this, _getPrototypeOf(Droplet).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Droplet, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var k = 0.5522848;
      var x = shape.cx;
      var y = shape.cy;
      var a = shape.rx;
      var b = shape.ry;
      var ox = a * k; // 水平控制点偏移量

      var oy = b * k; // 垂直控制点偏移量
      // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线

      ctx.moveTo(x - a, y);
      ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b);
      ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y);
      ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b);
      ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y);
      ctx.closePath();
    }
  }]);

  return Droplet;
}(Path);

module.exports = Droplet;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/data_structure_util":1582161598602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598662, function(require, module, exports) {
var Path = require("../Path");

var _sub_pixel_optimize = require("../utils/sub_pixel_optimize");

var subPixelOptimizeLine = _sub_pixel_optimize.subPixelOptimizeLine;

var dataUtil = require("../../core/utils/data_structure_util");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Line 
 * 直线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
//TODO:Avoid create repeatly.
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'line',
  shape: {
    // Start point
    x1: 0,
    y1: 0,
    // End point
    x2: 0,
    y2: 0,
    percent: 1
  },
  style: {
    stroke: '#000',
    fill: null
  }
};

var Line =
/*#__PURE__*/
function (_Path) {
  _inherits(Line, _Path);

  /**
   * @method constructor Line
   * @param {Object} options 
   */
  function Line(options) {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, _getPrototypeOf(Line).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Line, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var x1;
      var y1;
      var x2;
      var y2;

      if (this.subPixelOptimize) {
        var subPixelOptimizeOutputShape = {};
        subPixelOptimizeLine(subPixelOptimizeOutputShape, shape, this.style);
        x1 = subPixelOptimizeOutputShape.x1;
        y1 = subPixelOptimizeOutputShape.y1;
        x2 = subPixelOptimizeOutputShape.x2;
        y2 = subPixelOptimizeOutputShape.y2;
      } else {
        x1 = shape.x1;
        y1 = shape.y1;
        x2 = shape.x2;
        y2 = shape.y2;
      }

      var percent = shape.percent;

      if (percent === 0) {
        return;
      }

      ctx.moveTo(x1, y1);

      if (percent < 1) {
        x2 = x1 * (1 - percent) + x2 * percent;
        y2 = y1 * (1 - percent) + y2 * percent;
      }

      ctx.lineTo(x2, y2);
    }
    /**
     * Get point at percent
     * @param  {Number} percent
     * @return {Array<Number>}
     */

  }, {
    key: "pointAt",
    value: function pointAt(p) {
      var shape = this.shape;
      return [shape.x1 * (1 - p) + shape.x2 * p, shape.y1 * (1 - p) + shape.y2 * p];
    }
  }]);

  return Line;
}(Path);

module.exports = Line;
}, function(modId) { var map = {"../Path":1582161598644,"../utils/sub_pixel_optimize":1582161598660,"../../core/utils/data_structure_util":1582161598602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598663, function(require, module, exports) {
var Path = require("../Path");

var polyHelper = require("../utils/poly");

var dataUtil = require("../../core/utils/data_structure_util");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Polygon 
 * 多边形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'polygon',
  shape: {
    points: null,
    smooth: false,
    smoothConstraint: null
  }
};

var Polygon =
/*#__PURE__*/
function (_Path) {
  _inherits(Polygon, _Path);

  /**
   * @method constructor Polygon
   * @param {Object} options 
   */
  function Polygon(options) {
    _classCallCheck(this, Polygon);

    return _possibleConstructorReturn(this, _getPrototypeOf(Polygon).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Polygon, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      polyHelper.buildPath(ctx, shape, true);
    }
  }]);

  return Polygon;
}(Path);

module.exports = Polygon;
}, function(modId) { var map = {"../Path":1582161598644,"../utils/poly":1582161598664,"../../core/utils/data_structure_util":1582161598602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598664, function(require, module, exports) {
var smoothSpline = require("./smooth_spline");

var smoothBezier = require("./smooth_bezier");

function buildPath(ctx, shape, closePath) {
  var points = shape.points;
  var smooth = shape.smooth;

  if (points && points.length >= 2) {
    if (smooth && smooth !== 'spline') {
      var controlPoints = smoothBezier(points, smooth, closePath, shape.smoothConstraint);
      ctx.moveTo(points[0][0], points[0][1]);
      var len = points.length;

      for (var i = 0; i < (closePath ? len : len - 1); i++) {
        var cp1 = controlPoints[i * 2];
        var cp2 = controlPoints[i * 2 + 1];
        var p = points[(i + 1) % len];
        ctx.bezierCurveTo(cp1[0], cp1[1], cp2[0], cp2[1], p[0], p[1]);
      }
    } else {
      if (smooth === 'spline') {
        points = smoothSpline(points, closePath);
      }

      ctx.moveTo(points[0][0], points[0][1]);

      for (var i = 1, l = points.length; i < l; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
      }
    }

    closePath && ctx.closePath();
  }
}

exports.buildPath = buildPath;
}, function(modId) { var map = {"./smooth_spline":1582161598665,"./smooth_bezier":1582161598666}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598665, function(require, module, exports) {
var _vector = require("../../core/utils/vector");

var v2Distance = _vector.distance;

var _constants = require("../../graphic/constants");

var mathFloor = _constants.mathFloor;

/**
 * Catmull-Rom spline 插值折线
 * @author pissang (https://www.github.com/pissang)
 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 */

/**
 * @inner
 */
function interpolate(p0, p1, p2, p3, t, t2, t3) {
  var v0 = (p2 - p0) * 0.5;
  var v1 = (p3 - p1) * 0.5;
  return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
}
/**
 * @alias smoothSpline
 * @param {Array} points 线段顶点数组
 * @param {boolean} isLoop
 * @return {Array}
 */


function _default(points, isLoop) {
  var len = points.length;
  var ret = [];
  var distance = 0;

  for (var i = 1; i < len; i++) {
    distance += v2Distance(points[i - 1], points[i]);
  }

  var segs = distance / 2;
  segs = segs < len ? len : segs;

  for (var i = 0; i < segs; i++) {
    var pos = i / (segs - 1) * (isLoop ? len : len - 1);
    var idx = mathFloor(pos);
    var w = pos - idx;
    var p0;
    var p1 = points[idx % len];
    var p2;
    var p3;

    if (!isLoop) {
      p0 = points[idx === 0 ? idx : idx - 1];
      p2 = points[idx > len - 2 ? len - 1 : idx + 1];
      p3 = points[idx > len - 3 ? len - 1 : idx + 2];
    } else {
      p0 = points[(idx - 1 + len) % len];
      p2 = points[(idx + 1) % len];
      p3 = points[(idx + 2) % len];
    }

    var w2 = w * w;
    var w3 = w * w2;
    ret.push([interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3), interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3)]);
  }

  return ret;
}

module.exports = _default;
}, function(modId) { var map = {"../../core/utils/vector":1582161598605,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598666, function(require, module, exports) {
var _vector = require("../../core/utils/vector");

var v2Min = _vector.min;
var v2Max = _vector.max;
var v2Scale = _vector.scale;
var v2Distance = _vector.distance;
var v2Add = _vector.add;
var v2Clone = _vector.clone;
var v2Sub = _vector.sub;

/**
 * 贝塞尔平滑曲线
 * @author pissang (https://www.github.com/pissang)
 *         Kener (@Kener-林峰, kener.linfeng@gmail.com)
 *         errorrik (errorrik@gmail.com)
 */

/**
 * 贝塞尔平滑曲线
 * @alias smoothBezier
 * @param {Array} points 线段顶点数组
 * @param {Number} smooth 平滑等级, 0-1
 * @param {boolean} isLoop
 * @param {Array} constraint 将计算出来的控制点约束在一个包围盒内
 *                           比如 [[0, 0], [100, 100]], 这个包围盒会与
 *                           整个折线的包围盒做一个并集用来约束控制点。
 * @param {Array} 计算出来的控制点数组
 */
function _default(points, smooth, isLoop, constraint) {
  var cps = [];
  var v = [];
  var v1 = [];
  var v2 = [];
  var prevPoint;
  var nextPoint;
  var min;
  var max;

  if (constraint) {
    min = [Infinity, Infinity];
    max = [-Infinity, -Infinity];

    for (var i = 0, len = points.length; i < len; i++) {
      v2Min(min, min, points[i]);
      v2Max(max, max, points[i]);
    } // 与指定的包围盒做并集


    v2Min(min, min, constraint[0]);
    v2Max(max, max, constraint[1]);
  }

  for (var i = 0, len = points.length; i < len; i++) {
    var point = points[i];

    if (isLoop) {
      prevPoint = points[i ? i - 1 : len - 1];
      nextPoint = points[(i + 1) % len];
    } else {
      if (i === 0 || i === len - 1) {
        cps.push(v2Clone(points[i]));
        continue;
      } else {
        prevPoint = points[i - 1];
        nextPoint = points[i + 1];
      }
    }

    v2Sub(v, nextPoint, prevPoint); // use degree to scale the handle length

    v2Scale(v, v, smooth);
    var d0 = v2Distance(point, prevPoint);
    var d1 = v2Distance(point, nextPoint);
    var sum = d0 + d1;

    if (sum !== 0) {
      d0 /= sum;
      d1 /= sum;
    }

    v2Scale(v1, v, -d0);
    v2Scale(v2, v, d1);
    var cp0 = v2Add([], point, v1);
    var cp1 = v2Add([], point, v2);

    if (constraint) {
      v2Max(cp0, cp0, min);
      v2Min(cp0, cp0, max);
      v2Max(cp1, cp1, min);
      v2Min(cp1, cp1, max);
    }

    cps.push(cp0);
    cps.push(cp1);
  }

  if (isLoop) {
    cps.push(cps.shift());
  }

  return cps;
}

module.exports = _default;
}, function(modId) { var map = {"../../core/utils/vector":1582161598605}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598667, function(require, module, exports) {
var Path = require("../Path");

var polyHelper = require("../utils/poly");

var dataUtil = require("../../core/utils/data_structure_util");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Polyline 
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'polyline',
  shape: {
    points: null,
    smooth: false,
    smoothConstraint: null
  },
  style: {
    stroke: '#000',
    fill: null
  }
};

var Polyline =
/*#__PURE__*/
function (_Path) {
  _inherits(Polyline, _Path);

  /**
   * @method constructor Polyline
   * @param {Object} options 
   */
  function Polyline(options) {
    _classCallCheck(this, Polyline);

    return _possibleConstructorReturn(this, _getPrototypeOf(Polyline).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Polyline, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      polyHelper.buildPath(ctx, shape, false);
    }
  }]);

  return Polyline;
}(Path);

module.exports = Polyline;
}, function(modId) { var map = {"../Path":1582161598644,"../utils/poly":1582161598664,"../../core/utils/data_structure_util":1582161598602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598668, function(require, module, exports) {
var classUtil = require("../../core/utils/class_util");

var Gradient = require("./Gradient");

/**
 * @class qrenderer.graphic.gradient.LinearGradient 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor LinearGradient
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [x2=1]
 * @param {Number} [y2=0]
 * @param {Array<Object>} colorStops
 * @param {boolean} [globalCoord=false]
 */
var LinearGradient = function LinearGradient(x, y, x2, y2, colorStops, globalCoord) {
  // Should do nothing more in this constructor. Because gradient can be
  // declard by `color: {type: 'linear', colorStops: ...}`, where
  // this constructor will not be called.
  this.x = x == null ? 0 : x;
  this.y = y == null ? 0 : y;
  this.x2 = x2 == null ? 1 : x2;
  this.y2 = y2 == null ? 0 : y2; // Can be cloned

  this.type = 'linear'; // If use global coord

  this.global = globalCoord || false;
  Gradient.call(this, colorStops);
};

LinearGradient.prototype = {
  constructor: LinearGradient
};
classUtil.inherits(LinearGradient, Gradient);
var _default = LinearGradient;
module.exports = _default;
}, function(modId) { var map = {"../../core/utils/class_util":1582161598604,"./Gradient":1582161598669}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598669, function(require, module, exports) {
/**
 * @class qrenderer.graphic.gradient.Gradient 
 * 渐变
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor Gradient
 * @param {Array<Object>} colorStops
 */
var Gradient = function Gradient(colorStops) {
  this.colorStops = colorStops || [];
};

Gradient.prototype = {
  constructor: Gradient,
  addColorStop: function addColorStop(offset, color) {
    this.colorStops.push({
      offset: offset,
      color: color
    });
  }
};
var _default = Gradient;
module.exports = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598670, function(require, module, exports) {
var Path = require("./Path");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.CompoundPath 
 * 
 * CompoundPath to improve performance.
 * 
 * 复合路径，用来提升性能。
 * 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'compound',
  shape: {
    paths: null
  }
};

var CompoundPath =
/*#__PURE__*/
function (_Path) {
  _inherits(CompoundPath, _Path);

  /**
   * @method constructor CompoundPath
   * @param {Object} opts 
   */
  function CompoundPath(opts) {
    _classCallCheck(this, CompoundPath);

    return _possibleConstructorReturn(this, _getPrototypeOf(CompoundPath).call(this, opts, defaultConfig));
  }
  /**
   * @private
   * @method _updatePathDirty
   */


  _createClass(CompoundPath, [{
    key: "_updatePathDirty",
    value: function _updatePathDirty() {
      var dirtyPath = this.__dirtyPath;
      var paths = this.shape.paths;

      for (var i = 0; i < paths.length; i++) {
        // Mark as dirty if any subpath is dirty
        dirtyPath = dirtyPath || paths[i].__dirtyPath;
      }

      this.__dirtyPath = dirtyPath;
      this.__dirty = this.__dirty || dirtyPath;
    }
    /**
     * @private
     * @method beforeBrush
     */

  }, {
    key: "beforeBrush",
    value: function beforeBrush() {
      this._updatePathDirty();

      var paths = this.shape.paths || [];
      var scale = this.getGlobalScale(); // Update path scale

      for (var i = 0; i < paths.length; i++) {
        if (!paths[i].path) {
          paths[i].createPathProxy();
        }

        paths[i].path.setScale(scale[0], scale[1], paths[i].segmentIgnoreThreshold);
      }
    }
    /**
     * @method buildPath
     * 绘制元素路径
     * @param {Object} ctx 
     * @param {String} shape 
     */

  }, {
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var paths = shape.paths || [];

      for (var i = 0; i < paths.length; i++) {
        paths[i].buildPath(ctx, paths[i].shape, true);
      }
    }
    /**
     * @private
     * @method afterBrush
     */

  }, {
    key: "afterBrush",
    value: function afterBrush() {
      var paths = this.shape.paths || [];

      for (var i = 0; i < paths.length; i++) {
        paths[i].__dirtyPath = false;
      }
    }
    /**
     * @private
     * @method getBoundingRect
     */

  }, {
    key: "getBoundingRect",
    value: function getBoundingRect() {
      this._updatePathDirty();

      return Path.prototype.getBoundingRect.call(this);
    }
  }]);

  return CompoundPath;
}(Path);

module.exports = CompoundPath;
}, function(modId) { var map = {"./Path":1582161598644}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598671, function(require, module, exports) {
var classUtil = require("../core/utils/class_util");

var Displayble = require("./Displayable");

var BoundingRect = require("./transform/BoundingRect");

/**
 * @class qrenderer.graphic.IncrementalDisplayble 
 * Displayable for incremental rendering. It will be rendered in a separate layer
 * IncrementalDisplay have two main methods. `clearDisplayables` and `addDisplayables`
 * addDisplayables will render the added displayables incremetally.
 *
 * It use a not clearFlag to tell the painter don't clear the layer if it's the first element.
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor IncrementalDisplayble
 * @param {Object} opts 
 */
// TODO Style override ?
function IncrementalDisplayble(opts) {
  classUtil.inheritProperties(this, Displayble, opts);
  this._displayables = [];
  this._temporaryDisplayables = [];
  this._cursor = 0;
  this.notClear = true;
}

var m = [];
IncrementalDisplayble.prototype = {
  constructor: IncrementalDisplayble,
  incremental: true,
  clearDisplaybles: function clearDisplaybles() {
    this._displayables = [];
    this._temporaryDisplayables = [];
    this._cursor = 0;
    this.dirty();
    this.notClear = false;
  },
  addDisplayable: function addDisplayable(displayable, notPersistent) {
    if (notPersistent) {
      this._temporaryDisplayables.push(displayable);
    } else {
      this._displayables.push(displayable);
    }

    this.dirty();
  },
  addDisplayables: function addDisplayables(displayables, notPersistent) {
    notPersistent = notPersistent || false;

    for (var i = 0; i < displayables.length; i++) {
      this.addDisplayable(displayables[i], notPersistent);
    }
  },
  eachPendingDisplayable: function eachPendingDisplayable(cb) {
    for (var i = this._cursor; i < this._displayables.length; i++) {
      cb && cb(this._displayables[i]);
    }

    for (var _i = 0; _i < this._temporaryDisplayables.length; _i++) {
      cb && cb(this._temporaryDisplayables[_i]);
    }
  },
  update: function update() {
    this.updateTransform();

    for (var i = this._cursor; i < this._displayables.length; i++) {
      var displayable = this._displayables[i]; // PENDING

      displayable.parent = this;
      displayable.update();
      displayable.parent = null;
    }

    for (var _i2 = 0; _i2 < this._temporaryDisplayables.length; _i2++) {
      var _displayable = this._temporaryDisplayables[_i2]; // PENDING

      _displayable.parent = this;

      _displayable.update();

      _displayable.parent = null;
    }
  },
  brush: function brush(ctx, prevEl) {
    // Render persistant displayables.
    var i = this._cursor;

    for (; i < this._displayables.length; i++) {
      var displayable = this._displayables[i];
      displayable.beforeBrush && displayable.beforeBrush(ctx);
      displayable.brush(ctx, i === this._cursor ? null : this._displayables[i - 1]);
      displayable.afterBrush && displayable.afterBrush(ctx);
    }

    this._cursor = i; // Render temporary displayables.

    for (var _i3 = 0; _i3 < this._temporaryDisplayables.length; _i3++) {
      var _displayable2 = this._temporaryDisplayables[_i3];
      _displayable2.beforeBrush && _displayable2.beforeBrush(ctx);

      _displayable2.brush(ctx, _i3 === 0 ? null : this._temporaryDisplayables[_i3 - 1]);

      _displayable2.afterBrush && _displayable2.afterBrush(ctx);
    }

    this._temporaryDisplayables = [];
    this.notClear = true;
  },
  getBoundingRect: function getBoundingRect() {
    if (!this._rect) {
      var rect = new BoundingRect(Infinity, Infinity, -Infinity, -Infinity);

      for (var i = 0; i < this._displayables.length; i++) {
        var displayable = this._displayables[i];
        var childRect = displayable.getBoundingRect().clone();

        if (displayable.needLocalTransform()) {
          childRect.applyTransform(displayable.getLocalTransform(m));
        }

        rect.union(childRect);
      }

      this._rect = rect;
    }

    return this._rect;
  },
  contain: function contain(x, y) {
    var localPos = this.transformCoordToLocal(x, y);
    var rect = this.getBoundingRect();

    if (rect.contain(localPos[0], localPos[1])) {
      for (var i = 0; i < this._displayables.length; i++) {
        var displayable = this._displayables[i];

        if (displayable.contain(x, y)) {
          return true;
        }
      }
    }

    return false;
  }
};
classUtil.inherits(IncrementalDisplayble, Displayble);
var _default = IncrementalDisplayble;
module.exports = _default;
}, function(modId) { var map = {"../core/utils/class_util":1582161598604,"./Displayable":1582161598634,"./transform/BoundingRect":1582161598623}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598672, function(require, module, exports) {
var Path = require("../Path");

var dataUtil = require("../../core/utils/data_structure_util");

var _constants = require("../../graphic/constants");

var PI2 = _constants.PI2;
var mathSin = _constants.mathSin;
var mathCos = _constants.mathCos;
var mathMin = _constants.mathMin;
var mathMax = _constants.mathMax;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Arc 
 * 圆弧
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'arc',
  shape: {
    cx: 0,
    cy: 0,
    r: 0,
    startAngle: 0,
    endAngle: PI2,
    clockwise: true
  },
  style: {
    stroke: '#000',
    fill: null
  }
};

var Arc =
/*#__PURE__*/
function (_Path) {
  _inherits(Arc, _Path);

  /**
   * @method constructor Line
   * @param {Object} options 
   */
  function Arc(options) {
    _classCallCheck(this, Arc);

    return _possibleConstructorReturn(this, _getPrototypeOf(Arc).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Arc, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var x = shape.cx;
      var y = shape.cy;
      var r = mathMax(shape.r, 0);
      var startAngle = shape.startAngle;
      var endAngle = shape.endAngle;
      var clockwise = shape.clockwise;
      var unitX = mathCos(startAngle);
      var unitY = mathSin(startAngle);
      ctx.moveTo(unitX * r + x, unitY * r + y);
      ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
    }
  }]);

  return Arc;
}(Path);

module.exports = Arc;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/data_structure_util":1582161598602,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598673, function(require, module, exports) {
var Path = require("../Path");

var vec2 = require("../../core/utils/vector");

var curveUtil = require("../../core/utils/curve_util");

var dataUtil = require("../../core/utils/data_structure_util");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.BezierCurve 
 * 贝塞尔曲线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'bezier-curve',
  shape: {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    cpx1: 0,
    cpy1: 0,
    percent: 1
  },
  style: {
    stroke: '#000',
    fill: null
  }
};
var out = [];

function someVectorAt(shape, t, isTangent) {
  var cpx2 = shape.cpx2;
  var cpy2 = shape.cpy2;

  if (cpx2 === null || cpy2 === null) {
    return [(isTangent ? curveUtil.cubicDerivativeAt : curveUtil.cubicAt)(shape.x1, shape.cpx1, shape.cpx2, shape.x2, t), (isTangent ? curveUtil.cubicDerivativeAt : curveUtil.cubicAt)(shape.y1, shape.cpy1, shape.cpy2, shape.y2, t)];
  } else {
    return [(isTangent ? curveUtil.quadraticDerivativeAt : curveUtil.quadraticAt)(shape.x1, shape.cpx1, shape.x2, t), (isTangent ? curveUtil.quadraticDerivativeAt : curveUtil.quadraticAt)(shape.y1, shape.cpy1, shape.y2, t)];
  }
}

var BezierCurve =
/*#__PURE__*/
function (_Path) {
  _inherits(BezierCurve, _Path);

  /**
   * @method constructor BezierCurve
   * @param {Object} options 
   */
  function BezierCurve(options) {
    _classCallCheck(this, BezierCurve);

    return _possibleConstructorReturn(this, _getPrototypeOf(BezierCurve).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(BezierCurve, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var x1 = shape.x1;
      var y1 = shape.y1;
      var x2 = shape.x2;
      var y2 = shape.y2;
      var cpx1 = shape.cpx1;
      var cpy1 = shape.cpy1;
      var cpx2 = shape.cpx2;
      var cpy2 = shape.cpy2;
      var percent = shape.percent;

      if (percent === 0) {
        return;
      }

      ctx.moveTo(x1, y1);

      if (cpx2 == null || cpy2 == null) {
        if (percent < 1) {
          curveUtil.quadraticSubdivide(x1, cpx1, x2, percent, out);
          cpx1 = out[1];
          x2 = out[2];
          curveUtil.quadraticSubdivide(y1, cpy1, y2, percent, out);
          cpy1 = out[1];
          y2 = out[2];
        }

        ctx.quadraticCurveTo(cpx1, cpy1, x2, y2);
      } else {
        if (percent < 1) {
          curveUtil.cubicSubdivide(x1, cpx1, cpx2, x2, percent, out);
          cpx1 = out[1];
          cpx2 = out[2];
          x2 = out[3];
          curveUtil.cubicSubdivide(y1, cpy1, cpy2, y2, percent, out);
          cpy1 = out[1];
          cpy2 = out[2];
          y2 = out[3];
        }

        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2);
      }
    }
    /**
     * Get point at percent
     * @param  {Number} t
     * @return {Array<Number>}
     */

  }, {
    key: "pointAt",
    value: function pointAt(t) {
      return someVectorAt(this.shape, t, false);
    }
    /**
     * Get tangent at percent
     * @param  {Number} t
     * @return {Array<Number>}
     */

  }, {
    key: "tangentAt",
    value: function tangentAt(t) {
      var p = someVectorAt(this.shape, t, true);
      return vec2.normalize(p, p);
    }
  }]);

  return BezierCurve;
}(Path);

module.exports = BezierCurve;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/vector":1582161598605,"../../core/utils/curve_util":1582161598646,"../../core/utils/data_structure_util":1582161598602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598674, function(require, module, exports) {
var Path = require("../Path");

var dataUtil = require("../../core/utils/data_structure_util");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Droplet 
 * 水滴形状
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'droplet',
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  }
};

var Droplet =
/*#__PURE__*/
function (_Path) {
  _inherits(Droplet, _Path);

  /**
   * @method constructor Droplet
   * @param {Object} options 
   */
  function Droplet(options) {
    _classCallCheck(this, Droplet);

    return _possibleConstructorReturn(this, _getPrototypeOf(Droplet).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Droplet, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var x = shape.cx;
      var y = shape.cy;
      var a = shape.width;
      var b = shape.height;
      ctx.moveTo(x, y + a);
      ctx.bezierCurveTo(x + a, y + a, x + a * 3 / 2, y - a / 3, x, y - b);
      ctx.bezierCurveTo(x - a * 3 / 2, y - a / 3, x - a, y + a, x, y + a);
      ctx.closePath();
    }
  }]);

  return Droplet;
}(Path);

module.exports = Droplet;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/data_structure_util":1582161598602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598675, function(require, module, exports) {
var Path = require("../Path");

var dataUtil = require("../../core/utils/data_structure_util");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Heart 
 * 心形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'heart',
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  }
};

var Heart =
/*#__PURE__*/
function (_Path) {
  _inherits(Heart, _Path);

  /**
   * @method constructor Heart
   * @param {Object} options 
   */
  function Heart(options) {
    _classCallCheck(this, Heart);

    return _possibleConstructorReturn(this, _getPrototypeOf(Heart).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Heart, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var x = shape.cx;
      var y = shape.cy;
      var a = shape.width;
      var b = shape.height;
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + a / 2, y - b * 2 / 3, x + a * 2, y + b / 3, x, y + b);
      ctx.bezierCurveTo(x - a * 2, y + b / 3, x - a / 2, y - b * 2 / 3, x, y);
    }
  }]);

  return Heart;
}(Path);

module.exports = Heart;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/data_structure_util":1582161598602}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598676, function(require, module, exports) {
var Path = require("../Path");

var dataUtil = require("../../core/utils/data_structure_util");

var _constants = require("../../graphic/constants");

var PI = _constants.PI;
var mathSin = _constants.mathSin;
var mathCos = _constants.mathCos;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Isogon 
 * 正多边形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'isogon',
  shape: {
    x: 0,
    y: 0,
    r: 0,
    n: 0
  }
};

var Isogon =
/*#__PURE__*/
function (_Path) {
  _inherits(Isogon, _Path);

  /**
   * @method constructor Isogon
   * @param {Object} options 
   */
  function Isogon(options) {
    _classCallCheck(this, Isogon);

    return _possibleConstructorReturn(this, _getPrototypeOf(Isogon).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Isogon, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var n = shape.n;

      if (!n || n < 2) {
        return;
      }

      var x = shape.x;
      var y = shape.y;
      var r = shape.r;
      var dStep = 2 * PI / n;
      var deg = -PI / 2;
      ctx.moveTo(x + r * mathCos(deg), y + r * mathSin(deg));

      for (var i = 0, end = n - 1; i < end; i++) {
        deg += dStep;
        ctx.lineTo(x + r * mathCos(deg), y + r * mathSin(deg));
      }

      ctx.closePath();
      return;
    }
  }]);

  return Isogon;
}(Path);

module.exports = Isogon;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/data_structure_util":1582161598602,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598677, function(require, module, exports) {
var Path = require("../Path");

var dataUtil = require("../../core/utils/data_structure_util");

var _constants = require("../../graphic/constants");

var PI2 = _constants.PI2;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Ring 
 * 圆环
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'ring',
  shape: {
    cx: 0,
    cy: 0,
    r: 0,
    r0: 0
  }
};

var Ring =
/*#__PURE__*/
function (_Path) {
  _inherits(Ring, _Path);

  /**
   * @method constructor Ring
   * @param {Object} options 
   */
  function Ring(options) {
    _classCallCheck(this, Ring);

    return _possibleConstructorReturn(this, _getPrototypeOf(Ring).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Ring, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var x = shape.cx;
      var y = shape.cy;
      ctx.moveTo(x + shape.r, y);
      ctx.arc(x, y, shape.r, 0, PI2, false);
      ctx.moveTo(x + shape.r0, y);
      ctx.arc(x, y, shape.r0, 0, PI2, true);
    }
  }]);

  return Ring;
}(Path);

module.exports = Ring;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/data_structure_util":1582161598602,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598678, function(require, module, exports) {
var Path = require("../Path");

var dataUtil = require("../../core/utils/data_structure_util");

var _constants = require("../../graphic/constants");

var mathSin = _constants.mathSin;
var mathCos = _constants.mathCos;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Rose 
 * 玫瑰线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var radian = Math.PI / 180;
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'rose',
  shape: {
    cx: 0,
    cy: 0,
    r: [],
    k: 0,
    n: 1
  },
  style: {
    stroke: '#000',
    fill: null
  }
};

var Rose =
/*#__PURE__*/
function (_Path) {
  _inherits(Rose, _Path);

  /**
   * @method constructor Rose
   * @param {Object} options 
   */
  function Rose(options) {
    _classCallCheck(this, Rose);

    return _possibleConstructorReturn(this, _getPrototypeOf(Rose).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Rose, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var x;
      var y;
      var R = shape.r;
      var r;
      var k = shape.k;
      var n = shape.n;
      var x0 = shape.cx;
      var y0 = shape.cy;
      ctx.moveTo(x0, y0);

      for (var i = 0, len = R.length; i < len; i++) {
        r = R[i];

        for (var j = 0; j <= 360 * n; j++) {
          x = r * mathSin(k / n * j % 360 * radian) * mathCos(j * radian) + x0;
          y = r * mathSin(k / n * j % 360 * radian) * mathSin(j * radian) + y0;
          ctx.lineTo(x, y);
        }
      }
    }
  }]);

  return Rose;
}(Path);

module.exports = Rose;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/data_structure_util":1582161598602,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598679, function(require, module, exports) {
var Path = require("../Path");

var fixClipWithShadow = require("../utils/fix_clip_with_shadow");

var dataUtil = require("../../core/utils/data_structure_util");

var _constants = require("../../graphic/constants");

var mathSin = _constants.mathSin;
var mathCos = _constants.mathCos;
var mathMax = _constants.mathMax;
var PI2 = _constants.PI2;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Sector 
 * 扇形
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'sector',
  shape: {
    cx: 0,
    cy: 0,
    r0: 0,
    r: 0,
    startAngle: 0,
    endAngle: PI2,
    clockwise: true
  }
};

var Sector =
/*#__PURE__*/
function (_Path) {
  _inherits(Sector, _Path);

  /**
   * @method constructor Sector
   * @param {Object} options 
   */
  function Sector(options) {
    var _this;

    _classCallCheck(this, Sector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Sector).call(this, dataUtil.merge(defaultConfig, options, true)));
    _this.brush = fixClipWithShadow(Path.prototype.brush);
    return _this;
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Sector, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var x = shape.cx;
      var y = shape.cy;
      var r0 = mathMax(shape.r0 || 0, 0);
      var r = mathMax(shape.r, 0);
      var startAngle = shape.startAngle;
      var endAngle = shape.endAngle;
      var clockwise = shape.clockwise;
      var unitX = mathCos(startAngle);
      var unitY = mathSin(startAngle);
      ctx.moveTo(unitX * r0 + x, unitY * r0 + y);
      ctx.lineTo(unitX * r + x, unitY * r + y);
      ctx.arc(x, y, r, startAngle, endAngle, !clockwise);
      ctx.lineTo(mathCos(endAngle) * r0 + x, mathSin(endAngle) * r0 + y);

      if (r0 !== 0) {
        ctx.arc(x, y, r0, endAngle, startAngle, clockwise);
      }

      ctx.closePath();
    }
  }]);

  return Sector;
}(Path);

module.exports = Sector;
}, function(modId) { var map = {"../Path":1582161598644,"../utils/fix_clip_with_shadow":1582161598680,"../../core/utils/data_structure_util":1582161598602,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598680, function(require, module, exports) {
var env = require("../../core/env");

// Fix weird bug in some version of IE11 (like 11.0.9600.178**),
// where exception "unexpected call to method or property access"
// might be thrown when calling ctx.fill or ctx.stroke after a path
// whose area size is zero is drawn and ctx.clip() is called and
// shadowBlur is set. See #4572, #3112, #5777.
// (e.g.,
//  ctx.moveTo(10, 10);
//  ctx.lineTo(20, 10);
//  ctx.closePath();
//  ctx.clip();
//  ctx.shadowBlur = 10;
//  ...
//  ctx.fill();
// )
var shadowTemp = [['shadowBlur', 0], ['shadowColor', '#000'], ['shadowOffsetX', 0], ['shadowOffsetY', 0]];

function _default(orignalBrush) {
  // version string can be: '11.0'
  return env.browser.ie && env.browser.version >= 11 ? function () {
    var clipPaths = this.__clipPaths;
    var style = this.style;
    var modified;

    if (clipPaths) {
      for (var i = 0; i < clipPaths.length; i++) {
        var clipPath = clipPaths[i];
        var shape = clipPath && clipPath.shape;
        var type = clipPath && clipPath.type;

        if (shape && (type === 'sector' && shape.startAngle === shape.endAngle || type === 'rect' && (!shape.width || !shape.height))) {
          for (var j = 0; j < shadowTemp.length; j++) {
            // It is save to put shadowTemp static, because shadowTemp
            // will be all modified each item brush called.
            shadowTemp[j][2] = style[shadowTemp[j][0]];
            style[shadowTemp[j][0]] = shadowTemp[j][1];
          }

          modified = true;
          break;
        }
      }
    }

    orignalBrush.apply(this, arguments);

    if (modified) {
      for (var j = 0; j < shadowTemp.length; j++) {
        style[shadowTemp[j][0]] = shadowTemp[j][2];
      }
    }
  } : orignalBrush;
}

module.exports = _default;
}, function(modId) { var map = {"../../core/env":1582161598600}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598681, function(require, module, exports) {
var Path = require("../Path");

var dataUtil = require("../../core/utils/data_structure_util");

var _constants = require("../../graphic/constants");

var mathSin = _constants.mathSin;
var mathCos = _constants.mathCos;
var PI2 = _constants.PI2;
var PI = _constants.PI;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Star 
 * n角星（n>3）
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'star',
  shape: {
    cx: 0,
    cy: 0,
    n: 3,
    r0: null,
    r: 0
  }
};

var Star =
/*#__PURE__*/
function (_Path) {
  _inherits(Star, _Path);

  /**
   * @method constructor Star
   * @param {Object} options 
   */
  function Star(options) {
    _classCallCheck(this, Star);

    return _possibleConstructorReturn(this, _getPrototypeOf(Star).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Star, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var n = shape.n;

      if (!n || n < 2) {
        return;
      }

      var x = shape.cx;
      var y = shape.cy;
      var r = shape.r;
      var r0 = shape.r0; // 如果未指定内部顶点外接圆半径，则自动计算

      if (r0 == null) {
        r0 = n > 4 // 相隔的外部顶点的连线的交点，
        // 被取为内部交点，以此计算r0
        ? r * mathCos(2 * PI / n) / mathCos(PI / n) // 二三四角星的特殊处理
        : r / 3;
      }

      var dStep = PI / n;
      var deg = -PI / 2;
      var xStart = x + r * mathCos(deg);
      var yStart = y + r * mathSin(deg);
      deg += dStep; // 记录边界点，用于判断inside

      ctx.moveTo(xStart, yStart);

      for (var i = 0, end = n * 2 - 1, ri; i < end; i++) {
        ri = i % 2 === 0 ? r0 : r;
        ctx.lineTo(x + ri * mathCos(deg), y + ri * mathSin(deg));
        deg += dStep;
      }

      ctx.closePath();
    }
  }]);

  return Star;
}(Path);

module.exports = Star;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/data_structure_util":1582161598602,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598682, function(require, module, exports) {
var Path = require("../Path");

var dataUtil = require("../../core/utils/data_structure_util");

var _constants = require("../../graphic/constants");

var mathSin = _constants.mathSin;
var mathCos = _constants.mathCos;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.graphic.shape.Trochold 
 * 内外旋轮曲线
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */
var defaultConfig = {
  /**
   * @property {String} type
   */
  type: 'trochoid',
  shape: {
    cx: 0,
    cy: 0,
    r: 0,
    r0: 0,
    d: 0,
    location: 'out'
  },
  style: {
    stroke: '#000',
    fill: null
  }
};

var Trochold =
/*#__PURE__*/
function (_Path) {
  _inherits(Trochold, _Path);

  /**
   * @method constructor Trochold
   * @param {Object} options 
   */
  function Trochold(options) {
    _classCallCheck(this, Trochold);

    return _possibleConstructorReturn(this, _getPrototypeOf(Trochold).call(this, dataUtil.merge(defaultConfig, options, true)));
  }
  /**
   * @method buildPath
   * 绘制元素路径
   * @param {Object} ctx 
   * @param {String} shape 
   */


  _createClass(Trochold, [{
    key: "buildPath",
    value: function buildPath(ctx, shape) {
      var x1;
      var y1;
      var x2;
      var y2;
      var R = shape.r;
      var r = shape.r0;
      var d = shape.d;
      var offsetX = shape.cx;
      var offsetY = shape.cy;
      var delta = shape.location === 'out' ? 1 : -1;

      if (shape.location && R <= r) {
        return;
      }

      var num = 0;
      var i = 1;
      var theta;
      x1 = (R + delta * r) * mathCos(0) - delta * d * mathCos(0) + offsetX;
      y1 = (R + delta * r) * mathSin(0) - d * mathSin(0) + offsetY;
      ctx.moveTo(x1, y1); // 计算结束时的i

      do {
        num++;
      } while (r * num % (R + delta * r) !== 0);

      do {
        theta = Math.PI / 180 * i;
        x2 = (R + delta * r) * mathCos(theta) - delta * d * mathCos((R / r + delta) * theta) + offsetX;
        y2 = (R + delta * r) * mathSin(theta) - d * mathSin((R / r + delta) * theta) + offsetY;
        ctx.lineTo(x2, y2);
        i++;
      } while (i <= r * num / (R + delta * r) * 360);
    }
  }]);

  return Trochold;
}(Path);

module.exports = Trochold;
}, function(modId) { var map = {"../Path":1582161598644,"../../core/utils/data_structure_util":1582161598602,"../../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598683, function(require, module, exports) {
var classUtil = require("../../core/utils/class_util");

var Gradient = require("./Gradient");

/**
 * @class qrenderer.graphic.gradient.RadialGradient 
 * @docauthor 大漠穷秋 <damoqiongqiu@126.com>
 */

/**
 * @method constructor RadialGradient
 * @param {Number} [x=0.5]
 * @param {Number} [y=0.5]
 * @param {Number} [r=0.5]
 * @param {Array<Object>} [colorStops]
 * @param {boolean} [globalCoord=false]
 */
var RadialGradient = function RadialGradient(x, y, r, colorStops, globalCoord) {
  // Should do nothing more in this constructor. Because gradient can be
  // declard by `color: {type: 'radial', colorStops: ...}`, where
  // this constructor will not be called.
  this.x = x == null ? 0.5 : x;
  this.y = y == null ? 0.5 : y;
  this.r = r == null ? 0.5 : r; // Can be cloned

  this.type = 'radial'; // If use global coord

  this.global = globalCoord || false;
  Gradient.call(this, colorStops);
};

RadialGradient.prototype = {
  constructor: RadialGradient
};
classUtil.inherits(RadialGradient, Gradient);
var _default = RadialGradient;
module.exports = _default;
}, function(modId) { var map = {"../../core/utils/class_util":1582161598604,"./Gradient":1582161598669}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598684, function(require, module, exports) {
require("./graphic");

var _quarkRenderer = require("../quark-renderer");

var registerPainter = _quarkRenderer.registerPainter;

var SVGPainter = require("./SVGPainter");

registerPainter('svg', SVGPainter);
}, function(modId) { var map = {"./graphic":1582161598685,"../quark-renderer":1582161598598,"./SVGPainter":1582161598687}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598685, function(require, module, exports) {
var _core = require("./core");

var createElement = _core.createElement;

var PathProxy = require("../graphic/PathProxy");

var BoundingRect = require("../graphic/transform/BoundingRect");

var matrix = require("../core/utils/matrix");

var textContain = require("../core/contain/text");

var textUtil = require("../graphic/utils/text_util");

var Text = require("../graphic/Text");

var _constants = require("../graphic/constants");

var PI = _constants.PI;
var PI2 = _constants.PI2;
var mathRound = _constants.mathRound;
var mathAbs = _constants.mathAbs;
var mathCos = _constants.mathCos;
var mathSin = _constants.mathSin;
// TODO
// 1. shadow
// 2. Image: sx, sy, sw, sh
var CMD = PathProxy.CMD;
var NONE = 'none';
var degree = 180 / PI;
var EPSILON = 1e-4;

function round4(val) {
  return mathRound(val * 1e4) / 1e4;
}

function isAroundZero(val) {
  return val < EPSILON && val > -EPSILON;
}

function pathHasFill(style, isText) {
  var fill = isText ? style.textFill : style.fill;
  return fill != null && fill !== NONE;
}

function pathHasStroke(style, isText) {
  var stroke = isText ? style.textStroke : style.stroke;
  return stroke != null && stroke !== NONE;
}

function setTransform(svgEl, m) {
  if (m) {
    attr(svgEl, 'transform', 'matrix(' + Array.prototype.join.call(m, ',') + ')');
  }
}

function attr(el, key, val) {
  if (!val || val.type !== 'linear' && val.type !== 'radial') {
    // Don't set attribute for gradient, since it need new dom nodes
    el.setAttribute(key, val);
  }
}

function attrXLink(el, key, val) {
  el.setAttributeNS('http://www.w3.org/1999/xlink', key, val);
}

function bindStyle(svgEl, style, isText, el) {
  if (pathHasFill(style, isText)) {
    var fill = isText ? style.textFill : style.fill;
    fill = fill === 'transparent' ? NONE : fill;
    attr(svgEl, 'fill', fill);
    attr(svgEl, 'fill-opacity', style.fillOpacity != null ? style.fillOpacity * style.opacity : style.opacity);
  } else {
    attr(svgEl, 'fill', NONE);
  }

  if (pathHasStroke(style, isText)) {
    var stroke = isText ? style.textStroke : style.stroke;
    stroke = stroke === 'transparent' ? NONE : stroke;
    attr(svgEl, 'stroke', stroke);
    var strokeWidth = isText ? style.textStrokeWidth : style.lineWidth;
    var strokeScale = !isText && style.strokeNoScale ? el.getLineScale() : 1;
    attr(svgEl, 'stroke-width', strokeWidth / strokeScale); // stroke then fill for text; fill then stroke for others

    attr(svgEl, 'paint-order', isText ? 'stroke' : 'fill');
    attr(svgEl, 'stroke-opacity', style.strokeOpacity != null ? style.strokeOpacity : style.opacity);
    var lineDash = style.lineDash;

    if (lineDash) {
      attr(svgEl, 'stroke-dasharray', style.lineDash.join(','));
      attr(svgEl, 'stroke-dashoffset', mathRound(style.lineDashOffset || 0));
    } else {
      attr(svgEl, 'stroke-dasharray', '');
    } // PENDING


    style.lineCap && attr(svgEl, 'stroke-linecap', style.lineCap);
    style.lineJoin && attr(svgEl, 'stroke-linejoin', style.lineJoin);
    style.miterLimit && attr(svgEl, 'stroke-miterlimit', style.miterLimit);
  } else {
    attr(svgEl, 'stroke', NONE);
  }
}
/**
 * @class qrenderer.svg.SVGPath
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */


function pathDataToString(path) {
  var str = [];
  var data = path.data;
  var dataLength = path.len();

  for (var i = 0; i < dataLength;) {
    var cmd = data[i++];
    var cmdStr = '';
    var nData = 0;

    switch (cmd) {
      case CMD.M:
        cmdStr = 'M';
        nData = 2;
        break;

      case CMD.L:
        cmdStr = 'L';
        nData = 2;
        break;

      case CMD.Q:
        cmdStr = 'Q';
        nData = 4;
        break;

      case CMD.C:
        cmdStr = 'C';
        nData = 6;
        break;

      case CMD.A:
        var cx = data[i++];
        var cy = data[i++];
        var rx = data[i++];
        var ry = data[i++];
        var theta = data[i++];
        var dTheta = data[i++];
        var psi = data[i++];
        var clockwise = data[i++];
        var dThetaPositive = mathAbs(dTheta);
        var isCircle = isAroundZero(dThetaPositive - PI2) || (clockwise ? dTheta >= PI2 : -dTheta >= PI2); // Mapping to 0~2PI

        var unifiedTheta = dTheta > 0 ? dTheta % PI2 : dTheta % PI2 + PI2;
        var large = false;

        if (isCircle) {
          large = true;
        } else if (isAroundZero(dThetaPositive)) {
          large = false;
        } else {
          large = unifiedTheta >= PI === !!clockwise;
        }

        var x0 = round4(cx + rx * mathCos(theta));
        var y0 = round4(cy + ry * mathSin(theta)); // It will not draw if start point and end point are exactly the same
        // We need to shift the end point with a small value
        // FIXME A better way to draw circle ?

        if (isCircle) {
          if (clockwise) {
            dTheta = PI2 - 1e-4;
          } else {
            dTheta = -PI2 + 1e-4;
          }

          large = true;

          if (i === 9) {
            // Move to (x0, y0) only when CMD.A comes at the
            // first position of a shape.
            // For instance, when drawing a ring, CMD.A comes
            // after CMD.M, so it's unnecessary to move to
            // (x0, y0).
            str.push('M', x0, y0);
          }
        }

        var x = round4(cx + rx * mathCos(theta + dTheta));
        var y = round4(cy + ry * mathSin(theta + dTheta)); // FIXME Ellipse

        str.push('A', round4(rx), round4(ry), mathRound(psi * degree), +large, +clockwise, x, y);
        break;

      case CMD.Z:
        cmdStr = 'Z';
        break;

      case CMD.R:
        var x = round4(data[i++]);
        var y = round4(data[i++]);
        var w = round4(data[i++]);
        var h = round4(data[i++]);
        str.push('M', x, y, 'L', x + w, y, 'L', x + w, y + h, 'L', x, y + h, 'L', x, y);
        break;
    }

    cmdStr && str.push(cmdStr);

    for (var j = 0; j < nData; j++) {
      // PENDING With scale
      str.push(round4(data[i++]));
    }
  }

  return str.join(' ');
}
/**
 * @class qrenderer.svg.SVGPath
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */


var svgPath = {};

svgPath.brush = function (el) {
  var style = el.style;
  var svgEl = el.__svgEl;

  if (!svgEl) {
    svgEl = createElement('path');
    el.__svgEl = svgEl;
  }

  if (!el.path) {
    el.createPathProxy();
  }

  var path = el.path;

  if (el.__dirtyPath) {
    path.beginPath();
    path.subPixelOptimize = false;
    el.buildPath(path, el.shape);
    el.__dirtyPath = false;
    var pathStr = pathDataToString(path);

    if (pathStr.indexOf('NaN') < 0) {
      // Ignore illegal path, which may happen such in out-of-range
      // data in Calendar series.
      attr(svgEl, 'd', pathStr);
    }
  }

  bindStyle(svgEl, style, false, el);
  setTransform(svgEl, el.transform);

  if (style.text != null) {
    svgTextDrawRectText(el, el.getBoundingRect());
  } else {
    removeOldTextNode(el);
  }
};
/**
 * @class qrenderer.svg.SVGImage
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */


var svgImage = {};

svgImage.brush = function (el) {
  var style = el.style;
  var image = style.image;

  if (image instanceof HTMLImageElement) {
    var src = image.src;
    image = src;
  }

  if (!image) {
    return;
  }

  var x = style.x || 0;
  var y = style.y || 0;
  var dw = style.width;
  var dh = style.height;
  var svgEl = el.__svgEl;

  if (!svgEl) {
    svgEl = createElement('image');
    el.__svgEl = svgEl;
  }

  if (image !== el.__imageSrc) {
    attrXLink(svgEl, 'href', image); // Caching image src

    el.__imageSrc = image;
  }

  attr(svgEl, 'width', dw);
  attr(svgEl, 'height', dh);
  attr(svgEl, 'x', x);
  attr(svgEl, 'y', y);
  setTransform(svgEl, el.transform);

  if (style.text != null) {
    svgTextDrawRectText(el, el.getBoundingRect());
  } else {
    removeOldTextNode(el);
  }
};
/**
 * @class qrenderer.svg.SVGText
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */


var svgText = {};

var _tmpTextHostRect = new BoundingRect();

var _tmpTextBoxPos = {};
var _tmpTextTransform = [];
var TEXT_ALIGN_TO_ANCHRO = {
  left: 'start',
  right: 'end',
  center: 'middle',
  middle: 'middle'
};
/**
 * @param {Element} el
 * @param {Object|boolean} [hostRect] {x, y, width, height}
 *        If set false, rect text is not used.
 */

var svgTextDrawRectText = function svgTextDrawRectText(el, hostRect) {
  var style = el.style;
  var elTransform = el.transform;
  var needTransformTextByHostEl = el instanceof Text || style.transformText;
  el.__dirty && textUtil.normalizeTextStyle(style, true);
  var text = style.text; // Convert to string

  text != null && (text += '');

  if (!textUtil.needDrawText(text, style)) {
    return;
  } // render empty text for svg if no text but need draw text.


  text == null && (text = ''); // Follow the setting in the canvas renderer, if not transform the
  // text, transform the hostRect, by which the text is located.

  if (!needTransformTextByHostEl && elTransform) {
    _tmpTextHostRect.copy(hostRect);

    _tmpTextHostRect.applyTransform(elTransform);

    hostRect = _tmpTextHostRect;
  }

  var textSvgEl = el.__textSvgEl;

  if (!textSvgEl) {
    textSvgEl = createElement('text');
    el.__textSvgEl = textSvgEl;
  } // style.font has been normalized by `normalizeTextStyle`.


  var textSvgElStyle = textSvgEl.style;
  var font = style.font || textContain.DEFAULT_FONT;
  var computedFont = textSvgEl.__computedFont;

  if (font !== textSvgEl.__styleFont) {
    textSvgElStyle.font = textSvgEl.__styleFont = font; // The computedFont might not be the orginal font if it is illegal font.

    computedFont = textSvgEl.__computedFont = textSvgElStyle.font;
  }

  var textPadding = style.textPadding;
  var textLineHeight = style.textLineHeight;
  var contentBlock = el.__textCotentBlock;

  if (!contentBlock || el.__dirtyText) {
    contentBlock = el.__textCotentBlock = textContain.parsePlainText(text, computedFont, textPadding, textLineHeight, style.truncate);
  }

  var outerHeight = contentBlock.outerHeight;
  var lineHeight = contentBlock.lineHeight;
  textUtil.getBoxPosition(_tmpTextBoxPos, el, style, hostRect);
  var baseX = _tmpTextBoxPos.baseX;
  var baseY = _tmpTextBoxPos.baseY;
  var textAlign = _tmpTextBoxPos.textAlign || 'left';
  var textVerticalAlign = _tmpTextBoxPos.textVerticalAlign;
  setTextTransform(textSvgEl, needTransformTextByHostEl, elTransform, style, hostRect, baseX, baseY);
  var boxY = textContain.adjustTextY(baseY, outerHeight, textVerticalAlign);
  var textX = baseX;
  var textY = boxY; // TODO needDrawBg

  if (textPadding) {
    textX = getTextXForPadding(baseX, textAlign, textPadding);
    textY += textPadding[0];
  } // `textBaseline` is set as 'middle'.


  textY += lineHeight / 2;
  bindStyle(textSvgEl, style, true, el); // FIXME
  // Add a <style> to reset all of the text font as inherit?
  // otherwise the outer <style> may set the unexpected style.
  // Font may affect position of each tspan elements

  var canCacheByTextString = contentBlock.canCacheByTextString;
  var tspanList = el.__tspanList || (el.__tspanList = []);
  var tspanOriginLen = tspanList.length; // Optimize for most cases, just compare text string to determine change.

  if (canCacheByTextString && el.__canCacheByTextString && el.__text === text) {
    if (el.__dirtyText && tspanOriginLen) {
      for (var idx = 0; idx < tspanOriginLen; ++idx) {
        updateTextLocation(tspanList[idx], textAlign, textX, textY + idx * lineHeight);
      }
    }
  } else {
    el.__text = text;
    el.__canCacheByTextString = canCacheByTextString;
    var textLines = contentBlock.lines;
    var nTextLines = textLines.length;
    var _idx = 0;

    for (; _idx < nTextLines; _idx++) {
      // Using cached tspan elements
      var tspan = tspanList[_idx];
      var singleLineText = textLines[_idx];

      if (!tspan) {
        tspan = tspanList[_idx] = createElement('tspan');
        textSvgEl.appendChild(tspan);
        tspan.appendChild(document.createTextNode(singleLineText));
      } else if (tspan.__qrText !== singleLineText) {
        tspan.innerHTML = '';
        tspan.appendChild(document.createTextNode(singleLineText));
      }

      updateTextLocation(tspan, textAlign, textX, textY + _idx * lineHeight);
    } // Remove unused tspan elements


    if (tspanOriginLen > nTextLines) {
      for (; _idx < tspanOriginLen; _idx++) {
        textSvgEl.removeChild(tspanList[_idx]);
      }

      tspanList.length = nTextLines;
    }
  }
};

function setTextTransform(textSvgEl, needTransformTextByHostEl, elTransform, style, hostRect, baseX, baseY) {
  matrix.identity(_tmpTextTransform);

  if (needTransformTextByHostEl && elTransform) {
    matrix.copy(_tmpTextTransform, elTransform);
  } // textRotation only apply in RectText.


  var textRotation = style.textRotation;

  if (hostRect && textRotation) {
    var origin = style.textOrigin;

    if (origin === 'center') {
      baseX = hostRect.width / 2 + hostRect.x;
      baseY = hostRect.height / 2 + hostRect.y;
    } else if (origin) {
      baseX = origin[0] + hostRect.x;
      baseY = origin[1] + hostRect.y;
    }

    _tmpTextTransform[4] -= baseX;
    _tmpTextTransform[5] -= baseY; // Positive: anticlockwise

    matrix.rotate(_tmpTextTransform, _tmpTextTransform, textRotation);
    _tmpTextTransform[4] += baseX;
    _tmpTextTransform[5] += baseY;
  } // See the definition in `Style.js#textOrigin`, the default
  // origin is from the result of `getBoxPosition`.


  setTransform(textSvgEl, _tmpTextTransform);
} // FIXME merge the same code with `helper/text.js#getTextXForPadding`;


function getTextXForPadding(x, textAlign, textPadding) {
  return textAlign === 'right' ? x - textPadding[1] : textAlign === 'center' ? x + textPadding[3] / 2 - textPadding[1] / 2 : x + textPadding[3];
}

function updateTextLocation(tspan, textAlign, x, y) {
  // Consider different font display differently in vertial align, we always
  // set vertialAlign as 'middle', and use 'y' to locate text vertically.
  attr(tspan, 'dominant-baseline', 'middle');
  attr(tspan, 'text-anchor', TEXT_ALIGN_TO_ANCHRO[textAlign]);
  attr(tspan, 'x', x);
  attr(tspan, 'y', y);
}

function removeOldTextNode(el) {
  if (el && el.__textSvgEl) {
    el.__textSvgEl.parentNode.removeChild(el.__textSvgEl);

    el.__textSvgEl = null;
    el.__tspanList = [];
    el.__text = null;
  }
}

svgText.drawRectText = svgTextDrawRectText;

svgText.brush = function (el) {
  var style = el.style;

  if (style.text != null) {
    svgTextDrawRectText(el, false);
  } else {
    removeOldTextNode(el);
  }
};

exports.path = svgPath;
exports.image = svgImage;
exports.text = svgText;
}, function(modId) { var map = {"./core":1582161598686,"../graphic/PathProxy":1582161598645,"../graphic/transform/BoundingRect":1582161598623,"../core/utils/matrix":1582161598615,"../core/contain/text":1582161598637,"../graphic/utils/text_util":1582161598636,"../graphic/Text":1582161598657,"../graphic/constants":1582161598603}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598686, function(require, module, exports) {
var svgURI = 'http://www.w3.org/2000/svg';

function createElement(name) {
  return document.createElementNS(svgURI, name);
}

exports.createElement = createElement;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598687, function(require, module, exports) {
var _core = require("./core");

var createElement = _core.createElement;

var dataUtil = require("../core/utils/data_structure_util");

var Path = require("../graphic/Path");

var QImage = require("../graphic/Image");

var QText = require("../graphic/Text");

var arrayDiff = require("../core/utils/array_diff2");

var GradientManager = require("./helper/GradientManager");

var ClippathManager = require("./helper/ClippathManager");

var ShadowManager = require("./helper/ShadowManager");

var _graphic = require("./graphic");

var svgPath = _graphic.path;
var svgImage = _graphic.image;
var svgText = _graphic.text;

/**
 * @class qrenderer.svg.SVGPainter
 * 
 * SVG 画笔。
 * 
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */

/**
 * @private
 * @method getSvgProxy
 * 
 * QImage 映射成 svgImage，ZText 映射成 svgText，其它所有都映射成 svgPath。
 * 
 * @param {Element} el 
 */
function getSvgProxy(el) {
  if (el instanceof Path) {
    return svgPath;
  } else if (el instanceof QImage) {
    return svgImage;
  } else if (el instanceof QText) {
    return svgText;
  }

  return svgPath;
}

function checkParentAvailable(parent, child) {
  return child && parent && child.parentNode !== parent;
}

function insertAfter(parent, child, prevSibling) {
  if (checkParentAvailable(parent, child) && prevSibling) {
    var nextSibling = prevSibling.nextSibling;
    nextSibling ? parent.insertBefore(child, nextSibling) : parent.appendChild(child);
  }
}

function prepend(parent, child) {
  if (checkParentAvailable(parent, child)) {
    var firstChild = parent.firstChild;
    firstChild ? parent.insertBefore(child, firstChild) : parent.appendChild(child);
  }
}

function remove(parent, child) {
  if (child && parent && child.parentNode === parent) {
    parent.removeChild(child);
  }
}

function getTextSvgElement(displayable) {
  return displayable.__textSvgEl;
}

function getSvgElement(displayable) {
  return displayable.__svgEl;
}
/**
 * @method constructor SVGPainter
 * @param {HTMLElement} host
 * @param {Storage} storage
 * @param {Object} opts
 */


var SVGPainter = function SVGPainter(host, storage, opts, qrId) {
  this.host = host;
  this.storage = storage;
  this._opts = opts = dataUtil.extend({}, opts || {});
  var svgRoot = createElement('svg');
  svgRoot.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgRoot.setAttribute('version', '1.1');
  svgRoot.setAttribute('baseProfile', 'full');
  svgRoot.style.cssText = 'user-select:none;position:absolute;left:0;top:0;';
  this.gradientManager = new GradientManager(qrId, svgRoot);
  this.clipPathManager = new ClippathManager(qrId, svgRoot);
  this.shadowManager = new ShadowManager(qrId, svgRoot);
  var viewport = document.createElement('div');
  viewport.style.cssText = 'overflow:hidden;position:relative';
  this._svgRoot = svgRoot;
  this._viewport = viewport;
  host.appendChild(viewport);
  viewport.appendChild(svgRoot);
  this.resize(opts.width, opts.height);
  this._visibleList = [];
};

SVGPainter.prototype = {
  constructor: SVGPainter,

  /**
   * @method getType
   */
  getType: function getType() {
    return 'svg';
  },

  /**
   * @method getHost
   */
  getHost: function getHost() {
    return this._viewport;
  },

  /**
   * @method getViewportRootOffset
   */
  getViewportRootOffset: function getViewportRootOffset() {
    var viewportRoot = this.getViewportRoot();

    if (viewportRoot) {
      return {
        offsetLeft: viewportRoot.offsetLeft || 0,
        offsetTop: viewportRoot.offsetTop || 0
      };
    }
  },

  /**
   * @method refresh
   */
  refresh: function refresh() {
    var list = this.storage.getDisplayList(true);

    this._paintList(list);
  },

  /**
   * @method setBackgroundColor
   */
  setBackgroundColor: function setBackgroundColor(backgroundColor) {
    // TODO gradient
    this._viewport.style.background = backgroundColor;
  },

  /**
   * @private
   * @method _paintList
   */
  _paintList: function _paintList(list) {
    this.gradientManager.markAllUnused();
    this.clipPathManager.markAllUnused();
    this.shadowManager.markAllUnused();
    var svgRoot = this._svgRoot;
    var visibleList = this._visibleList;
    var listLen = list.length;
    var newVisibleList = [];
    var i;
    var svgElement;
    var textSvgElement;

    for (i = 0; i < listLen; i++) {
      var displayable = list[i];
      var svgProxy = getSvgProxy(displayable);
      svgElement = getSvgElement(displayable) || getTextSvgElement(displayable);

      if (!displayable.invisible) {
        if (displayable.__dirty) {
          svgProxy && svgProxy.brush(displayable); // Update clipPath

          this.clipPathManager.update(displayable); // Update gradient and shadow

          if (displayable.style.fill && displayable.style.stroke) {
            this.gradientManager.update(displayable.style.fill);
            this.gradientManager.update(displayable.style.stroke);
          }

          this.shadowManager.update(svgElement, displayable);
          displayable.__dirty = false;
        }

        newVisibleList.push(displayable);
      }
    }

    var diff = arrayDiff(visibleList, newVisibleList);
    var prevSvgElement; // First do remove, in case element moved to the head and do remove
    // after add

    for (i = 0; i < diff.length; i++) {
      var item = diff[i];

      if (item.removed) {
        for (var k = 0; k < item.count; k++) {
          var _displayable = visibleList[item.indices[k]];
          svgElement = getSvgElement(_displayable);
          textSvgElement = getTextSvgElement(_displayable);
          remove(svgRoot, svgElement);
          remove(svgRoot, textSvgElement);
        }
      }
    }

    for (i = 0; i < diff.length; i++) {
      var _item = diff[i];

      if (_item.added) {
        for (var _k = 0; _k < _item.count; _k++) {
          var _displayable2 = newVisibleList[_item.indices[_k]];
          svgElement = getSvgElement(_displayable2);
          textSvgElement = getTextSvgElement(_displayable2);
          prevSvgElement ? insertAfter(svgRoot, svgElement, prevSvgElement) : prepend(svgRoot, svgElement);

          if (svgElement) {
            insertAfter(svgRoot, textSvgElement, svgElement);
          } else if (prevSvgElement) {
            insertAfter(svgRoot, textSvgElement, prevSvgElement);
          } else {
            prepend(svgRoot, textSvgElement);
          } // Insert text


          insertAfter(svgRoot, textSvgElement, svgElement);
          prevSvgElement = textSvgElement || svgElement || prevSvgElement; // qrenderer.Text only create textSvgElement.

          this.gradientManager.addWithoutUpdate(svgElement || textSvgElement, _displayable2);
          this.shadowManager.addWithoutUpdate(svgElement || textSvgElement, _displayable2);
          this.clipPathManager.markUsed(_displayable2);
        }
      } else if (!_item.removed) {
        for (var _k2 = 0; _k2 < _item.count; _k2++) {
          var _displayable3 = newVisibleList[_item.indices[_k2]];
          svgElement = getSvgElement(_displayable3);
          textSvgElement = getTextSvgElement(_displayable3);
          svgElement = getSvgElement(_displayable3);
          textSvgElement = getTextSvgElement(_displayable3);
          this.gradientManager.markUsed(_displayable3);
          this.gradientManager.addWithoutUpdate(svgElement || textSvgElement, _displayable3);
          this.shadowManager.markUsed(_displayable3);
          this.shadowManager.addWithoutUpdate(svgElement || textSvgElement, _displayable3);
          this.clipPathManager.markUsed(_displayable3);

          if (textSvgElement) {
            // Insert text.
            insertAfter(svgRoot, textSvgElement, svgElement);
          }

          prevSvgElement = svgElement || textSvgElement || prevSvgElement;
        }
      }
    }

    this.gradientManager.removeUnused();
    this.clipPathManager.removeUnused();
    this.shadowManager.removeUnused();
    this._visibleList = newVisibleList;
  },

  /**
   * @private
   * @method _paintList
   */
  _getDefs: function _getDefs(isForceCreating) {
    var svgRoot = this._svgRoot;

    var defs = this._svgRoot.getElementsByTagName('defs');

    if (defs.length !== 0) {
      return defs[0];
    } // Not exist


    if (!isForceCreating) {
      return null;
    }

    defs = svgRoot.insertBefore(createElement('defs'), // Create new tag
    svgRoot.firstChild // Insert in the front of svg
    );

    if (!defs.contains) {
      // IE doesn't support contains method
      defs.contains = function (el) {
        var children = defs.children;

        if (!children) {
          return false;
        }

        for (var i = children.length - 1; i >= 0; --i) {
          if (children[i] === el) {
            return true;
          }
        }

        return false;
      };
    }

    return defs;
  },

  /**
   * @method resize
   */
  resize: function resize(width, height) {
    var viewport = this._viewport; // FIXME Why ?

    viewport.style.display = 'none'; // Save input w/h

    var opts = this._opts;
    width != null && (opts.width = width);
    height != null && (opts.height = height);
    width = this._getSize(0);
    height = this._getSize(1);
    viewport.style.display = '';

    if (this._width !== width || this._height !== height) {
      this._width = width;
      this._height = height;
      var viewportStyle = viewport.style;
      viewportStyle.width = width + 'px';
      viewportStyle.height = height + 'px';
      var svgRoot = this._svgRoot; // Set width by 'svgRoot.width = width' is invalid

      svgRoot.setAttribute('width', width);
      svgRoot.setAttribute('height', height);
    }
  },

  /**
   * @method getWidth
   * 获取绘图区域宽度
   */
  getWidth: function getWidth() {
    return this._width;
  },

  /**
   * @method getHeight
   * 获取绘图区域高度
   */
  getHeight: function getHeight() {
    return this._height;
  },

  /**
   * @private
   * @method _getSize
   */
  _getSize: function _getSize(whIdx) {
    var opts = this._opts;
    var wh = ['width', 'height'][whIdx];
    var cwh = ['clientWidth', 'clientHeight'][whIdx];
    var plt = ['paddingLeft', 'paddingTop'][whIdx];
    var prb = ['paddingRight', 'paddingBottom'][whIdx];

    if (opts[wh] != null && opts[wh] !== 'auto') {
      return parseFloat(opts[wh]);
    }

    var host = this.host; // IE8 does not support getComputedStyle, but it use VML.

    var stl = document.defaultView.getComputedStyle(host);
    return (host[cwh] || dataUtil.parseInt10(stl[wh]) || dataUtil.parseInt10(host.style[wh])) - (dataUtil.parseInt10(stl[plt]) || 0) - (dataUtil.parseInt10(stl[prb]) || 0) | 0;
  },

  /**
   * @method dispose
   */
  dispose: function dispose() {
    this.host.innerHTML = '';
    this._svgRoot = this._viewport = this.storage = null;
  },

  /**
   * @method clear
   */
  clear: function clear() {
    if (this._viewport) {
      this.host.removeChild(this._viewport);
    }
  },

  /**
   * @method pathToDataUrl
   */
  pathToDataUrl: function pathToDataUrl() {
    this.refresh();
    var html = this._svgRoot.outerHTML;
    return 'data:image/svg+xml;charset=UTF-8,' + html;
  }
}; // Not supported methods

function createMethodNotSupport(method) {
  return function () {
    console.log('In SVG mode painter not support method "' + method + '"');
  };
} // Unsuppoted methods


['getLayer', 'insertLayer', 'eachLayer', 'eachBuiltinLayer', 'eachOtherLayer', 'getLayers', 'modLayer', 'delLayer', 'clearLayer', 'toDataURL', 'pathToImage'].forEach(function (name, index) {
  SVGPainter.prototype[name] = createMethodNotSupport(name);
});
var _default = SVGPainter;
module.exports = _default;
}, function(modId) { var map = {"./core":1582161598686,"../core/utils/data_structure_util":1582161598602,"../graphic/Path":1582161598644,"../graphic/Image":1582161598633,"../graphic/Text":1582161598657,"../core/utils/array_diff2":1582161598688,"./helper/GradientManager":1582161598689,"./helper/ClippathManager":1582161598691,"./helper/ShadowManager":1582161598692,"./graphic":1582161598685}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598688, function(require, module, exports) {
// Myers' Diff Algorithm
// Modified from https://github.com/kpdecker/jsdiff/blob/master/src/diff/base.js
function Diff() {}

Diff.prototype = {
  diff: function diff(oldArr, newArr, equals) {
    if (!equals) {
      equals = function equals(a, b) {
        return a === b;
      };
    }

    this.equals = equals;
    var self = this;
    oldArr = oldArr.slice();
    newArr = newArr.slice(); // Allow subclasses to massage the input prior to running

    var newLen = newArr.length;
    var oldLen = oldArr.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    var bestPath = [{
      newPos: -1,
      components: []
    }]; // Seed editLength = 0, i.e. the content starts with the same values

    var oldPos = this.extractCommon(bestPath[0], newArr, oldArr, 0);

    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      var indices = [];

      for (var i = 0; i < newArr.length; i++) {
        indices.push(i);
      } // Identity per the equality and tokenizer


      return [{
        indices: indices,
        count: newArr.length
      }];
    } // Main worker method. checks all permutations of a given edit length for acceptance.


    function execEditLength() {
      for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        var basePath;
        var addPath = bestPath[diagonalPath - 1];
        var removePath = bestPath[diagonalPath + 1];
        var oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;

        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        var canAdd = addPath && addPath.newPos + 1 < newLen;
        var canRemove = removePath && 0 <= oldPos && oldPos < oldLen;

        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          bestPath[diagonalPath] = undefined;
          continue;
        } // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph


        if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
          basePath = clonePath(removePath);
          self.pushComponent(basePath.components, undefined, true);
        } else {
          basePath = addPath; // No need to clone, we've pulled it from the list

          basePath.newPos++;
          self.pushComponent(basePath.components, true, undefined);
        }

        oldPos = self.extractCommon(basePath, newArr, oldArr, diagonalPath); // If we have hit the end of both strings, then we are done

        if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
          return buildValues(self, basePath.components, newArr, oldArr);
        } else {
          // Otherwise track this path as a potential candidate and continue.
          bestPath[diagonalPath] = basePath;
        }
      }

      editLength++;
    }

    while (editLength <= maxEditLength) {
      var ret = execEditLength();

      if (ret) {
        return ret;
      }
    }
  },
  pushComponent: function pushComponent(components, added, removed) {
    var last = components[components.length - 1];

    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length - 1] = {
        count: last.count + 1,
        added: added,
        removed: removed
      };
    } else {
      components.push({
        count: 1,
        added: added,
        removed: removed
      });
    }
  },
  extractCommon: function extractCommon(basePath, newArr, oldArr, diagonalPath) {
    var newLen = newArr.length;
    var oldLen = oldArr.length;
    var newPos = basePath.newPos;
    var oldPos = newPos - diagonalPath;
    var commonCount = 0;

    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newArr[newPos + 1], oldArr[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }

    if (commonCount) {
      basePath.components.push({
        count: commonCount
      });
    }

    basePath.newPos = newPos;
    return oldPos;
  },
  tokenize: function tokenize(value) {
    return value.slice();
  },
  join: function join(value) {
    return value.slice();
  }
};

function buildValues(diff, components, newArr, oldArr) {
  var componentPos = 0;
  var componentLen = components.length;
  var newPos = 0;
  var oldPos = 0;

  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];

    if (!component.removed) {
      var indices = [];

      for (var i = newPos; i < newPos + component.count; i++) {
        indices.push(i);
      }

      component.indices = indices;
      newPos += component.count; // Common case

      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      var indices = [];

      for (var i = oldPos; i < oldPos + component.count; i++) {
        indices.push(i);
      }

      component.indices = indices;
      oldPos += component.count;
    }
  }

  return components;
}

function clonePath(path) {
  return {
    newPos: path.newPos,
    components: path.components.slice(0)
  };
}

var arrayDiff = new Diff();

function _default(oldArr, newArr, callback) {
  return arrayDiff.diff(oldArr, newArr, callback);
}

module.exports = _default;
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598689, function(require, module, exports) {
var Definable = require("./Definable");

var dataUtil = require("../../core/utils/data_structure_util");

var classUtil = require("../../core/utils/class_util");

var colorTool = require("../../core/utils/color_util");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.svg.helper.GradientManager
 * 
 * Manages SVG gradient elements.
 * 
 * @author Zhang Wenli
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */
var GradientManager =
/*#__PURE__*/
function (_Definable) {
  _inherits(GradientManager, _Definable);

  /**
   * @method constructor GradientManager
   * Manages SVG gradient elements.
   *
   * @param   {Number}     qrId    qrenderer instance id
   * @param   {SVGElement} svgRoot root of SVG document
   */
  function GradientManager(qrId, svgRoot) {
    _classCallCheck(this, GradientManager);

    return _possibleConstructorReturn(this, _getPrototypeOf(GradientManager).call(this, qrId, svgRoot, ['linearGradient', 'radialGradient'], '__gradient_in_use__'));
  }
  /**
   * @method addWithoutUpdate
   * Create new gradient DOM for fill or stroke if not exist,
   * but will not update gradient if exists.
   *
   * @param {SvgElement}  svgElement   SVG element to paint
   * @param {Displayable} displayable  qrenderer displayable element
   */


  _createClass(GradientManager, [{
    key: "addWithoutUpdate",
    value: function addWithoutUpdate(svgElement, displayable) {
      if (displayable && displayable.style) {
        var that = this;
        dataUtil.each(['fill', 'stroke'], function (fillOrStroke) {
          if (displayable.style[fillOrStroke] && (displayable.style[fillOrStroke].type === 'linear' || displayable.style[fillOrStroke].type === 'radial')) {
            var gradient = displayable.style[fillOrStroke];
            var defs = that.getDefs(true); // Create dom in <defs> if not exists

            var dom;

            if (gradient._dom) {
              // Gradient exists
              dom = gradient._dom;

              if (!defs.contains(gradient._dom)) {
                // _dom is no longer in defs, recreate
                that.addDom(dom);
              }
            } else {
              // New dom
              dom = that.add(gradient);
            }

            that.markUsed(displayable);
            var id = dom.getAttribute('id');
            svgElement.setAttribute(fillOrStroke, 'url(#' + id + ')');
          }
        });
      }
    }
    /**
     * @method add
     * 
     * Add a new gradient tag in <defs>
     *
     * @param   {Gradient} gradient qr gradient instance
     * @return {SVGLinearGradientElement | SVGRadialGradientElement} created DOM
     */

  }, {
    key: "add",
    value: function add(gradient) {
      var dom;

      if (gradient.type === 'linear') {
        dom = this.createElement('linearGradient');
      } else if (gradient.type === 'radial') {
        dom = this.createElement('radialGradient');
      } else {
        console.log('Illegal gradient type.');
        return null;
      } // Set dom id with gradient id, since each gradient instance
      // will have no more than one dom element.
      // id may exists before for those dirty elements, in which case
      // id should remain the same, and other attributes should be
      // updated.


      gradient.id = gradient.id || this.nextId++;
      dom.setAttribute('id', "qr".concat(this._qrId, "-gradient-").concat(gradient.id));
      this.updateDom(gradient, dom);
      this.addDom(dom);
      return dom;
    }
    /**
     * @method update
     * 
     * Update gradient.
     *
     * @param {Gradient} gradient qr gradient instance
     */

  }, {
    key: "update",
    value: function update(gradient) {
      var that = this;
      Definable.prototype.update.call(this, gradient, function () {
        var type = gradient.type;
        var tagName = gradient._dom.tagName;

        if (type === 'linear' && tagName === 'linearGradient' || type === 'radial' && tagName === 'radialGradient') {
          // Gradient type is not changed, update gradient
          that.updateDom(gradient, gradient._dom);
        } else {
          // Remove and re-create if type is changed
          that.removeDom(gradient);
          that.add(gradient);
        }
      });
    }
    /**
     * @method updateDom
     * 
     * Update gradient dom
     *
     * @param {Gradient} gradient qr gradient instance
     * @param {SVGLinearGradientElement | SVGRadialGradientElement} dom
     *                            DOM to update
     */

  }, {
    key: "updateDom",
    value: function updateDom(gradient, dom) {
      if (gradient.type === 'linear') {
        dom.setAttribute('x1', gradient.x);
        dom.setAttribute('y1', gradient.y);
        dom.setAttribute('x2', gradient.x2);
        dom.setAttribute('y2', gradient.y2);
      } else if (gradient.type === 'radial') {
        dom.setAttribute('cx', gradient.x);
        dom.setAttribute('cy', gradient.y);
        dom.setAttribute('r', gradient.r);
      } else {
        console.log('Illegal gradient type.');
        return;
      }

      if (gradient.global) {
        // x1, x2, y1, y2 in range of 0 to canvas width or height
        dom.setAttribute('gradientUnits', 'userSpaceOnUse');
      } else {
        // x1, x2, y1, y2 in range of 0 to 1
        dom.setAttribute('gradientUnits', 'objectBoundingBox');
      } // Remove color stops if exists


      dom.innerHTML = ''; // Add color stops

      var colors = gradient.colorStops;

      for (var i = 0, len = colors.length; i < len; ++i) {
        var stop = this.createElement('stop');
        stop.setAttribute('offset', colors[i].offset * 100 + '%');
        var color = colors[i].color;

        if (color.indexOf('rgba' > -1)) {
          // Fix Safari bug that stop-color not recognizing alpha #9014
          var opacity = colorTool.parse(color)[3];
          var hex = colorTool.toHex(color); // stop-color cannot be color, since:
          // The opacity value used for the gradient calculation is the
          // *product* of the value of stop-opacity and the opacity of the
          // value of stop-color.
          // See https://www.w3.org/TR/SVG2/pservers.html#StopOpacityProperty

          stop.setAttribute('stop-color', '#' + hex);
          stop.setAttribute('stop-opacity', opacity);
        } else {
          stop.setAttribute('stop-color', colors[i].color);
        }

        dom.appendChild(stop);
      } // Store dom element in gradient, to avoid creating multiple
      // dom instances for the same gradient element


      gradient._dom = dom;
    }
    /**
     * @method markUsed
     * 
     * Mark a single gradient to be used
     *
     * @param {Displayable} displayable displayable element
     */

  }, {
    key: "markUsed",
    value: function markUsed(displayable) {
      if (displayable.style) {
        var gradient = displayable.style.fill;

        if (gradient && gradient._dom) {
          Definable.prototype.markUsed.call(this, gradient._dom);
        }

        gradient = displayable.style.stroke;

        if (gradient && gradient._dom) {
          Definable.prototype.markUsed.call(this, gradient._dom);
        }
      }
    }
  }]);

  return GradientManager;
}(Definable);

var _default = GradientManager;
module.exports = _default;
}, function(modId) { var map = {"./Definable":1582161598690,"../../core/utils/data_structure_util":1582161598602,"../../core/utils/class_util":1582161598604,"../../core/utils/color_util":1582161598621}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598690, function(require, module, exports) {
var _core = require("../core");

var createElement = _core.createElement;

var dataUtil = require("../../core/utils/data_structure_util");

var Path = require("../../graphic/Path");

var QImage = require("../../graphic/Image");

var QText = require("../../graphic/Text");

var _graphic = require("../graphic");

var svgPath = _graphic.path;
var svgImage = _graphic.image;
var svgText = _graphic.text;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @class qrenderer.svg.helper.Definable
 * 
 * Manages elements that can be defined in <defs> in SVG,
 *       e.g., gradients, clip path, etc.
 * @author Zhang Wenli
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */
var MARK_UNUSED = '0';
var MARK_USED = '1';

var Definable =
/*#__PURE__*/
function () {
  /**
   * @method constructor Definable
   * 
   * Manages elements that can be defined in <defs> in SVG,
   * e.g., gradients, clip path, etc.
   *
   * @param {Number}          qrId      qrenderer instance id
   * @param {SVGElement}      svgRoot   root of SVG document
   * @param {String|String[]} tagNames  possible tag names
   * @param {String}          markLabel label name to make if the element
   *                                    is used
   */
  function Definable(qrId, svgRoot, tagNames, markLabel, domName) {
    _classCallCheck(this, Definable);

    this._qrId = qrId;
    this._svgRoot = svgRoot;
    this._tagNames = typeof tagNames === 'string' ? [tagNames] : tagNames;
    this._markLabel = markLabel;
    this._domName = domName || '_dom';
    this.nextId = 0;
    this.createElement = createElement;
  }
  /**
   * @method getDefs
   * 
   * Get the <defs> tag for svgRoot; optionally creates one if not exists.
   *
   * @param {Boolean} isForceCreating if need to create when not exists
   * @return {SVGDefsElement} SVG <defs> element, null if it doesn't exist and isForceCreating is false
   */


  _createClass(Definable, [{
    key: "getDefs",
    value: function getDefs(isForceCreating) {
      var svgRoot = this._svgRoot;

      var defs = this._svgRoot.getElementsByTagName('defs');

      if (defs.length === 0) {
        // Not exist
        if (isForceCreating) {
          defs = svgRoot.insertBefore(this.createElement('defs'), // Create new tag
          svgRoot.firstChild // Insert in the front of svg
          );

          if (!defs.contains) {
            // IE doesn't support contains method
            defs.contains = function (el) {
              var children = defs.children;

              if (!children) {
                return false;
              }

              for (var i = children.length - 1; i >= 0; --i) {
                if (children[i] === el) {
                  return true;
                }
              }

              return false;
            };
          }

          return defs;
        } else {
          return null;
        }
      } else {
        return defs[0];
      }
    }
    /**
     * @method update
     * 
     * Update DOM element if necessary.
     *
     * @param {Object|String} element style element. e.g., for gradient, it may be '#ccc' or {type: 'linear', ...}
     * @param {Function|undefined} onUpdate update callback
     */

  }, {
    key: "update",
    value: function update(element, onUpdate) {
      if (!element) {
        return;
      }

      var defs = this.getDefs(false);

      if (element[this._domName] && defs.contains(element[this._domName])) {
        // Update DOM
        if (typeof onUpdate === 'function') {
          onUpdate(element);
        }
      } else {
        // No previous dom, create new
        var dom = this.add(element);

        if (dom) {
          element[this._domName] = dom;
        }
      }
    }
    /**
     * @method addDom
     * 
     * Add gradient dom to defs
     *
     * @param {SVGElement} dom DOM to be added to <defs>
     */

  }, {
    key: "addDom",
    value: function addDom(dom) {
      var defs = this.getDefs(true);
      defs.appendChild(dom);
    }
    /**
     * @method removeDom
     * 
     * Remove DOM of a given element.
     *
     * @param {SVGElement} element element to remove dom
     */

  }, {
    key: "removeDom",
    value: function removeDom(element) {
      var defs = this.getDefs(false);

      if (defs && element[this._domName]) {
        defs.removeChild(element[this._domName]);
        element[this._domName] = null;
      }
    }
    /**
     * @method getDoms
     * 
     * Get DOMs of this element.
     *
     * @return {HTMLDomElement} doms of this defineable elements in <defs>
     */

  }, {
    key: "getDoms",
    value: function getDoms() {
      var defs = this.getDefs(false);

      if (!defs) {
        // No dom when defs is not defined
        return [];
      }

      var doms = [];
      dataUtil.each(this._tagNames, function (tagName) {
        var tags = defs.getElementsByTagName(tagName); // Note that tags is HTMLCollection, which is array-like
        // rather than real array.
        // So `doms.concat(tags)` add tags as one object.

        doms = doms.concat([].slice.call(tags));
      });
      return doms;
    }
    /**
     * @method markAllUnused
     * 
     * Mark DOMs to be unused before painting, and clear unused ones at the end
     * of the painting.
     */

  }, {
    key: "markAllUnused",
    value: function markAllUnused() {
      var doms = this.getDoms();
      var that = this;
      dataUtil.each(doms, function (dom) {
        dom[that._markLabel] = MARK_UNUSED;
      });
    }
    /**
     * @method markUsed
     * 
     * Mark a single DOM to be used.
     *
     * @param {SVGElement} dom DOM to mark
     */

  }, {
    key: "markUsed",
    value: function markUsed(dom) {
      if (dom) {
        dom[this._markLabel] = MARK_USED;
      }
    }
    /**
     * @method removeUnused
     * 
     * Remove unused DOMs defined in <defs>
     */

  }, {
    key: "removeUnused",
    value: function removeUnused() {
      var defs = this.getDefs(false);

      if (!defs) {
        // Nothing to remove
        return;
      }

      var doms = this.getDoms();
      var that = this;
      dataUtil.each(doms, function (dom) {
        if (dom[that._markLabel] !== MARK_USED) {
          // Remove gradient
          defs.removeChild(dom);
        }
      });
    }
    /**
     * @method getSvgProxy
     * 
     * Get SVG proxy.
     *
     * @param {Displayable} displayable displayable element
     * @return {Path|Image|Text} svg proxy of given element
     */

  }, {
    key: "getSvgProxy",
    value: function getSvgProxy(displayable) {
      if (displayable instanceof Path) {
        return svgPath;
      } else if (displayable instanceof QImage) {
        return svgImage;
      } else if (displayable instanceof QText) {
        return svgText;
      } else {
        return svgPath;
      }
    }
    /**
     * @method getTextSvgElement
     * 
     * Get text SVG element.
     *
     * @param {Displayable} displayable displayable element
     * @return {SVGElement} SVG element of text
     */

  }, {
    key: "getTextSvgElement",
    value: function getTextSvgElement(displayable) {
      return displayable.__textSvgEl;
    }
    /**
     * @method getSvgElement
     * 
     * Get SVG element.
     *
     * @param {Displayable} displayable displayable element
     * @return {SVGElement} SVG element
     */

  }, {
    key: "getSvgElement",
    value: function getSvgElement(displayable) {
      return displayable.__svgEl;
    }
  }]);

  return Definable;
}();

var _default = Definable;
module.exports = _default;
}, function(modId) { var map = {"../core":1582161598686,"../../core/utils/data_structure_util":1582161598602,"../../graphic/Path":1582161598644,"../../graphic/Image":1582161598633,"../../graphic/Text":1582161598657,"../graphic":1582161598685}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598691, function(require, module, exports) {
var Definable = require("./Definable");

var dataUtil = require("../../core/utils/data_structure_util");

var classUtil = require("../../core/utils/class_util");

var matrix = require("../../core/utils/matrix");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.svg.helper.ClippathManager
 * 
 * Manages SVG clipPath elements.
 * 
 * @author Zhang Wenli
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */
var ClippathManager =
/*#__PURE__*/
function (_Definable) {
  _inherits(ClippathManager, _Definable);

  /**
   * @method constructor ClippathManager
   * @param   {Number}     qrId    qrenderer instance id
   * @param   {SVGElement} svgRoot root of SVG document
   */
  function ClippathManager(qrId, svgRoot) {
    _classCallCheck(this, ClippathManager);

    return _possibleConstructorReturn(this, _getPrototypeOf(ClippathManager).call(this, qrId, svgRoot, 'clipPath', '__clippath_in_use__'));
  }
  /**
   * @method update
   * Update clipPath.
   *
   * @param {Displayable} displayable displayable element
   */


  _createClass(ClippathManager, [{
    key: "update",
    value: function update(displayable) {
      var svgEl = this.getSvgElement(displayable);

      if (svgEl) {
        this.updateDom(svgEl, displayable.__clipPaths, false);
      }

      var textEl = this.getTextSvgElement(displayable);

      if (textEl) {
        // Make another clipPath for text, since it's transform
        // matrix is not the same with svgElement
        this.updateDom(textEl, displayable.__clipPaths, true);
      }

      this.markUsed(displayable);
    }
    /**
     * @method updateDom
     * Create an SVGElement of displayable and create a <clipPath> of its
     * clipPath
     *
     * @param {Displayable} parentEl  parent element
     * @param {ClipPath[]}  clipPaths clipPaths of parent element
     * @param {boolean}     isText    if parent element is Text
     */

  }, {
    key: "updateDom",
    value: function updateDom(parentEl, clipPaths, isText) {
      if (clipPaths && clipPaths.length > 0) {
        // Has clipPath, create <clipPath> with the first clipPath
        var defs = this.getDefs(true);
        var clipPath = clipPaths[0];
        var clipPathEl;
        var id;
        var dom = isText ? '_textDom' : '_dom';

        if (clipPath[dom]) {
          // Use a dom that is already in <defs>
          id = clipPath[dom].getAttribute('id');
          clipPathEl = clipPath[dom]; // Use a dom that is already in <defs>

          if (!defs.contains(clipPathEl)) {
            // This happens when set old clipPath that has
            // been previously removed
            defs.appendChild(clipPathEl);
          }
        } else {
          // New <clipPath>
          id = 'qr' + this._qrId + '-clip-' + this.nextId;
          ++this.nextId;
          clipPathEl = this.createElement('clipPath');
          clipPathEl.setAttribute('id', id);
          defs.appendChild(clipPathEl);
          clipPath[dom] = clipPathEl;
        } // Build path and add to <clipPath>


        var svgProxy = this.getSvgProxy(clipPath);

        if (clipPath.transform && clipPath.parent.invTransform && !isText) {
          /**
           * If a clipPath has a parent with transform, the transform
           * of parent should not be considered when setting transform
           * of clipPath. So we need to transform back from parent's
           * transform, which is done by multiplying parent's inverse
           * transform.
           */
          // Store old transform
          var transform = Array.prototype.slice.call(clipPath.transform); // Transform back from parent, and brush path

          matrix.mul(clipPath.transform, clipPath.parent.invTransform, clipPath.transform);
          svgProxy.brush(clipPath); // Set back transform of clipPath

          clipPath.transform = transform;
        } else {
          svgProxy.brush(clipPath);
        }

        var pathEl = this.getSvgElement(clipPath);
        clipPathEl.innerHTML = '';
        /**
         * Use `cloneNode()` here to appendChild to multiple parents,
         * which may happend when Text and other shapes are using the same
         * clipPath. Since Text will create an extra clipPath DOM due to
         * different transform rules.
         */

        clipPathEl.appendChild(pathEl.cloneNode());
        parentEl.setAttribute('clip-path', 'url(#' + id + ')');

        if (clipPaths.length > 1) {
          // Make the other clipPaths recursively
          this.updateDom(clipPathEl, clipPaths.slice(1), isText);
        }
      } else {
        // No clipPath
        if (parentEl) {
          parentEl.setAttribute('clip-path', 'none');
        }
      }
    }
    /**
     * @method markUsed
     * 
     * Mark a single clipPath to be used
     *
     * @param {Displayable} displayable displayable element
     */

  }, {
    key: "markUsed",
    value: function markUsed(displayable) {
      var that = this; // displayable.__clipPaths can only be `null`/`undefined` or an non-empty array.

      if (displayable.__clipPaths) {
        dataUtil.each(displayable.__clipPaths, function (clipPath) {
          if (clipPath._dom) {
            Definable.prototype.markUsed.call(that, clipPath._dom);
          }

          if (clipPath._textDom) {
            Definable.prototype.markUsed.call(that, clipPath._textDom);
          }
        });
      }
    }
  }]);

  return ClippathManager;
}(Definable);

var _default = ClippathManager;
module.exports = _default;
}, function(modId) { var map = {"./Definable":1582161598690,"../../core/utils/data_structure_util":1582161598602,"../../core/utils/class_util":1582161598604,"../../core/utils/matrix":1582161598615}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1582161598692, function(require, module, exports) {
var Definable = require("./Definable");

var classUtil = require("../../core/utils/class_util");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @class qrenderer.svg.helper.ShadowManager
 * 
 * Manages SVG shadow elements.
 * 
 * @author Zhang Wenli
 * @docauthor 大漠穷秋 damoqiongqiu@126.com
 */
function hasShadow(style) {
  // TODO: textBoxShadowBlur is not supported yet
  return style && (style.shadowBlur || style.shadowOffsetX || style.shadowOffsetY || style.textShadowBlur || style.textShadowOffsetX || style.textShadowOffsetY);
}
/**
 * @method constructor ShadowManager
 * 
 * Manages SVG shadow elements.
 *
 * @param   {Number}     qrId    qrenderer instance id
 * @param   {SVGElement} svgRoot root of SVG document
 */


var ShadowManager =
/*#__PURE__*/
function (_Definable) {
  _inherits(ShadowManager, _Definable);

  function ShadowManager(qrId, svgRoot) {
    _classCallCheck(this, ShadowManager);

    return _possibleConstructorReturn(this, _getPrototypeOf(ShadowManager).call(this, qrId, svgRoot, ['filter'], '__filter_in_use__', '_shadowDom'));
  }
  /**
   * Create new shadow DOM for fill or stroke if not exist,
   * but will not update shadow if exists.
   *
   * @param {SvgElement}  svgElement   SVG element to paint
   * @param {Displayable} displayable  qrenderer displayable element
   */


  _createClass(ShadowManager, [{
    key: "addWithoutUpdate",
    value: function addWithoutUpdate(svgElement, displayable) {
      if (displayable && hasShadow(displayable.style)) {
        // Create dom in <defs> if not exists
        var dom;

        if (displayable._shadowDom) {
          // Gradient exists
          dom = displayable._shadowDom;
          var defs = this.getDefs(true);

          if (!defs.contains(displayable._shadowDom)) {
            // _shadowDom is no longer in defs, recreate
            this.addDom(dom);
          }
        } else {
          // New dom
          dom = this.add(displayable);
        }

        this.markUsed(displayable);
        var id = dom.getAttribute('id');
        svgElement.style.filter = 'url(#' + id + ')';
      }
    }
    /**
     * Add a new shadow tag in <defs>
     *
     * @param {Displayable} displayable  qrenderer displayable element
     * @return {SVGFilterElement} created DOM
     */

  }, {
    key: "add",
    value: function add(displayable) {
      var dom = this.createElement('filter'); // Set dom id with shadow id, since each shadow instance
      // will have no more than one dom element.
      // id may exists before for those dirty elements, in which case
      // id should remain the same, and other attributes should be
      // updated.

      displayable._shadowDomId = displayable._shadowDomId || this.nextId++;
      dom.setAttribute('id', 'qr' + this._qrId + '-shadow-' + displayable._shadowDomId);
      this.updateDom(displayable, dom);
      this.addDom(dom);
      return dom;
    }
    /**
     * Update shadow.
     *
     * @param {Displayable} displayable  qrenderer displayable element
     */

  }, {
    key: "update",
    value: function update(svgElement, displayable) {
      var style = displayable.style;

      if (hasShadow(style)) {
        var that = this;
        Definable.prototype.update.call(this, displayable, function () {
          that.updateDom(displayable, displayable._shadowDom);
        });
      } else {
        // Remove shadow
        this.remove(svgElement, displayable);
      }
    }
    /**
     * Remove DOM and clear parent filter
     */

  }, {
    key: "remove",
    value: function remove(svgElement, displayable) {
      if (displayable._shadowDomId != null) {
        this.removeDom(svgElement);
        svgElement.style.filter = '';
      }
    }
    /**
     * Update shadow dom
     *
     * @param {Displayable} displayable  qrenderer displayable element
     * @param {SVGFilterElement} dom DOM to update
     */

  }, {
    key: "updateDom",
    value: function updateDom(displayable, dom) {
      var domChild = dom.getElementsByTagName('feDropShadow');

      if (domChild.length === 0) {
        domChild = this.createElement('feDropShadow');
      } else {
        domChild = domChild[0];
      }

      var style = displayable.style;
      var scaleX = displayable.scale ? displayable.scale[0] || 1 : 1;
      var scaleY = displayable.scale ? displayable.scale[1] || 1 : 1; // TODO: textBoxShadowBlur is not supported yet

      var offsetX;
      var offsetY;
      var blur;
      var color;

      if (style.shadowBlur || style.shadowOffsetX || style.shadowOffsetY) {
        offsetX = style.shadowOffsetX || 0;
        offsetY = style.shadowOffsetY || 0;
        blur = style.shadowBlur;
        color = style.shadowColor;
      } else if (style.textShadowBlur) {
        offsetX = style.textShadowOffsetX || 0;
        offsetY = style.textShadowOffsetY || 0;
        blur = style.textShadowBlur;
        color = style.textShadowColor;
      } else {
        // Remove shadow
        this.removeDom(dom, style);
        return;
      }

      domChild.setAttribute('dx', offsetX / scaleX);
      domChild.setAttribute('dy', offsetY / scaleY);
      domChild.setAttribute('flood-color', color); // Divide by two here so that it looks the same as in canvas
      // See: https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-shadowblur

      var stdDx = blur / 2 / scaleX;
      var stdDy = blur / 2 / scaleY;
      var stdDeviation = stdDx + ' ' + stdDy;
      domChild.setAttribute('stdDeviation', stdDeviation); // Fix filter clipping problem

      dom.setAttribute('x', '-100%');
      dom.setAttribute('y', '-100%');
      dom.setAttribute('width', Math.ceil(blur / 2 * 200) + '%');
      dom.setAttribute('height', Math.ceil(blur / 2 * 200) + '%');
      dom.appendChild(domChild); // Store dom element in shadow, to avoid creating multiple
      // dom instances for the same shadow element

      displayable._shadowDom = dom;
    }
    /**
     * Mark a single shadow to be used
     *
     * @param {Displayable} displayable displayable element
     */

  }, {
    key: "markUsed",
    value: function markUsed(displayable) {
      if (displayable._shadowDom) {
        Definable.prototype.markUsed.call(this, displayable._shadowDom);
      }
    }
  }]);

  return ShadowManager;
}(Definable);

var _default = ShadowManager;
module.exports = _default;
}, function(modId) { var map = {"./Definable":1582161598690,"../../core/utils/class_util":1582161598604}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1582161598597);
})()
//# sourceMappingURL=index.js.map