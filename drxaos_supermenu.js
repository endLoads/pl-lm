/*
 * ============================================================================
 * DRXAOS SuperMenu v1.0.0 - Advanced Menu Plugin for Lampa
 * ============================================================================
 * 
 * LAMPA 3.0.5 COMPATIBILITY UPDATE
 * 
 * Features:
 * - Color-coded quality badges (4K/FHD/HD/SD/CAM) with vivid/soft schemes
 * - РљРёРЅРѕРџРѕРёСЃРє ratings integration with caching and fallback
 * - Voice tracking with new episode detection
 * - Borderless dark theme with dynamic CSS injection
 * - Exit menu button in top panel
 * - Settings component with toggles
 * - Full API export for theme integration
 * - Performance optimizations for Android TV/Fire TV
 * 
 * Requirements:
 * - Lampa 3.0.5+ (app_digital >= 305)
 * - Optional: РљРёРЅРѕРџРѕРёСЃРє API key for ratings
 * 
 * ============================================================================
 */

/* jshint esversion: 6, bitwise: false */
(function () {
    'use strict';

    // ============================================================================
    // LAMPA 3.0.5 COMPATIBILITY LAYER (copied byte-for-byte from drxaos_themes)
    // ============================================================================

    // Safe Storage wrapper functions
    function drxaosSafeGet(key, defaultValue) {
        try {
            if (!window.Lampa || !Lampa.Storage) return defaultValue;
            var value = Lampa.Storage.get(key, defaultValue);
            return value !== undefined ? value : defaultValue;
        } catch (e) {
            console.warn('[DRXAOS Themes] Storage.get error:', e);
            return defaultValue;
        }
    }

    function drxaosSafeSet(key, value) {
        try {
            if (!window.Lampa || !Lampa.Storage) return false;
            Lampa.Storage.set(key, value);
            return true;
        } catch (e) {
            console.warn('[DRXAOS Themes] Storage.set error:', e);
            return false;
        }
    }

    // Check Lampa API availability
    if (!window.Lampa) {
        console.error('[DrxSuperMenu] Lampa API not found');
        return;
    }

    // Validate critical APIs
    var requiredAPIs = ['Storage', 'SettingsApi', 'Activity', 'Listener', 'Template'];
    var missingAPIs = [];

    for (var i = 0; i < requiredAPIs.length; i++) {
        if (!Lampa[requiredAPIs[i]]) {
            missingAPIs.push(requiredAPIs[i]);
        }
    }

    if (missingAPIs.length > 0) {
        console.error('[DrxSuperMenu] Missing Lampa APIs:', missingAPIs.join(', '));
        return;
    }

    // Ensure Element.prototype methods exist (from app.min.js polyfills)
    if (typeof Element !== 'undefined') {
        // addClass
        if (!Element.prototype.addClass) {
            Element.prototype.addClass = function (classes) {
                var self = this;
                classes.split(' ').forEach(function (c) {
                    if (c && self.classList) {
                        self.classList.add(c);
                    }
                });
                return this;
            };
        }

        // removeClass
        if (!Element.prototype.removeClass) {
            Element.prototype.removeClass = function (classes) {
                var self = this;
                classes.split(' ').forEach(function (c) {
                    if (c && self.classList) {
                        self.classList.remove(c);
                    }
                });
                return this;
            };
        }

        // toggleClass
        if (!Element.prototype.toggleClass) {
            Element.prototype.toggleClass = function (classes, status) {
                var self = this;
                classes.split(' ').forEach(function (c) {
                    if (!c) return;
                    var has = self.classList.contains(c);
                    if (status && !has) {
                        self.classList.add(c);
                    } else if (!status && has) {
                        self.classList.remove(c);
                    }
                });
                return this;
            };
        }

        // hasClass
        if (!Element.prototype.hasClass) {
            Element.prototype.hasClass = function (className) {
                return this.classList && this.classList.contains(className);
            };
        }
    }

    console.log('[DrxSuperMenu] v1.0.0 - Lampa 3.0.5 compatibility layer initialized');

    // ============================================================================
    // CACHE AND STORAGE MANAGEMENT (copied from drxaos_themes v2.7.0)
    // ============================================================================

    var DRXAOS_CACHE_DEFAULT_TTL = 72 * 60 * 60 * 1000; // 72 hours
    var DRXAOS_CACHE_DEFAULT_LIMIT = 100 * 1024; // 100KB
    var drxaosRatingsCacheStore = null;
    var drxaosVoiceCacheStore = null;

    function drxaosSupportsLampaStorage() {
        return !!(window.Lampa &&
            Lampa.Storage &&
            typeof Lampa.Storage.get === 'function' &&
            typeof Lampa.Storage.set === 'function');
    }

    function drxaosCloneCacheObject(source) {
        var clone = {};
        if (!source || typeof source !== 'object') {
            return clone;
        }
        Object.keys(source).forEach(function (key) {
            clone[key] = source[key];
        });
        return clone;
    }

    function drxaosSerializeSize(obj) {
        try {
            return JSON.stringify(obj).length;
        } catch (err) {
            return Infinity;
        }
    }

    function createPersistentCache(storageKey, limitBytes, ttl) {
        var memoryCache = {};
        limitBytes = typeof limitBytes === 'number' && limitBytes > 0 ? limitBytes : 0;
        ttl = typeof ttl === 'number' && ttl > 0 ? ttl : DRXAOS_CACHE_DEFAULT_TTL;

        function now() {
            return Date.now();
        }

        function load() {
            var cache = memoryCache;
            if (drxaosSupportsLampaStorage()) {
                try {
                    var stored = Lampa.Storage.get(storageKey);
                    if (typeof stored === 'string') {
                        cache = JSON.parse(stored || '{}') || {};
                    } else if (stored && typeof stored === 'object') {
                        cache = stored;
                    } else {
                        cache = {};
                    }
                } catch (err) {
                    cache = {};
                }
            }
            memoryCache = drxaosCloneCacheObject(cache);
            return drxaosCloneCacheObject(memoryCache);
        }

        function prune(cache, lastKey) {
            var keys = Object.keys(cache);
            var currentTime = now();
            keys.forEach(function (key) {
                var item = cache[key];
                if (!item || typeof item !== 'object' || !item.timestamp || currentTime - item.timestamp > ttl) {
                    delete cache[key];
                }
            });

            if (!limitBytes) {
                return cache;
            }

            var sortedKeys = Object.keys(cache).sort(function (a, b) {
                return cache[a].timestamp - cache[b].timestamp;
            });

            var size = drxaosSerializeSize(cache);
            while (size > limitBytes && sortedKeys.length) {
                var candidate = sortedKeys.shift();
                if (candidate === lastKey && sortedKeys.length === 0) {
                    break;
                }
                delete cache[candidate];
                size = drxaosSerializeSize(cache);
            }

            if (limitBytes && lastKey && cache[lastKey] && drxaosSerializeSize(cache) > limitBytes) {
                delete cache[lastKey];
            }

            return cache;
        }

        function save(cache, lastKey) {
            var normalized = prune(drxaosCloneCacheObject(cache), lastKey);
            memoryCache = normalized;
            if (drxaosSupportsLampaStorage()) {
                try {
                    // Explicit JSON serialization guard for persistence reliability
                    Lampa.Storage.set(storageKey, JSON.stringify(normalized));
                } catch (err) {
                    // Fallback: try storing as object if JSON serialization fails
                    try {
                        Lampa.Storage.set(storageKey, normalized);
                    } catch (err2) {
                        memoryCache = normalized;
                    }
                }
            }
        }

        return {
            get: function (key) {
                if (!key) return null;
                var cache = load();
                var item = cache[key];
                if (!item || typeof item !== 'object') {
                    return null;
                }
                if (now() - item.timestamp > ttl) {
                    delete cache[key];
                    save(cache);
                    return null;
                }
                return item.value;
            },
            set: function (key, value) {
                if (!key) return;
                var cache = load();
                cache[key] = {
                    value: value,
                    timestamp: now()
                };
                save(cache, key);
            },
            remove: function (key) {
                if (!key) return;
                var cache = load();
                if (cache.hasOwnProperty(key)) {
                    delete cache[key];
                    save(cache);
                }
            },
            clear: function () {
                memoryCache = {};
                save({});
            }
        };
    }

    function getRatingsCacheStore() {
        if (!drxaosRatingsCacheStore) {
            drxaosRatingsCacheStore = createPersistentCache(
                'drx_ratings_cache',
                DRXAOS_CACHE_DEFAULT_LIMIT,
                DRXAOS_CACHE_DEFAULT_TTL
            );
        }
        return drxaosRatingsCacheStore;
    }

    function getVoiceCacheStore() {
        if (!drxaosVoiceCacheStore) {
            drxaosVoiceCacheStore = createPersistentCache(
                'drx_voice_cache',
                DRXAOS_CACHE_DEFAULT_LIMIT,
                DRXAOS_CACHE_DEFAULT_TTL
            );
        }
        return drxaosVoiceCacheStore;
    }

    // ============================================================================
    // CONFIGURATION
    // ============================================================================

    var SuperMenuConfig = {
        VERSION: '1.0.0',
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
            isBrowser: false,
            isTV: false
        },

        LABEL_COLORS: {
            vivid: {
                TYPE: {
                    movie: '#FFD54F',
                    tv: '#4CAF50',
                    anime: '#E91E63'
                },
                QUALITY: {
                    '4K': '#FF5722',
                    '2160p': '#FF5722',
                    '1080p': '#03A9F4',
                    '720p': '#B0BEC5',
                    'SD': '#90A4AE',
                    'CAM': '#FF7043',
                    'HDR': '#FFC107'
                }
            },
            soft: {
                TYPE: {
                    movie: '#FFE082',
                    tv: '#A5D6A7',
                    anime: '#F48FB1'
                },
                QUALITY: {
                    '4K': '#FFAB91',
                    '2160p': '#FFAB91',
                    '1080p': '#81D4FA',
                    '720p': '#CFD8DC',
                    'SD': '#B0BEC5',
                    'CAM': '#FFAB91',
                    'HDR': '#FFD54F'
                }
            }
        },

        FEATURES: {
            label_colors: true,
            ratings_kp: true,
            voiceover_tracking: true,
            borderless_dark_theme: false,
            topbar_exit_menu: true
        }
    };

    // ============================================================================
    // UTILITIES
    // ============================================================================

    function log() {
        if (!SuperMenuConfig.DEBUG && !SuperMenuConfig.VERBOSE_LOGGING) return;
        try {
            console.log.apply(console, ['[DrxSuperMenu]'].concat([].slice.call(arguments)));
        } catch (e) {}
    }

    function debounce(fn, delay) {
        var timeout;
        return function () {
            var ctx = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                fn.apply(ctx, args);
            }, delay);
        };
    }

    function throttle(fn, limit) {
        var inThrottle;
        var lastArgs;
        var lastCtx;
        return function () {
            lastCtx = this;
            lastArgs = arguments;
            if (!inThrottle) {
                fn.apply(lastCtx, lastArgs);
                inThrottle = true;
                setTimeout(function () {
                    inThrottle = false;
                    if (lastArgs) {
                        fn.apply(lastCtx, lastArgs);
                        lastArgs = null;
                    }
                }, limit);
            }
        };
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    function initializeConfig() {
        try {
            // Validate and use Lampa.Platform safely
            if (Lampa.Platform && typeof Lampa.Platform.is === 'function') {
                SuperMenuConfig.PLATFORM.isAndroid = Lampa.Platform.is('android');
                SuperMenuConfig.PLATFORM.isWebOS = Lampa.Platform.is('webos');
                SuperMenuConfig.PLATFORM.isTizen = Lampa.Platform.is('tizen');
                SuperMenuConfig.PLATFORM.isBrowser = Lampa.Platform.is('browser');
                SuperMenuConfig.PLATFORM.isTV = Lampa.Platform.is('android') ||
                    Lampa.Platform.is('tizen') ||
                    Lampa.Platform.is('webos') ||
                    Lampa.Platform.is('orsay') ||
                    Lampa.Platform.is('netcast');
            } else {
                console.warn('[DrxSuperMenu] Lampa.Platform not available, using defaults');
            }

            // Adjust performance profile for Android
            if (SuperMenuConfig.PLATFORM.isAndroid) {
                SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY = 500;
                SuperMenuConfig.PERFORMANCE.THROTTLE_LIMIT = 150;
                SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE = 80;
            }

            // Load settings from storage
            SuperMenuConfig.DEBUG = drxaosSafeGet('drx_supermenu_debug', false);
            SuperMenuConfig.VERBOSE_LOGGING = drxaosSafeGet('drx_supermenu_verbose', false);

            SuperMenuConfig.FEATURES.label_colors = drxaosSafeGet('drx_label_colors', true);
            SuperMenuConfig.FEATURES.ratings_kp = drxaosSafeGet('drx_ratings_kp', true);
            SuperMenuConfig.FEATURES.voiceover_tracking = drxaosSafeGet('drx_voiceover_tracking', true);
            SuperMenuConfig.FEATURES.borderless_dark_theme = drxaosSafeGet('drx_borderless_theme', false);
            SuperMenuConfig.FEATURES.topbar_exit_menu = drxaosSafeGet('drx_exit_menu', true);

            console.log('[DrxSuperMenu] Configuration initialized', SuperMenuConfig.PLATFORM);
        } catch (err) {
            console.error('[DrxSuperMenu] Config initialization error:', err);
        }
    }

    // ============================================================================
    // CARD COLORING SYSTEM
    // ============================================================================

    var cardObserver = null;

    function initializeCardColoring() {
        if (!SuperMenuConfig.FEATURES.label_colors) {
            log('Card coloring disabled');
            return;
        }

        try {
            applyCardColoring();

            if (typeof MutationObserver !== 'undefined') {
                var throttledApply = throttle(applyCardColoring, SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE);
                
                cardObserver = new MutationObserver(function (mutations) {
                    throttledApply();
                });

                cardObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                log('Card coloring observer started');
            }

            console.log('[DrxSuperMenu] Card coloring initialized');
        } catch (err) {
            console.error('[DrxSuperMenu] Card coloring error:', err);
        }
    }

    function applyCardColoring() {
        try {
            var colorScheme = drxaosSafeGet('drx_color_scheme', 'vivid');
            var colors = SuperMenuConfig.LABEL_COLORS[colorScheme] || SuperMenuConfig.LABEL_COLORS.vivid;

            var qualityElements = document.querySelectorAll('.card__quality, .card-quality');
            qualityElements.forEach(function (el) {
                var text = el.textContent.trim().toUpperCase();
                var color = colors.QUALITY[text];
                if (color) {
                    el.style.color = color;
                    el.style.fontWeight = 'bold';
                }
            });

            var typeElements = document.querySelectorAll('.card--content-type, .card__type');
            typeElements.forEach(function (el) {
                var text = el.textContent.trim().toLowerCase();
                var color = colors.TYPE[text];
                if (color) {
                    el.style.color = color;
                    el.style.fontWeight = 'bold';
                }
            });

            log('Card colors applied');
        } catch (err) {
            log('Apply card coloring error:', err);
        }
    }

    // ============================================================================
    // KINOPOISK RATINGS INTEGRATION
    // ============================================================================

    function fetchJsonWithTimeout(url, options, timeoutMs) {
        return new Promise(function (resolve, reject) {
            var aborted = false;
            var timeout = setTimeout(function () {
                aborted = true;
                reject(new Error('Timeout ' + timeoutMs + 'ms for ' + url));
            }, timeoutMs || 8000);

            fetch(url, options || {})
                .then(function (res) {
                    if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url);
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

    function getKpRating(meta, callback) {
        if (!SuperMenuConfig.FEATURES.ratings_kp) {
            callback && callback(null);
            return;
        }

        try {
            var kpApiKey = drxaosSafeGet('drx_kp_api_key', '');
            if (!kpApiKey) {
                log('РљРџ API key not configured');
                callback && callback(null);
                return;
            }

            var key = (meta.kpId || meta.id || meta.title) + '_' + (meta.year || '');
            var cache = getRatingsCacheStore();
            var cached = cache ? cache.get(key) : null;
            
            if (cached) {
                log('РљРџ rating from cache:', key);
                callback && callback(cached);
                return;
            }

            var url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films?keyword=' +
                encodeURIComponent(meta.title) +
                (meta.year ? '&yearFrom=' + meta.year + '&yearTo=' + meta.year : '');

            fetchJsonWithTimeout(url, {
                headers: {
                    'X-API-KEY': kpApiKey
                }
            }, 8000)
                .then(function (json) {
                    var film = null;

                    if (json && Array.isArray(json.items) && json.items.length) {
                        film = json.items[0];
                    } else if (json && Array.isArray(json.films) && json.films.length) {
                        film = json.films[0];
                    }

                    if (!film) {
                        log('РљРџ film not found');
                        callback && callback(null);
                        return;
                    }

                    var value = Number(film.ratingImdb || film.ratingKinopoisk || film.rating);
                    var votes = Number(film.ratingImdbVoteCount || film.ratingKinopoiskVoteCount || film.votes);

                    if (!isFinite(value)) {
                        log('РљРџ invalid rating value');
                        callback && callback(null);
                        return;
                    }

                    var result = {
                        source: 'kp',
                        value: value,
                        votes: isFinite(votes) ? votes : undefined
                    };

                    if (cache) {
                        cache.set(key, result);
                        log('РљРџ rating cached:', key, result);
                    }

                    callback && callback(result);
                })
                .catch(function (err) {
                    log('РљРџ rating fetch error:', err);
                    callback && callback(null);
                });
        } catch (e) {
            log('getKpRating error:', e);
            callback && callback(null);
        }
    }

    // ============================================================================
    // VOICE TRACKING SYSTEM
    // ============================================================================

    function trackVoice(contentId, voiceData) {
        if (!SuperMenuConfig.FEATURES.voiceover_tracking) {
            return;
        }

        try {
            var cache = getVoiceCacheStore();
            if (!cache) return;

            cache.set(contentId, {
                voice: voiceData.voice,
                season: voiceData.season,
                episode: voiceData.episode,
                timestamp: Date.now()
            });
            log('Voice tracked:', contentId, voiceData);
        } catch (err) {
            log('trackVoice error:', err);
        }
    }

    function getTrackedVoice(contentId) {
        if (!SuperMenuConfig.FEATURES.voiceover_tracking) {
            return null;
        }

        try {
            var cache = getVoiceCacheStore();
            if (!cache) return null;

            return cache.get(contentId);
        } catch (err) {
            log('getTrackedVoice error:', err);
            return null;
        }
    }

    function checkNewEpisodes(contentId, currentData) {
        try {
            var tracked = getTrackedVoice(contentId);
            if (!tracked) {
                log('No tracked voice for:', contentId);
                return false;
            }

            if (currentData.season > tracked.season) {
                log('New season detected:', currentData.season, '>', tracked.season);
                return true;
            }
            if (currentData.season === tracked.season && currentData.episode > tracked.episode) {
                log('New episode detected:', currentData.episode, '>', tracked.episode);
                return true;
            }
            
            return false;
        } catch (err) {
            log('checkNewEpisodes error:', err);
            return false;
        }
    }

    // ============================================================================
    // BORDERLESS DARK THEME
    // ============================================================================

    var BORDERLESS_STYLE_ID = 'drx-borderless-theme-style';
    var BORDERLESS_CSS = `
/* DrxSuperMenu Borderless Dark Theme */
body.drx-borderless-active .card .card__quality,
body.drx-borderless-active .card .card-quality,
body.drx-borderless-active .card .card__next-episode,
body.drx-borderless-active .card .card__status,
body.drx-borderless-active .card .card__season,
body.drx-borderless-active .card .card__runtime,
body.drx-borderless-active .card .card__country,
body.drx-borderless-active .card .card__year,
body.drx-borderless-active .card .card--content-type,
body.drx-borderless-active .card .card__rate,
body.drx-borderless-active .card .card__vote,
body.drx-borderless-active .card .card__age {
    background: none !important;
    background-color: transparent !important;
    background-image: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    border: 0 !important;
    border-color: transparent !important;
}

body.drx-borderless-active .card {
    border-radius: 0.4em !important;
}

body.drx-borderless-active .card__view {
    border-radius: 0.4em !important;
}
`;

    function toggleBorderlessTheme(enable) {
        try {
            var existingStyle = document.getElementById(BORDERLESS_STYLE_ID);

            if (enable) {
                if (!existingStyle) {
                    var style = document.createElement('style');
                    style.id = BORDERLESS_STYLE_ID;
                    style.textContent = BORDERLESS_CSS;
                    document.head.appendChild(style);
                    log('Borderless theme CSS injected');
                }
                document.body.classList.add('drx-borderless-active');
            } else {
                if (existingStyle) {
                    existingStyle.parentNode.removeChild(existingStyle);
                    log('Borderless theme CSS removed');
                }
                document.body.classList.remove('drx-borderless-active');
            }

            drxaosSafeSet('drx_borderless_theme', enable);
            SuperMenuConfig.FEATURES.borderless_dark_theme = enable;
        } catch (err) {
            log('toggleBorderlessTheme error:', err);
        }
    }

    // ============================================================================
    // EXIT MENU BUTTON
    // ============================================================================

    function initializeExitMenu() {
        if (!SuperMenuConfig.FEATURES.topbar_exit_menu) {
            log('Exit menu disabled');
            return;
        }

        try {
            // Guard Panel API availability
            if (!Lampa.Panel || typeof Lampa.Panel.add !== 'function') {
                console.warn('[DrxSuperMenu] Panel API not available or incomplete');
                return;
            }

            var exitButton = {
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
                title: 'РњРµРЅСЋ РІС‹С…РѕРґР°',
                action: function () {
                    showExitMenu();
                }
            };

            Lampa.Panel.add(exitButton);
            console.log('[DrxSuperMenu] Exit menu button added to panel');
        } catch (err) {
            console.error('[DrxSuperMenu] Exit menu initialization error:', err);
        }
    }

    function showExitMenu() {
        try {
            // Guard Select API availability
            if (Lampa.Select && typeof Lampa.Select.show === 'function') {
                Lampa.Select.show({
                    title: 'РњРµРЅСЋ РІС‹С…РѕРґР°',
                    items: [
                        { title: 'Р—Р°РєСЂС‹С‚СЊ РїСЂРёР»РѕР¶РµРЅРёРµ', value: 'exit' },
                        { title: 'РџРµСЂРµР·Р°РіСЂСѓР·РёС‚СЊ', value: 'reload' },
                        { title: 'РћС‡РёСЃС‚РёС‚СЊ РєСЌС€', value: 'clear_cache' },
                        { title: 'РќР°СЃС‚СЂРѕР№РєРё', value: 'settings' }
                    ],
                    onSelect: function (item) {
                        handleExitMenuAction(item.value);
                    },
                    onBack: function () {
                        Lampa.Controller.toggle('content');
                    }
                });
            } else if (Lampa.Noty) {
                Lampa.Noty.show('РњРµРЅСЋ РІС‹С…РѕРґР° - С„СѓРЅРєС†РёРѕРЅР°Р» РІ СЂР°Р·СЂР°Р±РѕС‚РєРµ');
            }
        } catch (err) {
            log('showExitMenu error:', err);
        }
    }

    function handleExitMenuAction(action) {
        try {
            switch (action) {
                case 'exit':
                    exitApp();
                    break;
                case 'reload':
                    window.location.reload();
                    break;
                case 'clear_cache':
                    if (Lampa.Storage) {
                        Lampa.Storage.clear();
                        if (Lampa.Noty) Lampa.Noty.show('РљСЌС€ РѕС‡РёС‰РµРЅ');
                    }
                    break;
                case 'settings':
                    if (Lampa.Activity) {
                        Lampa.Activity.push({ url: '', title: 'РќР°СЃС‚СЂРѕР№РєРё', component: 'settings' });
                    }
                    break;
            }
        } catch (err) {
            log('handleExitMenuAction error:', err);
        }
    }

    function exitApp() {
        try {
            if (Lampa.Platform && typeof Lampa.Platform.is === 'function') {
                if (Lampa.Platform.is('tizen')) {
                    tizen.application.getCurrentApplication().exit();
                } else if (Lampa.Platform.is('webos')) {
                    window.close();
                } else if (Lampa.Platform.is('android')) {
                    if (Lampa.Android && Lampa.Android.exit) {
                        Lampa.Android.exit();
                    }
                } else if (Lampa.Platform.is('browser')) {
                    window.close();
                }
            }
        } catch (err) {
            log('exitApp error:', err);
        }
    }

    // ============================================================================
    // SETTINGS COMPONENT
    // ============================================================================

    function initializeSettings() {
        try {
            // Guard SettingsApi availability
            if (!Lampa.SettingsApi || typeof Lampa.SettingsApi.addComponent !== 'function') {
                console.warn('[DrxSuperMenu] SettingsApi not available or incomplete');
                return;
            }

            Lampa.SettingsApi.addComponent({
                component: 'drx_supermenu',
                name: 'DrxSuperMenu',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6M1 12h6m6 0h6"></path></svg>'
            });

            Lampa.SettingsApi.addParam({
                component: 'drx_supermenu',
                param: {
                    name: 'drx_label_colors',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: 'Р Р°СЃРєСЂР°СЃРєР° РјРµС‚РѕРє РєР°С‡РµСЃС‚РІР°',
                    description: 'Р¦РІРµС‚РЅС‹Рµ РјРµС‚РєРё 4K/FHD/HD РЅР° РєР°СЂС‚РѕС‡РєР°С…'
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.label_colors = value;
                    if (value) {
                        initializeCardColoring();
                    } else if (cardObserver) {
                        cardObserver.disconnect();
                    }
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'drx_supermenu',
                param: {
                    name: 'drx_color_scheme',
                    type: 'select',
                    values: {
                        vivid: 'РЇСЂРєРёРµ С†РІРµС‚Р°',
                        soft: 'РњСЏРіРєРёРµ С†РІРµС‚Р°'
                    },
                    default: 'vivid'
                },
                field: {
                    name: 'Р¦РІРµС‚РѕРІР°СЏ СЃС…РµРјР°',
                    description: 'Р’С‹Р±РѕСЂ РЅР°СЃС‹С‰РµРЅРЅРѕСЃС‚Рё С†РІРµС‚РѕРІ РјРµС‚РѕРє'
                },
                onChange: function (value) {
                    applyCardColoring();
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'drx_supermenu',
                param: {
                    name: 'drx_ratings_kp',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: 'Р РµР№С‚РёРЅРіРё РљРёРЅРѕРџРѕРёСЃРєР°',
                    description: 'РџРѕР»СѓС‡РµРЅРёРµ СЂРµР№С‚РёРЅРіРѕРІ СЃ API РљРёРЅРѕРџРѕРёСЃРєР°'
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.ratings_kp = value;
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'drx_supermenu',
                param: {
                    name: 'drx_kp_api_key',
                    type: 'input',
                    default: ''
                },
                field: {
                    name: 'API РєР»СЋС‡ РљРёРЅРѕРџРѕРёСЃРєР°',
                    description: 'Р’Р°С€ РєР»СЋС‡ РґР»СЏ kinopoiskapiunofficial.tech'
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'drx_supermenu',
                param: {
                    name: 'drx_voiceover_tracking',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: 'РўСЂРµРєРёРЅРі РѕР·РІСѓС‡РµРє',
                    description: 'РћС‚СЃР»РµР¶РёРІР°РЅРёРµ РїРѕСЃР»РµРґРЅРµР№ РІС‹Р±СЂР°РЅРЅРѕР№ РѕР·РІСѓС‡РєРё'
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.voiceover_tracking = value;
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'drx_supermenu',
                param: {
                    name: 'drx_borderless_theme',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: 'РўРµРјР° Р±РµР· СЂР°РјРѕРє',
                    description: 'РЈР±СЂР°С‚СЊ С„РѕРЅС‹ Сѓ РјРµС‚РѕРє РЅР° РєР°СЂС‚РѕС‡РєР°С…'
                },
                onChange: function (value) {
                    toggleBorderlessTheme(value);
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'drx_supermenu',
                param: {
                    name: 'drx_exit_menu',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: 'РљРЅРѕРїРєР° РјРµРЅСЋ РІС‹С…РѕРґР°',
                    description: 'РџРѕРєР°Р·С‹РІР°С‚СЊ РєРЅРѕРїРєСѓ РІ РІРµСЂС…РЅРµР№ РїР°РЅРµР»Рё'
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.topbar_exit_menu = value;
                    if (Lampa.Noty) {
                        Lampa.Noty.show('РџРµСЂРµР·Р°РїСѓСЃС‚РёС‚Рµ РїСЂРёР»РѕР¶РµРЅРёРµ РґР»СЏ РїСЂРёРјРµРЅРµРЅРёСЏ');
                    }
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'drx_supermenu',
                param: {
                    name: 'drx_supermenu_debug',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: 'Р РµР¶РёРј РѕС‚Р»Р°РґРєРё',
                    description: 'РџРѕРґСЂРѕР±РЅРѕРµ Р»РѕРіРёСЂРѕРІР°РЅРёРµ РІ РєРѕРЅСЃРѕР»СЊ'
                },
                onChange: function (value) {
                    SuperMenuConfig.DEBUG = value;
                }
            });

            console.log('[DrxSuperMenu] Settings component registered');
        } catch (err) {
            console.error('[DrxSuperMenu] Settings initialization error:', err);
        }
    }

    // ============================================================================
    // PUBLIC API EXPORT
    // ============================================================================

    function exportPublicAPI() {
        try {
            window.DrxSuperMenu = {
                version: SuperMenuConfig.VERSION,
                config: SuperMenuConfig,

                getRating: getKpRating,
                
                trackVoice: trackVoice,
                getTrackedVoice: getTrackedVoice,
                checkNewEpisodes: checkNewEpisodes,

                applyCardColors: applyCardColoring,
                
                toggleBorderlessTheme: toggleBorderlessTheme,

                clearCache: function () {
                    try {
                        var ratingsCache = getRatingsCacheStore();
                        var voiceCache = getVoiceCacheStore();
                        if (ratingsCache) ratingsCache.clear();
                        if (voiceCache) voiceCache.clear();
                        console.log('[DrxSuperMenu] Cache cleared');
                    } catch (err) {
                        console.error('[DrxSuperMenu] Cache clear error:', err);
                    }
                }
            };

            console.log('[DrxSuperMenu] Public API exported to window.DrxSuperMenu');
        } catch (err) {
            console.error('[DrxSuperMenu] API export error:', err);
        }
    }

    // ============================================================================
    // MAIN INITIALIZATION
    // ============================================================================

    try {
        initializeConfig();
        initializeCardColoring();
        toggleBorderlessTheme(drxaosSafeGet('drx_borderless_theme', false));
        initializeExitMenu();
        initializeSettings();
        exportPublicAPI();

        console.log('[DrxSuperMenu] v1.0.0 - Plugin initialization complete');
    } catch (err) {
        console.error('[DrxSuperMenu] Initialization error:', err);
    }

})();