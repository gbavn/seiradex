// ==================== API E CARREGAMENTO DE DADOS ====================

const SEIRA_API = {
    // Modo admin (mostra itens ocultos E desbloqueados)
    adminMode: localStorage.getItem('SEIRA_ADMIN_MODE') === 'true',
    
    /**
     * Carrega dados de uma API específica
     * MODO NORMAL: Remove hidden + locked
     * MODO ADMIN: Mostra tudo
     */
    async load(key) {
        // Retorna do cache se já foi carregado
        if (SEIRA_STATE.cache[key] && SEIRA_STATE.cache[key].length > 0) {
            // ✨ Em modo admin, retorna SEM filtrar
            if (this.adminMode) {
                return SEIRA_STATE.cache[key];
            }
            
            // ✨ Em modo normal, remove hidden + locked
            return window.SEIRA_HIDDEN.filter(key, SEIRA_STATE.cache[key]);
        }
        
        // Se já está carregando, aguarda
        if (SEIRA_STATE.loading[key]) {
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (!SEIRA_STATE.loading[key]) {
                        clearInterval(interval);
                        const cached = SEIRA_STATE.cache[key];
                        
                        // ✨ Em modo admin, retorna SEM filtrar
                        if (this.adminMode) {
                            resolve(cached);
                        } else {
                            // ✨ Em modo normal, remove hidden + locked
                            resolve(window.SEIRA_HIDDEN.filter(key, cached));
                        }
                    }
                }, 100);
            });
        }
        
        try {
            SEIRA_STATE.loading[key] = true;
            console.log(`🔥 Carregando ${key}...`);
            
            const response = await fetch(SEIRA_CONFIG.API_URLS[key]);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // ✨ Salva dados RAW no cache (sem filtrar)
            SEIRA_STATE.cache[key] = data;
            SEIRA_STATE.loading[key] = false;
            
            console.log(`✅ ${key} carregado: ${data.length} itens`);
            
            // ✨ Em modo admin, retorna SEM filtrar
            if (this.adminMode) {
                return data;
            }
            
            // ✨ Em modo normal, remove hidden + locked
            return window.SEIRA_HIDDEN.filter(key, data);
            
        } catch (error) {
            console.error(`❌ Erro ao carregar ${key}:`, error);
            SEIRA_STATE.loading[key] = false;
            return [];
        }
    },
    
    /**
     * Carrega dados RAW (sem filtrar) - APENAS para mapa interativo
     * Retorna tudo, inclusive locked (para mostrar cinza)
     */
    async loadForMap(key) {
        // Espera o cache carregar se necessário
        if (!SEIRA_STATE.cache[key] || SEIRA_STATE.cache[key].length === 0) {
            await this.load(key);
        }
        
        const rawData = SEIRA_STATE.cache[key];
        
        // ✨ MODO ADMIN: Retorna tudo sem filtrar
        if (this.adminMode) {
            return rawData;
        }
        
        // ✨ MODO NORMAL: Remove APENAS hidden (mantém locked para mostrar cinza)
        return window.SEIRA_HIDDEN.filterOnlyHidden(key, rawData);
    },
    
    /**
     * Toggle modo admin (mostra/oculta itens escondidos E desbloqueados)
     */
    toggleAdminMode() {
        this.adminMode = !this.adminMode;
        
        // ✨ SALVA NO LOCALSTORAGE
        localStorage.setItem('SEIRA_ADMIN_MODE', this.adminMode);
        
        if (this.adminMode) {
            console.log('🔓 MODO ADMIN ATIVADO - Mostrando itens ocultos e desbloqueando locked');
        } else {
            console.log('🔒 MODO ADMIN DESATIVADO - Ocultando itens e bloqueando locked');
        }
        
        // 🔄 Recarrega a página para aplicar mudanças
        window.location.reload();
    },
    
    /**
     * Mostra notificação visual de modo admin
     */
    showAdminNotification() {
        const notification = document.createElement('div');
        notification.id = 'admin-mode-badge';
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                font-weight: bold;
                z-index: 9999;
                animation: slideIn 0.3s ease;
            ">
                🔓 MODO ADMIN ATIVO
                <div style="font-size: 11px; opacity: 0.9; margin-top: 4px;">
                    Mostrando itens ocultos • Ctrl+Shift+H para desativar
                </div>
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(400px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(notification);
    },
    
    /**
     * Remove notificação visual
     */
    hideAdminNotification() {
        const badge = document.getElementById('admin-mode-badge');
        if (badge) badge.remove();
    },
    
    /**
     * Pré-carrega todos os dados
     */
    async preloadAll() {
        console.log('🚀 Pré-carregando todos os dados...');
        
        await Promise.all([
            this.load('pokemon'),
            this.load('moves'),
            this.load('abilities'),
            this.load('items'),
            this.load('maps'),
            this.load('objects'),
            this.load('quests')
        ]);
        
        console.log('✅ Todos os dados carregados!');
    }
};

// ==================== ATALHO DE TECLADO ====================
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', (e) => {
        // Ctrl + Shift + H
        if (e.ctrlKey && e.shiftKey && e.key === 'H') {
            e.preventDefault();
            SEIRA_API.toggleAdminMode();
        }
    });
    
    // ✨ Se está em modo admin, mostra badge
    if (SEIRA_API.adminMode) {
        SEIRA_API.showAdminNotification();
    }
});

console.log('✅ API carregado');