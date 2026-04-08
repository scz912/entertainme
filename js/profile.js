let user = JSON.parse(localStorage.getItem("currentUser"));

// ✅ 如果没有 user（Phase 1 fallback）
if (!user) {
    user = {
        name: "See Chan Sing",
        email: "test@gmail.com",
        password: "123456",
        phone: "0123456789"
    };
    localStorage.setItem("currentUser", JSON.stringify(user));
}

// ✅ Load profile
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;
});

// ✅ Enable edit
function enableEdit() {
    document.getElementById("name").disabled = false;
    document.getElementById("phone").disabled = false;
}

// ✅ Save profile
function saveProfile() {
    user.name = document.getElementById("name").value;
    user.phone = document.getElementById("phone").value;

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Profile updated successfully!");
}

// ✅ Change password
function changePassword() {
    const oldPass = document.getElementById("oldPassword").value;
    const newPass = document.getElementById("newPassword").value;

    if (oldPass !== user.password) {
        alert("Current password is incorrect!");
        return;
    }

    if (newPass.length < 4) {
        alert("Password must be at least 4 characters!");
        return;
    }

    user.password = newPass;
    localStorage.setItem("currentUser", JSON.stringify(user));

    alert("Password updated successfully!");
}

// ✅ Delete account
function deleteAccount() {
    if (confirm("Are you sure you want to delete your account?")) {
        localStorage.removeItem("currentUser");
        window.location.href = "login.html";
    }
}

// ✅ Logout
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}