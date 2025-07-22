(() => {
    // Ожидаем полной загрузки API плагинов LAMPA
    const initPlugin = () => {
        // Проверяем доступность API
        if (window.Plugin && typeof Plugin.register === 'function') {
            // Регистрируем плагин
            Plugin.register('ultimate_modular', {
                version: '1.0.0',
                icon: 'icon.png',
                init: function() {
                    console.log('[Ultimate Modular] Plugin initialized!');

    // Конфигурация плагина
    const LUM = {
        // Доступные темы (загружаются из themes.js)
        themes: {
            dark_teal: {
                name: "Темная бирюзовая",
                colors: {
                    '--primary': '#00c8c8',
                    '--secondary': '#007a7a',
                    '--accent': '#ff3c5a',
                    '--dark': '#0f1a1f',
                    '--card-bg': '#1a2a2f',
                    '--text': '#e0f0f0'
                }
            }
        },
        
        settings: {
            theme: 'dark_teal',
            cardSize: 120,
            animations: true,
            activeModules: ['cards', 'ratings', 'vpn']
        },
        
        // Инициализация
        init: function() {
            this.loadThemes(() => {
                this.applyTheme();
                this.loadCSS();
                this.loadModules();
                this.addMenu();
                console.log('Ultimate Modular initialized');
            });
        },
        
        // Загрузка тем из внешнего файла
        loadThemes: function(callback) {
            const themesScript = document.createElement('script');
            themesScript.src = 'https://[your-username].github.io/lampa-ultimate-modular/assets/themes.js';
            themesScript.onload = () => {
                if (window.LUM_Themes) {
                    this.themes = window.LUM_Themes;
                    console.log('Themes loaded:', Object.keys(this.themes).length);
                }
                if (callback) callback();
            };
            themesScript.onerror = () => {
                console.error('Failed to load themes');
                if (callback) callback();
            };
            document.head.appendChild(themesScript);
        },
        
        // Загрузка CSS
        loadCSS: function() {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://[your-username].github.io/lampa-ultimate-modular/assets/styles.css';
            document.head.appendChild(link);
        },
        
        // Загрузка модулей
        loadModules: function() {
            this.settings.activeModules.forEach(module => {
                const script = document.createElement('script');
                script.src = `https://[your-username].github.io/lampa-ultimate-modular/modules/${module}.js`;
                script.async = true;
                document.head.appendChild(script);
            });
        },
        
        // Добавление меню
        addMenu: function() {
            Lampa.SettingsMenu.add('ultimate_modular', {
                name: 'Ultimate Modular',
                icon: 'https://[your-username].github.io/lampa-ultimate-modular/icon.png',
                component: {
                    template: `
                        <div class="settings">
                            <div class="settings__title">Ultimate Modular</div>
                            <div class="settings-list">
                                <div class="settings-list__item" data-component="themes"></div>
                                <div class="settings-list__item" data-component="modules"></div>
                                <div class="settings-list__item" data-component="profiles"></div>
                            </div>
                        </div>
                    `,
                    mounted() {
                        this.renderComponents();
                    },
                    renderComponents() {
                        this.html.find('[data-component="themes"]').html(this.renderThemes());
                        this.html.find('[data-component="modules"]').html(this.renderModules());
                        this.html.find('[data-component="profiles"]').html(this.renderProfiles());
                    },
                    renderThemes() {
                        return `
                            <div class="lum-theme-selector">
                                <div class="lum-title">Выбор темы</div>
                                <div class="lum-themes-grid">
                                    ${Object.entries(LUM.themes).map(([id, theme]) => `
                                        <div class="lum-theme-option" data-theme="${id}" 
                                            style="background: linear-gradient(135deg, 
                                                ${theme.colors['--dark'] || '#0f1a1f'}, 
                                                ${theme.colors['--card-bg'] || '#1a2a2f'})">
                                            <div class="lum-theme-name">${theme.name}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    },
                    renderModules() {
                        return `
                            <div class="lum-module-manager">
                                <div class="lum-title">Управление модулями</div>
                                <div class="lum-modules-list">
                                    <div class="lum-module-item">
                                        <label class="lum-switch">
                                            <input type="checkbox" checked data-module="cards">
                                            <span class="lum-slider"></span>
                                        </label>
                                        <div class="lum-module-info">
                                            <div class="lum-module-icon">🎬</div>
                                            <div>
                                                <div class="lum-module-name">Улучшенные карточки</div>
                                                <div class="lum-module-desc">Бейджи, логотипы, действия</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="lum-module-item">
                                        <label class="lum-switch">
                                            <input type="checkbox" checked data-module="ratings">
                                            <span class="lum-slider"></span>
                                        </label>
                                        <div class="lum-module-info">
                                            <div class="lum-module-icon">⭐</div>
                                            <div>
                                                <div class="lum-module-name">Рейтинги</div>
                                                <div class="lum-module-desc">IMDb и Кинопоиск</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="lum-module-item">
                                        <label class="lum-switch">
                                            <input type="checkbox" checked data-module="vpn">
                                            <span class="lum-slider"></span>
                                        </label>
                                        <div class="lum-module-info">
                                            <div class="lum-module-icon">🛡️</div>
                                            <div>
                                                <div class="lum-module-name">VPN Checker</div>
                                                <div class="lum-module-desc">Индикатор соединения</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="lum-module-item">
                                        <label class="lum-switch">
                                            <input type="checkbox" data-module="analytics">
                                            <span class="lum-slider"></span>
                                        </label>
                                        <div class="lum-module-info">
                                            <div class="lum-module-icon">📊</div>
                                            <div>
                                                <div class="lum-module-name">Аналитика</div>
                                                <div class="lum-module-desc">Статистика просмотров</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    },
                    renderProfiles() {
                        return `
                            <div class="lum-profile-manager">
                                <div class="lum-title">Профили настроек</div>
                                <div class="lum-profile-actions">
                                    <div class="lum-button" data-action="save-tv">Сохранить TV профиль</div>
                                    <div class="lum-button" data-action="save-mobile">Сохранить Mobile профиль</div>
                                </div>
                            </div>
                        `;
                    }
                }
            });
        },
        
        // Применение темы
        applyTheme: function() {
            const theme = this.themes[this.settings.theme] || this.themes.dark_teal;
            if (!theme) return;
            
            Object.entries(theme.colors).forEach(([key, value]) => {
                document.documentElement.style.setProperty(key, value);
            });
            
            // Анимация смены темы
            document.body.classList.add('theme-changing');
            setTimeout(() => {
                document.body.classList.remove('theme-changing');
            }, 500);
            
            console.log(`Theme applied: ${this.settings.theme}`);
        },
        
        // Смена темы
        changeTheme: function(themeId) {
            if (!this.themes[themeId]) {
                console.error(`Theme not found: ${themeId}`);
                return;
            }
            
            this.settings.theme = themeId;
            this.applyTheme();
            
            // Сохранение в localStorage
            localStorage.setItem('lum_theme', themeId);
        }
    };

    // Обработчики событий
    document.addEventListener('click', (e) => {
        // Смена темы
        const themeOption = e.target.closest('.lum-theme-option');
        if (themeOption) {
            const themeId = themeOption.dataset.theme;
            LUM.changeTheme(themeId);
        }
        
        // Сохранение профилей
        const profileButton = e.target.closest('.lum-button');
        if (profileButton && profileButton.dataset.action) {
            if (profileButton.dataset.action === 'save-tv') {
                LUM.saveProfile('tv', {
                    cardSize: 130,
                    theme: LUM.settings.theme,
                    activeModules: ['cards', 'ratings', 'vpn']
                });
                Lampa.Noty.show('TV профиль сохранён!');
            }
            else if (profileButton.dataset.action === 'save-mobile') {
                LUM.saveProfile('mobile', {
                    cardSize: 100,
                    theme: LUM.settings.theme,
                    activeModules: ['cards', 'ratings']
                });
                Lampa.Noty.show('Mobile профиль сохранён!');
            }
        }
    });
    
    // Сохранение профиля
    LUM.saveProfile = function(name, settings) {
        const profile = {
            name,
            ...settings,
            timestamp: Date.now()
        };
        
        localStorage.setItem(`lum_profile_${name}`, JSON.stringify(profile));
        localStorage.setItem('lum_current_profile', name);
        console.log(`Profile saved: ${name}`);
    };

    // Загрузка темы из localStorage
    const savedTheme = localStorage.getItem('lum_theme');
    if (savedTheme) {
        LUM.settings.theme = savedTheme;
    }

    // Инициализация при запуске Lampa
    Lampa.Listener.follow('app', (e) => {
        if (e.type === 'ready') {
            LUM.init();
        }
    });

})(window.Plugin = window.Plugin || {});
 // 1. Добавляем кнопку в главное меню
                    Lampa.Listener.follow('app', (e) => {
                        if (e.type === 'ready') {
                            // Создаем кнопку плагина
                            const pluginButton = document.createElement('div');
                            pluginButton.classList.add('selector', '__margined', '__compact');
                            pluginButton.innerHTML = `
                                <div class="selector__icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                        <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"/>
                                    </svg>
                                </div>
                                <div class="selector__title">Ultimate Modular</div>
                            `;
                            pluginButton.style.margin = '15px';
                            pluginButton.style.cursor = 'pointer';
                            
                            // Обработчик клика
                            pluginButton.addEventListener('click', () => {
                                // 2. Показываем кастомное модальное окно
                                Lampa.Modal.open({
                                    title: 'Ultimate Modular',
                                    html: `
                                        <div style="padding:20px;text-align:center">
                                            <h3>Плагин успешно активирован!</h3>
                                            <p>Версия: 1.0.0</p>
                                            <div style="margin-top:30px">
                                                <button class="button button--light" style="padding:10px 25px" data-close>OK</button>
                                            </div>
                                        </div>
                                    `,
                                    width: 500,
                                    onBack: true
                                });
                            });
                            
                            // 3. Добавляем кнопку в интерфейс
                            const header = document.querySelector('.head__content');
                            if (header) {
                                // Проверяем, не добавлена ли кнопка ранее
                                if (!document.querySelector('.selector[data-ultimate-modular]')) {
                                    pluginButton.setAttribute('data-ultimate-modular', 'true');
                                    header.appendChild(pluginButton);
                                }
                            }
                        }
                    });
                    
                    // 4. Добавляем кастомные стили
                    const css = `
                        [data-ultimate-modular] {
                            transition: transform 0.2s;
                        }
                        [data-ultimate-modular]:hover {
                            transform: scale(1.05);
                        }
                        [data-ultimate-modular] .selector__icon {
                            background: linear-gradient(45deg, #6a11cb, #2575fc);
                        }
                    `;
                    const style = document.createElement('style');
                    style.id = 'ultimate-modular-styles';
                    style.textContent = css;
                    document.head.appendChild(style);
                    
                    // 5. Функционал можно добавлять здесь
                    // ... ваш дополнительный код ...
                    
                },
                destroy: function() {
                    // Очистка при деактивации плагина
                    console.log('[Ultimate Modular] Plugin destroyed');
                    
                    // Удаляем добавленные элементы
                    document.querySelectorAll('[data-ultimate-modular]').forEach(el => el.remove());
                    
                    // Удаляем стили
                    const styles = document.getElementById('ultimate-modular-styles');
                    if (styles) styles.remove();
                }
            });
        } else {
            // Повторяем проверку через 100мс если API не готово
            setTimeout(initPlugin, 100);
        }
    };

    // Старт инициализации
    if (document.readyState === 'complete') {
        initPlugin();
    } else {
        window.addEventListener('load', initPlugin);
    }
})();
