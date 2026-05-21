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
    document.getElementById('modalAuthorName').textContent = blogData.author;
    document.getElementById('modalAuthorRole').textContent = blogData.role;
    document.getElementById('modalAuthorAvatar').textContent = blogData.avatar;
    document.getElementById('modalAuthorAvatar').style.cssText = blogData.avatarStyle;

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

document.querySelectorAll('.post-card, .featured-card').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
});