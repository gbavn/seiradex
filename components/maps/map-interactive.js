// ==================== MAP INTERACTIVE - COM SUPORTE A LOCKED ====================
// Funcionalidade de mapa interativo com markers clicáveis e suporte a locked

window.SEIRA_MAP_INTERACTIVE = {
    initialized: false,
    currentMaps: [],
    
    // URLs dos ícones SVG customizados
    ICONS: {
        city: 'https://raw.githubusercontent.com/gbavn/Seira-Icons/refs/heads/main/City.svg',
        landmark: 'https://raw.githubusercontent.com/gbavn/Seira-Icons/refs/heads/main/Landmark.svg'
    },
    
    /**
     * Inicializa o sistema de mapa interativo
     */
    async init() {
        console.log('🗺️ Inicializando mapa interativo...');
        
        // ✨ USA loadForMap para pegar locked também
        this.currentMaps = await SEIRA_API.loadForMap('maps');
        
        await this.render();
        
        this.initialized = true;
        console.log('✅ Mapa interativo carregado');
    },
    
    /**
     * Renderiza o mapa interativo completo
     */
    async render() {
        const container = document.getElementById('map-markers');
        if (!container) {
            console.warn('⚠️ Container #map-markers não encontrado');
            return;
        }
        
        container.innerHTML = '';
        
        this.currentMaps.forEach(map => {
            const marker = this.createMarker(map);
            container.appendChild(marker);
        });
        
        console.log(`✅ ${this.currentMaps.length} markers renderizados`);
    },
    
    /**
     * Cria um marker no mapa
     */
    createMarker(map) {
        const marker = document.createElement('div');
        
        // Classes base
        marker.className = `map-marker ${map.type}`;
        
        // ✨ Verifica se está locked (apenas se NÃO estiver em modo admin)
        const isLocked = !SEIRA_API.adminMode && window.SEIRA_HIDDEN.isLocked('maps', map.id);
        if (isLocked) {
            marker.classList.add('locked');
        }
        
        // Adiciona classe 'maritime' se for rota marítima
        if (map.type === 'route' && this.isMaritimeRoute(map)) {
            marker.classList.add('maritime');
        }
        
        // Posicionamento
        marker.style.left = `${map.coordinates.x}%`;
        marker.style.top = `${map.coordinates.y}%`;
        marker.title = isLocked ? `${map.name} (Bloqueado)` : map.name;
        
        // Renderiza conteúdo do marker
        if (map.type === 'city') {
            // Cidade: ícone SVG customizado
            const img = document.createElement('img');
            img.src = this.ICONS.city;
            img.alt = map.name;
            marker.appendChild(img);
            
        } else if (map.type === 'landmark') {
            // Landmark: ícone SVG customizado
            const img = document.createElement('img');
            img.src = this.ICONS.landmark;
            img.alt = map.name;
            marker.appendChild(img);
            
        } else if (map.type === 'route') {
            // Rota: bolinha com número
            const routeNum = map.name.match(/\d+/);
            if (routeNum) {
                marker.textContent = routeNum[0];
            } else {
                marker.innerHTML = '<i class="fas fa-road"></i>';
            }
        }
        
        // Adiciona evento de clique APENAS se não estiver locked
        if (!isLocked) {
            marker.addEventListener('click', () => {
                openMapModal(map.id);
            });
        } else {
            // Locked: mostra mensagem ao tentar clicar
            marker.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLockedMessage(map.name);
            });
        }
        
        return marker;
    },
    
    /**
     * Mostra mensagem quando tenta clicar em marker locked
     */
    showLockedMessage(mapName) {
        // Cria tooltip temporário
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(231, 76, 60, 0.95);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            animation: fadeInOut 2s ease;
        `;
        tooltip.innerHTML = `🔒 ${mapName} está bloqueado`;
        
        // Adiciona animação
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(tooltip);
        
        // Remove após 2s
        setTimeout(() => {
            tooltip.remove();
            style.remove();
        }, 2000);
    },
    
    /**
     * Verifica se uma rota é marítima (baseado no bioma)
     */
    isMaritimeRoute(map) {
        const maritimeBiomes = ['Marinho'];
        return maritimeBiomes.includes(map.biome);
    },
    
    /**
     * Filtra markers por tipo
     */
    filterByType(type) {
        const markers = document.querySelectorAll('.map-marker');
        
        markers.forEach(marker => {
            if (type === '' || marker.classList.contains(type)) {
                marker.style.display = 'flex';
            } else {
                marker.style.display = 'none';
            }
        });
    },
    
    /**
     * Filtra markers por bioma
     */
    async filterByBiome(biome) {
        const container = document.getElementById('map-markers');
        if (!container) return;
        
        container.innerHTML = '';
        
        let filtered = this.currentMaps;
        
        if (biome) {
            filtered = filtered.filter(m => m.biome === biome);
        }
        
        filtered.forEach(map => {
            const marker = this.createMarker(map);
            container.appendChild(marker);
        });
        
        console.log(`🔄 ${filtered.length} markers filtrados por bioma`);
    },
    
    /**
     * Atualiza markers com base nos filtros
     */
    async updateMarkers(typeFilter = '', biomeFilter = '') {
        const container = document.getElementById('map-markers');
        if (!container) return;
        
        container.innerHTML = '';
        
        let filtered = [...this.currentMaps];
        
        // Filtro de tipo
        if (typeFilter) {
            filtered = filtered.filter(m => m.type === typeFilter);
        }
        
        // Filtro de bioma
        if (biomeFilter) {
            filtered = filtered.filter(m => m.biome === biomeFilter);
        }
        
        filtered.forEach(map => {
            const marker = this.createMarker(map);
            container.appendChild(marker);
        });
        
        console.log(`🔄 ${filtered.length} markers atualizados`);
    },
    
    /**
     * Reseta todos os filtros e mostra todos os markers
     */
    resetFilters() {
        this.render();
    },
    
    /**
     * Centraliza o mapa em um marker específico
     */
    focusOnMarker(mapId) {
        const map = this.currentMaps.find(m => m.id === mapId);
        if (!map) return;
        
        const container = document.querySelector('.interactive-map-container');
        if (!container) return;
        
        // Calcula posição do marker
        const markerX = (map.coordinates.x / 100) * container.offsetWidth;
        const markerY = (map.coordinates.y / 100) * container.offsetHeight;
        
        // Centraliza o scroll
        container.scrollTo({
            left: markerX - (container.offsetWidth / 2),
            top: markerY - (container.offsetHeight / 2),
            behavior: 'smooth'
        });
        
        // Destaca o marker temporariamente
        const markers = document.querySelectorAll('.map-marker');
        markers.forEach(marker => {
            const markerMap = this.currentMaps.find(m => 
                marker.style.left === `${m.coordinates.x}%` &&
                marker.style.top === `${m.coordinates.y}%`
            );
            
            if (markerMap && markerMap.id === mapId && !marker.classList.contains('locked')) {
                marker.style.animation = 'marker-pulse 1.5s 3';
                setTimeout(() => {
                    marker.style.animation = '';
                }, 4500);
            }
        });
    }
};

console.log('✅ Map Interactive (com suporte a locked) carregado');