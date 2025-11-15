(function () {
  "use strict";

  // =====================================================================
  // DRXAOS SUPERMENU v2.0.2 — ФИКС ДЛЯ TRIGGER VALUES
  // =====================================================================
  // Добавлен values: '' для trigger (toggle) — это фиксит ошибку 'values[name]'
  // Теперь настройки загружаются без краша
  // Всё остальное как в v2.0.1

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
      const kpKey = meta.title + (meta.year || '');
      const tmdbKey = meta.title + (meta.year || '');
      const kp = cacheGet('kp', kpKey);
      const tmdb = cacheGet('tmdb', tmdbKey);
      let ratingsText = '';
      if (kp) ratingsText += kp.value + 'КП ';
      if (kp?.imdb) ratingsText += kp.imdb + 'IM ';
      if (tmdb) ratingsText += tmdb.value + ' ';

      if (ratingsText || Config.FEATURES.ratings_kp || Config.FEATURES.ratings_tmdb) {
        let badge = card.querySelector('.drx-rating');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'drx-rating card__quality';
          badge.style.cssText = 'position:absolute;top:4px;right:4px;z-index:12;font-size:0.9em;padding:0.15em 0.45em;border-radius:0.4em;background:rgba(0,0,0,0.7);color:#fff;';
          card.appendChild(badge);
        }
        badge.textContent = ratingsText.trim() || 'Загрузка...';

        // догрузка асинхронно
        if (!kp && Config.FEATURES.ratings_kp) getKpRating(meta, () => setTimeout(() => processCard(card), 200));
        if (!tmdb && Config.FEATURES.ratings_tmdb) getTmdbRating(meta, () => setTimeout(() => processCard(card), 200));

        // цвет по рейтингу (берём первый рейтинг)
        const num = parseFloat((ratingsText.match(/(\d+\.?\d*)/) || [])[1]) || 0;
        if (num >= 7.5) badge.style.background = 'rgba(76,175,80,0.92)';
        else if (num >= 6.5) badge.style.background = 'rgba(255,193,7,0.92)';
        else if (num > 0) badge.style.background = 'rgba(244,67,54,0.92)';
        else badge.style.background = 'rgba(0,0,0,0.7)';
      }

      // озвучка tracking
      if (Config.FEATURES.voiceover_tracking && meta.voiceId) {
        const key = meta.source || meta.title + (meta.year || '');
        const cached = Config.VOICEOVER.cache[key];
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
            badge.textContent = '★ Новая серия!';
            badge.style.background = 'rgba(255,152,0,0.95)';
          }
        }
      }
    }

    window.DrxRememberVoice = function(meta) {
      if (!Config.FEATURES.voiceover_tracking || !meta?.voiceId) return;
      const key = meta.source || meta.title + (meta.year || '');
      Config.VOICEOVER.cache[key] = {
        voiceId: meta.voiceId,
        lastSeason: meta.season || 0,
        lastEpisode: meta.episode || 0,
        updated: Date.now()
      };
    };

    // ====================== HERO MADNESS ======================
    const HERO_CSS = `
      .card__quality,.card-quality,.card__next-episode,.card__status,.card__season,.card__runtime,.card__country,.card__year,.card--content-type,.card__vote,.card__age,.drx-rating,.drx-voice{background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;border:none!important;}
      body.drxaos-hero-active .drxaos-hero-bg{position:fixed;top:0;left:0;right:0;height:120vh;background-size:cover;background-position:center center;opacity:0;transition:opacity 0.8s;z-index:-2;}
      body.drxaos-hero-active .drxaos-hero-bg.loaded{opacity:1;}
      body.drxaos-hero-active .drxaos-hero-overlay{position:fixed;top:0;left:0;right:0;height:120vh;background:linear-gradient(180deg,rgba(8,10,18,0.92) 0%,rgba(8,10,18,0.4) 60%,rgba(8,10,18,0) 100%);z-index:-1;}
      body.drxaos-hero-active .items-line{margin-top:-76px!important;padding-bottom:100px!important;}
      body.drxaos-hero-active .items-line:first-child{margin-top:-76px!important;}
      @media(min-width:1280px){body.drxaos-hero-active .items-line{margin-top:-90px!important;padding-bottom:140px!important;}}
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
      if (enable && !document.querySelector('.drxaos-hero-bg')) {
        let poster = document.querySelector('.full-art__img')?.src || document.querySelector('.background__container img')?.src;
        if (poster) {
          const bg = document.createElement('div');
          bg.className = 'drxaos-hero-bg';
          bg.style.backgroundImage = `url(${poster})`;
          document.body.appendChild(bg);
          const overlay = document.createElement('div');
          overlay.className = 'drxaos-hero-overlay';
          document.body.appendChild(overlay);
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
          badge.style.cssText = 'margin-left:0.4em;font-size:0.75em;opacity:0.85;text-shadow:0 0 4px currentColor;';
          if (Config.FEATURES.madness_level === 'full') {
            badge.style.color = '#ff00ff';
            badge.style.textShadow = '0 0 8px #ff00ff';
          }
          el.appendChild(badge);
        }
      });
    }

    // ====================== BORDERLESS DARK ======================
    function applyBorderless() {
      const existing = document.getElementById('drx-borderless');
      if (Config.FEATURES.borderless_dark_theme) {
        if (existing) return;
        const css = `
          body { background: #05070A !important; color: #ECEFF4 !important; }
          .card { border: none !important; box-shadow: 0 16px 50px rgba(0,0,0,0.85) !important; background: radial-gradient(circle at top, #1E222C 0%, #0F131A 70%, #05070A 100%) !important; }
          .head, .section__title, .items-line__title { color: #ECEFF4 !important; text-shadow: 0 0 10px #000 !important; }
          .drx-rating, .drx-voice { text-shadow: 0 1px 2px rgba(0,0,0,0.8) !important; }
        `;
        const s = document.createElement('style');
        s.id = 'drx-borderless';
        s.textContent = css;
        document.head.appendChild(s);
      } else if (existing) {
        existing.remove();
      }
    }

    // ====================== МЕНЮ ВЫХОДА ======================
    function addExitButton() {
      if (!Config.FEATURES.topbar_exit_menu || document.querySelector('.drx-exit-btn')) return;
      const container = document.querySelector('.head__actions');
      if (!container) return setTimeout(addExitButton, 500);

      const btn = document.createElement('div');
      btn.className = 'head__action drx-exit-btn selector focusable';
      btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M22 12C22 16.714 22 19.071 20.535 20.535C19.071 22 16.714 22 12 22C7.286 22 4.929 22 3.464 20.535C2 19.071 2 16.714 2 12C2 7.286 2 4.929 3.464 3.464C4.929 2 7.286 2 12 2C16.714 2 19.071 2 20.535 3.464C21.509 4.438 21.836 5.807 21.945 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
      btn.title = 'Меню выхода (Enter)';

      const openExitMenu = () => {
        const items = [
          { id: 'exit', title: 'Закрыть Lampa', icon: 'exit' },
          { id: 'reboot', title: 'Перезагрузить страницу', icon: 'refresh' },
          { id: 'clear_cache', title: 'Очистить кэш', icon: 'trash' },
          { id: 'youtube', title: 'YouTube', icon: 'play_circle' },
          { id: 'speedtest', title: 'Speed Test', icon: 'speed' }
        ];

        const html = items.map(i => `
          <div class="settings-category selector" data-item="${i.id}">
            <div class="settings-category__icon">${i.icon}</div>
            <div class="settings-category__title">${i.title}</div>
          </div>
        `).join('');

        Lampa.Modal.open({
          title: 'Меню выхода',
          html: `<div class="about">${html}</div>`,
          onBack: () => Lampa.Modal.close(),
          onSelect: (e) => {
            const item = e.target.closest('[data-item]');
            if (!item) return;
            const id = item.dataset.item;
            if (id === 'exit') {
              if (Lampa.Platform.is('android')) Lampa.Android.exit();
              else location.reload();
            } else if (id === 'reboot') location.reload();
            else if (id === 'clear_cache') {
              Lampa.Storage.clear();
              Lampa.Noty.show('Кэш очищен');
            } else if (id === 'youtube') window.open('https://www.youtube.com');
            else if (id === 'speedtest') window.open('https://www.speedtest.net');
            Lampa.Modal.close();
          }
        });
      };

      btn.addEventListener('click', openExitMenu);
      if (Lampa.Controller && Lampa.Controller.addListener) {
        Lampa.Controller.addListener(btn, {
          hover: () => {},
          enter: openExitMenu
        });
      }

      container.appendChild(btn);
    }

    // ====================== НАСТРОЙКИ (ФИКС ДЛЯ VALUES) ======================
    function registerSettings() {
      // Универсальная функция с фиксом values для trigger
      function addParam(name, type, def, title, desc = '', values = null) {
        const paramObj = {
          component: 'more',
          param: {
            name: 'drxaos_supermenu_' + name,
            type: type,
            default: def  // без кавычек
          },
          field: {
            name: title,
            description: desc
          }
        };
        if (type === 'trigger') {
          paramObj.param.values = '';  // ФИКС: пустая строка для trigger
        } else if (values && type === 'select') {
          paramObj.param.values = values;
        }
        Lampa.SettingsApi.addParam(paramObj);
      }

      // Triggers (toggles)
      addParam('madness', 'trigger', true, 'MADNESS режим', 'Визуальные улучшения для заголовков');
      addParam('hero_mode', 'trigger', true, 'Hero Mode MADNESS', 'Подъём рядов + фон от постера в full-view');
      addParam('ratings_tmdb', 'trigger', true, 'Рейтинг TMDB', 'Авто-добавление на карточки');
      addParam('ratings_imdb', 'trigger', true, 'Рейтинг IMDb', 'Через Kinopoisk API');
      addParam('ratings_kp', 'trigger', true, 'Рейтинг КиноПоиск', 'Авто-добавление на карточки');
      addParam('label_colors', 'trigger', true, 'Цветные метки качества/типа', 'Яркие цвета для 4K/HD/CAM и т.д.');
      addParam('voiceover_tracking', 'trigger', true, 'Отслеживание озвучки', 'Плашка на карточке + уведомление о новых сериях');
      addParam('topbar_exit_menu', 'trigger', true, 'Меню выхода в топбаре', 'Кнопка с иконкой в правом углу');
      addParam('borderless_dark_theme', 'trigger', false, 'Тёмная тема без рамок', 'Улучшенный dark mode с градиентами');

      // Input
      addParam('kp_apikey', 'input', '', 'Kinopoisk API ключ', 'Получите бесплатно на kinopoiskapiunofficial.tech');

      // Selects
      addParam('madness_level', 'select', 'normal', 'Уровень MADNESS', '', { off: 'Выключен', normal: 'Нормальный', full: 'Полный (с неоном)' });
      addParam('label_scheme', 'select', 'vivid', 'Схема цветов меток', '', { vivid: 'Яркая (vivid)', soft: 'Мягкая (soft)' });
    }

    function applySettings() {
      ['madness', 'madness_level', 'hero_mode', 'ratings_tmdb', 'ratings_imdb', 'ratings_kp', 'label_colors', 'label_scheme', 'voiceover_tracking', 'topbar_exit_menu', 'borderless_dark_theme'].forEach(key => {
        Config.FEATURES[key] = Lampa.Storage.get('drxaos_supermenu_' + key, Config.FEATURES[key]);
      });
      Config.RATINGS.kpApiKey = Lampa.Storage.get('drxaos_supermenu_kp_apikey', '');

      applyBorderless();
      injectHeroCSS();
      addExitButton();
      applyMadnessTitles();
    }

    // ====================== OBSERVER ======================
    let cardObserver;
    function initObserver() {
      if (cardObserver) return;
      cardObserver = new MutationObserver(muts => {
        let processed = false;
        muts.forEach(m => {
          if (m.type === 'childList') {
            m.addedNodes.forEach(node => {
              if (node.nodeType !== 1) return;
              if (node.classList?.contains('card')) {
                processCard(node);
                processed = true;
              }
              if (node.querySelectorAll) node.querySelectorAll('.card').forEach(processCard);
            });
          }
        });
        if (processed) {
          updateHeroMode();
          applyMadnessTitles();
        }
      });
      cardObserver.observe(document.body, { childList: true, subtree: true });
    }

    // ====================== ЗАПУСК ======================
    try {
      registerSettings();
      applySettings();
      log('DRXAOS SuperMenu v2.0.2: Settings registered');

      if (Lampa.Listener && Lampa.Listener.follow) {
        Lampa.Listener.follow('app', (e) => {
          if (e.type === 'ready') {
            setTimeout(() => {
              initObserver();
              updateHeroMode();
              applyMadnessTitles();
              addExitButton();
              log('DRXAOS SuperMenu v2.0.2: App ready, observer started');
            }, 1000);
          }
        });
      }

      if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
        Lampa.Storage.listener.follow('change', (e) => {
          if (e.name && e.name.startsWith('drxaos_supermenu_')) {
            applySettings();
            log('DRXAOS SuperMenu v2.0.2: Settings changed');
          }
        });
      }

      // Экспорт API
      window.DrxSuperMenu = {
        getTmdbRating,
        getImdbRating,
        getKpRating,
        rememberVoiceoverSelection: window.DrxRememberVoice
      };

      log('DRXAOS SuperMenu v2.0.2 загружен полностью ✦');
    } catch (e) {
      console.error('[DRX SuperMenu] Init error:', e);
    }
  }

  // Bootstrap
  if (typeof Lampa !== "undefined") {
    init();
  } else {
    const timer = setInterval(() => {
      if (typeof Lampa !== "undefined") {
        clearInterval(timer);
        init();
      }
    }, 250);
  }
})();