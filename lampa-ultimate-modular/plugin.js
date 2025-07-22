(function () {
    'use strict';

    // --- НАСТРОЙКИ ПЛАГИНА ---
    const PLUGIN_NAME = 'Lampa Ultimate Modular';
    const PLUGIN_VERSION = '1.0.8'; // Обновили версию
    const THEMES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';
    const STYLES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';
    const ICON_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/icon.png'; // Ваша иконка

    // --- УТИЛИТЫ ДЛЯ ЗАГРУЗКИ ---
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Не удалось загрузить: ${url}`));
            document.head.appendChild(script);
        });
    }

    function loadStyles(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = resolve;
            link.onerror = () => reject(new Error(`Не удалось загрузить: ${url}`));
            document.head.appendChild(link);
        });
    }

    // --- СОЗДАНИЕ ПОДМЕНЮ ---
    function createSubmenu() {
        const submenu = document.createElement('div');
        submenu.classList.add('settings-folder__content');

        const infoBlock = document.createElement('div');
        infoBlock.classList.add('settings-folder__content-item');
        infoBlock.innerHTML = [
            `<div class="settings-folder__title">О плагине</div>`,
            `<div class="settings-folder__description">Версия: <b>${PLUGIN_VERSION}</b><br>Автор: <b>endLoads</b><br>Статус: <b style="color: #4CAF50;">Активен</b></div>`
        ].join('');
        submenu.appendChild(infoBlock);

        const buttonBlock = document.createElement('div');
        buttonBlock.classList.add('settings-folder__content-item');
        const button = document.createElement('div');
        button.classList.add('settings-button', 'selector');
        button.innerText = 'Показать уведомление';
        button.addEventListener('click', () => Lampa.Noty.show('Плагин работает!'));
        buttonBlock.appendChild(button);
        submenu.appendChild(buttonBlock);

        return submenu;
    }

    // --- ИНИЦИАЛИЗАЦИЯ ПЛАГИНА ---
    function initializePlugin() {
        console.log(`${PLUGIN_NAME} v${PLUGIN_VERSION}: Инициализация.`);

        window.lampa_ultimate_modular = true;

        // Регистрация как категории настроек (чтобы появиться в главном меню как "Интерфейс" или "Плеер")
        Lampa.Component.add(PLUGIN_NAME.toLowerCase().replace(/\s/g, '_'), {  // Имя компонента для регистрации
            category: true,  // Флаг, чтобы LAMPA распознала как раздел настроек
            name: PLUGIN_NAME,
            icon: ICON_URL,  // Иконка для меню
            version: PLUGIN_VERSION,
            onRender: function() {
                console.log(`${PLUGIN_NAME}: Раздел отрисован.`);
            },
            render: function() {
                // Здесь рендерим содержимое раздела (подменю)
                return createSubmenu();
            }
        });

        // Добавление в список категорий настроек (на основе анализа исходников LAMPA)
        Lampa.Settings.listener.follow('addCategory', function(e) {
            e.categories.push(PLUGIN_NAME.toLowerCase().replace(/\s/g, '_'));  // Добавляем в коллекцию категорий
        });

        // Загрузка тем
        if (window.myThemes && Array.isArray(window.myThemes)) {
            window.myThemes.forEach(theme => {
                if (theme.name && theme.template) Lampa.Template.add(theme.name, theme.template);
            });
            Lampa.Noty.show('Темы загружены', {time: 1500});
        }

        console.log(`${PLUGIN_NAME}: Готов.`);
    }

    // --- СТАРТ ПЛАГИНА ---
    function startPlugin() {
        Promise.all([loadStyles(STYLES_URL), loadScript(THEMES_URL)])
            .then(() => {
                console.log(`${PLUGIN_NAME}: Зависимости загружены.`);
                initializePlugin();
            })
            .catch(error => {
                console.error(`${PLUGIN_NAME}: Ошибка.`, error);
                Lampa.Noty.show(`Ошибка ${PLUGIN_NAME}.`, {time: 5000});
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
