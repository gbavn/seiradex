// ==================== POKEMON EVOLUTION ====================
// Componente para buscar e renderizar cadeia evolutiva completa

window.SEIRA_POKEMON_EVOLUTION = {
    async render(pokemon, allPokemon, items) {
        const chain = await this.buildCompleteChain(pokemon, allPokemon);

        if (chain.length === 0) {
            return `
            <section class="modal-section">
                <h3 class="modal-section-title"><i class="fas fa-sync-alt"></i> Cadeia Evolutiva</h3>
                <p class="empty-text">Este Pokémon não possui evolução.</p>
            </section>
        `;
        }

        const chainHtml = this.renderChain(chain, items);

        return `
        <section class="modal-section">
            <h3 class="modal-section-title"><i class="fas fa-sync-alt"></i> Cadeia Evolutiva</h3>
            <div class="evolution-chain">
                ${chainHtml}
            </div>
        </section>
    `;
    },

    async buildCompleteChain(pokemon, allPokemon) {
        const chain = [];

        // 1. Buscar o início da cadeia (primeiro estágio)
        let current = pokemon;
        let preEvos = this.findPreEvolutions(current, allPokemon);

        while (preEvos.length > 0) {
            current = preEvos[0];
            preEvos = this.findPreEvolutions(current, allPokemon);
        }

        // 2. Construir cadeia a partir do início
        chain.push(current);

        let hasMoreEvolutions = true;
        while (hasMoreEvolutions) {
            const evolutions = current.evolves_to || [];

            if (evolutions.length === 0) {
                hasMoreEvolutions = false;
            } else {
                // Pegar todas as evoluções primárias
                const primaryEvos = evolutions.filter(e => e.method === 'primary');

                if (primaryEvos.length > 0) {
                    const nextStage = [];

                    for (const evo of primaryEvos) {
                        const nextPokemon = allPokemon.find(p =>
                            p.name.toLowerCase() === evo.pokemon.toLowerCase()
                        );

                        if (nextPokemon) {
                            nextStage.push({
                                pokemon: nextPokemon,
                                triggers: evo.triggers
                            });
                        }
                    }

                    if (nextStage.length > 0) {
                        chain.push(nextStage);

                        // Para casos como Eevee, não continuar após ramificações
                        if (nextStage.length > 1) {
                            hasMoreEvolutions = false;
                        } else {
                            // Continuar com a primeira evolução
                            current = nextStage[0].pokemon;
                        }
                    } else {
                        hasMoreEvolutions = false;
                    }
                } else {
                    hasMoreEvolutions = false;
                }
            }
        }

        return chain;
    },

    findPreEvolutions(pokemon, allPokemon) {
        return allPokemon.filter(p => {
            const evolutions = p.evolves_to || [];
            return evolutions.some(e =>
                e.pokemon.toLowerCase() === pokemon.name.toLowerCase()
            );
        });
    },

    renderChain(chain, items) {
        let html = '<div class="evolution-stages">';

        for (let i = 0; i < chain.length; i++) {
            const stage = chain[i];

            if (Array.isArray(stage)) {
                // Verificar se tem 4+ evoluções
                const hasManyEvolutions = stage.length >= 4;
                const wrapperClass = hasManyEvolutions ? 'evolution-branched-wrapper evolution-many' : 'evolution-branched-wrapper';

                // Ramificações: criar GRID de setas + cards
                html += `<div class="${wrapperClass}">`;

                stage.forEach(evo => {
                    html += '<div class="evolution-branch-row">';
                    html += this.renderEvolutionArrow(evo.triggers, items);
                    html += this.renderPokemonCard(evo.pokemon);
                    html += '</div>';
                });

                html += '</div>';
            } else {
                // Pokémon único
                html += '<div class="evolution-single">';
                html += this.renderPokemonCard(stage);
                html += '</div>';

                // Seta para o próximo (se não for ramificado)
                if (i < chain.length - 1 && !Array.isArray(chain[i + 1])) {
                    html += this.renderEvolutionArrow([], items);
                }
            }
        }

        html += '</div>';
        return html;
    },

    renderPokemonCard(pokemon) {
        const dexNumber = pokemon.id >= 2000 && pokemon.form_of
            ? String(pokemon.form_of).padStart(3, '0')
            : String(pokemon.id).padStart(3, '0');

        return `
            <div class="evolution-pokemon-card" onclick="openPokemonModal(${pokemon.id})">
                <div class="evolution-pokemon-image">
                    <img src="${pokemon.artwork}" alt="${pokemon.name}" />
                </div>
                <div class="evolution-pokemon-info">
                    <span class="evolution-pokemon-number">#${dexNumber}</span>
                    <span class="evolution-pokemon-name">${pokemon.name}</span>
                </div>
            </div>
        `;
    },

    renderEvolutionArrow(triggers, items) {
        const triggersHtml = this.renderTriggers(triggers, items);

        return `
            <div class="evolution-arrow">
                <div class="evolution-arrow-line"><i class="fas fa-arrow-right"></i></div>
                ${triggersHtml ? `<div class="evolution-triggers">${triggersHtml}</div>` : ''}
            </div>
        `;
    },

    renderTriggers(triggers, items) {
        if (!triggers || triggers.length === 0) return '';

        const parts = [];

        for (const trigger of triggers) {
            switch (trigger.type) {
                case 'level':
                    parts.push(`<span class="trigger-text">Level ${trigger.level}+</span>`);
                    break;

                case 'item':
                    console.log('🔍 Trigger:', trigger);
                    const item = items.find(i => i.id === trigger.item_id);
                    console.log('🔍 Item encontrado:', item);

                    if (item) {
                        console.log('✅ Sprite:', item.sprite);
                        parts.push(`
            <div class="trigger-item" onclick="event.stopPropagation(); openItemModal(${item.id})">
                <img src="${item.sprite}" alt="${item.name}" title="${item.name}" onerror="console.error('❌ Falha ao carregar:', '${item.sprite}')" />
                <span>${SEIRA_FORMATTERS.capitalizeWords(item.name)}</span>
            </div>
        `);
                    } else if (trigger.item_name) {
                        console.log('⚠️ Item não encontrado, usando item_name:', trigger.item_name);
                        parts.push(`<span class="trigger-text">${trigger.item_name}</span>`);
                    } else {
                        console.log('❌ Item não encontrado e sem item_name!');
                    }
                    break;

                case 'friendship':
                    parts.push(`<span class="trigger-text"><i class="fas fa-heart"></i> Amizade</span>`);
                    break;

                case 'trade':
                    parts.push(`<span class="trigger-text"><i class="fas fa-exchange-alt"></i> Troca</span>`);
                    break;

                case 'time':
                    const timeText = trigger.time === 'day' ? 'Dia' : 'Noite';
                    const timeIcon = trigger.time === 'day' ? 'fa-sun' : 'fa-moon';
                    parts.push(`<span class="trigger-text"><i class="fas ${timeIcon}"></i> ${timeText}</span>`);
                    break;

                case 'location':
                    parts.push(`<span class="trigger-text"><i class="fas fa-map-marker-alt"></i> ${trigger.location}</span>`);
                    break;

                case 'weather':
                    parts.push(`<span class="trigger-text"><i class="fas fa-cloud"></i> ${trigger.weather}</span>`);
                    break;

                case 'held_item':
                    parts.push(`<span class="trigger-text"><i class="fas fa-hand-holding"></i> Segurando item</span>`);
                    break;

                case 'move_learned':
                    parts.push(`<span class="trigger-text"><i class="fas fa-book"></i> Aprender ${SEIRA_FORMATTERS.capitalizeWords(trigger.move)}</span>`);
                    break;

                case 'gender':
                    const genderIcon = trigger.gender === 'male' ? '♂' : '♀';
                    const genderClass = trigger.gender === 'male' ? 'badge-male' : 'badge-female';
                    parts.push(`<span class="badge ${genderClass}">${genderIcon}</span>`);
                    break;

                case 'custom':
                    parts.push(`<span class="trigger-text">${trigger.description || 'Especial'}</span>`);
                    break;
            }
        }

        return parts.join(' + ');
    }
};

console.log('✅ Pokemon Evolution carregado');