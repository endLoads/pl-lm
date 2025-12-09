(function () {
    'use strict';
    
    // --- НАСТРОЙКИ ---
    var REPO_ROOT = 'https://raw.githubusercontent.com/endLoads/pl-lm/refs/heads/main/';
    var CORE_FILE = 'cubox.js'; 
    // -----------------

    var timestamp = new Date().getTime();
    var url = REPO_ROOT + CORE_FILE + '?v=' + timestamp;

    console.log('[Loader] Loading script:', url);

    // Используем классический метод вставки скрипта
    // Он НЕ подвержен CORS блокировкам (Status: 0)
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = true;
    
    script.onload = function() {
        console.log('[Loader] Core loaded successfully');
    };
    
    script.onerror = function() {
        console.error('[Loader] Failed to load script (Network error)');
        // В случае ошибки пробуем запасной вариант через прокси
        loadViaProxy();
    };

    document.body.appendChild(script);

    // Запасной план: загрузка через CORS-прокси (если GitHub заблокирован провайдером)
    function loadViaProxy() {
        console.log('[Loader] Trying proxy...');
        var proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
        var proxyScript = document.createElement('script');
        proxyScript.src = proxyUrl;
        document.body.appendChild(proxyScript);
    }

})();
