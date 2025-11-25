// -------------------- CONFIG --------------------
const API_URL = "/api/tutor/files"; // Tutor backend (same-origin)
const token = localStorage.getItem("token");

// -------------------- DOM ELEMENTS --------------------
const studentsList = document.querySelector(".students-list");
const projectsList = document.querySelector(".projects-list");
const projectsTitle = document.getElementById("projects-title");
const totalStudentsEl = document.getElementById("total-students");
const totalProjectsEl = document.getElementById("total-projects");
const searchInput = document.getElementById("search-bar");
const returnBtn = document.getElementById("return-dashboard-btn");

// -------------------- FETCH FILES --------------------
async function getTutorFiles() {
  try {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Could not fetch tutor files");

    const files = await res.json();
    const grouped = files.reduce((acc, file) => {
      const student = file.studentName || "Unknown Student";
      if (!acc[student]) acc[student] = [];
      acc[student].push(file);
      return acc;
    }, {});

    renderStudents(grouped);
    updateTotals(grouped);
  } catch (err) {
    console.error(err);
  }
}

// -------------------- RENDER STUDENTS --------------------
function renderStudents(groupedFiles) {
  studentsList.innerHTML = "";

  Object.entries(groupedFiles).forEach(([studentName, files]) => {
    const li = document.createElement("li");
    li.className = "student";
    li.dataset.studentName = studentName;
    li.innerHTML = `
      <span>${studentName}</span>
      <label>
        <input type="checkbox" class="student-check">
        Checked
      </label>
    `;
    li.addEventListener("click", () => renderProjects(studentName, files));
    studentsList.appendChild(li);
  });
}

// -------------------- RENDER PROJECTS --------------------
function renderProjects(studentName, files) {
  projectsTitle.textContent = `Projects by ${studentName}`;
  projectsList.innerHTML = "";

  files.forEach(file => {
    const card = document.createElement("div");
    card.className = "project-card";

    card.innerHTML = `
      <div class="project-info">
        <h4>Project: ${file.fileName}</h4>
        <p>Uploaded: ${new Date(file.uploadedAt).toLocaleDateString()}</p>
        <p class="project-status">Status: ${file.status ? capitalize(file.status) : "Pending"}</p>
        ${file.feedback ? `<p class="project-feedback"><strong>Feedback:</strong> ${file.feedback}</p>` : ""}
      </div>
      <div class="project-actions">
        <a href="/${file.filePath}" target="_blank">
          <button>Download</button>
        </a>
        <label>
          <input type="checkbox" class="project-check" ${file.status === "reviewed" ? "checked" : ""} disabled>
          Reviewed
        </label>
        <textarea class="feedback-input" placeholder="Write feedback...">${file.feedback || ""}</textarea>
        <button class="feedback-btn">Send feedback</button>
      </div>
    `;

    const feedbackInput = card.querySelector(".feedback-input");
    const feedbackBtn = card.querySelector(".feedback-btn");
    const statusEl = card.querySelector(".project-status");
    const reviewedCheckbox = card.querySelector(".project-check");

    feedbackBtn.addEventListener("click", async () => {
      const feedback = feedbackInput.value.trim();
      try {
        const res = await fetch(`/api/tutor/files/${file._id}/review`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ feedback }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Feedback update failed", data);
          return alert(data.message || "Failed to update feedback");
        }

        // Update UI to reflect reviewed status
        if (statusEl) {
          statusEl.textContent = "Status: Reviewed";
        }
        if (reviewedCheckbox) {
          reviewedCheckbox.checked = true;
        }

        alert("Feedback saved and file marked as reviewed");
        // Optionally refresh full list in background for consistency
        getTutorFiles();
      } catch (err) {
        console.error("Error sending feedback", err);
        alert("Error sending feedback");
      }
    });

    projectsList.appendChild(card);
  });
}

// -------------------- HELPER FUNCTIONS --------------------
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function updateTotals(groupedFiles) {
  const totalStudents = Object.keys(groupedFiles).length;
  const totalProjects = Object.values(groupedFiles).reduce((sum, arr) => sum + arr.length, 0);

  totalStudentsEl.textContent = totalStudents;
  totalProjectsEl.textContent = totalProjects;
}

// -------------------- SEARCH STUDENTS --------------------
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  document.querySelectorAll(".student").forEach(li => {
    li.style.display = li.dataset.studentName.toLowerCase().includes(query) ? "" : "none";
  });
});

// -------------------- RETURN BUTTON --------------------
returnBtn.addEventListener("click", () => {
  window.location.href = "tutor.html";
});

// -------------------- INITIALIZE --------------------
document.addEventListener("DOMContentLoaded", getTutorFiles);
