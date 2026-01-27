// ==================== SEIRA RPG DATABASE - ITEMS COMPONENT ====================

/**
 * Componente Alpine.js para Itemdex
 */
function seiraItemsComponent() {
    return {
        // Estado
        loading: true,
        allItems: [],
        currentPage: 1,
        perPage: 15,
        
        // Listas para selects
        categories: [],
        subcategories: [],
        rarities: [],
        
        // Filtros
        filters: {
            search: '',
            category: '',
            subcategory: '',
            rarity: '',
            craftable: false,
            forageable: false,
            book: false
        },
        
        // Inicialização
        async init() {
            this.allItems = await SEIRA_API.load('items');
            this.loading = false;
            
            // Popula listas para selects
            this.populateFilterLists();
        },
        
        // Popula listas únicas
        populateFilterLists() {
            // Categorias únicas
            const cats = new Set();
            this.allItems.forEach(item => {
                if (item.category) cats.add(item.category);
            });
            this.categories = Array.from(cats).sort();
            
            // Raridades únicas
            const rars = new Set();
            this.allItems.forEach(item => {
                if (item.rarity) rars.add(item.rarity);
            });
            this.rarities = Array.from(rars).sort();
        },
        
        // Atualiza subcategorias quando categoria muda
        updateSubcategories() {
            if (!this.filters.category) {
                this.subcategories = [];
                this.filters.subcategory = '';
                return;
            }
            
            const subs = new Set();
            this.allItems.forEach(item => {
                if (item.category === this.filters.category && item.subcategory) {
                    subs.add(item.subcategory);
                }
            });
            this.subcategories = Array.from(subs).sort();
            this.filters.subcategory = '';
        },
        
        // Computed: Items filtrados
        get filteredItems() {
            return SEIRA_FILTERS.filterItems(this.allItems, this.filters);
        },
        
        // Computed: Items paginados
        get paginatedItems() {
            const start = (this.currentPage - 1) * this.perPage;
            return this.filteredItems.slice(start, start + this.perPage);
        },
        
        // Computed: Total de páginas
        get totalPages() {
            return Math.ceil(this.filteredItems.length / this.perPage);
        },
        
        // Computed: Índices
        get startIndex() {
            return (this.currentPage - 1) * this.perPage;
        },
        
        get endIndex() {
            return Math.min(this.startIndex + this.perPage, this.filteredItems.length);
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
        toggleCraftable() {
            this.filters.craftable = !this.filters.craftable;
            this.currentPage = 1;
        },
        
        toggleForageable() {
            this.filters.forageable = !this.filters.forageable;
            this.currentPage = 1;
        },
        
        toggleBook() {
            this.filters.book = !this.filters.book;
            this.currentPage = 1;
        },
        
        clearFilters() {
            this.filters = {
                search: '',
                category: '',
                subcategory: '',
                rarity: '',
                craftable: false,
                forageable: false,
                book: false
            };
            this.subcategories = [];
            this.currentPage = 1;
        },
        
        // Detecta se algum filtro está ativo
        get hasActiveFilters() {
            return this.filters.search || 
                   this.filters.category || 
                   this.filters.subcategory || 
                   this.filters.rarity || 
                   this.filters.craftable || 
                   this.filters.forageable || 
                   this.filters.book;
        }
    }
}

console.log('✅ Items Component carregado');
