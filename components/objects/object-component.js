// ==================== OBJECT COMPONENT (ALPINE.JS) ====================

function seiraObjectComponent() {
    return {
        // Data
        allObjects: [],
        loading: true,
        currentPage: 1,
        itemsPerPage: 24,

        // Filtros
        filters: {
            search: '',
            category: '',
            isRollable: null,  // null = todos, true = apenas rolláveis, false = apenas não-rolláveis
            gives: ''
        },

        // Opções
        categoryOptions: [
            { value: 'fishing_spot', label: '<i class="fas fa-fish"></i> Pesca' },
            { value: 'pickup', label: '<i class="fas fa-shopping-bag"></i> Pickup' },
            { value: 'generic', label: '<i class="fas fa-tree"></i> Genérico' },
            { value: 'berry_tree', label: '<i class="fas fa-apple-alt"></i> Berry' },
            { value: 'apricorn_tree', label: '<i class="fas fa-seedling"></i> Apricorn' }
        ],

        givesOptions: [
            { value: 'items_only', label: '<i class="fas fa-box"></i> Apenas Itens' },
            { value: 'pokemon_only', label: '<i class="fas fa-fist-raised"></i> Apenas Pokémon' },
            { value: 'pokemon_and_items', label: '<i class="fas fa-gift"></i> Ambos' }
        ],

        // Init
        async init() {
            await this.loadObjects();
        },

        async loadObjects() {
            try {
                const allObjects = await SEIRA_API.load('objects');
                this.allObjects = allObjects; // ✅ ADICIONE ESTA LINHA

                console.log(`✅ ${this.allObjects.length} objetos carregados`);
            } catch (error) {
                console.error('❌ Erro ao carregar objetos:', error);
            } finally {
                this.loading = false;
            }
        },

        // Computed: Filtered Objects
        get filteredObjects() {
            let filtered = [...this.allObjects];

            // Busca
            if (this.filters.search) {
                const search = this.filters.search.toLowerCase().trim();
                filtered = filtered.filter(obj => {
                    const name = obj.name.toLowerCase();
                    const id = obj.id.toLowerCase();
                    return name.includes(search) || id.includes(search);
                });
            }

            // Categoria
            if (this.filters.category) {
                filtered = filtered.filter(obj => obj.category === this.filters.category);
            }

            // Rollable
            if (this.filters.isRollable !== null) {
                filtered = filtered.filter(obj => obj.is_rollable === this.filters.isRollable);
            }

            // Gives
            if (this.filters.gives) {
                filtered = filtered.filter(obj => obj.roll_config?.gives === this.filters.gives);
            }

            return filtered;
        },

        // Computed: Paginated Objects
        get paginatedObjects() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredObjects.slice(start, end);
        },

        // Computed: Pagination
        get totalPages() {
            return Math.ceil(this.filteredObjects.length / this.itemsPerPage);
        },

        get startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },

        get endIndex() {
            return Math.min(this.startIndex + this.itemsPerPage, this.filteredObjects.length);
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
            return this.filters.search || this.filters.category ||
                this.filters.isRollable !== null || this.filters.gives;
        },

        // Methods
        createObjectCard(object) {
            return window.SEIRA_OBJECT_CARD.render(object);
        },

        // Toggles
        toggleRollable(value) {
            this.filters.isRollable = this.filters.isRollable === value ? null : value;
            this.currentPage = 1;
        },

        clearFilters() {
            this.filters = {
                search: '',
                category: '',
                isRollable: null,
                gives: ''
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

console.log('✅ Object Component (Alpine) carregado');