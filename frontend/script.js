// ==============================
// script.js
// ==============================

// Login function
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  // Validate input
  if (!email || !password) {
    msg.textContent = "Please enter both email and password!";
    msg.style.color = "#ff4d4d";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    // Always try/catch parsing JSON
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid JSON response from server");
    }

    if (res.ok && data.user) {
      // Store user info
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));

      // Redirect based on role
      redirectDashboard(data.role);
    } else {
      msg.textContent = data.message || "Login failed!";
      msg.style.color = "#ff4d4d";
    }
  } catch (err) {
    console.error("Login error:", err);
    msg.textContent = "Error connecting to server!";
    msg.style.color = "#ff4d4d";
  }
}

// Logout function
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Redirect dashboard based on role
function redirectDashboard(role) {
  switch (role) {
    case "admin":
      window.location.href = "dashboard_admin.html";
      break;
    case "agent":
      window.location.href = "dashboard_agent.html";
      break;
    case "customer":
    case "user":
      window.location.href = "dashboard_user.html";
      break;
    default:
      console.warn("Unknown role:", role);
      localStorage.clear();
      window.location.href = "login.html";
  }
}

// Auto redirect if already logged in
window.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  if (role) {
    redirectDashboard(role);
  }
});
