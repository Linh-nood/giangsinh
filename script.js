/* =====================================================
   GIÁNG SINH TÌNH YÊU - JavaScript
   Premium Xmas Experience
   ===================================================== */

// ============ Global Variables ============
let snowflakes = [];
let confettiParticles = [];
let isConfettiActive = false;
let mouseX = 0;
let mouseY = 0;
let galleryAngle = 0;
let isTyping = false;
let typingComplete = false;
let introSnowflakes = [];

// ============ DOM Elements ============
const introScreen = document.getElementById('introScreen');
const mainContent = document.getElementById('mainContent');
const introSnowCanvas = document.getElementById('introSnowCanvas');
const introCtx = introSnowCanvas ? introSnowCanvas.getContext('2d') : null;

// ============ Love Message Content ============
const loveMessage = `Em yêu ơi,

Mùa Giáng Sinh năm nay, anh muốn dành những lời yêu thương nhất gửi đến em - người đã làm cuộc sống của anh trở nên ý nghĩa và tràn đầy màu sắc.

Mỗi khoảnh khắc bên em là một món quà quý giá mà cuộc đời ban tặng cho anh. Nụ cười của em ấm áp hơn cả ngọn lửa trong đêm Giáng Sinh lạnh giá.

Cảm ơn em đã luôn ở bên anh, chia sẻ niềm vui, nỗi buồn, và cả những giấc mơ. Em là điều kỳ diệu nhất đến với cuộc đời anh.

Giáng Sinh này và mãi mãi về sau, anh khômg dám hứa nhưng anh tin vào Chúa, tin vào tình yêu của em và nhờ năng quyền Chúa sẽ yêu thương và che chở em bằng cả trái tim mình.

Merry Christmas, my love! 🎄💕`;

// ============ Initialize ============
document.addEventListener('DOMContentLoaded', () => {
    // Init intro screen first
    initIntroScreen();
});

// ============ Intro Screen ============
function initIntroScreen() {
    if (!introSnowCanvas || !introCtx) return;
    
    // Setup intro canvas
    introSnowCanvas.width = window.innerWidth;
    introSnowCanvas.height = window.innerHeight;
    
    // Create intro snowflakes
    for (let i = 0; i < 100; i++) {
        introSnowflakes.push({
            x: Math.random() * introSnowCanvas.width,
            y: Math.random() * introSnowCanvas.height,
            size: Math.random() * 4 + 1,
            speed: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.6 + 0.4,
            swing: Math.random() * Math.PI * 2,
            swingSpeed: Math.random() * 0.02 + 0.01
        });
    }
    
    // Start intro snow animation
    animateIntroSnow();
    
    // Handle intro heart click
    const introHeart = document.getElementById('introHeart');
    console.log('Intro heart element:', introHeart);
    
    if (introHeart) {
        introHeart.addEventListener('click', function(e) {
            console.log('Heart clicked!');
            e.stopPropagation();
            openMainContent();
        });
        
        // Also add touch support
        introHeart.addEventListener('touchend', function(e) {
            console.log('Heart touched!');
            e.preventDefault();
            openMainContent();
        });
    }
    
    window.addEventListener('resize', () => {
        introSnowCanvas.width = window.innerWidth;
        introSnowCanvas.height = window.innerHeight;
    });
}

function animateIntroSnow() {
    if (!introCtx || !introScreen || introScreen.classList.contains('hidden')) return;
    
    introCtx.clearRect(0, 0, introSnowCanvas.width, introSnowCanvas.height);
    
    introSnowflakes.forEach(flake => {
        flake.swing += flake.swingSpeed;
        flake.y += flake.speed;
        flake.x += Math.sin(flake.swing) * 0.5;
        
        if (flake.y > introSnowCanvas.height) {
            flake.y = -10;
            flake.x = Math.random() * introSnowCanvas.width;
        }
        
        introCtx.beginPath();
        introCtx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        introCtx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        introCtx.fill();
    });
    
    requestAnimationFrame(animateIntroSnow);
}

