// Loader functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create loader elements
    const loaderHtml = `
        <div class="loading-overlay" id="loading-overlay">
            <div class="loading-logo">
                <img src="img/profile.jpg" alt="Loading">
            </div>
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading</div>
            <div class="loading-progress">
                <div class="loading-progress-bar" id="loading-progress-bar"></div>
            </div>
        </div>
    `;
    
    // Insert loader at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', loaderHtml);
    
    const overlay = document.getElementById('loading-overlay');
    const progressBar = document.getElementById('loading-progress-bar');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(function() {
        progress += Math.random() * 10;
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
            
            // Wait a bit after 100% before hiding
            setTimeout(function() {
                // Hide loader
                overlay.classList.add('hidden');
                
                // Add animation class to the main content
                const mainContent = document.querySelector('.cv-container');
                if (mainContent) {
                    mainContent.classList.add('loading-finished');
                }
                
                // Remove the overlay from the DOM after transition
                setTimeout(function() {
                    overlay.remove();
                }, 500);
            }, 500);
        }
        progressBar.style.width = progress + '%';
    }, 200);
    
    // Ensure loader is hidden if page loads faster
    window.addEventListener('load', function() {
        // Ensure progress is at least 70% when page loads
        if (progress < 70) {
            progress = 70;
            progressBar.style.width = progress + '%';
        }
    });
}); 