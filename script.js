const EXCHANGE_RATE = 82.5; // USD to INR conversion rate

// Combine all products into one searchData array
const searchData = [
    {
        id: 1,
        name: "Nike Air Max",
        price: 9999,
        image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto/eeafb93f-2ac4-4c97-aab8-48abf8e89daa/air-max-90-shoes-RD5C8J.png",
        category: "running"
    },
    {
        id: 2,
        name: "Nike Zoom",
        price: 11499,
        image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto/cd1fc4e4-5d02-4f65-86a8-4294def6c4a4/zoom-fly-5-road-running-shoes-lQ3Lp4.png",
        category: "running"
    },
    // ...add more products from your existing products
];

const newProducts = [
    {
        id: 6,
        name: "Nike Revolution 6",
        price: 11499, // Price in INR
        image: "https://images.unsplash.com/photo-1605408499391-6368c628ef42"
    },
    {
        id: 7,
        name: "Nike Air Max 90",
        price: 12499,
        image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782"
    },
    {
        id: 8,
        name: "Nike Free Run",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    }
];

function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`;
}

// Helper functions
const safeQuerySelector = (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
    return element;
};

const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    // You could also add UI error feedback here
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeCart();
        setupEventListeners();
        loadNewProducts();
        setupScrollAnimations();
        init3DEffect();
        addParallaxEffect();
        setupSearch();
        setupNavigation();
        setupProductSlider();
        setupFeaturedSlider();
        setupScrollSlider();
    } catch (error) {
        handleError(error, 'initialization');
    }
});

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.add('scroll-trigger');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.product-card, section').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(element);
    });
}

function initializeCart() {
    try {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartCount();
    } catch (error) {
        handleError(error, 'cart initialization');
        cart = [];
    }
}

function setupEventListeners() {
    // Search functionality with debounce
    const searchInput = safeQuerySelector('input[type="search"]');
    if (searchInput) {
        let debounceTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                filterProducts(e.target.value.toLowerCase());
            }, 300);
        });
    }

    // Cart and wishlist icons
    const cartIcon = safeQuerySelector('.fa-shopping-bag');
    const wishlistIcon = safeQuerySelector('.fa-heart');

    if (cartIcon) {
        cartIcon.addEventListener('click', showCart);
    }

    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', () => {
            showNotification('Wishlist feature coming soon!');
        });
    }

    // Category navigation with error handling
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            try {
                const category = e.currentTarget.querySelector('h3')?.textContent.toLowerCase();
                if (category) {
                    navigateToCategory(category);
                }
            } catch (error) {
                handleError(error, 'category navigation');
            }
        });
    });

    // Close cart modal on outside click
    document.addEventListener('click', (e) => {
        const cartModal = document.querySelector('.cart-modal');
        if (cartModal && !e.target.closest('.cart-content') && !e.target.closest('.fa-shopping-bag')) {
            cartModal.remove();
        }
    });
}

function addToCart(product) {
    try {
        if (!product.id || !product.name || !product.price) {
            throw new Error('Invalid product data');
        }

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Added to cart!');
    } catch (error) {
        handleError(error, 'add to cart');
        showNotification('Failed to add item to cart', 'error');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function checkout() {
    try {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        // Add your checkout logic here
        showNotification('Checkout functionality coming soon!');
    } catch (error) {
        handleError(error, 'checkout');
    }
}

// Add removeFromCart function
function removeFromCart(productId) {
    try {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showCart(); // Refresh cart display
    } catch (error) {
        handleError(error, 'remove from cart');
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartIcon = document.querySelector('.fa-shopping-bag');
    cartIcon.setAttribute('data-count', count);
}

function showCart() {
    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <h4>${item.name}</h4>
            <p>${formatPrice(item.price)} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    modal.innerHTML = `
        <div class="cart-content">
            <h3>Your Cart</h3>
            ${cartHTML}
            <div class="cart-total">Total: ${formatPrice(total)}</div>
            <button onclick="checkout()">Checkout</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function filterProducts(searchTerm) {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
}

