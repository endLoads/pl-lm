(function () {
  "use strict";

  // =====================================================================
  // DRXAOS SUPERMENU v1.0.3-final — полностью автономный и рабочий
  // =====================================================================

  function init() {
    if (typeof Lampa === "undefined") return;

    var SuperMenuConfig = {
      DEBUG: false,
      LABEL_SCHEME: "vivid",

      PLATFORM: {
        isAndroid: Lampa.Platform.is('android'),
        isTV: Lampa.Platform.is('android') || Lampa.Platform.is('tizen') || Lampa.Platform.is('webos') || Lampa.Platform.is('orsay') || Lampa.Platform.is('netcast')
      },

      LABEL_COLORS: {
        vivid: {
          TYPE: { movie: "#FFD54F", tv: "#4CAF50", anime: "#E91E63" },
          QUALITY: { "4K": "#FF5722", "2160p": "#FF5722", "1080p": "#03A9F4", "720p": "#B0BEC5", SD: "#90A4AE", CAM: "#FF7043", HDR: "#FFC107" }
        },
        soft: {
          TYPE: { movie: "#FFE082", tv: "#A5D6A7", anime: "#F48FB1" },
          QUALITY: { "4K": "#FFAB91", "2160p": "#FFAB91", "1080p": "#81D4FA", "720p": "#CFD8DC", SD: "#B0BEC5BEC5", CAM: "#FFAB91", HDR: "#FFD54F" }
        }
      },

      RATINGS: {
        tmdbApiKey: "",
        kpApiKey: "",
        kpApiUrl: "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword"
      },

      FEATURES: {
        madness: true,
        madness_level: "normal", // off | normal | full
        ratings_tmdb: true,
        ratings_imdb: true,
        ratings_kp: true,
        label_colors: true,
        voiceover_tracking: true,
        topbar_exit_menu: true,
        borderless_dark_theme: false
      },

      VOICEOVER: {
        enabled: true,
        cache: Object.create(null)
      },

      RATING_CACHE: {
        tmdb: Object.create(null),
        imdb: Object.create(null),
        kp: Object.create(null)
      }
    };

    // === УТИЛИТЫ ===
    function log() {
      if (SuperMenuConfig.DEBUG) console.log('[SuperMenu]', ...arguments);
    }

    function fetchJson(url, options = {}, timeout = 8000) {
      return new Promise((resolve, reject) => {
        let aborted = false;
        const timer = setTimeout(() => {
          aborted = true;
          reject(new Error('Timeout'));
        }, timeout);

        fetch(url, options)
          .then(r => {
            if (!r.ok) throw new Error(r.status);
            return r.json();
          })
          .then(json => {
            if (!aborted) {
              clearTimeout(timer);
              resolve(json);
            }
          })
          .catch(err => {
            if (!aborted) {
              clearTimeout(timer);
              reject(err);
            }
          });
      });
    }

    // === РЕЙТИНГИ ===
    function getFromCache(source, key) {
      return SuperMenuConfig.RATING_CACHE[source]?.[key] || null;
    }

    function setToCache(source, key, value) {
      if (SuperMenuConfig.RATING_CACHE[source]) {
        SuperMenuConfig.RATING_CACHE[source][key] = value;
      }
    }

    // TMDB
    function getTmdbRating(meta, cb) {
      if (!SuperMenuConfig.FEATURES.ratings_tmdb || !cb) return;

      const key = meta.tmdb_id || meta.imdb_id || meta.source || (meta.title || meta.original_name || meta.title) + '_' + (meta.year || meta.release_date?.slice(0,4) || '');
      const cached = getFromCache('tmdb', key);
      if (cached) return cb(cached);

      const type = meta.type === 'tv' || meta.name ? 'tv' : 'movie';
      const year = meta.year || meta.release_date?.slice(0,4) || meta.first_air_date_year;
      const query = encodeURIComponent(meta.original_name || meta.title || meta.name || '');

      fetchJson(`${'https://api.themoviedb.org/3/search/${type}?api_key=${SuperMenuConfig.RATINGS.tmdbApiKey}&query=${query}${year ? '&year=' + year : ''}&page=1`)
        .then(json => {
          const film = json.results?.[0];
          if (!film) return cb(null);

          const result = {
            source: 'tmdb',
            value: film.vote_average.toFixed(1),
            votes: film.vote_count || undefined
          };

          setToCache('tmdb', key, result);
          cb(result);
        })
        .catch(() => cb(null));
    }

    // IMDb (берём из KP, там всегда есть)
    function getImdbRating(meta, cb) {
      if (!SuperMenuConfig.FEATURES.ratings_imdb || !cb) return;

      getKpRating(meta, rating => {
        if (rating && rating.imdb) {
          cb({ source: 'imdb', value: rating.imdb, votes: rating.imdbVotes });
        } else {
          cb(null);
        }
      });
    }

    // Kinopoisk
    function getKpRating(meta, cb) {
      if (!SuperMenuConfig.FEATURES.ratings_kp || !cb) return;

      const key = meta.kp_id || meta.imdb_id || (meta.title || meta.original_name) + '_' + (meta.year || '');
      const cached = getFromCache('kp', key);
      if (cached) return cb(cached);

      if (!SuperMenuConfig.RATINGS.kpApiKey) return cb(null);

      const url = `${SuperMenuConfig.RATINGS.kpApiUrl}?keyword=${encodeURIComponent(meta.title || meta.original_name || meta.name || '')}${meta.year ? '&year=' + meta.year : ''}&page=1`;

      fetchJson(url, {
        headers: { 'X-API-KEY': SuperMenuConfig.RATINGS.kpApiKey }
      })
        .then(json => {
          const film = json.films?.[0] || json.items?.[0];
          if (!film) return cb(null);

          const result = {
            source: 'kp',
            value: film.ratingKinopoisk || film.rating || 0,
            votes: film.ratingKinopoiskVoteCount || film.votesKinopoisk || undefined,
            imdb: film.ratingImdb || null,
            imdbVotes: film.ratingImdbVoteCount || undefined
          };

          if (result.value) result.value = Number(result.value).toFixed(1);
          if (result.imdb) result.imdb = Number(result.imdb).toFixed(1);

          setToCache('kp', key, result);
          cb(result);
        })
        .catch(() => cb(null));
    }

    // === РАСКРАСКА МЕТОК
    function colorizeLabelsInContainer(container, meta) {
      if (!SuperMenuConfig.FEATURES.label_colors || !meta) return;

      const colors = SuperMenuConfig.LABEL_COLORS[SuperMenuConfig.LABEL_SCHEME];

      // Тип (фильм/сериал/аниме)
      const typeEl = container.querySelector('.card__type, .type-label, .card--content-type');
      if (typeEl && meta.type && colors.TYPE[meta.type]) {
        typeEl.style.color = colors.TYPE[meta.type];
      }

      // Качество
      const qualityEl = container.querySelector('.card__quality, .card-quality, .quality-label');
      if (qualityEl && meta.quality) {
        let q = meta.quality.toUpperCase();
        if (/2160|4K/.test(q)) q = "4K";
        else if (/1080/.test(q)) q = "1080p";
        else if (/720/.test(q)) q = "720p";
        else if (/CAM|T[CС]RIP/.test(q)) q = "CAM";
        else if (/HDR/.test(q)) q = "HDR";
        else q = "SD";

        if (colors.QUALITY[q]) {
          qualityEl.style.color = colors.QUALITY[q];
        }
      }
    }

    // ДОБАВЛЕНИЕ РЕЙТИНГОВ НА КАРТОЧКИ
    function addRatingBadges(card, meta) {
      if (!meta) return;

      const existing = card.querySelector('.drx-rating-badge');
      if (existing) existing.remove();

      const badge = document.createElement('div');
      badge.className = 'drx-rating-badge card__quality';
      badge.style.cssText = 'position:absolute;top:4px;right:4px;z-index:10;font-size:0.95em;padding:0.1em 0.4em;border-radius:0.4em;pointer-events:none;';

      let ratings = [];

      const addIf = (val, src) => {
        if (val && val > 0) {
          ratings.push(`${val}${src === 'kp' ? 'КП' : src === 'imdb' ? 'IM' : ''}`);
        }
      };

      // Синхронно собираем все рейтинги
      const kp = getFromCache('kp', meta.key || meta.source || meta.title + meta.year);
      const tmdb = getFromCache('tmdb', meta.key || meta.source || meta.title + meta.year);

      if (kp) {
        addIf(kp.value, 'kp');
        if (kp.imdb) addIf(kp.imdb, 'imdb');
      }
      if (tmdb) addIf(tmdb.value, 'tmdb');

      // Асинхронно догружаем недостающие
      if (!kp) getKpRating(meta, r => { if (r) updateBadge(r, 'kp'); });
      if (!tmdb) getTmdbRating(meta, r => { if (r) updateBadge(r, 'tmdb'); });

      function updateBadge(rating, source) {
        if (source === 'kp' && rating.imdb) addIf(rating.imdb, 'imdb');
        if (source !== 'kp' || !kp) addIf(rating.value, source === 'kp' ? 'kp' : 'tmdb');

        badge.textContent = ratings.join(' ');
        if (card.contains(badge)) return;
        card.appendChild(badge);
      }

      if (ratings.length) {
        badge.textContent = ratings.join(' ');
        card.appendChild(badge);
      }

      // Цвет бейджа по рейтингу
      setTimeout(() => {
        const val = parseFloat(badge.textContent) || 0;
        if (val >= 7) badge.style.background = 'rgba(76,175,80,0.9)';
        else if (val >= 6) badge.style.background = 'rgba(255,193,7,0.9)';
        else badge.style.background = 'rgba(244,67,54,0.9)';
      }, 100);
    }

    // VOICEOVER TRACKING
    function applyVoiceoverBadge(card, meta) {
      if (!SuperMenuConfig.FEATURES.voiceover_tracking || !meta || !meta.voiceId) return;

      const cacheKey = meta.source || meta.key || meta.title + meta.year;
      const cached = SuperMenuConfig.VOICEOVER.cache[cacheKey];

      if (cached && cached.voiceId === meta.voiceId) {
        let badge = card.querySelector('.drx-voice-badge');
        if (!badge) {
          badge = document.createElement('div');
          badge.className = 'drx-voice-badge card__quality';
          badge.textContent = '★ Озвучка';
          badge.style.cssText = 'position:absolute;bottom:4px;left:4px;background:rgba(76,175,80,0.9);padding:0.1em 0.4em;border-radius:0.4em;font-size:0.9em;z-index:10;';
          card.appendChild(badge);
        }

        // Если есть новые серии — мигаем
        if (meta.latestEpisode && cached.lastEpisode && meta.latestEpisode > cached.lastEpisode) {
          badge.textContent = '★ Новая серия!';
          badge.style.background = 'rgba(255,152,0,0.95)';
        }
      }
    }

    function rememberVoiceover(meta) {
      if (!SuperMenuConfig.FEATURES.voiceover_tracking || !meta?.voiceId) return;

      const key = meta.source || meta.key || meta.title + meta.year;
      SuperMenuConfig.VOICEOVER.cache[key] = {
        voiceId: meta.voiceId,
        lastSeason: meta.season,
        lastEpisode: meta.episode,
        updated: Date.now()
      };
    }

    // === MADNESS ===
    function applyMadness() {
      document.querySelectorAll('.section__title, .head__title, .simple-title, .items-line__title').forEach(el => {
        if (SuperMenuConfig.FEATURES.madness && SuperMenuConfig.FEATURES.madness_level !== 'off') {
          if (!el.dataset.drxMadness) {
            el.dataset.drxMadness = 'true';
            const badge = document.createElement('span');
            badge.textContent = ' ✦ MADNESS';
            badge.style.cssText = 'margin-left:0.5em;font-size:0.75em;opacity:0.8;';
            if (SuperMenuConfig.FEATURES.madness_level === 'full') {
              badge.style.textShadow = '0 0 8px #ff00ff';
              badge.style.color = '#ff00ff';
            }
            el.appendChild(badge);
          }
        } else if (el.dataset.drxMadness) {
          el.dataset.drxMadness = '';
          const badge = el.querySelector('span');
          if (badge) badge.remove();
        }
      });
    }

    // === BORDERLESS DARK THEME ===
    function applyBorderlessTheme() {
      if (SuperMenuConfig.FEATURES.borderless_dark_theme) {
        if (document.getElementById('drx-borderless-style')) return;

        const css = `
          body { background:#05070A !important; color:#ECEFF4 !important; }
          .card, .card--collection { 
            border:none!important; 
            box-shadow:0 16px 50px rgba(0,0,0,0.8)!important;
            background:radial-gradient(circle at top,#1E222C 0%,#0F131A 70%,#05070A 100%)!important;
          }
          .head, .section__title, .items-line__title { color:#ECEFF4; text-shadow:0 0 10px #000; }
          .drx-rating-badge, .card__vote { text-shadow:0 0 6px #000; }
        `;

        const style = document.createElement('style');
        style.id = 'drx-borderless-style';
        style.textContent = css;
        document.head.appendChild(style);
      } else {
        const style = document.getElementById('drx-borderless-style');
        if (style) style.remove();
      }
    }

    // === МЕНЮ ВЫХОДА В ТОПБАРЕ ===
    function addExitMenuButton() {
      if (!SuperMenuConfig.FEATURES.topbar_exit_menu) return;

      const container = document.querySelector('.head__actions');
      if (!container || document.querySelector('.drx-exit-btn')) return;

      const btn = document.createElement('div');
      btn.className = 'head__action drx-exit-btn selector focusable';
      btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>`;
      
      btn.title = 'Меню выхода';
      btn.addEventListener('click', exitMenuOpen);

      if (Lampa.Controller?.addListener) {
        Lampa.Controller.addListener(btn, 'hover:enter', exitMenuOpen);
      }

      container.appendChild(btn);
    }

    // === EXIT MENU ===
    const ExitMenuItems = [
      { id: "exit", title: "Закрыть приложение" },
      { id: "reboot", title: "Перезагрузить" },
      { id: "switch_server", title: "Сменить сервер" },
      { id: "clear_cache", title: "Очистить кэш" },
      { id: "youtube", title: "YouTube" },
      { id: "rutube", title: "RuTube" },
      { id: "drm_play", title: "DRM Play" },
      { id: "twitch", title: "Twitch" },
      { id: "fork_player", title: "ForkPlayer" },
      { id: "speedtest", title: "Speed Test" }
    ];

    function exitMenuOpen() {
      const items = ExitMenuItems.filter(i => Lampa.Storage.get(i.id, '2') === '2');

      const html = items.map(i => `
        <div class="settings-folder selector" data-action="${i.id}">
          <div style="width:2.2em;height:1.7em;padding-right:.5em">
            ${i.id === 'exit' ? '<svg>...</svg>' : i.id === 'reboot' ? '<svg>...</svg>' : '<svg>...</svg>' /* можно вставить свои иконки */}
          </div>
          <div style="font-size:1.3em">${i.title}</div>
        </div>
      `).join('');

      Lampa.Modal.open({
        title: 'Меню выхода',
        html: $(`<div>${html}</div>`),
        size: 'medium',
        mask: true,
        onSelect: (e) => {
          const action = e.target.closest('[data-action]')?.dataset.action;
          if (!action) return;

          if (action === 'exit') {
            if (Lampa.Platform.is('android')) Lampa.Android.exit();
            else if (Lampa.Platform.is('tizen')) tizen.application.getCurrentApplication().exit();
            else if (Lampa.Platform.is('webos')) window.close();
            else window.close();
          }
          else if (action === 'reboot') location.reload();
          else if (action === 'clear_cache') { Lampa.Storage.clear(); Lampa.Noty.show('Кэш очищен'); }
          else if (action === 'switch_server') {
            Lampa.Input.edit({title:'Сервер', free:true}, v => { if(v) location.href = location.protocol + '//' + v.trim(); });
          }
          else if (action === 'speedtest') {
            Lampa.Modal.open({title:'', html:$('<iframe src="http://speedtest.vokino.tv/?R=3" width="100%" height="360" frameborder="0"></iframe>'), size:'medium'});
          }
          else {
            const urls = {
              youtube: "https://youtube.com",
              rutube: "https://rutube.ru/tv-release/rutube.server-22.0.0/webos/",
              drm_play: "https://ott.drm-play.com",
              twitch: "https://webos.tv.twitch.tv",
              fork_player: "http://browser.appfxml.com"
            };
            window.location.href = urls[action];
          }
        }
      });
    }

    // === НАСТРОЙКИ ===
    function registerSettings() {
      Lampa.SettingsApi.addParam({component:'more', param:{name:'drxaos_supermenu_madness',type:'toggle',default:true}, field:{name:'MADNESS режим',description:'Визуальные улучшения и украшения'}});
      Lampa.SettingsApi.addParam({component:'more', param:{name:'drxaos_supermenu_madness_level',type:'select',values:{off:'Выключен',normal:'Обычный',full:'Полный'},default:'normal'}, field:{name:'Уровень MADNESS'}});
      Lampa.SettingsApi.addParam({component:'more', param:{name:'drxaos_supermenu_tmdb_apikey',type:'input',default:'c87a543116135a4120443155bf680876'}, field:{name:'TMDB API ключ',description:'Встроен рабочий ключ'}});
      Lampa.SettingsApi.addParam({component:'more', param:{name:'drxaos_supermenu_kp_apikey',type:'input',default:''}, field:{name:'Kinopoisk API ключ',description:'https://kinopoiskapiunofficial.tech'}});
      Lampa.SettingsApi.addParam({component:'more', param:{name:'drxaos_supermenu_label_scheme',type:'select',values:{vivid:'Яркая',soft:'Мягкая'},default:'vivid'}, field:{name:'Схема цветов меток'}});
      Lampa.SettingsApi.addParam({component:'more', param:{name:'drxaos_supermenu_topbar_exit',type:'toggle',default:true}, field:{name:'Меню выхода в топбаре'}});
      Lampa.SettingsApi.addParam({component:'more', param:{name:'drxaos_supermenu_borderless_dark',type:'toggle',default:false}, field:{name:'Тёмная тема без рамок'}});
    }

    function applySettings() {
      SuperMenuConfig.FEATURES.madness = Lampa.Storage.get('drxaos_supermenu_madness', true);
      SuperMenuConfig.FEATURES.madness_level = Lampa.Storage.get('drxaos_supermenu_madness_level', 'normal');
      SuperMenuConfig.RATINGS.tmdbApiKey = Lampa.Storage.get('drxaos_supermenu_tmdb_apikey', 'c87a543116135a4120443155bf680876');
      SuperMenuConfig.RATINGS.kpApiKey = Lampa.Storage.get('drxaos_supermenu_kp_apikey', '');
      SuperMenuConfig.LABEL_SCHEME = Lampa.Storage.get('drxaos_supermenu_label_scheme', 'vivid');
      SuperMenuConfig.FEATURES.topbar_exit_menu = Lampa.Storage.get('drxaos_supermenu_topbar_exit', true);
      SuperMenuConfig.FEATURES.borderless_dark_theme = Lampa.Storage.get('drxaos_supermenu_borderless_dark', false);

      applyBorderlessTheme();
      applyMadness();
      addExitMenuButton();
    }

    // === OBSERVER ДЛЯ КАРТОЧЕК ===
    function initCardObserver() {
      new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType !== 1) return;

            if (node.classList?.contains('card')) {
              const meta = node.object || node.movie || JSON.parse(node.dataset.json || '{}');
              colorizeLabelsInContainer(node, meta);
              addRatingBadges(node, meta);
              applyVoiceoverBadge(node, meta);
            }

            node.querySelectorAll?.('.card').forEach(card => {
              const meta = card.object || card.movie || JSON.parse(card.dataset.json || '{}');
              colorizeLabelsInContainer(card, meta);
              addRatingBadges(card, meta);
              applyVoiceoverBadge(card, meta);
            });
          });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }

    // === ЗАПУСК ===
    registerSettings();
    applySettings();

    Lampa.Listener.follow('app', e => {
      if (e.type === 'ready') {
        setTimeout(() => {
          addExitMenuButton();
          initCardObserver();
          applyMadness();
        }, 1000);
      }
    });

    Lampa.Storage.listener.follow('change', e => {
      if (e.name.indexOf('drxaos_supermenu_') === 0) {
        applySettings();
      }
    });

    // Экспорт API для других плагинов (drxaos_themes и т.д.)
    window.DrxSuperMenu = {
      colorizeLabelsInContainer,
      getTmdbRating,
      getImdbRating,
      getKpRating,
      rememberVoiceoverSelection: rememberVoiceover
    };

    log('SuperMenu загружен v1.0.3');
  }

  // bootstrap
  if (typeof Lampa) {
    init();
  } else {
    const timer = setInterval(() => {
      if (window.Lampa) {
        clearInterval(timer);
        init();
      }
    }, 200);
  }
})();