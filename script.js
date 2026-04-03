// XColor AI Automation Website Script
// Interactive functionality for the AI agency website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Active navigation link highlighting based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formObject = Object.fromEntries(formData);
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Send to your Express server
                const response = await fetch('https://xcolor-ai-backend.vercel.app/telegram-webhook', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formObject)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    // Success message (keep your existing UI)
                    const successHTML = `
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle"></i>
                        <strong>Message sent successfully!</strong><br>
                        Thank you, ${formObject.name}! We've received your inquiry and will contact you at ${formObject.email} within 24 hours.
                    </div>`;
                    
                    const successDiv = document.createElement('div');
                    successDiv.innerHTML = successHTML;
                    contactForm.parentNode.insertBefore(successDiv, contactForm);
                    
                    contactForm.style.display = 'none';
                    console.log('Message also sent to Telegram bot');
                } else {
                    throw new Error(result.error || 'Failed to send message');
                }
            } catch (error) {
                alert(`Sorry, there was an error: ${error.message}. Please email us directly at contact@xcolor-ai.com`);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Animate stats in hero section
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const value = stat.textContent;
                
                // Add a subtle animation
                stat.style.opacity = '0';
                stat.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    stat.style.transition = 'all 0.5s ease';
                    stat.style.opacity = '1';
                    stat.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(stat);
            }
        });
    }, observerOptions);
    
    stats.forEach(stat => observer.observe(stat));
    
    // Hardware cards hover effect enhancement
    const hardwareCards = document.querySelectorAll('.hardware-card');
    hardwareCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.hardware-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.hardware-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Terminal animation in Mac mini display
    function animateTerminal() {
        const terminalBody = document.querySelector('.terminal-body');
        if (!terminalBody) return;
        
        const lines = [
            { text: '$ model_train --dataset=custom --epochs=50', delay: 1000 },
            { text: 'Training neural network...', delay: 2000 },
            { text: '✅ Epoch 25/50 - Loss: 0.0241', delay: 3000 },
            { text: '✅ Epoch 50/50 - Loss: 0.0123', delay: 4000 },
            { text: '🎯 Model accuracy: 96.7%', delay: 5000 },
            { text: '$', delay: 6000 }
        ];
        
        let lineIndex = 0;
        
        function addLine() {
            if (lineIndex < lines.length) {
                const line = lines[lineIndex];
                const newLine = document.createElement('p');
                
                if (line.text.startsWith('$')) {
                    newLine.innerHTML = `<span class="prompt">${line.text}</span>`;
                } else if (line.text.includes('✅') || line.text.includes('🎯')) {
                    newLine.className = 'output success';
                    newLine.textContent = line.text;
                } else {
                    newLine.className = 'output';
                    newText = line.text;
                }
                
                terminalBody.appendChild(newLine);
                terminalBody.scrollTop = terminalBody.scrollHeight;
                
                lineIndex++;
                setTimeout(addLine, line.delay);
            } else {
                // Restart animation after a delay
                setTimeout(() => {
                    // Clear all but the first line
                    const existingLines = terminalBody.querySelectorAll('p');
                    for (let i = 1; i < existingLines.length; i++) {
                        existingLines[i].remove();
                    }
                    lineIndex = 0;
                    setTimeout(addLine, 1000);
                }, 3000);
            }
        }
        
        // Start animation after a short delay
        setTimeout(addLine, 2000);
    }
    
    // Start terminal animation if the element exists
    if (document.querySelector('.terminal-body')) {
        animateTerminal();
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Dynamic hardware status update
    function updateHardwareStatus() {
        const statusValue = document.querySelector('.metric-value:nth-child(1)');
        if (statusValue) {
            // Simulate varying load percentage
            const currentLoad = Math.floor(Math.random() * 20) + 25; // 25-45%
            statusValue.textContent = `${currentLoad}%`;
            
            // Update uptime (slight random variation)
            const uptimeValue = document.querySelector('.metric-value:nth-child(2)');
            if (uptimeValue) {
                const baseUptime = 99.7;
                const variation = (Math.random() * 0.2) - 0.1; // -0.1 to +0.1
                uptimeValue.textContent = (baseUptime + variation).toFixed(1) + '%';
            }
            
            // Update active projects
            const projectsValue = document.querySelector('.metric-value:nth-child(3)');
            if (projectsValue) {
                const projects = Math.floor(Math.random() * 2) + 3; // 3-5
                projectsValue.textContent = projects;
            }
        }
    }
    
    // Update hardware status every 30 seconds
    setInterval(updateHardwareStatus, 30000);
    
    // Initialize hardware status
    updateHardwareStatus();
    
    // Add parallax effect to hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.backgroundPosition = `center ${rate}px`;
        }
    });
    
    // Initialize AOS (Animate On Scroll) for elements
    // This is a simple implementation without external libraries
    const animatedElements = document.querySelectorAll('.hardware-card, .service-card, .ecosystem-node');
    
    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Set initial state for animated elements
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });
    
    // Add current year to copyright
    const copyrightElement = document.querySelector('.footer-copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2024', currentYear);
    }
    
    // Add loading animation for images (if any are added later)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
    
    // Log page view (for analytics in real implementation)
    console.log('XColor AI Automation website loaded successfully');
    console.log('Hardware: Mac mini M4 16GB/256GB');
    console.log('Services: AI Deployment, Workflow Automation, Custom Development, GPU Optimization');
});

// Performance monitoring (simulated)
function monitorPerformance() {
    const startTime = performance.now();
    
    window.addEventListener('load', function() {
        const loadTime = performance.now() - startTime;
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Log performance to "status" (simulated)
        if (loadTime < 1000) {
            console.log('✅ Performance: Excellent');
        } else if (loadTime < 2000) {
            console.log('⚠️ Performance: Good');
        } else {
            console.log('⚠️ Performance: Needs optimization');
        }
    });
}

// Initialize performance monitoring
monitorPerformance();