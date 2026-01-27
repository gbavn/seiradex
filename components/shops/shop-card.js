// ==================== SEIRA RPG DATABASE - SHOP CARD ====================

/**
 * Cria um card de Item para Loja
 * @param {Object} item - Dados do item
 * @param {Object} shopConfig - Configuração da loja
 * @returns {string} HTML do card
 */
function createShopCard(item, shopConfig) {
    // ID
    const itemId = `#${String(item.id).padStart(3, '0')}`;
    
    // Preço
    const price = item.price[shopConfig.priceKey];
    const priceDisplay = `${price} ${shopConfig.currency}`;
    
    // Badges de categoria e subcategoria
    let categoryBadges = '';
    if (item.category) {
        categoryBadges += `<span class="item-category-badge">${SEIRA_FORMATTERS.capitalizeWords(item.category)}</span>`;
    }
    if (item.subcategory) {
        categoryBadges += `<span class="item-subcategory-badge">${item.subcategory}</span>`;
    }
    
    // Badge de raridade
    let rarityBadge = '';
    if (item.rarity) {
        const rarityClass = `rarity-${item.rarity.toLowerCase()}`;
        rarityBadge = `<span class="item-rarity-badge ${rarityClass}">${SEIRA_FORMATTERS.capitalizeWords(item.rarity)}</span>`;
    }
    
    return `
        <div class="base-card shop-card" onclick="openItemModal(${item.id})">
            <div class="item-card-id">${itemId}</div>
            <div class="item-card-image">
                <img src="${item.sprite}" alt="${item.name}">
            </div>
            <h3 class="item-card-name">${SEIRA_FORMATTERS.capitalizeWords(item.name)}</h3>
            <div class="item-card-tags">
                ${categoryBadges}
            </div>
            <div class="item-card-badges">
                ${rarityBadge}
            </div>
            <div class="shop-card-price">
                <i class="fas fa-coins"></i> ${priceDisplay}
            </div>
        </div>
    `;
}

console.log('✅ Shop Card carregado');
