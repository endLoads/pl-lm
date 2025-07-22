/**
 * Lampa Ultimate Modular Plugin
 * Версия: 1.0
 * Подключается как обычный плагин Lampa и активирует кастомные интерфейсные улучшения.
 */

(function(){
  let plugin_settings = {
    colored_ratings: true,
    stylize_titles: true,
    enhance_detailed_info: true
  };

  function startPlugin(){
    Lampa.Listener.follow('settings', function(event){
      if(event.type === 'open' && event.name === 'plugins'){
        renderCustomInterface(plugin_settings);
      }
    });

    // Рендер карточек с типом и рейтингами
    renderCards(plugin_settings);
    // Новая панель информации
    newInfoPanel();
    // Цветные рейтинги
    if(plugin_settings.colored_ratings) colorRatings();
    // Стилизация названий
    if(plugin_settings.stylize_titles) stylizeCollectionTitles();
    // Расширенная информация
    if(plugin_settings.enhance_detailed_info) enhanceDetailedInfo();
  }

  /** Добавляет визуальные маркеры в карточки фильмов */
  function renderCards(opts){
    let observer = new MutationObserver(mutations => {
      document.querySelectorAll('.card').forEach(card => {
        let info = card.querySelector('.card__view');
        if (!info || card.dataset._enhanced) return;
        let type = card.getAttribute('data-type') || 'unknown';
        let quality = card.querySelector('.card__quality')?.textContent || 'SD';

        let badge = document.createElement('div');
        badge.className = 'card-enhancer-badge';
        badge.innerText = `${type.toUpperCase()} | ${quality}`;
        badge.style.cssText = 'position:absolute;bottom:0;right:0;font-size:10px;padding:2px 4px;background:#222;color:#fff;border-radius:3px;margin:3px;';

        card.appendChild(badge);
        card.dataset._enhanced = true;
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /** Создаёт новую панель с информацией */
  function newInfoPanel(){
    let style = document.createElement('style');
    style.innerHTML = `
      .info-panel-custom {
        padding: 10px;
        background: #1c1c1c;
        color: #eee;
        font-size: 13px;
        border-top: 1px solid #333;
        margin-top: 15px;
      }
    `;
    document.head.appendChild(style);
  }

  /** Перекрашивает рейтинги в карточках */
  function colorRatings(){
    const recolor = () => {
      document.querySelectorAll('.card__rating').forEach(r => {
        let value = parseFloat(r.textContent);
        if (isNaN(value)) return;
        r.style.color = value >= 7 ? 'limegreen' : value >= 5 ? 'orange' : 'crimson';
      });
    };
    const ratingObserver = new MutationObserver(() => recolor());
    ratingObserver.observe(document.body, { childList: true, subtree: true });
    recolor();
  }

  /** Стилизация заголовков коллекций */
  function stylizeCollectionTitles(){
    const apply = () => {
      document.querySelectorAll('.section__title').forEach(el => {
        el.style.textTransform = 'uppercase';
        el.style.letterSpacing = '1.5px';
        el.style.color = '#ff9800';
      });
    };
    const titleObserver = new MutationObserver(() => apply());
    titleObserver.observe(document.body, { childList: true, subtree: true });
    apply();
  }

  /** Добавляет доп. информацию в детальную страницу фильма */
  function enhanceDetailedInfo(){
    const enhance = () => {
      const info = document.querySelector('.full-start__info');
      if(info && !document.querySelector('.info-panel-custom')){
        let panel = document.createElement('div');
        panel.className = 'info-panel-custom';
        panel.innerText = 'Дополнительные данные о фильме, включая источники и лицензии, появятся здесь.';
        info.appendChild(panel);
      }
    };
    const detailObserver = new MutationObserver(() => enhance());
    detailObserver.observe(document.body, { childList: true, subtree: true });
    enhance();
  }

  startPlugin();
})();
