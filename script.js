
// Slider functionality
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

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Auto slide every 5 seconds
let slideInterval = setInterval(nextSlide, 5000);

// Reset interval when user interacts with slider
function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        resetInterval();
    });
});

// Button navigation
prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
});

// Collection Sliders
const womenTrack = document.getElementById('women-track');
const menTrack = document.getElementById('men-track');
const kidsTrack = document.getElementById('kids-track');

const womenPrev = womenTrack.parentElement.querySelector('.collection-prev');
const womenNext = womenTrack.parentElement.querySelector('.collection-next');
const menPrev = menTrack.parentElement.querySelector('.collection-prev');
const menNext = menTrack.parentElement.querySelector('.collection-next');
const kidsPrev = kidsTrack.parentElement.querySelector('.collection-prev');
const kidsNext = kidsTrack.parentElement.querySelector('.collection-next');

let womenPosition = 0;
let menPosition = 0;
let kidsPosition = 0;

function moveSlider(track, direction, position) {
    const itemWidth = track.querySelector('.collection-item').offsetWidth;
    const trackWidth = track.offsetWidth;
    const contentWidth = track.scrollWidth;

    if (direction === 'next') {
        position -= itemWidth;
        if (position < -(contentWidth - trackWidth)) {
            position = 0;
        }
    } else {
        position += itemWidth;
        if (position > 0) {
            position = -(contentWidth - trackWidth);
        }
    }

    track.style.transform = `translateX(${position}px)`;
    return position;
}

womenPrev.addEventListener('click', () => {
    womenPosition = moveSlider(womenTrack, 'prev', womenPosition);
});

womenNext.addEventListener('click', () => {
    womenPosition = moveSlider(womenTrack, 'next', womenPosition);
});

menPrev.addEventListener('click', () => {
    menPosition = moveSlider(menTrack, 'prev', menPosition);
});

menNext.addEventListener('click', () => {
    menPosition = moveSlider(menTrack, 'next', menPosition);
});

kidsPrev.addEventListener('click', () => {
    kidsPosition = moveSlider(kidsTrack, 'prev', kidsPosition);
});

kidsNext.addEventListener('click', () => {
    kidsPosition = moveSlider(kidsTrack, 'next', kidsPosition);
});

// Modal functionality
const loginModal = document.getElementById('login-modal');
const aboutModal = document.getElementById('about-modal');
const userBtn = document.getElementById('user-btn');
const aboutBtn = document.getElementById('about-btn');
const closeModal = document.querySelectorAll('.close-modal');
const tabs = document.querySelectorAll('.tab');
const switchTabs = document.querySelectorAll('.switch-tab');

userBtn.addEventListener('click', () => {
    loginModal.style.display = 'flex';
});

aboutBtn.addEventListener('click', () => {
    aboutModal.style.display = 'flex';
});

closeModal.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        aboutModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === aboutModal) {
        aboutModal.style.display = 'none';
    }
});

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

switchTabs.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        document.querySelector(`.tab[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    });
});

// Countdown timer
function updateTimer() {
    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    let dayValue = parseInt(days.textContent);
    let hourValue = parseInt(hours.textContent);
    let minuteValue = parseInt(minutes.textContent);
    let secondValue = parseInt(seconds.textContent);

    secondValue--;

    if (secondValue < 0) {
        secondValue = 59;
        minuteValue--;

        if (minuteValue < 0) {
            minuteValue = 59;
            hourValue--;

            if (hourValue < 0) {
                hourValue = 23;
                dayValue--;

                if (dayValue < 0) {
                    // Reset timer when it reaches zero
                    dayValue = 2;
                    hourValue = 12;
                    minuteValue = 45;
                    secondValue = 30;
                }
            }
        }
    }

    days.textContent = dayValue.toString().padStart(2, '0');
    hours.textContent = hourValue.toString().padStart(2, '0');
    minutes.textContent = minuteValue.toString().padStart(2, '0');
    seconds.textContent = secondValue.toString().padStart(2, '0');
}

setInterval(updateTimer, 1000);

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        let count = parseInt(cartCount.textContent);
        count++;
        cartCount.textContent = count;

        // Animation effect
        button.textContent = 'Added!';
        button.style.backgroundColor = 'var(--success)';

        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
        }, 1500);
    });
});
