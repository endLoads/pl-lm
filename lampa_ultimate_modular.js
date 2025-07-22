/*
Lampa Ultimate Modular Plugin
============================

// Этап 1: Базовая архитектура, меню, профили, drag&drop
// Подключи этот файл как плагин в Lampa. После загрузки появится раздел "Ultimate Modular" с рабочим меню и профилями.
*/

(function () {
    'use strict';

    // --- Глобальный объект плагина ---
    const LampaUltimate = {
        version: '1.0.0',
        modules: {},
        settings: {},
        profiles: {},
        activeProfile: 'default',
        menuTabs: [
            {id:'main', label:'Главное'},
            {id:'modules', label:'Модули'},
            {id:'appearance', label:'Внешний вид'},
            {id:'profiles', label:'Профили'},
            {id:'collections', label:'Коллекции'},
            {id:'analytics', label:'Аналитика'},
            {id:'experiments', label:'Эксперименты'},
            {id:'recommendations', label:'Рекомендации'},
            {id:'notifications', label:'Уведомления'},
            {id:'telegram', label:'Telegram'}
        ],
        // --- Профили ---
        saveProfile(name) {
            if (!name) return;
            this.profiles[name] = JSON.parse(JSON.stringify(this.settings));
            this.activeProfile = name;
            this.saveProfiles();
        },
        loadProfile(name) {
            if (this.profiles[name]) {
                this.settings = JSON.parse(JSON.stringify(this.profiles[name]));
                this.activeProfile = name;
                this.saveSettings();
            }
        },
        deleteProfile(name) {
            if (name === 'default') return;
            delete this.profiles[name];
            if (this.activeProfile === name) this.activeProfile = 'default';
            this.saveProfiles();
        },
        exportProfile(name) {
            return btoa(unescape(encodeURIComponent(JSON.stringify(this.profiles[name]))));
        },
        importProfile(name, data) {
            try {
                this.profiles[name] = JSON.parse(decodeURIComponent(escape(atob(data))));
                this.saveProfiles();
            } catch(e) {}
        },
        saveSettings() {
            localStorage.setItem('lampa_ultimate_settings', JSON.stringify(this.settings));
        },
        loadSettings() {
            const s = localStorage.getItem('lampa_ultimate_settings');
            if (s) this.settings = JSON.parse(s);
        },
        saveProfiles() {
            localStorage.setItem('lampa_ultimate_profiles', JSON.stringify(this.profiles));
        },
        loadProfiles() {
            const p = localStorage.getItem('lampa_ultimate_profiles');
            if (p) this.profiles = JSON.parse(p);
        },
        // --- Меню ---
        renderMenu() {
            let old = document.getElementById('lampa-ultimate-menu');
            if (old) old.remove();
            let menu = document.createElement('div');
            menu.id = 'lampa-ultimate-menu';
            menu.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;background:rgba(10,10,30,0.98);color:#fff;overflow:auto;padding:0;margin:0;font-family:sans-serif;';
            // Заголовок
            let header = document.createElement('div');
            header.style = 'display:flex;align-items:center;justify-content:space-between;padding:20px 30px 10px 30px;font-size:2em;font-weight:bold;';
            header.innerHTML = '<span>Ultimate Modular</span>' +
                '<button id="lampa-ultimate-close" style="font-size:1.5em;background:none;border:none;color:#fff;cursor:pointer;">×</button>';
            menu.appendChild(header);
            // Вкладки
            let tabsBar = document.createElement('div');
            tabsBar.style = 'display:flex;gap:20px;padding:0 30px 10px 30px;border-bottom:1px solid #333;';
            tabsBar.id = 'lampa-ultimate-tabs';
            this.menuTabs.forEach(tab => {
                let btn = document.createElement('button');
                btn.textContent = tab.label;
                btn.dataset.tab = tab.id;
                btn.style = 'background:none;border:none;color:#fff;font-size:1.1em;padding:10px 0 8px 0;cursor:pointer;';
                btn.onclick = () => renderTab(tab.id);
                tabsBar.appendChild(btn);
            });
            menu.appendChild(tabsBar);
            // Контент
            let content = document.createElement('div');
            content.id = 'lampa-ultimate-content';
            content.style = 'padding:20px 30px;min-height:60vh;';
            menu.appendChild(content);
            document.body.appendChild(menu);
            document.getElementById('lampa-ultimate-close').onclick = () => menu.remove();
            // Drag&drop вкладок
            let dragSrc = null;
            tabsBar.querySelectorAll('button').forEach(btn => {
                btn.draggable = true;
                btn.ondragstart = e => { dragSrc = btn; btn.style.opacity = 0.5; };
                btn.ondragend = e => { dragSrc = null; btn.style.opacity = 1; };
                btn.ondragover = e => e.preventDefault();
                btn.ondrop = e => {
                    e.preventDefault();
                    if (dragSrc && dragSrc !== btn) {
                        tabsBar.insertBefore(dragSrc, btn.nextSibling);
                        // Можно сохранить порядок вкладок в настройках
                    }
                };
            });
            // Рендер первой вкладки
            renderTab('main');
            // --- Внутренняя функция рендера вкладки ---
            const self = this;
            function renderTab(tabId) {
                Array.from(tabsBar.children).forEach(btn => btn.style.borderBottom = 'none');
                let activeBtn = Array.from(tabsBar.children).find(btn => btn.dataset.tab === tabId);
                if (activeBtn) activeBtn.style.borderBottom = '2px solid #00dbde';
                if (tabId === 'main') {
                    content.innerHTML = `<h2>Ultimate Modular для Lampa</h2>
                    <p>Добро пожаловать! Здесь вы можете гибко настраивать интерфейс, модули, профили и внешний вид Lampa.</p>
                    <ul>
                      <li>Включайте и выключайте модули</li>
                      <li>Меняйте порядок и внешний вид</li>
                      <li>Сохраняйте профили настроек</li>
                      <li>Используйте быстрые фильтры и аналитику</li>
                    </ul>`;
                } else if (tabId === 'profiles') {
                    let html = `<h3>Профили</h3>
                    <div>Текущий профиль: <b>${self.activeProfile}</b></div>
                    <button id="lampa-ultimate-save-profile" style="margin:10px 0;">Сохранить текущий профиль</button>
                    <ul style="list-style:none;padding:0;">`;
                    Object.keys(self.profiles).forEach(name => {
                        html += `<li style="margin-bottom:8px;">
                            <button data-profile="${name}" class="ultimate-profile-load">Загрузить</button>
                            <button data-profile="${name}" class="ultimate-profile-del">Удалить</button>
                            <button data-profile="${name}" class="ultimate-profile-export">Экспорт</button>
                            <button data-profile="${name}" class="ultimate-profile-import">Импорт</button>
                            <span>${name}</span>
                        </li>`;
                    });
                    html += '</ul>';
                    html += `<button id="ultimate-profile-add">Создать профиль</button>`;
                    content.innerHTML = html;
                    // Сохранить профиль
                    content.querySelector('#lampa-ultimate-save-profile').onclick = function() {
                        let name = prompt('Введите имя профиля:');
                        if (name) {
                            self.saveProfile(name);
                            renderTab('profiles');
                        }
                    };
                    // Загрузить профиль
                    content.querySelectorAll('.ultimate-profile-load').forEach(btn => {
                        btn.onclick = function() {
                            let name = btn.dataset.profile;
                            if (confirm('Переключиться на профиль ' + name + '?')) {
                                self.loadProfile(name);
                                renderTab('profiles');
                            }
                        };
                    });
                    // Удалить профиль
                    content.querySelectorAll('.ultimate-profile-del').forEach(btn => {
                        btn.onclick = function() {
                            let name = btn.dataset.profile;
                            if (confirm('Удалить профиль ' + name + '?')) {
                                self.deleteProfile(name);
                                renderTab('profiles');
                            }
                        };
                    });
                    // Экспорт
                    content.querySelectorAll('.ultimate-profile-export').forEach(btn => {
                        btn.onclick = function() {
                            let name = btn.dataset.profile;
                            prompt('Данные для экспорта:', self.exportProfile(name));
                        };
                    });
                    // Импорт
                    content.querySelectorAll('.ultimate-profile-import').forEach(btn => {
                        btn.onclick = function() {
                            let name = btn.dataset.profile;
                            let data = prompt('Вставьте данные для импорта:');
                            if (data) {
                                self.importProfile(name, data);
                                renderTab('profiles');
                            }
                        };
                    });
                    // Создать профиль
                    let addBtn = content.querySelector('#ultimate-profile-add');
                    if (addBtn) addBtn.onclick = function() {
                        let name = prompt('Название нового профиля:');
                        if (name && !self.profiles[name]) {
                            self.saveProfile(name);
                            renderTab('profiles');
                        }
                    };
                } else {
                    content.innerHTML = `<h3>${self.menuTabs.find(t=>t.id===tabId).label}</h3><p>Настройки и функции появятся после реализации соответствующего модуля.</p>`;
                }
            }
        },
        // --- Инициализация ---
        init() {
            this.loadSettings();
            this.loadProfiles();
            // Добавить кнопку в настройки Lampa
            if (window.Lampa && Lampa.SettingsApi) {
                Lampa.SettingsApi.addComponent({
                    component: 'lampa_ultimate',
                    name: 'Ultimate Modular',
                    icon: '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00dbde"/><text x="12" y="17" text-anchor="middle" font-size="10" fill="#fff">ULT</text></svg>'
                });
                Lampa.SettingsApi.addParam({
                    component: 'lampa_ultimate',
                    param: { type: 'button', component: 'open_menu' },
                    field: { name: 'Открыть меню Ultimate', description: 'Настройте интерфейс, модули, профили и внешний вид' },
                    onChange: () => {
                        this.renderMenu();
                    }
                });
            } else {
                // Fallback: показывать меню по горячей клавише (например, Ctrl+U)
                document.addEventListener('keydown', e => {
                    if (e.ctrlKey && e.key.toLowerCase() === 'u') {
                        this.renderMenu();
                    }
                });
            }
        }
    };

    // --- Автоинициализация ---
    setTimeout(() => LampaUltimate.init(), 1000);
    window.LampaUltimate = LampaUltimate;
})();