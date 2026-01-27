// ==================== MOVE CARD ====================
// Renderiza cards visuais de moves

window.SEIRA_MOVE_CARD = {
    render(move) {
        const badges = [];
        
        if (move.modified_for_rpg) {
            badges.push('<span class="badge badge-modified"><i class="fas fa-edit"></i> Modificado</span>');
        }
        
        badges.push(`<span class="badge badge-class">${move.move_class.toUpperCase()}</span>`);
        
        return `
            <div class="base-card move-card" onclick="openMoveModal(${move.id})">
                <!-- Type Icon -->
                <div class="move-type-icon">
                    <img src="https://raw.githubusercontent.com/gbavn/Seira-Icons/main/Type%20Icons/${move.type}.svg" 
                         alt="${move.type}"
                         onerror="this.style.display='none'"
                    />
                </div>
                
                <!-- Move Name -->
                <h3 class="move-name">${SEIRA_FORMATTERS.capitalizeWords(move.name)}</h3>
                
                <!-- Type Badge -->
                <div class="move-type-badge">
                    <span class="type-badge type-${move.type.toLowerCase()}">${move.type}</span>
                </div>
                
                <!-- Badges -->
                <div class="move-badges">
                    ${badges.join('')}
                </div>
                
                <!-- Stats Preview -->
                <div class="move-stats-preview">
                    <div class="move-stat">
                        <span class="move-stat-label">Categoria</span>
                        <span class="move-stat-value">${move.category}</span>
                    </div>
                    <div class="move-stat">
                        <span class="move-stat-label">Poder</span>
                        <span class="move-stat-value">${move.power || '—'}</span>
                    </div>
                    <div class="move-stat">
                        <span class="move-stat-label">Precisão</span>
                        <span class="move-stat-value">${move.accuracy || '—'}</span>
                    </div>
                </div>
            </div>
        `;
    }
};

console.log('✅ Move Card carregado');
