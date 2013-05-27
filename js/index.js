(function() {

  require(["libs/jquery-1.8.3.min"], function() {
    return require(["util", "libs/jquery.easing.1.3"], function() {
      var modules;
      modules = ["jquery.common", "jquery.flickslide"];
      if (Util.UA.isLtIE9) {
        modules.push("libs/jquery.belatedPNG");
      }
      return require(modules, function() {

        var aspectImgs, body, gnaviarea, replaceImgSrc, setAspectRate, setMainVisualAreaHeight, slidearea, works_loaded;
        aspectImgs = $(".imagearea img[data-aspect]");
        slidearea = null;
        gnaviarea = null;
        body = null;
 
        /* main visual function */
        setMainVisualAreaHeight = function() {
          return $(".imagearea").height(aspectImgs.height());
        };
        setAspectRate = function(w) {
          var ary, n;
          ary = [0.9375, 0.46614583, 0.4583333];
          n = ary.length - 1;
          if (w <= 768) {
            n = 0;
          } else if (w <= 980) {
            n = 1;
          }
          return aspectImgs.attr("data-aspect", ary[n]);
        };
        replaceImgSrc = function(jq, needle, replace) {
          return jq.each(function() {
            var src;
            src = $(this).attr("src");
            if (src.match(needle)) {
              $(this).attr("src", src.replace(needle, replace));
              if (!$(this).complete) {
                return $(this).load(function() {
                  return $(window).trigger("resize");
                });
              }
            }
          });
        };

        /* works function */
        works_loaded = function(json) {
          var cols, html, i, item, l, obj, reqs, size, w, _results;
          $("#loading").fadeOut(300);
          cols = 1;
          w = Util.window.size().width;
          if (w > 980) {
            cols = 3;
          } else if (w > 768) {
            cols = 2;
          }
          size = $("#works li").size();
          reqs = cols - size % cols;
          i = size;
          l = size + reqs;
          if (l >= json.length) {
            l = json.length;
            $("#worksmore").remove();
          } else {
            $("#worksmore").css("display", "block");
          }
          _results = [];
          while (i < l) {
            item = json[i];
            html = '<li><article class="clearfix"><div class="itemthumb imgfit">';
            html += '<img src="' + item.thumb.src + '" width="' + item.thumb.width + '" height="' + item.thumb.height + '">';
            html += '</div><p class="itemname">';
            html += item.name;
            html += '</p></article></li>';
            obj = $(html).appendTo($("#works ul"));
            _results.push(i++);
          }
          return _results;
        };

        /* document.ready */
        $(function() {
          var bp, needle, replace;
          if (!Util.UA.isSmartPhone) {
            needle = /img\/assets_mobile\//i;
            replace = "img/assets/";
            replaceImgSrc($("img"), needle, replace);
          }
          body = $("body");
          body.common();
          bp = body.common("getBreakPoint");
          setAspectRate(bp.value);
          setMainVisualAreaHeight();
          slidearea = $("#slidearea");
          slidearea.FlickSlide({
            interval: 300,
            easing: "easeOutExpo"
          });
          slidearea.on("slidestart", function(e, id) {
            var h, y;
            h = $(".morearea").height();
            y = h * id * -1;
            return $(".slidemorecontent").stop().queue([]).animate({
              "top": y
            }, 500);
          });
          slidearea.FlickSlide("init");
          gnaviarea = $("#gnavi");
          $("#menubtn").click(function() {
            var h;
            if (gnaviarea.height() > 0) {
              gnaviarea.stop().queue([]).animate({
                "height": "0"
              }, 500, "easeOutExpo");
              $("#btn_open").css("display", "block");
              $("#btn_close").css("display", "none");
            } else {
              h = $("#gnavi ul").height();
              gnaviarea.stop().queue([]).animate({
                "height": h
              }, 500, "easeOutExpo");
              $("#btn_open").css("display", "none");
              $("#btn_close").css("display", "block");
            }
            return false;
          });
          $("#worksmore a").click(function() {
            $("#worksmore").css("display", "none");
            $("#loading").fadeIn(300, function() {
              var url;
              url = "json/works.json";
              return $.getJSON(url, works_loaded);
            });
            return false;
          });
          if ($("#worksmore").size() > 0) {
            return $("#worksmore a").click();
          }
        });
        $(window).load(function() {
          body.common("updateAspectImageSize");
          slidearea.FlickSlide("resize");
          setTimeout(function() {
            return setMainVisualAreaHeight();
          }, 0);
          return false;
        });
        $(window).unload(function() {
          return false;
        });
        $(window).resize(function() {
          slidearea.FlickSlide("resize");
          setTimeout(function() {
            return setMainVisualAreaHeight();
          }, 0);
          return false;
        });
        return $(window).bind("breakpoint", function(e, maxWidth) {
          setAspectRate(maxWidth);
          slidearea.FlickSlide("resize");
          return setTimeout(function() {
            return setMainVisualAreaHeight();
          }, 0);
        });
      });
    });
  });

}).call(this);
