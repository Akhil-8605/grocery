document.addEventListener("DOMContentLoaded", function () {
  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Get DOM elements
  const checkoutItems = document.getElementById("checkout-items");
  const subtotalElement = document.getElementById("subtotal");
  const taxElement = document.getElementById("tax");
  const totalElement = document.getElementById("total");
  const updateCartBtn = document.getElementById("update-cart");
  const proceedToPaymentBtn = document.getElementById("proceed-to-payment");

  // Display cart items
  displayCartItems();

  // Add event listener to update cart button
  if (updateCartBtn) {
    updateCartBtn.addEventListener("click", function () {
      updateCartQuantities();
    });
  }

  // Function to display cart items
  function displayCartItems() {
    if (!checkoutItems) return;

    // Clear checkout items
    checkoutItems.innerHTML = "";

    if (cart.length === 0) {
      // Show empty cart message
      checkoutItems.innerHTML =
        '<p class="empty-cart-message">Your cart is empty.</p>';

      // Disable proceed to payment button
      if (proceedToPaymentBtn) {
        proceedToPaymentBtn.classList.add("disabled");
        proceedToPaymentBtn.style.pointerEvents = "none";
        proceedToPaymentBtn.style.opacity = "0.5";
      }

      // Update summary
      updateOrderSummary(0);

      return;
    }

    // Enable proceed to payment button
    if (proceedToPaymentBtn) {
      proceedToPaymentBtn.classList.remove("disabled");
      proceedToPaymentBtn.style.pointerEvents = "auto";
      proceedToPaymentBtn.style.opacity = "1";
    }

    // Calculate subtotal
    let subtotal = 0;

    // Add each item to checkout display
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${
        item.name
      }" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">₹${item.price.toFixed(
                      2
                    )} each</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-btn" data-id="${
                          item.id
                        }">-</button>
                        <input type="number" value="${
                          item.quantity
                        }" min="1" data-id="${item.id}">
                        <button class="quantity-btn increase-btn" data-id="${
                          item.id
                        }">+</button>
                    </div>
                </div>
                <p class="cart-item-total">₹${itemTotal.toFixed(2)}</p>
                <button class="cart-item-remove" data-id="${item.id}">
                    <i class="fa fa-trash"></i>
                </button>
            `;

      checkoutItems.appendChild(cartItemElement);
    });

    // Update order summary
    updateOrderSummary(subtotal);

    // Add event listeners to quantity buttons
    const decreaseButtons = document.querySelectorAll(".decrease-btn");
    const increaseButtons = document.querySelectorAll(".increase-btn");
    const removeButtons = document.querySelectorAll(".cart-item-remove");

    decreaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const input = this.nextElementSibling;
        let quantity = parseInt(input.value);

        if (quantity > 1) {
          input.value = quantity - 1;
        }
      });
    });

    increaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const input = this.previousElementSibling;
        let quantity = parseInt(input.value);

        input.value = quantity + 1;
      });
    });

    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        removeCartItem(id);
      });
    });
  }

  // Function to update order summary
  function updateOrderSummary(subtotal) {
    if (!subtotalElement || !taxElement || !totalElement) return;

    // Calculate tax (10%)
    const tax = subtotal * 0.1;

    // Calculate total
    const shipping = subtotal > 0 ? 5 : 0;
    const total = subtotal + tax + shipping;

    // Update summary elements
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    taxElement.textContent = `₹${tax.toFixed(2)}`;
    document.getElementById("shipping").textContent = `₹${shipping.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
  }

  // Function to update cart quantities
  function updateCartQuantities() {
    const quantityInputs = document.querySelectorAll(
      ".cart-item-quantity input"
    );

    quantityInputs.forEach((input) => {
      const id = input.getAttribute("data-id");
      const quantity = parseInt(input.value);

      // Find item in cart
      const itemIndex = cart.findIndex((item) => item.id === id);

      if (itemIndex !== -1) {
        // Update quantity
        cart[itemIndex].quantity = quantity;
      }
    });

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Refresh display
    displayCartItems();

    // Show confirmation message
    alert("Cart updated successfully!");
  }

  // Function to remove item from cart
  function removeCartItem(id) {
    // Remove item from cart array
    cart = cart.filter((item) => item.id !== id);

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Refresh display
    displayCartItems();
  }
});
