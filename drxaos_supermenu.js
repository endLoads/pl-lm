(function () {
  "use strict";

  // ============================================================================
  // КОНФИГУРАЦИЯ
  // ============================================================================

  var SuperMenuConfig = {
    DEBUG: true,
    PERFORMANCE: { DEBOUNCE_DELAY: 300, THROTTLE_LIMIT: 100 },
    PLATFORM: { isAndroid: typeof Lampa !== 'undefined' && Lampa.Platform.is('android') },
    RATINGS: {
      kpApiKey: 'твой_ключ_с_kinopoiskapiunofficial.tech', // ЗАМЕНИ НА СВОЙ КЛЮЧ
      kpApiUrl: 'https://kinopoiskapiunofficial.tech/api/v2.2/films'
    },
    RATING_CACHE: { tmdb: {}, imdb: {}, kp: {} },
    LABEL_COLORS: {
      vivid: {
        TYPE: { movie: '#FFD54F', tv: '#4CAF50', anime: '#E91E63' },
        QUALITY: { '4K': '#FF5722', '1080p': '#03A9F4', '720p': '#B0BEC5', SD: '#90A4AE', CAM: '#FF7043', HDR: '#FFC107' }
      },
      soft: {
        TYPE: { movie: '#FFE082', tv: '#A5D6A7', anime: '#F48FB1' },
        QUALITY: { '4K': '#FF9800', '1080p': '#81D4FA', '720p': '##C5E1A5', SD: '#BCAAA4', CAM: '#FFAB91', HDR: '#FFD54F' }
      }
    },
    LABEL_SCHEME: 'vivid',
    VOICEOVER: { enabled: false, cache: {} },
    FEATURES: {
      madness: false, madness_level: 'normal', ratings_tmdb: true, ratings_imdb: true,
      ratings_kp: false, label_colors: true, topbar_exit_menu: true,
      borderless_dark_theme: false, voiceover_tracking: false
    }
  };

  // ============================================================================
  // ЛОГИРОВАНИЕ
  // ============================================================================

  function log() { if (SuperMenuConfig.DEBUG) console.log.apply(console, ["[SuperMenu]"].concat(Array.prototype.slice.call(arguments))); }
  function logError(msg, err) { console.error("[SuperMenu ERROR] " + msg, err || ""); }

  // ============================================================================
  // УТИЛИТЫ (fetch, debounce)
  // ============================================================================

  function fetchJsonWithTimeout(url, options, timeoutMs) {
    return new Promise(function (resolve, reject) {
      var aborted = false;
      var timeout = setTimeout(function () {
        aborted = true;
        reject(new Error("Timeout " + (timeoutMs || 8000) + "ms"));
      }, timeoutMs || 8000);
      fetch(url, options).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      }).then(function (json) {
        if (!aborted) resolve(json);
      }).catch(function (err) {
        if (!aborted) reject(err);
      });
    });
  }

  var debounce = function (fn, delay) {
    var timeout;
    return function () {
      var ctx = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function () { fn.apply(ctx, args); }, delay || SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY);
    };
  };

  // ============================================================================
  // РЕЙТИНГИ
  // ============================================================================

  function getRatingFromCache(source, key) { return SuperMenuConfig.RATING_CACHE[source][key] || null; }
  function setRatingToCache(source, key, value) { SuperMenuConfig.RATING_CACHE[source][key] = value; }

  function getKpRating(meta, cb) {
    if (!SuperMenuConfig.FEATURES.ratings_kp) return cb && cb(null);
    try {
      var key = meta.kpId || meta.title;
      var cached = getRatingFromCache("kp", key);
      if (cached) return cb && cb(cached);
      if (!SuperMenuConfig.RATINGS.kpApiKey) return cb && cb(null);
      var url = SuperMenuConfig.RATINGS.kpApiUrl + "/search-by-keyword?keyword=" + encodeURIComponent(meta.title) + (meta.year ? "&yearFrom=" + meta.year + "&yearTo=" + meta.year : "");
      fetchJsonWithTimeout(url, { headers: { "X-API-KEY": SuperMenuConfig.RATINGS.kpApiKey } })
        .then(function (json) {
          var film = (json && (json.items || json.films) && (json.items || json.films)[0]) || null;
          if (!film) return cb && cb(null);
          var value = Number(film.ratingKinopoisk || film.ratingImdb || film.rating || 0);
          if (!isFinite(value)) return cb && cb(null);
          var result = { source: "kp", value: value };
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
  // UI-ФУНКЦИИ (тема, кнопка, метки, MADNESS)
  // ============================================================================

  var borderlessStyle = null;
  function injectBorderlessTheme(enabled) {
    if (!enabled) {
      if (borderlessStyle) {
        borderlessStyle.remove();
        borderlessStyle = null;
      }
      return;
    }
    if (borderlessStyle) return;
    try {
      var css = ".card, .card--collection { border: none !important; box-shadow: 0 14px 40px rgba(0,0,0,0.75) !important; background: radial-gradient(circle at top, #1B1F27 0%, #0B0F16 55%, #05070A 100%) !important; } .card__title, .card__age, .card__tags { text-shadow: 0 0 4px rgba(0,0,0,0.9) !important; }";
      borderlessStyle = document.createElement("style");
      borderlessStyle.textContent = css;
      document.head.appendChild(borderlessStyle);
      log("Borderless theme injected");
    } catch (e) { logError("injectBorderless", e); }
  }

  var topbarAdded = false;
  function registerTopBar() {
    if (!SuperMenuConfig.FEATURES.topbar_exit_menu || topbarAdded || !Lampa.Panel || typeof Lampa.Panel.add !== 'function') return;
    try {
      topbarAdded = true;
      Lampa.Panel.add({
        name: 'supermenu_exit', title: 'Меню',
        icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke="currentColor" stroke-width="1.5"/><path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z" stroke="currentColor" stroke-width="1.5"/></svg>',
        onSelect: function () { Lampa.Noty.show("Меню SuperMenu"); } // Замени на exitMenuOpen, если есть
      });
      log("Topbar button added");
    } catch (e) {
      logError("registerTopBar", e);
      topbarAdded = false;
    }
  }

  function colorizeLabelsInContainer(container, meta) {
    if (!SuperMenuConfig.FEATURES.label_colors || !container || !meta) return;
    try {
      var colors = SuperMenuConfig.LABEL_COLORS[SuperMenuConfig.LABEL_SCHEME] || SuperMenuConfig.LABEL_COLORS.vivid;
      var typeEl = container.querySelector(".view--category, .card__type, .type-label, [data-type]");
      var qualityEl = container.querySelector(".view--quality, .card__quality, .quality-label, [data-quality]");
      if (typeEl && meta.type && colors.TYPE[meta.type]) typeEl.style.color = colors.TYPE[meta.type];
      if (qualityEl && meta.quality) {
        var q = meta.quality.toUpperCase();
        var qKey = /2160|4k/i.test(q) ? "4K" : /1080/i.test(q) ? "1080p" : /720/i.test(q) ? "720p" : /cam/i.test(q) ? "CAM" : /hdr/i.test(q) ? "HDR" : "SD";
        if (colors.QUALITY[qKey]) qualityEl.style.color = colors.QUALITY[qKey];
      }
    } catch (e) { logError("colorizeLabels", e); }
  }
  
  function madnessDecorate(element) {
    if (!SuperMenuConfig.FEATURES.madness || SuperMenuConfig.FEATURES.madness_level === "off" || !element) return;
    try {
      if (!element.dataset.original) element.dataset.original = element.textContent.trim();
      var badge = '<span style="margin-left:0.35em;font-size:0.8em;opacity:0.8;">✦ MADNESS</span>';
      element.innerHTML = '<span class="base">' + element.dataset.original + '</span>' + (SuperMenuConfig.FEATURES.madness_level !== "off" ? badge : "");
      if (SuperMenuConfig.FEATURES.madness_level === "full") element.style.cssText = "letter-spacing:0.03em;text-shadow:0 0 6px rgba(0,0,0,0.85);";
    } catch (e) { logError("madnessDecorate", e); }
  }

  // ============================================================================
  // ХУКИ НА СОБЫТИЯ LAMPA
  // ============================================================================

  var hooksAdded = false;
  function initHooks() {
    if (hooksAdded) return;
    hooksAdded = true;
    try {
      // Full-карточка
      Lampa.Listener.follow('full', debounce(function (e) {
        if (e.type !== 'complite') return;
        var movie = e.data && (e.data.movie || e.data.card) || {};
        var meta = { title: movie.title || "", year: parseInt(movie.year || ""), tmdbId: movie.id, kpId: movie.kinopoisk_id, type: movie.name ? 'tv' : 'movie', quality: movie.quality || "" };
        var full = e.object.activity.render().find('.full-start, .full-info');
        if (!full || !full[0]) return;
        
        colorizeLabelsInContainer(full[0], meta);
        
        if (SuperMenuConfig.FEATURES.ratings_tmdb || SuperMenuConfig.FEATURES.ratings_imdb || SuperMenuConfig.FEATURES.ratings_kp) {
          var ratingsDiv = $('<div class="drx-ratings" style="display:flex;gap:0.5em;margin-top:0.5em;font-size:0.9em;opacity:0.9;"></div>');
          if (SuperMenuConfig.FEATURES.ratings_tmdb && movie.vote_average) {
            ratingsDiv.append($('<span style="color:#03A9F4;">TMDB: ' + movie.vote_average.toFixed(1) + '</span>'));
            setRatingToCache("tmdb", meta.tmdbId, { value: movie.vote_average });
          }
          getKpRating(meta, function (res) { if (res && res.value) ratingsDiv.append($('<span style="color:#FF5722;">КП: ' + res.value.toFixed(1) + '</span>')); });
          var insertPoint = full.find('.full-info__text, .full-start__body');
          if (insertPoint.length) insertPoint.append(ratingsDiv); else full.append(ratingsDiv);
        }
      }, 100));

      // Заголовки (для MADNESS)
      Lampa.Controller.listener.follow("toggle", function () {
        var titleEl = document.querySelector(".head__title, .simple-title, .section__title");
        if (titleEl) madnessDecorate(titleEl);
      });
      
      log("Hooks added (full, toggle)");
    } catch (e) { logError("initHooks", e); }
  }

  // ============================================================================
  // СИНХРОНИЗАЦИЯ И ОБРАБОТКА НАСТРОЕК
  // ============================================================================

  function applyUserSettings() {
    if (typeof Lampa === 'undefined' || !Lampa.Storage) return;
    try {
      Object.keys(SuperMenuConfig.FEATURES).forEach(function (key) {
        SuperMenuConfig.FEATURES[key] = Lampa.Storage.get('supermenu_' + key, SuperMenuConfig.FEATURES[key] + '') === 'true';
      });
      SuperMenuConfig.LABEL_SCHEME = Lampa.Storage.get('supermenu_label_scheme', SuperMenuConfig.LABEL_SCHEME);
      log('Config synced from Storage');
    } catch (err) { logError('applyUserSettings', err); }
  }

  function onSettingsChanged(e) {
    if (!e || !e.name || !e.name.startsWith('supermenu_')) return;
    log('Setting changed:', e.name, '→', e.value);
    applyUserSettings();
    
    // Применяем
    injectBorderlessTheme(SuperMenuConfig.FEATURES.borderless_dark_theme);
    registerTopBar();
    initHooks();
  }

  // ============================================================================
  // РЕГИСТРАЦИЯ НАСТРОЕК
  // ============================================================================

  function addSettings() {
    if (!Lampa || !Lampa.SettingsApi || Lampa.SettingsApi.__superMenuAdded) return;
    Lampa.SettingsApi.__superMenuAdded = true;
    
    var defaults = { 'supermenu_madness': 'false', 'supermenu_ratings_tmdb': 'true', /* ... */ };
    Object.keys(defaults).forEach(function(k) { if (Lampa.Storage.get(k) === undefined) Lampa.Storage.set(k, defaults[k]); });
    
    Lampa.SettingsApi.addComponent({ component: 'supermenu', name: 'SuperMenu', icon: '<svg>...</svg>' });

    var params = [
      { name: 'madness', type: 'trigger', def: false, title: 'MADNESS', desc: 'Эффекты' },
      // ... и т.д. для всех 11 параметров
    ];

    params.forEach(function (p) {
      try {
        Lampa.SettingsApi.addParam({
          component: 'supermenu',
          param: { name: 'supermenu_' + p.name, type: p.type, default: p.def },
          field: { name: p.title, description: p.desc },
          onChange: function (v) { onSettingsChanged({ name: 'supermenu_' + p.name, value: v }); }
        });
      } catch (e) { logError('Param ' + p.name, e); }
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
    
    setTimeout(addSettings, 200);
    setTimeout(function () {
      applyUserSettings();
      initHooks();
      onSettingsChanged({name: "supermenu_init"}); // Применяем всё сразу
    }, 500);

    if (Lampa.Storage && Lampa.Storage.listener) {
      Lampa.Storage.listener.follow('change', onSettingsChanged);
    }
  }

  if (typeof Lampa !== 'undefined' && Lampa.Listener && Lampa.Listener.follow) {
    Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') start(); });
    if (window.appready) start();
  } else {
    document.addEventListener('DOMContentLoaded', start);
  }

})();
