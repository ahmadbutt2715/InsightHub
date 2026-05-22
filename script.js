// ── Progress bar
window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / total) * 100;
    document.getElementById('progress-bar').style.width = pct + '%';
    const bt = document.getElementById('back-top');
    window.scrollY > 400 ? bt.classList.add('visible') : bt.classList.remove('visible');
});

// ── Blog Modal
function openBlogModal(blogData) {
    const modal = document.getElementById('blogModal');
    document.getElementById('modalTitle').textContent = blogData.title;
    document.getElementById('modalTag').textContent = blogData.tag;
    document.getElementById('modalTag').className = `tag ${blogData.tagClass}`;
    document.getElementById('modalReadTime').textContent = blogData.readTime + ' read';
    document.getElementById('modalDate').textContent = blogData.date;
    document.getElementById('modalBody').innerHTML = blogData.content;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

// Close modal on background click
document.getElementById('blogModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('blogModal')) closeBlogModal();
});

// Close modal on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBlogModal();
});

// ── Navigation Links Active State
document.querySelectorAll('.nav-links a, .mobile-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
        }
        const text = this.textContent.trim();
        document.querySelectorAll('.nav-links a, .mobile-links a').forEach(l => {
            if (l.textContent.trim() === text) {
                l.classList.add('active');
            } else {
                l.classList.remove('active');
            }
        });

        // Close mobile menu on link click
        const menu = document.getElementById('mobileMenu');
        const btn = document.getElementById('hamburger');
        if (menu && menu.classList.contains('open')) {
            menu.classList.remove('open');
            if (btn) btn.classList.remove('open');
        }
    });
});

// ── Hamburger

function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn = document.getElementById('hamburger');
    menu.classList.toggle('open');
    btn.classList.toggle('open');
}

