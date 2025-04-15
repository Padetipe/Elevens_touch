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
    // ... (keep all your other products from shop.js here)
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
            // You would implement color filtering here
        });
    });

    // Apply filters button
    document.querySelector('.apply-filters').addEventListener('click', function() {
        // In a real app, you would apply all active filters
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

    // Sample products - in a real app you would fetch these from an API
    const products = [
        // Your product data here
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
    products.slice(0, 4).forEach(product => {
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
