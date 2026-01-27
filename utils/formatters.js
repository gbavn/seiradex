// ==================== FORMATADORES ====================

const SEIRA_FORMATTERS = {
    /**
     * Capitaliza a primeira letra de cada palavra
     */
    capitalizeWords(string) {
        if (!string) return '';
        return string.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    },
    
    /**
     * Traduz categoria de item
     */
    translateItemCategory(category) {
        const translations = {
            'medicine': 'Consumíveis',
            'key-item': 'Itens Chave',
            'pokeball': 'Pokébolas',
            'other': 'Outros',
            'berry': 'Berries',
            'held-item': 'Held Items',
            'tm': 'TMs',
            'craft-material': 'Materiais de Craft',
            'evolution-item': 'Item de Evolução'
        };
        return translations[category] || category;
    },
    
    /**
     * Traduz tipo de mapa
     */
    translateMapType(type) {
        const translations = {
            'city': 'Cidade',
            'route': 'Rota',
            'landmark': 'Landmark'
        };
        return translations[type] || type;
    },
    
    /**
     * Traduz tipo de objeto
     */
    translateObjectType(type) {
        const translations = {
            'berry_tree': 'Árvore de Berries',
            'apricorn_tree': 'Árvore de Apricorn',
            'fishing_spot': 'Ponto de Pesca',
            'evolution_stone': 'Pedra de Evolução',
            'evolution_location': 'Local de Evolução',
            'social_spot': 'Local Social'
        };
        return translations[type] || type;
    }
};

console.log('✅ Formatters carregado');