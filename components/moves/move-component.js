// ==================== MOVE COMPONENT (ALPINE.JS) ====================

function seiraMoveComponent() {
    return {
        // Data
        allMoves: [],
        loading: true,
        currentPage: 1,
        itemsPerPage: 24,

        // Filtros
        filters: {
            search: '',
            type: '',
            category: '',
            moveClass: '',
            modified: false
        },

        // Opções
        typeOptions: [
            'Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting',
            'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice',
            'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'
        ],

        categoryOptions: [
            { value: 'Physical', label: 'Physical' },
            { value: 'Special', label: 'Special' },
            { value: 'Status', label: 'Status' }
        ],

        moveClassOptions: [],

        // Init
        async init() {
            await this.loadMoves();
        },

        async loadMoves() {
            try {
                const allMoves = await SEIRA_API.load('moves');
                this.allMoves = allMoves; // ✅ ADICIONE ESTA LINHA

                // Extrair move_class únicos
                const classes = [...new Set(this.allMoves.map(m => m.move_class))];
                this.moveClassOptions = classes.map(c => ({
                    value: c,
                    label: SEIRA_FORMATTERS.capitalizeWords(c)
                }));

                console.log(`✅ ${this.allMoves.length} moves carregados`);
            } catch (error) {
                console.error('❌ Erro ao carregar moves:', error);
            } finally {
                this.loading = false;
            }
        },

        // Computed: Filtered Moves
        get filteredMoves() {
            let filtered = [...this.allMoves];

            // Busca
            if (this.filters.search) {
                const search = this.filters.search.toLowerCase().trim();
                filtered = filtered.filter(move => {
                    const name = move.name.toLowerCase();
                    return name.includes(search);
                });
            }

            // Tipo
            if (this.filters.type) {
                filtered = filtered.filter(m => m.type === this.filters.type);
            }

            // Categoria
            if (this.filters.category) {
                filtered = filtered.filter(m => m.category === this.filters.category);
            }

            // Move Class
            if (this.filters.moveClass) {
                filtered = filtered.filter(m => m.move_class === this.filters.moveClass);
            }

            // Modificado
            if (this.filters.modified) {
                filtered = filtered.filter(m => m.modified_for_rpg === true);
            }

            return filtered;
        },

        // Computed: Paginated Moves
        get paginatedMoves() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredMoves.slice(start, end);
        },

        // Computed: Pagination
        get totalPages() {
            return Math.ceil(this.filteredMoves.length / this.itemsPerPage);
        },

        get startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },

        get endIndex() {
            return Math.min(this.startIndex + this.itemsPerPage, this.filteredMoves.length);
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
                this.filters.category || this.filters.moveClass ||
                this.filters.modified;
        },

        // Methods
        createMoveCard(move) {
            return window.SEIRA_MOVE_CARD.render(move);
        },

        toggleModified() {
            this.filters.modified = !this.filters.modified;
            this.currentPage = 1;
        },

        clearFilters() {
            this.filters = {
                search: '',
                type: '',
                category: '',
                moveClass: '',
                modified: false
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

console.log('✅ Move Component (Alpine) carregado');
