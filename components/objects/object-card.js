// ==================== OBJECT CARD ====================
// Renderiza cards visuais de objetos interativos

window.SEIRA_OBJECT_CARD = {
    render(object) {
        const icon = this.renderIcon(object.icon);
        const categoryBadge = this.getCategoryBadge(object.category);
        
        return `
            <div class="base-card object-card" onclick="openObjectModal('${object.id}')">
                <!-- Ícone -->
                <div class="object-icon">
                    ${icon}
                </div>
                
                <!-- Nome -->
                <h3 class="object-name">${object.name}</h3>
                
                <!-- Badge de Categoria -->
                <div class="object-footer">
                    ${categoryBadge}
                </div>
            </div>
        `;
    },
    
    renderIcon(iconName) {
        if (!iconName) {
            return '<i class="fas fa-cube"></i>';
        }
        return `<i class="fas fa-${iconName}"></i>`;
    },
    
    getCategoryBadge(category) {
        const badges = {
            'fishing_spot': '<span class="badge badge-primary"><i class="fas fa-fish"></i> Pesca</span>',
            'pickup': '<span class="badge badge-info"><i class="fas fa-shopping-bag"></i> Pickup</span>',
            'generic': '<span class="badge badge-secondary"><i class="fas fa-tree"></i> Genérico</span>',
            'berry_tree': '<span class="badge badge-berry"><i class="fas fa-apple-alt"></i> Berry</span>',
            'apricorn_tree': '<span class="badge badge-apricorn"><i class="fas fa-seedling"></i> Apricorn</span>'
        };
        return badges[category] || '<span class="badge badge-secondary"><i class="fas fa-question"></i> Outro</span>';
    }
};

console.log('✅ Object Card carregado');