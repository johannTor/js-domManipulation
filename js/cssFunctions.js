// Bunch of css functions that mostly add or removes style classes to html elements

function showAppDescr() {
    appDescr.style.display = 'block';
}

function hideAppDescr() {
    appDescr.style.display = 'none';
}

function showStartButton() {
    startBtn.style.display = 'block';
}

function hideStartButton() {
    startBtn.style.display = 'none';
}

function showQuestionDiv() {
    questionText.style.display = 'block';
}

function hideQuestionDiv() {
    questionText.style.display = 'none';
}

function showQuestionTimer() {
    questionCounter.style.display = 'block';
}

function hideQuestionTimer() {
    questionCounter.style.display = 'none';
}

function showAnswerDiv() {
    questionAnswer.style.display = 'blocK';
}

function hideAnswerDiv() {
    questionAnswer.style.display = 'none';
}

function showScoreBoard() {
    scoreboard.style.display = 'block';
}

function hideScoreBoard() {
    scoreboard.style.display = 'none';
}

// Animation methods for DOM elements
function moveDescriptionOut() {
    appDescr.classList.add('app-descr-move');
}

function moveDescriptionIn() {
    appDescr.classList.remove('app-descr-move');
}

function togglePop() {
    questionAnswer.classList.add('question-answers-big');
    setTimeout(() => {
        questionAnswer.classList.remove('question-answers-big');
    }, 200);
}

function addLowTimeClass() {
    questionCounter.classList.add('question-countdown-low');
}

function removeLowTimeClass() {
    questionCounter.classList.remove('question-countdown-low');
}

function moveScoreboardIn() {
    scoreDiv.classList.add('scoreboard-up');
}

function moveScoreboardOut() {
    scoreDiv.classList.remove('scoreboard-up');
}