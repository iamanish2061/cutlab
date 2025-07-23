// Products Management
let products = [
    {
        id: 1,
        name: "Professional Hair Shampoo",
        category: "hair-care",
        price: 24.99,
        stock: 45,
        description: "Deep cleansing shampoo for all hair types",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA3NUMzNS44NTc5IDc1IDI1IDY0LjE0MjEgMjUgNTBDMjUgMzUuODU3OSAzNS44NTc5IDI1IDUwIDI1QzY0LjE0MjEgMjUgNzUgMzUuODU3OSA3NSA1MEM3NSA2NC4xNDIxIDY0LjE0MjEgNzUgNTAgNzVaIiBmaWxsPSIjNjM2NkYxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+",
        status: "active"
    },
    {
        id: 2,
        name: "Moisturizing Hair Conditioner",
        category: "hair-care",
        price: 19.99,
        stock: 32,
        description: "Hydrating conditioner for dry and damaged hair",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA3NUMzNS44NTc5IDc1IDI1IDY0LjE0MjEgMjUgNTBDMjUgMzUuODU3OSAzNS44NTc5IDI1IDUwIDI1QzY0LjE0MjEgMjUgNzUgMzUuODU3OSA3NSA1MEM3NSA2NC4xNDIxIDY0LjE0MjEgNzUgNTAgNzVaIiBmaWxsPSIjMTBCOTgxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+",
        status: "active"
    },
    {
        id: 3,
        name: "Anti-Aging Face Cream",
        category: "skincare",
        price: 89.99,
        stock: 18,
        description: "Advanced anti-aging formula with retinol",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA3NUMzNS44NTc5IDc1IDI1IDY0LjE0MjEgMjUgNTBDMjUgMzUuODU3OSAzNS44NTc5IDI1IDUwIDI1QzY0LjE0MjEgMjUgNzUgMzUuODU3OSA3NSA1MEM3NSA2NC4xNDIxIDY0LjE0MjEgNzUgNTAgNzVaIiBmaWxsPSIjRkY2B0I5Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+",
        status: "active"
    },
    {
        id: 4,
        name: "Professional Hair Dryer",
        category: "tools",
        price: 149.99,
        stock: 8,
        description: "High-performance salon-grade hair dryer",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA3NUMzNS44NTc5IDc1IDI1IDY0LjE0MjEgMjUgNTBDMjUgMzUuODU3OSAzNS44NTc5IDI1IDUwIDI1QzY0LjE0MjEgMjUgNzUgMzUuODU3OSA3NSA1MEM3NSA2NC4xNDIxIDY0LjE0MjEgNzUgNTAgNzVaIiBmaWxsPSIjOEI1Q0Y2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+",
        status: "active"
    },
    {
        id: 5,
        name: "Liquid Foundation",
        category: "makeup",
        price: 34.99,
        stock: 25,
        description: "Full coverage liquid foundation",
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA3NUMzNS44NTc5IDc1IDI1IDY0LjE0MjEgMjUgNTBDMjUgMzUuODU3OSAzNS44NTc5IDI1IDUwIDI1QzY0LjE0MjEgMjUgNzUgMzUuODU3OSA3NSA1MEM3NSA2NC4xNDIxIDY0LjE0MjEgNzUgNTAgNzVaIiBmaWxsPSIjRUY0NDQ0Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+",
        status: "active"
    }
];

function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <button class="btn-icon" onclick="editProduct(${product.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteProduct(${product.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="product-category">${formatCategory(product.category)}</p>
                <p class="product-description">${product.description}</p>
                <div class="product-details">
                    <span class="product-price">$${product.price}</span>
                    <span class="product-stock ${product.stock < 10 ? 'low-stock' : ''}">${product.stock} in stock</span>
                </div>
                <div class="product-status">
                    <span class="status ${product.status}">${product.status}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function formatCategory(category) {
    return category.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function showAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('addProductForm').reset();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function addProduct(productData) {
    const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        ...productData,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA3NUMzNS44NTc5IDc1IDI1IDY0LjE0MjEgMjUgNTBDMjUgMzUuODU3OSAzNS44NTc5IDI1IDUwIDI1QzY0LjE0MjEgMjUgNzUgMzUuODU3OSA3NSA1MEM3NSA2NC4xNDIxIDY0LjE0MjEgNzUgNTAgNzVaIiBmaWxsPSIjNjM2NkYxIi8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+",
        status: "active"
    };
    
    products.push(newProduct);
    renderProducts();
    closeModal('addProductModal');
    showNotification('Product added successfully!', 'success');
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    // Pre-fill form with product data
    const form = document.getElementById('addProductForm');
    form.elements.name.value = product.name;
    form.elements.category.value = product.category;
    form.elements.price.value = product.price;
    form.elements.stock.value = product.stock;
    form.elements.description.value = product.description;
    
    // Change modal title and button text
    document.querySelector('#addProductModal .modal-header h3').textContent = 'Edit Product';
    document.querySelector('#addProductModal button[type="submit"]').textContent = 'Update Product';
    
    // Store product ID for update
    form.dataset.editId = id;
    
    showAddProductModal();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        renderProducts();
        showNotification('Product deleted successfully!', 'success');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    
    // Add Product Form Handler
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const productData = {
                name: formData.get('name'),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                stock: parseInt(formData.get('stock')),
                description: formData.get('description')
            };
            
            const editId = this.dataset.editId;
            if (editId) {
                // Update existing product
                const index = products.findIndex(p => p.id === parseInt(editId));
                if (index !== -1) {
                    products[index] = { ...products[index], ...productData };
                    showNotification('Product updated successfully!', 'success');
                }
                delete this.dataset.editId;
                document.querySelector('#addProductModal .modal-header h3').textContent = 'Add New Product';
                document.querySelector('#addProductModal button[type="submit"]').textContent = 'Add Product';
            } else {
                // Add new product
                addProduct(productData);
            }
            
            renderProducts();
            closeModal('addProductModal');
        });
    }
    
    // Modal close on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
});

// Export functions for global access
window.showAddProductModal = showAddProductModal;
window.closeModal = closeModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;