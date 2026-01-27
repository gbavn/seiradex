// ==================== SEIRA RPG DATABASE - SHOP COMPONENT ====================

/**
 * Componente Alpine.js para Lojas
 */
function seiraShopComponent(shopId) {
    return {
        // Estado
        loading: true,
        shopId: shopId,
        shopConfig: null,
        allItems: [],
        shopItems: [],
        currentPage: 1,
        perPage: 15,
        
        // Listas para filtros
        categories: [],
        subcategories: [],
        rarities: [],
        
        // Filtros
        filters: {
            search: '',
            category: '',
            subcategory: '',
            rarity: ''
        },
        
        // Inicialização
        async init() {
            // Carrega config da loja
            this.shopConfig = getShopConfig(this.shopId);
            if (!this.shopConfig) {
                console.error('Loja não encontrada:', this.shopId);
                this.loading = false;
                return;
            }
            
            // Carrega todos os itens
            this.allItems = await SEIRA_API.load('items');
            
            // Filtra apenas itens da loja
            const shopItemIds = getShopItemIds(this.shopId);
            this.shopItems = this.allItems.filter(item => 
                shopItemIds.includes(item.id) && 
                item.price[this.shopConfig.priceKey] > 0
            );
            
            this.loading = false;
            this.populateFilterLists();
        },
        
        // Popula listas de filtros
        populateFilterLists() {
            // Categorias únicas
            const cats = new Set();
            this.shopItems.forEach(item => {
                if (item.category) cats.add(item.category);
            });
            this.categories = Array.from(cats).sort();
            
            // Raridades únicas
            const rars = new Set();
            this.shopItems.forEach(item => {
                if (item.rarity) rars.add(item.rarity);
            });
            this.rarities = Array.from(rars).sort();
        },
        
        // Atualiza subcategorias
        updateSubcategories() {
            if (!this.filters.category) {
                this.subcategories = [];
                this.filters.subcategory = '';
                return;
            }
            
            const subs = new Set();
            this.shopItems.forEach(item => {
                if (item.category === this.filters.category && item.subcategory) {
                    subs.add(item.subcategory);
                }
            });
            this.subcategories = Array.from(subs).sort();
            this.filters.subcategory = '';
        },
        
        // Computed: Items filtrados
        get filteredItems() {
            let items = this.shopItems;
            
            // Busca por nome
            if (this.filters.search) {
                const search = this.filters.search.toLowerCase();
                items = items.filter(item => 
                    item.name.toLowerCase().includes(search)
                );
            }
            
            // Categoria
            if (this.filters.category) {
                items = items.filter(item => item.category === this.filters.category);
            }
            
            // Subcategoria
            if (this.filters.subcategory) {
                items = items.filter(item => item.subcategory === this.filters.subcategory);
            }
            
            // Raridade
            if (this.filters.rarity) {
                items = items.filter(item => item.rarity === this.filters.rarity);
            }
            
            return items;
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
        
        // Limpar filtros
        clearFilters() {
            this.filters = {
                search: '',
                category: '',
                subcategory: '',
                rarity: ''
            };
            this.subcategories = [];
            this.currentPage = 1;
        },
        
        // Detecta filtros ativos
        get hasActiveFilters() {
            return this.filters.search || 
                   this.filters.category || 
                   this.filters.subcategory || 
                   this.filters.rarity;
        }
    }
}

console.log('✅ Shop Component carregado');
