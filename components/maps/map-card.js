// ==================== MAP CARD ====================
// Renderiza cards visuais de mapas

window.SEIRA_MAP_CARD = {
    render(map) {
        const typeLabel = this.getTypeLabel(map.type);
        const biomeLabel = map.biome || 'Desconhecido';
        const spawnPreview = this.renderSpawnPreview(map.spawns);
        
        return `
            <div class="base-card map-card" onclick="openMapModal('${map.id}')">
                <!-- Map Image -->
                <div class="map-card-image">
                    ${map.map_image ? 
                        `<img src="${map.map_image}" alt="${map.name}" />` : 
                        '<div class="map-placeholder"><i class="fas fa-map"></i></div>'
                    }
                </div>
                
                <!-- Map Info -->
                <div class="map-card-content">
                    <h3 class="map-card-name">${map.name}</h3>
                    
                    <div class="map-card-badges">
                        ${typeLabel}
                        <span class="badge badge-biome">${biomeLabel}</span>
                    </div>
                    
                    <!-- Spawn Preview -->
                    ${spawnPreview}
                </div>
            </div>
        `;
    },
    
    getTypeLabel(type) {
        const labels = {
            'city': '<span class="badge badge-city"><i class="fas fa-city"></i> Cidade</span>',
            'route': '<span class="badge badge-route"><i class="fas fa-road"></i> Rota</span>',
            'landmark': '<span class="badge badge-landmark"><i class="fas fa-landmark"></i> Landmark</span>'
        };
        return labels[type] || '<span class="badge badge-secondary">Outro</span>';
    },
    
    renderSpawnPreview(spawns) {
        if (!spawns) return '';
        
        const allSpawns = [
            ...(spawns.common || []),
            ...(spawns.rare || []),
            ...(spawns.epic || [])
        ];
        
        if (allSpawns.length === 0) return '';
        
        const preview = allSpawns.slice(0, 3);
        const icons = preview.map(() => '<i class="fas fa-paw"></i>').join('');
        
        return `
            <div class="map-spawn-preview">
                <span class="map-spawn-label">Spawns:</span>
                <div class="map-spawn-icons">${icons}</div>
                ${allSpawns.length > 3 ? `<span class="map-spawn-more">+${allSpawns.length - 3}</span>` : ''}
            </div>
        `;
    }
};

console.log('✅ Map Card carregado');
