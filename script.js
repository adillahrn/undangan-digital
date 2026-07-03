/* ====================================
   WEDDING INVITATION - MAIN SCRIPT
   M23 Template Structure
   ==================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ===== INITIALIZE AOS =====
    AOS.init({
        duration: 1000,
        once: true,
        offset: 80,
        easing: 'ease-out-cubic'
    });

    // ===== GET GUEST NAME FROM URL =====
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    const guestNameEl = document.getElementById('guestName');

    if (guestName && guestNameEl) {
        guestNameEl.textContent = decodeURIComponent(guestName.replace(/\+/g, ' '));
    }

    // ===== COVER / OPEN INVITATION =====
    const cover = document.getElementById('cover');
    const btnOpen = document.getElementById('btnOpen');
    const mainContent = document.getElementById('mainContent');
    const musicPlayer = document.getElementById('musicPlayer');
    const bottomNav = document.getElementById('bottomNav');
    const bgMusic = document.getElementById('bgMusic');

    // Lock scroll initially
    document.body.classList.add('no-scroll');

    if (btnOpen) {
        btnOpen.addEventListener('click', function () {
            // Hide cover
            cover.classList.add('hidden');
            // Unlock scroll
            document.body.classList.remove('no-scroll');
            // Show music player & nav
            musicPlayer.classList.add('show');
            bottomNav.classList.add('show');
            // Play music
            playMusic();
            // Start particles
            createParticles();
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Remove cover from DOM after transition
            setTimeout(() => {
                cover.style.display = 'none';
            }, 1500);
        });
    }

    // ===== MUSIC PLAYER =====
    const btnMusic = document.getElementById('btnMusic');
    const musicIcon = document.getElementById('musicIcon');
    let isMusicPlaying = false;

    function playMusic() {
        if (bgMusic) {
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                if (btnMusic) btnMusic.classList.add('playing');
                if (musicIcon) musicIcon.className = 'fas fa-music';
            }).catch(err => {
                console.log('Autoplay prevented:', err);
                isMusicPlaying = false;
                if (btnMusic) btnMusic.classList.remove('playing');
                if (musicIcon) musicIcon.className = 'fas fa-volume-mute';
            });
        }
    }

    function pauseMusic() {
        if (bgMusic) {
            bgMusic.pause();
            isMusicPlaying = false;
            if (btnMusic) btnMusic.classList.remove('playing');
            if (musicIcon) musicIcon.className = 'fas fa-volume-mute';
        }
    }

    if (btnMusic) {
        btnMusic.addEventListener('click', function () {
            if (isMusicPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        });
    }

    // Handle tab visibility
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') {
            if (bgMusic && !bgMusic.paused) {
                bgMusic.pause();
            }
        } else if (document.visibilityState === 'visible') {
            if (isMusicPlaying && bgMusic && bgMusic.paused) {
                bgMusic.play().catch(() => {});
            }
        }
    });

    // ===== COUNTDOWN TIMER =====
    const weddingDate = new Date('2026-07-16T08:00:00+07:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ===== SWIPER GALLERY =====
    const gallerySwiper = new Swiper('.gallery-swiper', {
        slidesPerView: 1.3,
        centeredSlides: true,
        spaceBetween: 15,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            480: {
                slidesPerView: 1.5,
                spaceBetween: 20,
            },
        },
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2,
            slideShadows: false,
        },
    });

    // ===== GIFT SECTION TOGGLE =====
    const btnGiftToggle = document.getElementById('btnGiftToggle');
    const giftCards = document.getElementById('giftCards');

    if (btnGiftToggle && giftCards) {
        btnGiftToggle.addEventListener('click', function () {
            giftCards.classList.toggle('show');
            if (giftCards.classList.contains('show')) {
                btnGiftToggle.innerHTML = '<i class="fas fa-times"></i> TUTUP';
            } else {
                btnGiftToggle.innerHTML = '<i class="fas fa-gift"></i> KLIK DISINI';
            }
        });
    }

    // ===== COPY TO CLIPBOARD =====
    window.copyToClipboard = function (elementId, btn) {
        const el = document.getElementById(elementId);
        const text = el.innerText || el.textContent;

        navigator.clipboard.writeText(text).then(() => {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Berhasil disalin!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Berhasil disalin!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('copied');
            }, 2000);
        });
    };

    // ===== RSVP / GUEST BOOK =====
    let comments = [];
    let stats = { hadir: 0, tidak: 0, ragu: 0 };

    function fetchComments() {
        fetch('/api/comments')
            .then(res => res.json())
            .then(data => {
                comments = data;
                updateStats();
                renderComments();
            })
            .catch(err => console.error('Error fetching comments:', err));
    }

    function updateStats() {
        stats = { hadir: 0, tidak: 0, ragu: 0 };
        comments.forEach(c => {
            if (c.attendance === 'Hadir') stats.hadir++;
            else if (c.attendance === 'Tidak Hadir') stats.tidak++;
            else stats.ragu++;
        });
        document.getElementById('countHadir').textContent = stats.hadir;
        document.getElementById('countTidak').textContent = stats.tidak;
        document.getElementById('countRagu').textContent = stats.ragu;
    }

    function renderComments() {
        const list = document.getElementById('commentsList');
        list.innerHTML = '';

        const sorted = [...comments].reverse();
        sorted.forEach(c => {
            const initial = c.name.charAt(0).toUpperCase();
            let badgeClass = 'ragu';
            if (c.attendance === 'Hadir') badgeClass = 'hadir';
            else if (c.attendance === 'Tidak Hadir') badgeClass = 'tidak';

            const item = document.createElement('div');
            item.className = 'comment-item';
            item.innerHTML = `
                <div class="comment-avatar">${initial}</div>
                <div class="comment-body">
                    <div class="comment-header">
                        <span class="comment-name">${escapeHtml(c.name)}</span>
                        <span class="comment-badge ${badgeClass}">${c.attendance}</span>
                    </div>
                    <p class="comment-text">${escapeHtml(c.message)}</p>
                    <span class="comment-date">${c.date || ''}</span>
                </div>
            `;
            list.appendChild(item);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    fetchComments(); // Initial load

    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('rsvpName').value.trim();
            const message = document.getElementById('rsvpMessage').value.trim();
            const attendance = document.getElementById('rsvpAttendance').value;

            if (!name || !message || !attendance) return;

            const now = new Date();
            const dateStr = now.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const comment = { name, message, attendance, date: dateStr };

            // Show loading state
            const btn = rsvpForm.querySelector('.btn-submit');
            const origText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            btn.disabled = true;

            fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comment)
            })
            .then(res => res.json())
            .then(data => {
                comments.push(data);
                updateStats();
                renderComments();
                rsvpForm.reset();

                // Show success feedback
                btn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
                btn.style.background = '#3D9A62';
                setTimeout(() => {
                    btn.innerHTML = origText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 2000);
            })
            .catch(err => {
                console.error('Error saving comment:', err);
                btn.innerHTML = origText;
                btn.disabled = false;
                alert('Gagal mengirim ucapan, coba lagi.');
            });
        });
    }

    // ===== GALLERY LIGHTBOX (Swiper slides) =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    // Delegate click on swiper slide images
    document.querySelector('.gallery-swiper')?.addEventListener('click', function (e) {
        const img = e.target.closest('img');
        if (img) {
            lightboxImg.src = img.src;
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // ESC key to close lightbox
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });

    // ===== BOTTOM NAVIGATION ACTIVE STATE =====
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section[id]');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === current) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Smooth scroll for nav
    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== FLOATING PARTICLES =====
    function createParticles() {
        const container = document.getElementById('floatingElements');
        if (!container) return;
        const particleCount = 25;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';

            const size = Math.random() * 5 + 3;
            const left = Math.random() * 100;
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 10;

            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = left + '%';
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = delay + 's';
            particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';

            container.appendChild(particle);
        }
    }

    // ===== PARALLAX EFFECT ON HERO =====
    window.addEventListener('scroll', function () {
        const hero = document.querySelector('.hero-section');
        if (hero) {
            const scroll = window.scrollY;
            hero.style.backgroundPositionY = scroll * 0.4 + 'px';
        }
    });

});
