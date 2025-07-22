(function(Plugin) {
    // Регистрация плагина
    Plugin.register('ultimate_modular', {
        title: 'Lampa Ultimate Modular',
        version: '2.0',
        author: 'bywolf88',
        icon: 'https://[your-username].github.io/lampa-ultimate-modular/icon.png',
        description: 'Расширенная кастомизация интерфейса и функционала'
    });

    // Конфигурация плагина
    const LUM = {
        settings: {
            theme: 'dark_teal',
            cardSize: 120,
            animations: true,
            activeModules: ['cards', 'ratings', 'vpn']
        },
        
        // Инициализация
        init: function() {
            this.applyTheme();
            this.loadCSS();
            this.loadModules();
            this.addMenu();
            console.log('Ultimate Modular initialized');
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
                            </div>
                        </div>
                    `,
                    mounted() {
                        this.renderComponents();
                    },
                    renderComponents() {
                        this.html.find('[data-component="themes"]').html(this.renderThemes());
                        this.html.find('[data-component="modules"]').html(this.renderModules());
                    },
                    renderThemes() {
                        return `
                            <div class="lum-theme-selector">
                                <div class="lum-title">Выбор темы</div>
                                <div class="lum-themes-grid">
                                    <div class="lum-theme-option" data-theme="dark_teal">
                                        <div class="lum-theme-name">Бирюзовая</div>
                                    </div>
                                    <div class="lum-theme-option" data-theme="alex_dark">
                                        <div class="lum-theme-name">Alex Dark</div>
                                    </div>
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
                                </div>
                            </div>
                        `;
                    }
                }
            });
        },
        
        // Применение темы
        applyTheme: function() {
            const themes = {
                dark_teal: {
                    '--primary': '#00c8c8',
                    '--secondary': '#007a7a',
                    '--accent': '#ff3c5a',
                    '--dark': '#0f1a1f',
                    '--card-bg': '#1a2a2f',
                    '--text': '#e0f0f0'
                },
                alex_dark: {
                    '--primary': '#ff3c5a',
                    '--secondary': '#ff6b8b',
                    '--accent': '#00c8c8',
                    '--dark': '#1a0005',
                    '--card-bg': '#2a0010',
                    '--text': '#ffe6eb'
                }
            };
            
            const theme = themes[this.settings.theme] || themes.dark_teal;
            Object.entries(theme).forEach(([key, value]) => {
                document.documentElement.style.setProperty(key, value);
            });
        }
    };

    // Инициализация при запуске Lampa
    Lampa.Listener.follow('app', (e) => {
        if (e.type === 'ready') {
            LUM.init();
        }
    });

})(window.Plugin = window.Plugin || {});
