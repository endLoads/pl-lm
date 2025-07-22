// Индикатор VPN-соединения
class VpnChecker {
    static async init() {
        this.status = await this.checkStatus();
        this.renderIndicator();
        
        // Обновление каждые 5 минут
        setInterval(async () => {
            this.status = await this.checkStatus();
            this.updateIndicator();
        }, 5 * 60 * 1000);
    }
    
    static async checkStatus() {
        try {
            // Проверка через несколько API
            const results = await Promise.race([
                this.checkIpApi(),
                this.checkVpnApi(),
                this.checkIpInfo()
            ]);
            
            return {
                isVpn: results.isVpn,
                country: results.country,
                provider: results.isp
            };
        } catch (e) {
            return { isVpn: false, country: 'Unknown', provider: 'Unknown' };
        }
    }
    
    static async checkIpApi() {
        const response = await fetch('http://ip-api.com/json/?fields=status,country,isp,proxy');
        const data = await response.json();
        return {
            isVpn: data.proxy,
            country: data.country,
            provider: data.isp
        };
    }
    
    static renderIndicator() {
        const container = document.querySelector('.head__right');
        if (!container) return;
        
        this.indicator = document.createElement('div');
        this.indicator.className = `lum-vpn-indicator ${this.status.isVpn ? 'vpn' : 'normal'}`;
        this.indicator.innerHTML = this.status.isVpn ? '🔒 VPN' : '🌐 Direct';
        container.prepend(this.indicator);
    }
    
    static updateIndicator() {
        if (!this.indicator) return;
        
        this.indicator.className = `lum-vpn-indicator ${this.status.isVpn ? 'vpn' : 'normal'}`;
        this.indicator.innerHTML = this.status.isVpn ? '🔒 VPN' : '🌐 Direct';
    }
}

// Инициализация
VpnChecker.init();
