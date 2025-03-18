// Product database
const products = [
  // Vegetables
  {
    id: "tomato",
    name: "Tomato",
    price: 24.0,
    category: "vegetables",
    image: "image/Tomato.jpg",
  },
  {
    id: "peas",
    name: "Peas",
    price: 53.0,
    category: "vegetables",
    image: "image/peas.jpg",
  },
  {
    id: "brinjal",
    name: "Brinjal",
    price: 34.0,
    category: "vegetables",
    image: "image/bringer.jpg",
  },
  {
    id: "capsicum",
    name: "Capsicum",
    price: 40.0,
    category: "vegetables",
    image: "image/capiscum.jpg",
  },
  {
    id: "potato",
    name: "Potato",
    price: 31.0,
    category: "vegetables",
    image: "image/potato.jpg",
  },
  {
    id: "ladyfinger",
    name: "Lady Finger",
    price: 49.0,
    category: "vegetables",
    image: "image/lady finger.jpg",
  },
  {
    id: "cauliflower",
    name: "Cauliflower",
    price: 23.0,
    category: "vegetables",
    image: "image/cauliflower.jpg",
  },
  {
    id: "cabbage",
    name: "Cabbage",
    price: 20.0,
    category: "vegetables",
    image: "image/cabbage.jpg",
  },

  // Fruits
  {
    id: "apple",
    name: "Apple",
    price: 130.0,
    category: "fruits",
    image: "image/apple.jpg",
  },
  {
    id: "orange",
    name: "Orange",
    price: 75.0,
    category: "fruits",
    image: "image/orange.jpg",
  },
  {
    id: "grapes",
    name: "Grapes",
    price: 60.0,
    category: "fruits",
    image: "image/grapes.jpg",
  },
  {
    id: "watermelon",
    name: "Watermelon",
    price: 30.0,
    category: "fruits",
    image: "image/watermelon.jpg",
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    price: 129.0,
    category: "fruits",
    image: "image/pomegranate.jpg",
  },
  {
    id: "papaya",
    name: "Papaya",
    price: 96.0,
    category: "fruits",
    image: "image/papaya.jpg",
  },
  {
    id: "mango",
    name: "Mango",
    price: 150.0,
    category: "fruits",
    image: "image/mango.jpg",
  },
  {
    id: "strawberry",
    name: "Strawberry",
    price: 200.0,
    category: "fruits",
    image: "image/strawberry.jpg",
  },

  // Dairy
  {
    id: "milk",
    name: "Milk",
    price: 60.0,
    category: "dairy",
    image: "image/Amul.jpg",
  },
  {
    id: "cheese",
    name: "Cheese",
    price: 120.0,
    category: "dairy",
    image: "image/cheese-1.jpg",
  },
  {
    id: "butter",
    name: "Butter",
    price: 50.0,
    category: "dairy",
    image: "image/butter.jpg",
  },
  {
    id: "ghee",
    name: "Ghee",
    price: 500.0,
    category: "dairy",
    image: "image/ghee.jpg",
  },
  {
    id: "paneer",
    name: "Paneer",
    price: 80.0,
    category: "dairy",
    image: "image/paneer.jpg",
  },
  {
    id: "curd",
    name: "Curd",
    price: 40.0,
    category: "dairy",
    image: "image/curd-10.jpg",
  },
  {
    id: "bread",
    name: "Bread",
    price: 30.0,
    category: "dairy",
    image: "image/fresh bread.jpg",
  },
  {
    id: "icecream",
    name: "Ice Cream",
    price: 150.0,
    category: "dairy",
    image: "image/ice cream.jpg",
  },

  // Grocery
  {
    id: "sugar",
    name: "Sugar",
    price: 45.0,
    category: "grocery",
    image: "image/sugar-bag.jpg",
  },
  {
    id: "rice",
    name: "Basmati Rice",
    price: 80.0,
    category: "grocery",
    image: "image/basmatti.jpg",
  },
  {
    id: "oil",
    name: "Sunflower Oil",
    price: 170.0,
    category: "grocery",
    image: "image/sunflower.jpg",
  },
  {
    id: "salt",
    name: "Salt",
    price: 26.0,
    category: "grocery",
    image: "image/Salt-Lite.jpg",
  },
  {
    id: "masala",
    name: "Meat Masala",
    price: 35.0,
    category: "grocery",
    image: "image/meat.jpeg",
  },
  {
    id: "pickle",
    name: "Pickle",
    price: 80.0,
    category: "grocery",
    image: "image/Pickle.jpg",
  },
  {
    id: "maggi",
    name: "Maggi",
    price: 14.0,
    category: "grocery",
    image: "image/maggi.jpg",
  },
  {
    id: "jam",
    name: "Kisan Jam",
    price: 99.0,
    category: "grocery",
    image: "image/jam.jpg",
  },
];

document.addEventListener("DOMContentLoaded", function () {
  // Get search query from URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query");

  // Get DOM elements
  const mainSearchBox = document.getElementById("main-search-box");
  const searchResults = document.getElementById("search-results");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Display all products initially
  displayProducts(products);

  // Set search box value to query and filter if provided
  if (query) {
    mainSearchBox.value = query;
    performSearch(query);
  }

  // Add event listener to search form
  document
    .querySelector(".main-search-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const searchQuery = mainSearchBox.value.trim();
      if (searchQuery) {
        performSearch(searchQuery);
        // Update URL with search query
        const url = new URL(window.location);
        url.searchParams.set("query", searchQuery);
        window.history.pushState({}, "", url);
      } else {
        // If search is empty, show all products
        displayProducts(products);
      }
    });

  // Add event listeners to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      this.classList.add("active");

      const category = this.getAttribute("data-category");
      filterResults(category);
    });
  });

  // Function to perform search
  function performSearch(query) {
    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );

    // Display results
    if (filteredProducts.length > 0) {
      displayProducts(filteredProducts);
    } else {
      searchResults.innerHTML = `<p class="no-results">No products found matching "${query}".</p>`;
    }
  }

  // Function to filter results by category
  function filterResults(category) {
    const query = mainSearchBox.value.trim();

    // Filter products based on search query
    let filteredProducts = products;

    if (query) {
      filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Further filter by category if not "all"
    if (category !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
    }

    // Clear previous results
    searchResults.innerHTML = "";

    // Display results
    if (filteredProducts.length > 0) {
      displayProducts(filteredProducts);
    } else {
      searchResults.innerHTML = `<p class="no-results">No products found.</p>`;
    }
  }

  // Function to display products
  function displayProducts(products) {
    // Clear previous results
    searchResults.innerHTML = "";

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "card";
      productCard.setAttribute("data-name", product.id);

      productCard.innerHTML = `
                <div class="image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="title">
                    <h1>${product.name}</h1>
                    <div class="price">₹${product.price.toFixed(2)}/${
        product.category === "fruits" || product.category === "vegetables"
          ? "1kg"
          : "item"
      }</div>
                    <div class="qyt"></div><br>
                    <div class="des">
                        <label for="quantity_${product.id}">
                            Quantity:
                        </label>
                        <input type="number" id="quantity_${
                          product.id
                        }" value="1" min="1">
                    </div>
                    <button class="add-to-cart-btn" data-id="${
                      product.id
                    }" data-name="${product.name}" data-price="${
        product.price
      }" data-image="${product.image}">Add To Cart</button>
                </div>
            `;

      searchResults.appendChild(productCard);
    });

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
      });
    });
  }
});
