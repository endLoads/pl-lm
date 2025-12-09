(function () {
    'use strict';

    // Ссылка на ваш основной плагин
    // ВАЖНО: Укажите прямую ссылку на raw-файл или GitHub Pages
    var mainPluginUrl = 'https://endloads.github.io/pl-lm/cub_off.js';

    // Генерируем уникальный хвост (текущее время в миллисекундах)
    var timestamp = new Date().getTime();
    
    // Собираем ссылку с анти-кэшем: plugin.js?v=1715234567890
    var noCacheUrl = mainPluginUrl + '?v=' + timestamp;

    console.log('[Loader] Загружаю плагин без кэша:', noCacheUrl);

    // Подключаем скрипт к странице
    var script = document.createElement('script');
    script.src = noCacheUrl;
    script.type = 'text/javascript';
    script.async = true; // Загружаем асинхронно
    
    // Обработка ошибок (если GitHub лежит)
    script.onerror = function() {
        console.error('[Loader] Ошибка загрузки плагина!');
        if (typeof Lampa !== 'undefined' && Lampa.Noty) {
            Lampa.Noty.show('Ошибка обновления плагина CUB OFF');
        }
    };

    document.head.appendChild(script);

})();
