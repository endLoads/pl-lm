(function () {
    "use strict";
    function init() {
        if (typeof Lampa === "undefined") return;

        // === БАЗОВАЯ КОНФИГУРАЦИЯ ПЛАГИНА ===
        var SuperMenuConfig = {
            DEBUG: false,
            VERBOSE_LOGGING: false,
            // Профиль производительности (базовый)
            PERFORMANCE: {
                DEBOUNCE_DELAY: 300,
                THROTTLE_LIMIT: 100,
                MUTATION_THROTTLE: 50
            },
            // Поведение в разных средах
            PLATFORM: {
                isAndroid: Lampa.Platform ? Lampa.Platform.is("android") : false,
                isWebOS: Lampa.Platform ? Lampa.Platform.is("webos") : false,
                isTizen: Lampa.Platform ? Lampa.Platform.is("tizen") : false,
                isBrowser: Lampa.Platform ? Lampa.Platform.is("browser") : true,
                isTV: false // Будет установлено ниже
            },
            // Цветовые схемы для меток качества и типа
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
            // Параметры рейтингов и API
            RATINGS: {
                tmdbApiKey: Lampa.Storage ? Lampa.Storage.get("tmdb_api_key", "") : "",
                kpApiKey: Lampa.Storage ? Lampa.Storage.get("kp_api_key", "") : "",
                kpApiUrl: "https://kinopoiskapiunofficial.tech/api/v2.1/films" // Обновлено до v2.1
            },
            // Кэш рейтингов (персистентный)
            RATING_CACHE: {
                tmdb: {},
                imdb: {},
                kp: {}
            },
            VOICEOVER: {
                enabled: false,
                cache: {}
            },
            // Включение/выключение подсистем
            FEATURES: {
                madness: true,
                madness_level: "normal", // off | normal | full
                ratings_tmdb: true,
                ratings_imdb: true,
                ratings_kp: true,
                ratings_other: false,
                label_colors: true,
                voiceover_tracking: false,
                topbar_exit_menu: true,
                borderless_dark_theme: true
            }
        };

        // Установка PLATFORM.isTV с fallback
        SuperMenuConfig.PLATFORM.isTV = SuperMenuConfig.PLATFORM.isAndroid || SuperMenuSuperMenuConfig.PLATFORM.isTizen || SuperMenuConfig.PLATFORM.isWebOS;

        // === УТИЛИТЫ ===
        function safeLog() {
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
                }, delay || SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY);
            };
        }

        function throttle(fn, limit) {
            var inThrottle, lastArgs, lastCtx;
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
                    }, limit || SuperMenuConfig.PERFORMANCE.THROTTLE_LIMIT);
                }
            };
        }

        // Безопасный Storage wrapper (как в themes)
        function safeStorageGet(key, defaultValue) {
            try {
                if (!Lampa || !Lampa.Storage) return defaultValue;
                return Lampa.Storage.get(key, defaultValue);
            } catch (e) {
                safeLog("[Storage Error]", e);
                return defaultValue;
            }
        }

        function safeStorageSet(key, value) {
            try {
                if (!Lampa || !Lampa.Storage) return false;
                Lampa.Storage.set(key, value);
                return true;
            } catch (e) {
                safeLog("[Storage Set Error]", e);
                return false;
            }
        }

        // Загрузка конфига из Storage
        Object.keys(SuperMenuConfig.FEATURES).forEach(function(key) {
            SuperMenuConfig.FEATURES[key] = safeStorageGet("supermenu_" + key, SuperMenuConfig.FEATURES[key]);
        });
        SuperMenuConfig.LABEL_SCHEME = safeStorageGet("supermenu_label_scheme", "vivid");

        // Персистентный кэш для рейтингов
        function loadRatingCache(source) {
            var cached = safeStorageGet("supermenu_rating_cache_" + source, {});
            if (typeof cached === "object") SuperMenuConfig.RATING_CACHE[source] = cached;
        }
        ["tmdb", "imdb", "kp"].forEach(loadRatingCache);

        function saveRatingCache(source) {
            safeStorageSet("supermenu_rating_cache_" + source, SuperMenuConfig.RATING_CACHE[source]);
        }

        // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РЕЙТИНГОВ ===
        function fetchJsonWithTimeout(url, options, timeoutMs) {
            return new Promise(function(resolve, reject) {
                var aborted = false;
                var timeout = setTimeout(function() {
                    aborted = true;
                    reject(new Error("Timeout " + (timeoutMs || 8000) + "ms for " + url));
                }, timeoutMs || 8000);
                // Используем Lampa.TMDB если доступно для TMDB
                if (url.includes("themoviedb.org") && Lampa.TMDB && Lampa.TMDB.api) {
                    try {
                        var apiPath = url.split("themoviedb.org/3")[1];
                        Lampa.TMDB.api(apiPath).then(resolve).catch(reject);
                        clearTimeout(timeout);
                        return;
                    } catch (e) {}
                }
                fetch(url, options || {})
                    .then(function(res) {
                        if (!res.ok) throw new Error("HTTP " + res.status + " for " + url);
                        return res.json();
                    })
                    .then(function(json) {
                        if (!aborted) {
                            clearTimeout(timeout);
                            resolve(json);
                        }
                    })
                    .catch(function(err) {
                        if (!aborted) {
                            clearTimeout(timeout);
                            reject(err);
                        }
                    });
            });
        }

        function getRatingFromCache(source, key) {
            var cache = SuperMenuConfig.RATING_CACHE[source];
            return cache ? (cache[key] || null) : null;
        }

        function setRatingToCache(source, key, value) {
            var cache = SuperMenuConfig.RATING_CACHE[source];
            if (cache) {
                cache[key] = { value: value, timestamp: Date.now() };
                saveRatingCache(source);
            }
        }

        function getTmdbRating(meta, cb) {
            if (!SuperMenuConfig.FEATURES.ratings_tmdb) {
                cb && cb(null);
                return;
            }
            try {
                var key = meta.tmdb_id || meta.id || (meta.title + "_" + (meta.year || ""));
                var cached = getRatingFromCache("tmdb", key);
                if (cached && (Date.now() - cached.timestamp < 24*60*60*1000)) { // 24h TTL
                    cb && cb(cached.value);
                    return;
                }
                // Fallback на built-in как в themes
                var tmdbKey = SuperMenuConfig.RATINGS.tmdbApiKey || "c87a543116135a4120443155bf680876";
                if (!Lampa.TMDB || !tmdbKey) {
                    cb && cb(null);
                    return;
                }
                var type = meta.name ? "tv" : "movie";
                var url = Lampa.TMDB.api(type + "/" + (meta.tmdb_id || meta.id) + "?language=ru-RU");
                fetchJsonWithTimeout(url, {}, 5000)
                    .then(function(data) {
                        var value = data.vote_average;
                        if (value && value > 0) {
                            setRatingToCache("tmdb", key, value);
                            cb && cb(value);
                        } else {
                            cb && cb(null);
                        }
                    })
                    .catch(function() {
                        cb && cb(null);
                    });
            } catch (e) {
                safeLog("getTmdbRating error:", e);
                cb && cb(null);
            }
        }

        function getImdbRating(meta, cb) {
            if (!SuperMenuConfig.FEATURES.ratings_imdb) {
                cb && cb(null);
                return;
            }
            try {
                var key = meta.imdb_id || meta.id || (meta.title + "_" + (meta.year || ""));
                var cached = getRatingFromCache("imdb", key);
                if (cached && (Date.now() - cached.timestamp < 24*60*60*1000)) {
                    cb && cb(cached.value);
                    return;
                }
                // Через TMDB, так как прямой IMDB API нестабилен
                getTmdbRating(meta, function(tmdb) {
                    if (tmdb) cb && cb(tmdb); else cb && cb(null);
                });
            } catch (e) {
                safeLog("getImdbRating error:", e);
                cb && cb(null);
            }
        }

        function getKpRating(meta, cb) {
            if (!SuperMenuConfig.FEATURES.ratings_kp) {
                cb && cb(null);
                return;
            }
            try {
                var key = meta.kp_id || meta.id || (meta.title + "_" + (meta.year || ""));
                var cached = getRatingFromCache("kp", key);
                if (cached && (Date.now() - cached.timestamp < 24*60*60*1000)) {
                    cb && cb(cached.value);
                    return;
                }
                if (!SuperMenuConfig.RATINGS.kpApiKey) {
                    safeLog("KP API key missing");
                    cb && cb(null);
                    return;
                }
                var url = SuperMenuConfig.RATINGS.kpApiUrl + "/searchByKeyword?keyword=" + encodeURIComponent(meta.title) + (meta.year ? "&yearFrom=" + meta.year + "&yearTo=" + meta.year : "");
                fetchJsonWithTimeout(url, {
                    headers: { "X-API-KEY": SuperMenuConfig.RATINGS.kpApiKey }
                }, 8000)
                    .then(function(json) {
                        var film = (json.films && json.films[0]) || null;
                        if (!film) {
                            cb && cb(null);
                            return;
                        }
                        var value = Number(film.ratingKinopoisk || film.rating || 0);
                        var votes = Number(film.ratingKinopoiskVoteCount || film.votes || 0);
                        if (value > 0) {
                            var result = { source: "kp", value: value, votes: votes };
                            setRatingToCache("kp", key, value);
                            cb && cb(result);
                        } else {
                            cb && cb(null);
                        }
                    })
                    .catch(function(err) {
                        safeLog("getKpRating fetch error:", err);
                        cb && cb(null);
                    });
            } catch (e) {
                safeLog("getKpRating error:", e);
                cb && cb(null);
            }
        }

        // Применение рейтингов к картам (throttled)
        var ratingObserver = null;
        function applyRatingsToCards() {
            if (!SuperMenuConfig.FEATURES.ratings_tmdb && !SuperMenuConfig.FEATURES.ratings_imdb && !SuperMenuConfig.FEATURES.ratings_kp) return;
            var cards = document.querySelectorAll(".card");
            cards.forEach(throttle(function(card) {
                var meta = card._lampa_data || {}; // Lampa's card data
                if (!meta.title || !meta.id) return;
                var voteEl = card.querySelector(".card__vote, .card--vote");
                if (!voteEl) return;
                var loadRatings = [];
                if (SuperMenuConfig.FEATURES.ratings_tmdb) loadRatings.push(getTmdbRating.bind(null, meta));
                if (SuperMenuConfig.FEATURES.ratings_imdb) loadRatings.push(getImdbRating.bind(null, meta));
                if (SuperMenuConfig.FEATURES.ratings_kp) loadRatings.push(getKpRating.bind(null, meta));
                Promise.all(loadRatings.map(function(fn) { return new Promise(fn); }))
                    .then(function(ratings) {
                        var avg = ratings.filter(Boolean).reduce(function(sum, r) { return sum + r; }, 0) / ratings.filter(Boolean).length;
                        if (avg > 0) {
                            voteEl.textContent = avg.toFixed(1);
                            voteEl.style.color = "#FFD700"; // Золотой как в themes
                            voteEl.style.background = "transparent";
                            voteEl.classList.add("drxaos-badge-visible");
                        }
                    });
            }, 100));
        }

        // Observer для карт
        function startRatingObserver() {
            if (ratingObserver) return;
            ratingObserver = new MutationObserver(debounce(applyRatingsToCards, 200));
            ratingObserver.observe(document.body, { childList: true, subtree: true, attributes: true });
        }

        // === МЕНЮ ВЫХОДА (адаптация menus.js) ===
        var ExitMenuConfig = {
            visibilityValues: { 1: "Скрыть", 2: "Отобразить" },
            items: [
                { name: "exit", defaultValue: "2", title: "Закрыть приложение" },
                { name: "reboot", defaultValue: "2", title: "Перезагрузить" },
                { name: "switch_server", defaultValue: "2", title: "Сменить сервер" },
                { name: "clear_cache", defaultValue: "2", title: "Очистить кэш" },
                { name: "youtube", defaultValue: "1", title: "YouTube" },
                { name: "rutube", defaultValue: "1", title: "RuTube" },
                { name: "drm_play", defaultValue: "1", title: "DRM Play" },
                { name: "twitch", defaultValue: "1", title: "Twitch" },
                { name: "fork_player", defaultValue: "1", title: "ForkPlayer" },
                { name: "speedtest", defaultValue: "1", title: "Speed Test" }
            ]
        };

        function exitMenuEnsureDefaults() {
            try {
                var defaults = {
                    back_plug: true,
                    exit: "2", reboot: "2", switch_server: "2", clear_cache: "2",
                    youtube: "1", rutube: "1", drm_play: "1", twitch: "1",
                    fork_player: "1", speedtest: "1"
                };
                Object.keys(defaults).forEach(function(key) {
                    if (safeStorageGet(key, null) === null) {
                        safeStorageSet(key, defaults[key]);
                    }
                });
            } catch (e) {
                safeLog("exitMenuEnsureDefaults error:", e);
            }
        }

        // Интеграция с Lampa.SettingsPanel
        if (Lampa.SettingsPanel) {
            Lampa.SettingsPanel.addGroup({
                id: "supermenu_exit",
                title: "SuperMenu - Меню выхода",
                items: ExitMenuConfig.items.map(function(item) {
                    return {
                        name: item.name,
                        type: "select",
                        values: ExitMenuConfig.visibilityValues,
                        defaultValue: item.defaultValue,
                        title: item.title,
                        onChange: function(val) {
                            safeStorageSet(item.name, val);
                        }
                    };
                })
            });
        }

        function exitMenuAction(name) {
            var value = safeStorageGet(name, "1");
            if (value !== "2") return;
            switch (name) {
                case "exit":
                    if (Lampa.Platform && Lampa.Platform.is("android")) {
                        Lampa.Android.exit();
                    } else if (Lampa.Platform && Lampa.Platform.is("tizen")) {
                        tizen.application.getCurrentApplication().exit();
                    } else {
                        window.close();
                    }
                    break;
                case "reboot":
                    if (Lampa.Platform && Lampa.Platform.is("android")) {
                        Lampa.Android.reboot();
                    }
                    break;
                case "clear_cache":
                    if (Lampa.Storage) Lampa.Storage.clear();
                    location.reload();
                    break;
                // Другие actions (YouTube и т.д.) - redirect или launch
                case "youtube":
                    window.open("https://www.youtube.com", "_blank");
                    break;
                // ... аналогично для остальных
                default:
                    safeLog("Unknown exit action:", name);
            }
        }

        // Topbar интеграция
        if (SuperMenuConfig.FEATURES.topbar_exit_menu && Lampa.Listener) {
            Lampa.Listener.follow("app", function(e) {
                if (e.type === "focus" && e.elem && e.elem.classList.contains("head")) {
                    var topbar = e.elem.querySelector(".head__actions");
                    if (topbar) {
                        var btn = document.createElement("div");
                        btn.className = "head__action selector";
                        btn.innerHTML = '<div class="head__icon">🚪</div>'; // Иконка
                        btn.onclick = function() { exitMenuAction("exit"); };
                        topbar.appendChild(btn);
                    }
                }
            });
        }

        // === ЦВЕТОВЫЕ БЕЙДЖИ ===
        var labelObserver = null;
        function applyLabelColors() {
            if (!SuperMenuConfig.FEATURES.label_colors) return;
            var scheme = SuperMenuConfig.LABEL_COLORS[SuperMenuConfig.LABEL_SCHEME];
            var cards = document.querySelectorAll(".card");
            cards.forEach(function(card) {
                // Качество
                var qualityEl = card.querySelector(".card__quality, .card-quality");
                if (qualityEl) {
                    var qual = qualityEl.textContent.toUpperCase();
                    var color = scheme.QUALITY[qual] || "#90A4AE";
                    qualityEl.style.color = color;
                    qualityEl.style.background = "transparent";
                    qualityEl.style.border = "1px solid " + color;
                    qualityEl.style.borderRadius = "4px";
                }
                // Тип
                var typeEl = card.querySelector(".card__type, .card--content-type");
                if (typeEl) {
                    var type = card.classList.contains("card--tv") ? "tv" : "movie"; // Автоопределение
                    var color = scheme.TYPE[type] || "#B0BEC5";
                    typeEl.style.color = color;
                    typeEl.style.background = "transparent";
                }
            });
        }

        function startLabelObserver() {
            if (labelObserver) return;
            labelObserver = new MutationObserver(debounce(applyLabelColors, 150));
            labelObserver.observe(document.body, { childList: true, subtree: true });
        }

        // === MADNESS РЕЖИМ (как в themes, но упрощённый) ===
        if (SuperMenuConfig.FEATURES.madness) {
            var madnessLevel = SuperMenuConfig.FEATURES.madness_level;
            // Подъём рядов, hero-info и т.д. - копируем CSS из themes, но адаптируем
            var madnessCSS = `
                body.supermenu-madness .items-line { transform: translateY(-50px); margin-top: -20px; }
                body.supermenu-madness .drxaos-xu-info { padding-bottom: 0; } /* Интеграция с themes */
                @media (min-width: 1280px) { body.supermenu-madness .items-line:first-child { margin-top: -80px; } }
            `;
            var style = document.createElement("style");
            style.id = "supermenu-madness-css";
            style.textContent = madnessCSS;
            document.head.appendChild(style);
            document.body.classList.add("supermenu-madness");

            // Level: full - добавляем hero-bg если level="full"
            if (madnessLevel === "full") {
                // Аналог drxaos-xu-background из themes
                var heroBg = document.createElement("div");
                heroBg.className = "supermenu-hero-bg";
                heroBg.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent); z-index: -1;";
                document.body.appendChild(heroBg);
            }
        }

        // === BORDERLESS DARK THEME ===
        if (SuperMenuConfig.FEATURES.borderless_dark_theme) {
            var themeCSS = `
                body { background: #000; color: #fff; border: none !important; }
                .card { border: none; border-radius: 0; box-shadow: none; }
                .head, .settings { background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); }
                .items-line__title { color: #FFD700; } /* Золотой */
                /* Иконки для меню */
                .head__action::before { content: "⚙️"; font-size: 1.2em; }
                .selector.focus { outline: none; box-shadow: 0 0 10px rgba(255,215,0,0.5); }
            `;
            var themeStyle = document.createElement("style");
            themeStyle.id = "supermenu-theme-css";
            themeStyle.textContent = themeCSS;
            document.head.appendChild(themeStyle);
        }

        // === VOICEOVER TRACKING ===
        if (SuperMenuConfig.FEATURES.voiceover_tracking && Lampa.Voice) {
            SuperMenuConfig.VOICEOVER.enabled = true;
            Lampa.Listener.follow("player", function(e) {
                if (e.type === "start" && e.data && e.data.subtitle_track) {
                    var track = e.data.subtitle_track;
                    if (track.lang === "ru" && track.type === "voice") {
                        safeStorageSet("supermenu_voiceover_" + e.data.id, true);
                    }
                }
            });
        }

        // === ИНИЦИАЛИЗАЦИЯ ===
        exitMenuEnsureDefaults();
        startRatingObserver();
        startLabelObserver();
        applyRatingsToCards();
        applyLabelColors();
        safeLog("SuperMenu initialized v1.0 - All features enabled");

        // Cleanup on unload
        window.addEventListener("beforeunload", function() {
            if (ratingObserver) ratingObserver.disconnect();
            if (labelObserver) labelObserver.disconnect();
        });
    }

    // Запуск после загрузки Lampa
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
