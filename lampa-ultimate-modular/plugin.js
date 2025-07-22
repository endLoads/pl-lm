(function () {
    'use strict';

    /**
     * Эта функция-обёртка (IIFE) создаёт изолированное пространство для плагина.
     * Она защищает переменные плагина от конфликтов с переменными LAMPA и других плагинов.
     */

    // --- НАСТРОЙКИ ПЛАГИНА ---
    const PLUGIN_NAME = 'Lampa Ultimate Modular';
    const PLUGIN_VERSION = '1.0.2'; // Обновил версию для наглядности
    const THEMES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';
    const STYLES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';

    // --- УТИЛИТЫ ДЛЯ БЕЗОПАСНОЙ ЗАГРУЗКИ ---

    /**
     * Асинхронно загружает внешний JS-файл и возвращает Promise.
     * @param {string} url 
     * @returns {Promise<void>}
     */
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Не удалось загрузить скрипт: ${url}`));
            document.head.appendChild(script);
        });
    }

    /**
     * Асинхронно загружает внешний CSS-файл и возвращает Promise.
     * @param {string} url 
     * @returns {Promise<void>}
     */
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

    /**
     * Эта функция будет вызвана только ПОСЛЕ того, как LAMPA будет готова
     * и все внешние скрипты и стили будут успешно загружены.
     */
    function initializePlugin() {
        console.log(`${PLUGIN_NAME} v${PLUGIN_VERSION}: Инициализация...`);

        window.lampa_ultimate_modular = true;

        const component = {
            name: PLUGIN_NAME,
            version: PLUGIN_VERSION,
            props: {}, templates: {}, data: {}, methods: {},
            onRender: function() { console.log(`${PLUGIN_NAME}: Компонент отрисован`) },
            onCreate: function() { console.log(`${PLUGIN_NAME}: Компонент создан`) },
            onDestroy: function() { console.log(`${PLUGIN_NAME}: Компонент уничтожен`) }
        };
        Lampa.Component.add('lampa_ultimate_modular', component);

        const settingsItem = document.createElement("div");
        settingsItem.innerText = PLUGIN_NAME;
        
        const settingsDescr = Lampa.Settings.p(settingsItem, '');
        
        const info = [
            `Версия: <b>${PLUGIN_VERSION}</b>`,
            `Автор: <b>endLoads</b>`,
            `Статус: <b style="color: #4CAF50;">Активен</b>`
        ].join('<br>');

        settingsDescr.innerHTML = info;

        const exampleButton = document.createElement('div');
        exampleButton.classList.add('settings-button', 'selector');
        exampleButton.innerText = 'Показать уведомление';
        exampleButton.addEventListener('click', function() {
            Lampa.Noty.show('Плагин Ultimate Modular успешно работает!');
        });
        settingsDescr.appendChild(exampleButton);
        
        // ----- ИСПРАВЛЕНИЕ ЗДЕСЬ -----
        // Получаем HTML-элемент главного меню через .render() и добавляем в него наш пункт.
        Lampa.Settings.main().render().appendChild(settingsItem);
        // -----------------------------

        if (window.myThemes && Array.isArray(window.myThemes)) {
            console.log(`${PLUGIN_NAME}: Найдено ${window.myThemes.length} тем для добавления.`);
            window.myThemes.forEach(theme => {
                if (theme.name && theme.template) {
                    Lampa.Template.add(theme.name, theme.template);
                }
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
            // Уточнил сообщение об ошибке
            console.error(`${PLUGIN_NAME}: Ошибка во время инициализации плагина.`, error);
            Lampa.Noty.show(`Ошибка плагина ${PLUGIN_NAME}. Подробности в консоли.`, {time: 5000});
        });
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', (e) => {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }

})();
