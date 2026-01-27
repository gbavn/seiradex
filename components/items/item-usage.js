// ==================== SEIRA RPG DATABASE - ITEM USAGE (COMPLETO) ====================

/**
 * Busca todos os usos e localizações de um item
 */
async function getItemUsage(itemId, itemName) {
    const allMaps = await SEIRA_API.load('maps');
    const allQuests = await SEIRA_API.load('quests');
    const allObjects = await SEIRA_API.load('objects');
    const allPokemon = await SEIRA_API.load('pokemon');
    
    return {
        mapForageable: findInMapForageable(itemId, allMaps),
        mapShops: findInMapShops(itemId, allMaps),
        questRewards: findInQuestRewards(itemId, allQuests),
        rollableObjects: findInRollableObjects(itemId, allObjects),
        evolutionPokemon: findEvolutionPokemon(itemId, allPokemon),
        heldByPokemon: findHeldByPokemon(itemId, allPokemon),
        producedByPokemon: findProducedByPokemon(itemId, allPokemon)
    };
}

/**
 * Busca item em forageable_items dos mapas
 */
function findInMapForageable(itemId, maps) {
    return maps.filter(map => 
        map.forageable_items?.includes(itemId)
    ).map(map => ({
        id: map.id,
        name: map.name,
        type: map.type
    }));
}

/**
 * Busca item em lojas dentro de points_of_interest
 */
function findInMapShops(itemId, maps) {
    const shops = [];
    
    maps.forEach(map => {
        map.points_of_interest?.forEach(poi => {
            if (poi.shop_data?.sells?.includes(itemId)) {
                shops.push({
                    mapId: map.id,
                    mapName: map.name,
                    shopName: poi.name,
                    shopType: poi.type
                });
            }
        });
    });
    
    return shops;
}

/**
 * Busca item em recompensas de quests
 */
function findInQuestRewards(itemId, quests) {
    return quests.filter(quest => 
        quest.rewards?.items?.some(reward => reward.item_id === itemId)
    ).map(quest => ({
        id: quest.id,
        name: quest.name,
        quantity: quest.rewards.items.find(r => r.item_id === itemId).quantity
    }));
}

/**
 * Busca item em objetos roláveis
 */
function findInRollableObjects(itemId, objects) {
    const results = [];
    
    objects.forEach(obj => {
        if (!obj.is_rollable || !obj.roll_config) return;
        
        const config = obj.roll_config;
        let found = false;
        let details = {};
        
        // Tipo 1: rarity_based
        if (config.type === 'rarity_based' && config.items) {
            for (let key in config.items) {
                const value = config.items[key];
                if (value === itemId) {
                    found = true;
                    break;
                }
                if (Array.isArray(value) && value.includes(itemId)) {
                    found = true;
                    details.rarity = key;
                    break;
                }
            }
        }
        
        // Tipo 2: custom_percentage
        if (config.type === 'custom_percentage' && Array.isArray(config.items)) {
            const item = config.items.find(i => i.item_id === itemId);
            if (item) {
                found = true;
                details.rate = item.rate;
            }
        }
        
        // Tipo 3: equal_chance
        if (config.type === 'equal_chance' && Array.isArray(config.items)) {
            if (config.items.includes(itemId)) {
                found = true;
                details.equalChance = true;
            }
        }
        
        if (found) {
            results.push({
                id: obj.id,
                name: obj.name,
                category: obj.category,
                type: config.type,
                details: details
            });
        }
    });
    
    return results;
}

/**
 * Busca Pokémon que evoluem com este item
 */
function findEvolutionPokemon(itemId, pokemon) {
    const results = [];
    
    pokemon.forEach(p => {
        if (!p.evolves_to) return;
        
        p.evolves_to.forEach(evo => {
            const hasItemTrigger = evo.triggers?.some(trigger => 
                trigger.type === 'item' && trigger.item_id === itemId
            );
            
            if (hasItemTrigger) {
                results.push({
                    id: p.id,
                    name: p.name,
                    artwork: p.artwork
                });
            }
        });
    });
    
    return results;
}

/**
 * Busca Pokémon que podem segurar este item (HELD ITEMS / DROP)
 */
