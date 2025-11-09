/**
 * TREKKA DASHBOARD - Main JavaScript
 * Mock data, CRUD operations, UI components, and interactions
 */

// ============================================
// MOCK DATA
// ============================================
const mockData = {
  // Current user (changes based on role)
  currentUser: {
    id: 'user-1',
    name: 'Olajide Maintain',
    email: 'olajide@trekka.com',
    role: 'user', // 'user', 'company', 'driver'
    avatar: null,
    country: 'Nigeria'
  },
  
  // User stats
  userStats: {
    upcomingBookings: 3,
    completedTrips: 24,
    walletBalance: 125000,
    rewards: 450
  },
  
  // Company stats
  companyStats: {
    fleetCount: 45,
    activeDrivers: 32,
    pendingRequests: 8,
    monthlyRevenue: 8500000
  },
  
  // Driver stats
  driverStats: {
    totalAmount: 435000,
    assignedTrips: 12,
    completedToday: 5,
    rating: 4.8
  },
  
  // Monthly data for charts (12 months)
  monthlyData: [80, 100, 70, 90, 70, 95, 85, 90, 85, 95, 100, 80],
  
  // Transactions
  transactions: [
    { id: 'txn-1', date: '11/07/2023 05:00PM', mode: 'Bank Transfer', amount: 9500, status: 'failed' },
    { id: 'txn-2', date: '11/07/2023 05:00PM', mode: 'Card', amount: 9500, status: 'completed' },
    { id: 'txn-3', date: '11/07/2023 05:00PM', mode: 'Bank Transfer', amount: 9500, status: 'failed' },
    { id: 'txn-4', date: '11/07/2023 05:00PM', mode: 'Card', amount: 6500, status: 'failed' },
    { id: 'txn-5', date: '11/07/2023 05:00PM', mode: 'Bank Transfer', amount: 9500, status: 'pending' }
  ],
  
  // Bookings/Trips
  bookings: [
    { id: 'bk-1', bookingNumber: 'TK8789234501', pickup: 'Lagos', destination: 'Abuja', date: '12/10/2025', duration: '45 Mins', amount: 9500, status: 'failed' },
    { id: 'bk-2', bookingNumber: 'TK8789234502', pickup: 'Ikeja', destination: 'Ikoyi', date: '11/07/2023', duration: '45 Mins', amount: 9500, status: 'completed' },
    { id: 'bk-3', bookingNumber: 'TK8789234503', pickup: 'Ikeja', destination: 'Ikoyi', date: '11/07/2023', duration: '45 Mins', amount: 9500, status: 'failed' },
    { id: 'bk-4', bookingNumber: 'TK8789234504', pickup: 'Ikeja', destination: 'Ikoyi', date: '11/07/2023', duration: '45 Mins', amount: 9500, status: 'failed' },
    { id: 'bk-5', bookingNumber: 'TK8789234505', pickup: 'Ikeja', destination: 'Ikoyi', date: '11/07/2023', duration: '45 Mins', amount: 9500, status: 'pending' }
  ],
  
  // Draft bookings
  drafts: [
    { id: 'draft-1', bookingNumber: 'TK8789234501', pickup: 'Lagos', dropOff: 'Abuja', date: '12/10/2025' },
    { id: 'draft-2', bookingNumber: 'TK8789234501', pickup: 'Lagos', dropOff: 'Abuja', date: '12/10/2025' },
    { id: 'draft-3', bookingNumber: 'TK8789234501', pickup: 'Lagos', dropOff: 'Abuja', date: '12/10/2025' }
  ],
  
  // Users for driver search
  users: [
    { id: 'u1', name: 'Abdullahi Sulaimon', email: 'sulaimail@gmail.com', phone: '+2349137748376', dob: 'Apr 12, 1965', address: '7 Raymond Njoku st Ikoyi Lagos Nigeria' },
    { id: 'u2', name: 'John Doe', email: 'john@example.com', phone: '+2341234567890', dob: 'Jan 01, 1990', address: 'Lagos, Nigeria' },
    { id: 'u3', name: 'Jane Smith', email: 'jane@example.com', phone: '+2349876543210', dob: 'Mar 15, 1988', address: 'Abuja, Nigeria' }
  ],
  
  // Drivers
  drivers: [
    {
      id: 'drv-1',
      name: 'Abdullahi Sulaimon',
      email: 'sulaimail@gmail.com',
      phone: '+2349137748376',
      dob: 'Apr 12, 1965',
      address: '7 Raymond Njoku st Ikoyi Lagos Nigeria',
      status: 'verified', // pending, verified, rejected
      rating: 4.5,
      totalTrips: 102,
      onTimeRate: '79%',
      cancellationRate: '4%',
      joinedDate: 'Nov 16, 2025',
      lastActive: '3 days ago'
    }
  ],
  
  // Fleet/Vehicles
  fleet: [
    { id: 'veh-1', name: 'Toyota Hiace', type: 'Shuttle', capacity: 14, regNumber: 'LND 457 TY', route: 'Lagos-Ibadan', status: 'active' },
    { id: 'veh-2', name: 'Toyota Corolla', type: 'Car', capacity: 4, regNumber: 'KKY 384 GD', route: 'Lagos-Ibadan', status: 'maintenance' },
    { id: 'veh-3', name: 'Toyota Hiace', type: 'Shuttle', capacity: 14, regNumber: 'LND 478 TY', route: 'Lagos-Abeokuta', status: 'active' },
    { id: 'veh-4', name: 'Mercedes Sprinter', type: 'Bus', capacity: 20, regNumber: 'LND 459 TY', route: 'Lagos-Abeokuta', status: 'active' }
  ],
  
  // Roles
  roles: [
    { id: 'role-1', name: 'Admin', permissions: ['all'], userCount: 2 },
    { id: 'role-2', name: 'Manager', permissions: ['view', 'edit'], userCount: 5 },
    { id: 'role-3', name: 'Viewer', permissions: ['view'], userCount: 10 }
  ],
  
  // Trip analytics
  tripAnalytics: {
    totalPassengers: 350,
    totalRevenue: 5500000,
    avgSeatFill: 75,
    tripsPerWeek: [40, 85, 25, 60, 30, 85],
    revenueByRoute: [30, 35, 50, 40, 55, 90]
  },
  
  // Trips for analytics table
  trips: [
    { id: '#1001', route: 'Lagos-Ibadan', bus: 1, date: '20 Oct, 2025', passengers: 45, revenue: 120000, status: 'completed' },
    { id: '#1002', route: 'Osun-Ikeja', bus: 2, date: '21 Oct, 2025', passengers: 50, revenue: 100000, status: 'completed' },
    { id: '#1003', route: 'Imo-Aba', bus: 3, date: '22 Oct, 2025', passengers: 45, revenue: 200000, status: 'completed' },
    { id: '#1004', route: 'Awka-Abia', bus: 4, date: '23 Oct, 2025', passengers: 50, revenue: 220000, status: 'ongoing' },
    { id: '#1005', route: 'Ketu-Epe', bus: 5, date: '24 Oct, 2025', passengers: 60, revenue: 110000, status: 'ongoing' }
  ]
};

