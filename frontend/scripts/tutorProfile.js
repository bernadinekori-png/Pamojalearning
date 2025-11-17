// frontend/js/tutorProfile.js
document.addEventListener("DOMContentLoaded", () => {
  const photoInput = document.getElementById("photo-input");
  const changeBtn = document.getElementById("change-photo-btn");
  const profileImg = document.getElementById("profile-img");

  // click handler to open file dialog
  changeBtn.addEventListener("click", () => {
    photoInput.click();
  });

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
      const res = await fetch("http://localhost:5000/api/tutor-dashboard/profile/photo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        // update image src to server-hosted URL (prevent caching by appending timestamp)
        profileImg.src = `${data.photoUrl}?t=${Date.now()}`;
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
