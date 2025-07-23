// Customer Management
class CustomersManager {
    constructor() {
        this.customers = [];
        this.filteredCustomers = [];
        this.currentSort = { field: 'name', direction: 'asc' };
        this.init();
    }

    init() {
        this.loadCustomers();
        this.setupEventListeners();
        this.setupFormHandlers();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('#customersPage .search-input');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Status filter
        const statusFilter = document.querySelector('#customerStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', this.handleStatusFilter.bind(this));
        }

        // Sort functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sortable')) {
                this.handleSort(e.target.dataset.field);
            }
        });
    }

    setupFormHandlers() {
        const addCustomerForm = document.getElementById('addCustomerForm');
        if (addCustomerForm) {
            addCustomerForm.addEventListener('submit', this.handleAddCustomer.bind(this));
        }
    }

    loadCustomers() {
        if (window.salonApp?.sampleData?.customers) {
            this.customers = [...window.salonApp.sampleData.customers];
            this.filteredCustomers = [...this.customers];
            this.renderCustomersTable();
        }
    }

    renderCustomersTable() {
        const tableBody = document.getElementById('customersTable');
        if (!tableBody) return;

        if (this.filteredCustomers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data">No customers found</td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = this.filteredCustomers.map(customer => `
            <tr data-customer-id="${customer.id}" class="customer-row">
                <td>${customer.id}</td>
                <td>
                    <div class="customer-info">
                        <div class="customer-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="customer-details">
                            <span class="customer-name">${customer.name}</span>
                        </div>
                    </div>
                </td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>
                    <span class="order-count">${customer.orders}</span>
                    <small>orders</small>
                </td>
                <td>
                    <span class="status-badge ${customer.status}">${this.capitalize(customer.status)}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" title="View Details" onclick="window.customersManager.viewCustomer(${customer.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" title="Edit Customer" onclick="window.customersManager.editCustomer(${customer.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" title="Delete Customer" onclick="window.customersManager.deleteCustomer(${customer.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Add click listeners for rows
        tableBody.querySelectorAll('.customer-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (!e.target.closest('.action-buttons')) {
                    const customerId = parseInt(row.dataset.customerId);
                    this.viewCustomer(customerId);
                }
            });
        });
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            this.filteredCustomers = [...this.customers];
        } else {
            this.filteredCustomers = this.customers.filter(customer => 
                customer.name.toLowerCase().includes(query) ||
                customer.email.toLowerCase().includes(query) ||
                customer.phone.includes(query)
            );
        }
        
        this.renderCustomersTable();
    }

    handleStatusFilter(e) {
        const status = e.target.value;
        
        if (status === '') {
            this.filteredCustomers = [...this.customers];
        } else {
            this.filteredCustomers = this.customers.filter(customer => 
                customer.status === status
            );
        }
        
        this.renderCustomersTable();
    }

    handleSort(field) {
        if (this.currentSort.field === field) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.field = field;
            this.currentSort.direction = 'asc';
        }

        this.filteredCustomers.sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];
            
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (this.currentSort.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        this.renderCustomersTable();
        this.updateSortIndicators();
    }

    updateSortIndicators() {
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
            if (header.dataset.field === this.currentSort.field) {
                header.classList.add(`sort-${this.currentSort.direction}`);
            }
        });
    }

    handleAddCustomer(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const customerData = {
            id: this.getNextId(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address') || '',
            orders: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            lastOrder: null
        };

        // Validate data
        if (!this.validateCustomerData(customerData)) {
            return;
        }

        // Add to customers array
        this.customers.push(customerData);
        this.filteredCustomers = [...this.customers];
        
        // Update sample data
        if (window.salonApp?.sampleData?.customers) {
            window.salonApp.sampleData.customers.push(customerData);
        }

        // Re-render table
        this.renderCustomersTable();
        
        // Close modal and reset form
        closeModal('addCustomerModal');
        e.target.reset();
        
        // Show success message
        window.salonApp.showToast(`Customer "${customerData.name}" added successfully!`, 'success');
    }

    validateCustomerData(data) {
        if (!data.name || data.name.trim().length < 2) {
            window.salonApp.showToast('Customer name must be at least 2 characters long', 'error');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            window.salonApp.showToast('Please enter a valid email address', 'error');
            return false;
        }

        if (this.customers.some(c => c.email === data.email)) {
            window.salonApp.showToast('A customer with this email already exists', 'error');
            return false;
        }

        if (!data.phone || data.phone.trim().length < 10) {
            window.salonApp.showToast('Please enter a valid phone number', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    viewCustomer(id) {
        const customer = this.customers.find(c => c.id === id);
        if (!customer) return;

        this.showCustomerModal(customer, 'view');
    }

    editCustomer(id) {
        const customer = this.customers.find(c => c.id === id);
        if (!customer) return;

        this.showCustomerModal(customer, 'edit');
    }

    showCustomerModal(customer, mode) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${mode === 'edit' ? 'Edit' : 'View'} Customer</h3>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="customerDetailsForm">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value="${customer.name}" class="form-control" ${mode === 'view' ? 'readonly' : ''}>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value="${customer.email}" class="form-control" ${mode === 'view' ? 'readonly' : ''}>
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" name="phone" value="${customer.phone}" class="form-control" ${mode === 'view' ? 'readonly' : ''}>
                        </div>
                        <div class="form-group">
                            <label>Address</label>
                            <textarea name="address" class="form-control" ${mode === 'view' ? 'readonly' : ''}>${customer.address || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label>Status</label>
                            <select name="status" class="form-control" ${mode === 'view' ? 'disabled' : ''}>
                                <option value="active" ${customer.status === 'active' ? 'selected' : ''}>Active</option>
                                <option value="inactive" ${customer.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                            </select>
                        </div>
                        <div class="customer-stats">
                            <div class="stat-item">
                                <span class="stat-label">Total Orders:</span>
                                <span class="stat-value">${customer.orders}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Member Since:</span>
                                <span class="stat-value">${window.salonApp.formatDate(customer.createdAt || '2024-01-01')}</span>
                            </div>
                        </div>
                        ${mode === 'edit' ? `
                            <div class="modal-actions">
                                <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                                <button type="submit" class="btn-primary">Save Changes</button>
                            </div>
                        ` : `
                            <div class="modal-actions">
                                <button type="button" class="btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                                <button type="button" class="btn-primary" onclick="window.customersManager.editCustomer(${customer.id}); this.closest('.modal').remove();">Edit Customer</button>
                            </div>
                        `}
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        if (mode === 'edit') {
            const form = modal.querySelector('#customerDetailsForm');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateCustomer(customer.id, new FormData(e.target));
                modal.remove();
            });
        }
    }

    updateCustomer(id, formData) {
        const customerIndex = this.customers.findIndex(c => c.id === id);
        if (customerIndex === -1) return;

        const updatedData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            status: formData.get('status')
        };

        // Validate updated data
        const tempCustomer = { ...this.customers[customerIndex], ...updatedData };
        if (!this.validateCustomerData(tempCustomer)) {
            return;
        }

        // Update customer
        this.customers[customerIndex] = { ...this.customers[customerIndex], ...updatedData };
        this.filteredCustomers = [...this.customers];

        // Update sample data
        if (window.salonApp?.sampleData?.customers) {
            const sampleIndex = window.salonApp.sampleData.customers.findIndex(c => c.id === id);
            if (sampleIndex !== -1) {
                window.salonApp.sampleData.customers[sampleIndex] = this.customers[customerIndex];
            }
        }

        this.renderCustomersTable();
        window.salonApp.showToast('Customer updated successfully!', 'success');
    }

    deleteCustomer(id) {
        const customer = this.customers.find(c => c.id === id);
        if (!customer) return;

        if (confirm(`Are you sure you want to delete customer "${customer.name}"?`)) {
            // Remove from arrays
            this.customers = this.customers.filter(c => c.id !== id);
            this.filteredCustomers = this.filteredCustomers.filter(c => c.id !== id);

            // Update sample data
            if (window.salonApp?.sampleData?.customers) {
                window.salonApp.sampleData.customers = window.salonApp.sampleData.customers.filter(c => c.id !== id);
            }

            this.renderCustomersTable();
            window.salonApp.showToast(`Customer "${customer.name}" deleted successfully!`, 'success');
        }
    }

    exportCustomers() {
        if (this.customers.length === 0) {
            window.salonApp.showToast('No customers to export', 'error');
            return;
        }

        const csvContent = this.convertCustomersToCSV();
        this.downloadCSV(csvContent, 'customers-export.csv');
        window.salonApp.showToast('Customers exported successfully!', 'success');
    }

    convertCustomersToCSV() {
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Orders', 'Status', 'Created At'];
        const csvRows = [headers.join(',')];

        this.customers.forEach(customer => {
            const row = [
                customer.id,
                `"${customer.name}"`,
                customer.email,
                customer.phone,
                customer.orders,
                customer.status,
                customer.createdAt || '2024-01-01'
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    getNextId() {
        return Math.max(...this.customers.map(c => c.id), 0) + 1;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Customer analytics
    getCustomerStats() {
        return {
            total: this.customers.length,
            active: this.customers.filter(c => c.status === 'active').length,
            inactive: this.customers.filter(c => c.status === 'inactive').length,
            totalOrders: this.customers.reduce((sum, c) => sum + c.orders, 0),
            averageOrdersPerCustomer: this.customers.length > 0 ? 
                (this.customers.reduce((sum, c) => sum + c.orders, 0) / this.customers.length).toFixed(1) : 0
        };
    }
}

// Initialize customers manager
document.addEventListener('DOMContentLoaded', () => {
    window.customersManager = new CustomersManager();
});