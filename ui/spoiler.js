// ==================== SPOILER ====================

const SEIRA_SPOILER = {
    /**
     * Cria um spoiler
     */
    create(label, content) {
        const id = 'spoiler-' + Math.random().toString(36).substr(2, 9);
        
        return `
            <div class="spoiler" id="${id}">
                <div class="spoiler-header" onclick="SEIRA_SPOILER.toggle('${id}')">
                    <i class="fas fa-chevron-right"></i>
                    <span>${label}</span>
                </div>
                <div class="spoiler-content">
                    ${content}
                </div>
            </div>
        `;
    },
    
    /**
     * Alterna visibilidade do spoiler
     */
    toggle(spoilerId) {
        const spoiler = document.getElementById(spoilerId);
        if (!spoiler) return;
        
        spoiler.classList.toggle('active');
        
        // Anima o ícone
        const icon = spoiler.querySelector('.spoiler-header i');
        if (icon) {
            if (spoiler.classList.contains('active')) {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-right');
            }
        }
    }
};

// Alias para compatibilidade (como era chamado antes)
const createSpoiler = SEIRA_SPOILER.create.bind(SEIRA_SPOILER);
const toggleSpoiler = SEIRA_SPOILER.toggle.bind(SEIRA_SPOILER);

console.log('✅ Spoiler carregado');