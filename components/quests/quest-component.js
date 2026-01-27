// ==================== QUEST COMPONENT (ALPINE.JS) ====================

function seiraQuestComponent() {
    return {
        // Data
        allQuests: [],
        loading: true,
        currentPage: 1,
        itemsPerPage: 24,
        
        // Filtros
        filters: {
            search: '',
            status: '',
            repeatable: null,
            hasRewards: false
        },
        
        // Opções
        statusOptions: [
            { value: 'available', label: '✅ Disponível' },
            { value: 'locked', label: '🔒 Bloqueada' },
            { value: 'completed', label: '⭐ Completa' }
        ],
        
        // Init
        async init() {
            await this.loadQuests();
        },
        
        async loadQuests() {
            try {
                const allQuests = await SEIRA_API.load('quests');
                // Filtrar quests escondidas (se necessário)
                this.allQuests = allQuests;
                console.log(`✅ ${this.allQuests.length} quests carregadas`);
            } catch (error) {
                console.error('❌ Erro ao carregar quests:', error);
            } finally {
                this.loading = false;
            }
        },
        
        // Computed: Filtered Quests
        get filteredQuests() {
            let filtered = [...this.allQuests];
            
            // Busca
            if (this.filters.search) {
                const search = this.filters.search.toLowerCase().trim();
                filtered = filtered.filter(quest => {
                    const name = quest.name.toLowerCase();
                    const id = quest.id.toLowerCase();
                    const requester = (quest.requester || '').toLowerCase();
                    return name.includes(search) || id.includes(search) || requester.includes(search);
                });
            }
            
            // Status
            if (this.filters.status) {
                filtered = filtered.filter(q => q.status === this.filters.status);
            }
            
            // Repeatable
            if (this.filters.repeatable !== null) {
                filtered = filtered.filter(q => q.repeatable === this.filters.repeatable);
            }
            
            // Has Rewards
            if (this.filters.hasRewards) {
                filtered = filtered.filter(q => 
                    q.rewards.money > 0 || 
                    (q.rewards.items && q.rewards.items.length > 0) ||
                    (q.rewards.pokemon && q.rewards.pokemon.length > 0)
                );
            }
            
            return filtered;
        },
        
        // Computed: Paginated Quests
        get paginatedQuests() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredQuests.slice(start, end);
        },
        
        // Computed: Pagination
        get totalPages() {
            return Math.ceil(this.filteredQuests.length / this.itemsPerPage);
        },
        
        get startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },
        
        get endIndex() {
            return Math.min(this.startIndex + this.itemsPerPage, this.filteredQuests.length);
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
            return this.filters.search || this.filters.status || 
                   this.filters.repeatable !== null || this.filters.hasRewards;
        },
        
        // Methods
        createQuestCard(quest) {
            return window.SEIRA_QUEST_CARD.render(quest);
        },
        
        // Toggles
        toggleRepeatable(value) {
            this.filters.repeatable = this.filters.repeatable === value ? null : value;
            this.currentPage = 1;
        },
        
        toggleHasRewards() {
            this.filters.hasRewards = !this.filters.hasRewards;
            this.currentPage = 1;
        },
        
        clearFilters() {
            this.filters = {
                search: '',
                status: '',
                repeatable: null,
                hasRewards: false
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

console.log('✅ Quest Component (Alpine) carregado');
