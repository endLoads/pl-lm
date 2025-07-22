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
                        // Доступные темы
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
                            themesScript.src = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';
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
                            this.cssLink = document.createElement('link');
                            this.cssLink.rel = 'stylesheet';
                            this.cssLink.href = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';
                            document.head.appendChild(this.cssLink);
                        },
                        
                        // Загрузка модулей
                        loadModules: function() {
                            this.moduleScripts = [];
                            this.settings.activeModules.forEach(module => {
                                const script = document.createElement('script');
                                script.src = `https://endloads.github.io/pl-lm/lampa-ultimate-modular/modules/${module}.js`;
                                script.async = true;
                                this.moduleScripts.push(script);
                                document.head.appendChild(script);
                            });
                        },
                        
                        // Добавление меню
                        addMenu: function() {
                            Lampa.SettingsMenu.add('ultimate_modular', {
                                name: 'Ultimate Modular',
                                icon: 'icon.png',
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
                        },
                        
                        // Сохранение профиля
                        saveProfile: function(name, settings) {
                            const profile = {
                                name,
                                ...settings,
                                timestamp: Date.now()
                            };
                            
                            localStorage.setItem(`lum_profile_${name}`, JSON.stringify(profile));
                            localStorage.setItem('lum_current_profile', name);
                            console.log(`Profile saved: ${name}`);
                        },
                        
                        // Обработчик событий
                        setupEventListeners: function() {
                            this.clickHandler = (e) => {
                                // Смена темы
                                const themeOption = e.target.closest('.lum-theme-option');
                                if (themeOption) {
                                    const themeId = themeOption.dataset.theme;
                                    this.changeTheme(themeId);
                                    return;
                                }
                                
                                // Сохранение профилей
                                const profileButton = e.target.closest('.lum-button');
                                if (profileButton && profileButton.dataset.action) {
                                    if (profileButton.dataset.action === 'save-tv') {
                                        this.saveProfile('tv', {
                                            cardSize: 130,
                                            theme: this.settings.theme,
                                            activeModules: ['cards', 'ratings', 'vpn']
                                        });
                                        Lampa.Noty.show('TV профиль сохранён!');
                                    }
                                    else if (profileButton.dataset.action === 'save-mobile') {
                                        this.saveProfile('mobile', {
                                            cardSize: 100,
                                            theme: this.settings.theme,
                                            activeModules: ['cards', 'ratings']
                                        });
                                        Lampa.Noty.show('Mobile профиль сохранён!');
                                    }
                                }
                            };
                            
                            document.addEventListener('click', this.clickHandler);
                        },
                        
                        // Уничтожение плагина
                        destroy: function() {
                            // Удаление обработчиков событий
                            if (this.clickHandler) {
                                document.removeEventListener('click', this.clickHandler);
                            }
                            
                            // Удаление меню настроек
                            Lampa.SettingsMenu.remove('ultimate_modular');
                            
                            // Удаление CSS
                            if (this.cssLink) {
                                this.cssLink.remove();
                            }
                            
                            // Удаление скриптов модулей
                            if (this.moduleScripts) {
                                this.moduleScripts.forEach(script => script.remove());
                            }
                            
                            // Удаление стилей темы
                            Object.keys(this.themes.dark_teal.colors).forEach(key => {
                                document.documentElement.style.removeProperty(key);
                            });
                        }
                    };

                    // Загрузка темы из localStorage
                    const savedTheme = localStorage.getItem('lum_theme');
                    if (savedTheme && LUM.themes[savedTheme]) {
                        LUM.settings.theme = savedTheme;
                    }

                    // Инициализация при запуске Lampa
                    Lampa.Listener.follow('app', (e) => {
                        if (e.type === 'ready') {
                            LUM.setupEventListeners();
                            LUM.init();
                        }
                    });

                    // Сохраняем ссылку на LUM для уничтожения
                    this.LUM = LUM;
                },
                destroy: function() {
                    console.log('[Ultimate Modular] Plugin destroyed');
                    
                    // Удаляем добавленные элементы
                    document.querySelectorAll('[data-ultimate-modular]').forEach(el => el.remove());
                    
                    // Удаляем стили
                    const styles = document.getElementById('ultimate-modular-styles');
                    if (styles) styles.remove();
                    
                    // Уничтожаем LUM
                    if (this.LUM && typeof this.LUM.destroy === 'function') {
                        this.LUM.destroy();
                     // Пример: добавляем кнопку в интерфейс
                    Lampa.Listener.follow('app', (e) => {
                        if (e.type === 'ready') {
                            const button = document.createElement('div');
                            button.innerHTML = `
                                <div class="selector __margined __compact">
                                    <div class="selector__title">Ultimate Modular</div>
                                </div>
                            `;
                            button.style.margin = '15px';
                            button.style.cursor = 'pointer';
                            button.addEventListener('click', () => {
                                alert('Ultimate Modular Plugin is working!');
                            });
                            
                            const header = document.querySelector('.head__content');
                            if (header) header.appendChild(button);
                        }
                    });
                    
                    // Добавляем кастомные стили
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
                    
                    // ... ваш дополнительный код ...
                }
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
