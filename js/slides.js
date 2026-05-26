// doppler/js/slides.js

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress');
    const slideNumberEl = document.getElementById('slide-number');
    const container = document.getElementById('presentation-container');
    const wrapper = document.getElementById('presentation-wrapper');
    
    let currentSlideIndex = 0;

    // Auto-scaling helper to maintain 16:9 ratio and fit any screen size
    function adjustScale() {
        if (!wrapper) return;
        
        const baseWidth = 1280;
        const baseHeight = 720;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const scaleX = windowWidth / baseWidth;
        const scaleY = windowHeight / baseHeight;
        // Use the smaller scaling factor to fit within the viewport
        const scale = Math.min(scaleX, scaleY);
        
        wrapper.style.transform = `scale(${scale})`;
    }
    
    // Bind scale helper to resize and load
    window.addEventListener('resize', adjustScale);
    adjustScale(); // trigger immediately

    // We store the original iframe sources so we can reset/reload them when they are active
    const iframeSources = new Map();
    document.querySelectorAll('iframe').forEach((iframe, idx) => {
        // Save using slide index
        const slide = iframe.closest('.slide');
        const slideIdx = Array.from(slides).indexOf(slide);
        iframeSources.set(slideIdx, iframe.src);
    });

    function updateSlides() {
        slides.forEach((slide, index) => {
            const iframe = slide.querySelector('iframe');
            
            if (index === currentSlideIndex) {
                slide.classList.add('active');
                
                // If this slide contains an iframe, reload/reset it to ensure clean state and restart animation
                if (iframe && iframeSources.has(index)) {
                    iframe.src = iframeSources.get(index);
                }

                // Theme management: cosmic slides are dark, others are light
                if (slide.getAttribute('data-theme') === 'dark') {
                    container.classList.add('dark-theme');
                } else {
                    container.classList.remove('dark-theme');
                }
            } else {
                slide.classList.remove('active');
                
                // If it's inactive and has an iframe, clear its src to stop calculations and save resources
                if (iframe) {
                    iframe.src = '';
                }
            }
        });

        // Update progress bar
        const progressPercent = ((currentSlideIndex) / (slides.length - 1)) * 100;
        progressBar.style.width = `${progressPercent}%`;

        // Update buttons
        prevBtn.disabled = currentSlideIndex === 0;
        nextBtn.disabled = currentSlideIndex === slides.length - 1;

        // Update slide number display
        if (slideNumberEl) {
            slideNumberEl.textContent = `${currentSlideIndex + 1} / ${slides.length}`;
        }
    }

    function nextSlide() {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            updateSlides();
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlides();
        }
    }

    // Event Listeners for buttons
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Event Listener for keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Prevent default actions for keys that trigger navigation
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowLeft') {
            // But don't prevent if user is inside a form or quiz option
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            e.preventDefault();
        }

        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Initialize first slide
    updateSlides();
});
