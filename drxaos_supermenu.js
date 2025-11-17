(function () {
  "use strict";

  // ============================================================================
  // ЛОГИРОВАНИЕ
  // ============================================================================

  function log() {
    if (!SuperMenuConfig.DEBUG) return;
    try {
      console.log.apply(console, ["[SuperMenu]"].concat(Array.prototype.slice.call(arguments)));
    } catch (e) {}
  }

  function logError(msg, err) {
    try {
      var errorMsg = "[SuperMenu ERROR] " + msg;
      if (err) {
        if (typeof err === "string") errorMsg += ": " + err;
        else if (err.message) errorMsg += ": " + err.message;
        else errorMsg += ": " + JSON.stringify(err);
      }
      console.error(errorMsg);
    } catch (e) {}
  }

  // ============================================================================
  // КОНФИГУРАЦИЯ
  // ============================================================================

  var SuperMenuConfig = {
    DEBUG: true,
    VERBOSE_LOGGING: false,
    PERFORMANCE: {
      DEBOUNCE_DELAY: 300,
      THROTTLE_LIMIT: 100,
      MUTATION_THROTTLE: 50
    },
    PLATFORM: {
      isAndroid: (typeof Lampa !== 'undefined' && Lampa.Platform) ? Lampa.Platform.is('android') : false,
      isWebOS: (typeof Lampa !== 'undefined' && Lampa.Platform) ? Lampa.Platform.is('webos') : false,
      isTizen: (typeof Lampa !== 'undefined' && Lampa.Platform) ? Lampa.Platform.is('tizen') : false,
      isBrowser: (typeof Lampa !== 'undefined' && Lampa.Platform) ? Lampa.Platform.is('browser') : false
    },
    RATINGS: {
      kpApiKey: '', // Замени на свой ключ с kinopoiskapiunofficial.tech
      kpApiUrl: 'https://kinopoiskapiunofficial.tech/api/v2.2/films'
    },
    RATING_CACHE: { tmdb: {}, imdb: {}, kp: {} }, // Кэш на сессию
    LABEL_COLORS: {
      vivid: {
        TYPE: { movie: '#FFD54F', tv: '#4CAF50', anime: '#E91E63' },
        QUALITY: { '4K': '#FF5722', '2160p': '#FF5722', '1080p': '#03A9F4', '720p': '#B0BEC5', SD: '#90A4AE', CAM: '#FF7043', HDR: '#FFC107' }
      },
      soft: {
        TYPE: { movie: '#FFE082', tv: '#A5D6A7', anime: '#F48FB1' },
        QUALITY: { '4K': '#FF9800', '2160p': '#FF9800', '1080p': '#81D4FA', '720p': '#C5E1A5', SD: '#BCAAA4', CAM: '#FFAB91', HDR: '#FFD54F' }
      }
    },
    LABEL_SCHEME: 'vivid',
    VOICEOVER: {
      enabled: false,
      cache: {} // { key: { voiceId, lastSeason, lastEpisode, title, updatedAt } }
    },
    FEATURES: {
      madness: false,
      madness_level: 'normal',
      ratings_tmdb: true,
      ratings_imdb: true,
      ratings_kp: false,
      label_colors: true,
      topbar_exit_menu: true,
      borderless_dark_theme: false,
      voiceover_tracking: false
    }
  };

  // Авто-адаптация perf для Android
  if (SuperMenuConfig.PLATFORM.isAndroid) {
    SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY = 500;
    SuperMenuConfig.PERFORMANCE.THROTTLE_LIMIT = 150;
    SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE = 80;
  }

  // ============================================================================
  // УТИЛИТЫ
  // ============================================================================

  function debounce(fn, delay) {
    var timeout;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        fn.apply(ctx, args);
      }, delay || SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY);
    };
  }

  function throttle(fn, limit) {
    var inThrottle;
    return function () {
      var ctx = this;
      var args = arguments;
      if (!inThrottle) {
        fn.apply(ctx, args);
        inThrottle = true;
        setTimeout(function () { inThrottle = false; }, limit || SuperMenuConfig.PERFORMANCE.THROTTLE_LIMIT);
      }
    };
  }

  function fetchJsonWithTimeout(url, options, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var aborted = false;
      var timeout = setTimeout(function () {
        aborted = true;
        reject(new Error("Timeout " + (timeoutMs || 8000) + "ms for " + url));
      }, timeoutMs || 8000);

      fetch(url, options || {})
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status + " for " + url);
          return res.json();
        })
        .then(function (json) {
          if (!aborted) {
            clearTimeout(timeout);
            resolve(json);
          }
        })
        .catch(function (err) {
          if (!aborted) {
            clearTimeout(timeout);
            reject(err);
          }
        });
    });
  }

  // ============================================================================
  // РЕЙТИНГИ
  // ============================================================================

  function getRatingFromCache(source, key) {
    var cache = SuperMenuConfig.RATING_CACHE[source];
    return cache && cache[key] ? cache[key] : null;
  }

  function setRatingToCache(source, key, value) {
    SuperMenuConfig.RATING_CACHE[source][key] = value;
  }

  function getTmdbRating(meta, cb) {
    if (!SuperMenuConfig.FEATURES.ratings_tmdb) {
      cb && cb(null);
      return;
    }
    try {
      var key = meta.tmdbId || meta.id || meta.title + "_" + (meta.year || "");
      var cached = getRatingFromCache("tmdb", key);
      if (cached) {
        cb && cb(cached);
        return;
      }
      cb && cb(null);
    } catch (e) {
      logError("getTmdbRating", e);
      cb && cb(null);
    }
  }

  function getImdbRating(meta, cb) {
    if (!SuperMenuConfig.FEATURES.ratings_imdb) {
      cb && cb(null);
      return;
    }
    try {
      var key = meta.imdbId || meta.id || meta.title + "_" + (meta.year || "");
      var cached = getRatingFromCache("imdb", key);
      if (cached) {
        cb && cb(cached);
        return;
      }
      // TODO: API для IMDb (OmdbApi или аналог; пока из кэша/null)
      cb && cb(null);
    } catch (e) {
      logError("getImdbRating", e);
      cb && cb(null);
    }
  }

  function getKpRating(meta, cb) {
    if (!SuperMenuConfig.FEATURES.ratings_kp) {
      cb && cb(null);
      return;
    }
    try {
      var key = meta.kpId || meta.id || meta.title + "_" + (meta.year || "");
      var cached = getRatingFromCache("kp", key);
      if (cached) {
        cb && cb(cached);
        return;
      }
      if (!SuperMenuConfig.RATINGS.kpApiKey) {
        log("KP API key not set");
        cb && cb(null);
        return;
      }
      var url = SuperMenuConfig.RATINGS.kpApiUrl + "/search-by-keyword?keyword=" +
                encodeURIComponent(meta.title) +
                (meta.year ? "&yearFrom=" + meta.year + "&yearTo=" + meta.year : "");
      fetchJsonWithTimeout(url, {
        headers: { "X-API-KEY": SuperMenuConfig.RATINGS.kpApiKey }
      }, 8000)
        .then(function (json) {
          var film = null;
          if (json && Array.isArray(json.items) && json.items.length) {
            film = json.items[0];
          } else if (json && Array.isArray(json.films) && json.films.length) {
            film = json.films[0];
          }
          if (!film) {
            cb && cb(null);
            return;
          }
          var value = Number(film.ratingKinopoisk || film.ratingImdb || film.rating || 0);
          var votes = Number(film.ratingKinopoiskVoteCount || film.ratingImdbVoteCount || film.votes || 0);
          if (!isFinite(value)) {
            cb && cb(null);
            return;
          }
          var result = { source: "kp", value: value, votes: isFinite(votes) ? votes : undefined };
          setRatingToCache("kp", key, result);
          cb && cb(result);
        })
        .catch(function (err) {
          logError("getKpRating fetch", err);
          cb && cb(null);
        });
    } catch (e) {
      logError("getKpRating", e);
      cb && cb(null);
    }
  }

  // ============================================================================
  // МЕНЮ ВЫХОДА (адаптировано из etalon menus)
  // ============================================================================

  var ExitMenuConfig = {
    items: [
      { name: "exit", default: "2", title: "Закрыть приложение" },
      { name: "reboot", default: "2", title: "Перезагрузить" },
      { name: "switch_server", default: "2", title: "Сменить сервер" },
      { name: "clear_cache", default: "2", title: "Очистить кэш" },
      { name: "youtube", default: "1", title: "YouTube" },
      { name: "rutube", default: "1", title: "RuTube" },
      { name: "drm_play", default: "1", title: "DRM Play" },
      { name: "twitch", default: "1", title: "Twitch" },
      { name: "fork_player", default: "1", title: "ForkPlayer" },
      { name: "speedtest", default: "1", title: "Speed Test" }
    ]
  };

  function exitMenuEnsureDefaults() {
    ExitMenuConfig.items.forEach(function (item) {
      if (!localStorage.getItem(item.name)) {
        localStorage.setItem(item.name, item.default);
      }
    });
  }

  function exitMenuAction(name) {
    switch (name) {
      case "exit":
        if (Lampa.Platform.is("android")) Lampa.Android.exit();
        else if (Lampa.Platform.is("tizen")) tizen.application.getCurrentApplication().exit();
        else if (Lampa.Platform.is("webos")) window.close();
        else if (Lampa.Platform.is("browser")) window.close();
        else location.href = "exit://exit";
        break;
      case "reboot":
        location.reload();
        break;
      case "switch_server":
        var proto = location.protocol === "https:" ? "https://" : "http://";
        Lampa.Input.edit({ title: "Сервер", value: "", free: true }, function (value) {
          if (value && value.trim()) window.location.href = proto + value.trim();
        });
        break;
      case "clear_cache":
        Lampa.Storage.clear();
        Lampa.Noty.show("Кэш очищен");
        break;
      case "youtube":
        window.location.href = "https://youtube.com/tv";
        break;
      case "rutube":
        window.location.href = "https://rutube.ru/tv-release/rutube.server-22.0.0/webos/";
        break;
      case "drm_play":
        window.location.href = "https://ott.drm-play.com";
        break;
      case "twitch":
        window.location.href = "https://webos.tv.twitch.tv";
        break;
      case "fork_player":
        window.location.href = "http://browser.appfxml.com";
        break;
      case "speedtest":
        var wrapper = $('<div style="text-align:right;"><div style="min-height:360px;"><iframe id="speedtest-iframe" width="100%" height="100%" frameborder="0"></iframe></div></div>');
        Lampa.Modal.open({
          title: "", html: wrapper, size: "medium", mask: true,
          onBack: function () { Lampa.Modal.close(); Lampa.Controller.toggle("content"); }
        });
        setTimeout(function () { $("#speedtest-iframe").attr("src", "http://speedtest.vokino.tv/?R=3"); }, 100);
        break;
    }
  }

  function exitMenuOpen() {
    try {
      exitMenuEnsureDefaults();
      var items = ExitMenuConfig.items
        .filter(function (item) { return localStorage.getItem(item.name) !== "1"; })
        .map(function (item) {
          var icon = exitMenuIconHtml(item.name); // Функция иконок из etalon (упрощённо)
          return { id: item.name, title: icon || item.title };
        });
      if (!items.length) {
        Lampa.Noty.show("Все пункты скрыты");
        return;
      }
      Lampa.Select.show({
        title: "Меню выхода",
        items: items,
        onBack: function () { Lampa.Controller.toggle("content"); },
        onSelect: function (a) { exitMenuAction(a.id); }
      });
    } catch (e) {
      logError("exitMenuOpen", e);
    }
  }

  function exitMenuIconHtml(id) {
    // Упрощённые SVG-иконки из etalon (только текст для краткости; добавь SVG если нужно)
    var icons = {
      exit: "🚪", reboot: "🔄", switch_server: "🌐", clear_cache: "🗑️",
      youtube: "📺", rutube: "🎥", drm_play: "🎬", twitch: "📡",
      fork_player: "🔀", speedtest: "⚡"
    };
    return icons[id] ? icons[id] + " " + ExitMenuConfig.items.find(i => i.name === id).title : id;
  }

  // ============================================================================
  // ЦВЕТНЫЕ МЕТКИ
  // ============================================================================

  function getCurrentLabelColors() {
    return SuperMenuConfig.LABEL_COLORS[SuperMenuConfig.LABEL_SCHEME] || SuperMenuConfig.LABEL_COLORS.vivid;
  }

  function colorizeLabelsInContainer(container, meta) {
    if (!SuperMenuConfig.FEATURES.label_colors || !container || !meta) return;
    try {
      var colors = getCurrentLabelColors();
      var typeEl = container.querySelector(".view--category, .card__type, .type-label") || container.querySelector("[data-type]");
      var qualityEl = container.querySelector(".view--quality, .card__quality, .quality-label") || container.querySelector("[data-quality]");
      if (typeEl && meta.type) {
        var tColor = colors.TYPE[meta.type] || colors.TYPE.movie;
        typeEl.style.color = tColor;
      }
      if (qualityEl && meta.quality) {
        var q = meta.quality.toUpperCase();
        if (/2160|4k/i.test(q)) q = "4K";
        else if (/1080/i.test(q)) q = "1080p";
        else if (/720/i.test(q)) q = "720p";
        else if (/cam/i.test(q)) q = "CAM";
        else if (/hdr/i.test(q)) q = "HDR";
        else q = "SD";
        var qColor = colors.QUALITY[q];
        if (qColor) qualityEl.style.color = qColor;
      }
    } catch (e) {
      logError("colorizeLabels", e);
    }
  }

  // ============================================================================
  // MADNESS РЕЖИМ
  // ============================================================================

  function madnessDecorateSectionTitle(element) {
    if (!SuperMenuConfig.FEATURES.madness || SuperMenuConfig.FEATURES.madness_level === "off" || !element) return;
    try {
      if (!element.dataset.drxOriginal) element.dataset.drxOriginal = element.textContent.trim();
      var original = element.dataset.drxOriginal;
      element.innerHTML = '<span class="drx-base">' + original + '</span>';
      if (SuperMenuConfig.FEATURES.madness_level !== "off") {
        var badge = document.createElement("span");
        badge.className = "drx-madness";
        badge.textContent = " ✦ MADNESS";
        badge.style.cssText = "margin-left:0.35em;font-size:0.8em;opacity:0.8;";
        element.appendChild(badge);
      }
      if (SuperMenuConfig.FEATURES.madness_level === "full") {
        element.style.cssText = "letter-spacing:0.03em;text-shadow:0 0 6px rgba(0,0,0,0.85);";
      }
    } catch (e) {
      logError("madnessDecorate", e);
    }
  }

  var madnessHookAdded = false;
  function initMadnessHooks() {
    if (madnessHookAdded || !SuperMenuConfig.FEATURES.madness) return;
    madnessHookAdded = true;
    try {
      if (Lampa.Controller && Lampa.Controller.listener && Lampa.Controller.listener.follow) {
        Lampa.Controller.listener.follow("toggle", function () {
          var titleEl = document.querySelector(".head__title, .simple-title, .section__title");
          if (titleEl) madnessDecorateSectionTitle(titleEl);
        });
      }
      log("Madness hooks added");
    } catch (e) {
      logError("initMadnessHooks", e);
    }
  }

  // ============================================================================
  // ТЁМНАЯ ТЕМА БЕЗ РАМок
  // ============================================================================

  var borderlessStyle = null;
  function injectBorderlessTheme(enabled) {
    if (!enabled) {
      if (borderlessStyle && borderlessStyle.parentNode) {
        borderlessStyle.parentNode.removeChild(borderlessStyle);
        borderlessStyle = null;
      }
      return;
    }
    if (borderlessStyle) return;
    try {
      var css = 
        "body { background: #05070A !important; color: #ECEFF4 !important; }" +
        ".card, .card--collection { border: none !important; box-shadow: 0 14px 40px rgba(0,0,0,0.75) !important; background: radial-gradient(circle at top, #1B1F27 0%, #0B0F16 55%, #05070A 100%) !important; }" +
        ".card__title, .card__age, .card__tags { text-shadow: 0 0 4px rgba(0,0,0,0.9) !important; }" +
        ".head__title, .section__title { background: transparent !important; color: #ECEFF4 !important; text-shadow: 0 0 8px rgba(0,0,0,0.9) !important; }";
      borderlessStyle = document.createElement("style");
      borderlessStyle.className = "drx-borderless";
      borderlessStyle.appendChild(document.createTextNode(css));
      document.head.appendChild(borderlessStyle);
      log("Borderless theme injected");
    } catch (e) {
      logError("injectBorderless", e);
    }
  }

  // ============================================================================
  // КНОПКА ТОП-БАР
  // ============================================================================

  var topbarAdded = false;
  function registerTopBar() {
    if (!SuperMenuConfig.FEATURES.topbar_exit_menu || topbarAdded || !Lampa.Panel || typeof Lampa.Panel.add !== 'function') return;
    try {
      topbarAdded = true;
      Lampa.Panel.add({
        name: 'supermenu_exit',
        title: 'Меню выхода',
        icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke="currentColor" stroke-width="1.5"/><path d="M22 12C22 16.714 20.536 20.536 16.714 20.536C12.892 20.536 9.171 20.536 5.357 20.536C1.543 20.536 -0.000999999 20.536 3.464 20.536" stroke="currentColor" stroke-width="1.5"/></svg>',
        onSelect: exitMenuOpen
      });
      log("Topbar button added");
    } catch (e) {
      logError("registerTopBar", e);
      topbarAdded = false;
    }
  }

  // ============================================================================
  // VOICEOVER ТРЕКИНГ (beta)
  // ============================================================================

  function getVoiceoverKey(meta) {
    return meta.title + "_" + (meta.season || "") + "_" + (meta.episode || "");
  }

  function rememberVoiceover(meta) {
    if (!SuperMenuConfig.VOICEOVER.enabled || !meta || !meta.voiceId) return;
    try {
      var key = getVoiceoverKey(meta);
      SuperMenuConfig.VOICEOVER.cache[key] = {
        voiceId: meta.voiceId,
        lastSeason: meta.season || 0,
        lastEpisode: meta.episode || 0,
        title: meta.title || "",
        updatedAt: Date.now()
      };
      // Сохраняем в localStorage для персистентности
      localStorage.setItem("drx_voiceover_" + key, JSON.stringify(SuperMenuConfig.VOICEOVER.cache[key]));
    } catch (e) {
      logError("rememberVoiceover", e);
    }
  }

  var voiceoverHookAdded = false;
  function initVoiceoverHooks() {
    if (voiceoverHookAdded || !SuperMenuConfig.VOICEOVER.enabled) return;
    voiceoverHookAdded = true;
    try {
      // Хук на playlist (когда выбирают озвучку)
      if (Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('playlist', function (e) {
          if (e.type === 'select' && e.data && e.data.voiceover) {
            rememberVoiceover({ title: e.data.title, season: e.data.season, episode: e.data.episode, voiceId: e.data.voiceover.id });
          }
        });
      }
      // Загрузка кэша из localStorage
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith("drx_voiceover_")) {
          try {
            SuperMenuConfig.VOICEOVER.cache[key.replace("drx_voiceover_", "")] = JSON.parse(localStorage.getItem(key));
          } catch (e) {}
        }
      }
      log("Voiceover hooks added");
    } catch (e) {
      logError("initVoiceoverHooks", e);
    }
  }

  // ============================================================================
  // ХУКИ НА КАРТОЧКИ (full event)
  // ============================================================================

  try {
    if (Lampa && Lampa.Listener && Lampa.Listener.follow) {
      Lampa.Listener.follow('full', debounce(function (e) {
        if (e.type !== 'complite') return;
        var movie = e.data && (e.data.movie || e.data.card || e.data.item) || {};
        var meta = {
          title: movie.title || "",
          year: parseInt(movie.year || movie.release_date || ""),
          tmdbId: movie.id,
          imdbId: movie.imdb_id,
          kpId: movie.kinopoisk_id,
          type: movie.name ? 'tv' : 'movie',
          quality: movie.quality || ""
        };
        var full = e.object && e.object.activity && e.object.activity.render && e.object.activity.render().find('.full-start, .full-info');
        if (!full || !full[0]) return;

        // Метки
        colorizeLabelsInContainer(full[0], meta);

        // Рейтинги
        if (SuperMenuConfig.FEATURES.ratings_tmdb || SuperMenuConfig.FEATURES.ratings_imdb || SuperMenuConfig.FEATURES.ratings_kp) {
          var ratingsDiv = document.createElement('div');
          ratingsDiv.className = 'drx-ratings';
          ratingsDiv.style.cssText = 'display:flex;gap:0.5em;margin-top:0.5em;font-size:0.9em;opacity:0.9;';

          // TMDB
          if (SuperMenuConfig.FEATURES.ratings_tmdb && typeof movie.vote_average !== 'undefined') {
            var tmdbSpan = document.createElement('span');
            tmdbSpan.textContent = 'TMDB: ' + (movie.vote_average || 0).toFixed(1);
            tmdbSpan.style.color = '#03A9F4';
            ratingsDiv.appendChild(tmdbSpan);
            setRatingToCache("tmdb", meta.tmdbId, { source: "tmdb", value: movie.vote_average });
          }

          // IMDb (асинх)
          getImdbRating(meta, function (res) {
            if (res && res.value) {
              var imdbSpan = document.createElement('span');
              imdbSpan.textContent = 'IMDb: ' + res.value.toFixed(1);
              imdbSpan.style.color = '#FFD700';
              ratingsDiv.appendChild(imdbSpan);
            }
          });

          // KP (асинх)
          getKpRating(meta, function (res) {
            if (res && res.value) {
              var kpSpan = document.createElement('span');
              kpSpan.textContent = 'КП: ' + res.value.toFixed(1);
              kpSpan.style.color = '#FF5722';
              ratingsDiv.appendChild(kpSpan);
            }
          });

          // Вставка
          var insert = full.find('.full-info__text, .full-start__body');
          if (insert && insert[0]) insert[0].appendChild(ratingsDiv);
          else full.append(ratingsDiv);
        }
      }, 100));
      log("Full hooks added");
    }
  } catch (e) {
    logError("Full listener setup", e);
  }

  // ============================================================================
  // СИНХРОНИЗАЦИЯ НАСТРОЕК
  // ============================================================================

  function applyUserSettings() {
    if (typeof Lampa === 'undefined' || !Lampa.Storage) return;
    try {
      SuperMenuConfig.FEATURES.madness = Lampa.Storage.get('supermenu_madness', 'false') === 'true';
      SuperMenuConfig.FEATURES.madness_level = Lampa.Storage.get('supermenu_madness_level', 'normal');
      SuperMenuConfig.FEATURES.ratings_tmdb = Lampa.Storage.get('supermenu_ratings_tmdb', 'true') === 'true';
      SuperMenuConfig.FEATURES.ratings_imdb = Lampa.Storage.get('supermenu_ratings_imdb', 'true') === 'true';
      SuperMenuConfig.FEATURES.ratings_kp = Lampa.Storage.get('supermenu_ratings_kp', 'false') === 'true';
      SuperMenuConfig.FEATURES.label_colors = Lampa.Storage.get('supermenu_label_colors', 'true') === 'true';
      SuperMenuConfig.LABEL_SCHEME = Lampa.Storage.get('supermenu_label_scheme', 'vivid');
      SuperMenuConfig.FEATURES.topbar_exit_menu = Lampa.Storage.get('supermenu_topbar_exit', 'true') === 'true';
      SuperMenuConfig.FEATURES.borderless_dark_theme = Lampa.Storage.get('supermenu_borderless_dark', 'false') === 'true';
      SuperMenuConfig.FEATURES.voiceover_tracking = Lampa.Storage.get('supermenu_voiceover_tracking', 'false') === 'true';
      SuperMenuConfig.VOICEOVER.enabled = SuperMenuConfig.FEATURES.voiceover_tracking;

      // Perf mode
      var perfMode = Lampa.Storage.get('supermenu_perf_mode', SuperMenuConfig.PLATFORM.isAndroid ? 'android_perf' : 'normal');
      if (perfMode === 'android_perf') {
        SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY = 500;
        SuperMenuConfig.PERFORMANCE.THROTTLE_LIMIT = 150;
        SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE = 80;
      } else {
        SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY = 300;
        SuperMenuConfig.PERFORMANCE.THROTTLE_LIMIT = 100;
        SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE = 50;
      }

      log('Config synced from Storage (perf: ' + perfMode + ')');
    } catch (err) {
      logError('applyUserSettings', err);
    }
  }

  // ============================================================================
  // ГЛОБАЛЬНЫЙ ХЕНДЛЕР ИЗМЕНЕНИЙ
  // ============================================================================

  function onSettingsChanged(e) {
    if (!e || !e.name || !e.name.startsWith('supermenu_')) return;
    try {
      log('Setting changed:', e.name, '→', e.value);
      applyUserSettings();

      // Применяем фичи
      injectBorderlessTheme(SuperMenuConfig.FEATURES.borderless_dark_theme);
      registerTopBar();
      initMadnessHooks();
      initVoiceoverHooks();
      if (SuperMenuConfig.FEATURES.label_colors) {
        colorizeLabelsInContainer(document.body, {});
      }
    } catch (err) {
      logError('onSettingsChanged', err);
    }
  }

  // ============================================================================
  // РЕГИСТРАЦИЯ НАСТРОЕК
  // ============================================================================

  function addSettings() {
    if (!Lampa || !Lampa.SettingsApi || typeof Lampa.SettingsApi.addComponent !== 'function' || Lampa.SettingsApi.__superMenuAdded) {
      return;
    }
    Lampa.SettingsApi.__superMenuAdded = true;

    // Дефолты
    var defaults = {
      'supermenu_madness': 'false', 'supermenu_madness_level': 'normal',
      'supermenu_perf_mode': SuperMenuConfig.PLATFORM.isAndroid ? 'android_perf' : 'normal',
      'supermenu_ratings_tmdb': 'true', 'supermenu_ratings_imdb': 'true', 'supermenu_ratings_kp': 'false',
      'supermenu_label_colors': 'true', 'supermenu_label_scheme': 'vivid',
      'supermenu_topbar_exit': 'true', 'supermenu_borderless_dark': 'false',
      'supermenu_voiceover_tracking': 'false'
    };
    Object.keys(defaults).forEach(function (key) {
      if (Lampa.Storage.get(key) === undefined) Lampa.Storage.set(key, defaults[key]);
    });

    Lampa.SettingsApi.addComponent({
      component: 'supermenu', name: 'SuperMenu',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>'
    });

    // Параметры (с onChange)
    var params = [
      { name: 'supermenu_madness', type: 'trigger', default: false, title: 'MADNESS режим', desc: 'Визуальные эффекты', onCh: function(v) { SuperMenuConfig.FEATURES.madness = !!v; onSettingsChanged({name: 'supermenu_madness', value: v}); } },
      { name: 'supermenu_madness_level', type: 'select', values: {off: 'Выкл', normal: 'Станд', full: 'Полн'}, default: 'normal', title: 'Уровень MADNESS', desc: 'Интенсивность', onCh: function(v) { SuperMenuConfig.FEATURES.madness_level = v; onSettingsChanged({name: 'supermenu_madness_level', value: v}); } },
      { name: 'supermenu_perf_mode', type: 'select', values: {normal: 'Обыч', android_perf: 'Щадящ (Android)'}, default: defaults['supermenu_perf_mode'], title: 'Производительность', desc: 'Нагрузка', onCh: function(v) { onSettingsChanged({name: 'supermenu_perf_mode', value: v}); } },
      { name: 'supermenu_ratings_tmdb', type: 'trigger', default: true, title: 'Рейтинг TMDB', desc: 'На карточках', onCh: function(v) { SuperMenuConfig.FEATURES.ratings_tmdb = !!v; onSettingsChanged({name: 'supermenu_ratings_tmdb', value: v}); } },
      { name: 'supermenu_ratings_imdb', type: 'trigger', default: true, title: 'Рейтинг IMDb', desc: 'На карточках', onCh: function(v) { SuperMenuConfig.FEATURES.ratings_imdb = !!v; onSettingsChanged({name: 'supermenu_ratings_imdb', value: v}); } },
      { name: 'supermenu_ratings_kp', type: 'trigger', default: false, title: 'Рейтинг КП', desc: 'На карточках', onCh: function(v) { SuperMenuConfig.FEATURES.ratings_kp = !!v; onSettingsChanged({name: 'supermenu_ratings_kp', value: v}); } },
      { name: 'supermenu_label_colors', type: 'trigger', default: true, title: 'Цветные метки', desc: 'Качество/тип', onCh: function(v) { SuperMenuConfig.FEATURES.label_colors = !!v; onSettingsChanged({name: 'supermenu_label_colors', value: v}); } },
      { name: 'supermenu_label_scheme', type: 'select', values: {vivid: 'Яркая', soft: 'Мягкая'}, default: 'vivid', title: 'Схема цветов', desc: 'Палитра', onCh: function(v) { SuperMenuConfig.LABEL_SCHEME = v; onSettingsChanged({name: 'supermenu_label_scheme', value: v}); } },
      { name: 'supermenu_topbar_exit', type: 'trigger', default: true, title: 'Меню выхода в панели', desc: 'Кнопка сверху', onCh: function(v) { SuperMenuConfig.FEATURES.topbar_exit_menu = !!v; onSettingsChanged({name: 'supermenu_topbar_exit', value: v}); } },
      { name: 'supermenu_borderless_dark', type: 'trigger', default: false, title: 'Тёмная тема без рамок', desc: 'Сглаженные карточки', onCh: function(v) { SuperMenuConfig.FEATURES.borderless_dark_theme = !!v; onSettingsChanged({name: 'supermenu_borderless_dark', value: v}); } },
      { name: 'supermenu_voiceover_tracking', type: 'trigger', default: false, title: 'Трекинг озвучек (beta)', desc: 'Запоминать выбор', onCh: function(v) { SuperMenuConfig.FEATURES.voiceover_tracking = !!v; onSettingsChanged({name: 'supermenu_voiceover_tracking', value: v}); } }
    ];

    params.forEach(function (p) {
      try {
        Lampa.SettingsApi.addParam({
          component: 'supermenu',
          param: { name: p.name, type: p.type, default: p.default, values: p.values },
          field: { name: p.title, description: p.desc },
          onChange: p.onCh
        });
        log('Param added:', p.name);
      } catch (e) {
        logError('Param ' + p.name, e);
      }
    });

    log("Settings registered");
  }

  // ============================================================================
  // ИНИЦИАЛИЗАЦИЯ
  // ============================================================================

  var inited = false;
  function start() {
    if (inited) return;
    inited = true;
    log("Starting SuperMenu");

    // Настройки
    setTimeout(addSettings, 200);

    // Применение фич
    setTimeout(function () {
      applyUserSettings();
      injectBorderlessTheme(SuperMenuConfig.FEATURES.borderless_dark_theme);
      registerTopBar();
      initMadnessHooks();
      initVoiceoverHooks();
      if (SuperMenuConfig.FEATURES.label_colors) colorizeLabelsInContainer(document.body, {});
      log("Features applied");
    }, 500);

    // Listener изменений
    if (Lampa.Storage && Lampa.Storage.listener) {
      Lampa.Storage.listener.follow('change', onSettingsChanged);
    }
  }

  // Запуск
  if (typeof Lampa !== 'undefined' && Lampa.Listener && Lampa.Listener.follow) {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') start();
    });
    if (window.appready) start();
  } else {
    document.addEventListener('DOMContentLoaded', start);
  }

})();
