    // Меню настроек (V4 - Native Lampa Scroll Fix)
    function addMenu() {
        var field = $(`
            <div class="settings-folder selector" data-component="cubox_core">
                <div class="settings-folder__icon">
                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                </div>
                <div class="settings-folder__name">Cubox</div>
                <div class="settings-folder__descr">Store</div>
            </div>
        `);
        
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'main') {
                // Ждем пока Лампа построит DOM
                var timer = setInterval(function() {
                    // Ищем слой, который РЕАЛЬНО скроллится (scroll__content)
                    var scrollLayer = $('.settings__content .scroll__content');
                    
                    if (scrollLayer.length) {
                        clearInterval(timer);
                        
                        // Находим первый элемент внутри скролла
                        var first = scrollLayer.find('.settings-folder').first();
                        
                        // Вставляем ПЕРЕД ним. Теперь наш пункт внутри скролла.
                        if (first.length) {
                            first.before(field);
                        } else {
                            scrollLayer.append(field);
                        }
                        
                        // Пересчитываем фокус, чтобы навигация пультом не сломалась
                        Lampa.Controller.enable('content');
                        
                        field.on('hover:enter', function () {
                            openStore();
                        });
                    }
                }, 50);
            }
        });
    }
