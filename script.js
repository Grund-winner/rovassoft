// Fonction de redirection
function redirectTo(page) {
    // Animation de sortie avant redirection
    const clickedCard = event.target.closest('.game-card');
    if (clickedCard) {
        clickedCard.style.transform = 'scale(0.9)';
        clickedCard.style.opacity = '0.7';
        
        setTimeout(() => {
            window.location.href = page;
        }, 200);
    } else {
        window.location.href = page;
    }
}

// Animations au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Animation du titre
    const title = document.querySelector('.title');
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            title.style.transition = 'all 0.8s ease-out';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 300);
    }

    // Gestion des interactions tactiles
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach((card, index) => {
        // Animation d'apparition échelonnée
        card.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        
        // Gestion du touch
        let touchStartTime = 0;
        let touchStartY = 0;
        
        card.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            touchStartY = e.touches[0].clientY;
            
            // Effet de pression
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease-out';
        }, { passive: true });
        
        card.addEventListener('touchend', function(e) {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            
            // Restaurer l'état normal
            this.style.transform = '';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Si c'est un tap rapide (pas un scroll)
            if (touchDuration < 300) {
                const button = this.querySelector('.play-button');
                if (button) {
                    button.click();
                }
            }
        }, { passive: true });
        
        card.addEventListener('touchmove', function(e) {
            const touchMoveY = e.touches[0].clientY;
            const deltaY = Math.abs(touchMoveY - touchStartY);
            
            // Si l'utilisateur fait défiler, annuler l'effet de pression
            if (deltaY > 10) {
                this.style.transform = '';
            }
        }, { passive: true });
    });

    // Effet de parallaxe léger sur le fond étoilé
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.body;
        const speed = scrolled * 0.5;
        
        parallax.style.transform = `translateY(${speed}px)`;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });

    // Animation des boutons au survol/touch
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        }, { passive: true });
    });

    // Gestion de l'orientation
    function handleOrientationChange() {
        // Forcer le recalcul du layout après changement d'orientation
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    }
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Prévenir le zoom sur double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Animation de pulsation pour les cartes importantes
    function addPulseAnimation() {
        const featuredCards = document.querySelectorAll('[data-game="mines-new"], [data-game="aviator"]');
        
        featuredCards.forEach(card => {
            setInterval(() => {
                card.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
                setTimeout(() => {
                    card.style.boxShadow = '';
                }, 1000);
            }, 5000);
        });
    }
    
    // Démarrer les animations après un délai
    setTimeout(addPulseAnimation, 2000);
});

// Gestion des erreurs de chargement d'images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Créer un placeholder en cas d'erreur de chargement
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.cssText = `
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
            `;
            placeholder.textContent = 'IMAGE';
            
            this.parentNode.replaceChild(placeholder, this);
        });
    });
});

// Performance: Lazy loading pour les animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observer les cartes pour les animations
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.game-card');
    cards.forEach(card => observer.observe(card));
});

