// Управление уведомлениями
class NotificationSystem {
    static notifications = [];
    
    static init() {
        this.loadNotifications();
        this.setupListeners();
    }
    
    static loadNotifications() {
        this.notifications = JSON.parse(localStorage.getItem('lum_notifications') || [];
    }
    
    static setupListeners() {
        Lampa.Listener.follow('favorite_add', item => {
            this.addNotification({
                type: 'favorite',
                title: 'Добавлено в избранное',
                message: item.title,
                icon: '⭐'
            });
        });
    }
    
    static addNotification(notification) {
        notification.id = Date.now();
        notification.timestamp = Date.now();
        
        this.notifications.unshift(notification);
        if (this.notifications.length > 50) this.notifications.pop();
        
        localStorage.setItem('lum_notifications', JSON.stringify(this.notifications));
        
        // Показ всплывающего уведомления
        if (LUM.settings.showNotifications) {
            Lampa.Noty.show(notification.message, 3000);
        }
    }
    
    static renderUI() {
        return `
            <div class="lum-notifications-panel">
                <h2>Уведомления</h2>
                
                ${this.notifications.length === 0 
                    ? `<div class="lum-empty">Нет новых уведомлений</div>`
                    : `<div class="lum-notifications-list">
                        ${this.notifications.map(n => `
                            <div class="lum-notification">
                                <div class="lum-notification-icon">${n.icon}</div>
                                <div class="lum-notification-content">
                                    <div class="lum-notification-title">${n.title}</div>
                                    <div class="lum-notification-message">${n.message}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>`
                }
            </div>
        `;
    }
}

// Инициализация
NotificationSystem.init();
