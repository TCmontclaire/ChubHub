// Flash Universe Interactive Website JavaScript

// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const exploreButtons = document.querySelectorAll('.explore-btn');
const navCards = document.querySelectorAll('.nav-card');

// Click Race Challenge Elements
const startGameBtn = document.getElementById('startGame');
const resetGameBtn = document.getElementById('resetGame');
const clickButton = document.getElementById('clickButton');
const clickCountDisplay = document.getElementById('clickCount');
const userSpeedDisplay = document.getElementById('userSpeed');
const timeLeftDisplay = document.getElementById('timeLeft');
const gameResult = document.getElementById('gameResult');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const certificate = document.getElementById('certificate');

// Game State
let gameActive = false;
let clickCount = 0;
let timeLeft = 10;
let gameTimer = null;
let speedTimer = null;
let lastClickTime = 0;
let clicksInLastSecond = 0;
let currentSpeed = 0;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeClickRaceChallenge();
    initializeScrollEffects();
    initializeInteractiveElements();
});

// Navigation Functions
function initializeNavigation() {
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });

    // Explore button functionality
    exploreButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const card = this.closest('.nav-card');
            const section = card.getAttribute('data-section');
            const targetSection = document.querySelector(`#${section}`);
            
            if (targetSection) {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                // Navigate to section
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 200);
            }
        });
    });

    // Navigation card hover effects
    navCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Animation Functions
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe cards for staggered animations
    const cards = document.querySelectorAll('.nav-card, .villain-card, .feat-card, .timeline-item');
    cards.forEach((card, index) => {
        setTimeout(() => {
            observer.observe(card);
        }, index * 100);
    });
}

// Click Race Challenge Functions
function initializeClickRaceChallenge() {
    startGameBtn.addEventListener('click', startGame);
    resetGameBtn.addEventListener('click', resetGame);
    clickButton.addEventListener('click', handleClick);
    
    // Disable click button initially
    clickButton.disabled = true;
    clickButton.style.opacity = '0.5';
}

function startGame() {
    gameActive = true;
    clickCount = 0;
    timeLeft = 10;
    currentSpeed = 0;
    
    // Enable click button
    clickButton.disabled = false;
    clickButton.style.opacity = '1';
    clickButton.style.transform = 'scale(1)';
    
    // Update displays
    updateGameDisplays();
    
    // Hide result
    gameResult.classList.add('hidden');
    
    // Disable start button
    startGameBtn.disabled = true;
    startGameBtn.style.opacity = '0.5';
    
    // Start timers
    startGameTimer();
    startSpeedCalculation();
    
    // Add visual feedback
    clickButton.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
    clickButton.innerHTML = '<i class="fas fa-bolt"></i><span>CLICK NOW!</span>';
}

function startGameTimer() {
    gameTimer = setInterval(() => {
        timeLeft--;
        updateGameDisplays();
        
        if (timeLeft <= 0) {
            endGame();
        }
        
        // Add urgency effects in final seconds
        if (timeLeft <= 3) {
            clickButton.style.animation = 'lightning-pulse 0.5s infinite';
            timeLeftDisplay.style.color = '#ff0000';
            timeLeftDisplay.style.animation = 'pulse-glow 0.5s infinite';
        }
    }, 1000);
}

function startSpeedCalculation() {
    speedTimer = setInterval(() => {
        const now = Date.now();
        const timeDiff = now - lastClickTime;
        
        if (timeDiff > 1000) {
            currentSpeed = Math.max(0, currentSpeed - 5); // Decay speed
        }
        
        updateGameDisplays();
    }, 100);
}

