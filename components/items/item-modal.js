// ==================== SEIRA RPG DATABASE - ITEM MODAL (FINAL) ====================

/**
 * Abre modal completo de Item
 */
async function openItemModal(itemId) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    const allItems = await SEIRA_API.load('items');
    const item = allItems.find(i => i.id === itemId);
    
    if (!item) {
        console.error('Item não encontrado:', itemId);
        return;
    }
    
    // ==================== TÍTULO ====================
    modalTitle.innerHTML = `
        <img src="${item.sprite}" alt="${item.name}" class="modal-title-icon">
        ${SEIRA_FORMATTERS.capitalizeWords(item.name)}
    `;
    
    SEIRA_MODAL.addShareButton('item', itemId);
    
    // ==================== CONTEÚDO ====================
    
    let content = '';
    
    // ==================== SEÇÃO 1: INFORMAÇÕES ====================
    content += `
        <div class="modal-section">
            <h3 class="modal-section-title">
                <i class="fas fa-info-circle"></i> Informações
            </h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">ID</span>
                    <span class="info-value">#${String(item.id).padStart(3, '0')}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Categoria</span>
                    <span class="info-value">${SEIRA_FORMATTERS.capitalizeWords(item.category)}</span>
                </div>
    `;
    
    if (item.subcategory) {
        content += `
                <div class="info-item">
                    <span class="info-label">Subcategoria</span>
                    <span class="info-value">${item.subcategory}</span>
                </div>
        `;
    }
    
    if (item.rarity) {
        const rarityClass = `badge-${item.rarity.toLowerCase()}`;
        content += `
                <div class="info-item">
                    <span class="info-label">Raridade</span>
                    <span class="info-value">
                        <span class="badge ${rarityClass}">${SEIRA_FORMATTERS.capitalizeWords(item.rarity)}</span>
                    </span>
                </div>
        `;
    }
    
    content += `
                <div class="info-item">
                    <span class="info-label">Único</span>
                    <span class="info-value">${item.is_unique ? 'Sim' : 'Não'}</span>
                </div>
    `;
    
    // Segunda linha de info (taxa de captura, preço)
    if (item.catch_rate !== undefined || (item.price?.sell > 0)) {
        if (item.catch_rate !== undefined) {
            content += `
                <div class="info-item">
                    <span class="info-label">Taxa de Captura</span>
                    <span class="info-value">${item.catch_rate}x</span>
                </div>
            `;
        }
        
        if (item.price?.sell > 0) {
            content += `
                <div class="info-item">
                    <span class="info-label">Preço de Venda</span>
                    <span class="info-value">${item.price.sell} ₽</span>
                </div>
            `;
        }
    }
    
    content += `
            </div>
        </div>
    `;
    
    // ==================== SEÇÃO 2: DESCRIÇÃO ====================
    if (item.description) {
        content += `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-align-left"></i> Descrição
                </h3>
                <p class="effect-text">${item.description}</p>
            </div>
        `;
    }
    
    // ==================== SEÇÃO TM/USAGE (chamada externa) ====================
    content += await createItemUsageSections(item);
    
    // ==================== SEÇÃO 3: CRAFT ====================
    if (item.is_craftable && item.craft_recipe && item.craft_recipe.length > 0) {
        content += `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-hammer"></i> Receita de Craft
                </h3>
                <div class="craft-grid">
        `;
        
        for (const ingredient of item.craft_recipe) {
            const ingredientItem = allItems.find(i => i.id === ingredient.item_id);
            if (ingredientItem) {
                content += `
                    <div class="craft-ingredient" onclick="openItemModal(${ingredientItem.id})">
                        <img src="${ingredientItem.sprite}" alt="${ingredientItem.name}" class="craft-ingredient-img">
                        <div class="craft-ingredient-info">
                            <span class="craft-ingredient-name">${SEIRA_FORMATTERS.capitalizeWords(ingredientItem.name)}</span>
                            <span class="craft-ingredient-qty">x${ingredient.quantity}</span>
                        </div>
                    </div>
                `;
            }
        }
        
        content += `
                </div>
            </div>
        `;
    }
    
    // ==================== SEÇÃO 4: COLETA (COM FUNDO) ====================
    if (item.forageable && item.posts_to_collect > 0) {
        content += `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-leaf"></i> Informações de Coleta
                </h3>
                <p class="forage-info">Este item pode ser coletado após <strong>${item.posts_to_collect} posts</strong>.</p>
            </div>
        `;
    }
    
    // ==================== SEÇÃO 5: LIVROS (LAYOUT MELHORADO) ====================
    if (item.book_category && item.unlocks_recipes && item.unlocks_recipes.length > 0) {
        content += `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-book-open"></i> Receitas Desbloqueadas
                </h3>
                <div class="book-recipes-grid">
        `;
        
        for (const recipeId of item.unlocks_recipes) {
            const recipeItem = allItems.find(i => i.id === recipeId);
            if (recipeItem) {
                content += `
                    <div class="book-recipe-card" onclick="openItemModal(${recipeItem.id})">
                        <div class="book-recipe-image-section">
                            <img src="${recipeItem.sprite}" alt="${recipeItem.name}" class="book-recipe-img">
                        </div>
                        <div class="book-recipe-content">
                            <div class="book-recipe-header">
                                <h4 class="book-recipe-name">${SEIRA_FORMATTERS.capitalizeWords(recipeItem.name)}</h4>
                `;
                
                if (recipeItem.category) {
                    content += `<span class="book-recipe-category">${SEIRA_FORMATTERS.capitalizeWords(recipeItem.category)}</span>`;
                }
                
                content += `
                            </div>
                `;
                
                // Ingredientes com imagens
                if (recipeItem.craft_recipe && recipeItem.craft_recipe.length > 0) {
                    content += `
                            <div class="book-recipe-ingredients">
                                <div class="book-recipe-ingredients-title">Ingredientes:</div>
                    `;
                    
                    for (const ing of recipeItem.craft_recipe) {
                        const ingItem = allItems.find(i => i.id === ing.item_id);
                        if (ingItem) {
                            content += `
                                <div class="book-ingredient-item">
                                    <img src="${ingItem.sprite}" alt="${ingItem.name}" class="book-ingredient-img">
                                    <span class="book-ingredient-text">${SEIRA_FORMATTERS.capitalizeWords(ingItem.name)} x${ing.quantity}</span>
                                </div>
                            `;
                        }
                    }
                    
                    content += `
                            </div>
                    `;
                }
                
                content += `
                        </div>
                    </div>
                `;
            }
        }
        
        content += `
                </div>
            </div>
        `;
    }
    
    modalBody.innerHTML = content;
    
    // NÃO PRECISA chamar SEIRA_SPOILER.setup() - os spoilers já têm onclick inline
    
    modal.classList.add('active');
}

/**
 * Busca item por nome e abre modal
 */
async function openItemModalByName(itemName) {
    const items = await SEIRA_API.load('items');
    const item = items.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    
    if (item) {
        openItemModal(item.id);
    } else {
        alert(`Item "${itemName}" não encontrado.`);
    }
}

console.log('✅ Item Modal carregado');