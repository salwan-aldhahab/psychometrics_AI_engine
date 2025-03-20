// Application state
const state = {
    currentQuestion: 0,
    totalQuestions: 10,
    answers: [],
    results: {},
    previousAnswer: null,
    previousCategory: null,
};

// DOM elements
// ... existing DOM elements code ...

// Event listeners
// ... existing event listener code ...

// Load question data
async function loadQuestion() {
    // Show loader
    document.getElementById("question-card").style.display = "none";
    loaderEl.style.display = "block";

    try {
        // Call the Python backend API
        const response = await fetch("/api/next_question", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                previous_answer: state.previousAnswer,
                previous_category: state.previousCategory,
            }),
        });

        if (!response.ok) {
            throw new Error("API request failed");
        }

        const data = await response.json();

        // Update UI with question data
        categoryEl.textContent = data.category;
        questionEl.textContent = data.question;
        renderChoices(data.choices);

        // Store scores for later use
        state.currentQuestionScores = data.scores;

        // Update progress
        state.currentQuestion++;
        updateProgress();

        // Hide loader and show question
        loaderEl.style.display = "none";
        document.getElementById("question-card").style.display = "block";
    } catch (error) {
        console.error("Error loading question:", error);
        alert("There was an error loading the question. Please try again.");
    }
}

// Handle next question button click
function handleNextQuestion() {
    // Save the selected answer for the next API call
    state.previousAnswer = state.selectedAnswer.text;
    state.previousCategory = state.selectedAnswer.category;

    // Save answer
    state.answers.push(state.selectedAnswer);

    // Store result for the category
    const category = state.selectedAnswer.category;
    if (!state.results[category]) {
        state.results[category] = [];
    }

    // Use scores from the API
    state.results[category].push(
        state.currentQuestionScores[state.selectedAnswer.index]
    );

    // Check if assessment is complete
    if (state.currentQuestion >= state.totalQuestions) {
        showResults();
    } else {
        loadQuestion();
    }
}

// ... rest of your existing code ...
