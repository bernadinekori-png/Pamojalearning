// -------------------- CONFIG --------------------
const API_URL = "http://localhost:5000/api/tutor/files"; // Tutor backend
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
        <p>Status: ${file.status ? capitalize(file.status) : "Pending"}</p>
      </div>
      <div class="project-actions">
        <a href="http://localhost:5000/${file.filePath}" target="_blank">
          <button>Download</button>
        </a>
        <label>
          <input type="checkbox" class="project-check" ${file.status === "reviewed" ? "checked" : ""} disabled>
          Reviewed
        </label>
      </div>
    `;

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
