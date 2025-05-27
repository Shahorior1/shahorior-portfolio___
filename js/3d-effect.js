// 3D Hero Section Effect with Three.js
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // If mobile, use simpler background instead of 3D effect
        if (isMobile) {
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                heroSection.style.background = 'linear-gradient(45deg, var(--dark-color), #090909)';
                return;
            }
        }

        // Initialize 3D scene
        const heroSection = document.getElementById('hero-canvas');
        if (!heroSection) return;

        let scene, camera, renderer, particles;
        let mouseX = 0, mouseY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        // Initialize Scene
        function init() {
            try {
                // Create scene
                scene = new THREE.Scene();
                
                // Create camera
                camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
                camera.position.z = 1000;
                
                // Create particle system
                const geometry = new THREE.BufferGeometry();
                const vertices = [];
                const sizes = [];
                const colors = [];
                
                // Set particle count based on screen size
                const particleCount = window.innerWidth < 768 ? 500 : 1500;
                
                // Create color palette from CSS variables
                const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
                const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
                
                const colorPalette = [
                    new THREE.Color(primaryColor || '#00b7ff'),
                    new THREE.Color(secondaryColor || '#9d4edd'),
                    new THREE.Color(accentColor || '#ff5e7d')
                ];
                
                // Create particles
                for (let i = 0; i < particleCount; i++) {
                    const x = Math.random() * 2000 - 1000;
                    const y = Math.random() * 2000 - 1000;
                    const z = Math.random() * 2000 - 1000;
                    
                    vertices.push(x, y, z);
                    
                    // Randomize particle size
                    sizes.push(Math.random() * 10 + 2);
                    
                    // Assign random color from palette
                    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                    colors.push(color.r, color.g, color.b);
                }

                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                
                // Create shader material
                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        time: { value: 0 },
                        pointTexture: { value: new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzUyLCAyMDIwLzAxLzMwLTE1OjUwOjM4ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjAtMDUtMDNUMTI6Mzg6MzcrMTA6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA1LTAzVDEyOjM5OjQxKzEwOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTA1LTAzVDEyOjM5OjQxKzEwOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjgzNTcwYjNmLTZhNDMtNGVlNC1hMzJhLTBjMDY3OTI1ZjIxYiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpmZWM3MDk5Ni05NWJjLTQ3NzAtOTE1OS1mM2YyZjVlY2VmYTAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmZWM3MDk5Ni05NWJjLTQ3NzAtOTE1OS1mM2YyZjVlY2VmYTAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmZlYzcwOTk2LTk1YmMtNDc3MC05MTU5LWYzZjJmNWVjZWZhMCIgc3RFdnQ6d2hlbj0iMjAyMC0wNS0wM1QxMjozODozNysxMDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjgzNTcwYjNmLTZhNDMtNGVlNC1hMzJhLTBjMDY3OTI1ZjIxYiIgc3RFdnQ6d2hlbj0iMjAyMC0wNS0wM1QxMjozOTo0MSsxMDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+xkGIUAAAAmhJREFUWIXFl01IVFEUx3/3zYyO2aiJH6UwmmGZLcRxUXYndBe0qF24KGgRQosWQRsJghbRok1BQUFQbVq0iogiCFpEH5MopqafM5HOx3vvtnh31PSN8808neBfXN579/zP/557z33n8Uk5efVhaAjqt4mxBb2hYbkcDuqJCYq9XX7l1wfkSV9/kHQ6eCyRMAgEmr/QUJiikzNnYrKsRHZ7Bv0oWzE/X/rD5OTGcXdCBN1lEuLxYiUpCt61bkRwdITGjSWKIhQKpaePcxzbYj9tUixiDQHUwMcV4xWTJQ2lVG1huYTjOI5ffMexdXdHOlZKYVnW1qICsCwjrZS2XEoJUX+Ww9Z12iNQELAtRKuNLpeLrutlXpTsWWuJnFuBkTEDVVcHCwoaH/aUwNClYfkFDAbHx2u+Gd0IvzU+3A1gPnuJlAuLNWxpL2M7HHz3+8UJh8n5fOtrILcC3UEpnZQH10pLTNtmZnKqXQSRfD4MeUDGgpkZaVRKzEiE6Vu3GWMFX/N5kPGx4oSGolGNUu3yfA4gkUiIFQg4iMQROS/CC0Tui0gqGo1af/xzBeJpbdt21jCMG0qpS0qpXqVU20IdZFJKfQEeirB8Bdg2xLRyHKeXwrlsO5NJW4ODd/H7s4jzBEQB92iu/CWuQsCNYawhg0G/ZmSkVUejW/cEAjPA4+npJKdOxQmHv1YNwx73dESwbZvxcWlKpS7sNwyugU5QvszCxv7dOXj3TmF8e4vIJeAEQMiyrIGJid0kk7YDbAe6gE5WP+HFKFDgB/AZeAPssSzrQji80y8iPcB3YAi4DuwGmmsBLCbOH8muOJ08iuX4AAAAAElFTkSuQmCC') }
                    },
                    vertexShader: `
                        attribute float size;
                        attribute vec3 color;
                        varying vec3 vColor;
                        void main() {
                            vColor = color;
                            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                            gl_PointSize = size * (300.0 / -mvPosition.z);
                            gl_Position = projectionMatrix * mvPosition;
                        }
                    `,
                    fragmentShader: `
                        uniform sampler2D pointTexture;
                        varying vec3 vColor;
                        void main() {
                            gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
                        }
                    `,
                    blending: THREE.AdditiveBlending,
                    depthTest: false,
                    transparent: true
                });

                particles = new THREE.Points(geometry, material);
                scene.add(particles);
                
                // Create renderer
                renderer = new THREE.WebGLRenderer({ 
                    alpha: true,
                    antialias: true 
                });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setClearColor(0x000000, 0);
                
                heroSection.appendChild(renderer.domElement);
                
                // Add event listeners
                document.addEventListener('mousemove', onDocumentMouseMove);
                window.addEventListener('resize', onWindowResize);
            } catch (error) {
                console.error('Error initializing 3D scene:', error);
                // Set a background color as fallback
                if (heroSection) {
                    heroSection.style.background = 'linear-gradient(45deg, var(--dark-color), #090909)';
                }
            }
        }
        
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - windowHalfX) * 0.05;
            mouseY = (event.clientY - windowHalfY) * 0.05;
        }
        
        function animate() {
            requestAnimationFrame(animate);
            render();
        }
        
        function render() {
            camera.position.x += (mouseX - camera.position.x) * 0.05;
            camera.position.y += (-mouseY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            const time = Date.now() * 0.0005;
            
            particles.rotation.y = time * 0.1;
            particles.rotation.z = time * 0.05;
            
            if (particles.material.uniforms) {
                particles.material.uniforms.time.value = time;
            }
            
            renderer.render(scene, camera);
        }
        
        // Run the 3D effect
        init();
        animate();
    } catch (error) {
        console.error('Error in 3D effect initialization:', error);
    }
});

// Handle theme switching
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-switch');
    const body = document.body;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeToggle.checked = false;
    } else {
        // Default to dark theme
        body.classList.remove('light-theme');
        themeToggle.checked = true;
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Listen for theme toggle
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    });
});

// Add preloader functionality
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    const body = document.body;
    
    // Hide preloader immediately after DOM content is loaded
    setTimeout(() => {
        preloader.classList.add('hidden');
        body.classList.remove('loading');
        
        // Trigger animations after preloader is gone
        setTimeout(() => {
            document.dispatchEvent(new Event('startAnimations'));
        }, 300);
    }, 800);
    
    // Backup plan: ensure preloader is hidden even if load event doesn't fire
    window.addEventListener('load', () => {
        preloader.classList.add('hidden');
        body.classList.remove('loading');
    });
});

// Project filtering functionality
document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get filter value
            const filter = btn.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px) scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}); 