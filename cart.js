// === StyleHub Cart System (LocalStorage JSON) ===

// Utility Functions
function getCart() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function getSaved() {
  return JSON.parse(localStorage.getItem('savedItems')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

function saveSavedItems(saved) {
  localStorage.setItem('savedItems', JSON.stringify(saved));
}

// Render Cart Items
function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  const savedContainer = document.getElementById('saved-items');
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const discountEl = document.getElementById('discount');
  const totalEl = document.getElementById('total');

  const cart = getCart();
  const saved = getSaved();

  cartContainer.innerHTML = '';
  savedContainer.innerHTML = '';

  // --- CART SECTION ---
  if (cart.length === 0) {
    cartContainer.innerHTML = `<div class="empty-cart">
      <i class="fas fa-shopping-cart"></i>
      <p>Your cart is empty!</p>
    </div>`;
  } else {
    cart.forEach(item => {
      cartContainer.innerHTML += `
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
          <button class="save-btn" onclick="saveForLater('${item.id}')">
            <i class="fas fa-bookmark"></i> Save for Later
          </button>
          <button class="remove-btn" onclick="removeItem('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
    });
  }

  // --- SAVED SECTION ---
  if (saved.length === 0) {
    savedContainer.innerHTML = `<p class="empty-saved">No items saved for later.</p>`;
  } else {
    saved.forEach(item => {
      savedContainer.innerHTML += `
        <div class="cart-item saved-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="item-info">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
          </div>
          <button class="move-btn" onclick="moveToCart('${item.id}')">
            <i class="fas fa-cart-plus"></i> Move to Cart
          </button>
          <button class="remove-btn" onclick="removeSaved('${item.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
    });
  }

  // --- SUMMARY CALC ---
  let subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : cart.length > 0 ? 50 : 0;
  const discount = parseInt(localStorage.getItem('discount')) || 0;
  const total = subtotal + shipping - discount;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  shippingEl.textContent = `$${shipping.toFixed(2)}`;
  discountEl.textContent = `$${discount.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

// Quantity Update
function updateQuantity(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
    showToast('Item removed from cart ❌', 'error');
  }

  saveCart(cart);
  renderCart();
}

// Remove Item
function removeItem(id) {
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
  showToast('Item removed from cart ❌', 'error');
}

// Save for Later
function saveForLater(id) {
  let cart = getCart();
  let saved = getSaved();

  const item = cart.find(i => i.id === id);
  if (!item) return;

  saved.push(item);
  cart = cart.filter(i => i.id !== id);

  saveCart(cart);
  saveSavedItems(saved);
  renderCart();
  showToast('Item saved for later 📦', 'info');
}

// Move Back to Cart
function moveToCart(id) {
  let cart = getCart();
  let saved = getSaved();

  const item = saved.find(i => i.id === id);
  if (!item) return;

  cart.push(item);
  saved = saved.filter(i => i.id !== id);

  saveCart(cart);
  saveSavedItems(saved);
  renderCart();
  showToast('Item moved back to cart 🛒', 'success');
}

// Remove Saved Item
function removeSaved(id) {
  let saved = getSaved().filter(i => i.id !== id);
  saveSavedItems(saved);
  renderCart();
  showToast('Item removed from saved list 🗑️', 'error');
}

// Coupon Apply
document.getElementById('apply-coupon').addEventListener('click', () => {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let discount = 0;
  if (code === 'STYLE10') {
    discount = Math.floor(subtotal * 0.1);
    showToast('🎉 Coupon STYLE10 applied (10% off)', 'info');
  } else if (code === 'STYLE20' && subtotal >= 2000) {
    discount = Math.floor(subtotal * 0.2);
    showToast('💸 Coupon STYLE20 applied (20% off)', 'info');
  } else {
    showToast('❌ Invalid or ineligible coupon code.', 'error');
    return;
  }

  localStorage.setItem('discount', discount);
  renderCart();
});

// Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty 🛒', 'error');
    return;
  }

  localStorage.removeItem('cartItems');
  localStorage.removeItem('discount');
  showToast('✅ Order placed successfully!', 'success');
  renderCart();
});

// Initial Render
document.addEventListener('DOMContentLoaded', renderCart);

// === Toast Notification Utility ===
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}
