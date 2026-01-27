// ==================== ESTADO GLOBAL ====================

const SEIRA_STATE = {
    // Cache de dados
    cache: {
        pokemon: [],
        moves: [],
        abilities: [],
        items: [],
        maps: [],
        objects: [],
        quests: []
    },
    
    // Estado de carregamento
    loading: {
        pokemon: false,
        moves: false,
        abilities: false,
        items: false,
        maps: false,
        objects: false,
        quests: false
    }
};

console.log('✅ State carregado');