// ===============================
// Main script (safe, no functional changes)
// - All original functions preserved
// - Added safe guards so missing elements do not throw errors
// ===============================

/* Smooth scrolling for navigation links */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // If href is just "#" or empty, let it behave normally
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* Initialize EmailJS if available */
(function () {
    if (typeof emailjs !== 'undefined' && emailjs?.init) {
        try {
            emailjs.init("ujYsuMkVqD71ydm_7");
        } catch (err) {
            // fail silently - emailjs not critical for page
            console.error('EmailJS init error', err);
        }
    }
})();

/* Form submission handler */
(function () {
    const contactForm = document.querySelector('#contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values safely
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const messageEl = document.getElementById('message');

        const name = nameEl ? nameEl.value.trim() : '';
        const email = emailEl ? emailEl.value.trim() : '';
        const message = messageEl ? messageEl.value.trim() : '';

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : 'Send';
        if (submitButton) {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
        }

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_email: 'okulloabdulsalam@gmail.com'
        };

        if (typeof emailjs !== 'undefined' && emailjs.send) {
            emailjs.send('service_g0myzvt', 'template_io5fmmo', templateParams)
                .then(function (response) {
                    alert('Thank you for your message! I will get back to you soon.');
                    contactForm.reset();
                })
                .catch(function (error) {
                    console.error('EmailJS error details:', error);
                    let errorMessage = 'There was an issue sending your message.\n\n';

                    if (error && error.text) {
                        errorMessage += 'Error: ' + error.text + '\n\n';
                    }

                    if (error && error.status === 400) {
                        errorMessage += 'Possible issues:\n- Template ID might be incorrect\n- Template variables might not match\n- Service ID might be incorrect\n\n';
                    } else if (error && error.status === 401) {
                        errorMessage += 'Authentication error. Check your Public Key.\n\n';
                    }

                    errorMessage += 'Opening your email client as backup...';

                    const subject = encodeURIComponent('New Contact Form Message from ' + name);
                    const body = encodeURIComponent('Name: ' + name + '\n\nEmail: ' + email + '\n\nMessage:\n' + message);
                    const mailtoLink = 'mailto:okulloabdulsalam@gmail.com?subject=' + subject + '&body=' + body;

                    alert(errorMessage);
                    window.location.href = mailtoLink;
                })
                .finally(function () {
                    if (submitButton) {
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;
                    }
                });
        } else {
            // If emailjs not available, fallback to mail client
            alert('Email service unavailable. Opening your email client...');
            const subject = encodeURIComponent('New Contact Form Message from ' + name);
            const body = encodeURIComponent('Name: ' + name + '\n\nEmail: ' + email + '\n\nMessage:\n' + message);
            window.location.href = 'mailto:okulloabdulsalam@gmail.com?subject=' + subject + '&body=' + body;
            if (submitButton) {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
            contactForm.reset();
        }
    });
})();

/* Navbar shadow on scroll */
(function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        navbar.style.boxShadow = currentScroll > 100
            ? '0 4px 6px rgba(0, 0, 0, 0.15)'
            : '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
})();

/* Fade-in animation on scroll for sections */
(function () {
    const sections = document.querySelectorAll('section');
    if (!sections.length) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
})();

/* Dark Mode Toggle */
(function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;

    const body = document.body;

    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
        darkModeToggle.setAttribute('aria-pressed', 'true');
    }

    darkModeToggle.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        darkModeToggle.textContent = isDark ? '☀️' : '🌙';
        darkModeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    });
})();

/* Portfolio Filter */
(function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (!filterButtons.length || !portfolioItems.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hide');
                    item.style.animation = 'fadeIn 0.5s ease';
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });
})();

/* Testimonials Slider */
(function () {
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-item');
    const testimonialDots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-btn.prev');
    const nextBtn = document.querySelector('.testimonial-btn.next');

    function showTestimonial(index) {
        if (!testimonials.length) return;
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });

        if (testimonialDots && testimonialDots.length) {
            testimonialDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!testimonials.length) return;
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!testimonials.length) return;
            currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
            showTestimonial(currentTestimonial);
        });
    }

    if (testimonialDots && testimonialDots.length) {
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentTestimonial = index;
                showTestimonial(currentTestimonial);
            });
        });
    }

    if (testimonials.length > 0) {
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }
})();

/* FAQ Accordion */
(function () {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!question) return;

        const toggle = () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(f => f.classList.remove('active'));
            faqItems.forEach(f => {
                const ans = f.querySelector('.faq-answer');
                if (ans) ans.hidden = true;
                const q = f.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                if (answer) answer.hidden = false;
                question.setAttribute('aria-expanded', 'true');
            }
        };

        question.addEventListener('click', toggle);
        question.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') toggle();
        });
    });
})();

/* Animated Statistics Counter */
(function () {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    function animateCounter(element, target) {
        let current = 0;
        const increment = Math.max(1, Math.floor(target / 100));
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target === 100 ? '%' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
            }
        }, 20);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'), 10) || 0;
                if (!entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target, target);
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
})();

/* Back to Top Button */
(function () {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('show', window.pageYOffset > 300);
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

/* Download Resume Button */
(function () {
    const downloadResumeBtn = document.getElementById('downloadResume');
    if (!downloadResumeBtn) return;

    downloadResumeBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const resumeContent = `
OKULLO ABDULSALAMA
Web Designer

CONTACT
Email: okulloabdulsalam@gmail.com
Phone: +256787749111
Location: Luzira, Kampala

PROFESSIONAL SUMMARY
Experienced web designer specializing in creating beautiful, 
functional, and user-friendly websites. Skilled in modern 
web technologies and design principles.

SKILLS
- Web Design
- Responsive Design
- HTML5, CSS3, JavaScript
- WordPress
- UI/UX Design

EXPERIENCE
Web Designer | Freelance
- Designed and developed websites for various clients
- Created responsive designs for all devices
- Collaborated with clients to bring their vision to life

EDUCATION
[Kampala International University]

PORTFOLIO
Visit: [okulloabdulsalam.github.io]
        `;

        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Okullo_Abdulsalama_Resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Resume download started! Note: This is a sample.');
    });
})();

/* Blog Read More Functionality */
(function () {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    if (!readMoreButtons.length) return;

    readMoreButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const blogItem = this.closest('.blog-item');
            if (!blogItem) return;
            const fullContent = blogItem.querySelector('.blog-full-content');
            const preview = blogItem.querySelector('.blog-preview');

            const currentlyHidden = fullContent && (fullContent.style.display === 'none' || fullContent.style.display === '');
            if (fullContent && preview) {
                if (currentlyHidden) {
                    fullContent.style.display = 'block';
                    preview.style.display = 'none';
                    this.textContent = 'Read Less ←';
                    this.classList.add('expanded');
                } else {
                    fullContent.style.display = 'none';
                    preview.style.display = 'block';
                    this.textContent = 'Read More →';
                    this.classList.remove('expanded');
                }
            }
        });
    });
})();
