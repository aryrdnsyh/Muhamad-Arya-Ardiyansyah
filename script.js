document.addEventListener("DOMContentLoaded", () => {
    // Slider Functionality
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const dotsContainer = document.querySelector(".dots-container");
    let currentSlide = 0;

    const updateSlider = () => {
        slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${(index - currentSlide) * 100}%)`;
        });

        Array.from(dotsContainer.children).forEach((dot, index) => {
            dot.classList.toggle("active", index === currentSlide);
        });
    };

    let cartItems = [];
    let isCartOpen = false;

    function updateCartCount() {
        const count = document.getElementById('cart-count');
        count.textContent = cartItems.length;

        count.style.transform = 'scale(1.2)';
        setTimeout(() => {
            count.style.transform = 'scale(1)';
        }, 200);
    }

    function updateCartTotal() {
        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }

    function addToCart(productId, productName, productPrice) {
        cartItems.push({
            id: productId,
            name: productName,
            price: productPrice
        });

        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartCount();
        updateCartDisplay();
        updateCartTotal();

        const cartIcon = document.querySelector('.cart-icon i');
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }

    function updateCartDisplay() {
        const cartList = document.getElementById('cart-items');
        cartList.innerHTML = '';

        if (cartItems.length === 0) {
            cartList.innerHTML = '<li class="empty-cart">Your cart is empty</li>';
            return;
        }

        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartList.appendChild(li);
        });
    }

    function removeFromCart(itemId) {
        cartItems = cartItems.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartCount();
        updateCartDisplay();
        updateCartTotal();
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.concert-card');
            const productId = Date.now();
            const productName = card.querySelector('h3').textContent;
            const productPrice = 50; // Default price

            addToCart(productId, productName, productPrice);

            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 200);
        });
    });

    const cartIcon = document.getElementById('cartIcon');
    const cartDropdown = document.getElementById('cartDropdown');
    const checkoutBtn = document.getElementById('checkoutBtn');

    cartIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        isCartOpen = !isCartOpen;
        cartDropdown.classList.toggle('active', isCartOpen);
    });

    document.addEventListener('click', (e) => {
        if (isCartOpen && !cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
            isCartOpen = false;
            cartDropdown.classList.remove('active');
        }
    });

    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length > 0) {
            alert('Proceeding to checkout...');
        }
    });

    const createDots = () => {
        slides.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.classList.add("dot");
            dot.addEventListener("click", () => {
                currentSlide = index;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        });
    };

    prevBtn.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
    });

    nextBtn.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
    });

    createDots();
    updateSlider();

    const modal = document.getElementById("ticket-modal");
    const closeModal = document.getElementById("close-modal");
    closeModal.innerHTML = '<i class="fas fa-times"></i>'; // Change button text to icon

    document.querySelectorAll(".concert-card button").forEach(button => {
        button.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    const quantitySelect = document.getElementById("quantity");
    const ticketPrice = 50;
    const totalPriceElement = document.getElementById("total-price");

    quantitySelect.addEventListener("change", () => {
        const total = ticketPrice * parseInt(quantitySelect.value, 10);
        totalPriceElement.textContent = `Total: $${total}`;
    });

    const adjustSliderImages = () => {
        slides.forEach(slide => {
            const img = slide.querySelector("img");
            img.style.maxHeight = "400px";
            img.style.objectFit = "cover";
        });
    };

    adjustSliderImages();

    const loadCartFromStorage = () => {
        cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartDisplay();
        updateCartCount();
        updateCartTotal();
    };

    loadCartFromStorage();

    // Filter functionality
    const filterCategory = document.getElementById('filter-category');
    const filterLocation = document.getElementById('filter-location');

    function filterConcerts() {
        const category = filterCategory.value;
        const location = filterLocation.value;
        concertCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardLocation = card.getAttribute('data-location');
            if ((category === 'all' || cardCategory === category) &&
                (location === 'all' || cardLocation === location)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterCategory.addEventListener('change', filterConcerts);
    filterLocation.addEventListener('change', filterConcerts);
});