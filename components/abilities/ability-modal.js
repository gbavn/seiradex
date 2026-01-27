// ==================== SEIRA RPG DATABASE - ABILITY MODAL ====================

/**
 * Abre modal completo de Ability
 */
async function openAbilityModal(abilityId) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    const allAbilities = await SEIRA_API.load('abilities');
    const ability = allAbilities.find(a => a.id === abilityId);
    
    if (!ability) {
        console.error('Ability não encontrada:', abilityId);
        return;
    }
    
    const allPokemon = await SEIRA_API.load('pokemon');
    
    // ==================== TÍTULO ====================
    modalTitle.innerHTML = `
        <i class="fas fa-star"></i> ${SEIRA_FORMATTERS.capitalizeWords(ability.name)}
    `;
    
    SEIRA_MODAL.addShareButton('ability', abilityId);
    
    // ==================== CONTEÚDO ====================
    
    // Badge de modificado
    const modifiedBadge = ability.modified_for_rpg 
        ? '<span class="badge badge-modified">MODIFICADO</span>'
        : '<span class="badge badge-original">ORIGINAL</span>';
    
    // Encontrar Pokémon com esta ability
    const pokemonWithAbility = {
        normal: [],
        hidden: [],
        exotic: []
    };
    
    allPokemon.forEach(p => {
        if (!p.abilities) return;
        
        // Normal abilities
        const normalAbilities = Array.isArray(p.abilities.normal) 
            ? p.abilities.normal 
            : (p.abilities.normal ? [p.abilities.normal] : []);
        
        if (normalAbilities.some(a => a.toLowerCase() === ability.name.toLowerCase())) {
            pokemonWithAbility.normal.push(p);
        }
        
        // Hidden abilities
        const hiddenAbilities = Array.isArray(p.abilities.hidden)
            ? p.abilities.hidden
            : (p.abilities.hidden ? [p.abilities.hidden] : []);
        
        if (hiddenAbilities.some(a => a.toLowerCase() === ability.name.toLowerCase())) {
            pokemonWithAbility.hidden.push(p);
        }
        
        // Exotic abilities
        const exoticAbilities = p.abilities.exotic || [];
        
        if (exoticAbilities.some(a => a.toLowerCase() === ability.name.toLowerCase())) {
            pokemonWithAbility.exotic.push(p);
        }
    });
    
    const totalPokemon = pokemonWithAbility.normal.length + 
                        pokemonWithAbility.hidden.length + 
                        pokemonWithAbility.exotic.length;
    
    // ==================== MONTA HTML ====================
    
    let content = `
        <!-- Informações Básicas -->
        <div class="modal-section">
            <h3 class="modal-section-title">
                <i class="fas fa-info-circle"></i> Informações
            </h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">ID</span>
                    <span class="info-value">#${ability.id}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Modificado para RPG</span>
                    <span class="info-value">${modifiedBadge}</span>
                </div>
            </div>
        </div>
        
        <!-- Efeito -->
        <div class="modal-section">
            <h3 class="modal-section-title">
                <i class="fas fa-magic"></i> Efeito
            </h3>
            <p class="effect-text">${ability.effect}</p>
        </div>
    `;
    
    // ==================== POKÉMON COM ESTA ABILITY ====================
    
    if (totalPokemon > 0) {
        content += `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-dragon"></i> Pokémon com esta Habilidade (${totalPokemon})
                </h3>
        `;
        
        // NORMAL
        if (pokemonWithAbility.normal.length > 0) {
            content += `
                <div class="ability-type-section">
                    <h4 class="ability-type-title">
                        <span class="badge badge-normal">Normal</span>
                        (${pokemonWithAbility.normal.length})
                    </h4>
                    <div class="pokemon-list-grid">
                        ${pokemonWithAbility.normal.map(p => `
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
        
        // HIDDEN
        if (pokemonWithAbility.hidden.length > 0) {
            content += `
                <div class="ability-type-section">
                    <h4 class="ability-type-title">
                        <span class="badge badge-hidden">Hidden</span>
                        (${pokemonWithAbility.hidden.length})
                    </h4>
                    <div class="pokemon-list-grid">
                        ${pokemonWithAbility.hidden.map(p => `
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
        
        // EXÓTICA
        if (pokemonWithAbility.exotic.length > 0) {
            content += `
                <div class="ability-type-section">
                    <h4 class="ability-type-title">
                        <span class="badge badge-exotic">Exótica</span>
                        (${pokemonWithAbility.exotic.length})
                    </h4>
                    <div class="pokemon-list-grid">
                        ${pokemonWithAbility.exotic.map(p => `
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
        
        content += `</div>`; // fecha modal-section
    } else {
        content += `
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-dragon"></i> Pokémon com esta Habilidade
                </h3>
                <p>Nenhum Pokémon possui esta habilidade no momento.</p>
            </div>
        `;
    }
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

/**
 * Busca ability por nome e abre modal
 * (Para quando clicar em ability no modal de Pokémon)
 */
async function openAbilityModalByName(abilityName) {
    const abilities = await SEIRA_API.load('abilities');
    const ability = abilities.find(a => a.name.toLowerCase() === abilityName.toLowerCase());
    
    if (ability) {
        openAbilityModal(ability.id);
    } else {
        alert(`Ability "${abilityName}" não encontrada.`);
    }
}

console.log('✅ Ability Modal carregado');