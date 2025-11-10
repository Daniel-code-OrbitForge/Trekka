const API_BASE_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signUpForm");
  const cards = document.getElementsByClassName("card");
  const stages = document.querySelectorAll(".stage");
  const nextBtns = document.querySelectorAll(".company-next-btn");
  const backBtns = document.querySelectorAll(".company-back-btn");

  let currentStep = 0;

  function updateStage(step) {
    stages.forEach((stage, index) => {
      if (index <= step) {
        stage.classList.add("active-stage");
      } else {
        stage.classList.remove("active-stage");
      }
    });
  }

  // Next buttons
  nextBtns[0].addEventListener("click", () => {
    cards[0].classList.remove("active");
    cards[1].classList.add("active");
    currentStep = 1;
    updateStage(currentStep);
  });

  nextBtns[1].addEventListener("click", () => {
    cards[1].classList.remove("active");
    cards[2].classList.add("active");
    currentStep = 2;
    updateStage(currentStep);
  });

  // Back buttons
  backBtns[0].addEventListener("click", () => {
    cards[1].classList.remove("active");
    cards[0].classList.add("active");
    currentStep = 0;
    updateStage(currentStep);
  });

  backBtns[1].addEventListener("click", () => {
    cards[2].classList.remove("active");
    cards[1].classList.add("active");
    currentStep = 1;
    updateStage(currentStep);
  });

  backBtns[2].addEventListener("click", () => {
    cards[2].classList.remove("active");
    cards[1].classList.add("active");
    currentStep = 1;
    updateStage(currentStep);
  });

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const companyName = document.getElementById("companyName").value.trim();
    const companyEmail = document.getElementById("companyEmail").value.trim();
    const companyPhone = document.getElementById("companyPhone").value.trim();
    const country = document.getElementById("country").value.trim();
    const website = document.getElementById("website").value.trim();
    const password = document
      .getElementById("company-password")
      ?.querySelector("input").value;
    const confirmPassword = document
      .getElementById("company-confirm")
      ?.querySelector("input").value;
    const termsChecked = document.querySelector('input[name="terms"]').checked;

    // Error display
    let errorDisplay = document.getElementById("company-signup-error");
    if (!errorDisplay) {
      errorDisplay = document.createElement("div");
      errorDisplay.id = "company-signup-error";
      errorDisplay.style.color = "red";
      errorDisplay.style.marginBottom = "10px";
      errorDisplay.style.fontSize = "14px";
      cards[2].insertBefore(errorDisplay, cards[2].querySelector(".divider"));
    }

    errorDisplay.textContent = "";

    // Validation
    if (
      !companyName ||
      !companyEmail ||
      !companyPhone ||
      !country ||
      !password
    ) {
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
      errorDisplay.textContent =
        "Please agree to the Terms of Service and Privacy Policy";
      return;
    }

    const submitBtn = nextBtns[2];
    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    try {
      // Call company signup API
      const response = await fetch(
        `${API_BASE_URL}/api/company/company-signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName,
            companyEmail,
            password,
            industry: "Transportation",
            phone: companyPhone,
            country,
            website: website || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Company registration failed");
      }

      // Success
      alert("Company registered successfully! Redirecting to dashboard...");

      // Store token and role
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        sessionStorage.setItem("authToken", data.token);
      }

      localStorage.setItem("userRole", "company");

      // Redirect to company dashboard
      setTimeout(() => {
        window.location.href = "../company/companyDashboard.html";
      }, 1500);
    } catch (error) {
      console.error("Company signup error:", error);
      errorDisplay.textContent =
        error.message || "An error occurred during registration";
      submitBtn.disabled = false;
      submitBtn.textContent = "Register Company";
    }
  });
});
