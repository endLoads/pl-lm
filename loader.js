(function () {
    'use strict';
    
    // --- НАСТРОЙКИ ---
    var REPO_ROOT = 'https://raw.githubusercontent.com/endLoads/pl-lm/refs/heads/main/';
    var CORE_FILE = 'cubox.js'; 
    // -----------------

    var timestamp = new Date().getTime();
    var url = REPO_ROOT + CORE_FILE + '?v=' + timestamp;

    console.log('[Loader] Fetching core:', url);

    // Агрессивная загрузка ядра
    var network = new XMLHttpRequest();
    network.open('GET', url, true);
    network.setRequestHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    network.setRequestHeader('Pragma', 'no-cache');
    network.setRequestHeader('Expires', '0');
    
    network.onreadystatechange = function () {
        if (network.readyState === 4) {
            if (network.status === 200) {
                try {
                    // Создаем и запускаем ядро
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.innerHTML = network.responseText;
                    document.body.appendChild(script);
                    console.log('[Loader] Core started successfully');
                } catch (e) {
                    console.error('[Loader] Core execution error:', e);
                }
            } else {
                console.error('[Loader] Failed to load core. Status:', network.status);
            }
        }
    };
    network.send();

})();