// ── Search overlay
function openSearch() {
    document.getElementById('searchOverlay').classList.add('open');
    setTimeout(() => document.getElementById('overlaySearch').focus(), 100);
}
function closeSearch() {
    document.getElementById('searchOverlay').classList.remove('open');
}
document.getElementById('searchOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('searchOverlay')) closeSearch();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

function filterCat(btn) {
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.dataset.filter;
    const cards = document.querySelectorAll('.featured-card, .post-card');
    
    cards.forEach(card => {
        if (filter === 'all') {
            if (card.hasAttribute('data-extra') && card.dataset.loaded !== 'true') {
                card.style.display = 'none';
            } else {
                card.style.display = '';
            }
        } else {
            if (card.dataset.category === filter) {
                card.style.display = card.classList.contains('post-card') ? 'flex' : 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });

    const loadMoreWrap = document.querySelector('.load-more-wrap');
    if (loadMoreWrap) {
        loadMoreWrap.style.display = filter === 'all' ? '' : 'none';
    }
}

// ── Load more

function loadMore() {
    const extras = document.querySelectorAll('[data-extra]:not([data-loaded="true"])');
    let shown = 0;
    extras.forEach(el => {
        el.style.display = 'flex';
        el.dataset.loaded = 'true';
        shown++;
    });
    if (shown === 0 || document.querySelectorAll('[data-extra]:not([data-loaded="true"])').length === 0) {
        document.getElementById('loadMoreBtn').textContent = 'You\'re all caught up! ✓';
        document.getElementById('loadMoreBtn').style.opacity = '0.5';
        document.getElementById('loadMoreBtn').style.cursor = 'default';
    }
}

// ── Subscribe
function handleSubscribe(btn) {
    const input = btn.previousElementSibling;
    if (!input.value || !input.value.includes('@')) {
        input.style.background = 'rgba(234,67,53,0.25)';
        input.placeholder = 'Please enter a valid email';
        return;
    }
    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#e6f4ea';
    btn.style.color = '#34A853';
    input.disabled = true;
}

// ── Lazy fade-in for cards on scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.animationPlayState = 'running';
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.post-card, .featured-card, .mv-card, .value-card, .timeline-item, .team-card, .contact-card, .contact-form-container').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});

// ── Dynamic Trending Now Section
document.addEventListener('DOMContentLoaded', () => {
    const trendingList = document.querySelector('.trending-list');
    if (!trendingList) return;

    // Get all article cards (featured and normal posts)
    const cards = Array.from(document.querySelectorAll('.featured-card, .post-card'));
    if (cards.length === 0) return;

    // Clear existing static placeholder list items
    trendingList.innerHTML = '';

    // Take the top 3 articles to show as trending
    const trendingCount = Math.min(3, cards.length);
    const selectedCards = cards.slice(0, trendingCount);

    // Dynamic metadata to make the items feel realistic
    const metaStats = [
        { views: '48K views', time: '1 day ago' },
        { views: '36K views', time: '2 days ago' },
        { views: '24K views', time: '3 days ago' }
    ];

    selectedCards.forEach((card, index) => {
        const titleEl = card.querySelector('.featured-title, .post-title');
        if (!titleEl) return;

        const titleText = titleEl.textContent.trim();
        const stats = metaStats[index] || { views: '10K views', time: '1 week ago' };

        const li = document.createElement('li');
        li.className = 'trending-item';
        li.innerHTML = `
            <div class="trending-num">0${index + 1}</div>
            <div class="trending-content">
                <div class="trending-title">${titleText}</div>
                <div class="trending-meta">${stats.views} · ${stats.time}</div>
            </div>
        `;

        // Clicking the trending item triggers the click event on the corresponding article card
        li.addEventListener('click', () => {
            card.click();
        });
        
        trendingList.appendChild(li);
    });
});

// ── Contact Form Submission Handler
function handleContactSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('contactForm');
    const container = form.parentElement;
    const nameVal = document.getElementById('contactName').value;
    
    // Animate container swap to a beautiful success glass card
    container.innerHTML = `
        <div class="contact-success-card">
            <div class="success-icon-anim">✓</div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out, <strong>${nameVal}</strong>. I have received your message and will get back to you within 24 hours.</p>
            <button class="btn btn-primary btn-success-reset" onclick="resetContactForm()">Send Another Message</button>
        </div>
    `;
}

function resetContactForm() {
    window.location.reload();
}

// ── Auth Modal Logic
function openAuthModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    
    // Reset modal states
    const tabs = modal.querySelector('.auth-tabs');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const successCard = document.getElementById('authSuccess');
    
    tabs.style.display = 'grid';
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    successCard.classList.remove('active');
    
    loginForm.reset();
    signupForm.reset();
    
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    switchAuthTab(tab);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

function switchAuthTab(tab) {
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (tab === 'login') {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        loginForm.style.display = 'flex';
        signupForm.style.display = 'none';
        
        setTimeout(() => document.getElementById('loginEmail')?.focus(), 100);
    } else {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        signupForm.style.display = 'flex';
        loginForm.style.display = 'none';
        
        setTimeout(() => document.getElementById('signupName')?.focus(), 100);
    }
}

function togglePasswordVisibility(inputId, toggleBtn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const eyeOpenSvg = `<svg class="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeClosedSvg = `<svg class="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"/></svg>`;
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.innerHTML = eyeClosedSvg;
    } else {
        input.type = 'password';
        toggleBtn.innerHTML = eyeOpenSvg;
    }
}

function handleAuthSubmit(event, type) {
    event.preventDefault();
    
    const modal = document.getElementById('authModal');
    const tabs = modal.querySelector('.auth-tabs');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const successCard = document.getElementById('authSuccess');
    const successTitle = document.getElementById('authSuccessTitle');
    const successDesc = document.getElementById('authSuccessDesc');
    
    // Smooth transition
    tabs.style.display = 'none';
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    
    if (type === 'login') {
        const email = document.getElementById('loginEmail').value;
        const username = email.split('@')[0];
        // Capitalize first letter of username
        const displayName = username.charAt(0).toUpperCase() + username.slice(1);
        
        successTitle.textContent = `Welcome Back, ${displayName}!`;
        successDesc.innerHTML = 'You have successfully signed in to your **InsightHub** dashboard.';
    } else {
        const fullName = document.getElementById('signupName').value;
        successTitle.textContent = 'Account Created!';
        successDesc.innerHTML = `Welcome to the community, <strong>${fullName}</strong>. Your premium reader profile is now active!`;
    }
    
    successCard.classList.add('active');
    
    // Automatically close modal after 3.2 seconds
    setTimeout(() => {
        closeAuthModal();
    }, 3200);
}

// Backdrop listener for Auth Modal
document.getElementById('authModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('authModal')) closeAuthModal();
});

// Escape key listener for all overlays
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeBlogModal();
        closeSearch();
        closeAuthModal();
    }
});