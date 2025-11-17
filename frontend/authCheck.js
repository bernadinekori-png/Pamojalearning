// authCheck.js

function checkToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    // No token found — redirect to login
    window.location.href = "filee.html";
    return;
  }

  try {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // Convert seconds to milliseconds

    if (Date.now() > expiry) {
      console.warn("Token expired. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      alert("Session expired. Please log in again.");
      window.location.href = "filee.html";
    }
  } catch (err) {
    console.error("Invalid token, clearing...");
    localStorage.clear();
    window.location.href = "filee.html";
  }
}

// Run it automatically
checkToken();