function handleClick() {
    if (!gameActive) return;
    
    clickCount++;
    const now = Date.now();
    
    // Calculate current speed (clicks per second)
    if (lastClickTime > 0) {
        const timeDiff = now - lastClickTime;
        if (timeDiff < 1000) {
            clicksInLastSecond++;
            currentSpeed = Math.min(300, clicksInLastSecond * (1000 / timeDiff));
        } else {
            clicksInLastSecond = 1;
            currentSpeed = 1;
        }
    } else {
        clicksInLastSecond = 1;
        currentSpeed = 1;
    }
    
    lastClickTime = now;
    
    // Visual feedback
    clickButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        clickButton.style.transform = 'scale(1)';
    }, 50);
    
    // Lightning effect
    createLightningEffect();
    
    updateGameDisplays();
}

function createLightningEffect() {
    const lightning = document.createElement('div');
    lightning.style.position = 'absolute';
    lightning.style.width = '2px';
    lightning.style.height = '20px';
    lightning.style.background = 'linear-gradient(to bottom, #ffd700, #ff6b00)';
    lightning.style.left = Math.random() * 200 + 'px';
    lightning.style.top = Math.random() * 200 + 'px';
    lightning.style.opacity = '1';
    lightning.style.pointerEvents = 'none';
    lightning.style.borderRadius = '1px';
    lightning.style.boxShadow = '0 0 10px #ffd700';
    
    clickButton.parentElement.style.position = 'relative';
    clickButton.parentElement.appendChild(lightning);
    
    setTimeout(() => {
        lightning.style.opacity = '0';
        lightning.style.transform = 'translateY(-50px)';
        lightning.style.transition = 'all 0.5s ease';
    }, 50);
    
    setTimeout(() => {
        lightning.remove();
    }, 600);
}

function endGame() {
    gameActive = false;
    clearInterval(gameTimer);
    clearInterval(speedTimer);
    
    // Disable click button
    clickButton.disabled = true;
    clickButton.style.opacity = '0.5';
    clickButton.style.animation = '';
    clickButton.style.boxShadow = '';
    clickButton.innerHTML = '<i class="fas fa-bolt"></i><span>GAME OVER</span>';
    
    // Enable start button
    startGameBtn.disabled = false;
    startGameBtn.style.opacity = '1';
    
    // Reset time display color
    timeLeftDisplay.style.color = '';
    timeLeftDisplay.style.animation = '';
    
    // Show results
    showGameResult();
}

function showGameResult() {
    const averageSpeed = timeLeft === 0 ? Math.round(clickCount / 10) : Math.round(clickCount / (10 - timeLeft));
    const barrySpeed = 200;
    
    gameResult.classList.remove('hidden');
    
    if (averageSpeed >= barrySpeed) {
        // Victory!
        resultTitle.textContent = '🏆 INCREDIBLE! YOU WON! 🏆';
        resultMessage.innerHTML = `
            <p>You achieved an average speed of <strong>${averageSpeed} clicks/second</strong>!</p>
            <p>You've somehow managed to outclick The Flash himself!</p>
            <p>Total clicks: <strong>${clickCount}</strong></p>
        `;
        certificate.classList.remove('hidden');
        
        // Victory animation
        gameResult.style.background = 'linear-gradient(45deg, #ffd700, #ff6b00)';
        gameResult.style.animation = 'lightning-pulse 1s infinite';
        
    } else {
        // Loss
        resultTitle.textContent = 'Barry Wins This Round!';
        resultMessage.innerHTML = `
            <p>Your average speed: <strong>${averageSpeed} clicks/second</strong></p>
            <p>Barry's speed: <strong>${barrySpeed} clicks/second</strong></p>
            <p>Total clicks: <strong>${clickCount}</strong></p>
            <p>Keep training, speedster! You'll get faster with practice.</p>
        `;
        certificate.classList.add('hidden');
        
        // Loss styling
        gameResult.style.background = '';
        gameResult.style.animation = '';
    }
}

