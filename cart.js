// Cart stored in localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('rootCart') || '[]');
}
function saveCart(cart) {
    localStorage.setItem('rootCart', JSON.stringify(cart));
    updateCartBadge();
}
function addToCart(name, price) {
    var cart = getCart();
    var existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name: name, price: price, qty: 1 });
    }
    saveCart(cart);
    showCartNotification(name);
}
function removeFromCart(name) {
    var cart = getCart().filter(item => item.name !== name);
    saveCart(cart);
    renderCart();
}
function updateCartBadge() {
    var badge = document.getElementById('cartBadge');
    if (!badge) return;
    var cart = getCart();
    var total = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'inline-flex' : 'none';
}
function showCartNotification(name) {
    var n = document.createElement('div');
    n.className = 'cart-notification';
    n.textContent = '✓ ' + name + ' added to cart';
    document.body.appendChild(n);
    setTimeout(() => n.classList.add('show'), 10);
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 2000);
}
function renderCart() {
    var container = document.getElementById('cartItems');
    var totalEl = document.getElementById('cartTotal');
    if (!container) return;
    var cart = getCart();
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalEl.textContent = '';
        return;
    }
    var html = '';
    var total = 0;
    cart.forEach(item => {
        total += item.price * item.qty;
        html += '<div class="cart-item"><span>' + item.name + ' × ' + item.qty + '</span><span>' + (item.price * item.qty) + ' kr <button class="remove-btn" onclick="removeFromCart(\'' + item.name.replace(/'/g, "\\'") + '\')">✕</button></span></div>';
    });
    container.innerHTML = html;
    totalEl.textContent = 'Total: ' + total + ' kr';
}
function openCart() {
    document.getElementById('cartModal').style.display = 'flex';
    renderCart();
}
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}
function checkout() {
    var cart = getCart();
    if (cart.length === 0) return;
    var orderSummary = cart.map(item => item.name + ' × ' + item.qty + ' = ' + (item.price * item.qty) + ' kr').join('\n');
    var total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    orderSummary += '\n\nTotal: ' + total + ' kr';
    document.getElementById('checkoutProducts').value = orderSummary;
    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('checkoutModal').style.display = 'flex';
}
function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}
// Clear cart after successful form submission
function clearCart() {
    localStorage.removeItem('rootCart');
    updateCartBadge();
}

// Slider
function slide(btn, dir) {
    var slides = btn.parentElement.querySelector('.slides');
    var width = slides.offsetWidth;
    slides.scrollBy({ left: width * dir, behavior: 'smooth' });
}

// Init badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);
