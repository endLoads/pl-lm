// Улучшение карточек контента
Lampa.Listener.follow('card_render', (card) => {
    // Бейдж качества
    if (card.data.quality) {
        const quality = card.data.quality.toUpperCase();
        const qualityColor = getQualityColor(quality);
        
        card.find('.card__shape').append(`
            <div class="lum-badge" style="background: ${qualityColor}">
                ${quality}
            </div>
        `);
    }
    
    // Логотип вместо названия
    if (card.data.logo_path) {
        card.find('.card__head').html(`
            <img src="https://image.tmdb.org/t/p/w300${card.data.logo_path}" 
                 class="lum-logo"
                 alt="${card.data.title}"
                 onerror="this.parentElement.innerHTML = '<div class=\'lum-title-fallback\'>${card.data.title}</div>'">
        `);
    }
    
    // Быстрые действия
    card.find('.card__footer').prepend(`
        <div class="lum-quick-actions">
            <div class="lum-quick-action" style="background: #FFD700">⭐</div>
            <div class="lum-quick-action" style="background: #00C8C8">⏬</div>
            <div class="lum-quick-action" style="background: #3C8AFF">🔍</div>
        </div>
    `);
});

function getQualityColor(quality) {
    const colors = {
        '4K': '#FF3C5A',
        'UHD': '#FF3C5A',
        '1080P': '#3C8AFF',
        '720P': '#4CAF50',
        'HD': '#4CAF50'
    };
    return colors[quality] || '#00C8C8';
}
