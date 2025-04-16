// Mobile Menu Toggle
const menuIcon = document.getElementById('menu-icon');
const navContainer = document.getElementById('nav-container');
const body = document.body;

menuIcon.addEventListener('click', () => {
    navContainer.classList.toggle('active');
    body.classList.toggle('no-scroll');
});


// Close menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navContainer.classList.remove('active');
        body.classList.remove('no-scroll');
    });
});
// =====================
// SHOPPING CART SYSTEM
// =====================
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');

let cart = JSON.parse(localStorage.getItem('cart')) || [];



// New arrivals
async function loadNewArrivals() {
    const newArrivalsContainer = document.getElementById('featured-products');
    
    try {
        // Use local products as fallback
        const newProducts = products.filter(p => p.new || (p.tags && p.tags.includes("new")));
        newArrivalsContainer.innerHTML = '';
        
        if (newProducts.length === 0) {
            newArrivalsContainer.innerHTML = '<p class="error">No new arrivals found</p>';
            return;
        }
        
        newProducts.forEach(product => {
            newArrivalsContainer.innerHTML += `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-price">₦${product.price.toLocaleString()}</p>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
        });
        
        // Add event listeners
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    } catch (error) {
        console.error("Error loading new arrivals:", error);
        newArrivalsContainer.innerHTML = '<p class="error">Error loading products</p>';
    }
}


// Sample product data
const products = [
    {
        id: 1,
        title: 'Elegant Evening Gown',
        price: 20000,
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
        category: 'dresses',
        new: true
    },
    {
        id: 101,
        title: "Pleated Midi Skirt",
        price: 22500,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format",
        category: "dresses",
        tags: ["new"],
        description: "High-waisted design with stretchy waistband",
        sizes: ["S", "M", "L"],
        colors: ["#000000", "#3d1d22", "#800020"],
        new: true
    },
    {
        id: 102,
        title: "Structured Handbag",
        price: 31800,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format",
        category: "accessories",
        tags: ["new"],
        description: "Genuine leather with gold-tone hardware",
        colors: ["#3d1d22", "#000000"],
        new: true
    },
    {
        id: 103,
        title: "Oversized Knit Cardigan",
        price: 27900,
        image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&auto=format",
        category: "tops",
        tags: ["new"],
        description: "100% cotton with dropped shoulders",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#f5f5dc", "#d3d3d3", "#8b4513"],
        new: true
    },
    {
        id: 104,
        title: "Embroidered Denim Jacket",
        price: 34500,
        image: "https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=600&auto=format",
        category: "tops",
        tags: ["new"],
        description: "Vintage wash with hand-stitched floral embroidery",
        sizes: ["S", "M", "L"],
        colors: ["light blue", "medium wash"],
        new: true
    },
    
    // ... (all other products from shop.js here)
];







// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the shop page
    if (document.getElementById('shop-products')) {
        displayShopProducts();
        setupShopFilters();
    }
    
    // Check if we're on the homepage
    if (document.getElementById('featured-products')) {
        displayFeaturedProducts();
    }
    
    updateCart();
});

// =====================
// CART FUNCTIONALITY
// =====================
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '₦0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
                <div class="cart-item-quantity">
                    <button class="decrement" data-id="${item.id}">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="increment" data-id="${item.id}">+</button>
                </div>
                <span class="remove-item" data-id="${item.id}">Remove</span>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotal.textContent = `₦${total.toLocaleString()}`;
    
    document.querySelectorAll('.increment').forEach(btn => {
        btn.addEventListener('click', incrementQuantity);
    });
    
    document.querySelectorAll('.decrement').forEach(btn => {
        btn.addEventListener('click', decrementQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
}

function incrementQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}

function decrementQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function showCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

cartIcon.addEventListener('click', showCart);
closeCart.addEventListener('click', hideCart);
cartOverlay.addEventListener('click', hideCart);

// =====================
// SHOP PAGE FUNCTIONALITY
// =====================
// Shop Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run on shop page
    if (!document.querySelector('.shop-page')) return;

    const filterToggle = document.getElementById('filter-toggle');
    const filtersSidebar = document.getElementById('filters-sidebar');
    const body = document.body;

    // Toggle filters sidebar on mobile
    filterToggle.addEventListener('click', function() {
        filtersSidebar.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });

    // Close filters when clicking outside
    document.addEventListener('click', function(e) {
        if (!filtersSidebar.contains(e.target) && e.target !== filterToggle) {
            filtersSidebar.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    // Load products
    displayProducts();

    // Sort functionality
    document.getElementById('sort').addEventListener('change', function() {
        sortProducts(this.value);
    });

    // Price filter
    document.getElementById('price-slider').addEventListener('input', function() {
        filterByPrice(this.value);
    });

    // Category filter
    document.querySelectorAll('.filter-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.filter-list a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            filterByCategory(this.textContent);
        });
    });

    // Size filter
    document.querySelectorAll('.size-options button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-options button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterBySize(this.textContent);
        });
    });

    // Color filter
    document.querySelectorAll('.color-options button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-options button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            //   color filtering here
        });
    });

    // Apply filters button
    document.querySelector('.apply-filters').addEventListener('click', function() {
        // apply all active filters
        filtersSidebar.classList.remove('active');
        body.classList.remove('no-scroll');
    });

    // Reset filters button
    document.querySelector('.reset-filters').addEventListener('click', function() {
        resetAllFilters();
    });
});

function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = '';

    // Sample products , fetch these from an API
    const products = [
             // Dresses
            {
                id: 101,
                title: "Silk Slip Evening Gown",
                price: 45000,
                image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
                category: "dresses",
                tags: ["new", "bestseller"],
                description: "Luxury silk slip dress with delicate lace trim",
                sizes: ["S", "M", "L"],
                colors: ["#3d1d22", "#000000"],
                material: "100% Silk"
            },
            {
                id: 102,
                title: "Floral Maxi Dress",
                price: 38000,
                image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b",
                category: "dresses",
                tags: ["new"],
                description: "Flowy floral print dress with adjustable waist tie",
                sizes: ["XS", "S", "M", "L"],
                colors: ["#800020", "#f2d9dd"],
                material: "Polyester blend"
            },
        
            // Tops
            {
                id: 201,
                title: "Cashmere Turtleneck",
                price: 32000,
                image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
                category: "tops",
                tags: ["bestseller"],
                description: "Ultra-soft cashmere turtleneck in classic colors",
                sizes: ["XS", "S", "M", "L", "XL"],
                colors: ["#3d1d22", "#f5f5dc", "#d3d3d3"],
                material: "100% Cashmere"
            },
            {
                id: 202,
                title: "Silk Blouse with Bow",
                price: 28000,
                image: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8",
                category: "tops",
                tags: ["new"],
                description: "Elegant silk blouse with front bow detail",
                sizes: ["S", "M", "L"],
                colors: ["#ffffff", "#f2d9dd"],
                material: "100% Silk"
            },
        
            // Bottoms
            {
                id: 301,
                title: "Tailored Wool Trousers",
                price: 35000,
                image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
                category: "bottoms",
                tags: ["bestseller"],
                description: "High-waisted wool trousers with perfect drape",
                sizes: ["XS", "S", "M", "L"],
                colors: ["#000000", "#3d1d22"],
                material: "Wool blend"
            },
            {
                id: 302,
                title: "Leather Mini Skirt",
                price: 42000,
                image: "https://images.unsplash.com/photo-1604644401890-0bd678c83788",
                category: "bottoms",
                tags: ["new"],
                description: "Buttery soft genuine leather A-line skirt",
                sizes: ["S", "M"],
                colors: ["#3d1d22", "#000000"],
                material: "Genuine leather"
            },
        
            // Outerwear
            {
                id: 401,
                title: "Wool Blend Coat",
                price: 65000,
                image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
                category: "outerwear",
                tags: ["new", "bestseller"],
                description: "Double-breasted wool coat with notched lapels",
                sizes: ["S", "M", "L"],
                colors: ["#3d1d22", "#000000"],
                material: "Wool blend"
            },
            {
                id: 402,
                title: "Faux Fur Jacket",
                price: 58000,
                image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
                category: "outerwear",
                tags: ["new"],
                description: "Luxurious faux fur jacket with satin lining",
                sizes: ["XS", "S", "M", "L"],
                colors: ["#f5f5dc", "#d3d3d3"],
                material: "Faux fur"
            },
        
            // Accessories
            {
                id: 501,
                title: "Structured Leather Handbag",
                price: 55000,
                image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
                category: "accessories",
                tags: ["bestseller"],
                description: "Premium leather handbag with gold-tone hardware",
                colors: ["#3d1d22", "#000000"],
                material: "Genuine leather"
            },
            {
                id: 502,
                title: "Silk Scarf Set",
                price: 18000,
                image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
                category: "accessories",
                tags: ["new"],
                description: "Set of 3 luxury silk scarves in seasonal prints",
                colors: ["multi"],
                material: "100% Silk"
            },
        
            // Shoes
            {
                id: 601,
                title: "Leather Ankle Boots",
                price: 48000,
                image: "https://images.unsplash.com/photo-1543163521-1bf539c55df2",
                category: "shoes",
                tags: ["bestseller"],
                description: "Italian leather ankle boots with block heel",
                sizes: ["36", "37", "38", "39", "40"],
                colors: ["#000000", "#3d1d22"],
                material: "Genuine leather"
            },
            {
                id: 602,
                title: "Strappy Heeled Sandals",
                price: 42000,
                image: "https://images.unsplash.com/photo-1543163521-1bf539c55df2",
                category: "shoes",
                tags: ["new"],
                description: "Elegant strappy sandals with comfortable heel",
                sizes: ["36", "37", "38", "39"],
                colors: ["#f2d9dd", "#cf74ba"],
                material: "Suede"
            },
        
            // Sale Items
            {
                id: 701,
                title: "Cashmere Sweater (Sale)",
                price: 25000,
                originalPrice: 35000,
                image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
                category: "tops",
                tags: ["sale"],
                description: "Luxury cashmere sweater in seasonal color",
                sizes: ["S", "M", "L"],
                colors: ["#cf74ba", "#f2d9dd"],
                material: "100% Cashmere"
            },
            {
                id: 702,
                title: "Wide-Leg Trousers (Sale)",
                price: 22000,
                originalPrice: 32000,
                image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
                category: "bottoms",
                tags: ["sale"],
                description: "Tailored wide-leg trousers with satin stripe",
                sizes: ["S", "M"],
                colors: ["#3d1d22"],
                material: "Wool blend"
            },
         //more product data here
    ];

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        let badge = '';
        if (product.new) {
            badge = '<span class="product-badge new">New</span>';
        } else if (product.bestseller) {
            badge = '<span class="product-badge bestseller">Bestseller</span>';
        } else if (product.sale) {
            badge = '<span class="product-badge sale">Sale</span>';
        }
        
        let priceHtml = `<p class="product-price">₦${product.price.toLocaleString()}</p>`;
if (product.sale && product.originalPrice) {
    priceHtml = `
        <p class="product-price">
            <span class="sale-price">₦${product.price.toLocaleString()}</span>
            <span class="original-price">₦${product.originalPrice.toLocaleString()}</span>
        </p>
    `;
}
        
        productCard.innerHTML = `
            <div class="product-image">
                ${badge}
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                ${priceHtml}
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function sortProducts(sortBy) {
    // Implementation would sort the products
}

function filterByPrice(maxPrice) {
    // Implementation would filter products by price
}

function filterByCategory(category) {
    // Implementation would filter products by category
}

function filterBySize(size) {
    // Implementation would filter products by size
}

function resetAllFilters() {
    // Reset all filter selections
    document.querySelectorAll('.filter-list a').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.size-options button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.color-options button').forEach(b => b.classList.remove('active'));
    document.getElementById('price-slider').value = 500;
    
    // Reset product display
    displayProducts();
}

// =====================
// HOMEPAGE FUNCTIONALITY
// =====================
function displayFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    
    // Display first 4 products as featured
    products.slice(0, 5).forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">₦${product.price.toLocaleString()}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        featuredContainer.appendChild(productCard);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// =====================
// AUTH MODAL FUNCTIONALITY
// =====================
const authLink = document.getElementById('auth-link');
const authModal = document.getElementById('auth-modal');
const closeAuth = document.querySelector('.close-auth');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

authLink.addEventListener('click', (e) => {
    e.preventDefault();
    authModal.classList.add('active');
});

closeAuth.addEventListener('click', () => {
    authModal.classList.remove('active');
});

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.classList.remove('active');
    }
});

// =====================
// NEWSLETTER FORM
// =====================
document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${e.target.querySelector('input').value}!`);
    e.target.reset();
});

// =====================
// SCROLL TO TOP BUTTON
// =====================
const scrollToTopBtn = document.getElementById('scroll-to-top');

window.addEventListener('scroll', () => {
    scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});




// Product rendering function
function renderProduct(product) {
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-badge-container">
          ${product.tags?.includes('new') ? '<span class="product-badge new">New</span>' : ''}
          ${product.tags?.includes('bestseller') ? '<span class="product-badge bestseller">Bestseller</span>' : ''}
        </div>
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <div class="product-info">
          <h3>${product.title}</h3>
          <p class="price">₦${product.price.toLocaleString('en-NG')}</p>
          <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          <a href="/products/detail.html?id=${product.id}" class="view-details">View Details</a>
        </div>
      </div>
    `;
  }
  
  // Category filtering
  async function loadCategory(category) {
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '<div class="loading-spinner"></div>';
    
    const q = query(collection(db, "products"), 
      where("category", "==", category));
    const querySnapshot = await getDocs(q);
    
    productsContainer.innerHTML = '';
    querySnapshot.forEach((doc) => {
      productsContainer.innerHTML += renderProduct(doc.data());
    });
  }
  
  