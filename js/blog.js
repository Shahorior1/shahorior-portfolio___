// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Category filter functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const activeFilters = document.getElementById('active-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const resultsCount = document.getElementById('results-count');
    const noResults = document.querySelector('.no-results');
    const resetSearchBtn = document.getElementById('reset-search');
    let currentFilters = new Set();
    
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                const category = this.dataset.category;
                
                if (category === 'all') {
                    // Clear all filters if "All" is clicked
                    currentFilters.clear();
                    updateActiveFilters();
                    filterBlogCards();
                } else {
                    // Toggle the filter
                    if (currentFilters.has(category)) {
                        currentFilters.delete(category);
                    } else {
                        currentFilters.add(category);
                    }
                    
                    // Update UI and filter cards
                    updateActiveFilters();
                    filterBlogCards();
                }
                
                // Update button active states
                categoryButtons.forEach(btn => {
                    if (category === 'all') {
                        btn.classList.toggle('active', btn.dataset.category === 'all');
                    } else {
                        if (btn.dataset.category === 'all') {
                            btn.classList.remove('active');
                        } else {
                            btn.classList.toggle('active', currentFilters.has(btn.dataset.category));
                        }
                    }
                });
            });
        });
    }
    
    // Topic card filter functionality
    const topicCards = document.querySelectorAll('.topic-card');
    if (topicCards.length > 0) {
        topicCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.dataset.category;
                
                // Find and click the corresponding category button
                const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
                if (categoryBtn) {
                    categoryBtn.click();
                    
                    // Scroll to blog grid
                    document.querySelector('.blog-grid').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Function to update the active filters display
    function updateActiveFilters() {
        if (!activeFilters) return;
        
        activeFilters.innerHTML = '';
        
        if (currentFilters.size === 0) {
            // If no filters, show "all" in results count
            if (resultsCount) resultsCount.textContent = 'all';
            return;
        }
        
        // Update the results count
        if (resultsCount) resultsCount.textContent = `${currentFilters.size} filtered`;
        
        // Create filter badges
        currentFilters.forEach(filter => {
            const filterBadge = document.createElement('span');
            filterBadge.className = 'active-filter';
            filterBadge.innerHTML = `${filter} <i class="fas fa-times" data-filter="${filter}"></i>`;
            activeFilters.appendChild(filterBadge);
            
            // Add click event to remove filter
            const removeIcon = filterBadge.querySelector('i');
            removeIcon.addEventListener('click', function() {
                const filterToRemove = this.dataset.filter;
                currentFilters.delete(filterToRemove);
                
                // Reset button active state
                const button = document.querySelector(`.category-btn[data-category="${filterToRemove}"]`);
                if (button) button.classList.remove('active');
                
                updateActiveFilters();
                filterBlogCards();
            });
        });
    }
    
    // Function to filter blog cards
    function filterBlogCards() {
        let visibleCount = 0;
        
        blogCards.forEach(card => {
            if (currentFilters.size === 0) {
                // Show all cards if no filters
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
                visibleCount++;
            } else {
                const cardCategories = card.dataset.category.split(',');
                
                // Check if the card has any of the active filters
                const hasMatch = [...currentFilters].some(filter => 
                    cardCategories.includes(filter)
                );
                
                if (hasMatch) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                    visibleCount++;
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }
        });
        
        // Show or hide the "no results" message
        if (noResults) {
            if (visibleCount === 0) {
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        }
    }
    
    // Clear all filters
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            currentFilters.clear();
            
            // Reset all category buttons
            categoryButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === 'all');
            });
            
            updateActiveFilters();
            filterBlogCards();
        });
    }
    
    // Reset search button in no results section
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', function() {
            clearFiltersBtn.click();
            
            // Also clear search input if exists
            const searchInput = document.getElementById('blog-search-input');
            if (searchInput) {
                searchInput.value = '';
                // Trigger search update
                searchBlogPosts('');
            }
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('blog-search-input');
    const searchForm = document.querySelector('.search-form');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim().toLowerCase();
            searchBlogPosts(query);
        });
        
        // Search as you type (debounced)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = this.value.trim().toLowerCase();
                searchBlogPosts(query);
            }, 300);
        });
    }
    
    // Function to search blog posts
    function searchBlogPosts(query) {
        let visibleCount = 0;
        
        blogCards.forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.blog-tags span'))
                .map(tag => tag.textContent.toLowerCase());
            
            // If there's an active filter, respect it
            let passesFilter = true;
            if (currentFilters.size > 0) {
                const cardCategories = card.dataset.category.split(',');
                passesFilter = [...currentFilters].some(filter => 
                    cardCategories.includes(filter)
                );
            }
            
            const matchesSearch = query === '' || 
                title.includes(query) || 
                content.includes(query) || 
                tags.some(tag => tag.includes(query));
            
            if (matchesSearch && passesFilter) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
                visibleCount++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Show or hide the "no results" message
        if (noResults) {
            if (visibleCount === 0) {
                noResults.style.display = 'block';
            } else {
                noResults.style.display = 'none';
            }
        }
    }
    
    // Sharing functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    const copyLinks = document.querySelectorAll('.copy-link');
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    
    if (shareButtons.length > 0) {
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                // Toggle active class to show share options
                const shareOptions = this.nextElementSibling;
                if (shareOptions) {
                    shareOptions.classList.toggle('active');
                }
            });
        });
    }
    
    if (copyLinks.length > 0) {
        copyLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Get the article link
                const article = this.closest('.blog-card');
                let url = window.location.origin + window.location.pathname;
                
                if (article) {
                    const readMoreLink = article.querySelector('.read-more');
                    if (readMoreLink) {
                        url = readMoreLink.getAttribute('href');
                        // Ensure it's an absolute URL
                        if (!url.startsWith('http')) {
                            url = window.location.origin + (url.startsWith('/') ? '' : '/') + url;
                        }
                    }
                }
                
                // Copy to clipboard
                navigator.clipboard.writeText(url).then(() => {
                    // Show toast notification
                    showToast('Link copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    showToast('Failed to copy link.');
                });
            });
        });
    }
    
    // Function to show toast notification
    function showToast(message) {
        if (!toast) return;
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // Auto-hide toast after animation (3 seconds)
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Newsletter form functionality
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Here you would normally send the email to your server
                console.log('Newsletter subscription:', email);
                
                // Show success message
                const formContainer = newsletterForm.parentElement;
                newsletterForm.style.display = 'none';
                
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you for subscribing! We've sent a confirmation email to <strong>${email}</strong>.</p>
                `;
                formContainer.appendChild(successMessage);
            }
        });
    }
    
    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Comment form functionality on blog post pages
    const commentForm = document.querySelector('.comment-form form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('input[type="text"]');
            const emailInput = this.querySelector('input[type="email"]');
            const commentInput = this.querySelector('textarea');
            
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const comment = commentInput.value.trim();
            
            if (name && email && comment) {
                // Here you would normally send the comment to your server
                console.log('New comment:', { name, email, comment });
                
                // Show success message
                commentForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <p>Thank you for your comment! It will be visible after moderation.</p>
                    </div>
                `;
            }
        });
    }
    
    // URL parameter handling for tag filters
    const urlParams = new URLSearchParams(window.location.search);
    const tagParam = urlParams.get('tag');
    
    if (tagParam) {
        const tagButton = document.querySelector(`.category-btn[data-category="${tagParam}"]`);
        if (tagButton) {
            tagButton.click();
        }
    }
    
    // Reading progress indicator for blog post pages
    const progressIndicator = document.getElementById('reading-progress');
    if (progressIndicator) {
        window.addEventListener('scroll', function() {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressIndicator.style.width = scrolled + '%';
        });
    }
    
    // Read time calculation for blog post pages
    function calculateReadTime() {
        const article = document.querySelector('.post-content');
        if (article) {
            const text = article.textContent;
            const wpm = 225; // Average reading speed (words per minute)
            const words = text.trim().split(/\s+/).length;
            const time = Math.ceil(words / wpm);
            
            const readTimeElement = document.querySelector('.post-time');
            if (readTimeElement) {
                readTimeElement.innerHTML = `<i class="far fa-clock"></i> ${time} min read`;
            }
        }
    }
    
    calculateReadTime();
    
    // Initialize dropdown for more categories
    const categoriesDropdown = document.querySelector('.categories-dropdown');
    if (categoriesDropdown) {
        const moreButton = categoriesDropdown.querySelector('.more-categories-btn');
        const dropdownContent = categoriesDropdown.querySelector('.dropdown-content');
        
        // For touch devices, toggle on click
        if ('ontouchstart' in window) {
            moreButton.addEventListener('click', function(e) {
                e.preventDefault();
                dropdownContent.classList.toggle('visible');
                moreButton.querySelector('i').classList.toggle('fa-chevron-up');
                moreButton.querySelector('i').classList.toggle('fa-chevron-down');
            });
            
            // Close when clicking outside
            document.addEventListener('click', function(e) {
                if (!categoriesDropdown.contains(e.target)) {
                    dropdownContent.classList.remove('visible');
                    moreButton.querySelector('i').classList.remove('fa-chevron-up');
                    moreButton.querySelector('i').classList.add('fa-chevron-down');
                }
            });
        }
    }
    
    // Handle pagination (currently just preventing default)
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default for demo purposes
            // In a real implementation, this would navigate to the next page
            e.preventDefault();
            
            // Demo behavior: just show a toast
            showToast('Pagination would navigate to the next page');
        });
    });
}); 