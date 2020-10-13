let countdownTime = 3;
let questionTime = 10;
let questionIndex = 0;
// Global questionTimer, in order to call clearInterval() for each question countdown, not sure how to do it differently
let questionTimer;
let score = 0;

// Dom elements
const appDescr = document.getElementById('app-descr');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const optionBtn1 = document.getElementById('option-1');
const optionBtn2 = document.getElementById('option-2');
const optionBtn3 = document.getElementById('option-3');
let questionCounter = document.getElementById('question-countdown');
let questionText = document.getElementById('question-text');
let questionAnswer = document.getElementById('question-answers');
let scoreDiv = document.getElementById('scoreboard');
let scoreTxt = document.getElementById('scoreboard-text');
let answerBreakdown = document.getElementById('scoreboard-recap');

let buttonArr = [optionBtn1, optionBtn2, optionBtn3];

// Adding event listeners to buttons once dom elements are loaded
document.addEventListener('DOMContentLoaded', () => {
    startBtn.addEventListener('click', startApp);
    restartBtn.addEventListener('click', restartApp);
    optionBtn1.addEventListener('click', checkAnswer);
    optionBtn2.addEventListener('click', checkAnswer);
    optionBtn3.addEventListener('click', checkAnswer);
});

// Gets called by the setInterval method and updates the app starting countdown timer
function startCountDown() {
    countdownTime--;
    questionCounter.innerHTML = countdownTime;
}

// Called by the start button, starts the countdown and after a set time shows the first question
function startApp(ev) {
    questionCounter.innerHTML = countdownTime;
    let countDown = setInterval(startCountDown, 1000);
    moveDescriptionOut();
    hideStartButton();
    showQuestionTimer();

    setTimeout(function() {
        // Clear the starting countdown timer so that it doesnt keep running throughout the runtime
        clearInterval(countDown);
        hideAppDescr();
        showQuestionDiv();
        showQuestionTimer();
        showAnswerDiv();
        displayNewQuestion(questionIndex);
    }, 3000);
}

// Resets all the answer buttons data-answer value
function clearButtonData() {
    for(let i = 0; i < buttonArr.length; i++) {
        buttonArr[i].setAttribute('data-answer', '');
    }
}

