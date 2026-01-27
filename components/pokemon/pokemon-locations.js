// ==================== POKEMON LOCATIONS ====================
// Componente para buscar onde o Pokémon é encontrado

window.SEIRA_POKEMON_LOCATIONS = {
    async render(pokemon, maps, objects) {
        const locations = this.findLocations(pokemon.id, maps, objects);
        
        if (locations.spawns.length === 0 && locations.objects.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title">
                        <i class="fas fa-map-marker-alt"></i> Onde Encontrar
                    </h3>
                    <p class="empty-text">Este Pokémon não aparece em nenhum local disponível.</p>
                </section>
            `;
        }
        
        const spawnsHtml = this.renderSpawns(locations.spawns);
        const objectsHtml = this.renderObjects(locations.objects);
        
        return `
            <section class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-map-marker-alt"></i> Onde Encontrar
                </h3>
                
                ${spawnsHtml}
                ${objectsHtml}
            </section>
        `;
    },
    
    findLocations(pokemonId, maps, objects) {
        const spawns = [];
        const objectLocations = [];
        
        // 1. Buscar em spawns de mapas (com validação)
        if (maps && Array.isArray(maps)) {
            maps.forEach(map => {
                ['common', 'rare', 'epic', 'special'].forEach(rarity => {
                    const raritySpawns = map.spawns?.[rarity] || [];
                    
                    if (raritySpawns.includes(pokemonId)) {
                        spawns.push({
                            mapId: map.id,
                            mapName: map.name,
                            mapType: map.type,
                            mapImage: map.map_image,
                            rarity: rarity,
                            forumLink: map.forum_link
                        });
                    }
                });
            });
        }
        
        // 2. Buscar em objetos interativos (com validação)
        if (objects && Array.isArray(objects)) {
            objects.forEach(obj => {
                if (!obj.roll_config?.pokemon) return;
                
                ['common', 'rare', 'epic', 'special'].forEach(rarity => {
                    const rarityPokemon = obj.roll_config.pokemon[rarity] || [];
                    
                    if (rarityPokemon.includes(pokemonId)) {
                        objectLocations.push({
                            objectId: obj.id,
                            objectName: obj.name,
                            objectCategory: obj.category,
                            rarity: rarity
                        });
                    }
                });
            });
        }
        
        return {
            spawns: spawns,
            objects: objectLocations
        };
    },
    
    renderSpawns(spawns) {
        if (spawns.length === 0) return '';
        
        const spawnsHtml = spawns.map(spawn => {
            const rarityLabel = this.getRarityLabel(spawn.rarity);
            const rarityClass = spawn.rarity;
            
            return `
                <div class="location-card-small">
                    ${spawn.mapImage ? 
                        `<div class="location-map-image">
                            <img src="${spawn.mapImage}" alt="${spawn.mapName}" />
                        </div>` : 
                        `<div class="location-icon"><i class="fas fa-map"></i></div>`
                    }
                    <div class="location-info">
                        <h4 class="location-name">${spawn.mapName}</h4>
                        <span class="location-rarity rarity-${rarityClass}">${rarityLabel}</span>
                    </div>
                    ${spawn.forumLink ? `<a href="${spawn.forumLink}" target="_blank" class="location-link"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            `;
        }).join('');
        
        return `
            <div class="locations-section">
                <h4 class="modal-section-subtitle">
                    <i class="fas fa-map"></i> Mapas (${spawns.length})
                </h4>
                <div class="locations-grid-small">
                    ${spawnsHtml}
                </div>
            </div>
        `;
    },
    
    renderObjects(objects) {
        if (objects.length === 0) return '';
        
        // Agrupar por tipo de objeto
        const grouped = {};
        objects.forEach(obj => {
            const category = obj.objectCategory || 'generic';
            if (!grouped[category]) grouped[category] = [];
            grouped[category].push(obj);
        });
        
        let html = `
            <div class="locations-section">
                <h4 class="modal-section-subtitle">
                    <i class="fas fa-cube"></i> Objetos Interativos
                </h4>
        `;
        
        for (const [category, items] of Object.entries(grouped)) {
            const categoryLabel = this.getCategoryLabel(category);
            
            html += `<div class="object-category">`;
            html += `<h5>${categoryLabel} (${items.length})</h5>`;
            html += `<div class="objects-list">`;
            
            items.forEach(obj => {
                const rarityLabel = this.getRarityLabel(obj.rarity);
                const rarityClass = obj.rarity;
                
                html += `
                    <div class="object-item">
                        <span class="object-name">${obj.objectName}</span>
                        <span class="object-rarity rarity-${rarityClass}">${rarityLabel}</span>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
        
        html += '</div>';
        
        return html;
    },
    
    getRarityLabel(rarity) {
        const labels = {
            'common': 'Comum',
            'rare': 'Raro',
            'epic': 'Épico',
            'special': 'Especial'
        };
        return labels[rarity] || rarity;
    },
    
    getCategoryLabel(category) {
        const labels = {
            'fishing_spot': '🎣 Pontos de Pesca',
            'generic': '🌳 Árvores e Plantas',
            'pickup': '👜 Pickup',
            'berry_tree': '🍒 Árvores de Berry',
            'apricorn_tree': '🍎 Árvores de Apricorn'
        };
        return labels[category] || category;
    }
};

console.log('✅ Pokemon Locations carregado');