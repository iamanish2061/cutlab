class Navigation {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('mainContent');
        this.toggleBtn = document.getElementById('toggleSidebar');
        this.navItems = document.querySelectorAll('.nav-item');
        this.pages = document.querySelectorAll('.page');
        this.pageTitle = document.getElementById('pageTitle');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateActiveState();
    }

    setupEventListeners() {
        // Sidebar toggle
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', this.toggleSidebar.bind(this));
        }

        // Navigation item clicks
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Handle responsive behavior
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize(); // Initial check
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('collapsed');
        this.mainContent.classList.toggle('expanded');
        
        // Update toggle button icon
        const icon = this.toggleBtn.querySelector('i');
        if (this.sidebar.classList.contains('collapsed')) {
            icon.className = 'fas fa-bars';
        } else {
            icon.className = 'fas fa-times';
        }
    }

    navigateToPage(pageName) {
        // Remove active class from all nav items
        this.navItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to clicked nav item
        const activeItem = document.querySelector(`[data-page="${pageName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Hide all pages
        this.pages.forEach(page => page.classList.remove('active'));
        
        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update page title
        this.updatePageTitle(pageName);

        // Load page-specific data
        this.loadPageData(pageName);

        // Update app's current page
        if (window.salonApp) {
            window.salonApp.currentPage = pageName;
        }
    }

    updatePageTitle(pageName) {
        const titles = {
            dashboard: 'Dashboard Overview',
            customers: 'Customer Management',
            products: 'Product Management',
            orders: 'Order Management',
            reviews: 'Reviews & Ratings',
            reports: 'Reports & Analytics',
            settings: 'Settings'
        };

        if (this.pageTitle) {
            this.pageTitle.textContent = titles[pageName] || 'Dashboard';
        }
    }

    loadPageData(pageName) {
        // Load specific data for each page
        switch(pageName) {
            case 'dashboard':
                if (window.dashboardManager) {
                    window.dashboardManager.loadDashboard();
                }
                break;
            case 'customers':
                if (window.customersManager) {
                    window.customersManager.loadCustomers();
                }
                break;
            case 'products':
                if (window.productsManager) {
                    window.productsManager.loadProducts();
                }
                break;
            case 'orders':
                if (window.ordersManager) {
                    window.ordersManager.loadOrders();
                }
                break;
            case 'reviews':
                if (window.reviewsManager) {
                    window.reviewsManager.loadReviews();
                }
                break;
            case 'reports':
                if (window.reportsManager) {
                    window.reportsManager.loadReports();
                }
                break;
            case 'settings':
                if (window.settingsManager) {
                    window.settingsManager.loadSettings();
                }
                break;
        }
    }

    updateActiveState() {
        // Set dashboard as active by default
        const dashboardItem = document.querySelector('[data-page="dashboard"]');
        if (dashboardItem && !document.querySelector('.nav-item.active')) {
            dashboardItem.classList.add('active');
        }
    }

    handleResize() {
        const width = window.innerWidth;
        
        if (width <= 768) {
            // Mobile view
            this.sidebar.classList.add('mobile');
            if (!this.sidebar.classList.contains('collapsed')) {
                this.sidebar.classList.add('collapsed');
                this.mainContent.classList.add('expanded');
            }
        } else {
            // Desktop view
            this.sidebar.classList.remove('mobile');
        }
    }

    // Public methods for external use
    getCurrentPage() {
        const activeItem = document.querySelector('.nav-item.active');
        return activeItem ? activeItem.getAttribute('data-page') : 'dashboard';
    }

    setActivePage(pageName) {
        this.navigateToPage(pageName);
    }
}

// Breadcrumb functionality
class Breadcrumb {
    constructor() {
        this.container = document.querySelector('.breadcrumb');
        this.items = [];
    }

    add(title, link = null) {
        this.items.push({ title, link });
        this.render();
    }

    clear() {
        this.items = [];
        this.render();
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = this.items.map((item, index) => {
            if (index === this.items.length - 1) {
                return `<span class="breadcrumb-current">${item.title}</span>`;
            } else {
                return item.link ? 
                    `<a href="${item.link}" class="breadcrumb-link">${item.title}</a>` :
                    `<span class="breadcrumb-item">${item.title}</span>`;
            }
        }).join('<i class="fas fa-chevron-right breadcrumb-separator"></i>');
    }
}

// Search functionality
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-box input');
        this.searchResults = null;
        this.init();
    }

    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.debounce(this.search.bind(this), 300));
            this.searchInput.addEventListener('focus', this.showSearchSuggestions.bind(this));
            this.searchInput.addEventListener('blur', this.hideSearchSuggestions.bind(this));
        }
    }

    search(query) {
        if (!query || query.length < 2) {
            this.hideSearchSuggestions();
            return;
        }

        // Search across all data
        const results = this.searchInData(query);
        this.showSearchResults(results);
    }

    searchInData(query) {
        const results = [];
        const currentPage = window.navigation ? window.navigation.getCurrentPage() : 'dashboard';
        
        if (window.salonApp && window.salonApp.sampleData) {
            const data = window.salonApp.sampleData;
            
            // Search customers
            data.customers.forEach(customer => {
                if (customer.name.toLowerCase().includes(query.toLowerCase()) ||
                    customer.email.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        type: 'customer',
                        title: customer.name,
                        subtitle: customer.email,
                        action: () => this.navigateToCustomer(customer.id)
                    });
                }
            });

            // Search products
            data.products.forEach(product => {
                if (product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        type: 'product',
                        title: product.name,
                        subtitle: `$${product.price} - ${product.category}`,
                        action: () => this.navigateToProduct(product.id)
                    });
                }
            });

            // Search orders
            data.orders.forEach(order => {
                if (order.id.toLowerCase().includes(query.toLowerCase()) ||
                    order.customer.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        type: 'order',
                        title: order.id,
                        subtitle: `${order.customer} - $${order.total}`,
                        action: () => this.navigateToOrder(order.id)
                    });
                }
            });
        }

        return results.slice(0, 5); // Limit results
    }

    showSearchResults(results) {
        this.createSearchDropdown();
        
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
        } else {
            this.searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" data-type="${result.type}">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-subtitle">${result.subtitle}</div>
                </div>
            `).join('');

            // Add click listeners
            this.searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
                item.addEventListener('click', results[index].action);
            });
        }
        
        this.searchResults.style.display = 'block';
    }

    createSearchDropdown() {
        if (!this.searchResults) {
            this.searchResults = document.createElement('div');
            this.searchResults.className = 'search-results-dropdown';
            this.searchResults.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-top: none;
                max-height: 300px;
                overflow-y: auto;
                z-index: 1000;
                display: none;
            `;
            
            const searchBox = document.querySelector('.search-box');
            searchBox.style.position = 'relative';
            searchBox.appendChild(this.searchResults);
        }
    }

    showSearchSuggestions() {
        // Show popular searches or recent searches
    }

    hideSearchSuggestions() {
        setTimeout(() => {
            if (this.searchResults) {
                this.searchResults.style.display = 'none';
            }
        }, 200);
    }

    navigateToCustomer(id) {
        window.navigation.setActivePage('customers');
        // Highlight specific customer
    }

    navigateToProduct(id) {
        window.navigation.setActivePage('products');
        // Highlight specific product
    }

    navigateToOrder(id) {
        window.navigation.setActivePage('orders');
        // Highlight specific order
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
    window.breadcrumb = new Breadcrumb();
    window.searchManager = new SearchManager();
});