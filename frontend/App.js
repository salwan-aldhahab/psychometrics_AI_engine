// Mock API for testing the UI
        // Replace this with actual API calls to your Python backend
        const mockApiData = [
            {
                question: "When faced with a critical business decision with incomplete information, how do you typically respond?",
                category: "Decision-Making Under Uncertainty",
                choices: [
                    "Wait until all information is available before deciding",
                    "Make a decision based on available data and adjust later if needed",
                    "Rely primarily on intuition and past experience",
                    "Seek consensus from team members or advisors"
                ]
            },
            {
                question: "How do you respond to business setbacks or failures?",
                category: "Grit and Perseverance",
                choices: [
                    "Take time to recover emotionally before continuing",
                    "Immediately analyze what went wrong and create a new plan",
                    "Pivot to a completely different approach or opportunity",
                    "See it as a learning opportunity and persist with renewed determination"
                ]
            },
            {
                question: "When developing business strategies, which approach best describes you?",
                category: "Strategic Thinking",
                choices: [
                    "Focus on immediate tactical wins that show quick results",
                    "Create detailed long-term plans with specific milestones",
                    "Develop flexible frameworks that can adapt to changing conditions",
                    "Prioritize competitive analysis and positioning against rivals"
                ]
            }
        ];

        // Application state
        const state = {
            currentQuestion: 0,
            totalQuestions: 10,
            answers: [],
            results: {},
            mockQuestionIndex: 0
        };

        // DOM elements
        const introScreen = document.getElementById('intro-screen');
        const assessmentContainer = document.getElementById('assessment-container');
        const resultsContainer = document.getElementById('results-container');
        const progressBar = document.getElementById('progress');
        const currentQuestionEl = document.getElementById('current-question');
        const categoryEl = document.getElementById('category');
        const questionEl = document.getElementById('question');
        const choicesEl = document.getElementById('choices');
        const nextBtn = document.getElementById('next-btn');
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');
        const loaderEl = document.getElementById('loader');
        const resultsListEl = document.getElementById('results-list');
        const resultSummaryTextEl = document.getElementById('result-summary-text');

        // Event listeners
        startBtn.addEventListener('click', startAssessment);
        nextBtn.addEventListener('click', handleNextQuestion);
        restartBtn.addEventListener('click', restartAssessment);

        // Initialize assessment
        function startAssessment() {
            introScreen.style.display = 'none';
            assessmentContainer.style.display = 'block';
            loadQuestion();
        }

        // Load question data
        async function loadQuestion() {
            // Show loader
            document.getElementById('question-card').style.display = 'none';
            loaderEl.style.display = 'block';
            
            try {
                // In a real implementation, this would call your Python backend
                // For now, we'll use mock data
                await simulateApiCall();
                
                const data = getMockQuestionData();
                
                // Update UI with question data
                categoryEl.textContent = data.category;
                questionEl.textContent = data.question;
                renderChoices(data.choices);
                
                // Update progress
                state.currentQuestion++;
                updateProgress();
                
                // Hide loader and show question
                loaderEl.style.display = 'none';
                document.getElementById('question-card').style.display = 'block';
                
            } catch (error) {
                console.error('Error loading question:', error);
                alert('There was an error loading the question. Please try again.');
            }
        }

        // Mock API call - replace with real API in production
        function simulateApiCall() {
            return new Promise(resolve => {
                setTimeout(resolve, 1000);
            });
        }

        // Get mock question data - replace with real data in production
        function getMockQuestionData() {
            const data = mockApiData[state.mockQuestionIndex % mockApiData.length];
            state.mockQuestionIndex++;
            return data;
        }

        // Render choices for the current question
        function renderChoices(choices) {
            choicesEl.innerHTML = '';
            choices.forEach((choice, index) => {
                const choiceEl = document.createElement('div');
                choiceEl.className = 'choice';
                choiceEl.innerHTML = `<div class="choice-text">${choice}</div>`;
                choiceEl.dataset.index = index;
                choiceEl.addEventListener('click', handleChoiceSelection);
                choicesEl.appendChild(choiceEl);
            });
            nextBtn.disabled = true;
        }

        // Handle choice selection
        function handleChoiceSelection(e) {
            // Clear previous selection
            const choices = document.querySelectorAll('.choice');
            choices.forEach(choice => choice.classList.remove('selected'));
            
            // Select current choice
            const selectedChoice = e.currentTarget;
            selectedChoice.classList.add('selected');
            
            // Enable next button
            nextBtn.disabled = false;
            
            // Store selection
            const choiceIndex = parseInt(selectedChoice.dataset.index);
            const choiceText = selectedChoice.querySelector('.choice-text').textContent;
            state.selectedAnswer = {
                index: choiceIndex,
                text: choiceText,
                category: categoryEl.textContent
            };
        }

        // Handle next question button click
        function handleNextQuestion() {
            // Save answer
            state.answers.push(state.selectedAnswer);
            
            // Store result for the category
            const category = state.selectedAnswer.category;
            if (!state.results[category]) {
                state.results[category] = [];
            }
            
            // Mock scores - in production these would come from the API
            state.results[category].push(Math.floor(Math.random() * 4) + 1);
            
            // Check if assessment is complete
            if (state.currentQuestion >= state.totalQuestions) {
                showResults();
            } else {
                loadQuestion();
            }
        }

        // Update progress bar
        function updateProgress() {
            const progress = (state.currentQuestion / state.totalQuestions) * 100;
            progressBar.style.width = `${progress}%`;
            currentQuestionEl.textContent = state.currentQuestion;
        }

        // Show results
        function showResults() {
            assessmentContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            
            // Calculate results
            const calculatedResults = calculateResults();
            
            // Render results
            renderResults(calculatedResults);
            
            // Generate summary (this would be more sophisticated in production)
            generateSummary(calculatedResults);
        }

        // Calculate final results
        function calculateResults() {
            const results = {};
            
            for (const category in state.results) {
                const scores = state.results[category];
                const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
                results[category] = parseFloat((average / 4 * 100).toFixed(1));
            }
            
            return results;
        }

        // Render result bars
        function renderResults(results) {
            resultsListEl.innerHTML = '';
            
            for (const category in results) {
                const score = results[category];
                
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                
                resultItem.innerHTML = `
                    <div class="result-label">${category}</div>
                    <div class="result-bar-container">
                        <div class="result-bar" style="width: ${score}%"></div>
                    </div>
                    <div class="result-value">${score}%</div>
                `;
                
                resultsListEl.appendChild(resultItem);
            }
        }

        // Generate results summary
        function generateSummary(results) {
            // In production, this would be generated by your Python backend
            // Here we're just creating a simple example
            const categories = Object.keys(results);
            const scores = Object.values(results);
            
            const highestScore = Math.max(...scores);
            const lowestScore = Math.min(...scores);
            
            const highestCategory = categories[scores.indexOf(highestScore)];
            const lowestCategory = categories[scores.indexOf(lowestScore)];
            
            resultSummaryTextEl.textContent = `Based on your responses, you demonstrate particular strength in ${highestCategory} (${highestScore}%). You might benefit from developing your capabilities in ${lowestCategory} (${lowestScore}%). Consider how these traits influence your entrepreneurial approach and decision-making.`;
        }

        // Restart assessment
        function restartAssessment() {
            // Reset state
            state.currentQuestion = 0;
            state.answers = [];
            state.results = {};
            state.mockQuestionIndex = 0;
            
            // Reset UI
            resultsContainer.style.display = 'none';
            introScreen.style.display = 'block';
        }