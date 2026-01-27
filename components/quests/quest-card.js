// ==================== QUEST CARD ====================
// Renderiza cards visuais de quests

window.SEIRA_QUEST_CARD = {
    render(quest) {
        const statusIcon = this.getStatusIcon(quest.status);
        const requesterInfo = quest.requester ? `<i class="fas fa-user"></i> ${quest.requester}` : '';
        const description = quest.description ? quest.description.substring(0, 150) + '...' : 'Sem descrição';
        
        // ✅ Cor da borda baseada no tipo (5 categorias)
        const borderColors = {
            'comum': '#3498db',
            'global': '#e74c3c',
            'unica': '#f39c12',
            'personalizada': '#9b59b6',
            'prova_valor': '#16a085'
        };
        const borderColor = borderColors[quest.quest_type] || '#3498db';
        
        // ✅ Badge do tipo
        const typeLabels = {
            'comum': '<span class="badge" style="background: #3498db;">Comum</span>',
            'global': '<span class="badge" style="background: #e74c3c;">Global</span>',
            'unica': '<span class="badge" style="background: #f39c12;">Única</span>',
            'personalizada': '<span class="badge" style="background: #9b59b6;">Personalizada</span>',
            'prova_valor': '<span class="badge" style="background: #16a085;">Prova de Valor</span>'
        };
        const typeLabel = typeLabels[quest.quest_type] || '';
        
        return `
            <div class="base-card quest-card" onclick="openQuestModal(${quest.id})" style="border-left: 4px solid ${borderColor};">
                <!-- Status Icon -->
                <div class="quest-status-icon ${quest.status}">
                    ${statusIcon}
                </div>
                
                <!-- Header -->
                <div class="quest-header">
                    <h3 class="quest-name">${quest.name}</h3>
                    ${requesterInfo ? `<span class="quest-requester">${requesterInfo}</span>` : ''}
                </div>
                
                <!-- Description -->
                <p class="quest-description">${description}</p>
                
                <!-- Badge no Final -->
                <div class="quest-footer">
                    ${typeLabel}
                </div>
            </div>
        `;
    },
    
    getStatusIcon(status) {
        const icons = {
            'available': '<i class="fas fa-circle" style="color: #28a745;"></i>',
            'locked': '<i class="fas fa-lock" style="color: #dc3545;"></i>',
            'completed': '<i class="fas fa-check-circle" style="color: #ffc107;"></i>'
        };
        return icons[status] || icons['available'];
    }
};

console.log('✅ Quest Card carregado');