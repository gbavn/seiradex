// ==================== MAP COMPONENT (ALPINE.JS) ====================

function seiraMapComponent() {
    return {
        // Data
        allMaps: [],
        loading: true,
        currentPage: 1,
        itemsPerPage: 24,
        activeView: 'interactive', // Controla qual view está ativa

        // Filtros
        filters: {
            search: '',
            type: '',
            biome: '',
            hasSpawns: false
        },

        // Opções
        typeOptions: [
            { value: 'city', label: '🏙️ Cidade' },
            { value: 'route', label: '🛣️ Rota' },
            { value: 'landmark', label: '🏛️ Landmark' }
        ],

        biomeOptions: [
            { value: 'Urbano', label: '🏙️ Urbano' },
            { value: 'Campestre', label: '🌾 Campestre' },
            { value: 'Florestal', label: '🌲 Florestal' },
            { value: 'Lacustre', label: '💧 Lacustre' },
            { value: 'Litorâneo', label: '🏖️ Litorâneo' },
            { value: 'Montanhoso', label: '⛰️ Montanhoso' },
            { value: 'Deserto', label: '🏜️ Deserto' }
        ],

        // Init
        async init() {
            await this.loadMaps();

            // Inicializa mapa interativo
            await window.SEIRA_MAP_INTERACTIVE.init();
        },

        async loadMaps() {
            try {
                this.allMaps = await SEIRA_API.load('maps'); // ← API já retorna filtrado
                console.log(`✅ ${this.allMaps.length} mapas carregados`);
            } catch (error) {
                console.error('❌ Erro ao carregar mapas:', error);
            } finally {
                this.loading = false;
            }
        },

        // Computed: Filtered Maps
        get filteredMaps() {
            let filtered = [...this.allMaps];

            // Busca
            if (this.filters.search) {
                const search = this.filters.search.toLowerCase().trim();
                filtered = filtered.filter(map => {
                    const name = map.name.toLowerCase();
                    const id = map.id.toLowerCase();
                    const description = (map.description || '').toLowerCase();
                    return name.includes(search) || id.includes(search) || description.includes(search);
                });
            }

            // Tipo
            if (this.filters.type) {
                filtered = filtered.filter(m => m.type === this.filters.type);
            }

            // Bioma
            if (this.filters.biome) {
                filtered = filtered.filter(m => m.biome === this.filters.biome);
            }

            // Has Spawns
            if (this.filters.hasSpawns) {
                filtered = filtered.filter(m => {
                    const spawns = m.spawns || {};
                    return (spawns.common && spawns.common.length > 0) ||
                        (spawns.rare && spawns.rare.length > 0) ||
                        (spawns.epic && spawns.epic.length > 0);
                });
            }

            return filtered;
        },

        // Computed: Paginated Maps
        get paginatedMaps() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredMaps.slice(start, end);
        },

        // Computed: Pagination
        get totalPages() {
            return Math.ceil(this.filteredMaps.length / this.itemsPerPage);
        },

        get startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },

        get endIndex() {
            return Math.min(this.startIndex + this.itemsPerPage, this.filteredMaps.length);
        },

        get visiblePages() {
            const pages = [];
            const start = Math.max(1, this.currentPage - 2);
            const end = Math.min(this.totalPages, this.currentPage + 2);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            return pages;
        },

        get hasActiveFilters() {
            return this.filters.search || this.filters.type ||
                this.filters.biome || this.filters.hasSpawns;
        },

        // Methods
        createMapCard(map) {
            return window.SEIRA_MAP_CARD.render(map);
        },

        toggleHasSpawns() {
            this.filters.hasSpawns = !this.filters.hasSpawns;
            this.currentPage = 1;
        },

        clearFilters() {
            this.filters = {
                search: '',
                type: '',
                biome: '',
                hasSpawns: false
            };
            this.currentPage = 1;
        },

        // Pagination
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };
}

console.log('✅ Map Component (Alpine) carregado');