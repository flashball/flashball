(function() {

  if (this.console == null) {
    this.console = {
      log: function() {}
    };
  }

  this.Util = (function() {

    Util.UA = (function() {
      var isIPad3, ua, ver, _ua;
      _ua = navigator.userAgent.toLowerCase();
      ua = {
        isIE: false,
        isIE6: false,
        isIE7: false,
        isIE8: false,
        isIE9: false,
        isLtIE9: false,
        isIOS: false,
        isIPhone: false,
        isIPad: false,
        isIPhone4: false,
        isIPad3: false,
        isAndroid: false,
        isAndroidMobile: false,
        isChrome: false,
        isSafari: false,
        isMozilla: false,
        isWebkit: false,
        isOpera: false,
        isPC: false,
        isTablet: false,
        isSmartPhone: false,
        browser: _ua
      };
      if (ua.isIE = /msie\s(\d+)/.test(_ua)) {
        ver = RegExp.$1;
        ver *= 1;
        ua.isIE6 = ver === 6;
        ua.isIE7 = ver === 7;
        ua.isIE8 = ver === 8;
        ua.isIE9 = ver === 9;
        ua.isLtIE9 = ver < 9;
      }
      if (ua.isIE7 && _ua.indexOf('trident/4.0') !== -1) {
        ua.isIE7 = false;
        ua.isIE8 = true;
      }
      if (ua.isIPhone = /i(phone|pod)/.test(_ua)) {
        ua.isIPhone4 = window.devicePixelRatio === 2;
      }
      if (ua.isIPad = /ipad/.test(_ua)) {
        isIPad3 = window.devicePixelRatio === 2;
      }
      ua.isIOS = ua.isIPhone || ua.isIPad;
      ua.isAndroid = /android/.test(_ua);
      ua.isAndroidMobile = /android(.+)?mobile/.test(_ua);
      ua.isPC = !ua.isIOS && !ua.isAndroid;
      ua.isTablet = ua.isIPad || (ua.isAndroid && ua.isAndroidMobile);
      ua.isSmartPhone = ua.isIPhone || ua.isAndroidMobile;
      ua.isChrome = /chrome/.test(_ua);
      ua.isWebkit = /webkit/.test(_ua);
      ua.isOpera = /opera/.test(_ua);
      ua.isMozilla = _ua.indexOf("compatible") < 0 && /mozilla/.test(_ua);
      ua.isSafari = !ua.isChrome && ua.isWebkit;
      return ua;
    })();

    Util.venderPrefix = (function() {
      if (Util.UA.isIE) {
        return "-ms-";
      }
      if (Util.UA.isWebkit) {
        return "-webkit-";
      }
      if (Util.UA.isMozilla) {
        return "-moz-";
      }
      if (Util.UA.isOpera) {
        return "-o-";
      }
      return "";
    })();

    Util.stats = (function() {
      var sts, stsTimer, update;
      sts = null;
      stsTimer = null;
      update = function() {
        if (!(typeof Stats !== "undefined" && Stats !== null) || !(sts != null)) {
          return false;
        }
        stsTimer = requestAnimationFrame(update);
        return sts.update();
      };
      return {
        show: function(mode) {
          if (mode == null) {
            mode = 0;
          }
          if (!(typeof Stats !== "undefined" && Stats !== null) || (sts != null) || Util.UA.isLtIE9) {
            return false;
          }
          sts = new Stats();
          sts.setMode(mode);
          document.body.appendChild(sts.domElement);
          sts.domElement.style.cssText = "position:fixed; top:0; left:0; z-index:9999999;";
          return update();
        },
        remove: function() {
          if (!(typeof Stats !== "undefined" && Stats !== null) || !(sts != null)) {
            return false;
          }
          if (stsTimer != null) {
            cancelAnimationFrame(stsTimer);
          }
          document.body.removeChild(sts.domElement);
          return sts = null;
        }
      };
    })();

    Util.animationFrameDelta = 0;

    (function() {
      var callbacks, isDateHasNow, lastTime, prefix, setDelta;
      isDateHasNow = !!Date.now;
      lastTime = isDateHasNow ? Date.now() : +(new Date);
      callbacks = [];
      setDelta = function(calledTime) {
        Util.animationFrameDelta = calledTime - lastTime;
        lastTime = calledTime;
        window.requestAnimationFrame(setDelta);
      };
      if (!window.requestAnimationFrame) {
        prefix = Util.venderPrefix.replace(/-/g, "");
        window.requestAnimationFrame = window[prefix + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[prefix + "CancelAnimationFrame"] || window[prefix + "CancelRequestAnimationFrame"];
      }
      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function() {
          var id;
          id = 0;
          return function(callback, element) {
            if (callbacks.length === 0) {
              id = setTimeout(function() {
                var cb, cbs, now;
                now = isDateHasNow ? Date.now() : +(new Date);
                cbs = callbacks;
                callbacks = [];
                while (cb = cbs.shift()) {
                  cb(now);
                }
              }, 16);
            }
            if ($.inArray != null) {
              if (typeof callback === "function" && $.inArray(callback, callbacks) === -1) {
                callbacks.push(callback);
              }
            } else {
              callbacks.push(callback);
            }
            return id;
          };
        })();
        window.cancelAnimationFrame = function(id) {
          callbacks = [];
          return clearTimeout(id);
        };
      }
      setDelta(isDateHasNow ? Date.now() : +(new Date));
    })();

    Util.window = (function() {
      var doc, height, isUpdate, onResize, pageHeight, pageWidth, resizeCallbacks, width, win;
      win = $(window);
      doc = $(document);
      width = 0;
      height = 0;
      pageWidth = 0;
      pageHeight = 0;
      resizeCallbacks = [];
      isUpdate = 0;
      onResize = function() {
        var callback, callbacks, _i, _len;
        isUpdate = 3;
        callbacks = resizeCallbacks.concat();
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          callback();
        }
      };
      win.resize(onResize);
      $(function() {
        width = win.width();
        height = win.height();
        pageWidth = doc.width();
        return pageHeight = doc.height();
      });
      return {
        size: function(withUpdate) {
          if (withUpdate == null) {
            withUpdate = false;
          }
          if (withUpdate || isUpdate & 1) {
            isUpdate = (isUpdate | 1) ^ 1;
            width = win.width();
            height = win.height();
          }
          return {
            width: width,
            height: height
          };
        },
        pageSize: function(withUpdate) {
          if (withUpdate == null) {
            withUpdate = false;
          }
          if (withUpdate || isUpdate & 2) {
            isUpdate = (isUpdate | 2) ^ 2;
            pageWidth = doc.width();
            pageHeight = doc.height();
          }
          return {
            width: pageWidth,
            height: pageHeight
          };
        },
        scrollTop: function() {
          if (window.pageYOffset != null) {
            return window.pageYOffset;
          }
          return win.scrollTop();
        },
        scrollBottom: function() {
          if (window.pageYOffset != null) {
            return window.pageYOffset + window.innerHeight;
          }
          return win.scrollTop() + height;
        },
        bindResize: function(callback) {
          if (typeof callback === "function" && $.inArray(callback, resizeCallbacks) === -1) {
            resizeCallbacks.push(callback);
          }
        },
        unbindResize: function(callback, isReset) {
          var index;
          if (isReset == null) {
            isReset = false;
          }
          if (callback && (index = $.inArray(callback, resizeCallbacks)) !== -1) {
            resizeCallbacks.splice(index, 1);
          }
          if (isReset) {
            resizeCallbacks = [];
          }
        }
      };
    })();

    Util.cursor = (function() {
      var c,
        _this = this;
      return c = {
        over: "mouseenter touchstart",
        out: "mouseleave touchend",
        down: "mousedown touchstart",
        move: "mousemove touchmouve",
        up: "mouseup touchend",
        click: "mouseup touchend",
        clientXY: function(e) {
          var pos;
          pos = {
            x: 0,
            y: 0
          };
          if (e != null) {
            if ("ontouchstart" in window) {
              if (e.touches != null) {
                e = e.touches[0];
              } else {
                e = e.originalEvent.touches[0];
              }
            }
            if (e.clientX != null) {
              pos.x = e.clientX;
              pos.y = e.clientY;
            }
          }
          return pos;
        },
        pageXY: function(e) {
          var pos;
          pos = {
            x: 0,
            y: 0
          };
          if (e != null) {
            if ("ontouchstart" in window) {
              if (e.touches != null) {
                e = e.touches[0];
              } else {
                e = e.originalEvent.touches[0];
              }
            }
            if (e.pageX != null) {
              pos.x = e.pageX;
              pos.y = e.pageY;
            }
          }
          return pos;
        }
      };
    })();

    Util.array = (function() {
      return {
        setRemove: function(ary) {
          if (ary == null) {
            ary = Array.prototype;
          } else {
            if (!(ary instanceof Array)) {
              return false;
            }
          }
          if (ary.remove != null) {
            return false;
          }
          ary.remove = function() {
            var i, j, l, m;
            l = arguments.length;
            i = 0;
            while (i < l) {
              m = this.length;
              j = 0;
              while (j < m) {
                if (arguments[i] === this[j]) {
                  this.splice(j, 1);
                  m--;
                } else {
                  j++;
                }
              }
              i++;
            }
            return this.length;
          };
          return true;
        },
        setQuery: function(ary) {
          if (ary == null) {
            ary = Array.prototype;
          } else {
            if (!(ary instanceof Array)) {
              return false;
            }
          }
          if (ary.remove != null) {
            return false;
          }
          ary.q = function(key, value) {
            var ary_match, i, item, l;
            if (value == null) {
              value = key;
              key = "id";
            }
            ary_match = [];
            i = 0;
            l = this.length;
            while (i < l) {
              item = this[i];
              if (item[key] === value) {
                ary_match.push(item);
              }
              i++;
            }
            if (ary_match.length === 1) {
              return ary_match[0];
            } else {
              return ary_match;
            }
          };
          return true;
        }
      };
    })();

    Util.QueryString = (function(a) {
      var ary, data, i, l, n, value;
      if (a == null) {
        return {};
      }
      data = {};
      value = [];
      i = 0;
      l = a.length;
      n = 0;
      while (i < l) {
        ary = a[i].split('=');
        if (ary.length === 1 || ary[0] === "value") {
          value.push(decodeURIComponent(ary[0].replace(/\+/g, " ")));
        } else if (ary.length === 2) {
          data[ary[0]] = decodeURIComponent(ary[1].replace(/\+/g, " "));
          n++;
        }
        i++;
      }
      if (value.length > 0) {
        if (value.length === 1) {
          if (n === 0) {
            return value[0];
          } else {
            data["value"] = value[0];
          }
        } else {
          if (n === 0) {
            return value;
          } else {
            data["value"] = value;
          }
        }
      }
      return data;
    })(window.location.search.substr(1).split('&'));

    function Util() {
      throw new Error('it is static class');
    }

    return Util;

  })();

}).call(this);
