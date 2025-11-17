// DRXAOS SuperMenu v1.0 - Enhanced Menu with Top Bar Button and Card Data Integration
// Based on drxaos_theme structure for Lampa 3.0 compatibility
// Author: Assistant, adapted from user's code and drxaos_theme

(function() {
    'use strict';

    // Lampa 3.0 Compatibility Layer (from drxaos_theme)
    if (typeof Element !== 'undefined') {
        if (!Element.prototype.addClass) Element.prototype.addClass = function(classes) {
            classes.split(' ').forEach(c => { if (c) this.classList.add(c); });
            return this;
        };
        if (!Element.prototype.removeClass) Element.prototype.removeClass = function(classes) {
            classes.split(' ').forEach(c => { if (c) this.classList.remove(c); });
            return this;
        };
        if (!Element.prototype.toggleClass) Element.prototype.toggleClass = function(classes, status) {
            classes.split(' ').forEach(c => {
                if (!c) return;
                var has = this.classList.contains(c);
                if (status !== has) {
                    if (status) this.classList.add(c); else this.classList.remove(c);
                }
            });
            return this;
        };
        if (!Element.prototype.hasClass) Element.prototype.hasClass = function(className) {
            return this.classList.contains(className);
        };
    }

    // jQuery Compatibility (fallback)
    var $ = window.jQuery || window.Lampa.$ || (function() {
        var jQ = { find: function(s) { return document.querySelectorAll(s); }, each: function(fn) { this.forEach(fn); } };
        return { find: function(s) { return Array.from(document.querySelectorAll(s)); } };
    })();

    // Config
    var CONFIG = {
        PLUGINNAME: 'drxaos_supermenu',
        VERSION: '1.0',
        BUILTINTMDBKEY: 'c87a543116135a4120443155bf680876', // From drxaos_theme
        JACREDURL: 'jacred.xyz',
        DEBOUNCEDELAY: 300
    };

    // Storage Helpers (safe get/set from drxaos_theme)
    function safeGet(key, defaultValue) {
        try {
            if (!window.Lampa || !Lampa.Storage) return defaultValue;
            var value = Lampa.Storage.get(key, defaultValue);
            return value !== undefined ? value : defaultValue;
        } catch (e) {
            console.warn('[SuperMenu] Storage.get error', e);
            return defaultValue;
        }
    }
    function safeSet(key, value) {
        try {
            if (!window.Lampa || !Lampa.Storage) return false;
            Lampa.Storage.set(key, value);
            return true;
        } catch (e) {
            console.warn('[SuperMenu] Storage.set error', e);
            return false;
        }
    }

    // Caches for Card Data (from drxaos_theme)
    var CARD_DATA_STORAGE = new WeakMap();
    var CARD_DATA_INDEX = new Map();
    var TMDB_CACHE = {}; // Simple cache for TMDB fetches

    // Fetch TMDB Data (adapted from drxaos_theme)
    function fetchTMDB(id, type, key) {
        return new Promise((resolve) => {
            if (!id || !window.Lampa?.TMDB) {
                resolve(null);
                return;
            }
            key = key || safeGet('tmdbapikey') || CONFIG.BUILTINTMDBKEY;
            if (!key) {
                resolve(null);
                return;
            }
            var query = `${type}/${id}?language=en-US&api_key=${key}`;
            var url = Lampa.TMDB.api + query;
            fetch(url).then(response => response.ok ? response.json() : null)
                .then(data => {
                    if (!data) resolve(null);
                    else {
                        var result = {
                            vote_average: data.vote_average,
                            release_date: data.release_date || data.first_air_date,
                            original_title: data.original_title || data.original_name,
                            countries: data.production_countries?.map(c => c.iso_3166_1).filter(Boolean) || []
                        };
                        TMDB_CACHE[id] = result;
                        resolve(result);
                    }
                }).catch(() => resolve(null));
        });
    }

    // Fetch JacRed Quality (adapted)
    function fetchJacRed(title, year) {
        return new Promise((resolve) => {
            var url = safeGet('jacredurl') || CONFIG.JACREDURL;
            if (!url || !title) {
                resolve('HD'); // Fallback
                return;
            }
            url = `https://${url}/api/v2.2/quick?text=${encodeURIComponent(title + ' ' + year)}&limit=1`;
            fetch(url).then(response => response.json())
                .then(data => {
                    if (data.data && data.data[0]) {
                        var quality = data.data[0].quality || 'HD';
                        resolve(quality);
                    } else resolve('HD');
                }).catch(() => resolve('HD'));
        });
    }

    // Remember/Lookup Card Data (from drxaos_theme)
    function rememberCardData(element, data) {
        try {
            var clone = Object.assign({}, data);
            var keys = [element.dataset.id || '', element.dataset.tmdb || '', data.id || '', data.tmdbid || ''].filter(Boolean);
            keys.forEach(key => CARD_DATA_INDEX.set(key, clone));
            CARD_DATA_STORAGE.set(element, clone);
        } catch (e) {
            console.error('[SuperMenu] Remember card data failed', e);
        }
    }
    function lookupCardData(element) {
        try {
            var keys = [element.dataset.id || '', element.dataset.tmdb || ''].filter(Boolean);
            for (var i = 0; i < keys.length; i++) {
                var stored = CARD_DATA_INDEX.get(keys[i]);
                if (stored) return Object.assign({}, stored);
            }
            return null;
        } catch (e) {
            console.error('[SuperMenu] Lookup card data failed', e);
            return null;
        }
    }

    // Enhance Card with Data
    function enhanceCard(card) {
        if (!card || card.hasClass('drxaos-enhanced')) return;
        card.addClass('drxaos-enhanced');

        var data = lookupCardData(card) || {};
        var tmdbId = data.tmdbid || card.dataset.tmdb || '';
        var type = data.name ? 'tv' : 'movie';
        var title = data.title || card.querySelector('.card__title')?.textContent.trim() || '';
        var year = data.year || card.querySelector('.card__year')?.textContent.match(/\d{4}/)?.[0] || '';

        // Fetch and Apply TMDB Data
        if (tmdbId) {
            fetchTMDB(tmdbId, type).then(tmdbData => {
                if (tmdbData) {
                    rememberCardData(card, Object.assign(data, tmdbData));
                    var voteEl = card.querySelector('.card__vote') || document.createElement('div');
                    voteEl.className = 'card__vote drxaos-vote';
                    voteEl.textContent = `${tmdbData.vote_average?.toFixed(1) || 'N/A'} ⭐`;
                    voteEl.style.cssText = 'color: #FFD700; font-weight: bold; text-shadow: 0 0 3px rgba(0,0,0,0.9); position: absolute; top: 5px; right: 5px; z-index: 10;';
                    card.appendChild(voteEl);

                    var countryEl = document.createElement('div');
                    countryEl.className = 'card__country drxaos-country';
                    countryEl.textContent = tmdbData.countries.join(', ') || 'N/A';
                    countryEl.style.cssText = 'color: #FFD700; font-size: 0.8em; position: absolute; bottom: 5px; left: 5px; z-index: 10;';
                    card.appendChild(countryEl);
                }
            });
        }

        // Fetch JacRed Quality
        if (title && year) {
            fetchJacRed(title, year).then(quality => {
                var qualityEl = card.querySelector('.card__quality') || document.createElement('div');
                qualityEl.className = 'card__quality drxaos-quality';
                qualityEl.textContent = quality;
                qualityEl.style.cssText = 'background: rgba(0,0,0,0.7); color: #FFD700; padding: 2px 5px; border-radius: 3px; position: absolute; top: 5px; left: 5px; z-index: 10; font-weight: bold;';
                card.appendChild(qualityEl);
            });
        }
    }

    // MutationObserver for Cards (from drxaos_theme)
    function initCardObserver() {
        var observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList?.contains('card')) {
                            enhanceCard(node);
                        } else {
                            node.querySelectorAll?.('.card').forEach(enhanceCard);
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Top Bar Button (adapted from addQuickThemeButton in drxaos_theme)
    function addSuperMenuButton() {
        if ($('.drxaos-supermenu-btn').length) return;
        if (!window.jQuery) {
            console.error('[SuperMenu] jQuery not available');
            return;
        }

        var headActions = $('.head .actions').length ? $('.head .actions') :
                         $('.head .headbody').length ? $('.head .headbody') :
                         $('.head').length ? $('.head') : $('header');
        if (!headActions.length) {
            console.error('[SuperMenu] Could not find head actions container');
            return;
        }

        var btn = $('<div class="head__action drxaos-supermenu-btn selector" data-action="drxaos-supermenu">\
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"></path>\
            </svg>\
        </div>');

        try {
            headActions.prepend(btn);
        } catch (e) {
            try {
                headActions.append(btn);
            } catch (e2) {
                console.error('[SuperMenu] Could not add button', e2);
                return;
            }
        }

        btn.on('hover:enter hover:click touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSuperMenu();
            return false;
        });

        console.log('[SuperMenu] Button added successfully');
    }

    // Super Menu Toggle (your original menu, enhanced)
    function toggleSuperMenu() {
        var menu = $('.drxaos-supermenu-modal');
        if (menu.length) {
            menu.remove();
            document.off('keydown.supermenu');
        } else {
            createSuperMenu();
        }
    }

    function createSuperMenu() {
        var modal = $('<div class="drxaos-supermenu-modal"></div>');
        var overlay = $('<div class="drxaos-modal-overlay"></div>');
        var content = $('<div class="drxaos-modal-content"></div>');
        var title = $('<h2 class="drxaos-modal-title">SuperMenu Settings</h2>');
        var themesGrid = $('<div class="drxaos-themes-grid"></div>');

        // Themes List (example from drxaos_theme)
        var themes = [
            {id: 'midnight', name: 'Midnight', icon: '🌙'},
            {id: 'crimson', name: 'Crimson', icon: '🔴'},
            // Add more as needed
        ];

        themes.forEach(theme => {
            var themeBtn = $(`<div class="drxaos-theme-item" data-theme="${theme.id}" tabindex="0">\
                <span class="drxaos-theme-icon">${theme.icon}</span>\
                <span class="drxaos-theme-name">${theme.name}</span>\
            </div>`);
            themeBtn.on('click touchstart keydown', (e) => {
                if (e.type === 'keydown' && e.key !== 'Enter' && e.keyCode !== 13 && e.keyCode !== 32) return;
                e.preventDefault();
                safeSet('supermenu_theme', theme.id);
                applySuperMenu(theme.id);
                toggleSuperMenu();
            });
            themesGrid.append(themeBtn);
        });

        // TMDB/JacRed Settings
        var tmdbSection = $('<div class="drxaos-section">\
            <button class="drxaos-btn" data-action="tmdb">Set TMDB API Key</button>\
        </div>');
        tmdbSection.find('[data-action="tmdb"]').on('click', () => openApiInput('tmdbapikey', 'TMDB API Key', 'Enter 32-char key'));
        content.append(title).append(themesGrid).append(tmdbSection);

        modal.append(overlay.append(content));
        $('body').append(modal);

        overlay.on('click touchstart', (e) => {
            if (e.type === 'touchstart') e.preventDefault();
            toggleSuperMenu();
        });

        document.on('keydown.supermenu', (e) => {
            if (e.key === 'Escape' || e.keyCode === 27) toggleSuperMenu();
        });

        // Focus first item
        setTimeout(() => themesGrid.find('.drxaos-theme-item').first().focus(), 100);
    }

    // Apply Super Menu Changes (debounce from drxaos_theme)
    function applySuperMenu(theme) {
        var applyImmediate = function(t) {
            // Apply theme styles (example CSS injection)
            var styleId = 'supermenu-style';
            $('#' + styleId).remove();
            var style = $(`<style id="${styleId}">\
                body { background: ${t === 'midnight' ? '#000' : '#200'}; }\
                .card { border: 1px solid #FFD700; } /* Example */\
            </style>`);
            $('head').append(style);

            // Re-enhance cards
            $('.card').removeClass('drxaos-enhanced').each(enhanceCard);
        };
        // Debounce
        clearTimeout(window.supermenuTimeout);
        window.supermenuTimeout = setTimeout(() => applyImmediate(theme || safeGet('supermenu_theme', 'midnight')), CONFIG.DEBOUNCEDELAY);
    }

    // API Input Modal (from drxaos_theme)
    function openApiInput(param, title, placeholder) {
        var modal = $(`<div class="drxaos-api-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;">\
            <div style="background: #1a1a1a; border:1px solid #333; border-radius:8px; padding:20px; min-width:300px;">\
                <h3 style="color:#fff; margin:0 0 15px;">${title}</h3>\
                <input type="text" id="api-input" placeholder="${placeholder}" style="width:100%; padding:10px; border:1px solid #444; border-radius:4px; background:#2a2a2a; color:#fff;">\
                <div style="display:flex; gap:10px; justify-content:flex-end;">\
                    <button id="save-api" style="background:#007bff; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">Save</button>\
                    <button id="cancel-api" style="background:#6c757d; color:white; border:none; padding:8px 16px; border-radius:4px; cursor:pointer;">Cancel</button>\
                </div>\
            </div>\
        </div>`);
        $('body').append(modal);

        var input = $('#api-input');
        setTimeout(() => input.focus().select(), 100);

        $('#save-api').on('click', () => {
            var value = input.val().trim();
            safeSet(param, value);
            if (param === 'tmdbapikey') applySuperMenu(); // Refresh cards
            modal.remove();
            if (window.Lampa?.Noty) Lampa.Noty.show(`${title} saved!`);
        });
        $('#cancel-api, .drxaos-api-modal').on('click', () => modal.remove());

        document.on('keydown.api', (e) => {
            if (e.key === 'Escape') modal.remove();
            if (e.key === 'Enter') $('#save-api').click();
        });
    }

    // Init on Ready
    function init() {
        if (!window.Lampa) {
            setTimeout(init, 200);
            return;
        }
        addSuperMenuButton();
        initCardObserver();
        applySuperMenu(); // Initial apply

        // Listener for updates (from drxaos_theme)
        if (Lampa.Listener) {
            Lampa.Listener.follow('app', () => {
                setTimeout(() => {
                    addSuperMenuButton();
                    $('.card').each(enhanceCard);
                }, 500);
            });
        }
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.SuperMenu = { toggle: toggleSuperMenu, apply: applySuperMenu };
})();
