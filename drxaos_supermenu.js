/* ║ ┌────────────────────────────────────────────────────────────────────────┐ ║
   ║ │ 💰 ПОДДЕРЖКА РАЗРАБОТЧИКА / SUPPORT THE DEVELOPER                  │ ║
   ║ │                                                                      │ ║
   ║ │ 🇷🇺 Если вам нравится плагин и вы хотите поблагодарить копейкой:    │ ║
   ║ │ 🇺🇦 Якщо вам подобається плагін і ви хочете подякувати копійчиною:  │ ║
   ║ │ 🇬🇧 If you like the plugin and want to say thanks:                  │ ║
   ║ │                                                                      │ ║
   ║ │ 💳 USDT (TRC-20): TBLUWM16Eiufc6GLJaMGxaFy7oTBiDgar8              │ ║
   ║ │                                                                      │ ║
   ║ │ 🙏 Каждый донат мотивирует на дальнейшую разработку!               │ ║
   ║ │ 🙏 Кожен донат мотивує на подальший розвиток!                      │ ║
   ║ │ 🙏 Every donation motivates further development!                     │ ║
   ║ └────────────────────────────────────────────────────────────────────────┘ ║
   ║                                                                            ║
   ║ Спасибо за использование! / Дякую за використання! / Thank you for using! ║
   ║                                                                            ║
   ╚══════════════════════════════════════════════════════════════════════════════╝ */

/*
 * ============================================================================
 * DRXAOS SuperMenu v1.0.0 - Advanced Menu Plugin for Lampa
 * ============================================================================
 *
 * LAMPA 3.0.5 COMPATIBILITY UPDATE
 *
 * Features:
 * - Enhanced exit menu with customizable items
 * - Multi-source ratings (TMDB, IMDb, Kinopoisk)
 * - Quality and type labels with color schemes
 * - Madness mode integration
 * - Performance optimized for Android TV/Fire TV
 *
 * Requirements:
 * - Lampa 3.0.5+ (app_digital >= 305)
 * - TMDB API key (optional)
 * - Kinopoisk API key (optional)
 *
 * ============================================================================
 */

/* jshint esversion: 6, bitwise: false */

