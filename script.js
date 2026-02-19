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
q: "A growing retail company with fragmented phone, email, and basic website chat support needs a unified cloud solution. They require integrated communication channels, consistent customer experiences, and scalable support that ensures security and privacy. Which Google Cloud offering should they use?",
options: [
"Vertex AI Platform",
"Google Cloud Contact Center as a Service",
"Conversational AI",
"Vertex AI Search"
],
correct: 1
},
{
q: "An organization is seeking to improve how its employees access and use internal company information scattered across various systems. They want to provide their knowledge workers with tools that can understand and use this data to enhance productivity and decision-making. What is a key benefit of using Gemini Enterprise in this scenario?",
options: [
"Gemini Enterprise primarily focuses on enhancing external customer engagement through AI-powered chatbots.",
"Gemini Enterprise directly manages the underlying infrastructure and hardware required for AI model training.",
"Gemini Enterprise allows employees to find and use internal information more easily by creating custom AI agents that can access and understand data from various enterprise sources.",
"Gemini Enterprise is mainly designed for building and deploying custom machine learning models for predictive analytics."
],
correct: 2
},
{
q: "What is reinforcement learning?",
options: [
"Learning from labeled data with correct output pairs.",
"Learning by identifying patterns in unlabeled data.",
"Learning through interaction and feedback.",
"Learning by training on vast data to generate new content."
],
correct: 2
},
{
q: "A company is developing a system to automatically categorize customer support emails. They have a collection of thousands of past emails, and each email has been manually reviewed and tagged with a category such as 'Billing Inquiry,' 'Technical Support,' or 'Feature Request.' What type of data is this?",
options: [
"Unlabeled data",
"Labeled data",
"Structured data",
"Raw data"
],
correct: 1
},
{
q: "What is the definition of a generative AI (gen AI) model?",
options: [
"A physical device that houses the hardware components of a gen AI system.",
"A complex algorithm trained on vast amounts of data to learn patterns and relationships.",
"A user interface that allows users to interact with a gen AI system.",
"A set of rules and guidelines governing responsible development and use of gen AI."
],
correct: 1
},
{
q: "A video game company created a virtual reality game with virtual characters that can interact with users in a more natural and intuitive way by using gestures and facial expressions to communicate. What type of agent is this?",
options: [
"Creative agent",
"Workflow agent",
"Virtual assistant agent",
"Conversational agent"
],
correct: 3
},
{
q: "A software company has developers who need to write, review, debug, and generate code from natural language descriptions by using generative AI. What type of agent is this?",
options: [
"Data analysis agent",
"Workflow agent",
"Data agent",
"Code agent"
],
correct: 3
},
{
q: "An advertising agency needs to quickly create many different photorealistic images from text descriptions for client campaigns because traditional photoshoots are too slow and costly. The agency's goal is to generate high-quality visuals rapidly from text to improve campaign speed and lower expenses. Which Google foundation model should be used?",
options: [
"Gemini",
"Gemma",
"Veo",
"Imagen"
],
correct: 3
},
{
q: "A research scientist wants to use Veo to visualize live, fluctuating data streams on a real-time dashboard. Why would Veo be a poor choice for this particular task?",
options: [
"Veo generates videos from static inputs like text or images and cannot process or dynamically visualize live data.",
"Veo may lack specific scientific visualization styles needed for accurate data representation.",
"Veo use for this scenario would require too many computational resources.",
"Veo is designed for short-form video, not continuous, long-duration live data displays."
],
correct: 0
},
{
q: "A company sells custom-designed phone cases on their website. How should Imagen be effectively used?",
options: [
"To generate realistic images of phone cases on devices from text descriptions of designs.",
"To analyze customer feedback to identify popular phone case design trends.",
"To predict demand for different phone case designs based on sales data.",
"To transcribe customer audio feedback on prototypes of phone case designs."
],
correct: 0
},
{
q: "A company lacks extensive in-house machine learning and AI expertise. How does Google Cloud democratize AI?",
options: [
"By offering exclusive access to its most powerful AI models for high-spending clients.",
"By providing fully automated AI solutions requiring no technical user input.",
"By providing a comprehensive AI platform with low-code/no-code tools, pre-trained models, and easy-to-use APIs.",
"By offering free custom AI solution development and deployment for all businesses."
],
correct: 2
},
{
q: "A marketing team is brainstorming creative ideas for a new social media campaign. They want to quickly generate various taglines and initial post drafts to explore different angles and messaging options. They need a Google Cloud prebuilt generative AI tool without additional setup that allows for rapid content creation and experimentation. What should the team do?",
options: [
"Use NotebookLM to upload past successful campaigns and analyze their key elements.",
"Use Google Workspace with Gemini within Google Slides to prepare a presentation outlining their social media campaign strategy.",
"Use the Gemini app to create taglines and social media post drafts that align with their campaign goals and target audience.",
"Create a custom Gem in Gemini Advanced with specific brand guidelines and target audience profiles."
],
correct: 2
},
{
    q: "A human resources department deploys a generative AI (gen AI) model to screen job applications and provide a shortlist of candidates to recruiters. Recruiters notice that some seemingly qualified candidates are consistently being overlooked, but the AI provides no explanation for its rankings or exclusions. The company needs to address this lack of transparency. What should they do?",
options: [
"Collect a larger and more diverse dataset for the gen AI model.",
"Fine-tune the gen AI model.",
"Implement explainable gen AI policies.",
"Develop fairness assessments for the gen AI model."
],
correct: 2
},
{
q: "A company is evaluating the use of large language models (LLMs) to enhance its operations and customer interactions. What is a primary characteristic of LLMs?",
options: [
"LLMs excel in highly specific technical tasks requiring deep, singular domain expertise.",
"LLMs learn and generalize effectively from small datasets for niche applications.",
"LLMs have strong inherent logical reasoning and problem-solving abilities without extra prompting.",
"LLMs are trained on vast datasets, enabling broad language and context understanding, and adaptability across many tasks."
],
correct: 3
},
{
q: "An AI robot learns optimal package delivery routes in a city. It receives positive scores for fast, successful deliveries and negative scores for delays or failures. Through this feedback, the robot improves its navigation over time. What type of machine learning is being used to train the robot?",
options: [
"Supervised learning",
"Deep learning",
"Unsupervised learning",
"Reinforcement learning"
],
correct: 3
},
{
q: "A company wants to use generative AI (gen AI) to automate complex workflows and improve decision-making across its various departments. They are considering implementing AI agents as a key component of their strategy. What is the primary function of an AI agent in a gen AI system?",
options: [
"To provide the computing power for training and running advanced AI models.",
"To be the user interface for interacting with AI models.",
"To be a smart system that can analyze, use tools, and make decisions to reach goals.",
"To be a central storage place for the data that AI models use."
],
correct: 2
},
{
q: "An advertising agency needs to quickly generate many photorealistic images from text for client campaigns because traditional photoshoots are slow and costly. They want to rapidly create high-quality visuals from text and reduce expenses. Which Google foundation model should they use?",
options: [
"Gemini",
"Gemma",
"Veo",
"Imagen"
],
correct: 3
},
{
q: "A company is planning to integrate generative AI into its operations but is wary of becoming dependent on a single technology provider. They prioritize the ability to choose and integrate different AI tools and platforms as their needs evolve. Which inherent characteristic of Google Cloud would address this concern?",
options: [
"Google Cloud's emphasis on an open approach within its AI offerings.",
"Google Cloud's commitment to tightly integrated, proprietary AI solutions",
"Google Cloud's strategy prioritizing fully managed AI services that simplify the user experience",
"Google Cloud's primary focus on automating AI workflows"
],
correct: 0
},
{
q: "A consulting research team needs to analyze multiple lengthy reports and documents to find key trends and make client recommendations. They require a method to quickly understand each document's core findings, link information across sources, and efficiently organize insights for their report. Manual methods are too slow and complex. Which Google Cloud offering should they use?",
options: [
"NotebookLM",
"Gemini app",
"Vertex AI Search",
"Google Workspace with Gemini"
],
correct: 0
},
{
q: "A grocery store chain has data in several internal systems like sales, inventory, and marketing. Employees waste time searching these systems for information on product performance, stock, and campaign effectiveness. They need a central way to easily access and understand data across these systems for better decisions and efficiency. Which Google Cloud offering should they use?",
options: [
"Google Workspace with Gemini",
"Gemini Enterprise",
"Vertex AI Search",
"Conversational Agents"
],
correct: 1
},
{
q: "A tech company has separate teams using different tools for their machine learning projects, causing duplicated work and scaling issues. They need a central platform to manage all their AI development, deployment, and monitoring efficiently. Which Google Cloud offering should they use?",
options: [
"Cloud Functions",
"Vertex AI",
"Gemini Enterprise",
"BigQuery"
],
correct: 1
},
{
q: "A software company's AI chatbot struggles to answer customer questions about recently released features because this information is not in its original training data. Customers are getting inaccurate answers, increasing support agent workload. The company wants the chatbot to use the latest product documentation to give accurate, up-to-date responses without retraining the entire model. Which technique should they use?",
options: [
"Fine-tuning",
"Prompt engineering",
"Retrieval-augmented generation (RAG)",
"Human-in-the-loop (HITL)"
],
correct: 2
},
{
q: "A business analyst asks a generative AI model about the quarterly revenue of a small startup that recently entered the market. The model confidently provides a specific revenue figure and even mentions a supposed press release detailing the company's success. However, after further investigation, the analyst discovers that the startup has not yet released any financial reports, and no such press release exists. The information provided by the AI model is entirely fabricated despite sounding plausible. Which type of large language model limitation does this exemplify?",
options: [
"Bias",
"Knowledge cutoff",
"Data dependency",
"Hallucinations"
],
correct: 3
},
{
q: "A generative AI tool that answers employee policy questions is providing outdated and inaccurate information, causing confusion. The company wants the tool to give reliable answers based on the latest official documents. What should the organization do?",
options: [
"Fine-tune the underlying language model with a broader dataset of general knowledge.",
"Increase the temperature setting of the language model.",
"Implement grounding techniques.",
"Reduce the token count parameter."
],
correct: 2
},
{
q: "A sales team wants to create dynamic and personalized video pitches for potential clients. They receive client information in various formats and need an AI model that can transform this information into engaging video content tailored to each client's specific needs and challenges. Which Google model should they use?",
options: [
"Gemma",
"Gemini",
"Imagen",
"Veo"
],
correct: 3
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
