// Управление профилями настроек
class ProfileManager {
    static profiles = {
        tv: { name: "TV Mode", cardSize: 130, theme: "dark_teal" },
        mobile: { name: "Mobile", cardSize: 100, theme: "alex_dark" }
    };
    
    static init() {
        this.loadCurrentProfile();
    }
    
    static loadCurrentProfile() {
        const profileName = localStorage.getItem('lum_current_profile') || 'tv';
        const profile = localStorage.getItem(`lum_profile_${profileName}`) 
            ? JSON.parse(localStorage.getItem(`lum_profile_${profileName}`))
            : this.profiles[profileName];
        
        if (profile) {
            LUM.settings = { ...LUM.settings, ...profile };
            LUM.applyTheme(profile.theme);
            document.documentElement.style.setProperty('--card-scale', profile.cardSize / 100);
        }
    }
    
    static saveProfile(name, settings) {
        const profile = {
            name,
            ...settings,
            timestamp: Date.now()
        };
        
        localStorage.setItem(`lum_profile_${name}`, JSON.stringify(profile));
        localStorage.setItem('lum_current_profile', name);
    }
    
    static renderUI() {
        return `
            <div class="lum-profile-manager">
                <div class="lum-title">Управление профилями</div>
                
                <div class="lum-profiles-list">
                    ${Object.entries(this.profiles).map(([id, profile]) => `
                        <div class="lum-profile-item" data-profile="${id}">
                            <div class="lum-profile-icon">📱</div>
                            <div class="lum-profile-name">${profile.name}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="lum-profile-actions">
                    <div class="lum-button" data-action="save">Сохранить текущий</div>
                </div>
            </div>
        `;
    }
}

// Инициализация
ProfileManager.init();