function openMainContent() {
    const introScreen = document.getElementById('introScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (!introScreen || !mainContent) {
        console.log('Elements not found');
        return;
    }
    
    // Play music
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log('Autoplay prevented:', e));
    }
    
    // Hide intro screen with animation
    introScreen.classList.add('hidden');
    
    // Show main content
    setTimeout(() => {
        introScreen.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Trigger fade in
        setTimeout(() => {
            mainContent.classList.add('visible');
        }, 50);
        
        // Initialize main content
        initMainContent();
    }, 1000);
}

function initMainContent() {
    // Get main canvas elements
    const snowCanvas = document.getElementById('snowCanvas');
    const confettiCanvas = document.getElementById('confettiCanvas');
    
    if (snowCanvas && confettiCanvas) {
        window.snowCtx = snowCanvas.getContext('2d');
        window.confettiCtx = confettiCanvas.getContext('2d');
        window.snowCanvas = snowCanvas;
        window.confettiCanvas = confettiCanvas;
    }
    
    initCanvas();
    initSnowfall();
    initCountdown();
    initScrollReveal();
    initGallery();
    initEventListeners();
    initMusicControl();
    animateSnow();
}

// ============ Canvas Setup ============
function initCanvas() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    const snowCanvas = document.getElementById('snowCanvas');
    const confettiCanvas = document.getElementById('confettiCanvas');
    
    if (snowCanvas && confettiCanvas) {
        snowCanvas.width = window.innerWidth;
        snowCanvas.height = window.innerHeight;
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }
}

