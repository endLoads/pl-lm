(function () {
    'use strict';

    // --- НАСТРОЙКИ ПЛАГИНА ---
    const PLUGIN_NAME = 'Lampa Ultimate Modular';
    const PLUGIN_VERSION = '1.0.9'; // Обновили версию
    const THEMES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';
    const STYLES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';
    const ICON_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/icon.png';

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

    // --- СОЗДАНИЕ СОДЕРЖИМОГО РАЗДЕЛА ---
    function createContent() {
        const content = document.createElement('div');
        content.classList.add('settings-folder__content');

        const info = document.createElement('div');
        info.classList.add('settings-folder__content-item');
        info.innerHTML = [
            `<div class="settings-folder__title">О плагине</div>`,
            `<div class="settings-folder__description">Версия: <b>${PLUGIN_VERSION}</b><br>Автор: <b>endLoads</b><br>Статус: <b style="color: #4CAF50;">Активен</b></div>`
        ].join('');
        content.appendChild(info);

        const button = document.createElement('div');
        button.classList.add('settings-button', 'selector');
        button.innerText = 'Показать уведомление';
        button.addEventListener('click', () => Lampa.Noty.show('Плагин работает!'));
        content.appendChild(button);

        return content;
    }

    // --- ИНИЦИАЛИЗАЦИЯ ПЛАГИНА ---
    function initializePlugin() {
        console.log(`${PLUGIN_NAME} v${PLUGIN_VERSION}: Инициализация.`);

        window.lampa_ultimate_modular = true;

        // Регистрация компонента как категории настроек
        const componentName = PLUGIN_NAME.toLowerCase().replace(/\s/g, '_');
        Lampa.Component.add(componentName, {
            category: true,  // Флаг для распознавания как раздел
            name: PLUGIN_NAME,
            icon: ICON_URL,
            version: PLUGIN_VERSION,
            render: function() {
                return createContent();  // Рендерим содержимое раздела
            },
            onRender: function() {
                console.log(`${PLUGIN_NAME}: Раздел отрисован.`);
            }
        });

        // Добавление в коллекцию категорий и обновление меню
        Lampa.Settings.listener.follow('addCategory', function(e) {
            if (!e.categories.includes(componentName)) {
                e.categories.push(componentName);
                console.log(`${PLUGIN_NAME}: Добавлен в категории.`);
                Lampa.Settings.update();  // Обновляем меню для отображения
            }
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
