const display = document.getElementById('display');
const modulusInput = document.getElementById('modulusInput');
const mainTitle = document.getElementById('mainTitle');
const settingsMenu = document.getElementById('settingsMenu');

const MIN_MODULUS = 2;
const MAX_MODULUS = 1000000;
const MAX_DISPLAY_LENGTH = 14;

const MODS = [19, 21, 0, 17, 3, 12, 5, 9, 14, 1, 16,  2, 18, 20,  6, 15,  7, 10, 13,  8, 11,  4];
const KEY  = [ 1,  1, 1,  1, 2,  2, 2, 1,  1, 1,  1, -1, -1, -1, -1, -2, -2, -2, -1, -1, -1, -1];

let currentInput = ''; 
let calculationDone = false;
let modulus = 22; // Valor por defecto
let gameMode = true; // Por defecto está activado

// Función para mostrar/ocultar el menú de configuración
function toggleSettingsMenu() {
    settingsMenu.classList.toggle('hidden');
}

// Función para actualizar el título principal
function updateTitle() {
    mainTitle.textContent = `Modulus ${modulus} Calculator`;
}

// Función para actualizar la pantalla
function updateDisplay() {
    display.textContent = currentInput || ' ';
}

// Función para establecer un nuevo módulo desde el menú
function setModulus() {
    const newModulus = parseInt(modulusInput.value, 10);
    if (!isNaN(newModulus) && newModulus >= MIN_MODULUS && newModulus <= MAX_MODULUS) {
        modulus = newModulus;
        updateTitle();
        toggleSettingsMenu();
    } else {
        modulusInput.value = modulus;
    }
}

// Función para añadir un número
function appendNumber(number) {
    if (calculationDone) {
        currentInput = ''; 
        calculationDone = false;
    }

    if (currentInput.length >= MAX_DISPLAY_LENGTH) {
        return; 
    }

    currentInput += number;
    updateDisplay();
}

// Función para limpiar la pantalla (AC)
function clearDisplay() {
    currentInput = ''; 
    calculationDone = false;
    updateDisplay();
}

// Función para borrar el último dígito
function deleteLast() {
    if (calculationDone) {
        clearDisplay();
        return;
    }
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = ''; 
    }
    updateDisplay();
}

// Función para mostrar el emoticono
function showEmoticon(type) {
    let emoticonEl = document.getElementById('emoticon-overlay');
    if (!emoticonEl) {
        emoticonEl = document.createElement('div');
        emoticonEl.id = 'emoticon-overlay';
        emoticonEl.style.position = 'absolute';
        emoticonEl.style.left = '50%';
        emoticonEl.style.fontSize = '200px';
        emoticonEl.style.zIndex = '1000';
        emoticonEl.style.pointerEvents = 'none';
        document.body.appendChild(emoticonEl);
    }
    
    // Elimina cualquier transición anterior para resetear inmediatamente
    emoticonEl.style.transition = 'none';
    
    // Resetea el estado inicial del emoticono
    emoticonEl.style.opacity = '1';
    
    if (type === 'heart') {
        emoticonEl.textContent = '❤️';
    } else if (type === 'broken_heart') {
        emoticonEl.textContent = '💔';
    } else if (type === 'up') {
        emoticonEl.textContent = '👍';
    } else if (type === 'down') {
        emoticonEl.textContent = '👎';
    }
    
    // Posición inicial fija en el centro
    emoticonEl.style.top = '50%';
    
    // Filtro para invertir el color si es corazón roto
    emoticonEl.style.filter = type === 'broken_heart' ? 'hue-rotate(90deg) invert(100%)' : 'none';
    
    // Si es corazón roto, la escala inicial debe ser mayor para contraerse y aplicar rotación
    const initialScale = type === 'broken_heart' ? 1.5 : 1;
    const rotation = type === 'broken_heart' ? ' rotate(30deg)' : '';
    emoticonEl.style.transform = `translate(-50%, -50%) scale(${initialScale})${rotation}`;
    
    // Forzamos el reflow para aplicar el reseteo sin animación
    void emoticonEl.offsetWidth;
    
    // Añadimos la transición
    emoticonEl.style.transition = 'all 2s ease-out';
    
    if (type === 'heart') {
        emoticonEl.style.transform = 'translate(-50%, -50%) scale(3)';
    } else if (type === 'broken_heart') {
        emoticonEl.style.transform = 'translate(-50%, -50%) scale(0.3) rotate(30deg)';
    } else {
        const translateY = type === 'up' ? '-150%' : '50%';
        emoticonEl.style.transform = `translate(-50%, ${translateY}) scale(1)`;
    }
    
    emoticonEl.style.opacity = '0';
}

// Función para calcular el módulo
function calculateModulo() {
    try {
        const number = BigInt(currentInput || '0');
        const result = number % BigInt(modulus);
        currentInput = result.toString();
        
        if (modulus === 22 && gameMode) {
            const resultInt = parseInt(result.toString(), 10);
            const index = MODS.indexOf(resultInt);
            if (index !== -1) {
                const keyVal = KEY[index];
                if (keyVal === 2) {
                    showEmoticon('heart');
                } else if (keyVal === -2) {
                    showEmoticon('broken_heart');
                } else if (keyVal === 1) {
                    showEmoticon('up');
                } else if (keyVal === -1) {
                    showEmoticon('down');
                }
            }
        }
    } catch (error) {
        currentInput = 'Error';
    }
    calculationDone = true;
    updateDisplay();
}

// Manejar la entrada del teclado físico
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === 'Backspace') {
        deleteLast();
    } else if (event.key === 'Escape' || event.key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculateModulo();
    }
});

// Se ejecuta cuando la página ha cargado completamente
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const numParam = urlParams.get('num');
    const gameParam = urlParams.get('game');

    if (numParam) {
        const parsedNum = parseInt(numParam, 10);
        if (!isNaN(parsedNum) && parsedNum >= MIN_MODULUS && parsedNum <=MAX_MODULUS) {
            modulus = parsedNum;
        }
    }

    if (gameParam === 'false' || gameParam === '0') {
        gameMode = false;
    }
    
    // Sincroniza el valor del módulo con el campo de entrada
    modulusInput.value = modulus;    
    
    // Actualiza la UI inicial
    updateDisplay();
    updateTitle();
};

// Función para aplicar la escala a la calculadora
function setScale() {
    const scaleValue = document.getElementById('scaleInput').value;
    const calculatorContainer = document.getElementById('calculator-container');
    
    // Validamos que el contenedor y el valor existan
    if (calculatorContainer && scaleValue) {
        calculatorContainer.style.transform = `scale(${scaleValue})`;
    }
};

document.addEventListener('DOMContentLoaded', setScale);