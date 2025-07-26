const display = document.getElementById('display');
const modulusInput = document.getElementById('modulusInput');
const mainTitle = document.getElementById('mainTitle');
const settingsMenu = document.getElementById('settingsMenu');

let currentInput = ''; 
let calculationDone = false;
let modulus = 22; // Valor por defecto

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
    if (!isNaN(newModulus) && newModulus > 0) {
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
    if (currentInput === '0') {
        currentInput = number;
    } else {
        currentInput += number;
    }
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

// Función para calcular el módulo
function calculateModulo() {
    try {
        const number = BigInt(currentInput || '0');
        const result = number % BigInt(modulus);
        currentInput = result.toString();
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

    if (numParam) {
        const parsedNum = parseInt(numParam, 10);
        if (!isNaN(parsedNum) && parsedNum > 0) {
            modulus = parsedNum;
        }
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