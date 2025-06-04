const prices = {
    silver: 150000,
    gold: 200000,
    vip: 300000,
    vvip: 400000
};

const quantities = {
    silver: 0,
    gold: 0,
    vip: 0,
    vvip: 0
};

// Update the quantity of tickets and reflect changes in the UI and total price
function updateQuantity(type, change) {
    const newQuantity = quantities[type] + change;
    if (newQuantity >= 0) {
        quantities[type] = newQuantity;
        const quantityElement = document.getElementById(`${type}-quantity`);
        if (quantityElement) {
            quantityElement.textContent = newQuantity;
        }
        updateTotal();
    }
}

// Calculate and update the total price
function updateTotal() {
    let total = 0;
    for (const type in quantities) {
        total += quantities[type] * prices[type];
    }
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `Rp${total.toLocaleString()}`;
    }
}

// Add event listeners to buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const ticketType = this.getAttribute('data-name');
        const ticketPrice = parseInt(this.getAttribute('data-price'));
        const ticketQuantity = 1; // Default quantity for add to cart
        addToCart(ticketType, ticketQuantity, ticketPrice);
    });
});

function initializeEventListeners() {
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function () {
            const type = this.getAttribute('data-type');
            const change = parseInt(this.getAttribute('data-change'));
            if (type && !isNaN(change)) {
                updateQuantity(type, change);
            }
        });
    });
}

// Handle the checkout process
function checkout() {
    let total = 0;
    let message = 'Selected tickets:\n';
    let hasTickets = false;

    for (const type in quantities) {
        if (quantities[type] > 0) {
            hasTickets = true;
            message += `${type.toUpperCase()}: ${quantities[type]} tickets\n`;
            total += quantities[type] * prices[type];
        }
    }

    if (hasTickets) {
        message += `\nTotal: Rp${total.toLocaleString()}`;
        alert(message + '\n\nProceeding to payment...');
        // Add logic to redirect to the payment page here
    } else {
        alert('Please select at least one ticket.');
    }
}

// Add click animations to buttons
function addButtonClickAnimation() {
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('mousedown', function () {
            this.style.transform = 'scale(0.95)';
        });

        button.addEventListener('mouseup', function () {
            this.style.transform = 'scale(1)';
        });

        button.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

// Initialize button animations and event listeners
addButtonClickAnimation();
initializeEventListeners();

// Optional: Hide payment modal
function openPaymentModal() {
    document.getElementById('payment-modal').style.display = 'flex';
}

function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

function bayar(method) {
    const total = calculateTotal();
    if (total === 0) {
        alert('Silakan pilih tiket terlebih dahulu');
        return;
    }
    
    alert(`Pembayaran dengan ${method.toUpperCase()}\nTotal: Rp${total.toLocaleString()}\n\nPembayaran berhasil!`);
    closePaymentModal();
    resetQuantities();
}

function calculateTotal() {
    let total = 0;
    for (const type in quantities) {
        total += quantities[type] * prices[type];
    }
    return total;
}

function resetQuantities() {
    for (const type in quantities) {
        quantities[type] = 0;
        const quantityElement = document.getElementById(`${type}-quantity`);
        if (quantityElement) {
            quantityElement.textContent = '0';
        }
    }
    updateTotal();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    addButtonClickAnimation();
});
