(function () {
  'use strict';

  Lampa.Platform.tv();
  (function () {
    'use strict';
    var _0x4e7f98 = {
      socket_use: false,
      socket_url: undefined,
      socket_methods: false,
      account_use: true,
      account_sync: true,
      plugins_use: true,
      plugins_store: true,
      torrents_use: true,
      white_use: false,
      lang_use: true
    };
    _0x4e7f98.read_only = false;
    _0x4e7f98.dcma = false;
    _0x4e7f98.push_state = true;
    _0x4e7f98.iptv = false;
    _0x4e7f98.feed = false;
    window.lampa_settings = Object.assign({}, window.lampa_settings || {}, _0x4e7f98);;
    var _0x4d7d0d = {
      dmca: true,
      reactions: false,
      discuss: false,
      ai: true
    };
    _0x4d7d0d.subscribe = true;
    _0x4d7d0d.blacklist = true;
    _0x4d7d0d.persons = true;
    _0x4d7d0d.ads = true;
    _0x4d7d0d.trailers = false;
    window.lampa_settings.disable_features = _0x4d7d0d;
    var _0xcfe0d2 = 0;
    function _0x32cb8b() {
      Lampa.Controller.listener.follow("toggle", function (_0x4b33d4) {
        if (_0x4b33d4.name == "select") {
          setTimeout(function () {
            if (Lampa.Activity.active().component == "full") {
              if (document.querySelector(".ad-server") !== null) {
                $(".ad-server").remove();
              }
            }
            if (Lampa.Activity.active().component === "modss_online") {
              $(".selectbox-item--icon").remove();
            }
          }, 20);
        }
      });
    }
    function _0x59400b() {
      setTimeout(function () {
        $(".selectbox-item__lock").parent().css('display', "none");
        if (!$("[data-name=\"account_use\"]").length) {
          $("div > span:contains(\"Статус\")").parent().remove();
        }
      }, 10);
    }
    function _0x51d8eb() {
      var _0x140969 = new MutationObserver(function (_0x3feb4d) {
        for (var _0x34e749 = 0; _0x34e749 < _0x3feb4d.length; _0x34e749++) {
          var _0x44438c = _0x3feb4d[_0x34e749];
          if (_0x44438c.type === "childList") {
            var _0x3082f0 = document.getElementsByClassName("card");
            if (_0x3082f0.length > 0) {
              if (_0xcfe0d2 === 0) {
                _0xcfe0d2 = 1;
                _0x59400b();
                setTimeout(function () {
                  _0xcfe0d2 = 0;
                }, 500);
              }
            }
          }
        }
      });
      var _0x2c1903 = {
        childList: true,
        subtree: true
      };
      _0x140969.observe(document.body, _0x2c1903);
    }
    function _0x1acb12() {
      var _0x5bfcc1 = document.createElement("style");
      _0x5bfcc1.innerHTML = ".button--subscribe { display: none; }";
      document.body.appendChild(_0x5bfcc1);
      $(document).ready(function () {
        var _0x17db8 = new Date();
        var _0x3b9020 = _0x17db8.getTime();
        localStorage.setItem("region", "{\"code\":\"uk\",\"time\":" + _0x3b9020 + '}');
      });
      setTimeout(function () {
        $(".open--notice").remove();
        if ($(".icon--blink").length > 0) {
          $(".icon--blink").remove();
        }
        if ($(".black-friday__button").length > 0) {
          $(".black-friday__button").remove();
        }
        if ($(".christmas__button").length > 0) {
          $(".christmas__button").remove();
        }
      }, 1000);
      Lampa.Settings.listener.follow("open", function (_0x57e703) {
        if (_0x57e703.name == "account") {
          setTimeout(function () {
            $(".settings--account-premium").remove();
            $("div > span:contains(\"CUB Premium\")").remove();
          }, 0);
        }
        if (_0x57e703.name == 'server') {
          if (document.querySelector(".ad-server") !== null) {
            $(".ad-server").remove();
          }
        }
      });
      Lampa.Listener.follow("full", function (_0x5e2bc2) {
        if (_0x5e2bc2.type == "complite") {
          $(".button--book").on("hover:enter", function () {
            _0x59400b();
          });
        }
      });
      Lampa.Storage.listener.follow("change", function (_0x224e01) {
        if (_0x224e01.name == 'activity') {
          if (Lampa.Activity.active().component === "bookmarks") {
            $(".register").filter(function () {
              var _0x170ec8 = $(this).text().replace(/\d+$/, '').trim();
              return ["Смотрю", "Просмотрено", "Запланировано", "Продолжение следует", "Брошено"].includes(_0x170ec8);
            }).hide();
          }
          setTimeout(function () {
            _0x51d8eb();
          }, 200);
        }
      });
    }
    if (window.appready) {
      _0x1acb12();
      _0x51d8eb();
      _0x32cb8b();
    } else {
      Lampa.Listener.follow("app", function (_0x311498) {
        if (_0x311498.type == "ready") {
          _0x1acb12();
          _0x51d8eb();
          _0x32cb8b();
        }
      });
    }
  })();
})();