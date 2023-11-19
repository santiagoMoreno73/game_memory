document.addEventListener("DOMContentLoaded", () => {
  const moves = document.getElementById("moves-count");
  const timeValue = document.getElementById("time");
  const timeGif = document.getElementById("timeGif");
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");
  const gameContainer = document.querySelector(".game-container");
  const result = document.getElementById("result");
  const controls = document.querySelector(".controls-container");
  const wrapper = document.querySelector(".wrapper");
  const pumpkin = document.getElementById("pumpkin");

  let cards;
  let interval;
  let firstCard = false;
  let secondCard = false;

  // images
  const skeleton = "./assets/skeleton.gif";
  const question = "./assets/question_mark.png";
  const items = [
    { name: "pixel_1", image: "./assets/pixel_1.png" },
    { name: "pixel_2", image: "./assets/pixel_2.png" },
    { name: "pixel_3", image: "./assets/pixel_3.png" },
    { name: "pixel_4", image: "./assets/pixel_4.png" },
    { name: "pixel_5", image: "./assets/pixel_5.png" },
    { name: "pixel_6", image: "./assets/pixel_6.png" },
    { name: "pixel_7", image: "./assets/pixel_7.png" },
    { name: "pixel_8", image: "./assets/pixel_8.png" },
    { name: "pixel_9", image: "./assets/pixel_9.png" },
    { name: "pixel_10", image: "./assets/pixel_10.png" },
    { name: "pixel_11", image: "./assets/pixel_11.png" },
    { name: "pixel_12", image: "./assets/pixel_12.png" },
  ];

  // initial time
  let seconds = 0;
  let minutes = 0;

  // initial moves and win count
  let movesCount = 0;
  let winCount = 0;

  // for timer
  const timerGenerator = () => {
    seconds += 1;

    // minutes
    if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
    }

    // format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time: ${minutesValue}:${secondsValue}</span>`;
    timeGif.innerHTML = `<img src="${skeleton}" class="icon" alt="skeleton"/>`;
  };

  // for calculating moves
  const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves: ${movesCount}</span>`;
  };

  // pick random objects from the item array
  const generatorRandom = (size = 4) => {
    // tempo array
    let tempArray = [...items];
    // initializes cardValues array
    let cardValues = [];
    // size should be double (4*4 matriz)/2 since pairs of objects would exist
    size = (size * size) / 2;
    // random object selection
    for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * tempArray.length);
      cardValues.push(tempArray[randomIndex]);
      tempArray.splice(randomIndex, 1);
    }

    return cardValues;
  };

  const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];

    // simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
      gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${cardValues[i].name}"> 
          <div class="card-before">
              <img src="${question}" class="icon" alt="question"/>
          </div>
          <div class="card-after">
              <img src="${cardValues[i].image}" class="image" alt="img"/>
          </div>
      </div>
      `;
    }

    // grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    // cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        if (!card.classList.contains("matched")) {
          card.classList.add("flipped");

          if (!firstCard) {
            firstCard = card;
            firstCardValue = card.getAttribute("data-card-value");
          } else {
            // increment moves since user selected second card
            movesCounter();
            // secondCard and value
            secondCard = card;
            let secondCardValue = card.getAttribute("data-card-value");

            if (firstCardValue == secondCardValue) {
              firstCard.classList.add("matched");
              secondCard.classList.add("matched");

              firstCard = false;

              winCount += 1;

              if (winCount == Math.floor(cardValues.length / 2)) {
                result.innerHTML = `
                <h2>You Won</h2>
                <h4>Moves: ${movesCount}</h4>`;
                stopGame();
              }
            } else {
              // if cards dont match, back the cards to normal
              let [tempFirts, tempSecond] = [firstCard, secondCard];
              firstCard = false;
              secondCard = false;

              let delay = setTimeout(() => {
                tempFirts.classList.remove("flipped");
                tempSecond.classList.remove("flipped");
              }, 900);
            }
          }
        }
      });
    });
  };

  // start game
  startButton.addEventListener("click", () => {
    movesCount = 0;
    time = 0;
    seconds = 0;
    minutes = 0;

    // controls and buttons visibility
    wrapper.classList.remove("hide");
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    pumpkin.classList.add("hide");

    // start time
    interval = setInterval(timerGenerator, 1000);
    moves.innerHTML = `<span>Moves: ${movesCount}</span>`;

    initializer();
  });

  // stop game
  stopButton.addEventListener("click", () => stopGame());

  const stopGame = () => {
    controls.classList.remove("hide");
    wrapper.classList.add("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    pumpkin.classList.remove("hide");

    clearInterval(interval);
  };

  // initialized values and func calls
  const initializer = () => {
    result.innerText = "";
    winCount = 0;

    let cardValues = generatorRandom();
    matrixGenerator(cardValues);
  };
});
