document.addEventListener("DOMContentLoaded", function () {
  // Get order details from localStorage
  const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));

  if (!orderDetails) {
    // Redirect to home if no order details
    window.location.href = "index.html";
    return;
  }

  // Populate order information
  document.getElementById(
    "order-date"
  ).textContent = `Date: ${orderDetails.orderDate}`;
  document.getElementById(
    "order-id"
  ).textContent = `Order ID: ${orderDetails.orderNumber}`;

  // Populate customer information
  document.getElementById("customer-name").textContent =
    orderDetails.customerName;
  document.getElementById("customer-address").textContent =
    orderDetails.customerAddress;
  document.getElementById(
    "customer-city-zip"
  ).textContent = `${orderDetails.customerCity}, ${orderDetails.customerZip}`;
  document.getElementById("customer-phone").textContent =
    orderDetails.customerPhone;

  // Populate payment method
  document.getElementById("payment-method").textContent =
    orderDetails.paymentMethod;

  // Populate order items
  const orderItemsList = document.getElementById("order-items-list");

  orderDetails.items.forEach((item) => {
    const itemTotal = item.price * item.quantity;

    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price.toFixed(2)}</td>
          <td>₹${itemTotal.toFixed(2)}</td>
      `;

    orderItemsList.appendChild(row);
  });

  // Populate order summary
  document.getElementById(
    "confirmation-subtotal"
  ).textContent = `₹${orderDetails.subtotal.toFixed(2)}`;
  document.getElementById(
    "confirmation-shipping"
  ).textContent = `₹${orderDetails.shipping.toFixed(2)}`;
  document.getElementById(
    "confirmation-tax"
  ).textContent = `₹${orderDetails.tax.toFixed(2)}`;
  document.getElementById(
    "confirmation-total"
  ).textContent = `₹${orderDetails.total.toFixed(2)}`;

  // Add event listener to download button
  document
    .getElementById("download-receipt")
    .addEventListener("click", function () {
      // Use html2canvas to take a screenshot of the receipt
      if (typeof html2canvas === "function") {
        html2canvas(document.getElementById("order-receipt")).then((canvas) => {
          // Create an image from the canvas
          const image = canvas.toDataURL("image/png");

          // Create a download link
          const link = document.createElement("a");
          link.href = image;
          link.download = `Receipt-${orderDetails.orderNumber}.png`;

          // Trigger download
          link.click();
        });
      } else {
        alert(
          "Receipt download functionality requires the html2canvas library."
        );
      }
    });

  // Clear cart after successful order
  localStorage.setItem("cart", JSON.stringify([]));
});