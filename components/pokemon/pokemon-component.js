// ==================== POKEMON COMPONENT (ALPINE.JS) ====================

function seiraPokemonComponent() {
    return {
        // Data
        allPokemon: [],
        loading: true,
        currentPage: 1,
        itemsPerPage: 24,

        // Filtros
        filters: {
            search: '',
            type: '',
            rarity: '',
            form: 'base',
            region: '',
            isStarter: false,
            seira: '',
            isProducer: false
        },

        // Opções
        typeOptions: [
            'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
            'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic',
            'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'
        ],
        rarityOptions: ['comum', 'raro', 'epico', 'especial'],
        regionOptions: [
            'Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova',
            'Kalos', 'Alola', 'Galar', 'Paldea', 'Seira'
        ],

        // Init
        async init() {
            await this.loadPokemon();
        },

        async loadPokemon() {
            try {
                this.allPokemon = await SEIRA_API.load('pokemon');
                console.log(`✅ ${this.allPokemon.length} Pokémon carregados`);
            } catch (error) {
                console.error('❌ Erro ao carregar Pokémon:', error);
            } finally {
                this.loading = false;
            }
        },

        // Computed: Filtered Pokemon
        get filteredPokemon() {
            let filtered = [...this.allPokemon];

            // Filtro de formas
            if (this.filters.form === 'base') {
                filtered = filtered.filter(p => p.base_form === true);
            } else if (this.filters.form === 'alternate') {
                filtered = filtered.filter(p => p.base_form === false);
            }

            // Busca
            if (this.filters.search) {
                const search = this.filters.search.toLowerCase().trim();
                filtered = filtered.filter(p => {
                    const name = p.name.toLowerCase();
                    const id = p.id.toString();
                    return name.includes(search) || id === search || `#${id}` === search;
                });
            }

            // Tipo
            if (this.filters.type) {
                filtered = filtered.filter(p =>
                    p.types && p.types.includes(this.filters.type)
                );
            }

            // Raridade
            if (this.filters.rarity) {
                filtered = filtered.filter(p => p.rarity === this.filters.rarity);
            }

            // Região
            if (this.filters.region) {
                filtered = filtered.filter(p =>
                    this.getPokemonRegion(p) === this.filters.region
                );
            }

            // Iniciais
            if (this.filters.isStarter) {
                filtered = filtered.filter(p => p.is_starter === true);
            }

            // Pokédex (Regional/Nacional)
            if (this.filters.seira !== '') {
                const seiraValue = this.filters.seira === 'true';
                filtered = filtered.filter(p => p.in_seira_pokedex === seiraValue);
            }

            // Produtores
            if (this.filters.isProducer) {
                filtered = filtered.filter(p => p.is_producer === true);
            }

            return filtered;
        },

        // Computed: Paginated Pokemon
        get paginatedPokemon() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredPokemon.slice(start, end);
        },

        // Computed: Pagination
        get totalPages() {
            return Math.ceil(this.filteredPokemon.length / this.itemsPerPage);
        },

        get startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },

        get endIndex() {
            return Math.min(this.startIndex + this.itemsPerPage, this.filteredPokemon.length);
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
            return this.filters.search || this.filters.type || this.filters.rarity ||
                this.filters.region || this.filters.isStarter ||
                this.filters.seira || this.filters.isProducer;
        },

        // Methods
        getPokemonRegion(pokemon) {
            const id = pokemon.id;
            const name = pokemon.name;

            // Formas regionais têm prioridade
            if (name.includes('Hisuian')) return 'Sinnoh';
            if (name.includes('Alolan')) return 'Alola';
            if (name.includes('Galarian')) return 'Galar';
            if (name.includes('Paldean')) return 'Paldea';
            if (name.includes('Seirian')) return 'Seira';

            // Ranges de ID
            if (id >= 1 && id <= 151) return 'Kanto';
            if (id >= 152 && id <= 251) return 'Johto';
            if (id >= 252 && id <= 386) return 'Hoenn';
            if (id >= 387 && id <= 493) return 'Sinnoh';
            if (id >= 494 && id <= 649) return 'Unova';
            if (id >= 650 && id <= 721) return 'Kalos';
            if (id >= 722 && id <= 809) return 'Alola';
            if (id >= 810 && id <= 905) return 'Galar';
            if (id >= 906 && id <= 1025) return 'Paldea';

            return 'Desconhecida';
        },

        createPokemonCard(pokemon) {
            return window.SEIRA_POKEMON_CARD.render(pokemon);
        },

        // Toggles
        toggleStarter() {
            this.filters.isStarter = !this.filters.isStarter;
            this.currentPage = 1;
        },

        toggleProducer() {
            this.filters.isProducer = !this.filters.isProducer;
            this.currentPage = 1;
        },

        clearFilters() {
            this.filters = {
                search: '',
                type: '',
                rarity: '',
                form: 'base',
                region: '',
                isStarter: false,
                seira: '',
                isProducer: false
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
