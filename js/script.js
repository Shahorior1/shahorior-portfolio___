// Preloader functionality
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('loading');
            // Dispatch an event to start animations
            document.dispatchEvent(new Event('startAnimations'));
            
            // Initialize particles.js
            initParticles();
        }, 1000); // Delay of 1s to ensure smooth transition
    }
});

// Initialize particles for hero section
function initParticles() {
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const config = isDarkTheme ? window.darkParticlesConfig : window.particlesConfig;
    
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', config);
    }
}

// DOM Elements
const header = document.querySelector('header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');
const contactForm = document.getElementById('contactForm');
const heroSection = document.querySelector('.hero');

// Initialize 3D Tag Cloud
function initTagCloud() {
    const container = document.getElementById('tagcloud');
    if (!container) return;

    const texts = [
        'HTML', 'CSS', 'JavaScript', 'React', 'Node.js',
        'Express', 'MongoDB', 'TypeScript', 'Git', 'API',
        'Responsive', 'REST', 'SQL', 'Three.js', 'JSON',
        'SCSS', 'Redux', 'Vue.js', 'Firebase', 'UI/UX'
    ];

    try {
        const tagCloud = TagCloud('.tagcloud', texts, {
            radius: 120,
            maxSpeed: 'fast',
            initSpeed: 'fast',
            direction: 135,
            keep: true,
            useContainerInlineStyles: false
        });

        // Change color based on position
        const color = '#00b7ff';
        document.querySelector('.tagcloud').style.color = color;
    } catch (e) {
        console.error("Tag cloud initialization failed:", e);
    }
}

// Initialize interactive background for contact form
function initInteractiveBackground() {
    const form = document.querySelector('.contact-form');
    const bg = document.querySelector('.interactive-bg');
    
    if (!form || !bg) return;
    
    form.addEventListener('mousemove', (e) => {
        const rect = form.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        bg.style.background = `
            radial-gradient(circle at ${x}px ${y}px, rgba(0, 183, 255, 0.2), transparent 50%),
            radial-gradient(circle at ${rect.width - x}px ${rect.height - y}px, rgba(157, 78, 221, 0.2), transparent 50%)
        `;
    });
    
    form.addEventListener('mouseleave', () => {
        bg.style.background = `
            radial-gradient(circle at top left, rgba(0, 183, 255, 0.1), transparent 30%),
            radial-gradient(circle at bottom right, rgba(157, 78, 221, 0.1), transparent 30%)
        `;
    });
}

