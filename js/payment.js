import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function () {
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if cart is empty
  if (cart.length === 0) {
    alert("Your cart is empty. Please add items to your cart before checkout.");
    window.location.href = "index.html";
    return;
  }

  // Get DOM elements
  const subtotalElement = document.getElementById("payment-subtotal");
  const taxElement = document.getElementById("payment-tax");
  const shippingElement = document.getElementById("payment-shipping");
  const totalElement = document.getElementById("payment-total");
  const completePaymentBtn = document.getElementById("complete-payment");
  const orderItemsList = document.getElementById("order-items-list");

  // Generate random order number
  const orderNumber = "ORD-" + Math.floor(Math.random() * 100000);
  document.getElementById("order-number").textContent = orderNumber;

  // Display cart items in order details
  displayCartItems();

  // Calculate and display order summary
  calculateOrderSummary();

  // Add event listeners to payment method radio buttons
  const paymentMethods = document.querySelectorAll(
    'input[name="payment-method"]'
  );
  const upiForm = document.getElementById("upi-form");
  const codForm = document.getElementById("cod-form");

  // Generate QR code
  generateQRCode();

  paymentMethods.forEach((method) => {
    method.addEventListener("change", function () {
      if (this.id === "upi") {
        upiForm.style.display = "block";
        codForm.style.display = "none";
      } else if (this.id === "cash-on-delivery") {
        upiForm.style.display = "none";
        codForm.style.display = "block";
      }
    });
  });

  // Add event listener to complete payment button
  if (completePaymentBtn) {
    completePaymentBtn.addEventListener("click", function () {
      processPayment();
    });
  }

  // Function to display cart items
  function displayCartItems() {
    if (!orderItemsList) return;

    // Clear existing items
    orderItemsList.innerHTML = "";

    // Add each cart item to the list
    cart.forEach((item) => {
      const row = document.createElement("tr");
      const itemTotal = item.price * item.quantity;

      row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toFixed(2)}</td>
                <td>₹${itemTotal.toFixed(2)}</td>
            `;

      orderItemsList.appendChild(row);
    });
  }

  // Function to calculate order summary
  function calculateOrderSummary() {
    if (!subtotalElement || !taxElement || !totalElement || !shippingElement)
      return;

    // Calculate subtotal
    let subtotal = 0;

    cart.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    // Calculate tax (10%)
    const tax = subtotal * 0.1;

    // Calculate shipping (₹5 if subtotal > 0)
    const shipping = subtotal > 0 ? 5 : 0;

    // Calculate total
    const total = subtotal + tax + shipping;

    // Update summary elements
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    taxElement.textContent = `₹${tax.toFixed(2)}`;
    shippingElement.textContent = `₹${shipping.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;

    // Store total for QR code
    localStorage.setItem("orderTotal", total.toFixed(2));
  }

  // Function to generate QR code
  function generateQRCode() {
    const qrcodeContainer = document.getElementById("qrcode");
    if (!qrcodeContainer) return;

    // Get total amount
    const total = localStorage.getItem("orderTotal") || "0.00";

    // Create UPI payment URL
    const upiId = "8605050804@ybl";
    const paymentData = `upi://pay?pa=${upiId}&pn=Groco&am=${total}&cu=INR&tn=Payment for Grocery Order`;

    // Generate QR code
    try {
      // Check if QRCode is available
      if (typeof QRCode === "undefined") {
        console.error("QRCode library not loaded");
        qrcodeContainer.innerHTML =
          "<p>QR Code library not loaded. Please include the QRCode library.</p>";
        return;
      }
      new QRCode(qrcodeContainer, {
        text: paymentData,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    } catch (error) {
      console.error("Error generating QR code:", error);
      qrcodeContainer.innerHTML =
        "<p>Failed to generate QR code. Please ensure the QRCode library is included.</p>";
    }
  }

  // Function to process payment
  async function processPayment() {
    // Get selected payment method
    const selectedMethod = document.querySelector(
      'input[name="payment-method"]:checked'
    );

    if (!selectedMethod) {
      alert("Please select a payment method.");
      return;
    }

    // Validate billing address
    const fullName = document.getElementById("full-name").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const postalCode = document.getElementById("postal-code").value;
    const phone = document.getElementById("phone").value;

    if (!fullName || !address || !city || !postalCode || !phone) {
      alert("Please fill in all billing address details.");
      return;
    }

    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem("user")) || {};

    // Calculate order summary
    let subtotal = 0;
    cart.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    const tax = subtotal * 0.1;
    const shipping = subtotal > 0 ? 5 : 0;
    const total = subtotal + tax + shipping;

    // Create order details object
    const orderDetails = {
      orderNumber: orderNumber,
      orderDate: new Date().toLocaleDateString(),
      paymentMethod:
        selectedMethod.id === "upi" ? "UPI Payment" : "Cash on Delivery",
      customerName: fullName,
      customerAddress: address,
      customerCity: city,
      customerZip: postalCode,
      customerPhone: phone,
      items: cart,
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      total: total,
      userId: user.uid || null,
      userEmail: user.email || null,
      userName: user.displayName || null,
      timestamp: new Date().toISOString(),
    };

    try {
      // Save order to Firestore
      await saveOrderToFirestore(orderDetails);

      // Save order details to localStorage for order confirmation page
      localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

      // Redirect to order confirmation page
      window.location.href = "order-confirmation.html";
    } catch (error) {
      console.error("Error saving order:", error);
      alert("There was an error processing your order. Please try again.");
    }
  }

  // Function to save order to Firestore
  async function saveOrderToFirestore(orderDetails) {
    try {
      const ordersRef = collection(db, "orders");
      const docRef = await addDoc(ordersRef, {
        ...orderDetails,
        createdAt: serverTimestamp(),
      });

      console.log("Order saved to Firestore with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error saving order data:", error);
      throw error;
    }
  }
});
