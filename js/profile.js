let user = JSON.parse(localStorage.getItem("currentUser"));

// Phase 1 fallback data.
if (!user) {
    user = {
        name: "See Chan Sing",
        email: "test@gmail.com",
        password: "123456",
        phone: "0123456789"
    };
    localStorage.setItem("currentUser", JSON.stringify(user));
}

document.addEventListener("DOMContentLoaded", () => {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const deleteModal = document.getElementById("deleteModal");

    if (nameInput) {
        nameInput.value = user.name;
    }

    if (emailInput) {
        emailInput.value = user.email;
    }

    if (phoneInput) {
        phoneInput.value = user.phone;
    }

    if (deleteModal) {
        deleteModal.addEventListener("click", (event) => {
            if (event.target === deleteModal) {
                closeDeleteModal();
            }
        });
    }
});

function enableEdit() {
    window.location.href = "editProfile.html";
}

function saveProfile() {
    user.name = document.getElementById("name").value;
    user.phone = document.getElementById("phone").value;

    localStorage.setItem("currentUser", JSON.stringify(user));
    alert("Profile updated successfully!");
    window.location.href = "profile.html";
}

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
    document.getElementById("oldPassword").value = "";
    document.getElementById("newPassword").value = "";
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

function confirmDeleteAccount() {
    localStorage.removeItem("currentUser");
    window.location.href = "signup.html";
}

function deleteAccount() {
    openDeleteModal();
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}
