class SalonApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        console.log('SalonHub Admin Dashboard Initialized');
    }

    setupEventListeners() {
        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Theme selector
        const themeSelector = document.getElementById('themeSelector');
        if (themeSelector) {
            themeSelector.addEventListener('change', this.handleThemeChange.bind(this));
            // Load saved theme
            const savedTheme = localStorage.getItem('salonTheme') || 'light';
            themeSelector.value = savedTheme;
            this.applyTheme(savedTheme);
        }

        // Notification button
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', this.showNotifications.bind(this));
        }
    }

    loadInitialData() {
        // Load sample data for demonstration
        this.sampleData = {
            customers: [
                { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '+1234567890', orders: 5, status: 'active' },
                { id: 2, name: 'Mike Davis', email: 'mike@email.com', phone: '+1234567891', orders: 3, status: 'active' },
                { id: 3, name: 'Emma Wilson', email: 'emma@email.com', phone: '+1234567892', orders: 8, status: 'active' },
                { id: 4, name: 'John Smith', email: 'john@email.com', phone: '+1234567893', orders: 2, status: 'inactive' }
            ],
            products: [
                { id: 1, name: 'Premium Hair Shampoo', category: 'hair-care', price: 29.99, stock: 45, description: 'Luxurious moisturizing shampoo' },
                { id: 2, name: 'Anti-Aging Serum', category: 'skincare', price: 89.99, stock: 23, description: 'Advanced anti-aging formula' },
                { id: 3, name: 'Professional Hair Dryer', category: 'tools', price: 159.99, stock: 12, description: 'High-performance salon dryer' },
                { id: 4, name: 'Organic Face Mask', category: 'skincare', price: 24.99, stock: 67, description: 'Natural clay face mask' }
            ],
            orders: [
                { id: 'ORD-001', customer: 'Sarah Johnson', date: '2024-01-15', items: 2, total: 125.00, status: 'completed' },
                { id: 'ORD-002', customer: 'Mike Davis', date: '2024-01-14', items: 1, total: 89.50, status: 'pending' },
                { id: 'ORD-003', customer: 'Emma Wilson', date: '2024-01-13', items: 3, total: 156.75, status: 'processing' },
                { id: 'ORD-004', customer: 'John Smith', date: '2024-01-12', items: 1, total: 29.99, status: 'cancelled' }
            ],
            reviews: [
                { id: 1, customer: 'Sarah Johnson', product: 'Premium Hair Shampoo', rating: 5, comment: 'Amazing product! My hair feels so soft.', date: '2024-01-10' },
                { id: 2, customer: 'Mike Davis', product: 'Anti-Aging Serum', rating: 4, comment: 'Good results, will buy again.', date: '2024-01-09' },
                { id: 3, customer: 'Emma Wilson', product: 'Professional Hair Dryer', rating: 5, comment: 'Perfect for my salon!', date: '2024-01-08' }
            ]
        };
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        // Implement search functionality based on current page
        console.log('Searching for:', query);
        // This would filter the current page's data
    }

    handleThemeChange(e) {
        const theme = e.target.value;
        this.applyTheme(theme);
        localStorage.setItem('salonTheme', theme);
    }

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    showNotifications() {
        // Simple notification display
        const notifications = [
            'New order received from Sarah Johnson',
            'Low stock alert: Professional Hair Dryer',
            'Weekly sales report is ready'
        ];
        
        alert('Notifications:\n' + notifications.join('\n'));
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Utility functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showToast(message, type = 'success') {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            color: white;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Global modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showAddProductModal() {
    showModal('addProductModal');
}

function showAddCustomerModal() {
    showModal('addCustomerModal');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.salonApp = new SalonApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.6s ease forwards;
    }
    
    .animate-slide-up {
        animation: slideUp 0.8s ease forwards;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        align-items: center;
        justify-content: center;
    }
    
    .toast {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);