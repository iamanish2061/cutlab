// Reports and Analytics System
class ReportsManager {
    constructor() {
        this.salesData = this.generateSalesData();
        this.customerData = this.generateCustomerData();
        this.charts = {};
        this.init();
    }

    init() {
        // Initialize charts when the reports page is shown
        if (document.getElementById('salesReportChart')) {
            this.initializeCharts();
        }
    }

    generateSalesData() {
        // Generate sample sales data for the last 12 months
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        
        return months.map((month, index) => {
            const baseValue = 30000 + Math.random() * 20000;
            const seasonalMultiplier = index < currentMonth ? 1 : 0.7; // Future months lower
            return {
                month,
                sales: Math.round(baseValue * seasonalMultiplier),
                orders: Math.round((baseValue / 85) * seasonalMultiplier),
                customers: Math.round((baseValue / 170) * seasonalMultiplier)
            };
        });
    }

    generateCustomerData() {
        // Generate customer growth data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let cumulativeCustomers = 1500;
        
        return months.map((month, index) => {
            const growth = Math.round(50 + Math.random() * 100);
            if (index <= new Date().getMonth()) {
                cumulativeCustomers += growth;
            }
            return {
                month,
                newCustomers: index <= new Date().getMonth() ? growth : 0,
                totalCustomers: index <= new Date().getMonth() ? cumulativeCustomers : null
            };
        });
    }

    initializeCharts() {
        this.createSalesChart();
        this.createCustomerGrowthChart();
    }

