document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cartItems');

    loadCartItems();
 

    async function loadCartItems() {
        try {
            const response = await fetch('/cutlab/cart?action=get');
            const data = await response.json();

            if (data.status === 'success') {
                renderCartItems(data.cart);
                // updateSummary(data.total);
            } else {
                showToast('Failed to load cart: ' + data.message);
            }
        } catch (error) {
            showToast('Error: ' + error.message);
        }
    }

    function renderCartItems(items) {
        const arrayItems = Object.values(items);

        if (arrayItems.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        cartItemsContainer.innerHTML = '';

        arrayItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.dataset.id = item.product.id;

            cartItem.innerHTML = `
                <img src="${item.product.url || 'placeholder.jpg'}" alt="${item.name}">                
                <p>${item.product.name}</p>
                <div class="cart-item-price">NRs: ${item.product.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <div class="quantity-controls">    
                        <button class="change-qty less-qty" data-change="-1" data-stock="${item.product.stock}">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="change-qty add-qty" data-change="1" data-stock="${item.product.stock}">+</button>
                    </div>
                    <div class="cart-buttons">
                        <button class="update-qty" style="display:none;">OK</button>
                        <span class="remove-item">Remove</span>
                    </div>
                </div>
                <div class="cart-item-total">${item.product.price * item.quantity}<div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    cartItemsContainer.addEventListener('click', function (e) {
        const target = e.target;
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;

        const productId = parseInt(cartItem.dataset.id);
        const quantityDisplay = cartItem.querySelector('.quantity-display');
        const currentQuantity = parseInt(quantityDisplay.textContent);
        const updateButton = cartItem.querySelector('.update-qty');

        // Quantity update
        if (target.classList.contains('change-qty')) {
            const change = parseInt(target.dataset.change);
            const stock = parseInt(target.dataset.stock);
            const newQuantity = currentQuantity + change;

            // Validate quantity
            if (newQuantity < 1) return;
            if (change > 0 && newQuantity > stock) {
                showToast(`Only ${stock} items available`);
                return;
            }

            quantityDisplay.textContent = newQuantity;
            updateButton.style.display = 'inline-block';
            
            // Update total price display
            const price = parseFloat(cartItem.querySelector('.cart-item-price').textContent.replace('NRs: ', ''));
            cartItem.querySelector('.cart-item-total').textContent = (price * newQuantity).toFixed(2);
        }

        if(target.classList.contains('update-qty')) {
            updateQuantity(productId, currentQuantity);
        }

        // Remove item
        if (target.classList.contains('remove-item')) {
            removeFromCart(productId);
        }
    });

    async function updateQuantity(productId, change) {

        if(!validateIdOrQuantity(productId) || !validateIdOrQuantity(change)) {
            console.log(change);
            console.log(productId);
            showToast('Invalid product ID or quantity');
            return;
        }

        try {
            const response = await fetch(`/cutlab/cart?action=update&productId=${productId}&change=${change}`, {
                method: 'POST'
            });
            const data = await response.json();

            if (data.status === 'success') {
                showToast('Updated cart successfully!');
                loadCartItems(); // Refresh content without reloading page
            } else {
                showToast('Failed to update: ' + data.message);
                loadCartItems(); 
            }
        } catch (error) {
            showToast('Error: ' + error.message);
        }
    }

    async function removeFromCart(productId) {
        try {
            const response = await fetch(`/cutlab/cart?action=remove&productId=${productId}`, {
                method: 'POST'
            });
            const data = await response.json();

            if (data.status === 'success') {
                showToast('Removed from cart successfully!');
                updateCartButton(productId);
                loadCartItems();
            } else {
                showToast('Failed to remove: ' + data.message);
            }
        } catch (error) {
            showToast('Error: ' + error.message);
        }
    }

});

document.getElementById("checkoutBtn").addEventListener("click", function() {
    const cartItems = document.querySelectorAll('.cart-items');
    if (cartItems.length === 0) {
        showToast('Your cart is empty!');
        return;
    }else{
        const cartData = {};
        document.querySelectorAll('.cart-item').forEach(item => {
            const id = parseInt(item.dataset.id);
            const qty = parseInt(item.querySelector('.quantity-display').textContent);
            cartData[id] = qty;
        });
        showToast('Redirecting to checkout...');
        setTimeout(() => {
            fetch('/cutlab/beforeCheckout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cartData)
            }).then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    window.location.href = 'checkout.html';
                } else {
                    showToast('Failed to proceed to checkout: ' + data.message);
                }
            }).catch(error => {
                showToast('Error: ' + error.message);
            });
        }, 500);

    }

});