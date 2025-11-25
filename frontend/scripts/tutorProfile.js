// frontend/js/tutorProfile.js
document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL = "http://localhost:5000";
  const photoInput = document.getElementById("photo-input");
  const changeBtn = document.getElementById("change-photo-btn");
  const profileImg = document.getElementById("profile-img");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const departmentInput = document.getElementById("department");
  const saveBtn = document.getElementById("save-btn");
  const currentPasswordInput = document.getElementById("current-password");
  const newPasswordInput = document.getElementById("new-password");
  const confirmPasswordInput = document.getElementById("confirm-password");
  const changePasswordBtn = document.getElementById("change-password-btn");

  // click handler to open file dialog
  changeBtn.addEventListener("click", () => {
    photoInput.click();
  });

  // Load current tutor profile (including saved photo) on page load
  (async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/api/dashboard/tutor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      const user = data.user || data.data || {};

      if (user.username && nameInput) nameInput.value = user.username;
      if (user.email && emailInput) emailInput.value = user.email;
      if (user.department && departmentInput) departmentInput.value = user.department;

      if (user.photo && profileImg) {
        const photoUrl = user.photo.startsWith("http")
          ? user.photo
          : `${BASE_URL}${user.photo}`;
        profileImg.src = `${photoUrl}?t=${Date.now()}`;
      }
    } catch (err) {
      console.error("Error loading tutor profile:", err);
    }
  })();

  // Save basic profile info (name, email, department)
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to save profile.");
        return;
      }

      const body = {
        name: nameInput ? nameInput.value.trim() : undefined,
        email: emailInput ? emailInput.value.trim() : undefined,
        department: departmentInput ? departmentInput.value.trim() : undefined,
      };

      try {
        const res = await fetch(`${BASE_URL}/api/tutor/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Profile update failed", data);
          return alert(data.message || "Failed to update profile");
        }

        showToast("Profile updated successfully");
      } catch (err) {
        console.error("Error updating profile", err);
        alert("Error updating profile");
      }
    });
  }

  // Change password
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to change password.");
        return;
      }

      const currentPassword = currentPasswordInput ? currentPasswordInput.value : "";
      const newPassword = newPasswordInput ? newPasswordInput.value : "";
      const confirmNewPassword = confirmPasswordInput ? confirmPasswordInput.value : "";

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert("Please fill in all password fields.");
        return;
      }

      try {
        const res = await fetch(`${BASE_URL}/api/tutor/profile/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Password change failed", data);
          return alert(data.message || "Failed to change password");
        }

        showToast("Password updated successfully");
        if (currentPasswordInput) currentPasswordInput.value = "";
        if (newPasswordInput) newPasswordInput.value = "";
        if (confirmPasswordInput) confirmPasswordInput.value = "";
      } catch (err) {
        console.error("Error changing password", err);
        alert("Error changing password");
      }
    });
  }

  photoInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // basic client-side validation
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG or PNG images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be 2MB or smaller.");
      return;
    }

    // show preview immediately (optional)
    const reader = new FileReader();
    reader.onload = () => {
      profileImg.src = reader.result;
    };
    reader.readAsDataURL(file);

    // prepare upload
    const formData = new FormData();
    formData.append("photo", file);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to change photo.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/tutor/profile/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        // update image src to server-hosted URL (prevent caching by appending timestamp)
        const serverUrl = data.photoUrl.startsWith("http")
          ? data.photoUrl
          : `${BASE_URL}${data.photoUrl}`;
        profileImg.src = `${serverUrl}?t=${Date.now()}`;
        showToast("Photo updated successfully");
      } else {
        alert(data.message || "Upload failed");
        // optionally revert preview if upload failed
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload error - check console");
    }
  });

  // small helper toast (very simple)
  function showToast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.position = "fixed";
    t.style.bottom = "20px";
    t.style.right = "20px";
    t.style.background = "#001f3f";
    t.style.color = "#fff";
    t.style.padding = "10px 14px";
    t.style.borderRadius = "8px";
    t.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)";
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
  }
});
