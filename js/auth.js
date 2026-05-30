async function login() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

  if (!email || !password) {
    showToast("Please enter your email and password", "warning");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Login failed", "error");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showToast("Welcome back!", "success", 1200);
    setTimeout(() => { window.location.href = "home.html"; }, 900);
  } catch (err) {
    console.error(err);
    showToast("Unable to connect to the server", "error");
  }
}

async function register() {
  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  const confirmPassword = document.getElementById("confirmPasswordInput").value;
  const googleSignupToken = localStorage.getItem("googleSignupToken");

  // simple validation
  if (!name || !email || !password || !confirmPassword) {
    showToast("Please fill in all fields", "warning");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        googleSignupToken
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Registration failed", "error");
      return;
    }
    localStorage.removeItem("googleSignupToken");

    showToast("Account created successfully! Redirecting to sign in...", "success", 1500);
    setTimeout(() => { window.location.href = "signin.html"; }, 1400);

  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "signin.html";
}

async function forgotPassword() {
  const email = document.getElementById("emailInput").value;

  if (!email) {
    showToast("Please enter your email", "warning");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Failed to send OTP", "error");
      return;
    }
    // Save email temporarily
    localStorage.setItem("resetEmail", email);
    showToast("OTP sent to your email", "success", 1500);
    setTimeout(() => { window.location.href = "otp.html"; }, 1300);
  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
  }
}

async function verifyOTP() {
  const inputs = document.querySelectorAll(".otp-box");

  let otp = "";
  inputs.forEach((input) => {
    otp += input.value;
  });

  const email = localStorage.getItem("resetEmail");
  if (otp.length !== 6) {
    showToast("Please enter the complete 6-digit OTP", "warning");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        email,
        otp
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "OTP verification failed", "error");
      return;

    }
    showToast("OTP verified successfully", "success", 1500);
    setTimeout(() => { window.location.href = "changePassword.html"; }, 1300);

  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
  }
}
async function resetPassword() {
  const newPassword = document.getElementById("newPasswordInput").value;
  const confirmPassword = document.getElementById("confirmPasswordInput").value;
  const email = localStorage.getItem("resetEmail");

  if (!email) {
    showToast("Reset session expired. Please start from Forgot Password again.", "error");
    setTimeout(() => { window.location.href = "emailVerification.html"; }, 1800);
    return;
  }

  if (!newPassword || !confirmPassword) {
    showToast("Please fill in all fields", "warning");
    return;
  }

  if (newPassword.length < 8) {
    showToast("Password must be at least 8 characters long", "warning");
    return;
  }

  if (newPassword !== confirmPassword) {
    showToast("Passwords do not match", "error");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        newPassword
      })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Failed to reset password", "error");
      return;
    }

    localStorage.removeItem("resetEmail");

    showToast("Password reset successful! Redirecting to sign in...", "success", 1500);
    setTimeout(() => { window.location.href = "signin.html"; }, 1400);

  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
  }
}

async function resendOTP() {
  const email = localStorage.getItem("resetEmail");

  if (!email) {
    showToast("Email not found. Please start again.", "error");
    setTimeout(() => { window.location.href = "emailVerification.html"; }, 1800);
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Failed to resend OTP", "error");
      return;
    }

    // clear old input boxes
    document.querySelectorAll(".otp-box").forEach(input => {
      input.value = "";
    });

    document.querySelector(".otp-box").focus();

    showToast("A new OTP has been sent to your email", "success");

  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
  }
}
