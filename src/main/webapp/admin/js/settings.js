// Settings Management
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initializeSettings();
        this.bindEvents();
    }

    // Load settings from localStorage or use defaults
    loadSettings() {
        const defaultSettings = {
            siteName: 'SalonHub',
            siteDescription: 'Premium salon products and services',
            theme: 'light',
            notifications: {
                email: true,
                push: true,
                sms: false
            },
            business: {
                currency: 'USD',
                timezone: 'UTC',
                language: 'en'
            },
            display: {
                itemsPerPage: 10,
                dateFormat: 'MM/DD/YYYY',
                showAnimations: true
            }
        };

        try {
            const savedSettings = JSON.parse(window.localStorage?.getItem('salonSettings') || '{}');
            return { ...defaultSettings, ...savedSettings };
        } catch (error) {
            console.warn('Failed to load settings from localStorage:', error);
            return defaultSettings;
        }
    }

    // Save settings to localStorage
    saveSettings() {
        try {
            if (window.localStorage) {
                window.localStorage.setItem('salonSettings', JSON.stringify(this.settings));
            }
            this.showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showNotification('Failed to save settings', 'error');
        }
    }

    // Initialize settings form with current values
    initializeSettings() {
        // General Settings
        const siteNameInput = document.querySelector('input[type="text"][value="SalonHub"]');
        if (siteNameInput) {
            siteNameInput.value = this.settings.siteName;
        }

        const siteDescInput = document.querySelector('textarea');
        if (siteDescInput) {
            siteDescInput.value = this.settings.siteDescription;
        }

        const themeSelector = document.getElementById('themeSelector');
        if (themeSelector) {
            themeSelector.value = this.settings.theme;
        }

        // Apply current theme
        this.applyTheme(this.settings.theme);

        // Create additional settings sections
        this.createAdvancedSettings();
    }

    // Create advanced settings sections
    createAdvancedSettings() {
        const settingsContainer = document.querySelector('.settings-container');
        if (!settingsContainer) return;

        // Notification Settings
        const notificationSection = this.createSettingsSection('Notification Settings', [
            { type: 'checkbox', name: 'emailNotifications', label: 'Email Notifications', checked: this.settings.notifications.email },
            { type: 'checkbox', name: 'pushNotifications', label: 'Push Notifications', checked: this.settings.notifications.push },
            { type: 'checkbox', name: 'smsNotifications', label: 'SMS Notifications', checked: this.settings.notifications.sms }
        ]);

        // Business Settings
        const businessSection = this.createSettingsSection('Business Settings', [
            { 
                type: 'select', 
                name: 'currency', 
                label: 'Currency',
                value: this.settings.business.currency,
                options: [
                    { value: 'USD', text: 'US Dollar ($)' },
                    { value: 'EUR', text: 'Euro (€)' },
                    { value: 'GBP', text: 'British Pound (£)' },
                    { value: 'CAD', text: 'Canadian Dollar (C$)' }
                ]
            },
            {
                type: 'select',
                name: 'timezone',
                label: 'Timezone',
                value: this.settings.business.timezone,
                options: [
                    { value: 'UTC', text: 'UTC' },
                    { value: 'America/New_York', text: 'Eastern Time' },
                    { value: 'America/Chicago', text: 'Central Time' },
                    { value: 'America/Denver', text: 'Mountain Time' },
                    { value: 'America/Los_Angeles', text: 'Pacific Time' }
                ]
            }
        ]);

        // Display Settings
        const displaySection = this.createSettingsSection('Display Settings', [
            {
                type: 'select',
                name: 'itemsPerPage',
                label: 'Items per Page',
                value: this.settings.display.itemsPerPage,
                options: [
                    { value: 5, text: '5' },
                    { value: 10, text: '10' },
                    { value: 25, text: '25' },
                    { value: 50, text: '50' }
                ]
            },
            {
                type: 'select',
                name: 'dateFormat',
                label: 'Date Format',
                value: this.settings.display.dateFormat,
                options: [
                    { value: 'MM/DD/YYYY', text: 'MM/DD/YYYY' },
                    { value: 'DD/MM/YYYY', text: 'DD/MM/YYYY' },
                    { value: 'YYYY-MM-DD', text: 'YYYY-MM-DD' }
                ]
            },
            { type: 'checkbox', name: 'showAnimations', label: 'Show Animations', checked: this.settings.display.showAnimations }
        ]);

        // Append sections
        settingsContainer.appendChild(notificationSection);
        settingsContainer.appendChild(businessSection);
        settingsContainer.appendChild(displaySection);
    }

    // Create a settings section
    createSettingsSection(title, fields) {
        const section = document.createElement('div');
        section.className = 'settings-section';
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        section.appendChild(titleElement);

        fields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            const label = document.createElement('label');
            label.textContent = field.label;
            formGroup.appendChild(label);

            let input;
            if (field.type === 'checkbox') {
                input = document.createElement('input');
                input.type = 'checkbox';
                input.name = field.name;
                input.checked = field.checked;
                input.className = 'form-checkbox';
            } else if (field.type === 'select') {
                input = document.createElement('select');
                input.name = field.name;
                input.className = 'form-control';
                
                field.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.text;
                    if (option.value == field.value) {
                        optionElement.selected = true;
                    }
                    input.appendChild(optionElement);
                });
            } else {
                input = document.createElement('input');
                input.type = field.type;
                input.name = field.name;
                input.value = field.value || '';
                input.className = 'form-control';
            }

            formGroup.appendChild(input);
            section.appendChild(formGroup);
        });

        // Add save button for each section
        const saveButton = document.createElement('button');
        saveButton.className = 'btn-primary';
        saveButton.textContent = `Save ${title}`;
        saveButton.addEventListener('click', () => this.saveSection(section));
        section.appendChild(saveButton);

        return section;
    }

    // Bind event listeners
    bindEvents() {
        // Theme selector change
        const themeSelector = document.getElementById('themeSelector');
        if (themeSelector) {
            themeSelector.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.applyTheme(e.target.value);
                this.saveSettings();
            });
        }

        // Main save button
        const saveButton = document.querySelector('.settings-section .btn-primary');
        if (saveButton) {
            saveButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveGeneralSettings();
            });
        }

        // Export/Import settings
        this.createImportExportButtons();
    }

    // Save general settings
    saveGeneralSettings() {
        const siteNameInput = document.querySelector('input[type="text"]');
        const siteDescInput = document.querySelector('textarea');

        if (siteNameInput) {
            this.settings.siteName = siteNameInput.value;
        }
        
        if (siteDescInput) {
            this.settings.siteDescription = siteDescInput.value;
        }

        this.saveSettings();
    }

    // Save a specific section
    saveSection(section) {
        const inputs = section.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            const name = input.name;
            let value;

            if (input.type === 'checkbox') {
                value = input.checked;
            } else if (input.type === 'number') {
                value = parseInt(input.value) || 0;
            } else {
                value = input.value;
            }

            // Update settings based on input name
            if (name === 'emailNotifications') {
                this.settings.notifications.email = value;
            } else if (name === 'pushNotifications') {
                this.settings.notifications.push = value;
            } else if (name === 'smsNotifications') {
                this.settings.notifications.sms = value;
            } else if (name === 'currency') {
                this.settings.business.currency = value;
            } else if (name === 'timezone') {
                this.settings.business.timezone = value;
            } else if (name === 'itemsPerPage') {
                this.settings.display.itemsPerPage = value;
            } else if (name === 'dateFormat') {
                this.settings.display.dateFormat = value;
            } else if (name === 'showAnimations') {
                this.settings.display.showAnimations = value;
                this.toggleAnimations(value);
            }
        });

        this.saveSettings();
    }

    // Apply theme
    applyTheme(theme) {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('light-theme', 'dark-theme');
        
        if (theme === 'dark') {
            body.classList.add('dark-theme');
        } else if (theme === 'auto') {
            // Check system preference
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                body.classList.add('dark-theme');
            } else {
                body.classList.add('light-theme');
            }
        } else {
            body.classList.add('light-theme');
        }
    }

    // Toggle animations
    toggleAnimations(enabled) {
        const body = document.body;
        if (enabled) {
            body.classList.remove('no-animations');
        } else {
            body.classList.add('no-animations');
        }
    }

    // Create import/export functionality
    createImportExportButtons() {
        const settingsContainer = document.querySelector('.settings-container');
        if (!settingsContainer) return;

        const actionsSection = document.createElement('div');
        actionsSection.className = 'settings-section';
        
        const title = document.createElement('h3');
        title.textContent = 'Data Management';
        actionsSection.appendChild(title);

        // Export button
        const exportButton = document.createElement('button');
        exportButton.className = 'btn-secondary';
        exportButton.innerHTML = '<i class="fas fa-download"></i> Export Settings';
        exportButton.addEventListener('click', () => this.exportSettings());
        
        // Import button and hidden file input
        const importButton = document.createElement('button');
        importButton.className = 'btn-secondary';
        importButton.innerHTML = '<i class="fas fa-upload"></i> Import Settings';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (e) => this.importSettings(e));
        
        importButton.addEventListener('click', () => fileInput.click());

        // Reset button
        const resetButton = document.createElement('button');
        resetButton.className = 'btn-danger';
        resetButton.innerHTML = '<i class="fas fa-refresh"></i> Reset to Defaults';
        resetButton.addEventListener('click', () => this.resetSettings());

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        buttonGroup.style.display = 'flex';
        buttonGroup.style.gap = '10px';
        buttonGroup.style.marginTop = '15px';
        
        buttonGroup.appendChild(exportButton);
        buttonGroup.appendChild(importButton);
        buttonGroup.appendChild(fileInput);
        buttonGroup.appendChild(resetButton);
        
        actionsSection.appendChild(buttonGroup);
        settingsContainer.appendChild(actionsSection);
    }

    // Export settings
    exportSettings() {
        const dataStr = JSON.stringify(this.settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'salon-settings.json';
        link.click();
        
        this.showNotification('Settings exported successfully!', 'success');
    }

    // Import settings
    importSettings(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                this.settings = { ...this.settings, ...importedSettings };
                this.saveSettings();
                this.initializeSettings();
                this.showNotification('Settings imported successfully!', 'success');
            } catch (error) {
                console.error('Failed to import settings:', error);
                this.showNotification('Failed to import settings. Invalid file format.', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Reset to default settings
    resetSettings() {
        if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
            if (window.localStorage) {
                window.localStorage.removeItem('salonSettings');
            }
            location.reload(); // Reload to apply defaults
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Get current settings
    getSettings() {
        return this.settings;
    }

    // Update specific setting
    updateSetting(key, value) {
        const keys = key.split('.');
        let current = this.settings;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        this.saveSettings();
    }
}

// Initialize settings manager when page loads
let settingsManager;

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the settings page
    if (document.getElementById('settings-page')) {
        settingsManager = new SettingsManager();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
}