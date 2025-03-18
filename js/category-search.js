document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("category-search-input");
  const searchBtn = document.getElementById("category-search-btn");
  const productsContainer = document.getElementById("products-container");
  const productCards = document.querySelectorAll(".card");

  // Add event listener to search button
  searchBtn.addEventListener("click", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterProducts(searchTerm);
  });

  // Add event listener to search input for "Enter" key
  searchInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      const searchTerm = searchInput.value.trim().toLowerCase();
      filterProducts(searchTerm);
    }
  });

  // Function to filter products
  function filterProducts(searchTerm) {
    let hasResults = false;

    productCards.forEach((card) => {
      const productName = card.getAttribute("data-name").toLowerCase();
      const productTitle = card.querySelector("h1").textContent.toLowerCase();

      if (
        productName.includes(searchTerm) ||
        productTitle.includes(searchTerm) ||
        searchTerm === ""
      ) {
        card.style.display = "inline-block";
        hasResults = true;
      } else {
        card.style.display = "none";
      }
    });

    // Show message if no results
    let noResultsMessage = document.querySelector(".no-results-message");

    if (!hasResults) {
      if (!noResultsMessage) {
        noResultsMessage = document.createElement("p");
        noResultsMessage.className = "no-results-message";
        noResultsMessage.style.textAlign = "center";
        noResultsMessage.style.fontSize = "1.8rem";
        noResultsMessage.style.color = "var(--light-color)";
        noResultsMessage.style.padding = "3rem 0";
        productsContainer.appendChild(noResultsMessage);
      }
      noResultsMessage.textContent = `No products found matching "${searchTerm}".`;
    } else if (noResultsMessage) {
      noResultsMessage.remove();
    }
  }

  // Add event listeners to "Add to Cart" buttons
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

      // Get cart from localStorage
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

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

      // Show confirmation message
      alert(`${name} added to cart!`);

      // Update cart display if it exists
      let updateCart; // Declare updateCart
      if (typeof updateCart === "function") {
        updateCart();
      }
    });
  });
});
