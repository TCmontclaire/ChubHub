// Flash Website Interactive JavaScript

class FlashWebsite {
    constructor() {
        this.currentSection = 0;
        this.sections = ['who-is-flash', 'speed-feats', 'speed-force', 'race-game', 'multiverse', 'flash-facts', 'reading-order'];
        this.raceGame = null;
        this.cursorTrail = [];
        this.init();
    }

    init() {
        this.setupIntroScreen();
        this.setupNavigation();
        this.setupComicPanel();
        this.setupSpeedCards();
        this.setupSpeedForce();
        this.setupRaceGame();
        this.setupMultiverse();
        this.setupFlashFacts();
        this.setupCursorTrail();
        this.setupMobileOptimizations();
        this.setupSoundEffects();
    }

    // Intro Screen Functionality
    setupIntroScreen() {
        const enterBtn = document.getElementById('enter-btn');
        const introScreen = document.getElementById('intro-screen');
        const mainContent = document.getElementById('main-content');

        enterBtn.addEventListener('click', () => {
            // Shake animation
            introScreen.classList.add('shake');
            
            setTimeout(() => {
                // Fade out intro
                introScreen.classList.add('fade-out');
                
                setTimeout(() => {
                    introScreen.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    document.body.style.cursor = 'auto';
                    this.startLightningTrail();
                }, 800);
            }, 500);
        });
    }

    // Navigation System
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const needle = document.querySelector('.needle');
        
        navItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Move needle
                const angle = (index * 30) - 90; // Distribute across speedometer
                needle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
                
