(function () {
    'use strict';

    // ============================================================================
    // DRXAOS SUPERMENU PLUGIN v1.0 - FIXED VERSION
    // Полнофункциональное расширение для Lampa/Lampac
    // ============================================================================
    
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
            isAndroid: false,
            isWebOS: false,
            isTizen: false,
            isBrowser: false,
            isTV: false
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
            tmdbApiKey: "",
            kpApiKey: "",
            kpApiUrl: "https://kinopoiskapiunofficial.tech/api/v2.2/films"
        },

        // Кэш рейтингов на время сессии
        RATING_CACHE: {
            tmdb: Object.create(null),
            imdb: Object.create(null),
            kp: Object.create(null)
        },

        VOICEOVER: {
            enabled: false,
            cache: Object.create(null)
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
            borderless_dark_theme: false
        }
    };

    var isInitialized = false;

    // === УТИЛИТЫ ===
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

    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ РЕЙТИНГОВ ===
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
                {
                    headers: {
                        "X-API-KEY": SuperMenuConfig.RATINGS.kpApiKey
                    }
                },
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

                    var value = Number(
                        film.ratingImdb || film.ratingKinopoisk || film.rating
                    );
                    var votes = Number(
                        film.ratingImdbVoteCount || film.ratingKinopoiskVoteCount || film.votes
                    );

                    if (!isFinite(value)) {
                        cb && cb(null);
                        return;
                    }

                    var result = {
                        source: "kp",
                        value: value,
                        votes: isFinite(votes) ? votes : undefined
                    };

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

    // === МЕНЮ ВЫХОДА (адаптация menus.js) ===
    var ExitMenuConfig = {
        visibilityValues: {
            1: "Скрыть",
            2: "Отобразить"
        },
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
                exit: "2",
                reboot: "2",
                switch_server: "2",
                clear_cache: "2",
                youtube: "1",
                rutube: "1",
                drm_play: "1",
                twitch: "1",
                fork_player: "1",
                speedtest: "1"
            };

            Object.keys(defaults).forEach(function (key) {
                if (Lampa.Storage && typeof Lampa.Storage.get === 'function') {
                    var stored = Lampa.Storage.get(key);
                    if (stored === undefined || stored === null) {
                        Lampa.Storage.set(key, defaults[key]);
                    }
                }
            });
        } catch (e) {
            log("exitMenuEnsureDefaults error:", e);
        }
    }

    function exitMenuSeason() {
        try {
            if (Lampa.Platform.is("apple_tv")) {
                window.location.assign("exit://exit");
            }
            if (Lampa.Platform.is("tizen")) {
                tizen.application.getCurrentApplication().exit();
            }
            if (Lampa.Platform.is("webos")) {
                window.close();
            }
            if (Lampa.Platform.is("android")) {
                Lampa.Android.exit();
            }
            if (Lampa.Platform.is("orsay")) {
                Lampa.Orsay.exit();
            }
            if (Lampa.Platform.is("netcast")) {
                window.NetCastBack();
            }
            if (Lampa.Platform.is("noname")) {
                window.history.back();
            }
            if (Lampa.Platform.is("browser")) {
                window.close();
            }
            if (Lampa.Platform.is("nw")) {
                nw.Window.get().close();
            }
        } catch (e) {
            log("exitMenuSeason error:", e);
        }
    }

    function exitMenuSpeedTest() {
        try {
            var wrapper = document.createElement('div');
            wrapper.innerHTML = '<div class="exit-menu-speedtest"><div class="speedtest-status">Выполняется тест скорости...</div></div>';
            document.body.appendChild(wrapper);
            
            setTimeout(function() {
                if (wrapper && wrapper.parentNode) {
                    wrapper.parentNode.removeChild(wrapper);
                }
            }, 3000);
        } catch (e) {
            log("exitMenuSpeedTest error:", e);
        }
    }

    // === РЕГИСТРАЦИЯ НАСТРОЕК ===
    function registerSettings() {
        try {
            if (!Lampa.SettingsApi) {
                log("SettingsApi недоступен");
                return;
            }

            Lampa.SettingsApi.addComponent({
                component: "supermenu",
                name: "SuperMenu",
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/><path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/><path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2"/></svg>'
            });

            // Настройки Madness режима
            Lampa.SettingsApi.addParam({
                component: "supermenu",
                param: {
                    name: "supermenu_madness",
                    type: "select",
                    values: {
                        off: "Выключено",
                        normal: "Обычный",
                        full: "Полный"
                    },
                    default: "normal"
                },
                field: {
                    name: "Madness режим",
                    description: "Расширенное отображение карточек"
                },
                onChange: function(value) {
                    SuperMenuConfig.FEATURES.madness_level = value;
                    applyUserSettings();
                }
            });

            // Настройки рейтингов
            Lampa.SettingsApi.addParam({
                component: "supermenu",
                param: {
                    name: "supermenu_ratings_tmdb",
                    type: "toggle",
                    default: true
                },
                field: {
                    name: "Рейтинг TMDB",
                    description: "Показывать рейтинг The Movie Database"
                },
                onChange: function(value) {
                    SuperMenuConfig.FEATURES.ratings_tmdb = value;
                }
            });

            Lampa.SettingsApi.addParam({
                component: "supermenu",
                param: {
                    name: "supermenu_ratings_imdb",
                    type: "toggle",
                    default: true
                },
                field: {
                    name: "Рейтинг IMDB",
                    description: "Показывать рейтинг Internet Movie Database"
                },
                onChange: function(value) {
                    SuperMenuConfig.FEATURES.ratings_imdb = value;
                }
            });

            Lampa.SettingsApi.addParam({
                component: "supermenu",
                param: {
                    name: "supermenu_ratings_kp",
                    type: "toggle",
                    default: true
                },
                field: {
                    name: "Рейтинг Кинопоиск",
                    description: "Показывать рейтинг Кинопоиск"
                },
                onChange: function(value) {
                    SuperMenuConfig.FEATURES.ratings_kp = value;
                }
            });

            // API ключи
            Lampa.SettingsApi.addParam({
                component: "supermenu",
                param: {
                    name: "supermenu_kp_api_key",
                    type: "input",
                    default: ""
                },
                field: {
                    name: "API ключ Кинопоиск",
                    description: "Получите ключ на kinopoiskapiunofficial.tech"
                },
                onChange: function(value) {
                    SuperMenuConfig.RATINGS.kpApiKey = value;
                }
            });

            // Цветовая схема
            Lampa.SettingsApi.addParam({
                component: "supermenu",
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
                    name: "Цветовая схема меток",
                    description: "Выберите стиль отображения меток качества"
                },
                onChange: function(value) {
                    SuperMenuConfig.LABEL_SCHEME = value;
                    colorizeAllVisibleCards();
                }
            });

            // Меню выхода
            Lampa.SettingsApi.addParam({
                component: "supermenu",
                param: {
                    name: "supermenu_exit_menu",
                    type: "toggle",
                    default: true
                },
                field: {
                    name: "Кнопка выхода в топбаре",
                    description: "Добавить кнопку выхода в верхнюю панель"
                },
                onChange: function(value) {
                    SuperMenuConfig.FEATURES.topbar_exit_menu = value;
                    if (value) {
                        registerTopBarButton();
                    } else {
                        removeTopBarButton();
                    }
                }
            });

            // Тёмная тема без рамок
            Lampa.SettingsApi.addParam({
                component: "supermenu",
                param: {
                    name: "supermenu_borderless_dark",
                    type: "toggle",
                    default: false
                },
                field: {
                    name: "Тёмная тема без рамок",
                    description: "Убрать рамки у карточек в тёмной теме"
                },
                onChange: function(value) {
                    SuperMenuConfig.FEATURES.borderless_dark_theme = value;
                    setBorderlessDarkThemeEnabled(value);
                }
            });

            log("Настройки зарегистрированы");
        } catch (e) {
            log("Ошибка регистрации настроек:", e);
        }
    }

    // === ПРИМЕНЕНИЕ ПОЛЬЗОВАТЕЛЬСКИХ НАСТРОЕК ===
    function applyUserSettings() {
        try {
            if (!Lampa.Storage) return;

            // Загрузка настроек
            SuperMenuConfig.FEATURES.madness_level = Lampa.Storage.get("supermenu_madness", "normal");
            SuperMenuConfig.FEATURES.ratings_tmdb = Lampa.Storage.get("supermenu_ratings_tmdb", true);
            SuperMenuConfig.FEATURES.ratings_imdb = Lampa.Storage.get("supermenu_ratings_imdb", true);
            SuperMenuConfig.FEATURES.ratings_kp = Lampa.Storage.get("supermenu_ratings_kp", true);
            SuperMenuConfig.RATINGS.kpApiKey = Lampa.Storage.get("supermenu_kp_api_key", "");
            SuperMenuConfig.LABEL_SCHEME = Lampa.Storage.get("supermenu_label_scheme", "vivid");
            SuperMenuConfig.FEATURES.topbar_exit_menu = Lampa.Storage.get("supermenu_exit_menu", true);
            SuperMenuConfig.FEATURES.borderless_dark_theme = Lampa.Storage.get("supermenu_borderless_dark", false);

            // Определение платформы
            if (Lampa.Platform) {
                SuperMenuConfig.PLATFORM.isAndroid = Lampa.Platform.is("android");
                SuperMenuConfig.PLATFORM.isWebOS = Lampa.Platform.is("webos");
                SuperMenuConfig.PLATFORM.isTizen = Lampa.Platform.is("tizen");
                SuperMenuConfig.PLATFORM.isBrowser = Lampa.Platform.is("browser");
                SuperMenuConfig.PLATFORM.isTV = 
                    SuperMenuConfig.PLATFORM.isAndroid ||
                    Lampa.Platform.is("tizen") ||
                    Lampa.Platform.is("webos") ||
                    Lampa.Platform.is("orsay") ||
                    Lampa.Platform.is("netcast");

                // Адаптация производительности для Android TV
                if (SuperMenuConfig.PLATFORM.isAndroid) {
                    SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY = 500;
                    SuperMenuConfig.PERFORMANCE.THROTTLE_LIMIT = 150;
                    SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE = 80;
                }
            }

            log("Настройки применены");
        } catch (e) {
            log("Ошибка применения настроек:", e);
        }
    }

    // === ОБРАБОТЧИК ИЗМЕНЕНИЙ НАСТРОЕК ===
    function onSettingsChanged(event) {
        try {
            if (!event || !event.name) return;
            
            if (event.name.indexOf("supermenu_") === 0) {
                applyUserSettings();
                
                // Перекрасить все видимые карточки при изменении схемы
                if (event.name === "supermenu_label_scheme") {
                    colorizeAllVisibleCards();
                }
            }
        } catch (e) {
            log("Ошибка обработки изменения настроек:", e);
        }
    }

    // === РАСКРАСКА МЕТОК ===
    function colorizeLabelsInContainer(container) {
        try {
            if (!container || !SuperMenuConfig.FEATURES.label_colors) return;

            var scheme = SuperMenuConfig.LABEL_COLORS[SuperMenuConfig.LABEL_SCHEME] || SuperMenuConfig.LABEL_COLORS.vivid;
            
            // Метки качества
            var qualityLabels = container.querySelectorAll('.card__quality, .card-quality');
            qualityLabels.forEach(function(label) {
                var text = (label.textContent || "").trim().toUpperCase();
                var color = scheme.QUALITY[text] || scheme.QUALITY["HD"] || "#03A9F4";
                label.style.backgroundColor = color;
                label.style.color = "#fff";
            });

            // Метки типа контента
            var typeLabels = container.querySelectorAll('.card__type, .card--content-type');
            typeLabels.forEach(function(label) {
                var text = (label.textContent || "").trim().toLowerCase();
                var color = scheme.TYPE[text] || scheme.TYPE["movie"] || "#FFD54F";
                label.style.backgroundColor = color;
                label.style.color = "#000";
            });

        } catch (e) {
            log("Ошибка раскраски меток:", e);
        }
    }

    function colorizeAllVisibleCards() {
        try {
            var containers = document.querySelectorAll('.items-line, .card, .full-start__poster');
            containers.forEach(function(container) {
                colorizeLabelsInContainer(container);
            });
        } catch (e) {
            log("Ошибка раскраски всех карточек:", e);
        }
    }

    // === ТЁМНАЯ ТЕМА БЕЗ РАМОК ===
    var borderlessDarkStyleId = "supermenu-borderless-dark-style";

    function setBorderlessDarkThemeEnabled(enabled) {
        try {
            var existingStyle = document.getElementById(borderlessDarkStyleId);
            
            if (enabled) {
                if (!existingStyle) {
                    var style = document.createElement("style");
                    style.id = borderlessDarkStyleId;
                    style.textContent = `
                        body.theme--dark .card__view {
                            border: none !important;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
                        }
                        body.theme--dark .card:hover .card__view,
                        body.theme--dark .card.focus .card__view {
                            box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important;
                        }
                    `;
                    document.head.appendChild(style);
                }
            } else {
                if (existingStyle) {
                    existingStyle.parentNode.removeChild(existingStyle);
                }
            }
        } catch (e) {
            log("Ошибка установки темы без рамок:", e);
        }
    }

    function injectBorderlessDarkTheme() {
        setBorderlessDarkThemeEnabled(SuperMenuConfig.FEATURES.borderless_dark_theme);
    }

    // === КНОПКА ВЫХОДА В ТОПБАРЕ ===
    var topBarExitButton = null;

    function registerTopBarButton() {
        try {
            if (!SuperMenuConfig.FEATURES.topbar_exit_menu) return;
            if (topBarExitButton) return; // Уже добавлена

            var head = document.querySelector('.head');
            if (!head) {
                log("Топбар не найден, попытка позже...");
                setTimeout(registerTopBarButton, 1000);
                return;
            }

            var actionsContainer = head.querySelector('.head__actions');
            if (!actionsContainer) {
                actionsContainer = document.createElement('div');
                actionsContainer.className = 'head__actions';
                head.appendChild(actionsContainer);
            }

            topBarExitButton = document.createElement('div');
            topBarExitButton.className = 'head__action selector supermenu-exit-btn';
            topBarExitButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            topBarExitButton.title = "Выход";

            topBarExitButton.addEventListener('click', function() {
                exitMenuSeason();
            });

            actionsContainer.appendChild(topBarExitButton);
            log("Кнопка выхода добавлена в топбар");

        } catch (e) {
            log("Ошибка добавления кнопки выхода:", e);
        }
    }

    function removeTopBarButton() {
        try {
            if (topBarExitButton && topBarExitButton.parentNode) {
                topBarExitButton.parentNode.removeChild(topBarExitButton);
                topBarExitButton = null;
            }
        } catch (e) {
            log("Ошибка удаления кнопки выхода:", e);
        }
    }

    // === MADNESS РЕЖИМ ===
    function initMadnessSectionHooks() {
        try {
            if (!SuperMenuConfig.FEATURES.madness) return;

            // Отслеживание добавления карточек
            var observer = new MutationObserver(throttle(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes && mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) {
                                if (node.classList && node.classList.contains('card')) {
                                    processMadnessCard(node);
                                } else if (node.querySelectorAll) {
                                    var cards = node.querySelectorAll('.card');
                                    cards.forEach(function(card) {
                                        processMadnessCard(card);
                                    });
                                }
                            }
                        });
                    }
                });
            }, SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE));

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            log("Madness режим инициализирован");
        } catch (e) {
            log("Ошибка инициализации Madness режима:", e);
        }
    }

    function processMadnessCard(card) {
        try {
            if (!card || card.dataset.supermenuProcessed === "true") return;
            card.dataset.supermenuProcessed = "true";

            // Раскраска меток
            colorizeLabelsInContainer(card);

            // Добавление рейтингов в зависимости от уровня madness
            if (SuperMenuConfig.FEATURES.madness_level === "normal" || SuperMenuConfig.FEATURES.madness_level === "full") {
                addRatingsToCard(card);
            }

            // В полном режиме - дополнительная информация
            if (SuperMenuConfig.FEATURES.madness_level === "full") {
                addExtendedInfoToCard(card);
            }

        } catch (e) {
            log("Ошибка обработки карточки Madness:", e);
        }
    }

    function addRatingsToCard(card) {
        try {
            // Извлечение данных карточки
            var titleEl = card.querySelector('.card__title');
            var yearEl = card.querySelector('.card__year');
            
            if (!titleEl) return;

            var meta = {
                title: titleEl.textContent.trim(),
                year: yearEl ? yearEl.textContent.trim() : null,
                tmdbId: card.dataset.tmdbId || null,
                imdbId: card.dataset.imdbId || null,
                kpId: card.dataset.kpId || null
            };

            // Создание контейнера для рейтингов
            var ratingsContainer = card.querySelector('.supermenu-ratings');
            if (!ratingsContainer) {
                ratingsContainer = document.createElement('div');
                ratingsContainer.className = 'supermenu-ratings';
                ratingsContainer.style.cssText = 'position: absolute; bottom: 5px; left: 5px; display: flex; gap: 5px; font-size: 0.8em; z-index: 3;';
                
                var cardView = card.querySelector('.card__view');
                if (cardView) {
                    cardView.appendChild(ratingsContainer);
                }
            }

            // Загрузка рейтингов
            if (SuperMenuConfig.FEATURES.ratings_tmdb) {
                getTmdbRating(meta, function(rating) {
                    if (rating) {
                        addRatingBadge(ratingsContainer, 'TMDB', rating.value, '#01d277');
                    }
                });
            }

            if (SuperMenuConfig.FEATURES.ratings_imdb) {
                getImdbRating(meta, function(rating) {
                    if (rating) {
                        addRatingBadge(ratingsContainer, 'IMDB', rating.value, '#f5c518');
                    }
                });
            }

            if (SuperMenuConfig.FEATURES.ratings_kp) {
                getKpRating(meta, function(rating) {
                    if (rating) {
                        addRatingBadge(ratingsContainer, 'КП', rating.value, '#ff6600');
                    }
                });
            }

        } catch (e) {
            log("Ошибка добавления рейтингов:", e);
        }
    }

    function addRatingBadge(container, label, value, color) {
        try {
            var badge = document.createElement('div');
            badge.className = 'supermenu-rating-badge';
            badge.style.cssText = 'background: ' + color + '; color: #000; padding: 2px 6px; border-radius: 3px; font-weight: 600; white-space: nowrap;';
            badge.textContent = label + ' ' + (typeof value === 'number' ? value.toFixed(1) : value);
            container.appendChild(badge);
        } catch (e) {
            log("Ошибка создания бейджа рейтинга:", e);
        }
    }

    function addExtendedInfoToCard(card) {
        try {
            // В полном режиме можно добавить дополнительные метаданные
            // Например: жанры, длительность, страну производства и т.д.
            // Это заглушка для будущего расширения
            log("Extended info для карточки (полный режим)");
        } catch (e) {
            log("Ошибка добавления расширенной информации:", e);
        }
    }

    // === ЭКСПОРТ API В WINDOW ===
    function exportAPI() {
        try {
            window.DrxSuperMenu = window.DrxSuperMenu || {};
            
            window.DrxSuperMenu.config = SuperMenuConfig;
            window.DrxSuperMenu.log = log;
            window.DrxSuperMenu.colorizeLabelsInContainer = colorizeLabelsInContainer;
            window.DrxSuperMenu.getTmdbRating = getTmdbRating;
            window.DrxSuperMenu.getImdbRating = getImdbRating;
            window.DrxSuperMenu.getKpRating = getKpRating;
            window.DrxSuperMenu.setBorderlessDarkThemeEnabled = setBorderlessDarkThemeEnabled;

            log("API экспортирован в window.DrxSuperMenu");
        } catch (e) {
            log("Ошибка экспорта API:", e);
        }
    }

    // === ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ===
    function initialize() {
        if (isInitialized) {
            log("Плагин уже инициализирован");
            return;
        }

        try {
            log("Инициализация SuperMenu плагина...");

            // Проверка наличия необходимых API
            if (!window.Lampa) {
                log("ОШИБКА: Lampa API не найден");
                return;
            }

            // Установка дефолтов для меню выхода
            exitMenuEnsureDefaults();

            // Регистрация настроек
            registerSettings();

            // Применение пользовательских настроек
            applyUserSettings();

            // Применение тёмной темы без рамок
            injectBorderlessDarkTheme();

            // Добавление кнопки выхода в топбар
            if (SuperMenuConfig.FEATURES.topbar_exit_menu) {
                registerTopBarButton();
            }

            // Инициализация Madness режима
            if (SuperMenuConfig.FEATURES.madness) {
                initMadnessSectionHooks();
            }

            // Подписка на изменения настроек
            if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.follow) {
                Lampa.Storage.listener.follow("change", onSettingsChanged);
            }

            // Экспорт API
            exportAPI();

            isInitialized = true;
            log("SuperMenu плагин успешно инициализирован");

        } catch (e) {
            log("КРИТИЧЕСКАЯ ОШИБКА инициализации:", e);
        }
    }

    // === ЭКСПОРТ МЕТОДОВ ПЛАГИНА (КРИТИЧЕСКИ ВАЖНО!) ===
    
    /**
     * Метод start() вызывается Lampa при загрузке плагина
     */
    this.start = function() {
        log("Метод start() вызван");
        initialize();
    };

    /**
     * Метод stop() вызывается Lampa при выгрузке плагина
     */
    this.stop = function() {
        log("Метод stop() вызван");
        try {
            // Очистка при выгрузке
            removeTopBarButton();
            
            var borderlessStyle = document.getElementById(borderlessDarkStyleId);
            if (borderlessStyle && borderlessStyle.parentNode) {
                borderlessStyle.parentNode.removeChild(borderlessStyle);
            }

            // Отписка от событий
            if (Lampa.Storage && Lampa.Storage.listener && Lampa.Storage.listener.unfollow) {
                Lampa.Storage.listener.unfollow("change", onSettingsChanged);
            }

            isInitialized = false;
            log("SuperMenu плагин остановлен");
        } catch (e) {
            log("Ошибка остановки плагина:", e);
        }
    };

    /**
     * Метод component() для интеграции с компонентами Lampa (опционально)
     */
    this.component = function(object) {
        log("Метод component() вызван с объектом:", object);
        // Здесь можно добавить логику интеграции с конкретными компонентами
        return object;
    };

}.call(this)); // КРИТИЧЕСКИ ВАЖНО: .call(this) вместо простого ()
