document.addEventListener('DOMContentLoaded', () => {
    // State
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOptionIndex = null;

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
        scoreTracker: document.getElementById('score-tracker'),
        progressBar: document.getElementById('progress-bar'),
        quizCard: document.getElementById('quiz-card'), // For shake animation
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        nextBtn: document.getElementById('next-btn'),
        finishBtn: document.getElementById('finish-btn'),
        scoreValue: document.getElementById('score-value'),
        resultMessage: document.getElementById('result-message'),
        restartBtn: document.getElementById('restart-btn'),
        activityGraph: document.getElementById('activity-graph')
    };

    // Initialize Analytics
    updateAnalyticsDisplay();

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

        // Generate 30 questions by looping through templates
        const totalQuestions = 30;
        const questions = [];

        for (let i = 0; i < totalQuestions; i++) {
            const t = templates[i % templates.length]; // Cycle through templates
            questions.push({
                id: i,
                question: t.q.replace(/\$\{topic\}/g, topic || "Certification") + (Math.floor(i / templates.length) > 0 ? ` (Variant ${Math.floor(i / templates.length) + 1})` : ""),
                options: t.options, // In a real app, shuffle these
                correctAnswer: t.correct
            });
        }
        return questions;
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
        showScreen('quiz');
        renderQuestion();
    }

    function renderQuestion() {
        const question = currentQuestions[currentQuestionIndex];

        // Update Tracker & Score
        elements.questionTracker.textContent = `Question ${currentQuestionIndex + 1}/${currentQuestions.length}`;
        elements.scoreTracker.textContent = `Score: ${score}`;

        // Update Progress Bar
        const progressPercent = ((currentQuestionIndex) / currentQuestions.length) * 100;
        elements.progressBar.style.width = `${progressPercent}%`;

        elements.questionText.textContent = question.question;

        // Reset UI
        elements.optionsContainer.innerHTML = '';
        elements.nextBtn.classList.add('hidden');
        elements.finishBtn.classList.add('hidden');
        elements.quizCard.classList.remove('shake'); // Remove shake class
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
        // Prevent changing answer after selection
        if (selectedOptionIndex !== null) return;

        selectedOptionIndex = index;
        const currentQuestion = currentQuestions[currentQuestionIndex];

        // Visual Feedback (Immediate)
        if (index === currentQuestion.correctAnswer) {
            btnElement.classList.add('correct');
            score++;
            // Update Score Display immediately
            elements.scoreTracker.textContent = `Score: ${score}`;
        } else {
            btnElement.classList.add('incorrect');
            // Show correct answer
            elements.optionsContainer.children[currentQuestion.correctAnswer].classList.add('correct');
            // Trigger Shake Animation
            elements.quizCard.classList.add('shake');
        }

        // Log Activity to Analytics (1 question answered)
        logActivity();

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

        // Final Progress Bar Update
        updateAnalyticsDisplay();
    }

    // Event: Restart
    elements.restartBtn.addEventListener('click', () => {
        elements.certInput.value = '';
        showScreen('start');
    });

    // --- ANALYTICS LOGIC --- //

    function logActivity() {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        let data = JSON.parse(localStorage.getItem('studyActivity')) || {};

        if (!data[today]) data[today] = 0;
        data[today]++;

        localStorage.setItem('studyActivity', JSON.stringify(data));
        updateAnalyticsDisplay();
    }

    function updateAnalyticsDisplay() {
        // 1. Get Data
        let data = JSON.parse(localStorage.getItem('studyActivity')) || {};

        // Seed dummy data if empty (for demo purposes)
        if (Object.keys(data).length === 0) {
            const today = new Date();
            for (let i = 4; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const datePostStr = d.toISOString().split('T')[0];
                data[datePostStr] = Math.floor(Math.random() * 20) + 5; // Random 5-25 questions
            }
            localStorage.setItem('studyActivity', JSON.stringify(data));
        }

        // 2. Prepare Data for Mon-Fri Graph
        // NOTE: For simplicity, we are showing the LAST 5 Days activity mapped as points
        const sortedDates = Object.keys(data).sort().slice(-5); // Last 5 days
        const values = sortedDates.map(d => data[d]);

        // 3. Render SVG Graph
        renderGraph(values);
    }

    function renderGraph(values) {
        const svg = elements.activityGraph;
        svg.innerHTML = ''; // Clear previous

        if (values.length === 0) return;

        const maxVal = Math.max(...values, 10); // Minimum max of 10 for scale
        const width = 500;
        const height = 200;
        const padding = 20;

        // Calculate Points
        const points = values.map((val, index) => {
            const x = (index / (values.length - 1)) * (width - 2 * padding) + padding;
            // Invert Y because SVG 0 is top
            const y = height - ((val / maxVal) * (height - 2 * padding)) - padding;
            return `${x},${y}`;
        }).join(' ');

        // Draw Line
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points);
        polyline.setAttribute('class', 'graph-line');
        svg.appendChild(polyline);

        // Draw Dots
        values.forEach((val, index) => {
            const x = (index / (values.length - 1)) * (width - 2 * padding) + padding;
            const y = height - ((val / maxVal) * (height - 2 * padding)) - padding;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', 4);
            circle.setAttribute('class', 'graph-point');

            // Tooltip via title
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = `Questions: ${val}`;
            circle.appendChild(title);

            svg.appendChild(circle);
        });
    }
});
