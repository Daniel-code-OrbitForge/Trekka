import { redirectBasedOnRole } from "../utils/authUtils.js";

const API_BASE_URL = "http://localhost:5000";

// Check if server is reachable
async function checkServerStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    console.error("Server is not reachable:", error);
    return false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("sigInForm");
  const loginButton = document.getElementById("login-btn");
  const loginError = document.getElementById("login-error");

  // Create error display if it doesn't exist
  if (!loginError) {
    const errorDiv = document.createElement("div");
    errorDiv.id = "login-error";
    errorDiv.style.color = "red";
    errorDiv.style.marginBottom = "10px";
    errorDiv.style.display = "none";
    loginForm.querySelector(".login-card").insertBefore(errorDiv, loginButton);
  }

  // Check server status when page loads
  const isServerUp = await checkServerStatus();
  if (!isServerUp) {
    alert(
      "Error: Could not connect to the server. Please make sure the backend server is running."
    );
    if (loginButton) loginButton.disabled = true;
    return;
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("login-password").value;

      if (!email || !password) {
        const errorElement = document.getElementById("login-error");
        if (errorElement) {
          errorElement.textContent = "Please enter both email and password";
          errorElement.style.display = "block";
        }
        return;
      }

      try {
        loginButton.disabled = true;
        loginButton.textContent = "Signing in...";

        // Hide previous errors
        const errorElement = document.getElementById("login-error");
        if (errorElement) errorElement.style.display = "none";

        // Try user login first
        let response = await fetch(`${API_BASE_URL}/api/user/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError);
          throw new Error("Invalid response from server");
        }

        // If user login fails, try company login
        if (!response.ok) {
          response = await fetch(`${API_BASE_URL}/api/company/company-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          try {
            data = await response.json();
          } catch (jsonError) {
            console.error("Error parsing JSON response:", jsonError);
            throw new Error("Invalid response from server");
          }
        }

        // If company login fails, try admin login
        if (!response.ok) {
          response = await fetch(`${API_BASE_URL}/api/admin/admin-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          try {
            data = await response.json();
          } catch (jsonError) {
            console.error("Error parsing JSON response:", jsonError);
            throw new Error("Invalid response from server");
          }
        }

        // Check if any login succeeded
        if (!response.ok) {
          throw new Error(data.message || "Invalid email or password");
        }

        // Store the token and user data
        if (data.token) {
          localStorage.setItem("authToken", data.token);
          sessionStorage.setItem("authToken", data.token);
        }

        // Get role from response
        const role = data.user?.role || data.company?.role || data.admin?.role;

        if (role) {
          localStorage.setItem("userRole", role);
        }

        // Store user data
        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user));
        } else if (data.company) {
          localStorage.setItem("userData", JSON.stringify(data.company));
        } else if (data.admin) {
          localStorage.setItem("userData", JSON.stringify(data.admin));
        }

        // Show success message before redirecting
        const successMessage = document.querySelector(".login-successful");
        const cardContainer = document.querySelector(".card-container");

        if (successMessage && cardContainer) {
          cardContainer.classList.remove("active");
          successMessage.style.display = "flex";
        }

        // Redirect based on user role after a short delay
        setTimeout(() => {
          if (role) {
            redirectBasedOnRole(role);
          } else {
            // Fallback: redirect to user dashboard
            window.location.href = "../users/dashboard.html";
          }
        }, 2000);
      } catch (error) {
        console.error("Login error:", error);
        const errorElement = document.getElementById("login-error");
        if (errorElement) {
          errorElement.textContent =
            error.message || "An error occurred during login";
          errorElement.style.display = "block";
        } else {
          alert(error.message || "An error occurred during login");
        }
      } finally {
        if (loginButton) {
          loginButton.disabled = false;
          loginButton.textContent = "Sign in";
        }
      }
    });
  }
});
