// ==================== MOVE MODAL ====================
// Modal completo de moves

window.SEIRA_MOVE_MODAL = {
    async render(move) {
        const pokemon = await SEIRA_API.load('pokemon');
        
        const section1 = this.renderInfo(move);
        const section2 = this.renderDescription(move);
        const section3 = this.renderEffect(move);
        const section4 = await this.renderPokemonList(move, pokemon);
        
        return `
            <div class="move-modal-content">
                ${section1}
                ${section2}
                ${section3}
                ${section4}
            </div>
        `;
    },
    
    // ==================== SEÇÃO 1: INFORMAÇÕES ====================
    renderInfo(move) {
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-info-circle"></i> Informações
                </h3>
                <div class="info-grid">
                    <div class="info-item-vertical">
                        <span class="info-label">Tipo</span>
                        <span class="info-value">
                            <span class="type-badge type-${move.type.toLowerCase()}">${move.type}</span>
                        </span>
                    </div>
                    <div class="info-item-vertical">
                        <span class="info-label">Categoria</span>
                        <span class="info-value">${move.category}</span>
                    </div>
                    <div class="info-item-vertical">
                        <span class="info-label">Poder</span>
                        <span class="info-value">${move.power || '—'}</span>
                    </div>
                    <div class="info-item-vertical">
                        <span class="info-label">Precisão</span>
                        <span class="info-value">${move.accuracy || '—'}</span>
                    </div>
                    <div class="info-item-vertical">
                        <span class="info-label">PP</span>
                        <span class="info-value">${move.pp}</span>
                    </div>
                    <div class="info-item-vertical">
                        <span class="info-label">Prioridade</span>
                        <span class="info-value">${move.priority}</span>
                    </div>
                    <div class="info-item-vertical">
                        <span class="info-label">Classe</span>
                        <span class="info-value">${SEIRA_FORMATTERS.capitalizeWords(move.move_class)}</span>
                    </div>
                    ${move.target ? `
                        <div class="info-item-vertical">
                            <span class="info-label">Alvo</span>
                            <span class="info-value">${move.target}</span>
                        </div>
                    ` : ''}
                </div>
            </section>
        `;
    },
    
    // ==================== SEÇÃO 2: DESCRIÇÃO ====================
    renderDescription(move) {
        if (!move.description) return '';
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-align-left"></i> Descrição
                </h3>
                <p class="effect-text">${move.description}</p>
            </section>
        `;
    },
    
    // ==================== SEÇÃO 3: EFEITO ====================
    renderEffect(move) {
        if (!move.effect) return '';
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-magic"></i> Efeito
                </h3>
                <p class="effect-text">${move.effect}</p>
            </section>
        `;
    },
    
    // ==================== SEÇÃO 4: POKÉMON QUE APRENDEM ====================
    async renderPokemonList(move, allPokemon) {
        const moveName = move.name.toLowerCase();
        
        // Buscar Pokémon que aprendem o golpe
        const learnedBy = allPokemon.filter(p => {
            // Moveset by level
            if (p.moveset_by_level && p.moveset_by_level.some(m => 
                m.move && m.move.toLowerCase() === moveName
            )) {
                return true;
            }
            
            // Learnable moves
            if (p.learnable_moves && p.learnable_moves.some(m => 
                m.toLowerCase() === moveName
            )) {
                return true;
            }
            
            // Egg moves
            if (p.egg_moves && p.egg_moves.some(m => 
                m.toLowerCase() === moveName
            )) {
                return true;
            }
            
            return false;
        });
        
        if (learnedBy.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-dragon"></i> Pokémon que Aprendem (0)
                    </h3>
                    <p class="empty-text">Nenhum Pokémon aprende este golpe.</p>
                </section>
            `;
        }
        
        // Primeiros 30
        const firstPokemon = learnedBy.slice(0, 30);
        const remainingPokemon = learnedBy.slice(30);
        
        const pokemonCards = firstPokemon.map(p => {
            const dexNumber = p.id >= 2000 && p.form_of 
                ? String(p.form_of).padStart(3, '0')
                : String(p.id).padStart(3, '0');
            
            return `
                <div class="pokemon-mini-card" onclick="openPokemonModal(${p.id})">
                    <img src="${p.artwork}" alt="${p.name}" class="pokemon-mini-img" />
                    <div class="pokemon-mini-info">
                        <span class="pokemon-mini-number">#${dexNumber}</span>
                        <span class="pokemon-mini-name">${p.name}</span>
                    </div>
                </div>
            `;
        }).join('');
        
        let spoilerHTML = '';
        if (remainingPokemon.length > 0) {
            const remainingCards = remainingPokemon.map(p => {
                const dexNumber = p.id >= 2000 && p.form_of 
                    ? String(p.form_of).padStart(3, '0')
                    : String(p.id).padStart(3, '0');
                
                return `
                    <div class="pokemon-mini-card" onclick="openPokemonModal(${p.id})">
                        <img src="${p.artwork}" alt="${p.name}" class="pokemon-mini-img" />
                        <div class="pokemon-mini-info">
                            <span class="pokemon-mini-number">#${dexNumber}</span>
                            <span class="pokemon-mini-name">${p.name}</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            spoilerHTML = SEIRA_SPOILER.create(
                `Ver mais ${remainingPokemon.length} Pokémon`,
                `<div class="pokemon-mini-grid">${remainingCards}</div>`
            );
        }
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-dragon"></i> Pokémon que Aprendem (${learnedBy.length})
                </h3>
                <div class="pokemon-mini-grid">
                    ${pokemonCards}
                </div>
                ${spoilerHTML}
            </section>
        `;
    }
};

/**
 * Abre modal de move
 */
async function openMoveModal(moveId) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    const allMoves = await SEIRA_API.load('moves');
    const move = allMoves.find(m => m.id === moveId);
    
    if (!move) {
        console.error('Move não encontrado:', moveId);
        return;
    }
    
    // Renderiza o conteúdo do modal
    const content = await window.SEIRA_MOVE_MODAL.render(move);
    
    // Define o título com ícone SVG
    modalTitle.innerHTML = `
        <img src="https://raw.githubusercontent.com/gbavn/Seira-Icons/main/Type%20Icons/${move.type}.svg" 
             class="modal-title-icon-svg" 
             alt="${move.type}"
             onerror="this.style.display='none'"
        />
        ${SEIRA_FORMATTERS.capitalizeWords(move.name)}
    `;
    
    SEIRA_MODAL.addShareButton('move', moveId);
    
    modalBody.innerHTML = content;
    modal.classList.add('active');
}

console.log('✅ Move Modal carregado');
