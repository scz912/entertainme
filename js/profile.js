let user = JSON.parse(localStorage.getItem("user"));

document.addEventListener("DOMContentLoaded", () => {
    const deleteModal = document.getElementById("deleteModal");

    loadProfile();

    if (deleteModal) {
        deleteModal.addEventListener("click", (event) => {
            if (event.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }
});

async function loadProfile() {
    if (!getToken()) {
        window.location.href = "signin.html";
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: authHeaders()
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || "Unable to load profile.", "error");
            setTimeout(() => logout(), 1500);
            return;
        }

        user = data;
        localStorage.setItem("user", JSON.stringify(user));

        setInputValue("name", user.name);
        setInputValue("email", user.email);
        setInputValue("phone", user.phone);
    } catch (err) {
        console.error(err);
        showToast("Unable to connect to the backend. Please make sure the server is running.", "error");
    }
}

function setInputValue(id, value) {
    const input = document.getElementById(id);

    if (input) {
        input.value = value || "";
    }
}

function enableEdit() {
    window.location.href = "editProfile.html";
}

async function saveProfile() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name) {
        showToast("Name cannot be empty.", "warning");
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/users/profile`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({ name, email, phone })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || "Unable to update profile.", "error");
            return;
        }

        user = data.user;
        localStorage.setItem("user", JSON.stringify(user));
        showToast("Profile updated successfully!", "success", 1500);
        setTimeout(() => { window.location.href = "profile.html"; }, 1300);
    } catch (err) {
        console.error(err);
        showToast("Unable to connect to the backend. Please make sure the server is running.", "error");
    }
}

async function changePassword() {
    const oldPass = document.getElementById("oldPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    if (!oldPass || !newPass || !confirmPass) {
        showToast("Please fill in all password fields.", "warning");
        return;
    }

    if (newPass.length < 8) {
        showToast("Password must be at least 8 characters!", "warning");
        return;
    }

    if (newPass !== confirmPass) {
        showToast("New password and confirm password do not match!", "error");
        return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/users/change-password`, {
            method: "PUT",
            headers: authHeaders(),
            body: JSON.stringify({
                oldPassword: oldPass,
                newPassword: newPass
            })
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || "Unable to change password.", "error");
            return;
        }

        showToast("Password updated successfully!", "success");
        document.getElementById("oldPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
    } catch (err) {
        console.error(err);
        showToast("Unable to connect to the backend. Please make sure the server is running.", "error");
    }
}

function togglePasswordVisibility(inputId, toggleButton) {
    const input = document.getElementById(inputId);
    const icon = toggleButton.querySelector("i");

    if (!input || !icon) {
        return;
    }

    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    icon.classList.toggle("bi-eye", !isHidden);
    icon.classList.toggle("bi-eye-slash", isHidden);
    toggleButton.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
}

function openDeleteModal() {
    const modal = document.getElementById("deleteModal");

    if (modal) {
        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
    }
}

function closeDeleteModal() {
    const modal = document.getElementById("deleteModal");

    if (modal) {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
    }
}

async function confirmDeleteAccount() {
    try {
        const res = await fetch(`${API_BASE_URL}/users/profile`, {
            method: "DELETE",
            headers: authHeaders()
        });

        const data = await res.json();

        if (!res.ok) {
            showToast(data.message || "Unable to delete account.", "error");
            return;
        }

        closeDeleteModal();
        showToast(data.message || "Account deleted", "success", 1500);
        setTimeout(() => logout(), 1300);
    } catch (err) {
        console.error(err);
        showToast("Unable to connect to the backend. Please make sure the server is running.", "error");
    }
}

function deleteAccount() {
    openDeleteModal();
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    window.location.href = "signin.html";
}
