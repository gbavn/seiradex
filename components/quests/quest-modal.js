// ==================== QUEST MODAL ====================
// Modal completo de quests com todas as seções

window.SEIRA_QUEST_MODAL = {
    async render(quest) {
        const items = await SEIRA_API.load('items');
        const pokemon = await SEIRA_API.load('pokemon');
        const maps = await SEIRA_API.load('maps');
        const perks = await SEIRA_API.load('perks');
        
        const section1 = this.renderBasicInfo(quest);
        const section2 = this.renderDescription(quest);
        const section3 = this.renderObjective(quest);
        const section4 = this.renderRequirements(quest, items, pokemon, perks);
        const section5 = this.renderRewards(quest, items, pokemon);
        const section6 = await this.renderWhereFound(quest, maps);
        
        return `
            <div class="quest-modal-content">
                ${section1}
                ${section2}
                ${section3}
                ${section4}
                ${section5}
                ${section6}
            </div>
        `;
    },
    
    // ==================== SEÇÃO 1: INFORMAÇÕES BÁSICAS ====================
    renderBasicInfo(quest) {
        const statusLabel = this.getStatusLabel(quest.status);
        const repeatableLabel = quest.repeatable ? 
            `Sim (Cooldown: ${quest.cooldown_days} dias)` : 'Não';
        
        // ✅ Quest Type (5 categorias)
        const questTypeLabels = {
            'comum': '<span class="badge" style="background: #3498db;">Comum</span>',
            'global': '<span class="badge" style="background: #e74c3c;">Global</span>',
            'unica': '<span class="badge" style="background: #f39c12;">Única</span>',
            'personalizada': '<span class="badge" style="background: #9b59b6;">Personalizada</span>',
            'prova_valor': '<span class="badge" style="background: #16a085;">Prova de Valor</span>'
        };
        const questTypeLabel = questTypeLabels[quest.quest_type] || quest.quest_type;
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-info-circle"></i> Informações Básicas
                </h3>
                
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">ID</span>
                        <span class="info-value">${quest.id}</span>
                    </div>
                    
                    ${quest.requester ? `
                        <div class="info-item">
                            <span class="info-label">Solicitante</span>
                            <span class="info-value">${quest.requester}</span>
                        </div>
                    ` : ''}
                    
                    <div class="info-item">
                        <span class="info-label">Tipo</span>
                        <span class="info-value">${questTypeLabel}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Status</span>
                        <span class="info-value">${statusLabel}</span>
                    </div>
                    
                    <div class="info-item">
                        <span class="info-label">Repetível</span>
                        <span class="info-value">${repeatableLabel}</span>
                    </div>
                    
                    ${quest.assigned_character ? `
                        <div class="info-item">
                            <span class="info-label">Atribuída a</span>
                            <span class="info-value">${quest.assigned_character}</span>
                        </div>
                    ` : ''}
                </div>
            </section>
        `;
    },
    
    getStatusLabel(status) {
        const labels = {
            'available': '<span class="badge badge-success">Disponível</span>',
            'locked': '<span class="badge badge-danger">Bloqueada</span>',
            'completed': '<span class="badge badge-warning">Completa</span>'
        };
        return labels[status] || status;
    },
    
    // ==================== SEÇÃO 2: DESCRIÇÃO ====================
    renderDescription(quest) {
        if (!quest.description) return '';
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-align-left"></i> Descrição
                </h3>
                <p class="effect-text">${quest.description}</p>
            </section>
        `;
    },
    
    // ==================== SEÇÃO 3: OBJETIVOS ====================
    renderObjective(quest) {
        const objectives = quest.objectives || [];
        
        if (objectives.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-bullseye"></i> Objetivos
                    </h3>
                    <p class="empty-text">Nenhum objetivo especificado.</p>
                </section>
            `;
        }
        
        // ✅ Renderiza TODOS os objetivos
        const objectivesHtml = objectives.map((objective, index) => {
            const sheets = objective.pokemon_sheets || [];
            const sheetsHtml = sheets.length > 0 ? 
                SEIRA_SPOILER.create(
                    `Ver fichas dos adversários (${sheets.length})`,
                    sheets.map(sheet => `<div class="pokemon-sheet">${sheet}</div>`).join('')
                ) : '';
            
            const objectiveNumber = objectives.length > 1 ? `<strong>Objetivo ${index + 1}:</strong> ` : '';
            
            return `
                <div class="objective-info">
                    <span class="badge badge-battle">
                        <i class="fas fa-swords"></i> ${objective.type || 'Battle'}
                    </span>
                    <p class="effect-text">${objectiveNumber}${objective.description || 'Complete o objetivo'}</p>
                </div>
                ${sheetsHtml}
                ${index < objectives.length - 1 ? '<hr style="margin: 15px 0; border-color: var(--dark2);">' : ''}
            `;
        }).join('');
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-bullseye"></i> Objetivos
                </h3>
                ${objectivesHtml}
            </section>
        `;
    },
    
    // ==================== SEÇÃO 4: REQUISITOS ====================
    renderRequirements(quest, items, pokemon, perks) {
        const req = quest.requirements || {};
        
        // Level
        const levelHtml = req.level ? 
            `<div class="requirement-item">
                <i class="fas fa-level-up-alt"></i>
                <span>Nível Mínimo: <strong>${req.level}</strong></span>
            </div>` : '';
        
        // ✅ Completed Quests
        const completedQuests = req.completed_quests || [];
        const completedQuestsHtml = completedQuests.length > 0 ?
            `<div class="requirement-item">
                <i class="fas fa-check-circle"></i>
                <span>Quests Concluídas: <strong>${completedQuests.join(', ')}</strong></span>
            </div>` : '';
        
        // Pokemon
        const reqPokemon = req.pokemon || [];
        const pokemonHtml = reqPokemon.length > 0 ? 
            this.renderRequiredPokemon(reqPokemon, pokemon) : '';
        
        // Items
        const reqItems = req.items || [];
        const itemsHtml = reqItems.length > 0 ? 
            this.renderRequiredItems(reqItems, items) : '';
        
        // Perks
        const reqPerks = req.perks || { mode: 'all', perk_ids: [] };
        const perksHtml = reqPerks.perk_ids.length > 0 ? 
            this.renderRequiredPerks(reqPerks, perks) : '';
        
        // Custom
        const customHtml = (req.custom && 
                           ((Array.isArray(req.custom) && req.custom.length > 0) || 
                            (typeof req.custom === 'string' && req.custom.trim()))) ? 
            `<div class="requirement-custom">
                <i class="fas fa-exclamation-circle"></i>
                <p class="effect-text">${Array.isArray(req.custom) ? req.custom.join(', ') : req.custom}</p>
            </div>` : '';
        
        // ✅ Se não tem nada, retorna vazio ao invés de mostrar seção
        if (!levelHtml && !completedQuestsHtml && !pokemonHtml && !itemsHtml && !perksHtml && !customHtml) {
            return '';
        }
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-clipboard-check"></i> Requisitos
                </h3>
                <div class="requirements-container">
                    ${levelHtml}
                    ${completedQuestsHtml}
                    ${pokemonHtml}
                    ${itemsHtml}
                    ${perksHtml}
                    ${customHtml}
                </div>
            </section>
        `;
    },
    
    renderRequiredPokemon(reqPokemon, allPokemon) {
        const cards = reqPokemon.map(req => {
            const poke = allPokemon.find(p => p.id === req.pokemon_id);
            if (!poke) return '';
            
            return `
                <div class="required-pokemon-card" onclick="openPokemonModal(${poke.id})">
                    <img src="${poke.artwork}" alt="${poke.name}" class="required-pokemon-img" />
                    <div class="required-pokemon-info">
                        <span class="required-pokemon-name">${poke.name}</span>
                        <span class="required-pokemon-level">Lv. ${req.min_level}+</span>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="requirement-section">
                <h4 class="modal-section-subtitle">
                    <i class="fas fa-paw"></i> Pokémon Necessários (${reqPokemon.length})
                </h4>
                <div class="required-pokemon-grid">
                    ${cards}
                </div>
            </div>
        `;
    },
    
    renderRequiredItems(reqItems, allItems) {
        const cards = reqItems.map(req => {
            const item = allItems.find(i => i.id === req.item_id);
            if (!item) return '';
            
            const uniqueBadge = req.unique ? 
                '<span class="badge badge-unique" title="Não consome">🔄 Não Consome</span>' : '';
            
            return `
                <div class="required-item-card" onclick="openItemModal(${item.id})">
                    <img src="${item.sprite}" alt="${item.name}" class="required-item-img" />
                    <div class="required-item-info">
                        <span class="required-item-name">${SEIRA_FORMATTERS.capitalizeWords(item.name)}</span>
                        <span class="required-item-qty">x${req.quantity}</span>
                        ${uniqueBadge}
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="requirement-section">
                <h4 class="modal-section-subtitle">
                    <i class="fas fa-box"></i> Itens Necessários (${reqItems.length})
                </h4>
                <div class="required-items-grid">
                    ${cards}
                </div>
            </div>
        `;
    },
    
    renderRequiredPerks(reqPerks, allPerks) {
        // ✅ Transforma objeto de perks em array único
        let perksArray = [];
        if (allPerks && typeof allPerks === 'object') {
            // Junta todas as categorias em um único array
            Object.keys(allPerks).forEach(category => {
                if (Array.isArray(allPerks[category])) {
                    perksArray = perksArray.concat(allPerks[category]);
                }
            });
        }
        
        const mode = reqPerks.mode === 'all' ? 'Todas as Perks' : 'Qualquer uma das Perks';
        
        // ✅ Busca pelo ID e exibe o NOME
        const perksList = reqPerks.perk_ids.map(perkId => {
            const perk = perksArray.find(p => p.id === perkId);
            return perk ? perk.nome : perkId; // ✅ Usa "nome" ao invés de "name"
        }).join(', ');
        
        return `
            <div class="requirement-section">
                <h4 class="modal-section-subtitle">
                    <i class="fas fa-gem"></i> Perks Necessárias
                </h4>
                <div class="requirement-item">
                    <i class="fas fa-check-double"></i>
                    <span>${mode}: <strong>${perksList}</strong></span>
                </div>
            </div>
        `;
    },
    
    // ==================== SEÇÃO 5: RECOMPENSAS ====================
    renderRewards(quest, items, pokemon) {
        const rewards = quest.rewards || {};
        
        const statsHtml = this.renderRewardStats(rewards);
        const itemsHtml = (rewards.items && rewards.items.length > 0) ? 
            this.renderRewardItems(rewards.items, items) : '';
        const pokemonHtml = (rewards.pokemon && rewards.pokemon.length > 0) ? 
            this.renderRewardPokemon(rewards.pokemon, pokemon) : '';
        const customHtml = (rewards.custom && 
                           ((Array.isArray(rewards.custom) && rewards.custom.length > 0) || 
                            (typeof rewards.custom === 'string' && rewards.custom.trim()))) ? 
            `<div class="reward-custom">
                <i class="fas fa-gift"></i>
                <p class="effect-text">${Array.isArray(rewards.custom) ? rewards.custom.join(', ') : rewards.custom}</p>
            </div>` : '';
        
        // ✅ Se não tem nada, retorna vazio ao invés de mostrar seção
        if (!statsHtml && !itemsHtml && !pokemonHtml && !customHtml) {
            return '';
        }
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-gift"></i> Recompensas
                </h3>
                <div class="rewards-container">
                    ${statsHtml}
                    ${itemsHtml}
                    ${pokemonHtml}
                    ${customHtml}
                </div>
            </section>
        `;
    },
    
    renderRewardStats(rewards) {
        const money = rewards.money || 0;
        const fame = rewards.fame || 0;
        const exp = rewards.character_exp || 0;
        
        if (money === 0 && fame === 0 && exp === 0) return '';
        
        return `
            <div class="reward-stats">
                ${money > 0 ? `
                    <div class="reward-stat">
                        <i class="fas fa-coins"></i>
                        <span>₽ ${money.toLocaleString()}</span>
                    </div>
                ` : ''}
                
                ${fame > 0 ? `
                    <div class="reward-stat">
                        <i class="fas fa-star"></i>
                        <span>${fame} Fama</span>
                    </div>
                ` : ''}
                
                ${exp > 0 ? `
                    <div class="reward-stat">
                        <i class="fas fa-chart-line"></i>
                        <span>${exp} EXP</span>
                    </div>
                ` : ''}
            </div>
        `;
    },
    
    renderRewardItems(rewardItems, allItems) {
        const cards = rewardItems.map(reward => {
            const item = allItems.find(i => i.id === reward.item_id);
            if (!item) return '';
            
            return `
                <div class="reward-item-card" onclick="openItemModal(${item.id})">
                    <img src="${item.sprite}" alt="${item.name}" class="reward-item-img" />
                    <div class="reward-item-info">
                        <span class="reward-item-name">${SEIRA_FORMATTERS.capitalizeWords(item.name)}</span>
                        <span class="reward-item-qty">x${reward.quantity}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <div class="reward-section">
                <h4 class="modal-section-subtitle">
                    <i class="fas fa-box"></i> Itens (${rewardItems.length})
                </h4>
                <div class="reward-items-grid">
                    ${cards}
                </div>
            </div>
        `;
    },
    
    renderRewardPokemon(rewardPokemon, allPokemon) {
        const cards = rewardPokemon.map((reward, index) => {
            // ✅ Suporte aos 3 tipos: fixed, encounter, egg
            if (reward.type === 'fixed') {
                // Pokémon com ficha - mostrar em spoiler
                return `
                    <div class="reward-pokemon-fixed">
                        <div class="reward-pokemon-header">
                            <i class="fas fa-scroll"></i>
                            <span>Pokémon Fixo (ver ficha)</span>
                        </div>
                        ${SEIRA_SPOILER.create(
                            'Ver ficha completa',
                            `<div class="pokemon-sheet">${reward.sheet}</div>`
                        )}
                    </div>
                `;
            } else if (reward.type === 'encounter') {
                // Pokémon selvagem
                const poke = allPokemon.find(p => p.id === reward.pokemon_id);
                if (!poke) return '';
                
                const levelRange = reward.level_range || [1, 10];
                
                return `
                    <div class="reward-pokemon-card" onclick="openPokemonModal(${poke.id})">
                        <img src="${poke.artwork}" alt="${poke.name}" class="reward-pokemon-img" />
                        <div class="reward-pokemon-info">
                            <span class="badge badge-encounter">🌿 Encontro</span>
                            <span class="reward-pokemon-name">${poke.name}</span>
                            <span class="reward-pokemon-level">Lv. ${levelRange[0]}-${levelRange[1]}</span>
                        </div>
                    </div>
                `;
            } else if (reward.type === 'egg') {
                // Ovo
                const poke = allPokemon.find(p => p.id === reward.pokemon_id);
                if (!poke) return '';
                
                return `
                    <div class="reward-pokemon-card" onclick="openPokemonModal(${poke.id})">
                        <img src="${poke.artwork}" alt="${poke.name}" class="reward-pokemon-img" />
                        <div class="reward-pokemon-info">
                            <span class="badge badge-egg">🥚 Ovo</span>
                            <span class="reward-pokemon-name">${poke.name}</span>
                            ${reward.description ? `<span class="reward-pokemon-desc">${reward.description}</span>` : ''}
                        </div>
                    </div>
                `;
            }
            return '';
        }).filter(Boolean).join('');
        
        return `
            <div class="reward-section">
                <h4 class="modal-section-subtitle">
                    <i class="fas fa-paw"></i> Pokémon (${rewardPokemon.length})
                </h4>
                <div class="reward-pokemon-grid">
                    ${cards}
                </div>
            </div>
        `;
    },
    
    // ==================== SEÇÃO 6: ONDE ENCONTRADO ====================
    async renderWhereFound(quest, maps) {
        // Filtrar mapas escondidos
        const visibleMaps = window.SEIRA_HIDDEN.filter('maps', maps);
        
        // ✅ CORRIGIDO: Buscar mapas que contêm esta quest usando quest_ids
        const foundMaps = visibleMaps.filter(map => {
            const quests = map.quest_ids || [];
            return quests.includes(quest.id);
        });
        
        if (foundMaps.length === 0) {
            return '';
        }
        
        const mapsHtml = foundMaps.map(map => {
            const typeLabels = {
                'city': '<span class="badge" style="background: #3498db;"><i class="fas fa-city"></i> Cidade</span>',
                'route': '<span class="badge" style="background: #27ae60;"><i class="fas fa-road"></i> Rota</span>',
                'landmark': '<span class="badge" style="background: #9b59b6;"><i class="fas fa-mountain"></i> Landmark</span>'
            };
            const typeLabel = typeLabels[map.type] || `<span class="badge">${map.type}</span>`;
            
            return `
                <div class="where-found-card" onclick="openMapModal('${map.id}')">
                    <div class="where-found-image">
                        ${map.map_image ? 
                            `<img src="${map.map_image}" alt="${map.name}" />` : 
                            `<div class="where-found-placeholder">
                                <i class="fas fa-map" style="font-size: 48px; color: var(--white2);"></i>
                            </div>`
                        }
                    </div>
                    <div class="where-found-info">
                        <h4 class="where-found-name">${map.name}</h4>
                        ${typeLabel}
                    </div>
                </div>
            `;
        }).join('');
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-map-marker-alt"></i> Onde Encontrado
                </h3>
                <div class="where-found-grid">
                    ${mapsHtml}
                </div>
            </section>
        `;
    }
};

/**
 * Abre modal de quest
 */
async function openQuestModal(questId) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // ✅ Usa cache RAW para evitar filtrar quests locked/hidden
    let allQuests = SEIRA_STATE.cache.quests;
    
    if (!allQuests || allQuests.length === 0) {
        console.log('📥 Cache vazio, carregando quests...');
        allQuests = await SEIRA_API.load('quests');
    }
    
    // ✅ Busca quest (ID já é numérico)
    const quest = allQuests.find(q => q.id === questId);
    
    if (!quest) {
        console.error('Quest não encontrada:', questId);
        console.log('IDs disponíveis:', allQuests.map(q => q.id));
        return;
    }
    
    // Renderiza o conteúdo do modal
    const content = await window.SEIRA_QUEST_MODAL.render(quest);
    
    // Define o título
    modalTitle.innerHTML = `
        <i class="fas fa-scroll modal-title-icon-fa"></i>
        ${quest.name}
    `;
    
    SEIRA_MODAL.addShareButton('quest', questId);
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

console.log('✅ Quest Modal carregado');