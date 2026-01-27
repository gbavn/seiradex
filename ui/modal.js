// ==================== MODAL ====================

const SEIRA_MODAL = {
    /**
     * Abre o modal
     */
    open(title, content) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (!modal || !modalTitle || !modalBody) {
            console.error('Elementos do modal não encontrados');
            return;
        }
        
        modalTitle.innerHTML = title;
        modalBody.innerHTML = content;
        modal.classList.add('active');
    },
    
    /**
     * Fecha o modal
     */
    close() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    /**
     * Adiciona botão de compartilhar no título
     */
    addShareButton(type, id) {
        const buttonsContainer = document.querySelector('.modal-header-buttons');
        if (!buttonsContainer) return;
        
        // Remove botão anterior se existir
        const existingBtn = buttonsContainer.querySelector('.share-modal-btn');
        if (existingBtn) existingBtn.remove();
        
        // Adiciona novo botão
        const shareBtn = document.createElement('button');
        shareBtn.className = 'modal-header-btn share-modal-btn';
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
        shareBtn.title = 'Copiar link direto';
        shareBtn.onclick = () => SEIRA_HELPERS.copyLink(type, id);
        
        // Adiciona ANTES do botão close (para ficar na ordem certa: share | close)
        const closeBtn = buttonsContainer.querySelector('.modal-close');
        if (closeBtn) {
            buttonsContainer.insertBefore(shareBtn, closeBtn);
        } else {
            buttonsContainer.appendChild(shareBtn);
        }
    },
    
    /**
     * Configura event listeners do modal
     */
    setup() {
        const modal = document.getElementById('modal');
        const closeBtn = document.querySelector('.modal-close');
        
        if (!modal) {
            console.error('Modal não encontrado');
            return;
        }
        
        // Botão de fechar
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Clique fora do modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
        
        // ESC para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.close();
            }
        });
    }
};

console.log('✅ Modal carregado');