// ==================== SEIRA RPG DATABASE - ABILITY CARD ====================

/**
 * Cria um card de Ability
 * @param {Object} ability - Dados da ability
 * @returns {string} HTML do card
 */
function createAbilityCard(ability) {
    const badge = ability.modified_for_rpg 
        ? '<span class="badge badge-modified">MODIFICADO</span>'
        : '<span class="badge badge-original">ORIGINAL</span>';
    
    const effectPreview = ability.effect.length > 100 
        ? ability.effect.substring(0, 100) + '...'
        : ability.effect;
    
    return `
        <div class="base-card ability-card" onclick="openAbilityModal(${ability.id})">
            <div class="ability-card-header">
                <h3 class="ability-card-name">${SEIRA_FORMATTERS.capitalizeWords(ability.name)}</h3>
                ${badge}
            </div>
            <p class="ability-card-effect">${effectPreview}</p>
        </div>
    `;
}

console.log('✅ Ability Card carregado');