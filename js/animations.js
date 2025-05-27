// Initialize Smooth Scroll
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scroll with options
    const scroll = new SmoothScroll('a[href*="#"]', {
        speed: 800,
        speedAsDuration: true,
        offset: 80, // Offset for fixed header
        easing: 'easeInOutCubic',
        updateURL: false
    });

    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true,
        offset: 100,
        delay: 100
    });

    // Add scroll animation triggers
    document.addEventListener('aos:in', ({ detail }) => {
        // Custom animation behavior when elements come into view
        if (detail.classList.contains('skill-category')) {
            const progressBars = detail.querySelectorAll('.progress');
            progressBars.forEach(progress => {
                const width = progress.style.width;
                progress.style.width = '0';
                
                setTimeout(() => {
                    progress.style.width = width;
                }, 300);
            });
        }
    });

    // Enhanced Project Filtering
    const setupProjectFiltering = () => {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        let currentFilter = "all";
        
        // Initialize counters for each category
        const categoryCounts = {
            all: projectCards.length,
            web: 0,
            mobile: 0,
            design: 0
        };
        
        // Count projects in each category
        projectCards.forEach(card => {
            const category = card.dataset.category;
            if (categoryCounts.hasOwnProperty(category)) {
                categoryCounts[category]++;
            }
        });
        
        // Update the filter buttons with counts
        filterBtns.forEach(btn => {
            const category = btn.getAttribute('data-filter');
            const count = categoryCounts[category] || 0;
            
            // Add count badge to button
            const badge = document.createElement('span');
            badge.className = 'filter-count';
            badge.textContent = count;
            btn.appendChild(badge);
        });
        
        // Filter function
        const filterProjects = (filter) => {
            currentFilter = filter;
            
            // Update active state on buttons
            filterBtns.forEach(btn => {
                if (btn.getAttribute('data-filter') === filter) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Animate the filtering
            projectCards.forEach(card => {
                // Get category and match with filter
                const cardCategory = card.getAttribute('data-category');
                const matchesFilter = filter === 'all' || cardCategory === filter;
                
                // Store original AOS settings to restore later
                const originalAosDelay = card.getAttribute('data-aos-delay');
                
                // Animate out
                card.style.transition = 'all 0.4s ease';
                
                if (!matchesFilter) {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                } else {
                    setTimeout(() => {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    }, 400);
                }
            });
            
            // Update URL with filter
            const url = new URL(window.location.href);
            url.searchParams.set('filter', filter);
            window.history.replaceState({}, '', url);
        };
        
        // Add click events to filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                filterProjects(filter);
            });
        });
        
        // Check URL for filter parameter
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        
        if (filterParam && ['all', 'web', 'mobile', 'design'].includes(filterParam)) {
            filterProjects(filterParam);
        }
    };
    
    // Initialize project filtering
    setupProjectFiltering();

    // Add scroll listener to animate header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Custom entrance animation for hero section
    const heroElements = document.querySelectorAll('.hero-content *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }, 100 + (index * 100));
    });

    // Add animated cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'animated-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-click');
        setTimeout(() => {
            cursor.classList.remove('cursor-click');
        }, 500);
    });
}); 