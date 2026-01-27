// ==================== SEIRA RPG DATABASE - SHOP CONFIG ====================

/**
 * Configuração das Lojas
 * VOCÊ EDITA ESTE ARQUIVO para adicionar/remover itens das lojas!
 */

const SHOP_CONFIGS = {
    pokemart: {
        name: 'Pokemart',
        description: 'Loja oficial da Liga Pokémon',
        icon: 'fa-store',
        currency: '₽',
        priceKey: 'buy', // item.price.buy
        categories: {
            'Pokébolas': [2, 3, 4],
            'Poções': [17, 18, 19, 20, 21, 22],
            'Outros': [25, 26, 28, 79, 524]
        }
    },
    
    casino: {
        name: 'Casino',
        description: 'Troque suas fichas por prêmios exclusivos',
        icon: 'fa-dice',
        currency: '🪙',
        priceKey: 'casino', // item.price.casino
        categories: {
            'Prêmios': [] // Adicione IDs aqui
        }
    },
    
    mile_shop: {
        name: 'Loja de Milhas',
        description: 'Itens exclusivos para membros',
        icon: 'fa-ticket',
        currency: '🎫',
        priceKey: 'mile', // item.price.mile
        categories: {
            'Vouchers': [384, 588, 687, 774, 775, 776, 777, 778, 779, 780, 781]
        }
    },
    
    book_shop: {
        name: 'Livraria',
        description: 'Livros de receitas e conhecimento',
        icon: 'fa-book',
        currency: '₽',
        priceKey: 'buy', // item.price.buy
        categories: {
            'Livros': [760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 757, 770, 771]
        }
    },
    
    tm_shop: {
        name: 'Loja de Discos',
        description: 'TMs e TRs para treinar seus Pokémon',
        icon: 'fa-compact-disc',
        currency: '₽',
        priceKey: 'buy', // item.price.buy
        categories: {
            'TMs': [] // Adicione IDs de TMs aqui
        }
    }
};

/**
 * Retorna configuração de uma loja
 */
function getShopConfig(shopId) {
    return SHOP_CONFIGS[shopId] || null;
}

/**
 * Retorna todas as lojas disponíveis
 */
function getAllShops() {
    return Object.keys(SHOP_CONFIGS).map(id => ({
        id: id,
        ...SHOP_CONFIGS[id]
    }));
}

/**
 * Retorna todos os IDs de itens de uma loja
 */
function getShopItemIds(shopId) {
    const config = SHOP_CONFIGS[shopId];
    if (!config) return [];
    
    const allIds = [];
    for (let category in config.categories) {
        allIds.push(...config.categories[category]);
    }
    return allIds;
}

console.log('✅ Shop Config carregado');
