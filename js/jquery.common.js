/*
jquery.common.js v.2.0.6
Copyright (c) 2013 SHIFTBRAIN Inc.
Licensed under the MIT license.

https://github.com/devjam
*/

(function() {
  var $, common, pluginname;

  $ = jQuery;

  pluginname = 'common';

  common = (function() {
    var defaults;

    defaults = {
      methods: ["setSmoothScroll", "pngfixBg", "crossFadeButton", "onoffButton", "pngfixImg", "initAspectImageSize"],
      breakpoints: [768, 980],
      htmlclass: [
        {
          ua: "isPC",
          name: "pc"
        }, {
          ua: "isTablet",
          name: "tablet"
        }, {
          ua: "isSmartPhone",
          name: "mobile"
        }, {
          ua: "isIOS",
          name: "ios"
        }, {
          ua: "isAndroid",
          name: "android"
        }
      ],
      onoffbtn: {
        selector: "img[src*='_off.'],img[src*='_on.'],:image[src*='_off.'],:image[src*='_on.']",
        str_on: '_on.',
        str_off: '_off.',
        classname: 'onoffbtn'
      },
      crossfade: {
        selector: "img[src*='_out.'],img[src*='_ov.'],:image[src*='_out.'],:image[src*='_ov.']",
        str_on: '_ov.',
        str_off: '_out.',
        duration: 200,
        ease: "linear",
        classname: 'crossfadebtn'
      },
      scroll: {
        selector: 'a[href^=#]',
        duration: 800,
        ease: "swing",
        "return": false
      },
      pngfixbg: {
        selector: ".bgimg:not('.pngfixed')",
        classname: "pngfixed"
      },
      pngfix: {
        selector: "img[src$='.png']",
        classname: "pngfixed"
      },
      bgimg: {
        classname: "bgimg"
      },
      aspectimg: {
        selector: "img[data-aspect]",
        attrname: "data-aspect",
        attrdef: "data-aspect-def"
      }
    };

    function common(config, callback, element) {
      this.element = $(element);
      this.options = $.extend(true, {}, defaults, config);
      if (this.setup()) {
        this._success = true;
      }
      this;

    }

    common.prototype.setOption = function(config) {
      return this.options = $.extend(true, {}, this.options, config);
    };

    common.prototype.setup = function() {
      var i, l, methods;
      methods = this.options.methods;
      i = 0;
      l = methods.length;
      while (i < l) {
        common[methods[i]](this.element);
        i++;
      }
      return true;
    };

    common.updateAspectImageSize = function(jq, opt) {
      var conf,
        _this = this;
      if (jq != null) {
        jq = $(jq);
      } else {
        jq = $(this);
      }
      if (opt != null) {
        conf = this.options != null ? this.options.aspectimg : defaults.aspectimg;
        if (opt.aspectimg != null) {
          opt = opt.aspectimg;
        }
        opt = $.extend(true, {}, conf, opt);
      } else {
        opt = this.options != null ? this.options.aspectimg : defaults.aspectimg;
      }
      return jq.find(opt.selector).each(function(i, el) {
        var aspect, aspect_def, elm, img, r, w, x;
        elm = $(el);
        aspect = elm.attr(opt.attrname);
        aspect_def = elm.attr(opt.attrdef);
        if (isNaN(aspect_def)) {
          img = new Image();
          img.src = elm.attr("src");
          r = img.height / img.width;
          elm.attr(opt.attrdef, r);
          aspect_def = r;
        }
        r = aspect / aspect_def;
        w = elm.parent().width();
        if (r > 1) {
          w *= r;
        }
        x = (elm.parent().width() - w) * 0.5;
        elm.width(w);
        return elm.css({
          "left": x
        });
      });
    };

    common.initAspectImageSize = function(jq, opt) {
      var conf,
        _this = this;
      if (jq != null) {
        jq = $(jq);
      } else {
        jq = $(this);
      }
      if (opt != null) {
        conf = this.options != null ? this.options.aspectimg : defaults.aspectimg;
        if (opt.aspectimg != null) {
          opt = opt.aspectimg;
        }
        opt = $.extend(true, {}, conf, opt);
      } else {
        opt = this.options != null ? this.options.aspectimg : defaults.aspectimg;
      }
      jq.find(opt.selector).each(function(i, el) {
        var elm, img, r;
        elm = $(el);
        img = new Image();
        img.src = elm.attr("src");
        if (img.complete) {
          r = img.height / img.width;
          return elm.attr(opt.attrdef, r);
        } else {
          return $(img).load(function() {
            r = img.height / img.width;
            elm.attr(opt.attrdef, r);
            common.updateAspectImageSize(elm);
            return $(window).trigger("load");
          });
        }
      });
      if (jq.find(opt.selector).size() > 0) {
        Util.window.bindResize(function() {
          return common.updateAspectImageSize(jq);
        });
        common.updateAspectImageSize(jq);
      }
      return jq;
    };

    common.setSmoothScroll = function(jq, opt) {
      var conf,
        _this = this;
      if (jq != null) {
        jq = $(jq);
      } else {
        jq = $(this);
      }
      conf = this.options != null ? this.options.scroll : defaults.scroll;
      if (opt != null) {
        if (opt.scroll != null) {
          opt = opt.scroll;
        }
        opt = $.extend(true, {}, conf, opt);
      } else {
        opt = conf;
      }
      return jq.find(opt.selector).each(function(i, el) {
        var elm;
        elm = $(el);
        if (!(elm.attr("target") != null) && !(elm.attr("rel") != null)) {
          return elm.on("click", function(e) {
            return common.smoothScroll(e);
          });
        }
      });
    };

    common.smoothScroll = function(e, opt) {
      var conf, target, top;
      conf = this.options != null ? this.options.scroll : defaults.scroll;
      if (opt != null) {
        if (opt.scroll != null) {
          opt = opt.scroll;
        }
        opt = $.extend(true, {}, conf, opt);
      } else {
        opt = conf;
      }
      target = $(e.currentTarget.hash);
      if (target.size()) {
        top = target.offset().top;
      } else {
        top = 0;
      }
      $('body,html').animate({
        scrollTop: top
      }, opt.duration, opt.ease);
      return opt["return"];
    };

    common.pngfixBg = function(jq, opt) {
      var conf,
        _this = this;
      if (jq != null) {
        jq = $(jq);
      } else {
        jq = $(this);
      }
      conf = this.options != null ? this.options.pngfixbg : defaults.pngfixbg;
      if (opt != null) {
        if (opt.pngfixbg != null) {
          opt = opt.pngfixbg;
        }
        opt = $.extend(true, {}, conf, opt);
      } else {
        opt = conf;
      }
      return jq.find(opt.selector).each(function(i, el) {
        var bg, bgsrc, elm, img;
        elm = $(el);
        bg = elm.css('background-image');
        if (bg.indexOf("url") !== -1) {
          bgsrc = bg.replace(/(^url\()|(\)$|[\"\'])/g, '');
          if (bgsrc.indexOf(".") !== -1) {
            img = new Image();
            img.src = bgsrc;
            if (img.complete) {
              setTimeout(function() {
                elm.css({
                  width: img.width,
                  height: img.height
                });
                if (elm.fixPng != null) {
                  elm.fixPng();
                  return elm.addClass(opt.classname);
                }
              }, 0);
            } else {
              $(img).load(function() {
                elm.css({
                  width: img.width,
                  height: img.height
                });
                if (elm.fixPng != null) {
                  elm.fixPng();
                  return elm.addClass(opt.classname);
                }
              });
            }
          }
        }
        return elm;
      });
    };

    common.pngfixImg = function(jq, opt) {
      var conf,
        _this = this;
      if (jq != null) {
        jq = $(jq);
      } else {
        jq = $(this);
      }
      conf = this.options != null ? this.options.pngfix : defaults.pngfix;
      if (opt != null) {
        if (opt.pngfix != null) {
          opt = opt.pngfix;
        }
        opt = $.extend(true, {}, conf, opt);
      } else {
        opt = conf;
      }
      return jq.find(opt.selector).each(function(i, el) {
        var elm;
        elm = $(el);
        if ((elm.fixPng != null) && !elm.hasClass(opt.classname)) {
          elm.fixPng();
          elm.addClass(opt.classname);
        }
        return elm;
      });
    };

    common.imgToBg = function(elm, opt) {
      var bg, conf, img, obj, src,
        _this = this;
      conf = this.options != null ? this.options.bgimg : defaults.bgimg;
      if (opt != null) {
        if (opt.bgimg != null) {
          opt = opt.bgimg;
        }
        opt = $.extend(true, {}, conf, opt);
      } else {
        opt = conf;
      }
      src = "";
      bg = $('<span class="' + opt.classname + '"></span>');
      obj = $(bg);
      if (Util.UA.isIE6 || Util.UA.isIE7) {
        obj.css({
          display: "inline",
          zoom: 1,
          backgroundPositionX: 0,
          backgroundPositionY: 0,
          backgroundRepeat: "no-repeat"
        });
      } else {
        obj.css({
          display: "inline-block",
          backgroundPositionX: 0,
          backgroundPositionY: 0,
          backgroundRepeat: "no-repeat"
        });
      }
      if (elm != null) {
        if (typeof elm === "string") {
          src = elm;
        } else {
          src = $(elm).attr("src");
        }
      } else {
        src = $(this).attr("src");
      }
      if (src == null) {
        return obj;
      }
      img = new Image();
      img.src = src;
      if (img.complete) {
        setTimeout(function() {
          obj.css({
            width: img.width,
            height: img.height,
            backgroundImage: 'url("' + src + '")'
          });
          if (obj.fixPng != null) {
            if (src.match(/\.png$/)) {
              obj.fixPng();
              obj.addClass("pngfixed");
            }
          }
          return obj.trigger("load");
        }, 0);
      } else {
        $(img).load(function() {
          obj.css({
            width: img.width,
            height: img.height,
            backgroundImage: 'url("' + src + '")'
          });
          if (obj.fixPng != null) {
            if (src.match(/\.png$/)) {
              obj.fixPng();
              obj.addClass("pngfixed");
            }
          }
          obj.trigger("load");
          return _this;
        });
      }
      return obj;
    };

    common.onoffButton = function(jq, opt) {
      var conf, offexp, onexp,
        _this = this;
      if (jq != null) {
        jq = $(jq);
      } else {
        jq = $(this);
      }
      conf = this.options != null ? this.options.onoffbtn : defaults.onoffbtn;
      if (opt != null) {
        if (opt.onoffbtn != null) {
          opt = opt.onoffbtn;
        }
        opt = $.extend(true, {}, conf, opt);
      } else {
        opt = conf;
      }
      onexp = new RegExp(opt.str_on.replace(".", "\."));
      offexp = new RegExp(opt.str_off.replace(".", "\."));
      return jq.find(opt.selector).each(function(i, el) {
        var elm;
        elm = $(el);
        elm.addClass(opt.classname);
        if (elm.attr("src").match(onexp)) {
          elm.addClass("active");
        }
        elm.on("mouseover", function(e) {
          el = $(e.currentTarget);
          if (el.hasClass('active')) {
            return;
          }
          if (el.attr("src").match(offexp)) {
            return el.attr("src", el.attr("src").replace(opt.str_off, opt.str_on));
          }
        });
        elm.on("mouseout click", function(e) {
          el = $(e.currentTarget);
          if (el.hasClass('active')) {
            return;
          }
          if (el.attr("src").match(onexp)) {
            return el.attr("src", el.attr("src").replace(opt.str_on, opt.str_off));
          }
        });
        return elm;
      });
    };

    common.crossFadeButton = function(jq, opt) {
      var btnImgStyle, btnStyle, conf,
        _this = this;
      btnStyle = {
        display: "block",
        position: "relative",
        width: 0,
        height: 0,
        cursor: "pointer"
      };
      btnImgStyle = {
        display: "block",
        position: "absolute",
        top: 0,
        left: 0
      };
      conf = this.options != null ? this.options.crossfade : defaults.crossfade;
      if (opt != null) {
        if (opt.crossfade != null) {
          opt = opt.crossfade;
        }
        opt = $.extend(true, {}, conf, opt);
      } else {
        opt = conf;
      }
      return jq.find(opt.selector).each(function(i, el) {
        var btn, elm, form, id, offBtn, onBtn, onclick, onexp, src;
        elm = $(el);
        if (elm != null) {
          elm = $(elm);
        } else {
          elm = $(_this);
        }
        src = elm.attr("src");
        id = elm.attr('id');
        if (opt.str_on == null) {
          return elm;
        }
        if (src == null) {
          return elm;
        }
        onexp = new RegExp(opt.str_on.replace(".", "\."));
        btn = $('<span class="' + opt.classname + '" />').insertBefore(elm);
        onBtn = common.imgToBg(src.replace(opt.str_off, opt.str_on));
        offBtn = common.imgToBg(src.replace(opt.str_on, opt.str_off));
        offBtn.load(function() {
          btn.width(offBtn.width());
          return btn.height(offBtn.height());
        });
        btn.append(offBtn).append(onBtn).css(btnStyle);
        btn.mouseenter(function(e) {
          if ($(e.currentTarget).hasClass('active')) {
            return;
          }
          onBtn.stop().clearQueue().fadeTo(opt.duration, 0.9999999999, opt.ease);
          offBtn.stop().clearQueue().fadeTo(opt.duration * 1.05, 0, opt.ease);
          return true;
        });
        btn.mouseleave(function(e) {
          if ($(e.currentTarget).hasClass('active')) {
            return;
          }
          offBtn.stop().clearQueue().fadeTo(opt.duration, 0.9999999999, opt.ease);
          onBtn.stop().clearQueue().fadeTo(opt.duration * 1.05, 0, opt.ease);
          return true;
        });
        if (src.match(onexp)) {
          offBtn.css({
            opacity: 0
          });
          btn.addClass("active");
        } else {
          onBtn.css({
            opacity: 0
          });
        }
        onBtn.css(btnImgStyle);
        offBtn.css(btnImgStyle);
        if (elm.is(':image')) {
          onclick = elm.get(0).onclick;
          form = elm.get(0).form;
          btn.click(function() {
            if (onclick != null) {
              if (onclick(e) !== false ? form : void 0) {
                form.submit();
              }
            } else {
              if (form) {
                form.submit();
              }
            }
            return false;
          });
        }
        elm.remove();
        return btn;
      });
    };

    common.getBreakPoint = function(breakpoints) {
      var i, l, v, ww;
      if (breakpoints == null) {
        if (this.options != null) {
          breakpoints = this.options.breakpoints;
        } else {
          breakpoints = defaults.breakpoints;
        }
      }
      if (!(breakpoints != null) || !(breakpoints.length != null)) {
        return {
          "key": 0,
          "value": 0
        };
      }
      ww = Util.window.size().width;
      i = 0;
      l = breakpoints.length;
      while (i < l) {
        if (ww < breakpoints[i]) {
          break;
        }
        i++;
      }
      v = 0;
      if (breakpoints.length != null) {
        if (breakpoints.length > i) {
          v = breakpoints[i];
        } else {
          v = ww;
        }
      }
      return {
        "key": i,
        "value": v
      };
    };

    common.setBreakpointEvent = function(breakpoints) {
      var checkMediaQuery, w;
      if (breakpoints == null) {
        if (this.options != null) {
          breakpoints = this.options.breakpoints;
        } else {
          breakpoints = defaults.breakpoints;
        }
      }
      w = common.getBreakPoint(breakpoints);
      checkMediaQuery = function() {
        var args, bp, event, orgEvent;
        bp = common.getBreakPoint(breakpoints);
        if (w !== bp.key) {
          args = [].slice.call(arguments, 1);
          args.unshift(bp.value);
          $(window).trigger("breakpoint", args);
        }
        return w = bp.key;
      };
      Util.window.bindResize(checkMediaQuery);
      return true;
    };

    common.setHtmlClass = function(htmlclass) {
      var i, item, l;
      if (htmlclass == null) {
        if (this.options != null) {
          htmlclass = this.options.htmlclass;
        } else {
          htmlclass = defaults.htmlclass;
        }
      }
      $("html").removeClass("nojs");
      i = 0;
      l = htmlclass.length;
      while (i < l) {
        item = htmlclass[i];
        if (Util.UA[item.ua]) {
          $('html').addClass(item.name);
        }
        i++;
      }
      return true;
    };

    return common;

  })();

  $.fn[pluginname] = function(config, args, callback) {
    var backdata, method, myclass;
    myclass = eval(pluginname);
    if (config == null) {
      config = {};
    }
    switch (typeof config) {
      case 'string':
        method = myclass[config];
        backdata = [];
        if (!$.isFunction(method)) {
          return false;
        }
        this.each(function() {
          var instance;
          instance = $.data(this, pluginname);
          if (instance != null) {
            if ($.isFunction(instance[config])) {
              return backdata.push(instance[config].apply(instance, args));
            } else {
              return backdata.push(method(instance, args));
            }
          } else {
            return backdata.push(method(this, args));
          }
        });
        if (backdata.length <= 1) {
          backdata = backdata[0];
        }
        return backdata;
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

  $(function() {
    common.setBreakpointEvent();
    return common.setHtmlClass();
  });

}).call(this);
