class AirJetGame {
    constructor() {
        this.isGameRunning = false;
        this.currentCoefficient = 1.00;
        this.predictionHistory = [];
        this.animationId = null;
        this.flightDuration = 0;
        this.maxFlightTime = 5000;
        this.crashCoefficient = 1.00;
        this.particleInterval = null;
        
        this.initializeElements();
        this.createParticles();
        this.startLoadingScreen();
    }

    initializeElements() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.loadingProgress = document.getElementById('loading-progress');
        this.predictButton = document.getElementById('predict-button');
        this.coefficientDisplay = document.getElementById('coefficient-display');
        this.coefficientValue = document.getElementById('coefficient-value');
        this.plane = document.getElementById('plane');
        this.planeContainer = document.getElementById('plane-container');
        this.flightPath = document.getElementById('flight-path');
        this.planeTrail = document.getElementById('plane-trail');
        this.engineFire = document.getElementById('engine-fire');
        this.explosion = document.getElementById('explosion');
        this.crashSparks = document.getElementById('crash-sparks');
        this.coefficientSparks = document.getElementById('coefficient-sparks');
        this.particlesContainer = document.getElementById('particles');

        this.predictButton.addEventListener('click', () => this.startPrediction());
    }

    createParticles() {
        // Créer des particules d'arrière-plan
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 100);
        }
        
        // Continuer à créer des particules
        this.particleInterval = setInterval(() => {
            this.createParticle();
        }, 200);
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        this.particlesContainer.appendChild(particle);
        
        // Supprimer la particule après l'animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 10000);
    }

    startLoadingScreen() {
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += 2;
            this.loadingProgress.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    this.loadingScreen.style.opacity = '0';
                    this.loadingScreen.style.transition = 'opacity 1s ease';
                    setTimeout(() => {
                        this.loadingScreen.classList.add('hidden');
                        this.gameScreen.classList.remove('hidden');
                        this.gameScreen.style.opacity = '0';
                        this.gameScreen.style.transition = 'opacity 1s ease';
                        setTimeout(() => {
                            this.gameScreen.style.opacity = '1';
                        }, 50);
                    }, 1000);
                }, 500);
            }
        }, 100);
    }

    generateCrashCoefficient() {
        const random = Math.random() * 100;
        let coefficient;
        
        if (random < 95) {
            coefficient = 1.01 + Math.random() * (3.44 - 1.01);
        } else if (random < 99) {
            coefficient = 3.45 + Math.random() * (5.83 - 3.45);
        } else {
            coefficient = 5.84 + Math.random() * (8.96 - 5.84);
        }
        
        return Math.round(coefficient * 100) / 100;
    }

    createSparks(container, count = 8) {
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            
            const angle = (Math.PI * 2 * i) / count;
            const distance = 50 + Math.random() * 50;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            spark.style.setProperty('--spark-x', x + 'px');
            spark.style.setProperty('--spark-y', y + 'px');
            
            container.appendChild(spark);
            
            setTimeout(() => {
                if (spark.parentNode) {
                    spark.parentNode.removeChild(spark);
                }
            }, 1000);
        }
    }

    startPrediction() {
        if (this.isGameRunning) return;
        
        this.isGameRunning = true;
        this.predictButton.disabled = true;
        this.currentCoefficient = 1.00;
        this.flightDuration = 0;
        this.crashCoefficient = this.generateCrashCoefficient();
        
        // Calculer la durée de vol
        const baseDuration = 1000;
        const maxDuration = this.maxFlightTime;
        const coefficientFactor = Math.min(this.crashCoefficient / 8.96, 1);
        this.flightDuration = baseDuration + (maxDuration - baseDuration) * coefficientFactor;
        
        // Réinitialiser les éléments visuels
        this.resetVisualElements();
        
        // Démarrer l'animation
        this.startFlightAnimation();
        
        // Enregistrer dans l'historique
        this.predictionHistory.push({
            coefficient: this.crashCoefficient,
            timestamp: Date.now()
        });
        
        if (this.predictionHistory.length > 50) {
            this.predictionHistory.shift();
        }
    }

    resetVisualElements() {
        this.plane.classList.remove('flying', 'crashed');
        this.planeContainer.style.transform = 'translate(0, 0)';
        this.flightPath.style.width = '0px';
        this.planeTrail.style.width = '0px';
        this.coefficientValue.textContent = '1.00x';
        this.coefficientDisplay.classList.remove('growing');
        
        // Nettoyer les effets précédents
        this.coefficientSparks.innerHTML = '';
        this.explosion.style.opacity = '0';
        this.explosion.style.transform = 'scale(0)';
    }

    startFlightAnimation() {
        const startTime = Date.now();
        this.plane.classList.add('flying');
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / this.flightDuration, 1);
            
            // Mettre à jour le coefficient
            this.currentCoefficient = 1.00 + (this.crashCoefficient - 1.00) * progress;
            this.coefficientValue.textContent = this.currentCoefficient.toFixed(2) + 'x';
            
            // Animation de pulsation du coefficient
            this.coefficientDisplay.classList.add('growing');
            setTimeout(() => {
                this.coefficientDisplay.classList.remove('growing');
            }, 100);
            
            // Créer des étincelles occasionnelles
            if (Math.random() < 0.1) {
                this.createSparks(this.coefficientSparks, 3);
            }
            
            // Animer l'avion avec une trajectoire courbe
            const maxX = window.innerWidth * 0.6;
            const maxY = window.innerHeight * 0.4;
            const x = progress * maxX;
            const y = -progress * maxY + Math.sin(progress * Math.PI * 3) * 30;
            
            this.planeContainer.style.transform = `translate(${x}px, ${y}px)`;
            
            // Animer la trajectoire et la traînée
            this.flightPath.style.width = x + 'px';
            this.planeTrail.style.width = Math.min(x * 0.3, 100) + 'px';
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.crashPlane();
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    crashPlane() {
        this.plane.classList.remove('flying');
        this.plane.classList.add('crashed');
        
        // Afficher le coefficient final
        this.coefficientValue.textContent = this.crashCoefficient.toFixed(2) + 'x';
        
        // Effet d'explosion
        const planeRect = this.planeContainer.getBoundingClientRect();
        this.explosion.style.left = (planeRect.left + planeRect.width / 2 - 50) + 'px';
        this.explosion.style.top = (planeRect.top + planeRect.height / 2 - 50) + 'px';
        this.explosion.style.opacity = '1';
        this.explosion.style.transform = 'scale(1)';
        this.explosion.style.animation = 'explosionEffect 0.8s ease-out';
        
        // Créer des étincelles de crash
        this.createSparks(this.coefficientSparks, 12);
        
        // Effet de secousse de l'écran
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
        
        // Réactiver le bouton après 3 secondes
        setTimeout(() => {
            this.isGameRunning = false;
            this.predictButton.disabled = false;
            this.resetForNextRound();
        }, 3000);
    }

    resetForNextRound() {
        // Animation de transition douce
        this.plane.style.transition = 'all 1s ease';
        this.planeContainer.style.transition = 'all 1s ease';
        this.flightPath.style.transition = 'all 1s ease';
        this.planeTrail.style.transition = 'all 1s ease';
        
        // Réinitialiser pour le prochain tour
        this.plane.classList.remove('crashed');
        this.planeContainer.style.transform = 'translate(0, 0)';
        this.flightPath.style.width = '0px';
        this.planeTrail.style.width = '0px';
        this.coefficientValue.textContent = '1.00x';
        this.explosion.style.opacity = '0';
        
        // Supprimer les transitions après l'animation
        setTimeout(() => {
            this.plane.style.transition = '';
            this.planeContainer.style.transition = '';
            this.flightPath.style.transition = '';
            this.planeTrail.style.transition = '';
        }, 1000);
    }

    getStats() {
        if (this.predictionHistory.length === 0) return null;
        
        const coefficients = this.predictionHistory.map(p => p.coefficient);
        const avg = coefficients.reduce((a, b) => a + b, 0) / coefficients.length;
        const min = Math.min(...coefficients);
        const max = Math.max(...coefficients);
        
        const ranges = {
            low: coefficients.filter(c => c >= 1.01 && c <= 3.44).length,
            medium: coefficients.filter(c => c >= 3.45 && c <= 5.83).length,
            high: coefficients.filter(c => c >= 5.84 && c <= 8.96).length
        };
        
        return {
            total: this.predictionHistory.length,
            average: Math.round(avg * 100) / 100,
            min: min,
            max: max,
            ranges: ranges
        };
    }
}

// Ajouter l'effet de secousse
const shakeKeyframes = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = shakeKeyframes;
document.head.appendChild(styleSheet);

// Initialiser le jeu
document.addEventListener('DOMContentLoaded', () => {
    window.airJetGame = new AirJetGame();
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    if (window.airJetGame && !window.airJetGame.isGameRunning) {
        window.airJetGame.resetForNextRound();
    }
});

// Prévenir le zoom sur mobile
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Ajouter des effets sonores simulés (vibrations sur mobile)
function simulateSound(type) {
    if (navigator.vibrate) {
        switch(type) {
            case 'takeoff':
                navigator.vibrate([100, 50, 100]);
                break;
            case 'crash':
                navigator.vibrate([200, 100, 200, 100, 200]);
                break;
            case 'button':
                navigator.vibrate(50);
                break;
        }
    }
}

// Ajouter les vibrations aux événements
document.addEventListener('DOMContentLoaded', () => {
    const predictButton = document.getElementById('predict-button');
    if (predictButton) {
        predictButton.addEventListener('click', () => simulateSound('button'));
    }
});

