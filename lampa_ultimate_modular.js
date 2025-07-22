/*
Lampa Ultimate Modular Plugin
============================

Многофункциональный модульный плагин для Lampa с поддержкой профилей, коллекций, фильтров, аналитики, Telegram, тем, VPN и других расширений.

---

# Установка
1. Скопируйте этот файл (`lampa_ultimate_modular.js`) в папку плагинов Lampa или подключите через меню Lampa ("Добавить плагин").
2. После перезагрузки Lampa появится пункт меню "Ultimate Modular".

# Основные возможности
- Модульная архитектура: все функции можно включать/выключать и настраивать.
- Кастомное меню с вкладками, drag&drop, адаптивно для ТВ, ПК, смартфона.
- Профили пользователей и устройств, экспорт/импорт, облачное и локальное хранение.
- Коллекции, избранное, быстрые действия на карточках.
- Бейджи качества и серий, оригинальные логотипы, расширенные фильтры и быстрый поиск.
- Аналитика просмотров, рекомендации, уведомления, интеграция с Telegram-ботом.
- Темы оформления, настройка размеров, стилей кнопок и иконок.
- VPN Checker с несколькими API и визуальным индикатором.
- Все функции работают быстро, не нагружают интерфейс.

# Настройка Telegram-бота
1. Получите токен у @BotFather и вставьте в настройки Telegram в меню плагина.
2. Узнайте chat_id через @userinfobot или API и вставьте в настройки.
3. Для поддержки/новостей укажите ссылку на канал/чат.

# Кастомные иконки
- Добавьте SVG/PNG в объект `LampaUltimate.icons` (см. пример в коде).
- Используйте свои иконки в меню и UI.

# FAQ
- Все настройки и коллекции хранятся в localStorage (и могут экспортироваться).
- Для сброса настроек — удалите ключи `lampa_ultimate_settings` и `lampa_ultimate_profiles` из localStorage.
- Для обновления плагина — просто замените файл на новую версию.

# Поддержка и контакты
- Telegram: https://t.me/your_channel_or_chat
- GitHub: https://github.com/your-repo (замените на свой)
- Вопросы и предложения — пишите в Telegram или создайте issue на GitHub.

---

*/

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
    LampaUltimate.modules.badges = {
        enabled: true,
        style: 'color', // color | minimal | icon
        show: 'both',   // quality | episodes | both | none
        init() {
            LampaUltimate.settings.badges = LampaUltimate.settings.badges || { enabled: true, style: 'color', show: 'both' };
            this.enabled = LampaUltimate.settings.badges.enabled;
            this.style = LampaUltimate.settings.badges.style;
            this.show = LampaUltimate.settings.badges.show;
            // Патчим рендер карточек для всех источников
            const origRender = window.Lampa && Lampa.Card && Lampa.Card.render;
            if (origRender && !Lampa.Card._ultimateBadgesPatched) {
                Lampa.Card.render = function(cardData, ...args) {
                    let el = origRender.call(this, cardData, ...args);
                    setTimeout(() => {
                        try {
                            if (!el) return;
                            el.querySelectorAll('.ultimate-badge').forEach(b => b.remove());
                            let quality = cardData.quality || cardData.Quality || '';
                            let episodes = '';
                            if (cardData.number_of_episodes && cardData.number_of_seasons) {
                                episodes = `${cardData.number_of_episodes}/${cardData.number_of_seasons}`;
                            } else if (cardData.episodes) {
                                episodes = cardData.episodes;
                            }
                            if (LampaUltimate.modules.badges.enabled && LampaUltimate.modules.badges.show !== 'none') {
                                if ((LampaUltimate.modules.badges.show === 'quality' || LampaUltimate.modules.badges.show === 'both') && quality) {
                                    let badge = document.createElement('div');
                                    badge.className = 'ultimate-badge ultimate-badge-quality';
                                    badge.style = badgeStyle(LampaUltimate.modules.badges.style, 'quality');
                                    badge.textContent = quality;
                                    el.appendChild(badge);
                                }
                                if ((LampaUltimate.modules.badges.show === 'episodes' || LampaUltimate.modules.badges.show === 'both') && episodes) {
                                    let badge = document.createElement('div');
                                    badge.className = 'ultimate-badge ultimate-badge-episodes';
                                    badge.style = badgeStyle(LampaUltimate.modules.badges.style, 'episodes');
                                    badge.textContent = episodes;
                                    el.appendChild(badge);
                                }
                            }
                        } catch(e) {}
                    }, 0);
                    return el;
                };
                Lampa.Card._ultimateBadgesPatched = true;
            }
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
    };

    // --- Модуль "Оригинальные логотипы" ---
    LampaUltimate.modules.logos = {
        enabled: true,
        style: 'color', // color | mono | outline
        fallback: 'poster', // poster | title
        cache: {},
        init() {
            LampaUltimate.settings.logos = LampaUltimate.settings.logos || { enabled: true, style: 'color', fallback: 'poster' };
            this.enabled = LampaUltimate.settings.logos.enabled;
            this.style = LampaUltimate.settings.logos.style;
            this.fallback = LampaUltimate.settings.logos.fallback;
            this.cache = {};
            // Патчим рендер карточек для логотипов
            const origRender = window.Lampa && Lampa.Card && Lampa.Card.render;
            if (origRender && !Lampa.Card._ultimateLogoPatched) {
                Lampa.Card.render = function(cardData, ...args) {
                    let el = origRender.call(this, cardData, ...args);
                    setTimeout(() => {
                        try {
                            if (!el) return;
                            el.querySelectorAll('.ultimate-logo').forEach(b => b.remove());
                            let logoUrl = '';
                            if (cardData.logo_path) {
                                logoUrl = getLogoUrl(cardData.logo_path);
                            } else if (cardData.logos && cardData.logos.length) {
                                logoUrl = getLogoUrl(cardData.logos[0]);
                            }
                            if (LampaUltimate.modules.logos.enabled && logoUrl) {
                                let img = document.createElement('img');
                                img.className = 'ultimate-logo';
                                img.src = logoUrl;
                                img.alt = 'logo';
                                img.style = logoStyle(LampaUltimate.modules.logos.style);
                                img.onload = () => img.style.opacity = 1;
                                img.onerror = () => img.remove();
                                el.appendChild(img);
                                LampaUltimate.modules.logos.cache[logoUrl] = true;
                            } else if (LampaUltimate.modules.logos.enabled) {
                                if (LampaUltimate.modules.logos.fallback === 'poster' && cardData.poster_path) {
                                    // Уже есть постер — ничего не делаем
                                } else if (LampaUltimate.modules.logos.fallback === 'title' && cardData.title) {
                                    let div = document.createElement('div');
                                    div.className = 'ultimate-logo';
                                    div.textContent = cardData.title;
                                    div.style = logoStyle(LampaUltimate.modules.logos.style) + 'font-size:1.2em;font-weight:bold;letter-spacing:1px;';
                                    el.appendChild(div);
                                }
                            }
                        } catch(e) {}
                    }, 0);
                    return el;
                };
                Lampa.Card._ultimateLogoPatched = true;
            }
            function getLogoUrl(path) {
                if (!path) return '';
                if (/^https?:/.test(path)) return path;
                return 'https://image.tmdb.org/t/p/original' + path;
            }
            function logoStyle(style) {
                let base = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-width:70%;max-height:40%;opacity:0.95;z-index:12;pointer-events:none;transition:opacity 0.2s;';
                if (style === 'color') return base + '';
                if (style === 'mono') return base + 'filter: grayscale(1) contrast(1.5);';
                if (style === 'outline') return base + 'filter: grayscale(1) brightness(2) drop-shadow(0 0 2px #fff);';
                return base;
            }
        }
    };

    // --- Модуль "VPN Checker" ---
    LampaUltimate.modules.vpn = Object.assign(LampaUltimate.modules.vpn || {}, {
        mode: 'detailed', // detailed | short
        enabled: false,
        lastResult: null,
        lastCheck: 0,
        cacheTtl: 10 * 60 * 1000, // 10 минут
        indicator: null,
        init() {
            LampaUltimate.settings.vpn = LampaUltimate.settings.vpn || {
                enabled: false,
                mode: 'detailed'
            };
            this.enabled = LampaUltimate.settings.vpn.enabled;
            this.mode = LampaUltimate.settings.vpn.mode;
            // Если включено — запускаем проверку
            if (this.enabled) this.checkAndRender();
        },
        checkAndRender(force) {
            if (!this.enabled) return this.removeIndicator();
            let now = Date.now();
            if (!force && this.lastResult && (now - this.lastCheck < this.cacheTtl)) {
                this.renderIndicator(this.lastResult);
                return;
            }
            this.renderIndicator({status:'loading'});
            this.checkVPN().then(res => {
                this.lastResult = res;
                this.lastCheck = Date.now();
                this.renderIndicator(res);
            }).catch(() => {
                this.renderIndicator({status:'error'});
            });
        },
        async checkVPN() {
            // Пробуем несколько API по очереди
            let apis = [
                async () => {
                    let r = await fetch('https://ip-api.io/json/');
                    let d = await r.json();
                    return {
                        status: d.security && (d.security.is_vpn || d.security.is_proxy || d.security.is_tor) ? 'vpn' : 'ok',
                        country: d.country_name,
                        city: d.city,
                        asn: d.asn,
                        org: d.org,
                        ip: d.ip,
                        details: d.security
                    };
                },
                async () => {
                    let r = await fetch('https://ipinfo.io/json');
                    let d = await r.json();
                    return {
                        status: d.privacy && (d.privacy.vpn || d.privacy.proxy || d.privacy.tor) ? 'vpn' : 'ok',
                        country: d.country,
                        city: d.city,
                        asn: d.org,
                        org: d.org,
                        ip: d.ip,
                        details: d.privacy
                    };
                },
                async () => {
                    let r = await fetch('https://vpnapi.io/api/?ip=&key=free');
                    let d = await r.json();
                    return {
                        status: d.security && (d.security.vpn || d.security.proxy || d.security.tor) ? 'vpn' : 'ok',
                        country: d.location && d.location.country,
                        city: d.location && d.location.city,
                        asn: d.network && d.network.autonomous_system_number,
                        org: d.network && d.network.organization,
                        ip: d.ip,
                        details: d.security
                    };
                }
            ];
            for (let api of apis) {
                try {
                    let res = await api();
                    if (res && res.status) return res;
                } catch(e) {}
            }
            return {status:'error'};
        },
        renderIndicator(res) {
            this.removeIndicator();
            let ind = document.createElement('div');
            ind.id = 'lampa-ultimate-vpn-indicator';
            ind.style = 'position:fixed;bottom:24px;right:24px;z-index:999999;background:rgba(20,20,40,0.95);color:#fff;padding:12px 20px;border-radius:16px;box-shadow:0 2px 12px #0008;font-size:1.1em;display:flex;align-items:center;gap:12px;cursor:pointer;user-select:none;transition:opacity 0.2s;';
            let icon = '';
            let color = '#00dbde';
            if (res.status === 'loading') {
                icon = '⏳';
                color = '#aaa';
            } else if (res.status === 'ok') {
                icon = '🟢';
                color = '#00dbde';
            } else if (res.status === 'vpn') {
                icon = '🔴';
                color = '#fc00ff';
            } else {
                icon = '⚠️';
                color = '#ffb300';
            }
            ind.innerHTML = `<span style="font-size:1.5em;">${icon}</span><span>${this.mode==='detailed'?this.statusText(res):this.shortText(res)}</span>`;
            ind.style.border = `2px solid ${color}`;
            // Клик — показать подробности
            ind.onclick = () => {
                if (this.mode === 'detailed' && res.status && res.status !== 'loading') {
                    alert(this.detailedInfo(res));
                } else {
                    this.checkAndRender(true);
                }
            };
            document.body.appendChild(ind);
            this.indicator = ind;
        },
        removeIndicator() {
            if (this.indicator) this.indicator.remove();
            this.indicator = null;
        },
        statusText(res) {
            if (res.status === 'loading') return 'Проверка VPN...';
            if (res.status === 'ok') return 'VPN не обнаружен';
            if (res.status === 'vpn') return 'Обнаружен VPN/Proxy/TOR!';
            return 'Ошибка проверки VPN';
        },
        shortText(res) {
            if (res.status === 'loading') return 'Проверка...';
            if (res.status === 'ok') return 'VPN: нет';
            if (res.status === 'vpn') return 'VPN: да!';
            return 'VPN: ?';
        },
        detailedInfo(res) {
            if (!res || !res.status) return 'Нет данных';
            return `IP: ${res.ip||'-'}\nСтрана: ${res.country||'-'}\nГород: ${res.city||'-'}\nПровайдер: ${res.org||'-'}\nASN: ${res.asn||'-'}\nVPN/Proxy/TOR: ${res.status==='vpn'?'ДА':'нет'}\n\n${res.details?JSON.stringify(res.details,null,2):''}`;
        }
    };

    // --- Модуль "Скрытие просмотренных" и быстрые фильтры ---
    LampaUltimate.modules.hideWatched = {
        enabled: false,
        onlyNew: false,
        init() {
            LampaUltimate.settings.hideWatched = LampaUltimate.settings.hideWatched || { enabled: false, onlyNew: false };
            this.enabled = LampaUltimate.settings.hideWatched.enabled;
            this.onlyNew = LampaUltimate.settings.hideWatched.onlyNew;
            // Патчим рендер списков
            const origRenderList = window.Lampa && Lampa.List && Lampa.List.render;
            if (origRenderList && !Lampa.List._ultimatePatched) {
                Lampa.List.render = function(items, ...args) {
                    let filtered = items;
                    if (LampaUltimate.modules.hideWatched.enabled) {
                        filtered = filtered.filter(card => !isWatched(card));
                    }
                    if (LampaUltimate.modules.hideWatched.onlyNew) {
                        filtered = filtered.filter(card => isNew(card));
                    }
                    return origRenderList.call(this, filtered, ...args);
                };
                Lampa.List._ultimatePatched = true;
            }
            // Быстрый фильтр на главном экране
            setTimeout(() => {
                if (!document.getElementById('ultimate-filter-btn')) {
                    let btn = document.createElement('button');
                    btn.id = 'ultimate-filter-btn';
                    btn.textContent = this.onlyNew ? 'Показать все' : 'Только новые';
                    btn.style = 'position:fixed;top:24px;right:24px;z-index:999999;background:#00dbde;color:#fff;padding:10px 18px;border-radius:12px;font-size:1.1em;box-shadow:0 2px 12px #0008;cursor:pointer;user-select:none;';
                    btn.onclick = () => {
                        LampaUltimate.modules.hideWatched.onlyNew = !LampaUltimate.modules.hideWatched.onlyNew;
                        LampaUltimate.settings.hideWatched.onlyNew = LampaUltimate.modules.hideWatched.onlyNew;
                        btn.textContent = LampaUltimate.modules.hideWatched.onlyNew ? 'Показать все' : 'Только новые';
                        LampaUltimate.saveSettings();
                        let ev = new Event('ultimate-filter-update');
                        document.dispatchEvent(ev);
                    };
                    document.body.appendChild(btn);
                }
            }, 1000);
            function isWatched(card) {
                return card.watched === true || card.is_watched === true || card.progress === 1 || card.seen === true;
            }
            function isNew(card) {
                if (isWatched(card)) return false;
                if (card.release_date) {
                    let d = new Date(card.release_date);
                    let now = new Date();
                    return (now - d) < 30*24*60*60*1000;
                }
                return true;
            }
        }
    };

    // --- Модуль "Расширенные фильтры и сортировка" ---
    LampaUltimate.modules.filters = {
        enabled: true,
        name: 'Фильтры и сортировка',
        filters: {
            quality: '',
            genre: '',
            country: '',
            year: '',
            source: '',
            watched: '', // all | watched | unwatched | new
        },
        sort: 'date', // date | popularity | alpha
        search: '',
        init() {
            LampaUltimate.settings.filters = LampaUltimate.settings.filters || {
                filters: { quality: '', genre: '', country: '', year: '', source: '', watched: '' },
                sort: 'date',
                search: ''
            };
            this.filters = Object.assign({}, LampaUltimate.settings.filters.filters);
            this.sort = LampaUltimate.settings.filters.sort;
            this.search = LampaUltimate.settings.filters.search;
            // Патчим рендер списков
            const origRenderList = window.Lampa && Lampa.List && Lampa.List.render;
            if (origRenderList && !Lampa.List._ultimateFilterPatched) {
                Lampa.List.render = function(items, ...args) {
                    let filtered = items;
                    let f = LampaUltimate.modules.filters.filters;
                    if (f.quality) filtered = filtered.filter(card => (card.quality||'').toLowerCase().includes(f.quality));
                    if (f.genre) filtered = filtered.filter(card => (card.genre_ids||[]).includes(f.genre) || (card.genres||[]).includes(f.genre));
                    if (f.country) filtered = filtered.filter(card => (card.country||'').toLowerCase().includes(f.country));
                    if (f.year) filtered = filtered.filter(card => (card.release_date||'').startsWith(f.year));
                    if (f.source) filtered = filtered.filter(card => (card.source||'').toLowerCase().includes(f.source));
                    if (f.watched === 'watched') filtered = filtered.filter(card => isWatched(card));
                    if (f.watched === 'unwatched') filtered = filtered.filter(card => !isWatched(card));
                    if (f.watched === 'new') filtered = filtered.filter(card => isNew(card));
                    let s = (LampaUltimate.modules.filters.search||'').toLowerCase();
                    if (s) filtered = filtered.filter(card => {
                        return (card.title||'').toLowerCase().includes(s) ||
                            (card.original_title||'').toLowerCase().includes(s) ||
                            (card.name||'').toLowerCase().includes(s) ||
                            (card.actors||'').toLowerCase().includes(s) ||
                            (card.genres||[]).join(',').toLowerCase().includes(s);
                    });
                    let sort = LampaUltimate.modules.filters.sort;
                    if (sort === 'date') filtered = filtered.sort((a,b) => (b.release_date||'').localeCompare(a.release_date||''));
                    if (sort === 'popularity') filtered = filtered.sort((a,b) => (b.popularity||0)-(a.popularity||0));
                    if (sort === 'alpha') filtered = filtered.sort((a,b) => (a.title||'').localeCompare(b.title||''));
                    return origRenderList.call(this, filtered, ...args);
                };
                Lampa.List._ultimateFilterPatched = true;
            }
            // Быстрый UI-фильтр и поиск на главном экране
            setTimeout(() => {
                if (!document.getElementById('ultimate-search-bar')) {
                    let bar = document.createElement('div');
                    bar.id = 'ultimate-search-bar';
                    bar.style = 'position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:999999;background:#222;color:#fff;padding:8px 18px;border-radius:12px;font-size:1.1em;box-shadow:0 2px 12px #0008;display:flex;gap:10px;align-items:center;';
                    bar.innerHTML = `
                        <input id="ultimate-search-input" type="text" placeholder="Поиск..." style="font-size:1em;padding:4px 10px;border-radius:6px;border:none;outline:none;">
                        <select id="ultimate-sort-select">
                            <option value="date">По дате</option>
                            <option value="popularity">По популярности</option>
                            <option value="alpha">По алфавиту</option>
                        </select>
                        <button id="ultimate-clear-search" style="background:#00dbde;color:#fff;border:none;border-radius:6px;padding:4px 10px;">×</button>
                    `;
                    document.body.appendChild(bar);
                    let input = bar.querySelector('#ultimate-search-input');
                    let sortSel = bar.querySelector('#ultimate-sort-select');
                    let clearBtn = bar.querySelector('#ultimate-clear-search');
                    input.value = LampaUltimate.modules.filters.search;
                    sortSel.value = LampaUltimate.modules.filters.sort;
                    input.oninput = function() {
                        LampaUltimate.modules.filters.search = input.value;
                        LampaUltimate.settings.filters.search = input.value;
                        LampaUltimate.saveSettings();
                        let ev = new Event('ultimate-filter-update');
                        document.dispatchEvent(ev);
                    };
                    sortSel.onchange = function() {
                        LampaUltimate.modules.filters.sort = sortSel.value;
                        LampaUltimate.settings.filters.sort = sortSel.value;
                        LampaUltimate.saveSettings();
                        let ev = new Event('ultimate-filter-update');
                        document.dispatchEvent(ev);
                    };
                    clearBtn.onclick = function() {
                        input.value = '';
                        LampaUltimate.modules.filters.search = '';
                        LampaUltimate.settings.filters.search = '';
                        LampaUltimate.saveSettings();
                        let ev = new Event('ultimate-filter-update');
                        document.dispatchEvent(ev);
                    };
                }
            }, 1000);
            function isWatched(card) {
                return card.watched === true || card.is_watched === true || card.progress === 1 || card.seen === true;
            }
            function isNew(card) {
                if (isWatched(card)) return false;
                if (card.release_date) {
                    let d = new Date(card.release_date);
                    let now = new Date();
                    return (now - d) < 30*24*60*60*1000;
                }
                return true;
            }
        }
    };

    // --- Модуль "Избранное и коллекции" ---
    LampaUltimate.modules.collections = {
        enabled: true,
        lists: {}, // {listName: [cardId, ...]}
        init() {
            // Загрузка коллекций из localStorage
            let saved = localStorage.getItem('lampa_ultimate_collections');
            this.lists = saved ? JSON.parse(saved) : {
                'Смотреть позже': [],
                'Любимые': [],
                'Для семьи': []
            };
            // Патчим рендер карточек для быстрых действий
            const origRender = window.Lampa && Lampa.Card && Lampa.Card.render;
            if (origRender && !Lampa.Card._ultimateCollectionsPatched) {
                Lampa.Card.render = function(cardData, ...args) {
                    let el = origRender.call(this, cardData, ...args);
                    setTimeout(() => {
                        try {
                            if (!el) return;
                            el.querySelectorAll('.ultimate-collection-btn').forEach(b => b.remove());
                            Object.keys(LampaUltimate.modules.collections.lists).forEach(listName => {
                                let btn = document.createElement('button');
                                btn.className = 'ultimate-collection-btn';
                                btn.textContent = LampaUltimate.modules.collections.lists[listName].includes(cardData.id) ? `✔ ${listName}` : `+ ${listName}`;
                                btn.style = 'position:absolute;bottom:8px;right:8px;background:#00dbde;color:#fff;border:none;border-radius:8px;padding:2px 8px;font-size:0.9em;margin-left:4px;z-index:20;cursor:pointer;opacity:0.9;';
                                btn.onclick = (e) => {
                                    e.stopPropagation();
                                    let lists = LampaUltimate.modules.collections.lists;
                                    let arr = lists[listName];
                                    if (!arr.includes(cardData.id)) arr.push(cardData.id);
                                    else lists[listName] = arr.filter(id => id !== cardData.id);
                                    localStorage.setItem('lampa_ultimate_collections', JSON.stringify(lists));
                                    btn.textContent = arr.includes(cardData.id) ? `✔ ${listName}` : `+ ${listName}`;
                                };
                                el.appendChild(btn);
                            });
                        } catch(e) {}
                    }, 0);
                    return el;
                };
                Lampa.Card._ultimateCollectionsPatched = true;
            }
        },
        // Получить список карточек по коллекции
        getCards(listName, allCards) {
            let ids = this.lists[listName] || [];
            return allCards.filter(card => ids.includes(card.id));
        },
        // Экспорт коллекций (JSON)
        export() {
            return JSON.stringify(this.lists);
        },
        // Импорт коллекций (JSON)
        import(json) {
            try {
                let data = JSON.parse(json);
                if (typeof data === 'object') {
                    this.lists = data;
                    localStorage.setItem('lampa_ultimate_collections', JSON.stringify(this.lists));
                }
            } catch(e) {}
        },
        // Генерация ссылки (base64)
        exportLink() {
            return 'lampa-collections://' + btoa(this.export());
        },
        // Импорт из ссылки
        importLink(link) {
            if (link.startsWith('lampa-collections://')) {
                let json = atob(link.replace('lampa-collections://',''));
                this.import(json);
            }
        }
    };

    // --- UI для управления коллекциями во вкладке 'Коллекции' ---
    LampaUltimate.renderCollectionsTab = function(content) {
        let html = `<h3>Мои коллекции</h3><ul style="list-style:none;padding:0;">`;
        Object.keys(LampaUltimate.modules.collections.lists).forEach(listName => {
            html += `<li style="margin-bottom:10px;"><b>${listName}</b> <button data-list="${listName}" class="ultimate-collection-show">Показать</button> <button data-list="${listName}" class="ultimate-collection-del">Удалить</button></li>`;
        });
        html += '</ul>';
        html += `<button id="ultimate-collection-add">Добавить коллекцию</button> <button id="ultimate-collection-export">Экспорт</button> <button id="ultimate-collection-import">Импорт</button> <button id="ultimate-collection-share">Поделиться</button>`;
        content.innerHTML = html;
        // Показать коллекцию (alert, можно доработать под отдельный UI)
        content.querySelectorAll('.ultimate-collection-show').forEach(btn => {
            btn.onclick = function() {
                let name = btn.dataset.list;
                let ids = LampaUltimate.modules.collections.lists[name];
                alert(`В коллекции "${name}":\n` + ids.join(', '));
            };
        });
        // Удалить коллекцию
        content.querySelectorAll('.ultimate-collection-del').forEach(btn => {
            btn.onclick = function() {
                let name = btn.dataset.list;
                if (confirm('Удалить коллекцию ' + name + '?')) {
                    delete LampaUltimate.modules.collections.lists[name];
                    localStorage.setItem('lampa_ultimate_collections', JSON.stringify(LampaUltimate.modules.collections.lists));
                    LampaUltimate.renderCollectionsTab(content);
                }
            };
        });
        // Добавить коллекцию
        let addBtn = content.querySelector('#ultimate-collection-add');
        if (addBtn) addBtn.onclick = function() {
            let name = prompt('Название новой коллекции:');
            if (name && !LampaUltimate.modules.collections.lists[name]) {
                LampaUltimate.modules.collections.lists[name] = [];
                localStorage.setItem('lampa_ultimate_collections', JSON.stringify(LampaUltimate.modules.collections.lists));
                LampaUltimate.renderCollectionsTab(content);
            }
        };
        // Экспорт
        let exportBtn = content.querySelector('#ultimate-collection-export');
        if (exportBtn) exportBtn.onclick = function() {
            prompt('JSON для экспорта:', LampaUltimate.modules.collections.export());
        };
        // Импорт
        let importBtn = content.querySelector('#ultimate-collection-import');
        if (importBtn) importBtn.onclick = function() {
            let json = prompt('Вставьте JSON для импорта:');
            if (json) {
                LampaUltimate.modules.collections.import(json);
                LampaUltimate.renderCollectionsTab(content);
            }
        };
        // Поделиться (генерация ссылки)
        let shareBtn = content.querySelector('#ultimate-collection-share');
        if (shareBtn) shareBtn.onclick = function() {
            prompt('Ссылка для импорта коллекций:', LampaUltimate.modules.collections.exportLink());
        };
    };

    // --- Встраиваем вкладку 'Коллекции' в меню ---
    (function patchCollectionsTab() {
        const origRenderMenu = LampaUltimate.renderMenu;
        LampaUltimate.renderMenu = function() {
            origRenderMenu.call(this);
            // Переопределяем рендер вкладки 'Коллекции'
            let tabsBar = document.getElementById('lampa-ultimate-tabs');
            let content = document.getElementById('lampa-ultimate-content');
            if (!tabsBar || !content) return;
            let origRenderTab = content.renderTab || function(tabId){};
            content.renderTab = function(tabId) {
                if (tabId === 'collections') {
                    LampaUltimate.renderCollectionsTab(content);
                } else {
                    origRenderTab(tabId);
                }
            };
        };
    })();

    // --- Инициализация коллекций ---
    setTimeout(() => {
        if (LampaUltimate.modules.collections && LampaUltimate.modules.collections.init) LampaUltimate.modules.collections.init();
    }, 1400);

    // --- Добавляем настройки фильтров и сортировки в меню ---
    const origRenderTabFilters = LampaUltimate.renderCustomMenu;
    LampaUltimate.renderCustomMenu = function() {
        origRenderTabFilters.call(this);
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
                    if (key === 'filters') {
                        html += `<div style="margin-left:30px;margin-top:5px;display:flex;flex-wrap:wrap;gap:10px;">
                            <label>Качество: <input id="filter-quality" type="text" value="${mod.filters.quality||''}" style="width:80px;"></label>
                            <label>Жанр: <input id="filter-genre" type="text" value="${mod.filters.genre||''}" style="width:80px;"></label>
                            <label>Страна: <input id="filter-country" type="text" value="${mod.filters.country||''}" style="width:80px;"></label>
                            <label>Год: <input id="filter-year" type="text" value="${mod.filters.year||''}" style="width:60px;"></label>
                            <label>Источник: <input id="filter-source" type="text" value="${mod.filters.source||''}" style="width:80px;"></label>
                            <label>Статус: <select id="filter-watched">
                                <option value="">Все</option>
                                <option value="watched" ${mod.filters.watched==='watched'?'selected':''}>Просмотренные</option>
                                <option value="unwatched" ${mod.filters.watched==='unwatched'?'selected':''}>Непросмотренные</option>
                            </select></label>
                        </div>`;
                        html += `<div style="margin-left:30px;margin-top:5px;">
                            <label>Сортировка:
                                <select id="filter-sort">
                                    <option value="date" ${mod.sort==='date'?'selected':''}>По дате</option>
                                    <option value="popularity" ${mod.sort==='popularity'?'selected':''}>По популярности</option>
                                    <option value="alpha" ${mod.sort==='alpha'?'selected':''}>По алфавиту</option>
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
                // Настройки фильтров
                let q = content.querySelector('#filter-quality');
                let g = content.querySelector('#filter-genre');
                let c = content.querySelector('#filter-country');
                let y = content.querySelector('#filter-year');
                let s = content.querySelector('#filter-source');
                let w = content.querySelector('#filter-watched');
                let sortSel = content.querySelector('#filter-sort');
                if (q) q.oninput = function() { LampaUltimate.modules.filters.filters.quality = q.value.toLowerCase(); LampaUltimate.settings.filters.filters.quality = q.value.toLowerCase(); LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (g) g.oninput = function() { LampaUltimate.modules.filters.filters.genre = g.value.toLowerCase(); LampaUltimate.settings.filters.filters.genre = g.value.toLowerCase(); LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (c) c.oninput = function() { LampaUltimate.modules.filters.filters.country = c.value.toLowerCase(); LampaUltimate.settings.filters.filters.country = c.value.toLowerCase(); LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (y) y.oninput = function() { LampaUltimate.modules.filters.filters.year = y.value; LampaUltimate.settings.filters.filters.year = y.value; LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (s) s.oninput = function() { LampaUltimate.modules.filters.filters.source = s.value.toLowerCase(); LampaUltimate.settings.filters.filters.source = s.value.toLowerCase(); LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (w) w.onchange = function() { LampaUltimate.modules.filters.filters.watched = w.value; LampaUltimate.settings.filters.filters.watched = w.value; LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (sortSel) sortSel.onchange = function() { LampaUltimate.modules.filters.sort = sortSel.value; LampaUltimate.settings.filters.sort = sortSel.value; LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
            };
        }
    };

    // --- Модуль "Аналитика и статистика" ---
    LampaUltimate.modules.analytics = {
        enabled: true,
        name: 'Аналитика и статистика',
        stats: {
            totalWatched: 0,
            genres: {},
            timeSpent: 0, // в минутах
            byCollection: {},
        },
        init() {
            // Сбор статистики (примерно, можно доработать под вашу структуру)
            let allCards = window.Lampa && Lampa.Data && Lampa.Data.cards ? Lampa.Data.cards : [];
            let watched = allCards.filter(card => isWatched(card));
            this.stats.totalWatched = watched.length;
            this.stats.genres = {};
            this.stats.timeSpent = watched.reduce((sum, card) => sum + (card.runtime||0), 0);
            watched.forEach(card => {
                (card.genres||[]).forEach(g => {
                    this.stats.genres[g] = (this.stats.genres[g]||0)+1;
                });
            });
            // По коллекциям
            this.stats.byCollection = {};
            Object.keys(LampaUltimate.modules.collections.lists||{}).forEach(listName => {
                let ids = LampaUltimate.modules.collections.lists[listName];
                this.stats.byCollection[listName] = ids.filter(id => watched.find(card => card.id===id)).length;
            });
            // Можно добавить динамику по датам, любимых актеров и т.д.
            function isWatched(card) {
                return card.watched === true || card.is_watched === true || card.progress === 1 || card.seen === true;
            }
        },
        // Текстовый отчет
        report() {
            let s = this.stats;
            let genres = Object.entries(s.genres).sort((a,b)=>b[1]-a[1]).map(([g,c])=>`${g}: ${c}`).join(', ');
            let byCol = Object.entries(s.byCollection).map(([n,c])=>`${n}: ${c}`).join(', ');
            return `Всего просмотрено: ${s.totalWatched}\nЛюбимые жанры: ${genres}\nВремя за просмотром: ${Math.round(s.timeSpent/60)} ч.\nПо коллекциям: ${byCol}`;
        }
    };

    // --- Вкладка "Аналитика" в меню ---
    const origRenderTabAnalytics = LampaUltimate.renderCustomMenu;
    LampaUltimate.renderCustomMenu = function() {
        origRenderTabAnalytics.call(this);
        // Добавляем вкладку "Аналитика"
        let tabsBar = document.getElementById('lampa-ultimate-tabs');
        if (tabsBar && !Array.from(tabsBar.children).find(btn => btn.dataset.tab === 'analytics')) {
            let btn = document.createElement('button');
            btn.textContent = 'Аналитика';
            btn.dataset.tab = 'analytics';
            btn.style = 'background:none;border:none;color:#fff;font-size:1.1em;padding:10px 0 8px 0;cursor:pointer;';
            btn.onclick = () => renderTab('analytics');
            tabsBar.appendChild(btn);
        }
        // Переопределяем рендер вкладки
        let content = document.getElementById('lampa-ultimate-content');
        function renderTab(tabId) {
            Array.from(tabsBar.children).forEach(btn => btn.style.borderBottom = 'none');
            let activeBtn = Array.from(tabsBar.children).find(btn => btn.dataset.tab === tabId);
            if (activeBtn) activeBtn.style.borderBottom = '2px solid #00dbde';
            if (tabId === 'analytics') {
                LampaUltimate.modules.analytics.init();
                let s = LampaUltimate.modules.analytics.stats;
                let genres = Object.entries(s.genres).sort((a,b)=>b[1]-a[1]).map(([g,c])=>`${g}: ${c}`).join(', ');
                let byCol = Object.entries(s.byCollection).map(([n,c])=>`${n}: ${c}`).join(', ');
                let html = `<h3>Аналитика</h3>
                <div>Всего просмотрено: <b>${s.totalWatched}</b></div>
                <div>Любимые жанры: <b>${genres}</b></div>
                <div>Время за просмотром: <b>${Math.round(s.timeSpent/60)} ч.</b></div>
                <div>По коллекциям: <b>${byCol}</b></div>
                <button id="ultimate-analytics-report">Текстовый отчет</button>`;
                content.innerHTML = html;
                let repBtn = content.querySelector('#ultimate-analytics-report');
                if (repBtn) repBtn.onclick = function() {
                    alert(LampaUltimate.modules.analytics.report());
                };
            }
        }
    };

    // --- Модуль "Профили и экспорт/импорт" ---
    LampaUltimate.modules.profiles = {
        enabled: true,
        name: 'Профили и экспорт/импорт',
        init() {
            LampaUltimate.settings.profiles = LampaUltimate.settings.profiles || {
                active: 'default',
                list: { 'default': {} }
            };
            // Если нет активного профиля — создаём
            if (!LampaUltimate.settings.profiles.active) {
                LampaUltimate.settings.profiles.active = 'default';
            }
            if (!LampaUltimate.settings.profiles.list[LampaUltimate.settings.profiles.active]) {
                LampaUltimate.settings.profiles.list[LampaUltimate.settings.profiles.active] = {};
            }
        },
        // Сохранить текущие настройки в профиль
        saveProfile(name) {
            if (!name) return;
            LampaUltimate.settings.profiles.list[name] = {
                settings: JSON.parse(JSON.stringify(LampaUltimate.settings)),
                collections: JSON.parse(JSON.stringify(LampaUltimate.modules.collections.lists))
            };
            LampaUltimate.settings.profiles.active = name;
            LampaUltimate.saveSettings();
        },
        // Загрузить профиль
        loadProfile(name) {
            let p = LampaUltimate.settings.profiles.list[name];
            if (p) {
                LampaUltimate.settings = JSON.parse(JSON.stringify(p.settings));
                LampaUltimate.modules.collections.lists = JSON.parse(JSON.stringify(p.collections));
                LampaUltimate.settings.profiles.active = name;
                LampaUltimate.saveSettings();
                location.reload();
            }
        },
        // Удалить профиль
        deleteProfile(name) {
            if (name === 'default') return;
            delete LampaUltimate.settings.profiles.list[name];
            if (LampaUltimate.settings.profiles.active === name) {
                LampaUltimate.settings.profiles.active = 'default';
            }
            LampaUltimate.saveSettings();
        },
        // Экспорт профиля (JSON)
        exportProfile(name) {
            let p = LampaUltimate.settings.profiles.list[name];
            return p ? JSON.stringify(p) : '';
        },
        // Импорт профиля (JSON)
        importProfile(name, json) {
            try {
                let data = JSON.parse(json);
                if (typeof data === 'object') {
                    LampaUltimate.settings.profiles.list[name] = data;
                    LampaUltimate.saveSettings();
                }
            } catch(e) {}
        },
        // Генерация ссылки (base64)
        exportLink(name) {
            return 'lampa-profile://' + btoa(this.exportProfile(name));
        },
        // Импорт из ссылки
        importLink(name, link) {
            if (link.startsWith('lampa-profile://')) {
                let json = atob(link.replace('lampa-profile://',''));
                this.importProfile(name, json);
            }
        }
    };

    // --- Вкладка "Профили" в меню ---
    const origRenderTabProfiles = LampaUltimate.renderCustomMenu;
    LampaUltimate.renderCustomMenu = function() {
        origRenderTabProfiles.call(this);
        // Переопределяем рендер вкладки "Профили"
        let tabsBar = document.getElementById('lampa-ultimate-tabs');
        let content = document.getElementById('lampa-ultimate-content');
        function renderTab(tabId) {
            Array.from(tabsBar.children).forEach(btn => btn.style.borderBottom = 'none');
            let activeBtn = Array.from(tabsBar.children).find(btn => btn.dataset.tab === tabId);
            if (activeBtn) activeBtn.style.borderBottom = '2px solid #00dbde';
            if (tabId === 'profiles') {
                let profs = LampaUltimate.settings.profiles.list;
                let html = `<h3>Профили</h3><div>Текущий профиль: <b>${LampaUltimate.settings.profiles.active}</b></div><ul style="list-style:none;padding:0;">`;
                Object.keys(profs).forEach(name => {
                    html += `<li style="margin-bottom:8px;"><b>${name}</b> <button data-profile="${name}" class="ultimate-profile-load">Загрузить</button> <button data-profile="${name}" class="ultimate-profile-del">Удалить</button> <button data-profile="${name}" class="ultimate-profile-export">Экспорт</button> <button data-profile="${name}" class="ultimate-profile-import">Импорт</button> <button data-profile="${name}" class="ultimate-profile-share">Поделиться</button></li>`;
                });
                html += '</ul>';
                html += `<button id="ultimate-profile-add">Создать профиль</button>`;
                content.innerHTML = html;
                // Загрузить профиль
                content.querySelectorAll('.ultimate-profile-load').forEach(btn => {
                    btn.onclick = function() {
                        let name = btn.dataset.profile;
                        if (confirm('Переключиться на профиль ' + name + '?')) {
                            LampaUltimate.modules.profiles.loadProfile(name);
                        }
                    };
                });
                // Удалить профиль
                content.querySelectorAll('.ultimate-profile-del').forEach(btn => {
                    btn.onclick = function() {
                        let name = btn.dataset.profile;
                        if (confirm('Удалить профиль ' + name + '?')) {
                            LampaUltimate.modules.profiles.deleteProfile(name);
                            renderTab('profiles');
                        }
                    };
                });
                // Экспорт
                content.querySelectorAll('.ultimate-profile-export').forEach(btn => {
                    btn.onclick = function() {
                        let name = btn.dataset.profile;
                        prompt('JSON для экспорта:', LampaUltimate.modules.profiles.exportProfile(name));
                    };
                });
                // Импорт
                content.querySelectorAll('.ultimate-profile-import').forEach(btn => {
                    btn.onclick = function() {
                        let name = btn.dataset.profile;
                        let json = prompt('Вставьте JSON для импорта:');
                        if (json) {
                            LampaUltimate.modules.profiles.importProfile(name, json);
                            renderTab('profiles');
                        }
                    };
                });
                // Поделиться (генерация ссылки)
                content.querySelectorAll('.ultimate-profile-share').forEach(btn => {
                    btn.onclick = function() {
                        let name = btn.dataset.profile;
                        prompt('Ссылка для импорта профиля:', LampaUltimate.modules.profiles.exportLink(name));
                    };
                });
                // Создать профиль
                let addBtn = content.querySelector('#ultimate-profile-add');
                if (addBtn) addBtn.onclick = function() {
                    let name = prompt('Название нового профиля:');
                    if (name && !LampaUltimate.settings.profiles.list[name]) {
                        LampaUltimate.modules.profiles.saveProfile(name);
                        renderTab('profiles');
                    }
                };
            }
        }
    };

    // --- Модуль "Темы и кастомизация" ---
    LampaUltimate.modules.themes = {
        enabled: true,
        name: 'Темы и кастомизация',
        themes: {
            dark: {
                name: 'Темная',
                css: 'body { background: #181828 !important; color: #fff !important; } .ultimate-badge, .ultimate-logo, .ultimate-collection-btn { filter: none !important; }'
            },
            light: {
                name: 'Светлая',
                css: 'body { background: #f5f5f5 !important; color: #222 !important; } .ultimate-badge, .ultimate-logo, .ultimate-collection-btn { filter: none !important; }'
            },
            color: {
                name: 'Цветная',
                css: 'body { background: linear-gradient(120deg,#00dbde,#fc00ff) !important; color: #fff !important; }'
            }
        },
        current: 'dark',
        elementSize: 'normal', // normal | large | compact
        buttonStyle: 'rounded', // rounded | flat | outline
        iconStyle: 'color', // color | mono | outline
        init() {
            LampaUltimate.settings.themes = LampaUltimate.settings.themes || {
                current: 'dark',
                elementSize: 'normal',
                buttonStyle: 'rounded',
                iconStyle: 'color'
            };
            this.current = LampaUltimate.settings.themes.current;
            this.elementSize = LampaUltimate.settings.themes.elementSize;
            this.buttonStyle = LampaUltimate.settings.themes.buttonStyle;
            this.iconStyle = LampaUltimate.settings.themes.iconStyle;
            this.applyTheme(this.current);
        },
        applyTheme(themeKey) {
            let theme = this.themes[themeKey];
            if (!theme) return;
            let style = document.getElementById('ultimate-theme-style');
            if (!style) {
                style = document.createElement('style');
                style.id = 'ultimate-theme-style';
                document.head.appendChild(style);
            }
            style.innerHTML = theme.css;
            this.current = themeKey;
            LampaUltimate.settings.themes.current = themeKey;
            LampaUltimate.saveSettings();
        }
    };

    // --- Вкладка "Внешний вид" в меню ---
    const origRenderTabAppearance = LampaUltimate.renderCustomMenu;
    LampaUltimate.renderCustomMenu = function() {
        origRenderTabAppearance.call(this);
        // Переопределяем рендер вкладки "Внешний вид"
        let tabsBar = document.getElementById('lampa-ultimate-tabs');
        let content = document.getElementById('lampa-ultimate-content');
        function renderTab(tabId) {
            Array.from(tabsBar.children).forEach(btn => btn.style.borderBottom = 'none');
            let activeBtn = Array.from(tabsBar.children).find(btn => btn.dataset.tab === tabId);
            if (activeBtn) activeBtn.style.borderBottom = '2px solid #00dbde';
            if (tabId === 'appearance') {
                let t = LampaUltimate.modules.themes;
                let html = `<h3>Внешний вид</h3>
                <label>Тема:
                    <select id="ultimate-theme-select">
                        ${Object.keys(t.themes).map(key => `<option value="${key}" ${t.current===key?'selected':''}>${t.themes[key].name}</option>`).join('')}
                    </select>
                </label>
                <label style="margin-left:20px;">Размер элементов:
                    <select id="ultimate-size-select">
                        <option value="normal" ${t.elementSize==='normal'?'selected':''}>Обычный</option>
                        <option value="large" ${t.elementSize==='large'?'selected':''}>Крупный</option>
                        <option value="compact" ${t.elementSize==='compact'?'selected':''}>Компактный</option>
                    </select>
                </label>
                <label style="margin-left:20px;">Стиль кнопок:
                    <select id="ultimate-btn-style">
                        <option value="rounded" ${t.buttonStyle==='rounded'?'selected':''}>Скругленные</option>
                        <option value="flat" ${t.buttonStyle==='flat'?'selected':''}>Плоские</option>
                        <option value="outline" ${t.buttonStyle==='outline'?'selected':''}>Outline</option>
                    </select>
                </label>
                <label style="margin-left:20px;">Стиль иконок:
                    <select id="ultimate-icon-style">
                        <option value="color" ${t.iconStyle==='color'?'selected':''}>Цветные</option>
                        <option value="mono" ${t.iconStyle==='mono'?'selected':''}>Монохром</option>
                        <option value="outline" ${t.iconStyle==='outline'?'selected':''}>Outline</option>
                    </select>
                </label>
                <hr><div style="margin-top:10px;">Drag&drop для панели быстрого доступа и порядка модулей (базовая демо):</div>
                <ul id="ultimate-modules-dnd" style="list-style:none;padding:0;display:flex;gap:10px;">${Object.keys(LampaUltimate.modules).map(m=>`<li draggable="true" data-mod="${m}" style="background:#333;padding:6px 14px;border-radius:8px;cursor:grab;">${LampaUltimate.modules[m].name||m}</li>`).join('')}</ul>`;
                content.innerHTML = html;
                // Селекты тем и стилей
                let themeSel = content.querySelector('#ultimate-theme-select');
                let sizeSel = content.querySelector('#ultimate-size-select');
                let btnStyleSel = content.querySelector('#ultimate-btn-style');
                let iconStyleSel = content.querySelector('#ultimate-icon-style');
                if (themeSel) themeSel.onchange = function() { t.applyTheme(themeSel.value); };
                if (sizeSel) sizeSel.onchange = function() { t.elementSize = sizeSel.value; LampaUltimate.settings.themes.elementSize = sizeSel.value; LampaUltimate.saveSettings(); };
                if (btnStyleSel) btnStyleSel.onchange = function() { t.buttonStyle = btnStyleSel.value; LampaUltimate.settings.themes.buttonStyle = btnStyleSel.value; LampaUltimate.saveSettings(); };
                if (iconStyleSel) iconStyleSel.onchange = function() { t.iconStyle = iconStyleSel.value; LampaUltimate.settings.themes.iconStyle = iconStyleSel.value; LampaUltimate.saveSettings(); };
                // Drag&drop модулей (базовая реализация)
                let dnd = content.querySelector('#ultimate-modules-dnd');
                if (dnd) {
                    let dragSrc = null;
                    dnd.querySelectorAll('li').forEach(li => {
                        li.ondragstart = function(e) { dragSrc = li; li.style.opacity = 0.5; };
                        li.ondragend = function(e) { dragSrc = null; li.style.opacity = 1; };
                        li.ondragover = function(e) { e.preventDefault(); };
                        li.ondrop = function(e) {
                            e.preventDefault();
                            if (dragSrc && dragSrc !== li) {
                                dnd.insertBefore(dragSrc, li.nextSibling);
                                // Можно сохранить порядок в настройках
                            }
                        };
                    });
                }
            }
        }
    };

    // --- Модуль "Эксперименты" ---
    LampaUltimate.modules.experiments = {
        enabled: true,
        name: 'Эксперименты',
        options: {
            showFPS: false,
            altCardRender: false
        },
        init() {
            LampaUltimate.settings.experiments = LampaUltimate.settings.experiments || {
                showFPS: false,
                altCardRender: false
            };
            this.options = Object.assign({}, LampaUltimate.settings.experiments);
            // Пример: показать счетчик FPS
            if (this.options.showFPS && !document.getElementById('ultimate-fps-counter')) {
                let fpsDiv = document.createElement('div');
                fpsDiv.id = 'ultimate-fps-counter';
                fpsDiv.style = 'position:fixed;bottom:8px;left:8px;z-index:999999;background:#222;color:#fff;padding:4px 12px;border-radius:8px;font-size:1em;opacity:0.8;';
                document.body.appendChild(fpsDiv);
                let last = performance.now(), frames = 0, fps = 0;
                function loop() {
                    frames++;
                    let now = performance.now();
                    if (now - last > 1000) {
                        fps = frames; frames = 0; last = now;
                        fpsDiv.textContent = 'FPS: ' + fps;
                    }
                    if (document.getElementById('ultimate-fps-counter')) requestAnimationFrame(loop);
                }
                loop();
            } else if (!this.options.showFPS && document.getElementById('ultimate-fps-counter')) {
                document.getElementById('ultimate-fps-counter').remove();
            }
            // Пример: альтернативный рендер карточек (заглушка)
            if (this.options.altCardRender) {
                // Можно реализовать альтернативный стиль карточек
            }
        }
    };

    // --- Вкладка "Эксперименты" в меню ---
    const origRenderTabExperiments = LampaUltimate.renderCustomMenu;
    LampaUltimate.renderCustomMenu = function() {
        origRenderTabExperiments.call(this);
        // Переопределяем рендер вкладки "Эксперименты"
        let tabsBar = document.getElementById('lampa-ultimate-tabs');
        let content = document.getElementById('lampa-ultimate-content');
        function renderTab(tabId) {
            Array.from(tabsBar.children).forEach(btn => btn.style.borderBottom = 'none');
            let activeBtn = Array.from(tabsBar.children).find(btn => btn.dataset.tab === tabId);
            if (activeBtn) activeBtn.style.borderBottom = '2px solid #00dbde';
            if (tabId === 'experiments') {
                let e = LampaUltimate.modules.experiments;
                let html = `<h3>Экспериментальные функции</h3>
                <label><input type="checkbox" id="exp-fps" ${e.options.showFPS?'checked':''}> Показать счетчик FPS</label><br>
                <label><input type="checkbox" id="exp-altcard" ${e.options.altCardRender?'checked':''}> Альтернативный рендер карточек (демо)</label><br>
                <div style="margin-top:10px;color:#aaa;">Включайте экспериментальные функции на свой страх и риск!</div>`;
                content.innerHTML = html;
                let fpsChk = content.querySelector('#exp-fps');
                let altChk = content.querySelector('#exp-altcard');
                if (fpsChk) fpsChk.onchange = function() {
                    e.options.showFPS = fpsChk.checked;
                    LampaUltimate.settings.experiments.showFPS = fpsChk.checked;
                    LampaUltimate.saveSettings();
                    e.init();
                };
                if (altChk) altChk.onchange = function() {
                    e.options.altCardRender = altChk.checked;
                    LampaUltimate.settings.experiments.altCardRender = altChk.checked;
                    LampaUltimate.saveSettings();
                    e.init();
                };
            }
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

    // --- Настройки Telegram-бота ---
    LampaUltimate.settings.telegram = LampaUltimate.settings.telegram || {
        botToken: '', // <-- сюда вставить токен вашего Telegram-бота
        chatId: '',   // <-- сюда вставить chat_id (ваш или канала)
        supportLink: 'https://t.me/your_channel_or_chat' // ссылка на поддержку/новости
    };
    // Для подключения Telegram-бота:
    // 1. Получите токен у @BotFather и вставьте в botToken
    // 2. Узнайте chat_id через @userinfobot или API и вставьте в chatId
    // 3. Укажите ссылку на канал/чат для кнопки поддержки

    // --- Секция для кастомных SVG/PNG иконок/лого ---
    // Пример: LampaUltimate.icons = { myIcon: 'data:image/svg+xml;utf8,<svg .../svg>' }
    // Можно добавить свои SVG/PNG и использовать их в UI (см. комментарии в коде)
    LampaUltimate.icons = {
        // myIcon: 'data:image/svg+xml;utf8,<svg .../svg>'
    };

    // --- Модуль "Рекомендации" ---
    LampaUltimate.modules.recommendations = {
        enabled: true,
        name: 'Рекомендации',
        lastRandom: null,
        getPersonalized(allCards) {
            // Пример: топ-10 жанров пользователя
            let genres = {};
            let watched = allCards.filter(card => card.watched || card.is_watched || card.progress === 1);
            watched.forEach(card => (card.genres||[]).forEach(g => genres[g] = (genres[g]||0)+1));
            let topGenre = Object.entries(genres).sort((a,b)=>b[1]-a[1])[0]?.[0];
            return allCards.filter(card => (card.genres||[]).includes(topGenre) && !watched.includes(card)).slice(0,10);
        },
        getSimilar(card, allCards) {
            // Пример: похожие по жанру
            return allCards.filter(c => c.id!==card.id && (c.genres||[]).some(g => (card.genres||[]).includes(g))).slice(0,10);
        },
        getRandom(allCards) {
            let unwatched = allCards.filter(card => !(card.watched || card.is_watched || card.progress === 1));
            this.lastRandom = unwatched[Math.floor(Math.random()*unwatched.length)];
            return this.lastRandom;
        }
    };

    // --- Модуль "Уведомления" ---
    LampaUltimate.modules.notifications = {
        enabled: true,
        name: 'Уведомления',
        reminders: [], // [{title, time, cardId}]
        addReminder(title, time, cardId) {
            this.reminders.push({title, time, cardId});
            this.save();
        },
        save() {
            localStorage.setItem('lampa_ultimate_reminders', JSON.stringify(this.reminders));
        },
        load() {
            let r = localStorage.getItem('lampa_ultimate_reminders');
            this.reminders = r ? JSON.parse(r) : [];
        },
        checkReminders() {
            let now = Date.now();
            this.reminders.forEach(rem => {
                if (rem.time && now >= rem.time && !rem.notified) {
                    this.notify(rem.title);
                    rem.notified = true;
                    // Telegram push
                    LampaUltimate.modules.telegram.sendMessage(`Напоминание: ${rem.title}`);
                }
            });
            this.save();
        },
        notify(msg) {
            if (window.Notification && Notification.permission === 'granted') {
                new Notification('Lampa', { body: msg });
            } else {
                alert(msg);
            }
        },
        requestPermission() {
            if (window.Notification && Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
        },
        init() {
            this.load();
            this.requestPermission();
            setInterval(()=>this.checkReminders(), 60000);
        }
    };

    // --- Модуль "Telegram-интеграция" ---
    LampaUltimate.modules.telegram = {
        enabled: true,
        name: 'Telegram',
        sendMessage(msg) {
            let token = LampaUltimate.settings.telegram.botToken;
            let chat = LampaUltimate.settings.telegram.chatId;
            if (!token || !chat) return;
            fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ chat_id: chat, text: msg })
            });
        },
        exportToTelegram(data, caption) {
            this.sendMessage((caption||'Экспорт данных:') + '\n' + data);
        },
        importFromTelegram() {
            // Можно реализовать через команду боту или ссылку
        },
        supportLink() {
            return LampaUltimate.settings.telegram.supportLink;
        }
    };

    // --- Вкладка "Рекомендации" в меню ---
    const origRenderTabRecommendations = LampaUltimate.renderCustomMenu;
    LampaUltimate.renderCustomMenu = function() {
        origRenderTabRecommendations.call(this);
        let tabsBar = document.getElementById('lampa-ultimate-tabs');
        let content = document.getElementById('lampa-ultimate-content');
        function renderTab(tabId) {
            Array.from(tabsBar.children).forEach(btn => btn.style.borderBottom = 'none');
            let activeBtn = Array.from(tabsBar.children).find(btn => btn.dataset.tab === tabId);
            if (activeBtn) activeBtn.style.borderBottom = '2px solid #00dbde';
            if (tabId === 'recommendations') {
                let allCards = window.Lampa && Lampa.Data && Lampa.Data.cards ? Lampa.Data.cards : [];
                let rec = LampaUltimate.modules.recommendations;
                let pers = rec.getPersonalized(allCards);
                let html = `<h3>Персональные рекомендации</h3><ul style="list-style:none;padding:0;">`;
                pers.forEach(card => { html += `<li>${card.title||card.name||card.original_title}</li>`; });
                html += '</ul>';
                html += `<button id="ultimate-random-btn">Случайный фильм</button>`;
                content.innerHTML = html;
                let randBtn = content.querySelector('#ultimate-random-btn');
                if (randBtn) randBtn.onclick = function() {
                    let rnd = rec.getRandom(allCards);
                    alert('Случайный фильм: ' + (rnd?.title||rnd?.name||rnd?.original_title||'нет'));
                };
            }
            if (tabId === 'notifications') {
                let n = LampaUltimate.modules.notifications;
                let html = `<h3>Уведомления и напоминания</h3><ul style="list-style:none;padding:0;">`;
                n.reminders.forEach(rem => { html += `<li>${rem.title} (${new Date(rem.time).toLocaleString()})</li>`; });
                html += '</ul>';
                html += `<button id="ultimate-add-reminder">Добавить напоминание</button>`;
                content.innerHTML = html;
                let addBtn = content.querySelector('#ultimate-add-reminder');
                if (addBtn) addBtn.onclick = function() {
                    let title = prompt('Текст напоминания:');
                    let time = prompt('Время (YYYY-MM-DD HH:MM):');
                    if (title && time) {
                        let t = new Date(time.replace(' ', 'T')).getTime();
                        n.addReminder(title, t);
                        alert('Напоминание добавлено!');
                    }
                };
            }
            if (tabId === 'telegram') {
                let t = LampaUltimate.modules.telegram;
                let html = `<h3>Интеграция с Telegram</h3>
                <div>Бот: <b>${LampaUltimate.settings.telegram.botToken ? 'Подключен' : 'Не подключен'}</b></div>
                <div>Чат/канал: <b>${LampaUltimate.settings.telegram.chatId||'-'}</b></div>
                <div><a href="${t.supportLink()}" target="_blank" style="color:#00dbde;">Поддержка/Новости</a></div>
                <button id="ultimate-tg-export">Экспорт профиля в Telegram</button>`;
                content.innerHTML = html;
                let expBtn = content.querySelector('#ultimate-tg-export');
                if (expBtn) expBtn.onclick = function() {
                    let name = LampaUltimate.settings.profiles.active;
                    let data = LampaUltimate.modules.profiles.exportProfile(name);
                    t.exportToTelegram(data, 'Экспорт профиля: ' + name);
                    alert('Профиль отправлен в Telegram!');
                };
            }
        }
    };

    // --- Интеграция с настройками Lampa (как у Bywolf88) ---
    function addUltimateSettingsComponent() {
        Lampa.SettingsApi.addComponent({
            component: 'lampa_ultimate',
            name: 'Ultimate Modular',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00dbde"/><text x="12" y="17" text-anchor="middle" font-size="10" fill="#fff">ULT</text></svg>'
        });
        // Кнопка для открытия кастомного меню
        Lampa.SettingsApi.addParam({
            component: 'lampa_ultimate',
            param: { type: 'button', component: 'open_menu' },
            field: { name: 'Открыть меню Ultimate', description: 'Настройте интерфейс, модули, профили и внешний вид' },
            onChange: () => {
                if (LampaUltimate.renderCustomMenu) LampaUltimate.renderCustomMenu();
            }
        });
        // Пример параметра: включение/выключение бейджей
        Lampa.SettingsApi.addParam({
            component: 'lampa_ultimate',
            param: { name: 'badges_enabled', type: 'trigger', default: true },
            field: { name: 'Бейджи качества и серий', description: 'Показывать бейджи на карточках' },
            onChange: (val) => {
                if (LampaUltimate.modules.badges) {
                    LampaUltimate.modules.badges.enabled = val;
                    LampaUltimate.settings.badges = LampaUltimate.settings.badges || {};
                    LampaUltimate.settings.badges.enabled = val;
                    LampaUltimate.saveSettings();
                }
            }
        });
        // Пример параметра: включение/выключение логотипов
        Lampa.SettingsApi.addParam({
            component: 'lampa_ultimate',
            param: { name: 'logos_enabled', type: 'trigger', default: true },
            field: { name: 'Оригинальные логотипы', description: 'Показывать оригинальные логотипы на карточках' },
            onChange: (val) => {
                if (LampaUltimate.modules.logos) {
                    LampaUltimate.modules.logos.enabled = val;
                    LampaUltimate.settings.logos = LampaUltimate.settings.logos || {};
                    LampaUltimate.settings.logos.enabled = val;
                    LampaUltimate.saveSettings();
                }
            }
        });
        // Можно добавить другие параметры по аналогии (VPN, фильтры, коллекции и т.д.)
    }

    // --- Автоинициализация вкладки в настройках ---
    setTimeout(() => {
        if (window.Lampa && Lampa.SettingsApi) {
            addUltimateSettingsComponent();
        }
        if (LampaUltimate.init) LampaUltimate.init();
    }, 1000);

    // Экспорт для отладки
    window.LampaUltimate = LampaUltimate;
})();