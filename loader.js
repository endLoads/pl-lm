(function () {
    'use strict';
    
    // --- НАСТРОЙКИ ---
    var GITHUB_USER = 'endLoads';
    var GITHUB_REPO = 'pl-lm';
    var BRANCH = 'main';
    var CORE_FILE = 'cubox.js'; 
    // -----------------

    // Используем jsDelivr CDN - он отдает правильный MIME-type (application/javascript)
    // Формат: https://cdn.jsdelivr.net/gh/USER/REPO@BRANCH/FILE
    var cdnUrl = 'https://cdn.jsdelivr.net/gh/' + GITHUB_USER + '/' + GITHUB_REPO + '@' + BRANCH + '/' + CORE_FILE;
    
    // Добавляем timestamp для сброса кэша CDN (jsDelivr кэширует жестко)
    var timestamp = new Date().getTime();
    var url = cdnUrl + '?t=' + timestamp;

    console.log('[Loader] Loading via CDN:', url);

    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = true;
    
    script.onload = function() {
        console.log('[Loader] Core loaded successfully');
    };
    
    script.onerror = function() {
        console.error('[Loader] Failed to load from CDN, trying Raw fallback...');
        loadFallback();
    };

    document.body.appendChild(script);

    // Запасной план: Raw GitHub (если CDN упал)
    function loadFallback() {
        var rawUrl = 'https://raw.githubusercontent.com/' + GITHUB_USER + '/' + GITHUB_REPO + '/' + BRANCH + '/' + CORE_FILE + '?v=' + timestamp;
        var fallbackScript = document.createElement('script');
        fallbackScript.src = rawUrl;
        document.body.appendChild(fallbackScript);
    }

})();
