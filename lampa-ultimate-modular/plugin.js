(function () {
    'use strict';

    // --- НАСТРОЙКИ ПЛАГИНА ---
    const PLUGIN_NAME = 'Lampa Ultimate Modular';
    const PLUGIN_VERSION = '1.0.7'; // Обновили версию для отслеживания изменений
    const THEMES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';
    const STYLES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';
    const ICON_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/icon.png'; // Ваша иконка из репозитория

    // Альтернативная SVG-иконка (если icon.png не подойдёт — раскомментируйте и используйте в коде ниже)
    // Это простой "модульный" логотип: шестерёнка с элементами
    // const ICON_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#4CAF50"/>
    //     <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" fill="#FFF"/>
    //     <path d="M12 15v3m-3-3v3m6-3v3m-3-9v3m-3-3v3m6-3v3" stroke="#FFF" stroke-width="2"/>
    // </svg>`;

    // --- УТИЛИТЫ ДЛЯ БЕЗОПАСНОЙ ЗАГРУЗКИ ---

    /**
     * Загружает внешний скрипт асинхронно.
     * @param {string} url
     * @returns {Promise<void>}
     */
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Не удалось загрузить скрипт: ${url}`));
            document.head.appendChild(script);
        });
    }

    /**
     * Загружает внешние стили асинхронно.
     * @param {string} url
     * @returns {Promise<void>}
     */
    function loadStyles(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = resolve;
            link.onerror = () => reject(new Error(`Не удалось загрузить стили: ${url}`));
            document.head.appendChild(link);
        });
    }

    // --- ОСНОВНАЯ ЛОГИКА ПЛАГИНА ---

    /**
     * Создаёт и возвращает HTML-элемент для подменю с настройками плагина.
     * @returns {HTMLElement}
     */
    function createSubmenu() {
        const submenu = document.createElement('div');
        submenu.classList.add('settings-folder__content'); // Стиль как в подменю других плагинов

        // Блок с информацией
        const infoBlock = document.createElement('div');
        infoBlock.classList.add('settings-folder__content-item');
        infoBlock.innerHTML = [
            `<div class="settings-folder__title">О плагине</div>`,
            `<div class="settings-folder__description">Версия: <b>${PLUGIN_VERSION}</b><br>Автор: <b>endLoads</b><br>Статус: <b style="color: #4CAF50;">Активен</b></div>`
        ].join('');
        submenu.appendChild(infoBlock);

        // Блок с кнопкой (пример)
        const buttonBlock = document.createElement('div');
        buttonBlock.classList.add('settings-folder__content-item');
        const exampleButton = document.createElement('div');
        exampleButton.classList.add('settings-button', 'selector');
        exampleButton.innerText = 'Показать уведомление';
        exampleButton.addEventListener('click', () => Lampa.Noty.show('Плагин Ultimate Modular работает!'));
        buttonBlock.appendChild(exampleButton);
        submenu.appendChild(buttonBlock);

        return submenu;
    }

    function initializePlugin() {
        console.log(`${PLUGIN_NAME} v${PLUGIN_VERSION}: Инициализация начата.`);

        window.lampa_ultimate_modular = true;

        // Регистрация компонента (как в ваших примерах)
        Lampa.Component.add('lampa_ultimate_modular', {
            name: PLUGIN_NAME,
            version: PLUGIN_VERSION,
            props: {},
            templates: {},
            data: {},
            methods: {},
            onRender: function() { console.log(`${PLUGIN_NAME}: Компонент отрисован.`); },
            onCreate: function() { console.log(`${PLUGIN_NAME}: Компонент создан.`); },
            onDestroy: function() { console.log(`${PLUGIN_NAME}: Компонент уничтожен.`); }
        });

        // Добавление пункта в меню через слушатель (улучшено для стиля как в interface/themes)
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name === 'main') {
                console.log(`${PLUGIN_NAME}: Добавляем пункт в главное меню настроек.`);

                const item = document.createElement('div');
                item.classList.add('settings-category'); // Основной класс для пунктов меню

                // Иконка (используем вашу icon.png; если не подойдёт, замените на ICON_SVG)
                const icon = document.createElement('img'); // Или div, если SVG
                icon.classList.add('settings-category__icon');
                icon.src = ICON_URL; // Ваша иконка
                icon.alt = PLUGIN_NAME;
                icon.style.width = '24px'; // Улучшение: фиксированный размер для соответствия стилю
                icon.style.height = '24px';
                item.appendChild(icon);

                // Заголовок
                const title = document.createElement('div');
                title.classList.add('settings-category__title');
                title.textContent = PLUGIN_NAME;
                item.appendChild(title);

                // Обработчик клика: открываем подменю
                item.addEventListener('click', () => {
                    const submenu = createSubmenu();
                    Lampa.Layer.visible(submenu, true, true); // Открываем как модальное подменю
                });

                // Добавляем пункт в тело меню
                e.body.append(item);
            }
        });

        // Загрузка тем (как в вашем коде)
        if (window.myThemes && Array.isArray(window.myThemes)) {
            console.log(`${PLUGIN_NAME}: Найдено ${window.myThemes.length} тем.`);
            window.myThemes.forEach(theme => {
                if (theme.name && theme.template) {
                    Lampa.Template.add(theme.name, theme.template);
                }
            });
            Lampa.Noty.show('Дополнительные темы загружены', {time: 1500});
        }

        console.log(`${PLUGIN_NAME} v${PLUGIN_VERSION}: Инициализация завершена.`);
    }

    // --- ТОЧКА ВХОДА ПЛАГИНА ---

    function startPlugin() {
        Promise.all([loadStyles(STYLES_URL), loadScript(THEMES_URL)])
            .then(() => {
                console.log(`${PLUGIN_NAME}: Зависимости загружены.`);
                initializePlugin();
            })
            .catch(error => {
                console.error(`${PLUGIN_NAME}: Ошибка инициализации.`, error);
                Lampa.Noty.show(`Ошибка плагина ${PLUGIN_NAME}.`, {time: 5000});
            });
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') startPlugin();
        });
    }

})();
