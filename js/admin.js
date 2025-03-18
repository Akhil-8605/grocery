import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXZBgFo3SmvYX_B1_165DB2EQo5ksO6cY",
  authDomain: "grocery-47.firebaseapp.com",
  projectId: "grocery-47",
  storageBucket: "grocery-47.firebasestorage.app",
  messagingSenderId: "412954766156",
  appId: "1:412954766156:web:db164f0110e014524afde9",
  measurementId: "G-7XB7GC36H7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");
const usersTableBody = document.getElementById("users-table-body");
const ordersTableBody = document.getElementById("orders-table-body");
const usersSkeleton = document.getElementById("users-skeleton");
const ordersSkeleton = document.getElementById("orders-skeleton");
const noUsers = document.getElementById("no-users");
const noOrders = document.getElementById("no-orders");
const userSearchInput = document.getElementById("user-search");
const orderSearchInput = document.getElementById("order-search");
const userSearchBtn = document.getElementById("user-search-btn");
const orderSearchBtn = document.getElementById("order-search-btn");
const logoutBtn = document.getElementById("logout-btn");
const orderDetailsModal = document.getElementById("order-details-modal");
const closeModal = document.querySelector(".close-modal");
const orderDetailsContent = document.getElementById("order-details-content");
const adminSection = document.querySelector(".admin-section");

// Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("admin-name").textContent =
      user.displayName || "Admin";
    // Only load data if the logged-in user is the admin
    if (user.email === "akhileshadam186@gmail.com") {
      loadUsers();
      loadOrders();
    } else {
      showAccessDenied();
    }
  } else {
    window.location.href = "login.html";
  }
});

// Function to show access denied message
function showAccessDenied() {
  if (adminSection) {
    adminSection.innerHTML = `
      <div class="access-denied">
          <i class="fa fa-exclamation-triangle"></i>
          <h2>Access Denied</h2>
          <p>You are not authorized to access the admin dashboard.</p>
          <p>Only administrators can access this page.</p>
          <button id="back-to-home" class="btn">Back to Home</button>
      </div>
    `;
    document.getElementById("back-to-home").addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}

// Tab functionality
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));
    button.classList.add("active");
    const tabId = button.getAttribute("data-tab");
    document.getElementById(`${tabId}-tab`).classList.add("active");
    if (tabId === "users") {
      loadUsers();
    } else if (tabId === "orders") {
      loadOrders();
    }
  });
});

// Search functionality for users
userSearchBtn.addEventListener("click", () => {
  const searchTerm = userSearchInput.value.trim().toLowerCase();
  filterUsers(searchTerm);
});
userSearchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const searchTerm = userSearchInput.value.trim().toLowerCase();
    filterUsers(searchTerm);
  }
});

// Search functionality for orders
orderSearchBtn.addEventListener("click", () => {
  const searchTerm = orderSearchInput.value.trim().toLowerCase();
  filterOrders(searchTerm);
});
orderSearchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const searchTerm = orderSearchInput.value.trim().toLowerCase();
    filterOrders(searchTerm);
  }
});

// Logout functionality
logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
});

// Modal close functionality
closeModal.addEventListener("click", () => {
  orderDetailsModal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === orderDetailsModal) {
    orderDetailsModal.style.display = "none";
  }
});

// Load Users from Firestore
async function loadUsers() {
  if (!usersTableBody || !usersSkeleton) return;
  try {
    usersSkeleton.style.display = "block";
    document.getElementById("users-table").style.display = "none";
    noUsers.style.display = "none";
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("lastLogin", "desc"));
    const querySnapshot = await getDocs(q);
    console.log("Number of users fetched:", querySnapshot.size);
    usersTableBody.innerHTML = "";
    if (querySnapshot.empty) {
      usersSkeleton.style.display = "none";
      document.getElementById("users-table").style.display = "none";
      noUsers.style.display = "flex";
      return;
    }
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const row = document.createElement("tr");
      const lastLogin =
        userData.lastLogin && userData.lastLogin.seconds
          ? new Date(userData.lastLogin.seconds * 1000).toLocaleString()
          : "Never";
      row.innerHTML = `
        <td>${userData.displayName || "N/A"}</td>
        <td>${userData.email || "N/A"}</td>
        <td>${lastLogin}</td>
        <td>
          <button class="action-btn view-btn" data-id="${doc.id}">View</button>
          <button class="action-btn delete-btn" data-id="${
            doc.id
          }">Delete</button>
        </td>
      `;
      usersTableBody.appendChild(row);
    });
    addUserActionListeners();
    usersSkeleton.style.display = "none";
    document.getElementById("users-table").style.display = "table";
  } catch (error) {
    console.error("Error loading users:", error);
    usersSkeleton.style.display = "none";
    document.getElementById("users-table").style.display = "none";
    noUsers.style.display = "flex";
    noUsers.querySelector("p").textContent = "Error loading users";
  }
}

