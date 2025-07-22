// Статистика просмотров
class AnalyticsModule {
    static init() {
        Lampa.Listener.follow('player_play', this.trackPlayback.bind(this));
        this.setupUI();
    }
    
    static trackPlayback(item) {
        const history = JSON.parse(localStorage.getItem('lum_playback_history') || []);
        
        history.push({
            id: item.id,
            title: item.title,
            type: item.type,
            genre: item.genre_ids?.[0] || '',
            duration: item.time || 0,
            timestamp: Date.now()
        });
        
        localStorage.setItem('lum_playback_history', JSON.stringify(history));
    }
    
    static setupUI() {
        Lampa.SettingsMenu.add({
            id: 'lum_analytics',
            name: 'Аналитика',
            icon: '📊',
            component: {
                template: `<div class="lum-analytics-panel">${this.renderAnalytics()}</div>`
            }
        });
    }
    
    static renderAnalytics() {
        const history = JSON.parse(localStorage.getItem('lum_playback_history') || []);
        const stats = this.calculateStats(history);
        
        return `
            <h2>Статистика просмотров</h2>
            <div class="lum-stats-grid">
                <div class="lum-stat-card">
                    <div class="lum-stat-value">${history.length}</div>
                    <div class="lum-stat-label">Всего просмотров</div>
                </div>
                
                <div class="lum-stat-card">
                    <div class="lum-stat-value">${stats.totalHours}ч</div>
                    <div class="lum-stat-label">Общее время</div>
                </div>
            </div>
            
            <div class="lum-chart-section">
                <h3>Распределение по жанрам</h3>
                <div class="lum-chart-bars">
                    ${stats.genres.map(genre => `
                        <div class="lum-bar-container">
                            <div class="lum-bar-label">${Lampa.Genres.getTitle(genre.id)}</div>
                            <div class="lum-bar" style="width: ${genre.percent}%">
                                <div class="lum-bar-value">${genre.count}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    static calculateStats(history) {
        const stats = {
            totalHours: Math.round(history.reduce((sum, item) => sum + (item.duration || 0), 0) / 60),
            genres: {}
        };
        
        history.forEach(item => {
            if (item.genre) {
                stats.genres[item.genre] = (stats.genres[item.genre] || 0) + 1;
            }
        });
        
        // Преобразование в массив
        stats.genres = Object.entries(stats.genres)
            .map(([id, count]) => ({ id, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        
        // Добавление процентов
        const total = history.length;
        stats.genres.forEach(genre => {
            genre.percent = (genre.count / total) * 100;
        });
        
        return stats;
    }
}

// Инициализация
AnalyticsModule.init();
