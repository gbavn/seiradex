// ==================== POKEMON MODAL ====================
// Modal completo - refatorado e organizado

window.SEIRA_POKEMON_MODAL = {
    async render(pokemon) {
        const moves = await SEIRA_API.load('moves');
        const abilities = await SEIRA_API.load('abilities');
        const items = await SEIRA_API.load('items');
        const allPokemon = await SEIRA_API.load('pokemon');
        const maps = await SEIRA_API.load('maps');
        const objects = await SEIRA_API.load('objects');

        // Determinar tipo de forma
        const formType = pokemon.form_type || 'base';
        const isMega = formType === 'mega';
        const isGigantamax = formType === 'gigantamax';
        const isAesthetic = formType === 'aesthetic';

        // Buscar forma base se for Gigantamax (para puxar dados)
        let basePokemon = pokemon;
        if (isGigantamax && pokemon.form_of) {
            basePokemon = allPokemon.find(p => p.id === pokemon.form_of) || pokemon;
        }

        // Renderizar seções baseado no tipo
        const section1 = this.renderBasicInfo(isGigantamax ? basePokemon : pokemon);
        const section2 = this.renderDexEntry(pokemon);
        const section3 = (!isAesthetic && !isGigantamax) ? this.renderStats(pokemon) : '';
        const section4 = (isMega && !isAesthetic && !isGigantamax) ? this.renderAbilities(pokemon, abilities) : '';
        const section5 = (!isMega && !isAesthetic && !isGigantamax) ? this.renderBreeding(pokemon) : '';
        const sectionProducer = (!isMega && !isAesthetic && !isGigantamax) ? this.renderProducerInfo(pokemon, items) : '';
        const sectionGmax = isGigantamax ? this.renderGmaxMove(pokemon) : '';
        const section6 = (!isMega && !isAesthetic && !isGigantamax) ? this.renderMovesetByLevel(pokemon, moves) : '';
        const section7 = (!isMega && !isAesthetic && !isGigantamax) ? this.renderLearnableMoves(pokemon, moves) : '';
        const section8 = (!isMega && !isAesthetic && !isGigantamax) ? this.renderEggMoves(pokemon, moves) : '';
        const section9 = (!isMega && !isAesthetic && !isGigantamax) ? await window.SEIRA_POKEMON_EVOLUTION.render(pokemon, allPokemon, items) : '';
        const section10 = await window.SEIRA_POKEMON_FORMS.render(pokemon, allPokemon);
        const section11 = (!isMega && !isAesthetic && !isGigantamax) ? await window.SEIRA_POKEMON_LOCATIONS.render(pokemon, maps, objects) : '';
        const sectionDrops = (!isMega && !isAesthetic && !isGigantamax) ? this.renderHeldItems(pokemon, items) : '';

        return `
            <div class="pokemon-modal-content">
        ${section1}
        ${section2}
        ${section3}
        ${section4}
        ${section5}
        ${sectionProducer}
        ${sectionGmax}
        ${section6}
        ${section7}
        ${section8}
        ${section9}
        ${section10}
        ${section11}
        ${sectionDrops}
    </div>
        `;
    },

    // ==================== SEÇÃO 1: INFORMAÇÕES BÁSICAS ====================
    renderBasicInfo(pokemon) {
        const types = this.renderTypes(pokemon.types || []);
        const totalStats = this.calculateTotalStats(pokemon.stats || {});

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-info-circle"></i> Informações Básicas
                </h3>
                
                <div class="basic-info-layout">
                    <!-- Imagem à esquerda (MAIOR) -->
                    <div class="pokemon-artwork-large">
                        <img src="${pokemon.artwork}" alt="${pokemon.name}" />
                    </div>
                    
                    <!-- Grid de informações à direita (2x3) -->
                    <div class="info-grid-large">
                        <!-- Linha 1 -->
                        <div class="info-item">
                            <span class="info-label">Tipo</span>
                            <div class="info-value pokemon-types-inline">${types}</div>
                        </div>
                        
                        <div class="info-item">
                            <span class="info-label">Classificação</span>
                            <span class="info-value">${pokemon.classification || 'N/A'}</span>
                        </div>
                        
                        <div class="info-item">
                            <span class="info-label">Altura</span>
                            <span class="info-value">${pokemon.height || 0}m</span>
                        </div>
                        
                        <!-- Linha 2 -->
                        <div class="info-item">
                            <span class="info-label">Peso</span>
                            <span class="info-value">${pokemon.weight || 0}kg</span>
                        </div>
                        
                        <div class="info-item">
                            <span class="info-label">Base EXP</span>
                            <span class="info-value">${pokemon.base_experience || 0}</span>
                        </div>
                        
                        <div class="info-item">
                            <span class="info-label">Total de Status</span>
                            <span class="info-value">${totalStats}</span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    // ==================== SEÇÃO 2: DEX ENTRY ====================
    renderDexEntry(pokemon) {
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-book"></i> Dex Entry
                </h3>
                <p class="effect-text">${pokemon.dex_entry || 'Nenhuma descrição disponível.'}</p>
            </section>
        `;
    },

    // ==================== SEÇÃO GMAX: GMAX MOVE ====================
    renderGmaxMove(pokemon) {
        return `
        <section class="modal-section">
            <h3 class="modal-section-title">
                <i class="fas fa-bolt"></i> Gigantamax Move
            </h3>
            <p class="effect-text" style="font-style: italic; color: var(--white2);">
                <!-- TODO: GMax Move ainda não está disponível no JSON -->
                Informação em desenvolvimento
            </p>
        </section>
    `;
    },

    // ==================== SEÇÃO 3: STATUS BASE ====================
    renderStats(pokemon) {
        const stats = pokemon.stats || {};

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-chart-bar"></i> Status Base
                </h3>
                ${this.renderStatBars(stats)}
            </section>
        `;
    },

    renderTypes(types) {
        if (!types || types.length === 0) return '<span class="type-badge type-unknown">???</span>';
        return types.map(type => `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`).join('');
    },

    calculateTotalStats(stats) {
        return (stats.hp || 0) + (stats.attack || 0) + (stats.defense || 0) +
            (stats.special_attack || 0) + (stats.special_defense || 0) + (stats.speed || 0);
    },

    renderStatBars(stats) {
        const statsList = [
            { key: 'hp', label: 'HP', icon: 'fa-heart' },
            { key: 'attack', label: 'Ataque', icon: 'fa-gavel' },
            { key: 'defense', label: 'Defesa', icon: 'fa-shield-alt' },
            { key: 'special_attack', label: 'Atq. Esp.', icon: 'fa-star' },
            { key: 'special_defense', label: 'Def. Esp.', icon: 'fa-gem' },
            { key: 'speed', label: 'Velocidade', icon: 'fa-bolt' }
        ];

        return `
            <div class="stats-grid">
                ${statsList.map(stat => {
            const value = stats[stat.key] || 0;
            const percentage = Math.min((value / 255) * 100, 100);

            return `
                        <div class="stat-item">
                            <div class="stat-label">
                                <i class="fas ${stat.icon} stat-icon"></i>
                                <span class="stat-name">${stat.label}</span>
                                <span class="stat-value">${value}</span>
                            </div>
                            <div class="stat-bar-bg">
                                <div class="stat-bar-fill" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    },

    // ==================== SEÇÃO 4: HABILIDADES ====================
    renderAbilities(pokemon, abilities) {
        const normal = pokemon.abilities?.normal || [];
        const hidden = pokemon.abilities?.hidden || [];
        const exotic = pokemon.abilities?.exotic || [];

        const renderAbilityBadge = (abilityName, type) => {
            const badgeClass = type === 'normal' ? 'badge-normal' :
                type === 'hidden' ? 'badge-hidden' : 'badge-exotic';
            return `<span class="badge ${badgeClass} clickable" onclick="openAbilityModalByName('${abilityName}')">${SEIRA_FORMATTERS.capitalizeWords(abilityName)}</span>`;
        };

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-star"></i> Habilidades
                </h3>
                
                <div class="abilities-grid">
                    <div class="ability-column">
                        <span class="info-label">Normal</span>
                        ${normal.length > 0 ? normal.map(a => renderAbilityBadge(a, 'normal')).join('') : '<p class="empty-text">Nenhuma...</p>'}
                    </div>
                    
                    <div class="ability-column">
                        <span class="info-label">Oculta</span>
                        ${hidden.length > 0 ? hidden.map(a => renderAbilityBadge(a, 'hidden')).join('') : '<p class="empty-text">Nenhuma...</p>'}
                    </div>
                    
                    <div class="ability-column">
                        <span class="info-label">Exótica</span>
                        ${exotic.length > 0 ? exotic.map(a => renderAbilityBadge(a, 'exotic')).join('') : '<p class="empty-text">Nenhuma...</p>'}
                    </div>
                </div>
            </section>
        `;
    },

    // ==================== SEÇÃO 5: REPRODUÇÃO ====================
    renderBreeding(pokemon) {
        const eggGroups = pokemon.egg_groups || [];
        const gender = pokemon.gender || { male: 0, female: 0 };
        const canBreed = pokemon.can_breed ? 'Sim' : 'Não';

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-heart"></i> Reprodução
                </h3>
                
                <div class="breeding-grid">
                    <div class="info-item">
                        <span class="info-label">Grupos de Reprodução</span>
                        <span class="info-value">${eggGroups.join(', ') || 'Nenhum'}</span>
                    </div>
                    
                    <div class="breeding-column">
                        <span class="info-label">Taxa de Gênero</span>
                        <p>
                            <span class="badge badge-male">♂ ${gender.male}%</span>
                            <span class="badge badge-female">♀ ${gender.female}%</span>
                        </p>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Pode Reproduzir</span>
                        <span class="info-value">${canBreed}</span>
                    </div>
                </div>
            </section>
        `;
    },

    // ==================== SEÇÃO: PRODUTOR ====================
    renderProducerInfo(pokemon, items) {
        if (!pokemon.is_producer || !pokemon.production || pokemon.production.length === 0) {
            return '';
        }

        const productionHtml = pokemon.production.map(prod => {
            const item = items.find(i => i.id === prod.item_id);
            const sprite = item?.sprite || '';

            return `
                <div class="production-item" onclick="openItemModal(${prod.item_id})">
                    ${sprite ? `<img src="${sprite}" alt="${prod.item_name}" class="production-img" />` : '<i class="fas fa-box production-icon"></i>'}
                    <div class="production-info">
                        <span class="production-name">${SEIRA_FORMATTERS.capitalizeWords(prod.item_name)}</span>
                        ${prod.description ? `<span class="production-desc">${prod.description}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-industry"></i> Produção
                </h3>
                <div class="production-grid">
                    ${productionHtml}
                </div>
            </section>
        `;
    },

    // ==================== SEÇÃO 6: MOVESET POR LEVEL ====================
    renderMovesetByLevel(pokemon, moves) {
        const moveset = pokemon.moveset_by_level || [];

        if (moveset.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-level-up-alt"></i> Moveset Por Level
                    </h3>
                    <p class="empty-text">Nenhum golpe aprendido por level.</p>
                </section>
            `;
        }

        const movesHtml = moveset.map(entry => {
            const moveData = moves.find(m => m.name.toLowerCase() === entry.move.toLowerCase());
            const moveType = moveData?.type || 'normal';
            const level = entry.level === 0 ? 'Evo' : `Lv. ${entry.level}`;
            const moveName = SEIRA_FORMATTERS.capitalizeWords(entry.move);

            return `<div class="move ${moveType.toLowerCase()}">${moveName}<span class="move-level">${level}</span></div>`;
        }).join('');

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-level-up-alt"></i> Moveset Por Level
                </h3>
                <div class="tabpokemoves">
                    ${movesHtml}
                </div>
            </section>
        `;
    },

    // ==================== SEÇÃO 7: GOLPES APRENDÍVEIS ====================
    renderLearnableMoves(pokemon, moves) {
        const learnable = pokemon.learnable_moves || [];

        if (learnable.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-compact-disc"></i> Golpes Aprendíveis (TM/TR/Tutor)
                    </h3>
                    <p class="empty-text">Nenhum golpe aprendível.</p>
                </section>
            `;
        }

        const showSpoiler = learnable.length > 12;
        const visibleMoves = showSpoiler ? learnable.slice(0, 12) : learnable;
        const hiddenMoves = showSpoiler ? learnable.slice(12) : [];

        const visibleHtml = visibleMoves.map(moveName => {
            const moveData = moves.find(m => m.name.toLowerCase() === moveName.toLowerCase());
            const moveType = moveData?.type || 'normal';
            const capitalizedName = SEIRA_FORMATTERS.capitalizeWords(moveName);
            return `<div class="move ${moveType.toLowerCase()}">${capitalizedName}</div>`;
        }).join('');

        let hiddenHtml = '';
        if (showSpoiler) {
            const hiddenMovesHtml = hiddenMoves.map(moveName => {
                const moveData = moves.find(m => m.name.toLowerCase() === moveName.toLowerCase());
                const moveType = moveData?.type || 'normal';
                const capitalizedName = SEIRA_FORMATTERS.capitalizeWords(moveName);
                return `<div class="move ${moveType.toLowerCase()}">${capitalizedName}</div>`;
            }).join('');

            hiddenHtml = SEIRA_SPOILER.create(
                `Ver mais ${hiddenMoves.length} golpes`,
                `<div class="tabpokemoves">${hiddenMovesHtml}</div>`
            );
        }

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-compact-disc"></i> Golpes Aprendíveis (TM/TR/Tutor)
                </h3>
                <div class="tabpokemoves">
                    ${visibleHtml}
                </div>
                ${hiddenHtml}
            </section>
        `;
    },

    // ==================== SEÇÃO 8: EGG MOVES ====================
    renderEggMoves(pokemon, moves) {
        const eggMoves = pokemon.egg_moves || [];

        if (eggMoves.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-egg"></i> Egg Moves
                    </h3>
                    <p class="empty-text">Nenhum Egg Move.</p>
                </section>
            `;
        }

        const showSpoiler = eggMoves.length > 12;
        const visibleMoves = showSpoiler ? eggMoves.slice(0, 12) : eggMoves;
        const hiddenMoves = showSpoiler ? eggMoves.slice(12) : [];

        const visibleHtml = visibleMoves.map(moveName => {
            const moveData = moves.find(m => m.name.toLowerCase() === moveName.toLowerCase());
            const moveType = moveData?.type || 'normal';
            const capitalizedName = SEIRA_FORMATTERS.capitalizeWords(moveName);
            return `<div class="move ${moveType.toLowerCase()}">${capitalizedName}</div>`;
        }).join('');

        let hiddenHtml = '';
        if (showSpoiler) {
            const hiddenMovesHtml = hiddenMoves.map(moveName => {
                const moveData = moves.find(m => m.name.toLowerCase() === moveName.toLowerCase());
                const moveType = moveData?.type || 'normal';
                const capitalizedName = SEIRA_FORMATTERS.capitalizeWords(moveName);
                return `<div class="move ${moveType.toLowerCase()}">${capitalizedName}</div>`;
            }).join('');

            hiddenHtml = SEIRA_SPOILER.create(
                `Ver mais ${hiddenMoves.length} golpes`,
                `<div class="tabpokemoves">${hiddenMovesHtml}</div>`
            );
        }

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-egg"></i> Egg Moves
                </h3>
                <div class="tabpokemoves">
                    ${visibleHtml}
                </div>
                ${hiddenHtml}
            </section>
        `;
    },

    // ==================== SEÇÃO: HELD ITEMS / DROPS ====================
    renderHeldItems(pokemon, items) {
        const heldItems = pokemon.held_items || [];

        if (heldItems.length === 0) {
            return '';
        }

        const itemsHtml = heldItems.map(held => {
            const item = items.find(i => i.id === held.item_id);
            const sprite = item?.sprite || `https://www.serebii.net/itemdex/sprites/${held.item_name.toLowerCase().replace(/ /g, '')}.png`;

            return `
                <div class="held-item-card" onclick="openItemModal(${held.item_id})">
                    <div class="held-item-image">
                        <img src="${sprite}" 
                             alt="${held.item_name}" 
                             onerror="this.src='https://via.placeholder.com/40x40?text=?'" />
                    </div>
                    <div class="held-item-info">
                        <span class="held-item-name">${SEIRA_FORMATTERS.capitalizeWords(held.item_name)}</span>
                        <span class="drop-rate">${held.rarity}%</span>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-gift"></i> Dropado Quando Derrotado (${heldItems.length})
                </h3>
                <div class="held-items-grid">
                    ${itemsHtml}
                </div>
            </section>
        `;
    }
};

/**
 * Abre modal completo de Pokemon
 */
async function openPokemonModal(pokemonId) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    const allPokemon = await SEIRA_API.load('pokemon');
    const pokemon = allPokemon.find(p => p.id === pokemonId);

    if (!pokemon) {
        console.error('Pokémon não encontrado:', pokemonId);
        return;
    }

    // Renderiza o conteúdo do modal
    const content = await window.SEIRA_POKEMON_MODAL.render(pokemon);

    // Define o título COM ARTWORK DO POKEMON
    const dexNumber = pokemon.id >= 2000 && pokemon.form_of
        ? String(pokemon.form_of).padStart(3, '0')
        : String(pokemon.id).padStart(3, '0');

    const actualId = pokemon.id >= 2000 ? ` [ID: ${pokemon.id}]` : '';

    modalTitle.innerHTML = `
        <img src="${pokemon.artwork}" alt="${pokemon.name}" class="modal-title-icon pokemon-icon">
        #${dexNumber}${actualId} - ${pokemon.name}
    `;

    SEIRA_MODAL.addShareButton('pokemon', pokemonId);

    modalBody.innerHTML = content;
    modal.classList.add('active');
}

console.log('✅ Pokemon Modal carregado');