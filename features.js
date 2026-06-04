// Features JS: Antigravity & Sliders

document.addEventListener('DOMContentLoaded', () => {
    initAntigravity();
    initSliders();
});

// --- Antigravity Physics ---
function initAntigravity() {
    const floaters = document.querySelectorAll('.antigravity');
    
    floaters.forEach(el => {
        // Randomize duration between 4s and 8s
        const duration = (Math.random() * 4 + 4).toFixed(2);
        // Randomize delay to desync animations
        const delay = (Math.random() * -5).toFixed(2);
        
        // Randomize X and Y movement intensities (-12px to 12px)
        const x1 = (Math.random() * 10 - 5).toFixed(1) + 'px';
        const y1 = (Math.random() * -10 - 5).toFixed(1) + 'px'; // Upwards
        const r1 = (Math.random() * 2 - 1).toFixed(2) + 'deg';
        
        const x2 = (Math.random() * 10 - 5).toFixed(1) + 'px';
        const y2 = (Math.random() * 10 + 5).toFixed(1) + 'px'; // Downwards
        const r2 = (Math.random() * 2 - 1).toFixed(2) + 'deg';
        
        el.style.setProperty('--float-duration', `${duration}s`);
        el.style.setProperty('--float-delay', `${delay}s`);
        
        el.style.setProperty('--float-x1', x1);
        el.style.setProperty('--float-y1', y1);
        el.style.setProperty('--float-r1', r1);
        
        el.style.setProperty('--float-x2', x2);
        el.style.setProperty('--float-y2', y2);
        el.style.setProperty('--float-r2', r2);
    });
}

// --- Image Sliders ---
function initSliders() {
    const sliders = document.querySelectorAll('.slider-container');
    
    sliders.forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const slides = slider.querySelectorAll('.slider-slide');
        if (!track || slides.length <= 1) return; // No need for slider if 1 image
        
        let currentIndex = 0;
        
        // Create controls
        const prevBtn = document.createElement('div');
        prevBtn.className = 'slider-btn slider-prev';
        prevBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">chevron_left</span>';
        
        const nextBtn = document.createElement('div');
        nextBtn.className = 'slider-btn slider-next';
        nextBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">chevron_right</span>';
        
        // Create dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        });
        
        slider.appendChild(prevBtn);
        slider.appendChild(nextBtn);
        slider.appendChild(dotsContainer);
        
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        
        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }
        
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // VERY IMPORTANT: Don't trigger the product link
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateSlider();
        });
        
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        });
        
        // Optional: Touch swipe support could be added here, but keeping it minimal for now.
    });
}

// Expose to window for dynamic calls
window.initAntigravity = initAntigravity;
window.initSliders = initSliders;
