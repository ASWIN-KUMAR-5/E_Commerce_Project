// === StyleHub Frontend Script ===
// Includes: Add to Cart, Mini Cart, Toasts, Cart Count

// === Utility Functions ===
function getCartLS() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function saveCartLS(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

// === Toast Utility ===
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

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

// === Cart Count Badge ===
function updateCartCount() {
  const cart = getCartLS();
  const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.querySelector('.cart-count');

  if (badge) {
    badge.textContent = total;
    badge.classList.add('cart-bounce');
    setTimeout(() => badge.classList.remove('cart-bounce'), 400);
  }
}

// === Add to Cart ===
function addToCart(item) {
  let cart = getCartLS();
  const existing = cart.find(p => p.id === item.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCartLS(cart);
  updateCartCount();
  renderMiniCart();
  showToast(`${item.name} added to cart 🛒`, 'success');
}

// === Mini Cart Dropdown ===
function renderMiniCart() {
  const wrap = document.getElementById('mini-cart-items');
  if (!wrap) return;

  const cart = getCartLS();
  const lastThree = cart.slice(-3).reverse(); // recent items

  if (lastThree.length === 0) {
    wrap.innerHTML = `<div class="empty-cart" style="text-align:center;color:#888;padding:8px 0;">
      <i class="fas fa-shopping-bag"></i> No recent items
    </div>`;
    return;
  }

  wrap.innerHTML = lastThree
    .map(
      item => `
      <div class="mini-item fade-in">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <div class="mi-name">${item.name}</div>
          <div class="mi-meta">Qty: ${item.quantity}</div>
        </div>
        <div class="mi-price">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>
    `
    )
    .join('');
}

// === Mini Cart Toggle (Click) ===
function setupMiniCartToggle() {
  const btn = document.getElementById('cart-btn');
  const panel = document.getElementById('mini-cart');
  if (!btn || !panel) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) renderMiniCart();
  });

  document.addEventListener('click', e => {
    if (!panel.classList.contains('open')) return;
    const clickedInside = panel.contains(e.target) || btn.contains(e.target);
    if (!clickedInside) panel.classList.remove('open');
  });
}

// === Initialize Buttons ===
function setupAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const item = {
        id: card.querySelector('.product-title').textContent.replace(/\s+/g, '-').toLowerCase(),
        name: card.querySelector('.product-title').textContent,
        price: parseFloat(card.querySelector('.current-price').textContent.replace('$', '')),
        image: card.querySelector('img').src,
      };
      addToCart(item);
    });
  });
}

// === On Load ===
document.addEventListener('DOMContentLoaded', () => {
  setupAddToCartButtons();
  setupMiniCartToggle();
  updateCartCount();
  renderMiniCart();
});
