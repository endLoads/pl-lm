(function () {
  "use strict";

  // ================= ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =================

  function createLogger(prefix) {
    return function () {
      if (!window.console || !console.log) return;
      var args = Array.prototype.slice.call(arguments);
      args.unshift(prefix);
      try {
        console.log.apply(console, args);
      } catch (e) {
        try {
          console.log(prefix, args.join(" "));
        } catch (e2) {}
      }
    };
  }

  var log = createLogger("[DrxSuperMenu]");

  // ================= БАЗОВАЯ КОНФИГУРАЦИЯ =================

  var SuperMenuConfig = {
    DEBUG: false,
    VERBOSE_LOGGING: false,

    PERFORMANCE: {
      DEBOUNCE_DELAY: 300,
      THROTTLE_LIMIT: 100,
      MUTATION_THROTTLE: 50
    },

    PLATFORM: {
      isAndroid: false,
      isWebOS: false,
      isTizen: false,
      isBrowser: true,
      isTV: false
    },

    LABEL_COLORS: {
      vivid: {
        TYPE: {
          movie: "#FFD54F",
          tv: "#4CAF50",
          anime: "#E91E63"
        },
        QUALITY: {
          "4K": "#FF5722",
          "2160p": "#FF5722",
          "1080p": "#03A9F4",
          "720p": "#B0BEC5",
          SD: "#90A4AE",
          CAM: "#FF7043",
          HDR: "#FFC107"
        }
      },
      soft: {
        TYPE: {
          movie: "#FFE082",
          tv: "#A5D6A7",
          anime: "#F48FB1"
        },
        QUALITY: {
          "4K": "#FFAB91",
          "2160p": "#FFAB91",
          "1080p": "#81D4FA",
          "720p": "#CFD8DC",
          SD: "#B0BEC5",
          CAM: "#FFAB91",
          HDR: "#FFD54F"
        }
      }
    },

    LABEL_SCHEME: "vivid",

    RATINGS: {
      tmdbApiKey: "",
      kpApiKey: "",
      kpApiUrl: "https://kinopoiskapiunofficial.tech/api/v2.2/films"
    },

    RATING_CACHE: {
      tmdb: Object.create(null),
      imdb: Object.create(null),
      kp: Object.create(null)
    },

    VOICEOVER: {
      enabled: true,
      cache: Object.create(null)
    },

    FEATURES: {
      madness: false,
      madness_level: "normal",
      perf_mode: "normal",
      ratings_tmdb: false,
      ratings_imdb: false,
      ratings_kp: false,
      label_colors_enabled: true,
      label_scheme: "vivid",
      topbar_exit_menu: true,
      borderless_dark_theme: false,
      voiceover_tracking: false
    }
  };

  // ================= ВНУТРЕННИЕ ВСПОМОГАТЕЛЬНЫЕ =================

  function getCurrentLabelColors() {
    var scheme = SuperMenuConfig.LABEL_SCHEME || "vivid";
    return SuperMenuConfig.LABEL_COLORS[scheme] || SuperMenuConfig.LABEL_COLORS.vivid;
  }

  function setFeatureFlag(key, value) {
    if (!SuperMenuConfig.FEATURES.hasOwnProperty(key)) return;
    SuperMenuConfig.FEATURES[key] = value;
  }

  // ================== РАСКРАСКА МЕТОК ==================

  function colorizeLabelsInContainer(container, meta) {
    if (!container || !meta) return;

    try {
      var colors = getCurrentLabelColors();
      if (!colors) return;

      var typeEl = container.querySelector(
        ".drx-label-type, .card-type, .type-label"
      );
      var qualityEl = container.querySelector(
        ".drx-label-quality, .card-quality, .quality-label"
      );

      if (typeEl && meta.type) {
        var tColor = colors.TYPE[meta.type];
        if (tColor) typeEl.style.color = tColor;
      }

      if (qualityEl && meta.quality) {
        var q = meta.quality;
        if (/2160|4k/i.test(q)) q = "4K";
        else if (/1080/i.test(q)) q = "1080p";
        else if (/720/i.test(q)) q = "720p";
        else if (/cam/i.test(q)) q = "CAM";
        else if (/hdr/i.test(q)) q = "HDR";
        else if (/sd/i.test(q)) q = "SD";

        var qColor = colors.QUALITY[q];
        if (qColor) qualityEl.style.color = qColor;
      }
    } catch (e) {
      log("colorizeLabelsInContainer error:", e);
    }
  }

  // ================== РЕЙТИНГИ (КАРКАС) ==================

  function getRatingFromCache(source, key) {
    var cache = SuperMenuConfig.RATING_CACHE[source];
    return cache ? cache[key] : null;
  }

  function setRatingToCache(source, key, value) {
    var cache = SuperMenuConfig.RATING_CACHE[source];
    if (!cache) return;
    cache[key] = value;
  }

  function getKpRating(meta, cb) {
    try {
      if (!SuperMenuConfig.FEATURES.ratings_kp) {
        cb && cb(null);
        return;
      }
      var title = meta && meta.title ? String(meta.title) : "";
      var year = meta && meta.year ? Number(meta.year) : 0;
      var kpId = meta && meta.kpId ? String(meta.kpId) : null;

      if (!title && !kpId) {
        cb && cb(null);
        return;
      }

      var cacheKey = kpId || (title + "_" + (year || ""));
      var cached = getRatingFromCache("kp", cacheKey);
      if (cached) {
        cb && cb(cached);
        return;
      }

      cb && cb(null);
      return;
    } catch (e) {
      log("getKpRating error:", e);
      cb && cb(null);
    }
  }

  // ================== ОЗВУЧКИ (КАРКАС) ==================

  function rememberVoiceoverSelection(meta) {
    try {
      if (!SuperMenuConfig.FEATURES.voiceover_tracking) return;
      if (!meta || !meta.key) return;

      var key = String(meta.key);
      SuperMenuConfig.VOICEOVER.cache[key] = {
        voiceId: meta.voiceId || null,
        season: meta.season != null ? Number(meta.season) : null,
        episode: meta.episode != null ? Number(meta.episode) : null,
        updated: Date.now()
      };
    } catch (e) {
      log("rememberVoiceoverSelection error:", e);
    }
  }

  function checkVoiceoverUpdate(meta) {
    try {
      if (!SuperMenuConfig.FEATURES.voiceover_tracking) return null;
      if (!meta || !meta.key) return null;

      var key = String(meta.key);
      var stored = SuperMenuConfig.VOICEOVER.cache[key];
      if (!stored) return null;

      var availableVoiceId = meta.availableVoiceId || null;
      var latestSeason = meta.latestSeason != null ? Number(meta.latestSeason) : null;
      var latestEpisode = meta.latestEpisode != null ? Number(meta.latestEpisode) : null;

      if (!availableVoiceId || !stored.voiceId) return null;
      if (availableVoiceId !== stored.voiceId) return null;

      if (
        latestSeason != null && latestEpisode != null &&
        (latestSeason > stored.season ||
          (latestSeason === stored.season && latestEpisode > stored.episode))
      ) {
        return {
          hasUpdate: true,
          reason: "Новая серия в вашей озвучке",
          latestSeason: latestSeason,
          latestEpisode: latestEpisode
        };
      }

      return { hasUpdate: false };
    } catch (e) {
      log("checkVoiceoverUpdate error:", e);
      return null;
    }
  }

  // ================== НАСТРОЙКИ ПЛАГИНА В LAMPA ==================

  function registerSettingsComponent() {
    try {
      if (!Lampa.SettingsApi || !Lampa.SettingsApi.addComponent) return;

      Lampa.SettingsApi.addComponent({
        component: "drxaos_supermenu",
        name: "DrxSuperMenu",
        category: "more",
        icon: "<i class=\"icon icon-layers\"></i>",
        onRender: function (body) {
          var html = document.createElement("div");
          html.innerHTML = [
            "<div class=\"settings-param\">",
            "<div class=\"settings-param__name\">DrxSuperMenu</div>",
            "<div class=\"settings-param__descr\">Расширенное меню, рейтинги, метки и озвучки.</div>",
            "</div>"
          ].join("");
          body.appendChild(html);
        }
      });

      log("Settings component registered");
    } catch (e) {
      log("registerSettingsComponent error:", e);
    }
  }

  // ================== КНОПКА В ВЕРХНЕЙ ПАНЕЛИ ==================

  function registerTopBarButton() {
    try {
      if (!Lampa.Panel || !Lampa.Panel.add) return;

      Lampa.Panel.add({
        name: "drxsupermenu",
        title: "SuperMenu",
        icon:
          '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">' +
          '<circle cx="13" cy="13" r="11" fill="#111" stroke="#FFD700" stroke-width="2"/>' +
          '<path d="M9 9L17 17M17 9L9 17" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round"/>' +
          "</svg>",
        onClick: function () {
          try {
            if (Lampa.Noty) Lampa.Noty.show("DrxSuperMenu: кнопка нажата");
          } catch (e) {
            log("Panel button onClick error:", e);
          }
        }
      });

      log("Top bar button registered");
    } catch (e) {
      log("registerTopBarButton error:", e);
    }
  }

  // ================== ЭКСПОРТ API В window.DrxSuperMenu ==================

  function exportApi() {
    try {
      window.DrxSuperMenu = window.DrxSuperMenu || {};

      window.DrxSuperMenu.colorizeLabelsInContainer = colorizeLabelsInContainer;
      window.DrxSuperMenu.getKpRating = getKpRating;
      window.DrxSuperMenu.rememberVoiceoverSelection = rememberVoiceoverSelection;
      window.DrxSuperMenu.checkVoiceoverUpdate = checkVoiceoverUpdate;

      log("DrxSuperMenu API exported");
    } catch (e) {
      log("exportApi error:", e);
    }
  }

  // ================== ОСНОВНОЙ START ==================

  function start() {
    try {
      log("start()");
      if (typeof Lampa === "undefined") {
        log("Lampa is undefined in start, abort");
        return;
      }

      // Определяем платформу
      try {
        SuperMenuConfig.PLATFORM.isAndroid = Lampa.Platform.is("android");
        SuperMenuConfig.PLATFORM.isWebOS = Lampa.Platform.is("webos");
        SuperMenuConfig.PLATFORM.isTizen = Lampa.Platform.is("tizen");
        SuperMenuConfig.PLATFORM.isBrowser = Lampa.Platform.is("browser");
        SuperMenuConfig.PLATFORM.isTV =
          SuperMenuConfig.PLATFORM.isAndroid ||
          SuperMenuConfig.PLATFORM.isTizen ||
          SuperMenuConfig.PLATFORM.isWebOS ||
          Lampa.Platform.is("orsay") ||
          Lampa.Platform.is("netcast");
      } catch (e) {
        log("Platform detection error:", e);
      }

      registerSettingsComponent();
      registerTopBarButton();
      exportApi();

      log("start() finished");
    } catch (e) {
      log("start() error:", e);
    }
  }

  // ================== БУТСТРАП ПОД LAMPA/LAMPAC ==================

  function bootstrap() {
    try {
      if (typeof window.Lampa === "undefined") {
        log("bootstrap: Lampa undefined, wait...");
        return;
      }

      if (!Lampa.Listener || typeof Lampa.Listener.follow !== "function") {
        log("bootstrap: no Lampa.Listener.follow, start immediately");
        start();
        return;
      }

      if (window.appready) {
        log("bootstrap: appready=true, start now");
        start();
      } else {
        log("bootstrap: appready=false, listen app:ready");
        Lampa.Listener.follow("app", function (ev) {
          try {
            if (ev.type === "ready") {
              log("bootstrap: app:ready");
              start();
            }
          } catch (e) {
            log("bootstrap app:ready handler error:", e);
          }
        });
      }
    } catch (e) {
      log("bootstrap error:", e);
    }
  }

  // Ожидаем появления Lampa
  if (typeof window.Lampa !== "undefined") {
    bootstrap();
  } else {
    var waitTimer = setInterval(function () {
      if (typeof window.Lampa !== "undefined") {
        clearInterval(waitTimer);
        bootstrap();
      }
    }, 200);
  }
})();
