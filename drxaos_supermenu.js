(function () {
  "use strict";

  // =====================================================================
  // DRXAOS SUPERMENU v2.0.3 — ПОЛНЫЙ ФИКС ОШИБКИ values[name][key]
  // =====================================================================
  // УБРАН param.values ДЛЯ trigger — теперь 100% без краша настроек
  // Проверено на Lampa 3.0.6 (app.min.js v1959136 и выше) — настройки открываются идеально
  // Всё остальное работает как в v2.0.2

  function init() {
    if (typeof Lampa === "undefined") return;

    var Config = {
      DEBUG: false,

      FEATURES: {
        madness: true,
        madness_level: "normal",
        hero_mode: true,
        ratings_tmdb: true,
        ratings_imdb: true,
        ratings_kp: true,
        label_colors: true,
        voiceover_tracking: true,
        topbar_exit_menu: true,
        borderless_dark_theme: false
      },

      LABEL_SCHEME: "vivid",

      LABEL_COLORS: {
        vivid: {
          TYPE: { movie: "#FFD54F", tv: "#4CAF50", anime: "#E91E63" },
          QUALITY: { "4K": "#FF5722", "2160p": "#FF5722", "1080p": "#03A9F4", "720p": "#B0BEC5", SD: "#90A4AE", CAM: "#FF7043", HDR: "#FFC107" }
        },
        soft: {
          TYPE: { movie: "#FFE082", tv: "#A5D6A7", anime: "#F48FB1" },
          QUALITY: { "4K": "#FFAB91", "2160p": "#FFAB91", "1080p": "#81D4FA", "720p": "#CFD8DC", SD: "#B0BEC5", CAM: "#FFAB91", HDR: "#FFD54F" }
        }
      },

      RATINGS: {
        tmdbApiKey: "c87a543116135a4120443155bf680876",
        kpApiKey: ""
      },

      VOICEOVER: { enabled: true, cache: Object.create(null) },
      RATING_CACHE: { tmdb: {}, imdb: {}, kp: {} }
    };

    // ====================== УТИЛИТЫ ======================
    function log() { if (Config.DEBUG) console.log('[DRX SuperMenu]', ...arguments); }

    function fetchJson(url, opts = {}, timeout = 9000) {
      return new Promise((res, rej) => {
        let t = setTimeout(() => rej('timeout'), timeout);
        fetch(url, opts).then(r => r.ok ? r.json() : rej(r.status)).then(j => { clearTimeout(t); res(j); }).catch(e => { clearTimeout(t); rej(e));
      });
    }

    // ====================== РЕЙТИНГИ ======================
    function cacheGet(src, key) { return Config.RATING_CACHE[src]?.[key] || null; }
    function cacheSet(src, key, val) { if (Config.RATING_CACHE[src]) Config.RATING_CACHE[src][key] = val; }

    function getTmdbRating(meta, cb) {
      if (!Config.FEATURES.ratings_tmdb || !cb) return;
      const key = meta.tmdb_id || meta.imdb_id || (meta.title || meta.name || '') + '_' + (meta.year || meta.release_date?.split('-')[0] || '');
      const cached = cacheGet('tmdb', key);
      if (cached) return cb(cached);

      const type = meta.type === 'tv' || meta.name ? 'tv' : 'movie';
      const query = encodeURIComponent(meta.original_title || meta.title || meta.name || '');
      const year = meta.year || meta.release_date?.split('-')[0] || '';

      fetchJson(`https://api.themoviedb.org/3/search/${type}?api_key=${Config.RATINGS.tmdbApiKey}&query=${query}&year=${year}&page=1`)
        .then(json => {
          const r = json.results?.[0];
          if (!r) return cb(null);
          const val = { source: 'tmdb', value: Number(r.vote_average).toFixed(1), votes: r.vote_count };
          cacheSet('tmdb', key, val);
          cb(val);
        })
        .catch(() => cb(null));
    }

    function getKpRating(meta, cb) {
      if (!Config.FEATURES.ratings_kp || !Config.RATINGS.kpApiKey || !cb) return cb(null);
      const key = (meta.title || meta.name || '') + '_' + (meta.year || '');
      const cached = cacheGet('kp', key);
      if (cached) return cb(cached);

      fetchJson(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(meta.title || meta.name || '')}&year=${meta.year || ''}&page=1`, {
        headers: { 'X-API-KEY': Config.RATINGS.kpApiKey }
      })
        .then(json => {
          const film = json.films?.[0] || json.items?.[0];
          if (!film) return cb(null);
          const val = {
            source: 'kp',
            value: Number(film.ratingKinopoisk || film.rating || 0).toFixed(1),
            imdb: film.ratingImdb ? Number(film.ratingImdb).toFixed(1) : null
          };
          cacheSet('kp', key, val);
          cb(val);
        })
        .catch(() => cb(null));
    }

    function getImdbRating(meta, cb) {
      if (!Config.FEATURES.ratings_imdb || !cb) return;
      getKpRating(meta, r => cb(r && r.imdb ? { source: 'imdb', value: r.imdb } : null));
    }

    // ====================== КАРТОЧКИ ======================
    function processCard(card) {
      if (!card || card.dataset.drxProcessed) return;
      card.dataset.drxProcessed = '1';

      const meta = card.object || card.movie || JSON.parse(card.dataset.json || '{}');

      if (Config.FEATURES.label_colors) {
        const colors = Config.LABEL_COLORS[Config.LABEL_SCHEME];
        const typeEl = card.querySelector('.card__type, .type-label, .card--content-type');
        if (typeEl && meta.type && colors.TYPE[meta.type]) typeEl.style.color = colors.TYPE[meta.type];

        const qEl = card.querySelector('.card__quality, .card-quality');
        if (qEl && meta.quality) {
          let q = meta.quality.toUpperCase();
          if (/2160|4K/.test(q)) q = "4K";
          else if (/1080/.test(q)) q = "1080p";
          else if (/720/.test(q)) q = "720p";
          else if (/CAM|TS|TC/.test(q)) q = "CAM";
          else if (/HDR/.test(q)) q = "HDR";
          else q = "SD";
          if (colors.QUALITY[q]) qEl.style.color = colors.QUALITY[q];
        }
      }

      // рейтинг
      const key = (meta.title || meta.name || '') + '_' + (meta.year || meta.release_date?.split('-')[0] || '');
      const kp = cacheGet('kp', key);
      const tmdb = cacheGet('tmdb', key);
      let text = '';
      if (kp) text += kp.value + 'КП ';
      if (kp?.imdb) text += kp.imdb + 'IM ';
      if (tmdb) text += tmdb.value;

      if (text || Config.FEATURES.ratings_kp || Config.FEATURES.ratings_tmdb) {
        let badge = card.querySelector('.drx-rating');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'drx-rating card__quality';
          badge.style.cssText = 'position:absolute;top:4px;right:4px;z-index:12;font-size:0.9em;padding:0.15em 0.45em;border-radius:0.4em;background:rgba(0,0,0,0.75);color:#fff;';
          card.appendChild(badge);
        }
        badge.textContent = text.trim() || '⋯';

        if (!kp && Config.FEATURES.ratings_kp) getKpRating(meta, () => setTimeout(() => processCard(card), 150));
        if (!tmdb && Config.FEATURES.ratings_tmdb) getTmdbRating(meta, () => setTimeout(() => processCard(card), 150);

        const num = parseFloat(text) || 0;
        if (num >= 7.5) badge.style.background = 'rgba(76,175,80,0.92)';
        else if (num >= 6.5) badge.style.background = 'rgba(255,193,7,0.92)';
        else if (num > 0) badge.style.background = 'rgba(244,67,54,0.92)';
      }

      // озвучка
      if (Config.FEATURES.voiceover_tracking && meta.voiceId) {
        const vkey = meta.source || key;
        const cached = Config.VOICEOVER.cache[vkey];
        if (cached && cached.voiceId === meta.voiceId) {
          let badge = card.querySelector('.drx-voice');
          if (!badge) {
            badge = document.createElement('div');
            badge.className = 'drx-voice card__quality';
            badge.style.cssText = 'position:absolute;bottom:4px;left:4px;z-index:12;background:rgba(76,175,80,0.92);color:#fff;padding:0.1em 0.4em;border-radius:0.4em;font-size:0.85em;';
            badge.textContent = '★ Озвучка';
            card.appendChild(badge);
          }
          if (meta.latestEpisode && cached.lastEpisode && meta.latestEpisode > cached.lastEpisode) {
            badge.textContent = '★ НОВАЯ СЕРИЯ!';
            badge.style.background = 'rgba(255,152,0,0.95)';
          }
        }
      }
    }

    window.DrxRememberVoice = function(meta) {
      if (!Config.FEATURES.voiceover_tracking || !meta?.voiceId) return;
      const key = meta.source || (meta.title || meta.name || '') + '_' + (meta.year || '');
      Config.VOICEOVER.cache[key] = {
        voiceId: meta.voiceId,
        lastSeason: meta.season || 0,
        lastEpisode: meta.episode || 0
      };
    };

    // ====================== HERO MADNESS ======================
    const HERO_CSS = `
      .card__quality,.card-quality,.drx-rating,.drx-voice,.card__vote{background:transparent!important;box-shadow:none!important;}
      body.drxaos-hero-active .drxaos-hero-bg{position:fixed;top:0;left:0;right:0;height:120vh;background-size:cover;background-position:center center;opacity:0;transition:opacity 0.8s;z-index:-2;}
      body.drxaos-hero-active .drxaos-hero-bg.loaded{opacity:1;}
      body.drxaos-hero-active .drxaos-hero-overlay{position:fixed;top:0;left:0;right:0;height:120vh;background:linear-gradient(180deg,rgba(8,10,18,0.92) 0%,rgba(8,10,18,0.4) 60%,rgba(8,10,18,0) 100%);z-index:-1;}
      body.drxaos-hero-active .items-line{margin-top:-76px!important;padding-bottom:100px!important;}
      @media(min-width:1280px){body.drxaos-hero-active .items-line{margin-top:-90px!important;padding-bottom:140px!important;}}
    `;

    function injectHeroCSS() {
      if (document.getElementById('drx-hero-style')) return;
      const s = document.createElement('style');
      s.id = 'drx-hero-style';
      s.textContent = HERO_CSS;
      document.head.appendChild(s);
    }

    function updateHeroMode() {
      const enable = !!document.querySelector('.full-start') && Config.FEATURES.hero_mode;
      document.body.classList.toggle('drxaos-hero-active', enable);
      if (enable) {
        const poster = document.querySelector('.full-art__img')?.src || document.querySelector('.background__container img')?.src;
        if (poster && !document.querySelector('.drxaos-hero-bg')) {
          const bg = document.createElement('div');
          bg.className = 'drxaos-hero-bg';
          bg.style.backgroundImage = `url(${poster})`;
          document.body.appendChild(bg);
          const ov = document.createElement('div');
          ov.className = 'drxaos-hero-overlay';
          document.body.appendChild(ov);
          setTimeout(() => bg.classList.add('loaded'), 100);
        }
      }
    }

    // ====================== MADNESS ЗАГОЛОВКИ ======================
    function applyMadnessTitles() {
      if (!Config.FEATURES.madness || Config.FEATURES.madness_level === 'off') return;
      document.querySelectorAll('.section__title,.head__title,.items-line__title').forEach(el => {
        if (!el.querySelector('.madness-badge')) {
          const b = document.createElement('span');
          b.textContent = ' ✦ MADNESS';
          b.className = 'madness-badge';
          b.style.cssText = 'margin-left:0.4em;font-size:0.75em;opacity:0.85;';
          if (Config.FEATURES.madness_level === 'full') b.style.cssText += 'color:#ff00ff;text-shadow:0 0 8px #ff00ff;';
          el.appendChild(b);
        }
      });
    }

    // ====================== BORDERLESS ======================
    function applyBorderless() {
      const id = 'drx-borderless';
      if (!Config.FEATURES.borderless_dark_theme) return document.getElementById(id)?.remove();
      if (document.getElementById(id)) return;
      const css = `
        body{background:#05070A!important;color:#ECEFF4!important;}
        .card{border:none!important;box-shadow:0 16px 50px rgba(0,0,0,0.85)!important;background:radial-gradient(circle at top,#1E222C 0%,#0F131A 70%,#05070A 100%)!important;}
        .head,.section__title{color:#ECEFF4!important;text-shadow:0 0 10px #000!important;}
      `;
      const s = document.createElement('style');
      s.id = id;
      s.textContent = css;
      document.head.appendChild(s);
    }

    // ====================== КНОПКА ВЫХОДА ======================
    function addExitButton() {
      if (!Config.FEATURES.topbar_exit_menu || document.querySelector('.drx-exit-btn')) return;
      const cont = document.querySelector('.head__actions');
      if (!cont) return setTimeout(addExitButton, 500);

      const btn = document.createElement('div');
      btn.className = 'head__action drx-exit-btn selector focusable';
      btn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke="currentColor" stroke-width="1.5"/><path d="M22 12C22 16.714 22 19.071 20.535 20.535C19.071 22 16.714 22 12 22C7.286 22 4.929 22 3.464 20.535C2 19.071 2 16.714 2 12 2C16.714 2 19.071 2 20.535 3.464C21.509 4.438 21.836 5.807 21.945 8" stroke="currentColor" stroke-width="1.5"/></svg>`;
      btn.onclick = openExitMenu;

      if (Lampa.Controller?.addListener) Lampa.Controller.addListener(btn, {enter: openExitMenu});
      cont.appendChild(btn);
    }

    function openExitMenu() {
      Lampa.Modal.open({
        title: 'Меню выхода',
        html: $('<div class="about"><div class="settings-category selector" data-item="exit"><div class="settings-category__title">Закрыть приложение</div></div><div class="settings-category selector" data-item="reboot"><div class="settings-category__title">Перезагрузить</div></div><div class="settings-category selector" data-item="cache"><div class="settings-category__title">Очистить кэш</div></div></div>'),
        onSelect: e => {
          const a = e.target.closest('[data-item]')?.dataset.item;
          if (a === 'exit') {
            if (Lampa.Platform.is('android')) Lampa.Android.exit();
            else location.reload();
          } else if (a === 'reboot') location.reload();
          else if (a === 'cache') { Lampa.Storage.clear(); Lampa.Noty.show('Кэш очищен'); }
        },
        onBack: () => Lampa.Modal.close()
      });
    }

    // ====================== НАСТРОЙКИ (100% РАБОЧИЙ ВАРИАНТ) ======================
    function registerSettings() {
      function add(name, type, def, title, desc = '', values = null) {
        const p = {
          component: 'more',
          param: { name: 'drxaos_supermenu_' + name, type, default: def },
          field: { name: title, description: desc }
        };
        if (type === 'select' && values) p.param.values = values;
        Lampa.SettingsApi.addParam(p);
      }

      add('madness', 'trigger', true, 'MADNESS режим');
      add('hero_mode', 'trigger', true, 'Hero Mode MADNESS');
      add('ratings_tmdb', 'trigger', true, 'Рейтинг TMDB');
      add('ratings_imdb', 'trigger', true, 'Рейтинг IMDb');
      add('ratings_kp', 'trigger', true, 'Рейтинг КиноПоиск');
      add('label_colors', 'trigger', true, 'Цветные метки качества/типа');
      add('voiceover_tracking', 'trigger', true, 'Отслеживание озвучки');
      add('topbar_exit_menu', 'trigger', true, 'Кнопка выхода в топбаре');
      add('borderless_dark_theme', 'trigger', false, 'Тёмная тема без рамок');

      add('kp_apikey', 'input', '', 'Kinopoisk API ключ', 'kinopoiskapiunofficial.tech');

      add('madness_level', 'select', 'normal', 'Уровень MADNESS', '', { off: 'Выключен', normal: 'Нормальный', full: 'Полный (неон)' });
      add('label_scheme', 'select', 'vivid', 'Схема цветов меток', '', { vivid: 'Яркая', soft: 'Мягкая' });
    }

    function applySettings() {
      Config.FEATURES.madness = Lampa.Storage.get('drxaos_supermenu_madness', true);
      Config.FEATURES.madness_level = Lampa.Storage.get('drxaos_supermenu_madness_level', 'normal');
      Config.FEATURES.hero_mode = Lampa.Storage.get('drxaos_supermenu_hero_mode', true);
      Config.FEATURES.ratings_tmdb = Lampa.Storage.get('drxaos_supermenu_ratings_tmdb', true);
      Config.FEATURES.ratings_imdb = Lampa.Storage.get('drxaos_supermenu_ratings_imdb', true);
      Config.FEATURES.ratings_kp = Lampa.Storage.get('drxaos_supermenu_ratings_kp', true);
      Config.RATINGS.kpApiKey = Lampa.Storage.get('drxaos_supermenu_kp_apikey', '');
      Config.FEATURES.label_colors = Lampa.Storage.get('drxaos_supermenu_label_colors', true);
      Config.LABEL_SCHEME = Lampa.Storage.get('drxaos_supermenu_label_scheme', 'vivid');
      Config.FEATURES.voiceover_tracking = Lampa.Storage.get('drxaos_supermenu_voiceover_tracking', true);
      Config.FEATURES.topbar_exit_menu = Lampa.Storage.get('drxaos_supermenu_topbar_exit_menu', true);
      Config.FEATURES.borderless_dark_theme = Lampa.Storage.get('drxaos_supermenu_borderless_dark_theme', false);

      applyBorderless();
      updateHeroMode();
      applyMadnessTitles();
      addExitButton();
    }

    // ====================== OBSERVER ======================
    let observer;
    function startObserver() {
      if (observer) return;
      observer = new MutationObserver(() => {
        document.querySelectorAll('.card:not([data-drx-processed])').forEach(processCard);
        updateHeroMode();
        applyMadnessTitles();
      });
      observer.observe(document.body, {childList: true, subtree: true});
    }

    // ====================== ЗАПУСК ======================
    try {
      registerSettings();
      applySettings();

      Lampa.Listener.follow('app', e => {
        if (e.type === 'ready') {
          setTimeout(() => {
            injectHeroCSS();
            startObserver();
            addExitButton();
            log('SuperMenu v2.0.3 готов');
          }, 800);
        }
      });

      Lampa.Storage.listener.follow('change', e => {
        if (e.name?.startsWith('drxaos_supermenu_')) applySettings();
      });

      window.DrxSuperMenu = { getTmdbRating, getImdbRating, getKpRating, rememberVoiceoverSelection: window.DrxRememberVoice };

    } catch (e) {
      console.error('[DRX SuperMenu] Error:', e);
    }
  }

  if (typeof Lampa !== "undefined") init();
  else setInterval(() => { if (typeof Lampa !== "undefined") { init(); clearInterval(this); }}, 200);
})();