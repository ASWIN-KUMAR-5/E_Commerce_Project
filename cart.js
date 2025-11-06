// === StyleHub Cart System (LocalStorage JSON) ===

// Get cart items from localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// Save updated cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

// Render cart items in the cart page
function renderCart() {
  const container = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const discountEl = document.getElementById('discount');
  const totalEl = document.getElementById('total');

  let cart = getCart();
  container.innerHTML = '';

  // Empty cart display
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty!</p>
        <a href="index.html" class="btn">Shop Now</a>
      </div>`;
    subtotalEl.textContent = shippingEl.textContent = discountEl.textContent = totalEl.textContent = '$0.00';
    return;
  }

  // Populate cart items
  let subtotal = 0;
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>$${item.price.toFixed(2)}</p>
        </div>
        <div class="quantity">
          <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeItem('${item.id}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>`;
  });

  // Shipping and discount
  const shipping = subtotal > 1000 ? 0 : (cart.length > 0 ? 50 : 0);
  const discount = parseInt(localStorage.getItem('discount')) || 0;
  const total = subtotal + shipping - discount;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = `$${shipping.toFixed(2)}`;
  discountEl.textContent = `$${discount.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

// Update item quantity (+ / -)
function updateQuantity(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart(cart);
  renderCart();
}

// Remove item from cart
function removeItem(id) {
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

// Apply coupon discount
document.getElementById('apply-coupon').addEventListener('click', () => {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discount = 0;
  if (code === 'STYLE10') discount = Math.floor(subtotal * 0.10);
  else if (code === 'STYLE20' && subtotal >= 2000) discount = Math.floor(subtotal * 0.20);
  else return alert('❌ Invalid or ineligible coupon code.');

  localStorage.setItem('discount', discount);
  alert(`🎉 Coupon applied! You saved $${discount}.`);
  renderCart();
});

// Checkout button - place order and clear cart
document.getElementById('checkout-btn').addEventListener('click', () => {
  const cart = getCart();
  if (cart.length === 0) return alert('Your cart is empty.');

  localStorage.removeItem('cartItems');
  localStorage.removeItem('discount');
  alert('✅ Order placed successfully! Thank you for shopping with StyleHub 💖');
  renderCart();
});

// Render cart when page loads
document.addEventListener('DOMContentLoaded', renderCart);