function resizeCanvas() {
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

// ============ Snowfall Effect (60fps optimized) ============
class Snowflake {
    constructor() {
        this.reset();
    }

    reset() {
        const canvas = document.getElementById('snowCanvas');
        if (!canvas) return;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 4 + 1;
        this.speed = Math.random() * 2 + 0.5;
        this.wind = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.6 + 0.4;
        this.swing = Math.random() * 2 * Math.PI;
        this.swingSpeed = Math.random() * 0.03 + 0.01;
        this.layer = Math.floor(Math.random() * 3); // 3 layers for parallax
    }

    update() {
        const canvas = document.getElementById('snowCanvas');
        if (!canvas) return;
        
        this.swing += this.swingSpeed;
        
        // Parallax effect based on layer
        const layerSpeed = (this.layer + 1) * 0.5;
        
        this.y += this.speed * layerSpeed;
        this.x += Math.sin(this.swing) * 0.5 + this.wind;
        
        // Mouse interaction - push snowflakes away
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            this.x += dx * force * 0.02;
            this.y += dy * force * 0.02;
        }

        // Reset when off screen
        if (this.y > canvas.height + 10) {
            this.reset();
            this.y = -10;
        }
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.x < -10) this.x = canvas.width + 10;
    }

    draw() {
        const ctx = window.snowCtx;
        if (!ctx) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * (0.5 + this.layer * 0.25)})`;
        ctx.fill();
        
        // Add glow effect for larger snowflakes
        if (this.size > 2.5) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 2
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.3})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }
}

function initSnowfall() {
    snowflakes = [];
    const snowflakeCount = Math.min(200, Math.floor(window.innerWidth / 8));
    for (let i = 0; i < snowflakeCount; i++) {
        snowflakes.push(new Snowflake());
    }
}

function animateSnow() {
    const canvas = document.getElementById('snowCanvas');
    const ctx = window.snowCtx;
    if (!canvas || !ctx) {
        requestAnimationFrame(animateSnow);
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    snowflakes.forEach(flake => {
        flake.update();
        flake.draw();
    });
    
    requestAnimationFrame(animateSnow);
}

// ============ Confetti Effect ============
class ConfettiParticle {
    constructor(x, y, isSnowflake = false) {
        this.x = x;
        this.y = y;
        this.isSnowflake = isSnowflake;
        this.size = Math.random() * 10 + 5;
        this.speedX = (Math.random() - 0.5) * 15;
        this.speedY = Math.random() * -15 - 5;
        this.gravity = 0.3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.opacity = 1;
        this.color = this.getColor();
    }

    getColor() {
        const colors = [
            '#ffd700', // Gold
            '#05bfdb', // Aurora cyan
            '#ff4757', // Red
            '#ffffff', // White
            '#ff6b81', // Pink
            '#2ed573', // Green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.01;
        this.speedX *= 0.99;
    }

    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.rotation * Math.PI / 180);
        confettiCtx.globalAlpha = this.opacity;
        
        if (this.isSnowflake) {
            // Draw snowflake shape
            confettiCtx.fillStyle = this.color;
            confettiCtx.font = `${this.size * 2}px Arial`;
            confettiCtx.textAlign = 'center';
            confettiCtx.textBaseline = 'middle';
            confettiCtx.fillText('❄', 0, 0);
        } else {
            // Draw heart or star
            const shapes = ['❤', '⭐', '✨', '🎄'];
            confettiCtx.fillStyle = this.color;
            confettiCtx.font = `${this.size * 1.5}px Arial`;
            confettiCtx.textAlign = 'center';
            confettiCtx.textBaseline = 'middle';
            confettiCtx.fillText(shapes[Math.floor(Math.random() * shapes.length)], 0, 0);
        }
        
        confettiCtx.restore();
    }
}

function createConfetti(x, y, count = 50) {
    for (let i = 0; i < count; i++) {
        confettiParticles.push(new ConfettiParticle(x, y, Math.random() > 0.5));
    }
    
    if (!isConfettiActive) {
        isConfettiActive = true;
        animateAllEffects();
    }
}

// ============ Unified Animation Loop for All Effects ============
let animationRunning = false;

function animateAllEffects() {
    // Clear canvas once
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    // Update and draw confetti
    confettiParticles = confettiParticles.filter(particle => {
        particle.update();
        particle.draw();
        return particle.opacity > 0 && particle.y < confettiCanvas.height + 50;
    });
    
    // Update and draw love rain
    loveRainParticles = loveRainParticles.filter(particle => {
        const alive = particle.update();
        if (alive) particle.draw();
        return alive;
    });
    
    // Update and draw snow storm
    snowStormParticles = snowStormParticles.filter(particle => {
        const alive = particle.update();
        if (alive) particle.draw();
        return alive;
    });
    
    // Check if any effects are still active
    const hasParticles = confettiParticles.length > 0 || 
                         loveRainParticles.length > 0 || 
                         snowStormParticles.length > 0;
    
    if (hasParticles) {
        requestAnimationFrame(animateAllEffects);
    } else {
        isConfettiActive = false;
        isLoveRainActive = false;
        isSnowStormActive = false;
        animationRunning = false;
    }
}

function startEffectsAnimation() {
    if (!animationRunning) {
        animationRunning = true;
        animateAllEffects();
    }
}

// ============ Countdown Timer ============
function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const christmas = new Date('December 25, 2025 00:00:00').getTime();
    const now = new Date().getTime();
    const distance = christmas - now;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    } else {
        // It's Christmas!
        document.querySelector('.countdown-title').innerHTML = '🎄 Chúc Mừng Giáng Sinh! 🎄';
        document.getElementById('days').textContent = '🎁';
        document.getElementById('hours').textContent = '🎄';
        document.getElementById('minutes').textContent = '⭐';
        document.getElementById('seconds').textContent = '❄️';
    }
}

// ============ Scroll Reveal ============
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Start typing effect when message section is visible
                if (entry.target.closest('#message') && !isTyping && !typingComplete) {
                    startTypingEffect();
                }
            }
        });
    }, { threshold: 0.2 });

    revealElements.forEach(el => observer.observe(el));
}

// ============ Typing Effect ============
function startTypingEffect() {
    isTyping = true;
    const textElement = document.getElementById('typingText');
    const text = loveMessage;
    let index = 0;
    
    // Add cursor
    textElement.innerHTML = '<span class="typing-cursor"></span>';
    
    function type() {
        if (index < text.length) {
            const char = text[index];
            const cursor = textElement.querySelector('.typing-cursor');
            
            if (char === '\n') {
                cursor.insertAdjacentHTML('beforebegin', '<br>');
            } else {
                cursor.insertAdjacentText('beforebegin', char);
            }
            
            index++;
            
            // Variable typing speed for natural feel
            const speed = char === '.' || char === ',' || char === '!' ? 150 : 
                         char === '\n' ? 300 : 
                         Math.random() * 30 + 20;
            
            setTimeout(type, speed);
        } else {
            // Remove cursor when done
            const cursor = textElement.querySelector('.typing-cursor');
            if (cursor) cursor.remove();
            typingComplete = true;
            isTyping = false;
        }
    }
    
    type();
}

// ============ 3D Gallery ============
function initGallery() {
    const carousel = document.getElementById('galleryCarousel');
    const items = carousel.querySelectorAll('.gallery-item');
    const totalItems = items.length;
    const angleStep = 360 / totalItems;
    const radius = 250;

    function updateGallery() {
        items.forEach((item, index) => {
            const angle = angleStep * index + galleryAngle;
            const radian = angle * (Math.PI / 180);
            
            const x = Math.sin(radian) * radius;
            const z = Math.cos(radian) * radius - radius;
            const scale = (z + radius * 2) / (radius * 2);
            const opacity = 0.5 + scale * 0.5;
            
            item.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
            item.style.opacity = opacity;
            item.style.zIndex = Math.round(scale * 100);
        });
    }

    // Initialize positions
    updateGallery();

    // Gallery controls
    document.getElementById('prevBtn').addEventListener('click', () => {
        galleryAngle -= angleStep;
        updateGallery();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        galleryAngle += angleStep;
        updateGallery();
    });

    // Auto rotate
    let autoRotate = setInterval(() => {
        galleryAngle += 0.3;
        updateGallery();
    }, 50);

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
    carousel.addEventListener('mouseleave', () => {
        autoRotate = setInterval(() => {
            galleryAngle += 0.3;
            updateGallery();
        }, 50);
    });
}

// ============ Event Listeners ============
function initEventListeners() {
    // Mouse tracking for snow interaction
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
    });

    // Interactive heart click
    const interactiveHeart = document.getElementById('interactiveHeart');
    interactiveHeart.addEventListener('click', () => {
        const rect = interactiveHeart.getBoundingClientRect();
        createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);
    });

    // Open heart button
    const openHeartBtn = document.getElementById('openHeartBtn');
    const loveModal = document.getElementById('loveModal');
    const closeModal = document.getElementById('closeModal');

    openHeartBtn.addEventListener('click', () => {
        loveModal.classList.add('active');
        createConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
        
        // Set random positions for heart explosion
        document.querySelectorAll('.hearts-explosion i').forEach(heart => {
            heart.style.setProperty('--random-x', Math.random());
            heart.style.setProperty('--random-y', Math.random());
        });
    });

    closeModal.addEventListener('click', () => {
        loveModal.classList.remove('active');
    });

    // Close modal on overlay click
    loveModal.querySelector('.modal-overlay').addEventListener('click', () => {
        loveModal.classList.remove('active');
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loveModal.classList.contains('active')) {
            loveModal.classList.remove('active');
        }
        
        // Press L for Love Rain (hearts)
        if (e.key === 'l' || e.key === 'L') {
            createLoveRain();
        }
        
        // Press S for Snow Storm
        if (e.key === 's' || e.key === 'S') {
            createSnowStorm();
        }
    });
}

// ============ Love Rain Effect (Press L) ============
let loveRainParticles = [];
let isLoveRainActive = false;
let loveRainCooldown = false;
const MAX_LOVE_PARTICLES = 100;

class LoveParticle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = Math.random() * -100 - 20;
        this.size = Math.random() * 12 + 8;
        this.speed = Math.random() * 4 + 3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.opacity = Math.random() * 0.3 + 0.7;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = Math.random() * 0.03 + 0.02;
        // Heart colors
        this.color = ['#ff4757', '#ff6b81', '#ff1744', '#f50057', '#e91e63', '#ff69b4'][Math.floor(Math.random() * 6)];
    }
    
    update() {
        this.swing += this.swingSpeed;
        this.y += this.speed;
        this.x += Math.sin(this.swing) * 1.5;
        this.rotation += this.rotationSpeed;
        
        if (this.y > confettiCanvas.height + 30) {
            return false;
        }
        return true;
    }
    
    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.rotation);
        confettiCtx.globalAlpha = this.opacity;
        
        // Draw heart shape using canvas path
        confettiCtx.beginPath();
        const s = this.size;
        confettiCtx.moveTo(0, s * 0.3);
        confettiCtx.bezierCurveTo(-s, -s * 0.5, -s, s * 0.5, 0, s);
        confettiCtx.bezierCurveTo(s, s * 0.5, s, -s * 0.5, 0, s * 0.3);
        confettiCtx.fillStyle = this.color;
        confettiCtx.fill();
        
        confettiCtx.restore();
    }
}

function createLoveRain() {
    // Cooldown check - prevent spam
    if (loveRainCooldown) return;
    
    // Limit max particles
    if (loveRainParticles.length >= MAX_LOVE_PARTICLES) {
        return;
    }
    
    // Calculate how many to add without exceeding limit
    const toAdd = Math.min(30, MAX_LOVE_PARTICLES - loveRainParticles.length);
    
    for (let i = 0; i < toAdd; i++) {
        const particle = new LoveParticle();
        particle.y = Math.random() * -300;
        loveRainParticles.push(particle);
    }
    
    isLoveRainActive = true;
    startEffectsAnimation();
    
    showKeyboardHint('💕 Mưa Tình Yêu 💕');
    
    // Set cooldown
    loveRainCooldown = true;
    setTimeout(() => { loveRainCooldown = false; }, 500);
}

// ============ Snow Storm Effect (Press S) ============
let snowStormParticles = [];
let isSnowStormActive = false;
let snowStormCooldown = false;
const MAX_SNOW_PARTICLES = 120;

class SnowStormParticle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = Math.random() * -100 - 20;
        this.size = Math.random() * 8 + 4;
        this.speed = Math.random() * 5 + 3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.08;
        this.opacity = Math.random() * 0.4 + 0.6;
        this.swing = Math.random() * Math.PI * 2;
        this.swingSpeed = Math.random() * 0.04 + 0.02;
        // Snowflake colors
        this.color = ['#ffffff', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1'][Math.floor(Math.random() * 5)];
        this.arms = Math.floor(Math.random() * 2) + 6; // 6 or 8 arms
    }
    
    update() {
        this.swing += this.swingSpeed;
        this.y += this.speed;
        this.x += Math.sin(this.swing) * 2;
        this.rotation += this.rotationSpeed;
        
        if (this.y > confettiCanvas.height + 30) {
            return false;
        }
        return true;
    }
    
    draw() {
        confettiCtx.save();
        confettiCtx.translate(this.x, this.y);
        confettiCtx.rotate(this.rotation);
        confettiCtx.globalAlpha = this.opacity;
        
        // Draw simple snowflake
        confettiCtx.strokeStyle = this.color;
        confettiCtx.lineWidth = 1.5;
        confettiCtx.lineCap = 'round';
        
        // Draw 6 arms
        for (let i = 0; i < 6; i++) {
            confettiCtx.save();
            confettiCtx.rotate((Math.PI / 3) * i);
            
            // Main arm
            confettiCtx.beginPath();
            confettiCtx.moveTo(0, 0);
            confettiCtx.lineTo(0, -this.size);
            confettiCtx.stroke();
            
            // Small branch
            confettiCtx.beginPath();
            confettiCtx.moveTo(0, -this.size * 0.6);
            confettiCtx.lineTo(-this.size * 0.25, -this.size * 0.8);
            confettiCtx.moveTo(0, -this.size * 0.6);
            confettiCtx.lineTo(this.size * 0.25, -this.size * 0.8);
            confettiCtx.stroke();
            
            confettiCtx.restore();
        }
        
        confettiCtx.restore();
    }
}

function createSnowStorm() {
    // Cooldown check - prevent spam
    if (snowStormCooldown) return;
    
    // Limit max particles
    if (snowStormParticles.length >= MAX_SNOW_PARTICLES) {
        return;
    }
    
    // Calculate how many to add without exceeding limit
    const toAdd = Math.min(40, MAX_SNOW_PARTICLES - snowStormParticles.length);
    
    for (let i = 0; i < toAdd; i++) {
        const particle = new SnowStormParticle();
        particle.y = Math.random() * -400;
        snowStormParticles.push(particle);
    }
    
    isSnowStormActive = true;
    startEffectsAnimation();
    
    showKeyboardHint('❄️ Bão Tuyết ❄️');
    
    // Set cooldown
    snowStormCooldown = true;
    setTimeout(() => { snowStormCooldown = false; }, 500);
}

// ============ Keyboard Hint Display ============
function showKeyboardHint(message) {
    // Remove existing hint if any
    const existingHint = document.querySelector('.keyboard-hint');
    if (existingHint) existingHint.remove();
    
    const hint = document.createElement('div');
    hint.className = 'keyboard-hint';
    hint.innerHTML = message;
    document.body.appendChild(hint);
    
    // Animate in
    setTimeout(() => hint.classList.add('show'), 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        hint.classList.remove('show');
        setTimeout(() => hint.remove(), 500);
    }, 2000);
}

// ============ Background Music Control ============
function initMusicControl() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    if (!bgMusic || !musicToggle) return;
    
    let isPlaying = !bgMusic.paused;

    // Update button state based on current music state
    if (isPlaying) {
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-pause"></i><span class="music-pulse"></span>';
    }

    // Toggle music on button click
    musicToggle.addEventListener('click', () => {
        if (!bgMusic.paused) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.innerHTML = '<i class="fas fa-music"></i><span class="music-pulse"></span>';
        } else {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                musicToggle.innerHTML = '<i class="fas fa-pause"></i><span class="music-pulse"></span>';
            });
        }
    });

    // Update button icon based on play state
    bgMusic.addEventListener('play', () => {
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fas fa-pause"></i><span class="music-pulse"></span>';
    });

    bgMusic.addEventListener('pause', () => {
        musicToggle.classList.remove('playing');
        musicToggle.innerHTML = '<i class="fas fa-music"></i><span class="music-pulse"></span>';
    });
}

// Old initMusic function (kept for compatibility)
function initMusic() {
    // This is now handled by initMusicControl
}

// ============ Smooth Scroll for Navigation ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============ Performance Optimization ============
// Reduce animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations
        snowflakes.forEach(flake => flake.speed *= 0.1);
    } else {
        // Resume animations
        snowflakes.forEach(flake => flake.speed *= 10);
    }
});

// ============ Console Easter Egg ============
console.log('%c🎄 Merry Christmas! 🎄', 
    'font-size: 24px; color: #2ed573; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%c💕 Made with love for you 💕', 
    'font-size: 16px; color: #ff4757;');
