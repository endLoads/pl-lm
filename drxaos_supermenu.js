// drxaos_supermenu.js
(function () {
    "use strict";

    console.log("[DrxAOS SuperMenu] Initializing...");

    // Проверка наличия Lampa
    if (!window.Lampa || !Lampa.Storage || !Lampa.SettingsApi || !Lampa.Listener || !Lampa.Controller) {
        console.error("[DrxAOS SuperMenu] Lampa API is not available.");
        return;
    }

    // Конфигурация по умолчанию
    const SuperMenuConfig = {
        FEATURES: {
            madness: false,
            madness_level: 'normal', // 'off', 'normal', 'full'
            perf_mode: 'normal', // 'normal', 'android_perf'
            ratings_tmdb: true,
            ratings_imdb: true,
            ratings_kp: false, // Requires external API
            label_colors: true,
            label_scheme: 'vivid', // 'vivid', 'soft'
            topbar_exit_menu: false,
            borderless_dark_theme: false,
            voiceover_tracking: false,
        },
        PLATFORM: {
            isAndroid: typeof Lampa.Platform !== 'undefined' && Lampa.Platform.name() === 'android',
        },
        LABEL_SCHEME: 'vivid',
    };

    // Внутреннее состояние
    let currentState = { ...SuperMenuConfig.FEATURES };

    // Утилита логирования
    function log(...args) {
        console.log("[DrxAOS SuperMenu]", ...args);
    }

    function logError(...args) {
        console.error("[DrxAOS SuperMenu]", ...args);
    }

    // === ФУНКЦИИ ДЛЯ ПРИМЕНЕНИЯ ФУНКЦИОНАЛОВ ===

    function injectBorderlessDarkTheme(enabled) {
        const styleId = 'drxaos-supermenu-borderless-dark';
        if (enabled) {
            const css = `
                /* Пример стилей для темы без рамок */
                body .card, body .menu__item, body .selector, body .modal, body .panel {
                    border: none !important;
                    background-color: rgba(30, 30, 30, 0.85) !important;
                    backdrop-filter: none !important; /* Убираем размытие для производительности */
                    -webkit-backdrop-filter: none !important;
                }
                body {
                    background-color: #0f0f0f !important;
                    color: #e0e0e0 !important;
                }
                .card__title, .menu__item__name {
                    color: #ffffff !important;
                }
                .card__year, .card__quality {
                    color: #aaaaaa !important;
                }
            `;
            let styleElement = document.getElementById(styleId);
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = styleId;
                styleElement.textContent = css;
                document.head.appendChild(styleElement);
            } else {
                styleElement.textContent = css;
            }
        } else {
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                styleElement.remove();
            }
        }
        log("Borderless Dark Theme", enabled ? "enabled" : "disabled");
    }

    function madnessDecorateSectionTitle(titleEl, level) {
        if (!titleEl) return;
        const madnessEnabled = level !== 'off';
        const madnessFull = level === 'full';

        if (madnessEnabled) {
            // Пример: добавление градиента к заголовку
            titleEl.style.background = "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)";
            titleEl.style.backgroundClip = "text";
            titleEl.style.webkitBackgroundClip = "text";
            titleEl.style.webkitTextFillColor = "transparent";
            titleEl.style.textShadow = madnessFull ? "2px 2px 4px rgba(0,0,0,0.5)" : "1px 1px 2px rgba(0,0,0,0.3)";
            titleEl.style.fontSize = madnessFull ? "1.8em" : "1.4em";
            titleEl.style.fontWeight = "bold";
            titleEl.classList.add("drxaos-madness-title");
        } else {
            // Сброс стилей
            titleEl.style.background = "";
            titleEl.style.backgroundClip = "";
            titleEl.style.webkitBackgroundClip = "";
            titleEl.style.webkitTextFillColor = "";
            titleEl.style.textShadow = "";
            titleEl.style.fontSize = "";
            titleEl.style.fontWeight = "";
            titleEl.classList.remove("drxaos-madness-title");
        }
        log("Madness Title Decoration applied, level:", level);
    }

    function colorizeLabelsInContainer(container, scheme) {
        if (!container) return;
        const colorMap = {
            vivid: {
                film: { color: '#FF6B6B', bg: 'rgba(255, 107, 107, 0.2)' },
                serial: { color: '#4ECDC4', bg: 'rgba(78, 205, 196, 0.2)' },
                '4k': { color: '#FFD93D', bg: 'rgba(255, 217, 61, 0.2)' },
                '1080p': { color: '#6BCB77', bg: 'rgba(107, 203, 119, 0.2)' },
                '720p': { color: '#4D96FF', bg: 'rgba(77, 150, 255, 0.2)' },
            },
            soft: {
                film: { color: '#FFA0A0', bg: 'rgba(255, 160, 160, 0.15)' },
                serial: { color: '#A0D0FF', bg: 'rgba(160, 208, 255, 0.15)' },
                '4k': { color: '#FFE0A0', bg: 'rgba(255, 224, 160, 0.15)' },
                '1080p': { color: '#A0FFC8', bg: 'rgba(160, 255, 200, 0.15)' },
                '720p': { color: '#C0A0FF', bg: 'rgba(192, 160, 255, 0.15)' },
            }
        };
        const colors = colorMap[scheme] || colorMap.vivid;

        // Находим все элементы с метками качества и типа
        const labels = container.querySelectorAll('.card__type, .card__quality');
        labels.forEach(label => {
            const text = label.textContent.trim().toLowerCase();
            if (colors[text]) {
                label.style.color = colors[text].color;
                label.style.backgroundColor = colors[text].bg;
                label.style.padding = '2px 6px';
                label.style.borderRadius = '4px';
                label.style.fontWeight = '600';
            }
        });
        log("Colorized labels in container using scheme:", scheme);
    }

    // Функция-заглушка для получения рейтинга TMDB
    function getTmdbRating(movieId) {
        // В реальности это требует API вызова к TMDB
        // Здесь просто возвращаем заглушку
        log("Requested TMDB rating for ID:", movieId);
        return { value: "N/A", max: 10 };
    }

    // Функция-заглушка для отслеживания озвучек
    function setupVoiceoverTracking(enabled) {
        if (enabled) {
            // Реализация отслеживания озвучек требует интеграции с источниками данных
            log("Voiceover tracking is enabled (beta). Implementation requires source integration.");
            // Пример: добавить слушатель на изменение серии/озвучки
            // Lampa.Listener.follow('episodes:select', (event) => { ... })
        } else {
            log("Voiceover tracking is disabled.");
        }
    }

    // === ПРИМЕНЕНИЕ НАСТРОЕК ===
    function applyUserSettings() {
        log("Applying user settings...");
        // Читаем все настройки из Lampa.Storage
        currentState.madness = Lampa.Storage.get("drxaos_supermenu_madness", SuperMenuConfig.FEATURES.madness ? "true" : "false") === "true";
        currentState.madness_level = Lampa.Storage.get("drxaos_supermenu_madness_level", SuperMenuConfig.FEATURES.madness_level);
        currentState.perf_mode = Lampa.Storage.get("drxaos_supermenu_perf_mode", SuperMenuConfig.PLATFORM.isAndroid ? "android_perf" : "normal");
        currentState.ratings_tmdb = Lampa.Storage.get("drxaos_supermenu_ratings_tmdb", SuperMenuConfig.FEATURES.ratings_tmdb ? "true" : "false") === "true";
        currentState.ratings_imdb = Lampa.Storage.get("drxaos_supermenu_ratings_imdb", SuperMenuConfig.FEATURES.ratings_imdb ? "true" : "false") === "true";
        currentState.ratings_kp = Lampa.Storage.get("drxaos_supermenu_ratings_kp", SuperMenuConfig.FEATURES.ratings_kp ? "true" : "false") === "true";
        currentState.label_colors = Lampa.Storage.get("drxaos_supermenu_label_colors", SuperMenuConfig.FEATURES.label_colors ? "true" : "false") === "true";
        currentState.label_scheme = Lampa.Storage.get("drxaos_supermenu_label_scheme", SuperMenuConfig.LABEL_SCHEME);
        currentState.topbar_exit_menu = Lampa.Storage.get("drxaos_supermenu_topbar_exit", SuperMenuConfig.FEATURES.topbar_exit_menu ? "true" : "false") === "true";
        currentState.borderless_dark_theme = Lampa.Storage.get("drxaos_supermenu_borderless_dark", SuperMenuConfig.FEATURES.borderless_dark_theme ? "true" : "false") === "true";
        currentState.voiceover_tracking = Lampa.Storage.get("drxaos_supermenu_voiceover_tracking", SuperMenuConfig.FEATURES.voiceover_tracking ? "true" : "false") === "true";

        // Применяем настройки
        injectBorderlessDarkTheme(currentState.borderless_dark_theme);

        // Применить Madness к заголовкам
        const titleEl = document.querySelector(".head .head__title, .simple-title, .section__title");
        if (titleEl) {
             madnessDecorateSectionTitle(titleEl, currentState.madness_level);
        }

        // Применить цветные метки
        if (currentState.label_colors) {
            // Применяем к текущему контенту
            const contentContainers = document.querySelectorAll('.row .items, .menu .items');
            contentContainers.forEach(container => {
                colorizeLabelsInContainer(container, currentState.label_scheme);
            });
            // Используем Lampa.Listener для применения к динамически загружаемому контенту
            // Это нужно будет настроить отдельно, например, на события типа 'view:render'
        }

        // Включить/отключить отслеживание озвучек
        setupVoiceoverTracking(currentState.voiceover_tracking);

        // Настройки производительности могут влиять на анимации и эффекты
        // Здесь можно установить CSS переменные или классы для управления производительностью
        if (currentState.perf_mode === 'android_perf') {
            document.body.classList.add('drxaos-perf-android');
            log("Performance mode set to Android TV optimized.");
        } else {
            document.body.classList.remove('drxaos-perf-android');
        }

        log("User settings applied successfully.");
    }


    // === РЕГИСТРАЦИЯ НАСТРОЕК В LAMPA ===
    try {
        // Режим MADNESS
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_madness",
                type: "toggle",
                default: SuperMenuConfig.FEATURES.madness
            },
            field: {
                name: "MADNESS режим",
                description: "Визуальные эффекты и расширенные украшения интерфейса"
            }
        });

        // Уровень MADNESS
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_madness_level",
                type: "select",
                values: { off: "Выключен", normal: "Стандартный", full: "Полный" },
                default: SuperMenuConfig.FEATURES.madness_level
            },
            field: {
                name: "Уровень MADNESS",
                description: "Насколько агрессивно модифицировать интерфейс"
            },
            onChange: function(value) {
                log("MADNESS level changed to:", value);
                // Переприменить настройки
                setTimeout(applyUserSettings, 100); // Задержка, чтобы значение сохранилось
            }
        });

        // Режим производительности
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_perf_mode",
                type: "select",
                values: { normal: "Обычный режим", android_perf: "Щадящий режим (Android TV)" },
                default: SuperMenuConfig.PLATFORM.isAndroid ? "android_perf" : "normal"
            },
            field: {
                name: "Производительность плагина",
                description: "Настройка отзывчивости интерфейса и нагрузки на устройство"
            },
            onChange: function(value) {
                log("Performance mode changed to:", value);
                setTimeout(applyUserSettings, 100);
            }
        });

        // Рейтинги TMDB
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_ratings_tmdb",
                type: "toggle",
                default: SuperMenuConfig.FEATURES.ratings_tmdb
            },
            field: {
                name: "Рейтинг TMDB",
                description: "Отображать рейтинг TMDB на карточках"
            },
            onChange: function(value) {
                log("TMDB rating toggle changed to:", value);
                // Обновление карточек может потребоваться, но это сложно без реального API
                // Можно добавить флаг, что нужно обновить текущие отображаемые карточки
            }
        });

        // Рейтинги IMDb
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_ratings_imdb",
                type: "toggle",
                default: SuperMenuConfig.FEATURES.ratings_imdb
            },
            field: {
                name: "Рейтинг IMDb",
                description: "Отображать рейтинг IMDb на карточках"
            },
            onChange: function(value) {
                log("IMDb rating toggle changed to:", value);
            }
        });

        // Рейтинги КиноПоиск
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_ratings_kp",
                type: "toggle",
                default: SuperMenuConfig.FEATURES.ratings_kp
            },
            field: {
                name: "Рейтинг КиноПоиск",
                description: "Отображать рейтинг КиноПоиск (требуется внешнее API)"
            },
            onChange: function(value) {
                log("Kinopoisk rating toggle changed to:", value);
            }
        });

        // Цветные метки качества/типа
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_label_colors",
                type: "toggle",
                default: SuperMenuConfig.FEATURES.label_colors
            },
            field: {
                name: "Цветные метки качества и типа",
                description: "Раскраска текста качества и типа (фильм/сериал)"
            },
            onChange: function(value) {
                log("Label colors toggle changed to:", value);
                setTimeout(applyUserSettings, 100); // Переприменить, чтобы обновить цвета
            }
        });

        // Схема цветов
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_label_scheme",
                type: "select",
                values: { vivid: "Яркая схема", soft: "Мягкая схема" },
                default: SuperMenuConfig.LABEL_SCHEME
            },
            field: {
                name: "Цветовая схема меток",
                description: "Выбор палитры для меток качества и типа"
            },
            onChange: function(value) {
                log("Label color scheme changed to:", value);
                setTimeout(applyUserSettings, 100); // Переприменить с новой схемой
            }
        });

        // Меню выхода в верхней панели
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_topbar_exit",
                type: "toggle",
                default: SuperMenuConfig.FEATURES.topbar_exit_menu
            },
            field: {
                name: "Меню выхода в верхней панели",
                description: "Добавить кнопку меню выхода рядом с консолью и перезагрузкой"
            },
            onChange: function(value) {
                log("Topbar exit menu toggle changed to:", value);
                // Реализация добавления кнопки в верхнюю панель
                // Это требует поиска элемента верхней панели и добавления кнопки
                // Примерная реализация (нужно адаптировать под структуру Lampa):
                if (value) {
                    // const topBar = document.querySelector('.head__actions'); // Пример селектора
                    // if (topBar) {
                    //     const exitBtn = document.createElement('div');
                    //     exitBtn.className = 'head__action selector';
                    //     exitBtn.innerHTML = 'Exit Menu';
                    //     topBar.appendChild(exitBtn);
                    //     // Добавить обработчик клика
                    //     exitBtn.addEventListener('click', () => { /* показать меню выхода */ });
                    // }
                } else {
                    // Удалить кнопку, если она была
                    // const existingBtn = document.querySelector('.head__action:contains("Exit Menu")');
                    // if (existingBtn) existingBtn.remove();
                }
            }
        });

        // Тёмная тема без рамок
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_borderless_dark",
                type: "toggle",
                default: SuperMenuConfig.FEATURES.borderless_dark_theme
            },
            field: {
                name: "Тема: тёмная без рамок",
                description: "Сглаженные карточки без рамок, тёмный фон, повышенная читаемость"
            },
            onChange: function(value) {
                log("Borderless dark theme toggle changed to:", value);
                setTimeout(applyUserSettings, 100); // Переприменить тему
            }
        });

        // Трекинг озвучек
        Lampa.SettingsApi.addParam({
            component: "more",
            param: {
                name: "drxaos_supermenu_voiceover_tracking",
                type: "toggle",
                default: SuperMenuConfig.FEATURES.voiceover_tracking
            },
            field: {
                name: "Отслеживание озвучек (beta)",
                description: "Запоминать выбранную озвучку и подсвечивать новые серии в этой озвучке (если источник даёт данные)"
            },
            onChange: function(value) {
                log("Voiceover tracking toggle changed to:", value);
                setTimeout(applyUserSettings, 100); // Переприменить настройки трекинга
            }
        });

        log("[DrxAOS SuperMenu] Settings registered successfully.");
    } catch (e) {
        logError("registerSettings error:", e);
    }

    // === ОБНОВЛЕНИЕ НАСТРОЕК ПРИ ИХ ИЗМЕНЕНИИ ===
    try {
        Lampa.Listener.follow('settings:changed', function(event) {
            if (!event || !event.name) return;
            const name = event.name;
            if (name.indexOf("drxaos_supermenu_") === 0) {
                log("Settings changed event for:", name);
                // Переприменяем все настройки
                applyUserSettings();
                // Или можно применять только конкретную функцию, если onChange в addParam не справляется
                // Но вызов applyUserSettings охватывает все зависимости
            }
        });
    } catch (e) {
        logError("onSettingsChanged listener error:", e);
    }

    // === ЭКСПОРТ ВНЕШНЕГО API ===
    try {
        window.DrxSuperMenu = window.DrxSuperMenu || {};
        window.DrxSuperMenu.colorizeLabelsInContainer = colorizeLabelsInContainer;
        window.DrxSuperMenu.getTmdbRating = getTmdbRating;
        log("[DrxAOS SuperMenu] API exported to window.DrxSuperMenu.");
    } catch (e) {
        logError("API export error:", e);
    }

    // === ИНИЦИАЛИЗАЦИЯ ПЛАГИНА ===
    try {
        // Ждем, пока Lampa полностью загрузится, если используется Component
        // Lampa.Component.init('drxaos_supermenu', function(){
        //     log("Component initialized.");
        //     applyUserSettings();
        // });

        // Или инициализируем сразу, если плагин не зависит от компонента
        // Ждем немного, чтобы настройки были зарегистрированы и Lampa была готова
        setTimeout(() => {
            log("[DrxAOS SuperMenu] Initialization started.");
            applyUserSettings(); // Применяем настройки при загрузке
            log("[DrxAOS SuperMenu] Initialization completed.");
        }, 1000); // Задержка 1с, чтобы убедиться, что Lampa и настройки готовы

    } catch (e) {
        logError("Initialization error:", e);
    }


})();