    createSalesChart() {
        const canvas = document.getElementById('salesReportChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.salesData.filter(item => item.sales > 0);

        // Simple chart implementation
        this.drawChart(ctx, {
            type: 'line',
            data: data,
            xField: 'month',
            yField: 'sales',
            title: 'Monthly Sales Revenue',
            color: '#3B82F6'
        });

        this.charts.salesReport = { canvas, data };
    }

    createCustomerGrowthChart() {
        const canvas = document.getElementById('customerGrowthChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = this.customerData.filter(item => item.totalCustomers !== null);

        this.drawChart(ctx, {
            type: 'bar',
            data: data,
            xField: 'month',
            yField: 'newCustomers',
            title: 'New Customers per Month',
            color: '#10B981'
        });

        this.charts.customerGrowth = { canvas, data };
    }

    drawChart(ctx, options) {
        const { data, xField, yField, title, color, type } = options;
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 60;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set font
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';

        // Get min and max values
        const values = data.map(item => item[yField]);
        const minValue = 0;
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue;

        // Draw title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(title, width / 2, 25);

        // Draw axes
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Y-axis
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        // X-axis
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw Y-axis labels
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        const ySteps = 5;
        for (let i = 0; i <= ySteps; i++) {
            const value = (maxValue / ySteps) * i;
            const y = height - padding - (chartHeight / ySteps) * i;
            ctx.fillText(this.formatValue(value), padding - 10, y + 3);
            
            // Draw grid lines
            if (i > 0) {
                ctx.strokeStyle = '#f0f0f0';
                ctx.beginPath();
                ctx.moveTo(padding, y);
                ctx.lineTo(width - padding, y);
                ctx.stroke();
            }
        }

        // Draw chart data
        if (type === 'line') {
            this.drawLineChart(ctx, data, xField, yField, color, padding, chartWidth, chartHeight, minValue, valueRange);
        } else if (type === 'bar') {
            this.drawBarChart(ctx, data, xField, yField, color, padding, chartWidth, chartHeight, minValue, valueRange);
        }

        // Draw X-axis labels
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        data.forEach((item, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            ctx.fillText(item[xField], x, height - padding + 20);
        });
    }

    drawLineChart(ctx, data, xField, yField, color, padding, chartWidth, chartHeight, minValue, valueRange) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((item, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((item[yField] - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw points
        ctx.fillStyle = color;
        data.forEach((item, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((item[yField] - minValue) / valueRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    drawBarChart(ctx, data, xField, yField, color, padding, chartWidth, chartHeight, minValue, valueRange) {
        const barWidth = (chartWidth / data.length) * 0.6;
        const barSpacing = (chartWidth / data.length) * 0.4;

        ctx.fillStyle = color;
        
        data.forEach((item, index) => {
            const x = padding + (chartWidth / data.length) * index + barSpacing / 2;
            const barHeight = ((item[yField] - minValue) / valueRange) * chartHeight;
            const y = padding + chartHeight - barHeight;
            
            ctx.fillRect(x, y, barWidth, barHeight);
        });
    }

    formatValue(value) {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}k`;
        }
        return value.toString();
    }

    generateReport(type, dateRange = 'thisMonth') {
        const report = {
            type,
            dateRange,
            generatedAt: new Date().toISOString(),
            data: {}
        };

        switch (type) {
            case 'sales':
                report.data = this.generateSalesReport(dateRange);
                break;
            case 'customers':
                report.data = this.generateCustomerReport(dateRange);
                break;
            case 'products':
                report.data = this.generateProductReport(dateRange);
                break;
            case 'comprehensive':
                report.data = {
                    sales: this.generateSalesReport(dateRange),
                    customers: this.generateCustomerReport(dateRange),
                    products: this.generateProductReport(dateRange)
                };
                break;
        }

        return report;
    }

    generateSalesReport(dateRange) {
        const currentMonth = this.salesData[new Date().getMonth()];
        const lastMonth = this.salesData[new Date().getMonth() - 1] || this.salesData[11];
        
        return {
            totalSales: currentMonth.sales,
            totalOrders: currentMonth.orders,
            averageOrderValue: Math.round(currentMonth.sales / currentMonth.orders),
            growthRate: Math.round(((currentMonth.sales - lastMonth.sales) / lastMonth.sales) * 100),
            monthlyData: this.salesData.filter(item => item.sales > 0),
            topPerformingPeriods: this.salesData
                .filter(item => item.sales > 0)
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 3)
        };
    }

    generateCustomerReport(dateRange) {
        const totalCustomers = this.customerData[this.customerData.length - 1]?.totalCustomers || 0;
        const currentMonth = this.customerData[new Date().getMonth()];
        
        return {
            totalCustomers,
            newCustomersThisMonth: currentMonth?.newCustomers || 0,
            customerRetentionRate: 87, // Sample rate
            averageLifetimeValue: 245, // Sample value
            monthlyGrowth: this.customerData.filter(item => item.totalCustomers !== null),
            customerSegments: [
                { segment: 'New Customers', count: 156, percentage: 25 },
                { segment: 'Regular Customers', count: 423, percentage: 68 },
                { segment: 'VIP Customers', count: 43, percentage: 7 }
            ]
        };
    }

    generateProductReport(dateRange) {
        return {
            totalProducts: 156,
            topSellingProducts: [
                { name: 'Hair Serum Premium', sales: 234, revenue: 10530 },
                { name: 'Face Cream Deluxe', sales: 187, revenue: 16743 },
                { name: 'Shampoo Organic', sales: 156, revenue: 5460 }
            ],
            categoryPerformance: [
                { category: 'Hair Care', revenue: 25600, percentage: 45 },
                { category: 'Skincare', revenue: 18400, percentage: 32 },
                { category: 'Tools', revenue: 8900, percentage: 16 },
                { category: 'Makeup', revenue: 4100, percentage: 7 }
            ],
            lowStockItems: [
                { name: 'Hair Dryer Pro', stock: 3 },
                { name: 'Nail Polish Set', stock: 7 },
                { name: 'Makeup Brush Kit', stock: 5 }
            ]
        };
    }

    exportReport(reportType, format = 'pdf') {
        const report = this.generateReport(reportType);
        
        if (format === 'csv') {
            this.exportAsCSV(report);
        } else if (format === 'json') {
            this.exportAsJSON(report);
        } else {
            this.showReportModal(report);
        }
    }

    exportAsCSV(report) {
        let csvContent = '';
        
        if (report.data.sales) {
            csvContent += 'Sales Report\n';
            csvContent += 'Month,Sales,Orders,AOV\n';
            report.data.sales.monthlyData.forEach(item => {
                const aov = Math.round(item.sales / item.orders);
                csvContent += `${item.month},${item.sales},${item.orders},${aov}\n`;
            });
            csvContent += '\n';
        }

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.type}_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    exportAsJSON(report) {
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.type}_report_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    showReportModal(report) {
        const modalHTML = `
            <div class="modal-overlay" onclick="this.remove()">
                <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
                    <div class="modal-header">
                        <h3>${this.capitalizeFirst(report.type)} Report</h3>
                        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${this.formatReportContent(report)}
                    </div>
                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
                        <button class="btn-primary" onclick="reportsManager.exportAsCSV(${JSON.stringify(report).replace(/"/g, '&quot;')})">Export CSV</button>
                        <button class="btn-primary" onclick="reportsManager.exportAsJSON(${JSON.stringify(report).replace(/"/g, '&quot;')})">Export JSON</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    formatReportContent(report) {
        let content = `<div class="report-content">`;
        
        if (report.data.sales) {
            content += `
                <div class="report-section">
                    <h4>Sales Overview</h4>
                    <div class="stats-row">
                        <div class="stat">
                            <label>Total Sales:</label>
                            <span>${report.data.sales.totalSales.toLocaleString()}</span>
                        </div>
                        <div class="stat">
                            <label>Total Orders:</label>
                            <span>${report.data.sales.totalOrders}</span>
                        </div>
                        <div class="stat">
                            <label>Average Order Value:</label>
                            <span>${report.data.sales.averageOrderValue}</span>
                        </div>
                        <div class="stat">
                            <label>Growth Rate:</label>
                            <span class="${report.data.sales.growthRate >= 0 ? 'positive' : 'negative'}">
                                ${report.data.sales.growthRate}%
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }

        if (report.data.customers) {
            content += `
                <div class="report-section">
                    <h4>Customer Analytics</h4>
                    <div class="stats-row">
                        <div class="stat">
                            <label>Total Customers:</label>
                            <span>${report.data.customers.totalCustomers}</span>
                        </div>
                        <div class="stat">
                            <label>New This Month:</label>
                            <span>${report.data.customers.newCustomersThisMonth}</span>
                        </div>
                        <div class="stat">
                            <label>Retention Rate:</label>
                            <span>${report.data.customers.customerRetentionRate}%</span>
                        </div>
                        <div class="stat">
                            <label>Avg. Lifetime Value:</label>
                            <span>${report.data.customers.averageLifetimeValue}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        if (report.data.products) {
            content += `
                <div class="report-section">
                    <h4>Product Performance</h4>
                    <div class="top-products">
                        <h5>Top Selling Products</h5>
                        ${report.data.products.topSellingProducts.map(product => `
                            <div class="product-item">
                                <span>${product.name}</span>
                                <div>
                                    <span>${product.sales} sales</span>
                                    <span>${product.revenue.toLocaleString()}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        content += `</div>`;
        return content;
    }

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Dashboard integration methods
    updateDashboardCharts() {
        // Update main dashboard charts with latest data
        const salesOverviewChart = document.getElementById('salesChart');
        if (salesOverviewChart) {
            this.updateSalesOverviewChart(salesOverviewChart);
        }
    }

    updateSalesOverviewChart(canvas) {
        const ctx = canvas.getContext('2d');
        const recentData = this.salesData.slice(-6); // Last 6 months
        
        this.drawChart(ctx, {
            type: 'line',
            data: recentData,
            xField: 'month',
            yField: 'sales',
            title: 'Sales Trend (Last 6 Months)',
            color: '#3B82F6'
        });
    }

    scheduleReport(type, frequency, email) {
        // In a real application, this would set up automated report generation
        const schedule = {
            type,
            frequency, // daily, weekly, monthly
            email,
            nextRun: this.calculateNextRun(frequency),
            created: new Date().toISOString()
        };

        // Store in local storage for demo purposes
        const schedules = JSON.parse(localStorage.getItem('reportSchedules') || '[]');
        schedules.push(schedule);
        localStorage.setItem('reportSchedules', JSON.stringify(schedules));

        this.showNotification(`Report scheduled successfully! Next run: ${schedule.nextRun}`, 'success');
        return schedule;
    }

    calculateNextRun(frequency) {
        const now = new Date();
        switch (frequency) {
            case 'daily':
                now.setDate(now.getDate() + 1);
                break;
            case 'weekly':
                now.setDate(now.getDate() + 7);
                break;
            case 'monthly':
                now.setMonth(now.getMonth() + 1);
                break;
        }
        return now.toLocaleDateString();
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
}

// Initialize reports manager
let reportsManager;

document.addEventListener('DOMContentLoaded', () => {
    reportsManager = new ReportsManager();
});

// Add report-specific styles
const reportStyles = document.createElement('style');
reportStyles.textContent = `
    .report-content {
        padding: 1rem 0;
    }
    
    .report-section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #eee;
    }
    
    .report-section:last-child {
        border-bottom: none;
    }
    
    .report-section h4 {
        margin: 0 0 1rem 0;
        color: #333;
        font-weight: 600;
    }
    
    .report-section h5 {
        margin: 0 0 0.5rem 0;
        color: #555;
        font-weight: 500;
    }
    
    .stats-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .stat {
        display: flex;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background: #f8f9fa;
        border-radius: 6px;
        border-left: 3px solid #3B82F6;
    }
    
    .stat label {
        font-weight: 500;
        color: #666;
    }
    
    .stat span {
        font-weight: 600;
        color: #333;
    }
    
    .stat span.positive {
        color: #10B981;
    }
    
    .stat span.negative {
        color: #EF4444;
    }
    
    .product-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .product-item:last-child {
        border-bottom: none;
    }
    
    .product-item > div {
        display: flex;
        gap: 1rem;
        color: #666;
        font-size: 0.9rem;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
`;
document.head.appendChild(reportStyles);