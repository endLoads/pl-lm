(function () {
    'use strict';

    /**
     * Эта функция-обёртка (IIFE) создаёт изолированное пространство для плагина.
     * Она защищает переменные плагина от конфликтов с переменными LAMPA и других плагинов.
     */

    // --- НАСТРОЙКИ ПЛАГИНА ---
    const PLUGIN_NAME = 'Lampa Ultimate Modular';
    const PLUGIN_VERSION = '1.0.1'; // Обновил версию для наглядности
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

        // Устанавливаем глобальный флаг, как было в вашем коде
        window.lampa_ultimate_modular = true;

        // Создаем и регистрируем компонент LAMPA для вашего плагина
        const component = {
            name: PLUGIN_NAME,
            version: PLUGIN_VERSION,
            props: {},
            templates: {},
            data: {},
            methods: {},
            onRender: function() { console.log(`${PLUGIN_NAME}: Компонент отрисован`) },
            onCreate: function() { console.log(`${PLUGIN_NAME}: Компонент создан`) },
            onDestroy: function() { console.log(`${PLUGIN_NAME}: Компонент уничтожен`) }
        };
        Lampa.Component.add('lampa_ultimate_modular', component);

        // Добавляем пункт в меню "Настройки -> Плагины"
        const settingsItem = document.createElement("div");
        settingsItem.innerText = PLUGIN_NAME;
        
        // Добавляем подпункт с описанием
        const settingsDescr = Lampa.Settings.p(settingsItem, '');
        
        const info = [
            `Версия: <b>${PLUGIN_VERSION}</b>`,
            `Автор: <b>endLoads</b>`,
            `Статус: <b style="color: #4CAF50;">Активен</b>`
        ].join('<br>');

        settingsDescr.innerHTML = info;

        // Добавляем кнопку для примера
        const exampleButton = document.createElement('div');
        exampleButton.classList.add('settings-button', 'selector');
        exampleButton.innerText = 'Показать уведомление';
        exampleButton.addEventListener('click', function() {
            Lampa.Noty.show('Плагин Ultimate Modular успешно работает!');
        });
        settingsDescr.appendChild(exampleButton);
        
        // Прикрепляем созданный элемент настроек к главному меню
        Lampa.Settings.main().appendChild(settingsItem);

        // Пример использования данных из загруженного скрипта `themes.js`
        // Убедимся, что глобальный объект с темами был создан этим скриптом
        if (window.myThemes && Array.isArray(window.myThemes)) {
            console.log(`${PLUGIN_NAME}: Найдено ${window.myThemes.length} тем для добавления.`);
            window.myThemes.forEach(theme => {
                if (theme.name && theme.template) {
                    Lampa.Template.add(theme.name, theme.template);
                    console.log(`${PLUGIN_NAME}: Тема "${theme.name}" успешно добавлена.`);
                }
            });
            Lampa.Noty.show('Дополнительные темы загружены', {time: 1500});
        }
    }

    // --- ТОЧКА ВХОДА ПЛАГИНА ---

    /**
     * Стартовая функция, которая запускает загрузку зависимостей.
     */
    function startPlugin() {
        // Promise.all гарантирует, что мы перейдем к `then` только
        // когда ОБА файла (стили и скрипты) будут загружены.
        Promise.all([
            loadStyles(STYLES_URL),
            loadScript(THEMES_URL)
        ])
        .then(() => {
            console.log(`${PLUGIN_NAME}: Все зависимости успешно загружены.`);
            // Теперь, когда всё на месте, можно безопасно инициализировать плагин.
            initializePlugin();
        })
        .catch(error => {
            // Если что-то пошло не так при загрузке.
            console.error(`${PLUGIN_NAME}: Критическая ошибка при загрузке зависимостей.`, error);
            Lampa.Noty.show(`Ошибка плагина ${PLUGIN_NAME}. Подробности в консоли.`, {time: 5000});
        });
    }

    // Проверяем, готова ли LAMPA. Если да - запускаем плагин.
    // Если нет - подписываемся на событие 'app', которое сообщит нам, когда LAMPA будет готова.
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