// Add enhanced tilt effect to project cards
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            
            // Dynamic shadow based on mouse position
            card.style.boxShadow = `
                ${(x - centerX) / 15}px ${(y - centerY) / 15}px 20px rgba(0, 0, 0, 0.2),
                0 4px 15px rgba(0, 183, 255, 0.3)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    });
}

// Initialize animations on page load
function initAnimations() {
    // Set initial styles for hero content elements
    const heroElements = document.querySelectorAll('.hero-content *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Initialize scroll-based animations
    const animateElements = () => {
        const elements = document.querySelectorAll('.project-card, .skill-category, .about-image, .about-text, .contact-form, .contact-info, .section-title, .social-links, .filters, .tech-stack');
        
        elements.forEach(element => {
            element.classList.add('animated');
        });
        
        // Initialize skill bars animation
        initSkillBars();
    };
    
    // Trigger initial animations
    setTimeout(animateElements, 100);
    
    // Initialize all special effects
    initTagCloud();
    initInteractiveBackground();
    initTiltEffect();
}

// Animate skill progress bars when they come into view
function initSkillBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressBars.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }
}

// Call the init function to ensure animations start regardless of preloader
document.addEventListener('DOMContentLoaded', initAnimations);

// Sticky header on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    if (heroSection) {
        heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
});

// Add link hover sound effect (optional, disabled by default)
function addSoundEffects() {
    const hoverSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAuLi4uLi4uLi4uLi4uLi4uLi4uLi44ODg4ODg4ODg4ODg4ODg4ODg4ODg4OD///////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYFAAAAAAAAAbDsxgliAAAAAAD/4zLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAANCAJpWUAQBBiMjEBHRkNGTEFCQ0S4uLi4uLi4uLi4uLi44ODg4ODg4ODg4ODg4P///////////////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxC8AAANIAAAAADhCSU5BVENIQVJDSEFSQ0hBUkNIQVJDSEFSQ0hBUkNIQVJDSEFSQ0hBUkNIQVJDSEFSQ0hBUkNIQVJDSEFSQ0hBUg==');
    hoverSound.volume = 0.2;

    const clickSound = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAeIAMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzMzZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ//////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAUjAAAAAAAA4iLI6MAAAAAAAAAAAAAAAAAAAAAA/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    clickSound.volume = 0.2;

    const buttons = document.querySelectorAll('.btn, .social-links a, .nav-links a');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Uncomment to enable sound
            // hoverSound.currentTime = 0;
            // hoverSound.play().catch(() => {});
        });
        
        button.addEventListener('click', () => {
            // Uncomment to enable sound
            // clickSound.currentTime = 0;
            // clickSound.play().catch(() => {});
        });
    });
}

// Enhance scroll animations
document.addEventListener('startAnimations', () => {
    // Initialize AOS-like scroll animations
    const animateElements = () => {
        const elements = document.querySelectorAll('.project-card, .skill-category, .about-image, .about-text, .contact-form, .contact-info, .section-title, .social-links, .filters, .tech-stack');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight * 0.85;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
        
        // Progress bars animation
        const progressBars = document.querySelectorAll('.progress');
        progressBars.forEach(progress => {
            const progressPosition = progress.getBoundingClientRect().top;
            const screenPosition = window.innerHeight * 0.9;
            
            if (progressPosition < screenPosition && !progress.classList.contains('animated')) {
                const width = progress.style.width;
                progress.style.width = '0';
                progress.classList.add('animated');
                
                setTimeout(() => {
                    progress.style.width = width;
                }, 100);
            }
        });
    };
    
    // Initial animation check
    animateElements();
    
    // Add scroll listener
    window.addEventListener('scroll', animateElements);
    
    // Add hover effects to project cards with tilt
    const cards = document.querySelectorAll('.project-card, .skill-category');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;
            
            // Calculate rotation based on mouse position
            const rotateX = mouseY * -0.02;
            const rotateY = mouseX * 0.02;
            
            // Apply the transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transform on mouse leave
            card.style.transform = '';
        });
    });
    
    // Add parallax effect to hero section
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const heroContent = document.querySelector('.hero-content');
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (heroContent) {
            heroContent.style.transform = `translate(${mouseX * -20}px, ${mouseY * -20}px)`;
        }
        
        if (scrollIndicator) {
            scrollIndicator.style.transform = `translateX(-50%) translate(${mouseX * 20}px, ${mouseY * 20}px)`;
        }
    });
    
    // Initialize typewriter effect
    const typewriterText = document.querySelector('.typewriter');
    if (typewriterText) {
        // Typewriter effect is handled by CSS
        // But you could enhance it here if needed
    }

    // Add sound effects
    addSoundEffects();
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Handle contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Basic form validation
        if (!name || !email || !subject || !message) {
            // Show error with animation
            const formGroups = contactForm.querySelectorAll('.form-group');
            
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                if (!input.value) {
                    group.classList.add('error');
                    
                    // Shake animation
                    group.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
                    setTimeout(() => {
                        group.style.animation = '';
                    }, 500);
                    
                    // Add error style
                    input.style.borderColor = 'var(--accent-color)';
                    
                    // Remove error state on input
                    input.addEventListener('input', () => {
                        group.classList.remove('error');
                        input.style.borderColor = '';
                    }, { once: true });
                }
            });
            
            return;
        }
        
        // In a real application, you would send this data to a server
        console.log('Form Data:', { name, email, subject, message });
        
        // Create success message with animation
        const formElement = contactForm.parentElement;
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            contactForm.style.display = 'none';
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. I'll get back to you soon.</p>
                <button class="btn primary-btn" id="resetForm">
                    <span class="btn-text">Send Another Message</span>
                    <span class="btn-icon"><i class="fas fa-paper-plane"></i></span>
                </button>
            `;
            
            formElement.appendChild(successMessage);
            
            setTimeout(() => {
                successMessage.style.opacity = '1';
                successMessage.style.transform = 'translateY(0)';
            }, 100);
            
            // Reset form button functionality
            document.getElementById('resetForm').addEventListener('click', () => {
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    successMessage.remove();
                    contactForm.reset();
                    contactForm.style.display = 'block';
                    
                    setTimeout(() => {
                        contactForm.style.opacity = '1';
                        contactForm.style.transform = 'translateY(0)';
                    }, 100);
                }, 300);
            });
        }, 300);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Add highlight animation to the target section
            targetElement.classList.add('section-highlight');
            
            // Remove the highlight class after the animation
            setTimeout(() => {
                targetElement.classList.remove('section-highlight');
            }, 1500);
            
            // Smooth scroll with custom easing
            const startPosition = window.scrollY;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - 80;
            const distance = targetPosition - startPosition;
            const duration = 1000;
            let start = null;
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function: easeInOutQuart
                const easeProgress = progress < 0.5
                    ? 8 * progress * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 4) / 2;
                
                window.scrollTo(0, startPosition + distance * easeProgress);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Setup CSS variables and styles for animations
