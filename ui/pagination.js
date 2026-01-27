// ==================== PAGINAÇÃO ====================

const SEIRA_PAGINATION = {
    /**
     * Renderiza controles de paginação
     */
    render(containerId, currentPage, totalPages, onPageChange) {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn(`Elemento ${containerId} não encontrado`);
            return;
        }
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let html = `
            <button 
                ${currentPage === 1 ? 'disabled' : ''} 
                onclick="${onPageChange}(${currentPage - 1})"
            >
                <i class="fas fa-chevron-left"></i> Anterior
            </button>
        `;
        
        // Primeira página
        if (currentPage > 3) {
            html += `<button onclick="${onPageChange}(1)">1</button>`;
            if (currentPage > 4) {
                html += `<span style="padding: 0 10px;">...</span>`;
            }
        }
        
        // Páginas ao redor da atual
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            html += `
                <button 
                    class="${i === currentPage ? 'active' : ''}" 
                    onclick="${onPageChange}(${i})"
                >
                    ${i}
                </button>
            `;
        }
        
        // Última página
        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) {
                html += `<span style="padding: 0 10px;">...</span>`;
            }
            html += `<button onclick="${onPageChange}(${totalPages})">${totalPages}</button>`;
        }
        
        html += `
            <button 
                ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="${onPageChange}(${currentPage + 1})"
            >
                Próxima <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        container.innerHTML = html;
    }
};

console.log('✅ Pagination carregado');