// ==================== SHOP LOADER ====================
// Carrega dinamicamente uma loja quando clicada

function loadShop(shopId) {
    const shopContent = document.getElementById('shop-content');
    const shopsMenu = document.querySelector('.shops-menu');
    const config = getShopConfig(shopId);
    
    if (!config) {
        console.error('Shop config não encontrado:', shopId);
        return;
    }
    
    shopsMenu.style.display = 'none';
    shopContent.style.display = 'block';
    
    shopContent.innerHTML = `
    <div x-data="seiraShopComponent('${shopId}')">
        <button class="btn-back" onclick="backToShops()">
            <i class="fas fa-arrow-left"></i> Voltar às Lojas
        </button>
        
        <div class="shop-header">
            <i class="fas ${config.icon}"></i>
            <div>
                <h2>${config.name}</h2>
                <p>${config.description}</p>
            </div>
        </div>
        
        <div x-show="loading" class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando loja...</p>
        </div>
        
        <div x-show="!loading">
            <div class="toolbar">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Buscar item..." x-model="filters.search" @input="currentPage = 1">
                </div>
                
                <select x-model="filters.category" @change="updateSubcategories(); currentPage = 1">
                    <option value="">Todas Categorias</option>
                    <template x-for="cat in categories" :key="cat">
                        <option :value="cat" x-text="cat"></option>
                    </template>
                </select>
                
                <select x-model="filters.subcategory" @change="currentPage = 1" :disabled="!filters.category">
                    <option value="">Todas Subcategorias</option>
                    <template x-for="sub in subcategories" :key="sub">
                        <option :value="sub" x-text="sub"></option>
                    </template>
                </select>
                
                <select x-model="filters.rarity" @change="currentPage = 1">
                    <option value="">Todas Raridades</option>
                    <template x-for="rar in rarities" :key="rar">
                        <option :value="rar" x-text="rar"></option>
                    </template>
                </select>
                
                <button class="btn-clear" @click="clearFilters()" x-show="hasActiveFilters">
                    <i class="fas fa-times"></i> Limpar
                </button>
            </div>
            
            <div class="results-info">
                <span x-text="\`Mostrando \${startIndex + 1}-\${endIndex} de \${filteredItems.length} itens\`"></span>
            </div>
            
            <div class="data-grid">
                <template x-for="item in paginatedItems" :key="item.id">
                    <div x-html="createShopCard(item, shopConfig)"></div>
                </template>
            </div>
            
            <div class="pagination">
                <button @click="previousPage()" :disabled="currentPage === 1">
                    <i class="fas fa-chevron-left"></i> Anterior
                </button>
                
                <template x-if="currentPage > 3">
                    <button @click="goToPage(1)">1</button>
                </template>
                <template x-if="currentPage > 4">
                    <span>...</span>
                </template>
                
                <template x-for="page in visiblePages" :key="page">
                    <button @click="goToPage(page)" :class="{ 'active': page === currentPage }" x-text="page"></button>
                </template>
                
                <template x-if="currentPage < totalPages - 3">
                    <span>...</span>
                </template>
                <template x-if="currentPage < totalPages - 2">
                    <button @click="goToPage(totalPages)" x-text="totalPages"></button>
                </template>
                
                <button @click="nextPage()" :disabled="currentPage === totalPages">
                    Próxima <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>
`;
    
    Alpine.initTree(shopContent);
}

function backToShops() {
    document.querySelector('.shops-menu').style.display = 'block';
    document.getElementById('shop-content').style.display = 'none';
    document.getElementById('shop-content').innerHTML = '';
}

console.log('✅ Shop Loader carregado');