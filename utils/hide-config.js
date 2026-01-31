// ==================== HIDE & LOCK CONFIG ====================
// IDs que devem ser escondidos ou bloqueados em toda a database
// Editável manualmente - adicione IDs para esconder/bloquear conteúdo

window.SEIRA_HIDDEN = {
    // ==================== HIDDEN (Completamente ocultos) ====================
    
    // Mapas escondidos (não aparecem em lugar nenhum)
    maps: [
        // Exemplo: 'R07', 'SECRET_CAVE'
    ],
    
    // Objetos escondidos
    objects: [
        // Exemplo: 'HIDDEN_BERRY_TREE'
    ],
    
    // Itens escondidos
    items: [
        // Exemplo: 999, 1500
    ],
    
    // Pokémon escondidos
    pokemon: [
  10072, 10073, 10074, 10075, 10076,
  10077, 10078, 10079, 10080, 10081,
  10082, 10083, 10084, 10085, 10086,
  10087, 10088, 10092, 10093, 10094, 
  10551, 10552, 10553, 12015
],
    
    // Habilidades escondidas
    abilities: [
        310
    ],
    
    // Golpes escondidos
    moves: [
        920, 921
    ],
    
    // Quests escondidas
    quests: [
        1, 12,13,14,15,22
],
    
    // ==================== LOCKED (Visíveis mas bloqueados) ====================
    
    // Mapas bloqueados (aparecem no mapa interativo em cinza, não clicáveis)
    // NÃO aparecem em buscas, cards ou "onde encontrar"
    locked: {
        maps: [
            'R01', 'R02', 'R03', 'R08', 'R09', 'R10', 'R11', 'LUM', 'AZR', 'MTL', 'ARD', 'SLV', 'CRG', 'HBZ', 'VER', 'SAN', 'MTGL', 'PTVY', 'DSRT', 'SELV', 'VULC', 'ILHA', 'FLSB', 'BSQP'
        ]
    },
    
    // ==================== MÉTODOS ====================
    
    /**
     * Verifica se um ID está escondido (hidden)
     */
    isHidden(type, id) {
        const list = this[type] || [];
        return list.includes(id);
    },
    
    /**
     * Verifica se um ID está bloqueado (locked)
     */
    isLocked(type, id) {
        const list = this.locked[type] || [];
        return list.includes(id);
    },
    
    /**
     * Filtra array removendo escondidos E bloqueados
     * (Para listagens, cards, buscas - remove ambos)
     */
    filter(type, array) {
        if (!array || !Array.isArray(array)) return array;
        
        return array.filter(item => {
            const id = item.id || item;
            // Remove se estiver hidden OU locked
            return !this.isHidden(type, id) && !this.isLocked(type, id);
        });
    },
    
    /**
     * Filtra array removendo APENAS escondidos (mantém locked)
     * (Para mapa interativo - mostra locked em cinza)
     */
    filterOnlyHidden(type, array) {
        if (!array || !Array.isArray(array)) return array;
        
        return array.filter(item => {
            const id = item.id || item;
            // Remove APENAS se estiver hidden
            return !this.isHidden(type, id);
        });
    },
    
    /**
     * Filtra relacionamentos (spawns, evoluções, etc)
     * Remove referências a itens ocultos E bloqueados
     */
    filterRelationships(data, type) {
        if (!data || typeof data !== 'object') return data;
        
        // Clona objeto para não modificar o original
        const filtered = JSON.parse(JSON.stringify(data));
        
        // Filtra spawns de pokémon em mapas
        if (type === 'maps' && filtered.spawns) {
            ['common', 'rare', 'epic'].forEach(rarity => {
                if (filtered.spawns[rarity]) {
                    filtered.spawns[rarity] = filtered.spawns[rarity]
                        .filter(pokemonId => !this.isHidden('pokemon', pokemonId) && !this.isLocked('pokemon', pokemonId));
                }
            });
        }
        
        // Filtra itens em shops/lojas
        if (filtered.shop_data) {
            if (filtered.shop_data.sells) {
                filtered.shop_data.sells = filtered.shop_data.sells
                    .filter(itemId => !this.isHidden('items', itemId) && !this.isLocked('items', itemId));
            }
            if (filtered.shop_data.buys) {
                filtered.shop_data.buys = filtered.shop_data.buys
                    .filter(itemId => !this.isHidden('items', itemId) && !this.isLocked('items', itemId));
            }
        }
        
        // Filtra linked_items e linked_pokemon (POIs)
        if (filtered.linked_items) {
            filtered.linked_items = filtered.linked_items
                .filter(itemId => !this.isHidden('items', itemId) && !this.isLocked('items', itemId));
        }
        if (filtered.linked_pokemon) {
            filtered.linked_pokemon = filtered.linked_pokemon
                .filter(pokemonId => !this.isHidden('pokemon', pokemonId) && !this.isLocked('pokemon', pokemonId));
        }
        
        // Filtra rewards de quests
        if (filtered.rewards) {
            if (filtered.rewards.items) {
                filtered.rewards.items = filtered.rewards.items
                    .filter(itemId => !this.isHidden('items', itemId) && !this.isLocked('items', itemId));
            }
            if (filtered.rewards.pokemon) {
                filtered.rewards.pokemon = filtered.rewards.pokemon
                    .filter(pokemonId => !this.isHidden('pokemon', pokemonId) && !this.isLocked('pokemon', pokemonId));
            }
        }
        
        // Filtra evoluções de pokémon
        if (filtered.evolutions) {
            filtered.evolutions = filtered.evolutions
                .filter(evo => !this.isHidden('pokemon', evo.evolves_to) && !this.isLocked('pokemon', evo.evolves_to));
        }
        
        return filtered;
    }
};

console.log('✅ Hide & Lock Config carregado');
