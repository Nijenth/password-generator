const resultEl = document.getElementById('result');
const lengthEl = document.getElementById('length');
const lengthValEl = document.getElementById('length-val');
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');
const generateEl = document.getElementById('generate');
const clipboardEl = document.getElementById('clipboard');

const randomFunc = {
    lower: getRandomLower,
    upper: getRandomUpper,
    number: getRandomNumber,
    symbol: getRandomSymbol
};

// Update length display
lengthEl.addEventListener('input', (e) => {
    lengthValEl.innerText = e.target.value;
});

// Copy password to clipboard
clipboardEl.addEventListener('click', () => {
    const password = resultEl.innerText;
    if (!password) {
        return;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(password).then(() => {
        const icon = clipboardEl.querySelector('i');
        
        // Change icon to check mark
        icon.className = 'fas fa-check copied';
        icon.style.color = 'var(--success)';
        
        // Revert back to clipboard icon
        setTimeout(() => {
            icon.className = 'far fa-clipboard';
            icon.style.color = '';
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
});

// Generate password on button click
generateEl.addEventListener('click', () => {
    const length = +lengthEl.value;
    const hasLower = lowercaseEl.checked;
    const hasUpper = uppercaseEl.checked;
    const hasNumber = numbersEl.checked;
    const hasSymbol = symbolsEl.checked;

    resultEl.innerText = generatePassword(hasLower, hasUpper, hasNumber, hasSymbol, length);
    
    // Add a slight animation to the result text to indicate change
    resultEl.style.opacity = '0';
    setTimeout(() => {
        resultEl.style.transition = 'opacity 0.2s';
        resultEl.style.opacity = '1';
    }, 50);
});

// Main generate function
function generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    
    // Filter out unchecked types
    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(item => Object.values(item)[0]);

    // If no checkboxes are selected, return empty
    if (typesCount === 0) {
        return '';
    }

    // Determine how many characters of each type to guarantee
    const guaranteedChars = typesArr.map(type => {
        const funcName = Object.keys(type)[0];
        return randomFunc[funcName]();
    });

    // Fill the rest of the password length randomly from selected types
    for (let i = guaranteedChars.length; i < length; i++) {
        const randomType = typesArr[Math.floor(Math.random() * typesArr.length)];
        const funcName = Object.keys(randomType)[0];
        generatedPassword += randomFunc[funcName]();
    }

    // Combine guaranteed characters and randomly selected characters
    generatedPassword = guaranteedChars.join('') + generatedPassword;

    // Shuffle the final password to ensure randomness
    const finalPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('');

    return finalPassword;
}

// Random character generator functions
function getRandomLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
}

function getRandomUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65); // A-Z
}

function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48); // 0-9
}

function getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.';
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Generate an initial password on page load
generateEl.click();