                // Smooth scroll to section
                const targetSection = document.getElementById(item.dataset.section);
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                this.currentSection = index;
            });
        });

        // Update navigation on scroll
        window.addEventListener('scroll', () => {
            this.updateNavigationOnScroll();
        });
    }

    updateNavigationOnScroll() {
        const sections = document.querySelectorAll('.section');
        const navItems = document.querySelectorAll('.nav-item');
        const needle = document.querySelector('.needle');
        
        let current = '';
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
                this.currentSection = index;
            }
        });

        navItems.forEach((item, index) => {
            item.classList.remove('active');
            if (item.dataset.section === current) {
                item.classList.add('active');
                const angle = (index * 30) - 90;
                needle.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
            }
        });
    }

    // Comic Panel Interaction
    setupComicPanel() {
        const panelTab = document.querySelector('.panel-tab');
        const comicPanel = document.querySelector('.comic-panel');
        const voiceBtns = document.querySelectorAll('.voice-btn');
        
        let isOpen = false;
        
        const togglePanel = () => {
            isOpen = !isOpen;
            comicPanel.classList.toggle('opened', isOpen);
            panelTab.textContent = isOpen ? 'CLOSE PANEL' : 'PULL TO OPEN';
        };
        
        panelTab.addEventListener('click', togglePanel);
        comicPanel.addEventListener('click', togglePanel);
        
        // Voice lines
        voiceBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const line = btn.dataset.line;
                this.playVoiceLine(line);
                this.animateVoiceButton(btn);
            });
        });
    }

    playVoiceLine(line) {
        // Create speech synthesis
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(line);
            utterance.rate = 1.2;
            utterance.pitch = 1.1;
            speechSynthesis.speak(utterance);
        }
    }

    animateVoiceButton(btn) {
        btn.style.transform = 'scale(1.2)';
        btn.style.background = 'var(--flash-red)';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            btn.style.background = 'var(--flash-gold)';
            btn.style.color = 'var(--flash-crimson)';
        }, 300);
    }

    // Speed Cards Carousel
    setupSpeedCards() {
        const container = document.querySelector('.speed-cards-container');
        const cards = document.querySelectorAll('.speed-card');
        const indicators = document.querySelectorAll('.swipe-indicators .indicator');
        
        let currentCard = 0;
        let isScrolling = false;
        
        // Touch/swipe support
        let startX = 0;
        let scrollLeft = 0;
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
        
        container.addEventListener('touchend', () => {
            startX = 0;
            this.updateCardIndicators();
        });
        
        // Mouse wheel support
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
            this.updateCardIndicators();
        });
        
        // Click to activate sound effects
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.playCardSoundEffect(index);
                this.animateCard(card);
            });
        });
    }

    updateCardIndicators() {
        const container = document.querySelector('.speed-cards-container');
        const indicators = document.querySelectorAll('.swipe-indicators .indicator');
        const cardWidth = 330; // card width + gap
        const currentIndex = Math.round(container.scrollLeft / cardWidth);
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    playCardSoundEffect(index) {
        const effects = ['whoosh', 'zap', 'spark', 'boom'];
        console.log(`Playing sound effect: ${effects[index]}`);
        // In a real implementation, you would play actual sound files here
    }

    animateCard(card) {
        card.style.transform = 'scale(1.1) rotate(5deg)';
        card.style.zIndex = '10';
        
        setTimeout(() => {
            card.style.transform = 'scale(1) rotate(0deg)';
            card.style.zIndex = '1';
        }, 300);
    }

    // Speed Force Facts Display
    setupSpeedForce() {
        // Speed Force facts are now displayed openly, no interaction needed
        // Just add some hover effects for the lightning icons
        const lightningIcons = document.querySelectorAll('.lightning-icon');
        
        lightningIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                this.createLightningEffect(icon);
            });
        });
    }

    createLightningEffect(element) {
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < 10; i++) {
            const spark = document.createElement('div');
            spark.style.position = 'fixed';
            spark.style.left = rect.left + rect.width/2 + 'px';
            spark.style.top = rect.top + rect.height/2 + 'px';
            spark.style.width = '4px';
            spark.style.height = '4px';
            spark.style.background = 'var(--flash-gold)';
            spark.style.borderRadius = '50%';
            spark.style.pointerEvents = 'none';
            spark.style.zIndex = '1000';
            
            document.body.appendChild(spark);
            
            const angle = (i / 10) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            spark.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${endX}px, ${endY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 500,
                easing: 'ease-out'
            }).onfinish = () => {
                spark.remove();
            };
        }
    }

    // Race the Flash Game
    setupRaceGame() {
        const tapButton = document.getElementById('tap-button');
        const playerSpeed = document.querySelector('.player-speed');
        const flashSpeed = document.querySelector('.flash-speed');
        const commentaryText = document.getElementById('commentary-text');
        const victoryModal = document.getElementById('victory-modal');
        const shareCertificate = document.getElementById('share-certificate');
        
        this.raceGame = {
            isActive: false,
            playerTaps: 0,
            flashSpeed: 0,
            gameTime: 0,
            duration: 10000, // 10 seconds
            cooldownTime: 0,
            isCooldown: false,
            commentary: [
                "Ready to get absolutely destroyed? Let's go!",
                "Whoa, slow down — you'll need a massage gun just to keep up!",
                "I'm in another dimension of speed!",
                "Keep trying, maybe one day you'll catch a spark!",
                "Not bad, but I'm just getting warmed up!",
                "You're actually keeping up... wait, never mind!",
                "Did you think you had a chance? Adorable!",
                "I'm not even trying yet!",
                "Speed Force ACTIVATED! Game over!",
                "You're moving in slow motion!",
                "I'm running circles around you!",
                "This is embarrassing... for you!",
                "I've lapped you three times already!",
                "Maybe try walking next time?"
            ],
            commentaryIndex: 0
        };
        
        tapButton.addEventListener('click', () => {
            if (this.raceGame.isCooldown) {
                return; // Do nothing during cooldown
            } else if (!this.raceGame.isActive) {
                this.startRace();
            } else {
                this.handleTap();
            }
        });
        
        shareCertificate.addEventListener('click', () => {
            this.shareCertificate();
        });
    }

    startRace() {
        const game = this.raceGame;
        game.isActive = true;
        game.playerTaps = 0;
        game.flashSpeed = 0;
        game.gameTime = 0;
        game.commentaryIndex = 0;
        game.isCooldown = false;
        
        const tapButton = document.getElementById('tap-button');
        const commentaryText = document.getElementById('commentary-text');
        
        tapButton.textContent = 'TAP! TAP! TAP!';
        tapButton.disabled = false;
        commentaryText.textContent = game.commentary[0];
        
        // Reset speed bars
        document.querySelector('.player-speed').style.width = '0%';
        document.querySelector('.flash-speed').style.width = '0%';
        
        this.raceGameLoop();
        this.updateCommentary();
    }

    handleTap() {
        if (!this.raceGame.isActive) return;
        
        this.raceGame.playerTaps++;
        
        // Visual feedback
        const tapButton = document.getElementById('tap-button');
        tapButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tapButton.style.transform = 'scale(1)';
        }, 50);
        
        // Runner animation
        const playerRunner = document.querySelector('.player-runner');
        playerRunner.style.transform = 'translateX(10px)';
        setTimeout(() => {
            playerRunner.style.transform = 'translateX(0)';
        }, 100);
    }

    raceGameLoop() {
        const game = this.raceGame;
        
        const gameInterval = setInterval(() => {
            if (!game.isActive) {
                clearInterval(gameInterval);
                return;
            }
            
            game.gameTime += 100;
            
            // Update player speed based on taps (extremely hard now)
            const playerSpeedPercent = Math.min((game.playerTaps / 400) * 100, 100);
            
            // Barry's speed is insanely fast and nearly impossible to beat
            const timeProgress = game.gameTime / game.duration;
            const baseFlashSpeed = timeProgress * 200; // Much higher base speed
            const flashSpeedBoost = Math.pow(timeProgress, 0.3) * 120; // Stronger exponential boost
            const speedForceActivation = timeProgress > 0.3 ? 50 : 0; // Speed Force kicks in at 30%
            const lightningBoost = Math.sin(timeProgress * Math.PI * 4) * 20; // Oscillating speed bursts
            const playerPenalty = Math.max(0, game.playerTaps * 0.02); // Even less help from tapping
            const flashSpeedPercent = Math.min(baseFlashSpeed + flashSpeedBoost + speedForceActivation + lightningBoost - playerPenalty, 100);
            
            this.updateSpeedBars(playerSpeedPercent, flashSpeedPercent);
            
            // End game - extremely hard to win now
            if (game.gameTime >= game.duration) {
                // Player needs to be WAY ahead and maintain very high speed to win
                const playerWon = playerSpeedPercent >= flashSpeedPercent && 
                                playerSpeedPercent >= 95 && 
                                game.playerTaps >= 350; // Need at least 350 taps (35 per second!)
                this.endRace(playerWon);
                clearInterval(gameInterval);
            }
        }, 100);
    }

    updateSpeedBars(playerPercent, flashPercent) {
        const playerSpeed = document.querySelector('.player-speed');
        const flashSpeed = document.querySelector('.flash-speed');
        
        playerSpeed.style.width = playerPercent + '%';
        flashSpeed.style.width = flashPercent + '%';
        
        // Runner animations with enhanced Barry effects
        const playerRunner = document.querySelector('.player-runner');
        const flashRunner = document.querySelector('.flash-runner');
        
        if (playerPercent > 50) {
            playerRunner.style.transform = 'translateX(' + (playerPercent * 2) + 'px)';
        }
        
        // Barry gets more intense visual effects as he speeds up
        const flashMovement = flashPercent * 3; // Barry moves faster
        flashRunner.style.transform = 'translateX(' + flashMovement + 'px)';
        
        if (flashPercent > 70) {
            flashRunner.style.textShadow = '0 0 10px #FFD700, 0 0 20px #FF0000';
            flashRunner.style.filter = 'blur(1px)'; // Motion blur effect
        } else {
            flashRunner.style.textShadow = 'none';
            flashRunner.style.filter = 'none';
        }
        
        // Add lightning effects to Barry's lane when he's going really fast
        const flashLane = document.querySelector('.flash-lane');
        if (flashPercent > 80) {
            flashLane.style.background = 'rgba(255, 215, 0, 0.3)';
            flashLane.style.boxShadow = 'inset 0 0 20px rgba(255, 0, 0, 0.5)';
        } else {
            flashLane.style.background = 'rgba(255, 255, 255, 0.2)';
            flashLane.style.boxShadow = 'none';
        }
    }

    updateCommentary() {
        const game = this.raceGame;
        
        const commentaryInterval = setInterval(() => {
            if (!game.isActive) {
                clearInterval(commentaryInterval);
                return;
            }
            
            game.commentaryIndex = (game.commentaryIndex + 1) % game.commentary.length;
            const commentaryText = document.getElementById('commentary-text');
            commentaryText.textContent = game.commentary[game.commentaryIndex];
        }, 2000);
    }

    endRace(playerWon) {
        const game = this.raceGame;
        game.isActive = false;
        game.isCooldown = true;
        game.cooldownTime = 3000; // 3 second cooldown
        
        const tapButton = document.getElementById('tap-button');
        const commentaryText = document.getElementById('commentary-text');
        const victoryModal = document.getElementById('victory-modal');
        
        if (playerWon) {
            tapButton.textContent = 'YOU WON! 🏆';
            commentaryText.textContent = "Wow, you're fast! Welcome to the Speed Force!";
            victoryModal.classList.remove('hidden');
            this.createVictoryAnimation();
        } else {
            tapButton.textContent = 'BARRY DOMINATES! ⚡💨';
            const lossCommentary = [
                "Better luck next time! I am speed incarnate!",
                "Did you even try? That was pathetic!",
                "I wasn't even running at full speed!",
                "Maybe stick to walking, champ!",
                "That was easier than stopping Reverse Flash!",
                "I finished the race before you even started!"
            ];
            commentaryText.textContent = lossCommentary[Math.floor(Math.random() * lossCommentary.length)];
        }
        
        // Start cooldown
        tapButton.disabled = true;
        this.startCooldown();
    }

    startCooldown() {
        const game = this.raceGame;
        const tapButton = document.getElementById('tap-button');
        const commentaryText = document.getElementById('commentary-text');
        
        let countdown = 3;
        tapButton.textContent = `COOLDOWN: ${countdown}s`;
        commentaryText.textContent = "Give me a second to catch my breath... just kidding! I could do this all day!";
        
        const cooldownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                tapButton.textContent = `COOLDOWN: ${countdown}s`;
            } else {
                // End cooldown
                game.isCooldown = false;
                tapButton.disabled = false;
                tapButton.textContent = 'TAP AS FAST AS YOU CAN!';
                commentaryText.textContent = "Ready to lose again? This should be fun!";
                clearInterval(cooldownInterval);
            }
        }, 1000);
    }

    createVictoryAnimation() {
        // Confetti effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.position = 'fixed';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.top = '-10px';
                confetti.style.width = '10px';
                confetti.style.height = '10px';
                confetti.style.background = ['var(--flash-red)', 'var(--flash-gold)', 'var(--speed-blue)'][Math.floor(Math.random() * 3)];
                confetti.style.zIndex = '1001';
                
                document.body.appendChild(confetti);
                
                confetti.animate([
                    { transform: 'translateY(-10px) rotate(0deg)', opacity: 1 },
                    { transform: 'translateY(100vh) rotate(360deg)', opacity: 0 }
                ], {
                    duration: 2000,
                    easing: 'ease-out'
                }).onfinish = () => {
                    confetti.remove();
                };
            }, i * 100);
        }
    }

    shareCertificate() {
        const victoryModal = document.getElementById('victory-modal');
        
        if (navigator.share) {
            navigator.share({
                title: 'I Beat The Flash!',
                text: 'I just outran Barry Allen in a speed race! Check out this Flash website!',
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText('I just beat The Flash in a speed race! Check out this awesome Flash website: ' + window.location.href);
            alert('Victory message copied to clipboard!');
        }
        
        victoryModal.classList.add('hidden');
    }

    // Multiverse Portals
    setupMultiverse() {
        const portals = document.querySelectorAll('.portal');
        
        portals.forEach((portal, index) => {
            portal.addEventListener('click', () => {
                this.activatePortal(portal, index);
            });
        });
    }

    activatePortal(portal, index) {
        // Deactivate all portals
        document.querySelectorAll('.portal').forEach(p => p.classList.remove('active'));
        
        // Activate clicked portal
        portal.classList.add('active');
        
        // Portal animation
        const glow = portal.querySelector('.portal-glow');
        glow.style.animation = 'portal-spin 2s linear';
        
        setTimeout(() => {
            glow.style.animation = 'portal-pulse 2s ease-in-out infinite';
        }, 2000);
        
        // Always return to Barry as the main Flash
        setTimeout(() => {
            const barryPortal = document.querySelector('.portal[data-flash="Barry Allen (Prime)"]');
            document.querySelectorAll('.portal').forEach(p => p.classList.remove('active'));
            barryPortal.classList.add('active');
        }, 5000);
    }

    // Flash Facts Carousel
    setupFlashFacts() {
        const factsStrip = document.querySelector('.facts-strip');
        const factCards = document.querySelectorAll('.fact-card');
        
        // Touch/swipe support
        let startX = 0;
        let scrollLeft = 0;
        
        factsStrip.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - factsStrip.offsetLeft;
            scrollLeft = factsStrip.scrollLeft;
        });
        
        factsStrip.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - factsStrip.offsetLeft;
            const walk = (x - startX) * 2;
            factsStrip.scrollLeft = scrollLeft - walk;
        });
        
        factsStrip.addEventListener('touchend', () => {
            startX = 0;
        });
        
        // Click animations
        factCards.forEach(card => {
            card.addEventListener('click', () => {
                this.animateFactCard(card);
            });
        });
    }

    animateFactCard(card) {
        card.style.transform = 'translateY(-15px) scale(1.05)';
        card.style.boxShadow = '0 25px 50px rgba(255, 215, 0, 0.5)';
        
        setTimeout(() => {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 0 0 rgba(255, 215, 0, 0)';
        }, 300);
    }

    // Lightning Cursor Trail
    startLightningTrail() {
        document.addEventListener('mousemove', (e) => {
            this.createLightningParticle(e.clientX, e.clientY);
        });
    }

    createLightningParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'lightning-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        document.getElementById('cursor-trail').appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800);
    }

    setupCursorTrail() {
        // Lightning cursor trail is started after intro
    }

    // Sound Effects System
    setupSoundEffects() {
        // Create audio context for sound effects
        this.audioContext = null;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    playSound(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Mobile Optimizations
    setupMobileOptimizations() {
        // Touch event optimizations
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Optimize scroll performance
        let ticking = false;
        
        const updateOnScroll = () => {
            this.updateNavigationOnScroll();
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        });
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FlashWebsite();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate positions for mobile
    const website = window.flashWebsite;
    if (website) {
        website.updateNavigationOnScroll();
    }
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}