// Sync with localStorage
function loadMockData() {
  const stored = localStorage.getItem('trekka-mock-data');
  if (stored) {
    try {
      Object.assign(mockData, JSON.parse(stored));
    } catch (e) {
      console.error('Error loading mock data:', e);
    }
  }
}

function saveMockData() {
  localStorage.setItem('trekka-mock-data', JSON.stringify(mockData));
}

// Load data on init
loadMockData();

// ============================================
// CRUD OPERATIONS
// TODO: Replace with API calls to backend endpoints
// ============================================

/**
 * Add a draft booking
 * @param {Object} draft - Draft data
 * @returns {Object} Created draft
 */
function addDraft(draft) {
  const newDraft = {
    id: 'draft-' + Date.now(),
    bookingNumber: 'TK' + Math.floor(Math.random() * 10000000000),
    ...draft
  };
  mockData.drafts.push(newDraft);
  saveMockData();
  showToast('Draft saved successfully', 'success');
  return newDraft;
  
  // TODO: Replace with API call
  // return fetch('/api/drafts', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(draft)
  // }).then(res => res.json());
}

/**
 * Update a draft booking
 * @param {string} id - Draft ID
 * @param {Object} updates - Updated data
 * @returns {Object} Updated draft
 */
function updateDraft(id, updates) {
  const index = mockData.drafts.findIndex(d => d.id === id);
  if (index !== -1) {
    mockData.drafts[index] = { ...mockData.drafts[index], ...updates };
    saveMockData();
    showToast('Draft updated successfully', 'success');
    return mockData.drafts[index];
  }
  
  // TODO: Replace with API call
  // return fetch(`/api/drafts/${id}`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(updates)
  // }).then(res => res.json());
}

/**
 * Delete a draft booking
 * @param {string} id - Draft ID
 */
