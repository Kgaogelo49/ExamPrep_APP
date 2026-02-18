document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL: Dark Mode --- //
    const themeToggle = document.getElementById('theme-toggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }

    // --- PAGE SPECIFIC LOGIC --- //

    // 1. DASHBOARD PAGE
    if (document.getElementById('total-sessions')) {
        updateDashboardStats();
        updateAnalyticsDisplay(); // Graph
    }

    // 2. SETTINGS PAGE
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all progress? This cannot be undone.')) {
                localStorage.removeItem('studyActivity');
                localStorage.removeItem('quizStats');
                alert('Progress reset!');
                window.location.href = 'dashboard.html';
            }
        });
    }

    // 3. HOME / QUIZ PAGE
    const certInput = document.getElementById('cert-input');
    if (certInput) {
        initQuizApp();
    }

    // --- HELPER FUNCTIONS --- //

    function updateDashboardStats() {
        // Default Stats
        const stats = JSON.parse(localStorage.getItem('quizStats')) || { totalSessions: 0, totalTime: 0 };

        // 1. Completed Sessions
        document.getElementById('total-sessions').textContent = stats.totalSessions;

        // 2. Active Users (Mock Data)
        // Keep static or randomize slightly for effect
        document.getElementById('active-users').textContent = "1.2k";

        // 3. Total Study Time (Format Minutes to H m)
        const totalMinutes = Math.floor(stats.totalTime / 60);
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        document.getElementById('total-time').textContent = `${hours}h ${mins}m`;
    }

    function logQuizResult(durationSeconds) {
        let stats = JSON.parse(localStorage.getItem('quizStats')) || { totalSessions: 0, totalTime: 0 };

        stats.totalSessions++;
        stats.totalTime += durationSeconds; // Cumulative seconds

        localStorage.setItem('quizStats', JSON.stringify(stats));
    }


    function initQuizApp() {
        // State
        let currentQuestions = [];
        let currentQuestionIndex = 0;
        let score = 0;
        let selectedOptionIndex = null;
        let quizStartTime = null;

        // DOM Elements
        const screens = {
            start: document.getElementById('start-screen'),
            quiz: document.getElementById('quiz-screen'),
            result: document.getElementById('result-screen')
        };

        const elements = {
            certInput: document.getElementById('cert-input'),
            questionCountInput: document.getElementById('question-count'),
            difficultyInput: document.getElementById('difficulty'),
            generateBtn: document.getElementById('generate-btn'),
            loading: document.getElementById('loading'),
            questionTracker: document.getElementById('question-tracker'),
            scoreTracker: document.getElementById('score-tracker'),
            progressBar: document.getElementById('progress-bar'),
            quizCard: document.getElementById('quiz-card'),
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
        function generateMockQuestions(topic, count, difficulty) {
            // Difficulty can tweak templates or logic (Mocking simply adds label for now)
            const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

            // Templates to make questions look relevant to the input topic
            const templates = [
                {
                    q: `[${difficultyLabel}] What is a primary benefit of implementing \${topic} in an enterprise environment?`,
                    options: ["Increased operational complexity", "Scalability and cost-efficiency", "Reduced data security", "Slower deployment times"],
                    correct: 1
                },
                {
                    q: `[${difficultyLabel}] Which key component is essential for a successful \${topic} strategy?`,
                    options: ["Legacy hardware integration", "Continuous monitoring and automation", "Manual data entry", "Single-point failure architecture"],
                    correct: 1
                },
                {
                    q: `[${difficultyLabel}] In the context of \${topic}, what does the 'Shared Responsibility Model' primarily address?`,
                    options: ["Hardware manufacturing", "Security obligations between provider and user", "Employee payroll management", "Office layout planning"],
                    correct: 1
                },
                {
                    q: `[${difficultyLabel}] When optimizing for \${topic}, which metric is deemed most critical?`,
                    options: ["Lines of code written", "Latency and throughput", "Server background color", "Number of meetings attended"],
                    correct: 1
                },
                {
                    q: `[${difficultyLabel}] What is the industry standard protocol often associated with \${topic} integrations?`,
                    options: ["REST/gRPC APIs", "FTP over Telnet", "Physical floppy disks", "Morse code"],
                    correct: 0
                }
            ];

            // Generate N questions by looping through templates
            const questions = [];

            for (let i = 0; i < count; i++) {
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
            const count = parseInt(elements.questionCountInput.value);
            const difficulty = elements.difficultyInput.value;

            if (!topic) {
                alert('Please enter a certification topic!');
                return;
            }

            // Show loading state
            elements.generateBtn.classList.add('hidden');
            elements.loading.classList.remove('hidden');

            // Simulate API delay
            setTimeout(() => {
                currentQuestions = generateMockQuestions(topic, count, difficulty);
                startQuiz();
                elements.generateBtn.classList.remove('hidden');
                elements.loading.classList.add('hidden');
            }, 1500);
        });

        function startQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            quizStartTime = new Date(); // Start Time Tracker
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
            if (selectedOptionIndex !== null) return;

            selectedOptionIndex = index;
            const currentQuestion = currentQuestions[currentQuestionIndex];

            // Visual Feedback (Immediate)
            if (index === currentQuestion.correctAnswer) {
                btnElement.classList.add('correct');
                score++;
                elements.scoreTracker.textContent = `Score: ${score}`;
            } else {
                btnElement.classList.add('incorrect');
                elements.optionsContainer.children[currentQuestion.correctAnswer].classList.add('correct');
                elements.quizCard.classList.add('shake');
            }

            // Log Activity (1 question answered)
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

            // Calculate Duration
            const endTime = new Date();
            const durationSeconds = Math.round((endTime - quizStartTime) / 1000);

            const percentage = Math.round((score / currentQuestions.length) * 100);
            elements.scoreValue.textContent = percentage;

            if (percentage >= 80) {
                elements.resultMessage.textContent = "Outstanding! You are ready for the exam.";
            } else if (percentage >= 60) {
                elements.resultMessage.textContent = "Good job! A little more study and you'll ace it.";
            } else {
                elements.resultMessage.textContent = "Keep studying! You can do this.";
            }

            // Log Quiz Stats (Duration)
            logQuizResult(durationSeconds);
        }

        // Event: Restart
        elements.restartBtn.addEventListener('click', () => {
            elements.certInput.value = '';
            showScreen('start');
        });
    }

    // --- ANALYTICS LOGIC --- //

    function logActivity() {
        const today = new Date().toISOString().split('T')[0];
        let data = JSON.parse(localStorage.getItem('studyActivity')) || {};

        if (!data[today]) data[today] = 0;
        data[today]++;

        localStorage.setItem('studyActivity', JSON.stringify(data));
    }

    function updateAnalyticsDisplay() {
        const graphElement = document.getElementById('activity-graph');
        if (!graphElement) return;

        // 1. Get Data
        let data = JSON.parse(localStorage.getItem('studyActivity')) || {};

        // Seed dummy data if empty
        if (Object.keys(data).length === 0) {
            const today = new Date();
            for (let i = 4; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const datePostStr = d.toISOString().split('T')[0];
                data[datePostStr] = Math.floor(Math.random() * 20) + 5;
            }
            localStorage.setItem('studyActivity', JSON.stringify(data));
        }

        // 2. Prepare Data for Mon-Fri Graph (Last 5 days)
        const sortedDates = Object.keys(data).sort().slice(-5);
        const values = sortedDates.map(d => data[d]);

        // 3. Render SVG Graph
        renderGraph(values, graphElement);
    }

    function renderGraph(values, svg) {
        svg.innerHTML = ''; // Clear previous

        if (values.length === 0) return;

        const maxVal = Math.max(...values, 10);
        const width = 500;
        const height = 200;
        const padding = 20;

        // Calculate Points
        const points = values.map((val, index) => {
            const x = (index / (values.length - 1)) * (width - 2 * padding) + padding;
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

            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = `Questions: ${val}`;
            circle.appendChild(title);

            svg.appendChild(circle);
        });
    }
});
