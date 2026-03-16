document.addEventListener('DOMContentLoaded', () => {
    const loginWrapper = document.getElementById('login-wrapper');
    const signupWrapper = document.getElementById('signup-wrapper');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');

    const loginForm = document.getElementById('standalone-login-form');
    const signupForm = document.getElementById('standalone-signup-form');

    // Simple Alert Helper
    const showAlert = (message, type = 'error') => {
        const existingAlert = document.querySelector('.auth-alert');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = `auth-alert ${type}`;
        alert.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> <span>${message}</span>`;
        
        const activeWrapper = !loginWrapper.classList.contains('hidden') ? loginWrapper : signupWrapper;
        activeWrapper.querySelector('.form-header').after(alert);

        setTimeout(() => alert.remove(), 4000);
    };

    // Switch between Login and Signup
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginWrapper.classList.add('hidden');
        setTimeout(() => {
            signupWrapper.classList.remove('hidden');
            signupWrapper.style.opacity = '1';
            signupWrapper.style.transform = 'translateY(0)';
        }, 100);
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupWrapper.classList.add('hidden');
        setTimeout(() => {
            loginWrapper.classList.remove('hidden');
            loginWrapper.style.opacity = '1';
            loginWrapper.style.transform = 'translateY(0)';
        }, 100);
    });

    // Handle Signup
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = signupForm.querySelector('.auth-submit-btn');
        const name = signupForm.querySelector('input[type="text"]').value;
        const email = signupForm.querySelector('input[type="email"]').value;
        const password = signupForm.querySelector('input[type="password"]').value;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Creating...</span>';

        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('rv_users') || '[]');
            if (users.find(u => u.email === email)) {
                showAlert('Account already exists with this email.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Get Started</span> <i class="fa-solid fa-sparkles"></i>';
                return;
            }

            users.push({ name, email, password });
            localStorage.setItem('rv_users', JSON.stringify(users));

            submitBtn.style.background = '#22c55e';
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Account Created!</span>';
            
            setTimeout(() => {
                signupWrapper.classList.add('hidden');
                loginWrapper.classList.remove('hidden');
                showAlert('Account created. Please sign in.', 'success');
            }, 1000);
        }, 1500);
    });

    // Handle Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = loginForm.querySelector('.auth-submit-btn');
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Checking...</span>';

        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('rv_users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                showAlert('Invalid email or account does not exist.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Sign In</span> <i class="fa-solid fa-arrow-right"></i>';
                return;
            }

            // Success
            localStorage.setItem('rv_currentUser', JSON.stringify({ name: user.name, email: user.email }));
            
            submitBtn.style.background = '#22c55e';
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Success!</span>';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
    });

    // Animated background mouse interaction
    document.addEventListener('mousemove', (e) => {
        const sphere = document.querySelector('.glow-sphere');
        if (!sphere) return;
        const x = (e.clientX / window.innerWidth) * 50;
        const y = (e.clientY / window.innerHeight) * 50;
        
        sphere.style.transform = `translate(${x}px, ${y}px)`;
    });
});