// Load Orders from Firestore
async function loadOrders() {
  if (!ordersTableBody || !ordersSkeleton) return;
  try {
    ordersSkeleton.style.display = "block";
    document.getElementById("orders-table").style.display = "none";
    noOrders.style.display = "none";
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    ordersTableBody.innerHTML = "";
    if (querySnapshot.empty) {
      ordersSkeleton.style.display = "none";
      document.getElementById("orders-table").style.display = "none";
      noOrders.style.display = "flex";
      return;
    }
    querySnapshot.forEach((doc) => {
      const orderData = doc.data();
      const row = document.createElement("tr");
      const orderDate = orderData.orderDate || "N/A";
      row.innerHTML = `
        <td>${orderData.orderNumber || "N/A"}</td>
        <td>${orderData.customerName || "N/A"}</td>
        <td>${orderDate}</td>
        <td>₹${orderData.total ? orderData.total.toFixed(2) : "0.00"}</td>
        <td>
          <button class="action-btn view-btn" data-id="${doc.id}">View</button>
          <button class="action-btn delete-btn" data-id="${
            doc.id
          }">Delete</button>
        </td>
      `;
      ordersTableBody.appendChild(row);
    });
    addOrderActionListeners();
    ordersSkeleton.style.display = "none";
    document.getElementById("orders-table").style.display = "table";
  } catch (error) {
    console.error("Error loading orders:", error);
    ordersSkeleton.style.display = "none";
    document.getElementById("orders-table").style.display = "none";
    noOrders.style.display = "flex";
    noOrders.querySelector("p").textContent = "Error loading orders";
  }
}

// Filter Users
function filterUsers(searchTerm) {
  const rows = usersTableBody.querySelectorAll("tr");
  let hasVisibleRows = false;
  rows.forEach((row) => {
    const name = row.cells[0].textContent.toLowerCase();
    const email = row.cells[1].textContent.toLowerCase();
    if (name.includes(searchTerm) || email.includes(searchTerm)) {
      row.style.display = "";
      hasVisibleRows = true;
    } else {
      row.style.display = "none";
    }
  });
  if (hasVisibleRows) {
    document.getElementById("users-table").style.display = "table";
    noUsers.style.display = "none";
  } else {
    document.getElementById("users-table").style.display = "none";
    noUsers.style.display = "flex";
    noUsers.querySelector("p").textContent =
      "No users found matching your search";
  }
}

// Filter Orders
function filterOrders(searchTerm) {
  const rows = ordersTableBody.querySelectorAll("tr");
  let hasVisibleRows = false;
  rows.forEach((row) => {
    const orderId = row.cells[0].textContent.toLowerCase();
    const customer = row.cells[1].textContent.toLowerCase();
    if (orderId.includes(searchTerm) || customer.includes(searchTerm)) {
      row.style.display = "";
      hasVisibleRows = true;
    } else {
      row.style.display = "none";
    }
  });
  if (hasVisibleRows) {
    document.getElementById("orders-table").style.display = "table";
    noOrders.style.display = "none";
  } else {
    document.getElementById("orders-table").style.display = "none";
    noOrders.style.display = "flex";
    noOrders.querySelector("p").textContent =
      "No orders found matching your search";
  }
}

