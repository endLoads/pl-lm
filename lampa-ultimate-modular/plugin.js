((function () {
    'use strict';

    // --- НАСТРОЙКИ ПЛАГИНА ---
    const PLUGIN_NAME = 'Lampa Ultimate Modular';
    const PLUGIN_VERSION = '1.0.5'; // Обновили версию
    const THEMES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';
    const STYLES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';

    // --- УТИЛИТЫ ДЛЯ БЕЗОПАСНОЙ ЗАГРУЗКИ ---

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Не удалось загрузить скрипт: ${url}`));
            document.head.appendChild(script);
        });
    }

    function loadStyles(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Не удалось загрузить стили: ${url}`));
            document.head.appendChild(link);
        });
    }

    // --- ОСНОВНАЯ ЛОГИКА ВАШЕГО ПЛАГИНА ---

    function initializePlugin() {
        console.log(`${PLUGIN_NAME} v${PLUGIN_VERSION}: Инициализация...`);

        window.lampa_ultimate_modular = true;

        Lampa.Component.add('lampa_ultimate_modular', {
            name: PLUGIN_NAME,
            version: PLUGIN_VERSION,
            props: {}, templates: {}, data: {}, methods: {},
            onRender: function() { console.log(`${PLUGIN_NAME}: Компонент отрисован`) },
            onCreate: function() { console.log(`${PLUGIN_NAME}: Компонент создан`) },
            onDestroy: function() { console.log(`${PLUGIN_NAME}: Компонент уничтожен`) }
        });

        // ----- ИСПРАВЛЕНИЕ: Добавляем через слушатель события -----
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name === 'main') { // Проверяем, что открыто главное меню настроек
                const settingsItem = document.createElement("div");
                settingsItem.classList.add('settings-folder');

                const settingsHeader = document.createElement("div");
                settingsHeader.classList.add('settings-folder__header');
                settingsHeader.innerText = PLUGIN_NAME;
                settingsItem.appendChild(settingsHeader);

                const settingsContent = document.createElement("div");
                settingsContent.classList.add('settings-folder__content');
                settingsItem.appendChild(settingsContent);

                const infoBlock = document.createElement('div');
                infoBlock.classList.add('settings-folder__content-item');
                infoBlock.innerHTML = [
                    `<div class="settings-folder__title">О плагине</div>`,
                    `<div class="settings-folder__description">Версия: <b>${PLUGIN_VERSION}</b><br>Автор: <b>endLoads</b></div>`
                ].join('');
                settingsContent.appendChild(infoBlock);

                const buttonBlock = document.createElement('div');
                buttonBlock.classList.add('settings-folder__content-item');
                const exampleButton = document.createElement('div');
                exampleButton.classList.add('settings-button', 'selector');
                exampleButton.innerText = 'Показать уведомление';
                exampleButton.addEventListener('click', function() {
                    Lampa.Noty.show('Плагин Ultimate Modular успешно работает!');
                });
                buttonBlock.appendChild(exampleButton);
                settingsContent.appendChild(buttonBlock);

                // Добавляем в тело меню
                e.body.append(settingsItem);
            }
        });
        // ------------------------------------

        if (window.myThemes && Array.isArray(window.myThemes)) {
            console.log(`${PLUGIN_NAME}: Найдено ${window.myThemes.length} тем.`);
            window.myThemes.forEach(theme => {
                if (theme.name && theme.template) Lampa.Template.add(theme.name, theme.template);
            });
            Lampa.Noty.show('Дополнительные темы загружены', {time: 1500});
        }
    }

    // --- ТОЧКА ВХОДА ПЛАГИНА ---

    function startPlugin() {
        Promise.all([
            loadStyles(STYLES_URL),
            loadScript(THEMES_URL)
        ])
        .then(() => {
            console.log(`${PLUGIN_NAME}: Все зависимости успешно загружены.`);
            initializePlugin();
        })
        .catch(error => {
            console.error(`${PLUGIN_NAME}: Ошибка во время инициализации.`, error);
            Lampa.Noty.show(`Ошибка плагина ${PLUGIN_NAME}. Подробности в консоли.`, {time: 5000});
        });
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', (e) => {
            if (e.type === 'ready') startPlugin();
        });
    }

})();
