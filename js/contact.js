// EmailJS Configuration and Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    (function() {
        // Replace with your EmailJS User ID
        emailjs.init("YOUR_USER_ID");
    })();
    
    // Get form and status elements
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    const successMessage = formStatus.querySelector('.success-message');
    const errorMessage = formStatus.querySelector('.error-message');
    const sendAnother = document.getElementById('send-another');
    const tryAgain = document.getElementById('try-again');
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state on button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            emailjs.sendForm(
                'YOUR_SERVICE_ID',    // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID',   // Replace with your EmailJS template ID
                this,
                'YOUR_USER_ID'        // Replace with your EmailJS user ID
            )
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Show success message
                formStatus.classList.add('active');
                successMessage.classList.add('active');
                contactForm.reset();
            }, function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                formStatus.classList.add('active');
                errorMessage.classList.add('active');
            })
            .finally(function() {
                // Reset button state
                btnText.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Handle "Send Another" button click
    if (sendAnother) {
        sendAnother.addEventListener('click', function() {
            formStatus.classList.remove('active');
            successMessage.classList.remove('active');
        });
    }
    
    // Handle "Try Again" button click
    if (tryAgain) {
        tryAgain.addEventListener('click', function() {
            formStatus.classList.remove('active');
            errorMessage.classList.remove('active');
        });
    }
    
    // DEMO MODE - FOR TESTING WITHOUT EMAILJS CREDENTIALS
    // Comment out or remove this section when you add your actual EmailJS credentials
    const demoMode = true; // Set to false when using real EmailJS credentials
    
    if (demoMode && contactForm) {
        // Override the submit event in demo mode
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate sending email (with random success/failure)
            setTimeout(function() {
                const isSuccess = Math.random() > 0.2; // 80% success rate for demo
                
                if (isSuccess) {
                    formStatus.classList.add('active');
                    successMessage.classList.add('active');
                    contactForm.reset();
                } else {
                    formStatus.classList.add('active');
                    errorMessage.classList.add('active');
                }
                
                // Reset button state
                btnText.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500); // Simulate network delay
        }, true); // Use capture to override the previous listener
    }
}); 