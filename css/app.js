// Features Data - Updated with Live Chat & Snapchat Location
const features = {
    location: { 
        title: "Track and find the live location of any user", 
        image: "https://i.ibb.co/MkqyP7cV/eb52a493-9129-4068-9dd6-2c043bcdf30d.jpg",             // Replace with your location preview image URL
        buttonText: "Find Location" 
    },
    score: { 
        title: "See who may have viewed your score", 
        image: "https://i.imgur.com/45LjpnN.png", 
        buttonText: "Reveal Score Checks" 
    },
    friends: { 
        title: "8 Best Friends of any user", 
        image: "https://i.imgur.com/aUKnqwv.png", 
        buttonText: "Reveal" 
    },
    livechat: { 
        title: "Spy their live chat activity in real-time",   // This will show in modal
        image: "https://i.imgur.com/bBCUV7x.png",              // Same image as chat history
        buttonText: "Start Spying" 
    },
    memories: { 
        title: "Access My Eyes Only content of any user", 
        image: "https://i.imgur.com/Z30yUJ1.png", 
        buttonText: "Reveal" 
    },
    chat: { 
        title: "Message history of any user", 
        image: "https://i.imgur.com/bBCUV7x.png", 
        buttonText: "Reveal" 
    }
};

// Progress Steps
const progressSteps = [
    { message: "Initializing OnlyTraced exploit", progress: 0 },
    { message: "Bypassing 2FA Authentication", progress: 25 },
    { message: "2FA Authentication successfully bypassed", progress: 50 },
    { message: "Compiling display", progress: 75 },
    { message: "Success - user will not be notified", progress: 100 }
];

// State
let isConnected = false;
let connectedUsername = '';

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const usernameInput = document.getElementById('usernameInput');
const submitBtn = document.getElementById('submitBtn');
const connectionForm = document.getElementById('connectionForm');
const errorMessage = document.getElementById('errorMessage');
const connectionStatus = document.getElementById('connectionStatus');
const connectedUsernameSpan = document.getElementById('connectedUsername');
const validIcon = document.getElementById('validIcon');
const invalidIcon = document.getElementById('invalidIcon');
const formTitle = document.getElementById('formTitle');
const featureCards = document.querySelectorAll('.feature-card');
const featureModal = document.getElementById('featureModal');
const modalTitle = document.getElementById('modalTitle');
const previewImage = document.getElementById('previewImage');
const revealBtn = document.getElementById('revealBtn');
const initialSection = document.getElementById('initialSection');
const progressSection = document.getElementById('progressSection');
const verificationSection = document.getElementById('verificationSection');
const progressBar = document.getElementById('progressBar');
const progressMessage = document.getElementById('progressMessage');
const progressPercent = document.getElementById('progressPercent');
const privacyLink = document.getElementById('privacyLink');
const privacyModal = document.getElementById('privacyModal');
const closePrivacy = document.getElementById('closePrivacy');
const currentDate = document.getElementById('currentDate');

// Theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.body.classList.toggle('dark', savedTheme === 'dark');
    updateThemeIcon(savedTheme === 'dark');
    localStorage.setItem('theme', savedTheme);
}

function updateThemeIcon(isDark) {
    sunIcon.classList.toggle('hidden', isDark);
    moonIcon.classList.toggle('hidden', !isDark);
}

themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
});

// Username Validation
function validateUsername(username) {
    if (username.length < 4 || username.length > 15) return { valid: false, message: "Username must be between 4 and 15 characters" };
    if (!/^[a-z0-9_.-]+$/.test(username)) return { valid: false, message: "Only letters, numbers, dots, underscores, and hyphens allowed" };
    if (/^\d+$/.test(username)) return { valid: false, message: "Username cannot contain only numbers" };
    return { valid: true, message: "" };
}

usernameInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase().trim();
    e.target.value = value;

    if (!value) {
        errorMessage.classList.add('hidden');
        validIcon.classList.add('hidden');
        invalidIcon.classList.add('hidden');
        usernameInput.classList.remove('valid', 'invalid');
        return;
    }

    const validation = validateUsername(value);
    if (validation.valid) {
        errorMessage.classList.add('hidden');
        validIcon.classList.remove('hidden');
        invalidIcon.classList.add('hidden');
        usernameInput.classList.add('valid');
        usernameInput.classList.remove('invalid');
    } else {
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = validation.message;
        validIcon.classList.add('hidden');
        invalidIcon.classList.remove('hidden');
        usernameInput.classList.remove('valid');
        usernameInput.classList.add('invalid');
    }
});

// Connect / Disconnect
connectionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (isConnected) {
        isConnected = false;
        connectedUsername = '';
        usernameInput.value = '';
        usernameInput.disabled = false;
        submitBtn.textContent = 'Connect';
        submitBtn.classList.remove('btn-disconnect');
        submitBtn.classList.add('btn-primary');
        connectionStatus.classList.add('hidden');
        formTitle.textContent = 'Enter the username you want to check';
        featureCards.forEach(card => card.classList.add('disabled'));
        return;
    }

    const username = usernameInput.value.trim().toLowerCase();
    const validation = validateUsername(username);
    if (!validation.valid) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<div class="spinner"></div>';

    await new Promise(resolve => setTimeout(resolve, 1500));

    isConnected = true;
    connectedUsername = username;
    usernameInput.disabled = true;
    submitBtn.disabled = false;
    submitBtn.textContent = 'Disconnect';
    submitBtn.classList.remove('btn-primary');
    submitBtn.classList.add('btn-disconnect');
    connectionStatus.classList.remove('hidden');
    connectedUsernameSpan.textContent = username;
    formTitle.textContent = '';
    featureCards.forEach(card => card.classList.remove('disabled'));
});

// Feature Click Handler
featureCards.forEach(card => {
    card.addEventListener('click', () => {
        if (!isConnected || card.classList.contains('disabled')) return;

        const featureKey = card.dataset.feature;
        const data = features[featureKey];

        // This is the key part - it uses the correct title and button text for Live Chat
        modalTitle.textContent = data.title;
        previewImage.src = data.image;
        revealBtn.querySelector('span').textContent = data.buttonText;

        initialSection.classList.remove('hidden');
        progressSection.classList.add('hidden');
        verificationSection.classList.add('hidden');
        
        // Ensure standard display block state resets before modal opens
        document.getElementById('modalPreview').classList.remove('hidden');
        
        featureModal.classList.add('active');
    });
});

// Reveal Button Logic
revealBtn.addEventListener('click', () => {
    initialSection.classList.add('hidden');
    progressSection.classList.remove('hidden');
    document.getElementById('modalPreview').classList.add('hidden');

    let step = 0;
    const interval = setInterval(() => {
        if (step < progressSteps.length) {
            const current = progressSteps[step];
            progressBar.style.width = current.progress + '%';
            progressMessage.textContent = current.message;
            progressPercent.textContent = current.progress + '%';
            step++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                progressSection.classList.add('hidden');
                verificationSection.classList.remove('hidden');
            }, 600);
        }
    }, 900);
});

// Modals
featureModal.addEventListener('click', (e) => {
    if (e.target === featureModal) featureModal.classList.remove('active');
});

privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    currentDate.textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    privacyModal.classList.add('active');
});

closePrivacy.addEventListener('click', () => privacyModal.classList.remove('active'));
privacyModal.addEventListener('click', (e) => {
    if (e.target === privacyModal) privacyModal.classList.remove('active');
});

// Init
initTheme();