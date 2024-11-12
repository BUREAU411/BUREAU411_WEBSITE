// Array of background images in the intended order
const backgrounds = [
    '904.jpg',                // First image to load immediately
    'DSCF6113.jpg',
    '03-min.jpg',             // Third in order
    '1A.jpg',                 // Fourth in order
    'A_5by4ratio.jpg',        // Fifth in order (Phase 2 loads up to here)
    '4S0A7447_Edited3.jpg',
    'DSCF5197_edited3.jpg',
    '06-min.jpg',             // Second to last
    '10.jpg',
    '4S0A7749-min.jpg'        // Last image in order (Phase 3 starts from here)
];

// Array of logo images
const logos = [
    'Logo - BUREAU411 BLACK.png',
    'Logo - BUREAU411 CYAN.png',
    'Logo - BUREAU411 RED.png'
];

// Index to keep track of the current background and logo images
let currentBackgroundIndex = 0;
let currentLogoIndex = 0;

// Variable to control whether the logo should change
let shouldChangeLogo = true;

// Phase 1: Load and display the first image immediately
function loadInitialBackground() {
    document.body.style.backgroundImage = `url(${backgrounds[0]})`;
}

// Phase 2: Preload the next group of images (2nd - 5th)
function preloadGroupTwo() {
    for (let i = 1; i <= 4; i++) {
        const img = new Image();
        img.src = backgrounds[i];
    }
}

// Phase 3: Preload the final group of images (6th - last)
function preloadGroupThree() {
    for (let i = 5; i < backgrounds.length; i++) {
        const img = new Image();
        img.src = backgrounds[i];
    }
}

// Function to change the background image with robust preloading
function changeBackground() {
    const img = new Image();
    img.src = backgrounds[currentBackgroundIndex];

    // Advance index before attempting to load the image
    const nextIndex = (currentBackgroundIndex + 1) % backgrounds.length;

    // Set the background once the image is fully loaded
    img.onload = () => {
        document.body.style.backgroundImage = `url(${img.src})`;
        currentBackgroundIndex = nextIndex;

        // Trigger phase 2 and 3 preloading based on index
        if (currentBackgroundIndex === 1) preloadGroupTwo();
        if (currentBackgroundIndex === 5) preloadGroupThree();
    };

    // Fallback to update index even if image fails to load
    img.onerror = () => {
        currentBackgroundIndex = nextIndex;
    };
}

// Start the background change rotation every 3 seconds
function startBackgroundRotation() {
    setInterval(changeBackground, 3000);
}

// Function to change the logo image
function changeLogo() {
    if (shouldChangeLogo) {
        const logoElement = document.querySelector(".logo");
        logoElement.src = logos[currentLogoIndex];
        currentLogoIndex = (currentLogoIndex + 1) % logos.length;
    }
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to change the button text color to a random color
function changeButtonTextColor(button) {
    button.style.color = getRandomColor();
}

// Function to start the random color change for buttons
function startRandomColorChangeForButtons() {
    const buttons = document.querySelectorAll('.button');
    const intervals = [];

    buttons.forEach(button => {
        const intervalId = setInterval(() => {
            changeButtonTextColor(button);
        }, Math.random() * (4000 - 500) + 500);
        intervals.push(intervalId);
    });

    setTimeout(() => {
        buttons.forEach(button => {
            button.style.color = 'white';
        });
        intervals.forEach(intervalId => clearInterval(intervalId));
    }, 10000);
}

// Function to handle the 10-second color change period
function startColorChangeCycle() {
    startRandomColorChangeForButtons();
}

// Set the first color change cycle to start 20 seconds after the site loads
setTimeout(() => {
    startColorChangeCycle();
    shouldChangeLogo = false;
    
    setTimeout(() => {
        shouldChangeLogo = true;
    }, 10000);

    setInterval(() => {
        startColorChangeCycle();
        shouldChangeLogo = false;

        setTimeout(() => {
            shouldChangeLogo = true;
        }, 10000);
    }, 40000);
}, 20000);

// Initialize background loading and rotation
loadInitialBackground();       // Load first image immediately
startBackgroundRotation();      // Begin rotation based on preloading conditions

// Change logo every 5 seconds (only if allowed)
setInterval(changeLogo, 5000);

// Initialize with the first logo
changeLogo();
