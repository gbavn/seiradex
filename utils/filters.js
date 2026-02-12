// ==================== FILTROS ====================

const SEIRA_FILTERS = {
    /**
     * Filtra Pokémon
     */
    filterPokemon(pokemon, filters = {}) {
        let filtered = [...pokemon];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(search) ||
                p.id.toString().includes(search)
            );
        }

        if (filters.type) {
            filtered = filtered.filter(p => p.types.includes(filters.type));
        }

        if (filters.rarity) {
            filtered = filtered.filter(p => p.rarity === filters.rarity);
        }

        if (filters.form === 'base') {
            filtered = filtered.filter(p => p.base_form === true);
        } else if (filters.form === 'alternate') {
            filtered = filtered.filter(p => p.base_form === false);
        }

        if (filters.region) {
            filtered = filtered.filter(p => {
                const name = p.name.toLowerCase();
                return name.includes(filters.region.toLowerCase());
            });
        }

        if (filters.starter) {
            filtered = filtered.filter(p => p.is_starter === true);
        }

        if (filters.seira !== undefined && filters.seira !== '') {
            const seiraValue = filters.seira === 'true' || filters.seira === true;
            filtered = filtered.filter(p => p.in_seira_pokedex === seiraValue);
        }

        if (filters.producer) {
            filtered = filtered.filter(p => p.is_producer === true);
        }

        return filtered;
    },

    /**
     * Filtra Items
     */
    filterItems(items, filters = {}) {
        let filtered = [...items];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(i =>
                i.name.toLowerCase().includes(search) ||
                i.id.toString().includes(search)
            );
        }

        if (filters.category) {
            filtered = filtered.filter(i => i.category === filters.category);
        }

        // CORRIGIDO: Filtro de subcategoria
        if (filters.subcategory) {
            filtered = filtered.filter(i => i.subcategory === filters.subcategory);
        }

        if (filters.rarity) {
            filtered = filtered.filter(i => i.rarity === filters.rarity);
        }

        if (filters.craftable) {
            filtered = filtered.filter(i => i.is_craftable === true);
        }

        if (filters.forageable) {
            filtered = filtered.filter(i => i.forageable === true);
        }

        if (filters.book) {
            filtered = filtered.filter(i =>
                i.book_category ||
                (i.category === 'key-item' && i.unlocks_recipes)
            );
        }

        return filtered;
    },

    /**
     * Filtra Moves
     */
    filterMoves(moves, filters = {}) {
        let filtered = [...moves];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(m =>
                m.name.toLowerCase().includes(search)
            );
        }

        if (filters.type) {
            filtered = filtered.filter(m =>
                m.type.toLowerCase() === filters.type.toLowerCase()
            );
        }

        if (filters.category) {
            filtered = filtered.filter(m => m.category === filters.category);
        }

        if (filters.move_class) {
            filtered = filtered.filter(m => m.move_class === filters.move_class);
        }

        if (filters.modified) {
            filtered = filtered.filter(m => m.modified_for_rpg === true);
        }

        return filtered;
    },

    /**
     * Filtra Abilities
     */
    filterAbilities(abilities, filters = {}) {
        let filtered = [...abilities];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(a =>
                a.name.toLowerCase().includes(search)
            );
        }

        if (filters.modified) {
            filtered = filtered.filter(a => a.modified_for_rpg === true);
        }

        return filtered;
    },

    /**
     * Filtra Objects
     */
    filterObjects(objects, filters = {}) {
        let filtered = [...objects];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(o =>
                o.name.toLowerCase().includes(search) ||
                o.id.toLowerCase().includes(search)
            );
        }

        if (filters.type) {
            filtered = filtered.filter(o => o.type === filters.type);
        }

        return filtered;
    },

    /**
     * Filtra Maps (remove ocultos)
     */
    filterMaps(maps) {
        return maps.filter(map =>
            !SEIRA_CONFIG.HIDDEN_MAPS.includes(map.id)
        );
    }
};
