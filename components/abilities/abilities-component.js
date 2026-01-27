// ==================== SEIRA RPG DATABASE - ABILITIES COMPONENT ====================

/**
 * Componente Alpine.js para Abilitydex
 */
function seiraAbilitiesComponent() {
    return {
        // Estado
        loading: true,
        allAbilities: [],
        currentPage: 1,
        perPage: 15,
        
        // Filtros
        filters: {
            search: '',
            modified: false
        },
        
        // Inicialização
        async init() {
            this.allAbilities = await SEIRA_API.load('abilities');
            this.loading = false;
        },
        
        // Computed: Abilities filtradas
        get filteredAbilities() {
            return SEIRA_FILTERS.filterAbilities(this.allAbilities, this.filters);
        },
        
        // Computed: Abilities paginadas
        get paginatedAbilities() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredAbilities.slice(start, start + this.perPage);
        },
        
        // Computed: Total de páginas
        get totalPages() {
            return Math.ceil(this.filteredAbilities.length / this.perPage);
        },
        
        // Computed: Índices
        get startIndex() {
            return (this.currentPage - 1) * this.perPage;
        },
        
        get endIndex() {
            return Math.min(this.startIndex + this.perPage, this.filteredAbilities.length);
        },
        
        // Computed: Páginas visíveis
        get visiblePages() {
            const pages = [];
            const start = Math.max(1, this.currentPage - 2);
            const end = Math.min(this.totalPages, this.currentPage + 2);
            for (let i = start; i <= end; i++) pages.push(i);
            return pages;
        },
        
        // Métodos: Navegação
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
        },
        
        goToPage(page) {
            this.currentPage = page;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        
        // Métodos: Filtros
        toggleModified() {
            this.filters.modified = !this.filters.modified;
            this.currentPage = 1;
        },
        
        clearFilters() {
            this.filters = {
                search: '',
                modified: false
            };
            this.currentPage = 1;
        }
    }
}

console.log('✅ Abilities Component carregado');