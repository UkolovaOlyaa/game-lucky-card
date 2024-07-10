const startButton = document.getElementById('start-button');
const cardsContainer = document.getElementById('cards-container');
const manualInput = document.getElementById('manual-input');
const gameScreen = document.getElementById('game-screen');
const startScreen = document.getElementById('start-screen');
const levelCheckboxes = document.querySelectorAll('.level-checkbox');
const errorText = document.getElementById('error');

let cardCount;
let luckyCardIndex = -1;
let cardClicked = false;

window.addEventListener('load', () => {
    if (sessionStorage.getItem('cardCount')) {
        cardCount = +sessionStorage.getItem('cardCount');  
        luckyCardIndex = +sessionStorage.getItem('luckyCardIndex');
        startScreen.style.display = 'none';
        gameScreen.style.display = 'flex';
        startGame();
    }
});


function resetCheckboxes() {
    levelCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    manualInput.style.visibility = 'hidden';
}

levelCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            resetCheckboxes();
            checkbox.checked = true;
            if (checkbox.value === 'manual') {
                manualInput.style.visibility = 'visible';
            } 
            manualInput.value = '';
        } else {
            manualInput.style.visibility = 'hidden';
        }
        errorText.style.display = 'none'; 
    });
});

manualInput.addEventListener('blur', () => {
    const inputValue = +manualInput.value;
    if (inputValue > 9 || inputValue < 2) {
        manualInput.classList.add('invalid');
        errorText.textContent = inputValue < 2 ? 'Нужно минимум 2 карты!' : 'Нельзя сгенерировать больше 9 карт!';
        errorText.style.display = 'inline'; 
    }
});

manualInput.addEventListener('focus', () => {
    if (manualInput.classList.contains('invalid')) {
        manualInput.classList.remove('invalid');
        errorText.style.display = 'none';
    }
});

startButton.addEventListener('click', () => {
    const selectedLevel = document.querySelector('.level-checkbox:checked');
    if (selectedLevel) {
        if (selectedLevel.value === 'manual') {
            cardCount = +manualInput.value;
            if (cardCount < 2 || cardCount > 9) {
                errorText.textContent = 'Введите количество кар от 2 до 9';
                errorText.style.display = 'inline';
                return;
            }
        } else {
            cardCount = +selectedLevel.value;
        }
        startScreen.style.display = 'none';
        gameScreen.style.display = 'flex';

        startGame(); 
    } else {
        errorText.textContent = 'Пожалуйста, выберите уровень сложности.';
        errorText.style.display = 'inline';
    }
});

function startGame() {
    if(luckyCardIndex === -1){
        luckyCardIndex = Math.floor(Math.random() * cardCount);
    }
    sessionStorage.setItem('cardCount', cardCount);
    sessionStorage.setItem('luckyCardIndex', luckyCardIndex);

    createCard();
}

function createCard() {
    for (let i = 0; i < cardCount; i++) {
        const card = document.createElement('div');
        card.classList.add('card');

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        card.appendChild(cardInner);

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');
        cardFront.textContent = `Карта ${i + 1}`;
        cardInner.appendChild(cardFront);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        i === luckyCardIndex ? cardBack.textContent = 'Вы выиграли!' : cardBack.textContent = 'Вы проиграли, попробуйте еще раз!';
        
        cardInner.appendChild(cardBack);

        card.addEventListener('click', (event) => {
            if (!cardClicked) {
                card.classList.add('flipped');
                cardClicked = true;
                event.stopPropagation();
            }
        });

        cardsContainer.appendChild(card);
    }
}


window.addEventListener('click', () => {
    if (cardClicked) {
        resetGame();
    }
});

function resetGame() {
    startScreen.style.display = 'flex';
    gameScreen.style.display = 'none';
    while (cardsContainer.firstChild) {
        cardsContainer.removeChild(cardsContainer.firstChild);
    }
    sessionStorage.removeItem('cardCount');
    sessionStorage.removeItem('luckyCardIndex');
    cardClicked = false;
    luckyCardIndex = -1;
}