(function () {
    'use strict';

    // ============================================================================
    // LAMPA 3.0.5 COMPATIBILITY LAYER
    // ============================================================================

    // Safe Storage wrapper functions
    function drxaosSafeGet(key, defaultValue) {
        try {
            if (!window.Lampa || !Lampa.Storage) return defaultValue;
            var value = Lampa.Storage.get(key, defaultValue);
            return value !== undefined ? value : defaultValue;
        } catch (e) {
            console.warn('[SuperMenu] Storage.get error:', e);
            return defaultValue;
        }
    }

    function drxaosSafeSet(key, value) {
        try {
            if (!window.Lampa || !Lampa.Storage) return false;
            Lampa.Storage.set(key, value);
            return true;
        } catch (e) {
            console.warn('[SuperMenu] Storage.set error:', e);
            return false;
        }
    }

    if (!window.Lampa) {
        console.error('[SuperMenu] Lampa API not found');
        return;
    }

    // Validate critical APIs
    var requiredAPIs = ['Storage', 'SettingsApi', 'Activity', 'Listener', 'Template', 'Platform', 'Utils'];
    var missingAPIs = [];
    for (var i = 0; i < requiredAPIs.length; i++) {
        if (!Lampa[requiredAPIs[i]]) {
            missingAPIs.push(requiredAPIs[i]);
        }
    }
    if (missingAPIs.length > 0) {
        console.error('[SuperMenu] Missing Lampa APIs:', missingAPIs.join(', '));
        return;
    }

    // jQuery compatibility
    var $ = window.jQuery || (window.Lampa && window.Lampa.$);
    if (!$) {
        console.warn('[SuperMenu] jQuery not available');
    }

    console.log('[SuperMenu] v1.0.0 - Lampa 3.0.5 compatibility layer initialized');

    // ============================================================================
    // PLUGIN CONFIGURATION
    // ============================================================================

    var SuperMenuConfig = {
        DEBUG: false,
        VERBOSE_LOGGING: false,
        
        PERFORMANCE: {
            DEBOUNCE_DELAY: 300,
            THROTTLE_LIMIT: 100,
            MUTATION_THROTTLE: 50
        },
        
        PLATFORM: {
            isAndroid: Lampa.Platform.is("android"),
            isWebOS: Lampa.Platform.is("webos"),
            isTizen: Lampa.Platform.is("tizen"),
            isBrowser: Lampa.Platform.is("browser"),
            isTV: Lampa.Platform.is("android") || Lampa.Platform.is("tizen") || Lampa.Platform.is("webos") || Lampa.Platform.is("orsay") || Lampa.Platform.is("netcast")
        },
        
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
            enabled: false,
            cache: Object.create(null)
        },
        
        FEATURES: {
            madness: true,
            madness_level: "normal",
            ratings_tmdb: true,
            ratings_imdb: true,
            ratings_kp: true,
            ratings_other: false,
            label_colors: true,
            voiceover_tracking: false,
            topbar_exit_menu: true,
            borderless_dark_theme: false
        }
    };

    // Android TV performance profile
    if (SuperMenuConfig.PLATFORM.isAndroid) {
        SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY = 500;
        SuperMenuConfig.PERFORMANCE.THROTTLE_LIMIT = 150;
        SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE = 80;
    }

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    function log() {
        if (!SuperMenuConfig.DEBUG && !SuperMenuConfig.VERBOSE_LOGGING) return;
        try {
            console.log.apply(console, ["[SuperMenu]"].concat([].slice.call(arguments)));
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

    function fetchJsonWithTimeout(url, options, timeoutMs) {
        return new Promise(function (resolve, reject) {
            var aborted = false;
            var timeout = setTimeout(function () {
                aborted = true;
                reject(new Error("Timeout " + timeoutMs + "ms for " + url));
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
    // RATINGS SYSTEM
    // ============================================================================

    function getRatingFromCache(source, key) {
        var cache = SuperMenuConfig.RATING_CACHE[source];
        if (!cache) return null;
        return cache[key] || null;
    }

    function setRatingToCache(source, key, value) {
        var cache = SuperMenuConfig.RATING_CACHE[source];
        if (!cache) return;
        cache[key] = value;
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
            log("getTmdbRating error:", e);
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
            cb && cb(null);
        } catch (e) {
            log("getImdbRating error:", e);
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
            
            if (!SuperMenuConfig.RATINGS.kpApiKey || !SuperMenuConfig.RATINGS.kpApiUrl) {
                cb && cb(null);
                return;
            }
            
            var url = SuperMenuConfig.RATINGS.kpApiUrl + "?keyword=" + encodeURIComponent(meta.title) + (meta.year ? "&yearFrom=" + meta.year + "&yearTo=" + meta.year : "");
            
            fetchJsonWithTimeout(
                url,
                { headers: { "X-API-KEY": SuperMenuConfig.RATINGS.kpApiKey } },
                8000
            )
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
                
                var value = Number(film.ratingImdb || film.ratingKinopoisk || film.rating);
                var votes = Number(film.ratingImdbVoteCount || film.ratingKinopoiskVoteCount || film.votes);
                
                if (!isFinite(value)) {
                    cb && cb(null);
                    return;
                }
                
                var result = { source: "kp", value: value, votes: isFinite(votes) ? votes : undefined };
                setRatingToCache("kp", key, result);
                cb && cb(result);
            })
            .catch(function (err) {
                log("getKpRating fetch error:", err);
                cb && cb(null);
            });
        } catch (e) {
            log("getKpRating error:", e);
            cb && cb(null);
        }
    }

    function getAllRatings(meta, cb) {
        var results = {
            tmdb: null,
            imdb: null,
            kp: null
        };
        var pending = 3;
        
        function check() {
            pending--;
            if (pending === 0) {
                cb && cb(results);
            }
        }
        
        getTmdbRating(meta, function (r) {
            results.tmdb = r;
            check();
        });
        
        getImdbRating(meta, function (r) {
            results.imdb = r;
            check();
        });
        
        getKpRating(meta, function (r) {
            results.kp = r;
            check();
        });
    }

    // ============================================================================
    // LABEL SYSTEM (Quality + Type)
    // ============================================================================

    function extractQuality(item) {
        var text = String(item.title || item.name || item.quality || "").toLowerCase();
        if (text.indexOf("4k") >= 0 || text.indexOf("2160") >= 0) return "4K";
        if (text.indexOf("hdr") >= 0) return "HDR";
        if (text.indexOf("1080") >= 0) return "1080p";
        if (text.indexOf("720") >= 0) return "720p";
        if (text.indexOf("cam") >= 0 || text.indexOf("camrip") >= 0) return "CAM";
        return "SD";
    }

    function extractType(item) {
        var type = item.type || item.content_type || item.movie_type || "";
        if (type === "tv" || type === "series") return "tv";
        if (type === "anime") return "anime";
        return "movie";
    }

    function getColorForQuality(quality) {
        if (!SuperMenuConfig.FEATURES.label_colors) return "#999";
        var scheme = SuperMenuConfig.LABEL_COLORS[SuperMenuConfig.LABEL_SCHEME] || SuperMenuConfig.LABEL_COLORS.vivid;
        return scheme.QUALITY[quality] || "#999";
    }

    function getColorForType(type) {
        if (!SuperMenuConfig.FEATURES.label_colors) return "#999";
        var scheme = SuperMenuConfig.LABEL_COLORS[SuperMenuConfig.LABEL_SCHEME] || SuperMenuConfig.LABEL_COLORS.vivid;
        return scheme.TYPE[type] || "#999";
    }

    function createLabel(text, color, className) {
        var label = document.createElement("span");
        label.className = "supermenu-label " + (className || "");
        label.textContent = text;
        label.style.cssText = 
            "display:inline-block;padding:2px 6px;margin:0 4px 4px 0;font-size:10px;font-weight:bold;color:#fff;background:" + color + ";border-radius:3px;text-transform:uppercase;";
        return label;
    }

    function addLabelsToCard(cardElement, item) {
        if (!cardElement || !item) return;
        
        try {
            var labelsContainer = cardElement.querySelector(".supermenu-labels");
            if (labelsContainer) return; // Already added
            
            labelsContainer = document.createElement("div");
            labelsContainer.className = "supermenu-labels";
            labelsContainer.style.cssText = "position:absolute;bottom:8px;left:8px;z-index:10;display:flex;flex-wrap:wrap;max-width:calc(100% - 16px);";
            
            var quality = extractQuality(item);
            var type = extractType(item);
            
            if (quality) {
                var qLabel = createLabel(quality, getColorForQuality(quality), "quality-label");
                labelsContainer.appendChild(qLabel);
            }
            
            if (type) {
                var tLabel = createLabel(type, getColorForType(type), "type-label");
                labelsContainer.appendChild(tLabel);
            }
            
            var cardBody = cardElement.querySelector(".card__view, .card, .poster");
            if (cardBody) {
                cardBody.style.position = "relative";
                cardBody.appendChild(labelsContainer);
            }
        } catch (e) {
            log("addLabelsToCard error:", e);
        }
    }

    // ============================================================================
    // MADNESS MODE
    // ============================================================================

    var madnessStyles = {
        normal: `
            .supermenu-madness-mode .card__view {
                animation: madness-shake 0.5s infinite;
            }
            @keyframes madness-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-2px) rotate(-0.5deg); }
                75% { transform: translateX(2px) rotate(0.5deg); }
            }
        `,
        intense: `
            .supermenu-madness-mode .card__view {
                animation: madness-intense 0.3s infinite;
                filter: hue-rotate(0deg);
            }
            @keyframes madness-intense {
                0% { transform: translateX(0) translateY(0) rotate(0deg); filter: hue-rotate(0deg); }
                25% { transform: translateX(-4px) translateY(-2px) rotate(-1deg); filter: hue-rotate(90deg); }
                50% { transform: translateX(4px) translateY(2px) rotate(1deg); filter: hue-rotate(180deg); }
                75% { transform: translateX(-2px) translateY(4px) rotate(-0.5deg); filter: hue-rotate(270deg); }
                100% { transform: translateX(0) translateY(0) rotate(0deg); filter: hue-rotate(360deg); }
            }
        `,
        insane: `
            .supermenu-madness-mode .card__view {
                animation: madness-insane 0.2s infinite, madness-color 1s infinite;
            }
            @keyframes madness-insane {
                0% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
                10% { transform: translateX(-6px) translateY(-4px) rotate(-2deg) scale(1.05); }
                20% { transform: translateX(6px) translateY(4px) rotate(2deg) scale(0.95); }
                30% { transform: translateX(-4px) translateY(6px) rotate(-1deg) scale(1.02); }
                40% { transform: translateX(8px) translateY(-6px) rotate(2deg) scale(0.98); }
                50% { transform: translateX(-8px) translateY(8px) rotate(-2deg) scale(1.05); }
                60% { transform: translateX(6px) translateY(-4px) rotate(1deg) scale(0.95); }
                70% { transform: translateX(-6px) translateY(6px) rotate(-1deg) scale(1.02); }
                80% { transform: translateX(4px) translateY(-8px) rotate(2deg) scale(0.98); }
                90% { transform: translateX(-4px) translateY(4px) rotate(-1deg) scale(1.05); }
                100% { transform: translateX(0) translateY(0) rotate(0deg) scale(1); }
            }
            @keyframes madness-color {
                0% { filter: hue-rotate(0deg) saturate(2); }
                100% { filter: hue-rotate(360deg) saturate(2); }
            }
        `
    };

    function enableMadnessMode(level) {
        if (!SuperMenuConfig.FEATURES.madness) return;
        
        try {
            var root = document.documentElement || document.body;
            if (!root) return;
            
            root.classList.add("supermenu-madness-mode");
            
            var existingStyle = document.getElementById("supermenu-madness-style");
            if (existingStyle) {
                existingStyle.remove();
            }
            
            var style = document.createElement("style");
            style.id = "supermenu-madness-style";
            style.textContent = madnessStyles[level] || madnessStyles.normal;
            document.head.appendChild(style);
            
            log("Madness mode enabled:", level);
        } catch (e) {
            log("enableMadnessMode error:", e);
        }
    }

    function disableMadnessMode() {
        try {
            var root = document.documentElement || document.body;
            if (root) {
                root.classList.remove("supermenu-madness-mode");
            }
            
            var style = document.getElementById("supermenu-madness-style");
            if (style) {
                style.remove();
            }
            
            log("Madness mode disabled");
        } catch (e) {
            log("disableMadnessMode error:", e);
        }
    }

    // ============================================================================
    // EXIT MENU
    // ============================================================================

    var ExitMenuConfig = {
        enabled: true,
        items: [
            {
                title: "Выход из приложения",
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 17l5-5-5-5M19.8 12H9M10 3H4v18h6" stroke="currentColor" stroke-width="2"/></svg>',
                action: function () {
                    log("Exit app requested");
                    if (window.Lampa && Lampa.Activity && Lampa.Activity.out) {
                        Lampa.Activity.out();
                    }
                    if (typeof window.close === "function") {
                        window.close();
                    }
                }
            },
            {
                title: "Настройки Android TV",
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm7.5-2c0-.28-.22-.5-.5-.5h-1.88c-.26-1.21-.82-2.32-1.63-3.21l1.33-1.33c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.33 1.33c-.89-.81-2-1.37-3.21-1.63V5.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5v1.88c-1.21.26-2.32.82-3.21 1.63L6.03 7.68c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.33 1.33c-.81.89-1.37 2-1.63 3.21H3.5c-.28 0-.5.22-.5.5s.22.5.5.5h1.88c.26 1.21.82 2.32 1.63 3.21l-1.33 1.33c-.2.2-.2.51 0 .71.1.1.23.15.36.15s.26-.05.36-.15l1.33-1.33c.89.81 2 1.37 3.21 1.63v1.88c0 .28.22.5.5.5s.5-.22.5-.5v-1.88c1.21-.26 2.32-.82 3.21-1.63l1.33 1.33c.1.1.23.15.36.15s.26-.05.36-.15c.2-.2.2-.51 0-.71l-1.33-1.33c.81-.89 1.37-2 1.63-3.21h1.88c.28 0 .5-.22.5-.5z" fill="currentColor"/></svg>',
                action: function () {
                    log("Opening Android TV settings");
                    if (SuperMenuConfig.PLATFORM.isAndroid) {
                        try {
                            if (window.Android && typeof window.Android.openSettings === "function") {
                                window.Android.openSettings();
                            } else if (typeof window.plugins !== "undefined" && window.plugins.intentShim) {
                                window.plugins.intentShim.startActivity(
                                    { action: "android.settings.SETTINGS" },
                                    function () { log("Settings opened"); },
                                    function (err) { log("Settings error:", err); }
                                );
                            } else {
                                Lampa.Noty && Lampa.Noty.show("Функция недоступна на этом устройстве");
                            }
                        } catch (e) {
                            log("openSettings error:", e);
                            Lampa.Noty && Lampa.Noty.show("Ошибка открытия настроек");
                        }
                    } else {
                        Lampa.Noty && Lampa.Noty.show("Доступно только на Android TV");
                    }
                }
            },
            {
                title: "Перезагрузка приложения",
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/></svg>',
                action: function () {
                    log("Reloading app");
                    if (window.location && typeof window.location.reload === "function") {
                        window.location.reload();
                    }
                }
            },
            {
                title: "Очистить кэш",
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>',
                action: function () {
                    log("Clearing cache");
                    try {
                        if (window.Lampa && Lampa.Storage && typeof Lampa.Storage.clear === "function") {
                            Lampa.Storage.clear();
                        }
                        if (window.localStorage) {
                            localStorage.clear();
                        }
                        if (window.sessionStorage) {
                            sessionStorage.clear();
                        }
                        Lampa.Noty && Lampa.Noty.show("Кэш очищен");
                        setTimeout(function () {
                            if (window.location && typeof window.location.reload === "function") {
                                window.location.reload();
                            }
                        }, 1500);
                    } catch (e) {
                        log("clearCache error:", e);
                        Lampa.Noty && Lampa.Noty.show("Ошибка очистки кэша");
                    }
                }
            }
        ]
    };

    function createExitMenu() {
        if (!SuperMenuConfig.FEATURES.topbar_exit_menu || !ExitMenuConfig.enabled) return;
        
        try {
            var existing = document.querySelector(".supermenu-exit-button");
            if (existing) return;
            
            var topBar = document.querySelector(".head__actions, .header__actions, .header");
            if (!topBar) {
                log("Top bar not found for exit menu");
                return;
            }
            
            var exitButton = document.createElement("div");
            exitButton.className = "supermenu-exit-button head__action selector";
            exitButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 17l5-5-5-5M19.8 12H9M10 3H4v18h6" stroke="currentColor" stroke-width="2"/></svg>';
            exitButton.style.cssText = "cursor:pointer;padding:10px;margin:0 5px;";
            
            exitButton.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                showExitMenu();
            });
            
            if ($ && $(exitButton).length) {
                $(exitButton).on("hover:focus", function () {
                    $(this).addClass("focus");
                });
                $(exitButton).on("hover:blur", function () {
                    $(this).removeClass("focus");
                });
            }
            
            topBar.appendChild(exitButton);
            log("Exit menu button added");
        } catch (e) {
            log("createExitMenu error:", e);
        }
    }

    function showExitMenu() {
        try {
            if (!window.Lampa || !Lampa.Select) {
                log("Lampa.Select not available");
                return;
            }
            
            var select = new Lampa.Select({
                title: "Меню выхода",
                items: ExitMenuConfig.items.map(function (item) {
                    return {
                        title: item.title,
                        icon: item.icon
                    };
                }),
                onSelect: function (selected) {
                    var item = ExitMenuConfig.items[selected.index];
                    if (item && typeof item.action === "function") {
                        item.action();
                    }
                },
                onBack: function () {
                    Lampa.Controller.toggle("content");
                }
            });
            
            select.create();
            Lampa.Controller.add("select", {
                invisible: true,
                toggle: function () {},
                back: function () {
                    select.destroy();
                }
            });
            Lampa.Controller.toggle("select");
        } catch (e) {
            log("showExitMenu error:", e);
        }
    }

    // ============================================================================
    // DOM OBSERVER & CARD PROCESSING
    // ============================================================================

    var cardProcessingQueue = [];
    var isProcessingCards = false;

    function processCard(cardElement) {
        try {
            var item = {};
            
            var titleEl = cardElement.querySelector(".card__title, .card-title, .title");
            if (titleEl) {
                item.title = titleEl.textContent.trim();
            }
            
            var qualityEl = cardElement.querySelector(".card__quality, .quality");
            if (qualityEl) {
                item.quality = qualityEl.textContent.trim();
            }
            
            addLabelsToCard(cardElement, item);
        } catch (e) {
            log("processCard error:", e);
        }
    }

    function processCardQueue() {
        if (isProcessingCards || cardProcessingQueue.length === 0) return;
        
        isProcessingCards = true;
        var batch = cardProcessingQueue.splice(0, 10);
        
        batch.forEach(function (card) {
            processCard(card);
        });
        
        isProcessingCards = false;
        
        if (cardProcessingQueue.length > 0) {
            setTimeout(processCardQueue, 50);
        }
    }

    var debouncedProcessQueue = debounce(processCardQueue, SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY);

    function observeDOM() {
        try {
            if (!window.MutationObserver) {
                log("MutationObserver not supported");
                return;
            }
            
            var observer = new MutationObserver(throttle(function (mutations) {
                var cardsToProcess = [];
                
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        for (var i = 0; i < mutation.addedNodes.length; i++) {
                            var node = mutation.addedNodes[i];
                            if (node.nodeType === 1) {
                                if (node.classList && (node.classList.contains("card") || node.classList.contains("poster"))) {
                                    cardsToProcess.push(node);
                                }
                                var cards = node.querySelectorAll && node.querySelectorAll(".card, .poster");
                                if (cards && cards.length > 0) {
                                    for (var j = 0; j < cards.length; j++) {
                                        cardsToProcess.push(cards[j]);
                                    }
                                }
                            }
                        }
                    }
                });
                
                if (cardsToProcess.length > 0) {
                    cardProcessingQueue = cardProcessingQueue.concat(cardsToProcess);
                    debouncedProcessQueue();
                }
            }, SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE));
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            log("DOM observer initialized");
        } catch (e) {
            log("observeDOM error:", e);
        }
    }

    // ============================================================================
    // BORDERLESS DARK THEME
    // ============================================================================

    function applyBorderlessDarkTheme() {
        if (!SuperMenuConfig.FEATURES.borderless_dark_theme) return;
        
        try {
            var style = document.createElement("style");
            style.id = "supermenu-borderless-theme";
            style.textContent = `
                /* Borderless Dark Theme */
                body, .app, .wrap {
                    background: #0a0a0a !important;
                }
                .card, .card__view, .poster {
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
                    background: #1a1a1a !important;
                }
                .card:hover, .card.focus {
                    box-shadow: 0 6px 20px rgba(255,255,255,0.1) !important;
                    transform: translateY(-4px);
                    transition: all 0.3s ease;
                }
                .head, .header, .menu {
                    background: #0f0f0f !important;
                    border: none !important;
                }
                .button, .selector {
                    background: #2a2a2a !important;
                    border: none !important;
                    color: #fff !important;
                }
                .button:hover, .button.focus, .selector:hover, .selector.focus {
                    background: #3a3a3a !important;
                    box-shadow: 0 0 10px rgba(255,255,255,0.2) !important;
                }
                .scroll {
                    background: #1a1a1a !important;
                }
                input, textarea, select {
                    background: #2a2a2a !important;
                    border: 1px solid #3a3a3a !important;
                    color: #fff !important;
                }
            `;
            document.head.appendChild(style);
            log("Borderless dark theme applied");
        } catch (e) {
            log("applyBorderlessDarkTheme error:", e);
        }
    }

    // ============================================================================
    // SETTINGS INTEGRATION
    // ============================================================================

    function registerSettings() {
        try {
            if (!window.Lampa || !Lampa.SettingsApi || !Lampa.Template) {
                log("SettingsApi not available");
                return;
            }
            
            Lampa.SettingsApi.addComponent({
                component: "supermenu_settings",
                name: "SuperMenu",
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="currentColor"/></svg>'
            });
            
            Lampa.SettingsApi.addParam({
                component: "supermenu_settings",
                param: {
                    name: "supermenu_madness",
                    type: "trigger",
                    default: false
                },
                field: {
                    name: "Madness Mode",
                    description: "Включить безумный режим анимации"
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.madness = value;
                    drxaosSafeSet("supermenu_madness", value);
                    if (value) {
                        enableMadnessMode(SuperMenuConfig.FEATURES.madness_level);
                    } else {
                        disableMadnessMode();
                    }
                }
            });
            
            Lampa.SettingsApi.addParam({
                component: "supermenu_settings",
                param: {
                    name: "supermenu_madness_level",
                    type: "select",
                    values: {
                        normal: "Нормальный",
                        intense: "Интенсивный",
                        insane: "Безумный"
                    },
                    default: "normal"
                },
                field: {
                    name: "Уровень Madness",
                    description: "Выберите интенсивность безумия"
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.madness_level = value;
                    drxaosSafeSet("supermenu_madness_level", value);
                    if (SuperMenuConfig.FEATURES.madness) {
                        enableMadnessMode(value);
                    }
                }
            });
            
            Lampa.SettingsApi.addParam({
                component: "supermenu_settings",
                param: {
                    name: "supermenu_ratings_tmdb",
                    type: "trigger",
                    default: true
                },
                field: {
                    name: "TMDB рейтинги",
                    description: "Показывать рейтинги TMDB"
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.ratings_tmdb = value;
                    drxaosSafeSet("supermenu_ratings_tmdb", value);
                }
            });
            
            Lampa.SettingsApi.addParam({
                component: "supermenu_settings",
                param: {
                    name: "supermenu_ratings_imdb",
                    type: "trigger",
                    default: true
                },
                field: {
                    name: "IMDb рейтинги",
                    description: "Показывать рейтинги IMDb"
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.ratings_imdb = value;
                    drxaosSafeSet("supermenu_ratings_imdb", value);
                }
            });
            
            Lampa.SettingsApi.addParam({
                component: "supermenu_settings",
                param: {
                    name: "supermenu_ratings_kp",
                    type: "trigger",
                    default: true
                },
                field: {
                    name: "Кинопоиск рейтинги",
                    description: "Показывать рейтинги Кинопоиска"
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.ratings_kp = value;
                    drxaosSafeSet("supermenu_ratings_kp", value);
                }
            });
            
            Lampa.SettingsApi.addParam({
                component: "supermenu_settings",
                param: {
                    name: "supermenu_kp_api_key",
                    type: "input",
                    default: ""
                },
                field: {
                    name: "Кинопоиск API ключ",
                    description: "Введите ключ API от kinopoiskapiunofficial.tech"
                },
                onChange: function (value) {
                    SuperMenuConfig.RATINGS.kpApiKey = value;
                    drxaosSafeSet("supermenu_kp_api_key", value);
                }
            });
            
            Lampa.SettingsApi.addParam({
                component: "supermenu_settings",
                param: {
                    name: "supermenu_label_colors",
                    type: "trigger",
                    default: true
                },
                field: {
                    name: "Цветные метки",
                    description: "Показывать цветные метки качества и типа"
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.label_colors = value;
                    drxaosSafeSet("supermenu_label_colors", value);
                }
            });
            
            Lampa.SettingsApi.addParam({
                component: "supermenu_settings",
                param: {
                    name: "supermenu_label_scheme",
                    type: "select",
                    values: {
                        vivid: "Яркая",
                        soft: "Мягкая"
                    },
                    default: "vivid"
                },
                field: {
                    name: "Цветовая схема",
                    description: "Выберите цветовую схему меток"
                },
                onChange: function (value) {
                    SuperMenuConfig.LABEL_SCHEME = value;
                    drxaosSafeSet("supermenu_label_scheme", value);
                }
            });
            
            Lampa.SettingsApi.addParam({
                component: "supermenu_settings",
                param: {
                    name: "supermenu_exit_menu",
                    type: "trigger",
                    default: true
                },
                field: {
                    name: "Меню выхода",
                    description: "Показывать кнопку меню выхода в топбаре"
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.topbar_exit_menu = value;
                    drxaosSafeSet("supermenu_exit_menu", value);
                    if (value) {
                        createExitMenu();
                    } else {
                        var btn = document.querySelector(".supermenu-exit-button");
                        if (btn) btn.remove();
                    }
                }
            });
            
            Lampa.SettingsApi.addParam({
                component: "supermenu_settings",
                param: {
                    name: "supermenu_borderless_theme",
                    type: "trigger",
                    default: false
                },
                field: {
                    name: "Borderless Dark Theme",
                    description: "Применить темную тему без рамок"
                },
                onChange: function (value) {
                    SuperMenuConfig.FEATURES.borderless_dark_theme = value;
                    drxaosSafeSet("supermenu_borderless_theme", value);
                    if (value) {
                        applyBorderlessDarkTheme();
                    } else {
                        var style = document.getElementById("supermenu-borderless-theme");
                        if (style) style.remove();
                    }
                }
            });
            
            log("Settings registered");
        } catch (e) {
            log("registerSettings error:", e);
        }
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    function loadSettings() {
        try {
            SuperMenuConfig.FEATURES.madness = drxaosSafeGet("supermenu_madness", false);
            SuperMenuConfig.FEATURES.madness_level = drxaosSafeGet("supermenu_madness_level", "normal");
            SuperMenuConfig.FEATURES.ratings_tmdb = drxaosSafeGet("supermenu_ratings_tmdb", true);
            SuperMenuConfig.FEATURES.ratings_imdb = drxaosSafeGet("supermenu_ratings_imdb", true);
            SuperMenuConfig.FEATURES.ratings_kp = drxaosSafeGet("supermenu_ratings_kp", true);
            SuperMenuConfig.RATINGS.kpApiKey = drxaosSafeGet("supermenu_kp_api_key", "");
            SuperMenuConfig.FEATURES.label_colors = drxaosSafeGet("supermenu_label_colors", true);
            SuperMenuConfig.LABEL_SCHEME = drxaosSafeGet("supermenu_label_scheme", "vivid");
            SuperMenuConfig.FEATURES.topbar_exit_menu = drxaosSafeGet("supermenu_exit_menu", true);
            SuperMenuConfig.FEATURES.borderless_dark_theme = drxaosSafeGet("supermenu_borderless_theme", false);
            
            log("Settings loaded");
        } catch (e) {
            log("loadSettings error:", e);
        }
    }

    function initialize() {
        try {
            log("Initializing SuperMenu v1.0.0");
            
            loadSettings();
            registerSettings();
            
            if (SuperMenuConfig.FEATURES.madness) {
                enableMadnessMode(SuperMenuConfig.FEATURES.madness_level);
            }
            
            if (SuperMenuConfig.FEATURES.borderless_dark_theme) {
                applyBorderlessDarkTheme();
            }
            
            if (SuperMenuConfig.FEATURES.topbar_exit_menu) {
                setTimeout(createExitMenu, 1000);
            }
            
            observeDOM();
            
            Lampa.Listener.follow("activity", function (e) {
                if (e.component === "full" || e.component === "category") {
                    setTimeout(function () {
                        var cards = document.querySelectorAll(".card, .poster");
                        cards.forEach(function (card) {
                            cardProcessingQueue.push(card);
                        });
                        debouncedProcessQueue();
                    }, 500);
                }
            });
            
            log("SuperMenu initialized successfully");
        } catch (e) {
            console.error("[SuperMenu] Initialization error:", e);
        }
    }

    // ============================================================================
    // PLUGIN MANIFEST
    // ============================================================================

    var manifest = {
        type: "video",
        version: "1.0.0",
        name: "SuperMenu",
        description: "Enhanced menu system with ratings, labels, madness mode and more",
        component: "supermenu",
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="currentColor"/></svg>'
    };

    function startPlugin() {
        if (!window.Lampa) {
            console.error("[SuperMenu] Lampa not found");
            return;
        }
        
        window.supermenu_plugin = manifest;
        
        if (Lampa.Manifest) {
            Lampa.Manifest.plugins = Lampa.Manifest.plugins || [];
            Lampa.Manifest.plugins.push(manifest);
        }
        
        setTimeout(initialize, 100);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startPlugin);
    } else {
        startPlugin();
    }

})();
