// Lampa Ultimate Modular Plugin
(function () {
    'use strict';

    // Глобальный объект плагина
    const LampaUltimate = {
        version: '1.0.0',
        modules: {}, // Зарегистрированные модули
        settings: {}, // Глобальные настройки
        profiles: {}, // Профили настроек
        activeProfile: 'default',
        // Регистрация модуля
        registerModule(name, module) {
            this.modules[name] = module;
        },
        // Получить активные модули
        getActiveModules() {
            return Object.values(this.modules).filter(m => m.enabled);
        },
        // Сохранить настройки
        saveSettings() {
            localStorage.setItem('lampa_ultimate_settings', JSON.stringify(this.settings));
        },
        // Загрузить настройки
        loadSettings() {
            const s = localStorage.getItem('lampa_ultimate_settings');
            if (s) this.settings = JSON.parse(s);
        },
        // Сохранить профиль
        saveProfile(name) {
            this.profiles[name] = JSON.parse(JSON.stringify(this.settings));
            localStorage.setItem('lampa_ultimate_profiles', JSON.stringify(this.profiles));
        },
        // Загрузить профиль
        loadProfile(name) {
            if (this.profiles[name]) {
                this.settings = JSON.parse(JSON.stringify(this.profiles[name]));
                this.activeProfile = name;
                this.saveSettings();
            }
        },
        // Инициализация
        init() {
            this.loadSettings();
            this.loadProfiles();
            this.renderMenu();
            // Инициализация модулей
            Object.values(this.modules).forEach(m => m.init && m.init());
        },
        // Загрузить профили
        loadProfiles() {
            const p = localStorage.getItem('lampa_ultimate_profiles');
            if (p) this.profiles = JSON.parse(p);
        },
        // Рендер меню настроек
        renderMenu() {
            // TODO: Реализовать красивое адаптивное меню с вкладками, drag&drop, профилями и настройками модулей
            // Пока что простая заглушка
            if (window.Lampa && Lampa.SettingsApi) {
                Lampa.SettingsApi.addComponent({
                    component: 'lampa_ultimate',
                    name: 'Ultimate Modular',
                    icon: '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00dbde"/><text x="12" y="17" text-anchor="middle" font-size="10" fill="#fff">ULT</text></svg>'
                });
                Lampa.SettingsApi.addParam({
                    component: 'lampa_ultimate',
                    param: {
                        name: 'open_menu',
                        type: 'trigger',
                        default: false
                    },
                    field: {
                        name: 'Открыть меню Ultimate',
                        description: 'Настройте интерфейс, модули, профили и внешний вид'
                    },
                    onChange: () => {
                        // TODO: Открыть кастомное меню плагина
                        alert('Ultimate Modular: меню в разработке!');
                    }
                });
            }
        }
    };

    // --- UI: Базовый рендер меню с вкладками и настройками модулей ---
    LampaUltimate.renderCustomMenu = function() {
        // Удаляем старое меню, если оно есть
        let old = document.getElementById('lampa-ultimate-menu');
        if (old) old.remove();

        // Создаём контейнер меню
        let menu = document.createElement('div');
        menu.id = 'lampa-ultimate-menu';
        menu.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;background:rgba(10,10,30,0.98);color:#fff;overflow:auto;padding:0;margin:0;font-family:sans-serif;';

        // Заголовок и кнопка закрытия
        let header = document.createElement('div');
        header.style = 'display:flex;align-items:center;justify-content:space-between;padding:20px 30px 10px 30px;font-size:2em;font-weight:bold;';
        header.innerHTML = '<span>Ultimate Modular</span>' +
            '<button id="lampa-ultimate-close" style="font-size:1.5em;background:none;border:none;color:#fff;cursor:pointer;">×</button>';
        menu.appendChild(header);

        // Вкладки
        let tabs = [
            {id:'main', label:'Главное'},
            {id:'modules', label:'Модули'},
            {id:'profiles', label:'Профили'},
            {id:'appearance', label:'Внешний вид'},
            {id:'analytics', label:'Аналитика'},
            {id:'experiments', label:'Эксперименты'}
        ];
        let tabsBar = document.createElement('div');
        tabsBar.style = 'display:flex;gap:20px;padding:0 30px 10px 30px;border-bottom:1px solid #333;';
        tabsBar.id = 'lampa-ultimate-tabs';
        tabs.forEach(tab => {
            let btn = document.createElement('button');
            btn.textContent = tab.label;
            btn.dataset.tab = tab.id;
            btn.style = 'background:none;border:none;color:#fff;font-size:1.1em;padding:10px 0 8px 0;cursor:pointer;';
            btn.onclick = () => renderTab(tab.id);
            tabsBar.appendChild(btn);
        });
        menu.appendChild(tabsBar);

        // Контент вкладки
        let content = document.createElement('div');
        content.id = 'lampa-ultimate-content';
        content.style = 'padding:20px 30px;min-height:60vh;';
        menu.appendChild(content);

        // Добавляем меню в body
        document.body.appendChild(menu);

        // Закрытие меню
        document.getElementById('lampa-ultimate-close').onclick = () => menu.remove();

        // Рендер первой вкладки
        renderTab('main');

        // --- Внутренняя функция рендера вкладки ---
        function renderTab(tabId) {
            // Сброс активной вкладки
            Array.from(tabsBar.children).forEach(btn => btn.style.borderBottom = 'none');
            let activeBtn = Array.from(tabsBar.children).find(btn => btn.dataset.tab === tabId);
            if (activeBtn) activeBtn.style.borderBottom = '2px solid #00dbde';
            // Контент
            if (tabId === 'main') {
                content.innerHTML = `<h2>Ultimate Modular для Lampa</h2>
                <p>Добро пожаловать! Здесь вы можете гибко настраивать интерфейс, модули, профили и внешний вид Lampa.</p>
                <ul>
                  <li>Включайте и выключайте модули</li>
                  <li>Меняйте порядок и внешний вид</li>
                  <li>Сохраняйте профили настроек</li>
                  <li>Используйте быстрые фильтры и аналитику</li>
                </ul>`;
            } else if (tabId === 'modules') {
                // Список модулей с переключателями
                let html = '<h3>Модули</h3><ul style="list-style:none;padding:0;">';
                Object.entries(LampaUltimate.modules).forEach(([key, mod]) => {
                    html += `<li style="margin-bottom:10px;">
                        <label style="display:flex;align-items:center;gap:10px;">
                            <input type="checkbox" data-mod="${key}" ${mod.enabled ? 'checked' : ''} style="width:20px;height:20px;">
                            <span style="font-size:1.1em;">${mod.name}</span>
                        </label>
                    </li>`;
                });
                html += '</ul>';
                content.innerHTML = html;
                // Переключатели модулей
                content.querySelectorAll('input[type=checkbox][data-mod]').forEach(chk => {
                    chk.onchange = function() {
                        let mod = chk.dataset.mod;
                        LampaUltimate.modules[mod].enabled = chk.checked;
                        LampaUltimate.saveSettings();
                    };
                });
            } else if (tabId === 'profiles') {
                // Профили: список, выбор, сохранение, загрузка
                let html = `<h3>Профили</h3>
                <div>Текущий профиль: <b>${LampaUltimate.activeProfile}</b></div>
                <button id="lampa-ultimate-save-profile" style="margin:10px 0;">Сохранить текущий профиль</button>
                <ul style="list-style:none;padding:0;">`;
                Object.keys(LampaUltimate.profiles).forEach(name => {
                    html += `<li style="margin-bottom:8px;">
                        <button data-profile="${name}" style="margin-right:10px;">Загрузить</button>
                        <span>${name}</span>
                    </li>`;
                });
                html += '</ul>';
                content.innerHTML = html;
                // Сохранить профиль
                content.querySelector('#lampa-ultimate-save-profile').onclick = function() {
                    let name = prompt('Введите имя профиля:');
                    if (name) {
                        LampaUltimate.saveProfile(name);
                        renderTab('profiles');
                    }
                };
                // Загрузить профиль
                content.querySelectorAll('button[data-profile]').forEach(btn => {
                    btn.onclick = function() {
                        let name = btn.dataset.profile;
                        LampaUltimate.loadProfile(name);
                        renderTab('profiles');
                    };
                });
            } else if (tabId === 'appearance') {
                content.innerHTML = `<h3>Внешний вид</h3>
                <p>Настройки тем, размеров, стиля кнопок и иконок появятся здесь.</p>`;
            } else if (tabId === 'analytics') {
                content.innerHTML = `<h3>Аналитика</h3>
                <p>Здесь будет статистика по просмотрам, жанрам, времени и т.д.</p>`;
            } else if (tabId === 'experiments') {
                content.innerHTML = `<h3>Эксперименты</h3>
                <p>Включайте новые функции для теста!</p>`;
            }
        }
    };

    // --- Переопределяем onChange для кнопки меню ---
    LampaUltimate.renderMenu = function() {
        if (window.Lampa && Lampa.SettingsApi) {
            Lampa.SettingsApi.addComponent({
                component: 'lampa_ultimate',
                name: 'Ultimate Modular',
                icon: '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00dbde"/><text x="12" y="17" text-anchor="middle" font-size="10" fill="#fff">ULT</text></svg>'
            });
            Lampa.SettingsApi.addParam({
                component: 'lampa_ultimate',
                param: {
                    name: 'open_menu',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: 'Открыть меню Ultimate',
                    description: 'Настройте интерфейс, модули, профили и внешний вид'
                },
                onChange: () => {
                    LampaUltimate.renderCustomMenu();
                }
            });
        }
    };

    // --- Модуль "Бейджи качества и серий" ---
    LampaUltimate.modules.badges = Object.assign(LampaUltimate.modules.badges, {
        style: 'color', // color | minimal | icon
        show: 'both',   // quality | episodes | both | none
        init() {
            // Добавляем настройки во вкладки
            LampaUltimate.settings.badges = LampaUltimate.settings.badges || {
                style: 'color',
                show: 'both'
            };
            this.style = LampaUltimate.settings.badges.style;
            this.show = LampaUltimate.settings.badges.show;

            // Патчим рендер карточек Lampa (универсально для всех источников)
            const origRender = window.Lampa && Lampa.Card && Lampa.Card.render;
            if (origRender && !Lampa.Card._ultimatePatched) {
                Lampa.Card.render = function(cardData, ...args) {
                    let el = origRender.call(this, cardData, ...args);
                    setTimeout(() => {
                        try {
                            if (!el) return;
                            // Удаляем старые бейджи
                            el.querySelectorAll('.ultimate-badge').forEach(b => b.remove());
                            // Получаем качество и серии
                            let quality = cardData.quality || cardData.Quality || '';
                            let episodes = '';
                            if (cardData.number_of_episodes && cardData.number_of_seasons) {
                                episodes = `${cardData.number_of_episodes}/${cardData.number_of_seasons}`;
                            } else if (cardData.episodes) {
                                episodes = cardData.episodes;
                            }
                            // Показываем бейджи по настройкам
                            if (LampaUltimate.modules.badges.enabled && LampaUltimate.settings.badges.show !== 'none') {
                                if ((LampaUltimate.settings.badges.show === 'quality' || LampaUltimate.settings.badges.show === 'both') && quality) {
                                    let badge = document.createElement('div');
                                    badge.className = 'ultimate-badge ultimate-badge-quality';
                                    badge.style = badgeStyle(LampaUltimate.settings.badges.style, 'quality');
                                    badge.textContent = quality;
                                    el.appendChild(badge);
                                }
                                if ((LampaUltimate.settings.badges.show === 'episodes' || LampaUltimate.settings.badges.show === 'both') && episodes) {
                                    let badge = document.createElement('div');
                                    badge.className = 'ultimate-badge ultimate-badge-episodes';
                                    badge.style = badgeStyle(LampaUltimate.settings.badges.style, 'episodes');
                                    badge.textContent = episodes;
                                    el.appendChild(badge);
                                }
                            }
                        } catch(e) {}
                    }, 0);
                    return el;
                };
                Lampa.Card._ultimatePatched = true;
            }
            // Вспомогательная функция для стиля бейджа
            function badgeStyle(style, type) {
                if (style === 'color') {
                    return `position:absolute;top:${type==='quality'?8:36}px;right:8px;background:linear-gradient(90deg,#00dbde,#fc00ff);color:#fff;padding:2px 8px;border-radius:8px;font-size:1em;font-weight:bold;z-index:10;`;
                } else if (style === 'minimal') {
                    return `position:absolute;top:${type==='quality'?8:36}px;right:8px;background:#222;color:#fff;padding:2px 8px;border-radius:8px;font-size:1em;z-index:10;`;
                } else if (style === 'icon') {
                    return `position:absolute;top:${type==='quality'?8:36}px;right:8px;background:#fff;color:#00dbde;padding:2px 8px;border-radius:8px;font-size:1em;z-index:10;display:flex;align-items:center;gap:4px;`;
                }
                return '';
            }
        }
    });

    // --- Добавляем настройки бейджей в меню ---
    const origRenderTab = LampaUltimate.renderCustomMenu;
    LampaUltimate.renderCustomMenu = function() {
        origRenderTab.call(this);
        // Добавляем настройки во вкладку "Модули"
        let content = document.getElementById('lampa-ultimate-content');
        let tabsBar = document.getElementById('lampa-ultimate-tabs');
        if (!content || !tabsBar) return;
        let modulesBtn = Array.from(tabsBar.children).find(btn => btn.dataset.tab === 'modules');
        if (modulesBtn) {
            modulesBtn.onclick = function() {
                // Перерисовываем стандартную вкладку
                let html = '<h3>Модули</h3><ul style="list-style:none;padding:0;">';
                Object.entries(LampaUltimate.modules).forEach(([key, mod]) => {
                    html += `<li style="margin-bottom:10px;">
                        <label style="display:flex;align-items:center;gap:10px;">
                            <input type="checkbox" data-mod="${key}" ${mod.enabled ? 'checked' : ''} style="width:20px;height:20px;">
                            <span style="font-size:1.1em;">${mod.name}</span>
                        </label>`;
                    if (key === 'badges') {
                        html += `<div style="margin-left:30px;margin-top:5px;">
                            <label>Стиль бейджей:
                                <select id="badges-style">
                                    <option value="color" ${LampaUltimate.settings.badges.style==='color'?'selected':''}>Цветные</option>
                                    <option value="minimal" ${LampaUltimate.settings.badges.style==='minimal'?'selected':''}>Минимал</option>
                                    <option value="icon" ${LampaUltimate.settings.badges.style==='icon'?'selected':''}>С иконками</option>
                                </select>
                            </label>
                            <label style="margin-left:20px;">Показывать:
                                <select id="badges-show">
                                    <option value="both" ${LampaUltimate.settings.badges.show==='both'?'selected':''}>Качество и серии</option>
                                    <option value="quality" ${LampaUltimate.settings.badges.show==='quality'?'selected':''}>Только качество</option>
                                    <option value="episodes" ${LampaUltimate.settings.badges.show==='episodes'?'selected':''}>Только серии</option>
                                    <option value="none" ${LampaUltimate.settings.badges.show==='none'?'selected':''}>Ничего</option>
                                </select>
                            </label>
                        </div>`;
                    }
                    html += '</li>';
                });
                html += '</ul>';
                content.innerHTML = html;
                // Переключатели модулей
                content.querySelectorAll('input[type=checkbox][data-mod]').forEach(chk => {
                    chk.onchange = function() {
                        let mod = chk.dataset.mod;
                        LampaUltimate.modules[mod].enabled = chk.checked;
                        LampaUltimate.saveSettings();
                    };
                });
                // Настройки бейджей
                let styleSel = content.querySelector('#badges-style');
                let showSel = content.querySelector('#badges-show');
                if (styleSel) styleSel.onchange = function() {
                    LampaUltimate.settings.badges.style = styleSel.value;
                    LampaUltimate.modules.badges.style = styleSel.value;
                    LampaUltimate.saveSettings();
                };
                if (showSel) showSel.onchange = function() {
                    LampaUltimate.settings.badges.show = showSel.value;
                    LampaUltimate.modules.badges.show = showSel.value;
                    LampaUltimate.saveSettings();
                };
            };
        }
    };

    // Пример заглушки модуля (реализовать каждый модуль отдельно)
    LampaUltimate.registerModule('badges', {
        enabled: true,
        name: 'Бейджи качества и серий',
        init() {
            // TODO: Реализовать рендер бейджей на карточках
        }
    });
    LampaUltimate.registerModule('logos', {
        enabled: true,
        name: 'Оригинальные логотипы',
        init() {
            // TODO: Реализовать автоматическое получение и отображение логотипов
        }
    });
    LampaUltimate.registerModule('vpn', {
        enabled: false,
        name: 'VPN Checker',
        init() {
            // TODO: Реализовать проверку VPN с мульти-API и визуализацией
        }
    });
    // ... другие модули по аналогии

    // Автоинициализация при загрузке
    setTimeout(() => LampaUltimate.init(), 1000);

    // Экспорт для отладки
    window.LampaUltimate = LampaUltimate;
})();