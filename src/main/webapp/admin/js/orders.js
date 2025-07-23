// Orders Management System
class OrdersManager {
    constructor() {
        this.orders = this.loadOrders();
        this.currentFilter = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderOrders();
    }

    bindEvents() {
        // Filter events
        const filterSelect = document.getElementById('orderStatusFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.renderOrders();
            });
        }
    }

    loadOrders() {
        // Sample order data - in a real app, this would come from an API
        return [
            {
                id: 'ORD-001',
                customer: 'Sarah Johnson',
                customerEmail: 'sarah.j@email.com',
                date: '2025-01-20',
                items: [
                    { name: 'Hair Serum', quantity: 2, price: 45.00 },
                    { name: 'Shampoo Premium', quantity: 1, price: 35.00 }
                ],
                total: 125.00,
                status: 'completed',
                paymentMethod: 'Credit Card',
                shippingAddress: '123 Main St, City, State 12345'
            },
            {
                id: 'ORD-002',
                customer: 'Mike Davis',
                customerEmail: 'mike.davis@email.com',
                date: '2025-01-21',
                items: [
                    { name: 'Face Cream', quantity: 1, price: 89.50 }
                ],
                total: 89.50,
                status: 'pending',
                paymentMethod: 'PayPal',
                shippingAddress: '456 Oak Ave, City, State 12346'
            },
            {
                id: 'ORD-003',
                customer: 'Emma Wilson',
                customerEmail: 'emma.w@email.com',
                date: '2025-01-21',
                items: [
                    { name: 'Hair Dryer Pro', quantity: 1, price: 120.00 },
                    { name: 'Hair Brush Set', quantity: 1, price: 36.75 }
                ],
                total: 156.75,
                status: 'processing',
                paymentMethod: 'Credit Card',
                shippingAddress: '789 Pine Rd, City, State 12347'
            },
            {
                id: 'ORD-004',
                customer: 'John Smith',
                customerEmail: 'john.smith@email.com',
                date: '2025-01-19',
                items: [
                    { name: 'Skincare Kit', quantity: 1, price: 75.00 }
                ],
                total: 75.00,
                status: 'cancelled',
                paymentMethod: 'Credit Card',
                shippingAddress: '321 Elm St, City, State 12348'
            },
            {
                id: 'ORD-005',
                customer: 'Lisa Brown',
                customerEmail: 'lisa.brown@email.com',
                date: '2025-01-22',
                items: [
                    { name: 'Nail Polish Set', quantity: 3, price: 25.00 },
                    { name: 'Cuticle Oil', quantity: 2, price: 15.00 }
                ],
                total: 105.00,
                status: 'processing',
                paymentMethod: 'Debit Card',
                shippingAddress: '654 Maple Dr, City, State 12349'
            }
        ];
    }

    getFilteredOrders() {
        if (!this.currentFilter) {
            return this.orders;
        }
        return this.orders.filter(order => order.status === this.currentFilter);
    }

    renderOrders() {
        const tbody = document.getElementById('ordersTable');
        if (!tbody) return;

        const filteredOrders = this.getFilteredOrders();
        
        if (filteredOrders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                        No orders found
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredOrders.map(order => `
            <tr>
                <td>
                    <strong>${order.id}</strong>
                </td>
                <td>
                    <div>
                        <div style="font-weight: 500;">${order.customer}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${order.customerEmail}</div>
                    </div>
                </td>
                <td>${this.formatDate(order.date)}</td>
                <td>
                    <div style="font-size: 0.9rem;">
                        ${order.items.length} item${order.items.length > 1 ? 's' : ''}
                        <button class="btn-link" onclick="ordersManager.showOrderItems('${order.id}')" 
                                style="margin-left: 0.5rem; font-size: 0.8rem;">
                            View Details
                        </button>
                    </div>
                </td>
                <td>
                    <strong>$${order.total.toFixed(2)}</strong>
                </td>
                <td>
                    <span class="status ${order.status}">${this.capitalizeFirst(order.status)}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-sm btn-primary" onclick="ordersManager.viewOrder('${order.id}')" 
                                title="View Order">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${order.status === 'pending' ? `
                            <button class="btn-sm btn-success" onclick="ordersManager.updateOrderStatus('${order.id}', 'processing')" 
                                    title="Process Order">
                                <i class="fas fa-play"></i>
                            </button>
                        ` : ''}
                        ${order.status === 'processing' ? `
                            <button class="btn-sm btn-success" onclick="ordersManager.updateOrderStatus('${order.id}', 'completed')" 
                                    title="Complete Order">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        ${order.status !== 'completed' && order.status !== 'cancelled' ? `
                            <button class="btn-sm btn-danger" onclick="ordersManager.updateOrderStatus('${order.id}', 'cancelled')" 
                                    title="Cancel Order">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    updateOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            this.renderOrders();
            this.showNotification(`Order ${orderId} status updated to ${newStatus}`, 'success');
        }
    }

    viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const itemsList = order.items.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        const modalHTML = `
            <div class="modal-overlay" onclick="this.remove()">
                <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3>Order Details - ${order.id}</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                            <div>
                                <h4>Customer Information</h4>
                                <p><strong>Name:</strong> ${order.customer}</p>
                                <p><strong>Email:</strong> ${order.customerEmail}</p>
                                <p><strong>Order Date:</strong> ${this.formatDate(order.date)}</p>
                                <p><strong>Status:</strong> <span class="status ${order.status}">${this.capitalizeFirst(order.status)}</span></p>
                            </div>
                            <div>
                                <h4>Payment & Shipping</h4>
                                <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                                <p><strong>Total Amount:</strong> $${order.total.toFixed(2)}</p>
                                <p><strong>Shipping Address:</strong></p>
                                <p style="margin-left: 1rem; color: var(--text-muted);">${order.shippingAddress}</p>
                            </div>
                        </div>
                        <div>
                            <h4>Order Items</h4>
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem;">
                                ${itemsList}
                                <div style="display: flex; justify-content: between; padding-top: 1rem; margin-top: 1rem; border-top: 2px solid #333; font-weight: bold;">
                                    <span>Total:</span>
                                    <span>$${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                        ${order.status === 'pending' ? `
                            <button class="btn-primary" onclick="ordersManager.updateOrderStatus('${order.id}', 'processing'); this.closest('.modal-overlay').remove();">
                                Process Order
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    showOrderItems(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const itemsList = order.items.map(item => `
            <li style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                <span>${item.name} (Qty: ${item.quantity})</span>
                <span>$${item.price.toFixed(2)} each</span>
            </li>
        `).join('');

        alert(`Order ${orderId} Items:\n\n${order.items.map(item => 
            `${item.name} - Qty: ${item.quantity} - $${item.price.toFixed(2)} each`
        ).join('\n')}\n\nTotal: $${order.total.toFixed(2)}`);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    exportOrders() {
        const filteredOrders = this.getFilteredOrders();
        const csvContent = this.convertToCSV(filteredOrders);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    convertToCSV(orders) {
        const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Items', 'Total', 'Status', 'Payment Method'];
        const rows = orders.map(order => [
            order.id,
            order.customer,
            order.customerEmail,
            order.date,
            order.items.length,
            order.total,
            order.status,
            order.paymentMethod
        ]);
        
        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }
}

// Initialize orders manager when the page loads
let ordersManager;

document.addEventListener('DOMContentLoaded', () => {
    ordersManager = new OrdersManager();
});

// Add CSS for animations and notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .action-buttons {
        display: flex;
        gap: 0.5rem;
    }
    
    .btn-sm {
        padding: 0.25rem 0.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
        transition: all 0.2s;
    }
    
    .btn-primary { background: #3B82F6; color: white; }
    .btn-success { background: #10B981; color: white; }
    .btn-danger { background: #EF4444; color: white; }
    .btn-link { background: none; border: none; color: #3B82F6; cursor: pointer; }
    
    .btn-sm:hover { transform: translateY(-1px); }
    
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
`;
document.head.appendChild(style);