function findHeldByPokemon(itemId, pokemon) {
    return pokemon.filter(p => 
        p.held_items?.some(held => held.item_id === itemId || held.item_id === String(itemId))
    ).map(p => {
        const heldItem = p.held_items.find(h => h.item_id === itemId || h.item_id === String(itemId));
        return {
            id: p.id,
            name: p.name,
            artwork: p.artwork,
            rarity: heldItem.rarity
        };
    });
}

/**
 * Busca Pokémon que PRODUZEM este item
 */
function findProducedByPokemon(itemId, pokemon) {
    return pokemon.filter(p => 
        p.is_producer && p.production?.some(prod => prod.item_id === itemId)
    ).map(p => {
        const production = p.production.find(prod => prod.item_id === itemId);
        return {
            id: p.id,
            name: p.name,
            artwork: p.artwork,
            description: production.description
        };
    });
}

/**
 * Busca Pokémon que podem aprender um TM
 */
function findPokemonThatLearnTM(moveName, allPokemon) {
    const moveNameLower = moveName.toLowerCase();
    
    return allPokemon.filter(p => 
        p.learnable_moves?.some(move => 
            move.toLowerCase() === moveNameLower
        )
    ).map(p => ({
        id: p.id,
        name: p.name,
        artwork: p.artwork
    }));
}

/**
 * Cria HTML das seções de uso do item
 */
