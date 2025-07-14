//popup logout modal
function showLogoutModal() {
    setupLogoutModal();
    document.getElementById('logout-modal').style.display = 'flex';
}

    // Logout Modal System
function setupLogoutModal() {
  const modalHTML = `
    <div id="logout-modal" class="logout-modal">
      <div class="logout-modal-content">
        <p>Are you sure you want to logout?</p>
        <div class="logout-modal-buttons">
          <button id="logout-confirm" class="logout-btn confirm">Yes, Logout</button>
          <button id="logout-cancel" class="logout-btn cancel">Cancel</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  document.getElementById('logout-confirm').addEventListener('click', logoutProcess);
  document.getElementById('logout-cancel').addEventListener('click', cancelLogout);
}

function logoutProcess() {
    showToast("Logging out...");
    setTimeout(() => {
        try {
            fetch('/cutlab/logout', {
                method: 'POST'
            }).then(response=>response.json())
            .then(data=>{
                if (data.status === 'success') {
                    window.location.href = "login.html";
                } else {
                    showToast('Failed to log out: ' + data.message);
                }
            })
            
        } catch (error) {
            showToast('Error: ' + error.message);
        }
    }, 1000);
}

function cancelLogout() {
  document.getElementById('logout-modal').style.display = 'none';
}



document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const editProfileBtn = document.getElementById('editProfileBtn');
    
    const changePicBtn = document.getElementById('changePicBtn');
    const profilePic = document.getElementById('profilePic');
    const profileUpload = document.getElementById('profileUpload');
    
    const changePassBtn = document.getElementById('changePassBtn');
    const passwordModal = document.getElementById('passwordModal');
    const passwordModalClose = document.getElementById('passwordModalClose');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    const passwordForm = document.getElementById('passwordForm');
    
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const orderGrids = {
        current: document.getElementById('currentOrders'),
        past: document.getElementById('pastOrders'),
        cancelled: document.getElementById('cancelledOrders')
    };
    
    const orderModal = document.getElementById('orderModal');
    const modalClose = document.getElementById('modalClose');

    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    
    // Edit Profile Functionality
    editProfileBtn.addEventListener('click', function() {
        window.location = "signupAdditional.html?source=profile.html";
    });
    
    // Change or add Profile Picture
    changePicBtn.addEventListener('click', function() {
        if(document.getElementById('firstName').value == "-"){
            showToast("Please enter your details first!");
            return;
        }else{
            profileUpload.click();
        }
    });
    
    profileUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            // Validate file type and size
            const file = e.target.files[0];
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const maxSize = 2 * 1024 * 1024; // 2MB
            
            if (!validTypes.includes(file.type)) {
                showToast('Please select a valid image file (JPEG, PNG, JPG)');
                return;
            }
            if (file.size > maxSize) {
                showToast('Image size must be less than 2MB');
                return;
            }
            
            // Preview the image
            const reader = new FileReader();
            
            reader.onload = function(event) {
                profilePic.src = event.target.result;
                
                // Create FormData for the upload
                const formData = new FormData();
                formData.append('profileImage', file);
                
                // Show loading state
                changePicBtn.disabled = true;
                showToast('Uploading...');
                
                // Upload to server
                fetch('/cutlab/UploadPhoto', {
                    method: 'POST',
                    body: formData
                }).then(response=>response.json())
                .then(data=>{
                    if (data.status === 'success') {
                        profilePic.src = 'images/user_profile/' + data.profilePic + '?t=' + new Date().getTime();
                        showToast("Successfully Uploaded");
                        window.location.reload();
                    } else {
                        showToast('Failed to upload: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Upload error:', error);
                    showToast('Failed to update profile picture!');
                    profilePic.src = "images/user_profile/nouser.jpg";
                    
                })
                .finally(() => {
                    changePicBtn.disabled = false;
                });
            };
                            
            reader.readAsDataURL(file);
        }
    });
    
    // Change Password Modal
    changePassBtn.addEventListener('click', function() {
        passwordModal.classList.add('active');
    });
    
    passwordModalClose.addEventListener('click', function() {
        passwordModal.classList.remove('active');
    });
    
    cancelPasswordBtn.addEventListener('click', function() {
        passwordModal.classList.remove('active');
    });
    
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const displayMsg = $('#error-msg');
        const currentPassword = document.getElementById('currentPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPass = document.getElementById('confirmPassword').value.trim();
        
        const validOldPassword = validatePassword(currentPassword);
        const validPassword = validatePassword(newPassword);
        const validConfirm = confirmPassword(newPassword, confirmPass);

        if(!currentPassword || !newPassword || !confirmPassword){
            displayMsg.text('Please enter the passwords first!').css('color', 'red');
            return;
        }
        if (validOldPassword) {
            displayMsg.text(validOldPassword).css('color', 'red');
            return;
        }

        if (validPassword) {
            displayMsg.text(validPassword).css('color', 'red');
            return;
        }
        if(validConfirm){
            displayMsg.text(validConfirm).css('color', 'red');
            return;
        }

        displayMsg.text('Please Wait...').css('color', 'blue');
        $('#pass-update-btn').prop('disabled', true); //disabling reset button to prevent more clicking

        $.ajax({
            url: '/cutlab/ChangePassword',
            type: 'POST',
            dataType: 'json',
            data: 	{ 
                        currentPassword: currentPassword,
                        newPassword : newPassword,
                        confirmPassword: confirmPass
                    },
            success: function(response){
                if(response && response.status == 'success'){
                    showToast(response.message);
                    setTimeout(() => {
                        window.location = 'profile.html';
                    }, 500);
                }else{
                    showToast(response.message || 'Invalid Data!');
                    $('#pass-update-btn').prop('disabled', true);
                }
        },
        error: function(xhr){
                alert('Server busy. Please try again later!');
                $('#reset-btn').prop('disabled', false);
            }
        });
    });
    
    
    // Order Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding grid
            Object.values(orderGrids).forEach(grid => {
                grid.style.display = 'none';
            });
            
            orderGrids[tab].style.display = 'grid';
        });
    });
    
    // Order Details Modal
    function sanitizeOrderId(orderId) {
        const regex = /^[a-zA-Z0-9_-]+$/;
        return regex.test(orderId);
    }

    function displayOrderDetailsInModal(order){
        document.getElementById('modalOrderId').textContent = order.orderId;
        document.getElementById('modalOrderDate').textContent = order.date;
        document.getElementById('modalOrderStatus').textContent = order.orderStatus;
        document.getElementById('modalPaymentMethod').textContent = order.paymentMethod;
        document.getElementById('modalPaymentStatus').textContent = order.paymentStatus;
        document.getElementById('modalDeliveryAddress').textContent = order.address;
        
        document.getElementById('modalSubtotal').innerText = "NRS: "+ (order.totalAmount-100).toFixed(2);
        document.getElementById('modalShipping').innerText = "NRS: 100";
        document.getElementById('modalTotal').innerText = "NRS: " +order.totalAmount;

        const productsTable = document.getElementById('modalProducts');
        productsTable.innerHTML = '';
        
        order.productsInfo.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${product.url}" alt="${product.name}" style="width: 40px; height: 40px; border-radius: 4px;">
                        <span>${product.name}</span>
                    </div>
                </td>
                <td>NRS: ${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>NRS: ${(product.price * product.stock).toFixed(2)}</td>
            `;
            productsTable.appendChild(row);
        });
        
        // Update actions based on order status
        const modalActions = document.getElementById('modalActions');
        if (order.orderStatus === 'DELIVERY') {
            modalActions.innerHTML = `
                <button class="btn btn-danger" id="cancelOrderBtn">Cancel Order</button>
                <button class="btn btn-outline" id="contactSupportBtn">Contact Support</button>
            `;
        }else {
            modalActions.innerHTML = `
                <button class="btn btn-outline" id="contactSupportBtn">Contact Support</button>
            `;
        }
    }

    function openOrderModal(orderId) {
        const safeOrderId = sanitizeOrderId(orderId);

        if(!safeOrderId) {
            showToast('Invalid Order ID');
            return;
        }

        fetch(`/cutlab/GetDetailsOfOrder?orderId=${encodeURIComponent(orderId)}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    orderModal.classList.add('active');
                    displayOrderDetailsInModal(data.orderDetails);
                } else {
                    showToast('Failed to fetch order details'+ data.message);
                }
            })
            .catch(() => {
                showToast('Error fetching order details');
            });
         
    }
    
    // Close modal when clicking close button
    modalClose.addEventListener('click', function() {
        orderModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    orderModal.addEventListener('click', function(e) {
        if (e.target === orderModal) {
            orderModal.classList.remove('active');
        }
    });
        
    // Cancel order from modal
    cancelOrderBtn.addEventListener('click', function() {
        console.log("Cancel Order Button Clicked");
        cancelOrder(this.getAttribute('data-order-id'));
    });
    
    // Fetch user data on page load (simulated)
    function fetchUserData() {

        fetch('/cutlab/getUserProfile')
        .then(response => response.json())
        .then(data => {
        if (data.status === 'success') {

            const details = data.details;
            document.getElementById('email').value = details.email;

            if(details.firstName != null){
            document.getElementById('profileName').innerText = details.firstName;
            document.getElementById('profileEmail').innerText = details.email;
            document.getElementById('firstName').value = details.firstName;
            document.getElementById('lastName').value = details.lastName;
            document.getElementById('phone').value = details.phone;
            document.getElementById('birthdate').value = details.dob;
            document.getElementById('address').value = details.address;
            document.getElementById('profilePic').src = 'images/user_profile/' + details.profilePic + '?t=' + new Date().getTime();
            }

            
        } else {
            showToast('Failed to load user data');
        }
        })
        .catch(error => {
        showToast('Error fetching user data');
        });
    
    }
    
   function cancelOrder(orderId) {
        if (!confirm("Are you sure you want to cancel this order?\nNOTE: You will not be refunded delivery charge!")) return;

        const formData = new URLSearchParams();
        formData.append('id', orderId);

        fetch('/cutlab/CancelOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'  
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showToast("Order cancelled successfully!");
                fetchCartTotalAndOrders();
            } else {
                showToast("Failed to cancel order.");
            }
        })
        .catch(() => {
            showToast("Error cancelling order.");
        });
    }


    function fetchDetailsOfOrder(orderId){
        openOrderModal(orderId);
    }

    // Fetch orders data 
    function fetchCartTotalAndOrders() {
        fetch('/cutlab/GetOrders')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('orderCount').innerText = data.orderTotal;
                document.getElementById('cartCount').innerText = data.cartTotal;
               
                // Clear previous orders
                if (document.getElementById('currentOrders')) document.getElementById('currentOrders').innerHTML = '';
                if (document.getElementById('pastOrders')) document.getElementById('pastOrders').innerHTML = '';
                if (document.getElementById('cancelledOrders')) document.getElementById('cancelledOrders').innerHTML = '';

                orders=data.orders;
                orders.forEach(order => {
                    const currentOrders= document.getElementById('currentOrders');
                    const pastOrders= document.getElementById('pastOrders');
                    const cancelledOrders= document.getElementById('cancelledOrders');
                    const orderCard = document.createElement('div');
                    orderCard.className = 'order-card';
                    orderCard.setAttribute('data-order-id', order.order_id);

                    orderCard.innerHTML = `
                        <div class="order-header">
                            <span class="order-id">${order.order_id}</span>
                            <span class="order-date">${order.date}</span>
                        </div>
                        <span class="order-status status-pending">${order.status}</span>
                        
                        <div class="order-products">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#4F8EF7">
                                <rect x="3" y="7" width="18" height="13" rx="2" fill="#E3ECFB"/>
                                <rect x="7" y="3" width="10" height="7" rx="2" fill="#B6D0F7"/>
                                <rect x="9" y="15" width="6" height="2" rx="1" fill="#4F8EF7"/>
                                <rect x="11" y="11" width="2" height="2" rx="1" fill="#4F8EF7"/>
                            </svg>
                        </div>
                        
                        <div class="order-footer">
                            <span class="order-total">Rs: ${order.totalAmount}</span>
                        </div>
                    `;

                    if (order.status === 'COMPLETED') {
                        pastOrders.appendChild(orderCard);
                    } else if (order.status === 'DELIVERY' || order.status === 'HOLD' || order.status ==='PENDING') {
                        const cancelButton = document.createElement('button');
                        cancelButton.className = 'action-btn';
                        cancelButton.setAttribute('data-order-id', order.order_id);
                        cancelButton.innerHTML=`<i class="fas fa-times"></i>Cancel`;

                        orderCard.querySelector('.order-footer').appendChild(cancelButton);

                        cancelButton.addEventListener('click', function (e) {
                            e.stopPropagation(); // Stops orderCard click
                            const orderId = this.getAttribute('data-order-id');
                            cancelOrder(orderId);
                        });

                        currentOrders.appendChild(orderCard);
                    } else if (order.status === 'CANCELLED') {
                        cancelledOrders.appendChild(orderCard);
                    }

                    orderCard.addEventListener('click', function () {
                        fetchDetailsOfOrder(this.getAttribute('data-order-id'));
                    });


                });
            } else {
                showToast('No orders found.');
            }
        })
        .catch(() => {
            showToast('Error fetching orders.');
        });
    }
    
    // Initialize the page
    fetchUserData();
    fetchCartTotalAndOrders();
});

