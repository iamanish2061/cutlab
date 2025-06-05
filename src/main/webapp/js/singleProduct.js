document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    updateCartButton(productId);
    
    if (!productId) {
        window.location.href = 'products.html';
        return;
    }
    
    fetchProductDetails(productId);
    
    function fetchProductDetails(id) {
        if (!id) {
            showError('Invalid product ID');
            return;
        }
        fetch(`/cutlab/products?action=specificProduct&productId=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success' && data.products) {
                    renderProductDetails(data.products);
                    
                    if (data.recommendations && data.recommendations.length > 0) {
                        renderProducts(data.recommendations, 'recommendedProducts');
                    }
                } else {
                    showError(data.message || 'Product not found');
                }
            })
            .catch(error => {
                showError('Failed to load product details: ' + error.message);
            });
    }
    
    function renderProductDetails(product) {
        document.getElementById('cart').value = product.id;
        document.getElementById('productTitle').textContent = product.name;
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productDescription').textContent = product.description;
        document.getElementById('productPrice').textContent = `NRs: ${product.price.toFixed(2)}`;
        document.getElementById('productStock').textContent = `Avaliability: ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}`;
        document.getElementById('productStock').className = product.stock > 0 ? 'stock in-stock' : 'stock out-of-stock';
        document.getElementById('productImage').src = product.url || 'placeholder.jpg';
        document.getElementById('productImage').alt = product.name;
        
        if (product.brand) {
            document.getElementById('productBrand').textContent = `Brand: ${product.brand.name}`;
        }
        
        if (product.ingredients && product.ingredients.length > 0) {
            const ingredientsList = document.getElementById('ingredientsList');
            ingredientsList.innerHTML = '';
            product.ingredients.forEach(ingredient => {
                const li = document.createElement('li');
                li.textContent = ingredient;
                ingredientsList.appendChild(li);
            });
        }

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
        const container = document.querySelector('.product-details-container');
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }


    // Add to Cart Functionality
document.getElementById('cart').addEventListener('click', function() {
    const productId = this.value;
    if(!validateIdOrQuantity(productId)){
        showToast('Invalid product ID');
        return;
    }
    if(this.textContent === 'View Cart'){
        window.location.href = 'AddCart.html';
        return;
    }else{
        addToCart(productId);
    }
});

function addToCart(productId) {
    fetch('/cutlab/cart?action=add&productId=' + productId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            showToast('Added to cart successfully!');
            updateCartButton(productId);

            // setTimeout(() => {
            //     window.location.reload();
            // }, 600);
        } else {
            showToast('Failed to add to cart: ' + data.message);
        }
    })
    .catch(error => {
        showToast('Error: ' + error.message);
    });
    
}

});
window.addEventListener('pageshow', (event) => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    if (event.persisted) { 
        if (productId) updateCartButton(productId);
    }
});
