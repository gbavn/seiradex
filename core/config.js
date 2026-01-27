// ==================== CONFIGURAÇÃO GLOBAL ====================

const SEIRA_CONFIG = {
    // URLs das APIs
    API_URLS: {
        pokemon: 'https://raw.githubusercontent.com/gbavn/seira-database/main/database/pokemon.json',
        moves: 'https://raw.githubusercontent.com/gbavn/seira-database/main/database/moves.json',
        abilities: 'https://raw.githubusercontent.com/gbavn/seira-database/main/database/abilities.json',
        items: 'https://raw.githubusercontent.com/gbavn/seira-database/main/database/items.json',
        maps: 'https://raw.githubusercontent.com/gbavn/seira-database/main/database/maps.json',
        objects: 'https://raw.githubusercontent.com/gbavn/seira-database/main/database/objects.json',
        quests: 'https://raw.githubusercontent.com/gbavn/seira-database/main/database/quests.json',
        perks: 'https://raw.githubusercontent.com/gbavn/seira-database/main/database/perks.json'
    },
    
    // Paginação
    PAGINATION: {
        perPage: 15
    },
    
    // Tipos de Pokémon
    POKEMON_TYPES: [
        'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 
        'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 
        'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'
    ],
    
    // Mapas ocultos
    HIDDEN_MAPS: [
        // IDs de mapas que não devem aparecer
    ],
    
    // Configuração de shops
    SHOP_ITEMS: {
        casino: [],    // IDs dos itens no Casino
        mile: [],      // IDs dos itens no Mile Shop
        book: [],      // IDs dos itens no Book Shop
        tm: [],        // IDs dos itens no TM Shop
        pokemart: []   // IDs dos itens no Pokémart
    }
};

console.log('✅ Config carregado');