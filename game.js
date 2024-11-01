const startButton = document.getElementById("start-screen__button");
const cardsContainer = document.getElementById("game-screen__cards-container");
const numberInput = document.getElementById("start-screen__number");
const gameScreen = document.getElementById("game-screen");
const startScreen = document.getElementById("start-screen");
const checkboxes = document.querySelectorAll(".start-screen__checkbox");
const errorText = document.getElementById("start-screen__error");

let cardCount;
let luckyCardIndex = -1;
let cardClicked = false;

window.addEventListener("load", () => {
  if (sessionStorage.getItem("cardCount")) {
    cardCount = +sessionStorage.getItem("cardCount");
    luckyCardIndex = +sessionStorage.getItem("luckyCardIndex");
    startScreen.style.display = "none";
    gameScreen.style.display = "flex";
    startGame();
  }
});

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const isManualSelected = document.querySelector(
      'input[value="manual"]:checked'
    );
    if (isManualSelected) {
      numberInput.style.visibility = "visible";
    } else {
      numberInput.style.visibility = "hidden";
      numberInput.value = "";
    }
    errorText.style.visibility = "hidden";
    numberInput.classList.remove("invalid");
  });
});

numberInput.addEventListener("blur", () => {
  const inputValue = +numberInput.value;
  if (inputValue > 9 || inputValue < 2) {
    numberInput.classList.add("invalid");
    errorText.textContent = "Введите количество карт от 2 до 9";
    errorText.style.visibility = "visible";
  }
});

numberInput.addEventListener("focus", () => {
  if (numberInput.classList.contains("invalid")) {
    numberInput.classList.remove("invalid");
    errorText.style.visibility = "hidden";
  }
});

startButton.addEventListener("click", () => {
  const selectedLevel = document.querySelector(
    ".start-screen__checkbox input:checked"
  );

  if (selectedLevel) {
    if (selectedLevel.value === "manual") {
      cardCount = +numberInput.value;
      if (cardCount < 2 || cardCount > 9) {
        errorText.textContent = "Введите количество карт от 2 до 9";
        errorText.style.display = "inline";
        return;
      }
    } else {
      cardCount = +selectedLevel.value;
    }
    startScreen.style.display = "none";
    gameScreen.style.display = "flex";

    startGame();
  } else {
    errorText.textContent = "Пожалуйста, выберите уровень сложности.";
    errorText.style.display = "inline";
  }
});

function startGame() {
  if (luckyCardIndex === -1) {
    luckyCardIndex = Math.floor(Math.random() * cardCount);
  }
  sessionStorage.setItem("cardCount", cardCount);
  sessionStorage.setItem("luckyCardIndex", luckyCardIndex);

  createCard();
}

function createCard() {
  const images = [
    "./img/img1.jpg",
    "./img/img2.jpg",
    "./img/img3.jpg",
    "./img/img4.jpg",
    "./img/img5.jpg",
    "./img/img6.jpg",
    "./img/img7.jpg",
    "./img/img8.jpg",
    "./img/img9.jpg",
  ];

  for (let i = 0; i < cardCount; i++) {
    const card = document.createElement("div");
    card.classList.add("game-screen__card");
    card.style.backgroundImage = `url(${images[i]})`;

    card.dataset.result =
      i === luckyCardIndex
        ? "Вы выиграли!"
        : "Вы проиграли, попробуйте еще раз!";

    card.addEventListener("click", (event) => {
      if (!cardClicked) {
        card.classList.add("flipped");
        cardClicked = true;
        event.stopPropagation();
      }
    });

    cardsContainer.appendChild(card);
  }
}

window.addEventListener("click", () => {
  if (cardClicked) {
    resetGame();
  }
});

function resetGame() {
  startScreen.style.display = "flex";
  gameScreen.style.display = "none";
  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }
  sessionStorage.removeItem("cardCount");
  sessionStorage.removeItem("luckyCardIndex");
  cardClicked = false;
  luckyCardIndex = -1;
}
