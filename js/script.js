// Header functionality
let navbar = document.querySelector(".navbar");

document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.toggle("active");
};

window.onscroll = () => {
  navbar.classList.remove("active");
};

// Initialize Swiper
document.addEventListener("DOMContentLoaded", function () {
  let productSwiper, reviewSwiper; // Declare Swiper variables

  if (document.querySelector(".product-slider")) {
    productSwiper = new Swiper(".product-slider", {
      loop: true,
      spaceBetween: 20,
      autoplay: {
        delay: 7500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1020: {
          slidesPerView: 3,
        },
      },
    });
  }

  if (document.querySelector(".review-slider")) {
    reviewSwiper = new Swiper(".review-slider", {
      loop: true,
      spaceBetween: 20,
      autoplay: {
        delay: 7500,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1020: {
          slidesPerView: 3,
        },
      },
    });
  }
});

// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCart();

// Add event listeners to all "Add to Cart" buttons
document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const price = parseFloat(this.getAttribute("data-price"));
      const image = this.getAttribute("data-image");
      const quantityInput = this.parentElement.querySelector(
        'input[type="number"]'
      );
      const quantity = parseInt(quantityInput.value);

      addToCart(id, name, price, image, quantity);

      // Show confirmation message
      alert(`${name} added to cart!`);
    });
  });
});

function addToCart(id, name, price, image, quantity) {
  // Check if item already exists in cart
  const existingItemIndex = cart.findIndex((item) => item.id === id);

  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item if it doesn't exist
    cart.push({
      id,
      name,
      price,
      image,
      quantity,
    });
  }

  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart display
  updateCart();
}

function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItemsContainer) return;

  // Clear current cart items
  cartItemsContainer.innerHTML = "";

  // Calculate total
  let total = 0;

  // Add each item to cart display
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItemElement = document.createElement("div");
    cartItemElement.className = "box";
    cartItemElement.innerHTML = `
            <i class="fa fa-trash" data-id="${item.id}"></i>
            <img src="${item.image}" alt="${item.name}">
            <div class="content">
                <h3>${item.name}</h3>
                <span class="price">₹${item.price.toFixed(2)}/-</span>
                <span class="quantity">Qty : ${item.quantity}</span>
            </div>
        `;

    cartItemsContainer.appendChild(cartItemElement);
  });

  // Update total
  if (cartTotal) {
    cartTotal.textContent = `total : ₹${total.toFixed(2)}/-`;
  }

  // Add event listeners to trash icons
  const trashIcons = document.querySelectorAll(".fa-trash");
  trashIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      removeFromCart(id);
    });
  });
}

function removeFromCart(id) {
  // Remove item from cart array
  cart = cart.filter((item) => item.id !== id);

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart display
  updateCart();
}
