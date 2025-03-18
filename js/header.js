document.addEventListener("DOMContentLoaded", function () {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));

  // Get header element
  const header = document.querySelector(".header");

  if (header && user) {
    // User is logged in, update header
    const icons = header.querySelector(".icons");

    // Remove existing login icon
    const loginIcon = icons.querySelector("#login-btn").parentNode;
    icons.removeChild(loginIcon);

    // Create user profile element
    const userProfile = document.createElement("div");
    userProfile.className = "user-profile";

    // Create user name element
    const userName = document.createElement("span");
    userName.className = "user-name";
    userName.textContent = user.displayName;

    // Create logout button
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "logout-btn";
    logoutBtn.innerHTML = '<i class="fa fa-sign-out"></i>';
    logoutBtn.title = "Logout";

    // Add event listener to logout button
    logoutBtn.addEventListener("click", function () {
      if (typeof window.signOutUser === "function") {
        window.signOutUser();
      } else {
        // Fallback if signOutUser is not available
        localStorage.removeItem("user");
        localStorage.removeItem("isAdmin");
        window.location.href = "index.html";
      }
    });

    // Add admin link if user is admin
    if (localStorage.getItem("isAdmin") === "true") {
      const adminLink = document.createElement("a");
      adminLink.href = "admin.html";
      adminLink.className = "admin-link";
      adminLink.innerHTML = '<i class="fa fa-cog"></i>';
      adminLink.title = "Admin Dashboard";

      userProfile.appendChild(adminLink);
    }

    // Append elements to user profile
    userProfile.appendChild(userName);
    userProfile.appendChild(logoutBtn);

    // Append user profile to icons
    icons.appendChild(userProfile);
  }
});
