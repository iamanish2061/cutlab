// Dashboard functionality
class DashboardManager {
    constructor() {
        this.charts = {};
        this.init();
    }

    init() {
        this.loadDashboard();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Refresh dashboard every 5 minutes
        setInterval(() => {
            this.refreshStats();
        }, 300000);

        // Handle stat card clicks
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', this.handleStatCardClick.bind(this));
        });
    }

    loadDashboard() {
        this.loadStats();
        this.loadCharts();
        this.loadRecentOrders();
    }

    loadStats() {
        // Simulate loading stats with animation
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }, index * 100);
        });

        // Update stats with real data
        this.updateStatCard('customers', {
            value: '2,847',
            change: '+12.5%',
            trend: 'positive'
        });

        this.updateStatCard('products', {
            value: '156',
            change: '+8.2%',
            trend: 'positive'
        });

        this.updateStatCard('orders', {
            value: '1,429',
            change: '+23.1%',
            trend: 'positive'
        });

        this.updateStatCard('revenue', {
            value: '$48,392',
            change: '+18.7%',
            trend: 'positive'
        });
    }

    updateStatCard(type, data) {
        const card = document.querySelector(`.stat-icon.${type}`)?.closest('.stat-card');
        if (!card) return;

        const valueElement = card.querySelector('h3');
        const changeElement = card.querySelector('.change');

        if (valueElement) {
            this.animateValue(valueElement, data.value);
        }

        if (changeElement) {
            changeElement.textContent = data.change;
            changeElement.className = `change ${data.trend}`;
        }
    }

    animateValue(element, targetValue) {
        const currentValue = element.textContent;
        
        // Simple number animation for revenue
        if (targetValue.includes('$')) {
            const target = parseFloat(targetValue.replace(/[$,]/g, ''));
            const current = parseFloat(currentValue.replace(/[$,]/g, '')) || 0;
            const increment = (target - current) / 20;
            let currentNum = current;

            const timer = setInterval(() => {
                currentNum += increment;
                if (currentNum >= target) {
                    currentNum = target;
                    clearInterval(timer);
                }
                element.textContent = '$' + Math.floor(currentNum).toLocaleString();
            }, 50);
        } else {
            element.textContent = targetValue;
        }
    }

    loadCharts() {
        this.loadSalesChart();
        // Add more charts as needed
    }

    loadSalesChart() {
        const canvas = document.getElementById('salesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Create a simple line chart without external libraries
        this.drawSalesChart(ctx, canvas);
    }

    drawSalesChart(ctx, canvas) {
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Sample data
        const data = [120, 190, 300, 500, 200, 300, 450, 380, 420, 520, 680, 750];
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        // Find max value for scaling
        const maxValue = Math.max(...data);
        const stepX = chartWidth / (data.length - 1);
        const stepY = chartHeight / maxValue;
        
        // Draw grid lines
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        // Vertical grid lines
        for (let i = 0; i < data.length; i++) {
            const x = padding + (i * stepX);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i * chartHeight / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw the line
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (index * stepX);
            const y = height - padding - (value * stepY);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#6366F1';
        data.forEach((value, index) => {
            const x = padding + (index * stepX);
            const y = height - padding - (value * stepY);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        labels.forEach((label, index) => {
            const x = padding + (index * stepX);
            ctx.fillText(label, x, height - 10);
        });
    }

    loadRecentOrders() {
        const ordersContainer = document.querySelector('.orders-list');
        if (!ordersContainer || !window.salonApp?.sampleData) return;

        const orders = window.salonApp.sampleData.orders.slice(0, 3);
        
        ordersContainer.innerHTML = orders.map(order => `
            <div class="order-item" data-order-id="${order.id}">
                <div class="order-info">
                    <span class="order-id">${order.id}</span>
                    <span class="customer">${order.customer}</span>
                </div>
                <div class="order-status">
                    <span class="status ${order.status}">${this.capitalize(order.status)}</span>
                    <span class="amount">${window.salonApp.formatCurrency(order.total)}</span>
                </div>
            </div>
        `).join('');

        // Add click listeners
        ordersContainer.querySelectorAll('.order-item').forEach(item => {
            item.addEventListener('click', () => {
                const orderId = item.dataset.orderId;
                this.viewOrderDetails(orderId);
            });
        });
    }

    viewOrderDetails(orderId) {
        // Navigate to orders page and highlight specific order
        if (window.navigation) {
            window.navigation.setActivePage('orders');
        }
        
        // Show order details modal or highlight row
        setTimeout(() => {
            const orderRow = document.querySelector(`[data-order-id="${orderId}"]`);
            if (orderRow) {
                orderRow.style.backgroundColor = '#f0f9ff';
                setTimeout(() => {
                    orderRow.style.backgroundColor = '';
                }, 2000);
            }
        }, 500);
    }

    refreshStats() {
        // Simulate data refresh
        const stats = {
            customers: Math.floor(Math.random() * 1000) + 2000,
            products: Math.floor(Math.random() * 50) + 100,
            orders: Math.floor(Math.random() * 500) + 1000,
            revenue: Math.floor(Math.random() * 20000) + 30000
        };

        // Update stat cards with new data
        Object.keys(stats).forEach(key => {
            const change = (Math.random() * 40 - 20).toFixed(1);
            this.updateStatCard(key, {
                value: key === 'revenue' ? `$${stats[key].toLocaleString()}` : stats[key].toLocaleString(),
                change: `${change > 0 ? '+' : ''}${change}%`,
                trend: change > 0 ? 'positive' : 'negative'
            });
        });
    }

    handleStatCardClick(event) {
        const card = event.currentTarget;
        const iconClass = card.querySelector('.stat-icon i').className;
        
        // Navigate to relevant page based on stat card
        if (iconClass.includes('fa-users')) {
            window.navigation?.setActivePage('customers');
        } else if (iconClass.includes('fa-shopping-bag')) {
            window.navigation?.setActivePage('products');
        } else if (iconClass.includes('fa-shopping-cart')) {
            window.navigation?.setActivePage('orders');
        } else if (iconClass.includes('fa-dollar-sign')) {
            window.navigation?.setActivePage('reports');
        }
    }

    // Quick actions
    addQuickActions() {
        const quickActionsHtml = `
            <div class="quick-actions">
                <h3>Quick Actions</h3>
                <div class="action-buttons">
                    <button class="action-btn" onclick="showAddProductModal()">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                    <button class="action-btn" onclick="showAddCustomerModal()">
                        <i class="fas fa-user-plus"></i> Add Customer
                    </button>
                    <button class="action-btn" onclick="window.dashboardManager.exportData()">
                        <i class="fas fa-download"></i> Export Data
                    </button>
                    <button class="action-btn" onclick="window.dashboardManager.generateReport()">
                        <i class="fas fa-file-alt"></i> Generate Report
                    </button>
                </div>
            </div>
        `;
        
        const dashboardGrid = document.querySelector('.dashboard-grid');
        if (dashboardGrid) {
            dashboardGrid.insertAdjacentHTML('beforeend', quickActionsHtml);
        }
    }

    exportData() {
        if (!window.salonApp?.sampleData) return;
        
        // Create CSV data
        const csvData = this.convertToCSV(window.salonApp.sampleData);
        
        // Download CSV
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'salon-data-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        
        window.salonApp.showToast('Data exported successfully!', 'success');
    }

    convertToCSV(data) {
        let csv = 'Type,ID,Name,Email,Phone,Status,Orders,Total\n';
        
        // Add customer data
        data.customers.forEach(customer => {
            csv += `Customer,${customer.id},${customer.name},${customer.email},${customer.phone},${customer.status},${customer.orders},\n`;
        });
        
        return csv;
    }

    generateReport() {
        const reportData = this.calculateReportData();
        this.displayReportSummary(reportData);
        window.salonApp.showToast('Report generated successfully!', 'success');
    }

    calculateReportData() {
        if (!window.salonApp?.sampleData) return {};
        
        const data = window.salonApp.sampleData;
        
        return {
            totalCustomers: data.customers.length,
            activeCustomers: data.customers.filter(c => c.status === 'active').length,
            totalProducts: data.products.length,
            lowStockProducts: data.products.filter(p => p.stock < 20).length,
            totalOrders: data.orders.length,
            completedOrders: data.orders.filter(o => o.status === 'completed').length,
            totalRevenue: data.orders.reduce((sum, order) => sum + order.total, 0),
            averageOrderValue: data.orders.reduce((sum, order) => sum + order.total, 0) / data.orders.length
        };
    }

    displayReportSummary(data) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Dashboard Report Summary</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="report-stats">
                        <div class="report-stat">
                            <span class="label">Total Customers:</span>
                            <span class="value">${data.totalCustomers}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">Active Customers:</span>
                            <span class="value">${data.activeCustomers}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">Total Products:</span>
                            <span class="value">${data.totalProducts}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">Low Stock Products:</span>
                            <span class="value">${data.lowStockProducts}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">Total Orders:</span>
                            <span class="value">${data.totalOrders}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">Completed Orders:</span>
                            <span class="value">${data.completedOrders}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">Total Revenue:</span>
                            <span class="value">${window.salonApp.formatCurrency(data.totalRevenue)}</span>
                        </div>
                        <div class="report-stat">
                            <span class="label">Average Order Value:</span>
                            <span class="value">${window.salonApp.formatCurrency(data.averageOrderValue)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Widget management
    addWidget(type, container) {
        const widgets = {
            topProducts: this.createTopProductsWidget(),
            customerGrowth: this.createCustomerGrowthWidget(),
            orderStatus: this.createOrderStatusWidget(),
            revenueGoal: this.createRevenueGoalWidget()
        };
        
        if (widgets[type] && container) {
            container.appendChild(widgets[type]);
        }
    }

    createTopProductsWidget() {
        const widget = document.createElement('div');
        widget.className = 'dashboard-widget';
        widget.innerHTML = `
            <h3>Top Products</h3>
            <div class="top-products-list">
                <div class="product-item">
                    <span class="product-name">Premium Hair Shampoo</span>
                    <span class="product-sales">45 sales</span>
                </div>
                <div class="product-item">
                    <span class="product-name">Anti-Aging Serum</span>
                    <span class="product-sales">38 sales</span>
                </div>
                <div class="product-item">
                    <span class="product-name">Organic Face Mask</span>
                    <span class="product-sales">32 sales</span>
                </div>
            </div>
        `;
        return widget;
    }

    createCustomerGrowthWidget() {
        const widget = document.createElement('div');
        widget.className = 'dashboard-widget';
        widget.innerHTML = `
            <h3>Customer Growth</h3>
            <div class="growth-stats">
                <div class="growth-item">
                    <span class="period">This Month</span>
                    <span class="growth positive">+156</span>
                </div>
                <div class="growth-item">
                    <span class="period">Last Month</span>
                    <span class="growth">+142</span>
                </div>
                <div class="growth-item">
                    <span class="period">Growth Rate</span>
                    <span class="growth positive">+9.8%</span>
                </div>
            </div>
        `;
        return widget;
    }

    createOrderStatusWidget() {
        const widget = document.createElement('div');
        widget.className = 'dashboard-widget';
        widget.innerHTML = `
            <h3>Order Status</h3>
            <div class="status-breakdown">
                <div class="status-item">
                    <span class="status-label">Completed</span>
                    <span class="status-count">245</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Processing</span>
                    <span class="status-count">32</span>
                </div>
                <div class="status-item">
                    <span class="status-label">Pending</span>
                    <span class="status-count">18</span>
                </div>
            </div>
        `;
        return widget;
    }

    createRevenueGoalWidget() {
        const widget = document.createElement('div');
        widget.className = 'dashboard-widget';
        widget.innerHTML = `
            <h3>Revenue Goal</h3>
            <div class="goal-progress">
                <div class="goal-amount">
                    <span class="current">$48,392</span>
                    <span class="target">/ $60,000</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 80.65%"></div>
                </div>
                <span class="progress-text">80.65% of monthly goal</span>
            </div>
        `;
        return widget;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize dashboard manager
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});