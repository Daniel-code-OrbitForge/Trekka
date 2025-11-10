const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signUpForm");
  const cards = document.getElementsByClassName("card");
  const nextBtn1 = document.querySelector(".user-next-btn1");
  const toContactInfo = document.querySelectorAll(".next")[0];
  const toSignUp = document.querySelectorAll(".next")[1];
  const progress = document.querySelector(".progress");
  const signUpstep = document.querySelector(".signup-step");
  const container = document.querySelectorAll(".container");
  const user = document.querySelectorAll(".option")[0];
  const driver = document.querySelectorAll(".option")[1];
  const company = document.querySelectorAll(".option")[2];

  // Role selection
  user.addEventListener("click", () => {
    container[0].classList.toggle("deactivate");
    container[1].classList.toggle("deactivate");
  });

  driver.addEventListener("click", () => {
    container[0].classList.toggle("deactivate");
    container[1].classList.toggle("deactivate");
  });

  company.addEventListener("click", () => {
    document.location.assign("../../pages/auth/signupCompany.html");
  });

  // Step navigation
  nextBtn1.addEventListener("click", () => {
    cards[0].classList.toggle("active");
    cards[1].classList.toggle("active");
    progress.style.width = "67%";
    signUpstep.firstElementChild.textContent = "Step 2 of 3";
    signUpstep.lastElementChild.textContent = "67%";
  });

  toContactInfo.addEventListener("click", (event) => {
    if (event.target === toContactInfo.querySelectorAll(".btn")[0]) {
      // Back button
      cards[0].classList.toggle("active");
      cards[1].classList.toggle("active");
      progress.style.width = "33%";
      signUpstep.firstElementChild.textContent = "Step 1 of 3";
      signUpstep.lastElementChild.textContent = "33%";
    } else {
      // Next button
      cards[1].classList.toggle("active");
      cards[2].classList.toggle("active");
      progress.style.width = "100%";
      signUpstep.firstElementChild.textContent = "Step 3 of 3";
      signUpstep.lastElementChild.textContent = "100%";
    }
  });

  toSignUp.addEventListener("click", (event) => {
    if (event.target === toSignUp.querySelectorAll(".btn")[0]) {
      // Back button
      cards[1].classList.toggle("active");
      cards[2].classList.toggle("active");
      progress.style.width = "67%";
      signUpstep.firstElementChild.textContent = "Step 2 of 3";
      signUpstep.lastElementChild.textContent = "67%";
    }
  });

  // Form submission - API Integration
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const country = document.getElementById("country").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm").value;
    const termsChecked = document.querySelector('input[name="terms"]').checked;

    // Create or get error display
    let errorDisplay = document.getElementById("signup-error");
    if (!errorDisplay) {
      errorDisplay = document.createElement("div");
      errorDisplay.id = "signup-error";
      errorDisplay.style.color = "red";
      errorDisplay.style.marginBottom = "10px";
      errorDisplay.style.fontSize = "14px";
      cards[2].insertBefore(errorDisplay, cards[2].querySelector(".divider"));
    }

    // Validation
    errorDisplay.textContent = "";

    if (!firstName || !lastName || !email || !phone || !country || !password) {
      errorDisplay.textContent = "Please fill in all required fields";
      return;
    }

    if (password !== confirmPassword) {
      errorDisplay.textContent = "Passwords do not match";
      return;
    }

    if (password.length < 6) {
      errorDisplay.textContent = "Password must be at least 6 characters";
      return;
    }

    if (!termsChecked) {
      errorDisplay.textContent = "Please agree to the terms & policy";
      return;
    }

    // Get submit button
    const submitBtn = toSignUp.querySelectorAll(".btn")[1];
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account...";

    try {
      // Call signup API
      const response = await fetch(`${API_BASE_URL}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `${firstName} ${lastName}`,
          firstName,
          lastName,
          email,
          phone,
          password,
          role: "user",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Success - Show message
      alert("Account created successfully! Redirecting to dashboard...");

      // Store token if provided
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        sessionStorage.setItem("authToken", data.token);
      }

      // Store user role
      localStorage.setItem("userRole", "user");

      // Redirect to user dashboard
      setTimeout(() => {
        window.location.href = "../users/dashboard.html";
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);
      errorDisplay.textContent =
        error.message || "An error occurred during signup";
      submitBtn.disabled = false;
      submitBtn.textContent = "Create account";
    }
  });
});
