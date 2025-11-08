/* jshint esversion: 6, bitwise: false */
(function() {
    'use strict';

    var DRXAOS_TITLE_LOGO_CACHE = {};
    var DRXAOS_TITLE_LOGO_PENDING = {};
    var DRXAOS_ORIGINAL_NAME_CACHE = {};
    var DRXAOS_ORIGINAL_NAME_PENDING = {};

    /*
    ╔══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                              ║
    ║                        🎨 DRXAOS THEMES PLUGIN 🎨                           ║
    ║                     SOOPER 2025 Style for Lampa&Lampac                      ║
    ║                                                                              ║
    ║  ┌────────────────────────────────────────────────────────────────────────┐  ║
    ║  │  💎 9 PREMIUM THEMES | ⚡ OPTIMIZED | 🎬 TMDB INTEGRATION             │  ║
    ║  └────────────────────────────────────────────────────────────────────────┘  ║
    ║                                                                              ║
    ║  Автор: DrXAOS                                                               ║
    ║  Версия: 2.6 (ATV Performance Optimized)                      
║ 
║ ⚡ PERFORMANCE OPTIMIZATIONS (v2.4):
║    • Removed all backdrop-filter: blur() (25 instances)
║    • Simplified all box-shadow effects
║    • Fixed transparency at 99.5% for all elements
║    • Optimized transitions (transform, opacity only)
║    • Added GPU acceleration (translateZ, will-change)
║    • Removed heavy pseudo-elements
║    • Faster animations (0.15s)
║    • Perfect for Android TV, Fire TV, Google TV
║║
    ║                                                                              ║
    ║                                                                              ║
    ║  ┌────────────────────────────────────────────────────────────────────────┐ ║
    ║  │  💰 ПОДДЕРЖКА РАЗРАБОТЧИКА / SUPPORT THE DEVELOPER                     │ ║
    ║  │                                                                         │ ║
    ║  │  🇷🇺 Если вам нравится плагин и вы хотите поблагодарить копейкой:         │ ║
    ║  │  🇺🇦 Якщо вам подобається плагін і ви хочете подякувати копійчиною:       │ ║
    ║  │  🇬🇧 If you like the plugin and want to say thanks:                       │ ║
    ║  │                                                                         │ ║
    ║  │  💳 USDT (TRC-20):  TBLUWM16Eiufc6GLJaMGxaFy7oTBiDgar8                    ║
    ║  │                                                                           ║ 
    ║  │                                                                         │ ║
    ║  │  🙏 Каждый донат мотивирует на дальнейшую разработку!                 │  ║
    ║  │  🙏 Кожен донат мотивує на подальший розвиток!                         │  ║
    ║  │  🙏 Every donation motivates further development!                      │  ║
    ║  └────────────────────────────────────────────────────────────────────────┘  ║
    ║                                                                              ║
    ║  Спасибо за использование! / Дякую за використання! / Thank you for using!   ║
    ║                                                                              ║
    ╚══════════════════════════════════════════════════════════════════════════════╝
    */

var CONFIG = {
        PLUGIN_NAME: 'drxaos_themes',
        VERSION: '2.6.0',
        AUTHOR: 'DrXAOS',
        LAMPA_MIN_VERSION: 240,
        LAMPA_3_SUPPORT: true,
        API: {
            TMDB_URL: 'https://api.themoviedb.org/3',
            JACRED_URL: 'https://jacred.xyz'
        },
        PERFORMANCE: {
            DEBOUNCE_DELAY: 300,
            THROTTLE_LIMIT: 100,
            MUTATION_THROTTLE: 50
        },
        FEATURES: {
            TMDB_INTEGRATION: true,
            JACRED_INTEGRATION: true,
            TRACKS_FIX: true,
            MUTATION_OBSERVER: true,
            UTILITIES_BUTTON: true
        },
        DEBUG: false,
        VERBOSE_LOGGING: false
    };
    var DEFAULT_FONT_STACK = "'Netflix Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
    var FONT_PRESETS = [
        { key: 'netflix', label: 'Netflix', stack: DEFAULT_FONT_STACK, href: null },
        { key: 'inter', label: 'Inter', stack: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap&subset=latin,cyrillic' },
        { key: 'roboto', label: 'Roboto', stack: "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap&subset=latin,cyrillic' },
        { key: 'open_sans', label: 'Open Sans', stack: "'Open Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap&subset=latin,cyrillic' },
        { key: 'pt_sans', label: 'PT Sans', stack: "'PT Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", href: 'https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap&subset=latin,cyrillic' },
        { key: 'manrope', label: 'Manrope', stack: "'Manrope', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap&subset=latin,cyrillic' },
        { key: 'rubik', label: 'Rubik', stack: "'Rubik', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap&subset=latin,cyrillic' },
        { key: 'montserrat', label: 'Montserrat', stack: "'Montserrat', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap&subset=latin,cyrillic' },
        { key: 'source_sans', label: 'Source Sans 3', stack: "'Source Sans 3', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700;900&display=swap&subset=latin,cyrillic' },
        { key: 'nunito_sans', label: 'Nunito Sans', stack: "'Nunito Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&display=swap&subset=latin,cyrillic' }
    ];
    var FONT_PRESET_MAP = FONT_PRESETS.reduce(function(acc, preset) {
        acc[preset.key] = preset;
        return acc;
    }, {});
    var FONT_OPTIONS = FONT_PRESETS.reduce(function(acc, preset) {
        acc[preset.key] = preset.label;
        return acc;
    }, {});
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait || CONFIG.PERFORMANCE.DEBOUNCE_DELAY);
        };
    }
    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() { inThrottle = false; }, limit || CONFIG.PERFORMANCE.THROTTLE_LIMIT);
            }
        };
    }
    function log(message, data) {
        if (CONFIG.DEBUG || CONFIG.VERBOSE_LOGGING) {
            console.log('[' + CONFIG.PLUGIN_NAME + ' v' + CONFIG.VERSION + ']', message, data || '');
        }
    }
    function logError(message, error) {
        console.error('[' + CONFIG.PLUGIN_NAME + ']', message, error);
    }
    window.drxaosPostDefaultsQueue = window.drxaosPostDefaultsQueue || [];
    function scheduleDrxaosApplyAll() {
        if (typeof window.drxaosScheduleApply === 'function') {
            try {
                window.drxaosScheduleApply();
            } catch (e) {
                logError('DRXAOS schedule apply-all failed', e);
            }
        }
    }
    
    // Проверка версии Lampa
    function isLampa3() {
        return window.Lampa && window.Lampa.Manifest && window.Lampa.Manifest.app_digital >= 300;
    }
    
    function getLampaVersion() {
        if (window.Lampa && window.Lampa.Manifest) {
            return window.Lampa.Manifest.app_digital || 0;
        }
        return 0;
    }
    
    // Логирование версии при старте
    if (window.Lampa) {
        log('Lampa version detected: ' + getLampaVersion() + (isLampa3() ? ' (3.0+)' : ' (legacy)'));
    }
    
    var netflixFontStyles = `
        :root {
            --drxaos-font-family: ${DEFAULT_FONT_STACK};
        }
        body, .body,
        .menu, .settings, .layer, .modal,
        h1, h2, h3, h4, h5, h6,
        p, span, div, a, button, input, textarea {
            font-family: var(--drxaos-font-family) !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }
.head__action:not(.open--profile),
.drxaos-theme-quick-btn {
    background: var(--theme-color, rgba(0, 0, 0, var(--drxaos-surface-opacity))) !important;
    border-radius: 8px !important;
    padding: 8px !important;
    transition: transform 0.3s ease !important, opacity 0.3s ease !important;
}
.head__action:not(.open--profile):hover,
.head__action:not(.open--profile):focus,
.head__action:not(.open--profile).focus,
.drxaos-theme-quick-btn:hover,
.drxaos-theme-quick-btn:focus,
.drxaos-theme-quick-btn.focus {
    background: var(--theme-color, rgba(0, 0, 0, var(--drxaos-surface-opacity))) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    transform: scale(1.05) !important;
}
.head__action:not(.open--profile) svg,
.drxaos-theme-quick-btn svg {
    filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, var(--drxaos-surface-opacity))) !important;
    transition: transform 0.3s ease !important, opacity 0.3s ease !important;
}
.head__action:not(.open--profile):hover svg,
.head__action:not(.open--profile):focus svg,
.head__action:not(.open--profile).focus svg,
.drxaos-theme-quick-btn:hover svg,
.drxaos-theme-quick-btn:focus svg,
.drxaos-theme-quick-btn.focus svg {
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.95)) !important;
    transform: scale(1.1) !important;
}
.speedtest {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.18) 0%, rgba(var(--bg-rgb), 0.995) 40%, rgba(var(--secondary-rgb), 0.12) 100%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.5) !important;
    border-radius: 16px !important;
}
.speedtest__progress { stroke: var(--theme-accent) !important; }
.speedtest__frequency { stroke: rgba(var(--primary-rgb), 0.3) !important; }
.speedtest text { fill: var(--text-main) !important; }
#speedtest_num { fill: var(--theme-accent) !important; }
#speedtest_graph { stroke: var(--theme-accent) !important; }`;
    if (!document.querySelector('#drxaos-netflix-fonts')) {
        var netflixFontStyle = document.createElement('style');
        netflixFontStyle.id = 'drxaos-netflix-fonts';
        netflixFontStyle.textContent = netflixFontStyles;
        document.head.appendChild(netflixFontStyle);
    }
    var globalFontStyles = `
        * {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            font-display: swap !important;
            font-synthesis: none !important;
            font-feature-settings: "kern" 1, "liga" 1, "calt" 1 !important;
            font-variant-ligatures: common-ligatures !important;
            font-optical-sizing: auto !important;
            text-rendering: optimizeLegibility !important;
        }
    `;
    if (!document.querySelector('#drxaos-global-font-styles')) {
        var globalFontStyle = document.createElement('style');
        globalFontStyle.id = 'drxaos-global-font-styles';
        globalFontStyle.textContent = globalFontStyles;
        document.head.appendChild(globalFontStyle);
    }
    var performanceMonitor = {
        startTime: 0,
        metrics: {},
        start: function(operation) {
            this.startTime = performance.now();
            this.metrics[operation] = { start: this.startTime };
        },
        end: function(operation) {
            if (this.metrics[operation]) {
                this.metrics[operation].duration = performance.now() - this.startTime;
            }
        },
        log: function(message, data) {
        }
    };
    var renderingOptimizer = {
        originClean: true,
        checkOriginClean: function() {
            var isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
            this.originClean = isSecure;
            if (!this.originClean) {
            }
            return this.originClean;
        },
        usePremultipliedAlpha: true,
        willReadFrequently: function() {
            return /Android TV|Google TV|WebOS|Tizen|Smart TV|TV|Fire TV|FireTV|AFT|Roku|Apple TV|Chromecast/i.test(navigator.userAgent);
        },
        applyCanvasOptimizations: function() {
            try {
                var canvasElements = document.querySelectorAll('canvas');
                canvasElements.forEach(function(canvas) {
                    if (canvas.getContext) {
                        try {
                            var context2d = canvas.getContext('2d', { willReadFrequently: true });
                            if (context2d) {
                            }
                        } catch(e) {
                        }
                        try {
                            var gl = canvas.getContext('webgl', { willReadFrequently: true });
                            if (gl) {
                            }
                        } catch(e) {
                        }
                        try {
                            var gl2 = canvas.getContext('webgl2', { willReadFrequently: true });
                            if (gl2) {
                            }
                        } catch(e) {
                        }
                        try {
                            var bitmap = canvas.getContext('bitmaprenderer', { willReadFrequently: true });
                            if (bitmap) {
                            }
                        } catch(e) {
                        }
                    }
                });
                if (typeof OffscreenCanvas !== 'undefined') {
                    var offscreenCanvases = document.querySelectorAll('canvas');
                    offscreenCanvases.forEach(function(canvas) {
                        if (canvas.transferControlToOffscreen) {
                            try {
                                var offscreen = canvas.transferControlToOffscreen();
                                if (offscreen.getContext) {
                                    var offscreenContext = offscreen.getContext('2d', { willReadFrequently: true });
                                    if (offscreenContext) {
                                    }
                                }
                            } catch(e) {
                            }
                        }
                    });
                }
                this.interceptCanvasContext();
            } catch(e) {
            }
        },
        interceptCanvasContext: function() {
            try {
                var originalGetContext = HTMLCanvasElement.prototype.getContext;
                HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                    if (contextType === '2d') {
                        if (!contextAttributes) {
                            contextAttributes = {};
                        }
                        contextAttributes.willReadFrequently = true;
                    }
                    if (contextType === 'webgl' || contextType === 'webgl2') {
                        if (!contextAttributes) {
                            contextAttributes = {};
                        }
                        contextAttributes.willReadFrequently = true;
                    }
                    if (contextType === 'bitmaprenderer') {
                        if (!contextAttributes) {
                            contextAttributes = {};
                        }
                        contextAttributes.willReadFrequently = true;
                    }
                    return originalGetContext.call(this, contextType, contextAttributes);
                };
                if (typeof OffscreenCanvas !== 'undefined' && OffscreenCanvas.prototype.getContext) {
                    var originalOffscreenGetContext = OffscreenCanvas.prototype.getContext;
                    OffscreenCanvas.prototype.getContext = function(contextType, contextAttributes) {
                        if (contextType === '2d') {
                            if (!contextAttributes) {
                                contextAttributes = {};
                            }
                            contextAttributes.willReadFrequently = true;
                        }
                        return originalOffscreenGetContext.call(this, contextType, contextAttributes);
                    };
                }
            } catch(e) {
            }
        },
        optimizeForDevice: function() {
            var isTV = deviceDetection.isTV();
            var isMobile = deviceDetection.isMobile();
            if (isTV) {
                return {
                    useGPU: true,
                    premultipliedAlpha: true,
                    willReadFrequently: false,
                    optimizeForSpeed: true
                };
            } else if (isMobile) {
                return {
                    useGPU: true,
                    premultipliedAlpha: true,
                    willReadFrequently: true,
                    optimizeForSpeed: false
                };
            } else {
                return {
                    useGPU: false,
                    premultipliedAlpha: true,
                    willReadFrequently: true,
                    optimizeForSpeed: false
                };
            }
        },
        applyOptimizations: function() {
            this.checkOriginClean();
            this.optimizeForDevice();
            this.applyCanvasOptimizations();
            this.fixDeprecatedSliders();
        },
        fixDeprecatedSliders: function() {
            try {
                var sliders = document.querySelectorAll('[style*="appearance: slider-vertical"], [style*="appearance:slider-vertical"]');
                sliders.forEach(function(slider) {
                    if (slider.tagName !== 'INPUT' || slider.type !== 'range') {
                        var newSlider = document.createElement('input');
                        newSlider.type = 'range';
                        newSlider.style.cssText = 'writing-mode: vertical-lr; direction: rtl;';
                        Array.from(slider.attributes).forEach(function(attr) {
                            if (attr.name !== 'style') {
                                newSlider.setAttribute(attr.name, attr.value);
                            }
                        });
                        slider.parentNode.replaceChild(newSlider, slider);
                    }
                });
                var deprecatedCSS = `
                    input[type="range"] {
                        writing-mode: vertical-lr !important;
                        direction: rtl !important;
                        appearance: none !important;
                        -webkit-appearance: none !important;
                        -moz-appearance: none !important;
                    }
                    *[style*="appearance: slider-vertical"],
                    *[style*="appearance:slider-vertical"] {
                        appearance: none !important;
                        -webkit-appearance: none !important;
                        -moz-appearance: none !important;
                        writing-mode: vertical-lr !important;
                        direction: rtl !important;
                    }
                    * {
                        appearance: none !important;
                        -webkit-appearance: none !important;
                        -moz-appearance: none !important;
                    }
                    input, button, select, textarea {
                        appearance: auto !important;
                        -webkit-appearance: auto !important;
                        -moz-appearance: auto !important;
                    }
                    input[type="range"] {
                        appearance: none !important;
                        -webkit-appearance: none !important;
                        -moz-appearance: none !important;
                        writing-mode: vertical-lr !important;
                        direction: rtl !important;
                    }
                `;
                styleManager.setStyle('drxaos-slider-fixes', deprecatedCSS);
            } catch(e) {
            }
        },
        setupDynamicElementObserver: function() {
            try {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1) {
                                    if (node.style && (node.style.appearance === 'slider-vertical' || 
                                        node.getAttribute('style') && node.getAttribute('style').includes('slider-vertical'))) {
                                        node.style.appearance = 'none';
                                        node.style.writingMode = 'vertical-lr';
                                        node.style.direction = 'rtl';
                                    }
                                    if (node.tagName === 'CANVAS') {
                                        if (node.getContext) {
                                            try {
                                                var context = node.getContext('2d', { willReadFrequently: true });
                                                if (context) {
                                                }
                                            } catch(e) {
                                            }
                                        }
                                    }
                                    if (node.classList && node.classList.contains('selectbox-item')) {
                                        addIconsToSelectboxItem(node);
                                    }
                                    var childSliders = node.querySelectorAll && node.querySelectorAll('[style*="appearance: slider-vertical"], [style*="appearance:slider-vertical"]');
                                    if (childSliders) {
                                        childSliders.forEach(function(slider) {
                                            slider.style.appearance = 'none';
                                            slider.style.writingMode = 'vertical-lr';
                                            slider.style.direction = 'rtl';
                                        });
                                    }
                                    var childCanvases = node.querySelectorAll && node.querySelectorAll('canvas');
                                    if (childCanvases) {
                                        childCanvases.forEach(function(canvas) {
                                            if (canvas.getContext) {
                                                try {
                                                    var context = canvas.getContext('2d', { willReadFrequently: true });
                                                    if (context) {
                                                    }
                                                } catch(e) {
                                                }
                                            }
                                        });
                                    }
                                    var selectboxItems = node.querySelectorAll && node.querySelectorAll('.selectbox-item');
                                    if (selectboxItems && selectboxItems.length > 0) {
                                        selectboxItems.forEach(function(item) {
                                            addIconsToSelectboxItem(item);
                                        });
                                    }
                                }
                            });
                        }
                    });
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style']
                });
                return observer;
            } catch(e) {
                return null;
            }
        }
    };
    function addIconsToSelectboxItem(item) {
        try {
            var title = item.querySelector('.selectbox-item__title');
            if (!title) return;
            var titleText = title.textContent.trim();
            var iconContainer = item.querySelector('.selectbox-item__icon');
            if (!iconContainer) {
                iconContainer = document.createElement('div');
                iconContainer.className = 'selectbox-item__icon';
                item.insertBefore(iconContainer, item.firstChild);
            }
            var iconSVG = '';
            var lower = titleText.toLowerCase();
            if (lower.includes('онлайн') || lower.includes('lampac')) {
                iconSVG = BUTTON_ICON_SVGS.online;
            } else if (lower.includes('торрент')) {
                iconSVG = BUTTON_ICON_SVGS.torrent;
            } else if (lower.includes('смотреть') || lower.includes('play')) {
                iconSVG = BUTTON_ICON_SVGS.play;
            } else if (lower.includes('youtube') || lower.includes('трейлер')) {
                iconSVG = BUTTON_ICON_SVGS.trailer;
            }
            if (iconSVG) {
                iconContainer.innerHTML = iconSVG
                    .replace('width="28"', 'width="24"')
                    .replace('height="28"', 'height="24"');
                iconContainer.style.display = 'inline-block';
            } else {
                iconContainer.style.display = 'none';
            }
        } catch(e) {
        }
    }
    var deviceDetection = {
        isTV: function() {
            return /Android TV|Google TV|WebOS|Tizen|Smart TV|TV|Fire TV|FireTV|AFT|Roku|Apple TV|Chromecast/i.test(navigator.userAgent) || 
                   (window.screen.width >= 1920 && window.screen.height >= 1080 && 
                   /Android|Linux/i.test(navigator.userAgent)) ||
                   /AFT/i.test(navigator.userAgent) ||
                   (window.screen.width >= 3840 && window.screen.height >= 2160) ||
                   (navigator.userAgent.includes('TV') && window.screen.width > 1280);
        },
        isMobile: function() {
            return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        isDesktop: function() {
            return !this.isTV() && !this.isMobile();
        },
        getDeviceType: function() {
            if (this.isTV()) return 'tv';
            if (this.isMobile()) return 'mobile';
            return 'desktop';
        }
    };
    var styleManager = {
        styles: {},
        setStyle: function(id, css) {
            this.removeStyle(id);
            this.styles[id] = $('<style id="' + id + '">' + css + '</style>').appendTo('head');
        },
        removeStyle: function(id) {
            if (this.styles[id]) {
                this.styles[id].remove();
                delete this.styles[id];
            } else {
                $('#' + id).remove();
            }
        },
        clearAllStyles: function() {
            var styleIds = [
                'drxaos-advanced-styles',
                'drxaos-poster-styles', 
                'drxaos-hover-scale-styles',
                'drxaos-interface-size-styles',
                'drxaos_animations_style',
                'drxaos-font-family-style',
                'drxaos_font_weight_style',
                'drxaos-glow-styles',
                'drxaos-details-style',
                'drxaos-action-buttons',
                'drxaos-input-overlay-style',
                'drxaos_theme_style'
            ];
            styleIds.forEach(function(id) {
                $('#' + id).remove();
            });
            this.styles = {};
        }
    };
    var inputOverlay = (function createInputOverlay() {
        var overlayId = 'drxaos-input-overlay';
        var state = null;

        function ensureOverlayStyles() {
            if (document.getElementById('drxaos-input-overlay-style')) return;
            var overlayCSS = "\n                #drxaos-input-overlay{position:fixed;inset:0;z-index:2147483646;pointer-events:auto;display:flex;align-items:center;justify-content:center;font-family:var(--drxaos-font-family);}\n                #drxaos-input-overlay[data-hidden=\\\"true\\\"]{opacity:0;pointer-events:none;}\n                #drxaos-input-overlay .drx-overlay-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0.68);backdrop-filter:blur(8px);}\n                #drxaos-input-overlay .drx-overlay-card{position:relative;z-index:1;width:min(92vw,520px);background:rgba(17,20,24,0.97);border-radius:18px;padding:22px;border:1px solid rgba(255,255,255,0.08);box-shadow:0 18px 48px rgba(0,0,0,0.55);display:flex;flex-direction:column;gap:16px;color:#f1f5f9;}\n                #drxaos-input-overlay .drx-overlay-title{font-size:20px;font-weight:700;text-align:center;letter-spacing:0.01em;}\n                #drxaos-input-overlay .drx-overlay-input{width:100%;height:48px;border-radius:12px;border:1px solid rgba(148,163,184,0.3);background:rgba(15,18,22,0.95);color:#e2e8f0;padding:0 14px;font-size:16px;outline:none;box-shadow:inset 0 1px 0 rgba(255,255,255,0.04);} \n                #drxaos-input-overlay .drx-overlay-input:focus{border-color:rgba(59,130,246,0.55);box-shadow:0 0 0 2px rgba(59,130,246,0.25);} \n                #drxaos-input-overlay .drx-overlay-buttons{display:flex;gap:12px;flex-wrap:wrap;}\n                #drxaos-input-overlay .drx-overlay-button{flex:1 1 30%;min-height:46px;border-radius:12px;border:1px solid rgba(148,163,184,0.35);background:rgba(30,41,59,0.92);color:#f8fafc;font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;user-select:none;}\n                #drxaos-input-overlay .drx-overlay-button:hover,\n                #drxaos-input-overlay .drx-overlay-button.focus{transform:translateY(-2px);background:rgba(51,65,85,0.95);border-color:rgba(59,130,246,0.45);} \n                #drxaos-input-overlay .drx-overlay-button--primary{background:linear-gradient(135deg,rgba(59,130,246,0.92),rgba(14,165,233,0.82));border-color:rgba(59,130,246,0.92);color:#fff;}\n                #drxaos-input-overlay .drx-overlay-button--danger{background:rgba(239,68,68,0.12);border-color:rgba(239,68,68,0.5);color:rgba(248,113,113,0.95);} \n                #drxaos-input-overlay .drx-overlay-button--ghost{background:rgba(15,23,42,0.75);border-color:rgba(148,163,184,0.2);} \n                #drxaos-input-overlay .drx-overlay-message{font-size:14px;color:#cbd5f5;text-align:center;line-height:1.4;}\n                @media (max-width:420px){#drxaos-input-overlay .drx-overlay-card{padding:18px;border-radius:16px;}#drxaos-input-overlay .drx-overlay-buttons{flex-direction:column;}#drxaos-input-overlay .drx-overlay-button{flex:1 1 auto;width:100%;}}\n            ";
            styleManager.setStyle('drxaos-input-overlay-style', overlayCSS);
        }

        function restoreFocus(previous) {
            if (!previous) return;
            try {
                if (window.Lampa && Lampa.Controller && typeof Lampa.Controller.focus === 'function') {
                    setTimeout(function() { Lampa.Controller.focus(previous); }, 30);
                } else if (document.activeElement !== previous) {
                    previous.focus();
                }
            } catch (e) {
            }
        }

        function closeOverlay(result) {
            if (!state) return;
            document.removeEventListener('keydown', state.keyHandler, true);
            document.removeEventListener('click', state.outsideHandler, true);
            if (state.overlay && state.overlay.parentNode) {
                state.overlay.parentNode.removeChild(state.overlay);
            }
            restoreFocus(state.previousFocus);
            var resolve = state.resolve;
            state = null;
            if (resolve) {
                resolve(result || { action: 'cancel', value: '' });
            }
        }

        function makeKeyHandler() {
            return function handleKey(evt) {
                if (!state) return;
                var code = evt.key || '';
                var keyCode = typeof evt.keyCode === 'number' ? evt.keyCode : 0;
                if (code === 'Enter' || code === 'OK' || keyCode === 13) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    state.trigger('save');
                } else if (code === 'Escape' || code === 'Back' || code === 'Cancel' || keyCode === 461 || keyCode === 27) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    state.trigger('cancel');
                }
            };
        }

        function makeOutsideHandler() {
            return function handleOutside(evt) {
                if (!state) return;
                if (!state.overlay.contains(evt.target)) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    state.trigger('cancel');
                }
            };
        }

        function openOverlay(options) {
            options = options || {};
            return new Promise(function(resolve) {
                ensureOverlayStyles();
                if (state) {
                    closeOverlay({ action: 'cancel', value: '' });
                }

                var overlay = document.createElement('div');
                overlay.id = overlayId;
                overlay.setAttribute('data-hidden', 'true');
                overlay.innerHTML = '' +
                    '<div class="drx-overlay-backdrop" data-overlay-act="cancel"></div>' +
                    '<div class="drx-overlay-card" role="dialog" aria-modal="true" aria-label="' + (options.title || 'Input') + '">' +
                        (options.title ? '<div class="drx-overlay-title">' + options.title + '</div>' : '') +
                        (options.message ? '<div class="drx-overlay-message">' + options.message + '</div>' : '') +
                        '<input class="drx-overlay-input" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />' +
                        '<div class="drx-overlay-buttons">' +
                            '<button type="button" class="selector drx-overlay-button drx-overlay-button--primary" data-overlay-act="save">' + (options.saveLabel || 'Сохранить') + '</button>' +
                            (options.allowClear === false ? '' : '<button type="button" class="selector drx-overlay-button drx-overlay-button--danger" data-overlay-act="clear">' + (options.clearLabel || 'Очистить') + '</button>') +
                            '<button type="button" class="selector drx-overlay-button drx-overlay-button--ghost" data-overlay-act="cancel">' + (options.cancelLabel || 'Отмена') + '</button>' +
                        '</div>' +
                    '</div>';

                document.body.appendChild(overlay);

                var input = overlay.querySelector('.drx-overlay-input');
                input.value = (options.value || '').trim();
                input.placeholder = options.placeholder || '';

                var buttons = Array.from(overlay.querySelectorAll('.drx-overlay-button'));
                var previousFocus = document.activeElement;

                if (window.Lampa && Lampa.Controller) {
                    try {
                        Lampa.Controller.collectionSet($(overlay).find('.drx-overlay-button, .drx-overlay-input'));
                        Lampa.Controller.collectionFocus(input);
                    } catch (e) {
                    }
                }

                var localState = {
                    overlay: overlay,
                    resolve: resolve,
                    options: options,
                    input: input,
                    previousFocus: previousFocus,
                    trigger: function(action) {
                        var value = (input.value || '').trim();
                        if (action === 'save' && !value) {
                            action = options.allowEmpty ? 'save' : 'clear';
                        }
                        if (action === 'clear') value = '';
                        closeOverlay({ action: action, value: value });
                    }
                };

                localState.keyHandler = makeKeyHandler();
                localState.outsideHandler = makeOutsideHandler();
                state = localState;

                document.addEventListener('keydown', localState.keyHandler, true);
                document.addEventListener('click', localState.outsideHandler, true);

                overlay.querySelectorAll('[data-overlay-act]').forEach(function(node) {
                    node.addEventListener('click', function(evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        var action = node.getAttribute('data-overlay-act');
                        localState.trigger(action);
                    }, { passive: false });
                });

                buttons.forEach(function(btn) {
                    btn.addEventListener('mouseenter', function() {
                        btn.classList.add('focus');
                    });
                    btn.addEventListener('mouseleave', function() {
                        btn.classList.remove('focus');
                    });
                });

                setTimeout(function() {
                    overlay.removeAttribute('data-hidden');
                    input.focus();
                    input.select();
                }, 30);
            });
        }

        return {
            open: openOverlay,
            close: closeOverlay,
            isOpen: function() { return !!state; }
        };
    })();
    var ADVANCED_SCHEMA = {
        posterGlowIntensity: {
            storage: 'poster_glow_intensity',
            "default": 10,
            parse: function(value) {
                return clamp(parseInt(value, 10), 0, 60, 10);
            },
            serialize: function(value) {
                return value.toString();
            }
        },
        posterAnimationSpeed: {
            storage: 'poster_animation_speed',
            "default": 0.3,
            parse: function(value) {
                return clamp(parseFloat(value), 0.1, 1.5, 0.3);
            },
            serialize: function(value) {
                return value.toString();
            }
        },
        cardBackgroundOpacity: {
            storage: 'card_background_opacity',
            "default": 70,
            parse: function(value) {
                return clamp(parseInt(value, 10), 0, 100, 70);
            },
            serialize: function(value) {
                return value.toString();
            }
        },
        hoverScale: {
            storage: 'hover_scale',
            "default": 1.05,
            parse: function(value) {
                return clamp(parseFloat(value), 1, 1.3, 1.05);
            },
            serialize: function(value) {
                return value.toString();
            }
        },
        animationSpeed: {
            storage: 'animation_speed',
            "default": 0.3,
            parse: function(value) {
                return clamp(parseFloat(value), 0.1, 1, 0.3);
            },
            serialize: function(value) {
                return value.toString();
            }
        }
    };
    function buildAdvancedDefaults() {
        var base = {
            modalOpacity: 95,
            modalBlur: 50,
            modalRadius: 2,
            menuWidth: 20,
            menuOpacity: 95,
            menuBlur: 30,
            contrast: 100,
            brightness: 100,
            saturation: 100,
            hue: 0
        };
        Object.keys(ADVANCED_SCHEMA).forEach(function(key) {
            base[key] = ADVANCED_SCHEMA[key]["default"];
        });
        return base;
    }
    var advancedSettings = buildAdvancedDefaults();
    function clamp(value, min, max, fallback) {
        var num = parseFloat(value);
        if (isNaN(num)) num = fallback;
        if (typeof min === 'number') num = Math.max(min, num);
        if (typeof max === 'number') num = Math.min(max, num);
        return num;
    }
    function loadAdvancedSettings() {
        try {
            Object.keys(ADVANCED_SCHEMA).forEach(function(key) {
                var schema = ADVANCED_SCHEMA[key];
                var stored = Lampa.Storage.get(schema.storage);
                advancedSettings[key] = schema.parse(stored);
            });
        } catch(e) {
        }
    }
    function saveAdvancedSettings() {
        try {
            Object.keys(ADVANCED_SCHEMA).forEach(function(key) {
                var schema = ADVANCED_SCHEMA[key];
                var value = advancedSettings[key];
                Lampa.Storage.set(schema.storage, schema.serialize ? schema.serialize(value) : value);
            });
        } catch(e) {
        }
    }
    function setAdvancedSetting(key, rawValue) {
        if (!ADVANCED_SCHEMA[key]) return;
        advancedSettings[key] = ADVANCED_SCHEMA[key].parse(rawValue);
        saveAdvancedSettings();
        applyAdvancedSettings();
    }
    function applyAdvancedSettings() {
        try {
            performanceMonitor.start('applyAdvancedSettings');
            if (!window.jQuery || !window.$) return;
            applyModernHoverStyles();
            styleManager.removeStyle('drxaos-advanced-styles');
            styleManager.removeStyle('drxaos-poster-styles');
            styleManager.removeStyle('drxaos-hover-scale-styles');
            var s = advancedSettings;
            var cardOverlay = clamp(s.cardBackgroundOpacity, 0, 100, ADVANCED_SCHEMA.cardBackgroundOpacity["default"]) / 100;
            var glowPx = clamp(s.posterGlowIntensity, 0, 60, ADVANCED_SCHEMA.posterGlowIntensity["default"]);
            var hoverScale = clamp(s.hoverScale, 1, 1.3, ADVANCED_SCHEMA.hoverScale["default"]).toFixed(2);
            var animationSpeed = clamp(s.animationSpeed, 0.1, 1, ADVANCED_SCHEMA.animationSpeed["default"]);
            var baseCSS = `
                :root {
                    --drxaos-card-overlay: rgba(6, 8, 15, ${cardOverlay});
                }
                .modal, .modal__content {
                    border-radius: ${s.modalRadius}em !important;
                    background: rgba(10, 12, 20, ${s.modalOpacity / 100}) !important;
                }
                .menu {
                    width: ${s.menuWidth}em !important;
                    background: rgba(6, 8, 15, ${s.menuOpacity / 100}) !important;
                }
                .card__view {
                    background: var(--drxaos-card-overlay) !important;
                }
                .card__img img {
                    filter: contrast(${s.contrast}%) brightness(${s.brightness}%) saturate(${s.saturation}%) hue-rotate(${s.hue}deg) !important;
                }
                .card-more__box {
                    background: rgba(8, 10, 18, var(--drxaos-surface-opacity)) !important;
                    border: 2px solid rgba(255, 255, 255, 0.95) !important;
                    border-radius: 12px !important;
                    padding: 1.5em !important;
                }
                .card-more__title {
                    color: var(--text-main) !important;
                    font-weight: 700 !important;
                }
                .online-prestige {
                    background: rgba(8, 10, 18, var(--drxaos-surface-opacity)) !important;
                    border: 2px solid rgba(255, 255, 255, 0.95) !important;
                    border-radius: 12px !important;
                    padding: 1em !important;
                    transition: transform 0.3s ease !important;
                }
                .online-prestige.focus,
                .online-prestige:hover {
                    border-color: var(--theme-primary) !important;
                    box-shadow: 0 0 20px var(--theme-primary) !important;
                    transform: scale(1.02) !important;
                }
            `;
            var posterCSS = `
                body .card,
                body .card.card {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                }
                body .card .card__img,
                body .card .card__img img,
                body .card.card .card__img img {
                    background: transparent !important;
                    border-radius: 12px !important;
                    transition: border ${s.posterAnimationSpeed}s ease, box-shadow ${s.posterAnimationSpeed}s ease !important;
                    border: none !important;
                    outline: none !important;
                }
                body .card:hover .card__img,
                body .card.focus .card__img,
                body .card.card--focus .card__img {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
                }
                body .card.focus .card__img,
                body .card.card--focus .card__img {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
                }
                .card .card__view {
                    border-radius: 12px !important;
                }
            `;
            var hoverScaleCSS = `
                body .card {
                    transition: transform ${animationSpeed}s ease, box-shadow ${animationSpeed}s ease !important;
                }
                body .card:hover,
                body .card.hover,
                body .card.focus,
                body .card.card--focus {
                    transform: scale(${hoverScale}) translateZ(0) !important;
                }
            `;
            styleManager.setStyle('drxaos-advanced-styles', baseCSS);
            styleManager.setStyle('drxaos-poster-styles', posterCSS);
            styleManager.setStyle('drxaos-hover-scale-styles', hoverScaleCSS);
            performanceMonitor.end('applyAdvancedSettings');
            performanceMonitor.log('Advanced settings applied successfully');
        } catch(e) {
        }
    }
    loadAdvancedSettings();
'use strict';
Lampa.Lang.add({
drxaos_themes: { ru: 'DRXAOS Темы', en: 'DRXAOS Themes', uk: 'DRXAOS Теми' },
drxaos_theme: { ru: 'Цветовая схема', en: 'Color Scheme', uk: 'Кольорова схема' },
drxaos_animations: { ru: 'Анимации', en: 'Animations', uk: 'Анімації' },
drxaos_glow: { ru: 'Свечение', en: 'Glow', uk: 'Світіння' },
drxaos_theme_desc: { ru: 'Выберите цветовую схему интерфейса', en: 'Choose interface color scheme', uk: 'Виберіть кольорову схему інтерфейсу' },
drxaos_glow_desc: { ru: 'Интенсивность свечения карточек и кнопок при наведении', en: 'Intensity of cards and buttons glow on hover', uk: 'Інтенсивність світіння карток і кнопок при наведенні' },
drxaos_animations_desc: { ru: 'Плавные анимации при наведении (отключите на слабых устройствах)', en: 'Smooth animations on hover (disable on weak devices)', uk: 'Плавні анімації при наведенні (вимкніть на слабких пристроях)' },
drxaos_font_weight: { ru: 'Толщина шрифта', en: 'Font Weight', uk: 'Товщина шрифту' },
drxaos_font_weight_desc: { ru: 'Глобальная настройка толщины шрифта для всех тем', en: 'Global font weight setting for all themes', uk: 'Глобальне налаштування товщини шрифту для всіх тем' },
drxaos_font_family: { ru: 'Выбрать шрифт', en: 'Typeface', uk: 'Вибір шрифту' },
drxaos_font_family_desc: { ru: 'Глобальный выбор шрифта интерфейса', en: 'Select the global interface typeface', uk: 'Оберіть глобальний шрифт інтерфейсу' },
drxaos_quick_theme: { ru: 'Быстрый выбор темы', en: 'Quick Theme Selector', uk: 'Швидкий вибір теми' },
theme_midnight: { ru: '🌙 Полночь', en: '🌙 Midnight', uk: '🌙 Північ' },
theme_crimson: { ru: '🦎 Хамелеон', en: '🦎 Chameleon', uk: '🦎 Хамелеон' },
theme_red: { ru: '🟥 Red', en: '🟥 Red', uk: '🟥 Red' },
theme_ocean: { ru: '🌊 Океан', en: '🌊 Ocean', uk: '🌊 Океан' },
theme_forest: { ru: '🌲 Лес', en: '🌲 Forest', uk: '🌲 Ліс' },
theme_sunset: { ru: '🌅 Закат', en: '🌅 Sunset', uk: '🌅 Захід' },
theme_slate: { ru: '⚫ Грифель', en: '⚫ Slate', uk: '⚫ Грифель' },
theme_lavender: { ru: '💜 Лаванда', en: '💜 Lavender', uk: '💜 Лаванда' },
theme_emerald: { ru: '💚 Изумруд', en: '💚 Emerald', uk: '💚 Смарагд' },
theme_amber: { ru: '👾 Неоновый демон', en: '👾 Neon Demon', uk: '👾 Неоновий демон' },
drxaos_btn_play: { ru: 'Смотреть', en: 'Watch', uk: 'Дивитися' },
drxaos_btn_online: { ru: 'Онлайн', en: 'Online', uk: 'Онлайн' },
drxaos_btn_torrent: { ru: 'Торренты', en: 'Torrents', uk: 'Торренти' },
drxaos_btn_trailer: { ru: 'YouTube', en: 'YouTube', uk: 'YouTube' },
drxaos_btn_book: { ru: 'Избранное', en: 'Favorites', uk: 'Вибране' },
drxaos_btn_reaction: { ru: 'Реакции', en: 'Reactions', uk: 'Реакції' },
drxaos_btn_subscribe: { ru: 'Подписаться', en: 'Subscribe', uk: 'Підписатися' },
drxaos_btn_options: { ru: 'Опции', en: 'Options', uk: 'Опції' },
poster_glow_intensity: { ru: 'Интенсивность свечения', en: 'Glow Intensity', uk: 'Інтенсивність світіння' },
poster_glow_intensity_desc: { ru: 'Сила свечения обводок постеров', en: 'Poster border glow strength', uk: 'Сила світіння обведень постерів' },
animation_speed: { ru: 'Скорость анимации', en: 'Animation Speed', uk: 'Швидкість анімації' },
animation_speed_desc: { ru: 'Скорость анимации обводок', en: 'Border animation speed', uk: 'Швидкість анімації обведень' },
card_opacity: { ru: 'Прозрачность фона', en: 'Background Opacity', uk: 'Прозорість фону' },
card_opacity_desc: { ru: 'Прозрачность фона карточек', en: 'Card background opacity', uk: 'Прозорість фону карток' },
hover_scale: { ru: 'Масштаб при наведении', en: 'Hover Scale', uk: 'Масштаб при наведенні' },
hover_scale_desc: { ru: 'Увеличение карточки при наведении (отключено)', en: 'Card scaling on hover (disabled)', uk: 'Збільшення картки при наведенні (вимкнено)' },
global_animation_speed: { ru: '⚡ Скорость анимации', en: '⚡ Animation Speed', uk: '⚡ Швидкість анімації' },
global_animation_speed_desc: { ru: 'Глобальная скорость анимаций', en: 'Global animation speed', uk: 'Глобальна швидкість анімацій' },
reset_settings: { ru: '🔄 Сбросить настройки', en: '🔄 Reset Settings', uk: '🔄 Скинути налаштування' },
reset_settings_desc: { ru: 'Вернуть все настройки к значениям по умолчанию', en: 'Reset all settings to defaults', uk: 'Повернути всі налаштування до значень за замовчуванням' },
season_info: { ru: '📺 Информация о сезонах', en: '📺 Season Info', uk: '📺 Інформація про сезони' },
season_info_desc: { ru: 'Показывает прогресс сезонов (требует TMDB API)', en: 'Show season progress (requires TMDB API)', uk: 'Показує прогрес сезонів (потрібен TMDB API)' },
source_filter: { ru: '🔍 Фильтр источников', en: '🔍 Source Filter', uk: '🔍 Фільтр джерел' },
source_filter_desc: { ru: 'Показывает тип источника (Онлайн/Торрент)', en: 'Show source type (Online/Torrent)', uk: 'Показує тип джерела (Онлайн/Торент)' },
movie_quality: { ru: '🎯 Качество фильмов', en: '🎯 Movie Quality', uk: '🎯 Якість фільмів' },
movie_quality_desc: { ru: 'Показывает качество: 4K, FHD, HD, SD (требует JacRed)', en: 'Show quality: 4K, FHD, HD, SD (requires JacRed)', uk: 'Показує якість: 4K, FHD, HD, SD (потрібен JacRed)' },
tmdb_api_key_set: { ru: 'TMDB API: ', en: 'TMDB API: ', uk: 'TMDB API: ' },
tmdb_api_key_notset: { ru: 'TMDB API (не указан)', en: 'TMDB API (not set)', uk: 'TMDB API (не вказано)' },
tmdb_api_key_desc: { ru: 'Нажмите для ввода ключа. Получить: themoviedb.org/settings/api', en: 'Click to enter key. Get it: themoviedb.org/settings/api', uk: 'Натисніть для введення ключа. Отримати: themoviedb.org/settings/api' },
jacred_url_set: { ru: 'JacRed: ', en: 'JacRed: ', uk: 'JacRed: ' },
jacred_url_notset: { ru: 'JacRed URL (не указан)', en: 'JacRed URL (not set)', uk: 'JacRed URL (не вказано)' },
jacred_url_desc: { ru: 'Нажмите для ввода URL (без http://)', en: 'Click to enter URL (without http://)', uk: 'Натисніть для введення URL (без http://)' },
tmdb_prompt: { ru: 'Введите TMDB API ключ (32 символа):', en: 'Enter TMDB API key (32 characters):', uk: 'Введіть TMDB API ключ (32 символи):' },
tmdb_saved: { ru: '✅ TMDB API ключ сохранён: ', en: '✅ TMDB API key saved: ', uk: '✅ TMDB API ключ збережено: ' },
tmdb_removed: { ru: '🗑️ TMDB API ключ удалён', en: '🗑️ TMDB API key removed', uk: '🗑️ TMDB API ключ видалено' },
jacred_prompt: { ru: 'Введите JacRed URL (например: jacred.xyz):', en: 'Enter JacRed URL (e.g. jacred.xyz):', uk: 'Введіть JacRed URL (наприклад: jacred.xyz):' },
jacred_saved: { ru: '✅ JacRed URL сохранён: ', en: '✅ JacRed URL saved: ', uk: '✅ JacRed URL збережено: ' },
drxaos_overlay_save: { ru: 'Сохранить', en: 'Save', uk: 'Зберегти' },
drxaos_overlay_clear: { ru: 'Очистить', en: 'Clear', uk: 'Очистити' },
drxaos_overlay_cancel: { ru: 'Отмена', en: 'Cancel', uk: 'Скасувати' },
drxaos_overlay_tmdb_title: { ru: 'TMDB API ключ', en: 'TMDB API key', uk: 'TMDB API ключ' },
drxaos_overlay_tmdb_hint: { ru: 'Введите персональный ключ TMDB. Без него будет использоваться встроенный ключ.', en: 'Enter your personal TMDB key. Built-in key is used if left empty.', uk: 'Введіть власний ключ TMDB. Без нього використовується вбудований ключ.' },
drxaos_overlay_jacred_title: { ru: 'JacRed домен', en: 'JacRed domain', uk: 'JacRed домен' },
drxaos_overlay_jacred_hint: { ru: 'Укажите адрес без http:// или https://. Например: jacred.xyz', en: 'Specify address without http:// or https://. Example: jacred.xyz', uk: 'Вкажіть адресу без http:// чи https://. Наприклад: jacred.xyz' },
drxaos_overlay_jacred_placeholder: { ru: 'например: jacred.xyz', en: 'e.g. jacred.xyz', uk: 'наприклад: jacred.xyz' },
setting_off: { ru: 'Выключено', en: 'Off', uk: 'Вимкнено' },
setting_on: { ru: 'Включено', en: 'On', uk: 'Увімкнено' }
});
/* DRXAOS Themes — включение трех функций по умолчанию (embedded, first-run safe) */
(function(){ 'use strict';
  function whenReady(cb){
    if (window.Lampa && Lampa.Storage) cb();
    else setTimeout(function(){ whenReady(cb); }, 200);
  }
  whenReady(function(){
    try{
      var toggleKeys = ['season_info', 'source_filter', 'movie_quality'];
      toggleKeys.forEach(function(key){
        var current = normalizeToggle(Lampa.Storage.get(key));
        if (current === 'unset') current = 'on';
        Lampa.Storage.set(key, current);

        var legacyKey = 'drxaos_' + key;
        var legacyValue = normalizeToggle(Lampa.Storage.get(legacyKey));
        if (legacyValue === 'unset') {
          Lampa.Storage.set(legacyKey, current);
        } else {
          Lampa.Storage.set(legacyKey, legacyValue);
        }
      });
      if (typeof window.drxaosApplyAll === 'function') window.drxaosApplyAll();
      else window.drxaosPostDefaultsQueue.push('apply');
      // Сообщим окружению о возможном изменении настроек
      if (Lampa.Listener && Lampa.Listener.send){
        Lampa.Listener.send('settings:updated', { name: 'drxaos_themes', source: 'defaults' });
      }
      var bootstrapFlag = Lampa.Storage.get('drxaos_bootstrap_done');
      if (!bootstrapFlag) {
        Lampa.Storage.set('drxaos_bootstrap_done', '1');
        setTimeout(function(){ location.reload(); }, 300);
      }
    }catch(e){}
  });
  function normalizeToggle(value){
    if (value === undefined || value === null || value === '') return 'unset';
    if (value === 'on' || value === 'off') return value;
    if (typeof value === 'boolean') return value ? 'on' : 'off';
    var str = String(value).trim().toLowerCase();
    if (str === 'true' || str === '1' || str === 'yes') return 'on';
    if (str === 'false' || str === '0' || str === 'no') return 'off';
    return 'unset';
  }
})();
(function(){ 'use strict';
  function whenReady(cb){
    if (window.Lampa && Lampa.SettingsApi) cb();
    else setTimeout(function(){ whenReady(cb); }, 200);
  }
  whenReady(function(){
    try{
      if (Lampa.SettingsApi.__drxaosWrapped) return;
      var originalAddParam = Lampa.SettingsApi.addParam;
      Lampa.SettingsApi.addParam = function(cfg){
        if (cfg && cfg.component === 'drxaos_themes') {
          var originalChange = cfg.onChange;
          cfg.onChange = function() {
            try {
              if (typeof originalChange === 'function') {
                originalChange.apply(this, arguments);
              }
            } finally {
              scheduleDrxaosApplyAll();
            }
          };
        }
        return originalAddParam.call(this, cfg);
      };
      Lampa.SettingsApi.__drxaosWrapped = true;
    } catch(e) {
      logError('Error wrapping SettingsApi.addParam', e);
    }
  });
})();
var prevtheme = '';
var applyTheme = debounce(function(theme) {
    applyThemeImmediate(theme);
}, CONFIG.PERFORMANCE.DEBOUNCE_DELAY);
function applyThemeImmediate(theme) {
    try {
        if (!window.jQuery || !window.$) {
            logError('jQuery не загружен');
            return;
        }
        if (theme === 'darkred') {
            theme = 'red';
            try { Lampa.Storage.set('drxaos_theme', 'red'); } catch(e) {}
        }
        log('Применение темы:', theme);
styleManager.removeStyle('drxaos_theme_style');
prevtheme = theme;
    var commonStyles = `/* ЦЕНТРИРОВАНИЕ ИКОНКИ PLAY + ЦВЕТ ТЕМЫ */
.card__icons{position:absolute!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;z-index:5!important}
.card__icons-inner{display:flex!important;align-items:center!important;justify-content:center!important}
.card__icon{margin:0!important;color:rgb(var(--primary-rgb))!important;filter:drop-shadow(0 0 8px rgba(var(--primary-rgb),0.8))!important}
.icon--play{color:rgb(var(--primary-rgb))!important}
.icon--play svg,.card__icon svg{fill:rgb(var(--primary-rgb))!important;stroke:rgb(var(--primary-rgb))!important}
/* ПЛАШКИ НА КАРТОЧКАХ - ЦВЕТ ТЕМЫ */
body .card__type,body .card--content-type,body .card--country,body .card--season-progress,body .card--season-complete{background:rgba(var(--primary-rgb),0.9)!important;color:#fff!important}
body .card-quality{background:#000000!important;color:#ffd369!important;text-shadow:0 1px 2px rgba(0,0,0,0.8)!important}
body .card-quality.camrip{background:#ef4444!important;color:#ffffff!important}
body .card-next-episode{background:rgba(var(--primary-rgb),0.85)!important;color:#fff!important}

body .card__type,
body .full-start__rate,
body .full-start-new__rate{
    background:linear-gradient(145deg,
        rgba(var(--drxaos-triad-a-rgb),0.55),
        rgba(var(--drxaos-triad-c-rgb),0.2))!important;
    border:2px solid rgba(192,192,192,0.3)!important;
    color:var(--drxaos-text-primary)!important;
    box-shadow:none!important;
    text-shadow:none!important;
}
body .card__rate{
    background:#000000!important;
    color:#ffd369!important;
    text-shadow:0 1px 2px rgba(0,0,0,0.8)!important;
}
body .card__quality{
    background:#000000!important;
    color:#ffd369!important;
    text-shadow:0 1px 2px rgba(0,0,0,0.8)!important;
}
body .card__vote{
    background:#000000!important;
    border-color:#000000!important;
    color:#ffd369!important;
    text-shadow:0 1px 2px rgba(0,0,0,0.8);
}
body .card__age,
body .card__age.drxaos-age-moved{
    background:#000000!important;
    border-color:#000000!important;
    color:#ffffff!important;
}
body .full-start__tags>*,body .full-start-new__tags>*{background:rgba(var(--primary-rgb),0.85)!important;color:#fff!important}
body .full-start__rate.rate--tomatoes,
body .full-start__rate.rate--tomatoes span{color:#d97767!important}
body .full-start__rate.rate--tomatoes_bad,
body .full-start__rate.rate--tomatoes_bad span{color:#b36859!important}
body .full-start__rate.rate--popcorn,
body .full-start__rate.rate--popcorn span{color:#d9be73!important}
body .full-start__rate.rate--imdb,
body .full-start__rate.rate--imdb span{color:#d6b957!important}
body .full-start__rate.rate--tmdb,
body .full-start__rate.rate--tmdb span{color:#7fb8c9!important}
body .full-start__rate.rate--metacritic,
body .full-start__rate.rate--metacritic span{color:#d6b862!important}
:root {
    --perf-blur: none;
    --perf-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    --perf-transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --perf-backdrop: none;
    --perf-transform: translateZ(0);
    --drxaos-triad-a-rgb: 46, 52, 64;
    --drxaos-triad-b-rgb: 64, 46, 52;
    --drxaos-triad-c-rgb: 52, 64, 46;
    --drxaos-text-primary: #E0E0E0;
    --drxaos-text-secondary: #B0B0B0;
}
@media (max-width: 1366px) and (max-height: 768px) {
    :root {
        --perf-blur: blur(10px);
        --perf-shadow: 0 2px 8px rgba(0, 0, 0, var(--drxaos-surface-opacity));
        --perf-transition: transform 0.2s ease, opacity 0.2s ease;
        --perf-backdrop: blur(10px);
    }
}
@media (pointer: coarse) and (hover: none), 
       (max-width: 1920px) and (min-width: 1280px) and (orientation: landscape) {
    :root {
        --perf-blur: none;
        --perf-shadow: 0 2px 4px rgba(0, 0, 0, var(--drxaos-surface-opacity));
        --perf-transition: none;
        --perf-backdrop: none;
        --perf-transform: none;
    }
}
@media (min-width: 1920px) and (pointer: coarse) {
    :root {
        --perf-blur: none;
        --perf-shadow: 0 1px 3px rgba(0, 0, 0, var(--drxaos-surface-opacity));
        --perf-transition: none;
        --perf-backdrop: none;
    }
}
@font-face {
    font-family: 'Netflix Sans';
    font-weight: 100;
    src: url('https://assets.nflxext.com/ffe/siteui/fonts/netflix-sans/v3/NetflixSans_W_Th.woff2') format('woff2');
}
@font-face {
    font-family: 'Netflix Sans';
    font-weight: 300;
    src: url('https://assets.nflxext.com/ffe/siteui/fonts/netflix-sans/v3/NetflixSans_W_Lt.woff2') format('woff2');
}
@font-face {
    font-family: 'Netflix Sans';
    font-weight: 400;
    src: url('https://assets.nflxext.com/ffe/siteui/fonts/netflix-sans/v3/NetflixSans_W_Rg.woff2') format('woff2');
}
@font-face {
    font-family: 'Netflix Sans';
    font-weight: 700;
    src: url('https://assets.nflxext.com/ffe/siteui/fonts/netflix-sans/v3/NetflixSans_W_Bd.woff2') format('woff2');
}
:root {
    --netflix-radius-sm: 8px;
    --netflix-radius-md: 12px;
    --netflix-radius-lg: 16px;
    --netflix-radius-xl: 20px;
    --netflix-shadow-sm: 0 2px 8px rgba(0, 0, 0, var(--drxaos-surface-opacity));
    --netflix-shadow-md: 0 4px 16px rgba(0, 0, 0, var(--drxaos-surface-opacity));
    --netflix-shadow-lg: 0 8px 32px rgba(0, 0, 0, var(--drxaos-surface-opacity));
    --netflix-transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --netflix-glass: rgba(20, 20, 20, 0.95);
    --netflix-glass-border: rgba(255, 255, 255, 0.95);
}
.card-more__box {
    background: rgba(var(--layer-rgb), var(--drxaos-surface-opacity)) !important;
    border: 2px solid var(--theme-primary, #5a3494) !important;
    border-radius: 1em !important;
    filter: saturate(180%) !important;
    -webkit-filter: saturate(180%) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    padding: 1em !important;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.card-more__box:hover,
.card-more__box.focus {
    background: var(--theme-primary, #5a3494) !important;
    border: 2px solid var(--theme-accent, #0088bb) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    transform: scale(1.02) !important;
}
.card-more__title {
    color: var(--text-main, #ffffff) !important;
    font-family: var(--drxaos-font-family) !important;
    font-weight: 600 !important;
    text-align: center !important;
}
.online-prestige {
    background: var(--drxaos-bg-color) !important;
    border: 2px solid var(--drxaos-accent-color) !important;
    border-radius: 12px !important;
    padding: 1em !important;
    transition: transform 0.3s ease !important, opacity 0.3s ease !important;
}
.online-prestige.focus,
.online-prestige:hover {
    border-color: var(--drxaos-accent-color) !important;
    box-shadow: 0 0 20px var(--drxaos-accent-color) !important;
    transform: scale(1.02) !important;
}
.online-prestige__img {
    border-radius: 8px !important;
    overflow: hidden !important;
}
.online-prestige__title,
.online-prestige__info,
.online-prestige__footer {
    color: var(--drxaos-text-color) !important;
    font-family: var(--drxaos-font-family) !important;
}
body {
    background: #141414 !important;
    background: linear-gradient(135deg, #141414 0%, #0a0a0a 100%) !important;
}

.app {
    background: #141414 !important;
}

.app__default {
    background: transparent !important;
}

body .card, .card {
    background: transparent !important;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    overflow: visible !important;
    transition: var(--netflix-transition) !important;
}
body .card:hover,
body .card.focus,
body .card.hover {
    transform: var(--perf-transform) !important;
    z-index: 999 !important;
    position: relative !important;
}
body:not(.drxaos-buttons-ready) .full-start__buttons .full-start__button:not(.drxaos-btn),
body:not(.drxaos-buttons-ready) .full-start-new__buttons .full-start__button:not(.drxaos-btn) {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
}
body .full-start__buttons:not(.drxaos-buttons-unwrapped) .full-start__button,
body .full-start-new__buttons:not(.drxaos-buttons-unwrapped) .full-start__button {
    opacity: 0 !important;
    pointer-events: none !important;
    visibility: hidden !important;
}
body:not(.drxaos-buttons-ready) .full-start__buttons .full-start__button,
body:not(.drxaos-buttons-ready) .full-start-new__buttons .full-start__button {
    opacity: 0 !important;
    pointer-events: none !important;
}
body.drxaos-buttons-ready .full-start__buttons .full-start__button,
body.drxaos-buttons-ready .full-start-new__buttons .full-start__button {
    opacity: 1 !important;
}
body .card__view,
.card__view {
    border-radius: 12px !important;
    overflow: hidden !important;
    background: transparent !important;
    border: none !important;
}
body .card__img,
.card__img {
    border-radius: 12px !important;
    overflow: hidden !important;
}
body .card__img img,
.card__img img {
    border-radius: 12px !important;
}
body .card:hover .card__view,
body .card.focus .card__view,
body .card.hover .card__view {
    box-shadow: var(--perf-shadow) !important;
}
body .card .card__view {
    position: relative !important;
}
body .card .card__view::after {
    content: '' !important;
    position: absolute !important;
    inset: 0 !important;
    border-radius: inherit !important;
    border: 4px solid transparent !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    opacity: 0 !important;
    pointer-events: none !important;
    transition: border var(--perf-transition), box-shadow var(--perf-transition), opacity var(--perf-transition) !important;
    z-index: 5 !important;
}
body .card:hover .card__img,
body .card.focus .card__img,
body .card.hover .card__img {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
body .card.focus .card__img,
body .card.card--focus .card__img {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
body .card:hover .card__view::after,
body .card.focus .card__view::after,
body .card.hover .card__view::after {
    border-color: rgba(var(--primary-rgb), 0.995) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    opacity: 1 !important;
}
body .card.focus .card__view::after,
body .card.card--focus .card__view::after {
    border-color: rgba(var(--secondary-rgb), 0.995) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
body .settings-param, .settings-param,
body .settings-folder, .settings-folder {
    background: rgba(var(--bg-rgb, 12, 12, 12), var(--drxaos-surface-opacity)) !important;
    border: 1px solid rgba(255, 255, 255, 0.95) !important;
    border-radius: var(--netflix-radius-md) !important;
    padding: 1em 1.2em !important;
    margin: 0.4em 0 !important;
    transition: var(--perf-transition) !important;
    backdrop-filter: var(--perf-backdrop) !important;
    -webkit-backdrop-filter: var(--perf-backdrop) !important;
    box-shadow: var(--perf-shadow) !important;
}
body .settings-param.focus, body .settings-param:hover,
body .settings-folder.focus, body .settings-folder:hover {
    background: rgba(var(--primary-rgb), 0.25) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.55) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    transform: var(--perf-transform) !important;
}
body .settings-param.focus *, body .settings-param:hover *,
body .settings-folder.focus *, body .settings-folder:hover * {
    color: var(--text-main) !important;
}
body .selectbox-item, .selectbox-item {
    background: transparent !important;
    border: none !important;
    border-bottom: 1px solid rgba(var(--primary-rgb), 0.2) !important;
    border-radius: 0 !important;
    padding: 0.8em 1em !important;
    margin: 0 !important;
    transition: background 0.2s ease !important;
}
body .selectbox-item.focus, body .selectbox-item:hover {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-bottom: 1px solid var(--theme-accent) !important;
    box-shadow: none !important;
}
body .selectbox-item__poster, .selectbox-item__poster { display: none !important; }
body .selectbox-item__icon, .selectbox-item__icon { 
    display: inline-block !important; 
    width: 24px !important;
    height: 24px !important;
    margin-right: 12px !important;
    vertical-align: middle !important;
    flex-shrink: 0 !important;
}
body .selectbox-item__title, .selectbox-item__title {
    font-size: 1.1em !important;
    line-height: 1.3 !important;
    padding: 0 !important;
}
body .selectbox-item__subtitle, .selectbox-item__subtitle {
    font-size: 0.995em !important;
    margin-top: 0.3em !important;
    opacity: 0.95 !important;
}
body .torrent-serial, .torrent-serial {
    display: flex !important;
    flex-direction: row !important;
    align-items: flex-start !important;
    gap: 1em !important;
    background: rgba(255, 255, 255, 0.03) !important; 
    border: 1px solid rgba(255, 255, 255, 0.95) !important; 
    border-radius: 0.5em !important; 
    padding: 1em !important;
    margin: 0.5em 0 !important; 
    min-height: 140px !important;
    transition: transform 0.2s ease !important, opacity 0.2s ease !important;
}
/* ЧЕРНАЯ ТОЛСТАЯ ОБВОДКА С УМЕНЬШЕНИЕМ + ЧЕРНЫЙ ТЕКСТ */
body .torrent-serial:hover, .torrent-serial:hover,
body .torrent-serial.focus, .torrent-serial.focus,
body .torrent-serial.selector:hover,
body .torrent-serial.selector.focus {
    border: 4px solid rgba(0, 0, 0, 0.95) !important;
    border-color: rgba(0, 0, 0, 0.95) !important;
    background: rgba(255, 255, 255, 0.95) !important;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.7) !important;
    transform: translateZ(0) scale(0.98) !important;
    outline: 3px solid rgba(0, 0, 0, 0.9) !important;
    outline-offset: 1px !important;
    color: #000 !important;
}

/* Чёрный текст для вложенных элементов */
body .torrent-serial:hover *,
body .torrent-serial.focus *,
body .torrent-serial.selector:hover *,
body .torrent-serial.selector.focus * {
    color: #000 !important;
}


/* Обычное состояние торрент-файлов - БЕЗ БЕЛОЙ ГРАНИЦЫ */
body .torrent-serial,
body .torrent-serial.selector,
.torrent-serial,
.torrent-serial.selector {
    border: 1px solid transparent !important;
    border-color: transparent !important;
    transition: all 0.2s ease !important;
}

/* Дополнительно для .selector класса */
/* Стили .selector объединены с общими выше */

body .torrent-serial__img, .torrent-serial__img {
    height: 120px !important;
    object-fit: cover !important;
    border-radius: 0.3em !important;
    flex-shrink: 0 !important;
}
body .torrent-serial__content, .torrent-serial__content {
    flex: 1 !important;
    padding: 0 !important;
    min-width: 0 !important;
}
body .tracks-metainfo, .tracks-metainfo,
body .torrent-files, .torrent-files {
    margin-top: 0.5em !important;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
}
body .tracks-metainfo__item, .tracks-metainfo__item {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important; 
    align-items: center !important;
    gap: 0.3em !important;
    padding: 0.4em 0.6em !important;
    margin: 0 !important;
    font-size: 0.9em !important;
    background: transparent !important;
    border: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 0 !important;
    min-height: 2em !important;
    max-height: 3em !important;
    overflow: hidden !important;
    line-height: 1.3 !important;
}
body .tracks-metainfo__column--num, .tracks-metainfo__column--num,
body .tracks-metainfo__column--lang, .tracks-metainfo__column--lang,
body .tracks-metainfo__column--name, .tracks-metainfo__column--name,
body .tracks-metainfo__column--codec, .tracks-metainfo__column--codec,
body .tracks-metainfo__column--channels, .tracks-metainfo__column--channels,
body .tracks-metainfo__column--rate, .tracks-metainfo__column--rate,
body [class*="tracks-metainfo__column"], [class*="tracks-metainfo__column"] {
    display: inline-block !important;
    padding: 0.2em 0.4em !important;
    margin: 0 !important;
    font-size: 0.85em !important;
    white-space: nowrap !important;
    background: rgba(255, 255, 255, 0.05) !important;
    border-radius: 0.2em !important;
    flex-shrink: 0 !important;
}
body .torrent-files__title, .torrent-files__title,
body .tracks-metainfo__title, .tracks-metainfo__title {
    font-size: 1em !important;
    padding: 0.5em 0 !important;
    margin: 0 !important;
    opacity: 0.95 !important;
}
body .torrent-serial .scroll__body, .torrent-serial .scroll__body {
    padding: 0 !important;
}
body .tracks-metainfo__line, .tracks-metainfo__line {
    display: flex !important;
    align-items: center !important;
    gap: 0.5em !important;
    padding: 0.4em 0.6em !important;
    margin: 0.2em 0 !important;
    font-size: 0.9em !important;
background: transparent !important;
border: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: 0 !important;
}
body .torrent-file, .torrent-file {
    display: block !important;
    background: transparent !important;
    border: none !important;
    border-bottom: 1px solid rgba(var(--primary-rgb), 0.15) !important;
    border-radius: 0 !important;
    padding: 0.6em 0.8em !important;
    margin: 0 !important;
    transition: background 0.2s ease !important;
    padding-bottom: 0.6em !important; 
    align-items: flex-start !important; 
}
body .torrent-file + .torrent-file, .torrent-file + .torrent-file {
    margin-top: 0 !important;
}
body .torrent-file.focus, body .torrent-file:hover,
body .torrent-file.focus::after, body .torrent-file:hover::after {
    background: rgba(var(--primary-rgb), 0.15) !important;
    border-bottom: 1px solid var(--theme-accent) !important;
    box-shadow: none !important;
    border: none !important; 
}
body .torrent-file__title, .torrent-file__title {
    font-size: 1.1em !important;
    line-height: 1.3 !important;
    padding-right: 0.5em !important;
}
body .torrent-file__quality, .torrent-file__quality {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 0.3em !important;
    margin-top: 0.4em !important;
    align-items: center !important;
}
body .torrent-file__quality > *, .torrent-file__quality > * {
    display: inline-block !important;
    font-size: 0.8em !important;
    padding: 0.25em 0.5em !important;
    margin: 0 !important;
    border-radius: 0.25em !important;
    background: rgba(var(--primary-rgb), 0.25) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.35) !important;
white-space: nowrap !important;
    line-height: 1.2 !important;
}
body .torrent-file__size, .torrent-file__size {
    font-size: 1em !important;
    padding: 0.3em 0.5em !important;
border-radius: 0.3em !important;
    background: rgba(var(--primary-rgb), 0.3) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.4) !important;
}
body .files__item, .files__item,
body .torrent-item, .torrent-item {
background: transparent !important;
border: none !important;
    border-bottom: 1px solid rgba(var(--primary-rgb), 0.2) !important;
border-radius: 0 !important;
    padding: 0.5em 0.8em !important;
    margin: 0 !important;
    transition: background 0.2s ease !important;
}
body .files__item.focus, body .files__item:hover,
body .torrent-item.focus, body .torrent-item:hover {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-bottom: 1px solid var(--theme-accent) !important;
box-shadow: none !important;
}
body .menu:not(.menu--bottom) {
    display: inline-flex !important;
    flex-direction: column !important;
    gap: 0.4em !important;
    align-items: flex-start !important;
    width: fit-content !important;
    min-width: 0 !important;
    max-width: none !important;
    padding: 0.65em 0.8em !important;
    margin: 0 !important;
    border-radius: 18px !important;
    background: rgba(var(--primary-rgb, 40, 44, 52), 0.18) !important;
    border: 1px solid rgba(var(--primary-rgb, 40, 44, 52), 0.32) !important;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.34) !important;
    backdrop-filter: var(--perf-backdrop, none) !important;
    overflow: visible !important;
    box-sizing: border-box !important;
}
@media (max-width: 768px) {
    body .menu:not(.menu--bottom) {
        width: 100% !important;
        max-width: none !important;
        border-radius: 18px !important;
        padding: 0.85em !important;
    }
}
.menu:not(.menu--bottom) .menu__case {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.45em !important;
    width: auto !important;
    align-items: flex-start !important;
}
.menu:not(.menu--bottom) .menu__list {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.4em !important;
    width: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    list-style: none !important;
}
.menu:not(.menu--bottom) .menu__split {
    width: 100% !important;
    height: 1px !important;
    background: rgba(var(--primary-rgb, 40, 44, 52), 0.28) !important;
    border-radius: 999px !important;
    margin: 0.15em 0 !important;
    opacity: 0.5 !important;
}
.menu:not(.menu--bottom) .menu__item {
    position: relative !important;
    background: rgba(var(--bg-rgb, 15, 18, 26), 0.82) !important;
    border: 1px solid rgba(var(--primary-rgb, 40, 44, 52), 0.36) !important;
    border-radius: 12px !important;
    padding: 0.55em 0.85em !important;
    margin: 0 !important;
    transition: transform 0.22s ease !important, box-shadow 0.22s ease !important, background 0.22s ease !important, border-color 0.22s ease !important;
    filter: saturate(160%) !important;
    -webkit-filter: saturate(160%) !important;
    width: auto !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
    box-sizing: border-box !important;
    min-height: 0 !important;
    overflow: visible !important;
    flex: 0 0 auto !important;
    white-space: nowrap !important;
    color: var(--text-main, #f1f5f9) !important;
}
.menu:not(.menu--bottom) .menu__item.focus, .menu:not(.menu--bottom) .menu__item:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb, 40, 44, 52), 0.55), rgba(var(--secondary-rgb, 68, 82, 120), 0.52)) !important;
    border-color: rgba(var(--primary-rgb, 40, 44, 52), 0.6) !important;
    box-shadow: 0 10px 26px rgba(0, 0, 0, 0.45) !important;
    transform: translateY(-2px) !important;
}
.menu:not(.menu--bottom) .menu__ico {
    flex: 0 0 auto !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 1.8em !important;
    height: 1.8em !important;
    margin-right: 0.6em !important;
}
.menu:not(.menu--bottom) .menu__ico svg {
    width: 100% !important;
    height: 100% !important;
    fill: currentColor !important;
    stroke: currentColor !important;
}
.menu:not(.menu--bottom) .menu__text {
    flex: 1 1 auto !important;
    display: block !important;
    color: inherit !important;
    font-size: 1em !important;
    font-weight: 600 !important;
    white-space: nowrap !important;
    text-overflow: ellipsis !important;
    overflow: visible !important;
}
.menu:not(.menu--bottom) .menu__item,
.menu:not(.menu--bottom) .menu__item *,
.menu:not(.menu--bottom) .menu__ico svg,
.menu:not(.menu--bottom) .menu__ico svg path,
.menu:not(.menu--bottom) .menu__ico svg use {
    color: var(--text-main, #f1f5f9) !important;
    fill: currentColor !important;
    stroke: currentColor !important;
}
.card__quality, .card__quality *, .card__type::after,
.head__action.focus, .head__action.focus *,
.head__action:hover, .head__action:hover *,
.menu__item.focus, .menu__item.focus *,
.menu__item:hover, .menu__item:hover *,
.settings-param.focus, .settings-param.focus *,
.settings-param:hover, .settings-param:hover *,
.files__item.focus, .files__item.focus *,
.files__item:hover, .files__item:hover *,
.torrent-item.focus, .torrent-item.focus *,
.torrent-item:hover, .torrent-item:hover *,
.filter__item.focus, .filter__item.focus *,
.filter__item:hover, .filter__item:hover *,
.sort__item.focus, .sort__item.focus *,
.sort__item:hover, .sort__item:hover *,
.selectbox-item.focus, .selectbox-item.focus *,
.selectbox-item:hover, .selectbox-item:hover *,
.online__item.focus, .online__item.focus *,
.online__item:hover, .online__item:hover *,
.online__item-line.focus, .online__item-line.focus *,
.online__item-line:hover, .online__item-line:hover *,
.online-prestige__item.focus, .online-prestige__item.focus *,
.online-prestige__item:hover, .online-prestige__item:hover *,
.online-prestige__line.focus, .online-prestige__line.focus *,
.online-prestige__line:hover, .online-prestige__line:hover *,
.online__tabs-item.focus, .online__tabs-item.focus *,
.online__tabs-item:hover, .online__tabs-item:hover *,
.card.focus, .card.focus *,
.card:hover, .card:hover * {
    text-shadow: none !important;
}
@media (max-width: 768px), (hover: none), (pointer: coarse) {
    @keyframes navigation-pulse {
        0%, 100% {
            color: var(--theme-primary) !important;
            opacity: 0.95 !important;
        }
        50% {
            color: var(--theme-accent) !important;
            opacity: 1 !important;
        }
    }
    @-webkit-keyframes navigation-pulse {
        0%, 100% {
            color: var(--theme-primary) !important;
            opacity: 0.95 !important;
        }
        50% {
            color: var(--theme-accent) !important;
            opacity: 1 !important;
        }
    }
    body.true--mobile .navigation-bar,
    body.true--mobile .navigation-bar.navigation-bar,
    body .navigation-bar,
    .navigation-bar,
    .navigation-bar.navigation-bar {
        background: #000000 !important;
        background-color: #000000 !important;
        opacity: 0.95 !important;
        filter: saturate(180%) !important;
        -webkit-filter: saturate(180%) !important;
        border-top: 2px solid rgba(var(--primary-rgb), 0.6) !important;
        border-radius: 0 !important;
        padding: 0.5em 0 !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    }
    body.true--mobile .navigation-bar__body,
    body .navigation-bar__body,
    .navigation-bar__body {
        background: transparent !important;
        background-color: transparent !important;
    }
    body.true--mobile .navigation-bar__item,
    body.true--mobile .navigation-bar__item.navigation-bar__item,
    body .navigation-bar__item,
    .navigation-bar__item,
    .navigation-bar__item.navigation-bar__item {
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        border-radius: 0.8em !important;
        padding: 0.8em 1em !important;
        margin: 0.2em !important;
        transition: transform 0.3s ease !important, opacity 0.3s ease !important;
        color: rgba(255, 255, 255, 0.95) !important;
    }
    body.true--mobile .navigation-bar__item.focus,
    body.true--mobile .navigation-bar__item:active,
    body.true--mobile .navigation-bar__item.selector,
    body.true--mobile .navigation-bar__item.selector.focus,
    body .navigation-bar__item.focus,
    .navigation-bar__item.focus,
    .navigation-bar__item:active,
    .navigation-bar__item.selector,
    .navigation-bar__item.selector.focus {
        background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.7), rgba(var(--secondary-rgb), 0.6)) !important;
        background-color: transparent !important;
        border-bottom: 3px solid var(--theme-accent) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
        color: #ffffff !important;
        transform: translateY(-2px) !important;
    }
    body.true--mobile .navigation-bar__item svg,
    body.true--mobile .navigation-bar__item svg path,
    body.true--mobile .navigation-bar__item svg circle,
    body .navigation-bar__item svg,
    body .navigation-bar__item svg path,
    body .navigation-bar__item svg circle,
    .navigation-bar__item svg,
    .navigation-bar__item svg path,
    .navigation-bar__item svg circle {
        animation: navigation-pulse 2.5s ease-in-out infinite !important;
        -webkit-animation: navigation-pulse 2.5s ease-in-out infinite !important;
        fill: currentColor !important;
        stroke: currentColor !important;
    }
}
.settings-param:hover, .settings-param:focus, .settings-param.focus, .settings-param.hover,
.menu__item:hover, .menu__item:focus, .menu__item.focus, .menu__item.hover,
.files__item:hover, .files__item:focus, .files__item.focus, .files__item.hover,
.torrent-item:hover, .torrent-item:focus, .torrent-item.focus, .torrent-item.hover,
.filter__item:hover, .filter__item:focus, .filter__item.focus, .filter__item.hover,
.sort__item:hover, .sort__item:focus, .sort__item.focus, .sort__item.hover,
.selectbox-item:hover, .selectbox-item:focus, .selectbox-item.focus, .selectbox-item.hover,
.online__item:hover, .online__item:focus, .online__item.focus, .online__item.hover,
.online__item-line:hover, .online__item-line:focus, .online__item-line.focus, .online__item-line.hover,
.online-prestige__item:hover, .online-prestige__item:focus, .online-prestige__item.focus, .online-prestige__item.hover,
.online-prestige__line:hover, .online-prestige__line:focus, .online-prestige__line.focus, .online-prestige__line.hover,
.online__tabs-item:hover, .online__tabs-item:focus, .online__tabs-item.focus, .online__tabs-item.hover,
.full-start__button:hover, .full-start__button:focus, .full-start__button.focus, .full-start__button.hover,
.head__action:hover, .head__action:focus, .head__action.focus, .head__action.hover,
.bottom-bar__item:hover, .bottom-bar__item:focus, .bottom-bar__item.focus, .bottom-bar__item.hover,
.bottom-bar__btn:hover, .bottom-bar__btn:focus, .bottom-bar__btn.focus, .bottom-bar__btn.hover,
.settings-folder:hover, .settings-folder:focus, .settings-folder.focus, .settings-folder.hover,
.drxaos-theme-quick-btn:hover, .drxaos-theme-quick-btn:focus, .drxaos-theme-quick-btn.focus, .drxaos-theme-quick-btn.hover,
.button:hover, .button:focus, .button.focus, .button.hover,
.settings-param:hover, .settings-param:focus, .settings-param.focus, .settings-param.hover {
    text-shadow: none !important;
}
.button, .button *, .settings-param, .settings-param *,
.menu__item, .menu__item *,
.full-start__button, .full-start__button * {
    font-weight: inherit !important;
    text-shadow: none !important;
}
*:hover, *:focus, *.focus, *.hover {
    transform: none !important;
}
.settings-param:hover *, .settings-param:focus *, .settings-param.focus *, .settings-param.hover *,
.menu__item:hover *, .menu__item:focus *, .menu__item.focus *, .menu__item.hover *,
.files__item:hover *, .files__item:focus *, .files__item.focus *, .files__item.hover *,
.torrent-item:hover *, .torrent-item:focus *, .torrent-item.focus *, .torrent-item.hover *,
.filter__item:hover *, .filter__item:focus *, .filter__item.focus *, .filter__item.hover *,
.sort__item:hover *, .sort__item:focus *, .sort__item.focus *, .sort__item.hover *,
.selectbox-item:hover *, .selectbox-item:focus *, .selectbox-item.focus *, .selectbox-item.hover *,
.online__item:hover *, .online__item:focus *, .online__item.focus *, .online__item.hover *,
.online__item-line:hover *, .online__item-line:focus *, .online__item-line.focus *, .online__item-line.hover *,
.online-prestige__item:hover *, .online-prestige__item:focus *, .online-prestige__item.focus *, .online-prestige__item.hover *,
.online-prestige__line:hover *, .online-prestige__line:focus *, .online-prestige__line.focus *, .online-prestige__line.hover *,
.online__tabs-item:hover *, .online__tabs-item:focus *, .online__tabs-item.focus *, .online__tabs-item.hover *,
.full-start__button:hover *, .full-start__button:focus *, .full-start__button.focus *, .full-start__button.hover *,
.head__action:hover *, .head__action:focus *, .head__action.focus *, .head__action.hover *,
.bottom-bar__item:hover *, .bottom-bar__item:focus *, .bottom-bar__item.focus *, .bottom-bar__item.hover *,
.bottom-bar__btn:hover *, .bottom-bar__btn:focus *, .bottom-bar__btn.focus *, .bottom-bar__btn.hover *,
.settings-folder:hover *, .settings-folder:focus *, .settings-folder.focus *, .settings-folder.hover *,
.drxaos-theme-quick-btn:hover *, .drxaos-theme-quick-btn:focus *, .drxaos-theme-quick-btn.focus *, .drxaos-theme-quick-btn.hover * {
    text-shadow: none !important;
}
*[style*="color: #000000"], *[style*="color:#000000"], 
*[style*="color: #001a1f"], *[style*="color:#001a1f"],
*[style*="color: #0a0a0a"], *[style*="color:#0a0a0a"],
*[style*="color: var(--text-contrast)"], 
.card__quality, .card__quality *, .card__type::after,
.head__action, .head__action *,
.menu__item, .menu__item *,
.settings-param, .settings-param *,
.files__item, .files__item *,
.torrent-item, .torrent-item *,
.filter__item, .filter__item *,
.sort__item, .sort__item *,
.selectbox-item, .selectbox-item *,
.online__item, .online__item *,
.online__item-line, .online__item-line *,
.online-prestige__item, .online-prestige__item *,
.online-prestige__line, .online-prestige__line *,
.online__tabs-item, .online__tabs-item *,
.card, .card *,
.bottom-bar__item, .bottom-bar__item *,
.bottom-bar__btn, .bottom-bar__btn *,
.settings-folder, .settings-folder *,
.drxaos-theme-quick-btn, .drxaos-theme-quick-btn * {
    text-shadow: none !important;
}
body .head__actions .head__action,
body .head__action,
.head__action,
.drxaos-theme-quick-btn {
    background: transparent !important;
    border-radius: 8px !important;
    padding: 8px !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    transition: var(--perf-transition) !important;
    box-shadow: none !important;
}
body .head__actions .head__action:hover,
body .head__actions .head__action.focus,
body .head__action:hover,
body .head__action.focus,
.head__action:hover,
.head__action.focus,
.drxaos-theme-quick-btn:hover,
.drxaos-theme-quick-btn.focus {
    background: rgba(var(--primary-rgb), 0.2) !important;
    transform: var(--perf-transform) !important;
}
*[style*="color: #000"], *[style*="color:#000"],
*[style*="color: #001"], *[style*="color:#001"],
*[style*="color: #002"], *[style*="color:#002"],
*[style*="color: #003"], *[style*="color:#003"],
*[style*="color: #004"], *[style*="color:#004"],
*[style*="color: #005"], *[style*="color:#005"],
*[style*="color: #006"], *[style*="color:#006"],
*[style*="color: #007"], *[style*="color:#007"],
*[style*="color: #008"], *[style*="color:#008"],
*[style*="color: #009"], *[style*="color:#009"],
*[style*="color: #00a"], *[style*="color:#00a"],
*[style*="color: #00b"], *[style*="color:#00b"],
*[style*="color: #00c"], *[style*="color:#00c"],
*[style*="color: #00d"], *[style*="color:#00d"],
*[style*="color: #00e"], *[style*="color:#00e"],
*[style*="color: #00f"], *[style*="color:#00f"],
*[style*="color: #010"], *[style*="color:#010"],
*[style*="color: #020"], *[style*="color:#020"],
*[style*="color: #030"], *[style*="color:#030"],
*[style*="color: #040"], *[style*="color:#040"],
*[style*="color: #050"], *[style*="color:#050"],
*[style*="color: #060"], *[style*="color:#060"],
*[style*="color: #070"], *[style*="color:#070"],
*[style*="color: #080"], *[style*="color:#080"],
*[style*="color: #090"], *[style*="color:#090"],
*[style*="color: #0a0"], *[style*="color:#0a0"],
*[style*="color: #0b0"], *[style*="color:#0b0"],
*[style*="color: #0c0"], *[style*="color:#0c0"],
*[style*="color: #0d0"], *[style*="color:#0d0"],
*[style*="color: #0e0"], *[style*="color:#0e0"],
*[style*="color: #0f0"], *[style*="color:#0f0"],
*[style*="color: #100"], *[style*="color:#100"],
*[style*="color: #200"], *[style*="color:#200"],
*[style*="color: #300"], *[style*="color:#300"],
*[style*="color: #400"], *[style*="color:#400"],
*[style*="color: #500"], *[style*="color:#500"],
*[style*="color: #600"], *[style*="color:#600"],
*[style*="color: #700"], *[style*="color:#700"],
*[style*="color: #800"], *[style*="color:#800"],
*[style*="color: #900"], *[style*="color:#900"],
*[style*="color: #a00"], *[style*="color:#a00"],
*[style*="color: #b00"], *[style*="color:#b00"],
*[style*="color: #c00"], *[style*="color:#c00"],
*[style*="color: #d00"], *[style*="color:#d00"],
*[style*="color: #e00"], *[style*="color:#e00"],
*[style*="color: #f00"], *[style*="color:#f00"] {
    text-shadow: none !important;
}
*[style*="color: rgb(0,"], *[style*="color:rgb(0,"],
*[style*="color: rgb(1,"], *[style*="color:rgb(1,"],
*[style*="color: rgb(2,"], *[style*="color:rgb(2,"],
*[style*="color: rgb(3,"], *[style*="color:rgb(3,"],
*[style*="color: rgb(4,"], *[style*="color:rgb(4,"],
*[style*="color: rgb(5,"], *[style*="color:rgb(5,"],
*[style*="color: rgb(6,"], *[style*="color:rgb(6,"],
*[style*="color: rgb(7,"], *[style*="color:rgb(7,"],
*[style*="color: rgb(8,"], *[style*="color:rgb(8,"],
*[style*="color: rgb(9,"], *[style*="color:rgb(9,"],
*[style*="color: rgb(10,"], *[style*="color:rgb(10,"],
*[style*="color: rgb(11,"], *[style*="color:rgb(11,"],
*[style*="color: rgb(12,"], *[style*="color:rgb(12,"],
*[style*="color: rgb(13,"], *[style*="color:rgb(13,"],
*[style*="color: rgb(14,"], *[style*="color:rgb(14,"],
*[style*="color: rgb(15,"], *[style*="color:rgb(15,"],
*[style*="color: rgb(16,"], *[style*="color:rgb(16,"],
*[style*="color: rgb(17,"], *[style*="color:rgb(17,"],
*[style*="color: rgb(18,"], *[style*="color:rgb(18,"],
*[style*="color: rgb(19,"], *[style*="color:rgb(19,"],
*[style*="color: rgb(20,"], *[style*="color:rgb(20,"],
*[style*="color: rgb(21,"], *[style*="color:rgb(21,"],
*[style*="color: rgb(22,"], *[style*="color:rgb(22,"],
*[style*="color: rgb(23,"], *[style*="color:rgb(23,"],
*[style*="color: rgb(24,"], *[style*="color:rgb(24,"],
*[style*="color: rgb(25,"], *[style*="color:rgb(25,"],
*[style*="color: rgb(26,"], *[style*="color:rgb(26,"],
*[style*="color: rgb(27,"], *[style*="color:rgb(27,"],
*[style*="color: rgb(28,"], *[style*="color:rgb(28,"],
*[style*="color: rgb(29,"], *[style*="color:rgb(29,"],
*[style*="color: rgb(30,"], *[style*="color:rgb(30,"],
*[style*="color: rgb(31,"], *[style*="color:rgb(31,"],
*[style*="color: rgb(32,"], *[style*="color:rgb(32,"],
*[style*="color: rgb(33,"], *[style*="color:rgb(33,"],
*[style*="color: rgb(34,"], *[style*="color:rgb(34,"],
*[style*="color: rgb(35,"], *[style*="color:rgb(35,"],
*[style*="color: rgb(0,0,0)"], *[style*="color:rgb(0,0,0)"],
*[style*="color: rgb(1,1,1)"], *[style*="color:rgb(1,1,1)"],
*[style*="color: rgb(2,2,2)"], *[style*="color:rgb(2,2,2)"],
*[style*="color: rgb(3,3,3)"], *[style*="color:rgb(3,3,3)"],
*[style*="color: rgb(4,4,4)"], *[style*="color:rgb(4,4,4)"],
*[style*="color: rgb(5,5,5)"], *[style*="color:rgb(5,5,5)"],
*[style*="color: rgb(6,6,6)"], *[style*="color:rgb(6,6,6)"],
*[style*="color: rgb(7,7,7)"], *[style*="color:rgb(7,7,7)"],
*[style*="color: rgb(8,8,8)"], *[style*="color:rgb(8,8,8)"],
*[style*="color: rgb(9,9,9)"], *[style*="color:rgb(9,9,9)"],
*[style*="color: rgb(10,10,10)"], *[style*="color:rgb(10,10,10)"],
*[style*="color: rgb(11,11,11)"], *[style*="color:rgb(11,11,11)"],
*[style*="color: rgb(12,12,12)"], *[style*="color:rgb(12,12,12)"],
*[style*="color: rgb(13,13,13)"], *[style*="color:rgb(13,13,13)"],
*[style*="color: rgb(14,14,14)"], *[style*="color:rgb(14,14,14)"],
*[style*="color: rgb(15,15,15)"], *[style*="color:rgb(15,15,15)"],
*[style*="color: rgb(16,16,16)"], *[style*="color:rgb(16,16,16)"],
*[style*="color: rgb(17,17,17)"], *[style*="color:rgb(17,17,17)"],
*[style*="color: rgb(18,18,18)"], *[style*="color:rgb(18,18,18)"],
*[style*="color: rgb(19,19,19)"], *[style*="color:rgb(19,19,19)"],
*[style*="color: rgb(20,20,20)"], *[style*="color:rgb(20,20,20)"],
*[style*="color: rgb(21,21,21)"], *[style*="color:rgb(21,21,21)"],
*[style*="color: rgb(22,22,22)"], *[style*="color:rgb(22,22,22)"],
*[style*="color: rgb(23,23,23)"], *[style*="color:rgb(23,23,23)"],
*[style*="color: rgb(24,24,24)"], *[style*="color:rgb(24,24,24)"],
*[style*="color: rgb(25,25,25)"], *[style*="color:rgb(25,25,25)"],
*[style*="color: rgb(26,26,26)"], *[style*="color:rgb(26,26,26)"],
*[style*="color: rgb(27,27,27)"], *[style*="color:rgb(27,27,27)"],
*[style*="color: rgb(28,28,28)"], *[style*="color:rgb(28,28,28)"],
*[style*="color: rgb(29,29,29)"], *[style*="color:rgb(29,29,29)"],
*[style*="color: rgb(30,30,30)"], *[style*="color:rgb(30,30,30)"],
*[style*="color: rgb(31,31,31)"], *[style*="color:rgb(31,31,31)"],
*[style*="color: rgb(32,32,32)"], *[style*="color:rgb(32,32,32)"],
*[style*="color: rgb(33,33,33)"], *[style*="color:rgb(33,33,33)"],
*[style*="color: rgb(34,34,34)"], *[style*="color:rgb(34,34,34)"],
*[style*="color: rgb(35,35,35)"], *[style*="color:rgb(35,35,35)"] {
    text-shadow: none !important;
}
.card__view-time, .card__view--time, .card-watched, .card__time,
.time--line, .card .time, body .card__view .time, body .card .time {
    display: none !important;
}
.card, .card__view, .card__img {
    transform: translateZ(0) !important;
    will-change: auto !important;
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
    perspective: 1000px !important;
    -webkit-perspective: 1000px !important;
}
.card {
    contain: style paint !important; 
    isolation: isolate !important; 
}
.card, .card__view, .card__img {
    transition: none !important;
}
@media (pointer: coarse) and (hover: none) {
    .card, .card__view, .card__img {
        transition: none !important;
    }
}
body .console {
    background: var(--netflix-glass) !important;
    backdrop-filter: var(--perf-backdrop) !important;
    -webkit-backdrop-filter: var(--perf-backdrop) !important;
    border: 1px solid var(--netflix-glass-border) !important;
    border-radius: var(--netflix-radius-lg) !important;
    box-shadow: var(--perf-shadow) !important;
    padding: 0 !important;
    overflow: hidden !important;
}
body .console .head-backward {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(var(--secondary-rgb), 0.15)) !important;
    border: none !important;
    border-bottom: 1px solid var(--netflix-glass-border) !important;
    padding: 0.8em 1.4em !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    gap: 0.9em !important;
}
body .console .head-backward__button {
    position: relative !important;
    background: rgba(239, 68, 68, 0.12) !important;
    border-radius: 50% !important;
    border: 1px solid rgba(239, 68, 68, 0.36) !important;
    width: 1.9em !important;
    height: 1.9em !important;
    padding: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    transition: var(--perf-transition) !important;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.24) !important;
    color: #ef4444 !important;
    font-size: 1.05em !important;
    font-weight: 700 !important;
    line-height: 1 !important;
    flex: 0 0 auto !important;
}
body .console .head-backward__button:hover,
body .console .head-backward.focus .head-backward__button {
    background: rgba(239, 68, 68, 0.22) !important;
    transform: scale(1.02) !important;
    box-shadow: 0 7px 18px rgba(0, 0, 0, 0.3) !important;
}
body .console .head-backward__button svg {
    display: none !important;
}
body .console .head-backward__button::before {
    content: '\\00D7';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -52%);
    color: #ef4444 !important;
    display: block;
    font-size: 1.15em !important;
}
body .console .head-backward__title {
    font-family: var(--drxaos-font-family) !important;
    font-size: 1.4em !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    margin-left: 0 !important;
}
body .console__tabs {
    background: rgba(0, 0, 0, var(--drxaos-surface-opacity)) !important;
    border-bottom: 1px solid var(--netflix-glass-border) !important;
    padding: 0.5em 0 !important;
}
body .console__tab {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.95) !important;
    border-radius: var(--netflix-radius-md) !important;
    padding: 0.6em 1.2em !important;
    margin: 0 0.5em !important;
    font-family: var(--drxaos-font-family) !important;
    font-size: 0.9em !important;
    font-weight: 500 !important;
    color: rgba(255, 255, 255, 0.95) !important;
    transition: var(--perf-transition) !important;
    cursor: pointer !important;
    white-space: nowrap !important;
    display: inline-flex !important;
    align-items: center !important;
    gap: 0.5em !important;
}
body .console__tab span {
    background: rgba(var(--primary-rgb), 0.3) !important;
    color: rgba(var(--primary-rgb), 1) !important;
    border-radius: var(--netflix-radius-sm) !important;
    padding: 0.2em 0.5em !important;
    font-size: 0.85em !important;
    font-weight: 600 !important;
    min-width: 1.5em !important;
    text-align: center !important;
}
body .console__tab:hover,
body .console__tab.focus,
body .console__tab.active {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.3), rgba(var(--secondary-rgb), 0.3)) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.5) !important;
    color: #ffffff !important;
    transform: var(--perf-transform) !important;
    box-shadow: var(--perf-shadow) !important;
}
body .console__tab.active span {
    background: rgba(var(--primary-rgb), 1) !important;
    color: #000000 !important;
}
body .console__body {
    background: rgba(0, 0, 0, var(--drxaos-surface-opacity)) !important;
    padding: 1em !important;
}
body .console__line {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
    border-radius: var(--netflix-radius-sm) !important;
    padding: 0.6em 1em !important;
    margin: 0.3em 0 !important;
    font-family: 'Consolas', 'Monaco', monospace !important;
    font-size: 0.85em !important;
    color: rgba(255, 255, 255, 0.95) !important;
    transition: color 0.2s ease, border-color 0.2s ease !important;
    cursor: pointer !important;
}
body .console__line:hover,
body .console__line.focus {
    background: rgba(255, 255, 255, 0.03) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.35) !important;
    transform: none !important;
    color: rgba(255, 255, 255, 1) !important;
}
body .console__time {
    color: rgba(var(--primary-rgb), 0.8) !important;
    font-weight: 600 !important;
    margin-right: 0.5em !important;
}
body .console__line span[style*="hsl(105"] {
    color: #4ade80 !important;
    font-weight: 600 !important;
}
body .console__line span[style*="hsl(45"] {
    color: #fbbf24 !important;
    font-weight: 600 !important;
}
body .console__line span[style*="hsl(0"] {
    color: #f87171 !important;
    font-weight: 600 !important;
}
body .console__line span[style*="hsl(200"] {
    color: #60a5fa !important;
    font-weight: 600 !important;
}
body .console .scroll {
    scrollbar-width: thin !important;
    scrollbar-color: rgba(var(--primary-rgb), 0.5) rgba(0, 0, 0, var(--drxaos-surface-opacity)) !important;
}
body .console .scroll::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
}
body .console .scroll::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, var(--drxaos-surface-opacity)) !important;
    border-radius: var(--netflix-radius-sm) !important;
}
body .console .scroll::-webkit-scrollbar-thumb {
    background: rgba(var(--primary-rgb), 0.5) !important;
    border-radius: var(--netflix-radius-sm) !important;
    transition: var(--perf-transition) !important;
}
body .console .scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(var(--primary-rgb), 0.8) !important;
}
body .console__tabs .scroll--horizontal {
    padding: 0.5em 1em !important;
}
body .console__tabs .scroll__body {
    display: flex !important;
    gap: 0.5em !important;
    align-items: center !important;
}
body .head__time {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(var(--secondary-rgb), 0.15)) !important;
    backdrop-filter: var(--perf-backdrop) !important;
    -webkit-backdrop-filter: var(--perf-backdrop) !important;
    border: 1px solid var(--netflix-glass-border) !important;
    border-radius: var(--netflix-radius-lg) !important;
    box-shadow: var(--perf-shadow) !important;
    padding: 0.8em 1.2em !important;
    display: flex !important;
    align-items: center !important;
    gap: 1em !important;
    transition: var(--perf-transition) !important;
}
body .head__time:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.25), rgba(var(--secondary-rgb), 0.25)) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.4) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
body .head__time-now,
body .time--clock {
    font-family: var(--drxaos-font-family) !important;
    font-size: 1.8em !important;
    font-weight: 700 !important;
    color: rgba(var(--primary-rgb), 1) !important;
    line-height: 1 !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
    letter-spacing: 0.02em !important;
    min-width: 2.5em !important;
    width: 100% !important;
    display: block !important;
    text-align: center !important;
}
body .head__time > div:last-child {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.2em !important;
    width: 100% !important;
}
body .head__time {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.3em !important;
    padding: 0.8em 1.2em !important;
}
body .head__time-date,
body .time--full {
    font-family: var(--drxaos-font-family) !important;
    font-size: 0.995em !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    line-height: 1.2 !important;
    white-space: nowrap !important;
    text-align: center !important;
}
body .head__time-week,
body .time--week {
    font-family: var(--drxaos-font-family) !important;
    font-size: 0.8em !important;
    font-weight: 400 !important;
    color: rgba(255, 255, 255, 0.95) !important;
    line-height: 1.2 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    white-space: nowrap !important;
    display: none !important;
}
body .head__action,
body .head__actions .head__action {
    width: 2.5em !important;
    height: 2.5em !important;
    min-width: 2.5em !important;
    min-height: 2.5em !important;
    flex-shrink: 0 !important;
}
body .head__action.open--profile {
    width: 2.5em !important;
    height: 2.5em !important;
    min-width: 2.5em !important;
    min-height: 2.5em !important;
    padding: 0 !important;
    border-radius: 50% !important;
    overflow: hidden !important;
    flex-shrink: 0 !important;
}
body .head__action.open--profile img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    border-radius: 50% !important;
}
body .head__action svg {
    width: 1.5em !important;
    height: 1.5em !important;
}
body .head__logo-icon {
    width: 3em !important;
    height: 3em !important;
    min-width: 3em !important;
    min-height: 3em !important;
    flex-shrink: 0 !important;
}
@keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0.95; }
}
body .time--clock::after {
    animation: blink 1s infinite !important;
}
@media (max-width: 768px) {
    body .head__time {
        padding: 0.6em 1em !important;
        gap: 0.3em !important;
    }
    body .head__time-now,
    body .time--clock {
        font-size: 1.4em !important;
    }
    body .head__time-date,
    body .time--full {
        font-size: 0.85em !important;
    }
}
body .selectbox-item,
body .selectbox-item--icon {
    background: transparent !important;
    border: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.95) !important;
    border-radius: 0 !important;
    padding: 1em 1.2em !important;
    margin: 0 !important;
    display: flex !important;
    align-items: center !important;
    gap: 1em !important;
    transition: var(--perf-transition) !important;
    cursor: pointer !important;
    min-height: 3.5em !important;
}
body .selectbox-item:hover,
body .selectbox-item.focus,
body .selectbox-item--icon:hover,
body .selectbox-item--icon.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15), rgba(var(--secondary-rgb), 0.15)) !important;
    border-bottom: 1px solid rgba(var(--primary-rgb), 0.3) !important;
    transform: var(--perf-transform) !important;
}
body .selectbox-item__icon {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    width: 2.5em !important;
    height: 2.5em !important;
    margin: 0 !important;
    padding: 0 !important;
}
body .selectbox-item__icon svg {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
}
body .selectbox-item > div:not(.selectbox-item__icon) {
    flex: 1 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 0.3em !important;
    min-width: 0 !important;
}
body .selectbox-item__title {
    font-family: var(--drxaos-font-family) !important;
    font-size: 1.1em !important;
    font-weight: 600 !important;
    color: #ffffff !important;
    line-height: 1.3 !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
}
body .selectbox-item__subtitle {
    font-family: var(--drxaos-font-family) !important;
    font-size: 0.85em !important;
    font-weight: 400 !important;
    color: rgba(255, 255, 255, 0.95) !important;
    line-height: 1.2 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
}
body .selectbox-item:hover .selectbox-item__title,
body .selectbox-item.focus .selectbox-item__title {
    color: rgba(var(--primary-rgb), 1) !important;
}
body .selectbox-item:hover .selectbox-item__subtitle,
body .selectbox-item.focus .selectbox-item__subtitle {
    color: rgba(255, 255, 255, 0.95) !important;
}
body .selectbox-item:first-child {
    border-top: none !important;
}
body .selectbox-item:last-child {
    border-bottom: none !important;
}
body .torrent-filter {
    background: linear-gradient(150deg,
        rgba(var(--drxaos-triad-a-rgb), 0.45),
        rgba(var(--drxaos-triad-c-rgb), 0.22)) !important;
    border: 1.5px solid rgba(var(--theme-primary-rgb, var(--primary-rgb)), 0.35) !important;
    border-radius: 18px !important;
    box-shadow: 0 18px 38px rgba(0, 0, 0, 0.45) !important;
    padding: 1.2em !important;
    display: flex !important;
    gap: 0.8em !important;
    align-items: center !important;
    flex-wrap: wrap !important;
    margin: 1em 0 !important;
}
body .torrent-filter .filter--back {
    background: linear-gradient(145deg,
        rgba(var(--primary-rgb), 0.3),
        rgba(var(--secondary-rgb), 0.18)) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.45) !important;
    border-radius: 14px !important;
    padding: 0.6em 0.8em !important;
    transition: none !important;
    box-shadow: none !important;
    cursor: pointer !important;
}
body .torrent-filter .filter--back:hover,
body .torrent-filter .filter--back.focus {
    background: linear-gradient(145deg,
        rgba(var(--primary-rgb), 0.4),
        rgba(var(--secondary-rgb), 0.28)) !important;
    border-color: rgba(var(--primary-rgb), 0.7) !important;
    transform: none !important;
    box-shadow: none !important;
}
body .torrent-filter .filter--back svg {
    color: rgba(var(--primary-rgb), 0.9) !important;
    width: 2em !important;
    height: auto !important;
}
body .simple-button--filter {
    background: linear-gradient(145deg,
        rgba(var(--drxaos-triad-b-rgb), 0.35),
        rgba(var(--drxaos-triad-a-rgb), 0.15)) !important;
    border: 2px solid rgba(192, 192, 192, 0.25) !important;
    border-radius: 16px !important;
    padding: 0.8em 1.2em !important;
    font-family: var(--drxaos-font-family) !important;
    font-size: 0.98em !important;
    font-weight: 500 !important;
    color: var(--drxaos-text-primary) !important;
    transition: none !important;
    cursor: pointer !important;
    display: flex !important;
    align-items: center !important;
    gap: 0.75em !important;
    min-height: 2.6em !important;
}
body .simple-button--filter:hover,
body .simple-button--filter.focus,
body .simple-button--filter.active {
    border-color: rgba(var(--primary-rgb), 0.5) !important;
    color: #ffffff !important;
}
body .simple-button--filter span {
    color: var(--drxaos-text-secondary) !important;
    font-size: 0.85em !important;
    font-weight: 400 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
}
body .simple-button--filter > div {
    background: rgba(var(--primary-rgb), 0.16) !important;
    border-radius: 14px !important;
    padding: 0.3em 0.8em !important;
    font-weight: 600 !important;
    color: rgba(var(--primary-rgb), 0.95) !important;
    max-width: 200px !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
}
body .simple-button--filter:hover > div,
body .simple-button--filter.focus > div {
    background: rgba(var(--primary-rgb), 0.3) !important;
    color: #ffffff !important;
}
body .simple-button--filter > div.hide {
    display: none !important;
}
body .torrent-filter .filter--search {
    background: linear-gradient(145deg,
        rgba(var(--secondary-rgb), 0.25),
        rgba(var(--primary-rgb), 0.12)) !important;
    border: 2px solid rgba(var(--secondary-rgb), 0.4) !important;
}
body .torrent-filter .filter--search:hover,
body .torrent-filter .filter--search.focus {
    border-color: rgba(var(--secondary-rgb), 0.65) !important;
}
body .torrent-filter .filter--search svg {
    color: rgba(var(--secondary-rgb), 0.95) !important;
    width: 1.2em !important;
    height: 1.2em !important;
    flex-shrink: 0 !important;
}
body .torrent-filter .filter--search > div {
    background: rgba(var(--secondary-rgb), 0.15) !important;
    color: rgba(var(--secondary-rgb), 0.95) !important;
}
body .torrent-filter .filter--search:hover > div,
body .torrent-filter .filter--search.focus > div {
    background: rgba(var(--secondary-rgb), 0.3) !important;
    color: #ffffff !important;
}
body .filter--filter {
    position: relative !important;
}
body .filter--filter::after {
    content: '' !important;
    position: absolute !important;
    top: -3px !important;
    right: -3px !important;
    width: 8px !important;
    height: 8px !important;
    background: rgba(var(--primary-rgb), 1) !important;
    border-radius: 50% !important;
    opacity: 0 !important;
    transition: var(--perf-transition) !important;
}
body .filter--filter.active::after {
    opacity: 1 !important;
    animation: pulse 2s infinite !important;
}
@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.5);
        opacity: 0.95;
    }
}
@media (max-width: 768px) {
    body .torrent-filter {
        flex-direction: column !important;
        align-items: stretch !important;
    }
    body .simple-button--filter {
        width: 100% !important;
        justify-content: space-between !important;
    }
}
[data-component="plugins"] .settings,
[data-component="plugins"] .settings__wrap {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
[data-component="plugins"] .settings-param,
[data-component="plugins"] .settings-folder {
    background: var(--netflix-glass) !important;
    border: 1px solid var(--netflix-glass-border) !important;
    border-radius: var(--netflix-radius-md) !important;
    padding: 1em 1.2em !important;
    margin: 0.4em 0 !important;
    transition: var(--netflix-transition) !important;
    filter: saturate(180%) !important;
    -webkit-filter: saturate(180%) !important;
}
[data-component="plugins"] .settings-param.focus,
[data-component="plugins"] .settings-param:hover,
[data-component="plugins"] .settings-folder.focus,
[data-component="plugins"] .settings-folder:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.2), rgba(var(--secondary-rgb), 0.2)) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.5) !important;
    box-shadow: var(--netflix-shadow-md) !important;
    transform: translateX(4px) !important;
}
[data-component="plugins"] .settings-param__name,
[data-component="plugins"] .settings-folder__name {
    color: var(--text-main) !important;
}
[data-component="plugins"] .settings-param.focus *,
[data-component="plugins"] .settings-param:hover *,
[data-component="plugins"] .settings-folder.focus *,
[data-component="plugins"] .settings-folder:hover * {
    color: var(--text-main) !important;
}
[data-component="plugins"] .selectbox__item,
[data-component="plugins"] .selector__item {
    background: rgba(var(--primary-rgb), 0.15) !important;
    border-radius: var(--netflix-radius-sm) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.3) !important;
}
[data-component="plugins"] .selectbox__item.focus,
[data-component="plugins"] .selectbox__item.selected,
[data-component="plugins"] .selector__item.focus,
[data-component="plugins"] .selector__item.selected {
    background: rgba(var(--primary-rgb), 0.4) !important;
    border-color: var(--theme-primary) !important;
}
[data-component="plugins"] .settings__title {
    color: var(--text-main) !important;
    font-weight: 600 !important;
}
/* ========================================
   ВОЗРАСТНОЙ РЕЙТИНГ / STATUS / QUALITY
   Hi-Tech 2025 Style (ATV Optimized)
   ======================================== */

/* Возрастной рейтинг (PG) */
.full-start__pg {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    padding: 6px 12px;
    min-width: 42px;
    height: 32px;
    width: fit-content !important;
    flex-shrink: 0 !important;
    margin: 0 !important;
    background: linear-gradient(145deg,
        rgba(var(--drxaos-triad-a-rgb), 0.6),
        rgba(var(--drxaos-triad-b-rgb), 0.28));
    border: 2px solid rgba(192, 192, 192, 0.3);
    border-radius: 10px;
    box-shadow: none;
    opacity: 0.98;
    font-size: 13px;
    font-weight: 600;
    color: var(--drxaos-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.35px;
    transition: none;
}

.full-start__pg:hover {
    transform: none;
    border-color: rgba(192, 192, 192, 0.45);
    box-shadow: none;
}

/* Статус (общий) */
.full-start__status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    height: 32px;
    background: linear-gradient(145deg,
        rgba(var(--drxaos-triad-a-rgb), 0.58),
        rgba(var(--drxaos-triad-b-rgb), 0.32));
    border: 2px solid rgba(192, 192, 192, 0.25);
    border-radius: 10px;
    box-shadow: none;
    opacity: 0.98;
    font-size: 13px;
    font-weight: 500;
    color: var(--drxaos-text-primary);
    white-space: nowrap;
    transition: none;
}

.full-start__status:hover {
    transform: none;
    border-color: rgba(192, 192, 192, 0.4);
}

/* Иконка внутри статуса */
.full-start__status svg {
    width: 16px;
    height: 16px;
    opacity: 0.9;
    flex-shrink: 0;
}

/* Качество (surs_quality) - специальный акцент */
.full-start__status.surs_quality {
    background: linear-gradient(145deg,
        rgba(var(--drxaos-triad-b-rgb), 0.52),
        rgba(var(--drxaos-triad-a-rgb), 0.2)) !important;
    border: 2px solid rgba(192, 192, 192, 0.35) !important;
    color: var(--drxaos-text-primary) !important;
    font-weight: 600;
    text-shadow: none;
}

.full-start__status.surs_quality:hover {
    border-color: rgba(192, 192, 192, 1) !important;
    box-shadow: none;
    transform: none;
}

.full-start__status.surs_quality::before {
    content: none !important;
}

/* Группировка бейджей */
.full-start__pg + .full-start__status,
.full-start__status + .full-start__status,
.full-start__status + .full-start__pg {
    margin-left: 0px !important;
}

/* ========================================
   ВАРИАНТЫ СТАТУСОВ ПО ТИПУ
   ======================================== */

/* Онлайн источник */
.full-start__status[data-source="online"] {
    background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.25) 0%, 
        rgba(37, 99, 235, 0.2) 100%);
    border-color: rgba(96, 165, 250, 0.6);
    color: rgba(191, 219, 254, 1);
}

.full-start__status[data-source="online"]:hover {
    border-color: rgba(96, 165, 250, 0.8);
    box-shadow: 0 3px 10px rgba(59, 130, 246, 0.35);
}

/* Торрент источник */
.full-start__status[data-source="torrent"] {
    background: linear-gradient(135deg, 
        rgba(16, 185, 129, 0.25) 0%, 
        rgba(5, 150, 105, 0.2) 100%);
    border-color: rgba(52, 211, 153, 0.6);
    color: rgba(167, 243, 208, 1);
}

.full-start__status[data-source="torrent"]:hover {
    border-color: rgba(52, 211, 153, 0.8);
    box-shadow: 0 3px 10px rgba(16, 185, 129, 0.35);
}

/* Статус "В процессе" / Ongoing */
.full-start__status[data-type="ongoing"] {
    background: linear-gradient(135deg, 
        rgba(251, 146, 60, 0.25) 0%, 
        rgba(249, 115, 22, 0.2) 100%);
    border-color: rgba(251, 146, 60, 0.6);
    color: rgba(254, 215, 170, 1);
}

/* Статус "Завершён" / Completed */
.full-start__status[data-type="completed"] {
    background: linear-gradient(135deg, 
        rgba(139, 92, 246, 0.25) 0%, 
        rgba(109, 40, 217, 0.2) 100%);
    border-color: rgba(167, 139, 250, 0.6);
    color: rgba(221, 214, 254, 1);
}

/* ========================================
   АДАПТАЦИЯ ПОД РАЗНЫЕ ЭКРАНЫ
   ======================================== */

@media (max-width: 768px) {
    .full-start__pg,
    .full-start__status {
        height: 28px;
        padding: 4px 10px;
        font-size: 12px;
    }
    
    .full-start__status svg {
        width: 14px;
        height: 14px;
    }
    
    .full-start__pg + .full-start__status,
    .full-start__status + .full-start__status {
        margin-left: 0px !important;
    }
}

@media (max-width: 480px) {
    .full-start__pg,
    .full-start__status {
        height: 26px;
        padding: 4px 8px;
        font-size: 11px;
    }
    
    .full-start__status svg {
        width: 12px;
        height: 12px;
    }
}

/* ========================================
   ОПТИМИЗАЦИЯ ДЛЯ ANDROID TV
   ======================================== */

@media (hover: none) and (pointer: coarse) {
    .full-start__pg:hover,
    .full-start__status:hover {
        transform: translateZ(0);
    }
    
    /* Focus для TV-пульта */
    .full-start__pg:focus,
    .full-start__status:focus {
        border-color: rgba(var(--primary-rgb), 1);
        box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.3);
        transform: scale(1.05) translateZ(0);
    }
    
    .full-start__status.surs_quality:focus {
        border-color: rgba(52, 211, 153, 1);
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.4);
    }
}`;
var style = $('<style id="drxaos_theme_style"></style>');
var additionalStyles = `
.card__img, .card__img img,
.poster, .poster__img, .poster__img img,
.full-start__poster img, .info__poster img,
.full-start-new__img.full--poster,
.full-start-new__img.full--poster img {
    border-radius: 12px !important;
    overflow: hidden !important;
}
.card {
    border-radius: 12px !重要;
    overflow: visible !important;
}
.card__view {
    border-radius: 0 !important;
    overflow: visible !important;
}
.full-start__poster, .full-start__poster img {
    border-radius: 16px !important;
    overflow: hidden !important;
}
.selectbox-item__poster, .selectbox-item__poster img {
    border-radius: 8px !important;
    overflow: hidden !important;
}
.card__img, .poster__img, .full-start__poster {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
.card, .card__view { position: relative !important; }
.card__type,
.card__type::after {
    display: none !important;
}
:root {
    --drxaos-badge-height: 24px;
    --drxaos-badge-radius: 12px;
    --drxaos-badge-font: 12px;
}
.card__quality, .card-quality, .card__vote, .card__seasons, .card-seasons, .card--content-type, .card--country, .card__next-episode, .card__episode-date, .card-next-episode, .card--season-complete, .card--season-progress, .card__age,
.card__quality + .card__quality,
.card__quality + .card-quality {
    position: absolute !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: var(--drxaos-badge-height) !important;
    padding: 0 10px !important;
    border-radius: var(--drxaos-badge-radius) !important;
    font-size: var(--drxaos-badge-font) !important;
    font-weight: 700 !important;
    letter-spacing: 0.02em !important;
    color: #fff !important;
    background: rgba(6, 8, 15, 0.95) !important;
    border: 1px solid rgba(255, 255, 255, 0.95) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    text-shadow: none !important;
    margin: 0 !important;
    z-index: 4 !important;
}
.card__quality, .card-quality,
.card__quality + .card__quality,
.card__quality + .card-quality {
    top: 8px !important;
    right: 8px !important;
    left: auto !important;
    background: #000000 !important;
    border-color: #000000 !important;
    color: #ffd369 !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
}
.card__vote {
    top: 40px !important;
    right: 8px !important;
    left: auto !important;
    background: #000000 !important;
    border-color: #000000 !important;
    color: #ffd369 !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}
.card--content-type {
    top: 8px !important;
    left: 8px !important;
    background: linear-gradient(135deg, rgba(172, 119, 255, 0.95), rgba(118, 77, 255, 0.95)) !important;
    border-color: rgba(214, 191, 255, 0.95) !important;
}
.card--country {
    top: 40px !important;
    left: 8px !important;
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.95), rgba(56, 189, 248, 0.95)) !important;
    border-color: rgba(152, 222, 255, 0.95) !important;
}
.card__next-episode, .card__episode-date, .card-next-episode {
    bottom: 8px !important;
    left: 8px !important;
    top: auto !important;
    right: auto !important;
    background: linear-gradient(135deg, rgba(255, 112, 67, 0.95), rgba(255, 64, 129, 0.95)) !important;
    border-color: rgba(255, 200, 170, 0.95) !important;
}
.card__seasons, .card-seasons, .card--season-complete, .card--season-progress {
    bottom: 40px !important;
    left: 8px !important;
    top: auto !important;
    right: auto !important;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95)) !important;
    border-color: rgba(173, 209, 255, 0.95) !important;
}
.card__age {
    bottom: 8px !important;
    right: 8px !important;
    top: auto !important;
    left: auto !important;
    min-width: 46px !important;
    background: rgba(0, 0, 0, 0.82) !important;
    border-color: rgba(0, 0, 0, 0.6) !important;
    color: #ffffff !important;
    font-weight: 800 !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
}
.card__age.drxaos-age-moved {
    background: rgba(0, 0, 0, 0.82) !important;
    border-color: rgba(0, 0, 0, 0.6) !important;
    color: #ffffff !important;
}
.card--season-complete div, .card--season-progress div {
    display: contents !important;
}
.online-prestige {
    background: rgba(var(--layer-rgb), var(--drxaos-surface-opacity)) !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    border: 2px solid transparent !important;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    transform: scale(1) !important;
}
.online-prestige.focus,
.online-prestige:focus,
.online-prestige.hover,
.online-prestige:hover {
    border: 2px solid var(--theme-primary) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    transform: scale(1.05) !important;
}
.online-prestige__body {
    background: transparent !important;
}
.online-prestige__title {
    color: var(--text-main) !important;
}
.online-prestige__time,
.online-prestige__info {
    color: var(--text-secondary) !important;
}
.online-prestige__quality {
    background: var(--theme-primary) !important;
    color: var(--text-main) !important;
    border-radius: 6px !important;
    padding: 4px 8px !important;
}
.online-prestige-rate {
    color: var(--text-main) !important;
}
.online-prestige-rate svg path {
    fill: var(--theme-primary) !important;
}
.online-prestige__timeline .time-line > div {
    background: var(--theme-primary) !important;
}
.online-prestige__viewed {
    background: rgba(0, 0, 0, var(--drxaos-surface-opacity)) !important;
    color: var(--theme-primary) !important;
    border-radius: 50% !important;
    padding: 8px !important;
}
.extensions { background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--bg-rgb), 0.96) 35%, rgba(var(--secondary-rgb), 0.08) 100%) !important; }
.head-backward { background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.3), rgba(var(--secondary-rgb), 0.25)) !important; border-bottom: 2px solid var(--theme-accent) !important; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95); }
.head-backward__title { color: var(--theme-accent) !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95); }
.extensions__block-title { color: var(--theme-accent) !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95); }
.extensions__item { background: rgba(var(--primary-rgb), 0.15) !important; border: 1px solid rgba(var(--primary-rgb), 0.35) !important; border-radius: 12px !important; transition: transform 0.3s ease !important, opacity 0.3s ease !important; }
.extensions__item:hover, .extensions__item.focus { background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.45), rgba(var(--secondary-rgb), 0.4)) !important; border-color: var(--theme-accent) !important; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95); transform: translateY(-4px) !important; }
.extensions__block-add { background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.3), rgba(var(--secondary-rgb), 0.25)) !important; border: 2px dashed var(--theme-accent) !important; color: var(--theme-accent) !important; }
.extensions__item-name { color: var(--text-main) !important; }
.extensions__item:hover .extensions__item-name, .extensions__item.focus .extensions__item-name { color: var(--theme-accent) !important; text-shadow: 0 0 15px var(--theme-accent) !important; }
.extensions__item-status { color: #10B981 !important; text-shadow: 0 0 8px #10B981 !important; }
.extensions__cub { background: var(--theme-accent) !important; box-shadow: 0 0 12px var(--theme-accent) !important; }
.selectbox__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 30%, rgba(var(--secondary-rgb), 0.1) 100%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.5) !important;
    border-radius: 16px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
.selectbox__head {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.35), rgba(var(--secondary-rgb), 0.3)) !important;
    border-bottom: 2px solid var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
.selectbox__title {
    color: var(--theme-accent) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
    font-weight: 700 !important;
}
.selectbox-item {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.selectbox-item:hover, .selectbox-item.focus, .selectbox-item.selected {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.35)) !important;
    border-left: 4px solid var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    transform: translateX(6px) !important;
}
.selectbox-item__title {
    color: var(--text-main) !important;
}
.selectbox-item:hover .selectbox-item__title, .selectbox-item.focus .selectbox-item__title, .selectbox-item.selected .selectbox-item__title {
    color: var(--theme-accent) !important;
    text-shadow: 0 0 12px var(--theme-accent) !important;
}
.settings-input {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 30%, rgba(var(--secondary-rgb), 0.1) 100%) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.5) !important;
    border-radius: 16px !important;
}
.settings-input__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12) 0%, rgba(var(--bg-rgb), 0.995) 40%, rgba(var(--secondary-rgb), 0.08) 100%) !important;
    border-radius: 12px !important;
    padding: 2em !important;
}
.settings-input__title {
    color: var(--text-main) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
    font-weight: 600 !important;
    margin-bottom: 1.5em !important;
}
.simple-keyboard-input {
    background: rgba(var(--bg-rgb), 0.8) !important;
    border: 2px solid rgba(var(--primary-rgb), 0.5) !important;
    border-radius: 12px !important;
    color: var(--text-main) !important;
    padding: 0.8em 1.2em !important;
    font-size: 1.1em !important;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.simple-keyboard-input:focus, .simple-keyboard-input.focus {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    outline: none !important;
}
.simple-keyboard-input::placeholder {
    color: rgba(var(--text-rgb), 0.5) !important;
}
.settings-input__links {
    color: var(--theme-accent) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
    margin-top: 1em !important;
}
.settings__content {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.12) 0%, rgba(var(--bg-rgb), 0.995) 40%, rgba(var(--secondary-rgb), 0.08) 100%) !important;
}
.settings__head {
    background: linear-gradient(90deg, rgba(var(--primary-rgb), 0.35), rgba(var(--secondary-rgb), 0.25)) !important;
    border-bottom: 2px solid var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
.settings__title {
    color: var(--text-main) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
    font-weight: 600 !important;
}
.settings-folder {
    background: rgba(var(--primary-rgb), 0.15) !important;
    border: 1px solid rgba(var(--primary-rgb), 0.3) !important;
    border-radius: 12px !important;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}
.settings-folder:hover, .settings-folder.focus {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.35)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    transform: translateX(8px) scale(1.02) !important;
}
.settings-folder__icon svg, .settings-folder__icon img {
    filter: drop-shadow(0 0 8px rgba(var(--primary-rgb), 0.6)) !important;
}
.settings-folder__name {
    color: var(--text-main) !important;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
}
.settings-folder:hover .settings-folder__name, .settings-folder.focus .settings-folder__name {
    color: var(--theme-accent) !important;
    text-shadow: 0 0 20px var(--theme-accent) !important;
}`;
var themes = {
midnight: `
:root {
--theme-primary: #4a5fd9;
--theme-secondary: #4a5a8c;
--theme-accent: #7ba3d9;
--bg-color: #0f1419;
--text-contrast: #ffffff;
--text-main: #e8f0f7;
--primary-rgb: 45, 53, 97;
--secondary-rgb: 74, 90, 140;
--bg-rgb: 15, 20, 25;
--theme-color: rgba(74, 95, 217, 0.95);
}
.settings, .modal, .select, .layer {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
.settings-param, .settings-folder,
.filter__item, .filter--filter,
.simple-button {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}
.settings-param.focus, .settings-param:hover,
.settings-folder.focus, .settings-folder:hover,
.filter__item.focus, .filter__item:hover,
.simple-button.focus, .simple-button:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.4)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
${commonStyles}
`,
crimson: `
:root {
--theme-primary: #0ac8ff;
--theme-secondary: #3a7bd5;
--theme-accent: #59f7d8;
--bg-color: #061624;
--text-contrast: #ffffff;
--text-main: #e4f9ff;
--primary-rgb: 10, 200, 255;
--secondary-rgb: 58, 123, 213;
--bg-rgb: 6, 22, 36;
--theme-color: rgba(10, 200, 255, 0.95);
}
.settings, .modal, .select, .layer {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
.settings-param, .settings-folder,
.filter__item, .filter--filter,
.simple-button {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}
.settings-param.focus, .settings-param:hover,
.settings-folder.focus, .settings-folder:hover,
.filter__item.focus, .filter__item:hover,
.simple-button.focus, .simple-button:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.4)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
${commonStyles}
`,
red: `
:root {
--theme-primary: #ff1f4b;
--theme-secondary: #b81c36;
--theme-accent: #ff6f8f;
--bg-color: #140509;
--text-contrast: #ffffff;
--text-main: #ffecef;
--primary-rgb: 255, 31, 75;
--secondary-rgb: 184, 28, 54;
--bg-rgb: 20, 5, 9;
--theme-color: rgba(255, 31, 75, 0.95);
}
.settings, .modal, .select, .layer {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
.settings-param, .settings-folder,
.filter__item, .filter--filter,
.simple-button {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}
.settings-param.focus, .settings-param:hover,
.settings-folder.focus, .settings-folder:hover,
.filter__item.focus, .filter__item:hover,
.simple-button.focus, .simple-button:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.4)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
${commonStyles}
`,
ocean: `
:root {
--theme-primary: #0ea5e9;
--theme-secondary: #3d7a8c;
--theme-accent: #6db8cc;
--bg-color: #0a1419;
--text-contrast: #ffffff;
--text-main: #e0f2f7;
--primary-rgb: 45, 95, 111;
--secondary-rgb: 61, 122, 140;
--bg-rgb: 10, 20, 25;
}
.settings, .modal, .select, .layer {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
.settings-param, .settings-folder,
.filter__item, .filter--filter,
.simple-button {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}
.settings-param.focus, .settings-param:hover,
.settings-folder.focus, .settings-folder:hover,
.filter__item.focus, .filter__item:hover,
.simple-button.focus, .simple-button:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.4)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
${commonStyles}
`,
forest: `
:root {
--theme-primary: #22c55e;
--theme-secondary: #527552;
--theme-accent: #7ea67e;
--bg-color: #0f1410;
--text-contrast: #ffffff;
--text-main: #e8f5e8;
--primary-rgb: 61, 92, 61;
--secondary-rgb: 82, 117, 82;
--bg-rgb: 15, 20, 16;
}
.settings, .modal, .select, .layer {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
.settings-param, .settings-folder,
.filter__item, .filter--filter,
.simple-button {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}
.settings-param.focus, .settings-param:hover,
.settings-folder.focus, .settings-folder:hover,
.filter__item.focus, .filter__item:hover,
.simple-button.focus, .simple-button:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.4)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
${commonStyles}
`,
sunset: `
:root {
--theme-primary: #f97316;
--theme-secondary: #c2654a;
--theme-accent: #e89966;
--bg-color: #1a0f0a;
--text-contrast: #ffffff;
--text-main: #f7ebe0;
--primary-rgb: 166, 77, 46;
--secondary-rgb: 194, 101, 74;
--bg-rgb: 26, 15, 10;
}
.settings, .modal, .select, .layer {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
.settings-param, .settings-folder,
.filter__item, .filter--filter,
.simple-button {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}
.settings-param.focus, .settings-param:hover,
.settings-folder.focus, .settings-folder:hover,
.filter__item.focus, .filter__item:hover,
.simple-button.focus, .simple-button:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.4)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
${commonStyles}
`,
slate: `
:root {
--theme-primary: #64748b;
--theme-secondary: #545b6b;
--theme-accent: #7d8599;
--bg-color: #0d0e12;
--text-contrast: #ffffff;
--text-main: #e8eaed;
--primary-rgb: 61, 68, 81;
--secondary-rgb: 84, 91, 107;
--bg-rgb: 13, 14, 18;
}
.settings, .modal, .select, .layer {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
.settings-param, .settings-folder,
.filter__item, .filter--filter,
.simple-button {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}
.settings-param.focus, .settings-param:hover,
.settings-folder.focus, .settings-folder:hover,
.filter__item.focus, .filter__item:hover,
.simple-button.focus, .simple-button:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.4)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
${commonStyles}
`,
lavender: `
:root {
--theme-primary: #a855f7;
--theme-secondary: #8573a6;
--theme-accent: #a894c9;
--bg-color: #13101a;
--text-contrast: #ffffff;
--text-main: #f0ebf7;
--primary-rgb: 107, 91, 140;
--secondary-rgb: 133, 115, 166;
--bg-rgb: 19, 16, 26;
}
.settings, .modal, .select, .layer {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
.settings-param, .settings-folder,
.filter__item, .filter--filter,
.simple-button {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}
.settings-param.focus, .settings-param:hover,
.settings-folder.focus, .settings-folder:hover,
.filter__item.focus, .filter__item:hover,
.simple-button.focus, .simple-button:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.4)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
${commonStyles}
`,
emerald: `
:root {
--theme-primary: #10b981;
--theme-secondary: #3d8a7a;
--theme-accent: #5fb89f;
--bg-color: #0a1914;
--text-contrast: #ffffff;
--text-main: #e0f7f0;
--primary-rgb: 45, 107, 95;
--secondary-rgb: 61, 138, 122;
--bg-rgb: 10, 25, 20;
}
.settings, .modal, .select, .layer {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
.settings-param, .settings-folder,
.filter__item, .filter--filter,
.simple-button {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}
.settings-param.focus, .settings-param:hover,
.settings-folder.focus, .settings-folder:hover,
.filter__item.focus, .filter__item:hover,
.simple-button.focus, .simple-button:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.4)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
${commonStyles}
`,
amber: `
:root {
--theme-primary: #bf38ff;
--theme-secondary: #6d09b9;
--theme-accent: #ff4fbf;
--bg-color: #120021;
--text-contrast: #ffffff;
--text-main: #f7e9ff;
--primary-rgb: 191, 56, 255;
--secondary-rgb: 109, 9, 185;
--bg-rgb: 18, 0, 33;
--theme-color: rgba(191, 56, 255, 0.95);
}
.settings, .modal, .select, .layer {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.15) 0%, rgba(var(--bg-rgb), 0.995) 100%) !important;
}
.settings-param, .settings-folder,
.filter__item, .filter--filter,
.simple-button {
    background: rgba(var(--primary-rgb), 0.2) !important;
    border-color: rgba(var(--primary-rgb), 0.4) !important;
}
.settings-param.focus, .settings-param:hover,
.settings-folder.focus, .settings-folder:hover,
.filter__item.focus, .filter__item:hover,
.simple-button.focus, .simple-button:hover {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.4), rgba(var(--secondary-rgb), 0.4)) !important;
    border-color: var(--theme-accent) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
${commonStyles}
`,
default: `
${commonStyles}
`
};
var BUILTIN_TMDB_KEY = 'c87a543116135a4120443155bf680876';
var themeCSS = themes[theme] || '';
if (false) {
    themeCSS = themeCSS.replace(/-webkit-backdrop-filter:\s*blur\([^)]+\)\s*saturate\([^)]+\)[^;]*;?/gi, '');
    themeCSS += `
    .card, .menu__item, .settings-param, .files__item, .torrent-item,
    .filter__item, .sort__item, .selectbox-item, .online__item, .online__item-line,
    .online-prestige__item, .online-prestige__line, .online__tabs-item, 
    .full-start__button, .head__action {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    }
    `;
}
style.html(commonStyles + '\n\n' + additionalStyles + '\n\n' + themeCSS);
$('head').append(style);
        applyAnimations();
        applyFontWeight();
        applyGlow();
        applyFixedSurfaceOpacity();
        var outlineCSS = `
            body .card .card__view {
                position: relative !important;
            }
            body .card .card__view::after {
                content: '' !important;
                position: absolute !important;
                inset: 0 !important;
                border-radius: inherit !important;
                border: 4px solid transparent !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
                opacity: 0 !important;
                pointer-events: none !important;
                transition: border var(--perf-transition), box-shadow var(--perf-transition), opacity var(--perf-transition) !important;
                z-index: 5 !important;
            }
            body .card:hover .card__view::after,
            body .card.focus .card__view::after,
            body .card.hover .card__view::after {
                border-color: rgba(var(--primary-rgb), 0.995) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
                opacity: 1 !important;
            }
            body .card.focus .card__view::after,
            body .card.card--focus .card__view::after {
                border-color: rgba(var(--secondary-rgb), 0.995) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
            }
        `;
        if (!$('#drxaos-outline-styles').length) {
            $('head').append('<style id="drxaos-outline-styles">' + outlineCSS + '</style>');
        }
    } catch(e) {
    }
}
function applyAnimations() {
    try {
        if (!window.jQuery || !window.$) return;
var animations = Lampa.Storage.get('drxaos_animations', true);
styleManager.removeStyle('drxaos_animations_style');
if (animations) {
    var animationCSS = '.card, .menu__item, .settings-param, .files__item, .torrent-item, .filter__item, .sort__item, .selectbox-item, .online__item, .online__item-line, .online-prestige__item, .online-prestige__line, .online__tabs-item, .full-start__button, .head__action { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; will-change: auto !important; }';
    styleManager.setStyle('drxaos_animations_style', animationCSS);
    setTimeout(function() {
    }, 50);
}
    } catch(e) {
    }
}
function applyFontFamily(forceKey) {
    try {
        var selected = typeof forceKey === 'string' && forceKey ? forceKey : (Lampa.Storage.get('drxaos_font_family') || 'netflix');
        if (!FONT_PRESET_MAP[selected]) {
            selected = 'netflix';
        }
        var preset = FONT_PRESET_MAP[selected];
        var linkId = 'drxaos-font-link';
        var fontLink = document.getElementById(linkId);
        if (preset.href) {
            if (!fontLink) {
                fontLink = document.createElement('link');
                fontLink.id = linkId;
                fontLink.rel = 'stylesheet';
                fontLink.type = 'text/css';
                fontLink.crossOrigin = 'anonymous';
                document.head.appendChild(fontLink);
            }
            if (fontLink.href !== preset.href) {
                fontLink.href = preset.href;
            }
        } else if (fontLink) {
            fontLink.parentNode.removeChild(fontLink);
        }
        styleManager.setStyle('drxaos-font-family-style', `
            :root { --drxaos-font-family: ${preset.stack}; }
        `);
    } catch(e) {
        logError('Error applying font family', e);
    }
}
function applyFontWeight() {
    try {
        if (!window.jQuery || !window.$) return;
        var fontWeight = Lampa.Storage.get('drxaos_font_weight', '400');
        styleManager.removeStyle('drxaos_font_weight_style');
        var additionalCSS = `
            text-shadow: none !important;
            font-stretch: normal !important;
            letter-spacing: normal !important;
        `;
        var fontWeightCSS = `
            :root {
                --font-weight: ${fontWeight} !important;
            }
            *, body, .card, .menu__item, .settings-param, .files__item, .torrent-item,
            .filter__item, .sort__item, .selectbox-item, .online__item, .online__item-line,
            .online-prestige__item, .online-prestige__line, .online__tabs-item, 
            .full-start__button, .head__action, .card__title, .card__description,
            .menu__item-title, .settings__title, .full-start__title {
                font-weight: var(--font-weight, ${fontWeight}) !important;
                ${additionalCSS}
            }
        `;
        styleManager.setStyle('drxaos_font_weight_style', fontWeightCSS);
    } catch(e) {
    }
}
function applyGlow() {
    try {
        if (!window.jQuery || !window.$) return;
        var glow = Lampa.Storage.get('drxaos_glow', 'medium');
        var glowValues = { 'off': 0, 'low': 6, 'medium': 12, 'high': 20 };
        var glowSize = glowValues.hasOwnProperty(glow) ? glowValues[glow] : glowValues.medium;
        styleManager.removeStyle('drxaos-glow-styles');
        var glowCSS = `
            body .card:hover .card__img,
            body .card.focus .card__img {
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
            }
            .menu__item:hover,
            .button:hover,
            .settings-param:hover,
            .drxaos-theme-quick-btn:hover,
            .filter--search:hover,
            .filter--sort:hover,
            .filter--filter:hover,
            .simple-button--filter:hover,
            .selector--filter:hover,
            div.simple-button.simple-button--filter.filter--filter.selector:hover,
            .torrent-serial_content:hover,
            div.torrent-serial_content:hover {
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
            }
        `;
        styleManager.setStyle('drxaos-glow-styles', glowCSS);
    } catch(e) {
        logError('Error applying glow styles:', e);
    }
}
function applyFixedSurfaceOpacity() {
    try {
        var surfaceCSS = `
:root {
    --modal-opacity: 0.95;
    --drxaos-surface-opacity: 0.95;
}
.settings__content,
.extensions,
.speedtest {
    background: rgba(var(--bg-rgb, 12, 12, 12), var(--drxaos-surface-opacity)) !important;
    opacity: 1 !important;
}
body .settings,
body .settings__head,
body .modal,
body .modal__content,
body .select,
body .select__content,
body .layer,
body .layer__body,
body .selectbox,
body .selectbox__body,
body .panel,
body .panel__body,
body .settings-folder,
body .settings-param,
body .settings-folder.selector,
body .settings-param.selector,
body .selectbox-item,
body .files__item,
body .torrent-item,
body .filter__item,
body .sort__item,
body .filter--filter,
body .filter--sort,
body .filter--search,
body .filter--source,
body .simple-button,
body .simple-button--filter,
body .simple-button--filter.filter--filter,
body .simple-button--filter.filter--sort,
body .simple-button--filter.filter--search,
body .simple-button--filter.filter--source,
body .simple-button--filter.filter--type,
body .simple-button--filter.filter--view,
body .online__item,
body .online__item-line {
    background: rgba(var(--bg-rgb, 12, 12, 12), var(--drxaos-surface-opacity)) !important;
    background-image: none !important;
    opacity: 1 !important;
}
body .settings__head,
body .settings__head * {
    background: rgba(var(--bg-rgb, 12, 12, 12), var(--drxaos-surface-opacity)) !important;
    color: var(--text-main, #ffffff) !important;
}
body .settings-folder,
body .settings-param,
body .settings-folder.selector,
body .settings-param.selector,
body .selectbox-item,
body .files__item,
body .torrent-item,
body .filter__item,
body .sort__item,
body .filter--filter,
body .filter--sort,
body .filter--search,
body .filter--source,
body .filter--type,
body .filter--view,
body .simple-button,
body .simple-button--filter {
    border: 1px solid rgba(255, 255, 255, 0.95) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease !important;
}
body .settings-param:hover,
body .settings-param.focus,
body .settings-folder:hover,
body .settings-folder.focus,
body .selectbox-item:hover,
body .selectbox-item.focus,
body .simple-button--filter:hover,
body .simple-button--filter.focus,
body .filter--filter:hover,
body .filter--filter.focus,
body .filter--sort:hover,
body .filter--sort.focus,
body .filter--search:hover,
body .filter--search.focus,
body .filter--source:hover,
body .filter--source.focus,
body .filter--type:hover,
body .filter--type.focus,
body .filter--view:hover,
body .filter--view.focus {
    background: rgba(var(--primary-rgb), var(--drxaos-surface-opacity)) !important;
    border-color: rgba(var(--primary-rgb), 1) !important;
    color: var(--text-main, #ffffff) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
body .settings-folder.selector:hover,
body .settings-folder.selector.focus,
body .settings-param.selector:hover,
body .settings-param.selector.focus,
body .simple-button--filter:hover,
body .simple-button--filter.focus,
body .filter--filter:hover,
body .filter--filter.focus,
body .filter--sort:hover,
body .filter--sort.focus,
body .filter--search:hover,
body .filter--search.focus,
body .filter--source:hover,
body .filter--source.focus,
body .filter--type:hover,
body .filter--type.focus,
body .filter--view:hover,
body .filter--view.focus {
    background: rgba(var(--primary-rgb), var(--drxaos-surface-opacity)) !important;
    border-color: rgba(var(--primary-rgb), 1) !important;
    color: var(--text-main, #ffffff) !important;
}
body .simple-button--filter .simple-button__text,
body .filter--filter .simple-button__text,
body .filter--sort .simple-button__text,
body .filter--search .simple-button__text,
body .filter--source .simple-button__text,
body .filter--type .simple-button__text,
body .filter--view .simple-button__text {
    color: var(--text-main, #ffffff) !important;
}
`;
        styleManager.setStyle('drxaos_surface_fix', surfaceCSS);
    } catch(e) {
        logError('Error applying surface opacity fix:', e);
    }
    }
    function applyModernHoverStyles() {
        try {
            styleManager.removeStyle('drxaos-modern-hover-styles');
            var modernHoverCSS = `
            /* Netflix 2025 Modern Hover Styles - используем CSS переменные из активной темы */
            body .selectbox-item:hover,
            body .selectbox-item.focus,
            body .selectbox-item.selector:hover,
            body .settings-param:hover,
            body .settings-param.focus,
            body .menu__item:hover,
            body .menu__item.focus,
            body .files__item:hover,
            body .files__item.focus,
            body .torrent-item:hover,
            body .torrent-item.focus,
            body .filter__item:hover,
            body .filter__item.focus,
            body .sort__item:hover,
            body .sort__item.focus,
            body .online__item:hover,
            body .online__item.focus,
            body .online__item-line:hover,
            body .online__item-line.focus,
            body .online-prestige__item:hover,
            body .online-prestige__item.focus,
            body .online-prestige__line:hover,
            body .online-prestige__line.focus,
            body .online__tabs-item:hover,
            body .online__tabs-item.focus,
            body .full-start__button:hover,
            body .full-start__button.focus,
            body .button:hover,
            body .button.focus {
                background: linear-gradient(135deg, rgba(var(--primary-rgb), var(--drxaos-surface-opacity)), rgba(var(--secondary-rgb), var(--drxaos-surface-opacity))) !important;
                border: 1px solid rgba(var(--primary-rgb), 0.5) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
            }
            
            body .card:hover .card__title,
            body .card.focus .card__title,
            body .card:hover .card__text,
            body .card.focus .card__text,
            body .card:hover .card__description,
            body .card.focus .card__description,
            body .card:hover .info,
            body .card.focus .info,
            body .card:hover .card-watched__line,
            body .card.focus .card-watched__line {
                color: #ffffff !important;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
            }
        `;
        styleManager.setStyle('drxaos-modern-hover-styles', modernHoverCSS);
    } catch(e) {
        logError('Error applying modern hover styles:', e);
    }
}
    function applyDetailsStyles() {
        try {
            styleManager.setStyle('drxaos-details-style', `
                :root {
                    --drxaos-chip-min-height: clamp(22px, 2.5vw, 28px);
                    --drxaos-chip-radius: clamp(8px, 1.5vw, 10px);
                    --drxaos-chip-gap: clamp(0.15rem, 0.15vw, 0.15rem);
                    --drxaos-chip-padding-y: clamp(0.2rem, 0.3vw, 0.3rem);
                    --drxaos-chip-padding-x: clamp(0.35rem, 0.5vw, 0.45rem);
                }
                .full-start-new__details,
                .full-start__details {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    gap: var(--drxaos-chip-gap) !important;
                    width: fit-content !important;
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    margin: clamp(0.15rem, 0.6vw, 0.4rem) 0 !important;
                    width: -moz-fit-content !important;
                    width: fit-content !important;
                    max-width: 100% !important;
                    flex: 0 0 auto !important;
                    align-self: flex-start !important;
                }
                .full-start-new__details span,
                .full-start__details span {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: fit-content !important;
                    flex-shrink: 0 !important;
                    gap: 0 !important;
                    padding: var(--drxaos-chip-padding-y) var(--drxaos-chip-padding-x);
                    min-height: var(--drxaos-chip-min-height);
                    border-radius: var(--drxaos-chip-radius);
                    background: linear-gradient(145deg,
                        rgba(var(--drxaos-triad-b-rgb), 0.5),
                        rgba(var(--drxaos-triad-c-rgb), 0.18));
                    border: 2px solid rgba(192, 192, 192, 0.3);
                    box-shadow: none;
                    color: var(--drxaos-text-primary);
                    font-family: var(--drxaos-font-family);
                    font-size: clamp(0.65rem, 0.4vw + 0.38rem, 0.75rem);
                    font-weight: 600;
                    letter-spacing: 0.015em;
                    line-height: 1.2;
                    white-space: nowrap;
                    transition: none;
                    flex: 0 0 auto;
                }
                .full-start-new__details span small,
                .full-start__details span small {
                    color: var(--drxaos-text-secondary);
                }
                .full-start-new__details span.full-start-new__split,
                .full-start__details span.full-start-new__split {
                    display: none !important;
                }
                .full-start-new__details span::before,
                .full-start__details span::before {
                    content: none !important;
                }
                .full-start-new__details span:hover,
                .full-start__details span:hover,
                .full-start-new__details span:focus,
                .full-start__details span:focus {
                    transform: none;
                    box-shadow: none;
                    filter: none;
                }
            `);
    } catch(e) {
        logError('Error applying details styles:', e);
    }
}
    function applyReactionsPanelStyles() {
        try {
            styleManager.setStyle('drxaos-reactions-style', `
                :root {
                    --drxaos-chip-min-height: clamp(22px, 2.5vw, 28px);
                    --drxaos-chip-radius: clamp(8px, 1.5vw, 10px);
                    --drxaos-chip-gap: clamp(0.15rem, 0.15vw, 0.15rem);
                    --drxaos-chip-padding-y: clamp(0.2rem, 0.3vw, 0.3rem);
                    --drxaos-chip-padding-x: clamp(0.35rem, 0.5vw, 0.45rem);
                }
                .full-start-new__reactions,
                .full-start__reactions {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    gap: var(--drxaos-chip-gap) !important;
                    width: fit-content !important;
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    margin: clamp(0.15rem, 0.6vw, 0.4rem) 0 !important;
                    width: -moz-fit-content !important;
                    width: fit-content !important;
                    max-width: 100% !important;
                    flex: 0 0 auto !important;
                    align-self: flex-start !important;
                }
                .full-start-new__reactions > div,
                .full-start__reactions > div {
                    display: contents !important;
                }
                .full-start-new__reactions .reaction,
                .full-start__reactions .reaction {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    width: fit-content !important;
                    margin: 0 !important;
                    justify-content: center;
                    gap: clamp(0.2rem, 0.6vw, 0.4rem);
                    padding: var(--drxaos-chip-padding-y) var(--drxaos-chip-padding-x);
                    min-height: var(--drxaos-chip-min-height);
                    border-radius: var(--drxaos-chip-radius);
                    background: linear-gradient(145deg,
                        rgba(var(--drxaos-triad-c-rgb), 0.5),
                        rgba(var(--drxaos-triad-b-rgb), 0.2));
                    border: 2px solid rgba(192, 192, 192, 0.3);
                    box-shadow: none;
                    color: var(--drxaos-text-primary);
                    transition: none;
                    cursor: default;
                    user-select: none;
                    flex: 0 0 auto;
                }
                .full-start-new__reactions .reaction:hover,
                .full-start__reactions .reaction:hover,
                .full-start-new__reactions .reaction.focus,
                .full-start__reactions .reaction.focus {
                    transform: none;
                    box-shadow: none;
                    filter: none;
                }
                .full-start-new__reactions .reaction__icon,
                .full-start__reactions .reaction__icon {
                    width: clamp(16px, 2.5vw, 20px);
                    height: clamp(16px, 2.5vw, 20px);
                    object-fit: contain;
                    filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45));
                    transition: transform 0.2s ease;
                }
                .full-start-new__reactions .reaction:hover .reaction__icon,
                .full-start__reactions .reaction:hover .reaction__icon,
                .full-start-new__reactions .reaction.focus .reaction__icon,
                .full-start__reactions .reaction.focus .reaction__icon {
                    transform: none;
                }
                .full-start-new__reactions .reaction__count,
                .full-start__reactions .reaction__count {
                    font-family: var(--drxaos-font-family);
                    font-size: clamp(0.65rem, 0.4vw + 0.38rem, 0.75rem);
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    color: var(--drxaos-text-secondary);
                    text-shadow: none;
                }
            `);
    } catch(e) {
        logError('Error applying reactions panel styles:', e);
    }
}
    function applyRateLineStyles() {
        try {
            styleManager.setStyle('drxaos-rate-line-style', `
                :root {
                    --drxaos-chip-min-height: clamp(22px, 2.5vw, 28px);
                    --drxaos-chip-radius: clamp(8px, 1.5vw, 10px);
                --drxaos-chip-gap: clamp(0.15rem, 0.15vw, 0.15rem);
                --drxaos-chip-padding-y: clamp(0.2rem, 0.3vw, 0.3rem);
                --drxaos-chip-padding-x: clamp(0.35rem, 0.5vw, 0.45rem);
                }
                .full-start-new__rate-line,
                .full-start__rate-line {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    gap: var(--drxaos-chip-gap) !important;
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    padding: 0 !important;
                    margin: clamp(0.15rem, 0.6vw, 0.4rem) 0 !important;
                    width: -moz-fit-content !important;
                    width: fit-content !important;
                    max-width: 100% !important;
                    flex: 0 0 auto !important;
                    align-self: flex-start !important;
                }
                .full-start-new__rate-line .full-start__rate,
                .full-start__rate-line .full-start__rate,
                .full-start-new__rate-line .full-start__status,
                .full-start__rate-line .full-start__status {
                    display: inline-flex;
                    align-items: center;
                    width: fit-content !important;
                    flex-shrink: 0 !important;
                    margin: 0 !important;
                    justify-content: center;
                    gap: clamp(0.2rem, 0.6vw, 0.4rem);
                    min-height: var(--drxaos-chip-min-height);
                    padding: var(--drxaos-chip-padding-y) var(--drxaos-chip-padding-x);
                    border-radius: var(--drxaos-chip-radius);
                    background: linear-gradient(145deg,
                        rgba(var(--drxaos-triad-a-rgb), 0.55),
                        rgba(var(--drxaos-triad-c-rgb), 0.22));
                    border: 2px solid rgba(192, 192, 192, 0.3);
                    box-shadow: none;
                    color: var(--drxaos-text-primary);
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    text-transform: none;
                    transition: none;
                    flex: 0 0 auto;
                }
                .full-start-new__rate-line .full-start__rate img,
                .full-start__rate-line .full-start__rate img {
                    width: clamp(14px, 2vw, 18px);
                    height: clamp(14px, 2vw, 18px);
                    margin-right: clamp(0.15rem, 0.3vw, 0.2rem);
                }
                .full-start-new__rate-line .full-start__status {
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }
                .full-start-new__rate-line .full-start__rate:hover,
                .full-start__rate-line .full-start__rate:hover,
                .full-start-new__rate-line .full-start__status:hover,
                .full-start__rate-line .full-start__status:hover {
                    transform: none;
                    box-shadow: none;
                    filter: none;
                }
            `);
        } catch(e) {
            logError('Error applying rate line styles:', e);
        }
    }
function createQuickThemeModal() {
    try {
        if (!window.jQuery || !window.$) return;
        var controller_name = 'drxaos_quick_theme_modal';

        function closeModal() {
            try {
                // Удаляем контроллер из Lampa
                Lampa.Controller.toggle(controller_name);

                var modal = document.querySelector('.drxaos-quick-theme-modal');
                if (modal) {
                    modal.remove();
                }

                // Очищаем все обработчики
                $(document).off('keydown.quickThemeModal');
                $(document).off('keyup.quickThemeModal');
                $(document).off('keydown.quickThemeNavigation');

                // Убираем фокус с кнопки
                var quickBtn = document.querySelector('#drxaos-quick-theme-btn');
                if (quickBtn) {
                    quickBtn.classList.remove('focus', 'focused', 'active');
                    quickBtn.blur();
                }

                // Возвращаем фокус основному контенту
                Lampa.Controller.toggle('content');
            } catch(e) {
                logError('Error closing quick theme modal', e);
            }
        }
var modal = $('<div class="drxaos-quick-theme-modal"></div>');
var overlay = $('<div class="drxaos-modal-overlay"></div>');
var content = $('<div class="drxaos-modal-content"></div>');
var title = $('<h2 class="drxaos-modal-title">🎨 Выберите тему</h2>');
var themesGrid = $('<div class="drxaos-themes-grid"></div>');
var themesList = [
{ id: 'midnight', name: 'Midnight', icon: '🌙' },
{ id: 'crimson', name: 'Chameleon', icon: '🦎' },
{ id: 'ocean', name: 'Ocean', icon: '🌊' },
{ id: 'forest', name: 'Forest', icon: '🌲' },
{ id: 'sunset', name: 'Sunset', icon: '🌅' },
{ id: 'slate', name: 'Slate', icon: '⚫' },
{ id: 'lavender', name: 'Lavender', icon: '💜' },
{ id: 'emerald', name: 'Emerald', icon: '💚' },
{ id: 'amber', name: 'Neon Demon', icon: '👾' },
            { id: 'red', name: 'Red', icon: '🟥' }
];
var currentTheme = Lampa.Storage.get('drxaos_theme', 'red');
        function focusThemeItem($item, options) {
            options = options || {};
            if (!$item || !$item.length) return;
            var $items = $('.drxaos-theme-item');
            $items.removeClass('focus active');
            $item.addClass('active focus');
            if (!options.skipDomFocus && $item[0] && document.activeElement !== $item[0]) {
                $item[0].focus();
            }
            if ($item[0] && typeof $item[0].scrollIntoView === 'function') {
                $item[0].scrollIntoView({ behavior: options.instant ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
            }
        }
        function moveThemeFocus(direction) {
            var $items = $('.drxaos-theme-item');
            if (!$items.length) return;
            var $current = $items.filter('.focus, .active').first();
            if (!$current.length) {
                focusThemeItem($items.first());
                return;
            }
            var currentRect = $current[0].getBoundingClientRect();
            var currentX = currentRect.left + currentRect.width / 2;
            var currentY = currentRect.top + currentRect.height / 2;
            var threshold = 5;
            var bestElement = null;
            var bestScore = Infinity;
            $items.each(function() {
                if (this === $current[0]) return;
                var rect = this.getBoundingClientRect();
                var x = rect.left + rect.width / 2;
                var y = rect.top + rect.height / 2;
                var dx = x - currentX;
                var dy = y - currentY;
                var score = null;
                switch (direction) {
                    case 'left':
                        if (dx < -threshold) score = Math.abs(dy) * 1000 + Math.abs(dx);
                        break;
                    case 'right':
                        if (dx > threshold) score = Math.abs(dy) * 1000 + Math.abs(dx);
                        break;
                    case 'up':
                        if (dy < -threshold) score = Math.abs(dx) * 1000 + Math.abs(dy);
                        break;
                    case 'down':
                        if (dy > threshold) score = Math.abs(dx) * 1000 + Math.abs(dy);
                        break;
                }
                if (score !== null && score < bestScore) {
                    bestScore = score;
                    bestElement = this;
                }
            });
            if (!bestElement) {
                if (direction === 'left' || direction === 'up') {
                    bestElement = $current.prev('.drxaos-theme-item')[0] || $items.last()[0];
                } else {
                    bestElement = $current.next('.drxaos-theme-item')[0] || $items.first()[0];
                }
            }
            if (bestElement) {
                focusThemeItem($(bestElement));
            }
        }
function activateTheme(themeId) {
    var previousTheme = Lampa.Storage.get('drxaos_theme', 'red');
    try {
        Lampa.Storage.set('drxaos_theme', themeId);
        applyTheme(themeId);
        applyAdvancedSettings();
        focusThemeItem($('.drxaos-theme-item[data-theme="' + themeId + '"]'), { instant: true });
    } catch(e) {
        logError('Ошибка активации темы', e);
        if (previousTheme !== themeId) {
            Lampa.Storage.set('drxaos_theme', previousTheme);
            try {
                applyTheme(previousTheme);
                applyAdvancedSettings();
            } catch(restoreError) {
                logError('Ошибка восстановления темы', restoreError);
            }
        }
    }
    setTimeout(function() {
        var filterButtons = document.querySelectorAll('div.simple-button.simple-button--filter.filter--filter.selector');
        filterButtons.forEach(function(button) {
            if (button) {
                button.style.setProperty('background', 'var(--glass-bg, rgba(0, 0, 0, var(--drxaos-surface-opacity)))', 'important');
                button.style.setProperty('border', '2px solid var(--theme-primary, #5a3494)', 'important');
                button.style.setProperty('border-radius', '2em', 'important');
                button.style.setProperty('color', 'var(--text-main, #ffffff)', 'important');
                button.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, var(--drxaos-surface-opacity))', 'important');
            }
        });
    }, 200);
    setTimeout(function() {
        closeModal();
        setTimeout(function() {
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
            var $btn = $('#drxaos-quick-theme-btn');
            if ($btn.length) {
                $btn.focus();
            }
        }, 200);
    }, 100);
}
themesList.forEach(function(theme) {
    var themeBtn = $('<div class="drxaos-theme-item' + (currentTheme === theme.id ? ' active' : '') + '" data-theme="' + theme.id + '" tabindex="0" role="button" aria-label="Выбрать тему ' + theme.name + '"><span class="drxaos-theme-icon">' + theme.icon + '</span><span class="drxaos-theme-name">' + theme.name + '</span></div>');
    themeBtn.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            var selectedTheme = $(this).data('theme');
            activateTheme(selectedTheme);
            closeModal();
        } catch(error) {
            logError('Ошибка при выборе темы', error);
            closeModal();
        }
    });
    themeBtn.on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
            e.preventDefault();
            e.stopPropagation();
            var selectedTheme = $(this).data('theme');
            activateTheme(selectedTheme);
            closeModal();
        }
    });
    themeBtn.on('focus', function() {
        focusThemeItem($(this), { skipDomFocus: true, instant: true });
    });
    themeBtn.on('mouseenter', function() {
        focusThemeItem($(this), { instant: true });
});
themesGrid.append(themeBtn);
});
content.append(title).append(themesGrid);
modal.append(overlay).append(content);
if (typeof Lampa !== 'undefined' && Lampa.Listener) {
    var backHandler = function() {
        var $modal = $('.drxaos-quick-theme-modal');
        if ($modal.length > 0 && $modal.is(':visible')) {
            closeModal();
            return false;
        }
        return true;
    };

        // ===== КОНТРОЛЛЕР LAMPA ДЛЯ БЫСТРОЙ СМЕНЫ ТЕМ =====
        var modalController = {
            name: controller_name,
            toggle: function() {
                Lampa.Controller.add(controller_name, {
                    toggle: function() {},
                    back: function() { closeModal(); },
                    up: function() {
                        moveThemeFocus('up');
                    },
                    down: function() {
                        moveThemeFocus('down');
                    },
                    left: function() {
                        moveThemeFocus('left');
                    },
                    right: function() {
                        moveThemeFocus('right');
                    },
                    enter: function() {
                        var $focused = $('.drxaos-theme-item.focus, .drxaos-theme-item.active');
                        if ($focused.length) {
                            var selectedTheme = $focused.data('theme');
                            if (selectedTheme) {
                                activateTheme(selectedTheme);
                                // Закрываем модал с задержкой для применения темы
                                setTimeout(function() {
                                    closeModal();
                                }, 100);
                            }
                        }
                    }
                });
                Lampa.Controller.toggle(controller_name);
            }
        };

        modalController.toggle();
        setTimeout(function() {
            var $items = $('.drxaos-theme-item');
            var $current = $items.filter('[data-theme="' + currentTheme + '"]');
            if ($current.length) {
                focusThemeItem($current, { instant: true });
            } else {
                focusThemeItem($items.first(), { instant: true });
            }
            $items.attr('tabindex', '0');
        }, 100);
        // ===== КОНЕЦ КОНТРОЛЛЕРА БЫСТРОЙ СМЕНЫ ТЕМ =====

    Lampa.Listener.follow('back', backHandler);
}
$(document).on('keydown.quickThemeGlobal', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        var $modal = $('.drxaos-quick-theme-modal');
        if ($modal.length > 0 && $modal.is(':visible')) {
            closeModal();
        } else {
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }
            var $btn = $('#drxaos-quick-theme-btn');
            if ($btn.length) {
                $btn.focus();
            }
        }
    }
});
overlay.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
});
$(document).on('keydown.quickThemeModal', function(e) {
    if (document.querySelector('.drxaos-quick-theme-modal')) {
        if (e.key === 'Escape' || e.keyCode === 27 || 
            e.key === 'Backspace' || e.keyCode === 8 ||
            e.key === 'Back' || e.keyCode === 166 ||
            e.keyCode === 461 || e.keyCode === 462 || e.keyCode === 10009 ||
            e.keyCode === 4 || e.keyCode === 111 || e.keyCode === 115) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
            return false;
        }
    }
});
$(document).on('keyup.quickThemeModal', function(e) {
    if (document.querySelector('.drxaos-quick-theme-modal')) {
        if (e.keyCode === 4 || e.keyCode === 111 || e.keyCode === 115) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
            return false;
        }
    }
});
content.on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
});
$(document).on('keydown.quickThemeNavigation', function(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === 'ArrowUp') moveThemeFocus('up');
        else if (e.key === 'ArrowDown') moveThemeFocus('down');
        else if (e.key === 'ArrowLeft') moveThemeFocus('left');
        else if (e.key === 'ArrowRight') moveThemeFocus('right');
    } else if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
            var selectedTheme = $('.drxaos-theme-item.focus, .drxaos-theme-item.active').first().data('theme');
            if (selectedTheme) {
                activateTheme(selectedTheme);
                closeModal();
            }
    } else if (e.key === 'Backspace' || e.keyCode === 8 ||
               e.key === 'Back' || e.keyCode === 166 ||
               e.keyCode === 461 || e.keyCode === 462 || e.keyCode === 10009) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
        return false;
    }
});
var styles = `
<style>
        /* ═══════════════════════════════════════════════════════════════════════
           🚀 PERFORMANCE OPTIMIZATION + 95% OPACITY FIX + MOBILE MENU
           ═══════════════════════════════════════════════════════════════════════ */

        /* GPU-ускорение для всех анимируемых элементов */
        .card,
        .menu__item,
        .scroll-line,
        .selector,
        .focus,
        .card-poster,
        .card-img,
        .selectbox__list,
        .settings-param__value {
            transform: translateZ(0);
            will-change: transform, opacity;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            -webkit-font-smoothing: antialiased;
        }

        /* Оптимизация изображений */
        .card-poster img,
        .card-img img,
        img {
            transform: translate3d(0, 0, 0);
            image-rendering: -webkit-optimize-contrast;
        }

        /* Быстрые transitions */
        .card {
            transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), 
                        opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .menu__item {
            transition: transform 0.15s ease-out, 
                        opacity 0.15s ease-out !important;
        }

        /* Focus-эффекты */
        .focus,
        .card:focus,
        .card.focus {
            transform: scale(1.05) translateZ(0) !important;
            transition: transform 0.15s ease-out !important;
        }

        /* Убираем тяжелые псевдоэлементы */
        .card-poster::after,
        .card-img::after {
            content: none !important;
        }

        /* Оптимизация скролла */
        .scroll,
        .line {
            -webkit-overflow-scrolling: touch;
            overflow: auto;
            will-change: scroll-position;
        }

        /* Упрощение border-radius */


        /* ═══════════════════════════════════════════════════════════════════════
           🎨 BACKGROUND COLOR FIX - ALWAYS USE THEME COLORS
           ═══════════════════════════════════════════════════════════════════════ */

        /* Принудительно фиксируем фон темы - не даем Lampa менять его */
        .background,
        body > .background,
        #app .background {
            background: linear-gradient(135deg, 
                rgba(var(--primary-rgb), 0.15) 0%, 
                rgb(var(--bg-rgb)) 50%,
                rgba(var(--secondary-rgb), 0.1) 100%) !important;
            background-color: rgb(var(--bg-rgb)) !important;
            background-image: linear-gradient(135deg, 
                rgba(var(--primary-rgb), 0.15) 0%, 
                rgb(var(--bg-rgb)) 50%,
                rgba(var(--secondary-rgb), 0.1) 100%) !important;
        }

        /* Убираем все динамические картинки фона */
        .background::before,
        .background::after,
        .background > * {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }

        /* Если Lampa пытается добавить background-image через style="" */
        .background[style*="background-image"] {
            background-image: linear-gradient(135deg, 
                rgba(var(--primary-rgb), 0.15) 0%, 
                rgb(var(--bg-rgb)) 50%,
                rgba(var(--secondary-rgb), 0.1) 100%) !important;
        }

        /* Также фиксируем body */
        body {
            background: linear-gradient(135deg, 
                rgba(var(--primary-rgb), 0.15) 0%, 
                rgb(var(--bg-rgb)) 50%,
                rgba(var(--secondary-rgb), 0.1) 100%) !important;
            background-attachment: fixed !important;
        }
        * {
            border-radius: 4px;
        }

        /* Фиксация прозрачности на 95% */
        .modal,
        .modal__content,
        .selectbox__list,
        .menu,
        .info__panel,
        .settings-panel {
            opacity: 0.95 !important;
        }

        /* ═══════════════════════════════════════════════════════════════════════
           📱 MOBILE BOTTOM MENU STYLING
           ═══════════════════════════════════════════════════════════════════════ */

        /* Нижнее меню на мобильных - темный фон */
        .bottom-tabs,
        .menu-bottom,
        .bottom-navigation,
        .footer-menu,
        .menu--bottom {
            background: rgba(0, 0, 0, 0.95) !important;
        }

        /* Кнопки: НАЗАД, ГЛАВНАЯ, ПОИСК, НАСТРОЙКИ - белый текст со свечением */
        .bottom-tabs__item,
        .menu-bottom__item,
        .bottom-navigation__button,
        .footer-menu__button,
        .menu--bottom .menu__item,
        .menu__item[data-action="back"],
        .menu__item[data-action="main"],
        .menu__item[data-action="search"],
        .menu__item[data-action="settings"] {
            color: #ffffff !important;
            text-shadow: 0 0 10px var(--theme-color, #e50914),
                         0 0 20px var(--theme-color, #e50914),
                         0 0 30px var(--theme-color, #e50914) !important;
            transition: all 0.2s ease-out !important;
        }

        /* Иконки кнопок - белые со свечением */
        .bottom-tabs__item svg,
        .menu-bottom__item svg,
        .bottom-navigation__button svg,
        .footer-menu__button svg,
        .menu--bottom .menu__item svg,
        .menu__item[data-action] svg {
            fill: #ffffff !important;
            stroke: #ffffff !important;
            filter: drop-shadow(0 0 8px var(--theme-color, #e50914)) !important;
        }

        /* Активная кнопка - усиленное свечение */
        .bottom-tabs__item.active,
        .bottom-tabs__item--active,
        .menu-bottom__item.active,
        .menu-bottom__item--active,
        .bottom-navigation__button.active,
        .footer-menu__button.active,
        .menu--bottom .menu__item.active,
        .menu--bottom .menu__item.focus,
        .menu__item[data-action].active,
        .menu__item[data-action].focus {
            color: #ffffff !important;
            text-shadow: 0 0 15px var(--theme-color, #e50914),
                         0 0 30px var(--theme-color, #e50914),
                         0 0 45px var(--theme-color, #e50914),
                         0 0 60px var(--theme-color, #e50914) !important;
            transform: scale(1.1) translateZ(0) !important;
        }

        /* Иконки активной кнопки - усиленное свечение */
        .bottom-tabs__item.active svg,
        .menu-bottom__item.active svg,
        .bottom-navigation__button.active svg,
        .menu--bottom .menu__item.active svg,
        .menu--bottom .menu__item.focus svg,
        .menu__item[data-action].active svg,
        .menu__item[data-action].focus svg {
            filter: drop-shadow(0 0 12px var(--theme-color, #e50914))
                    drop-shadow(0 0 20px var(--theme-color, #e50914)) !important;
        }

        /* Текст кнопок */
        .bottom-tabs__text,
        .menu-bottom__text,
        .bottom-navigation__text,
        .footer-menu__text,
        .menu--bottom .menu__item-text,
        .menu__item span {
            color: #ffffff !important;
            font-weight: 500 !important;
        }

        /* Hover эффект */
        @media (hover: hover) {
            .bottom-tabs__item:hover,
            .menu-bottom__item:hover,
            .bottom-navigation__button:hover,
            .footer-menu__button:hover,
            .menu--bottom .menu__item:hover,
            .menu__item[data-action]:hover {
                text-shadow: 0 0 12px var(--theme-color, #e50914),
                             0 0 25px var(--theme-color, #e50914),
                             0 0 40px var(--theme-color, #e50914) !important;
            }
        }


        /* ═══════════════════════════════════════════════════════════════════════
           🚀 PERFORMANCE OPTIMIZATION + 95% OPACITY FIX
           ═══════════════════════════════════════════════════════════════════════ */

        /* GPU-ускорение для всех анимируемых элементов */
        .card,
        .menu__item,
        .scroll-line,
        .selector,
        .focus,
        .card-poster,
        .card-img,
        .selectbox__list,
        .settings-param__value {
            transform: translateZ(0);
            will-change: transform, opacity;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            -webkit-font-smoothing: antialiased;
        }

        /* Оптимизация изображений */
        .card-poster img,
        .card-img img,
        img {
            transform: translate3d(0, 0, 0);
            image-rendering: -webkit-optimize-contrast;
        }

        /* Быстрые transitions */
        .card {
            transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), 
                        opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .menu__item {
            transition: transform 0.15s ease-out, 
                        opacity 0.15s ease-out !important;
        }

        /* Focus-эффекты */
        .focus,
        .card:focus,
        .card.focus {
            transform: scale(1.05) translateZ(0) !important;
            transition: transform 0.15s ease-out !important;
        }

        /* Убираем тяжелые псевдоэлементы */
        .card-poster::after,
        .card-img::after {
            content: none !important;
        }

        /* Оптимизация скролла */
        .scroll,
        .line {
            -webkit-overflow-scrolling: touch;
            overflow: auto;
            will-change: scroll-position;
        }

        /* Фиксация прозрачности на 95% для дополнительной производительности */
        .modal,
        .modal__content,
        .selectbox__list,
        .menu,
        .info__panel,
        .settings-panel {
            opacity: 0.95 !important;
        }


.drxaos-quick-theme-modal {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 10000;
display: flex;
align-items: center;
justify-content: center;
font-family: var(--drxaos-font-family);
font-weight: var(--font-weight, 400);
}
.drxaos-modal-overlay {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, var(--drxaos-surface-opacity));
cursor: pointer;
z-index: 1;
}
.drxaos-modal-content {
position: relative;
z-index: 2;
background: rgba(30, 30, 40, 0.95);
filter: saturate(180%) !important;
-webkit-filter: saturate(180%) !important;
border: 2px solid rgba(107, 63, 174, 0.95);
border-radius: 1.5em;
padding: 2em;
max-width: 90%;
width: 700px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
animation: modalSlideIn 0.3s ease-out;
cursor: default;
}
@keyframes modalSlideIn {
from {
opacity: 0;
transform: translateY(-30px) scale(0.995);
}
to {
opacity: 1;
transform: translateY(0) scale(1);
}
}
.drxaos-modal-title {
color: #00c8e6;
font-size: 1.8em;
font-weight: 700;
margin: 0 0 1em 0;
text-align: center;
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
}
.drxaos-themes-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
gap: 1em;
}
.drxaos-theme-item {
background: rgba(50, 50, 70, 0.95);
border: 2px solid rgba(107, 63, 174, 0.95);
border-radius: 1em;
padding: 1.5em 1em;
cursor: pointer;
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
display: flex;
flex-direction: column;
align-items: center;
gap: 0.5em;
-webkit-}
.drxaos-theme-item:hover {
background: linear-gradient(135deg, rgba(107, 63, 174, 0.95), rgba(0, 153, 204, 0.95));
border-color: #00c8e6;
transform: translateY(-5px) scale(1.05);
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
.drxaos-theme-item.active {
background: linear-gradient(135deg, #6b3fae, #0099cc);
border-color: #00c8e6;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
.drxaos-theme-item:focus {
outline: none;
background: linear-gradient(135deg, rgba(107, 63, 174, 0.95), rgba(0, 153, 204, 0.95));
border-color: #00c8e6;
transform: translateY(-3px) scale(1.02);
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
.drxaos-theme-icon {
font-size: 2.5em;
line-height: 1;
filter: drop-shadow(0 2px 4px rgba(0, 0, 0, var(--drxaos-surface-opacity)));
}
.drxaos-theme-name {
color: #fff;
font-size: 0.9em;
font-weight: 600;
text-align: center;
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
}
.drxaos-theme-item.active .drxaos-theme-name {
color: #fff;
font-weight: 700;
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
}
</style>
`;
$('head').append(styles);
$('body').append(modal);
modal.hide().fadeIn(300, function() {
    var $activeItem = $('.drxaos-theme-item.active');
    if ($activeItem.length > 0) {
        $activeItem.focus();
    } else {
        $('.drxaos-theme-item').first().focus().addClass('active');
    }
});
    } catch(e) {
    }
}
function addQuickThemeButton() {
    try {
        if (!window.jQuery || !window.$) return;
var checkInterval = setInterval(function() {
if ($('.head__actions').length > 0 && $('#drxaos-quick-theme-btn').length === 0) {
                var btn = $('<div class="head__action drxaos-theme-quick-btn selector" id="drxaos-quick-theme-btn" title="Быстрый выбор темы" data-action="drxaos-quick-theme"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41zM7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3z" fill="currentColor"/></svg></div>');
$('.head__actions').prepend(btn);
                if (btn && btn.length > 0) {
                    btn.on('hover:enter', function() {
                        if (!document.querySelector('.drxaos-quick-theme-modal')) {
                            createQuickThemeModal();
                        }
                    });
                    btn.on('click', function() {
                        if (!document.querySelector('.drxaos-quick-theme-modal')) {
                            createQuickThemeModal();
                        }
                    });
                    btn.on('focus', function() {
                        if (!document.querySelector('.drxaos-quick-theme-modal')) {
                            createQuickThemeModal();
                        }
                    });
                }
clearInterval(checkInterval);
}
}, 100);
setTimeout(function() {
clearInterval(checkInterval);
}, 10000);
        var lastHash = window.location.hash;
        setInterval(function() {
            var currentHash = window.location.hash;
            if (currentHash !== lastHash) {
                lastHash = currentHash;
                if ($('.head__actions').length > 0 && $('#drxaos-quick-theme-btn').length === 0) {
                    var btn = $('<div class="head__action drxaos-theme-quick-btn selector" id="drxaos-quick-theme-btn" title="Быстрый выбор темы" data-action="drxaos-quick-theme"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41zM7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3z" fill="currentColor"/></svg></div>');
                    $('.head__actions').prepend(btn);
                    btn.on('hover:enter', function() {
                        if (!document.querySelector('.drxaos-quick-theme-modal')) {
                            createQuickThemeModal();
                        }
                    });
                    btn.on('click', function() {
                        if (!document.querySelector('.drxaos-quick-theme-modal')) {
                            createQuickThemeModal();
                        }
                    });
                    btn.on('focus', function() {
                        if (!document.querySelector('.drxaos-quick-theme-modal')) {
                            createQuickThemeModal();
                        }
                    });
                }
            }
        }, 500);
    } catch(e) {
    }
}
function addSettings() {
    // Инициализация значений по умолчанию
    if (!Lampa.Storage.get('tmdb_api_key')) {
        Lampa.Storage.set('tmdb_api_key', BUILTIN_TMDB_KEY);
    }
    if (!Lampa.Storage.get('jacred_url')) {
        Lampa.Storage.set('jacred_url', 'jacred.xyz');
    }
    if (!Lampa.Storage.get('drxaos_font_family')) {
        Lampa.Storage.set('drxaos_font_family', 'netflix');
    }
    
    function ensureIntegrationDefaults() {
        try {
            var tmdbKey = (Lampa.Storage.get('tmdb_api_key') || '').toString().trim();
            if (!tmdbKey) {
                Lampa.Storage.set('tmdb_api_key', BUILTIN_TMDB_KEY);
            }
            var jacredUrl = (Lampa.Storage.get('jacred_url') || '').toString().trim();
            if (jacredUrl) {
                jacredUrl = jacredUrl.replace(/^https?:\/\//i, '').replace(/\/+$/, '');
            }
            if (!jacredUrl) {
                jacredUrl = 'jacred.xyz';
            }
            if (Lampa.Storage.get('jacred_url') !== jacredUrl) {
                Lampa.Storage.set('jacred_url', jacredUrl);
            }
        } catch(err) {
            logError('Error ensuring integration defaults', err);
        }
    }
    ensureIntegrationDefaults();
    Lampa.SettingsApi.addComponent({
        component: 'drxaos_themes',
        name: 'DRXAOS Themes',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" fill="currentColor"/></svg>',
        order: -999
    });
    
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'drxaos_theme',
        type: 'select',
        values: {
            'midnight': Lampa.Lang.translate('theme_midnight'),
            'crimson': Lampa.Lang.translate('theme_crimson'),
            'red': Lampa.Lang.translate('theme_red'),
            'ocean': Lampa.Lang.translate('theme_ocean'),
            'forest': Lampa.Lang.translate('theme_forest'),
            'sunset': Lampa.Lang.translate('theme_sunset'),
            'slate': Lampa.Lang.translate('theme_slate'),
            'lavender': Lampa.Lang.translate('theme_lavender'),
            'emerald': Lampa.Lang.translate('theme_emerald'),
            'amber': Lampa.Lang.translate('theme_amber')
        },
        default: 'midnight'
    },
        field: {
        name: Lampa.Lang.translate('drxaos_theme'),
        description: Lampa.Lang.translate('drxaos_theme_desc')
    },
        onChange: applyTheme
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'drxaos_glow',
        type: 'select',
        values: {
            'off': 'Off',
            'low': 'Low',
            'medium': 'Medium',
            'high': 'High'
        },
        default: 'medium'
    },
        field: {
        name: Lampa.Lang.translate('drxaos_glow'),
        description: Lampa.Lang.translate('drxaos_glow_desc')
    },
        onChange: function() {
        applyAdvancedSettings();
        applyGlow();
    }
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'drxaos_animations',
        type: 'trigger',
        default: true
    },
        field: {
        name: Lampa.Lang.translate('drxaos_animations'),
        description: Lampa.Lang.translate('drxaos_animations_desc')
    },
        onChange: applyAnimations
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'drxaos_font_weight',
        type: 'select',
        values: {
            '400': 'Normal',
            '600': 'Semi-Bold',
            '700': 'Bold',
            '800': 'Extra Bold',
            '900': 'Black'
        },
        default: '400'
    },
        field: {
        name: Lampa.Lang.translate('drxaos_font_weight'),
        description: Lampa.Lang.translate('drxaos_font_weight_desc')
    },
        onChange: applyFontWeight
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'drxaos_font_family',
        type: 'select',
        values: FONT_OPTIONS,
        default: 'netflix'
    },
        field: {
        name: Lampa.Lang.translate('drxaos_font_family'),
        description: Lampa.Lang.translate('drxaos_font_family_desc')
    },
        onChange: function() {
        applyFontFamily();
    }
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'poster_glow_intensity',
        type: 'select',
        values: {
            '0': '0px',
            '5': '5px',
            '10': '10px',
            '15': '15px',
            '20': '20px',
            '30': '30px'
        },
        default: '10'
    },
        field: {
        name: Lampa.Lang.translate('poster_glow_intensity'),
        description: Lampa.Lang.translate('poster_glow_intensity_desc')
    },
        onChange: function(v) {
            setAdvancedSetting('posterGlowIntensity', v);
        }
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'poster_animation_speed',
        type: 'select',
        values: {
            '0.1': '0.1s',
            '0.2': '0.2s',
            '0.3': '0.3s',
            '0.5': '0.5s',
            '0.8': '0.8s',
            '1': '1s'
        },
        default: '0.3'
    },
        field: {
        name: Lampa.Lang.translate('animation_speed'),
        description: Lampa.Lang.translate('animation_speed_desc')
    },
        onChange: function(v) {
            setAdvancedSetting('posterAnimationSpeed', v);
        }
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'card_background_opacity',
        type: 'select',
        values: {
            '0': '0%',
            '10': '10%',
            '20': '20%',
            '30': '30%',
            '50': '50%',
            '70': '70%',
            '90': '90%',
            '100': '100%'
        },
        default: '70'
    },
        field: {
        name: Lampa.Lang.translate('card_opacity'),
        description: Lampa.Lang.translate('card_opacity_desc')
    },
        onChange: function(v) {
            setAdvancedSetting('cardBackgroundOpacity', v);
        }
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'hover_scale',
        type: 'select',
        values: {
            '1.0': '1.0x',
            '1.02': '1.02x',
            '1.05': '1.05x',
            '1.08': '1.08x',
            '1.1': '1.1x',
            '1.15': '1.15x',
            '1.2': '1.2x',
            '1.25': '1.25x',
            '1.3': '1.3x'
        },
        default: '1.05'
    },
        field: {
        name: Lampa.Lang.translate('hover_scale'),
        description: Lampa.Lang.translate('hover_scale_desc')
    },
        onChange: function(v) {
            setAdvancedSetting('hoverScale', v);
        }
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'animation_speed',
        type: 'select',
        values: {
            '0.1': 'Очень быстро (0.1с)',
            '0.2': 'Быстро (0.2с)',
            '0.3': 'Средне (0.3с)',
            '0.5': 'Медленно (0.5с)',
            '0.8': 'Очень медленно (0.8с)',
            '1.0': 'Максимально медленно (1.0с)'
        },
        default: '0.3'
    },
        field: {
        name: Lampa.Lang.translate('global_animation_speed'),
        description: Lampa.Lang.translate('global_animation_speed_desc')
    },
        onChange: function(v) {
            setAdvancedSetting('animationSpeed', v);
        }
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'reset_advanced',
        type: 'trigger',
        default: false
    },
        field: {
        name: Lampa.Lang.translate('reset_settings'),
        description: Lampa.Lang.translate('reset_settings_desc')
    },
        onChange: function() {
            advancedSettings = buildAdvancedDefaults();
            saveAdvancedSettings();
            applyAdvancedSettings();
            if (Lampa.Noty) {
                Lampa.Noty.show('✅ Расширенные настройки сброшены!');
            }
        }
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'season_info',
        type: 'select',
        values: {
            'off': 'Выключено',
            'on': 'Включено'
        },
        default: 'on'
    },
        field: {
        name: Lampa.Lang.translate('season_info'),
        description: Lampa.Lang.translate('season_info_desc')
    },
        onChange: applySeasonInfo
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'source_filter',
        type: 'select',
        values: {
            'off': 'Выключено',
            'on': 'Включено'
        },
        default: 'on'
    },
        field: {
        name: Lampa.Lang.translate('source_filter'),
        description: Lampa.Lang.translate('source_filter_desc')
    },
        onChange: applySourceFilter
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'movie_quality',
        type: 'select',
        values: {
            'off': 'Выключено',
            'on': 'Включено'
        },
        default: 'on'
    },
        field: {
        name: Lampa.Lang.translate('movie_quality'),
        description: Lampa.Lang.translate('movie_quality_desc')
    },
        onChange: applyMovieQuality
});
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
            name: 'drxaos_logo_titles',
            type: 'select',
            values: {
                'off': 'Выключено',
                'on': 'Включено'
            },
            default: 'off'
        },
        field: {
            name: 'Лого вместо названий',
            description: 'Показывать логотипы TMDB вместо текстовых заголовков в карточке'
        },
        onChange: function(value) {
            drxaosResetTitleLogoCache();
            if (value !== 'on') {
                drxaosClearRenderedTitleLogos();
            }
        }
    });
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
            name: 'drxaos_original_titles',
            type: 'select',
            values: {
                'off': 'Выключено',
                'on': 'Включено'
            },
            default: 'off'
        },
        field: {
            name: 'Оригинальные названия',
            description: 'Показывать оригинальные названия (EN/RU) под заголовком карточки'
        },
        onChange: function(value) {
            drxaosResetOriginalNamesCache();
            if (value !== 'on') {
                drxaosClearOriginalNameBlock();
            } else {
                var activeRender = null;
                var activeMovie = null;
                try {
                    var activity = Lampa.Activity && Lampa.Activity.active ? Lampa.Activity.active().activity : null;
                    if (activity) {
                        activeRender = typeof activity.render === 'function' ? activity.render() : null;
                        activeMovie = activity.card_data || (activity.item && (activity.item.movie || activity.item)) || null;
                    }
                } catch (e) {}
                if (activeRender && activeMovie) {
                    drxaosHandleOriginalNames(activeMovie, activeRender);
                }
            }
        }
    });
    Lampa.SettingsApi.addParam({
        component: 'drxaos_themes',
        param: {
        name: 'jacred_url',
        type: 'select',
        values: {
            'jacred.xyz': 'jacred.xyz (default)',
            'jacred.net': 'jacred.net',
            'custom': 'Enter custom URL...'
        },
        default: 'jacred.xyz'
    },
        field: {
        name: '🌐 JacRed URL',
        description: Lampa.Lang.translate('jacred_url_desc')
    },
        onChange: function(value) {
        if (value === 'custom') {
            var currentCustomUrl = (Lampa.Storage.get('jacred_url_custom', '') || Lampa.Storage.get('jacred_url', '') || '').trim();
            inputOverlay.open({
                title: Lampa.Lang.translate('drxaos_overlay_jacred_title'),
                message: Lampa.Lang.translate('drxaos_overlay_jacred_hint'),
                value: currentCustomUrl,
                placeholder: Lampa.Lang.translate('drxaos_overlay_jacred_placeholder'),
                saveLabel: Lampa.Lang.translate('drxaos_overlay_save'),
                clearLabel: Lampa.Lang.translate('drxaos_overlay_clear'),
                cancelLabel: Lampa.Lang.translate('drxaos_overlay_cancel')
            }).then(function(result) {
                if (!result || result.action === 'cancel') {
                    Lampa.Storage.set('jacred_url', 'jacred.xyz');
                    applyMovieQuality();
                    scheduleDrxaosApplyAll();
                    return;
                }
                if (result.action === 'clear') {
                    Lampa.Storage.set('jacred_url_custom', '');
                    Lampa.Storage.set('jacred_url', 'jacred.xyz');
                    if (Lampa.Noty) {
                        Lampa.Noty.show(Lampa.Lang.translate('jacred_saved') + 'jacred.xyz');
                    }
                    applyMovieQuality();
                    scheduleDrxaosApplyAll();
                    return;
                }
                if (result.action === 'save') {
                    var newUrl = (result.value || '').trim();
                    if (!newUrl) {
                        Lampa.Storage.set('jacred_url', 'jacred.xyz');
                        applyMovieQuality();
                        scheduleDrxaosApplyAll();
                        return;
                    }
                    newUrl = newUrl.replace(/^https?:\/\//i, '');
                    Lampa.Storage.set('jacred_url_custom', newUrl);
                    Lampa.Storage.set('jacred_url', newUrl);
                    if (Lampa.Noty) {
                        Lampa.Noty.show(Lampa.Lang.translate('jacred_saved') + newUrl);
                    }
                    applyMovieQuality();
                    scheduleDrxaosApplyAll();
                }
            });
            return;
        } else {
            // Выбран один из стандартных
            Lampa.Storage.set('jacred_url', value);
            applyMovieQuality();
            scheduleDrxaosApplyAll();
        }
    }
});
}
var BUTTON_ICON_SVGS = {
    online: '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="28" height="28" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 512 512" data-drxaos-icon="online" aria-hidden="true"><g><path style="opacity:0.972" fill="#57d1c7" d="M 260.5,17.5 C 256.037,22.4646 251.37,27.2979 246.5,32C 247.416,32.2784 248.082,32.7784 248.5,33.5C 241.767,35.7012 235.767,39.2012 230.5,44C 223.84,51.1527 218.174,58.9861 213.5,67.5C 212.883,67.3893 212.383,67.056 212,66.5C 203.579,75.4255 194.746,83.7588 185.5,91.5C 192.452,70.7497 203.119,52.2497 217.5,36C 213.898,36.4156 210.232,36.9156 206.5,37.5C 212.806,31.8604 218.806,25.8604 224.5,19.5C 236.413,17.7964 248.413,17.1297 260.5,17.5 Z" /></g><g><path style="opacity:0.975" fill="#55cac7" d="M 260.5,17.5 C 272.578,17.6199 284.578,18.6199 296.5,20.5C 296.631,21.2389 296.464,21.9056 296,22.5C 289.91,29.0957 283.41,35.0957 276.5,40.5C 268.278,33.7779 258.945,31.4446 248.5,33.5C 248.082,32.7784 247.416,32.2784 246.5,32C 251.37,27.2979 256.037,22.4646 260.5,17.5 Z" /></g><g><path style="opacity:0.967" fill="#5ad7c6" d="M 224.5,19.5 C 218.806,25.8604 212.806,31.8604 206.5,37.5C 189.181,41.7173 172.514,47.7173 156.5,55.5C 164.167,46.8333 171.833,38.1667 179.5,29.5C 194.149,24.6366 209.149,21.3033 224.5,19.5 Z" /></g><g><path style="opacity:0.971" fill="#51c2c7" d="M 296.5,20.5 C 314.572,23.6807 331.905,29.014 348.5,36.5C 345.566,40.7728 342.233,44.7728 338.5,48.5C 323.921,42.6066 308.921,38.44 293.5,36C 302.991,46.6568 310.658,58.4901 316.5,71.5C 311.833,74.1667 308.167,77.8333 305.5,82.5C 298.793,66.4071 289.126,52.4071 276.5,40.5C 283.41,35.0957 289.91,29.0957 296,22.5C 296.464,21.9056 296.631,21.2389 296.5,20.5 Z" /></g><g><path style="opacity:0.972" fill="#5ddcc7" d="M 179.5,29.5 C 171.833,38.1667 164.167,46.8333 156.5,55.5C 143.475,61.6724 131.475,69.339 120.5,78.5C 122.105,81.3138 123.105,84.3138 123.5,87.5C 119.108,91.8972 114.442,95.8972 109.5,99.5C 110.974,89.445 107.307,81.7783 98.5,76.5C 102.798,73.5367 106.798,70.2034 110.5,66.5C 131.335,50.3789 154.335,38.0456 179.5,29.5 Z" /></g><g><path style="opacity:0.967" fill="#4cb7c7" d="M 348.5,36.5 C 359.729,40.7811 370.396,46.1145 380.5,52.5C 377.566,56.7728 374.233,60.7728 370.5,64.5C 360.112,58.6394 349.446,53.3061 338.5,48.5C 342.233,44.7728 345.566,40.7728 348.5,36.5 Z" /></g><g><path style="opacity:0.964" fill="#60e4c7" d="M 110.5,66.5 C 106.798,70.2034 102.798,73.5367 98.5,76.5C 83.3867,71.6936 73.22,76.6936 68,91.5C 66.9318,97.1746 67.7652,102.508 70.5,107.5C 66.5,110.5 62.5,113.5 58.5,116.5C 48.5742,97.9625 51.2409,81.4625 66.5,67C 81.0503,57.1818 95.717,57.0152 110.5,66.5 Z" /></g><g><path style="opacity:0.973" fill="#47acc7" d="M 380.5,52.5 C 387.482,57.1408 394.482,61.8075 401.5,66.5C 411.21,60.0194 421.543,58.3527 432.5,61.5C 428.5,65.8333 424.5,70.1667 420.5,74.5C 408.833,76.1667 402.167,82.8333 400.5,94.5C 396.167,98.5 391.833,102.5 387.5,106.5C 385.461,96.8207 386.461,87.4874 390.5,78.5C 384.192,73.3437 377.525,68.677 370.5,64.5C 374.233,60.7728 377.566,56.7728 380.5,52.5 Z" /></g><g><path style="opacity:0.965" fill="#45a6c7" d="M 432.5,61.5 C 441.451,63.7868 448.451,68.7868 453.5,76.5C 449.227,79.4335 445.227,82.7668 441.5,86.5C 436.836,78.661 429.836,74.661 420.5,74.5C 424.5,70.1667 428.5,65.8333 432.5,61.5 Z" /></g><g><path style="opacity:0.973" fill="#55ccc7" d="M 213.5,67.5 C 203.344,86.1533 195.677,105.82 190.5,126.5C 184.557,134.111 177.891,141.111 170.5,147.5C 170.467,144.164 171.134,140.997 172.5,138C 154.843,134.169 137.843,128.669 121.5,121.5C 126.167,118.833 129.833,115.167 132.5,110.5C 146.271,116.646 160.604,120.979 175.5,123.5C 178.233,112.636 181.566,101.969 185.5,91.5C 194.746,83.7588 203.579,75.4255 212,66.5C 212.383,67.056 212.883,67.3893 213.5,67.5 Z" /></g><g><path style="opacity:0.976" fill="#419fc7" d="M 453.5,76.5 C 458.371,85.4234 459.704,94.7567 457.5,104.5C 449.138,112.86 441.138,121.527 433.5,130.5C 422.806,133.715 412.806,132.382 403.5,126.5C 406.098,122.562 409.098,118.895 412.5,115.5C 427.912,120.045 438.078,114.712 443,99.5C 443.578,95.0451 443.078,90.7117 441.5,86.5C 445.227,82.7668 449.227,79.4335 453.5,76.5 Z" /></g><g><path style="opacity:0.97" fill="#5bd8c7" d="M 123.5,87.5 C 124.769,93.3512 124.769,99.3512 123.5,105.5C 125.878,108.088 128.878,109.755 132.5,110.5C 129.833,115.167 126.167,118.833 121.5,121.5C 119.742,121.123 118.075,120.456 116.5,119.5C 106.485,129.999 94.4845,133.666 80.5,130.5C 84.5,126.167 88.5,121.833 92.5,117.5C 101.566,114.765 107.233,108.765 109.5,99.5C 114.442,95.8972 119.108,91.8972 123.5,87.5 Z" /></g><g><path style="opacity:0.976" fill="#4ab3c7" d="M 316.5,71.5 C 324.714,87.6317 330.881,104.632 335,122.5C 335.383,123.056 335.883,123.389 336.5,123.5C 330.5,129.833 324.5,136.167 318.5,142.5C 303.666,145.259 288.666,146.926 273.5,147.5C 278.5,142.167 283.5,136.833 288.5,131.5C 299.293,130.577 309.96,128.911 320.5,126.5C 316.289,111.534 311.289,96.8673 305.5,82.5C 308.167,77.8333 311.833,74.1667 316.5,71.5 Z" /></g><g><path style="opacity:0.963" fill="#46a9c7" d="M 400.5,94.5 C 400.661,103.836 404.661,110.836 412.5,115.5C 409.098,118.895 406.098,122.562 403.5,126.5C 400.005,124.998 397.171,122.665 395,119.5C 377.475,127.453 359.308,133.62 340.5,138C 339.919,138.893 339.585,139.893 339.5,141C 340.492,145.125 341.159,149.291 341.5,153.5C 337.441,157.565 333.107,161.232 328.5,164.5C 327.471,156.688 325.804,149.021 323.5,141.5C 321.929,142.309 320.262,142.643 318.5,142.5C 324.5,136.167 330.5,129.833 336.5,123.5C 353.988,119.226 370.988,113.56 387.5,106.5C 391.833,102.5 396.167,98.5 400.5,94.5 Z" /></g><g><path style="opacity:0.977" fill="#5ddcc7" d="M 70.5,107.5 C 75.8934,114.863 83.2267,118.196 92.5,117.5C 88.5,121.833 84.5,126.167 80.5,130.5C 77.9333,130.145 75.4333,129.479 73,128.5C 65.939,136.931 60.1056,146.265 55.5,156.5C 46.5531,164.11 37.8865,172.11 29.5,180.5C 36.5336,158.266 46.8669,137.766 60.5,119C 59.6195,118.292 58.9528,117.458 58.5,116.5C 62.5,113.5 66.5,110.5 70.5,107.5 Z" /></g><g><path style="opacity:0.969" fill="#51c3c7" d="M 190.5,126.5 C 200.917,128.423 211.25,130.089 221.5,131.5C 216.438,135.559 212.105,140.226 208.5,145.5C 201.496,144.355 194.496,143.022 187.5,141.5C 184.001,154.66 181.334,167.993 179.5,181.5C 189.144,182.498 198.81,182.832 208.5,182.5C 206.708,183.309 204.708,183.809 202.5,184C 197.963,188.369 193.63,192.869 189.5,197.5C 170.5,197.5 151.5,197.5 132.5,197.5C 129.359,196.679 126.025,196.179 122.5,196C 126.833,191.667 131.167,187.333 135.5,183C 139.688,182.824 143.688,182.324 147.5,181.5C 153.206,181.829 158.872,181.495 164.5,180.5C 165.978,169.286 167.978,158.286 170.5,147.5C 177.891,141.111 184.557,134.111 190.5,126.5 Z" /></g><g><path style="opacity:0.954" fill="#3e98c7" d="M 457.5,104.5 C 456.468,109.732 454.468,114.565 451.5,119C 456.449,126.122 460.782,133.622 464.5,141.5C 462.782,148.189 458.782,150.356 452.5,148C 448.167,141.667 443.833,135.333 439.5,129C 437.428,128.964 435.428,129.464 433.5,130.5C 441.138,121.527 449.138,112.86 457.5,104.5 Z" /></g><g><path style="opacity:0.978" fill="#4dbac7" d="M 221.5,131.5 C 243.838,132.761 266.171,132.761 288.5,131.5C 283.5,136.833 278.5,142.167 273.5,147.5C 251.791,147.89 230.125,147.224 208.5,145.5C 212.105,140.226 216.438,135.559 221.5,131.5 Z" /></g><g><path style="opacity:0.97" fill="#5ad6c7" d="M 55.5,156.5 C 41.1142,185.083 33.4476,215.416 32.5,247.5C 26.0513,251.611 21.0513,256.944 17.5,263.5C 16.6541,235.087 20.6541,207.42 29.5,180.5C 37.8865,172.11 46.5531,164.11 55.5,156.5 Z" /></g><g><path style="opacity:0.99" fill="#44a5c7" d="M 341.5,153.5 C 343.526,162.652 345.192,171.986 346.5,181.5C 341.528,186.807 336.528,192.14 331.5,197.5C 321.833,197.5 312.167,197.5 302.5,197.5C 301.391,196.71 300.058,196.21 298.5,196C 303.037,191.631 307.37,187.131 311.5,182.5C 318.2,182.83 324.866,182.497 331.5,181.5C 330.393,175.856 329.393,170.189 328.5,164.5C 333.107,161.232 337.441,157.565 341.5,153.5 Z" /></g><g><path style="opacity:0.96" fill="#398cc7" d="M 468.5,168.5 C 475.77,167.217 479.937,170.217 481,177.5C 482.556,181.558 483.723,185.725 484.5,190C 483.296,196.106 479.629,198.439 473.5,197C 471.667,196.5 470.5,195.333 470,193.5C 467.861,187.585 466.028,181.585 464.5,175.5C 464.577,172.335 465.91,170.001 468.5,168.5 Z" /></g><g><path style="opacity:0.986" fill="#419fc7" d="M 346.5,181.5 C 357.321,182.495 368.321,182.828 379.5,182.5C 375.37,187.131 371.037,191.631 366.5,196C 363.964,196.186 361.631,196.686 359.5,197.5C 350.167,197.5 340.833,197.5 331.5,197.5C 336.528,192.14 341.528,186.807 346.5,181.5 Z" /></g><g><path style="opacity:0.999" fill="#55cbc7" d="M 147.5,181.5 C 143.688,182.324 139.688,182.824 135.5,183C 131.167,187.333 126.833,191.667 122.5,196C 126.025,196.179 129.359,196.679 132.5,197.5C 118.496,197.333 104.496,197.5 90.5,198C 89.5098,212.088 89.1765,226.255 89.5,240.5C 88.6787,237.359 88.1787,234.025 88,230.5C 83.6667,234.833 79.3333,239.167 75,243.5C 74.8313,228.661 74.3313,213.994 73.5,199.5C 74.1949,189.928 79.1949,184.094 88.5,182C 108.164,181.5 127.831,181.333 147.5,181.5 Z" /></g><g><path style="opacity:0.988" fill="#4cb8c7" d="M 208.5,182.5 C 218.167,182.5 227.833,182.5 237.5,182.5C 233.37,187.131 229.037,191.631 224.5,196C 221.964,196.186 219.631,196.686 217.5,197.5C 208.167,197.5 198.833,197.5 189.5,197.5C 193.63,192.869 197.963,188.369 202.5,184C 204.708,183.809 206.708,183.309 208.5,182.5 Z" /></g><g><path style="opacity:0.986" fill="#49b1c7" d="M 237.5,182.5 C 250.833,182.5 264.167,182.5 277.5,182.5C 273.37,187.131 269.037,191.631 264.5,196C 268.025,196.179 271.359,196.679 274.5,197.5C 255.5,197.5 236.5,197.5 217.5,197.5C 219.631,196.686 221.964,196.186 224.5,196C 229.037,191.631 233.37,187.131 237.5,182.5 Z" /></g><g><path style="opacity:0.986" fill="#47abc7" d="M 277.5,182.5 C 288.833,182.5 300.167,182.5 311.5,182.5C 307.37,187.131 303.037,191.631 298.5,196C 300.058,196.21 301.391,196.71 302.5,197.5C 293.167,197.5 283.833,197.5 274.5,197.5C 271.359,196.679 268.025,196.179 264.5,196C 269.037,191.631 273.37,187.131 277.5,182.5 Z" /></g><g><path style="opacity:0.979" fill="#3f99c7" d="M 379.5,182.5 C 392.167,182.5 404.833,182.5 417.5,182.5C 414.102,187.406 410.102,191.906 405.5,196C 409.356,196.177 413.023,196.677 416.5,197.5C 397.5,197.5 378.5,197.5 359.5,197.5C 361.631,196.686 363.964,196.186 366.5,196C 371.037,191.631 375.37,187.131 379.5,182.5 Z" /></g><g><path style="opacity:0.973" fill="#3c92c7" d="M 417.5,182.5 C 429.025,182.353 435.692,188.019 437.5,199.5C 432.224,203.437 427.224,207.771 422.5,212.5C 422.666,208.154 422.499,203.821 422,199.5C 420.599,197.808 418.766,197.141 416.5,197.5C 413.023,196.677 409.356,196.177 405.5,196C 410.102,191.906 414.102,187.406 417.5,182.5 Z" /></g><g><path style="opacity:0.984" fill="#398cc7" d="M 437.5,199.5 C 437.5,210.5 437.5,221.5 437.5,232.5C 432.869,236.63 428.369,240.963 424,245.5C 423.814,248.036 423.314,250.369 422.5,252.5C 422.5,239.167 422.5,225.833 422.5,212.5C 427.224,207.771 432.224,203.437 437.5,199.5 Z" /></g><g><path style="opacity:0.968" fill="#3480c7" d="M 493.5,250.5 C 488.776,255.229 483.776,259.563 478.5,263.5C 466.345,262.505 454.011,262.171 441.5,262.5C 445.833,257.833 450.167,253.167 454.5,248.5C 462.5,248.5 470.5,248.5 478.5,248.5C 478.05,240.161 477.884,231.828 478,223.5C 481.139,219.423 484.972,218.59 489.5,221C 490.893,222.171 491.727,223.671 492,225.5C 492.974,233.807 493.474,242.141 493.5,250.5 Z" /></g><g><path style="opacity:0.975" fill="#42a0c7" d="M 258.5,268.5 C 262.833,265.167 267.167,261.833 271.5,258.5C 272.159,261.408 272.993,261.742 274,259.5C 278.723,247.053 283.723,234.72 289,222.5C 293.801,218.251 298.134,218.584 302,223.5C 302.701,226.928 302.368,230.262 301,233.5C 294.358,250.43 287.524,267.264 280.5,284C 276.849,287.227 272.849,287.894 268.5,286C 264.523,280.546 261.189,274.713 258.5,268.5 Z" /></g><g><path style="opacity:0.966" fill="#50bfc7" d="M 133.5,253.5 C 129.773,257.233 125.773,260.566 121.5,263.5C 115.378,250.967 110.545,237.967 107,224.5C 110.846,217.534 115.513,216.867 121,222.5C 125.466,232.737 129.633,243.071 133.5,253.5 Z" /></g><g><path style="opacity:0.962" fill="#47adc7" d="M 237.5,257.5 C 233.5,261.167 229.5,264.833 225.5,268.5C 220.439,255.489 215.272,242.489 210,229.5C 209.96,219.885 214.294,217.218 223,221.5C 228.329,233.324 233.162,245.324 237.5,257.5 Z" /></g><g><path style="opacity:0.971" fill="#409cc7" d="M 337.5,249.5 C 334.232,253.271 330.732,256.938 327,260.5C 326.517,261.448 326.351,262.448 326.5,263.5C 321.733,252.721 317.233,241.721 313,230.5C 310.789,224.031 312.956,220.031 319.5,218.5C 321.774,218.97 323.774,219.97 325.5,221.5C 329.694,230.746 333.694,240.08 337.5,249.5 Z" /></g><g><path style="opacity:0.984" fill="#3686c7" d="M 437.5,232.5 C 437.5,237.833 437.5,243.167 437.5,248.5C 443.167,248.5 448.833,248.5 454.5,248.5C 450.167,253.167 445.833,257.833 441.5,262.5C 440.167,262.5 438.833,262.5 437.5,262.5C 434.112,269.58 429.112,275.58 422.5,280.5C 422.5,271.167 422.5,261.833 422.5,252.5C 423.314,250.369 423.814,248.036 424,245.5C 428.369,240.963 432.869,236.63 437.5,232.5 Z" /></g><g><path style="opacity:0.972" fill="#3a8ec7" d="M 362.5,271.5 C 367.105,268.564 371.105,264.898 374.5,260.5C 375.79,259.942 376.623,258.942 377,257.5C 381.471,245.754 386.138,234.087 391,222.5C 393.909,219.606 397.409,218.773 401.5,220C 403.259,221.008 404.426,222.508 405,224.5C 405.192,227.947 404.525,231.28 403,234.5C 396.496,251.668 389.329,268.501 381.5,285C 378.033,287.786 374.366,288.12 370.5,286C 367.44,281.381 364.774,276.547 362.5,271.5 Z" /></g><g><path style="opacity:0.979" fill="#4cb7c7" d="M 194.5,241.5 C 194.565,241.062 194.399,240.728 194,240.5C 182.632,252.035 171.132,263.369 159.5,274.5C 157.108,270.722 154.941,266.722 153,262.5C 148.912,269.676 145.078,277.009 141.5,284.5C 137.001,288.67 132.834,288.336 129,283.5C 126.195,276.914 123.695,270.247 121.5,263.5C 125.773,260.566 129.773,257.233 133.5,253.5C 134.572,255.882 135.738,258.216 137,260.5C 140.333,253.833 143.667,247.167 147,240.5C 151.333,236.5 155.667,236.5 160,240.5C 163.333,247.167 166.667,253.833 170,260.5C 175.049,249.362 179.715,238.029 184,226.5C 187.357,218.875 192.357,217.541 199,222.5C 199.845,229.449 198.345,235.783 194.5,241.5 Z" /></g><g><path style="opacity:0.971" fill="#3c93c7" d="M 374.5,260.5 C 371.105,264.898 367.105,268.564 362.5,271.5C 360.74,268.311 359.24,264.978 358,261.5C 354.061,269.045 350.394,276.712 347,284.5C 342.337,288.753 338.003,288.42 334,283.5C 331.209,276.922 328.709,270.255 326.5,263.5C 326.351,262.448 326.517,261.448 327,260.5C 330.732,256.938 334.232,253.271 337.5,249.5C 338.895,253.515 340.395,257.515 342,261.5C 345.667,254.167 349.333,246.833 353,239.5C 357.264,236.655 361.264,236.988 365,240.5C 368.451,247.067 371.618,253.734 374.5,260.5 Z" /></g><g><path style="opacity:0.974" fill="#4ab1c7" d="M 194.5,241.5 C 189.177,256.31 183.177,270.81 176.5,285C 171.466,288.778 166.966,288.278 163,283.5C 161.729,280.516 160.562,277.516 159.5,274.5C 171.132,263.369 182.632,252.035 194,240.5C 194.399,240.728 194.565,241.062 194.5,241.5 Z" /></g><g><path style="opacity:0.976" fill="#44a5c7" d="M 271.5,258.5 C 267.167,261.833 262.833,265.167 258.5,268.5C 257.763,266.695 256.763,265.029 255.5,263.5C 251.578,270.342 247.912,277.342 244.5,284.5C 240.371,288.455 236.204,288.455 232,284.5C 229.728,279.178 227.561,273.845 225.5,268.5C 229.5,264.833 233.5,261.167 237.5,257.5C 238.158,258.398 238.824,259.398 239.5,260.5C 243.255,253.991 246.755,247.324 250,240.5C 254.604,236.468 258.937,236.801 263,241.5C 265.847,247.193 268.68,252.86 271.5,258.5 Z" /></g><g><path style="opacity:0.984" fill="#54c9c7" d="M 73.5,199.5 C 74.3313,213.994 74.8313,228.661 75,243.5C 79.3333,239.167 83.6667,234.833 88,230.5C 88.1787,234.025 88.6787,237.359 89.5,240.5C 89.5,249.833 89.5,259.167 89.5,268.5C 88.71,267.391 88.21,266.058 88,264.5C 83.6312,269.037 79.1312,273.37 74.5,277.5C 74.5,272.833 74.5,268.167 74.5,263.5C 60.5,263.5 46.5,263.5 32.5,263.5C 33.268,270.483 33.9347,277.483 34.5,284.5C 29.8333,288.5 25.5,292.833 21.5,297.5C 19.1237,286.428 17.7904,275.095 17.5,263.5C 21.0513,256.944 26.0513,251.611 32.5,247.5C 46.1667,247.5 59.8333,247.5 73.5,247.5C 73.5,231.5 73.5,215.5 73.5,199.5 Z" /></g><g><path style="opacity:0.968" fill="#3179c7" d="M 493.5,250.5 C 493.83,262.584 493.164,274.584 491.5,286.5C 485.869,291.63 480.369,296.964 475,302.5C 474.536,301.906 474.369,301.239 474.5,300.5C 476.558,288.249 477.892,275.916 478.5,263.5C 483.776,259.563 488.776,255.229 493.5,250.5 Z" /></g><g><path style="opacity:1" fill="#4fbec7" d="M 89.5,268.5 C 89.5,278.167 89.5,287.833 89.5,297.5C 84.1396,302.194 79.1396,307.194 74.5,312.5C 74.5,300.833 74.5,289.167 74.5,277.5C 79.1312,273.37 83.6312,269.037 88,264.5C 88.21,266.058 88.71,267.391 89.5,268.5 Z" /></g><g><path style="opacity:0.98" fill="#337fc7" d="M 437.5,262.5 C 437.667,279.503 437.5,296.503 437,313.5C 435.684,320.815 431.517,325.648 424.5,328C 408.17,328.5 391.837,328.667 375.5,328.5C 379.833,323.833 384.167,319.167 388.5,314.5C 399.172,314.667 409.839,314.5 420.5,314C 421,313.5 421.5,313 422,312.5C 422.5,301.839 422.667,291.172 422.5,280.5C 429.112,275.58 434.112,269.58 437.5,262.5 Z" /></g><g><path style="opacity:0.972" fill="#51c3c7" d="M 34.5,284.5 C 36.5354,299.509 40.0354,314.176 45,328.5C 46.4668,334.905 43.9668,338.572 37.5,339.5C 34.7862,339.06 32.6195,337.726 31,335.5C 26.5747,323.132 23.408,310.465 21.5,297.5C 25.5,292.833 29.8333,288.5 34.5,284.5 Z" /></g><g><path style="opacity:0.967" fill="#2e73c7" d="M 491.5,286.5 C 490.03,301.703 486.697,316.37 481.5,330.5C 473.535,337.964 465.702,345.631 458,353.5C 457.536,352.906 457.369,352.239 457.5,351.5C 464.595,334.883 470.261,317.883 474.5,300.5C 474.369,301.239 474.536,301.906 475,302.5C 480.369,296.964 485.869,291.63 491.5,286.5 Z" /></g><g><path style="opacity:0.975" fill="#4db8c7" d="M 89.5,297.5 C 89.3341,302.511 89.5007,307.511 90,312.5C 90.5,313 91,313.5 91.5,314C 96.1548,314.499 100.821,314.666 105.5,314.5C 100.771,319.224 96.4373,324.224 92.5,329.5C 81.959,328.625 75.959,322.959 74.5,312.5C 79.1396,307.194 84.1396,302.194 89.5,297.5 Z" /></g><g><path style="opacity:0.986" fill="#49b1c7" d="M 105.5,314.5 C 118.833,314.5 132.167,314.5 145.5,314.5C 141.37,319.131 137.037,323.631 132.5,328C 136.025,328.179 139.359,328.679 142.5,329.5C 125.833,329.5 109.167,329.5 92.5,329.5C 96.4373,324.224 100.771,319.224 105.5,314.5 Z" /></g><g><path style="opacity:0.986" fill="#47abc7" d="M 145.5,314.5 C 156.833,314.5 168.167,314.5 179.5,314.5C 174.833,319.5 170.167,324.5 165.5,329.5C 157.833,329.5 150.167,329.5 142.5,329.5C 139.359,328.679 136.025,328.179 132.5,328C 137.037,323.631 141.37,319.131 145.5,314.5 Z" /></g><g><path style="opacity:0.96" fill="#3f99c7" d="M 247.5,314.5 C 260.167,314.5 272.833,314.5 285.5,314.5C 281.897,319.442 277.897,324.108 273.5,328.5C 260.5,328.5 247.5,328.5 234.5,328.5C 238.833,323.833 243.167,319.167 247.5,314.5 Z" /></g><g><path style="opacity:0.971" fill="#3c92c7" d="M 285.5,314.5 C 297.167,314.5 308.833,314.5 320.5,314.5C 316.167,319.167 311.833,323.833 307.5,328.5C 296.167,328.5 284.833,328.5 273.5,328.5C 277.897,324.108 281.897,319.442 285.5,314.5 Z" /></g><g><path style="opacity:0.971" fill="#398cc7" d="M 320.5,314.5 C 333.833,314.5 347.167,314.5 360.5,314.5C 358.369,315.314 356.036,315.814 353.5,316C 345.632,324.036 337.632,331.869 329.5,339.5C 329.942,335.846 330.276,332.179 330.5,328.5C 322.833,328.5 315.167,328.5 307.5,328.5C 311.833,323.833 316.167,319.167 320.5,314.5 Z" /></g><g><path style="opacity:0.974" fill="#3686c7" d="M 360.5,314.5 C 369.833,314.5 379.167,314.5 388.5,314.5C 384.167,319.167 379.833,323.833 375.5,328.5C 365.833,328.5 356.167,328.5 346.5,328.5C 344.961,340.609 342.961,352.609 340.5,364.5C 333.195,370.47 326.195,376.803 319.5,383.5C 309.782,382.244 300.115,380.911 290.5,379.5C 294.5,375.167 298.5,370.833 302.5,366.5C 309.47,366.805 316.304,367.805 323,369.5C 325.86,359.703 328.027,349.703 329.5,339.5C 337.632,331.869 345.632,324.036 353.5,316C 356.036,315.814 358.369,315.314 360.5,314.5 Z" /></g><g><path style="opacity:0.981" fill="#2c6dc7" d="M 481.5,330.5 C 474.692,352.781 464.692,373.448 451.5,392.5C 448.833,397.167 445.167,400.833 440.5,403.5C 434.989,396.415 427.656,393.082 418.5,393.5C 422.897,389.108 426.897,384.442 430.5,379.5C 433.25,380.191 435.917,381.191 438.5,382.5C 445.612,372.604 451.945,362.27 457.5,351.5C 457.369,352.239 457.536,352.906 458,353.5C 465.702,345.631 473.535,337.964 481.5,330.5 Z" /></g><g><path style="opacity:0.979" fill="#43a3c7" d="M 179.5,314.5 C 202.167,314.5 224.833,314.5 247.5,314.5C 243.167,319.167 238.833,323.833 234.5,328.5C 216.155,328.167 197.821,328.5 179.5,329.5C 180.632,334.091 181.299,338.758 181.5,343.5C 181.657,344.873 181.49,346.207 181,347.5C 176.896,351.095 173.396,355.095 170.5,359.5C 168.29,349.72 166.624,339.72 165.5,329.5C 170.167,324.5 174.833,319.5 179.5,314.5 Z" /></g><g><path style="opacity:0.969" fill="#429fc7" d="M 181.5,343.5 C 183.098,352.142 185.098,360.808 187.5,369.5C 189.071,368.691 190.738,368.357 192.5,368.5C 187.175,375.157 181.509,381.49 175.5,387.5C 159.862,391.157 144.528,395.824 129.5,401.5C 128.761,401.631 128.094,401.464 127.5,401C 134.369,394.298 141.036,387.465 147.5,380.5C 155.518,377.409 163.851,375.076 172.5,373.5C 171.704,368.853 171.037,364.186 170.5,359.5C 173.396,355.095 176.896,351.095 181,347.5C 181.49,346.207 181.657,344.873 181.5,343.5 Z" /></g><g><path style="opacity:0.961" fill="#3c92c6" d="M 236.5,363.5 C 248.167,363.5 259.833,363.5 271.5,363.5C 267.37,368.131 263.037,372.631 258.5,377C 260.058,377.21 261.391,377.71 262.5,378.5C 249.152,378.389 235.819,378.723 222.5,379.5C 227.562,374.443 232.228,369.11 236.5,363.5 Z" /></g><g><path style="opacity:0.976" fill="#398cc7" d="M 271.5,363.5 C 282.046,363.794 292.379,364.794 302.5,366.5C 298.5,370.833 294.5,375.167 290.5,379.5C 281.174,379 271.841,378.667 262.5,378.5C 261.391,377.71 260.058,377.21 258.5,377C 263.037,372.631 267.37,368.131 271.5,363.5 Z" /></g><g><path style="opacity:0.969" fill="#337fc7" d="M 340.5,364.5 C 339.477,367.393 339.477,370.226 340.5,373C 348.134,374.57 355.467,376.737 362.5,379.5C 359.5,383.5 356.5,387.5 353.5,391.5C 347.58,389.684 341.58,388.518 335.5,388C 332.505,398.823 328.838,409.323 324.5,419.5C 315.535,427.964 306.702,436.631 298,445.5C 297.601,445.272 297.435,444.938 297.5,444.5C 307.413,425.605 315.079,405.772 320.5,385C 320.43,384.235 320.097,383.735 319.5,383.5C 326.195,376.803 333.195,370.47 340.5,364.5 Z" /></g><g><path style="opacity:0.982" fill="#3f99c7" d="M 236.5,363.5 C 232.228,369.11 227.562,374.443 222.5,379.5C 211.733,380.513 201.066,382.179 190.5,384.5C 192.658,391.469 194.658,398.469 196.5,405.5C 192.102,408.895 188.436,412.895 185.5,417.5C 181.257,407.885 177.923,397.885 175.5,387.5C 181.509,381.49 187.175,375.157 192.5,368.5C 207.049,365.957 221.716,364.291 236.5,363.5 Z" /></g><g><path style="opacity:0.975" fill="#4ab2c7" d="M 79.5,380.5 C 71.8333,388.833 63.8333,396.833 55.5,404.5C 56.4778,400.377 58.1445,396.543 60.5,393C 55.214,384.265 50.0473,375.432 45,366.5C 43.4855,356.842 47.3188,353.675 56.5,357C 62,365.833 67.5,374.667 73,383.5C 74.9935,382.086 77.1602,381.086 79.5,380.5 Z" /></g><g><path style="opacity:0.962" fill="#47abc7" d="M 109.5,385.5 C 105.463,388.537 102.129,392.203 99.5,396.5C 83.8411,390.579 73.3411,395.579 68,411.5C 67.0934,420.679 70.2601,428.012 77.5,433.5C 74.0985,436.895 71.0985,440.562 68.5,444.5C 61.8547,440.253 57.3547,434.253 55,426.5C 52.8501,418.956 53.0168,411.623 55.5,404.5C 63.8333,396.833 71.8333,388.833 79.5,380.5C 90.3336,377.956 100.334,379.623 109.5,385.5 Z" /></g><g><path style="opacity:0.975" fill="#2e72c7" d="M 430.5,379.5 C 426.897,384.442 422.897,389.108 418.5,393.5C 409.875,396.125 404.208,401.792 401.5,410.5C 396.833,414.833 392.167,419.167 387.5,423.5C 386.191,417.629 386.191,411.629 387.5,405.5C 384.96,403.062 381.96,401.395 378.5,400.5C 381.434,396.227 384.767,392.227 388.5,388.5C 390.84,389.086 393.007,390.086 395,391.5C 404.482,380.839 416.315,376.839 430.5,379.5 Z" /></g><g><path style="opacity:0.982" fill="#3079c7" d="M 362.5,379.5 C 371.46,381.709 380.126,384.709 388.5,388.5C 384.767,392.227 381.434,396.227 378.5,400.5C 370.232,397.3 361.898,394.3 353.5,391.5C 356.5,387.5 359.5,383.5 362.5,379.5 Z" /></g><g><path style="opacity:0.968" fill="#2866c7" d="M 451.5,392.5 C 463.682,411.792 461.349,429.292 444.5,445C 430.236,453.496 415.902,453.663 401.5,445.5C 404.5,441.5 407.5,437.5 410.5,433.5C 426.148,439.789 436.981,435.123 443,419.5C 444.068,413.825 443.235,408.492 440.5,403.5C 445.167,400.833 448.833,397.167 451.5,392.5 Z" /></g><g><path style="opacity:0.966" fill="#43a1c7" d="M 147.5,380.5 C 141.036,387.465 134.369,394.298 127.5,401C 128.094,401.464 128.761,401.631 129.5,401.5C 128.359,402.339 127.026,403.006 125.5,403.5C 125.167,404.5 124.833,405.5 124.5,406.5C 126.544,415.858 125.211,424.691 120.5,433C 122.323,433.997 123.99,435.164 125.5,436.5C 122.871,439.631 120.038,442.631 117,445.5C 116.805,446.819 116.972,448.153 117.5,449.5C 115.454,447.721 113.287,446.054 111,444.5C 99.9817,451.921 88.1484,453.421 75.5,449C 72.7613,447.974 70.428,446.474 68.5,444.5C 71.0985,440.562 74.0985,436.895 77.5,433.5C 89.8916,439.089 100.058,436.422 108,425.5C 112.905,413.395 110.072,403.728 99.5,396.5C 102.129,392.203 105.463,388.537 109.5,385.5C 112.431,387.091 115.098,389.091 117.5,391.5C 127.228,387.036 137.228,383.369 147.5,380.5 Z" /></g><g><path style="opacity:0.967" fill="#3c93c7" d="M 196.5,405.5 C 199.675,413.012 202.675,420.679 205.5,428.5C 202.94,432.57 199.773,436.236 196,439.5C 195.329,438.748 194.496,438.414 193.5,438.5C 190.045,431.8 187.378,424.8 185.5,417.5C 188.436,412.895 192.102,408.895 196.5,405.5 Z" /></g><g><path style="opacity:0.98" fill="#2c6ec7" d="M 401.5,410.5 C 400.351,415.275 400.851,419.941 403,424.5C 405.335,427.665 407.835,430.665 410.5,433.5C 407.5,437.5 404.5,441.5 401.5,445.5C 384.658,457.429 366.658,467.596 347.5,476C 341.981,478.34 336.314,480.173 330.5,481.5C 338.833,472.833 347.167,464.167 355.5,455.5C 367.961,449.039 379.628,441.372 390.5,432.5C 388.895,429.686 387.895,426.686 387.5,423.5C 392.167,419.167 396.833,414.833 401.5,410.5 Z" /></g><g><path style="opacity:0.963" fill="#398dc7" d="M 205.5,428.5 C 209.565,436.294 213.898,443.96 218.5,451.5C 214.473,454.86 210.806,458.527 207.5,462.5C 202.329,454.828 197.662,446.828 193.5,438.5C 194.496,438.414 195.329,438.748 196,439.5C 199.773,436.236 202.94,432.57 205.5,428.5 Z" /></g><g><path style="opacity:0.976" fill="#3179c6" d="M 324.5,419.5 C 317.914,440.18 307.58,458.68 293.5,475C 296.206,474.959 298.872,474.459 301.5,473.5C 301.611,474.117 301.944,474.617 302.5,475C 296.964,480.369 291.63,485.869 286.5,491.5C 274.714,493.238 262.714,493.905 250.5,493.5C 255.297,488.202 260.297,483.035 265.5,478C 265.272,477.601 264.938,477.435 264.5,477.5C 269.74,474.87 274.74,471.704 279.5,468C 286.13,460.551 292.13,452.718 297.5,444.5C 297.435,444.938 297.601,445.272 298,445.5C 306.702,436.631 315.535,427.964 324.5,419.5 Z" /></g><g><path style="opacity:0.979" fill="#3f99c7" d="M 125.5,436.5 C 133.7,442.097 142.033,447.43 150.5,452.5C 145.833,455.167 142.167,458.833 139.5,463.5C 131.899,459.228 124.566,454.561 117.5,449.5C 116.972,448.153 116.805,446.819 117,445.5C 120.038,442.631 122.871,439.631 125.5,436.5 Z" /></g><g><path style="opacity:0.976" fill="#3687c7" d="M 218.5,451.5 C 222.747,458.084 227.747,464.084 233.5,469.5C 226.775,476.221 220.442,483.221 214.5,490.5C 203.777,488.153 193.111,485.486 182.5,482.5C 185.963,478.536 189.63,474.702 193.5,471C 191.657,470.841 190.991,470.341 191.5,469.5C 200.175,471.672 208.842,473.505 217.5,475C 213.953,470.959 210.62,466.792 207.5,462.5C 210.806,458.527 214.473,454.86 218.5,451.5 Z" /></g><g><path style="opacity:0.962" fill="#3b91c7" d="M 150.5,452.5 C 163.891,459.035 177.558,464.702 191.5,469.5C 190.991,470.341 191.657,470.841 193.5,471C 189.63,474.702 185.963,478.536 182.5,482.5C 167.585,477.527 153.251,471.193 139.5,463.5C 142.167,458.833 145.833,455.167 150.5,452.5 Z" /></g><g><path style="opacity:0.966" fill="#2e73c7" d="M 355.5,455.5 C 347.167,464.167 338.833,472.833 330.5,481.5C 316.434,486.983 301.767,490.316 286.5,491.5C 291.63,485.869 296.964,480.369 302.5,475C 301.944,474.617 301.611,474.117 301.5,473.5C 320.25,469.694 338.25,463.694 355.5,455.5 Z" /></g><g><path style="opacity:0.969" fill="#3480c7" d="M 233.5,469.5 C 242.562,477.076 252.895,479.743 264.5,477.5C 264.938,477.435 265.272,477.601 265.5,478C 260.297,483.035 255.297,488.202 250.5,493.5C 238.423,493.38 226.423,492.38 214.5,490.5C 220.442,483.221 226.775,476.221 233.5,469.5 Z" /></g></svg>',
    torrent: '<svg data-drxaos-icon="torrent" width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#4caf50" fill-rule="evenodd" d="M23.501,44.125c11.016,0,20-8.984,20-20 c0-11.015-8.984-20-20-20c-11.016,0-20,8.985-20,20C3.501,35.141,12.485,44.125,23.501,44.125z" clip-rule="evenodd"/><path fill="#ffffff" fill-rule="evenodd" d="M43.252,27.114C39.718,25.992,38.055,19.625,34,11l-7,1.077 c1.615,4.905,8.781,16.872,0.728,18.853C20.825,32.722,17.573,20.519,15,14l-8,2l10.178,27.081c1.991,0.67,4.112,1.044,6.323,1.044 c0.982,0,1.941-0.094,2.885-0.232l-4.443-8.376c6.868,1.552,12.308-0.869,12.962-6.203c1.727,2.29,4.089,3.183,6.734,3.172 C42.419,30.807,42.965,29.006,43.252,27.114z" clip-rule="evenodd"/></svg>',
    play: '<svg data-drxaos-icon="play" width="28" height="28" viewBox="0 0 847 847" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="423" cy="423" r="398" fill="#3498db"/><path d="M642 423 467 322 292 221v404l175-101z" fill="#ffffff" stroke="#ffffff" stroke-width="42.33" stroke-linejoin="round"/></svg>',
    trailer: '<svg data-drxaos-icon="trailer" width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M23.5 7.2c0-.8-.3-1.6-1-2.3-.8-.9-1.8-1-2.2-1.1C17.4 3.5 12 3.5 12 3.5s-5.4 0-8.3.3c-.4 0-1.5.1-2.2 1.1-.7.7-1 1.5-1 2.3C0 10.1 0 12 0 12s0 1.9.5 4.8c0 .8.3 1.6 1 2.3.8.9 1.9 1 2.3 1.1 1.7.2 8.3.3 8.3.3s5.4 0 8.3-.3c.4 0 1.5-.1 2.2-1.1.7-.7 1-1.5 1-2.3.5-2.9.5-4.8.5-4.8s0-1.9-.5-4.8z" fill="#ff0000"/><polygon points="10,8 16,12 10,16" fill="#ffffff"/></svg>',
    book: '<svg data-drxaos-icon="book" width="21" height="32" viewBox="0 0 21 32" fill="none"><path d="M2 1.5H19C19.2761 1.5 19.5 1.72386 19.5 2V27.9618C19.5 28.3756 19.0261 28.6103 18.697 28.3595L12.6212 23.7303C11.3682 22.7757 9.63183 22.7757 8.37885 23.7303L2.30302 28.3595C1.9739 28.6103 1.5 28.3756 1.5 27.9618V2C1.5 1.72386 1.72386 1.5 2 1.5Z" fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/></svg>',
    reaction: '<svg data-drxaos-icon="reaction" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.55 3.4 6.44 8.55 11.05L12 20.35l1.45-0.81C18.6 14.94 22 12.05 22 8.5 22 5.42 19.58 3 16.5 3z" fill="#EC4899"/></svg>',
    subscribe: '<svg data-drxaos-icon="subscribe" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z" fill="#22C55E"/><path d="M18 16v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.83 1.83A1 1 0 0 0 5 19h14a1 1 0 0 0 .71-1.71L18 16z" fill="#34D399"/></svg>',
    options: '<svg data-drxaos-icon="options" width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="2" fill="#CBD5F5"/><circle cx="12" cy="12" r="2" fill="#CBD5F5"/><circle cx="19" cy="12" r="2" fill="#CBD5F5"/></svg>'
};

function applyButtonIcons(scope) {
    try {
        if (!window.jQuery || !window.$) return;
        var $root = scope ? $(scope) : $(document.body || document);
        $root.find('.full-start__button.drxaos-btn .full-start__button-icon, .full-start__button.drxaos-btn .button__icon').remove();
        $root.find('.full-start__button.view--online, .full-start__button.view--streamv1, .lampac--button, .full-start__button.drxaos-btn--online').each(function() {
            var $btn = $(this);
            var svg = $btn.find('svg[data-drxaos-icon]').first();
            if (!svg.length) svg = $btn.find('svg').first();
            if (svg.length && svg.attr('data-drxaos-icon') === 'online') return;
            if (svg.length) svg.replaceWith(BUTTON_ICON_SVGS.online);
            else $btn.prepend(BUTTON_ICON_SVGS.online);
        });
        $root.find('.full-start__button[class*="torrent"], .full-start__button.view--torrent, .full-start__button.drxaos-btn--torrent').each(function() {
            var $btn = $(this);
            var svg = $btn.find('svg[data-drxaos-icon]').first();
            if (!svg.length) svg = $btn.find('svg').first();
            if (svg.length && svg.attr('data-drxaos-icon') === 'torrent') return;
            if (svg.length) svg.replaceWith(BUTTON_ICON_SVGS.torrent);
            else $btn.prepend(BUTTON_ICON_SVGS.torrent);
        });
        $root.find('.full-start__button[class*="play"], .full-start__button.button--play, .full-start__button.open--menu, .full-start__button.drxaos-btn--play').each(function() {
            var $btn = $(this);
            var svg = $btn.find('svg[data-drxaos-icon]').first();
            if (!svg.length) svg = $btn.find('svg').first();
            if (svg.length && svg.attr('data-drxaos-icon') === 'play') return;
            if (svg.length) svg.replaceWith(BUTTON_ICON_SVGS.play);
            else $btn.prepend(BUTTON_ICON_SVGS.play);
        });
        $root.find('.full-start__button[class*="trailer"], .full-start__button.view--trailer, .full-start__button.drxaos-btn--trailer').each(function() {
            var $btn = $(this);
            var svg = $btn.find('svg[data-drxaos-icon]').first();
            if (!svg.length) svg = $btn.find('svg').first();
            if (svg.length && svg.attr('data-drxaos-icon') === 'trailer') return;
            if (svg.length) svg.replaceWith(BUTTON_ICON_SVGS.trailer);
            else $btn.prepend(BUTTON_ICON_SVGS.trailer);
        });
        $root.find('.full-start__button[class*="book"], .full-start__button.button--book, .full-start__button.drxaos-btn--book').each(function() {
            var $btn = $(this);
            var svg = $btn.find('svg[data-drxaos-icon]').first();
            if (!svg.length) svg = $btn.find('svg').first();
            if (svg.length && svg.attr('data-drxaos-icon') === 'book') return;
            if (svg.length) svg.replaceWith(BUTTON_ICON_SVGS.book);
            else $btn.prepend(BUTTON_ICON_SVGS.book);
        });
        $root.find('.full-start__button[class*="reaction"], .full-start__button.button--reaction, .full-start__button.drxaos-btn--reaction').each(function() {
            var $btn = $(this);
            var svg = $btn.find('svg[data-drxaos-icon]').first();
            if (!svg.length) svg = $btn.find('svg').first();
            if (svg.length && svg.attr('data-drxaos-icon') === 'reaction') return;
            if (svg.length) svg.replaceWith(BUTTON_ICON_SVGS.reaction);
            else $btn.prepend(BUTTON_ICON_SVGS.reaction);
        });
        $root.find('.full-start__button[class*="subscribe"], .full-start__button.button--subscribe, .full-start__button.drxaos-btn--subscribe').each(function() {
            var $btn = $(this);
            var svg = $btn.find('svg[data-drxaos-icon]').first();
            if (!svg.length) svg = $btn.find('svg').first();
            if (svg.length && svg.attr('data-drxaos-icon') === 'subscribe') return;
            if (svg.length) svg.replaceWith(BUTTON_ICON_SVGS.subscribe);
            else $btn.prepend(BUTTON_ICON_SVGS.subscribe);
        });
        $root.find('.full-start__button[class*="options"], .full-start__button.button--options, .full-start__button.drxaos-btn--options').each(function() {
            var $btn = $(this);
            var svg = $btn.find('svg[data-drxaos-icon]').first();
            if (!svg.length) svg = $btn.find('svg').first();
            if (svg.length && svg.attr('data-drxaos-icon') === 'options') return;
            if (svg.length) svg.replaceWith(BUTTON_ICON_SVGS.options);
            else $btn.prepend(BUTTON_ICON_SVGS.options);
        });
    } catch(e) {
        logError('Error applying button icons:', e);
    }
}
function pinSettingsComponentTop() {
    try {
        if (!window.jQuery || !window.$) return;
        if (!Lampa || !Lampa.Settings || !Lampa.Settings.listener) return;
        function ensureTop(body) {
            try {
                var $root = body ? $(body) : $('.settings .settings__body > div').first();
                if (!$root.length) return;
                var $folder = $root.children('.settings-folder[data-component="drxaos_themes"]').first();
                if (!$folder.length) $folder = $root.find('.settings-folder[data-component="drxaos_themes"]').first();
                if (!$folder.length) return;
                var $parent = $folder.parent();
                if (!$parent.length) return;
                if ($parent.children().first()[0] !== $folder[0]) {
                    $folder.prependTo($parent);
                }
            } catch(err) {
                logError('Error ensuring settings order:', err);
            }
        }
        Lampa.Settings.listener.follow('open', function(e) {
            if (e.name === 'main') {
                setTimeout(function() { ensureTop(e.body); }, 0);
                setTimeout(function() { ensureTop(e.body); }, 200);
            }
        });
        ensureTop();
    } catch(e) {
        logError('Error pinning settings component:', e);
    }
}
function applyActionButtonStyles() {
    try {
        styleManager.setStyle('drxaos-action-buttons', `
            :root {
                --drxaos-chip-min-height: clamp(22px, 2.5vw, 28px);
                --drxaos-chip-radius: clamp(8px, 1.5vw, 10px);
                --drxaos-chip-gap: clamp(0.15rem, 0.15vw, 0.15rem);
                --drxaos-btn-size: clamp(46px, 11vw, 56px);
            }
            .full-start-new__buttons.drxaos-buttons-unwrapped,
            .full-start__buttons.drxaos-buttons-unwrapped {
                display: flex !important;
                flex-wrap: wrap !important;
                align-items: center !important;
                justify-content: flex-start !important;
                gap: var(--drxaos-chip-gap) !important;
                width: -moz-fit-content !important;
                width: fit-content !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: clamp(0.15rem, 0.6vw, 0.4rem) 0 !important;
                background: none !important;
                border: none !important;
                box-shadow: none !important;
                flex: 0 0 auto !important;
                align-self: flex-start !important;
            }
            .full-start-new__buttons::-webkit-scrollbar,
            .full-start__buttons::-webkit-scrollbar {
                display: none;
            }
            .full-start__button.drxaos-btn {
                position: relative;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 0 !important;
                flex: 0 0 auto !important;
                width: var(--drxaos-btn-size) !important;
                min-width: var(--drxaos-btn-size) !important;
                height: var(--drxaos-btn-size) !important;
                min-height: var(--drxaos-btn-size) !important;
                padding: 0 !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, rgba(var(--bg-rgb, 10, 14, 24), 0.88), rgba(var(--primary-rgb, 48, 65, 124), 0.32)) !important;
                border: 1px solid rgba(var(--primary-rgb, 48, 65, 124), 0.4) !important;
                box-shadow: 0 16px 32px rgba(6, 9, 18, 0.45) !important;
                color: var(--text-main, #f8fafc) !important;
                font-family: var(--drxaos-font-family) !important;
                font-size: 0 !important;
                overflow: hidden !important;
                cursor: pointer !important;
                transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease !important;
                backface-visibility: hidden;
            }
            .full-start__button.drxaos-btn svg {
                flex: 0 0 auto;
                width: clamp(22px, 5vw, 28px) !important;
                height: clamp(22px, 5vw, 28px) !important;
                filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45));
            }
            .full-start__button.drxaos-btn span {
                display: none !important;
            }
            .full-start__button.drxaos-btn.drxaos-expanded,
            .full-start__button.drxaos-btn:hover,
            .full-start__button.drxaos-btn:focus,
            .full-start__button.drxaos-btn.focus {
                transform: translateY(-1px) !important;
                box-shadow: 0 18px 32px rgba(6, 9, 18, 0.5) !important;
                filter: brightness(1.05);
            }
            .full-start__button.drxaos-btn.drxaos-expanded {
                width: var(--drxaos-btn-size) !important;
                min-width: var(--drxaos-btn-size) !important;
                height: var(--drxaos-btn-size) !important;
                min-height: var(--drxaos-btn-size) !important;
                padding: 0 !important;
            }
            .full-start__button.drxaos-external {
                position: relative;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 0 !important;
                flex: 0 0 auto !important;
                width: var(--drxaos-btn-size) !important;
                min-width: var(--drxaos-btn-size) !important;
                height: var(--drxaos-btn-size) !important;
                min-height: var(--drxaos-btn-size) !important;
                padding: 0 !important;
                border-radius: 50% !important;
                background: linear-gradient(135deg, rgba(var(--bg-rgb, 10, 14, 24), 0.88), rgba(var(--primary-rgb, 48, 65, 124), 0.32)) !important;
                border: 1px solid rgba(var(--primary-rgb, 48, 65, 124), 0.4) !important;
                box-shadow: 0 16px 32px rgba(6, 9, 18, 0.45) !important;
                color: var(--text-main, #f8fafc) !important;
                font-size: 0 !important;
                overflow: hidden !important;
                cursor: pointer !important;
                transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease !important;
                pointer-events: auto !important;
            }
            .full-start__button.drxaos-external svg {
                flex: 0 0 auto;
                width: clamp(20px, 5vw, 26px) !important;
                height: clamp(20px, 5vw, 26px) !important;
                filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45));
            }
            .full-start__button.drxaos-external span {
                display: none !important;
            }
            .full-start__button.drxaos-btn--external span {
                display: none !important;
            }
            .full-start__button.drxaos-btn--play {
                background: linear-gradient(135deg, rgba(51, 153, 255, 0.32), rgba(30, 64, 175, 0.26)) !important;
                border-color: rgba(59, 130, 246, 0.48) !important;
                color: #ffffff !important;
            }
            .full-start__button.drxaos-btn--online {
                background: linear-gradient(135deg, rgba(20, 184, 166, 0.28), rgba(14, 165, 233, 0.26)) !important;
                border-color: rgba(14, 165, 233, 0.45) !important;
            }
            .full-start__button.drxaos-btn--torrent {
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.28), rgba(22, 163, 74, 0.22)) !important;
                border-color: rgba(34, 197, 94, 0.42) !important;
            }
            .full-start__button.drxaos-btn--trailer {
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.32), rgba(220, 38, 38, 0.24)) !important;
                border-color: rgba(239, 68, 68, 0.45) !important;
                color: #ffffff !important;
            }
            .full-start__button.drxaos-btn--book {
                background: linear-gradient(135deg, rgba(250, 204, 21, 0.26), rgba(250, 204, 21, 0.18)) !important;
                border-color: rgba(250, 204, 21, 0.38) !important;
                color: #1f1f1f !important;
            }
            .full-start__button.drxaos-btn--reaction {
                background: linear-gradient(135deg, rgba(236, 72, 153, 0.26), rgba(249, 168, 212, 0.2)) !important;
                border-color: rgba(236, 72, 153, 0.38) !important;
            }
            .full-start__button.drxaos-btn--subscribe {
                background: linear-gradient(135deg, rgba(34, 197, 94, 0.24), rgba(74, 222, 128, 0.2)) !important;
                border-color: rgba(34, 197, 94, 0.36) !important;
                color: #f6fff8 !important;
            }
            .full-start__button.drxaos-btn--options {
                flex: 0 0 auto !important;
            }
            .drxaos-title-logo {
                max-height: 125px !important;
                object-fit: contain !important;
            }
            .drxaos-original-title-block {
                margin-top: 0.2em !important;
                text-align: left !important;
                font-size: 1.05em !important;
                line-height: 1.4 !important;
                width: 100% !important;
            }
            .drxaos-original-title-block div {
                height: auto !important;
            }
            .full-start-new__tagline.full--tagline {
                display: none !important;
                height: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            .full-start__button.drxaos-external.button--comment {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: var(--drxaos-btn-size) !important;
                min-width: var(--drxaos-btn-size) !important;
                height: var(--drxaos-btn-size) !important;
                min-height: var(--drxaos-btn-size) !important;
                border-radius: 50% !important;
                padding: 0 !important;
                gap: 0 !important;
                background: linear-gradient(135deg, rgba(var(--bg-rgb, 10, 14, 24), 0.88), rgba(var(--primary-rgb, 48, 65, 124), 0.32)) !important;
                border: 1px solid rgba(var(--primary-rgb, 48, 65, 124), 0.4) !important;
                box-shadow: 0 16px 32px rgba(6, 9, 18, 0.45) !important;
                color: var(--text-main, #f8fafc) !important;
                font-size: 0 !important;
                overflow: hidden !important;
            }
            .full-start__button.drxaos-external.button--comment span {
                display: none !important;
            }
            .full-start__button.drxaos-external.button--comment svg {
                width: clamp(20px, 5vw, 26px) !important;
                height: clamp(20px, 5vw, 26px) !important;
            }
            .full-start__button.drxaos-btn--online { order: 10 !important; }
            .full-start__button.drxaos-btn--torrent { order: 20 !important; }
            .full-start__button.drxaos-btn--trailer { order: 30 !important; }
            .full-start__button.drxaos-btn--play { order: 40 !important; }
            .full-start__button.drxaos-btn--book { order: 50 !important; }
            .full-start__button.drxaos-btn--reaction { order: 60 !important; }
            .full-start__button.drxaos-btn--subscribe { order: 70 !important; }
            .full-start__button.drxaos-btn--options { order: 90 !important; }
        `);
    } catch (e) {
        logError('Error applying action button styles', e);
    }
}

function attachDrxaosButtonExpansion(btn) {
    if (!btn || btn.dataset.drxaosExpandBound === '1') return;
    var collapseTimer = null;
    function expand() {
        clearTimeout(collapseTimer);
        btn.classList.add('drxaos-expanded');
    }
    function scheduleCollapse(delay) {
        clearTimeout(collapseTimer);
        collapseTimer = setTimeout(function() {
            btn.classList.remove('drxaos-expanded');
        }, delay || 140);
    }
    btn.addEventListener('pointerenter', expand);
    btn.addEventListener('pointerleave', function() { scheduleCollapse(140); });
    btn.addEventListener('mouseenter', expand);
    btn.addEventListener('mouseleave', function() { scheduleCollapse(140); });
    btn.addEventListener('touchstart', function() { expand(); });
    btn.addEventListener('touchend', function() { scheduleCollapse(200); }, { passive: true });
    btn.addEventListener('touchcancel', function() { scheduleCollapse(200); }, { passive: true });
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (btn.classList.contains('focus') || btn.classList.contains('hover') || btn.matches(':hover')) expand();
                else scheduleCollapse(120);
            }
        });
    });
    try {
        observer.observe(btn, { attributes: true, attributeFilter: ['class'] });
    } catch (e) {}
    btn.dataset.drxaosExpandBound = '1';
    btn._drxaosExpandObserver = observer;
    if (btn.classList.contains('focus') || btn.matches(':hover')) {
        expand();
    }
}

function syncActionButtons(context) {
    try {
        performanceMonitor.start('syncActionButtons');
        context = context || document.body;

        var root = context;
        if (window.jQuery && root instanceof window.jQuery) {
            root = root[0];
        } else if (Array.isArray(root)) {
            root = root.find(function(node) {
                return node && typeof node.querySelector === 'function';
            });
        }
        if (root && root.render && typeof root.render === 'function') {
            try {
                var rendered = root.render();
                if (rendered && typeof rendered.querySelector === 'function') {
                    root = rendered;
                }
            } catch (renderErr) {}
        }
        if (!root || typeof root.querySelector !== 'function') {
            root = document.body || document;
        }

        var container = root && root.querySelector ? root.querySelector('.full-start__buttons, .full-start-new__buttons') : null;
        if (!container && document && document.querySelector) {
            container = document.querySelector('.full-start__buttons, .full-start-new__buttons');
        }
        if (!container) return;

        if (root && root.querySelectorAll) {
            var secondaryContainers = Array.from(root.querySelectorAll('.buttons--container'));
            secondaryContainers.forEach(function(extraContainer) {
                var extraButtons = Array.from(extraContainer.querySelectorAll('.full-start__button'));
                extraButtons.forEach(function(extraBtn) {
                    if (extraBtn && extraBtn.parentNode !== container) {
                        container.appendChild(extraBtn);
                    }
                });
            });
        }

        var buttons = Array.from(container.querySelectorAll('.full-start__button'));
        if (!buttons.length) return;

        var buttonInfoList = buttons.map(function(btn, index) {
            var info = {
                btn: btn,
                key: btn.dataset.drxaosKey || '',
                span: btn.querySelector('span'),
                hasLegacyIcon: !!btn.querySelector('.full-start__button-icon, .button__icon'),
                hasDrxaosIcon: !!btn.querySelector('svg[data-drxaos-icon]'),
                index: index
            };
            if (!info.key && info.span) {
                var text = info.span.textContent.toLowerCase();
                if (text.includes('онлайн')) info.key = 'online';
                else if (text.includes('торрент')) info.key = 'torrent';
                else if (text.includes('смотреть') || text.includes('play')) info.key = 'watch';
                else if (text.includes('трейлер') || text.includes('youtube')) info.key = 'trailer';
                else if (text.includes('избранное') || text.includes('вибране')) info.key = 'book';
                else if (text.includes('реакци')) info.key = 'reaction';
                else if (text.includes('подписк')) info.key = 'subscribe';
            }
            if (!info.key) {
                if (btn.classList.contains('button--play') || btn.classList.contains('open--menu')) info.key = 'watch';
                else if (btn.classList.contains('button--subscribe')) info.key = 'subscribe';
                else if (btn.classList.contains('button--book')) info.key = 'book';
                else if (btn.classList.contains('button--reaction')) info.key = 'reaction';
                else if (btn.classList.contains('button--options')) info.key = 'more';
                else if (btn.classList.contains('view--online') || btn.classList.contains('view--streamv1')) info.key = 'online';
                else if (btn.classList.contains('view--torrent')) info.key = 'torrent';
                else if (btn.classList.contains('view--trailer')) info.key = 'trailer';
            }
            info.hasLabel = !!(info.span && info.span.textContent.trim());
            info.needsRepair = !btn.innerHTML.trim();
            if (info.key) {
                if (info.hasLegacyIcon || !info.hasDrxaosIcon || !info.hasLabel) {
                    info.needsRepair = true;
                }
            }
            return info;
        });

        var alreadyProcessed = container.dataset.drxaosProcessed === 'true';
        var needsRepair = buttonInfoList.some(function(info) { return info.needsRepair; });
        var hasUnmanaged = buttonInfoList.some(function(info) {
            var btn = info.btn;
            if (!btn) return false;
            return !btn.dataset.drxaosManaged;
        });

        if (alreadyProcessed && !needsRepair && !hasUnmanaged) return;

        container.dataset.drxaosProcessed = 'true';

        var orderMap = {
            online: 10,
            torrent: 20,
            trailer: 30,
            watch: 40,
            book: 50,
            reaction: 60,
            subscribe: 70,
            more: 90
        };

        var buttonMap = {
            online: { icon: 'online', text: Lampa.Lang.translate('drxaos_btn_online'), className: 'drxaos-btn--online' },
            torrent: { icon: 'torrent', text: Lampa.Lang.translate('drxaos_btn_torrent'), className: 'drxaos-btn--torrent' },
            watch: { icon: 'play', text: Lampa.Lang.translate('drxaos_btn_play'), className: 'drxaos-btn--play' },
            trailer: { icon: 'trailer', text: Lampa.Lang.translate('drxaos_btn_trailer'), className: 'drxaos-btn--trailer' },
            book: { icon: 'book', text: Lampa.Lang.translate('drxaos_btn_book'), className: 'drxaos-btn--book' },
            reaction: { icon: 'reaction', text: Lampa.Lang.translate('drxaos_btn_reaction'), className: 'drxaos-btn--reaction' },
            subscribe: { icon: 'subscribe', text: Lampa.Lang.translate('drxaos_btn_subscribe'), className: 'drxaos-btn--subscribe' },
            more: { icon: 'options', text: Lampa.Lang.translate('drxaos_btn_options'), className: 'drxaos-btn--options' }
        };

        var singleInstanceKeys = { online: true, torrent: true, trailer: true };
        var seenKeys = {};
        var recognizedButtons = [];
        var externalButtons = [];

        buttonInfoList.forEach(function(info) {
            var btn = info.btn;
            var key = info.key;
            if (!key) {
                key = '';
                info.key = key;
            }
            if (key === 'watch') {
                if (btn) btn.dataset.drxaosManaged = 'removed';
                if (btn && btn.parentNode) {
                    btn.parentNode.removeChild(btn);
                }
                return;
            }
            if (!buttonMap[key]) {
                markExternalButton(btn);
                externalButtons.push(info);
                return;
            }
            if (singleInstanceKeys[key]) {
                if (seenKeys[key]) {
                    if (btn) btn.dataset.drxaosManaged = 'removed';
                    if (btn && btn.parentNode) {
                        btn.parentNode.removeChild(btn);
                    }
                    return;
                }
                seenKeys[key] = true;
            }
            recognizedButtons.push(info);
            btn.classList.add('drxaos-btn');
            btn.classList.add(buttonMap[key].className);
            btn.dataset.drxaosKey = key;
            btn.dataset.drxaosManaged = '1';
            if (orderMap.hasOwnProperty(key)) {
                btn.style.order = String(orderMap[key]);
            }

            btn.classList.remove('hide');
            btn.classList.remove('hide--left');
            btn.classList.remove('hide--drxaos');
            btn.style.display = '';
            if (!btn.classList.contains('drxaos-btn--options')) {
                btn.classList.remove('is--hidden');
            }

            if (!info.needsRepair) {
                return;
            }

            Array.from(btn.querySelectorAll('.full-start__button-icon, .button__icon')).forEach(function(el) {
                el.remove();
            });

            var labelText = buttonMap[key].text || (info.span ? info.span.textContent.trim() : '');
            var iconName = buttonMap[key].icon;
            var iconMarkup = BUTTON_ICON_SVGS[iconName] || BUTTON_ICON_SVGS[key] || '';
            if (!labelText || labelText.indexOf('drxaos_btn_') === 0) {
                labelText = info.span ? info.span.textContent.trim() : '';
            }

            btn.innerHTML = '';
            if (iconMarkup) {
                btn.insertAdjacentHTML('beforeend', iconMarkup);
            }
            var label = document.createElement('span');
            label.textContent = labelText;
            btn.appendChild(label);
        });
        
        // КРИТИЧНО: стили только ОДИН раз
        if (!document.getElementById('drxaos-action-buttons')) {
            applyActionButtonStyles();
        }
        
        var sortedRecognized = recognizedButtons.slice().sort(function(a, b) {
            var ao = a && a.key && orderMap.hasOwnProperty(a.key) ? orderMap[a.key] : 999;
            var bo = b && b.key && orderMap.hasOwnProperty(b.key) ? orderMap[b.key] : 999;
            if (ao === bo) {
                return (a && typeof a.index === 'number' ? a.index : 0) - (b && typeof b.index === 'number' ? b.index : 0);
            }
            return ao - bo;
        });
        var desiredOrder = [];
        sortedRecognized.forEach(function(info) {
            if (info && info.btn && info.btn.parentNode === container) {
                info.btn.style.display = '';
                desiredOrder.push(info.btn);
            }
        });
        externalButtons.forEach(function(info, idx) {
            var btn = info && info.btn;
            if (!btn || btn.parentNode !== container) return;
            btn.style.order = String(900 + idx);
            desiredOrder.push(btn);
        });
        var currentOrder = Array.from(container.querySelectorAll('.full-start__button'));
        var needsReorder = desiredOrder.length && desiredOrder.some(function(btn, idx) {
            return currentOrder[idx] !== btn;
        });
        if (needsReorder) {
            desiredOrder.forEach(function(btn, idx) {
                var refNode = container.children[idx];
                if (refNode === btn) return;
                container.insertBefore(btn, refNode || null);
            });
        }

        container.classList.add('drxaos-buttons-unwrapped');
        var openMenuBtn = container.querySelector('.open--menu');
        if (openMenuBtn && openMenuBtn.dataset.drxaosKey !== 'more') {
            openMenuBtn.dataset.drxaosKey = 'more';
        }

        applyButtonIcons(container);
        
        document.body.classList.add('drxaos-buttons-ready');
        performanceMonitor.end('syncActionButtons');
        log('Action buttons synchronized successfully', {duration: performanceMonitor.metrics.syncActionButtons.duration});
    } catch (e) {
        logError('Error in syncActionButtons', e);
    }
}

function markExternalButton(btn) {
    if (!btn) return;
    if (btn.dataset.drxaosManaged === 'external') return;
    btn.dataset.drxaosManaged = 'external';
    btn.classList.add('drxaos-external');
    btn.classList.remove('hide', 'hide--left', 'hide--drxaos');
    btn.classList.remove('is--hidden');
    btn.style.display = '';
    btn.style.removeProperty('opacity');
    btn.style.removeProperty('visibility');
    btn.style.setProperty('pointer-events', 'auto', 'important');
}
function applySeasonInfo() {
    var seasonInfo = Lampa.Storage.get('season_info', 'on');
    var seasonInfoEnabled = CONFIG.FEATURES.TMDB_INTEGRATION && seasonInfo === 'on';
    if (!seasonInfoEnabled) {
        var existingInfoStyle = document.getElementById("drxaos-season-info");
        if (existingInfoStyle) {
            existingInfoStyle.remove();
        }
        ['.card--content-type', '.card--season-complete', '.card--season-progress', '.card--country'].forEach(function(selector) {
            var nodes = document.querySelectorAll(selector);
            nodes.forEach(function(node) { node.remove(); });
        });
        window.drxaosSeasonHandler = null;
        return;
    }
    var tmdbApiKey = Lampa.Storage.get('tmdb_api_key', '');
    if (!tmdbApiKey) {
        if (Lampa.Noty) {
            Lampa.Noty.show('TMDB API ключ не указан');
        }
        ['.card--content-type', '.card--season-complete', '.card--season-progress', '.card--country'].forEach(function(selector) {
            var nodes = document.querySelectorAll(selector);
            nodes.forEach(function(node) { node.remove(); });
        });
        window.drxaosSeasonHandler = null;
        return;
    }
        var isTV = /Android TV|Google TV|Fire TV|Smart TV|TV|WebOS|Tizen/i.test(navigator.userAgent) || 
                   window.navigator.userAgent.includes('TV') ||
                   document.body.classList.contains('tv') ||
                   window.location.hostname.includes('tv');
        var styleTag = document.createElement("style");
        styleTag.id = "drxaos-season-info";
        styleTag.textContent = `
            .card--content-type {
                position: absolute;
                top: 5px;
                left: 5px;
                z-index: 12;
                width: fit-content;
                max-width: 150px;
                border-radius: 12px;
                overflow: hidden;
                opacity: 0;
                transition: opacity 0.22s ease-in-out;
                font-family: var(--drxaos-font-family);
                font-weight: 900;
                font-size: 14px;
                padding: 8px 12px;
                white-space: nowrap;
                text-align: center;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
                will-change: opacity;
                backface-visibility: hidden;
            }
            .card--content-type.movie {
                background-color: rgba(0, 0, 0, var(--drxaos-surface-opacity));
                color: #ffffff;
            }
            .card--content-type.tv {
                background-color: rgba(0, 0, 0, var(--drxaos-surface-opacity));
                color: #ffffff;
            }
            .card--content-type.show {
                opacity: 1;
            }
            .card__marker--look {
                position: absolute !important;
                top: 50% !important;
				left: 50% !important;
				transform: translate(-50%, -50%) !important;
				bottom: auto !important;
				right: auto !important;
				font-family: var(--drxaos-font-family) !important;
				font-size: 16px !important;
				font-weight: 900 !important;
				padding: 8px 16px !important;
				border-radius: 16px !important;
				background: rgba(0, 0, 0, 0.95) !important;
				color: #ffffff !important;
				text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95) !important;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95) !important;
				z-index: 10 !important;
			}
            .card--season-complete {
                position: absolute;
                left: 5px;
                bottom: 40px;
                background-color: rgba(0, 0, 0, var(--drxaos-surface-opacity));
                z-index: 12;
                width: fit-content;
                max-width: calc(100% - 1em);
                border-radius: 16px;
                overflow: hidden;
                opacity: 0;
                transition: opacity 0.22s ease-in-out;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
            }
            .card--season-progress {
                position: absolute;
                left: 5px;
                bottom: 40px;
                background-color: rgba(0, 0, 0, var(--drxaos-surface-opacity));
                z-index: 12;
                width: fit-content;
                max-width: calc(100% - 1em);
                border-radius: 16px;
                overflow: hidden;
                opacity: 0;
                transition: opacity 0.22s ease-in-out;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
            }
            .card--season-complete div,
            .card--season-progress div {
                text-transform: uppercase;
                font-family: var(--drxaos-font-family);  
                font-weight: 900;
                font-size: 14px;
                padding: 8px 12px;
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 4px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
                text-align: center;
            }
            .card--season-complete div {
                color: #ffffff;
            }
            .card--season-progress div {
                color: #ffffff;
            }
            .card--season-complete.show,
            .card--season-progress.show {
                opacity: 1;
            }
            .card--country {
                position: absolute;
                top: 40px;
                left: 5px;
                z-index: 12;
                width: fit-content;
                max-width: 80px;
                font-family: var(--drxaos-font-family);
                font-size: 14px;
                font-weight: 900;
                padding: 8px 12px;
                border-radius: 12px;
                background-color: rgba(0, 0, 0, var(--drxaos-surface-opacity));
                color: #ffffff;
                text-align: center;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
                opacity: 0;
                transition: opacity 0.3s ease;
                will-change: opacity;
                backface-visibility: hidden;
            }
            .card--country.show {
                opacity: 1;
            }
            .card__type {
                display: none !important;
            }
        .card-more__box {
            background: var(--theme-primary, rgba(0, 0, 0, var(--drxaos-surface-opacity))) !important;
            border: 2px solid var(--theme-secondary, rgba(255, 255, 255, 0.95)) !important;
            border-radius: 16px !important;
            padding: 16px !important;
            transition: transform 0.3s ease !important, opacity 0.3s ease !important;
        }
        .card-more__box:hover {
            background: var(--theme-secondary, rgba(255, 255, 255, 0.95)) !important;
            border-color: var(--theme-accent, #ffffff) !important;
            transform: scale(1.05);
        }
        .card-more__title {
            color: white !important;
            font-weight: 700 !important;
            font-size: 1.1em !important;
        }
.online-prestige {
    background: var(--drxaos-bg-color) !important;
    border: 2px solid var(--drxaos-accent-color) !important;
    border-radius: 12px !important;
    padding: 1em !important;
    transition: transform 0.3s ease !important, opacity 0.3s ease !important;
}
.online-prestige.focus,
.online-prestige:hover {
    border-color: var(--drxaos-accent-color) !important;
    box-shadow: 0 0 20px var(--drxaos-accent-color) !important;
    transform: scale(1.02) !important;
}
.online-prestige__img {
    border-radius: 8px !important;
    overflow: hidden !important;
}
.online-prestige__title,
.online-prestige__info,
.online-prestige__footer {
    color: var(--drxaos-text-color) !important;
    font-family: var(--drxaos-font-family) !important;
}
`;
        document.head.appendChild(styleTag);
        var seasonCache = JSON.parse(localStorage.getItem('drxaos_season_cache') || '{}');
        var cacheTime = 12 * 60 * 60 * 1000;
        function fetchSeriesData(tmdbId) {
            return new Promise(function(resolve, reject) {
                if (seasonCache[tmdbId] && (Date.now() - seasonCache[tmdbId].timestamp < cacheTime)) {
                    return resolve(seasonCache[tmdbId].data);
                }
                var url = 'https://api.themoviedb.org/3/tv/' + tmdbId + '?api_key=' + tmdbApiKey + '&language=ru';
                fetch(url)
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error('HTTP error ' + response.status);
                        }
                        return response.json();
                    })
                    .then(function(data) {
                                if (data.success === false) {
                                    reject(new Error(data.status_message));
                                    return;
                                }
                                seasonCache[tmdbId] = { 
                                    data: data, 
                                    timestamp: Date.now() 
                                };
                                localStorage.setItem('drxaos_season_cache', JSON.stringify(seasonCache));
                                resolve(data);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        }
        function addSeasonBadge(cardEl) {
            if (!cardEl || cardEl.hasAttribute('data-season-processed')) return;
            if (!cardEl.card_data) {
                setTimeout(function() { addSeasonBadge(cardEl); }, 100);
                return;
            }
            var data = cardEl.card_data;
            var view = cardEl.querySelector('.card__view');
            if (!view) return;
            var oldBadges = view.querySelectorAll('.card--content-type, .card--season-complete, .card--season-progress, .card--country');
            for (var i = 0; i < oldBadges.length; i++) {
                if (oldBadges[i].parentNode) {
                    oldBadges[i].parentNode.removeChild(oldBadges[i]);
                }
            }
            var contentTypeBadge = document.createElement('div');
            contentTypeBadge.className = 'card--content-type ' + (data.name ? 'tv' : 'movie');
            contentTypeBadge.textContent = data.name ? 'Сериал' : 'Фильм';
            view.appendChild(contentTypeBadge);
            if (data.origin_country && data.origin_country.length > 0) {
                var countryBadge = document.createElement('div');
                countryBadge.className = 'card--country';
                countryBadge.textContent = data.origin_country[0].toUpperCase();
                view.appendChild(countryBadge);
                setTimeout(function() {
                    countryBadge.classList.add('show');
                }, 50);
            }
            setTimeout(function() {
                contentTypeBadge.classList.add('show');
            }, 50);
            if (data.name) {
                var badge = document.createElement('div');
                badge.className = 'card--season-progress';
                badge.innerHTML = '<div>...</div>';
                view.appendChild(badge);
                cardEl.setAttribute('data-season-processed', 'loading');
                fetchSeriesData(data.id)
                    .then(function(tmdbData) {
                        if (tmdbData && tmdbData.seasons && tmdbData.last_episode_to_air) {
                            var lastEpisode = tmdbData.last_episode_to_air;
                            var currentSeason = null;
                            for (var i = 0; i < tmdbData.seasons.length; i++) {
                                var season = tmdbData.seasons[i];
                                if (season.season_number === lastEpisode.season_number && season.season_number > 0) {
                                    currentSeason = season;
                                    break;
                                }
                            }
                            if (currentSeason) {
                                var totalEpisodes = currentSeason.episode_count || 0;
                                var airedEpisodes = lastEpisode.episode_number || 0;
                                var isComplete = airedEpisodes >= totalEpisodes;
                                var content = '';
                                if (isComplete) {
                                    content = 'S' + lastEpisode.season_number;
                                } else {
                                    content = 'S' + lastEpisode.season_number + ' ' + airedEpisodes + '/' + totalEpisodes;
                                }
                                if (badge.parentNode) {
                                    badge.parentNode.removeChild(badge);
                                }
                                badge = document.createElement('div');
                                badge.className = isComplete ? 'card--season-complete' : 'card--season-progress';
                                badge.innerHTML = '<div>' + content + (isComplete ? ' ✓' : '') + '</div>';
                                view.appendChild(badge);
                                setTimeout(function() {
                                    badge.classList.add('show');
                                }, 50);
                                cardEl.setAttribute('data-season-processed', isComplete ? 'complete' : 'in-progress');
                            } else {
                                if (badge.parentNode) {
                                    badge.parentNode.removeChild(badge);
                                }
                                cardEl.setAttribute('data-season-processed', 'error');
                            }
                        } else {
                            if (badge.parentNode) {
                                badge.parentNode.removeChild(badge);
                            }
                            cardEl.setAttribute('data-season-processed', 'error');
                        }
                    })
                    .catch(function(error) {
                        if (badge.parentNode) {
                            badge.parentNode.removeChild(badge);
                        }
                        cardEl.setAttribute('data-season-processed', 'error');
                    });
            } else {
                cardEl.setAttribute('data-season-processed', 'not-tv');
            }
        }
        window.drxaosSeasonHandler = function(mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var mutation = mutations[i];
                var addedNodes = mutation.addedNodes;
                if (addedNodes) {
                    for (var j = 0; j < addedNodes.length; j++) {
                        var node = addedNodes[j];
                        if (node.nodeType !== 1) continue;
                        if (node.classList && node.classList.contains('card')) {
                            addSeasonBadge(node);
                        }
                        if (node.querySelectorAll) {
                            var cards = node.querySelectorAll('.card');
                            for (var k = 0; k < cards.length; k++) {
                                addSeasonBadge(cards[k]);
                            }
                        }
                    }
                }
            }
        };
        var existingCards = document.querySelectorAll('.card:not([data-season-processed])');
        for (var j = 0; j < existingCards.length; j++) {
            (function(index) {
                /* jshint -W083 */
                setTimeout(function() { addSeasonBadge(existingCards[index]); }, index * 300);
            })(j);
        }
    
}
function applySourceFilter() {
    var sourceFilter = Lampa.Storage.get('source_filter', 'on');
    if (sourceFilter === 'on') {
        if (applySourceFilter.initialized) return;
        if (!Lampa.Controller || !Lampa.Controller.listener || typeof Lampa.Controller.listener.follow !== 'function') {
            return;
        }
        applySourceFilter.initialized = true;
        Lampa.Controller.listener.follow('toggle', function (event) {
            if (event.name !== 'select') {
                return;
            }
            var active = Lampa.Activity.active();
            var componentName = active.component.toLowerCase();
            if (componentName !== 'online' && componentName !== 'lampac' && componentName.indexOf('bwa') !== 0) {
                return;
            }
            if (Lampa.Storage.get('source_filter', 'on') !== 'on') {
                return;
            }
            var $filterTitle = $('.selectbox__title');
            if ($filterTitle.length !== 1 || $filterTitle.text() !== Lampa.Lang.translate('title_filter')) {
                return;
            }
            var $sourceBtn = $('.simple-button--filter.filter--sort');
            if ($sourceBtn.length !== 1 || $sourceBtn.hasClass('hide')) {
                return;
            }
            var $selectBoxItem = Lampa.Template.get('selectbox_item', {
                title: Lampa.Lang.translate('settings_rest_source'),
                subtitle: $('div', $sourceBtn).text()
            });
            $selectBoxItem.on('hover:enter', function () {
                $sourceBtn.trigger('hover:enter');
            });
            var $selectOptions = $('.selectbox-item');
            if ($selectOptions.length > 0) {
                $selectOptions.first().after($selectBoxItem);
            } else {
                $('body > .selectbox').find('.scroll__body').prepend($selectBoxItem);
            }
            Lampa.Controller.collectionSet($('body > .selectbox').find('.scroll__body'));
            Lampa.Controller.collectionFocus($('.selectbox-item').first());
        });
    }
}
function applyMovieQuality() {
    var movieQuality = Lampa.Storage.get('movie_quality', 'on');
    var movieQualityEnabled = CONFIG.FEATURES.JACRED_INTEGRATION && movieQuality === 'on';
    if (!movieQualityEnabled) {
        var qualityStyle = document.getElementById("drxaos-movie-quality");
        if (qualityStyle) {
            qualityStyle.remove();
        }
        Lampa.Storage.set('drxaos_quality_cache', {});
        return;
    }
    var jacredUrl = Lampa.Storage.get('jacred_url', 'jacred.xyz');
    if (!jacredUrl) {
        if (Lampa.Noty) {
            Lampa.Noty.show('JacRed URL не указан');
        }
        return;
    }
        var styleTag = document.createElement("style");
        styleTag.id = "drxaos-movie-quality";
        styleTag.textContent = `
            .full-start__status.surs_quality {
                background: linear-gradient(145deg,
                    rgba(var(--drxaos-triad-b-rgb), 0.52),
                    rgba(var(--drxaos-triad-a-rgb), 0.2)) !important;
                border: 2px solid rgba(192, 192, 192, 0.35) !important;
                color: var(--drxaos-text-primary) !important;
                font-weight: 600 !important;
                text-shadow: none !important;
            }
            .full-start__status.surs_quality.camrip {
                color: #ffb4b4 !important;
                border-color: #ef4444 !important;
            }
        .card-more__box {
            background: var(--theme-primary, rgba(0, 0, 0, var(--drxaos-surface-opacity))) !important;
            border: 2px solid var(--theme-secondary, rgba(255, 255, 255, 0.95)) !important;
            border-radius: 16px !important;
            padding: 16px !important;
            transition: transform 0.3s ease !important, opacity 0.3s ease !important;
        }
        .card-more__box:hover {
            background: var(--theme-secondary, rgba(255, 255, 255, 0.95)) !important;
            border-color: var(--theme-accent, #ffffff) !important;
            transform: scale(1.05);
        }
        .card-more__title {
            color: white !important;
            font-weight: 700 !important;
            font-size: 1.1em !important;
        }
.online-prestige {
    background: var(--drxaos-bg-color) !important;
    border: 2px solid var(--drxaos-accent-color) !important;
    border-radius: 12px !important;
    padding: 1em !important;
    transition: transform 0.3s ease !important, opacity 0.3s ease !important;
}
.online-prestige.focus,
.online-prestige:hover {
    border-color: var(--drxaos-accent-color) !important;
    box-shadow: 0 0 20px var(--drxaos-accent-color) !important;
    transform: scale(1.02) !important;
}
.online-prestige__img {
    border-radius: 8px !important;
    overflow: hidden !important;
}
.online-prestige__title,
.online-prestige__info,
.online-prestige__footer {
    color: var(--drxaos-text-color) !important;
    font-family: var(--drxaos-font-family) !important;
}
`;
        document.head.appendChild(styleTag);
        initMovieQualitySystem(jacredUrl);
}
function initMovieQualitySystem(jacredUrl) {
    var Q_CACHE_TIME = 72 * 60 * 60 * 1000;
    var QUALITY_CACHE = 'drxaos_quality_cache';
    var JACRED_PROTOCOL = 'https://';
    var PROXY_LIST = [
        'http://api.allorigins.win/raw?url=',
        'http://cors.bwa.workers.dev/'
    ];
    var PROXY_TIMEOUT = 5000;
    if (typeof AbortController === 'undefined') {
        window.AbortController = function () {
            this.signal = {
                aborted: false,
                addEventListener: function (event, callback) {
                    if (event === 'abort') {
                        this._onabort = callback;
                    }
                }
            };
            this.abort = function () {
                this.signal.aborted = true;
                if (typeof this.signal._onabort === 'function') {
                    this.signal._onabort();
                }
            };
        };
    }
    function fetchWithProxy(url, cardId, callback) {
        var currentProxyIndex = 0;
        var callbackCalled = false;
        var controller = new AbortController();
        var signal = controller.signal;
        function tryNextProxy() {
            if (currentProxyIndex >= PROXY_LIST.length) {
                if (!callbackCalled) {
                    callbackCalled = true;
                    callback(new Error('Все прокси не сработали для ' + url));
                }
                return;
            }
            var proxyUrl = PROXY_LIST[currentProxyIndex] + encodeURIComponent(url);
            var timeoutId = setTimeout(function () {
                controller.abort();
                if (!callbackCalled) {
                    currentProxyIndex++;
                    tryNextProxy();
                }
            }, PROXY_TIMEOUT);
            fetch(proxyUrl, { signal: signal })
                .then(function (response) {
                    clearTimeout(timeoutId);
                    if (!response.ok) {
                        throw new Error('Ошибка прокси: ' + response.status);
                    }
                    return response.text();
                })
                .then(function (data) {
                    if (!callbackCalled) {
                        callbackCalled = true;
                        clearTimeout(timeoutId);
                        callback(null, data);
                    }
                })
                .catch(function (error) {
                    clearTimeout(timeoutId);
                    if (!callbackCalled) {
                        currentProxyIndex++;
                        tryNextProxy();
                    }
                });
        }
        var directTimeoutId = setTimeout(function () {
            controller.abort();
            if (!callbackCalled) {
                tryNextProxy();
            }
        }, PROXY_TIMEOUT);
        fetch(url, { signal: signal })
            .then(function (response) {
                clearTimeout(directTimeoutId);
                if (!response.ok) {
                    throw new Error('Ошибка прямого запроса: ' + response.status);
                }
                return response.text();
            })
            .then(function (data) {
                if (!callbackCalled) {
                    callbackCalled = true;
                    clearTimeout(directTimeoutId);
                    callback(null, data);
                }
            })
            .catch(function (error) {
                clearTimeout(directTimeoutId);
                if (!callbackCalled) {
                    tryNextProxy();
                }
            });
    }
    function getBestReleaseFromJacred(normalizedCard, cardId, callback) {
        if (!jacredUrl) {
            callback(null);
            return;
        }
        function analyzeTorrentQuality(torrent) {
            if (!torrent) return null;
            var rawQuality = torrent.quality != null ? torrent.quality : '';
            var title = torrent.title || '';
            var extra = torrent.release || torrent.source || '';
            var combined = (title + ' ' + rawQuality + ' ' + extra).toUpperCase();
            var camText = combined.replace(/HDRIP/gi, '');

            var isCamrip = /\b(CAMRIP|CAM|TS|TELESYNC|TELECINE|TC|SCREENER|SCR|HDTS)\b/.test(camText);
            if (isCamrip) {
                return { label: 'CAM', score: 50, isCamrip: true };
            }

            var meta = { label: null, score: -1, isCamrip: false };
            function assign(label, score) {
                if (score > meta.score) {
                    meta.label = label;
                    meta.score = score;
                }
            }

            var numericQuality = parseInt(String(rawQuality).replace(/[^0-9]/g, ''), 10);
            if (!isNaN(numericQuality)) {
                if (numericQuality >= 2160) assign('4K', 800);
                else if (numericQuality >= 1440) assign('FHD', 360);
                else if (numericQuality >= 1080) assign('FHD', 340);
                else if (numericQuality >= 720) assign('HD', 220);
                else if (numericQuality >= 480) assign('SD', 120);
            }

            if (/\b(2160P|4K|UHD|ULTRA\s*HD)\b/.test(combined)) assign('4K', 800);
            if (/\b(1440P|2K)\b/.test(combined)) assign('FHD', 360);
            if (/\b(1080P|FHD|FULL\s*HD|BLU[-\s]?RAY|BDRIP|BDREMUX|REMUX|BRRIP)\b/.test(combined)) assign('FHD', 340);
            if (/\b(900P)\b/.test(combined)) assign('HD', 230);
            if (/\b(720P|HDTV|HDRIP|WEB[-\s]?DL|WEB[-\s]?RIP|WEBDL|WEBRIP)\b/.test(combined)) assign('HD', 220);
            if (/\b(540P)\b/.test(combined)) assign('SD', 140);
            if (/\b(480P|SD|DVDRIP|DVD|TVRIP|VHS)\b/.test(combined)) assign('SD', 120);

            if (typeof rawQuality === 'string') {
                var qUpper = rawQuality.toUpperCase();
                if (!meta.label && /\b(BDRIP|BLURAY|BDREMUX|REMUX)\b/.test(qUpper)) assign('FHD', 320);
                if (!meta.label && /\b(WEBDL|WEB[-\s]?DL|WEB[-\s]?RIP|HDRIP|HDTV)\b/.test(qUpper)) assign('HD', 210);
                if (!meta.label && /\b(DVDRIP|DVD|TVRIP)\b/.test(qUpper)) assign('SD', 110);
            }

            if (!meta.label) {
                return null;
            }

            return meta;
        }
        var year = '';
        var dateStr = normalizedCard.release_date || '';
        if (dateStr.length >= 4) {
            year = dateStr.substring(0, 4);
        }
        function searchJacredApi(searchTitle, searchYear, exactMatch, strategyName, apiCallback) {
            var userId = Lampa.Storage.get('lampac_unic_id', '');
            var apiUrl = JACRED_PROTOCOL + jacredUrl + '/api/v1.0/torrents?search=' +
                encodeURIComponent(searchTitle) +
                (searchYear ? '&year=' + searchYear : '') +
                (exactMatch ? '&exact=true' : '');
            fetchWithProxy(apiUrl, cardId, function (error, responseText) {
                if (error || !responseText) {
                    apiCallback(null);
                    return;
                }
                try {
                    var torrents = JSON.parse(responseText);
                    if (!Array.isArray(torrents) || torrents.length === 0) {
                        apiCallback(null);
                        return;
                    }
                    var bestRelease = null;
                    var bestCamRelease = null;
                    for (var i = 0; i < torrents.length; i++) {
                        var torrent = torrents[i];
                        var qualityMeta = analyzeTorrentQuality(torrent);
                        if (!qualityMeta || !qualityMeta.label) continue;

                        if (qualityMeta.isCamrip) {
                            if (!bestCamRelease || qualityMeta.score > bestCamRelease.meta.score) {
                                bestCamRelease = { torrent: torrent, meta: qualityMeta };
                            }
                        } else {
                            if (!bestRelease || qualityMeta.score > bestRelease.meta.score) {
                                bestRelease = { torrent: torrent, meta: qualityMeta };
                            }
                        }
                    }

                    var chosen = bestRelease || bestCamRelease;
                    if (chosen) {
                        apiCallback({
                            quality: chosen.meta.label,
                            title: chosen.torrent.title,
                            isCamrip: chosen.meta.isCamrip
                        });
                    } else {
                        apiCallback(null);
                    }
                } catch (e) {
                    logError('Ошибка при получении качества из JacRed:', e);
                    apiCallback(null);
                }
            });
        }
        var searchStrategies = [];
        if (normalizedCard.original_title && /[a-zа-яё0-9]/i.test(normalizedCard.original_title)) {
            searchStrategies.push({
                title: normalizedCard.original_title.trim(),
                year: year,
                exact: true,
                name: 'OriginalTitle Exact Year'
            });
        }
        if (normalizedCard.title && /[a-zа-яё0-9]/i.test(normalizedCard.title)) {
            searchStrategies.push({
                title: normalizedCard.title.trim(),
                year: year,
                exact: true,
                name: 'Title Exact Year'
            });
        }
        if (normalizedCard.type === 'tv' && (!year || isNaN(year))) {
            if (normalizedCard.original_title && /[a-zа-яё0-9]/i.test(normalizedCard.original_title)) {
                searchStrategies.push({
                    title: normalizedCard.original_title.trim(),
                    year: '',
                    exact: false,
                    name: 'OriginalTitle No Year'
                });
            }
            if (normalizedCard.title && /[a-zа-яё0-9]/i.test(normalizedCard.title)) {
                searchStrategies.push({
                    title: normalizedCard.title.trim(),
                    year: '',
                    exact: false,
                    name: 'Title No Year'
                });
            }
        }
        function executeNextStrategy(index) {
            if (index >= searchStrategies.length) {
                callback(null);
                return;
            }
            var strategy = searchStrategies[index];
            searchJacredApi(strategy.title, strategy.year, strategy.exact, strategy.name, function (result) {
                if (result !== null) {
                    callback(result);
                } else {
                    executeNextStrategy(index + 1);
                }
            });
        }
        if (searchStrategies.length > 0) {
            executeNextStrategy(0);
        } else {
            callback(null);
        }
    }
    function getQualityCache(key) {
        var cache = Lampa.Storage.get(QUALITY_CACHE) || {};
        var item = cache[key];
        return item && (Date.now() - item.timestamp < Q_CACHE_TIME) ? item : null;
    }
    function saveQualityCache(key, data, localCurrentCard) {
        var cache = Lampa.Storage.get(QUALITY_CACHE) || {};
        for (var cacheKey in cache) {
            if (cache.hasOwnProperty(cacheKey)) {
                if (Date.now() - cache[cacheKey].timestamp >= Q_CACHE_TIME) {
                    delete cache[cacheKey];
                }
            }
        }
        cache[key] = {
            quality: data.quality || null,
            isCamrip: data.isCamrip || false,
            timestamp: Date.now()
        };
        Lampa.Storage.set(QUALITY_CACHE, cache);
    }
    function clearQualityElements(localCurrentCard, render) {
        if (render) {
            $('.full-start__status.surs_quality', render).remove();
        }
    }
    function showQualityPlaceholder(localCurrentCard, render) {
        if (!render) {
            return;
        }
        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) {
            return;
        }
        if (!$('.full-start__status.surs_quality', render).length) {
            var placeholder = document.createElement('div');
            placeholder.className = 'full-start__status surs_quality';
            placeholder.textContent = '...';
            placeholder.style.opacity = '0.7';
            rateLine.append(placeholder);
        }
    }
    function updateQualityElement(quality, isCamrip, localCurrentCard, render) {
        if (!render) {
            return;
        }
        var element = $('.full-start__status.surs_quality', render);
        var rateLine = $('.full-start-new__rate-line', render);
        if (!rateLine.length) {
            return;
        }
        if (element.length) {
            element.text(quality).css('opacity', '1');
            if (isCamrip) {
                element.addClass('camrip');
            } else {
                element.removeClass('camrip');
            }
        } else {
            var div = document.createElement('div');
            div.className = 'full-start__status surs_quality' + (isCamrip ? ' camrip' : '');
            div.textContent = quality;
            rateLine.append(div);
        }
    }
    function fetchQualitySequentially(normalizedCard, localCurrentCard, qCacheKey, render) {
        getBestReleaseFromJacred(normalizedCard, localCurrentCard, function (jrResult) {
            var quality = (jrResult && jrResult.quality) || null;
            var isCamrip = (jrResult && jrResult.isCamrip) || false;
            if (quality && quality !== 'NO') {
                saveQualityCache(qCacheKey, { quality: quality, isCamrip: isCamrip }, localCurrentCard);
                updateQualityElement(quality, isCamrip, localCurrentCard, render);
            } else {
                clearQualityElements(localCurrentCard, render);
            }
        });
    }
    function getCardType(card) {
        var type = card.media_type || card.type;
        if (type === 'movie' || type === 'tv') {
            return type;
        }
        return card.name || card.original_name ? 'tv' : 'movie';
    }
    function fetchQualityForCard(card, render) {
        if (!render) {
            return;
        }
        var localCurrentCard = card.id;
        var normalizedCard = {
            id: card.id,
            title: card.title || card.name || '',
            original_title: card.original_title || card.original_name || '',
            type: getCardType(card),
            release_date: card.release_date || card.first_air_date || ''
        };
        var rateLine = $('.full-start-new__rate-line', render);
        var qCacheKey = normalizedCard.type + '_' + (normalizedCard.id || normalizedCard.imdb_id);
        var cacheQualityData = getQualityCache(qCacheKey);
        if (cacheQualityData) {
            updateQualityElement(cacheQualityData.quality, cacheQualityData.isCamrip, localCurrentCard, render);
        } else {
            showQualityPlaceholder(localCurrentCard, render);
            setTimeout(function() {
                fetchQualitySequentially(normalizedCard, localCurrentCard, qCacheKey, render);
            }, 100);
        }
    }
    Lampa.Listener.follow('full', function (e) {
        if (e.type === 'complite') {
            var render = e.object.activity.render();
            fetchQualityForCard(e.data.movie, render);
            drxaosHandleTitleLogo(e.data.movie, render);
            drxaosHandleOriginalNames(e.data.movie, render);
        }
    });
function processAllCards() {
    var cards = document.querySelectorAll('.card:not([data-quality-processed])');
        var batchSize = 5;
        var currentIndex = 0;
        function processBatch() {
            var endIndex = Math.min(currentIndex + batchSize, cards.length);
            for (var i = currentIndex; i < endIndex; i++) {
                var card = cards[i];
                var cardData = getCardDataFromElement(card);
                if (cardData) {
                    addQualityToMiniCard(card, cardData);
                    colorizeCardVotes(card);
                    moveCardAgeToPoster(card);
                    card.setAttribute('data-quality-processed', 'true');
                }
            }
            currentIndex = endIndex;
            if (currentIndex < cards.length) {
                setTimeout(processBatch, 10);
            }
        }
        if (cards.length > 0) {
            processBatch();
        }
    }
    var cardDataStorage = new WeakMap();
    function getCardDataFromElement(cardElement) {
        try {
            if (cardDataStorage.has(cardElement)) {
                return cardDataStorage.get(cardElement);
            }
            var tmdbId = null;
            var cardId = null;
            cardId = cardElement.getAttribute('data-id') || 
                        cardElement.getAttribute('id');
            if (!cardId) {
                var parent = cardElement.parentElement;
                while (parent && !cardId) {
                    cardId = parent.getAttribute('data-id') || 
                            parent.getAttribute('data-movie-id') ||
                            parent.getAttribute('data-tmdb-id') ||
                            parent.getAttribute('data-tv-id');
                    parent = parent.parentElement;
                }
            }
            if (!cardId) {
                cardId = getCardIdFromLampaData(cardElement);
            }
            if (!cardId) {
                return null;
            }
            var titleElement = cardElement.querySelector('.card__title, .card-title, .title, .card__name, .name');
            var title = titleElement ? titleElement.textContent.trim() : '';
            if (!title) {
                title = cardElement.getAttribute('data-title') || 
                       cardElement.getAttribute('data-name') || '';
            }
            var originalTitleElement = cardElement.querySelector('.card__original-title, .original-title, .card__original-name, .original-name');
            var originalTitle = originalTitleElement ? originalTitleElement.textContent.trim() : '';
            if (!originalTitle) {
                originalTitle = cardElement.getAttribute('data-original-title') || 
                              cardElement.getAttribute('data-original-name') || '';
            }
            var isTv = cardElement.classList.contains('card--tv') || 
                      cardElement.classList.contains('tv') ||
                      cardElement.querySelector('.card__type') ||
                      cardElement.querySelector('[data-type="tv"]') ||
                      cardElement.getAttribute('data-type') === 'tv';
            var year = cardElement.getAttribute('data-year') || 
                      cardElement.getAttribute('data-release-year') ||
                      cardElement.getAttribute('data-first-air-date') ||
                      cardElement.getAttribute('data-release-date') || '';
            if (!year) {
                var yearElement = cardElement.querySelector('.card__year, .year, .card__date, .date');
                if (yearElement) {
                    var yearText = yearElement.textContent.trim();
                    var yearMatch = yearText.match(/(\d{4})/);
                    if (yearMatch) {
                        year = yearMatch[1];
                    }
                }
            }
            if (!title && !cardId) {
                return null;
            }
            var cardData = {
                id: cardId,
                tmdb_id: tmdbId,
                title: title,
                original_title: originalTitle,
                type: isTv ? 'tv' : 'movie',
                release_date: year
            };
            return cardData;
        } catch (e) {
            logError('Ошибка при парсинге данных карточки:', e);
            return null;
        }
    }
    function getCardIdFromLampaData(cardElement) {
        try {
            if (window.Lampa && window.Lampa.Storage) {
                var cacheKeys = Object.keys(localStorage).filter(key => 
                    key.includes('lampa') || key.includes('card') || key.includes('movie') || key.includes('tv')
                );
                for (var i = 0; i < cacheKeys.length; i++) {
                    try {
                        var cacheData = JSON.parse(localStorage.getItem(cacheKeys[i]));
                        if (cacheData && typeof cacheData === 'object') {
                            if (cacheData.id || cacheData.tmdb_id) {
                                return cacheData.id || cacheData.tmdb_id;
                            }
                        }
                    } catch (e) {
                    }
                }
            }
            var href = cardElement.getAttribute('href') || '';
            var idMatch = href.match(/\/(\d+)/);
            if (idMatch) {
                return idMatch[1];
            }
            var onclick = cardElement.getAttribute('onclick') || '';
            var onclickMatch = onclick.match(/id[:\s]*(\d+)/);
            if (onclickMatch) {
                return onclickMatch[1];
            }
            var titleElement = cardElement.querySelector('.card__title, .card-title, .title, .card__name, .name');
            if (titleElement) {
                var title = titleElement.textContent.trim();
                if (title) {
            var foundId = findIdByTitle(title);
            if (foundId) {
                return foundId;
            }
            var tmdbId = findIdByTitleInTMDB(title);
            if (tmdbId) {
                return tmdbId;
            }
                    var hash = 0;
                    var i3;
                    for (i3 = 0; i3 < title.length; i3++) {
                        var char = title.charCodeAt(i3);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash;
                    }
                    var generatedId = Math.abs(hash).toString().substr(0, 8);
                    return generatedId;
                }
            }
            return null;
        } catch (e) {
            logError('Ошибка при парсинге данных карточки:', e);
            return null;
        }
    }
    function findIdByTitle(title) {
        try {
            var cacheKeys = Object.keys(localStorage);
            for (var i = 0; i < cacheKeys.length; i++) {
                var key = cacheKeys[i];
                if (key.includes('lampa') || key.includes('movie') || key.includes('tv') || key.includes('card')) {
                    try {
                        var data = JSON.parse(localStorage.getItem(key));
                        if (data && typeof data === 'object') {
                            if (data.title && data.title.toLowerCase().includes(title.toLowerCase())) {
                                return data.id || data.tmdb_id;
                            }
                            if (data.name && data.name.toLowerCase().includes(title.toLowerCase())) {
                                return data.id || data.tmdb_id;
                            }
                            if (data.original_title && data.original_title.toLowerCase().includes(title.toLowerCase())) {
                                return data.id || data.tmdb_id;
                            }
                        }
                    } catch (e) {
                    }
                }
            }
            if (window.Lampa && window.Lampa.Storage) {
                var activeData = window.Lampa.Storage.get('active_movie') || window.Lampa.Storage.get('active_tv');
                if (activeData && activeData.title && activeData.title.toLowerCase().includes(title.toLowerCase())) {
                    return activeData.id;
                }
            }
            return null;
        } catch (e) {
            logError('Ошибка при парсинге данных карточки:', e);
            return null;
        }
    }
    function findIdByTitleInTMDB(title) {
        try {
            var tmdbApiKey = Lampa.Storage.get('tmdb_api_key', '');
            if (!tmdbApiKey) {
                return null;
            }
            return null;
        } catch (e) {
            logError('Ошибка при парсинге данных карточки:', e);
            return null;
        }
    }
    function processBatch(items, processFunc, batchSize, callback) {
        batchSize = batchSize || 10;
        var index = 0;
        function processNextBatch() {
            var end = Math.min(index + batchSize, items.length);
            for (var i = index; i < end; i++) {
                processFunc(items[i], i);
            }
            index = end;
            if (index < items.length) {
                requestAnimationFrame(processNextBatch);
            } else if (callback) {
                callback();
            }
        }
        requestAnimationFrame(processNextBatch);
    }
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
            }
    function throttle(func, limit) {
        var inThrottle;
        return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }
    var requestIdleCallbackPolyfill = window.requestIdleCallback || function(cb) {
        var start = Date.now();
        return setTimeout(function() {
            cb({
                didTimeout: false,
                timeRemaining: function() {
                    return Math.max(0, 50 - (Date.now() - start));
        }
            });
        }, 1);
    };
function addQualityToMiniCard(cardElement, cardData) {
    if (!cardData) {
        return;
    }
    addNextEpisodeInfo(cardElement, cardData);
    colorizeCardVotes(cardElement);
        removeLegacyQualityBadges(cardElement);
        var movieQualitySetting = Lampa.Storage.get('movie_quality', 'on');
        if (!CONFIG.FEATURES.JACRED_INTEGRATION || movieQualitySetting !== 'on') {
            removeLegacyQualityBadges(cardElement);
            return;
        }
        if (!cardData.title) {
            return;
        }
        var existingBadges = cardElement.querySelectorAll('.card-quality, .card__quality');
        if (existingBadges.length > 1) {
            existingBadges.forEach(function(el, index) {
                if (index > 0) el.remove();
            });
        }
        var qualityElement = existingBadges[0];
        if (movieQualitySetting !== 'on') {
            if (qualityElement) qualityElement.remove();
            return;
        }
        if (!qualityElement) {
            qualityElement = document.createElement('div');
            qualityElement.className = 'card-quality';
            qualityElement.style.cssText = `
                position: absolute;
                top: 5px;
                right: 5px;
                background: #000000;
                color: #ffd369;
                padding: 8px 12px;
                border-radius: 12px;
                font-family: var(--drxaos-font-family);
                font-size: 14px;
                font-weight: 900;
                z-index: 10;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
                will-change: opacity;
                backface-visibility: hidden;
                display: none;
            `;
            cardElement.style.position = cardElement.style.position || 'relative';
            var posterElement = cardElement.querySelector('.card__poster, .card-poster, .poster, .card__image, .card-image');
            if (posterElement) {
                posterElement.style.position = posterElement.style.position || 'relative';
                posterElement.appendChild(qualityElement);
            } else {
                cardElement.appendChild(qualityElement);
            }
        } else {
            qualityElement.classList.add('card-quality');
            qualityElement.classList.remove('card__quality');
            qualityElement.style.display = 'none';
            qualityElement.textContent = '';
            qualityElement.style.color = '#ffd369';
            qualityElement.style.background = '#000000';
            qualityElement.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.8)';
        }
        var qCacheKey = cardData.type + '_' + cardData.id;
        qualityElement.dataset.drxaosQualityId = qCacheKey;
        qualityElement.dataset.drxaosQuality = '1';
        var cacheQualityData = getQualityCache(qCacheKey);
        if (cacheQualityData && cacheQualityData.quality && cacheQualityData.quality !== 'undefined' && cacheQualityData.quality !== '') {
            if (!qualityElement.isConnected) return;
            qualityElement.textContent = cacheQualityData.quality;
            qualityElement.style.display = 'inline-flex';
            if (cacheQualityData.isCamrip) {
                qualityElement.style.color = '#f87171';
                qualityElement.style.background = '#ef4444';
                qualityElement.classList.add('camrip');
            } else {
                qualityElement.style.color = '#ffd369';
                qualityElement.style.background = '#000000';
                qualityElement.classList.remove('camrip');
                qualityElement.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.8)';
            }
        } else {
            queueRequest(function(done) {
                getBestReleaseFromJacred(cardData, cardData.id, function (result) {
                    if (!qualityElement.isConnected) {
                        done();
                        return;
                    }
                    if (result && result.quality && result.quality !== 'undefined' && result.quality !== '' && result.quality !== 'null') {
                        qualityElement.textContent = result.quality;
                        qualityElement.style.display = 'inline-flex';
                        if (result.isCamrip) {
                            qualityElement.style.color = '#f87171';
                            qualityElement.style.background = '#ef4444';
                            qualityElement.classList.add('camrip');
                        } else {
                            qualityElement.style.color = '#ffd369';
                            qualityElement.style.background = '#000000';
                            qualityElement.classList.remove('camrip');
                            qualityElement.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.8)';
                        }
                        saveQualityCache(qCacheKey, { 
                            quality: result.quality, 
                            isCamrip: result.isCamrip 
                        }, cardData.id);
                    } else {
                        qualityElement.remove();
                    }
                    done();
                });
            });
        }
    }
    function moveCardAgeToPoster(cardElement) {
        try {
            if (!cardElement) return;
            var ageElement = cardElement.querySelector('.card__age, .card-age, .card__year, .year');
            if (!ageElement || ageElement.classList.contains('drxaos-age-moved')) {
                return;
            }
            var posterContainer = cardElement.querySelector('.card__view, .card__poster, .poster, .card__image, .card-image');
            if (!posterContainer) {
                return;
            }
            posterContainer.appendChild(ageElement);
            ageElement.classList.add('drxaos-age-moved');
        } catch (e) {
            logError('Ошибка переноса бейджа года на постер:', e);
        }
    }
    function moveAllCardAges() {
        try {
            var cards = document.querySelectorAll('.card');
            cards.forEach(moveCardAgeToPoster);
        } catch (e) {
            logError('Глобальная синхронизация бейджей года не удалась:', e);
        }
    }
    setTimeout(moveAllCardAges, 200);
    var requestQueue = [];
    var activeRequests = 0;
    var maxConcurrentRequests = 3;
    function processRequestQueue() {
        if (requestQueue.length === 0 || activeRequests >= maxConcurrentRequests) {
            return;
        }
        var request = requestQueue.shift();
        if (request) {
            activeRequests++;
            var timeout = setTimeout(function() {
                activeRequests--;
                processRequestQueue();
            }, 30000);
            requestAnimationFrame(function() {
                try {
                    request.execute(function() {
                        clearTimeout(timeout);
                        activeRequests--;
                        setTimeout(processRequestQueue, 10);
                    });
                } catch (e) {
                    logError('Ошибка при выполнении запроса к TMDB:', e);
                    clearTimeout(timeout);
                    activeRequests--;
                    setTimeout(processRequestQueue, 10);
                }
            });
        }
        if (requestQueue.length > 0 && activeRequests < maxConcurrentRequests) {
            setTimeout(processRequestQueue, 0);
        }
    }
    function queueRequest(executeFn) {
        requestQueue.push({ execute: executeFn });
        processRequestQueue();
    }
    function resetRequestQueue() {
        requestQueue = [];
        activeRequests = 0;
    }
    resetRequestQueue();
    setTimeout(function() {
        if (activeRequests > 0) {
            activeRequests = 0;
            processRequestQueue();
        }
    }, 1000);
    setInterval(function() {
        if (activeRequests > 0 && requestQueue.length > 0) {
            activeRequests = 0;
            processRequestQueue();
        }
    }, 10000);
    function addNextEpisodeInfo(cardElement, cardData) {
        function getDaysLabel(days) {
            var n = Math.abs(days) % 100;
            var n1 = n % 10;
            if (n > 10 && n < 20) return 'дней';
            if (n1 === 1) return 'день';
            if (n1 >= 2 && n1 <= 4) return 'дня';
            return 'дней';
        }
        if (cardElement.hasAttribute('data-next-episode-processed')) {
            return;
        }
        cardElement.setAttribute('data-next-episode-processed', 'true');
        if (!CONFIG.FEATURES.TMDB_INTEGRATION) {
            return;
        }
         if (cardData.type !== 'tv') {
        return;
    }
        var realTmdbId = cardData.tmdb_id || cardData.id;
        var tmdbApiKey = Lampa.Storage.get('tmdb_api_key', '');
        if (!tmdbApiKey) {
            return;
        }
        var nextEpisodeElement = document.createElement('div');
        nextEpisodeElement.className = 'card-next-episode';
        nextEpisodeElement.style.cssText = `
            position: absolute;
            bottom: 35px;
            left: 5px;
            background: rgba(0, 0, 0, var(--drxaos-surface-opacity));
            color: white;
            padding: 8px 16px;
            border-radius: 16px;
            font-family: var(--drxaos-font-family);
            font-size: 16px;
            font-weight: 900;
            z-index: 10;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.95);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            will-change: opacity;
            backface-visibility: hidden;
        `;
        var posterElement = cardElement.querySelector('.card__poster, .card-poster, .poster, .card__image, .card-image');
        if (posterElement) {
            posterElement.style.position = 'relative';
            posterElement.appendChild(nextEpisodeElement);
        } else {
            var viewElement = cardElement.querySelector('.card__view');
            if (viewElement) {
                viewElement.style.position = 'relative';
                viewElement.appendChild(nextEpisodeElement);
            } else {
                cardElement.style.position = 'relative';
                cardElement.appendChild(nextEpisodeElement);
            }
        }

        // ═══ УМНАЯ ВАЛИДАЦИЯ И ПОИСК TMDB ID ═══

        // Проверка: если ID выглядит как Lampac ID (больше 7 цифр), считаем невалидным
        var isValidTmdbId = realTmdbId && 
                           !isNaN(parseInt(realTmdbId)) && 
                           parseInt(realTmdbId) > 0 && 
                           parseInt(realTmdbId) < 10000000 && // TMDB ID обычно < 1млн
                           !(typeof realTmdbId === 'string' && 
                             (realTmdbId.startsWith('unknown') || realTmdbId.startsWith('unknown_')));

        if (!isValidTmdbId) {
            // ID невалидный - пробуем найти через поиск по названию

            var title = cardData.title || cardData.name || cardData.original_name;
            var year = cardData.first_air_date ? new Date(cardData.first_air_date).getFullYear() : 
                      (cardData.year ? cardData.year : null);

            if (title) {
                searchTmdbIdByTitle(title, year, tmdbApiKey, function(foundId) {
                    if (foundId) {
                        // Нашли ID через поиск - используем его
                        realTmdbId = foundId;

                        queueRequest(function(done) {
                            if (cardData.type === 'tv') {
                                fetchNextEpisodeInfo(realTmdbId, tmdbApiKey, function(result) {
                                    if (result && result.nextEpisodeDate) {
                                        var daysUntil = calculateDaysUntil(result.nextEpisodeDate);
                                        if (nextEpisodeElement && nextEpisodeElement.parentNode) {
                                            if (daysUntil > 0) {
                                                nextEpisodeElement.textContent = daysUntil + ' ' + getDaysLabel(daysUntil);
                                            } else if (daysUntil === 0) {
                                                nextEpisodeElement.textContent = 'Сегодня';
                                            } else if (daysUntil === -1) {
                                                nextEpisodeElement.textContent = 'Вчера';
                                            } else {
                                                nextEpisodeElement.textContent = Math.abs(daysUntil) + ' дн. назад';
                                            }
                                        }
                                    } else {
                                        if (nextEpisodeElement && nextEpisodeElement.parentNode) {
                                            nextEpisodeElement.remove();
                                        }
                                    }
                                    done();
                                });
                            } else {
                                done();
                            }
                        });
                    } else {
                        // Не нашли через поиск - удаляем плашку
                        if (nextEpisodeElement && nextEpisodeElement.parentNode) {
                            nextEpisodeElement.remove();
                        }
                    }
                });
            } else {
                // Нет названия для поиска
                if (nextEpisodeElement && nextEpisodeElement.parentNode) {
                    nextEpisodeElement.remove();
                }
            }
            return;
        }

        // ID валидный - используем напрямую

        queueRequest(function(done) {
        if (cardData.type === 'tv') {
            fetchNextEpisodeInfo(realTmdbId, tmdbApiKey, function(result) {
                if (result && result.nextEpisodeDate) {
                    var daysUntil = calculateDaysUntil(result.nextEpisodeDate);
                    if (nextEpisodeElement && nextEpisodeElement.parentNode) {
                    if (daysUntil > 0) {
                        nextEpisodeElement.textContent = daysUntil + ' ' + getDaysLabel(daysUntil);
                    } else if (daysUntil === 0) {
                        nextEpisodeElement.textContent = 'Сегодня';
                    } else {
                        nextEpisodeElement.textContent = 'Вышло';
                    }
                    }
                        done();
                } else {
                    fetchSeriesInfo(realTmdbId, tmdbApiKey, function(seriesResult) {
                        if (seriesResult && seriesResult.lastAirDate) {
                            var daysUntil = calculateDaysUntil(seriesResult.lastAirDate);
                            if (nextEpisodeElement && nextEpisodeElement.parentNode) {
                            if (daysUntil > 0) {
                                nextEpisodeElement.textContent = daysUntil + ' ' + getDaysLabel(daysUntil);
                            } else if (daysUntil === 0) {
                                nextEpisodeElement.textContent = 'Сегодня';
                            } else {
                                nextEpisodeElement.textContent = 'Вышло';
                                }
                            }
                        } else {
                            if (nextEpisodeElement && nextEpisodeElement.parentNode) {
                            nextEpisodeElement.remove();
                        }
                        }
                            done();
                    });
                }
            });
        } else {
            fetchMovieReleaseDate(realTmdbId, tmdbApiKey, function(result) {
                if (result && result.releaseDate) {
                    var daysUntil = calculateDaysUntil(result.releaseDate);
                    if (nextEpisodeElement && nextEpisodeElement.parentNode) {
                    if (daysUntil > 0) {
                        nextEpisodeElement.textContent = daysUntil + ' ' + getDaysLabel(daysUntil);
                    } else if (daysUntil === 0) {
                        nextEpisodeElement.textContent = 'Сегодня';
                    } else {
                        nextEpisodeElement.textContent = 'Вышло';
                        }
                    }
                } else {
                    if (nextEpisodeElement && nextEpisodeElement.parentNode) {
                    nextEpisodeElement.remove();
                }
                }
                    done();
            });
        }
        });
    }
    function fetchSeriesInfo(tmdbId, apiKey, callback) {
        if (!tmdbId || (typeof tmdbId === 'string' && tmdbId.startsWith('unknown_')) || isNaN(parseInt(tmdbId))) {
            callback(null);
            return;
        }
        var url = 'https://api.themoviedb.org/3/tv/' + tmdbId + '?api_key=' + apiKey + '&language=ru';
        fetch(url)
            .then(function(response) {
                if (!response.ok) throw new Error('HTTP error');
                return response.json();
            })
            .then(function(data) {
                        if (data.last_air_date) {
                            callback({ lastAirDate: data.last_air_date });
                        } else if (data.first_air_date) {
                            callback({ lastAirDate: data.first_air_date });
                        } else {
                            callback(null);
                        }
            })
            .catch(function() {
                        callback(null);
            });
    }
    function fetchMovieReleaseDate(tmdbId, apiKey, callback) {
        if (!tmdbId || (typeof tmdbId === 'string' && tmdbId.startsWith('unknown_')) || isNaN(parseInt(tmdbId))) {
            callback(null);
            return;
        }
        var url = 'https://api.themoviedb.org/3/movie/' + tmdbId + '?api_key=' + apiKey + '&language=ru';
        fetch(url)
            .then(function(response) {
                if (!response.ok) throw new Error('HTTP error');
                return response.json();
            })
            .then(function(data) {
                        if (data.release_date) {
                            callback({ releaseDate: data.release_date });
                        } else {
                            callback(null);
                        }
            })
            .catch(function() {
                        callback(null);
            });
    }
    // ═══ ПОИСК TMDB ID ПО НАЗВАНИЮ (ФОЛБЭК) ═══
    function searchTmdbIdByTitle(title, year, apiKey, callback) {
        if (!title || !apiKey) {
            callback(null);
            return;
        }

        // Очищаем название от лишних символов
        var cleanTitle = title.replace(/[\[\]()]/g, '').trim();
        var searchUrl = 'https://api.themoviedb.org/3/search/tv?api_key=' + apiKey + 
                       '&language=ru&query=' + encodeURIComponent(cleanTitle);

        if (year) {
            searchUrl += '&first_air_date_year=' + year;
        }


        fetch(searchUrl)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('TMDB Search API error: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                if (data.results && data.results.length > 0) {
                    var foundId = data.results[0].id;
                    callback(foundId);
                } else {
                    callback(null);
                }
            })
            .catch(function(error) {
                callback(null);
            });
    }

    function fetchNextEpisodeInfo(tmdbId, apiKey, callback) {
        if (!tmdbId || (typeof tmdbId === 'string' && tmdbId.startsWith('unknown_')) || isNaN(parseInt(tmdbId))) {
            callback(null);
            return;
        }
        var url = 'https://api.themoviedb.org/3/tv/' + tmdbId + '?api_key=' + apiKey + '&language=ru';
        fetch(url)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('TMDB API error: ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                if (data.next_episode_to_air) {
                    callback({
                        nextEpisodeDate: data.next_episode_to_air.air_date,
                        episodeNumber: data.next_episode_to_air.episode_number,
                        seasonNumber: data.next_episode_to_air.season_number
                    });
                } else {
                    callback(null);
                }
            })
            .catch(function(error) {
                callback(null);
            });
    }
    function calculateDaysUntil(dateString) {
        var targetDate = new Date(dateString);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);
        var diffTime = targetDate.getTime() - today.getTime();
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }
    function initCardListener() {
        if (window.drxaos_card_listener_initialized) {
            return;
        }
        
        // Проверка версии Lampa
        var isLampa3 = window.Lampa && window.Lampa.Manifest && window.Lampa.Manifest.app_digital >= 300;
        
        if (!window.Lampa) {
            setTimeout(initCardListener, 100);
            return;
        }
        
        // Для Lampa 3.0+ используем модульную систему
        if (isLampa3) {
            // В Lampa 3.0 используется событийная система через Lampa.Listener
            // Карточки создаются через Lampa.Maker, события автоматически доступны
            window.drxaos_card_listener_initialized = true;
            log('Lampa 3.0+ detected, using new event system');
            return;
        }
        
        // Для старых версий используем старый метод
        if (!window.Lampa.Card || !window.Lampa.Card.prototype) {
            setTimeout(initCardListener, 100);
            return;
        }
        
        window.drxaos_card_listener_initialized = true;
        Object.defineProperty(window.Lampa.Card.prototype, 'build', {
            get: function() {
                return this._build;
            },
            set: function(value) {
                this._build = function() {
                    value.apply(this);
                    Lampa.Listener.send('card', {
                        type: 'build',
                        object: this
                    });
                }.bind(this);
            }
        });
    }
    initCardListener();
    Lampa.Listener.follow('card', function(event) {
        if (event.type === 'build' && event.object && event.object.card && event.object.data) {
            var cardElement = null;
            if (event.object.card instanceof jQuery || event.object.card.jquery) {
                cardElement = event.object.card[0];
            } else if (event.object.card instanceof HTMLElement) {
                cardElement = event.object.card;
            } else if (typeof event.object.card === 'object' && event.object.card.nodeType === 1) {
                cardElement = event.object.card;
            }
            var cardData = event.object.data;
            if (cardElement && cardData) {
                var normalizedData = {
                    id: cardData.id,
                    tmdb_id: cardData.id,
                    title: cardData.title || cardData.name || '',
                    original_title: cardData.original_title || cardData.original_name || '',
                    type: cardData.name ? 'tv' : 'movie',
                    release_date: cardData.release_date || cardData.first_air_date || ''
                };
                cardDataStorage.set(cardElement, normalizedData);
            }
        }
    });
    if (window.drxaosGlobalObserver) {
        window.drxaosQualityHandler = function(mutations) {
            var hasNewCards = false;
            for (var i = 0; i < mutations.length; i++) {
                var mutation = mutations[i];
                if (mutation.type === 'childList') {
                    var addedNodes = mutation.addedNodes;
                    for (var j = 0; j < addedNodes.length; j++) {
                        var node = addedNodes[j];
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('card')) {
                                hasNewCards = true;
                            } else if (node.querySelector && node.querySelector('.card')) {
                                hasNewCards = true;
                            }
                        }
                    }
                }
            }
            if (hasNewCards) {
                setTimeout(processAllCards, 100);
                setTimeout(moveAllCardAges, 150);
            }
        };
    } else {
        var observer = new MutationObserver(function(mutations) {
            var hasNewCards = false;
            for (var i = 0; i < mutations.length; i++) {
                var mutation = mutations[i];
                if (mutation.type === 'childList') {
                    var addedNodes = mutation.addedNodes;
                    for (var j = 0; j < addedNodes.length; j++) {
                        var node = addedNodes[j];
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('card')) {
                                hasNewCards = true;
                            } else if (node.querySelector && node.querySelector('.card')) {
                                hasNewCards = true;
                            }
                        }
                    }
                }
            }
            if (hasNewCards) {
                setTimeout(processAllCards, 100);
                setTimeout(moveAllCardAges, 150);
            }
        });
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }
    setTimeout(processAllCards, 100);
}
function drxaosIsTitleLogoEnabled() {
    return Lampa.Storage.get('drxaos_logo_titles', 'off') === 'on';
}
function drxaosResetTitleLogoCache() {
    DRXAOS_TITLE_LOGO_CACHE = {};
    DRXAOS_TITLE_LOGO_PENDING = {};
}
function drxaosClearRenderedTitleLogos() {
    if (!window.jQuery) return;
    window.jQuery('.drxaos-has-logo').each(function() {
        var $node = window.jQuery(this);
        var original = $node.data('drxaos-title-text');
        if (typeof original !== 'undefined') {
            $node.text(original);
            $node.removeData('drxaos-title-text');
        }
        $node.removeClass('drxaos-has-logo');
    });
}
function drxaosGetTitleNode(render) {
    if (!render || !render.find) return null;
    var node = render.find('.full-start-new__title').first();
    return node && node.length ? node : null;
}
function drxaosRestoreTitleLogo(render) {
    var titleNode = drxaosGetTitleNode(render);
    if (!titleNode) return;
    var original = titleNode.data('drxaos-title-text');
    if (typeof original !== 'undefined') {
        titleNode.text(original);
        titleNode.removeData('drxaos-title-text');
    }
    titleNode.removeClass('drxaos-has-logo');
}
function drxaosSetTitleLogoContent(render, imgUrl, altText) {
    var titleNode = drxaosGetTitleNode(render);
    if (!titleNode) return;
    if (!imgUrl) {
        drxaosRestoreTitleLogo(render);
        return;
    }
    if (typeof titleNode.data('drxaos-title-text') === 'undefined') {
        titleNode.data('drxaos-title-text', titleNode.text());
    }
    var img = document.createElement('img');
    img.className = 'drxaos-title-logo';
    img.src = imgUrl;
    img.alt = altText || '';
    img.style.maxHeight = '125px';
    img.style.marginTop = '5px';
    img.style.objectFit = 'contain';
    titleNode.empty().append(img).addClass('drxaos-has-logo');
}
function drxaosGetPreferredLanguageCode() {
    var language = (Lampa.Storage.get('language', 'en') || 'en').toLowerCase();
    return (language.split('-')[0] || language || 'en').toLowerCase();
}
function drxaosSelectLogoPath(logos, langShort) {
    if (!logos || !logos.length) return null;
    var exact = logos.find(function(logo) {
        return (logo.iso_639_1 || '').toLowerCase() === langShort;
    });
    if (exact) return exact.file_path;
    var english = logos.find(function(logo) {
        return (logo.iso_639_1 || '').toLowerCase() === 'en';
    });
    if (english) return english.file_path;
    return logos[0].file_path;
}
function drxaosFetchTitleLogoData(movie, type) {
    return new Promise(function(resolve, reject) {
        if (!window.Lampa || !Lampa.TMDB || typeof Lampa.TMDB.api !== 'function') {
            reject('TMDB unavailable');
            return;
        }
        var apiKey = typeof Lampa.TMDB.key === 'function' ? Lampa.TMDB.key() : '';
        if (!apiKey) {
            reject('TMDB key missing');
            return;
        }
        var language = Lampa.Storage.get('language', 'en') || 'en';
        var langShort = drxaosGetPreferredLanguageCode();
        var includeLangParam = langShort + ',en,null';
        var query = type + '/' + movie.id + '/images?api_key=' + apiKey + '&language=' + language + '&include_image_language=' + includeLangParam;
        var url = Lampa.TMDB.api(query);
        fetch(url).then(function(response) {
            if (!response.ok) throw new Error('TMDB status ' + response.status);
            return response.json();
        }).then(function(data) {
            var path = drxaosSelectLogoPath(data && data.logos, langShort);
            if (!path) {
                resolve(null);
                return;
            }
            resolve({
                url: Lampa.TMDB.image('/t/p/w500' + path.replace('.svg', '.png')),
                alt: movie.title || movie.name || movie.original_title || ''
            });
        }).catch(function(err) {
            reject(err);
        });
    });
}
function drxaosApplyTitleLogoForRender(movie, render) {
    if (!render || !movie || !movie.id) {
        drxaosRestoreTitleLogo(render);
        return;
    }
    var type = movie.name ? 'tv' : 'movie';
    var cacheKey = type + '_' + movie.id;
    if (DRXAOS_TITLE_LOGO_CACHE.hasOwnProperty(cacheKey)) {
        var cached = DRXAOS_TITLE_LOGO_CACHE[cacheKey];
        if (cached && drxaosIsTitleLogoEnabled()) {
            drxaosSetTitleLogoContent(render, cached.url, cached.alt);
        } else {
            drxaosRestoreTitleLogo(render);
        }
        return;
    }
    if (DRXAOS_TITLE_LOGO_PENDING[cacheKey]) return;
    DRXAOS_TITLE_LOGO_PENDING[cacheKey] = true;
    drxaosFetchTitleLogoData(movie, type).then(function(result) {
        DRXAOS_TITLE_LOGO_CACHE[cacheKey] = result;
        if (result && drxaosIsTitleLogoEnabled()) {
            drxaosSetTitleLogoContent(render, result.url, result.alt);
        } else {
            drxaosRestoreTitleLogo(render);
        }
    }).catch(function() {
        DRXAOS_TITLE_LOGO_CACHE[cacheKey] = null;
        drxaosRestoreTitleLogo(render);
    }).finally(function() {
        delete DRXAOS_TITLE_LOGO_PENDING[cacheKey];
    });
}
function drxaosHandleTitleLogo(movie, render) {
    if (!render) return;
    if (!drxaosIsTitleLogoEnabled()) {
        drxaosRestoreTitleLogo(render);
        return;
    }
    drxaosApplyTitleLogoForRender(movie, render);
}
function drxaosIsOriginalTitleEnabled() {
    return Lampa.Storage.get('drxaos_original_titles', 'off') === 'on';
}
function drxaosResetOriginalNamesCache() {
    DRXAOS_ORIGINAL_NAME_CACHE = {};
    DRXAOS_ORIGINAL_NAME_PENDING = {};
}
function drxaosClearOriginalNameBlock(render) {
    var target = render;
    if (!target) {
        try {
            var activity = Lampa.Activity && Lampa.Activity.active ? Lampa.Activity.active().activity : null;
            target = activity ? activity.render() : null;
        } catch (e) {
            target = null;
        }
    }
    if (!target || !target.find) return;
    var block = target.find('.drxaos-original-title-block');
    if (block && block.length) block.remove();
}
function drxaosSetOriginalNameBlock(render, data) {
    if (!render || !render.find) return;
    drxaosClearOriginalNameBlock(render);
    if (!data) return;
    var lines = [];
    var showRu = !!data.ruTitle;
    if (data.ruTitle && showRu) lines.push('<div>Ru: ' + mediaValue(data.ruTitle) + '</div>');
    if (data.enTitle) lines.push('<div>En: ' + mediaValue(data.enTitle) + '</div>');
    if (data.origTitle) lines.push('<div>Orig: ' + mediaValue(data.origTitle) + '</div>');
    if (!lines.length) return;
    var block = document.createElement('div');
    block.className = 'drxaos-original-title-block';
    block.innerHTML = lines.join('');
    render.find('.full-start-new__title').after(block);

    function mediaValue(str) {
        return (str || '').replace(/[<>&]/g, '');
    }
}
function drxaosFetchOriginalNames(movie, type) {
    return new Promise(function(resolve) {
        if (!movie || !movie.id || !window.Lampa || !Lampa.TMDB) {
            resolve(null);
            return;
        }
        var cacheKey = type + '_' + movie.id;
        if (DRXAOS_ORIGINAL_NAME_CACHE.hasOwnProperty(cacheKey)) {
            resolve(DRXAOS_ORIGINAL_NAME_CACHE[cacheKey]);
            return;
        }
        if (DRXAOS_ORIGINAL_NAME_PENDING[cacheKey]) {
            DRXAOS_ORIGINAL_NAME_PENDING[cacheKey].then(resolve);
            return;
        }
        var tmdbKey = (Lampa.Storage.get('tmdb_api_key') || BUILTIN_TMDB_KEY || '').trim();
        if (!tmdbKey) {
            resolve(null);
            return;
        }
        var languages = ['en-US', 'ru-RU'];
        var promises = languages.map(function(lang) {
            var query = type + '/' + movie.id + '?language=' + lang + '&api_key=' + tmdbKey;
            var url = Lampa.TMDB.api(query);
            return fetch(url).then(function(response) {
                if (!response.ok) throw new Error('TMDB status ' + response.status);
                return response.json();
            }).catch(function() {
                return null;
            });
        });
        var pending = Promise.all(promises).then(function(results) {
            var enData = results[0] || {};
            var ruData = results[1] || {};
            var payload = {
                enTitle: enData.title || enData.name || '',
                ruTitle: ruData.title || ruData.name || '',
                origTitle: movie.original_title || movie.original_name || enData.original_title || enData.original_name || ''
            };
            DRXAOS_ORIGINAL_NAME_CACHE[cacheKey] = payload;
            return payload;
        }).catch(function() {
            DRXAOS_ORIGINAL_NAME_CACHE[cacheKey] = null;
            return null;
        }).finally(function() {
            delete DRXAOS_ORIGINAL_NAME_PENDING[cacheKey];
        });
        DRXAOS_ORIGINAL_NAME_PENDING[cacheKey] = pending;
        pending.then(resolve).catch(function() {
            resolve(null);
        });
    });
}
function drxaosHandleOriginalNames(movie, render) {
    if (!render) return;
    drxaosClearOriginalNameBlock(render);
    if (!drxaosIsOriginalTitleEnabled()) return;
    if (!movie || !movie.id) return;
    var type = movie.name ? 'tv' : 'movie';
    drxaosFetchOriginalNames(movie, type).then(function(result) {
        if (!result) return;
        drxaosSetOriginalNameBlock(render, result);
    });
}
function openApiKeyInput(paramName, title, placeholder) {
    var existingModal = document.querySelector('.drxaos-api-modal');
    if (existingModal) {
        existingModal.remove();
    }
    var modal = document.createElement('div');
    modal.className = 'drxaos-api-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, var(--drxaos-surface-opacity));
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    `;
    modal.innerHTML = `
        <div style="
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 20px;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
        ">
            <h3 style="
                color: #fff;
                margin: 0 0 15px 0;
                font-size: 16px;
                font-weight: 500;
            ">${title}</h3>
            <input type="text" id="api-key-input" placeholder="${placeholder}" style="
                width: 100%;
                padding: 10px;
                border: 1px solid #444;
                border-radius: 4px;
                background: #2a2a2a;
                color: #fff;
                font-size: 14px;
                box-sizing: border-box;
                margin-bottom: 15px;
            " />
            <div style="
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            ">
                <button id="save-api-btn" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                ">Сохранить</button>
                <button id="cancel-api-btn" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                ">Отмена</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    var input = document.getElementById('api-key-input');
    var saveBtn = document.getElementById('save-api-btn');
    var cancelBtn = document.getElementById('cancel-api-btn');
    setTimeout(function() {
        if (input) {
            input.focus();
            input.select();
        }
    }, 100);
    saveBtn.onclick = function() {
        var value = input.value.trim();
        if (value) {
            Lampa.Storage.set(paramName, value);
            if (Lampa.Noty) {
                Lampa.Noty.show('✅ ' + title + ' сохранен!');
            }
            closeApiKeyModal();
            if (paramName === 'tmdb_api_key') {
                applySeasonInfo();
            } else if (paramName === 'jacred_url') {
                applyMovieQuality();
            }
        } else {
            if (Lampa.Noty) {
                Lampa.Noty.show('⚠️ Поле не может быть пустым!');
            }
        }
    };
    cancelBtn.onclick = closeApiKeyModal;
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeApiKeyModal();
        }
    };
    var handleEscape = function(e) {
        if (e.key === 'Escape') {
            closeApiKeyModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    input.onkeydown = function(e) {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
    };
}
function closeApiKeyModal() {
    var modal = document.querySelector('.drxaos-api-modal');
    if (modal) {
        modal.remove();
    }
}
window.openApiKeyInput = openApiKeyInput;
window.closeApiKeyModal = closeApiKeyModal;

function ensureExternalProxyCompatibility() {
    try {
        if (!window.fetch || window.fetch._drxaosProxySafe) return;
        var nativeFetch = window.fetch.bind(window);
        var tmdbMarker = 'https://api.themoviedb.org/3/';
        var proxyPattern = /workers\.dev(?::\d+)?\/https:\/\/api\.themoviedb\.org\/3\//i;

        function extractFetchUrl(input) {
            if (!input) return '';
            if (typeof input === 'string') return input;
            if (typeof Request !== 'undefined' && input instanceof Request) return input.url || '';
            if (input && typeof input.url === 'string') return input.url;
            return '';
        }

        function buildFetchInit(requestLike, init) {
            if (init) return init;
            if (typeof Request !== 'undefined' && requestLike instanceof Request) {
                return {
                    method: requestLike.method,
                    headers: requestLike.headers,
                    mode: requestLike.mode,
                    credentials: requestLike.credentials,
                    cache: requestLike.cache,
                    redirect: requestLike.redirect,
                    referrer: requestLike.referrer,
                    referrerPolicy: requestLike.referrerPolicy,
                    integrity: requestLike.integrity,
                    keepalive: requestLike.keepalive,
                    signal: requestLike.signal,
                    priority: requestLike.priority || undefined
                };
            }
            return undefined;
        }

        window.fetch = function(input, init) {
            var url = extractFetchUrl(input);
            if (url && proxyPattern.test(url)) {
                var idx = url.indexOf(tmdbMarker);
                if (idx > -1) {
                    var directUrl = url.slice(idx);
                    if (directUrl.startsWith(tmdbMarker)) {
                        var nextInit = buildFetchInit(input, init);
                        return nativeFetch(directUrl, nextInit);
                    }
                }
            }
            return nativeFetch(input, init);
        };
        window.fetch._drxaosProxySafe = true;
        log('Applied TMDB proxy compatibility patch for external plugins');
    } catch (err) {
        logError('Failed to patch external proxy compatibility', err);
    }
}

function initDrxaosGlobalObserver() {
    if (window.drxaosGlobalObserver) return;
    var observerThrottle = null;
    var pendingMutations = [];
    function processMutations() {
        if (pendingMutations.length === 0) return;
        var mutations = pendingMutations.slice();
        pendingMutations = [];
        if (window.drxaosQualityHandler) {
            requestAnimationFrame(function() {
                window.drxaosQualityHandler(mutations);
            });
        }
        if (window.drxaosLabelsHandler) {
            requestAnimationFrame(function() {
                window.drxaosLabelsHandler(mutations);
            });
        }
        if (window.drxaosSeasonHandler) {
            requestAnimationFrame(function() {
                window.drxaosSeasonHandler(mutations);
            });
        }
        if (window.drxaosButtonsHandler) {
            requestAnimationFrame(function() {
                window.drxaosButtonsHandler(mutations);
            });
        }
    }
    window.drxaosGlobalObserver = new MutationObserver(function(mutations) {
        pendingMutations.push.apply(pendingMutations, mutations);
        if (!observerThrottle) {
            observerThrottle = setTimeout(function() {
                observerThrottle = null;
                processMutations();
            }, CONFIG.PERFORMANCE.MUTATION_THROTTLE);
        }
    });
    window.drxaosGlobalObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}
function drxaosApplyAllSettings() {
    try {
        var theme = Lampa.Storage.get('drxaos_theme', 'midnight');
        applyThemeImmediate(theme);
        applyAdvancedSettings();
        applyGlow();
        applyAnimations();
        applyFontFamily();
        applyFontWeight();
        applyDetailsStyles();
        applyReactionsPanelStyles();
        applyRateLineStyles();
        applySeasonInfo();
        applySourceFilter();
        applyMovieQuality();
        syncActionButtons();
    } catch (e) {
        logError('Error applying DRXAOS settings bundle', e);
    }
}
var drxaosApplyAllDebounced = debounce(drxaosApplyAllSettings, 150);
window.drxaosScheduleApply = function() {
    drxaosApplyAllDebounced();
};
window.drxaosApplyAll = function() {
    drxaosApplyAllSettings();
};
if (window.drxaosPostDefaultsQueue && window.drxaosPostDefaultsQueue.length) {
    window.drxaosPostDefaultsQueue = [];
    window.drxaosApplyAll();
}
function startPlugin() {
    try {
        log('Initialization started');
        ensureExternalProxyCompatibility();
        initDrxaosGlobalObserver();
        renderingOptimizer.applyOptimizations();
        setTimeout(function() {
            renderingOptimizer.fixDeprecatedSliders();
        }, 1000);
    renderingOptimizer.setupDynamicElementObserver();

addSettings();

var theme = Lampa.Storage.get('drxaos_theme', 'red');
applyTheme(theme);
applyAdvancedSettings();
applyFontFamily();
applyDetailsStyles();
applyReactionsPanelStyles();
applyRateLineStyles();
syncActionButtons();
window.drxaosButtonsHandler = function(mutations) {
    var shouldUpdate = true;
    if (Array.isArray(mutations)) {
        shouldUpdate = mutations.some(function(mutation) {
            if (!mutation) return false;
            if (mutation.addedNodes && mutation.addedNodes.length) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    if (nodeTouchesButtons(mutation.addedNodes[i])) return true;
                }
            }
            if (mutation.removedNodes && mutation.removedNodes.length) {
                for (var j = 0; j < mutation.removedNodes.length; j++) {
                    if (nodeTouchesButtons(mutation.removedNodes[j])) return true;
                }
            }
            var target = mutation.target;
            if (nodeTouchesButtons(target)) return true;
            return false;
        });
    }
    if (shouldUpdate) {
        syncActionButtons();
    }

    function nodeTouchesButtons(node) {
        if (!node || node.nodeType !== 1) return false;
        if (node.matches && node.matches('.full-start__buttons, .full-start-new__buttons, .full-start__button')) return true;
        if (node.closest && node.closest('.full-start__buttons, .full-start-new__buttons')) return true;
        if (node.querySelector && node.querySelector('.full-start__buttons, .full-start-new__buttons, .full-start__button')) return true;
        return false;
    }
};
if (window.requestIdleCallback) {
    requestIdleCallback(function() {
        applySeasonInfo();
        applySourceFilter();
        applyMovieQuality();
        syncActionButtons();
    }, { timeout: 2000 });
} else {
    setTimeout(function() {
        applySeasonInfo();
        applySourceFilter();
        applyMovieQuality();
        syncActionButtons();
    }, 1000);
}
addQuickThemeButton();
pinSettingsComponentTop();
Lampa.Listener.follow('full', function(e) {
    if (e.type === 'complite') {
        setTimeout(function() {
            var render = e.object && e.object.activity ? e.object.activity.render() : null;
            syncActionButtons(render);
        }, 200);
    }
});
    } catch(e) {
    }
}
if (window.appready) {
    try {
        startPlugin();
    } catch(e) {
    }
} else {
    try {
Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') {
                try {
                    startPlugin();
                } catch(e) {
                }
            }
        });
    } catch(e) {
    }
}
    if (window.Lampa) {
        try {
        $(document).ready(function() {
            setTimeout(function() {
                    try {
                applyAdvancedSettings();
                        var theme = Lampa.Storage.get('drxaos_theme', 'red');
                        applyTheme(theme);
                    } catch(e) {
                    }
            }, 1000);
        });
        } catch(e) {
        }
    }
    $(document).on('keydown.drxaosGlobalEsc', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            var $modal = $('.drxaos-quick-theme-modal');
            if ($modal.length > 0 && $modal.is(':visible')) {
                $modal.fadeOut(200, function() {
                    $modal.remove();
                });
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
                setTimeout(function() {
                    var $btn = $('#drxaos-quick-theme-btn');
                    if ($btn.length) {
                        $btn.focus();
                    }
                }, 300);
            }
        }
    });
    setTimeout(function() {
        var filterButtonCSS = `
            div.simple-button.simple-button--filter.filter--filter.selector {
                background: rgba(var(--bg-rgb, 12, 12, 12), var(--drxaos-surface-opacity)) !important;
                border: 2px solid rgba(var(--primary-rgb), 1) !important;
                border-radius: 2em !important;
                color: var(--text-main) !important;
                font-family: var(--drxaos-font-family) !important;
                font-size: 1em !important;
                padding: 0.8em 1.5em !important;
                margin: 0.3em !important;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
                display: flex !important;
                align-items: center !important;
                gap: 0.5em !important;
                min-height: 2.5em !important;
            }
            div.simple-button.simple-button--filter.filter--filter.selector:hover {
                background: rgba(var(--primary-rgb), var(--drxaos-surface-opacity)) !important;
                border: 2px solid rgba(var(--secondary-rgb), 1) !important;
                border-radius: 2.5em !important;
                color: var(--text-main) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
                transform: scale(1.02) !important;
            }
            div.simple-button.simple-button--filter.filter--filter.selector.focus {
                background: rgba(var(--secondary-rgb), var(--drxaos-surface-opacity)) !important;
                border: 2px solid rgba(var(--primary-rgb), 1) !important;
                border-radius: 2.5em !important;
                color: var(--text-main) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
                transform: scale(1.02) !important;
            }
            .modal .simple-button,
            .modal .selector,
            .modal .menu__item,
            .modal .settings-param {
                border: 1px solid var(--theme-primary, #5a3494) !important;
                margin: 0.3em !important;
                padding: 0.8em 1em !important;
                min-height: auto !important;
                display: block !important;
                transition: transform 0.3s ease !important, opacity 0.3s ease !important;
            }
.modal .simple-button:hover,
.modal .selector:hover,
.modal .menu__item:hover,
.modal .settings-param:hover {
    border: 1px solid var(--theme-accent, #0088bb) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);
}
        `;
        var style = document.createElement('style');
        style.id = 'drxaos-filter-button-fix';
        style.textContent = filterButtonCSS;
        document.head.appendChild(style);
        setTimeout(function() {
            var filterButtons = document.querySelectorAll('div.simple-button.simple-button--filter.filter--filter.selector');
            filterButtons.forEach(function(button) {
                if (button) {
                    button.style.setProperty('background', 'rgba(var(--bg-rgb, 12, 12, 12), var(--drxaos-surface-opacity))', 'important');
                    button.style.setProperty('border', '2px solid rgba(var(--primary-rgb), 1)', 'important');
                    button.style.setProperty('border-radius', '2em', 'important');
                    button.style.setProperty('color', 'var(--text-main, #ffffff)', 'important');
                    button.style.setProperty('font-family', 'var(--drxaos-font-family)', 'important');
                    button.style.setProperty('font-size', '0.9em', 'important');
                    button.style.setProperty('padding', '0.8em 1.5em', 'important');
                    button.style.setProperty('margin', '0.3em', 'important');
                    button.style.setProperty('transition', 'all 0.3s ease', 'important');
                    button.style.setProperty('backdrop-filter', 'blur(20px) saturate(180%)', 'important');
                    button.style.setProperty('-webkit-backdrop-filter', 'blur(20px) saturate(180%)', 'important');
                    button.style.setProperty('box-shadow', '0 4px 12px rgba(0, 0, 0, var(--drxaos-surface-opacity))', 'important');
                    button.style.setProperty('display', 'flex', 'important');
                    button.style.setProperty('align-items', 'center', 'important');
                    button.style.setProperty('gap', '0.5em', 'important');
                    button.style.setProperty('min-height', '2.5em', 'important');
                }
            });
        }, 1500);
    }, 1000);
    (function() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('torrent-serial')) {
                                applyTorrentSerialStyles(node);
                            }
                            var torrentSerials = node.querySelectorAll && node.querySelectorAll('.torrent-serial');
                            if (torrentSerials && torrentSerials.length > 0) {
                                torrentSerials.forEach(function(item) {
                                    applyTorrentSerialStyles(item);
                                });
                            }
                            if (node.classList && node.classList.contains('selectbox-item')) {
                                applySelectboxStyles(node);
                            }
                            var selectboxItems = node.querySelectorAll && node.querySelectorAll('.selectbox-item');
                            if (selectboxItems && selectboxItems.length > 0) {
                                selectboxItems.forEach(function(item) {
                                    applySelectboxStyles(item);
                                });
                            }
                        }
                    });
                }
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
            function applyTorrentSerialStyles(item) {
                item.style.setProperty('display', 'flex', 'important');
                item.style.setProperty('flex-direction', 'row', 'important');
                item.style.setProperty('align-items', 'flex-start', 'important');
                item.style.setProperty('gap', '1em', 'important');
                item.style.setProperty('background', 'rgba(255, 255, 255, 0.03)', 'important');
                item.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.95)', 'important');
                item.style.setProperty('border-radius', '0.5em', 'important');
                item.style.setProperty('padding', '1em', 'important');
                item.style.setProperty('margin', '0.5em 0', 'important');
                item.style.setProperty('min-height', '140px', 'important');
                item.style.setProperty('transition', 'all 0.2s ease', 'important');
                var poster = item.querySelector('.torrent-serial__img');
                if (poster) {
                    poster.style.setProperty('width', '80px', 'important');
                    poster.style.setProperty('height', '120px', 'important');
                    poster.style.setProperty('object-fit', 'cover', 'important');
                    poster.style.setProperty('border-radius', '0.3em', 'important');
                    poster.style.setProperty('flex-shrink', '0', 'important');
                }
                var content = item.querySelector('.torrent-serial__content');
                if (content) {
                    content.style.setProperty('flex', '1', 'important');
                    content.style.setProperty('padding', '0', 'important');
                    content.style.setProperty('min-width', '0', 'important');
                }
                var sections = item.querySelectorAll('.torrent-files, .tracks-metainfo');
                sections.forEach(function(section) {
                    section.style.setProperty('margin-top', '0.5em', 'important');
                    section.style.setProperty('padding', '0', 'important');
                    section.style.setProperty('background', 'transparent', 'important');
                    section.style.setProperty('border', 'none', 'important');
                    section.style.setProperty('border-radius', '0', 'important');
                });
                var audioItems = item.querySelectorAll('.tracks-metainfo__item');
                audioItems.forEach(function(audioItem) {
                    audioItem.style.setProperty('display', 'flex', 'important');
                    audioItem.style.setProperty('flex-direction', 'row', 'important');
                    audioItem.style.setProperty('flex-wrap', 'nowrap', 'important');
                    audioItem.style.setProperty('align-items', 'center', 'important');
                    audioItem.style.setProperty('gap', '0.3em', 'important');
                    audioItem.style.setProperty('padding', '0.4em 0.6em', 'important');
                    audioItem.style.setProperty('margin', '0', 'important');
                    audioItem.style.setProperty('font-size', '0.9em', 'important');
                    audioItem.style.setProperty('background', 'transparent', 'important');
                    audioItem.style.setProperty('border', 'none', 'important');
                    audioItem.style.setProperty('border-bottom', '1px solid rgba(255, 255, 255, 0.05)', 'important');
                    audioItem.style.setProperty('border-radius', '0', 'important');
                    audioItem.style.setProperty('min-height', '2em', 'important');
                    audioItem.style.setProperty('max-height', '3em', 'important');
                    audioItem.style.setProperty('overflow', 'hidden', 'important');
                    var columns = audioItem.querySelectorAll('[class*="tracks-metainfo__column"]');
                    columns.forEach(function(col) {
                        col.style.setProperty('display', 'inline-block', 'important');
                        col.style.setProperty('padding', '0.2em 0.4em', 'important');
                        col.style.setProperty('margin', '0', 'important');
                        col.style.setProperty('font-size', '0.85em', 'important');
                        col.style.setProperty('white-space', 'nowrap', 'important');
                        col.style.setProperty('background', 'rgba(255, 255, 255, 0.05)', 'important');
                        col.style.setProperty('border-radius', '0.2em', 'important');
                        col.style.setProperty('flex-shrink', '0', 'important');
                    });
                });
            var lines = item.querySelectorAll('.tracks-metainfo__line');
            lines.forEach(function(line) {
                line.style.setProperty('display', 'flex', 'important');
                line.style.setProperty('align-items', 'center', 'important');
                line.style.setProperty('gap', '0.5em', 'important');
                line.style.setProperty('padding', '0.4em 0.6em', 'important');
                line.style.setProperty('margin', '0.2em 0', 'important');
                line.style.setProperty('font-size', '0.9em', 'important');
                line.style.setProperty('background', 'transparent', 'important');
                line.style.setProperty('border', 'none', 'important');
                line.style.setProperty('border-bottom', '1px solid rgba(255, 255, 255, 0.05)', 'important');
                line.style.setProperty('border-radius', '0', 'important');
            });
            var scrollBody = item.querySelector('.scroll__body');
            if (scrollBody) {
                scrollBody.style.setProperty('padding', '0', 'important');
            }
            var sectionTitles = item.querySelectorAll('.torrent-files__title, .tracks-metainfo__title');
            sectionTitles.forEach(function(title) {
                title.style.setProperty('font-size', '1em', 'important');
                title.style.setProperty('padding', '0.5em 0', 'important');
                title.style.setProperty('margin', '0', 'important');
                title.style.setProperty('opacity', '0.7', 'important');
            });
        }
        function applySelectboxStyles(item) {
            var poster = item.querySelector('.selectbox-item__poster');
            if (poster) {
                poster.style.setProperty('display', 'none', 'important');
            }
            var icon = item.querySelector('.selectbox-item__icon');
            if (icon) {
                icon.style.setProperty('display', 'none', 'important');
            }
            item.style.setProperty('background', 'transparent', 'important');
            item.style.setProperty('border', 'none', 'important');
            item.style.setProperty('border-bottom', '1px solid rgba(255, 255, 255, 0.95)', 'important');
            item.style.setProperty('border-radius', '0', 'important');
            item.style.setProperty('padding', '0.8em 1em', 'important');
            item.style.setProperty('margin', '0', 'important');
            var title = item.querySelector('.selectbox-item__title');
            if (title) {
                title.style.setProperty('font-size', '1.1em', 'important');
                title.style.setProperty('line-height', '1.3', 'important');
                title.style.setProperty('padding', '0', 'important');
            }
            var subtitle = item.querySelector('.selectbox-item__subtitle');
            if (subtitle) {
                subtitle.style.setProperty('font-size', '0.995em', 'important');
                subtitle.style.setProperty('margin-top', '0.3em', 'important');
                subtitle.style.setProperty('opacity', '0.7', 'important');
            }
        }
        var existingSerials = document.querySelectorAll('.torrent-serial');
        existingSerials.forEach(function(item) {
            applyTorrentSerialStyles(item);
        });
        var existingItems = document.querySelectorAll('.selectbox-item');
        existingItems.forEach(function(item) {
            applySelectboxStyles(item);
        });
        if (typeof MutationObserver !== 'undefined') {
            var tracksObserver = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        var item = mutation.target;
                        if (item.classList.contains('tracks-metainfo__item') && 
                            item.style.flexWrap !== 'nowrap') {
                            item.style.setProperty('flex-wrap', 'nowrap', 'important');
                        }
                    }
                });
            });
            tracksObserver.observe(document.body, {
                attributes: true,
                attributeFilter: ['style'],
                subtree: true,
                attributeOldValue: false
            });
            log('MutationObserver активирован для tracks.js совместимости');
        } else {
            log('MutationObserver не поддерживается, используется setInterval для tracks.js');
        setInterval(function() {
            var allAudioItems = document.querySelectorAll('.tracks-metainfo__item');
            allAudioItems.forEach(function(audioItem) {
                if (audioItem.style.flexWrap !== 'nowrap') {
                    audioItem.style.setProperty('flex-wrap', 'nowrap', 'important');
                }
            });
            }, 100);
        }
    })();
function applyModalOpacity() {
    var opacity = 0.995;
    document.documentElement.style.setProperty('--modal-opacity', opacity);
}
Lampa.Storage.listener.follow('change', function(e) {});
Lampa.Listener.follow('activity', function(e) {
    if (e.type === 'start') {
        setTimeout(applyModalOpacity, 300);
    }
});
Lampa.Listener.follow('activity', function(e) {
    if (e.type === 'start') {
        setTimeout(function() {
            syncActionButtons();
        }, 500);
    }
});
setTimeout(applyModalOpacity, 500);

    // ╔════════════════════════════════════════════════════════════════════════╗
    // ║                    🛠️ UTILITIES BUTTON MODULE 🛠️                      ║
    // ║  Современный модуль утилит с чистой архитектурой                       ║
    // ╚════════════════════════════════════════════════════════════════════════╝
    
    (function initUtilitiesButton() {
        if (!CONFIG.FEATURES.UTILITIES_BUTTON) return;
        
        var UtilitiesButton = {
            elements: {
                button: null,
                menu: null
            },
            
            state: {
                isMenuOpen: false,
                isEnabled: false,
                controllerActive: false,
                backHandlerAttached: false,
                lastToggleAt: 0,
                lastToggleType: ''
            },
            
            icons: {
                utilities: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88" fill="currentColor"><path d="m0,12.402,35.687-4.8602,0.0156,34.423-35.67,0.20313zm35.67,33.529,0.0277,34.453-35.67-4.9041-0.002-29.78zm4.3261-39.025,47.318-6.906,0,41.527-47.318,0.37565zm47.329,39.349-0.0111,41.34-47.318-6.6784-0.0663-34.739z"/></svg>'
            },
            
            templates: {
                button: function() {
                    return '<div id="drxaos-utils-btn" class="head__action selector" style="position:relative;">' +
                           '  <div class="utils-icon" style="width:1.5em;height:1.5em;display:flex;align-items:center;justify-content:center;">' + UtilitiesButton.icons.utilities + '</div>' +
                           '</div>';
                },
                
                menu: function() {
                    return '<div id="drxaos-utils-menu" class="drxaos-utils-menu selector" style="display:none;">' +
                           '  <div class="utils-menu-item selector" data-action="reload" tabindex="0">' +
                           '    <span class="utils-menu-icon">🔄</span>' +
                           '    <span class="utils-menu-text">Перезагрузка</span>' +
                           '  </div>' +
                           '  <div class="utils-menu-item selector" data-action="console" tabindex="0">' +
                           '    <span class="utils-menu-icon">💻</span>' +
                           '    <span class="utils-menu-text">Консоль</span>' +
                           '  </div>' +
                           '  <div class="utils-menu-item selector" data-action="exit" tabindex="0">' +
                           '    <span class="utils-menu-icon">❌</span>' +
                           '    <span class="utils-menu-text">Выход</span>' +
                           '  </div>' +
                           '</div>';
                },
                
                styles: function() {
                    return '<style id="drxaos-utils-styles">' +
                           '#drxaos-utils-btn { transition: transform 0.3s ease, opacity 0.3s ease; cursor: pointer !important; }' +
                           '#drxaos-utils-btn:hover { transform: scale(1.15); }' +
                           '#drxaos-utils-btn.focus { transform: scale(1.15); }' +
                           '#drxaos-utils-btn .utils-icon { width: 1.5em; height: 1.5em; display: flex; align-items: center; justify-content: flex-start; }' +
                           '#drxaos-utils-btn .utils-icon svg { width: 100%; height: 100%; fill: currentColor; filter: drop-shadow(0 0 4px var(--theme-primary, #5a3494)); }' +
                           '#drxaos-utils-btn:hover .utils-icon svg, #drxaos-utils-btn.focus .utils-icon svg { filter: drop-shadow(0 0 8px var(--theme-primary, #5a3494)); }' +
                           '.drxaos-utils-menu {' +
                           '  position: absolute;' +
                           '  top: calc(100% + 0.5em);' +
                           '  right: 0;' +
                           '  background: rgba(0, 0, 0, var(--drxaos-surface-opacity));' +
                           '  ' +
                           '  border: 2px solid var(--theme-primary, #5a3494);' +
                           '  border-radius: 0.8em;' +
                           '  padding: 0.5em;' +
                           '  min-width: 14em;' +
                           '  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);' +
                           '  z-index: 10000;' +
                           '  animation: fadeInDown 0.3s ease;' +
                           '}' +
                           '@keyframes fadeInDown {' +
                           '  from { opacity: 0; transform: translateY(-10px); }' +
                           '  to { opacity: 1; transform: translateY(0); }' +
                           '}' +
                           '.utils-menu-item {' +
                           '  display: flex;' +
                           '  align-items: center;' +
                           '  padding: 0.8em 1em;' +
                           '  border-radius: 0.5em;' +
                           '  cursor: pointer;' +
                           '  transition: transform 0.2s ease, opacity 0.2s ease;' +
                           '  gap: 0.8em;' +
                           '  background: transparent;' +
                           '  color: #ffffff;' +
                           '}' +
                           '.utils-menu-item:hover, .utils-menu-item.focus, .utils-menu-item:focus {' +
                           '  background: var(--theme-primary, #5a3494) !important;' +
                           '  color: #ffffff !important;' +
                           '  transform: translateX(4px);' +
                           '  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.95);' +
                           '  outline: none;' +
                           '}' +
                           '.utils-menu-icon {' +
                           '  font-size: 1.8em;' +
                           '  line-height: 1;' +
                           '  display: flex;' +
                           '  align-items: center;' +
                           '  justify-content: flex-start;' +
                           '  flex-shrink: 0;' +
                           '}' +
                           '.utils-menu-text {' +
                           '  font-size: 1.1em;' +
                           '  font-weight: 500;' +
                           '  white-space: nowrap;' +
                           '  color: inherit;' +
                           '}' +
                           '</style>';
                }
            },
            
            actions: {
                reload: function() {
                    log('Utilities: Перезагрузка...');
                    location.reload();
                },
                
                console: function() {
                    log('Utilities: Открытие консоли...');
                    if (window.Lampa && window.Lampa.Controller) {
                        Lampa.Controller.toggle('console');
                    }
                },
                
                exit: function() {
                    log('Utilities: Выход из приложения...');
                    
                    if (window.Lampa && window.Lampa.Activity) {
                        Lampa.Activity.out();
                    }
                    
                    setTimeout(function() {
                        if (window.Lampa && window.Lampa.Platform) {
                            if (Lampa.Platform.is('tizen')) {
                                try { tizen.application.getCurrentApplication().exit(); } catch(e) {}
                            } else if (Lampa.Platform.is('webos')) {
                                try { window.close(); } catch(e) {}
                            } else if (Lampa.Platform.is('android')) {
                                try { Lampa.Android.exit(); } catch(e) {}
                            } else if (Lampa.Platform.is('orsay')) {
                                try { Lampa.Orsay.exit(); } catch(e) {}
                            }
                        }
                        
                        try { window.close(); } catch(e) {}
                    }, 100);
                }
            },
            
            openMenu: function() {
                if (!UtilitiesButton.elements.menu) return;
                $(UtilitiesButton.elements.menu).show();
                UtilitiesButton.state.isMenuOpen = true;
                UtilitiesButton.focusFirstMenuItem();
            },
            
            toggleMenu: function() {
                if (!UtilitiesButton.elements.menu) return;
                
                if (UtilitiesButton.state.isMenuOpen) {
                    UtilitiesButton.closeMenu();
                } else {
                    UtilitiesButton.openMenu();
                }
            },
            
            closeMenu: function(restoreFocus) {
                if (UtilitiesButton.elements.menu) {
                    $(UtilitiesButton.elements.menu).hide();
                    UtilitiesButton.state.isMenuOpen = false;
                    UtilitiesButton.state.controllerActive = false;
                }
                if (restoreFocus !== false) {
                    UtilitiesButton.restoreFocusToButton();
                }
            },
            
            focusFirstMenuItem: function() {
                if (!UtilitiesButton.elements.menu) return;
                var $menu = $(UtilitiesButton.elements.menu);
                var $items = $menu.find('.utils-menu-item');
                
                if (window.Lampa && window.Lampa.Controller) {
                    if (typeof Lampa.Controller.collectionSet === 'function') {
                        Lampa.Controller.collectionSet($menu);
                    }
                    UtilitiesButton.state.controllerActive = true;
                    var focusTarget = $items.eq(0);
                    setTimeout(function() {
                        if (!focusTarget.length) return;
                        var targetNode = focusTarget.get(0);
                        if (!targetNode) return;
                        if (typeof Lampa.Controller.collectionFocus === 'function') {
                            Lampa.Controller.collectionFocus(targetNode, $menu);
                        } else if (typeof Lampa.Controller.focus === 'function') {
                            Lampa.Controller.focus(targetNode);
                        } else {
                            targetNode.focus();
                        }
                    }, 50);
                } else if ($items.length) {
                    $items.get(0).focus();
                }
            },
            
            restoreFocusToButton: function() {
                if (!UtilitiesButton.elements.button) return;
                if (window.Lampa && window.Lampa.Controller && typeof Lampa.Controller.focus === 'function') {
                    setTimeout(function() {
                        Lampa.Controller.focus(UtilitiesButton.elements.button);
                    }, 30);
                } else {
                    UtilitiesButton.elements.button.focus();
                }
            },
            
            handleMenuItemAction: function(action) {
                UtilitiesButton.closeMenu();
                
                if (UtilitiesButton.actions[action]) {
                    setTimeout(function() {
                        UtilitiesButton.actions[action]();
                    }, 100);
                }
            },
            
            handleBack: function() {
                if (UtilitiesButton.state.isMenuOpen) {
                    UtilitiesButton.closeMenu();
                    return false;
                }
                return true;
            },
            
            registerBackHandler: function() {
                if (UtilitiesButton.state.backHandlerAttached) return;
                if (window.Lampa && window.Lampa.Listener) {
                    Lampa.Listener.follow('back', UtilitiesButton.handleBack);
                    UtilitiesButton.state.backHandlerAttached = true;
                }
            },
            
            bindEvents: function() {
                if (!UtilitiesButton.elements.button) return;
                
                var $btn = $(UtilitiesButton.elements.button);
                
                               
                function toggleMenu(e) {
                    var eventType = 'manual';
                    if (e) {
                        if (typeof e.preventDefault === 'function') {
                            e.preventDefault();
                        }
                        if (typeof e.stopPropagation === 'function') {
                            e.stopPropagation();
                        }
                        eventType = e.type || 'event';
                    }

                    var now = Date.now();
                    if (UtilitiesButton.state.lastToggleAt && (now - UtilitiesButton.state.lastToggleAt) < 120) {
                        if (UtilitiesButton.state.lastToggleType !== eventType) {
                            return false;
                        }
                    }
                    UtilitiesButton.state.lastToggleAt = now;
                    UtilitiesButton.state.lastToggleType = eventType;

                    var $menu = $('#drxaos-utils-menu');
                    var isVisible = $menu.is(':visible');

                    var toggleBackTarget = 'head';
                    var enabledController = (window.Lampa && Lampa.Controller && typeof Lampa.Controller.enabled === 'function') ? Lampa.Controller.enabled() : null;
                    if (!enabledController || enabledController.name !== 'head') {
                        toggleBackTarget = 'content';
                    }

                    if (isVisible) {
                        $menu.hide();
                        UtilitiesButton.state.isMenuOpen = false;
                        if (window.Lampa && Lampa.Controller) {
                            Lampa.Controller.toggle(toggleBackTarget);
                        }
                    } else {
                        $menu.show();
                        UtilitiesButton.state.isMenuOpen = true;

                        if (window.Lampa && Lampa.Controller) {
                            var utilsController = {
                                toggle: function() {},
                                render: function() { return $menu; },
                                back: function() {
                                    $menu.hide();
                                    UtilitiesButton.state.isMenuOpen = false;
                                    Lampa.Controller.toggle(toggleBackTarget);
                                },
                                left: function() { this.back(); },
                                right: function() { this.back(); },
                                up: function() {
                                    var $items = $('.utils-menu-item');
                                    var $focused = $items.filter('.focus');
                                    if (!$focused.length) { $items.first().addClass('focus').focus(); return; }
                                    var idx = $items.index($focused);
                                    if (idx > 0) { $focused.removeClass('focus'); $items.eq(idx - 1).addClass('focus').focus(); }
                                },
                                down: function() {
                                    var $items = $('.utils-menu-item');
                                    var $focused = $items.filter('.focus');
                                    if (!$focused.length) { $items.first().addClass('focus').focus(); return; }
                                    var idx = $items.index($focused);
                                    if (idx < $items.length - 1) { $focused.removeClass('focus'); $items.eq(idx + 1).addClass('focus').focus(); }
                                },
                                enter: function() {
                                    var $focused = $('.utils-menu-item.focus');
                                    if (!$focused.length) return;
                                    var action = $focused.data('action');
                                    $menu.hide();
                                    UtilitiesButton.state.isMenuOpen = false;
                                    if (action && UtilitiesButton.actions[action]) setTimeout(function() { UtilitiesButton.actions[action](); }, 100);
                                    Lampa.Controller.toggle(toggleBackTarget);
                                }
                            };

                            Lampa.Controller.add('drxaos_utils_modal', utilsController);
                            if (typeof Lampa.Controller.collectionSet === 'function') {
                                Lampa.Controller.collectionSet($menu);
                            }
                            Lampa.Controller.toggle('drxaos_utils_modal');
                        }

                        setTimeout(function() {
                            var $firstItem = $('.utils-menu-item').first();
                            $firstItem.addClass('focus').focus();
                        }, 60);
                    }
                    return false;
                }

                $btn.on('click', toggleMenu);

                // Поддержка пульта/сенсора
                $btn.on('hover:enter hover:click hover:touch', function(e){
                    toggleMenu(e);
                    return false;
                });
                
                               
                $(document).on('click', function(e) {
                    if (UtilitiesButton.state.isMenuOpen && 
                        !$(e.target).closest('#drxaos-utils-btn, #drxaos-utils-menu').length) {
                        UtilitiesButton.closeMenu();
                    }
                });
                
                $(document).on('keydown.drxaosUtils', function(e) {
                    if (!UtilitiesButton.state.isMenuOpen) return;
                    var key = e.key || e.code || e.keyCode;
                    var isEscape = key === 'Escape' || key === 'Esc' || key === 27;
                    if (isEscape) {
                        e.preventDefault();
                        e.stopPropagation();
                        UtilitiesButton.closeMenu();
                        return false;
                    }
                });
                
                if (UtilitiesButton.elements.menu) {
                    var $menu = $(UtilitiesButton.elements.menu);
                    
                    $menu.on('click', '.utils-menu-item', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var action = $(this).data('action');
                        UtilitiesButton.handleMenuItemAction(action);
                        return false;
                    });
                    
                    $menu.on('hover:enter hover:click hover:touch', '.utils-menu-item', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var action = $(this).data('action');
                        UtilitiesButton.handleMenuItemAction(action);
                        return false;
                    });
                }
            },
            
            inject: function() {
                var headActions = document.querySelector('.head__actions');
                if (!headActions) {
                    setTimeout(UtilitiesButton.inject, 500);
                    return;
                }
                
                if (document.getElementById('drxaos-utils-btn')) return;
                
                if (!document.getElementById('drxaos-utils-styles')) {
                    $('head').append(UtilitiesButton.templates.styles());
                }
                
                $(headActions).append(UtilitiesButton.templates.button());
                UtilitiesButton.elements.button = document.getElementById('drxaos-utils-btn');
                
                if (!UtilitiesButton.elements.button) return;
                
                $(UtilitiesButton.elements.button).append(UtilitiesButton.templates.menu());
                UtilitiesButton.elements.menu = document.getElementById('drxaos-utils-menu');
                
                if (!UtilitiesButton.elements.menu) return;
                
                UtilitiesButton.bindEvents();
                UtilitiesButton.state.isEnabled = true;
            },
            
            destroy: function() {
                if (UtilitiesButton.elements.button) {
                    $(UtilitiesButton.elements.button).remove();
                }
                $('#drxaos-utils-styles').remove();
                UtilitiesButton.state.isEnabled = false;
            },
            
            init: function() {
                UtilitiesButton.registerBackHandler();
                
                if (window.Lampa && window.Lampa.Listener) {
                    Lampa.Listener.follow('app', function(e) {
                        if (e.type === 'ready') {
                            setTimeout(UtilitiesButton.inject, 1000);
                        }
                    });
                } else {
                    setTimeout(UtilitiesButton.inject, 2000);
                    setTimeout(UtilitiesButton.registerBackHandler, 2000);
                }
            }

        };
        
        UtilitiesButton.init();
    })();
    
    // ╚════════════════════════════════════════════════════════════════════════╝

setTimeout(function() {
    var selectboxItems = document.querySelectorAll('.selectbox-item');
    selectboxItems.forEach(function(item) {
        addIconsToSelectboxItem(item);
    });
}, 1000);
})();


// 🎨 Force apply theme background on reload/support
(function forceBackgroundFix() {
    function applyBgFix() {
        try {
            document.querySelectorAll('.background, body').forEach(function(el) {
                var style = el.getAttribute('style');
                if (style && /background(-image)?:\s*url/.test(style)) {
                    var clean = style.replace(/background(-image)?:[^;]+;?/gi, '');
                    clean ? el.setAttribute('style', clean) : el.removeAttribute('style');
                }
            });
        } catch(e) {}
    }
    applyBgFix();
    // Observer for style changes
    var obs = new MutationObserver(function(muts) {
        muts.forEach(function(m) {
            if (m.type === 'attributes' && m.attributeName === 'style') {
                var el = m.target;
                if (el.classList.contains('background') || el.tagName.toLowerCase() === 'body') {
                    setTimeout(applyBgFix, 10);
                }
            }
        });
    });
    setTimeout(function() {
        document.querySelectorAll('.background, body').forEach(function(el) {
            obs.observe(el, { attributes: true, attributeFilter: ['style'] });
        });
    }, 500);
    setInterval(applyBgFix, 2000);
})();
function removeLegacyQualityBadges(cardElement) {
    try {
        if (!cardElement) return;
        var legacy = cardElement.querySelectorAll('.card__quality, .card-quality');
        legacy.forEach(function(el, index) {
            if (index > 0) {
                el.remove();
                return;
            }
            el.classList.add('card-quality');
            el.classList.remove('card__quality');
            el.style.display = 'none';
            el.textContent = '';
        });
    } catch (err) {
        logError('Error removing legacy quality badges', err);
    }
}
function colorizeCardVotes(cardElement) {
    try {
        if (!cardElement) return;
        var votes = cardElement.querySelectorAll('.card__vote');
        votes.forEach(function(voteEl) {
            if (!voteEl) return;
            var raw = (voteEl.textContent || '').trim().replace(',', '.');
            var value = parseFloat(raw);
            var color = '#ffd369';
            if (!isNaN(value)) {
                if (value > 7) {
                    color = '#22c55e';
                } else if (value < 7) {
                    color = '#f87171';
                }
            }
            voteEl.style.setProperty('color', color, 'important');
            voteEl.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.8)';
        });
    } catch (err) {
        logError('Error styling card votes', err);
    }
}
