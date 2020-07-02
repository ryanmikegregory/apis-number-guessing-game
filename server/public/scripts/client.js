$(document).ready(handleReady);

function handleReady() {
  console.log("jquery is loaded!")
  // TODO: listen for submit of form
  $('#jsGuessForm').on('submit', submitGuesses);
  $('.js-form-actions').on('click', '.js-reset', resetGame);
  getHistory();
}

//
// GAME LOGIC
// --------------------

function resetGame() {
  console.log('RESET GAME!!!');
  postReset();
}

// TODO: handle form submit
function submitGuesses(event) {
  event.preventDefault();
  const playerGuesses = [
    {
      name: 'Myron',
      guess: parseInt($('.js-myron-guess').val()),
    },
    {
      name: 'Ryan',
      guess: parseInt($('.js-ryan-guess').val()),
    },
    {
      name: 'Shelby',
      guess: parseInt($('.js-shelby-guess').val()),
    },
    {
      name: 'Ashleigh',
      guess: parseInt($('.js-ashleigh-guess').val()),
    }
  ];
  console.log('GUESSed:', playerGuesses);
  postGuesses(playerGuesses);
}

function countGuesses(history) {
  let count = 0;
  for (let round of history) {
    count = count + round.players.length;
  }

  return count;
}

//
// AJAX CALLS
// --------------------

function postReset() {
  $.ajax({
    type: "POST",
    url: "/api/reset",
    data: {}
  })
  .then(function(response) {
    console.log('POST, reset - response:', response);
    getHistory();
  })
  .catch(function(err) {
    console.log(err);
    alert('Something went terribly wrong!!!!!');
  });
}

// TODO: send submitted guess to server
function postGuesses(currentGuesses) {
  $.ajax({
    type: "POST",
    url: "/api/guesses",
    data: {
      players: currentGuesses
    }
  })
  .then(function(response) {
    console.log('POST - response:', response);
    getHistory();
  })
  .catch(function(err) {
    console.log(err);
    alert('Something went terribly wrong!!!!!');
  });
}

// TODO: get all guesses history from server
function getHistory() {
  $.ajax({
    type: "GET",
    url: "/api/guesses",
  })
  .then(function(response) {
    console.log('GET - response:', response);
    render(response);
  })
  .catch(function(err) {
    console.log(err);
    alert('Something went terribly wrong!!!!!');
  });
}

//
// DOM INTERACTIONS
// --------------------

function render(history) {
  $('.js-total-rounds').text(`Total Rounds: ${history.length}`);
  $('.js-total-guesses').text(`Total Guesses: ${countGuesses(history)}`);

  const $listElement = $('.js-history');
  let hasCorrectAnswer = false;

  $listElement.empty();
  for (let round of history) {
    $listElement.append(`<li>ROUND</li>`);

    for (let player of round.players) {
      let adjustedClass = 'item';

      if (player.result === 'correct') {
        adjustedClass = 'winner';
        hasCorrectAnswer = true;
      }

      $listElement.append(`<li class="${adjustedClass}">${player.name} guessed: ${player.guess}, ${player.result}</li>`);
    }
  }

  if (hasCorrectAnswer) {
    $('.js-form-actions').append(`
      <button type="button" class="js-reset">Reset</button>
    `);
  } else {
    $('.js-reset').remove();
  }
}