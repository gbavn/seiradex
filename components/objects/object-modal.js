// ==================== OBJECT MODAL ====================
// Modal completo de objetos interativos

window.SEIRA_OBJECT_MODAL = {
    async render(object) {
        const items = await SEIRA_API.load('items');
        const pokemon = await SEIRA_API.load('pokemon');
        const maps = await SEIRA_API.load('maps');
        
        const section1 = this.renderBasicInfo(object);
        const section2 = this.renderDescription(object);
        const section3 = object.is_rollable ? this.renderSpawns(object, items, pokemon) : '';
        const section4 = this.renderLinkedContent(object, items, pokemon);
        const section5 = await this.renderWhereFound(object, maps);
        
        return `
            <div class="object-modal-content">
                ${section1}
                ${section2}
                ${section3}
                ${section4}
                ${section5}
            </div>
        `;
    },
    
    // ==================== SEÇÃO 1: INFORMAÇÕES BÁSICAS ====================
    renderBasicInfo(object) {
        const icon = object.icon ? `<i class="fas fa-${object.icon}"></i>` : '<i class="fas fa-cube"></i>';
        const categoryLabel = this.getCategoryLabel(object.category);
        const rollableLabel = object.is_rollable ? 'Sim' : 'Não';
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-info-circle"></i> Informações Básicas
                </h3>
                
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Ícone</span>
                        <div class="info-value object-icon-display">${icon}</div>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">ID</span>
                        <span class="info-value">${object.id}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Categoria</span>
                        <span class="info-value">${categoryLabel}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Sorteável</span>
                        <span class="info-value">${rollableLabel}</span>
                    </div>
                </div>
            </section>
        `;
    },
    
    getCategoryLabel(category) {
        const labels = {
            'fishing_spot': '<i class="fas fa-fish"></i> Ponto de Pesca',
            'pickup': '<i class="fas fa-shopping-bag"></i> Pickup',
            'generic': '<i class="fas fa-tree"></i> Genérico',
            'berry_tree': '<i class="fas fa-apple-alt"></i> Árvore de Berry',
            'apricorn_tree': '<i class="fas fa-seedling"></i> Árvore de Apricorn'
        };
        return labels[category] || category;
    },
    
    // ==================== SEÇÃO 2: DESCRIÇÃO ====================
    renderDescription(object) {
        if (!object.description) return '';
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-align-left"></i> Descrição
                </h3>
                <p class="effect-text">${object.description}</p>
            </section>
        `;
    },
    
    // ==================== SEÇÃO 3: SPAWNS (ROLL CONFIG) ====================
    renderSpawns(object, items, pokemon) {
        const rollConfig = object.roll_config;
        if (!rollConfig) return '';
        
        const type = rollConfig.type;
        const gives = rollConfig.gives;
        
        let contentHtml = '';
        
        if (type === 'equal_chance') {
            contentHtml = this.renderEqualChance(rollConfig, gives, items, pokemon);
        } else if (type === 'rarity_based') {
            contentHtml = this.renderRarityBased(rollConfig, gives, items, pokemon);
        } else if (type === 'custom_percentage') {
            contentHtml = this.renderCustomPercentage(rollConfig, gives, items, pokemon);
        }
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-dice"></i> Sistema de Sorteio
                </h3>
                <div class="roll-type-info">
                    <span class="badge badge-info">${this.getRollTypeLabel(type)}</span>
                    <span class="badge badge-success">${this.getGivesLabel(gives)}</span>
                </div>
                ${contentHtml}
            </section>
        `;
    },
    
    getRollTypeLabel(type) {
        const labels = {
            'equal_chance': 'Probabilidade Igual',
            'rarity_based': 'Baseado em Raridade',
            'custom_percentage': 'Porcentagem Customizada'
        };
        return labels[type] || type;
    },
    
    getGivesLabel(gives) {
        const labels = {
            'items_only': '<i class="fas fa-box"></i> Apenas Itens',
            'pokemon_only': '<i class="fas fa-fist-raised"></i> Apenas Pokémon',
            'pokemon_and_items': '<i class="fas fa-gift"></i> Pokémon e Itens'
        };
        return labels[gives] || gives;
    },
    
    // ==================== EQUAL CHANCE ====================
    renderEqualChance(rollConfig, gives, items, pokemon) {
        let html = '';
        
        if (gives === 'items_only' || gives === 'pokemon_and_items') {
            const itemsList = (rollConfig.items || []).map(itemId => {
                const item = items.find(i => i.id === itemId);
                return this.renderItemCard(item || { id: itemId, name: `Item #${itemId}` });
            }).join('');
            
            if (itemsList) {
                html += `
                    <div class="spawn-section">
                        <h4 class="modal-section-subtitle">
                            <i class="fas fa-box"></i> Itens (mesma probabilidade)
                        </h4>
                        <div class="spawn-grid">
                            ${itemsList}
                        </div>
                    </div>
                `;
            }
        }
        
        if (gives === 'pokemon_only' || gives === 'pokemon_and_items') {
            const pokemonList = (rollConfig.pokemon || []).map(pokemonId => {
                const poke = pokemon.find(p => p.id === pokemonId);
                return this.renderPokemonCard(poke || { id: pokemonId, name: `Pokémon #${pokemonId}` });
            }).join('');
            
            if (pokemonList) {
                html += `
                    <div class="spawn-section">
                        <h4 class="modal-section-subtitle">
                            <i class="fas fa-paw"></i> Pokémon (mesma probabilidade)
                        </h4>
                        <div class="spawn-grid">
                            ${pokemonList}
                        </div>
                    </div>
                `;
            }
        }
        
        return html || '<p class="empty-text">Nenhum spawn configurado.</p>';
    },
    
    // ==================== RARITY BASED ====================
    renderRarityBased(rollConfig, gives, items, pokemon) {
        let html = '';
        
        const rarities = ['common', 'rare', 'epic', 'special'];
        const rarityLabels = {
            'common': 'Comum',
            'rare': 'Raro',
            'epic': 'Épico',
            'special': 'Especial'
        };
        
        if (gives === 'items_only' || gives === 'pokemon_and_items') {
            const itemsConfig = rollConfig.items || {};
            
            html += '<div class="spawn-section"><h4 class="modal-section-subtitle"><i class="fas fa-box"></i> Itens por Raridade</h4>';
            
            rarities.forEach(rarity => {
                const itemIds = itemsConfig[rarity] || [];
                if (itemIds.length === 0) return;
                
                const itemsList = itemIds.map(itemId => {
                    const item = items.find(i => i.id === itemId);
                    return this.renderItemCard(item || { id: itemId, name: `Item #${itemId}` });
                }).join('');
                
                html += `
                    <div class="rarity-group">
                        <h5 class="rarity-label rarity-${rarity}">${rarityLabels[rarity]} (${itemIds.length})</h5>
                        <div class="spawn-grid">
                            ${itemsList}
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        if (gives === 'pokemon_only' || gives === 'pokemon_and_items') {
            const pokemonConfig = rollConfig.pokemon || {};
            
            html += '<div class="spawn-section"><h4 class="modal-section-subtitle"><i class="fas fa-paw"></i> Pokémon por Raridade</h4>';
            
            rarities.forEach(rarity => {
                const pokemonIds = pokemonConfig[rarity] || [];
                if (pokemonIds.length === 0) return;
                
                const pokemonList = pokemonIds.map(pokemonId => {
                    const poke = pokemon.find(p => p.id === pokemonId);
                    return this.renderPokemonCard(poke || { id: pokemonId, name: `Pokémon #${pokemonId}` });
                }).join('');
                
                html += `
                    <div class="rarity-group">
                        <h5 class="rarity-label rarity-${rarity}">${rarityLabels[rarity]} (${pokemonIds.length})</h5>
                        <div class="spawn-grid">
                            ${pokemonList}
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        return html || '<p class="empty-text">Nenhum spawn configurado.</p>';
    },
    
    // ==================== CUSTOM PERCENTAGE ====================
    renderCustomPercentage(rollConfig, gives, items, pokemon) {
        let html = '';
        
        if (gives === 'items_only' || gives === 'pokemon_and_items') {
            const itemsConfig = rollConfig.items || [];
            // Ordenar por rate DESC
            const sortedItems = [...itemsConfig].sort((a, b) => b.rate - a.rate);
            
            if (sortedItems.length > 0) {
                const itemsHtml = sortedItems.map(entry => {
                    const item = items.find(i => i.id === entry.item_id);
                    const itemData = item || { id: entry.item_id, name: `Item #${entry.item_id}` };
                    
                    return `
                        <div class="spawn-item-percentage" onclick="openItemModal(${entry.item_id})">
                            ${item?.sprite ? `<img src="${item.sprite}" alt="${item.name}" class="spawn-item-img" />` : '<i class="fas fa-box"></i>'}
                            <span class="spawn-item-name">${SEIRA_FORMATTERS.capitalizeWords(itemData.name)}</span>
                            <span class="spawn-percentage">${entry.rate}%</span>
                        </div>
                    `;
                }).join('');
                
                html += `
                    <div class="spawn-section">
                        <h4 class="modal-section-subtitle">
                            <i class="fas fa-box"></i> Itens (porcentagem customizada)
                        </h4>
                        <div class="spawn-percentage-list">
                            ${itemsHtml}
                        </div>
                    </div>
                `;
            }
        }
        
        if (gives === 'pokemon_only' || gives === 'pokemon_and_items') {
            const pokemonConfig = rollConfig.pokemon || [];
            // Ordenar por rate DESC
            const sortedPokemon = [...pokemonConfig].sort((a, b) => b.rate - a.rate);
            
            if (sortedPokemon.length > 0) {
                const pokemonHtml = sortedPokemon.map(entry => {
                    const poke = pokemon.find(p => p.id === entry.pokemon_id);
                    const pokeData = poke || { id: entry.pokemon_id, name: `Pokémon #${entry.pokemon_id}` };
                    
                    return `
                        <div class="spawn-item-percentage" onclick="openPokemonModal(${entry.pokemon_id})">
                            ${poke?.artwork ? `<img src="${poke.artwork}" alt="${poke.name}" class="spawn-pokemon-img" />` : '<i class="fas fa-question"></i>'}
                            <span class="spawn-item-name">${pokeData.name}</span>
                            <span class="spawn-percentage">${entry.rate}%</span>
                        </div>
                    `;
                }).join('');
                
                html += `
                    <div class="spawn-section">
                        <h4 class="modal-section-subtitle">
                            <i class="fas fa-paw"></i> Pokémon (porcentagem customizada)
                        </h4>
                        <div class="spawn-percentage-list">
                            ${pokemonHtml}
                        </div>
                    </div>
                `;
            }
        }
        
        return html || '<p class="empty-text">Nenhum spawn configurado.</p>';
    },
    
    // ==================== SEÇÃO 4: LINKED CONTENT ====================
    renderLinkedContent(object, items, pokemon) {
        // Se rollable, não tem linked_pokemon (já mostrou no spawns)
        if (object.is_rollable) return '';
        
        const linkedPokemon = object.linked_pokemon || [];
        if (linkedPokemon.length === 0) return '';
        
        const pokemonCards = linkedPokemon.map(pokemonId => {
            const poke = pokemon.find(p => p.id === pokemonId);
            return this.renderPokemonCard(poke || { id: pokemonId, name: `Pokémon #${pokemonId}` });
        }).join('');
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-link"></i> Pokémon Vinculados (${linkedPokemon.length})
                </h3>
                <div class="spawn-grid">
                    ${pokemonCards}
                </div>
            </section>
        `;
    },
    
    // ==================== SEÇÃO 5: ONDE ENCONTRADO ====================
    async renderWhereFound(object, maps) {
        // Filtrar mapas escondidos
        const visibleMaps = window.SEIRA_HIDDEN.filter('maps', maps);
        
        // Buscar mapas que contêm este objeto
        const foundMaps = visibleMaps.filter(map => {
            const objects = map.objects || [];
            return objects.includes(object.id);
        });
        
        if (foundMaps.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-map-marker-alt"></i> Onde Encontrado
                    </h3>
                    <p class="empty-text">Este objeto não aparece em nenhum mapa disponível.</p>
                </section>
            `;
        }
        
        const mapsHtml = foundMaps.map(map => {
            return `
                <div class="map-card">
                    ${map.map_image ? 
                        `<div class="map-image">
                            <img src="${map.map_image}" alt="${map.name}" />
                        </div>` : 
                        `<div class="map-icon"><i class="fas fa-map"></i></div>`
                    }
                    <div class="map-info">
                        <h4 class="map-name">${map.name}</h4>
                        <span class="map-type">${map.type || 'Desconhecido'}</span>
                    </div>
                    ${map.forum_link ? 
                        `<a href="${map.forum_link}" target="_blank" class="map-link">
                            <i class="fas fa-external-link-alt"></i>
                        </a>` : ''
                    }
                </div>
            `;
        }).join('');
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-map-marker-alt"></i> Onde Encontrado (${foundMaps.length})
                </h3>
                <div class="maps-grid">
                    ${mapsHtml}
                </div>
            </section>
        `;
    },
    
    // ==================== HELPERS ====================
    renderItemCard(item) {
    return `
        <div class="spawn-card spawn-item" onclick="openItemModal(${item.id})">
            ${item.sprite ? 
                `<img src="${item.sprite}" alt="${item.name}" class="spawn-item-img" />` : 
                '<i class="fas fa-box spawn-card-icon"></i>'
            }
            <span class="spawn-card-name">${SEIRA_FORMATTERS.capitalizeWords(item.name)}</span>
        </div>
    `;
},
    
    renderPokemonCard(poke) {
        const dexNumber = poke.id >= 2000 && poke.form_of 
            ? String(poke.form_of).padStart(3, '0')
            : String(poke.id).padStart(3, '0');
        
        return `
            <div class="spawn-card spawn-pokemon" onclick="openPokemonModal(${poke.id})">
                ${poke.artwork ? 
                    `<img src="${poke.artwork}" alt="${poke.name}" class="spawn-card-img" />` : 
                    '<i class="fas fa-question spawn-card-icon"></i>'
                }
                <div class="spawn-card-info">
                    <span class="spawn-card-number">#${dexNumber}</span>
                    <span class="spawn-card-name">${poke.name}</span>
                </div>
            </div>
        `;
    }
};

/**
 * Abre modal de objeto
 */
async function openObjectModal(objectId) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    const allObjects = await SEIRA_API.load('objects');
    const object = allObjects.find(o => o.id === objectId);
    
    if (!object) {
        console.error('Objeto não encontrado:', objectId);
        return;
    }
    
    // Renderiza o conteúdo do modal
    const content = await window.SEIRA_OBJECT_MODAL.render(object);
    
    // Define o título com ícone Font Awesome
const icon = object.icon ? `<i class="fas fa-${object.icon}"></i>` : '<i class="fas fa-cube"></i>';
    
    modalTitle.innerHTML = `
        <span class="modal-title-icon object-icon-title">${icon}</span>
        ${object.name}
    `;
    
    SEIRA_MODAL.addShareButton('object', objectId);
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

console.log('✅ Object Modal carregado');