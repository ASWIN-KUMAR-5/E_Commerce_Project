// --- Universal Cart System for StyleHub ---

// Utility Functions
function getCart() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector('.cart-count');
  if (badge) badge.textContent = count;
}

// Add-to-Cart Handler (for all pages except cart.html)
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    const name = card.querySelector('.product-title').innerText;
    const price = parseFloat(card.querySelector('.current-price').innerText.replace('$', ''));
    const image = card.querySelector('img').src;
    const id = name.split(' ').join('-').toLowerCase();

    let cart = getCart();
    const existing = cart.find(i => i.id === id);

    if (existing) existing.quantity += 1;
    else cart.push({ id, name, price, image, quantity: 1 });

    saveCart(cart);
    updateCartCount();

    btn.textContent = 'Added!';
    btn.style.backgroundColor = 'var(--success)';
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.style.backgroundColor = '';
    }, 1000);
  });
});

// --- CART PAGE RENDERING ---
if (document.getElementById('cart-container')) {
  const cartContainer = document.getElementById('cart-container');
  renderCart();

  function renderCart() {
    let cart = getCart();
    cartContainer.innerHTML = `<h2 class="cart-title"><i class="fas fa-shopping-bag"></i> Your Cart</h2>`;

    if (cart.length === 0) {
      cartContainer.innerHTML += `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty!</p>
        </div>`;
      return;
    }

    let total = 0;
    cart.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      cartContainer.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div class="item-info">
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
          </div>
          <div class="quantity">
            <button onclick="updateQuantity('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity('${item.id}', 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem('${item.id}')"><i class="fas fa-trash"></i></button>
        </div>`;
    });

    cartContainer.innerHTML += `
      <div class="cart-summary">
        <p>Subtotal: $${total.toFixed(2)}</p>
        <p>Shipping: $${cart.length > 0 ? '10.00' : '0.00'}</p>
        <h3>Total: $${(total + (cart.length > 0 ? 10 : 0)).toFixed(2)}</h3>
        <button class="checkout-btn" onclick="checkout()">Proceed to Checkout</button>
      </div>`;
  }

  window.updateQuantity = (id, change) => {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart(cart);
    renderCart();
    updateCartCount();
  };

  window.removeItem = (id) => {
    let cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    renderCart();
    updateCartCount();
  };

  window.checkout = () => {
    alert('✅ Checkout Successful! Thank you for shopping with StyleHub 💖');
    localStorage.removeItem('cartItems');
    renderCart();
    updateCartCount();
  };
}

// Update badge on all pages
updateCartCount();
