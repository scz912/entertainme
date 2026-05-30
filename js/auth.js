async function login() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

<<<<<<< HEAD
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
=======
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  window.location.href = "home.html";
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
}

async function register() {
  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  const confirmPassword = document.getElementById("confirmPasswordInput").value;
  const googleSignupToken = localStorage.getItem("googleSignupToken");

  // simple validation
  if (!name || !email || !password || !confirmPassword) {
<<<<<<< HEAD
    showToast("Please fill in all fields", "warning");
=======
    alert("Please fill all fields");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
    return;
  }

  if (password !== confirmPassword) {
<<<<<<< HEAD
    showToast("Passwords do not match", "error");
=======
    alert("Passwords do not match");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
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
<<<<<<< HEAD
      showToast(data.message || "Registration failed", "error");
=======
      alert(data.message);
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
      return;
    }
    localStorage.removeItem("googleSignupToken");

<<<<<<< HEAD
    showToast("Account created successfully! Redirecting to sign in...", "success", 1500);
    setTimeout(() => { window.location.href = "signin.html"; }, 1400);

  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
=======
    alert("Account created successfully!");

    // redirect to login
    window.location.href = "signin.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
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
<<<<<<< HEAD
    showToast("Please enter your email", "warning");
=======
    alert("Please enter your email");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
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
<<<<<<< HEAD
      showToast(data.message || "Failed to send OTP", "error");
=======
      alert(data.message);
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
      return;
    }
    // Save email temporarily
    localStorage.setItem("resetEmail", email);
<<<<<<< HEAD
    showToast("OTP sent to your email", "success", 1500);
    setTimeout(() => { window.location.href = "otp.html"; }, 1300);
  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
=======
    alert("OTP sent to your email");
    window.location.href = "otp.html";
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
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
<<<<<<< HEAD
    showToast("Please enter the complete 6-digit OTP", "warning");
=======
    alert("Please enter complete OTP");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
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
<<<<<<< HEAD
      showToast(data.message || "OTP verification failed", "error");
      return;

    }
    showToast("OTP verified successfully", "success", 1500);
    setTimeout(() => { window.location.href = "changePassword.html"; }, 1300);

  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
=======
      alert(data.message);
      return;

    }
    alert("OTP verified");
    window.location.href = "changePassword.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
  }
}
async function resetPassword() {
  const newPassword = document.getElementById("newPasswordInput").value;
  const confirmPassword = document.getElementById("confirmPasswordInput").value;
  const email = localStorage.getItem("resetEmail");

  if (!email) {
<<<<<<< HEAD
    showToast("Reset session expired. Please start from Forgot Password again.", "error");
    setTimeout(() => { window.location.href = "emailVerification.html"; }, 1800);
=======
    alert("Reset email not found. Please start from Forgot Password again.");
    window.location.href = "emailVerification.html";
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
    return;
  }

  if (!newPassword || !confirmPassword) {
<<<<<<< HEAD
    showToast("Please fill in all fields", "warning");
=======
    alert("Please fill all fields");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
    return;
  }

  if (newPassword.length < 8) {
<<<<<<< HEAD
    showToast("Password must be at least 8 characters long", "warning");
=======
    alert("Password must be at least 8 characters long");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
    return;
  }

  if (newPassword !== confirmPassword) {
<<<<<<< HEAD
    showToast("Passwords do not match", "error");
=======
    alert("Passwords do not match");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
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
<<<<<<< HEAD
      showToast(data.message || "Failed to reset password", "error");
=======
      alert(data.message);
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
      return;
    }

    localStorage.removeItem("resetEmail");

<<<<<<< HEAD
    showToast("Password reset successful! Redirecting to sign in...", "success", 1500);
    setTimeout(() => { window.location.href = "signin.html"; }, 1400);

  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
=======
    alert("Password reset successful");
    window.location.href = "signin.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
  }
}

async function resendOTP() {
  const email = localStorage.getItem("resetEmail");

  if (!email) {
<<<<<<< HEAD
    showToast("Email not found. Please start again.", "error");
    setTimeout(() => { window.location.href = "emailVerification.html"; }, 1800);
=======
    alert("Email not found. Please start again.");
    window.location.href = "emailVerification.html";
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
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
<<<<<<< HEAD
      showToast(data.message || "Failed to resend OTP", "error");
=======
      alert(data.message);
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
      return;
    }

    // clear old input boxes
    document.querySelectorAll(".otp-box").forEach(input => {
      input.value = "";
    });

    document.querySelector(".otp-box").focus();

<<<<<<< HEAD
    showToast("A new OTP has been sent to your email", "success");

  } catch (err) {
    console.error(err);
    showToast("Something went wrong. Please try again.", "error");
  }
}
=======
    alert("A new OTP has been sent to your email");

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}
>>>>>>> 3def0189ab452073688d0738466ff1be5492494d
