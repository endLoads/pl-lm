(function () {
    'use strict';

    // Проверка наличия Lampa API
    if (typeof Lampa === 'undefined') {
        console.error('[SuperMenu] Lampa API not found');
        return;
    }

    // ========================================================================
    // МАНИФЕСТ ПЛАГИНА
    // ========================================================================
    var manifest = {
        type: 'video',
        version: '1.0.0',
        name: 'DRXAOS SuperMenu',
        description: 'Advanced menu system with ratings, quality labels and exit menu',
        component: 'drxaos_supermenu',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="currentColor"/></svg>'
    };

    // ========================================================================
    // КОНФИГУРАЦИЯ
    // ========================================================================
    var SuperMenuConfig = {
        DEBUG: false,
        VERBOSE_LOGGING: false,

        PERFORMANCE: {
            DEBOUNCE_DELAY: 300,
            THROTTLE_LIMIT: 100,
            MUTATION_THROTTLE: 50
        },

        PLATFORM: {
            isAndroid: Lampa.Platform.is('android'),
            isWebOS: Lampa.Platform.is('webos'),
            isTizen: Lampa.Platform.is('tizen'),
            isBrowser: Lampa.Platform.is('browser'),
            isTV: Lampa.Platform.is('android') || Lampa.Platform.is('tizen') || 
                  Lampa.Platform.is('webos') || Lampa.Platform.is('orsay') || 
                  Lampa.Platform.is('netcast')
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

        LABEL_SCHEME: 'vivid',

        RATINGS: {
            tmdbApiKey: '',
            kpApiKey: '',
            kpApiUrl: 'https://kinopoiskapiunofficial.tech/api/v2.2/films'
        },

        RATING_CACHE: {
            tmdb: {},
            imdb: {},
            kp: {}
        },

        FEATURES: {
            madness: true,
            madness_level: 'normal',
            ratings_tmdb: true,
            ratings_imdb: true,
            ratings_kp: true,
            label_colors: true,
            topbar_exit_menu: true
        }
    };

    // Оптимизация для Android TV
    if (SuperMenuConfig.PLATFORM.isAndroid) {
        SuperMenuConfig.PERFORMANCE.DEBOUNCE_DELAY = 500;
        SuperMenuConfig.PERFORMANCE.THROTTLE_LIMIT = 150;
        SuperMenuConfig.PERFORMANCE.MUTATION_THROTTLE = 80;
    }

    // ========================================================================
    // УТИЛИТЫ
    // ========================================================================
    function log() {
        if (!SuperMenuConfig.DEBUG && !SuperMenuConfig.VERBOSE_LOGGING) return;
        try {
            console.log.apply(console, ['[SuperMenu]'].concat([].slice.call(arguments)));
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

    // ========================================================================
    // РАБОТА С НАСТРОЙКАМИ
    // ========================================================================
    function getStorageValue(key, defaultValue) {
        return Lampa.Storage.get(key, defaultValue);
    }

    function setStorageValue(key, value) {
        Lampa.Storage.set(key, value);
    }

    // ========================================================================
    // РЕЙТИНГИ
    // ========================================================================
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

    function getKpRating(meta, cb) {
        if (!SuperMenuConfig.FEATURES.ratings_kp) {
            cb && cb(null);
            return;
        }

        try {
            var key = meta.kpId || meta.id || meta.title + '_' + (meta.year || '');
            var cached = getRatingFromCache('kp', key);

            if (cached) {
                cb && cb(cached);
                return;
            }

            if (!SuperMenuConfig.RATINGS.kpApiKey || !SuperMenuConfig.RATINGS.kpApiUrl) {
                cb && cb(null);
                return;
            }

            var url = SuperMenuConfig.RATINGS.kpApiUrl + 
                      '?keyword=' + encodeURIComponent(meta.title) +
                      (meta.year ? '&yearFrom=' + meta.year + '&yearTo=' + meta.year : '');

            fetchJsonWithTimeout(url, {
                headers: {
                    'X-API-KEY': SuperMenuConfig.RATINGS.kpApiKey
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
                    cb && cb(null);
                    return;
                }

                var value = Number(film.ratingImdb || film.ratingKinopoisk || film.rating);
                var votes = Number(film.ratingImdbVoteCount || film.ratingKinopoiskVoteCount || film.votes);

                if (!isFinite(value)) {
                    cb && cb(null);
                    return;
                }

                var result = {
                    source: 'kp',
                    value: value,
                    votes: isFinite(votes) ? votes : undefined
                };

                setRatingToCache('kp', key, result);
                cb && cb(result);
            })
            .catch(function (err) {
                log('getKpRating fetch error:', err);
                cb && cb(null);
            });
        } catch (e) {
            log('getKpRating error:', e);
            cb && cb(null);
        }
    }

    // ========================================================================
    // МЕНЮ ВЫХОДА
    // ========================================================================
    var ExitMenuConfig = {
        items: [
            { name: 'exit', defaultValue: '2', title: 'Закрыть приложение' },
            { name: 'reboot', defaultValue: '2', title: 'Перезагрузить' },
            { name: 'switch_server', defaultValue: '2', title: 'Сменить сервер' },
            { name: 'clear_cache', defaultValue: '2', title: 'Очистить кэш' }
        ]
    };

    function exitMenuEnsureDefaults() {
        try {
            var defaults = {
                back_plug: true,
                exit: '2',
                reboot: '2',
                switch_server: '2',
                clear_cache: '2'
            };

            Object.keys(defaults).forEach(function (key) {
                if (getStorageValue(key, null) === null) {
                    setStorageValue(key, defaults[key]);
                }
            });
        } catch (e) {
            log('exitMenuEnsureDefaults error:', e);
        }
    }

    function exitApplication() {
        try {
            if (Lampa.Platform.is('apple_tv')) {
                window.location.assign('exit://exit');
            }
            if (Lampa.Platform.is('tizen')) {
                tizen.application.getCurrentApplication().exit();
            }
            if (Lampa.Platform.is('webos')) {
                window.close();
            }
            if (Lampa.Platform.is('android')) {
                Lampa.Android.exit();
            }
            if (Lampa.Platform.is('orsay')) {
                Lampa.Orsay.exit();
            }
            if (Lampa.Platform.is('netcast')) {
                window.NetCastBack();
            }
            if (Lampa.Platform.is('browser')) {
                window.close();
            }
        } catch (e) {
            log('exitApplication error:', e);
        }
    }

    // ========================================================================
    // КОМПОНЕНТ
    // ========================================================================
    var component = {
        create: function () {
            return this.render();
        },

        start: function () {
            log('SuperMenu component started');
            exitMenuEnsureDefaults();

            // Инициализация функционала
            this.initMadnessMode();
            this.initExitMenu();
        },

        render: function () {
            return '';
        },

        initMadnessMode: function () {
            if (!SuperMenuConfig.FEATURES.madness) return;

            var level = getStorageValue('supermenu_madness_level', 'normal');
            SuperMenuConfig.FEATURES.madness_level = level;

            log('Madness mode initialized:', level);
        },

        initExitMenu: function () {
            if (!SuperMenuConfig.FEATURES.topbar_exit_menu) return;

            log('Exit menu initialized');
        },

        destroy: function () {
            log('SuperMenu component destroyed');
        }
    };

    // ========================================================================
    // НАСТРОЙКИ
    // ========================================================================
    function initSettings() {
        // Добавление компонента настроек
        Lampa.SettingsApi.addComponent({
            component: 'drxaos_supermenu',
            name: 'SuperMenu',
            icon: manifest.icon
        });

        // Параметр: Madness Mode
        Lampa.SettingsApi.addParam({
            component: 'drxaos_supermenu',
            param: {
                name: 'supermenu_madness',
                type: 'select',
                values: {
                    'off': 'Выключено',
                    'on': 'Включено'
                },
                default: 'on'
            },
            field: {
                name: 'Madness Mode',
                description: 'Визуальные эффекты и анимации'
            },
            onChange: function (value) {
                SuperMenuConfig.FEATURES.madness = (value === 'on');
                log('Madness mode changed:', value);
            }
        });

        // Параметр: Уровень Madness
        Lampa.SettingsApi.addParam({
            component: 'drxaos_supermenu',
            param: {
                name: 'supermenu_madness_level',
                type: 'select',
                values: {
                    'normal': 'Нормальный',
                    'full': 'Полный'
                },
                default: 'normal'
            },
            field: {
                name: 'Уровень Madness',
                description: 'Интенсивность визуальных эффектов'
            },
            onChange: function (value) {
                SuperMenuConfig.FEATURES.madness_level = value;
                log('Madness level changed:', value);
            }
        });

        // Параметр: Рейтинги TMDB
        Lampa.SettingsApi.addParam({
            component: 'drxaos_supermenu',
            param: {
                name: 'supermenu_ratings_tmdb',
                type: 'select',
                values: {
                    'off': 'Выключено',
                    'on': 'Включено'
                },
                default: 'on'
            },
            field: {
                name: 'Рейтинги TMDB',
                description: 'Показывать рейтинги из TMDB'
            },
            onChange: function (value) {
                SuperMenuConfig.FEATURES.ratings_tmdb = (value === 'on');
                log('TMDB ratings changed:', value);
            }
        });

        // Параметр: Рейтинги КиноПоиск
        Lampa.SettingsApi.addParam({
            component: 'drxaos_supermenu',
            param: {
                name: 'supermenu_ratings_kp',
                type: 'select',
                values: {
                    'off': 'Выключено',
                    'on': 'Включено'
                },
                default: 'on'
            },
            field: {
                name: 'Рейтинги КиноПоиск',
                description: 'Показывать рейтинги из КиноПоиск'
            },
            onChange: function (value) {
                SuperMenuConfig.FEATURES.ratings_kp = (value === 'on');
                log('KP ratings changed:', value);
            }
        });

        // Параметр: Цветные метки
        Lampa.SettingsApi.addParam({
            component: 'drxaos_supermenu',
            param: {
                name: 'supermenu_label_colors',
                type: 'select',
                values: {
                    'off': 'Выключено',
                    'on': 'Включено'
                },
                default: 'on'
            },
            field: {
                name: 'Цветные метки качества',
                description: 'Цветное выделение меток качества видео'
            },
            onChange: function (value) {
                SuperMenuConfig.FEATURES.label_colors = (value === 'on');
                log('Label colors changed:', value);
            }
        });

        // Параметр: Схема цветов меток
        Lampa.SettingsApi.addParam({
            component: 'drxaos_supermenu',
            param: {
                name: 'supermenu_label_scheme',
                type: 'select',
                values: {
                    'vivid': 'Яркая',
                    'soft': 'Мягкая'
                },
                default: 'vivid'
            },
            field: {
                name: 'Схема цветов меток',
                description: 'Выбор палитры для цветных меток'
            },
            onChange: function (value) {
                SuperMenuConfig.LABEL_SCHEME = value;
                log('Label scheme changed:', value);
            }
        });

        // Параметр: Меню выхода в топбаре
        Lampa.SettingsApi.addParam({
            component: 'drxaos_supermenu',
            param: {
                name: 'supermenu_topbar_exit_menu',
                type: 'select',
                values: {
                    'off': 'Выключено',
                    'on': 'Включено'
                },
                default: 'on'
            },
            field: {
                name: 'Меню выхода в топбаре',
                description: 'Добавить меню выхода в верхнюю панель'
            },
            onChange: function (value) {
                SuperMenuConfig.FEATURES.topbar_exit_menu = (value === 'on');
                log('Topbar exit menu changed:', value);
            }
        });

        log('Settings initialized');
    }

    // ========================================================================
    // ИНИЦИАЛИЗАЦИЯ
    // ========================================================================
    function initialize() {
        try {
            // Регистрация компонента
            Lampa.Component.add(manifest.component, component);

            // Инициализация настроек
            initSettings();

            // Запуск компонента
            component.start();

            log('SuperMenu plugin v' + manifest.version + ' loaded successfully');
        } catch (e) {
            console.error('[SuperMenu] Initialization error:', e);
        }
    }

    // Запуск после полной загрузки Lampa
    if (Lampa.Manifest) {
        Lampa.Manifest.plugins = manifest;
        initialize();
    } else {
        setTimeout(initialize, 1000);
    }

})();
