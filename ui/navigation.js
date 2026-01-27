// ==================== NAVEGAÇÃO ====================

const SEIRA_NAVIGATION = {
    /**
     * Configura navegação entre tabs
     */
    setup() {
        const navTabs = document.querySelectorAll('.nav-tabs .nav-tab');
        const contentSections = document.querySelectorAll('.content-section');
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active de todas
                navTabs.forEach(t => t.classList.remove('active'));
                contentSections.forEach(s => s.classList.remove('active'));
                
                // Adiciona active na clicada
                tab.classList.add('active');
                const targetSection = document.getElementById(targetTab);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }
};

console.log('✅ Navigation carregado');