async function createItemUsageSections(item) {
    let html = '';
    
    const usage = await getItemUsage(item.id, item.name);
    const allPokemon = await SEIRA_API.load('pokemon');
    
    // ==================== SEÇÃO TM (COM SPOILER FUNCIONANDO) ====================
    if (item.category === 'tm' && item.linked_move && item.move_name) {
        const pokemonThatLearn = findPokemonThatLearnTM(item.move_name, allPokemon);
        
        if (pokemonThatLearn.length > 0) {
            const showSpoiler = pokemonThatLearn.length > 16;
            const visiblePokemon = showSpoiler ? pokemonThatLearn.slice(0, 16) : pokemonThatLearn;
            const hiddenPokemon = showSpoiler ? pokemonThatLearn.slice(10) : [];
            
            html += `
                <div class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-graduation-cap"></i> Pokémon que podem aprender ${item.move_name} (${pokemonThatLearn.length})
                    </h3>
                    
                    <!-- Pokémon visíveis (primeiros 10) -->
                    <div class="tm-pokemon-visible">
                        ${visiblePokemon.map(p => `
                            <div class="pokemon-mini-card" onclick="openPokemonModal(${p.id})">
                                <div class="pokemon-mini-image">
                                    <img src="${p.artwork}" alt="${p.name}">
                                </div>
                                <span class="pokemon-mini-name">${p.name}</span>
                            </div>
                        `).join('')}
                    </div>
            `;
            
            // Spoiler para o resto
            if (showSpoiler) {
                const spoilerId = 'tm-spoiler-' + item.id;
                html += `
                    <div class="tm-pokemon-spoiler">
                        <div class="spoiler" id="${spoilerId}">
                            <div class="spoiler-header" onclick="SEIRA_SPOILER.toggle('${spoilerId}')">
                                <i class="fas fa-chevron-right"></i>
                                <span>Ver todos os ${pokemonThatLearn.length} Pokémon</span>
                            </div>
                            <div class="spoiler-content">
                                <div class="pokemon-list-grid">
                                    ${hiddenPokemon.map(p => `
                                        <div class="pokemon-mini-card" onclick="openPokemonModal(${p.id})">
                                            <div class="pokemon-mini-image">
                                                <img src="${p.artwork}" alt="${p.name}">
                                            </div>
                                            <span class="pokemon-mini-name">${p.name}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            html += `</div>`;
        }
    }
    
    // ==================== SEÇÃO: ONDE ENCONTRAR ====================
    const hasAnyLocation = usage.mapForageable.length > 0 || 
                          usage.mapShops.length > 0 || 
                          usage.questRewards.length > 0 || 
                          usage.rollableObjects.length > 0;
    
    if (hasAnyLocation) {
        html += `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-map-marker-alt"></i> Onde Encontrar
                </h3>
        `;
        
        if (usage.mapForageable.length > 0) {
            html += `
                <div class="usage-subsection">
                    <h4 class="usage-subsection-title">🗺️ Coletável nos Mapas</h4>
                    <div class="usage-list">
                        ${usage.mapForageable.map(map => `
                            <span class="usage-badge" onclick="openMapModal('${map.id}')">${map.name}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (usage.mapShops.length > 0) {
            html += `
                <div class="usage-subsection">
                    <h4 class="usage-subsection-title">🏪 Vendido em</h4>
                    <div class="usage-list">
                        ${usage.mapShops.map(shop => `
                            <span class="usage-badge">${shop.shopName} (${shop.mapName})</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (usage.questRewards.length > 0) {
            html += `
                <div class="usage-subsection">
                    <h4 class="usage-subsection-title">🎁 Recompensa de Quests</h4>
                    <div class="usage-list">
                        ${usage.questRewards.map(quest => `
                            <span class="usage-badge" onclick="openQuestModal(${quest.id})">
                                ${quest.name} (x${quest.quantity})
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (usage.rollableObjects.length > 0) {
            html += `
                <div class="usage-subsection">
                    <h4 class="usage-subsection-title">🎲 Encontrado em</h4>
                    <div class="usage-list">
                        ${usage.rollableObjects.map(obj => {
                            let details = '';
                            if (obj.details.rate) {
                                details = ` (${obj.details.rate}%)`;
                            } else if (obj.details.rarity) {
                                details = ` (${obj.details.rarity})`;
                            }
                            return `<span class="usage-badge">${obj.name}${details}</span>`;
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        html += `</div>`;
    }
    
    // ==================== SEÇÃO: DROPADO DE (HELD ITEMS) ====================
    if (usage.heldByPokemon.length > 0) {
        html += `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-hand-holding"></i> Dropado de (${usage.heldByPokemon.length})
                </h3>
                <div class="pokemon-list-grid">
                    ${usage.heldByPokemon.map(p => `
                        <div class="pokemon-mini-card" onclick="openPokemonModal(${p.id})">
                            <div class="pokemon-mini-image">
                                <img src="${p.artwork}" alt="${p.name}">
                            </div>
                            <span class="pokemon-mini-name">${p.name}</span>
                            <span class="held-rarity">${p.rarity}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // ==================== SEÇÃO: PRODUZIDO POR ====================
    if (usage.producedByPokemon.length > 0) {
        html += `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-seedling"></i> Produzido por (${usage.producedByPokemon.length})
                </h3>
                <div class="producer-list">
                    ${usage.producedByPokemon.map(p => `
                        <div class="producer-card" onclick="openPokemonModal(${p.id})">
                            <div class="producer-image">
                                <img src="${p.artwork}" alt="${p.name}">
                            </div>
                            <div class="producer-info">
                                <h4 class="producer-name">${p.name}</h4>
                                <p class="producer-description">${p.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // ==================== SEÇÃO: USADO PARA EVOLUIR (GRID) ====================
    if (usage.evolutionPokemon.length > 0) {
        html += `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-dna"></i> Usado para Evoluir (${usage.evolutionPokemon.length})
                </h3>
                <div class="evolution-pokemon-grid">
                    ${usage.evolutionPokemon.map(p => `
                        <div class="pokemon-mini-card" onclick="openPokemonModal(${p.id})">
                            <div class="pokemon-mini-image">
                                <img src="${p.artwork}" alt="${p.name}">
                            </div>
                            <span class="pokemon-mini-name">${p.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // ==================== SEÇÃO: POKÉMON EXCLUSIVO ====================
    if (item.linked_pokemon && item.linked_pokemon.length > 0) {
        const linkedPokemon = item.linked_pokemon.map(id => {
            const p = allPokemon.find(poke => poke.id === id);
            return p ? { id: p.id, name: p.name, artwork: p.artwork } : null;
        }).filter(p => p !== null);
        
        if (linkedPokemon.length > 0) {
            html += `
                <div class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-star"></i> Item Exclusivo de
                    </h3>
                    <div class="pokemon-list-grid">
                        ${linkedPokemon.map(p => `
                            <div class="pokemon-mini-card" onclick="openPokemonModal(${p.id})">
                                <div class="pokemon-mini-image">
                                    <img src="${p.artwork}" alt="${p.name}">
                                </div>
                                <span class="pokemon-mini-name">${p.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    return html;
}

console.log('✅ Item Usage carregado');