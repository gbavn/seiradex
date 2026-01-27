// ==================== POI MODAL (POINT OF INTEREST) ====================
// Modal para Pontos de Interesse dos mapas

window.SEIRA_POI_MODAL = {
    async render(poi, mapId) {
        const items = await SEIRA_API.load('items');
        const pokemon = await SEIRA_API.load('pokemon');
        
        const section1 = this.renderBasicInfo(poi);
        const section2 = this.renderShopData(poi, items);
        const section3 = this.renderLinkedContent(poi, items, pokemon);
        const section4 = this.renderCustomEffect(poi);
        
        return `
            <div class="poi-modal-content">
                ${section1}
                ${section2}
                ${section3}
                ${section4}
            </div>
        `;
    },
    
    // ==================== SEÇÃO 1: INFORMAÇÕES BÁSICAS ====================
    renderBasicInfo(poi) {
        const typeLabel = this.getTypeLabel(poi.type);
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-info-circle"></i> Informações
                </h3>
                
                <div class="poi-info-layout">
                    <!-- Imagem do POI -->
                    <div class="poi-main-image">
                        ${poi.poi_image ? 
                            `<img src="${poi.poi_image}" alt="${poi.name}" />` : 
                            `<div class="poi-image-placeholder">
                                <i class="fas fa-map-pin"></i>
                                <span>Sem imagem disponível</span>
                            </div>`
                        }
                    </div>
                    
                    <!-- Informações -->
                    <div class="poi-info-details">
                        <!-- Grid 2 colunas: ID e Tipo -->
                        <div class="poi-info-grid-2cols">
                            <div class="info-item">
                                <span class="info-label">ID</span>
                                <span class="info-value">${poi.id}</span>
                            </div>
                            
                            <div class="info-item">
                                <span class="info-label">Tipo</span>
                                <span class="info-value">${typeLabel}</span>
                            </div>
                        </div>
                        
                       <!-- Descrição com altura fixa e scroll -->
                        ${poi.description ? `
                            <div class="info-item info-item-description">
                                <span class="info-label">Descrição</span>
                                <div class="poi-description-content">${poi.description.trim()}</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </section>
        `;
    },
    
    getTypeLabel(type) {
        const labels = {
            'gym': '<span class="badge badge-gym"><i class="fas fa-dumbbell"></i> Ginásio</span>',
            'shop': '<span class="badge badge-shop"><i class="fas fa-store"></i> Loja</span>',
            'restaurant': '<span class="badge badge-restaurant"><i class="fas fa-utensils"></i> Restaurante</span>',
            'facility': '<span class="badge badge-facility"><i class="fas fa-building"></i> Instalação</span>',
            'service': '<span class="badge badge-service"><i class="fas fa-concierge-bell"></i> Serviço</span>',
            'other': '<span class="badge badge-secondary"><i class="fas fa-map-pin"></i> Outro</span>'
        };
        return labels[type] || type;
    },
    
    // ==================== SEÇÃO 2: SHOP DATA ====================
renderShopData(poi, allItems) {
    const shopData = poi.shop_data;
    if (!shopData) return '';
    
    const sells = shopData.sells || [];
    const buys = shopData.buys || [];
    
    if (sells.length === 0 && buys.length === 0) return '';
    
    let html = '<section class="modal-section"><h3 class="modal-section-title"><i class="fas fa-shopping-cart"></i> Comércio</h3>';
    
    // Sells (Loja VENDE para o jogador)
    if (sells.length > 0) {
        const sellCards = sells.map(itemId => {
            const item = allItems.find(i => i.id === itemId);
            if (!item) return '';
            
            const buyPrice = item.price?.buy || 0;
            const priceLabel = buyPrice > 0 ? `₽ ${buyPrice.toLocaleString()}` : 'Não Disponível';
            
            return `
                <div class="shop-item-card" onclick="openItemModal(${item.id})">
                    <img src="${item.sprite}" alt="${item.name}" class="shop-item-img" />
                    <span class="shop-item-name">${SEIRA_FORMATTERS.capitalizeWords(item.name)}</span>
                    <span class="shop-item-price">${priceLabel}</span>
                    <span class="shop-item-badge badge-sell">Vende</span>
                </div>
            `;
        }).join('');
        
        html += `
            <div class="shop-section">
                <h4 class="modal-section-subtitle">
                    <i class="fas fa-tag"></i> Itens à Venda (${sells.length})
                </h4>
                <div class="shop-items-grid">
                    ${sellCards}
                </div>
            </div>
        `;
    }
    
    // Buys (Loja COMPRA do jogador)
    if (buys.length > 0) {
        const buyCards = buys.map(itemId => {
            const item = allItems.find(i => i.id === itemId);
            if (!item) return '';
            
            const sellPrice = item.price?.sell || 0;
            const priceLabel = sellPrice > 0 ? `₽ ${sellPrice.toLocaleString()}` : 'Não Disponível';
            
            return `
                <div class="shop-item-card" onclick="openItemModal(${item.id})">
                    <img src="${item.sprite}" alt="${item.name}" class="shop-item-img" />
                    <span class="shop-item-name">${SEIRA_FORMATTERS.capitalizeWords(item.name)}</span>
                    <span class="shop-item-price">${priceLabel}</span>
                    <span class="shop-item-badge badge-buy">Compra</span>
                </div>
            `;
        }).join('');
        
        html += `
            <div class="shop-section">
                <h4 class="modal-section-subtitle">
                    <i class="fas fa-coins"></i> Itens que Compra (${buys.length})
                </h4>
                <div class="shop-items-grid">
                    ${buyCards}
                </div>
            </div>
        `;
    }
    
    html += '</section>';
    return html;
},
    
    // ==================== SEÇÃO 3: LINKED CONTENT ====================
    renderLinkedContent(poi, allItems, allPokemon) {
        const linkedPokemon = poi.linked_pokemon || [];
        const linkedItems = poi.linked_items || [];
        
        if (linkedPokemon.length === 0 && linkedItems.length === 0) return '';
        
        let html = '<section class="modal-section"><h3 class="modal-section-title"><i class="fas fa-link"></i> Conteúdo Vinculado</h3>';
        
        // Linked Pokemon
        if (linkedPokemon.length > 0) {
            const pokemonCards = linkedPokemon.map(pokemonId => {
                const poke = allPokemon.find(p => p.id === pokemonId);
                if (!poke) return '';
                
                const dexNumber = poke.id >= 2000 && poke.form_of 
                    ? String(poke.form_of).padStart(3, '0')
                    : String(poke.id).padStart(3, '0');
                
                return `
                    <div class="linked-pokemon-card" onclick="openPokemonModal(${poke.id})">
                        <img src="${poke.artwork}" alt="${poke.name}" class="linked-pokemon-img" />
                        <div class="linked-pokemon-info">
                            <span class="linked-pokemon-number">#${dexNumber}</span>
                            <span class="linked-pokemon-name">${poke.name}</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            html += `
                <div class="linked-section">
                    <h4 class="modal-section-subtitle">
                        <i class="fas fa-paw"></i> Pokémon Vinculados (${linkedPokemon.length})
                    </h4>
                    <div class="linked-pokemon-grid">
                        ${pokemonCards}
                    </div>
                </div>
            `;
        }
        
        // Linked Items
        if (linkedItems.length > 0) {
            const itemCards = linkedItems.map(itemId => {
                const item = allItems.find(i => i.id === itemId);
                if (!item) return '';
                
                return `
                    <div class="linked-item-card" onclick="openItemModal(${item.id})">
                        <img src="${item.sprite}" alt="${item.name}" class="linked-item-img" />
                        <span class="linked-item-name">${SEIRA_FORMATTERS.capitalizeWords(item.name)}</span>
                    </div>
                `;
            }).join('');
            
            html += `
                <div class="linked-section">
                    <h4 class="modal-section-subtitle">
                        <i class="fas fa-box"></i> Itens Vinculados (${linkedItems.length})
                    </h4>
                    <div class="linked-items-grid">
                        ${itemCards}
                    </div>
                </div>
            `;
        }
        
        html += '</section>';
        return html;
    },
    
    // ==================== SEÇÃO 4: CUSTOM EFFECT ====================
    renderCustomEffect(poi) {
        if (!poi.custom_effect) return '';
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-magic"></i> Efeito Especial
                </h3>
                <div class="custom-effect-box">
                    <i class="fas fa-star"></i>
                    <p>${poi.custom_effect}</p>
                </div>
            </section>
        `;
    }
};

/**
 * Abre modal de POI
 */
async function openPOIModal(poiId, mapId) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    const allMaps = await SEIRA_API.load('maps');
    const map = allMaps.find(m => m.id === mapId);
    
    if (!map) {
        console.error('Mapa não encontrado:', mapId);
        return;
    }
    
    const poi = map.points_of_interest.find(p => p.id === poiId);
    
    if (!poi) {
        console.error('POI não encontrado:', poiId);
        return;
    }
    
    // Renderiza o conteúdo do modal
    const content = await window.SEIRA_POI_MODAL.render(poi, mapId);
    
    // Define o título
    modalTitle.innerHTML = `
        <i class="fas fa-map-marker-alt modal-title-icon"></i>
        ${poi.name}
    `;
    
    SEIRA_MODAL.addShareButton('poi', poiId);
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

console.log('✅ POI Modal carregado');