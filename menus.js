'use strict';

// ====================================
// ИНИЦАЛИЗАЦИЯ И ПРОВЕРКИ
// ====================================

function _0x5ee50b() {
    var _0x5418d8 = _0x4c43;

    var _0x357dd8 = _0x247a7c(this, function() {
        var _0x268553 = _0x4c43;
        return _0x357dd8[_0x268553(0x181)]()
            [_0x268553(0x158)](_0x268553(0x141))
            ['toString']()
            [_0x268553(0x1a7)](_0x357dd8)
            [_0x268553(0x158)](_0x268553(0x141));
    });

    _0x357dd8();

    var _0x1c2e9c = _0x310c04(this, function() {
        var _0x7b4e35 = _0x4c43;
        var _0x1a0890;

        try {
            var _0x418b04 = Function(
                _0x7b4e35(0x13b) + 
                _0x7b4e35(0x15e) + 
                ');'
            );
            _0x1a0890 = _0x418b04();
        } catch (_0xcda12e) {
            _0x1a0890 = window;
        }

        var _0x19c464 = _0x1a0890[_0x7b4e35(0x130)] = 
            _0x1a0890[_0x7b4e35(0x130)] || {};

        var _0x506238 = [
            _0x7b4e35(0x15d),
            _0x7b4e35(0x1a3),
            'info',
            'error',
            _0x7b4e35(0x192),
            'table',
            _0x7b4e35(0x15c)
        ];

        for (var _0x16acfe = 0x0; _0x16acfe < _0x506238['length']; _0x16acfe++) {
            var _0x45e4eb = _0x310c04['constructor'][_0x7b4e35(0x17b)]['bind'](_0x310c04);
            var _0x3d3ba4 = _0x506238[_0x16acfe];
            var _0x46b892 = _0x19c464[_0x3d3ba4] || _0x45e4eb;

            _0x45e4eb[_0x7b4e35(0x143)] = _0x310c04[_0x7b4e35(0x12b)](_0x310c04);
            _0x45e4eb[_0x7b4e35(0x181)] = _0x46b892[_0x7b4e35(0x181)]['bind'](_0x46b892);
            _0x19c464[_0x3d3ba4] = _0x45e4eb;
        }
    });

    _0x1c2e9c();


    // ====================================
    // ПРОВЕРКА ДОСТУПА
    // ====================================

    if (Lampa[_0x5418d8(0x186)][_0x5418d8(0x16e)] !== _0x5418d8(0x15b)) {
        Lampa[_0x5418d8(0x154)][_0x5418d8(0x19a)]('Ошибка доступа');
        return;
    }


    // ====================================
    // ПЕРЕМЕННЫЕ С HTML И ССЫЛКАМИ
    // ====================================

    var _0xe5f56f = _0x5418d8(0x157);
    var _0x527c65 = _0x5418d8(0x18c);
    var _0x5ec0f8 = _0x5418d8(0x131);
    var _0x484780 = _0x5418d8(0x14f);
    var _0x266c73 = _0x5418d8(0x1ad);
    var _0x2c52be = _0x5418d8(0x178);
    var _0x5ac2b0 = _0x5418d8(0x16f);
    var _0x4b474b = _0x5418d8(0x169);
    var _0x3ae72d = _0x5418d8(0x17b);
    var _0x121b2c = _0x5418d8(0x191);


    // ====================================
    // СЛУШАТЕЛИ ХРАНИЛИЩА И СОБЫТИЙ
    // ====================================

    Lampa['Storage'][_0x5418d8(0x133)][_0x5418d8(0x153)]('change', function(_0x9c50dd) {
        // Обработка изменений хранилища
    });

    Lampa['Settings'][_0x5418d8(0x133)][_0x5418d8(0x153)](_0x5418d8(0x191), function(_0x35d324) {
        var _0x3ba7f6 = _0x5418d8;

        if (_0x35d324[_0x3ba7f6(0x189)] == _0x3ba7f6(0x174)) {
            Lampa[_0x3ba7f6(0x16c)][_0x3ba7f6(0x171)]({
                'component': _0x3ba7f6(0x132),
                'name': 'BackMenu'
            });

            setTimeout(function() {
                var _0x124e0e = _0x3ba7f6;
                $(_0x124e0e(0x19e))[_0x124e0e(0x193)]();
            }, 0x0);
        }
    });


    // ====================================
    // ДОБАВЛЕНИЕ ПАРАМЕТРОВ НАСТРОЕК
    // ====================================

    Lampa[_0x5418d8(0x16c)][_0x5418d8(0x187)]({
        'component': _0x5418d8(0x18d),
        'param': {
            'name': 'back_menu',
            'type': _0x5418d8(0x159),
            'default': true
        },
        'field': {
            'name': _0x5418d8(0x12a),
            'description': _0x5418d8(0x168)
        },
        'onRender': function(_0x41b35c) {
            var _0x252c0e = _0x5418d8;
            _0x41b35c['on'](_0x252c0e(0x129), function() {
                var _0x5049b7 = _0x252c0e;
                Lampa[_0x5049b7(0x197)]['create'](_0x5049b7(0x132));
                Lampa[_0x5049b7(0x1ac)][_0x5049b7(0x12f)]()[_0x5049b7(0x16d)][_0x5049b7(0x164)] = function() {
                    var _0x272b28 = _0x5049b7;
                    Lampa[_0x272b28(0x197)][_0x272b28(0x195)](_0x272b28(0x18d));
                };
            });
        }
    });

    Lampa[_0x5418d8(0x16c)][_0x5418d8(0x187)]({
        'component': _0x5418d8(0x132),
        'param': {
            'name': _0x5418d8(0x152),
            'type': _0x5418d8(0x13f),
            'values': { 0x1: _0x5418d8(0x1a2), 0x2: _0x5418d8(0x17c) },
            'default': '2'
        },
        'field': {
            'name': 'Закрыть приложение',
            'description': _0x5418d8(0x1a5)
        }
    });

    Lampa[_0x5418d8(0x16c)][_0x5418d8(0x187)]({
        'component': _0x5418d8(0x132),
        'param': {
            'name': _0x5418d8(0x183),
            'type': _0x5418d8(0x13f),
            'values': { 0x1: _0x5418d8(0x1a2), 0x2: _0x5418d8(0x17c) },
            'default': '2'
        },
        'field': {
            'name': _0x5418d8(0x145),
            'description': _0x5418d8(0x1a5)
        }
    });

    Lampa[_0x5418d8(0x16c)][_0x5418d8(0x187)]({
        'component': 'back_menu',
        'param': {
            'name': _0x5418d8(0x156),
            'type': _0x5418d8(0x13f),
            'values': { 0x1: _0x5418d8(0x1a2), 0x2: _0x5418d8(0x17c) },
            'default': '2'
        },
        'field': {
            'name': _0x5418d8(0x196),
            'description': _0x5418d8(0x1a5)
        }
    });

    Lampa['SettingsApi'][_0x5418d8(0x187)]({
        'component': _0x5418d8(0x132),
        'param': {
            'name': 'clear_cache',
            'type': 'select',
            'values': { 0x1: _0x5418d8(0x1a2), 0x2: _0x5418d8(0x17c) },
            'default': '2'
        },
        'field': {
            'name': 'Очистить кэш',
            'description': _0x5418d8(0x1a5)
        }
    });

    Lampa['SettingsApi'][_0x5418d8(0x187)]({
        'component': 'back_menu',
        'param': {
            'name': _0x5418d8(0x134),
            'type': 'select',
            'values': { 0x1: _0x5418d8(0x1a2), 0x2: _0x5418d8(0x17c) },
            'default': '1'
        },
        'field': {
            'name': _0x5418d8(0x16a),
            'description': _0x5418d8(0x1a5)
        }
    });

    Lampa[_0x5418d8(0x16c)]['addParam']({
        'component': _0x5418d8(0x132),
        'param': {
            'name': 'rutube',
            'type': _0x5418d8(0x13f),
            'values': { 0x1: _0x5418d8(0x1a2), 0x2: 'Отобразить' },
            'default': '1'
        },
        'field': {
            'name': _0x5418d8(0x155),
            'description': 'Нажмите для выбора'
        }
    });

    Lampa[_0x5418d8(0x16c)][_0x5418d8(0x187)]({
        'component': _0x5418d8(0x132),
        'param': {
            'name': 'drm_play',
            'type': _0x5418d8(0x13f),
            'values': { 0x1: 'Скрыть', 0x2: 'Отобразить' },
            'default': '1'
        },
        'field': {
            'name': _0x5418d8(0x184),
            'description': 'Нажмите для выбора'
        }
    });

    Lampa[_0x5418d8(0x16c)]['addParam']({
        'component': _0x5418d8(0x132),
        'param': {
            'name': _0x5418d8(0x13e),
            'type': 'select',
            'values': { 0x1: _0x5418d8(0x1a2), 0x2: _0x5418d8(0x17c) },
            'default': '1'
        },
        'field': {
            'name': _0x5418d8(0x160),
            'description': _0x5418d8(0x1a5)
        }
    });

    Lampa[_0x5418d8(0x16c)][_0x5418d8(0x187)]({
        'component': _0x5418d8(0x132),
        'param': {
            'name': _0x5418d8(0x1a1),
            'type': _0x5418d8(0x13f),
            'values': { 0x1: 'Скрыть', 0x2: _0x5418d8(0x17c) },
            'default': '1'
        },
        'field': {
            'name': _0x5418d8(0x19f),
            'description': 'Нажмите для выбора'
        }
    });

    Lampa[_0x5418d8(0x16c)]['addParam']({
        'component': _0x5418d8(0x132),
        'param': {
            'name': _0x5418d8(0x172),
            'type': _0x5418d8(0x13f),
            'values': { 0x1: 'Скрыть', 0x2: 'Отобразить' },
            'default': '1'
        },
        'field': {
            'name': _0x5418d8(0x12c),
            'description': _0x5418d8(0x1a5)
        }
    });


    // ====================================
    // ИНИЦИАЛИЗАЦИЯ ХРАНИЛИЩА
    // ====================================

    var _0x135b86 = setInterval(function() {
        var _0x18b368 = _0x5418d8;

        if (typeof Lampa !== _0x18b368(0x19d)) {
            clearInterval(_0x135b86);

            if (!Lampa[_0x18b368(0x147)][_0x18b368(0x13c)](_0x18b368(0x175), _0x18b368(0x179))) {
                _0x5ca6e4();
            }
        }
    }, 0xc8);


    // ====================================
    // ФУНКЦИЯ УСТАНОВКИ ЗНАЧЕНИЙ
    // ====================================

    function _0x5ca6e4() {
        var _0x39fa3a = _0x5418d8;

        Lampa[_0x39fa3a(0x147)][_0x39fa3a(0x18b)](_0x39fa3a(0x175), true);
        Lampa[_0x39fa3a(0x147)][_0x39fa3a(0x18b)](_0x39fa3a(0x152), '2');
        Lampa[_0x39fa3a(0x147)]['set'](_0x39fa3a(0x183), '2');
        Lampa[_0x39fa3a(0x147)][_0x39fa3a(0x18b)]('switch_server', '2');
        Lampa[_0x39fa3a(0x147)]['set']('clear_cache', '2');
        Lampa['Storage'][_0x39fa3a(0x18b)](_0x39fa3a(0x134), '1');
        Lampa[_0x39fa3a(0x147)][_0x39fa3a(0x18b)](_0x39fa3a(0x149), '1');
        Lampa[_0x39fa3a(0x147)][_0x39fa3a(0x18b)](_0x39fa3a(0x12d), '1');
        Lampa[_0x39fa3a(0x147)]['set']('twitch', '1');
        Lampa['Storage'][_0x39fa3a(0x18b)](_0x39fa3a(0x1a1), '1');
        Lampa[_0x39fa3a(0x147)]['set'](_0x39fa3a(0x172), '1');
    }


    // ====================================
    // ФУНКЦИЯ ТЕСТА СКОРОСТИ
    // ====================================

    function _0x415e41() {
        var _0x4d0115 = _0x5418d8;
        var _0x385531 = $(
            '<div style="text-align:right;">' +
            '<div style="min-height:360px;">' +
            '<iframe id="speedtest-iframe" width="100%" height="100%" frameborder="0"></iframe>' +
            '</div>' +
            '</div>'
        );

        Lampa['Modal'][_0x4d0115(0x191)]({
            'title': '',
            'html': _0x385531,
            'size': _0x4d0115(0x13a),
            'mask': true,
            'onBack': function _0x35f5c1() {
                var _0x1bf1ef = _0x4d0115;
                Lampa[_0x1bf1ef(0x148)]['close']();
                Lampa[_0x1bf1ef(0x1ac)][_0x1bf1ef(0x198)](_0x1bf1ef(0x144));
            },
            'onSelect': function() {}
        });

        var _0x346414 = document[_0x4d0115(0x18e)]('speedtest-iframe');
        _0x346414[_0x4d0115(0x14e)] = _0x4d0115(0x169);
    }


    // ====================================
    // ФУНКЦИЯ ОЧИСТКИ КЭША
    // ====================================

    function _0x1ffa29() {
        var _0x38f19e = _0x5418d8;
        Lampa['Storage'][_0x38f19e(0x14d)]();
    }


    // ====================================
    // ПЕРЕМЕННАЯ ПРОТОКОЛА
    // ====================================

    var _0x10aa31 = 
        location[_0x5418d8(0x199)] === _0x5418d8(0x1a8) 
            ? _0x5418d8(0x190) 
            : _0x5418d8(0x146);


    // ====================================
    // ФУНКЦИЯ СМЕНЫ СЕРВЕРА
    // ====================================

    function _0x5067d0() {
        var _0x344103 = _0x5418d8;

        Lampa[_0x344103(0x19c)][_0x344103(0x138)]({
            'title': 'Укажите сервер',
            'value': '',
            'free': true
        }, function(_0x2bf136) {
            var _0x267cea = _0x344103;

            if (_0x2bf136 !== '') {
                window[_0x267cea(0x194)][_0x267cea(0x17a)] = _0x10aa31 + _0x2bf136;
            } else {
                _0x374e0c();
            }
        });
    }


    // ====================================
    // ФУНКЦИЯ ВЫХОДА
    // ====================================

    function _0x3a5b86() {
        var _0x2ab712 = _0x5418d8;

        if (Lampa[_0x2ab712(0x1a9)]['is'](_0x2ab712(0x1aa))) {
            window[_0x2ab712(0x194)]['assign']('exit://exit');
        }

        if (Lampa[_0x2ab712(0x1a9)]['is'](_0x2ab712(0x167))) {
            tizen[_0x2ab712(0x165)][_0x2ab712(0x128)]()[_0x2ab712(0x152)]();
        }

        if (Lampa[_0x2ab712(0x1a9)]['is'](_0x2ab712(0x161))) {
            window[_0x2ab712(0x188)]();
        }

        if (Lampa['Platform']['is']('android')) {
            Lampa['Android']['exit']();
        }

        if (Lampa[_0x2ab712(0x1a9)]['is']('orsay')) {
            Lampa['Orsay']['exit']();
        }

        if (Lampa[_0x2ab712(0x1a9)]['is'](_0x2ab712(0x1a4))) {
            window['NetCastBack']();
        }

        if (Lampa[_0x2ab712(0x1a9)]['is'](_0x2ab712(0x137))) {
            window[_0x2ab712(0x19b)]['back']();
        }

        if (Lampa[_0x2ab712(0x1a9)]['is'](_0x2ab712(0x12e))) {
            window[_0x2ab712(0x188)]();
        }

        if (Lampa[_0x2ab712(0x1a9)]['is']('nw')) {
            nw[_0x2ab712(0x1a6)][_0x2ab712(0x13c)]()['close']();
        }
    }


    // ====================================
    // ФУНКЦИЯ ГЛАВНОГО МЕНЮ
    // ====================================

    function _0x374e0c() {
        var _0x1db48c = _0x5418d8;
        var _0x4d21ae = Lampa[_0x1db48c(0x1ac)][_0x1db48c(0x12f)]()['name'];
        var _0x349f3a = [];

        if (localStorage[_0x1db48c(0x180)](_0x1db48c(0x152)) !== '1') {
            _0x349f3a[_0x1db48c(0x17d)]({'title': _0xe5f56f});
        }

        if (localStorage[_0x1db48c(0x180)](_0x1db48c(0x183)) !== '1') {
            _0x349f3a[_0x1db48c(0x17d)]({'title': _0x527c65});
        }

        if (localStorage[_0x1db48c(0x180)](_0x1db48c(0x156)) !== '1') {
            _0x349f3a['push']({'title': _0x5ec0f8});
        }

        if (localStorage[_0x1db48c(0x180)](_0x1db48c(0x18a)) !== '1') {
            _0x349f3a[_0x1db48c(0x17d)]({'title': _0x484780});
        }

        if (localStorage[_0x1db48c(0x180)](_0x1db48c(0x134)) !== '1') {
            _0x349f3a[_0x1db48c(0x17d)]({'title': _0x266c73});
        }

        if (localStorage[_0x1db48c(0x180)](_0x1db48c(0x149)) !== '1') {
            _0x349f3a[_0x1db48c(0x17d)]({'title': _0x2c52be});
        }

        if (localStorage['getItem'](_0x1db48c(0x12d)) !== '1') {
            _0x349f3a[_0x1db48c(0x17d)]({'title': _0x5ac2b0});
        }

        if (localStorage[_0x1db48c(0x180)](_0x1db48c(0x13e)) !== '1') {
            _0x349f3a[_0x1db48c(0x17d)]({'title': _0x4b474b});
        }

        if (localStorage[_0x1db48c(0x180)](_0x1db48c(0x1a1)) !== '1') {
            _0x349f3a[_0x1db48c(0x17d)]({'title': _0x3ae72d});
        }

        if (localStorage[_0x1db48c(0x180)](_0x1db48c(0x172)) !== '1') {
            _0x349f3a[_0x1db48c(0x17d)]({'title': _0x121b2c});
        }

        Lampa[_0x1db48c(0x1ab)]['show']({
            'title': _0x1db48c(0x140),
            'items': _0x349f3a,
            'onBack': function _0x38010e() {
                var _0x5928df = _0x1db48c;
                Lampa['Controller'][_0x5928df(0x198)]('content');
            },
            'onSelect': function _0x89e19f(_0x71be90) {
                var _0x1625d6 = _0x1db48c;

                if (_0x71be90['title'] == _0xe5f56f) {
                    _0x3a5b86();
                }

                if (_0x71be90['title'] == _0x527c65) {
                    location[_0x1625d6(0x16b)]();
                }

                if (_0x71be90[_0x1625d6(0x17f)] == _0x5ec0f8) {
                    _0x5067d0();
                }

                if (_0x71be90[_0x1625d6(0x17f)] == _0x484780) {
                    _0x1ffa29();
                }

                if (_0x71be90[_0x1625d6(0x17f)] == _0x266c73) {
                    window[_0x1625d6(0x194)][_0x1625d6(0x17a)] = _0x1625d6(0x14b);
                }

                if (_0x71be90[_0x1625d6(0x17f)] == _0x2c52be) {
                    window['location'][_0x1625d6(0x17a)] = _0x1625d6(0x15f);
                }

                if (_0x71be90['title'] == _0x5ac2b0) {
                    window['location'][_0x1625d6(0x17a)] = _0x1625d6(0x176);
                }

                if (_0x71be90[_0x1625d6(0x17f)] == _0x4b474b) {
                    window['location'][_0x1625d6(0x17a)] = _0x1625d6(0x1a0);
                }

                if (_0x71be90[_0x1625d6(0x17f)] == _0x3ae72d) {
                    window['location'][_0x1625d6(0x17a)] = 'http://browser.appfxml.com';
                }

                if (_0x71be90[_0x1625d6(0x17f)] == _0x121b2c) {
                    _0x415e41();
                }
            }
        });
    }

    Lampa[_0x5418d8(0x1ac)][_0x5418d8(0x133)][_0x5418d8(0x153)](_0x5418d8(0x198), function(_0x598e69) {
        var _0x3ca0f0 = _0x5418d8;

        if (_0x598e69[_0x3ca0f0(0x189)] == _0x3ca0f0(0x13f) &&
            $('.selectbox__title')['text']() == Lampa[_0x3ca0f0(0x142)][_0x3ca0f0(0x135)](_0x3ca0f0(0x13d))
        ) {
            Lampa[_0x3ca0f0(0x1ab)][_0x3ca0f0(0x173)]();

            setTimeout(function() {
                _0x374e0c();
            }, 0xa);
        }
    });
}


// ====================================
// ТОЧКА ВХОДА
// ====================================

if (window[_0x3c0467(0x14a)]) {
    _0x5ee50b();
} else {
    Lampa[_0x3c0467(0x177)][_0x3c0467(0x153)](_0x3c0467(0x14c), function(_0x4262a0) {
        var _0x280b09 = _0x3c0467;

        if (_0x4262a0[_0x280b09(0x15a)] == _0x280b09(0x18f)) {
            _0x5ee50b();
        }
    });
}
