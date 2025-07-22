(function () {
    'use strict';

    const PLUGIN_NAME = 'Lampa Ultimate Modular';
    const PLUGIN_VERSION = '1.1.0';
    const THEMES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';
    const STYLES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';
    const ICON_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/icon.png';

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

    function initializePlugin() {
        Lampa.Activity.add('ultimate_modular', {
    create: function() {
        const activity = document.createElement('div');
        activity.innerHTML = `
            <div class="activity-head">
                <div class="activity-title">${PLUGIN_NAME}</div>
            </div>
            <div class="activity-body">
                <div class="settings-folder">
                    <div class="settings-folder__title">О плагине</div>
                    <div class="settings-folder__content">
                        <div style="padding: 1em;">
                            <div><strong>Версия:</strong> ${PLUGIN_VERSION}</div>
                            <div><strong>Автор:</strong> endLoads</div>
                            <div><strong>Статус:</strong> <span style="color: #4CAF50;">Активен</span></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return activity;
    }
});
        console.log(`${PLUGIN_NAME}: Инициализация...`);
        
        window.lampa_ultimate_modular = true;

        // Создаём собственный компонент для настроек
        const settingsComponent = {
            name: PLUGIN_NAME,
            create: function() {
                const element = document.createElement('div');
                element.classList.add('settings-folder');
                
                // Заголовок
                const header = document.createElement('div');
                header.classList.add('settings-folder__title');
                header.textContent = PLUGIN_NAME;
                element.appendChild(header);

                // Содержимое
                const content = document.createElement('div');
                content.classList.add('settings-folder__content');
                
                const info = document.createElement('div');
                info.innerHTML = `
                    <div style="padding: 1em;">
                        <div><strong>Версия:</strong> ${PLUGIN_VERSION}</div>
                        <div><strong>Автор:</strong> endLoads</div>
                        <div><strong>Статус:</strong> <span style="color: #4CAF50;">Активен</span></div>
                    </div>
                `;
                content.appendChild(info);

                const button = document.createElement('div');
                button.classList.add('settings-button', 'selector');
                button.textContent = 'Показать уведомление';
                button.style.margin = '0 1em 1em 1em';
                button.addEventListener('click', () => {
                    Lampa.Noty.show('Плагин Ultimate Modular работает!');
                });
                content.appendChild(button);

                element.appendChild(content);
                return element;
            }
        };

        // Регистрируем компонент
        Lampa.Component.add('ultimate_modular_settings', settingsComponent);

        // Добавляем пункт в меню настроек
        try {
            const settingsMain = Lampa.Settings.main();
            
            // Создаём элемент меню
            const menuItem = document.createElement('div');
            menuItem.classList.add('settings-folder');
            menuItem.innerHTML = `
                <div class="settings-folder__icon">
                    <img src="${ICON_URL}" style="width: 24px; height: 24px;" alt="${PLUGIN_NAME}">
                </div>
                <div class="settings-folder__name">${PLUGIN_NAME}</div>
            `;
            
            menuItem.addEventListener('click', function() {
                Lampa.Activity.push({
                    url: '',
                    title: PLUGIN_NAME,
                    component: 'ultimate_modular_settings',
                    page: 1
                });
            });

            // Добавляем в меню
            settingsMain.append(menuItem);
            console.log(`${PLUGIN_NAME}: Добавлен в меню настроек`);
            
        } catch (error) {
            console.error(`${PLUGIN_NAME}: Ошибка добавления в меню:`, error);
        }

        // Загружаем темы, если они есть
        if (window.myThemes && Array.isArray(window.myThemes)) {
            window.myThemes.forEach(theme => {
                if (theme.name && theme.template) {
                    Lampa.Template.add(theme.name, theme.template);
                }
            });
            Lampa.Noty.show('Темы загружены', {time: 1500});
        }

        console.log(`${PLUGIN_NAME}: Готов к использованию`);
    }

    function startPlugin() {
        Promise.all([loadStyles(STYLES_URL), loadScript(THEMES_URL)])
            .then(() => {
                console.log(`${PLUGIN_NAME}: Зависимости загружены`);
                initializePlugin();
            })
            .catch(error => {
                console.error(`${PLUGIN_NAME}: Ошибка загрузки:`, error);
                Lampa.Noty.show(`Ошибка плагина ${PLUGIN_NAME}`, {time: 3000});
            });
    }

    // Запуск плагина
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') startPlugin();
        });
    }

})();