function loadNewProducts() {
    const newProductsSection = document.querySelector('#new-featured .product-grid');
    if (!newProductsSection) {
        console.error('New products section not found');
        return;
    }

    newProductsSection.innerHTML = newProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${formatPrice(product.price)}</p>
            <button class="add-to-cart">Add to Cart</button>
        </div>
    `).join('');

    attachProductEventListeners();
}

function attachProductEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (!card) return;
            
            const product = {
                id: parseInt(card.dataset.id),
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('p').textContent.replace('₹', '').replace(',', '')),
                quantity: 1
            };
            addToCart(product);
        });
    });
}

function init3DEffect() {
    try {
        const cards = document.querySelectorAll('.product-card');
        
        cards.forEach(card => {
            let rafId;
            let isHovering = false;

            card.addEventListener('mouseenter', () => {
                isHovering = true;
                card.style.willChange = 'transform';
            });

            card.addEventListener('mousemove', (e) => {
                if (!isHovering) return;
                
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    
                    const rotateX = (y - 0.5) * 20;
                    const rotateY = (x - 0.5) * 20;
                    
                    card.style.transform = `
                        perspective(1000px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        translateZ(10px)
                        scale3d(1.05, 1.05, 1.05)
                    `;
                });
            });

            card.addEventListener('mouseleave', () => {
                isHovering = false;
                cancelAnimationFrame(rafId);
                card.style.willChange = 'auto';
                card.style.transform = 'none';
            });
        });
    } catch (error) {
        handleError(error, '3D effect initialization');
    }
}

function addParallaxEffect() {
    let rafId;
    const parallaxElements = document.querySelectorAll('.hero-content, .category-card');
    
    window.addEventListener('scroll', () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(element => {
                const speed = 0.3;
                const yOffset = scrolled * speed;
                element.style.transform = `translate3d(0, ${yOffset}px, 0)`;
            });
        });
    }, { passive: true });
}

// Add debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    let searchTimeout;

    if (!searchInput || !searchResults) return;

    const handleSearch = (query) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }

            const filtered = searchData.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category?.toLowerCase().includes(query.toLowerCase())
            );

            if (filtered.length) {
                searchResults.innerHTML = `
                    ${filtered.map(product => `
                        <div class="search-result-item" data-id="${product.id}">
                            <div class="search-result-img">
                                <img src="${product.image}" alt="${product.name}" loading="lazy">
                            </div>
                            <div class="search-result-info">
                                <h4>${highlightMatch(product.name, query)}</h4>
                                <p>${formatPrice(product.price)}</p>
                            </div>
                        </div>
                    `).join('')}
                `;
            } else {
                searchResults.innerHTML = `
                    <div class="no-results">
                        <p>No products found for "${query}"</p>
                    </div>
                `;
            }
            searchResults.classList.add('active');
            addSearchResultListeners();
        }, 300);
    };

    searchInput.addEventListener('input', (e) => handleSearch(e.target.value.trim()));
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length >= 2) {
            searchResults.classList.add('active');
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchResults.classList.remove('active');
        }
    });
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

function addSearchResultListeners() {
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const productId = parseInt(item.dataset.id);
            const product = searchData.find(p => p.id === productId);
            if (product) {
                addToCart(product);
                document.querySelector('.search-results').classList.remove('active');
                document.querySelector('.search-input').value = '';
            }
        });
    });
}

function attachSearchResultHandlers() {
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const productId = parseInt(item.dataset.id);
            const product = searchData.find(p => p.id === productId);
            if (product) {
                addToCart(product);
                document.querySelector('.search-results').classList.remove('active');
                document.querySelector('.search-input').value = '';
            }
        });
    });
}

function navigateToProduct(productId) {
    // Implement product navigation logic here
    console.log(`Navigating to product ${productId}`);
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const link = item.querySelector('a');
        const dropdown = item.querySelector('.dropdown-menu');
        
        item.addEventListener('mouseenter', () => {
            dropdown.style.display = 'block';
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
        });
        
        item.addEventListener('mouseleave', () => {
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateY(10px)';
            setTimeout(() => {
                if (!item.matches(':hover')) {
                    dropdown.style.display = 'none';
                }
            }, 300);
        });
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Add slider functionality
function setupProductSlider() {
    const productGrids = document.querySelectorAll('.product-grid');
    
    productGrids.forEach(grid => {
        const wrapper = document.createElement('div');
        wrapper.className = 'slider-wrapper';
        const slider = document.createElement('div');
        slider.className = 'product-slider';
        
        // Move products to slider
        while(grid.firstChild) {
            slider.appendChild(grid.firstChild);
        }
        
        // Add navigation buttons
        const prevBtn = document.createElement('button');
        const nextBtn = document.createElement('button');
        prevBtn.className = 'slider-nav prev';
        nextBtn.className = 'slider-nav next';
        prevBtn.innerHTML = '❮';
        nextBtn.innerHTML = '❯';
        
        wrapper.appendChild(prevBtn);
        wrapper.appendChild(slider);
        wrapper.appendChild(nextBtn);
        grid.appendChild(wrapper);
        
        let scrollAmount = 0;
        const slideWidth = 300; // Width of product card + gap
        
        prevBtn.addEventListener('click', () => {
            scrollAmount = Math.max(scrollAmount - slideWidth, 0);
            slider.style.transform = `translateX(-${scrollAmount}px)`;
        });
        
        nextBtn.addEventListener('click', () => {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            scrollAmount = Math.min(scrollAmount + slideWidth, maxScroll);
            slider.style.transform = `translateX(-${scrollAmount}px)`;
        });
    });
}

function setupFeaturedSlider() {
    const slider = document.querySelector('.featured-slider');
    const container = document.querySelector('.slide-container');
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // Add scroll-based animation
    const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startSliderAnimation();
            } else {
                stopSliderAnimation();
            }
        });
    }, { threshold: 0.5 });

    sliderObserver.observe(slider);

    let slideInterval;

    function startSliderAnimation() {
        slideInterval = setInterval(nextSlide, 5000);
        slides[currentSlide].classList.add('active');
    }

    function stopSliderAnimation() {
        clearInterval(slideInterval);
    }

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    }

    function updateSlider() {
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
        slides[currentSlide].classList.add('active');
    }

    // Handle slider navigation buttons
    document.querySelector('.slide-nav.prev').addEventListener('click', () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
        resetInterval();
    });

    document.querySelector('.slide-nav.next').addEventListener('click', () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
        resetInterval();
    });

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Handle slider hover pause
    slider.addEventListener('mouseenter', stopSliderAnimation);
    slider.addEventListener('mouseleave', startSliderAnimation);
}

function setupScrollSlider() {
    const slider = document.querySelector('.featured-slider');
    const container = document.querySelector('.slide-container');
    const slides = document.querySelectorAll('.slide');
    const productsSection = document.querySelector('.featured-products');
    
    let currentSlide = 0;
    let isScrolling = false;
    const slideHeight = window.innerHeight;
    const totalSlides = slides.length;

    const smoothScroll = {
        current: 0,
        target: 0,
        ease: 0.075
    };

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function updateScroll() {
        smoothScroll.current = lerp(
            smoothScroll.current,
            smoothScroll.target,
            smoothScroll.ease
        );

        const progress = Math.min(smoothScroll.current / (slideHeight * 2), 1);
        const slideIndex = Math.floor(progress * totalSlides);

        if (slideIndex !== currentSlide && !isScrolling) {
            currentSlide = slideIndex % totalSlides;
            updateSlider();
        }

        requestAnimationFrame(updateScroll);
    }

    window.addEventListener('scroll', () => {
        smoothScroll.target = window.pageYOffset;
    }, { passive: true });

    function updateSlider() {
        isScrolling = true;
        const translateX = (currentSlide * -100) + '%';
        
        container.style.transform = `translateX(${translateX})`;
        
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        setTimeout(() => {
            isScrolling = false;
        }, 1500);
    }

    // Initialize
    slides[0].classList.add('active');
    updateScroll();
}
