 (function () {
    'use strict';

    // URL к вашим ресурсам
    const THEMES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';
    const STYLES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';

    /**
     * Функция для асинхронной загрузки скрипта
     * @param {string} url - Адрес скрипта
     * @returns {Promise}
     */
    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Функция для асинхронной загрузки стилей
     * @param {string} url - Адрес CSS файла
     * @returns {Promise}
     */
    function loadStyles(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    /**
     * Основная функция инициализации плагина
     */
    function initPlugin() {
        // =============================================================
        // НАЧАЛО ВАШЕГО ФУНКЦИОНАЛА
        // =============================================================

        window.lampa_ultimate_modular = true;

        let component = {
            name: 'lampa_ultimate_modular',
            version: '1.0.0',
            props: {},
            templates: {},
            data: {},
            methods: {},
            onRender: function() { console.log('Ultimate Modular: компонент отрисован') },
            onCreate: function() { console.log('Ultimate Modular: компонент создан') },
            onDestroy: function() { console.log('Ultimate Modular: компонент уничтожен') }
        };

        // Регистрируем компонент, чтобы LAMPA о нём знала
        Lampa.Component.add('lampa_ultimate_modular', component);

        // Добавляем пункт в главное меню настроек
        let a = Lampa.Settings.main();
        let i = document.createElement("div");
        i.innerText = 'Lampa Ultimate Modular';
        a.appendChild(i);

        let p = Lampa.Settings.p(i, 'О плагине');
        p.innerText = 'Это ваш модульный плагин. Здесь может быть описание, кнопки и другие элементы.';

        let but = document.createElement('div');
        but.classList.add('settings-button', 'selector');
        but.innerText = 'Пример кнопки';
        but.addEventListener('click', function() {
            Lampa.Noty.show('Кнопка в настройках нажата!');
        });
        p.appendChild(but);
        
        // Тут может быть любая другая логика вашего плагина:
        // добавление тем, переключателей, полей ввода и т.д.
        // Например, добавление темы из загруженного themes.js
        if (window.myThemes && window.myThemes.length) {
            window.myThemes.forEach(theme => {
                Lampa.Template.add(theme.name, theme.template);
                Lampa.Noty.show(`Тема "${theme.name}" добавлена.`);
            });
        }

        // =============================================================
        // КОНЕЦ ВАШЕГО ФУНКЦИОНАЛА
        // =============================================================
    }

    /**
     * Главная функция плагина
     */
    function startPlugin() {
        Promise.all([
            loadStyles(STYLES_URL),
            loadScript(THEMES_URL)
        ])
        .then(() => {
            console.log('Ultimate Modular: все зависимости успешно загружены.');
            initPlugin();
        })
        .catch(error => {
            console.error('Ultimate Modular: Ошибка при загрузке зависимостей:', error);
            Lampa.Noty.show('Не удалось загрузить плагин Ultimate Modular.');
        });
    }

    // Проверяем, готова ли LAMPA, и запускаем плагин
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }

})();
