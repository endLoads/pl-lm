(function() {
    'use strict';

    Lampa.Platform.tv();
    
    function initializeBackMenu() {
        var antiDebugWrapper1 = (function() {
            var _0x1fe7ca = true;
            return function(_0x5cded4, _0x8c1a27) {
                var _0x5c9f8a = _0x1fe7ca ? function() {
                    if (_0x8c1a27) {
                        var _0x223ba5 = _0x8c1a27['apply'](_0x5cded4, arguments);
                        return _0x8c1a27 = null, _0x223ba5;
                    }
                } : function() {};
                return _0x1fe7ca = ![], _0x5c9f8a;
            };
        }());
        
        var antiDebugWrapper2 = (function() {
            var _0x2bb358 = true;
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

        function setupProtection() {
            var debugCheck = antiDebugWrapper1(this, function() {
                return debugCheck['toString']()['search']('(((.+)+)+)+$')['toString']()['constructor'](debugCheck)['search']('(((.+)+)+)+$');
            });
            debugCheck();
            
            var consoleProtection = antiDebugWrapper2(this, function() {
                var getGlobalObj = function() {
                    var globalObj;
                    try {
                        globalObj = Function('return\x20(function()\x20' + '{}.constructor(\x22return\x20this\x22)(\x20)' + ');')();
                    } catch (_0x5e13b0) {
                        globalObj = window;
                    }
                    return globalObj;
                };
                
                var globalReference = getGlobalObj();
                var consoleObj = globalReference['console'] = globalReference['console'] || {};
                var methodsList = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
                
                for (var methodIndex = 0x0; methodIndex < methodsList['length']; methodIndex++) {
                    var consoleWrapper = antiDebugWrapper2['constructor']['prototype']['bind'](antiDebugWrapper2);
                    var methodName = methodsList[methodIndex];
                    var originalMethod = consoleObj[methodName] || consoleWrapper;
                    consoleWrapper['__proto__'] = antiDebugWrapper2['bind'](antiDebugWrapper2);
                    consoleWrapper['toString'] = originalMethod['toString']['bind'](originalMethod);
                    consoleObj[methodName] = consoleWrapper;
                }
            });
            consoleProtection();
            
            if (Lampa['Manifest']['origin'] !== 'bylampa') {
                Lampa['Noty']['show']('Ошибка доступа');
                return;
            }
            
            var exitMenuHTML = '<div\x20class=\x22settings-folder\x22\x20style=\x22padding:0!important\x22><div\x20style=\x22width:2.2em;height:1.7em;padding-right:.5em\x22><svg\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22><path\x20fill=\x22currentColor\x22\x20d=\x22M10.45\x2015.5q.625.625\x201.575.588T13.4\x2015.4L19\x207l-8.4\x205.6q-.65.45-.712\x201.362t.562\x201.538M5.1\x2020q-.55\x200-1.012-.238t-.738-.712q-.65-1.175-1-2.437T2\x2014q0-2.075.788-3.9t2.137-3.175T8.1\x204.788T12\x204q2.05\x200\x203.85.775T19\x206.888t2.15\x203.125t.825\x203.837q.025\x201.375-.312\x202.688t-1.038\x202.512q-.275.475-.737.713T18.874\x2020z\x22/></svg></div><div\x20style=\x22font-size:1.3em\x22>Закрыть\x20приложение</div></div>';
            var rebootMenuHTML = '<div\x20class=\x22settings-folder\x22\x20style=\x22padding:0!important\x22><div\x20style=\x22width:2.2em;height:1.7em;padding-right:.5em\x22><svg\x20viewBox=\x220\x200\x2022\x2022\x22\x20xmlns:dc=\x22http://purl.org/dc/elements/1.1/\x22\x20xmlns:cc=\x22http://creativecommons.org/ns#\x22\x20xmlns:rdf=\x22http://www.w3.org/1999/02/22-rdf-syntax-ns#\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20id=\x22svg4183\x22\x20version=\x221.1\x22\x20fill=\x22currentColor\x22><g\x20id=\x22SVGRepo_bgCarrier\x22\x20stroke-width=\x220\x22></g><g\x20id=\x22SVGRepo_tracerCarrier\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22></g><g\x20id=\x22SVGRepo_iconCarrier\x22>\x20<metadata\x20id=\x22metadata4188\x22>\x20<rdf:rdf>\x20<cc:work>\x20<dc:format>image/svg+xml</dc:format>\x20<dc:type\x20rdf:resource=\x22http://purl.org/dc/dcmitype/StillImage\x22></dc:type>\x20<dc:title></dc:title>\x20<dc:date>2021</dc:date>\x20<dc:creator>\x20<cc:agent>\x20<dc:title>Timothée\x20Giet</dc:title>\x20</cc:agent>\x20</dc:creator>\x20<cc:license\x20rdf:resource=\x22http://creativecommons.org/licenses/by-sa/4.0/\x22></cc:license>\x20</cc:work>\x20<cc:license\x20rdf:about=\x22http://creativecommons.org/licenses/by-sa/4.0/\x22>\x20<cc:permits\x20rdf:resource=\x22http://creativecommons.org/ns#Reproduction\x22></cc:permits>\x20<cc:permits\x20rdf:resource=\x22http://creativecommons.org/ns#Distribution\x22></cc:permits>\x20<cc:requires\x20rdf:resource=\x22http://creativecommons.org/ns#Notice\x22></cc:requires>\x20<cc:requires\x20rdf:resource=\x22http://creativecommons.org/ns#Attribution\x22></cc:requires>\x20<cc:permits\x20rdf:resource=\x22http://creativecommons.org/ns#DerivativeWorks\x22></cc:permits>\x20<cc:requires\x20rdf:resource=\x22http://creativecommons.org/ns#ShareAlike\x22></cc:requires>\x20</cc:license>\x20</rdf:rdf>\x20</metadata>\x20<g\x20id=\x22layer1\x22\x20transform=\x22rotate(-90\x20-504.181\x20526.181)\x22>\x20<path\x20style=\x22opacity:1;vector-effect:none;fill:currentColor;fill-opacity:1;stroke:none;stroke-width:4;stroke-linecap:square;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:3.20000005;stroke-opacity:.55063291\x22\x20d=\x22M11\x202a9\x209\x200\x200\x200-4.676\x201.324l1.461\x201.461A7\x207\x200\x200\x201\x2011\x204a7\x207\x200\x200\x201\x207\x207\x207\x207\x200\x200\x201-.787\x203.213l1.465\x201.465A9\x209\x200\x200\x200\x2020\x2011a9\x209\x200\x200\x200-9-9zM3.322\x206.322A9\x209\x200\x200\x200\x202\x2011a9\x209\x200\x200\x200\x209\x209\x209\x209\x200\x200\x200\x204.676-1.324l-1.461-1.461A7\x207\x200\x200\x201\x2011\x2018a7\x207\x200\x200\x201-7-7\x207\x207\x200\x200\x201\x20.787-3.213z\x22\x20transform=\x22translate(0\x201030.362)\x22\x20id=\x22path840\x22></path>\x20<path\x20style=\x22fill:currentColor;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1\x22\x20d=\x22m7\x201034.362\x203\x203\x201-1-3-3z\x22\x20id=\x22path850\x22></path>\x20<path\x20style=\x22fill:currentColor;fill-opacity:1;stroke:none;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1\x22\x20d=\x22m11\x201046.362\x203\x203\x201-1-3-3z\x22\x20id=\x22path850-3\x22></path>\x20</g>\x20</g></svg></div><div\x20style=\x22font-size:1.3em\x22>Перезагрузить</div></div>';
            var switchServerHTML = '<div\x20class=\x22settings-folder\x22\x20style=\x22padding:0!important\x22><div\x20style=\x22width:2.2em;height:1.7em;padding-right:.5em\x22><svg\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20width=\x2232\x22\x20height=\x2232\x22\x20viewBox=\x220\x200\x2032\x2032\x22><path\x20fill=\x22currentColor\x22\x20d=\x22M26\x2020h-6v-2h6zm4\x208h-6v-2h6zm-2-4h-6v-2h6z\x22/><path\x20fill=\x22currentColor\x22\x20d=\x22M17.003\x2020a4.9\x204.9\x200\x200\x200-2.404-4.173L22\x203l-1.73-1l-7.577\x2013.126a5.7\x205.7\x200\x200\x200-5.243\x201.503C3.706\x2020.24\x203.996\x2028.682\x204.01\x2029.04a1\x201\x200\x200\x200\x201\x20.96h14.991a1\x201\x200\x200\x200\x20.6-1.8c-3.54-2.656-3.598-8.146-3.598-8.2m-5.073-3.003A3.11\x203.11\x200\x200\x201\x2015.004\x2020c0\x20.038.002.208.017.469l-5.9-2.624a3.8\x203.8\x200\x200\x201\x202.809-.848M15.45\x2028A5.2\x205.2\x200\x200\x201\x2014\x2025h-2a6.5\x206.5\x200\x200\x200\x20.968\x203h-2.223A16.6\x2016.6\x200\x200\x201\x2010\x2024H8a17.3\x2017.3\x200\x200\x200\x20.665\x204H6c.031-1.836.29-5.892\x201.803-8.553l7.533\x203.35A13\x2013\x200\x200\x200\x2017.596\x2028Z\x22/></svg></div><div\x20style=\x22font-size:1.3em\x22>Очистить\x20кэш</div></div>';
            var youtubeHTML = '<div\x20class=\x22settings-folder\x22\x20style=\x22padding:0!important\x22><div\x20style=\x22width:2.2em;height:1.7em;padding-right:.5em\x22><svg\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20width=\x2220\x22\x20height=\x2220\x22\x20viewBox=\x220\x200\x2020\x2020\x22><path\x20fill=\x22currentColor\x22\x20d=\x22M10\x202.3C.172\x202.3\x200\x203.174\x200\x2010s.172\x207.7\x2010\x207.7s10-.874\x2010-7.7s-.172-7.7-10-7.7m3.205\x208.034l-4.49\x202.096c-.393.182-.715-.022-.715-.456V8.026c0-.433.322-.638.715-.456l4.49\x202.096c.393.184.393.484\x200\x20.668\x22/></svg></div><div\x20style=\x22font-size:1.3em\x22>YouTube</div></div>';
            var rutubeHTML = '<div\x20class=\x22settings-folder\x22\x20style=\x22padding:0!important\x22><div\x20style=\x22width:2.2em;height:1.7em;padding-right:.5em\x22><svg\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20width=\x2232\x22\x20height=\x2232\x22\x20viewBox=\x220\x200\x2032\x2032\x22><path\x20fill=\x22currentColor\x22\x20d=\x22M26\x2020h-6v-2h6zm4\x208h-6v-2h6zm-2-4h-6v-2h6z\x22/><path\x20fill=\x22currentColor\x22\x20d=\x22M17.003\x2020a4.9\x204.9\x200\x200\x200-2.404-4.173L22\x203l-1.73-1l-7.577\x2013.126a5.7\x205.7\x200\x200\x200-5.243\x201.503C3.706\x2020.24\x203.996\x2028.682\x204.01\x2029.04a1\x201\x200\x200\x200\x201\x20.96h14.991a1\x201\x200\x200\x200\x20.6-1.8c-3.54-2.656-3.598-8.146-3.598-8.2m-5.073-3.003A3.11\x203.11\x200\x200\x201\x2015.004\x2020c0\x20.038.002.208.017.469l-5.9-2.624a3.8\x203.8\x200\x200\x201\x202.809-.848M15.45\x2028A5.2\x205.2\x200\x200\x201\x2014\x2025h-2a6.5\x206.5\x200\x200\x200\x20.968\x203h-2.223A16.6\x2016.6\x200\x200\x201\x2010\x2024H8a17.3\x2017.3\x200\x200\x200\x20.665\x204H6c.031-1.836.29-5.892\x201.803-8.553l7.533\x203.35A13\x2013\x200\x200\x200\x2017.596\x2028Z\x22/></svg></div><div\x20style=\x22font-size:1.3em\x22>RuTube</div></div>';
            var drmPlayHTML = '<div\x20class=\x22settings-folder\x22\x20style=\x22padding:0!important\x22><div\x20style=\x22width:2.2em;height:1.7em;padding-right:.5em\x22><svg\x20fill=\x22#ffffff\x22\x20width=\x22256px\x22\x20height=\x22256px\x22\x20viewBox=\x220\x20-6\x2046\x2046\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20stroke=\x22#ffffff\x22\x20stroke-width=\x222.3\x22><g\x20id=\x22SVGRepo_bgCarrier\x22\x20stroke-width=\x220\x22></g><g\x20id=\x22SVGRepo_tracerCarrier\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22></g><g\x20id=\x22SVGRepo_iconCarrier\x22>\x20<path\x20id=\x22_24.TV\x22\x20data-name=\x2224.TV\x22\x20d=\x22M46,37H2a1,1,0,0,1-1-1V8A1,1,0,0,1,2,7H46a1,1,0,0,1,1,1V36A1,1,0,0,1,46,37ZM45,9H3V35H45ZM21,16a.975.975,0,0,1,.563.2l7.771,4.872a.974.974,0,0,1,.261,1.715l-7.974,4.981A.982.982,0,0,1,21,28a1,1,0,0,1-1-1V17A1,1,0,0,1,21,16ZM15,39H33a1,1,0,0,1,0,2H15a1,1,0,0,1,0-2Z\x22\x20transform=\x22translate(-1\x20-7)\x22\x20fill-rule=\x22evenodd\x22></path>\x20</g></svg></div><div\x20style=\x22font-size:1.3em\x22>DRM\x20Play</div></div>';
            var twitchHTML = '<div\x20class=\x22settings-folder\x22\x20style=\x22padding:0!important\x22><div\x20style=\x22width:2.2em;height:1.7em;padding-right:.5em\x22><svg\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22><path\x20fill=\x22currentColor\x22\x20d=\x22M3.774\x202L2.45\x205.452v14.032h4.774V22h2.678l2.548-2.548h3.871l5.226-5.226V2zm15.968\x2011.323l-3\x203h-4.743L9.452\x2018.87v-2.548H5.42V3.774h14.32zm-2.968-6.097v5.226h-1.775V7.226zm-4.775\x200v5.226h-1.774V7.226z\x22/></svg></div><div\x20style=\x22font-size:1.3em\x22>Twitch</div></div>';
            var forkPlayerHTML = '<div\x20class=\x22settings-folder\x22\x20style=\x22padding:0!important\x22><div\x20style=\x22width:2.2em;height:1.7em;padding-right:.5em\x22><svg\x20width=\x22256px\x22\x20height=\x22256px\x22\x20viewBox=\x220\x200\x2032\x2032\x22\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20fill=\x22#000000\x22\x20stroke=\x22#000000\x22\x20stroke-width=\x220.00032\x22><g\x20id=\x22SVGRepo_bgCarrier\x22\x20stroke-width=\x220\x22></g><g\x20id=\x22SVGRepo_tracerCarrier\x22\x20stroke-linecap=\x22round\x22\x20stroke-linejoin=\x22round\x22></g><g\x20id=\x22SVGRepo_iconCarrier\x22>\x20<g\x20fill=\x22none\x22\x20fill-rule=\x22evenodd\x22>\x20<path\x20d=\x22m0\x200h32v32h-32z\x22></path>\x20<g\x20fill=\x22#ffffff\x22\x20fill-rule=\x22nonzero\x22>\x20<path\x20d=\x22m32\x2016c0-8.83636363-7.1636364-16-16-16-8.83636362\x200-16\x207.16363638-16\x2016\x200\x208.8363636\x207.16363638\x2016\x2016\x2016\x208.8363636\x200\x2016-7.1636364\x2016-16zm-30.54545453\x200c0-8.03345453\x206.512-14.54545453\x2014.54545453-14.54545453\x208.0334545\x200\x2014.5454545\x206.512\x2014.5454545\x2014.54545453\x200\x208.0334545-6.512\x2014.5454545-14.5454545\x2014.5454545-8.03345453\x200-14.54545453-6.512-14.54545453-14.5454545z\x22></path>\x20<path\x20d=\x22m16.6138182\x2025.2349091v-9.2349091h3.0472727l.4814545-3.0603636h-3.5287272v-1.5345455c0-.7985455.2618182-1.56072727\x201.408-1.56072727h2.2909091v-3.05454547h-3.2523636c-2.7345455\x200-3.4807273\x201.80072728-3.4807273\x204.29672724v1.8516364h-1.8763637v3.0618182h1.8763636v9.2349091z\x22></path>\x20</g>\x20</g>\x20</g></svg></div><div\x20style=\x22font-size:1.3em\x22>ForkPlayer</div></div>';
            var speedTestHTML = '<div\x20class=\x22settings-folder\x22\x20style=\x22padding:0!important\x22><div\x20style=\x22width:2.2em;height:1.7em;padding-right:.5em\x22><svg\x20xmlns=\x22http://www.w3.org/2000/svg\x22\x20width=\x2224\x22\x20height=\x2224\x22\x20viewBox=\x220\x200\x2024\x2024\x22><path\x20fill=\x22currentColor\x22\x20d=\x22M10.45\x2015.5q.625.625\x201.575.588T13.4\x2015.4L19\x207l-8.4\x205.6q-.65.45-.712\x201.362t.562\x201.538M5.1\x2020q-.55\x200-1.012-.238t-.738-.712q-.65-1.175-1-2.437T2\x2014q0-2.075.788-3.9t2.137-3.175T8.1\x204.788T12\x204q2.05\x200\x203.85.775T19\x206.888t2.15\x203.125t.825\x203.837q.025\x201.375-.312\x202.688t-1.038\x202.512q-.275.475-.737.713T18.874\x2020z\x22/></svg></div><div\x20style=\x22font-size:1.3em\x22>Speed\x20Test</div></div>';
            
            Lampa['Storage']['listener']['follow']('change', function() {});
            
            Lampa['Modal']['listener']['follow']('create', function(_0x38f536) {
                var componentName = _0x38f536['name'];
                if (componentName == 'settings') {
                    Lampa['SettingsApi']['addComponent']({
                        'component': 'back_menu',
                        'name': 'BackMenu'
                    });
                    setTimeout(function() {
                        $('div[data-component=\x22back_menu\x22]')['remove']();
                    }, 0x0);
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'main',
                'param': {
                    'name': 'back_menu',
                    'type': 'static',
                    'default': true
                },
                'field': {
                    'name': 'Меню\x20Выход',
                    'description': 'Настройки\x20отображения\x20пунктов\x20меню'
                },
                'onRender': function(_0x139b66) {
                    _0x139b66['on']('hover:enter', function() {
                        Lampa['Settings']['create']('back_menu');
                        Lampa['Controller']['enabled']()['controller']['back'] = function() {
                            Lampa['Modal']['toggle']('main');
                        };
                    });
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
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
                    'name': 'Выход\x20',
                    'description': 'Нажмите\x20для\x20выбора'
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
                'param': {
                    'name': 'reboot',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '2'
                },
                'field': {
                    'name': 'Перезагрузить',
                    'description': 'Нажмите\x20для\x20выбора'
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
                'param': {
                    'name': 'switch_server',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '2'
                },
                'field': {
                    'name': 'Сменить\x20сервер',
                    'description': 'Нажмите\x20для\x20выбора'
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
                'param': {
                    'name': 'clear_cache',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '2'
                },
                'field': {
                    'name': 'Очистить\x20кэш',
                    'description': 'Нажмите\x20для\x20выбора'
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
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
                    'description': 'Нажмите\x20для\x20выбора'
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
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
                    'description': 'Нажмите\x20для\x20выбора'
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
                'param': {
                    'name': 'drm_play',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '1'
                },
                'field': {
                    'name': 'DRM\x20Play',
                    'description': 'Нажмите\x20для\x20выбора'
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
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
                    'description': 'Нажмите\x20для\x20выбора'
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
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
                    'description': 'Нажмите\x20для\x20выбора'
                }
            });
            
            Lampa['SettingsApi']['addParam']({
                'component': 'back_menu',
                'param': {
                    'name': 'speedtest',
                    'type': 'select',
                    'values': {
                        0x1: 'Скрыть',
                        0x2: 'Отобразить'
                    },
                    'default': '1'
                },
                'field': {
                    'name': 'Speed\x20Test',
                    'description': 'Нажмите\x20для\x20выбора'
                }
            });
            
            var initCheckInterval = setInterval(function() {
                if (typeof Lampa !== 'undefined') {
                    clearInterval(initCheckInterval);
                    if (!Lampa['Storage']['get']('back_plug', 'false')) initializeDefaultSettings();
                }
            }, 0xc8);

            function initializeDefaultSettings() {
                Lampa['Storage']['set']('back_plug', true);
                Lampa['Storage']['set']('exit', '2');
                Lampa['Storage']['set']('reboot', '2');
                Lampa['Storage']['set']('switch_server', '2');
                Lampa['Storage']['set']('clear_cache', '2');
                Lampa['Storage']['set']('youtube', '1');
                Lampa['Storage']['set']('rutube', '1');
                Lampa['Storage']['set']('drm_play', '1');
                Lampa['Storage']['set']('twitch', '1');
                Lampa['Storage']['set']('fork_player', '1');
                Lampa['Storage']['set']('speedtest', '1');
            }

            function showSpeedTestModal() {
                var speedTestElement = $('<div\x20style=\x22text-align:right;\x22><div\x20style=\x22min-height:360px;\x22><iframe\x20id=\x22speedtest-iframe\x22\x20width=\x22100%\x22\x20height=\x22100%\x22\x20frameborder=\x220\x22></iframe></div></div>');
                Lampa['Modal']['create']({
                    'title': '',
                    'html': speedTestElement,
                    'size': 'medium',
                    'mask': true,
                    'onBack': function() {
                        Lampa['Modal']['close']();
                        Lampa['Controller']['toggle']('content');
                    },
                    'onSelect': function() {}
                });
                var iframeElement = document['getElementById']('speedtest-iframe');
                iframeElement['src'] = 'http://speedtest.vokino.tv/?R=3';
            }

            function performClearCache() {
                Lampa['Storage']['clear']();
            }
            
            var protocolType = location['protocol'] === 'https:' ? 'https://' : 'http://';

            function performServerSwitch() {
                Lampa['Input']['edit']({
                    'title': 'Укажите\x20cервер',
                    'value': '',
                    'free': true
                }, function(_0x42ec0e) {
                    if (_0x42ec0e !== '') {
                        window['location']['href'] = protocolType + _0x42ec0e;
                    } else {
                        displayBackMenu();
                    }
                });
            }

            function performApplicationExit() {
                if (Lampa['Platform']['is']('android')) window['location']['assign']('exit://exit');
                if (Lampa['Platform']['is']('tizen')) tizen['application']['getCurrentApplication']()['exit']();
                if (Lampa['Platform']['is']('webos')) window['close']();
                if (Lampa['Platform']['is']('apple_tv')) Lampa['Android']['exit']();
                if (Lampa['Platform']['is']('orsay')) Lampa['Orsay']['exit']();
                if (Lampa['Platform']['is']('netcast')) window['NetCastBack']();
                if (Lampa['Platform']['is']('noname')) window['history']['back']();
                if (Lampa['Platform']['is']('browser')) window['close']();
                if (Lampa['Platform']['is']('nw')) nw['Window']['get']()['close']();
            }
            
            function displayBackMenu() {
                var menuItemsArray = [];
                
                if (localStorage['getItem']('exit') !== '1') {
                    menuItemsArray['push']({
                        'title': exitMenuHTML
                    });
                }
                if (localStorage['getItem']('reboot') !== '1') {
                    menuItemsArray['push']({
                        'title': rebootMenuHTML
                    });
                }
                if (localStorage['getItem']('switch_server') !== '1') {
                    menuItemsArray['push']({
                        'title': switchServerHTML
                    });
                }
                if (localStorage['getItem']('clear_cache') !== '1') {
                    menuItemsArray['push']({
                        'title': switchServerHTML
                    });
                }
                if (localStorage['getItem']('youtube') !== '1') {
                    menuItemsArray['push']({
                        'title': youtubeHTML
                    });
                }
                if (localStorage['getItem']('rutube') !== '1') {
                    menuItemsArray['push']({
                        'title': rutubeHTML
                    });
                }
                if (localStorage['getItem']('drm_play') !== '1') {
                    menuItemsArray['push']({
                        'title': drmPlayHTML
                    });
                }
                if (localStorage['getItem']('twitch') !== '1') {
                    menuItemsArray['push']({
                        'title': twitchHTML
                    });
                }
                if (localStorage['getItem']('fork_player') !== '1') {
                    menuItemsArray['push']({
                        'title': forkPlayerHTML
                    });
                }
                if (localStorage['getItem']('speedtest') !== '1') {
                    menuItemsArray['push']({
                        'title': speedTestHTML
                    });
                }
                
                Lampa['Select']['show']({
                    'title': 'Выход\x20',
                    'items': menuItemsArray,
                    'onBack': function() {
                        Lampa['Controller']['toggle']('content');
                    },
                    'onSelect': function(_0x4a8171) {
                        if (_0x4a8171['title'] == exitMenuHTML) performApplicationExit();
                        if (_0x4a8171['title'] == rebootMenuHTML) location['reload']();
                        if (_0x4a8171['title'] == switchServerHTML) performServerSwitch();
                        if (_0x4a8171['title'] == switchServerHTML) performClearCache();
                        if (_0x4a8171['title'] == youtubeHTML) window['location']['href'] = 'https://youtube.com/tv';
                        if (_0x4a8171['title'] == rutubeHTML) window['location']['href'] = 'https://rutube.ru/tv-release/rutube.server-22.0.0/webos/';
                        if (_0x4a8171['title'] == drmPlayHTML) window['location']['href'] = 'https://ott.drm-play.com';
                        if (_0x4a8171['title'] == twitchHTML) window['location']['href'] = 'https://webos.tv.twitch.tv';
                        if (_0x4a8171['title'] == forkPlayerHTML) window['location']['href'] = 'http://browser.appfxml.com';
                        if (_0x4a8171['title'] == speedTestHTML) showSpeedTestModal();
                    }
                });
            }
            
            Lampa['Controller']['listener']['follow']('toggle', function(_0x27dac1) {
                if (_0x27dac1['name'] == 'select') {
                    if ($('.selectbox__title')['text']() == Lampa['Lang']['translate']('title_out')) {
                        Lampa['Select']['hide']();
                        setTimeout(function() {
                            displayBackMenu();
                        }, 0x64);
                    }
                }
            });
        }
        
        if (window['appready']) setupProtection();
        else {
            Lampa['Listener']['follow']('app', function(_0x40c73c) {
                if (_0x40c73c['type'] == 'ready') setupProtection();
            });
        }
    }

    initializeBackMenu();
})();