// Add User Action Listeners
function addUserActionListeners() {
  document.querySelectorAll("#users-table-body .view-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const userId = button.getAttribute("data-id");
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          alert(
            `User Details:\nName: ${userData.displayName || "N/A"}\nEmail: ${
              userData.email || "N/A"
            }\nLast Login: ${
              userData.lastLogin && userData.lastLogin.seconds
                ? new Date(userData.lastLogin.seconds * 1000).toLocaleString()
                : "Never"
            }`
          );
        } else {
          alert("User not found");
        }
      } catch (error) {
        console.error("Error getting user:", error);
        alert("Error getting user details");
      }
    });
  });
  document
    .querySelectorAll("#users-table-body .delete-btn")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this user?")) {
          const userId = button.getAttribute("data-id");
          try {
            await deleteDoc(doc(db, "users", userId));
            alert("User deleted successfully");
            loadUsers();
          } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error deleting user");
          }
        }
      });
    });
}

// Add Order Action Listeners
function addOrderActionListeners() {
  document
    .querySelectorAll("#orders-table-body .view-btn")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const orderId = button.getAttribute("data-id");
        try {
          const orderDoc = await getDoc(doc(db, "orders", orderId));
          if (orderDoc.exists()) {
            const orderData = orderDoc.data();
            showOrderDetails(orderData);
          } else {
            alert("Order not found");
          }
        } catch (error) {
          console.error("Error getting order:", error);
          alert("Error getting order details");
        }
      });
    });
  document
    .querySelectorAll("#orders-table-body .delete-btn")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this order?")) {
          const orderId = button.getAttribute("data-id");
          try {
            await deleteDoc(doc(db, "orders", orderId));
            alert("Order deleted successfully");
            loadOrders();
          } catch (error) {
            console.error("Error deleting order:", error);
            alert("Error deleting order");
          }
        }
      });
    });
}

// Show Order Details in Modal
function showOrderDetails(orderData) {
  if (!orderDetailsContent || !orderDetailsModal) return;
  let itemsHtml = "";
  if (orderData.items && orderData.items.length > 0) {
    orderData.items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      itemsHtml += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>₹${itemTotal.toFixed(2)}</td>
        </tr>
      `;
    });
  } else {
    itemsHtml = '<tr><td colspan="4">No items found</td></tr>';
  }
  const orderDetailsHtml = `
    <div class="order-details-section">
      <h3>Order Information</h3>
      <div class="order-info-grid">
        <div class="order-info-item">
          <span>Order ID:</span> ${orderData.orderNumber || "N/A"}
        </div>
        <div class="order-info-item">
          <span>Date:</span> ${orderData.orderDate || "N/A"}
        </div>
        <div class="order-info-item">
          <span>Payment Method:</span> ${orderData.paymentMethod || "N/A"}
        </div>
        <div class="order-info-item">
          <span>Status:</span> <span style="color: var(--success);">Completed</span>
        </div>
      </div>
    </div>
    
    <div class="order-details-section">
      <h3>Customer Information</h3>
      <div class="order-info-grid">
        <div class="order-info-item">
          <span>Name:</span> ${orderData.customerName || "N/A"}
        </div>
        <div class="order-info-item">
          <span>Email:</span> ${orderData.userEmail || "N/A"}
        </div>
        <div class="order-info-item">
          <span>Phone:</span> ${orderData.customerPhone || "N/A"}
        </div>
        <div class="order-info-item">
          <span>Address:</span> ${orderData.customerAddress || "N/A"}, ${
    orderData.customerCity || ""
  }, ${orderData.customerZip || ""}
        </div>
      </div>
    </div>
    
    <div class="order-details-section">
      <h3>Order Items</h3>
      <table class="order-items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div class="order-total-section">
        <div class="order-total-row">
          <span>Subtotal:</span>
          <span>₹${
            orderData.subtotal ? orderData.subtotal.toFixed(2) : "0.00"
          }</span>
        </div>
        <div class="order-total-row">
          <span>Shipping:</span>
          <span>₹${
            orderData.shipping ? orderData.shipping.toFixed(2) : "0.00"
          }</span>
        </div>
        <div class="order-total-row">
          <span>Tax:</span>
          <span>₹${orderData.tax ? orderData.tax.toFixed(2) : "0.00"}</span>
        </div>
        <div class="order-total-row final">
          <span>Total:</span>
          <span>₹${orderData.total ? orderData.total.toFixed(2) : "0.00"}</span>
        </div>
      </div>
    </div>
  `;
  orderDetailsContent.innerHTML = orderDetailsHtml;
  orderDetailsModal.style.display = "block";
}