function deleteDraft(id) {
  mockData.drafts = mockData.drafts.filter(d => d.id !== id);
  saveMockData();
  showToast('Draft deleted successfully', 'success');
  
  // TODO: Replace with API call
  // return fetch(`/api/drafts/${id}`, { method: 'DELETE' });
}

/**
 * Add a vehicle to fleet
 * @param {Object} vehicle - Vehicle data
 * @returns {Object} Created vehicle
 */
function addVehicle(vehicle) {
  const newVehicle = {
    id: 'veh-' + Date.now(),
    status: 'active',
    ...vehicle
  };
  mockData.fleet.push(newVehicle);
  saveMockData();
  showToast('Vehicle added successfully', 'success');
  return newVehicle;
  
  // TODO: Replace with API call
  // return fetch('/api/fleet', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(vehicle)
  // }).then(res => res.json());
}

/**
 * Update a vehicle
 * @param {string} id - Vehicle ID
 * @param {Object} updates - Updated data
 * @returns {Object} Updated vehicle
 */
function updateVehicle(id, updates) {
  const index = mockData.fleet.findIndex(v => v.id === id);
  if (index !== -1) {
    mockData.fleet[index] = { ...mockData.fleet[index], ...updates };
    saveMockData();
    showToast('Vehicle updated successfully', 'success');
    return mockData.fleet[index];
  }
  
  // TODO: Replace with API call
  // return fetch(`/api/fleet/${id}`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(updates)
  // }).then(res => res.json());
}

/**
 * Delete a vehicle
 * @param {string} id - Vehicle ID
 */
function deleteVehicle(id) {
  mockData.fleet = mockData.fleet.filter(v => v.id !== id);
  saveMockData();
  showToast('Vehicle removed successfully', 'success');
  
  // TODO: Replace with API call
  // return fetch(`/api/fleet/${id}`, { method: 'DELETE' });
}

/**
 * Add a driver
 * @param {Object} driver - Driver data
 * @returns {Object} Created driver
 */
function addDriver(driver) {
  const newDriver = {
    id: 'drv-' + Date.now(),
    status: 'pending',
    rating: 0,
    totalTrips: 0,
    onTimeRate: '0%',
    cancellationRate: '0%',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    lastActive: 'Just now',
    ...driver
  };
  mockData.drivers.push(newDriver);
  saveMockData();
  showToast('Driver added successfully. Verification pending.', 'success');
  return newDriver;
  
  // TODO: Replace with API call
  // return fetch('/api/drivers', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(driver)
  // }).then(res => res.json());
}

/**
 * Verify a driver (admin action)
 * @param {string} id - Driver ID
 * @param {string} status - 'verified' or 'rejected'
 */
function verifyDriver(id, status) {
  const index = mockData.drivers.findIndex(d => d.id === id);
  if (index !== -1) {
    mockData.drivers[index].status = status;
    saveMockData();
    
    // Simulate API call delay
    setTimeout(() => {
      showToast(`Driver ${status === 'verified' ? 'verified' : 'rejected'} successfully`, 'success');
    }, 1000);
  }
  
  // TODO: Replace with API call
  // return fetch(`/api/drivers/${id}/verify`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ status })
  // }).then(res => res.json());
}

/**
 * Add a role
 * @param {Object} role - Role data
 * @returns {Object} Created role
 */
function addRole(role) {
  const newRole = {
    id: 'role-' + Date.now(),
    userCount: 0,
    ...role
  };
  mockData.roles.push(newRole);
  saveMockData();
  showToast('Role created successfully', 'success');
  return newRole;
  
  // TODO: Replace with API call
  // return fetch('/api/roles', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(role)
  // }).then(res => res.json());
}

/**
 * Assign driver to booking
 * @param {string} bookingId - Booking ID
 * @param {string} driverId - Driver ID
 */
function assignDriver(bookingId, driverId) {
  // In a real app, this would update the booking with driver assignment
  console.log(`Assigned driver ${driverId} to booking ${bookingId}`);
  showToast('Driver assigned successfully', 'success');
  
  // TODO: Replace with API call
  // return fetch(`/api/bookings/${bookingId}/assign`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ driverId })
  // }).then(res => res.json());
}

// ============================================
// UI COMPONENTS & HELPERS
// ============================================

/**
 * Show toast notification
 * @param {string} message - Toast message
 * @param {string} type - success, error, info, warning
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconMap = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle'
  };
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fas ${iconMap[type]}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  container.appendChild(toast);
  
  // Auto dismiss after 3 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

/**
 * Show modal
 * @param {string} modalId - Modal element ID
 */
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Hide modal
 * @param {string} modalId - Modal element ID
 */
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Toggle dropdown
 * @param {string} dropdownId - Dropdown element ID
 */
