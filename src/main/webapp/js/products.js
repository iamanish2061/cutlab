document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('productsContainer');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categorySelect = document.getElementById('categorySelect');
    
    let allProducts = [];
    
    // Fetch all products on page load
    fetchProducts();
    
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Category filter
    categorySelect.addEventListener('change', function() {
        const category = this.value;

        if(validateQueryOrCategory(category) === false) {
            return;
        }

        if (category === '') {
            renderProducts(allProducts);
        } else {
            fetch(`/cutlab/products?action=category&query=${encodeURIComponent(category)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        renderProducts(data.products || []);
                    } else {
                        showError(data.message || 'Filter failed');
                    }
                })
                .catch(error => {
                    showError('Filter error: ' + error.message);
                }); 
        }
    });
    
    function fetchProducts() {
        fetch('/cutlab/products')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    allProducts = data.products || [];
                    renderProducts(allProducts);
                    populateCategoryFilter(data.category || []);
                } else {
                    showError(data.message || 'Failed to load products');
                }
            })
            .catch(error => {
                showError('Network error: ' + error.message);
            });
    }
     
    function populateCategoryFilter(cats) {
        categorySelect.innerHTML = '<option value="">All Categories</option>';
        cats.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
    }
    
    function handleSearch() {
        const query = searchInput.value.trim();
        
        if(validateQueryOrCategory(query) === false) {
            return;
        }

        if (query === '') {
            renderProducts(allProducts);
            return;
        }
        
        fetch(`/cutlab/products?action=search&query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    renderProducts(data.products || []);
                } else {
                    showError(data.message || 'Search failed');
                }
            })
            .catch(error => {
                showError('Search error: ' + error.message);
            });
    }
    
    function renderProducts(products, eleSelector = 'productsContainer') {
        eleSelector =document.getElementById(eleSelector);
        if (products.length === 0) {
            eleSelector.innerHTML = '<div class="no-products">No products found</div>';
            return;
        }
        
        eleSelector.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.url || 'placeholder.jpg'}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">NRs: ${product.price.toFixed(2)}</div>
                    <div class="product-stock">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
                </div>
            `;
            
            productCard.addEventListener('click', () => {
                window.location.href = `singleProduct.html?productId=${product.id}`;
            });
            
            eleSelector.appendChild(productCard);
        });
    }
    
    function showError(message) {
        productsContainer.innerHTML = `<div class="error-message">${message}</div>`;
    }
});


