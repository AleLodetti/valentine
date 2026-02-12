// Initialize configuration
const config = window.VALENTINE_CONFIG;

// Validate configuration
function validateConfig() {
    const warnings = [];
    if (!config.valentineName) {
        config.valentineName = "My Love";
    }
    // Validate colors
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            config.colors[key] = getDefaultColor(key);
        }
    });
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle;

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    validateConfig();

    // 1. Imposta i testi (TITOLO)
    document.getElementById('valentineTitle').textContent = `${config.valentineName}, my love...`;
    
    // 2. Imposta i testi (PRIMA DOMANDA)
    document.getElementById('question1Text').textContent = config.questions.first.text;
    const yesBtn1 = document.getElementById('yesBtn1');
    const noBtn1 = document.getElementById('noBtn1');
    yesBtn1.textContent = config.questions.first.yesBtn;
    noBtn1.textContent = config.questions.first.noBtn;
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;

    // --- LOGICA PRIMA DOMANDA ---
    yesBtn1.addEventListener('click', () => showNextQuestion(2)); // Il Sì porta alla domanda 2
    noBtn1.addEventListener('click', (e) => moveButton(e.target)); // Il No scappa

    
    // 3. Imposta i testi (SECONDA DOMANDA - LOVE METER)
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.textContent = config.questions.second.nextBtn;

    // --- LOGICA SECONDA DOMANDA ---
    nextBtn.addEventListener('click', () => showNextQuestion(3)); // Il Next porta alla domanda 3
    
    
    // 4. Imposta i testi (TERZA DOMANDA - FINALE)
    document.getElementById('question3Text').textContent = config.questions.third.text;
    const yesBtn3 = document.getElementById('yesBtn3');
    const noBtn3 = document.getElementById('noBtn3');
    yesBtn3.textContent = config.questions.third.yesBtn;
    noBtn3.textContent = config.questions.third.noBtn;

    // --- LOGICA TERZA DOMANDA ---
    yesBtn3.addEventListener('click', () => celebrate()); // Il Sì finale fa partire la festa
    noBtn3.addEventListener('click', (e) => moveButton(e.target)); // Il No finale scappa


    // Create initial floating elements
    createFloatingElements();
    setupMusicPlayer();
});

// --- FUNZIONI DI UTILITÀ ---

function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if(!container) return; // Sicurezza se manca il div
    
    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });

    config.floatingEmojis.bears.forEach(bear => {
        const div = document.createElement('div');
        div.className = 'bear';
        div.innerHTML = bear;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = Math.random() * 5 + 's';
    element.style.animationDuration = 10 + Math.random() * 20 + 's';
}

function showNextQuestion(questionNumber) {
    // Nascondi tutte le sezioni
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    // Mostra quella richiesta
    const nextQ = document.getElementById(`question${questionNumber}`);
    if(nextQ) nextQ.classList.remove('hidden');
}

function moveButton(button) {
    // Calcola nuova posizione random
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    
    // Applica stile fixed per muoverlo liberamente
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
}

// Love meter functionality
const loveMeter = document.getElementById('loveMeter');
const loveValue = document.getElementById('loveValue');
const extraLove = document.getElementById('extraLove');

function setInitialPosition() {
    if(!loveMeter) return;
    loveMeter.value = 100;
    if(loveValue) loveValue.textContent = 100;
    loveMeter.style.width = '100%';
}

if(loveMeter) {
    loveMeter.addEventListener('input', () => {
        const value = parseInt(loveMeter.value);
        if(loveValue) loveValue.textContent = value;
        
        if (value > 100) {
            extraLove.classList.remove('hidden');
            // Calcolo effetto visivo overflow
            const overflowPercentage = (value - 100) / 9900; 
            const extraWidth = overflowPercentage * window.innerWidth * 0.8;
            loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
            loveMeter.style.transition = 'width 0.3s';
            
            if (value >= 5000) {
                extraLove.classList.add('super-love');
                extraLove.textContent = config.loveMessages.extreme;
            } else if (value > 1000) {
                extraLove.classList.remove('super-love');
                extraLove.textContent = config.loveMessages.high;
            } else {
                extraLove.classList.remove('super-love');
                extraLove.textContent = config.loveMessages.normal;
            }
        } else {
            extraLove.classList.add('hidden');
            extraLove.classList.remove('super-love');
            loveMeter.style.width = '100%';
        }
    });
}

window.addEventListener('DOMContentLoaded', setInitialPosition);

function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');
    
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;
    
    createHeartExplosion();
}

function createHeartExplosion() {
    const container = document.querySelector('.floating-elements');
    if(!container) return;

    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        const randomHeart = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.innerHTML = randomHeart;
        heart.className = 'heart';
        container.appendChild(heart);
        setRandomPosition(heart);
    }
}

function setupMusicPlayer() {
    const musicControls = document.getElementById('musicControls');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicSource = document.getElementById('musicSource');

    if (!config.music.enabled || !musicControls) {
        if(musicControls) musicControls.style.display = 'none';
        return;
    }

    musicSource.src = config.music.musicUrl;
    bgMusic.volume = config.music.volume || 0.5;
    bgMusic.load();

    if (config.music.autoplay) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented by browser");
                musicToggle.textContent = config.music.startText;
            });
        }
    }

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = config.music.stopText;
        } else {
            bgMusic.pause();
            musicToggle.textContent = config.music.startText;
        }
    });
}