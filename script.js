// === Slider functionality ===
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }

let slideInterval = setInterval(nextSlide, 5000);
function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}
dots.forEach((dot, index) => dot.addEventListener('click', () => {
    showSlide(index);
    resetInterval();
}));
prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });
nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });

// === Collection Sliders ===
const womenTrack = document.getElementById('women-track');
const menTrack = document.getElementById('men-track');
const kidsTrack = document.getElementById('kids-track');

const womenPrev = womenTrack.parentElement.querySelector('.collection-prev');
const womenNext = womenTrack.parentElement.querySelector('.collection-next');
const menPrev = menTrack.parentElement.querySelector('.collection-prev');
const menNext = menTrack.parentElement.querySelector('.collection-next');
const kidsPrev = kidsTrack.parentElement.querySelector('.collection-prev');
const kidsNext = kidsTrack.parentElement.querySelector('.collection-next');

let womenPosition = 0, menPosition = 0, kidsPosition = 0;

function moveSlider(track, direction, position) {
    const itemWidth = track.querySelector('.collection-item').offsetWidth;
    const trackWidth = track.offsetWidth;
    const contentWidth = track.scrollWidth;

    if (direction === 'next') {
        position -= itemWidth;
        if (position < -(contentWidth - trackWidth)) position = 0;
    } else {
        position += itemWidth;
        if (position > 0) position = -(contentWidth - trackWidth);
    }
    track.style.transform = `translateX(${position}px)`;
    return position;
}

womenPrev.addEventListener('click', () => womenPosition = moveSlider(womenTrack, 'prev', womenPosition));
womenNext.addEventListener('click', () => womenPosition = moveSlider(womenTrack, 'next', womenPosition));
menPrev.addEventListener('click', () => menPosition = moveSlider(menTrack, 'prev', menPosition));
menNext.addEventListener('click', () => menPosition = moveSlider(menTrack, 'next', menPosition));
kidsPrev.addEventListener('click', () => kidsPosition = moveSlider(kidsTrack, 'prev', kidsPosition));
kidsNext.addEventListener('click', () => kidsPosition = moveSlider(kidsTrack, 'next', kidsPosition));

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

// === Update Cart Count ===
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = totalItems;
        cartCountEl.classList.add('cart-bounce');
        setTimeout(() => cartCountEl.classList.remove('cart-bounce'), 500);
    }
}

// === Add to Cart ===
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        if (!productCard) return;

        const product = {
            id: productCard.querySelector('.product-title').textContent.replace(/\s+/g, '-').toLowerCase(),
            name: productCard.querySelector('.product-title').textContent.trim(),
            price: parseFloat(productCard.querySelector('.current-price').textContent.replace('$', '').trim()),
            image: productCard.querySelector('img').src,
            quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existing = cart.find(item => item.id === product.id);
        if (existing) existing.quantity++;
        else cart.push(product);

        localStorage.setItem('cartItems', JSON.stringify(cart));
        updateCartCount();
        showToast(`${product.name} added to cart 🛒`);
    });
});

// === Initialize Cart Count on Page Load ===
document.addEventListener('DOMContentLoaded', updateCartCount);
