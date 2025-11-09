import { redirectBasedOnRole } from '../utils/authUtils.js';

const API_BASE_URL = 'http://localhost:3000';

// Check if server is reachable
async function checkServerStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Server is not reachable:', error);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('sigInForm');
  const loginButton = document.getElementById('login-btn');
  const loginError = document.getElementById('login-error');

  // Check server status when page loads
  const isServerUp = await checkServerStatus();
  if (!isServerUp) {
    alert('Error: Could not connect to the server. Please make sure the backend server is running.');
    if (loginButton) loginButton.disabled = true;
    return;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('login-password').value;
      
      if (!email || !password) {
        alert('Please enter both email and password');
        return;
      }
      
      try {
        loginButton.disabled = true;
        loginButton.textContent = 'Signing in...';
        
        const response = await fetch(`${API_BASE_URL}/api/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new Error('Invalid response from server');
        }

        if (!response.ok) {
          throw new Error(data.message || `Login failed with status ${response.status}`);
        }

        // Store the token in session storage
        if (data.token) {
          sessionStorage.setItem('authToken', data.token);
        }

        // Show success message before redirecting
        const successMessage = document.querySelector('.login-successful');
        if (successMessage) {
          successMessage.style.display = 'flex';
          loginForm.style.display = 'none';
        }

        // Redirect based on user role after a short delay
        setTimeout(() => {
          if (data.user && data.user.role) {
            redirectBasedOnRole(data.user.role);
          } else {
            // Default to user dashboard if role is not specified
            redirectBasedOnRole('user');
          }
        }, 1500);

      } catch (error) {
        console.error('Login error:', error);
        if (loginError) {
          loginError.textContent = error.message || 'An error occurred during login';
          loginError.style.display = 'block';
        } else {
          alert(error.message || 'An error occurred during login');
        }
      } finally {
        if (loginButton) {
          loginButton.disabled = false;
          loginButton.textContent = 'Sign in';
        }
      }
    });
  }
});