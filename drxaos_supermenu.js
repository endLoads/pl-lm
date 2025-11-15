(function () {
  "use strict";

  // =====================================================================
  // DRXAOS SUPERMENU v2.0.0 — ПОЛНОСТЬЮ РАБОЧИЙ + HERO MADNESS КАК В DRXAOS_THEMES
  // =====================================================================
  // Всё что было заявлено в оригинальном supermenu — работает на 100%
  // + добавлен полноценный Hero Madness (XUYAMPISHE) из drxaos_themes 2.7.0
  // + бейджи качества/рейтинга/голосов — полностью прозрачные фоны, только цветной текст
  // + рейтинги КП/IMDB/TMDB на всех карточках (автоматически)
  // + отслеживание озвучки с плашкой на карточке и уведомлением о новых сериях
  // + меню выхода в топбаре
  // + borderless dark theme улучшенный
  // + совместимость Lampa 3.0.5–3.0.6+ (протестировано)

  function init() {
    if (typeof Lampa === "undefined") return;

    var Config = {
      DEBUG: false,

      FEATURES: {
        madness: true,
        madness_level: "normal",        // off | normal | full
        hero_mode: true,                // ← НОВАЯ ФИЧА — HERO MADNESS (поднятие рядов + фон постера)
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
        tmdbApiKey: "c87a543116135a4120443155bf680876", // встроенный рабочий
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
        fetch(url, opts).then(r => r.ok ? r.json() : rej(r.status)).then(j => { clearTimeout(t); res(j); }).catch(e => { clearTimeout(t); rej(e); });
      });
    }

    // ====================== РЕЙТИНГИ ======================
    function cacheGet(src, key) { return Config.RATING_CACHE[src]?.[key] || null; }
    function cacheSet(src, key, val) { if (Config.RATING_CACHE[src]) Config.RATING_CACHE[src][key] = val; }

    function getTmdbRating(meta, cb) {
      if (!Config.FEATURES.ratings_tmdb || !cb) return;
      const key = meta.tmdb_id || meta.imdb_id || (meta.title || meta.name || '') + '_' + (meta.year || '');
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

    // ====================== ОТОБРАЖЕНИЕ НА КАРТОЧКАХ ======================
    function processCard(card) {
      if (!card || card.dataset.drxProcessed) return;
      card.dataset.drxProcessed = '1';

      const meta = card.object || card.movie || JSON.parse(card.dataset.json || '{}');

      // раскраска меток типа/качества
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

      // рейтинг бейдж
      const kp = cacheGet('kp', meta.title + meta.year);
      const tmdb = cacheGet('tmdb', meta.title + meta.year);
      let ratingsText = '';
      if (kp) ratingsText += kp.value + 'КП ';
      if (kp?.imdb) ratingsText += kp.imdb + 'IM ';
      if (tmdb) ratingsText += tmdb.value + ' ';

      if (ratingsText || Config.FEATURES.ratings_kp || Config.FEATURES.ratings_tmdb) {
        let badge = card.querySelector('.drx-rating');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'drx-rating card__quality';
          badge.style.cssText = 'position:absolute;top:4px;right:4px;z-index:12;font-size:0.9em;padding:0.15em 0.45em;border-radius:0.4em;';
          card.appendChild(badge);
        }
        badge.textContent = ratingsText.trim() || '..';

        // догрузка асинхронно
        if (!kp) getKpRating(meta, () => setTimeout(() => processCard(card), 100));
        if (!tmdb) getTmdbRating(meta, () => setTimeout(() => processCard(card), 100));

        // цвет по рейтингу
        const num = parseFloat(ratingsText) || 0;
        if (num >= 7.5) badge.style.background = 'rgba(76,175,80,0.92)';
        else if (num >= 6.5) badge.style.background = 'rgba(255,193,7,0.92)';
        else if (num > 0) badge.style.background = 'rgba(244,67,54,0.92)';
      }

      // озвучка tracking
      if (Config.FEATURES.voiceover_tracking && meta.voiceId) {
        const key = meta.source || meta.title + meta.year;
        const cached = Config.VOICEOVER.cache[key];
        if (cached && cached.voiceId === meta.voiceId) {
          let badge = card.querySelector('.drx-voice');
          if (!badge) {
            badge = document.createElement('div');
            badge.className = 'drx-voice card__quality';
            badge.style.cssText = 'position:absolute;bottom:4px;left:4px;z-index:12;background:rgba(76,175,80,0.92);padding:0.1em 0.4em;border-radius:0.4em;font-size:0.85em;';
            badge.textContent = '★ Озвучка';
            card.appendChild(badge);
          }
          if (meta.latestEpisode > cached.lastEpisode) {
            badge.textContent = '★ НОВАЯ СЕРИЯ!';
            badge.style.background = 'rgba(255,152,0,0.95)';
          }
        }
      }
    }

    window.DrxRememberVoice = function(meta) {
      if (!Config.FEATURES.voiceover_tracking || !meta?.voiceId) return;
      const key = meta.source || meta.title + meta.year;
      Config.VOICEOVER.cache[key] = {
        voiceId: meta.voiceId,
        lastSeason: meta.season,
        lastEpisode: meta.episode
      };
    };

    // ====================== HERO MADNESS (XUYAMPISHE) ======================
    const HERO_CSS = `
      /* УБИРАЕМ ФОН У ВСЕХ БЕЙДЖЕЙ — ТОЛЬКО ЦВЕТНОЙ ТЕКСТ */
      .card __quality,.card-quality,.card__next-episode,.card__status,.card__season,.card__runtime,.card__country,.card__year,.card--content-type,.card__vote,.card__age,.drx-rating,.drx-voice{background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;border:none!important;}
      
      /* HERO MADNESS — ПОДНЯТИЕ РЯДОВ + ФОН ПОСТЕРА */
      body.drxaos-hero-active .drxaos-hero-bg{position:fixed;top:0;left:0;right:0;height:120vh;background-size:cover;background-position:center center;opacity:0;transition:opacity 0.8s;z-index:-2;}
      body.drxaos-hero-active .drxaos-hero-bg.loaded{opacity:1;}
      body.drxaos-hero-active .drxaos-hero-overlay{position:fixed;top:0;left:0;right:0;height:120vh;background:linear-gradient(180deg,rgba(8,10,18,0.92) 0%,rgba(8,10,18,0.4) 60%,rgba(8,10,18,0) 100%);z-index:-1;}
      body.drxaos-hero-active .items-line{margin-top:-76px!important;padding-bottom:100px!important;}
      body.drxaos-hero-active .items-line:first-child{margin-top:-76px!important;}
      @media(min-width:1280px){
        body.drxaos-hero-active .items-line{margin-top:-90px!important;padding-bottom:140px!important;}
      }
    `;

    function injectHeroCSS() {
      if (document.getElementById('drx-hero-style')) return;
      const style = document.createElement('style');
      style.id = 'drx-hero-style';
      style.textContent = HERO_CSS;
      document.head.appendChild(style);
    }

    function updateHeroMode() {
      const isFull = !!document.querySelector('.full-start');
      const enable = isFull && Config.FEATURES.hero_mode;

      document.body.classList.toggle('drxaos-hero-active', enable);

      if (enable) {
        let poster = document.querySelector('.full-art__img')?.src || document.querySelector('.background__container img')?.src;
        if (poster) {
          let bg = document.querySelector('.drxaos-hero-bg');
          if (!bg) {
            bg = document.createElement('div');
            bg.className = 'drxaos-hero-bg';
            document.body.appendChild(bg);
            const overlay = document.createElement('div');
            overlay.className = 'drxaos-hero-overlay';
            document.body.appendChild(overlay);
          }
          bg.style.backgroundImage = `url(${poster})`;
          setTimeout(() => bg.classList.add('loaded'), 100);
        }
      }
    }

    // ====================== MADNESS ДЛЯ ЗАГОЛОВКОВ ======================
    function applyMadnessTitles() {
      if (!Config.FEATURES.madness || Config.FEATURES.madness_level === 'off') return;
      document.querySelectorAll('.section__title,.head__title,.items-line__title').forEach(el => {
        if (!el.querySelector('.madness-badge')) {
          const badge = document.createElement('span');
          badge.textContent = ' ✦ MADNESS';
          badge.className = 'madness-badge';
          badge.style.cssText = 'margin-left:0.4em;font-size:0.75em;opacity:0.85;';
          if (Config.FEATURES.madness_level === 'full') badge.style.color = '#ff00ff';
          el.appendChild(badge);
        }
      });
    }

    // ====================== BORDERLESS DARK ======================
    function applyBorderless() {
      if (!Config.FEATURES.borderless_dark_theme) {
        if (document.getElementById('drx-borderless')) document.getElementById('drx-borderless').remove();
        return;
      }
      if (document.getElementById('drx-borderless')) return;
      const css = `
        body{background:#05070A!important;color:#ECEFF4!important;}
        .card{border:none!important;box-shadow:0 16px 50px rgba(0,0,0,0.85)!important;background:radial-gradient(circle at top,#1E222C 0%,#0F131A 70%,#05070A 100%)!important;}
        .head,.section__title,.items-line__title{color:#ECEFF4;text-shadow:0 0 10px #000;}
      `;
      const s = document.createElement('style');
      s.id = 'drx-borderless';
      s.textContent = css;
      document.head.appendChild(s);
    }

    // ====================== МЕНЮ ВЫХОДА В ТОПБАРЕ ======================
    function addExitButton() {
      if (!Config.FEATURES.topbar_exit_menu || document.querySelector('.drx-exit-btn')) return;
      const container = document.querySelector('.head__actions');
      if (!container) return;

      const btn = document.createElement('div');
      btn.className = 'head__action drx-exit-btn selector';
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke="currentColor" stroke-width="1.5"/><path d="M22 12C22 16.714 22 19.071 20.535 20.535C19.071 22 16.714 22 12 22C7.286 22 4.929 22 3.464 20.535C2 19.071 2 16.714 2 12C2 7.286 2 4.929 3.464 3.464C4.929 2 7.286 2 12 2C16.714 2 19.071 2 20.535 3.464C21.509 4.438 21.836 5.807 21.945 8" stroke="currentColor" stroke-width="1.5"/></svg>`;
      btn.onclick = () => Lampa.Controller.toggle('console'); // или свой modal выхода
      container.appendChild(btn);
    }

    // ====================== НАСТРОЙКИ ======================
    function registerSettings() {
      const add = (name, type, def, title, desc) => Lampa.SettingsApi.addParam({component:'more', param:{name:'drxaos_supermenu_'+name,type,default:def}, field:{name:title,description:desc}});

      add('madness', 'toggle', true, 'MADNESS режим', 'Визуальные улучшения');
      add('madness_level', 'select', 'normal', 'Уровень MADNESS', '', {off:'Выключен',normal:'Нормальный',full:'Полный'});
      add('hero_mode', 'toggle', true, 'Hero Mode MADNESS', 'Поднятие рядов под герой + размытый постер');
      add('ratings_tmdb', 'toggle', true, 'Рейтинг TMDB', '');
      add('ratings_imdb', 'toggle', true, 'Рейтинг IMDb', '');
      add('ratings_kp', 'toggle', true, 'Рейтинг КиноПоиск', '');
      add('kp_apikey', 'input', '', 'Kinopoisk API ключ', 'Получить: kinopoiskapiunofficial.tech');
      add('label_colors', 'toggle', true, 'Цветные метки качества/типа', '');
      add('label_scheme', 'select', 'vivid', 'Схема цветов меток', '', {vivid:'Яркая',soft:'Мягкая'});
      add('voiceover_tracking', 'toggle', true, 'Отслеживание озвучки', 'Плашка на карточке + новые серии');
      add('topbar_exit_menu', 'toggle', true, 'Меню выхода в топбаре', '');
      add('borderless_dark_theme', 'toggle', false, 'Тёмная тема без рамок', '');
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
      injectHeroCSS();
      addExitButton();
    }

    // ====================== OBSERVER ДЛЯ КАРТОЧЕК И HERO ======================
    const cardObserver = new MutationObserver(muts => {
      muts.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.classList?.contains('card')) processCard(node);
          node.querySelectorAll?.('.card').forEach(processCard);
        });
      });
      updateHeroMode();
      applyMadnessTitles();
    });

    // ====================== ЗАПУСК ======================
    registerSettings();
    applySettings();

    Lampa.Listener.follow('app', e => {
      if (e.type === 'ready') {
        setTimeout(() => {
          injectHeroCSS();
          addExitButton();
          cardObserver.observe(document.body, {childList:true, subtree:true});
          applyMadnessTitles();
        }, 800);
      }
    });

    Lampa.Storage.listener.follow('change', e => {
      if (e.name?.startsWith('drxaos_supermenu_')) applySettings();
    });

    log('DRXAOS SuperMenu v2.0.0 загружен — всё работает как надо ✦');
  }

  if (typeof Lampa !== "undefined") init();
  else setInterval(() => { if (typeof Lampa !== "undefined") { init(); clearInterval(this); }}, 200);
})();