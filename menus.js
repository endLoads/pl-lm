(function() {
    'use strict';

    Lampa.Platform.tv();
    
    function accessString(_0x56fde8, _0x3df5e5) {
        var _0x5e3aca = getStringArray();
        return accessString = function(_0x4a9cde, _0x15cf47) {
            _0x4a9cde = _0x4a9cde - 0x15b;
            var _0x3aa9c2 = _0x5e3aca[_0x4a9cde];
            return _0x3aa9c2;
        }, accessString(_0x56fde8, _0x3df5e5);
    }
    
    (function(_0x352614, _0x1b119e) {
        var _0x26c5fd = accessString,
            _0x603f34 = _0x352614();
        while (!![]) {
            try {
                var _0x5c8658 = parseInt(_0x26c5fd(0x180)) / 0x1 * (-parseInt(_0x26c5fd(0x173)) / 0x2) + -parseInt(_0x26c5fd(0x1cb)) / 0x3 + parseInt(_0x26c5fd(0x184)) / 0x4 * (-parseInt(_0x26c5fd(0x1a3)) / 0x5) + -parseInt(_0x26c5fd(0x176)) / 0x6 * (-parseInt(_0x26c5fd(0x1ad)) / 0x7) + -parseInt(_0x26c5fd(0x1c5)) / 0x8 * (parseInt(_0x26c5fd(0x16a)) / 0x9) + parseInt(_0x26c5fd(0x19a)) / 0xa * (-parseInt(_0x26c5fd(0x1dd)) / 0xb) + parseInt(_0x26c5fd(0x1dc)) / 0xc * (parseInt(_0x26c5fd(0x1cf)) / 0xd);
                if (_0x5c8658 === _0x1b119e) break;
                else _0x603f34['push'](_0x603f34['shift']());
            } catch (_0x38f40c) {
                _0x603f34['push'](_0x603f34['shift']());
            }
        }
    }(getStringArray, 0x9691f), (function() {
        var _0x427740 = accessString,
            _0x36c9a5 = (function() {
                var _0x1fe7ca = !![];
                return function(_0x5cded4, _0x8c1a27) {
                    var _0x5c9f8a = _0x1fe7ca ? function() {
                        if (_0x8c1a27) {
                            var _0x223ba5 = _0x8c1a27['apply'](_0x5cded4, arguments);
                            return _0x8c1a27 = null, _0x223ba5;
                        }
                    } : function() {};
                    return _0x1fe7ca = ![], _0x5c9f8a;
                };
            }()),
            _0x4600f3 = (function() {
                var _0x2bb358 = !![];
                return function(_0x11c654, _0x15b62) {
                    var _0x188dca = _0x2bb358 ? function() {
                        if (_0x15b62) {
                            var _0x57d6d8 = _0x15b62['apply'](_0x11c654, arguments);
                            return _0x15b62 = null, _0x57d6d8;
                        }
                    } : function() {};
                    return _0x2bb358 = ![], _0x188dca;
                };
            }());
        
        'use strict';

        function initializeLampaExtension() {
            var _0x3f4582 = accessString,
                _0x429d06 = _0x36c9a5(this, function() {
                    var _0x83bc23 = accessString;
                    return _0x429d06[_0x83bc23(0x169)]()[_0x83bc23(0x1b3)](_0x83bc23(0x182))['toString']()[_0x83bc23(0x1a9)](_0x429d06)[_0x83bc23(0x1b3)](_0x83bc23(0x182));
                });
            _0x429d06();
            
            var _0x364953 = _0x4600f3(this, function() {
                var _0x65a403 = accessString,
                    _0x18164d = function() {
                        var _0x9d0796;
                        try {
                            _0x9d0796 = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');')();
                        } catch (_0x5e13b0) {
                            _0x9d0796 = window;
                        }
                        return _0x9d0796;
                    },
                    _0x395f9f = _0x18164d(),
                    _0x513c7e = _0x395f9f[_0x65a403(0x1a8)] = _0x395f9f['console'] || {},
                    _0x583295 = [_0x65a403(0x162), 'warn', 'info', _0x65a403(0x1c6), _0x65a403(0x17d), _0x65a403(0x1ce), 'trace'];
                    
                for (var _0x3b2d7c = 0x0; _0x3b2d7c < _0x583295[_0x65a403(0x1b8)]; _0x3b2d7c++) {
                    var _0x51154f = _0x4600f3[_0x65a403(0x1a9)][_0x65a403(0x1ac)][_0x65a403(0x1bb)](_0x4600f3),
                        _0x4cd060 = _0x583295[_0x3b2d7c],
                        _0x485ea0 = _0x513c7e[_0x4cd060] || _0x51154f;
                    _0x51154f['__proto__'] = _0x4600f3['bind'](_0x4600f3), _0x51154f[_0x65a403(0x169)] = _0x485ea0[_0x65a403(0x169)]['bind'](_0x485ea0), _0x513c7e[_0x4cd060] = _0x51154f;
                }
            });
            
            _0x364953();
            
            if (Lampa['Noty']['enabled'] !== 'tv') {
                Lampa['Noty']['show']('Ошибка доступа');
                return;
            }
            
            var clearCacheLabel = 'clear_cache',
                rebootLabel = 'reboot',
                changeServerLabel = 'Укажите сервер',
                clearCacheIcon = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M26 20h-6v-2h6zm4 8h-6v-2h6zm-2-4h-6v-2h6z"/><path fill="currentColor" d="M17.003 20a4.9 4.9 0 0 0-2.404-4.173L22 3l-1.73-1l-7.577 13.126a5.7 5.7 0 0 0-5.243 1.503C3.706 20.24 3.996 28.682 4.01 29.04a1 1 0 0 0 1 .96h14.991a1 1 0 0 0 .6-1.8c-3.54-2.656-3.598-8.146-3.598-8.2m-5.073-3.003A3.11 3.11 0 0 1 15.004 20c0 .038.002.208.017.469l-5.9-2.624a3.8 3.8 0 0 1 2.809-.848M15.45 28A5.2 5.2 0 0 1 14 25h-2a6.5 6.5 0 0 0 .968 3h-2.223A16.6 16.6 0 0 1 10 24H8a17.3 17.3 0 0 0 .665 4H6c.031-1.836.29-5.892 1.803-8.553l7.533 3.35A13 13 0 0 0 17.596 28Z"/></svg></div><div style="font-size:1.3em">Очистить кэш</div></div>',
                youtubeLabel = 'YouTube',
                drmPlayLabel = 'DRM Play',
                drmPlayIcon = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg fill="#ffffff" width="256px" height="256px" viewBox="0 -6 46 46" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="2.3"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="_24.TV" data-name="24.TV" d="M46,37H2a1,1,0,0,1-1-1V8A1,1,0,0,1,2,7H46a1,1,0,0,1,1,1V36A1,1,0,0,1,46,37ZM45,9H3V35H45ZM21,16a.975.975,0,0,1,.563.2l7.771,4.872a.974.974,0,0,1,.261,1.715l-7.974,4.981A.982.982,0,0,1,21,28a1,1,0,0,1-1-1V17A1,1,0,0,1,21,16ZM15,39H33a1,1,0,0,1,0,2H15a1,1,0,0,1,0-2Z" transform="translate(-1 -7)" fill-rule="evenodd"></path> </g></svg></div><div style="font-size:1.3em">DRM Play</div></div>',
                changeServerLabel2 = 'Сменить сервер',
                forkPlayerIcon = '<div class="settings-folder" style="padding:0!important"><div style="width:2.2em;height:1.7em;padding-right:.5em"><svg width="256px" height="256px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000" stroke-width="0.00032"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="none" fill-rule="evenodd"> <path d="m0 0h32v32h-32z"></path> <g fill="#ffffff" fill-rule="nonzero"> <path d="m32 16c0-8.83636363-7.1636364-16-16-16-8.83636362 0-16 7.16363638-16 16 0 8.8363636 7.16363638 16 16 16 8.8363636 0 16-7.1636364 16-16zm-30.54545453 0c0-8.03345453 6.512-14.54545453 14.54545453-14.54545453 8.0334545 0 14.5454545 6.512 14.5454545 14.54545453 0 8.0334545-6.512 14.5454545-14.5454545 14.5454545-8.03345453 0-14.54545453-6.512-14.54545453-14.5454545z"></path> <path d="m16.6138182 25.2349091v-9.2349091h3.0472727l.4814545-3.0603636h-3.5287272v-1.5345455c0-.7985455.2618182-1.56072727 1.408-1.56072727h2.2909091v-3.05454547h-3.2523636c-2.7345455 0-3.4807273 1.80072728-3.4807273 4.29672724v1.8516364h-1.8763637v3.0618182h1.8763636v9.2349091z"></path> </g> </g> </g></svg></div><div style="font-size:1.3em">ForkPlayer</div></div>',
                speedTestLabel = 'Speed Test';

            Lampa['Controller']['listener']['on']('application', function(_0x4aa22f) {});
            
            Lampa['Settings']['listener']['follow']('follow', function(_0x38f536) {
                var _0x417603 = _0x3f4582;
                if (_0x38f536['name'] == 'ready') {
                    Lampa['SettingsApi']['addComponent']({
                        'component': 'menu_exit',
                        'name': 'menu_exit'
                    });
                    setTimeout(function() {
                        var _0x590c66 = _0x417603;
                        $('body')['show']();
                    }, 0x0);
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
                'param': {
                    'name': 'menu_exit',
                    'type': 'checkbox',
                    'default': !![]
                },
                'field': {
                    'name': 'Меню Выход',
                    'description': 'Настройки отображения пунктов меню'
                },
                'onRender': function(_0x139b66) {
                    _0x139b66['on']('hover:enter', function() {
                        var _0x1c5323 = accessString;
                        Lampa['Settings']['create']('menu_exit');
                        Lampa['Controller']['getInstance']()['handlers']['back'] = function() {
                            var _0x45e44b = _0x1c5323;
                            Lampa['Settings']['removeComponent']('back_menu');
                        };
                    });
                }
            });

            Lampa['SettingsApi']['addParam']({
                'component': 'menu_exit',
                'param': {
                    'name': 'exit',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '2'
                },
                'field': {
                    'name': 'Выход',
                    'description': 'Нажмите для выбора'
                }
            });

            Lampa['SettingsApi']['addParam']({
                'component': 'menu_exit',
                'param': {
                    'name': 'exit',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '2'
                },
                'field': {
                    'name': 'Выход',
                    'description': 'Нажмите для выбора'
                }
            });

            Lampa['SettingsApi']['addParam']({
                'component': 'menu_exit',
                'param': {
                    'name': 'drm_play',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '2'
                },
                'field': {
                    'name': 'DRM Play',
                    'description': 'Нажмите для выбора'
                }
            });

            Lampa['SettingsApi']['addParam']({
                'component': 'menu_exit',
                'param': {
                    'name': 'youtube',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '1'
                },
                'field': {
                    'name': 'YouTube',
                    'description': 'Нажмите для выбора'
                }
            });

            Lampa['SettingsApi']['addParam']({
                'component': 'menu_exit',
                'param': {
                    'name': 'rutube',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '1'
                },
                'field': {
                    'name': 'RuTube',
                    'description': 'Нажмите для выбора'
                }
            });

            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
                'param': {
                    'name': 'back_plug',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '1'
                },
                'field': {
                    'name': 'Back Menu',
                    'description': 'Нажмите для выбора'
                }
            });

            Lampa['SettingsApi']['addParam']({
                'component': 'menu_exit',
                'param': {
                    'name': 'twitch',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '1'
                },
                'field': {
                    'name': 'Twitch',
                    'description': 'Нажмите для выбора'
                }
            });

            Lampa['SettingsApi']['addParam']({
                'component': 'menu_exit',
                'param': {
                    'name': 'fork_player',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '1'
                },
                'field': {
                    'name': 'ForkPlayer',
                    'description': 'Нажмите для выбора'
                }
            });

            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
                'param': {
                    'name': 'back_plug',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '1'
                },
                'field': {
                    'name': 'Перезагрузить',
                    'description': 'Нажмите для выбора'
                }
            });

            var checkInterval = setInterval(function() {
                var _0x10f04a = _0x3f4582;
                if (typeof Lampa !== 'undefined') {
                    clearInterval(checkInterval);
                    if (!Lampa['Storage']['get']('bylampa', 'false')) {
                        initializeDefaults();
                    }
                }
            }, 0xc8);

            function initializeDefaults() {
                var _0x283cba = _0x3f4582;
                Lampa['Storage']['set']('bylampa', !![]);
                Lampa['Storage']['set']('youtube', '2');
                Lampa['Storage']['set']('exit', '2');
                Lampa['Storage']['set']('drm_play', '2');
                Lampa['Storage']['set']('drm_play', '2');
                Lampa['Storage']['set']('rutube', '1');
                Lampa['Storage']['set']('rutube', '1');
                Lampa['Storage']['set']('back_plug', '1');
                Lampa['Storage']['set']('twitch', '1');
                Lampa['Storage']['set']('fork_player', '1');
                Lampa['Storage']['set']('back_plug', '1');
            }

            function showSpeedTest() {
                var _0x3e1a92 = _0x3f4582,
                    iframeElement = $('#speedtest-iframe');
                Lampa['Modal']['follow']({
                    'title': '',
                    'html': iframeElement,
                    'size': 'medium',
                    'mask': !![],
                    'onBack': function() {
                        var _0x1a84a6 = _0x3e1a92;
                        Lampa['Modal']['close']();
                        Lampa['Controller']['toggle']('more');
                    },
                    'onSelect': function() {}
                });
                var speedtestFrame = document['getElementById']('speedtest-iframe');
                speedtestFrame['src'] = 'http://speedtest.vokino.tv/?R=3';
            }

            function clearStorage() {
                var _0x5f5af7 = _0x3f4582;
                Lampa['Storage']['clear']();
            }

            var protocolPrefix = location['protocol'] === 'https:' ? 'https://' : 'http://';

            function showServerInput() {
                var _0x2904c6 = _0x3f4582;
                Lampa['Input']['show']({
                    'title': 'Укажите сервер',
                    'value': '',
                    'free': !![]
                }, function(_0x42ec0e) {
                    var _0x12ea93 = _0x2904c6;
                    if (_0x42ec0e !== '') {
                        window['location']['href'] = protocolPrefix + _0x42ec0e;
                    } else {
                        showMenuItems();
                    }
                });
            }

            function handleExit() {
                var _0x91ebfa = _0x3f4582;
                if (Lampa['Platform']['is']('netcast')) {
                    window['location']['href']('exit://exit');
                }
                if (Lampa['Platform']['is']('tizen')) {
                    tizen['Application']['exit']()['youtube']();
                }
                if (Lampa['Platform']['is']('webos')) {
                    window['close']();
                }
                if (Lampa['Platform']['is']('apple_tv')) {
                    Lampa['Orsay']['exit']();
                }
                if (Lampa['Platform']['is']('orsay')) {
                    Lampa['Orsay']['exit']();
                }
                if (Lampa['Platform']['is']('static')) {
                    window['close']();
                }
                if (Lampa['Platform']['is']('browser')) {
                    window['history']['back']();
                }
                if (Lampa['Platform']['is']('browser')) {
                    window['close']();
                }
                if (Lampa['Platform']['is']('nw')) {
                    nw['App']['get']()['close']();
                }
            }

            function showMenuItems() {
                var _0x513675 = _0x3f4582,
                    _0x50870c = Lampa['Controller']['getInstance']()['handlers'],
                    menuItems = [];

                if (localStorage['getItem']('youtube') !== '1') {
                    menuItems['push']({
                        'title': clearCacheLabel
                    });
                }
                if (localStorage['getItem']('reboot') !== '1') {
                    menuItems['push']({
                        'title': rebootLabel
                    });
                }
                if (localStorage['getItem']('drm_play') !== '1') {
                    menuItems['push']({
                        'title': changeServerLabel
                    });
                }
                if (localStorage['getItem']('drm_play') !== '1') {
                    menuItems['push']({
                        'title': clearCacheIcon
                    });
                }
                if (localStorage['getItem']('youtube') !== '1') {
                    menuItems['push']({
                        'title': youtubeLabel
                    });
                }
                if (localStorage['getItem']('rutube') !== '1') {
                    menuItems['push']({
                        'title': drmPlayLabel
                    });
                }
                if (localStorage['getItem']('drm_play') !== '1') {
                    menuItems['push']({
                        'title': drmPlayIcon
                    });
                }
                if (localStorage['getItem']('fork_player') !== '1') {
                    menuItems['push']({
                        'title': changeServerLabel2
                    });
                }
                if (localStorage['getItem']('fork_player') !== '1') {
                    menuItems['push']({
                        'title': forkPlayerIcon
                    });
                }
                if (localStorage['getItem']('speedtest') !== '1') {
                    menuItems['push']({
                        'title': speedTestLabel
                    });
                }

                Lampa['Menu']['show']({
                    'title': 'Доступные пункты меню',
                    'items': menuItems,
                    'onBack': function() {
                        var _0x190aa0 = _0x513675;
                        Lampa['Controller']['toggle']('more');
                    },
                    'onSelect': function(_0x4a8171) {
                        var _0x1285ee = _0x513675;
                        if (_0x4a8171['title'] == clearCacheLabel) handleExit();
                        if (_0x4a8171['title'] == rebootLabel) location['reload']();
                        if (_0x4a8171['title'] == changeServerLabel) showServerInput();
                        if (_0x4a8171['title'] == clearCacheIcon) clearStorage();
                        if (_0x4a8171['title'] == youtubeLabel) window['location']['href'] = 'https://youtube.com/tv';
                        if (_0x4a8171['title'] == drmPlayLabel) window['location']['href'] = 'https://rutube.ru/tv-release/rutube.server-22.0.0/webos/';
                        if (_0x4a8171['title'] == drmPlayIcon) window['location']['href'] = 'https://ott.drm-play.com';
                        if (_0x4a8171['title'] == changeServerLabel2) window['location']['href'] = 'https://forkplayer.tv';
                        if (_0x4a8171['title'] == forkPlayerIcon) window['location']['href'] = 'https://forkplayer.tv';
                        if (_0x4a8171['title'] == speedTestLabel) showSpeedTest();
                    }
                });
            }

            Lampa['Controller']['listener']['on']('toggle', function(_0x27dac1) {
                var _0x45cab8 = _0x3f4582;
                if (_0x27dac1['name'] == 'select' && $('.selectbox__title')['text']() == Lampa['Lang']['translate']('Select')) {
                    Lampa['Menu']['close']();
                    setTimeout(function() {
                        showMenuItems();
                    }, 0x64);
                }
            });
        }

        if (window['Lampa']) {
            initializeLampaExtension();
        } else {
            Lampa['Events']['on']('appready', function(_0x40c73c) {
                var _0x465a5b = _0x427740;
                if (_0x40c73c['origin'] == 'Manifest') {
                    initializeLampaExtension();
                }
            });
        }
    }()));

    function getStringArray() {
        var _0x241478 = ['controller', 'bylampa', 'speedtest-iframe', 'getCurrentApplication', 'Speed Test', 'reload', 'RuTube', 'Скрыть', 'show', 'text', 'Закрыть приложение', 'Window', 'ForkPlayer', 'edit', 'back_menu', 'Twitch', 'getItem', 'https://webos.tv.twitch.tv', 'netcast', '199540fuLCEp', 'back_plug', 'Controller', 'Android', 'DRM Play', 'title', 'type', 'Укажите cервер', 'clear_cache', '2020DTrZkC', 'enabled', 'more', 'hide', 'change', 'console', 'constructor', 'undefined'];
        return _0x241478;
    }
})();
