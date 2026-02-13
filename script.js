document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOptionIndex = null;
    let quizTimer = null;
    let secondsElapsed = 0;

    // DOM Elements
    const screens = {
        start: document.getElementById('start-screen'),
        quiz: document.getElementById('quiz-screen'),
        result: document.getElementById('result-screen')
    };

    const elements = {
        certInput: document.getElementById('cert-input'),
        generateBtn: document.getElementById('generate-btn'),
        loading: document.getElementById('loading'),
        questionTracker: document.getElementById('question-tracker'),
        timerDisplay: document.getElementById('timer'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        nextBtn: document.getElementById('next-btn'),
        finishBtn: document.getElementById('finish-btn'),
        scoreValue: document.getElementById('score-value'),
        resultMessage: document.getElementById('result-message'),
        restartBtn: document.getElementById('restart-btn')
    };

    // Helper: Switch Screens
    function showScreen(screenName) {
        Object.values(screens).forEach(screen => screen.classList.add('hidden'));
        screens[screenName].classList.remove('hidden');
    }

    // Helper: Generate Mock Questions (Simulates AI)
    function generateMockQuestions(topic) {
        // Templates to make questions look relevant to the input topic
        const templates = [
            {
                q: "What is a primary benefit of implementing ${topic} in an enterprise environment?",
                options: ["Increased operational complexity", "Scalability and cost-efficiency", "Reduced data security", "Slower deployment times"],
                correct: 1
            },
            {
                q: "Which key component is essential for a successful ${topic} strategy?",
                options: ["Legacy hardware integration", "Continuous monitoring and automation", "Manual data entry", "Single-point failure architecture"],
                correct: 1
            },
            {
                q: "In the context of ${topic}, what does the 'Shared Responsibility Model' primarily address?",
                options: ["Hardware manufacturing", "Security obligations between provider and user", "Employee payroll management", "Office layout planning"],
                correct: 1
            },
            {
                q: "When optimizing for ${topic}, which metric is deemed most critical?",
                options: ["Lines of code written", "Latency and throughput", "Server background color", "Number of meetings attended"],
                correct: 1
            },
            {
                q: "What is the industry standard protocol often associated with ${topic} integrations?",
                options: ["REST/gRPC APIs", "FTP over Telnet", "Physical floppy disks", "Morse code"],
                correct: 0
            }
        ];

        // Generate 5 questions (duplicating templates if needed for demo)
        return templates.map((t, i) => {
            return {
                id: i,
                question: t.q.replace(/\$\{topic\}/g, topic || "Certification"),
                options: t.options, // In a real app, shuffle these
                correctAnswer: t.correct
            };
        });
    }

    // Event: Start Quiz
    elements.generateBtn.addEventListener('click', () => {
        const topic = elements.certInput.value.trim();
        if (!topic) {
            alert('Please enter a certification topic!');
            return;
        }

        // Show loading state
        elements.generateBtn.classList.add('hidden');
        elements.loading.classList.remove('hidden');

        // Simulate API delay
        setTimeout(() => {
            currentQuestions = generateMockQuestions(topic);
            startQuiz();
            elements.generateBtn.classList.remove('hidden');
            elements.loading.classList.add('hidden');
        }, 1500);
    });

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        secondsElapsed = 0;
        showScreen('quiz');
        startTimer();
        renderQuestion();
    }

    function startTimer() {
        clearInterval(quizTimer);
        quizTimer = setInterval(() => {
            secondsElapsed++;
            const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
            const secs = (secondsElapsed % 60).toString().padStart(2, '0');
            elements.timerDisplay.textContent = `Time: ${mins}:${secs}`;
        }, 1000);
    }

    function renderQuestion() {
        const question = currentQuestions[currentQuestionIndex];
        
        // Update Tracker
        elements.questionTracker.textContent = `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;
        elements.questionText.textContent = question.question;

        // Reset UI
        elements.optionsContainer.innerHTML = '';
        elements.nextBtn.classList.add('hidden');
        elements.finishBtn.classList.add('hidden');
        selectedOptionIndex = null;

        // Render Options
        question.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.onclick = () => selectOption(index, btn);
            elements.optionsContainer.appendChild(btn);
        });
    }

    function selectOption(index, btnElement) {
        // Prevent changing answer after selection (optional rule, can be changed)
        if (selectedOptionIndex !== null) return; 

        selectedOptionIndex = index;
        const currentQuestion = currentQuestions[currentQuestionIndex];

        // Visual Feedback
        if (index === currentQuestion.correctAnswer) {
            btnElement.classList.add('correct');
            score++;
        } else {
            btnElement.classList.add('incorrect');
            // Show correct answer
            elements.optionsContainer.children[currentQuestion.correctAnswer].classList.add('correct');
        }

        // Show Next/Finish button
        if (currentQuestionIndex < currentQuestions.length - 1) {
            elements.nextBtn.classList.remove('hidden');
        } else {
            elements.finishBtn.classList.remove('hidden');
        }
    }

    // Event: Next Question
    elements.nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        renderQuestion();
    });

    // Event: Finish Quiz
    elements.finishBtn.addEventListener('click', () => {
        clearInterval(quizTimer);
        showResults();
    });

    function showResults() {
        showScreen('result');
        const percentage = Math.round((score / currentQuestions.length) * 100);
        elements.scoreValue.textContent = percentage;

        if (percentage >= 80) {
            elements.resultMessage.textContent = "Outstanding! You are ready for the exam.";
        } else if (percentage >= 60) {
            elements.resultMessage.textContent = "Good job! A little more study and you'll ace it.";
        } else {
            elements.resultMessage.textContent = "Keep studying! You can do this.";
        }
    }

    // Event: Restart
    elements.restartBtn.addEventListener('click', () => {
        elements.certInput.value = '';
        showScreen('start');
    });
});
