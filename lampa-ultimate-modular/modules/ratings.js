// Система рейтингов IMDb и Кинопоиск
Lampa.Listener.follow('card_render', (card) => {
    if (!card.data.ratings) return;
    
    const ratingsHtml = `
        <div class="lum-ratings">
            ${card.data.ratings.imdb ? `<div class="lum-rating imdb">IMDb: ${card.data.ratings.imdb}</div>` : ''}
            ${card.data.ratings.kinopoisk ? `<div class="lum-rating kp">КП: ${card.data.ratings.kinopoisk}</div>` : ''}
        </div>
    `;
    
    card.find('.card__body').append(ratingsHtml);
});

// Получение рейтингов
Lampa.Listener.follow('content_ready', async (e) => {
    const content = e.data;
    if (!content.id) return;
    
    // Проверка кэша
    const cacheKey = `ratings_${content.id}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        content.ratings = JSON.parse(cached);
        return;
    }
    
    // Параллельные запросы к API
    try {
        const [imdb, kp] = await Promise.all([
            fetchIMDbRating(content),
            fetchKinopoiskRating(content)
        ]);
        
        content.ratings = { imdb, kp };
        localStorage.setItem(cacheKey, JSON.stringify(content.ratings));
    } catch (e) {
        console.error('Ошибка получения рейтингов:', e);
    }
});

async function fetchIMDbRating(content) {
    if (!content.imdb_id) return null;
    try {
        const response = await fetch(`https://api.imdb.com/title/${content.imdb_id}`, {
            headers: { 'Authorization': `Bearer ${LUM.settings.imdbApiKey}` }
        });
        const data = await response.json();
        return data.rating || null;
    } catch (e) {
        return null;
    }
}

async function fetchKinopoiskRating(content) {
    if (!content.kinopoisk_id) return null;
    try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${content.kinopoisk_id}`, {
            headers: { 'X-API-KEY': LUM.settings.kinopoiskApiKey }
        });
        const data = await response.json();
        return data.ratingKinopoisk || null;
    } catch (e) {
        return null;
    }
}
