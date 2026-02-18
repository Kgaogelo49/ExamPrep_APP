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
            {q: "What is the primary purpose of Generative AI in business strategy?",
options: [
"To replace all human workers",
"To generate new content, insights, and automation capabilities",
"To eliminate cybersecurity risks",
"To remove the need for data governance"
],
correct: 1
},
{
q: "Which of the following is a common risk of Generative AI adoption?",
options: [
"Model bias and hallucinations",
"Infinite scalability",
"Perfect accuracy",
"Zero operational cost"
],
correct: 0
},
{
q: "What is prompt engineering?",
options: [
"Designing AI hardware chips",
"Writing effective inputs to guide AI outputs",
"Encrypting training data",
"Managing cloud servers"
],
correct: 1
},
{
q: "What does LLM stand for?",
options: [
"Large Learning Machine",
"Layered Logic Model",
"Large Language Model",
"Linked Language Mechanism"
],
correct: 2
},
{
q: "Why is data governance important in Generative AI?",
options: [
"To increase randomness",
"To ensure compliance, quality, and security",
"To reduce compute power",
"To eliminate regulations"
],
correct: 1
},
{
q: "What is AI hallucination?",
options: [
"When AI refuses to answer",
"When AI generates incorrect but confident responses",
"When AI crashes",
"When AI encrypts data"
],
correct: 1
},
{
q: "Which metric is most important when evaluating GenAI ROI?",
options: [
"Server color scheme",
"Productivity improvement and cost savings",
"Number of meetings",
"Amount of electricity used"
],
correct: 1
},
{
q: "Which technique improves AI response accuracy?",
options: [
"Prompt refinement",
"Ignoring context",
"Reducing training data",
"Eliminating oversight"
],
correct: 0
},
{
q: "What is fine-tuning?",
options: [
"Physically modifying servers",
"Adjusting a pre-trained model on specific data",
"Restarting a model",
"Deleting datasets"
],
correct: 1
},
{
q: "Responsible AI primarily focuses on:",
options: [
"Maximizing automation only",
"Ethics, fairness, transparency, and accountability",
"Removing compliance teams",
"Increasing compute costs"
],
correct: 1
},
{
q: "Which of the following reduces bias in AI systems?",
options: [
"Diverse training datasets",
"Smaller datasets",
"Ignoring fairness testing",
"Fewer evaluations"
],
correct: 0
},
{
q: "A key leadership role in GenAI transformation is to:",
options: [
"Write all prompts manually",
"Align AI initiatives with business objectives",
"Eliminate governance",
"Ignore risk management"
],
correct: 1
},
{
q: "Which cloud service model is most used for AI scalability?",
options: [
"IaaS",
"PaaS",
"SaaS",
"All of the above"
],
correct: 3
},
{
q: "Token limits in LLMs affect:",
options: [
"Response length and context window",
"Hardware size",
"Electricity usage only",
"Company revenue"
],
correct: 0
},
{
q: "Retrieval-Augmented Generation (RAG) improves:",
options: [
"Bias amplification",
"Model hallucination",
"Accuracy using external knowledge sources",
"Hardware performance"
],
correct: 2
},
{
q: "What is a model parameter?",
options: [
"A physical cable",
"A tunable weight inside a neural network",
"A security patch",
"A user password"
],
correct: 1
},
{
q: "Zero-shot prompting means:",
options: [
"Model receives no training",
"Model answers without examples",
"Model cannot respond",
"Model is offline"
],
correct: 1
},
{
q: "Few-shot prompting involves:",
options: [
"Giving several examples in the prompt",
"Reducing model size",
"Deleting training data",
"Encrypting prompts"
],
correct: 0
},
{
q: "Temperature setting in AI controls:",
options: [
"Server heat",
"Response creativity/randomness",
"Internet speed",
"Hardware lifespan"
],
correct: 1
},
{
q: "A high temperature setting results in:",
options: [
"More predictable answers",
"More creative and varied outputs",
"System shutdown",
"Data encryption"
],
correct: 1
},