function resetGame() {
    // Stop any running timers
    if (gameTimer) clearInterval(gameTimer);
    if (speedTimer) clearInterval(speedTimer);
    
    // Reset game state
    gameActive = false;
    clickCount = 0;
    timeLeft = 10;
    currentSpeed = 0;
    lastClickTime = 0;
    clicksInLastSecond = 0;
    
    // Reset UI
    clickButton.disabled = true;
    clickButton.style.opacity = '0.5';
    clickButton.style.transform = 'scale(1)';
    clickButton.style.animation = '';
    clickButton.style.boxShadow = '';
    clickButton.innerHTML = '<i class="fas fa-bolt"></i><span>CLICK ME!</span>';
    
    startGameBtn.disabled = false;
    startGameBtn.style.opacity = '1';
    
    timeLeftDisplay.style.color = '';
    timeLeftDisplay.style.animation = '';
    
    gameResult.classList.add('hidden');
    gameResult.style.background = '';
    gameResult.style.animation = '';
    
    updateGameDisplays();
}

function updateGameDisplays() {
    clickCountDisplay.textContent = clickCount;
    userSpeedDisplay.textContent = Math.round(currentSpeed);
    timeLeftDisplay.textContent = timeLeft;
}

// Scroll Effects
function initializeScrollEffects() {
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Update navigation based on scroll position
        updateNavigationOnScroll();
    });
}

function updateNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    });
}

// Interactive Elements
function initializeInteractiveElements() {
    // Add hover effects to cards
    const allCards = document.querySelectorAll('.villain-card, .feat-card');
    
    allCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
    
    // Timeline item interactions
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const content = this.querySelector('.timeline-content');
            content.style.transform = 'scale(1.05)';
            content.style.boxShadow = '0 20px 40px rgba(255, 215, 0, 0.4)';
            
            setTimeout(() => {
                content.style.transform = '';
                content.style.boxShadow = '';
            }, 300);
        });
    });
    
    // Add loading animation to page
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
}

// Utility Functions
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some Easter eggs and special effects
function addEasterEggs() {
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateSpeedForceMode();
        }
    });
}

function activateSpeedForceMode() {
    document.body.style.animation = 'lightning-pulse 0.1s infinite';
    document.body.style.filter = 'hue-rotate(45deg) brightness(1.2)';
    
    // Show special message
    const speedForceMessage = document.createElement('div');
    speedForceMessage.innerHTML = '⚡ SPEED FORCE ACTIVATED! ⚡';
    speedForceMessage.style.position = 'fixed';
    speedForceMessage.style.top = '50%';
    speedForceMessage.style.left = '50%';
    speedForceMessage.style.transform = 'translate(-50%, -50%)';
    speedForceMessage.style.fontSize = '3rem';
    speedForceMessage.style.color = '#ffd700';
    speedForceMessage.style.fontFamily = 'Orbitron, monospace';
    speedForceMessage.style.textShadow = '0 0 20px #ffd700';
    speedForceMessage.style.zIndex = '10000';
    speedForceMessage.style.animation = 'lightning-pulse 0.5s infinite';
    
    document.body.appendChild(speedForceMessage);
    
    setTimeout(() => {
        document.body.style.animation = '';
        document.body.style.filter = '';
        speedForceMessage.remove();
    }, 3000);
}

// Initialize Easter eggs
addEasterEggs();

// Performance optimization - lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initializeLazyLoading();

// Add custom cursor trail effect
function initializeCursorTrail() {
    let mouseX = 0;
    let mouseY = 0;
    let trailElements = [];
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create trail element
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = mouseX + 'px';
        trail.style.top = mouseY + 'px';
        trail.style.width = '4px';
        trail.style.height = '4px';
        trail.style.background = '#ffd700';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9999';
        trail.style.opacity = '0.7';
        trail.style.transition = 'all 0.3s ease';
        
        document.body.appendChild(trail);
        trailElements.push(trail);
        
        // Remove old trail elements
        if (trailElements.length > 10) {
            const oldTrail = trailElements.shift();
            oldTrail.style.opacity = '0';
            setTimeout(() => oldTrail.remove(), 300);
        }
    });
}

// Initialize cursor trail
initializeCursorTrail();

console.log('⚡ The Flash Universe is ready! Welcome to the Speed Force! ⚡');