// Returns a random number between min and max (excluding max)
function getRandInt(min, max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

// Places the answer in a random option of the button array
function placeAnswer(qIndex) {
    let randomIndex = getRandInt(0, 3);
    buttonArr[randomIndex].innerHTML = questionList[qIndex].answer;
    buttonArr[randomIndex].setAttribute('data-answer', questionList[qIndex].answer);
}

// Function that fills the buttons that don't have the answer with random values from the options arrays. 
function placeOtherOptions(qIndex) {
    let answerType = questionList[qIndex].type;
    let option1;
    let option2;
    // Getting two random indexes to get two random options to go with the correct answer, values 0-11 since that's the option array size
    let randIndex = getRandInt(0, 12);
    let randIndex2 = getRandInt(0, 12);
    // Give the 2nd index a different value if it's the same as the first random index (so no duplicate answers appear)
    while(randIndex2 === randIndex) {
        randIndex2 = getRandInt(0, 12);
    }
    // Check the type of the question in order to fetch a random answer that makes any kind of sense
    switch(answerType) {
        case 'distance':
            option1 = distanceOptions[randIndex];
            option2 = distanceOptions[randIndex2];
            break;
        case 'country':
            option1 = countryOptions[randIndex];
            option2 = countryOptions[randIndex2];
            break;
        default:
            console.log('Type not found');
            break;
    }
    // Loop through the option buttons and if their data-answer field is empty, fill it with an option retrieved above
    for(let i = 0; i < buttonArr.length; i++) {
        if(buttonArr[i].getAttribute('data-answer') === '') {
            buttonArr[i].setAttribute('data-answer', option1);
            buttonArr[i].innerHTML = option1;
            // Give option 1 the value of the second option so it will be placed next
            option1 = option2;
        }
    }
}

// Countdown for each question, gets called by setInterval each time a new question is displayed
function startTimer() {
    questionTime--;
    questionCounter.innerHTML = questionTime;
    // When time is running low, change the style
    if(questionTime <= 5) {
        addLowTimeClass();
    }
    // When timer runs out either go to the next question or show results
    if(questionTime < 0) {
        userAnswers.push('*Timer ran out*');
        clearInterval(questionTimer);
        if(questionIndex < questionList.length - 1) {
            questionIndex++;
            displayNewQuestion(questionIndex);
        } else {
            showResults();
        }
    }
}

// Displays new question from the question list using the passed in questionIndex
function displayNewQuestion(questionIndex) {
    let questionP = document.getElementById('question-paragraph');
    questionTime = 10;
    questionCounter.innerHTML = questionTime;
    removeLowTimeClass();
    // questionTimer takes the ID value that the setInterval returns and is used by clearInterval to stop the counter
    questionTimer = setInterval(startTimer, 1000);
    // Update the question paragraph with the new question
    questionP.innerHTML = `Question ${questionIndex+1} <br> ${questionList[questionIndex].text}`;

    // Reset the data-answer values each button has
    clearButtonData();
    // Placing the correct answer in a random button
    placeAnswer(questionIndex);
    // Filling other buttons with answers from one of the 2 option arrays
    placeOtherOptions(questionIndex);
    // Every time a question appears, call togglePop to give it a little animation
    setTimeout(() => {
        togglePop();
    }, 30);
}

// Gets called by any of the option buttons and checks if the pressed buttons holds the correct answer
function checkAnswer(ev) {
    let currentAnswer = ev.currentTarget.getAttribute('data-answer');
    // Store what answer the user chose in an array
    userAnswers.push(currentAnswer);
    // If the chosen answer is correct increase the score
    if(questionList[questionIndex].answer === currentAnswer) {
        score++;
    }
    // Raise questionIndex if it's not already the last question, if thats the case show the score
    if(questionIndex < questionList.length - 1) {
        questionIndex++;
        clearInterval(questionTimer);
        displayNewQuestion(questionIndex);
    } else {
        clearInterval(questionTimer);
        showResults();
    }
}

// Updates the Loading text, gets called by the setInterval()
function loadingRes() {
    questionCounter.innerHTML += '.';
    if(questionCounter.innerHTML === 'Loading results....') {
        questionCounter.innerHTML = 'Loading results';
    }
}

// First shows a loading 'screen' for 3.2 seconds then moves the scoreboard in where the question history is shown
function showResults() {
    clearScoreRecap();
    hideQuestionDiv();
    hideAnswerDiv();
    removeLowTimeClass();
    // Call the loadingres function each 0.3seconds to add to the text
    questionCounter.innerHTML = 'Loading results';
    let loadCount = setInterval(loadingRes, 300);
    // Keep the 'loading' screen for 3.4sec
    setTimeout(() => {
        clearInterval(loadCount);
        hideQuestionTimer();
        moveScoreboardIn();
        scoreTxt.innerHTML = `You answered ${score} out of 10 questions correctly.`;
        // Generate the result screen, showing the chosen answers and the correct answers
        for(let i = 0; i < questionList.length; i++) {
            let question = document.createElement('p');
            let userAnswer = document.createElement('p');
            let correctAnswer = document.createElement('p');
            correctAnswer.style.color = '#19ff19';
            if(userAnswers[i] === questionList[i].answer) {
                userAnswer.style.color = '#19ff19';
            } else {
                userAnswer.style.color = 'red';                               
            }
            question.innerHTML = `${questionList[i].text}`;
            userAnswer.innerHTML = `Your answer: ${userAnswers[i]}`;
            correctAnswer.innerHTML = `Correct answer: ${questionList[i].answer}`;
            answerBreakdown.appendChild(question);
            answerBreakdown.appendChild(userAnswer);
            answerBreakdown.appendChild(correctAnswer);
        }        
    }, 3400);
}

// Reset all variables and counters that need reseting, move the scoreboard away and show the start button
function restartApp() {
    questionIndex = 0;
    score = 0;
    countdownTime = 3;
    userAnswers = [];
    moveScoreboardOut();
    showAppDescr();
    moveDescriptionIn();
    showStartButton();
}

// If the score breakdown has any children (from previous results) remove them
function clearScoreRecap() {
    while(answerBreakdown.hasChildNodes()) {
        answerBreakdown.removeChild(answerBreakdown.lastChild);
    }
}

// Data for the questions and answers

let question1 = new Question('What is the largest country in the world? (by landmass)', 'Russia', 'country');
let question2 = new Question('What country has the biggest population?', 'China', 'country');
let question3 = new Question('In what country is Everest located?', 'Nepal', 'country');
let question4 = new Question('In what country was the runner Usain Bolt born?', 'Jamaica', 'country');
let question5 = new Question('What country has the best national football team?', 'Germany', 'country');
let question6 = new Question('How far is a marathon? (meters)', '42195', 'distance');
let question7 = new Question('How long is the river Nile? (meters)', '6650', 'distance');
let question8 = new Question('How high is the world\'s highest mountain Everest? (meters)', '8848', 'distance');
let question9 = new Question('How high is the world\'s highest building? (meters)', '828', 'distance');
let question10 = new Question('How long is the river Volga? (meters)', '3531', 'distance');

// Static list of questions
const questionList = [question1, question2, question3, question4, question5, question6, question7, question8, question9, question10];

// Options for country and length questions
const countryOptions = ['Portugal', 'Poland', 'USA', 'France', 'Uruguay', 'Iceland', 'Brazil', 'Spain', 'England', 'Denmark', 'India', 'Egypt'];
const distanceOptions = ['40092', '9050', '29982', '29290', '900', '550', '650', '1050', '5505', '3550', '9219', '1090'];
let userAnswers = [];