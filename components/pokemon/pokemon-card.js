// ==================== POKEMON CARD ====================
// Renderiza cards visuais de Pokémon com tipos, badges e informações

window.SEIRA_POKEMON_CARD = {
    render(pokemon) {
        const dexNumber = this.getDexNumber(pokemon);
        const types = this.renderTypes(pokemon.types || []);
        const badges = this.renderBadges(pokemon);
        const rarity = pokemon.rarity || 'comum';
        
        return `
            <div class="base-card pokemon-card" data-rarity="${rarity}" onclick="openPokemonModal(${pokemon.id})">
                <!-- ID -->
                <div class="pokemon-id">#${dexNumber}</div>
                
                <!-- Imagem -->
                <div class="pokemon-image">
                    <img src="${pokemon.artwork}" alt="${pokemon.name}" loading="lazy" />
                </div>
                
                <!-- Nome -->
                <h3 class="pokemon-name">${pokemon.name}</h3>
                
                <!-- Tipos -->
                <div class="pokemon-types">
                    ${types}
                </div>
                
                <!-- Badges -->
                ${badges ? `<div class="pokemon-badges">${badges}</div>` : ''}
            </div>
        `;
    },
    
    getDexNumber(pokemon) {
        // Se ID > 2000, mostrar número da forma base
        if (pokemon.id >= 2000 && pokemon.form_of) {
            return String(pokemon.form_of).padStart(3, '0');
        }
        return String(pokemon.id).padStart(3, '0');
    },
    
    renderTypes(types) {
        if (!types || types.length === 0) return '<span class="type-badge type-unknown">???</span>';
        
        return types.map(type => {
            const typeLower = type.toLowerCase();
            return `<span class="type-badge type-${typeLower}">${type}</span>`;
        }).join('');
    },
    
    renderBadges(pokemon) {
        const badges = [];
        
        // Starter
        if (pokemon.is_starter) {
            badges.push('<span class="badge badge-starter">Inicial</span>');
        }
        
        // Seira Dex
        if (pokemon.in_seira_pokedex) {
            badges.push('<span class="badge badge-seira">Seira</span>');
        }
        
        // Produtor
        if (pokemon.is_producer) {
            badges.push('<span class="badge badge-producer">Produtor</span>');
        }
        
        // Forma alternativa
        if (!pokemon.base_form) {
            const formType = this.getFormTypeLabel(pokemon.form_type);
            badges.push(`<span class="badge badge-form">${formType}</span>`);
        }
        
        return badges.join('');
    },
    
    getFormTypeLabel(formType) {
        const labels = {
            'mega': 'Mega',
            'gigantamax': 'Gigamax',
            'regional': 'Regional',
            'battle': 'Batalha',
            'gender': 'Gênero',
            'variant': 'Variante',
            'aesthetic': 'Estética',
            'exotic': 'Exótica'
        };
        return labels[formType] || 'Alternativa';
    }
};

console.log('✅ Pokemon Card carregado');