let currentQuestionIndex = 0;
let correctAnswers = 0;
let questions = [];
let userPoints = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadQuestions();
});

function loadQuestions() {
    // جلب الأسئلة من Firebase
    database.ref('questions').once('value')
        .then((snapshot) => {
            questions = shuffleArray(Object.values(snapshot.val()));
            showQuestion();
        });
}

function showQuestion() {
    if(currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'option-btn';
        optionElement.textContent = option;
        optionElement.onclick = () => checkAnswer(index === question.correctIndex);
        optionsContainer.appendChild(optionElement);
    });

    // عرض إعلان كل 3 أسئلة
    if(currentQuestionIndex > 0 && currentQuestionIndex % 3 === 0) {
        showAd();
    }
}

function checkAnswer(isCorrect) {
    const resultElement = document.getElementById('quizResult');
    const resultIcon = document.getElementById('resultIcon');
    const resultText = document.getElementById('resultText');
    
    if(isCorrect) {
        resultIcon.textContent = '✅';
        resultText.textContent = 'إجابة صحيحة!';
        correctAnswers++;
        userPoints++;
        updateUserPoints();
    } else {
        resultIcon.textContent = '❌';
        resultText.textContent = 'إجابة خاطئة!';
    }
    
    resultElement.style.display = 'block';
    
    setTimeout(() => {
        resultElement.style.display = 'none';
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

function updateUserPoints() {
    const user = firebase.auth().currentUser;
    if(user) {
        database.ref('users/' + user.uid).update({
            points: firebase.database.ServerValue.increment(1)
        });
    }
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function showAd() {
    if(typeof admob !== 'undefined') {
        admob.createBannerView({
            'publisherId': 'ca-app-pub-1749527081276279/9185642681',
            'adSize': admob.AD_SIZE.BANNER
        });
    }
}