document.addEventListener('DOMContentLoaded', () => {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0, 183, 255, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(0, 183, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 183, 255, 0); }
        }
        
        .project-card, .skill-category, .about-image, .about-text, .contact-form, .contact-info, .social-links, .section-title, .filters, .tech-stack {
            opacity: 1;
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .progress {
            transition: width 1s ease-in-out;
        }
        
        .section-highlight {
            animation: pulse 1s;
        }
    `;
    document.head.appendChild(style);
    
    // Back to top button functionality
    const backToTopBtn = document.querySelector('.back-to-top a');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Show back to top button when scrolling down
    const backToTopElement = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', () => {
        if (backToTopElement) {
            if (window.scrollY > 500) {
                backToTopElement.style.opacity = '1';
                backToTopElement.style.transform = 'translateY(0)';
            } else {
                backToTopElement.style.opacity = '0';
                backToTopElement.style.transform = 'translateY(20px)';
            }
        }
    });
    
    // Load particles config
    const script = document.createElement('script');
    script.src = 'js/particles-config.js';
    script.onload = function() {
        if (document.readyState === 'complete') {
            initParticles();
        }
    };
    document.head.appendChild(script);
});

// Theme toggle functionality update
document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('theme-switch');
    
    if (themeSwitch) {
        themeSwitch.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
                
                // Refresh particles with dark theme
                if (typeof particlesJS !== 'undefined' && window.darkParticlesConfig) {
                    particlesJS('particles-js', window.darkParticlesConfig);
                }
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
                
                // Refresh particles with light theme
                if (typeof particlesJS !== 'undefined' && window.particlesConfig) {
                    particlesJS('particles-js', window.particlesConfig);
                }
            }
        });

        // Set initial theme state based on localStorage or default to dark
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.remove('dark-theme');
            themeSwitch.checked = false;
        } else {
            document.body.classList.add('dark-theme');
            themeSwitch.checked = true;
            if (!localStorage.getItem('theme')) {
                localStorage.setItem('theme', 'dark');
            }
        }
    }
});

// Cursor effect (optional modern touch)
function createCursorEffect() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-effect';
    document.body.appendChild(cursor);
    
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .cursor-effect {
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            position: fixed;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            opacity: 0.5;
            transition: width 0.3s, height 0.3s, opacity 0.3s;
        }
        
        .cursor-effect.hover {
            width: 40px;
            height: 40px;
            opacity: 0.3;
            border-color: var(--secondary-color);
        }
        
        a, button, .project-card, .social-links a, .skill-category {
            cursor: none;
        }
    `;
    document.head.appendChild(cursorStyle);
    
    document.addEventListener('mousemove', e => {
        cursor.style.top = e.clientY + 'px';
        cursor.style.left = e.clientX + 'px';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    const hoverElements = document.querySelectorAll('a, button, .project-card, .social-links a, .skill-category');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// Uncomment to enable custom cursor effect
// createCursorEffect();

// Typed.js effect for the hero section (if you want to include this library)
// Uncomment the following code and add the Typed.js library in your HTML to enable this feature
/*
if (typeof Typed !== 'undefined') {
    const typed = new Typed('.highlight', {
        strings: ['Shahorior', 'a Developer', 'a Designer', 'a Creator'],
        typeSpeed: 70,
        backSpeed: 50,
        backDelay: 2000,
        loop: true
    });
}
*/

// Add the testimonials slider functionality
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-btn.prev');
    const nextBtn = document.querySelector('.testimonial-btn.next');
    let currentSlide = 0;
    
    // Hide all slides except the first one
    for (let i = 1; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    
    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(20px)';
        });
        
        // Show the selected slide with animation
        slides[index].style.display = 'block';
        setTimeout(() => {
            slides[index].style.opacity = '1';
            slides[index].style.transform = 'translateX(0)';
            slides[index].style.transition = 'all 0.5s ease';
        }, 50);
        
        // Update active dot
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }
    
    // Event listeners for previous and next buttons
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            let index = currentSlide - 1;
            if (index < 0) index = slides.length - 1;
            showSlide(index);
        });
        
        nextBtn.addEventListener('click', () => {
            let index = currentSlide + 1;
            if (index >= slides.length) index = 0;
            showSlide(index);
        });
    }
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto slide change
    let slideInterval = setInterval(() => {
        let index = currentSlide + 1;
        if (index >= slides.length) index = 0;
        showSlide(index);
    }, 5000);
    
    // Pause auto slide on hover
    const sliderContainer = document.querySelector('.testimonials-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                let index = currentSlide + 1;
                if (index >= slides.length) index = 0;
                showSlide(index);
            }, 5000);
        });
    }
}

// Call the function when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the testimonials slider if it exists on the page
    if (document.querySelector('.testimonials-slider')) {
        initTestimonialsSlider();
    }
}); 