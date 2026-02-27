$(document).ready(function () {
    const portfolioApp = {
        init() {
            this.handleHeader();
            this.handleScrollSpy();
            this.handleScrollReveal();
            this.handleTyping();
            this.initParticles();
            this.handleSmoothScroll();
            this.handleUniversalHovers();
            this.handleContactForm();
        },

        initParticles() {
            if (typeof particlesJS !== 'undefined') {
                particlesJS('particles-js', {
                    "particles": {
                        "number": { "value": 50, "density": { "enable": true, "value_area": 800 } },
                        "color": { "value": "#73fdd2" },
                        "shape": { "type": "circle" },
                        "opacity": { "value": 0.3, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
                        "size": { "value": 2, "random": true, "anim": { "enable": true, "speed": 1, "size_min": 0.1, "sync": false } },
                        "line_linked": { "enable": true, "distance": 150, "color": "#73fdd2", "opacity": 0.15, "width": 1 },
                        "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                        "modes": { "grab": { "distance": 180, "line_linked": { "opacity": 0.8 } }, "push": { "particles_nb": 3 } }
                    },
                    "retina_detect": true
                });
            }
        },

        handleHeader() {
            const $header = $('header');
            $(window).on('scroll', function () {
                if ($(window).scrollTop() > 50) {
                    $header.addClass('scrolled');
                } else {
                    $header.removeClass('scrolled');
                }
            });
        },

        handleScrollSpy() {
            const $navLinks = $('.nav-link');
            const $sections = $('section[id]');

            $(window).on('scroll', function () {
                let currentSectionId = '';
                const scrollPos = $(window).scrollTop() + 100;

                $sections.each(function () {
                    const top = $(this).offset().top;
                    const height = $(this).outerHeight();
                    if (scrollPos >= top && scrollPos < top + height) {
                        currentSectionId = $(this).attr('id');
                    }
                });

                $navLinks.removeClass('active');
                if (currentSectionId) {
                    $(`.nav-link[href="#${currentSectionId}"]`).addClass('active');
                }
            });
        },

        handleScrollReveal() {
            const $revealElements = $('.reveal');

            const checkReveal = () => {
                const windowHeight = $(window).height();
                const scrollPos = $(window).scrollTop();
                const threshold = scrollPos + windowHeight * 0.9;

                $revealElements.each(function () {
                    if (!$(this).hasClass('active')) {
                        const elementTop = $(this).offset().top;
                        if (threshold > elementTop) {
                            $(this).addClass('active');
                        }
                    }
                });
            };

            let scrollTimeout;
            $(window).on('scroll', () => {
                if (!scrollTimeout) {
                    scrollTimeout = setTimeout(() => {
                        checkReveal();
                        scrollTimeout = null;
                    }, 20); // Throttled to ~50fps
                }
            });
            checkReveal(); // Run on init
        },

        handleTyping() {
            const $typingText = $('.typed-text');
            if (!$typingText.length) return;

            const titles = ["Full Stack Developer.", "Node.js Expert."];
            let titleIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

            function type() {
                const currentTitle = titles[titleIndex];
                if (isDeleting) {
                    $typingText.text(currentTitle.substring(0, charIndex - 1));
                    charIndex--;
                    typingSpeed = 50;
                } else {
                    $typingText.text(currentTitle.substring(0, charIndex + 1));
                    charIndex++;
                    typingSpeed = 100;
                }

                if (!isDeleting && charIndex === currentTitle.length) {
                    isDeleting = true;
                    typingSpeed = 2000;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    titleIndex = (titleIndex + 1) % titles.length;
                    typingSpeed = 500;
                }
                setTimeout(type, typingSpeed);
            }
            type();
        },

        handleUniversalHovers() {
            // Universal Card Hover Logic
            $('.box-blog, .cert-card, .work-card').hover(
                function () { $(this).addClass('jq-hover'); },
                function () { $(this).removeClass('jq-hover'); }
            );
        },

        handleSmoothScroll() {
            $('.footer-nav-link').on('click', function (e) { //a[href^="#"]
                const target = this.hash;
                if (target) {
                    const $target = $(target);
                    if ($target.length) {
                        e.preventDefault();
                        $('html, body').animate({
                            scrollTop: $target.offset().top - 80
                        }, 800);
                    }
                }
            });
        },

        handleContactForm() {
            const $form = $('#contact form');
            if (!$form.length) return;

            $form.on('submit', async (e) => {
                e.preventDefault();
                const data = {
                    name: `${$form.find('input[placeholder="First Name"]').val()} ${$form.find('input[placeholder="Last Name"]').val()}`,
                    email: $form.find('input[type="email"]').val() || $form.find('input[name="email"]').val() || $form.find('input[placeholder="Email Address"]').val(),
                    message: $form.find('textarea').val() || $form.find('textarea[name="message"]').val()
                };

                const $btn = $form.find('button, .cont-btn');
                const originalText = $btn.text();
                $btn.text('Sending...').prop('disabled', true);

                try {
                    const response = await fetch('http://localhost:3006/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const result = await response.json();
                    if (result.success) {
                        alert(result.message);
                        $form[0].reset();
                    } else {
                        alert('Something went wrong.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Backend connection error.');
                } finally {
                    $btn.text(originalText).prop('disabled', false);
                }
            });
        }
    };

    portfolioApp.init();
});
