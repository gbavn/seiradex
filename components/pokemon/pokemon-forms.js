// ==================== POKEMON FORMS ====================
// Componente para exibir formas alternativas

window.SEIRA_POKEMON_FORMS = {
    async render(pokemon, allPokemon) {
        // Buscar formas alternativas
        const forms = this.findAlternateForms(pokemon, allPokemon);

        if (!forms.base && forms.mega.length === 0 && forms.gigantamax.length === 0 &&
            forms.battle.length === 0 && forms.other.length === 0) {
            return `
                <section class="modal-section">
                    <h3 class="modal-section-title"><i class="fas fa-shapes"></i> Formas Alternativas</h3>
                    <p class="empty-text">Este Pokémon não possui formas alternativas.</p>
                </section>
            `;
        }

        const baseHtml = forms.base ? this.renderFormsCategory('Forma Base', [forms.base], 'base') : '';
        const megaHtml = this.renderFormsCategory('Mega Evoluções', forms.mega, 'mega');
        const gmaxHtml = this.renderFormsCategory('Gigantamax', forms.gigantamax, 'gigantamax');
        const battleHtml = this.renderFormsCategory('Formas de Batalha', forms.battle, 'battle');
        const otherHtml = this.renderFormsCategory('Variantes Regionais e Outras', forms.other, 'other');

        return `
    <section class="modal-section">
        <h3 class="modal-section-title"><i class="fas fa-shapes"></i> Formas Alternativas</h3>
        
        ${baseHtml}
        ${megaHtml}
        ${gmaxHtml}
        ${battleHtml}
        ${otherHtml}
    </section>
`;
    },

    findAlternateForms(pokemon, allPokemon) {
        // Buscar pelo ID da forma base
        const baseId = pokemon.base_form ? pokemon.id : pokemon.form_of;

        if (!baseId) {
            return { base: null, mega: [], gigantamax: [], battle: [], other: [] };
        }

        // Buscar forma base
        const baseForm = allPokemon.find(p => p.id === baseId && p.base_form === true);

        // Buscar formas alternativas
        const forms = allPokemon.filter(p => p.form_of === baseId && !p.base_form);

        return {
            base: baseForm,
            mega: forms.filter(f => f.form_type === 'mega'),
            gigantamax: forms.filter(f => f.form_type === 'gigantamax'),
            battle: forms.filter(f => f.form_type === 'battle'),
            other: forms.filter(f =>
                ['regional', 'variant', 'gender', 'aesthetic', 'exotic'].includes(f.form_type)
            )
        };
    },

    renderFormsCategory(title, forms, category) {
        if (forms.length === 0) return '';

        const formsHtml = forms.map(form => this.renderFormCard(form, category)).join('');

        return `
            <div class="forms-category">
                <h4 class="info-label">${title} (${forms.length})</h4>
                <div class="forms-grid">
                    ${formsHtml}
                </div>
            </div>
        `;
    },

    renderFormCard(form, category) {
        const dexNumber = form.form_of
            ? String(form.form_of).padStart(3, '0')
            : String(form.id).padStart(3, '0');

        // Tratamento especial para Gigantamax (sem stats)
        if (category === 'gigantamax') {
            return `
                <div class="form-card form-gigantamax" onclick="openPokemonModal(${form.id})">
                    <div class="form-image">
                        <img src="${form.artwork}" alt="${form.name}" />
                    </div>
                    <div class="form-info">
                        <span class="form-number">#${dexNumber} [ID: ${form.id}]</span>
                        <span class="form-name">${form.name}</span>
                        <span class="form-note"><!-- TODO: GMax Move --></span>
                    </div>
                </div>
            `;
        }

        // Card padrão para outras formas
        const types = this.renderTypes(form.types || []);
        const abilities = this.renderAbilities(form.abilities);

        return `
            <div class="form-card" onclick="openPokemonModal(${form.id})">
                <div class="form-image">
                    <img src="${form.artwork}" alt="${form.name}" />
                </div>
                <div class="form-info">
                    <span class="form-number">#${dexNumber} [ID: ${form.id}]</span>
                    <span class="form-name">${form.name}</span>
                    <div class="form-types">${types}</div>
                    ${abilities ? `<div class="form-abilities">${abilities}</div>` : ''}
                </div>
            </div>
        `;
    },

    renderTypes(types) {
        if (!types || types.length === 0) return '';
        return types.map(type => `<span class="type-badge type-${type.toLowerCase()}">${type}</span>`).join('');
    },

    renderAbilities(abilities) {
        if (!abilities) return '';

        const normal = (abilities.normal || []).map(a => ({ name: a, type: 'normal' }));
        const hidden = (abilities.hidden || []).map(a => ({ name: a, type: 'hidden' }));
        const exotic = (abilities.exotic || []).map(a => ({ name: a, type: 'exotic' }));

        const allAbilities = [...normal, ...hidden, ...exotic];

        if (allAbilities.length === 0) return '';

        return allAbilities.slice(0, 2).map(ability => {
            const badgeClass = ability.type === 'normal' ? 'badge-normal' :
                ability.type === 'hidden' ? 'badge-hidden' : 'badge-exotic';
            return `<span class="badge ${badgeClass}" style="font-size: 10px; padding: 4px 8px;">${SEIRA_FORMATTERS.capitalizeWords(ability.name)}</span>`;
        }).join('');
    }
};

console.log('✅ Pokemon Forms carregado');