function toggleDropdown(dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
  
  // Close other dropdowns
  document.querySelectorAll('.dropdown').forEach(d => {
    if (d.id !== dropdownId) {
      d.classList.remove('active');
    }
  });
}

/**
 * Toggle sidebar (mobile)
 */
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.mobile-overlay');
  
  if (sidebar) {
    sidebar.classList.toggle('mobile-open');
  }
  if (overlay) {
    overlay.classList.toggle('active');
  }
}

/**
 * Format currency (Nigerian Naira)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
  return '₦' + amount.toLocaleString('en-NG');
}

/**
 * Export table to CSV
 * @param {string} tableId - Table element ID
 * @param {string} filename - CSV filename
 */
function exportTableToCSV(tableId, filename) {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  let csv = [];
  const rows = table.querySelectorAll('tr');
  
  rows.forEach(row => {
    const cols = row.querySelectorAll('td, th');
    const csvRow = [];
    cols.forEach(col => csvRow.push(col.textContent.trim()));
    csv.push(csvRow.join(','));
  });
  
  const csvContent = csv.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'export.csv';
  a.click();
  
  URL.revokeObjectURL(url);
  showToast('CSV exported successfully', 'success');
}

/**
 * Simple debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * Search users (for driver invite)
 * @param {string} query - Search query
 * @returns {Array} Filtered users
 */
function searchUsers(query) {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockData.users.filter(user => 
    user.name.toLowerCase().includes(lowerQuery) ||
    user.email.toLowerCase().includes(lowerQuery) ||
    user.phone.includes(query)
  );
}

// ============================================
// CHART RENDERING (Simple SVG/Canvas)
// ============================================

/**
 * Render bar chart
 * @param {string} canvasId - Canvas element ID
 * @param {Array} data - Data array
 * @param {Array} labels - Label array
 */
function renderBarChart(canvasId, data, labels) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = canvas.offsetHeight;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Calculate bar dimensions
  const barWidth = (width / data.length) * 0.7;
  const maxValue = Math.max(...data);
  const padding = 40;
  const chartHeight = height - padding * 2;
  
  // Draw bars
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = (index * (width / data.length)) + ((width / data.length) - barWidth) / 2;
    const y = height - padding - barHeight;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
    gradient.addColorStop(0, '#1a1a4d');
    gradient.addColorStop(1, '#0066cc');
    
    // Draw bar with rounded top
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0]);
    ctx.fill();
    
    // Draw label
    if (labels && labels[index]) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[index], x + barWidth / 2, height - 15);
    }
  });
}

/**
 * Render line chart
 * @param {string} canvasId - Canvas element ID
 * @param {Array} data - Data array
 */
function renderLineChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = canvas.offsetHeight;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxValue = Math.max(...data);
  const stepX = chartWidth / (data.length - 1);
  
  // Draw line
  ctx.strokeStyle = '#0066cc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  data.forEach((value, index) => {
    const x = padding + (index * stepX);
    const y = height - padding - ((value / maxValue) * chartHeight);
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // Draw points
  data.forEach((value, index) => {
    const x = padding + (index * stepX);
    const y = height - padding - ((value / maxValue) * chartHeight);
    
    ctx.fillStyle = '#0066cc';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// ============================================
// INITIALIZATION
// ============================================

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
  }
});

// Close modals when clicking backdrop
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Close modals with ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

// Sticky header shadow on scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('.dashboard-header');
  if (header) {
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
});

// Mobile overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('mobile-overlay')) {
    toggleSidebar();
  }
});

// Make functions globally available
window.mockData = mockData;
window.addDraft = addDraft;
window.updateDraft = updateDraft;
window.deleteDraft = deleteDraft;
window.addVehicle = addVehicle;
window.updateVehicle = updateVehicle;
window.deleteVehicle = deleteVehicle;
window.addDriver = addDriver;
window.verifyDriver = verifyDriver;
window.addRole = addRole;
window.assignDriver = assignDriver;
window.showToast = showToast;
window.showModal = showModal;
window.hideModal = hideModal;
window.toggleDropdown = toggleDropdown;
window.toggleSidebar = toggleSidebar;
window.formatCurrency = formatCurrency;
window.exportTableToCSV = exportTableToCSV;
window.debounce = debounce;
window.searchUsers = searchUsers;
window.renderBarChart = renderBarChart;
window.renderLineChart = renderLineChart;

console.log('Trekka Dashboard initialized');
