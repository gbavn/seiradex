// ==================== MAP MODAL ====================
// Modal completo de mapas com todas as seções

window.SEIRA_MAP_MODAL = {
    async render(map) {
        const items = await SEIRA_API.load('items');
        const pokemon = await SEIRA_API.load('pokemon');
        const quests = await SEIRA_API.load('quests');
        const objects = await SEIRA_API.load('objects');

        const section1 = this.renderBasicInfo(map);
        const section2 = this.renderAccesses(map);
        const section3 = this.renderDescription(map);
        const section4 = this.renderPointsOfInterest(map);
        const section5 = this.renderQuests(map, quests);
        const section6 = this.renderSpawns(map, pokemon);
        const section7 = this.renderInteractionObjects(map, objects);
        const section8 = this.renderForageableItems(map, items);

        return `
            <div class="map-modal-content">
                ${section1}
                ${section2}
                ${section3}
                ${section4}
                ${section5}
                ${section6}
                ${section7}
                ${section8}
            </div>
        `;
    },

    // ==================== SEÇÃO 1: INFORMAÇÕES BÁSICAS ====================
    renderBasicInfo(map) {
        const typeLabel = this.getTypeLabel(map.type);
        const metadata = map.metadata || {};

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-info-circle"></i> Informações
                </h3>
                
                <div class="map-info-layout">
                    <!-- Foto do Lugar -->
                    <div class="map-main-image">
                        ${map.map_image ?
                `<img src="${map.map_image}" alt="${map.name}" />` :
                `<div class="map-image-placeholder">
                                <i class="fas fa-map"></i>
                                <span>Sem imagem disponível</span>
                            </div>`
            }
                    </div>
                    
                    <!-- Informações -->
                    <div class="map-info-details">
                        <!-- Grid 3 colunas: ID, Tipo, Bioma -->
                        <div class="info-grid-3cols">
                            <div class="info-item">
                                <span class="info-label">ID</span>
                                <span class="info-value">${map.id}</span>
                            </div>
                            
                            <div class="info-item">
                                <span class="info-label">Tipo</span>
                                <span class="info-value">${typeLabel}</span>
                            </div>
                            
                            <div class="info-item">
                                <span class="info-label">Bioma</span>
                                <span class="info-value">${map.biome || 'Desconhecido'}</span>
                            </div>
                        </div>
                        
                        <!-- Metadata: Linha 1 (População e Baseado em) -->
                        <div class="metadata-row-2cols">
                            <div class="info-item">
                                <span class="info-label">População</span>
                                <span class="info-value">${metadata.population || '-'}</span>
                            </div>
                            
                            <div class="info-item">
                                <span class="info-label">Baseado em</span>
                                <span class="info-value">${metadata.based_on || '-'}</span>
                            </div>
                        </div>
                        
                        <!-- Metadata: Linha 2 (Economia) -->
                        <div class="info-item info-item-full">
                            <span class="info-label">Economia</span>
                            <span class="info-value">${metadata.economy && metadata.economy.length > 0 ? metadata.economy.join(', ') : '-'}</span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    // ==================== SEÇÃO 2: ACESSOS ====================
    renderAccesses(map) {
        const accesses = map.accesses || {};

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-compass"></i> Acessos
                </h3>
                <div class="accesses-grid-4cols">
                    ${this.renderAccessCard('north', accesses.north)}
                    ${this.renderAccessCard('south', accesses.south)}
                    ${this.renderAccessCard('east', accesses.east)}
                    ${this.renderAccessCard('west', accesses.west)}
                </div>
            </section>
        `;
    },

    renderAccessCard(direction, access) {
        const directionIcon = this.getDirectionIcon(direction);
        const directionLabel = this.getDirectionLabel(direction);

        if (!access) {
            return `
                <div class="access-card access-empty">
                    <div class="access-direction">
                        <i class="fas ${directionIcon}"></i>
                        <span>${directionLabel}</span>
                    </div>
                    <div class="access-info">
                        <span class="access-name-empty">Sem conexão</span>
                    </div>
                </div>
            `;
        }

        const postsRequired = access.posts_required ?
            `<span class="access-posts">${access.posts_required} posts</span>` : '';

        return `
            <div class="access-card">
                <div class="access-direction">
                    <i class="fas ${directionIcon}"></i>
                    <span>${directionLabel}</span>
                </div>
                <div class="access-info">
                    <span class="access-name">${access.name}</span>
                    ${postsRequired}
                </div>
                ${access.forum_link ?
                `<a href="${access.forum_link}" target="_blank" class="access-link">
                        <i class="fas fa-external-link-alt"></i>
                    </a>` : ''
            }
            </div>
        `;
    },

    getTypeLabel(type) {
        const labels = {
            'city': '<span class="badge badge-city"><i class="fas fa-city"></i> Cidade</span>',
            'route': '<span class="badge badge-route"><i class="fas fa-road"></i> Rota</span>',
            'landmark': '<span class="badge badge-landmark"><i class="fas fa-landmark"></i> Landmark</span>'
        };
        return labels[type] || type;
    },

    getDirectionIcon(direction) {
        const icons = {
            'north': 'fa-arrow-up',
            'south': 'fa-arrow-down',
            'east': 'fa-arrow-right',
            'west': 'fa-arrow-left'
        };
        return icons[direction] || 'fa-arrow-right';
    },

    getDirectionLabel(direction) {
        const labels = {
            'north': 'Norte',
            'south': 'Sul',
            'east': 'Leste',
            'west': 'Oeste'
        };
        return labels[direction] || direction;
    },

    // ==================== SEÇÃO 3: DESCRIÇÃO ====================
    renderDescription(map) {
        if (!map.description) return '';

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-align-left"></i> Descrição
                </h3>
                <p class="effect-text" style="white-space: pre-line;">${map.description}</p>
            </section>
        `;
    },

    // ==================== SEÇÃO 4: PONTOS DE INTERESSE ====================
    renderPointsOfInterest(map) {
        const pois = map.points_of_interest || [];

        if (pois.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-map-marker-alt"></i> Pontos de Interesse
                    </h3>
                    <p class="empty-text">Nenhum ponto de interesse registrado.</p>
                </section>
            `;
        }

        const poiCards = pois.map(poi => {
            const typeIcon = this.getPOITypeIcon(poi.type);

            return `
                <div class="poi-card" onclick="openPOIModal('${poi.id}', '${map.id}')">
                    <div class="poi-icon">
                        <i class="${typeIcon}"></i>
                    </div>
                    <div class="poi-info">
                        <h4 class="poi-name">${poi.name}</h4>
                        <span class="poi-type">${this.getPOITypeLabel(poi.type)}</span>
                    </div>
                    <i class="fas fa-chevron-right poi-arrow"></i>
                </div>
            `;
        }).join('');

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-map-marker-alt"></i> Pontos de Interesse (${pois.length})
                </h3>
                <div class="poi-grid">
                    ${poiCards}
                </div>
            </section>
        `;
    },

    getPOITypeIcon(type) {
        const icons = {
            'gym': 'fas fa-dumbbell',
            'shop': 'fas fa-store',
            'restaurant': 'fas fa-utensils',
            'facility': 'fas fa-building',
            'service': 'fas fa-concierge-bell',
            'other': 'fas fa-map-pin'
        };
        return icons[type] || 'fas fa-map-pin';
    },

    getPOITypeLabel(type) {
        const labels = {
            'gym': 'Ginásio',
            'shop': 'Loja',
            'restaurant': 'Restaurante',
            'facility': 'Instalação',
            'service': 'Serviço',
            'other': 'Outro'
        };
        return labels[type] || type;
    },

    // ==================== SEÇÃO 5: QUESTS ====================
    renderQuests(map, allQuests) {
        const questIds = map.quest_ids || [];

        if (questIds.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-scroll"></i> Quests
                    </h3>
                    <p class="empty-text">Nenhuma quest disponível neste local.</p>
                </section>
            `;
        }

        const questCards = questIds.map(questId => {
            const quest = allQuests.find(q => q.id === questId);
            if (!quest) return '';

            return `
                <div class="quest-mini-card" onclick="openQuestModal(${quest.id})">
                    <div class="quest-mini-icon">
                        <i class="fas fa-scroll"></i>
                    </div>
                    <div class="quest-mini-info">
                        <span class="quest-mini-name">${quest.name}</span>
                        ${quest.requester ?
                    `<span class="quest-mini-requester">${quest.requester}</span>` : ''
                }
                    </div>
                </div>
            `;
        }).join('');

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-scroll"></i> Quests (${questIds.length})
                </h3>
                <div class="quest-mini-grid">
                    ${questCards}
                </div>
            </section>
        `;
    },

    // ==================== SEÇÃO 6: SPAWNS ====================
    renderSpawns(map, allPokemon) {
        const spawns = map.spawns || {};

        const hasSpawns = (spawns.common && spawns.common.length > 0) ||
            (spawns.rare && spawns.rare.length > 0) ||
            (spawns.epic && spawns.epic.length > 0);

        if (!hasSpawns) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-paw"></i> Spawns
                    </h3>
                    <p class="empty-text">Nenhum spawn registrado neste local.</p>
                </section>
            `;
        }

        let html = '<section class="modal-section"><h3 class="modal-section-title"><i class="fas fa-paw"></i> Spawns</h3>';

        // Common
        if (spawns.common && spawns.common.length > 0) {
            html += this.renderSpawnRarity('Comum', spawns.common, allPokemon, 'common');
        }

        // Rare
        if (spawns.rare && spawns.rare.length > 0) {
            html += this.renderSpawnRarity('Raro', spawns.rare, allPokemon, 'rare');
        }

        // Epic
        if (spawns.epic && spawns.epic.length > 0) {
            html += this.renderSpawnRarity('Épico', spawns.epic, allPokemon, 'epic');
        }

        html += '</section>';
        return html;
    },

    renderSpawnRarity(label, pokemonIds, allPokemon, rarity) {
    const cards = pokemonIds.map(pokemonId => {
        const poke = allPokemon.find(p => p.id === pokemonId);
        if (!poke) return '';

        const dexNumber = poke.id >= 2000 && poke.form_of
            ? String(poke.form_of).padStart(3, '0')
            : String(poke.id).padStart(3, '0');

        // ✅ Renderiza badges de tipo
        const typesBadges = poke.types.map(type => 
            `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`
        ).join('');

        return `
            <div class="spawn-card spawn-pokemon" onclick="openPokemonModal(${poke.id})">
                ${poke.artwork ?
                    `<img src="${poke.artwork}" alt="${poke.name}" class="spawn-card-img" />` :
                    '<i class="fas fa-question spawn-card-icon"></i>'
                }
                <div class="spawn-card-info">
                    <span class="spawn-card-number">#${dexNumber}</span>
                    <span class="spawn-card-name">${poke.name}</span>
                    <div class="spawn-card-types">
                        ${typesBadges}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="spawn-section">
            <h4 class="modal-section-subtitle">
                <span class="rarity-label rarity-${rarity}">${label} (${pokemonIds.length})</span>
            </h4>
            <div class="spawn-grid">
                ${cards}
            </div>
        </div>
    `;
},

    // ==================== SEÇÃO 7: OBJETOS DE INTERAÇÃO ====================
    renderInteractionObjects(map, allObjects) {
        const objectIds = map.interaction_objects || [];

        if (objectIds.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-cube"></i> Objetos de Interação
                    </h3>
                    <p class="empty-text">Nenhum objeto de interação disponível.</p>
                </section>
            `;
        }

        const objectCards = objectIds.map(objectId => {
            const object = allObjects.find(o => o.id === objectId);
            if (!object) return '';

            const icon = object.icon ? `<i class="fas fa-${object.icon}"></i>` : '<i class="fas fa-cube"></i>';

            return `
                <div class="object-mini-card" onclick="openObjectModal('${object.id}')">
                    <div class="object-mini-icon">
                        ${icon}
                    </div>
                    <span class="object-mini-name">${object.name}</span>
                </div>
            `;
        }).join('');

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-cube"></i> Objetos de Interação (${objectIds.length})
                </h3>
                <div class="object-mini-grid">
                    ${objectCards}
                </div>
            </section>
        `;
    },

    // ==================== SEÇÃO 8: ITENS COLETÁVEIS ====================
    renderForageableItems(map, allItems) {
        const forageableData = map.forageable_items || [];

        if (forageableData.length === 0) {
            return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-leaf"></i> Itens Coletáveis
                </h3>
                <p class="empty-text">Nenhum item coletável disponível neste local.</p>
            </section>
        `;
        }

        const infoText = `
        <div class="forageable-info">
            <i class="fas fa-info-circle"></i>
            <p>Os itens de coleta são recursos que podem ser obtidos livremente ao explorar o mapa, variando de acordo com o bioma em que se encontra o jogador. Para verificar quando um item está disponível novamente, basta passar o mouse sobre ele e conferir o tempo de cooldown. Em cada postagem, é possível colher até <b>3 itens diferentes</b>, sendo que, por padrão, <b>1 unidade de cada item é coletada</b>. Exceções podem ocorrer caso haja eventos especiais ou perícias ativas que aumentem a quantidade de itens obtidos.</p>
        </div>
    `;

        const itemCards = forageableData.map(forageableItem => {
            const item = allItems.find(i => i.id === forageableItem.item_id);
            if (!item) return '';

            // Posts vem do JSON do ITEM
            const postsToCollect = item.posts_to_collect || 1;

            // Quantidade vem do JSON do MAPA
            const collectedQuantity = forageableItem.collected_quantity || 1;

            return `
            <div class="forageable-card" onclick="openItemModal(${item.id})" title="Cooldown: ${postsToCollect} posts">
                <img src="${item.sprite}" alt="${item.name}" class="forageable-img" />
                <div class="forageable-info-box">
                    <span class="forageable-name">${SEIRA_FORMATTERS.capitalizeWords(item.name)}</span>
                    <span class="forageable-cooldown">
                        <i class="fas fa-clock"></i> ${postsToCollect} ${postsToCollect === 1 ? 'post' : 'posts'}
                    </span>
                    <span class="forageable-quantity">
                        <i class="fas fa-box"></i> ${collectedQuantity}x por coleta
                    </span>
                </div>
            </div>
        `;
        }).join('');

        return `
        <section class="modal-section">
            <h3 class="modal-section-title">
                <i class="fas fa-leaf"></i> Itens Coletáveis (${forageableData.length})
            </h3>
            ${infoText}
            <div class="forageable-grid">
                ${itemCards}
            </div>
        </section>
    `;
    }
};

/**
 * Abre modal de mapa
 */
async function openMapModal(mapId) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const allMaps = await SEIRA_API.load('maps');
    const map = allMaps.find(m => m.id === mapId);

    if (!map) {
        console.error('Mapa não encontrado:', mapId);
        return;
    }

    // Renderiza o conteúdo do modal
    const content = await window.SEIRA_MAP_MODAL.render(map);

    // Define o título
    const typeIcon = map.type === 'city' ? 'fa-city' :
        map.type === 'route' ? 'fa-road' :
            'fa-landmark';

    modalTitle.innerHTML = `
        <i class="fas ${typeIcon} modal-title-icon-fa"></i>
        ${map.name}
    `;

    SEIRA_MODAL.addShareButton('map', mapId);

    modalBody.innerHTML = content;
    modal.classList.add('active');
}

console.log('✅ Map Modal carregado');