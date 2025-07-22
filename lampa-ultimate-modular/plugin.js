(function () {
    'use strict';

    // --- НАСТРОЙКИ ПЛАГИНА ---
    const PLUGIN_NAME = 'Lampa Ultimate Modular';
    const PLUGIN_VERSION = '1.0.6'; // Обновили версию для отслеживания
    const THEMES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/themes.js';
    const STYLES_URL = 'https://endloads.github.io/pl-lm/lampa-ultimate-modular/assets/styles.css';

    // --- УТИЛИТЫ ДЛЯ БЕЗОПАСНОЙ ЗАГРУЗКИ ---

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Не удалось загрузить скрипт: ${url}`));
            document.head.appendChild(script);
        });
    }

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

    function initializePlugin() {
        console.log(`${PLUGIN_NAME} v${PLUGIN_VERSION}: Инициализация начата.`);

        window.lampa_ultimate_modular = true;

        // ----- ИСПРАВЛЕНИЕ: Полный объект компонента без плейсхолдеров -----
        Lampa.Component.add('lampa_ultimate_modular', {
            name: PLUGIN_NAME,
            version: PLUGIN_VERSION,
            props: {},
            templates: {},
            data: {},
            methods: {},
            onRender: function() {
                console.log(`${PLUGIN_NAME}: Компонент отрисован.`);
            },
            onCreate: function() {
                console.log(`${PLUGIN_NAME}: Компонент создан.`);
            },
            onDestroy: function() {
                console.log(`${PLUGIN_NAME