// Continue pattern to reach 50

{
q: "Explainability in AI refers to:",
options: [
"Understanding how a model makes decisions",
"Making AI faster",
"Increasing randomness",
"Removing documentation"
],
correct: 0
},
{
q: "Which role oversees AI compliance?",
options: [
"Chief Ethics Officer or AI Governance Lead",
"Intern",
"Graphic Designer",
"Marketing Assistant"
],
correct: 0
},
{
q: "Shadow AI refers to:",
options: [
"Unauthorized AI usage within an organization",
"Cybersecurity encryption",
"Dark web usage",
"Private servers"
],
correct: 0
},
{
q: "Synthetic data is:",
options: [
"Fake malicious data",
"Artificially generated data for training/testing",
"Deleted datasets",
"Encrypted storage"
],
correct: 1
},
{
q: "A key GenAI leadership competency is:",
options: [
"Risk awareness and change management",
"Ignoring compliance",
"Eliminating governance",
"Reducing collaboration"
],
correct: 0
},
{
q: "Multimodal AI can process:",
options: [
"Only text",
"Text, images, audio and more",
"Only spreadsheets",
"Only code"
],
correct: 1
},
{
q: "Overfitting occurs when:",
options: [
"Model generalizes well",
"Model memorizes training data too closely",
"Model shuts down",
"Model encrypts output"
],
correct: 1
},
{
q: "AI governance frameworks help organizations:",
options: [
"Scale risk",
"Manage risk and compliance",
"Remove transparency",
"Reduce documentation"
],
correct: 1
},
{
q: "Data privacy regulations impact GenAI by:",
options: [
"Requiring responsible data usage",
"Increasing randomness",
"Reducing training time",
"Removing compliance"
],
correct: 0
},
{
q: "One strategic GenAI benefit is:",
options: [
"Improved innovation cycles",
"Increased manual processes",
"Higher error rates",
"Slower product launches"
],
correct: 0
},
{
q: "Foundation models are:",
options: [
"Small niche models",
"Large pre-trained models adaptable to tasks",
"Hardware tools",
"Security protocols"
],
correct: 1
},
{
q: "Change management in AI adoption ensures:",
options: [
"Employee readiness and adoption",
"Reduced collaboration",
"Ignored resistance",
"Data deletion"
],
correct: 0
},
{
q: "A sandbox environment is used to:",
options: [
"Test AI safely before deployment",
"Delete production systems",
"Increase security risks",
"Remove oversight"
],
correct: 0
},
{
q: "Human-in-the-loop systems:",
options: [
"Eliminate humans",
"Include human oversight in AI decisions",
"Ignore governance",
"Automate everything"
],
correct: 1
},
{
q: "AI model drift refers to:",
options: [
"Hardware malfunction",
"Performance degradation over time",
"Internet outage",
"Server overheating"
],
correct: 1
},
{
q: "Ethical AI deployment requires:",
options: [
"Transparency and fairness audits",
"Ignoring bias",
"Reducing monitoring",
"Avoiding documentation"
],
correct: 0
},
{
q: "Strategic AI KPIs include:",
options: [
"Productivity gains",
"Cost savings",
"Innovation speed",
"All of the above"
],
correct: 3
},
{
q: "Cross-functional AI teams typically include:",
options: [
"Only engineers",
"Business, legal, IT, and compliance roles",
"Only marketing",
"No leadership"
],
correct: 1
},
{
q: "AI scalability depends on:",
options: [
"Cloud infrastructure",
"Manual paperwork",
"Reduced governance",
"Office size"
],
correct: 0
},
{
q: "The biggest GenAI leadership mistake is:",
options: [
"Starting with strategy",
"Deploying without governance",
"Investing in training",
"Aligning with goals"
],
correct: 1
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
