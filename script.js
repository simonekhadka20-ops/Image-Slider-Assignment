class ImageSlider {
    constructor(selector) {
        this.slider = document.querySelector(selector);

        if (!this.slider) {
            console.error(`ImageSlider: Element "${selector}" not found.`);
            return;
        }

        this.track = this.slider.querySelector('.slider-track');

        if (!this.track) {
            console.error('ImageSlider: ".slider-track" element missing inside slider.');
            return;
        }

        this.slides = Array.from(this.track.children);
        this.prevButton = this.slider.querySelector('.prev');
        this.nextButton = this.slider.querySelector('.next');
        this.currentIndex = 0;
        this.timer = null;

        this.init();
    }

    init() {
        if (this.slides.length === 0) {
            console.warn('ImageSlider: No slides found inside .slider-track');
            return;
        }

        this.createDots();
        this.bindEvents();
        this.updateSlidePosition();

        // Start auto slide (2 seconds)
        this.startAutoSlide();
    }

    // ================= MOVE SLIDE =================

    updateSlidePosition() {
        // Use pixel width of the slider container for precise shifting
        const slideWidth = this.slider.clientWidth;
        const offset = this.currentIndex * slideWidth;

        this.track.style.transform = `translateX(-${offset}px)`;
        this.updateDots();
    }

    // ================= NEXT =================

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlidePosition();
    }

    // ================= PREVIOUS =================

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.slides.length - 1;
        }
        this.updateSlidePosition();
    }

    // ================= DOTS =================

    createDots() {
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.classList.add('dots');
        this.dots = [];

        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');

            dot.addEventListener('click', () => {
                this.currentIndex = index;
                this.updateSlidePosition();
                this.startAutoSlide(); // Reset timer on click
            });

            this.dotsContainer.appendChild(dot);
            this.dots.push(dot);
        });

        this.slider.insertAdjacentElement('afterend', this.dotsContainer);
    }

    // ================= ACTIVE DOT =================

    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // ================= AUTO SLIDE =================

    startAutoSlide() {
        // Clear any existing timer
        clearInterval(this.timer);

        console.log('Auto-slide timer started (2s interval)');

        // Change slide every 2 seconds (2000 ms)
        this.timer = setInterval(() => {
            console.log('Auto-sliding to next slide...');
            this.nextSlide();
        }, 2000);
    }

    stopAutoSlide() {
        clearInterval(this.timer);
    }

    // ================= MOUSE EVENTS =================

    bindEvents() {
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => {
                this.nextSlide();
                this.startAutoSlide();
            });
        }

        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => {
                this.prevSlide();
                this.startAutoSlide();
            });
        }

        // Pause on mouse hover
        this.slider.addEventListener('mouseenter', () => {
            this.stopAutoSlide();
        });

        // Resume when mouse leaves
        this.slider.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }
}

// Start after full window load to avoid layout shifts
window.addEventListener('load', () => {
    new ImageSlider('.slider');
});