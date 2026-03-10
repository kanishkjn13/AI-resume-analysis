document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-xmark');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // Modals Logic
    const authModal = document.getElementById('auth-modal');
    const modalClose = document.getElementById('modal-close');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    const navLoginBtn = document.getElementById('nav-login-btn');
    const navSignupBtn = document.getElementById('nav-signup-btn');

    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');

    const openModal = (type) => {
        authModal.classList.add('active');
        if (type === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            signupForm.classList.remove('hidden');
            loginForm.classList.add('hidden');
        }
        // close mobile menu if open
        navMenu.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.remove('fa-xmark');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
    };

    const closeModal = () => {
        authModal.classList.remove('active');
    };

    navLoginBtn.addEventListener('click', () => openModal('login'));
    navSignupBtn.addEventListener('click', () => openModal('signup'));

    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('signup');
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('login');
    });

    modalClose.addEventListener('click', closeModal);
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // User Session State Management
    const navAuthButtons = document.getElementById('nav-auth-buttons');
    const navUserProfile = document.getElementById('nav-user-profile');
    const currentUserName = document.getElementById('current-user-name');
    const navLogoutBtn = document.getElementById('nav-logout-btn');

    const handleLoginSuccess = (name) => {
        navAuthButtons.style.display = 'none';
        navUserProfile.classList.remove('hidden');
        currentUserName.innerText = name || "User";
    };

    navLogoutBtn.addEventListener('click', () => {
        navUserProfile.classList.add('hidden');
        navAuthButtons.style.display = 'flex';
    });

    // Form Submission Logic
    const handleFormSubmit = (formId, btnText, successText) => {
        const form = document.querySelector(`#${formId} form`);
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');

            // Extract mock name if signup form
            let mockName = "User";
            if (formId === 'signup-form') {
                const nameInput = document.getElementById('signup-name');
                if (nameInput) mockName = nameInput.value.split(' ')[0];
            } else if (formId === 'login-form') {
                const emailInput = document.getElementById('login-email');
                if (emailInput) {
                    mockName = emailInput.value.split('@')[0];
                    // Capitalize first letter
                    mockName = mockName.charAt(0).toUpperCase() + mockName.slice(1);
                }
            }

            // Mock Loading State
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Simulate API Call
            setTimeout(() => {
                // Success State
                submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${successText}`;
                submitBtn.style.background = '#27c93f';
                submitBtn.style.color = 'white';
                submitBtn.style.borderColor = '#27c93f';

                // Setup Logged-in Navbar State
                handleLoginSuccess(mockName);

                // Close Modal
                setTimeout(() => {
                    closeModal();
                    // Reset form back to default silently after closing
                    setTimeout(() => {
                        form.reset();
                        submitBtn.innerHTML = btnText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.background = '';
                        submitBtn.style.borderColor = '';
                    }, 400);
                }, 1000);
            }, 1000);
        });
    };

    handleFormSubmit('login-form', 'Login', 'Logged In!');
    handleFormSubmit('signup-form', 'Sign Up', 'Account Created!');

    // Custom Smooth Scrolling Engine with Easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            // Close mobile menu if open during scroll request
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-xmark');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            }

            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            // Subtract navbar height for offset (approx 80px)
            const offsetPosition = targetPosition - 100;
            const startPosition = window.scrollY;
            const distance = offsetPosition - startPosition;
            // Luxurious 1.2s duration
            const duration = 1200;
            let start = null;

            // Optional styling state on body while traversing
            document.body.style.pointerEvents = 'none';

            // Easing function: easeInOutQuart for a slow-fast-slow cinematic feel
            const easeInOutQuart = time => time < 0.5 ? 8 * time * time * time * time : 1 - Math.pow(-2 * time + 2, 4) / 2;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);

                window.scrollTo(0, startPosition + distance * easeInOutQuart(progress));

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    document.body.style.pointerEvents = 'auto';

                    // Trigger custom highlight visual for the resulting block
                    // Only apply if it's not the hero section since that's jarring
                    if (targetId !== '#hero') {
                        targetElement.classList.add('highlight-target');
                        setTimeout(() => {
                            targetElement.classList.remove('highlight-target');
                        }, 1200);
                    }
                }
            }

            requestAnimationFrame(animation);
        });
    });

    // Scroll reveal animation
    const fadeSections = document.querySelectorAll('.feature-card, .step, .upload-container, .section-title');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeSections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });

    // Futuristic Background Particles
    const particlesContainer = document.getElementById('particles');
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Randomize size, position, and duration
        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;

        const duration = Math.random() * 5 + 5;
        particle.style.animationDuration = `${duration}s`;

        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }
    setInterval(createParticle, 300);

    // AI Scanner Animation Controller
    const scannerLine = document.getElementById('scanner-line');
    const keywords = document.querySelectorAll('.keyword');
    const scanScore = document.getElementById('scan-score');
    const scanText = document.getElementById('scan-text');

    function runScanner() {
        // Reset
        keywords.forEach(k => k.classList.remove('active'));
        scanScore.innerText = '0';
        scanText.innerText = 'AI Scanning...';

        // Scanner Line sweep
        scannerLine.style.transition = 'none';
        scannerLine.style.top = '0%';

        setTimeout(() => {
            scannerLine.style.transition = 'top 3s ease-in-out';
            scannerLine.style.top = '100%';
        }, 50);

        // Keywords appearance mapped to delay attributes
        keywords.forEach(k => {
            const delay = parseInt(k.getAttribute('data-delay') || '1000');
            setTimeout(() => {
                k.classList.add('active');
            }, delay);
        });

        // Score interpolation
        let score = 0;
        const targetScore = 92;
        const interval = setInterval(() => {
            score += Math.floor(Math.random() * 3) + 1;
            if (score >= targetScore) {
                score = targetScore;
                clearInterval(interval);
                scanText.innerText = 'Analysis Complete';
                scanText.style.color = '#27c93f';
                setTimeout(runScanner, 4000); // Loop the entire sequence
            }
            scanScore.innerText = score.toString();
        }, 40);
    }

    setTimeout(runScanner, 1000);

    // Initialize 3D Depth (VanillaTilt)
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".feature-card, .step"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            perspective: 1000
        });

        VanillaTilt.init(document.querySelector(".hero-image img"), {
            max: 5,
            speed: 1000,
            glare: true,
            "max-glare": 0.4,
            perspective: 1500
        });

        VanillaTilt.init(document.querySelector(".upload-container"), {
            max: 8,
            speed: 600,
            glare: true,
            "max-glare": 0.15,
            scale: 1.02
        });
    }
 
     // Feature Cards Mouse Tracking (for glow effect)
     const featureCards = document.querySelectorAll('.feature-card');
     featureCards.forEach(card => {
         card.addEventListener('mousemove', (e) => {
             const rect = card.getBoundingClientRect();
             const x = e.clientX - rect.left;
             const y = e.clientY - rect.top;
             
             card.style.setProperty('--mouse-x', `${x}px`);
             card.style.setProperty('--mouse-y', `${y}px`);
         });
     });
 
     // File Upload Drag & Drop Configuration
    const uploadBox = document.getElementById('upload-box');
    const fileInput = document.getElementById('file-input');
    const uploadContentDefault = document.getElementById('upload-content-default');
    const uploadText = document.getElementById('upload-text');
    const uploadIcon = document.getElementById('upload-icon');
    const uploadSubtext = document.getElementById('upload-subtext');

    // Success State Elements
    const uploadSuccessMsg = document.getElementById('upload-success-msg');
    const uploadedFilename = document.getElementById('uploaded-filename');
    const scanProgressFill = document.getElementById('scan-progress-fill');
    const scanStatusText = document.getElementById('scan-status-text');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadBox.addEventListener(eventName, () => {
            uploadBox.classList.add('dragover');
            if (uploadText) uploadText.innerText = "Drop it now!";
            if (uploadSubtext) uploadSubtext.style.opacity = '0';
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, () => {
            uploadBox.classList.remove('dragover');
            if (uploadText) uploadText.innerText = "Drag & Drop your resume here";
            if (uploadSubtext) uploadSubtext.style.opacity = '1';
        }, false);
    });

    uploadBox.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', function () {
        if (this.files) {
            handleFiles(this.files);
        }
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const fileName = files[0].name;

            // Validate extension
            const validExts = ['.pdf', '.doc', '.docx'];
            const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
            if (!validExts.includes(fileExt)) {
                if (uploadText) {
                    uploadText.innerText = "Invalid format. Try PDF or DOCX.";
                    uploadText.style.color = "#ff5f56";
                }
                if (uploadIcon) {
                    uploadIcon.className = "fa-solid fa-circle-xmark upload-icon";
                    uploadIcon.style.color = "#ff5f56";
                }
                setTimeout(() => {
                    if (uploadText) {
                        uploadText.innerText = "Drag & Drop your resume here";
                        uploadText.style.color = "";
                    }
                    if (uploadIcon) {
                        uploadIcon.className = "fa-solid fa-cloud-arrow-up upload-icon";
                        uploadIcon.style.color = "";
                    }
                }, 3000);
                return;
            }

            // Transform UI to "success / loading" state
            if (uploadedFilename) uploadedFilename.innerText = fileName;
            if (uploadContentDefault) uploadContentDefault.style.opacity = '0';

            setTimeout(() => {
                if (uploadSuccessMsg) uploadSuccessMsg.classList.remove('hidden');
                simulateScanProgress();
            }, 300);

            // Disable further file inputs temporarily
            fileInput.disabled = true;
            uploadBox.style.pointerEvents = 'none';
        }
    }

    function simulateScanProgress() {
        let progress = 0;
        if (scanProgressFill) scanProgressFill.style.width = '0%';
        if (scanStatusText) scanStatusText.innerText = "Extracting text from document...";

        const interval = setInterval(() => {
            progress += Math.random() * 8;
            if (progress > 100) progress = 100;

            if (scanProgressFill) scanProgressFill.style.width = `${progress}%`;

            // Update status text based on progress
            if (progress > 30 && progress < 60) {
                if (scanStatusText) scanStatusText.innerText = "Analyzing keywords & ML matching...";
            } else if (progress >= 60 && progress < 90) {
                if (scanStatusText) scanStatusText.innerText = "Generating ATS compatibility score...";
            } else if (progress === 100) {
                clearInterval(interval);
                if (scanStatusText) {
                    scanStatusText.innerText = "Analysis Complete!";
                    scanStatusText.style.color = "#27c93f";
                }

                // Show Page Transition Overlay after a short delay
                setTimeout(() => {
                    const pageLoader = document.getElementById('page-loader');
                    if (pageLoader) pageLoader.classList.add('active');
                    
                    // Redirect after transition animation
                    setTimeout(() => {
                        window.location.href = 'results.html';
                    }, 2000); 
                }, 1000);
            }
        }, 300);
    }

    // Try Demo Logic
    const btnDemo = document.getElementById('btn-demo');
    if (btnDemo) {
        btnDemo.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Scroll to upload section
            const uploadSection = document.getElementById('upload');
            if (uploadSection) {
                const targetPosition = uploadSection.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }

            // Simulate demo upload after short scroll delay
            setTimeout(() => {
                const fileName = "Demo_Resume_Sample.pdf";
                
                // Transform UI
                if (uploadedFilename) uploadedFilename.innerText = fileName;
                if (uploadContentDefault) uploadContentDefault.style.opacity = '0';
                
                setTimeout(() => {
                    if (uploadSuccessMsg) uploadSuccessMsg.classList.remove('hidden');
                    simulateScanProgress();
                }, 400);

                // Disable UI
                fileInput.disabled = true;
                uploadBox.style.pointerEvents = 'none';
            }, 800);
        });
    }

    function resetUploadArea() {
        if (uploadSuccessMsg) uploadSuccessMsg.classList.add('hidden');
        setTimeout(() => {
            if (uploadContentDefault) uploadContentDefault.style.opacity = '1';
            fileInput.disabled = false;
            fileInput.value = ''; // clear input
            uploadBox.style.pointerEvents = 'auto';
            if (scanProgressFill) scanProgressFill.style.width = '0%';
            if (scanStatusText) {
                scanStatusText.innerText = "Preparing AI models...";
                scanStatusText.style.color = "var(--accent-secondary)";
            }
        }, 400);
    }
});
