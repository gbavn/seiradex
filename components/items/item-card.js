// ==================== SEIRA RPG DATABASE - ITEM CARD ====================

/**
 * Cria um card de Item
 * @param {Object} item - Dados do item
 * @returns {string} HTML do card
 */
function createItemCard(item) {
    // ID
    const itemId = `#${String(item.id).padStart(3, '0')}`;
    
    // Badges de categoria e subcategoria
    let categoryBadges = '';
    if (item.category) {
        categoryBadges += `<span class="item-category-badge">${SEIRA_FORMATTERS.capitalizeWords(item.category)}</span>`;
    }
    if (item.subcategory) {
        categoryBadges += `<span class="item-subcategory-badge">${item.subcategory}</span>`;
    }
    
    // Badges adicionais
    let extraBadges = '';
    
    // Raridade
    if (item.rarity) {
        const rarityClass = `badge-${item.rarity.toLowerCase()}`;
        extraBadges += `<span class="badge ${rarityClass}">${SEIRA_FORMATTERS.capitalizeWords(item.rarity)}</span>`;
    }
    
    // Craftável
    if (item.is_craftable) {
        extraBadges += `<span class="badge badge-craftable"><i class="fas fa-hammer"></i> Craftável</span>`;
    }
    
    // Coletável
    if (item.forageable) {
        extraBadges += `<span class="badge badge-forageable"><i class="fas fa-leaf"></i> Coletável</span>`;
    }
    
    // Livro
    if (item.book_category) {
        extraBadges += `<span class="badge badge-book"><i class="fas fa-book"></i> Livro</span>`;
    }
    
    return `
        <div class="base-card item-card" onclick="openItemModal(${item.id})">
            <div class="item-card-id">${itemId}</div>
            <div class="item-card-image">
                <img src="${item.sprite}" alt="${item.name}">
            </div>
            <h3 class="item-card-name">${SEIRA_FORMATTERS.capitalizeWords(item.name)}</h3>
            <div class="item-card-tags">
                ${categoryBadges}
            </div>
            <div class="item-card-badges">
                ${extraBadges}
            </div>
        </div>
    `;
}

console.log('✅ Item Card carregado');