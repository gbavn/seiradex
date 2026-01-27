// ==================== HELPERS ====================

const SEIRA_HELPERS = {
    /**
     * Retorna o número da Dex
     */
    getDexNumber(pokemon) {
        if (pokemon.id >= 10000 && pokemon.form_of) {
            return pokemon.form_of;
        }
        return pokemon.id;
    },
    
    /**
     * Retorna ícone GMI do stat
     */
    getStatIcon(statName) {
        const icons = {
            'hp': 'gmi-glass-heart',
            'attack': 'gmi-fist',
            'defense': 'gmi-bordered-shield',
            'special_attack': 'gmi-hypersonic-bolt',
            'special_defense': 'gmi-bolt-shield',
            'speed': 'gmi-steelwing-emblem'
        };
        return icons[statName] || 'gmi-star';
    },
    
    /**
     * Retorna nome traduzido do stat
     */
    getStatName(statName) {
        const names = {
            'hp': 'HP',
            'attack': 'ATQ',
            'defense': 'DEF',
            'special_attack': 'ATQ ESP.',
            'special_defense': 'DEF ESP.',
            'speed': 'VEL'
        };
        return names[statName] || statName.toUpperCase();
    },
    
    /**
     * Copia link para clipboard
     */
    copyLink(type, id) {
        const url = `${window.location.origin}${window.location.pathname}#${type}-${id}`;
        
        navigator.clipboard.writeText(url).then(() => {
            // Feedback visual
            const btn = event.target.closest('button');
            if (btn) {
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                btn.style.background = '#27ae60';
                
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                }, 2000);
            }
        }).catch(() => {
            alert('Link: ' + url);
        });
    }
};

console.log('✅ Helpers carregado');