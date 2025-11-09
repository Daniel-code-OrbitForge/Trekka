/**
 * Trekka Admin System - Core JavaScript
 *
 * ARCHITECTURE:
 * - Mock data layer for demo/testing
 * - API abstraction layer for Supabase integration
 * - Utility functions for common operations
 *
 * TO INTEGRATE WITH BACKEND:
 * 1. Replace mock functions with real Supabase calls
 * 2. Update API endpoints (shown in comments)
 * 3. Handle authentication tokens
 * 4. Add error handling for network failures
 *
 * INTEGRATION EXAMPLE:
 * Replace: mockFetchUsers()
 * With: fetchUsers via Supabase client
 */

// ============================================
// ADMIN API LAYER
// ============================================

const AdminAPI = {
    /**
     * Initialize Supabase client
     * PRODUCTION: Uncomment and configure with real Supabase instance
     */
    // supabase: window.supabase?.createClient(
    //     process.env.VITE_SUPABASE_URL,
    //     process.env.VITE_SUPABASE_ANON_KEY
    // ),

    /**
     * Get all users
     * PRODUCTION: Replace mock with real Supabase query
     *
     * Real implementation:
     * const { data, error } = await supabase
     *     .from('users')
     *     .select('*')
     *     .order('created_at', { ascending: false });
     * if (error) throw error;
     * return data;
     */
    async getUsers() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data - replace with real backend call
        return [
            {
                id: 'user-1',
                email: 'john@example.com',
                name: 'John Doe',
                phone: '08012345678',
                role: 'passenger',
                verified: true,
                status: 'active',
                lastActive: new Date(Date.now() - 3600000).toISOString(),
                createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            // Add more users as needed
        ];
    },

    /**
     * Update user status
     * PRODUCTION: Replace with real Supabase update
     *
     * Real implementation:
     * const { error } = await supabase
     *     .from('users')
     *     .update({ status: newStatus })
     *     .eq('id', userId);
     * if (error) throw error;
     */
    async updateUserStatus(userId, newStatus) {
        await new Promise(resolve => setTimeout(resolve, 300));

        // Log for backend integration
        console.log(`BACKEND: Update user ${userId} status to ${newStatus}`);

        return { success: true, userId, newStatus };
    },

    /**
     * Get all bookings
     * PRODUCTION: Replace with real Supabase query
     *
     * Real implementation:
     * const { data, error } = await supabase
     *     .from('bookings')
     *     .select('*, user:users(*), company:companies(*)')
     *     .order('created_at', { ascending: false });
     * if (error) throw error;
     * return data;
     */
    async getBookings() {
        await new Promise(resolve => setTimeout(resolve, 500));

        return [
            {
                id: 'booking-1',
                userId: 'user-1',
                companyId: 'company-1',
                pickupLocation: 'VI',
                dropoffLocation: 'Lekki',
                fare: 5000,
                status: 'completed',
                createdAt: new Date().toISOString(),
            },
        ];
    },

    /**
     * Refund payment
     * PRODUCTION: Call payment gateway via backend
     *
     * Real implementation:
     * const { data, error } = await supabase
     *     .rpc('process_refund', { payment_id: paymentId })
     * if (error) throw error;
     * return data;
     */
    async refundPayment(paymentId, amount) {
        await new Promise(resolve => setTimeout(resolve, 800));

        console.log(`BACKEND: Process refund for payment ${paymentId}, amount: ${amount}`);

        return { success: true, paymentId, refundAmount: amount };
    },

    /**
     * Get activity logs
     * PRODUCTION: Fetch from activity_logs table
     *
     * Real implementation:
     * const { data, error } = await supabase
     *     .from('activity_logs')
     *     .select('*')
     *     .order('created_at', { ascending: false })
     *     .limit(100);
     * if (error) throw error;
     * return data;
     */
    async getActivityLogs() {
        await new Promise(resolve => setTimeout(resolve, 400));

        return [
            {
                id: 'log-1',
                adminId: 'admin-1',
                actionType: 'user_suspend',
                targetType: 'user',
                targetId: 'user-123',
                description: 'Suspended user for policy violation',
                status: 'completed',
                createdAt: new Date().toISOString(),
            },
        ];
    },

    /**
     * Create activity log entry
     * PRODUCTION: Insert into activity_logs table
     *
     * Real implementation:
     * const { error } = await supabase
     *     .from('activity_logs')
     *     .insert([{
     *         admin_id: adminId,
     *         action_type: actionType,
     *         target_type: targetType,
     *         target_id: targetId,
     *         description: description
     *     }]);
     * if (error) throw error;
     */
    async logActivity(adminId, actionType, targetType, targetId, description) {
        await new Promise(resolve => setTimeout(resolve, 200));

        console.log(`BACKEND: Log activity - ${actionType} on ${targetType} ${targetId}`);

        return { success: true };
    },

    /**
     * Get dashboard metrics
     * PRODUCTION: Aggregate queries from multiple tables
     *
     * Real implementation with Supabase:
     * const [usersCount, bookingsCount, revenueData] = await Promise.all([
     *     supabase.from('users').select('id', { count: 'exact' }),
     *     supabase.from('bookings').select('id', { count: 'exact' }),
     *     supabase.from('payments').select('amount')
     * ]);
     */
    async getDashboardMetrics() {
        await new Promise(resolve => setTimeout(resolve, 800));

        return {
            totalUsers: 9230,
            totalDrivers: 1780,
            totalCompanies: 345,
            totalBookings: 15000,
            totalRevenue: 835070,
            monthToDateRevenue: 125000,
            pendingVerifications: 45,
        };
    },

    /**
     * Send broadcast message
     * PRODUCTION: Create broadcast record and trigger sending
     *
     * Real implementation:
     * const { error } = await supabase
     *     .from('broadcasts')
     *     .insert([{
     *         admin_id: adminId,
     *         title: title,
     *         message: message,
     *         target_audience: targetAudience,
     *         status: 'pending'
     *     }])
     * if (error) throw error;
     * // Trigger Edge Function to send broadcast
     */
    async sendBroadcast(adminId, title, message, targetAudience) {
        await new Promise(resolve => setTimeout(resolve, 600));

        console.log(`BACKEND: Send broadcast - "${title}" to ${targetAudience}`);

        return { success: true, broadcastId: `broadcast-${Date.now()}` };
    },

    /**
     * Verify JWT token
     * PRODUCTION: Validate token with backend
     */
    async verifyToken(token) {
        // In production, validate JWT with backend
        if (!token) return null;

        try {
            // For now, just decode from localStorage
            const email = localStorage.getItem('trekka_admin_email');
            const role = localStorage.getItem('trekka_admin_role');
            return { email, role };
        } catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: NGN)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'NGN') {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDateTime(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    return date.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Debounce function for search and filtering
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} Debounced function
 */
function debounce(func, wait = 300) {
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

/**
 * Export data to CSV
 * @param {array} data - Array of objects to export
 * @param {string} filename - Output filename
 */
function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) return;

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csv = [
        headers.join(','),
        ...data.map(row =>
            headers
                .map(header => {
                    const value = row[header];
                    // Escape quotes and wrap in quotes if contains comma
                    if (typeof value === 'string' && value.includes(',')) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                })
                .join(',')
        ),
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

/**
 * Check if user is authenticated admin
 * @returns {boolean} True if user is authenticated admin
 */
function isAdminAuthenticated() {
    const token = localStorage.getItem('trekka_admin_token');
    const email = localStorage.getItem('trekka_admin_email');
    return !!(token && email);
}

/**
 * Get current admin info
 * @returns {object} Admin information
 */
function getCurrentAdmin() {
    return {
        email: localStorage.getItem('trekka_admin_email'),
        role: localStorage.getItem('trekka_admin_role'),
        token: localStorage.getItem('trekka_admin_token'),
    };
}

/**
 * Log out current admin
 */
function logoutAdmin() {
    localStorage.removeItem('trekka_admin_token');
    localStorage.removeItem('trekka_admin_email');
    localStorage.removeItem('trekka_admin_role');
    window.location.href = './adminLogin.html';
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// MOCK DATA MANAGEMENT (for development)
// ============================================

const MockDataManager = {
    /**
     * Initialize or load mock data from localStorage
     */
    init() {
        const existing = localStorage.getItem('trekka_admin_mock');
        if (!existing) {
            this.reset();
        }
    },

    /**
     * Get mock data
     * @returns {object} Current mock data
     */
    getData() {
        const data = localStorage.getItem('trekka_admin_mock');
        return data ? JSON.parse(data) : this.getDefaultData();
    },

    /**
     * Save mock data
     * @param {object} data - Data to save
     */
    saveData(data) {
        localStorage.setItem('trekka_admin_mock', JSON.stringify(data));
    },

    /**
     * Reset to default data
     */
    reset() {
        this.saveData(this.getDefaultData());
    },

    /**
     * Get default mock data structure
     * @returns {object} Default data
     */
    getDefaultData() {
        return {
            users: [],
            companies: [],
            bookings: [],
            payments: [],
            broadcasts: [],
            activityLogs: [],
            roles: [],
            adminMetrics: {
                totalUsers: 9230,
                totalDrivers: 1780,
                totalCompanies: 345,
                totalBookings: 15000,
                totalRevenue: 835070,
            },
        };
    },
};

// Initialize mock data on page load
document.addEventListener('DOMContentLoaded', () => {
    MockDataManager.init();
});

/**
 * PUBLIC API
 * Make utilities available globally for use in HTML event handlers
 */
window.AdminAPI = AdminAPI;
window.formatCurrency = formatCurrency;
window.formatDateTime = formatDateTime;
window.debounce = debounce;
window.exportToCSV = exportToCSV;
window.isAdminAuthenticated = isAdminAuthenticated;
window.getCurrentAdmin = getCurrentAdmin;
window.logoutAdmin = logoutAdmin;
window.MockDataManager = MockDataManager;
