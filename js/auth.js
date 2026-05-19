async function login() {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;

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
}

async function register() {
  const name = document.getElementById("nameInput").value;
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  const confirmPassword = document.getElementById("confirmPasswordInput").value;

  // simple validation
  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
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
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Account created successfully!");

    // redirect to login
    window.location.href = "signin.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
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
    alert("Please enter your email");
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
      alert(data.message);
      return;
    }
    // Save email temporarily
    localStorage.setItem("resetEmail", email);
    alert("OTP sent to your email");
    window.location.href = "otp.html";
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
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
    alert("Please enter complete OTP");
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
      alert(data.message);
      return;

    }
    alert("OTP verified");
    window.location.href = "changePassword.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}
async function resetPassword() {
  const newPassword = document.getElementById("newPasswordInput").value;
  const confirmPassword = document.getElementById("confirmPasswordInput").value;
  const email = localStorage.getItem("resetEmail");

  if (!email) {
    alert("Reset email not found. Please start from Forgot Password again.");
    window.location.href = "emailVerification.html";
    return;
  }

  if (!newPassword || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (newPassword.length < 8) {
    alert("Password must be at least 8 characters long");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
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
      alert(data.message);
      return;
    }

    localStorage.removeItem("resetEmail");

    alert("Password reset successful");
    window.location.href = "signin.html";

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}

async function resendOTP() {
  const email = localStorage.getItem("resetEmail");

  if (!email) {
    alert("Email not found. Please start again.");
    window.location.href = "emailVerification.html";
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
      alert(data.message);
      return;
    }

    // clear old input boxes
    document.querySelectorAll(".otp-box").forEach(input => {
      input.value = "";
    });

    document.querySelector(".otp-box").focus();

    alert("A new OTP has been sent to your email");

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
}