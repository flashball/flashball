(function() {
  var $, FlickSlide, pluginname;

  $ = jQuery;

  pluginname = 'FlickSlide';

  FlickSlide = (function() {
    var defaults;

    defaults = {
      imagearea: '.imagearea',
      naviarea: '.naviarea',
      navibtn: '.navibtn',
      interval: 300,
      duration: 500,
      easing: "liner",
      width: 0,
      "min-width": 0,
      resize: false
    };

    function FlickSlide(config, callback, element) {
      this.element = $(element);
      this.options = $.extend(true, {}, defaults, config);
      if (this.setup()) {
        this._success = true;
      }
      this;
    }

    FlickSlide.prototype.setOption = function(config) {
      return this.options = $.extend(true, {}, FlickSlide.defaults, this.options, config);
    };

    FlickSlide.prototype.setup = function() {
      var navibtn, opt, size1, size2, size3, style,
        _this = this;
      opt = this.options;
      if (opt.imagearea instanceof jQuery.fn.init) {
        this.imagearea = opt.imagearea;
      } else {
        this.imagearea = this.element.find(opt.imagearea);
      }
      if (opt.naviarea instanceof jQuery.fn.init) {
        this.naviarea = opt.naviarea;
      } else {
        this.naviarea = this.element.find(opt.naviarea);
      }
      if (opt.navibtn instanceof jQuery.fn.init) {
        navibtn = opt.navibtn;
      } else {
        navibtn = this.element.find(opt.navibtn);
      }
      this.btn_base = navibtn.parent().html();
      this.stage = this.imagearea.find(".slidecontent");
      size1 = this.imagearea.size();
      size2 = this.naviarea.size();
      size3 = navibtn.size();
      if (size1 !== 1 || size2 !== 1 || size3 < 1) {
        return false;
      }
      style = {
        cursor: "pointer",
        position: 'relative',
        overflow: 'hidden'
      };
      this.imagearea.css(style);
      this.isTouch = "ontouchstart" in window;
      this.imagearea.on({
        'touchstart mousedown': function(e) {
          var touch;
          if (_this.isTouch) {
            if (e.touches != null) {
              touch = e.touches[0];
            } else {
              touch = e.originalEvent.touches[0];
            }
            _this.pageX = touch.pageX;
          } else {
            _this.pageX = e.pageX;
          }
          _this.startX = _this.pageX;
          _this.x = parseInt(_this.stage.css('left'));
          _this.touched = true;
          _this.waitTime = 0;
          _this.stage.stop().queue([]);
          if (!_this.isTouch) {
            e.preventDefault();
            return e.stopPropagation();
          }
        },
        'touchmove mousemove': function(e) {
          var pX, touch, vx;
          if (!_this.touched) {
            return;
          }
          if (_this.isTouch) {
            if (e.touches != null) {
              touch = e.touches[0];
            } else {
              touch = e.originalEvent.touches[0];
            }
            pX = touch.pageX;
          } else {
            pX = e.pageX;
          }
          vx = pX - _this.pageX;
          if (vx < -2 || vx > 2) {
            _this.x = _this.x + pX - _this.pageX;
            _this.pageX = pX;
            _this.stage.css("left", _this.x);
            _this.updateNavi(_this.x);
            e.preventDefault();
            return e.stopPropagation();
          }
        },
        'touchend mouseup mouseout': function(e) {
          var dis, l, n, nx, pX, t, touch, x;
          if (!_this.touched) {
            return;
          }
          _this.touched = false;
          if (_this.isTouch) {
            try {
              if (e.touches != null) {
                touch = e.touches[0];
              } else {
                touch = e.originalEvent.touches[0];
              }
              pX = touch.pageX;
            } catch (e) {
              pX = _this.pageX;
            }
          } else {
            pX = e.pageX;
          }
          x = _this.x + pX - _this.pageX;
          _this.pageX = pX;
          if (_this.startX < _this.pageX) {
            x += _this.areaWidth * 0.5;
          } else if (_this.startX > _this.pageX) {
            x -= _this.areaWidth * 0.5;
          }
          n = Math.round((x * -1) / _this.areaWidth);
          l = _this.naviarea.find("a > *").size();
          if (n > l - 1) {
            n = l - 1;
          }
          if (n < 0) {
            n = 0;
          }
          _this.x = _this.areaWidth * n * -1;
          nx = _this.stage.css("left").replace("px", "");
          dis = _this.x - nx;
          if (dis < 0) {
            dis *= -1;
          }
          t = _this.options.duration * (dis / _this.areaWidth);
          _this.stage.animate({
            left: _this.x
          }, t, _this.options.easing);
          _this.updateNavi(_this.x);
          e.preventDefault();
          return e.stopPropagation();
        }
      });
      if (opt.resize) {
        if (typeof Util !== "undefined" && Util !== null) {
          Util.window.bindResize(function() {
            return _this.resize;
          });
        } else {
          $(window).bind("resize", function() {
            return _this.resize;
          });
        }
      }
      return true;
    };

    FlickSlide.prototype.init = function() {
      var l,
        _this = this;
      this.updateSize();
      this.setImagesPosition();
      this.setNavi();
      this.updateNavi(this.x);
      if (this.Timer != null) {
        clearTime(this.Timer);
      }
      if (this.options.interval > 0) {
        l = this.stage.find("li").size();
        if (l > 1) {
          this.waitTime = 0;
          return this.Timer = setInterval(function() {
            return _this.update;
          }, 1000 / 100);
        }
      }
    };

    FlickSlide.prototype.update = function() {
      var l, n, next, x;
      if ((this.imagearea != null) && this.imagearea.size() > 0) {
        if (!this.touched) {
          this.waitTime++;
          if (this.waitTime > this.options.interval) {
            this.waitTime = 0;
            x = this.stage.position().left;
            x *= -1;
            n = Math.round(x / this.areaWidth);
            l = this.naviarea.find("a > *").size();
            next = (n + 1) % l;
            x = next * this.areaWidth * -1;
            this.stage.animate({
              left: x
            }, options.duration);
            this.updateNavi(x);
            return this.x = x;
          }
        }
      } else {
        return this.destory();
      }
    };

    FlickSlide.prototype.destory = function() {
      if (typeof Util !== "undefined" && Util !== null) {
        Util.window.unbindResize(this.resize);
      } else {
        $(window).unbind("resize", this.resize);
      }
      if (this.Timer != null) {
        clearInterval(this.Timer);
      }
      this.imagearea = null;
      this.naviarea = null;
      this.stage = null;
      this.resize = null;
      return this.update = null;
    };

    FlickSlide.prototype.resize = function() {
      if ((this.imagearea != null) && this.imagearea.size() > 0) {
        this.updateSize();
        this.setImagesPosition();
        return this.updateNavi(this.x);
      } else {
        return this.destory();
      }
    };

    FlickSlide.prototype.setImage = function(data) {
      var i, l;
      if (this.Timer != null) {
        clearInterval(this.Timer);
      }
      this.naviarea.empty();
      this.imagearea.empty();
      this.imagearea.append('<ul class="slidecontent"></ul>');
      this.stage = this.imagearea.find(".slidecontent");
      l = data.length;
      i = 0;
      while (i < l) {
        this.stage.append('<li><img src="' + data[i] + '" ></li>');
        i++;
      }
      return this.init();
    };

    FlickSlide.prototype.updateSize = function() {
      var w;
      if (this.options.width > 0) {
        w = this.options.width;
      } else {
        w = this.imagearea.width();
      }
      if (w < this.options["min-width"]) {
        w = this.options["min-width"];
      }
      this.areaWidth = w;
      return this.areaHeight = this.imagearea.height();
    };

    FlickSlide.prototype.setNavi = function() {
      var currentbtns, i, l,
        _this = this;
      currentbtns = this.naviarea.find("a > *").size();
      l = this.imagearea.find("li").size();
      if (l === 1) {
        this.naviarea.css("display", "none");
        return;
      } else {
        this.naviarea.css("display", "block");
      }
      if (currentbtns < l) {
        i = currentbtns;
        while (i < l) {
          this.naviarea.append(this.btn_base);
          i++;
        }
      }
      if ($.fn.common != null) {
        this.naviarea.common("onoffButton");
      }
      return this.naviarea.find("a > *").each(function(i, el) {
        if (i < l) {
          $(el).css("display", "block");
          return $(el).click(function(e) {
            _this.waitTime = 0;
            _this.x = i * _this.areaWidth * -1;
            _this.stage.animate({
              left: _this.x
            }, _this.options.duration, _this.options.easing);
            _this.updateNavi(_this.x);
            e.preventDefault();
            return e.stopPropagation();
          });
        } else {
          return $(el).css("display", "none");
        }
      });
    };

    FlickSlide.prototype.updateNavi = function(x) {
      var l, n, v,
        _this = this;
      v = x * -1;
      n = Math.round(v / this.areaWidth);
      l = this.naviarea.find("a > *").size();
      if (n > l - 1) {
        n = l - 1;
      }
      if (n < 0) {
        n = 0;
      }
      return this.naviarea.find("a > *").each(function(i, el) {
        if (n !== i) {
          $(el).removeClass("active");
          return $(el).trigger("mouseout");
        } else {
          if (!$(el).hasClass("active") || !_this.touched) {
            _this.element.trigger("slidestart", n);
          }
          $(el).trigger("mouseover");
          return $(el).addClass("active");
        }
      });
    };

    FlickSlide.prototype.setImagesPosition = function() {
      var d, l, n, nx, oldw, oldx,
        _this = this;
      if (this.x != null) {
        oldx = this.x * -1;
      } else {
        this.x = 0;
        oldx = -1;
      }
      l = this.stage.find("li").size();
      oldw = this.stage.find("li").width();
      this.stage.width(this.areaWidth * l);
      this.stage.find("li").each(function(i, el) {
        return $(el).width(_this.areaWidth);
      });
      n = Math.round(oldx / oldw);
      if (n > l - 1) {
        n = l - 1;
      }
      if (n < 0) {
        n = 0;
      }
      nx = this.areaWidth * n;
      if (nx !== oldx) {
        this.x = nx * -1;
        this.stage.stop().queue([]);
        d = 1;
        if (oldx >= 0) {
          d = this.options.duration;
        }
        return this.stage.animate({
          left: this.x
        }, d, this.options.easing);
      }
    };

    return FlickSlide;

  })();

  $.fn[pluginname] = function(config, args, callback) {
    var myclass;
    myclass = eval(pluginname);
    if (config == null) {
      config = {};
    }
    switch (typeof config) {
      case 'string':
        return this.each(function() {
          var instance;
          instance = $.data(this, pluginname);
          if (instance == null) {
            return false;
          }
          if (!$.isFunction(instance[config])) {
            return false;
          }
          return instance[config].apply(instance, args);
        });
      case 'object':
        return this.each(function() {
          var instance;
          instance = $.data(this, pluginname);
          if (instance) {
            return instance.setOption(config);
          } else {
            instance = new myclass(config, callback, this);
            if (instance._success != null) {
              return $.data(this, pluginname, instance);
            }
          }
        });
    }
  };

}).call(this);
