// Obtener los elementos del DOM
const hand = document.querySelector('.hand');
const bugs = document.querySelector('.bugs');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');
const scoresContainer = document.getElementById('scores-container'); 
const scoreList = document.getElementById('score-list');



/*/ Variables para llevar la cuenta del puntaje, el tiempo restante
 y la velocidad de generación de cucarachas */

let score = 0;
let timeLeft = 30;
let bugInterval = 1000;
let intervalId;


// Función para generar una cucaracha aleatoria
function createBug() {
  const bug = document.createElement('div');
  bug.classList.add('bug');
  bug.style.top = `${Math.random() * 350}px`;
  bug.style.left = `${Math.random() * 350}px`;
  bug.addEventListener('click', () => {
    // Si se hace clic en una cucaracha, aumentar el puntaje y eliminar la cucaracha del DOM
    score++;
    scoreEl.textContent = score;
    bugs.removeChild(bug);
  });
  bugs.appendChild(bug);
}
//Aumentar velocidad
function increaseBugSpeed() {
  if (bugInterval > 500) { // velocidad máxima
    bugInterval -= 100;
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      createBug(); // cambiar a createBug()
    }, bugInterval);
    setTimeout(increaseBugSpeed, 5000);
  }
}
// Funcion si perdes
function generateBug() {
  createBug();
  if (bugs.children.length >= 10) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Perdiste Hay PLAGAA!!.',
    });
  }
}

//Funciond e guardar resultado
function saveScore(name) {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.push({ name, score });
  localStorage.setItem('scores', JSON.stringify(scores));
}

function renderScores(scores) {
  scores.sort((a, b) => b.score - a.score);
  const topScores = scores.slice(0, 5);
  const scoreItems = topScores.map((score, index) => {
    const name = score.name || 'Jugador';
    return `<li>${index + 1}. ${name}: ${score.score}</li>`;
  });
  scoreList.innerHTML = scoreItems.join('');
}

//Funcion al iniciar el juego mostrando resultados maximos y usuarios de la API
function showScores() {
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  const scoreContainer = document.querySelector('.score-container');
  scoreContainer.innerHTML = ''; // Limpiar contenido anterior del elemento
  if (scores.length <= 5) {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(users => {
        for (let i = scores.length; i < 5; i++) {
          const user = users[scores.length + i];
          const name = user.name.split(' ')[0];
          scores.push({ name, score: 0 });
        }
        localStorage.setItem('scores', JSON.stringify(scores));
        renderScores(scores);
        const userList = document.createElement('ul');
        users.forEach(user => {
          const userItem = document.createElement('li');
          userItem.textContent = user.name;
          userList.appendChild(userItem);
        });
        scoreContainer.appendChild(userList); // Agregar lista de usuarios
      });
  } else {
    renderScores(scores);
    const userList = document.createElement('ul');
    users.forEach(user => {
      const userItem = document.createElement('li');
      userItem.textContent = user.name;
      userList.appendChild(userItem);
    });
    scoreContainer.appendChild(userList); // Agregar lista de usuarios
  }
}


// llamar cuando el juego se reinicio
function resetGame() {
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  clearInterval(intervalId);
  clearInterval(timerId);
  startButton.disabled = false;
  bugs.querySelectorAll('.bug').forEach(bug => {
    bugs.removeChild(bug);
  });
  showScores();
  saveScore();
  
}



// Función para mover la mano de gatito con el cursor del mouse
function moveHand(e) {
  const x = e.clientX - bugs.offsetLeft - hand.offsetWidth / 2;
  const y = e.clientY - bugs.offsetTop - hand.offsetHeight / 2;
  hand.style.transform = `translate(${x}px, ${y}px)`;
}

// Función para actualizar el tiempo restante y reiniciar el juego si se acaba el tiempo
function checkTime() {
  timeLeft--;
  timerEl.textContent = timeLeft;
  if (timeLeft === 0) {
    const name = prompt('Ingresa tu nombre:');
    saveScore(name);
    Swal.fire(`Fin del juego. Puntaje: ${score}`);
    resetGame();
  }
}
// Función para generar una cucaracha y verificar si se quedan sin intentos
function checkLives() {
  const livesLeft = 10 - bugs.children.length;
  if (livesLeft === 0) {    
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Se acabaron los intentos. Fin del juego.',
    });
    resetGame();
  }
}




// Iniciar el juego
function startGame() {
  startButton.disabled = true;
  intervalId = setInterval(() => {
    generateBug();
  }, bugInterval);
  timerId = setInterval(() => {
    checkTime();
  }, 1000);
  bugs.addEventListener('mousemove', moveHand);
  setTimeout(increaseBugSpeed, 5000);
}

// Reiniciar el juego
function resetGame() {
  score = 0;
  timeLeft = 30;
  scoreEl.textContent = score;
  timerEl.textContent = timeLeft;
  clearInterval(intervalId);
  clearInterval(timerId);
  startButton.disabled = false;
  bugs.querySelectorAll('.bug').forEach(bug => {
    bugs.removeChild(bug);
  });
}

/*/ Verificar si se quedan sin intentos
function checkLives() {
  const livesLeft = 10 - bugs.children.length;
  if (livesLeft === 0) {    
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Se acabaron los intentos. Fin del juego.',
    });
    resetGame();
  }
}
*/
// Funcion si perdes
function generateBug() {
  createBug();
  if (bugs.children.length >= 10) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Perdiste hay PLAGAA!!.',
    }).then(() => {
      resetGame();
    })} };

// Agregar eventos a los botones de inicio y reseteo
startButton.addEventListener('click', startGame);

resetButton.addEventListener('click', resetGame);

document.addEventListener('DOMContentLoaded', () => {
  showScores();
});