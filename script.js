document.addEventListener('DOMContentLoaded', () => {
    // 0. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // 1. Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // 2. Magnetic Elements Effect
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            const position = el.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.05)`;
        });

        el.addEventListener('mouseleave', function() {
            el.style.transform = `translate(0px, 0px) scale(1)`;
            el.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
        });
        
        el.addEventListener('mouseenter', function() {
            el.style.transition = 'none'; 
        });
    });

    // 3. Lightbox Slider Logic
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxTrack = document.getElementById('lightbox-track');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxDots = document.getElementById('lightbox-dots');
    const workCards = document.querySelectorAll('.work-card');

    let currentGallery = [];
    let currentIndex = 0;

    workCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const galleryStr = card.querySelector('.view-btn').getAttribute('data-gallery');
            if (galleryStr) {
                currentGallery = galleryStr.split(',');
                currentIndex = 0;
                openLightbox();
            }
        });
    });

    function openLightbox() {
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateSlider();
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function updateSlider() {
        // Clear track
        lightboxTrack.innerHTML = '';
        currentGallery.forEach(src => {
            const img = document.createElement('img');
            img.src = src.trim();
            lightboxTrack.appendChild(img);
        });

        // Update dots
        lightboxDots.innerHTML = '';
        currentGallery.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = idx;
                updateSlider();
            });
            lightboxDots.appendChild(dot);
        });

        // Translate track
        lightboxTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Toggle buttons
        lightboxPrev.style.display = currentGallery.length > 1 ? 'flex' : 'none';
        lightboxNext.style.display = currentGallery.length > 1 ? 'flex' : 'none';
        
        // Disable arrows at ends
        lightboxPrev.style.opacity = currentIndex === 0 ? '0.3' : '1';
        lightboxPrev.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
        lightboxNext.style.opacity = currentIndex === currentGallery.length - 1 ? '0.3' : '1';
        lightboxNext.style.pointerEvents = currentIndex === currentGallery.length - 1 ? 'none' : 'auto';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentIndex < currentGallery.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
        if (e.key === 'ArrowRight' && currentIndex < currentGallery.length - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    // Close on background click
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
    });
});
