// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Make an API request
 * @param {string} endpoint - API endpoint (e.g., '/user/login')
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} data - Request body data
 * @param {boolean} auth - Whether to include auth token
 * @returns {Promise<Object>} - Response data
 */
async function apiRequest(endpoint, method = 'GET', data = null, auth = true) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    // Add auth token if required
    if (auth) {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const config = {
        method,
        headers,
        credentials: 'include', // For cookies if using httpOnly
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || 'Something went wrong');
        }

        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth service methods
export const authService = {
    // User login
    async login(email, password, rememberMe = false) {
        return apiRequest('/user/login', 'POST', { email, password, rememberMe }, false);
    },

    // User registration
    async register(userData) {
        return apiRequest('/user/signup', 'POST', userData, false);
    },

    // Get current user
    async getCurrentUser() {
        return apiRequest('/user/me');
    },

    // Logout
    async logout() {
        try {
            await apiRequest('/user/logout', 'POST');
        } finally {
            // Clear auth data regardless of API call success
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('user');
        }
    },

    // Check if user is authenticated
    isAuthenticated() {
        return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
    },

    // Get stored user data
    getStoredUser() {
        const user = localStorage.getItem('user') || sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Store auth data
    storeAuthData(user, token, rememberMe) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(user));
        storage.setItem('token', token);
    }
};

// Protected route component
export function withAuth(Component) {
    return function ProtectedRoute(props) {
        const [isLoading, setIsLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                    if (!token) {
                        throw new Error('No authentication token found');
                    }
                    await authService.getCurrentUser();
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Authentication check failed:', error);
                    navigate('/login', { replace: true });
                } finally {
                    setIsLoading(false);
                }
            };

            checkAuth();
        }, [navigate]);

        if (isLoading) {
            return <div>Loading...</div>; // Or a loading spinner
        }

        return isAuthenticated ? <Component {...props} /> : null;
    };
}
