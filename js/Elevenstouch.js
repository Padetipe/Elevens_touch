// =====================
// MOBILE MENU TOGGLE
// =====================
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
// WISHLIST FUNCTIONALITY
// =====================
const wishlistSidebar = document.getElementById('wishlist-sidebar');
const wishlistOverlay = document.getElementById('wishlist-overlay');
const closeWishlist = document.getElementById('close-wishlist');
const wishlistItemsContainer = document.getElementById('wishlist-items');

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function addToWishlist(e) {
    const productId = parseInt(e.target.closest('.wishlist-btn').getAttribute('data-id'));
    const product = products.find(p => p.id === productId);

    if (!wishlist.some(item => item.id === productId)) {
        wishlist.push(product);
        updateWishlist();
        alert(`${product.title} has been added to your wishlist!`);
    } else {
        alert(`${product.title} is already in your wishlist.`);
    }
}

function removeFromWishlist(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    wishlist = wishlist.filter(item => item.id !== productId);
    updateWishlist();
}

function updateWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    wishlistItemsContainer.innerHTML = '';

    // Update the wishlist count badge
    const wishlistCount = document.querySelector('.wishlist-count');
    wishlistCount.textContent = wishlist.length;

    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<p>Your wishlist is empty</p>';
        return;
    }

    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="wishlist-item-details">
                <h4 class="wishlist-item-title">${item.title}</h4>
                <p class="wishlist-item-price">₦${item.price.toLocaleString()}</p>
                <span class="remove-wishlist-item" data-id="${item.id}">Remove</span>
            </div>
        `;
        wishlistItemsContainer.appendChild(wishlistItem);
    });

    document.querySelectorAll('.remove-wishlist-item').forEach(btn => {
        btn.addEventListener('click', removeFromWishlist);
    });
}

function showWishlist() {
    wishlistSidebar.classList.add('active');
    wishlistOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideWishlist() {
    wishlistSidebar.classList.remove('active');
    wishlistOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', addToWishlist);
});

wishlistOverlay.addEventListener('click', hideWishlist);
closeWishlist.addEventListener('click', hideWishlist);

// =====================
// PRODUCT DATA
// =====================
const products = [
    {
        id: 1,
        title: 'Elegant Evening Gown',
        price: 20000,
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
        category: 'dresses',
        new: true,
        newArrival: true
    },
    {
        id: 2,
        title: "Pleated Midi Skirt",
        price: 22500,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format",
        category: "dresses",
        tags: ["new"],
        description: "High-waisted design with stretchy waistband",
        sizes: ["S", "M", "L"],
        colors: ["#000000", "#3d1d22", "#800020"],
        new: true,
        newArrival: true
    },
    {
        id: 3,
        title: "Structured Handbag",
        price: 31800,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&auto=format",
        category: "accessories",
        tags: ["new"],
        description: "Genuine leather with gold-tone hardware",
        colors: ["#3d1d22", "#000000"],
        new: true,
        newArrival: true
    },
    {
        id: 4,
        title: "Oversized Knit Cardigan",
        price: 27900,
        image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=600&auto=format",
        category: "tops",
        tags: ["new"],
        description: "100% cotton with dropped shoulders",
        sizes: ["S", "M", "L", "XL"],
        colors: ["#f5f5dc", "#d3d3d3", "#8b4513"],
        new: true,
        newArrival: true
    },
    {
        id: 5,
        title: "Embroidered Denim Jacket",
        price: 34500,
        image: "https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=600&auto=format",
        category: "tops",
        tags: ["new"],
        description: "Vintage wash with hand-stitched floral embroidery",
        sizes: ["S", "M", "L"],
        colors: ["light blue", "medium wash"],
        new: true,
        newArrival: true
    },
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
    }
];

// =====================
// PRODUCT RENDERING
// =====================
function renderProduct(product) {
    let badge = '';
    if (product.new) {
        badge = '<span class="product-badge new">New</span>';
    } else if (product.tags?.includes('bestseller')) {
        badge = '<span class="product-badge bestseller">Bestseller</span>';
    } else if (product.tags?.includes('sale')) {
        badge = '<span class="product-badge sale">Sale</span>';
    }

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                ${badge}
                <img src="${product.image}" alt="${product.title}" loading="lazy">               
            </div>
            <div class="product-info">
             <button class="wishlist-btn" data-id="${product.id}">
                    <i class="fa-regular fa-heart"></i>
                </button>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">₦${product.price.toLocaleString()}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
}

// =====================
// PRODUCT DISPLAY FUNCTIONS
// =====================
function loadNewArrivals() {
    const newArrivalsContainer = document.getElementById('featured-products');
    const newProducts = products.filter(p => p.newArrival); 

    if (!newArrivalsContainer) return;

    newArrivalsContainer.innerHTML = ''; 

    newProducts.forEach(product => {
        newArrivalsContainer.innerHTML += renderProduct(product);
    });

    addEventListenersToProducts(); 
}

function displayFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;
    
    featuredContainer.innerHTML = '';
    
    products.slice(0, 5).forEach(product => {
        featuredContainer.innerHTML += renderProduct(product);
    });
    
    addEventListenersToProducts();
}

function displayProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = ''; 

    products.forEach(product => {
        productGrid.innerHTML += renderProduct(product);
    });

    addEventListenersToProducts(); 
}

function addEventListenersToProducts() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', addToWishlist);
    });
}

// products.forEach(product => {
function addEventListenersToProducts() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', addToWishlist);
    });
}

// =====================
// FILTER FUNCTIONS
// =====================
function sortProducts(sortBy) {
    // Implementation would sort the products
    console.log(`Sorting by: ${sortBy}`);
}

function filterByPrice(maxPrice) {
    // Implementation would filter products by price
    console.log(`Filtering by max price: ${maxPrice}`);
}

function filterByCategory(category) {
    // Implementation would filter products by category
    console.log(`Filtering by category: ${category}`);
}

function filterBySize(size) {
    // Implementation would filter products by size
    console.log(`Filtering by size: ${size}`);
}

function resetAllFilters() {
    document.querySelectorAll('.filter-list a').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.size-options button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.color-options button').forEach(b => b.classList.remove('active'));
    document.getElementById('price-slider').value = 500;
    displayProducts();
}

// =====================
// SHOP PAGE FUNCTIONALITY
// =====================
function setupShopFilters() {
    const filterToggle = document.getElementById('filter-toggle');
    const filtersSidebar = document.getElementById('filters-sidebar');
    
    if (!filterToggle || !filtersSidebar) return;
    
    filterToggle.addEventListener('click', function() {
        filtersSidebar.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });
    
    document.addEventListener('click', function(e) {
        if (!filtersSidebar.contains(e.target) && e.target !== filterToggle) {
            filtersSidebar.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });
    
    document.getElementById('sort')?.addEventListener('change', function() {
        sortProducts(this.value);
    });
    
    document.getElementById('price-slider')?.addEventListener('input', function() {
        filterByPrice(this.value);
    });
    
    document.querySelectorAll('.filter-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.filter-list a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            filterByCategory(this.textContent);
        });
    });
    
    document.querySelectorAll('.size-options button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size-options button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterBySize(this.textContent);
        });
    });
    
    document.querySelectorAll('.color-options button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-options button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    document.querySelector('.apply-filters')?.addEventListener('click', function() {
        filtersSidebar.classList.remove('active');
        body.classList.remove('no-scroll');
    });
    
    document.querySelector('.reset-filters')?.addEventListener('click', resetAllFilters);
}

// =====================
// CAROUSEL FUNCTIONALITY
// =====================
function startCarousel() {
    const carousel = document.querySelector('.carousel');
    const productCards = document.querySelectorAll('.carousel .product-card');
    let scrollAmount = 0;

    if (!carousel || productCards.length === 0) return; 

    const productWidth = productCards[0].offsetWidth + 30; 

    setInterval(() => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;

        if (scrollAmount >= maxScroll) {
            scrollAmount = 0; 
        } else {
            scrollAmount += productWidth; 
        }

        carousel.style.transform = `translateX(-${scrollAmount}px)`;
    }, 3000); // Adjust the interval (3000ms = 3 seconds)
}

// =====================
// AUTH MODAL FUNCTIONALITY
// =====================
const authLink = document.getElementById('auth-link');
const authModal = document.getElementById('auth-modal');
const closeAuth = document.querySelector('.close-auth');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

if (authLink && authModal) {
    // Open the modal
    authLink.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.classList.add('active');
    });

    // Close the modal
    closeAuth.addEventListener('click', () => {
        authModal.classList.remove('active');
    });

    // Switch between tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Close modal when clicking outside the content
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('active');
        }
    });
}

// =====================
// USER AUTHENTICATION (LOGIN & REGISTRATION)
// =====================

// Simulated user database
const users = JSON.parse(localStorage.getItem('users')) || [];

// Handle registration
document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.querySelector('input[placeholder="Full Name"]').value;
    const email = e.target.querySelector('input[placeholder="Email"]').value;
    const password = e.target.querySelector('input[placeholder="Password"]').value;

    if (users.some(user => user.email === email)) {
        alert('User already exists. Please log in.');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please log in.');
    e.target.reset();
});

// Handle login
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[placeholder="Email"]').value;
    const password = e.target.querySelector('input[placeholder="Password"]').value;

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert(`Welcome back, ${user.name}!`);
        authModal.classList.remove('active');
    } else {
        alert('Invalid email or password. Please try again.');
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

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        scrollToTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =====================
// INITIALIZATION
// =====================

// Initialize wishlist on page load
document.addEventListener('DOMContentLoaded', () => {
    updateWishlist(); 
});

//for product grid
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-grid')) {
        displayProducts();
        setupShopFilters();
    }
});

//for new arrivals
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('featured-products')) {
        loadNewArrivals();
        startCarousel();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Homepage
    if (document.getElementById('featured-products')) {
        loadNewArrivals();
        startCarousel();
    }

    // Shop Page
    if (document.getElementById('product-grid')) {
        displayProducts();
        setupShopFilters();
    }

     
    updateCart();
    updateWishlist();
    startCarousel();
});